# Détail d'un repas

**Route** : `/meal/[id]`
**Fichiers** :
- `src/app/(app)/meal/[id]/page.tsx` — Server Component (fetch Supabase)
- `src/app/(app)/meal/[id]/meal-detail.tsx` — Client Component (interactivité)
- `src/app/(app)/meal/[id]/actions.ts` — Server Actions

---

## Affichage

La page charge le repas et ses aliments depuis Supabase côté serveur, puis passe les données au composant client `MealDetail`.

### Informations affichées

- **En-tête** : bouton retour + emoji/nom du type de repas + date, heure, source
- **Carte totaux** : kcal en grand + 3 pills colorées (Protéines / Glucides / Lipides)
- **Sélecteur type de repas** : 3 boutons (🌅 Petit-déj. / ☀️ Déjeuner / 🌙 Soir)
- **Liste des aliments** : emoji `getFoodEmoji(name)` + nom + macros + kcal + bouton suppression
- **Bouton suppression repas** : 2 clics pour confirmer

---

## Interactions

### Changer le type de repas

Boutons pills en temps réel. Au clic :
1. `setCurrentKind(value)` → mise à jour immédiate de l'UI
2. `updateMealKind(meal.id, value)` (server action) → UPDATE en base
3. Si erreur → message affiché

### Supprimer un aliment

Bouton poubelle rouge sur chaque aliment :
1. `deleteMealItem(meal.id, itemId)` → DELETE en base
2. La page se revalide automatiquement (`revalidatePath`)

### Supprimer le repas entier

Double confirmation par sécurité :
1. Premier clic → bouton passe en rouge vif "⚠️ Confirmer la suppression" + bouton "Annuler" apparaît
2. Deuxième clic → `deleteMeal(meal.id)` → DELETE cascade (repas + items) → redirect `/today`

---

## Emojis aliments

La fonction `getFoodEmoji(name: string)` (`src/lib/food-emoji.ts`) mappe les noms d'aliments français vers des emojis pertinents. Elle utilise une liste de mots-clés pour trouver la correspondance la plus proche (ex: "poulet" → 🍗, "salade" → 🥗, "riz" → 🍚).

---

## Server Actions

```ts
// Changer le type de repas
updateMealKind(mealId: string, kind: MealKind | null)

// Supprimer un aliment (revalide /today et /meal/[id])
deleteMealItem(mealId: string, itemId: string)

// Supprimer le repas entier (cascade + redirect /today)
deleteMeal(mealId: string)
```
