"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { WaveBar } from "@/components/ui/WaveBar";

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
  imageUrl?: string | null;
  isReady?: boolean;
  createdAt?: string;
  filePath?: string | null;
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

const PHASES = [
  "Analyzing prompt...",
  "Composing music...",
  "Generating lyrics...",
  "Synthesizing vocals...",
  "Mixing & mastering...",
  "Done! ✓",
];

export default function PlayerTrackPage() {
  const params = useParams();
  const router = useRouter();
  const trackId = typeof params.trackId === "string" ? params.trackId : null;

  const [track, setTrack] = useState<MusicTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [genPct, setGenPct] = useState(0);
  const [status, setStatus] = useState(PHASES[0]);
  const [playing, setPlaying] = useState(false);
  const [playProgress, setPlayProgress] = useState(0);
  const [playError, setPlayError] = useState<string | null>(null);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const playInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!trackId || !track?.isReady || !track?.filePath) {
      setAudioBlobUrl(null);
      return;
    }
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (!token) return;

    const fileUrl = `${API_BASE}/music/tracks/${encodeURIComponent(trackId)}/file`;
    fetch(fileUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load audio");
        return res.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setAudioBlobUrl(url);
      })
      .catch(() => setAudioBlobUrl(null));

    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
      setAudioBlobUrl(null);
    };
  }, [trackId, track?.isReady, track?.filePath]);

  useEffect(() => {
    if (!trackId) {
      queueMicrotask(() => setLoading(false));
      router.replace("/app/library");
      return;
    }
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (!token) {
      queueMicrotask(() => setLoading(false));
      router.replace("/app/signin");
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
        setPlayError(null);
        setImageLoadFailed(false);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load track"),
      )
      .finally(() => setLoading(false));
  }, [trackId, router]);

  useEffect(() => {
    if (!track?.isReady) return;
    let val = 0;
    const iv = setInterval(() => {
      val = Math.min(val + Math.random() * 10 + 3, 100);
      setGenPct(Math.floor(val));
      const idx = Math.min(
        Math.floor((val / 100) * (PHASES.length - 1)),
        PHASES.length - 1,
      );
      setStatus(PHASES[idx]);
      if (val >= 100) clearInterval(iv);
    }, 350);
    return () => clearInterval(iv);
  }, [track?.isReady]);

  const strokeOffset = 502.65 - (502.65 * genPct) / 100;

  const totalSeconds =
    track?.duration != null ? Math.floor(track.duration / 1000) : 30;
  const audioSrc = audioBlobUrl ?? undefined;

  const togglePlay = () => {
    setPlayError(null);
    if (track?.isReady && audioSrc && audioRef.current) {
      if (playing) {
        audioRef.current.pause();
        if (playInterval.current) clearInterval(playInterval.current);
        setPlaying(false);
      } else {
        const el = audioRef.current;
        const dur =
          Number.isFinite(el.duration) && el.duration > 0 ? el.duration : 1;
        const start =
          totalSeconds > 0 ? (playProgress / totalSeconds) * dur : 0;
        const safeStart =
          Number.isFinite(start) && start >= 0 ? Math.min(start, dur) : 0;
        el.currentTime = safeStart;
        playInterval.current = setInterval(() => {
          if (!audioRef.current) return;
          const current = audioRef.current.currentTime;
          const p = Math.floor(
            (current / (audioRef.current.duration || 1)) * totalSeconds,
          );
          setPlayProgress(Math.min(p, totalSeconds));
          if (p >= totalSeconds && playInterval.current) {
            clearInterval(playInterval.current);
            setPlaying(false);
          }
        }, 500);
        setPlaying(true);
        el.play().catch((err: unknown) => {
          if (playInterval.current) {
            clearInterval(playInterval.current);
            playInterval.current = null;
          }
          setPlaying(false);
          if (err instanceof Error && err.name !== "AbortError") {
            setPlayError(
              "Unable to play audio. The file may be unavailable or in an unsupported format.",
            );
            console.error("Audio play failed:", err);
          }
        });
      }
    } else if (track?.isReady && !audioSrc) {
      setPlayError("Audio is still loading or not available.");
    } else if (!track?.isReady) {
      if (playing) {
        if (playInterval.current) clearInterval(playInterval.current);
        setPlaying(false);
      } else {
        playInterval.current = setInterval(() => {
          setPlayProgress((p) => {
            if (p >= totalSeconds) {
              if (playInterval.current) clearInterval(playInterval.current);
              setPlaying(false);
              return 0;
            }
            return p + 1;
          });
        }, 1000);
        setPlaying(true);
      }
    }
  };

  const restartTrack = () => {
    if (track?.isReady && audioRef.current) {
      audioRef.current.currentTime = 0;
    }
    if (playInterval.current) clearInterval(playInterval.current);
    setPlaying(false);
    setPlayProgress(0);
  };

  const handleExportTrack = async () => {
    if (!trackId || !track?.filePath) return;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (!token) return;
    try {
      const url = `${API_BASE}/music/tracks/${encodeURIComponent(trackId)}/file?download=1`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download =
        (track.title || "track").replace(/[/\\?%*:|"<>]/g, "_") + ".mp3";
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      console.error(e);
      setPlayError("Export failed. Please try again.");
    }
  };

  const progressPct =
    totalSeconds > 0 ? (playProgress / totalSeconds) * 100 : 0;
  const m = Math.floor(playProgress / 60);
  const s = playProgress % 60;
  const timeStr = `${m}:${String(s).padStart(2, "0")}`;
  const totalM = Math.floor(totalSeconds / 60);
  const totalS = totalSeconds % 60;
  const totalTimeStr = `${totalM}:${String(totalS).padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-dark items-center justify-center">
        <p className="text-slate-400">Loading track…</p>
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
      {audioSrc && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onEnded={() => {
            if (playInterval.current) clearInterval(playInterval.current);
            setPlaying(false);
            setPlayProgress(0);
          }}
        />
      )}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 glass-dark border-b border-primary/10">
        <Link
          href="/app/library"
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
            {track.imageUrl && !imageLoadFailed ? (
              <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-primary/20 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={track.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={() => setImageLoadFailed(true)}
                />
              </div>
            ) : (
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
                  strokeDashoffset={track.isReady ? 0 : strokeOffset}
                  strokeLinecap="round"
                  className="progress-ring-fill"
                  style={{
                    filter: "drop-shadow(0 0 10px rgba(146,19,236,0.7))",
                  }}
                />
              </svg>
            )}
            {!track.isReady && (
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-primary text-[10px] font-bold uppercase tracking-widest mb-0.5">
                  Status
                </span>
                <span className="text-xs font-medium text-center leading-tight max-w-[80px]">
                  {status}
                </span>
                <span
                  className="text-3xl font-bold mt-1 text-primary"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  {genPct}%
                </span>
              </div>
            )}
          </div>
          {!track.isReady && (
            <p className="mt-4 text-slate-400 text-xs text-center">
              Processing{" "}
              <span className="text-primary font-medium">
                {track.title || "Your track"}
              </span>
            </p>
          )}
        </section>

        <section className="relative flex flex-col gap-4">
          <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-3xl -z-10 anim-glow" />
          <div className="flex items-end justify-center gap-1 h-24 px-2">
            {[
              28, 45, 65, 80, 95, 85, 70, 55, 40, 30, 48, 68, 75, 55, 35, 60,
            ].map((h, i) => (
              <WaveBar
                key={i}
                height={h}
                delay={i * 0.1}
                className={
                  i === 4 ? "shadow-[0_0_14px_rgba(146,19,236,0.7)]" : ""
                }
              />
            ))}
          </div>
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span>{timeStr}</span>
              <span>{totalTimeStr}</span>
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
            &quot;{track.title || "Untitled"}&quot;
          </h2>
          {track.isReady && (
            <p className="text-slate-400 text-sm">{formatMeta(track)}</p>
          )}
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

        {playError && (
          <p className="text-center text-sm text-amber-400/90" role="alert">
            {playError}
          </p>
        )}

        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <Link
              href={`/app/lyrics/${trackId}`}
              className="flex flex-col items-center gap-1 p-3 glass rounded-xl hover:border-primary/40 transition-all"
            >
              <Icon
                name="lyrics"
                className="text-primary"
                style={{ fontSize: 20 }}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Lyrics
              </span>
            </Link>
            <Link
              href="/app/instruments"
              className="flex flex-col items-center gap-1 p-3 glass rounded-xl hover:border-primary/40 transition-all"
            >
              <Icon
                name="tune"
                className="text-primary"
                style={{ fontSize: 20 }}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Mix
              </span>
            </Link>
            <Link
              href="/app/assistant"
              className="flex flex-col items-center gap-1 p-3 glass rounded-xl hover:border-primary/40 transition-all"
            >
              <Icon
                name="smart_toy"
                className="text-primary"
                style={{ fontSize: 20 }}
              />
              <span className="text-[10px] text-slate-400 font-bold uppercase">
                Refine
              </span>
            </Link>
          </div>
          {track.filePath && (
            <button
              type="button"
              onClick={handleExportTrack}
              className="w-full py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              <Icon name="download" />
              Export Track
            </button>
          )}
          <div className="flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass hover:border-primary/40 transition-all">
              <div className="w-5 h-5 rounded bg-linear-to-tr from-[#69C9D0] to-[#EE1D52] flex items-center justify-center">
                <Icon
                  name="music_note"
                  className="text-white"
                  style={{ fontSize: 12 }}
                />
              </div>
              <span className="text-sm font-medium">TikTok</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass hover:border-primary/40 transition-all">
              <div className="w-5 h-5 rounded bg-linear-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] flex items-center justify-center">
                <Icon
                  name="camera_alt"
                  className="text-white"
                  style={{ fontSize: 12 }}
                />
              </div>
              <span className="text-sm font-medium">Instagram</span>
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl glass hover:border-primary/40 transition-all">
              <div className="w-5 h-5 rounded bg-red-600 flex items-center justify-center">
                <Icon
                  name="play_arrow"
                  className="text-white"
                  style={{ fontSize: 12 }}
                />
              </div>
              <span className="text-sm font-medium">YouTube</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
