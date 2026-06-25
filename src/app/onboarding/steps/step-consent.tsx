"use client";

import Link from "next/link";
import { useState } from "react";

type Props = {
  pending: boolean;
  error: string | null;
  onSubmit: () => void;
};

export function StepConsent({ pending, error, onSubmit }: Props) {
  const [checked, setChecked] = useState(false);

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
          Dernière étape 🎉
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#9595A8",
            marginTop: 6,
          }}
        >
          On a besoin de ton accord pour traiter tes données de santé.
        </p>
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!checked) return;
          onSubmit();
        }}
      >
        {/* Bloc consentement cliquable */}
        <button
          type="button"
          onClick={() => setChecked((c) => !c)}
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 14,
            padding: "18px",
            borderRadius: 18,
            border: `2px solid ${checked ? "#1A5CFF" : "#E8E8F0"}`,
            background: checked ? "#EEF3FF" : "#fff",
            width: "100%",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "inherit",
            transition: "border-color .15s, background .15s",
          }}
        >
          {/* Checkbox custom */}
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              border: `2px solid ${checked ? "#1A5CFF" : "#D4D4E0"}`,
              background: checked ? "#1A5CFF" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
              transition: "border-color .15s, background .15s",
            }}
          >
            {checked && (
              <svg
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
              >
                <path
                  d="M1 4L4.5 7.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <span
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#3A3A52",
              lineHeight: 1.55,
            }}
          >
            J&apos;accepte les{" "}
            <Link
              href="/legal/terms"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontWeight: 700,
                color: "#1A5CFF",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Conditions Générales d&apos;Utilisation
            </Link>{" "}
            et que mes données de santé soient traitées conformément à la{" "}
            <Link
              href="/legal/privacy"
              target="_blank"
              onClick={(e) => e.stopPropagation()}
              style={{
                fontWeight: 700,
                color: "#1A5CFF",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              politique de confidentialité
            </Link>
            .
          </span>
        </button>

        {/* Garantie RGPD */}
        <div
          style={{
            background: "#F7F8FC",
            borderRadius: 14,
            padding: "12px 14px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span style={{ fontSize: 20 }}>🔒</span>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#6B6B82",
              lineHeight: 1.5,
            }}
          >
            Tes données sont hébergées en Europe. Elles ne sont jamais vendues
            ni partagées.
          </p>
        </div>

        {error && (
          <p style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !checked}
          style={{
            marginTop: 4,
            width: "100%",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background:
              pending || !checked
                ? "#E8E8F0"
                : "linear-gradient(135deg,#FF8540,#FF6B1A)",
            color: pending || !checked ? "#9595A8" : "#fff",
            fontSize: 16,
            fontWeight: 800,
            fontFamily: "inherit",
            cursor: pending || !checked ? "not-allowed" : "pointer",
            letterSpacing: "-.01em",
            boxShadow:
              pending || !checked
                ? "none"
                : "0 8px 20px -4px rgba(255,107,26,.4)",
            transition: "background .2s, box-shadow .2s, color .2s",
          }}
        >
          {pending ? "Finalisation…" : "Terminer l'inscription"}
        </button>
      </form>
    </div>
  );
}
