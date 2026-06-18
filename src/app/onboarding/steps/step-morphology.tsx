"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Profile } from "../types";

type Props = {
  pending: boolean;
  error: string | null;
  defaults: Partial<Profile>;
  onSubmit: (v: { weightKg: number; heightCm: number }) => void;
};

export function StepMorphology({ pending, error, defaults, onSubmit }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium">Tes mesures</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Indispensable pour calculer ton objectif calorique journalier.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          onSubmit({
            weightKg: Number(form.get("weightKg")),
            heightCm: Number(form.get("heightCm")),
          });
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="weightKg">Poids actuel (kg)</Label>
          <Input
            id="weightKg"
            name="weightKg"
            type="number"
            step="0.1"
            min={30}
            max={300}
            defaultValue={defaults.weight_kg ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heightCm">Taille (cm)</Label>
          <Input
            id="heightCm"
            name="heightCm"
            type="number"
            step="0.1"
            min={100}
            max={250}
            defaultValue={defaults.height_cm ?? ""}
            required
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {pending ? "…" : "Continuer"}
        </Button>
      </form>
    </div>
  );
}
