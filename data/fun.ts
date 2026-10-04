/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  FUN STUFF — each item gets its own pool lane (top to bottom, lane 1 first).
 *  All entries below are PLACEHOLDERS: swap in your own hobbies, playlists,
 *  favorite things and random facts. Add or remove lanes freely.
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
    category: "Hobby",
    title: "Pickup soccer on weekends",
    description: "Placeholder — where you play, what position, and your signature move.",
    emoji: "⚽",
    tags: ["Sundays", "Left wing"],
  },
  {
    category: "On repeat",
    title: "Game-day playlist",
    description: "Placeholder — the songs that get you locked in before a big deadline.",
    emoji: "🎧",
    link: { label: "Listen on Spotify", href: "https://open.spotify.com" },
  },
  {
    category: "Training",
    title: "Lap swimming",
    description: "Placeholder — favorite stroke, weekly distance, best 50m time.",
    emoji: "🏊",
    tags: ["Freestyle", "Early mornings"],
  },
  {
    category: "Fandom",
    title: "Teams I'll defend forever",
    description: "Placeholder — your clubs and franchises, and your most painful sports memory.",
    emoji: "🏟️",
    tags: ["Team one", "Team two"],
  },
  {
    category: "Reading",
    title: "Currently reading",
    description: "Placeholder — a book, paper or newsletter you'd recommend to anyone.",
    emoji: "📚",
  },
  {
    category: "Random fact",
    title: "Something nobody guesses",
    description: "Placeholder — a surprising fact about you that starts good conversations.",
    emoji: "🎲",
  },
];
