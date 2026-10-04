"use client";

import { animate, m, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useSound } from "@/components/providers/SoundProvider";
import { usePersistentNumber } from "@/lib/usePersistentNumber";

/* ── Scene geometry (SVG user units, viewBox 600×330) ───────────────────── */
const START = { x: 118, y: 176 };
const RIM_Y = 150;
const HOOP_X = 493;
const FLOOR_Y = 286;
const ARC_HEIGHT = 135;

/** Perfect release power (0–1) and how forgiving each outcome is. */
const SWEET = 0.68;
const WINDOWS = { swish: 0.04, rimIn: 0.08, rimOut: 0.13 };
/** Time for the meter to go from empty to full while holding. */
const CHARGE_MS = 1300;
const ROUND_SECONDS = 24;
const BEST_KEY = "free-throw-best";

type Result = "swish" | "rim-in" | "rim-out" | "airball" | "brick";
type Phase = "idle" | "charging" | "flying" | "over";

const RESULT_TEXT: Record<Result, { title: string; made: boolean }> = {
  swish: { title: "Swish!", made: true },
  "rim-in": { title: "Rattled in!", made: true },
  "rim-out": { title: "Rimmed out", made: false },
  airball: { title: "Air ball!", made: false },
  brick: { title: "Brick!", made: false },
};

/** Monotonic clock — only ever called from event handlers and timers. */
const now = () => performance.now();

/** Power ping-pongs 0 → 1 → 0 while the button is held. */
const powerAt = (elapsedMs: number) => {
  const t = (elapsedMs / CHARGE_MS) % 2;
  return t <= 1 ? t : 2 - t;
};

function classify(power: number): { result: Result; offset: number } {
  const delta = power - SWEET;
  const a = Math.abs(delta);
  const result: Result =
    a <= WINDOWS.swish
      ? "swish"
      : a <= WINDOWS.rimIn
        ? "rim-in"
        : a <= WINDOWS.rimOut
          ? "rim-out"
          : delta < 0
            ? "airball"
            : "brick";
  return { result, offset: delta * 180 };
}

function Ball() {
  return (
    <g>
      <circle r="12" fill="#ff8a1f" stroke="#3b1a00" strokeWidth="1.5" />
      <g fill="none" stroke="#3b1a00" strokeWidth="1.4">
        <path d="M-12 0 H12 M0 -12 V12" />
        <path d="M-8 -9 Q-2 0 -8 9 M8 -9 Q2 0 8 9" />
      </g>
    </g>
  );
}

/** Free-throw challenge: hold to charge, release in the sweet spot, beat the shot clock. */
export function FreeThrowGame() {
  const { play } = useSound();
  const reduceMotion = useReducedMotion();
  const [best, saveBest] = usePersistentNumber(BEST_KEY);

  const [phase, setPhase] = useState<Phase>("idle");
  const [made, setMade] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [streak, setStreak] = useState(0);
  const [banner, setBanner] = useState<{ text: string; made: boolean; id: number } | null>(null);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);
  const [running, setRunning] = useState(false);
  const [netKey, setNetKey] = useState(0);

  const ballX = useMotionValue(START.x);
  const ballY = useMotionValue(START.y);
  const ballRot = useMotionValue(0);
  const power = useMotionValue(0);

  const chargeStart = useRef(0);
  const raf = useRef(0);
  const endAt = useRef(0);
  const flying = useRef(false);
  const roundOver = useRef(false);
  const madeRef = useRef(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => {
      cancelAnimationFrame(raf.current);
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const finishRound = () => {
    setPhase("over");
    play("buzzer");
    let previous = 0;
    try {
      previous = Number(localStorage.getItem(BEST_KEY) ?? 0);
    } catch {
      // No storage: treat as no previous best.
    }
    if (madeRef.current > previous) saveBest(madeRef.current);
  };

  // Shot clock.
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      const left = Math.max(0, (endAt.current - now()) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        window.clearInterval(id);
        setRunning(false);
        roundOver.current = true;
        if (!flying.current) finishRound();
      }
    }, 100);
    return () => window.clearInterval(id);
    // finishRound only touches refs/setters, so a stale copy is fine here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const startCharge = () => {
    if (phase !== "idle") return;
    if (!running) {
      endAt.current = now() + ROUND_SECONDS * 1000;
      setTimeLeft(ROUND_SECONDS);
      setRunning(true);
    }
    chargeStart.current = now();
    setPhase("charging");
    const tick = () => {
      power.set(powerAt(now() - chargeStart.current));
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  const release = () => {
    if (phase !== "charging") return;
    cancelAnimationFrame(raf.current);
    const p = powerAt(now() - chargeStart.current);
    power.set(p);
    void shoot(p);
  };

  const shoot = async (p: number) => {
    setPhase("flying");
    flying.current = true;
    const { result, offset } = classify(p);
    const speed = reduceMotion ? 0 : 1;
    const endX = Math.min(HOOP_X + offset, 522);

    // Sample the parabola so x moves linearly while y arcs.
    const N = 14;
    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      xs.push(START.x + (endX - START.x) * t);
      ys.push(START.y + (RIM_Y - START.y) * t - ARC_HEIGHT * 4 * t * (1 - t));
    }
    await Promise.all([
      animate(ballX, xs, { duration: 0.85 * speed, ease: "linear" }),
      animate(ballY, ys, { duration: 0.85 * speed, ease: "linear" }),
      animate(ballRot, -540, { duration: 0.85 * speed, ease: "linear" }),
    ]);

    if (result === "swish") {
      play("swish");
      setNetKey((k) => k + 1);
      await animate(ballY, RIM_Y + 70, { duration: 0.3 * speed, ease: "easeIn" });
    } else if (result === "rim-in") {
      play("rim");
      await Promise.all([
        animate(ballY, [RIM_Y, RIM_Y - 22, RIM_Y + 70], { duration: 0.55 * speed, ease: "easeInOut" }),
        animate(ballX, [endX, (endX + HOOP_X) / 2, HOOP_X], { duration: 0.55 * speed }),
      ]);
      play("swish");
      setNetKey((k) => k + 1);
    } else if (result === "rim-out") {
      play("rim");
      const dir = offset < 0 ? -1 : 1;
      await Promise.all([
        animate(ballX, endX + dir * 60, { duration: 0.55 * speed, ease: "easeOut" }),
        animate(ballY, [RIM_Y, RIM_Y - 30, FLOOR_Y - 12], { duration: 0.55 * speed, ease: "easeIn" }),
      ]);
      play("bounce");
    } else if (result === "airball") {
      await Promise.all([
        animate(ballX, endX + 45, { duration: 0.35 * speed }),
        animate(ballY, FLOOR_Y - 12, { duration: 0.35 * speed, ease: "easeIn" }),
      ]);
      play("bounce");
    } else {
      play("rim");
      await Promise.all([
        animate(ballX, 430, { duration: 0.55 * speed, ease: "easeOut" }),
        animate(ballY, [ballY.get(), RIM_Y - 25, FLOOR_Y - 12], { duration: 0.55 * speed, ease: "easeIn" }),
      ]);
      play("bounce");
    }

    const isMade = RESULT_TEXT[result].made;
    if (isMade) madeRef.current += 1;
    setMade(madeRef.current);
    setAttempts((a) => a + 1);
    setStreak((s) => (isMade ? s + 1 : 0));
    setBanner({ text: RESULT_TEXT[result].title, made: isMade, id: now() });

    timers.current.push(
      window.setTimeout(() => {
        ballX.set(START.x);
        ballY.set(START.y);
        ballRot.set(0);
        power.set(0);
        flying.current = false;
        if (roundOver.current) finishRound();
        else setPhase("idle");
      }, 650),
    );
  };

  const playAgain = () => {
    madeRef.current = 0;
    roundOver.current = false;
    setMade(0);
    setAttempts(0);
    setStreak(0);
    setBanner(null);
    setTimeLeft(ROUND_SECONDS);
    setPhase("idle");
  };

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    startCharge();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    if (!e.repeat) startCharge();
  };
  const onKeyUp = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    release();
  };

  const clock = timeLeft >= 5 ? Math.ceil(timeLeft).toString() : timeLeft.toFixed(1);

  return (
    <section aria-labelledby="ft-title" className="panel panel-accent mt-6 overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">Mini-game · optional</p>
          <h2 id="ft-title" className="font-display text-4xl">
            Free-Throw Challenge
          </h2>
        </div>
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="relative">
          <svg viewBox="0 0 600 330" className="block h-auto w-full select-none" aria-hidden="true">
            <defs>
              <linearGradient id="ft-arena" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#07091a" />
                <stop offset="1" stopColor="#1a0f08" />
              </linearGradient>
              <radialGradient id="ft-spot" cx="0.8" cy="0.2" r="0.6">
                <stop offset="0" stopColor="#ff8a1f" stopOpacity="0.25" />
                <stop offset="1" stopColor="#ff8a1f" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="600" height="330" fill="url(#ft-arena)" />
            <rect width="600" height="330" fill="url(#ft-spot)" />
            {/* floor */}
            <rect y={FLOOR_Y} width="600" height={330 - FLOOR_Y} fill="#3a2210" />
            {Array.from({ length: 15 }, (_, i) => (
              <rect key={i} x={i * 40} y={FLOOR_Y} width="1.5" height={330 - FLOOR_Y} fill="#ff8a1f" fillOpacity="0.12" />
            ))}
            <rect y={FLOOR_Y} width="600" height="3" fill="#ffb066" fillOpacity="0.6" />
            <rect x="60" y={FLOOR_Y} width="4" height="44" fill="#eef2ff" fillOpacity="0.7" />

            {/* stanchion + backboard */}
            <path d="M534 112 H578 V286" fill="none" stroke="#2a3150" strokeWidth="8" />
            <rect x="526" y="72" width="8" height="98" rx="2" fill="#eef2ff" fillOpacity="0.92" />
            <rect x="522" y="118" width="4" height="30" fill="#ff8a1f" fillOpacity="0.8" />
            {/* net */}
            <m.g
              key={netKey}
              style={{ originY: 0 }}
              animate={netKey ? { scaleY: [1, 1.35, 0.9, 1.05, 1], scaleX: [1, 0.85, 1.05, 1] } : undefined}
              transition={{ duration: 0.6 }}
            >
              <g fill="none" stroke="#eef2ff" strokeOpacity="0.85" strokeWidth="1.6">
                <path d="M470 150 L479 193 M481 150 L485 195 M493 150 L493 196 M505 150 L501 195 M516 150 L507 193" />
                <path d="M470 150 L485 168 L470 150 M481 150 L470 150 M475 172 L493 162 L511 172 M479 190 L493 182 L507 190" />
                <path d="M479 193 Q493 199 507 193" />
              </g>
            </m.g>
            {/* rim */}
            <path d="M468 150 H520" stroke="#ff8a1f" strokeWidth="5" strokeLinecap="round" />

            {/* shooter */}
            <g className={phase === "charging" ? "shooter-crouch" : undefined}>
              <path d="M84 286 L92 246 M104 286 L100 246" stroke="#0c1328" strokeWidth="10" strokeLinecap="round" />
              <path d="M80 286 h-8 M108 286 h8" stroke="#eef2ff" strokeWidth="6" strokeLinecap="round" />
              <rect x="83" y="230" width="26" height="20" rx="4" fill="#0c1328" />
              <rect x="82" y="196" width="28" height="40" rx="9" fill="#ff8a1f" />
              <text x="96" y="223" textAnchor="middle" fontSize="16" fill="#1f0d00" fontFamily="var(--font-display)">
                23
              </text>
              <path d="M104 202 L114 186 M90 202 L108 180" stroke="#ff8a1f" strokeWidth="7" strokeLinecap="round" />
              <circle cx="96" cy="184" r="11" fill="#1d2a52" stroke="#eef2ff" strokeOpacity="0.4" strokeWidth="2" />
            </g>

            {/* ball + shadow */}
            <m.ellipse cx="0" cy={FLOOR_Y + 2} rx="12" ry="3" fill="#000" opacity="0.35" style={{ x: ballX }} />
            <m.g style={{ x: ballX, y: ballY, rotate: ballRot }}>
              <Ball />
            </m.g>
          </svg>

          {banner && phase !== "over" && (
            <div key={banner.id} className="pointer-events-none absolute inset-x-0 top-[8%] flex justify-center">
              <p className={`score-pop font-display glow-text text-5xl sm:text-7xl ${banner.made ? "text-accent" : "text-mist"}`}>
                {banner.text}
              </p>
            </div>
          )}
          <p className="sr-only" role="status">
            {banner ? `${banner.text} ${made} of ${attempts} made.` : ""}
          </p>

          {phase === "over" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink-950/80 text-center backdrop-blur-sm">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent">Final buzzer</p>
              <p className="font-display text-6xl sm:text-7xl">
                {made} <span className="text-mist">made</span>
              </p>
              <p className="text-sm text-mist">
                {attempts} attempts · best round: {Math.max(best ?? 0, made)}
              </p>
              <button type="button" onClick={playAgain} className="btn-game mt-2">
                Run it back
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 border-t border-white/[0.06] p-5 lg:border-l lg:border-t-0">
          <dl className="grid grid-cols-4 gap-2 text-center lg:grid-cols-2">
            <div className="rounded-lg bg-ink-950/80 px-3 py-1.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-mist">Shot clock</dt>
              <dd
                className={`font-display text-3xl leading-none tabular-nums ${timeLeft < 5 && running ? "text-redcard" : "text-press"}`}
              >
                {clock}
              </dd>
            </div>
            <div className="rounded-lg bg-ink-950/80 px-3 py-1.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-mist">Made</dt>
              <dd className="font-display text-3xl leading-none">
                {made}
                <span className="text-lg text-mist">/{attempts}</span>
              </dd>
            </div>
            <div className="rounded-lg bg-ink-950/80 px-3 py-1.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-mist">Streak</dt>
              <dd key={streak} className={`font-display text-3xl leading-none ${streak > 0 ? "bump text-accent" : ""}`}>
                {streak}
                {streak >= 3 && <span aria-label="on fire"> 🔥</span>}
              </dd>
            </div>
            <div className="rounded-lg bg-ink-950/80 px-3 py-1.5">
              <dt className="text-[10px] font-bold uppercase tracking-[0.2em] text-mist">Best</dt>
              <dd className="font-display text-3xl leading-none">{best ?? "–"}</dd>
            </div>
          </dl>
          <div>
            <div className="mb-1 flex justify-between text-[10px] font-bold uppercase tracking-[0.2em] text-mist">
              <span>Power</span>
              <span>Release in the green</span>
            </div>
            <div className="relative h-4 overflow-hidden rounded-full bg-white/[0.08]">
              <div
                className="absolute inset-y-0 bg-[#b6f75c]/25"
                style={{ left: `${(SWEET - WINDOWS.rimIn) * 100}%`, width: `${WINDOWS.rimIn * 200}%` }}
              />
              <div
                className="absolute inset-y-0 bg-pitch/60"
                style={{ left: `${(SWEET - WINDOWS.swish) * 100}%`, width: `${WINDOWS.swish * 200}%` }}
              />
              <m.div className="absolute inset-y-0 left-0 w-full origin-left bg-accent/80" style={{ scaleX: power }} />
            </div>
          </div>
          <button
            type="button"
            className="btn-game w-full touch-none select-none py-4"
            onPointerDown={onPointerDown}
            onPointerUp={release}
            onPointerCancel={release}
            onKeyDown={onKeyDown}
            onKeyUp={onKeyUp}
            onContextMenu={(e) => e.preventDefault()}
            aria-disabled={phase === "over" || phase === "flying"}
            aria-describedby="ft-help"
          >
            {phase === "charging" ? "Release!" : "Hold to shoot"}
          </button>
          <p id="ft-help" className="text-xs leading-relaxed text-mist">
            Press and hold the button (or Space / Enter) and let go when the meter is in the green. The 24-second clock starts on
            your first shot. Totally optional — every project is above.
          </p>
        </div>
      </div>
    </section>
  );
}
