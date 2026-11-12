// Easing, tweening and deterministic randomness. Everything here is a pure function of its
// arguments so segment visuals stay a pure function of (segment, t) and seeking just works.

export const clamp = (x, lo = 0, hi = 1) => (x < lo ? lo : x > hi ? hi : x)
export const lerp = (a, b, u) => a + (b - a) * u
/** where x sits between a and b, clamped to 0..1 */
export const unlerp = (a, b, x) => clamp((x - a) / (b - a || 1e-9))
export const smoothstep = (a, b, x) => {
  const t = unlerp(a, b, x)
  return t * t * (3 - 2 * t)
}

export const ease = {
  linear: (u) => u,
  inQuad: (u) => u * u,
  outQuad: (u) => 1 - (1 - u) * (1 - u),
  inOutQuad: (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2),
  inCubic: (u) => u * u * u,
  outCubic: (u) => 1 - (1 - u) ** 3,
  inOutCubic: (u) => (u < 0.5 ? 4 * u * u * u : 1 - (-2 * u + 2) ** 3 / 2),
  outBack: (u) => {
    const c1 = 1.70158, c3 = c1 + 1
    return 1 + c3 * (u - 1) ** 3 + c1 * (u - 1) ** 2
  },
  outElastic: (u) => (u === 0 || u === 1 ? u : 2 ** (-10 * u) * Math.sin((u * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1),
  inOutSine: (u) => -(Math.cos(Math.PI * u) - 1) / 2,
}

/**
 * The value of a tween at time t: `from` until t0, `to` after t1, eased in between.
 * `e` is an easing function or a name from `ease`.
 */
export function tween(t, t0, t1, from = 0, to = 1, e = 'inOutCubic') {
  const f = typeof e === 'function' ? e : ease[e] || ease.inOutCubic
  return lerp(from, to, f(unlerp(t0, t1, t)))
}

/** 1 inside [t0, t1] with eased ramps of `fade` seconds on each side, 0 outside */
export function window01(t, t0, t1, fade = 0.3) {
  if (!(t1 > t0)) return 0
  return Math.min(smoothstep(t0 - fade * 0.5, t0 + fade * 0.5, t), 1 - smoothstep(t1 - fade * 0.5, t1 + fade * 0.5, t))
}

/** a decaying pulse: 1 at t = at, falling with time constant tau; 0 before */
export const pulse = (t, at, tau = 0.25) => (t < at ? 0 : Math.exp(-(t - at) / tau))

// ---------------------------------------------------------------- randomness

/** a fast seeded PRNG (mulberry32): returns a function giving floats in [0, 1) */
export function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** a string → 32-bit seed */
export function hashSeed(s) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/**
 * A seeded random source with helpers. `rng('skyline')` always gives the same sequence.
 *   const r = show.rng('confetti'); r(); r.range(2, 5); r.int(10); r.pick(arr); r.sign()
 */
export function rng(seed = 1) {
  const f = mulberry32(typeof seed === 'string' ? hashSeed(seed) : seed)
  const r = () => f()
  r.range = (a, b) => a + (b - a) * f()
  r.int = (n) => Math.floor(f() * n)
  r.pick = (arr) => arr[Math.floor(f() * arr.length)]
  r.sign = () => (f() < 0.5 ? -1 : 1)
  r.gauss = () => {
    const u = 1 - f(), v = f()
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
  }
  return r
}

/** a stateless hash of an integer and a seed → [0, 1) */
export function hash01(i, seed = 0) {
  let h = Math.imul((i | 0) ^ Math.imul(seed | 0, 0x9e3779b1), 0x85ebca6b)
  h ^= h >>> 13
  h = Math.imul(h, 0xc2b2ae35)
  h ^= h >>> 16
  return (h >>> 0) / 4294967296
}

/** smooth 1D value noise in [-1, 1], a pure function of x (use time for idle wobble) */
export function noise1(x, seed = 0) {
  const i = Math.floor(x), f = x - i
  const u = f * f * (3 - 2 * f)
  return lerp(hash01(i, seed), hash01(i + 1, seed), u) * 2 - 1
}
