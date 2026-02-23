"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/mo",
    desc: "Perfect for getting started",
    features: [
      { text: "5 generations/day", check: true },
      { text: "30-second clips", check: true },
      { text: "MP3 export", check: true },
      { text: "Watermark", check: false },
    ],
    cta: "Get Started",
    href: "/app/home",
    primary: false,
    popular: false,
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    desc: "For serious creators",
    features: [
      { text: "Unlimited generations", check: true },
      { text: "Full-length songs", check: true },
      { text: "WAV export", check: true },
      { text: "Commercial license", check: true },
      { text: "Advanced vocal styles", check: true },
    ],
    cta: "Go Pro",
    href: "/app/home",
    primary: true,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For teams & businesses",
    features: [
      { text: "Voice cloning", check: true },
      { text: "Stem export", check: true },
      { text: "API access", check: true },
      { text: "White-label", check: true },
    ],
    cta: "Contact Sales",
    href: "#",
    primary: false,
    popular: false,
  },
];

export function Pricing() {
  return (
    <section className="px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-card border-primary/20 text-primary text-xs font-bold mb-4 tracking-wider">
            PRICING
          </div>
          <h2
            className="text-3xl font-bold"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Simple, transparent pricing
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={
                plan.primary
                  ? "relative p-6 rounded-2xl overflow-hidden"
                  : "glass-card p-6 rounded-2xl"
              }
              style={
                plan.primary
                  ? {
                      background:
                        "linear-gradient(135deg,rgba(146,19,236,0.15),rgba(185,78,245,0.1))",
                      border: "1px solid rgba(146,19,236,0.4)",
                    }
                  : undefined
              }
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 px-2 py-0.5 bg-primary text-white text-xs font-bold rounded-full">
                  POPULAR
                </div>
              )}
              <div
                className={
                  plan.primary
                    ? "text-primary text-sm font-bold uppercase tracking-wider mb-2"
                    : "text-slate-400 text-sm font-bold uppercase tracking-wider mb-2"
                }
              >
                {plan.name}
              </div>
              <div
                className="text-4xl font-bold mb-1"
                style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
              >
                {plan.price}
                <span className="text-lg text-slate-400 font-normal">
                  {plan.period}
                </span>
              </div>
              <p
                className={
                  plan.primary ? "text-slate-400 text-sm mb-6" : "text-slate-500 text-sm mb-6"
                }
              >
                {plan.desc}
              </p>
              <ul className="space-y-2.5 mb-8">
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-center gap-2 text-sm"
                  >
                    {f.check ? (
                      <Icon name="check" className="text-primary" style={{ fontSize: 14 }} />
                    ) : (
                      <Icon name="close" className="text-slate-600" style={{ fontSize: 14 }} />
                    )}
                    {f.text}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.href}
                className={
                  plan.primary
                    ? "w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-light transition-all anim-pulse block text-center"
                    : "w-full py-3 glass border-primary/20 text-white font-bold rounded-xl hover:border-primary/40 transition-all block text-center"
                }
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
