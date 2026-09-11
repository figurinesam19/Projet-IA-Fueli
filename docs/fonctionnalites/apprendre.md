# Section Apprendre

**Route** : `/learn` et `/learn/[slug]`
**Fichiers** :
- `src/app/(app)/learn/page.tsx` — liste des articles
- `src/app/(app)/learn/[slug]/page.tsx` — détail d'un article
- `src/app/(app)/learn/article-content.tsx` — rendu des blocs
- `src/lib/articles.ts` — contenu statique + types

---

## Contenu statique

Les articles sont entièrement statiques (pas de CMS, pas de base de données). Ils sont définis dans `src/lib/articles.ts` sous forme d'un tableau `ARTICLES`.

### Articles disponibles

| Slug | Titre | Catégorie | Durée |
|---|---|---|---|
| `faux-aliments-sains` | Les 5 faux aliments "sains" qui te trompent | Mindset | 4 min |
| `tes-besoins-selon-objectif` | Combien manger selon ton objectif | Nutrition | 5 min |
| `erreurs-sportifs-amateurs` | Les erreurs nutrition classiques chez les sportifs | Nutrition | 6 min |
| `comprendre-macronutriments` | Comprendre les macros en 5 minutes | Bases | 4 min |
| `hydratation-bases` | Hydratation : combien d'eau boire vraiment | Bases | 3 min |
| `petits-dejeuners-proteines` | 5 petits-déjeuners riches en protéines | Recettes | 4 min |

### Catégories

`"bases"` / `"mindset"` / `"nutrition"` / `"recettes"`

---

## Système de blocs

Chaque article est une liste de blocs (`ArticleBlock[]`). Le composant `ArticleContent` rend chaque type de bloc différemment.

### Types de blocs

```ts
type ArticleBlock =
  | { type: "p";     text: string }
  | { type: "h2";    text: string }
  | { type: "ul";    items: string[] }
  | { type: "quote"; text: string }
  | { type: "img";   src: string; alt: string }
```

### Rendu de chaque bloc

| Type | Rendu |
|---|---|
| `p` | Paragraphe texte, supporte la syntaxe `[[texte]]` pour highlight bleu |
| `h2` | Titre avec barre bleue verticale à gauche |
| `ul` | Liste avec puces bleues sur fond `#F7F8FC` |
| `quote` | Citation sur fond dégradé orange, bordure gauche orange |
| `img` | Image Unsplash, hauteur 180px, `objectFit: cover`, coins arrondis 16px |

### Syntaxe highlight `[[texte]]`

Dans les blocs `p` et `ul`, le texte entre `[[` et `]]` est rendu avec un fond bleu clair et du texte bleu gras :

```
"[[35 ml par kg]] de poids corporel par jour"
→ <mark style="background:#EEF3FF; color:#1A5CFF; ...">35 ml par kg</mark> de poids corporel par jour
```

---

## Images dans les articles

Chaque article contient une image Unsplash positionnée après le premier paragraphe. Les images sont :
- Chargées avec `loading="lazy"` (pas de Largest Contentful Paint inutile)
- `<img>` natif (pas `next/image`) pour éviter la configuration de domaines autorisés
- Format : `?w=600&h=220&fit=crop&q=80` dans l'URL Unsplash pour optimiser la taille

---

## Filtres par catégorie

La page liste affiche tous les articles avec la possibilité de filtrer par catégorie via des pills horizontales scrollables. Le filtre est géré en état client.

---

## Ajouter un article

1. Ouvrir `src/lib/articles.ts`
2. Ajouter un objet dans le tableau `ARTICLES` :

```ts
{
  slug: "mon-article",
  title: "Mon titre",
  excerpt: "Résumé court affiché dans la liste.",
  category: "bases",    // bases | mindset | nutrition | recettes
  emoji: "🥦",
  readMinutes: 4,
  publishedAt: "2026-09-11",
  body: [
    { type: "p", text: "Introduction..." },
    { type: "img", src: "https://images.unsplash.com/...", alt: "Description" },
    { type: "h2", text: "Première partie" },
    { type: "p", text: "Contenu avec [[mise en valeur]] possible." },
    { type: "quote", text: "Citation marquante." },
  ],
}
```

Aucun redéploiement particulier requis — Next.js génère les pages statiquement.
