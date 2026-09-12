import Link from "next/link";
import { ArrowLeft, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeDailyTargets } from "@/lib/nutrition";
import { currentWeek, dayBounds, toDayKey } from "@/lib/date";

const DAY_LETTERS = ["L", "M", "M", "J", "V", "S", "D"];

type DayTotal = { kcal: number; proteinG: number };

function summarize(
  days: Date[],
  totals: Map<string, DayTotal>,
  targetKcal: number | null,
  upTo: Date,
) {
  const past = days.filter((d) => d <= upTo);
  const scanned = past.filter((d) => (totals.get(toDayKey(d))?.kcal ?? 0) > 0);
  const avgKcal =
    scanned.length > 0
      ? Math.round(
          scanned.reduce((s, d) => s + (totals.get(toDayKey(d))?.kcal ?? 0), 0) /
            scanned.length,
        )
      : 0;
  const avgProtein =
    scanned.length > 0
      ? Math.round(
          scanned.reduce(
            (s, d) => s + (totals.get(toDayKey(d))?.proteinG ?? 0),
            0,
          ) / scanned.length,
        )
      : 0;
  const inTarget = targetKcal
    ? scanned.filter((d) => {
        const kcal = totals.get(toDayKey(d))?.kcal ?? 0;
        return Math.abs(kcal - targetKcal) <= targetKcal * 0.1;
      }).length
    : null;
  return { pastCount: past.length, scannedCount: scanned.length, avgKcal, avgProtein, inTarget };
}

export default async function WeekPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thisWeek = currentWeek();
  const lastWeek = thisWeek.map((d) => {
    const p = new Date(d);
    p.setDate(p.getDate() - 7);
    return p;
  });

  const { start: rangeStart } = dayBounds(lastWeek[0]);
  const { end: rangeEnd } = dayBounds(today);

  const [{ data: profile }, { data: meals }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase
      .from("meals")
      .select("consumed_at, total_kcal, total_protein_g")
      .eq("user_id", user!.id)
      .gte("consumed_at", rangeStart.toISOString())
      .lt("consumed_at", rangeEnd.toISOString()),
  ]);

  const targets = computeDailyTargets(profile);
  const targetKcal = targets?.kcal ?? null;

  // Totaux par jour
  const totals = new Map<string, DayTotal>();
  for (const m of meals ?? []) {
    const key = toDayKey(new Date(m.consumed_at));
    const cur = totals.get(key) ?? { kcal: 0, proteinG: 0 };
    cur.kcal += Number(m.total_kcal);
    cur.proteinG += Number(m.total_protein_g);
    totals.set(key, cur);
  }

  const cur = summarize(thisWeek, totals, targetKcal, today);
  const prev = summarize(lastWeek, totals, targetKcal, lastWeek[6]);

  const deltaKcal = prev.avgKcal > 0 && cur.avgKcal > 0 ? cur.avgKcal - prev.avgKcal : null;

  // Graphique : hauteur des barres relative au max (cible incluse pour l'échelle)
  const maxKcal = Math.max(
    targetKcal ?? 0,
    ...thisWeek.map((d) => totals.get(toDayKey(d))?.kcal ?? 0),
    1,
  );

  return (
    <main
      className="page-bottom"
      style={{
        maxWidth: 448,
        margin: "0 auto",
        padding: "0 18px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0 4px" }}>
        <Link
          href="/today"
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(26,26,46,.08)",
            color: "#6B6B82",
            flexShrink: 0,
            textDecoration: "none",
          }}
          aria-label="Retour"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E" }}>
          Bilan de la semaine
        </h1>
      </div>

      {/* Graphique kcal par jour */}
      <section
        className="animate-fade-up"
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "18px 18px 14px",
          boxShadow: "0 6px 16px rgba(26,26,46,.05)",
        }}
      >
        <p style={{ fontSize: 13, fontWeight: 700, color: "#9595A8", marginBottom: 14 }}>
          CALORIES PAR JOUR
        </p>
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            gap: 6,
            height: 120,
          }}
        >
          {thisWeek.map((d, i) => {
            const kcal = totals.get(toDayKey(d))?.kcal ?? 0;
            const isFuture = d > today;
            const h = kcal > 0 ? Math.max(10, Math.round((kcal / maxKcal) * 110)) : 6;
            const inTarget =
              targetKcal && kcal > 0 && Math.abs(kcal - targetKcal) <= targetKcal * 0.1;
            const over = targetKcal && kcal > targetKcal * 1.1;
            const bg = isFuture || kcal === 0
              ? "#EDEDF3"
              : inTarget
                ? "#34D399"
                : over
                  ? "#FF8540"
                  : "#84A9FF";
            return (
              <div
                key={toDayKey(d)}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 34,
                    height: h,
                    borderRadius: 8,
                    background: bg,
                    transition: "height .2s",
                  }}
                />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#9595A8" }}>
                  {DAY_LETTERS[i]}
                </span>
              </div>
            );
          })}
        </div>
        {targetKcal && (
          <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap" }}>
            <LegendDot color="#34D399" label="Dans l'objectif" />
            <LegendDot color="#84A9FF" label="En dessous" />
            <LegendDot color="#FF8540" label="Au-dessus" />
          </div>
        )}
      </section>

      {/* Stats de la semaine */}
      <section
        className="animate-fade-up-1"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
      >
        <StatCard
          label="Moyenne / jour"
          value={cur.avgKcal > 0 ? `${cur.avgKcal.toLocaleString("fr-FR")} kcal` : "—"}
        />
        <StatCard
          label="Jours scannés"
          value={`${cur.scannedCount}/${cur.pastCount}`}
        />
        {cur.inTarget !== null && (
          <StatCard
            label="Dans l'objectif"
            value={`${cur.inTarget} jour${cur.inTarget > 1 ? "s" : ""}`}
          />
        )}
        <StatCard
          label="Protéines moy."
          value={cur.avgProtein > 0 ? `${cur.avgProtein} g` : "—"}
        />
      </section>

      {/* Comparaison semaine précédente */}
      <section
        className="animate-fade-up-2"
        style={{
          background: "#fff",
          borderRadius: 20,
          padding: "16px 18px",
          boxShadow: "0 6px 16px rgba(26,26,46,.05)",
          display: "flex",
          alignItems: "center",
          gap: 13,
        }}
      >
        <div
          style={{
            width: 46,
            height: 46,
            borderRadius: 14,
            background: "#F1ECFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "#7C3AED",
          }}
        >
          {deltaKcal === null ? (
            <Minus size={20} />
          ) : deltaKcal > 0 ? (
            <TrendingUp size={20} />
          ) : (
            <TrendingDown size={20} />
          )}
        </div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#9595A8" }}>
            VS SEMAINE DERNIÈRE
          </p>
          <p style={{ fontSize: 14, fontWeight: 600, color: "#1A1A2E", marginTop: 3, lineHeight: 1.45 }}>
            {deltaKcal === null
              ? "Pas encore assez de données pour comparer. Continue à scanner !"
              : deltaKcal === 0
                ? "Même moyenne que la semaine dernière."
                : `${deltaKcal > 0 ? "+" : ""}${deltaKcal.toLocaleString("fr-FR")} kcal en moyenne par jour (${prev.avgKcal.toLocaleString("fr-FR")} → ${cur.avgKcal.toLocaleString("fr-FR")}).`}
          </p>
        </div>
      </section>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: "14px 16px",
        boxShadow: "0 4px 12px rgba(26,26,46,.05)",
      }}
    >
      <p style={{ fontSize: 12, fontWeight: 700, color: "#9595A8" }}>{label}</p>
      <p
        style={{
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: "-.02em",
          color: "#1A1A2E",
          marginTop: 3,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </p>
    </div>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
      <span
        style={{ width: 8, height: 8, borderRadius: "50%", background: color, display: "inline-block" }}
      />
      <span style={{ fontSize: 11.5, fontWeight: 600, color: "#9595A8" }}>{label}</span>
    </span>
  );
}
