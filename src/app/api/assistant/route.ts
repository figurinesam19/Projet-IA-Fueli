import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Assistant « il te reste X » — suggestion IA de repas.
 *
 * Reçoit le restant du jour (kcal + macros), l'objectif et ce qui a déjà été
 * mangé, et demande à GPT-4o Mini UNE idée de repas réaliste qui rentre dans
 * l'enveloppe. Appelé à la demande uniquement (bouton), jamais en automatique :
 * zéro latence et zéro coût sur le simple affichage du dashboard.
 */

const SYSTEM_PROMPT = `Tu es le coach nutrition de Fueli, une app française qui aide à comprendre ce qu'on mange (pas de régime, pas de culpabilisation). Ton ton : complice, direct, tutoiement.

On te donne ce qu'il reste à manger aujourd'hui (calories et macros), l'objectif de la personne, le moment de la journée et ce qu'elle a déjà mangé.

Propose UN seul repas ou encas :
- réaliste et simple à préparer ou à trouver en France (pas de recette de chef) ;
- adapté au moment de la journée ;
- qui tient dans les calories restantes (vise 50-90 % du restant s'il reste un repas à venir, sans jamais dépasser) ;
- qui aide à combler le retard de protéines si c'est le cas — c'est souvent LE point faible ;
- différent de ce qui a déjà été mangé aujourd'hui.

Si le restant est très faible (< 250 kcal), propose un encas léger plutôt qu'un repas.
Estime les macros avec les valeurs CIQUAL standards. Réponds UNIQUEMENT en JSON conforme au schéma.`;

const RESPONSE_SCHEMA = {
  name: "meal_suggestion",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    properties: {
      title: {
        type: "string",
        description: "Nom court et appétissant du plat (max 6 mots, sans emoji)",
      },
      emoji: {
        type: "string",
        description: "Un seul emoji qui représente le plat",
      },
      description: {
        type: "string",
        description:
          "Composition en une phrase courte (ex : « 150 g de poulet, 200 g de riz, courgettes »)",
      },
      kcal: { type: "number", description: "Calories estimées du plat" },
      protein_g: { type: "number", description: "Protéines estimées (g)" },
      reason: {
        type: "string",
        description:
          "Pourquoi ce plat maintenant, en une phrase complice (max 100 caractères, tutoiement)",
      },
    },
    required: ["title", "emoji", "description", "kcal", "protein_g", "reason"],
  },
} as const;

const GOAL_LABEL: Record<string, string> = {
  perte: "perte de poids",
  masse: "prise de masse",
  equilibre: "équilibre / maintien",
};

function momentLabel(hour: number): string {
  if (hour < 11) return "le matin";
  if (hour < 14) return "le midi";
  if (hour < 18) return "l'après-midi";
  return "le soir";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  let body: {
    remaining?: { kcal?: number; proteinG?: number; carbsG?: number; fatG?: number };
    goal?: string;
    hour?: number;
    eaten?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Body invalide" }, { status: 400 });
  }

  const remaining = body.remaining;
  if (
    !remaining ||
    typeof remaining.kcal !== "number" ||
    typeof remaining.proteinG !== "number"
  ) {
    return NextResponse.json({ error: "Restant manquant" }, { status: 400 });
  }
  if (remaining.kcal < 100) {
    return NextResponse.json(
      { error: "Objectif quasiment atteint, rien à suggérer." },
      { status: 400 },
    );
  }

  const hour =
    typeof body.hour === "number" && body.hour >= 0 && body.hour <= 23
      ? body.hour
      : 12;
  const eaten = (body.eaten ?? [])
    .filter((e): e is string => typeof e === "string")
    .slice(0, 20);

  const userMessage = [
    `Moment : ${momentLabel(hour)} (il est ${hour}h).`,
    `Objectif : ${GOAL_LABEL[body.goal ?? ""] ?? "non renseigné"}.`,
    `Restant aujourd'hui : ${Math.round(remaining.kcal)} kcal, ${Math.round(remaining.proteinG)} g de protéines` +
      (typeof remaining.carbsG === "number" && typeof remaining.fatG === "number"
        ? `, ${Math.round(remaining.carbsG)} g de glucides, ${Math.round(remaining.fatG)} g de lipides.`
        : "."),
    eaten.length > 0
      ? `Déjà mangé aujourd'hui : ${eaten.join(", ")}.`
      : "Rien de scanné aujourd'hui pour l'instant.",
  ].join("\n");

  try {
    const completion = await openai().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      response_format: { type: "json_schema", json_schema: RESPONSE_SCHEMA },
      // Un peu de variété : deux clics ne donnent pas deux fois le même plat
      temperature: 0.9,
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) throw new Error("Réponse vide");
    return NextResponse.json(JSON.parse(raw));
  } catch (err) {
    console.error("assistant: OpenAI error", err);
    return NextResponse.json({ error: "Suggestion indisponible" }, { status: 502 });
  }
}
