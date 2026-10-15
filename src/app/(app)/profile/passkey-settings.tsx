"use client";

import { useCallback, useEffect, useState } from "react";
import { ScanFace, Trash2, Loader2, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Passkey = {
  id: string;
  friendly_name?: string | null;
  created_at: string;
  last_used_at?: string | null;
};

// L'API passkey de Supabase est encore expérimentale et pas toujours typée
// dans le client. On passe par ce type minimal pour éviter les `any` diffus.
type PasskeyAuth = {
  registerPasskey: () => Promise<{ error: { message: string } | null }>;
  passkey: {
    list: () => Promise<{ data: Passkey[] | null; error: { message: string } | null }>;
    delete: (args: { passkeyId: string }) => Promise<{ error: { message: string } | null }>;
  };
};

function getPasskeyAuth() {
  return createClient().auth as unknown as PasskeyAuth;
}

export function PasskeySettings() {
  const [supported, setSupported] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    const { data, error } = await getPasskeyAuth().passkey.list();
    if (error) {
      setError(error.message);
    } else {
      setPasskeys(data ?? []);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const ok =
      typeof window !== "undefined" &&
      typeof window.PublicKeyCredential !== "undefined";
    setSupported(ok);
    if (ok) {
      refresh();
    } else {
      setLoading(false);
    }
  }, [refresh]);

  async function handleRegister() {
    setError(null);
    setBusy(true);
    try {
      const { error } = await getPasskeyAuth().registerPasskey();
      if (error) {
        setError(error.message);
      } else {
        await refresh();
      }
    } catch {
      // L'utilisateur a annulé la demande Face ID / Touch ID : silencieux.
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(passkeyId: string) {
    setError(null);
    setBusy(true);
    const { error } = await getPasskeyAuth().passkey.delete({ passkeyId });
    if (error) setError(error.message);
    else await refresh();
    setBusy(false);
  }

  // Appareil / navigateur sans WebAuthn : on n'affiche rien plutôt qu'une carte morte.
  if (!supported) return null;

  return (
    <div
      className="animate-fade-up-2"
      style={{
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 6px 16px rgba(26,26,46,.05)",
        padding: "16px 16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: "#EEF3FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <ScanFace size={18} color="#1A5CFF" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#1A1A2E", letterSpacing: "-.01em" }}>
            Connexion par Face ID
          </p>
          <p style={{ fontSize: 12, fontWeight: 500, color: "#9595A8", marginTop: 1 }}>
            Connecte-toi sans mot de passe, avec ton visage ou ton empreinte.
          </p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "6px 0" }}>
          <Loader2 size={18} color="#C4C4D1" style={{ animation: "spin 1s linear infinite" }} />
        </div>
      ) : (
        <>
          {passkeys.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {passkeys.map((pk) => (
                <div
                  key={pk.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: "#F7F8FC",
                    borderRadius: 12,
                    padding: "10px 12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1A1A2E", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {pk.friendly_name || "Passkey"}
                    </p>
                    <p style={{ fontSize: 11, fontWeight: 500, color: "#9595A8", marginTop: 1 }}>
                      Ajouté le {new Date(pk.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(pk.id)}
                    disabled={busy}
                    aria-label="Supprimer ce passkey"
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 10,
                      border: "none",
                      background: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: busy ? "not-allowed" : "pointer",
                      flexShrink: 0,
                      boxShadow: "0 2px 6px rgba(26,26,46,.06)",
                    }}
                  >
                    <Trash2 size={15} color="#DC2626" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={handleRegister}
            disabled={busy}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: 14,
              border: passkeys.length > 0 ? "1.5px solid #E8E8F0" : "none",
              background: passkeys.length > 0
                ? "#fff"
                : "linear-gradient(135deg,#84A9FF,#1A5CFF)",
              color: passkeys.length > 0 ? "#1A5CFF" : "#fff",
              fontSize: 14,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: busy ? "not-allowed" : "pointer",
              opacity: busy ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {busy ? (
              <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            ) : (
              <Plus size={16} />
            )}
            {passkeys.length > 0 ? "Ajouter un autre appareil" : "Activer Face ID"}
          </button>
        </>
      )}

      {error && (
        <p style={{ fontSize: 12, fontWeight: 500, color: "#DC2626" }}>{error}</p>
      )}
    </div>
  );
}
