"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

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
    start(async () => {
      // RGPD : suppression du compte (cascade vers profiles via FK on delete cascade)
      // Note : la suppression d'un user nécessite la service_role key — sera implémentée
      // via une server action / edge function. Pour V1 : on déconnecte avec un message.
      setError(
        "Suppression définitive disponible bientôt. Contacte le support en attendant.",
      );
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
      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive"
        onClick={handleDelete}
        disabled={pending}
      >
        {confirmDelete
          ? "Confirmer la suppression définitive"
          : "Supprimer mon compte"}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
