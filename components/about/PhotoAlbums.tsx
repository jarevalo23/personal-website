"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/icons";
import { photoAlbums, type PhotoAlbum } from "@/data/albums";

/** Emoji buttons that open a photo viewer. Albums come from data/albums.ts. */
export function PhotoAlbums() {
  const [openEmoji, setOpenEmoji] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const liveId = useId();

  const album = photoAlbums.find((item) => item.emoji === openEmoji) ?? null;
  const count = album?.photos.length ?? 0;
  const photoIndex = count > 0 ? Math.min(index, count - 1) : 0;
  const photo = album && count > 0 ? album.photos[photoIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openEmoji && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [openEmoji]);

  const close = () => {
    setOpenEmoji(null);
    triggerRef.current?.focus();
  };

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else close();
  };

  const step = (delta: number) => {
    if (count < 2) return;
    setIndex((current) => (current + delta + count) % count);
  };

  const open = (item: PhotoAlbum, button: HTMLButtonElement) => {
    if (item.photos.length === 0) return;
    triggerRef.current = button;
    setIndex(0);
    setOpenEmoji(item.emoji);
  };

  if (photoAlbums.length === 0) return null;

  return (
    <section aria-labelledby="albums-title" className="panel panel-accent mt-6 p-6 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-wider text-accent">Albums</p>
      <h2 id="albums-title" className="font-display mt-2 text-4xl sm:text-5xl">
        Photos
      </h2>
      <p className="mt-3 max-w-xl text-fog/90">Tap an emoji. These are stand-in pictures until I add the real ones.</p>

      <ul className="mt-6 grid grid-cols-3 gap-3">
        {photoAlbums.map((item) => {
          const selected = openEmoji === item.emoji;
          const empty = item.photos.length === 0;
          return (
            <li key={item.emoji}>
              <button
                type="button"
                disabled={empty}
                aria-haspopup="dialog"
                aria-expanded={selected}
                aria-controls="photo-viewer"
                onClick={(event) => open(item, event.currentTarget)}
                className={`flex min-h-28 w-full flex-col items-center justify-center gap-1 border px-2 py-3 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                  selected
                    ? "border-fog bg-accent text-accent-ink"
                    : "border-white/20 bg-ink-950/40 text-fog hover:border-fog"
                }`}
              >
                <span className="text-4xl leading-none" aria-hidden="true">
                  {item.emoji}
                </span>
                <span className="font-display text-2xl leading-none sm:text-3xl">{item.label}</span>
                <span className={`text-sm font-semibold ${selected ? "text-accent-ink/80" : "text-mist"}`}>
                  {empty ? "No photos yet" : `${item.photos.length} photos`}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p id={liveId} className="sr-only" aria-live="polite" aria-atomic="true">
        {album && photo ? `${album.label}, photo ${photoIndex + 1} of ${count}. ${photo.alt}` : ""}
      </p>

      <dialog
        id="photo-viewer"
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={close}
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
        {album && photo && (
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
                  {album.label}
                </h2>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={requestClose}
                className="flex min-h-11 shrink-0 items-center gap-1.5 border border-white/20 px-2.5 text-sm font-semibold hover:border-fog"
                aria-label="Close photos"
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
                {photo.caption ?? album.label}
              </figcaption>
              <p className="sr-only">Use the arrow keys to change photos. Escape closes this view.</p>
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
    </section>
  );
}
