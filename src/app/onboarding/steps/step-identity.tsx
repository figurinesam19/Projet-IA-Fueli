"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { Profile, Sex } from "../types";

type Props = {
  pending: boolean;
  error: string | null;
  defaults: Partial<Profile>;
  onSubmit: (v: {
    firstName: string;
    lastName: string;
    age: number;
    sex: Sex;
  }) => void;
};

export function StepIdentity({ pending, error, defaults, onSubmit }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium">Faisons connaissance</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          On utilise ces infos pour personnaliser ton expérience.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          onSubmit({
            firstName: String(form.get("firstName")),
            lastName: String(form.get("lastName")),
            age: Number(form.get("age")),
            sex: String(form.get("sex")) as Sex,
          });
        }}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName">Prénom</Label>
            <Input
              id="firstName"
              name="firstName"
              defaultValue={defaults.first_name ?? ""}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Nom</Label>
            <Input
              id="lastName"
              name="lastName"
              defaultValue={defaults.last_name ?? ""}
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
            defaultValue={defaults.age ?? ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label>Sexe</Label>
          <RadioGroup
            name="sex"
            defaultValue={defaults.sex ?? undefined}
            required
            className="grid grid-cols-3 gap-2"
          >
            {(["homme", "femme", "autre"] as Sex[]).map((s) => (
              <label
                key={s}
                className="flex items-center justify-center gap-2 rounded-lg border border-border bg-card p-3 text-sm capitalize has-[:checked]:border-primary has-[:checked]:bg-primary/5"
              >
                <RadioGroupItem value={s} className="sr-only" />
                {s}
              </label>
            ))}
          </RadioGroup>
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
