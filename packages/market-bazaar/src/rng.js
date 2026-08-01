// Deterministic randomness. No Math.random() anywhere in src/ — every module
// derives its chances from these, so one seed reproduces the whole bazaar,
// characters, prices and ledger included (see docs/FRAMES.md).

/** 32-bit integer hash (PCG-ish finalizer). Returns a uint32. */
export function hashU32(x) {
  x = (x ^ 61) ^ (x >>> 16)
  x = (x + (x << 3)) | 0
  x = x ^ (x >>> 4)
  x = Math.imul(x, 0x27d4eb2d)
  x = x ^ (x >>> 15)
  return x >>> 0
}

/** Fold a string into a uint32 seed. */
export function hashString(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return hashU32(h)
}

/** Seeded PRNG (mulberry32). `rng()` -> [0,1). */
export function makeRng(seed = 1) {
  let a = (seed | 0) >>> 0 || 1
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Helpers over an rng() function. */
export const pick = (rng, arr) => arr[Math.floor(rng() * arr.length) % arr.length]
export const range = (rng, lo, hi) => lo + rng() * (hi - lo)
export const irange = (rng, lo, hi) => lo + Math.floor(rng() * (hi - lo + 1)) // inclusive
export const chance = (rng, p) => rng() < p

/** Value noise, 2D — for ground mottle, banner sway phases, etc. */
function hash2(x, y) {
  return hashU32(Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) / 4294967296
}
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a, b, t) => a + (b - a) * t

export function noise2(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const u = fade(x - xi)
  const v = fade(y - yi)
  return lerp(
    lerp(hash2(xi, yi), hash2(xi + 1, yi), u),
    lerp(hash2(xi, yi + 1), hash2(xi + 1, yi + 1), u),
    v,
  )
}

export function fbm2(x, y, octaves = 4, gain = 0.5) {
  let sum = 0
  let amp = 1
  let norm = 0
  let s = 1
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise2(x * s, y * s)
    norm += amp
    amp *= gain
    s *= 2
  }
  return sum / norm
}

export const clamp = (v, lo, hi) => (v < lo ? lo : v > hi ? hi : Number.isNaN(v) ? lo : v)
export const clamp01 = (v) => clamp(v, 0, 1)
export const smoothstep = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
