"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const navItems = [
  { href: "/app/home", label: "Home", icon: "home" },
  { href: "/app/discover", label: "Explore", icon: "explore" },
  { href: "/app/create", label: "Create", icon: "add", isFab: true },
  { href: "/app/library", label: "Library", icon: "library_music" },
  { href: "/app/profile", label: "Profile", icon: "person" },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[393px] h-[70px] flex items-stretch bg-[rgba(22,14,29,0.97)] backdrop-blur-xl border-t border-[rgba(146,19,236,0.18)] z-100 overflow-visible"
      style={{ maxWidth: "100vw" }}
    >
      {navItems.map((item) => {
        if (item.isFab) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center relative border-none bg-transparent cursor-pointer pt-5 pb-1"
            >
              <div
                className="absolute -top-5 w-14 h-14 rounded-full bg-linear-to-br from-primary-light to-primary flex items-center justify-center text-white transition-transform hover:scale-105 shadow-lg"
                style={{
                  boxShadow:
                    "0 0 0 5px rgba(22,14,29,0.97), 0 6px 24px rgba(146,19,236,0.55)",
                }}
              >
                <Icon name="add" style={{ fontSize: 26 }} />
              </div>
              <span
                className="text-[9px] font-bold text-primary uppercase tracking-[0.07em] mt-0.5"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                {item.label}
              </span>
            </Link>
          );
        }
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer text-[9px] font-bold uppercase tracking-[0.07em] border-none bg-transparent pb-1 transition-colors ${
              isActive ? "text-primary" : "text-[#4b5563] hover:text-primary"
            }`}
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            <Icon
              name={item.icon}
              style={{ fontSize: 22 }}
              className={isActive ? "scale-110" : ""}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
