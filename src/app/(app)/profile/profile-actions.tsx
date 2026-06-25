"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
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
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Bouton déconnexion */}
      <button
        onClick={handleLogout}
        disabled={pending}
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: 16,
          border: "1.5px solid #E8E8F0",
          background: "#fff",
          fontSize: 14,
          fontWeight: 700,
          color: "#1A1A2E",
          fontFamily: "inherit",
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.6 : 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          boxShadow: "0 4px 12px rgba(26,26,46,.05)",
        }}
      >
        <LogOut size={16} color="#9595A8" />
        Se déconnecter
      </button>

      {/* Avertissement avant suppression */}
      {confirmDelete && (
        <div
          style={{
            background: "#FFF5F5",
            border: "1.5px solid rgba(220,38,38,.2)",
            borderRadius: 14,
            padding: "12px 14px",
            fontSize: 13,
            fontWeight: 500,
            color: "#B91C1C",
            lineHeight: 1.55,
          }}
        >
          Cette action est <strong>irréversible</strong>. Toutes tes données
          (profil, repas, historique) seront définitivement supprimées des
          serveurs Fueli.
        </div>
      )}

      {/* Bouton suppression compte */}
      <button
        onClick={handleDelete}
        disabled={pending}
        style={{
          width: "100%",
          padding: "13px",
          borderRadius: 16,
          border: "none",
          background: "transparent",
          fontSize: 13,
          fontWeight: 700,
          color: "#DC2626",
          fontFamily: "inherit",
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.6 : 1,
        }}
      >
        {pending && confirmDelete
          ? "Suppression…"
          : confirmDelete
            ? "Confirmer la suppression"
            : "Supprimer mon compte"}
      </button>

      {confirmDelete && !pending && (
        <button
          type="button"
          onClick={() => setConfirmDelete(false)}
          style={{
            background: "none",
            border: "none",
            fontSize: 12,
            fontWeight: 500,
            color: "#9595A8",
            cursor: "pointer",
            fontFamily: "inherit",
            padding: "4px",
            textAlign: "center",
          }}
        >
          Annuler
        </button>
      )}

      {error && (
        <p style={{ fontSize: 12, color: "#DC2626", textAlign: "center" }}>
          {error}
        </p>
      )}
    </div>
  );
}
