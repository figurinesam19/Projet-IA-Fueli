"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Progress } from "@/components/ui/progress";
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

  function handleResult(result: { ok?: true; error?: string }, nextStep: number) {
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

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col p-6">
      <header className="mb-8">
        <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          <span>Étape {step} / {TOTAL_STEPS}</span>
          {step > 1 && step <= TOTAL_STEPS && (
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="text-foreground"
              disabled={pending}
            >
              Retour
            </button>
          )}
        </div>
        <Progress value={(step / TOTAL_STEPS) * 100} className="h-1.5" />
      </header>

      <div className="flex-1">
        {step === 1 && (
          <StepAccount
            pending={pending}
            error={error}
            onSubmit={(email, password) => start(() => handleSignup(email, password))}
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
    </main>
  );
}
