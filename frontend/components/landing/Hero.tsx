"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function Hero() {
  return (
    <section className="relative px-6 pt-24 pb-20 text-center overflow-hidden hero-grad">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-primary/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-20 left-0 w-60 h-60 bg-purple-600/10 blur-[100px] rounded-full" />
      <div className="absolute top-40 right-0 w-48 h-48 bg-pink-600/10 blur-[80px] rounded-full" />

      <div className="relative z-10 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-primary/30 text-primary text-xs font-bold mb-10 tracking-wider">
          <Icon name="auto_awesome" style={{ fontSize: 13 }} />
          AI-POWERED MUSIC GENERATION v2.0
        </div>
        <h1
          className="text-5xl md:text-7xl font-extrabold leading-none tracking-tight mb-6"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          From{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary-light to-primary anim-grad">
            Thought
          </span>
          <br />
          to{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-pink-400 anim-grad">
            Track
          </span>
          <br />
          <span className="text-3xl md:text-4xl text-slate-300 font-medium">
            in 30 Seconds.
          </span>
        </h1>
        <p className="text-slate-400 text-lg leading-relaxed mb-12 max-w-lg mx-auto">
          Create studio-ready, social-optimized music clips with the power of
          generative AI. No music experience required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/signin"
            className="flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-2xl shadow-2xl shadow-primary/40 hover:shadow-primary/60 transition-all text-lg hover:scale-105 active:scale-95 anim-pulse"
          >
            <Icon name="music_note" />
            Start Creating Free
          </Link>
          <Link
            href="/app/discover"
            className="flex items-center justify-center gap-2 px-8 py-4 glass text-white font-bold rounded-2xl hover:border-primary/40 transition-all text-lg"
          >
            <Icon name="explore" />
            Explore Tracks
          </Link>
        </div>
        <div className="flex items-center justify-center gap-3 text-sm text-slate-400">
          <div className="flex -space-x-2">
            {["J", "M", "A", "+"].map((letter, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-bg-deep flex items-center justify-center text-xs font-bold bg-linear-to-tr from-purple-500 to-pink-500"
              />
            ))}
          </div>
          <span>
            <strong className="text-white">10,000+</strong> creators building
            the future of sound
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-20 anim-float flex justify-center">
        <div
          className="w-56 bg-bg-dark rounded-[36px] overflow-hidden shadow-2xl"
          style={{
            boxShadow:
              "0 0 0 6px #0a0612, 0 0 0 8px #2d1b3d, 0 40px 100px rgba(146,19,236,0.4)",
          }}
        >
          <div className="w-20 h-5 bg-bg-deep rounded-b-2xl mx-auto" />
          <div className="p-3 space-y-2.5">
            <div className="h-2 bg-primary/20 rounded-full w-3/4" />
            <div className="h-24 bg-linear-to-br from-primary/20 to-purple-900/40 rounded-xl border border-primary/20 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 flex items-end justify-center pb-2 gap-1">
                {[40, 85, 65, 45, 75, 55].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-primary rounded-full"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="h-2 bg-primary/30 rounded-full" />
            <div className="h-2 bg-primary/15 rounded-full w-4/5" />
            <div className="flex gap-2 pt-1">
              <div className="flex-1 h-7 bg-linear-to-r from-primary to-primary-light rounded-lg flex items-center justify-center">
                <span className="text-white text-[9px] font-bold">
                  Generate ✦
                </span>
              </div>
              <div className="w-7 h-7 glass rounded-lg flex items-center justify-center">
                <Icon
                  name="mic"
                  className="text-primary"
                  style={{ fontSize: 14 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
