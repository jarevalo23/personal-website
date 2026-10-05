"use client";

import { m } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

const DURATION = 1500;

/**
 * "Player loading" intro card. Server-rendered so it paints instantly; an inline
 * script in <head> hides it before paint if it was already seen this session.
 */
export function IntroSplash() {
  const [phase, setPhase] = useState<"show" | "exit" | "done">("show");

  const finishRef = useRef<() => void>(() => {});

  useEffect(() => {
    const html = document.documentElement;
    if (html.hasAttribute("data-intro-skip") || html.hasAttribute("data-intro-done")) return;

    let finished = false;
    const onKey = (e: KeyboardEvent) => {
      // Swallow the key so it doesn't also move the menu selection.
      e.preventDefault();
      e.stopImmediatePropagation();
      finish();
    };
    const timer = window.setTimeout(() => finish(), DURATION);
    const cleanup = () => {
      window.clearTimeout(timer);
      window.removeEventListener("keydown", onKey, { capture: true });
    };
    const finish = () => {
      if (finished) return;
      finished = true;
      cleanup();
      html.classList.add("intro-played");
      setPhase("exit");
    };
    finishRef.current = finish;
    window.addEventListener("keydown", onKey, { capture: true });
    return cleanup;
  }, []);

  if (phase === "done") return null;

  return (
    <m.div
      className="intro-splash scene-base fixed inset-0 z-[90] flex cursor-pointer flex-col overflow-hidden"
      data-accent="menu"
      animate={phase === "exit" ? { y: "-100%" } : { y: "0%" }}
      transition={{ duration: 0.55, ease: [0.7, 0, 0.3, 1] }}
      onAnimationComplete={() => {
        if (phase !== "exit") return;
        document.documentElement.setAttribute("data-intro-done", "");
        setPhase("done");
      }}
      onClick={() => finishRef.current()}
      role="presentation"
    >
      {/* brush-stroke shards */}
      <svg className="absolute -right-10 top-0 h-full w-auto opacity-90" viewBox="0 0 600 900" aria-hidden="true">
        <polygon points="120,0 600,0 600,60 40,260" fill="#ff5bd6" opacity="0.75" />
        <polygon points="260,200 600,90 600,150 220,330" fill="#48e9ff" opacity="0.7" />
        <polygon points="300,330 600,250 600,262 300,345" fill="#fff" opacity="0.6" />
        <polygon points="200,420 600,300 600,380 160,560" fill="#8d5bff" opacity="0.8" />
      </svg>
      <p
        className="font-display text-outline pointer-events-none absolute -right-[4vw] bottom-[-6vw] select-none text-[46vw] leading-none text-white/[0.07]"
        aria-hidden="true"
      >
        {profile.jerseyNumber}
      </p>

      <div className="relative flex items-center gap-2 px-6 pt-6 text-sm font-semibold uppercase tracking-wider text-fog sm:px-10 sm:pt-8">
        <span className="blink inline-block h-2 w-2 rounded-full bg-[#ff5bd6]" aria-hidden="true" />
        Player loading
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6 sm:px-10">
        <p
          className="intro-slide text-base font-semibold uppercase tracking-wider text-fog/80"
          style={{ "--delay": "50ms" } as React.CSSProperties}
        >
          Now entering the pitch
        </p>
        <p
          className="intro-slide font-display text-outline mt-2 text-[22vw] text-fog sm:text-[15vw] lg:text-[11rem]"
          style={{ "--delay": "120ms" } as React.CSSProperties}
        >
          {profile.firstName}
        </p>
        <p
          className="intro-slide font-display -mt-[2vw] text-[22vw] text-fog sm:text-[15vw] lg:-mt-6 lg:text-[11rem]"
          style={{ "--delay": "220ms" } as React.CSSProperties}
        >
          {profile.lastName}
        </p>
        <div
          className="intro-slide font-display mt-6 flex flex-wrap gap-2 text-xl"
          style={{ "--delay": "340ms" } as React.CSSProperties}
        >
          <span className="bg-[#ff5bd6] px-3 py-1 text-ink-950">#{profile.jerseyNumber}</span>
          <span className="border border-white/40 px-3 py-1">{profile.card.position}</span>
          <span className="border border-white/40 px-3 py-1">{profile.card.role}</span>
          <span className="border border-white/40 px-3 py-1">OVR {profile.card.rating}</span>
        </div>
      </div>

      <div className="relative flex items-center gap-4 px-6 pb-8 sm:px-10">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="intro-progress h-full rounded-full bg-accent" />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            finishRef.current();
          }}
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-fog/90 hover:text-fog"
        >
          <span className="hidden sm:inline">Press any key to </span>Skip
        </button>
      </div>
    </m.div>
  );
}
