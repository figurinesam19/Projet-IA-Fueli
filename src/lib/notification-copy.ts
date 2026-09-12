/**
 * Accroches des notifications de rappel de scan.
 *
 * Chaque repas dispose d'un pool de formulations distinctes : au moment de
 * l'envoi on en tire une au hasard (en évitant la dernière utilisée) pour
 * qu'un utilisateur ne reconnaisse jamais deux fois la même notif. Ton fun /
 * complice, tutoiement, comme le reste de l'app.
 */

export type MealSlot = "petit_dejeuner" | "dejeuner" | "diner";

export type NotifCopy = { title: string; body: string };

export const NOTIF_COPY: Record<MealSlot, NotifCopy[]> = {
  petit_dejeuner: [
    { title: "Déjà debout 👀", body: "Ton petit-déj mérite un scan." },
    { title: "Café + tartines ? ☕", body: "Dis à Fueli ce que t'as avalé." },
    { title: "Bien réveillé ? 🌅", body: "Note ton petit-déj avant de filer." },
    { title: "Le premier repas compte double", body: "On le scanne ? 🥐" },
    { title: "Bol, toast, œufs… 🍳", body: "C'était quoi ce matin ?" },
    { title: "2 secondes chrono 📸", body: "Immortalise ton petit-déj." },
    { title: "Plein d'énergie ce matin ? 🥣", body: "Raconte à Fueli." },
  ],
  dejeuner: [
    { title: "L'heure de digérer 🍽️", body: "…et de scanner ton déj." },
    { title: "T'as mangé quoi à midi ?", body: "2 secondes pour le noter." },
    { title: "Pause déj terminée ? 🥗", body: "Un p'tit scan avant de repartir." },
    { title: "Ton assiette de midi t'attend 😋", body: "Elle est dans Fueli." },
    { title: "Midi est passé 🍝", body: "Ton déj aussi ? Scanne-le." },
    { title: "Resto, tupperware ou cantine 📲", body: "On note tout." },
    { title: "Le carburant de l'aprem ⚡", body: "On enregistre ton déj ?" },
  ],
  diner: [
    { title: "Dernier plat de la journée 🌙", body: "On ne l'oublie pas." },
    { title: "Avant le canapé 🛋️", body: "Note ton dîner vite fait." },
    { title: "Journée finie ? ✨", body: "Ton dîner mérite un dernier scan." },
    { title: "C'était quoi ce soir ? 🍲", body: "Fueli veut savoir." },
    { title: "Un dernier geste avant Netflix 🎬", body: "Scanne ton dîner." },
    { title: "Dîner bouclé 🌟", body: "Ta journée nutrition aussi ?" },
    { title: "Avant de ranger la cuisine 🍴", body: "Note ton repas." },
  ],
};

/**
 * Tire une accroche au hasard pour un repas donné, en excluant l'index de la
 * dernière utilisée (passé en paramètre) pour éviter une répétition immédiate.
 * Renvoie aussi l'index choisi, à re-stocker pour le prochain envoi.
 */
export function pickNotifCopy(
  slot: MealSlot,
  lastIndex?: number,
): { copy: NotifCopy; index: number } {
  const pool = NOTIF_COPY[slot];
  if (pool.length === 1) return { copy: pool[0], index: 0 };

  let index = Math.floor(Math.random() * pool.length);
  if (index === lastIndex) {
    // décale d'un cran pour ne pas retomber sur la même
    index = (index + 1) % pool.length;
  }
  return { copy: pool[index], index };
}
