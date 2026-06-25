"use client";

import { useState } from "react";
import type { Profile, Sex } from "../types";

const SEX_OPTIONS: { value: Sex; label: string; emoji: string }[] = [
  { value: "homme", label: "Homme", emoji: "♂️" },
  { value: "femme", label: "Femme", emoji: "♀️" },
  { value: "autre", label: "Autre", emoji: "✦" },
];

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
  const [sex, setSex] = useState<Sex | undefined>(defaults.sex ?? undefined);

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
          Faisons connaissance
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#9595A8",
            marginTop: 6,
          }}
        >
          Ces infos servent à personnaliser ton objectif calorique.
        </p>
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!sex) return;
          const form = new FormData(e.currentTarget);
          onSubmit({
            firstName: String(form.get("firstName")),
            lastName: String(form.get("lastName")),
            age: Number(form.get("age")),
            sex,
          });
        }}
      >
        {/* Prénom / Nom */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="firstName"
              style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}
            >
              Prénom
            </label>
            <input
              id="firstName"
              name="firstName"
              defaultValue={defaults.first_name ?? ""}
              placeholder="Léa"
              required
              className="fu-input"
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label
              htmlFor="lastName"
              style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}
            >
              Nom
            </label>
            <input
              id="lastName"
              name="lastName"
              defaultValue={defaults.last_name ?? ""}
              placeholder="Martin"
              required
              className="fu-input"
            />
          </div>
        </div>

        {/* Âge */}
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <label
            htmlFor="age"
            style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}
          >
            Âge
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="age"
              name="age"
              type="number"
              min={13}
              max={120}
              defaultValue={defaults.age ?? ""}
              placeholder="25"
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
              ans
            </span>
          </div>
        </div>

        {/* Sexe */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#3A3A52" }}>
            Sexe
          </span>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
          >
            {SEX_OPTIONS.map((opt) => {
              const selected = sex === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSex(opt.value)}
                  style={{
                    padding: "14px 8px",
                    borderRadius: 14,
                    border: `2px solid ${selected ? "#1A5CFF" : "#E8E8F0"}`,
                    background: selected ? "#EEF3FF" : "#fff",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 4,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "border-color .15s, background .15s",
                  }}
                >
                  <span style={{ fontSize: 20 }}>{opt.emoji}</span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: selected ? "#1A5CFF" : "#6B6B82",
                      transition: "color .15s",
                    }}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <p style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !sex}
          style={{
            marginTop: 4,
            width: "100%",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background:
              pending || !sex
                ? "#E8E8F0"
                : "linear-gradient(135deg,#FF8540,#FF6B1A)",
            color: pending || !sex ? "#9595A8" : "#fff",
            fontSize: 16,
            fontWeight: 800,
            fontFamily: "inherit",
            cursor: pending || !sex ? "not-allowed" : "pointer",
            letterSpacing: "-.01em",
            boxShadow:
              pending || !sex ? "none" : "0 8px 20px -4px rgba(255,107,26,.4)",
            transition: "background .2s, box-shadow .2s, color .2s",
          }}
        >
          {pending ? "…" : "Continuer"}
        </button>
      </form>
    </div>
  );
}
