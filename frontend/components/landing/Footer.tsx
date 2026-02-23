"use client";

import { Icon } from "@/components/ui/Icon";

export function Footer() {
  return (
    <footer className="px-6 py-10 border-t border-primary/10 text-center text-slate-500 text-sm">
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="bg-primary p-1.5 rounded-xl">
          <Icon name="graphic_eq" className="text-white" style={{ fontSize: 18 }} fill={1} />
        </div>
        <span
          className="font-bold text-white text-lg"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          AI Music Mind
        </span>
      </div>
      <p>© 2025 AI Music Mind · AI-powered music for everyone</p>
    </footer>
  );
}
