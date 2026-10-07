"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/components/contact/CopyEmail";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { useSound } from "@/components/providers/SoundProvider";
import { profile } from "@/data/profile";
import { externalTiles, sections } from "@/data/site";
import { findNeighbor, KEY_TO_DIRECTION } from "@/lib/spatial";
import { MenuTile, type MenuTileProps } from "./MenuTile";
import { AboutTileArt, ContactTileArt, EnvelopeIcon, FunTileArt, GoalIcon, HoopIcon, PoolIcon, ProjectsTileArt } from "./TileArt";

const PRACTICE = [
  { title: "Penalty Shootout", href: "/about#penalty", Icon: GoalIcon },
  { title: "Free Throws", href: "/projects#free-throw", Icon: HoopIcon },
  { title: "Swim Start", href: "/fun#swim-race", Icon: PoolIcon },
];

const githubHandle = `@${profile.links.github.split("/").filter(Boolean).pop()}`;

// Remembered across client-side navigations so "Back" returns to the same tile.
let lastSelected = 0;

export function MainMenu() {
  const { play } = useSound();
  const [selected, setSelected] = useState(() => lastSelected);
  const [practice, setPractice] = useState(0);
  const [copied, setCopied] = useState(false);
  const selectedRef = useRef(selected);
  const tileEls = useRef<(HTMLElement | null)[]>([]);

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

  const setRef = useCallback((i: number, el: HTMLElement | null) => {
    tileEls.current[i] = el;
  }, []);

  const tiles: Omit<MenuTileProps, "index" | "selected" | "onSelect" | "setRef">[] = [
    { area: "about", kind: "link", ...sections.about, description: sections.about.subtitle, children: <AboutTileArt /> },
    {
      area: "projects",
      kind: "link",
      ...sections.projects,
      description: sections.projects.subtitle,
      children: <ProjectsTileArt />,
    },
    { area: "fun", kind: "link", ...sections.fun, description: sections.fun.subtitle, children: <FunTileArt /> },
    { area: "contact", kind: "link", ...sections.contact, description: sections.contact.subtitle, children: <ContactTileArt /> },
    {
      area: "github",
      kind: "external",
      ...externalTiles.github,
      description: "Code, repos and side quests on GitHub",
      children: (
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between sm:inset-x-5">
          <GitHubIcon className="h-11 w-11 sm:h-14 sm:w-14" />
          <span className="text-sm font-semibold text-fog/85">{githubHandle}</span>
        </div>
      ),
    },
    {
      area: "linkedin",
      kind: "external",
      ...externalTiles.linkedin,
      description: "Career stats, experience and endorsements",
      children: (
        <div className="absolute inset-x-4 bottom-3 flex items-center justify-between sm:inset-x-5">
          <LinkedInIcon className="h-11 w-11 sm:h-14 sm:w-14" />
          <span className="text-sm font-semibold text-fog/85">Connect</span>
        </div>
      ),
    },
    {
      area: "practice",
      kind: "link",
      href: PRACTICE[practice].href,
      title: "Practice Arena",
      accent: "menu",
      description: `Jump straight into a mini-game: ${PRACTICE[practice].title}. Press R to cycle.`,
      badge: <p className="mt-1 text-sm font-semibold text-fog/85">{PRACTICE[practice].title}</p>,
      children: (
        <>
          {PRACTICE.map(({ title, Icon }, i) => (
            <Icon
              key={title}
              className={`absolute bottom-4 right-4 h-9 w-auto transition-opacity duration-300 sm:h-14 lg:h-16 ${i === practice ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute bottom-3 left-4 flex items-center gap-1.5 sm:left-5" aria-hidden="true">
            <span className="keycap mr-1">R</span>
            {PRACTICE.map((p, i) => (
              <span key={p.title} className={`h-2 w-2 rounded-full ${i === practice ? "bg-[#ff6a3d]" : "bg-white/40"}`} />
            ))}
          </div>
        </>
      ),
    },
    {
      area: "email",
      kind: "action",
      title: "Email",
      accent: "menu",
      description: `Copy ${profile.email} to your clipboard`,
      onActivate: async () => {
        if (await copyText(profile.email)) {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 2000);
        }
      },
      badge: (
        <p className="mt-1 truncate text-sm font-semibold text-fog/85" role="status">
          {copied ? "Copied to clipboard!" : profile.email}
        </p>
      ),
      children: <EnvelopeIcon className="absolute bottom-4 right-4 h-8 w-auto sm:h-12" />,
    },
  ];
  const practiceIndex = tiles.findIndex((t) => t.area === "practice");

  // Coming back from another screen: put keyboard focus back on the last tile.
  useEffect(() => {
    if (document.documentElement.classList.contains("js-nav")) {
      tileEls.current[selectedRef.current]?.focus({ preventScroll: true });
    }
  }, []);

  // Practice Arena carousel: auto-advances unless it's the selected tile.
  useEffect(() => {
    if (selected === practiceIndex || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setPractice((p) => (p + 1) % PRACTICE.length), 3200);
    return () => window.clearInterval(id);
  }, [selected, practiceIndex]);

  // Arrow keys / D-pad move between tiles using their on-screen positions; R cycles the carousel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key.toLowerCase() === "r" && selectedRef.current === practiceIndex) {
        setPractice((p) => (p + 1) % PRACTICE.length);
        play("move");
        return;
      }
      const dir = KEY_TO_DIRECTION[e.key];
      if (!dir) return;
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
  }, [practiceIndex, play]);

  return (
    <section
      aria-labelledby="menu-title"
      className="relative mx-auto flex min-h-[calc(100dvh-var(--hud-h))] max-w-7xl flex-col px-4 pb-20 pt-2 sm:px-6"
    >
      <h1 id="menu-title" className="sr-only">
        Main menu
      </h1>
      <nav aria-label="Main menu" className="menu-grid lg:h-[min(36rem,calc(100dvh-var(--hud-h)-8rem))] lg:min-h-[28rem]">
        {tiles.map((tile, i) => (
          <MenuTile key={tile.area} {...tile} index={i} selected={selected === i} onSelect={select} setRef={setRef} />
        ))}
      </nav>
      {/* Black Ops-style description of the highlighted option */}
      <p className="mt-4 flex items-start gap-2 text-sm text-fog/90 sm:text-base" aria-live="polite">
        <span
          className="mt-1.5 inline-block h-0 w-0 border-y-[5px] border-l-[7px] border-y-transparent border-l-fog"
          aria-hidden="true"
        />
        {tiles[selected]?.description}
      </p>
    </section>
  );
}
