"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  consumedKcal: number;
  targetKcal: number;
};

const C = 2 * Math.PI * 78; // ≈ 490.1

/**
 * Compte de la valeur précédemment affichée jusqu'à `target`, en easeOutCubic
 * (même ressenti que le cubic-bezier de l'anneau). Au changement de jour on
 * repart de la valeur courante — pas d'aller-retour par zéro. Respecte
 * prefers-reduced-motion.
 */
function useCountUp(target: number, duration = 900, delay = 80) {
  const [value, setValue] = useState(0);
  const fromRef = useRef(0);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    if (reduce || from === target) {
      fromRef.current = target;
      setValue(target);
      return;
    }

    let raf = 0;
    let startTs = 0;
    const tick = (now: number) => {
      if (!startTs) startTs = now;
      const t = Math.min((now - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (target - from) * eased);
      fromRef.current = current;
      setValue(current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const to = setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(to);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return value;
}

export function DailyCard({ consumedKcal, targetKcal }: Props) {
  const remaining = Math.max(targetKcal - consumedKcal, 0);
  const pct = Math.min((consumedKcal / targetKcal) * 100, 100);
  const [animPct, setAnimPct] = useState(0);
  const displayKcal = useCountUp(consumedKcal);

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 80);
    return () => clearTimeout(t);
  }, [pct]);

  // Arc minimum visible dès qu'il y a des calories
  const filled = animPct > 0 ? Math.max((animPct / 100) * C, C * 0.04) : 0;
  const offset = C - filled;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 26,
        padding: "24px 22px",
        boxShadow: "0 12px 30px rgba(26,26,46,.07),0 1px 3px rgba(26,26,46,.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Décoration */}
      <div
        style={{
          position: "absolute",
          top: -40,
          right: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: "radial-gradient(circle,#EEF3FF,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <p
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: ".08em",
          textTransform: "uppercase",
          color: "#9595A8",
          position: "relative",
        }}
      >
        Bilan du jour
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "10px 0 4px",
          position: "relative",
        }}
      >
        <svg width="200" height="200" viewBox="0 0 180 180">
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#4D7CFF" />
              <stop offset="100%" stopColor="#1A5CFF" />
            </linearGradient>
          </defs>
          {/* Piste vide */}
          <circle
            cx="90"
            cy="90"
            r="78"
            fill="none"
            stroke="#EDEEF4"
            strokeWidth="15"
          />
          {/* Arc coloré — strokeDasharray/offset dans style pour que la CSS transition fonctionne */}
          <circle
            cx="90"
            cy="90"
            r="78"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="15"
            strokeLinecap="round"
            transform="rotate(-90 90 90)"
            style={{
              strokeDasharray: `${C}`,
              strokeDashoffset: `${offset}`,
              transition: "stroke-dashoffset 0.9s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: 42,
              fontWeight: 800,
              letterSpacing: "-.04em",
              lineHeight: 1,
              color: "#1A1A2E",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {displayKcal.toLocaleString("fr-FR")}
          </span>
          {remaining > 0 ? (
            <span style={{ fontSize: 13, fontWeight: 600, color: "#9595A8", marginTop: 4 }}>
              sur {targetKcal.toLocaleString("fr-FR")} kcal
            </span>
          ) : (
            <span
              style={{
                marginTop: 8,
                background: "#34D399",
                color: "#fff",
                fontSize: 12,
                fontWeight: 800,
                padding: "5px 12px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                boxShadow: "0 4px 12px rgba(52,211,153,.35)",
              }}
            >
              Objectif atteint 🎯
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
