"use client";

import { useState, useTransition } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotForm() {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim();
    setError(null);
    start(async () => {
      // Client dédié en flow "implicit" : le lien email contiendra directement
      // les jetons de session (hash #access_token=…) au lieu d'un code PKCE.
      // Indispensable car le lien est souvent ouvert dans un autre navigateur
      // que celui qui a fait la demande (PWA → app Mail), où le code verifier
      // PKCE n'existe pas.
      // ATTENTION : createBrowserClient de @supabase/ssr écrase flowType avec
      // "pkce" quoi qu'on lui passe — il faut donc @supabase/supabase-js
      // directement, qui respecte les options.
      const supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          auth: {
            flowType: "implicit",
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          },
        },
      );
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setSent(true);
    });
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 text-sm">
        <p className="font-medium">Email envoyé ✉️</p>
        <p className="mt-1 text-muted-foreground">
          Si un compte existe avec cette adresse, tu vas recevoir un lien pour
          choisir un nouveau mot de passe. Pense à vérifier ton dossier spam.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
      >
        {pending ? "Envoi…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
