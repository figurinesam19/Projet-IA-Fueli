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

---

## ⬜ Reste à faire (par priorité)

1. **Déploiement Vercel** — push GitHub → variables d'env (Supabase keys, OpenAI key, service_role) → redirect URLs Supabase → HTTPS auto
2. **Caméra in-app live preview** (getUserMedia) — nécessite HTTPS
3. **Scan code-barre via caméra** (@zxing/browser ou BarcodeDetector) — nécessite HTTPS
4. **Passe design complète** — animations, micro-interactions, hiérarchie visuelle
5. **CGU** page `/legal/terms`
6. **Articles supplémentaires** dans la section Apprendre
