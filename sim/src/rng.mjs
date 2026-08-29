// Seeded PRNG + the distributions the population generator needs.
// Everything in the model draws from one of these so a run is reproducible
// from its seed alone.

export function makeRng (seed) {
  let a = seed >>> 0
  let spare = null
  const next = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  const rng = {
    next,
    // uniform in [lo, hi)
    uniform: (lo, hi) => lo + next() * (hi - lo),
    // integer in [0, n)
    int: (n) => Math.floor(next() * n),
    bool: (p) => next() < p,
    // Box-Muller, keeping the second variate. This is called tens of millions
    // of times per run by the feed, so the spare is worth holding on to.
    normal: (mean = 0, sd = 1) => {
      if (spare !== null) {
        const value = spare
        spare = null
        return mean + sd * value
      }
      let u = 0
      let v = 0
      while (u === 0) u = next()
      while (v === 0) v = next()
      const r = Math.sqrt(-2 * Math.log(u))
      const theta = 2 * Math.PI * v
      spare = r * Math.sin(theta)
      return mean + sd * r * Math.cos(theta)
    },
    lognormal: (median, sigma) => median * Math.exp(sigma * rng.normal(0, 1)),
    // Marsaglia-Tsang
    gamma: (shape) => {
      if (shape < 1) return rng.gamma(shape + 1) * Math.pow(next(), 1 / shape)
      const d = shape - 1 / 3
      const c = 1 / Math.sqrt(9 * d)
      for (;;) {
        let x, v
        do {
          x = rng.normal(0, 1)
          v = 1 + c * x
        } while (v <= 0)
        v = v * v * v
        const u = next()
        if (u < 1 - 0.0331 * x * x * x * x) return d * v
        if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v
      }
    },
    beta: (alpha, betaParam) => {
      const x = rng.gamma(alpha)
      const y = rng.gamma(betaParam)
      return x / (x + y)
    },
    // A trait centred on `mean` with `concentration` controlling tightness.
    // concentration 4 is loose, 30 is tight.
    trait: (mean, concentration = 12) => {
      const m = clamp(mean, 0.02, 0.98)
      return clamp(rng.beta(m * concentration, (1 - m) * concentration), 0, 1)
    },
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    // Sample `count` distinct indices in [0, n) — fine for small counts.
    sampleIndices: (n, count) => {
      const out = new Set()
      const want = Math.min(count, n)
      let guard = 0
      while (out.size < want && guard++ < want * 20) out.add(Math.floor(next() * n))
      return [...out]
    },
    // Sample one index with probability proportional to weights[i].
    weightedIndex: (weights, total) => {
      let r = next() * (total ?? weights.reduce((s, w) => s + w, 0))
      for (let i = 0; i < weights.length; i++) {
        r -= weights[i]
        if (r <= 0) return i
      }
      return weights.length - 1
    },
    shuffle: (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(next() * (i + 1))
        const t = arr[i]; arr[i] = arr[j]; arr[j] = t
      }
      return arr
    }
  }

  return rng
}

export const clamp = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x)
export const clamp01 = (x) => clamp(x, 0, 1)
