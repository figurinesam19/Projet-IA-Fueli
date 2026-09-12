"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Home, User } from "lucide-react";

const TABS = [
  { href: "/today",   label: "Aujourd'hui", icon: Home },
  { href: "/learn",   label: "Apprendre",   icon: BookOpen },
  { href: "/profile", label: "Profil",       icon: User },
];

const NAV_ONLY_PATHS = ["/today", "/learn", "/profile"];

export function BottomNav() {
  const pathname = usePathname();
  // Onglet cible cliqué : surligné immédiatement au tap, sans attendre que la
  // navigation serveur se termine. Évite l'impression de latence.
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Dès que la navigation aboutit (pathname rattrape), on efface l'optimisme.
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  if (!NAV_ONLY_PATHS.includes(pathname)) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 32px)",
        maxWidth: 416,
        zIndex: 100,
        background: "rgba(255,255,255,.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 28,
        boxShadow:
          "0 8px 32px rgba(26,26,46,.13), 0 2px 8px rgba(26,26,46,.06), 0 0 0 1px rgba(26,26,46,.04)",
      }}
    >
      <ul
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "8px 6px",
          margin: 0,
          listStyle: "none",
        }}
      >
        {TABS.map((tab) => {
          const currentActive =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          // Si un onglet a été tapé, c'est lui qui est visuellement actif en
          // priorité (feedback optimiste) ; sinon on suit le pathname réel.
          const active = pendingHref
            ? pendingHref === tab.href
            : currentActive;
          const Icon = tab.icon;
          return (
            <li key={tab.href} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Link
                href={tab.href}
                prefetch
                onClick={() => setPendingHref(tab.href)}
                style={{
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  textDecoration: "none",
                  padding: "7px 18px",
                  borderRadius: 18,
                  background: active ? "#EEF3FF" : "transparent",
                  color: active ? "#1A5CFF" : "#9595A8",
                  transition: "background .12s ease, color .12s ease",
                }}
              >
                <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".025em" }}>
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
