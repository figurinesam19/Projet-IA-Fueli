import { redirect } from "next/navigation";

export default function SignupPage() {
  // L'inscription est intégrée dans le flow d'onboarding (étape 1)
  redirect("/onboarding");
}
