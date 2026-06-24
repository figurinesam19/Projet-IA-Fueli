"use client";

import { useEffect, useState } from "react";
import type { DailyConsumption, DailyTargets } from "@/lib/nutrition";

type Props = {
  consumed: DailyConsumption;
  targets: DailyTargets;
};

export function MacroBars({ consumed, targets }: Props) {
  const macros = [
    {
      label: "Protéines",
      consumed: Math.round(consumed.proteinG),
      target: targets.proteinG,
      color: "#1a5cff",
    },
    {
      label: "Glucides",
      consumed: Math.round(consumed.carbsG),
      target: targets.carbsG,
      color: "#f0a500",
    },
    {
      label: "Lipides",
      consumed: Math.round(consumed.fatG),
      target: targets.fatG,
      color: "#ff6b1a",
    },
  ];

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-3">
      {macros.map((m, i) => {
        const pct = Math.min((m.consumed / m.target) * 100, 100);
        return (
          <div
            key={m.label}
            className="rounded-xl border border-border bg-card p-3"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {m.label}
            </p>
            <p className="tabular mt-1 text-sm font-semibold">
              {m.consumed}
              <span className="font-normal text-muted-foreground"> /{m.target}g</span>
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full"
                style={{
                  width: animated ? `${pct}%` : "0%",
                  backgroundColor: m.color,
                  transition: `width 0.8s ${i * 0.08}s cubic-bezier(0.22, 1, 0.36, 1)`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
