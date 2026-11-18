// Rounded bands — the plump, organic vocabulary traced from the flattened
// photographs (research/04-motif-inventory.md).
//
// The older stroke kit (shapes.js, motifs/_strokes.js) draws a band as a
// constant-width brush with squared-round corners: its outer corner radius is
// tied to its inner one (R ± w/2) and every band reads as the same typographic
// bar. On the bronzes a horn, a brow or a body is a FAT, flat-topped plateau
// whose OUTER corners are round (≈ 0.4–0.6 × band width) while its INNER
// corners stay nearly square (≈ 0.1–0.2 × width); its width swells and
// tapers; it ends in a blunt rounded end, a point or a rolled spiral; and its
// top is drawn on — a thin sunk contour line inside the edge, then a chain of
// small round spirals, parallel lines, scales or leiwen, with the outer margin
// sometimes notched by short ticks.
//
//   roundStroke(ctrl, opts)  a band along a centre line through control points
//   roundPlate(opts)         a rounded-rectangle block (eye surrounds, horn
//                            curl blocks, nose bridges) — same element interface
//   carve(panel, elements, opts)   raise the union, then cut every element's
//                            top decoration in ONE sink (plus leiwen if asked)
//   pillowBoss(panel, opts)  the convex rounded-rectangle eye with a slit pupil
//
// Elements are pure geometry (panel mm, y up); nothing touches a panel until
// carve(). All of it is additive to the kit: nothing else imports this file.

import { fillet, resample, polyLength } from './shapes.js'
import { leiwenFillMask } from './leiwen.js'
import { Rng } from '../util/rng.js'

const D2R = Math.PI / 180
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

// ------------------------------------------------------------------ helpers

function perVertex(ctrl, v, def) {
  const n = ctrl.length
  if (v == null) return Array(n).fill(def)
  if (typeof v === 'number') return Array(n).fill(v)
  if (Array.isArray(v)) return ctrl.map((_, i) => v[Math.min(i, v.length - 1)] ?? def)
  if (typeof v === 'function') {
    const L = polyLength(ctrl) || 1
    let acc = 0
    return ctrl.map((p, i) => {
      if (i) acc += Math.hypot(p[0] - ctrl[i - 1][0], p[1] - ctrl[i - 1][1])
      return v(acc / L)
    })
  }
  return Array(n).fill(def)
}

function signedArea(pts) {
  let a = 0
  for (let i = 0; i < pts.length; i++) {
    const p = pts[i], q = pts[(i + 1) % pts.length]
    a += p[0] * q[1] - q[0] * p[1]
  }
  return a / 2
}

/** Distance from point to a closed (or open) polyline. */
export function distToPolyline(c, pts, closed = true) {
  let best = Infinity
  const n = pts.length
  const m = closed ? n : n - 1
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const l2 = dx * dx + dy * dy
    let t = l2 > 0 ? ((c[0] - a[0]) * dx + (c[1] - a[1]) * dy) / l2 : 0
    t = clamp(t, 0, 1)
    const d = Math.hypot(a[0] + dx * t - c[0], a[1] + dy * t - c[1])
    if (d < best) best = d
  }
  return best
}

/** Nearest point on a closed polyline: { d, p }. */
export function nearestOnPolyline(c, pts) {
  let best = Infinity, bp = pts[0]
  const n = pts.length
  for (let i = 0; i < n; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const l2 = dx * dx + dy * dy
    const t = l2 > 0 ? clamp(((c[0] - a[0]) * dx + (c[1] - a[1]) * dy) / l2, 0, 1) : 0
    const q = [a[0] + dx * t, a[1] + dy * t]
    const d = Math.hypot(q[0] - c[0], q[1] - c[1])
    if (d < best) { best = d; bp = q }
  }
  return { d: best, p: bp }
}

/** Even-odd point in polygon. */
export function insidePolygon(c, pts) {
  let inside = false
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j]
    if ((a[1] > c[1]) !== (b[1] > c[1]) && c[0] < ((b[0] - a[0]) * (c[1] - a[1])) / (b[1] - a[1] || 1e-12) + a[0]) inside = !inside
  }
  return inside
}

function pathPoly(ctx, pts, closed = true) {
  if (!pts || pts.length < 2) return
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
}

/** Smooth seeded wobble along a polyline (hand-cut irregularity). */
function wob(pts, rng, amp, closed = false) {
  if (!(amp > 0) || !rng || pts.length < 3) return pts
  const p1 = rng.range(0, 6.283), p2 = rng.range(0, 6.283)
  const k1 = 6.283 / rng.range(9, 16), k2 = 6.283 / rng.range(3.5, 6)
  const n = pts.length
  let acc = 0
  return pts.map((p, i) => {
    if (i) acc += Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1])
    const a = pts[closed ? (i - 1 + n) % n : Math.max(0, i - 1)], b = pts[closed ? (i + 1) % n : Math.min(n - 1, i + 1)]
    let dx = b[0] - a[0], dy = b[1] - a[1]
    const l = Math.hypot(dx, dy) || 1
    const d = amp * (0.7 * Math.sin(acc * k1 + p1) + 0.3 * Math.sin(acc * k2 + p2))
    return [p[0] - (dy / l) * d, p[1] + (dx / l) * d]
  })
}

// ------------------------------------------------------------------ spine → outline

/**
 * Offset a spine (sharp-cornered polyline) by per-vertex left / right half
 * widths with mitred joins. Returns { L, R, turn } (turn > 0 = a left turn).
 */
function offsets(sp, hl, hr) {
  const n = sp.length
  const d = []
  for (let i = 0; i < n - 1; i++) {
    const dx = sp[i + 1][0] - sp[i][0], dy = sp[i + 1][1] - sp[i][1]
    const l = Math.hypot(dx, dy) || 1e-9
    d.push([dx / l, dy / l])
  }
  const L = [], R = [], turn = [], M = []
  for (let i = 0; i < n; i++) {
    const a = d[Math.max(0, i - 1)], b = d[Math.min(n - 2, i)]
    const n0 = [-a[1], a[0]], n1 = [-b[1], b[0]]
    let mx = n0[0] + n1[0], my = n0[1] + n1[1]
    let ml = Math.hypot(mx, my)
    if (ml < 1e-6) { mx = n0[0]; my = n0[1]; ml = 1 }
    mx /= ml; my /= ml
    const s = 1 / Math.max(0.3, mx * n0[0] + my * n0[1])
    M.push([mx * s, my * s])
    L.push([sp[i][0] + mx * hl[i] * s, sp[i][1] + my * hl[i] * s])
    R.push([sp[i][0] - mx * hr[i] * s, sp[i][1] - my * hr[i] * s])
    turn.push(i > 0 && i < n - 1 ? a[0] * b[1] - a[1] * b[0] : 0)
  }
  return { L, R, turn, M, d }
}

// ------------------------------------------------------------------ spiral end

function spiralTail(P, dir, w, s) {
  const gap = s.gap ?? Math.max(0.5, w * 0.16)
  const turns = s.turns ?? 1.25
  const hand = s.dir ?? 1 // +1 rolls to the left of travel, -1 to the right
  const taper = s.taper ?? 1
  const pitch = (w * (1 + taper) / 2) + gap
  const R0 = s.R ?? turns * pitch + 0.42 * w
  const n = [-dir[1] * hand, dir[0] * hand]
  const c = [P[0] + n[0] * R0, P[1] + n[1] * R0]
  const v0 = [-n[0], -n[1]]
  const pts = [], ws = []
  const rMin = Math.max(0.55 * w * taper, 0.3)
  const phiMax = Math.min(turns * 2 * Math.PI, (2 * Math.PI * (R0 - rMin)) / pitch)
  let phi = 0
  while (phi < phiMax) {
    const step = 0.3 / Math.max(0.5, R0 - (pitch * phi) / (2 * Math.PI))
    phi = Math.min(phiMax, phi + step)
    const r = R0 - (pitch * phi) / (2 * Math.PI)
    const a = hand * phi
    const cs = Math.cos(a), sn = Math.sin(a)
    pts.push([c[0] + r * (v0[0] * cs - v0[1] * sn), c[1] + r * (v0[0] * sn + v0[1] * cs)])
    ws.push(w * (1 + (taper - 1) * (phi / phiMax)))
  }
  return { pts, ws, centre: c }
}

// ------------------------------------------------------------------ elements

/**
 * A fat round-cornered band along a centre line.
 * @param ctrl  control points [[x, y], …] (panel mm) — the band's centre line, corners sharp
 * @param o {
 *   width: mm | [mm per control point] | t → mm      (swell / taper; default 3)
 *   round: 0..1 | [per vertex]   OUTER corner radius as a fraction of the local width (0.5 default)
 *   inner: 0..1 | [per vertex]   INNER corner radius as a fraction of the width (default 0.15)
 *   start, end: 'round' | 'blunt' | 'flat' | 'point' | 'spiral'      (default 'blunt')
 *   capRound: 0..0.5  blunt-end corner radius × width (0.3)
 *   spiral / startSpiral: { turns 1.25, gap mm (0.16 w), dir ±1 (+1 rolls left), taper (end width ×), R }
 *   contour, fill, ticks  — per-element decoration (see carve), override carve's defaults
 * }
 */
export function roundStroke(ctrl, o = {}) {
  ctrl = ctrl.map((p) => [p[0], p[1]])
  let ws = perVertex(ctrl, o.width, 3)
  let ro = perVertex(ctrl, o.round, 0.5)
  let ri = perVertex(ctrl, o.inner, 0.15)
  let dense = ctrl.map(() => false)
  const start = o.start ?? 'blunt', end = o.end ?? 'blunt'
  let sp = ctrl
  let centres = []
  const dirAt = (pts, atStart) => {
    const [a, b] = atStart ? [pts[1], pts[0]] : [pts[pts.length - 2], pts[pts.length - 1]]
    const l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1
    return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]
  }
  let spiralFrom = { a: 0, b: ctrl.length } // the body (not coil) vertex range
  if (end === 'spiral') {
    const t = spiralTail(sp[sp.length - 1], dirAt(sp, false), ws[ws.length - 1], o.spiral || {})
    sp = sp.concat(t.pts); ws = ws.concat(t.ws); ro = ro.concat(t.pts.map(() => 0)); ri = ri.concat(t.pts.map(() => 0))
    dense = dense.concat(t.pts.map(() => true))
    centres.push(t.centre)
  }
  if (start === 'spiral') {
    const s = o.startSpiral || o.spiral || {}
    const t = spiralTail(sp[0], dirAt(sp, true), ws[0], { ...s, dir: -(s.dir ?? 1) })
    const k = t.pts.length
    sp = t.pts.slice().reverse().concat(sp); ws = t.ws.slice().reverse().concat(ws)
    ro = Array(k).fill(0).concat(ro); ri = Array(k).fill(0).concat(ri); dense = Array(k).fill(true).concat(dense)
    spiralFrom = { a: k, b: spiralFrom.b + k }
    centres.push(t.centre)
  }
  if (end === 'point') ws[ws.length - 1] = Math.min(ws[ws.length - 1], 0.08)
  if (start === 'point') ws[0] = Math.min(ws[0], 0.08)
  const el = {
    kind: 'stroke', ctrl, spine: sp, widths: ws, dense, coil: centres, body: spiralFrom,
    start, end, opts: o,
    roundOut: ro, roundIn: ri,
    capRound: o.capRound ?? 0.3,
  }
  el.outline = strokeOutline(el, 0, 0)
  return el
}

/** The outline of a stroke inset by iL / iR mm (0, 0 = the band itself). */
function strokeOutline(el, iL, iR, capIn = 0) {
  let sp = el.spine
  const n = sp.length
  const aL = spineArr(el, iL), aR = spineArr(el, iR)
  const hl = el.widths.map((w, i) => Math.max(0.02, w / 2 - aL[i]))
  const hr = el.widths.map((w, i) => Math.max(0.02, w / 2 - aR[i]))
  const insA = aL.map((v, i) => (v + aR[i]) / 2)
  const rOut = el.widths.map((w, i) => Math.max(0, el.roundOut[i] * w - insA[i]))
  const rIn = el.widths.map((w, i) => Math.max(0, el.roundIn[i] * w + insA[i]))
  const ins = (insA[0] + insA[n - 1]) / 2
  const capR = [el.start, el.end].map((c, k) => (c === 'flat' ? 0 : Math.max(0, el.capRound * el.widths[k ? n - 1 : 0] - ins * 0.5)))
  if (capIn > 0) {
    sp = sp.map((p) => p.slice())
    for (const [atStart, cap] of [[true, el.start], [false, el.end]]) {
      if (cap !== 'blunt' && cap !== 'flat') continue
      const i = atStart ? 0 : n - 1, j = atStart ? 1 : n - 2
      const dx = sp[i][0] - sp[j][0], dy = sp[i][1] - sp[j][1]
      const l = Math.hypot(dx, dy)
      const m = Math.min(capIn, l * 0.45)
      sp[i] = [sp[i][0] - (dx / l) * m, sp[i][1] - (dy / l) * m]
    }
  }
  return bandOutline(sp, hl, hr, rOut, rIn, [el.start, el.end], capR, el.dense)
}

/** A per-control-vertex value (number | array) spread over the spine (coil points take the nearest end's). */
function spineArr(el, v) {
  const n = el.spine.length
  if (!Array.isArray(v)) return Array(n).fill(v)
  const m = el.ctrl.length, a = el.body.a
  return Array.from({ length: n }, (_, i) => v[Math.max(0, Math.min(m - 1, i - a))] ?? v[v.length - 1])
}

const meanOf = (v) => (Array.isArray(v) ? v.reduce((a, b) => a + b, 0) / v.length : v)

/**
 * Closed outline of a band: left side forward, end cap, right side back, start
 * cap; outer corners filleted rOut, inner corners rIn (per vertex, mm), blunt
 * cap corners capR. Returned counter-clockwise (y up).
 */
function bandOutline(sp, hl, hr, rOut, rIn, caps, capR, dense) {
  const n = sp.length
  const { L, R, turn, d } = offsets(sp, hl, hr)
  const T = 0.02
  const pts = [], rad = []
  for (let i = 0; i < n; i++) {
    pts.push(L[i])
    rad.push(dense[i] ? 0 : turn[i] > T ? rIn[i] : turn[i] < -T ? rOut[i] : 0)
  }
  const roundCap = (P, dir, hA, hB) => {
    const w = hA + hB
    const nrm = [-dir[1], dir[0]]
    const c = [P[0] + (nrm[0] * (hA - hB)) / 2, P[1] + (nrm[1] * (hA - hB)) / 2]
    const h = Math.atan2(dir[1], dir[0])
    const k = Math.max(4, Math.ceil((Math.PI * w) / 2 / 0.25))
    for (let j = 1; j < k; j++) {
      const a = h + Math.PI / 2 - (Math.PI * j) / k
      pts.push([c[0] + (Math.cos(a) * w) / 2, c[1] + (Math.sin(a) * w) / 2])
      rad.push(0)
    }
  }
  if (caps[1] === 'round' || caps[1] === 'spiral') roundCap(sp[n - 1], d[n - 2], hl[n - 1], hr[n - 1])
  else if (caps[1] !== 'point') rad[rad.length - 1] = capR[1]
  for (let i = n - 1; i >= 0; i--) {
    pts.push(R[i])
    rad.push(dense[i] ? 0 : turn[i] < -T ? rIn[i] : turn[i] > T ? rOut[i] : 0)
    if (i === n - 1 && caps[1] !== 'round' && caps[1] !== 'spiral' && caps[1] !== 'point') rad[rad.length - 1] = capR[1]
  }
  if (caps[0] === 'round' || caps[0] === 'spiral') roundCap(sp[0], [-d[0][0], -d[0][1]], hr[0], hl[0])
  else if (caps[0] !== 'point') { rad[rad.length - 1] = capR[0]; rad[0] = capR[0] }
  let poly = pts, r = rad
  if (signedArea(poly) < 0) { poly = poly.slice().reverse(); r = r.slice().reverse() }
  return fillet(poly, r, { closed: true, step: 0.2 })
}

/**
 * A rounded-rectangle block (eye surround, horn-curl block, nose bridge).
 * @param o { c: [x, y], w, h (mm), r: corner radius mm (or round: fraction of min(w, h)),
 *            rot (deg), contour, fill, ticks }
 */
export function roundPlate(o = {}) {
  const { c = [0, 0], w = 10, h = 8, rot = 0 } = o
  const r = o.r ?? (o.round ?? 0.3) * Math.min(w, h)
  const el = { kind: 'plate', c, w, h, r, rot, opts: o }
  el.outline = plateOutline(el, 0)
  return el
}

function plateOutline(el, inset) {
  const w = el.w - 2 * inset, h = el.h - 2 * inset
  const r = clamp(el.r - inset, 0, Math.min(w, h) / 2)
  const cs = Math.cos(el.rot * D2R), sn = Math.sin(el.rot * D2R)
  const quad = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]]
  const pts = fillet(quad, r, { closed: true, step: 0.2 })
  return pts.map(([x, y]) => [el.c[0] + x * cs - y * sn, el.c[1] + x * sn + y * cs])
}

/** Any closed outline (panel mm) as an element: a traced free shape. */
export function roundPoly(pts, o = {}) {
  const P = pts.map((p) => [p[0], p[1]])
  const ro = perVertex(P, o.round, 0)
  const outline0 = signedArea(P) < 0 ? P.slice().reverse() : P
  const el = { kind: 'poly', pts: outline0, opts: o }
  el.radii = signedArea(P) < 0 ? ro.slice().reverse() : ro
  el.outline = fillet(outline0, el.radii, { closed: true, step: 0.2 })
  return el
}

/** An element's outline inset by i mm (asymmetric [left, right] for strokes). */
export function elementContour(el, inset) {
  const [iL, iR] = Array.isArray(inset) ? inset : [inset, inset]
  if (el.kind === 'stroke') return strokeOutline(el, iL, iR, (meanOf(iL) + meanOf(iR)) / 2)
  if (el.kind === 'plate') return plateOutline(el, (meanOf(iL) + meanOf(iR)) / 2)
  // poly: a uniform inward offset (mitred), then the same fillets
  const i = (meanOf(iL) + meanOf(iR)) / 2
  const n = el.pts.length
  const out = []
  for (let k = 0; k < n; k++) {
    const a = el.pts[(k - 1 + n) % n], v = el.pts[k], b = el.pts[(k + 1) % n]
    const d0 = norm([v[0] - a[0], v[1] - a[1]]), d1 = norm([b[0] - v[0], b[1] - v[1]])
    const n0 = [-d0[1], d0[0]], n1 = [-d1[1], d1[0]] // CCW polygon: left normal points inside
    let m = norm([n0[0] + n1[0], n0[1] + n1[1]])
    const s = 1 / Math.max(0.3, m[0] * n0[0] + m[1] * n0[1])
    out.push([v[0] + m[0] * i * s, v[1] + m[1] * i * s])
  }
  return fillet(out, el.radii.map((r) => Math.max(0, r - i)), { closed: true, step: 0.2 })
}

const norm = (v) => { const l = Math.hypot(v[0], v[1]) || 1; return [v[0] / l, v[1] / l] }

/** Paint the union of elements (fill), optionally grown by `grow` mm. */
export function paintElements(elements, grow = 0) {
  return (ctx) => {
    for (const el of elements) {
      ctx.beginPath()
      pathPoly(ctx, el.outline, true)
      ctx.fill()
      if (grow > 0) { ctx.lineWidth = grow * 2; ctx.lineJoin = 'round'; ctx.stroke() }
    }
  }
}

// ------------------------------------------------------------------ decoration

const DEFAULT_CONTOUR = { inset: 1.0, line: 0.42 }

/**
 * Raise the union of `elements` as one flat-topped plateau, then cut each
 * element's top decoration in ONE sink (and pack leiwen where asked).
 *
 * @param o {
 *   height: mm (1.2)   shoulder: mm (height × 0.35, 0.2–0.6)   depth: groove mm (0.35)
 *   contour: { inset: mm | [left, right], line: mm } | false        thin sunk line inside the edge
 *   fill: { kind: 'spirals' | 'lines' | 'scales' | 'leiwen' | 'coil' | 'none',
 *           pitch (spiral / line / scale spacing mm), line (groove mm), gap (land mm),
 *           size (max spiral Ø mm), min (min spiral Ø), tail (spiral opens into the contour), turns }
 *   ticks: { pitch mm, side: 'left' | 'right' | 'both' | 'outer', line mm, length (mm, default to the contour) } | null
 *   irregularity: 0..2 (hand wobble, ±0.05 mm per unit)   seed
 *   raise: true (false = decorate only: tops already raised by another call)
 * }
 * Every element may carry its own { contour, fill, ticks } in its options; they override o.
 * @returns { spirals, grooves, ms }
 */
export function carve(panel, elements, o = {}) {
  const t0 = typeof performance !== 'undefined' ? performance.now() : 0
  const els = Array.isArray(elements) ? elements : [elements]
  const height = o.height ?? 1.2
  const depth = o.depth ?? 0.35
  const rng = new Rng(`carve:${o.seed ?? 0}:${els.length}:${els[0]?.outline?.[0]?.map((v) => v.toFixed(2)).join(',')}`)
  const amp = 0.05 * (o.irregularity ?? 1)
  if (o.raise !== false) {
    const shoulder = o.shoulder ?? clamp(height * 0.35, 0.2, 0.6)
    panel.raise(paintElements(els), { height, shoulder, profile: 'plateau' })
  }
  const grooves = [] // { pts, w, closed, clip? }
  const leiwen = []
  const spirals = []
  for (const el of els) {
    const eo = el.opts || {}
    const contour = eo.contour !== undefined ? eo.contour : o.contour !== undefined ? o.contour : DEFAULT_CONTOUR
    const fill = eo.fill !== undefined ? eo.fill : o.fill ?? null
    const ticks = eo.ticks !== undefined ? eo.ticks : o.ticks ?? null
    const cl = contour ? contour.line ?? DEFAULT_CONTOUR.line : 0
    const inset = contour ? contour.inset ?? DEFAULT_CONTOUR.inset : 0.6
    const [iL, iR] = Array.isArray(inset) ? inset : [inset, inset]
    const C = elementContour(el, [iL, iR])
    const sL = meanOf(iL), sR = meanOf(iR)
    if (contour) grooves.push({ pts: wob(C, rng, amp, true), w: cl, closed: true })
    if (ticks) tickGrooves(el, C, [iL, iR], ticks, cl, grooves)
    if (!fill || fill.kind === 'none') continue
    const fl = fill.line ?? cl ?? 0.4
    const gap = fill.gap ?? Math.max(0.35, fl * 0.9)
    if (fill.kind === 'leiwen') {
      leiwen.push({ C, fill })
    } else if (fill.kind === 'spirals') {
      spirals.push(...spiralChain(el, C, { ...fill, _insets: [iL, iR] }, fl, contour ? cl : 0, gap, rng, amp, grooves))
    } else if (fill.kind === 'lines') {
      lineFill(el, [sL, sR], fill, fl, gap, contour ? cl : 0, grooves, rng, amp)
    } else if (fill.kind === 'scales') {
      scaleFill(el, C, fill, fl, grooves)
    } else if (fill.kind === 'coil') {
      coilFill(el, [sL, sR], fill, fl, contour ? cl : 0, gap, grooves, rng, amp)
    }
  }
  if (grooves.length) {
    let maxW = 0
    for (const g of grooves) maxW = Math.max(maxW, g.w)
    panel.sink((ctx) => {
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // one clip per run of grooves sharing a clip polygon (ticks, scales, joints)
      let open = null
      for (const g of grooves) {
        if (g.clip !== open) {
          if (open) ctx.restore()
          open = g.clip || null
          if (open) { ctx.save(); ctx.beginPath(); pathPoly(ctx, open, true); ctx.clip() }
        }
        ctx.lineWidth = g.w
        ctx.beginPath()
        pathPoly(ctx, g.pts, !!g.closed)
        ctx.stroke()
      }
      if (open) ctx.restore()
    }, { depth, shoulder: maxW * 0.45, profile: 'u' })
  }
  for (const { C, fill } of leiwen) {
    leiwenFillMask(panel, (ctx) => { ctx.beginPath(); pathPoly(ctx, C, true); ctx.fill() }, {
      pitch: fill.pitch ?? 1, line: fill.lineFrac ?? 0.45, depth: fill.depth ?? depth, roundness: fill.roundness ?? 0.15,
      echo: 0, eyes: 0, seed: o.seed ?? 0, ...(fill.leiwen || {}),
    }, { margin: fill.margin ?? 0.35, level: height })
  }
  return { spirals, grooves: grooves.length, ms: Math.round((typeof performance !== 'undefined' ? performance.now() : 0) - t0) }
}

// guide points: where spiral centres may sit (a strip across the band, or a grid)
function guidePoints(el, C) {
  if (el.kind === 'stroke') {
    const wmax = Math.max(...el.widths)
    const body = resample(el.spine.slice(el.body.a, Math.max(el.body.a + 2, el.body.b)), Math.max(0.3, wmax / 24))
    const { M } = offsets(body, body.map(() => 0), body.map(() => 0))
    const out = []
    for (let o = -wmax / 2; o <= wmax / 2; o += Math.max(0.3, wmax / 24)) for (let i = 0; i < body.length; i++) out.push([body[i][0] + M[i][0] * o, body[i][1] + M[i][1] * o])
    return out
  }
  // plates / polys: a grid over the contour's bbox
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
  for (const [x, y] of C) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y) }
  const out = []
  const st = Math.max(0.3, Math.min(x1 - x0, y1 - y0) / 30)
  for (let y = y0; y <= y1; y += st) for (let x = x0; x <= x1; x += st) out.push([x, y])
  return out
}

/**
 * Pack round spirals inside the contour. Strokes: a CHAIN first — evenly spread
 * along the band's centre line, each as large as the band allows, nearly
 * touching (the Met fangyi horn) — then largest-first into whatever room is left
 * (corners, swells). Plates / polys: largest-first only.
 */
function spiralChain(el, C, f, fl, cl, gap, rng, amp, grooves) {
  const q = f.pitch ?? fl * 2.3 // spiral line spacing
  const rMaxCap = (f.size ?? Infinity) / 2
  const rMin = (f.min ?? Math.max(2.2 * q, 1.4)) / 2
  // distance tests run against a decimated contour (≈ 1/50 of the band width per vertex): planning stays ~linear on big bands
  const wref = el.kind === 'stroke' ? Math.max(...el.widths) : Math.min(el.w ?? 10, el.h ?? 10)
  const Cd = resample(C.concat([C[0]]), Math.max(0.2, wref / 35))
  C = Cd
  const wallAt = (p) => (insidePolygon(p, C) ? distToPolyline(p, C) - cl / 2 - gap - fl / 2 : -1)
  const placed = []
  if (el.kind === 'stroke' && f.chain !== false) {
    const [iL, iR] = f._insets || [0, 0]
    const body = resample(el.spine.slice(el.body.a, Math.max(el.body.a + 2, el.body.b)), 0.25)
    const { M } = offsets(body, body.map(() => 0), body.map(() => 0))
    const bL = spineArr(el, iL).slice(el.body.a, el.body.b), bR = spineArr(el, iR).slice(el.body.a, el.body.b)
    const bias = resampleWidths(el.spine.slice(el.body.a, el.body.b), bR.map((r, i) => (r - bL[i]) / 2), body)
    const G = body.map((p, i) => [p[0] + M[i][0] * bias[i], p[1] + M[i][1] * bias[i]])
    const W = G.map((p) => Math.min(wallAt(p), rMaxCap))
    const S = [0]
    for (let i = 1; i < G.length; i++) S.push(S[i - 1] + Math.hypot(G[i][0] - G[i - 1][0], G[i][1] - G[i - 1][1]))
    // usable span: where the band is wide enough
    let i0 = W.findIndex((w) => w >= rMin), i1 = W.length - 1 - [...W].reverse().findIndex((w) => w >= rMin)
    if (i0 >= 0 && i1 > i0) {
      // first pass: how many fit greedily from the start
      const greedy = []
      for (let i = i0; i <= i1; i++) {
        const r = W[i]
        if (r < rMin) continue
        const prev = greedy[greedy.length - 1]
        if (prev && S[i] - prev.s < prev.r + r + fl + gap) continue
        if (prev && Math.hypot(G[i][0] - prev.c[0], G[i][1] - prev.c[1]) < prev.r + r + fl + gap) continue
        if (!prev && S[i] - S[i0] < r - 0.5 * fl) continue
        greedy.push({ s: S[i], c: G[i], r })
      }
      // second pass: spread the same count evenly over the span, each as big as it may be
      const n = greedy.length
      if (n) {
        const a = greedy[0].s, b = greedy[n - 1].s
        const slack = Math.max(0, S[i1] - (b + greedy[n - 1].r)) // room left after the last
        const b2 = b + slack * 0.5 * (n > 1 ? 1 : 0)
        const at = (s) => { let i = 0; while (i < S.length - 1 && S[i] < s) i++; return i }
        const pos = greedy.map((g, k) => (n > 1 ? at(a + ((b2 - a) * k) / (n - 1)) : at(g.s)))
        for (let k = 0; k < n; k++) {
          const c = G[pos[k]]
          let r = Math.min(W[pos[k]], rMaxCap)
          for (const t of placed) r = Math.min(r, Math.hypot(t.c[0] - c[0], t.c[1] - c[1]) - t.r - fl - gap)
          if (k + 1 < n) r = Math.min(r, (Math.hypot(G[pos[k + 1]][0] - c[0], G[pos[k + 1]][1] - c[1]) - fl - gap) / 2)
          if (r >= rMin * 0.85) placed.push({ c, r, k })
        }
        // jointed body (kui of the Met fangyi friezes): a cross line between consecutive spirals
        if (f.joints) {
          const cs = placed.filter((t) => t.k !== undefined)
          for (let k = 0; k + 1 < cs.length; k++) {
            const m = Math.round((pos[cs[k].k] + pos[cs[k + 1].k]) / 2)
            const h = Math.max(...el.widths)
            grooves.push({ pts: [[G[m][0] + M[m][0] * h, G[m][1] + M[m][1] * h], [G[m][0] - M[m][0] * h, G[m][1] - M[m][1] * h]], w: f.jointLine ?? fl, clip: C })
          }
        }
      }
    }
  }
  // largest-first into the rest
  const cand = guidePoints(el, C).filter((p) => insidePolygon(p, C))
  const avail = cand.map((p) => {
    let r = Math.min(distToPolyline(p, C) - cl / 2 - gap - fl / 2, rMaxCap)
    for (const t of placed) r = Math.min(r, Math.hypot(t.c[0] - p[0], t.c[1] - p[1]) - t.r - fl - gap)
    return r
  })
  for (;;) {
    let bi = -1, br = rMin
    for (let i = 0; i < cand.length; i++) if (avail[i] >= br) { br = avail[i]; bi = i }
    if (bi < 0) break
    const c = cand[bi], r = Math.min(br, rMaxCap)
    placed.push({ c, r })
    for (let i = 0; i < cand.length; i++) {
      const d = Math.hypot(cand[i][0] - c[0], cand[i][1] - c[1]) - r - fl - gap
      if (d < avail[i]) avail[i] = d
    }
  }
  let hand = f.hand === 'left' ? 1 : -1
  const sq = clamp(f.square ?? 0, 0, 1), ex = 2 + sq * 3 // superellipse: 0 round … 1 squarish (rounded square)
  for (const s of placed) {
    // the opening faces the nearest contour point: the spiral hangs off the contour line
    const { d: best, p: np } = nearestOnPolyline(s.c, C)
    const a0 = Math.atan2(np[1] - s.c[1], np[0] - s.c[0])
    const rIn = Math.max(fl * 0.55, q * 0.35)
    const turns = Math.max(0.75, (s.r - rIn) / q)
    const phiMax = turns * 2 * Math.PI
    const pts = []
    // 'merge' (default): the outer turn leaves the contour line tangentially and winds in;
    // 'radial': a straight stalk to the contour; false: a free spiral
    const tail = f.tail ?? 'merge'
    const rOut = tail === 'merge' && cl > 0 ? best - cl * 0.15 : s.r
    const lead = Math.PI * (f.lead ?? 0.4) // the first part of a turn closes from the contour onto the spiral
    if (tail === 'radial' && cl > 0) pts.push([s.c[0] + Math.cos(a0) * (best - cl * 0.2), s.c[1] + Math.sin(a0) * (best - cl * 0.2)])
    for (let phi = 0; phi <= phiMax + 1e-6;) {
      let r = s.r - ((s.r - rIn) * phi) / phiMax
      if (phi < lead) { const t = phi / lead; r += (rOut - s.r) * (1 - t) * (1 - t) }
      const a = a0 + hand * phi
      const ca = Math.cos(a), sa = Math.sin(a)
      const k = sq > 0 ? 1 / Math.pow(Math.pow(Math.abs(ca), ex) + Math.pow(Math.abs(sa), ex), 1 / ex) : 1
      pts.push([s.c[0] + ca * r * k, s.c[1] + sa * r * k])
      phi += Math.min(0.3, Math.max(0.22, q * 0.25) / Math.max(0.3, r))
    }
    grooves.push({ pts: wob(pts, rng, amp * 0.5), w: fl })
    if (f.hand !== 'left' && f.hand !== 'right') hand = -hand
  }
  return placed
}

/** Lines parallel to a stroke's centre line (bodies, the rings of a rolled end); plates get rings. */
function lineFill(el, [iL, iR], f, fl, gap, cl, grooves, rng, amp) {
  const p = f.pitch ?? fl * 2.4
  if (el.kind !== 'stroke') return coilFill(el, [iL, iR], { ...f, closed: true }, fl, cl, gap, grooves, rng, amp)
  const wmin = Math.min(...el.widths)
  const room = (wmin - iL - iR) / 2 - cl / 2 - gap - fl / 2
  if (room < 0) return
  const n = Math.max(0, Math.floor(room / p + 1e-6))
  const bias = (iR - iL) / 2
  const offs = []
  for (let k = -n; k <= n; k++) offs.push(bias + k * p * (f.count === 'odd' || n % 1 === 0 ? 1 : 1))
  const sp = el.spine
  const { M } = offsets(sp, sp.map(() => 0), sp.map(() => 0))
  const trimL = (iL + iR) / 2 + cl + gap
  for (const o of offs) {
    let pts = sp.map((q, i) => [q[0] + M[i][0] * o, q[1] + M[i][1] * o])
    pts = fillet(pts, pts.map((_, i) => (el.dense[i] ? 0 : Math.max(0.2, el.widths[i] * 0.45 - Math.abs(o)))), { step: 0.2 })
    const L = polyLength(pts)
    const a = el.start === 'spiral' ? 0 : trimL, b = el.end === 'spiral' ? 0 : trimL
    if (L - a - b < p) continue
    grooves.push({ pts: wob(subPathLen(pts, a, L - b), rng, amp * 0.6), w: fl })
  }
}

function subPathLen(pts, l0, l1) {
  const out = []
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1], b = pts[i]
    const d = Math.hypot(b[0] - a[0], b[1] - a[1])
    const s0 = acc, s1 = acc + d
    if (s1 >= l0 && s0 <= l1 && d > 0) {
      const t0 = Math.max(0, (l0 - s0) / d), t1 = Math.min(1, (l1 - s0) / d)
      if (!out.length) out.push([a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0])
      out.push([a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1])
    }
    acc = s1
  }
  return out
}

/**
 * Concentric squared-round spiral following a plate's outline (the rolled
 * horn block of the Met fangyi); strokes fall back to parallel lines.
 */
function coilFill(el, [iL, iR], f, fl, cl, gap, grooves, rng, amp) {
  if (el.kind === 'stroke') return lineFill(el, [iL, iR], { ...f, kind: 'lines' }, fl, gap, cl, grooves, rng, amp)
  if (el.kind !== 'plate') return
  const p = f.pitch ?? fl * 2.4
  const i0 = (iL + iR) / 2 + (cl ? cl / 2 + gap + fl / 2 : 0)
  let a = el.w / 2 - i0, b = el.h / 2 - i0
  const r0 = Math.max(0, el.r - i0)
  const hand = f.hand === 'right' ? -1 : 1
  const v = [], rad = []
  let k = 0
  // ring k: (±a_k, ±b_k); spiral steps in by p each ring, closing one pitch short
  const push = (x, y, r) => { v.push([x, y * hand]); rad.push(r) }
  const off = f.offset ?? [0, 0]
  while (a > p * 0.55 && b > p * 0.55 && k < 60) {
    const r = Math.max(p * 0.3, Math.min(r0 - k * p, a, b))
    if (k === 0) push(-a, -b + (f.closed ? 0 : p), r)
    push(a, -b, r)
    push(a, b, r)
    push(-a, b, r)
    const a1 = a - p, b1 = b - p
    push(-a, -b1 + (f.closed ? 0 : 0), Math.max(p * 0.3, Math.min(r0 - (k + 0.5) * p, a1, b1)))
    a = a1; b = b1; k++
    if (f.rings && k >= f.rings) break
  }
  if (v.length < 3) return
  // finish at the centre
  const last = v[v.length - 1]
  v.push([last[0] + Math.max(0, a) * 2 * 0.6, last[1]])
  rad.push(0)
  rad[0] = 0
  const filleted = fillet(v, rad, { step: 0.2 })
  const cs = Math.cos(el.rot * D2R), sn = Math.sin(el.rot * D2R)
  const pts = filleted.map(([x, y]) => [el.c[0] + off[0] + x * cs - y * sn, el.c[1] + off[1] + x * sn + y * cs])
  grooves.push({ pts: wob(pts, rng, amp * 0.6), w: fl })
}

/** Short cross ticks in the margin between the edge and the contour line. */
function tickGrooves(el, C, [iL, iR], t, cl, grooves) {
  if (el.kind !== 'stroke') {
    // plates / polys: radial ticks around the whole margin
    const pts = resample(el.outline.concat([el.outline[0]]), t.pitch ?? 2.2)
    const ins = (meanOf(iL) + meanOf(iR)) / 2
    for (const q of pts) {
      let best = Infinity, np = null
      for (const c of C) { const d = Math.hypot(c[0] - q[0], c[1] - q[1]); if (d < best) { best = d; np = c } }
      const len = t.length ?? ins
      const dx = (np[0] - q[0]) / (best || 1), dy = (np[1] - q[1]) / (best || 1)
      grooves.push({ pts: [[q[0] - dx * 0.4, q[1] - dy * 0.4], [q[0] + dx * len, q[1] + dy * len]], w: t.line ?? cl * 0.9, clip: el.outline })
    }
    return
  }
  const body = el.spine.slice(el.body.a, el.body.b)
  if (body.length < 2) return
  const sides = t.side === 'both' ? [1, -1] : t.side === 'right' ? [-1] : t.side === 'outer' ? [outerSide(body)] : [1]
  const pitch = t.pitch ?? 2.2
  const P = resample(body, pitch)
  const { M } = offsets(P, P.map(() => 0), P.map(() => 0))
  const wAt = resampleWidths(body, el.widths.slice(el.body.a, el.body.b), P)
  const tL = resampleWidths(body, spineArr(el, iL).slice(el.body.a, el.body.b), P)
  const tR = resampleWidths(body, spineArr(el, iR).slice(el.body.a, el.body.b), P)
  const skip = t.skipEnds ?? 1
  for (let i = skip; i < P.length - skip; i++) {
    for (const s of sides) {
      const h = wAt[i] / 2
      const ins = s > 0 ? tL[i] : tR[i]
      const len = t.length ?? ins
      const a = h + 0.4, b = h - len
      grooves.push({ pts: [[P[i][0] + M[i][0] * s * a, P[i][1] + M[i][1] * s * a], [P[i][0] + M[i][0] * s * b, P[i][1] + M[i][1] * s * b]], w: t.line ?? cl * 0.9, clip: el.outline })
    }
  }
}

function outerSide(pts) {
  // the side away from the turning: a C-band's outside
  let turn = 0
  for (let i = 1; i < pts.length - 1; i++) {
    const a = pts[i - 1], b = pts[i], c = pts[i + 1]
    turn += (b[0] - a[0]) * (c[1] - b[1]) - (b[1] - a[1]) * (c[0] - b[0])
  }
  return turn > 0 ? -1 : 1
}

function resampleWidths(pts, ws, P) {
  // nearest-vertex width for each resampled point
  return P.map((q) => {
    let best = Infinity, w = ws[0]
    for (let i = 0; i < pts.length; i++) {
      const d = Math.hypot(pts[i][0] - q[0], pts[i][1] - q[1])
      if (d < best) { best = d; w = ws[i] }
    }
    return w
  })
}

/** Scales (鳞纹) on a body: staggered arches along the band, opening toward its start. */
function scaleFill(el, C, f, fl, grooves) {
  const p = f.pitch ?? 2.6
  if (el.kind !== 'stroke') return
  const body = el.spine.slice(el.body.a, el.body.b)
  const P = resample(body, p * 0.62)
  const { M, d } = offsets(P, P.map(() => 0), P.map(() => 0))
  const wAt = resampleWidths(body, el.widths.slice(el.body.a, el.body.b), P)
  for (let i = 0; i < P.length; i++) {
    const h = wAt[i] / 2
    const n = Math.ceil(h / p) + 1
    const dir = d[Math.min(i, d.length - 1)]
    const ang = Math.atan2(dir[1], dir[0])
    for (let k = -n; k <= n; k++) {
      const off = (k + (i % 2) * 0.5) * p
      if (Math.abs(off) > h + p) continue
      const c = [P[i][0] + M[i][0] * off, P[i][1] + M[i][1] * off]
      const pts = []
      for (let j = 0; j <= 12; j++) {
        const a = ang - Math.PI / 2 + (Math.PI * j) / 12
        pts.push([c[0] + Math.cos(a) * (p / 2 - fl * 0.3), c[1] + Math.sin(a) * (p / 2 - fl * 0.3)])
      }
      grooves.push({ pts, w: fl, clip: C })
    }
  }
}

// ------------------------------------------------------------------ pillow eye

/**
 * The pillow eye boss (臣-less fangyi / gui eye): a convex rounded rectangle,
 * steep at its foot, softly domed on top, with a short sunk slit pupil and an
 * optional sunk ring around it. Written straight into the field (max), so its
 * top is a smooth superellipse dome, not a distance-field hip roof.
 * @param o { c: [x, y], w, h (mm), round: 0..1 (0.45; 1 = ellipse), height mm (2), crown: 0..1 (0.5; 0 flat top),
 *            base: mm | 'field' (sit on what is there; default 0), rot (deg),
 *            slit: { len, width, depth, rot } | false, ring: { gap, line, depth } | false, tilt: mm (top leans: + = higher at +y) }
 */
export function pillowBoss(panel, o = {}) {
  const { c = [0, 0], w = 12, h = 10, rot = 0 } = o
  const round = clamp(o.round ?? 0.45, 0, 1)
  const ex = 2 + (1 - round) * 6 // superellipse exponent: 2 ellipse … 8 nearly square
  const height = o.height ?? 2
  const kTop = 1.6 + (1 - (o.crown ?? 0.5)) * 5
  const base = o.base === 'field' ? panel.heightAt(c[0], c[1]) : o.base ?? 0
  const { cols, rows, ppmm, field } = panel
  const R = Math.hypot(w, h) / 2 + 1
  const x0 = Math.max(0, Math.floor((c[0] - R) * ppmm)), x1 = Math.min(cols - 1, Math.ceil((c[0] + R) * ppmm))
  const y0 = Math.max(0, Math.floor((c[1] - R) * ppmm)), y1 = Math.min(rows - 1, Math.ceil((c[1] + R) * ppmm))
  const cs = Math.cos(-rot * D2R), sn = Math.sin(-rot * D2R)
  const a = w / 2, b = h / 2
  const tilt = o.tilt ?? 0
  const SS = [-0.25, 0.25]
  for (let y = y0; y <= y1; y++) {
    for (let x = x0; x <= x1; x++) {
      let acc = 0, cov = 0
      for (const sy of SS) for (const sx of SS) {
        const px = (x + 0.5 + sx) / ppmm - c[0], py = (y + 0.5 + sy) / ppmm - c[1]
        const u = px * cs - py * sn, v = px * sn + py * cs
        const q = Math.pow(Math.pow(Math.abs(u / a), ex) + Math.pow(Math.abs(v / b), ex), 1 / ex)
        if (q >= 1) continue
        cov++
        acc += Math.sqrt(1 - Math.pow(q, kTop)) * (1 + (tilt * v) / (b * Math.max(height, 1e-3)) * 0.5)
      }
      if (!cov) continue
      const val = base + (height * acc) / 4
      const i = y * cols + x
      if (val > field[i]) field[i] = val
    }
  }
  if (o.ring) {
    const g = o.ring.gap ?? 0.8, lw = o.ring.line ?? 0.45
    const pts = superellipse(c, a + g + lw / 2, b + g + lw / 2, ex, rot)
    panel.sink((ctx) => { ctx.lineWidth = lw; ctx.beginPath(); pathPoly(ctx, pts, true); ctx.stroke() }, { depth: o.ring.depth ?? 0.35, shoulder: lw * 0.45, profile: 'u' })
  }
  if (o.slit !== false) {
    const s = o.slit || {}
    const len = s.len ?? w * 0.32, sw = s.width ?? Math.max(0.5, h * 0.09)
    const sr = ((s.rot ?? rot) * D2R)
    const off = s.offset ?? [0, 0]
    panel.sink((ctx) => {
      ctx.save()
      ctx.translate(c[0] + off[0], c[1] + off[1])
      ctx.rotate(sr)
      ctx.beginPath()
      const rr = Math.min(sw * 0.35, len / 2)
      ctx.moveTo(-len / 2 + rr, -sw / 2)
      ctx.arcTo(len / 2, -sw / 2, len / 2, sw / 2, rr)
      ctx.arcTo(len / 2, sw / 2, -len / 2, sw / 2, rr)
      ctx.arcTo(-len / 2, sw / 2, -len / 2, -sw / 2, rr)
      ctx.arcTo(-len / 2, -sw / 2, len / 2, -sw / 2, rr)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }, { depth: s.depth ?? height * 0.35, shoulder: Math.min(0.3, sw * 0.4), profile: 'u' })
  }
  return { a, b, ex }
}

function superellipse(c, a, b, ex, rot = 0, n = 96) {
  const cs = Math.cos(rot * D2R), sn = Math.sin(rot * D2R)
  const out = []
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2
    const ct = Math.cos(t), st = Math.sin(t)
    const x = a * Math.sign(ct) * Math.pow(Math.abs(ct), 2 / ex)
    const y = b * Math.sign(st) * Math.pow(Math.abs(st), 2 / ex)
    out.push([c[0] + x * cs - y * sn, c[1] + x * sn + y * cs])
  }
  return out
}

/** The footprint of a pillow boss as a closed outline (to keep ground / other units off it). */
export function pillowOutline(o = {}) {
  const round = clamp(o.round ?? 0.45, 0, 1)
  return superellipse(o.c ?? [0, 0], (o.w ?? 12) / 2, (o.h ?? 10) / 2, 2 + (1 - round) * 6, o.rot ?? 0)
}
