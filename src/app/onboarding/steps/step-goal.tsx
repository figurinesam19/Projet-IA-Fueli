"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Goal, Profile } from "../types";

const OPTIONS: { value: Goal; title: string; desc: string }[] = [
  { value: "perte", title: "Perte de poids", desc: "Déficit calorique modéré" },
  { value: "masse", title: "Prise de masse", desc: "Surplus calorique" },
  {
    value: "equilibre",
    title: "Équilibre alimentaire",
    desc: "Maintenir mon poids",
  },
];

type Props = {
  pending: boolean;
  error: string | null;
  defaults: Partial<Profile>;
  onSubmit: (v: { goal: Goal }) => void;
};

export function StepGoal({ pending, error, defaults, onSubmit }: Props) {
  const [goal, setGoal] = useState<Goal | undefined>(defaults.goal ?? undefined);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium">Ton objectif</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          On adapte ton apport calorique en fonction.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!goal) return;
          onSubmit({ goal });
        }}
      >
        <RadioGroup
          value={goal}
          onValueChange={(v) => setGoal(v as Goal)}
          className="space-y-2"
        >
          {OPTIONS.map((opt) => (
            <Label
              key={opt.value}
              htmlFor={`goal-${opt.value}`}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <RadioGroupItem
                id={`goal-${opt.value}`}
                value={opt.value}
                className="mt-0.5"
              />
              <div>
                <div className="text-sm font-medium">{opt.title}</div>
                <div className="text-xs text-muted-foreground">{opt.desc}</div>
              </div>
            </Label>
          ))}
        </RadioGroup>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={pending || !goal}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {pending ? "…" : "Continuer"}
        </Button>
      </form>
    </div>
  );
}
