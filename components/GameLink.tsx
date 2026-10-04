"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { AccentKey } from "@/data/site";
import type { SoundName } from "@/lib/sound";
import { useScreenTransition } from "./providers/TransitionProvider";

type GameLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** Text shown on the transition wipe. */
  transitionLabel?: string;
  transitionAccent?: AccentKey;
  sound?: SoundName | null;
};

/** A next/link that plays the game-screen wipe on plain left clicks. */
export function GameLink({ href, transitionLabel, transitionAccent, sound, onClick, ...props }: GameLinkProps) {
  const { navigate } = useScreenTransition();
  return (
    <Link
      href={href}
      {...props}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        navigate(href, { label: transitionLabel, accent: transitionAccent, sound });
      }}
    />
  );
}
