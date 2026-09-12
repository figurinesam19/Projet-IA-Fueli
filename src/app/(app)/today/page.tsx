import { createClient } from "@/lib/supabase/server";
import { computeDailyTargets } from "@/lib/nutrition";
import { currentWeek, dayBounds } from "@/lib/date";
import { DashboardClient, type MealRow } from "./dashboard-client";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const week = currentWeek();
  // Bornes : du début du lundi à la fin d'aujourd'hui. On charge toute la
  // semaine d'un coup pour que le changement de jour soit instantané côté
  // client (aucun aller-retour serveur au clic sur une date).
  const { start: weekStart } = dayBounds(week[0]);
  const { end: todayEnd } = dayBounds(today);

  // Pour la streak : uniquement les timestamps sur 1 an (colonne unique, léger)
  const yearAgo = new Date(today);
  yearAgo.setDate(yearAgo.getDate() - 366);

  const [{ data: profile }, { data: meals }, { data: streakRows }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
      supabase
        .from("meals")
        .select("*, meal_items(name)")
        .eq("user_id", user!.id)
        .gte("consumed_at", weekStart.toISOString())
        .lt("consumed_at", todayEnd.toISOString())
        .order("consumed_at", { ascending: true }),
      supabase
        .from("meals")
        .select("consumed_at")
        .eq("user_id", user!.id)
        .gte("consumed_at", yearAgo.toISOString()),
    ]);

  const targets = computeDailyTargets(profile);

  return (
    <DashboardClient
      firstName={profile?.first_name ?? ""}
      targets={targets}
      weekMeals={(meals ?? []) as MealRow[]}
      todayMs={today.getTime()}
      mealTimestamps={(streakRows ?? []).map((r) => r.consumed_at as string)}
    />
  );
}
