"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { Toggle } from "@/components/ui/Toggle";

export default function ProfilePage() {
  const router = useRouter();

  const doSignOut = () => {
    router.push("/signin");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <Link
          href="/app/home"
          className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1
          className="text-base font-bold"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          Profile & Settings
        </h1>
        <button className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
          <Icon name="settings" style={{ fontSize: 20 }} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-24">
        <section className="flex flex-col items-center px-4 py-8 bg-linear-to-b from-primary/12 to-transparent">
          <div className="relative mb-4">
            <div
              className="w-20 h-20 rounded-full bg-linear-to-tr from-primary to-pink-500 flex items-center justify-center text-3xl font-bold text-white"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              JP
            </div>
            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-bg-dark flex items-center justify-center">
              <Icon
                name="edit"
                className="text-white"
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
          <h2
            className="text-2xl font-bold"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Julian Pierce
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            @julianp · Creator since 2024
          </p>
          <div className="flex items-center gap-2 mt-3">
            <span
              className="px-3 py-1 rounded-full bg-primary text-white text-xs font-bold"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              PRO MEMBER
            </span>
            <span className="px-3 py-1 rounded-full glass text-slate-300 text-xs">
              ✓ Verified
            </span>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-3 px-4 py-4">
          {[
            { value: "47", label: "Tracks" },
            { value: "12.4k", label: "Plays" },
            { value: "834", label: "Followers" },
          ].map((s) => (
            <div
              key={s.label}
              className="glass-card p-4 rounded-2xl text-center"
            >
              <p
                className="font-bold text-2xl text-primary"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                {s.value}
              </p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </div>
          ))}
        </section>

        <div className="px-4 space-y-5 py-2">
          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Account
            </h3>
            <div className="space-y-2">
              {[
                { icon: "person", label: "Edit Profile" },
                {
                  icon: "diamond",
                  label: "Pro Subscription",
                  sub: "Active · $12/mo",
                },
                { icon: "receipt", label: "Licensing Certificates" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="glass-card p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      name={item.icon}
                      className="text-primary"
                      style={{ fontSize: 20 }}
                    />
                    <div>
                      <span className="text-sm font-medium">{item.label}</span>
                      {item.sub && (
                        <p className="text-xs text-primary">{item.sub}</p>
                      )}
                    </div>
                  </div>
                  <Icon
                    name="chevron_right"
                    className="text-slate-500"
                    style={{ fontSize: 18 }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              Music Engine
            </h3>
            <div className="space-y-2">
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    name="audio_file"
                    className="text-primary"
                    style={{ fontSize: 20 }}
                  />
                  <span className="text-sm font-medium">Default Export</span>
                </div>
                <div className="flex gap-1">
                  <button className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-primary text-white">
                    WAV
                  </button>
                  <button className="px-2.5 py-1 text-[10px] font-bold text-slate-400 glass rounded-lg">
                    MP3
                  </button>
                </div>
              </div>
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    name="mic"
                    className="text-primary"
                    style={{ fontSize: 20 }}
                  />
                  <span className="text-sm font-medium">Voice Cloning</span>
                </div>
                <Toggle defaultOn />
              </div>
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    name="smart_toy"
                    className="text-primary"
                    style={{ fontSize: 20 }}
                  />
                  <span className="text-sm font-medium">AI Auto-Suggest</span>
                </div>
                <Toggle defaultOn />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
              App
            </h3>
            <div className="space-y-2">
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    name="dark_mode"
                    className="text-primary"
                    style={{ fontSize: 20 }}
                  />
                  <span className="text-sm font-medium">Dark Mode</span>
                </div>
                <Toggle defaultOn />
              </div>
              <div className="glass-card p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon
                    name="notifications"
                    className="text-primary"
                    style={{ fontSize: 20 }}
                  />
                  <span className="text-sm font-medium">Notifications</span>
                </div>
                <Toggle defaultOn />
              </div>
            </div>
          </div>

          <button
            onClick={doSignOut}
            className="w-full py-4 text-red-400 font-bold glass border-red-500/20 rounded-xl hover:bg-red-500/10 transition-colors text-sm flex items-center justify-center gap-2"
          >
            <Icon name="logout" style={{ fontSize: 18 }} />
            Sign Out
          </button>
        </div>
      </main>
    </div>
  );
}
