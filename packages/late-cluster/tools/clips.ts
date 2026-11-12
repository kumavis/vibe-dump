/**
 * Clips: one voice's render of one thing (a spoken line, a sung phrase, a beat pattern, a single
 * beatbox hit), with its telemetry. Renders are cached on disk by what was asked for, so a script
 * edit only re-renders the lines that changed.
 */
import { createHash, randomBytes } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { FS, Voice, loadEngine, midiToHz, type Tele } from "./engine.ts";
import type { BodyMix } from "../chimera/wasm/types.ts";

const CACHE = fileURLToPath(new URL("./.cache/", import.meta.url));
/** bump to drop every cached render (a change to how clips are made) */
const CACHE_VERSION = 3;

export interface VoiceSpec {
  body: BodyMix;
  f0: number;
  rate?: number;
  accent?: number;
  /** source patch: breathiness, tension, fry, roughness, vibratoDepth, vibratoRate, drift, brightness, pressure */
  source?: Record<string, number>;
}

export interface Clip {
  audio: Float32Array;
  tele: Tele | null;
  /** seconds into the clip where the sound proper starts and ends */
  t0: number;
  t1: number;
  /** [start, end, text] in clip seconds */
  words: [number, number, string][];
  /** a time worth landing on a beat (a shout's first vowel), clip seconds */
  anchor: number;
  ipa?: string;
}

/** read a cache entry; null if it is missing, truncated or corrupt (it is then re-rendered) */
function readEntry(file: string): Clip | null {
  try {
    const buf = readFileSync(file);
    if (buf.length < 8) return null;
    const hl = buf.readUInt32LE(0);
    if (4 + hl > buf.length) return null;
    const head = JSON.parse(buf.subarray(4, 4 + hl).toString("utf8"));
    let o = 4 + hl + ((4 - (hl % 4)) % 4);
    const need = o + 4 * head.n + (head.tele ? 4 * head.tele.frames * head.tele.channels : 0);
    if (!Number.isInteger(head.n) || buf.length !== need) return null;
    const audio = new Float32Array(buf.buffer.slice(buf.byteOffset + o, buf.byteOffset + o + 4 * head.n));
    o += 4 * head.n;
    const tele = head.tele ? { ...head.tele, data: new Float32Array(buf.buffer.slice(buf.byteOffset + o, buf.byteOffset + o + 4 * head.tele.frames * head.tele.channels)) } : null;
    return { audio, tele, t0: head.t0, t1: head.t1, words: head.words, anchor: head.anchor, ipa: head.ipa };
  } catch {
    return null;
  }
}

/**
 * Disk cache, safe for several renders at once in one checkout: entries are written to a unique
 * temp file and renamed into place (atomic on one filesystem), so a reader sees a whole entry or
 * none; a damaged entry is re-rendered and replaced. Two processes may render the same clip at
 * the same time; both produce identical bytes and the last rename wins.
 */
function cached(key: unknown, make: () => Clip): Clip {
  const hash = createHash("sha1").update(JSON.stringify([CACHE_VERSION, key])).digest("hex");
  const file = `${CACHE}${hash}.clip`;
  if (existsSync(file)) {
    const hit = readEntry(file);
    if (hit) return hit;
    console.warn(`cache: ${hash}.clip is damaged; re-rendering it`);
  }
  const c = make();
  mkdirSync(CACHE, { recursive: true });
  const head = Buffer.from(JSON.stringify({ n: c.audio.length, tele: c.tele ? { frames: c.tele.frames, channels: c.tele.channels, nPh: c.tele.nPh, nOr: c.tele.nOr } : null, t0: c.t0, t1: c.t1, words: c.words, anchor: c.anchor, ipa: c.ipa }), "utf8");
  const pad = Buffer.alloc((4 - (head.length % 4)) % 4);
  const len = Buffer.alloc(4);
  len.writeUInt32LE(head.length, 0);
  const tmp = `${file}.${process.pid}.${randomBytes(4).toString("hex")}.tmp`;
  try {
    writeFileSync(tmp, Buffer.concat([len, head, pad, Buffer.from(c.audio.buffer, c.audio.byteOffset, c.audio.byteLength), ...(c.tele ? [Buffer.from(c.tele.data.buffer, c.tele.data.byteOffset, c.tele.data.byteLength)] : [])]));
    renameSync(tmp, file);
  } catch (e) {
    try {
      unlinkSync(tmp);
    } catch {}
    console.warn(`cache: could not store ${hash}.clip (${(e as Error).message}); continuing without it`);
  }
  return c;
}

export function peakOf(x: Float32Array): number {
  let p = 0;
  for (let i = 0; i < x.length; i++) p = Math.max(p, Math.abs(x[i]));
  return p;
}

function normalize(x: Float32Array, to = 0.7): void {
  const p = peakOf(x);
  if (p > 1e-5) for (let i = 0; i < x.length; i++) x[i] *= to / p;
}

const LEAD = 0.05;

/** A spoken line. `text` is what is pronounced (respell words the dictionary gets wrong). */
export async function sayClip(v: VoiceSpec, text: string, o: { rate?: number; f0?: number; accent?: number; intonation?: "statement" | "question" | "flat" } = {}): Promise<Clip> {
  const { E, g2p } = await loadEngine();
  const f0 = o.f0 ?? v.f0;
  const rate = (v.rate ?? 1) * (o.rate ?? 1);
  const accent = o.accent ?? v.accent;
  return cached(["say", v.body, f0, rate, accent, v.source, text, o.intonation], () => {
    const phrases = g2p.toPhrases(text);
    if (!phrases.length) throw new Error(`nothing to say in ${JSON.stringify(text)}`);
    const plan = E.planPhrases(
      phrases.map((p) => ({ segments: p.segments, intonation: o.intonation ?? p.intonation, pause: p.pause })),
      { body: v.body, t0: LEAD, f0, rate, ...(accent !== undefined ? { accent } : {}) },
    );
    const voice = new Voice(v.body);
    voice.setSource({ f0, ...v.source });
    voice.schedule(plan.gestures);
    const { audio, tele } = voice.renderTracked(Math.round(FS * (plan.end + 0.3)));
    normalize(audio);
    // words: each input segment becomes one or two planned segments; a word ends at wordEnd
    const words: [number, number, string][] = [];
    const flat = phrases.flatMap((p) => p.segments);
    const names = phrases.flatMap((p) => p.words);
    const counts = E.plannedCounts(flat.map((s) => s.ipa));
    const total = counts.reduce((a, b) => a + b, 0);
    if (total === plan.segments.length) {
      let k = 0, w = 0, start = -1;
      flat.forEach((s, i) => {
        if (start < 0) start = plan.segments[k].t0;
        k += counts[i];
        if (s.wordEnd || i === flat.length - 1) {
          words.push([start, plan.segments[k - 1].t1, names[w] ?? ""]);
          w++;
          start = -1;
        }
      });
    }
    const vowel = plan.segments.find((s) => s.kind === "vowel") ?? plan.segments[0];
    const ipa = phrases.map((p) => p.segments.map((s) => s.ipa).join("")).join(" | ");
    return { audio, tele, t0: LEAD, t1: plan.end, words, anchor: vowel ? vowel.t0 : LEAD, ipa };
  });
}

/**
 * A vocalization from explicit segments (IPA, optional dur / f0 / stress per segment), for crowd
 * noises: laughs, woos, groans. `contour` [[t, hz], …] (clip seconds) replaces the planner's pitch
 * targets with a pitch track (a glide), sampled every 40 ms.
 */
export async function vocalClip(v: VoiceSpec, segs: { ipa: string; dur?: number; f0?: number; stress?: number }[], o: { contour?: [number, number][]; rate?: number } = {}): Promise<Clip> {
  const { E } = await loadEngine();
  return cached(["vocal", v.body, v.f0, v.rate, o.rate, v.accent, v.source, segs, o.contour], () => {
    const segments = segs.map((s, i) => ({ ...E.tokenizeIpa(s.ipa)[0], ...(s.dur ? { dur: s.dur } : {}), ...(s.f0 ? { f0: s.f0 } : {}), ...(s.stress !== undefined ? { stress: s.stress } : {}), wordEnd: i === segs.length - 1 }));
    const plan = E.planUtterance(segments as never, { body: v.body, t0: LEAD, f0: v.f0, rate: (v.rate ?? 1) * (o.rate ?? 1), ...(v.accent !== undefined ? { accent: v.accent } : {}) });
    let gestures = plan.gestures;
    if (o.contour?.length) {
      gestures = gestures.filter((g) => g.targets.f0 === undefined);
      const c = o.contour;
      const at = (t: number) => {
        if (t <= c[0][0]) return c[0][1];
        for (let i = 1; i < c.length; i++) if (t <= c[i][0]) return c[i - 1][1] + ((c[i][1] - c[i - 1][1]) * (t - c[i - 1][0])) / (c[i][0] - c[i - 1][0]);
        return c[c.length - 1][1];
      };
      for (let t = LEAD; t < plan.end; t += 0.04) gestures.push({ t0: t, t1: t + 0.04, rampIn: 0.03, rampOut: 0.03, strength: 1, targets: { f0: at(t) }, label: "pitch" });
    }
    const voice = new Voice(v.body);
    voice.setSource({ f0: v.f0, ...v.source });
    voice.schedule(gestures);
    const { audio, tele } = voice.renderTracked(Math.round(FS * (plan.end + 0.3)));
    normalize(audio);
    const vowel = plan.segments.find((s) => s.kind === "vowel") ?? plan.segments[0];
    return { audio, tele, t0: LEAD, t1: plan.end, words: [], anchor: vowel ? vowel.t0 : LEAD, ipa: segs.map((s) => s.ipa).join("") };
  });
}

/**
 * A sung melody: `notes` [[midi, beats], …] (midi <= 0: a rest), one lyric syllable per sounding
 * note. The first note starts `lead` seconds into the clip.
 */
export async function singClip(v: VoiceSpec, m: { bpm: number; lyrics: string; notes: [number, number][]; vibrato?: number; transpose?: number }, lead = 0.3): Promise<Clip> {
  const { E } = await loadEngine();
  return cached(["sing", v.body, v.source, m, lead], () => {
    const tr = m.transpose ?? 0;
    const syl = E.lyricsToSyllables(m.lyrics);
    const sounding = m.notes.filter((n) => n[0] > 0).length;
    if (syl.length !== sounding) throw new Error(`${syl.length} syllables for ${sounding} notes: ${syl.map((s) => s.text).join(" ")}`);
    const beat = 60 / m.bpm;
    const voice = new Voice(v.body);
    const first = m.notes.find((n) => n[0] > 0);
    if (!first) throw new Error("no notes");
    voice.setSource({ pressure: 9, tension: 0.55, ...v.source, f0: midiToHz(first[0] + tr), voiced: true });
    let t = lead, k = 0, end = 0, start = t;
    let phrase: { midi: number; beats: number; syl: (typeof syl)[number] }[] = [];
    const words: [number, number, string][] = [];
    const flush = () => {
      if (!phrase.length) return;
      const plan = E.planSong(phrase, { body: v.body, bpm: m.bpm, t0: start, vibrato: m.vibrato ?? 30 });
      voice.schedule(plan.gestures);
      end = Math.max(end, plan.end);
      phrase = [];
    };
    for (const [midi, beats] of m.notes) {
      if (midi > 0) {
        if (!phrase.length) start = t;
        const s = syl[k++];
        phrase.push({ midi: midi + tr, beats, syl: s });
        words.push([t, t + beats * beat, s.text + (s.wordEnd ? "" : "-")]);
      } else flush();
      t += beats * beat;
    }
    flush();
    const { audio, tele } = voice.renderTracked(Math.round(FS * (Math.max(end, t) + 0.4)));
    normalize(audio);
    return { audio, tele, t0: lead, t1: Math.max(end, t), words, anchor: lead };
  });
}

/**
 * A beatbox pattern (chimera's beat text: "B . t . | Pf . t ."; steps are sixteenths), looped
 * `loops` times. Step 0 sounds `lead` seconds into the clip.
 */
export async function beatClip(v: VoiceSpec, b: { bpm: number; pattern: string; loops?: number; swing?: number }, lead = 0.3): Promise<Clip> {
  const { E } = await loadEngine();
  return cached(["beat", v.body, b, lead], () => {
    const steps = E.parseBeat(b.pattern);
    if (!steps.some(Boolean)) throw new Error(`no beat sounds in ${JSON.stringify(b.pattern)}`);
    const stepDur = 60 / b.bpm / 4;
    const total = steps.length * (b.loops ?? 1) * stepDur;
    const voice = new Voice(v.body);
    voice.setArtic(E.beatReady(v.body));
    voice.setSource({ f0: 100, voiced: true, pressure: 8 });
    voice.setGate(0);
    const HORIZON = 0.2;
    if (lead < HORIZON) throw new Error("a beat needs 0.2 s of lead");
    const n0 = Math.round(FS * (lead - HORIZON));
    const n1 = n0 + Math.round(FS * (total - 0.004));
    const { audio, tele } = voice.renderTracked(n1 + Math.round(FS * (HORIZON + 0.45)), [
      { at: n0, fn: () => voice.startBeat(steps as never, b.bpm, b.swing ?? 0) },
      { at: n1, fn: () => voice.stopBeat() },
    ]);
    normalize(audio, 0.6);
    return { audio, tele, t0: lead, t1: lead + total, words: [], anchor: lead };
  });
}

/**
 * A creature (bestiary) sound. Either one of its built-in calls (`call`: id, optional `pitch` Hz
 * which shifts the call relative to its reference pitch), or `notes`: gated notes, each
 * [startSec, durSec, pitchFrom, pitchTo?] with the pitch param glided linearly while the gate is
 * open. `params` set the creature's knobs first. No telemetry (creature heads aren't human).
 */
export async function creatureClip(id: string, o: { params?: Record<string, number>; call?: string; pitch?: number; amp?: number; notes?: [number, number, number, number?][]; glide?: string }): Promise<Clip & { calls: string[] }> {
  const { E } = await loadEngine();
  const c = cached(["creature", id, o], () => {
    const voice = new Voice({ female: 0, child: 0 });
    const info = voice.setCreature(id, o.params ?? {});
    const lead = Math.round(FS * 0.02);
    const chunks: Float32Array[] = [voice.render(lead)];
    let len = lead;
    if (o.call) {
      const idx = info.calls.indexOf(o.call);
      if (idx < 0) throw new Error(`creature ${id} has no call ${JSON.stringify(o.call)}; calls: ${info.calls.join(", ")}`);
      voice.playCall(idx, o.pitch ?? NaN, o.amp ?? NaN);
      const def = (E.CREATURES as { id: string; calls: { id: string; keys: { t: number }[] }[] }[]).find((d) => d.id === id)!;
      const keys = def.calls.find((k) => k.id === o.call)!.keys;
      const n = Math.round(FS * (keys[keys.length - 1].t + 0.6));
      chunks.push(voice.render(n));
      len += n;
    } else if (o.notes?.length) {
      const pi = info.params.indexOf(o.glide ?? "pitch");
      const end = Math.max(...o.notes.map((n) => n[0] + n[1])) + 0.6;
      const N = Math.round(FS * end);
      const out = new Float32Array(N);
      const B = 128;
      for (let i = 0; i < N; i += B) {
        const t = i / FS;
        const note = o.notes.find((n) => t >= n[0] && t < n[0] + n[1]);
        if (note) {
          const x = (t - note[0]) / note[1];
          if (pi >= 0) voice.creatureParam(pi, note[2] + ((note[3] ?? note[2]) - note[2]) * x);
          voice.setGate(1);
        } else voice.setGate(0);
        out.set(voice.render(Math.min(B, N - i)), i);
      }
      chunks.push(out);
      len += N;
    } else throw new Error("creatureClip needs a call or notes");
    const audio = new Float32Array(len);
    let o2 = 0;
    for (const ch of chunks) audio.set(ch, o2), (o2 += ch.length);
    for (let i = 0; i < audio.length; i++) if (!Number.isFinite(audio[i])) audio[i] = 0;
    // trim the silent tail
    const pk = peakOf(audio);
    let last = audio.length - 1;
    while (last > 0 && Math.abs(audio[last]) < pk * 0.003) last--;
    const cut = audio.slice(0, Math.min(audio.length, last + Math.round(FS * 0.05)));
    let first = 0;
    while (first < cut.length && Math.abs(cut[first]) < pk * 0.01) first++;
    normalize(cut);
    return { audio: cut, tele: null, t0: first / FS, t1: last / FS, words: [], anchor: first / FS, ipa: undefined };
  });
  const def = (E.CREATURES as { id: string; calls: { id: string }[] }[]).find((d) => d.id === id);
  return { ...c, calls: def ? def.calls.map((k) => k.id) : [] };
}

/** One beatbox sound, cut tight around its onset (for scattering: applause, single stomps). */
export async function hitClip(body: BodyMix, id: string): Promise<Clip> {
  const { E } = await loadEngine();
  return cached(["hit", body, id], () => {
    const voice = new Voice(body);
    voice.setArtic(E.beatReady(body));
    voice.setSource({ f0: 100, voiced: true, pressure: 8 });
    voice.setGate(0);
    voice.render(Math.round(FS * 0.05));
    voice.startBeat([{ id }, null, null, null, null, null, null, null] as never, 30, 0);
    const out = voice.render(Math.round(FS * 0.75));
    let pk = 0, at = 0;
    for (let i = 0; i < out.length; i++) if (Math.abs(out[i]) > pk) (pk = Math.abs(out[i])), (at = i);
    let on = at;
    for (let i = Math.max(0, at - Math.round(FS * 0.04)); i < at; i++) if (Math.abs(out[i]) > 0.2 * pk) { on = i; break; }
    const a = Math.max(0, on - Math.round(FS * 0.008));
    const b = Math.min(out.length, on + Math.round(FS * 0.28));
    const audio = out.slice(a, b);
    for (let i = 0; i < 200 && i < audio.length; i++) audio[i] *= i / 200;
    const fade = Math.round(FS * 0.06);
    for (let i = 0; i < fade; i++) audio[audio.length - 1 - i] *= i / fade;
    normalize(audio, 0.7);
    return { audio, tele: null, t0: (on - a) / FS, t1: audio.length / FS, words: [], anchor: (on - a) / FS };
  });
}
