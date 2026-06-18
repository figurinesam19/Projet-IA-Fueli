import { Camera } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  computeDailyTargets,
  emptyConsumption,
  type DailyConsumption,
} from "@/lib/nutrition";
import { DailyCard } from "./daily-card";
import { MacroBars } from "./macro-bars";

function formatDate(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  // Repas du jour (00:00 → maintenant)
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { data: meals } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", user!.id)
    .gte("consumed_at", startOfDay.toISOString())
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
      <header>
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {formatDate(new Date())}
        </p>
        <h1 className="mt-1 text-[22px] font-medium">
          Salut {profile?.first_name ?? "👋"}
        </h1>
      </header>

      {targets ? (
        <>
          <DailyCard
            consumedKcal={Math.round(consumption.kcal)}
            targetKcal={targets.kcal}
          />
          <MacroBars consumed={consumption} targets={targets} />
        </>
      ) : (
        <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Termine ton onboarding pour voir ton objectif calorique.
        </div>
      )}

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-medium">Repas du jour</h2>
          {!hasNoMeals && (
            <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {meals!.length} repas
            </span>
          )}
        </div>

        {hasNoMeals ? (
          <div className="rounded-xl border border-dashed border-border bg-card p-6 text-center">
            <p className="text-sm text-foreground">Aucun repas aujourd&apos;hui.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Scanne ton premier plat pour démarrer la journée.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {meals!.map((m) => (
              <li
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-border bg-card p-4"
              >
                <div>
                  <p className="text-sm font-medium">
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
                  <p className="text-sm font-medium">
                    {Math.round(Number(m.total_kcal))} kcal
                  </p>
                  <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                    P {Math.round(Number(m.total_protein_g))}g · G{" "}
                    {Math.round(Number(m.total_carbs_g))}g · L{" "}
                    {Math.round(Number(m.total_fat_g))}g
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="sticky bottom-20 z-0 mt-2">
        <Link
          href="/scan"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent text-sm font-medium text-accent-foreground transition-colors hover:bg-accent/90"
        >
          <Camera className="size-4" />
          Scanner un plat
        </Link>
      </div>
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
