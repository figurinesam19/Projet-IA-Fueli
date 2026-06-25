import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeDailyTargets } from "@/lib/nutrition";
import { ProfileActions } from "./profile-actions";

function labelGoalShort(g: string | null | undefined) {
  if (g === "perte") return "Perte";
  if (g === "masse") return "Masse";
  if (g === "equilibre") return "Équilibre";
  return "—";
}

function memberSince(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user!.id)
    .single();

  const targets = computeDailyTargets(profile);
  const firstName = profile?.first_name ?? "";
  const lastName = profile?.last_name ?? "";
  const initial = firstName.charAt(0).toUpperCase() || "?";
  const memberDate = user?.created_at ? memberSince(user.created_at) : null;

  return (
    <main
      style={{
        maxWidth: 448,
        margin: "0 auto",
        padding: "0 18px 120px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}
    >
      {/* ===== HEADER ===== */}
      <div style={{ padding: "14px 2px 4px" }}>
        <h1
          style={{
            fontSize: 26,
            fontWeight: 800,
            letterSpacing: "-.03em",
            color: "#1A1A2E",
          }}
        >
          Profil
        </h1>
      </div>

      {/* ===== AVATAR CARD ===== */}
      <div
        className="animate-fade-up"
        style={{
          background: "#fff",
          borderRadius: 24,
          padding: "20px 18px 20px",
          boxShadow:
            "0 12px 30px rgba(26,26,46,.07),0 1px 3px rgba(26,26,46,.04)",
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Avatar gradient */}
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 20,
            background: "linear-gradient(135deg,#84A9FF,#1A5CFF)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: "-.02em",
            boxShadow: "0 8px 18px rgba(26,92,255,.35)",
            flexShrink: 0,
          }}
        >
          {initial}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <p
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: "-.02em",
                color: "#1A1A2E",
              }}
            >
              {firstName} {lastName}
            </p>
            {/* Streak badge — visuel statique V1 */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                background: "#FFF3EC",
                borderRadius: 999,
                padding: "3px 9px",
                fontSize: 11,
                fontWeight: 700,
                color: "#E5550A",
                flexShrink: 0,
              }}
            >
              🔥 7 jours
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: "#9595A8",
              marginTop: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {user!.email}
          </p>
          {memberDate && (
            <p
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#C4C4D1",
                marginTop: 3,
              }}
            >
              Membre depuis {memberDate}
            </p>
          )}
        </div>

        {/* Bouton modifier */}
        <Link
          href="/profile/edit"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 38,
            height: 38,
            borderRadius: 13,
            background: "#F7F8FC",
            color: "#6B6B82",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          <Pencil size={16} />
        </Link>
      </div>

      {/* ===== 3 STAT CARDS ===== */}
      <div
        className="animate-fade-up-1"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}
      >
        <StatCard
          label="Objectif"
          value={targets?.kcal != null ? String(targets.kcal) : "—"}
          unit="kcal / jour"
          valueFontSize={18}
        />
        <StatCard
          label="Poids"
          value={profile?.weight_kg != null ? String(profile.weight_kg) : "—"}
          unit="kg actuel"
          valueFontSize={18}
        />
        <StatCard
          label="But"
          value={labelGoalShort(profile?.goal)}
          unit="objectif"
          valueFontSize={14}
        />
      </div>

      {/* ===== MENU PARAMÈTRES ===== */}
      <div
        className="animate-fade-up-2"
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 6px 16px rgba(26,26,46,.05)",
          overflow: "hidden",
        }}
      >
        <MenuItem
          href="/profile/edit"
          emoji="✏️"
          tint="#EEF3FF"
          label="Modifier mon profil"
          border
        />
        <MenuItem
          href="/profile/edit"
          emoji="🎯"
          tint="#FFF3EC"
          label="Modifier mon objectif"
          border
        />
        <MenuItem
          href="#"
          emoji="🔔"
          tint="#F1ECFF"
          label="Notifications"
          border
        />
        <MenuItem
          href="mailto:support@fueli.app"
          emoji="💬"
          tint="#ECFDF5"
          label="Aide & contact"
        />
      </div>

      {/* ===== LÉGAL ===== */}
      <div
        className="animate-fade-up-3"
        style={{
          background: "#fff",
          borderRadius: 20,
          boxShadow: "0 6px 16px rgba(26,26,46,.05)",
          overflow: "hidden",
        }}
      >
        <Link
          href="/legal/terms"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            textDecoration: "none",
            borderBottom: "1px solid #F7F8FC",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#3A3A52" }}>
            CGU
          </span>
          <ChevronRight size={18} color="#C4C4D1" />
        </Link>
        <Link
          href="/legal/privacy"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 16px",
            textDecoration: "none",
          }}
        >
          <span style={{ fontSize: 14, fontWeight: 600, color: "#3A3A52" }}>
            Politique de confidentialité
          </span>
          <ChevronRight size={18} color="#C4C4D1" />
        </Link>
      </div>

      {/* ===== ACTIONS (déconnexion / suppression) ===== */}
      <div className="animate-fade-up-4">
        <ProfileActions />
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  unit,
  valueFontSize,
}: {
  label: string;
  value: string;
  unit: string;
  valueFontSize: number;
}) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: "14px 12px 12px",
        boxShadow: "0 6px 16px rgba(26,26,46,.05)",
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <p
        style={{
          fontSize: 10,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: ".04em",
          color: "#9595A8",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontSize: valueFontSize,
          fontWeight: 800,
          letterSpacing: "-.02em",
          color: "#1A1A2E",
          fontVariantNumeric: "tabular-nums",
          lineHeight: 1.1,
          marginTop: 2,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: 10, fontWeight: 600, color: "#C4C4D1" }}>{unit}</p>
    </div>
  );
}

function MenuItem({
  href,
  emoji,
  tint,
  label,
  border = false,
}: {
  href: string;
  emoji: string;
  tint: string;
  label: string;
  border?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        textDecoration: "none",
        borderBottom: border ? "1px solid #F7F8FC" : "none",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 13,
          background: tint,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 19,
          flexShrink: 0,
        }}
      >
        {emoji}
      </div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#1A1A2E" }}>
        {label}
      </span>
      <ChevronRight size={18} color="#C4C4D1" />
    </Link>
  );
}
