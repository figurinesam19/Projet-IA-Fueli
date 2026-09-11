# Design System Fueli

## Principes

- **Mobile-first** : conçu pour 390px de large (iPhone standard)
- **Styles inline** : toutes les pages de l'app utilisent des styles React inline (pas de classes Tailwind sur les composants métier)
- **Pas de dark mode** (V1)
- **Pas d'emojis décoratifs** dans le code — uniquement là où ils portent du sens (type de repas, aliments)

---

## Palette de couleurs

| Rôle | Valeur | Usage |
|---|---|---|
| Bleu principal | `#1A5CFF` | CTA, sélection active, protéines |
| Bleu clair (tint) | `#EEF3FF` | Fond des éléments actifs bleus |
| Orange | `#FF6B1A` | Glucides, actions secondaires |
| Orange foncé | `#E5550A` | Orange au hover / pressed |
| Orange clair (tint) | `#FFF3EC` | Fond des éléments oranges |
| Ambre | `#D98A1A` | Lipides, petit-déjeuner |
| Ambre clair (tint) | `#FFF7E8` | Fond des éléments ambres |
| Violet | `#7C3AED` | Repas du soir |
| Violet clair (tint) | `#F1ECFF` | Fond des éléments violets |
| Rouge | `#E5150A` | Suppression, erreurs |
| Rouge clair (tint) | `#FFF0F0` | Fond bouton suppression |
| Fond page | `#F4F6FA` | Arrière-plan global |
| Blanc | `#fff` | Cartes, inputs |
| Texte principal | `#1A1A2E` | Titres, valeurs importantes |
| Texte secondaire | `#3A3A52` | Corps de texte |
| Texte tertiaire | `#6B6B82` | Labels, actions neutres |
| Texte désactivé | `#9595A8` | Labels uppercase, placeholders |
| Séparateur | `#C4C4D1` | Unités, éléments très discrets |
| Fond item | `#F7F8FC` | Fond des listes, inputs non focus |

---

## Typographie

- **Police** : Inter (Google Fonts)
- **Titres page** : 26px, weight 800, letter-spacing -0.03em
- **Titres section** : 20px, weight 800, letter-spacing -0.02em
- **Sous-titres** : 17px, weight 800
- **Corps** : 15px, weight 500, line-height 1.6
- **Labels uppercase** : 11px, weight 700, letter-spacing 0.05em, couleur `#9595A8`
- **Valeurs numériques** : `fontVariantNumeric: "tabular-nums"` systématiquement

---

## Rayons de bordure (border-radius)

| Élément | Valeur |
|---|---|
| Cartes principales | 22–24px |
| Cartes secondaires | 18–20px |
| Boutons principaux | 16px |
| Pills / chips | 12–14px |
| Icône emoji dans bulle | 10–13px |
| Indicateurs dot | 50% |

---

## Ombres

```css
/* Carte principale */
box-shadow: 0 8px 24px rgba(26,26,46,.06);

/* Carte secondaire */
box-shadow: 0 6px 16px rgba(26,26,46,.05);

/* Carte légère */
box-shadow: 0 4px 12px rgba(26,26,46,.04);

/* Bouton flottant / FAB */
box-shadow: 0 8px 20px rgba(255,107,26,.35);  /* orange */
box-shadow: 0 8px 20px rgba(26,92,255,.35);    /* bleu */
```

---

## Animations

Définies dans `globals.css` :

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.animate-fade-up   { animation: fade-up 0.4s ease both; }
.animate-fade-up-1 { animation: fade-up 0.4s ease 0.06s both; }
.animate-fade-up-2 { animation: fade-up 0.4s ease 0.12s both; }
.animate-fade-up-3 { animation: fade-up 0.4s ease 0.18s both; }
.animate-fade-up-4 { animation: fade-up 0.4s ease 0.24s both; }
.animate-fade-up-5 { animation: fade-up 0.4s ease 0.30s both; }
```

Chaque section d'une page reçoit une classe `animate-fade-up-N` pour un effet d'apparition en cascade.

---

## Classe utilitaire `page-bottom`

```css
.page-bottom {
  padding-bottom: calc(160px + env(safe-area-inset-bottom, 0px)) !important;
}
```

Appliquée sur le `<main>` de chaque page pour éviter que le contenu soit masqué par la bottom nav et la safe area iOS.

---

## Classe `fu-input`

Input natif stylisé Fueli :

```css
.fu-input {
  width: 100%;
  border: 1.5px solid #E8EAF0;
  border-radius: 12px;
  background: #F7F8FC;
  font-family: inherit;
  color: #1A1A2E;
  outline: none;
  transition: border-color 0.15s;
}
.fu-input:focus {
  border-color: #1A5CFF;
  background: #fff;
}
```

---

## Bottom Navigation

Composant `src/components/bottom-nav.tsx`. Affiché **uniquement** sur les 3 routes principales :
- `/today` → icône maison "Aujourd'hui"
- `/learn` → icône livre "Apprendre"
- `/profile` → icône utilisateur "Profil"

Caché sur toutes les sous-pages (`/scan`, `/meal/[id]`, `/search`, etc.).

---

## Couleurs par type de repas

| Type | Emoji | Couleur | Tint |
|---|---|---|---|
| Petit-déjeuner | 🌅 | `#D98A1A` | `#FFF7E8` |
| Déjeuner | ☀️ | `#1A5CFF` | `#EEF3FF` |
| Repas du soir | 🌙 | `#7C3AED` | `#F1ECFF` |

---

## Couleurs par macro

| Macro | Couleur | Tint |
|---|---|---|
| Protéines | `#1A5CFF` | `#EEF3FF` |
| Glucides | `#FF6B1A` | `#FFF3EC` |
| Lipides | `#D98A1A` | `#FFF7E8` |
