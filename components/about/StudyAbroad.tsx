"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { studyAbroadCities, type StudyCity } from "@/data/studyAbroad";
import { PhotoViewer } from "./PhotoViewer";

const land = {
  fillRule: "evenodd" as const,
  stroke: "#4a3b32",
  strokeWidth: 5,
  strokeLinejoin: "round" as const,
  strokeLinecap: "round" as const,
};

/** A small palace, drawn next to the Madrid pin. */
function PalaceIcon() {
  return (
    <svg viewBox="0 0 40 36" className="h-9 w-10" aria-hidden="true">
      <path d="M6 32 V16 H12 V10 H16 V16 H24 V10 H28 V16 H34 V32 Z" fill="#fff6e4" stroke="#4a3b32" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M16 10 Q20 2 24 10" fill="#f2c14e" stroke="#4a3b32" strokeWidth="2.2" />
      <circle cx="20" cy="6" r="1.4" fill="#e07a5f" />
      <path d="M10 32 V22 H16 V32 M24 32 V22 H30 V32" fill="#f4d7b0" stroke="#4a3b32" strokeWidth="2" />
    </svg>
  );
}

/** Twin onion domes, drawn next to the Munich pin. */
function TwinDomeIcon() {
  return (
    <svg viewBox="0 0 40 36" className="h-9 w-10" aria-hidden="true">
      <path d="M7 32 V16 H16 V32 M24 32 V16 H33 V32" fill="#f4d7b0" stroke="#4a3b32" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M6 16 Q11.5 4 17 16 M23 16 Q28.5 4 34 16" fill="#3d9b8f" stroke="#4a3b32" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M11.5 8 V5 M28.5 8 V5" stroke="#4a3b32" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Cartoon Europe. Pins are HTML buttons laid over this drawing. */
function EuropeMap() {
  return (
    <svg viewBox="0 0 640 480" className="h-auto w-full" aria-hidden="true">
      <defs>
        <pattern id="map-paper" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="2" r="0.45" fill="#fff8e8" />
          <circle cx="4" cy="5" r="0.35" fill="#4a3b32" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="640" height="480" fill="#8ecae6" />
      <g fill="none" stroke="#5aa7cf" strokeWidth="3" strokeLinecap="round">
        <path d="M24 70 Q48 62 70 74 Q90 86 70 96" />
        <path d="M30 150 Q60 140 88 154" />
        <path d="M470 80 Q510 70 540 86 Q568 100 540 112" />
        <path d="M500 180 Q540 168 575 184" />
        <path d="M40 420 Q80 408 120 422" />
        <path d="M520 400 Q560 388 600 404" />
        <path d="M200 430 Q240 418 280 432" />
      </g>
      <g {...land}>
        <path d="M48 268 Q70 232 128 226 Q168 230 176 268 Q186 312 150 348 Q112 378 72 356 Q40 328 48 268 Z" fill="#f6c878" />
        <path d="M150 176 Q188 150 236 158 Q262 176 248 224 Q230 258 184 252 Q146 236 150 176 Z" fill="#9dce8a" />
        <path d="M128 86 Q156 62 196 70 Q220 92 206 140 Q184 162 150 150 Q122 128 128 86 Z" fill="#7ec8a3" />
        <path d="M86 112 Q104 96 122 108 Q128 132 108 146 Q88 142 86 112 Z" fill="#6fbf8a" />
        <path d="M228 128 Q268 108 324 118 Q348 142 332 188 Q310 222 258 214 Q220 190 228 128 Z" fill="#f3d38a" />
        <path d="M286 214 Q318 206 336 228 Q352 268 330 318 Q314 368 296 352 Q286 300 300 260 Q278 236 286 214 Z" fill="#f0a07a" />
        <path d="M248 36 Q292 16 338 28 Q360 58 340 108 Q300 128 258 112 Q232 80 248 36 Z" fill="#b7e0c2" />
        <path d="M324 206 Q372 188 418 206 Q430 248 400 280 Q352 292 324 260 Q312 232 324 206 Z" fill="#e7b48a" />
        <path d="M404 292 Q428 286 434 318 Q420 356 396 348 Q388 318 404 292 Z" fill="#e8c07a" />
      </g>
      <rect width="640" height="480" fill="url(#map-paper)" opacity="0.55" />
      <g fill="#4a3b32" fontSize="16" fontFamily="var(--font-barlow), sans-serif">
        <text x="86" y="352">Spain</text>
        <text x="172" y="214">France</text>
        <text x="250" y="204">Germany</text>
        <text x="304" y="292">Italy</text>
        <text x="148" y="116">UK</text>
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
            <div className="flex flex-1 items-center justify-center bg-[#8ecae6] sm:block sm:flex-none sm:bg-transparent">
              <div className="relative mx-auto aspect-[640/480] w-full">
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
                  className="map-pin absolute flex min-h-11 -translate-x-1/2 -translate-y-1/2 items-center gap-1.5 px-2 py-1"
                  aria-label={`${item.city}, ${item.country}, ${item.photos.length} photos`}
                >
                  <span className="map-pin-art flex items-center gap-1.5">
                    {item.id === "madrid" ? <PalaceIcon /> : <TwinDomeIcon />}
                    <span className="text-base font-semibold leading-none">{item.city}</span>
                  </span>
                </button>
              ))}
              </div>
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
