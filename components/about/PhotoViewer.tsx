"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/icons";
import type { AlbumPhoto } from "@/data/albums";

type Props = {
  open: boolean;
  title: string;
  photos: AlbumPhoto[];
  onClose: () => void;
  closeLabel?: string;
};

/** Full-screen photo viewer. Escape, arrows, and swipe all work. */
export function PhotoViewer({ open, title, photos, onClose, closeLabel = "Close photos" }: Props) {
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const liveId = useId();
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const count = photos.length;
  const photoIndex = count > 0 ? Math.min(index, count - 1) : 0;
  const photo = count > 0 ? photos[photoIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    thumbRefs.current[photoIndex]?.scrollIntoView({ inline: "center", block: "nearest", behavior: "auto" });
  }, [photoIndex]);

  const finishClose = () => {
    onClose();
    triggerRef.current?.focus();
  };

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else finishClose();
  };

  const step = (delta: number) => {
    if (count < 2) return;
    setIndex((current) => (current + delta + count) % count);
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={finishClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          step(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          step(-1);
        } else if (event.key === "Home") {
          event.preventDefault();
          setIndex(0);
        } else if (event.key === "End" && count > 0) {
          event.preventDefault();
          setIndex(count - 1);
        }
      }}
      className="album-dialog m-0 flex h-dvh max-h-none w-full max-w-none items-stretch justify-center overflow-hidden border-0 bg-transparent p-0 text-fog sm:items-center sm:p-6"
    >
      {open && photo && (
        <div
          className="dialog-content panel panel-accent flex h-full w-full max-w-3xl flex-col overflow-hidden sm:mx-auto sm:h-auto sm:max-h-full"
          onClick={(event) => event.stopPropagation()}
        >
          <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-mist">
                {photoIndex + 1} / {count}
              </p>
              <h2 id={titleId} className="font-display truncate text-3xl sm:text-4xl">
                {title}
              </h2>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={requestClose}
              className="flex min-h-11 shrink-0 items-center gap-1.5 border border-white/20 px-2.5 text-sm font-semibold hover:border-fog"
              aria-label={closeLabel}
            >
              <CloseIcon className="h-4 w-4" />
              <span className="keycap">Esc</span>
            </button>
          </header>

          <figure
            className="flex min-h-0 flex-1 flex-col bg-ink-950"
            onPointerDown={(event) => {
              if (event.pointerType === "mouse" && event.button !== 0) return;
              swipeRef.current = { x: event.clientX, y: event.clientY };
            }}
            onPointerUp={(event) => {
              const start = swipeRef.current;
              swipeRef.current = null;
              if (!start) return;
              const dx = event.clientX - start.x;
              const dy = event.clientY - start.y;
              if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return;
              step(dx < 0 ? 1 : -1);
            }}
            onPointerCancel={() => {
              swipeRef.current = null;
            }}
          >
            <div className="relative min-h-0 w-full flex-1 sm:h-[min(56dvh,32rem)] sm:flex-none">
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-contain"
                loading="eager"
              />
            </div>
            <figcaption className="border-t border-white/10 px-4 py-3 text-sm text-mist sm:px-5">
              {photo.caption ?? title}
            </figcaption>
            {count > 1 && (
              <div className="flex gap-1 overflow-x-auto border-t border-white/10 px-3 py-2" role="group" aria-label="Photo thumbnails">
                {photos.map((item, i) => (
                  <button
                    key={item.src}
                    type="button"
                    ref={(el) => {
                      thumbRefs.current[i] = el;
                    }}
                    aria-label={`Photo ${i + 1}, ${item.caption ?? title}`}
                    aria-current={i === photoIndex ? "true" : undefined}
                    onClick={() => setIndex(i)}
                    className={`relative h-12 w-12 shrink-0 border ${i === photoIndex ? "border-fog" : "border-white/20"}`}
                  >
                    <Image src={item.src} alt="" fill sizes="48px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
            <p id={liveId} className="sr-only" aria-live="polite">
              {title}, photo {photoIndex + 1} of {count}. {photo.alt} Use the arrow keys to change photos. Escape
              closes this view.
            </p>
          </figure>

          <div className="flex gap-2 border-t border-white/10 px-4 py-3 sm:px-5">
            <button
              type="button"
              onClick={() => step(-1)}
              disabled={count < 2}
              className="btn-ghost min-h-11 flex-1 disabled:opacity-40"
              aria-label="Previous photo"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Prev
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              disabled={count < 2}
              className="btn-game min-h-11 flex-1 disabled:opacity-40"
              aria-label="Next photo"
            >
              Next
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
