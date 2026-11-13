// Seeded randomness for the kit. Every "hand-cut irregularity" in a panel must
// be reproducible from its seed: a museum label, a screenshot test and a
// specialist tuning one motif all need the same vessel twice. So nothing in the
// kit may call Math.random — take an Rng (or a seed) instead.

/** mulberry32: tiny, fast, good enough for layout jitter. Returns () => [0,1). */
export function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** FNV-1a, so string labels ("leiwen", "panel:front") can derive sub-seeds. */
export function hashString(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Mix two integers into a new 32-bit seed (splitmix-style avalanche). */
export function mixSeed(a, b) {
  let h = (a >>> 0) ^ Math.imul((b >>> 0) + 0x9e3779b9, 0x85ebca6b)
  h ^= h >>> 16
  h = Math.imul(h, 0x7feb352d)
  h ^= h >>> 15
  h = Math.imul(h, 0x846ca68b)
  h ^= h >>> 16
  return h >>> 0
}

export class Rng {
  constructor(seed = 1) {
    this.seed = typeof seed === 'string' ? hashString(seed) : seed >>> 0
    this._next = mulberry32(this.seed)
  }
  /** uniform [0,1) */
  next() {
    return this._next()
  }
  /** uniform [a,b) */
  range(a, b) {
    return a + (b - a) * this._next()
  }
  /** integer in [a,b] inclusive */
  int(a, b) {
    return a + Math.floor((b - a + 1) * this._next())
  }
  /** symmetric jitter in [-amount, amount] */
  jitter(amount) {
    return (this._next() * 2 - 1) * amount
  }
  /** approx. normal(0,1) — sum of uniforms is plenty for tool-mark noise */
  gauss() {
    return this._next() + this._next() + this._next() + this._next() - 2
  }
  chance(p) {
    return this._next() < p
  }
  pick(arr) {
    return arr[Math.floor(this._next() * arr.length)]
  }
  /**
   * An independent child stream. Forking by label (not by draw order) means a
   * specialist can add draws to one motif without reshuffling every other one.
   */
  fork(label) {
    return new Rng(mixSeed(this.seed, typeof label === 'string' ? hashString(label) : label >>> 0))
  }
}

export function rng(seed) {
  return seed instanceof Rng ? seed : new Rng(seed)
}
