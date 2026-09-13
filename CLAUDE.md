@AGENTS.md

# Projet Fueli — Contexte complet

## Concept
Application nutrition IA. "Fueli" vient de l'anglais "fuel" — la nourriture comme carburant du corps. Pas de régime, juste comprendre ce qu'on mange. Stack : Next.js 16 / React 19 / Supabase / OpenAI GPT-4o Mini / shadcn/ui.

---

## ✅ MVP fonctionnel — ce qui est déjà fait

- **Auth Supabase** : inscription, connexion, déconnexion, reset password, cookies SSR, middleware + garde routes privées
- **Onboarding 6 étapes** : Compte → Identité → Morphologie → Objectif → Activité → RGPD. Reprise possible après refresh. Création profil via trigger SQL.
- **Dashboard `/today`** : bilan calorique (carte bleue), 3 barres macros (protéines/glucides/lipides), strip 7 derniers jours cliquable, liste repas du jour, calcul Mifflin-St Jeor
- **Scan photo IA** : upload + compression client-side, analyse GPT-4o Mini avec JSON Schema strict, écran validation (édition nom/quantité, suppression items), sélecteur type de repas. Photo jamais stockée (RGPD).
- **Recherche texte Open Food Facts FR** : debounced, liste avec image/marque/kcal, ajout avec quantité + type repas
- **Scan code-barre** : saisie manuelle → lookup OFF, validation 8-13 chiffres
- **Détail repas `/meal/[id]`** : vue complète, changement type repas, suppression item, suppression repas entier (confirmation 2 clics)
- **Profil** : lecture `/profile`, édition complète `/profile/edit`, suppression définitive (admin client + cascade SQL), déconnexion
- **Section Apprendre** : 4 articles statiques (mythes, objectifs, sport, basiques), liste + détail
- **RGPD complet** : politique confidentialité 9 sections, consentement bloquant, droits implémentés, RLS strict
- **Identité visuelle** : Inter, palette bleu/orange/jaune, fond clair, bottom nav 3 onglets, border-radius 8/12px, pas de dark mode (V1)
- **Déploiement Vercel** : app live sur https://projet-ia-fueli.vercel.app (push sur `main` = déploiement auto), variables d'env configurées, HTTPS
- **Caméra in-app live preview** (`getUserMedia`) : flux vidéo temps réel, capture snapshot canvas, bouton retourner caméra (avant/arrière), guides de cadrage, fallback galerie, gestion permissions/erreurs → `src/app/(app)/scan/camera-capture.tsx`
- **Splash screen PWA** : overlay global dans le RootLayout (`SplashOverlay`), s'affiche à chaque lancement même quand iOS restaure la dernière URL, gère le bfcache via `pageshow/persisted`
- **Login redesigné** : 3 cartes food empilées style Instagram (Unsplash, images HD Retina), gradient, animations. Page mot de passe oublié à la charte (icône clé, coche verte état envoyé)
- **Reset password fiable cross-navigateur** : flow implicit (jetons dans le hash). ⚠️ `createBrowserClient` de `@supabase/ssr` FORCE flowType pkce en écrasant les options — c'est pourquoi `forgot-form.tsx` utilise `createClient` de `@supabase/supabase-js` directement. Ne jamais revenir en arrière là-dessus. `/reset-password` est une page client qui lit le hash et fait `setSession`.
- **Optimisations latence** : cache onboarding middleware via cookie `fueli_ob` (supprime la requête DB profiles à chaque navigation), surlignage optimiste bottom nav, changement de jour du dashboard 100 % client (semaine chargée d'un coup, zéro réseau au clic)
- **Notifications push — étape 1 (socle)** : service worker `public/sw.js`, table `push_subscriptions` (RLS), écran `/profile/notifications` (activer/désactiver, cas iOS non installé/bloqué), notif test réservée aux admins (`src/lib/admin.ts`). Clés VAPID dans `.env.local` + Vercel. Pool de 21 accroches variées prêt dans `src/lib/notification-copy.ts` (tirage sans répétition immédiate).
- **Streaks** : badge 🔥 jours consécutifs sur le dashboard (`computeStreak` dans lib/date), tolérant au jour courant pas encore scanné
- **Suivi du poids** : table `weight_logs` (1/jour, upsert), carte dashboard avec sparkline + delta coloré selon objectif, bottom sheet de saisie ; chaque pesée met à jour `profiles.weight_kg` → recalcul auto de l'objectif calorique
- **Bilan hebdomadaire `/week`** : barres kcal/jour colorées (vert ±10 % objectif / bleu dessous / orange dessus), stats (moyenne, jours scannés, dans l'objectif, protéines), comparaison semaine précédente
- **Ajout rétroactif** : scanner/rechercher/code-barre sur n'importe quel jour passé via `?d=AAAA-MM-JJ` (boutons visibles sur les jours passés du strip, repas daté à midi, retour sur le bon jour)

---

## ⬜ Reste à faire (par priorité)

1. **Notifications push — étape 2 (cron)** : Vercel Cron à 9h30 / 13h30 / 21h (heures repas 8h30 / 12h30 / 20h, rappel ~1h après), n'envoyer QUE si le repas du créneau n'est pas scanné, max 3/jour, accroches tirées de `notification-copy.ts` sans répétition, garde-fou anti-harcèlement si plusieurs jours d'inactivité
2. **Assistant « il te reste X »** : carte dashboard avec calories/protéines restantes + suggestion IA de repas (OpenAI déjà branché)
3. **Scan code-barre via caméra** (@zxing/browser ou BarcodeDetector) — nécessite HTTPS
4. **Passe design complète** — animations, micro-interactions, hiérarchie visuelle
5. **CGU** page `/legal/terms`
6. **Articles supplémentaires** dans la section Apprendre
