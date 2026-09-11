"use client";

import { Trash2 } from "lucide-react";
import { getFoodEmoji } from "@/lib/food-emoji";
import type { ScanItem } from "./actions";

type MealKind = "petit_dejeuner" | "dejeuner" | "diner";

const KIND_OPTIONS: { value: MealKind; label: string; emoji: string; tint: string; color: string }[] = [
  { value: "petit_dejeuner", label: "Petit-déj.", emoji: "🌅", tint: "#FFF7E8", color: "#D98A1A" },
  { value: "dejeuner",       label: "Déjeuner",   emoji: "☀️",  tint: "#EEF3FF", color: "#1A5CFF" },
  { value: "diner",          label: "Soir",        emoji: "🌙",  tint: "#F1ECFF", color: "#7C3AED" },
];

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".05em",
  color: "#9595A8",
};

const MACROS = [
  { key: "protein_g" as const, label: "Protéines", color: "#1A5CFF", bg: "#EEF3FF" },
  { key: "carbs_g"   as const, label: "Glucides",  color: "#FF6B1A", bg: "#FFF3EC" },
  { key: "fat_g"     as const, label: "Lipides",   color: "#D98A1A", bg: "#FFF7E8" },
];

type Props = {
  previewUrl: string | null;
  confidence: "high" | "medium" | "low" | null;
  items: ScanItem[];
  kind: MealKind | null;
  onChange: (items: ScanItem[]) => void;
  onKindChange: (kind: MealKind | null) => void;
  onCancel: () => void;
  onSave: (items: ScanItem[]) => void;
  pending: boolean;
  error: string | null;
};

export function ReviewItems({
  previewUrl,
  confidence,
  items,
  kind,
  onChange,
  onKindChange,
  onCancel,
  onSave,
  pending,
  error,
}: Props) {
  const totals = items.reduce(
    (acc, it) => ({
      kcal:      acc.kcal + it.kcal,
      protein_g: acc.protein_g + it.protein_g,
      carbs_g:   acc.carbs_g + it.carbs_g,
      fat_g:     acc.fat_g + it.fat_g,
    }),
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0 },
  );

  function updateItem(i: number, patch: Partial<ScanItem>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    onChange(next);
  }

  function removeItem(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function scaleByQuantity(i: number, newQuantity: number) {
    const it = items[i];
    if (!it.quantity_g || it.quantity_g <= 0) {
      updateItem(i, { quantity_g: newQuantity });
      return;
    }
    const ratio = newQuantity / it.quantity_g;
    updateItem(i, {
      quantity_g: newQuantity,
      kcal:      Math.round(it.kcal * ratio),
      protein_g: Math.round(it.protein_g * ratio * 10) / 10,
      carbs_g:   Math.round(it.carbs_g * ratio * 10) / 10,
      fat_g:     Math.round(it.fat_g * ratio * 10) / 10,
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {/* Photo miniature */}
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Repas scanné"
          style={{
            width: "100%",
            aspectRatio: "16/9",
            objectFit: "cover",
            borderRadius: 18,
            display: "block",
          }}
        />
      )}

      {/* Alerte confiance faible/moyenne */}
      {confidence && confidence !== "high" && (
        <div
          style={{
            background: "#FFF7E8",
            borderRadius: 14,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 600,
            color: "#D98A1A",
          }}
        >
          {confidence === "medium"
            ? "⚠️  Confiance moyenne — vérifie les quantités."
            : "⚠️  Confiance faible — ajuste les estimations si besoin."}
        </div>
      )}

      {/* Carte totaux */}
      <div
        style={{
          background: "#fff",
          borderRadius: 22,
          padding: "16px 18px",
          boxShadow: "0 8px 24px rgba(26,26,46,.06)",
        }}
      >
        <p style={LABEL_STYLE}>Total estimé</p>
        <p
          style={{
            fontSize: 36,
            fontWeight: 800,
            letterSpacing: "-.04em",
            color: "#1A1A2E",
            margin: "6px 0 14px",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {Math.round(totals.kcal)}{" "}
          <span style={{ fontSize: 15, color: "#9595A8", fontWeight: 600 }}>kcal</span>
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          {MACROS.map((m) => (
            <div
              key={m.key}
              style={{
                flex: 1,
                background: m.bg,
                borderRadius: 12,
                padding: "9px 10px",
              }}
            >
              <p style={{ fontSize: 15, fontWeight: 800, color: m.color, fontVariantNumeric: "tabular-nums", margin: 0 }}>
                {Math.round(totals[m.key])}g
              </p>
              <p style={{ fontSize: 10, fontWeight: 600, color: "#9595A8", margin: "2px 0 0" }}>
                {m.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Aliments */}
      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px 10px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E" }}>
            Aliments détectés
          </h2>
          <span style={{ fontSize: 12, fontWeight: 600, color: "#9595A8" }}>
            {items.length} élément{items.length > 1 ? "s" : ""}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 18,
                padding: 14,
                boxShadow: "0 4px 12px rgba(26,26,46,.05)",
              }}
            >
              {/* Ligne nom + poubelle */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 22, flexShrink: 0 }}>{getFoodEmoji(it.name)}</span>
                <input
                  value={it.name}
                  onChange={(e) => updateItem(i, { name: e.target.value })}
                  className="fu-input"
                  style={{ flex: 1, padding: "9px 12px", fontSize: 14 }}
                />
                <button
                  type="button"
                  onClick={() => removeItem(i)}
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
                  }}
                  aria-label="Supprimer"
                >
                  <Trash2 size={15} color="#E5150A" />
                </button>
              </div>

              {/* Quantité + kcal */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <div>
                  <p style={{ ...LABEL_STYLE, marginBottom: 5 }}>Quantité (g)</p>
                  <input
                    type="number"
                    min={0}
                    value={it.quantity_g}
                    onChange={(e) => scaleByQuantity(i, Number(e.target.value) || 0)}
                    className="fu-input"
                    style={{ width: "100%", padding: "9px 12px", fontSize: 14 }}
                  />
                </div>
                <div>
                  <p style={{ ...LABEL_STYLE, marginBottom: 5 }}>Kcal</p>
                  <input
                    type="number"
                    min={0}
                    value={Math.round(it.kcal)}
                    onChange={(e) => updateItem(i, { kcal: Number(e.target.value) || 0 })}
                    className="fu-input"
                    style={{ width: "100%", padding: "9px 12px", fontSize: 14 }}
                  />
                </div>
              </div>

              <p style={{ fontSize: 11, fontWeight: 500, color: "#9595A8", marginTop: 8 }}>
                P {it.protein_g.toFixed(1)}g · G {it.carbs_g.toFixed(1)}g · L {it.fat_g.toFixed(1)}g
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sélecteur type de repas */}
      <div>
        <p style={{ ...LABEL_STYLE, marginBottom: 10, padding: "0 2px" }}>
          Type de repas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {KIND_OPTIONS.map((o) => {
            const active = kind === o.value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => onKindChange(active ? null : o.value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  padding: "12px 8px",
                  borderRadius: 16,
                  border: active ? `2px solid ${o.color}` : "2px solid transparent",
                  background: active ? o.tint : "#fff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  boxShadow: "0 2px 8px rgba(26,26,46,.05)",
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 22 }}>{o.emoji}</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: active ? o.color : "#9595A8" }}>
                  {o.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <p style={{ fontSize: 13, fontWeight: 600, color: "#E5150A", padding: "0 2px" }}>
          {error}
        </p>
      )}

      {/* Boutons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 10 }}>
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          style={{
            height: 52,
            borderRadius: 16,
            background: "#F7F8FC",
            border: "none",
            fontSize: 14,
            fontWeight: 700,
            color: "#6B6B82",
            cursor: pending ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          Reprendre
        </button>
        <button
          type="button"
          onClick={() => onSave(items)}
          disabled={pending || items.length === 0}
          style={{
            height: 52,
            borderRadius: 16,
            background: (pending || items.length === 0)
              ? "#FFB899"
              : "linear-gradient(135deg,#FF8C42,#FF6B1A)",
            border: "none",
            color: "#fff",
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "-.01em",
            cursor: (pending || items.length === 0) ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            boxShadow: (pending || items.length === 0) ? "none" : "0 8px 20px rgba(255,107,26,.35)",
          }}
        >
          {pending ? "Enregistrement…" : "Enregistrer →"}
        </button>
      </div>
    </div>
  );
}
