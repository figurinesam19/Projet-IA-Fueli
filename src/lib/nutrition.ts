/**
 * Calcul des besoins nutritionnels Fueli.
 *
 * 1) Mifflin-St Jeor pour le métabolisme de base (BMR)
 * 2) Multiplicateur d'activité physique → TDEE (Total Daily Energy Expenditure)
 * 3) Ajustement selon l'objectif (perte / masse / équilibre) → kcal cibles
 * 4) Répartition standard des macros : 25% prot / 45% glucides / 30% lipides
 */

import type {
  ActivityFrequency,
  ActivityLevel,
  Goal,
  Sex,
} from "@/app/onboarding/types";

export type DailyTargets = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export type ProfileForCalc = {
  sex: Sex | null;
  age: number | null;
  weight_kg: number | null;
  height_cm: number | null;
  goal: Goal | null;
  activity_level: ActivityLevel | null;
  activity_frequency: ActivityFrequency | null;
};

function bmr(input: {
  sex: Sex;
  age: number;
  weightKg: number;
  heightCm: number;
}): number {
  const base = 10 * input.weightKg + 6.25 * input.heightCm - 5 * input.age;
  if (input.sex === "homme") return base + 5;
  if (input.sex === "femme") return base - 161;
  // "autre" — moyenne pondérée
  return base - 78;
}

function activityMultiplier(
  level: ActivityLevel,
  freq: ActivityFrequency | null,
): number {
  if (level === "aucun") return 1.2;
  if (level === "peu") {
    if (freq === "1-2") return 1.375;
    if (freq === "3-4") return 1.55;
    if (freq === "5+") return 1.725;
    return 1.375;
  }
  // regulier
  if (freq === "1-2") return 1.55;
  if (freq === "3-4") return 1.725;
  if (freq === "5+") return 1.9;
  return 1.55;
}

function goalDelta(goal: Goal): number {
  if (goal === "perte") return -500;
  if (goal === "masse") return +400;
  return 0;
}

export function computeDailyTargets(p: ProfileForCalc): DailyTargets | null {
  if (
    !p.sex ||
    !p.age ||
    !p.weight_kg ||
    !p.height_cm ||
    !p.goal ||
    !p.activity_level
  ) {
    return null;
  }

  const tdee =
    bmr({
      sex: p.sex,
      age: p.age,
      weightKg: Number(p.weight_kg),
      heightCm: Number(p.height_cm),
    }) * activityMultiplier(p.activity_level, p.activity_frequency);

  const kcal = Math.round(tdee + goalDelta(p.goal));

  // Répartition standard 25 / 45 / 30
  const proteinKcal = kcal * 0.25;
  const carbsKcal = kcal * 0.45;
  const fatKcal = kcal * 0.3;

  return {
    kcal,
    proteinG: Math.round(proteinKcal / 4),
    carbsG: Math.round(carbsKcal / 4),
    fatG: Math.round(fatKcal / 9),
  };
}

export type DailyConsumption = {
  kcal: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export function emptyConsumption(): DailyConsumption {
  return { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 };
}
