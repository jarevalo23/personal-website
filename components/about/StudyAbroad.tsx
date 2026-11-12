"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import {
  europeBalloon,
  europeCanaryInset,
  europeLabels,
  europeLandmarks,
  europeLands,
  europeView,
  europeWaves,
} from "@/data/europeMap";
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

function Landmark({ id }: { id: string }) {
  if (id === "tree") {
    return (
      <g>
        <rect x="-5" y="8" width="10" height="22" rx="2" fill="#8a5a32" />
        <circle cx="0" cy="-8" r="20" fill="#2f9e62" />
        <circle cx="-12" cy="-2" r="12" fill="#3caf70" />
        <circle cx="13" cy="-1" r="11" fill="#278a54" />
        <circle cx="2" cy="-16" r="8" fill="#67c98a" />
      </g>
    );
  }
  if (id === "eiffel") {
    return (
      <g fill="none" stroke="#3a2a22" strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round">
        <path d="M-22 28 H22" />
        <path d="M-16 28 Q-14 18 -8 10 L0 -30 L8 10 Q14 18 16 28" />
        <path d="M-12 28 L-6 10 M12 28 L6 10" />
        <path d="M-14 16 H14 M-10 4 H10 M-6 -8 H6" />
        <path d="M-3 -30 H3 L0 -38 Z" fill="#3a2a22" />
        <path d="M-18 28 Q0 18 18 28" />
      </g>
    );
  }
  if (id === "bigben") {
    return (
      <g stroke="#3a2a22" strokeWidth="1.6" strokeLinejoin="round">
        <rect x="-10" y="-8" width="20" height="40" fill="#f4e2b0" />
        <path d="M-13 -8 H13 L0 -26 Z" fill="#6b2f86" />
        <rect x="-3" y="-26" width="6" height="6" fill="#f4e2b0" />
        <path d="M-1 -26 V-34 H1 V-26" fill="#3a2a22" />
        <circle cx="0" cy="4" r="6" fill="#fff" />
        <path d="M0 4 V-1 M0 4 H4" fill="none" />
        <rect x="-4" y="16" width="3" height="6" fill="#6b2f86" />
        <rect x="1" y="16" width="3" height="6" fill="#6b2f86" />
      </g>
    );
  }
  if (id === "windmill") {
    return (
      <g stroke="#3a2a22" strokeWidth="1.6" strokeLinejoin="round">
        <path d="M-10 28 L-4 4 H4 L10 28 Z" fill="#c46b4a" />
        <rect x="-3" y="16" width="6" height="8" fill="#f4e2b0" />
        <circle cx="0" cy="2" r="3" fill="#f0b429" />
        <path d="M0 2 L2 -24 L-8 -16 Z" fill="#fff" />
        <path d="M0 2 L-2 24 L8 16 Z" fill="#fff" />
        <path d="M0 2 L24 -2 L16 -10 Z" fill="#fff" />
        <path d="M0 2 L-24 2 L-16 10 Z" fill="#fff" />
      </g>
    );
  }
  if (id === "sagrada") {
    return (
      <g fill="#e7d7c1" stroke="#3a2a22" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M-18 24 L-14 -4 L-8 24 Z" />
        <path d="M-5 24 L0 -22 L5 24 Z" />
        <path d="M8 24 L14 0 L20 24 Z" />
        <circle cx="0" cy="-24" r="2.2" fill="#f0b429" />
      </g>
    );
  }
  if (id === "tram") {
    return (
      <g stroke="#3a2a22" strokeWidth="1.4" strokeLinejoin="round">
        <path d="M-6 -8 L-2 -16 H6 L10 -8" fill="#e23b4a" />
        <rect x="-12" y="-8" width="28" height="18" rx="2" fill="#f0b429" />
        <rect x="-8" y="-4" width="6" height="5" fill="#d7f6ff" />
        <rect x="2" y="-4" width="6" height="5" fill="#d7f6ff" />
        <circle cx="-6" cy="12" r="2.4" fill="#3a2a22" />
        <circle cx="8" cy="12" r="2.4" fill="#3a2a22" />
      </g>
    );
  }
  if (id === "gate") {
    return (
      <g fill="#f4e2b0" stroke="#3a2a22" strokeWidth="1.5" strokeLinejoin="round">
        <rect x="-22" y="4" width="5" height="22" />
        <rect x="-12" y="4" width="5" height="22" />
        <rect x="-2" y="4" width="4" height="22" />
        <rect x="7" y="4" width="5" height="22" />
        <rect x="17" y="4" width="5" height="22" />
        <rect x="-26" y="-2" width="52" height="7" />
        <path d="M-8 -2 Q0 -14 8 -2" fill="#6b2f86" />
        <path d="M-4 -8 L0 -16 L4 -8" fill="#e23b4a" />
      </g>
    );
  }
  return (
    <g transform="rotate(7)">
      <ellipse cx="0" cy="-16" rx="11" ry="4.5" fill="#f4e2b0" stroke="#3a2a22" strokeWidth="1.5" />
      <ellipse cx="0" cy="-6" rx="11" ry="4.5" fill="#fff" stroke="#3a2a22" strokeWidth="1.5" />
      <ellipse cx="0" cy="4" rx="11" ry="4.5" fill="#f4e2b0" stroke="#3a2a22" strokeWidth="1.5" />
      <ellipse cx="0" cy="14" rx="11" ry="4.5" fill="#fff" stroke="#3a2a22" strokeWidth="1.5" />
      <ellipse cx="0" cy="24" rx="11" ry="4.5" fill="#f4e2b0" stroke="#3a2a22" strokeWidth="1.5" />
      <path d="M-6 -16 H6 M-6 -6 H6 M-6 4 H6 M-6 14 H6" stroke="#3a2a22" strokeWidth="1" />
    </g>
  );
}

/** Cartoon styling over a Mercator crop of Europe. Pins sit on top. */
function EuropeMap() {
  return (
    <svg viewBox={`0 0 ${europeView.width} ${europeView.height}`} className="h-auto w-full" aria-hidden="true">
      <rect width={europeView.width} height={europeView.height} fill="#79d0f5" />
      <g fill="none" stroke="#4aa3d8" strokeWidth="3" strokeLinecap="round">
        {europeWaves.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <g fill="none" stroke="#d7f6ff" strokeWidth="14" strokeLinejoin="round">
        {europeLands.map((land) => (
          <path key={`halo-${land.name}`} d={land.d} />
        ))}
      </g>
      <g>
        {europeLands.map((land) => (
          <path key={land.name} d={land.d} fill={land.fill} fillRule="evenodd" />
        ))}
      </g>
      <g transform={`translate(${europeBalloon.x} ${europeBalloon.y}) scale(1.35)`}>
        <path d="M0 8 C-28 8 -32 -22 0 -46 C32 -22 28 8 0 8 Z" fill="#e23b4a" />
        <path d="M0 8 C-16 8 -18 -10 0 -28 C18 -10 16 8 0 8 Z" fill="#f0b429" />
        <path d="M-6 8 C-4 -8 4 -8 6 8" fill="none" stroke="#3a2a22" strokeWidth="1.4" />
        <path d="M-8 8 H8 L5 18 H-5 Z" fill="#f4e2b0" stroke="#3a2a22" strokeWidth="1.4" />
        <path d="M-10 8 L-6 18 M10 8 L6 18" stroke="#3a2a22" strokeWidth="1.2" />
      </g>
      {europeLandmarks.map((mark) => (
        <g key={mark.id} transform={`translate(${mark.x} ${mark.y}) scale(${mark.scale ?? 1.75})`}>
          <Landmark id={mark.id} />
        </g>
      ))}
      <g
        fill="#fff"
        stroke="#16324a"
        strokeWidth="3"
        paintOrder="stroke"
        fontFamily="var(--font-barlow), sans-serif"
        fontWeight="700"
        textAnchor="middle"
      >
        {europeLabels.map((label) => (
          <text key={label.name} x={label.x} y={label.y} fontSize={label.font}>
            {label.name.toUpperCase()}
          </text>
        ))}
      </g>
      <g transform={`translate(${europeCanaryInset.x} ${europeCanaryInset.y})`}>
        <rect
          width={europeCanaryInset.width}
          height={europeCanaryInset.height}
          fill="#79d0f5"
          stroke="#16324a"
          strokeWidth="3"
        />
        {europeCanaryInset.lands.map((land) => (
          <path key={land.name} d={land.d} fill={land.fill} fillRule="evenodd" />
        ))}
        <text
          x={europeCanaryInset.width / 2}
          y={16}
          fill="#fff"
          stroke="#16324a"
          strokeWidth="2.4"
          paintOrder="stroke"
          fontSize="11"
          fontWeight="700"
          textAnchor="middle"
          fontFamily="var(--font-barlow), sans-serif"
        >
          CANARY ISLANDS
        </text>
      </g>
    </svg>
  );
}

/** Map dialog. About and Fun Stuff both open this. Each pin opens that city's photos. */
export function StudyAbroadMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [cityId, setCityId] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const pinRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const titleId = useId();
  const city: StudyCity | null = studyAbroadCities.find((item) => item.id === cityId) ?? null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      triggerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      closeRef.current?.focus();
    }
  }, [open]);

  const finishClose = () => {
    setCityId(null);
    onClose();
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
      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        onClose={finishClose}
        onClick={(event) => {
          if (event.target === event.currentTarget) requestClose();
        }}
        className="album-dialog m-0 flex h-dvh max-h-none w-full max-w-none items-stretch justify-center overflow-hidden border-0 bg-transparent p-0 text-fog sm:items-center sm:p-6"
      >
        {open && (
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
            <div className="flex flex-1 items-center justify-center bg-[#79d0f5] sm:block sm:flex-none sm:bg-[#79d0f5]">
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
                  className={`map-pin absolute flex items-center gap-1.5 px-2 py-1 ${
                    item.id === "canaries" ? "min-h-0 px-1.5 py-0.5 text-[11px]" : "min-h-11"
                  }`}
                  aria-label={`${item.city}, ${item.country}, ${item.photos.length} photos`}
                >
                  <span className="map-pin-art flex items-center gap-1.5">
                    {item.id === "madrid" ? <PalaceIcon /> : item.id === "munich" ? <TwinDomeIcon /> : null}
                    <span className={`font-semibold leading-none ${item.id === "canaries" ? "text-[11px]" : "text-sm"}`}>
                      {item.city}
                    </span>
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

/** Emoji that opens the study-abroad map. */
export function StudyAbroadAlbum() {
  const [mapOpen, setMapOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={mapOpen}
        onClick={() => setMapOpen(true)}
        className={`flex min-h-28 w-full flex-col items-center justify-center gap-1 border px-2 py-3 text-center transition-colors ${
          mapOpen ? "border-fog bg-accent text-accent-ink" : "border-white/20 bg-ink-950/40 text-fog hover:border-fog"
        }`}
      >
        <span className="text-4xl leading-none" aria-hidden="true">
          🗺️
        </span>
        <span className="font-display text-2xl leading-none sm:text-3xl">Study abroad</span>
        <span className={`text-sm font-semibold ${mapOpen ? "text-accent-ink/80" : "text-mist"}`}>
          {studyAbroadCities.length} places
        </span>
      </button>
      <StudyAbroadMap open={mapOpen} onClose={() => setMapOpen(false)} />
    </>
  );
}
