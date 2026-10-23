// Dev-only: audit where the built things stand.
//
// For each seed this generates the island in node, carves the hero falls as
// the app does, and builds every building through the same code Features
// draws them with (features/index.js buildFooting), recording the stone boxes
// each one stands on: a paepae, a heiau's base tier and terraces, a koʻa's or
// an ahu's footing, a salt pan's clay bed, and a canoe shed's eaves. Then it
// reports each building whose drawn footprint comes within the margin of a
// drawn stream (ribbon or carved bed), a loʻi paddy, an ʻauwai or a fishpond
// wall; whose ground has more relief than its platform can take up; any of
// whose blocks floats (its foot above the ground, and not standing on another
// block) or is buried (ground rising through its exposed top: a terrace's
// tread as well as the platform's top); that stands at the brink of a drop;
// that overlaps another building; or that stands in the sea. The ground is the
// one drawn up close (the finest terrain mesh), after every carve; distances
// and ground are measured here, on what is drawn, independently of the code
// that placed them. With --list it also lists each heiau's faces: the tallest
// sheer wall on a side without terraces, and the face left below the last
// terrace.
//
//   node tools/audit-sites.mjs [--root <package dir>] [--list] [seed…]
//
// A package without src/gen/footing.js (the code before buildings were
// settled onto the final ground) is laid out the way it drew them then.

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join, resolve } from 'node:path'

const args = process.argv.slice(2)
let root = join(dirname(fileURLToPath(import.meta.url)), '..')
let list = false
const seeds = []
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--root') root = resolve(args[++i])
  else if (args[i] === '--list') list = true
  else seeds.push(Number(args[i]))
}
if (!seeds.length) seeds.push(20261004, 7, 424242)

const { WORLD, HALF, HEIGHT_RES, Y_PER_M } = await import(join(root, 'src/config.js'))
const { generateIsland } = await import(join(root, 'src/gen/island-data.js'))
const { planFalls } = await import(join(root, 'src/features/waterfalls.js'))
const { layStreams } = await import(join(root, 'src/gen/channels.js'))
const footingPath = join(root, 'src/gen/footing.js')
const footing = existsSync(footingPath) ? await import(footingPath) : null
const { Builder } = await import(join(root, 'src/features/kit.js'))
const { buildFooting } = footing ? await import(join(root, 'src/features/index.js')) : {}

const S = 0.016 // structures: world units per metre (kit.js)
const M = Y_PER_M // world Y per metre of ground
const MARGIN = 0.05
const BED = (WORLD / HEIGHT_RES) * 0.6 // the flat of a carved bed, either side of its line
// what each kind of platform can honestly take up, metres of ground relief
const REACH = { house: 1.3, heiau: 6, luakini: 9, koa: 1, ahu: 2, imu: 1, salt: 0.8, halau: 0.6 }
const TOL = 0.1 * M // a tenth of a metre either way is a seam, not a gap
const BRINK = 0.45 // steepest average fall just outside a platform before it stands on a brink
const EAVE = 0.3 * S // a canoe shed's thatch comes down to this over the sand

// --- the ground and the things to keep clear of ----------------------------------------------

function bilinear(h, N, x, z) {
  let fx = ((x + HALF) / WORLD) * N - 0.5
  let fz = ((z + HALF) / WORLD) * N - 0.5
  fx = Math.min(N - 1.001, Math.max(0, fx))
  fz = Math.min(N - 1.001, Math.max(0, fz))
  const i = fx | 0
  const j = fz | 0
  const tx = fx - i
  const tz = fz - j
  const k = j * N + i
  const a = h[k] + (h[k + 1] - h[k]) * tx
  const b = h[k + N] + (h[k + N + 1] - h[k + N]) * tx
  return a + (b - a) * tz
}

/** Metres of ground as the finest terrain mesh draws it (features/index.js drawnHeight). */
function drawn(h, x, z) {
  const N = HEIGHT_RES
  const c = WORLD / N
  const fx = (x + HALF) / c
  const fz = (z + HALF) / c
  const i = Math.floor(fx)
  const j = Math.floor(fz)
  const u = fx - i
  const v = fz - j
  const x0 = -HALF + i * c
  const z0 = -HALF + j * c
  const h00 = bilinear(h, N, x0, z0)
  const h10 = bilinear(h, N, x0 + c, z0)
  const h01 = bilinear(h, N, x0, z0 + c)
  const h11 = bilinear(h, N, x0 + c, z0 + c)
  if ((i + j) & 1) return u + v <= 1 ? h00 + (h10 - h00) * u + (h01 - h00) * v : h11 + (h01 - h11) * (1 - u) + (h10 - h11) * (1 - v)
  return v >= u ? h00 + (h11 - h01) * u + (h01 - h00) * v : h00 + (h10 - h00) * u + (h11 - h10) * v
}

const segPoint = (px, pz, ax, az, bx, bz) => {
  const dx = bx - ax
  const dz = bz - az
  const l2 = dx * dx + dz * dz || 1e-12
  const t = Math.min(1, Math.max(0, ((px - ax) * dx + (pz - az) * dz) / l2))
  return Math.hypot(ax + dx * t - px, az + dz * t - pz)
}

const cross = (ax, az, bx, bz) => ax * bz - az * bx

/** Whether two segments cross. */
function segsCross(a, b, c, d) {
  const d1 = cross(b[0] - a[0], b[1] - a[1], c[0] - a[0], c[1] - a[1])
  const d2 = cross(b[0] - a[0], b[1] - a[1], d[0] - a[0], d[1] - a[1])
  const d3 = cross(d[0] - c[0], d[1] - c[1], a[0] - c[0], a[1] - c[1])
  const d4 = cross(d[0] - c[0], d[1] - c[1], b[0] - c[0], b[1] - c[1])
  return d1 * d2 < 0 && d3 * d4 < 0
}

/** Whether (x, z) is inside a convex quad [[x, z]…] (either winding). */
function inQuad(q, x, z) {
  let pos = false
  let neg = false
  for (let i = 0; i < 4; i++) {
    const a = q[i]
    const b = q[(i + 1) % 4]
    const c = cross(b[0] - a[0], b[1] - a[1], x - a[0], z - a[1])
    if (c > 1e-12) pos = true
    if (c < -1e-12) neg = true
  }
  return !(pos && neg)
}

/** Distance from segment a–b to a convex quad (0 if they touch). */
function segQuad(a, b, q) {
  if (inQuad(q, a[0], a[1]) || inQuad(q, b[0], b[1])) return 0
  let d = Infinity
  for (let i = 0; i < 4; i++) {
    const c = q[i]
    const e = q[(i + 1) % 4]
    if (segsCross(a, b, c, e)) return 0
    d = Math.min(d, segPoint(a[0], a[1], c[0], c[1], e[0], e[1]), segPoint(b[0], b[1], c[0], c[1], e[0], e[1]), segPoint(c[0], c[1], a[0], a[1], b[0], b[1]), segPoint(e[0], e[1], a[0], a[1], b[0], b[1]))
  }
  return d
}

/** Whether two convex quads overlap (separating axes on their edges). */
function quadsOverlap(A, B) {
  for (const P of [A, B]) {
    for (let i = 0; i < 4; i++) {
      const a = P[i]
      const b = P[(i + 1) % 4]
      const nx = -(b[1] - a[1])
      const nz = b[0] - a[0]
      let a0 = Infinity
      let a1 = -Infinity
      let b0 = Infinity
      let b1 = -Infinity
      for (const p of A) {
        const t = p[0] * nx + p[1] * nz
        a0 = Math.min(a0, t)
        a1 = Math.max(a1, t)
      }
      for (const p of B) {
        const t = p[0] * nx + p[1] * nz
        b0 = Math.min(b0, t)
        b1 = Math.max(b1, t)
      }
      if (a1 <= b0 + 1e-9 || b1 <= a0 + 1e-9) return false
    }
  }
  return true
}

function insidePoly(poly, x, z) {
  let c = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i]
    const b = poly[j]
    if (a[1] > z !== b[1] > z && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c
  }
  return c
}

/** Everything a building must keep clear of, as polylines with the half-width each is drawn at. */
function keepOut(island, lines) {
  const out = []
  for (const l of lines) {
    const half = Math.min(0.11, 0.009 * Math.sqrt(l.lineA) + 0.012)
    out.push({ what: 'river', pts: l.pts, r: Math.max(half, BED) + MARGIN })
  }
  for (const c of island.meta.sites.loi) {
    for (const p of c.paddies) out.push({ what: 'paddy', pts: [...p.poly, p.poly[0]], r: 0.009 + MARGIN, poly: p.poly })
    for (const a of c.auwai) out.push({ what: 'auwai', pts: a, r: 0.008 + MARGIN })
  }
  for (const p of island.meta.sites.ponds) out.push({ what: 'pond', pts: p.wall, r: 0.05 + MARGIN })
  for (const o of out) {
    let x0 = Infinity
    let x1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (const q of o.pts) {
      x0 = Math.min(x0, q[0])
      x1 = Math.max(x1, q[0])
      z0 = Math.min(z0, q[1])
      z1 = Math.max(z1, q[1])
    }
    o.box = [x0 - o.r, x1 + o.r, z0 - o.r, z1 + o.r]
  }
  return out
}

// --- blocks: a platform's stone boxes, as drawn -------------------------------------------------

/**
 * A block in world space: bottom and top quads ([x, z] corners in order), the
 * bottom's height and the top as a plane through its corners (a leaned shed
 * slopes).
 */
function block(b, t) {
  const q = (r) => r.map((p) => [p[0], p[2]])
  const T = q(t)
  // the top's plane: y = t0 + α(t1 − t0) + β(t3 − t0) at (x, z), solved per point
  const ex = [T[1][0] - T[0][0], T[1][1] - T[0][1]]
  const ez = [T[3][0] - T[0][0], T[3][1] - T[0][1]]
  const det = cross(ex[0], ex[1], ez[0], ez[1]) || 1e-12
  const top = (x, z) => {
    const dx = x - T[0][0]
    const dz = z - T[0][1]
    const al = cross(dx, dz, ez[0], ez[1]) / det
    const be = cross(ex[0], ex[1], dx, dz) / det
    return t[0][1] + al * (t[1][1] - t[0][1]) + be * (t[3][1] - t[0][1])
  }
  return { bot: q(b), topq: T, y0: Math.min(b[0][1], b[1][1], b[2][1], b[3][1]), top }
}

/** A flat block from a footprint (x, z, rot, hx, hz) and its top and foot. */
function flatBlock(x, z, rot, hx, hz, top, base) {
  const c = Math.cos(rot)
  const s = Math.sin(rot)
  const P = (u, v, y) => [x + u * c - v * s, y, z + u * s + v * c]
  const ring = (y) => [P(-hx, -hz, y), P(hx, -hz, y), P(hx, hz, y), P(-hx, hz, y)]
  return block(ring(base), ring(top))
}

/** A Builder that records the boxes and bare quads it is given, in world space, and draws nothing. */
class Recorder extends Builder {
  constructor() {
    super()
    this.boxes = []
    this.quads = []
    this.inBox = false
  }

  reset() {
    this.boxes = []
    this.quads = []
  }

  tri() {}

  quad(a, b, c, d) {
    if (!this.inBox) {
      const f = this.xf || ((p) => p)
      this.quads.push([f(a), f(b), f(c), f(d)])
    }
  }

  box(x, y0, z, sx, h, sz, color, mat = 0, rot = 0, taper = 1) {
    const f = this.xf || ((p) => p)
    const c = Math.cos(rot)
    const s = Math.sin(rot)
    const P = (lx, ly, lz) => f([x + lx * c - lz * s, y0 + ly, z + lx * s + lz * c])
    const hx = sx / 2
    const hz = sz / 2
    const ring = (y, k) => [P(-hx * k, y, -hz * k), P(hx * k, y, -hz * k), P(hx * k, y, hz * k), P(-hx * k, y, hz * k)]
    const lo = ring(Math.min(0, h), h < 0 ? taper : 1)
    const hi = ring(Math.max(0, h), h < 0 ? 1 : taper)
    this.boxes.push(block(lo, hi))
    this.inBox = true
    super.box(x, y0, z, sx, h, sz, color, mat, rot, taper)
    this.inBox = false
  }
}

// --- the audit ---------------------------------------------------------------------------------

function audit(island, lines, items) {
  const h = island.data.height
  const ground = (x, z) => drawn(h, x, z)
  const ko = keepOut(island, lines)
  const flagged = []
  const counts = {}
  const flag = (b, what, detail) => {
    counts[what] = (counts[what] || 0) + 1
    flagged.push(`${what.padEnd(7)} ${b.kind.padEnd(8)} ${b.tag || ''} at (${b.x.toFixed(2)}, ${b.z.toFixed(2)}) ${detail}`)
  }
  /** Calls fn(x, z) on a grid across a quad, about every `step` units, edges included. */
  const across = (q, step, fn) => {
    const ux = q[1][0] - q[0][0]
    const uz = q[1][1] - q[0][1]
    const vx = q[3][0] - q[0][0]
    const vz = q[3][1] - q[0][1]
    const nu = Math.max(2, Math.ceil(Math.hypot(ux, uz) / step))
    const nv = Math.max(2, Math.ceil(Math.hypot(vx, vz) / step))
    for (let i = 0; i <= nu; i++) {
      for (let j = 0; j <= nv; j++) {
        // (a hair inside, so a point on a shared edge isn't read as the neighbour's)
        const a = 0.0005 + (0.999 * i) / nu
        const b = 0.0005 + (0.999 * j) / nv
        fn(q[0][0] + ux * a + vx * b, q[0][1] + uz * a + vz * b)
      }
    }
  }
  for (const it of items) {
    const { blocks } = it
    // keep-out: every block's footprint (and a shed's roof outline)
    const quads = blocks.map((k) => k.bot)
    if (it.eaves) quads.push(it.eaves)
    const worst = {}
    for (const q of quads) {
      const R = Math.max(...q.map((p) => Math.hypot(p[0] - q[0][0], p[1] - q[0][1])))
      for (const o of ko) {
        if (q[0][0] + R < o.box[0] || q[0][0] - R > o.box[1] || q[0][1] + R < o.box[2] || q[0][1] - R > o.box[3]) continue
        let d = Infinity
        for (let i = 1; i < o.pts.length && d > 0; i++) d = Math.min(d, segQuad(o.pts[i - 1], o.pts[i], q))
        if (o.poly && q.some((p) => insidePoly(o.poly, p[0], p[1]))) d = 0
        if (d < o.r && (!(o.what in worst) || d - o.r < worst[o.what])) worst[o.what] = d - o.r
      }
    }
    for (const [what, v] of Object.entries(worst)) flag(it, what, `${(-v).toFixed(3)} inside the margin`)
    // the ground under the core (the platform proper): relief and the sea
    const core = blocks[it.core ?? 0]
    let lo = Infinity
    let hi = -Infinity
    let wet = false
    for (const q of quads) {
      across(q, 0.02, (x, z) => {
        if (ground(x, z) < 0) wet = true
      })
    }
    if (core) {
      across(core.bot, 0.02, (x, z) => {
        const y = Math.max(0, ground(x, z)) * M
        lo = Math.min(lo, y)
        hi = Math.max(hi, y)
      })
      if (hi - lo > it.reach * M) flag(it, 'relief', `${((hi - lo) / M).toFixed(2)} m under it, reach ${it.reach} m`)
    }
    if (wet && it.kind !== 'halau') flag(it, 'wet', 'stands in the sea')
    // floats: a block's foot over the ground, unless it stands on a block below it
    let floats = 0
    let buried = 0
    for (const A of blocks) {
      across(A.bot, 0.012, (x, z) => {
        const g = Math.max(0, ground(x, z)) * M
        if (A.y0 <= g + TOL) return
        for (const B of blocks) if (B !== A && B.y0 < A.y0 && inQuad(B.topq, x, z) && B.top(x, z) + TOL >= A.y0) return
        floats = Math.max(floats, A.y0 - g)
      })
      // buried: ground through its exposed top (not under a higher block)
      across(A.topq, 0.012, (x, z) => {
        const y = A.top(x, z)
        for (const B of blocks) if (B !== A && inQuad(B.topq, x, z) && B.top(x, z) > y + 1e-7) return
        buried = Math.max(buried, Math.max(0, ground(x, z)) * M - y)
      })
    }
    // a shed's eaves: never into the sand, nor more than its reach over it
    if (it.eaves) {
      for (const [a, b] of it.eaveLines) {
        for (let k = 0; k <= 40; k++) {
          const x = a[0] + ((b[0] - a[0]) * k) / 40
          const z = a[2] + ((b[2] - a[2]) * k) / 40
          const y = a[1] + ((b[1] - a[1]) * k) / 40
          const g = Math.max(0, ground(x, z)) * M
          buried = Math.max(buried, g - y)
          floats = Math.max(floats, y - g - EAVE - it.reach * M)
        }
      }
    }
    if (floats > TOL) flag(it, 'floats', `${(floats / M).toFixed(2)} m over the ground`)
    if (buried > TOL) flag(it, 'buried', `${(buried / M).toFixed(2)} m into the ground`)
    // the brink: ground falling away just outside the footprint (the core's
    // frame, out to everything it stands on)
    const fp = frameOf(core ? core.bot : it.eaves, quads)
    const sk = it.kind === 'heiau' ? 0.12 : 0.06
    let fall = 0
    for (let k = 0; k < 32; k++) {
      const a = (k / 32) * Math.PI * 2
      const du = Math.cos(a)
      const dv = Math.sin(a)
      const t = Math.min(fp.hu / Math.max(1e-6, Math.abs(du)), fp.hv / Math.max(1e-6, Math.abs(dv)))
      const [ex, ez] = fp.at(du * t, dv * t)
      const [sx, sz] = fp.at(du * (t + sk), dv * (t + sk))
      fall = Math.max(fall, (Math.max(0, ground(ex, ez)) - Math.max(0, ground(sx, sz))) / (sk * 100))
    }
    if (fall > BRINK) flag(it, 'brink', `ground falls ${fall.toFixed(2)} m/m beyond it`)
    it.quads = quads
  }
  // overlaps between buildings
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const A = items[i]
      const B = items[j]
      if (A.group && A.group === B.group) continue
      if (Math.hypot(A.x - B.x, A.z - B.z) > 2) continue
      if (A.quads.some((p) => B.quads.some((q) => quadsOverlap(p, q)))) flag(A, 'overlap', `with ${B.kind} ${B.tag || ''} at (${B.x.toFixed(2)}, ${B.z.toFixed(2)})`)
    }
  }
  return { flagged, counts }
}

/** The rectangle, in the frame of quad `q`, that holds every corner of `quads`. */
function frameOf(q, quads) {
  const ox = q[0][0]
  const oz = q[0][1]
  const l = Math.hypot(q[1][0] - ox, q[1][1] - oz) || 1
  const c = (q[1][0] - ox) / l
  const s = (q[1][1] - oz) / l
  let u0 = Infinity
  let u1 = -Infinity
  let v0 = Infinity
  let v1 = -Infinity
  for (const Q of quads) {
    for (const p of Q) {
      const u = (p[0] - ox) * c + (p[1] - oz) * s
      const v = -(p[0] - ox) * s + (p[1] - oz) * c
      u0 = Math.min(u0, u)
      u1 = Math.max(u1, u)
      v0 = Math.min(v0, v)
      v1 = Math.max(v1, v)
    }
  }
  const cu = (u0 + u1) / 2
  const cv = (v0 + v1) / 2
  return { hu: (u1 - u0) / 2, hv: (v1 - v0) / 2, at: (du, dv) => [ox + (cu + du) * c - (cv + dv) * s, oz + (cu + du) * s + (cv + dv) * c] }
}

// --- each heiau's faces --------------------------------------------------------------------------

/**
 * The tallest sheer wall (m) on a side of a heiau without terraces, the face
 * left below its last terrace, and the mean height of each side's wall, read
 * from its footing.
 */
function faces(island, f) {
  const h = island.data.height
  const c = Math.cos(f.rot)
  const s = Math.sin(f.rot)
  const g = (u, v) => Math.max(0, drawn(h, f.x + u * c - v * s, f.z + u * s + v * c)) * M
  const ext = f.steps.length ? f.steps[f.steps.length - 1].ext : [0, 0, 0, 0]
  const main = ext.findIndex((e) => e > 0)
  const side = (k, e, top) => {
    const along = k < 2
    const off = k === 0 ? -f.hx - e[0] : k === 1 ? f.hx + e[1] : k === 2 ? -f.hz - e[2] : f.hz + e[3]
    const a0 = along ? -f.hz - e[2] : -f.hx - e[0]
    const a1 = along ? f.hz + e[3] : f.hx + e[1]
    let max = 0
    let sum = 0
    for (let i = 0; i <= 40; i++) {
      const t = a0 + ((a1 - a0) * i) / 40
      const y = (top - (along ? g(off, t) : g(t, off))) / M
      max = Math.max(max, y)
      sum += y
    }
    return { max, mean: sum / 41 }
  }
  let sheer = 0
  const means = []
  for (let k = 0; k < 4; k++) {
    const r = side(k, [0, 0, 0, 0], f.top)
    means.push(r.mean)
    if (k !== main) sheer = Math.max(sheer, r.max)
  }
  const outer = main >= 0 ? side(main, ext, f.steps[f.steps.length - 1].top).max : 0
  return { sheer, outer, main, means }
}

// --- the layout as footing.js settles it and Features draws it --------------------------------------

function drawnItems(footings) {
  const rec = new Recorder()
  let seed = 1
  const rand = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }
  const out = []
  footings.forEach((f, n) => {
    rec.reset()
    buildFooting(rec, f, rand)
    const heiau = f.kind === 'heiau' || f.kind === 'luakini'
    // (a footing forced onto steep ground, built up from the lowest of it, takes up half as much again)
    const it = { kind: heiau ? 'heiau' : f.kind, reach: (REACH[f.kind] ?? 1) * (f.forced ? 1.5 : 1), tag: f.tag, x: f.x, z: f.z, f }
    if (f.kind === 'salt') {
      // each pan its own clay bed (every other box: the salt lies on it)
      f.pans.forEach((p, k) => out.push({ ...it, tag: `pans ${n}`, group: `salt${n}`, x: p.x, z: p.z, blocks: [rec.boxes[2 * k]] }))
      return
    }
    if (f.kind === 'house' || f.kind === 'koa' || f.kind === 'ahu') it.blocks = [rec.boxes[0]]
    else if (heiau) {
      // the terraces (lowest first), then the base tier
      it.blocks = rec.boxes.slice(0, f.steps.length + 1)
      it.core = f.steps.length
    } else if (f.kind === 'halau') {
      // the two roof slopes come first; their first and last corners are the eaves
      const [a, b] = rec.quads
      it.eaveLines = [[a[0], a[3]], [b[0], b[3]]]
      it.eaves = [a[0], a[3], b[0], b[3]].map((p) => [p[0], p[2]])
      it.blocks = []
    } else {
      // the imu: a pile of stones, settled on the lowest ground under it
      it.blocks = [flatBlock(f.x, f.z, f.rot, f.hx, f.hz, f.top, f.base)]
    }
    out.push(it)
  })
  return out
}

// --- the layout before buildings were settled onto the ground -----------------------------------

function legacyItems(island) {
  const meta = island.meta
  const s = meta.sites
  const h = island.data.height
  const g = (x, z) => Math.max(0, bilinear(h, HEIGHT_RES, x, z) * M)
  const HOUSE = { noa: [7, 4.6], mua: [8, 5], aina: [6, 4.2], kuku: [5, 3.6], alii: [12, 7] }
  const out = []
  const add = (kind, tag, x, z, rot, hx, hz, top, base, more = {}) => out.push({ kind, tag, x, z, group: more.group, reach: REACH[more.reach || kind], blocks: [flatBlock(x, z, rot, hx, hz, top, base)] })
  const house = (x, z, rot, L, W, tag, y = g(x, z)) => add('house', tag, x, z, rot, ((L + 1.8) * S) / 2, ((W + 1.8) * S) / 2, y + 0.45 * S, y - 0.6 * S)
  for (const q of s.houses) {
    const [L, W] = HOUSE[q.kind] || HOUSE.noa
    const sc = q.scale || 1
    house(q.x, q.z, q.rot, L * sc, W * sc, `${q.kind} v${q.village}`)
  }
  const heiau = (x, z, rot, big, tag) => {
    const y = g(x, z)
    add('heiau', tag, x, z, rot, ((big ? 44 : 26) * S) / 2, ((big ? 30 : 18) * S) / 2, y + (big ? 1.6 : 1.2) * S, y - 1.5 * S, { reach: big ? 'luakini' : 'heiau' })
  }
  for (const q of s.heiau) heiau(q.x, q.z, q.rot, q.kind === 'luakini', `${q.kind} a${q.id}${q.model ? ' model' : ''}`)
  for (const c of s.canoes) {
    if (!c.house) continue
    const x = c.x - Math.cos(c.dir) * 0.32
    const z = c.z - Math.sin(c.dir) * 0.32
    const y = g(x, z)
    add('halau', `v${c.village}`, x, z, c.dir, 8.2 * S, 3.3 * S, y + 0.3 * S, y)
  }
  for (const k of s.koa) {
    const y = g(k.x, k.z)
    add('koa', `a${k.id}`, k.x, k.z, 0, 1.6 * S, 1.2 * S, y + 0.5 * S, y - 0.3 * S)
  }
  for (const a of meta.ahu) {
    const y = g(a.x, a.z)
    add('ahu', `${a.a}|${a.b}`, a.x, a.z, 0, 1.6 * S, 1.6 * S, y + 0.3 * S, y - 0.4 * S)
  }
  for (const p of s.ponds) {
    const q = p.wall[Math.round(p.gates[0] * (p.wall.length - 1))]
    add('house', 'pond keeper', q[0] - p.ax * 0.12, q[1] - p.az * 0.12, 0, 2.9 * S, 2.4 * S, 0.004 + 0.45 * S, 0.004 - 0.6 * S)
  }
  if (s.puuhonua) {
    const p = s.puuhonua
    const dx = Math.cos(p.dir)
    const dz = Math.sin(p.dir)
    heiau(p.x - dx * 0.5, p.z - dz * 0.5, p.dir, false, 'puuhonua')
    const cx = p.x - dx * 1.6
    const cz = p.z - dz * 1.6
    for (let k = 0; k < 3; k++) house(cx + dx * 0.5 - dz * (k - 1) * 0.6, cz + dz * 0.5 + dx * (k - 1) * 0.6, p.dir + Math.PI / 2, 6, 4, 'puuhonua')
  }
  s.saltpans.forEach((sp, n) => {
    const ang = sp.dir + Math.PI / 2
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        const lx = (i - 1.5) * 0.11
        const lz = (j - 1) * 0.09
        const x = sp.x + Math.cos(ang) * lx - Math.sin(ang) * lz
        const z = sp.z + Math.sin(ang) * lx + Math.cos(ang) * lz
        const y = Math.max(bilinear(h, HEIGHT_RES, x, z) * M, 0.004)
        add('salt', `pans ${n}`, x, z, ang, 3.3 * S, 2.7 * S, y + 0.2 * S, y - 0.3 * S, { group: `salt${n}` })
      }
    }
  })
  return out
}

// --- run ----------------------------------------------------------------------------------------

let total = 0
for (const seed of seeds) {
  const t0 = Date.now()
  const island = generateIsland(seed)
  const wl = planFalls(island, { carve: true })
  const lines = wl.lines || layStreams(island.meta, island.data)
  let items
  let note = ''
  if (footing) {
    const t = performance.now()
    const p = footing.planFootings(island, lines)
    note = `, settled in ${(performance.now() - t).toFixed(0)} ms: ${p.moved} moved, ${p.dropped} dropped`
    items = drawnItems(p.list)
  } else items = legacyItems(island)
  const report = audit(island, lines, items)
  total += report.flagged.length
  const counts = Object.entries(report.counts).map(([k, v]) => `${k} ${v}`).join(', ')
  const n = new Set(items.map((it) => it.group || it)).size
  let faceNote = ''
  const heiau = footing ? items.filter((it) => it.kind === 'heiau') : []
  if (heiau.length) {
    const F = heiau.map((it) => ({ it, ...faces(island, it.f) }))
    const terr = F.filter((q) => q.main >= 0)
    faceNote = `; heiau ${heiau.length}, ${terr.length} terraced (${terr.filter((q) => q.means[q.main] === Math.max(...q.means)).length} on the side that falls most), tallest wall without terraces ${Math.max(...F.map((q) => q.sheer)).toFixed(1)} m`
    if (list) {
      for (const q of F) {
        const { it } = q
        console.log(`    heiau  ${it.tag.padEnd(22)} relief ${it.f.relief.toFixed(1)} m, ${it.f.steps.length} terrace(s)${q.main >= 0 ? ` on side ${q.main}, face below them ${q.outer.toFixed(1)} m` : ''}; walls (mean, by side) ${q.means.map((m) => m.toFixed(1)).join('/')} m; tallest without terraces ${q.sheer.toFixed(1)} m`)
      }
    }
  }
  console.log(`seed ${seed}: ${n} buildings${note}; ${report.flagged.length} flagged${counts ? ` (${counts})` : ''}${faceNote}  [${((Date.now() - t0) / 1000).toFixed(1)} s]`)
  if (list) for (const f of report.flagged) console.log('   ', f)
}
console.log(`total flagged: ${total}`)
