# Déploiement

## Plateforme

L'application est déployée sur **Vercel** en continu : chaque push sur la branche `main` déclenche automatiquement un redéploiement.

- **URL de production** : https://projet-ia-fueli.vercel.app
- **Dépôt GitHub** : https://github.com/figurinesam19/Projet-IA-Fueli

---

## Variables d'environnement

À configurer dans le dashboard Vercel (Settings → Environment Variables) :

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique Supabase (anon) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé privée Supabase (service_role) — serveur uniquement |
| `OPENAI_API_KEY` | Clé API OpenAI |

> Les variables préfixées `NEXT_PUBLIC_` sont exposées côté navigateur. Les autres restent strictement côté serveur.

---

## Procédure de mise en ligne

1. Effectuer les modifications en local
2. Vérifier qu'il n'y a pas d'erreurs TypeScript : `npx tsc --noEmit`
3. Tester en local : `npm run dev`
4. Commiter les changements : `git add ... && git commit -m "..."`
5. Pousser sur GitHub : `git push origin main`
6. Vercel redéploie automatiquement (1-2 minutes)
7. Vérifier sur https://projet-ia-fueli.vercel.app

---

## Configuration Supabase

Après déploiement, s'assurer que les **Redirect URLs** sont configurées dans Supabase (Authentication → URL Configuration) :

```
https://projet-ia-fueli.vercel.app/auth/callback
https://projet-ia-fueli.vercel.app/auth/recovery
```

---

## Modèle IA utilisé

- **GPT-4o Mini** (OpenAI) pour l'analyse des photos de repas
- Choix justifié : bon équilibre coût / performance pour de la vision
- `temperature: 0.2` pour des réponses stables et reproductibles
- `response_format: json_schema` avec `strict: true` pour des structured outputs garantis

---

## Runtime Next.js

Le fichier `src/app/api/scan/route.ts` spécifie `export const runtime = "nodejs"` car la manipulation de `Buffer` pour l'encodage base64 n'est pas disponible dans l'Edge Runtime.
