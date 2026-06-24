import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ResetForm } from "./reset-form";

export default async function ResetPasswordPage() {
  // À ce stade, /auth/recovery a déjà échangé le code et ouvert une session
  // (cookies posés via la Route Handler). Si pas de session, lien expiré.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?error=expired_reset_link");

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
      <div className="mb-8">
        <h1 className="text-[22px] font-medium">Nouveau mot de passe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisis un nouveau mot de passe pour {user.email}.
        </p>
      </div>
      <ResetForm />
    </main>
  );
}
