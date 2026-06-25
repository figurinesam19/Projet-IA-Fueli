"use client";

import { useEffect, useState } from "react";
import type { DailyConsumption, DailyTargets } from "@/lib/nutrition";

type Props = {
  consumed: DailyConsumption;
  targets: DailyTargets;
};

const MACROS = [
  { cKey: "proteinG" as const, tKey: "proteinG" as const, label: "Protéines", tag: "P", color: "#1A5CFF", bg: "#EEF3FF" },
  { cKey: "carbsG"   as const, tKey: "carbsG"   as const, label: "Glucides",  tag: "G", color: "#FF6B1A", bg: "#FFF3EC" },
  { cKey: "fatG"     as const, tKey: "fatG"     as const, label: "Lipides",   tag: "L", color: "#D98A1A", bg: "#FFF7E8" },
];

export function MacroBars({ consumed, targets }: Props) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {MACROS.map((m, i) => {
        const val = Math.round(consumed[m.cKey]);
        const goal = Math.round(targets[m.tKey]);
        const pct = Math.min((val / goal) * 100, 100);

        return (
          <div
            key={m.label}
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 18,
              padding: "14px 12px",
              boxShadow: "0 6px 16px rgba(26,26,46,.05)",
            }}
          >
            {/* Tag lettre */}
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: 10,
                background: m.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 800,
                color: m.color,
              }}
            >
              {m.tag}
            </div>

            {/* Pastille ● + label */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 10 }}>
              <span
                style={{
                  display: "inline-block",
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: m.color,
                  flexShrink: 0,
                }}
              />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#9595A8" }}>
                {m.label}
              </span>
            </div>

            {/* Valeur */}
            <p
              style={{
                fontSize: 16,
                fontWeight: 800,
                letterSpacing: "-.02em",
                marginTop: 3,
                color: "#1A1A2E",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {val}
              <span style={{ fontSize: 11, color: "#C4C4D1", fontWeight: 600 }}>
                /{goal}g
              </span>
            </p>

            {/* Barre */}
            <div
              style={{
                height: 5,
                borderRadius: 3,
                background: m.bg,
                overflow: "hidden",
                marginTop: 8,
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: animated ? `${pct}%` : "0%",
                  background: m.color,
                  borderRadius: 3,
                  transition: `width 0.8s ${i * 0.08}s cubic-bezier(0.22,1,0.36,1)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
