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
      color: "#1a5cff", // bleu — doc identité visuelle
    },
    {
      label: "Glucides",
      consumed: Math.round(consumed.carbsG),
      target: targets.carbsG,
      color: "#f0a500", // jaune
    },
    {
      label: "Lipides",
      consumed: Math.round(consumed.fatG),
      target: targets.fatG,
      color: "#ff6b1a", // orange
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {macros.map((m) => {
        const pct = Math.min((m.consumed / m.target) * 100, 100);
        return (
          <div
            key={m.label}
            className="rounded-xl border border-border bg-card p-3"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-1 text-sm font-medium">
              {m.consumed}
              <span className="text-muted-foreground"> / {m.target}g</span>
            </p>
            <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: m.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
