"use client";

import { useEffect, useRef, useState } from "react";
import { music } from "@/data/music";
import { isPlaylist, loadSoundCloud, widgetSrc, type SCWidget } from "@/lib/soundcloud";

type Status = "idle" | "loading" | "playing" | "paused" | "error";

function Equalizer({ active }: { active: boolean }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[3px] bg-[#ff5bd6] ${active ? "eq-bar" : ""}`}
          style={{ height: active ? undefined : "30%", animationDelay: `${i * -0.22}s` }}
        />
      ))}
    </span>
  );
}

function PlayPauseIcon({ playing }: { playing: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      {playing ? <path d="M6 5h4v14H6zM14 5h4v14h-4z" /> : <path d="M7 4.5v15l13-7.5z" />}
    </svg>
  );
}

/**
 * In-game "radio": a FIFA-style Now Playing bar backed by the official
 * SoundCloud player. The SoundCloud iframe only loads after the first click,
 * and stays visible so the artist is credited. M toggles play/pause.
 */
export function NowPlaying() {
  const tracks = music.tracks;
  const [status, setStatus] = useState<Status>("idle");
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const widgetRef = useRef<SCWidget | null>(null);
  const indexRef = useRef(0);

  const goTo = (i: number) => {
    const w = widgetRef.current;
    if (!w || tracks.length === 0) return;
    const next = (i + tracks.length) % tracks.length;
    indexRef.current = next;
    setIndex(next);
    w.load(tracks[next].url, { auto_play: true, visual: false, show_teaser: false });
  };

  const start = async () => {
    setMounted(true);
    setStatus("loading");
    try {
      const SC = await loadSoundCloud();
      // Wait a frame so the iframe exists in the DOM.
      await new Promise((r) => requestAnimationFrame(r));
      const iframe = iframeRef.current;
      if (!iframe) return;
      const w = SC.Widget(iframe);
      widgetRef.current = w;
      const E = SC.Widget.Events;
      w.bind(E.READY, () => {
        w.setVolume(music.volume);
        w.play();
      });
      w.bind(E.PLAY, () => setStatus("playing"));
      w.bind(E.PAUSE, () => setStatus("paused"));
      w.bind(E.ERROR, () => setStatus("error"));
      w.bind(E.FINISH, () => {
        // Playlists advance on their own; a list of single tracks loops through.
        if (!isPlaylist(tracks[indexRef.current].url)) goTo(indexRef.current + 1);
      });
    } catch {
      setStatus("error");
    }
  };

  const toggle = () => {
    if (!widgetRef.current) {
      void start();
      return;
    }
    widgetRef.current.toggle();
  };

  const skip = () => {
    const w = widgetRef.current;
    if (!w) return;
    if (tracks.length > 1) goTo(indexRef.current + 1);
    else if (isPlaylist(tracks[0].url)) w.next();
    else w.seekTo(0);
  };

  // "M" toggles the music from anywhere (except while typing).
  const toggleRef = useRef(toggle);
  useEffect(() => {
    toggleRef.current = toggle;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "m" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      toggleRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (tracks.length === 0) {
    // Only nudge the site owner during development; hidden on the live site.
    if (process.env.NODE_ENV !== "development") return null;
    return (
      <div className="pointer-events-auto flex items-center gap-2 border border-dashed border-white/30 bg-ink-900/90 px-3 py-1.5 text-xs text-fog/80">
        <Equalizer active={false} />
        Now Playing: add SoundCloud links in <code className="font-semibold">data/music.ts</code>
      </div>
    );
  }

  const playing = status === "playing";
  const label = tracks[index].label;

  return (
    <div
      className="pointer-events-auto flex max-w-full items-center gap-2 border border-white/20 bg-ink-900/95 py-1 pl-3 pr-1 shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
      role="region"
      aria-label="Music player"
    >
      <Equalizer active={playing} />
      <div className={`min-w-0 leading-tight ${mounted ? "hidden sm:block" : ""}`}>
        <p className="font-display text-xs tracking-wide text-[#ff5bd6]">
          {music.station} · {playing ? "Now playing" : "Radio"}
        </p>
        {!mounted && <p className="truncate text-xs font-semibold text-fog/90">{label ?? "Press play for music"}</p>}
        {status === "error" && <p className="text-xs text-redcard">Couldn&apos;t load SoundCloud</p>}
      </div>
      {mounted && (
        // Official SoundCloud mini player: credits and links the artist.
        <iframe
          ref={iframeRef}
          title="SoundCloud player"
          src={widgetSrc(tracks[0].url)}
          allow="autoplay"
          loading="lazy"
          className="h-5 w-36 shrink-0 border-0 sm:w-64"
        />
      )}
      <button
        type="button"
        onClick={toggle}
        className="flex h-8 w-8 shrink-0 items-center justify-center bg-white/10 text-fog hover:bg-white/20"
        aria-label={playing ? "Pause music" : "Play music"}
        title="Play / pause (M)"
      >
        {status === "loading" ? (
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-fog border-t-transparent" />
        ) : (
          <PlayPauseIcon playing={playing} />
        )}
      </button>
      {mounted && (
        <button
          type="button"
          onClick={skip}
          className="flex h-8 w-8 shrink-0 items-center justify-center bg-white/10 text-fog hover:bg-white/20"
          aria-label="Next track"
          title="Next track"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
            <path d="M5 5v14l9-7zM15 5h3v14h-3z" />
          </svg>
        </button>
      )}
    </div>
  );
}
