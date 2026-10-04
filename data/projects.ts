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
 *  Screenshots live in /public/images/projects. Any size works; 16:10 looks best.
 *  The three seed projects below are PLACEHOLDERS — replace them with real work.
 * ─────────────────────────────────────────────────────────────────────────────
 */

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
  screenshots: { src: string; alt: string }[];
  court: { x: number; y: number };
};

export const projects: Project[] = [
  {
    slug: "win-probability-model",
    title: "Win Probability Model",
    jersey: 1,
    role: "Point Guard",
    year: "2026",
    status: "Shipped",
    summary: "Placeholder — live win probability from play-by-play data.",
    description: [
      "Placeholder description. Explain what the project does, why you built it, and what makes it interesting in two or three sentences.",
      "Add a second paragraph about the hardest technical problem you solved or what you learned.",
    ],
    highlights: ["Replace with a result, e.g. “0.21 Brier score on 2025 season”", "Another impact bullet"],
    tech: ["Python", "PyTorch", "Pandas"],
    links: { github: "https://github.com/jarevalo23" },
    screenshots: [{ src: "/images/projects/placeholder-1.svg", alt: "Placeholder screenshot for Win Probability Model" }],
    court: { x: 50, y: 22 },
  },
  {
    slug: "shot-chart-visualizer",
    title: "Shot Chart Visualizer",
    jersey: 7,
    role: "Shooting Guard",
    year: "2025",
    status: "Shipped",
    summary: "Placeholder — interactive shot charts with D3 and a public stats API.",
    description: [
      "Placeholder description. What does it do, who is it for, and why does it exist?",
      "Mention any interesting design decisions, data sources or performance tricks.",
    ],
    highlights: ["Replace with a highlight", "e.g. “Used by 200+ fans in the first week”"],
    tech: ["TypeScript", "D3.js", "REST APIs"],
    links: { github: "https://github.com/jarevalo23", demo: "https://example.com" },
    screenshots: [{ src: "/images/projects/placeholder-2.svg", alt: "Placeholder screenshot for Shot Chart Visualizer" }],
    court: { x: 84, y: 45 },
  },
  {
    slug: "draft-value-predictor",
    title: "Draft Value Predictor",
    jersey: 23,
    role: "Sixth Man",
    year: "2025",
    status: "In progress",
    summary: "Placeholder — predicting draft-pick value from college stats.",
    description: [
      "Placeholder description. Describe the problem, your approach and the outcome.",
      "Link to a write-up or demo if there is one.",
    ],
    highlights: ["Replace with a highlight"],
    tech: ["SQL", "scikit-learn", "Flask"],
    links: { github: "https://github.com/jarevalo23" },
    screenshots: [{ src: "/images/projects/placeholder-3.svg", alt: "Placeholder screenshot for Draft Value Predictor" }],
    court: { x: 18, y: 62 },
  },
];
