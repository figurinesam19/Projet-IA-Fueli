"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { ActivityFrequency, ActivityLevel, Profile } from "../types";

const LEVELS: { value: ActivityLevel; title: string }[] = [
  { value: "aucun", title: "Je ne fais pas de sport" },
  { value: "peu", title: "Je fais un peu de sport" },
  { value: "regulier", title: "Je fais régulièrement du sport" },
];

const FREQUENCIES: { value: ActivityFrequency; label: string }[] = [
  { value: "1-2", label: "1–2 fois / semaine" },
  { value: "3-4", label: "3–4 fois / semaine" },
  { value: "5+", label: "5 fois et plus" },
];

type Props = {
  pending: boolean;
  error: string | null;
  defaults: Partial<Profile>;
  onSubmit: (v: {
    level: ActivityLevel;
    frequency: ActivityFrequency | null;
  }) => void;
};

export function StepActivity({ pending, error, defaults, onSubmit }: Props) {
  const [level, setLevel] = useState<ActivityLevel | undefined>(
    defaults.activity_level ?? undefined,
  );
  const [freq, setFreq] = useState<ActivityFrequency | undefined>(
    defaults.activity_frequency ?? undefined,
  );
  const needsFrequency = level && level !== "aucun";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium">Ton activité physique</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          On affine ton apport calorique selon ton niveau.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!level) return;
          if (needsFrequency && !freq) return;
          onSubmit({ level, frequency: needsFrequency ? freq! : null });
        }}
      >
        <RadioGroup
          value={level}
          onValueChange={(v) => {
            setLevel(v as ActivityLevel);
            if (v === "aucun") setFreq(undefined);
          }}
          className="space-y-2"
        >
          {LEVELS.map((opt) => (
            <Label
              key={opt.value}
              htmlFor={`lvl-${opt.value}`}
              className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-card p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <RadioGroupItem id={`lvl-${opt.value}`} value={opt.value} />
              <span className="text-sm font-medium">{opt.title}</span>
            </Label>
          ))}
        </RadioGroup>

        {needsFrequency && (
          <div className="space-y-2 pt-2">
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Fréquence
            </p>
            <RadioGroup
              value={freq}
              onValueChange={(v) => setFreq(v as ActivityFrequency)}
              className="grid grid-cols-3 gap-2"
            >
              {FREQUENCIES.map((f) => (
                <Label
                  key={f.value}
                  htmlFor={`freq-${f.value}`}
                  className="flex cursor-pointer items-center justify-center rounded-lg border border-border bg-card p-3 text-center text-xs has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                >
                  <RadioGroupItem
                    id={`freq-${f.value}`}
                    value={f.value}
                    className="sr-only"
                  />
                  {f.label}
                </Label>
              ))}
            </RadioGroup>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={pending || !level || (needsFrequency && !freq)}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {pending ? "…" : "Continuer"}
        </Button>
      </form>
    </div>
  );
}
