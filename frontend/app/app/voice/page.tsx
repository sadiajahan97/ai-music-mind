"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const VOICES = [
  {
    id: "Luna",
    style: "Ethereal Pop",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA0qaXjFFAH_pLx45VzMqjbiCDaXt8loZPHbz2TSrujavo8Xl7JyYKkpvg8MQaJJgt1Qe_I0Vx-_gRJoQLpkED1zLHBaU7Bqx_QqDbD3GRHoKziua9PlWOwJUOEu5CR1bmcqm2h534tQxcbCU_4OSAaYl8MVkQ25_l0B_vW3UjNzliC5j1xWUXZXQ4vbsh6sN5IfkIiGqnsB9jO5C1RKc_M_PclvreEGlNfiGrSYNhUu9rnMM5YpBcRAxqWGJAx6QZen0Zop6pfJguw",
  },
  {
    id: "Vesper",
    style: "Intimate Whisper",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDKN_S7d8_nxNZW1q_YliF7bTHerLug0juHoVjGL27QF7RQSh70OHHCmJdZUXw79O7wk0cscnKbq6aC_1CRpAIRmLPdpHSeUI1aKcFZNaCU1XmQsKwnr_XjP7wpJkbvYr5I_EcN_HAYg4VuKnxqes8nkE-MkYWcZPVCsbAfEaa4cten8K7V7mjCoti_TQSUkH5pbvX5cuZoic_OCazQDta86x5XqeU5-CqKwSl6ae7YN2iAEeULHpo0vtc8e-VWEOM5FVRLfVU21i9i",
  },
  {
    id: "Sora",
    style: "Cinematic Choir",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-k7HfND2zwgIUeamf-Gnu_dj7I8_GJrYUICJz7M4AHcmU7b216uHF1A6eBF-ihjkQtoz_BrI1VLatyE6Z1gilbtUnKROQX1SrOfkjtiJV_sgu3nuN74aQJfkQiLpRXm-homPH0MXfJfrdm1yUTqUSwHfRB0r7UcmMJvYNHJ81AVKsUEpQFxjfsyEk4u02yADGkzyHl8lC3TLlV_gzwug3cfUt6Xhxfb-qhLROX0BKJB7G-V_qfu9IUd3yOOLkYhfMOybg9hJ8Y8JL",
  },
  {
    id: "Jax",
    style: "Gritty Rap",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB1hgklkwVHJfo2YP5uRV8KM1EApQTbXNW-rCxHXzyZLA7Q3G3W_CWezWyxgBq3Dlq_HUzMWI3pGL8wxFMoMt82JcTRSj8c6jWv9BNd8nkiUCZysvuELz8Qm_kpo4cZSnFSNYRLIgq4zLwWQGMkVC-6fXGDMeOa2FSMiAJ2apiMnkEQlDz2tW-wlLpab_gxUkW672Pslwsy7zU087hZfUs-NWO1N8i_awaYvQAbdRChcY2cjphm-Z2qaC7N8JmPuuJcreLM_ZnF_EzS",
  },
];

export default function VoicePage() {
  const [selected, setSelected] = useState("Jax");
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-50 glass-dark border-b border-primary/10 px-4 py-4 flex items-center justify-between">
        <Link
          href="/app/create"
          className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center transition-colors"
        >
          <Icon name="arrow_back" />
        </Link>
        <h1
          className="text-xl font-bold"
          style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
        >
          Voice Styles
        </h1>
        <div
          className="flex items-center px-3 py-1.5 rounded-full bg-primary/20 border border-primary/40"
          style={{ boxShadow: "0 0 12px rgba(146,19,236,0.3)" }}
        >
          <span className="text-xs font-bold text-primary tracking-widest uppercase">
            PRO
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto scroll-hide pb-36">
        <section className="px-4 pt-5 pb-3">
          <div
            className="flex items-center p-1 rounded-2xl"
            style={{
              background: "rgba(146,19,236,0.08)",
              border: "1px solid rgba(146,19,236,0.18)",
            }}
          >
            <button
              className="flex-1 py-3 rounded-xl font-bold text-sm transition-all bg-primary text-white shadow-lg"
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                boxShadow: "0 4px 16px rgba(146,19,236,0.4)",
              }}
            >
              Female
            </button>
            <button
              className="flex-1 py-3 rounded-xl font-medium text-sm transition-all text-slate-400 hover:text-white"
              style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
            >
              Male
            </button>
          </div>
        </section>

        <section className="mx-4 mb-4">
          <div
            className="relative flex items-center justify-between p-4 rounded-2xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg,rgba(146,19,236,0.18),rgba(10,6,18,0.9))",
              border: "1px solid rgba(146,19,236,0.35)",
            }}
          >
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-primary/10 blur-2xl rounded-full" />
            <div className="relative z-10 flex items-start gap-3">
              <div className="mt-0.5 size-9 rounded-xl bg-primary/25 border border-primary/30 flex items-center justify-center shrink-0">
                <Icon
                  name="lock"
                  className="text-primary"
                  style={{ fontSize: 18 }}
                  fill={1}
                />
              </div>
              <div>
                <h3
                  className="font-bold text-base"
                  style={{
                    fontFamily: "var(--font-display), Syne, sans-serif",
                  }}
                >
                  User Voice Cloning
                </h3>
                <p className="text-slate-400 text-xs mt-0.5 max-w-[180px]">
                  Create a digital twin of your own voice with AI.
                </p>
              </div>
            </div>
            <button className="relative z-10 shrink-0 bg-primary hover:bg-primary-light text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-lg shadow-primary/30">
              Unlock Pro
            </button>
          </div>
        </section>

        <section className="px-4 pb-4">
          <div className="flex gap-2.5 overflow-x-auto scroll-hide">
            {["Singing", "Rap", "Whisper", "Choir"].map((style, i) => (
              <button
                key={style}
                className={`shrink-0 px-5 py-2.5 rounded-full font-bold text-sm transition-all ${
                  i === 0
                    ? "bg-primary text-white"
                    : "glass text-slate-300 hover:border-primary/40"
                }`}
                style={{
                  fontFamily: "var(--font-display), Syne, sans-serif",
                  ...(i === 0
                    ? { boxShadow: "0 4px 14px rgba(146,19,236,0.45)" }
                    : {}),
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 px-4">
          {VOICES.map((v) => {
            const isSelected = selected === v.id;
            const isPlaying = playing === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setSelected(v.id)}
                className="relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 aspect-[3/4]"
                style={{
                  border: isSelected
                    ? "2px solid var(--color-primary)"
                    : undefined,
                  boxShadow: isSelected
                    ? "0 0 0 3px rgba(146,19,236,0.25)"
                    : undefined,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.img}
                  alt={v.id}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top,rgba(10,6,18,0.95) 30%,rgba(10,6,18,0.15) 70%,transparent)",
                  }}
                />
                {isSelected && (
                  <div className="absolute top-2.5 left-2.5">
                    <div className="size-7 rounded-full bg-white flex items-center justify-center shadow-lg">
                      <Icon
                        name="check_circle"
                        className="text-primary"
                        style={{ fontSize: 18 }}
                        fill={1}
                      />
                    </div>
                  </div>
                )}
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlaying(isPlaying ? null : v.id);
                    }}
                    className="size-10 rounded-full flex items-center justify-center transition-all bg-primary border border-primary"
                  >
                    <Icon
                      name={isPlaying ? "pause" : "play_arrow"}
                      className="text-white"
                      style={{ fontSize: 20 }}
                      fill={1}
                    />
                  </button>
                </div>
                <div className="absolute inset-x-0 bottom-0 px-3 pt-8 pb-3">
                  <p
                    className="text-white font-bold text-base leading-tight"
                    style={{
                      fontFamily: "var(--font-display), Syne, sans-serif",
                    }}
                  >
                    {v.id}
                  </p>
                  <p
                    className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${
                      isSelected && v.id === "Luna"
                        ? "text-primary"
                        : "text-slate-300"
                    }`}
                  >
                    {v.style}
                  </p>
                  <button
                    className={`w-full mt-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isSelected
                        ? "bg-primary text-white"
                        : "glass text-white hover:bg-primary hover:border-primary"
                    }`}
                    style={{
                      fontFamily: "var(--font-display), Syne, sans-serif",
                      ...(isSelected
                        ? { boxShadow: "0 4px 16px rgba(146,19,236,0.5)" }
                        : {}),
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isSelected ? "Selected" : "Select"}
                  </button>
                </div>
              </div>
            );
          })}
        </section>
      </main>

      <div
        className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[393px] px-4 pb-5 pt-3 z-50"
        style={{
          background:
            "linear-gradient(to top,rgba(26,16,34,1) 85%,transparent)",
        }}
      >
        <Link
          href="/app/create"
          className="w-full py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold text-base rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:opacity-90"
          style={{
            fontFamily: "var(--font-display), Syne, sans-serif",
            boxShadow: "0 8px 30px rgba(146,19,236,0.55)",
          }}
        >
          Continue with {selected}
          <Icon name="arrow_forward" />
        </Link>
      </div>
    </div>
  );
}
