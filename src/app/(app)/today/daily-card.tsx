"use client";

import { useEffect, useState } from "react";

type Props = {
  consumedKcal: number;
  targetKcal: number;
};

export function DailyCard({ consumedKcal, targetKcal }: Props) {
  const remaining = Math.max(targetKcal - consumedKcal, 0);
  const pct = Math.min((consumedKcal / targetKcal) * 100, 100);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-sm">
      <p className="text-[11px] font-semibold uppercase tracking-widest opacity-70">
        Bilan du jour
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="tabular text-4xl font-bold">{consumedKcal}</span>
        <span className="text-sm opacity-70">/ {targetKcal} kcal</span>
      </div>
      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white"
          style={{
            width: `${width}%`,
            transition: "width 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </div>
      <p className="mt-3 text-xs opacity-75">
        {remaining > 0
          ? `${remaining} kcal restantes`
          : `Objectif atteint (+${consumedKcal - targetKcal} kcal)`}
      </p>
    </div>
  );
}
