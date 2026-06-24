"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { FoodResult } from "@/lib/openfoodfacts";
import { getFoodEmoji } from "@/lib/food-emoji";
import { AddFoodPanel } from "./add-food-panel";

export function SearchFlow() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<FoodResult | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Debounced search
  useEffect(() => {
    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setError(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      const ctl = new AbortController();
      abortRef.current = ctl;
      try {
        const res = await fetch(
          `/api/foods/search?q=${encodeURIComponent(q)}`,
          { signal: ctl.signal },
        );
        const json = await res.json();
        if (!res.ok) {
          setError(json.error || "Erreur");
          setResults([]);
          return;
        }
        setResults(json.results ?? []);
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError("Recherche indisponible");
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(handle);
  }, [query]);

  if (selected) {
    return (
      <AddFoodPanel
        food={selected}
        source="recherche"
        onCancel={() => setSelected(null)}
      />
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-4 p-5">
      <header className="flex items-center justify-between">
        <h1 className="text-[22px] font-medium">Rechercher un aliment</h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      </header>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          autoFocus
          placeholder="Pâtes, pomme, yaourt nature…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Recherche…
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loading && query.trim().length >= 2 && results.length === 0 && !error && (
        <p className="text-sm text-muted-foreground">
          Aucun résultat. Essaie une autre formulation ou un code-barre.
        </p>
      )}

      <ul className="space-y-2">
        {results.map((r) => (
          <li key={r.code}>
            <button
              type="button"
              onClick={() => setSelected(r)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left transition hover:border-primary"
            >
              {r.thumbnailUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.thumbnailUrl}
                  alt=""
                  className="size-12 rounded-lg object-cover"
                />
              ) : (
                <div className="flex size-12 items-center justify-center rounded-lg bg-muted text-2xl">
                  {getFoodEmoji(r.name)}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{r.name}</p>
                {r.brand && (
                  <p className="truncate text-xs text-muted-foreground">
                    {r.brand}
                  </p>
                )}
              </div>
              <div className="shrink-0 text-right">
                <p className="text-sm font-medium">{Math.round(r.kcal_100g)} kcal</p>
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
                  / 100g
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
