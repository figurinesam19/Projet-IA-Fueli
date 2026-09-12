"use client";

import { useEffect, useRef, useState } from "react";

const RADIUS = 48;
const CIRC = 2 * Math.PI * RADIUS;
const ARC = CIRC * 0.27;
const GAP = CIRC - ARC;

const MIN_DISPLAY_MS = 1800;
const FADE_MS = 300;

export function SplashOverlay() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  // Stocke la fonction d'annulation des timers en cours
  const cleanupRef = useRef<(() => void) | null>(null);

  const showSplash = () => {
    // Annule les timers précédents si un splash est déjà en cours
    cleanupRef.current?.();
    setFading(false);
    setVisible(true);
    const t1 = setTimeout(() => setFading(true), MIN_DISPLAY_MS);
    const t2 = setTimeout(() => setVisible(false), MIN_DISPLAY_MS + FADE_MS);
    cleanupRef.current = () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  };

  useEffect(() => {
    // Lancement initial
    showSplash();

    // iOS PWA bfcache : quand l'app revient du background, pageshow se déclenche
    // avec persisted=true. On réaffiche le splash à chaque résurrection.
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) showSplash();
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      cleanupRef.current?.();
      window.removeEventListener("pageshow", handlePageShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        opacity: fading ? 0 : 1,
        transition: `opacity ${FADE_MS}ms ease`,
      }}
    >
      <div
        style={{
          position: "relative",
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "splash-fade-in 0.5s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          style={{
            position: "absolute",
            inset: 0,
            animation: "splash-spin 1.25s linear infinite",
            transformOrigin: "60px 60px",
          }}
          aria-hidden="true"
        >
          <circle
            cx="60"
            cy="60"
            r={RADIUS}
            fill="none"
            stroke="#1A5CFF"
            strokeWidth="2.5"
            strokeDasharray={`${ARC} ${GAP}`}
            strokeLinecap="round"
          />
        </svg>
        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: "#1A5CFF",
            letterSpacing: "-0.04em",
            userSelect: "none",
          }}
        >
          fueli
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#C4C4D1",
          marginTop: 28,
          letterSpacing: "0.01em",
          animation:
            "splash-fade-in 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        Comprends ce que tu manges
      </p>
    </div>
  );
}
