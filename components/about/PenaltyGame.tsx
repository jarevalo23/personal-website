"use client";

import { animate, m, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { useSound } from "@/components/providers/SoundProvider";
import { profile } from "@/data/profile";
import { fireConfetti } from "@/lib/confetti";

/* ── Pitch geometry (SVG user units, viewBox 600×400) ───────────────────── */
const GOAL = { left: 136, right: 464, top: 96, ground: 250 };
const POSTS = { left: 133, right: 467, bar: 93 };
const BALL_START = { x: 300, y: 352 };
const AIM = { minX: 96, maxX: 504, minY: 56, maxY: 246 };
const KEEPER_HOME = { x: 300, y: 190 };
/** How far from the keeper's dive point a shot still gets saved. Top corners beat it. */
const REACH = 52;

type Zone = "LH" | "LL" | "CH" | "CL" | "RH" | "RL";
const ZONES: Record<Zone, { save: { x: number; y: number }; dive: { x: number; y: number; rotate: number } }> = {
  LH: { save: { x: 200, y: 138 }, dive: { x: -108, y: -42, rotate: -72 } },
  LL: { save: { x: 200, y: 212 }, dive: { x: -108, y: 30, rotate: -88 } },
  CH: { save: { x: 300, y: 140 }, dive: { x: 0, y: -40, rotate: 0 } },
  CL: { save: { x: 300, y: 205 }, dive: { x: 0, y: 6, rotate: 0 } },
  RH: { save: { x: 400, y: 138 }, dive: { x: 108, y: -42, rotate: 72 } },
  RL: { save: { x: 400, y: 212 }, dive: { x: 108, y: 30, rotate: 88 } },
};
const ZONE_KEYS = Object.keys(ZONES) as Zone[];

type Outcome = "goal" | "save" | "post" | "wide" | "over";
type Phase = "aim" | "shooting" | "result";

const RESULT_TEXT: Record<Outcome, { title: string; sub: string; tone: string }> = {
  goal: { title: "Goal!", sub: "Fun fact unlocked", tone: "text-accent" },
  save: { title: "Saved!", sub: "The keeper guessed right", tone: "text-redcard" },
  post: { title: "Off the post!", sub: "So close", tone: "text-press" },
  wide: { title: "Wide!", sub: "Aim inside the posts", tone: "text-redcard" },
  over: { title: "Over the bar!", sub: "Keep it under the crossbar", tone: "text-redcard" },
};

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function zoneOf(x: number, y: number): Zone {
  const col = x < 245 ? "L" : x > 355 ? "R" : "C";
  const row = y < 172 ? "H" : "L";
  return `${col}${row}` as Zone;
}

function judge(x: number, y: number, keeper: Zone): Outcome {
  const onPost = (Math.abs(x - POSTS.left) <= 5 || Math.abs(x - POSTS.right) <= 5) && y >= POSTS.bar - 3 && y <= GOAL.ground;
  const onBar = Math.abs(y - POSTS.bar) <= 5 && x >= POSTS.left - 3 && x <= POSTS.right + 3;
  if (onPost || onBar) return "post";
  if (y < GOAL.top) return "over";
  if (x < GOAL.left || x > GOAL.right) return "wide";
  const s = ZONES[keeper].save;
  return Math.hypot(x - s.x, y - s.y) < REACH ? "save" : "goal";
}

// Deterministic crowd dots for the stands.
const crowd = Array.from({ length: 90 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 91.7 + n * 47.3) * 10000;
    return v - Math.floor(v);
  };
  // Rounded so server and browser render identical attribute strings.
  return {
    x: (r(1) * 600).toFixed(1),
    y: (8 + r(2) * 66).toFixed(1),
    r: (1.2 + r(3) * 1.8).toFixed(2),
    o: (0.15 + r(4) * 0.35).toFixed(2),
    c: r(5) > 0.7 ? "#3dff8a" : "#a9b4d6",
  };
});

const pentagon = (r: number, rot = -90) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(1)},${(r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

function Ball() {
  return (
    <g>
      <circle r="15" fill="#f4f6ff" stroke="#0c1328" strokeWidth="1.5" />
      <polygon points={pentagon(5.5)} fill="#0c1328" />
      <g fill="#0c1328" fillOpacity="0.85">
        <path d="M-14 -4 l5 -2 2 5 -4 4 -4 -2z" />
        <path d="M14 -4 l-5 -2 -2 5 4 4 4 -2z" />
        <path d="M-5 13 l2 -5 6 0 2 5 -5 2z" />
      </g>
    </g>
  );
}

function Keeper() {
  return (
    <g>
      <path d="M-9 20 L-16 56 M9 20 L16 56" stroke="#0c1328" strokeWidth="10" strokeLinecap="round" />
      <path d="M-17 57 h-7 M17 57 h7" stroke="#eef2ff" strokeWidth="6" strokeLinecap="round" />
      <rect x="-17" y="8" width="34" height="18" rx="4" fill="#0c1328" />
      <path d="M-17 -22 L-44 -46 M17 -22 L44 -46" stroke="#ff4d5e" strokeWidth="9" strokeLinecap="round" />
      <rect x="-20" y="-30" width="40" height="44" rx="10" fill="#ff4d5e" />
      <text x="0" y="0" textAnchor="middle" fontSize="18" fill="#fff" fontFamily="var(--font-display)">
        1
      </text>
      <circle cx="-46" cy="-49" r="8" fill="#d4ff3a" />
      <circle cx="46" cy="-49" r="8" fill="#d4ff3a" />
      <circle cx="0" cy="-44" r="12" fill="#1d2a52" stroke="#eef2ff" strokeOpacity="0.4" strokeWidth="2" />
    </g>
  );
}

/** Penalty-kick mini-game: aim, shoot, beat the diving keeper, unlock fun facts. */
export function PenaltyGame() {
  const { play } = useSound();
  const reduceMotion = useReducedMotion();
  const facts = profile.funFacts;

  const [aim, setAim] = useState({ x: 300, y: 150 });
  const [phase, setPhase] = useState<Phase>("aim");
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [keeperZone, setKeeperZone] = useState<Zone | null>(null);
  const [kicks, setKicks] = useState<boolean[]>([]);
  const [factIndex, setFactIndex] = useState<number | null>(null);
  const [netHit, setNetHit] = useState<{ x: number; y: number; key: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const timers = useRef<number[]>([]);
  // Guards against a double click firing two shots before React re-renders.
  const busy = useRef(false);
  const ballX = useMotionValue(BALL_START.x);
  const ballY = useMotionValue(BALL_START.y);
  const ballScale = useMotionValue(1);
  const ballOpacity = useMotionValue(1);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((t) => window.clearTimeout(t));
  }, []);

  const goals = kicks.filter(Boolean).length;
  const saves = kicks.length - goals;

  const toSvgPoint = (clientX: number, clientY: number) => {
    const svg = svgRef.current;
    const ctm = svg?.getScreenCTM();
    if (!svg || !ctm) return aim;
    const p = new DOMPoint(clientX, clientY).matrixTransform(ctm.inverse());
    return { x: clamp(p.x, AIM.minX, AIM.maxX), y: clamp(p.y, AIM.minY, AIM.maxY) };
  };

  const reset = () => {
    ballX.set(BALL_START.x);
    ballY.set(BALL_START.y);
    ballScale.set(1);
    ballOpacity.set(1);
    setKeeperZone(null);
    setOutcome(null);
    setNetHit(null);
    setPhase("aim");
    busy.current = false;
  };

  const shoot = async (target: { x: number; y: number }) => {
    if (phase !== "aim" || busy.current) return;
    busy.current = true;
    setPhase("shooting");
    play("kick");

    // A little human error on every strike.
    const tx = clamp(target.x + (Math.random() - 0.5) * 12, AIM.minX, AIM.maxX);
    const ty = clamp(target.y + (Math.random() - 0.5) * 12, AIM.minY, AIM.maxY);
    // The keeper reads the shot 30% of the time; otherwise guesses.
    const zone = Math.random() < 0.3 ? zoneOf(tx, ty) : ZONE_KEYS[Math.floor(Math.random() * ZONE_KEYS.length)];
    const result = judge(tx, ty, zone);
    setKeeperZone(zone);

    const speed = reduceMotion ? 0 : 1;
    const midX = (BALL_START.x + tx) / 2 + (tx - 300) * 0.12;
    const midY = (BALL_START.y + ty) / 2 - 36;
    await Promise.all([
      animate(ballX, [BALL_START.x, midX, tx], { duration: 0.5 * speed, ease: "easeOut" }),
      animate(ballY, [BALL_START.y, midY, ty], { duration: 0.5 * speed, ease: "easeOut" }),
      animate(ballScale, [1, 0.72, 0.5], { duration: 0.5 * speed, ease: "easeOut" }),
    ]);

    if (result === "goal") {
      setNetHit({ x: tx, y: ty, key: Date.now() });
      play("goal");
      const r = svgRef.current?.getBoundingClientRect();
      if (r) {
        fireConfetti({
          x: r.left + (tx / 600) * r.width,
          y: r.top + (ty / 400) * r.height,
          colors: ["#3dff8a", "#eef2ff", "#2ee6ff", "#ffd23f"],
        });
      }
      setFactIndex((f) => (f === null ? 0 : (f + 1) % facts.length));
      await Promise.all([
        animate(ballX, tx + (tx - 300) * 0.05, { duration: 0.15 * speed }),
        animate(ballScale, 0.42, { duration: 0.15 * speed }),
      ]);
      void animate(ballY, GOAL.ground - 8, { duration: 0.4 * speed, ease: "easeIn" });
    } else if (result === "save") {
      play("save");
      const away = tx < 300 ? -1 : 1;
      void animate(ballX, tx + away * 70, { duration: 0.4 * speed, ease: "easeOut" });
      void animate(ballY, ty + 130, { duration: 0.4 * speed, ease: "easeOut" });
      void animate(ballScale, 0.75, { duration: 0.4 * speed });
    } else if (result === "post") {
      play("post");
      const back = tx < 300 ? 1 : -1;
      void animate(ballX, tx + back * 50, { duration: 0.45 * speed, ease: "easeOut" });
      void animate(ballY, ty + 150, { duration: 0.45 * speed, ease: "easeOut" });
      void animate(ballScale, 0.85, { duration: 0.45 * speed });
    } else {
      play("save");
      void animate(ballX, tx + (tx - 300) * 0.25, { duration: 0.3 * speed });
      void animate(ballY, ty - 30, { duration: 0.3 * speed });
      void animate(ballOpacity, 0, { duration: 0.3 * speed });
    }

    setOutcome(result);
    setPhase("result");
    setKicks((k) => [...k, result === "goal"]);
    timers.current.push(window.setTimeout(reset, 1700));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 24 : 12;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    if (moves[e.key]) {
      e.preventDefault();
      if (phase !== "aim") return;
      const [dx, dy] = moves[e.key];
      setAim((a) => ({ x: clamp(a.x + dx, AIM.minX, AIM.maxX), y: clamp(a.y + dy, AIM.minY, AIM.maxY) }));
    } else if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      void shoot(aim);
    }
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (phase === "aim") setAim(toSvgPoint(e.clientX, e.clientY));
  };
  const onPointerUp = (e: PointerEvent<SVGSVGElement>) => {
    const p = toSvgPoint(e.clientX, e.clientY);
    setAim(p);
    void shoot(p);
  };

  const keeperTarget = keeperZone ? ZONES[keeperZone].dive : { x: 0, y: 0, rotate: 0 };
  const result = outcome ? RESULT_TEXT[outcome] : null;

  return (
    <section id="penalty" aria-labelledby="penalty-title" className="scroll-mt-28 panel panel-accent overflow-hidden">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.06] px-5 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-accent">Mini-game</p>
          <h2 id="penalty-title" className="font-display text-4xl">
            Penalty Shootout
          </h2>
        </div>
        {/* TV-style score bug */}
        <div className="flex items-center gap-3 rounded-lg bg-ink-950/70 px-3 py-2">
          <span className="font-display text-xl">
            You <span className="text-accent">{goals}</span>
            <span className="mx-1.5 text-mist">–</span>
            <span className="text-redcard">{saves}</span> GK
          </span>
          <span className="flex gap-1" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => {
              const k = kicks.slice(-5)[i];
              return (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full ${k === undefined ? "bg-white/15" : k ? "bg-accent" : "bg-redcard"}`}
                />
              );
            })}
          </span>
        </div>
      </div>

      <div
        className="relative cursor-crosshair outline-none focus-visible:ring-4 focus-visible:ring-accent/60"
        tabIndex={0}
        role="group"
        aria-label="Penalty kick. Use the arrow keys to aim (hold Shift for bigger steps), then press Space or Enter to shoot."
        aria-describedby="penalty-help"
        onKeyDown={onKeyDown}
      >
        <svg
          ref={svgRef}
          viewBox="0 0 600 400"
          className="block h-auto w-full touch-manipulation select-none"
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pk-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#060a18" />
              <stop offset="0.6" stopColor="#0a1a22" />
              <stop offset="1" stopColor="#0b2418" />
            </linearGradient>
            <pattern id="pk-net" width="12" height="12" patternUnits="userSpaceOnUse">
              <path d="M0 0 L12 12 M12 0 L0 12" stroke="#eef2ff" strokeOpacity="0.22" strokeWidth="1" />
            </pattern>
            <radialGradient id="pk-light" cx="0.5" cy="0" r="0.8">
              <stop offset="0" stopColor="#3dff8a" stopOpacity="0.18" />
              <stop offset="1" stopColor="#3dff8a" stopOpacity="0" />
            </radialGradient>
          </defs>

          <rect width="600" height="400" fill="url(#pk-sky)" />
          <rect width="600" height="260" fill="url(#pk-light)" />
          <g>
            {crowd.map((c, i) => (
              <circle key={i} cx={c.x} cy={c.y} r={c.r} fill={c.c} opacity={c.o} />
            ))}
          </g>

          {/* grass */}
          {[250, 268, 290, 318, 352].map((y, i, arr) => (
            <rect key={y} x="0" y={y} width="600" height={(arr[i + 1] ?? 400) - y} fill={i % 2 ? "#0b2a18" : "#0e3420"} />
          ))}
          <g fill="none" stroke="#eef2ff" strokeOpacity="0.35" strokeWidth="2">
            <path d="M0 250 H600" />
            <path d="M188 250 L166 290 L434 290 L412 250" />
            <path d="M70 250 L20 345 L580 345 L530 250" strokeOpacity="0.2" />
          </g>
          <ellipse cx="300" cy="364" rx="9" ry="3" fill="#eef2ff" opacity="0.6" />

          {/* net (ripples on a goal) */}
          <m.g
            key={netHit?.key ?? "net"}
            style={{
              originX: netHit ? (netHit.x - GOAL.left) / (GOAL.right - GOAL.left) : 0.5,
              originY: netHit ? (netHit.y - GOAL.top) / (GOAL.ground - GOAL.top) : 0.5,
            }}
            animate={netHit ? { scale: [1, 1.07, 0.97, 1.02, 1] } : { scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <polygon points="136,96 464,96 438,116 162,116" fill="url(#pk-net)" />
            <polygon points="136,96 162,116 162,250 136,250" fill="url(#pk-net)" />
            <polygon points="464,96 438,116 438,250 464,250" fill="url(#pk-net)" />
            <rect x="162" y="116" width="276" height="134" fill="url(#pk-net)" />
            <rect x="162" y="116" width="276" height="134" fill="none" stroke="#eef2ff" strokeOpacity="0.25" strokeWidth="2" />
          </m.g>
          {netHit && (
            <g>
              {[0, 0.15].map((d) => (
                <m.circle
                  key={d}
                  cx={netHit.x}
                  cy={netHit.y}
                  r="12"
                  fill="none"
                  stroke="#3dff8a"
                  strokeWidth="2"
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 3.2, opacity: 0 }}
                  transition={{ duration: 0.8, delay: d }}
                />
              ))}
            </g>
          )}

          {/* keeper */}
          <g transform={`translate(${KEEPER_HOME.x} ${KEEPER_HOME.y})`}>
            <m.g animate={keeperTarget} transition={{ duration: 0.42, ease: [0.2, 0.9, 0.3, 1], delay: keeperZone ? 0.06 : 0 }}>
              <g className={phase === "aim" ? "keeper-sway" : undefined}>
                <Keeper />
              </g>
            </m.g>
          </g>

          {/* frame */}
          <g fill="#f4f6ff">
            <rect x="130" y="90" width="6" height="160" />
            <rect x="464" y="90" width="6" height="160" />
            <rect x="130" y="90" width="340" height="6" />
          </g>

          {/* aim guide */}
          {phase === "aim" && (
            <g>
              <line
                x1={BALL_START.x}
                y1={BALL_START.y}
                x2={aim.x}
                y2={aim.y}
                stroke="#3dff8a"
                strokeOpacity="0.35"
                strokeWidth="2"
                strokeDasharray="4 8"
              />
              <g transform={`translate(${aim.x} ${aim.y})`}>
                <circle r="14" fill="#3dff8a" fillOpacity="0.12" stroke="#3dff8a" strokeWidth="2.5" />
                <path d="M-22 0 h10 M12 0 h10 M0 -22 v10 M0 12 v10" stroke="#3dff8a" strokeWidth="2.5" strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* ball */}
          <ellipse cx={BALL_START.x} cy={BALL_START.y + 15} rx="14" ry="4" fill="#000" opacity={phase === "aim" ? 0.35 : 0} />
          <m.g style={{ x: ballX, y: ballY, scale: ballScale, opacity: ballOpacity }}>
            <Ball />
          </m.g>
        </svg>

        {result && (
          <div
            className="pointer-events-none absolute inset-x-0 top-[6%] flex flex-col items-center text-center"
            key={kicks.length}
          >
            <p className={`score-pop font-display [text-shadow:0_3px_0_rgba(0,0,0,0.5)] text-6xl sm:text-7xl ${result.tone}`}>
              {result.title}
            </p>
            <p className="mt-1 rounded bg-ink-950/70 px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-fog">
              {result.sub}
            </p>
          </div>
        )}
        <p className="sr-only" role="status">
          {result ? `${result.title} You ${goals}, keeper ${saves}.` : ""}
        </p>
      </div>

      <div className="space-y-4 px-5 py-4">
        <p id="penalty-help" className="text-xs text-mist">
          <span className="font-semibold text-fog">Aim:</span> mouse, drag or arrow keys ·{" "}
          <span className="font-semibold text-fog">Shoot:</span> click, tap, Space or Enter · Tip: the keeper can&apos;t reach the
          top corners — but aim too tight and it&apos;s off the post.
        </p>
        <div className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4" aria-live="polite">
          {factIndex === null ? (
            <p className="text-sm text-mist">⚽ Score a penalty to unlock a fun fact about me.</p>
          ) : (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-accent">
                Fun fact {factIndex + 1}/{facts.length}
              </p>
              <p key={factIndex} className="score-pop mt-1 text-fog">
                {facts[factIndex]}
              </p>
            </>
          )}
        </div>
        <details className="group text-sm">
          <summary className="cursor-pointer select-none font-semibold text-mist hover:text-fog">
            Skip the shootout — show all fun facts
          </summary>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-mist marker:text-accent">
            {facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      </div>
    </section>
  );
}
