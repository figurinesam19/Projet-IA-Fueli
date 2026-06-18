import Link from "next/link";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center p-6">
      <div className="mb-8">
        <h1 className="text-[22px] font-medium">Connexion</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Heureux de te revoir.
        </p>
      </div>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Pas encore de compte ?{" "}
        <Link href="/signup" className="font-medium text-primary">
          Créer un compte
        </Link>
      </p>
    </main>
  );
}
