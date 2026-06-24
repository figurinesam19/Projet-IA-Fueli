import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { lookupBarcode } from "@/lib/openfoodfacts";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  ctx: { params: Promise<{ code: string }> },
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { code } = await ctx.params;
  try {
    const product = await lookupBarcode(code);
    if (!product) {
      return NextResponse.json(
        { error: "Produit introuvable" },
        { status: 404 },
      );
    }
    return NextResponse.json({ product });
  } catch (err) {
    console.error("foods/barcode error", err);
    return NextResponse.json(
      { error: "Service indisponible" },
      { status: 502 },
    );
  }
}
