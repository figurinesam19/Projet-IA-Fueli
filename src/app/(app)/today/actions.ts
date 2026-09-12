"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Enregistre la pesée du jour (écrase si déjà saisie aujourd'hui) et met à
 * jour le poids du profil pour que l'objectif calorique (Mifflin-St Jeor)
 * se recalcule automatiquement.
 */
export async function logWeight(weightKg: number) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 300) {
    return { error: "Poids invalide (entre 30 et 300 kg)." };
  }

  const rounded = Math.round(weightKg * 10) / 10;

  const { error: logError } = await supabase.from("weight_logs").upsert(
    {
      user_id: user.id,
      weight_kg: rounded,
      logged_on: new Date().toISOString().slice(0, 10),
    },
    { onConflict: "user_id,logged_on" },
  );
  if (logError) return { error: logError.message };

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ weight_kg: rounded, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (profileError) return { error: profileError.message };

  revalidatePath("/today");
  return { ok: true };
}
