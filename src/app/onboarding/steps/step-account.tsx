"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  pending: boolean;
  error: string | null;
  onSubmit: (email: string, password: string) => void;
};

export function StepAccount({ pending, error, onSubmit }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-medium">Crée ton compte</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          On commence par ton email et un mot de passe.
        </p>
      </div>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          onSubmit(String(form.get("email")), String(form.get("password")));
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
          <p className="text-xs text-muted-foreground">8 caractères minimum.</p>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button
          type="submit"
          disabled={pending}
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {pending ? "Création…" : "Continuer"}
        </Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link href="/login" className="font-medium text-primary">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
