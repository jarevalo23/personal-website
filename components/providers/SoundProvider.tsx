"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { playSound, type SoundName } from "@/lib/sound";

const STORAGE_KEY = "sound";
const listeners = new Set<() => void>();

function readEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  window.addEventListener("storage", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", cb);
  };
}

function writeEnabled(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Private mode etc. — the toggle just won't persist.
  }
  listeners.forEach((l) => l());
}

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
  play: (name: SoundName) => void;
};

const SoundContext = createContext<SoundContextValue | null>(null);

/** Sound is OFF by default; the choice is remembered in localStorage. */
export function SoundProvider({ children }: { children: React.ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, readEnabled, () => false);

  const play = useCallback((name: SoundName) => {
    if (readEnabled()) playSound(name);
  }, []);

  const toggle = useCallback(() => {
    const next = !readEnabled();
    writeEnabled(next);
    if (next) playSound("toggle");
  }, []);

  const value = useMemo(() => ({ enabled, toggle, play }), [enabled, toggle, play]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside <SoundProvider>");
  return ctx;
}
