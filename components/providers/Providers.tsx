"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import { GamepadBridge } from "./GamepadBridge";
import { SoundProvider } from "./SoundProvider";
import { TransitionProvider } from "./TransitionProvider";

// Animation features load in a separate chunk after first paint.
const loadFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <LazyMotion features={loadFeatures} strict>
        <SoundProvider>
          <TransitionProvider>
            {children}
            <GamepadBridge />
          </TransitionProvider>
        </SoundProvider>
      </LazyMotion>
    </MotionConfig>
  );
}
