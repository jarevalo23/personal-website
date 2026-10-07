import type { Metadata } from "next";
import { FreeThrowGame } from "@/components/projects/FreeThrowGame";
import { ProjectsBoard } from "@/components/projects/ProjectsBoard";
import { ScreenShell } from "@/components/ScreenShell";
import { sections } from "@/data/site";

export const metadata: Metadata = {
  title: sections.projects.title,
  description: sections.projects.description,
  alternates: { canonical: sections.projects.href },
};

export default function ProjectsPage() {
  return (
    <ScreenShell section="projects">
      <ProjectsBoard />
      <FreeThrowGame />
    </ScreenShell>
  );
}
