/**
 * Compresse une image dans le navigateur avant envoi au serveur.
 * Réduit la largeur max à 1280px et encode en JPEG qualité 0.85.
 * Garde l'orientation EXIF naturelle (createImageBitmap la gère).
 */
export async function compressImage(file: File, maxWidth = 1280): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté");
  ctx.drawImage(bitmap, 0, 0, width, height);

  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Échec compression"))),
      "image/jpeg",
      0.85,
    ),
  );
  return blob;
}
