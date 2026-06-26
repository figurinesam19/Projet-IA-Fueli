"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Trash2 } from "lucide-react";
import { deleteMeal, deleteMealItem, updateMealKind } from "./actions";

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

const KIND_LABELS: Record<MealKind, string> = {
  petit_dejeuner: "Petit-déjeuner",
  dejeuner: "Déjeuner",
  diner: "Repas du soir",
};

const KIND_OPTIONS: { value: MealKind | ""; label: string }[] = [
  { value: "", label: "Non défini" },
  { value: "petit_dejeuner", label: "Petit-déjeuner" },
  { value: "dejeuner", label: "Déjeuner" },
  { value: "diner", label: "Repas du soir" },
];

function formatSource(source: string | null) {
  switch (source) {
    case "scan_photo": return "Photo IA";
    case "recherche": return "Recherche texte";
    case "code_barre": return "Code-barre";
    default: return "Manuel";
  }
}

export function MealDetail({ meal, items }: { meal: Meal; items: MealItem[] }) {
  const router = useRouter();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function handleKindChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const value = e.target.value as MealKind | "";
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
    if (!deleteConfirm) {
      setDeleteConfirm(true);
      return;
    }
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

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 p-5">
      <header className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-5" />
        </button>
        <div>
          <h1 className="text-[22px] font-medium">
            {meal.kind ? KIND_LABELS[meal.kind] : "Repas"}
          </h1>
          <p className="text-xs text-muted-foreground">
            {date} · {time} · {formatSource(meal.source)}
          </p>
        </div>
      </header>

      {/* Total */}
      <div className="rounded-xl bg-primary p-4 text-primary-foreground">
        <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
          Total
        </p>
        <p className="mt-1 text-2xl font-medium">
          {Math.round(meal.total_kcal)} kcal
        </p>
        <p className="mt-1 text-xs opacity-80">
          P {Math.round(meal.total_protein_g)}g · G {Math.round(meal.total_carbs_g)}g · L {Math.round(meal.total_fat_g)}g
        </p>
      </div>

      {/* Changer le type de repas */}
      <div className="space-y-1">
        <label
          htmlFor="kind"
          className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
        >
          Type de repas
        </label>
        <select
          id="kind"
          defaultValue={meal.kind ?? ""}
          onChange={handleKindChange}
          disabled={pending}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground disabled:opacity-50"
        >
          {KIND_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      {/* Liste des aliments */}
      <section className="space-y-2">
        <h2 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Aliments ({items.length})
        </h2>
        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun aliment.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.id}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{it.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {it.quantity_g}g · {Math.round(it.kcal)} kcal · P{" "}
                    {it.protein_g.toFixed(1)}g · G {it.carbs_g.toFixed(1)}g · L{" "}
                    {it.fat_g.toFixed(1)}g
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteItem(it.id)}
                  disabled={pending}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive disabled:opacity-40"
                  aria-label={`Supprimer ${it.name}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Supprimer le repas */}
      <button
        type="button"
        onClick={handleDeleteMeal}
        disabled={pending}
        className={`w-full rounded-lg border py-3 text-sm font-medium transition disabled:opacity-40 ${
          deleteConfirm
            ? "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "border-border bg-card text-destructive hover:bg-muted"
        }`}
      >
        {deleteConfirm ? "Confirmer la suppression" : "Supprimer ce repas"}
      </button>

      {deleteConfirm && (
        <button
          type="button"
          onClick={() => setDeleteConfirm(false)}
          className="text-center text-sm text-muted-foreground hover:text-foreground"
        >
          Annuler
        </button>
      )}
    </main>
  );
}
