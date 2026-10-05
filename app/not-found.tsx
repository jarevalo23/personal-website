import type { Metadata } from "next";
import { GameLink } from "@/components/GameLink";
import { GameBackground } from "@/components/GameBackground";

export const metadata: Metadata = {
  title: "Offside",
};

export default function NotFound() {
  return (
    <div data-accent="contact" className="relative flex min-h-[calc(100dvh-var(--hud-h))] items-center justify-center px-4 py-16">
      <GameBackground />
      <div className="panel panel-accent max-w-lg p-8 text-center sm:p-10">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">VAR check complete · 404</p>
        <h1 className="font-display mt-3 text-8xl text-accent">Offside!</h1>
        <p className="mt-3 text-mist">
          That page was flagged — it doesn&apos;t exist, or it moved. Head back to the main menu and pick a mode.
        </p>
        <GameLink href="/" transitionLabel="Main Menu" transitionAccent="menu" className="btn-game mt-6">
          Back to main menu
        </GameLink>
      </div>
    </div>
  );
}
