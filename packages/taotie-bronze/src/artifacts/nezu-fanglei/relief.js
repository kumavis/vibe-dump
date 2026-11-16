// nezu-fanglei — the décor, TRACED by hand from the flattened faces of photo-37 (reference/nezu-fanglei/faces/,
// read off mm grids: .work/r7-lei/solve/gridface.py). The bronze's ground is NOT darker than its bands (pale
// grey-green all over, the relief read by its shading), so the thresholding tracer of met-fangding fails here
// (reference/nezu-fanglei/trace.py writes its debug overlays to show it); every element below is a control-point
// reading instead: centre lines, widths, corner rounding, ends and what is cut on the tops.
//
// Authored for the RIGHT half in face mm: x from the face's centre line, y = VESSEL height (mm), on the broad
// front face (+Z). The left half is the mirror (spirals change hand). The narrow ±X faces repeat the design
// compressed in x by their width ratio (photo-36 shows them with the same masks, narrower: inferred in detail).
// Relief: fat flat-topped plateaus ≈ 2 mm proud with round shoulders, one sunk contour line inside each edge and
// chains of small spirals / lines on the tops; round boss eyes ≈ 2.6 mm with a ring and a pupil hole; leiwen
// ground ≈ 1.1 mm pitch sunk between.

import { LV, RHO, halfAt } from './form.js'

// Round 8 (fix pass): the bronze's band language — FAT bands (7.5–9.5 mm on the belly) with round outer corners,
// two or three incised lines running parallel to the contour (NEST), horn ends rolling into big spirals, a fine ROUND
// leiwen ground (≈ 0.8 mm pitch); no spiral chains on the field borders (the photographs show hook columns there).
const RELIEF = { band: 2.4, shoulder: 1.5, groove: 0.42, eye: 3.0, leiwen: 0.36 }
const CONTOUR = { inset: 0.8, line: 0.45 }
const NEST = { kind: 'lines', line: 0.42, pitch: 1.7 }
const NOFILL = { kind: 'none' }
const GROUND = { pitch: 0.8, line: 0.5, cell: [2.6, 4.4], roundness: 0.7, jitter: 0.06, turns: 'auto', pairs: 0.3, maxAspect: 1.4, fillers: true }
const ROUND = { round: 0.8, inner: 0.3 }
const COIL = { kind: 'coil', line: 0.45, pitch: 1.35 }

/** arc length up the wall (front or side profile) from y0 to y, tabulated */
function arcTable(y0, y1, half) {
  const ys = [], ss = []
  let s = 0
  for (let y = y0, prev = null; y <= y1 + 0.25; y += 0.5) {
    if (prev) s += Math.hypot(y - prev[0], half(y) - prev[1])
    ys.push(y); ss.push(s)
    prev = [y, half(y)]
  }
  return (y) => {
    const f = (y - y0) / 0.5
    const i = Math.max(0, Math.min(ys.length - 2, Math.floor(f)))
    return ss[i] + (ss[i + 1] - ss[i]) * (f - i)
  }
}

/** element builders in face mm, mirrored by s, mapped through M */
function maker(kit, M, s) {
  const P = (p) => M([s * p[0], p[1]])
  return {
    S: (ctrl, o = {}) => kit.roundStroke(ctrl.map(P), { ...o, spiral: o.spiral && { ...o.spiral, dir: o.spiral.dir * s }, startSpiral: o.startSpiral && { ...o.startSpiral, dir: o.startSpiral.dir * s } }),
    B: (c, w, h, o = {}) => kit.roundPlate({ round: 0.42, ...o, c: P(c), w, h, fill: o.fill && o.fill.kind === 'coil' ? { ...o.fill, hand: s > 0 ? 'right' : 'left', offset: o.fill.offset && [o.fill.offset[0] * s, o.fill.offset[1]] } : o.fill }),
    P,
  }
}

function hole(panel, c, r, depth) {
  panel.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], r, 0, Math.PI * 2); ctx.fill() }, { depth, shoulder: 0.3, profile: 'u' })
}
function slit(panel, c, len, w, depth, rot = 0) {
  panel.sink((ctx) => {
    ctx.save(); ctx.translate(c[0], c[1]); ctx.rotate((rot * Math.PI) / 180)
    ctx.beginPath(); ctx.roundRect ? ctx.roundRect(-len / 2, -w / 2, len, w, w / 2) : ctx.rect(-len / 2, -w / 2, len, w); ctx.fill(); ctx.restore()
  }, { depth, shoulder: 0.25, profile: 'u' })
}
const polyDraw = (pts) => (ctx) => { ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.fill() }

// ------------------------------------------------------------------ belly (main, second, low registers + narrow frieze)

/** a column of small hooks beside a centre flange (photo-37: hook glyphs, not a spiral chain) */
function hookColumn(S, x, y0, y1, pitch = 12.5) {
  const out = []
  const n = Math.max(1, Math.round((y1 - y0) / pitch))
  const p = (y1 - y0) / n
  for (let i = 0; i < n; i++) {
    const y = y0 + i * p + 1.6
    out.push(S([[x - 3.4, y], [x + 2.4, y], [x + 2.4, y + p - 5.2]], { width: 3.4, round: 0.9, inner: 0.3, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 1.9 }, fill: NOFILL, contour: false }))
  }
  return out
}

function bellyDesign(kit, panel, M, s) {
  const { S, B, P } = maker(kit, M, s)
  const els = [
    // MAIN (face-main): the G horn, ONE fat band (photo ≈ 8.5–9.5 mm): it starts in the big spiral block inside
    // the horn (centre ≈ (61, 229)), runs right along the bottom, up the outer column (x 72–80), across the top
    // (y 244–251) and down the inner column, whose end rolls into the teardrop curl at (33, 226)
    S([[61, 219.5], [76, 219.5], [76, 247.5], [28.5, 247.5], [28.5, 227]], { width: [8.4, 8.6, 9.6, 9.6, 8.6], ...ROUND, start: 'spiral', startSpiral: { turns: 1.35, dir: 1, R: 7.6, gap: 0.9 }, end: 'spiral', spiral: { turns: 1.15, dir: 1, R: 4.6, gap: 0.9 }, fill: NEST }),
    B([61.5, 229], 21, 18.5, { round: 0.55, fill: COIL }), // the big spiral block that fills the G (photo ≈ 22 × 20 mm)
    S([[51, 214.5], [17, 214.5], [17, 199]], { width: 6.6, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 3.2 }, fill: NEST }), // brow under the horn
    ...hookColumn(S, 7.6, 171, 252),
    S([[47, 209.5], [86, 209.5], [93, 204]], { width: 8, ...ROUND, end: 'spiral', spiral: { turns: 1, dir: -1, R: 3.2 }, fill: NEST }), // trunk from the eye
    // the ear: a big rounded C at the corner whose end curls into a large spiral (photo x 100–125, y 215–240)
    S([[93, 246], [124, 246], [124, 217.5], [107, 217.5]], { width: 8.6, ...ROUND, end: 'spiral', spiral: { turns: 1.3, dir: -1, R: 5.6, gap: 0.9 }, fill: NEST }),
    B([112.5, 230], 15.5, 16, { round: 0.55, fill: COIL }), // the ear's spiral core
    S([[88.5, 214], [88.5, 248], [97, 248]], { width: 6, ...ROUND, start: 'spiral', startSpiral: { turns: 1, dir: 1, R: 2.8 }, fill: NEST }), // the upright kui between horn and ear (photo x 84–97)
    S([[60, 196], [104, 196], [104, 182.5], [93, 182.5]], { width: 7.8, ...ROUND, end: 'spiral', spiral: { turns: 1, dir: -1, R: 3.6 }, fill: NEST }), // lower hook
    S([[47, 182], [47, 176], [18, 176], [18, 189], [38, 189]], { width: 7.4, ...ROUND, end: 'spiral', spiral: { turns: 1.1, dir: -1, R: 4.0 }, fill: NEST }), // the jaw under the eye
    S([[127, 181], [127, 206], [112, 206]], { width: 7, ...ROUND, end: 'spiral', spiral: { turns: 1, dir: 1, R: 3.4 }, fill: NEST }), // corner hook
    // SECOND (face-second): a big C open to the right (x 24–72, y 135–164), slanting crested bodies toward the
    // corner, a curved boat-shaped band at the bottom rolled at both ends
    S([[73, 160.5], [28, 160.5], [28, 137.5], [49, 137.5]], { width: [8.6, 9.4, 9.4, 8.6], ...ROUND, end: 'round', fill: NEST }),
    S([[62, 157], [52, 116], [45, 113]], { width: 7.4, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 3 }, fill: NEST }),
    S([[80, 162], [68, 112], [60, 109]], { width: 7.6, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 3 }, fill: NEST }),
    S([[18, 118], [28, 111.5], [44, 110.5], [52, 113]], { width: 8.6, ...ROUND, start: 'spiral', startSpiral: { turns: 1, dir: -1, R: 3.6 }, end: 'round', fill: NEST }),
    ...hookColumn(S, 7.6, 103, 167),
    S([[91, 124], [91, 156], [100, 163]], { width: 7.4, ...ROUND, start: 'spiral', startSpiral: { turns: 0.9, dir: 1, R: 3 }, end: 'point', fill: NEST }),
    // LOW (face-low): a flat eye plate with a slit, a C under it, a hooked crest beside (the lug covers |x| < 24)
    B([35, 91], 27, 15, { round: 0.6 }),
    S([[48, 77.5], [25, 77.5], [25, 67], [46, 67]], { width: 6.8, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 3 }, fill: NEST }),
    S([[53, 73], [59, 84], [69, 84], [71, 76]], { width: 6.2, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 3 }, fill: NOFILL }),
    // NARROW frieze 36–50: a running snake, rolled at both ends, one eye dot
    S([[5, 43], [14, 46.5], [25, 46.5], [35, 41], [46, 40], [56, 44.5], [65, 45.5], [70, 43]], { width: 5.2, round: 1, inner: 0.6, start: 'spiral', startSpiral: { turns: 0.9, dir: -1, R: 2.6 }, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.6 }, fill: NOFILL }),
  ]
  const eyes = [
    { c: P([36.5, 205]), w: 19, h: 19, round: 1, height: RELIEF.eye, crown: 0.6, slit: false, ring: { gap: 0.5, line: 0.6, depth: 0.4 }, hole: 2.4 },
    { c: P([52, 190]), w: 9.5, h: 9.5, round: 1, height: 2.6, crown: 0.7, slit: false },
    { c: P([14, 45]), w: 3.8, h: 3.8, round: 1, height: 2.2, crown: 0.8 },
  ]
  const slits = [{ c: P([33, 91]), len: 10, w: 1.9 }]
  return { els, eyes, slits }
}

/** a fang cell panel ('true' map): x = W/2 + kx · x_face, y = arc length from the cell's body bottom */
function fangPanel(kit, cell, { ppmm, seed, y0, half, kx }) {
  const W = cell.wMax, Hh = cell.h
  const p = new kit.ReliefPanel({ width: W, height: Hh, ppmm, seed })
  const arc = arcTable(y0, y0 + Hh * 1.2, half)
  const M = ([x, y]) => [W / 2 + kx * x, arc(y)]
  const include = polyDraw(cell.outline)
  return { p, M, include, W, arc }
}

function finish(kit, panel, design, { seed }) {
  kit.carve(panel, design.els, { height: RELIEF.band, shoulder: RELIEF.shoulder, depth: RELIEF.groove, contour: CONTOUR, irregularity: 1, seed })
  for (const e of design.eyes) {
    kit.pillowBoss(panel, { slit: false, ...e })
    if (e.hole) hole(panel, e.c, e.hole, 1.4)
  }
  for (const t of design.slits || []) slit(panel, t.c, t.len, t.w, 1.1, t.rot)
}

export async function bellyPanel(kit, cell, { ppmm, seed, kx = 1 }) {
  const half = kx === 1 ? (y) => RHO * halfAt(y) : (y) => halfAt(y)
  const { p, M, include, W, arc } = fangPanel(kit, cell, { ppmm, seed, y0: LV.foot, half, kx })
  const d1 = bellyDesign(kit, p, M, 1), d2 = bellyDesign(kit, p, M, -1)
  finish(kit, p, { els: [...d1.els, ...d2.els], eyes: [...d1.eyes, ...d2.eyes], slits: [...d1.slits, ...d2.slits] }, { seed })
  // grounds: leiwen in the registers, a lozenge band at the bottom of the low register (photo-37: a checker of small
  // diamonds with dots, 52–62)
  const band = (ya, yb) => ({ x: 0, y: arc(ya), w: W, h: arc(yb) - arc(ya) })
  kit.lozengeFill(p, { rect: band(LV.narrow + 1.5, 64), include, margin: 0.5 }, { size: [6.4, 4.6], fill: 'dot', pitch: 0.9, levels: 0, depth: 0.45, seed })
  for (const [ya, yb] of [[169.5, 253.5], [102.5, 168], [64, 99.5], [LV.bellyBorder + 1, LV.narrow - 0.5]]) {
    kit.leiwenFill(p, { rect: band(ya, yb), include, margin: 0.5 }, { ...GROUND, depth: RELIEF.leiwen, seed: seed + ya })
  }
  // register borders: thin raised fillets (photo-37: a narrow raised line along each register edge)
  p.raise((ctx) => {
    for (const y of [253.8, 168.6, 101.5, 50.9, 35.6]) ctx.fillRect(1.5, arc(y) - 0.45, W - 3, 0.9)
  }, { height: 0.7, shoulder: 0.3, profile: 'plateau' })
  return p.bake()
}

// ------------------------------------------------------------------ shoulder, collar, foot friezes (confronted kui)

function shoulderDesign(kit, M, s) {
  const { S, P } = maker(kit, M, s)
  return {
    els: [
      // shoulder kui, read off face-shoulder (x 27–118): the crest is ONE fat band in an S–G (x 37–73, y 292–306)
      // whose two ends roll up into spiral cores; a thick body (y 283–290) under the eye boss runs to the corner and
      // rolls into the tail block (x 95–108, y 284–302); a big C jaw below (x 27–60, y 266–281)
      S([[49, 293], [38, 293], [38, 304.5], [73, 304.5], [73, 293.5], [61, 293.5]], { width: 6.8, ...ROUND, start: 'spiral', startSpiral: { turns: 1.4, dir: -1, R: 3.4, gap: 0.8 }, end: 'spiral', spiral: { turns: 1.4, dir: -1, R: 3.4, gap: 0.8 }, fill: NEST }),
      S([[29, 286.5], [104, 286.5], [104, 302], [95, 302]], { width: 6.4, ...ROUND, end: 'spiral', spiral: { turns: 1.1, dir: 1, R: 3.4 }, fill: NEST }),
      S([[61, 279.5], [28, 279.5], [28, 267.5], [53, 267.5]], { width: 6.2, ...ROUND, end: 'spiral', spiral: { turns: 1.1, dir: 1, R: 3.6 }, fill: NEST }),
      S([[64, 268], [80, 268], [80, 278]], { width: 5.6, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.6 }, fill: NOFILL }),
      S([[99, 268.5], [116, 268.5], [116, 280], [106, 280]], { width: 5.6, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.6 }, fill: NOFILL }),
    ],
    eyes: [{ c: P([48.5, 286.5]), w: 7, h: 7, round: 1, height: 2.8, crown: 0.75, base: 'field' }, { c: P([62, 281]), w: 4, h: 4, round: 1, height: 2.2, crown: 0.8 }],
  }
}

export function shoulderPanel(kit, cell, { ppmm, seed, kx = 1 }) {
  const half = kx === 1 ? (y) => RHO * halfAt(y) : (y) => halfAt(y)
  const { p, M, include, W, arc } = fangPanel(kit, cell, { ppmm, seed, y0: LV.main, half, kx })
  const a = shoulderDesign(kit, M, 1), b = shoulderDesign(kit, M, -1)
  finish(kit, p, { els: [...a.els, ...b.els], eyes: [...a.eyes, ...b.eyes] }, { seed })
  kit.leiwenFill(p, { rect: { x: 0, y: arc(266.5), w: W, h: arc(310.5) - arc(266.5) }, include, margin: 0.5 }, { ...GROUND, depth: RELIEF.leiwen, seed })
  return p.bake()
}

function collarDesign(kit, M, s) {
  const { S, P } = maker(kit, M, s)
  const w = 4.2, o = { width: w, ...ROUND, fill: NOFILL }
  return {
    els: [
      // per half: two big rounded C blocks in the upper band, each curling into an inward spiral; hooked limbs below
      S([[48, 350], [22, 350], [22, 368.5], [44, 368.5], [44, 359]], { ...o, end: 'spiral', spiral: { turns: 1.1, dir: 1, R: 3 } }),
      S([[56, 368.5], [77, 368.5], [77, 352], [62, 352]], { ...o, end: 'spiral', spiral: { turns: 1.1, dir: 1, R: 3 } }),
      S([[45, 338], [26, 338], [26, 344]], { ...o, end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2 } }),
      S([[48, 334], [70, 334], [70, 342]], { ...o, end: 'spiral', spiral: { turns: 0.8, dir: 1, R: 2.2 } }),
      S([[5, 331], [5, 371]], { width: 4.2, fill: NOFILL }),
    ],
    eyes: [{ c: P([33, 345]), w: 5.4, h: 5.4, round: 1, height: 2.2, crown: 0.8 }, { c: P([56, 345]), w: 5.4, h: 5.4, round: 1, height: 2.2, crown: 0.8 }],
  }
}

export function collarPanel(kit, cell, { ppmm, seed, kx = 1 }) {
  const { p, M, include, W, arc } = fangPanel(kit, cell, { ppmm, seed, y0: LV.shoulder, half: () => 0, kx })
  const a = collarDesign(kit, M, 1), b = collarDesign(kit, M, -1)
  finish(kit, p, { els: [...a.els, ...b.els], eyes: [...a.eyes, ...b.eyes] }, { seed })
  kit.leiwenFill(p, { rect: { x: 0, y: arc(329), w: W, h: arc(372.5) - arc(329) }, include, margin: 0.5 }, { ...GROUND, depth: RELIEF.leiwen, seed })
  return p.bake()
}

export function footPanel(kit, cell, { ppmm, seed, kx = 1 }) {
  const { p, M, include, W, arc } = fangPanel(kit, cell, { ppmm, seed, y0: 0, half: () => 0, kx })
  const all = []
  const eyes = []
  for (const s of [1, -1]) {
    const { S, P } = maker(kit, M, s)
    all.push(S([[9, 11], [16, 15.5], [26, 16], [35, 10.5], [45, 9], [55, 13.5]], { width: 4.6, round: 1, inner: 0.6, start: 'spiral', startSpiral: { turns: 1, dir: 1, R: 2.6 }, end: 'spiral', spiral: { turns: 0.9, dir: -1, R: 2.4 }, fill: NOFILL }))
    eyes.push({ c: P([9.5, 13.5]), w: 3.6, h: 3.6, round: 1, height: 1.9, crown: 0.8 })
  }
  finish(kit, p, { els: all, eyes }, { seed })
  kit.leiwenFill(p, { rect: { x: 0, y: arc(LV.base + 0.6), w: W, h: arc(20.6) - arc(LV.base + 0.6) }, include, margin: 0.45 }, { ...GROUND, depth: RELIEF.leiwen, seed })
  return p.bake()
}

// ------------------------------------------------------------------ lid slopes and knob

/** f = hippedLidLayout face: { w, h, outline }; lid face mm (x from the slope's centre line, y vessel) → panel */
export function lidPanel(kit, f, { ppmm, seed, kind }) {
  const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm, seed })
  const y0 = LV.collar + LV.skirt + LV.fascia, rise = LV.ridge - y0
  const M = ([x, y]) => [f.w / 2 + x, ((y - y0) / rise) * f.h]
  const include = polyDraw(f.outline)
  const els = [], eyes = [], slits = []
  for (const s of [1, -1]) {
    const { S, P } = maker(kit, M, s)
    if (kind === 'long') {
      // face-lid: an upright mask per half — C horn on top, pillow eye with a slit, a brow, a G below, bodies along the hip
      els.push(
        S([[12.5, 446], [12.5, 433.5], [28.5, 433.5], [28.5, 446]], { width: 5.2, ...ROUND, end: 'spiral', spiral: { turns: 1, dir: 1, R: 2.4 }, fill: NOFILL }), // U horn open upward (face-lid x 12–29)
        S([[36, 438], [36, 418]], { width: 4.8, ...ROUND, fill: NOFILL }),
        S([[5, 415.5], [58, 415.5]], { width: 5.4, ...ROUND, fill: NEST }),
        S([[38, 408.5], [15, 408.5], [15, 398], [40, 398]], { width: [6.4, 6.6, 6.6, 8.5], ...ROUND, end: 'blunt', fill: NEST }), // the fat G, its lower end a thick block
        S([[64, 397], [42, 436]], { width: 5.4, ...ROUND, end: 'spiral', spiral: { turns: 0.9, dir: 1, R: 2.4 }, fill: NEST }), // bodies along the hip (outer-bottom → inner-top)
        S([[76, 397], [57, 432]], { width: 4.6, ...ROUND, fill: NOFILL }),
        ...hookColumn(S, 6.5, 391, 436, 11),
        
      )
      eyes.push({ c: P([20.5, 424.5]), w: 19, h: 12.5, round: 0.55, height: 2.5, crown: 0.5, slit: { len: 8, width: 1.3, depth: 0.8 } })
      for (const [c, w] of [[[6, 441], 5.6], [[31, 432.5], 5.6], [[50, 423.5], 5.6]]) eyes.push({ c: P(c), w, h: w, round: 1, height: 2.2, crown: 0.75 })
    } else {
      // the triangular end slopes (photo-36): a smaller mask per half, eye with slit, a C above, a G below
      els.push(
        S([[22, 425], [9, 425], [9, 430], [21, 430]], { width: 3.6 }),
        S([[24, 404], [9, 404], [9, 397], [24, 397]], { width: 4, fill: NOFILL }),
        S([[4, 392], [4, 432]], { width: 4.2 }),
      )
      eyes.push({ c: P([16, 413.5]), w: 13, h: 9, round: 0.55, height: 2.2, crown: 0.5, slit: { len: 5.5, width: 1.1, depth: 0.7 } })
      eyes.push({ c: P([27, 420]), w: 3.6, h: 3.6, round: 1, height: 2, crown: 0.75 })
    }
  }
  finish(kit, p, { els, eyes, slits }, { seed })
  kit.leiwenFill(p, { include, margin: 0.6 }, { ...GROUND, depth: RELIEF.leiwen, seed })
  return p.bake()
}

/** the knob roof slopes: leiwen with a small boss (photo-37: a fine squared ground, too small to read more) */
export function knobPanel(kit, f, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: f.w, height: f.h, ppmm: Math.max(ppmm, 6), seed })
  const include = polyDraw(f.outline)
  kit.pillowBoss(p, { c: [f.w / 2, f.h * 0.45], w: 4, h: 4, round: 1, height: 1.4, crown: 0.7 })
  kit.leiwenFill(p, { include, margin: 0.6 }, { ...GROUND, depth: 0.3, seed })
  return p.bake()
}
