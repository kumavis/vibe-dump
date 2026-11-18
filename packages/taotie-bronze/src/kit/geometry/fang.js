// Rectangular-section bodies (fangding, fangyi, fanglei, fangzun sections) —
// research/03 §1.1, §1.10, §3, §5, §6.1–6.3.
//
// A fang vessel's walls were cast in one mould section per face (sometimes two),
// joined at the corners — which is why classic Anyang corners carry flanges:
// they hide the seams. So each face is built as its own set of surface patches,
// split into a grid of décor CELLS (registers × columns) that each carry their
// own ReliefMap, and everything that is not a decorated outer face (underside,
// rim, inner skin, floor, foot ring) is one SWEEP of a 2D wall-section profile
// around a rounded rectangle. Every patch is evaluated from the same section
// function, so shared borders coincide exactly (watertight by construction; the
// relief fades to 0 at cell borders, see surface.js).
//
// Coordinates: mm, Y up, the group stands on y = 0, front = +Z. Sides in order
// front (+Z), right (+X), back (−Z), left (−X); seen from outside each side's
// parameter s runs 0 → 1 left → right, so a panel's x follows s.

import * as THREE from 'three'
import { buildSurface } from './surface.js'
import { PatinaMaterial } from '../material/patina.js'
import { Rng } from '../util/rng.js'

export const SIDES = ['front', 'right', 'back', 'left']
export const CORNERS = ['front-right', 'right-back', 'back-left', 'left-front']
const SN = [[0, 0, 1], [1, 0, 0], [0, 0, -1], [-1, 0, 0]] // outward normal of side k
const ST = [[1, 0, 0], [0, 0, -1], [-1, 0, 0], [0, 0, 1]] // direction of s (left → right from outside)
const CENTER = -1e9 // profile d sentinel: collapse to the centre (floors, undersides)

const clamp = (x, a, b) => Math.min(b, Math.max(a, x))
const lerp = (a, b, t) => a + (b - a) * t
const rad = (d) => (d * Math.PI) / 180
function ramp(x, w) {
  if (w <= 0) return x > 0 ? 1 : 0
  if (x <= 0) return 0
  if (x >= w) return 1
  const t = x / w
  return t * t * (3 - 2 * t)
}

// ---------------------------------------------------------------------------
// Section: the outer base outline at height y — a rounded rectangle.

/**
 * Resolve body dimensions to a section function.
 * width/depth are outer wall dims at the BOTTOM of the wall (legacy) or at the
 * top with `at: 'top'`. taper (deg, number or {x, z}) = lean of the walls from
 * vertical, + = leaning out going up (taper.x widens X). `top: {width, depth}`
 * overrides taper. `flare` (legacy) = top is (1 + flare)× the bottom.
 */
export function fangSection({ width, depth, height, taper = 0, top = null, flare = 0, at = 'bottom', bulge = 0, bulgeAt = 0.5, cornerRadius = 0, profile = null }) {
  const H = height
  const tx = typeof taper === 'number' ? taper : taper.x ?? 0
  const tz = typeof taper === 'number' ? taper : taper.z ?? 0
  let a0, b0, a1, b1
  if (top) {
    a0 = width / 2; b0 = depth / 2
    a1 = top.width / 2; b1 = top.depth / 2
  } else if (flare) {
    a0 = width / 2; b0 = depth / 2
    a1 = a0 * (1 + flare); b1 = b0 * (1 + flare)
  } else if (at === 'top') {
    a1 = width / 2; b1 = depth / 2
    a0 = a1 - H * Math.tan(rad(tx)); b0 = b1 - H * Math.tan(rad(tz))
  } else {
    a0 = width / 2; b0 = depth / 2
    a1 = a0 + H * Math.tan(rad(tx)); b1 = b0 + H * Math.tan(rad(tz))
  }
  const bp = bulgeAt > 0 && bulgeAt < 1 ? Math.log(0.5) / Math.log(bulgeAt) : 1
  const bx = typeof bulge === 'number' ? bulge : bulge.x ?? 0
  const bz = typeof bulge === 'number' ? bulge : bulge.z ?? 0
  const out = { a: 0, b: 0, r: 0 }
  const fn = (y) => {
    const t = clamp(y / H, 0, 1)
    const bb = Math.sin(Math.PI * Math.pow(t, bp))
    let a = lerp(a0, a1, t) + bx * bb
    let b = lerp(b0, b1, t) + bz * bb
    if (profile) {
      const p = profile(t)
      a += p.dx ?? p.d ?? 0
      b += p.dz ?? p.d ?? 0
    }
    out.a = a; out.b = b
    out.r = Math.min(cornerRadius, a, b)
    return out
  }
  fn.H = H
  fn.dims = { a0, b0, a1, b1 }
  return fn
}

/** Geometry of the offset outline: half extents A, B, corner radius R for offset d. */
function offsetDims(sec, d, innerR, wall) {
  const m = Math.min(sec.a, sec.b)
  if (d < -m) d = -m
  const A = Math.max(0, sec.a + d)
  const B = Math.max(0, sec.b + d)
  let R = sec.r > 0 ? Math.max(0, sec.r + d) : 0
  if (d < 0 && innerR > 0) R = Math.max(R, innerR * Math.min(1, -d / Math.max(wall, 1e-6)))
  R = Math.min(R, A, B)
  return { A, B, R, d }
}

// ---------------------------------------------------------------------------
// Cast-not-CAD deformation (research/03 §5), as a smooth field so every patch
// moves consistently and seams stay closed.

function value2(seed) {
  const h = (i, j) => {
    let x = (i * 374761393 + j * 668265263 + seed * 1442695041) | 0
    x = Math.imul(x ^ (x >>> 13), 1274126177)
    return ((x ^ (x >>> 16)) >>> 0) / 4294967296
  }
  return (x, y) => {
    const i = Math.floor(x), j = Math.floor(y)
    const fx = x - i, fy = y - j
    const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy)
    const a = h(i, j), b = h(i + 1, j), c = h(i, j + 1), d = h(i + 1, j + 1)
    return (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy) * 2 - 1
  }
}

/**
 * cast: { seed, sag, rim, wave, waveLength, skew } — all optional.
 *  sag   face bow outward, fraction of the face span (research: 0.002–0.005)
 *  rim   rim out of level, mm peak-to-peak (0.3–1 % of H), low frequency
 *  wave  plane waviness amplitude, mm (0.1–0.3), waveLength mm (20–60)
 *  skew  corner squareness error, degrees (±0.5–1)
 * `cast: true` picks research-typical values for the vessel size.
 */
function makeCast(cast, H, dims) {
  if (!cast) return null
  const c = cast === true ? {} : cast
  const r = new Rng(c.seed ?? 7)
  const scale = H / 300
  const o = {
    sagK: [0, 1, 2, 3].map(() => (c.sag ?? 0.003) * r.range(0.5, 1.2)),
    rim: c.rim ?? 0.006 * H,
    wave: c.wave ?? Math.min(0.6, 0.15 * Math.max(1, scale)),
    waveLength: c.waveLength ?? 40 * Math.max(1, Math.sqrt(scale)),
    skew: Math.tan(rad(c.skew ?? r.jitter(0.6))),
    noise: value2(r.int(1, 1e6)),
  }
  // rim level field: ½ peak-to-peak over the corners, mixed tilt + saddle
  const ang = r.range(0, Math.PI * 2)
  const sad = r.range(-0.6, 0.6)
  o.level = [Math.cos(ang) * 0.5 * o.rim, Math.sin(ang) * 0.5 * o.rim, sad * 0.5 * o.rim]
  o.a = Math.max(dims.a0, dims.a1)
  o.b = Math.max(dims.b0, dims.b1)
  return o
}

// ---------------------------------------------------------------------------
// The point function shared by every patch of a body.

function makeFrame({ sec, H, cast, innerR, wall, yBase = 0, span }) {
  const P = new THREE.Vector3()
  // straight-portion point of side k at fraction s, offset d, height y (body coords)
  function side(k, s, d, y, out = P) {
    const sc = sec(clamp(y, 0, H))
    const { A, B, R } = offsetDims(sc, d, innerR, wall)
    const even = (k & 1) === 0
    const D = even ? B : A
    const L = (even ? A : B) - R
    const x = (2 * s - 1) * L
    const n = SN[k], t = ST[k]
    out.set(n[0] * D + t[0] * x, y, n[2] * D + t[2] * x)
    if (cast) {
      const m = Math.min(sc.a, sc.b)
      const wd = clamp(1 + Math.max(d, -m) / m, 0, 1.3)
      const sp = span[k]
      const env = 4 * s * (1 - s)
      let off = cast.sagK[k] * sp * env
      if (cast.wave) off += cast.wave * Math.min(1, 2 * env) * cast.noise((s * sp) / cast.waveLength + k * 17.3, y / cast.waveLength)
      out.x += n[0] * off * wd
      out.z += n[2] * off * wd
    }
    return field(out, y)
  }
  // corner k (between side k and k+1) at fraction f of the quarter arc
  function corner(k, f, d, y, out = P) {
    const sc = sec(clamp(y, 0, H))
    const { A, B, R } = offsetDims(sc, d, innerR, wall)
    const even = (k & 1) === 0
    const D = even ? B : A
    const L = (even ? A : B) - R
    const n = SN[k], t = ST[k]
    const ph = f * Math.PI * 0.5
    const cx = n[0] * (D - R) + t[0] * L, cz = n[2] * (D - R) + t[2] * L
    out.set(cx + R * (n[0] * Math.cos(ph) + t[0] * Math.sin(ph)), y, cz + R * (n[2] * Math.cos(ph) + t[2] * Math.sin(ph)))
    return field(out, y)
  }
  function field(p, y) {
    if (cast) {
      const t = clamp(y / H, 0, 1)
      const u = p.x / cast.a, w = p.z / cast.b
      p.y += t * (cast.level[0] * u + cast.level[1] * w + cast.level[2] * u * w)
      p.x += cast.skew * p.z
    }
    p.y += yBase
    return p
  }
  return { side, corner, field, sec, H }
}

// ---------------------------------------------------------------------------
// Profiles: polyline of [d, y, round?] → runs of dense points split at sharp vertices.

/**
 * @param {Array<[number, number, number?]>} pts  (d, y, fillet radius mm; 0/omitted = sharp)
 * @returns {Array<Array<[number,number]>>} runs (each a smooth polyline; sharp vertices end a run)
 */
export function profileRuns(pts) {
  const P = pts.filter((p, i) => i === 0 || Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) > 1e-6 || p[0] === CENTER)
  const runs = []
  let cur = [[P[0][0], P[0][1]]]
  for (let i = 1; i < P.length; i++) {
    const p = P[i]
    const r = p[2] ?? 0
    const last = i === P.length - 1
    if (!last && r > 0 && p[0] !== CENTER && P[i - 1][0] !== CENTER && P[i + 1][0] !== CENTER) {
      const a = P[i - 1], c = P[i + 1]
      const u1 = norm2([a[0] - p[0], a[1] - p[1]]), u2 = norm2([c[0] - p[0], c[1] - p[1]])
      const la = Math.hypot(a[0] - p[0], a[1] - p[1]), lc = Math.hypot(c[0] - p[0], c[1] - p[1])
      const cosT = clamp(u1[0] * u2[0] + u1[1] * u2[1], -1, 1)
      const th = Math.acos(cosT)
      if (th > 1e-3 && th < Math.PI - 1e-3) {
        let td = r / Math.tan(th / 2)
        const tmax = 0.49 * Math.min(la, lc)
        const rr = td > tmax ? (tmax * Math.tan(th / 2)) : r
        td = Math.min(td, tmax)
        const t1 = [p[0] + u1[0] * td, p[1] + u1[1] * td], t2 = [p[0] + u2[0] * td, p[1] + u2[1] * td]
        const bis = norm2([u1[0] + u2[0], u1[1] + u2[1]])
        const cd = rr / Math.sin(th / 2)
        const cc = [p[0] + bis[0] * cd, p[1] + bis[1] * cd]
        let a0 = Math.atan2(t1[1] - cc[1], t1[0] - cc[0]), a1 = Math.atan2(t2[1] - cc[1], t2[0] - cc[0])
        let da = a1 - a0
        while (da > Math.PI) da -= 2 * Math.PI
        while (da < -Math.PI) da += 2 * Math.PI
        const n = Math.max(3, Math.ceil(Math.abs(da) / (Math.PI / 10)))
        for (let k = 0; k <= n; k++) {
          const ang = a0 + (da * k) / n
          cur.push([cc[0] + rr * Math.cos(ang), cc[1] + rr * Math.sin(ang)])
          if (p[3] === 'split' && k === n >> 1) {
            runs.push(cur)
            cur = [cur[cur.length - 1]]
          }
        }
        continue
      }
    }
    cur.push([p[0], p[1]])
    if (!last && !(r > 0)) {
      runs.push(cur)
      cur = [[p[0], p[1]]]
    }
  }
  if (cur.length > 1) runs.push(cur)
  return runs
}
function norm2(v) {
  const l = Math.hypot(v[0], v[1]) || 1
  return [v[0] / l, v[1] / l]
}

/** Add points so no straight segment is longer than `maxSeg` mm (keeps the cast field smooth). */
function densify(run, maxSeg) {
  const out = [run[0]]
  for (let i = 1; i < run.length; i++) {
    const a = run[i - 1], b = run[i]
    if (a[0] === CENTER || b[0] === CENTER) {
      out.push(b)
      continue
    }
    const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / maxSeg))
    for (let k = 1; k <= n; k++) out.push([lerp(a[0], b[0], k / n), lerp(a[1], b[1], k / n)])
  }
  return out
}

// ---------------------------------------------------------------------------
// Patch helpers.

const _a = new THREE.Vector3(), _b = new THREE.Vector3(), _c = new THREE.Vector3(), _d = new THREE.Vector3()
/**
 * Wrap a position function (u, v, Vector3) into a buildSurface surface with
 * finite-difference normals (continuous across patches that share a param
 * line); `fallback(u, v, nrm)` covers degenerate points (collapsed floors).
 */
export function withNormals(pos, fallback) {
  const e = 1e-3
  return (u, v, out) => {
    pos(u, v, out.pos)
    pos(Math.min(1, u + e), v, _a); pos(Math.max(0, u - e), v, _b)
    pos(u, Math.min(1, v + e), _c); pos(u, Math.max(0, v - e), _d)
    _a.sub(_b); _c.sub(_d)
    out.nrm.crossVectors(_a, _c)
    const l = out.nrm.length()
    if (l > 1e-9 * Math.max(1, _a.lengthSq(), _c.lengthSq()) && _a.lengthSq() > 1e-12 && _c.lengthSq() > 1e-12) out.nrm.multiplyScalar(1 / l)
    else if (fallback) fallback(u, v, out.nrm)
    else out.nrm.set(0, 1, 0)
  }
}

function mesh(geo, material, part, name) {
  const m = new THREE.Mesh(geo, material)
  m.name = name
  m.userData.part = part
  m.castShadow = m.receiveShadow = true
  return m
}

/** Sweep one profile run around the outline: 4 side patches + 4 corner patches. */
function sweepRun(F, run, { material, part, name, segLen = 40, sides = true, corners = true, hasCorners, profileNormal = true }) {
  const out = []
  const n = run.length - 1
  const at = (v) => {
    const f = v * n
    const i = Math.min(n - 1, Math.floor(f))
    const t = f - i
    const a = run[i], b = run[i + 1]
    const d = a[0] === CENTER || b[0] === CENTER ? (t < 0.5 ? a[0] : b[0]) : lerp(a[0], b[0], t)
    return [d, lerp(a[1], b[1], t), i]
  }
  const fb = (k, isCorner, u) => (uu, v, nrm) => {
    // profile-normal fallback: 2D segment normal rotated into the side's frame
    const [, , i] = at(v)
    const a = run[i], b = run[i + 1]
    let dd = b[0] - a[0]
    if (b[0] === CENTER) dd = -1
    if (a[0] === CENTER) dd = 1
    const dy = b[1] - a[1]
    const l = Math.hypot(dd, dy) || 1
    const nr = dy / l, ny = -dd / l
    let hx = SN[k][0], hz = SN[k][2]
    if (isCorner) {
      const ph = uu * Math.PI * 0.5
      hx = SN[k][0] * Math.cos(ph) + ST[k][0] * Math.sin(ph)
      hz = SN[k][2] * Math.cos(ph) + ST[k][2] * Math.sin(ph)
    }
    nrm.set(nr * hx, ny, nr * hz).normalize()
  }
  for (let k = 0; k < 4; k++) {
    if (sides) {
      const span = F.span[k]
      const nu = Math.max(2, Math.ceil(span / segLen))
      const geo = buildSurface({
        surface: withNormals((u, v, p) => {
          const [d, y] = at(v)
          F.side(k, u, d, y, p)
        }, fb(k, false)),
        segments: [nu, n],
      })
      out.push(mesh(geo, material, part, `${name}-${SIDES[k]}`))
    }
    if (corners && hasCorners) {
      const geo = buildSurface({
        surface: withNormals((u, v, p) => {
          const [d, y] = at(v)
          F.corner(k, u, d, y, p)
        }, fb(k, true)),
        segments: [6, n],
      })
      out.push(mesh(geo, material, part, `${name}-${CORNERS[k]}`))
    }
  }
  return out
}

// ---------------------------------------------------------------------------
// Layout: registers × columns per side, sizes in mm, before anything is built.

function resolveSpans(spec, total) {
  // spec: [mm | {h|w: mm} | {weight}] → [[t0, t1] …] fractions, in spec order
  const items = spec.map((x) => (typeof x === 'number' ? { mm: x } : x.weight != null ? { weight: x.weight } : { mm: x.h ?? x.w ?? x.mm }))
  const fixed = items.reduce((s, x) => s + (x.mm ?? 0), 0)
  const wsum = items.reduce((s, x) => s + (x.weight ?? 0), 0)
  let scale = 1, rest = total - fixed
  if (wsum === 0) scale = total / (fixed || 1)
  const sizes = items.map((x) => (x.mm != null ? x.mm * (wsum === 0 ? scale : 1) : (Math.max(0, rest) * x.weight) / wsum))
  const out = []
  let acc = 0
  for (const s of sizes) {
    out.push([acc / total, (acc + s) / total])
    acc += s
  }
  if (out.length) out[out.length - 1][1] = 1
  return out
}

function pickSide(obj, k) {
  if (!obj) return undefined
  const name = SIDES[k]
  if (obj[name] !== undefined) return obj[name]
  const kind = k % 2 === 0 ? 'long' : 'short'
  if (obj[kind] !== undefined) return obj[kind]
  return obj.all
}

/**
 * Cell sizes for authoring panels 1:1, before building.
 * @returns {{ sides: { front: { rows, cols, cells: [[cell]] } … }, section, H, foot? }}
 *   cell = { side, row, col, w, h, wBottom, wTop, wMax, s0, s1, y0, y1, outline }
 *   w      panel width (mm) for map 'stretch' (the face width at the cell's mid height)
 *   wMax   panel width for map 'true' (1:1 mm everywhere; the trapezoid is `outline`, panel mm)
 *   h      panel height (mm, arc length up the wall)
 * rows run TOP → BOTTOM (like compose.register), cols left → right seen from outside.
 */
export function fangLayout(o) {
  const sec = fangSection(o)
  const H = o.height
  const grid = o.grid ?? o.grids ?? null
  const res = { sides: {}, section: sec, H }
  const halfL = (k, y) => {
    const sc = sec(clamp(y, 0, H))
    return ((k & 1) === 0 ? sc.a : sc.b) - sc.r
  }
  for (let k = 0; k < 4; k++) {
    let g = pickSide(grid, k)
    if (grid && (grid.rows || grid.cols) && !g) g = grid
    g = g || {}
    const rowsSpec = g.rows || [{ weight: 1 }]
    const colsSpec = g.cols || [{ weight: 1 }]
    const midW = 2 * halfL(k, H / 2)
    const rowsF = resolveSpans(rowsSpec, H) // top → bottom
    const colsF = resolveSpans(colsSpec, midW)
    const rows = rowsF.map(([t0, t1]) => ({ y0: H * (1 - t1), y1: H * (1 - t0) }))
    const cols = colsF.map(([s0, s1]) => ({ s0, s1 }))
    const cells = rows.map((r, ri) =>
      cols.map((c, ci) => {
        const ys = []
        for (let i = 0; i <= 8; i++) ys.push(lerp(r.y0, r.y1, i / 8))
        const widths = ys.map((y) => (c.s1 - c.s0) * 2 * halfL(k, y))
        const wMax = Math.max(...widths)
        // arc length up the wall at the cell centre
        let h = 0
        for (let i = 1; i < ys.length; i++) {
          const dx = halfL(k, ys[i]) - halfL(k, ys[i - 1])
          const dd = ((k & 1) === 0 ? sec(ys[i]).b - sec(ys[i - 1]).b : sec(ys[i]).a - sec(ys[i - 1]).a)
          h += Math.hypot(ys[i] - ys[i - 1], dd, dx * (c.s0 + c.s1 - 1))
        }
        const outline = []
        ys.forEach((y, i) => outline.push([(wMax - widths[i]) / 2, (h * i) / 8]))
        for (let i = ys.length - 1; i >= 0; i--) outline.push([(wMax + widths[i]) / 2, (h * i) / 8])
        return {
          side: SIDES[k], row: ri, col: ci, s0: c.s0, s1: c.s1, y0: r.y0, y1: r.y1,
          w: widths[4], h, wBottom: widths[0], wTop: widths[8], wMax, outline,
        }
      }),
    )
    res.sides[SIDES[k]] = { rows, cols, cells }
  }
  if (o.foot) res.foot = footLayout(o, sec)
  return res
}

// ---------------------------------------------------------------------------
// The body.

/**
 * Rectangular-section body. Everything optional except width/depth/height.
 *
 * @param {object} o
 * @param {number} o.width,o.depth   outer wall dims (mm) at the bottom of the wall, or at the top with at: 'top'
 * @param {number} o.height          wall height (mm), underside of the floor → top of the wall (rim sits above)
 * @param {'bottom'|'top'} [o.at]
 * @param {number|{x,z}} [o.taper]   wall lean from vertical (deg), + = out going up. Houmuwu ≈ 4–5°
 * @param {{width,depth}} [o.top]    explicit top dims (overrides taper)   @param {number} [o.flare] legacy
 * @param {number|{x,z}} [o.bulge]   belly bulge (mm, outward, peak at bulgeAt 0..1)
 * @param {(t)=>{dx?,dz?,d?}} [o.profile] extra outline offset (mm) by height fraction
 * @param {number} [o.cornerRadius]  0 = sharp arris (flanged Anyang), > 0 rounded corners (own patches)
 * @param {number} [o.wall]          wall thickness (mm); the inner skin is the plain offset of the base surface
 * @param {number} [o.innerRadius]   inner vertical corner radius (core surfaces are soft), default 0.5 wall
 * @param {{thickness?, round?}} [o.floor]   floor thickness (default wall), inner floor/wall fillet
 * @param {object|false} [o.rim]     { kind: 'slab' | 'plain', height, overhang, inner, round, chamfer }
 *        slab = thick flat everted ledge (fangding): `height` mm tall, standing out `overhang` mm beyond the
 *        wall top, thickened `inner` mm inward; plain = the wall's own lip, `inner` thickening allowed
 * @param {object} [o.grid]          { rows: [...top→bottom], cols: [...] } or per side / long / short / all
 * @param {object} [o.cells]         { front|right|back|left|long|short|all: [[cellSpec …] per row, top → bottom] }
 *        cellSpec = null | ReliefMap | { relief, material, map: 'stretch'|'true', fade, density, reliefRect, reliefScale }
 * @param {(cell)=>cellSpec} [o.relief]  alternative: called with each cell's layout (see fangLayout)
 * @param {object} [o.panels]        legacy { front: { relief, material, reliefRect, fade } … } = one cell per side
 * @param {object} [o.foot]          ring foot with notches (fangyi) — see footRing below
 * @param {object|true} [o.cast]     research §5 irregularities, seeded (see makeCast)
 * @param {THREE.Material} [o.material]           plain exterior
 * @param {THREE.Material} [o.interiorMaterial]   inside skin + floor (default PatinaMaterial({ interior: 1 }))
 * @param {number} [o.density]       vertices per mm on decorated cells (plain cells use plainDensity)
 * @returns {THREE.Group}  userData: { part:'body', walls, corners, rim, layout, at(), rimTop(), legSeat(), foot }
 */
export function fangBody(o) {
  const {
    height: H, wall = 8, cornerRadius = 0, material = new PatinaMaterial(), density = 1, plainDensity = 0.06,
    part = 'body', panels = null,
  } = o
  const interiorMaterial = o.interiorMaterial || new PatinaMaterial({ interior: 1 })
  const innerR = o.innerRadius ?? wall * 0.5
  const layout = fangLayout(o)
  const sec = layout.section
  const footH = o.foot ? o.foot.height : 0
  const cast = makeCast(o.cast, H, sec.dims)
  const span = [0, 1, 2, 3].map((k) => {
    const sc = sec(H / 2)
    return 2 * (((k & 1) === 0 ? sc.a : sc.b) - sc.r)
  })
  const F = makeFrame({ sec, H, cast, innerR, wall, yBase: footH, span })
  F.span = span
  const hasCorners = cornerRadius > 0 || innerR > 0
  const g = new THREE.Group()
  g.name = 'fang-body'
  g.userData.part = part

  // ---- profile: underside (centre → outer bottom edge), and over the rim → inner wall → floor
  const floorT = o.floor?.thickness ?? wall
  const floorR = o.floor?.round ?? wall * 0.8
  const rim = o.rim === false ? { kind: 'none' } : { kind: 'plain', ...o.rim }
  const rr = rim.round ?? Math.max(0.6, wall * 0.12)
  const inn = rim.inner ?? 0
  const upper = [[0, H, 0]]
  let rimTopY = H
  let rimOuter = 0
  if (rim.kind === 'slab') {
    const rh = rim.height ?? wall * 2
    const ov = rim.overhang ?? wall * 0.5
    upper.push([ov, H, rr * 0.6], [ov, H + rh, rr], [-(wall + inn), H + rh, rr, 'split'])
    rimTopY = H + rh
    rimOuter = ov
    if (inn > 0) upper.push([-(wall + inn), H + rh - Math.min(rh * 0.5, inn), wall * 0.3], [-wall, H + rh - Math.min(rh * 0.5, inn) - inn * 1.2, wall * 0.6])
  } else if (rim.kind === 'plain') {
    const ch = rim.height ?? 0 // raise the lip above the wall top (mm)
    if (ch > 0) upper.push([0, H + ch, rr])
    upper.push([-(wall + inn), H + ch, rr, 'split'])
    rimTopY = H + ch
    if (inn > 0) upper.push([-wall, H + ch - inn * 1.5, wall * 0.5])
  } else {
    upper.push([-wall, H, 0])
  }
  upper.push([-wall, floorT, floorR], [CENTER, floorT, 0])
  const lower = [[CENTER, 0, 0], [0, 0, 0]]

  const plainSeg = 1 / plainDensity
  for (const run of profileRuns(lower)) g.add(...sweepRun(F, run, { material, part, name: 'underside', segLen: plainSeg * 1.5, hasCorners }))
  const upRuns = profileRuns(upper)
  upRuns.forEach((run, i) => {
    // the first run is the rim (exterior, split at the inner top arris); the rest is the inside
    const interior = i > 0
    g.add(...sweepRun(F, densify(run, plainSeg), { material: interior ? interiorMaterial : material, part, name: interior ? 'inner' : 'rim', segLen: plainSeg, hasCorners }))
  })
  // outer wall corners (rounded corners only)
  if (cornerRadius > 0) g.add(...sweepRun(F, densify([[0, 0], [0, H]], plainSeg), { material, part, name: 'arris', sides: false, hasCorners: true }))

  // ---- decorated faces
  const mats = new Map()
  const matFor = (spec) => {
    if (spec.material) return spec.material
    if (!mats.has(spec.relief)) mats.set(spec.relief, new PatinaMaterial({ relief: spec.relief }))
    return mats.get(spec.relief)
  }
  for (let k = 0; k < 4; k++) {
    const L = layout.sides[SIDES[k]]
    const legacy = panels && panels[SIDES[k]]
    const rowsSpec = pickSide(o.cells, k)
    L.cells.forEach((row, ri) =>
      row.forEach((cell, ci) => {
        let spec = legacy && L.cells.length === 1 && row.length === 1 ? legacy : rowsSpec?.[ri]?.[ci]
        if (spec === undefined && o.relief) spec = o.relief(cell)
        if (spec && spec.macro) spec = { relief: spec }
        if (spec && !spec.relief) spec = spec.material ? spec : null
        cell.mesh = buildCell(F, k, cell, spec, { density, plainSeg, material, matFor, part, H })
        g.add(cell.mesh)
      }),
    )
  }

  // ---- foot ring
  let foot = null
  if (o.foot) {
    foot = footRing(o, sec, layout.foot, { material, interiorMaterial, part: o.foot.part ?? 'foot', density, plainSeg, cast, matFor })
    g.add(foot)
  }

  // ---- userData for flanges, handles, legs
  const v3 = (p) => p.clone()
  const walls = {}
  for (let k = 0; k < 4; k++) {
    const L = layout.sides[SIDES[k]]
    const c = [F.side(k, 0, 0, 0).clone(), F.side(k, 1, 0, 0).clone(), F.side(k, 0, 0, H).clone(), F.side(k, 1, 0, H).clone()]
    const normal = new THREE.Vector3().subVectors(c[1], c[0]).cross(new THREE.Vector3().subVectors(c[2], c[0])).normalize()
    walls[SIDES[k]] = {
      corners: c,
      normal,
      axis: [v3(F.side(k, 0.5, 0, 0)), v3(F.side(k, 0.5, 0, H))],
      registers: L.rows.map((r) => [r.y0 + footH, r.y1 + footH]),
      columns: L.cols.map((c2) => [c2.s0, c2.s1]),
      cells: L.cells.map((row) => row.map(({ mesh: _m, ...rest }) => rest)),
    }
  }
  const corners = {}
  for (let k = 0; k < 4; k++) {
    const arris = (y) => (cornerRadius > 0 ? F.corner(k, 0.5, 0, y).clone() : F.side(k, 1, 0, y).clone())
    const b = arris(0), t = arris(H)
    const n = SN[k], m = SN[(k + 1) % 4]
    corners[CORNERS[k]] = { bottom: b, top: t, out: new THREE.Vector3(n[0] + m[0], 0, n[2] + m[2]).normalize() }
  }
  const s0 = sec(H)
  g.userData.walls = walls
  g.userData.corners = corners
  g.userData.layout = layout
  g.userData.rim = {
    kind: rim.kind, y: rimTopY + footH, wallTop: H + footH,
    outer: { a: s0.a + rimOuter, b: s0.b + rimOuter }, inner: { a: s0.a - wall - inn, b: s0.b - wall - inn },
  }
  g.userData.floorY = floorT + footH
  g.userData.footHeight = footH
  /** point on the base surface: side name|k, s 0..1, y (body coords, above the foot), offset d (mm, + out) */
  g.userData.at = (sideName, s, y, d = 0) => F.side(typeof sideName === 'number' ? sideName : SIDES.indexOf(sideName), s, d, y).clone()
  /** point on the rim top: side, s 0..1 along it, f 0 = outer edge → 1 = inner edge */
  g.userData.rimTop = (sideName, s, f = 0.5) => {
    const k = typeof sideName === 'number' ? sideName : SIDES.indexOf(sideName)
    return F.side(k, s, lerp(rimOuter, -(wall + inn), f), rimTopY).clone()
  }
  /** suggested leg seat under corner k, inset (mm) from both walls at the bottom */
  g.userData.legSeat = (cornerName, inset) => {
    const k = typeof cornerName === 'number' ? cornerName : CORNERS.indexOf(cornerName)
    const sc = sec(0)
    const n = SN[k], m = SN[(k + 1) % 4]
    const x = (n[0] + m[0]) * (sc.a - inset), z = (n[2] + m[2]) * (sc.b - inset)
    const p = new THREE.Vector3(x, 0, z)
    F.field(p, 0)
    return p
  }
  return g
}

function buildCell(F, k, cell, spec, { density, plainSeg, material, matFor, part, H }) {
  const { s0, s1, y0, y1 } = cell
  const pos = (u, v, p) => F.side(k, lerp(s0, s1, u), 0, lerp(y0, y1, v), p)
  const surface = withNormals(pos)
  const name = `wall-${SIDES[k]}-r${cell.row}c${cell.col}`
  if (!spec) {
    const nu = Math.max(2, Math.ceil(cell.w / plainSeg))
    const nv = Math.max(2, Math.ceil(cell.h / plainSeg))
    return mesh(buildSurface({ surface, segments: [nu, nv] }), material, part, name)
  }
  let panelMap = null
  const fade = spec.fade ?? 1.5
  if (spec.map === 'true') {
    const sc = (s0 + s1) / 2
    const W = cell.wMax
    panelMap = (u, v, out) => {
      const y = lerp(y0, y1, v)
      const L = halfLen(F, k, y)
      const s = lerp(s0, s1, u)
      out[0] = 0.5 + ((s - sc) * 2 * L) / W
      out[2] = ramp(Math.min(s - s0, s1 - s) * 2 * L, fade)
    }
  }
  const geo = buildSurface({
    surface,
    segments: { density: spec.density ?? density },
    relief: spec.relief,
    reliefRect: spec.reliefRect,
    fade: spec.map === 'true' ? { u0: 0, u1: 0, v0: fade, v1: fade } : fade,
    reliefScale: spec.reliefScale ?? 1,
    panelMap,
    maxVerts: spec.maxVerts,
  })
  const m = mesh(geo, matFor(spec), part, name)
  m.userData.cell = { side: SIDES[k], row: cell.row, col: cell.col }
  return m
}

function halfLen(F, k, y) {
  const sc = F.sec(clamp(y, 0, F.H))
  return ((k & 1) === 0 ? sc.a : sc.b) - sc.r
}

// ---------------------------------------------------------------------------
// Ring foot with a notch centred in each side (fangyi, fanglei, fangzun).

/**
 * foot: { height, inset = 0 (mm in from the body's bottom outline), flare = 0 (mm out at the ground),
 *         thickness = wall, cornerRadius (default: body's minus inset),
 *         notch: { width (mm, or ≤ 1 = fraction of the side), height (mm, or ≤ 1 = fraction of foot height),
 *                  shape: 'arch' | 'rect', spring (arch: fraction of height where the curve starts, 0.55),
 *                  round (rect corner radius mm) } | { front: …, short: … } | null,
 *         relief: { front|long|short|all: ReliefMap | spec } (one panel per side, map 'true': x 1:1 in mm,
 *                  panel = foot side at the ground; keep the notch area plain — it is faded anyway) }
 */
function footLayout(o, sec) {
  const f = o.foot
  const fh = f.height
  const s0 = sec(0)
  const inset = f.inset ?? 0
  const flare = f.flare ?? 0
  const sides = {}
  for (let k = 0; k < 4; k++) {
    const half = ((k & 1) === 0 ? s0.a : s0.b) - inset + flare
    const r = Math.max(0, Math.min(s0.r - inset + flare, half))
    const L = half - r
    const n = pickSide(f.notch && (f.notch.width != null || f.notch.height != null) ? { all: f.notch } : f.notch, k)
    let notch = null
    if (n) {
      const w = n.width <= 1 ? n.width * 2 * (((k & 1) === 0 ? s0.a : s0.b) - inset - Math.max(0, s0.r - inset)) : n.width
      const h = n.height <= 1 ? n.height * fh : n.height
      notch = { w, h, shape: n.shape ?? 'arch', spring: n.spring ?? 0.55, round: n.round ?? Math.min(w, h) * 0.12 }
      notch.outline = notchOutline(notch)
    }
    sides[SIDES[k]] = { w: 2 * L, h: fh, notch, panelOutline: notch ? notch.outline.map(([x, y]) => [x + L, y]) : null }
  }
  return { height: fh, sides }
}

/** notch top y at local x (|x| ≤ w/2), in mm from the ground */
function notchTop(n, x) {
  const hw = n.w / 2
  const ax = Math.min(1, Math.abs(x) / hw)
  if (n.shape === 'rect') {
    const r = Math.min(n.round, hw * 0.9, n.h * 0.9)
    const ex = Math.abs(x) - (hw - r)
    if (ex <= 0) return n.h
    return n.h - r + Math.sqrt(Math.max(0, r * r - ex * ex))
  }
  const ys = n.h * n.spring
  return ys + (n.h - ys) * Math.sqrt(Math.max(0, 1 - ax * ax))
}
function notchOutline(n, steps = 24) {
  const hw = n.w / 2
  const pts = [[-hw, 0]]
  for (let i = 0; i <= steps; i++) {
    const x = -hw + (n.w * i) / steps
    pts.push([x, notchTop(n, x)])
  }
  pts.push([hw, 0])
  return pts
}
function distToOutline(pts, x, y) {
  let best = Infinity
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const l2 = dx * dx + dy * dy || 1
    const t = clamp(((x - a[0]) * dx + (y - a[1]) * dy) / l2, 0, 1)
    best = Math.min(best, Math.hypot(x - a[0] - dx * t, y - a[1] - dy * t))
  }
  return best
}

function footRing(o, bodySec, fl, { material, interiorMaterial, part, density, plainSeg, cast, matFor }) {
  const f = o.foot
  const fh = f.height
  const t = f.thickness ?? o.wall ?? 6
  const inset = f.inset ?? 0
  const flare = f.flare ?? 0
  const s0 = bodySec(0)
  const baseR = o.cornerRadius > 0 ? Math.max(0, (f.cornerRadius ?? o.cornerRadius - inset)) : f.cornerRadius ?? 0
  const sec = (y) => {
    const e = flare * (1 - clamp(y / fh, 0, 1))
    return { a: s0.a - inset + e, b: s0.b - inset + e, r: baseR > 0 ? baseR + e : 0 }
  }
  sec.H = fh
  const skew = cast ? cast.skew : 0
  const F = makeFrame({ sec, H: fh, cast: null, innerR: 0, wall: t, yBase: 0, span: [0, 0, 0, 0] })
  const side0 = F.side
  F.side = (k, s, d, y, out) => {
    const p = side0(k, s, d, y, out)
    p.x += skew * p.z
    return p
  }
  const corner0 = F.corner
  F.corner = (k, s, d, y, out) => {
    const p = corner0(k, s, d, y, out)
    p.x += skew * p.z
    return p
  }
  F.span = [0, 1, 2, 3].map((k) => 2 * (((k & 1) === 0 ? sec(fh / 2).a : sec(fh / 2).b) - sec(fh / 2).r))
  const g = new THREE.Group()
  g.name = 'fang-foot'
  g.userData.part = part
  const hasCorners = baseR > 0
  const Lh = (k, y, d = 0) => {
    const sc = sec(y)
    const { A, B, R } = offsetDims(sc, d, 0, t)
    return ((k & 1) === 0 ? A : B) - R
  }
  const sOf = (k, x, y, d) => {
    const L = Lh(k, y, d)
    return L > 0 ? (x / L + 1) / 2 : 0.5
  }
  for (let k = 0; k < 4; k++) {
    const info = fl.sides[SIDES[k]]
    const n = info.notch
    let spec = pickSide(f.relief, k)
    if (spec && spec.macro) spec = { relief: spec }
    const Wp = info.w
    const mapFor = (xOf, yOf) =>
      spec
        ? (u, v, out) => {
            const x = xOf(u, v), y = yOf(u, v)
            out[0] = (x + Wp / 2) / Wp
            out[1] = y / fh
            let w = ramp(Math.min(x + Lh(k, y), Lh(k, y) - x), spec.fade ?? 1.5)
            if (n) w *= ramp(distToOutline(n.outline, x, y), spec.notchFade ?? 3)
            out[2] = w
          }
        : null
    const piece = (name, xOf, yOf, d, mat, reliefOK) => {
      const pos = (u, v, p) => {
        const x = xOf(u, v), y = yOf(u, v)
        return F.side(k, sOf(k, x, y, d), d, y, p)
      }
      const L0 = Lh(k, 0)
      const seg = reliefOK && spec ? { density: spec.density ?? density } : [Math.max(2, Math.ceil((2 * L0) / plainSeg)), Math.max(2, Math.ceil(fh / Math.min(plainSeg, 6)))]
      const geo = buildSurface({
        surface: withNormals(pos),
        segments: seg,
        relief: reliefOK && spec ? spec.relief : null,
        fade: 0,
        panelMap: reliefOK ? mapFor(xOf, yOf) : null,
      })
      g.add(mesh(geo, mat, part, `foot-${name}-${SIDES[k]}`))
    }
    const hw = n ? n.w / 2 : 0
    // outer face (d = 0), u along x left → right, v up
    const X = (y, d) => Lh(k, y, d)
    if (n) {
      for (const [nm, xa, xb] of [['l', (y, d) => -X(y, d), () => -hw], ['r', () => hw, (y, d) => X(y, d)]]) {
        piece(`outer-${nm}`, (u, v) => lerp(xa(v * fh, 0), xb(v * fh, 0), u), (u, v) => v * fh, 0, spec ? matFor(spec) : material, true)
        // inner face: u right → left seen from inside = same x order reversed; v down
        piece(`inner-${nm}`, (u, v) => lerp(xa((1 - v) * fh, -t), xb((1 - v) * fh, -t), u), (u, v) => (1 - v) * fh, -t, interiorMaterial, false)
      }
      piece('outer-m', (u) => lerp(-hw, hw, u), (u, v) => lerp(notchTop(n, lerp(-hw, hw, u)), fh, v), 0, spec ? matFor(spec) : material, true)
      piece('inner-m', (u) => lerp(-hw, hw, u), (u, v) => lerp(fh, notchTop(n, lerp(-hw, hw, u)), v), -t, interiorMaterial, false)
    } else {
      piece('outer', (u, v) => lerp(-X(v * fh, 0), X(v * fh, 0), u), (u, v) => v * fh, 0, spec ? matFor(spec) : material, true)
      piece('inner', (u, v) => lerp(-X((1 - v) * fh, -t), X((1 - v) * fh, -t), u), (u, v) => (1 - v) * fh, -t, interiorMaterial, false)
    }
    // bottom (y = 0): u along x, v from d = −t → 0
    const bottom = (name, xa, xb) => {
      const pos = (u, v, p) => {
        const d = lerp(-t, 0, v)
        const x = lerp(xa(d), xb(d), u)
        return F.side(k, sOf(k, x, 0, d), d, 0, p)
      }
      g.add(mesh(buildSurface({ surface: withNormals(pos), segments: [Math.max(2, Math.ceil((2 * Lh(k, 0)) / plainSeg)), 1] }), material, part, `foot-bottom-${name}-${SIDES[k]}`))
    }
    if (n) {
      bottom('l', (d) => -Lh(k, 0, d), () => -hw)
      bottom('r', () => hw, (d) => Lh(k, 0, d))
      // reveal: along the notch outline, from d = −t → 0
      const ol = n.outline
      const cum = [0]
      for (let i = 1; i < ol.length; i++) cum.push(cum[i - 1] + Math.hypot(ol[i][0] - ol[i - 1][0], ol[i][1] - ol[i - 1][1]))
      const total = cum[cum.length - 1]
      const olAt = (u) => {
        const s = u * total
        let i = 1
        while (i < cum.length - 1 && cum[i] < s) i++
        const f2 = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1)
        return [lerp(ol[i - 1][0], ol[i][0], f2), lerp(ol[i - 1][1], ol[i][1], f2)]
      }
      const pos = (u, v, p) => {
        const [x, y] = olAt(u)
        const d = lerp(-t, 0, v)
        return F.side(k, sOf(k, x, y, d), d, y, p)
      }
      g.add(mesh(buildSurface({ surface: withNormals(pos), segments: [ol.length * 2, 1] }), material, part, `foot-reveal-${SIDES[k]}`))
    } else bottom('full', (d) => -Lh(k, 0, d), (d) => Lh(k, 0, d))
  }
  if (hasCorners) {
    for (const run of [[[0, 0], [0, fh]], [[-t, fh], [-t, 0]], [[-t, 0], [0, 0]]]) {
      g.add(...sweepRun(F, run, { material, part, name: 'foot', sides: false, hasCorners: true }))
    }
  }
  // flange anchors on the foot
  const corners = {}
  for (let k = 0; k < 4; k++) {
    const n = SN[k], m = SN[(k + 1) % 4]
    const arris = (y) => (hasCorners ? F.corner(k, 0.5, 0, y).clone() : F.side(k, 1, 0, y).clone())
    corners[CORNERS[k]] = { bottom: arris(0), top: arris(fh), out: new THREE.Vector3(n[0] + m[0], 0, n[2] + m[2]).normalize() }
  }
  const axes = {}
  for (let k = 0; k < 4; k++) {
    const n = fl.sides[SIDES[k]].notch
    axes[SIDES[k]] = { bottom: F.side(k, 0.5, 0, n ? n.h : 0).clone(), top: F.side(k, 0.5, 0, fh).clone(), normal: new THREE.Vector3(...SN[k]) }
  }
  g.userData.corners = corners
  g.userData.axes = axes
  g.userData.layout = fl
  return g
}
