"use client";

import { useState } from "react";

/**
 * Click-to-play video file from /public. Nothing downloads until someone
 * presses play (preload="none"), so a big clip doesn't slow the page down.
 */
export function VideoClip({ src, title, poster }: { src: string; title: string; poster?: string }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <video
        className="aspect-video w-full border border-white/15 bg-black"
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="none"
        aria-label={title}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="group relative block aspect-video w-full overflow-hidden border border-white/15 bg-ink-950 text-left"
      aria-label={`Play video: ${title}`}
    >
      {poster && (
        // eslint-disable-next-line @next/next/no-img-element -- simple poster frame for a local clip
        <img
          src={poster}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-100"
        />
      )}
      <span className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
      <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-accent-ink transition-transform group-hover:scale-110">
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor" aria-hidden="true">
          <path d="M7 4.5v15l13-7.5z" />
        </svg>
      </span>
      <span className="font-display absolute bottom-3 left-4 text-xl text-white">{title}</span>
    </button>
  );
}
