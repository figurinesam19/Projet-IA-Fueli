"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  saveActivity,
  saveGoal,
  saveIdentity,
  saveMorphology,
  completeOnboarding,
} from "./actions";
import { StepAccount } from "./steps/step-account";
import { StepIdentity } from "./steps/step-identity";
import { StepMorphology } from "./steps/step-morphology";
import { StepGoal } from "./steps/step-goal";
import { StepActivity } from "./steps/step-activity";
import { StepConsent } from "./steps/step-consent";
import { TOTAL_STEPS, type Profile } from "./types";

type Props = {
  initialStep: number;
  initialProfile: Profile | null;
};

export function OnboardingFlow({ initialStep, initialProfile }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(initialStep);
  const [profile, setProfile] = useState<Partial<Profile>>(
    initialProfile ?? {},
  );
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleResult(
    result: { ok?: true; error?: string },
    nextStep: number,
  ) {
    if (result.error) {
      setError(result.error);
      return;
    }
    setError(null);
    setStep(nextStep);
  }

  async function handleSignup(email: string, password: string) {
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
      },
    });
    if (error) {
      setError(error.message);
      return;
    }
    if (!data.session) {
      setError(
        "Vérifie ta boîte mail pour confirmer ton adresse, puis reviens te connecter.",
      );
      return;
    }
    router.refresh();
    setStep(2);
  }

  const pct = (step / TOTAL_STEPS) * 100;

  return (
    <div className="app-shell">
      <div
        className="app-column"
        style={{ display: "flex", flexDirection: "column" }}
      >
        {/* ─── Header ─── */}
        <header style={{ padding: "28px 24px 0" }}>
          {/* Wordmark */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              letterSpacing: "-.06em",
              color: "#1A5CFF",
              marginBottom: 28,
            }}
          >
            fueli
          </div>

          {/* Étape + retour */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: ".06em",
                color: "#9595A8",
              }}
            >
              Étape {step} sur {TOTAL_STEPS}
            </span>

            {step > 1 && step <= TOTAL_STEPS && (
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep((s) => Math.max(1, s - 1));
                }}
                disabled={pending}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#6B6B82",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  padding: 0,
                }}
              >
                <ArrowLeft size={14} />
                Retour
              </button>
            )}
          </div>

          {/* Barre de progression */}
          <div style={{ height: 4, background: "#E8E8F0", borderRadius: 999 }}>
            <div
              style={{
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg,#4D7CFF,#1A5CFF)",
                width: `${pct}%`,
                transition: "width .35s cubic-bezier(.22,1,.36,1)",
              }}
            />
          </div>
        </header>

        {/* ─── Contenu ─── */}
        <div style={{ flex: 1, padding: "32px 24px 48px" }}>
          {step === 1 && (
            <StepAccount
              pending={pending}
              error={error}
              onSubmit={(email, password) =>
                start(() => handleSignup(email, password))
              }
            />
          )}
          {step === 2 && (
            <StepIdentity
              pending={pending}
              error={error}
              defaults={profile}
              onSubmit={(values) =>
                start(async () => {
                  handleResult(await saveIdentity(values), 3);
                  setProfile((p) => ({
                    ...p,
                    first_name: values.firstName,
                    last_name: values.lastName,
                    age: values.age,
                    sex: values.sex,
                  }));
                })
              }
            />
          )}
          {step === 3 && (
            <StepMorphology
              pending={pending}
              error={error}
              defaults={profile}
              onSubmit={(values) =>
                start(async () => {
                  handleResult(await saveMorphology(values), 4);
                  setProfile((p) => ({
                    ...p,
                    weight_kg: values.weightKg,
                    height_cm: values.heightCm,
                  }));
                })
              }
            />
          )}
          {step === 4 && (
            <StepGoal
              pending={pending}
              error={error}
              defaults={profile}
              onSubmit={(values) =>
                start(async () => {
                  handleResult(await saveGoal(values), 5);
                  setProfile((p) => ({ ...p, goal: values.goal }));
                })
              }
            />
          )}
          {step === 5 && (
            <StepActivity
              pending={pending}
              error={error}
              defaults={profile}
              onSubmit={(values) =>
                start(async () => {
                  handleResult(await saveActivity(values), 6);
                  setProfile((p) => ({
                    ...p,
                    activity_level: values.level,
                    activity_frequency: values.frequency,
                  }));
                })
              }
            />
          )}
          {step === 6 && (
            <StepConsent
              pending={pending}
              error={error}
              onSubmit={() =>
                start(async () => {
                  const result = await completeOnboarding();
                  if (result?.error) setError(result.error);
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
