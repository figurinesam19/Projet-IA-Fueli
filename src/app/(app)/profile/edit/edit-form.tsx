"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import type {
  ActivityFrequency,
  ActivityLevel,
  Goal,
  Profile,
  Sex,
} from "@/app/onboarding/types";
import { updateProfile, type UpdateProfileInput } from "./actions";

const SEX_OPTIONS: { value: Sex; label: string }[] = [
  { value: "homme", label: "Homme" },
  { value: "femme", label: "Femme" },
  { value: "autre", label: "Autre" },
];

const GOAL_OPTIONS: { value: Goal; label: string; emoji: string; desc: string }[] = [
  { value: "perte",     label: "Perte de poids",  emoji: "📉", desc: "Déficit calorique" },
  { value: "masse",     label: "Prise de masse",   emoji: "💪", desc: "Surplus calorique" },
  { value: "equilibre", label: "Équilibre",         emoji: "⚖️", desc: "Maintien du poids" },
];

const LEVEL_OPTIONS: { value: ActivityLevel; label: string; emoji: string }[] = [
  { value: "aucun",    label: "Aucun sport",  emoji: "🛋️" },
  { value: "peu",      label: "Un peu de sport", emoji: "🚶" },
  { value: "regulier", label: "Sport régulier",  emoji: "🏃" },
];

const FREQ_OPTIONS: { value: ActivityFrequency; label: string }[] = [
  { value: "1-2", label: "1–2 /sem." },
  { value: "3-4", label: "3–4 /sem." },
  { value: "5+",  label: "5+ /sem." },
];

type Props = { profile: Profile };

export function EditForm({ profile }: Props) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [sex, setSex]   = useState<Sex>((profile.sex as Sex) ?? "homme");
  const [goal, setGoal] = useState<Goal>((profile.goal as Goal) ?? "equilibre");
  const [level, setLevel] = useState<ActivityLevel>(
    (profile.activity_level as ActivityLevel) ?? "aucun",
  );
  const [freq, setFreq] = useState<ActivityFrequency | null>(
    (profile.activity_frequency as ActivityFrequency) ?? null,
  );
  const needsFrequency = level !== "aucun";

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const input: UpdateProfileInput = {
      first_name: String(form.get("first_name")),
      last_name:  String(form.get("last_name")),
      age:        Number(form.get("age")),
      sex,
      weight_kg:  Number(form.get("weight_kg")),
      height_cm:  Number(form.get("height_cm")),
      goal,
      activity_level:     level,
      activity_frequency: needsFrequency ? freq : null,
    };
    start(async () => {
      const result = await updateProfile(input);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <main
      style={{
        maxWidth: 448,
        margin: "0 auto",
        padding: "0 18px 60px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* Retour */}
      <div style={{ padding: "14px 0 4px" }}>
        <Link
          href="/profile"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            fontWeight: 600,
            color: "#9595A8",
            textDecoration: "none",
          }}
        >
          <ArrowLeft size={16} />
          Profil
        </Link>
      </div>

      {/* Titre */}
      <div style={{ padding: "0 2px 6px" }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.03em", color: "#1A1A2E" }}>
          Mon profil
        </h1>
        <p style={{ fontSize: 13, fontWeight: 500, color: "#9595A8", marginTop: 4, lineHeight: 1.45 }}>
          Tes données nutritionnelles sont recalculées à chaque modification.
        </p>
      </div>

      <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* ===== IDENTITÉ ===== */}
        <Card>
          <SectionHeader emoji="👤" label="Identité" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <Field label="Prénom">
              <input
                name="first_name"
                defaultValue={profile.first_name ?? ""}
                required
                className="fu-input"
                style={{ padding: "12px 14px", fontSize: 14 }}
              />
            </Field>
            <Field label="Nom">
              <input
                name="last_name"
                defaultValue={profile.last_name ?? ""}
                required
                className="fu-input"
                style={{ padding: "12px 14px", fontSize: 14 }}
              />
            </Field>
          </div>
          <Field label="Âge">
            <input
              name="age"
              type="number"
              min={13}
              max={120}
              defaultValue={profile.age ?? ""}
              required
              className="fu-input"
              style={{ padding: "12px 14px", fontSize: 14 }}
            />
          </Field>
          <div style={{ marginTop: 14 }}>
            <p style={LABEL_STYLE}>Sexe</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 8 }}>
              {SEX_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setSex(o.value)}
                  style={{
                    padding: "11px 8px",
                    borderRadius: 12,
                    border: sex === o.value ? "2px solid #1A5CFF" : "2px solid transparent",
                    background: sex === o.value ? "#EEF3FF" : "#F7F8FC",
                    fontSize: 13,
                    fontWeight: 700,
                    color: sex === o.value ? "#1A5CFF" : "#6B6B82",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all .15s",
                  }}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ===== MORPHOLOGIE ===== */}
        <Card>
          <SectionHeader emoji="⚖️" label="Morphologie" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Field label="Poids (kg)">
              <input
                name="weight_kg"
                type="number"
                step="0.1"
                min={30}
                max={300}
                defaultValue={profile.weight_kg ?? ""}
                required
                className="fu-input"
                style={{ padding: "12px 14px", fontSize: 14 }}
              />
            </Field>
            <Field label="Taille (cm)">
              <input
                name="height_cm"
                type="number"
                step="0.1"
                min={100}
                max={250}
                defaultValue={profile.height_cm ?? ""}
                required
                className="fu-input"
                style={{ padding: "12px 14px", fontSize: 14 }}
              />
            </Field>
          </div>
        </Card>

        {/* ===== PROGRAMME ===== */}
        <Card>
          <SectionHeader emoji="🎯" label="Programme" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {GOAL_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setGoal(o.value)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: goal === o.value ? "2px solid #1A5CFF" : "2px solid transparent",
                  background: goal === o.value ? "#EEF3FF" : "#F7F8FC",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{o.emoji}</span>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: goal === o.value ? "#1A5CFF" : "#1A1A2E", margin: 0 }}>
                    {o.label}
                  </p>
                  <p style={{ fontSize: 11, fontWeight: 500, color: "#9595A8", margin: 0 }}>
                    {o.desc}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* ===== ACTIVITÉ ===== */}
        <Card>
          <SectionHeader emoji="🏃" label="Activité physique" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {LEVEL_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setLevel(o.value);
                  if (o.value === "aucun") setFreq(null);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 14,
                  border: level === o.value ? "2px solid #1A5CFF" : "2px solid transparent",
                  background: level === o.value ? "#EEF3FF" : "#F7F8FC",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all .15s",
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{o.emoji}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: level === o.value ? "#1A5CFF" : "#1A1A2E" }}>
                  {o.label}
                </span>
              </button>
            ))}
          </div>

          {needsFrequency && (
            <div style={{ marginTop: 14 }}>
              <p style={{ ...LABEL_STYLE, marginBottom: 8 }}>Fréquence</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                {FREQ_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => setFreq(o.value as ActivityFrequency)}
                    style={{
                      padding: "10px 8px",
                      borderRadius: 12,
                      border: freq === o.value ? "2px solid #1A5CFF" : "2px solid transparent",
                      background: freq === o.value ? "#EEF3FF" : "#F7F8FC",
                      fontSize: 12,
                      fontWeight: 700,
                      color: freq === o.value ? "#1A5CFF" : "#6B6B82",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all .15s",
                    }}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {error && (
          <p style={{ fontSize: 13, fontWeight: 600, color: "#E5150A", padding: "0 2px" }}>
            {error}
          </p>
        )}

        {/* Boutons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: 10, paddingTop: 4 }}>
          <Link
            href="/profile"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: 52,
              borderRadius: 16,
              background: "#F7F8FC",
              fontSize: 14,
              fontWeight: 700,
              color: "#6B6B82",
              textDecoration: "none",
            }}
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={pending}
            style={{
              height: 52,
              borderRadius: 16,
              background: pending ? "#FFB899" : "linear-gradient(135deg,#FF8C42,#FF6B1A)",
              border: "none",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "-.01em",
              cursor: pending ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              boxShadow: pending ? "none" : "0 8px 20px rgba(255,107,26,.35)",
            }}
          >
            {pending ? "Enregistrement…" : "Enregistrer →"}
          </button>
        </div>
      </form>
    </main>
  );
}

/* ── Composants internes ── */

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: ".04em",
  color: "#9595A8",
};

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 18,
        boxShadow: "0 6px 16px rgba(26,26,46,.05)",
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ emoji, label }: { emoji: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: "#F7F8FC",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 17,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <span style={{ fontSize: 15, fontWeight: 800, letterSpacing: "-.01em", color: "#1A1A2E" }}>
        {label}
      </span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <p style={LABEL_STYLE}>{label}</p>
      {children}
    </div>
  );
}
