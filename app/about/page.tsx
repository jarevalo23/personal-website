import type { Metadata } from "next";
import { PenaltyGame } from "@/components/about/PenaltyGame";
import { PlayerCard } from "@/components/about/PlayerCard";
import { ScoutingReport } from "@/components/about/ScoutingReport";
import { StatBars } from "@/components/about/StatBars";
import { ScreenShell } from "@/components/ScreenShell";
import { sections } from "@/data/site";

export const metadata: Metadata = {
  title: sections.about.title,
  description: sections.about.description,
  alternates: { canonical: sections.about.href },
};

export default function AboutPage() {
  return (
    <ScreenShell section="about">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-6">
          <PlayerCard />
          <StatBars />
        </div>
        <div className="space-y-6">
          <PenaltyGame />
          <ScoutingReport />
        </div>
      </div>
    </ScreenShell>
  );
}
