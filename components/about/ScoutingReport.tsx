import { fullName, profile } from "@/data/profile";

/** The bio, written up as a scout's report. Content comes from data/profile.ts. */
export function ScoutingReport() {
  const { scouting } = profile;
  return (
    <section aria-labelledby="scout-title" className="panel relative overflow-hidden p-6 sm:p-8">
      <div
        className="pointer-events-none absolute right-6 top-8 hidden rotate-[-10deg] rounded-md border-[3px] border-accent/70 px-4 py-1 font-display text-3xl tracking-widest text-accent/80 sm:block"
        aria-hidden="true"
      >
        Top prospect
      </div>

      <p className="text-xs font-bold uppercase tracking-wider text-accent">Scouting report · {fullName}</p>
      <h2 id="scout-title" className="font-display mt-2 max-w-2xl text-4xl sm:pr-44 sm:text-5xl lg:pr-0">
        {scouting.headline}
      </h2>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6">
          <div className="space-y-4 leading-relaxed text-fog/90">
            {scouting.summary.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-2xl text-accent">Strengths</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {scouting.strengths.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-0.5 text-accent" aria-hidden="true">
                      ▲
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-2xl text-press">Still developing</h3>
              <ul className="mt-2 space-y-2 text-sm">
                {scouting.developing.map((s) => (
                  <li key={s} className="flex gap-2">
                    <span className="mt-0.5 text-press" aria-hidden="true">
                      ◆
                    </span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <dl className="divide-y divide-white/[0.07] rounded-xl border border-white/[0.07] bg-ink-950/40">
            {scouting.attributes.map((a) => (
              <div key={a.label} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                <dt className="text-mist">{a.label}</dt>
                <dd className="text-right font-semibold">{a.value}</dd>
              </div>
            ))}
          </dl>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-mist">Plays like</h3>
            <p className="mt-1 font-display text-2xl">{scouting.playsLike}</p>
          </div>
          <div className="rounded-xl border-l-4 border-accent bg-accent/[0.07] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-accent">Scout&apos;s verdict</h3>
            <p className="mt-1 text-fog">{scouting.verdict}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
