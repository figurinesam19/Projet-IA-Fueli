"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ScanBarcode, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FoodResult } from "@/lib/openfoodfacts";
import { AddFoodPanel } from "../search/add-food-panel";

export function BarcodeFlow() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<FoodResult | null>(null);

  async function handleLookup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const clean = code.replace(/\D/g, "");
    if (clean.length < 8) {
      setError("Code-barre invalide (8 à 13 chiffres).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/foods/barcode/${clean}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erreur");
        return;
      }
      setProduct(json.product);
    } catch {
      setError("Service indisponible");
    } finally {
      setLoading(false);
    }
  }

  if (product) {
    return (
      <AddFoodPanel
        food={product}
        source="code_barre"
        onCancel={() => setProduct(null)}
      />
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 p-5">
      <header className="flex items-center justify-between">
        <h1 className="text-[22px] font-medium">Scanner un code-barre</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      </header>

      <p className="text-sm text-muted-foreground">
        Saisis le code-barre du produit emballé (8 à 13 chiffres). On le cherche
        dans Open Food Facts.
      </p>

      <form onSubmit={handleLookup} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="code">Code-barre</Label>
          <div className="relative">
            <ScanBarcode className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="code"
              autoFocus
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="3017624010701"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={loading || code.trim().length < 8}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Recherche…
            </>
          ) : (
            "Rechercher"
          )}
        </button>
      </form>

      <p className="rounded-lg border border-dashed border-border bg-card p-3 text-xs text-muted-foreground">
        Bientôt : scan automatique depuis la caméra. En V1 on saisit le code à la
        main.
      </p>
    </main>
  );
}
