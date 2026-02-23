"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WaveBar } from "@/components/ui/WaveBar";

const TRENDING = [
  {
    rank: 2,
    title: "Glitch in the Matrix",
    meta: "@techno_ghost · EDM · 1.8k plays",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    rank: 3,
    title: "Sacred Frequencies",
    meta: "@soul_wave · Gospel · 1.2k plays",
    gradient: "from-orange-500 to-red-600",
  },
  {
    rank: 4,
    title: "Tokyo Rain Lo-fi",
    meta: "@lofi_labs · Lo-fi · 987 plays",
    gradient: "from-green-600 to-teal-500",
  },
];

export default function DiscoverPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10">
        <div className="flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="bg-linear-to-br from-primary-light to-primary p-1.5 rounded-xl">
              <Icon
                name="graphic_eq"
                className="text-white"
                style={{ fontSize: 18 }}
                fill={1}
              />
            </div>
            <h1
              className="text-lg font-bold"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Discover
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
              <Icon name="search" style={{ fontSize: 20 }} />
            </button>
            <button className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center relative">
              <Icon name="notifications" style={{ fontSize: 20 }} />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
        <div className="flex px-5 border-b border-primary/10">
          <button
            className="pb-3 border-b-2 border-primary text-primary font-bold text-sm mr-5"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Trending
          </button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm mr-5 hover:text-slate-300">
            Following
          </button>
          <button className="pb-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-300">
            Genres
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-24">
        <div
          className="relative overflow-hidden"
          style={{
            height: 280,
            background: "linear-gradient(135deg,#1a0533,#3b0d6d,#0a0612)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-40">
            {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7].map((d) => (
              <WaveBar key={d} height={60 + d * 80} delay={d} />
            ))}
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-bg-deep via-transparent to-transparent" />
          <div className="absolute bottom-4 left-0 right-0 px-5">
            <div className="flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="px-2 py-0.5 rounded-full bg-primary/30 text-primary text-[10px] font-bold border border-primary/40"
                    style={{
                      fontFamily: "var(--font-display), Syne, sans-serif",
                    }}
                  >
                    #1 TRENDING
                  </span>
                </div>
                <h3
                  className="text-2xl font-bold leading-tight"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  Neon Dreams
                </h3>
                <p className="text-slate-300 text-sm mt-0.5">
                  @aurora_creates · Synthwave · 2.4k plays
                </p>
              </div>
              <div className="flex flex-col gap-3 items-center">
                <button className="size-12 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 hover:bg-primary/40">
                  <Icon name="favorite" style={{ fontSize: 22 }} />
                </button>
                <Link
                  href="/app/player"
                  className="size-14 rounded-full bg-primary flex items-center justify-center shadow-xl shadow-primary/50 hover:scale-110 transition-transform"
                >
                  <Icon
                    name="play_arrow"
                    className="text-white"
                    style={{ fontSize: 28 }}
                    fill={1}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-4 space-y-3">
          <h3
            className="font-bold text-sm uppercase tracking-wider text-slate-400"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            More Trending
          </h3>
          <div className="space-y-3">
            {TRENDING.map((t) => (
              <div
                key={t.rank}
                className="glass-card p-3.5 rounded-2xl flex items-center gap-3"
              >
                <span
                  className="text-slate-500 font-bold text-sm w-5"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  #{t.rank}
                </span>
                <div
                  className={`w-12 h-12 rounded-xl bg-linear-to-br ${t.gradient} shrink-0`}
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="font-bold text-sm truncate"
                    style={{
                      fontFamily: "var(--font-display), Syne, sans-serif",
                    }}
                  >
                    {t.title}
                  </p>
                  <p className="text-xs text-slate-400">{t.meta}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Icon
                    name="favorite_border"
                    className="text-slate-400"
                    style={{ fontSize: 18 }}
                  />
                  <Link
                    href="/app/player"
                    className="size-9 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
                  >
                    <Icon
                      name="play_arrow"
                      className="text-primary"
                      style={{ fontSize: 18 }}
                      fill={1}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
