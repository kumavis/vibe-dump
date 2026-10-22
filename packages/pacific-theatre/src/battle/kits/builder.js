// A tiny geometry kit for the ships and aircraft (ENGINEERING.md §6): boxes,
// tapered cylinders, prisms, quads and blobs into one buffer per thing, with
// flat normals, a per-vertex colour and a material code the kits' shaders use
// for small touches (deck planking, glass, a decal, a propeller's blur).
//
// Copied from holo-i-ke-au's src/features/kit.js on the branch
// claude/funny-cannon-vy1pyf (the ahupuaʻa app's Builder): tri, quad, hexa,
// box, cyl and blob are as they were, with the presentation scale set to 1
// (the kits are metres in the model frame of ENGINEERING §2: origin at the
// waterline amidships or the centre of gravity, bow or nose toward −z) and
// the district's feature index dropped. Added: `loft`, a surface swept
// through a list of sections (a hull, a fuselage, a float), `decal`, a quad
// carrying texture coordinates into the insignia atlas, and `ring`.

import * as THREE from 'three'

export const MAT = { plain: 0, deck: 1, glass: 2, decal: 3, prop: 4, dark: 5, wood: 6, metal: 7 }

export class Builder {
  constructor() {
    this.pos = []
    this.nor = []
    this.col = []
    this.mat = []
    this.uv = []
    this.xf = null
    this.stack = []
  }

  /** Subsequent geometry is local: metres, rotated about y (rot) and x (pitch), placed at (x, y, z). */
  at(x, y, z, rot = 0, pitch = 0) {
    this.stack.push(this.xf)
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    const cp = Math.cos(pitch)
    const sp = Math.sin(pitch)
    const outer = this.xf
    this.xf = (p) => {
      // pitch about x first (nose up positive for −z forward), then yaw about y
      const y1 = p[1] * cp + p[2] * sp
      const z1 = -p[1] * sp + p[2] * cp
      const q = [x + p[0] * c - z1 * s, y + y1, z + p[0] * s + z1 * c]
      return outer ? outer(q) : q
    }
    return this
  }

  done() {
    this.xf = this.stack.pop() || null
    return this
  }

  tri(a, b, c, color, mat = 0, uvs = null) {
    if (this.xf) {
      a = this.xf(a)
      b = this.xf(b)
      c = this.xf(c)
    }
    const ux = b[0] - a[0]
    const uy = b[1] - a[1]
    const uz = b[2] - a[2]
    const vx = c[0] - a[0]
    const vy = c[1] - a[1]
    const vz = c[2] - a[2]
    let nx = uy * vz - uz * vy
    let ny = uz * vx - ux * vz
    let nz = ux * vy - uy * vx
    const l = Math.hypot(nx, ny, nz)
    if (l < 1e-12) return // (a degenerate triangle: nothing to draw)
    nx /= l
    ny /= l
    nz /= l
    const col = typeof color === 'function' ? color((a[0] + b[0] + c[0]) / 3, (a[1] + b[1] + c[1]) / 3, (a[2] + b[2] + c[2]) / 3, ny) : color
    const P = [a, b, c]
    for (let k = 0; k < 3; k++) {
      const p = P[k]
      this.pos.push(p[0], p[1], p[2])
      this.nor.push(nx, ny, nz)
      this.col.push(col[0], col[1], col[2])
      this.mat.push(mat)
      if (uvs) this.uv.push(uvs[k][0], uvs[k][1])
      else this.uv.push(0, 0)
    }
  }

  quad(a, b, c, d, color, mat = 0, uvs = null) {
    this.tri(a, b, c, color, mat, uvs && [uvs[0], uvs[1], uvs[2]])
    this.tri(a, c, d, color, mat, uvs && [uvs[0], uvs[2], uvs[3]])
  }

  /** A closed six-sided solid from its bottom and top rings (corners (-x,-z), (+x,-z), (+x,+z), (-x,+z)). */
  hexa(b, t, color, mat = 0) {
    this.quad(t[0], t[3], t[2], t[1], color, mat)
    this.quad(b[0], b[1], b[2], b[3], color, mat)
    for (let k = 0; k < 4; k++) this.quad(b[k], t[k], t[(k + 1) % 4], b[(k + 1) % 4], color, mat)
  }

  /** Box centred at (x, y0..y0+h, z), optionally rotated about y; `taper` shrinks its top. */
  box(x, y0, z, sx, h, sz, color, mat = 0, rot = 0, taper = 1) {
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    const P = (lx, ly, lz) => [x + lx * c - lz * s, y0 + ly, z + lx * s + lz * c]
    const hx = sx / 2
    const hz = sz / 2
    const tx = hx * taper
    const tz = hz * taper
    const b = [P(-hx, 0, -hz), P(hx, 0, -hz), P(hx, 0, hz), P(-hx, 0, hz)]
    const t = [P(-tx, h, -tz), P(tx, h, -tz), P(tx, h, tz), P(-tx, h, tz)]
    if (h < 0) this.hexa(t, b, color, mat)
    else this.hexa(b, t, color, mat)
  }

  /** Tapered cylinder between two points; `cap` closes both ends. */
  cyl(a, b, r0, r1, color, mat = 0, seg = 6, cap = false) {
    const d = [b[0] - a[0], b[1] - a[1], b[2] - a[2]]
    const len = Math.hypot(...d) || 1
    const ax = d.map((v) => v / len)
    const ref = Math.abs(ax[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]
    let u = [ax[1] * ref[2] - ax[2] * ref[1], ax[2] * ref[0] - ax[0] * ref[2], ax[0] * ref[1] - ax[1] * ref[0]]
    const ul = Math.hypot(...u)
    u = u.map((v) => v / ul)
    const v = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]]
    const ring = (o, r, k) => {
      const t = (k / seg) * Math.PI * 2
      const ct = Math.cos(t) * r
      const st = Math.sin(t) * r
      return [o[0] + u[0] * ct + v[0] * st, o[1] + u[1] * ct + v[1] * st, o[2] + u[2] * ct + v[2] * st]
    }
    for (let k = 0; k < seg; k++) this.quad(ring(a, r0, k), ring(a, r0, k + 1), ring(b, r1, k + 1), ring(b, r1, k), color, mat)
    if (cap) {
      for (let k = 0; k < seg; k++) {
        if (r0 > 0) this.tri(a, ring(a, r0, k + 1), ring(a, r0, k), color, mat)
        if (r1 > 0) this.tri(b, ring(b, r1, k), ring(b, r1, k + 1), color, mat)
      }
    }
  }

  /** A low irregular blob (a cloud of smoke, a rock): an icosahedron, jittered. */
  blob(x, y, z, rx, ry, rz, color, mat = 0, seed = 0) {
    const t = (1 + Math.sqrt(5)) / 2
    const V = [[-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1]]
    const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]]
    const jit = (i) => 0.85 + 0.3 * Math.abs((Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453) % 1)
    const P = V.map((p, i) => {
      const l = Math.hypot(...p)
      const j = jit(i)
      return [x + (p[0] / l) * rx * j, y + (p[1] / l) * ry * j, z + (p[2] / l) * rz * j]
    })
    for (const f of F) this.tri(P[f[0]], P[f[1]], P[f[2]], color, mat)
  }

  /**
   * A surface swept through sections: `sections` is a list of rings, each a
   * list of [x, y, z] points with the same count. `closed` joins each ring's
   * last point to its first; `capStart` / `capEnd` close the ends with a fan.
   * color may be a function (x, y, z, ny) → [r, g, b] of a face's centre.
   */
  loft(sections, color, { closed = true, capStart = false, capEnd = false, mat = 0 } = {}) {
    const n = sections[0].length
    for (let i = 0; i + 1 < sections.length; i++) {
      const A = sections[i]
      const B = sections[i + 1]
      const m = closed ? n : n - 1
      for (let k = 0; k < m; k++) {
        const k1 = (k + 1) % n
        this.quad(A[k], B[k], B[k1], A[k1], color, mat)
      }
    }
    const fan = (R, flip) => {
      const c = R.reduce((s, p) => [s[0] + p[0] / R.length, s[1] + p[1] / R.length, s[2] + p[2] / R.length], [0, 0, 0])
      for (let k = 0; k < R.length; k++) {
        const k1 = (k + 1) % R.length
        if (flip) this.tri(c, R[k1], R[k], color, mat)
        else this.tri(c, R[k], R[k1], color, mat)
      }
    }
    if (capStart) fan(sections[0], false)
    if (capEnd) fan(sections[sections.length - 1], true)
  }

  /** A flat quad carrying atlas coordinates (0..1 across it): an insignia on a wing or a fuselage. */
  decal(a, b, c, d, color = [1, 1, 1]) {
    this.quad(a, b, c, d, color, MAT.decal, [
      [0, 0],
      [1, 0],
      [1, 1],
      [0, 1],
    ])
  }

  /** A flat disc of n segments about a centre with a normal along +y, radius r (its top face only). */
  disc(cx, cy, cz, r, color, mat = 0, n = 16) {
    for (let k = 0; k < n; k++) {
      const a0 = (k / n) * Math.PI * 2
      const a1 = ((k + 1) / n) * Math.PI * 2
      this.tri([cx, cy, cz], [cx + Math.cos(a1) * r, cy, cz + Math.sin(a1) * r], [cx + Math.cos(a0) * r, cy, cz + Math.sin(a0) * r], color, mat)
    }
  }

  get count() {
    return this.pos.length / 3
  }

  geometry() {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    g.setAttribute('normal', new THREE.Float32BufferAttribute(this.nor, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    g.setAttribute('aMat', new THREE.Float32BufferAttribute(this.mat, 1))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(this.uv, 2))
    g.computeBoundingBox()
    g.computeBoundingSphere()
    return g
  }
}

/** Several builders' geometries as one (the same attributes, appended). */
export function mergeGeometries(geoms) {
  const out = new THREE.BufferGeometry()
  for (const name of ['position', 'normal', 'color', 'aMat', 'uv']) {
    const parts = geoms.map((g) => g.attributes[name])
    const size = parts[0].itemSize
    const total = parts.reduce((s, a) => s + a.array.length, 0)
    const arr = new Float32Array(total)
    let o = 0
    for (const a of parts) {
      arr.set(a.array, o)
      o += a.array.length
    }
    out.setAttribute(name, new THREE.BufferAttribute(arr, size))
  }
  out.computeBoundingBox()
  out.computeBoundingSphere()
  return out
}
