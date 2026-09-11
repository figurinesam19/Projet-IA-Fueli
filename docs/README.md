# Documentation Fueli

> Application nutrition IA — "Fueli, comprends ce que tu manges"

## Présentation

Fueli est une application mobile web qui aide les utilisateurs à comprendre leur alimentation sans tomber dans la logique du régime strict. L'utilisateur scanne ses repas (photo, code-barre ou recherche texte), l'IA analyse et estime les macronutriments, et le dashboard présente un bilan journalier clair.

**URL de production :** https://projet-ia-fueli.vercel.app

---

## Index de la documentation

| Fichier | Contenu |
|---|---|
| [architecture.md](./architecture.md) | Stack technique, structure du projet, flux de données |
| [base-de-donnees.md](./base-de-donnees.md) | Schéma Supabase, tables, RLS, sécurité |
| [design-system.md](./design-system.md) | Charte graphique, palette, composants, animations |
| [deploiement.md](./deploiement.md) | Variables d'environnement, Vercel, procédure de mise en ligne |
| [fonctionnalites/auth-onboarding.md](./fonctionnalites/auth-onboarding.md) | Authentification et onboarding 6 étapes |
| [fonctionnalites/dashboard.md](./fonctionnalites/dashboard.md) | Dashboard journalier, bilan calorique, macros |
| [fonctionnalites/scan-ia.md](./fonctionnalites/scan-ia.md) | Scan photo IA, OpenAI, structured outputs |
| [fonctionnalites/recherche-code-barre.md](./fonctionnalites/recherche-code-barre.md) | Recherche texte Open Food Facts et scan code-barre |
| [fonctionnalites/detail-repas.md](./fonctionnalites/detail-repas.md) | Page détail d'un repas, édition, suppression |
| [fonctionnalites/profil.md](./fonctionnalites/profil.md) | Profil utilisateur, calcul nutritionnel, historique |
| [fonctionnalites/apprendre.md](./fonctionnalites/apprendre.md) | Section articles statiques |

---

## Ce qui est fait (MVP)

- Auth complète (inscription, connexion, reset password, SSR)
- Onboarding 6 étapes avec reprise possible
- Dashboard journalier avec bilan kcal et macros
- Scan photo IA (GPT-4o Mini + Structured Outputs)
- Recherche texte Open Food Facts
- Scan code-barre (saisie manuelle)
- Détail repas avec édition et suppression
- Profil utilisateur complet avec calcul Mifflin-St Jeor
- Section Apprendre avec 6 articles
- Pages légales (CGU, Politique de confidentialité)
- RGPD : photos non stockées, RLS strict, consentement bloquant

## Ce qui reste à faire

1. Caméra in-app live preview (getUserMedia — nécessite HTTPS, déjà actif)
2. Scan code-barre via caméra (@zxing/browser)
3. Articles supplémentaires dans la section Apprendre
4. CGU finalisée
