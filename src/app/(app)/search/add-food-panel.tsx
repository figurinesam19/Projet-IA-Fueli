"use client";

import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  computeMacrosForQuantity,
  type FoodResult,
} from "@/lib/openfoodfacts";
import { saveMealItem } from "../_actions/save-meal-item";

type Props = {
  food: FoodResult;
  source: "recherche" | "code_barre";
  onCancel: () => void;
};

export function AddFoodPanel({ food, source, onCancel }: Props) {
  const [quantity, setQuantity] = useState<number>(food.servingQuantity ?? 100);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const macros = computeMacrosForQuantity(food, quantity);

  function handleSave() {
    if (quantity <= 0) {
      setError("Saisis une quantité valide.");
      return;
    }
    start(async () => {
      const result = await saveMealItem({
        source,
        name: food.name,
        quantity_g: quantity,
        ...macros,
        off_barcode: food.code,
      });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 p-5">
      <header className="flex items-center gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h1 className="text-[22px] font-medium">Ajouter au journal</h1>
      </header>

      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
        {food.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={food.thumbnailUrl}
            alt=""
            className="size-14 rounded-lg object-cover"
          />
        ) : (
          <div className="size-14 rounded-lg bg-muted" />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">{food.name}</p>
          {food.brand && (
            <p className="truncate text-xs text-muted-foreground">
              {food.brand}
            </p>
          )}
          <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
            {Math.round(food.kcal_100g)} kcal / 100g
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantité (g)</Label>
        <Input
          id="quantity"
          type="number"
          min={0}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value) || 0)}
        />
      </div>

      <div className="rounded-xl bg-primary p-4 text-primary-foreground">
        <p className="text-[11px] font-medium uppercase tracking-wide opacity-80">
          Pour {quantity}g
        </p>
        <p className="mt-1 text-2xl font-medium">{macros.kcal} kcal</p>
        <p className="mt-1 text-xs opacity-80">
          P {macros.protein_g}g · G {macros.carbs_g}g · L {macros.fat_g}g
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={pending}
          className="flex-1 rounded-lg border border-border bg-card py-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="flex-1 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
        >
          {pending ? "Enregistrement…" : "Ajouter"}
        </button>
      </div>
    </main>
  );
}
