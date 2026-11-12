/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FUN STUFF — each item gets its own pool lane (top to bottom, lane 1 first).
 *  Hobbies, favorite teams and random facts. Add or remove lanes freely.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type FunGallery = "sports" | "study-abroad";

export type FunItem = {
  /** Short category label on the starting block, e.g. "Hobby". */
  category: string;
  title: string;
  description: string;
  /** Single emoji used as the lane icon. */
  emoji: string;
  tags?: string[];
  link?: { label: string; href: string };
  /**
   * Optional click-to-play video shown in the lane. Either:
   *  - a video file in /public/videos:  { src: "/videos/clip.mp4", title: "...", poster?: "/videos/clip.jpg" }
   *  - a YouTube video (public or unlisted): { youtubeId: "ID from youtu.be/ID", title: "..." }
   */
  video?: { src: string; title: string; poster?: string } | { youtubeId: string; title: string };
  /**
   * Opens a shared gallery. "sports" is the Sports album in data/albums.ts.
   * "study-abroad" is the map in data/studyAbroad.ts.
   */
  gallery?: FunGallery;
};

export const funItems: FunItem[] = [
  {
    category: "Music",
    title: "Bassist",
    description:
      "I play bass in a few music groups on campus, including Bucketlist and Primera Generación, my grupo. I started playing at church when I was 11.",
    emoji: "🎸",
    tags: ["Bucketlist", "Primera Generación", "Bass", "Since age 11"],
    link: { label: "Follow Bucketlist on Instagram", href: "https://www.instagram.com/therealbucketlist/" },
    // [BAND_VIDEO] Drop the clip at public/videos/bucketlist.mp4, then uncomment:
    // video: { src: "/videos/bucketlist.mp4", title: "Bucketlist live" },
  },
  {
    category: "Live music",
    title: "Concert regular",
    description:
      "I love going to concerts. Some of my favorite shows have been Coldplay, Radiohead, Mac DeMarco and Malcolm Todd.",
    emoji: "🎤",
    tags: ["Coldplay", "Radiohead", "Mac DeMarco", "Malcolm Todd"],
  },
  {
    category: "Abroad",
    title: "Study abroad",
    description: "I studied abroad in Europe. Click the map to see photos from Madrid and Munich.",
    emoji: "🗺️",
    tags: ["Madrid", "Munich"],
    gallery: "study-abroad",
  },
  {
    category: "Teams",
    title: "Madrid, Lakers, Packers",
    description:
      "My favorite teams are Real Madrid, the Lakers, and the Packers. LA born and raised, so it was always going to be the Lakers. ¡Hala Madrid!",
    emoji: "⚽",
    tags: ["Hala Madrid", "Purple & Gold", "Packers"],
    gallery: "sports",
  },
  {
    category: "Away days",
    title: "Soccer games in 5 countries",
    description: "I've been to soccer games in five different countries.",
    emoji: "🏟️",
    tags: ["5 countries"],
  },
  {
    category: "Multi-sport",
    title: "Four sports in high school",
    description: "I played four sports in high school.",
    emoji: "🏅",
    tags: ["4 sports"],
  },
  {
    category: "Roots",
    title: "Salvadoran roots, LA raised",
    description: "Born and raised in Los Angeles, with family roots in El Salvador. I speak English and Spanish.",
    emoji: "🌎",
    tags: ["Los Angeles", "El Salvador"],
  },
  {
    category: "On repeat",
    title: "My playlist",
    description: "My personal playlist, the same one playing on the radio at the bottom of the screen.",
    emoji: "🎧",
    link: { label: "Open in Spotify", href: "https://open.spotify.com/playlist/1y9yDEFTKBimrRdmIOjJlz" },
  },
];
