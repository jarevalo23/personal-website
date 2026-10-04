/** Looping stadium-at-night backdrop: floodlights, a panning pitch and drifting particles. Pure CSS. */

// Deterministic pseudo-random values so server and client render the same markup.
const rand = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const particles = Array.from({ length: 22 }, (_, i) => ({
  left: `${(rand(i, 1) * 100).toFixed(2)}%`,
  size: `${(1.5 + rand(i, 2) * 3).toFixed(1)}px`,
  duration: `${(12 + rand(i, 3) * 14).toFixed(1)}s`,
  delay: `${(-rand(i, 4) * 20).toFixed(1)}s`,
  dx: `${((rand(i, 5) - 0.5) * 120).toFixed(0)}px`,
  opacity: (0.25 + rand(i, 6) * 0.55).toFixed(2),
}));

export function StadiumBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,#0f2a4a_0%,#070b18_45%,#04060d_75%)]" />
      <div className="floodlight -left-[20vmax] -top-[30vmax]" />
      <div className="floodlight -right-[20vmax] -top-[30vmax]" style={{ animationDelay: "-3.5s" }} />
      <div className="stadium-floor">
        <div className="stadium-floor-inner" />
      </div>
      {particles.map((p, i) => (
        <span
          key={i}
          className="particle"
          style={
            {
              left: p.left,
              "--s": p.size,
              "--d": p.duration,
              "--delay": p.delay,
              "--dx": p.dx,
              "--o": p.opacity,
            } as React.CSSProperties
          }
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(4,6,13,0.85)_100%)]" />
    </div>
  );
}
