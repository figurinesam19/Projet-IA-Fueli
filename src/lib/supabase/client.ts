import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        // Opt-in à l'API passkey (WebAuthn) de Supabase Auth, encore expérimentale.
        // Nécessaire pour registerPasskey() / signInWithPasskey().
        experimental: { passkey: true },
      },
    } as Parameters<typeof createBrowserClient>[2],
  );
}
