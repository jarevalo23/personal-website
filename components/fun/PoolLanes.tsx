"use client";

import { useState } from "react";
import { GalleryDialogs } from "@/components/gallery/GalleryDialogs";
import { funItems, type FunGallery, type FunItem } from "@/data/fun";
import { LiteYouTube } from "./LiteYouTube";
import { VideoClip } from "./VideoClip";

/** Lane rope: alternating floats like a real competition pool. */
function LaneRope() {
  return (
    <div
      className="wave-bob h-2.5 rounded-full opacity-80"
      style={{
        background: "repeating-linear-gradient(90deg, #ff4d5e 0 10px, #eef2ff 10px 20px, #2ee6ff 20px 30px, #eef2ff 30px 40px)",
        maskImage: "radial-gradient(circle at center, black 55%, transparent 56%)",
        maskSize: "10px 10px",
        maskRepeat: "repeat-x",
      }}
      aria-hidden="true"
    />
  );
}

const galleryButtonLabel: Record<FunGallery, string> = {
  sports: "Open sports album",
  "study-abroad": "Open study abroad map",
};

function GalleryHint({ gallery }: { gallery: FunGallery }) {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-white/70 bg-ink-950 text-accent">
      {gallery === "study-abroad" ? (
        <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
          <path d="M1.5 3.5 5.5 2l5 1.5 4-1.5v9l-4 1.5-5-1.5-4 1.5v-9z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M5.5 2v9M10.5 3.5v9" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ) : (
        <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden="true">
          <path d="M2 5.5h2.2L5.5 4h5l1.3 1.5H14V13H2V5.5z" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
          <circle cx="8" cy="9" r="2" fill="none" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
    </span>
  );
}

function LaneCopy({ item }: { item: FunItem }) {
  return (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">{item.category}</p>
        <h3 className="font-display text-2xl leading-tight sm:text-3xl">{item.title}</h3>
        <p className="mt-1 text-sm text-mist">{item.description}</p>
      </div>
      {(item.tags?.length || item.link) && (
        <div className="flex flex-wrap items-center gap-2 sm:max-w-[16rem] sm:justify-end">
          {item.tags?.map((tag) => (
            <span key={tag} className="rounded-full border border-pool/25 bg-pool/10 px-2.5 py-0.5 text-xs font-semibold">
              {tag}
            </span>
          ))}
          {item.link && (
            <a
              href={item.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline text-sm font-semibold text-accent"
            >
              {item.link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
        </div>
      )}
    </>
  );
}

const emojiClass =
  "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border bg-ink-950/50 text-2xl";

function LaneBody({
  item,
  index,
  galleryOpen,
  onOpen,
}: {
  item: FunItem;
  index: number;
  galleryOpen: boolean;
  onOpen: (gallery: FunGallery) => void;
}) {
  const gallery = item.gallery;

  return (
    <>
      <div
        className="pointer-events-none absolute inset-x-24 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink-950/40 transition-colors duration-300 group-hover:bg-pool/25"
        aria-hidden="true"
      />
      <div className="relative flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-pool text-accent-ink sm:w-20">
        <span className="text-xs font-bold uppercase tracking-wider">Lane</span>
        <span className="font-display text-4xl leading-none">{index + 1}</span>
      </div>
      <div className="relative flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        {gallery ? (
          <button
            type="button"
            aria-label={galleryButtonLabel[gallery]}
            aria-haspopup="dialog"
            aria-expanded={galleryOpen}
            onClick={() => onOpen(gallery)}
            className={`${emojiClass} cursor-pointer border-pool/70 hover:border-fog hover:bg-pool/25`}
          >
            <span aria-hidden="true">{item.emoji}</span>
            <GalleryHint gallery={gallery} />
          </button>
        ) : (
          <span className={`${emojiClass} border-pool/30 transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110`} aria-hidden="true">
            {item.emoji}
          </span>
        )}
        {gallery ? (
          <button
            type="button"
            aria-haspopup="dialog"
            aria-expanded={galleryOpen}
            onClick={() => onOpen(gallery)}
            className="flex min-w-0 flex-1 cursor-pointer flex-col gap-3 bg-transparent text-left text-fog [font-family:inherit] sm:flex-row sm:items-center"
          >
            <LaneCopy item={item} />
          </button>
        ) : (
          <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <LaneCopy item={item} />
          </div>
        )}
      </div>
    </>
  );
}

const laneClass =
  "group relative flex items-stretch gap-4 overflow-hidden px-3 py-4 transition-colors duration-300 hover:bg-pool/[0.07] sm:gap-6 sm:px-4";

/** Each fun item gets its own lane; content comes from data/fun.ts. */
export function PoolLanes() {
  const [gallery, setGallery] = useState<FunGallery | null>(null);

  return (
    <section aria-labelledby="lanes-title" className="mb-8">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="lanes-title" className="font-display text-3xl">
          Lane Assignments
        </h2>
        <p className="text-xs uppercase tracking-wider text-mist">{funItems.length} lanes</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-pool/20 bg-[#04243a]/70">
        <LaneRope />
        <ol>
          {funItems.map((item, i) => (
            <li key={item.title}>
              <article className={laneClass}>
                <LaneBody
                  item={item}
                  index={i}
                  galleryOpen={item.gallery !== undefined && gallery === item.gallery}
                  onOpen={setGallery}
                />
              </article>
              {item.video && (
                <div className="px-3 pb-4 sm:pl-[7.5rem] sm:pr-4">
                  <div className="max-w-xl">
                    {"src" in item.video ? (
                      <VideoClip src={item.video.src} title={item.video.title} poster={item.video.poster} />
                    ) : (
                      <LiteYouTube youtubeId={item.video.youtubeId} title={item.video.title} />
                    )}
                  </div>
                </div>
              )}
              <LaneRope />
            </li>
          ))}
        </ol>
      </div>
      <GalleryDialogs gallery={gallery} onClose={() => setGallery(null)} />
    </section>
  );
}
