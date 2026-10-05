/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  NOW PLAYING — the in-game "radio" in the bottom bar.
 *
 *  [SOUNDCLOUD_URL] Paste SoundCloud links below: single tracks
 *  (https://soundcloud.com/artist/track) or a playlist
 *  (https://soundcloud.com/artist/sets/playlist). Only use tracks whose
 *  uploader allows embedding; the official SoundCloud player stays visible
 *  so the artist is credited and linked.
 *
 *  Nothing loads from SoundCloud until a visitor presses play.
 *  With an empty list the bar is hidden on the live site.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Track = {
  url: string;
  /** Optional label shown before the player loads, e.g. "Artist — Song". */
  label?: string;
};

export const music = {
  tracks: [
    {
      url: "https://soundcloud.com/user-507758071-745656517/sets/best-fifa-songs-14-23-fifa-23",
      label: "Best FIFA Songs 14–23",
    },
  ] as Track[],
  /** 0–100 */
  volume: 50,
  /** Name shown on the bar, like an in-game radio station. */
  station: "Arevalo FM",
};
