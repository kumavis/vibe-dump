/**
 * bun tools/render.ts <segment-id> [more ids…] | --all
 *
 * Reads src/segments/<id>/script.js, lays its beats out on one timeline, renders every voice
 * through CHIMERA (clips are cached in tools/.cache, so only changed lines re-render), mixes to
 * stereo and writes public/audio/<id>.mp3, public/tele/<id>.bin and src/segments/<id>/cues.json.
 * The script format is documented in tools/README.md.
 */
import { createHash } from "node:crypto";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { FS, HOP, loadEngine, type Tele } from "./engine.ts";
import { sayClip, singClip, beatClip, type Clip, type VoiceSpec } from "./clips.ts";
import { resolveSfx, resetSfxCounters, sfxClip, callSfx, SHOUT_SOURCE, type StereoClip } from "./sfx.ts";
import { encodeTele } from "./telebin.ts";
import { decodeStereo, lufs, truePeakTrack } from "./loudness.ts";
import { CAST } from "../src/cast.js";
import type { BodyMix } from "../chimera/wasm/types.ts";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
/** silence before the first sound and after the last */
const HEAD = 0.3;
const TAIL = 0.6;
/** a music block's beat 0 comes this long after the cursor */
const MUSIC_LEAD = 0.25;
/** mix gains per kind (clips arrive peak-normalized: speech/song 0.7, beats 0.6) */
const KIND_GAIN = { say: 1.0, sing: 0.9, beat: 0.85, shout: 0.7 } as const;
/** shouts are pitched up this much from the cast f0 */
const SHOUT_F0 = 1.3;
/** limiter ceiling, applied to the 4×-oversampled true peak (−1.5 dBTP); the decoded mp3 is then
 *  checked and trimmed until its peak is ≤ MP3_PEAK (mp3 encoding adds its own overshoot) */
const LIMIT = 0.84;
const MP3_PEAK = 0.97;
/** loudness target: the mean of the dialogue loudness (say lines) and the whole mix's is brought
 *  here, so back-to-back segments match; music and sfx keep their level relative to the dialogue */
const DIALOGUE_LUFS = -17;
/** sfx gain while a line is spoken or sung (−9 dB) */
const DUCK = 0.35;

type Kind = "say" | "sing" | "beat" | "shout";

export interface Line {
  i: number;
  id?: string;
  who: string;
  kind: Kind;
  text: string;
  caption: boolean;
  t0: number;
  t1: number;
  words: [number, number, string][];
  tele: number;
  teleT0: number;
  // render-only
  clip: Clip;
  at: number; // segment time of clip sample 0
  gain: number;
  pan: number;
  body: BodyMix;
  ipa?: string;
}

// ------------------------------------------------------------------ validation helpers

class ScriptError extends Error {}
const fail = (where: string, msg: string): never => {
  throw new ScriptError(`${where}: ${msg}`);
};
const KNOWN: Record<string, string[]> = {
  say: ["say", "text", "as", "id", "gap", "overlap", "rate", "f0", "accent", "intonation", "vol", "pan", "caption"],
  sing: ["sing", "bpm", "lyrics", "notes", "id", "gap", "overlap", "vibrato", "transpose", "vol", "pan", "caption", "text"],
  sfx: ["sfx", "at", "hold", "vol", "pan", "duck"],
  call: ["call", "name", "pitch", "at", "hold", "vol", "pan", "duck"],
  wait: ["wait"],
  cue: ["cue", "at"],
  music: ["music"],
};
const TRACK_KEYS = ["who", "lyrics", "notes", "caption", "vol", "pan", "beat", "loops", "swing", "shout", "beats", "start", "vibrato", "transpose", "id", "as", "f0"];

function castSpec(who: string, where: string): VoiceSpec & { pan: number } {
  const c = (CAST as Record<string, any>)[who];
  if (!c) fail(where, `unknown cast id ${JSON.stringify(who)}; cast: ${Object.keys(CAST).join(", ")}`);
  return { body: c.body, f0: c.f0, rate: c.rate, accent: c.accent, source: c.source, pan: c.pan ?? 0 };
}

function num(v: unknown, where: string, name: string, lo = -Infinity, hi = Infinity): number | undefined {
  if (v === undefined) return undefined;
  if (typeof v !== "number" || !Number.isFinite(v) || v < lo || v > hi) fail(where, `${name} must be a number in [${lo}, ${hi}], got ${JSON.stringify(v)}`);
  return v as number;
}

function checkNotes(notes: unknown, where: string): [number, number][] {
  if (!Array.isArray(notes) || !notes.length) fail(where, "notes must be a non-empty array of [midi, beats]");
  for (const n of notes as unknown[]) {
    if (!Array.isArray(n) || n.length !== 2 || typeof n[0] !== "number" || typeof n[1] !== "number" || !(n[1] > 0)) fail(where, `bad note ${JSON.stringify(n)} (want [midi, beats]; midi <= 0 is a rest)`);
    if (n[0] > 0 && (n[0] < 28 || n[0] > 96)) fail(where, `note ${n[0]} is out of range (MIDI 28..96)`);
  }
  return notes as [number, number][];
}

async function checkLyrics(lyrics: unknown, notes: [number, number][], where: string): Promise<void> {
  const { E } = await loadEngine();
  if (typeof lyrics !== "string" || !lyrics.trim()) fail(where, "lyrics must be a string");
  const syl = E.lyricsToSyllables(lyrics as string);
  const sounding = notes.filter((n) => n[0] > 0).length;
  if (syl.length !== sounding) fail(where, `${syl.length} syllables for ${sounding} sounding notes — one syllable per note. Syllables: ${syl.map((s) => s.text + (s.wordEnd ? "" : "-")).join(" ")}`);
}

/** beats of rest after the last sung note (a sung line ends when its last note does) */
const trailingRest = (notes: [number, number][]) => {
  let b = 0;
  for (let i = notes.length - 1; i >= 0 && notes[i][0] <= 0; i--) b += notes[i][1];
  return b;
};
const r3 = (x: number) => Math.round(x * 1000) / 1000;

// ------------------------------------------------------------------ word timings → caption words

/** notes for the author, printed after the timeline */
const spreadNotes: string[] = [];

async function captionWords(text: string, as: string | undefined, clip: Clip, at: number, t0: number, t1: number): Promise<[number, number, string][]> {
  const { g2p } = await loadEngine();
  const cap = text.split(/\s+/).filter(Boolean);
  const cw = clip.words.map(([a, b]) => [r3(at + a), r3(at + b)] as [number, number]);
  if (!cap.length) return [];
  // the spoken tokens: `as` when given (it must have one token per caption word to map; join a
  // multi-word respelling with hyphens: "blue-sky"), else the caption itself
  const spoken = (as ?? text).split(/\s+/).filter(Boolean);
  if (cw.length && spoken.length === cap.length) {
    if (cw.length === cap.length) return cap.map((w, i) => [cw[i][0], cw[i][1], w]);
    // group G2P words by token ("2025" → four spoken words, "@prer.at" → two, "—" → none)
    const counts = spoken.map((w) => {
      try {
        return g2p.toPhrases(w).flatMap((p) => p.words).length;
      } catch {
        return 0;
      }
    });
    if (counts.reduce((a, b) => a + b, 0) === cw.length) {
      const out: [number, number, string][] = [];
      let k = 0, last = t0;
      cap.forEach((w, i) => {
        if (counts[i] === 0) out.push([r3(last), r3(last), w]);
        else {
          out.push([cw[k][0], cw[k + counts[i] - 1][1], w]);
          last = cw[k + counts[i] - 1][1];
          k += counts[i];
        }
      });
      return out;
    }
  }
  // spread evenly, weighted by length
  if (cw.length) spreadNotes.push(`words of ${JSON.stringify(text)} spread evenly (${as ? "`as` has a different number of words than `text`; join respelled multi-word tokens with hyphens" : "word count mismatch"})`);
  const wts = cap.map((w) => w.length + 2);
  const tot = wts.reduce((a, b) => a + b, 0);
  let t = t0;
  return cap.map((w, i) => {
    const d = ((t1 - t0) * wts[i]) / tot;
    const o: [number, number, string] = [r3(t), r3(t + d), w];
    t += d;
    return o;
  });
}

/** sung syllable words → whole lyric words (syllables ending in "-" join the next) */
function sungWords(clip: Clip, at: number, lyrics: string): [number, number, string][] {
  const out: [number, number, string][] = [];
  let start = -1;
  for (const [a, b, s] of clip.words) {
    if (start < 0) start = a;
    if (!s.endsWith("-")) {
      out.push([r3(at + start), r3(at + b), s]);
      start = -1;
    }
  }
  const cap = lyrics.split(/\s+/).filter(Boolean);
  if (cap.length === out.length) cap.forEach((w, i) => (out[i][2] = w));
  return out;
}

// ------------------------------------------------------------------ layout

interface Layout {
  lines: Line[];
  cues: Record<string, number>;
  sfx: { name: string; t0: number; t1: number; at: number; L: Float32Array; R: Float32Array; gain: number; duck: number }[];
  music: { id: string; t0: number; bpm: number; beats: number }[];
  end: number;
}

async function layout(script: any): Promise<Layout> {
  const where0 = `script ${script.id}`;
  if (!Array.isArray(script.beats)) fail(where0, "beats must be an array");
  const defGap = num(script.gap, where0, "gap", 0, 5) ?? 0.28;
  resetSfxCounters();
  const lines: Line[] = [];
  const cues: Record<string, number> = {};
  const sfx: Layout["sfx"] = [];
  const music: Layout["music"] = [];
  let cursor = HEAD;
  let first = true;
  let end = HEAD;
  const ids = new Set<string>();
  const addLine = (l: Omit<Line, "i" | "tele" | "teleT0">) => {
    if (l.id) {
      if (ids.has(l.id)) fail(`line ${l.id}`, "duplicate line id");
      ids.add(l.id);
    }
    lines.push({ ...l, i: lines.length, tele: -1, teleT0: 0 });
    end = Math.max(end, l.t1);
  };

  for (let bi = 0; bi < script.beats.length; bi++) {
    const b = script.beats[bi];
    const where = `beat #${bi}${b?.id ? ` (${b.id})` : ""}`;
    if (!b || typeof b !== "object") fail(where, "not an object");
    const kind = Object.keys(KNOWN).find((k) => k in b);
    if (!kind) fail(where, `doesn't say what it is (want one of: ${Object.keys(KNOWN).join(", ")}): ${JSON.stringify(b)}`);
    for (const k of Object.keys(b)) if (!KNOWN[kind!].includes(k)) fail(where, `unknown key ${JSON.stringify(k)} for a ${kind} beat (allowed: ${KNOWN[kind!].join(", ")})`);

    if (kind === "say") {
      const v = castSpec(b.say, where);
      if (typeof b.text !== "string" || !b.text.trim()) fail(where, "text must be a non-empty string");
      if (b.as !== undefined && (typeof b.as !== "string" || !b.as.trim())) fail(where, "as must be a non-empty string");
      if (b.intonation !== undefined && !["statement", "question", "flat"].includes(b.intonation)) fail(where, "intonation must be statement | question | flat");
      const gap = first && b.gap === undefined ? 0 : (num(b.gap, where, "gap", 0, 10) ?? defGap);
      const overlap = num(b.overlap, where, "overlap", 0, 10) ?? 0;
      let clip: Clip;
      try {
        clip = await sayClip(v, b.as ?? b.text, { rate: num(b.rate, where, "rate", 0.5, 2), f0: num(b.f0, where, "f0", 50, 500), accent: num(b.accent, where, "accent", 0, 1), intonation: b.intonation });
      } catch (e) {
        fail(where, (e as Error).message);
      }
      const start = Math.max(0.05, cursor + gap - overlap);
      const at = start - clip!.t0;
      const t1 = at + clip!.t1;
      const caption = b.caption ?? true;
      addLine({ id: b.id, who: b.say, kind: "say", text: b.text, caption, t0: r3(start), t1: r3(t1), words: await captionWords(b.text, b.as, clip!, at, start, t1), clip: clip!, at, gain: KIND_GAIN.say * (num(b.vol, where, "vol", 0, 4) ?? 1), pan: num(b.pan, where, "pan", -1, 1) ?? v.pan, body: v.body, ipa: clip!.ipa });
      cursor = Math.max(cursor, t1);
      first = false;
    } else if (kind === "sing") {
      const v = castSpec(b.sing, where);
      const bpm = num(b.bpm, where, "bpm", 30, 300) ?? fail(where, "bpm is required");
      const notes = checkNotes(b.notes, where);
      await checkLyrics(b.lyrics, notes, where);
      const gap = first && b.gap === undefined ? 0 : (num(b.gap, where, "gap", 0, 10) ?? defGap);
      const overlap = num(b.overlap, where, "overlap", 0, 10) ?? 0;
      const clip = await singClip(v, { bpm: bpm as number, lyrics: b.lyrics, notes, vibrato: num(b.vibrato, where, "vibrato", 0, 100), transpose: num(b.transpose, where, "transpose", -24, 24) });
      const start = Math.max(0.05, cursor + gap - overlap);
      const at = start - clip.t0;
      const t1 = at + clip.t1 - (trailingRest(notes) * 60) / (bpm as number);
      addLine({ id: b.id, who: b.sing, kind: "sing", text: b.text ?? b.lyrics, caption: b.caption ?? true, t0: r3(start), t1: r3(t1), words: sungWords(clip, at, b.text ?? b.lyrics), clip, at, gain: KIND_GAIN.sing * (num(b.vol, where, "vol", 0, 4) ?? 1), pan: num(b.pan, where, "pan", -1, 1) ?? v.pan, body: v.body });
      cursor = Math.max(cursor, t1);
      first = false;
    } else if (kind === "sfx" || kind === "call") {
      let c: StereoClip, name: string;
      if (kind === "sfx") {
        if (typeof b.sfx !== "string") fail(where, "sfx must be a name");
        let r: { base: string; variant: number };
        try {
          r = resolveSfx(b.sfx);
        } catch (e) {
          fail(where, (e as Error).message);
        }
        c = await sfxClip(r!.base, r!.variant);
        name = `${r!.base}-${r!.variant}`;
      } else {
        if (typeof b.call !== "string") fail(where, "call must be a creature id");
        if (b.name !== undefined && typeof b.name !== "string") fail(where, "name must be a call id");
        try {
          c = await callSfx(b.call, b.name, num(b.pitch, where, "pitch", 5, 12000));
        } catch (e) {
          fail(where, (e as Error).message);
        }
        name = `call:${b.call}${b.name ? "/" + b.name : ""}`;
      }
      const t0 = Math.max(0.05, cursor + (num(b.at, where, "at", -30, 30) ?? 0));
      const at = t0 - c!.t0;
      const hold = num(b.hold, where, "hold", 0, 1) ?? c!.hold;
      // `pan` on a (stereo) sfx is a balance: −1 all left … 1 all right
      const pan = num(b.pan, where, "pan", -1, 1) ?? 0;
      let L = c!.L, R = c!.R;
      if (pan) {
        const gl = Math.min(1, 1 - pan), gr = Math.min(1, 1 + pan);
        L = Float32Array.from(c!.L, (x, i) => x * gl + (pan < 0 ? c!.R[i] * -pan : 0));
        R = Float32Array.from(c!.R, (x, i) => x * gr + (pan > 0 ? c!.L[i] * pan : 0));
      }
      sfx.push({ name: name!, t0: r3(t0), t1: r3(at + c!.t1), at, L, R, gain: num(b.vol, where, "vol", 0, 4) ?? 1, duck: num(b.duck, where, "duck", 0, 1) ?? c!.duck ?? 1 });
      end = Math.max(end, at + c!.t1);
      cursor = Math.max(cursor, t0 + hold * (c!.t1 - c!.t0));
    } else if (kind === "wait") {
      cursor += num(b.wait, where, "wait", -10, 60)!;
    } else if (kind === "cue") {
      if (typeof b.cue !== "string" || !b.cue) fail(where, "cue must be a name");
      if (b.cue in cues) fail(where, `cue ${JSON.stringify(b.cue)} is used twice`);
      cues[b.cue] = r3(Math.max(0, cursor + (num(b.at, where, "at", -30, 30) ?? 0)));
    } else if (kind === "music") {
      const m = b.music;
      if (!m || typeof m !== "object") fail(where, "music must be an object { id, bpm, tracks }");
      for (const k of Object.keys(m)) if (!["id", "bpm", "tracks", "gap", "swing"].includes(k)) fail(where, `unknown music key ${JSON.stringify(k)}`);
      const mw = `${where} music ${m.id ?? ""}`;
      if (typeof m.id !== "string") fail(mw, "music needs an id");
      const bpm = num(m.bpm, mw, "bpm", 30, 300) ?? fail(mw, "bpm is required");
      const spb = 60 / (bpm as number);
      if (!Array.isArray(m.tracks) || !m.tracks.length) fail(mw, "tracks must be a non-empty array");
      const t0 = cursor + (num(m.gap, mw, "gap", 0, 10) ?? MUSIC_LEAD);
      let blockEnd = t0, beats = 0;
      for (let ti = 0; ti < m.tracks.length; ti++) {
        const tr = m.tracks[ti];
        const tw = `${mw} track #${ti}`;
        for (const k of Object.keys(tr)) if (!TRACK_KEYS.includes(k)) fail(tw, `unknown track key ${JSON.stringify(k)} (allowed: ${TRACK_KEYS.join(", ")})`);
        const whos: string[] = Array.isArray(tr.who) ? tr.who : [tr.who];
        const vol = num(tr.vol, tw, "vol", 0, 4) ?? 1;
        const startBeat = num(tr.start, tw, "start", 0, 1000) ?? 0;
        const kinds = ["lyrics", "beat", "shout"].filter((k) => k in tr);
        if (kinds.length !== 1) fail(tw, "a track has exactly one of lyrics (sung), beat (beatbox), shout (spoken on beats)");
        for (const who of whos) {
          const v = castSpec(who, tw);
          const pan = num(tr.pan, tw, "pan", -1, 1) ?? v.pan;
          if ("lyrics" in tr) {
            const notes = checkNotes(tr.notes, tw);
            await checkLyrics(tr.lyrics, notes, tw);
            const clip = await singClip(v, { bpm: bpm as number, lyrics: tr.lyrics, notes, vibrato: num(tr.vibrato, tw, "vibrato", 0, 100), transpose: num(tr.transpose, tw, "transpose", -24, 24) });
            const s = t0 + startBeat * spb;
            const at = s - clip.t0;
            // the line sounds from its first sung note to the end of its last
            const lead = notes.findIndex((n) => n[0] > 0);
            const restBeats = notes.slice(0, lead).reduce((a, n) => a + n[1], 0);
            const nb = notes.reduce((a, n) => a + n[1], 0);
            beats = Math.max(beats, startBeat + nb);
            addLine({ id: tr.id ? (whos.length > 1 ? `${tr.id}-${who}` : tr.id) : undefined, who, kind: "sing", text: tr.lyrics, caption: tr.caption ?? false, t0: r3(s + restBeats * spb), t1: r3(at + clip.t1 - trailingRest(notes) * spb), words: sungWords(clip, at, tr.lyrics), clip, at, gain: KIND_GAIN.sing * vol, pan, body: v.body });
            blockEnd = Math.max(blockEnd, at + clip.t1);
          } else if ("beat" in tr) {
            const { E } = await loadEngine();
            if (typeof tr.beat !== "string") fail(tw, "beat must be a pattern string");
            let steps: unknown[];
            try {
              steps = E.parseBeat(tr.beat);
            } catch (e) {
              fail(tw, `bad beat pattern: ${(e as Error).message}`);
            }
            if (!steps!.some(Boolean)) fail(tw, `no sounds in beat pattern ${JSON.stringify(tr.beat)}`);
            const loops = num(tr.loops, tw, "loops", 1, 1000) ?? 1;
            const clip = await beatClip(v, { bpm: bpm as number, pattern: tr.beat, loops, swing: num(tr.swing ?? m.swing, tw, "swing", 0, 0.5) ?? 0 }, 0.3);
            const s = t0 + startBeat * spb;
            const at = s - clip.t0;
            beats = Math.max(beats, startBeat + (steps!.length * loops) / 4);
            addLine({ id: tr.id, who, kind: "beat", text: tr.beat, caption: false, t0: r3(s), t1: r3(at + clip.t1), words: [], clip, at, gain: KIND_GAIN.beat * vol, pan, body: v.body });
            blockEnd = Math.max(blockEnd, at + clip.t1);
          } else {
            if (typeof tr.shout !== "string") fail(tw, "shout must be text");
            if (!Array.isArray(tr.beats) || !tr.beats.length || tr.beats.some((x: unknown) => typeof x !== "number" || x < 0)) fail(tw, "beats must be a non-empty array of beat numbers (0-based quarter notes)");
            const clip = await sayClip({ ...v, source: { ...v.source, ...SHOUT_SOURCE } }, tr.as ?? tr.shout, { f0: (num(tr.f0, tw, "f0", 50, 500) ?? v.f0 * SHOUT_F0), rate: 1.05, accent: 0.45, intonation: "statement" });
            for (const bt of tr.beats as number[]) {
              const anchorT = t0 + (startBeat + bt) * spb;
              const at = anchorT - clip.anchor;
              beats = Math.max(beats, startBeat + bt + 1);
              addLine({ who, kind: "shout", text: tr.shout, caption: false, t0: r3(at + clip.t0), t1: r3(at + clip.t1), words: [[r3(at + clip.t0), r3(at + clip.t1), tr.shout]], clip, at, gain: KIND_GAIN.shout * vol, pan, body: v.body });
              blockEnd = Math.max(blockEnd, at + clip.t1);
            }
          }
        }
      }
      music.push({ id: m.id, t0: r3(t0), bpm: bpm as number, beats });
      cursor = Math.max(blockEnd, t0 + beats * spb);
      end = Math.max(end, cursor);
      first = false;
    }
  }
  return { lines, cues, sfx, music, end: Math.max(end, cursor) };
}

// ------------------------------------------------------------------ mix

function limit(L: Float32Array, R: Float32Array): { gr: number } {
  const n = L.length;
  const la = Math.round(0.005 * FS); // 5 ms look-ahead
  const rel = Math.exp(-1 / (0.15 * FS));
  const req = new Float32Array(n);
  const tl = truePeakTrack(L), tr = truePeakTrack(R);
  for (let i = 0; i < n; i++) {
    // the interval [i, i+1] counts for both of its ends
    const p = Math.max(tl[i], tr[i], i ? Math.max(tl[i - 1], tr[i - 1]) : 0);
    req[i] = p > LIMIT ? LIMIT / p : 1;
  }
  // window minimum over [i, i + la] (monotone deque), with a slow release
  const wmin = new Float32Array(n);
  const dq: number[] = [];
  let h = 0;
  for (let i = n - 1; i >= 0; i--) {
    while (dq.length > h && req[dq[dq.length - 1]] >= req[i]) dq.pop();
    dq.push(i);
    while (dq[h] > i + la) h++;
    wmin[i] = req[dq[h]];
  }
  let g = 1;
  for (let i = 0; i < n; i++) {
    g = wmin[i] < g ? wmin[i] : wmin[i] + (g - wmin[i]) * rel;
    wmin[i] = g;
  }
  // box-average over la: smooth, and still never above what each sample needs
  let acc = 0, most = 0;
  const sm = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    acc += wmin[i];
    if (i >= la) acc -= wmin[i - la];
    sm[i] = i >= la ? acc / la : Math.min(...Array.from(wmin.subarray(0, i + 1)));
  }
  for (let i = 0; i < n; i++) {
    const gg = Math.min(sm[i], req[i]);
    L[i] *= gg;
    R[i] *= gg;
    most = Math.max(most, 1 - gg);
  }
  return { gr: most };
}

function mix(lay: Layout, dur: number): { L: Float32Array; R: Float32Array; peak: number; gr: number; gain: number } {
  const n = Math.ceil(dur * FS);
  const L = new Float32Array(n), R = new Float32Array(n);
  const put = (x: Float32Array, at: number, gl: number, gr: number) => {
    const n0 = Math.round(at * FS);
    for (let i = 0; i < x.length; i++) {
      const j = n0 + i;
      if (j < 0 || j >= n) continue;
      L[j] += x[i] * gl;
      R[j] += x[i] * gr;
    }
  };
  for (const l of lay.lines) {
    const a = ((l.pan + 1) * Math.PI) / 4;
    put(l.clip.audio, l.at, l.gain * Math.cos(a) * Math.SQRT2 * 0.85, l.gain * Math.sin(a) * Math.SQRT2 * 0.85);
  }
  // the audience ducks under the dialogue: sfx drop by DUCK while anyone says or sings a
  // captioned line (150 ms ramps)
  const duck = new Float32Array(n).fill(1);
  const ramp = 0.15;
  for (const l of lay.lines) {
    if (!(l.kind === "say" || (l.kind === "sing" && l.caption))) continue;
    const a = l.t0 - 0.05, b = l.t1 + 0.05;
    for (let j = Math.max(0, Math.floor((a - ramp) * FS)); j < Math.min(n, Math.ceil((b + ramp) * FS)); j++) {
      const t = j / FS;
      const x = t < a ? (t - (a - ramp)) / ramp : t > b ? (b + ramp - t) / ramp : 1;
      const w = 0.5 - 0.5 * Math.cos(Math.PI * Math.max(0, Math.min(1, x)));
      duck[j] = Math.min(duck[j], 1 - (1 - DUCK) * w);
    }
  }
  for (const s of lay.sfx) {
    const n0 = Math.round(s.at * FS);
    for (let i = 0; i < s.L.length; i++) {
      const j = n0 + i;
      if (j < 0 || j >= n) continue;
      const g = s.gain * (1 - (1 - duck[j]) * s.duck);
      L[j] += s.L[i] * g;
      R[j] += s.R[i] * g;
    }
  }
  // DC guard: a 10 Hz one-pole high-pass
  const k = Math.exp((-2 * Math.PI * 10) / FS);
  for (const x of [L, R]) {
    let xp = 0, yp = 0;
    for (let i = 0; i < n; i++) {
      const y = k * (yp + x[i] - xp);
      xp = x[i];
      x[i] = yp = y;
    }
  }
  // loudness: dialogue to DIALOGUE_LUFS (or the whole mix, if nobody speaks)
  const dlg = lay.lines.filter((l) => l.kind === "say").map((l) => [l.t0, l.t1] as [number, number]);
  // the gain splits the difference between the dialogue loudness and the whole mix's: speech
  // stays near −17 LUFS everywhere, and music-heavy segments (the song) don't play much louder
  // than the talk segments around them
  const whole = lufs(L, R, FS);
  const speech = dlg.length ? lufs(L, R, FS, dlg) : whole;
  const now = Number.isFinite(speech) ? (speech + whole) / 2 : whole;
  const gain = Number.isFinite(now) ? Math.pow(10, (DIALOGUE_LUFS - now) / 20) : 1;
  for (let i = 0; i < n; i++) (L[i] *= gain), (R[i] *= gain);
  const { gr } = limit(L, R);
  let peak = 0;
  for (let i = 0; i < n; i++) {
    if (!Number.isFinite(L[i]) || !Number.isFinite(R[i])) throw new Error(`non-finite sample at ${(i / FS).toFixed(3)} s`);
    peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
  }
  return { L, R, peak, gr, gain };
}

function encodeMp3(L: Float32Array, R: Float32Array, out: string): void {
  const inter = new Float32Array(L.length * 2);
  for (let i = 0; i < L.length; i++) (inter[2 * i] = L[i]), (inter[2 * i + 1] = R[i]);
  const tmp = tmpName(out);
  const r = spawnSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "f32le", "-ar", String(FS), "-ac", "2", "-i", "pipe:0", "-c:a", "libmp3lame", "-b:a", "96k", "-ar", String(FS), "-f", "mp3", tmp], { input: Buffer.from(inter.buffer), maxBuffer: 1 << 30 });
  if (r.status !== 0) {
    try {
      unlinkSync(tmp);
    } catch {}
    throw new Error(`ffmpeg failed: ${r.stderr?.toString()}`);
  }
  renameSync(tmp, out);
}

const tmpName = (file: string) => `${file}.${process.pid}.${Math.random().toString(36).slice(2, 8)}.tmp`;

/** write via a temp file + rename, so the page (or a concurrent reader) never sees half a file */
function writeAtomic(file: string, data: Buffer | string): void {
  const tmp = tmpName(file);
  writeFileSync(tmp, data);
  renameSync(tmp, file);
}

/**
 * One render per segment id at a time: authors share a checkout, and two renders of the same id
 * would race on its three outputs. A lock file holds the pid; a stale lock (dead pid) is taken over.
 */
function lockSegment(id: string): () => void {
  const dir = `${ROOT}tools/.cache/locks`;
  mkdirSync(dir, { recursive: true });
  const f = `${dir}/${id}.lock`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const fd = openSync(f, "wx");
      writeFileSync(fd, String(process.pid));
      closeSync(fd);
      return () => {
        try {
          unlinkSync(f);
        } catch {}
      };
    } catch {
      let pid = 0;
      try {
        pid = +readFileSync(f, "utf8");
      } catch {}
      let alive = false;
      try {
        if (pid) process.kill(pid, 0), (alive = true);
      } catch {}
      if (alive) throw new ScriptError(`segment ${id} is being rendered by another process (pid ${pid}); render only your own segment id`);
      try {
        unlinkSync(f);
      } catch {}
    }
  }
  throw new ScriptError(`could not lock segment ${id}`);
}

// ------------------------------------------------------------------ main

const fmt = (t: number) => t.toFixed(2).padStart(6);

export async function renderSegment(id: string, opts: { quiet?: boolean } = {}): Promise<void> {
  const file = `${ROOT}src/segments/${id}/script.js`;
  if (!existsSync(file)) throw new ScriptError(`no script at src/segments/${id}/script.js`);
  const script = (await import(pathToFileURL(file).href + `?t=${Date.now()}`)).default;
  if (!script || typeof script !== "object") throw new ScriptError(`${file}: needs a default export`);
  if (script.id !== id) throw new ScriptError(`${file}: id is ${JSON.stringify(script.id)}, expected ${JSON.stringify(id)}`);
  const tStart = performance.now();
  const unlock = lockSegment(id);
  try {
    await renderLocked(id, script, tStart, opts);
  } finally {
    unlock();
  }
}

async function renderLocked(id: string, script: any, tStart: number, opts: { quiet?: boolean }): Promise<void> {
  const lay = await layout(script);
  const duration = r3(lay.end + TAIL);
  const { L, R, peak, gr, gain } = mix(lay, duration);

  // telemetry blocks, deduplicated by content
  const blocks: { tele: Tele; body: BodyMix; teleT0Off: number }[] = [];
  const seen = new Map<string, number>();
  for (const l of lay.lines) {
    const t = l.clip.tele;
    if (!t) continue;
    const key = createHash("sha1").update(Buffer.from(t.data.buffer, t.data.byteOffset, t.data.byteLength)).update(JSON.stringify(l.body)).digest("hex");
    if (!seen.has(key)) {
      seen.set(key, blocks.length);
      blocks.push({ tele: t, body: l.body, teleT0Off: 0 });
    }
    l.tele = seen.get(key)!;
    l.teleT0 = r3(l.at);
  }
  const teleBin = encodeTele(blocks);

  mkdirSync(`${ROOT}public/audio`, { recursive: true });
  mkdirSync(`${ROOT}public/tele`, { recursive: true });
  // encode, decode, and trim until the decoded peak is safe (mp3 adds inter-sample overshoot)
  let mp3Peak = 0;
  for (let pass = 0; pass < 4; pass++) {
    encodeMp3(L, R, `${ROOT}public/audio/${id}.mp3`);
    const d = decodeStereo(`${ROOT}public/audio/${id}.mp3`);
    mp3Peak = 0;
    for (const x of [d.L, d.R]) for (let i = 0; i < x.length; i++) mp3Peak = Math.max(mp3Peak, Math.abs(x[i]));
    if (mp3Peak <= MP3_PEAK) break;
    const k = (MP3_PEAK - 0.01) / mp3Peak;
    for (let i = 0; i < L.length; i++) (L[i] *= k), (R[i] *= k);
  }
  const mixLufs = lufs(L, R, FS);
  writeAtomic(`${ROOT}public/tele/${id}.bin`, teleBin);
  const cues = {
    id,
    title: script.title ?? id,
    duration,
    audio: `audio/${id}.mp3`,
    tele: `tele/${id}.bin`,
    lines: lay.lines.map((l) => ({ i: l.i, ...(l.id ? { id: l.id } : {}), who: l.who, kind: l.kind, text: l.text, caption: l.caption, t0: l.t0, t1: l.t1, words: l.words, tele: l.tele, teleT0: l.teleT0 })),
    cues: lay.cues,
    sfx: lay.sfx.map((s) => ({ name: s.name, t0: s.t0, t1: s.t1 })),
    music: lay.music,
  };
  writeAtomic(`${ROOT}src/segments/${id}/cues.json`, JSON.stringify(cues, null, 1) + "\n");

  if (opts.quiet) return;
  // ---- the timeline, for the author
  console.log(`\n${id} — ${script.title ?? ""}  (${duration.toFixed(2)} s)`);
  type Row = { t: number; s: string };
  const rows: Row[] = [];
  for (const l of lay.lines) {
    if (l.kind === "shout" && rows.some((r) => r.s.includes(`shout ${l.who} `) && r.s.includes(JSON.stringify(l.text)))) continue;
    const extra = l.kind === "shout" ? ` ×${lay.lines.filter((x) => x.kind === "shout" && x.who === l.who && x.text === l.text).length}` : "";
    rows.push({ t: l.t0, s: `${fmt(l.t0)} → ${fmt(l.t1)}  ${(l.t1 - l.t0).toFixed(2).padStart(5)}s  ${l.kind.padEnd(5)} ${l.who.padEnd(6)} ${JSON.stringify(l.text.length > 70 ? l.text.slice(0, 67) + "…" : l.text)}${extra}${l.ipa ? `\n${" ".repeat(32)}/${l.ipa}/` : ""}` });
  }
  for (const s of lay.sfx) rows.push({ t: s.t0, s: `${fmt(s.t0)} → ${fmt(s.t1)}  ${(s.t1 - s.t0).toFixed(2).padStart(5)}s  sfx   ${s.name}` });
  for (const [k, t] of Object.entries(lay.cues)) rows.push({ t, s: `${fmt(t)}           cue   ${k}` });
  for (const m of lay.music) rows.push({ t: m.t0 - 1e-3, s: `${fmt(m.t0)}           music ${m.id}: ${m.beats} beats @ ${m.bpm} bpm (${((m.beats * 60) / m.bpm).toFixed(2)} s)` });
  rows.sort((a, b) => a.t - b.t);
  for (const r of rows) console.log(r.s);
  for (const n of spreadNotes.splice(0)) console.log(`note: ${n}`);
  const kb = (f: string) => (Bun.file(f).size / 1024).toFixed(0);
  console.log(`loudness ${mixLufs.toFixed(1)} LUFS (dialogue/mix mean normalized to ${DIALOGUE_LUFS}, gain ${(20 * Math.log10(gain)).toFixed(1)} dB)  ·  decoded mp3 peak ${mp3Peak.toFixed(3)}`);
  console.log(`peak ${peak.toFixed(3)} (limiter max ${(20 * Math.log10(1 - gr + 1e-9)).toFixed(1)} dB)  ·  ${blocks.length} tele blocks for ${lay.lines.length} lines  ·  mp3 ${kb(`${ROOT}public/audio/${id}.mp3`)} KB, tele ${kb(`${ROOT}public/tele/${id}.bin`)} KB  ·  ${((performance.now() - tStart) / 1000).toFixed(1)} s`);
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  let ids = args.filter((a) => !a.startsWith("--"));
  if (args.includes("--warm")) {
    // pre-render every sfx variant and every creature call into the shared cache, so authors
    // don't each render the crowd from scratch
    const t = performance.now();
    const { SFX, creatureCalls } = await import("./sfx.ts");
    for (const [name, e] of Object.entries(SFX)) {
      for (let v = 1; v <= e.variants; v++) await sfxClip(name, v);
      console.log(`warm: ${name} ×${e.variants}  (${((performance.now() - t) / 1000).toFixed(0)} s)`);
    }
    for (const [cid, calls] of Object.entries(await creatureCalls())) for (const c of calls) await callSfx(cid, c);
    console.log(`warm: creature calls  (${((performance.now() - t) / 1000).toFixed(0)} s)`);
    if (!ids.length && !args.includes("--all")) process.exit(0);
  }
  if (args.includes("--all")) ids = readdirSync(`${ROOT}src/segments`).filter((d) => existsSync(`${ROOT}src/segments/${d}/script.js`));
  if (!ids.length) {
    console.error("usage: bun tools/render.ts <segment-id> [more ids…] | --all | --warm  [--whisper]");
    process.exit(2);
  }
  let bad = 0;
  for (const id of ids) {
    try {
      await renderSegment(id);
      if (args.includes("--whisper")) await (await import("./analyze.ts")).whisperSegment(id);
    } catch (e) {
      bad++;
      if (e instanceof ScriptError) console.error(`\n✗ ${id}: ${e.message}`);
      else console.error(`\n✗ ${id}:`, e);
    }
  }
  process.exit(bad ? 1 : 0);
}
