"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WaveBar } from "@/components/ui/WaveBar";

const SLIDERS = [
  { id: "drums", label: "Drums", icon: "sports_cricket", default: 75 },
  { id: "bass", label: "Bass", icon: "graphic_eq", default: 65 },
  { id: "vocals", label: "Vocals", icon: "mic", default: 80 },
  { id: "reverb", label: "Reverb", icon: "blur_on", default: 40 },
  { id: "vol", label: "Master Volume", icon: "volume_up", default: 85 },
];

export default function InstrumentsPage() {
  const [values, setValues] = useState<Record<string, number>>(
    Object.fromEntries(SLIDERS.map((s) => [s.id, s.default]))
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <Link
          href="/app/player"
          className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1
          className="text-lg font-bold"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          Instrument Studio
        </h1>
        <button className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
          <Icon name="restart_alt" style={{ fontSize: 20 }} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-24 px-4 py-5 space-y-5">
        <div className="glass-card p-4 rounded-2xl flex items-center gap-4 border-primary/25">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-purple-800 flex items-center justify-center shrink-0">
            <Icon
              name="music_note"
              className="text-white"
              style={{ fontSize: 22 }}
              fill={1}
            />
          </div>
          <div className="flex-1">
            <p
              className="font-bold"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Midnight Neon Synthwave
            </p>
            <p className="text-xs text-slate-400">
              Live editing — changes apply instantly
            </p>
          </div>
          <div className="flex items-center gap-1">
            <WaveBar height={14} delay={0} />
            <WaveBar height={20} delay={0.15} />
            <WaveBar height={14} delay={0.3} />
          </div>
        </div>

        <div className="space-y-4">
          <h3
            className="text-xs font-bold uppercase tracking-wider text-slate-400"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Mix Controls
          </h3>
          {SLIDERS.map((s) => (
            <div key={s.id} className="glass-card p-4 rounded-xl">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <Icon
                    name={s.icon}
                    className="text-primary"
                    style={{ fontSize: 20 }}
                  />
                  <span className="font-medium text-sm">{s.label}</span>
                </div>
                <span
                  className="text-primary font-bold text-sm"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  {values[s.id] ?? s.default}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={values[s.id] ?? s.default}
                onChange={(e) =>
                  setValues((v) => ({ ...v, [s.id]: Number(e.target.value) }))
                }
                className="w-full"
              />
            </div>
          ))}
          <div className="glass-card p-4 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-slate-500 font-bold">Acoustic</span>
              <span className="font-medium text-sm">Character</span>
              <span className="text-xs text-slate-500 font-bold">
                Electronic
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              defaultValue={60}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="flex-1 py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            <Icon name="check" />
            Apply Mix
          </button>
          <Link
            href="/app/player"
            className="flex-1 py-4 glass text-slate-300 font-bold rounded-xl flex items-center justify-center gap-2 hover:border-primary/30"
          >
            <Icon name="arrow_back" />
            Back
          </Link>
        </div>
      </main>
    </div>
  );
}
