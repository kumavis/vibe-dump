/**
 * Numbers for ears we don't have.
 *
 *   bun tools/analyze.ts sfx [name …]         every sfx variant (or the named ones)
 *   bun tools/analyze.ts voices [id …]        each cast voice saying two test sentences
 *   bun tools/analyze.ts mp3 <segment-id>     a rendered segment, second by second
 *   add --wav <dir> to also write WAVs (for `bun tools/spectrogram.ts in.wav out.png` in the
 *   chimera repo, or for listening); --whisper to transcribe the voice renders if `whisper` is on PATH.
 *
 * Per sound: duration, peak, RMS, DC, NaN count, zero-crossing rate, spectral centroid, voiced
 * fraction (autocorrelation), and an RMS envelope sparkline (100 ms per character).
 */
import { mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { FS } from "./engine.ts";
import { sayClip, type VoiceSpec } from "./clips.ts";
import { SFX, sfxClip } from "./sfx.ts";
import { CAST } from "../src/cast.js";

const ROOT = new URL("../", import.meta.url).pathname;

export interface Stats {
  dur: number;
  peak: number;
  rmsDb: number;
  dc: number;
  nan: number;
  zcr: number;
  centroid: number;
  voiced: number;
  env: string;
}

function fftMag(x: Float32Array): Float32Array {
  // radix-2 real FFT magnitude (x.length a power of two)
  const n = x.length;
  const re = Float64Array.from(x), im = new Float64Array(n);
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) [re[i], re[j]] = [re[j], re[i]];
  }
  for (let len = 2; len <= n; len <<= 1) {
    const a = (-2 * Math.PI) / len;
    for (let i = 0; i < n; i += len)
      for (let k = 0; k < len / 2; k++) {
        const wr = Math.cos(a * k), wi = Math.sin(a * k);
        const ur = re[i + k], ui = im[i + k];
        const vr = re[i + k + len / 2] * wr - im[i + k + len / 2] * wi;
        const vi = re[i + k + len / 2] * wi + im[i + k + len / 2] * wr;
        re[i + k] = ur + vr, im[i + k] = ui + vi;
        re[i + k + len / 2] = ur - vr, im[i + k + len / 2] = ui - vi;
      }
  }
  const m = new Float32Array(n / 2);
  for (let i = 0; i < n / 2; i++) m[i] = Math.hypot(re[i], im[i]);
  return m;
}

const BARS = " ▁▂▃▄▅▆▇█";

export function stats(x: Float32Array): Stats {
  let peak = 0, sum = 0, dc = 0, nan = 0, zc = 0;
  for (let i = 0; i < x.length; i++) {
    const v = x[i];
    if (!Number.isFinite(v)) {
      nan++;
      continue;
    }
    peak = Math.max(peak, Math.abs(v));
    sum += v * v;
    dc += v;
    if (i && (x[i - 1] < 0) !== (v < 0)) zc++;
  }
  // envelope, 100 ms windows
  const W = FS / 10;
  const env: number[] = [];
  for (let i = 0; i + W <= x.length; i += W) {
    let s = 0;
    for (let j = i; j < i + W; j++) s += x[j] * x[j];
    env.push(Math.sqrt(s / W));
  }
  const emax = Math.max(1e-9, ...env);
  const spark = env.map((e) => BARS[Math.max(0, Math.min(8, Math.round(8 + (20 * Math.log10(e / emax + 1e-9)) / 5)))]).join("");
  // centroid and voiced fraction over 2048-sample frames above −30 dB of the loudest
  const N = 2048;
  let cnum = 0, cden = 0, vf = 0, frames = 0;
  for (let i = 0; i + N <= x.length; i += N) {
    let e = 0;
    for (let j = i; j < i + N; j++) e += x[j] * x[j];
    if (Math.sqrt(e / N) < emax * 0.03) continue;
    frames++;
    const fr = new Float32Array(N);
    for (let j = 0; j < N; j++) fr[j] = x[i + j] * (0.5 - 0.5 * Math.cos((2 * Math.PI * j) / N));
    const m = fftMag(fr);
    for (let k = 1; k < m.length; k++) (cnum += m[k] * m[k] * (k * FS) / N), (cden += m[k] * m[k]);
    // normalized autocorrelation peak in 60–500 Hz
    let best = 0;
    for (let lag = Math.floor(FS / 500); lag <= Math.floor(FS / 60); lag += 2) {
      let ac = 0, e1 = 0, e2 = 0;
      for (let j = 0; j < N - lag; j += 2) (ac += fr[j] * fr[j + lag]), (e1 += fr[j] * fr[j]), (e2 += fr[j + lag] * fr[j + lag]);
      best = Math.max(best, ac / Math.sqrt(e1 * e2 + 1e-12));
    }
    if (best > 0.6) vf++;
  }
  return { dur: x.length / FS, peak, rmsDb: 20 * Math.log10(Math.sqrt(sum / x.length) + 1e-12), dc: dc / x.length, nan, zcr: (zc / x.length) * FS, centroid: cden ? cnum / cden : 0, voiced: frames ? vf / frames : 0, env: spark };
}

export function fmtStats(name: string, s: Stats): string {
  const warn: string[] = [];
  if (s.nan) warn.push(`${s.nan} NaN`);
  if (s.peak > 0.99) warn.push("CLIPS");
  if (s.peak < 0.01) warn.push("SILENT");
  if (Math.abs(s.dc) > 1e-3) warn.push(`DC ${s.dc.toExponential(1)}`);
  return `${name.padEnd(18)} ${s.dur.toFixed(2).padStart(5)} s  peak ${s.peak.toFixed(3)}  rms ${s.rmsDb.toFixed(1).padStart(6)} dB  zcr ${Math.round(s.zcr).toString().padStart(5)}/s  centroid ${Math.round(s.centroid).toString().padStart(5)} Hz  voiced ${(s.voiced * 100).toFixed(0).padStart(3)}%  ${warn.length ? "⚠ " + warn.join(", ") : "ok"}\n${" ".repeat(19)}${s.env}`;
}

export function writeWav(path: string, chans: Float32Array[]): void {
  const n = chans[0].length, c = chans.length;
  const b = Buffer.alloc(44 + n * c * 2);
  b.write("RIFF", 0), b.writeUInt32LE(36 + n * c * 2, 4), b.write("WAVE", 8), b.write("fmt ", 12);
  b.writeUInt32LE(16, 16), b.writeUInt16LE(1, 20), b.writeUInt16LE(c, 22), b.writeUInt32LE(FS, 24);
  b.writeUInt32LE(FS * c * 2, 28), b.writeUInt16LE(c * 2, 32), b.writeUInt16LE(16, 34), b.write("data", 36), b.writeUInt32LE(n * c * 2, 40);
  for (let i = 0; i < n; i++) for (let k = 0; k < c; k++) b.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(chans[k][i] * 32767))), 44 + (i * c + k) * 2);
  writeFileSync(path, b);
}

/** band edges for the long-term average spectrum (Hz), roughly third-octave-ish */
const BANDS = [80, 160, 250, 350, 500, 700, 1000, 1400, 2000, 2800, 4000, 5600, 8000, 11000];

/** add the clip's band powers (sounding frames only) into `acc` */
function ltasInto(x: Float32Array, acc: Float64Array): void {
  const N = 2048;
  let pk = 0;
  for (const v of x) pk = Math.max(pk, Math.abs(v));
  for (let i = 0; i + N <= x.length; i += N / 2) {
    let e = 0;
    for (let j = i; j < i + N; j++) e += x[j] * x[j];
    if (Math.sqrt(e / N) < pk * 0.02) continue;
    const fr = new Float32Array(N);
    for (let j = 0; j < N; j++) fr[j] = x[i + j] * (0.5 - 0.5 * Math.cos((2 * Math.PI * j) / N));
    const m = fftMag(fr);
    for (let k = 1; k < m.length; k++) {
      const f = (k * FS) / N;
      const b = BANDS.findIndex((e2, bi) => f >= e2 && f < BANDS[bi + 1]);
      if (b >= 0) acc[b] += m[k] * m[k];
    }
  }
}

/** run the local whisper (base.en) on a wav or mp3; "" if none is installed */
export function transcribe(file: string, outDir: string, extra: string[] = []): string {
  if (spawnSync("which", ["whisper"]).status !== 0) return "";
  spawnSync("whisper", [file, "--model", "base.en", "--language", "en", "--output_format", "txt", "--output_dir", outDir, "--fp16", "False", ...extra], { stdio: "ignore" });
  const txt = `${outDir}/${file.split("/").pop()!.replace(/\.[^.]+$/, "")}.txt`;
  return existsSync(txt) ? readFileSync(txt, "utf8").trim().replace(/\s+/g, " ") : "";
}

const ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const TENS = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function numWords(n: number): string {
  if (n < 20) return ONES[n];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? " " + ONES[n % 10] : "");
  if (n < 1000) return ONES[Math.floor(n / 100)] + " hundred" + (n % 100 ? " " + numWords(n % 100) : "");
  if (n < 10000) return numWords(Math.floor(n / 1000)) + " thousand" + (n % 1000 ? " " + numWords(n % 1000) : "");
  return String(n);
}
/** words for scoring: lower case, no punctuation, digits and % spelled out (Whisper writes "90 %") */
const norm = (s: string) =>
  s.toLowerCase().replace(/%/g, " percent ").replace(/\d+/g, (d) => " " + numWords(+d) + " ").replace(/[^a-z' ]/g, " ").split(/\s+/).filter(Boolean);
/** how many reference words Whisper heard (bag of words, each heard word used once) */
export function wordScore(ref: string, heard: string): [number, number] {
  // "built it" and "build it" sound the same (the t flaps before a vowel): count either
  const SAME: Record<string, string> = { build: "built", builds: "built" };
  const r = norm(ref).map((w) => SAME[w] ?? w), h = norm(heard).map((w) => SAME[w] ?? w);
  // compounds count ("simcluster" covers "sim" and "cluster")
  const joined = h.join("");
  let ok = 0;
  for (const w of r) {
    const i = h.indexOf(w);
    if (i >= 0) ok++, h.splice(i, 1);
    else if (w.length >= 3 && joined.includes(w)) ok++;
  }
  return [ok, r.length];
}

/**
 * Intelligibility check for a rendered segment: cut each captioned line (say, captioned sing) out
 * of the final mix — so laughs, applause and music under it count — transcribe them all in one
 * local Whisper (base.en) run, and print caption vs heard with a word score. Lines under 60 % are
 * flagged: respell with `as` (see tools/README.md).
 */
export async function whisperSegment(id: string): Promise<boolean> {
  if (spawnSync("which", ["whisper"]).status !== 0) {
    console.error("whisper is not on PATH (pip install openai-whisper); skipping the intelligibility check");
    return false;
  }
  const mp3 = `${ROOT}public/audio/${id}.mp3`;
  const cues = JSON.parse(readFileSync(`${ROOT}src/segments/${id}/cues.json`, "utf8"));
  const dir = `${ROOT}tools/.cache/whisper/${id}`;
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const t = performance.now();
  // each cut is padded with 0.6 s of digital silence on both sides: Whisper hallucinates on
  // sub-second clips ("Thank you.", "Cheers!") when speech touches the clip edges
  const lines = cues.lines.filter((l: any) => l.kind === "say" || (l.kind === "sing" && l.caption));
  const files: string[] = [];
  for (const l of lines) {
    const f = `${dir}/line-${String(l.i).padStart(3, "0")}.wav`;
    spawnSync("ffmpeg", ["-v", "error", "-y", "-ss", String(Math.max(0, l.t0 - 0.12)), "-t", String(l.t1 - l.t0 + 0.3), "-i", mp3, "-ac", "1", "-ar", "16000", "-af", "adelay=600:all=1,apad=pad_dur=0.6", f]);
    files.push(f);
  }
  spawnSync("whisper", [...files, "--model", "base.en", "--language", "en", "--output_format", "txt", "--condition_on_previous_text", "False", "--output_dir", dir, "--fp16", "False"], { stdio: "ignore" });
  console.log(`\n${id}: what Whisper (base.en) hears in each line, cut from the final mix  (${((performance.now() - t) / 1000).toFixed(0)} s)`);
  let tot = 0, got = 0;
  const weak: string[] = [];
  lines.forEach((l: any, k: number) => {
    const txt = files[k].replace(/\.wav$/, ".txt");
    const heard = existsSync(txt) ? readFileSync(txt, "utf8").trim().replace(/\s+/g, " ") : "";
    const [ok, all] = wordScore(l.text, heard);
    tot += all, got += ok;
    const pct = all ? ok / all : 1;
    const flag = pct < 0.6 ? "✗" : pct < 0.85 ? "~" : "✓";
    if (pct < 0.6) weak.push(l.id ?? `#${l.i}`);
    console.log(`${flag} ${l.t0.toFixed(1).padStart(6)} ${l.who.padEnd(8)} ${ok}/${all}  "${l.text}"\n${" ".repeat(26)}heard: "${heard}"`);
  });
  console.log(`\n${got}/${tot} caption words heard (${Math.round((100 * got) / Math.max(1, tot))}%)${weak.length ? `; weak lines: ${weak.join(", ")}` : ""}`);
  console.log("Whisper doesn't know invented names (norvid, Jevbot, …): judge those by the IPA in the render timeline.");
  return true;
}

export const TEST_SENTENCES = [
  "Good evening, and welcome back to the show.",
  "Wait, are you telling me the feed knows what I had for breakfast?",
];

if (import.meta.main) {
  const args = process.argv.slice(2);
  const wi = args.indexOf("--wav");
  const wavDir = wi >= 0 ? args[wi + 1] : null;
  const whisper = args.includes("--whisper");
  const rest = args.filter((a, i) => !a.startsWith("--") && !(wi >= 0 && i === wi + 1));
  const [mode, ...names] = rest;
  if (wavDir) mkdirSync(wavDir, { recursive: true });

  if (mode === "sfx") {
    const list = names.length ? names : Object.keys(SFX);
    for (const name of list) {
      const m = /^(.*)-(\d+)$/.exec(name);
      const base = SFX[name] ? name : m![1];
      const vs = SFX[name] ? Array.from({ length: SFX[name].variants }, (_, i) => i + 1) : [+m![2]];
      for (const v of vs) {
        const c = await sfxClip(base, v);
        const mono = new Float32Array(c.L.length);
        for (let i = 0; i < mono.length; i++) mono[i] = 0.5 * (c.L[i] + c.R[i]);
        let corr = 0, eL = 0, eR = 0;
        for (let i = 0; i < c.L.length; i++) (corr += c.L[i] * c.R[i]), (eL += c.L[i] ** 2), (eR += c.R[i] ** 2);
        console.log(fmtStats(`${base}-${v}`, stats(mono)) + `\n${" ".repeat(19)}sound ${c.t0.toFixed(2)}–${c.t1.toFixed(2)} s, hold ${c.hold}, L/R correlation ${(corr / Math.sqrt(eL * eR + 1e-12)).toFixed(2)}`);
        if (wavDir) writeWav(`${wavDir}/${base}-${v}.wav`, [c.L, c.R]);
      }
    }
  } else if (mode === "voices") {
    // each voice: two test sentences → level/brightness stats, median f0, a long-term average
    // spectrum (LTAS), Whisper word score; then how far every voice is from every other
    const ids = names.length ? names : Object.keys(CAST);
    const feats: { id: string; f0: number; ltas: number[]; cent: number }[] = [];
    for (const id of ids) {
      const c = (CAST as any)[id];
      if (!c) throw new Error(`unknown cast id ${id}`);
      const v: VoiceSpec = { body: c.body, f0: c.f0, rate: c.rate, accent: c.accent, source: c.source };
      const f0s: number[] = [];
      const lt = new Float64Array(BANDS.length - 1);
      let cent = 0, heardOk = 0, heardAll = 0;
      for (let k = 0; k < TEST_SENTENCES.length; k++) {
        const clip = await sayClip(v, TEST_SENTENCES[k]);
        const s = stats(clip.audio);
        cent += s.centroid / TEST_SENTENCES.length;
        const t = clip.tele!;
        for (let f = 0; f < t.frames; f++) if (t.data[f * t.channels + 4] > 0.5) f0s.push(t.data[f * t.channels + 3]);
        ltasInto(clip.audio, lt);
        let line = fmtStats(`${id}-${k + 1}`, s) + `  (${(clip.t1 - clip.t0).toFixed(2)} s speech)`;
        if (wavDir) {
          const f = `${wavDir}/${id}-${k + 1}.wav`;
          writeWav(f, [clip.audio]);
          if (whisper) {
            const heard = transcribe(f, wavDir);
            const [ok, all] = wordScore(TEST_SENTENCES[k], heard);
            heardOk += ok, heardAll += all;
            line += `\n${" ".repeat(19)}whisper ${ok}/${all}: ${heard}`;
          }
        }
        console.log(line);
      }
      f0s.sort((a, b) => a - b);
      const ltas = Array.from(lt, (x) => 10 * Math.log10(x + 1e-20));
      const mean = ltas.reduce((a, b) => a + b, 0) / ltas.length;
      feats.push({ id, f0: f0s[Math.floor(f0s.length / 2)] ?? 0, ltas: ltas.map((x) => x - mean), cent });
      if (heardAll) console.log(`${" ".repeat(19)}${id}: whisper ${heardOk}/${heardAll} words (${Math.round((100 * heardOk) / heardAll)}%)`);
    }
    // distance: pitch (semitones / 2) and spectral shape (rms dB difference of the LTAS / 2.5)
    console.log(`\nvoice     median f0  centroid   nearest (distance: pitch st, LTAS dB)`);
    for (const a of feats) {
      const ds = feats.filter((b) => b !== a).map((b) => {
        const st = Math.abs(12 * Math.log2(a.f0 / b.f0));
        const sp = Math.sqrt(a.ltas.reduce((acc, x, i) => acc + (x - b.ltas[i]) ** 2, 0) / a.ltas.length);
        return { b: b.id, st, sp, d: Math.hypot(st / 2, sp / 2.5) };
      }).sort((x, y) => x.d - y.d);
      console.log(`${a.id.padEnd(9)} ${a.f0.toFixed(0).padStart(5)} Hz  ${Math.round(a.cent).toString().padStart(5)} Hz   ${ds.slice(0, 3).map((x) => `${x.b} ${x.d.toFixed(2)} (${x.st.toFixed(1)} st, ${x.sp.toFixed(1)} dB)`).join(" · ")}`);
    }
  } else if (mode === "whisper") {
    const ok = await whisperSegment(names[0]);
    if (!ok) process.exit(1);
  } else if (mode === "mp3") {
    const id = names[0];
    const f = `${ROOT}public/audio/${id}.mp3`;
    const dec = spawnSync("ffmpeg", ["-v", "error", "-i", f, "-f", "f32le", "-ac", "1", "-ar", String(FS), "pipe:1"], { maxBuffer: 1 << 30 });
    const x = new Float32Array(dec.stdout.buffer, dec.stdout.byteOffset, dec.stdout.byteLength / 4);
    console.log(fmtStats(id, stats(x)));
    for (let t = 0; t < x.length / FS; t += 5) {
      const seg = x.subarray(Math.round(t * FS), Math.min(x.length, Math.round((t + 5) * FS)));
      const s = stats(seg);
      console.log(`  ${t.toFixed(0).padStart(3)}–${(t + 5).toFixed(0).padEnd(3)} peak ${s.peak.toFixed(2)} rms ${s.rmsDb.toFixed(1)} dB  centroid ${Math.round(s.centroid)} Hz  ${s.env}`);
    }
  } else {
    console.error("usage: bun tools/analyze.ts sfx [names…] | voices [ids…] | mp3 <segment-id> | whisper <segment-id>  [--wav dir] [--whisper]");
    process.exit(2);
  }
}
