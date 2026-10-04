"use client";

import { useEffect } from "react";

/** After a client-side screen change, move focus to the new screen's heading. */
export function FocusOnArrival({ targetId }: { targetId: string }) {
  useEffect(() => {
    if (!document.documentElement.classList.contains("js-nav")) return;
    document.getElementById(targetId)?.focus({ preventScroll: true });
  }, [targetId]);
  return null;
}
