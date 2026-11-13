// Whorl circle (火纹 / 囧纹 / 涡纹) — research/01 §4.4, §4.12.
//
// A raised, gently domed disc (12–30 mm on a 20–40 cm vessel, 40–60 mm on
// jia post caps) with a small central circle or boss and 4–6 comma-shaped
// sunk spokes, all sweeping the same way from near the centre to the rim,
// each covering 60–90° of arc and widening outward. Alternates with kui or
// 四瓣目纹 in shoulder bands (compose.frieze({ unit: ['whorl', 'kui'] })).
//
// Rotationally (not mirror-) symmetric: draws the whole rect, centred.
// kind 'petal' gives the 四瓣目纹 square: a round eye with four hooked lobes
// in an X, inside a squared frame.

import { E, R, Pen, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, rectClip } from './_strokes.js'
import { PROFILES } from '../panel.js'

export const schema = {
  kind: E(['whorl', 'petal'], 'whorl', 'Kind (火纹 / 四瓣目纹)'),
  spokes: R(3, 7, 1, 5, 'Spokes'),
  turn: E(['ccw', 'cw'], 'ccw', 'Sweep'),
  sweep: R(40, 110, 5, 75, 'Spoke sweep', '°'),
  size: R(0.5, 1, 0.01, 0.92, 'Diameter (of rect)'),
  centre: E(['circle', 'boss', 'ring'], 'circle', 'Centre'),
  dome: R(0, 1, 0.05, 0.6, 'Doming'),
  ...reliefSchema({ motif: 1.6, boss: 2.6, groove: 0.5, lineWeight: 0.6, echoInset: 0.9, carving: 'none' }),
}

export const presets = {
  'five-spokes': {},
  'four-spokes': { spokes: 4, sweep: 85 },
  'six-spokes': { spokes: 6, sweep: 65 },
  'post-cap': { spokes: 6, size: 0.98, centre: 'boss', dome: 0.9, relief: { motif: 3, boss: 4.5, groove: 0.6 } },
  petal: { kind: 'petal', carving: 'sparse' },
  flush: { style: 'flush', relief: { motif: 0.4, boss: 1.2, groove: 0.4 } },
}

/** A comma groove: from radius r0 at angle a0 sweeping `sw` (rad, signed) to the rim, widening. */
function comma(cx, cy, r0, r1, a0, sw, w0, w1, n = 40) {
  const L = [], Rr = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const r = r0 + (r1 - r0) * t
    const a = a0 + sw * t
    const w = (w0 + (w1 - w0) * Math.pow(t, 0.8)) / 2
    const nx = Math.cos(a), ny = Math.sin(a)
    // offset across the curve (approx: along the radius and tangent mix)
    const tx = -Math.sin(a) * Math.sign(sw), ty = Math.cos(a) * Math.sign(sw)
    const ox = (nx * 0.35 + tx) * w, oy = (ny * 0.35 + ty) * w
    L.push([cx + nx * r + ox, cy + ny * r + oy])
    Rr.push([cx + nx * r - ox, cy + ny * r - oy])
  }
  // rounded head at the inner end
  const head = []
  for (let k = 1; k < 8; k++) {
    const a = a0 + Math.PI / 2 + (k / 8) * Math.PI
    head.push([cx + Math.cos(a0) * r0 + Math.cos(a) * w0 * 0.5 * Math.sign(sw), cy + Math.sin(a0) * r0 + Math.sin(a) * w0 * 0.5 * Math.sign(sw)])
  }
  return L.concat(Rr.reverse(), head)
}

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2
  const R0 = (Math.min(rect.w, rect.h) / 2) * p.size
  const flush = p.style === 'flush'
  const lvl = p.relief
  const lw = p.lineWeight
  if (p.kind === 'petal') return drawPetal(panel, rect, p, cx, cy, R0)
  // 1. the disc: plateau wall, then a dome over its top
  const H = flush ? 0.12 : lvl.motif
  const dome = flush ? 0 : p.dome
  const wall = Math.max(0.3, Math.min(0.7, H * 0.4))
  panel.raise((ctx) => { ctx.beginPath(); ctx.arc(cx, cy, R0, 0, Math.PI * 2); ctx.fill() }, {
    height: H * (1 + dome * 0.5),
    shoulder: R0,
    profile: (s, w) => PROFILES.plateau(s, wall) * ((1 - dome * 0.33) + dome * 0.33 * Math.sqrt(Math.max(0, 1 - (1 - s / w) ** 2))),
  })
  if (flush) panel.sink((ctx) => { ctx.beginPath(); ctx.arc(cx, cy, R0 - lw, 0, Math.PI * 2); ctx.lineWidth = lw; ctx.stroke() }, { depth: lvl.groove, shoulder: lw / 2 })
  // 2. comma spokes, all sweeping the same way
  const n = p.spokes | 0
  const dir = p.turn === 'cw' ? -1 : 1
  const rc = R0 * 0.24 // centre circle radius
  const rng = motifRng('whorl', rect, p)
  const rot0 = rng.range(0, Math.PI * 2)
  const wMax = Math.min(R0 * 0.24, (2 * Math.PI * R0) / n * 0.17)
  panel.sink((ctx) => {
    for (let i = 0; i < n; i++) {
      const a0 = rot0 + (i / n) * Math.PI * 2
      const pts = comma(cx, cy, rc + lw * 1.4, R0 - Math.max(0.5, lw * 0.9), a0, dir * (p.sweep * Math.PI) / 180, lw * 1.3, wMax)
      ctx.beginPath()
      pts.forEach((q, k) => (k ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])))
      ctx.closePath()
      ctx.fill()
    }
  }, { depth: lvl.groove * 1.2, shoulder: lw * 0.6, profile: 'u' })
  // 3. centre: a ring groove, a small boss, or a ring
  if (p.centre === 'boss') {
    panel.raise((ctx) => { ctx.beginPath(); ctx.arc(cx, cy, rc * 0.85, 0, Math.PI * 2); ctx.fill() }, { height: Math.max(lvl.boss, H * 1.6), profile: 'dome' })
  }
  panel.sink((ctx) => { ctx.beginPath(); ctx.arc(cx, cy, rc, 0, Math.PI * 2); ctx.lineWidth = lw; ctx.stroke() }, { depth: lvl.groove, shoulder: lw / 2 })
  if (p.centre === 'ring') panel.sink((ctx) => { ctx.beginPath(); ctx.arc(cx, cy, rc * 0.45, 0, Math.PI * 2); ctx.fill() }, { depth: lvl.groove * 0.8, shoulder: lw / 2 })
}

/** 四瓣目纹: a round eye boss, four hooked lobes in an X, a squared frame band. */
function drawPetal(panel, rect, p, cx, cy, R0) {
  const s = R0 * 2
  const f = makeFrame({ x: cx - R0, y: cy - R0, w: s, h: s })
  const S = new Sheet(f, { rng: motifRng('petal', rect, p), wobble: 0.003 * p.irregularity })
  const bw = 0.12
  // squared frame
  const fr = new Pen(0.5, bw / 2, 0, 0.006).fd(0.5 - bw / 2 - 0.08).arc(90, 0.08).fd(1 - bw - 0.16).arc(90, 0.08).fd(1 - bw - 0.16).arc(90, 0.08).fd(1 - bw - 0.16).arc(90, 0.08).fd(0.5 - bw / 2 - 0.08)
  S.band(fr.pts, bw)
  // four lobes: from near the eye toward each corner, hooking round
  for (let i = 0; i < 4; i++) {
    const a = 45 + i * 90
    const ar = (a * Math.PI) / 180
    const pen = new Pen(0.5 + Math.cos(ar) * 0.2, 0.5 + Math.sin(ar) * 0.2, a, 0.006).fd(0.1).arc(90, 0.07).fd(0.03).arc(90, 0.045)
    S.taper(pen.pts, bw * 1.1, bw * 0.7, 0.4)
  }
  S.circle([0.5, 0.5], 0.17)
  S.boss([0.5, 0.5], 0.12, { kind: 'round', pupil: 'dot', base: 'plateau' })
  renderSheet(panel, S, p, { clip: rectClip(rect) })
}

export default {
  name: 'whorl', label: 'Whorl circle', schema, presets, draw,
  symmetric: false, plaque: { w: 60, h: 60 },
  groundOptions: (p, rect) => ({ pitch: Math.max(0.8, Math.min(2, Math.min(rect.w, rect.h) * 0.045)) }),
}
