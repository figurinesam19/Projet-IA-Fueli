import Link from "next/link";
import { ForgotForm } from "./forgot-form";

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
      <div className="mb-8">
        <h1 className="text-[22px] font-medium">Mot de passe oublié</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          On t&apos;envoie un lien pour le réinitialiser.
        </p>
      </div>
      <ForgotForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link href="/login" className="font-medium text-primary">
          Retour à la connexion
        </Link>
      </p>
    </main>
  );
}
