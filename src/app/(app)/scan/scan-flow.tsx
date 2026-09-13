"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { compressImage } from "@/lib/image";
import { saveScannedMeal, type ScanItem } from "./actions";
import { ReviewItems } from "./review-items";
import { CameraCapture } from "./camera-capture";

type MealKind = "petit_dejeuner" | "dejeuner" | "diner";
type Stage = "capture" | "analyzing" | "review";

export function ScanFlow({ day = null }: { day?: string | null }) {
  const router = useRouter();
  const fileInput = useRef<HTMLInputElement>(null);

  const [stage, setStage]         = useState<Stage>("capture");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [items, setItems]         = useState<ScanItem[]>([]);
  const [confidence, setConfidence] = useState<"high" | "medium" | "low" | null>(null);
  const [kind, setKind]           = useState<MealKind | null>(null);
  const [error, setError]         = useState<string | null>(null);
  const [pending, start]          = useTransition();

  async function handleFile(file: File) {
    setError(null);
    setStage("analyzing");

    try {
      const blob = await compressImage(file);
      setPreviewUrl(URL.createObjectURL(blob));

      const fd = new FormData();
      fd.append("image", blob, "meal.jpg");

      const res  = await fetch("/api/scan", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error || "Erreur d'analyse");
        setStage("capture");
        return;
      }
      if (!json.items?.length) {
        const REJECTION_MESSAGES: Record<string, string> = {
          blurry:        "📷  Photo trop floue — stabilise ton téléphone et reprends la photo.",
          poor_lighting: "💡  Photo trop sombre ou surexposée — améliore l'éclairage et réessaie.",
          no_food:       "🍽️  Aucune nourriture détectée — cadre bien l'assiette et réessaie.",
          unanalyzable:  "❌  Photo inexploitable — essaie un autre angle ou importe depuis la galerie.",
        };
        const reason = json.rejection_reason as string | null;
        setError(
          reason && REJECTION_MESSAGES[reason]
            ? REJECTION_MESSAGES[reason]
            : "Aucun aliment détecté — reprends la photo en cadrant mieux l'assiette.",
        );
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
    setKind(null);
    setStage("capture");
  }

  function handleSave(items: ScanItem[]) {
    start(async () => {
      const result = await saveScannedMeal({ items, kind, day });
      if (result?.error) setError(result.error);
    });
  }

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
      {/* Header */}
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
        <h1
          style={{
            fontSize: 20,
            fontWeight: 800,
            letterSpacing: "-.02em",
            color: "#1A1A2E",
          }}
        >
          {stage === "review" ? "Valider le repas" : "Scanner un plat"}
        </h1>
      </div>

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
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#9595A8", padding: "0 2px" }}>
            Cadre ton repas bien au centre, vue de dessus si possible.
          </p>
          <CameraCapture onCapture={handleFile} onGallery={openGallery} />
          {error && (
            <p style={{ fontSize: 13, fontWeight: 600, color: "#E5150A", padding: "0 2px" }}>
              {error}
            </p>
          )}
        </div>
      )}

      {stage === "analyzing" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {previewUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt="Repas"
              style={{
                width: "100%",
                aspectRatio: "16/9",
                objectFit: "cover",
                borderRadius: 18,
                display: "block",
              }}
            />
          )}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              background: "#fff",
              borderRadius: 16,
              padding: 18,
              boxShadow: "0 4px 12px rgba(26,26,46,.06)",
              fontSize: 14,
              fontWeight: 600,
              color: "#3A3A52",
            }}
          >
            <Loader2
              size={18}
              style={{
                color: "#1A5CFF",
                animation: "spin 1s linear infinite",
              }}
            />
            Analyse IA en cours…
          </div>
        </div>
      )}

      {stage === "review" && (
        <ReviewItems
          previewUrl={previewUrl}
          confidence={confidence}
          items={items}
          kind={kind}
          onChange={setItems}
          onKindChange={setKind}
          onCancel={reset}
          onSave={handleSave}
          pending={pending}
          error={error}
        />
      )}
    </main>
  );
}
