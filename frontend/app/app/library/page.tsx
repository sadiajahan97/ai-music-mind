"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const TRACKS = [
  { title: "Neon Dreams", meta: "Synthwave · 120 BPM · 30s", tag: "POP", tagColor: "bg-primary/20 text-primary", time: "2 hours ago", gradient: "from-purple-600 to-pink-500", icon: "music_note" },
  { title: "Midnight Jazz", meta: "Jazz · 90 BPM · 30s", tag: "JAZZ", tagColor: "bg-blue-500/20 text-blue-400", time: "Yesterday", gradient: "from-blue-600 to-cyan-500", icon: "piano" },
  { title: "Cyberpunk Beats", meta: "EDM · 150 BPM · 30s", tag: "EDM", tagColor: "bg-green-500/20 text-green-400", time: "2 days ago", gradient: "from-green-600 to-teal-500", icon: "electric_bolt" },
  { title: "Summer Vibes", meta: "Pop · 128 BPM · 30s", tag: "POP", tagColor: "bg-orange-500/20 text-orange-400", time: "3 days ago", gradient: "from-orange-500 to-red-500", icon: "campaign" },
  { title: "Tokyo Rain Lo-fi", meta: "Lo-fi · 75 BPM · 30s", tag: "LO-FI", tagColor: "bg-primary/20 text-primary", time: "1 week ago", gradient: "from-primary/60 to-purple-800", icon: "mood" },
];

export default function LibraryPage() {
  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10 px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            My Creations
          </h1>
          <button className="size-9 rounded-full bg-primary/20 flex items-center justify-center text-primary">
            <Icon name="search" style={{ fontSize: 20 }} />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scroll-hide">
          <button className="shrink-0 px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold">
            All
          </button>
          <button className="shrink-0 px-4 py-1.5 rounded-full glass text-slate-400 text-xs hover:border-primary/30">
            Recent
          </button>
          <button className="shrink-0 px-4 py-1.5 rounded-full glass text-slate-400 text-xs hover:border-primary/30">
            Favorites
          </button>
          <button className="shrink-0 px-4 py-1.5 rounded-full glass text-slate-400 text-xs hover:border-primary/30">
            Playlists
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-24 px-4 py-4 space-y-3">
        {TRACKS.map((t) => (
          <div
            key={t.title}
            className="glass-card p-4 rounded-2xl flex items-center gap-4"
          >
            <div
              className={`w-14 h-14 rounded-xl bg-gradient-to-br ${t.gradient} flex items-center justify-center shrink-0`}
            >
              <Icon name={t.icon} className="text-white" style={{ fontSize: 26 }} fill={1} />
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="font-bold text-base truncate"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                {t.title}
              </h3>
              <p className="text-xs text-slate-400">{t.meta}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${t.tagColor}`}
                >
                  {t.tag}
                </span>
                <span className="text-[10px] text-slate-500">{t.time}</span>
              </div>
            </div>
            <Link
              href="/app/player"
              className="size-11 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30"
            >
              <Icon name="play_arrow" fill={1} style={{ fontSize: 22 }} />
            </Link>
          </div>
        ))}
        <div className="glass-card p-6 rounded-2xl text-center mt-4">
          <Icon name="library_add" className="text-primary mb-3 block" style={{ fontSize: 36 }} />
          <h4
            className="font-bold mb-2"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Ready for more?
          </h4>
          <p className="text-slate-400 text-sm mb-4">
            Create another track and build your music library.
          </p>
          <Link
            href="/app/create"
            className="px-6 py-2.5 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-all text-sm inline-block"
          >
            Create New Track
          </Link>
        </div>
      </main>
    </div>
  );
}
