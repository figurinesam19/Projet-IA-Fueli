"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ResetForm } from "./reset-form";

/**
 * Page de choix du nouveau mot de passe.
 *
 * Le lien email (flow implicit) atterrit ici avec les jetons dans le hash :
 *   /reset-password#access_token=…&refresh_token=…&type=recovery
 * Le hash n'étant jamais envoyé au serveur, cette page doit être un composant
 * client : on lit les jetons, on ouvre la session via setSession (stockée en
 * cookies par @supabase/ssr, donc visible du serveur ensuite), puis on
 * affiche le formulaire.
 *
 * Fallback : session déjà ouverte (ancien flow PKCE via /auth/recovery).
 */
export default function ResetPasswordPage() {
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();

      const hash = new URLSearchParams(window.location.hash.slice(1));
      const accessToken = hash.get("access_token");
      const refreshToken = hash.get("refresh_token");
      const hashError = hash.get("error_code");

      if (hashError) {
        // Lien expiré ou déjà utilisé (ex. error_code=otp_expired)
        window.location.replace("/login?error=expired_reset_link");
        return;
      }

      if (accessToken && refreshToken) {
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        // Nettoie les jetons de l'URL (historique, partage d'écran…)
        window.history.replaceState(null, "", window.location.pathname);
        if (!error && data.user) {
          setEmail(data.user.email ?? null);
          setStatus("ready");
          return;
        }
      }

      // Fallback : session déjà posée par /auth/recovery (flow PKCE)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setEmail(user.email ?? null);
        setStatus("ready");
        return;
      }

      window.location.replace("/login?error=expired_reset_link");
    };
    run();
  }, []);

  if (status === "loading") {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">Vérification du lien…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
      <div className="mb-8">
        <h1 className="text-[22px] font-medium">Nouveau mot de passe</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choisis un nouveau mot de passe{email ? ` pour ${email}` : ""}.
        </p>
      </div>
      <ResetForm />
    </main>
  );
}
