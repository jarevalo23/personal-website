/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FUN STUFF — each item gets its own pool lane (top to bottom, lane 1 first).
 *  Hobbies, favorite teams and random facts. Add or remove lanes freely.
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
};

export const funItems: FunItem[] = [
  {
    category: "Music",
    title: "Bassist in Bucketlist",
    description: "I play bass in Bucketlist, a band on campus. I started playing at church when I was 11.",
    emoji: "🎸",
    tags: ["Bucketlist", "Bass", "Since age 11"],
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
    category: "Fútbol",
    title: "Real Madrid till I die",
    description: "Madrid is my club, no debate. ¡Hala Madrid!",
    emoji: "⚽",
    tags: ["Hala Madrid"],
  },
  {
    category: "Away days",
    title: "Soccer games in 5 countries",
    description: "I've been to soccer games in five different countries.",
    emoji: "🏟️",
    tags: ["5 countries"],
  },
  {
    category: "Hoops",
    title: "Lakers forever",
    description:
      "LA born and raised, so it was always going to be the Lakers. Madrid and the Lakers are the two teams I'd die for.",
    emoji: "🏀",
    tags: ["Purple & Gold"],
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
