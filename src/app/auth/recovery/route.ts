import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Endpoint dédié au flow de récupération de mot de passe.
 *
 * Supabase appelle cette URL avec un `?code=xxx` après que l'utilisateur a cliqué
 * sur le lien email. On échange le code contre une session ICI (Route Handler =
 * contexte où les cookies peuvent être écrits), puis on redirige vers la page
 * du formulaire de nouveau mot de passe.
 *
 * Cette route est distincte de /auth/callback pour éviter l'ambiguïté du
 * paramètre `next` qui se perdait parfois dans le flow de recovery.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=invalid_reset_link`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=invalid_reset_link`);
  }

  return NextResponse.redirect(`${origin}/reset-password`);
}
