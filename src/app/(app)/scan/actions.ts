"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ScanItem = {
  name: string;
  quantity_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

export async function saveScannedMeal(input: {
  items: ScanItem[];
  kind: "petit_dejeuner" | "dejeuner" | "diner" | "collation" | null;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  if (!input.items.length) return { error: "Aucun aliment à enregistrer" };

  const totals = input.items.reduce(
    (acc, it) => ({
      kcal: acc.kcal + it.kcal,
      protein_g: acc.protein_g + it.protein_g,
      carbs_g: acc.carbs_g + it.carbs_g,
      fat_g: acc.fat_g + it.fat_g,
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  const { data: meal, error: mealError } = await supabase
    .from("meals")
    .insert({
      user_id: user.id,
      kind: input.kind,
      source: "scan_photo",
      total_kcal: totals.kcal,
      total_protein_g: totals.protein_g,
      total_carbs_g: totals.carbs_g,
      total_fat_g: totals.fat_g,
    })
    .select("id")
    .single();
  if (mealError || !meal) {
    return { error: mealError?.message ?? "Erreur lors de la création du repas" };
  }

  const { error: itemsError } = await supabase.from("meal_items").insert(
    input.items.map((it) => ({
      meal_id: meal.id,
      name: it.name,
      quantity_g: it.quantity_g,
      kcal: it.kcal,
      protein_g: it.protein_g,
      carbs_g: it.carbs_g,
      fat_g: it.fat_g,
    })),
  );
  if (itemsError) {
    // Best-effort cleanup
    await supabase.from("meals").delete().eq("id", meal.id);
    return { error: itemsError.message };
  }

  revalidatePath("/today");
  redirect("/today");
}
