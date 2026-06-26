"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Keyboard, Loader2, ScanBarcode, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FoodResult } from "@/lib/openfoodfacts";
import { AddFoodPanel } from "../search/add-food-panel";
import { BarcodeScanner } from "./barcode-scanner";

type Mode = "camera" | "manual";

export function BarcodeFlow() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("camera");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<FoodResult | null>(null);

  async function lookup(rawCode: string) {
    const clean = rawCode.replace(/\D/g, "");
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
        setError(json.error || "Produit introuvable dans Open Food Facts.");
        return;
      }
      setProduct(json.product);
    } catch {
      setError("Service indisponible, réessaie.");
    } finally {
      setLoading(false);
    }
  }

  function handleDetect(detectedCode: string) {
    setCode(detectedCode);
    lookup(detectedCode);
  }

  function handleManualSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    lookup(code);
  }

  function reset() {
    setProduct(null);
    setCode("");
    setError(null);
    setMode("camera");
  }

  if (product) {
    return <AddFoodPanel food={product} source="code_barre" onCancel={reset} />;
  }

  return (
    <main className="page-bottom mx-auto flex w-full max-w-md flex-col gap-5 px-5 pt-5">
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

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-12">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Recherche du produit…</p>
          {code && (
            <p className="font-mono text-xs text-muted-foreground">{code}</p>
          )}
        </div>
      ) : mode === "camera" ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Pointe la caméra vers le code-barre du produit.
          </p>
          <BarcodeScanner onDetect={handleDetect} />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="button"
            onClick={() => { setError(null); setMode("manual"); }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            <Keyboard className="size-4" />
            Saisir le code manuellement
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Saisis les chiffres du code-barre (8 à 13 chiffres).
          </p>
          <form onSubmit={handleManualSubmit} className="space-y-3">
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
              disabled={code.trim().length < 8}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              Rechercher
            </button>
          </form>
          <button
            type="button"
            onClick={() => { setError(null); setMode("camera"); }}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground hover:bg-muted"
          >
            <ScanBarcode className="size-4" />
            Utiliser la caméra
          </button>
        </div>
      )}
    </main>
  );
}
