"use client";

import { Camera } from "lucide-react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";

export function ScanFab() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  // createPortal → rendu direct dans document.body, aucun parent ne peut
  // créer un containing block et casser le position:fixed
  return createPortal(
    <div
      style={{
        position: "fixed",
        bottom: 72,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
      }}
    >
      <Link
        href="/scan"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "15px 28px",
          borderRadius: 999,
          background: "linear-gradient(135deg,#FF8540,#FF6B1A)",
          color: "#fff",
          fontSize: 15,
          fontWeight: 800,
          letterSpacing: "-.01em",
          boxShadow: "0 12px 26px -4px rgba(255,107,26,.5)",
          textDecoration: "none",
          animation: "fueliBob 3s ease-in-out infinite",
          whiteSpace: "nowrap",
        }}
      >
        <Camera size={22} />
        Scanner un plat
      </Link>
    </div>,
    document.body,
  );
}
