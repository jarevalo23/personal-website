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
      className="intro-splash fixed inset-0 z-[90] flex cursor-pointer flex-col overflow-hidden bg-ink-950"
      data-accent="soccer"
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
      {/* diagonal stripes */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            "repeating-linear-gradient(115deg, transparent 0 60px, color-mix(in oklab, var(--accent) 6%, transparent) 60px 120px)",
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at 30% 50%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 60%)",
        }}
        aria-hidden="true"
      />
      <p
        className="font-display text-outline pointer-events-none absolute -right-[4vw] bottom-[-6vw] select-none text-[46vw] leading-none text-white/[0.07]"
        aria-hidden="true"
      >
        {profile.jerseyNumber}
      </p>

      <div className="relative flex items-center gap-2 px-6 pt-6 text-xs font-bold uppercase tracking-[0.3em] text-accent sm:px-10 sm:pt-8">
        <span className="blink inline-block h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        Player loading
      </div>

      <div className="relative flex flex-1 flex-col justify-center px-6 sm:px-10">
        <p
          className="intro-slide text-sm font-semibold uppercase tracking-[0.35em] text-mist"
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
          className="intro-slide font-display glow-text -mt-[2vw] text-[22vw] text-accent sm:text-[15vw] lg:-mt-6 lg:text-[11rem]"
          style={{ "--delay": "220ms" } as React.CSSProperties}
        >
          {profile.lastName}
        </p>
        <div
          className="intro-slide mt-6 flex flex-wrap gap-2 text-sm font-bold uppercase tracking-[0.2em]"
          style={{ "--delay": "340ms" } as React.CSSProperties}
        >
          <span className="rounded-md bg-accent px-3 py-1.5 text-accent-ink">#{profile.jerseyNumber}</span>
          <span className="rounded-md border border-white/20 px-3 py-1.5">{profile.card.position}</span>
          <span className="rounded-md border border-white/20 px-3 py-1.5">{profile.card.role}</span>
          <span className="rounded-md border border-white/20 px-3 py-1.5">OVR {profile.card.rating}</span>
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
          className="shrink-0 text-xs font-bold uppercase tracking-[0.25em] text-mist hover:text-fog"
        >
          <span className="hidden sm:inline">Press any key to </span>Skip
        </button>
      </div>
    </m.div>
  );
}
