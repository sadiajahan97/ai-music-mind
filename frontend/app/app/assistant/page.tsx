"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

const CHIP_LABELS: Record<string, string> = {
  "More powerful": "Make the chorus more powerful",
  "Summer vibe": "Turn this into a summer vibe",
  "Faster tempo": "Make the tempo faster",
  "More emotional": "Make this more emotional",
};

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm your AI Music Mind assistant. Tell me about the track you want to create, or ask me to refine anything. 🎵",
    },
  ]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I've noted your request. In the full app, I'd adjust the track and regenerate. Try refining with phrases like \"more powerful chorus\" or \"summer vibe\"! 🎶",
        },
      ]);
    }, 800);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-dark">
      <header className="sticky top-0 z-20 glass-dark border-b border-primary/15 px-4 py-3 flex items-center justify-between">
        <Link
          href="/app/player"
          className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center"
        >
          <Icon name="arrow_back" />
        </Link>
        <div className="text-center">
          <h1
            className="font-bold text-base"
            style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}
          >
            AI Music Assistant
          </h1>
          <p className="text-xs text-slate-400">Neon Skyline - Master</p>
        </div>
        <div className="flex gap-1">
          <button className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
            <Icon name="tune" style={{ fontSize: 20 }} />
          </button>
          <button className="size-9 rounded-full hover:bg-primary/10 flex items-center justify-center">
            <Icon name="share" style={{ fontSize: 20 }} />
          </button>
        </div>
      </header>

      <div className="glass-dark border-b border-primary/10 px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-700 flex items-center justify-center shrink-0">
          <Icon name="music_note" className="text-white" style={{ fontSize: 18 }} fill={1} />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ fontFamily: "var(--font-display), Syne, sans-serif" }}>Neon Skyline</p>
          <div className="h-1 bg-primary/20 rounded-full mt-1">
            <div className="h-full bg-primary rounded-full w-[42%]" />
          </div>
        </div>
        <div className="flex gap-1">
          <button className="px-2 py-1 text-[10px] rounded glass text-slate-400">v1</button>
          <button className="px-2 py-1 text-[10px] rounded bg-primary text-white font-bold">v2</button>
        </div>
      </div>

      <div className="px-4 py-2.5 flex gap-2 overflow-x-auto scroll-hide border-b border-primary/10">
        {["More powerful", "Summer vibe", "Faster tempo", "More emotional"].map(
          (label) => (
            <button
              key={label}
              onClick={() => send(CHIP_LABELS[label] || label)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full glass text-xs hover:border-primary/40 transition-all"
            >
              <Icon name="volume_up" className="text-primary" style={{ fontSize: 14 }} />
              <span>{label}</span>
            </button>
          )
        )}
      </div>

      <main
        id="chat-messages"
        className="flex-1 overflow-y-auto scroll-hide px-4 py-4 flex flex-col gap-4 pb-24"
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div
              className={`size-8 rounded-full shrink-0 flex items-center justify-center ${
                msg.role === "assistant"
                  ? "bg-primary"
                  : "bg-bg-surface border border-primary/20"
              }`}
            >
              <Icon
                name={msg.role === "assistant" ? "smart_toy" : "person"}
                className={msg.role === "assistant" ? "text-white" : "text-slate-400"}
                style={{ fontSize: 16 }}
              />
            </div>
            <div
              className={`flex flex-col max-w-[85%] ${
                msg.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <span className="text-xs text-slate-400 mb-1 ml-2">
                {msg.role === "assistant" ? "AI Assistant" : "You"}
              </span>
              <div
                className={
                  msg.role === "user"
                    ? "bg-primary text-white rounded-2xl rounded-br-md px-3.5 py-2.5 text-sm max-w-[80%] leading-relaxed"
                    : "bg-primary/10 border border-primary/20 rounded-2xl rounded-bl-md px-3.5 py-2.5 text-sm max-w-[86%] leading-relaxed"
                }
              >
                {msg.content}
              </div>
            </div>
          </div>
        ))}
      </main>

      <div className="glass-dark border-t border-primary/15 px-4 py-3 fixed bottom-0 left-0 right-0 max-w-[393px] mx-auto">
        <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/20 rounded-xl px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask AI to refine your track..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-slate-500"
          />
          <button
            onClick={() => send(input)}
            className="size-9 rounded-lg bg-primary flex items-center justify-center text-white hover:bg-primary-light transition-colors shrink-0"
          >
            <Icon name="send" style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>
    </div>
  );
}
