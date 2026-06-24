/**
 * Helpers Open Food Facts (OFF).
 * On utilise le sous-domaine FR pour des résultats localisés.
 * OFF demande un User-Agent identifiable — à personnaliser quand le domaine sera fixé.
 */

const OFF_BASE = "https://fr.openfoodfacts.org";
const USER_AGENT = "Fueli/0.1 (https://fueli.app)";
const FIELDS = [
  "code",
  "product_name",
  "product_name_fr",
  "generic_name_fr",
  "brands",
  "image_thumb_url",
  "image_small_url",
  "nutriments",
  "serving_quantity",
  "quantity",
].join(",");

export type FoodResult = {
  code: string;
  name: string;
  brand: string | null;
  thumbnailUrl: string | null;
  kcal_100g: number;
  protein_100g: number;
  carbs_100g: number;
  fat_100g: number;
  servingQuantity: number | null; // grammes par portion si dispo
};

type OFFNutriments = {
  "energy-kcal_100g"?: number;
  "energy-kj_100g"?: number;
  proteins_100g?: number;
  carbohydrates_100g?: number;
  fat_100g?: number;
};

type OFFProduct = {
  code: string;
  product_name?: string;
  product_name_fr?: string;
  generic_name_fr?: string;
  brands?: string;
  image_thumb_url?: string;
  image_small_url?: string;
  nutriments?: OFFNutriments;
  serving_quantity?: string | number;
};

function pickKcal(n: OFFNutriments | undefined): number | null {
  if (!n) return null;
  if (typeof n["energy-kcal_100g"] === "number") return n["energy-kcal_100g"];
  if (typeof n["energy-kj_100g"] === "number")
    return Math.round(n["energy-kj_100g"] / 4.184);
  return null;
}

function toResult(p: OFFProduct): FoodResult | null {
  const kcal = pickKcal(p.nutriments);
  const name = p.product_name_fr || p.product_name || p.generic_name_fr;
  if (!name || kcal == null) return null;
  const protein = p.nutriments?.proteins_100g ?? 0;
  const carbs = p.nutriments?.carbohydrates_100g ?? 0;
  const fat = p.nutriments?.fat_100g ?? 0;
  const serving =
    typeof p.serving_quantity === "number"
      ? p.serving_quantity
      : typeof p.serving_quantity === "string"
        ? Number(p.serving_quantity) || null
        : null;
  return {
    code: p.code,
    name,
    brand: p.brands ?? null,
    thumbnailUrl: p.image_thumb_url ?? p.image_small_url ?? null,
    kcal_100g: kcal,
    protein_100g: protein,
    carbs_100g: carbs,
    fat_100g: fat,
    servingQuantity: serving,
  };
}

export async function searchFoods(query: string): Promise<FoodResult[]> {
  const q = query.trim();
  if (q.length < 2) return [];

  const url = new URL(`${OFF_BASE}/api/v2/search`);
  url.searchParams.set("search_terms", q);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("page_size", "20");
  url.searchParams.set("sort_by", "popularity_key");
  url.searchParams.set("lc", "fr");

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    // Cache léger : OFF est lent mais on évite de re-fetcher la même requête en boucle
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`OFF search ${res.status}`);
  const json = (await res.json()) as { products?: OFFProduct[] };
  return (json.products ?? [])
    .map(toResult)
    .filter((r): r is FoodResult => r !== null);
}

export async function lookupBarcode(code: string): Promise<FoodResult | null> {
  const clean = code.replace(/\D/g, "");
  if (clean.length < 8 || clean.length > 14) return null;

  const url = new URL(`${OFF_BASE}/api/v2/product/${clean}`);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("lc", "fr");

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error(`OFF barcode ${res.status}`);
  const json = (await res.json()) as {
    status?: number;
    product?: OFFProduct;
  };
  if (!json.product || json.status !== 1) return null;
  return toResult(json.product);
}

export function computeMacrosForQuantity(
  food: FoodResult,
  quantityG: number,
): {
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
} {
  const r = quantityG / 100;
  return {
    kcal: Math.round(food.kcal_100g * r),
    protein_g: Math.round(food.protein_100g * r * 10) / 10,
    carbs_g: Math.round(food.carbs_100g * r * 10) / 10,
    fat_g: Math.round(food.fat_100g * r * 10) / 10,
  };
}
