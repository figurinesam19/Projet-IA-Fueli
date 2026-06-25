"use client";

import { useState } from "react";
import type { Goal, Profile } from "../types";

const OPTIONS: {
  value: Goal;
  emoji: string;
  title: string;
  desc: string;
  tint: string;
}[] = [
  {
    value: "perte",
    emoji: "⚖️",
    title: "Perte de poids",
    desc: "Déficit calorique modéré",
    tint: "#FFF3EC",
  },
  {
    value: "masse",
    emoji: "💪",
    title: "Prise de masse",
    desc: "Surplus calorique",
    tint: "#EEF3FF",
  },
  {
    value: "equilibre",
    emoji: "🎯",
    title: "Équilibre alimentaire",
    desc: "Maintenir mon poids",
    tint: "#ECFDF5",
  },
];

type Props = {
  pending: boolean;
  error: string | null;
  defaults: Partial<Profile>;
  onSubmit: (v: { goal: Goal }) => void;
};

export function StepGoal({ pending, error, defaults, onSubmit }: Props) {
  const [goal, setGoal] = useState<Goal | undefined>(
    defaults.goal ?? undefined,
  );

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
          Ton objectif
        </h1>
        <p
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: "#9595A8",
            marginTop: 6,
          }}
        >
          On adapte ton apport calorique en fonction.
        </p>
      </div>

      <form
        style={{ display: "flex", flexDirection: "column", gap: 14 }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!goal) return;
          onSubmit({ goal });
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {OPTIONS.map((opt) => {
            const selected = goal === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setGoal(opt.value)}
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
                {/* Emoji dans pastille colorée */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 14,
                    background: selected ? "#dce9ff" : opt.tint,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    flexShrink: 0,
                    transition: "background .15s",
                  }}
                >
                  {opt.emoji}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: selected ? "#1A5CFF" : "#1A1A2E",
                      letterSpacing: "-.01em",
                      transition: "color .15s",
                    }}
                  >
                    {opt.title}
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: selected ? "#4A7CFF" : "#9595A8",
                      marginTop: 2,
                      transition: "color .15s",
                    }}
                  >
                    {opt.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {error && (
          <p style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending || !goal}
          style={{
            marginTop: 4,
            width: "100%",
            padding: "16px",
            borderRadius: 16,
            border: "none",
            background:
              pending || !goal
                ? "#E8E8F0"
                : "linear-gradient(135deg,#FF8540,#FF6B1A)",
            color: pending || !goal ? "#9595A8" : "#fff",
            fontSize: 16,
            fontWeight: 800,
            fontFamily: "inherit",
            cursor: pending || !goal ? "not-allowed" : "pointer",
            letterSpacing: "-.01em",
            boxShadow:
              pending || !goal ? "none" : "0 8px 20px -4px rgba(255,107,26,.4)",
            transition: "background .2s, box-shadow .2s, color .2s",
          }}
        >
          {pending ? "…" : "Continuer"}
        </button>
      </form>
    </div>
  );
}
