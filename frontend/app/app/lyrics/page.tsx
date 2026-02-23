"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const RHYMES = ["ABAB", "AABB", "ABBA", "Free"];

export default function LyricsPage() {
  const [rhyme, setRhyme] = useState("ABAB");
  const [verse1] = useState([
    "In the city lights that never sleep",
    "I find your face in every dream",
    "The bass drops low, the synths ignite",
    "We dance until the morning light",
  ]);
  const [chorus] = useState([
    "We are electric, burning bright",
    "Two neon souls in the neon night",
    "Don't let the darkness fade the flame",
  ]);
  const [verse2] = useState([
    "The crowd fades out, it's just us two",
    "Beneath the stars of violet hue",
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <Link
          href="/app/player"
          className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          Lyrics Studio
        </h1>
        <div className="flex gap-1.5">
          <button className="px-2.5 py-1 text-[10px] font-bold rounded bg-primary text-white">
            EN
          </button>
          <button className="px-2.5 py-1 text-[10px] font-bold text-slate-400 glass rounded">
            ES
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-24">
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scroll-hide border-b border-primary/10">
          <button className="shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-lg bg-primary text-white text-xs font-bold">
            <Icon name="auto_fix_high" style={{ fontSize: 16 }} />
            Regenerate
          </button>
          <button className="shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-lg glass text-slate-300 text-xs hover:border-primary/30">
            <Icon name="shuffle" style={{ fontSize: 16 }} />
            Variations
          </button>
          <button className="shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-lg glass text-slate-300 text-xs hover:border-primary/30">
            <Icon name="translate" style={{ fontSize: 16 }} />
            Translate
          </button>
          <button className="shrink-0 flex items-center gap-1.5 h-9 px-4 rounded-lg glass text-slate-300 text-xs hover:border-primary/30">
            <Icon name="download" style={{ fontSize: 16 }} />
            Export
          </button>
        </div>

        <div className="px-4 py-4 space-y-5">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
              Rhyme Scheme
            </h3>
            <div className="flex gap-2">
              {RHYMES.map((r) => (
                <button
                  key={r}
                  onClick={() => setRhyme(r)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    rhyme === r ? "bg-primary text-white" : "glass text-slate-300"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Verse 1
              </h3>
              <button className="text-xs text-primary/60 hover:text-primary flex items-center gap-1">
                <Icon name="auto_fix_high" style={{ fontSize: 14 }} />
                AI Suggest
              </button>
            </div>
            <div className="space-y-1.5">
              {verse1.map((line, i) => (
                <input
                  key={i}
                  type="text"
                  defaultValue={line}
                  className="w-full bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none hover:border-primary/30"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-pink-400">
                Chorus
              </h3>
              <button className="text-xs text-primary/60 hover:text-primary flex items-center gap-1">
                <Icon name="auto_fix_high" style={{ fontSize: 14 }} />
                AI Suggest
              </button>
            </div>
            <div className="space-y-1.5">
              {chorus.map((line, i) => (
                <input
                  key={i}
                  type="text"
                  defaultValue={line}
                  className="w-full bg-pink-500/5 border border-pink-400/20 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-pink-400 outline-none hover:border-pink-400/40"
                />
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                Verse 2
              </h3>
              <button className="text-xs text-primary/60 hover:text-primary flex items-center gap-1">
                <Icon name="auto_fix_high" style={{ fontSize: 14 }} />
                AI Suggest
              </button>
            </div>
            <div className="space-y-1.5">
              {verse2.map((line, i) => (
                <input
                  key={i}
                  type="text"
                  defaultValue={line}
                  className="w-full bg-primary/5 border border-primary/15 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
              ))}
            </div>
          </div>

          <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            <Icon name="check" />
            Save Lyrics
          </button>
        </div>
      </main>
    </div>
  );
}
