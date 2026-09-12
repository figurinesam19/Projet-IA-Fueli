import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import { NotificationsClient } from "./notifications-client";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const canTest = isAdminEmail(user?.email);

  return (
    <main
      className="page-bottom"
      style={{
        maxWidth: 448,
        margin: "0 auto",
        padding: "0 18px",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0 4px" }}>
        <Link
          href="/profile"
          style={{
            width: 40,
            height: 40,
            borderRadius: 14,
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 8px rgba(26,26,46,.08)",
            color: "#6B6B82",
            flexShrink: 0,
            textDecoration: "none",
          }}
          aria-label="Retour au profil"
        >
          <ArrowLeft size={18} />
        </Link>
        <h1 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.02em", color: "#1A1A2E" }}>
          Notifications
        </h1>
      </div>

      <NotificationsClient canTest={canTest} />
    </main>
  );
}
