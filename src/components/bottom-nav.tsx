"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, User } from "lucide-react";

const TABS = [
  { href: "/today",   label: "Aujourd'hui", icon: Home },
  { href: "/learn",   label: "Apprendre",   icon: BookOpen },
  { href: "/profile", label: "Profil",       icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 448,
        zIndex: 100,
        background: "rgba(255,255,255,.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid rgba(26,26,46,.06)",
      }}
    >
      <ul
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "6px 8px 10px",
          margin: 0,
          listStyle: "none",
        }}
      >
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          return (
            <li key={tab.href} style={{ flex: 1 }}>
              <Link
                href={tab.href}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 3,
                  textDecoration: "none",
                  padding: "6px 4px",
                  color: active ? "#1A5CFF" : "#9595A8",
                  transition: "color .15s",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 42,
                    height: 30,
                    borderRadius: 12,
                    background: active ? "#EEF3FF" : "transparent",
                    transition: "background .15s",
                  }}
                >
                  <Icon size={20} />
                </span>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".04em",
                    textTransform: "uppercase",
                  }}
                >
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
