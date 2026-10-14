/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  PROJECTS — one object per project. Add, remove or reorder freely.
 *
 *  `court` places the project's hotspot on the half-court graphic, in percent:
 *    x: 0 = left sideline, 100 = right sideline
 *    y: 0 = baseline (under the hoop), 100 = half-court line
 *  Handy spots: paint ≈ {x:50,y:22} · elbows ≈ {x:35|65,y:38} · corners ≈ {x:8|92,y:10}
 *  · wings ≈ {x:16|84,y:45} · top of the key ≈ {x:50,y:62}
 *
 *  Screenshots live in /public/images/projects. Any size works; give the real pixel
 *  `width`/`height` so the image keeps its shape. The first one doubles as the
 *  roster thumbnail and hover preview. Projects without screenshots skip the image.
 *  School and personal projects only (work lives in the career history on About).
 *  Content is from the project repos on GitHub.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type Screenshot = {
  src: string;
  alt: string;
  /** Intrinsic pixel size, used to keep the aspect ratio. */
  width: number;
  height: number;
  /** Optional line shown under the image in the detail panel. */
  caption?: string;
};

export type Project = {
  /** Unique, URL-safe id. */
  slug: string;
  title: string;
  /** Number printed on the hotspot / roster card. */
  jersey: number;
  /** Fun "position" label on the roster card, e.g. "PG", "Sixth Man". */
  role: string;
  year: string;
  status: "Shipped" | "In progress" | "Archived";
  /** One-liner shown in the hover preview. */
  summary: string;
  /** Paragraphs for the detail panel. */
  description: string[];
  /** Box-score style bullet points (impact, results, numbers). */
  highlights?: string[];
  tech: string[];
  links: { github?: string; demo?: string };
  screenshots: Screenshot[];
  court: { x: number; y: number };
};

export const projects: Project[] = [
  {
    slug: "nba-player-tracking",
    title: "NBA Broadcast Player Tracking",
    jersey: 1,
    role: "Point Guard · Stanford CS131",
    year: "2026",
    status: "Shipped",
    summary: "Turns NBA broadcast footage into top-down player tracks and offensive-spacing maps.",
    description: [
      "Co-developed a computer-vision pipeline for Stanford's CS131 that converts NBA broadcast video into a top-down court map: YOLOv8 player and ball detection, multi-object tracking with team labels, and a homography from camera pixels to court feet. A trained court-landmark model finds the paint corners automatically, with a click-to-calibrate fallback.",
      "Implemented offensive convex-hull analysis with NumPy, SciPy and OpenCV: it measures the area enclosed by the tracked offensive players and overlays that polygon on the court view to visualize spacing, alongside nearest-defender distances, double-team detection, player speed and pass events.",
    ],
    highlights: [
      "Broadcast video → top-down court coordinates",
      "Convex-hull offensive spacing, drawn on the court",
      "Nearest-defender lines: open, contested or tight",
    ],
    tech: ["Python", "OpenCV", "YOLOv8", "NumPy", "SciPy"],
    links: { github: "https://github.com/jarevalo23/CS131-Final-Project" },
    screenshots: [
      {
        src: "/images/projects/nba-tracking-overlay.jpg",
        alt: "Knicks vs Hawks broadcast frame with tracked player boxes and IDs, next to a top-down court showing the offensive convex hull and nearest-defender lines",
        width: 1600,
        height: 585,
        caption: "Broadcast view with tracked players (left) and the top-down spacing hull (right).",
      },
      {
        src: "/images/projects/nba-tracking-calibration.jpg",
        alt: "Knicks vs 76ers broadcast frame with the court projected onto it and four numbered calibration landmarks",
        width: 1280,
        height: 720,
        caption: "Court calibration: four landmarks map camera pixels to court feet.",
      },
    ],
    court: { x: 50, y: 22 },
  },
  {
    slug: "adaptive-retrieval",
    title: "Adaptive Retrieval for LMs",
    jersey: 33,
    role: "Research · Stanford CS197",
    year: "2026",
    status: "Shipped",
    summary: "Research on learning how many passages to retrieve for Spectral Koopman Attention.",
    description: [
      "A three-person study of adaptive retrieval for Spectral Koopman Attention, investigating how to select document context for a system built around Koopman operators.",
      "The team trained a PyTorch network to predict λ from query embeddings, adapting how many document passages are retrieved, and evaluated learned versus fixed λ on 61 validation queries.",
      "After a first version lost to a constant baseline, the team rebuilt the data from scratch: hand-written queries over real SEC 10-K filings instead of synthetic text, and a ranking loss over a sweep of λ values instead of a single best label.",
    ],
    highlights: ["Learned λ from query embeddings", "Evaluated on 61 validation queries", "Rebuilt on real 10-K filings"],
    tech: ["PyTorch", "NumPy"],
    links: {},
    screenshots: [],
    court: { x: 84, y: 45 },
  },
  {
    slug: "value-finder",
    title: "ValueEdge Betting Dashboard",
    jersey: 3,
    role: "Shooter · Personal",
    year: "2026",
    status: "In progress",
    summary: "An NBA-playoffs dashboard that flags +EV bets and player-prop edges against devigged market odds.",
    description: [
      "A full-stack value-betting app: a FastAPI backend pulls odds from The Odds API, devigs the sharpest books to estimate a fair price, and flags moneyline, spread and total offers the market has mispriced.",
      "A transparent player-prop model blends recent and baseline hit rates with matchup, pace and injury adjustments, and refuses to recommend a bet on a tiny sample. Every pick is logged to a predictions journal and graded, so a calibration page shows whether the model has actually earned trust.",
      "One monorepo ships two builds: a public demo that runs on fixtures and spends zero API credits, and a passcode-gated build for friends with live odds.",
    ],
    highlights: [
      "Devigged fair odds from 5 books",
      "Sample-size floor: no bets on thin data",
      "Predictions journal + calibration tracking",
    ],
    tech: ["Next.js", "TypeScript", "FastAPI", "Python", "Supabase"],
    links: { github: "https://github.com/jarevalo23/sports-value-finder-" },
    screenshots: [
      {
        src: "/images/projects/value-finder-props.jpg",
        alt: "Player Prop Edges page listing NBA player props with model probability, fair odds, edge and expected value for each",
        width: 1440,
        height: 900,
        caption: "Player-prop edges with the model's reasoning on every card (demo data).",
      },
      {
        src: "/images/projects/value-finder-dashboard.jpg",
        alt: "Value Opportunities dashboard with opportunity counts, average and best edge, and edge-distribution charts",
        width: 1440,
        height: 900,
        caption: "The value-bet dashboard (demo data).",
      },
      {
        src: "/images/projects/value-finder-landing.jpg",
        alt: "ValueEdge landing page reading 'Find the edge. Beat the closing line.'",
        width: 1440,
        height: 900,
      },
    ],
    court: { x: 16, y: 45 },
  },
];
