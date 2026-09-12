import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Endpoint dédié au flow de récupération de mot de passe.
 *
 * Deux formats de lien supportés :
 *
 * 1. `?token_hash=xxx&type=recovery` — flow OTP (recommandé). Le token est
 *    vérifié directement côté serveur via verifyOtp : aucun cookie requis,
 *    donc ça fonctionne même si l'email est ouvert dans un autre navigateur
 *    que celui qui a demandé le reset (cas typique : PWA → app Mail).
 *    Nécessite que le template email Supabase pointe vers
 *    {{ .SiteURL }}/auth/recovery?token_hash={{ .TokenHash }}&type=recovery
 *
 * 2. `?code=xxx` — flow PKCE historique. Ne fonctionne que si le lien est
 *    ouvert dans le même navigateur que la demande (le code verifier est
 *    dans les cookies). Gardé en fallback.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const code = searchParams.get("code");

  const supabase = await createClient();

  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({
      type: "recovery",
      token_hash: tokenHash,
    });
    if (!error) {
      return NextResponse.redirect(`${origin}/reset-password`);
    }
  } else if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/reset-password`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=invalid_reset_link`);
}
