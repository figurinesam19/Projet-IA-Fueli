import { createClient } from "@/lib/supabase/server";
import { computeDailyTargets } from "@/lib/nutrition";
import { ProfileActions } from "./profile-actions";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const targets = computeDailyTargets(profile);

  return (
    <main className="mx-auto w-full max-w-md space-y-6 p-5">
      <header>
        <h1 className="text-[22px] font-medium">
          {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="text-sm text-muted-foreground">{user!.email}</p>
      </header>

      <section className="rounded-xl border border-border bg-card p-4">
        <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Objectif quotidien
        </p>
        <p className="mt-1 text-2xl font-medium">
          {targets?.kcal ?? "—"} kcal
        </p>
        {targets && (
          <p className="mt-1 text-xs text-muted-foreground">
            {targets.proteinG}g protéines · {targets.carbsG}g glucides ·{" "}
            {targets.fatG}g lipides
          </p>
        )}
      </section>

      <section className="space-y-2 rounded-xl border border-border bg-card p-4">
        <Row label="Âge" value={profile?.age ? `${profile.age} ans` : "—"} />
        <Row
          label="Poids"
          value={profile?.weight_kg ? `${profile.weight_kg} kg` : "—"}
        />
        <Row
          label="Taille"
          value={profile?.height_cm ? `${profile.height_cm} cm` : "—"}
        />
        <Row label="Objectif" value={labelGoal(profile?.goal)} />
        <Row label="Activité" value={labelActivity(profile)} />
      </section>

      <ProfileActions />
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function labelGoal(g: string | null | undefined) {
  if (g === "perte") return "Perte de poids";
  if (g === "masse") return "Prise de masse";
  if (g === "equilibre") return "Équilibre";
  return "—";
}

function labelActivity(p: {
  activity_level?: string | null;
  activity_frequency?: string | null;
}) {
  if (!p?.activity_level) return "—";
  if (p.activity_level === "aucun") return "Pas de sport";
  const label = p.activity_level === "peu" ? "Un peu" : "Régulier";
  return p.activity_frequency
    ? `${label} (${p.activity_frequency}× / sem.)`
    : label;
}
