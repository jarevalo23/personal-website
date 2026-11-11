/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PHOTO ALBUMS. The emoji buttons on About Me.
 *
 *  Each object is one button. Clicking or tapping it opens `photos`.
 *  Image files go in /public/images/albums. `src` is the public path,
 *  like "/images/albums/bass-show.jpg".
 *
 *  Add an emoji by copying an object into `photoAlbums`.
 *  Add a photo by appending to that album's `photos` array.
 *  Keep `emoji` unique. `alt` is required. `caption` is optional.
 *
 *  The albums below use labeled placeholders. Point `src` at a real photo
 *  (or replace the file) and delete a placeholder once nothing uses it.
 *  See the README section "Adding an emoji photo album".
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type AlbumPhoto = {
  /** Public path, e.g. "/images/albums/bass-show.jpg". */
  src: string;
  /** One sentence on what the photo shows. Screen readers read this. */
  alt: string;
  /** Optional line under the photo. */
  caption?: string;
};

export type PhotoAlbum = {
  /** The button. One emoji, and don't repeat it. */
  emoji: string;
  /** Name under the emoji, and the title of the viewer. */
  label: string;
  photos: AlbumPhoto[];
};

export const photoAlbums: PhotoAlbum[] = [
  {
    emoji: "🎸",
    label: "Bass",
    photos: [
      {
        src: "/images/albums/bass-1.png",
        alt: "Placeholder graphic for the Bass album, photo 1 of 2. It reads PLACEHOLDER and Bass. No real photo yet.",
        caption: "Placeholder. Swap this file for a real photo.",
      },
      {
        src: "/images/albums/bass-2.png",
        alt: "Placeholder graphic for the Bass album, photo 2 of 2. It reads PLACEHOLDER and Bass. No real photo yet.",
        caption: "Placeholder. Swap this file for a real photo.",
      },
    ],
  },
  {
    emoji: "⚽",
    label: "Soccer",
    photos: [
      {
        src: "/images/albums/soccer-1.png",
        alt: "Placeholder graphic for the Soccer album, photo 1 of 2. It reads PLACEHOLDER and Soccer. No real photo yet.",
        caption: "Placeholder. Swap this file for a real photo.",
      },
      {
        src: "/images/albums/soccer-2.png",
        alt: "Placeholder graphic for the Soccer album, photo 2 of 2. It reads PLACEHOLDER and Soccer. No real photo yet.",
        caption: "Placeholder. Swap this file for a real photo.",
      },
    ],
  },
  {
    emoji: "🎤",
    label: "Shows",
    photos: [
      {
        src: "/images/albums/shows-1.png",
        alt: "Placeholder graphic for the Shows album, photo 1 of 2. It reads PLACEHOLDER and Shows. No real photo yet.",
        caption: "Placeholder. Swap this file for a real photo.",
      },
      {
        src: "/images/albums/shows-2.png",
        alt: "Placeholder graphic for the Shows album, photo 2 of 2. It reads PLACEHOLDER and Shows. No real photo yet.",
        caption: "Placeholder. Swap this file for a real photo.",
      },
    ],
  },
];
