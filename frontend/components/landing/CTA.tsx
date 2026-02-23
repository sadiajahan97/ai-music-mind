"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function CTA() {
  return (
    <section className="px-6 py-24 text-center relative overflow-hidden">
      <div className="absolute inset-0 hero-grad" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
      <div className="relative z-10 max-w-xl mx-auto">
        <h2
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          Ready to create your first track?
        </h2>
        <p className="text-slate-400 text-lg mb-10">
          No credit card. No music degree. Just your idea.
        </p>
        <Link
          href="/signin"
          className="inline-flex items-center gap-3 px-10 py-5 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-2xl shadow-2xl shadow-primary/50 text-lg hover:scale-105 active:scale-95 transition-all anim-pulse"
        >
          <Icon name="music_note" />
          Start Creating Now
          <Icon name="arrow_forward" />
        </Link>
        <p className="text-xs text-slate-500 mt-6 uppercase tracking-[0.2em]">
          Free forever · No Credit Card
        </p>
      </div>
    </section>
  );
}
