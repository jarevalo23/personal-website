"use client";

import { usePathname } from "next/navigation";
import { profile } from "@/data/profile";
import { site } from "@/data/site";
import { useScreenTransition } from "./providers/TransitionProvider";

/**
 * Bottom controller prompts, like a console game: "(↵) Select  (Esc) Back"
 * on the left, the site wordmark on the right. "Back" is a real button.
 */
export function PromptBar() {
  const pathname = usePathname();
  const { navigate } = useScreenTransition();
  const isMenu = pathname === "/";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-ink-950/95 via-ink-950/70 to-transparent">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-5 px-4 text-sm font-semibold sm:px-6">
        <span className="hidden items-center gap-2 text-fog/90 sm:flex" aria-hidden="true">
          <span className="keycap">↵</span> Select
        </span>
        {!isMenu && (
          <button
            type="button"
            onClick={() => navigate("/", { label: "Main Menu", accent: "menu" })}
            className="pointer-events-auto flex items-center gap-2 py-2 text-fog hover:text-white"
          >
            <span className="keycap" aria-hidden="true">
              Esc
            </span>
            Back<span className="sr-only"> to main menu</span>
          </button>
        )}
        <p className="ml-auto flex items-center gap-2 font-display text-xl tracking-wide text-fog/90" aria-hidden="true">
          <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-fog/80 text-[10px] leading-none">
            {profile.firstName[0]}
            {profile.lastName[0]}
          </span>
          {profile.lastName} {site.seasonLabel.replace(/\D/g, "")}
        </p>
      </div>
    </div>
  );
}
