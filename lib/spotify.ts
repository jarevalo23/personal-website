/**
 * Minimal loader + types for Spotify's official Embed iFrame API
 * (https://developer.spotify.com/documentation/embeds/references/iframe-api).
 * The script is only fetched the first time a visitor presses play.
 */

export type SpotifyPlaybackUpdate = { data: { isPaused: boolean; isBuffering: boolean; position: number; duration: number } };

export type SpotifyController = {
  addListener: (event: "ready" | "playback_update", cb: (e: SpotifyPlaybackUpdate) => void) => void;
  play: () => void;
  togglePlay: () => void;
  pause: () => void;
  destroy: () => void;
};

export type SpotifyIFrameAPI = {
  createController: (
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyController) => void,
  ) => void;
};

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

const API_SRC = "https://open.spotify.com/embed/iframe-api/v1";
let loading: Promise<SpotifyIFrameAPI> | null = null;

export function loadSpotify(): Promise<SpotifyIFrameAPI> {
  loading ??= new Promise<SpotifyIFrameAPI>((resolve, reject) => {
    window.onSpotifyIframeApiReady = (api) => resolve(api);
    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => {
      loading = null;
      reject(new Error("Could not load Spotify"));
    };
    document.head.appendChild(script);
  });
  return loading;
}

/** "https://open.spotify.com/playlist/ID?si=…" → "spotify:playlist:ID" */
export function toSpotifyUri(url: string): string | null {
  const match = url.match(/open\.spotify\.com\/(?:intl-[a-z-]+\/)?(playlist|album|track|artist|episode|show)\/([A-Za-z0-9]+)/);
  return match ? `spotify:${match[1]}:${match[2]}` : null;
}
