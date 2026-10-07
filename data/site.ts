/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE + MENU SETTINGS
 *  Domain, SEO copy, and the text on each main-menu tile / screen header.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import { fullName, profile } from "./profile";

export type AccentKey = "menu" | "soccer" | "basketball" | "swim" | "contact" | "github" | "linkedin";

export const site = {
  // Custom domain without protocol. Used for canonical URLs, Open Graph tags and the sitemap.
  domain: "josuearevalo.com",
  title: `${fullName} — Player Profile`,
  description: `${fullName}: ${profile.tagline}. A personal site you play like a sports video game — pick a mode from the main menu.`,
  /** Little chip next to "Main Menu". */
  seasonLabel: "Season 26",
};

/** Internal screens. `tag` is the small "game mode" label above each title. */
export const sections = {
  about: {
    href: "/about",
    title: "About Me",
    tag: "Player Profile",
    sport: "Soccer",
    accent: "soccer",
    subtitle: "Ratings, scouting report & a penalty shootout",
    description: `Player card, stats and scouting report for ${fullName} — plus a penalty-kick mini-game.`,
  },
  projects: {
    href: "/projects",
    title: "Projects",
    tag: "Shot Chart",
    sport: "Basketball",
    accent: "basketball",
    subtitle: "Every project on the court — and a free-throw challenge",
    description: `Projects by ${fullName}, laid out on a basketball shot chart.`,
  },
  fun: {
    href: "/fun",
    title: "Fun Stuff",
    tag: "Free Swim",
    sport: "Swimming",
    accent: "swim",
    subtitle: "Hobbies, playlists, random facts & a 50m dash",
    description: `Hobbies, favorite things and random facts about ${fullName} — plus a swim-start reaction game.`,
  },
  contact: {
    href: "/contact",
    title: "Contact",
    tag: "Press Room",
    sport: "Post-match",
    accent: "contact",
    subtitle: "Questions from the press? Send a message",
    description: `Get in touch with ${fullName}.`,
  },
} as const satisfies Record<
  string,
  {
    href: string;
    title: string;
    tag: string;
    sport: string;
    accent: AccentKey;
    subtitle: string;
    description: string;
  }
>;

export type SectionKey = keyof typeof sections;

/** External tiles on the main menu. */
export const externalTiles = {
  github: {
    href: profile.links.github,
    title: "GitHub",
    subtitle: "Code & repos",
    accent: "github",
  },
  linkedin: {
    href: profile.links.linkedin,
    title: "LinkedIn",
    subtitle: "Career stats",
    accent: "linkedin",
  },
} as const satisfies Record<string, { href: string; title: string; subtitle: string; accent: AccentKey }>;
