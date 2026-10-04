/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  YOUR PLAYER PROFILE
 *  Everything personal on the site lives here: name, links, card ratings,
 *  scouting report (bio) and the fun facts unlocked in the penalty shootout.
 *
 *  Placeholders still to fill in — search this file for:
 *    [EMAIL]   [LINKEDIN_URL]   [PHOTO]   [BIO]   [NATION]
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Stat = {
  /** 2–3 letter code shown on the FUT-style card face. */
  short: string;
  /** Full label shown next to the stat bar. */
  label: string;
  /** 0–99. */
  value: number;
};

export const profile = {
  firstName: "Josue",
  lastName: "Arevalo",
  /** Big number on the intro splash and player card. */
  jerseyNumber: 23,
  tagline: "CS @ Stanford · Machine Learning & Sports Analytics",

  // [EMAIL] — public address for the copy-to-clipboard button and mailto fallback.
  email: "you@example.com",

  links: {
    github: "https://github.com/jarevalo23",
    // [LINKEDIN_URL] — full URL of your LinkedIn profile.
    linkedin: "https://www.linkedin.com/in/your-handle",
  },

  /** Shown in the press room (contact page). */
  availability: "Open to ML / data science internships and fun side projects.",
  responseTime: "Usually within 48 hours",
  location: "Stanford, CA",

  // [PHOTO] — put your photo in /public/images (e.g. /public/images/profile.jpg)
  // and point to it here. A roughly square, transparent-background PNG looks most
  // like a real FUT card, but any JPG works.
  photo: "/images/player-placeholder.svg",

  card: {
    /** Overall rating (big number, top-left of the card). */
    rating: 91,
    /** Position code under the rating. */
    position: "ST",
    /** Longer role line on the intro splash. */
    role: "ML Engineer",
    // [NATION] — country name + flag image in /public/images.
    nation: { name: "Nation", flag: "/images/flag-placeholder.svg" },
    club: "Stanford",
    /** Card finish: "gold" | "neon" | "icon". */
    finish: "neon" as "gold" | "neon" | "icon",
  },

  /** Six stats show on the card face; all of them show as bars. */
  stats: [
    { short: "PYT", label: "Python", value: 94 },
    { short: "ML", label: "Machine Learning", value: 89 },
    { short: "PRB", label: "Problem Solving", value: 92 },
    { short: "DAT", label: "Data Viz", value: 86 },
    { short: "TMW", label: "Teamwork", value: 90 },
    { short: "COF", label: "Coffee", value: 97 },
    { short: "SQL", label: "SQL", value: 84 },
    { short: "SPT", label: "Sports IQ", value: 95 },
  ] satisfies Stat[],

  /** "Scouting report" — your bio, written like a scout's notes. [BIO] */
  scouting: {
    headline: "Data-driven forward who turns messy real-world questions into models.",
    summary: [
      "A computer science student at Stanford pursuing a coterminal master's with a focus on machine learning. Fascinated by what happens when data meets the games we love — spends most training sessions building models that try to understand and predict the patterns hidden in sports.",
      "Equally comfortable training a neural network or arguing about win probability. Driven by curiosity and the joy of turning messy real-world questions into things a computer can reason about.",
    ],
    attributes: [
      { label: "Preferred foot", value: "Python" },
      { label: "Weak foot", value: "★★★★☆ (CSS)" },
      { label: "Work rate", value: "High / High" },
      { label: "Club", value: "Stanford CS" },
      { label: "Specialty", value: "Sports analytics" },
    ],
    strengths: [
      "Reads the game early — scopes problems before writing code",
      "Clinical finisher: ships end-to-end, from notebook to deployed app",
      "Links up well with teammates; clear written communication",
    ],
    developing: ["Occasionally over-engineers the build-up play", "Will debate any offside call (and any p-value)"],
    playsLike: "A pressing forward with a data scientist's touch",
    verdict: "Sign immediately. High ceiling, low maintenance, runs on coffee.",
  },

  /** Revealed one at a time when you score in the penalty shootout. */
  funFacts: [
    "I've built more sports prediction models than I'd like to admit — the bracket still always loses.",
    "Favorite pre-game ritual: a cold brew and a fresh Jupyter notebook.",
    "I swim laps to debug — the best ideas show up around lap 20.",
    "I can name every World Cup winner since 1930 (try me).",
    "My first program was a script to track pickup basketball stats.",
    "Coffee order: oat-milk cortado. Non-negotiable.",
  ],
};

export const fullName = `${profile.firstName} ${profile.lastName}`;
