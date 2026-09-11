# Authentification & Onboarding

## Authentification

Gérée entièrement par **Supabase Auth**. L'application utilise les cookies SSR via `@supabase/ssr` pour maintenir la session côté serveur (Next.js App Router).

### Flux

```
/login  → LoginForm → supabase.auth.signInWithPassword()
/signup → supabase.auth.signUp() → email de confirmation
/forgot-password → supabase.auth.resetPasswordForEmail()
/auth/callback → échange le code OAuth → session cookie
/auth/recovery → route de reset password
```

### Garde de routes

Le middleware (`src/lib/supabase/middleware.ts`) tourne sur chaque request :
1. Refresh automatique du token si expiré
2. Si l'utilisateur n'est pas connecté → redirect `/login`
3. Si connecté mais profil incomplet → redirect `/onboarding`

---

## Onboarding 6 étapes

Fichier principal : `src/app/onboarding/onboarding-flow.tsx`

L'état de progression est géré par un `useState<Step>` côté client. Si l'utilisateur rafraîchit la page, le middleware vérifie si le profil est complet et reprend à la bonne étape.

### Étapes

| Étape | Composant | Données collectées |
|---|---|---|
| 1 — Compte | `step-account.tsx` | Email + mot de passe (création compte Supabase) |
| 2 — Identité | `step-identity.tsx` | Prénom, nom, âge, sexe |
| 3 — Morphologie | `step-morphology.tsx` | Poids (kg), taille (cm) |
| 4 — Objectif | `step-goal.tsx` | `perte` / `masse` / `equilibre` |
| 5 — Activité | `step-activity.tsx` | Niveau (`aucun`/`peu`/`regulier`) + fréquence (`1-2`/`3-4`/`5+`) |
| 6 — RGPD | `step-consent.tsx` | Consentement explicite (bloquant) |

### Création du profil

À la fin de l'étape 6, la server action `src/app/onboarding/actions.ts` fait un `INSERT` dans la table `profiles`. Un **trigger SQL** Supabase crée automatiquement une ligne vide dans `profiles` à l'inscription — l'action de fin d'onboarding la remplit avec `UPDATE`.

### Types

Tous les types de l'onboarding sont centralisés dans `src/app/onboarding/types.ts` :

```ts
type Sex              = "homme" | "femme" | "autre"
type Goal             = "perte" | "masse" | "equilibre"
type ActivityLevel    = "aucun" | "peu" | "regulier"
type ActivityFrequency = "1-2" | "3-4" | "5+"
```

---

## Déconnexion et suppression de compte

Depuis la page Profil, le composant `ProfileActions` gère :

- **Déconnexion** : `supabase.auth.signOut()` → redirect `/login`
- **Suppression définitive** : double confirmation → `supabase.auth.admin.deleteUser()` via le client `service_role` → cascade SQL supprime toutes les données
