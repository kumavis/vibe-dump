// All the sim's randomness (ENGINEERING.md §2): seeded from the battle id and
// the moment id, so a sortie replays in one browser engine. Streams are
// forked by name, so one subsystem drawing more numbers does not shift
// another's: the damage model's dice do not depend on how many shells flew.

/** A 32-bit hash of a string (FNV-1a with a final mix). */
export function hashString(s) {
  let h = 2166136261 >>> 0
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619) >>> 0
  }
  h ^= h >>> 16
  h = Math.imul(h, 2246822507) >>> 0
  h ^= h >>> 13
  return h >>> 0
}

/** mulberry32 */
function stream(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function createRng(seed) {
  const base = typeof seed === 'number' ? seed >>> 0 : hashString(String(seed))
  const next = stream(base)
  let spare = null
  const rng = {
    seed: base,
    /** [0, 1) */
    next,
    /** a standard normal (Box–Muller) */
    gauss() {
      if (spare !== null) {
        const s = spare
        spare = null
        return s
      }
      let u = 0
      while (u === 0) u = next()
      const v = next()
      const r = Math.sqrt(-2 * Math.log(u))
      spare = r * Math.sin(2 * Math.PI * v)
      return r * Math.cos(2 * Math.PI * v)
    },
    /** a uniform in [a, b) */
    uniform(a, b) {
      return a + (b - a) * next()
    },
    /** an integer from a range [lo, hi] (inclusive), or the number itself */
    range(r) {
      if (Array.isArray(r)) {
        const lo = Math.min(r[0], r[1] ?? r[0])
        const hi = Math.max(r[0], r[1] ?? r[0])
        return lo + Math.floor(next() * (hi - lo + 1))
      }
      return Number.isFinite(r) ? r : 0
    },
    /** true with probability p */
    chance(p) {
      return next() < p
    },
    pick(arr) {
      return arr[Math.floor(next() * arr.length)]
    },
    /** an independent stream named from this one's seed */
    fork(name) {
      return createRng(hashString(`${base}:${name}`))
    },
    /** a Poisson count with mean m (small m) */
    poisson(m) {
      if (m <= 0) return 0
      const L = Math.exp(-m)
      let k = 0
      let p = 1
      do {
        k++
        p *= next()
      } while (p > L && k < 50)
      return k - 1
    },
  }
  return rng
}
