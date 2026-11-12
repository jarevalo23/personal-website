"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { studyAbroadCities, type StudyCity } from "@/data/studyAbroad";
import { PhotoViewer } from "./PhotoViewer";

/** A light Europe outline. Pins are HTML buttons laid over this drawing. */
function EuropeMap() {
  return (
    <svg viewBox="0 0 640 480" className="h-auto w-full" aria-hidden="true">
      <rect width="640" height="480" fill="#120c37" />
      <g fill="#2c2379" stroke="rgba(244,241,255,0.45)" strokeWidth="2">
        <path d="M70 250 L155 225 L180 275 L155 345 L85 365 L48 305 Z" />
        <path d="M155 168 L240 155 L255 230 L180 255 L148 220 Z" />
        <path d="M148 78 L205 68 L218 145 L158 158 L128 115 Z" />
        <path d="M92 108 L128 98 L136 148 L98 155 Z" />
        <path d="M235 125 L325 115 L338 205 L250 220 L220 165 Z" />
        <path d="M300 225 L345 218 L360 280 L325 365 L300 340 L312 275 L278 245 Z" />
        <path d="M255 28 L330 18 L348 115 L270 125 L238 70 Z" />
        <path d="M325 215 L420 200 L415 290 L330 285 Z" />
        <path d="M400 300 L430 295 L425 360 L395 355 Z" />
      </g>
      <g fill="#bdb6e8" fontSize="16" fontFamily="var(--font-barlow), sans-serif">
        <text x="55" y="348">Spain</text>
        <text x="168" y="205">France</text>
        <text x="250" y="175">Germany</text>
        <text x="300" y="300">Italy</text>
        <text x="145" y="120">UK</text>
      </g>
    </svg>
  );
}

/** Emoji that opens a map. Each pin opens that city's photos. */
export function StudyAbroadAlbum() {
  const [mapOpen, setMapOpen] = useState(false);
  const [cityId, setCityId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const pinRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const titleId = useId();
  const city: StudyCity | null = studyAbroadCities.find((item) => item.id === cityId) ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (mapOpen && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [mapOpen]);

  const finishClose = () => {
    setMapOpen(false);
    setCityId(null);
    triggerRef.current?.focus();
  };

  const requestClose = () => {
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    else finishClose();
  };

  const movePin = (from: number, delta: number) => {
    const next = (from + delta + studyAbroadCities.length) % studyAbroadCities.length;
    pinRefs.current[next]?.focus();
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={mapOpen}
        onClick={(event) => {
          triggerRef.current = event.currentTarget;
          setCityId(null);
          setMapOpen(true);
        }}
        className={`flex min-h-28 w-full flex-col items-center justify-center gap-1 border px-2 py-3 text-center transition-colors ${
          mapOpen ? "border-fog bg-accent text-accent-ink" : "border-white/20 bg-ink-950/40 text-fog hover:border-fog"
        }`}
      >
        <span className="text-4xl leading-none" aria-hidden="true">
          🗺️
        </span>
        <span className="font-display text-2xl leading-none sm:text-3xl">Study abroad</span>
        <span className={`text-sm font-semibold ${mapOpen ? "text-accent-ink/80" : "text-mist"}`}>
          {studyAbroadCities.length} cities
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={finishClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
        className="album-dialog m-0 flex h-dvh max-h-none w-full max-w-none items-stretch justify-center overflow-hidden border-0 bg-transparent p-0 text-fog sm:items-center sm:p-6"
      >
        {mapOpen && (
          <div
            className="dialog-content panel panel-accent flex h-full w-full max-w-3xl flex-col overflow-hidden sm:mx-auto sm:h-auto sm:max-h-full"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="min-w-0">
                <h2 id={titleId} className="font-display text-3xl sm:text-4xl">
                  Study abroad
                </h2>
                <p className="mt-1 text-sm text-mist">Pick a city.</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={requestClose}
                className="flex min-h-11 shrink-0 items-center gap-1.5 border border-white/20 px-2.5 text-sm font-semibold hover:border-fog"
                aria-label="Close map"
              >
                <CloseIcon className="h-4 w-4" />
                <span className="keycap">Esc</span>
              </button>
            </header>
            <div className="relative bg-ink-950">
              <EuropeMap />
              {studyAbroadCities.map((item, i) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    pinRefs.current[i] = el;
                  }}
                  type="button"
                  onClick={() => setCityId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
                      event.preventDefault();
                      movePin(i, 1);
                    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
                      event.preventDefault();
                      movePin(i, -1);
                    }
                  }}
                  style={{ left: `${item.pin.x}%`, top: `${item.pin.y}%` }}
                  className="absolute flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center gap-2 border border-fog bg-accent px-3 text-accent-ink"
                  aria-label={`${item.city}, ${item.country}, ${item.photos.length} photos`}
                >
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-accent-ink" aria-hidden="true" />
                  <span className="font-display text-xl leading-none">{item.city}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </dialog>

      <PhotoViewer
        key={city?.id ?? "none"}
        open={city !== null}
        title={city ? `${city.city}` : ""}
        photos={city?.photos ?? []}
        onClose={() => setCityId(null)}
        closeLabel="Back to the map"
      />
    </>
  );
}
