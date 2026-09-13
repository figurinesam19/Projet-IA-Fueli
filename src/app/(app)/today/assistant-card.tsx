"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

/**
 * Assistant « il te reste X » : restant du jour (calcul local, instantané)
 * + suggestion IA de repas à la demande (bouton → /api/assistant).
 */

type Remaining = { kcal: number; proteinG: number; carbsG: number; fatG: number };

type Suggestion = {
  title: string;
  emoji: string;
  description: string;
  kcal: number;
  protein_g: number;
  reason: string;
};

type Props = {
  remaining: Remaining;
  goal: "perte" | "masse" | "equilibre" | null;
  /** Noms des aliments déjà mangés aujourd'hui (pour varier la suggestion). */
  eaten: string[];
};

export function AssistantCard({ remaining, goal, eaten }: Props) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [error, setError] = useState<string | null>(null);

  const kcalLeft = Math.round(remaining.kcal);
  const proteinLeft = Math.round(remaining.proteinG);
  const goalReached = kcalLeft < 100;

  async function fetchSuggestion() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          remaining,
          goal,
          hour: new Date().getHours(),
          eaten,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setSuggestion(data as Suggestion);
    } catch {
      setError("Impossible de trouver une idée, réessaie.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "16px 18px",
        boxShadow: "0 6px 16px rgba(26,26,46,.05)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Restant du jour */}
      <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "#FFF7E8",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 21,
            flexShrink: 0,
          }}
        >
          {goalReached ? "💪" : "🎯"}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#9595A8" }}>
            Il te reste aujourd&apos;hui
          </p>
          {goalReached ? (
            <p
              style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "-.01em",
                color: "#1A1A2E",
                marginTop: 2,
              }}
            >
              Objectif du jour atteint, bien joué
            </p>
          ) : (
            <p
              style={{
                fontSize: 15,
                fontWeight: 800,
                letterSpacing: "-.01em",
                color: "#1A1A2E",
                marginTop: 2,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {kcalLeft.toLocaleString("fr-FR")} kcal
              <span style={{ color: "#C4C4D1", fontWeight: 700 }}> · </span>
              <span style={{ color: "#1A5CFF" }}>{proteinLeft} g de protéines</span>
            </p>
          )}
        </div>
      </div>

      {/* Suggestion IA — à la demande uniquement */}
      {!goalReached && !suggestion && (
        <button
          onClick={fetchSuggestion}
          disabled={loading}
          style={{
            display: "inline-flex",
            height: 46,
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 14,
            border: "none",
            background: loading ? "#F5F7FB" : "#FFF3EC",
            fontSize: 13,
            fontWeight: 700,
            color: loading ? "#9595A8" : "#E5550A",
            cursor: loading ? "default" : "pointer",
            fontFamily: "inherit",
          }}
        >
          <Sparkles size={16} />
          {loading ? "Fueli réfléchit…" : "Une idée de repas ?"}
        </button>
      )}

      {error && (
        <p style={{ fontSize: 12, fontWeight: 600, color: "#E5550A", textAlign: "center" }}>
          {error}
        </p>
      )}

      {suggestion && (
        <div
          style={{
            background: "#FAFBFF",
            borderRadius: 16,
            padding: 14,
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 13,
                background: "#EEF3FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 21,
                flexShrink: 0,
              }}
            >
              {suggestion.emoji}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  letterSpacing: "-.01em",
                  color: "#1A1A2E",
                }}
              >
                {suggestion.title}
              </p>
              <p style={{ fontSize: 12, fontWeight: 500, color: "#6B6B82", marginTop: 2 }}>
                {suggestion.description}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#E5550A",
                background: "#FFF3EC",
                borderRadius: 999,
                padding: "4px 10px",
              }}
            >
              ~{Math.round(suggestion.kcal)} kcal
            </span>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#1A5CFF",
                background: "#EEF3FF",
                borderRadius: 999,
                padding: "4px 10px",
              }}
            >
              {Math.round(suggestion.protein_g)} g de protéines
            </span>
          </div>

          <p style={{ fontSize: 12, fontWeight: 500, color: "#9595A8", lineHeight: 1.5 }}>
            💡 {suggestion.reason}
          </p>

          <button
            onClick={fetchSuggestion}
            disabled={loading}
            style={{
              alignSelf: "flex-start",
              border: "none",
              background: "none",
              padding: 0,
              fontSize: 12,
              fontWeight: 700,
              color: loading ? "#9595A8" : "#1A5CFF",
              cursor: loading ? "default" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {loading ? "Fueli réfléchit…" : "Une autre idée ↺"}
          </button>
        </div>
      )}
    </div>
  );
}
