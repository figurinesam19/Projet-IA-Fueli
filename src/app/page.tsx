"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSplashDestination } from "./splash-destination";

// Circumférence r=48 : 2π×48 ≈ 301.6 px → arc 27% ≈ 82px
const RADIUS = 48;
const CIRC = 2 * Math.PI * RADIUS;
const ARC = CIRC * 0.27;
const GAP = CIRC - ARC;

const MIN_DISPLAY_MS = 1800;

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const minDelay = new Promise<void>((res) =>
      setTimeout(res, MIN_DISPLAY_MS),
    );
    getSplashDestination().then((dest) => {
      minDelay.then(() => router.replace(dest));
    });
  }, [router]);

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
        gap: 0,
      }}
    >
      {/* Arc tournant + logo centré */}
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
        {/* SVG arc rotatif */}
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

        {/* Logo "fueli" */}
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

      {/* Tagline */}
      <p
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: "#C4C4D1",
          marginTop: 28,
          letterSpacing: "0.01em",
          animation: "splash-fade-in 0.5s 0.2s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        Comprends ce que tu manges
      </p>
    </div>
  );
}
