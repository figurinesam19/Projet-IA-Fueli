type Props = {
  consumedKcal: number;
  targetKcal: number;
};

export function DailyCard({ consumedKcal, targetKcal }: Props) {
  const remaining = Math.max(targetKcal - consumedKcal, 0);
  const pct = Math.min((consumedKcal / targetKcal) * 100, 100);

  return (
    <div className="rounded-xl bg-primary p-5 text-primary-foreground shadow-sm">
      <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
        Bilan du jour
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-3xl font-medium">{consumedKcal}</span>
        <span className="text-sm opacity-80">/ {targetKcal} kcal</span>
      </div>
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-3 text-xs opacity-80">
        {remaining > 0
          ? `${remaining} kcal restantes`
          : `Objectif atteint (+${consumedKcal - targetKcal} kcal)`}
      </p>
    </div>
  );
}
