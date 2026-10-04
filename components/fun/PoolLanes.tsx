import { funItems } from "@/data/fun";

/** Lane rope: alternating floats like a real competition pool. */
function LaneRope() {
  return (
    <div
      className="wave-bob h-2.5 rounded-full opacity-80"
      style={{
        background: "repeating-linear-gradient(90deg, #ff4d5e 0 10px, #eef2ff 10px 20px, #2ee6ff 20px 30px, #eef2ff 30px 40px)",
        maskImage: "radial-gradient(circle at center, black 55%, transparent 56%)",
        maskSize: "10px 10px",
        maskRepeat: "repeat-x",
      }}
      aria-hidden="true"
    />
  );
}

/** Each fun item gets its own lane; content comes from data/fun.ts. */
export function PoolLanes() {
  return (
    <section aria-labelledby="lanes-title" className="mb-8">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="lanes-title" className="font-display text-3xl">
          Lane Assignments
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-mist">{funItems.length} lanes</p>
      </div>
      <div className="overflow-hidden rounded-2xl border border-pool/20 bg-[#04243a]/70">
        <LaneRope />
        <ol>
          {funItems.map((item, i) => (
            <li key={item.title}>
              <article className="group relative flex items-stretch gap-4 overflow-hidden px-3 py-4 transition-colors duration-300 hover:bg-pool/[0.07] sm:gap-6 sm:px-4">
                {/* black lane line on the pool floor */}
                <div
                  className="pointer-events-none absolute inset-x-24 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-ink-950/40 transition-colors duration-300 group-hover:bg-pool/25"
                  aria-hidden="true"
                />
                <div className="relative flex w-16 shrink-0 flex-col items-center justify-center rounded-lg bg-pool text-accent-ink sm:w-20">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em]">Lane</span>
                  <span className="font-display text-4xl leading-none">{i + 1}</span>
                </div>
                <div className="relative flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-pool/30 bg-ink-950/50 text-2xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                    aria-hidden="true"
                  >
                    {item.emoji}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">{item.category}</p>
                    <h3 className="font-display text-2xl leading-tight sm:text-3xl">{item.title}</h3>
                    <p className="mt-1 text-sm text-mist">{item.description}</p>
                  </div>
                  {(item.tags?.length || item.link) && (
                    <div className="flex flex-wrap items-center gap-2 sm:max-w-[16rem] sm:justify-end">
                      {item.tags?.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-pool/25 bg-pool/10 px-2.5 py-0.5 text-xs font-semibold"
                        >
                          {t}
                        </span>
                      ))}
                      {item.link && (
                        <a
                          href={item.link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline text-sm font-semibold text-accent"
                        >
                          {item.link.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </article>
              <LaneRope />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
