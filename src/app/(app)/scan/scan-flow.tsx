"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { compressImage } from "@/lib/image";
import { saveScannedMeal, type ScanItem } from "./actions";
import { ReviewItems } from "./review-items";
import { CameraCapture } from "./camera-capture";

type Stage = "capture" | "analyzing" | "review";

export function ScanFlow() {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [stage, setStage] = useState<Stage>("capture");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [items, setItems] = useState<ScanItem[]>([]);
  const [confidence, setConfidence] = useState<"high" | "medium" | "low" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  async function handleFile(file: File) {
    setError(null);
    setStage("analyzing");

    try {
      const blob = await compressImage(file);
      setPreviewUrl(URL.createObjectURL(blob));

      const fd = new FormData();
      fd.append("image", blob, "meal.jpg");

      const res = await fetch("/api/scan", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erreur d'analyse");
        setStage("capture");
        return;
      }
      if (!json.items?.length) {
        setError("Aucun aliment détecté. Reprends la photo en cadrant mieux l'assiette.");
        setStage("capture");
        return;
      }
      setItems(json.items);
      setConfidence(json.confidence);
      setStage("review");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
      setStage("capture");
    }
  }

  function openGallery() {
    fileInput.current?.click();
  }

  function reset() {
    setItems([]);
    setConfidence(null);
    setPreviewUrl(null);
    setError(null);
    setStage("capture");
  }

  function handleSave(items: ScanItem[]) {
    start(async () => {
      const result = await saveScannedMeal({ items, kind: null });
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-5 p-5">
      <header className="flex items-center justify-between">
        <h1 className="text-[22px] font-medium">
          {stage === "review" ? "Valider le repas" : "Scanner un plat"}
        </h1>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md p-1 text-muted-foreground hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      </header>

      {/* Input galerie caché */}
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {stage === "capture" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Cadre ton repas bien au centre, vue de dessus si possible.
          </p>
          <CameraCapture onCapture={handleFile} onGallery={openGallery} />
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}

      {stage === "analyzing" && (
        <div className="space-y-4">
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Repas"
              className="aspect-square w-full rounded-xl object-cover"
            />
          )}
          <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card p-4 text-sm">
            <Loader2 className="size-4 animate-spin text-primary" />
            <span>Analyse en cours…</span>
          </div>
        </div>
      )}

      {stage === "review" && (
        <ReviewItems
          previewUrl={previewUrl}
          confidence={confidence}
          items={items}
          onChange={setItems}
          onCancel={reset}
          onSave={handleSave}
          pending={pending}
          error={error}
        />
      )}
    </main>
  );
}
