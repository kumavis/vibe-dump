// town.js — a procedural town, sampled straight into Gaussian splats.
//
// There is no mesh anywhere: every wall, roof, trunk, canopy and paving stone
// is a scatter of thin, surface-aligned Gaussians with simple sun shading and
// a little colour noise baked in, which is what makes it read as a captured
// splat scene rather than flat geometry. Everything goes through the same
// `splat()` call, so the destruction code never needs to know what a splat
// used to be part of.
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

export const SUN = new THREE.Vector3(0.45, 0.8, 0.35).normalize()
export const WORLD_HALF = 46

const to255 = (v) => Math.max(0, Math.min(255, Math.round(v * 255)))
const hash = (a, b, c) => {
  const s = Math.sin(a * 12.9898 + b * 78.233 + c * 37.719) * 43758.5453
  return s - Math.floor(s)
}

const PALETTE = {
  terracotta: [0.80, 0.46, 0.33],
  cream: [0.93, 0.87, 0.72],
  sage: [0.60, 0.68, 0.55],
  dustyBlue: [0.50, 0.62, 0.76],
  ochre: [0.86, 0.69, 0.40],
  rose: [0.86, 0.60, 0.58],
  white: [0.94, 0.93, 0.89],
  slate: [0.47, 0.50, 0.58],
  mint: [0.70, 0.82, 0.74],
  plum: [0.62, 0.48, 0.60],
}
const ROOFS = {
  red: [0.56, 0.26, 0.20],
  grey: [0.36, 0.38, 0.43],
  brown: [0.42, 0.31, 0.22],
  green: [0.30, 0.42, 0.34],
}
const STONE = [0.62, 0.60, 0.54]
const WOOD = [0.52, 0.38, 0.24]

class Builder {
  constructor(store, rng) {
    this.store = store
    this.rng = rng
    this.q = new THREE.Quaternion()
    this.q2 = new THREE.Quaternion()
    this.n = new THREE.Vector3()
    this.zAxis = new THREE.Vector3(0, 0, 1)
  }

  rand(a = 0, b = 1) {
    return a + (b - a) * this.rng()
  }

  shade(nx, ny, nz, y, ao) {
    const d = nx * SUN.x + ny * SUN.y + nz * SUN.z
    let s = 0.5 + 0.5 * Math.max(0, d) + 0.08 * Math.max(0, ny)
    if (ao) s *= 0.7 + 0.3 * Math.min(1, Math.max(0, y / 2.5))
    return s
  }

  // One surface-aligned splat: local z is the normal, so the thin axis points
  // out of the surface and the two wide axes lie in it, spun by a random angle.
  splat(x, y, z, nx, ny, nz, s1, s2, thin, r, g, b, a, kind, shadeFactor) {
    const n = this.n.set(nx, ny, nz).normalize()
    this.q.setFromUnitVectors(this.zAxis, n)
    this.q2.setFromAxisAngle(n, this.rand(0, Math.PI))
    this.q.premultiply(this.q2)
    const v = shadeFactor * (1 + this.rand(-0.06, 0.06))
    const q = this.q
    return this.store.add(x, y, z, s1, s2, thin, q.x, q.y, q.z, q.w, to255(r * v), to255(g * v), to255(b * v), a, kind)
  }

  // A rectangle: origin o, unit edge u of length ul, unit edge v of length vl,
  // outward normal n. `color` is [r,g,b] or a function (a, b) → colour|null,
  // where the colour may carry a 4th "emissive" flag and 5th alpha.
  face(o, u, ul, v, vl, n, color, opt = {}) {
    const spacing = opt.spacing ?? 0.34
    const sigma = opt.sigma ?? spacing * 0.52
    const kind = opt.kind ?? KIND.STRUCTURE
    const ao = opt.ao !== false
    const nu = Math.max(1, Math.round(ul / spacing))
    const nv = Math.max(1, Math.round(vl / spacing))
    const du = ul / nu, dv = vl / nv
    for (let j = 0; j < nv; j++) {
      for (let i = 0; i < nu; i++) {
        const a = (i + 0.5 + this.rand(-0.3, 0.3)) * du
        const b = (j + 0.5 + this.rand(-0.3, 0.3)) * dv
        const c = typeof color === 'function' ? color(a, b) : color
        if (!c) continue
        const x = o[0] + u[0] * a + v[0] * b
        const y = o[1] + u[1] * a + v[1] * b
        const z = o[2] + u[2] * a + v[2] * b
        const sh = c[3] ? 1 : this.shade(n[0], n[1], n[2], y, ao)
        const s = sigma * this.rand(0.8, 1.25)
        this.splat(x, y, z, n[0], n[1], n[2], s, s * this.rand(0.7, 1.1), sigma * 0.12, c[0], c[1], c[2], c[4] ?? 255, kind, sh)
      }
    }
  }

  // Four walls around (cx, cz), from y0 up h. Returns the extents for roofs.
  walls(cx, cz, w, d, y0, h, colorFor, opt) {
    const x0 = cx - w / 2, x1 = cx + w / 2, z0 = cz - d / 2, z1 = cz + d / 2
    this.face([x0, y0, z1], [1, 0, 0], w, [0, 1, 0], h, [0, 0, 1], colorFor(0, w), opt) // front (+z)
    this.face([x1, y0, z0], [-1, 0, 0], w, [0, 1, 0], h, [0, 0, -1], colorFor(1, w), opt) // back
    this.face([x1, y0, z1], [0, 0, -1], d, [0, 1, 0], h, [1, 0, 0], colorFor(2, d), opt) // right
    this.face([x0, y0, z0], [0, 0, 1], d, [0, 1, 0], h, [-1, 0, 0], colorFor(3, d), opt) // left
    return { x0, x1, z0, z1 }
  }

  building(cx, cz, w, d, h, wall, roofColor, opt = {}) {
    const seed = this.rand(0, 1000)
    const trim = [wall[0] * 0.78, wall[1] * 0.78, wall[2] * 0.78]
    const door = [0.30, 0.20, 0.12]
    const glass = [0.15, 0.19, 0.27]
    const lit = [1.0, 0.82, 0.46, 1]
    const colorFor = (side, len) => (a, b) => {
      if (b > h - 0.35) return trim
      if (side === 0 && opt.door !== false && b < 2.3 && Math.abs(a - len / 2) < 0.65) return door
      const fl = Math.floor((b - 1.0) / 3.0)
      const fb = b - 1.0 - fl * 3.0
      if (fl >= 0 && fb >= 0 && fb < 1.5 && b < h - 1.0) {
        const slot = 2.4
        const ns = Math.max(1, Math.floor(len / slot))
        const margin = (len - ns * slot) / 2
        const aa = a - margin
        const col = Math.floor(aa / slot)
        const ab = aa - col * slot
        if (col >= 0 && col < ns && ab > 0.7 && ab < 1.7) {
          if (side === 0 && fl === 0 && Math.abs(a - len / 2) < 1.4) return wall
          return hash(col, fl + side * 7, seed) < 0.38 ? lit : glass
        }
      }
      return wall
    }
    const ext = this.walls(cx, cz, w, d, 0, h, colorFor, { spacing: opt.spacing ?? 0.34 })
    if (opt.roof === 'pitched') this.pitchedRoof(ext, h, opt.rise ?? Math.min(w, d) * 0.4, roofColor, wall)
    else if (opt.roof === 'pyramid') this.pyramidRoof(ext, h, opt.rise ?? Math.min(w, d) * 0.9, roofColor)
    else this.flatRoof(ext, h, roofColor, trim)
  }

  flatRoof({ x0, x1, z0, z1 }, h, color, trim) {
    const w = x1 - x0, d = z1 - z0
    this.face([x0, h, z0], [1, 0, 0], w, [0, 0, 1], d, [0, 1, 0], color, { ao: false })
    // parapet
    const p = 0.45
    this.face([x0, h, z1], [1, 0, 0], w, [0, 1, 0], p, [0, 0, 1], trim, { spacing: 0.3 })
    this.face([x1, h, z0], [-1, 0, 0], w, [0, 1, 0], p, [0, 0, -1], trim, { spacing: 0.3 })
    this.face([x1, h, z1], [0, 0, -1], d, [0, 1, 0], p, [1, 0, 0], trim, { spacing: 0.3 })
    this.face([x0, h, z0], [0, 0, 1], d, [0, 1, 0], p, [-1, 0, 0], trim, { spacing: 0.3 })
    this.face([x0, h + p, z0], [1, 0, 0], w, [0, 0, 1], d, [0, 1, 0], trim, { spacing: 0.3, ao: false })
  }

  // Ridge along the longer axis, with a small overhang and two gable triangles.
  pitchedRoof({ x0, x1, z0, z1 }, h, rise, color, wallColor) {
    const w = x1 - x0, d = z1 - z0
    const ov = 0.35
    const dark = [color[0] * 0.8, color[1] * 0.8, color[2] * 0.8]
    if (w >= d) {
      const half = d / 2 + ov
      const len = Math.hypot(half, rise)
      const nz = half / len, ny = rise / len
      this.face([x0 - ov, h, z1 + ov], [1, 0, 0], w + 2 * ov, [0, rise / len, -half / len], len, [0, ny, nz], color, { ao: false })
      this.face([x1 + ov, h, z0 - ov], [-1, 0, 0], w + 2 * ov, [0, rise / len, half / len], len, [0, ny, -nz], dark, { ao: false })
      const gable = (a, b) => (b <= rise * (1 - Math.abs(a - d / 2) / (d / 2)) ? wallColor : null)
      this.face([x1, h, z1], [0, 0, -1], d, [0, 1, 0], rise, [1, 0, 0], gable)
      this.face([x0, h, z0], [0, 0, 1], d, [0, 1, 0], rise, [-1, 0, 0], gable)
    } else {
      const half = w / 2 + ov
      const len = Math.hypot(half, rise)
      const nx = half / len, ny = rise / len
      this.face([x1 + ov, h, z1 + ov], [0, 0, -1], d + 2 * ov, [-half / len, rise / len, 0], len, [nx, ny, 0], color, { ao: false })
      this.face([x0 - ov, h, z0 - ov], [0, 0, 1], d + 2 * ov, [half / len, rise / len, 0], len, [-nx, ny, 0], dark, { ao: false })
      const gable = (a, b) => (b <= rise * (1 - Math.abs(a - w / 2) / (w / 2)) ? wallColor : null)
      this.face([x0, h, z1], [1, 0, 0], w, [0, 1, 0], rise, [0, 0, 1], gable)
      this.face([x1, h, z0], [-1, 0, 0], w, [0, 1, 0], rise, [0, 0, -1], gable)
    }
  }

  pyramidRoof({ x0, x1, z0, z1 }, h, rise, color) {
    const w = x1 - x0, d = z1 - z0, cx = (x0 + x1) / 2, cz = (z0 + z1) / 2
    const ov = 0.4
    const sides = [
      { o: [x0 - ov, h, z1 + ov], u: [1, 0, 0], ul: w + 2 * ov, half: d / 2 + ov, in: [0, 0, -1], n: [0, 0, 1] },
      { o: [x1 + ov, h, z0 - ov], u: [-1, 0, 0], ul: w + 2 * ov, half: d / 2 + ov, in: [0, 0, 1], n: [0, 0, -1] },
      { o: [x1 + ov, h, z1 + ov], u: [0, 0, -1], ul: d + 2 * ov, half: w / 2 + ov, in: [-1, 0, 0], n: [1, 0, 0] },
      { o: [x0 - ov, h, z0 - ov], u: [0, 0, 1], ul: d + 2 * ov, half: w / 2 + ov, in: [1, 0, 0], n: [-1, 0, 0] },
    ]
    for (const s of sides) {
      const len = Math.hypot(s.half, rise)
      const v = [(s.in[0] * s.half) / len, rise / len, (s.in[2] * s.half) / len]
      const n = [(s.n[0] * rise) / len, s.half / len, (s.n[2] * rise) / len]
      const tri = (a, b) => (b <= len * (1 - Math.abs(a - s.ul / 2) / (s.ul / 2)) ? color : null)
      this.face(s.o, s.u, s.ul, v, len, n, tri, { ao: false })
    }
    void cx; void cz
  }

  cylinder(cx, y0, cz, r, h, color, opt = {}) {
    const spacing = opt.spacing ?? 0.28
    const sigma = opt.sigma ?? spacing * 0.55
    const kind = opt.kind ?? KIND.STRUCTURE
    const rings = Math.max(1, Math.round(h / spacing))
    const n = Math.max(6, Math.round((2 * Math.PI * r) / spacing))
    for (let j = 0; j < rings; j++) {
      const y = y0 + (j + 0.5) * (h / rings)
      for (let i = 0; i < n; i++) {
        const ang = ((i + 0.5 * (j & 1)) / n) * Math.PI * 2 + this.rand(-0.15, 0.15) / n
        const nx = Math.cos(ang), nz = Math.sin(ang)
        const c = typeof color === 'function' ? color(ang, y - y0) : color
        const sh = c[3] ? 1 : this.shade(nx, 0, nz, y, opt.ao !== false)
        const s = sigma * this.rand(0.8, 1.25)
        this.splat(cx + nx * r, y, cz + nz * r, nx, 0, nz, s, s, sigma * 0.12, c[0], c[1], c[2], c[4] ?? 255, kind, sh)
      }
    }
    if (opt.cap) this.disc(cx, y0 + h, cz, r, color, opt)
  }

  disc(cx, y, cz, r, color, opt = {}) {
    const spacing = opt.spacing ?? 0.28
    const sigma = opt.sigma ?? spacing * 0.55
    const kind = opt.kind ?? KIND.STRUCTURE
    const inner = opt.inner ?? 0
    const rings = Math.max(1, Math.round((r - inner) / spacing))
    for (let j = 0; j < rings; j++) {
      const rr = inner + (j + 0.5) * ((r - inner) / rings)
      const n = Math.max(1, Math.round((2 * Math.PI * rr) / spacing))
      for (let i = 0; i < n; i++) {
        const ang = ((i + 0.5 * (j & 1)) / n) * Math.PI * 2
        const c = typeof color === 'function' ? color(rr, ang) : color
        const sh = c[3] ? 1 : this.shade(0, 1, 0, y, false)
        const s = sigma * this.rand(0.8, 1.25)
        this.splat(cx + Math.cos(ang) * rr, y, cz + Math.sin(ang) * rr, 0, 1, 0, s, s, sigma * 0.12, c[0], c[1], c[2], c[4] ?? 255, kind, sh)
      }
    }
  }

  // A fuzzy ellipsoid shell — canopies, bushes, lamps, water.
  blob(cx, cy, cz, rx, ry, rz, color, count, opt = {}) {
    const sigma = opt.sigma ?? 0.32
    const kind = opt.kind ?? KIND.FOLIAGE
    for (let k = 0; k < count; k++) {
      let dx, dy, dz, l
      do {
        dx = this.rand(-1, 1); dy = this.rand(-1, 1); dz = this.rand(-1, 1)
        l = dx * dx + dy * dy + dz * dz
      } while (l > 1 || l < 0.01)
      l = Math.sqrt(l)
      dx /= l; dy /= l; dz /= l
      const t = this.rand(0.84, 1)
      const x = cx + dx * rx * t, y = cy + dy * ry * t, z = cz + dz * rz * t
      // ellipsoid normal, nudged randomly for a leafy look
      let nx = dx / rx + this.rand(-0.35, 0.35), ny = dy / ry + this.rand(-0.35, 0.35), nz = dz / rz + this.rand(-0.35, 0.35)
      const c = typeof color === 'function' ? color(dx, dy, dz) : color
      const sh = c[3] ? 1 : this.shade(nx, ny, nz, 3, false) * (0.8 + 0.2 * (dy * 0.5 + 0.5))
      const s = sigma * this.rand(0.7, 1.35)
      this.splat(x, y, z, nx, ny, nz, s, s * this.rand(0.6, 1), sigma * 0.2, c[0], c[1], c[2], c[4] ?? 255, kind, sh)
    }
  }

  tree(x, z, scale = 1) {
    const h = this.rand(2.3, 3.3) * scale
    this.cylinder(x, 0, z, 0.2 * scale, h, [0.38, 0.27, 0.18], { spacing: 0.22, kind: KIND.FOLIAGE })
    const g0 = [this.rand(0.18, 0.3), this.rand(0.42, 0.58), this.rand(0.14, 0.24)]
    const g1 = [g0[0] + 0.12, g0[1] + 0.1, g0[2] + 0.04]
    const r = 1.7 * scale
    this.blob(x, h + 1.2 * scale, z, r, 1.45 * scale, r, g0, Math.round(230 * scale * scale), { sigma: 0.34 })
    this.blob(x + this.rand(-0.5, 0.5), h + 2.3 * scale, z + this.rand(-0.5, 0.5), r * 0.65, r * 0.55, r * 0.65, g1, Math.round(110 * scale * scale), { sigma: 0.3 })
  }

  lamp(x, z) {
    this.cylinder(x, 0, z, 0.07, 3.4, [0.2, 0.21, 0.24], { spacing: 0.2 })
    this.blob(x, 3.6, z, 0.3, 0.36, 0.3, [1.0, 0.93, 0.62, 1], 40, { sigma: 0.2, kind: KIND.STRUCTURE })
  }

  barrel(x, z) {
    const c = this.rand() < 0.5 ? [0.55, 0.32, 0.2] : [0.36, 0.4, 0.45]
    this.cylinder(x, 0, z, 0.36, 0.95, (ang, y) => (y > 0.25 && y < 0.35) || (y > 0.6 && y < 0.7) ? [0.25, 0.25, 0.27] : c, { spacing: 0.2, cap: true })
  }

  crate(x, z, s = 1) {
    const w = this.rand(0.8, 1.2) * s
    const ext = this.walls(x, z, w, w, 0, w, () => (a, b) => (b > w - 0.12 || b < 0.12 || a < 0.12 || a > w - 0.12 ? [0.42, 0.3, 0.18] : WOOD), { spacing: 0.2 })
    this.face([ext.x0, w, ext.z0], [1, 0, 0], w, [0, 0, 1], w, [0, 1, 0], WOOD, { spacing: 0.2, ao: false })
  }

  bench(x, z, along) {
    const ux = along ? 1 : 0, uz = along ? 0 : 1
    const w = 1.7, d = 0.45, h = 0.45
    const cx = x, cz = z
    this.walls(cx, cz, along ? w : d, along ? d : w, 0.04, h - 0.04, () => WOOD, { spacing: 0.18 })
    const ext = { x0: cx - (along ? w : d) / 2, z0: cz - (along ? d : w) / 2 }
    this.face([ext.x0, h, ext.z0], [1, 0, 0], along ? w : d, [0, 0, 1], along ? d : w, [0, 1, 0], WOOD, { spacing: 0.18, ao: false })
    void ux; void uz
  }

  fountain(cx, cz) {
    const R = 3.3
    this.cylinder(cx, 0, cz, R, 0.8, STONE, { spacing: 0.26 })
    this.disc(cx, 0.8, cz, R, STONE, { spacing: 0.24, inner: R - 0.6 })
    this.cylinder(cx, 0, cz, R - 0.6, 0.8, [0.5, 0.49, 0.45], { spacing: 0.26 })
    this.disc(cx, 0.6, cz, R - 0.6, (r, ang) => [0.33 + 0.06 * Math.sin(r * 5 + ang * 3), 0.58, 0.8, 0, 225], { spacing: 0.3 })
    this.cylinder(cx, 0.6, cz, 0.5, 1.6, STONE, { spacing: 0.22 })
    this.disc(cx, 2.2, cz, 1.1, STONE, { spacing: 0.22 })
    this.cylinder(cx, 2.2, cz, 1.1, 0.25, STONE, { spacing: 0.22 })
    this.blob(cx, 2.9, cz, 0.55, 0.7, 0.55, [0.72, 0.86, 0.98, 1, 210], 70, { sigma: 0.22, kind: KIND.STRUCTURE })
  }

  // Low stone wall between two points, with a slab on top.
  lowWall(x0, z0, x1, z1, h = 1.1, t = 0.5) {
    const dx = x1 - x0, dz = z1 - z0
    const len = Math.hypot(dx, dz)
    const ux = dx / len, uz = dz / len
    const nx = uz, nz = -ux // right-hand normal
    const col = [0.6, 0.57, 0.5]
    const o1 = [x0 + nx * t / 2, 0, z0 + nz * t / 2]
    const o2 = [x1 - nx * t / 2, 0, z1 - nz * t / 2]
    this.face(o1, [ux, 0, uz], len, [0, 1, 0], h, [nx, 0, nz], col, { spacing: 0.3 })
    this.face(o2, [-ux, 0, -uz], len, [0, 1, 0], h, [-nx, 0, -nz], col, { spacing: 0.3 })
    this.face([x0 - nx * t / 2, h, z0 - nz * t / 2], [ux, 0, uz], len, [nx, 0, nz], t, [0, 1, 0], [0.66, 0.63, 0.56], { spacing: 0.26, ao: false })
  }

  ground() {
    const spacing = 0.66, half = WORLD_HALF
    const n = Math.round((2 * half) / spacing)
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const x = -half + (i + 0.5 + this.rand(-0.35, 0.35)) * spacing
        const z = -half + (j + 0.5 + this.rand(-0.35, 0.35)) * spacing
        const r = Math.hypot(x, z)
        let c
        if (r < 15.5) {
          const check = (Math.floor(x / 2.2) + Math.floor(z / 2.2)) & 1
          const v = 0.48 + 0.1 * check + this.rand(-0.05, 0.05)
          c = [v + 0.05 + this.rand(0, 0.03), v + 0.02, v - 0.03]
        } else if (Math.abs(x) < 2.4 || Math.abs(z) < 2.4) {
          c = [0.6, 0.5, 0.36]
        } else {
          const g = 0.5 + 0.07 * Math.sin(x * 0.31) * Math.cos(z * 0.23) + 0.05 * Math.sin((x + z) * 0.9) + this.rand(-0.08, 0.08)
          c = [0.27 + g * 0.18, 0.36 + g * 0.3, 0.14 + g * 0.12]
        }
        const s = 0.38 * this.rand(0.85, 1.25)
        this.splat(x, 0, z, 0, 1, 0, s, s * this.rand(0.8, 1.1), 0.05, c[0], c[1], c[2], 255, KIND.GROUND, 0.97)
      }
    }
  }
}

export function buildTown(store, seed = 1337) {
  const rng = mulberry32(seed)
  const B = new Builder(store, rng)

  B.ground()

  const P = PALETTE, R = ROOFS
  // Ring of houses around the plaza, roads along both axes left open.
  const houses = [
    [-14, -23, 9, 8, 9, P.terracotta, R.grey, { roof: 'pitched' }],
    [-4.5, -25, 8, 7, 12, P.cream, R.red, { roof: 'flat' }],
    [15, -22.5, 10, 8, 8, P.dustyBlue, R.brown, { roof: 'pitched' }],
    [-25, -10, 8, 10, 10, P.ochre, R.green, { roof: 'flat' }],
    [-26, 3, 7, 8, 7, P.rose, R.grey, { roof: 'pitched' }],
    [-25, 16, 9, 8, 11, P.white, R.red, { roof: 'pitched' }],
    [25, -11, 8, 9, 9, P.sage, R.brown, { roof: 'pitched' }],
    [26, 4, 9, 8, 13, P.slate, R.grey, { roof: 'flat' }],
    [25, 17, 7, 7, 7, P.mint, R.red, { roof: 'pitched' }],
    [-13, 25, 8, 7, 8, P.plum, R.grey, { roof: 'pitched' }],
    [14, 26, 9, 8, 10, P.ochre, R.green, { roof: 'flat' }],
    [-30, -27, 7, 7, 6, P.cream, R.brown, { roof: 'pitched' }],
    [31, -28, 8, 7, 7, P.rose, R.grey, { roof: 'pitched' }],
    [34, 30, 7, 8, 6, P.sage, R.red, { roof: 'pitched' }],
    [-33, 30, 8, 7, 9, P.dustyBlue, R.grey, { roof: 'flat' }],
  ]
  for (const [x, z, w, d, h, wall, roof, opt] of houses) B.building(x, z, w, d, h, wall, roof, opt)

  // The tower: the tallest thing in town and the obvious first target.
  B.building(6, -25, 6, 6, 17, P.white, R.red, { roof: 'pyramid', rise: 5, door: false })
  B.cylinder(6, 17, -25, 3.6, 0.5, STONE, { spacing: 0.26 }) // balcony lip
  B.disc(6, 17.5, -25, 3.6, STONE, { spacing: 0.26, inner: 3.0 })

  B.fountain(0, 0)
  for (const [x, z] of [[-9, -9], [9, -9], [-9, 9], [9, 9]]) B.lamp(x, z)
  for (const [x, z, a] of [[-6, 0, false], [6, 0, false], [0, -6, true], [0, 6, true]]) B.bench(x, z, a)

  const trees = [
    [-19, -17, 1], [19, -16, 1.1], [-19, 10, 0.9], [19, 11, 1], [-9, 20, 1.1], [8, 19, 0.9],
    [-36, -12, 1.2], [36, -14, 1], [-36, 12, 1], [37, 12, 1.1], [-20, 34, 1], [22, 35, 1.2],
    [-8, -36, 1.1], [12, -36, 1], [-38, 36, 0.9], [38, -36, 1], [0, 36, 1.1], [-38, -36, 1],
  ]
  for (const [x, z, s] of trees) B.tree(x, z, s)

  const barrels = [[-9, -18], [-8.2, -18.6], [-8.8, -17.3], [18, -17], [18.8, -17.4], [-20, 7], [20, 8], [20.8, 7.6], [-6, 21]]
  for (const [x, z] of barrels) B.barrel(x, z)
  const crates = [[-11, -17.5, 1], [-11.6, -16.2, 0.8], [21, -18, 1.1], [21.6, -16.9, 0.8], [-19, 21, 1], [17, 21, 0.9], [17.8, 21.9, 0.7]]
  for (const [x, z, s] of crates) B.crate(x, z, s)

  // Perimeter wall with openings where the roads leave the square.
  const H = WORLD_HALF - 1.5
  for (const s of [1, -1]) {
    B.lowWall(-H, s * H, -3.5, s * H)
    B.lowWall(3.5, s * H, H, s * H)
    B.lowWall(s * H, -H, s * H, -3.5)
    B.lowWall(s * H, 3.5, s * H, H)
  }

  return { count: store.count }
}
