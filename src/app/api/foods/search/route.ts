import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { searchFoods, type FoodResult } from "@/lib/openfoodfacts";

export const runtime = "nodejs";

async function searchCiqual(
  q: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
): Promise<FoodResult[]> {
  const { data, error } = await supabase
    .from("ciqual_foods")
    .select("id, name, kcal_100g, protein_100g, carbs_100g, fat_100g")
    .ilike("name", `%${q}%`)
    .order("name", { ascending: true })
    .limit(15);

  if (error || !data) return [];

  return data.map(
    (row: {
      id: number;
      name: string;
      kcal_100g: number;
      protein_100g: number;
      carbs_100g: number;
      fat_100g: number;
    }): FoodResult => ({
      code: `ciqual_${row.id}`,
      name: row.name,
      brand: null,
      thumbnailUrl: null,
      kcal_100g: Number(row.kcal_100g),
      protein_100g: Number(row.protein_100g),
      carbs_100g: Number(row.carbs_100g),
      fat_100g: Number(row.fat_100g),
      servingQuantity: null,
    }),
  );
}

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const [ciqualResults, offResults] = await Promise.all([
      searchCiqual(q, supabase),
      searchFoods(q).catch(() => [] as FoodResult[]),
    ]);

    // CIQUAL en premier (aliments génériques fiables), puis OFF (produits emballés)
    const combined = [...ciqualResults, ...offResults].slice(0, 30);
    return NextResponse.json({ results: combined });
  } catch (err) {
    console.error("foods/search error", err);
    return NextResponse.json(
      { error: "Recherche indisponible" },
      { status: 502 },
    );
  }
}
