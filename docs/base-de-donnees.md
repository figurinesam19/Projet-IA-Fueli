# Base de données — Supabase

## Tables

### `profiles`

Créée automatiquement par trigger SQL à l'inscription. Liée à `auth.users` via l'`id`.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Identique à `auth.users.id` |
| `first_name` | text | Prénom |
| `last_name` | text | Nom |
| `age` | integer | Âge |
| `sex` | text | `"homme"` / `"femme"` / `"autre"` |
| `weight_kg` | numeric | Poids en kg |
| `height_cm` | numeric | Taille en cm |
| `goal` | text | `"perte"` / `"masse"` / `"equilibre"` |
| `activity_level` | text | `"aucun"` / `"peu"` / `"regulier"` |
| `activity_frequency` | text | `"1-2"` / `"3-4"` / `"5+"` (null si aucun sport) |
| `rgpd_consent` | boolean | Consentement RGPD (bloquant à l'onboarding) |
| `created_at` | timestamptz | Date de création |

---

### `meals`

Un repas = une session d'ajout (scan, recherche ou code-barre).

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Identifiant unique |
| `user_id` | uuid (FK → auth.users) | Propriétaire |
| `kind` | text | `"petit_dejeuner"` / `"dejeuner"` / `"diner"` / null |
| `source` | text | `"scan_photo"` / `"recherche"` / `"code_barre"` |
| `total_kcal` | numeric | Total calories du repas |
| `total_protein_g` | numeric | Total protéines (g) |
| `total_carbs_g` | numeric | Total glucides (g) |
| `total_fat_g` | numeric | Total lipides (g) |
| `consumed_at` | timestamptz | Date/heure de consommation |

---

### `meal_items`

Le détail de chaque aliment dans un repas.

| Colonne | Type | Description |
|---|---|---|
| `id` | uuid (PK) | Identifiant unique |
| `meal_id` | uuid (FK → meals) | Repas parent |
| `name` | text | Nom de l'aliment |
| `quantity_g` | numeric | Quantité en grammes |
| `kcal` | numeric | Calories |
| `protein_g` | numeric | Protéines (g) |
| `carbs_g` | numeric | Glucides (g) |
| `fat_g` | numeric | Lipides (g) |

---

## Sécurité — Row Level Security (RLS)

Le RLS est activé sur toutes les tables. Chaque utilisateur ne peut accéder qu'à ses propres données.

```sql
-- profiles : lecture et modification uniquement par le propriétaire
CREATE POLICY "profiles_self" ON profiles
  USING (auth.uid() = id);

-- meals : lecture et modification uniquement par le propriétaire
CREATE POLICY "meals_self" ON meals
  USING (auth.uid() = user_id);

-- meal_items : accessible uniquement si le repas parent appartient à l'utilisateur
CREATE POLICY "meal_items_self" ON meal_items
  USING (
    meal_id IN (SELECT id FROM meals WHERE user_id = auth.uid())
  );
```

Même si quelqu'un accède directement à la base de données Supabase avec une clé publique (anon key), il ne peut lire que ses propres lignes.

---

## Ce qui n'est PAS stocké

- **Photos de repas** : envoyées à OpenAI en base64, analysées, jamais persistées. Seuls les résultats JSON (aliments + macros) sont enregistrés si l'utilisateur confirme.
- **Mots de passe** : gérés par Supabase Auth, hashés (bcrypt). L'application n'y a jamais accès.

---

## Suppression de compte

La suppression est définitive et en cascade :

1. `supabase.auth.admin.deleteUser(userId)` — supprime l'entrée dans `auth.users`
2. Cascade SQL → supprime `profiles`, `meals`, `meal_items` automatiquement

Le client `admin` utilise la clé `service_role` (variable d'env serveur uniquement, jamais exposée côté client).
