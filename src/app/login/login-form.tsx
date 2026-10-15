"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ScanFace } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { saveCredentials } from "@/lib/credentials";

// L'API passkey de Supabase est encore expérimentale et pas toujours typée.
type PasskeySignIn = {
  signInWithPasskey: () => Promise<{ error: { message: string } | null }>;
};

export function LoginForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [supportsPasskey, setSupportsPasskey] = useState(false);

  useEffect(() => {
    setSupportsPasskey(
      typeof window !== "undefined" &&
        typeof window.PublicKeyCredential !== "undefined",
    );
  }, []);

  function onPasskey() {
    setError(null);
    start(async () => {
      const supabase = createClient();
      const auth = supabase.auth as unknown as PasskeySignIn;
      const { error } = await auth.signInWithPasskey();
      if (error) {
        setError("Connexion par Face ID impossible. Utilise ton mot de passe.");
        return;
      }
      router.replace("/");
      router.refresh();
    });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setError(null);
    start(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setError("Email ou mot de passe incorrect.");
        return;
      }
      await saveCredentials(email, password);
      router.replace("/");
      router.refresh();
    });
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
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="toi@email.com"
          required
          className="fu-input"
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <label
          htmlFor="password"
          style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}
        >
          Mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
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
        {pending ? "Connexion…" : "Se connecter"}
      </button>

      {supportsPasskey && (
        <>
          {/* Séparateur « ou » */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "4px 0" }}>
            <span style={{ flex: 1, height: 1, background: "#E8E8F0" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#C4C4D1" }}>ou</span>
            <span style={{ flex: 1, height: 1, background: "#E8E8F0" }} />
          </div>

          <button
            type="button"
            onClick={onPasskey}
            disabled={pending}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: 16,
              border: "1.5px solid #E8E8F0",
              background: "#fff",
              color: "#1A1A2E",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 9,
              boxShadow: "0 4px 12px rgba(26,26,46,.05)",
            }}
          >
            <ScanFace size={18} color="#1A5CFF" />
            Se connecter avec Face ID
          </button>
        </>
      )}
    </form>
  );
}
