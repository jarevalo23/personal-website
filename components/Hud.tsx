"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { fullName, profile } from "@/data/profile";
import { sections } from "@/data/site";
import { GameLink } from "./GameLink";
import { ArrowLeftIcon, Crest, SpeakerIcon } from "./icons";
import { useSound } from "./providers/SoundProvider";
import { useScreenTransition } from "./providers/TransitionProvider";

const initials = `${profile.firstName[0]}${profile.lastName[0]}`;

function isEditable(el: EventTarget | null): el is HTMLElement {
  return el instanceof HTMLElement && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
}

/** Esc anywhere on a sub-screen goes back to the main menu. */
function useEscapeToMenu(enabled: boolean) {
  const { navigate } = useScreenTransition();
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape" || e.defaultPrevented) return;
      // Let open dialogs close themselves first.
      if (document.querySelector("dialog[open]")) return;
      // First Esc inside a form field just leaves the field (so a draft message is never lost by accident).
      if (isEditable(e.target)) {
        e.target.blur();
        return;
      }
      navigate("/", { label: "Main Menu", accent: "menu" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled, navigate]);
}

function SoundToggle() {
  const { enabled, toggle } = useSound();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={enabled}
      title="Toggle sound effects"
      className="flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold uppercase tracking-wider text-fog transition-colors hover:border-accent/60 hover:bg-accent/10"
    >
      <SpeakerIcon muted={!enabled} className="h-5 w-5" />
      <span>Sound</span>
      <span aria-hidden="true" className={enabled ? "text-accent" : "text-mist"}>
        {enabled ? "On" : "Off"}
      </span>
    </button>
  );
}

/** Sticky top bar shared by every screen: crest/back button + sound toggle. */
export function Hud() {
  const pathname = usePathname();
  const isMenu = pathname === "/";
  const section = Object.values(sections).find((s) => s.href === pathname);
  useEscapeToMenu(!isMenu);

  return (
    <header
      className="sticky top-0 z-40 h-(--hud-h) border-b border-white/[0.06] bg-ink-950/75 backdrop-blur-md"
      data-accent={section?.accent ?? "menu"}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-3 px-4 sm:px-6">
        {isMenu ? (
          <div className="flex min-w-0 items-center gap-2.5">
            <Crest initials={initials} className="h-9 w-8 shrink-0" />
            <div className="min-w-0 leading-tight">
              <p className="font-display truncate text-xl tracking-wider">{fullName}</p>
              <p className="hidden truncate text-[11px] uppercase tracking-[0.18em] text-mist sm:block">{profile.tagline}</p>
            </div>
          </div>
        ) : (
          <>
            <GameLink
              href="/"
              transitionLabel="Main Menu"
              transitionAccent="menu"
              className="group flex h-10 items-center gap-2 rounded-lg border border-accent/40 bg-accent/10 pl-2 pr-3 font-display text-xl tracking-wider text-fog transition-colors hover:bg-accent/20"
            >
              <ArrowLeftIcon className="h-5 w-5 text-accent transition-transform group-hover:-translate-x-0.5" />
              Back<span className="sr-only"> to main menu</span>
              <span className="keycap ml-1 hidden font-sans sm:inline-flex" aria-hidden="true">
                Esc
              </span>
            </GameLink>
            <nav aria-label="Breadcrumb" className="hidden min-w-0 md:block">
              <ol className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-mist">
                <li>Main Menu</li>
                <li aria-hidden="true">/</li>
                <li className="truncate text-accent" aria-current="page">
                  {section?.title ?? "Off the pitch"}
                </li>
              </ol>
            </nav>
          </>
        )}
        <div className="ml-auto flex items-center gap-2">
          <SoundToggle />
        </div>
      </div>
    </header>
  );
}
