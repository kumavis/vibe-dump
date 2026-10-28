// garden.js — Monet's garden at Giverny, painted in Gaussian brush strokes.
//
// The layout is a composite of the paintings: the pink house with green
// shutters at the head of the grand allée (The Garden Path at Giverny, 1902),
// rose arches and nasturtiums spilling over the gravel, beds of violet irises
// (The Artist's Garden at Giverny, 1900), and the water garden with its green
// Japanese footbridge hung with wisteria, weeping willows and lily pads (The
// Water Lily Pond, 1899; the Water Lilies series).
//
// Nothing here is a mesh. Every surface is a scatter of oriented, elongated
// Gaussians — brush strokes — with the stroke direction chosen per subject
// (horizontal on water, hanging on willows, short dabs on flowers), colours
// "broken" by mixing two palette entries per dab, and light baked as a warm
// tint on lit faces and a cool lilac tint in shadow, which is what makes the
// result read as paint rather than geometry.
import * as THREE from 'three'
import { KIND } from './splats.js'

export function mulberry32(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const SUN = new THREE.Vector3(0.35, 0.8, 0.45).normalize()
export const WORLD_HALF = 46
export const POND = { cx: 2, cz: 22, rx: 18, rz: 9 }
export const BRIDGE = { x: -9, z0: 14, z1: 30, width: 1.9, rise: 1.15, base: 0.35 }

// Normalised ellipse distance from the pond centre: < 1 is water.
export function pondDist(x, z) {
  const dx = (x - POND.cx) / POND.rx, dz = (z - POND.cz) / POND.rz
  return Math.sqrt(dx * dx + dz * dz)
}

// Rolling hills beyond the hedge. Flat inside the garden, rising over the
// first fifty metres outside it into a loose, Monet-ish countryside.
const smoothstep = (a, b, t) => {
  const u = Math.min(1, Math.max(0, (t - a) / (b - a)))
  return u * u * (3 - 2 * u)
}
export function terrainY(x, z) {
  const d = Math.max(Math.abs(x), Math.abs(z)) - WORLD_HALF - 3
  if (d <= 0) return 0
  const ramp = smoothstep(0, 50, d)
  const big = 0.5 + 0.5 * Math.sin(x * 0.021 + 1.3) * Math.cos(z * 0.017 - 0.4)
  const mid = Math.sin(x * 0.055 + z * 0.02) * Math.cos(z * 0.047 - x * 0.013)
  return ramp * (5 + 15 * big + 4 * mid + 1.5 * Math.sin(x * 0.11) * Math.sin(z * 0.09))
}

export function onPath(x, z) {
  if (Math.abs(x) < 2.3 && z > -35 && z < 9) return true // the grand allée
  if (Math.abs(z - 7) < 1.6 && Math.abs(x) < 30) return true // cross path
  if (Math.abs(x - BRIDGE.x) < 1.6 && z > 7 && z < BRIDGE.z0 + 0.5) return true // down to the bridge
  if (Math.abs(x - BRIDGE.x) < 1.6 && z > BRIDGE.z1 - 0.5 && z < 40) return true // and away from it
  if (z > -35.8 && z < -33.4 && Math.abs(x) < 16) return true // in front of the house
  const e = pondDist(x, z)
  return e >= 1.06 && e < 1.18 // the walk around the pond
}

const to255 = (v) => Math.max(0, Math.min(255, Math.round(v * 255)))
const lerp = (a, b, t) => a + (b - a) * t
const UP = [0, 1, 0]
const X = [1, 0, 0]
const ZP = [0, 0, 1]

// Palettes lifted from the paintings. Each dab mixes two entries at random.
const PAL = {
  lawn: [[0.45, 0.62, 0.3], [0.55, 0.68, 0.35], [0.35, 0.55, 0.32], [0.6, 0.7, 0.3], [0.4, 0.58, 0.45], [0.5, 0.6, 0.55]],
  lawnShade: [[0.3, 0.45, 0.4], [0.35, 0.4, 0.55], [0.4, 0.5, 0.35], [0.45, 0.42, 0.6]],
  path: [[0.86, 0.74, 0.64], [0.8, 0.66, 0.72], [0.92, 0.82, 0.68], [0.72, 0.62, 0.72], [0.88, 0.78, 0.78]],
  water: [[0.2, 0.38, 0.5], [0.32, 0.44, 0.66], [0.18, 0.38, 0.34], [0.5, 0.48, 0.7], [0.26, 0.46, 0.42], [0.14, 0.27, 0.38]],
  reflect: [[0.5, 0.62, 0.3], [0.4, 0.55, 0.32], [0.65, 0.68, 0.38], [0.72, 0.62, 0.76], [0.3, 0.46, 0.34], [0.85, 0.72, 0.7]],
  willow: [[0.6, 0.7, 0.3], [0.45, 0.6, 0.3], [0.75, 0.78, 0.4], [0.35, 0.5, 0.3], [0.55, 0.65, 0.42]],
  canopy: [[0.35, 0.52, 0.3], [0.45, 0.6, 0.32], [0.3, 0.45, 0.4], [0.55, 0.65, 0.3]],
  poplar: [[0.3, 0.45, 0.38], [0.38, 0.52, 0.4], [0.42, 0.55, 0.32], [0.28, 0.4, 0.42]],
  blossom: [[0.95, 0.8, 0.85], [0.98, 0.92, 0.92], [0.92, 0.7, 0.78]],
  iris: [[0.5, 0.35, 0.75], [0.6, 0.45, 0.85], [0.4, 0.3, 0.7], [0.7, 0.5, 0.8], [0.35, 0.4, 0.8]],
  irisLeaf: [[0.4, 0.6, 0.35], [0.5, 0.65, 0.4], [0.35, 0.52, 0.42]],
  tulip: [[0.9, 0.25, 0.2], [0.95, 0.75, 0.2], [0.95, 0.9, 0.85], [0.9, 0.4, 0.6], [0.95, 0.55, 0.2]],
  poppy: [[0.92, 0.3, 0.15], [0.95, 0.4, 0.2], [0.85, 0.2, 0.2], [0.98, 0.5, 0.25]],
  peony: [[0.95, 0.7, 0.8], [0.98, 0.88, 0.9], [0.9, 0.55, 0.7], [0.96, 0.78, 0.72]],
  dahlia: [[0.85, 0.25, 0.5], [0.95, 0.55, 0.2], [0.95, 0.85, 0.3], [0.9, 0.35, 0.3], [0.8, 0.4, 0.7]],
  nasturtium: [[0.95, 0.5, 0.1], [0.98, 0.75, 0.2], [0.88, 0.32, 0.15], [0.95, 0.62, 0.15]],
  nastLeaf: [[0.32, 0.52, 0.3], [0.45, 0.6, 0.35], [0.38, 0.55, 0.4]],
  stem: [[0.35, 0.55, 0.3], [0.45, 0.6, 0.35]],
  rose: [[0.92, 0.4, 0.5], [0.85, 0.2, 0.3], [0.98, 0.8, 0.85], [0.95, 0.55, 0.6], [0.98, 0.95, 0.9]],
  wisteria: [[0.6, 0.5, 0.82], [0.75, 0.65, 0.9], [0.9, 0.85, 0.95], [0.5, 0.4, 0.72], [0.7, 0.55, 0.85]],
  lily: [[0.32, 0.48, 0.25], [0.45, 0.55, 0.3], [0.55, 0.5, 0.35], [0.4, 0.52, 0.4]],
  lilyFlower: [[0.95, 0.75, 0.85], [0.98, 0.95, 0.9], [0.9, 0.55, 0.7], [0.98, 0.85, 0.6]],
  petal: [[0.95, 0.75, 0.85], [0.98, 0.95, 0.9], [0.95, 0.85, 0.3], [0.95, 0.5, 0.2], [0.9, 0.35, 0.45]],
  leaf: [[0.9, 0.7, 0.2], [0.85, 0.5, 0.15], [0.7, 0.6, 0.25], [0.6, 0.65, 0.3]],
  housePink: [[0.93, 0.72, 0.7], [0.96, 0.8, 0.74], [0.88, 0.66, 0.7], [0.95, 0.76, 0.78]],
  shutter: [[0.33, 0.55, 0.4], [0.4, 0.6, 0.42]],
  glass: [[0.2, 0.3, 0.36], [0.25, 0.35, 0.4], [0.3, 0.4, 0.5]],
  slate: [[0.45, 0.5, 0.6], [0.5, 0.52, 0.62], [0.4, 0.45, 0.58], [0.55, 0.55, 0.66]],
  hedge: [[0.3, 0.48, 0.3], [0.38, 0.55, 0.32], [0.28, 0.42, 0.35]],
  bamboo: [[0.65, 0.72, 0.35], [0.55, 0.65, 0.3], [0.75, 0.78, 0.42]],
  bark: [[0.45, 0.4, 0.36], [0.52, 0.45, 0.4], [0.4, 0.36, 0.34]],
  bridge: [[0.5, 0.62, 0.52], [0.58, 0.68, 0.58], [0.45, 0.58, 0.5]],
  iron: [[0.25, 0.35, 0.3], [0.3, 0.4, 0.33]],
  cloud: [[0.98, 0.94, 0.95], [0.92, 0.9, 0.97]],
  dark: [[0.22, 0.28, 0.28], [0.26, 0.3, 0.32]],
  meadow: [[0.55, 0.66, 0.3], [0.65, 0.7, 0.35], [0.45, 0.6, 0.38], [0.7, 0.68, 0.4], [0.5, 0.62, 0.45]],
  hillFar: [[0.4, 0.52, 0.5], [0.45, 0.5, 0.64], [0.35, 0.5, 0.45], [0.55, 0.55, 0.66]],
  poppyField: [[0.9, 0.3, 0.2], [0.95, 0.42, 0.25], [0.8, 0.25, 0.3]],
  hillTree: [[0.25, 0.4, 0.3], [0.3, 0.45, 0.4], [0.22, 0.36, 0.36], [0.35, 0.5, 0.32]],
  hillBush: [[0.35, 0.5, 0.3], [0.42, 0.55, 0.35], [0.3, 0.45, 0.38]],
}

class Painter {
  constructor(store, rng) {
    this.store = store
    this.rng = rng
    this.q = new THREE.Quaternion()
    this.q2 = new THREE.Quaternion()
    this.n = new THREE.Vector3()
    this.e = new THREE.Vector3()
    this.d = new THREE.Vector3()
    this.c = new THREE.Vector3()
    this.zAxis = new THREE.Vector3(0, 0, 1)
    this.shadeSpots = [] // [x, z, radius]: tree crowns that cool the lawn beneath
  }

  rand(a = 0, b = 1) {
    return a + (b - a) * this.rng()
  }

  // Broken colour: a random mix of two palette entries, plus a little value noise.
  pick(pal) {
    const a = pal[(this.rng() * pal.length) | 0], b = pal[(this.rng() * pal.length) | 0]
    const t = this.rng(), v = 1 + this.rand(-0.08, 0.08)
    return [lerp(a[0], b[0], t) * v, lerp(a[1], b[1], t) * v, lerp(a[2], b[2], t) * v]
  }

  // Monet's light: warm where the sun hits, lilac-blue in the shade. Never black.
  tint(nx, ny, nz) {
    const d = nx * SUN.x + ny * SUN.y + nz * SUN.z
    const lit = 0.5 + 0.5 * Math.max(0, d)
    return [lerp(0.78, 1.04, lit), lerp(0.8, 1.0, lit), lerp(1.04, 0.9, lit)]
  }

  // One brush stroke: lies in the plane with normal n, long axis along dir
  // (projected into that plane; random if omitted). `shadeN` is the normal to
  // light it by, or null for an unlit (self-coloured) dab.
  dab(x, y, z, n, dir, long, short, thin, rgb, alpha, kind, shadeN = n, sway = 0) {
    const nn = this.n.set(n[0], n[1], n[2]).normalize()
    const q = this.q.setFromUnitVectors(this.zAxis, nn)
    let angle = this.rand(0, Math.PI * 2)
    if (dir) {
      const d = this.d.set(dir[0], dir[1], dir[2])
      d.addScaledVector(nn, -d.dot(nn))
      if (d.lengthSq() > 1e-6) {
        d.normalize()
        const e = this.e.set(1, 0, 0).applyQuaternion(q)
        angle = Math.atan2(this.c.crossVectors(e, d).dot(nn), e.dot(d)) + this.rand(-0.25, 0.25)
      }
    }
    this.q2.setFromAxisAngle(nn, angle)
    q.premultiply(this.q2)
    let r = rgb[0], g = rgb[1], b = rgb[2]
    if (shadeN) {
      const t = this.tint(shadeN[0], shadeN[1], shadeN[2])
      r *= t[0]; g *= t[1]; b *= t[2]
    }
    return this.store.add(x, y, z, long, short, thin, q.x, q.y, q.z, q.w, to255(r), to255(g), to255(b), alpha, kind, sway)
  }

  // A rectangle of strokes: origin o, unit edges u (length ul) and v (length
  // vl), outward normal n. `color` is a palette, an rgb, or (a, b) → colour|null.
  face(o, u, ul, v, vl, n, color, opt = {}) {
    const su = opt.su ?? 0.32, sv = opt.sv ?? 0.32
    const long = opt.long ?? su * 0.62, short = opt.short ?? sv * 0.62, thin = opt.thin ?? 0.03
    const dir = opt.dir ?? u
    const kind = opt.kind ?? KIND.STRUCTURE
    const nu = Math.max(1, Math.round(ul / su)), nv = Math.max(1, Math.round(vl / sv))
    const du = ul / nu, dv = vl / nv
    for (let j = 0; j < nv; j++) {
      for (let i = 0; i < nu; i++) {
        const a = (i + 0.5 + this.rand(-0.3, 0.3)) * du, b = (j + 0.5 + this.rand(-0.3, 0.3)) * dv
        let c = typeof color === 'function' ? color(a, b) : color
        if (!c) continue
        if (Array.isArray(c[0])) c = this.pick(c)
        const x = o[0] + u[0] * a + v[0] * b, y = o[1] + u[1] * a + v[1] * b, z = o[2] + u[2] * a + v[2] * b
        this.dab(x, y, z, n, dir, long * this.rand(0.8, 1.25), short * this.rand(0.8, 1.2), thin, c, c[4] ?? 255, kind, c[3] ? null : n)
      }
    }
  }

  walls(cx, cz, w, d, y0, h, colorFor, opt) {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2
    this.face([x0, y0, z1], X, w, UP, h, ZP, colorFor(0, w), opt)
    this.face([x1, y0, z0], [-1, 0, 0], w, UP, h, [0, 0, -1], colorFor(1, w), opt)
    this.face([x1, y0, z1], [0, 0, -1], d, UP, h, X, colorFor(2, d), opt)
    this.face([x0, y0, z0], ZP, d, UP, h, [-1, 0, 0], colorFor(3, d), opt)
    return { x0, x1, z0, z1 }
  }

  pitchedRoof({ x0, x1, z0, z1 }, h, rise, color, gableColor, opt = {}) {
    const w = x1 - x0, d = z1 - z0, ov = 0.4
    const half = d / 2 + ov, len = Math.hypot(half, rise), nz = half / len, ny = rise / len
    const slope = { ...opt, dir: X }
    this.face([x0 - ov, h, z1 + ov], X, w + 2 * ov, [0, rise / len, -half / len], len, [0, ny, nz], color, slope)
    this.face([x1 + ov, h, z0 - ov], [-1, 0, 0], w + 2 * ov, [0, rise / len, half / len], len, [0, ny, -nz], color, slope)
    const gable = (a, b) => (b <= rise * (1 - Math.abs(a - d / 2) / (d / 2)) ? gableColor : null)
    this.face([x1, h, z1], [0, 0, -1], d, UP, rise, X, gable, opt)
    this.face([x0, h, z0], ZP, d, UP, rise, [-1, 0, 0], gable, opt)
  }

  cylinder(cx, y0, cz, r, h, pal, opt = {}) {
    const spacing = opt.spacing ?? 0.28
    const kind = opt.kind ?? KIND.STRUCTURE
    const lean = opt.lean ?? [0, 0]
    const rings = Math.max(1, Math.round(h / spacing))
    for (let j = 0; j < rings; j++) {
      const y = y0 + (j + 0.5) * (h / rings)
      const rr = opt.taper ? r * (1 - opt.taper * ((y - y0) / h)) : r
      const n = Math.max(5, Math.round((2 * Math.PI * rr) / spacing))
      for (let i = 0; i < n; i++) {
        const ang = ((i + 0.5 * (j & 1)) / n) * Math.PI * 2
        const nx = Math.cos(ang), nz = Math.sin(ang)
        this.dab(cx + lean[0] * (y - y0) + nx * rr, y, cz + lean[1] * (y - y0) + nz * rr, [nx, 0, nz], opt.dir ?? UP,
          spacing * 0.75 * this.rand(0.8, 1.3), spacing * 0.4 * this.rand(0.8, 1.2), 0.03, this.pick(pal), 255, kind)
      }
    }
  }

  // A fuzzy ellipsoid of dabs.
  blob(cx, cy, cz, rx, ry, rz, pal, count, opt = {}) {
    const long = opt.long ?? 0.34, short = opt.short ?? 0.2
    const kind = opt.kind ?? KIND.FOLIAGE
    for (let k = 0; k < count; k++) {
      let dx, dy, dz, l
      do {
        dx = this.rand(-1, 1); dy = this.rand(-1, 1); dz = this.rand(-1, 1)
        l = dx * dx + dy * dy + dz * dz
      } while (l > 1 || l < 0.01)
      l = Math.sqrt(l)
      dx /= l; dy /= l; dz /= l
      const t = this.rand(0.82, 1)
      const nx = dx / rx + this.rand(-0.3, 0.3), ny = dy / ry + this.rand(-0.3, 0.3), nz = dz / rz + this.rand(-0.3, 0.3)
      const pal2 = opt.mix && this.rng() < opt.mix[1] ? opt.mix[0] : pal
      this.dab(cx + dx * rx * t, cy + dy * ry * t, cz + dz * rz * t, [nx, ny, nz], opt.dir ?? null,
        long * this.rand(0.7, 1.35), short * this.rand(0.7, 1.3), 0.04, this.pick(pal2), opt.alpha ?? 255, kind, [nx, ny, nz], opt.sway ?? 0)
    }
  }

  // ------------------------------------------------------------ the garden

  ground() {
    const spacing = 0.62, half = WORLD_HALF
    const n = Math.round((2 * half) / spacing)
    const spots = this.shadeSpots
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const x = -half + (i + 0.5 + this.rand(-0.35, 0.35)) * spacing
        const z = -half + (j + 0.5 + this.rand(-0.35, 0.35)) * spacing
        const e = pondDist(x, z)
        if (e < 1) {
          const vertical = this.rng() < 0.4
          const c = this.pick(vertical ? PAL.reflect : PAL.water)
          // deeper water is bluer, the edge greener
          const k = 0.85 + 0.15 * e
          this.dab(x, 0, z, UP, vertical ? ZP : X, vertical ? 0.5 : 0.52, 0.13, 0.03, [c[0] * k, c[1], c[2] * (2 - k)], 255, KIND.WATER, UP, -0.5)
        } else if (onPath(x, z)) {
          this.dab(x, 0, z, UP, [1, 0, this.rand(-0.4, 0.4)], 0.42, 0.2, 0.03, this.pick(PAL.path), 255, KIND.GROUND, UP)
        } else {
          let shade = 0
          for (const s of spots) {
            const d = Math.hypot(x - s[0], z - s[2])
            if (d < s[2]) shade = Math.max(shade, 1 - d / s[2])
          }
          const c = this.pick(PAL.lawn), cs = this.pick(PAL.lawnShade)
          const k = Math.min(1, shade * 1.4)
          const col = [lerp(c[0], cs[0], k), lerp(c[1], cs[1], k), lerp(c[2], cs[2], k)]
          this.dab(x, 0, z, UP, [this.rand(0.5, 1), 0, this.rand(-0.6, 0.6)], 0.4, 0.18, 0.03, col, 255, KIND.GROUND, UP)
        }
      }
    }
  }

  house() {
    const cx = 0, cz = -39, w = 28, d = 7, h = 7.4
    const colorFor = (side, len) => (a, b) => {
      if (b > h - 0.3) return PAL.slate
      const slot = 2.6, ns = Math.floor(len / slot), margin = (len - ns * slot) / 2
      const aa = a - margin, col = Math.floor(aa / slot), ab = aa - col * slot
      const fb = b - (b < 3.4 ? 1.1 : 4.3)
      if (side === 0 && b < 2.4 && Math.abs(a - len / 2) < 0.7) return PAL.shutter // the door
      if (col >= 0 && col < ns && fb > 0 && fb < 1.8 && side < 2) {
        if (ab > 0.85 && ab < 1.75) return (col * 7 + (b < 3.4 ? 0 : 3)) % 5 === 0 ? [1, 0.9, 0.6, 1] : PAL.glass
        if ((ab > 0.45 && ab < 0.85) || (ab > 1.75 && ab < 2.15)) return PAL.shutter
      }
      return PAL.housePink
    }
    const ext = this.walls(cx, cz, w, d, 0, h, colorFor, { su: 0.3, sv: 0.24, long: 0.2, short: 0.11 })
    // a dark inner shell so the walls read solid and a hole opens on a room
    this.walls(cx, cz, w - 0.7, d - 0.7, 0, h - 0.2, () => PAL.dark, { su: 0.8, sv: 0.8, long: 0.6, short: 0.5 })
    this.pitchedRoof(ext, h, 3.2, PAL.slate, PAL.housePink, { su: 0.34, sv: 0.3, long: 0.26, short: 0.12 })
    for (const x of [-9, 8]) {
      const c = this.walls(x, cz, 1.1, 1.1, h + 2.4, 1.6, () => PAL.housePink, { su: 0.22, sv: 0.22 })
      this.face([c.x0, h + 4, c.z0], X, 1.1, ZP, 1.1, UP, PAL.dark, { su: 0.22, sv: 0.22 })
    }
    const s = this.walls(cx, cz + d / 2 + 0.6, 3.2, 1.2, 0, 0.35, () => PAL.path, { su: 0.22, sv: 0.18 })
    this.face([s.x0, 0.35, s.z0], X, 3.2, ZP, 1.2, UP, PAL.path, { su: 0.22, sv: 0.22 })
  }

  // ---- trees

  willow(x, z) {
    const h = this.rand(5.2, 6.8), lean = [this.rand(-0.12, 0.12), this.rand(-0.12, 0.12)]
    this.cylinder(x, 0, z, 0.42, h, PAL.bark, { spacing: 0.28, lean, taper: 0.4 })
    const tx = x + lean[0] * h, tz = z + lean[1] * h
    this.blob(tx, h + 0.5, tz, 3.3, 1.4, 3.3, PAL.willow, 260, { long: 0.45, short: 0.16, sway: 0.25 })
    this.shadeSpots.push([x, z, 5.5])
    for (let k = 0; k < 100; k++) {
      const a = this.rand(0, Math.PI * 2), rr = this.rand(1.2, 3.4)
      let px = tx + Math.cos(a) * rr, pz = tz + Math.sin(a) * rr
      const top = h + this.rand(-0.2, 0.9), len = this.rand(3.2, Math.min(6.8, top - 0.4))
      const steps = Math.round(len / 0.33)
      const drift = this.rand(0.02, 0.09)
      for (let s = 0; s < steps; s++) {
        const y = top - s * 0.33
        px += Math.cos(a) * drift; pz += Math.sin(a) * drift
        this.dab(px + this.rand(-0.06, 0.06), y, pz + this.rand(-0.06, 0.06), [Math.cos(a), 0.2, Math.sin(a)], UP,
          0.3 * this.rand(0.8, 1.3), 0.07, 0.03, this.pick(PAL.willow), 255, KIND.FLORA, [Math.cos(a), 0.2, Math.sin(a)], 0.3 + 0.7 * (s / steps))
      }
    }
  }

  fruitTree(x, z) {
    const h = this.rand(2.4, 3.2)
    this.cylinder(x, 0, z, 0.2, h, PAL.bark, { spacing: 0.24, taper: 0.3 })
    this.blob(x, h + 1.6, z, 2.5, 1.9, 2.5, PAL.canopy, 280, { mix: [PAL.blossom, 0.35], long: 0.32, short: 0.2, sway: 0.25 })
    this.shadeSpots.push([x, z, 3.8])
  }

  poplar(x, z) {
    const h = this.rand(5.5, 7.5)
    this.cylinder(x, 0, z, 0.26, h, PAL.bark, { spacing: 0.3, taper: 0.3 })
    const ch = this.rand(8, 11)
    this.blob(x, h + ch * 0.55, z, 2.0, ch * 0.6, 2.0, PAL.poplar, 360, { dir: UP, long: 0.5, short: 0.2, sway: 0.2 })
    this.shadeSpots.push([x, z, 3.5])
  }

  bamboo(x, z) {
    for (let k = 0; k < 14; k++) {
      const a = this.rand(0, Math.PI * 2), rr = this.rand(0, 0.9)
      const bx = x + Math.cos(a) * rr, bz = z + Math.sin(a) * rr, h = this.rand(3.2, 5.8)
      const lx = this.rand(-0.05, 0.05), lz = this.rand(-0.05, 0.05)
      for (let y = 0.2; y < h; y += 0.38) {
        this.dab(bx + lx * y, y, bz + lz * y, [Math.cos(a), 0, Math.sin(a)], UP, 0.3, 0.05, 0.03, this.pick(PAL.bamboo), 255, KIND.FLORA, [Math.cos(a), 0, Math.sin(a)], 0.1 + y * 0.12)
        if (y > h * 0.5 && this.rng() < 0.7) {
          const la = this.rand(0, Math.PI * 2)
          this.dab(bx + lx * y + Math.cos(la) * 0.3, y + 0.1, bz + lz * y + Math.sin(la) * 0.3, [Math.cos(la), 0.6, Math.sin(la)],
            [Math.cos(la), 0.3, Math.sin(la)], 0.26, 0.06, 0.03, this.pick(PAL.bamboo), 255, KIND.FLORA, [Math.cos(la), 0.6, Math.sin(la)], 0.2 + y * 0.12)
        }
      }
    }
  }

  hedgeRow(x0, z0, x1, z1, h = 1.8) {
    const len = Math.hypot(x1 - x0, z1 - z0), n = Math.round(len / 0.8)
    for (let k = 0; k <= n; k++) {
      const t = k / n
      this.blob(lerp(x0, x1, t), h / 2, lerp(z0, z1, t), 0.7, h / 2, 0.7, PAL.hedge, 9, { long: 0.45, short: 0.22, sway: 0.08 })
    }
  }

  // ---- flowers (soft: never in the collision grid)

  stroke(x, y, z, len, pal) {
    const a = this.rand(0, Math.PI * 2)
    const n = [Math.cos(a), 0.3, Math.sin(a)]
    this.dab(x, y, z, n, UP, len, 0.045, 0.02, this.pick(pal), 255, KIND.FLORA, n, 0.15 + y * 0.45)
  }
  flower(x, y, z, r, pal) {
    const n = [this.rand(-0.5, 0.5), 1, this.rand(-0.5, 0.5)]
    this.dab(x, y, z, n, null, r, r * this.rand(0.6, 0.9), 0.03, this.pick(pal), 255, KIND.FLORA, n, 0.15 + y * 0.45)
  }
  iris(x, z) {
    for (let k = 0; k < 4; k++) this.stroke(x + this.rand(-0.15, 0.15), this.rand(0.18, 0.36), z + this.rand(-0.15, 0.15), 0.28, PAL.irisLeaf)
    const n = 1 + (this.rng() < 0.5 ? 1 : 0)
    for (let k = 0; k < n; k++) this.flower(x + this.rand(-0.15, 0.15), this.rand(0.55, 0.8), z + this.rand(-0.15, 0.15), 0.09, PAL.iris)
  }
  tulip(x, z) {
    this.stroke(x, 0.2, z, 0.2, PAL.stem)
    this.flower(x, 0.4, z, 0.07, PAL.tulip)
  }
  poppy(x, z) {
    this.stroke(x, 0.28, z, 0.28, PAL.stem)
    this.flower(x + this.rand(-0.08, 0.08), 0.55, z + this.rand(-0.08, 0.08), 0.09, PAL.poppy)
  }
  peony(x, z) {
    for (let k = 0; k < 5; k++) this.flower(x + this.rand(-0.35, 0.35), this.rand(0.15, 0.45), z + this.rand(-0.35, 0.35), 0.13, PAL.stem)
    for (let k = 0; k < 3; k++) this.flower(x + this.rand(-0.3, 0.3), this.rand(0.45, 0.68), z + this.rand(-0.3, 0.3), 0.12, PAL.peony)
  }
  dahlia(x, z) {
    for (let k = 0; k < 3; k++) this.stroke(x + this.rand(-0.2, 0.2), this.rand(0.3, 0.7), z + this.rand(-0.2, 0.2), 0.36, PAL.stem)
    for (let k = 0; k < 4; k++) this.flower(x + this.rand(-0.3, 0.3), this.rand(0.8, 1.1), z + this.rand(-0.3, 0.3), 0.1, PAL.dahlia)
  }
  nasturtium(x, z) {
    for (let k = 0; k < 4; k++) this.flower(x + this.rand(-0.3, 0.3), this.rand(0.06, 0.2), z + this.rand(-0.3, 0.3), 0.13, PAL.nastLeaf)
    for (let k = 0; k < 2; k++) this.flower(x + this.rand(-0.3, 0.3), this.rand(0.15, 0.3), z + this.rand(-0.3, 0.3), 0.06, PAL.nasturtium)
  }

  bed(x0, z0, x1, z1, plant, density) {
    const n = Math.round((x1 - x0) * (z1 - z0) * density)
    for (let k = 0; k < n; k++) {
      const x = this.rand(x0, x1), z = this.rand(z0, z1)
      if (onPath(x, z) || pondDist(x, z) < 1.06) continue
      plant.call(this, x, z)
    }
  }

  roseArch(z) {
    const r = 2.5, legH = 1.5
    const point = (px, py) => {
      this.dab(px, py, z, ZP, py > legH ? [-(py - legH), px, 0] : UP, 0.16, 0.06, 0.03, this.pick(PAL.iron), 255, KIND.STRUCTURE)
      const n = 2 + (this.rng() < 0.6 ? 1 : 0)
      for (let k = 0; k < n; k++) {
        const ox = this.rand(-0.38, 0.38), oy = this.rand(-0.3, 0.3), oz = this.rand(-0.35, 0.35)
        if (this.rng() < 0.55) this.flower(px + ox, py + oy, z + oz, 0.085, PAL.rose)
        else this.flower(px + ox, py + oy, z + oz, 0.12, PAL.nastLeaf)
      }
    }
    for (let y = 0.2; y < legH; y += 0.22) {
      point(-r, y)
      point(r, y)
    }
    for (let a = 0; a <= Math.PI + 1e-6; a += 0.22 / r) point(r * Math.cos(a), legH + r * Math.sin(a))
  }

  // ---- the water garden

  lilies() {
    for (let c = 0; c < 210; c++) {
      let cx, cz
      do {
        cx = this.rand(POND.cx - POND.rx, POND.cx + POND.rx)
        cz = this.rand(POND.cz - POND.rz, POND.cz + POND.rz)
      } while (pondDist(cx, cz) > 0.9 || Math.abs(cx - BRIDGE.x) < 1.6)
      const n = 4 + ((this.rng() * 6) | 0)
      for (let k = 0; k < n; k++) {
        const x = cx + this.rand(-1.3, 1.3), z = cz + this.rand(-1.1, 1.1)
        if (pondDist(x, z) > 0.96) continue
        this.dab(x, 0.03, z, UP, null, 0.22, 0.17, 0.02, this.pick(PAL.lily), 255, KIND.LOOSE, UP)
        if (this.rng() < 0.3) {
          this.dab(x, 0.1, z, [this.rand(-0.4, 0.4), 1, this.rand(-0.4, 0.4)], null, 0.1, 0.07, 0.03, this.pick(PAL.lilyFlower), 255, KIND.LOOSE, UP)
          if (this.rng() < 0.5) this.dab(x, 0.13, z, UP, null, 0.03, 0.03, 0.02, [0.98, 0.85, 0.35], 255, KIND.LOOSE, null)
        }
      }
    }
  }

  bridge() {
    const { x, z0, z1, width, rise, base } = BRIDGE
    const L = z1 - z0
    const deckY = (t) => base + rise * Math.sin(Math.PI * t)
    const slope = (t) => (rise * Math.PI * Math.cos(Math.PI * t)) / L
    for (let s = 0; s <= L; s += 0.23) {
      const t = s / L, y = deckY(t), n = [0, 1, -slope(t)]
      for (let k = 0; k < 6; k++) {
        const bx = x - width / 2 + (k + 0.5) * (width / 6)
        this.dab(bx, y, z0 + s, n, X, 0.2, 0.1, 0.03, this.pick(PAL.bridge), 255, KIND.STRUCTURE)
      }
    }
    for (const side of [-1, 1]) {
      const rx = x + side * (width / 2 + 0.05)
      for (let s = 0; s <= L; s += 0.3) {
        const t = s / L, y = deckY(t)
        this.dab(rx, y + 1.0, z0 + s, [side, 0, 0], ZP, 0.22, 0.05, 0.03, this.pick(PAL.bridge), 255, KIND.STRUCTURE)
        this.dab(rx, y + 0.5, z0 + s, [side, 0, 0], ZP, 0.22, 0.05, 0.03, this.pick(PAL.bridge), 255, KIND.STRUCTURE)
      }
      for (let s = 0; s <= L; s += 1.6) {
        const t = s / L, y = deckY(t)
        for (let p = 0.2; p < 1.0; p += 0.3) this.dab(rx, y + p, z0 + s, [side, 0, 0], UP, 0.22, 0.05, 0.03, this.pick(PAL.bridge), 255, KIND.STRUCTURE)
      }
      // trellis uprights and the beam they carry
      for (let s = 0.8; s <= L; s += 3.2) {
        const t = s / L, y = deckY(t)
        for (let p = 1.0; p < 3.0; p += 0.3) this.dab(rx, y + p, z0 + s, [side, 0, 0], UP, 0.22, 0.05, 0.03, this.pick(PAL.bridge), 255, KIND.STRUCTURE)
      }
      for (let s = 0.8; s <= L; s += 0.3) {
        const t = s / L, y = deckY(t)
        this.dab(rx, y + 3.0, z0 + s, [side, 0, 0], ZP, 0.22, 0.05, 0.03, this.pick(PAL.bridge), 255, KIND.STRUCTURE)
        if (this.rng() < 0.85) this.wisteria(rx + side * this.rand(-0.3, 0.2), y + 3.0, z0 + s)
      }
    }
    for (let s = 0.8; s <= L; s += 3.2) {
      const t = s / L, y = deckY(t)
      for (let bx = -width / 2; bx <= width / 2; bx += 0.3) {
        this.dab(x + bx, y + 3.0, z0 + s, UP, X, 0.22, 0.05, 0.03, this.pick(PAL.bridge), 255, KIND.STRUCTURE)
        this.wisteria(x + bx, y + 3.0, z0 + s + this.rand(-0.15, 0.15))
      }
    }
  }

  wisteria(x, y, z) {
    const len = this.rand(0.5, 1.2), n = Math.round(len / 0.2)
    for (let k = 0; k < n; k++) {
      const r = k === n - 1 ? 0.14 : 0.11
      const nn = [this.rand(-1, 1), 0.3, this.rand(-1, 1)]
      this.dab(x + this.rand(-0.05, 0.05), y - 0.1 - k * 0.2, z + this.rand(-0.05, 0.05), nn, UP,
        0.2, r * 0.7, 0.03, this.pick(PAL.wisteria), 255, KIND.FLORA, nn, 0.25 + 0.35 * (k / n))
    }
  }

  clouds() {
    for (let k = 0; k < 26; k++) {
      const a = this.rand(0, Math.PI * 2), r = this.rand(40, 110), y = this.rand(45, 75)
      const s = this.rand(5, 11)
      this.dab(Math.cos(a) * r, y, Math.sin(a) * r, UP, [Math.cos(a + 1.57), 0, Math.sin(a + 1.57)], s * 1.6, s * 0.6, 0.5, this.pick(PAL.cloud), 150, KIND.SKY, null, 10)
    }
  }

  hills() {
    const normal = (x, z) => {
      const e = 0.8
      const nx = terrainY(x - e, z) - terrainY(x + e, z), nz = terrainY(x, z - e) - terrainY(x, z + e)
      const l = Math.hypot(nx, 2 * e, nz)
      return [nx / l, (2 * e) / l, nz / l]
    }
    const inner = WORLD_HALF + 2
    const bands = [[inner, 110, 2.3], [110, 250, 6]]
    for (const [r0, r1, spacing] of bands) {
      const n = Math.round((2 * r1) / spacing)
      for (let j = 0; j < n; j++) {
        for (let i = 0; i < n; i++) {
          const x = -r1 + (i + 0.5 + this.rand(-0.35, 0.35)) * spacing
          const z = -r1 + (j + 0.5 + this.rand(-0.35, 0.35)) * spacing
          const d = Math.max(Math.abs(x), Math.abs(z))
          if (d < r0 || d >= r1) continue
          const y = terrainY(x, z)
          const nrm = normal(x, z)
          const far = smoothstep(60, 220, d)
          const poppies = x > 70 && z < -30 && z > -140 && this.rng() < 0.3 + 0.2 * Math.sin(x * 0.08)
          const a = this.pick(poppies ? PAL.poppyField : PAL.meadow), b = this.pick(PAL.hillFar)
          const c = [lerp(a[0], b[0], far), lerp(a[1], b[1], far), lerp(a[2], b[2], far)]
          this.dab(x, y, z, nrm, [1, 0, this.rand(-0.5, 0.5)], spacing * 0.85, spacing * 0.4, 0.05, c, 255, KIND.GROUND, nrm)
        }
      }
    }
    // trees and bushes, thicker in the folds between hills
    for (let k = 0; k < 420; k++) {
      const x = this.rand(-240, 240), z = this.rand(-240, 240)
      const d = Math.max(Math.abs(x), Math.abs(z))
      if (d < inner + 2 || d > 240) continue
      const y = terrainY(x, z)
      const tall = this.rng() < 0.3
      const h = tall ? this.rand(7, 11) : this.rand(3, 5)
      this.dab(x, y + h * 0.35, z, [1, 0, 0], UP, h * 0.4, 0.3, 0.05, this.pick(PAL.bark), 255, KIND.FOLIAGE)
      const r = tall ? this.rand(1.6, 2.4) : this.rand(2.2, 3.6)
      this.blob(x, y + h * 0.8, z, r, tall ? r * 2 : r * 0.8, r, PAL.hillTree, tall ? 14 : 12, { long: 1.1, short: 0.5, sway: 0.15, dir: tall ? UP : null })
    }
    for (let k = 0; k < 700; k++) {
      const x = this.rand(-240, 240), z = this.rand(-240, 240)
      const d = Math.max(Math.abs(x), Math.abs(z))
      if (d < inner + 1 || d > 240) continue
      const y = terrainY(x, z), r = this.rand(0.9, 1.8)
      this.blob(x, y + r * 0.6, z, r, r * 0.7, r, PAL.hillBush, 5, { long: 0.9, short: 0.45, sway: 0.1 })
    }
  }

  // Petals the breeze will shake loose later: allocated now, asleep until used.
  reservePetals(n) {
    const start = this.store.count
    for (let k = 0; k < n; k++) {
      const i = this.dab(0, -10, 0, UP, null, 0.1, 0.07, 0.02, [1, 1, 1], 255, KIND.LOOSE, null)
      this.store.alive[i] = 0
    }
    return [start, this.store.count]
  }

  // Fallen petals and leaves: loose from the start, so the blower can lift them.
  litter() {
    const petal = (x, z) => {
      const r = this.rand(0.08, 0.15)
      this.dab(x, 0.04 + this.rand(0, 0.04), z, [this.rand(-0.3, 0.3), 1, this.rand(-0.3, 0.3)], null, r, r * 0.7, 0.02, this.pick(PAL.petal), 255, KIND.LOOSE, UP)
    }
    for (let k = 0; k < 5000; k++) {
      const x = this.rand(-WORLD_HALF, WORLD_HALF), z = this.rand(-WORLD_HALF, WORLD_HALF)
      if (pondDist(x, z) < 1.0) continue
      petal(x, z)
    }
    // drifts on and beside the paths, where the blower will find them
    let onGravel = 0, beside = 0
    for (let k = 0; k < 400000 && (onGravel < 4200 || beside < 2500); k++) {
      const x = this.rand(-WORLD_HALF, WORLD_HALF), z = this.rand(-WORLD_HALF, WORLD_HALF)
      if (pondDist(x, z) < 1.0) continue
      if (onPath(x, z)) {
        if (onGravel >= 4200) continue
        onGravel++
      } else {
        if (beside >= 2500 || !onPath(x + this.rand(-1.5, 1.5), z + this.rand(-1.5, 1.5))) continue
        beside++
      }
      petal(x, z)
    }
    for (const s of this.shadeSpots) {
      for (let k = 0; k < 130; k++) {
        const a = this.rand(0, Math.PI * 2), rr = this.rand(0, s[2] + 1)
        const x = s[0] + Math.cos(a) * rr, z = s[1] + Math.sin(a) * rr
        if (pondDist(x, z) < 1.0 || Math.abs(x) > WORLD_HALF || Math.abs(z) > WORLD_HALF) continue
        this.dab(x, 0.04 + this.rand(0, 0.04), z, [this.rand(-0.3, 0.3), 1, this.rand(-0.3, 0.3)], null, 0.14, 0.09, 0.02, this.pick(PAL.leaf), 255, KIND.LOOSE, UP)
      }
    }
  }
}

export function buildGarden(store, seed = 1337) {
  const rng = mulberry32(seed)
  const P = new Painter(store, rng)
  const willows = [[-16, 14], [-20, 27], [-15, 37], [17, 37], [23, 29], [23, 14]]
  const orchard = [[-20, -26], [-26, -18], [-21, -8], [-27, 1], [20, -27], [26, -16], [22, -6], [27, 3], [-33, 10], [34, 8]]
  const arches = [-30, -24, -18, -12, -6, 0]

  // Trees first: the ground wants to know where their shade falls.
  for (const [x, z] of willows) P.willow(x, z)
  for (const [x, z] of orchard) P.fruitTree(x, z)
  for (let k = 0; k < 16; k++) {
    const a = (k / 16) * Math.PI * 2 + 0.2
    const x = Math.cos(a) * 42, z = Math.sin(a) * 42
    if (Math.abs(x) < 4 || Math.abs(z + 39) < 5) continue
    P.poplar(x, z)
  }
  for (const [x, z] of [[-27, 31], [26, 23], [-3, 38]]) P.bamboo(x, z)

  P.ground()
  P.house()

  for (const z of arches) P.roseArch(z)
  for (let z = -31; z < 7; z += 0.36) {
    P.nasturtium(-(2.4 - rng() * 1.3), z)
    P.nasturtium(2.4 - rng() * 1.3, z)
  }
  // the flower garden either side of the allée, in bands
  const bands = [
    [-32, -27, P.iris, 1.6], [-26, -21, P.tulip, 2.4], [-20, -15, P.peony, 0.7], [-14, -9, P.poppy, 2.2],
    [-8, -3, P.iris, 1.6], [-2, 5, P.dahlia, 0.8],
  ]
  for (const [z0, z1, plant, dens] of bands) {
    P.bed(-15, z0, -3.2, z1, plant, dens)
    P.bed(3.2, z0, 15, z1, plant, dens)
  }
  P.bed(-31, -31, -17, 5, P.poppy, 0.25)
  P.bed(17, -31, 31, 5, P.tulip, 0.3)
  P.bed(-30, 9, 30, 12, P.iris, 0.5)

  // irises crowd the water's edge
  for (let a = 0; a < Math.PI * 2; a += 0.012) {
    for (const e of [1.02, 1.21]) {
      const x = POND.cx + Math.cos(a) * POND.rx * e + rng() * 0.4, z = POND.cz + Math.sin(a) * POND.rz * e + rng() * 0.4
      if (Math.abs(x - BRIDGE.x) < 1.8) continue
      if (rng() < 0.75) P.iris(x, z)
    }
  }
  P.lilies()
  P.bridge()

  const H = WORLD_HALF - 1.2
  P.hedgeRow(-H, H, -3, H)
  P.hedgeRow(3, H, H, H)
  P.hedgeRow(-H, -H, H, -H)
  P.hedgeRow(-H, -H, -H, 5)
  P.hedgeRow(-H, 9, -H, H)
  P.hedgeRow(H, -H, H, 5)
  P.hedgeRow(H, 9, H, H)

  P.litter()
  P.clouds()
  P.hills()
  const reserve = P.reservePetals(3000)
  return {
    count: store.count,
    reserve,
    // where the breeze finds petals to drop: [x, y, z, radius, palette]
    sources: [
      ...arches.map((z) => [0, 4.0, z, 2.2, PAL.rose]),
      ...orchard.map(([x, z]) => [x, 4.4, z, 2.4, PAL.blossom]),
      ...willows.map(([x, z]) => [x, 5.5, z, 3.0, PAL.leaf]),
    ],
    pick: (pal) => P.pick(pal),
  }
}
