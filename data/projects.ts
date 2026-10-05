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
 *  Projects without screenshots simply skip the image. Content is from the resume.
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
    slug: "nba-player-tracking",
    title: "NBA Broadcast Player Tracking",
    jersey: 1,
    role: "Point Guard",
    year: "2026",
    status: "Shipped",
    summary: "Turns NBA broadcast footage into top-down player tracks and offensive-spacing maps.",
    description: [
      "Co-developed a computer-vision pipeline that converts NBA broadcast video into top-down player tracks, using YOLOv8 detection, multi-object tracking and camera-to-court coordinate mapping.",
      "Implemented offensive convex-hull analysis with NumPy, SciPy and OpenCV: it measures the area enclosed by the tracked offensive players and overlays that polygon on the court view to visualize spacing.",
    ],
    highlights: ["Broadcast video → top-down court coordinates", "Convex-hull offensive spacing, drawn on the court"],
    tech: ["Python", "OpenCV", "YOLOv8", "NumPy", "SciPy"],
    links: { github: "https://github.com/jarevalo23/CS131-Final-Project" },
    screenshots: [],
    court: { x: 50, y: 22 },
  },
  {
    slug: "port-compliance-ai",
    title: "Port-Compliance AI Workflow",
    jersey: 7,
    role: "Starter · ShipAdvisor",
    year: "2026",
    status: "In progress",
    summary: "An AI agent that finds regulatory documents and proposes updates to a port-compliance dashboard.",
    description: [
      "Built at ShipAdvisor: an automated AI workflow in TypeScript on the Anthropic API that discovers regulatory documents and proposes updates to the company's port-compliance dashboard.",
      "Every extracted value is validated against a 234-field schema, and source quotations are checked before anything reaches human review.",
    ],
    highlights: ["Validated against a 234-field schema", "Source quotations checked before human review"],
    tech: ["TypeScript", "Anthropic API", "Next.js", "Supabase"],
    links: {},
    screenshots: [],
    court: { x: 84, y: 45 },
  },
  {
    slug: "waterway-mapping",
    title: "Vessel Waterway Mapping",
    jersey: 23,
    role: "Sixth Man · ShipAdvisor",
    year: "2026",
    status: "In progress",
    summary: "A PostGIS pipeline that works out which state and waterway a vessel is in.",
    description: [
      "Built at ShipAdvisor: a PostGIS pipeline that combines federal boundary and waterway datasets into 177,623 mapped polygons to identify a vessel's state and waterway.",
      "Positions near a boundary are flagged as uncertain instead of silently guessed.",
    ],
    highlights: ["177,623 mapped polygons", "Uncertainty flagged near boundaries"],
    tech: ["PostGIS", "PostgreSQL", "Supabase", "TypeScript"],
    links: {},
    screenshots: [],
    court: { x: 18, y: 62 },
  },
  {
    slug: "offline-inspections",
    title: "Offline Inspection Module",
    jersey: 11,
    role: "Role Player · ShipAdvisor",
    year: "2026",
    status: "In progress",
    summary: "Offline-first checklists and photo capture for vessel inspections, with printable reports.",
    description: [
      "Built at ShipAdvisor: a Next.js inspection module using Supabase and IndexedDB for offline checklists and photo capture.",
      "Synchronization preserves newer local edits, and finished inspections export as printable reports.",
    ],
    highlights: ["Works offline (IndexedDB)", "Sync keeps newer local edits", "Printable inspection reports"],
    tech: ["Next.js", "TypeScript", "Supabase", "IndexedDB"],
    links: {},
    screenshots: [],
    court: { x: 8, y: 10 },
  },
  {
    slug: "aerospace-rag",
    title: "RAG Research Assistant",
    jersey: 25,
    role: "Veteran · Aerospace Corp",
    year: "2025",
    status: "Shipped",
    summary: "An LLM pipeline that synthesizes 30+ technical sources into cited reports for analysts.",
    description: [
      "Built at The Aerospace Corporation: a Python retrieval-augmented generation pipeline that uses LLMs to synthesize 30+ technical sources into cited Excel reports for analysts.",
      "Also implemented semantic search across 100+ microelectronics documents with Weaviate, so engineers can retrieve information across multiple document formats.",
    ],
    highlights: ["30+ sources → cited Excel reports", "Semantic search over 100+ documents"],
    tech: ["Python", "LangChain", "Weaviate", "ChromaDB", "OpenAI API"],
    links: {},
    screenshots: [],
    court: { x: 65, y: 38 },
  },
  {
    slug: "adaptive-retrieval",
    title: "Adaptive Retrieval for LMs",
    jersey: 33,
    role: "Research · Stanford",
    year: "2026",
    status: "Shipped",
    summary: "Research on learning how many passages to retrieve for Spectral Koopman Attention.",
    description: [
      "A three-person study of adaptive retrieval for Spectral Koopman Attention, investigating how to select document context for a system built around Koopman operators.",
      "The team trained a PyTorch network to predict λ from query embeddings, adapting how many document passages are retrieved, and evaluated learned versus fixed λ on 61 validation queries.",
    ],
    highlights: ["Learned λ from query embeddings", "Evaluated on 61 validation queries"],
    tech: ["PyTorch", "NumPy"],
    links: {},
    screenshots: [],
    court: { x: 92, y: 10 },
  },
];
