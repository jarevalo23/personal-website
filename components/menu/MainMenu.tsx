"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { useSound } from "@/components/providers/SoundProvider";
import { profile } from "@/data/profile";
import { externalTiles, sections, site } from "@/data/site";
import { findNeighbor, KEY_TO_DIRECTION } from "@/lib/spatial";
import { MenuTile, type MenuTileProps } from "./MenuTile";
import { BasketballArt, MicArt, SoccerArt, SwimArt } from "./TileArt";

type TileConfig = Omit<MenuTileProps, "index" | "selected" | "onSelect" | "setRef">;

const tiles: TileConfig[] = [
  { area: "about", ...sections.about, variant: "feature", pattern: "pitch", art: <SoccerArt /> },
  { area: "projects", ...sections.projects, variant: "standard", pattern: "court", art: <BasketballArt /> },
  { area: "fun", ...sections.fun, variant: "standard", pattern: "lanes", art: <SwimArt /> },
  { area: "contact", ...sections.contact, variant: "wide", pattern: "press", art: <MicArt /> },
  { area: "github", ...externalTiles.github, external: true, variant: "mini", art: <GitHubIcon className="h-full w-full" /> },
  {
    area: "linkedin",
    ...externalTiles.linkedin,
    external: true,
    variant: "mini",
    art: <LinkedInIcon className="h-full w-full" />,
  },
];

// Remembered across client-side navigations so "Back" returns to the same tile.
let lastSelected = 0;

export function MainMenu({ footer }: { footer: React.ReactNode }) {
  const { play } = useSound();
  const [selected, setSelected] = useState(() => lastSelected);
  const selectedRef = useRef(selected);
  const tileEls = useRef<(HTMLAnchorElement | null)[]>([]);

  const select = useCallback(
    (i: number) => {
      if (i === selectedRef.current) return;
      selectedRef.current = i;
      lastSelected = i;
      setSelected(i);
      play("move");
    },
    [play],
  );

  const setRef = useCallback((i: number, el: HTMLAnchorElement | null) => {
    tileEls.current[i] = el;
  }, []);

  // Coming back from another screen: put keyboard focus back on the last tile.
  useEffect(() => {
    if (document.documentElement.classList.contains("js-nav")) {
      tileEls.current[selectedRef.current]?.focus({ preventScroll: true });
    }
  }, []);

  // Arrow keys / D-pad move between tiles using their on-screen positions.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const dir = KEY_TO_DIRECTION[e.key];
      if (!dir || e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const els = tileEls.current;
      const focused = els.findIndex((el) => el === document.activeElement);
      const elsewhere = document.activeElement && document.activeElement !== document.body && focused < 0;
      if (elsewhere) return; // e.g. focus is on the sound toggle — leave arrows alone
      e.preventDefault();
      if (focused < 0) {
        els[selectedRef.current]?.focus();
        return;
      }
      const rects = els.map((el) => el?.getBoundingClientRect() ?? new DOMRect());
      const next = findNeighbor(rects, focused, dir);
      if (next >= 0) {
        els[next]?.focus();
        els[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section
      aria-labelledby="menu-title"
      className="relative mx-auto flex min-h-[calc(100dvh-var(--hud-h))] max-w-7xl flex-col px-4 pb-5 pt-5 sm:px-6 sm:pt-7"
    >
      <div className="mb-4 flex items-end justify-between gap-4 sm:mb-6">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-mist">{site.seasonLabel} · Select your mode</p>
          <h1 id="menu-title" className="font-display text-6xl sm:text-7xl">
            Main Menu
          </h1>
        </div>
        <div
          className="panel hidden items-center gap-4 px-4 py-3 md:flex"
          data-accent={profile.card.finish === "gold" ? "contact" : "soccer"}
        >
          <div className="text-center leading-none">
            <p className="font-display text-4xl text-accent">{profile.card.rating}</p>
            <p className="font-display text-lg text-mist">{profile.card.position}</p>
          </div>
          <div className="leading-tight">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-mist">Player</p>
            <p className="font-display text-2xl">
              {profile.lastName} <span className="text-accent">#{profile.jerseyNumber}</span>
            </p>
          </div>
        </div>
      </div>

      <nav aria-label="Main menu" className="menu-grid flex-1 lg:min-h-[30rem]">
        {tiles.map((tile, i) => (
          <MenuTile key={tile.area} {...tile} index={i} selected={selected === i} onSelect={select} setRef={setRef} />
        ))}
      </nav>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-mist">
        <div className="hidden items-center gap-5 sm:flex" aria-hidden="true">
          <span className="flex items-center gap-1.5">
            <span className="keycap">←</span>
            <span className="keycap">↑</span>
            <span className="keycap">↓</span>
            <span className="keycap">→</span>
            Navigate
          </span>
          <span className="flex items-center gap-1.5">
            <span className="keycap">Enter</span> Select
          </span>
          <span className="flex items-center gap-1.5">
            <span className="keycap">Esc</span> Back
          </span>
          <span className="hidden items-center gap-1.5 lg:flex">🎮 Controller supported</span>
        </div>
        <p className="sm:hidden">Tap a mode to play</p>
        {footer}
      </div>
    </section>
  );
}
