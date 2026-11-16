// nezu-fanghu — the décor, TRACED off photo-08 developed onto the model's own surface
// (reference/nezu-fanghu/faces/dev-<zone>.jpg; the tracings are faces/dev-<zone>.trace.json, previewed by
// reference/nezu-fanghu/trace.py). Coordinates of every tracing: s = developed mm from the side's centre line
// (right seen from outside), y = vessel height; each traced zone is the RIGHT half of the front, mirrored for the left.
// The narrow ±X sides repeat the front's design compressed in s by their own developed width (inferred: no
// photograph shows a side square-on; photo-09 shows the +X side's fields and studs obliquely).
//
// Relief language (photo-08, Western Zhou ribbon style): ONE flat level for strap, cartouche and bird; the drawing
// CUT into it as wide round-shouldered channels (kit.cutRibbons), hollows packed with fine spirals, round eye bosses.

import LOW from '../../../reference/nezu-fanghu/faces/dev-low.trace.json'
import UP from '../../../reference/nezu-fanghu/faces/dev-up.trace.json'
import FRIEZE from '../../../reference/nezu-fanghu/faces/dev-frieze.trace.json'
import FOOT from '../../../reference/nezu-fanghu/faces/dev-foot.trace.json'
import LID from '../../../reference/nezu-fanghu/faces/dev-lid.trace.json'
import { LV } from './form.js'

const GROUND = { pitch: 0.85, line: 0.5, depth: 0.32, cell: [3.6, 6.5], roundness: 0.3, pairs: 0.3, maxAspect: 1.6, jitter: 0.05 }
// the photograph's spiral ground is ROUND (云纹-like coils at ≈ 0.9 mm pitch), packed in the earth-filled hollows
const ROUND = { pitch: 0.9, line: 0.5, depth: 0.4, cell: [3.2, 7.5], roundness: 0.9, pairs: 0.25, maxAspect: 1.5, jitter: 0.04, fillers: true }

/**
 * The photograph's spiral ground: ROUND coils (≈ 0.9 mm pitch, 3–7 mm across) packed into the earth-filled hollows —
 * not the squared 雷纹 cells of the Anyang leiwen packer. Greedy packing of the largest circles that fit (distance to
 * the hollow's outline), an Archimedean groove in each, every one in ONE sink. Polygons in panel mm (already mapped).
 */
export function spiralFill(p, polys, { pitch = 0.9, line = 0.42, depth = 0.45, rMin = 0.9, rMax = 3.3, gap = 0.12, step = 0.3 } = {}) {
  const circles = []
  const segDist = (q, a, b) => {
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const t = Math.max(0, Math.min(1, ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / (dx * dx + dy * dy || 1)))
    return Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy)
  }
  const inside = (q, P) => {
    let c = false
    for (let i = 0, j = P.length - 1; i < P.length; j = i++) {
      const [xi, yi] = P[i], [xj, yj] = P[j]
      if ((yi > q[1]) !== (yj > q[1]) && q[0] < ((xj - xi) * (q[1] - yi)) / (yj - yi) + xi) c = !c
    }
    return c
  }
  for (const P of polys) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity
    for (const [x, y] of P) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    const cand = []
    for (let y = y0; y <= y1; y += step) {
      for (let x = x0; x <= x1; x += step) {
        const q = [x, y]
        if (!inside(q, P)) continue
        let d = Infinity
        for (let i = 0; i < P.length; i++) d = Math.min(d, segDist(q, P[i], P[(i + 1) % P.length]))
        const r = Math.min(rMax, d - gap)
        if (r >= rMin) cand.push([x, y, r])
      }
    }
    cand.sort((a, b) => b[2] - a[2])
    const mine = []
    for (const [x, y, r0] of cand) {
      let r = r0
      for (const c of mine) r = Math.min(r, Math.hypot(x - c[0], y - c[1]) - c[2] - gap)
      if (r >= rMin) mine.push([x, y, r])
    }
    circles.push(...mine)
  }
  if (!circles.length) return 0
  p.sink((ctx) => {
    ctx.lineWidth = line * pitch * 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round'
    circles.forEach(([cx, cy, R], n) => {
      const turns = Math.max(1, (R - 0.25) / pitch)
      const th1 = turns * 2 * Math.PI, hand = n % 2 ? 1 : -1, a0 = n * 1.7
      ctx.beginPath()
      for (let th = 0; th <= th1; th += 0.18) {
        const r = R - 0.15 - (pitch * th) / (2 * Math.PI)
        const x = cx + r * Math.cos(a0 + hand * th), y = cy + r * Math.sin(a0 + hand * th)
        th ? ctx.lineTo(x, y) : ctx.moveTo(x, y)
      }
      ctx.stroke()
    })
  }, { depth, shoulder: line * pitch * 0.5, profile: 'u' })
  return circles.length
}

/** the spiral hollows of a ribbon spec, mapped (and mirrored) into panel mm */
function hollowPolys(spec, map, reflect = ([x, y]) => [-x, y]) {
  const out = []
  for (const h of spec.hollows || []) {
    if (!h.leiwen) continue
    const D = denseLoop(h.poly, 1)
    out.push(D.map(map))
    if (reflect) out.push(D.map((q) => map(reflect(q))))
  }
  return out
}

/** densify a closed loop (author mm) so the non-linear map bends it */
function denseLoop(pts, step = 2) {
  const out = []
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i], b = pts[(i + 1) % pts.length]
    const k = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step))
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k])
  }
  return out
}


/** the rising triangles of the neck (y 359–416): one unit centred at c (developed mm), half base hb */
function triangleUnit(c, hb, y0 = 359.6, y1 = 415.5) {
  const H = y1 - y0, L = Math.hypot(hb, H)
  const edge = (side, inset) => {
    // the straight edge base corner → tip, moved `inset` mm inward and trimmed to stay inside the band
    const B = [c + side * hb, y0], Tp = [c, y1]
    const n = [(-side * H) / L, -hb / L], d = [(-side * hb) / L, H / L]
    const a = [B[0] + n[0] * inset + d[0] * inset * 1.2, B[1] + n[1] * inset + d[1] * inset * 1.2]
    const b = [Tp[0] + n[0] * inset - d[0] * inset * 1.6, Tp[1] + n[1] * inset - d[1] * inset * 1.6]
    return [a, b]
  }
  const channels = []
  for (const side of [-1, 1]) {
    for (const [inset, w] of [[0.6, 1.1], [2.6, 0.8]]) {
      const [a, b] = edge(side, inset)
      channels.push({ line: [a, b], w })
    }
  }
  // the scroll pair in the foot of the triangle (photo-08: two C-spirals facing, over a leiwen hollow)
  const sp = (cx, cy, hand) => {
    const pts = []
    for (let t = 0; t <= 1.0001; t += 0.08) {
      const a = Math.PI * (0.5 + hand * 2.2 * t), r = 3.4 * (1 - 0.72 * t)
      pts.push([cx + r * Math.cos(a) * hand, cy + r * Math.sin(a)])
    }
    return pts
  }
  // r8 fix (photo-08): the pair of scrolls fills the lower ≈ 40 % of the triangle — two fat C-spirals facing, a roof
  // ribbon arching over them, a stem rising to the apex, the spiral ground packed between and beside them
  const R0 = Math.min(5.8, hb * 0.24)
  const spB = (cx, cy, hand) => {
    const pts = []
    for (let t = 0; t <= 1.0001; t += 0.05) {
      const a = Math.PI * (0.5 + hand * 2.4 * t), r = R0 * (1 - 0.7 * t)
      pts.push([cx + r * Math.cos(a) * hand, cy + r * Math.sin(a)])
    }
    return pts
  }
  channels.push({ line: spB(c - hb * 0.4, 369.4, 1), w: 1.1 })
  channels.push({ line: spB(c + hb * 0.4, 369.4, -1), w: 1.1 })
  channels.push({ line: [[c - hb * 0.66, 376.4], [c - hb * 0.3, 380.6], [c, 381.8], [c + hb * 0.3, 380.6], [c + hb * 0.66, 376.4]], w: 1.1 })
  channels.push({ line: [[c, 384.6], [c, 404]], w: 1.0 })
  const hollows = [
    { poly: [[c - hb * 0.15, 361.2], [c + hb * 0.15, 361.2], [c + hb * 0.12, 377.4], [c - hb * 0.12, 377.4]], d: 1.0, leiwen: true },
    { poly: [[c - hb * 0.8, 361.2], [c - hb * 0.62, 361.2], [c - hb * 0.66, 372], [c - hb * 0.84, 362.6]], d: 1.0, leiwen: true },
    { poly: [[c + hb * 0.62, 361.2], [c + hb * 0.8, 361.2], [c + hb * 0.84, 362.6], [c + hb * 0.66, 372]], d: 1.0, leiwen: true },
  ]
  return { channels, hollows }
}

/**
 * The body panel of one side (y LV.plateTop → LV.neck): { relief, panelW }.
 * ctx: { ppmm, seed, Qh(y) this side's half developed width, Qf(y) the FRONT's, arc(y) this side's meridian arc }
 * Panel x = panelW/2 + developed s, y = arc(y) − arc(y0).
 */
export function bodyPanel(kit, { ppmm, seed, Qh, Qf, arc, y0, y1, side = false }) {
  const panelW = 2 * Math.max(Qh(130), Qh(y1), Qh(y0)) + 2
  const a0 = arc(y0)
  const p = new kit.ReliefPanel({ width: panelW, height: arc(y1) - a0, ppmm, seed })
  // design s (traced on the front) → this side: compressed by the ratio of developed widths at that height
  const map = ([s, y]) => [panelW / 2 + s * (Qh(y) / Qf(y)), arc(y) - a0]
  const mapOwn = ([s, y]) => [panelW / 2 + s, arc(y) - a0] // already in this side's own mm
  const common = { map, mirror: true, axis: 0, seed, leiwen: GROUND }
  // fields (cartouches of the belly): lower, upper; neck frieze; foot frieze
  // the two belly registers: the photograph's own groove network (grooves.py), not a hand-stroked paraphrase
  const belly = { ...common, leiwen: false, depth: 1.8, shoulder: 0.5, widen: 1.75, minW: 1.5, lift: { h: 1.1, shoulder: 1.6 }, border: { w: 2.8, d: 2.2 }, hollow: { d: 1.2, shoulder: 0.5 } }
  // fat bands: before the channels are cut, every band edge is rolled down over ≈ 1 mm (a wide shallow sink along
  // each channel), so the flat ribbons between the channels swell into them like the cast bands do, not a flat field
  // with lines engraved in it
  const roll = { ...common, leiwen: false, border: false, lift: null, boss: false, depth: 0.55, shoulder: 0.5, widen: 1.75, minW: 1.5 }
  const rollSpec = (S) => ({ channels: S.channels.map((c) => ({ ...c, w: (c.w ?? 1.4) + 1.3, d: undefined })) })
  kit.cutRibbons(p, LOW, { ...belly, boss: { height: 3.4, crown: 0.85, dot: 0.8 } })
  kit.cutRibbons(p, UP, { ...belly, seed: seed + 1, boss: { height: 3.2, crown: 0.85, dot: 0.7 } })
  kit.cutRibbons(p, rollSpec(LOW), roll) // after both lifts (raise = max would undo it)
  kit.cutRibbons(p, rollSpec(UP), roll)
  spiralFill(p, [...hollowPolys(LOW, map), ...hollowPolys(UP, map)])
  kit.cutRibbons(p, FRIEZE, { ...common, seed: seed + 2, depth: 1.6, shoulder: 0.5, widen: 1.55, minW: 1.4, lift: { h: 1.0, shoulder: 1.2 }, border: { w: 2.2, d: 1.8 }, leiwen: false, boss: { height: 2.8, crown: 0.85, dot: 0.6 } })
  spiralFill(p, hollowPolys(FRIEZE, map), { rMax: 2.8 })
  kit.cutRibbons(p, FOOT, { ...common, seed: seed + 3, depth: 1.3, shoulder: 0.5, widen: 1.4, minW: 1.4, border: false, boss: false })
  // neck triangles: units at ±Qh/3 and the corner halves at ±Qh (laid in this side's own developed mm)
  const qn = Qh(388), hb = qn / 3
  const tri = { channels: [], hollows: [] }
  for (const c of [hb, qn]) {
    const u = triangleUnit(c, hb)
    tri.channels.push(...u.channels); tri.hollows.push(...u.hollows)
  }
  // the band's borders: under the triangles (frieze top) and the fillet under the lid lip
  tri.channels.push({ line: [[0, 358.2], [qn + 1, 358.2]], w: 1.1 })
  tri.channels.push({ line: [[0, 416.6], [qn + 1, 416.6]], w: 0.9 })
  kit.cutRibbons(p, tri, { map: mapOwn, mirror: true, axis: 0, seed: seed + 4, depth: 1.3, shoulder: 0.5, widen: 1.4, minW: 1.2, border: false, leiwen: false })
  spiralFill(p, hollowPolys(tri, mapOwn), { rMax: 2.6 })
  // the edges of the straps: the shoulder band's lower line and the strap/field shoulder (photo-08: a crisp step line)
  void side
  return { relief: p.bake(), panelW }
}

/** the lid band panel (y LV.lip → LV.lid): two bird cartouches either side of a plain centre strip, per side */
export function lidPanel(kit, { ppmm, seed, Qh, Qf, arc, y0, y1 }) {
  const panelW = 2 * Qh(y0) + 2
  const a0 = arc(y0)
  const p = new kit.ReliefPanel({ width: panelW, height: arc(y1) - a0, ppmm, seed })
  const map = ([s, y]) => [panelW / 2 + s * (Qh(y) / Qf(y)), arc(y) - a0]
  kit.cutRibbons(p, LID, { map, mirror: true, axis: 0, seed, depth: 1.4, shoulder: 0.5, widen: 1.5, minW: 1.3, lift: { h: 0.9, shoulder: 1.0 }, border: { w: 2.2, d: 1.7 }, leiwen: false, hollow: { d: 1.0, shoulder: 0.4 }, boss: { height: 2.4, crown: 0.85, dot: 0.5 } })
  spiralFill(p, hollowPolys(LID, map), { rMax: 2.6 })
  return { relief: p.bake(), panelW }
}
