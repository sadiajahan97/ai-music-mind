"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const ACCESS_TOKEN_KEY = "access_token";
const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";

const RHYMES = ["ABAB", "AABB", "ABBA", "Free"];

type MusicTrack = {
  id: string;
  title?: string | null;
  lyrics?: string | null;
  [key: string]: unknown;
};

function parseLyricsToSections(lyrics: string): string[][] {
  if (!lyrics || !lyrics.trim()) return [];
  const sections = lyrics
    .trim()
    .split(/\n\s*\n/)
    .map((block) => block.trim().split(/\n/).filter(Boolean));
  return sections.filter((s) => s.length > 0);
}

function sectionLabel(index: number): string {
  return index % 2 === 0 ? `Verse ${Math.floor(index / 2) + 1}` : "Chorus";
}

function isChorusLabel(label: string): boolean {
  return label === "Chorus";
}

export default function LyricsPage() {
  const params = useParams();
  const trackId = typeof params.trackId === "string" ? params.trackId : null;

  const [track, setTrack] = useState<MusicTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rhyme, setRhyme] = useState("ABAB");
  const [sections, setSections] = useState<string[][]>([]);

  useEffect(() => {
    if (!trackId) {
      queueMicrotask(() => setLoading(false));
      return;
    }
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (!token) {
      queueMicrotask(() => {
        setError("Please sign in to view lyrics.");
        setLoading(false);
      });
      return;
    }
    fetch(`${API_BASE}/music/tracks/${encodeURIComponent(trackId)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 404) throw new Error("Track not found");
        if (!res.ok) throw new Error("Failed to load track");
        return res.json();
      })
      .then((data: MusicTrack) => {
        setTrack(data);
        setSections(parseLyricsToSections(data.lyrics ?? ""));
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load track"),
      )
      .finally(() => setLoading(false));
  }, [trackId]);

  const updateLine = (sectionIndex: number, lineIndex: number, value: string) => {
    setSections((prev) => {
      const next = prev.map((s) => [...s]);
      if (!next[sectionIndex]) return next;
      next[sectionIndex] = [...next[sectionIndex]];
      next[sectionIndex][lineIndex] = value;
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-dark items-center justify-center">
        <p className="text-slate-400">Loading lyrics…</p>
      </div>
    );
  }

  if (error || !track) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-dark items-center justify-center gap-4 px-4">
        <p className="text-red-400 text-center">{error ?? "Track not found"}</p>
        <Link
          href="/app/library"
          className="px-4 py-2 bg-primary text-white rounded-xl font-medium"
        >
          Back to Library
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10 px-4 py-3 flex items-center justify-between">
        <Link
          href={`/app/player/${trackId}`}
          className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1
          className="text-base font-bold truncate max-w-[180px]"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          title={track.title ?? "Lyrics"}
        >
          {track.title ?? "Lyrics Studio"}
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

          {sections.length === 0 ? (
            <p className="text-slate-500 text-sm py-4">
              No lyrics for this track yet.
            </p>
          ) : (
            sections.map((lines, sectionIndex) => {
              const label = sectionLabel(sectionIndex);
              const isChorus = isChorusLabel(label);
              return (
                <div key={sectionIndex}>
                  <div className="flex items-center justify-between mb-2">
                    <h3
                      className={`text-xs font-bold uppercase tracking-wider ${
                        isChorus ? "text-pink-400" : "text-primary"
                      }`}
                    >
                      {label}
                    </h3>
                    <button className="text-xs text-primary/60 hover:text-primary flex items-center gap-1">
                      <Icon name="auto_fix_high" style={{ fontSize: 14 }} />
                      AI Suggest
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {lines.map((line, lineIndex) => (
                      <input
                        key={lineIndex}
                        type="text"
                        value={line}
                        onChange={(e) =>
                          updateLine(sectionIndex, lineIndex, e.target.value)
                        }
                        className={`w-full rounded-lg px-4 py-2.5 text-sm focus:ring-1 outline-none hover:border-primary/30 ${
                          isChorus
                            ? "bg-pink-500/5 border border-pink-400/20 focus:ring-pink-400 hover:border-pink-400/40"
                            : "bg-primary/5 border border-primary/15 focus:ring-primary"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}

          <button
            className="w-full py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-xl shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
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
