/** Illustrations for the main-menu tiles. All strokes use the tile's accent. */

const pentagon = (cx: number, cy: number, r: number, rot = -90) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");

const polar = (r: number, deg: number) => {
  const a = (deg * Math.PI) / 180;
  // Rounded so server and browser render identical attribute strings.
  return [+(100 + r * Math.cos(a)).toFixed(1), +(100 + r * Math.sin(a)).toFixed(1)] as const;
};

export function SoccerArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <defs>
        <clipPath id="ball-clip">
          <circle cx="100" cy="100" r="78" />
        </clipPath>
        <radialGradient id="ball-shade" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#1d2a52" />
          <stop offset="1" stopColor="#070b18" />
        </radialGradient>
      </defs>
      {/* pitch markings */}
      <g fill="none" stroke="var(--accent)" strokeOpacity="0.18" strokeWidth="1.5">
        <circle cx="100" cy="100" r="96" />
        <path d="M-40 100 H240" />
      </g>
      <circle cx="100" cy="100" r="78" fill="url(#ball-shade)" />
      <g clipPath="url(#ball-clip)" stroke="var(--accent)" strokeWidth="2.5" strokeLinejoin="round">
        <polygon points={pentagon(100, 100, 24)} fill="var(--accent)" />
        {Array.from({ length: 5 }, (_, i) => {
          const deg = -90 + i * 72;
          const [x1, y1] = polar(24, deg);
          const [x2, y2] = polar(50, deg);
          return <line key={`s${i}`} x1={x1} y1={y1} x2={x2} y2={y2} />;
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const deg = -54 + i * 72;
          const [cx, cy] = polar(76, deg);
          return <polygon key={`p${i}`} points={pentagon(cx, cy, 24, deg + 180)} fill="var(--accent)" fillOpacity="0.9" />;
        })}
        {Array.from({ length: 5 }, (_, i) => {
          const [x1, y1] = polar(50, -90 + i * 72);
          const [x2, y2] = polar(50, -18 + i * 72);
          return <line key={`r${i}`} x1={x1} y1={y1} x2={x2} y2={y2} fill="none" />;
        })}
      </g>
      <circle cx="100" cy="100" r="78" fill="none" stroke="var(--accent)" strokeWidth="3" />
    </svg>
  );
}

export function BasketballArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {/* key + arc */}
      <g fill="none" stroke="var(--accent)" strokeOpacity="0.2" strokeWidth="1.5">
        <path d="M60 -10 V70 H140 V-10" />
        <path d="M5 -10 V40 A95 95 0 0 0 195 40 V-10" />
      </g>
      <circle cx="100" cy="112" r="74" fill="var(--accent)" fillOpacity="0.16" />
      <circle cx="100" cy="112" r="74" fill="none" stroke="var(--accent)" strokeWidth="3" />
      <g fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
        <path d="M100 38 V186" />
        <path d="M26 112 H174" />
        <path d="M50 58 Q92 112 50 166" />
        <path d="M150 58 Q108 112 150 166" />
      </g>
    </svg>
  );
}

export function SwimArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      {/* lane ropes */}
      <g fill="var(--accent)" fillOpacity="0.35">
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={`a${i}`} cx={8 + i * 17} cy="40" r="3.5" />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <circle key={`b${i}`} cx={8 + i * 17} cy="168" r="3.5" />
        ))}
      </g>
      {/* swimmer */}
      <g fill="none" stroke="var(--accent)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M58 104 Q92 46 142 84" />
        <path d="M70 116 L132 112" strokeOpacity="0.6" />
      </g>
      <circle cx="66" cy="100" r="13" fill="var(--accent)" />
      <path d="M58 96 h16" stroke="#04060d" strokeWidth="4" strokeLinecap="round" />
      {/* water */}
      <g fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
        <path d="M10 124 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0" />
        <path d="M10 142 q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0" strokeOpacity="0.55" />
      </g>
      <g fill="var(--accent)" fillOpacity="0.7">
        <circle cx="150" cy="70" r="3" />
        <circle cx="160" cy="58" r="2" />
        <circle cx="140" cy="60" r="2.2" />
      </g>
    </svg>
  );
}

export function MicArt() {
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
      <g fill="none" stroke="var(--accent)" strokeLinecap="round">
        <path d="M44 70 a70 70 0 0 0 0 60" strokeWidth="3" strokeOpacity="0.35" />
        <path d="M156 70 a70 70 0 0 1 0 60" strokeWidth="3" strokeOpacity="0.35" />
        <path d="M28 58 a90 90 0 0 0 0 84" strokeWidth="3" strokeOpacity="0.2" />
        <path d="M172 58 a90 90 0 0 1 0 84" strokeWidth="3" strokeOpacity="0.2" />
      </g>
      <rect
        x="76"
        y="30"
        width="48"
        height="84"
        rx="24"
        fill="var(--accent)"
        fillOpacity="0.18"
        stroke="var(--accent)"
        strokeWidth="4"
      />
      <g stroke="var(--accent)" strokeWidth="3" strokeLinecap="round">
        <path d="M86 56 h28 M86 70 h28 M86 84 h28" />
      </g>
      <g fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round">
        <path d="M62 96 a38 38 0 0 0 76 0" />
        <path d="M100 134 V160 M78 162 h44" />
      </g>
    </svg>
  );
}
