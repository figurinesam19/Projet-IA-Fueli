"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function updateMealKind(
  mealId: string,
  kind: "petit_dejeuner" | "dejeuner" | "diner" | "collation" | null,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase
    .from("meals")
    .update({ kind })
    .eq("id", mealId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/meal/${mealId}`);
}

export async function deleteMealItem(mealId: string, itemId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error } = await supabase
    .from("meal_items")
    .delete()
    .eq("id", itemId)
    .eq("meal_id", mealId);

  if (error) return { error: error.message };

  // Recalcule les totaux du repas
  const { data: remaining } = await supabase
    .from("meal_items")
    .select("kcal, protein_g, carbs_g, fat_g")
    .eq("meal_id", mealId);

  const totals = (remaining ?? []).reduce(
    (acc, it) => ({
      kcal: acc.kcal + Number(it.kcal),
      protein_g: acc.protein_g + Number(it.protein_g),
      carbs_g: acc.carbs_g + Number(it.carbs_g),
      fat_g: acc.fat_g + Number(it.fat_g),
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  await supabase
    .from("meals")
    .update({
      total_kcal: totals.kcal,
      total_protein_g: totals.protein_g,
      total_carbs_g: totals.carbs_g,
      total_fat_g: totals.fat_g,
    })
    .eq("id", mealId)
    .eq("user_id", user.id);

  revalidatePath(`/meal/${mealId}`);
  revalidatePath("/today");
}

export async function deleteMeal(mealId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  await supabase.from("meal_items").delete().eq("meal_id", mealId);

  const { error } = await supabase
    .from("meals")
    .delete()
    .eq("id", mealId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/today");
  redirect("/today");
}
