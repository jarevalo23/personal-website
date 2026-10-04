import { profile } from "@/data/profile";

function tier(value: number) {
  if (value >= 90) return "bg-accent";
  if (value >= 80) return "bg-[#b6f75c]";
  return "bg-press";
}

/** Every stat from the profile as an animated bar, FIFA "player attributes" style. */
export function StatBars() {
  return (
    <section aria-labelledby="stats-title" className="panel p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 id="stats-title" className="font-display text-3xl">
          Attributes
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-mist">Out of 99</p>
      </div>
      <ul className="space-y-3">
        {profile.stats.map((s, i) => (
          <li key={s.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className="font-medium">{s.label}</span>
              <span className="font-display text-xl leading-none text-accent">{s.value}</span>
            </div>
            <div
              className="mt-1 h-2 overflow-hidden rounded-full bg-white/[0.08]"
              role="meter"
              aria-label={s.label}
              aria-valuemin={0}
              aria-valuemax={99}
              aria-valuenow={s.value}
            >
              <div
                className={`bar-fill h-full rounded-full ${tier(s.value)}`}
                style={{ width: `${(s.value / 99) * 100}%`, "--i": i } as React.CSSProperties}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
