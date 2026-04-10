"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Tv, Film, Calendar, Search } from "lucide-react";
import { cn } from "@/lib/utils";

const MOBILE_NAV = [
  { href: "/", label: "Beranda", icon: Home },
  { href: "/ongoing", label: "Ongoing", icon: Tv },
  { href: "/movie", label: "Movie", icon: Film },
  { href: "/schedule", label: "Jadwal", icon: Calendar },
  { href: "/search", label: "Cari", icon: Search },
] as const;

export default function MobileNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[var(--bg-glass)] backdrop-blur-xl border-t border-[var(--border-default)]">
      <div className="flex items-center justify-around py-2 px-2 max-w-lg mx-auto">
        {MOBILE_NAV.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]",
                active
                  ? "text-cyan-400"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              )}
            >
              <div className="relative">
                <Icon
                  className={cn(
                    "w-5 h-5 transition-transform",
                    active && "scale-110"
                  )}
                />
                {active && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-cyan-400" />
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Safe area for iPhones */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}
