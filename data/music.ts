/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  NOW PLAYING — the in-game "radio" in the bottom bar, powered by Spotify.
 *
 *  [SPOTIFY_URL] Paste a public Spotify playlist, album or track link
 *  (Share → Copy link). Tracking parameters after "?" are ignored.
 *  Visitors logged into Spotify hear full songs; everyone else gets
 *  30-second previews. Editing the playlist in Spotify updates the site.
 *
 *  Nothing loads from Spotify until a visitor presses play.
 *  Leave `spotifyUrl` empty to hide the bar.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const music = {
  spotifyUrl: "https://open.spotify.com/playlist/1y9yDEFTKBimrRdmIOjJlz",
  /** Shown on the bar before the player loads. */
  label: "My playlist",
  /** Name shown on the bar, like an in-game radio station. */
  station: "Arevalo FM",
};
