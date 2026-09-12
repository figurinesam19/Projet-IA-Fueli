/**
 * Comptes ayant accès aux outils internes (ex. bouton d'envoi de notif test).
 * Ne PAS exposer d'outils sensibles sur la base de ce simple check email :
 * c'est suffisant pour masquer des boutons de debug, pas pour des privilèges
 * critiques.
 */
export const ADMIN_EMAILS = ["samuelartur2004@gmail.com"];

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && ADMIN_EMAILS.includes(email.toLowerCase());
}
