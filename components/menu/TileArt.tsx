import Image from "next/image";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { funItems } from "@/data/fun";

/* Flat, mostly-white tile artwork in the style of the FIFA 21 menu. */

const pentagon = (cx: number, cy: number, r: number, rot = -90) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

function Ball({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="#f4f1ff" stroke="#c9c2f0" strokeWidth="2" />
      <polygon points={pentagon(50, 50, 15)} fill="#d8d2f7" stroke="#b7aee8" strokeWidth="2" />
      {[0, 1, 2, 3, 4].map((i) => {
        const a = ((-90 + i * 72) * Math.PI) / 180;
        const x = (50 + 38 * Math.cos(a)).toFixed(1);
        const y = (50 + 38 * Math.sin(a)).toFixed(1);
        return (
          <polygon key={i} points={pentagon(+x, +y, 11, -90 + i * 72 + 180)} fill="#d8d2f7" stroke="#b7aee8" strokeWidth="2" />
        );
      })}
    </svg>
  );
}

export function AboutTileArt() {
  const isSvg = profile.photo.endsWith(".svg");
  return (
    <>
      {/* brush shards, like the VOLTA tile */}
      <svg className="absolute -right-6 top-6 h-2/3 w-auto opacity-80" viewBox="0 0 300 260" aria-hidden="true">
        <polygon points="20,60 300,0 300,40 30,100" fill="#ff5bd6" opacity="0.65" />
        <polygon points="0,130 300,60 300,92 10,170" fill="#48e9ff" opacity="0.55" />
        <polygon points="40,200 300,140 300,156 40,214" fill="#fff" opacity="0.35" />
      </svg>
      <div className="absolute bottom-0 right-0 h-[82%] w-[70%]">
        <Image
          src={profile.photo}
          alt=""
          fill
          sizes="(min-width: 1024px) 22vw, 60vw"
          unoptimized={isSvg}
          className="object-contain object-bottom-right"
          priority
        />
      </div>
      <Ball className="absolute -bottom-6 left-3 h-[38%] max-h-36 w-auto drop-shadow-[0_10px_18px_rgba(0,0,0,0.35)]" />
      <div className="absolute left-4 top-[4.25rem] leading-none sm:left-5">
        <p className="font-display text-5xl">{profile.card.rating}</p>
        <p className="font-display text-2xl text-fog/80">{profile.card.position}</p>
      </div>
    </>
  );
}

const CARD = "M20 0 H80 L100 14 V96 L50 120 L0 96 V14 Z";

function FutCard({ number, tone, className }: { number: number; tone: "silver" | "gold" | "bronze"; className?: string }) {
  const fills = {
    silver: ["#f1f1f6", "#b8b8c8"],
    gold: ["#ffe9a3", "#d9a933"],
    bronze: ["#f2c79b", "#b9783f"],
  }[tone];
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`fut-${tone}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={fills[0]} />
          <stop offset="1" stopColor={fills[1]} />
        </linearGradient>
      </defs>
      <path d={CARD} fill={`url(#fut-${tone})`} stroke="#fff" strokeOpacity="0.7" strokeWidth="2" />
      <text
        x="50"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontWeight="700"
        fontSize="18"
        fill="#2a1f00"
        opacity="0.7"
      >
        PRJ
      </text>
      <text x="50" y="84" textAnchor="middle" fontFamily="var(--font-display)" fontWeight="700" fontSize="44" fill="#2a1f00">
        {number}
      </text>
    </svg>
  );
}

export function ProjectsTileArt() {
  const [a, b, c] = [projects[0], projects[1], projects[2]];
  return (
    <>
      <div className="absolute left-4 top-[4.25rem] hidden items-center gap-2 text-xs leading-tight sm:left-5 sm:flex">
        <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-fog/80 font-display text-lg">
          {projects.length}
        </span>
        <span>
          <span className="block font-semibold">Projects</span>
          <span className="text-fog/75">Shot chart &amp; roster</span>
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-3 flex items-end justify-center">
        {a && <FutCard number={a.jersey} tone="silver" className="-mr-4 h-20 w-auto -rotate-6 sm:-mr-6 sm:h-32 lg:h-36" />}
        {b && <FutCard number={b.jersey} tone="gold" className="relative z-10 h-24 w-auto sm:h-40 lg:h-44" />}
        {c && <FutCard number={c.jersey} tone="bronze" className="-ml-4 h-20 w-auto rotate-6 sm:-ml-6 sm:h-32 lg:h-36" />}
      </div>
    </>
  );
}

export function FunTileArt() {
  return (
    <>
      <svg
        className="absolute left-1/2 top-[54%] h-[46%] w-auto -translate-x-1/2 -translate-y-1/2"
        viewBox="0 0 120 120"
        aria-hidden="true"
      >
        <circle cx="60" cy="60" r="56" fill="#f4f1ff" />
        <circle cx="60" cy="60" r="56" fill="none" stroke="#2ee6ff" strokeWidth="5" />
        <circle cx="60" cy="60" r="44" fill="none" stroke="#c9c2f0" strokeWidth="2" />
        <g fill="none" stroke="#2c2379" strokeWidth="5" strokeLinecap="round">
          <path d="M28 66 q8 -7 16 0 t16 0 t16 0 t16 0" />
          <path d="M28 80 q8 -7 16 0 t16 0 t16 0 t16 0" opacity="0.55" />
        </g>
        <circle cx="52" cy="46" r="7" fill="#2c2379" />
        <path d="M58 52 q14 -16 30 -4" fill="none" stroke="#2c2379" strokeWidth="5" strokeLinecap="round" />
      </svg>
      {funItems[0] && (
        <p className="absolute bottom-3 right-4 text-right text-xs leading-tight">
          <span className="block text-fog/75">Lane 1</span>
          <span className="font-semibold">{funItems[0].title}</span>
        </p>
      )}
    </>
  );
}

export function ContactTileArt() {
  const stars = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
    return { x: (60 + 44 * Math.cos(a)).toFixed(1), y: (60 + 44 * Math.sin(a)).toFixed(1) };
  });
  return (
    <>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.18), transparent 55%), repeating-conic-gradient(from 0deg at 50% 45%, rgba(255,255,255,0.06) 0 10deg, transparent 10deg 20deg)",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-x-0 top-[22%] flex flex-col items-center" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="h-24 w-24 sm:h-28 sm:w-28">
          {stars.map((s, i) => (
            <path
              key={i}
              transform={`translate(${s.x} ${s.y}) scale(0.9)`}
              d="M0 -9 L2.6 -2.8 9 -2.8 3.9 1.1 5.8 7.6 0 3.8 -5.8 7.6 -3.9 1.1 -9 -2.8 -2.6 -2.8Z"
              fill="#f4f1ff"
            />
          ))}
          <rect x="49" y="34" width="22" height="36" rx="11" fill="#f4f1ff" />
          <path
            d="M42 60 a18 18 0 0 0 36 0 M60 78 V88 M50 89 h20"
            fill="none"
            stroke="#f4f1ff"
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
        <p className="font-display mt-2 text-2xl leading-none tracking-wide">Press Room</p>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-fog/70">Post-match</p>
      </div>
    </>
  );
}

export function GoalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden="true">
      <g fill="none" stroke="#f4f1ff" strokeWidth="4" strokeLinejoin="round">
        <path d="M8 52 V12 H72 V52" />
        <path d="M16 52 V20 H64 V52" opacity="0.5" />
      </g>
      <g fill="#ff6a3d">
        <path d="M10 2 v10 l9 -4z" />
        <path d="M37 0 v10 l9 -4z" />
        <path d="M64 2 v10 l9 -4z" />
      </g>
      <rect x="4" y="50" width="72" height="4" fill="#48e9ff" />
    </svg>
  );
}

export function HoopIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden="true">
      <rect x="22" y="2" width="36" height="26" fill="none" stroke="#f4f1ff" strokeWidth="4" />
      <rect x="33" y="12" width="14" height="10" fill="none" stroke="#f4f1ff" strokeWidth="3" />
      <path d="M26 30 H54" stroke="#ff8a1f" strokeWidth="5" strokeLinecap="round" />
      <path d="M29 31 L34 50 M40 31 V52 M51 31 L46 50 M31 40 H49" stroke="#f4f1ff" strokeWidth="2.5" fill="none" />
    </svg>
  );
}

export function PoolIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 56" className={className} aria-hidden="true">
      <rect x="4" y="18" width="72" height="36" fill="none" stroke="#f4f1ff" strokeWidth="4" />
      {[30, 42].map((y) => (
        <g key={y}>
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={10 + i * 7.5} cy={y} r="2.4" fill={i % 2 ? "#f4f1ff" : "#ff4d5e"} />
          ))}
        </g>
      ))}
      <g fill="#48e9ff">
        <path d="M14 2 v12 l10 -4z" />
        <path d="M56 2 v12 l10 -4z" />
      </g>
    </svg>
  );
}

export function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 48" className={className} aria-hidden="true">
      <rect x="3" y="3" width="58" height="42" fill="none" stroke="#f4f1ff" strokeWidth="4" />
      <path d="M5 6 L32 28 L59 6" fill="none" stroke="#f4f1ff" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}
