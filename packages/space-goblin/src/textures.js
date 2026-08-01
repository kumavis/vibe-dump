// Procedural PBR texture lab. Every surface in the scene is painted here from
// canvas pixels — zero image assets, zero network requests.
//
// Shape of every maker:
//   1. a *coarse* pass (~size/8) fills float buffers with the smooth, expensive
//      multi-octave fields — tone, blotches, domain warp;
//   2. a *macro* pass (size/2) upsamples those and adds the structural layers
//      that need resolution — cellular pores/plates/cracks, ridged wrinkles —
//      compositing colour, height, roughness, metalness;
//   3. a *micro* pass at full resolution upsamples the macro buffers and adds
//      the pixel-scale detail that must stay crisp: grain, weave, brush
//      streaks, stamped scratches;
//   4. the height buffer is run through a wrapping Sobel to get the normal map.
// Running the costly noise on 1/64th (coarse) and 1/4th (macro) of the pixels
// is what keeps a full 1024² set inside a frame or two.
//
// Everything wraps: all lattice lookups are taken modulo an integer period, so
// the tiles are seamless at any `repeat`. Hot loops deliberately avoid array
// allocation — colours are carried as three scalars.

import * as THREE from 'three'
import { hashU32, hash2, makeRng, tileNoise2, tileFbm2, clamp01, smoothstep } from './noise.js'

// ---------------------------------------------------------------------------
// Salted, anisotropic, tiling noise
// ---------------------------------------------------------------------------
// noise.js's tile helpers are seed-independent and isotropic. Textures need
// per-seed variety *and* stretched domains (wrinkles, brushed metal, wind
// drifts), so these mirror them with (a) a salt folded into the lattice hash
// and (b) separate x/y periods. Any constant offset added to the domain keeps
// the period intact, which is why the domain-warping below stays seamless.

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a, b, t) => a + (b - a) * t
const wrapi = (n, p) => ((n % p) + p) % p

/** Salted lattice hash -> [0,1). */
function lat(x, y, salt) {
  return (
    hashU32(
      Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(salt | 0, 2654435761),
    ) / 4294967296
  )
}

/** Value noise with independent integer periods on x and y. */
function tnoise(x, y, px, py, salt) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const u = fade(x - xi)
  const v = fade(y - yi)
  // one modulo per axis: the neighbour is the wrapped index plus one, folded
  const x0 = wrapi(xi, px)
  const x1 = x0 + 1 === px ? 0 : x0 + 1
  const y0 = wrapi(yi, py)
  const y1 = y0 + 1 === py ? 0 : y0 + 1
  const a = lat(x0, y0, salt)
  const b = lat(x1, y0, salt)
  const c = lat(x0, y1, salt)
  const d = lat(x1, y1, salt)
  return lerp(lerp(a, b, u), lerp(c, d, u), v)
}

/** fbm over tnoise. Each octave doubles both periods, so they stay integral. */
function tfbm(x, y, px, py, oct, salt, gain = 0.5) {
  let sum = 0
  let amp = 1
  let norm = 0
  let s = 1
  for (let i = 0; i < oct; i++) {
    sum += amp * tnoise(x * s, y * s, px * s, py * s, salt + i * 977)
    norm += amp
    amp *= gain
    s *= 2
  }
  return sum / norm
}

/** Ridged multifractal — sharp creases (wrinkles, cracks). */
function tridge(x, y, px, py, oct, salt) {
  let sum = 0
  let amp = 0.5
  let norm = 0
  let s = 1
  for (let i = 0; i < oct; i++) {
    const n = 1 - Math.abs(tnoise(x * s, y * s, px * s, py * s, salt + i * 131) * 2 - 1)
    sum += amp * n * n
    norm += amp
    amp *= 0.5
    s *= 2
  }
  return sum / norm
}

// Cellular results are handed back in a scratch object: these run millions of
// times and a fresh object literal per call would dominate the budget.
const W = { f1: 0, f2: 0, id: 0 }
const MX = new Int32Array(3)
const MY = new Int32Array(3)

/** Worley with the *cell* coordinates wrapped, so the pattern tiles. */
function tworley(x, y, px, py, salt) {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  // wrapped column/row indices only depend on one axis each: six modulos for
  // the 3x3 neighbourhood instead of eighteen
  MX[1] = wrapi(xi, px)
  MX[0] = MX[1] === 0 ? px - 1 : MX[1] - 1
  MX[2] = MX[1] + 1 === px ? 0 : MX[1] + 1
  MY[1] = wrapi(yi, py)
  MY[0] = MY[1] === 0 ? py - 1 : MY[1] - 1
  MY[2] = MY[1] + 1 === py ? 0 : MY[1] + 1
  let f1 = 1e9
  let f2 = 1e9
  let id = 0
  for (let j = -1; j <= 1; j++) {
    const cy = yi + j
    const my = MY[j + 1]
    for (let i = -1; i <= 1; i++) {
      const cx = xi + i
      const mx = MX[i + 1]
      // the feature offset is hashed from the *wrapped* cell but the point is
      // placed at the *unwrapped* cell — that is what makes the seam vanish
      const fxp = cx + lat(mx, my, salt)
      const fyp = cy + lat(mx + 9871, my - 4231, salt)
      const dx = fxp - x
      const dy = fyp - y
      const d = dx * dx + dy * dy
      if (d < f1) {
        f2 = f1
        f1 = d
        id = lat(mx * 3 + 7, my * 5 - 3, salt)
      } else if (d < f2) {
        f2 = d
      }
    }
  }
  W.f1 = Math.sqrt(f1)
  W.f2 = Math.sqrt(f2)
  W.id = id
  return W
}

// ---------------------------------------------------------------------------
// Canvas / texture plumbing
// ---------------------------------------------------------------------------

function newCanvas(size) {
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  return c
}

function canvasFromRGBA(size, data) {
  const c = newCanvas(size)
  c.getContext('2d').putImageData(new ImageData(data, size, size), 0, 0)
  return c
}

function toTexture(canvas, srgb = false) {
  const t = new THREE.CanvasTexture(canvas)
  t.wrapS = THREE.RepeatWrapping
  t.wrapT = THREE.RepeatWrapping
  t.anisotropy = 8
  if (srgb) t.colorSpace = THREE.SRGBColorSpace
  t.needsUpdate = true
  return t
}

/** '#rrggbb' -> [r,g,b] bytes. */
function rgb(hex) {
  const n = parseInt(String(hex).replace('#', ''), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

// ---------------------------------------------------------------------------
// Height -> tangent-space normal map (wrapping Sobel)
// ---------------------------------------------------------------------------

/**
 * Sobel the red channel of a grayscale height canvas into an OpenGL-convention
 * normal map. Sampling wraps, so a tiling height map yields a tiling normal
 * map. The result stays in the default (linear) colour space — it is data.
 */
export function heightToNormal(heightCanvas, strength = 2.0) {
  const size = heightCanvas.width
  const src = heightCanvas
    .getContext('2d', { willReadFrequently: true })
    .getImageData(0, 0, size, size).data
  const h = new Float32Array(size * size)
  for (let i = 0; i < h.length; i++) h[i] = src[i * 4] / 255
  return sobelNormal(size, h, strength)
}

/**
 * Internal fast path: the makers already hold their heights as floats, so they
 * skip the grayscale canvas round-trip (two full-resolution passes) entirely.
 */
function sobelNormal(size, h, strength) {
  const out = new Uint8ClampedArray(size * size * 4)
  for (let y = 0; y < size; y++) {
    const r0 = (y === 0 ? size - 1 : y - 1) * size
    const r1 = y * size
    const r2 = (y === size - 1 ? 0 : y + 1) * size
    for (let x = 0; x < size; x++) {
      const xm = x === 0 ? size - 1 : x - 1
      const xp = x === size - 1 ? 0 : x + 1
      const tl = h[r0 + xm]
      const tc = h[r0 + x]
      const tr = h[r0 + xp]
      const ml = h[r1 + xm]
      const mr = h[r1 + xp]
      const bl = h[r2 + xm]
      const bc = h[r2 + x]
      const br = h[r2 + xp]
      const gx = tr + 2 * mr + br - (tl + 2 * ml + bl)
      const gy = bl + 2 * bc + br - (tl + 2 * tc + tr)
      // image rows run downward but tangent +Y runs up the UV, hence +gy
      const nx = -gx * strength
      const ny = gy * strength
      const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1)
      const p = (r1 + x) * 4
      out[p] = (nx * inv * 0.5 + 0.5) * 255
      out[p + 1] = (ny * inv * 0.5 + 0.5) * 255
      out[p + 2] = (inv * 0.5 + 0.5) * 255
      out[p + 3] = 255
    }
  }
  return toTexture(canvasFromRGBA(size, out))
}

// ---------------------------------------------------------------------------
// Memoisation
// ---------------------------------------------------------------------------
// Texture sets are expensive and many materials share one, so each maker caches
// by a JSON key of its resolved options. Cached entries are never auto-disposed
// — disposeTextureSet is the caller's explicit opt-out.

const caches = new Map()

function memo(name, opts, build) {
  let store = caches.get(name)
  if (!store) caches.set(name, (store = new Map()))
  const key = JSON.stringify(opts)
  let hit = store.get(key)
  if (!hit) store.set(key, (hit = build()))
  return hit
}

/** Dispose every texture a maker returned. */
export function disposeTextureSet(set) {
  if (!set) return
  for (const k of Object.keys(set)) {
    const t = set[k]
    if (t && typeof t.dispose === 'function') t.dispose()
  }
}

// ---------------------------------------------------------------------------
// Buffer upsampling
// ---------------------------------------------------------------------------
// Consecutive passes need the same bilinear weights for five or six buffers, so
// the weights are computed once per pixel into these module-level slots and
// each buffer is read with `tap()`. No per-pixel closures, no allocation.

let _i00 = 0
let _i10 = 0
let _i01 = 0
let _i11 = 0
let _w00 = 0
let _w10 = 0
let _w01 = 0
let _w11 = 0

function setTap(n, u, v) {
  const gx = u * n
  const gy = v * n
  const x0 = gx | 0
  const y0 = gy | 0
  const fx = gx - x0
  const fy = gy - y0
  const x1 = x0 + 1 === n ? 0 : x0 + 1
  const y1 = y0 + 1 === n ? 0 : y0 + 1
  _i00 = y0 * n + x0
  _i10 = y0 * n + x1
  _i01 = y1 * n + x0
  _i11 = y1 * n + x1
  _w00 = (1 - fx) * (1 - fy)
  _w10 = fx * (1 - fy)
  _w01 = (1 - fx) * fy
  _w11 = fx * fy
}

function tap(b) {
  return b[_i00] * _w00 + b[_i10] * _w10 + b[_i01] * _w01 + b[_i11] * _w11
}

const buf = (n) => new Float32Array(n * n)

// ---------------------------------------------------------------------------
// Goblin skin — sallow olive hide, pebbled pores, wrinkles, glowing freckles
// ---------------------------------------------------------------------------

const SKIN_BASE = rgb('#5f7a52')
const SKIN_DEEP = rgb('#34452f')
const SKIN_BRUISE = rgb('#7a4a6a')
const SKIN_SCAR = rgb('#a8ad8a')
const SKIN_GLOW = rgb('#48e8ff')

export function makeGoblinSkin({ size = 1024, seed = 7 } = {}) {
  return memo('skin', { size, seed }, () => buildSkin(size, seed))
}

function buildSkin(size, seed) {
  const nl = Math.max(32, size >> 3)
  const nh = size >> 1
  const s = (seed | 0) * 977 + 13
  const rng = makeRng(seed * 7919 + 1)

  // Scar slashes are a handful of toroidal capsules; tapering by the projection
  // parameter keeps them from reading as full-length wires across the tile.
  const slashes = []
  for (let k = 0; k < 5; k++) {
    const a = rng() * Math.PI
    const len = 0.07 + rng() * 0.14
    const dx = Math.cos(a) * len
    const dy = Math.sin(a) * len
    slashes.push({
      x: rng(),
      y: rng(),
      dx,
      dy,
      len2: dx * dx + dy * dy,
      w: 0.006 + rng() * 0.007,
    })
  }

  // ---- coarse tier: smooth fields ----
  const cWx = buf(nl)
  const cWy = buf(nl)
  const cTone = buf(nl)
  const cBruise = buf(nl)
  const cStretch = buf(nl)
  const cClust = buf(nl)
  for (let j = 0; j < nl; j++) {
    const v = j / nl
    for (let i = 0; i < nl; i++) {
      const u = i / nl
      const p = j * nl + i
      cWx[p] = tfbm(u * 4, v * 4, 4, 4, 3, s + 11) - 0.5
      cWy[p] = tfbm(u * 4 + 3.1, v * 4 + 7.7, 4, 4, 3, s + 12) - 0.5
      cTone[p] = tfbm(u * 5, v * 5, 5, 5, 4, s + 1)
      cBruise[p] = tfbm(u * 3, v * 3, 3, 3, 3, s + 2)
      cStretch[p] = tfbm(u * 5 + 1.3, v * 5 + 4.1, 5, 5, 3, s + 3)
      cClust[p] = tfbm(u * 7, v * 7, 7, 7, 3, s + 6)
    }
  }

  // ---- macro tier: pores, wrinkles, scars, freckles ----
  const mr = buf(nh)
  const mg = buf(nh)
  const mb = buf(nh)
  const mh = buf(nh)
  const mo = buf(nh)
  const me = buf(nh)

  for (let j = 0; j < nh; j++) {
    const v = j / nh
    for (let i = 0; i < nh; i++) {
      const u = i / nh
      const p = j * nh + i
      setTap(nl, u, v)
      const wx = tap(cWx)
      const wy = tap(cWy)
      const tone = tap(cTone)
      const bruise = tap(cBruise)
      const stretch = tap(cStretch)
      const cluster = smoothstep(0.46, 0.64, tap(cClust))

      // mid-scale mottle bridges the gap between the coarse tier and the pores
      const mid = tnoise(u * 26 + wx * 5, v * 26 + wy * 5, 26, 26, s + 8)

      // pebbled pores: cellular bumps, radius jittered per cell
      const pw = tworley(u * 64 + wx * 2, v * 64 + wy * 2, 64, 64, s + 4)
      const bump = smoothstep(0.42 + pw.id * 0.22, 0.06, pw.f1)

      // stretched wrinkle lines: 4:1 anisotropic domain -> long thin creases
      const wr = tridge(u * 36 + wx * 8, v * 9 + wy * 2, 36, 9, 3, s + 5)
      const crease = smoothstep(0.4, 0.9, wr)

      let scar = 0
      for (let k = 0; k < slashes.length; k++) {
        const sl = slashes[k]
        let px = u - sl.x
        let py = v - sl.y
        px -= Math.round(px)
        py -= Math.round(py)
        let t = (px * sl.dx + py * sl.dy) / sl.len2
        t = t < 0 ? 0 : t > 1 ? 1 : t
        const qx = px - sl.dx * t
        const qy = py - sl.dy * t
        const d = Math.sqrt(qx * qx + qy * qy) / sl.w
        // taper the ends so a slash looks torn, not drawn
        const taper = 0.35 + 0.65 * Math.sin(Math.PI * t)
        const a = (1 - smoothstep(0.45 * taper, 1.05 * taper, d)) * taper
        if (a > scar) scar = a
      }

      const t = clamp01(
        0.24 + tone * 0.44 + (mid - 0.5) * 0.34 + bump * 0.48 - crease * 0.6 - pw.id * 0.1,
      )
      let cr = SKIN_DEEP[0] + (SKIN_BASE[0] - SKIN_DEEP[0]) * t
      let cg = SKIN_DEEP[1] + (SKIN_BASE[1] - SKIN_DEEP[1]) * t
      let cb = SKIN_DEEP[2] + (SKIN_BASE[2] - SKIN_DEEP[2]) * t
      // bruised-purple subsurface blooms under the thinner patches of hide
      const br = smoothstep(0.44, 0.78, bruise + (mid - 0.5) * 0.25) * 0.6
      cr += (SKIN_BRUISE[0] - cr) * br
      cg += (SKIN_BRUISE[1] - cg) * br
      cb += (SKIN_BRUISE[2] - cb) * br
      if (scar > 0) {
        const sa = scar * 0.85
        cr += (SKIN_SCAR[0] - cr) * sa
        cg += (SKIN_SCAR[1] - cg) * sa
        cb += (SKIN_SCAR[2] - cb) * sa
      }

      mr[p] = cr
      mg[p] = cg
      mb[p] = cb
      mh[p] = clamp01(0.5 + bump * 0.3 - crease * 0.32 + (tone - 0.5) * 0.14 + scar * 0.12)
      // high overall, glossier where the hide is stretched taut or scarred over
      mo[p] = clamp01(0.88 + (tone - 0.5) * 0.14 - stretch * 0.2 - scar * 0.22)

      // bioluminescent freckles: the blotchy cluster mask gates sparse cell
      // dots, so they clump instead of dusting the whole body evenly
      if (cluster > 0.01) {
        const fw = tworley(u * 72, v * 72, 72, 72, s + 7)
        const keep = fw.id > 0.58 ? 1 : 0
        me[p] = cluster * keep * smoothstep(0.34, 0.08, fw.f1) * (0.4 + fw.id * 0.6)
      }
    }
  }

  // ---- micro tier ----
  const alb = new Uint8ClampedArray(size * size * 4)
  const rou = new Uint8ClampedArray(size * size * 4)
  const emi = new Uint8ClampedArray(size * size * 4)
  const hgt = new Float32Array(size * size)

  for (let j = 0; j < size; j++) {
    const v = j / size
    for (let i = 0; i < size; i++) {
      const p = (j * size + i) * 4
      setTap(nh, i / size, v)
      // sub-pore speckle; survives a mip level and kills any plastic look
      const g = hash2(i * 3 + seed, j * 7 - seed) - 0.5
      const lum = 1 + g * 0.15
      alb[p] = tap(mr) * lum
      alb[p + 1] = tap(mg) * lum
      alb[p + 2] = tap(mb) * lum
      alb[p + 3] = 255
      const ro = clamp01(tap(mo) + g * 0.08) * 255
      rou[p] = ro
      rou[p + 1] = ro
      rou[p + 2] = ro
      rou[p + 3] = 255
      const e = clamp01(tap(me) * (1 + g * 0.3))
      emi[p] = SKIN_GLOW[0] * e
      emi[p + 1] = SKIN_GLOW[1] * e
      emi[p + 2] = SKIN_GLOW[2] * e
      emi[p + 3] = 255
      hgt[j * size + i] = clamp01(tap(mh) + g * 0.06)
    }
  }

  return {
    map: toTexture(canvasFromRGBA(size, alb), true),
    normalMap: sobelNormal(size, hgt, 2.2),
    roughnessMap: toTexture(canvasFromRGBA(size, rou)),
    emissiveMap: toTexture(canvasFromRGBA(size, emi)),
  }
}

// ---------------------------------------------------------------------------
// Leather — cracked scavenged hide, worn plates, stitch rows
// ---------------------------------------------------------------------------

export function makeLeather({ size = 512, seed = 11, color = '#4a3324', wear = 0.5 } = {}) {
  return memo('leather', { size, seed, color, wear }, () => buildLeather(size, seed, color, wear))
}

function buildLeather(size, seed, color, wear) {
  const nl = Math.max(32, size >> 3)
  const nh = size >> 1
  const s = (seed | 0) * 977 + 29
  const rng = makeRng(seed * 6151 + 5)
  const base = rgb(color)
  const dark = [base[0] * 0.3, base[1] * 0.3, base[2] * 0.32]
  const worn = [
    Math.min(255, base[0] * 1.6 + 30),
    Math.min(255, base[1] * 1.55 + 27),
    Math.min(255, base[2] * 1.5 + 22),
  ]

  // Stitch rows: hole spacing is an integer subdivision of the tile so the row
  // wraps cleanly around the seam.
  const rows = []
  for (let k = 0; k < 3; k++) {
    rows.push({ v: rng(), holes: 24 + ((rng() * 3) | 0) * 8, r: 0.0075 + rng() * 0.003 })
  }

  const cWx = buf(nl)
  const cWy = buf(nl)
  const cRub = buf(nl)
  const cGrime = buf(nl)
  for (let j = 0; j < nl; j++) {
    const v = j / nl
    for (let i = 0; i < nl; i++) {
      const u = i / nl
      const p = j * nl + i
      cWx[p] = tfbm(u * 3, v * 3, 3, 3, 3, s + 11) - 0.5
      cWy[p] = tfbm(u * 3 + 5.3, v * 3 + 1.9, 3, 3, 3, s + 12) - 0.5
      cRub[p] = smoothstep(0.42, 0.84, tfbm(u * 5, v * 5, 5, 5, 4, s + 3))
      cGrime[p] = tileFbm2(u * 4 + 0.37, v * 4 + 0.91, 4, 4)
    }
  }

  const mr = buf(nh)
  const mg = buf(nh)
  const mb = buf(nh)
  const mh = buf(nh)
  const mo = buf(nh)

  for (let j = 0; j < nh; j++) {
    const v = j / nh
    for (let i = 0; i < nh; i++) {
      const u = i / nh
      const p = j * nh + i
      setTap(nl, u, v)
      const wx = tap(cWx)
      const wy = tap(cWy)
      const rub = clamp01(tap(cRub) * wear * 1.7)
      const grime = tap(cGrime)

      // plates: f2-f1 collapses to zero along the cell walls -> dark grout
      const pw = tworley(u * 12 + wx * 2.4, v * 12 + wy * 2.4, 12, 12, s + 1)
      const grout = 1 - smoothstep(0.0, 0.16, pw.f2 - pw.f1)
      // secondary crazing inside each plate
      const fine = tworley(u * 34 + wx * 3, v * 34 + wy * 3, 34, 34, s + 2)
      const hair = (1 - smoothstep(0.0, 0.1, fine.f2 - fine.f1)) * 0.55

      const dome = smoothstep(0.02, 0.42, pw.f1) // plate centres sit proud
      const t = clamp01(0.4 + (pw.id - 0.5) * 0.32 + dome * 0.42 - grout - hair * 0.8)
      let cr = dark[0] + (base[0] - dark[0]) * t
      let cg = dark[1] + (base[1] - dark[1]) * t
      let cb = dark[2] + (base[2] - dark[2]) * t
      // wear bleaches the proud parts of the plates first
      const wa = clamp01(rub * (0.2 + dome * 0.9)) * 0.75
      cr += (worn[0] - cr) * wa
      cg += (worn[1] - cg) * wa
      cb += (worn[2] - cb) * wa
      const ga = clamp01((grime - 0.5) * 0.3 + 0.08)
      cr += (dark[0] - cr) * ga
      cg += (dark[1] - cg) * ga
      cb += (dark[2] - cb) * ga

      let h = clamp01(0.52 + dome * 0.32 - grout * 0.5 - hair * 0.35 + (pw.id - 0.5) * 0.1)
      let ro = clamp01(0.84 - rub * dome * 0.42 + (grime - 0.5) * 0.15)

      // stitch holes: dark punctures ringed by a raised lip
      for (let k = 0; k < rows.length; k++) {
        const r = rows[k]
        let dv = v - r.v
        dv -= Math.round(dv)
        if (dv < -0.05 || dv > 0.05) continue
        const fu = u * r.holes
        const du = (fu - Math.floor(fu) - 0.5) / r.holes
        const d = Math.sqrt(du * du + dv * dv)
        const hole = 1 - smoothstep(r.r * 0.55, r.r, d)
        const lip = smoothstep(r.r * 1.9, r.r * 1.05, d) * (1 - hole)
        if (hole > 0 || lip > 0) {
          const ha = hole * 0.9
          cr += (dark[0] - cr) * ha
          cg += (dark[1] - cg) * ha
          cb += (dark[2] - cb) * ha
          h = clamp01(h - hole * 0.42 + lip * 0.14)
          ro = clamp01(ro + hole * 0.12)
        }
      }

      mr[p] = cr
      mg[p] = cg
      mb[p] = cb
      mh[p] = h
      mo[p] = ro
    }
  }

  const alb = new Uint8ClampedArray(size * size * 4)
  const rou = new Uint8ClampedArray(size * size * 4)
  const hgt = new Float32Array(size * size)

  for (let j = 0; j < size; j++) {
    const v = j / size
    for (let i = 0; i < size; i++) {
      const p = (j * size + i) * 4
      setTap(nh, i / size, v)
      const g = hash2(i * 5 + seed, j * 11 + seed) - 0.5
      const lum = 1 + g * 0.16
      alb[p] = tap(mr) * lum
      alb[p + 1] = tap(mg) * lum
      alb[p + 2] = tap(mb) * lum
      alb[p + 3] = 255
      const ro = clamp01(tap(mo) + g * 0.1) * 255
      rou[p] = ro
      rou[p + 1] = ro
      rou[p + 2] = ro
      rou[p + 3] = 255
      hgt[j * size + i] = clamp01(tap(mh) + g * 0.05)
    }
  }

  return {
    map: toTexture(canvasFromRGBA(size, alb), true),
    normalMap: sobelNormal(size, hgt, 2.6),
    roughnessMap: toTexture(canvasFromRGBA(size, rou)),
  }
}

// ---------------------------------------------------------------------------
// Canvas cloth — plain weave, slubs, grime, optional woven stripe
// ---------------------------------------------------------------------------

export function makeCanvasCloth({ size = 512, seed = 13, color = '#7a4a2a', stripe = null } = {}) {
  return memo('cloth', { size, seed, color, stripe }, () => buildCloth(size, seed, color, stripe))
}

function buildCloth(size, seed, color, stripe) {
  const nh = size >> 2
  const s = (seed | 0) * 977 + 41
  const base = rgb(color)
  const band = stripe ? rgb(stripe) : null
  const dirtCol = [58, 46, 36]
  const THREAD = 4 // px per thread — weave period is 8px, so size % 8 === 0
  const tn = size / THREAD

  // Per-thread irregularity (slubs). A thread's thickness and tone are constant
  // along its whole length, which is exactly what sells a woven look.
  const slubX = new Float32Array(tn)
  const slubY = new Float32Array(tn)
  for (let k = 0; k < tn; k++) {
    slubX[k] = 0.91 + tnoise(k * 0.25, 0.5, tn * 0.25, 1, s + 21) * 0.15 + hash2(k, seed) * 0.06
    slubY[k] = 0.91 + tnoise(0.5, k * 0.25, 1, tn * 0.25, s + 22) * 0.15 + hash2(k, seed + 99) * 0.06
  }

  const mr = buf(nh)
  const mg = buf(nh)
  const mb = buf(nh)
  const mo = buf(nh)
  const md = buf(nh) // dirt/fray, also dents the height

  for (let j = 0; j < nh; j++) {
    const v = j / nh
    for (let i = 0; i < nh; i++) {
      const u = i / nh
      const p = j * nh + i

      const grime = tfbm(u * 3, v * 3, 3, 3, 4, s + 1)
      const drift = tileFbm2(u * 6 + 0.21, v * 6 + 0.63, 6, 4)
      const fray = smoothstep(0.62, 0.92, tfbm(u * 9, v * 9, 9, 9, 4, s + 2))

      let cr = base[0]
      let cg = base[1]
      let cb = base[2]
      if (band) {
        // woven accent: a wide band plus a thin pinstripe reads as selvedge
        let dv = v - 0.5
        dv -= Math.round(dv)
        const adv = dv < 0 ? -dv : dv
        const w = clamp01(smoothstep(0.085, 0.065, adv) + smoothstep(0.021, 0.012, adv)) * 0.92
        cr += (band[0] - cr) * w
        cg += (band[1] - cg) * w
        cb += (band[2] - cb) * w
      }
      const ga = clamp01((grime - 0.42) * 0.95)
      cr *= 1 - ga * 0.55
      cg *= 1 - ga * 0.58
      cb *= 1 - ga * 0.62
      const fa = fray * 0.5
      cr += (dirtCol[0] - cr) * fa
      cg += (dirtCol[1] - cg) * fa
      cb += (dirtCol[2] - cb) * fa
      const lum = 0.94 + drift * 0.24

      mr[p] = cr * lum
      mg[p] = cg * lum
      mb[p] = cb * lum
      mo[p] = clamp01(0.9 - drift * 0.1 + fray * 0.06)
      md[p] = fray
    }
  }

  const alb = new Uint8ClampedArray(size * size * 4)
  const rou = new Uint8ClampedArray(size * size * 4)
  const hgt = new Float32Array(size * size)

  for (let j = 0; j < size; j++) {
    const v = j / size
    const ty = (j / THREAD) | 0
    const fy = ((j % THREAD) + 0.5) / THREAD
    const py = 1 - (2 * fy - 1) * (2 * fy - 1) // rounded weft cross-section
    for (let i = 0; i < size; i++) {
      const p = (j * size + i) * 4
      const tx = (i / THREAD) | 0
      const fx = ((i % THREAD) + 0.5) / THREAD
      const px = 1 - (2 * fx - 1) * (2 * fx - 1)
      // plain weave: warp floats over weft on alternating blocks
      const over = (tx ^ ty) & 1
      const prof = over ? px : py
      const slub = over ? slubX[tx] : slubY[ty]
      // the under-thread sits in shadow, the over-thread catches the light
      const weave = (0.58 + 0.42 * prof) * (over ? 1.0 : 0.8) * slub

      setTap(nh, i / size, v)
      const g = hash2(i * 7 + seed, j * 13 + seed) - 0.5
      const dirt = tap(md)
      const lum = weave * (1 + g * 0.13)
      alb[p] = tap(mr) * lum
      alb[p + 1] = tap(mg) * lum
      alb[p + 2] = tap(mb) * lum
      alb[p + 3] = 255
      const ro = clamp01(tap(mo) + g * 0.08 - prof * 0.05) * 255
      rou[p] = ro
      rou[p + 1] = ro
      rou[p + 2] = ro
      rou[p + 3] = 255
      hgt[j * size + i] = clamp01(
        0.5 + (over ? 0.16 : -0.1) + prof * 0.3 * slub - dirt * 0.12 + g * 0.05,
      )
    }
  }

  return {
    map: toTexture(canvasFromRGBA(size, alb), true),
    normalMap: sobelNormal(size, hgt, 1.8),
    roughnessMap: toTexture(canvasFromRGBA(size, rou)),
  }
}

// ---------------------------------------------------------------------------
// Metal — brushed gunmetal, dents, rust bloom, scratches, hazard stripes
// ---------------------------------------------------------------------------

const RUST_A = rgb('#7a3d1c')
const RUST_B = rgb('#a4602c')
const HAZARD = rgb('#ffab3d')
const HAZARD_DARK = rgb('#14100c')

export function makeMetal({
  size = 512,
  seed = 17,
  base = '#6a7078',
  rust = 0.35,
  scratch = 0.6,
  hazard = false,
} = {}) {
  return memo('metal', { size, seed, base, rust, scratch, hazard }, () =>
    buildMetal(size, seed, base, rust, scratch, hazard),
  )
}

function buildMetal(size, seed, baseHex, rust, scratch, hazard) {
  const nl = Math.max(32, size >> 3)
  const nh = size >> 1
  const s = (seed | 0) * 977 + 53
  const rng = makeRng(seed * 3253 + 9)
  const base = rgb(baseHex)
  const bright = [
    Math.min(255, base[0] * 1.5 + 46),
    Math.min(255, base[1] * 1.5 + 46),
    Math.min(255, base[2] * 1.5 + 48),
  ]

  // Deep scratches are *stamped*, not sampled: short tapered arcs walked one
  // column at a time. Wrapping the column index makes them tile for free and
  // costs a single array read per pixel in the micro pass.
  const scr = new Float32Array(size * size)
  const count = Math.round(scratch * 26)
  for (let k = 0; k < count; k++) {
    const y0 = rng() * size
    const slope = (rng() - 0.5) * 0.55
    const a1 = (0.6 + rng() * 5) * (size / 512)
    const a2 = (0.3 + rng() * 2) * (size / 512)
    const f1 = 0.05 + rng() * 0.14
    const f2 = 0.18 + rng() * 0.4
    const p1 = rng() * 6.283
    const p2 = rng() * 6.283
    const i0 = (rng() * size) | 0
    const len = 24 + ((rng() * rng() * size * 0.75) | 0)
    const halfW = 0.55 + rng() * 1.3
    const deep = 0.3 + rng() * 0.7
    for (let t = 0; t < len; t++) {
      // fade both ends so a scratch starts and stops instead of ringing the tile
      const e = smoothstep(0, 8, t) * smoothstep(0, 12, len - t)
      if (e <= 0.001) continue
      const i = wrapi(i0 + t, size)
      const yc = y0 + slope * t + Math.sin(t * f1 + p1) * a1 + Math.sin(t * f2 + p2) * a2
      const lo = Math.floor(yc - halfW - 1)
      const hi = Math.ceil(yc + halfW + 1)
      for (let y = lo; y <= hi; y++) {
        const d = y - yc
        const a = (1 - smoothstep(halfW * 0.35, halfW + 0.7, d < 0 ? -d : d)) * deep * e
        if (a <= 0) continue
        const idx = wrapi(y, size) * size + i
        if (a > scr[idx]) scr[idx] = a
      }
    }
  }

  const cBlotch = buf(nl)
  const cJitter = buf(nl)
  for (let j = 0; j < nl; j++) {
    const v = j / nl
    for (let i = 0; i < nl; i++) {
      const u = i / nl
      const p = j * nl + i
      cBlotch[p] = tfbm(u * 5, v * 5, 5, 5, 4, s + 3)
      cJitter[p] = tfbm(u * 6, v * 6, 6, 6, 3, s + 5) - 0.5
    }
  }

  const mr = buf(nh)
  const mg = buf(nh)
  const mb = buf(nh)
  const mh = buf(nh)
  const mo = buf(nh)
  const mm = buf(nh)

  const rustEdge = 0.76 - rust * 0.46
  for (let j = 0; j < nh; j++) {
    const v = j / nh
    for (let i = 0; i < nh; i++) {
      const u = i / nh
      const p = j * nh + i
      setTap(nl, u, v)
      const blotch = tap(cBlotch)
      const jitter = tap(cJitter)

      // dents: shallow cellular dishes, and only some cells are actually dented
      const dw = tworley(u * 9, v * 9, 9, 9, s + 1)
      const dent = dw.id > 0.55 ? smoothstep(0.5, 0.05, dw.f1) * (dw.id - 0.55) * 2.2 : 0

      // coarse brush banding — stretched 1:32 so it reads as horizontal grain
      const brush = tfbm(u * 4, v * 128, 4, 128, 3, s + 2)
      // fine granular noise used to ragged up the rust boundary
      const rustGrain = tfbm(u * 26, v * 26, 26, 26, 3, s + 4)
      const rustM = smoothstep(rustEdge, rustEdge + 0.1, blotch + (rustGrain - 0.5) * 0.3 + dent * 0.2)

      const bt = clamp01(0.3 + (brush - 0.5) * 0.9)
      let cr = base[0] * 0.86 + (bright[0] - base[0] * 0.86) * bt
      let cg = base[1] * 0.86 + (bright[1] - base[1] * 0.86) * bt
      let cb = base[2] * 0.88 + (bright[2] - base[2] * 0.88) * bt
      const da = dent * 0.7
      cr *= 1 - da * 0.45
      cg *= 1 - da * 0.45
      cb *= 1 - da * 0.42

      let ro = clamp01(0.36 + (brush - 0.5) * 0.28 + dent * 0.18)
      let me = 1 - dent * 0.15
      let h = clamp01(0.62 - dent * 0.38 + (brush - 0.5) * 0.06)

      // a rust bloom bleeds a brown stain into the metal ahead of the crust
      const stain = smoothstep(rustEdge - 0.16, rustEdge + 0.02, blotch) * (1 - rustM) * 0.5
      if (stain > 0) {
        cr += (RUST_A[0] * 0.9 - cr) * stain
        cg += (RUST_A[1] * 0.9 - cg) * stain
        cb += (RUST_A[2] * 0.9 - cb) * stain
        ro = clamp01(ro + stain * 0.3)
      }

      if (rustM > 0) {
        // the crust itself is granular, not a flat decal: tone and brightness
        // both wander with the fine grain
        const rl = 0.68 + rustGrain * 0.66
        const rr = (RUST_A[0] + (RUST_B[0] - RUST_A[0]) * rustGrain) * rl
        const rg = (RUST_A[1] + (RUST_B[1] - RUST_A[1]) * rustGrain) * rl
        const rb = (RUST_A[2] + (RUST_B[2] - RUST_A[2]) * rustGrain) * rl
        const ra = rustM * (0.72 + rustGrain * 0.28)
        cr += (rr - cr) * ra
        cg += (rg - cg) * ra
        cb += (rb - cb) * ra
        // rust is a dielectric crust: it kills metalness, spikes roughness and
        // eats a little material away
        me = lerp(me, 0.04, rustM)
        ro = lerp(ro, clamp01(0.86 + rustGrain * 0.12), rustM)
        h = clamp01(h - rustM * 0.1 + rustGrain * rustM * 0.14)
      }

      if (hazard) {
        // 45° stripes: (u+v)*8 wraps because 8 is an integer
        const ph = (u + v) * 8 + jitter * 0.16
        const f = ph - Math.floor(ph)
        const amber = f < 0.5
        const edge = amber ? Math.min(f, 0.5 - f) : Math.min(f - 0.5, 1 - f)
        // paint chips off at the stripe boundaries and wherever it is scuffed
        const paint = clamp01(
          smoothstep(0.0, 0.03, edge) * (1 - smoothstep(0.5, 0.72, rustGrain + rustM * 0.4)),
        )
        if (paint > 0) {
          const pc = amber ? HAZARD : HAZARD_DARK
          const pa = paint * 0.94
          cr += (pc[0] - cr) * pa
          cg += (pc[1] - cg) * pa
          cb += (pc[2] - cb) * pa
          me = lerp(me, 0.0, paint)
          ro = lerp(ro, 0.52, paint)
          h = clamp01(h + paint * 0.05)
        }
      }

      mr[p] = cr
      mg[p] = cg
      mb[p] = cb
      mh[p] = h
      mo[p] = ro
      mm[p] = me
    }
  }

  const alb = new Uint8ClampedArray(size * size * 4)
  const rou = new Uint8ClampedArray(size * size * 4)
  const met = new Uint8ClampedArray(size * size * 4)
  const hgt = new Float32Array(size * size)

  // Fine brush streaks: white noise that is constant along a row, so one lookup
  // per row buys perfectly anisotropic grain at zero per-pixel cost.
  const row = new Float32Array(size)
  for (let j = 0; j < size; j++) {
    row[j] = (hash2(j, seed) * 0.6 + hash2(j >> 1, seed + 7) * 0.4 - 0.5) * 2
  }

  for (let j = 0; j < size; j++) {
    const v = j / size
    const rs = row[j]
    for (let i = 0; i < size; i++) {
      const p = (j * size + i) * 4
      const q = j * size + i
      setTap(nh, i / size, v)
      const g = hash2(i * 11 + seed, j * 17 + seed) - 0.5
      const sc = scr[q]
      const streak = 1 + rs * 0.09 + g * 0.05

      let r0 = tap(mr) * streak
      let g0 = tap(mg) * streak
      let b0 = tap(mb) * streak
      let ro = clamp01(tap(mo) + rs * 0.07 + g * 0.05)
      let me = tap(mm)
      let h = clamp01(tap(mh) + rs * 0.02 + g * 0.03)

      if (sc > 0) {
        // a scratch cuts through paint and rust down to raw bright metal
        r0 = lerp(r0, bright[0] * 1.05, sc)
        g0 = lerp(g0, bright[1] * 1.05, sc)
        b0 = lerp(b0, bright[2] * 1.05, sc)
        ro = lerp(ro, 0.16, sc)
        me = lerp(me, 1, sc)
        h = clamp01(h - sc * 0.16)
      }

      alb[p] = r0
      alb[p + 1] = g0
      alb[p + 2] = b0
      alb[p + 3] = 255
      const rb = ro * 255
      rou[p] = rb
      rou[p + 1] = rb
      rou[p + 2] = rb
      rou[p + 3] = 255
      const mv = me * 255
      met[p] = mv
      met[p + 1] = mv
      met[p + 2] = mv
      met[p + 3] = 255
      hgt[q] = h
    }
  }

  return {
    map: toTexture(canvasFromRGBA(size, alb), true),
    normalMap: sobelNormal(size, hgt, 1.6),
    roughnessMap: toTexture(canvasFromRGBA(size, rou)),
    metalnessMap: toTexture(canvasFromRGBA(size, met)),
  }
}

// ---------------------------------------------------------------------------
// Emissive panel — circuit traces + alien glyphs on a near-black substrate
// ---------------------------------------------------------------------------

export function makeEmissivePanel({ size = 512, seed = 19, color = '#48e8ff', density = 1 } = {}) {
  return memo('panel', { size, seed, color, density }, () => buildPanel(size, seed, color, density))
}

function buildPanel(size, seed, colorHex, density) {
  const s = (seed | 0) * 977 + 67
  const rng = makeRng(seed * 4523 + 3)
  const glow = rgb(colorHex)

  // Routing grid. Each cell stores a bitmask of which of its four edges carry a
  // trace, so walks meet up into proper orthogonal runs with real corners
  // instead of random scribbles.
  const gn = 48
  const cell = new Uint8Array(gn * gn)
  const pad = new Uint8Array(gn * gn)
  const glyph = new Uint16Array(gn * gn)
  const BITS = [1, 4, 2, 8] // +x, +y, -x, -y
  const OPP = [2, 8, 1, 4]

  const walks = Math.max(6, Math.round(gn * 1.1 * density))
  for (let w = 0; w < walks; w++) {
    let cx = (rng() * gn) | 0
    let cy = (rng() * gn) | 0
    let dir = (rng() * 4) | 0
    const steps = 6 + ((rng() * 24) | 0)
    for (let k = 0; k < steps; k++) {
      if (rng() < 0.24) dir = (dir + (rng() < 0.5 ? 1 : 3)) & 3
      const nx = wrapi(cx + (dir === 0 ? 1 : dir === 2 ? -1 : 0), gn)
      const ny = wrapi(cy + (dir === 1 ? 1 : dir === 3 ? -1 : 0), gn)
      cell[cy * gn + cx] |= BITS[dir]
      cell[ny * gn + nx] |= OPP[dir]
      cx = nx
      cy = ny
    }
    if (rng() < 0.65) pad[cy * gn + cx] = 1
  }

  // alien glyph blocks: a 3x3 bit pattern stamped into a run of cells
  const glyphs = Math.max(2, Math.round(14 * density))
  for (let k = 0; k < glyphs; k++) {
    const gx = (rng() * gn) | 0
    const gy = (rng() * gn) | 0
    const gw = 1 + ((rng() * 3) | 0)
    for (let b = 0; b < gw; b++) {
      const idx = wrapi(gy, gn) * gn + wrapi(gx + b, gn)
      glyph[idx] = (hashU32(seed * 31 + k * 7 + b) & 0x1ff) | 0x200
    }
  }

  // Bloom: blur an occupancy grid a few times and sample it as a soft halo.
  let halo = new Float32Array(gn * gn)
  for (let i = 0; i < gn * gn; i++) halo[i] = cell[i] || pad[i] || glyph[i] ? 1 : 0
  let tmp = new Float32Array(gn * gn)
  for (let pass = 0; pass < 3; pass++) {
    for (let y = 0; y < gn; y++) {
      const y0 = (y === 0 ? gn - 1 : y - 1) * gn
      const y1 = (y === gn - 1 ? 0 : y + 1) * gn
      const yc = y * gn
      for (let x = 0; x < gn; x++) {
        const x0 = x === 0 ? gn - 1 : x - 1
        const x1 = x === gn - 1 ? 0 : x + 1
        tmp[yc + x] =
          (halo[y0 + x0] +
            halo[y0 + x] +
            halo[y0 + x1] +
            halo[yc + x0] +
            halo[yc + x] * 2 +
            halo[yc + x1] +
            halo[y1 + x0] +
            halo[y1 + x] +
            halo[y1 + x1]) /
          10
      }
    }
    const sw = halo
    halo = tmp
    tmp = sw
  }

  const alb = new Uint8ClampedArray(size * size * 4)
  const emi = new Uint8ClampedArray(size * size * 4)
  const sub = rgb('#0a0d12')
  const traceAlb = rgb('#1e2c34')
  const aa = 0.035
  const tw = 0.1 // trace half-width, in cell units

  for (let j = 0; j < size; j++) {
    const v = j / size
    const gy = v * gn
    const cyi = gy | 0
    const fy = gy - cyi
    for (let i = 0; i < size; i++) {
      const p = (j * size + i) * 4
      const u = i / size
      const gx = u * gn
      const cxi = gx | 0
      const fx = gx - cxi
      const idx = cyi * gn + cxi

      let trace = 0
      const m = cell[idx]
      if (m) {
        const dx = fx < 0.5 ? 0.5 - fx : fx - 0.5
        const dy = fy < 0.5 ? 0.5 - fy : fy - 0.5
        const bx = 1 - smoothstep(tw - aa, tw, dy)
        const by = 1 - smoothstep(tw - aa, tw, dx)
        if (m & 1 && fx >= 0.5 && bx > trace) trace = bx
        if (m & 2 && fx <= 0.5 && bx > trace) trace = bx
        if (m & 4 && fy >= 0.5 && by > trace) trace = by
        if (m & 8 && fy <= 0.5 && by > trace) trace = by
        // junction cap so a corner does not notch out
        const jc = bx < by ? bx : by
        if (jc > trace) trace = jc
      }
      if (pad[idx]) {
        const dx = fx - 0.5
        const dy = fy - 0.5
        const pv = 1 - smoothstep(0.24, 0.28, Math.sqrt(dx * dx + dy * dy))
        if (pv > trace) trace = pv
      }
      const gl = glyph[idx]
      if (gl) {
        const sx = (fx * 3) | 0
        const sy = (fy * 3) | 0
        const on = (gl >> (sy * 3 + sx)) & 1
        // inset each glyph pixel so the block reads as separate marks
        const ix = fx * 3 - sx
        const iy = fy * 3 - sy
        const gv =
          on *
          0.9 *
          smoothstep(0.14, 0.24, ix) *
          smoothstep(0.14, 0.24, 1 - ix) *
          smoothstep(0.14, 0.24, iy) *
          smoothstep(0.14, 0.24, 1 - iy)
        if (gv > trace) trace = gv
      }

      // substrate: dark, faintly mottled, with subtle panel seams
      const grime = tileNoise2(u * 8 + 0.31, v * 8 + 0.77, 8)
      const seamU = Math.abs(u * 4 - Math.floor(u * 4) - 0.5)
      const seamV = Math.abs(v * 4 - Math.floor(v * 4) - 0.5)
      const seam = (1 - smoothstep(0.47, 0.5, seamU > seamV ? seamU : seamV)) * 0.55
      const bl = 0.72 + grime * 0.55 + tnoise(u * 12, v * 12, 12, 12, s + 1) * 0.3 - seam
      let cr = sub[0] * bl
      let cg = sub[1] * bl
      let cb = sub[2] * bl
      if (trace > 0) {
        cr = lerp(cr, traceAlb[0], trace)
        cg = lerp(cg, traceAlb[1], trace)
        cb = lerp(cb, traceAlb[2], trace)
      }
      alb[p] = cr
      alb[p + 1] = cg
      alb[p + 2] = cb
      alb[p + 3] = 255

      setTap(gn, u, v)
      const bloom = tap(halo)
      const e = clamp01(trace + bloom * bloom * 0.55)
      emi[p] = glow[0] * e
      emi[p + 1] = glow[1] * e
      emi[p + 2] = glow[2] * e
      emi[p + 3] = 255
    }
  }

  return {
    map: toTexture(canvasFromRGBA(size, alb), true),
    emissiveMap: toTexture(canvasFromRGBA(size, emi)),
  }
}

// ---------------------------------------------------------------------------
// Regolith — alien ground: violet basalt, amber dust drifts, polygonal crazing
// ---------------------------------------------------------------------------

const REG_DARK = rgb('#221c2c')
const REG_MID = rgb('#3b3348')
const REG_DUST = rgb('#8f6f45')
const REG_CRACK = rgb('#120e18')

export function makeRegolith({ size = 1024, seed = 23 } = {}) {
  return memo('regolith', { size, seed }, () => buildRegolith(size, seed))
}

function buildRegolith(size, seed) {
  const nl = Math.max(32, size >> 3)
  const nh = size >> 1
  const s = (seed | 0) * 977 + 83

  const cWx = buf(nl)
  const cWy = buf(nl)
  const cRock = buf(nl)
  const cDust = buf(nl)
  for (let j = 0; j < nl; j++) {
    const v = j / nl
    for (let i = 0; i < nl; i++) {
      const u = i / nl
      const p = j * nl + i
      cWx[p] = tfbm(u * 3, v * 3, 3, 3, 3, s + 11) - 0.5
      cWy[p] = tfbm(u * 3 + 2.7, v * 3 + 8.1, 3, 3, 3, s + 12) - 0.5
      cRock[p] = tfbm(u * 7, v * 7, 7, 7, 3, s + 3)
      // wind-drifted dust: stretched 1:4 so the drifts streak across the flat
      cDust[p] = tfbm(u * 5, v * 12, 5, 12, 3, s + 4)
    }
  }

  const mr = buf(nh)
  const mg = buf(nh)
  const mb = buf(nh)
  const mh = buf(nh)
  const mo = buf(nh)

  for (let j = 0; j < nh; j++) {
    const v = j / nh
    for (let i = 0; i < nh; i++) {
      const u = i / nh
      const p = j * nh + i
      setTap(nl, u, v)
      const wx = tap(cWx)
      const wy = tap(cWy)
      const rockLo = tap(cRock)
      const drift = tap(cDust)

      // polygonal crazing: f2-f1 collapses along the cell boundaries
      const cw = tworley(u * 10 + wx * 2, v * 10 + wy * 2, 10, 10, s + 1)
      const crack = 1 - smoothstep(0.0, 0.09, cw.f2 - cw.f1)
      const cw2 = tworley(u * 26 + wx * 3, v * 26 + wy * 3, 26, 26, s + 2)
      const crack2 = (1 - smoothstep(0.0, 0.07, cw2.f2 - cw2.f1)) * 0.5

      const rock = clamp01(rockLo + (tnoise(u * 44, v * 44, 44, 44, s + 5) - 0.5) * 0.4)
      const dust = clamp01(smoothstep(0.44, 0.72, drift) * (0.55 + rock * 0.75))

      const t = clamp01(0.25 + rock * 0.85 + (cw.id - 0.5) * 0.3)
      let cr = REG_DARK[0] + (REG_MID[0] - REG_DARK[0]) * t
      let cg = REG_DARK[1] + (REG_MID[1] - REG_DARK[1]) * t
      let cb = REG_DARK[2] + (REG_MID[2] - REG_DARK[2]) * t
      const da = dust * 0.62
      cr += (REG_DUST[0] - cr) * da
      cg += (REG_DUST[1] - cg) * da
      cb += (REG_DUST[2] - cb) * da
      const ca = clamp01(crack + crack2) * 0.85
      cr += (REG_CRACK[0] - cr) * ca
      cg += (REG_CRACK[1] - cg) * ca
      cb += (REG_CRACK[2] - cb) * ca

      mr[p] = cr
      mg[p] = cg
      mb[p] = cb
      mh[p] = clamp01(0.58 + (rock - 0.5) * 0.3 + dust * 0.12 - (crack + crack2) * 0.5)
      mo[p] = clamp01(0.93 - dust * 0.06 + (crack + crack2) * 0.05)
    }
  }

  const alb = new Uint8ClampedArray(size * size * 4)
  const rou = new Uint8ClampedArray(size * size * 4)
  const hgt = new Float32Array(size * size)

  for (let j = 0; j < size; j++) {
    const v = j / size
    for (let i = 0; i < size; i++) {
      const p = (j * size + i) * 4
      setTap(nh, i / size, v)
      const g = hash2(i * 13 + seed, j * 19 + seed)
      // scattered grit: a couple of percent of pixels are chips or dark voids
      const chip = g > 0.982 ? (g - 0.982) * 55 : 0
      const hole = g < 0.014 ? 1 : 0
      const lum = 0.9 + (g - 0.5) * 0.22 + chip * 0.7 - hole * 0.35
      alb[p] = tap(mr) * lum + chip * 70
      alb[p + 1] = tap(mg) * lum + chip * 62
      alb[p + 2] = tap(mb) * lum + chip * 52
      alb[p + 3] = 255
      const ro = clamp01(tap(mo) + (g - 0.5) * 0.08 - chip * 0.3) * 255
      rou[p] = ro
      rou[p + 1] = ro
      rou[p + 2] = ro
      rou[p + 3] = 255
      hgt[j * size + i] = clamp01(tap(mh) + (g - 0.5) * 0.07 + chip * 0.2 - hole * 0.1)
    }
  }

  return {
    map: toTexture(canvasFromRGBA(size, alb), true),
    normalMap: sobelNormal(size, hgt, 2.0),
    roughnessMap: toTexture(canvasFromRGBA(size, rou)),
  }
}
