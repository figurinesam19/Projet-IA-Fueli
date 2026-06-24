import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; error?: string; deleted?: string }>;
}) {
  const { reset, error, deleted } = await searchParams;
  const errorMessage =
    error === "invalid_reset_link"
      ? "Le lien de réinitialisation est invalide."
      : error === "expired_reset_link"
        ? "Le lien de réinitialisation a expiré. Demande-en un nouveau."
        : null;
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
      <div className="mb-8">
        <h1 className="text-[22px] font-medium">Connexion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Heureux de te revoir.
        </p>
      </div>
      {reset === "ok" && (
        <div className="mb-4 rounded-lg border border-border bg-card p-3 text-sm">
          Mot de passe mis à jour. Connecte-toi avec le nouveau.
        </div>
      )}
      {deleted === "ok" && (
        <div className="mb-4 rounded-lg border border-border bg-card p-3 text-sm">
          Ton compte et toutes tes données ont été supprimés. À bientôt !
        </div>
      )}
      {errorMessage && (
        <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {errorMessage}
        </div>
      )}
      <LoginForm />
      <div className="mt-4 text-center">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-primary"
        >
          Mot de passe oublié ?
        </Link>
      </div>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-medium text-primary">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}
