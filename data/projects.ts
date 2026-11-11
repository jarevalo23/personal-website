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
  /** Season printed on the card. Leave it off if you don't want to guess a year. */
  year?: string;
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
    summary: "NBA broadcast footage turned into top-down player tracks and spacing maps.",
    description: [
      "I co-developed a computer-vision pipeline for Stanford's CS131. It takes NBA broadcast video and builds a top-down court map. YOLOv8, through Ultralytics, detects the players and the ball. Tracking uses ByteTrack, with an IoU fallback when a track drops. Teams are labeled with jersey-color k-means. A homography maps camera pixels to feet on the court. A model we trained finds the paint corners on its own, and you can click to calibrate if it's off. The pipeline also reports player speed and pass events.",
      "My part was the spacing analytics. With NumPy, SciPy, and OpenCV, I measure the convex hull around the offensive players and draw that polygon on the court. I also mark nearest-defender distance (open, contested, or tight) and detect double teams.",
    ],
    highlights: [
      "Broadcast video in, top-down court coordinates out",
      "ByteTrack with an IoU fallback, and teams from jersey-color k-means",
      "Spacing: convex hull, nearest defender, and double teams",
    ],
    tech: ["Python", "OpenCV", "YOLOv8", "Ultralytics", "ByteTrack", "scikit-learn", "NumPy", "SciPy"],
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
    summary: "Learning how many passages to retrieve for Spectral Koopman Attention.",
    description: [
      "Three of us studied adaptive retrieval for Spectral Koopman Attention. We looked at how to choose document context for a system built around Koopman operators.",
      "We trained a PyTorch network to predict λ from the query embedding. That λ changes how many passages get retrieved. We compared the learned λ with a fixed λ on 61 validation queries.",
      "The first version lost to a constant baseline, so we rebuilt the data. The queries are hand-written, on real SEC 10-K filings, not synthetic text. The loss ranks a sweep of λ values instead of one best label.",
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
    summary: "An NBA playoffs dashboard that flags plus-EV bets and player-prop edges against devigged odds.",
    description: [
      "A value-betting app. The FastAPI backend pulls odds from The Odds API, devigs the sharpest books to estimate a fair price, and flags moneyline, spread, and total offers the market has mispriced.",
      "Player props use a hit-rate model. It blends a recent hit rate with a baseline hit rate, and a hard sample-size floor stops it from recommending a bet on a tiny sample. Every pick goes into a predictions journal and gets graded, so a calibration page can show how those grades compare.",
      "One monorepo ships two builds. A public demo runs on fixtures and spends zero API credits. A passcode-gated build, for friends, uses live odds.",
    ],
    highlights: [
      "Fair odds devigged from 5 books",
      "Hard sample-size floor, so no bet on a tiny sample",
      "Predictions journal and a calibration page",
    ],
    tech: ["Next.js", "TypeScript", "FastAPI", "Python", "Supabase"],
    links: {},
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
  {
    slug: "marc",
    title: "Marc",
    jersey: 10,
    role: "Personal",
    status: "Shipped",
    summary: "A web app that drafts short emails and messages from writing examples, a profile, and a short interview.",
    description: [
      "Marc is a web app that drafts short emails and messages. A draft draws on writing examples you provide, an editable writer profile, and a short interview.",
      "Model calls go through an Anthropic SDK adapter, with an offline stub in front so the app can run without the API. It can retrieve those writing examples. You can import a document, and the import redacts it. There's also a blinded A/B/C study harness, a spend cap, data deletion, and CI.",
    ],
    highlights: [
      "Drafts from writing examples, a writer profile, and a short interview",
      "Anthropic SDK adapter behind an offline stub",
      "Document import with redaction, a spend cap, and data deletion",
    ],
    tech: ["Python", "FastAPI", "Jinja2", "Pydantic", "SQLite", "Playwright"],
    links: {},
    screenshots: [],
    court: { x: 50, y: 62 },
  },
  {
    slug: "whale-watcher",
    title: "Whale Watcher",
    jersey: 15,
    role: "Personal",
    status: "In progress",
    summary: "A read-only Kalshi and Polymarket monitor for unusually large trades.",
    description: [
      "Whale Watcher is a read-only monitor for Kalshi and Polymarket. It flags trades that are unusually large and sends a phone alert.",
      "It also measures a hypothetical. Take a $10 copy of that trade, after the delay to detect it, and after order book depth, fees, and slippage. Would it have made money?",
      "It never places an order. If trading keys are present, it refuses to start.",
    ],
    highlights: [
      "Flags unusually large trades and sends a phone alert",
      "Checks a hypothetical $10 copy after delay, depth, fees, and slippage",
      "Read-only, and it will not start if trading keys are present",
    ],
    tech: ["TypeScript", "Next.js 16", "React 19", "PostgreSQL", "Zod", "decimal.js", "Vitest"],
    links: {},
    screenshots: [],
    court: { x: 65, y: 38 },
  },
];
