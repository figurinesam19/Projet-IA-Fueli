import { Camera, ScanBarcode, Search } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  computeDailyTargets,
  emptyConsumption,
  type DailyConsumption,
} from "@/lib/nutrition";
import { dayBounds, isSameDay, parseDayKey } from "@/lib/date";
import { DailyCard } from "./daily-card";
import { MacroBars } from "./macro-bars";
import { DateStrip } from "./date-strip";

function formatDate(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const { d } = await searchParams;
  const requested = d ? parseDayKey(d) : null;

  // On limite la navigation aux 7 derniers jours
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 6);

  let selected = today;
  if (requested && requested >= minDate && requested <= today) {
    selected = requested;
  }
  const isToday = isSameDay(selected, today);

  const { start, end } = dayBounds(selected);
  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user!.id)
    .gte("consumed_at", start.toISOString())
    .lt("consumed_at", end.toISOString())
    .order("consumed_at", { ascending: false });

  const consumption: DailyConsumption = (meals ?? []).reduce(
    (acc, m) => ({
      kcal: acc.kcal + Number(m.total_kcal),
      proteinG: acc.proteinG + Number(m.total_protein_g),
      carbsG: acc.carbsG + Number(m.total_carbs_g),
      fatG: acc.fatG + Number(m.total_fat_g),
    }),
    emptyConsumption(),
  );

  const targets = computeDailyTargets(profile);
  const hasNoMeals = (meals?.length ?? 0) === 0;

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 p-5">
      <header className="animate-fade-up">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          {formatDate(selected)}
        </p>
        <h1 className="mt-1 text-[24px] font-bold">
          {isToday
            ? `Salut ${profile?.first_name ?? "👋"}`
            : "Historique"}
        </h1>
      </header>

      <div className="animate-fade-up-1">
        <DateStrip selected={selected} />
      </div>

      {targets ? (
        <>
          <div className="animate-fade-up-2">
            <DailyCard
              consumedKcal={Math.round(consumption.kcal)}
              targetKcal={targets.kcal}
            />
          </div>
          <div className="animate-fade-up-3">
            <MacroBars consumed={consumption} targets={targets} />
          </div>
        </>
      ) : (
        <div className="animate-fade-up-2 rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Termine ton onboarding pour voir ton objectif calorique.
        </div>
      )}

      <section className="animate-fade-up-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-semibold">
            {isToday ? "Repas du jour" : "Repas"}
          </h2>
          {!hasNoMeals && (
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              {meals!.length} repas
            </span>
          )}
        </div>

        {hasNoMeals ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <p className="text-sm text-foreground">
              {isToday
                ? "Aucun repas aujourd'hui."
                : "Aucun repas enregistré ce jour."}
            </p>
            {isToday && (
              <p className="mt-1 text-xs text-muted-foreground">
                Scanne ton premier plat pour démarrer la journée.
              </p>
            )}
          </div>
        ) : (
          <ul className="space-y-2">
            {meals!.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/meal/${m.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted/50 active:bg-muted"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {m.kind ? labelKind(m.kind) : "Repas"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(m.consumed_at).toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="tabular text-sm font-semibold">
                      {Math.round(Number(m.total_kcal))} kcal
                    </p>
                    <p className="tabular text-[11px] uppercase tracking-wide text-muted-foreground">
                      P {Math.round(Number(m.total_protein_g))}g · G{" "}
                      {Math.round(Number(m.total_carbs_g))}g · L{" "}
                      {Math.round(Number(m.total_fat_g))}g
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {isToday && (
        <div className="animate-fade-up-5 sticky bottom-20 z-0 mt-2 space-y-2">
          <Link
            href="/scan"
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90"
          >
            <Camera className="size-4" />
            Scanner un plat
          </Link>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/search"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <Search className="size-4" />
              Rechercher
            </Link>
            <Link
              href="/barcode"
              className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              <ScanBarcode className="size-4" />
              Code-barre
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}

function labelKind(kind: string) {
  switch (kind) {
    case "petit_dejeuner":
      return "Petit-déjeuner";
    case "dejeuner":
      return "Déjeuner";
    case "diner":
      return "Dîner";
    case "collation":
      return "Collation";
    default:
      return "Repas";
  }
}
