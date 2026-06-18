import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Analyse d'une photo de repas via GPT-4o Mini (vision).
 *
 * Confidentialité : l'image n'est PAS stockée. Elle est encodée en base64,
 * envoyée à OpenAI pour analyse, puis libérée. Seul le JSON retourné
 * (aliments + macros) sera ensuite enregistré côté Supabase si l'utilisateur
 * confirme.
 */

const SYSTEM_PROMPT = `Tu es un nutritionniste expert qui analyse les photos de repas.

Analyse la photo et identifie chaque aliment visible. Pour CHAQUE aliment, estime :
- une quantité en grammes (sois réaliste, observe la taille de l'assiette/plat)
- les calories (kcal)
- les protéines (g)
- les glucides (g)
- les lipides (g)

Utilise les valeurs nutritionnelles standards (référentiel CIQUAL).
Si la photo n'est pas un repas ou est inanalysable, retourne items: [] et confidence: "low".

Réponds UNIQUEMENT en JSON conforme au schéma fourni.`;

const RESPONSE_SCHEMA = {
  name: "meal_analysis",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            name: { type: "string" },
            quantity_g: { type: "number" },
            kcal: { type: "number" },
            protein_g: { type: "number" },
            carbs_g: { type: "number" },
            fat_g: { type: "number" },
          },
          required: ["name", "quantity_g", "kcal", "protein_g", "carbs_g", "fat_g"],
        },
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
      },
    },
    required: ["items", "confidence"],
  },
} as const;

export async function POST(request: Request) {
  // Auth
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // Body
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }
  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json({ error: "Image manquante" }, { status: 400 });
  }
  if (image.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image trop volumineuse (max 5 Mo)" },
      { status: 413 },
    );
  }

  // Conversion en base64 data URL
  const bytes = await image.arrayBuffer();
  const base64 = Buffer.from(bytes).toString("base64");
  const dataUrl = `data:${image.type || "image/jpeg"};base64,${base64}`;

  // Appel OpenAI
  let parsed: {
    items: Array<{
      name: string;
      quantity_g: number;
      kcal: number;
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    }>;
    confidence: "high" | "medium" | "low";
  };
  try {
    const completion = await openai().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyse ce repas." },
            { type: "image_url", image_url: { url: dataUrl, detail: "low" } },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: RESPONSE_SCHEMA,
      },
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Réponse vide");
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error("scan: OpenAI error", err);
    const message =
      err instanceof Error ? err.message : "Erreur d'analyse";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  return NextResponse.json(parsed);
}
