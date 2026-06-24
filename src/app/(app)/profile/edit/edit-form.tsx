"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  ActivityFrequency,
  ActivityLevel,
  Goal,
  Profile,
  Sex,
} from "@/app/onboarding/types";
import { updateProfile, type UpdateProfileInput } from "./actions";

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "autre", label: "Autre" },
];

const GOAL_OPTIONS: { value: Goal; label: string }[] = [
  { value: "perte", label: "Perte de poids" },
  { value: "masse", label: "Prise de masse" },
  { value: "equilibre", label: "Équilibre" },
];

const LEVEL_OPTIONS: { value: ActivityLevel; label: string }[] = [
  { value: "aucun", label: "Je ne fais pas de sport" },
  { value: "peu", label: "Je fais un peu de sport" },
  { value: "regulier", label: "Je fais régulièrement du sport" },
];

const FREQ_OPTIONS: { value: ActivityFrequency; label: string }[] = [
  { value: "1-2", label: "1–2 / sem." },
  { value: "3-4", label: "3–4 / sem." },
  { value: "5+", label: "5 et +" },
];

type Props = { profile: Profile };

export function EditForm({ profile }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<ActivityLevel>(
    (profile.activity_level as ActivityLevel) ?? "aucun",
  );
  const [freq, setFreq] = useState<ActivityFrequency | null>(
    (profile.activity_frequency as ActivityFrequency) ?? null,
  );
  const needsFrequency = level !== "aucun";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);

    const input: UpdateProfileInput = {
      first_name: String(form.get("first_name")),
      last_name: String(form.get("last_name")),
      age: Number(form.get("age")),
      sex: String(form.get("sex")) as Sex,
      weight_kg: Number(form.get("weight_kg")),
      height_cm: Number(form.get("height_cm")),
      goal: String(form.get("goal")) as Goal,
      activity_level: level,
      activity_frequency: needsFrequency ? freq : null,
    };

    start(async () => {
      const result = await updateProfile(input);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 p-5">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Profil
      </Link>

      <header>
        <h1 className="text-[22px] font-medium">Modifier mon profil</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tes données nutritionnelles sont recalculées automatiquement.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-6">
        <fieldset className="space-y-3">
          <legend className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Identité
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="first_name">Prénom</Label>
              <Input
                id="first_name"
                name="first_name"
                defaultValue={profile.first_name ?? ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Nom</Label>
              <Input
                id="last_name"
                name="last_name"
                defaultValue={profile.last_name ?? ""}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="age">Âge</Label>
            <Input
              id="age"
              name="age"
              type="number"
              min={13}
              max={120}
              defaultValue={profile.age ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Sexe</Label>
            <RadioGroup
              name="sex"
              defaultValue={profile.sex ?? undefined}
              className="grid grid-cols-3 gap-2"
              required
            >
              {SEX_OPTIONS.map((o) => (
                <label
                  key={o.value}
                  className="flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card p-3 text-sm has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem value={o.value} className="sr-only" />
                  {o.label}
                </label>
              ))}
            </RadioGroup>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Morphologie
          </legend>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label htmlFor="weight_kg">Poids (kg)</Label>
              <Input
                id="weight_kg"
                name="weight_kg"
                type="number"
                step="0.1"
                min={30}
                max={300}
                defaultValue={profile.weight_kg ?? ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height_cm">Taille (cm)</Label>
              <Input
                id="height_cm"
                name="height_cm"
                type="number"
                step="0.1"
                min={100}
                max={250}
                defaultValue={profile.height_cm ?? ""}
                required
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Objectif
          </legend>
          <RadioGroup
            name="goal"
            defaultValue={profile.goal ?? undefined}
            className="space-y-2"
            required
          >
            {GOAL_OPTIONS.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={o.value} />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </RadioGroup>
        </fieldset>

        <fieldset className="space-y-3">
          <legend className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            Activité physique
          </legend>
          <RadioGroup
            value={level}
            onValueChange={(v) => {
              setLevel(v as ActivityLevel);
              if (v === "aucun") setFreq(null);
            }}
            className="space-y-2"
          >
            {LEVEL_OPTIONS.map((o) => (
              <label
                key={o.value}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-3 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={o.value} />
                <span className="text-sm font-medium">{o.label}</span>
              </label>
            ))}
          </RadioGroup>

          {needsFrequency && (
            <div className="space-y-2 pt-1">
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Fréquence
              </p>
              <RadioGroup
                value={freq ?? undefined}
                onValueChange={(v) => setFreq(v as ActivityFrequency)}
                className="grid grid-cols-3 gap-2"
              >
                {FREQ_OPTIONS.map((o) => (
                  <label
                    key={o.value}
                    className="flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card p-3 text-center text-xs has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                  >
                    <RadioGroupItem value={o.value} className="sr-only" />
                    {o.label}
                  </label>
                ))}
              </RadioGroup>
            </div>
          )}
        </fieldset>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="flex gap-2">
          <Link
            href="/profile"
            className="flex-1 rounded-lg border border-border bg-card py-3 text-center text-sm font-medium text-foreground hover:bg-muted"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={pending}
            className="flex-1 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
          >
            {pending ? "Enregistrement…" : "Enregistrer"}
          </button>
        </div>
      </form>
    </main>
  );
}
