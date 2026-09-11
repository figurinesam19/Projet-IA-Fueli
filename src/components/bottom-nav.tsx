"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const TABS = [
  { href: "/today",   label: "Aujourd'hui", icon: Home },
  { href: "/learn",   label: "Apprendre",   icon: BookOpen },
  { href: "/profile", label: "Profil",       icon: User },
];

const NAV_ONLY_PATHS = ["/today", "/learn", "/profile"];

function useNavVisible() {
  const [visible, setVisible] = useState(true);
  const lastScrollY  = useRef(0);
  const lastTouchY   = useRef(0);
  const ticking      = useRef(false);

  useEffect(() => {
    // Lecture scroll + décision visible/caché
    const decide = () => {
      const y     = window.scrollY;
      const delta = y - lastScrollY.current;
      lastScrollY.current = y;

      // Toujours visible tout en haut
      if (y < 30) { setVisible(true); return; }
      // Descend (doigt vers le haut) → cache
      if (delta > 2)  setVisible(false);
      // Monte (doigt vers le bas) → affiche
      if (delta < -2) setVisible(true);
    };

    // Scroll (déclenché par l'inertie aussi sur desktop)
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => { decide(); ticking.current = false; });
    };

    // TouchMove : détection directe du geste sur mobile
    const onTouchStart = (e: TouchEvent) => {
      lastTouchY.current = e.touches[0].clientY;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const dy     = lastTouchY.current - touchY; // positif = doigt monte = scroll bas
      lastTouchY.current = touchY;

      const y = window.scrollY;
      if (y < 30) { setVisible(true); return; }
      if (dy > 3)  setVisible(false);
      if (dy < -3) setVisible(true);
    };

    window.addEventListener("scroll",     onScroll,     { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove",  onTouchMove,  { passive: true });

    return () => {
      window.removeEventListener("scroll",     onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove",  onTouchMove);
    };
  }, []);

  return visible;
}

export function BottomNav() {
  const pathname = usePathname();
  const visible  = useNavVisible();

  if (!NAV_ONLY_PATHS.includes(pathname)) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: "calc(12px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: visible
          ? "translateX(-50%) translateY(0) scale(1)"
          : "translateX(-50%) translateY(calc(100% + 24px)) scale(0.88)",
        opacity: visible ? 1 : 0,
        width: "calc(100% - 32px)",
        maxWidth: 416,
        zIndex: 100,
        background: "rgba(255,255,255,.97)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRadius: 28,
        boxShadow:
          "0 8px 32px rgba(26,26,46,.13), 0 2px 8px rgba(26,26,46,.06), 0 0 0 1px rgba(26,26,46,.04)",
        transition: "transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease",
        pointerEvents: visible ? "auto" : "none",
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
          const active = pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon   = tab.icon;
          return (
            <li key={tab.href} style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <Link
                href={tab.href}
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
                  transition: "background .2s ease, color .2s ease",
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
