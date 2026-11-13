// Taotie components, each its own function (research/01 §2.3–2.13).
//
// Every part has the signature  part(C, opts?)  and pushes geometry into the
// Sheet C.sheet, in CREATURE SPACE (see shapes.halfMaskFrame): origin at the
// bottom of the central axis, x outward in mm, y up in mm — a right half that
// the renderer mirrors onto the panel's left half. Anchors are given in the
// frame's units: x in face units (× s × spread), y as a fraction of the panel
// height; sizes in face-module units (× s). `opts` overrides any default the
// part reads from C.p, so an artifact author can place a single component by
// hand:
//
//   const C = taotieContext(panel, rect, params)
//   taotieParts.eye(C, { at: [0.3, 0.48], eye: 'oval' })
//   taotieParts.horn(C, { horn: 'buffalo', size: 1.2 })
//   renderTaotie(panel, C)
//
// Parts record a few landmarks in C.marks (eye centre/top, horn root …) that
// later parts read, so calling them in the natural order (face from the
// bottom up, then body) gives the best fit.

import {
  Turtle, band, poly, circle, ellipse, rrect, lens, spline, arcPts, cScroll, hookSpine, fillet, resample,
  wobble, taper, tail, subPath, polyLength, halfMaskFrame,
} from '../../shapes.js'

// ------------------------------------------------------------------ sheet

/** The geometry a mask is made of, before it touches the panel. */
export class Sheet {
  constructor() {
    this.islands = [] // { id, shapes: [shape] } — L1 plateau, one island per component
    this.bosses = [] // { shape, base: 'plateau' | 'ground', r } — L2 domes
    this.tips = [] // { shape, lift: 0..1 } — high-relief horn tips (V-b)
    this.grooves = [] // { pts, w? } — incised lines on the plateau
    this.cuts = [] // shapes cut in (pupil slits, dots)
    this.centres = [] // { pts, w, mode } — candidate centre-line grooves (renderer decides by band width)
  }
  island(id) {
    let i = this.islands.find((x) => x.id === id)
    if (!i) this.islands.push((i = { id, shapes: [] }))
    return i
  }
  add(id, shape) {
    this.island(id).shapes.push(shape)
    return shape
  }
}

// ------------------------------------------------------------------ context

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const lerp = (a, b, t) => a + (b - a) * t

/**
 * Everything a part needs: frame, params, seeded jitter, band widths.
 * @returns C = { f, p, sheet, rng, s, bw, lw, marks, A(x,y), u(v), rc(w), wob(pts), … }
 */
export function taotieContext(panel, rect, p) {
  const edgeW = p.edge && p.edge !== 'none' ? 0.2 : 0
  const f = halfMaskFrame(rect, { faceW: 0.66, spread: p.spread ?? 1, reserve: edgeW, invert: !!p.invert, taper: p.taper || 0 })
  const seedLabel = `taotie:${p.seed ?? 0}:${rect.x.toFixed(1)},${rect.y.toFixed(1)}`
  const rng = panel.rng.fork(seedLabel)
  const irr = p.irregularity ?? 1
  const lw = p.lineWeight
  const minBand = Math.max(3.2 * lw, 2.2)
  const C = {
    f,
    p,
    rng,
    panel,
    rect,
    sheet: new Sheet(),
    s: f.s,
    H: f.H,
    lw,
    irr,
    edgeW: edgeW * f.s,
    marks: {},
    dissolved: p.body === 'dissolved',
    sq: clamp(p.square ?? 0.5, 0, 1),
    u: (v) => v * f.s,
    /** base face band width (mm): ~0.068 s, never thinner than the line work can carve */
    bw: Math.max(f.s * 0.068 * (p.bandWidth ?? 1), minBand),
    /** jittered anchor: x face units, y fraction of H (research/01 §8.1: ±0.01–0.02) */
    A(x, y, j = 0.008) {
      return [f.X(x + rng.jitter(j * irr)), f.Y(y + rng.jitter(j * irr * 0.8))]
    },
    /** corner radius for a band of width w: squared-round (0.45 w) → round (≥ 2.5 w) */
    rc(w, round = 2.6) {
      return lerp(w * round, w * 0.42, C.sq)
    },
    /** spiral/curl corner radius: round curls take the whole segment */
    rcurl(w) {
      return C.sq > 0.85 ? w * 0.45 : lerp(w * 9, w * 0.45, C.sq * C.sq)
    },
    wob(pts, amp = 0.08) {
      return wobble(pts, rng, amp * irr, Math.max(6, f.s * 0.12))
    },
    /** width with ±3 % hand variation */
    wj(w) {
      return w * (1 + rng.jitter(0.03 * irr))
    },
    /** a plateau band on island `id` */
    band(id, pts, w, capA = 'square', capB = 'square', { centre = true } = {}) {
      const P = C.wob(pts)
      const W = typeof w === 'number' ? C.wj(w) : w
      C.sheet.add(id, band(P, W, capA, capB))
      if (centre) C.sheet.centres.push({ pts: P, w: typeof W === 'number' ? W : W(0.3) })
      return P
    },
    /** x extent available (mm, creature space). Parts are laid out before the taper warp, so it is the full half width. */
    xmax() {
      return f.hw
    },
  }
  C.ext = Math.max(C.u(0.06), (p.echoInset ?? 1.4) + 2 * lw + 1) // how far axis parts reach across (mirror overwrites it)
  return C
}

// ------------------------------------------------------------------ helpers

/** Where the creature's y bands sit (fractions of H), adapted to the jaw / body configuration. */
function levels(C) {
  const p = C.p
  const split = p.jaw === 'split'
  return {
    lip: split ? 0.21 : 0.15,
    nostril: split ? 0.32 : 0.28,
    eye: p.eyeY ?? 0.5,
    hornRoot: 0.735,
    top: 0.955,
  }
}

const pick = (o, k, C) => (o && o[k] !== undefined ? o[k] : C.p[k])

// ------------------------------------------------------------------ nose / crest

/** §2.3 Nose ridge on the axis. nose: 'ridge' (grooved, ladder ticks) | 'plain' | 'flange' (plain slot a flange sits on) | 'stack' (column of small hooked units) | 'none' */
export function nose(C, o = {}) {
  const kind = pick(o, 'nose', C)
  if (kind === 'none') return
  const L = levels(C)
  const nw = (o.width ?? 0.8) * C.bw
  const y0 = C.f.Y(o.from ?? L.nostril - 0.035)
  const y1 = C.marks.crestBottom ?? C.f.Y(o.to ?? 0.8)
  C.marks.noseHalf = nw
  if (kind === 'stack') {
    const unit = C.u(0.12)
    const n = Math.max(2, Math.round((y1 - y0) / unit))
    const h = (y1 - y0) / n
    for (let i = 0; i < n; i++) {
      const yb = y0 + i * h + h * 0.12, yt = y0 + (i + 1) * h - h * 0.12
      // an inverted mini T-hook: bar at the top with down-curled end, short stem
      const t = new Turtle([-C.ext, yt - C.bw * 0.4], 0).to([nw * 1.1, yt - C.bw * 0.4]).turn(-90, C.rc(C.bw * 0.6)).fwd(Math.max(1, yt - yb - C.bw * 0.8))
      C.band('nose' + (C.dissolved ? i : ''), t.spine(), C.bw * 0.6, 'flat', 'square', { centre: false })
    }
    return
  }
  const pts = fillet(
    [[-C.ext, y0], [nw * 1.12, y0], [nw, y0 + (y1 - y0) * 0.25], [nw * 0.96, y1], [-C.ext, y1]],
    [0, C.rc(nw * 0.6), C.rc(nw), 0, 0],
    { closed: true },
  )
  C.sheet.add('nose', poly(C.wob(pts, 0.05)))
  if (kind === 'ridge' && C.p.carving === 'dense') {
    // horizontal "ladder" ticks between the axis and the contour echo
    const step = Math.max(C.lw * 4.5, C.u(0.045))
    const xIn = nw - (C.p.echoInset ?? 1.4) - C.lw * 1.2
    if (xIn > C.lw * 2) {
      for (let y = y0 + step; y < y1 - step * 0.6; y += step) C.sheet.grooves.push({ pts: [[-C.lw, y], [xIn, y]] })
    }
  }
}

/** §2.11 Forehead crest on the axis. crest: 'lozenge' | 'shield' | 'cicada' | 'hooks' | 'none' (true → lozenge) */
export function crest(C, o = {}) {
  let kind = pick(o, 'crest', C)
  if (kind === true) kind = 'lozenge'
  if (!kind || kind === 'none') return
  const yc = C.f.Y(o.y ?? 0.83)
  const hw = C.u(0.075) * (o.size ?? 1)
  const hh = C.u(0.085) * (o.size ?? 1)
  if (kind === 'lozenge') {
    const pts = fillet([[0, yc - hh], [hw, yc], [0, yc + hh], [-hw, yc]], C.rc(C.bw * 0.5, 1), { closed: true })
    C.sheet.add('crest', poly(C.wob(pts, 0.04)))
    // inner sunk diamond
    const k = 0.42
    if (C.p.carving !== 'none') C.sheet.grooves.push({ pts: [[-C.lw, yc - hh * k], [hw * k, yc], [-C.lw, yc + hh * k]] })
    C.marks.crestBottom = yc - hh * 0.55
  } else if (kind === 'shield') {
    const pts = fillet([[-C.ext, yc + hh], [hw * 1.15, yc + hh], [hw * 0.55, yc - hh], [-C.ext, yc - hh]], [0, C.rc(C.bw * 0.5), C.rc(C.bw * 0.6), 0], { closed: true })
    C.sheet.add('crest', poly(C.wob(pts, 0.04)))
    if (C.p.carving !== 'none') C.sheet.grooves.push({ pts: [[0, yc - hh * 0.4], [0, yc + hh * 0.5]] })
    C.marks.crestBottom = yc - hh * 0.8
  } else if (kind === 'cicada') {
    // a small inverted cicada: broad head up, body tapering down the nose
    const pts = fillet([[-C.ext, yc + hh], [hw * 1.1, yc + hh], [hw * 0.35, yc - hh * 1.3], [-C.ext, yc - hh * 1.3]], [0, C.rc(C.bw * 0.4), C.rc(C.bw * 0.3), 0], { closed: true })
    C.sheet.add('crest', poly(pts))
    C.sheet.bosses.push({ shape: circle([hw * 0.6, yc + hh * 0.45], hw * 0.26), base: 'plateau' })
    for (let i = 1; i <= 3; i++) {
      const y = yc + hh * 0.2 - i * hh * 0.42
      C.sheet.grooves.push({ pts: [[-C.lw, y - hh * 0.18], [hw * (0.75 - i * 0.12), y]] })
    }
    C.marks.crestBottom = yc - hh
  } else if (kind === 'hooks') {
    const y0 = C.f.Y(0.74), y1 = C.f.Y(0.985)
    C.sheet.add('crest', poly([[-C.ext, y0], [C.bw * 0.45, y0], [C.bw * 0.45, y1], [-C.ext, y1]]))
    const n = Math.max(2, Math.round((y1 - y0) / C.u(0.08)))
    for (let i = 0; i < n; i++) {
      const y = y0 + ((i + 0.6) / n) * (y1 - y0)
      C.band('crest', hookSpine([C.bw * 0.3, y], 0, C.bw * 0.6, { curl: 120, radius: C.bw * 0.45, dir: -1 }), C.bw * 0.55, 'flat', 'round', { centre: false })
    }
    C.marks.crestBottom = y0
  }
}

// ------------------------------------------------------------------ snout / mouth

/** §2.4 Nostril scrolls. nostril: 'scroll' (band out, curling up and back to the axis) | 'bulb' (V-b oval boss with down-hook) | 'none' */
export function nostril(C, o = {}) {
  const kind = pick(o, 'nostril', C)
  if (kind === 'none') return
  const L = levels(C)
  const y = C.f.Y(o.y ?? L.nostril)
  const w = C.bw * (o.width ?? 1)
  const x0 = C.dissolved ? (C.marks.noseHalf ?? C.bw) + C.u(0.035) : 0
  if (kind === 'bulb') {
    C.sheet.add('nostril', ellipse([C.u(0.04), y + C.u(0.01)], C.u(0.085), C.u(0.05)))
    C.band('nostril', hookSpine([C.u(0.11), y], -90, C.u(0.02), { curl: 140, radius: C.u(0.03), dir: -1 }), w * 0.8, 'square', 'round', { centre: false })
    return
  }
  const xm = C.f.X(o.reach ?? 0.16)
  const a = clamp(C.u(0.085), w * 1.4, C.f.Y(0.42) - y)
  const t = new Turtle([x0, y], 0).to([xm, y]).curl({ dir: 1, size: [a, Math.max(w * 1.6, xm - x0 - w * 0.9)], pitch: w * 1.55, turns: 0.85, r: C.rcurl(w) })
  C.band('nostril', t.spine(), w, 'flat', 'square')
}

/** §2.5–2.7 Upper lip / jaw. jaw: 'hooked' | 'double' (extra up-scroll at the mouth corner) | 'split' (+ lower jaw) | 'fanged' (+ fangs) | 'none' */
export function jaw(C, o = {}) {
  const kind = pick(o, 'jaw', C)
  if (kind === 'none') return
  const L = levels(C)
  const y = C.f.Y(o.y ?? L.lip)
  const w = C.bw * (o.width ?? 1.05)
  const xm = C.f.X(o.corner ?? 0.38)
  const x0 = C.dissolved ? (C.marks.noseHalf ?? C.bw) + C.u(0.03) : 0
  const down = clamp(C.u(0.1), w * 1.2, y - w * 0.55)
  const t = new Turtle([x0, y], 0).to([xm, y]).curl({ dir: -1, size: [down, Math.min(C.u(0.17), xm - x0 - w)], pitch: w * 1.55, turns: 0.85, r: C.rcurl(w) })
  C.band('lip', t.spine(), w, 'flat', 'square')
  C.marks.mouthCorner = [xm, y]
  if (kind === 'double') {
    const base = [xm - C.u(0.05), y + w * 0.4]
    C.band('lip2', hookSpine(base, 90, C.u(0.035), { curl: 200, radius: C.u(0.032), dir: -1 }), w * 0.8, 'flat', 'round', { centre: false })
  }
  if (kind === 'split') lowerJaw(C, o)
  if (kind === 'fanged') fangs(C, o)
}

/** §2.6 Fangs hanging from the lip: inner fang near the nose, outer canine at the mouth corner. count 1–2. */
export function fangs(C, o = {}) {
  const L = levels(C)
  const y = C.f.Y(o.y ?? L.lip) - C.bw * 0.45
  const n = o.count ?? 2
  const w = C.bw * 1.0
  const inner = hookSpine([C.f.X(0.14), y], -90, Math.max(1, C.u(0.06)), { curl: 45, radius: C.u(0.04), dir: -1 })
  C.band('lip', inner, taper(w, w * 0.18), 'flat', 'point', { centre: false })
  if (n > 1) {
    const outer = hookSpine([C.f.X(0.3), y], -98, Math.max(1, C.u(0.08)), { curl: 35, radius: C.u(0.06), dir: 1 })
    C.band('lip', outer, taper(w * 1.15, w * 0.18), 'flat', 'point', { centre: false })
  }
}

/** §2.7 Lower jaw: a band near the panel bottom ending in an upward hook (and an upward fang). */
export function lowerJaw(C, o = {}) {
  const w = C.bw * 0.9
  const y = Math.max(w * 0.6, C.f.Y(o.lowerY ?? 0.055))
  const x0 = C.dissolved ? C.u(0.06) : -C.ext
  const t = new Turtle([x0, y], 0).to([C.f.X(0.3), y]).curl({ dir: 1, size: [C.u(0.07), C.u(0.08)], pitch: w * 1.5, turns: 0.6, r: C.rcurl(w) })
  C.band('jaw', t.spine(), w, 'flat', 'square')
  C.band('jaw', hookSpine([C.f.X(0.15), y + w * 0.4], 90, C.u(0.035), { curl: 30, radius: C.u(0.05), dir: -1 }), taper(w, w * 0.2), 'flat', 'point', { centre: false })
}

// ------------------------------------------------------------------ eye / brow

/**
 * §2.8 Eye. eye: 'chen' (臣: almond, inner canthus hooking down to the nose, outer tail) | 'oval' | 'round' | 'square' (rounded-square boss, fangyi)
 * opts: at [x, y], size (× eyeSize), pupil 'slit' | 'dot' | 'ring' | 'none', tilt (deg)
 */
export function eye(C, o = {}) {
  const kind = pick(o, 'eye', C)
  const L = levels(C)
  const es = o.size ?? C.p.eyeSize
  const [ex, ey] = o.at ?? [C.p.eyeX ?? 0.27, L.eye]
  const E = C.A(ex, ey, 0.004)
  const pupil = pick(o, 'pupil', C)
  const w = C.bw * 0.95
  let rp // pupil boss radius
  if (kind === 'chen') {
    const La = C.u(0.27) * es, Ha = C.u(0.13) * es
    const tilt = o.tilt ?? 8
    const al = lens(E, La, Ha, tilt)
    C.sheet.add('eye', poly(al))
    const rad = (tilt * Math.PI) / 180
    const inner = [E[0] - Math.cos(rad) * La * 0.47, E[1] - Math.sin(rad) * La * 0.47]
    const outer = [E[0] + Math.cos(rad) * La * 0.47, E[1] + Math.sin(rad) * La * 0.47]
    // inner canthus: toward the axis, then the diagnostic down-hook
    const xh = Math.max(C.f.X(0.085), (C.marks.noseHalf ?? 0) + w * 0.8 + (C.dissolved ? C.u(0.035) : 0))
    const drop = Math.max(w * 1.2, Math.min(C.u(0.11), inner[1] - C.f.Y(0.37)))
    const tin = new Turtle(inner, 180).to([xh, inner[1] - Math.tan(rad) * (inner[0] - xh) * 0.3]).turn(105, C.rc(w)).fwd(drop).turn(40, C.rc(w * 0.6)).fwd(w * 0.5)
    C.band('eye', tin.spine(), w, 'flat', 'square')
    // outer tail, ending in a small down-hook
    const tout = new Turtle(outer, tilt * 0.6).fwd(C.u(0.08) * es).turn(-95, C.rc(w * 0.8)).fwd(w * 0.7)
    C.band('eye', tout.spine(), w * 0.88, 'flat', 'square')
    rp = C.u(0.054) * es
    C.sheet.bosses.push({ shape: circle(E, rp), base: 'plateau', r: rp })
    C.marks.eyeTop = E[1] + Ha * 0.5
    C.marks.eyeOuter = outer[0] + C.u(0.08) * es
  } else if (kind === 'square') {
    const bw = C.u(0.2) * es, bh = C.u(0.155) * es
    const r = Math.min(bw, bh) * 0.32
    C.sheet.bosses.push({ shape: rrect(E, bw, bh, r, 0), base: 'ground', r: Math.min(bw, bh) * 0.5 })
    // the boss sits in a socket of plateau that reads as a raised frame
    C.sheet.add('eye', rrect(E, bw + w * 0.9, bh + w * 0.9, r + w * 0.45, 0))
    rp = bh * 0.42
    C.marks.eyeTop = E[1] + bh * 0.5 + w * 0.45
    C.marks.eyeOuter = E[0] + bw * 0.5
    if (pupil === 'slit') C.sheet.cuts.push(rrect(E, bw * 0.42, Math.max(C.lw * 1.3, bh * 0.1), C.lw * 0.6))
    else if (pupil === 'dot') C.sheet.cuts.push(circle(E, Math.max(C.lw, bh * 0.12)))
    return E
  } else {
    const oval = kind === 'oval'
    const rx = C.u(oval ? 0.125 : 0.105) * es, ry = C.u(oval ? 0.09 : 0.105) * es
    C.sheet.add('eye', ellipse(E, rx, ry, oval ? 6 : 0))
    const bx = rx - w * 0.75, by = ry - w * 0.75
    C.sheet.bosses.push({ shape: ellipse(E, Math.max(bx, rx * 0.55), Math.max(by, ry * 0.55), oval ? 6 : 0), base: 'plateau', r: Math.max(by, ry * 0.55) })
    rp = Math.min(Math.max(bx, rx * 0.55), Math.max(by, ry * 0.55))
    // a short inner canthus hook keeps even a round eye Shang
    if (o.canthus ?? C.p.eye !== 'round') {
      const st = [E[0] - rx * 0.92, E[1] - ry * 0.2]
      const tin = new Turtle(st, 190).fwd(Math.max(w * 0.6, st[0] - Math.max(C.f.X(0.1), (C.marks.noseHalf ?? 0) + w))).turn(100, C.rc(w)).fwd(Math.max(w, C.u(0.06)))
      C.band('eye', tin.spine(), w * 0.9, 'flat', 'square')
    }
    C.marks.eyeTop = E[1] + ry
    C.marks.eyeOuter = E[0] + rx
  }
  // pupil
  if (pupil === 'slit') C.sheet.cuts.push(rrect(E, rp * 2.3, Math.max(C.lw * 1.25, rp * 0.18), C.lw * 0.6))
  else if (pupil === 'dot') C.sheet.cuts.push(circle(E, Math.max(C.lw * 0.9, rp * 0.3)))
  else if (pupil === 'ring') {
    C.sheet.grooves.push({ pts: arcPts(E, rp * 0.62, 0, 360), boss: true })
    C.sheet.cuts.push(circle(E, Math.max(C.lw * 0.8, rp * 0.18)))
  }
  C.marks.eye = E
  return E
}

/** §2.9 Brow. brow: 'band' (arched, down-hook) | 'hooked' (up-curl outside) | 'kui' (a tiny profile kui) | 'L' (inverted L by the axis, fangyi) | 'none' */
export function brow(C, o = {}) {
  const kind = pick(o, 'brow', C)
  if (!kind || kind === 'none') return
  const w = C.bw * 0.78
  const yb = Math.max(C.f.Y(o.y ?? 0.685), (C.marks.eyeTop ?? 0) + w * 1.15 + (C.dissolved ? C.u(0.02) : 0))
  const x0 = Math.max(C.f.X(0.09), (C.marks.noseHalf ?? 0) + (C.dissolved ? C.u(0.04) : w * 0.2))
  const x1 = C.f.X(o.reach ?? 0.42)
  if (kind === 'L') {
    const t = new Turtle([x0, yb + w * 0.3], 0).to([C.f.X(0.24), yb + w * 0.3]).turn(-90, C.rc(w)).fwd(Math.max(w, yb - (C.marks.eyeTop ?? yb) - w * 0.2))
    C.band('brow', t.spine(), w, 'square', 'square')
  } else {
    const t = new Turtle([x0, yb], 8).to([lerp(x0, x1, 0.55), yb + C.u(0.02)], 0).to([x1, yb + C.u(0.012)], C.rc(w))
    if (kind === 'hooked') t.curl({ dir: 1, size: [C.u(0.05), C.u(0.05)], pitch: w * 1.5, turns: 0.6, r: C.rcurl(w) })
    else t.turn(-90, C.rc(w)).fwd(C.u(0.04))
    C.band('brow', t.spine(), w, 'square', 'square')
    if (kind === 'kui') {
      C.sheet.bosses.push({ shape: circle([x0 + w * 1.4, yb], w * 0.42), base: 'plateau', r: w * 0.42 })
      C.band('brow', hookSpine([x0, yb - w * 0.2], 200, w * 0.4, { curl: 90, radius: w * 0.5, dir: 1 }), w * 0.6, 'flat', 'round', { centre: false })
    }
  }
  C.marks.browTop = yb + w * 0.6
}

// ------------------------------------------------------------------ horns (§2.10)

/**
 * Horn — the full catalogue. horn: 'c' (H1 outward-curled) | 'ram' (H2 inward-curled) | 'buffalo' (H3) | 'bottle' (H4)
 * | 't' (H5 mushroom) | 'kui' (H6 kui-dragon horn) | 'coiled' (H7 serpent) | 'knob' (H8) | 'antler' (H9) | 'zigzag' (H10)
 * | 'leaf' (H11) | 'none'. opts: size (× hornSize), root [x, y], width (× band)
 */
export function horn(C, o = {}) {
  const kind = pick(o, 'horn', C)
  if (!kind || kind === 'none') return
  const fn = HORNS[kind] || HORNS.c
  const hs = o.size ?? C.p.hornSize ?? 1
  const rootY = Math.max(C.f.Y(levels(C).hornRoot), (C.marks.browTop ?? 0) + C.bw * 0.25 + (C.dissolved ? C.u(0.03) : 0), (C.marks.eyeTop ?? 0) + C.bw * 0.9)
  const xr = o.rootX ?? (kind === 'bottle' || kind === 'knob' || kind === 't' ? 0.17 : 0.11)
  const root = o.root ? C.A(o.root[0], o.root[1], 0.004) : [Math.max(C.f.X(xr), C.dissolved ? (C.marks.noseHalf ?? 0) + C.u(0.05) : 0), rootY]
  const top = Math.min(C.f.Y(0.985), C.H - C.bw * 0.15) // horn band top edge
  const w = C.bw * (o.width ?? 1.3)
  const P = fn(C, { root, top, w, hs, o })
  if (P && C.p.hornTip > 0) C.sheet.tips.push({ shape: band(subPath(P, polyLength(P) * 0.55, polyLength(P)), w * 0.9, 'round', 'round'), lift: C.p.hornTip })
}

const HORNS = {
  // H1: up from the root, over the top, down the outer side, the tip curling OUTWARD
  c(C, { root, top, w, hs }) {
    const yT = top - w / 2
    const xo = Math.min(C.f.X(0.46 * hs), C.xmax(yT) - w * 1.6)
    const t = new Turtle(root, 72).to([C.f.X(0.17), yT]).to([xo, yT], C.rc(w, 3)).turn(-90, C.rc(w))
    t.fwd(Math.max(w * 0.6, yT - C.f.Y(0.82) - w)).curl({ dir: 1, size: [C.u(0.07), C.u(0.08)], pitch: w * 1.5, turns: 0.9, r: C.rcurl(w) })
    return C.band('horn', t.spine(), tail(w, 0.25, 0.75), 'flat', 'square')
  },
  // H2: up, over, down the outer side, curling back IN toward the axis (the big squared horn of fangyi / zun)
  ram(C, { root, top, w, hs }) {
    const yT = top - w / 2
    const xo = Math.min(C.f.X(0.5 * hs), C.xmax(yT) - w * 0.7)
    const yb = Math.max(root[1] - w * 0.2, C.f.Y(0.73))
    const t = new Turtle(root, 85).to([root[0] + w * 0.1, yT]).to([xo, yT], C.rc(w, 2)).turn(-90, C.rc(w))
    t.fwd(Math.max(w, yT - yb)).curl({ dir: -1, size: [Math.max(w * 2.2, xo - root[0] - w * 2.4), Math.max(w * 1.6, (yT - yb) * 0.62)], pitch: w * 1.5, turns: 1.1, r: C.rcurl(w) })
    return C.band('horn', t.spine(), tail(w, 0.3, 0.8), 'flat', 'square')
  },
  // H3: a heavy crescent sweeping up and out to a point, tip turning back
  buffalo(C, { root, top, w, hs }) {
    const pts = spline([
      [root[0] - w * 0.4, root[1]], C.A(0.3, 0.775), C.A(0.5 * hs, 0.84), [Math.min(C.f.X(0.64 * hs), C.xmax(top) - w), top - w * 0.6], [Math.min(C.f.X(0.58 * hs), C.xmax(top) - w * 1.6), top - w * 0.15],
    ])
    const P = C.band('horn', pts, taper(w * 1.55, w * 0.15), 'flat', 'point')
    return P
  },
  // H4: a vertical bottle — narrow neck at the root, swelling body, small cap
  bottle(C, { root, top, w, hs }) {
    const x = root[0], y0 = root[1] - w * 0.2, y1 = top
    const h = y1 - y0
    const neck = C.u(0.03) * hs, belly = C.u(0.07) * hs
    const lean = C.u(0.015)
    const prof = [[0, neck], [0.22, neck], [0.45, belly * 0.95], [0.7, belly], [0.88, belly * 0.75], [1, belly * 0.35]]
    const right = prof.map(([t, r]) => [x + r + lean * t, y0 + t * h])
    const left = prof.map(([t, r]) => [x - r + lean * t, y0 + t * h]).reverse()
    const pts = fillet([...right, ...left], C.rc(w * 0.5, 2), { closed: true })
    C.sheet.add('horn', poly(C.wob(pts, 0.05)))
    if (C.p.carving !== 'none') C.sheet.centres.push({ pts: [[x, y0 + h * 0.25], [x + lean * 0.8, y0 + h * 0.85]], w: belly * 2, force: true })
    return [[x, y0], [x + lean, y1]]
  },
  // H5: stem with a horizontal cap whose ends curl down
  t(C, { root, top, w, hs }) {
    const x = root[0]
    const capW = C.u(0.22) * hs, capH = Math.max(C.bw * 0.85, C.u(0.06))
    const yc = top - capH / 2
    C.band('horn', [[x, root[1]], [x, yc]], C.bw * 0.75, 'flat', 'flat', { centre: false })
    for (const d of [-1, 1]) {
      const s = new Turtle([x, yc], d > 0 ? 0 : 180).fwd(capW / 2 - capH * 0.4).turn(d > 0 ? -90 : 90, C.rc(capH, 1.4)).fwd(capH * 0.9).turn(d > 0 ? -90 : 90, C.rc(capH * 0.6, 1)).fwd(capH * 0.35)
      C.band('horn', s.spine(), capH, 'flat', 'square', { centre: d > 0 })
    }
    return null
  },
  // H6: a small profile kui lying along the top, head toward the axis
  kui(C, { root, top, w, hs }) {
    const y = top - w * 0.55
    const x0 = root[0] + w * 0.3
    const x1 = Math.min(C.f.X(0.72 * hs), C.xmax(y) - w * 1.2)
    const bodyW = w * 0.75
    const t = new Turtle([x0, y], 0).to([x1, y]).curl({ dir: 1, size: [w * 1.5, w * 1.6], pitch: bodyW * 1.5, turns: 0.75, r: C.rcurl(bodyW) })
    C.band('horn', t.spine(), bodyW, 'square', 'square')
    // head: a blunt block at the front with an eye and an up-curled snout
    C.sheet.add('horn', rrect([x0 + w * 0.2, y - w * 0.15], w * 1.6, w * 1.3, w * 0.35))
    C.sheet.bosses.push({ shape: circle([x0 + w * 0.35, y], w * 0.32), base: 'plateau', r: w * 0.32 })
    C.band('horn', hookSpine([x0 - w * 0.5, y - w * 0.5], 180, w * 0.4, { curl: 140, radius: w * 0.45, dir: -1 }), bodyW * 0.8, 'flat', 'round', { centre: false })
    // stalk joining the root
    C.band('horn', [root, [x0 + w * 0.2, y - w * 0.5]], bodyW, 'flat', 'flat', { centre: false })
    return null
  },
  // H7: a serpent coil — two turns above the eye
  coiled(C, { root, top, w, hs }) {
    const R = Math.min(C.u(0.17) * hs, (top - root[1]) * 0.75)
    const t = new Turtle(root, 80).fwd(Math.max(w, top - root[1] - R * 1.1 - w * 0.5)).turn(-80, C.rc(w)).curl({ dir: -1, size: [R * 1.7, R * 1.4], pitch: w * 1.45, turns: 1.9, r: C.rcurl(w) })
    return C.band('horn', t.spine(), tail(w * 0.9, 0.4, 0.6), 'flat', 'round')
  },
  // H8: giraffe ossicone — a post with a round knob
  knob(C, { root, top, w, hs }) {
    const r = C.u(0.048) * hs
    const yk = top - r
    C.band('horn', [[root[0], root[1]], [root[0] + C.u(0.01), yk]], C.u(0.05), 'flat', 'flat', { centre: false })
    C.sheet.add('horn', circle([root[0] + C.u(0.01), yk], r))
    C.sheet.bosses.push({ shape: circle([root[0] + C.u(0.01), yk], r * 0.7), base: 'plateau', r: r * 0.7 })
    return null
  },
  // H9: a stem with 2–3 forward tines
  antler(C, { root, top, w, hs }) {
    const tip = [Math.min(C.f.X(0.4 * hs), C.xmax(top) - w), top - w * 0.4]
    const stem = spline([root, [lerp(root[0], tip[0], 0.35), lerp(root[1], tip[1], 0.6)], tip])
    C.band('horn', stem, taper(w, w * 0.5), 'flat', 'round')
    const L = polyLength(stem)
    for (const f of [0.38, 0.68]) {
      const q = subPath(stem, 0, L * f)
      const b = q[q.length - 1]
      C.band('horn', hookSpine(b, 125, C.u(0.06) * hs, { curl: 50, radius: C.u(0.04), dir: -1 }), taper(w * 0.7, w * 0.25), 'flat', 'point', { centre: false })
    }
    return stem
  },
  // H10: squared Z — out, up, out, down-hook
  zigzag(C, { root, top, w, hs }) {
    const yT = top - w / 2
    const xm = C.f.X(0.28 * hs), xo = Math.min(C.f.X(0.5 * hs), C.xmax(yT) - w)
    const t = new Turtle(root, 0).to([xm, root[1]]).to([xm, yT], C.rc(w)).to([xo, yT], C.rc(w)).turn(-90, C.rc(w)).fwd(C.u(0.06))
    return C.band('horn', t.spine(), w, 'flat', 'square')
  },
  // H11: a leaf / blade pointing up and out
  leaf(C, { root, top, w, hs }) {
    const tip = [Math.min(C.f.X(0.4 * hs), C.xmax(top) - w * 0.5), top - w * 0.2]
    const L = Math.hypot(tip[0] - root[0], tip[1] - root[1])
    const rot = (Math.atan2(tip[1] - root[1], tip[0] - root[0]) * 180) / Math.PI
    const c = [(root[0] + tip[0]) / 2, (root[1] + tip[1]) / 2]
    C.sheet.add('horn', poly(lens(c, L, Math.max(w * 1.4, L * 0.32), rot)))
    C.sheet.centres.push({ pts: [[lerp(root[0], tip[0], 0.15), lerp(root[1], tip[1], 0.15)], [lerp(root[0], tip[0], 0.8), lerp(root[1], tip[1], 0.8)]], w: w * 1.4, force: true })
    return null
  },
}
export const HORN_TYPES = Object.keys(HORNS)

// ------------------------------------------------------------------ ear

/** §2.12 Ear behind the eye. ear: 'leaf' (teardrop, point up-out) | 'c' (small C opening down) | 'none' (true → leaf) */
export function ear(C, o = {}) {
  let kind = pick(o, 'ear', C)
  if (kind === true) kind = 'leaf'
  if (!kind || kind === 'none') return
  const x0 = Math.max(C.f.X(0.44), (C.marks.eyeOuter ?? 0) + C.bw * (C.dissolved ? 1.2 : 0.3))
  const yb = C.f.Y(0.56)
  if (x0 > C.xmax(yb) - C.bw * 1.2) return
  if (kind === 'c') {
    const R = C.u(0.05)
    const c = [x0 + R, C.f.Y(0.64)]
    C.band('ear', cScroll(c, R, { start: 200, sweep: 250, dir: -1, shrink: 0.18 }), C.bw * 0.8, 'square', 'round')
    return
  }
  const tip = [Math.min(x0 + C.u(0.09), C.xmax(C.f.Y(0.74)) - C.bw * 0.4), C.f.Y(0.735)]
  const base = [x0, yb]
  const L = Math.hypot(tip[0] - base[0], tip[1] - base[1])
  const rot = (Math.atan2(tip[1] - base[1], tip[0] - base[0]) * 180) / Math.PI
  C.sheet.add('ear', poly(lens([(base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2], L, Math.max(C.bw * 1.2, C.u(0.075)), rot)))
  C.sheet.centres.push({ pts: [[lerp(base[0], tip[0], 0.2), lerp(base[1], tip[1], 0.2)], [lerp(base[0], tip[0], 0.75), lerp(base[1], tip[1], 0.75)]], w: C.u(0.075), force: true })
  C.marks.earOuter = Math.max(base[0], tip[0])
}

// ------------------------------------------------------------------ body (§2.13)

/** Region the body may use: from behind the face to the (tapered) outer edge. */
function bodySpan(C, y) {
  const x0 = Math.max(C.f.X(C.p.body === 'kui' ? 0.34 : 0.5), (C.marks.eyeOuter ?? 0) + C.bw * 0.6)
  const x1 = C.xmax(y) - C.edgeW - C.u(0.02)
  return [x0, x1]
}

/**
 * Body band + tail + quills + leg (the split-body / 連體 form). body: 'band' | 'kui' | 'dissolved' | 'none'.
 * tail: 'up' | 'down' | 'forked' | 'spiral'. Returns false if the panel left no room (then call ear()).
 */
export function body(C, o = {}) {
  const kind = pick(o, 'body', C)
  if (kind === 'none') return false
  const yc = C.f.Y(o.y ?? (kind === 'kui' ? 0.6 : 0.62))
  const [x0, x1] = bodySpan(C, yc)
  const wB = C.bw * (o.width ?? 1.55)
  if (x1 - x0 < C.u(0.26)) return false
  const tailKind = pick(o, 'tail', C)
  const tailR = Math.min(C.u(0.13), (C.H - yc) * 0.45)
  const xt = x1 - Math.max(wB * 1.6, tailR * 0.9)
  const segs = []
  if (kind === 'dissolved') {
    // the body broken into two segments that float on the ground
    const xm = lerp(x0, xt, 0.48)
    const g = C.u(0.035)
    const a = new Turtle([x0, yc], 0).to([xm - g, yc]).turn(-90, C.rc(wB)).fwd(wB * 0.8)
    C.band('body0', a.spine(), wB, 'square', 'square')
    segs.push(['body1', xm + g])
  } else segs.push(['body', x0])
  const [id, xs] = segs[0]
  const t = new Turtle([xs, yc], 0).to([xt, yc])
  if (tailKind === 'up' || tailKind === 'spiral') {
    const round = tailKind === 'spiral'
    t.curl({ dir: 1, size: [Math.min(tailR * 1.25, C.H - yc - wB * 0.7), Math.max(wB * 1.5, (x1 - xt) * 1.5)], pitch: wB * 1.45, turns: round ? 1.6 : 1.05, r: round ? wB * 6 : C.rcurl(wB) })
  } else if (tailKind === 'down') {
    t.curl({ dir: -1, size: [Math.min(tailR * 1.2, yc - wB), Math.max(wB * 1.5, (x1 - xt) * 1.5)], pitch: wB * 1.45, turns: 1.05, r: C.rcurl(wB) })
  } else {
    t.fwd(Math.max(0, x1 - xt - wB * 1.4))
  }
  const P = C.band(id, t.spine(), tail(wB, 0.3, 0.75), 'square', 'square')
  if (tailKind === 'forked') {
    const end = P[P.length - 1]
    C.band(id, hookSpine([end[0] - wB * 0.2, end[1] + wB * 0.3], 70, C.u(0.08), { curl: 150, radius: C.u(0.04), dir: 1 }), taper(wB * 0.8, wB * 0.4), 'flat', 'square', { centre: false })
    C.band(id, hookSpine([end[0] - wB * 0.2, end[1] - wB * 0.3], -70, C.u(0.08), { curl: 150, radius: C.u(0.04), dir: -1 }), taper(wB * 0.8, wB * 0.4), 'flat', 'square', { centre: false })
  }
  C.marks.body = { x0, x1, xt, yc, wB }
  if (o.quills ?? true) quills(C, o)
  if (pick(o, 'leg', C)) leg(C, o)
  return true
}

/** Dorsal quills: small hooks rising from the body's top edge, pointing back (outward). count 0–6. */
export function quills(C, o = {}) {
  const B = C.marks.body
  if (!B) return
  let n = o.count ?? C.p.quills
  if (n === true) n = 3
  if (!n) return
  const yb = B.yc + B.wB * 0.45
  const room = C.H - yb - C.bw * 0.4
  if (room < C.u(0.04)) return
  const h = Math.min(C.u(0.085), room * 0.8)
  const xa = B.x0 + C.u(0.08), xb = B.xt - C.u(0.05)
  if (xb <= xa) return
  n = Math.min(n, Math.max(1, Math.floor((xb - xa) / C.u(0.075))))
  const w = C.bw * 0.82
  for (let i = 0; i < n; i++) {
    const x = n === 1 ? (xa + xb) / 2 : lerp(xa, xb, i / (n - 1))
    const base = [x + C.rng.jitter(C.u(0.008)), C.dissolved ? yb + C.u(0.035) : yb - w * 0.3]
    const sp = hookSpine(base, 100, h * 0.55, { curl: 105, radius: h * 0.35, dir: -1 })
    C.band(C.dissolved ? 'quill' + i : (C.marks.body && C.p.body === 'dissolved' ? 'body1' : 'body'), sp, taper(w, w * 0.45), 'flat', 'round', { centre: false })
  }
}

/** Leg hanging from the body, knee bent forward, with a forward-pointing claw (2–3 toes + rear spur). */
export function leg(C, o = {}) {
  const B = C.marks.body
  if (!B) return
  const w = C.bw * 1.15
  const xl = lerp(B.x0, B.xt, o.legAt ?? 0.3)
  const foot = Math.max(C.f.Y(0.1), w * 1.4)
  const yTop = B.yc - (C.dissolved ? B.wB * 0.5 + C.u(0.035) : 0)
  if (yTop - foot < C.u(0.12)) return
  const t = new Turtle([xl, yTop], -90).to([xl - C.u(0.025), lerp(yTop, foot, 0.5)], 0).to([xl, foot], C.rc(w, 2))
  const id = C.dissolved ? 'leg' : (C.p.body === 'dissolved' ? 'body1' : 'body')
  C.band(id, t.spine(), w, 'flat', 'square')
  const toes = o.claw ?? C.p.claw ?? 3
  const tw = w * 0.75
  for (let i = 0; i < toes; i++) {
    const base = [xl - w * 0.2, foot + w * 0.25 - i * tw * 1.05]
    if (base[1] < tw * 0.6) break
    C.band(id, hookSpine(base, 180, C.u(0.035 + 0.012 * (toes - i)), { curl: 100, radius: C.u(0.022), dir: 1 }), taper(tw, tw * 0.3), 'flat', 'point', { centre: false })
  }
  C.band(id, hookSpine([xl + w * 0.3, foot - w * 0.2], -20, C.u(0.025), { curl: 80, radius: C.u(0.02), dir: -1 }), taper(tw * 0.8, tw * 0.3), 'flat', 'point', { centre: false })
}

// ------------------------------------------------------------------ kui split-body (T8)

/**
 * Two-kui split-body mode: each half is a whole profile kui, head at the axis.
 * Its eye is the mask's eye, its upper jaw curls up at the snout, the lower
 * jaw curls down, the crest is the horn param (T or bottle best), and the body
 * runs out to a tail.
 */
export function kuiHead(C, o = {}) {
  const w = C.bw
  const ey = o.eyeY ?? 0.56
  eye(C, { at: [0.25, ey], eye: C.p.eye === 'chen' ? 'chen' : C.p.eye })
  const E = C.marks.eye
  const yU = Math.min(E[1] - C.u(0.09), C.f.Y(0.42))
  const x0 = C.dissolved ? C.u(0.06) : C.u(0.035)
  // upper jaw: back from below the eye toward the axis, tip curling up (the snout)
  const up = new Turtle([E[0] + C.u(0.08), yU], 180).to([x0 + w, yU]).curl({ dir: -1, size: [Math.min(C.u(0.09), E[1] - yU), w * 1.3], pitch: w * 1.5, turns: 0.55, r: C.rcurl(w) })
  C.band('jaw', up.spine(), w, 'square', 'square')
  // lower jaw: below, curling down
  const yL = Math.max(w * 0.8, yU - C.u(0.15))
  const lo = new Turtle([E[0] + C.u(0.04), yL], 180).to([x0 + w * 1.4, yL]).curl({ dir: 1, size: [Math.min(C.u(0.07), yL - w * 0.6), w * 1.3], pitch: w * 1.5, turns: 0.5, r: C.rcurl(w) })
  C.band('jaw2', lo.spine(), w * 0.9, 'square', 'square')
  // neck joining the head to the body
  C.marks.eyeOuter = E[0] + C.u(0.06)
}

// ------------------------------------------------------------------ edge fillers

/**
 * What fills x beyond the face when there is no body (or a reserved column):
 * edge: 'scrolls' (a column of C/S scroll islands, fangyi/zun) | 'kui' (vertical kui, head down; T4/T6) | 'none'
 */
export function edge(C, o = {}) {
  const kind = pick(o, 'edge', C)
  if (!kind || kind === 'none') return
  const w = C.bw * 0.9
  if (kind === 'scrolls') {
    const y0 = C.f.Y(0.05), y1 = C.f.Y(0.97)
    const unit = Math.max(C.u(0.17), w * 4)
    const n = Math.max(2, Math.floor((y1 - y0) / unit))
    const h = (y1 - y0) / n
    for (let i = 0; i < n; i++) {
      const yc = y0 + (i + 0.5) * h
      const xr = C.xmax(yc) - w * 0.7
      const colW = Math.min(C.edgeW || C.u(0.18), xr - C.f.X(0.4))
      const xl = xr - colW
      const id = 'edge' + i
      const R = Math.min(colW, h) * 0.32
      if (i % 2 === 0) {
        // a squared C opening toward the face
        const t = new Turtle([xl + R * 0.4, yc + h * 0.34 - w * 0.5], 0).to([xr - w * 0.5, yc + h * 0.34 - w * 0.5]).turn(-90, C.rc(w)).fwd(Math.max(w, h * 0.68 - w * 1.4)).curl({ dir: -1, size: [colW * 0.62, h * 0.38], pitch: w * 1.5, turns: 0.8, r: C.rcurl(w) })
        C.band(id, t.spine(), w, 'square', 'square')
      } else {
        // a hook pair: up-curl over a down-curl (S)
        const t = new Turtle([xr - w * 0.5, yc - h * 0.32], 180).to([xl + w * 0.6, yc - h * 0.32]).turn(-90, C.rc(w)).fwd(0).turn(0).to([xl + w * 0.6, yc + h * 0.3], C.rc(w)).turn(-90, C.rc(w)).fwd(colW * 0.55).curl({ dir: -1, size: [h * 0.3, colW * 0.35], pitch: w * 1.5, turns: 0.6, r: C.rcurl(w) })
        C.band(id, t.spine(), w, 'square', 'square')
      }
    }
    return
  }
  if (kind === 'kui') {
    const xl = Math.max((C.marks.earOuter ?? C.marks.eyeOuter ?? C.f.X(0.5)) + C.bw * 1.2, C.f.X(0.6))
    const yTop = C.f.Y(0.94), yBot = C.f.Y(0.2)
    const xr = C.xmax(yTop) - w * 0.7
    if (xr - xl < C.u(0.16)) return
    const xk = lerp(xl, xr, 0.55)
    const wB = w * 1.2
    // body down from a tail curl at the top to a head at the bottom (head down)
    const t = new Turtle([xk, yBot + C.u(0.08)], 90).to([xk, yTop - C.u(0.06)]).curl({ dir: 1, size: [C.u(0.06), Math.max(wB * 1.5, xk - xl)], pitch: wB * 1.45, turns: 0.75, r: C.rcurl(wB) })
    C.band('sidekui', t.spine(), tail(wB, 0.3, 0.7), 'square', 'square')
    // head block, eye, snout hook toward the face
    C.sheet.add('sidekui', rrect([xk, yBot], Math.max(wB * 2, C.u(0.12)), C.u(0.12), wB * 0.5))
    C.sheet.bosses.push({ shape: circle([xk + wB * 0.3, yBot + C.u(0.01)], wB * 0.5), base: 'plateau', r: wB * 0.5 })
    C.band('sidekui', hookSpine([xk - C.u(0.05), yBot - C.u(0.05)], 180, C.u(0.04), { curl: 120, radius: C.u(0.03), dir: 1 }), w * 0.8, 'flat', 'round', { centre: false })
    // a leg/claw toward the face
    C.band('sidekui', hookSpine([xk - wB * 0.4, lerp(yBot, yTop, 0.45)], 200, C.u(0.06), { curl: 90, radius: C.u(0.03), dir: 1 }), taper(w, w * 0.4), 'flat', 'point', { centre: false })
    C.marks.sideKui = xl
  }
}

// ------------------------------------------------------------------ dissolved fillers

/** Small floating hooks / C-marks on the leiwen around a dissolved body (§2.13 "small floating hooks and kui fragments"). */
export function fragments(C, o = {}) {
  const B = C.marks.body
  if (!B) return
  const n = o.count ?? 2
  const w = C.bw * 0.75
  const yLow = C.f.Y(0.3)
  const xa = B.x0 + B.wB * 2.6, xb = B.xt
  for (let i = 0; i < n; i++) {
    const x = lerp(xa, xb, (i + 0.5) / n)
    if (x > C.xmax(yLow) - w * 2) continue
    const t = new Turtle([x - C.u(0.04), yLow], 0).fwd(C.u(0.06)).curl({ dir: i % 2 ? 1 : -1, size: [C.u(0.05), C.u(0.05)], pitch: w * 1.5, turns: 0.7, r: C.rcurl(w) })
    C.band('frag' + i, t.spine(), w, 'square', 'square')
  }
}
