/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  YOUR PLAYER PROFILE
 *  Everything personal on the site lives here: name, links, card ratings,
 *  scouting report (bio) and the fun facts unlocked in the penalty shootout.
 *
 *  Placeholders still to fill in — search this file for:
 *    [PHOTO]   [RATINGS]
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
  tagline: "CS @ Stanford · Software Engineer · Machine Learning",

  /** Public address for the copy-to-clipboard button and mailto fallback. */
  email: "jareval0@stanford.edu",

  links: {
    github: "https://github.com/jarevalo23",
    linkedin: "https://www.linkedin.com/in/josue-arevalo-a664a42b1/",
  },

  /** Shown in the press room (contact page). */
  availability: "Open to software engineering and ML roles. B.S. in Computer Science, June 2027.",
  responseTime: "Usually within 48 hours",
  location: "Los Angeles, CA",

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
    role: "Software Engineer",
    nation: { name: "El Salvador", flag: "/images/flag-el-salvador.svg" },
    club: "Stanford",
    /** Card finish: "gold" | "neon" | "icon". */
    finish: "gold" as "gold" | "neon" | "icon",
  },

  /**
   * Six stats show on the card face; all of them show as bars.
   * [RATINGS] Skills come from your resume; the numbers are just for fun — tune them.
   */
  stats: [
    { short: "PYT", label: "Python", value: 94 },
    { short: "TS", label: "TypeScript / Next.js", value: 89 },
    { short: "LLM", label: "LLM apps & RAG", value: 92 },
    { short: "ML", label: "Machine Learning (PyTorch)", value: 88 },
    { short: "CV", label: "Computer Vision", value: 86 },
    { short: "SQL", label: "SQL / PostGIS", value: 85 },
    { short: "ESP", label: "Spanish", value: 90 },
    { short: "COF", label: "Coffee", value: 97 },
  ] satisfies Stat[],

  /** "Career history" in the scouting report — like a FIFA transfer history. */
  career: [
    { club: "ShipAdvisor", role: "Software Engineer", dates: "Jun 2026 – Present", place: "Remote" },
    { club: "The Aerospace Corporation", role: "System Engineer Intern III", dates: "Jun – Aug 2025", place: "El Segundo, CA" },
    { club: "The Aerospace Corporation", role: "System Engineer Intern II", dates: "Jun – Sep 2024", place: "El Segundo, CA" },
    {
      club: "Stanford University",
      role: "B.S. Computer Science (ML) · Psychology minor",
      dates: "Expected Jun 2027",
      place: "Stanford, CA",
    },
  ],

  /** "Scouting report" — your bio, written like a scout's notes (from your resume). */
  scouting: {
    headline: "Full-stack engineer with a machine learning engine — ships AI tools people actually use.",
    summary: [
      "Born and raised in Los Angeles with Salvadoran roots. Computer Science student at Stanford (B.S., machine learning focus, minor in Psychology), graduating June 2027. Currently a software engineer at ShipAdvisor, building AI workflows, offline-first inspection tools and geospatial pipelines with TypeScript, Next.js, Supabase and PostGIS.",
      "Spent two summers at The Aerospace Corporation building retrieval-augmented generation pipelines, semantic search and engineering automation in Python. Off the clock: computer vision for basketball broadcasts and research on adaptive retrieval for language models.",
    ],
    attributes: [
      { label: "Preferred foot", value: "Python" },
      { label: "Weak foot", value: "★★★★☆ (TypeScript)" },
      { label: "Current club", value: "ShipAdvisor" },
      { label: "Academy", value: "Stanford CS" },
      { label: "Languages", value: "English · Spanish" },
      { label: "Hometown", value: "Los Angeles, CA" },
      { label: "Heritage", value: "El Salvador" },
      { label: "Clubs", value: "Real Madrid · Lakers" },
    ],
    strengths: [
      "LLM systems that hold up: schema-validated extraction, cited sources, human review",
      "End-to-end delivery, from PostGIS pipelines to Next.js front ends",
      "Computer vision and ML research with PyTorch, OpenCV and YOLOv8",
    ],
    developing: ["Occasionally over-engineers the build-up play", "Will debate any offside call (and any p-value)"],
    playsLike: "A box-to-box engineer with a striker's finish",
    verdict: "Sign immediately. High ceiling, low maintenance, runs on coffee.",
  },

  /** Revealed one at a time when you score in the penalty shootout. */
  funFacts: [
    "I play bass in a band on campus.",
    "I picked up the bass at church when I was 11, and I've been holding down the low end ever since.",
    "Real Madrid is my club. ¡Hala Madrid!",
    "Madrid and the Lakers: the two teams I would die for.",
    "Born and raised in LA, with roots in El Salvador.",
    "I speak English and Spanish.",
  ],
};

export const fullName = `${profile.firstName} ${profile.lastName}`;
