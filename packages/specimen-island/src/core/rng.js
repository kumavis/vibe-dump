// Seeded randomness. Everything procedural on the island draws from one of
// these so a given seed always grows the same jungle, herds and loot.

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// Stateless hash of integer coordinates -> [0, 1). Used where a chunk or cell
// must regenerate identically no matter what order it is visited in.
export function hash2(x, z, seed = 0) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(z | 0, 668265263) + Math.imul(seed | 0, 1442695041)) | 0
  h = Math.imul(h ^ (h >>> 13), 1274126177)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

export function hashString(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export class Rng {
  constructor(seed = 1) {
    this.seed = seed >>> 0
    this.next = mulberry32(this.seed)
  }
  range(a, b) {
    return a + (b - a) * this.next()
  }
  int(a, b) {
    // inclusive of both ends
    return a + Math.floor(this.next() * (b - a + 1))
  }
  chance(p) {
    return this.next() < p
  }
  pick(arr) {
    return arr[Math.floor(this.next() * arr.length)]
  }
  sign() {
    return this.next() < 0.5 ? -1 : 1
  }
  gauss() {
    // Box-Muller, one sample
    const u = 1 - this.next()
    const v = this.next()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  // Weighted pick from [{w, ...}] or a parallel weights array.
  weighted(items, weights) {
    let total = 0
    for (let i = 0; i < items.length; i++) total += weights ? weights[i] : items[i].w
    let r = this.next() * total
    for (let i = 0; i < items.length; i++) {
      r -= weights ? weights[i] : items[i].w
      if (r <= 0) return items[i]
    }
    return items[items.length - 1]
  }
  fork(salt) {
    return new Rng((this.seed ^ Math.imul(salt + 1, 2654435761)) >>> 0)
  }
}
