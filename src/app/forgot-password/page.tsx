import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { ForgotForm } from "./forgot-form";

export default function ForgotPasswordPage() {
  return (
    <div className="app-shell">
      <div
        className="app-column"
        style={{
          background: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "48px 24px",
          minHeight: "100svh",
        }}
      >
        {/* Lien retour discret en haut */}
        <Link
          href="/login"
          style={{
            position: "absolute",
            top: "calc(20px + env(safe-area-inset-top, 0px))",
            left: 20,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: 14,
            background: "#F7F8FC",
            color: "#6B6B82",
            textDecoration: "none",
          }}
          aria-label="Retour à la connexion"
        >
          <ArrowLeft size={19} />
        </Link>

        {/* Illustration : clé dans un cercle dégradé + halo */}
        <div
          className="animate-fade-up"
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <div
            style={{
              position: "relative",
              width: 96,
              height: 96,
              borderRadius: 30,
              background: "linear-gradient(135deg,#84A9FF,#1A5CFF)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 16px 36px -8px rgba(26,92,255,.55)",
            }}
          >
            <KeyRound size={40} color="#fff" strokeWidth={2.2} />
          </div>
        </div>

        {/* Wordmark */}
        <div
          className="animate-fade-up-1"
          style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-.06em",
            color: "#1A5CFF",
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          fueli
        </div>

        {/* Titre */}
        <div
          className="animate-fade-up-2"
          style={{ marginBottom: 28, textAlign: "center" }}
        >
          <h1
            style={{
              fontSize: 26,
              fontWeight: 800,
              letterSpacing: "-.03em",
              color: "#1A1A2E",
            }}
          >
            Mot de passe oublié ?
          </h1>
          <p
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "#9595A8",
              marginTop: 8,
              lineHeight: 1.5,
              maxWidth: 300,
              marginInline: "auto",
            }}
          >
            Pas de panique. Entre ton adresse et on t&apos;envoie un lien pour en
            choisir un nouveau.
          </p>
        </div>

        <div className="animate-fade-up-3">
          <ForgotForm />
        </div>
      </div>
    </div>
  );
}
