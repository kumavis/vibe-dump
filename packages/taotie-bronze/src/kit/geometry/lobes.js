// Lobed bodies — li 鬲, he 盉, jia 斝, li-ding: a body made of pouch-like LOBES that run down into
// the legs (research/03 §1). STATUS: first pass (round 7, nezu-fanghe).
//
// A lobe is one closed "sock" lofted along Y through a rounded-rectangle section that changes with
// height: a leg section at the bottom, swelling into a full lobe above the crotch, a plain square
// quarter at the top where the lobes merge into a box or round neck. Each corner of the section has
// its own radius and the two OUTER sides may bow out (bulge), so the outer corner can stay a crisp
// arris (where a flange sits) while the valley between two lobes is a deep rounded crease. Neighbouring
// lobes OVERLAP above the crotch (section x0 / z0 < 0): the visible crease is simply where two mirror-
// image lobes intersect, on the centre plane; below the crotch apex they part (x0 > 0) and the inner
// sides become the soffit of the arch between the legs. lobedBody() places N rotated copies (4 for a
// square plan; 3 for a tripod li, rotated 120°).
//
// Frame: mm, Y up, the foot on y = 0. A lobe is authored as the +X +Z one: its OUTER corner is
// (x1, z1); its "front" outer side is z = z1 (x0 → x1, faces +Z), its "side" outer side x = x1 (z1 → z0,
// faces +X). Relief: ONE panel per lobe, laid over the two outer sides in developed mm — panel x runs
// from the front crease (x = 0, or the front-inner corner's mid point below the crotch) round the outer
// corner to the side crease, piecewise-linear so both creases sit exactly on the panel's left and right
// edges and the outer corner exactly at `split` (default: the panel's middle); panel y = world y.

import * as THREE from 'three'
import { buildSurface } from './surface.js'
import { PatinaMaterial } from '../material/patina.js'

const ARC = 24 // segments per quarter arc in the section polyline
const SEG = 18 // segments per straight side

/**
 * The section polyline at height y, as a closed loop starting at the inner corner's mid point and
 * running −X side → front-inner corner → front → outer corner → side → side-inner corner → back.
 * spec: { x0, x1, z0, z1, r: number | [outer, front, inner, side], bulge: number | { front, side } }
 * → { pts: Float64Array (x, z pairs), cum: Float64Array (arc length), L, sOuter (arc length at the
 *    outer corner mid point), sFront, sSide (the two panel edges, see header) }
 */
export function lobeSection(spec) {
  const { x0, x1, z0, z1 } = spec
  const R = Array.isArray(spec.r) ? spec.r : [spec.r ?? 0, spec.r ?? 0, spec.r ?? 0, spec.r ?? 0]
  const bF = typeof spec.bulge === 'number' ? spec.bulge : spec.bulge?.front ?? 0
  const bS = typeof spec.bulge === 'number' ? spec.bulge : spec.bulge?.side ?? 0
  const w = x1 - x0, d = z1 - z0
  const lim = (r) => Math.max(0, Math.min(r, w / 2 - 0.01, d / 2 - 0.01))
  const [rO, rF, rI, rS] = R.map(lim)
  // corners in traversal order: inner (x0,z0) [in +Z… no: in from back (−X dir), out +Z], front-inner, outer, side-inner
  const C = [
    { p: [x0, z0], din: [-1, 0], dout: [0, 1], r: rI },
    { p: [x0, z1], din: [0, 1], dout: [1, 0], r: rF },
    { p: [x1, z1], din: [1, 0], dout: [0, -1], r: rO },
    { p: [x1, z0], din: [0, -1], dout: [-1, 0], r: rS },
  ]
  const out = []
  const tags = [] // 0 plain, 2 outer-corner mid, 1 front-inner mid, 3 side-inner mid
  const arc = (c, a0, a1, tagMid) => {
    const cx = c.p[0] + c.r * (c.dout[0] - c.din[0]), cz = c.p[1] + c.r * (c.dout[1] - c.din[1])
    for (let i = 0; i <= ARC; i++) {
      const f = a0 + ((a1 - a0) * i) / ARC
      if (i === 0 && out.length) continue
      const ph = (f * Math.PI) / 2
      out.push(cx + c.r * (-c.dout[0] * Math.cos(ph) + c.din[0] * Math.sin(ph)), cz + c.r * (-c.dout[1] * Math.cos(ph) + c.din[1] * Math.sin(ph)))
      tags.push(tagMid != null && Math.abs(f - 0.5) < 1e-9 ? tagMid : 0)
    }
  }
  const straight = (a, b, nrm, bulge) => {
    for (let i = 1; i < SEG; i++) {
      const t = i / SEG
      const s = bulge ? bulge * Math.sin(Math.PI * t) : 0
      out.push(a[0] + (b[0] - a[0]) * t + nrm[0] * s, a[1] + (b[1] - a[1]) * t + nrm[1] * s)
      tags.push(0)
    }
  }
  const tan = (c, end) => (end
    ? [c.p[0] + c.r * c.dout[0], c.p[1] + c.r * c.dout[1]]
    : [c.p[0] - c.r * c.din[0], c.p[1] - c.r * c.din[1]])
  arc(C[0], 0.5, 1)
  straight(tan(C[0], true), tan(C[1], false), [-1, 0], 0)
  arc(C[1], 0, 1, 1)
  straight(tan(C[1], true), tan(C[2], false), [0, 1], bF)
  arc(C[2], 0, 1, 2)
  straight(tan(C[2], true), tan(C[3], false), [1, 0], bS)
  arc(C[3], 0, 1, 3)
  straight(tan(C[3], true), tan(C[0], false), [0, -1], 0)
  arc(C[0], 0, 0.5)
  const n = out.length / 2
  const pts = new Float64Array(out)
  const cum = new Float64Array(n)
  for (let i = 1; i < n; i++) cum[i] = cum[i - 1] + Math.hypot(pts[2 * i] - pts[2 * i - 2], pts[2 * i + 1] - pts[2 * i - 1])
  const L = cum[n - 1]
  let sOuter = 0, sFI = 0, sSI = 0
  for (let i = 0; i < n; i++) {
    if (tags[i] === 2) sOuter = cum[i]
    if (tags[i] === 1) sFI = cum[i]
    if (tags[i] === 3) sSI = cum[i]
  }
  // panel edges: walking from the outer corner toward the front, the first x ≤ 0 (the crease on the
  // centre plane) — or the front-inner corner's mid point if the lobe has parted from its neighbour
  let sFront = sFI
  for (let i = n - 1; i > 0; i--) {
    if (cum[i] > sOuter) continue
    if (cum[i] < sFI) break
    if (pts[2 * i] <= 0) {
      const xa = pts[2 * i], xb = pts[2 * i + 2]
      const f = xb !== xa ? (0 - xa) / (xb - xa) : 0
      sFront = cum[i] + f * (cum[i + 1] - cum[i])
      break
    }
  }
  let sSide = sSI
  for (let i = 0; i < n - 1; i++) {
    if (cum[i] < sOuter) continue
    if (cum[i] > sSI) break
    if (pts[2 * i + 1] <= 0) {
      const za = pts[2 * i - 1], zb = pts[2 * i + 1]
      const f = zb !== za ? (0 - za) / (zb - za) : 1
      sSide = cum[i - 1] + f * (cum[i] - cum[i - 1])
      break
    }
  }
  return { pts, cum, L, n, sOuter, sFront, sSide }
}

/** point at arc length s on a section (wraps) → [x, z, tx, tz] */
function sectionAt(S, s) {
  const { pts, cum, L, n } = S
  s = ((s % L) + L) % L
  let lo = 0, hi = n - 1
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= s) lo = m; else hi = m }
  const f = cum[hi] > cum[lo] ? (s - cum[lo]) / (cum[hi] - cum[lo]) : 0
  const ax = pts[2 * lo], az = pts[2 * lo + 1], bx = pts[2 * hi], bz = pts[2 * hi + 1]
  return [ax + (bx - ax) * f, az + (bz - az) * f]
}

/** smooth unit tangent at arc length s (central difference over ±h mm, so faceted arcs shade round) */
function tangentAt(S, s, h = 1.2) {
  const a = sectionAt(S, s - h), b = sectionAt(S, s + h)
  const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
  return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
}

/**
 * Developed panel size for a lobe's outer décor: { front, side, width, split } (mm) measured at height y
 * (the front crease → outer corner, outer corner → side crease arc lengths). Author the panel this wide.
 */
export function lobePanelSize(section, y) {
  const S = lobeSection(section(y))
  const front = S.sOuter - S.sFront, side = S.sSide - S.sOuter
  return { front, side, width: front + side, split: front }
}

/**
 * One lobe (the +X +Z one), a closed sock from y0 (foot, capped) to y1 (open top).
 * @param {object} o
 * @param {(y:number) => object} o.section  section spec at height y (see lobeSection)
 * @param {number} [o.y0=0] @param {number} o.y1
 * @param {number[]} [o.rows]   explicit sorted heights (mm) for the vertex rows (default: every `step` mm)
 * @param {number} [o.step=4]   row spacing where `rows` is not given
 * @param {number} [o.columns=160]  vertices round the section (more are put on the décor arc)
 * @param {object} [o.relief]   { map: ReliefMap, y0, y1 (panel's world y range), width (panel mm), split (panel x of the
 *                               outer corner; default width/2), fade (mm, 1.5), material? }
 * @param {THREE.Material} [o.material]  plain material (and for the foot sole)
 * @param {string} [o.part='body']
 * @returns {THREE.Group} children: 'lobe' (the sock, relief material if any), 'sole'
 */
export function lobe(o) {
  const { section, y0 = 0, y1, step = 4, columns = 160, relief = null, part = 'body' } = o
  const material = o.material || new PatinaMaterial()
  const rows = o.rows || Array.from({ length: Math.max(2, Math.ceil((y1 - y0) / step)) + 1 }, (_, i, a) => y0 + ((y1 - y0) * i) / (a.length - 1))
  const vS = rows.map((y) => (y - y0) / (y1 - y0))
  const cache = new Map()
  const sec = (y) => {
    const k = Math.round(y * 1e4)
    let S = cache.get(k)
    if (!S) { S = lobeSection(section(y)); cache.set(k, S); if (cache.size > 4096) cache.clear() }
    return S
  }
  // u samples: dense on the décor arc (crease → corner → crease at the décor's mid height), sparse elsewhere
  const yMid = relief ? (relief.y0 + relief.y1) / 2 : (y0 + y1) / 2
  const Sm = sec(yMid)
  const ua = Sm.sFront / Sm.L, ub = Sm.sSide / Sm.L
  const nDec = Math.round(columns * 0.72), nRest = Math.max(12, columns - nDec)
  const uS = []
  const restA = Math.max(4, Math.round(nRest * (ua / (1 - (ub - ua)))))
  for (let i = 0; i < restA; i++) uS.push((ua * i) / restA)
  for (let i = 0; i < nDec; i++) uS.push(ua + ((ub - ua) * i) / nDec)
  const restB = Math.max(4, nRest - restA)
  for (let i = 0; i <= restB; i++) uS.push(ub + ((1 - ub) * i) / restB)

  const dy = 0.6
  const surface = (u, v, out) => {
    const y = y0 + (y1 - y0) * v
    const S = sec(y)
    const p = sectionAt(S, u * S.L)
    out.pos.set(p[0], y, p[1])
    // normal: tangent round the section × slope up the loft
    const ya = Math.max(y0, y - dy), yb = Math.min(y1, y + dy)
    const A = sec(ya), B = sec(yb)
    const pa = sectionAt(A, u * A.L), pb = sectionAt(B, u * B.L)
    const tv = [pb[0] - pa[0], yb - ya, pb[1] - pa[1]]
    const tg = tangentAt(S, u * S.L)
    const tu = [tg[0], 0, tg[1]]
    // n = tu × tv
    const nx = tu[1] * tv[2] - tu[2] * tv[1], ny = tu[2] * tv[0] - tu[0] * tv[2], nz = tu[0] * tv[1] - tu[1] * tv[0]
    const l = Math.hypot(nx, ny, nz) || 1
    out.nrm.set(nx / l, ny / l, nz / l)
  }
  let panelMap = null
  if (relief) {
    const W = relief.width, split = relief.split ?? W / 2
    const h = relief.y1 - relief.y0
    panelMap = (u, v, pm) => {
      const y = y0 + (y1 - y0) * v
      const S = sec(y)
      const s = u * S.L
      let px
      if (s <= S.sOuter) px = (split * (s - S.sFront)) / Math.max(1e-6, S.sOuter - S.sFront)
      else px = split + ((W - split) * (s - S.sOuter)) / Math.max(1e-6, S.sSide - S.sOuter)
      pm[0] = px / W
      pm[1] = (y - relief.y0) / h
      pm[2] = 1
    }
  }
  const geo = buildSurface({
    surface,
    samples: { u: uS, v: vS },
    relief: relief ? relief.map : null,
    panelMap,
    fade: relief?.fade ?? 1.5,
  })
  const mat = relief ? relief.material || new PatinaMaterial({ relief: relief.map }) : material
  const g = new THREE.Group()
  g.userData.part = part
  const mesh = new THREE.Mesh(geo, mat)
  mesh.name = 'lobe'
  mesh.userData.part = part
  mesh.castShadow = mesh.receiveShadow = true
  g.add(mesh)
  // foot sole: a fan over the bottom section
  const S0 = sec(y0)
  const ring = []
  const nS = 48
  for (let i = 0; i < nS; i++) { const p = sectionAt(S0, (i / nS) * S0.L); ring.push(p[0], p[1]) }
  let cx = 0, cz = 0
  for (let i = 0; i < nS; i++) { cx += ring[2 * i]; cz += ring[2 * i + 1] }
  cx /= nS; cz /= nS
  const P = [cx, y0, cz]
  for (let i = 0; i < nS; i++) P.push(ring[2 * i], y0, ring[2 * i + 1])
  const I = []
  for (let i = 0; i < nS; i++) I.push(0, 1 + ((i + 1) % nS), 1 + i)
  const sg = new THREE.BufferGeometry()
  sg.setAttribute('position', new THREE.Float32BufferAttribute(P, 3))
  sg.setAttribute('normal', new THREE.Float32BufferAttribute(P.map((_, i) => (i % 3 === 1 ? -1 : 0)), 3))
  sg.setAttribute('uv', new THREE.Float32BufferAttribute(new Array((nS + 1) * 2).fill(-1), 2))
  sg.setIndex(I)
  const sole = new THREE.Mesh(sg, material)
  sole.name = 'sole'
  sole.userData.part = part
  sole.receiveShadow = true
  g.add(sole)
  g.userData.lobe = { section: sec, at: (y, u) => { const S = sec(y); const p = sectionAt(S, u * S.L); return new THREE.Vector3(p[0], y, p[1]) } }
  return g
}

/**
 * N lobes round the Y axis: the +X +Z lobe as authored, then copies rotated by 360°/N (4: square plan,
 * the copies take the right-back, back-left and left-front corners). Same options as lobe(), plus
 * `count` (4) and `relief` may be an array (one per lobe, in that order) or one spec shared by all.
 * → Group (part `part`), children lobe groups with userData.lobe and userData.angle (deg).
 */
export function lobedBody(o) {
  const { count = 4, part = 'body' } = o
  const g = new THREE.Group()
  g.userData.part = part
  const reliefs = Array.isArray(o.relief) ? o.relief : new Array(count).fill(o.relief || null)
  for (let k = 0; k < count; k++) {
    const L = lobe({ ...o, relief: reliefs[k], part })
    const a = (k * 2 * Math.PI) / count // rotation.y: +X+Z → +X−Z → −X−Z → −X+Z
    L.rotation.y = a
    L.userData.angle = (a * 180) / Math.PI
    g.add(L)
  }
  return g
}
