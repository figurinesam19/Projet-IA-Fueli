import { createClient } from "@/lib/supabase/server";
import { WeightClient, type WeightLog } from "./weight-client";

export default async function WeightPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: logs }] = await Promise.all([
    supabase.from("profiles").select("goal").eq("id", user!.id).single(),
    supabase
      .from("weight_logs")
      .select("logged_on, weight_kg")
      .eq("user_id", user!.id)
      .order("logged_on", { ascending: true }),
  ]);

  return (
    <WeightClient
      logs={(logs ?? []).map((l) => ({
        logged_on: l.logged_on as string,
        weight_kg: Number(l.weight_kg),
      })) as WeightLog[]}
      goal={profile?.goal ?? null}
      todayKey={new Date().toISOString().slice(0, 10)}
    />
  );
}
