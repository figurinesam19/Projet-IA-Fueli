"use client";

import Link from "next/link";

type Props = {
  pending: boolean;
  error: string | null;
  onSubmit: (email: string, password: string) => void;
};

export function StepAccount({ pending, error, onSubmit }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      <div>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-.03em",
            color: "#1A1A2E",
          }}
        >
          Crée ton compte
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#9595A8",
            marginTop: 6,
          }}
        >
          On commence par ton email et un mot de passe.
        </p>
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          onSubmit(String(form.get("email")), String(form.get("password")));
        }}
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
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            minLength={8}
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
          {pending ? "Création…" : "Continuer"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          fontSize: 14,
          fontWeight: 500,
          color: "#9595A8",
        }}
      >
        Déjà un compte ?{" "}
        <Link
          href="/login"
          style={{ fontWeight: 700, color: "#1A5CFF", textDecoration: "none" }}
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}
