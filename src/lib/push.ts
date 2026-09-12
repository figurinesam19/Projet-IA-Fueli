import webpush from "web-push";

let configured = false;

/**
 * Configure web-push avec les clés VAPID (une seule fois par process).
 * Renvoie l'instance prête, ou lève si les clés manquent.
 */
export function getWebPush() {
  if (!configured) {
    const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    const privateKey = process.env.VAPID_PRIVATE_KEY;
    const subject = process.env.VAPID_SUBJECT || "mailto:support@fueli.app";
    if (!publicKey || !privateKey) {
      throw new Error("Clés VAPID manquantes (NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY).");
    }
    webpush.setVapidDetails(subject, publicKey, privateKey);
    configured = true;
  }
  return webpush;
}
