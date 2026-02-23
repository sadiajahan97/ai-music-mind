"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

export default function SignInPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  const doSignIn = () => {
    router.push("/app/home");
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center relative overflow-hidden py-8 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-32 right-0 w-60 h-60 bg-pink-600/10 blur-[90px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <div className="flex flex-col items-center pt-8 pb-6">
          <div className="bg-linear-to-br from-primary-light to-primary p-4 rounded-2xl shadow-2xl shadow-primary/50 mb-5 anim-float">
            <Icon
              name="graphic_eq"
              className="text-white"
              style={{ fontSize: 36 }}
              fill={1}
            />
          </div>
          <h1
            className="font-extrabold text-3xl tracking-tight mb-1"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            AI Music Mind
          </h1>
          <p className="text-slate-400 text-sm">
            Create studio-ready tracks with AI
          </p>
        </div>

        <div className="w-full glass rounded-2xl p-6">
        <div
          id="auth-tabs"
          className="flex p-1 rounded-xl mb-6"
          style={{
            background: "rgba(146,19,236,0.1)",
            border: "1px solid rgba(146,19,236,0.15)",
          }}
        >
          <button
            onClick={() => setTab("signin")}
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${
              tab === "signin"
                ? "bg-primary text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab("signup")}
            className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
              tab === "signup"
                ? "bg-primary text-white shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            Sign Up
          </button>
        </div>

        {tab === "signin" && (
          <div id="signin-form">
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(146,19,236,0.06)",
                    border: "1px solid rgba(146,19,236,0.2)",
                  }}
                >
                  <Icon
                    name="mail"
                    className="text-primary"
                    style={{ fontSize: 18 }}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(146,19,236,0.06)",
                    border: "1px solid rgba(146,19,236,0.2)",
                  }}
                >
                  <Icon
                    name="lock"
                    className="text-primary"
                    style={{ fontSize: 18 }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button className="text-xs text-primary hover:text-primary-light transition-colors font-medium">
                  Forgot password?
                </button>
              </div>
            </div>
            <button
              onClick={doSignIn}
              className="w-full py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-xl mb-4 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                boxShadow: "0 6px 24px rgba(146,19,236,0.5)",
              }}
            >
              Sign In
            </button>
          </div>
        )}

        {tab === "signup" && (
          <div id="signup-form">
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Full Name
                </label>
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(146,19,236,0.06)",
                    border: "1px solid rgba(146,19,236,0.2)",
                  }}
                >
                  <Icon
                    name="person"
                    className="text-primary"
                    style={{ fontSize: 18 }}
                  />
                  <input
                    type="text"
                    placeholder="Your name"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Email
                </label>
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(146,19,236,0.06)",
                    border: "1px solid rgba(146,19,236,0.2)",
                  }}
                >
                  <Icon
                    name="mail"
                    className="text-primary"
                    style={{ fontSize: 18 }}
                  />
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">
                  Password
                </label>
                <div
                  className="flex items-center gap-2.5 px-4 py-3 rounded-xl"
                  style={{
                    background: "rgba(146,19,236,0.06)",
                    border: "1px solid rgba(146,19,236,0.2)",
                  }}
                >
                  <Icon
                    name="lock"
                    className="text-primary"
                    style={{ fontSize: 18 }}
                  />
                  <input
                    type="password"
                    placeholder="Min 8 characters"
                    className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
                  />
                </div>
              </div>
            </div>
            <button
              onClick={doSignIn}
              className="w-full py-4 bg-linear-to-r from-primary to-primary-light text-white font-bold rounded-xl mb-4 transition-all hover:opacity-90 active:scale-[0.98]"
              style={{
                fontFamily: "var(--font-display), Syne, sans-serif",
                boxShadow: "0 6px 24px rgba(146,19,236,0.5)",
              }}
            >
              Create Account
            </button>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-primary/15" />
          <span className="text-slate-500 text-xs">or continue with</span>
          <div className="flex-1 h-px bg-primary/15" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={doSignIn}
            className="flex items-center justify-center gap-2.5 py-3 rounded-xl glass hover:border-primary/40 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M5.26 9.77A7.24 7.24 0 0 1 12 4.75c1.73 0 3.29.64 4.5 1.68l3.35-3.35A11.93 11.93 0 0 0 12 .75C7.37.75 3.37 3.27 1.38 6.98l3.88 2.79z"
              />
              <path
                fill="#34A853"
                d="M16.01 19.25a7.25 7.25 0 0 1-4.01 1.25 7.24 7.24 0 0 1-6.73-4.55l-3.88 2.79A11.95 11.95 0 0 0 12 23.25c3.1 0 5.93-1.17 8.07-3.08l-4.06-2.92z"
              />
              <path
                fill="#FBBC04"
                d="M1.38 17.74A11.93 11.93 0 0 1 .75 12c0-2 .49-3.88 1.35-5.55l3.16 2.32A7.23 7.23 0 0 0 4.75 12c0 1.35.37 2.62 1.01 3.69l-4.38 2.05z"
              />
              <path
                fill="#4285F4"
                d="M23.25 12c0-.79-.08-1.55-.2-2.3H12v4.36h6.32a5.4 5.4 0 0 1-2.31 3.54l4.06 2.92C21.89 18.73 23.25 15.57 23.25 12z"
              />
            </svg>
            <span className="text-sm font-medium">Google</span>
          </button>
          <button
            onClick={doSignIn}
            className="flex items-center justify-center gap-2.5 py-3 rounded-xl glass hover:border-primary/40 transition-all"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.42.07 2.4.83 3.22.84.82 0 2.35-1.03 3.97-.88 1.68.17 2.94.97 3.74 2.44-3.41 2.04-2.85 6.56.74 7.84-.4 1.08-.92 2.15-1.67 2.64zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span className="text-sm font-medium">Apple</span>
          </button>
        </div>
        </div>

        <div className="text-center mt-6 pb-8 w-full">
          <p className="text-slate-500 text-xs">
            By signing in you agree to our{" "}
            <span className="text-primary">Terms</span> &{" "}
            <span className="text-primary">Privacy Policy</span>
          </p>
          <Link
            href="/"
            className="mt-3 text-xs text-slate-600 hover:text-slate-400 transition-colors inline-block"
          >
            ← Back to Landing Page
          </Link>
        </div>
      </div>
    </div>
  );
}
