// Seeded randomness.
//
// Every musical decision the machine makes runs through one of these, so a
// (seed + settings) pair always reproduces the exact same performance — which
// is what makes "save the JSON and play it again" honest rather than
// approximate.

/** mulberry32 — small, fast, good enough for music. */
export function makeRng(seed) {
  let a = seed >>> 0
  const rng = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  /** Uniform in [lo, hi). */
  rng.range = (lo, hi) => lo + rng() * (hi - lo)

  /** Integer in [lo, hi] inclusive. */
  rng.int = (lo, hi) => Math.floor(lo + rng() * (hi - lo + 1))

  /** True with probability p. */
  rng.chance = (p) => rng() < p

  /** Uniform pick from an array. */
  rng.pick = (arr) => arr[Math.floor(rng() * arr.length)]

  /**
   * Weighted pick. `weights` parallels `arr`; entries need not sum to 1.
   * Falls back to the last item if the weights are degenerate.
   */
  rng.weighted = (arr, weights) => {
    let total = 0
    for (const w of weights) total += Math.max(0, w)
    if (total <= 0) return arr[arr.length - 1]
    let roll = rng() * total
    for (let i = 0; i < arr.length; i++) {
      roll -= Math.max(0, weights[i])
      if (roll <= 0) return arr[i]
    }
    return arr[arr.length - 1]
  }

  /** Approximately normal, mean 0, sd 1 (sum of 3 uniforms — cheap, bounded). */
  rng.normal = () => {
    const s = rng() + rng() + rng() - 1.5
    return s * 1.1547
  }

  /** Normal, clamped to +-3 sd, scaled. */
  rng.gauss = (mean, sd) => mean + Math.max(-3, Math.min(3, rng.normal())) * sd

  return rng
}

/** A seed from the clock, for "give me something new". */
export function randomSeed() {
  return (Math.floor(Math.random() * 0xffffffff) ^ Date.now()) >>> 0
}

/** Human-typable seed strings ("hollow-reed-42") hash to a stable number. */
export function hashSeed(str) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}
