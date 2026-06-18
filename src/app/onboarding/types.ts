export type Sex = "homme" | "femme" | "autre";
export type Goal = "perte" | "masse" | "equilibre";
export type ActivityLevel = "aucun" | "peu" | "regulier";
export type ActivityFrequency = "1-2" | "3-4" | "5+";

export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  age: number | null;
  sex: Sex | null;
  weight_kg: number | null;
  height_cm: number | null;
  goal: Goal | null;
  activity_level: ActivityLevel | null;
  activity_frequency: ActivityFrequency | null;
  rgpd_consent_at: string | null;
  onboarding_step: number;
  onboarding_completed_at: string | null;
};

export const TOTAL_STEPS = 6;
