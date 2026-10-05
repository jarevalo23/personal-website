/**
 * Minimal loader + types for the official SoundCloud Widget API
 * (https://developers.soundcloud.com/docs/api/html5-widget).
 * The script is only fetched the first time a visitor presses play.
 */

export type SCWidget = {
  bind: (event: string, cb: (e?: unknown) => void) => void;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  seekTo: (ms: number) => void;
  setVolume: (v: number) => void;
  load: (url: string, options?: Record<string, unknown>) => void;
};

export type SCApi = {
  Widget: ((iframe: HTMLIFrameElement) => SCWidget) & {
    Events: { READY: string; PLAY: string; PAUSE: string; FINISH: string; ERROR: string };
  };
};

declare global {
  interface Window {
    SC?: SCApi;
  }
}

const API_SRC = "https://w.soundcloud.com/player/api.js";
let loading: Promise<SCApi> | null = null;

export function loadSoundCloud(): Promise<SCApi> {
  if (window.SC) return Promise.resolve(window.SC);
  loading ??= new Promise<SCApi>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onload = () => (window.SC ? resolve(window.SC) : reject(new Error("SoundCloud API missing")));
    script.onerror = () => {
      loading = null;
      reject(new Error("Could not load SoundCloud"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** Official embed URL for the compact (mini) player. */
export function widgetSrc(url: string) {
  const params = new URLSearchParams({
    url,
    color: "#a35bff",
    auto_play: "false",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false",
  });
  return `https://w.soundcloud.com/player/?${params}`;
}

export const isPlaylist = (url: string) => /\/sets\//.test(url);
