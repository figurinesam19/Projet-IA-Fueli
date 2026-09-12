"use server";

import { createClient } from "@/lib/supabase/server";
import { getWebPush } from "@/lib/push";

type SubJSON = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

/** Enregistre (ou rafraîchit) l'abonnement push de l'utilisateur courant. */
export async function saveSubscription(sub: SubJSON) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const { error } = await supabase.from("push_subscriptions").upsert(
    {
      user_id: user.id,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
      last_seen_at: new Date().toISOString(),
    },
    { onConflict: "endpoint" },
  );

  if (error) return { error: error.message };
  return { ok: true };
}

/** Supprime l'abonnement correspondant à cet endpoint. */
export async function removeSubscription(endpoint: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const { error } = await supabase
    .from("push_subscriptions")
    .delete()
    .eq("user_id", user.id)
    .eq("endpoint", endpoint);

  if (error) return { error: error.message };
  return { ok: true };
}

/** Envoie une notification de test immédiate à tous les appareils de l'utilisateur. */
export async function sendTestNotification() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Non connecté" };

  const { data: subs } = await supabase
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth")
    .eq("user_id", user.id);

  if (!subs || subs.length === 0) {
    return { error: "Aucun appareil abonné. Active d'abord les notifications." };
  }

  const webpush = getWebPush();
  const payload = JSON.stringify({
    title: "Ça marche 🎉",
    body: "Tes notifications Fueli sont bien activées.",
    url: "/today",
    tag: "fueli-test",
  });

  let sent = 0;
  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
        payload,
      );
      sent++;
    } catch (e) {
      // 404/410 = abonnement expiré → on nettoie
      const status = (e as { statusCode?: number }).statusCode;
      if (status === 404 || status === 410) {
        await supabase.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
      }
    }
  }

  if (sent === 0) return { error: "Envoi impossible. Réactive les notifications." };
  return { ok: true, sent };
}
