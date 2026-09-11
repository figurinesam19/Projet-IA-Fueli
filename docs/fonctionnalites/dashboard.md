# Dashboard — Aujourd'hui

**Route** : `/today`
**Fichier principal** : `src/app/(app)/today/page.tsx`

## Vue d'ensemble

Le dashboard est la page principale de l'application. Il affiche le bilan nutritionnel du jour sélectionné et permet de naviguer dans les 7 derniers jours.

---

## Composants

### `date-strip.tsx`
Bande horizontale scrollable affichant les 7 derniers jours. Chaque item est cliquable pour changer la date affichée. Un **point indicateur** apparaît sous la date du jour courant (bleu si non sélectionné, blanc semi-transparent si actif).

### `daily-card.tsx`
Carte bleue principale affichant :
- Calories consommées sur l'objectif (`kcalConsumed / kcalTarget`)
- Barre de progression
- Texte contextuel (sous l'objectif, à l'objectif, dépassé)

### `macro-bars.tsx`
3 barres de progression colorées pour protéines (bleu), glucides (orange), lipides (ambre). Chaque barre affiche la valeur consommée et l'objectif en grammes.

### `scan-fab.tsx`
Boutons d'action rapide en bas de la liste des repas :
- **Rechercher** (tint bleu) → `/search`
- **Code-barre** (tint orange) → `/barcode`
- **Scanner** (bouton orange gradient, FAB) → `/scan`

---

## Calcul nutritionnel

Les objectifs journaliers sont calculés par `src/lib/nutrition.ts` avec la **formule Mifflin-St Jeor** :

```
BMR = 10 × poids(kg) + 6.25 × taille(cm) - 5 × âge
      + 5 (homme) / -161 (femme) / -78 (autre)

TDEE = BMR × multiplicateur_activité

Objectif kcal = TDEE + delta_objectif
  - Perte de poids : -500 kcal/jour
  - Prise de masse : +400 kcal/jour
  - Équilibre      :   0 kcal/jour
```

**Répartition des macros** (standard) :
- Protéines : 25% des kcal → divisé par 4 = grammes
- Glucides  : 45% des kcal → divisé par 4 = grammes
- Lipides   : 30% des kcal → divisé par 9 = grammes

---

## État vide

Quand aucun repas n'est enregistré pour la date sélectionnée, une carte blanche avec l'emoji 🍽️ invite l'utilisateur à scanner son premier repas.

---

## Liste des repas du jour

Chaque repas est affiché avec :
- Emoji du type de repas (🌅 🌙 ☀️)
- Nom des aliments (concaténés, tronqués si trop longs)
- Calories totales
- Lien vers `/meal/[id]` pour le détail
