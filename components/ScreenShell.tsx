import type { ReactNode } from "react";
import { sections, type SectionKey } from "@/data/site";
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
      <div className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${backgrounds[section]}`} aria-hidden="true">
        {backdrop}
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-6 sm:px-6 sm:pt-10">
        <header className="mb-8 sm:mb-10">
          <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            <span className="rounded bg-accent px-2 py-0.5 text-accent-ink">{s.tag}</span>
            <span className="text-mist">{s.sport}</span>
          </p>
          <h1 id="screen-title" tabIndex={-1} className="font-display glow-text mt-3 text-7xl outline-none sm:text-8xl">
            {s.title}
          </h1>
          <p className="mt-2 max-w-xl text-mist">{s.subtitle}</p>
        </header>
        {children}
      </div>
      <FocusOnArrival targetId="screen-title" />
    </div>
  );
}
