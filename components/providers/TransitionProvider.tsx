"use client";

import { m, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { AccentKey } from "@/data/site";
import type { SoundName } from "@/lib/sound";
import { useSound } from "./SoundProvider";

type NavigateOptions = {
  /** Big text shown while the screen is covered, e.g. "About Me". */
  label?: string;
  accent?: AccentKey;
  /** Sound to play when the transition starts. Defaults to select / back. */
  sound?: SoundName | null;
};

type TransitionContextValue = {
  navigate: (href: string, options?: NavigateOptions) => void;
};

const TransitionContext = createContext<TransitionContextValue | null>(null);

type Wipe = { href: string; label: string; accent: AccentKey; covered: boolean };

const STRIPES = ["bg-accent", "bg-ink-600", "bg-ink-950"] as const;

function markClientNavigation() {
  document.documentElement.classList.add("js-nav");
}

/**
 * Game-style screen switching: diagonal stripes wipe across the screen, the
 * route changes underneath, then the stripes wipe away to reveal the new screen.
 * With prefers-reduced-motion the route simply changes.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const { play } = useSound();
  const [wipe, setWipe] = useState<Wipe | null>(null);

  const navigate = useCallback(
    (href: string, options: NavigateOptions = {}) => {
      if (wipe) return;
      const targetPath = href.split(/[?#]/)[0] || "/";
      const sound = options.sound === undefined ? (targetPath === "/" ? "back" : "select") : options.sound;
      if (sound) play(sound);
      if (targetPath === pathname) return;
      markClientNavigation();
      if (reduceMotion) {
        router.push(href);
        return;
      }
      setWipe({
        href: targetPath,
        label: options.label ?? (targetPath === "/" ? "Main Menu" : ""),
        accent: options.accent ?? "menu",
        covered: false,
      });
    },
    [wipe, pathname, reduceMotion, router, play],
  );

  // Browser back/forward should also get the screen-enter animation.
  useEffect(() => {
    window.addEventListener("popstate", markClientNavigation);
    return () => window.removeEventListener("popstate", markClientNavigation);
  }, []);

  // Safety net: never leave the screen covered if a navigation stalls.
  const covered = wipe?.covered ?? false;
  useEffect(() => {
    if (!covered) return;
    const t = window.setTimeout(() => setWipe(null), 6000);
    return () => window.clearTimeout(t);
  }, [covered]);

  const revealing = wipe !== null && wipe.covered && pathname === wipe.href;

  const onStripeDone = () => {
    if (!wipe) return;
    if (!wipe.covered) {
      setWipe({ ...wipe, covered: true });
      router.push(wipe.href);
    } else if (revealing) {
      setWipe(null);
    }
  };

  const value = useMemo(() => ({ navigate }), [navigate]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      {wipe && (
        <div className="fixed inset-0 z-[100] overflow-hidden" data-accent={wipe.accent} aria-hidden="true">
          {STRIPES.map((color, i) => (
            <m.div
              key={color}
              className={`absolute inset-y-0 -left-[15%] w-[130%] ${color}`}
              style={{ skewX: -12 }}
              initial={{ x: "-118%" }}
              animate={{ x: revealing ? "118%" : "0%" }}
              transition={{
                duration: 0.36,
                ease: [0.7, 0, 0.3, 1],
                delay: revealing ? (STRIPES.length - 1 - i) * 0.05 : i * 0.06,
              }}
              onAnimationComplete={i === STRIPES.length - 1 ? onStripeDone : undefined}
            />
          ))}
          <m.div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={revealing ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
            transition={{ duration: revealing ? 0.15 : 0.25, delay: revealing ? 0 : 0.18 }}
          >
            {wipe.label && <p className="font-display glow-text text-6xl text-accent sm:text-8xl">{wipe.label}</p>}
            <div className="h-1 w-40 overflow-hidden rounded-full bg-white/10">
              <m.div
                className="h-full bg-accent"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </m.div>
        </div>
      )}
    </TransitionContext.Provider>
  );
}

export function useScreenTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error("useScreenTransition must be used inside <TransitionProvider>");
  return ctx;
}
