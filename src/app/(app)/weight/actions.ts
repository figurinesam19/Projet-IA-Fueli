"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Aligne `profiles.weight_kg` sur la pesée la plus récente restante, pour que
 * l'objectif calorique (Mifflin-St Jeor) reste cohérent après toute
 * modification de l'historique. Sans pesée, on ne touche pas au profil.
 */
async function syncProfileWeight(supabase: SupabaseClient, userId: string) {
  const { data: latest } = await supabase
    .from("weight_logs")
    .select("weight_kg")
    .eq("user_id", userId)
    .order("logged_on", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (latest) {
    await supabase
      .from("profiles")
      .update({ weight_kg: latest.weight_kg, updated_at: new Date().toISOString() })
      .eq("id", userId);
  }
}

function isValidDay(loggedOn: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(loggedOn)) return false;
  const day = new Date(loggedOn + "T12:00:00");
  if (Number.isNaN(day.getTime())) return false;
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const twoYearsAgo = new Date();
  twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
  return day <= today && day >= twoYearsAgo;
}

/** Ajoute ou modifie la pesée d'un jour donné (upsert sur user_id + logged_on). */
export async function saveWeight(weightKg: number, loggedOn: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  if (!Number.isFinite(weightKg) || weightKg < 30 || weightKg > 300) {
    return { error: "Poids invalide (entre 30 et 300 kg)." };
  }
  if (!isValidDay(loggedOn)) {
    return { error: "Date invalide." };
  }

  const rounded = Math.round(weightKg * 10) / 10;

  const { error } = await supabase.from("weight_logs").upsert(
    { user_id: user.id, weight_kg: rounded, logged_on: loggedOn },
    { onConflict: "user_id,logged_on" },
  );
  if (error) return { error: error.message };

  await syncProfileWeight(supabase, user.id);
  revalidatePath("/weight");
  revalidatePath("/today");
  return { ok: true };
}

/** Supprime la pesée d'un jour donné. */
export async function deleteWeight(loggedOn: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(loggedOn)) return { error: "Date invalide." };

  const { error } = await supabase
    .from("weight_logs")
    .delete()
    .eq("user_id", user.id)
    .eq("logged_on", loggedOn);
  if (error) return { error: error.message };

  await syncProfileWeight(supabase, user.id);
  revalidatePath("/weight");
  revalidatePath("/today");
  return { ok: true };
}
