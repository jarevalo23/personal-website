"use client";

import type { ReactNode } from "react";
import { GameLink } from "@/components/GameLink";
import { ExternalIcon } from "@/components/icons";
import { useSound } from "@/components/providers/SoundProvider";
import type { AccentKey } from "@/data/site";

export type MenuTileProps = {
  index: number;
  area: string;
  title: string;
  /** Shown in the description line under the grid when this tile is selected. */
  description: string;
  accent: AccentKey;
  /** Internal link, external link, or an in-place action (e.g. copy email). */
  kind: "link" | "external" | "action";
  href?: string;
  onActivate?: () => void;
  /** Art and extra content, absolutely positioned inside the tile. */
  children?: ReactNode;
  /** Small label under the title (e.g. "Copied!"). */
  badge?: ReactNode;
  selected: boolean;
  onSelect: (index: number) => void;
  setRef: (index: number, el: HTMLElement | null) => void;
};

/** One flat FIFA 21-style menu tile. Selection = solid purple fill + white rim. */
export function MenuTile({
  index,
  area,
  title,
  accent,
  kind,
  href = "#",
  onActivate,
  children,
  badge,
  selected,
  onSelect,
  setRef,
}: MenuTileProps) {
  const { play } = useSound();

  const shared = {
    ref: (el: HTMLElement | null) => setRef(index, el),
    className: "menu-tile tile-enter group relative block overflow-hidden text-left text-fog outline-offset-2",
    style: { gridArea: area, "--i": index } as React.CSSProperties,
    "data-selected": selected,
    onMouseEnter: () => onSelect(index),
    onFocus: () => onSelect(index),
  };

  const body = (
    <>
      <div className="tile-art pointer-events-none absolute inset-0">{children}</div>
      <div className="tile-shine pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="relative z-10 p-4 sm:p-5">
        <h2 className="font-display text-[1.65rem] leading-[0.95] sm:text-3xl xl:text-[2.15rem]">
          {title}
          {kind === "external" && (
            <>
              <ExternalIcon className="ml-1 inline h-5 w-5 align-baseline opacity-80" />
              <span className="sr-only"> (opens in a new tab)</span>
            </>
          )}
        </h2>
        {badge}
      </div>
    </>
  );

  if (kind === "action") {
    return (
      <button
        type="button"
        {...shared}
        ref={(el) => setRef(index, el)}
        onClick={() => {
          play("select");
          onActivate?.();
        }}
      >
        {body}
      </button>
    );
  }
  if (kind === "external") {
    return (
      <a {...shared} href={href} target="_blank" rel="noopener noreferrer" onClick={() => play("select")}>
        {body}
      </a>
    );
  }
  return (
    <GameLink {...shared} href={href} transitionLabel={title} transitionAccent={accent}>
      {body}
    </GameLink>
  );
}
