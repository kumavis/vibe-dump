// Ribbon relief — the Western Zhou "cut" style (KIT.md § Ribbon relief; research/04 § Birds — the Western Zhou ribbon bird).
//
// STATUS: first pass. Additive: nothing else in the kit imports this file.
//
// Two centuries after Anyang the drawing changes hand. The 9th-century BC phoenix hu of the Nezu Museum (90097-98) is
// not built of plates standing on a leiwen ground: the whole field is ONE broad flat level — straps, cartouche and
// bird alike — and the drawing is CUT into it. Wide channels with rounded shoulders part fat flat ribbons (crest,
// body, wing, the long tail plumes), a few hollows are cut deeper and packed with fine spirals, the eyes are round
// bosses ringed by a sunk line. So a ribbon design is a list of CENTRE LINES of channels, not outlines of plates:
//
//   cutRibbons(panel, spec, opts)   spec = { channels: [{ line: [[x, y]…], w, d? }], hollows: [{ poly, d?, leiwen? }],
//                                           raised: [{ poly, h? }], bosses: [{ c, r, ring? }], field?: { rrect, r } }
//                                   (the reference/<id>/faces/dev-<zone>.trace.json format, tools: reference/nezu-fanghu/trace.py)
//   opts: { map: ([x, y]) → [x, y] panel mm (default identity), mirror: false (also draw the design mirrored about
//           x = axis, through the same map), axis: 0, depth: 1.1 (channel depth), shoulder: 0.42 (× w: the rounded lip
//           of a channel, from the surface edge in), border: { w: 2.0, d: 1.5 } | false (the cartouche channel along
//           spec.field), hollow: { d: 1.2, shoulder: 0.35 }, leiwen: { pitch: 0.9, … } | false (packed in the
//           `leiwen: true` hollows, ONE fill for all of them), boss: { height: 2.4, crown: 0.8, dot: 0.7 }, seed,
//           smooth: 2 (Chaikin passes on every channel centre line; a channel with sharp: true keeps its corners),
//           widen: 1 (× every channel width), minW: 0 (mm), lift: { h, shoulder } | null (raise the cartouche
//           interior spec.field as one cushion before cutting: the bird stands proud of the strap) }
//   → { channels, hollows, bosses, ms }
//
// Cost: one sink for every channel of the call (+ one for the borders, one for the hollows), one leiwenFill over the
// union of the leiwen hollows, a pillowBoss per eye. No per-element distance transforms.

import { leiwenFill } from './leiwen.js'
import { pillowBoss } from './rounded.js'

/** rounded rectangle [x0, y0, x1, y1] with radius r or [inner-top, outer-top, outer-bottom, inner-bottom] (inner = the
 *  x0 side) as a dense closed polyline (author frame) */
export function rrectPath([x0, y0, x1, y1], r = 0, step = 8) {
  const R = Array.isArray(r) ? r : [r, r, r, r]
  const lim = (v) => Math.max(0, Math.min(v, (x1 - x0) / 2, (y1 - y0) / 2))
  const [rTL, rTR, rBR, rBL] = R.map(lim)
  const pts = []
  const arc = (cx, cy, rr, a0, a1) => {
    if (rr <= 0) { pts.push([cx, cy]); return }
    for (let i = 0; i <= step; i++) {
      const a = a0 + ((a1 - a0) * i) / step
      pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)])
    }
  }
  const h = Math.PI / 2
  arc(x0 + rBL, y0 + rBL, rBL, 2 * h, 3 * h)
  arc(x1 - rBR, y0 + rBR, rBR, 3 * h, 4 * h)
  arc(x1 - rTR, y1 - rTR, rTR, 0, h)
  arc(x0 + rTL, y1 - rTL, rTL, h, 2 * h)
  return pts
}

/** Chaikin corner cutting of an open polyline (ends kept): a hand-cut channel turns in a curve, not a mitre */
export function smoothLine(pts, iterations = 2) {
  let P = pts
  for (let it = 0; it < iterations; it++) {
    if (P.length < 3) return P
    const Q = [P[0]]
    for (let i = 0; i < P.length - 1; i++) {
      const a = P[i], b = P[i + 1]
      if (i > 0) Q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]])
      if (i < P.length - 2) Q.push([0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]])
    }
    Q.push(P[P.length - 1])
    P = Q
  }
  return P
}

/** densify a polyline so a non-linear map bends its segments (max segment mm in the author frame) */
function dense(pts, step = 1.5, closed = false) {
  const out = []
  const n = pts.length
  const m = closed ? n : n - 1
  for (let i = 0; i < m; i++) {
    const a = pts[i], b = pts[(i + 1) % n]
    const L = Math.hypot(b[0] - a[0], b[1] - a[1])
    const k = Math.max(1, Math.ceil(L / step))
    for (let j = 0; j < k; j++) out.push([a[0] + ((b[0] - a[0]) * j) / k, a[1] + ((b[1] - a[1]) * j) / k])
  }
  if (!closed) out.push(pts[n - 1])
  return out
}

/** the cartouche outline: field.rrect ([x0, y0, x1, y1] + r) or field.poly (a closed polygon, corners rounded by
 *  `round` closed Chaikin passes, default 3) — a traced field that widens down a swelling belly is not a rectangle */
function fieldPath(field) {
  if (field.poly) {
    let P = field.poly
    for (let it = 0; it < (field.round ?? 3); it++) {
      const Q = []
      for (let i = 0; i < P.length; i++) {
        const a = P[i], b = P[(i + 1) % P.length]
        Q.push([0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]], [0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]])
      }
      P = Q
    }
    return P
  }
  return rrectPath(field.rrect, field.r || 0)
}

export function cutRibbons(panel, spec, opts = {}) {
  const t0 = performance.now()
  const {
    map = (p) => p, mirror = false, axis = 0, depth = 1.1, shoulder = 0.42,
    border = { w: 2.0, d: 1.5 }, hollow = { d: 1.2, shoulder: 0.35 }, leiwen = { pitch: 0.9 },
    boss = { height: 2.4, crown: 0.8, dot: 0.7 }, seed = 0, widen = 1, minW = 0, lift = null, smooth = 2,
  } = opts
  const W = (c) => Math.max(minW, (c.w ?? 1.4) * widen)
  const sides = mirror ? [1, -1] : [1]
  const M = (s) => (p) => map(s > 0 ? p : [2 * axis - p[0], p[1]])
  const stroke = (ctx, pts, closed = false) => {
    ctx.beginPath()
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)))
    if (closed) ctx.closePath()
  }
  const chans = spec.channels || []
  // ---- lift: the cartouche interior raised as one cushion (its edge a rounded shoulder) before anything is cut
  const hasField = spec.field && (spec.field.rrect || spec.field.poly)
  if (lift && hasField) {
    const path = fieldPath(spec.field)
    panel.raise((ctx) => { for (const s of sides) { stroke(ctx, dense(path, 1.5, true).map(M(s)), true); ctx.fill() } }, { height: lift.h ?? 1, shoulder: lift.shoulder ?? 1.2, profile: 'plateau' })
  }
  // ---- the cartouche border (a wider, deeper channel)
  if (border && hasField) {
    const path = fieldPath(spec.field)
    panel.sink((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = border.w
      for (const s of sides) { stroke(ctx, dense(path, 1.5, true).map(M(s)), true); ctx.stroke() }
    }, { depth: border.d, shoulder: border.w * shoulder, profile: 'u' })
  }
  // ---- channels: grouped by depth (one sink per distinct depth)
  const byDepth = new Map()
  for (const c of chans) {
    const d = c.d ?? depth
    if (!byDepth.has(d)) byDepth.set(d, [])
    byDepth.get(d).push(c)
  }
  for (const [d, list] of byDepth) {
    const wMax = Math.max(...list.map(W))
    panel.sink((ctx) => {
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'
      for (const s of sides) {
        for (const c of list) {
          ctx.lineWidth = W(c)
          stroke(ctx, dense(c.sharp ? c.line : smoothLine(c.line, smooth)).map(M(s))); ctx.stroke()
        }
      }
    }, { depth: d, shoulder: wMax * shoulder, profile: 'u' })
  }
  // ---- hollows (flat-bottomed recesses), then leiwen packed in the ones that carry it
  const hol = spec.hollows || []
  const hd = hollow.d
  if (hol.length) {
    const groups = new Map()
    for (const h of hol) {
      const d = h.d ?? hd
      if (!groups.has(d)) groups.set(d, [])
      groups.get(d).push(h)
    }
    for (const [d, list] of groups) {
      panel.sink((ctx) => {
        for (const s of sides) for (const h of list) { stroke(ctx, dense(h.poly, 1.5, true).map(M(s)), true); ctx.fill() }
      }, { depth: d, shoulder: hollow.shoulder, profile: 'u' })
    }
    const lw = hol.filter((h) => h.leiwen)
    if (leiwen && lw.length) {
      leiwenFill(panel, {
        include: (ctx) => { for (const s of sides) for (const h of lw) { stroke(ctx, dense(h.poly, 1.5, true).map(M(s)), true); ctx.fill() } },
        avoid: null, margin: 0.3,
      }, { pitch: 0.9, line: 0.5, depth: 0.35, cell: [4, 7], roundness: 0.35, pairs: 0.3, maxAspect: 1.6, jitter: 0.05, seed, ...leiwen })
    }
  }
  // ---- raised (rare: ridges, frames that stand proud)
  for (const r of spec.raised || []) {
    panel.raise((ctx) => { for (const s of sides) { stroke(ctx, dense(r.poly, 1.5, true).map(M(s)), true); ctx.fill() } }, { height: r.h ?? 1.2, shoulder: 0.5, profile: 'plateau' })
  }
  // ---- eyes: a round domed boss in a sunk ring, a small pupil dot
  const bosses = []
  for (const b of spec.bosses || []) {
    for (const s of sides) {
      const c = M(s)(b.c)
      const e = M(s)([b.c[0] + b.r, b.c[1]])
      const k = Math.abs(e[0] - c[0]) / b.r || 1 // local x scale of the map (a compressed narrow side)
      if (b.ring) {
        panel.sink((ctx) => { ctx.beginPath(); ctx.ellipse(c[0], c[1], b.ring * k, b.ring, 0, 0, Math.PI * 2); ctx.fill() }, { depth: 0.9, shoulder: 0.5, profile: 'u' })
      }
      pillowBoss(panel, { c, w: 2 * b.r * k, h: 2 * b.r, round: 1, height: boss.height, crown: boss.crown, base: 'field', slit: false })
      if (boss.dot) panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], boss.dot, 0, Math.PI * 2); ctx.fill() }, { depth: 0.6, shoulder: 0.3, profile: 'u' })
      bosses.push({ c, r: b.r })
    }
  }
  return { channels: chans.length * sides.length, hollows: hol.length * sides.length, bosses, ms: performance.now() - t0 }
}
