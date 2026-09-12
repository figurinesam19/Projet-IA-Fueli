"use client";

import { useEffect, useState } from "react";
import { Bell, BellOff, Check, Loader2, Send } from "lucide-react";
import {
  saveSubscription,
  removeSubscription,
  sendTestNotification,
} from "./actions";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

// Conversion clé VAPID base64url → Uint8Array attendu par PushManager.subscribe
function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

type State =
  | "loading"
  | "unsupported"
  | "needs-install"
  | "denied"
  | "off"
  | "on";

export function NotificationsClient() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const supported =
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window;

    if (!supported) {
      // iOS Safari hors écran d'accueil : pas de PushManager tant que la PWA
      // n'est pas installée. On distingue ce cas pour guider l'utilisateur.
      const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        // @ts-expect-error propriété non standard iOS
        window.navigator.standalone === true;
      setState(isIOS && !isStandalone ? "needs-install" : "unsupported");
      return;
    }

    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }

    // getRegistration() répond tout de suite (undefined si aucun SW enregistré).
    // À l'inverse, serviceWorker.ready ne se résout JAMAIS tant qu'aucun SW
    // n'est actif — ce qui bloquait le spinner à l'infini avant activation.
    navigator.serviceWorker
      .getRegistration()
      .then(async (reg) => {
        if (!reg) {
          setState("off");
          return;
        }
        const sub = await reg.pushManager.getSubscription();
        setState(sub ? "on" : "off");
      })
      .catch(() => setState("off"));
  }, []);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  async function enable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setState(permission === "denied" ? "denied" : "off");
        setBusy(false);
        return;
      }

      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });

      const json = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };
      const res = await saveSubscription({
        endpoint: json.endpoint,
        keys: json.keys,
      });
      if (res?.error) {
        flash(res.error);
        setBusy(false);
        return;
      }
      setState("on");
      flash("Notifications activées ✅");
    } catch {
      flash("Impossible d'activer les notifications.");
    }
    setBusy(false);
  }

  async function disable() {
    setBusy(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await removeSubscription(sub.endpoint);
        await sub.unsubscribe();
      }
      setState("off");
      flash("Notifications désactivées.");
    } catch {
      flash("Erreur lors de la désactivation.");
    }
    setBusy(false);
  }

  async function test() {
    setBusy(true);
    const res = await sendTestNotification();
    flash(res?.error ? res.error : "Notif envoyée — regarde ton écran 👀");
    setBusy(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Illustration */}
      <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 26,
            background: "linear-gradient(135deg,#B79BFF,#7C3AED)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 14px 30px -8px rgba(124,58,237,.5)",
          }}
        >
          <Bell size={36} color="#fff" strokeWidth={2.2} />
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E" }}>
          Rappels de scan
        </h1>
        <p style={{ fontSize: 14, fontWeight: 500, color: "#9595A8", marginTop: 6, lineHeight: 1.5 }}>
          Un petit rappel après chaque repas si tu as oublié de le scanner.
          Jamais de spam : max un par repas non enregistré.
        </p>
      </div>

      {/* Corps selon l'état */}
      {state === "loading" && (
        <div style={{ display: "flex", justifyContent: "center", padding: 20 }}>
          <Loader2 size={22} className="animate-spin" color="#9595A8" />
        </div>
      )}

      {state === "needs-install" && (
        <Info tint="#FFF7E8" color="#92610A">
          Pour recevoir les notifications sur iPhone, ajoute d&apos;abord Fueli à
          ton écran d&apos;accueil : bouton Partager → « Sur l&apos;écran
          d&apos;accueil », puis rouvre l&apos;app depuis l&apos;icône.
        </Info>
      )}

      {state === "unsupported" && (
        <Info tint="#F7F8FC" color="#6B6B82">
          Ton navigateur ne supporte pas les notifications push. Essaie depuis
          l&apos;app installée sur ton téléphone.
        </Info>
      )}

      {state === "denied" && (
        <Info tint="#FFF5F5" color="#B91C1C">
          Les notifications sont bloquées. Autorise-les dans les réglages de ton
          navigateur ou de ton téléphone, puis reviens ici.
        </Info>
      )}

      {state === "off" && (
        <PrimaryButton onClick={enable} busy={busy} icon={<Bell size={18} />}>
          Activer les notifications
        </PrimaryButton>
      )}

      {state === "on" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              background: "#F0FDF4",
              border: "1.5px solid rgba(5,150,105,.2)",
              borderRadius: 16,
              padding: "14px",
              fontSize: 14,
              fontWeight: 700,
              color: "#065F46",
            }}
          >
            <Check size={18} /> Notifications activées
          </div>

          <PrimaryButton onClick={test} busy={busy} icon={<Send size={17} />} variant="soft">
            Envoyer une notif test
          </PrimaryButton>

          <button
            type="button"
            onClick={disable}
            disabled={busy}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: 14,
              borderRadius: 16,
              border: "none",
              background: "transparent",
              color: "#9595A8",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            <BellOff size={16} /> Désactiver
          </button>
        </div>
      )}

      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "calc(24px + env(safe-area-inset-bottom,0px))",
            left: "50%",
            transform: "translateX(-50%)",
            background: "#1A1A2E",
            color: "#fff",
            padding: "12px 20px",
            borderRadius: 14,
            fontSize: 13.5,
            fontWeight: 600,
            boxShadow: "0 8px 24px rgba(0,0,0,.25)",
            zIndex: 200,
            maxWidth: "90%",
            textAlign: "center",
          }}
        >
          {toast}
        </div>
      )}
    </div>
  );
}

function Info({ children, tint, color }: { children: React.ReactNode; tint: string; color: string }) {
  return (
    <div
      style={{
        background: tint,
        borderRadius: 16,
        padding: "16px 18px",
        fontSize: 13.5,
        fontWeight: 500,
        color,
        lineHeight: 1.55,
      }}
    >
      {children}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  busy,
  icon,
  variant = "solid",
}: {
  children: React.ReactNode;
  onClick: () => void;
  busy: boolean;
  icon: React.ReactNode;
  variant?: "solid" | "soft";
}) {
  const solid = variant === "solid";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 9,
        width: "100%",
        padding: 16,
        borderRadius: 16,
        border: "none",
        background: busy
          ? "#E8E8F0"
          : solid
            ? "linear-gradient(135deg,#FF8540,#FF6B1A)"
            : "#EEF3FF",
        color: busy ? "#9595A8" : solid ? "#fff" : "#1A5CFF",
        fontSize: 15,
        fontWeight: 800,
        fontFamily: "inherit",
        cursor: busy ? "not-allowed" : "pointer",
        boxShadow: busy || !solid ? "none" : "0 8px 20px -4px rgba(255,107,26,.4)",
      }}
    >
      {busy ? <Loader2 size={18} className="animate-spin" /> : icon}
      {children}
    </button>
  );
}
