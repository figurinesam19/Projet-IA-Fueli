# Scan photo IA

**Route** : `/scan`
**Fichiers** :
- `src/app/(app)/scan/scan-flow.tsx` — orchestrateur client
- `src/app/(app)/scan/camera-capture.tsx` — capture photo / galerie
- `src/app/(app)/scan/review-items.tsx` — écran de validation
- `src/app/(app)/scan/actions.ts` — server action de sauvegarde
- `src/app/api/scan/route.ts` — endpoint API OpenAI

---

## Flux complet

```
1. CAPTURE    — L'utilisateur prend une photo ou importe depuis la galerie
2. ANALYZING  — L'image est compressée et envoyée à GPT-4o Mini
3. REVIEW     — L'utilisateur valide les aliments, les quantités et le type de repas
4. SAVE       — Enregistrement en base de données → redirect /today
```

---

## Étape 1 : Capture

Le composant `CameraCapture` tente d'accéder à la caméra via `navigator.mediaDevices.getUserMedia`. Si la caméra est indisponible (HTTP, pas de permission, pas de caméra), il affiche une erreur et propose l'import depuis la galerie.

**Compression client-side** (`src/lib/image.ts`) : avant envoi, l'image est redimensionnée et compressée en JPEG 80% pour réduire la taille et le coût API. Maximum accepté côté serveur : 5 Mo.

---

## Étape 2 : Analyse IA

**Endpoint** : `POST /api/scan`

1. Vérification auth Supabase
2. Récupération de l'image depuis le FormData
3. Encodage en base64 data URL
4. Appel `openai().chat.completions.create()` avec :
   - Modèle : `gpt-4o-mini`
   - `temperature: 0.2` (réponses stables)
   - `response_format: { type: "json_schema", json_schema: RESPONSE_SCHEMA }`

### Structured Outputs

Le schéma JSON imposé au modèle garantit une réponse toujours structurée et parseable :

```json
{
  "items": [
    {
      "name": "Poulet grillé",
      "quantity_g": 150,
      "kcal": 330,
      "protein_g": 30.0,
      "carbs_g": 0.0,
      "fat_g": 20.0
    }
  ],
  "confidence": "high",
  "rejection_reason": null
}
```

- `strict: true` + `additionalProperties: false` → aucun champ inattendu
- Tous les champs sont obligatoires (`required`)
- `confidence` est un enum strict : `"high"` / `"medium"` / `"low"`
- `rejection_reason` est null si l'analyse réussit, sinon :
  - `"blurry"` — photo floue ou bougée
  - `"poor_lighting"` — trop sombre ou surexposée
  - `"no_food"` — aucune nourriture visible
  - `"unanalyzable"` — autre problème

### Messages d'erreur selon la raison

| `rejection_reason` | Message affiché |
|---|---|
| `"blurry"` | 📷 Photo trop floue — stabilise ton téléphone et reprends la photo. |
| `"poor_lighting"` | 💡 Photo trop sombre — améliore l'éclairage et réessaie. |
| `"no_food"` | 🍽️ Aucune nourriture détectée — cadre bien l'assiette et réessaie. |
| `"unanalyzable"` | ❌ Photo inexploitable — essaie un autre angle ou importe depuis la galerie. |

---

## Étape 3 : Validation

L'écran `ReviewItems` permet à l'utilisateur de :
- **Modifier le nom** de chaque aliment
- **Modifier la quantité** (les macros se recalculent proportionnellement)
- **Modifier les kcal** directement
- **Supprimer** un aliment
- **Choisir le type de repas** : 🌅 Petit-déj. / ☀️ Déjeuner / 🌙 Soir (optionnel)

Un bandeau d'avertissement apparaît si `confidence === "medium"` ou `"low"`.

---

## Étape 4 : Sauvegarde

Server action `saveScannedMeal` dans `src/app/(app)/scan/actions.ts` :

1. Calcule les totaux (somme de tous les items)
2. `INSERT` dans `meals` avec `kind`, `source: "scan_photo"`, totaux
3. `INSERT` dans `meal_items` pour chaque aliment
4. `revalidatePath("/today")` → invalide le cache du dashboard
5. `redirect("/today")`

**La photo n'est jamais stockée** — seules les données nutritionnelles JSON sont persistées.

---

## Précision des données

Les valeurs nutritionnelles sont des **estimations**. La principale source d'erreur est la quantité en grammes (difficile à estimer visuellement). Les valeurs nutritionnelles par aliment sont fiables (référentiel CIQUAL). L'écran de validation permet à l'utilisateur de corriger avant d'enregistrer.
