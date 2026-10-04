"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import Image from "next/image";
import type { PointerEvent } from "react";
import { profile } from "@/data/profile";

const finishes = {
  neon: {
    background: "linear-gradient(160deg, #123826 0%, #07140e 45%, #0b2418 75%, #10301f 100%)",
    border: "linear-gradient(160deg, #3dff8a, #b7ffd4 40%, #1f9e57 70%, #3dff8a)",
    text: "#eef2ff",
    muted: "#a9e8c4",
    line: "rgba(61, 255, 138, 0.35)",
  },
  gold: {
    background: "linear-gradient(160deg, #fbe7a1 0%, #d9ae3d 45%, #f5d77a 75%, #c99a2e 100%)",
    border: "linear-gradient(160deg, #fff4c4, #b8862a 50%, #fff1b8)",
    text: "#2b1f00",
    muted: "#5c4500",
    line: "rgba(60, 40, 0, 0.35)",
  },
  icon: {
    background: "linear-gradient(160deg, #fbfaf4 0%, #e3dfcf 50%, #f4f1e6 100%)",
    border: "linear-gradient(160deg, #ffffff, #b9b4a0 50%, #ffffff)",
    text: "#14161f",
    muted: "#4f5160",
    line: "rgba(20, 22, 31, 0.25)",
  },
} as const;

const CARD_SHAPE = "polygon(50% 0, 88% 2.5%, 100% 9%, 100% 87%, 50% 100%, 0 87%, 0 9%, 12% 2.5%)";

/** FIFA Ultimate Team–style player card with pointer tilt and holographic sheen. */
export function PlayerCard() {
  const { card, stats } = profile;
  const finish = finishes[card.finish];
  const reduceMotion = useReducedMotion();
  const rx = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });
  const ry = useSpring(useMotionValue(0), { stiffness: 180, damping: 16 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    e.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    e.currentTarget.style.setProperty("--my", `${py * 100}%`);
    if (reduceMotion || e.pointerType !== "mouse") return;
    ry.set((px - 0.5) * 18);
    rx.set(-(py - 0.5) * 18);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const faceStats = stats.slice(0, 6);
  const isSvg = profile.photo.endsWith(".svg");

  return (
    <div className="mx-auto w-full max-w-[300px] [perspective:1100px]">
      <m.div
        className="group relative aspect-[5/7.2] drop-shadow-[0_25px_45px_rgba(61,255,138,0.25)]"
        style={{ rotateX: rx, rotateY: ry, color: finish.text } as never}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        role="img"
        aria-label={`Player card: ${profile.firstName} ${profile.lastName}, overall rating ${card.rating}, position ${card.position}. ${faceStats
          .map((s) => `${s.label} ${s.value}`)
          .join(", ")}.`}
      >
        <div className="absolute inset-0" style={{ clipPath: CARD_SHAPE, background: finish.border }} />
        <div className="absolute inset-[4px] overflow-hidden" style={{ clipPath: CARD_SHAPE, background: finish.background }}>
          {/* subtle pattern */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `repeating-linear-gradient(135deg, transparent 0 14px, ${finish.line} 14px 15px)`,
              maskImage: "linear-gradient(to bottom, black, transparent 55%)",
            }}
          />
          {/* photo */}
          <div className="absolute right-[4%] top-[7%] h-[52%] w-[68%]">
            <Image
              src={profile.photo}
              alt=""
              fill
              sizes="210px"
              priority
              unoptimized={isSvg}
              className="object-contain object-bottom"
            />
          </div>
          {/* rating column */}
          <div className="absolute left-[10%] top-[11%] flex flex-col items-center leading-none">
            <span className="font-display text-[3.6rem]">{card.rating}</span>
            <span className="font-display -mt-1 text-2xl">{card.position}</span>
            <span className="my-2 h-px w-8" style={{ background: finish.line }} />
            <Image
              src={card.nation.flag}
              alt=""
              width={30}
              height={20}
              unoptimized={card.nation.flag.endsWith(".svg")}
              className="rounded-[2px]"
            />
            <span className="my-2 h-px w-8" style={{ background: finish.line }} />
            <span
              className="rounded border px-1 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{ borderColor: finish.line, color: finish.muted }}
            >
              {card.club}
            </span>
          </div>
          {/* name */}
          <div className="absolute inset-x-[8%] top-[60%] text-center">
            <p className="font-display truncate text-[2rem] leading-none">{profile.lastName}</p>
            <div className="mx-auto mt-1.5 h-px w-4/5" style={{ background: finish.line }} />
          </div>
          {/* stats */}
          <div className="absolute inset-x-[13%] top-[71%] grid grid-cols-2 gap-x-5 gap-y-1">
            {faceStats.map((s, i) => (
              <div
                key={s.short}
                className={`flex items-baseline gap-1.5 ${i % 2 === 1 ? "border-l pl-4" : ""}`}
                style={{ borderColor: finish.line }}
              >
                <span className="font-display text-[1.45rem] leading-none">{s.value}</span>
                <span className="font-display text-base leading-none" style={{ color: finish.muted }}>
                  {s.short}
                </span>
              </div>
            ))}
          </div>
          {/* holographic sheen following the pointer */}
          <div
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-overlay transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(circle at var(--mx, 50%) var(--my, 30%), rgba(255,255,255,0.55), transparent 45%), linear-gradient(115deg, transparent 30%, rgba(61,255,138,0.25) 45%, rgba(46,230,255,0.25) 55%, transparent 70%)",
            }}
          />
        </div>
      </m.div>
    </div>
  );
}
