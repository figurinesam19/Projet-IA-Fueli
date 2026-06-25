"use client";

import { useState } from "react";
import type { ActivityFrequency, ActivityLevel, Profile } from "../types";

const LEVELS: {
  value: ActivityLevel;
  emoji: string;
  title: string;
}[] = [
  { value: "aucun", emoji: "🛋️", title: "Je ne fais pas de sport" },
  { value: "peu", emoji: "🚶", title: "Je fais un peu de sport" },
  { value: "regulier", emoji: "🏋️", title: "Je fais régulièrement du sport" },
];

const FREQUENCIES: { value: ActivityFrequency; label: string }[] = [
  { value: "1-2", label: "1–2×\n/ semaine" },
  { value: "3-4", label: "3–4×\n/ semaine" },
  { value: "5+", label: "5×+\n/ semaine" },
];

type Props = {
  pending: boolean;
  error: string | null;
  defaults: Partial<Profile>;
  onSubmit: (v: {
    level: ActivityLevel;
    frequency: ActivityFrequency | null;
  }) => void;
};

export function StepActivity({ pending, error, defaults, onSubmit }: Props) {
  const [level, setLevel] = useState<ActivityLevel | undefined>(
    defaults.activity_level ?? undefined,
  );
  const [freq, setFreq] = useState<ActivityFrequency | undefined>(
    defaults.activity_frequency ?? undefined,
  );
  const needsFrequency = level && level !== "aucun";
  const canSubmit = !!level && (!needsFrequency || !!freq);

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
          Ton activité physique
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#9595A8",
            marginTop: 6,
          }}
        >
          On affine ton apport calorique selon ton niveau.
        </p>
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!level) return;
          if (needsFrequency && !freq) return;
          onSubmit({ level, frequency: needsFrequency ? freq! : null });
        }}
      >
        {/* Niveaux */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {LEVELS.map((opt) => {
            const selected = level === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setLevel(opt.value);
                  if (opt.value === "aucun") setFreq(undefined);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 18px",
                  borderRadius: 18,
                  border: `2px solid ${selected ? "#1A5CFF" : "#E8E8F0"}`,
                  background: selected ? "#EEF3FF" : "#fff",
                  width: "100%",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "border-color .15s, background .15s",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: selected ? "#dce9ff" : "#F7F8FC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                    transition: "background .15s",
                  }}
                >
                  {opt.emoji}
                </div>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: selected ? "#1A5CFF" : "#1A1A2E",
                    letterSpacing: "-.01em",
                    transition: "color .15s",
                  }}
                >
                  {opt.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Fréquence (si sport) */}
        {needsFrequency && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: 10 }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                color: "#9595A8",
              }}
            >
              Fréquence
            </span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
              {FREQUENCIES.map((f) => {
                const selected = freq === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    onClick={() => setFreq(f.value)}
                    style={{
                      padding: "14px 8px",
                      borderRadius: 14,
                      border: `2px solid ${selected ? "#1A5CFF" : "#E8E8F0"}`,
                      background: selected ? "#EEF3FF" : "#fff",
                      fontSize: 12,
                      fontWeight: 700,
                      color: selected ? "#1A5CFF" : "#6B6B82",
                      fontFamily: "inherit",
                      cursor: "pointer",
                      textAlign: "center",
                      lineHeight: 1.4,
                      whiteSpace: "pre-line",
                      transition: "border-color .15s, background .15s, color .15s",
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {error && (
          <p style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !canSubmit}
          style={{
            marginTop: 4,
            width: "100%",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background:
              pending || !canSubmit
                ? "#E8E8F0"
                : "linear-gradient(135deg,#FF8540,#FF6B1A)",
            color: pending || !canSubmit ? "#9595A8" : "#fff",
            fontSize: 16,
            fontWeight: 800,
            fontFamily: "inherit",
            cursor: pending || !canSubmit ? "not-allowed" : "pointer",
            letterSpacing: "-.01em",
            boxShadow:
              pending || !canSubmit
                ? "none"
                : "0 8px 20px -4px rgba(255,107,26,.4)",
            transition: "background .2s, box-shadow .2s, color .2s",
          }}
        >
          {pending ? "…" : "Continuer"}
        </button>
      </form>
    </div>
  );
}
