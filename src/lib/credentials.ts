/**
 * Enregistre les identifiants dans le gestionnaire de mots de passe du navigateur
 * via la Credential Management API.
 *
 * Pourquoi : sur une app SPA (Supabase + router.replace), la connexion se fait en
 * JavaScript sans navigation classique. L'heuristique « Enregistrer le mot de passe ? »
 * de Chrome/Edge rate souvent ce cas. Cet appel le déclenche explicitement.
 *
 * Supporté sur Chrome / Edge / Android. No-op silencieux sur Safari / iOS, qui
 * s'appuient sur les attributs `autocomplete` du formulaire (déjà en place).
 */
export async function saveCredentials(email: string, password: string): Promise<void> {
  if (typeof window === "undefined" || !("PasswordCredential" in window)) return;

  try {
    const PasswordCredentialCtor = (
      window as unknown as {
        PasswordCredential: new (data: { id: string; password: string; name?: string }) => Credential;
      }
    ).PasswordCredential;

    const credential = new PasswordCredentialCtor({ id: email, password });
    await navigator.credentials.store(credential);
  } catch {
    // Silencieux : l'utilisateur peut refuser l'enregistrement, ou l'API être indisponible.
  }
}
