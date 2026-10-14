import * as THREE from 'three'
import { Rng, hash2 } from '../core/rng.js'

// Vegetation: procedural low-poly plants, scattered from the island's density
// grids. Two tiers:
//   big   trees and boulders — placed once at boot, chunked, three LODs each,
//         and every trunk is a physics collider
//   small ferns, grass, reeds, bushes — streamed in chunks around the camera;
//         no colliders, but they are the cover the stealth model counts
//
// LOD changes never pop: each instance picks its LOD by its own distance to
// the camera, and neighbouring LODs overlap in a band where one dithers out as
// the other dithers in (see vegMaterial). The LODs of a plant share one shape,
// so the cross-fade only changes how finely it is cut.
//
// Every type is one entry in TYPES; add a plant by writing a builder for it.

// ------------------------------------------------------------ geometry builder

class Builder {
  constructor() {
    this.pos = []
    this.col = []
    this.sway = []
  }
  tri(a, b, c, col, sa = 0, sb = sa, sc = sa) {
    this.pos.push(...a, ...b, ...c)
    const cols = Array.isArray(col) ? col : [col, col, col]
    for (const k of cols) this.col.push(k.r, k.g, k.b)
    this.sway.push(sa, sb, sc)
  }
  quad(a, b, c, d, col, sa = 0, sb = sa, sc = sa, sd = sa) {
    // a-b-c-d counter-clockwise when seen from the front
    const cols = Array.isArray(col) ? col : [col, col, col, col]
    this.tri(a, b, c, [cols[0], cols[1], cols[2]], sa, sb, sc)
    this.tri(a, c, d, [cols[0], cols[2], cols[3]], sa, sc, sd)
  }
  // Append a three.js primitive. `color(nx, ny, nz, cx, cy, cz)` per face,
  // `sway(x, y, z)` per vertex (in the primitive's transformed space).
  add(geo, matrix, color, sway = () => 0) {
    const g = geo.index ? geo.toNonIndexed() : geo
    g.applyMatrix4(matrix)
    const p = g.attributes.position.array
    const va = new THREE.Vector3()
    const vb = new THREE.Vector3()
    const vc = new THREE.Vector3()
    const n = new THREE.Vector3()
    for (let i = 0; i < p.length; i += 9) {
      va.set(p[i], p[i + 1], p[i + 2])
      vb.set(p[i + 3], p[i + 4], p[i + 5])
      vc.set(p[i + 6], p[i + 7], p[i + 8])
      n.subVectors(vc, vb).cross(vb.clone().sub(va)).normalize().negate()
      const c = typeof color === 'function' ? color(n.x, n.y, n.z, (va.x + vb.x + vc.x) / 3, (va.y + vb.y + vc.y) / 3, (va.z + vb.z + vc.z) / 3) : color
      this.tri([va.x, va.y, va.z], [vb.x, vb.y, vb.z], [vc.x, vc.y, vc.z], c, sway(va.x, va.y, va.z), sway(vb.x, vb.y, vb.z), sway(vc.x, vc.y, vc.z))
    }
    if (g !== geo) g.dispose()
    geo.dispose()
  }
  build() {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(this.pos, 3))
    geo.setAttribute('color', new THREE.Float32BufferAttribute(this.col, 3))
    geo.setAttribute('aSway', new THREE.Float32BufferAttribute(this.sway, 1))
    geo.computeVertexNormals()
    geo.computeBoundingSphere()
    return geo
  }
}

const M = new THREE.Matrix4()
const Q = new THREE.Quaternion()
const E = new THREE.Euler()
const V = new THREE.Vector3()
const S = new THREE.Vector3()
function mat(x, y, z, rx = 0, ry = 0, rz = 0, sx = 1, sy = sx, sz = sx) {
  return new THREE.Matrix4().compose(V.set(x, y, z), Q.setFromEuler(E.set(rx, ry, rz)), S.set(sx, sy, sz))
}

function col(hex, rng, v = 0.08) {
  const c = new THREE.Color(hex)
  const k = 1 + (rng.next() * 2 - 1) * v
  return c.multiplyScalar(k)
}

// Push each vertex by a hash of its position, so the corners a coarse
// icosahedron shares with a finer one move identically at every LOD.
function jitterVerts(geo, seed, amt) {
  const p = geo.attributes.position
  for (let i = 0; i < p.count; i++) {
    const kx = Math.round(p.getX(i) * 1000)
    const ky = Math.round(p.getY(i) * 1000)
    const kz = Math.round(p.getZ(i) * 1000)
    const h = (salt) => (hash2(kx + Math.imul(kz, 7919), ky, seed + salt) - 0.5) * amt
    p.setXYZ(i, p.getX(i) + h(1), p.getY(i) + h(2), p.getZ(i) + h(3))
  }
  return geo
}

// Builders draw a plant's shape (sizes, crown layout, frond angles) first and
// identically at every LOD; colours and LOD-only details then come from a
// second stream, so a coarser LOD cannot drift into a different tree.
const detailRng = (rng) => new Rng(rng.int(1, 2e9))

// A leaf/frond strip from `base` along horizontal direction `dir`, arching by
// `lift(s)` and widening by `width(s)`; optional V fold along the midrib.
function strip(b, base, dirX, dirZ, len, segs, lift, width, colA, colB, fold = 0, swayMul = 1) {
  const px = -dirZ
  const pz = dirX
  let prev = null
  for (let i = 0; i <= segs; i++) {
    const s = i / segs
    const cx = base[0] + dirX * len * s
    const cz = base[2] + dirZ * len * s
    const cy = base[1] + lift(s)
    const w = width(s)
    const c = colA.clone().lerp(colB, s)
    const cur = {
      l: [cx + px * w, cy - fold * w, cz + pz * w],
      m: [cx, cy, cz],
      r: [cx - px * w, cy - fold * w, cz - pz * w],
      c,
      sw: s * swayMul,
    }
    if (prev) {
      if (fold) {
        b.quad(prev.l, cur.l, cur.m, prev.m, [prev.c, cur.c, cur.c, prev.c], prev.sw, cur.sw, cur.sw, prev.sw)
        b.quad(prev.m, cur.m, cur.r, prev.r, [prev.c, cur.c, cur.c, prev.c], prev.sw, cur.sw, cur.sw, prev.sw)
      } else {
        b.quad(prev.l, cur.l, cur.r, prev.r, [prev.c, cur.c, cur.c, prev.c], prev.sw, cur.sw, cur.sw, prev.sw)
      }
    }
    prev = cur
  }
}

// ------------------------------------------------------------------- builders

function canopyTree(rng, lod) {
  const b = new Builder()
  const H = rng.range(14, 20)
  const bend = rng.range(-0.8, 0.8)
  const crowns = []
  for (let k = 0; k < 5; k++) {
    const a = (k / 5) * Math.PI * 2 + rng.range(0, 1)
    crowns.push({ r: rng.range(2.6, 4.2), a, off: k === 0 ? 0 : rng.range(1.8, 3.2), y: H * rng.range(0.8, 0.95), ry: rng.range(0, 3), sy: rng.range(0.5, 0.65), seed: rng.int(1, 1e6) })
  }
  const fins = [0, 1, 2, 3].map((k) => (k / 4) * Math.PI * 2 + rng.range(-0.3, 0.3))
  const branches = [0, 1, 2].map(() => [rng.range(0, Math.PI * 2), H * rng.range(0.55, 0.72)])
  const vines = [0, 1, 2, 3, 4].map(() => [rng.range(0, Math.PI * 2), rng.range(1.5, 3.4), rng.range(4, 9)])
  const d = detailRng(rng)
  const bark = new THREE.Color('#5c4c3a')
  const trunk = new THREE.CylinderGeometry(0.3, 0.55, H * 0.8, [7, 5, 4][lod], lod ? 1 : 4, true)
  trunk.translate(0, H * 0.4, 0)
  const p = trunk.attributes.position
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + Math.sin((p.getY(i) / H) * Math.PI) * bend)
  b.add(trunk, new THREE.Matrix4(), (nx, ny, nz, cx, cy) => col('#5c4c3a', d, 0.1).lerp(new THREE.Color('#7a6a52'), cy / H))
  if (!lod) {
    for (const a of fins) {
      const fin = new THREE.BoxGeometry(0.14, 2.4, 1.5)
      fin.translate(0, 1.0, 0.75)
      b.add(fin, mat(0, 0, 0, -0.18, a, 0), bark.clone().multiplyScalar(0.85))
    }
    for (const [a, y] of branches) {
      const br = new THREE.CylinderGeometry(0.08, 0.16, 3.6, 4, 1, true)
      br.translate(0, 1.8, 0)
      b.add(br, mat(Math.sin(0.65 * Math.PI) * bend, y, 0, 0.95, a, 0), bark)
    }
  }
  // the same five crowns at every LOD: finer near, an octahedron each far out
  for (const c of crowns) {
    const geo = lod === 2 ? new THREE.OctahedronGeometry(c.r * 1.2, 0) : new THREE.IcosahedronGeometry(c.r, lod ? 0 : 1)
    jitterVerts(geo, c.seed, 0.6)
    b.add(
      geo,
      mat(Math.cos(c.a) * c.off + bend * 0.3, c.y, Math.sin(c.a) * c.off, 0, c.ry, 0, 1, c.sy, 1),
      (nx, ny) => col(ny > 0.3 ? '#3f7a2a' : '#2c5a20', d, 0.12),
      (x, y) => Math.max(0, (y - H * 0.7) / (H * 0.3)) * 0.3,
    )
  }
  if (!lod) {
    for (const [a, r, len] of vines) {
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const top = H * 0.78
      const w = 0.07
      const c = col('#3d5f22', d)
      b.quad([x - w, top - len, z], [x + w, top - len, z], [x + w, top, z], [x - w, top, z], c, 0.7, 0.7, 0.2, 0.2)
    }
  }
  return { geo: b.build(), r: 0.55, h: H }
}

function palm(rng, lod) {
  const b = new Builder()
  const H = rng.range(6, 10)
  const lean = rng.range(0.12, 0.4)
  const fronds = []
  for (let k = 0; k < 10; k++) fronds.push({ a: (k / 10) * Math.PI * 2 + rng.range(-0.2, 0.2), L: rng.range(3.2, 4.4), droop: rng.range(1.8, 2.8) })
  const d = detailRng(rng)
  const segs = [8, 4, 2][lod]
  const pt = (t) => [lean * H * t * t, H * t, 0]
  for (let i = 0; i < segs; i++) {
    const a = pt(i / segs)
    const c = pt((i + 1) / segs)
    const dx = c[0] - a[0]
    const dy = c[1] - a[1]
    const len = Math.hypot(dx, dy)
    const cyl = new THREE.CylinderGeometry(0.17, 0.2, len, lod ? 4 : 6, 1, true)
    cyl.translate(0, len / 2, 0)
    b.add(cyl, mat(a[0], a[1], 0, 0, 0, -Math.atan2(dx, dy)), col(i % 2 ? '#8a7550' : '#6e5c40', d, 0.05), () => (i / segs) * 0.15)
  }
  const top = pt(1)
  // far out, every other frond, wider, keeps the same starburst
  const keep = lod === 2 ? fronds.filter((f, k) => k % 2 === 0) : fronds
  const wide = lod === 2 ? 1.45 : 1
  for (const f of keep) {
    strip(
      b,
      top,
      Math.cos(f.a),
      Math.sin(f.a),
      f.L,
      [6, 3, 2][lod],
      (s) => f.L * (0.45 * s) - f.droop * s * s,
      (s) => (0.6 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 0.9 + 0.08)), 0.7) + 0.04) * wide,
      col('#4a7f2a', d, 0.1),
      col('#79a845', d, 0.1),
      lod ? 0 : 0.35,
      1,
    )
  }
  if (!lod) {
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2
      b.add(new THREE.IcosahedronGeometry(0.16, 0), mat(top[0] + Math.cos(a) * 0.25, top[1] - 0.25, Math.sin(a) * 0.25), col('#4a3a1a', d))
    }
  }
  return { geo: b.build(), r: 0.28, h: H }
}

function broadleaf(rng, lod, variant) {
  const b = new Builder()
  const flat = variant === 1
  const H = flat ? rng.range(5, 7) : rng.range(6, 9)
  const crowns = []
  for (let k = 0; k < 4; k++) {
    crowns.push({ r: flat ? rng.range(2.6, 3.4) : rng.range(1.8, 2.6), a: rng.range(0, Math.PI * 2), off: k ? rng.range(1, 2) : 0, dy: k ? rng.range(-0.6, 0.8) : 0, seed: rng.int(1, 1e6) })
  }
  const d = detailRng(rng)
  const trunk = new THREE.CylinderGeometry(0.16, 0.3, H * 0.7, lod ? 4 : 6, 1, true)
  trunk.translate(0, H * 0.35, 0)
  b.add(trunk, new THREE.Matrix4(), col('#5e4e3c', d))
  for (const c of crowns) {
    const geo = lod === 2 ? new THREE.OctahedronGeometry(c.r * 1.2, 0) : new THREE.IcosahedronGeometry(c.r, lod ? 0 : 1)
    jitterVerts(geo, c.seed, 0.4)
    b.add(
      geo,
      mat(Math.cos(c.a) * c.off, H * (flat ? 0.88 : 0.78) + c.dy, Math.sin(c.a) * c.off, 0, c.a, 0, 1, flat ? 0.32 : 0.75, 1),
      (nx, ny) => col(ny > 0.2 ? (flat ? '#6f8a3a' : '#4f8034') : flat ? '#4e6a2a' : '#365e26', d, 0.1),
      (x, y) => Math.max(0, y / H - 0.6) * 0.5,
    )
  }
  return { geo: b.build(), r: 0.3, h: H }
}

function pine(rng, lod) {
  const b = new Builder()
  const H = rng.range(7, 12)
  const spins = [0, 1, 2, 3, 4].map(() => rng.range(0, 3))
  const d = detailRng(rng)
  const trunk = new THREE.CylinderGeometry(0.12, 0.25, H, lod === 2 ? 4 : 5, 1, true)
  trunk.translate(0, H / 2, 0)
  b.add(trunk, new THREE.Matrix4(), col('#4e3e30', d))
  // five tiers near; far out three taller ones fill the same cone
  const tiers = lod === 2 ? [0, 2, 4] : [0, 1, 2, 3, 4]
  for (const k of tiers) {
    const t = k / 5
    const r = 2.4 * (1 - t * 0.75)
    const cone = new THREE.ConeGeometry(r, H * 0.38 * (lod === 2 ? 1.35 : 1), [7, 5, 4][lod], 1, true)
    b.add(cone, mat(0, H * (0.3 + t * 0.62), 0, 0, spins[k], 0), (nx, ny) => col(ny > 0.4 ? '#36583a' : '#24402a', d, 0.08), (x, y) => (y / H) * 0.25)
  }
  return { geo: b.build(), r: 0.28, h: H }
}

function rock(rng, lod) {
  const b = new Builder()
  const pose = mat(0, 0.25, 0, rng.range(0, 3), rng.range(0, 3), 0, rng.range(1.1, 1.6), rng.range(0.6, 0.9), rng.range(0.9, 1.3))
  const seed = rng.int(1, 1e6)
  const d = detailRng(rng)
  const ico = jitterVerts(new THREE.IcosahedronGeometry(1, lod ? 0 : 1), seed, 0.45)
  b.add(ico, pose, (nx, ny) => (ny > 0.55 ? col('#5e6a3c', d, 0.12) : col('#7a766c', d, 0.12)))
  return { geo: b.build(), r: 1.1, h: 1.2 }
}

function fern(rng) {
  const b = new Builder()
  const n = rng.int(7, 10)
  const size = rng.range(0.8, 1.35)
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + rng.range(-0.2, 0.2)
    const L = size * rng.range(0.9, 1.25)
    const up = rng.range(0.7, 1.0)
    strip(
      b,
      [0, 0.02, 0],
      Math.cos(a),
      Math.sin(a),
      L,
      3,
      (s) => L * (up * s - 0.8 * s * s),
      (s) => 0.17 * Math.sin(Math.PI * s) + 0.02,
      col('#2f6a26', rng, 0.1),
      col('#5ea845', rng, 0.1),
      0,
      1,
    )
  }
  return { geo: b.build() }
}

function bush(rng) {
  const b = new Builder()
  const n = rng.int(2, 3)
  for (let k = 0; k < n; k++) {
    const r = rng.range(0.55, 0.95)
    const ico = jitterVerts(new THREE.IcosahedronGeometry(r, 0), rng.int(1, 1e6), 0.3)
    b.add(ico, mat(rng.range(-0.5, 0.5), r * 0.7, rng.range(-0.5, 0.5), 0, rng.range(0, 3), 0, 1, 0.8, 1), (nx, ny) => col(ny > 0.3 ? '#4a7432' : '#30522a', rng, 0.1), (x, y) => y * 0.3)
  }
  return { geo: b.build() }
}

function grass(rng) {
  const b = new Builder()
  const n = rng.int(12, 18)
  const tall = rng.range(0.75, 1.35)
  const base = new THREE.Color('#5d6e2a')
  const tip = new THREE.Color(rng.chance(0.5) ? '#c2bc62' : '#a8b452')
  for (let k = 0; k < n; k++) {
    const a = rng.range(0, Math.PI * 2)
    const r = rng.range(0, 0.35)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const h = tall * rng.range(0.7, 1.1)
    const lean = rng.range(0.1, 0.4)
    const w = 0.05
    const px = -Math.sin(a) * w
    const pz = Math.cos(a) * w
    b.tri([x - px, 0, z - pz], [x + px, 0, z + pz], [x + Math.cos(a) * lean, h, z + Math.sin(a) * lean], [base, base, tip.clone().multiplyScalar(rng.range(0.85, 1.1))], 0, 0, 1)
  }
  return { geo: b.build() }
}

function reed(rng) {
  const b = new Builder()
  const n = rng.int(9, 14)
  const base = new THREE.Color('#4a5a26')
  const tip = new THREE.Color('#8a9a48')
  for (let k = 0; k < n; k++) {
    const x = rng.range(-0.35, 0.35)
    const z = rng.range(-0.35, 0.35)
    const h = rng.range(1.4, 2.3)
    const w = 0.035
    const lx = rng.range(-0.15, 0.15)
    const lz = rng.range(-0.15, 0.15)
    b.tri([x - w, 0, z], [x + w, 0, z], [x + lx, h, z + lz], [base, base, tip], 0, 0, 1)
    b.tri([x, 0, z - w], [x, 0, z + w], [x + lx, h, z + lz], [base, base, tip], 0, 0, 1)
    if (k < 3) {
      const cat = new THREE.CylinderGeometry(0.04, 0.04, 0.26, 4)
      b.add(cat, mat(x + lx * 0.9, h * 0.9, z + lz * 0.9), new THREE.Color('#4a3420'), () => 0.9)
    }
  }
  return { geo: b.build() }
}

function bigleaf(rng) {
  const b = new Builder()
  const n = rng.int(4, 7)
  for (let k = 0; k < n; k++) {
    const a = (k / n) * Math.PI * 2 + rng.range(-0.3, 0.3)
    const h = rng.range(0.7, 1.6)
    const out = rng.range(0.2, 0.5)
    const tx = Math.cos(a) * out
    const tz = Math.sin(a) * out
    const stalk = new THREE.CylinderGeometry(0.02, 0.035, h, 3, 1, true)
    stalk.translate(0, h / 2, 0)
    b.add(stalk, mat(0, 0, 0, Math.sin(a) * 0.3, 0, -Math.cos(a) * 0.3), new THREE.Color('#4a7a30'), (x, y) => y / h)
    const L = rng.range(0.8, 1.3)
    strip(
      b,
      [tx, h, tz],
      Math.cos(a),
      Math.sin(a),
      L,
      3,
      (s) => L * (0.15 * s - 0.55 * s * s),
      (s) => 0.4 * Math.sin(Math.PI * Math.pow(s, 0.8)) + 0.01,
      col('#2a6a24', rng, 0.1),
      col('#3f8a30', rng, 0.1),
      0.25,
      1,
    )
  }
  return { geo: b.build() }
}

function log(rng) {
  const b = new Builder()
  const L = rng.range(3.5, 7)
  const r = rng.range(0.25, 0.45)
  const cyl = new THREE.CylinderGeometry(r * 0.85, r, L, 6, 1)
  b.add(cyl, mat(0, r * 0.7, 0, 0, 0, Math.PI / 2), (nx, ny) => (ny > 0.5 ? col('#4f6030', rng, 0.1) : col('#5a4834', rng, 0.1)))
  const stub = new THREE.CylinderGeometry(0.06, 0.12, 1.2, 4, 1, true)
  b.add(stub, mat(L * 0.2, r + 0.4, 0, 0, 0, 0.5), col('#5a4834', rng))
  return { geo: b.build() }
}

// ---------------------------------------------------------------- type table

// spacing: jitter-grid cell size at density 1 (m). sink: push into ground.
// noFar: no LOD2 — the type just fades out at the draw distance (boulders
// are a few pixels by then). farMerge: one LOD2 shape for both variants (they
// differ little past the draw distance), which halves the far draw calls.
const TYPES = {
  canopy: { builder: canopyTree, tier: 'big', spacing: 8.5, scale: [0.8, 1.25], sink: 0.4, variants: 2, shadow: true, farMerge: true },
  palm: { builder: palm, tier: 'big', spacing: 9.5, scale: [0.85, 1.2], sink: 0.2, variants: 2, shadow: true, farMerge: true },
  broadleaf: { builder: broadleaf, tier: 'big', spacing: 13, scale: [0.8, 1.25], sink: 0.2, variants: 2, shadow: true },
  pine: { builder: pine, tier: 'big', spacing: 9, scale: [0.8, 1.3], sink: 0.2, variants: 2, shadow: true, farMerge: true },
  rock: { builder: rock, tier: 'big', spacing: 15, scale: [0.6, 2.6], sink: 0.35, variants: 2, shadow: true, tilt: true, noFar: true },
  fern: { builder: fern, tier: 'small', spacing: 2.3, scale: [0.75, 1.3], sink: 0, variants: 2 },
  bigleaf: { builder: bigleaf, tier: 'small', spacing: 3.2, scale: [0.8, 1.4], sink: 0, variants: 2 },
  bush: { builder: bush, tier: 'small', spacing: 4.2, scale: [0.7, 1.4], sink: 0.1, variants: 2 },
  grass: { builder: grass, tier: 'small', spacing: 1.6, scale: [0.8, 1.2], sink: 0, variants: 3 },
  reed: { builder: reed, tier: 'small', spacing: 1.7, scale: [0.8, 1.2], sink: 0, variants: 2 },
  log: { builder: log, tier: 'small', spacing: 14, scale: [0.8, 1.2], sink: 0.15, variants: 2 },
}

// ---------------------------------------------------------------- material

// Wind sway, parting where something pushes through, and the LOD fade. Each
// material owns a band (in0, in1, out0, out1): an instance fades in between
// in0 and in1 metres from the camera and out between out0 and out1, measured
// from its own origin (instanceMatrix), so a whole plant fades as one. The
// fade is an ordered 8x8 Bayer dither with discard; a fade-in uses the
// complement of the threshold, so where one LOD fades out over a band and the
// next fades in over the same band they split the pixels between them —
// never both, never neither. The depth (shadow) pass runs the same code, so
// shadows cross-fade with the trees that cast them.
function vegShader(shader, u, band) {
  shader.uniforms.uTime = u.uTime
  shader.uniforms.uWind = u.uWind
  shader.uniforms.uPush = u.uPush
  shader.uniforms.uCam = u.uCam
  shader.uniforms.uBand = band
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      `#include <common>
       attribute float aSway;
       uniform float uTime;
       uniform float uWind;
       uniform vec4 uPush;
       uniform vec3 uCam;
       uniform vec4 uBand;
       varying vec2 vLodFade;`,
    )
    .replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       #ifdef USE_INSTANCING
         vec3 iw = (modelMatrix * instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
       #else
         vec3 iw = (modelMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
       #endif
       vec2 ip = iw.xz;
       float ph = ip.x * 0.37 + ip.y * 0.23;
       float sw = aSway * uWind;
       transformed.x += sin(uTime * 1.7 + ph + position.y * 0.35) * 0.13 * sw;
       transformed.z += cos(uTime * 1.3 + ph * 1.31) * 0.1 * sw;
       // whatever brushes through (the player, rotor wash) parts the leaves
       vec2 away = ip - uPush.xy;
       float pd = length(away);
       float pk = aSway * uPush.w * (1.0 - smoothstep(0.0, uPush.z, pd));
       transformed.xz += normalize(away + 0.001) * pk * 0.5 * position.y;
       float camD = distance(iw, uCam);
       vLodFade = vec2(smoothstep(uBand.x, uBand.y, camD), 1.0 - smoothstep(uBand.z, uBand.w, camD));`,
    )
  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      `#include <common>
       varying vec2 vLodFade;
       float bayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
       float bayer8(vec2 a) { return bayer2(a) + bayer2(0.5 * a) * 0.25 + bayer2(0.25 * a) * 0.0625; }`,
    )
    .replace(
      'void main() {',
      `void main() {
       float lodT = bayer8(gl_FragCoord.xy) + 0.0078125;
       if (vLodFade.y <= lodT || vLodFade.x <= 1.0 - lodT) discard;`,
    )
}

function vegMaterial(u, band) {
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true, side: THREE.DoubleSide })
  mat.onBeforeCompile = (shader) => vegShader(shader, u, band)
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking, side: THREE.DoubleSide })
  depth.onBeforeCompile = (shader) => vegShader(shader, u, band)
  return { mat, depth }
}

// LOD bands in metres. near: LOD0 hands over to LOD1; mid: LOD1 to LOD2 ends
// at the quality's draw distance; far: LOD2 thins into the fog; small: the
// streamed undergrowth fades in at the edge of its radius. `margin` is the
// slack the per-instance LOD lists keep so they only need rebuilding every
// margin / 2 of camera travel.
const FADE = { near: [30, 42], mid: 18, far: 100, small: 14, margin: 8 }

// ---------------------------------------------------------------- system

export class Vegetation {
  constructor(island, physics, scene, seed) {
    this.island = island
    this.physics = physics
    this.scene = scene
    this.seed = seed
    this.uniforms = { uTime: { value: 0 }, uWind: { value: 1 }, uPush: { value: new THREE.Vector4(0, 0, 3, 0) }, uCam: { value: new THREE.Vector3() } }
    this.group = new THREE.Group()
    this.group.name = 'vegetation'
    scene.add(this.group)
    this.drawDist = 330
    this.farDist = 1100
    this.smallRadius = 95
    this.shadowDist = 110
    this.bands = {}
    this.mats = {}
    for (const k of ['near', 'mid', 'far', 'small']) {
      this.bands[k] = { value: new THREE.Vector4() }
      this.mats[k] = vegMaterial(this.uniforms, this.bands[k])
    }
    this.setBands()

    // geometry library: geos[type][variant][lod]
    this.geos = {}
    this.meta = {}
    let ti = 0
    for (const [name, t] of Object.entries(TYPES)) {
      ti++
      this.geos[name] = []
      this.meta[name] = []
      for (let v = 0; v < t.variants; v++) {
        const lods = []
        let meta
        // every LOD of a variant starts from the same seed (and the builders
        // draw the shape before anything LOD-specific), so the far versions
        // keep the near one's height, crowns and proportions
        const vseed = Math.floor(hash2(v, ti, seed) * 1e9)
        for (let lod = 0; lod < (t.tier === 'big' ? 3 : 1); lod++) {
          const out = t.builder(new Rng(vseed), lod, v)
          lods.push(out.geo)
          if (!meta) meta = out
        }
        this.geos[name].push(lods)
        this.meta[name].push({ r: meta.r || 0, h: meta.h || 1 })
      }
    }

    this.bigChunk = 200
    this.chunks = []
    this.nearGrid = new Map() // 32 m cells of big instances, for the LOD0 set
    this.placeBig()
    this.small = new Map()
    this.smallChunk = 48
    this.initNear()
  }

  setBands() {
    const d1 = this.drawDist
    this.bands.near.value.set(-1, 0, FADE.near[0], FADE.near[1])
    this.bands.mid.value.set(FADE.near[0], FADE.near[1], d1 - FADE.mid, d1)
    this.bands.far.value.set(d1 - FADE.mid, d1, this.farDist - FADE.far, this.farDist)
    this.bands.small.value.set(-1, 0, this.smallRadius - FADE.small, this.smallRadius)
  }

  setQuality(q) {
    this.drawDist = q.drawDist
    this.smallRadius = q.smallRadius
    this.shadowDist = q.shadows ? 110 : 0
    this.setBands()
    for (const c of this.chunks) c.key = null // refill at the new distances
    // drop the small chunks so they rebuild at the new radius
    for (const c of this.small.values()) this.disposeSmall(c)
    this.small.clear()
  }

  placeBig() {
    const isl = this.island
    const chunkOf = new Map()
    const getChunk = (x, z) => {
      const cx = Math.floor(x / this.bigChunk)
      const cz = Math.floor(z / this.bigChunk)
      const k = cx * 1000 + cz
      let c = chunkOf.get(k)
      if (!c) {
        c = { cx, cz, x: (cx + 0.5) * this.bigChunk, z: (cz + 0.5) * this.bigChunk, lists: {}, parts: [], fars: [], minY: Infinity, maxY: -Infinity, key: null, at: null }
        chunkOf.set(k, c)
      }
      return c
    }
    const half = isl.half
    let ti = 0
    for (const [name, t] of Object.entries(TYPES)) {
      ti++
      if (t.tier !== 'big') continue
      const grid = isl.d[name]
      const sp = t.spacing
      const rng = new Rng(this.seed + ti * 7919)
      for (let z = -half; z < half; z += sp) {
        for (let x = -half; x < half; x += sp) {
          const px = x + rng.next() * sp
          const pz = z + rng.next() * sp
          const d = isl.sample(grid, px, pz)
          const roll = rng.next()
          const v = rng.int(0, t.variants - 1)
          const s = rng.range(t.scale[0], t.scale[1])
          const yaw = rng.range(0, Math.PI * 2)
          if (roll >= d) continue
          // the density grid is 5 m coarse, so its bilinear blur can still
          // stand a trunk on a road; keep carriageways and verges drivable
          if (isl.sample(isl.road, px, pz) > 0.02 || isl.sample(isl.clear, px, pz) > 0.35) continue
          const y = isl.heightAt(px, pz) - t.sink * s
          const meta = this.meta[name][v]
          const inst = { x: px, y, z: pz, yaw, s, v, tilt: t.tilt ? [rng.range(-0.4, 0.4), rng.range(-0.4, 0.4)] : null }
          const c = getChunk(px, pz)
          ;(c.lists[name] ||= []).push(inst)
          if (meta.r > 0) {
            const r = meta.r * s
            this.physics.addCylinder(px, pz, r, y - 1, y + meta.h * s, { tag: name === 'rock' ? 'rock' : 'tree' })
          }
        }
      }
    }
    // per chunk: an LOD1 mesh per type and variant, and LOD2 meshes over the
    // same instances — one per type where the variants read alike that far
    // out (farMerge: variant 1 is drawn as variant 0 scaled to its height),
    // else one per variant. update() picks which instances each one draws.
    const m4 = new THREE.Matrix4()
    const sc = new THREE.Matrix4()
    for (const c of chunkOf.values()) {
      for (const [name, list] of Object.entries(c.lists)) {
        const t = TYPES[name]
        for (const it of list) {
          E.set(it.tilt ? it.tilt[0] : 0, it.yaw, it.tilt ? it.tilt[1] : 0)
          m4.compose(V.set(it.x, it.y, it.z), Q.setFromEuler(E), S.set(it.s, it.s, it.s))
          it.matrix = m4.clone()
          const k = this.meta[name][it.v].h / this.meta[name][0].h
          it.farMatrix = t.farMerge && it.v ? m4.clone().multiply(sc.makeScale(k, k, k)) : it.matrix
          it.type = name
          c.minY = Math.min(c.minY, it.y)
          c.maxY = Math.max(c.maxY, it.y)
          const key = Math.floor(it.x / 32) * 1000 + Math.floor(it.z / 32)
          let cell = this.nearGrid.get(key)
          if (!cell) this.nearGrid.set(key, (cell = []))
          cell.push(it)
        }
        for (let v = 0; v < t.variants; v++) {
          const items = list.filter((it) => it.v === v)
          if (!items.length) continue
          const mid = this.chunkMesh(this.geos[name][v][1], this.mats.mid.mat, items, 'matrix', name, v)
          mid.customDepthMaterial = this.mats.mid.depth
          mid.userData.shadowCount = 0
          mid.onBeforeShadow = shadowPrefix
          mid.onAfterShadow = shadowRestore
          c.parts.push({ type: name, items, mid })
          if (!t.noFar && !t.farMerge) c.fars.push({ items, key: 'matrix', far: this.chunkMesh(this.geos[name][v][2], this.mats.far.mat, items, 'matrix', name, v) })
        }
        if (t.farMerge) c.fars.push({ items: list, key: 'farMatrix', far: this.chunkMesh(this.geos[name][0][2], this.mats.far.mat, list, 'farMatrix', name, 0) })
      }
      delete c.lists
      this.chunks.push(c)
    }
  }

  chunkMesh(geo, material, items, key, type, v) {
    const m = new THREE.InstancedMesh(geo, material, items.length)
    items.forEach((it, i) => m.setMatrixAt(i, it[key]))
    m.computeBoundingSphere()
    m.boundingSphere.radius += 25
    m.count = 0
    m.visible = false
    m.castShadow = false
    m.receiveShadow = false
    m.matrixAutoUpdate = false
    m.userData = { type, v }
    this.group.add(m)
    return m
  }

  update(dt, cam, wind = 1) {
    this.uniforms.uTime.value += dt
    this.uniforms.uWind.value = wind
    this.uniforms.uCam.value.copy(cam)
    // big tier: each chunk's LOD1/LOD2 meshes draw the instances whose own
    // distance falls in (or near) that LOD's band. A chunk no band boundary
    // cuts through is all one or the other and is only refilled when that
    // changes; the chunks a boundary crosses are refilled as the camera moves.
    const M = FADE.margin
    const lo1 = FADE.near[0] - M
    const hi1 = this.drawDist + M
    const lo2 = this.drawDist - FADE.mid - M
    const hi2 = this.farDist + M
    const half = this.bigChunk / 2
    for (const c of this.chunks) {
      const ax = Math.abs(c.x - cam.x)
      const az = Math.abs(c.z - cam.z)
      const dmin = Math.hypot(Math.max(0, ax - half), Math.max(0, az - half), Math.max(0, c.minY - cam.y, cam.y - c.maxY))
      const dmax = Math.hypot(ax + half, az + half, Math.max(Math.abs(cam.y - c.minY), Math.abs(cam.y - c.maxY)))
      const cut = (b) => b > dmin && b < dmax
      const sr = this.shadowDist + M
      let key
      if (cut(lo1) || cut(hi1) || cut(lo2) || cut(hi2) || (this.shadowDist && cut(sr))) {
        key = 'mixed'
        if (c.key !== key || Math.hypot(cam.x - c.at.x, cam.y - c.at.y, cam.z - c.at.z) > M / 2) this.fillChunk(c, cam, lo1, hi1, lo2, hi2)
      } else {
        key = (dmax > lo1 && dmin < hi1 ? 'L1' : '') + (dmax > lo2 && dmin < hi2 ? 'L2' : '') + (dmax < sr ? 'S' : '')
        if (c.key !== key) this.fillWhole(c, key.includes('L1'), key.includes('L2'), key.includes('S'))
      }
      c.key = key
      for (const p of c.parts) p.mid.castShadow = this.shadowDist > 0 && TYPES[p.type].shadow && p.mid.userData.shadowCount > 0
    }
    // ...while the trees right around the camera are drawn at full detail
    this.updateNear(cam)
    // small tier: stream chunks within radius
    const cs = this.smallChunk
    const R = this.smallRadius
    const ccx = Math.floor(cam.x / cs)
    const ccz = Math.floor(cam.z / cs)
    const span = Math.ceil(R / cs) + 1
    let built = 0
    const want = new Set()
    for (let dz = -span; dz <= span; dz++) {
      for (let dx = -span; dx <= span; dx++) {
        const cx = ccx + dx
        const cz = ccz + dz
        const mx = (cx + 0.5) * cs
        const mz = (cz + 0.5) * cs
        if (Math.hypot(mx - cam.x, mz - cam.z) > R + cs * 0.71) continue
        const k = cx * 100000 + cz
        want.add(k)
        if (!this.small.has(k) && built < 2) {
          this.small.set(k, this.buildSmall(cx, cz))
          built++
        }
      }
    }
    for (const [k, c] of this.small) {
      // past the fade-out radius a chunk has nothing left to draw
      const near = Math.hypot(Math.max(0, Math.abs((c.cx + 0.5) * cs - cam.x) - cs / 2), Math.max(0, Math.abs((c.cz + 0.5) * cs - cam.z) - cs / 2))
      for (const m of c.meshes) m.visible = near < R
      if (!want.has(k)) {
        const mx = (c.cx + 0.5) * cs
        const mz = (c.cz + 0.5) * cs
        if (Math.hypot(mx - cam.x, mz - cam.z) > R + cs * 1.4) {
          this.disposeSmall(c)
          this.small.delete(k)
        }
      }
    }
  }

  // Write each part's instances into its LOD1 / LOD2 buffers: those whose
  // distance lies in [lo, hi] of each LOD. LOD1 lists the instances inside
  // the shadow range first, so the shadow pass can draw just those.
  fillChunk(c, cam, lo1, hi1, lo2, hi2) {
    const sr = this.shadowDist + FADE.margin
    const dist = (it) => Math.hypot(it.x - cam.x, it.y - cam.y, it.z - cam.z)
    for (const p of c.parts) {
      const a = p.mid.instanceMatrix.array
      const later = []
      let n = 0
      for (const it of p.items) {
        const d = dist(it)
        if (d <= lo1 || d >= hi1) continue
        if (d < sr) it.matrix.toArray(a, 16 * n++)
        else later.push(it)
      }
      p.mid.userData.shadowCount = n
      for (const it of later) it.matrix.toArray(a, 16 * n++)
      setCount(p.mid, n)
    }
    for (const f of c.fars) {
      const b = f.far.instanceMatrix.array
      let n = 0
      for (const it of f.items) {
        const d = dist(it)
        if (d > lo2 && d < hi2) it[f.key].toArray(b, 16 * n++)
      }
      setCount(f.far, n)
    }
    c.at = { x: cam.x, y: cam.y, z: cam.z }
  }

  // A chunk wholly inside or outside each LOD (and the shadow range): all of
  // its instances or none.
  fillWhole(c, lod1, lod2, shadow) {
    const all = (m, items, key, on) => {
      if (on && m.count !== items.length) items.forEach((it, i) => it[key].toArray(m.instanceMatrix.array, 16 * i))
      setCount(m, on ? items.length : 0)
    }
    for (const p of c.parts) {
      all(p.mid, p.items, 'matrix', lod1)
      p.mid.userData.shadowCount = lod1 && shadow ? p.items.length : 0
    }
    for (const f of c.fars) all(f.far, f.items, f.key, lod2)
  }

  initNear() {
    this.nearAt = { x: Infinity, y: 0, z: Infinity }
    this.nearMeshes = {}
    for (const [name, t] of Object.entries(TYPES)) {
      if (t.tier !== 'big') continue
      this.nearMeshes[name] = []
      for (let v = 0; v < t.variants; v++) {
        const m = new THREE.InstancedMesh(this.geos[name][v][0], this.mats.near.mat, 700)
        m.customDepthMaterial = this.mats.near.depth
        m.count = 0
        m.visible = false
        m.frustumCulled = false
        m.castShadow = t.shadow
        m.matrixAutoUpdate = false
        this.group.add(m)
        this.nearMeshes[name].push(m)
      }
    }
  }

  // The LOD0 set: every big instance close enough to be anywhere in the
  // near band, redrawn at full detail on top of (and dithered against) LOD1.
  updateNear(cam) {
    const M = FADE.margin
    if (Math.hypot(cam.x - this.nearAt.x, cam.y - this.nearAt.y, cam.z - this.nearAt.z) < M / 2) return
    this.nearAt = { x: cam.x, y: cam.y, z: cam.z }
    const R = FADE.near[1] + M
    for (const list of Object.values(this.nearMeshes)) for (const m of list) m.count = 0
    const c0x = Math.floor((cam.x - R) / 32)
    const c1x = Math.floor((cam.x + R) / 32)
    const c0z = Math.floor((cam.z - R) / 32)
    const c1z = Math.floor((cam.z + R) / 32)
    for (let cx = c0x; cx <= c1x; cx++) {
      for (let cz = c0z; cz <= c1z; cz++) {
        const cell = this.nearGrid.get(cx * 1000 + cz)
        if (!cell) continue
        for (const it of cell) {
          if (Math.hypot(it.x - cam.x, it.y - cam.y, it.z - cam.z) >= R) continue
          const m = this.nearMeshes[it.type][it.v]
          if (m.count >= 700) continue
          it.matrix.toArray(m.instanceMatrix.array, 16 * m.count++)
        }
      }
    }
    for (const list of Object.values(this.nearMeshes)) for (const m of list) setCount(m, m.count)
  }

  // Generate one small-tier chunk deterministically.
  buildSmall(cx, cz) {
    const isl = this.island
    const cs = this.smallChunk
    const c = { cx, cz, meshes: [] }
    const m4 = new THREE.Matrix4()
    let ti = 0
    for (const [name, t] of Object.entries(TYPES)) {
      ti++
      if (t.tier !== 'small') continue
      const rng = new Rng(hash2(cx, cz, this.seed + ti * 131))
      const grid = isl.d[name]
      const perVariant = []
      for (let v = 0; v < t.variants; v++) perVariant.push([])
      const sp = t.spacing
      for (let z = cz * cs; z < (cz + 1) * cs; z += sp) {
        for (let x = cx * cs; x < (cx + 1) * cs; x += sp) {
          const px = x + rng.next() * sp
          const pz = z + rng.next() * sp
          const roll = rng.next()
          const v = rng.int(0, t.variants - 1)
          const s = rng.range(t.scale[0], t.scale[1])
          const yaw = rng.range(0, Math.PI * 2)
          if (roll >= isl.sample(grid, px, pz)) continue
          E.set(0, yaw, 0)
          m4.compose(V.set(px, isl.heightAt(px, pz) - t.sink, pz), Q.setFromEuler(E), S.set(s, s, s))
          perVariant[v].push(m4.clone())
        }
      }
      perVariant.forEach((mats, v) => {
        if (!mats.length) return
        const mesh = new THREE.InstancedMesh(this.geos[name][v][0], this.mats.small.mat, mats.length)
        mats.forEach((mm, i) => mesh.setMatrixAt(i, mm))
        mesh.instanceMatrix.needsUpdate = true
        mesh.computeBoundingSphere()
        mesh.boundingSphere.radius += 3
        mesh.matrixAutoUpdate = false
        mesh.receiveShadow = true
        this.group.add(mesh)
        c.meshes.push(mesh)
      })
    }
    return c
  }

  disposeSmall(c) {
    for (const m of c.meshes) {
      this.group.remove(m)
      m.dispose()
    }
    c.meshes.length = 0
  }

  // Something pushing through the foliage (player, rotor wash).
  setPush(x, z, radius, strength) {
    this.uniforms.uPush.value.set(x, z, radius, strength)
  }
}

// The shadow pass only needs the LOD1 instances near enough to throw a
// shadow into the map; fillChunk lists those first.
function shadowPrefix() {
  this.userData.drawCount = this.count
  this.count = this.userData.shadowCount
}
function shadowRestore() {
  this.count = this.userData.drawCount
}

// Draw the first n instances of a mesh, uploading only those.
function setCount(m, n) {
  m.count = n
  m.visible = n > 0
  if (!n) return
  const attr = m.instanceMatrix
  attr.clearUpdateRanges()
  attr.addUpdateRange(0, n * 16)
  attr.needsUpdate = true
}
