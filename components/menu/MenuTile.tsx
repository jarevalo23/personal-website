"use client";

import { m, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { PointerEvent, ReactNode } from "react";
import { GameLink } from "@/components/GameLink";
import { ArrowRightIcon, ExternalIcon } from "@/components/icons";
import { useSound } from "@/components/providers/SoundProvider";
import type { AccentKey } from "@/data/site";

export type MenuTileProps = {
  index: number;
  area: string;
  href: string;
  external?: boolean;
  title: string;
  subtitle: string;
  tag?: string;
  sport?: string;
  accent: AccentKey;
  art: ReactNode;
  variant: "feature" | "standard" | "wide" | "mini";
  pattern?: "pitch" | "court" | "lanes" | "press";
  selected: boolean;
  onSelect: (index: number) => void;
  setRef: (index: number, el: HTMLAnchorElement | null) => void;
};

const patterns: Record<NonNullable<MenuTileProps["pattern"]>, string> = {
  pitch:
    "repeating-linear-gradient(90deg, color-mix(in oklab, var(--accent) 5%, transparent) 0 36px, color-mix(in oklab, var(--accent) 10%, transparent) 36px 72px)",
  court:
    "repeating-linear-gradient(90deg, color-mix(in oklab, var(--accent) 4%, transparent) 0 22px, color-mix(in oklab, var(--accent) 8%, transparent) 22px 24px)",
  lanes:
    "repeating-linear-gradient(0deg, color-mix(in oklab, var(--accent) 4%, transparent) 0 42px, color-mix(in oklab, var(--accent) 14%, transparent) 42px 45px)",
  press: "radial-gradient(circle at 80% 20%, color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%)",
};

const MAX_TILT = 7;

const artPosition: Record<MenuTileProps["variant"], string> = {
  feature:
    "-right-[12%] top-1/2 h-[100%] -translate-y-1/2 sm:-right-[6%] sm:h-[70%] lg:left-1/2 lg:right-auto lg:top-[38%] lg:h-auto lg:w-[80%] lg:-translate-x-1/2",
  standard:
    "-right-[12%] top-1/2 h-[100%] -translate-y-1/2 sm:-right-[6%] sm:h-[70%] lg:left-1/2 lg:right-auto lg:top-[36%] lg:h-auto lg:w-[80%] lg:-translate-x-1/2",
  wide: "-right-[12%] top-1/2 h-[100%] -translate-y-1/2 sm:-right-[6%] sm:h-[70%] lg:right-[3%] lg:top-[40%] lg:h-[62%]",
  mini: "right-3 top-3 h-9 w-9 text-accent sm:h-10 sm:w-10",
};

export function MenuTile({
  index,
  area,
  href,
  external,
  title,
  subtitle,
  tag,
  sport,
  accent,
  art,
  variant,
  pattern,
  selected,
  onSelect,
  setRef,
}: MenuTileProps) {
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const tiltX = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const tiltY = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const onPointerMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltY.set(px * MAX_TILT * 2);
    tiltX.set(-py * MAX_TILT * 2);
  };
  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const isMini = variant === "mini";
  const className =
    "menu-tile tile-enter group relative block overflow-hidden rounded-2xl border border-white/10 bg-ink-800 outline-offset-4 " +
    (isMini ? "min-h-[7.5rem]" : "min-h-[9.5rem] sm:min-h-[13rem]");

  const shared = {
    ref: (el: HTMLAnchorElement | null) => setRef(index, el),
    className,
    style: { gridArea: area, "--i": index } as React.CSSProperties,
    "data-accent": accent,
    "data-selected": selected,
    onMouseEnter: () => onSelect(index),
    onFocus: () => onSelect(index),
    onPointerMove,
    onPointerLeave: resetTilt,
  };

  const body = (
    <m.div className="relative h-full w-full" style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}>
      {pattern && <div className="absolute inset-0" style={{ backgroundImage: patterns[pattern] }} aria-hidden="true" />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" aria-hidden="true" />
      {!isMini && (
        <div
          className="absolute inset-0 bg-gradient-to-r from-ink-900/90 via-ink-900/50 to-transparent sm:hidden"
          aria-hidden="true"
        />
      )}
      <div className={`tile-art pointer-events-none absolute ${artPosition[variant]}`} aria-hidden="true">
        {art}
      </div>
      <div className="tile-shine pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className={"relative z-10 flex h-full flex-col justify-between " + (isMini ? "p-4" : "p-4 sm:p-5")}>
        <div className="flex items-start justify-between gap-2" aria-hidden="true">
          {tag && (
            <span className="rounded-md bg-accent px-2 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-ink">
              {tag}
            </span>
          )}
          {sport && (
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-mist sm:inline">{sport}</span>
          )}
        </div>
        <div>
          <h2
            className={
              "font-display text-fog " + (isMini ? "text-3xl" : variant === "feature" ? "text-5xl sm:text-6xl" : "text-5xl")
            }
          >
            {title}
            {external && <ExternalIcon className="ml-1.5 inline h-5 w-5 align-baseline text-accent" />}
            {external && <span className="sr-only"> (opens in a new tab)</span>}
          </h2>
          <span className="tile-underline mt-1.5 block h-1 rounded-full bg-accent" aria-hidden="true" />
          <p
            className={
              "mt-2 text-mist " +
              (isMini ? "text-xs" : "max-w-[62%] text-sm sm:max-w-[18rem]" + (variant === "wide" ? " lg:max-w-[55%]" : ""))
            }
          >
            {subtitle}
          </p>
          {!isMini && (
            <span
              className="tile-cta mt-3 hidden items-center gap-1 text-xs font-bold uppercase tracking-[0.2em] text-accent sm:inline-flex"
              aria-hidden="true"
            >
              {external ? "Open" : "Play"} <ArrowRightIcon className="h-4 w-4" />
            </span>
          )}
        </div>
      </div>
    </m.div>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => play("select")} {...shared}>
        {body}
      </a>
    );
  }
  return (
    <GameLink href={href} transitionLabel={title} transitionAccent={accent} {...shared}>
      {body}
    </GameLink>
  );
}
