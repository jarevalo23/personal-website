"use client";

import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function read(key: string): number | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** A number remembered in localStorage (e.g. a high score). `null` until one is saved. */
export function usePersistentNumber(key: string) {
  const value = useSyncExternalStore(
    subscribe,
    () => read(key),
    () => null,
  );
  const save = useCallback(
    (n: number) => {
      try {
        localStorage.setItem(key, String(n));
      } catch {
        // Storage unavailable: the score just won't persist.
      }
      listeners.forEach((l) => l());
    },
    [key],
  );
  return [value, save] as const;
}
