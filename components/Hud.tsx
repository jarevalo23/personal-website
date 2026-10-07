"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { fullName, profile } from "@/data/profile";
import { sections, type AccentKey } from "@/data/site";
import { GameLink } from "./GameLink";
import { Crest, SpeakerIcon } from "./icons";
import { useSound } from "./providers/SoundProvider";
import { useScreenTransition } from "./providers/TransitionProvider";

const initials = `${profile.firstName[0]}${profile.lastName[0]}`;
const gamertag = profile.links.github.split("/").filter(Boolean).pop() ?? profile.lastName;

const TABS: { href: string; label: string; accent: AccentKey }[] = [
  { href: "/", label: "Home", accent: "menu" },
  ...Object.values(sections).map((s) => ({ href: s.href, label: s.title, accent: s.accent })),
];

function isEditable(el: EventTarget | null): el is HTMLElement {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/** Esc → main menu (from sub-screens); Q / E (or LB / RB) → previous / next tab. */
function useHudKeys(pathname: string) {
  const { navigate } = useScreenTransition();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (document.querySelector("dialog[open]")) return; // let dialogs handle their own keys

      if (e.key === "Escape") {
        if (isEditable(e.target)) {
          // First Esc in a form field just leaves the field, so a draft is never lost by accident.
          e.target.blur();
          return;
        }
        if (pathname !== "/") navigate("/", { label: "Main Menu", accent: "menu" });
        return;
      }

      const key = e.key.toLowerCase();
      if ((key === "q" || key === "e") && !isEditable(e.target)) {
        const i = TABS.findIndex((t) => t.href === pathname);
        if (i < 0) return;
        const next = TABS[(i + (key === "e" ? 1 : -1) + TABS.length) % TABS.length];
        navigate(next.href, { label: next.label, accent: next.accent, sound: "move" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pathname, navigate]);
}

function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title="Toggle sound effects"
      className="flex h-7 items-center gap-1.5 px-2 text-xs font-semibold uppercase tracking-wider text-fog/90 transition-colors hover:text-fog"
    >
      <SpeakerIcon muted={!enabled} className="h-4 w-4" />
      <span>Sound</span>
      <span aria-hidden="true" className={enabled ? "text-accent" : "text-mist"}>
        {enabled ? "On" : "Off"}
      </span>
    </button>
  );
}

/** Top chrome shared by every screen: status strip + FIFA-style tab bar. */
export function Hud() {
  const pathname = usePathname();
  useHudKeys(pathname);

  return (
    <header
      className="sticky top-0 z-40 h-(--hud-h) bg-gradient-to-b from-ink-950/90 via-ink-950/60 to-transparent backdrop-blur-[2px]"
      data-accent="menu"
    >
      {/* status strip */}
      <div className="mx-auto flex h-9 max-w-7xl items-center gap-3 px-4 text-xs sm:px-6">
        <GameLink
          href="/"
          transitionLabel="Main Menu"
          className="flex min-w-0 items-center gap-2"
          aria-label={`${fullName} — home`}
        >
          <Crest initials={initials} className="h-6 w-5 shrink-0" />
          <span className="font-display truncate text-base tracking-wide">{fullName}</span>
        </GameLink>
        <p
          className="mx-auto hidden items-center gap-1.5 font-semibold uppercase tracking-wider text-mist lg:flex"
          aria-hidden="true"
        >
          Press <span className="keycap">Q</span> <span className="keycap">E</span> to switch tabs
        </p>
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-semibold text-fog/90 sm:inline">{gamertag}</span>
          <SoundToggle />
        </div>
      </div>

      {/* tab bar */}
      <nav aria-label="Sections" className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex items-center gap-1">
          <span className="keycap mr-1 hidden shrink-0 sm:inline-flex" aria-hidden="true">
            Q
          </span>
          <ul className="flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
            {TABS.map((tab) => {
              const active = tab.href === pathname;
              return (
                <li key={tab.href} className="shrink-0">
                  <GameLink
                    href={tab.href}
                    transitionLabel={tab.label}
                    transitionAccent={tab.accent}
                    aria-current={active ? "page" : undefined}
                    className={`font-display relative block px-4 py-2 text-lg tracking-wide transition-colors sm:px-6 sm:text-xl ${
                      active ? "bg-ink-950/80 text-fog" : "bg-ink-800/60 text-mist hover:bg-ink-700/80 hover:text-fog"
                    }`}
                  >
                    {tab.label}
                    {active && <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#ff3d7f]" aria-hidden="true" />}
                  </GameLink>
                </li>
              );
            })}
          </ul>
          <span className="keycap ml-1 hidden shrink-0 sm:inline-flex" aria-hidden="true">
            E
          </span>
        </div>
      </nav>
    </header>
  );
}
