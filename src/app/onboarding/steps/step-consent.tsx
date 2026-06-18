"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

type Props = {
  pending: boolean;
  error: string | null;
  onSubmit: () => void;
};

export function StepConsent({ pending, error, onSubmit }: Props) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium">Dernière étape</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          On a besoin de ton accord pour traiter tes données de santé.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked) return;
          onSubmit();
        }}
      >
        <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4">
          <Checkbox
            checked={checked}
            onCheckedChange={(v) => setChecked(v === true)}
            className="mt-0.5"
          />
          <span className="text-sm leading-relaxed">
            J&apos;accepte que mes données de santé soient traitées par Fueli
            conformément à la{" "}
            <Link
              href="/legal/privacy"
              className="font-medium text-primary underline-offset-4 hover:underline"
              target="_blank"
            >
              politique de confidentialité
            </Link>
            .
          </span>
        </label>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={pending || !checked}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {pending ? "Finalisation…" : "Terminer l'inscription"}
        </Button>
      </form>
    </div>
  );
}
