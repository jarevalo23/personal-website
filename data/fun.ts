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
};

export const funItems: FunItem[] = [
  {
    category: "Music",
    title: "Bassist in a campus band",
    description: "I play bass in a band on campus. I started playing at church when I was 11.",
    emoji: "🎸",
    tags: ["Bass", "Since age 11"],
  },
  {
    category: "Fútbol",
    title: "Real Madrid till I die",
    description: "Madrid is my club, no debate. ¡Hala Madrid!",
    emoji: "⚽",
    tags: ["Hala Madrid"],
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
