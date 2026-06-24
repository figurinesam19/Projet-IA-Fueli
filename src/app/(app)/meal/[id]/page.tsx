import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MealDetail } from "./meal-detail";

export default async function MealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: meal } = await supabase
    .from("meals")
    .select("*")
    .eq("id", id)
    .eq("user_id", user!.id)
    .single();

  if (!meal) notFound();

  const { data: items } = await supabase
    .from("meal_items")
    .select("*")
    .eq("meal_id", id)
    .order("created_at", { ascending: true });

  return <MealDetail meal={meal} items={items ?? []} />;
}
