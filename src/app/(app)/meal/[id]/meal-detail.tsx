"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2 } from "lucide-react";
import { deleteMeal, deleteMealItem, updateMealKind } from "./actions";
import { getFoodEmoji } from "@/lib/food-emoji";

type MealKind = "petit_dejeuner" | "dejeuner" | "diner";

type Meal = {
  id: string;
  kind: MealKind | null;
  source: string | null;
  total_kcal: number;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  consumed_at: string;
};

type MealItem = {
  id: string;
  meal_id: string;
  name: string;
  quantity_g: number;
  kcal: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
};

const KIND_META: Record<MealKind, { emoji: string; label: string; tint: string; color: string }> = {
  petit_dejeuner: { emoji: "🌅", label: "Petit-déjeuner", tint: "#FFF7E8", color: "#D98A1A" },
  dejeuner:       { emoji: "☀️",  label: "Déjeuner",       tint: "#EEF3FF", color: "#1A5CFF" },
  diner:          { emoji: "🌙",  label: "Repas du soir",  tint: "#F1ECFF", color: "#7C3AED" },
};

const KIND_OPTIONS: { value: MealKind | ""; label: string; emoji: string }[] = [
  { value: "petit_dejeuner", label: "Petit-déj.",   emoji: "🌅" },
  { value: "dejeuner",       label: "Déjeuner",     emoji: "☀️" },
  { value: "diner",          label: "Soir",          emoji: "🌙" },
];

function formatSource(source: string | null) {
  switch (source) {
    case "scan_photo":  return "Photo IA";
    case "recherche":   return "Recherche";
    case "code_barre":  return "Code-barre";
    default:            return "Manuel";
  }
}

const MACROS = [
  { key: "total_protein_g" as const, label: "Protéines", color: "#1A5CFF", bg: "#EEF3FF" },
  { key: "total_carbs_g"   as const, label: "Glucides",  color: "#FF6B1A", bg: "#FFF3EC" },
  { key: "total_fat_g"     as const, label: "Lipides",   color: "#D98A1A", bg: "#FFF7E8" },
];

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".05em",
  color: "#9595A8",
};

export function MealDetail({ meal, items }: { meal: Meal; items: MealItem[] }) {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError]   = useState<string | null>(null);
  const [pending, start]    = useTransition();
  const [currentKind, setCurrentKind] = useState<MealKind | "">(meal.kind ?? "");

  function handleKindChange(value: MealKind | "") {
    setCurrentKind(value);
    start(async () => {
      const res = await updateMealKind(meal.id, value || null);
      if (res?.error) setError(res.error);
    });
  }

  function handleDeleteItem(itemId: string) {
    start(async () => {
      const res = await deleteMealItem(meal.id, itemId);
      if (res?.error) setError(res.error);
    });
  }

  function handleDeleteMeal() {
    if (!deleteConfirm) { setDeleteConfirm(true); return; }
    start(async () => {
      const res = await deleteMeal(meal.id);
      if (res?.error) setError(res.error);
    });
  }

  const time = new Date(meal.consumed_at).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const date = new Date(meal.consumed_at).toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const activeMeta = currentKind ? KIND_META[currentKind] : null;

  return (
    <main
      className="page-bottom"
      style={{
        maxWidth: 448,
        margin: "0 auto",
        padding: "0 18px 0",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* ===== HEADER ===== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "14px 0 4px",
        }}
      >
        <button
          type="button"
          onClick={() => router.back()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: "#fff",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(26,26,46,.08)",
            color: "#6B6B82",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-.02em",
              color: "#1A1A2E",
            }}
          >
            {activeMeta ? `${activeMeta.emoji} ${activeMeta.label}` : "🍽️ Repas"}
          </h1>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#9595A8",
              marginTop: 2,
              textTransform: "capitalize",
            }}
          >
            {date} · {time} · {formatSource(meal.source)}
          </p>
        </div>
      </div>

      {/* ===== TOTAL ===== */}
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "18px 18px 16px",
          boxShadow: "0 8px 24px rgba(26,26,46,.06)",
        }}
      >
        <p style={LABEL_STYLE}>Total du repas</p>
        <p
          style={{
            fontSize: 38,
            fontWeight: 800,
            letterSpacing: "-.04em",
            color: "#1A1A2E",
            margin: "6px 0 14px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(meal.total_kcal)}{" "}
          <span style={{ fontSize: 16, color: "#9595A8", fontWeight: 600 }}>kcal</span>
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {MACROS.map((m) => (
            <div
              key={m.label}
              style={{
                flex: 1,
                background: m.bg,
                borderRadius: 12,
                padding: "9px 10px",
              }}
            >
              <p
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: m.color,
                  fontVariantNumeric: "tabular-nums",
                  margin: 0,
                }}
              >
                {Math.round(meal[m.key])}g
              </p>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#9595A8", margin: "2px 0 0" }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== TYPE DE REPAS ===== */}
      <div>
        <p style={{ ...LABEL_STYLE, marginBottom: 10, padding: "0 2px" }}>Type de repas</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {KIND_OPTIONS.map((o) => {
            const meta = KIND_META[o.value as MealKind];
            const active = currentKind === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => handleKindChange(o.value)}
                disabled={pending}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  padding: "12px 8px",
                  borderRadius: 16,
                  border: active ? `2px solid ${meta.color}` : "2px solid transparent",
                  background: active ? meta.tint : "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(26,26,46,.05)",
                  opacity: pending ? 0.6 : 1,
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 22 }}>{o.emoji}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: active ? meta.color : "#9595A8",
                  }}
                >
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ===== ALIMENTS ===== */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 2px 12px",
          }}
        >
          <h2 style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E" }}>
            Aliments
          </h2>
          {items.length > 0 && (
            <span style={{ fontSize: 12, fontWeight: 600, color: "#9595A8" }}>
              {items.length} élément{items.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {items.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              padding: "20px 16px",
              textAlign: "center",
              boxShadow: "0 4px 12px rgba(26,26,46,.04)",
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 600, color: "#9595A8" }}>Aucun aliment.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "#fff",
                  borderRadius: 18,
                  padding: 12,
                  boxShadow: "0 4px 12px rgba(26,26,46,.05)",
                }}
              >
                {/* Emoji aliment */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: "#F7F8FC",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {getFoodEmoji(it.name)}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#1A1A2E",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      margin: 0,
                    }}
                  >
                    {it.name}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "#9595A8", marginTop: 3 }}>
                    {it.quantity_g}g · {Math.round(it.kcal)} kcal · P {it.protein_g.toFixed(1)}g ·
                    G {it.carbs_g.toFixed(1)}g · L {it.fat_g.toFixed(1)}g
                  </p>
                </div>

                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", margin: 0, fontVariantNumeric: "tabular-nums" }}>
                    {Math.round(it.kcal)}
                  </p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: "#C4C4D1", margin: 0 }}>kcal</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteItem(it.id)}
                  disabled={pending}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: "#FFF0F0",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    opacity: pending ? 0.4 : 1,
                  }}
                  aria-label={`Supprimer ${it.name}`}
                >
                  <Trash2 size={15} color="#E5150A" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p style={{ fontSize: 13, fontWeight: 600, color: "#E5150A", padding: "0 2px" }}>
          {error}
        </p>
      )}

      {/* ===== SUPPRIMER LE REPAS ===== */}
      <button
        type="button"
        onClick={handleDeleteMeal}
        disabled={pending}
        style={{
          height: 50,
          borderRadius: 16,
          border: "none",
          background: deleteConfirm ? "#E5150A" : "#FFF0F0",
          color: deleteConfirm ? "#fff" : "#E5150A",
          fontSize: 14,
          fontWeight: 700,
          cursor: pending ? "not-allowed" : "pointer",
          fontFamily: "inherit",
          opacity: pending ? 0.5 : 1,
          transition: "background .2s, color .2s",
        }}
      >
        {deleteConfirm ? "⚠️  Confirmer la suppression" : "Supprimer ce repas"}
      </button>

      {deleteConfirm && (
        <button
          type="button"
          onClick={() => setDeleteConfirm(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: 13,
            fontWeight: 600,
            color: "#9595A8",
            cursor: "pointer",
            textAlign: "center",
            fontFamily: "inherit",
          }}
        >
          Annuler
        </button>
      )}
    </main>
  );
}
