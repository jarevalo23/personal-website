"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { europeLabels, europeLands, europeView, europeWaves } from "@/data/europeMap";
import { studyAbroadCities, type StudyCity } from "@/data/studyAbroad";
import { PhotoViewer } from "./PhotoViewer";

/** A small palace, drawn next to the Madrid pin. */
function PalaceIcon() {
  return (
    <svg viewBox="0 0 40 36" className="h-7 w-8" aria-hidden="true">
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
    <svg viewBox="0 0 40 36" className="h-7 w-8" aria-hidden="true">
      <path d="M7 32 V16 H16 V32 M24 32 V16 H33 V32" fill="#f4d7b0" stroke="#4a3b32" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M6 16 Q11.5 4 17 16 M23 16 Q28.5 4 34 16" fill="#3d9b8f" stroke="#4a3b32" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M11.5 8 V5 M28.5 8 V5" stroke="#4a3b32" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Cartoon styling over real Natural Earth coastlines. Pins sit on top. */
function EuropeMap() {
  return (
    <svg viewBox={`0 0 ${europeView.width} ${europeView.height}`} className="h-auto w-full" aria-hidden="true">
      <defs>
        <pattern id="map-paper" width="6" height="6" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="2" r="0.45" fill="#fff8e8" />
          <circle cx="4" cy="5" r="0.35" fill="#4a3b32" opacity="0.18" />
        </pattern>
      </defs>
      <rect width={europeView.width} height={europeView.height} fill="#8ecae6" />
      <g fill="none" stroke="#5aa7cf" strokeWidth="3" strokeLinecap="round">
        {europeWaves.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g stroke="#4a3b32" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        {europeLands.map((land) => (
          <path key={land.name} d={land.d} fill={land.fill} />
        ))}
      </g>
      <rect width={europeView.width} height={europeView.height} fill="url(#map-paper)" opacity="0.45" />
      <g fill="#4a3b32" fontSize="15" fontFamily="var(--font-barlow), sans-serif">
        {europeLabels.map((label) => (
          <text key={label.name} x={label.x} y={label.y}>
            {label.name}
          </text>
        ))}
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
              <div
                className="relative mx-auto w-full"
                style={{ aspectRatio: `${europeView.width} / ${europeView.height}` }}
              >
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
                  className="map-pin absolute flex min-h-11 items-center gap-1.5 px-2 py-1"
                  aria-label={`${item.city}, ${item.country}, ${item.photos.length} photos`}
                >
                  <span className="map-pin-art flex items-center gap-1.5">
                    {item.id === "madrid" ? <PalaceIcon /> : <TwinDomeIcon />}
                    <span className="text-sm font-semibold leading-none">{item.city}</span>
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
