"use client";

import type { Profile } from "../types";

type Props = {
  pending: boolean;
  error: string | null;
  defaults: Partial<Profile>;
  onSubmit: (v: { weightKg: number; heightCm: number }) => void;
};

export function StepMorphology({ pending, error, defaults, onSubmit }: Props) {
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
          Tes mesures
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#9595A8",
            marginTop: 6,
          }}
        >
          Indispensable pour calculer ton objectif calorique journalier.
        </p>
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          const form = new FormData(e.currentTarget);
          onSubmit({
            weightKg: Number(form.get("weightKg")),
            heightCm: Number(form.get("heightCm")),
          });
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            htmlFor="weightKg"
            style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}
          >
            Poids actuel
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="weightKg"
              name="weightKg"
              type="number"
              step="0.1"
              min={30}
              max={300}
              defaultValue={defaults.weight_kg ?? ""}
              placeholder="70"
              required
              className="fu-input"
              style={{ paddingRight: 52 }}
            />
            <span
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 13,
                fontWeight: 700,
                color: "#9595A8",
                pointerEvents: "none",
              }}
            >
              kg
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            htmlFor="heightCm"
            style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}
          >
            Taille
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="heightCm"
              name="heightCm"
              type="number"
              step="0.1"
              min={100}
              max={250}
              defaultValue={defaults.height_cm ?? ""}
              placeholder="170"
              required
              className="fu-input"
              style={{ paddingRight: 52 }}
            />
            <span
              style={{
                position: "absolute",
                right: 16,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 13,
                fontWeight: 700,
                color: "#9595A8",
                pointerEvents: "none",
              }}
            >
              cm
            </span>
          </div>
        </div>

        {/* Petite note rassurante */}
        <div
          style={{
            background: "#EEF3FF",
            borderRadius: 14,
            padding: "12px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: "#3A52A8",
            lineHeight: 1.5,
          }}
        >
          💡 Ces données servent uniquement à calculer ton métabolisme de base
          (formule Mifflin-St Jeor). Elles ne sont jamais partagées.
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
          {pending ? "…" : "Continuer"}
        </button>
      </form>
    </div>
  );
}
