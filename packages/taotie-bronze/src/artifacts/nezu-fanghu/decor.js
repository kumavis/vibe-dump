// nezu-fanghu — the décor, TRACED off photo-08 developed onto the model's own surface
// (reference/nezu-fanghu/faces/dev-<zone>.jpg; the tracings are faces/dev-<zone>.trace.json, previewed by
// reference/nezu-fanghu/trace.py). Coordinates of every tracing: s = developed mm from the side's centre line
// (right seen from outside), y = vessel height; each traced zone is the RIGHT half of the front, mirrored for the left.
// The narrow ±X sides repeat the front's design compressed in s by their own developed width (inferred: no
// photograph shows a side square-on; photo-09 shows the +X side's fields and studs obliquely).
//
// Relief language (photo-08, Western Zhou ribbon style): ONE flat level for strap, cartouche and bird; the drawing
// CUT into it as wide round-shouldered channels (kit.cutRibbons), hollows packed with fine spirals, round eye bosses.

import FOOT from '../../../reference/nezu-fanghu/faces/dev-foot.trace.json'
// The two body birds as the OWNER reads them (the earlier ribbons.py tracings, dev-low/dev-up.ribbons.json, cut the
// birds into pieces and are no longer used here):
//  lower — the owner's own outline drawn over photo-08 (reference/nezu-fanghu/owner-trace-phoenix.json): ONE broad
//          raised bird filling the cartouche, the sunk parts only the narrow channels and bays between its parts;
//  upper — the figure/ground map a classifier learnt from that outline and from the owner's corrections
//          (tools/propose.py, tools/snap.py; owner-scribbles-1.json), read off the upper-left cartouche and mirrored.
import LOW_RIB from '../../../reference/nezu-fanghu/faces/dev-low.owner.json'
import UP_RIB from '../../../reference/nezu-fanghu/faces/dev-up.machine.json'
import FRIEZE_RIB from '../../../reference/nezu-fanghu/faces/dev-frieze.ribbons.json'
import LID_RIB from '../../../reference/nezu-fanghu/faces/dev-lid.ribbons.json'
import FOOT_RIB from '../../../reference/nezu-fanghu/faces/dev-foot.ribbons.json'
import TRI_RIB from '../../../reference/nezu-fanghu/faces/dev-tri.ribbons.json'
import { LV } from './form.js'

// SUNK-THEN-EMBOSSED (photo-08/09): each bird's cartouche is cut ≈ 1.6 mm below the wall (the straps stand that proud of it; r9: 1.4 → 1.6, upper end of the 1.2–1.8 shadow read), its edge stepping down
// through three ribs at 1.25 mm pitch; the bird is raised back up as flat-topped ribbons (3–6 mm wide) flush with the wall,
// soft 0.7 mm shoulders; ring eyes with a domed centre in their own recess; round spirals (≈ 1 mm) sunk into the floor
// left between the ribbons (kit.sunkCartouche; ribbons traced by reference/nezu-fanghu/ribbons.py)
const SUNK = { depth: 1.6, level: 0, shoulder: 0.7, rim: { ribs: 3, pitch: 1.25 }, eye: { ring: 1.3, ringTop: 0, gap: 0.45, dome: 0.5 },
  ground: { pitch: 0.95, line: 0.5, depth: 0.3, cell: [2.4, 6], roundness: 0.9, pairs: 0.25, maxAspect: 1.5, jitter: 0.04, fillers: true }, groundMargin: 0.35,
  // the fine line set ≈ 0.8 mm in from the edge of every ribbon 2.7–6 mm wide (photo-08: the ribbons are double-outlined;
  // the broad head plates are not): 0.55 mm ≈ 2.6 px at q 1, 1.9 px at q 0.5
  contour: { inset: 0.8, line: 0.55, depth: 0.2, maxHalf: 3.0 } }

// r9 LAYOUT (measured on the rectified faces face-lower / face-upper and photo-09): each body cartouche runs from the
// central strap to the corner, where it meets the narrow side's cartouche with only their rims between (≈ 3 mm of wall
// at the diagonal). The tracings stop short of that (photo-08 cannot see round the corner): the lower field ended at
// s 114.6 (the diagonal is at 106–120), the upper one 20 mm short at its foot (s 89.6 at y 203, diagonal 109.5). So each
// bird is REFITTED in s: its traced span [inner, outer(y)] is stretched linearly to [INNER, Qh(y) − CORNER] of the side
// it is laid on (the ribbons widen with it). INNER: the strap's half width + gap — 17 / 18 mm on the broad faces
// (photo: ±17 lower, ±18 upper; it was 19.6 / 20.4) and 0.85 × that on the narrow sides (their studs are 0.85 as wide).
const CORNER = 1.5
const UP_OUTER = [[198.6, 87], [203, 89.6], [220, 89.4], [252, 86.2], [275, 82.4], [280.2, 80.4], [282.3, 76]]
const lerpY = (T, y) => {
  if (y <= T[0][0]) return T[0][1]
  for (let i = 1; i < T.length; i++) if (y <= T[i][0]) { const [y0, v0] = T[i - 1], [y1, v1] = T[i]; return v0 + ((v1 - v0) * (y - y0)) / (y1 - y0) }
  return T[T.length - 1][1]
}
/** traced s → this side's s, for one cartouche register */
function refitter(Qh, inner, oldInner, oldOuter) {
  return (s, y) => {
    const a = Math.abs(s), sg = s < 0 ? -1 : 1
    const o = oldOuter(y), n = Qh(y) - CORNER
    return sg * (inner + ((a - oldInner) * (n - inner)) / (o - oldInner))
  }
}

/** a ribbons.json tracing moved in s: x ↦ c + k·(x − c0) (one triangle unit traced at s = c0, laid at s = c) */
function shiftTracing(R, c0, c, k) {
  const f = ([x, y]) => [c + k * (x - c0), y]
  const F = R.field
  return { field: { poly: F.poly.map(f) }, plates: R.plates.map((p) => ({ outer: p.outer.map(f), holes: (p.holes || []).map((h) => h.map(f)) })), eyes: R.eyes.map((e) => ({ ...e, c: f(e.c), r: e.r * k })) }
}

/** a ribbons.json tracing (developed mm, the RIGHT bird) and its mirror image about s = 0 (the confronted left bird) */
function cartouchePair(R) {
  const one = { field: R.field, plates: R.plates, eyes: R.eyes }
  const f = ([x, y]) => [-x, y]
  const F = R.field
  const field = F.rrect ? { rrect: [-F.rrect[2], F.rrect[1], -F.rrect[0], F.rrect[3]], r: Array.isArray(F.r) ? [F.r[1], F.r[0], F.r[3], F.r[2]] : F.r } : { poly: F.poly.map(f) }
  const two = { field, plates: R.plates.map((p) => ({ outer: p.outer.map(f), holes: (p.holes || []).map((h) => h.map(f)) })), eyes: R.eyes.map((e) => ({ ...e, c: f(e.c) })) }
  return [one, two]
}

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
  // fields: the belly cartouches (sunk, the birds embossed in them); neck frieze; foot frieze
  // the four body cartouches of this side in ONE call: lower pair (confronted), upper pair
  const nar = side ? 0.85 : 1
  const fitLow = refitter(Qh, 17 * nar, LOW_RIB.span[0], () => LOW_RIB.span[1]), fitUp = refitter(Qh, 18 * nar, 20.6, (y) => lerpY(UP_OUTER, y))
  const mapLow = ([s, y]) => [panelW / 2 + fitLow(s, y), arc(y) - a0], mapUp = ([s, y]) => [panelW / 2 + fitUp(s, y), arc(y) - a0]
  // lower birds: the field is the bird's own hull + a 1.2 mm moat (no stepped rim: the lines that follow its edge are
  // drawn ON the bird, as the fine contour line set in from every edge)
  kit.sunkCartouche(p, cartouchePair(LOW_RIB), { ...SUNK, rim: false, contour: { inset: 1.2, line: 0.55, depth: 0.22, maxHalf: 9 }, map: mapLow, seed })
  kit.sunkCartouche(p, cartouchePair(UP_RIB), { ...SUNK, map: mapUp, seed: seed + 1 })
  // the neck frieze: the same sunk-and-embossed construction, a confronted pair meeting on the centre line
  kit.sunkCartouche(p, cartouchePair(FRIEZE_RIB), { ...SUNK, depth: 1.2, rim: { ribs: 2, pitch: 1.2 }, map, seed: seed + 2 })
  // the foot frieze: the band between its plain border lines (still cut, FOOT channels 0–3) sunk, the roundel and the
  // hooked S-ribbons embossed in it
  kit.cutRibbons(p, { channels: FOOT.channels.slice(0, 4) }, { ...common, seed: seed + 3, depth: 1.0, shoulder: 0.5, widen: 1.2, minW: 1.2, border: false, boss: false })
  kit.sunkCartouche(p, cartouchePair(FOOT_RIB), { ...SUNK, depth: 1.1, rim: { ribs: 2, pitch: 1.0 }, eye: { ring: 1.2, ringTop: 0, gap: 0.5, dome: 0.4 }, contour: null, map, seed: seed + 3 })
  // neck triangles: the traced unit (centred at s 23.5 on the front) laid at ±Qh/3 and on the corners ±Qh, in this
  // side's own developed mm, scaled to its third of the width; each a sunk field with a ribbed edge, scrolls embossed
  const qn = Qh(388), hb = qn / 3, kt = hb / 23.5
  const tris = []
  for (const c of [hb, qn]) tris.push(...cartouchePair(shiftTracing(TRI_RIB, 23.5, c, kt)))
  kit.sunkCartouche(p, tris, { ...SUNK, depth: 1.1, shoulder: 0.5, rim: { ribs: 2, pitch: 1.1 }, eye: { ring: 0.7, ringTop: 0, gap: 0.3, dome: 0.3 }, contour: null, map: mapOwn, seed: seed + 4 })
  // the band's borders: under the triangles (frieze top) and the fillet under the lid lip
  const tri = { channels: [{ line: [[0, 358.2], [qn + 1, 358.2]], w: 1.1 }, { line: [[0, 416.6], [qn + 1, 416.6]], w: 0.9 }] }
  kit.cutRibbons(p, tri, { map: mapOwn, mirror: true, axis: 0, seed: seed + 4, depth: 1.0, shoulder: 0.5, widen: 1.4, minW: 1.2, border: false, leiwen: false })
  // the edges of the straps: the shoulder band's lower line and the strap/field shoulder (photo-08: a crisp step line)
  void side
  return { relief: p.bake(), panelW }
}

/** the lid band panel (y LV.lip → LV.lid): two bird cartouches either side of a plain centre strip, per side */
export function lidPanel(kit, { ppmm, seed, Qh, Qf, arc, y0, y1 }) {
  const panelW = 2 * Qh(y0) + 2
  const a0 = arc(y0)
  const p = new kit.ReliefPanel({ width: panelW, height: arc(y1) - a0, ppmm, seed })
  // the tracing was made on a 421–464 band; the measured dome now ends at y1 (460.5): compress it in y
  const yk = (y1 - y0) / (464 - y0)
  const map = ([s, y]) => { const yy = y0 + (y - y0) * yk; return [panelW / 2 + s * (Qh(yy) / Qf(yy)), arc(yy) - a0] }
  kit.sunkCartouche(p, cartouchePair(LID_RIB), { ...SUNK, depth: 1.0, shoulder: 0.5, rim: { ribs: 2, pitch: 0.8 }, eye: { ring: 0.8, ringTop: 0, gap: 0.35, dome: 0.4 }, contour: null, map, seed })
  return { relief: p.bake(), panelW }
}
