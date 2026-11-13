// Companion-motif toolkit: the pen, frame and sheet the kui, birds, blades,
// cicadas, whorls and bands are authored with (research/01 §2.2, §3.3, §4).
//
// Self-contained on purpose (shapes.js / taotie.js are owned elsewhere).
//
//   Frame  — a creature box inside a panel rect: local units where the box's
//            cross dimension is 1 (a frieze of height h → 1 local unit = h mm),
//            optional mirror (facing) and quarter turns (vertical kui).
//   Pen    — a turtle that lays dense centre-line polylines in local units:
//            fd / arc / turn (squared-round corner) / spiral (squared, in-curling).
//   Sheet  — what a motif emits: plateau shapes (bands, tapers, polys,
//            circles, rounded rects), L2 bosses, explicit incised lines, pupil
//            cuts. Everything is converted to panel mm on insertion.
//   renderSheet(panel, sheet, p) — the Style V / IV height recipe of §8 step 7,
//            the same one the taotie uses: plateau, contour-echo grooves cut
//            from the plateau's own distance field, line work, domed bosses,
//            pupils. 'flush' keeps the motif in the ground plane with an
//            outline groove.

import { PROFILES } from '../panel.js'
import { Rng } from '../../util/rng.js'

const D2R = Math.PI / 180
export const FLUSH_LIFT = 0.12

// ------------------------------------------------------------------ schema

const E = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })
export { E, R }

/** The rendering params every companion motif shares (appended to its schema). */
export function reliefSchema({ motif = 1.5, boss = 3, groove = 0.45, lineWeight = 0.55, echoInset = 1.2, carving = 'dense' } = {}) {
  return {
    style: E(['relief', 'flush'], 'relief', 'Style (V relief / IV flush)'),
    carving: E(['dense', 'sparse', 'none'], carving, 'Plateau line work'),
    lineWeight: R(0.3, 1.6, 0.05, lineWeight, 'Line weight', 'mm'),
    echoInset: R(0.5, 3, 0.05, echoInset, 'Contour echo inset', 'mm'),
    irregularity: R(0, 2, 0.1, 1, 'Hand irregularity'),
    seed: R(0, 99, 1, 0, 'Seed'),
    relief: {
      type: 'group',
      label: 'Relief levels',
      fields: {
        motif: R(0.2, 6, 0.1, motif, 'Motif (L1)', 'mm'),
        boss: R(0.5, 10, 0.1, boss, 'Boss (L2)', 'mm'),
        groove: R(0.1, 1.2, 0.05, groove, 'Groove', 'mm'),
      },
    },
  }
}

/** Fill missing shared params (callers may pass a bare object). */
export function withRelief(p) {
  return {
    style: 'relief', carving: 'dense', lineWeight: 0.55, echoInset: 1.2, irregularity: 1, seed: 0,
    ...p,
    relief: { motif: 1.5, boss: 3, groove: 0.45, ...(p.relief || {}) },
  }
}

/** A deterministic stream per motif instance (position-keyed, so two units differ). */
export function motifRng(name, rect, p) {
  return new Rng(`${name}:${p.seed | 0}:${rect.x.toFixed(2)},${rect.y.toFixed(2)},${rect.w.toFixed(2)}`)
}

// ------------------------------------------------------------------ frame

/**
 * A local frame inside `rect`. Local y runs 0..1 across the box's cross
 * dimension; local x runs 0..A along it (A = aspect).
 *   rot: 0 (along x), 90 (local +x points up the panel), -90 (points down)
 *   flip: mirror local x (a creature authored facing +x then faces −x)
 */
export function makeFrame(rect, { rot = 0, flip = false, unit } = {}) {
  const along = rot === 0 ? rect.w : rect.h
  const across = rot === 0 ? rect.h : rect.w
  const u = unit ?? across
  const A = along / u
  const H = across / u
  const map = ([x0, y], out = [0, 0]) => {
    const x = flip ? A - x0 : x0
    if (rot === 0) { out[0] = rect.x + x * u; out[1] = rect.y + y * u }
    else if (rot === 90) { out[0] = rect.x + rect.w - y * u; out[1] = rect.y + x * u }
    else { out[0] = rect.x + y * u; out[1] = rect.y + rect.h - x * u }
    return out
  }
  return { rect, rot, flip, unit: u, A, H, map, pts: (pts) => pts.map((p) => map(p, [0, 0])) }
}

// ------------------------------------------------------------------ pen

/**
 * Turtle in local units. Angles in degrees, 0 = +x, 90 = +y; positive turns
 * are counter-clockwise (left).
 */
export class Pen {
  constructor(x, y, heading = 0, step = 0.012) {
    this.x = x
    this.y = y
    this.h = heading
    this.step = step
    this.pts = [[x, y]]
  }
  get at() { return [this.x, this.y] }
  fd(len) {
    if (len <= 0) return this
    const n = Math.max(1, Math.ceil(len / this.step))
    const c = Math.cos(this.h * D2R), s = Math.sin(this.h * D2R)
    const x0 = this.x, y0 = this.y
    for (let i = 1; i <= n; i++) this.pts.push([x0 + (c * len * i) / n, y0 + (s * len * i) / n])
    this.x = x0 + c * len
    this.y = y0 + s * len
    return this
  }
  /** Arc of `deg` (+ left / − right) with radius r. */
  arc(deg, r) {
    if (!deg) return this
    const sgn = Math.sign(deg)
    const a0 = (this.h - sgn * 90) * D2R
    const cx = this.x - Math.cos(a0) * r
    const cy = this.y - Math.sin(a0) * r
    const n = Math.max(2, Math.ceil((Math.abs(deg) * D2R * r) / this.step))
    for (let i = 1; i <= n; i++) {
      const a = a0 + (deg * D2R * i) / n
      this.pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r])
    }
    this.h += deg
    const a = a0 + deg * D2R
    this.x = cx + Math.cos(a) * r
    this.y = cy + Math.sin(a) * r
    return this
  }
  /** Go straight to (x, y), re-aiming first. */
  to(x, y) {
    this.h = Math.atan2(y - this.y, x - this.x) / D2R
    return this.fd(Math.hypot(x - this.x, y - this.y))
  }
  /**
   * Squared in-curling spiral (雷纹-style terminal of a band): legs a, b,
   * a−d, b−d, … turning `dir` (+1 left / −1 right) at each corner with a
   * fillet r·leg. Stops after `turns` full turns or when a leg gets too short.
   */
  spiral({ a, b = a, d, dir = 1, turns = 1.5, r = 0.5, min = 0.02 } = {}) {
    const legs = Math.round(turns * 4)
    let A = a, B = b
    for (let i = 0; i < legs; i++) {
      const L = i % 2 === 0 ? A : B
      if (L < min) break
      const rr = Math.max(0.003, Math.min(L * 0.4, r * d * 0.5))
      this.fd(Math.max(0, L - (i ? rr : 0) - rr))
      if (i < legs - 1) this.arc(dir * 90, rr)
      if (i % 2 === 1) { A -= d; B -= d }
    }
    return this
  }
  /** Round in-curling spiral: start radius R, `turns`, shrink per turn (fraction). */
  curl(deg, R, shrink = 0.35, dir = 1) {
    let r = R
    let left = Math.abs(deg)
    while (left > 0) {
      const seg = Math.min(45, left)
      this.arc(dir * seg, r)
      r *= 1 - (shrink * seg) / 360
      left -= seg
    }
    return this
  }
}

/** Tiny hand irregularity on a polyline (local units), smooth along its length. */
export function wobble(pts, rng, amp) {
  if (!amp) return pts
  const k1 = rng.range(0, 6.28), k2 = rng.range(0, 6.28)
  const f1 = rng.range(4, 9), f2 = rng.range(9, 17)
  let L = 0
  const out = [pts[0].slice()]
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i][0] - pts[i - 1][0], dy = pts[i][1] - pts[i - 1][1]
    const l = Math.hypot(dx, dy) || 1e-9
    L += l
    const w = amp * (0.6 * Math.sin(L * f1 + k1) + 0.4 * Math.sin(L * f2 + k2))
    out.push([pts[i][0] - (dy / l) * w, pts[i][1] + (dx / l) * w])
  }
  return out
}

// ------------------------------------------------------------------ shapes → canvas

export function polyPath(ctx, pts, closed = false) {
  ctx.beginPath()
  for (let i = 0; i < pts.length; i++) (i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]))
  if (closed) ctx.closePath()
}

function rrectPath(ctx, x, y, w, h, r) {
  r = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

/** Paint one sheet shape (panel mm). `grow` dilates it (mm). */
export function drawShape(ctx, s, grow = 0) {
  switch (s.kind) {
    case 'band': {
      ctx.lineJoin = 'round'
      if (typeof s.w === 'function') {
        // taper: overlapping round-capped segments (a smooth taper at any width)
        ctx.lineCap = 'round'
        const n = s.pts.length
        let L = 0
        const acc = [0]
        for (let i = 1; i < n; i++) acc.push((L += Math.hypot(s.pts[i][0] - s.pts[i - 1][0], s.pts[i][1] - s.pts[i - 1][1])))
        for (let i = 1; i < n; i++) {
          ctx.lineWidth = Math.max(0.05, s.w(acc[i] / (L || 1)) + grow * 2)
          ctx.beginPath()
          ctx.moveTo(s.pts[i - 1][0], s.pts[i - 1][1])
          ctx.lineTo(s.pts[i][0], s.pts[i][1])
          ctx.stroke()
        }
        return
      }
      ctx.lineCap = s.cap === 'flat' ? 'butt' : s.cap === 'square' ? 'square' : 'round'
      ctx.lineWidth = s.w + grow * 2
      polyPath(ctx, s.pts)
      ctx.stroke()
      return
    }
    case 'poly':
      polyPath(ctx, s.pts, true)
      ctx.fill()
      if (grow) { ctx.lineWidth = grow * 2; ctx.lineJoin = 'round'; ctx.stroke() }
      return
    case 'circle':
      ctx.beginPath()
      ctx.arc(s.c[0], s.c[1], s.r + grow, 0, Math.PI * 2)
      ctx.fill()
      return
    case 'rrect': {
      ctx.save()
      ctx.translate(s.c[0], s.c[1])
      if (s.rot) ctx.rotate(s.rot)
      ctx.beginPath()
      rrectPath(ctx, -s.w / 2 - grow, -s.h / 2 - grow, s.w + 2 * grow, s.h + 2 * grow, s.r + grow)
      ctx.fill()
      ctx.restore()
      return
    }
    case 'ellipse':
      ctx.beginPath()
      ctx.ellipse(s.c[0], s.c[1], s.rx + grow, s.ry + grow, s.rot || 0, 0, Math.PI * 2)
      ctx.fill()
      return
  }
}

/** Stroke a polyline as an incised line (panel mm). */
export function strokeLine(ctx, pts, w, cap = 'round') {
  ctx.lineCap = cap
  ctx.lineJoin = 'round'
  ctx.lineWidth = w
  polyPath(ctx, pts)
  ctx.stroke()
}

// ------------------------------------------------------------------ sheet

/**
 * Collects a motif's marks in panel mm. Local-unit inputs go through `frame`;
 * widths and radii are local units × frame.unit.
 */
export class Sheet {
  constructor(frame, { rng, wobble: amp = 0 } = {}) {
    this.f = frame
    this.rng = rng || new Rng(1)
    this.amp = amp // local units
    this.plateau = [] // shapes
    this.holes = [] // shapes carved back out of the plateau (mouth gaps)
    this.bosses = [] // { shape, r, base }
    this.lines = [] // { pts, w? } incised on the plateau
    this.cuts = [] // shapes cut into bosses (pupils)
    this.ground = [] // { pts, w? } incised in the ground (blade borders in flush mode…)
  }
  P(pts) { return this.f.pts(this.amp ? wobble(pts, this.rng, this.amp) : pts) }
  u(v) { return v * this.f.unit }
  /** constant band along a centre line; w in local units; cap 'round'|'flat'|'square' */
  band(pts, w, cap = 'round') {
    if (pts.length > 1) this.plateau.push({ kind: 'band', pts: this.P(pts), w: this.u(w), cap })
    return this
  }
  /** tapered band w0 → w1 (a hook, a quill, a claw) */
  taper(pts, w0, w1, from = 0) {
    const a = this.u(w0), b = this.u(w1)
    if (pts.length > 1) this.plateau.push({ kind: 'band', pts: this.P(pts), w: (t) => (t < from ? a : a + (b - a) * ((t - from) / (1 - from))) })
    return this
  }
  poly(pts) { this.plateau.push({ kind: 'poly', pts: this.f.pts(pts) }); return this }
  circle(c, r) { this.plateau.push({ kind: 'circle', c: this.f.map(c), r: this.u(r) }); return this }
  rrect(c, w, h, r) { this.plateau.push(this._rrect(c, w, h, r)); return this }
  hole(shape) { this.holes.push(shape); return this }
  _rrect(c, w, h, r) {
    const swap = this.f.rot !== 0
    return { kind: 'rrect', c: this.f.map(c), w: this.u(swap ? h : w), h: this.u(swap ? w : h), r: this.u(r) }
  }
  _ellipse(c, rx, ry) {
    const swap = this.f.rot !== 0
    return { kind: 'ellipse', c: this.f.map(c), rx: this.u(swap ? ry : rx), ry: this.u(swap ? rx : ry), rot: 0 }
  }
  /** an L2 dome: kind 'round' | 'square' | 'oval'; base 'plateau' | 'ground' */
  boss(c, r, { kind = 'round', base = 'plateau', pupil = 'none', aspect = 1.35 } = {}) {
    const shape = kind === 'square' ? this._rrect(c, r * 2 * 1.08, r * 2, r * 0.55)
      : kind === 'oval' ? this._ellipse(c, r * aspect, r)
      : { kind: 'circle', c: this.f.map(c), r: this.u(r) }
    this.bosses.push({ shape, r: this.u(r), base })
    if (pupil === 'slit') {
      const L = r * 0.95
      this.cuts.push({ kind: 'band', pts: this.f.pts([[c[0] - L / 2, c[1]], [c[0] + L / 2, c[1]]]), w: Math.max(0.3, this.u(r * 0.16)), cap: 'round' })
    } else if (pupil === 'dot') {
      this.cuts.push({ kind: 'circle', c: this.f.map(c), r: Math.max(0.25, this.u(r * 0.3)) })
    } else if (pupil === 'ring') {
      this.ringCuts = this.ringCuts || []
      this.ringCuts.push({ c: this.f.map(c), r: this.u(r * 0.62) })
    }
    return this
  }
  /** an incised line on the plateau (w in mm, default the line weight) */
  line(pts, w) { if (pts.length > 1) this.lines.push({ pts: this.P(pts), w }); return this }
  /** an incised line in the ground (blade contour lines, flush outlines) */
  groundLine(pts, w) { if (pts.length > 1) this.ground.push({ pts: this.P(pts), w }); return this }
}

/** Paint function for the union of a sheet's plateau (minus holes), clipped. */
export function plateauPaint(sheet, clip) {
  return (ctx) => {
    ctx.save()
    if (clip) { clip(ctx); ctx.clip() }
    for (const s of sheet.plateau) drawShape(ctx, s)
    if (sheet.holes.length) {
      ctx.globalCompositeOperation = 'destination-out'
      for (const s of sheet.holes) drawShape(ctx, s)
      ctx.globalCompositeOperation = 'source-over'
    }
    ctx.restore()
  }
}

export const rectClip = (r) => (ctx) => {
  ctx.beginPath()
  ctx.rect(r.x, r.y, r.w, r.h)
}

const grooveX = (x, hw) => (Math.abs(x) >= hw ? 0 : Math.sqrt(1 - (x / hw) * (x / hw)))

/**
 * Sheet → panel. p: resolved params with style, carving, lineWeight,
 * echoInset, relief {motif, boss, groove}. clip(ctx) builds a clip path.
 */
export function renderSheet(panel, sheet, p, { clip, echo = true } = {}) {
  const flush = p.style === 'flush'
  const lvl = p.relief
  const lw = p.lineWeight
  const motifH = flush ? FLUSH_LIFT : lvl.motif
  const carving = p.carving || 'dense'
  const paint = plateauPaint(sheet, clip)
  const withClip = (fn) => (ctx) => {
    ctx.save()
    if (clip) { clip(ctx); ctx.clip() }
    fn(ctx)
    ctx.restore()
  }

  if (sheet.plateau.length) {
    const shoulder = flush ? 0.08 : Math.max(0.2, Math.min(0.55, motifH * 0.4))
    panel.raise(paint, { height: motifH, shoulder, profile: 'plateau' })

    const e = p.echoInset ?? 1.2
    const ghw = lw / 2
    if (echo) {
      if (flush) {
        panel.sink(paint, { depth: lvl.groove, profile: (s) => grooveX(s - ghw * 1.1, ghw) })
      } else if (carving === 'dense') {
        const e2 = e + Math.max(lw * 2.6, 1.5)
        panel.sink(paint, { depth: lvl.groove, profile: (s) => Math.max(grooveX(s - e, ghw), grooveX(s - e2, ghw)) })
      } else if (carving === 'sparse') {
        panel.sink(paint, { depth: lvl.groove * 0.8, profile: (s) => grooveX(s - e, ghw) })
      }
    }
  }

  if (sheet.lines.length && carving !== 'none') {
    panel.sink(withClip((ctx) => { for (const l of sheet.lines) strokeLine(ctx, l.pts, l.w ?? lw) }), { depth: lvl.groove, shoulder: lw / 2, profile: 'u' })
  }
  if (sheet.ground.length) {
    panel.sink(withClip((ctx) => { for (const l of sheet.ground) strokeLine(ctx, l.pts, l.w ?? lw) }), { depth: lvl.groove, shoulder: lw / 2, profile: 'u' })
  }

  for (const b of sheet.bosses) {
    const r = Math.max(0.5, b.r)
    const base = b.base === 'plateau' ? Math.min(0.95, motifH / Math.max(lvl.boss, 1e-3)) : 0.25
    const Hb = flush ? Math.max(lvl.boss, motifH) : Math.max(lvl.boss, motifH * 1.2)
    const wall = Math.max(0.3, Math.min(0.6, r * 0.12))
    panel.raise((ctx) => drawShape(ctx, b.shape), {
      height: Hb,
      shoulder: r,
      profile: (s, w) => {
        if (s <= 0) return 0
        const t = Math.min(1, s / w)
        return PROFILES.plateau(s, wall) * (base + (1 - base) * Math.sqrt(1 - (1 - t) * (1 - t)))
      },
    })
  }
  if (sheet.cuts.length || sheet.ringCuts?.length) {
    panel.sink((ctx) => {
      for (const c of sheet.cuts) drawShape(ctx, c)
      for (const rc of sheet.ringCuts || []) {
        ctx.lineWidth = lw
        ctx.beginPath()
        ctx.arc(rc.c[0], rc.c[1], rc.r, 0, Math.PI * 2)
        ctx.stroke()
      }
    }, { depth: lvl.groove * 1.4, shoulder: lw * 0.45, profile: 'u' })
  }
  return sheet
}
