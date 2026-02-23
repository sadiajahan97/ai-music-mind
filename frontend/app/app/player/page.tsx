"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { WaveBar } from "@/components/ui/WaveBar";

const PHASES = [
  "Analyzing prompt...",
  "Composing music...",
  "Generating lyrics...",
  "Synthesizing vocals...",
  "Mixing & mastering...",
  "Done! ✓",
];
const TOTAL = 30;

export default function PlayerPage() {
  const [genPct, setGenPct] = useState(0);
  const [status, setStatus] = useState(PHASES[0]);
  const [playing, setPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const playInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let val = 0;
    const iv = setInterval(() => {
      val = Math.min(val + Math.random() * 10 + 3, 100);
      setGenPct(Math.floor(val));
      const idx = Math.min(
        Math.floor((val / 100) * (PHASES.length - 1)),
        PHASES.length - 1
      );
      setStatus(PHASES[idx]);
      if (val >= 100) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, []);

  const strokeOffset = 502.65 - (502.65 * genPct) / 100;

  const togglePlay = () => {
    if (playing) {
      if (playInterval.current) clearInterval(playInterval.current);
      setPlaying(false);
    } else {
      playInterval.current = setInterval(() => {
        setPlayProgress((p) => {
          if (p >= TOTAL) {
            if (playInterval.current) clearInterval(playInterval.current);
            setPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 1000);
      setPlaying(true);
    }
  };

  const restartTrack = () => {
    if (playInterval.current) clearInterval(playInterval.current);
    setPlaying(false);
    setPlayProgress(0);
  };

  const progressPct = (playProgress / TOTAL) * 100;
  const m = Math.floor(playProgress / 60);
  const s = playProgress % 60;
  const timeStr = `${m}:${String(s).padStart(2, "0")}`;

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 glass-dark border-b border-primary/10">
        <Link
          href="/app/create"
          className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1
          className="text-lg font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-primary"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          AI Music Mind
        </h1>
        <button className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
          <Icon name="share" />
        </button>
      </header>

      <main className="flex-1 flex flex-col px-5 gap-6 py-4 max-w-md mx-auto w-full pb-24">
        <section className="flex flex-col items-center pt-2">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 176 176">
              <circle
                cx="88"
                cy="88"
                r="80"
                fill="transparent"
                stroke="rgba(146,19,236,0.12)"
                strokeWidth="6"
              />
              <circle
                cx="88"
                cy="88"
                r="80"
                fill="transparent"
                stroke="var(--color-primary)"
                strokeWidth="6"
                strokeDasharray="502.65"
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                className="progress-ring-fill"
                style={{
                  filter: "drop-shadow(0 0 10px rgba(146,19,236,0.7))",
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center text-center">
              <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-0.5">
                Status
              </span>
              <span className="text-xs font-medium text-center leading-tight max-w-[80px]">
                {status}
              </span>
              <span
                className="text-3xl font-bold mt-1 text-primary"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                {genPct}%
              </span>
            </div>
          </div>
          <p className="mt-4 text-slate-400 text-xs text-center">
            Processing{" "}
            <span className="text-primary font-medium">30-Second Polished Clip</span>
          </p>
        </section>

        <section className="relative flex flex-col gap-4">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10 anim-glow" />
          <div className="flex items-end justify-center gap-1 h-24 px-2">
            {[28, 45, 65, 80, 95, 85, 70, 55, 40, 30, 48, 68, 75, 55, 35, 60].map(
              (h, i) => (
                <WaveBar
                  key={i}
                  height={h}
                  delay={i * 0.1}
                  className={i === 4 ? "shadow-[0_0_14px_rgba(146,19,236,0.7)]" : ""}
                />
              )
            )}
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{timeStr}</span>
              <span>0:30</span>
            </div>
            <div className="h-1.5 w-full bg-primary/15 rounded-full cursor-pointer">
              <div
                className="h-full bg-primary rounded-full transition-[width] duration-300"
                style={{
                  width: `${progressPct}%`,
                  boxShadow: "0 0 10px rgba(146,19,236,0.6)",
                }}
              />
            </div>
          </div>
        </section>

        <div className="text-center">
          <h2
            className="font-bold text-lg"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            &quot;Midnight Neon Synthwave&quot;
          </h2>
          <p className="text-slate-400 text-sm">Pop · 120 BPM · 30s</p>
          <div className="flex justify-center gap-2 mt-3">
            <button className="px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold">
              v1
            </button>
            <button className="px-3 py-1 rounded-lg glass text-slate-400 text-xs">
              v2
            </button>
            <button className="px-3 py-1 rounded-lg glass text-slate-400 text-xs">
              v3
            </button>
          </div>
        </div>

        <section className="flex items-center justify-center gap-10">
          <button
            onClick={restartTrack}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <Icon name="fast_rewind" style={{ fontSize: 36 }} />
          </button>
          <button
            onClick={togglePlay}
            className="w-20 h-20 rounded-full bg-linear-to-br from-primary-light to-primary flex items-center justify-center text-white shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Icon
              name={playing ? "pause" : "play_arrow"}
              className="text-white"
              style={{ fontSize: 40 }}
              fill={1}
            />
          </button>
          <button className="text-slate-400 hover:text-white transition-colors">
            <Icon name="fast_forward" style={{ fontSize: 36 }} />
          </button>
        </section>

        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Link
              href="/app/lyrics"
              className="flex flex-col items-center gap-1 p-3 glass rounded-xl hover:border-primary/40 transition-all"
            >
              <Icon name="lyrics" className="text-primary" style={{ fontSize: 20 }} />
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Lyrics
              </span>
            </Link>
            <Link
              href="/app/instruments"
              className="flex flex-col items-center gap-1 p-3 glass rounded-xl hover:border-primary/40 transition-all"
            >
              <Icon name="tune" className="text-primary" style={{ fontSize: 20 }} />
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Mix
              </span>
            </Link>
            <Link
              href="/app/assistant"
              className="flex flex-col items-center gap-1 p-3 glass rounded-xl hover:border-primary/40 transition-all"
            >
              <Icon name="smart_toy" className="text-primary" style={{ fontSize: 20 }} />
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Refine
              </span>
            </Link>
          </div>
          <button className="w-full py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            <Icon name="download" />
            Export Track
          </button>
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass hover:border-primary/40 transition-all">
              <div className="w-5 h-5 rounded bg-linear-to-tr from-[#69C9D0] to-[#EE1D52] flex items-center justify-center">
                <Icon name="music_note" className="text-white" style={{ fontSize: 12 }} />
              </div>
              <span className="text-sm font-medium">TikTok</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass hover:border-primary/40 transition-all">
              <div className="w-5 h-5 rounded bg-linear-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center">
                <Icon name="camera_alt" className="text-white" style={{ fontSize: 12 }} />
              </div>
              <span className="text-sm font-medium">Instagram</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass hover:border-primary/40 transition-all">
              <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center">
                <Icon name="play_arrow" className="text-white" style={{ fontSize: 12 }} />
              </div>
              <span className="text-sm font-medium">YouTube</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
