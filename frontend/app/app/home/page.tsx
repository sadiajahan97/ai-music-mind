"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WaveBar } from "@/components/ui/WaveBar";

export default function AppHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 glass-dark border-b border-primary/10">
        <div className="flex items-center gap-2.5">
          <div className="bg-linear-to-br from-primary-light to-primary p-1.5 rounded-xl">
            <Icon
              name="graphic_eq"
              className="text-white font-bold"
              style={{ fontSize: 20 }}
              fill={1}
            />
          </div>
          <h2
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            AI Music Mind
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="bg-primary/20 text-primary text-[10px] font-bold px-2.5 py-1 rounded-full border border-primary/30 tracking-widest"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            PRO
          </span>
          <Link
            href="/app/profile"
            className="w-8 h-8 rounded-full bg-linear-to-tr from-primary/40 to-purple-500/40 border border-primary/30 flex items-center justify-center"
          >
            <Icon
              name="person"
              className="text-primary"
              style={{ fontSize: 18 }}
            />
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-24">
        <section className="relative px-5 pt-10 pb-8 hero-grad overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-64 bg-primary/25 blur-[100px] rounded-full pointer-events-none" />
          <div className="relative z-10 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/25 text-primary text-xs font-bold">
              <Icon name="auto_awesome" style={{ fontSize: 13 }} />
              Next-Gen Audio Engine v2.0
            </div>
            <h1
              className="text-4xl font-extrabold leading-[1.08] tracking-tight"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              From{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-light to-primary">
                Thought
              </span>{" "}
              to{" "}
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-pink-400">
                Track
              </span>{" "}
              in 30 Seconds.
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
              Create studio-ready, social-optimized music clips with the power
              of generative AI.
            </p>
            <div className="pt-2">
              <Link
                href="/app/create"
                className="w-full bg-linear-to-r from-primary to-primary-light hover:opacity-90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                <Icon name="auto_awesome" />
                Start Creating
                <Icon name="arrow_forward" />
              </Link>
              <p className="text-[10px] text-slate-500 mt-3 uppercase tracking-[0.2em] font-medium">
                No Credit Card Required
              </p>
            </div>
          </div>
        </section>

        <section className="px-5 py-5">
          <div className="grid grid-cols-4 gap-3">
            {[
              { href: "/app/create", icon: "add_circle", label: "Create" },
              { href: "/app/lyrics", icon: "lyrics", label: "Lyrics" },
              { href: "/app/voice", icon: "mic", label: "Voice" },
              { href: "/app/instruments", icon: "tune", label: "Mix" },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 p-3 glass-card rounded-xl hover:border-primary/30 transition-all"
              >
                <Icon
                  name={item.icon}
                  className="text-primary"
                  style={{ fontSize: 22 }}
                />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="px-5 py-4 space-y-5">
          <div className="flex items-center gap-3">
            <h3
              className="text-base font-bold"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              How it works
            </h3>
            <div className="h-px flex-1 bg-primary/10" />
          </div>
          <div className="space-y-3">
            {[
              {
                icon: "edit_note",
                title: "Prompt",
                desc: "Describe your vibe, mood, or genre in plain text.",
              },
              {
                icon: "memory",
                title: "Generate",
                desc: "AI crafts a studio-quality track in under 20 seconds.",
                border: true,
              },
              {
                icon: "ios_share",
                title: "Share",
                desc: "Export high-fidelity audio directly to any platform.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className={`glass-card p-4 rounded-xl flex gap-4 items-center ${
                  item.border ? "border-l-2 border-l-primary" : ""
                }`}
              >
                <div className="size-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Icon name={item.icon} style={{ fontSize: 20 }} />
                </div>
                <div>
                  <h4
                    className="font-bold text-sm"
                    style={{
                      fontFamily: "var(--font-display), Syne, sans-serif",
                    }}
                  >
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="px-5 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <h3
              className="text-base font-bold"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Featured Track
            </h3>
            <div className="h-px flex-1 bg-primary/10" />
          </div>
          <div className="rounded-2xl overflow-hidden relative">
            <div className="aspect-video bg-linear-to-br from-purple-900 via-primary/30 to-black flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center gap-1.5">
                {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((d) => (
                  <WaveBar key={d} height={40 + d * 50} delay={d} />
                ))}
              </div>
            </div>
            <div className="absolute inset-0 bg-linear-to-t from-bg-deep via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
              <div>
                <p
                  className="text-[10px] uppercase font-bold text-primary tracking-widest"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  Featured Gen
                </p>
                <p
                  className="font-bold text-sm"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  &quot;Midnight Neon Synthwave&quot;
                </p>
              </div>
              <Link
                href="/app/player"
                className="size-11 rounded-full bg-white text-bg-deep flex items-center justify-center shadow-xl"
              >
                <Icon name="play_arrow" fill={1} style={{ fontSize: 24 }} />
              </Link>
            </div>
          </div>
          <div className="mt-5 flex items-center justify-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-7 rounded-full border-2 border-bg-dark bg-linear-to-tr from-purple-500 to-pink-500"
                />
              ))}
            </div>
            <p className="text-xs text-slate-500">
              Join <strong className="text-white">10,000+</strong> creators
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
