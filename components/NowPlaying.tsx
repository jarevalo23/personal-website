"use client";

import { useEffect, useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { music } from "@/data/music";
import { loadSpotify, toSpotifyUri, type SpotifyController } from "@/lib/spotify";

type Status = "idle" | "loading" | "playing" | "paused" | "error";

function Equalizer({ active }: { active: boolean }) {
  return (
    <span className="flex h-4 items-end gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className={`w-[3px] bg-[#1ed760] ${active ? "eq-bar" : ""}`}
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

const uri = toSpotifyUri(music.spotifyUrl);

/**
 * In-game "radio": a FIFA-style Now Playing bar backed by Spotify's official
 * embed. The Spotify player only loads after the first click and floats above
 * the bar while open (use its own controls to skip songs). M toggles play/pause.
 */
export function NowPlaying() {
  const [status, setStatus] = useState<Status>("idle");
  const [open, setOpen] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<SpotifyController | null>(null);

  const start = async () => {
    if (!uri) return;
    setOpen(true);
    setStatus("loading");
    try {
      const api = await loadSpotify();
      await new Promise((r) => requestAnimationFrame(r));
      const container = hostRef.current;
      if (!container) return;
      // Spotify replaces the element it's given, so hand it a node React doesn't own.
      const el = document.createElement("div");
      container.replaceChildren(el);
      api.createController(el, { uri, width: "100%", height: 80 }, (controller) => {
        controllerRef.current = controller;
        controller.addListener("ready", () => controller.play());
        controller.addListener("playback_update", (e) => setStatus(e.data.isPaused ? "paused" : "playing"));
      });
    } catch {
      setStatus("error");
    }
  };

  const toggle = () => {
    if (controllerRef.current) controllerRef.current.togglePlay();
    else void start();
  };

  const close = () => {
    controllerRef.current?.destroy();
    controllerRef.current = null;
    hostRef.current?.replaceChildren();
    setOpen(false);
    setStatus("idle");
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

  if (!uri) return null;

  const playing = status === "playing";

  return (
    <div className="pointer-events-auto relative" role="region" aria-label="Music player">
      {/* Official Spotify player, floating above the bar while open. */}
      <div
        className={`absolute bottom-full left-1/2 mb-2 w-[min(22rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden border border-white/20 bg-ink-900 shadow-[0_14px_40px_rgba(0,0,0,0.45)] ${
          open ? "" : "hidden"
        }`}
      >
        <div ref={hostRef} className="h-20 w-full" />
      </div>

      <div className="flex items-center gap-2 border border-white/20 bg-ink-900/95 py-1 pl-3 pr-1 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <Equalizer active={playing} />
        <div className="min-w-0 leading-tight">
          <p className="font-display text-xs tracking-wide text-[#1ed760]">
            {music.station} · {playing ? "Now playing" : "Radio"}
          </p>
          <p className="max-w-[11rem] truncate text-xs font-semibold text-fog/90 sm:max-w-[16rem]">
            {status === "error" ? "Couldn't load Spotify" : music.label}
          </p>
        </div>
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
        {open && (
          <button
            type="button"
            onClick={close}
            className="flex h-8 w-8 shrink-0 items-center justify-center bg-white/10 text-fog hover:bg-white/20"
            aria-label="Close music player"
            title="Close player"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
