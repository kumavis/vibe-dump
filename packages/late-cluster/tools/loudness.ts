/**
 * Loudness and true peak at 48 kHz: integrated loudness per ITU-R BS.1770 (K-weighting, 400 ms
 * blocks with 75 % overlap, −70 LUFS absolute and −10 LU relative gates), and a 4× oversampled
 * true-peak estimate (windowed-sinc interpolation between samples).
 */
import { spawnSync } from "node:child_process";

function biquad(x: Float32Array, b: number[], a: number[]): Float32Array {
  const y = new Float32Array(x.length);
  let x1 = 0, x2 = 0, y1 = 0, y2 = 0;
  for (let i = 0; i < x.length; i++) {
    const v = b[0] * x[i] + b[1] * x1 + b[2] * x2 - a[1] * y1 - a[2] * y2;
    x2 = x1, x1 = x[i], y2 = y1, y1 = v;
    y[i] = v;
  }
  return y;
}

/** K-weighting at 48 kHz (BS.1770 stage 1 shelf + stage 2 high-pass) */
function kWeight(x: Float32Array): Float32Array {
  const s1 = biquad(x, [1.53512485958697, -2.69169618940638, 1.19839281085285], [1, -1.69065929318241, 0.73248077421585]);
  return biquad(s1, [1, -2, 1], [1, -1.99004745483398, 0.99007225036621]);
}

/**
 * Integrated loudness (LUFS) of a stereo signal; `ranges` (seconds) restricts it to those spans
 * (e.g. dialogue lines), gated the same way.
 */
export function lufs(L: Float32Array, R: Float32Array, fs = 48000, ranges?: [number, number][]): number {
  const kl = kWeight(L), kr = kWeight(R);
  const B = Math.round(0.4 * fs), H = Math.round(0.1 * fs);
  const blocks: number[] = [];
  for (let i = 0; i + B <= kl.length; i += H) {
    if (ranges) {
      const t = (i + B / 2) / fs;
      if (!ranges.some(([a, b]) => t >= a && t <= b)) continue;
    }
    let s = 0;
    for (let j = i; j < i + B; j++) s += kl[j] * kl[j] + kr[j] * kr[j];
    blocks.push(s / B);
  }
  const L_ = (ms: number) => -0.691 + 10 * Math.log10(ms + 1e-30);
  const abs = blocks.filter((m) => L_(m) > -70);
  if (!abs.length) return -Infinity;
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const rel = L_(mean(abs)) - 10;
  const gated = abs.filter((m) => L_(m) > rel);
  return L_(mean(gated.length ? gated : abs));
}

// 4× oversampling: 3 fractional phases, 8 taps each side, Hann-windowed sinc
const TAPS = 8;
const PHASES = [0.25, 0.5, 0.75].map((f) => {
  const h: number[] = [];
  for (let k = -TAPS + 1; k <= TAPS; k++) {
    const t = k - f;
    const sinc = Math.abs(t) < 1e-9 ? 1 : Math.sin(Math.PI * t) / (Math.PI * t);
    const w = 0.5 + 0.5 * Math.cos((Math.PI * t) / (TAPS + 0.5));
    h.push(sinc * w);
  }
  return h;
});

/** per-sample true-peak magnitude: max(|x[i]|, the interpolated peaks between i and i+1) */
export function truePeakTrack(x: Float32Array): Float32Array {
  const n = x.length;
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    let m = Math.abs(x[i]);
    if (m > 0.25 || (i + 1 < n && Math.abs(x[i + 1]) > 0.25)) {
      for (const h of PHASES) {
        let s = 0;
        for (let k = -TAPS + 1, j = 0; k <= TAPS; k++, j++) {
          const idx = i + k;
          if (idx >= 0 && idx < n) s += x[idx] * h[j];
        }
        m = Math.max(m, Math.abs(s));
      }
    }
    out[i] = m;
  }
  return out;
}

export function truePeak(L: Float32Array, R: Float32Array): number {
  let p = 0;
  for (const x of [L, R]) for (const v of truePeakTrack(x)) p = Math.max(p, v);
  return p;
}

/** decode an mp3 (or anything ffmpeg reads) to stereo float at 48 kHz */
export function decodeStereo(file: string): { L: Float32Array; R: Float32Array } {
  const dec = spawnSync("ffmpeg", ["-v", "error", "-i", file, "-f", "f32le", "-ac", "2", "-ar", "48000", "pipe:1"], { maxBuffer: 1 << 30 });
  const pcm = new Float32Array(dec.stdout.buffer, dec.stdout.byteOffset, dec.stdout.byteLength / 4);
  const n = pcm.length / 2;
  const L = new Float32Array(n), R = new Float32Array(n);
  for (let i = 0; i < n; i++) (L[i] = pcm[2 * i]), (R[i] = pcm[2 * i + 1]);
  return { L, R };
}
