import type { Metadata } from "next";
import { PoolLanes } from "@/components/fun/PoolLanes";
import { SwimRace } from "@/components/fun/SwimRace";
import { ScreenShell } from "@/components/ScreenShell";
import { sections } from "@/data/site";

export const metadata: Metadata = {
  title: sections.fun.title,
  description: sections.fun.description,
  alternates: { canonical: sections.fun.href },
};

export default function FunPage() {
  return (
    <ScreenShell
      section="fun"
      backdrop={
        <>
          <div className="caustics" />
          <div className="caustics b" />
        </>
      }
    >
      <PoolLanes />
      <SwimRace />
    </ScreenShell>
  );
}
