import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string; error?: string; deleted?: string }>;
}) {
  const { reset, error, deleted } = await searchParams;
  const errorMessage =
    error === "invalid_reset_link"
      ? "Le lien de réinitialisation est invalide."
      : error === "expired_reset_link"
        ? "Le lien de réinitialisation a expiré. Demande-en un nouveau."
        : null;

  return (
    <div className="app-shell">
      <div
        className="app-column"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 24px",
          minHeight: "100svh",
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 900,
            letterSpacing: "-.06em",
            color: "#1A5CFF",
            marginBottom: 36,
          }}
        >
          fueli
        </div>

        {/* Titre */}
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: "#1A1A2E",
            }}
          >
            Connexion
          </h1>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#9595A8",
              marginTop: 6,
            }}
          >
            Heureux de te revoir.
          </p>
        </div>

        {/* Bandeaux d'info */}
        {reset === "ok" && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 14,
              background: "#ECFDF5",
              border: "1.5px solid rgba(5,150,105,.2)",
              fontSize: 13,
              fontWeight: 500,
              color: "#065F46",
            }}
          >
            ✓ Mot de passe mis à jour. Connecte-toi avec le nouveau.
          </div>
        )}
        {deleted === "ok" && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 14,
              background: "#F7F8FC",
              border: "1.5px solid #E8E8F0",
              fontSize: 13,
              fontWeight: 500,
              color: "#6B6B82",
            }}
          >
            Ton compte et toutes tes données ont été supprimés. À bientôt !
          </div>
        )}
        {errorMessage && (
          <div
            style={{
              marginBottom: 16,
              padding: "12px 16px",
              borderRadius: 14,
              background: "#FFF5F5",
              border: "1.5px solid rgba(220,38,38,.2)",
              fontSize: 13,
              fontWeight: 500,
              color: "#B91C1C",
            }}
          >
            {errorMessage}
          </div>
        )}

        <LoginForm />

        {/* Liens secondaires */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            marginTop: 24,
          }}
        >
          <Link
            href="/forgot-password"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "#1A5CFF",
              textDecoration: "none",
            }}
          >
            Mot de passe oublié ?
          </Link>
          <p style={{ fontSize: 14, fontWeight: 500, color: "#9595A8" }}>
            Pas encore de compte ?{" "}
            <Link
              href="/onboarding"
              style={{
                fontWeight: 700,
                color: "#1A5CFF",
                textDecoration: "none",
              }}
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
