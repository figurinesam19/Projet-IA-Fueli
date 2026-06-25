"use client";

import { useEffect, useState } from "react";

type Props = {
  consumedKcal: number;
  targetKcal: number;
};

const C = 2 * Math.PI * 78; // ≈ 490.1

export function DailyCard({ consumedKcal, targetKcal }: Props) {
  const remaining = Math.max(targetKcal - consumedKcal, 0);
  const pct = Math.min((consumedKcal / targetKcal) * 100, 100);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  // Arc minimum visible dès qu'il y a des calories
  const filled = animPct > 0 ? Math.max((animPct / 100) * C, C * 0.04) : 0;
  const offset = C - filled;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 26,
        padding: "24px 22px",
        boxShadow: "0 12px 30px rgba(26,26,46,.07),0 1px 3px rgba(26,26,46,.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Décoration */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "radial-gradient(circle,#EEF3FF,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "#9595A8",
          position: "relative",
        }}
      >
        Bilan du jour
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0 4px",
          position: "relative",
        }}
      >
        <svg width="200" height="200" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4D7CFF" />
              <stop offset="100%" stopColor="#1A5CFF" />
            </linearGradient>
          </defs>
          {/* Piste vide */}
          <circle
            cx="90"
            cy="90"
            r="78"
            fill="none"
            stroke="#EDEEF4"
            strokeWidth="15"
          />
          {/* Arc coloré — strokeDasharray/offset dans style pour que la CSS transition fonctionne */}
          <circle
            cx="90"
            cy="90"
            r="78"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="15"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{
              strokeDasharray: `${C}`,
              strokeDashoffset: `${offset}`,
              transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-.04em",
              lineHeight: 1,
              color: "#1A1A2E",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {consumedKcal.toLocaleString("fr-FR")}
          </span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#9595A8", marginTop: 2 }}>
            / {targetKcal.toLocaleString("fr-FR")} kcal
          </span>
          <span
            style={{
              marginTop: 8,
              background: remaining > 0 ? "#FFF3EC" : "#EEF3FF",
              color: remaining > 0 ? "#E5550A" : "#1A5CFF",
              fontSize: 12,
              fontWeight: 700,
              padding: "4px 11px",
              borderRadius: 999,
              whiteSpace: "nowrap",
            }}
          >
            {remaining > 0
              ? `${remaining.toLocaleString("fr-FR")} kcal restantes`
              : "Objectif atteint 🎯"}
          </span>
        </div>
      </div>
    </div>
  );
}
