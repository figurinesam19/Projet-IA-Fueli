"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { deleteAccount } from "./actions";

export function ProfileActions() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleLogout() {
    start(async () => {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.replace("/login");
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setError(null);
    start(async () => {
      const result = await deleteAccount();
      if (result?.error) {
        setError(result.error);
        setConfirmDelete(false);
      }
    });
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleLogout}
        disabled={pending}
      >
        Se déconnecter
      </Button>

      {confirmDelete && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-3 text-xs leading-relaxed text-destructive">
          Cette action est <strong>irréversible</strong>. Toutes tes données
          (profil, repas, historique) seront définitivement supprimées des
          serveurs Fueli.
        </div>
      )}

      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={pending}
      >
        {pending && confirmDelete
          ? "Suppression…"
          : confirmDelete
            ? "Confirmer la suppression"
            : "Supprimer mon compte"}
      </Button>

      {confirmDelete && !pending && (
        <button
          type="button"
          onClick={() => setConfirmDelete(false)}
          className="block w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          Annuler
        </button>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
