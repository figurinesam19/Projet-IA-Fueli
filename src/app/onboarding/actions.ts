"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type {
  ActivityFrequency,
  ActivityLevel,
  Goal,
  Sex,
} from "./types";

async function getUserOrThrow() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");
  return { supabase, user };
}

export async function saveIdentity(input: {
  firstName: string;
  lastName: string;
  age: number;
  sex: Sex;
}) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      age: input.age,
      sex: input.sex,
      onboarding_step: 3,
    })
    .eq("id", user.id);
  if (error) return { error: error.message };
  return { ok: true as const };
}

export async function saveMorphology(input: {
  weightKg: number;
  heightCm: number;
}) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("profiles")
    .update({
      weight_kg: input.weightKg,
      height_cm: input.heightCm,
      onboarding_step: 4,
    })
    .eq("id", user.id);
  if (error) return { error: error.message };
  return { ok: true as const };
}

export async function saveGoal(input: { goal: Goal }) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("profiles")
    .update({ goal: input.goal, onboarding_step: 5 })
    .eq("id", user.id);
  if (error) return { error: error.message };
  return { ok: true as const };
}

export async function saveActivity(input: {
  level: ActivityLevel;
  frequency: ActivityFrequency | null;
}) {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("profiles")
    .update({
      activity_level: input.level,
      activity_frequency: input.level === "aucun" ? null : input.frequency,
      onboarding_step: 6,
    })
    .eq("id", user.id);
  if (error) return { error: error.message };
  return { ok: true as const };
}

export async function completeOnboarding() {
  const { supabase, user } = await getUserOrThrow();
  const { error } = await supabase
    .from("profiles")
    .update({
      rgpd_consent_at: new Date().toISOString(),
      onboarding_completed_at: new Date().toISOString(),
      onboarding_step: 7,
    })
    .eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect("/today");
}
