// Seeded RNG + coordinate hashing/noise. ARCHITECT-OWNED, fully implemented.
// The simulation uses ONLY ctx.rng (an RNG instance). Never Math.random in sim code.
// Renderer decoration should use hash2() so visuals are stable per tile.

/** Mulberry32 step: returns a function producing uint32s. */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return (t ^ (t >>> 14)) >>> 0
  }
}

/** Deterministic RNG with helpers. State is a single uint32 (`state`), so it can be saved/restored. */
export class RNG {
  /** @param {number} seed */
  constructor(seed = 1) { this.state = seed >>> 0 }
  /** @returns {number} uint32 */
  nextU32() {
    this.state = (this.state + 0x6d2b79f5) >>> 0
    let t = this.state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return (t ^ (t >>> 14)) >>> 0
  }
  /** @returns {number} float in [0, 1) */
  float() { return this.nextU32() / 4294967296 }
  /** @returns {number} integer in [0, n) ; n >= 1 */
  int(n) { return (this.float() * n) | 0 }
  /** @returns {number} integer in [lo, hi] inclusive */
  range(lo, hi) { return lo + this.int(hi - lo + 1) }
  /** @returns {number} float in [lo, hi) */
  frange(lo, hi) { return lo + this.float() * (hi - lo) }
  /** @returns {boolean} true with probability p */
  chance(p) { return this.float() < p }
  /** @template T @param {ArrayLike<T>} arr @returns {T} */
  pick(arr) { return arr[this.int(arr.length)] }
  /** Weighted index pick. @param {ArrayLike<number>} weights @returns {number} index (or -1 if all zero) */
  weighted(weights) {
    let total = 0
    for (let i = 0; i < weights.length; i++) total += weights[i]
    if (total <= 0) return -1
    let r = this.float() * total
    for (let i = 0; i < weights.length; i++) { r -= weights[i]; if (r < 0) return i }
    return weights.length - 1
  }
  /** Independent child stream (does not advance this one in a seed-dependent way beyond one draw). */
  fork(salt = 0) { return new RNG((this.nextU32() ^ Math.imul(salt + 1, 0x9e3779b1)) >>> 0) }
}

/** Stable uint32 hash of an integer pair + seed (for per-tile decoration, noise lattice). */
export function hash2(x, y, seed = 0) {
  let h = (Math.imul(x | 0, 0x27d4eb2d) ^ Math.imul(y | 0, 0x165667b1) ^ Math.imul(seed | 0, 0x9e3779b1)) >>> 0
  h = Math.imul(h ^ (h >>> 15), 0x85ebca6b)
  h = Math.imul(h ^ (h >>> 13), 0xc2b2ae35)
  return (h ^ (h >>> 16)) >>> 0
}

/** hash2 mapped to [0, 1). */
export function hash01(x, y, seed = 0) { return hash2(x, y, seed) / 4294967296 }

/** Smooth value noise in [0, 1) at float coords (lattice spacing 1). */
export function valueNoise(x, y, seed = 0) {
  const x0 = Math.floor(x), y0 = Math.floor(y)
  const fx = x - x0, fy = y - y0
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
  const a = hash01(x0, y0, seed), b = hash01(x0 + 1, y0, seed)
  const c = hash01(x0, y0 + 1, seed), d = hash01(x0 + 1, y0 + 1, seed)
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sy
}

/** Fractal value noise in [0, 1): `octaves` layers, base frequency `freq` (cycles per tile). */
export function fbm(x, y, seed = 0, octaves = 4, freq = 1 / 32) {
  let amp = 1, sum = 0, norm = 0, f = freq
  for (let o = 0; o < octaves; o++) {
    sum += valueNoise(x * f, y * f, seed + o * 1013) * amp
    norm += amp
    amp *= 0.5
    f *= 2
  }
  return sum / norm
}
