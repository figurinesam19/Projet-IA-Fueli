"use client";

import { useState, useTransition } from "react";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { CheckCircle2 } from "lucide-react";

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
      <div
        className="animate-fade-up"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 14,
          textAlign: "center",
          background: "#F0FDF4",
          border: "1.5px solid rgba(5,150,105,.2)",
          borderRadius: 20,
          padding: "28px 22px",
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#DCFCE7",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <CheckCircle2 size={30} color="#059669" strokeWidth={2.2} />
        </div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 800, color: "#065F46" }}>
            E-mail envoyé
          </p>
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              color: "#3F7A63",
              marginTop: 6,
              lineHeight: 1.55,
            }}
          >
            Si un compte existe avec cette adresse, tu vas recevoir un lien pour
            choisir un nouveau mot de passe. Pense à vérifier tes spams.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 14 }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label
          htmlFor="email"
          style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}
        >
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="toi@email.com"
          required
          autoFocus
          className="fu-input"
        />
      </div>

      {error && (
        <p style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: 4,
          width: "100%",
          padding: "16px",
          borderRadius: 16,
          border: "none",
          background: pending
            ? "#E8E8F0"
            : "linear-gradient(135deg,#FF8540,#FF6B1A)",
          color: pending ? "#9595A8" : "#fff",
          fontSize: 16,
          fontWeight: 800,
          fontFamily: "inherit",
          cursor: pending ? "not-allowed" : "pointer",
          letterSpacing: "-.01em",
          boxShadow: pending ? "none" : "0 8px 20px -4px rgba(255,107,26,.4)",
          transition: "background .2s, box-shadow .2s, color .2s",
        }}
      >
        {pending ? "Envoi…" : "Envoyer le lien"}
      </button>
    </form>
  );
}
