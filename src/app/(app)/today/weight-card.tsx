"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Scale, X } from "lucide-react";
import { logWeight } from "./actions";

export type WeightLog = { logged_on: string; weight_kg: number };

type Goal = "perte" | "masse" | "equilibre" | null;

type Props = {
  /** Pesées des ~90 derniers jours, ordre chronologique. */
  logs: WeightLog[];
  goal: Goal;
};

/** Couleur du delta selon l'objectif : perdre → baisse verte, prise de masse → hausse verte. */
function deltaColor(delta: number, goal: Goal): string {
  if (delta === 0 || goal === "equilibre" || goal === null) return "#9595A8";
  const goodDirection = goal === "perte" ? delta < 0 : delta > 0;
  return goodDirection ? "#059669" : "#E5550A";
}

function Sparkline({ logs }: { logs: WeightLog[] }) {
  const W = 120;
  const H = 44;
  const PAD = 4;

  if (logs.length === 0) return null;

  const weights = logs.map((l) => l.weight_kg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const span = max - min || 1;

  const points = logs.map((l, i) => {
    const x =
      logs.length === 1
        ? W / 2
        : PAD + (i / (logs.length - 1)) * (W - PAD * 2);
    const y = PAD + (1 - (l.weight_kg - min) / span) * (H - PAD * 2);
    return { x, y };
  });

  const path = points.map((p) => `${p.x},${p.y}`).join(" ");
  const last = points[points.length - 1];

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true">
      {points.length > 1 && (
        <polyline
          points={path}
          fill="none"
          stroke="#1A5CFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <circle cx={last.x} cy={last.y} r="3.5" fill="#1A5CFF" />
    </svg>
  );
}

export function WeightCard({ logs, goal }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const latest = logs.length > 0 ? logs[logs.length - 1] : null;
  const previous = logs.length > 1 ? logs[logs.length - 2] : null;
  const delta =
    latest && previous
      ? Math.round((latest.weight_kg - previous.weight_kg) * 10) / 10
      : null;

  function save() {
    const parsed = parseFloat(value.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 30 || parsed > 300) {
      setError("Entre un poids entre 30 et 300 kg.");
      return;
    }
    setError(null);
    start(async () => {
      const res = await logWeight(parsed);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setOpen(false);
      setValue("");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          width: "100%",
          background: "#fff",
          border: "none",
          borderRadius: 20,
          padding: "16px 18px",
          boxShadow: "0 6px 16px rgba(26,26,46,.05)",
          cursor: "pointer",
          fontFamily: "inherit",
          textAlign: "left",
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
                {delta !== null && delta !== 0 && (
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: deltaColor(delta, goal),
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {delta > 0 ? "+" : ""}
                    {delta.toLocaleString("fr-FR")} kg
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

        <Sparkline logs={logs.slice(-30)} />
      </button>

      {/* Modal de saisie */}
      {open && (
        <div
          onClick={() => !pending && setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,26,46,.45)",
            zIndex: 300,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 448,
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              padding: "22px 22px calc(26px + env(safe-area-inset-bottom,0px))",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E" }}>
                Ta pesée du jour
              </h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={pending}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 12,
                  border: "none",
                  background: "#F7F8FC",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#6B6B82",
                }}
                aria-label="Fermer"
              >
                <X size={17} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                placeholder={latest ? String(latest.weight_kg).replace(".", ",") : "70,5"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                className="fu-input"
                style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}
              />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#9595A8" }}>kg</span>
            </div>

            {error && (
              <p style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>{error}</p>
            )}

            <button
              type="button"
              onClick={save}
              disabled={pending}
              style={{
                width: "100%",
                padding: 16,
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
                boxShadow: pending ? "none" : "0 8px 20px -4px rgba(255,107,26,.4)",
              }}
            >
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>

            <p style={{ fontSize: 12, fontWeight: 500, color: "#C4C4D1", textAlign: "center" }}>
              Ton objectif calorique se recalcule automatiquement.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
