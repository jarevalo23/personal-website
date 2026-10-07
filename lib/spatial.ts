export type Direction = "up" | "down" | "left" | "right";

export const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

/**
 * Spatial navigation: from the element at `from`, pick the nearest element in
 * `dir` using on-screen geometry, so it works for any responsive grid layout.
 * Returns -1 when nothing lies in that direction.
 */
export function findNeighbor(rects: DOMRect[], from: number, dir: Direction): number {
  const a = rects[from];
  if (!a) return -1;
  const horizontal = dir === "left" || dir === "right";
  let best = -1;
  let bestScore = Infinity;

  rects.forEach((r, i) => {
    if (i === from) return;
    const tol = 4;
    const gap =
      dir === "right"
        ? r.left - a.right
        : dir === "left"
          ? a.left - r.right
          : dir === "down"
            ? r.top - a.bottom
            : a.top - r.bottom;
    if (gap < -tol) return;

    // Overlap along the other axis (0 when the ranges overlap).
    const [a1, a2, b1, b2] = horizontal ? [a.top, a.bottom, r.top, r.bottom] : [a.left, a.right, r.left, r.right];
    const offAxisGap = Math.max(0, Math.max(a1, b1) - Math.min(a2, b2));
    const centerDelta = Math.abs((a1 + a2) / 2 - (b1 + b2) / 2);

    const score = Math.max(0, gap) + offAxisGap * 3 + centerDelta * 0.25;
    // Near-ties go to the earlier element (reading order: top-left first).
    if (score < bestScore - 6) {
      bestScore = score;
      best = i;
    }
  });

  return best;
}
