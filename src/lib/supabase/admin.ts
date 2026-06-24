import { createClient } from "@supabase/supabase-js";

/**
 * Client Supabase avec privilèges admin (service_role).
 *
 * À n'utiliser QUE depuis des Server Actions ou Route Handlers, jamais
 * exposer la clé côté client. Sert aux opérations qui dépassent la portée
 * d'un utilisateur authentifié — par ex. supprimer un user (RGPD).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url) throw new Error("NEXT_PUBLIC_SUPABASE_URL manquante");
  if (!serviceKey || serviceKey.includes("...")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY manquante ou placeholder. Configure-la dans .env.local.",
    );
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
