"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2, X } from "lucide-react";
import { saveWeight, deleteWeight } from "./actions";

export type WeightLog = { logged_on: string; weight_kg: number };

type Goal = "perte" | "masse" | "equilibre" | null;

type Props = {
  /** Toutes les pesées, ordre chronologique croissant. */
  logs: WeightLog[];
  goal: Goal;
  /** Jour courant (AAAA-MM-JJ), calculé côté serveur pour éviter les surprises de fuseau. */
  todayKey: string;
};

/** Perdre → baisse = vert ; prise de masse → hausse = vert ; sinon neutre. */
function deltaColor(delta: number, goal: Goal): string {
  if (delta === 0 || goal === "equilibre" || goal === null) return "#6B6B82";
  const good = goal === "perte" ? delta < 0 : delta > 0;
  return good ? "#059669" : "#E5550A";
}

function parseDay(key: string): Date {
  return new Date(key + "T12:00:00");
}
function fmtShort(key: string): string {
  return parseDay(key).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
}
function fmtLong(key: string): string {
  return parseDay(key).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}
function signed(n: number): string {
  const r = Math.round(n * 10) / 10;
  return (r > 0 ? "+" : "") + r.toLocaleString("fr-FR") + " kg";
}

function Chart({ logs }: { logs: WeightLog[] }) {
  const W = 376;
  const H = 168;
  const PADX = 10;
  const PADTOP = 14;
  const PADBOT = 26;

  const weights = logs.map((l) => l.weight_kg);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const pad = Math.max(0.5, (max - min) * 0.15);
  const lo = min - pad;
  const hi = max + pad;

  const x = (i: number) =>
    logs.length === 1 ? W / 2 : PADX + (i / (logs.length - 1)) * (W - PADX * 2);
  const y = (w: number) => PADTOP + (1 - (w - lo) / (hi - lo)) * (H - PADTOP - PADBOT);

  const pts = logs.map((l, i) => ({ x: x(i), y: y(l.weight_kg) }));
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const baseline = H - PADBOT;
  const area = `M ${pts[0].x},${baseline} L ${line.split(" ").join(" L ")} L ${pts[pts.length - 1].x},${baseline} Z`;
  const last = pts[pts.length - 1];

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: "block" }}>
      <defs>
        <linearGradient id="wfill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A5CFF" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#1A5CFF" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Repères horizontaux min / max */}
      {[hi - pad, lo + pad].map((val, i) => (
        <g key={i}>
          <line
            x1={PADX}
            x2={W - PADX}
            y1={y(val)}
            y2={y(val)}
            stroke="#EEF0F6"
            strokeWidth="1"
          />
          <text x={PADX} y={y(val) - 4} fontSize="10" fontWeight="600" fill="#C4C4D1">
            {val.toLocaleString("fr-FR")} kg
          </text>
        </g>
      ))}

      {logs.length > 1 && <path d={area} fill="url(#wfill)" />}
      {logs.length > 1 && (
        <polyline
          points={line}
          fill="none"
          stroke="#1A5CFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <circle cx={last.x} cy={last.y} r="4" fill="#1A5CFF" stroke="#fff" strokeWidth="2" />

      {/* Dates début / fin */}
      <text x={PADX} y={H - 6} fontSize="10" fontWeight="600" fill="#9595A8">
        {fmtShort(logs[0].logged_on)}
      </text>
      {logs.length > 1 && (
        <text x={W - PADX} y={H - 6} fontSize="10" fontWeight="600" fill="#9595A8" textAnchor="end">
          {fmtShort(logs[logs.length - 1].logged_on)}
        </text>
      )}
    </svg>
  );
}

export function WeightClient({ logs, goal, todayKey }: Props) {
  const router = useRouter();
  const [sheetDate, setSheetDate] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const stats = useMemo(() => {
    if (logs.length === 0) return null;
    const startLog = logs[0];
    const current = logs[logs.length - 1];
    const total = Math.round((current.weight_kg - startLog.weight_kg) * 10) / 10;

    const spanDays = Math.round(
      (parseDay(current.logged_on).getTime() - parseDay(startLog.logged_on).getTime()) /
        86_400_000,
    );
    const perWeek =
      logs.length > 1 && spanDays >= 7
        ? Math.round((total / (spanDays / 7)) * 10) / 10
        : null;

    return { startLog, current, total, perWeek };
  }, [logs]);

  // Historique en ordre anti-chronologique, avec le delta vs la pesée précédente.
  const history = useMemo(() => {
    return logs
      .map((l, i) => ({
        ...l,
        delta: i > 0 ? Math.round((l.weight_kg - logs[i - 1].weight_kg) * 10) / 10 : null,
      }))
      .reverse();
  }, [logs]);

  function openAdd() {
    setSheetDate(todayKey);
    setValue(stats ? String(stats.current.weight_kg).replace(".", ",") : "");
    setError(null);
  }
  function openEdit(l: WeightLog) {
    setSheetDate(l.logged_on);
    setValue(String(l.weight_kg).replace(".", ","));
    setError(null);
  }

  function save() {
    if (!sheetDate) return;
    const parsed = parseFloat(value.replace(",", "."));
    if (!Number.isFinite(parsed) || parsed < 30 || parsed > 300) {
      setError("Entre un poids entre 30 et 300 kg.");
      return;
    }
    setError(null);
    start(async () => {
      const res = await saveWeight(parsed, sheetDate);
      if (res?.error) {
        setError(res.error);
        return;
      }
      setSheetDate(null);
      setValue("");
      router.refresh();
    });
  }

  function remove(loggedOn: string) {
    start(async () => {
      await deleteWeight(loggedOn);
      setConfirmDelete(null);
      router.refresh();
    });
  }

  return (
    <main
      className="page-bottom"
      style={{
        maxWidth: 448,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        padding: "0 18px 0",
      }}
    >
      {/* ===== HEADER ===== */}
      <header className="animate-fade-up" style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 2px 4px" }}>
        <Link
          href="/today"
          aria-label="Retour"
          style={{
            width: 40,
            height: 40,
            borderRadius: 13,
            background: "#fff",
            boxShadow: "0 4px 12px rgba(26,26,46,.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1A1A2E",
            flexShrink: 0,
          }}
        >
          <ArrowLeft size={19} />
        </Link>
        <h1 style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-.03em", color: "#1A1A2E" }}>
          Ton poids
        </h1>
      </header>

      {logs.length === 0 ? (
        <div
          className="animate-fade-up-2"
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "36px 22px 30px",
            textAlign: "center",
            boxShadow: "0 6px 16px rgba(26,26,46,.05)",
          }}
        >
          <div style={{ fontSize: 46, lineHeight: 1, marginBottom: 12 }}>⚖️</div>
          <p style={{ fontSize: 16, fontWeight: 800, letterSpacing: "-.01em", color: "#1A1A2E" }}>
            Commence ton suivi
          </p>
          <p style={{ marginTop: 6, fontSize: 13, fontWeight: 500, color: "#9595A8", lineHeight: 1.5 }}>
            Note ton poids régulièrement pour voir<br />ta tendance de fond se dessiner.
          </p>
          <button
            onClick={openAdd}
            style={{
              marginTop: 18,
              padding: "13px 22px",
              borderRadius: 14,
              border: "none",
              background: "linear-gradient(135deg,#FF8540,#FF6B1A)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Ajouter ma première pesée
          </button>
        </div>
      ) : (
        <>
          {/* ===== POIDS ACTUEL + TOTAL ===== */}
          <div
            className="animate-fade-up-2"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "18px 20px 8px",
              boxShadow: "0 6px 16px rgba(26,26,46,.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#9595A8" }}>Poids actuel</p>
                <p
                  style={{
                    fontSize: 34,
                    fontWeight: 800,
                    letterSpacing: "-.03em",
                    color: "#1A1A2E",
                    fontVariantNumeric: "tabular-nums",
                    marginTop: 2,
                  }}
                >
                  {stats!.current.weight_kg.toLocaleString("fr-FR")}
                  <span style={{ fontSize: 17, fontWeight: 700, color: "#9595A8" }}> kg</span>
                </p>
              </div>
              {stats!.total !== 0 && (
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 800,
                    color: deltaColor(stats!.total, goal),
                    background: deltaColor(stats!.total, goal) === "#059669" ? "#ECFDF5" : deltaColor(stats!.total, goal) === "#E5550A" ? "#FFF3EC" : "#F5F6FA",
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {signed(stats!.total)} depuis le début
                </div>
              )}
            </div>

            <div style={{ marginTop: 8 }}>
              <Chart logs={logs} />
            </div>
          </div>

          {/* ===== STATS ===== */}
          <div
            className="animate-fade-up-3"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <Stat label="Départ" value={`${stats!.startLog.weight_kg.toLocaleString("fr-FR")} kg`} hint={fmtShort(stats!.startLog.logged_on)} />
            <Stat label="Pesées" value={`${logs.length}`} hint={logs.length > 1 ? "enregistrées" : "enregistrée"} />
            <Stat
              label="Variation totale"
              value={stats!.total === 0 ? "—" : signed(stats!.total)}
              color={deltaColor(stats!.total, goal)}
            />
            <Stat
              label="Rythme / semaine"
              value={stats!.perWeek === null ? "—" : signed(stats!.perWeek)}
              color={stats!.perWeek === null ? undefined : deltaColor(stats!.perWeek, goal)}
              hint={stats!.perWeek === null ? "≥ 7 jours requis" : "moyenne"}
            />
          </div>

          {/* ===== AJOUTER ===== */}
          <button
            onClick={openAdd}
            className="animate-fade-up-3"
            style={{
              display: "inline-flex",
              height: 50,
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              borderRadius: 16,
              border: "none",
              background: "linear-gradient(135deg,#FF8540,#FF6B1A)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              fontFamily: "inherit",
              cursor: "pointer",
              boxShadow: "0 8px 20px -6px rgba(255,107,26,.4)",
            }}
          >
            <Plus size={18} />
            Ajouter une pesée
          </button>

          {/* ===== HISTORIQUE ===== */}
          <section className="animate-fade-up-4" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E", padding: "6px 2px 0" }}>
              Historique
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map((l) => (
                <div
                  key={l.logged_on}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: "#fff",
                    borderRadius: 16,
                    boxShadow: "0 4px 12px rgba(26,26,46,.05)",
                    overflow: "hidden",
                  }}
                >
                  {confirmDelete === l.logged_on ? (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "12px 14px", gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E" }}>
                        Supprimer cette pesée ?
                      </span>
                      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => remove(l.logged_on)}
                          disabled={pending}
                          style={{ border: "none", background: "#FEE2E2", color: "#DC2626", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 800, fontFamily: "inherit", cursor: "pointer" }}
                        >
                          Supprimer
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          disabled={pending}
                          style={{ border: "none", background: "#F5F6FA", color: "#6B6B82", borderRadius: 10, padding: "7px 12px", fontSize: 12, fontWeight: 700, fontFamily: "inherit", cursor: "pointer" }}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => openEdit(l)}
                        style={{
                          flex: 1,
                          minWidth: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 12,
                          border: "none",
                          background: "none",
                          padding: "13px 4px 13px 16px",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          textAlign: "left",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 8, minWidth: 0 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A2E", textTransform: "capitalize" }}>
                            {l.logged_on === todayKey ? "Aujourd'hui" : fmtLong(l.logged_on)}
                          </span>
                          {l.delta !== null && l.delta !== 0 && (
                            <span style={{ fontSize: 12, fontWeight: 700, color: deltaColor(l.delta, goal), fontVariantNumeric: "tabular-nums" }}>
                              {signed(l.delta)}
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: "#1A1A2E", fontVariantNumeric: "tabular-nums", flexShrink: 0 }}>
                          {l.weight_kg.toLocaleString("fr-FR")} kg
                        </span>
                      </button>
                      <button
                        onClick={() => setConfirmDelete(l.logged_on)}
                        aria-label="Supprimer"
                        style={{
                          border: "none",
                          background: "none",
                          padding: "13px 16px",
                          cursor: "pointer",
                          color: "#C4C4D1",
                          flexShrink: 0,
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* ===== FEUILLE DE SAISIE ===== */}
      {sheetDate && (
        <div
          onClick={() => !pending && setSheetDate(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(26,26,46,.45)",
            zIndex: 300,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 448,
              background: "#fff",
              borderRadius: "24px 24px 0 0",
              padding: "22px 22px calc(26px + env(safe-area-inset-bottom,0px))",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E" }}>
                {sheetDate === todayKey ? "Ta pesée du jour" : `Pesée du ${fmtLong(sheetDate)}`}
              </h2>
              <button
                onClick={() => setSheetDate(null)}
                disabled={pending}
                aria-label="Fermer"
                style={{ width: 34, height: 34, borderRadius: 12, border: "none", background: "#F7F8FC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#6B6B82" }}
              >
                <X size={17} />
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <input
                type="text"
                inputMode="decimal"
                autoFocus
                placeholder="70,5"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && save()}
                className="fu-input"
                style={{ fontSize: 22, fontWeight: 800, textAlign: "center" }}
              />
              <span style={{ fontSize: 16, fontWeight: 700, color: "#9595A8" }}>kg</span>
            </div>

            {error && <p style={{ fontSize: 13, fontWeight: 500, color: "#DC2626" }}>{error}</p>}

            <button
              onClick={save}
              disabled={pending}
              style={{
                width: "100%",
                padding: 16,
                borderRadius: 16,
                border: "none",
                background: pending ? "#E8E8F0" : "linear-gradient(135deg,#FF8540,#FF6B1A)",
                color: pending ? "#9595A8" : "#fff",
                fontSize: 16,
                fontWeight: 800,
                fontFamily: "inherit",
                cursor: pending ? "not-allowed" : "pointer",
                boxShadow: pending ? "none" : "0 8px 20px -4px rgba(255,107,26,.4)",
              }}
            >
              {pending ? "Enregistrement…" : "Enregistrer"}
            </button>

            <p style={{ fontSize: 12, fontWeight: 500, color: "#C4C4D1", textAlign: "center" }}>
              Ton objectif calorique se recalcule automatiquement.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
  color,
}: {
  label: string;
  value: string;
  hint?: string;
  color?: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "13px 15px",
        boxShadow: "0 4px 12px rgba(26,26,46,.05)",
      }}
    >
      <p style={{ fontSize: 11, fontWeight: 700, color: "#9595A8", textTransform: "uppercase", letterSpacing: ".03em" }}>
        {label}
      </p>
      <p
        style={{
          fontSize: 19,
          fontWeight: 800,
          letterSpacing: "-.02em",
          color: color ?? "#1A1A2E",
          fontVariantNumeric: "tabular-nums",
          marginTop: 4,
        }}
      >
        {value}
      </p>
      {hint && <p style={{ fontSize: 11, fontWeight: 500, color: "#C4C4D1", marginTop: 1 }}>{hint}</p>}
    </div>
  );
}
