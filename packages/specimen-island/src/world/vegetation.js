import * as THREE from 'three'
import { Rng, hash2 } from '../core/rng.js'

// Vegetation: procedural low-poly plants, scattered from the island's density
// grids. Two tiers:
//   big   trees and boulders — placed once at boot, chunked, three LODs each,
//         and every trunk is a physics collider
//   small ferns, grass, reeds, bushes — streamed in chunks around the camera;
//         no colliders, but they are the cover the stealth model counts
//
// LOD changes never pop: each instance picks its LOD by the camera's distance
// to its crown, and neighbouring LODs overlap in a band where one dithers out
// as the other dithers in (see vegMaterial). The LODs of a plant share one
// shape (LOD0's thin extras dissolve first), so the cross-fade only changes
// how finely it is cut. Shadows are thrown by whatever lies inside the sun's
// shadow box, at the LOD it is drawn at.
//
// Every type is one entry in TYPES; add a plant by writing a builder for it.

// ------------------------------------------------------------ geometry builder

// Plants are drawn front faces only (crowns, trunks, rocks and bushes are
// closed shells, and culling the far side of every crown roughly halves what
// they cost to rasterize), so their flat parts — fronds, vines, blades — are
// emitted twice, once per side (`both`). LOD0-only details carry `detail`, so
// they can go before the crowns cross-fade to LOD1: 1 dissolves, 2 folds in
// towards the trunk.
class Builder {
  constructor() {
    this.pos = []
    this.col = []
    this.sway = []
    this.det = []
    this.both = false
    this.detail = 0
  }
  tri(a, b, c, col, sa = 0, sb = sa, sc = sa) {
    const cols = Array.isArray(col) ? col : [col, col, col]
    this.push(a, b, c, cols[0], cols[1], cols[2], sa, sb, sc)
    if (this.both) this.push(a, c, b, cols[0], cols[2], cols[1], sa, sc, sb)
  }
  push(a, b, c, ca, cb, cc, sa, sb, sc) {
    this.pos.push(...a, ...b, ...c)
    this.col.push(ca.r, ca.g, ca.b, cb.r, cb.g, cb.b, cc.r, cc.g, cc.b)
    this.sway.push(sa, sb, sc)
    this.det.push(this.detail, this.detail, this.detail)
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
    geo.setAttribute('aDetail', new THREE.Float32BufferAttribute(this.det, 1))
    // the point LOD distance is measured to; Vegetation sets it per type
    geo.setAttribute('aPivot', new THREE.Float32BufferAttribute(new Float32Array(this.sway.length), 1))
    geo.computeVertexNormals()
    geo.computeBoundingSphere()
    return geo
  }
}

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

// A face's shade: its part's tone, varied a little by where the face sits
// (not by the colour stream, which the LODs would consume differently), so
// where two LODs of a crown overlap their faces differ only by lighting and
// a few percent.
function shade(hex, k, cx, cy, cz, v = 0.05) {
  const h = hash2(Math.round(cx * 4) + Math.imul(Math.round(cz * 4), 7919), Math.round(cy * 4), 77)
  return new THREE.Color(hex).multiplyScalar(k * (1 + (h * 2 - 1) * v))
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

// A detail-0 icosahedron's flat faces sit inside the detail-1 hull it is
// cut from; grown by this much (after the shared jitter) its silhouette
// matches the finer one's instead of shrinking inside it.
const ICO0_GROW = 1.08

// Builders draw a plant's shape (sizes, crown layout, frond angles) first and
// identically at every LOD; colours then come from a second stream, drawn up
// front for every part, so a coarser LOD cannot drift into a different tree.
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
  const tone = crowns.map(() => 1 + (d.next() * 2 - 1) * 0.1)
  const bark = col('#5c4c3a', d, 0.1)
  const vineCol = vines.map(() => col('#3d5f22', d))
  // the trunk keeps enough rings at LOD1 to follow LOD0's bow
  const trunk = new THREE.CylinderGeometry(0.3, 0.55, H * 0.8, [7, 5, 4][lod], [4, 2, 1][lod], true)
  trunk.translate(0, H * 0.4, 0)
  const p = trunk.attributes.position
  for (let i = 0; i < p.count; i++) p.setX(i, p.getX(i) + Math.sin((p.getY(i) / H) * Math.PI) * bend)
  b.add(trunk, new THREE.Matrix4(), (nx, ny, nz, cx, cy, cz) => shade('#5c4c3a', 1, cx, cy, cz, 0.08).lerp(new THREE.Color('#7a6a52'), cy / H))
  if (!lod) {
    b.detail = 2 // the buttresses fold into the trunk rather than dissolve
    for (const a of fins) {
      const fin = new THREE.BoxGeometry(0.14, 2.4, 1.5)
      fin.translate(0, 1.0, 0.75)
      b.add(fin, mat(0, 0, 0, -0.18, a, 0), bark.clone().multiplyScalar(0.85))
    }
    b.detail = 1
    for (const [a, y] of branches) {
      const br = new THREE.CylinderGeometry(0.08, 0.16, 3.6, 4, 1, true)
      br.translate(0, 1.8, 0)
      b.add(br, mat(Math.sin(0.65 * Math.PI) * bend, y, 0, 0.95, a, 0), bark)
    }
    b.detail = 0
  }
  // the same five crowns at every LOD: finer near, an octahedron each far out
  crowns.forEach((c, k) => {
    const geo = lod === 2 ? new THREE.OctahedronGeometry(c.r * 1.2, 0) : new THREE.IcosahedronGeometry(c.r, lod ? 0 : 1)
    jitterVerts(geo, c.seed, 0.6)
    if (lod === 1) geo.scale(ICO0_GROW, ICO0_GROW, ICO0_GROW)
    b.add(
      geo,
      mat(Math.cos(c.a) * c.off + bend * 0.3, c.y, Math.sin(c.a) * c.off, 0, c.ry, 0, 1, c.sy, 1),
      (nx, ny, nz, cx, cy, cz) => shade(ny > 0.3 ? '#3f7a2a' : '#2c5a20', tone[k], cx, cy, cz),
      (x, y) => Math.max(0, (y - H * 0.7) / (H * 0.3)) * 0.3,
    )
  })
  if (!lod) {
    b.detail = 1
    b.both = true
    vines.forEach(([a, r, len], k) => {
      const x = Math.cos(a) * r
      const z = Math.sin(a) * r
      const top = H * 0.78
      const w = 0.07
      b.quad([x - w, top - len, z], [x + w, top - len, z], [x + w, top, z], [x - w, top, z], vineCol[k], 0.7, 0.7, 0.2, 0.2)
    })
    b.both = false
    b.detail = 0
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
  const frondCol = fronds.map(() => [col('#4a7f2a', d, 0.1), col('#79a845', d, 0.1)])
  const ringCol = [col('#6e5c40', d, 0.05), col('#8a7550', d, 0.05)]
  const nutCol = col('#4a3a1a', d)
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
    b.add(cyl, mat(a[0], a[1], 0, 0, 0, -Math.atan2(dx, dy)), ringCol[i % 2], () => (i / segs) * 0.15)
  }
  const top = pt(1)
  // far out, every other frond, wider, keeps the same starburst
  const keep = lod === 2 ? fronds.filter((f, k) => k % 2 === 0) : fronds
  const wide = lod === 2 ? 1.45 : 1
  b.both = true
  for (const f of keep) {
    const [ca, cb] = frondCol[fronds.indexOf(f)]
    strip(
      b,
      top,
      Math.cos(f.a),
      Math.sin(f.a),
      f.L,
      [6, 3, 2][lod],
      (s) => f.L * (0.45 * s) - f.droop * s * s,
      (s) => (0.6 * Math.pow(Math.sin(Math.PI * Math.min(1, s * 0.9 + 0.08)), 0.7) + 0.04) * wide,
      ca,
      cb,
      lod ? 0 : 0.35,
      1,
    )
  }
  b.both = false
  if (!lod) {
    b.detail = 1
    for (let k = 0; k < 3; k++) {
      const a = (k / 3) * Math.PI * 2
      b.add(new THREE.IcosahedronGeometry(0.16, 0), mat(top[0] + Math.cos(a) * 0.25, top[1] - 0.25, Math.sin(a) * 0.25), nutCol)
    }
    b.detail = 0
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
  const tone = crowns.map(() => 1 + (d.next() * 2 - 1) * 0.1)
  const trunk = new THREE.CylinderGeometry(0.16, 0.3, H * 0.7, lod ? 4 : 6, 1, true)
  trunk.translate(0, H * 0.35, 0)
  b.add(trunk, new THREE.Matrix4(), col('#5e4e3c', d))
  crowns.forEach((c, k) => {
    const geo = lod === 2 ? new THREE.OctahedronGeometry(c.r * 1.2, 0) : new THREE.IcosahedronGeometry(c.r, lod ? 0 : 1)
    jitterVerts(geo, c.seed, 0.4)
    if (lod === 1) geo.scale(ICO0_GROW, ICO0_GROW, ICO0_GROW)
    b.add(
      geo,
      mat(Math.cos(c.a) * c.off, H * (flat ? 0.88 : 0.78) + c.dy, Math.sin(c.a) * c.off, 0, c.a, 0, 1, flat ? 0.32 : 0.75, 1),
      (nx, ny, nz, cx, cy, cz) => shade(ny > 0.2 ? (flat ? '#6f8a3a' : '#4f8034') : flat ? '#4e6a2a' : '#365e26', tone[k], cx, cy, cz),
      (x, y) => Math.max(0, y / H - 0.6) * 0.5,
    )
  })
  return { geo: b.build(), r: 0.3, h: H }
}

function pine(rng, lod) {
  const b = new Builder()
  const H = rng.range(7, 12)
  const spins = [0, 1, 2, 3, 4].map(() => rng.range(0, 3))
  const d = detailRng(rng)
  const tone = spins.map(() => 1 + (d.next() * 2 - 1) * 0.08)
  const trunk = new THREE.CylinderGeometry(0.12, 0.25, H, lod === 2 ? 4 : 5, 1, true)
  trunk.translate(0, H / 2, 0)
  b.add(trunk, new THREE.Matrix4(), col('#4e3e30', d))
  // five tiers near; far out three taller ones fill the same cone. Each tier
  // is capped underneath, since only front faces are drawn.
  const tiers = lod === 2 ? [0, 2, 4] : [0, 1, 2, 3, 4]
  for (const k of tiers) {
    const t = k / 5
    const r = 2.4 * (1 - t * 0.75)
    const cone = new THREE.ConeGeometry(r, H * 0.38 * (lod === 2 ? 1.35 : 1), [7, 5, 4][lod], 1, false)
    b.add(cone, mat(0, H * (0.3 + t * 0.62), 0, 0, spins[k], 0), (nx, ny, nz, cx, cy, cz) => shade(ny > 0.4 ? '#36583a' : '#24402a', tone[k], cx, cy, cz), (x, y) => (y / H) * 0.25)
  }
  return { geo: b.build(), r: 0.28, h: H }
}

function rock(rng, lod) {
  const b = new Builder()
  const pose = mat(0, 0.25, 0, rng.range(0, 3), rng.range(0, 3), 0, rng.range(1.1, 1.6), rng.range(0.6, 0.9), rng.range(0.9, 1.3))
  const seed = rng.int(1, 1e6)
  const d = detailRng(rng)
  const tone = 1 + (d.next() * 2 - 1) * 0.1
  const ico = jitterVerts(new THREE.IcosahedronGeometry(1, lod ? 0 : 1), seed, 0.45)
  if (lod) ico.scale(ICO0_GROW, ICO0_GROW, ICO0_GROW)
  b.add(ico, pose, (nx, ny, nz, cx, cy, cz) => shade(ny > 0.55 ? '#5e6a3c' : '#7a766c', tone, cx, cy, cz, 0.1))
  return { geo: b.build(), r: 1.1, h: 1.2 }
}

function fern(rng) {
  const b = new Builder()
  b.both = true
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
  b.both = true
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
    b.both = true
    b.tri([x - w, 0, z], [x + w, 0, z], [x + lx, h, z + lz], [base, base, tip], 0, 0, 1)
    b.tri([x, 0, z - w], [x, 0, z + w], [x + lx, h, z + lz], [base, base, tip], 0, 0, 1)
    b.both = false
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
    b.both = true
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
    b.both = false
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

// ---------------------------------------------------------------- under the sea

// Kelp: a few tall stipes from one holdfast, each hung with long golden
// blades, swaying more the higher they reach. Its tips sway half a metre in
// the swell (a land plant's sway is a fraction of that).
const KELP_SWAY = 3.5
function kelp(rng) {
  const b = new Builder()
  const hold = jitterVerts(new THREE.IcosahedronGeometry(0.22, 0), rng.int(1, 1e6), 0.1)
  b.add(hold, mat(0, 0.08, 0, 0, 0, 0, 1, 0.5, 1), col('#3a3418', rng))
  b.both = true
  const n = rng.int(2, 4)
  const base = col('#5a5422', rng, 0.1)
  const tip = col('#b8a448', rng, 0.12)
  const segs = 8
  for (let k = 0; k < n; k++) {
    const H = rng.range(4.5, 10)
    const a = rng.range(0, Math.PI * 2)
    const lean = rng.range(0.05, 0.2)
    const ph = rng.range(0, 6)
    const at = (t) => [Math.cos(a) * lean * t * H + Math.sin(t * 5 + ph) * 0.25, t * H, Math.sin(a) * lean * t * H + Math.cos(t * 4 + ph) * 0.2]
    const px = -Math.sin(a)
    const pz = Math.cos(a)
    for (let i = 0; i < segs; i++) {
      const t0 = i / segs
      const t1 = (i + 1) / segs
      const p0 = at(t0)
      const p1 = at(t1)
      const c0 = base.clone().lerp(tip, t0)
      const c1 = base.clone().lerp(tip, t1)
      const w = 0.04
      // the stipe
      b.quad([p0[0] - px * w, p0[1], p0[2] - pz * w], [p0[0] + px * w, p0[1], p0[2] + pz * w], [p1[0] + px * w, p1[1], p1[2] + pz * w], [p1[0] - px * w, p1[1], p1[2] - pz * w], [c0, c0, c1, c1], t0 * KELP_SWAY, t0 * KELP_SWAY, t1 * KELP_SWAY, t1 * KELP_SWAY)
      // a blade off it, turning round the stipe as it climbs: a long leaf
      // rising and falling away from its stalk
      const ba = a + i * 2.4 + rng.range(-0.4, 0.4)
      const dx = Math.cos(ba)
      const dz = Math.sin(ba)
      const L = rng.range(0.8, 1.5) * (1 - t0 * 0.35)
      const bw = rng.range(0.12, 0.2)
      const mid = [p1[0] + dx * L * 0.5, p1[1] + L * 0.25, p1[2] + dz * L * 0.5]
      const end = [p1[0] + dx * L, p1[1] + L * 0.1 - 0.15, p1[2] + dz * L]
      const sx = -dz * bw
      const sz = dx * bw
      const leaf = c1.clone().lerp(tip, 0.5)
      const sw = t1 * KELP_SWAY
      b.quad(p1, [mid[0] - sx, mid[1], mid[2] - sz], end, [mid[0] + sx, mid[1], mid[2] + sz], [c1, leaf, tip, leaf], sw, sw * 1.15, sw * 1.3, sw * 1.15)
    }
  }
  return { geo: b.build() }
}

// Seagrass: long, soft blades in a tuft.
function seagrass(rng) {
  const b = new Builder()
  b.both = true
  const n = rng.int(10, 16)
  const base = new THREE.Color('#33582a')
  const tip = new THREE.Color(rng.chance(0.5) ? '#7f9a3e' : '#6a8a44')
  for (let k = 0; k < n; k++) {
    const a = rng.range(0, Math.PI * 2)
    const r = rng.range(0, 0.3)
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const h = rng.range(0.45, 1.05)
    const lean = rng.range(0.15, 0.45)
    const w = 0.035
    const px = -Math.sin(a) * w
    const pz = Math.cos(a) * w
    const mx = x + Math.cos(a) * lean * 0.4
    const mz = z + Math.sin(a) * lean * 0.4
    const mid = base.clone().lerp(tip, 0.5)
    b.quad([x - px, 0, z - pz], [x + px, 0, z + pz], [mx + px, h * 0.55, mz + pz], [mx - px, h * 0.55, mz - pz], [base, base, mid, mid], 0, 0, 0.6, 0.6)
    b.tri([mx - px, h * 0.55, mz - pz], [mx + px, h * 0.55, mz + pz], [x + Math.cos(a) * lean, h, z + Math.sin(a) * lean], [mid, mid, tip], 0.6, 0.6, 1.2)
  }
  return { geo: b.build() }
}

// Corals: staghorn branches, a brain-coral boulder or a sea fan by variant.
const CORAL_TONES = ['#c0705e', '#d0a046', '#9a6aa8', '#d88a70', '#b8b070']
function coral(rng, lod, variant) {
  const b = new Builder()
  const tone = new THREE.Color(CORAL_TONES[rng.int(0, CORAL_TONES.length - 1)])
  if (variant === 0) {
    const branch = (x, y, z, rx, rz, len, r, depth) => {
      const g = new THREE.CylinderGeometry(r * 0.6, r, len, 5, 1)
      g.translate(0, len / 2, 0)
      const m = mat(x, y, z, rx, 0, rz)
      b.add(g, m, (nx, ny, nz, cx, cy, cz) => shade(tone, 0.9 + cy * 0.12, cx, cy, cz, 0.12))
      if (depth <= 0) return
      const tip = new THREE.Vector3(0, len, 0).applyMatrix4(m)
      for (let k = 0; k < 2; k++) branch(tip.x, tip.y, tip.z, rx + rng.range(-0.6, 0.6), rz + rng.range(-0.6, 0.6), len * 0.7, r * 0.7, depth - 1)
    }
    for (let k = 0; k < rng.int(3, 5); k++) branch(rng.range(-0.3, 0.3), 0, rng.range(-0.3, 0.3), rng.range(-0.5, 0.5), rng.range(-0.5, 0.5), rng.range(0.35, 0.6), 0.07, 2)
  } else if (variant === 1) {
    const ico = jitterVerts(new THREE.IcosahedronGeometry(0.7, 1), rng.int(1, 1e6), 0.12)
    b.add(ico, mat(0, 0.25, 0, 0, rng.range(0, 3), 0, 1, 0.6, 1), (nx, ny, nz, cx, cy, cz) => shade(tone, ny > 0.4 ? 1 : 0.75, cx, cy, cz, 0.15))
  } else {
    b.both = true
    const H = rng.range(0.8, 1.4)
    const fan = 9
    const ry = rng.range(0, Math.PI)
    const ux = Math.cos(ry)
    const uz = Math.sin(ry)
    const stem = tone.clone().multiplyScalar(0.7)
    for (let k = 0; k < fan; k++) {
      const a0 = -1.1 + (k / fan) * 2.2
      const a1 = -1.1 + ((k + 1) / fan) * 2.2
      const p = (a) => [ux * Math.sin(a) * H * 0.8, Math.cos(a) * H * 0.9 + 0.1, uz * Math.sin(a) * H * 0.8]
      b.tri([0, 0.05, 0], p(a0), p(a1), [stem, tone, tone], 0, 0.5, 0.5)
    }
  }
  return { geo: b.build() }
}

// ---------------------------------------------------------------- type table

// spacing: jitter-grid cell size at density 1 (m). sink: push into ground.
// pivot: where on the plant (fraction of its height) LOD distance is measured
// to — the crown, so a canopy seen from a helicopter above it counts as near.
// noFar: no LOD2 — the type just fades out at the draw distance (boulders
// are a few pixels by then).
const TYPES = {
  canopy: { builder: canopyTree, tier: 'big', spacing: 8.5, scale: [0.8, 1.25], sink: 0.4, variants: 2, shadow: true, pivot: 0.75 },
  palm: { builder: palm, tier: 'big', spacing: 9.5, scale: [0.85, 1.2], sink: 0.2, variants: 2, shadow: true, pivot: 0.8 },
  broadleaf: { builder: broadleaf, tier: 'big', spacing: 13, scale: [0.8, 1.25], sink: 0.2, variants: 2, shadow: true, pivot: 0.7 },
  pine: { builder: pine, tier: 'big', spacing: 9, scale: [0.8, 1.3], sink: 0.2, variants: 2, shadow: true, pivot: 0.55 },
  rock: { builder: rock, tier: 'big', spacing: 15, scale: [0.6, 2.6], sink: 0.35, variants: 2, shadow: true, tilt: true, noFar: true, pivot: 0.35 },
  fern: { builder: fern, tier: 'small', spacing: 2.3, scale: [0.75, 1.3], sink: 0, variants: 2 },
  bigleaf: { builder: bigleaf, tier: 'small', spacing: 3.2, scale: [0.8, 1.4], sink: 0, variants: 2 },
  bush: { builder: bush, tier: 'small', spacing: 4.2, scale: [0.7, 1.4], sink: 0.1, variants: 2 },
  grass: { builder: grass, tier: 'small', spacing: 1.6, scale: [0.8, 1.2], sink: 0, variants: 3 },
  reed: { builder: reed, tier: 'small', spacing: 1.7, scale: [0.8, 1.2], sink: 0, variants: 2 },
  log: { builder: log, tier: 'small', spacing: 14, scale: [0.8, 1.2], sink: 0.15, variants: 2 },
  // marine: built and drawn only once the camera is under water (setUnderwater)
  kelp: { builder: kelp, tier: 'small', spacing: 3.2, scale: [0.7, 1.3], sink: 0.1, variants: 2, marine: true },
  seagrass: { builder: seagrass, tier: 'small', spacing: 1.7, scale: [0.8, 1.3], sink: 0, variants: 2, marine: true },
  coral: { builder: coral, tier: 'small', spacing: 2.4, scale: [0.6, 1.5], sink: 0.1, variants: 3, marine: true },
}

// LOD bands in metres. near: LOD0 hands over to LOD1; mid: LOD1 to LOD2 ends
// at the quality's draw distance; far: LOD2 thins into the fog; small: the
// streamed undergrowth fades in at the edge of its radius; detail: LOD0's
// vines, fins and branches go over this many metres before the near band,
// so the crowns cross-fade between matching shapes.
// margin: the slack each per-instance LOD list keeps beyond its band, so it
// only needs rebuilding every margin / 2 of camera travel — tight round the
// near band (whose spare instances are full-detail trees), looser further out.
// farFog: the far distance follows the fog, clamp(k / density, min, max), so
// from the air the forest reaches the coast before the fog swallows it.
// shadowSlack: metres the sun's shadow box is grown by when picking casters,
// so the picks only need rebuilding every slack / 2 the box moves.
const FADE = { near: [30, 38], mid: 18, far: 100, small: 14, detail: 8, margin: { near: 4, far: 8 }, farFog: [1.4, 1100, 1450], shadowSlack: 6 }

// ---------------------------------------------------------------- material

// Wind sway, parting where something pushes through, and the LOD fade. Each
// material owns a band (in0, in1, out0, out1): an instance fades in between
// in0 and in1 metres from the camera and out between out0 and out1, measured
// from its pivot (aPivot up its own axis), so a whole plant fades as one; the
// undergrowth (uFlat 0) measures it across the ground, as it is streamed.
// The fade is an ordered 8x8 Bayer dither with discard, shifted per instance
// so neighbouring plants don't share one screen-door; a fade-in uses the
// complement of the threshold, so where one LOD fades out over a band and the
// next fades in over the same band they split the pixels between them —
// never both, never neither. An instance wholly outside its band is moved
// out of the view volume in the vertex shader, so the list slack costs no
// fragments. The depth (shadow) pass runs the same code, so shadows
// cross-fade with the trees that cast them.
function vegShader(shader, u, band, flat) {
  shader.uniforms.uTime = u.uTime
  shader.uniforms.uWind = u.uWind
  shader.uniforms.uPush = u.uPush
  shader.uniforms.uCam = u.uCam
  shader.uniforms.uBand = band
  shader.uniforms.uFlat = flat
  shader.vertexShader = shader.vertexShader
    .replace(
      '#include <common>',
      `#include <common>
       attribute float aSway;
       attribute float aPivot;
       attribute float aDetail;
       uniform float uTime;
       uniform float uWind;
       uniform vec4 uPush;
       uniform vec3 uCam;
       uniform vec4 uBand;
       uniform float uFlat;
       varying vec3 vLod;`,
    )
    .replace(
      '#include <begin_vertex>',
      `#include <begin_vertex>
       #ifdef USE_INSTANCING
         vec3 iw = (modelMatrix * instanceMatrix * vec4(0.0, aPivot, 0.0, 1.0)).xyz;
       #else
         vec3 iw = (modelMatrix * vec4(0.0, aPivot, 0.0, 1.0)).xyz;
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
       vec3 toCam = iw - uCam;
       toCam.y *= uFlat;
       float camD = length(toCam);
       float fadeOut = 1.0 - smoothstep(uBand.z, uBand.w, camD);
       // LOD0-only details go just before the near band: thin ones dissolve,
       // solid ones (aDetail 2) fold into the trunk
       float detailGone = smoothstep(uBand.z - ${FADE.detail.toFixed(1)}, uBand.z, camD);
       if (aDetail > 1.5) transformed.xz *= 1.0 - detailGone;
       else fadeOut = min(fadeOut, 1.0 - aDetail * detailGone);
       vLod = vec3(smoothstep(uBand.x, uBand.y, camD), fadeOut, fract(sin(dot(floor(ip * 4.0), vec2(12.9898, 78.233))) * 43758.5453));`,
    )
    .replace(
      '#include <project_vertex>',
      `#include <project_vertex>
       if (vLod.x <= 0.0 || vLod.y <= 0.0) gl_Position = vec4(0.0, 0.0, -2.0, 1.0);`,
    )
  shader.fragmentShader = shader.fragmentShader
    .replace(
      '#include <common>',
      `#include <common>
       varying vec3 vLod;
       float bayer2(vec2 a) { a = floor(a); return fract(a.x * 0.5 + a.y * a.y * 0.75); }
       float bayer8(vec2 a) { return bayer2(a) + bayer2(0.5 * a) * 0.25 + bayer2(0.25 * a) * 0.0625; }`,
    )
    .replace(
      'void main() {',
      `void main() {
       if (vLod.x < 1.0 || vLod.y < 1.0) {
         float h = vLod.z * 8.0;
         float lodT = bayer8(gl_FragCoord.xy + vec2(floor(h), floor(fract(h) * 8.0))) + 0.0078125;
         if (vLod.y <= lodT || vLod.x <= 1.0 - lodT) discard;
       }`,
    )
}

// Front faces only (see Builder), and one shader for every tier and LOD.
function vegMaterial(u, band, flat) {
  const mat = new THREE.MeshLambertMaterial({ vertexColors: true })
  mat.onBeforeCompile = (shader) => vegShader(shader, u, band, flat)
  const depth = new THREE.MeshDepthMaterial({ depthPacking: THREE.RGBADepthPacking })
  depth.onBeforeCompile = (shader) => vegShader(shader, u, band, flat)
  return { mat, depth }
}

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
    this.farDist = FADE.farFog[1]
    this.smallRadius = 95
    this.shadowDist = 110
    this.underwater = false // marine types show only while the camera is under the sea
    this.bands = {}
    this.mats = {}
    for (const k of ['near', 'mid', 'far', 'small']) {
      this.bands[k] = { value: new THREE.Vector4() }
      this.mats[k] = vegMaterial(this.uniforms, this.bands[k], { value: k === 'small' ? 0 : 1 })
    }
    this.setBands()

    // The sun's shadow box decides which trees cast. The sky (built before
    // the vegetation) owns the light and re-centres it every frame.
    this.sun = scene.children.find((o) => o.isDirectionalLight && o.castShadow) || null
    this.sunCam = new THREE.Camera()
    this.sunBox = { e: null, l: 0, r: 0, b: 0, t: 0, n: 0, f: 0, focus: new THREE.Vector3(), dir: new THREE.Vector3(), epoch: 0 }

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
        // pivot height, and how far the plant reaches from it (shadow picks)
        const py = (t.pivot || 0) * (meta.h || 0)
        let reach = 0
        const pos = lods[0].attributes.position
        for (let i = 0; i < pos.count; i++) reach = Math.max(reach, Math.hypot(pos.getX(i), pos.getY(i) - py, pos.getZ(i)))
        for (const g of lods) g.attributes.aPivot.array.fill(py)
        this.geos[name].push(lods)
        this.meta[name].push({ r: meta.r || 0, h: meta.h || 1, py, reach })
      }
    }

    this.bigChunk = 200
    this.chunks = []
    this.nearGrid = new Map() // 32 m cells of big instances, for the LOD0 set
    this.placeBig()
    this.small = new Map()
    this.smallChunk = 48
    this.falling = []
    this.initNear()
  }

  // A big plant pushed over by something heavy (the tank): it topples away
  // along (dx, dz) about its foot over a second, and stays down. The caller
  // takes its trunk out of the physics.
  fell(it, dx, dz) {
    if (it.fall || it.type === 'rock') return
    const l = Math.hypot(dx, dz) || 1
    const chunk = this.chunkAt.get(Math.floor(it.x / this.bigChunk) * 1000 + Math.floor(it.z / this.bigChunk))
    it.fall = { t: 0, axis: new THREE.Vector3(dz / l, 0, -dx / l), base: it.matrix.clone(), chunk, part: chunk?.parts.find((p) => p.items.includes(it)) }
    this.falling.push(it)
  }

  updateFalling(dt) {
    const m = new THREE.Matrix4()
    for (let i = this.falling.length - 1; i >= 0; i--) {
      const it = this.falling[i]
      const F = it.fall
      F.t = Math.min(1, F.t + dt / 1.1)
      // slow to start, quick to land
      const a = F.t * F.t * 1.45
      m.makeTranslation(it.x, it.y, it.z).multiply(new THREE.Matrix4().makeRotationAxis(F.axis, a)).multiply(new THREE.Matrix4().makeTranslation(-it.x, -it.y, -it.z))
      it.matrix.multiplyMatrices(m, F.base)
      // its chunk and the near set redraw it
      if (F.chunk) F.chunk.key = null
      if (F.part) {
        F.part.mid.count = 0
        if (F.part.far) F.part.far.count = 0
      }
      this.nearAt.x = Infinity
      if (F.t >= 1) this.falling.splice(i, 1)
    }
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
        c = {
          cx,
          cz,
          x: (cx + 0.5) * this.bigChunk,
          z: (cz + 0.5) * this.bigChunk,
          lists: {},
          parts: [],
          minY: Infinity, // ground and canopy top (shadow box tests)
          topY: -Infinity,
          minPY: Infinity, // pivot heights (LOD distances)
          maxPY: -Infinity,
          reach: 0,
          key: null,
          at: { x: 0, y: 0, z: 0 },
          sf: { x: 0, y: 0, z: 0 },
          epoch: -1,
          shadowed: false,
          // chunks refill at slightly different travel distances, so the
          // ones a band boundary crosses don't all refill on one frame
          pace: 0.6 + 0.4 * hash2(cx, cz, 911),
        }
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
          const inst = { x: px, y, z: pz, py: y + meta.py * s, reach: meta.reach * s, yaw, s, v, tilt: t.tilt ? [rng.range(-0.4, 0.4), rng.range(-0.4, 0.4)] : null }
          const c = getChunk(px, pz)
          ;(c.lists[name] ||= []).push(inst)
          if (meta.r > 0) {
            const r = meta.r * s
            // the trunk knows its tree, so something heavy can fell it (fell())
            this.physics.addCylinder(px, pz, r, y - 1, y + meta.h * s, { tag: name === 'rock' ? 'rock' : 'tree', ref: inst })
          }
        }
      }
    }
    // per chunk and type variant: an LOD1 and an LOD2 mesh over the same
    // instances; update() picks which instances each one draws
    const m4 = new THREE.Matrix4()
    for (const c of chunkOf.values()) {
      for (const [name, list] of Object.entries(c.lists)) {
        const t = TYPES[name]
        for (const it of list) {
          E.set(it.tilt ? it.tilt[0] : 0, it.yaw, it.tilt ? it.tilt[1] : 0)
          m4.compose(V.set(it.x, it.y, it.z), Q.setFromEuler(E), S.set(it.s, it.s, it.s))
          it.matrix = m4.clone()
          it.type = name
          c.minY = Math.min(c.minY, it.y)
          c.topY = Math.max(c.topY, it.y + this.meta[name][it.v].h * it.s)
          c.minPY = Math.min(c.minPY, it.py)
          c.maxPY = Math.max(c.maxPY, it.py)
          c.reach = Math.max(c.reach, it.reach)
          const key = Math.floor(it.x / 32) * 1000 + Math.floor(it.z / 32)
          let cell = this.nearGrid.get(key)
          if (!cell) this.nearGrid.set(key, (cell = []))
          cell.push(it)
        }
        for (let v = 0; v < t.variants; v++) {
          const items = list.filter((it) => it.v === v)
          if (!items.length) continue
          const lods = this.geos[name][v]
          const mid = this.chunkMesh(lods[1], this.mats.mid, items)
          const far = t.noFar ? null : this.chunkMesh(lods[2], this.mats.far, items)
          c.parts.push({ type: name, items, mid, far, flags: new Uint8Array(items.length) })
        }
      }
      delete c.lists
      this.chunks.push(c)
    }
    this.chunkAt = chunkOf
  }

  chunkMesh(geo, mats, items) {
    const m = new THREE.InstancedMesh(geo, mats.mat, items.length)
    items.forEach((it, i) => m.setMatrixAt(i, it.matrix))
    m.computeBoundingSphere()
    m.boundingSphere.radius += 25
    m.count = 0
    m.visible = false
    m.castShadow = false
    m.receiveShadow = false
    m.matrixAutoUpdate = false
    // the shadow pass draws only the casters, which each fill lists first
    m.customDepthMaterial = mats.depth
    m.userData.shadowCount = 0
    m.onBeforeShadow = shadowPrefix
    m.onAfterShadow = shadowRestore
    this.group.add(m)
    return m
  }

  update(dt, cam, wind = 1) {
    if (this.falling.length) this.updateFalling(dt)
    this.uniforms.uTime.value += dt
    this.uniforms.uWind.value = wind
    this.uniforms.uCam.value.copy(cam)
    // the far edge follows the fog (in 25 m steps); every chunk re-checks
    const fog = this.scene.fog
    if (fog && fog.density > 0) {
      const [k, lo, hi] = FADE.farFog
      const fd = Math.round(Math.min(hi, Math.max(lo, k / fog.density)) / 25) * 25
      if (fd !== this.farDist) {
        this.farDist = fd
        this.setBands()
        for (const c of this.chunks) c.key = null
      }
    }
    const shadows = this.shadowDist > 0 && !!this.sun && this.sun.castShadow
    if (shadows) this.updateSunBox()
    // big tier: each chunk's LOD1/LOD2 meshes draw the instances whose own
    // distance falls in (or near) that LOD's band, shadow casters (inside the
    // sun's shadow box) first. A chunk no band boundary or shadow box cuts
    // through is all one or the other and is only refilled when that
    // changes; the others are refilled as the camera and the box move.
    const Mn = FADE.margin.near
    const Mf = FADE.margin.far
    const lo1 = FADE.near[0] - Mn
    const hi1 = this.drawDist + Mf
    const lo2 = this.drawDist - FADE.mid - Mf
    const hi2 = this.farDist + Mf
    const half = this.bigChunk / 2
    const box = this.sunBox
    const step = FADE.shadowSlack / 2
    for (const c of this.chunks) {
      const ax = Math.abs(c.x - cam.x)
      const az = Math.abs(c.z - cam.z)
      const dmin = Math.hypot(Math.max(0, ax - half), Math.max(0, az - half), Math.max(0, c.minPY - cam.y, cam.y - c.maxPY))
      const dmax = Math.hypot(ax + half, az + half, Math.max(Math.abs(cam.y - c.minPY), Math.abs(cam.y - c.maxPY)))
      const nearCut = lo1 > dmin && lo1 < dmax
      const farCut = (hi1 > dmin && hi1 < dmax) || (lo2 > dmin && lo2 < dmax) || (hi2 > dmin && hi2 < dmax)
      const shadowCut = shadows && this.chunkInSunBox(c)
      let key
      if (nearCut || farCut || shadowCut) {
        key = 'mixed'
        const travel = (nearCut ? Mn : Mf) * 0.5 * c.pace
        const stale =
          c.key !== key ||
          dist3(cam, c.at) > travel ||
          shadowCut !== c.shadowed ||
          (shadowCut && (c.epoch !== box.epoch || dist3(box.focus, c.sf) > step * c.pace))
        if (stale) this.fillChunk(c, cam, lo1, hi1, lo2, hi2, shadowCut)
      } else {
        // a whole chunk never casts: the shadow box is smaller than a chunk,
        // so any chunk it reaches is cut by it
        key = (dmax > lo1 && dmin < hi1 ? 'L1' : '') + (dmax > lo2 && dmin < hi2 ? 'L2' : '')
        if (c.key !== key) this.fillWhole(c, key.includes('L1'), key.includes('L2'))
      }
      c.key = key
      for (const p of c.parts) {
        const cast = shadows && TYPES[p.type].shadow
        p.mid.castShadow = cast && p.mid.userData.shadowCount > 0
        if (p.far) p.far.castShadow = cast && p.far.userData.shadowCount > 0
      }
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
        let c = this.small.get(k)
        if (!c && built < 2) {
          c = this.buildSmall(cx, cz)
          this.small.set(k, c)
          built++
        }
        // the sea's plants only once someone is down there to see them
        if (c && !c.sea && this.underwater && built < 2) {
          this.buildSmall(cx, cz, true, c)
          built++
        }
      }
    }
    for (const [k, c] of this.small) {
      // past the fade-out radius a chunk has nothing left to draw
      const near = Math.hypot(Math.max(0, Math.abs((c.cx + 0.5) * cs - cam.x) - cs / 2), Math.max(0, Math.abs((c.cz + 0.5) * cs - cam.z) - cs / 2))
      for (const m of c.meshes) m.visible = near < R && (this.underwater || !m.userData.marine)
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

  // Where the sun's shadow camera looks this frame (the sky re-aimed the
  // light at its focus just before us): its view matrix and box, and an
  // epoch that ticks whenever the light has swung enough to matter.
  updateSunBox() {
    const sun = this.sun
    const box = this.sunBox
    const sc = sun.shadow.camera
    this.sunCam.position.copy(sun.position)
    this.sunCam.lookAt(sun.target.position)
    this.sunCam.updateMatrixWorld()
    box.e = this.sunCam.matrixWorldInverse.elements
    const g = FADE.shadowSlack
    box.l = sc.left - g
    box.r = sc.right + g
    box.b = sc.bottom - g
    box.t = sc.top + g
    box.n = sc.near - g
    box.f = sc.far + g
    box.focus.copy(sun.target.position)
    V.subVectors(sun.position, sun.target.position).normalize()
    if (V.dot(box.dir) < 0.99998) {
      box.dir.copy(V)
      box.epoch++
    }
  }

  // Does a sphere (world centre, radius) reach into the grown shadow box?
  inSunBox(x, y, z, r) {
    const { e, l, r: rt, b, t, n, f } = this.sunBox
    const lx = e[0] * x + e[4] * y + e[8] * z + e[12]
    if (lx < l - r || lx > rt + r) return false
    const ly = e[1] * x + e[5] * y + e[9] * z + e[13]
    if (ly < b - r || ly > t + r) return false
    const lz = -(e[2] * x + e[6] * y + e[10] * z + e[14])
    return lz > n - r && lz < f + r
  }

  // Does a chunk's bounding box (trees and their reach) touch the shadow box?
  chunkInSunBox(c) {
    const { e, l, r, b, t, n, f } = this.sunBox
    const half = this.bigChunk / 2 + c.reach
    let x0 = Infinity
    let x1 = -Infinity
    let y0 = Infinity
    let y1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (let k = 0; k < 8; k++) {
      const x = c.x + (k & 1 ? half : -half)
      const y = k & 2 ? c.topY + c.reach : c.minY - c.reach
      const z = c.z + (k & 4 ? half : -half)
      const lx = e[0] * x + e[4] * y + e[8] * z + e[12]
      const ly = e[1] * x + e[5] * y + e[9] * z + e[13]
      const lz = -(e[2] * x + e[6] * y + e[10] * z + e[14])
      x0 = Math.min(x0, lx)
      x1 = Math.max(x1, lx)
      y0 = Math.min(y0, ly)
      y1 = Math.max(y1, ly)
      z0 = Math.min(z0, lz)
      z1 = Math.max(z1, lz)
    }
    return x1 > l && x0 < r && y1 > b && y0 < t && z1 > n && z0 < f
  }

  // Write each part's instances into its LOD1 / LOD2 buffers: those whose
  // distance lies in (lo, hi) of each LOD, the ones inside the sun's shadow
  // box first, so the shadow pass can draw just those. Two passes over the
  // instances, no allocation.
  fillChunk(c, cam, lo1, hi1, lo2, hi2, shadow) {
    const cx = cam.x
    const cy = cam.y
    const cz = cam.z
    for (const p of c.parts) {
      const items = p.items
      const fl = p.flags
      const a1 = p.mid.instanceMatrix.array
      const a2 = p.far ? p.far.instanceMatrix.array : null
      let n1 = 0
      let n2 = 0
      for (let i = 0; i < items.length; i++) {
        const it = items[i]
        const dx = it.x - cx
        const dy = it.py - cy
        const dz = it.z - cz
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
        let f = (d > lo1 && d < hi1 ? 1 : 0) | (a2 && d > lo2 && d < hi2 ? 2 : 0)
        if (f && shadow && this.inSunBox(it.x, it.py, it.z, it.reach)) {
          if (f & 1) it.matrix.toArray(a1, 16 * n1++)
          if (f & 2) it.matrix.toArray(a2, 16 * n2++)
          f = 0
        }
        fl[i] = f
      }
      p.mid.userData.shadowCount = n1
      if (p.far) p.far.userData.shadowCount = n2
      for (let i = 0; i < items.length; i++) {
        const f = fl[i]
        if (f & 1) items[i].matrix.toArray(a1, 16 * n1++)
        if (f & 2) items[i].matrix.toArray(a2, 16 * n2++)
      }
      setCount(p.mid, n1)
      if (p.far) setCount(p.far, n2)
    }
    c.at.x = cx
    c.at.y = cy
    c.at.z = cz
    c.shadowed = shadow
    if (shadow) {
      c.sf.x = this.sunBox.focus.x
      c.sf.y = this.sunBox.focus.y
      c.sf.z = this.sunBox.focus.z
      c.epoch = this.sunBox.epoch
    }
  }

  // A chunk wholly inside or outside each LOD: all of its instances or none.
  fillWhole(c, lod1, lod2) {
    const all = (m, items, on) => {
      if (on && m.count !== items.length) items.forEach((it, i) => it.matrix.toArray(m.instanceMatrix.array, 16 * i))
      setCount(m, on ? items.length : 0)
      m.userData.shadowCount = 0
    }
    for (const p of c.parts) {
      all(p.mid, p.items, lod1)
      if (p.far) all(p.far, p.items, lod2)
    }
    c.shadowed = false
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
  // All of it lies well inside the shadow box, so all of it casts.
  updateNear(cam) {
    const M = FADE.margin.near
    if (dist3(cam, this.nearAt) < M / 2) return
    this.nearAt.x = cam.x
    this.nearAt.y = cam.y
    this.nearAt.z = cam.z
    const R = FADE.near[1] + M
    for (const list of Object.values(this.nearMeshes)) for (const m of list) m.count = 0
    // flying well above every crown around: nothing to list
    let top = -Infinity
    for (let cx = Math.floor((cam.x - R) / this.bigChunk); cx <= Math.floor((cam.x + R) / this.bigChunk); cx++) {
      for (let cz = Math.floor((cam.z - R) / this.bigChunk); cz <= Math.floor((cam.z + R) / this.bigChunk); cz++) top = Math.max(top, this.chunkAt.get(cx * 1000 + cz)?.maxPY ?? -Infinity)
    }
    if (cam.y - top > R) {
      for (const list of Object.values(this.nearMeshes)) for (const m of list) setCount(m, 0)
      return
    }
    const c0x = Math.floor((cam.x - R) / 32)
    const c1x = Math.floor((cam.x + R) / 32)
    const c0z = Math.floor((cam.z - R) / 32)
    const c1z = Math.floor((cam.z + R) / 32)
    for (let cx = c0x; cx <= c1x; cx++) {
      for (let cz = c0z; cz <= c1z; cz++) {
        const cell = this.nearGrid.get(cx * 1000 + cz)
        if (!cell) continue
        for (const it of cell) {
          if (Math.hypot(it.x - cam.x, it.py - cam.y, it.z - cam.z) >= R) continue
          const m = this.nearMeshes[it.type][it.v]
          if (m.count >= 700) continue
          it.matrix.toArray(m.instanceMatrix.array, 16 * m.count++)
        }
      }
    }
    for (const list of Object.values(this.nearMeshes)) for (const m of list) setCount(m, m.count)
  }

  // Generate one small-tier chunk deterministically: its land plants, or
  // (`marine`) the sea's, added to chunk `c` the first time the camera is
  // under water near it. Each type draws from its own seed, so the two
  // halves land the same whichever is built first.
  buildSmall(cx, cz, marine = false, c = { cx, cz, meshes: [], sea: false }) {
    const isl = this.island
    const cs = this.smallChunk
    const m4 = new THREE.Matrix4()
    if (marine) c.sea = true
    let ti = 0
    for (const [name, t] of Object.entries(TYPES)) {
      ti++
      if (t.tier !== 'small' || !!t.marine !== marine) continue
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
        mesh.userData.marine = !!t.marine
        mesh.visible = !t.marine || this.underwater
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

  // Kelp, seagrass and coral are only drawn from below the surface: from
  // above the sea is too opaque to see them, and they would cost the same.
  // Nor are they built until then (update); surfacing only hides them, and
  // they go with their chunks once the camera has moved on.
  setUnderwater(on) {
    this.underwater = on
  }

  // Something pushing through the foliage (player, rotor wash).
  setPush(x, z, radius, strength) {
    this.uniforms.uPush.value.set(x, z, radius, strength)
  }
}

const dist3 = (a, b) => Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z)

// The shadow pass only needs the instances inside the sun's shadow box;
// fillChunk lists those first.
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
