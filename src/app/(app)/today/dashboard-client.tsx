"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, ScanBarcode, Search } from "lucide-react";
import {
  emptyConsumption,
  type DailyConsumption,
  type DailyTargets,
} from "@/lib/nutrition";
import { computeStreak, dayBounds, isSameDay } from "@/lib/date";
import { DailyCard } from "./daily-card";
import { MacroBars } from "./macro-bars";
import { DateStrip } from "./date-strip";
import { ScanFab } from "./scan-fab";
import { WeightCard, type WeightLog } from "./weight-card";

const KIND_ORDER = ["petit_dejeuner", "dejeuner", "diner"] as const;

const KIND_META: Record<string, { emoji: string; tint: string; label: string }> = {
  petit_dejeuner: { emoji: "🌅", tint: "#FFF7E8", label: "Petit-déjeuner" },
  dejeuner:       { emoji: "☀️",  tint: "#EEF3FF", label: "Déjeuner" },
  diner:          { emoji: "🌙",  tint: "#F1ECFF", label: "Repas du soir" },
};

export type MealRow = {
  id: string;
  kind: string;
  consumed_at: string;
  total_kcal: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  meal_items?: { name: string }[];
};

type Props = {
  firstName: string;
  targets: DailyTargets | null;
  /** Tous les repas de la semaine (lundi → aujourd'hui), déjà chargés. */
  weekMeals: MealRow[];
  /** Timestamp (ms) de minuit aujourd'hui — évite les soucis de fuseau au parse. */
  todayMs: number;
  /** Timestamps de tous les repas sur 1 an — pour le calcul de la streak. */
  mealTimestamps: string[];
  /** Pesées des 90 derniers jours, ordre chronologique. */
  weightLogs: WeightLog[];
  goal: "perte" | "masse" | "equilibre" | null;
};

function formatDate(d: Date) {
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

function fmtTime(isoStr: string) {
  return new Date(isoStr).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DashboardClient({
  firstName,
  targets,
  weekMeals,
  todayMs,
  mealTimestamps,
  weightLogs,
  goal,
}: Props) {
  const today = useMemo(() => new Date(todayMs), [todayMs]);
  const [selected, setSelected] = useState<Date>(today);

  const isToday = isSameDay(selected, today);
  const initial = firstName.charAt(0).toUpperCase() || "?";
  const streak = useMemo(() => computeStreak(mealTimestamps), [mealTimestamps]);

  // Filtrage + agrégation par jour : purement en mémoire, aucun appel réseau.
  const { consumption, mealGroups, dayMeals } = useMemo(() => {
    const { start, end } = dayBounds(selected);
    const startMs = start.getTime();
    const endMs = end.getTime();
    const meals = weekMeals
      .filter((m) => {
        const t = new Date(m.consumed_at).getTime();
        return t >= startMs && t < endMs;
      })
      .sort((a, b) => (a.consumed_at < b.consumed_at ? -1 : 1));

    const consumption: DailyConsumption = meals.reduce(
      (acc, m) => ({
        kcal: acc.kcal + Number(m.total_kcal),
        proteinG: acc.proteinG + Number(m.total_protein_g),
        carbsG: acc.carbsG + Number(m.total_carbs_g),
        fatG: acc.fatG + Number(m.total_fat_g),
      }),
      emptyConsumption(),
    );

    const knownKinds = new Set<string>(KIND_ORDER);
    const mealGroups = [
      ...KIND_ORDER.flatMap((kind) => {
        const group = meals.filter((m) => m.kind === kind);
        if (group.length === 0) return [];
        const totalKcal = group.reduce((s, m) => s + Math.round(Number(m.total_kcal)), 0);
        return [{ kind, meta: KIND_META[kind], meals: group, totalKcal, firstTime: fmtTime(group[0].consumed_at) }];
      }),
      ...(() => {
        const unknown = meals.filter((m) => !knownKinds.has(m.kind));
        if (unknown.length === 0) return [];
        return [{
          kind: "autre",
          meta: { emoji: "🍽️", tint: "#EEF3FF", label: "Repas" },
          meals: unknown,
          totalKcal: unknown.reduce((s, m) => s + Math.round(Number(m.total_kcal)), 0),
          firstTime: fmtTime(unknown[0].consumed_at),
        }];
      })(),
    ];

    return { consumption, mealGroups, dayMeals: meals };
  }, [selected, weekMeals]);

  const hasNoMeals = dayMeals.length === 0;

  return (
    <>
      <main
        className="page-bottom"
        style={{
          maxWidth: 448,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "0 18px 0",
        }}
      >
        {/* ===== HEADER ===== */}
        <header
          className="animate-fade-up"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 2px 4px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#9595A8",
                textTransform: "capitalize",
              }}
            >
              {formatDate(selected)}
            </p>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 800,
                letterSpacing: "-.03em",
                marginTop: 2,
                color: "#1A1A2E",
              }}
            >
              {isToday ? `Salut ${firstName} 👋` : "Historique"}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexShrink: 0,
            }}
          >
            {/* Badge streak — visible dès 1 jour de série */}
            {streak > 0 && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  background: "#FFF3EC",
                  borderRadius: 999,
                  padding: "8px 13px",
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#E5550A",
                  letterSpacing: "-.01em",
                  boxShadow: "0 2px 8px rgba(229,85,10,.12)",
                }}
                aria-label={`Série de ${streak} jour${streak > 1 ? "s" : ""}`}
              >
                🔥 {streak}
              </div>
            )}

            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                background: "linear-gradient(135deg,#84A9FF,#1A5CFF)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: 800,
                fontSize: 17,
                boxShadow: "0 6px 14px rgba(26,92,255,.32)",
              }}
            >
              {initial}
            </div>
          </div>
        </header>

        {/* ===== DATE STRIP ===== */}
        <div className="animate-fade-up-1">
          <DateStrip selected={selected} onSelect={setSelected} />
        </div>

        {/* ===== BILAN + MACROS ===== */}
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
          <div
            className="animate-fade-up-2"
            style={{
              background: "#fff",
              borderRadius: 18,
              border: "1.5px dashed #D6E4FF",
              padding: 16,
              fontSize: 13,
              fontWeight: 500,
              color: "#6B6B82",
            }}
          >
            Termine ton onboarding pour voir ton objectif calorique.
          </div>
        )}

        {/* ===== POIDS ===== */}
        {isToday && (
          <div className="animate-fade-up-3">
            <WeightCard logs={weightLogs} goal={goal} />
          </div>
        )}

        {/* ===== BILAN HEBDO ===== */}
        {isToday && (
          <Link
            href="/week"
            className="animate-fade-up-3"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              background: "#fff",
              borderRadius: 20,
              padding: "16px 18px",
              boxShadow: "0 6px 16px rgba(26,26,46,.05)",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
              <div
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 14,
                  background: "#F1ECFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 21,
                  flexShrink: 0,
                }}
              >
                📊
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: "-.01em", color: "#1A1A2E" }}>
                  Bilan de la semaine
                </p>
                <p style={{ fontSize: 12, fontWeight: 500, color: "#9595A8", marginTop: 2 }}>
                  Moyennes, régularité, tendance
                </p>
              </div>
            </div>
            <ChevronRight size={18} color="#C4C4D1" />
          </Link>
        )}

        {/* ===== JOURNAL ===== */}
        <section
          className="animate-fade-up-4"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "6px 2px 0",
            }}
          >
            <h2
              style={{
                fontSize: 17,
                fontWeight: 800,
                letterSpacing: "-.02em",
                color: "#1A1A2E",
              }}
            >
              Mon journal
            </h2>
            {!hasNoMeals && (
              <span style={{ fontSize: 12, fontWeight: 600, color: "#9595A8" }}>
                {dayMeals.length} repas
              </span>
            )}
          </div>

          {hasNoMeals ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "32px 20px 28px",
                textAlign: "center",
                boxShadow: "0 6px 16px rgba(26,26,46,.05)",
              }}
            >
              <div style={{ fontSize: 48, lineHeight: 1, marginBottom: 12 }}>🍽️</div>
              <p style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-.01em", color: "#1A1A2E" }}>
                {isToday ? "Première bouchée du jour ?" : "Aucun repas ce jour-là"}
              </p>
              {isToday && (
                <p style={{ marginTop: 6, fontSize: 13, fontWeight: 500, color: "#9595A8", lineHeight: 1.5 }}>
                  Scanne un plat, recherche un aliment<br />ou entre un code-barre ci-dessous.
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mealGroups.map((group) => (
                <div key={group.kind}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "0 2px 8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E" }}>
                        {group.meta.label}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#C4C4D1" }}>
                        {group.firstTime}
                      </span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#6B6B82" }}>
                      {group.totalKcal.toLocaleString("fr-FR")} kcal
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {group.meals.map((m) => (
                      <Link
                        key={m.id}
                        href={`/meal/${m.id}`}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 13,
                          background: "#fff",
                          borderRadius: 18,
                          padding: 12,
                          boxShadow: "0 4px 12px rgba(26,26,46,.05)",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <div
                          style={{
                            width: 46,
                            height: 46,
                            borderRadius: 14,
                            background: group.meta.tint,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 22,
                            flexShrink: 0,
                          }}
                        >
                          {group.meta.emoji}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              letterSpacing: "-.01em",
                              color: "#1A1A2E",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {m.meal_items?.map((i) => i.name).join(", ") || group.meta.label}
                          </p>
                          <p style={{ fontSize: 12, fontWeight: 500, color: "#9595A8", marginTop: 2 }}>
                            P {Math.round(Number(m.total_protein_g))}g · G {Math.round(Number(m.total_carbs_g))}g · L {Math.round(Number(m.total_fat_g))}g
                          </p>
                        </div>

                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p
                            style={{
                              fontSize: 15,
                              fontWeight: 800,
                              letterSpacing: "-.02em",
                              color: "#1A1A2E",
                              fontVariantNumeric: "tabular-nums",
                            }}
                          >
                            {Math.round(Number(m.total_kcal))}
                          </p>
                          <p style={{ fontSize: 10, fontWeight: 600, color: "#C4C4D1" }}>kcal</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Boutons secondaires */}
        {isToday && (
          <div
            className="animate-fade-up-5"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <Link
              href="/search"
              style={{
                display: "inline-flex",
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 16,
                background: "#EEF3FF",
                fontSize: 13,
                fontWeight: 700,
                color: "#1A5CFF",
                textDecoration: "none",
              }}
            >
              <Search size={17} color="#1A5CFF" />
              Rechercher
            </Link>
            <Link
              href="/barcode"
              style={{
                display: "inline-flex",
                height: 50,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 16,
                background: "#FFF3EC",
                fontSize: 13,
                fontWeight: 700,
                color: "#E5550A",
                textDecoration: "none",
              }}
            >
              <ScanBarcode size={17} color="#E5550A" />
              Code-barre
            </Link>
          </div>
        )}
      </main>

      {isToday && <ScanFab />}
    </>
  );
}
