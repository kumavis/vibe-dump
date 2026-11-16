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
  channels.push({ line: sp(c - hb * 0.42, 367.6, 1), w: 0.9 })
  channels.push({ line: sp(c + hb * 0.42, 367.6, -1), w: 0.9 })
  channels.push({ line: [[c - hb * 0.62, 374.2], [c, 376.4], [c + hb * 0.62, 374.2]], w: 0.9 })
  const hollows = [{ poly: [[c - hb * 0.16, 362.2], [c + hb * 0.16, 362.2], [c + hb * 0.1, 372.4], [c - hb * 0.1, 372.4]], d: 0.9, leiwen: true }]
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
  kit.cutRibbons(p, LOW, { ...common, depth: 1.8, shoulder: 0.5, widen: 1.5, minW: 1.6, lift: { h: 1.3, shoulder: 1.6 }, border: { w: 2.8, d: 2.2 }, boss: { height: 3.4, crown: 0.85, dot: 0.8 } })
  kit.cutRibbons(p, UP, { ...common, seed: seed + 1, depth: 1.7, shoulder: 0.5, widen: 1.45, minW: 1.5, lift: { h: 1.3, shoulder: 1.6 }, border: { w: 2.8, d: 2.2 }, boss: { height: 3.2, crown: 0.85, dot: 0.7 } })
  kit.cutRibbons(p, FRIEZE, { ...common, seed: seed + 2, depth: 1.5, shoulder: 0.5, widen: 1.4, minW: 1.4, lift: { h: 1.0, shoulder: 1.2 }, border: { w: 2.2, d: 1.8 }, boss: { height: 2.8, crown: 0.85, dot: 0.6 } })
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
  kit.cutRibbons(p, tri, { map: mapOwn, mirror: true, axis: 0, seed: seed + 4, depth: 1.2, shoulder: 0.5, widen: 1.3, minW: 1.2, border: false, leiwen: GROUND })
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
  kit.cutRibbons(p, LID, { map, mirror: true, axis: 0, seed, depth: 1.3, shoulder: 0.5, widen: 1.4, minW: 1.3, lift: { h: 0.9, shoulder: 1.0 }, border: { w: 2.0, d: 1.6 }, leiwen: GROUND, boss: { height: 2.4, crown: 0.85, dot: 0.5 } })
  // the lip's rounded edge line at the bottom of the band
  kit.cutRibbons(p, { channels: [{ line: [[-Qh(LV.lip + 3), LV.lip + 3.2], [Qh(LV.lip + 3), LV.lip + 3.2]], w: 0.9 }] }, { map: ([s, y]) => [panelW / 2 + s, arc(y) - a0], depth: 0.5, border: false })
  return { relief: p.bake(), panelW }
}
