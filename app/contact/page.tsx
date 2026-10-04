import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";
import { CopyEmail } from "@/components/contact/CopyEmail";
import { GitHubIcon, LinkedInIcon, MicIcon } from "@/components/icons";
import { ScreenShell } from "@/components/ScreenShell";
import { profile } from "@/data/profile";
import { sections } from "@/data/site";

export const metadata: Metadata = {
  title: sections.contact.title,
  description: sections.contact.description,
  alternates: { canonical: sections.contact.href },
};

const socials = [
  { label: "GitHub", href: profile.links.github, Icon: GitHubIcon, accent: "github" },
  { label: "LinkedIn", href: profile.links.linkedin, Icon: LinkedInIcon, accent: "linkedin" },
] as const;

export default function ContactPage() {
  return (
    <ScreenShell section="contact" backdrop={<div className="step-repeat absolute inset-0" />}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start">
        <section aria-labelledby="presser-title" className="panel panel-accent p-6 sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-mist">
                <span className="blink inline-block h-2 w-2 rounded-full bg-redcard" aria-hidden="true" />
                Live · Post-match press conference
              </p>
              <h2 id="presser-title" className="font-display mt-2 text-5xl">
                Questions from the floor
              </h2>
              <p className="mt-1 text-mist">Recruiters, collaborators, fellow sports nerds — the mic is yours.</p>
            </div>
            <MicIcon className="hidden h-16 w-16 shrink-0 text-accent sm:block" />
          </div>
          <ContactForm />
        </section>

        <aside className="space-y-4" aria-label="Other ways to reach me">
          <CopyEmail email={profile.email} />
          <div className="grid grid-cols-2 gap-3">
            {socials.map(({ label, href, Icon, accent }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                data-accent={accent}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-ink-800/80 p-4 transition-colors hover:border-accent"
              >
                <Icon className="h-7 w-7 text-accent" />
                <span className="font-display text-2xl">{label}</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
          <div className="panel p-5">
            <h2 className="font-display text-2xl text-accent">Media guide</h2>
            <dl className="mt-3 space-y-3 text-sm">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">Availability</dt>
                <dd className="mt-0.5">{profile.availability}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">Response time</dt>
                <dd className="mt-0.5">{profile.responseTime}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-[0.2em] text-mist">Home ground</dt>
                <dd className="mt-0.5">{profile.location}</dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </ScreenShell>
  );
}
