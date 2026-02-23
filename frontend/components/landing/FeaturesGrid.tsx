"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const features = [
  {
    title: "Theme-Based Generation",
    desc: "Describe your vibe in plain language. AI handles genre, mood, tempo, and instrumentation.",
    icon: "edit_note",
    href: "/app/create",
    cta: "Try it",
  },
  {
    title: "Voice Style Studio",
    desc: "Choose from singing, rap, whisper, choir styles. Pro users get voice cloning with consent.",
    icon: "mic",
    href: "/app/voice",
    cta: "Explore voices",
  },
  {
    title: "AI Music Assistant",
    desc: 'Chat with AI to refine your tracks. "Make the chorus more powerful." — it just works.',
    icon: "smart_toy",
    href: "/app/assistant",
    cta: "Chat now",
  },
  {
    title: "Instrument Control",
    desc: "Fine-tune drums, bass, reverb, and acoustic/electronic balance with intuitive sliders.",
    icon: "tune",
    href: "/app/instruments",
    cta: "Open studio",
  },
  {
    title: "Lyrics Studio",
    desc: "AI-generated verse, chorus, bridge with rhyme scheme control. Edit line-by-line.",
    icon: "lyrics",
    href: "/app/lyrics",
    cta: "Write lyrics",
  },
  {
    title: "Discover & Trends",
    desc: "Explore trending AI tracks. Like, remix, and share community creations to any social platform.",
    icon: "trending_up",
    href: "/app/discover",
    cta: "Explore",
  },
];

export function FeaturesGrid() {
  return (
    <section className="px-6 py-24 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/20 text-primary text-xs font-bold mb-4 tracking-wider">
          FEATURES
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          Everything you need to create
        </h2>
        <p className="text-slate-400 mt-3 max-w-md mx-auto">
          Professional-grade tools wrapped in a beautifully simple interface.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f) => (
          <Link
            key={f.title}
            href={f.href}
            className="glass-card p-6 rounded-2xl hover:border-primary/30 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mb-4 group-hover:bg-primary/30 transition-colors">
              <Icon name={f.icon} style={{ fontSize: 24 }} />
            </div>
            <h3
              className="font-bold text-base mb-2"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              {f.title}
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            <div className="mt-4 text-primary text-xs font-bold flex items-center gap-1">
              {f.cta} <Icon name="arrow_forward" style={{ fontSize: 14 }} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
