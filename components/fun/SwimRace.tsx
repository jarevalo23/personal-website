"use client";

import { animate, m, useMotionValue, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useSound } from "@/components/providers/SoundProvider";
import { usePersistentNumber } from "@/lib/usePersistentNumber";

type Phase = "ready" | "marks" | "go" | "racing" | "results";

type Swimmer = {
  lane: number;
  name: string;
  isYou: boolean;
  reaction: number | null;
  /** Official race time in seconds (reaction + swim). */
  total: number | null;
  falseStart?: boolean;
};

const AI_NAMES = ["Turbo Tuna", "Bot Shark", "Captain Splash"];
const YOUR_LANE = 4;
const FALSE_START_PENALTY = 1.0;
const LATE_LIMIT = 3.0;
/** Real-time seconds per race second for the visual race. */
const TIME_SCALE = 0.16;
const BEST_KEY = "swim-best-reaction";

/** Monotonic clock — only ever called from event handlers and timers. */
const now = () => performance.now();

const fmt = (s: number) => s.toFixed(2);

function freshField(): Swimmer[] {
  return [1, 2, 3, 4].map((lane) => ({
    lane,
    name: lane === YOUR_LANE ? "You" : AI_NAMES[lane - 1],
    isYou: lane === YOUR_LANE,
    reaction: null,
    total: null,
  }));
}

function SwimmerIcon({ progress, swimming, isYou }: { progress: MotionValue<number>; swimming: boolean; isYou: boolean }) {
  const left = useTransform(progress, (p) => `calc(${p * 100}% - ${p * 44}px)`);
  return (
    <m.div className="absolute top-1/2 h-8 w-11 -translate-y-1/2" style={{ left }}>
      {swimming && (
        <span className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2" aria-hidden="true">
          <span className="ripple-ring absolute inset-0 rounded-full border-2 border-white/50" />
          <span className="ripple-ring absolute inset-0 rounded-full border-2 border-white/40 [animation-delay:0.5s]" />
        </span>
      )}
      <svg viewBox="0 0 44 32" className="h-full w-full" aria-hidden="true">
        <ellipse cx="18" cy="16" rx="14" ry="6" fill={isYou ? "#2ee6ff" : "#a9b4d6"} />
        <g
          className={swimming ? "swim-stroke" : undefined}
          stroke={isYou ? "#2ee6ff" : "#a9b4d6"}
          strokeWidth="3.5"
          strokeLinecap="round"
        >
          <path d="M26 12 L38 4" />
          <path d="M26 20 L38 28" className="swim-stroke-b" />
        </g>
        <circle cx="35" cy="16" r="6" fill={isYou ? "#eef2ff" : "#1d2a52"} stroke="#04060d" strokeWidth="1.5" />
        <path d="M35 11 v10" stroke={isYou ? "#ff4d5e" : "#ffd23f"} strokeWidth="3" />
      </svg>
    </m.div>
  );
}

/** 50m swim start: react to the signal, race three AI lanes, don't false start. */
export function SwimRace() {
  const { play } = useSound();
  const reduceMotion = useReducedMotion();
  const [best, saveBest] = usePersistentNumber(BEST_KEY);

  const [phase, setPhase] = useState<Phase>("ready");
  const [field, setField] = useState<Swimmer[]>(freshField);
  const [diving, setDiving] = useState<number[]>([]);

  const p1 = useMotionValue(0);
  const p2 = useMotionValue(0);
  const p3 = useMotionValue(0);
  const p4 = useMotionValue(0);
  const progress = [p1, p2, p3, p4];

  const goAt = useRef(0);
  const timers = useRef<number[]>([]);
  const userDived = useRef(false);
  const fieldRef = useRef<Swimmer[]>(field);
  const goButton = useRef<HTMLButtonElement>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  // Put focus on the big GO button as soon as the swimmers are on the blocks.
  useEffect(() => {
    if (phase === "marks") goButton.current?.focus();
  }, [phase]);

  const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));

  /** Start one swimmer: dive now, touch the wall at TIME_SCALE × official time. */
  const dive = (lane: number, reaction: number, total: number) => {
    const elapsed = (now() - goAt.current) / 1000;
    const finishAt = total * TIME_SCALE;
    const duration = reduceMotion ? 0 : Math.max(0.2, finishAt - elapsed);
    setDiving((d) => [...d, lane]);
    if (lane === YOUR_LANE) play("splash");
    void animate(progress[lane - 1], [0, 0.14, 1], { duration, times: [0, 0.12, 1], ease: "linear" });
  };

  const startSignal = () => {
    goAt.current = now();
    setPhase("go");
    play("start");
    // AI swimmers react between 0.14s and 0.32s, then swim 21.3–22.5s.
    const updated = fieldRef.current.map((s) => {
      if (s.isYou) return s;
      const reaction = 0.14 + Math.random() * 0.18;
      const total = reaction + 21.3 + Math.random() * 1.2;
      later(() => dive(s.lane, reaction, total), reaction * 1000);
      return { ...s, reaction, total };
    });
    fieldRef.current = updated;
    setField(updated);
    // Nobody home? Push the user in after the limit.
    later(() => {
      if (!userDived.current) userGo(LATE_LIMIT);
    }, LATE_LIMIT * 1000);
  };

  const finishRace = () => {
    setPhase("results");
    const you = fieldRef.current.find((s) => s.isYou);
    const place = [...fieldRef.current].sort((a, b) => (a.total ?? 99) - (b.total ?? 99)).findIndex((s) => s.isYou) + 1;
    play(place === 1 ? "success" : "beep");
    if (you?.reaction != null && !you.falseStart && you.reaction < LATE_LIMIT) {
      let previous = Infinity;
      try {
        previous = Number(localStorage.getItem(BEST_KEY) ?? Infinity);
      } catch {
        // No storage: treat as no previous best.
      }
      if (you.reaction < previous) saveBest(Number(you.reaction.toFixed(3)));
    }
  };

  const userGo = (forcedReaction?: number, falseStart = false) => {
    if (userDived.current) return;
    userDived.current = true;
    const reaction = forcedReaction ?? (now() - goAt.current) / 1000;
    const total = reaction + 21.6 + Math.random() * 0.35;
    const updated = fieldRef.current.map((s) => (s.isYou ? { ...s, reaction, total, falseStart } : s));
    fieldRef.current = updated;
    setField(updated);
    setPhase("racing");
    const startIn = falseStart ? FALSE_START_PENALTY * 1000 : 0;
    later(() => dive(YOUR_LANE, reaction, total), startIn);
    const slowest = Math.max(...updated.map((s) => s.total ?? 0));
    const endMs = reduceMotion ? startIn + 300 : slowest * TIME_SCALE * 1000 + 600;
    later(finishRace, Math.max(endMs - (now() - goAt.current), startIn + 300));
  };

  const takeYourMarks = () => {
    clearTimers();
    [p1, p2, p3, p4].forEach((p) => p.set(0));
    userDived.current = false;
    const reset = freshField();
    fieldRef.current = reset;
    setField(reset);
    setDiving([]);
    setPhase("marks");
    play("beep");
    later(startSignal, 1500 + Math.random() * 2000);
  };

  const pressGo = () => {
    if (phase === "marks") {
      // False start! The signal fires now and you're held on the block.
      clearTimers();
      play("buzzer");
      startSignal();
      userGo(FALSE_START_PENALTY, true);
    } else if (phase === "go") {
      userGo();
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === " " || e.key === "Enter") && (phase === "marks" || phase === "go")) {
      e.preventDefault();
      pressGo();
    }
  };

  const you = field.find((s) => s.isYou)!;
  const standings = [...field].sort((a, b) => (a.total ?? 99) - (b.total ?? 99));
  const lightColor = phase === "go" || phase === "racing" ? "bg-pitch" : phase === "marks" ? "bg-redcard" : "bg-white/15";

  return (
    <section
      id="swim-race"
      aria-labelledby="race-title"
      className="scroll-mt-28 panel panel-accent overflow-hidden"
      onKeyDown={onKeyDown}
    >
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Mini-game · optional</p>
          <h2 id="race-title" className="font-display text-4xl">
            50m Free — Reaction Start
          </h2>
        </div>
        <div className="rounded-lg bg-ink-950/80 px-3 py-1.5 text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-mist">Best reaction</p>
          <p className="font-display text-3xl leading-none tabular-nums text-press">{best != null ? `${fmt(best)}s` : "–"}</p>
        </div>
      </div>

      {/* Pool */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#06456a] to-[#03304d]">
        <div className="caustics" aria-hidden="true" />
        <div className="relative">
          {field.map((s, i) => (
            <div key={s.lane} className={`relative flex h-14 items-center sm:h-16 ${s.isYou ? "bg-pool/[0.12]" : ""}`}>
              {/* start block */}
              <div className="z-10 flex h-full w-14 shrink-0 flex-col items-center justify-center border-r-4 border-white/40 bg-ink-950/60 sm:w-20">
                <span className="font-display text-2xl leading-none">{s.lane}</span>
                <span className={`text-xs font-bold uppercase tracking-wider ${s.isYou ? "text-accent" : "text-mist"}`}>
                  {s.isYou ? "You" : "CPU"}
                </span>
              </div>
              <div className="relative mx-2 h-full flex-1">
                <div className="absolute inset-x-6 top-1/2 h-1 -translate-y-1/2 rounded-full bg-ink-950/30" aria-hidden="true" />
                <SwimmerIcon progress={progress[i]} swimming={diving.includes(s.lane) && phase !== "results"} isYou={s.isYou} />
              </div>
              <div className="h-full w-2 shrink-0 bg-press/70" aria-hidden="true" />
              {i < field.length - 1 && (
                <div
                  className="absolute inset-x-0 bottom-0 h-1.5"
                  style={{
                    background:
                      "repeating-linear-gradient(90deg, #ff4d5e 0 8px, #eef2ff 8px 16px, #2ee6ff 16px 24px, #eef2ff 24px 32px)",
                  }}
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>

        {/* results scoreboard */}
        {phase === "results" && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-ink-950/80 p-3 backdrop-blur-sm">
            <div className="w-full max-w-lg">
              <p className="mb-2 text-center text-xs font-bold uppercase tracking-wider text-accent">Official results</p>
              <table className="w-full text-left text-sm tabular-nums">
                <thead className="text-xs uppercase tracking-wider text-mist">
                  <tr>
                    <th className="py-1 pr-2 font-bold">Pl</th>
                    <th className="py-1 pr-2 font-bold">Ln</th>
                    <th className="py-1 pr-2 font-bold">Swimmer</th>
                    <th className="py-1 pr-2 text-right font-bold">RT</th>
                    <th className="py-1 text-right font-bold">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {standings.map((s, i) => (
                    <tr key={s.lane} className={`border-t border-white/10 ${s.isYou ? "font-bold text-accent" : ""}`}>
                      <td className="py-1.5 pr-2">{["🥇", "🥈", "🥉"][i] ?? i + 1}</td>
                      <td className="py-1.5 pr-2">{s.lane}</td>
                      <td className="py-1.5 pr-2">{s.name}</td>
                      <td className={`py-1.5 pr-2 text-right ${s.falseStart ? "text-redcard" : ""}`}>
                        {s.falseStart ? "FS" : s.reaction != null ? fmt(s.reaction) : "–"}
                      </td>
                      <td className="py-1.5 text-right font-display text-lg">{s.total != null ? fmt(s.total) : "–"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3">
          <span className={`h-6 w-6 shrink-0 rounded-full transition-colors ${lightColor}`} aria-hidden="true" />
          <p className="text-sm" role="status" aria-live="assertive">
            {phase === "ready" && "Press “Take your marks”, then hit GO the instant the light turns green."}
            {phase === "marks" && <strong className="text-redcard">Take your marks… wait for green!</strong>}
            {phase === "go" && <strong className="text-pitch">GO! GO! GO!</strong>}
            {phase === "racing" &&
              (you.falseStart ? (
                <strong className="text-redcard">False start! +{FALSE_START_PENALTY.toFixed(2)}s penalty</strong>
              ) : (
                <span>
                  Reaction <strong className="text-accent">{fmt(you.reaction ?? 0)}s</strong>
                  {(you.reaction ?? 1) < 0.2
                    ? " — lightning!"
                    : (you.reaction ?? 0) >= LATE_LIMIT
                      ? " — asleep on the blocks"
                      : ""}
                </span>
              ))}
            {phase === "results" &&
              `You finished ${["1st", "2nd", "3rd", "4th"][standings.findIndex((s) => s.isYou)]} in ${fmt(you.total ?? 0)}s${
                you.falseStart ? " (false start)" : `, reaction ${fmt(you.reaction ?? 0)}s`
              }.`}
          </p>
        </div>
        {phase === "ready" || phase === "results" ? (
          <button type="button" className="btn-game sm:min-w-56" onClick={takeYourMarks}>
            {phase === "ready" ? "Take your marks" : "Race again"}
          </button>
        ) : (
          <button
            ref={goButton}
            type="button"
            className="btn-game touch-manipulation py-4 text-3xl sm:min-w-56"
            onPointerDown={(e) => {
              e.preventDefault();
              pressGo();
            }}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                pressGo();
              }
            }}
            aria-disabled={phase === "racing"}
          >
            GO!
          </button>
        )}
      </div>
    </section>
  );
}
