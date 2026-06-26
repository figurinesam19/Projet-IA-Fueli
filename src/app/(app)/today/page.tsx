import { ScanBarcode, Search } from "lucide-react";
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
import { ScanFab } from "./scan-fab";

// Ordre d'affichage et métadonnées visuelles par type de repas
const KIND_ORDER = ["petit_dejeuner", "dejeuner", "diner"] as const;

const KIND_META: Record<string, { emoji: string; tint: string; label: string }> = {
  petit_dejeuner: { emoji: "🌅", tint: "#FFF7E8", label: "Petit-déjeuner" },
  dejeuner:       { emoji: "☀️",  tint: "#EEF3FF", label: "Déjeuner" },
  diner:          { emoji: "🌙",  tint: "#F1ECFF", label: "Repas du soir" },
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

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const supabase = await createClient();
  const [{ data: { user } }, { d }] = await Promise.all([
    supabase.auth.getUser(),
    searchParams,
  ]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const requested = d ? parseDayKey(d) : null;

  const minDate = new Date(today);
  minDate.setDate(today.getDate() - 6);

  let selected = today;
  if (requested && requested >= minDate && requested <= today) {
    selected = requested;
  }
  const isToday = isSameDay(selected, today);

  const { start, end } = dayBounds(selected);

  const [{ data: profile }, { data: meals }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    supabase
      .from("meals")
      .select("*, meal_items(name)")
      .eq("user_id", user!.id)
      .gte("consumed_at", start.toISOString())
      .lt("consumed_at", end.toISOString())
      .order("consumed_at", { ascending: true }),
  ]); // ASC pour garder l'ordre naturel dans les groupes

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

  // Grouper les repas par type de repas dans l'ordre de la journée
  const knownKinds = new Set<string>(KIND_ORDER);
  const mealGroups = [
    ...KIND_ORDER.flatMap((kind) => {
      const group = (meals ?? []).filter((m) => m.kind === kind);
      if (group.length === 0) return [];
      const totalKcal = group.reduce((s, m) => s + Math.round(Number(m.total_kcal)), 0);
      const meta = KIND_META[kind];
      return [{ kind, meta, meals: group, totalKcal, firstTime: fmtTime(group[0].consumed_at) }];
    }),
    // Repas sans type connu
    ...(() => {
      const unknown = (meals ?? []).filter((m) => !knownKinds.has(m.kind));
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

  const firstName = profile?.first_name ?? "";
  const initial = firstName.charAt(0).toUpperCase() || "?";

  return (
    <>
      <main
        style={{
          maxWidth: 448,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: 14,
          padding: "0 18px 200px",
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

          {/* Avatar initiale */}
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
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
        </header>

        {/* ===== DATE STRIP ===== */}
        <div className="animate-fade-up-1">
          <DateStrip selected={selected} />
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
                {meals!.length} repas
              </span>
            )}
          </div>

          {hasNoMeals ? (
            <div
              style={{
                background: "#fff",
                borderRadius: 18,
                border: "1.5px dashed #D6E4FF",
                padding: "24px 16px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 14, fontWeight: 600, color: "#1A5CFF" }}>
                {isToday ? "Aucun repas aujourd'hui" : "Aucun repas enregistré ce jour."}
              </p>
              {isToday && (
                <p style={{ marginTop: 4, fontSize: 12, fontWeight: 500, color: "#9595A8" }}>
                  Scanne ton premier plat pour démarrer la journée.
                </p>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {mealGroups.map((group) => (
                <div key={group.kind}>
                  {/* En-tête du groupe */}
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

                  {/* Items du groupe */}
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
                        {/* Icône */}
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
                            {(m as { meal_items?: { name: string }[] }).meal_items?.map(i => i.name).join(", ") || group.meta.label}
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

        {/* Boutons secondaires (dans le flux, en bas du contenu) */}
        {isToday && (
          <div
            className="animate-fade-up-5"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <Link
              href="/search"
              style={{
                display: "inline-flex",
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 16,
                background: "#fff",
                boxShadow: "0 4px 12px rgba(26,26,46,.06)",
                fontSize: 13,
                fontWeight: 700,
                color: "#1A1A2E",
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
                height: 48,
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                borderRadius: 16,
                background: "#fff",
                boxShadow: "0 4px 12px rgba(26,26,46,.06)",
                fontSize: 13,
                fontWeight: 700,
                color: "#1A1A2E",
                textDecoration: "none",
              }}
            >
              <ScanBarcode size={17} color="#1A5CFF" />
              Code-barre
            </Link>
          </div>
        )}
      </main>

      {/* FAB Scanner — client component via createPortal, position:fixed garantie */}
      {isToday && <ScanFab />}
    </>
  );
}
