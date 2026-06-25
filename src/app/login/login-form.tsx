"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

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
    </form>
  );
}
