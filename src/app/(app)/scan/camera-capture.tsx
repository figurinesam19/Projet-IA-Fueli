"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, ImagePlus, Loader2, RotateCcw, XCircle } from "lucide-react";

type FacingMode = "environment" | "user";

type Props = {
  onCapture: (file: File) => void;
  onGallery: () => void;
};

export function CameraCapture({ onCapture, onGallery }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>("environment");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function start() {
      stopStream();
      setReady(false);
      setError(null);

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        if (cancelled) return;
        if (e instanceof Error) {
          if (e.name === "NotAllowedError") {
            setError("Accès refusé. Autorise la caméra dans les réglages de ton navigateur.");
          } else if (e.name === "NotFoundError") {
            setError("Aucune caméra trouvée sur cet appareil.");
          } else {
            setError("La caméra nécessite une connexion sécurisée (HTTPS).");
          }
        } else {
          setError("Impossible d'accéder à la caméra.");
        }
      }
    }

    start();

    return () => {
      cancelled = true;
      stopStream();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  function stopStream() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  function handleCapture() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !ready) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")?.drawImage(video, 0, 0);

    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        stopStream();
        onCapture(new File([blob], "photo.jpg", { type: "image/jpeg" }));
      },
      "image/jpeg",
      0.92,
    );
  }

  function toggleCamera() {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  }

  if (error) {
    return (
      <div className="space-y-3">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
          <XCircle className="size-8 text-destructive/60" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
        <button
          type="button"
          onClick={onGallery}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card p-3 text-sm font-medium text-foreground hover:bg-muted"
        >
          <ImagePlus className="size-4" />
          Importer depuis la galerie
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative overflow-hidden rounded-xl bg-black aspect-[3/4]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onLoadedMetadata={() => setReady(true)}
          className="h-full w-full object-cover"
        />

        {!ready && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-7 animate-spin text-white/50" />
          </div>
        )}

        {/* Guides de cadrage */}
        {ready && (
          <div className="pointer-events-none absolute inset-6">
            <span className="absolute left-0 top-0 h-6 w-6 rounded-tl border-l-2 border-t-2 border-white/60" />
            <span className="absolute right-0 top-0 h-6 w-6 rounded-tr border-r-2 border-t-2 border-white/60" />
            <span className="absolute bottom-0 left-0 h-6 w-6 rounded-bl border-b-2 border-l-2 border-white/60" />
            <span className="absolute bottom-0 right-0 h-6 w-6 rounded-br border-b-2 border-r-2 border-white/60" />
          </div>
        )}

        {/* Bouton retourner caméra */}
        <button
          type="button"
          onClick={toggleCamera}
          className="absolute right-3 top-3 rounded-full bg-black/40 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
          aria-label="Retourner la caméra"
        >
          <RotateCcw className="size-5" />
        </button>
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Bouton déclencheur */}
      <div className="flex items-center justify-center gap-6">
        <button
          type="button"
          onClick={onGallery}
          className="flex flex-col items-center gap-1 text-muted-foreground transition hover:text-foreground"
          aria-label="Galerie"
        >
          <ImagePlus className="size-6" />
          <span className="text-[10px]">Galerie</span>
        </button>

        <button
          type="button"
          onClick={handleCapture}
          disabled={!ready}
          className="flex size-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition hover:bg-primary/90 disabled:opacity-40"
          aria-label="Prendre la photo"
        >
          <Camera className="size-7" />
        </button>

        {/* Placeholder symétrique */}
        <div className="size-6" />
      </div>
    </div>
  );
}
