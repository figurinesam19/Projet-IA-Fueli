/**
 * Helpers de date pour l'historique 7 jours.
 * Tout est en heure locale du serveur — l'utilisateur travaille dans son fuseau.
 */

export function toDayKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function parseDayKey(key: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key);
  if (!m) return null;
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dayBounds(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function last7Days(): Date[] {
  const days: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(d);
  }
  return days;
}

/**
 * Convertit un dayKey (AAAA-MM-JJ) en timestamp `consumed_at` pour un repas
 * ajouté rétroactivement : le jour demandé à 12h00. Renvoie null si la clé
 * est invalide, dans le futur, ou plus vieille qu'un an.
 */
export function consumedAtForDayKey(dayKey: string): string | null {
  const day = parseDayKey(dayKey);
  if (!day) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yearAgo = new Date(today);
  yearAgo.setDate(yearAgo.getDate() - 366);

  if (day > today || day < yearAgo) return null;

  const at = new Date(day);
  at.setHours(12, 0, 0, 0);
  return at.toISOString();
}

/**
 * Série de jours consécutifs avec au moins un repas, en remontant depuis
 * aujourd'hui. Si aujourd'hui n'a encore rien, la série ne casse pas : on
 * compte depuis hier (sinon l'utilisateur verrait 0 chaque matin).
 */
export function computeStreak(mealTimestamps: string[]): number {
  const daysWithMeal = new Set(
    mealTimestamps.map((ts) => toDayKey(new Date(ts))),
  );
  if (daysWithMeal.size === 0) return 0;

  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  // Point de départ : aujourd'hui si scanné, sinon hier.
  if (!daysWithMeal.has(toDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!daysWithMeal.has(toDayKey(cursor))) return 0;
  }

  let streak = 0;
  while (daysWithMeal.has(toDayKey(cursor))) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Retourne les 7 jours de la semaine courante, du lundi au dimanche. */
export function currentWeek(): Date[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dow = today.getDay(); // 0=dim, 1=lun, …, 6=sam
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}
