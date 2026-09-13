import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getWebPush } from "@/lib/push";
import { NOTIF_COPY, pickNotifCopy, type MealSlot } from "@/lib/notification-copy";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Rappels de scan — appelé par le scheduler (GitHub Actions) après chaque
 * heure de repas : 9h30 / 13h30 / 21h00, heure de Paris.
 *
 * Règles (validées) :
 * - une notif par créneau, uniquement si le repas du créneau n'est PAS scanné
 *   → max 3/jour, un utilisateur assidu ne reçoit rien ;
 * - accroche tirée du pool du créneau, jamais deux fois la même d'affilée ;
 * - garde-fou anti-harcèlement : plus rien après 3 jours sans aucun repas
 *   scanné (on ne relance pas quelqu'un qui ignore les rappels) ;
 * - idempotent : un créneau déjà servi aujourd'hui ne renvoie pas, même si le
 *   scheduler déclenche deux fois (2 crons UTC couvrent été/hiver).
 *
 * Query params : `?slot=diner` force le créneau (tests), `?dry=1` simule sans
 * envoyer ni écrire.
 */

const SLOT_START_MIN: Record<MealSlot, number> = {
  petit_dejeuner: 9 * 60 + 30,
  dejeuner: 13 * 60 + 30,
  diner: 21 * 60,
};

// Fenêtre de tir après l'heure cible. STRICTEMENT < 60 min : chaque créneau a
// deux crons UTC espacés d'une heure (été/hiver), une fenêtre plus large ferait
// matcher les deux le même jour.
const WINDOW_MIN = 50;

const INACTIVITY_CUTOFF_DAYS = 3;

/** Date/heure courantes à Paris, quel que soit le fuseau du serveur. */
function parisNow(): { dayKey: string; minutes: number } {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "00";
  return {
    dayKey: `${get("year")}-${get("month")}-${get("day")}`,
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

function resolveSlot(minutes: number): MealSlot | null {
  for (const [slot, start] of Object.entries(SLOT_START_MIN)) {
    if (minutes >= start && minutes < start + WINDOW_MIN) return slot as MealSlot;
  }
  return null;
}

/** Instant UTC du dernier minuit à Paris. */
function parisMidnightUtc(minutesSinceMidnight: number): Date {
  return new Date(Date.now() - minutesSinceMidnight * 60_000);
}

type SlotState = { last_date?: string; last_copy?: number };

export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "CRON_SECRET non configuré" }, { status: 500 });
  }
  if (req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const forced = url.searchParams.get("slot");

  const { dayKey, minutes } = parisNow();
  const slot = forced && forced in NOTIF_COPY ? (forced as MealSlot) : resolveSlot(minutes);
  if (!slot) {
    return NextResponse.json({ skipped: "hors créneau", parisMinutes: minutes });
  }

  const supabase = createAdminClient();

  const { data: subs, error: subsError } = await supabase
    .from("push_subscriptions")
    .select("user_id, endpoint, p256dh, auth, last_seen_at");
  if (subsError) {
    return NextResponse.json({ error: subsError.message }, { status: 500 });
  }
  if (!subs || subs.length === 0) {
    return NextResponse.json({ slot, sent: 0, skipped: "aucun abonné" });
  }

  const userIds = [...new Set(subs.map((s) => s.user_id))];
  const todayStart = parisMidnightUtc(minutes).toISOString();
  const activityCutoff = new Date(
    Date.now() - INACTIVITY_CUTOFF_DAYS * 24 * 3600_000,
  ).toISOString();

  const [{ data: scannedRows }, { data: activeRows }, { data: stateRows }] =
    await Promise.all([
      supabase
        .from("meals")
        .select("user_id")
        .in("user_id", userIds)
        .eq("kind", slot)
        .gte("consumed_at", todayStart),
      supabase
        .from("meals")
        .select("user_id")
        .in("user_id", userIds)
        .gte("consumed_at", activityCutoff),
      supabase.from("notification_state").select("user_id, state").in("user_id", userIds),
    ]);

  const scanned = new Set((scannedRows ?? []).map((r) => r.user_id));
  const active = new Set((activeRows ?? []).map((r) => r.user_id));
  const states = new Map<string, Record<string, SlotState>>(
    (stateRows ?? []).map((r) => [r.user_id, r.state ?? {}]),
  );

  const webpush = getWebPush();
  const summary = {
    slot,
    dry,
    subscribers: userIds.length,
    sent: 0,
    skipped_scanned: 0,
    skipped_inactive: 0,
    skipped_already_sent: 0,
    dead_subscriptions: 0,
  };

  for (const userId of userIds) {
    const userSubs = subs.filter((s) => s.user_id === userId);
    const state = states.get(userId) ?? {};
    const slotState: SlotState = state[slot] ?? {};

    if (slotState.last_date === dayKey) {
      summary.skipped_already_sent++;
      continue;
    }
    if (scanned.has(userId)) {
      summary.skipped_scanned++;
      continue;
    }
    // Anti-harcèlement : rien scanné depuis N jours ET abonnement pas frais
    // (un nouvel inscrit sans repas garde ses rappels les premiers jours).
    const freshSub = userSubs.some((s) => (s.last_seen_at ?? "") >= activityCutoff);
    if (!active.has(userId) && !freshSub) {
      summary.skipped_inactive++;
      continue;
    }

    const { copy, index } = pickNotifCopy(slot, slotState.last_copy);
    if (dry) {
      summary.sent++;
      continue;
    }

    const payload = JSON.stringify({
      title: copy.title,
      body: copy.body,
      url: "/scan",
      tag: `fueli-${slot}`,
    });

    let delivered = 0;
    for (const s of userSubs) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
          payload,
        );
        delivered++;
      } catch (e) {
        // 404/410 = abonnement expiré → on nettoie
        const status = (e as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", s.endpoint);
          summary.dead_subscriptions++;
        }
      }
    }

    if (delivered > 0) {
      summary.sent++;
      await supabase.from("notification_state").upsert({
        user_id: userId,
        state: { ...state, [slot]: { last_date: dayKey, last_copy: index } },
        updated_at: new Date().toISOString(),
      });
    }
  }

  return NextResponse.json(summary);
}
