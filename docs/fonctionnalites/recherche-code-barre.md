# Recherche texte & Code-barre

## Recherche texte

**Route** : `/search`
**Fichiers** :
- `src/app/(app)/search/search-flow.tsx`
- `src/app/(app)/search/add-food-panel.tsx`
- `src/app/api/foods/search/route.ts`
- `src/lib/openfoodfacts.ts`

### Flux

1. L'utilisateur tape un nom d'aliment dans la barre de recherche
2. Requête **debounced** (300ms) vers `GET /api/foods/search?q=...`
3. L'endpoint proxifie la requête vers **Open Food Facts FR** (`fr.openfoodfacts.org`)
4. Les résultats s'affichent avec image, marque, nom et kcal/100g
5. L'utilisateur clique sur un aliment → panneau de saisie de quantité + type de repas
6. Confirmation → server action `saveScannedMeal` (même action que le scan photo, avec `source: "recherche"`)

### Pourquoi un proxy API ?

Open Food Facts n'a pas de CORS autorisant les appels depuis un navigateur. L'API route Next.js sert de proxy côté serveur, ce qui évite les problèmes CORS et permet d'ajouter de la mise en cache si besoin.

### Données retournées par Open Food Facts

```json
{
  "product_name": "Flocons d'avoine",
  "brands": "Quaker",
  "image_front_small_url": "https://...",
  "nutriments": {
    "energy-kcal_100g": 375,
    "proteins_100g": 13.5,
    "carbohydrates_100g": 60.0,
    "fat_100g": 7.0
  }
}
```

Les valeurs sont pour 100g. La quantité saisie par l'utilisateur permet de recalculer les valeurs réelles.

---

## Scan code-barre

**Route** : `/barcode`
**Fichiers** :
- `src/app/(app)/barcode/barcode-flow.tsx`
- `src/app/(app)/barcode/barcode-scanner.tsx`
- `src/app/api/foods/barcode/[code]/route.ts`

### Flux

1. L'utilisateur saisit manuellement un code-barre (8 à 13 chiffres, validé côté client)
2. Requête vers `GET /api/foods/barcode/[code]`
3. L'endpoint interroge Open Food Facts par code-barre
4. Si le produit est trouvé → même panneau de saisie de quantité que la recherche texte
5. Si non trouvé → message d'erreur

### Validation du code-barre

```ts
/^\d{8,13}$/.test(code)
```

Accepte les formats EAN-8, EAN-13 et UPC-A.

### Scan caméra (à venir)

La dépendance `@zxing/browser` est déjà installée pour le scan caméra. L'implémentation est prévue en V2 (nécessite HTTPS, déjà actif sur Vercel).
