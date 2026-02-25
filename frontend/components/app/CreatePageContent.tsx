"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const ACCESS_TOKEN_KEY = "access_token";
const API_BASE =
  typeof process !== "undefined" && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : "http://localhost:8000";
import { Toggle } from "@/components/ui/Toggle";

const GENRES = ["Pop", "EDM", "Lo-fi", "Rap", "Jazz", "Rock", "Classical"];
const LANGS = ["English", "Spanish", "French", "Arabic", "Hindi", "Japanese", "Bangla"];
const MOODS = [
  { id: "Happy", icon: "wb_sunny" },
  { id: "Dark", icon: "dark_mode" },
  { id: "Chill", icon: "cloud" },
  { id: "Energetic", icon: "bolt" },
  { id: "Romantic", icon: "favorite" },
  { id: "Motivational", icon: "trending_up" },
];
const CHIPS = [
  { label: "🎧 Lo-fi Study", val: "A chill lo-fi beat for studying" },
  { label: "🎬 Epic Score", val: "Epic cinematic orchestral score" },
  { label: "🎵 Pop TikTok", val: "Upbeat pop track for TikTok" },
];

export function CreatePageContent() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [genre, setGenre] = useState("Pop");
  const [mood, setMood] = useState("Happy");
  const [lang, setLang] = useState("English");
  const [vocalGender, setVocalGender] = useState<"m" | "f">("m");
  const [bpm, setBpm] = useState(120);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showProcessingPopup, setShowProcessingPopup] = useState(false);
  const [generatedTitle, setGeneratedTitle] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setError(null);
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(ACCESS_TOKEN_KEY)
        : null;
    if (!token) {
      setError("Please sign in to generate music.");
      return;
    }
    if (!prompt.trim()) {
      setError("Please enter a theme or prompt.");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/music/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          user_prompt: prompt.trim(),
          style: genre,
          mood,
          vocal_gender: vocalGender,
          language: lang,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg =
          typeof data.detail === "string"
            ? data.detail
            : "Failed to start generation.";
        setError(msg);
        return;
      }
      setGeneratedTitle(data.title ?? null);
      setShowProcessingPopup(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/app/home"
            className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors"
          >
            <Icon name="arrow_back" />
          </Link>
          <h1
            className="text-lg font-bold"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            New Project
          </h1>
        </div>
        <button
          onClick={() => setPrompt("")}
          className="text-primary font-medium text-sm"
        >
          Reset
        </button>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-32">
        <section className="px-4 py-5">
          <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2.5">
            Theme / Prompt
          </label>
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full min-h-[130px] p-4 bg-primary/5 border border-primary/20 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-base resize-none placeholder:text-slate-500"
              placeholder="Describe the sound, e.g., 'A cinematic lo-fi beat for a rainy night in Tokyo'..."
            />
            <div className="absolute bottom-3 right-3 opacity-40 group-hover:opacity-100 transition-opacity">
              <Icon
                name="auto_fix_high"
                className="text-primary"
                style={{ fontSize: 18 }}
              />
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {CHIPS.map((c) => (
              <button
                key={c.label}
                onClick={() => setPrompt(c.val)}
                className="chip px-3 py-1 glass rounded-full text-xs text-slate-400 hover:text-primary hover:border-primary/40 transition-all"
              >
                {c.label}
              </button>
            ))}
          </div>
        </section>

        <section className="py-3">
          <div className="px-4 flex justify-between items-center mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">
              Genre
            </label>
            <span className="text-xs text-slate-500">Select one</span>
          </div>
          <div className="flex gap-2.5 px-4 overflow-x-auto scroll-hide">
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setGenre(g)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  genre === g
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "glass text-slate-300 hover:border-primary/40"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 py-5">
          <label className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">
            Mood
          </label>
          <div className="grid grid-cols-2 gap-3">
            {MOODS.map((m) => (
              <div
                key={m.id}
                onClick={() => setMood(m.id)}
                className={`p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                  mood === m.id
                    ? "border-2 border-primary bg-primary/10 relative"
                    : "glass hover:border-primary/40"
                }`}
              >
                <Icon
                  name={m.icon}
                  className={mood === m.id ? "text-primary" : "text-slate-500"}
                />
                <span
                  className={`font-medium text-sm ${
                    mood === m.id ? "" : "text-slate-300"
                  }`}
                >
                  {m.id}
                </span>
                {mood === m.id && (
                  <div className="absolute top-2 right-2">
                    <Icon
                      name="check_circle"
                      className="text-primary"
                      style={{ fontSize: 16 }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <label className="text-xs font-bold uppercase tracking-wider text-primary">
              Tempo
            </label>
            <div className="glass px-3 py-1 rounded-lg border-primary/25">
              <span
                className="text-primary font-bold"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                {bpm}
              </span>
              <span className="text-primary text-xs font-medium"> BPM</span>
            </div>
          </div>
          <input
            type="range"
            min={60}
            max={180}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between mt-1.5 px-1">
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              Slow 60
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-bold">
              Fast 180
            </span>
          </div>
        </section>

        <section className="px-4 py-4 grid grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5 block">
              Duration
            </label>
            <div className="relative">
              <select className="w-full bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 appearance-none focus:ring-2 focus:ring-primary outline-none text-slate-100 text-sm">
                <option>15s</option>
                <option>30s</option>
                <option>60s</option>
                <option>120s</option>
              </select>
              <Icon
                name="expand_more"
                className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400"
                style={{ fontSize: 18 }}
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-primary mb-2.5 block">
              Vocals
            </label>
            <div className="flex items-center justify-between h-[50px] px-4 bg-primary/5 border border-primary/20 rounded-xl">
              <span className="text-sm font-medium">Include</span>
              <Toggle defaultOn />
            </div>
          </div>
        </section>

        <section className="px-4 py-4">
          <label className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">
            Language
          </label>
          <div className="flex gap-2 overflow-x-auto scroll-hide">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs transition-all ${
                  lang === l
                    ? "bg-primary text-white font-medium"
                    : "glass text-slate-300"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 py-4">
          <label className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">
            Vocal Gender
          </label>
          <div className="flex gap-2">
            {[
              { id: "m" as const, label: "Male" },
              { id: "f" as const, label: "Female" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setVocalGender(opt.id)}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  vocalGender === opt.id
                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                    : "glass text-slate-300 hover:border-primary/40"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 py-4">
          <label className="text-xs font-bold uppercase tracking-wider text-primary mb-3 block">
            Advanced Options
          </label>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 glass rounded-xl">
              <div className="flex items-center gap-3">
                <Icon
                  name="shuffle"
                  className="text-primary"
                  style={{ fontSize: 20 }}
                />
                <div>
                  <p className="text-sm font-medium">Smart Variations</p>
                  <p className="text-xs text-slate-500">Generate 3 versions</p>
                </div>
              </div>
              <Toggle defaultOn />
            </div>
            <div className="flex items-center justify-between p-4 glass rounded-xl">
              <div className="flex items-center gap-3">
                <Icon
                  name="palette"
                  className="text-primary"
                  style={{ fontSize: 20 }}
                />
                <div>
                  <p className="text-sm font-medium">Cover Art</p>
                  <p className="text-xs text-slate-500">AI-generated artwork</p>
                </div>
              </div>
              <Toggle defaultOn />
            </div>
          </div>
        </section>
      </main>

      {error && (
        <p className="fixed top-20 left-4 right-4 z-20 px-4 py-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center">
          {error}
        </p>
      )}

      {showProcessingPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
          onClick={() => {
            setShowProcessingPopup(false);
            setGeneratedTitle(null);
          }}
        >
          <div
            className="w-full max-w-sm rounded-2xl glass border border-primary/20 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-center mb-4">
              <div className="size-14 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon
                  name="schedule"
                  className="text-primary"
                  style={{ fontSize: 28 }}
                />
              </div>
            </div>
            <h3
              className="text-lg font-bold text-center mb-2"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Track in progress
            </h3>
            {generatedTitle && (
              <p
                className="text-primary font-medium text-center mb-2 truncate px-2"
                title={generatedTitle}
              >
                {generatedTitle}
              </p>
            )}
            <p className="text-slate-400 text-sm text-center mb-6">
              Your music track is being processed. Go to the Library page to
              listen once it&apos;s ready.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push("/app/library")}
                className="w-full bg-linear-to-r from-primary to-primary-light text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
              >
                <Icon name="library_music" />
                Go to Library
              </button>
              <button
                onClick={() => {
                  setShowProcessingPopup(false);
                  setGeneratedTitle(null);
                }}
                className="w-full py-3 rounded-xl glass text-slate-300 font-medium hover:border-primary/40"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-[86px] left-1/2 -translate-x-1/2 w-full max-w-[393px] p-4 bg-linear-to-t from-bg-dark via-bg-dark/95 to-transparent z-10">
        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-linear-to-r from-primary to-primary-light text-white font-bold py-4 rounded-xl shadow-2xl shadow-primary/40 flex items-center justify-center gap-2 hover:opacity-90 transition-all active:scale-[0.98] anim-pulse disabled:opacity-70 disabled:pointer-events-none"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          <Icon name="auto_awesome" />
          {isGenerating ? "Generating…" : "Generate Track"}
        </button>
      </div>
    </div>
  );
}
