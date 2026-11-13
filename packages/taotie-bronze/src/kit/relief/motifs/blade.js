// Rising / hanging blades (蕉叶纹 / 三角纹) — research/01 §4.3, §2.14 T10.
//
// A tall isosceles blade (height : base ≈ 2–3.5 : 1), apex up on gu and zun
// trumpets (rising from a bowstring), apex down on lower bellies (hanging).
// Its outline is a raised border band (Style V) or a set of incised contour
// lines (Style IV — the Met gu 1985.214.4 trumpet: three or four lines
// meeting in a rounded arch). Inside: a vertically stretched mask in the wide
// lower part (eyes low, nose ridge on the blade axis, horns climbing the
// sides and hooking in), a cicada (head toward the base), or leiwen only;
// leiwen fills everything else up to the apex. The ground between blades is
// left alone (plain on the gu/zun), see compose.bladeRow({ between }).
//
// Symmetric: draw() paints the LEFT half, compose.drawMotif mirrors. The
// blade fills its own interior with leiwen, so it declares `ground: false`.

import { leiwenFill } from '../leiwen.js'
import { E, R, Pen, Sheet, makeFrame, renderSheet, reliefSchema, withRelief, motifRng, polyPath } from './_strokes.js'
import { buildCicada } from './cicada.js'

export const schema = {
  direction: E(['rising', 'hanging'], 'rising', 'Direction'),
  shape: E(['triangle', 'ogive'], 'ogive', 'Outline'),
  concave: R(0, 0.2, 0.01, 0.05, 'Side concavity'),
  border: E(['band', 'lines', 'none'], 'band', 'Border'),
  borderLines: R(1, 5, 1, 3, 'Contour lines'),
  borderWidth: R(0.8, 6, 0.1, 2, 'Border band width', 'mm'),
  fill: E(['mask', 'cicada', 'leiwen'], 'mask', 'Fill'),
  maskHeight: R(0.25, 0.75, 0.01, 0.48, 'Mask height (of blade)'),
  eye: E(['round', 'square', 'chen', 'none'], 'round', 'Mask eye'),
  pupil: E(['dot', 'slit', 'none'], 'dot', 'Pupil'),
  pitch: R(0.6, 3, 0.05, 1.1, 'Leiwen pitch', 'mm'),
  leiwenTop: R(0.3, 1, 0.01, 1, 'Leiwen up to (of blade); contour lines above'),
  ...reliefSchema({ motif: 1.1, boss: 2.2, groove: 0.35, lineWeight: 0.45, echoInset: 0.8, carving: 'sparse' }),
}

export const presets = {
  'rising-mask': {},
  'hanging-mask': { direction: 'hanging' },
  'rising-cicada': { fill: 'cicada' },
  'leiwen-only': { fill: 'leiwen', border: 'lines', borderLines: 2 },
  // Met gu 1985.214.4 trumpet: tall flush blades, three or four contour lines
  // closing in a round arch, a small low mask with dot-pupil eyes, leiwen above
  'gu-trumpet': {
    shape: 'ogive', border: 'lines', borderLines: 4, fill: 'mask', maskHeight: 0.26, style: 'flush', eye: 'round', pupil: 'none', leiwenTop: 0.6,
    pitch: 0.9, lineWeight: 0.4, relief: { motif: 0.35, boss: 0.9, groove: 0.3 },
  },
  // Met zun 43.25.1 neck: broader flush blades with an arched top, a banded
  // border and the mask's hooks filling the lower half
  'zun-neck': {
    shape: 'ogive', border: 'lines', borderLines: 3, fill: 'mask', maskHeight: 0.5, style: 'flush', eye: 'none', pupil: 'none', leiwenTop: 0.62,
    pitch: 1.1, lineWeight: 0.5, relief: { motif: 0.4, boss: 1.2, groove: 0.35 },
  },
}

export const presetPlaques = {
  'gu-trumpet': { w: 34, h: 130 },
  'zun-neck': { w: 60, h: 100 },
}

// ---------------------------------------------------------------- geometry

/** Half-width (mm) at fraction t from the base to the apex. */
export function halfWidth(p, W, t) {
  if (t >= 1) return 0
  if (p.shape === 'ogive') return (W / 2) * Math.sqrt(1 - t * t) * (1 - 0.42 * t) * (1 - p.concave * Math.sin(Math.PI * t))
  return (W / 2) * (1 - t) * (1 - p.concave * Math.sin(Math.PI * t))
}

/** Blade geometry helpers for a rect. */
function geom(rect, p) {
  const cx = rect.x + rect.w / 2
  const W = rect.w
  const Hh = rect.h
  const hanging = p.direction === 'hanging'
  const Y = (t) => (hanging ? rect.y + rect.h - t * Hh : rect.y + t * Hh)
  const hw = (t) => halfWidth(p, W, t)
  return { cx, W, Hh, Y, hw, hanging }
}

/** Left-half outline, inset by d mm horizontally (base → apex), panel mm. */
function sideLine(g, d, n = 80) {
  const out = []
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const w = g.hw(t) - d
    if (w <= 0) { out.push([g.cx, g.Y(t)]); break }
    out.push([g.cx - w, g.Y(t)])
  }
  return out
}

/** Fill the whole blade (both halves) as a closed path — for masks/avoid regions. */
export function outline(ctx, rect, params, inset = 0) {
  const p = withRelief(params)
  const g = geom(rect, p)
  const L = sideLine(g, inset)
  const R = L.map(([x, y]) => [2 * g.cx - x, y]).reverse()
  polyPath(ctx, L.concat(R), true)
  ctx.fill()
}

/** The stretched T10 mask: authored in (u: 0 axis → 1 side, v: 0 base → 1 mask top). */
function buildBladeMask(S, g, p, inset, Hm, base) {
  const hwIn = (v) => Math.max(0.5, g.hw(Math.min(0.999, (base + v * Hm) / g.Hh)) - inset)
  const M = ([u, v]) => [g.cx - u * hwIn(v), g.Y((base + v * Hm) / g.Hh)]
  const Mp = (pts) => pts.map(M)
  const hb = hwIn(0)
  const bw = Math.max(0.8, Math.min(hb * 0.2, Hm * 0.11)) // band width mm
  const ub = bw / hb // in u at the base
  const pen = (u, v, h) => new Pen(u, v, h, 0.008)
  // nose ridge on the axis (a full-width band: half of it lies across the axis)
  S.band([M([0, 0.12]), M([0, 0.66])].map((q) => [q[0] - S.f.rect.x, q[1] - S.f.rect.y]), bw * 1.1 / S.f.unit, 'round')
  // upper lip: from the nose base outward, the mouth corner curling up
  const lip = pen(0.02, 0.1, 0).fd(0.64).arc(90, 0.08).fd(0.06).arc(90, 0.05)
  S.band(rel(S, Mp(lip.pts)), bw / S.f.unit)
  // eye socket + boss
  const ev = 0.38
  const eu = 0.46
  const er = Math.min(hb * 0.2, Hm * 0.12)
  const ec = M([eu, ev])
  S.plateau.push({ kind: 'ellipse', c: ec, rx: er * 1.9, ry: er * 1.35, rot: 0 })
  if (p.eye === 'none') S.lines.push({ pts: Array.from({ length: 25 }, (_, i) => [ec[0] + Math.cos(i / 24 * Math.PI * 2) * er * 0.8, ec[1] + Math.sin(i / 24 * Math.PI * 2) * er * 0.8]) })
  else S.bosses.push({ shape: p.eye === 'square' ? { kind: 'rrect', c: ec, w: er * 2.2, h: er * 2, r: er * 0.55 } : { kind: 'circle', c: ec, r: er }, r: er, base: 'plateau' })
  if (p.pupil === 'dot') S.cuts.push({ kind: 'circle', c: ec, r: Math.max(0.25, er * 0.3) })
  if (p.pupil === 'slit') S.cuts.push({ kind: 'band', pts: [[ec[0] - er * 0.5, ec[1]], [ec[0] + er * 0.5, ec[1]]], w: Math.max(0.3, er * 0.18), cap: 'round' })
  // inner canthus hook (toward the axis, turning down)
  const can = pen(eu - 0.3, ev + 0.02, 180).fd(0.06).arc(90, 0.05).fd(0.04)
  S.band(rel(S, Mp(can.pts)), bw * 0.75 / S.f.unit)
  // horn: rises from above the eye along the side and hooks back over the axis
  const horn = pen(0.26, 0.58, 90).fd(0.16).arc(-90, 0.12).fd(0.2).arc(-90, 0.1).fd(0.06).arc(-90, 0.06).fd(0.04)
  S.band(rel(S, Mp(horn.pts)), bw / S.f.unit)
  // ear / cheek hook outside the eye
  const ear = pen(0.92, 0.28, 90).fd(0.2).arc(90, 0.08).fd(0.1)
  S.band(rel(S, Mp(ear.pts)), bw * 0.8 / S.f.unit)
  return { top: base + Hm * 1.02 }
}

/** panel mm → the sheet's local frame (identity frame with unit 1 mm). */
function rel(S, pts) {
  return pts.map(([x, y]) => [x - S.f.rect.x, y - S.f.rect.y])
}

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const g = geom(rect, p)
  const f = makeFrame(rect, { unit: 1 })
  const S = new Sheet(f, { rng: motifRng('blade', rect, p), wobble: 0.04 * p.irregularity })
  const half = { x: rect.x, y: rect.y, w: rect.w / 2, h: rect.h }
  const lw = p.lineWeight
  let inset = 0
  // ---- border
  if (p.border === 'band') {
    const bw = Math.min(p.borderWidth, rect.w * 0.12)
    S.band(rel(S, sideLine(g, bw / 2)), bw, 'flat')
    inset = bw + Math.max(0.8, p.pitch * 0.6)
  } else if (p.border === 'lines') {
    const n = p.borderLines | 0
    const sp = Math.max(lw * 2.2, p.pitch)
    for (let i = 0; i < n; i++) S.groundLine(rel(S, sideLine(g, lw * 0.8 + i * sp)), lw)
    inset = lw * 0.8 + (n - 1) * sp + sp * 0.9
  }
  if (p.leiwenTop < 1 && p.border !== 'none') {
    // the upper blade carries only nested contour lines converging on the apex (Met gu trumpet)
    const sp = Math.max(lw * 2.2, p.pitch)
    const t0 = p.leiwenTop
    for (let d = inset + lw * 0.5; d < rect.w / 2; d += sp) {
      const L = sideLine(g, d).filter(([, y]) => (g.hanging ? g.Y(0) - y : y - g.Y(0)) >= t0 * g.Hh)
      if (L.length > 1) S.groundLine(rel(S, L), lw)
      else break
    }
    // and a cross line closing the leiwen field below them
    const w0 = g.hw(t0) - inset
    if (w0 > 0) S.groundLine(rel(S, [[g.cx - w0, g.Y(t0) - (g.hanging ? -1 : 1) * sp * 0.5], [g.cx + 0.4, g.Y(t0) - (g.hanging ? -1 : 1) * sp * 0.5]]), lw)
  }
  // ---- fill
  const base = Math.max(1, inset * 0.6) + 0.5
  const hIn = rect.h - base - inset
  if (p.fill === 'mask') {
    buildBladeMask(S, g, p, inset + 0.4, Math.max(4, hIn * p.maskHeight), base)
  } else if (p.fill === 'cicada') {
    // a cicada filling the lower blade, head toward the base
    const hb = g.hw(base / g.Hh) - inset - 0.4
    const len = hIn * 0.8
    const cr = { x: g.cx - hb, y: g.hanging ? rect.y + rect.h - base - len : rect.y + base, w: hb * 2, h: len }
    const cf = makeFrame(cr, { rot: g.hanging ? 90 : -90 })
    const CS = new Sheet(cf, { rng: S.rng, wobble: 0.003 * p.irregularity })
    buildCicada(CS, cf.A, { length: cf.A * 0.97, chevrons: 5, eyeSize: 1, legs: false, concave: 0.06 })
    for (const k of ['plateau', 'bosses', 'lines', 'cuts']) S[k].push(...CS[k])
  }
  const clip = (ctx) => { ctx.beginPath(); ctx.rect(half.x, half.y, half.w + 0.01, half.h) }
  renderSheet(panel, S, p, { clip })
  // ---- leiwen inside the blade (left half), around the raised parts
  const inner = (ctx) => {
    const L = sideLine(g, inset).filter(([, y]) => p.leiwenTop >= 1 || (g.hanging ? g.Y(0) - y : y - g.Y(0)) <= (p.leiwenTop * g.Hh - Math.max(lw * 2.2, p.pitch)))
    polyPath(ctx, L.concat([[g.cx + 0.5, L[L.length - 1][1]], [g.cx + 0.5, g.Y(0)]]), true)
    ctx.fill()
  }
  leiwenFill(panel, { rect: half, include: inner, avoid: 'raised', margin: Math.max(0.4, p.pitch * 0.4) }, { pitch: p.pitch, depth: p.relief.groove, echo: p.border === 'lines' ? 0 : 1 })
  return S
}

export function groundOptions(p) {
  return { pitch: p.pitch }
}

export default {
  name: 'blade', label: 'Rising / hanging blade', schema, presets, presetPlaques, draw, outline, groundOptions,
  ground: false, plaque: { w: 50, h: 120 },
}
