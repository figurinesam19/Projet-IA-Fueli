"use client";

import { Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ScanItem } from "./actions";

type Props = {
  previewUrl: string | null;
  confidence: "high" | "medium" | "low" | null;
  items: ScanItem[];
  onChange: (items: ScanItem[]) => void;
  onCancel: () => void;
  onSave: (items: ScanItem[]) => void;
  pending: boolean;
  error: string | null;
};

export function ReviewItems({
  previewUrl,
  confidence,
  items,
  onChange,
  onCancel,
  onSave,
  pending,
  error,
}: Props) {
  const totals = items.reduce(
    (acc, it) => ({
      kcal: acc.kcal + it.kcal,
      protein_g: acc.protein_g + it.protein_g,
      carbs_g: acc.carbs_g + it.carbs_g,
      fat_g: acc.fat_g + it.fat_g,
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
      kcal: Math.round(it.kcal * ratio),
      protein_g: Math.round(it.protein_g * ratio * 10) / 10,
      carbs_g: Math.round(it.carbs_g * ratio * 10) / 10,
      fat_g: Math.round(it.fat_g * ratio * 10) / 10,
    });
  }

  return (
    <div className="space-y-4">
      {previewUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewUrl}
          alt="Repas"
          className="aspect-video w-full rounded-xl object-cover"
        />
      )}

      {confidence && confidence !== "high" && (
        <div className="rounded-lg border border-border bg-card p-3 text-xs text-muted-foreground">
          {confidence === "medium"
            ? "Confiance moyenne — vérifie les quantités."
            : "Confiance faible — ajuste les estimations si besoin."}
        </div>
      )}

      <div className="rounded-xl bg-primary p-4 text-primary-foreground">
        <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
          Total estimé
        </p>
        <p className="mt-1 text-2xl font-medium">
          {Math.round(totals.kcal)} kcal
        </p>
        <p className="mt-1 text-xs opacity-80">
          P {Math.round(totals.protein_g)}g · G {Math.round(totals.carbs_g)}g · L{" "}
          {Math.round(totals.fat_g)}g
        </p>
      </div>

      <ul className="space-y-3">
        {items.map((it, i) => (
          <li
            key={i}
            className="space-y-3 rounded-xl border border-border bg-card p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <Input
                value={it.name}
                onChange={(e) => updateItem(i, { name: e.target.value })}
                className="h-8 flex-1"
              />
              <button
                type="button"
                onClick={() => removeItem(i)}
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Supprimer"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Quantité (g)
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={it.quantity_g}
                  onChange={(e) =>
                    scaleByQuantity(i, Number(e.target.value) || 0)
                  }
                  className="h-8"
                />
              </div>
              <div>
                <Label className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  Kcal
                </Label>
                <Input
                  type="number"
                  min={0}
                  value={Math.round(it.kcal)}
                  onChange={(e) =>
                    updateItem(i, { kcal: Number(e.target.value) || 0 })
                  }
                  className="h-8"
                />
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              P {it.protein_g.toFixed(1)}g · G {it.carbs_g.toFixed(1)}g · L{" "}
              {it.fat_g.toFixed(1)}g
            </p>
          </li>
        ))}
      </ul>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="flex-1 rounded-lg border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          Reprendre
        </button>
        <button
          type="button"
          onClick={() => onSave(items)}
          disabled={pending || items.length === 0}
          className="flex-1 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Enregistrer le repas"}
        </button>
      </div>
    </div>
  );
}
