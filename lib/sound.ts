/**
 * Tiny Web Audio synth — every UI sound is generated on the fly, so there are
 * no audio files to download. Nothing plays unless the visitor turns sound on.
 */

type Wave = OscillatorType;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noiseBuffer: AudioBuffer | null = null;

function getContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(
  c: AudioContext,
  opts: { type?: Wave; from: number; to?: number; dur: number; gain?: number; delay?: number; attack?: number },
) {
  const { type = "sine", from, to = from, dur, gain = 0.15, delay = 0, attack = 0.012 } = opts;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t0);
  if (to !== from) osc.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g).connect(master!);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(
  c: AudioContext,
  opts: {
    dur: number;
    gain?: number;
    filter?: BiquadFilterType;
    from: number;
    to?: number;
    q?: number;
    delay?: number;
    attack?: number;
  },
) {
  const { dur, gain = 0.12, filter = "bandpass", from, to = from, q = 1, delay = 0, attack = 0.015 } = opts;
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  }
  const t0 = c.currentTime + delay;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer;
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.Q.value = q;
  f.frequency.setValueAtTime(from, t0);
  if (to !== from) f.frequency.exponentialRampToValueAtTime(to, t0 + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  src.connect(f).connect(g).connect(master!);
  src.start(t0);
  src.stop(t0 + dur + 0.05);
}

const recipes = {
  /** Menu focus change — short airy whoosh. */
  move: (c: AudioContext) => noise(c, { dur: 0.14, gain: 0.09, from: 700, to: 3200, q: 0.9 }),
  /** Confirm / select — two-step blip. */
  /** Confirm / click: a crisp shooter-style "hit marker" tick (original synth, not a sample). */
  select: (c: AudioContext) => {
    // Sharp transient: a very short burst of bright, high-passed noise.
    noise(c, { dur: 0.035, gain: 0.32, filter: "highpass", from: 3800, q: 0.8, attack: 0.001 });
    // Metallic body: two inharmonic pings that ring for a few dozen ms.
    tone(c, { type: "triangle", from: 3150, to: 2900, dur: 0.07, gain: 0.14, attack: 0.001 });
    tone(c, { type: "square", from: 4720, to: 4400, dur: 0.045, gain: 0.035, attack: 0.001 });
    // A tiny low "thud" so it lands with some weight.
    tone(c, { type: "sine", from: 900, to: 400, dur: 0.03, gain: 0.08, attack: 0.001 });
  },
  back: (c: AudioContext) => {
    tone(c, { type: "square", from: 740, dur: 0.06, gain: 0.045 });
    tone(c, { type: "square", from: 494, dur: 0.1, gain: 0.045, delay: 0.06 });
  },
  toggle: (c: AudioContext) => tone(c, { type: "triangle", from: 880, to: 1320, dur: 0.12, gain: 0.08 }),
  kick: (c: AudioContext) => {
    tone(c, { type: "sine", from: 160, to: 45, dur: 0.2, gain: 0.45 });
    noise(c, { dur: 0.06, gain: 0.12, filter: "lowpass", from: 2400, q: 0.5 });
  },
  goal: (c: AudioContext) => {
    [523, 659, 784, 1047].forEach((f, i) => tone(c, { type: "triangle", from: f, dur: 0.22, gain: 0.09, delay: i * 0.08 }));
    noise(c, { dur: 1.6, gain: 0.08, filter: "bandpass", from: 900, to: 1400, q: 0.4, attack: 0.35 });
  },
  save: (c: AudioContext) => {
    tone(c, { type: "sawtooth", from: 330, to: 150, dur: 0.4, gain: 0.06 });
    noise(c, { dur: 0.08, gain: 0.1, filter: "lowpass", from: 1200 });
  },
  post: (c: AudioContext) => {
    tone(c, { type: "triangle", from: 1760, dur: 0.6, gain: 0.08 });
    tone(c, { type: "sine", from: 2640, dur: 0.4, gain: 0.04 });
  },
  bounce: (c: AudioContext) => tone(c, { type: "sine", from: 140, to: 70, dur: 0.12, gain: 0.3 }),
  swish: (c: AudioContext) => noise(c, { dur: 0.32, gain: 0.12, filter: "highpass", from: 1800, to: 6500, q: 0.6 }),
  rim: (c: AudioContext) => {
    tone(c, { type: "triangle", from: 620, dur: 0.18, gain: 0.1 });
    tone(c, { type: "square", from: 310, dur: 0.08, gain: 0.04 });
  },
  beep: (c: AudioContext) => tone(c, { type: "sine", from: 880, dur: 0.16, gain: 0.1 }),
  start: (c: AudioContext) => tone(c, { type: "square", from: 1046, dur: 0.5, gain: 0.07 }),
  buzzer: (c: AudioContext) => {
    tone(c, { type: "sawtooth", from: 116, dur: 0.7, gain: 0.12 });
    tone(c, { type: "square", from: 174, dur: 0.7, gain: 0.05 });
  },
  splash: (c: AudioContext) => noise(c, { dur: 0.6, gain: 0.16, filter: "lowpass", from: 2400, to: 300, q: 0.4 }),
  success: (c: AudioContext) => {
    [784, 988, 1175, 1568].forEach((f, i) => tone(c, { type: "sine", from: f, dur: 0.3, gain: 0.07, delay: i * 0.07 }));
  },
  error: (c: AudioContext) => tone(c, { type: "square", from: 220, to: 160, dur: 0.25, gain: 0.05 }),
} satisfies Record<string, (c: AudioContext) => void>;

export type SoundName = keyof typeof recipes;

export function playSound(name: SoundName) {
  const c = getContext();
  if (!c) return;
  try {
    recipes[name](c);
  } catch {
    // Audio is a nice-to-have; never let it break the UI.
  }
}
