"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";

const ACCESS_TOKEN_KEY = "access_token";
const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";

type MusicTrack = {
  id: string;
  title?: string | null;
  tags?: string | null;
  duration?: number | null;
  image_url?: string | null;
  is_ready?: boolean;
  created_at?: string;
};

function formatDuration(ms: number | null | undefined): string {
  if (ms == null) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}

function formatMeta(track: MusicTrack): string {
  const tags = track.tags?.trim() || "—";
  const duration = formatDuration(track.duration);
  return `${tags} · ${duration}`;
}

export default function LibraryPage() {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (!token) {
      queueMicrotask(() => {
        setLoading(false);
        setError("Please sign in to view your tracks.");
      });
      return;
    }
    fetch(`${API_BASE}/music/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load tracks");
        return res.json();
      })
      .then((data: MusicTrack[]) => setTracks(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load tracks."))
      .finally(() => setLoading(false));
  }, []);

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
        {loading && (
          <p className="text-slate-400 text-center py-8">Loading tracks…</p>
        )}
        {error && <p className="text-red-400 text-center py-4 px-4">{error}</p>}
        {!loading &&
          !error &&
          tracks.map((t) => (
            <div
              key={t.id}
              className="glass-card p-4 rounded-2xl flex items-center gap-4"
            >
              {t.image_url ? (
                <div className="w-14 h-14 rounded-xl shrink-0 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element -- dynamic API image URL */}
                  <img
                    src={t.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-linear-to-br from-purple-600 to-pink-500 flex items-center justify-center shrink-0">
                  <Icon name="music_note" className="text-white" style={{ fontSize: 26 }} fill={1} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-base truncate"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  {t.title || "Untitled"}
                </h3>
                <p className="text-xs text-slate-400">{formatMeta(t)}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  {!t.is_ready && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400">
                      Processing
                    </span>
                  )}
                  <span className="text-[10px] text-slate-500">
                    {t.created_at
                      ? new Date(t.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year:
                            new Date(t.created_at).getFullYear() !==
                            new Date().getFullYear()
                              ? "numeric"
                              : undefined,
                        })
                      : ""}
                  </span>
                </div>
              </div>
              <Link
                href={t.is_ready ? `/app/player?trackId=${t.id}` : "#"}
                className={`size-11 rounded-full flex items-center justify-center text-white shadow-lg shrink-0 ${
                  t.is_ready
                    ? "bg-primary shadow-primary/30"
                    : "bg-slate-600 cursor-not-allowed pointer-events-none"
                }`}
              >
                <Icon name="play_arrow" fill={1} style={{ fontSize: 22 }} />
              </Link>
            </div>
          ))}
        {!loading && !error && (
          <div className="glass-card p-6 rounded-2xl text-center mt-4">
            <Icon
              name="library_add"
              className="text-primary mb-3 block"
              style={{ fontSize: 36 }}
            />
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
        )}
      </main>
    </div>
  );
}
