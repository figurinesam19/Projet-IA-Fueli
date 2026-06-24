"use client";

import { useEffect, useRef, useState } from "react";
import { Loader2, XCircle } from "lucide-react";

type Props = {
  onDetect: (code: string) => void;
};

export function BarcodeScanner({ onDetect }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onDetectRef = useRef(onDetect);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    onDetectRef.current = onDetect;
  }, [onDetect]);

  useEffect(() => {
    let stopped = false;
    let controls: { stop: () => void } | null = null;

    async function start() {
      try {
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        const reader = new BrowserMultiFormatReader();

        controls = await reader.decodeFromConstraints(
          { video: { facingMode: "environment" } },
          videoRef.current!,
          (result, _err, ctrl) => {
            if (stopped) return;
            if (result) {
              const code = result.getText();
              if (/^\d{8,13}$/.test(code)) {
                stopped = true;
                ctrl.stop();
                onDetectRef.current(code);
              }
            }
          },
        );

        if (!stopped) setReady(true);
      } catch {
        if (!stopped) {
          setError("Impossible d'accéder à la caméra. Vérifie les permissions HTTPS.");
        }
      }
    }

    start();

    return () => {
      stopped = true;
      controls?.stop();
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center">
        <XCircle className="size-8 text-destructive/60" />
        <p className="text-sm text-destructive">{error}</p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-xl bg-black" style={{ aspectRatio: "3/4" }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="size-7 animate-spin text-white/50" />
        </div>
      )}

      {ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Assombrissement autour de la zone de scan */}
          <div className="absolute inset-0 bg-black/50" style={{ WebkitMaskImage: "none" }} />

          {/* Zone de scan centrale */}
          <div className="relative z-10 h-32 w-72">
            {/* Fond transparent sur la zone */}
            <div className="absolute inset-0 rounded-lg bg-transparent outline outline-[9999px] outline-black/50" />

            {/* Coins */}
            <span className="absolute left-0 top-0 h-5 w-5 rounded-tl border-l-2 border-t-2 border-white" />
            <span className="absolute right-0 top-0 h-5 w-5 rounded-tr border-r-2 border-t-2 border-white" />
            <span className="absolute bottom-0 left-0 h-5 w-5 rounded-bl border-b-2 border-l-2 border-white" />
            <span className="absolute bottom-0 right-0 h-5 w-5 rounded-br border-b-2 border-r-2 border-white" />

            {/* Ligne de scan animée */}
            <div
              className="absolute inset-x-0 h-0.5 bg-primary/80"
              style={{ animation: "scan-line 1.6s ease-in-out infinite" }}
            />
          </div>
        </div>
      )}

      {ready && (
        <p className="absolute bottom-4 inset-x-0 text-center text-xs text-white/70">
          Centre le code-barre dans le cadre
        </p>
      )}

      <style>{`
        @keyframes scan-line {
          0%   { top: 8px; }
          50%  { top: calc(100% - 10px); }
          100% { top: 8px; }
        }
      `}</style>
    </div>
  );
}
