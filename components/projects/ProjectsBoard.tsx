"use client";

import { AnimatePresence, m } from "framer-motion";
import { useState } from "react";
import { useSound } from "@/components/providers/SoundProvider";
import { projects, type Project } from "@/data/projects";
import { ProjectDialog } from "./ProjectDialog";

/* Half court, 10 SVG units per foot: 50ft wide, 47ft deep, baseline at the top. */
const W = 500;
const H = 470;
const HOOP = { x: 250, y: 52.5 };

function Court() {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden="true">
      <defs>
        <pattern id="court-wood" width="40" height={H} patternUnits="userSpaceOnUse">
          <rect width="40" height={H} fill="#1a1008" />
          <rect width="1" height={H} fill="#ff8a1f" fillOpacity="0.08" />
          <rect x="20" width="1" height={H} fill="#ff8a1f" fillOpacity="0.05" />
        </pattern>
        <radialGradient id="court-glow" cx="0.5" cy="0.1" r="0.7">
          <stop offset="0" stopColor="#ff8a1f" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ff8a1f" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#court-wood)" />
      <rect width={W} height={H} fill="url(#court-glow)" />
      {/* paint */}
      <rect x="170" y="0" width="160" height="190" fill="#ff8a1f" fillOpacity="0.1" />
      <g fill="none" stroke="#ffb066" strokeOpacity="0.75" strokeWidth="3">
        <rect x="1.5" y="1.5" width={W - 3} height={H - 3} />
        <rect x="170" y="0" width="160" height="190" />
        <circle cx="250" cy="190" r="60" />
        <path d="M30 0 V142 A237.5 237.5 0 0 0 470 142 V0" />
        <path d="M210 52.5 A40 40 0 0 0 290 52.5" />
        <path d="M190 470 A60 60 0 0 1 310 470" />
      </g>
      <path
        d="M190 190 A60 60 0 0 1 310 190"
        fill="none"
        stroke="#ffb066"
        strokeOpacity="0.4"
        strokeWidth="3"
        strokeDasharray="10 10"
      />
      {/* hoop */}
      <path d="M220 40 H280" stroke="#eef2ff" strokeWidth="4" />
      <circle cx={HOOP.x} cy={HOOP.y} r="9" fill="none" stroke="#ff8a1f" strokeWidth="3.5" />
    </svg>
  );
}

function tooltipPlacement(p: Project) {
  const vertical = p.court.y < 38 ? "top-full mt-3" : "bottom-full mb-3";
  const horizontal = p.court.x > 68 ? "right-0" : p.court.x < 32 ? "left-0" : "left-1/2 -translate-x-1/2";
  return `${vertical} ${horizontal}`;
}

/** Shot-chart court + team roster. Both open the same project detail panel. */
export function ProjectsBoard() {
  const { play } = useSound();
  const [hovered, setHovered] = useState<string | null>(null);
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const open = (slug: string) => {
    play("select");
    setOpenSlug(slug);
  };
  const preview = (slug: string | null) => {
    if (slug && slug !== hovered) play("move");
    setHovered(slug);
  };

  const openIndex = projects.findIndex((p) => p.slug === openSlug);

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      {/* Shot chart */}
      <section aria-labelledby="court-title" className="panel panel-accent p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="court-title" className="font-display text-3xl">
            Shot Chart
          </h2>
          <p className="text-xs text-mist">Hover a spot to scout · click for the full box score</p>
        </div>
        <div className="relative mx-auto max-w-[560px] overflow-visible rounded-xl">
          <div className="overflow-hidden rounded-xl">
            <Court />
          </div>
          {projects.map((p) => {
            const active = hovered === p.slug;
            return (
              <div
                key={p.slug}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${p.court.x}%`, top: `${p.court.y}%`, zIndex: active ? 20 : 10 }}
              >
                <button
                  type="button"
                  onClick={() => open(p.slug)}
                  onMouseEnter={() => preview(p.slug)}
                  onMouseLeave={() => preview(null)}
                  onFocus={() => preview(p.slug)}
                  onBlur={() => preview(null)}
                  aria-label={`#${p.jersey} ${p.title} — ${p.summary}`}
                  aria-haspopup="dialog"
                  className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 font-display text-xl transition-transform duration-200 sm:h-12 sm:w-12 ${
                    active ? "scale-115 border-fog bg-accent text-accent-ink" : "border-accent bg-ink-950/85 text-accent"
                  }`}
                >
                  <span className="pulse-ring absolute inset-0 rounded-full border-2 border-accent" aria-hidden="true" />
                  {p.jersey}
                </button>
                <AnimatePresence>
                  {active && (
                    <m.div
                      className={`pointer-events-none absolute z-30 w-64 ${tooltipPlacement(p)}`}
                      initial={{ opacity: 0, y: 6, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.96 }}
                      transition={{ duration: 0.16 }}
                      aria-hidden="true"
                    >
                      <div className="panel panel-accent p-3.5 text-left">
                        <p className="text-xs font-bold uppercase tracking-wider text-accent">
                          #{p.jersey} · {p.role}
                        </p>
                        <p className="font-display mt-0.5 text-2xl leading-none">{p.title}</p>
                        <p className="mt-1.5 text-xs text-mist">{p.summary}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {p.tech.map((t) => (
                            <span key={t} className="rounded bg-white/[0.07] px-1.5 py-0.5 text-xs font-semibold">
                              {t}
                            </span>
                          ))}
                        </div>
                        <p className="mt-2 text-xs font-bold uppercase tracking-wider text-accent">Click for details ▸</p>
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* Roster */}
      <section aria-labelledby="roster-title" className="panel p-4 sm:p-5">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="roster-title" className="font-display text-3xl">
            Roster
          </h2>
          <p className="text-xs uppercase tracking-wider text-mist">{projects.length} players</p>
        </div>
        <ul className="space-y-3">
          {projects.map((p) => {
            const active = hovered === p.slug;
            return (
              <li key={p.slug}>
                <button
                  type="button"
                  onClick={() => open(p.slug)}
                  onMouseEnter={() => preview(p.slug)}
                  onMouseLeave={() => preview(null)}
                  aria-haspopup="dialog"
                  className={`group flex w-full items-stretch gap-4 rounded-xl border p-3 text-left transition-all duration-200 ${
                    active ? "border-accent bg-accent/10" : "border-white/[0.08] bg-ink-950/40 hover:border-accent/50"
                  }`}
                >
                  <span className="font-display flex w-14 shrink-0 items-center justify-center rounded-lg bg-accent text-4xl text-accent-ink">
                    {p.jersey}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-mist">
                      {p.role} · {p.year}
                      <span
                        className={`rounded px-1.5 py-0.5 ${p.status === "In progress" ? "bg-press/15 text-press" : "bg-accent/15 text-accent"}`}
                      >
                        {p.status}
                      </span>
                    </span>
                    <span className="font-display mt-0.5 block text-2xl leading-none text-fog">{p.title}</span>
                    <span className="mt-1 block text-sm text-mist">{p.summary}</span>
                    <span className="mt-2 flex flex-wrap gap-1">
                      {p.tech.map((t) => (
                        <span key={t} className="rounded bg-white/[0.07] px-1.5 py-0.5 text-xs font-semibold text-fog">
                          {t}
                        </span>
                      ))}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <ProjectDialog
        project={openIndex >= 0 ? projects[openIndex] : null}
        onClose={() => setOpenSlug(null)}
        onPrev={() => setOpenSlug(projects[(openIndex - 1 + projects.length) % projects.length].slug)}
        onNext={() => setOpenSlug(projects[(openIndex + 1) % projects.length].slug)}
        position={{ index: openIndex, total: projects.length }}
      />
    </div>
  );
}
