/**
 * Menu backdrop in the spirit of FIFA 21: a purple arena with a reflective
 * floor and bold, angular "brush stroke" art spilling in from the top-left.
 * Pure SVG + CSS, server-rendered.
 */
export function GameBackground({ art = true }: { art?: boolean }) {
  return (
    <div className="scene-base pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      {/* floor + horizon */}
      <div className="absolute inset-x-0 bottom-0 h-[38%] bg-[linear-gradient(180deg,rgba(126,96,255,0.22)_0%,rgba(18,12,55,0.9)_70%)]" />
      <div className="absolute inset-x-0 bottom-[38%] h-px bg-[linear-gradient(90deg,transparent,rgba(200,180,255,0.55),transparent)]" />
      <div className="absolute inset-x-[10%] bottom-[30%] h-24 rounded-full bg-[radial-gradient(ellipse,rgba(163,91,255,0.35),transparent_70%)]" />

      {art && (
        <svg
          className="art-drift absolute -left-[8%] -top-[4%] h-[70%] w-auto max-w-none sm:h-[115%]"
          viewBox="0 0 1100 760"
          preserveAspectRatio="xMinYMin meet"
        >
          <defs>
            <linearGradient id="bg-mag" x1="0" y1="0" x2="1" y2="0.4">
              <stop offset="0" stopColor="#ff5bd6" />
              <stop offset="1" stopColor="#b51fd6" />
            </linearGradient>
            <linearGradient id="bg-cyan" x1="0" y1="0" x2="1" y2="0.3">
              <stop offset="0" stopColor="#48e9ff" />
              <stop offset="1" stopColor="#1d8fe0" />
            </linearGradient>
            <linearGradient id="bg-vio" x1="0" y1="0" x2="1" y2="0.5">
              <stop offset="0" stopColor="#8d5bff" />
              <stop offset="1" stopColor="#4a2bc4" />
            </linearGradient>
            <linearGradient id="bg-fade" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0.45" stopColor="#000" stopOpacity="0" />
              <stop offset="1" stopColor="#000" stopOpacity="1" />
            </linearGradient>
            <mask id="bg-mask">
              <rect width="1100" height="760" fill="#fff" />
              <rect width="1100" height="760" fill="url(#bg-fade)" />
            </mask>
            {/* dry-brush streak texture */}
            <pattern id="bg-brush" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-18)">
              <rect width="16" height="2" fill="#fff" opacity="0.18" />
              <rect y="7" width="16" height="1" fill="#000" opacity="0.18" />
            </pattern>
          </defs>
          <g mask="url(#bg-mask)">
            <polygon points="-40,40 620,-60 700,-10 -30,150" fill="#1d1560" />
            <polygon points="-60,120 760,-20 820,40 -40,250" fill="url(#bg-mag)" />
            <polygon points="-60,120 760,-20 820,40 -40,250" fill="url(#bg-brush)" />
            <polygon points="-40,270 880,70 860,128 -70,360" fill="url(#bg-cyan)" />
            <polygon points="-40,270 880,70 860,128 -70,360" fill="url(#bg-brush)" />
            <polygon points="60,350 940,150 930,166 50,372" fill="#ffffff" opacity="0.75" />
            <polygon points="-80,380 700,215 760,280 -60,500" fill="url(#bg-vio)" />
            <polygon points="-80,380 700,215 760,280 -60,500" fill="url(#bg-brush)" />
            <polygon points="-40,505 560,370 540,402 -60,560" fill="url(#bg-mag)" opacity="0.85" />
            <polygon points="20,590 640,440 650,452 10,612" fill="#48e9ff" opacity="0.7" />
            <polygon points="120,40 980,-40 990,-28 130,62" fill="#ffffff" opacity="0.5" />
            <polygon points="300,210 1040,40 1060,70 310,250" fill="#1d1560" opacity="0.65" />
            <polygon points="-20,640 380,560 400,590 -30,700" fill="url(#bg-vio)" opacity="0.6" />
          </g>
        </svg>
      )}
      {art && (
        <svg
          className="art-drift absolute -bottom-[6%] -right-[6%] h-[55%] w-auto max-w-none"
          viewBox="0 0 700 500"
          aria-hidden="true"
        >
          <polygon points="700,40 120,300 160,340 700,130" fill="url(#bg-cyan)" opacity="0.8" />
          <polygon points="700,180 60,470 120,500 700,280" fill="url(#bg-mag)" opacity="0.75" />
          <polygon points="700,300 260,500 300,500 700,330" fill="#ffffff" opacity="0.45" />
          <polygon points="700,0 380,140 400,160 700,40" fill="url(#bg-vio)" opacity="0.8" />
        </svg>
      )}
    </div>
  );
}
