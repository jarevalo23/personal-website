import type { ReactNode } from "react";
import { sections, type SectionKey } from "@/data/site";
import { GameBackground } from "./GameBackground";
import { FocusOnArrival } from "./FocusOnArrival";

const backgrounds: Record<SectionKey, string> = {
  about: "scene-pitch",
  projects: "scene-court",
  fun: "scene-pool",
  contact: "scene-press",
};

/** Common frame for every sub-screen: accent colour, themed backdrop and title block. */
export function ScreenShell({
  section,
  children,
  backdrop,
}: {
  section: SectionKey;
  children: ReactNode;
  /** Extra decorative layers (e.g. water caustics). */
  backdrop?: ReactNode;
}) {
  const s = sections[section];
  return (
    <div data-accent={s.accent} className="relative isolate min-h-[calc(100dvh-var(--hud-h))]">
      <GameBackground art={false} />
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className={backgrounds[section]} />
        {backdrop}
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-4 sm:px-6 sm:pt-6">
        <header className="mb-8 sm:mb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            {s.tag} · {s.sport}
          </p>
          <h1 id="screen-title" tabIndex={-1} className="font-display mt-1 text-6xl outline-none sm:text-7xl">
            {s.title}
          </h1>
          <p className="mt-1 max-w-xl text-lg text-fog/80">{s.subtitle}</p>
        </header>
        {children}
      </div>
      <FocusOnArrival targetId="screen-title" />
    </div>
  );
}
