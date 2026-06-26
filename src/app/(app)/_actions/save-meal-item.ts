"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SaveMealItemInput = {
  source: "recherche" | "code_barre" | "manuel";
  name: string;
  quantity_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  ciqual_code?: string | null;
  off_barcode?: string | null;
  kind?: "petit_dejeuner" | "dejeuner" | "diner" | null;
};

/**
 * Sauvegarde un repas mono-aliment (un repas = un item) issu de la recherche
 * texte ou du code-barre. Pour les scans photo on a un saver dédié qui gère
 * plusieurs items en une fois.
 */
export async function saveMealItem(input: SaveMealItemInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .insert({
      user_id: user.id,
      kind: input.kind ?? null,
      source: input.source,
      total_kcal: input.kcal,
      total_protein_g: input.protein_g,
      total_carbs_g: input.carbs_g,
      total_fat_g: input.fat_g,
    })
    .select("id")
    .single();
  if (mealError || !meal) {
    return { error: mealError?.message ?? "Erreur création repas" };
  }

  const { error: itemError } = await supabase.from("meal_items").insert({
    meal_id: meal.id,
    name: input.name,
    quantity_g: input.quantity_g,
    kcal: input.kcal,
    protein_g: input.protein_g,
    carbs_g: input.carbs_g,
    fat_g: input.fat_g,
    ciqual_code: input.ciqual_code ?? null,
    off_barcode: input.off_barcode ?? null,
  });
  if (itemError) {
    await supabase.from("meals").delete().eq("id", meal.id);
    return { error: itemError.message };
  }

  revalidatePath("/today");
  redirect("/today");
}
