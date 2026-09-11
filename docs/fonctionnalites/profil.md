# Profil utilisateur

**Route** : `/profile`
**Fichiers** :
- `src/app/(app)/profile/page.tsx` — page principale (Server Component)
- `src/app/(app)/profile/edit/page.tsx` — page d'édition
- `src/app/(app)/profile/edit/edit-form.tsx` — formulaire (Client Component)
- `src/app/(app)/profile/edit/actions.ts` — server action de mise à jour
- `src/app/(app)/profile/profile-actions.tsx` — déconnexion / suppression
- `src/app/(app)/profile/actions.ts` — server action suppression compte

---

## Page profil

### Carte utilisateur

- Avatar avec initiale du prénom sur dégradé bleu
- Prénom + Nom + badge streak "🔥 7 jours" (statique V1)
- Email
- Date d'inscription ("Membre depuis juin 2026")

### 3 cartes statistiques

| Carte | Valeur | Unité |
|---|---|---|
| ⚡ Objectif | Kcal cibles calculées | kcal / jour |
| ⚖️ Poids | Poids actuel | kg actuel |
| 🎯 But | Perte / Masse / Équilibre | programme |

Les kcal cibles sont calculées en temps réel par `computeDailyTargets(profile)`.

### Menu paramètres

- ✏️ Modifier mon profil → `/profile/edit`
- 🔔 Notifications (désactivées en V1)
- 💬 Aide & contact → `mailto:support@fueli.app`

### Section légale

- 📄 CGU → `/legal/terms`
- 🔒 Politique de confidentialité → `/legal/privacy`

### Historique des repas

Les 60 derniers repas groupés par date (format "Vendredi 26 Juin"). Chaque repas est cliquable → `/meal/[id]`. Les `meal_items` sont inclus dans la requête pour afficher les noms des aliments.

---

## Édition du profil

Le formulaire `EditForm` est entièrement en composants natifs (pas de shadcn/ui) :

### Sections

1. **👤 Identité** : Prénom, Nom (grid 2 colonnes), Âge, Sexe (3 pills)
2. **⚖️ Morphologie** : Poids (kg), Taille (cm) (grid 2 colonnes)
3. **🎯 Programme** : 3 options avec emoji + description (Perte / Masse / Équilibre)
4. **🏃 Activité physique** : niveau (3 options) + fréquence conditionnelle (3 pills)

### Sélections contrôlées

Les sélections (sexe, objectif, niveau, fréquence) sont gérées par `useState` côté client et transmises à la server action via l'objet `UpdateProfileInput` (pas via `FormData` pour ces champs).

### Soumission

```ts
// La server action update le profil et revalide les pages
updateProfile(input: UpdateProfileInput)
// → UPDATE profiles SET ... WHERE id = user.id
// → revalidatePath("/profile")
// → revalidatePath("/today")
// → redirect("/profile")
```

Les objectifs caloriques sont recalculés automatiquement au prochain chargement du dashboard car ils dépendent du profil.

---

## Suppression de compte

Processus en 2 étapes depuis `ProfileActions` :
1. Confirmation utilisateur (bouton devient rouge)
2. `deleteAccount()` → `supabase.auth.admin.deleteUser(userId)` avec clé `service_role`
3. Cascade SQL supprime `profiles`, `meals`, `meal_items`
4. `signOut()` → redirect `/login`
