"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function LandingNav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass-dark border-b border-primary/10">
      <div className="flex items-center gap-2.5">
        <div className="bg-gradient-to-br from-primary-light to-primary p-2 rounded-xl shadow-lg shadow-primary/30">
          <Icon name="graphic_eq" className="text-white" style={{ fontSize: 22 }} fill={1} />
        </div>
        <span
          className="text-lg font-bold tracking-tight"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          AI Music Mind
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/signin"
          className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
        >
          App
        </Link>
        <Link
          href="/signin"
          className="px-4 py-2 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-light transition-all shadow-lg shadow-primary/30"
        >
          Launch App →
        </Link>
      </div>
    </nav>
  );
}
