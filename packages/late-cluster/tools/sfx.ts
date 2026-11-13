/**
 * The studio audience and the band's stings: a named SFX library, every sound made by CHIMERA
 * voices (crowd voices laughing, groaning, cooing; beatbox lip pops and tongue clicks scattered
 * into applause; sung scat for stings). Deterministic: each variant has its own seeded RNG, and
 * the voice renders underneath are disk-cached by clips.ts.
 *
 * `{ sfx: 'laugh' }` picks the next variant round-robin (laugh-1, laugh-2, …); `{ sfx: 'laugh-2' }`
 * asks for one.
 */
import { FS, loadEngine } from "./engine.ts";
import { beatClip, creatureClip, hitClip, sayClip, singClip, vocalClip, peakOf, type Clip, type VoiceSpec } from "./clips.ts";
import { CAST } from "../src/cast.js";

export interface StereoClip {
  L: Float32Array;
  R: Float32Array;
  /** clip seconds where the sound starts / effectively ends (−40 dB re peak) */
  t0: number;
  t1: number;
  /** default fraction of (t1 − t0) the script cursor waits */
  hold: number;
  /** how much it ducks under dialogue: 1 = fully (crowd), 0 = not at all (punchline one-shots) */
  duck?: number;
}

// ------------------------------------------------------------------ helpers

function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const r2 = (x: number) => Math.round(x * 100) / 100;
const pick = <T,>(r: () => number, xs: readonly T[]): T => xs[Math.floor(r() * xs.length)];

class Bus {
  L: Float32Array;
  R: Float32Array;
  constructor(sec: number) {
    this.L = new Float32Array(Math.ceil(sec * FS));
    this.R = new Float32Array(Math.ceil(sec * FS));
  }
  /** add mono x at time t (s), gain g, equal-power pan p (−1..1), optional resample ratio (>1 = higher, shorter) */
  add(x: Float32Array, t: number, g: number, p: number, ratio = 1): void {
    const a = ((p + 1) * Math.PI) / 4;
    const gl = g * Math.cos(a), gr = g * Math.sin(a);
    const n0 = Math.round(t * FS);
    const n = Math.floor((x.length - 1) / ratio);
    this.grow(n0 + n + 1);
    for (let i = 0; i < n; i++) {
      const j = n0 + i;
      if (j < 0) continue;
      const s = i * ratio, k = Math.floor(s), f = s - k;
      const v = x[k] * (1 - f) + x[k + 1] * f;
      this.L[j] += v * gl;
      this.R[j] += v * gr;
    }
  }
  grow(n: number): void {
    if (n <= this.L.length) return;
    const L = new Float32Array(n), R = new Float32Array(n);
    L.set(this.L), R.set(this.R);
    this.L = L, this.R = R;
  }
}

/** A small Schroeder room (4 combs + 2 allpasses per side): puts the crowd a few rows back. */
function room(bus: Bus, wet: number, tail = 0.6): void {
  bus.grow(bus.L.length + Math.round(tail * FS));
  const combs = [1116, 1188, 1277, 1356], aps = [556, 441];
  for (const [ch, spread] of [[bus.L, 0], [bus.R, 23]] as const) {
    const x = Float32Array.from(ch);
    const y = new Float32Array(x.length);
    for (const d0 of combs) {
      const d = Math.round(((d0 + spread) * FS) / 44100);
      const buf = new Float32Array(d);
      let k = 0, lp = 0;
      for (let i = 0; i < x.length; i++) {
        const o = buf[k];
        lp = o * 0.6 + lp * 0.4;
        buf[k] = x[i] + lp * 0.78;
        y[i] += o * 0.25;
        k = (k + 1) % d;
      }
    }
    for (const d0 of aps) {
      const d = Math.round(((d0 + spread) * FS) / 44100);
      const buf = new Float32Array(d);
      let k = 0;
      for (let i = 0; i < y.length; i++) {
        const b = buf[k];
        const v = y[i];
        buf[k] = v + b * 0.5;
        y[i] = b - v;
        k = (k + 1) % d;
      }
    }
    for (let i = 0; i < ch.length; i++) ch[i] = x[i] * (1 - wet * 0.5) + y[i] * wet;
  }
}

/** Trim, fade the tail, scale to `level` peak, find onset / effective end. */
function finish(bus: Bus, level: number, hold: number): StereoClip {
  highpass(bus.L, 20), highpass(bus.R, 20); // DC guard
  let pk = 0;
  for (let i = 0; i < bus.L.length; i++) pk = Math.max(pk, Math.abs(bus.L[i]), Math.abs(bus.R[i]));
  const g = pk > 1e-6 ? level / pk : 0;
  const W = 480;
  const nW = Math.floor(bus.L.length / W);
  const env = new Float32Array(nW);
  let emax = 0;
  for (let w = 0; w < nW; w++) {
    let s = 0;
    for (let i = w * W; i < (w + 1) * W; i++) s += bus.L[i] * bus.L[i] + bus.R[i] * bus.R[i];
    env[w] = Math.sqrt(s / (2 * W));
    emax = Math.max(emax, env[w]);
  }
  let a = 0, b = nW - 1;
  while (a < nW && env[a] < emax * 0.01) a++;
  while (b > a && env[b] < emax * 0.01) b--;
  // −40 dB re peak, then keep 0.25 s of tail with a fade
  const n = Math.min(bus.L.length, (b + 1) * W + Math.round(0.25 * FS));
  const L = bus.L.slice(0, n), R = bus.R.slice(0, n);
  const fade = Math.round(0.25 * FS);
  for (let i = 0; i < n; i++) {
    const f = i >= n - fade ? (n - i) / fade : 1;
    L[i] *= g * f;
    R[i] *= g * f;
  }
  return { L, R, t0: (a * W) / FS, t1: ((b + 1) * W) / FS, hold };
}

function crowdVoice(r: () => number): VoiceSpec {
  const fem = r() < 0.5;
  const female = r2(fem ? 0.75 + r() * 0.25 : r() * 0.25);
  const child = r() < 0.12 ? r2(0.1 + r() * 0.25) : 0;
  const f0 = Math.round(fem ? 180 + r() * 60 : 98 + r() * 42);
  return {
    body: { female, child },
    f0,
    rate: r2(0.9 + r() * 0.35),
    accent: r2(0.1 + r() * 0.15),
    source: { breathiness: r2(0.25 + r() * 0.25), tension: r2(0.4 + r() * 0.2) },
  };
}

/** One person laughing: n pulses of h + vowel, pitch starting high and falling. */
async function laugher(r: () => number, o: { pulses: [number, number]; vowels: string[]; lift: number; soft?: boolean }): Promise<Clip> {
  const v = crowdVoice(r);
  const n = o.pulses[0] + Math.floor(r() * (o.pulses[1] - o.pulses[0] + 1));
  const vow = pick(r, o.vowels);
  const top = v.f0 * (o.lift + r() * 0.25);
  const segs: { ipa: string; dur?: number; f0?: number; stress?: number }[] = [];
  for (let k = 0; k < n; k++) {
    const f = Math.round(top * Math.pow(0.93, k) * (0.97 + r() * 0.06));
    segs.push({ ipa: "h", dur: r2(0.045 + r() * 0.035) });
    segs.push({ ipa: vow, dur: r2((o.soft ? 0.07 : 0.085) + r() * 0.05), f0: f, stress: k === 0 ? 1 : 2 });
  }
  return vocalClip({ ...v, source: { ...v.source, breathiness: r2((v.source!.breathiness ?? 0.3) + (o.soft ? 0.15 : 0.05)) } }, segs);
}

/** One person holding a vowel on a pitch glide (ooh, aww, groan, woo). `shape` gives f0 multipliers over 0..1 of the vowel. */
async function glider(r: () => number, onset: string | null, vowel: string, dur: number, shape: [number, number][], extra: Partial<VoiceSpec> = {}): Promise<Clip> {
  const v = { ...crowdVoice(r), ...extra };
  const d = r2(dur * (0.85 + r() * 0.3));
  const segs = [...(onset ? [{ ipa: onset }] : []), { ipa: vowel, dur: d, stress: 1 }];
  const lead = 0.05 + (onset ? 0.07 : 0);
  const contour: [number, number][] = shape.map(([x, m]) => [r2(lead + x * d), Math.round(v.f0 * m)]);
  return vocalClip(v, segs, { contour });
}

// ------------------------------------------------------------------ the library

type Maker = (r: () => number) => Promise<StereoClip>;

async function laughMix(r: () => number, o: { voices: number; spread: number; pulses: [number, number]; vowels: string[]; level: number; woos?: number; hold: number; soft?: boolean; lift?: number }): Promise<StereoClip> {
  const bus = new Bus(4);
  for (let i = 0; i < o.voices; i++) {
    const c = await laugher(r, { pulses: o.pulses, vowels: o.vowels, lift: o.lift ?? 1.25, soft: o.soft });
    // most people laugh right away, a few catch on late
    const t = Math.pow(r(), 1.8) * o.spread;
    bus.add(c.audio, t, 0.35 + r() * 0.65, (r() * 2 - 1) * 0.9, 1);
  }
  for (let i = 0; i < (o.woos ?? 0); i++) {
    const c = await glider(r, "w", "u", 0.55, [[0, 1.15], [0.6, 1.6], [1, 1.35]]);
    bus.add(c.audio, 0.4 + r() * o.spread, 0.55, (r() * 2 - 1) * 0.8);
  }
  room(bus, 0.22);
  return finish(bus, o.level, o.hold);
}

async function glideMix(r: () => number, o: { voices: number; onset: string | null; vowel: string; dur: number; shape: [number, number][]; spread: number; level: number; hold: number }): Promise<StereoClip> {
  const bus = new Bus(3);
  for (let i = 0; i < o.voices; i++) {
    const c = await glider(r, o.onset, o.vowel, o.dur, o.shape);
    bus.add(c.audio, r() * o.spread, 0.45 + r() * 0.55, (r() * 2 - 1) * 0.9);
  }
  room(bus, 0.25);
  return finish(bus, o.level, o.hold);
}

const CLAP_BODIES = [{ female: 0, child: 0 }, { female: 1, child: 0 }, { female: 0.5, child: 0.3 }, { female: 0.2, child: 0 }];
/** beatbox sounds that make a decent hand clap once high-passed and cut short, with weights */
const CLAP_SOUNDS: [string, number][] = [["!", 3], ["t", 2], ["Pf", 2], ["K", 1], ["P!", 1]];

/** 2nd-order (RBJ) high-pass, in place */
function highpass(x: Float32Array, fc: number, q = 0.707): Float32Array {
  const w = (2 * Math.PI * fc) / FS, al = Math.sin(w) / (2 * q), cw = Math.cos(w);
  const a0 = 1 + al;
  const b0 = (1 + cw) / 2 / a0, b1 = -(1 + cw) / a0, b2 = b0, a1 = (-2 * cw) / a0, a2 = (1 - al) / a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const y = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1, x1 = x[i], y2 = y1, y1 = y;
    x[i] = y;
  }
  return x;
}

/** a beatbox hit made clap-like: high-passed at 450 Hz, cut to ~110 ms, renormalized */
function clapify(c: Clip): Clip {
  const n = Math.min(c.audio.length, Math.round((c.t0 + 0.11) * FS));
  const x = highpass(c.audio.slice(0, n), 450);
  const f0 = Math.round((c.t0 + 0.035) * FS);
  for (let i = f0; i < n; i++) x[i] *= 0.5 + 0.5 * Math.cos((Math.PI * (i - f0)) / (n - f0));
  const p = peakOf(x);
  if (p > 0) for (let i = 0; i < n; i++) x[i] *= 0.7 / p;
  return { ...c, audio: x, t1: n / FS };
}

async function applauseMix(r: () => number, o: { dur: number; rate: number; level: number; woos: number; hold: number }): Promise<StereoClip> {
  const hits: Clip[] = [];
  for (const b of CLAP_BODIES) for (const [s, w] of CLAP_SOUNDS) {
    const h = clapify(await hitClip(b, s));
    for (let k = 0; k < w; k++) hits.push(h);
  }
  const bus = new Bus(o.dur + 1);
  // density: swell over 0.35 s, hold, then decay over the last ~45 %
  const env = (t: number) => {
    const x = t / o.dur;
    if (t < 0.35) return Math.pow(t / 0.35, 1.5);
    if (x < 0.5) return 1;
    return Math.max(0, Math.exp(-((x - 0.5) / 0.5) * 3.2) - 0.04);
  };
  let t = 0;
  while (t < o.dur) {
    t += -Math.log(1 - r()) / o.rate;
    if (r() > env(t)) continue;
    const h = pick(r, hits);
    const g = Math.pow(10, (-r() * 16) / 20) * (0.5 + 0.5 * env(t));
    bus.add(h.audio, t - h.t0, g * 0.5, (r() * 2 - 1) * 0.95, 0.85 + r() * 0.4);
  }
  // the room thickens it; claps stay bright (the comb filters are low-passed)
  for (let i = 0; i < o.woos; i++) {
    const c = await glider(r, "w", "u", 0.6, [[0, 1.15], [0.6, 1.65], [1, 1.35]]);
    bus.add(c.audio, 0.3 + r() * o.dur * 0.5, 0.45, (r() * 2 - 1) * 0.7);
  }
  room(bus, 0.2);
  return finish(bus, o.level, o.hold);
}

const SPEC = (id: keyof typeof CAST): VoiceSpec => {
  const c = CAST[id] as { body: VoiceSpec["body"]; f0: number; rate?: number; accent?: number; source?: Record<string, number> };
  return { body: c.body, f0: c.f0, rate: c.rate, accent: c.accent, source: c.source };
};

async function rimshotMix(_r: () => number): Promise<StereoClip> {
  const c = await beatClip(SPEC("pete"), { bpm: 112, pattern: "Pf . B . | . . kch . | . . . . | . . . ." }, 0.3);
  const bus = new Bus(c.audio.length / FS + 0.5);
  bus.add(c.audio, 0, 1, -0.5);
  room(bus, 0.15, 0.4);
  return finish(bus, 0.5, 1);
}

/** A band sting: three Formants scat a rising figure in close harmony, Pete hits kick + crash. */
async function stingMix(_r: () => number, v: 1 | 2): Promise<StereoClip> {
  const bpm = 150;
  const lyr = v === 1 ? "bah da bah dah" : "doo wah doo wah";
  const top: [number, number][] = v === 1 ? [[67, 0.5], [69, 0.5], [71, 0.5], [74, 2.5]] : [[72, 0.5], [71, 0.5], [67, 0.5], [69, 2.5]];
  const mid: [number, number][] = v === 1 ? [[64, 0.5], [65, 0.5], [67, 0.5], [71, 2.5]] : [[67, 0.5], [67, 0.5], [64, 0.5], [65, 2.5]];
  const low: [number, number][] = v === 1 ? [[48, 0.5], [50, 0.5], [52, 0.5], [43, 2.5]] : [[48, 0.5], [47, 0.5], [45, 0.5], [41, 2.5]];
  const lead = 0.3;
  const parts: [Clip, number, number][] = [
    [await singClip(SPEC("dee"), { bpm, lyrics: lyr, notes: top, vibrato: 35 }, lead), 0.8, CAST.dee.pan],
    [await singClip(SPEC("hy"), { bpm, lyrics: lyr, notes: mid, vibrato: 30 }, lead), 0.8, CAST.hy.pan],
    [await singClip(SPEC("al"), { bpm, lyrics: lyr, notes: low, vibrato: 20 }, lead), 0.85, CAST.al.pan],
    [await beatClip(SPEC("pete"), { bpm, pattern: "B . . . B . kch . | . . . . . . . . | . . . ." }, lead), 0.9, CAST.pete.pan],
  ];
  const bus = new Bus(3);
  for (const [c, g, p] of parts) bus.add(c.audio, 0, g, p);
  room(bus, 0.18, 0.5);
  return finish(bus, 0.6, 1);
}


// ------------------------------------------------------------------ studio one-shots

/** multiply by an envelope given as a function of clip seconds */
function shape(x: Float32Array, env: (t: number) => number): Float32Array {
  for (let i = 0; i < x.length; i++) x[i] *= env(i / FS);
  return x;
}

/** soft-clip transients down to `k` × the RMS of the sounding part, then renormalize (an elephant's
 *  trumpet starts with a spike 20 dB above its body) */
function tame(x: Float32Array, k = 4): Float32Array {
  let s = 0, n = 0;
  const pk = peakOf(x);
  for (let i = 0; i < x.length; i++) if (Math.abs(x[i]) > pk * 0.01) (s += x[i] * x[i]), n++;
  const lim = k * Math.sqrt(s / Math.max(1, n));
  if (lim < pk) for (let i = 0; i < x.length; i++) x[i] = lim * Math.tanh(x[i] / lim);
  return x;
}

/** a mono clip as a stereo sfx: pan, optional room, level, hold, duck depth */
function mono(c: Clip | Float32Array, o: { pan?: number; room?: number; level: number; hold: number; duck: number; at?: number }): StereoClip {
  const audio = highpass(Float32Array.from(c instanceof Float32Array ? c : c.audio), 30);
  const bus = new Bus(audio.length / FS + 0.6);
  bus.add(audio, o.at ?? 0, 1, o.pan ?? 0);
  if (o.room) room(bus, o.room, 0.5);
  return { ...finish(bus, o.level, o.hold), duck: o.duck };
}

// ---- creatures: punchlines that cut through (they barely duck)

type CreatureSpec = Parameters<typeof creatureClip>[1];
const CREATURE_SFX: Record<string, { id: string; v: (CreatureSpec & { resample?: number })[]; level: number; tame?: number; about: string }> = {
  caw: {
    id: "songbird", level: 0.5, about: "crow-ish caw caw: the songbird pitched down, overdriven, falling",
    v: [
      { params: { drive: 1, purity: 0, voices: 0.4, interval: -1, gape: 1, tension: 0.2, pressure: 1.6 }, notes: [[0, 0.3, 900, 600], [0.42, 0.34, 850, 560]] },
      { params: { drive: 1, purity: 0.05, voices: 0.6, interval: 1, gape: 0.9, tension: 0.1, pressure: 1.8, oec: 1.2 }, notes: [[0, 0.38, 700, 450]] },
    ],
  },
  cluck: {
    id: "songbird", level: 0.45, about: "buk buk buk-BAAK: the songbird, short and low",
    v: [
      { params: { drive: 0.7, purity: 0.1, voices: 0, gape: 0.3, pressure: 1.2 }, notes: [[0, 0.06, 600, 520], [0.14, 0.06, 620, 520], [0.28, 0.06, 600, 520], [0.45, 0.28, 900, 700]] },
      { params: { drive: 0.8, purity: 0.15, voices: 0.2, gape: 0.35, pressure: 1.3 }, notes: [[0, 0.05, 560, 500], [0.11, 0.05, 580, 500], [0.25, 0.07, 640, 540], [0.4, 0.05, 560, 500]] },
    ],
  },
  seal: {
    id: "seal", level: 0.5, about: "two pulsed seal barks",
    v: [
      { params: { pulseRate: 25, pulse: 0.9, rough: 0.5, bright: 0.4, mouth: 0.7, pressure: 14 }, notes: [[0, 0.22, 320, 260], [0.35, 0.22, 330, 250]] },
      { params: { pulseRate: 20, pulse: 0.95, rough: 0.6, bright: 0.35, mouth: 0.8, pressure: 15 }, notes: [[0, 0.18, 280, 240], [0.27, 0.18, 290, 240], [0.54, 0.24, 300, 230]] },
    ],
  },
  gator: { id: "alligator", level: 0.55, about: "alligator growl / bellow (sub rumble, noisy)", v: [{ call: "growl" }, { call: "bellow" }] },
  trumpet: { id: "elephant", level: 0.5, tame: 3, about: "elephant trumpet (transient tamed)", v: [{ call: "trumpet" }, { call: "trumpet", resample: 0.8 }] },
};

async function creatureSfx(name: string, variant: number): Promise<StereoClip> {
  const e = CREATURE_SFX[name];
  const { resample, ...spec } = e.v[variant - 1];
  const c = await creatureClip(e.id, spec);
  let x = Float32Array.from(c.audio);
  if (resample) {
    // the call's pitch is fixed by its keyframes: shift a variant by resampling (lower = slower)
    const n = Math.floor((x.length - 1) / resample);
    const y = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const s = i * resample, k = Math.floor(s), f = s - k;
      y[i] = x[k] * (1 - f) + x[k + 1] * f;
    }
    x = y;
  }
  if (e.tame) tame(x, e.tame);
  return mono(x, { pan: 0, room: 0.12, level: e.level, hold: 0.8, duck: 0.15 });
}

/** the bestiary: creature id → its call ids (for validation and the README) */
export async function creatureCalls(): Promise<Record<string, string[]>> {
  const { E } = await loadEngine();
  return Object.fromEntries((E.CREATURES as { id: string; calls: { id: string }[] }[]).map((c) => [c.id, c.calls.map((k) => k.id)]));
}

/** a general creature call beat: `{ call: 'seal', name: 'chug', pitch, … }` (name defaults to the first call) */
export async function callSfx(id: string, name?: string, pitch?: number): Promise<StereoClip> {
  const all = await creatureCalls();
  if (!all[id]) throw new Error(`unknown creature ${JSON.stringify(id)}; creatures: ${Object.keys(all).join(", ")}`);
  const call = name ?? all[id][0];
  if (!all[id].includes(call)) throw new Error(`${id} has no call ${JSON.stringify(call)}; its calls: ${all[id].join(", ")}`);
  const c = await creatureClip(id, { call, ...(pitch ? { pitch } : {}) });
  const x = Float32Array.from(c.audio);
  if (id === "elephant") tame(x, 3);
  return mono(x, { pan: 0, room: 0.12, level: 0.5, hold: 0.8, duck: 0.15 });
}

// ---- studio sounds, all from mouths

const BRIGHT: VoiceSpec = { body: { female: 1, child: 0.2 }, f0: 220, source: { tension: 0.7, brightness: 0.55, breathiness: 0.05 } };

async function dingMix(v: number): Promise<StereoClip> {
  // two bright voices sing "ding" a sixth apart; the ŋ hums on like a bell's ring, cut with an exponential decay
  const bus = new Bus(2);
  const top = v === 1 ? 84 : 81, low = v === 1 ? 76 : 72;
  for (const [m, g, p] of [[top, 0.8, 0.1], [low, 0.55, -0.1]] as const) {
    const c = await singClip(BRIGHT, { bpm: 120, lyrics: "ding", notes: [[m, 1.2]], vibrato: 0 }, 0.1);
    const x = shape(Float32Array.from(c.audio), (t) => (t < 0.1 ? 1 : Math.exp(-(t - 0.1) * 3.2)));
    bus.add(x, 0, g, p);
  }
  room(bus, 0.15, 0.4);
  return { ...finish(bus, 0.5, 0.6), duck: 0.4 };
}

async function buzzerMix(v: number): Promise<StereoClip> {
  // two rough pressed voices a tritone apart on a flat "ehhh": the wrong-answer buzzer
  const bus = new Bus(2);
  const d = v === 1 ? 0.75 : 0.55;
  for (const [f, p] of [[92, -0.15], [130, 0.15]] as const) {
    const c = await vocalClip({ body: { female: 0, child: 0 }, f0: f, accent: 0, source: { roughness: 1, fry: 0.25, tension: 0.95, pressure: 13, brightness: 0.8 } }, [{ ipa: "ɛ", dur: d, stress: 1 }], { contour: [[0, f], [d + 0.1, f * 0.97]] });
    bus.add(c.audio, 0, 0.7, p);
  }
  return { ...finish(bus, 0.5, 0.8), duck: 0.4 };
}

async function clickHits(): Promise<Clip[]> {
  return [clapify(await hitClip({ female: 0, child: 0 }, "!")), clapify(await hitClip({ female: 1, child: 0 }, "!")), clapify(await hitClip({ female: 0.5, child: 0.3 }, "K"))];
}

async function tickMix(v: number): Promise<StereoClip> {
  const h = (await clickHits())[v - 1];
  const bus = new Bus(0.6);
  bus.add(h.audio, 0, 1, 0, 1.25);
  return { ...finish(bus, 0.45, 1), duck: 0.6 };
}

async function ticktockMix(r: () => number): Promise<StereoClip> {
  // a wall clock: tick (higher) / tock (lower), 2 per second, the tiny irregularity of a mouth
  const [a, b] = await clickHits();
  const bus = new Bus(3.6);
  for (let k = 0; k < 6; k++) bus.add((k % 2 ? b : a).audio, 0.02 + k * 0.5 + (r() - 0.5) * 0.006, 1, k % 2 ? 0.15 : -0.15, k % 2 ? 0.92 : 1.3);
  return { ...finish(bus, 0.42, 1), duck: 0.6 };
}

async function whooshMix(v: number): Promise<StereoClip> {
  // a long breathy fricative swelling and sweeping across: ʃ + f layered (voiceless, broadband)
  const d = v === 1 ? 0.6 : 0.8;
  const bus = new Bus(d + 0.8);
  const sweep = v === 1 ? [-0.8, 0.8] : [0.8, -0.8];
  for (const [ipa, g] of [["ʃ", 0.8], ["f", 0.6], ["h", 0.5]] as const) {
    const c = await vocalClip({ body: { female: 0.5, child: 0 }, f0: 120, source: { breathiness: 1, pressure: 10 } }, [{ ipa, dur: d }]);
    const x = shape(Float32Array.from(c.audio), (t) => {
      const u = Math.max(0, Math.min(1, (t - 0.05) / d));
      return Math.pow(Math.sin(Math.PI * Math.pow(u, 0.7)), 2);
    });
    // pan sweep, sample by sample
    const n0 = 0;
    bus.grow(x.length + 1);
    for (let i = 0; i < x.length; i++) {
      const u = Math.max(0, Math.min(1, (i / FS - 0.05) / d));
      const p = sweep[0] + (sweep[1] - sweep[0]) * u;
      const a = ((p + 1) * Math.PI) / 4;
      bus.L[n0 + i] += x[i] * g * Math.cos(a);
      bus.R[n0 + i] += x[i] * g * Math.sin(a);
    }
  }
  return { ...finish(bus, 0.4, 0.5), duck: 0.8 };
}

async function tadaMix(v: number): Promise<StereoClip> {
  // "ta-dah!": a short pickup into a held major triad, three Formants
  const bpm = 160;
  const chords = v === 1 ? [[67, 72], [64, 67], [48, 48]] : [[69, 74], [65, 69], [50, 50]];
  const bus = new Bus(2);
  const who: (keyof typeof CAST)[] = ["dee", "hy", "al"];
  for (let i = 0; i < 3; i++) {
    const [a, b] = chords[i];
    const c = await singClip(SPEC(who[i]), { bpm, lyrics: "ta dah", notes: [[a, 0.5], [b, 1.6]], vibrato: 25 }, 0.1);
    bus.add(c.audio, 0, i === 2 ? 0.75 : 0.85, CAST[who[i]].pan * 0.6);
  }
  room(bus, 0.15, 0.4);
  return { ...finish(bus, 0.5, 0.9), duck: 0.4 };
}

async function drumrollMix(r: () => number, v: number): Promise<StereoClip> {
  // Pete's snare roll: single snare hits re-struck ~16 times a second (the beat sequencer can't
  // retrigger a snare that fast), crescendo over 1.4 s, then a crash
  const pete = CAST.pete.body;
  const hits = v === 1 ? [await hitClip(pete, "Pf")] : [await hitClip(pete, "Pf"), await hitClip(pete, "t")];
  const crash = await hitClip(pete, "kch");
  const bus = new Bus(2.6);
  const roll = 1.4, rate = 16;
  for (let k = 0, t = 0.02; t < roll; k++, t += 1 / rate + (r() - 0.5) * 0.006) {
    const h = hits[k % hits.length];
    const g = 0.25 + 0.6 * Math.pow(t / roll, 1.6);
    bus.add(h.audio.subarray(0, Math.round(FS * 0.12)), t - h.t0, g, CAST.pete.pan * 0.4 + (k % 2 ? 0.08 : -0.08), 0.97 + r() * 0.06);
  }
  bus.add(crash.audio, roll + 0.04 - crash.t0, 1.1, CAST.pete.pan * 0.4);
  bus.add((await hitClip(pete, "B")).audio, roll + 0.04 - (await hitClip(pete, "B")).t0, 0.9, 0);
  room(bus, 0.18, 0.6);
  return { ...finish(bus, 0.5, 1), duck: 0.5 };
}

async function gaspMix(r: () => number, v: number): Promise<StereoClip> {
  // a dozen people at once: breathy "hah!" (v1) or "oh!" (v2), short, pitch jumping up
  const bus = new Bus(1.5);
  for (let i = 0; i < 12; i++) {
    const cv = crowdVoice(r);
    const segs = v === 1 ? [{ ipa: "h", dur: 0.09 }, { ipa: "æ", dur: r2(0.14 + r() * 0.08), stress: 1 }] : [{ ipa: "oʊ", dur: r2(0.2 + r() * 0.1), stress: 1 }];
    const c = await vocalClip({ ...cv, source: { ...cv.source, breathiness: 0.6 } }, segs, { contour: [[0.05, Math.round(cv.f0 * 1.2)], [0.3, Math.round(cv.f0 * 1.55)]] });
    bus.add(c.audio, r() * 0.07, 0.5 + r() * 0.5, (r() * 2 - 1) * 0.9);
  }
  room(bus, 0.22);
  return { ...finish(bus, 0.42, 0.6), duck: 0.6 };
}

async function heyMix(r: () => number): Promise<StereoClip> {
  // a crowd shouting HEY! together (pressed, loud, pitch high)
  const bus = new Bus(1.5);
  for (let i = 0; i < 12; i++) {
    const cv = crowdVoice(r);
    const c = await sayClip({ ...cv, source: { ...cv.source, ...SHOUT_SOURCE } }, "hey", { f0: Math.round(cv.f0 * 1.35), accent: 0.5, rate: 1.1 });
    bus.add(c.audio, 0.05 + r() * 0.04 - c.anchor + 0.1, 0.5 + r() * 0.5, (r() * 2 - 1) * 0.9);
  }
  room(bus, 0.2);
  return { ...finish(bus, 0.45, 0.5), duck: 0.6 };
}

/** the voice-source patch for shouting (louder, pressed, brighter); also used by music shouts */
export const SHOUT_SOURCE = { pressure: 11.5, tension: 0.8, brightness: 0.55, breathiness: 0.1 };

const MURMUR_LINES = ["well I think it was the other one", "did you see that", "no I mean the one with the hat", "okay so what happens now", "she said it was fine", "I don't know honestly", "is this the part where", "that is so funny", "wait which one", "they posted about it yesterday", "hold on hold on", "right right right", "is he going to", "I love this show"];

async function murmurMix(r: () => number): Promise<StereoClip> {
  // a room full of low chatter, muffled (low-passed) so no words come through
  const bus = new Bus(4);
  for (let i = 0; i < 14; i++) {
    const cv = crowdVoice(r);
    const c = await sayClip({ ...cv, accent: 0.08, source: { ...cv.source, pressure: 6.5 } }, pick(r, MURMUR_LINES), { rate: 1.05 });
    bus.add(c.audio, r() * 1.6, 0.4 + r() * 0.6, (r() * 2 - 1) * 0.95);
  }
  for (const ch of [bus.L, bus.R]) lowpass(ch, 900), lowpass(ch, 1400);
  // fade the edges so it reads as a bed
  const n = bus.L.length;
  for (let i = 0; i < n; i++) {
    const t = i / FS;
    const g = Math.min(1, t / 0.5) * Math.min(1, Math.max(0, (3.4 - t) / 0.8));
    bus.L[i] *= g;
    bus.R[i] *= g;
  }
  room(bus, 0.3);
  return { ...finish(bus, 0.3, 0.2), duck: 1 };
}

function lowpass(x: Float32Array, fc: number, q = 0.707): void {
  const w = (2 * Math.PI * fc) / FS, al = Math.sin(w) / (2 * q), cw = Math.cos(w);
  const a0 = 1 + al;
  const b0 = (1 - cw) / 2 / a0, b1 = (1 - cw) / a0, b2 = b0, a1 = (-2 * cw) / a0, a2 = (1 - al) / a0;
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const y = b0 * x[i] + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
    x2 = x1, x1 = x[i], y2 = y1, y1 = y;
    x[i] = y;
  }
}

async function coughMix(): Promise<StereoClip> {
  // one lonely "ahem" from somewhere in the back
  const c = await vocalClip({ body: { female: 0.1, child: 0 }, f0: 115, accent: 0.2, source: { breathiness: 0.3, roughness: 0.4, fry: 0.1 } }, [{ ipa: "ə", dur: 0.12 }, { ipa: "h", dur: 0.09 }, { ipa: "ɛ", dur: 0.13, stress: 1 }, { ipa: "m", dur: 0.18 }], { contour: [[0.05, 125], [0.2, 140], [0.55, 105]] });
  return mono(c, { pan: 0.55, room: 0.35, level: 0.35, hold: 1, duck: 0.3 });
}

interface Entry {
  variants: number;
  make: (r: () => number, variant: number) => Promise<StereoClip>;
  about: string;
}

export const SFX: Record<string, Entry> = {
  laugh: { variants: 3, about: "a dozen people laughing (~2 s)", make: (r) => laughMix(r, { voices: 12, spread: 0.45, pulses: [3, 6], vowels: ["ɑ", "ʌ", "æ", "ə", "ɛ"], level: 0.42, hold: 0.45 }) },
  biglaugh: { variants: 2, about: "the room loses it: ~22 voices and a woo (~3 s)", make: (r) => laughMix(r, { voices: 22, spread: 0.9, pulses: [5, 9], vowels: ["ɑ", "ʌ", "æ", "ə", "ɛ", "o"], level: 0.5, woos: 2, hold: 0.45, lift: 1.35 }) },
  chuckle: { variants: 2, about: "3–4 people, heh heh (~1 s)", make: (r) => laughMix(r, { voices: 3 + Math.floor(r() * 2), spread: 0.25, pulses: [2, 3], vowels: ["ɛ", "ə"], level: 0.3, hold: 0.4, soft: true, lift: 1.05 }) },
  groan: { variants: 2, about: "ohhh, falling (~1.5 s)", make: (r) => glideMix(r, { voices: 9, onset: null, vowel: "oʊ", dur: 1.1, shape: [[0, 1.12], [0.25, 1.05], [1, 0.72]], spread: 0.2, level: 0.38, hold: 0.5 }) },
  ooh: { variants: 2, about: "impressed oooh, rising then settling (~1.4 s)", make: (r) => glideMix(r, { voices: 9, onset: null, vowel: "u", dur: 1.0, shape: [[0, 0.95], [0.55, 1.4], [1, 1.2]], spread: 0.15, level: 0.38, hold: 0.5 }) },
  aww: { variants: 2, about: "sympathetic awww, high and falling (~1.4 s)", make: (r) => glideMix(r, { voices: 9, onset: null, vowel: "ɑ", dur: 1.0, shape: [[0, 1.35], [0.3, 1.4], [1, 0.95]], spread: 0.15, level: 0.38, hold: 0.5 }) },
  woo: { variants: 2, about: "two or three woos (~1 s)", make: (r) => glideMix(r, { voices: 3, onset: "w", vowel: "u", dur: 0.6, shape: [[0, 1.15], [0.6, 1.65], [1, 1.35]], spread: 0.35, level: 0.4, hold: 0.3 }) },
  applause: { variants: 2, about: "~450 tongue clicks, lip pops, clicks and snares, swell and decay (~3.5 s)", make: (r) => applauseMix(r, { dur: 3.5, rate: 190, level: 0.4, woos: 0, hold: 0.55 }) },
  "applause-long": { variants: 1, about: "a long ovation with woos (~6 s)", make: (r) => applauseMix(r, { dur: 6, rate: 210, level: 0.42, woos: 3, hold: 0.5 }) },
  rimshot: { variants: 1, about: "ba-dum-tss (~1 s)", make: (r) => rimshotMix(r) },
  ding: { variants: 2, about: "game-show correct: two bright voices sing a decaying \"ding\"", make: (_r, v) => dingMix(v) },
  buzzer: { variants: 2, about: "wrong answer: two rough pressed voices, a tritone apart, \"ehhh\"", make: (_r, v) => buzzerMix(v) },
  tick: { variants: 3, about: "one clock tick (tongue click / rimshot click)", make: (_r, v) => tickMix(v) },
  ticktock: { variants: 1, about: "3 s of tick-tock at 2 per second", make: (r) => ticktockMix(r) },
  whoosh: { variants: 2, about: "breathy fricative swell sweeping L→R (v2: R→L)", make: (_r, v) => whooshMix(v) },
  tada: { variants: 2, about: "sung \"ta-dah!\" fanfare, three-part major chord", make: (_r, v) => tadaMix(v) },
  drumroll: { variants: 2, about: "snare roll crescendo into a crash (v2: hat roll)", make: (r, v) => drumrollMix(r, v) },
  gasp: { variants: 2, about: "the crowd gasps: \"hah!\" (v1) or \"oh!\" (v2)", make: (r, v) => gaspMix(r, v) },
  hey: { variants: 2, about: "the crowd shouts HEY!", make: (r) => heyMix(r) },
  murmur: { variants: 2, about: "a room of low, muffled chatter (a bed under a beat)", make: (r) => murmurMix(r) },
  "silence-cough": { variants: 1, about: "one lonely \"ahem\" from the back (for jokes that die)", make: () => coughMix() },
  ...Object.fromEntries(Object.entries(CREATURE_SFX).map(([k, e]) => [k, { variants: e.v.length, about: e.about, make: (_r: () => number, v: number) => creatureSfx(k, v) }])),
  sting: { variants: 2, about: "band riff: scat in three-part harmony + kick/crash (~1.8 s)", make: (r, v) => stingMix(r, v as 1 | 2) },
};

const counters: Record<string, number> = {};
const made = new Map<string, Promise<StereoClip>>();

/** Resolve a script's sfx name: "laugh" (next variant) or "laugh-2" (that one). */
export function resolveSfx(name: string): { base: string; variant: number } {
  if (SFX[name]) {
    const e = SFX[name];
    counters[name] = ((counters[name] ?? 0) % e.variants) + 1;
    return { base: name, variant: counters[name] };
  }
  const m = /^(.*)-(\d+)$/.exec(name);
  if (m && SFX[m[1]] && +m[2] >= 1 && +m[2] <= SFX[m[1]].variants) return { base: m[1], variant: +m[2] };
  const all = Object.entries(SFX).map(([k, e]) => (e.variants > 1 ? `${k} (${k}-1…${k}-${e.variants})` : k));
  throw new Error(`unknown sfx ${JSON.stringify(name)}; available: ${all.join(", ")}`);
}

export function resetSfxCounters(): void {
  for (const k of Object.keys(counters)) delete counters[k];
}

export function sfxClip(base: string, variant: number): Promise<StereoClip> {
  const key = `${base}-${variant}`;
  if (!made.has(key)) {
    let seed = 0;
    for (const ch of key) seed = (Math.imul(seed, 31) + ch.charCodeAt(0)) >>> 0;
    made.set(key, SFX[base].make(rng(seed ^ 0x5eed), variant));
  }
  return made.get(key)!;
}

export { peakOf };
