"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  ActivityFrequency,
  ActivityLevel,
  Goal,
  Sex,
} from "@/app/onboarding/types";

export type UpdateProfileInput = {
  first_name: string;
  last_name: string;
  age: number;
  sex: Sex;
  weight_kg: number;
  height_cm: number;
  goal: Goal;
  activity_level: ActivityLevel;
  activity_frequency: ActivityFrequency | null;
};

function validate(input: UpdateProfileInput): string | null {
  if (!input.first_name.trim() || !input.last_name.trim())
    return "Prénom et nom sont requis.";
  if (input.age < 13 || input.age > 120) return "Âge invalide.";
  if (input.weight_kg < 30 || input.weight_kg > 300)
    return "Poids invalide (30 à 300 kg).";
  if (input.height_cm < 100 || input.height_cm > 250)
    return "Taille invalide (100 à 250 cm).";
  if (input.activity_level !== "aucun" && !input.activity_frequency)
    return "Précise ta fréquence d'activité.";
  return null;
}

export async function updateProfile(input: UpdateProfileInput) {
  const error = validate(input);
  if (error) return { error };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non authentifié" };

  const { error: dbError } = await supabase
    .from("profiles")
    .update({
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      age: input.age,
      sex: input.sex,
      weight_kg: input.weight_kg,
      height_cm: input.height_cm,
      goal: input.goal,
      activity_level: input.activity_level,
      activity_frequency:
        input.activity_level === "aucun" ? null : input.activity_frequency,
    })
    .eq("id", user.id);

  if (dbError) return { error: dbError.message };

  revalidatePath("/profile");
  revalidatePath("/today");
  redirect("/profile");
}
