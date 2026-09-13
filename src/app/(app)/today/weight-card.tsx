"use client";

import Link from "next/link";
import { ChevronRight, Scale } from "lucide-react";

export type WeightLog = { logged_on: string; weight_kg: number };

type Goal = "perte" | "masse" | "equilibre" | null;

type Props = {
  /** Pesées des ~90 derniers jours, ordre chronologique. */
  logs: WeightLog[];
  goal: Goal;
};

/** Perdre → baisse = vert ; prise de masse → hausse = vert ; sinon neutre. */
function deltaColor(delta: number, goal: Goal): string {
  if (delta === 0 || goal === "equilibre" || goal === null) return "#9595A8";
  const good = goal === "perte" ? delta < 0 : delta > 0;
  return good ? "#059669" : "#E5550A";
}

/**
 * Aperçu du poids sur le dashboard : poids actuel + variation depuis le début.
 * Toute la carte mène à /weight (saisie, courbe, historique) — pas de saisie
 * dupliquée ici.
 */
export function WeightCard({ logs, goal }: Props) {
  const latest = logs.length > 0 ? logs[logs.length - 1] : null;
  const totalDelta =
    logs.length > 1
      ? Math.round((logs[logs.length - 1].weight_kg - logs[0].weight_kg) * 10) / 10
      : null;

  return (
    <Link
      href="/weight"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
        width: "100%",
        background: "#fff",
        borderRadius: 20,
        padding: "16px 18px",
        boxShadow: "0 6px 16px rgba(26,26,46,.05)",
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "#EEF3FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Scale size={21} color="#1A5CFF" />
        </div>
        <div style={{ minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#9595A8" }}>Poids</p>
          {latest ? (
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: "-.02em",
                  color: "#1A1A2E",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {latest.weight_kg.toLocaleString("fr-FR")} kg
              </span>
              {totalDelta !== null && totalDelta !== 0 && (
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: deltaColor(totalDelta, goal),
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {totalDelta > 0 ? "+" : ""}
                  {totalDelta.toLocaleString("fr-FR")} kg
                </span>
              )}
            </div>
          ) : (
            <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E", marginTop: 2 }}>
              Ajoute ta première pesée
            </p>
          )}
        </div>
      </div>

      <ChevronRight size={18} color="#C4C4D1" />
    </Link>
  );
}
