# Architecture technique

## Stack

| Couche | Technologie | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16 |
| UI | React | 19 |
| Base de données + Auth | Supabase | — |
| IA vision | OpenAI GPT-4o Mini | — |
| Composants de base | shadcn/ui (Base UI) | — |
| Icônes | lucide-react | — |
| Hébergement | Vercel | — |

---

## Structure des dossiers

```
src/
├── app/
│   ├── (app)/                    ← Pages privées (auth requise)
│   │   ├── layout.tsx            ← Layout commun avec BottomNav
│   │   ├── today/                ← Dashboard journalier
│   │   ├── scan/                 ← Scan photo IA
│   │   ├── search/               ← Recherche texte
│   │   ├── barcode/              ← Scan code-barre
│   │   ├── meal/[id]/            ← Détail d'un repas
│   │   ├── learn/                ← Articles
│   │   │   └── [slug]/           ← Détail article
│   │   └── profile/              ← Profil utilisateur
│   │       └── edit/             ← Édition du profil
│   ├── api/
│   │   ├── scan/route.ts         ← Endpoint analyse photo (OpenAI)
│   │   └── foods/
│   │       ├── search/route.ts   ← Proxy Open Food Facts (recherche)
│   │       └── barcode/[code]/   ← Proxy Open Food Facts (code-barre)
│   ├── auth/                     ← Callbacks Supabase (OAuth, recovery)
│   ├── login/                    ← Page connexion
│   ├── signup/                   ← Page inscription
│   ├── onboarding/               ← Onboarding 6 étapes
│   ├── forgot-password/          ← Mot de passe oublié
│   ├── reset-password/           ← Réinitialisation mot de passe
│   └── legal/                    ← CGU + Politique de confidentialité
├── components/
│   ├── bottom-nav.tsx            ← Navigation bas de page
│   └── ui/                       ← Composants shadcn (input, button…)
└── lib/
    ├── articles.ts               ← Articles statiques + types
    ├── food-emoji.ts             ← Mapping nom d'aliment → emoji
    ├── image.ts                  ← Compression image client-side
    ├── nutrition.ts              ← Calcul Mifflin-St Jeor + macros
    ├── openai.ts                 ← Client OpenAI singleton
    ├── openfoodfacts.ts          ← Client Open Food Facts
    └── supabase/
        ├── client.ts             ← Client Supabase côté navigateur
        ├── server.ts             ← Client Supabase côté serveur (SSR)
        ├── admin.ts              ← Client admin (service_role)
        └── middleware.ts         ← Refresh session + garde routes
```

---

## Flux de données principal

### Scan photo IA

```
Utilisateur prend une photo
        ↓
[client] Compression JPEG (lib/image.ts)
        ↓
[client] POST /api/scan (FormData)
        ↓
[serveur] Vérification auth Supabase
        ↓
[serveur] Encodage base64 → OpenAI GPT-4o Mini (vision)
        ↓
[OpenAI] Structured Output JSON : items[] + confidence + rejection_reason
        ↓
[client] Écran de validation (édition quantités + choix type repas)
        ↓
[serveur action] saveScannedMeal → INSERT meals + meal_items (Supabase)
        ↓
redirect("/today")
```

### Authentification (SSR)

```
Request HTTP
    ↓
middleware.ts → updateSession() → refresh token Supabase si expiré
    ↓
Route protégée → createClient() → getUser() → redirect /login si non auth
```

---

## Conventions de code

- **Server Components** par défaut. `"use client"` uniquement quand l'interactivité le requiert.
- **Server Actions** pour toutes les mutations (pas de fetch vers une API interne pour les écritures).
- **Styles inline** pour le design Fueli (pas de classes Tailwind sur les pages app). Tailwind reste pour quelques composants de base (shadcn).
- **Pas de commentaires inutiles** — les noms de variables/fonctions sont suffisamment explicites.
- **`useTransition`** pour les actions async sans bloquer l'UI.
