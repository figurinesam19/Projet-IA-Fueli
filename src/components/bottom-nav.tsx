"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/today", label: "Aujourd'hui", icon: Home },
  { href: "/learn", label: "Apprendre", icon: BookOpen },
  { href: "/profile", label: "Profil", icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="sticky bottom-0 z-10 border-t border-border bg-card/80 backdrop-blur-md">
      <ul className="mx-auto flex w-full max-w-md items-center justify-around px-2 py-1">
        {TABS.map((tab) => {
          const active =
            pathname === tab.href || pathname.startsWith(`${tab.href}/`);
          const Icon = tab.icon;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-semibold uppercase tracking-widest transition-all duration-200 active:scale-[0.92]",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-xl p-1.5 transition-all duration-200",
                    active ? "bg-primary/12 scale-110" : "scale-100",
                  )}
                >
                  <Icon className="size-5" />
                </span>
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
