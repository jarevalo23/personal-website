"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, ExternalIcon, GitHubIcon } from "@/components/icons";
import type { Project } from "@/data/projects";

type Props = {
  project: Project | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  position: { index: number; total: number };
};

/** Project "box score" in a native modal <dialog> (focus trap + Esc for free). */
export function ProjectDialog({ project, onClose, onPrev, onNext, position }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = project !== null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        // Clicking the backdrop (the dialog element itself) closes it.
        if (e.target === e.currentTarget) onClose();
      }}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") onNext();
        if (e.key === "ArrowLeft") onPrev();
      }}
      aria-labelledby="project-title"
      className="project-dialog m-0 ml-auto h-dvh max-h-none w-full max-w-2xl overflow-y-auto bg-ink-900 p-0 text-fog backdrop:bg-ink-950/75 backdrop:backdrop-blur-sm sm:border-l sm:border-accent/30"
      data-accent="basketball"
    >
      {project && (
        <div key={project.slug} className="dialog-content flex min-h-full flex-col">
          <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/[0.07] bg-ink-900/90 px-5 py-3 backdrop-blur">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-mist">
              Box score · {position.index + 1}/{position.total}
            </p>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={onPrev} className="rounded-lg p-2 hover:bg-white/10" aria-label="Previous project">
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <button type="button" onClick={onNext} className="rounded-lg p-2 hover:bg-white/10" aria-label="Next project">
                <ArrowRightIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="ml-1 flex items-center gap-1.5 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs font-semibold hover:border-accent"
                aria-label="Close project details"
                ref={closeRef}
              >
                <CloseIcon className="h-4 w-4" />
                <span className="keycap hidden sm:inline-flex">Esc</span>
              </button>
            </div>
          </header>

          <div className="flex-1 space-y-6 px-5 py-6 sm:px-8">
            <div className="flex items-start gap-4">
              <span className="font-display flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-accent text-5xl text-accent-ink">
                {project.jersey}
              </span>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">
                  {project.role} · {project.year} · {project.status}
                </p>
                <h2 id="project-title" className="font-display text-5xl leading-none">
                  {project.title}
                </h2>
              </div>
            </div>

            {project.screenshots.length > 0 && (
              <div className="space-y-3">
                {project.screenshots.map((shot) => (
                  <div
                    key={shot.src}
                    className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/10 bg-ink-800"
                  >
                    <Image
                      src={shot.src}
                      alt={shot.alt}
                      fill
                      sizes="(min-width: 640px) 600px, 100vw"
                      unoptimized={shot.src.endsWith(".svg")}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3 leading-relaxed text-fog/90">
              {project.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h3 className="font-display text-2xl text-accent">Highlights</h3>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {project.highlights.map((h) => (
                    <li key={h} className="flex gap-2">
                      <span className="text-accent" aria-hidden="true">
                        ●
                      </span>
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="font-display text-2xl text-accent">Tech stack</h3>
              <ul className="mt-2 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li key={t} className="rounded-md border border-accent/30 bg-accent/10 px-2.5 py-1 text-sm font-semibold">
                    {t}
                  </li>
                ))}
              </ul>
            </div>

            {(project.links.github || project.links.demo) && (
              <div className="flex flex-wrap gap-3 pt-2">
                {project.links.github && (
                  <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                    <GitHubIcon className="h-5 w-5" /> Source code
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
                {project.links.demo && (
                  <a href={project.links.demo} target="_blank" rel="noopener noreferrer" className="btn-game">
                    Live demo <ExternalIcon className="h-5 w-5" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
