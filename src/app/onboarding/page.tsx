import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { OnboardingFlow } from "./onboarding-flow";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pas connecté : on affiche l'étape 1 (création de compte) côté client
  if (!user) {
    return <OnboardingFlow initialStep={1} initialProfile={null} />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed_at) redirect("/today");

  return (
    <OnboardingFlow
      initialStep={Math.max(2, profile?.onboarding_step ?? 2)}
      initialProfile={profile ?? null}
    />
  );
}
