"use client";

const steps = [
  {
    num: "1",
    title: "Describe your vision",
    desc: "Enter a theme, pick a genre and mood. Our AI understands context and emotion.",
  },
  {
    num: "2",
    title: "AI composes in 20 seconds",
    desc: "Lyrics, instrumentals, vocals, mixing and mastering — all automated.",
    highlight: true,
  },
  {
    num: "3",
    title: "Export & share anywhere",
    desc: "Optimized for TikTok, Instagram Reels & YouTube Shorts. MP3 or WAV.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-20 bg-primary/5 border-y border-primary/10">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/20 text-primary text-xs font-bold mb-4 tracking-wider">
            HOW IT WORKS
          </div>
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Studio-quality in 3 steps
          </h2>
        </div>
        <div className="grid gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className={`glass-card p-6 rounded-2xl flex items-center gap-5 ${
                s.highlight ? "border-primary/30" : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold shrink-0"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                {s.num}
              </div>
              <div>
                <h3
                  className="font-bold mb-1"
                  style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
                >
                  {s.title}
                </h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
