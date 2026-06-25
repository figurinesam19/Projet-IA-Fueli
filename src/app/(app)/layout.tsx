import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BottomNav } from "@/components/bottom-nav";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("onboarding_completed_at")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed_at) redirect("/onboarding");

  return (
    // app-shell = fond #F7F8FC pleine largeur
    // app-column = contenu centré max 448 px, ombre sur desktop
    <div className="app-shell">
      <div className="app-column">
        {children}
      </div>
      {/* BottomNav est position:fixed, centré, max-width 448px — voir bottom-nav.tsx */}
      <BottomNav />
    </div>
  );
}
