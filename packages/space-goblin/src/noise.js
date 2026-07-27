// Deterministic value/gradient noise. Everything in this app — textures,
// terrain, scatter placement, animation jitter — is generated from these, so
// the whole scene is reproducible from a single seed and ships zero assets.

/** 32-bit integer hash (PCG-ish finalizer). Returns a uint32. */
export function hashU32(x) {
  x = (x ^ 61) ^ (x >>> 16)
  x = (x + (x << 3)) | 0
  x = x ^ (x >>> 4)
  x = Math.imul(x, 0x27d4eb2d)
  x = x ^ (x >>> 15)
  return x >>> 0
}

/** Hash of an integer lattice point -> [0,1). */
export function hash2(x, y) {
  return hashU32(Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263)) / 4294967296
}

export function hash3(x, y, z) {
  return (
    hashU32(
      Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 2147483647),
    ) / 4294967296
  )
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

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a, b, t) => a + (b - a) * t

/** Value noise, 2D. Domain is unbounded; period ~ integer lattice. */
export function noise2(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = fade(xf)
  const v = fade(yf)
  const a = hash2(xi, yi)
  const b = hash2(xi + 1, yi)
  const c = hash2(xi, yi + 1)
  const d = hash2(xi + 1, yi + 1)
  return lerp(lerp(a, b, u), lerp(c, d, u), v)
}

/** Value noise, 3D. */
export function noise3(x, y, z) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const zi = Math.floor(z)
  const xf = x - xi
  const yf = y - yi
  const zf = z - zi
  const u = fade(xf)
  const v = fade(yf)
  const w = fade(zf)
  const n = (i, j, k) => hash3(xi + i, yi + j, zi + k)
  const x00 = lerp(n(0, 0, 0), n(1, 0, 0), u)
  const x10 = lerp(n(0, 1, 0), n(1, 1, 0), u)
  const x01 = lerp(n(0, 0, 1), n(1, 0, 1), u)
  const x11 = lerp(n(0, 1, 1), n(1, 1, 1), u)
  return lerp(lerp(x00, x10, v), lerp(x01, x11, v), w)
}

/** Fractal Brownian motion over noise2. Returns roughly [0,1]. */
export function fbm2(x, y, octaves = 5, lacunarity = 2.0, gain = 0.5) {
  let sum = 0
  let amp = 1
  let norm = 0
  let fx = x
  let fy = y
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise2(fx, fy)
    norm += amp
    amp *= gain
    fx *= lacunarity
    fy *= lacunarity
  }
  return sum / norm
}

export function fbm3(x, y, z, octaves = 4, lacunarity = 2.0, gain = 0.5) {
  let sum = 0
  let amp = 1
  let norm = 0
  let s = 1
  for (let i = 0; i < octaves; i++) {
    sum += amp * noise3(x * s, y * s, z * s)
    norm += amp
    amp *= gain
    s *= lacunarity
  }
  return sum / norm
}

/** Ridged multifractal — sharp creases, good for rock and scar tissue. */
export function ridge2(x, y, octaves = 5) {
  let sum = 0
  let amp = 0.5
  let norm = 0
  let s = 1
  for (let i = 0; i < octaves; i++) {
    const n = 1 - Math.abs(noise2(x * s, y * s) * 2 - 1)
    sum += amp * n * n
    norm += amp
    amp *= 0.5
    s *= 2
  }
  return sum / norm
}

/**
 * Worley / cellular noise on a 2D grid. Returns { f1, f2, id } where f1 is the
 * distance to the nearest feature point, f2 to the second nearest, and id is a
 * stable [0,1) value per cell — handy for scale/plate/leather patterns.
 */
export function worley2(x, y) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  let f1 = 1e9
  let f2 = 1e9
  let id = 0
  for (let j = -1; j <= 1; j++) {
    for (let i = -1; i <= 1; i++) {
      const cx = xi + i
      const cy = yi + j
      const px = cx + hash2(cx, cy)
      const py = cy + hash2(cx + 9871, cy - 4231)
      const dx = px - x
      const dy = py - y
      const d = Math.sqrt(dx * dx + dy * dy)
      if (d < f1) {
        f2 = f1
        f1 = d
        id = hash2(cx * 3 + 7, cy * 5 - 3)
      } else if (d < f2) {
        f2 = d
      }
    }
  }
  return { f1, f2, id }
}

/** Tiling value noise with integer period `p` — seamless texture tiles. */
export function tileNoise2(x, y, p) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = fade(xf)
  const v = fade(yf)
  const m = (n) => ((n % p) + p) % p
  const h = (i, j) => hash2(m(xi + i), m(yi + j))
  return lerp(lerp(h(0, 0), h(1, 0), u), lerp(h(0, 1), h(1, 1), u), v)
}

export function tileFbm2(x, y, p, octaves = 5, gain = 0.5) {
  let sum = 0
  let amp = 1
  let norm = 0
  let s = 1
  for (let i = 0; i < octaves; i++) {
    sum += amp * tileNoise2(x * s, y * s, p * s)
    norm += amp
    amp *= gain
    s *= 2
  }
  return sum / norm
}

export const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
export const smoothstep = (a, b, t) => {
  const x = clamp01((t - a) / (b - a))
  return x * x * (3 - 2 * x)
}
