"use client";

import { AnimatePresence, m } from "framer-motion";
import { useEffect, useState } from "react";

const REPEAT_DELAY = 380;
const REPEAT_RATE = 150;

function sendKey(key: string, target: EventTarget) {
  target.dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, cancelable: true }));
}

/**
 * Real controller support via the Gamepad API: D-pad / left stick act as arrow
 * keys, A (Cross) activates the focused element, B (Circle) acts like Esc.
 * Polling only runs while a controller is connected.
 */
export function GamepadBridge() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let raf = 0;
    const held = new Map<string, { since: number; last: number }>();

    const loop = (t: number) => {
      const pad = Array.from(navigator.getGamepads?.() ?? []).find(Boolean);
      if (!pad) {
        raf = 0;
        return;
      }
      const btn = (i: number) => pad.buttons[i]?.pressed ?? false;
      const [ax = 0, ay = 0] = pad.axes;
      const pressed = new Set<string>();
      if (btn(12) || ay < -0.55) pressed.add("ArrowUp");
      if (btn(13) || ay > 0.55) pressed.add("ArrowDown");
      if (btn(14) || ax < -0.55) pressed.add("ArrowLeft");
      if (btn(15) || ax > 0.55) pressed.add("ArrowRight");
      if (btn(0)) pressed.add("A");
      if (btn(1)) pressed.add("B");

      for (const key of held.keys()) if (!pressed.has(key)) held.delete(key);

      for (const key of pressed) {
        const state = held.get(key);
        const isArrow = key.startsWith("Arrow");
        const fresh = !state;
        const repeat = state && isArrow && t - state.since > REPEAT_DELAY && t - state.last > REPEAT_RATE;
        if (!fresh && !repeat) continue;
        held.set(key, { since: state?.since ?? t, last: t });

        const active = (document.activeElement as HTMLElement | null) ?? document.body;
        if (isArrow) sendKey(key, active);
        else if (key === "A" && active !== document.body) active.click();
        else if (key === "B") {
          // Synthetic Esc can't close a native <dialog>, so close it directly.
          const dialog = document.querySelector<HTMLDialogElement>("dialog[open]");
          if (dialog) dialog.close();
          else sendKey("Escape", active);
        }
      }
      raf = requestAnimationFrame(loop);
    };

    const onConnect = (e: GamepadEvent) => {
      setToast(e.gamepad.id.split("(")[0].trim() || "Controller");
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const onDisconnect = () => setToast(null);

    window.addEventListener("gamepadconnected", onConnect);
    window.addEventListener("gamepaddisconnected", onDisconnect);
    return () => {
      window.removeEventListener("gamepadconnected", onConnect);
      window.removeEventListener("gamepaddisconnected", onDisconnect);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 4500);
    return () => window.clearTimeout(t);
  }, [toast]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4" role="status" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <m.div
            className="panel panel-accent flex items-center gap-3 px-4 py-3 text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <span aria-hidden="true">🎮</span>
            <span>
              <strong className="font-semibold">Controller connected.</strong>{" "}
              <span className="text-mist">D-pad to move · A to select · B to go back</span>
            </span>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
