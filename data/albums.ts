/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PHOTO ALBUMS. The emoji buttons on About Me. Fun Stuff opens these too.
 *
 *  Each object is one button. Clicking or tapping it opens `photos`.
 *  `src` is a public path, like "/images/study-abroad/15.webp".
 *
 *  Add an emoji by copying an object into `photoAlbums`.
 *  Add a photo by appending to that album's `photos` array.
 *  Keep `id` and `emoji` unique. `alt` is required. `caption` is optional.
 *  See the README section "Adding an emoji photo album".
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AlbumPhoto = {
  /** Public path, e.g. "/images/study-abroad/15.webp". */
  src: string;
  /** One sentence on what the photo shows. Screen readers read this. */
  alt: string;
  /** Optional line under the photo. */
  caption?: string;
};

export type PhotoAlbum = {
  /** Stable id. Fun Stuff lanes point at this. */
  id: string;
  /** The button. One emoji, and don't repeat it. */
  emoji: string;
  /** Name under the emoji, and the title of the viewer. */
  label: string;
  /** Optional line shown with the albums. */
  note?: string;
  photos: AlbumPhoto[];
};

/** Match photos. The Munich study-abroad gallery lists these too. */
export const allianzArenaPhotos: AlbumPhoto[] = [
  {
    src: "/images/study-abroad/15.webp",
    alt: "A night soccer match at Allianz Arena, with red flags in the crowd.",
    caption: "Allianz Arena",
  },
  {
    src: "/images/study-abroad/16.webp",
    alt: "Another view of the night match at Allianz Arena.",
    caption: "Allianz Arena",
  },
];

export const photoAlbums: PhotoAlbum[] = [
  {
    id: "sports",
    emoji: "🏅",
    label: "Sports",
    note: "Some of my favorite teams are Madrid, the Lakers, and the Packers.",
    photos: allianzArenaPhotos,
  },
];
