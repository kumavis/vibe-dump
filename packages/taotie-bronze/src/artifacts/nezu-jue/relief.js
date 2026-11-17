// Nezu jue — the décor panels, drawn from the traced data in trace.js.
//
// Ridge pass (.work/ridge-nezu-jue/NOTES.md). The band is a PAVEMENT of square-cornered flat plates, not bands on a
// ground: the whole field is raised as one low plate (PLATE.field), every figure gets a narrow sunk channel round it
// and stands a step higher on its own plateau (PLATE.figure), and its top carries RIDGE WORK — a chain of small
// squared spirals (kit quadSpiral, one cell per band width) or two / three parallel lines (kit ridgeBand) — added on
// the plateau. What the figures leave is plain plate one step lower (pale in the photograph); deep pockets sink into
// the curls and the eye socket. Corners are SQUARE (mitred strokes, a 0.3 mm shoulder; ridge corners bend 0.2 mm):
// the bronze has none of the round arcs other vessels have.
//
// ONE panel wraps the whole cup: x = developed mm at r 34.4 from θ 90 (the handle: the seam hides under it),
// y = height − PANEL.y0; it covers the band (y 101 … 140) and the side parts of the upper wall up to the rim.
// Layout round the cup (θ → panel x): handle 90 → 0 · tail mask nose 180 → 54.0 · opposite the handle 270 → 108.1 ·
// spout mask nose 0/360 → 162.1. The traced half (handle side of the tail mask) is mirrored about each nose; the
// spout mask repeats the tail mask (not in the photograph: INFERRED); the filler strips by the handle and opposite
// it are read off the dark, foreshortened area behind the handle and repeated (INFERRED opposite it).
import { REG } from './form.js'
import { BAND, FILLER, TRIANGLE } from './trace.js'

export const PANEL = { r: 34.4, y0: 98, y1: 164 }
PANEL.w = 2 * Math.PI * PANEL.r
PANEL.h = PANEL.y1 - PANEL.y0
const R = PANEL.r
const DEGMM = (R * Math.PI) / 180
export const xOfAz = (az) => ((((az - 90) % 360) + 360) % 360) * DEGMM
const NOSE = { tail: xOfAz(180), spout: 270 * DEGMM }
// face-band (u, v) → developed panel (x on the traced, handle-side half of the tail mask; y)
const FX = (u) => R * Math.asin(Math.max(-0.999, Math.min(0.999, u / R))) + 38 * DEGMM
const FY = (v) => 120.75 + v / 0.978 - PANEL.y0
const KX = (u) => 1 / Math.sqrt(1 - Math.min(0.9, (u / R) ** 2)) // developed mm per face mm across the wall

/** Levels (mm above the plain wall). Band ≈ 2 mm proud overall (dossier, from the shadows). */
export const PLATE = {
  field: 1.15,       // the plain plates (the pale cells)
  figure: 1.95,      // figure plateau top; ridges stand on it
  channel: 0.62,     // channel width each side of a figure (mm); a gap narrower than 2× is all channel
  channelDepth: 1.6, // channels cut through the plate to ≈ 0.35 mm under the wall (the photograph's dark crescents)
  shoulder: 0.3,     // plate shoulders: crisp, square-looking edges
  pocket: 2.3,       // pockets sink this far below the plate (≈ 1 mm under the wall: they read black)
}
/** ridge profiles. SP: the squared spirals on the figure tops (photo: ≈ 3 mm cells of ≈ 2 turns → ≈ 0.65 mm pitch);
 *  LN: the parallel lines of the multi-line figures (photo: 3 lines in ≈ 2.2 mm). ridge : groove ≈ 65 : 35. */
export const SP = { width: 0.42, pitch: 0.65, height: 0.32, groove: 0.1, crown: 1, mode: 'add' }
export const LN = { width: 0.47, pitch: 0.7, height: 0.36, groove: 0.1, crown: 1, mode: 'add' }
const BEND = 0.2

// ------------------------------------------------------------------ helpers (panel mm)

/** face-mm figure → panel figure through X (axis-aligned paths map exactly); width per segment orientation */
function mapFigure(f, X, xScale) {
  const pts = f.c.map(X)
  const vertical = f.c.length === 2 && f.c[0][0] === f.c[1][0]
  const um = f.c.reduce((s, q) => s + q[0], 0) / f.c.length
  const w = vertical && xScale ? Math.abs(X([f.c[0][0] + f.w / 2, 0])[0] - X([f.c[0][0] - f.w / 2, 0])[0])
    : f.c.length === 2 ? f.w / 0.978
    : f.w * (xScale ? Math.sqrt(KX(um)) : 1)
  return { ...f, pts, w }
}

const strokePath = (ctx, pts, closed) => {
  ctx.beginPath(); pts.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1])))
  if (closed) ctx.closePath()
  ctx.stroke()
}
const rrect = (ctx, x, y, w, h, r) => {
  r = Math.min(r, w / 2, h / 2)
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r); ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r); ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r); ctx.closePath()
}

/** squared-spiral cells along a straight figure: square-ish quads that share edges (one pitch apart), hands alternating */
function spiralCells(work, f, hand0) {
  const [a, b] = [f.pts[0], f.pts[f.pts.length - 1]]
  const L = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / L, (b[1] - a[1]) / L], n = [-d[1], d[0]]
  const inset = 0.22, wi = f.w - 2 * inset, target = f.cell ?? 3.2
  const across = Math.max(1, Math.round(wi / target)), cw = wi / across
  const along = Math.max(1, Math.round((L - 2 * inset) / cw)), cl = (L - 2 * inset) / along
  let hand = hand0
  for (let i = 0; i < along; i++) for (let j = 0; j < across; j++) {
    const s0 = inset + i * cl, s1 = s0 + cl, t0 = -wi / 2 + j * cw, t1 = t0 + cw
    const P = (s, t) => [a[0] + d[0] * s + n[0] * t, a[1] + d[1] * s + n[1] * t]
    work.quadSpiral([P(s0, t0), P(s1, t0), P(s1, t1), P(s0, t1)], { ...SP, transform: null, dir: hand, start: (i + j) % 4, corner: 0.35, cornerMin: 0.2, margin: 0.36, turns: 1.5, pitch: undefined })
    hand = -hand
  }
  return hand
}

/**
 * Figures on plateaus inside channels, ridge work on top. figs: panel figures ({ pts, w, deco, n, closed }).
 * base: the level the channels cut down to is (plate − channelDepth); on the band the plate is PLATE.field and the
 * channel cuts to the wall; on the upper wall there is no field plate.
 */
function drawFigures(kit, p, figs, { channels = [], plateau = PLATE.figure, channelDepth = PLATE.channelDepth } = {}) {
  // 1 channels: every figure's outline grown by PLATE.channel, minus the figures (one sink), plus the extra lines
  p.sink((ctx) => {
    ctx.lineJoin = 'miter'; ctx.miterLimit = 4
    for (const f of figs) { ctx.lineCap = f.closed ? 'butt' : 'square'; ctx.lineWidth = f.w + 2 * PLATE.channel; strokePath(ctx, f.pts, f.closed) }
    ctx.lineCap = 'butt'
    for (const c of channels) { ctx.lineWidth = c.w; strokePath(ctx, c.pts) }
    ctx.globalCompositeOperation = 'destination-out'
    for (const f of figs) { ctx.lineCap = 'butt'; ctx.lineWidth = f.w; strokePath(ctx, f.pts, f.closed) }
    ctx.globalCompositeOperation = 'source-over'
  }, { depth: channelDepth, shoulder: 0.22, profile: 'u' })
  // 2 the plateaus (one raise; max, so overlapping figures merge)
  p.raise((ctx) => {
    ctx.lineJoin = 'miter'; ctx.miterLimit = 4; ctx.lineCap = 'butt'
    for (const f of figs) { ctx.lineWidth = f.w; strokePath(ctx, f.pts, f.closed) }
  }, { height: plateau, shoulder: PLATE.shoulder, profile: 'plateau' })
  // 3 ridge work on the tops (one batch: one groove sink + one add per ridge width)
  const work = kit.ridgeWork(p, { ...LN })
  let hand = 1
  for (const f of figs) {
    if (f.deco === 'sp') hand = spiralCells(work, f, hand)
    else if (f.deco === 'ln') {
      const n = f.n ?? 2
      const pitch = Math.min(LN.pitch, (f.w - 0.5) / Math.max(1, n - 1 + LN.width / LN.pitch))
      work.ridgeBand(f.pts, { ...LN, pitch, width: Math.min(LN.width, pitch * 0.68), transform: null, ridges: n, bend: BEND, closed: f.closed, start: 'square', end: 'square' })
    }
  }
  work.flush()
}

function sinkPockets(p, list, depth) {
  p.sink((ctx) => { for (const k of list) { ctx.beginPath(); rrect(ctx, k.c[0] - k.w / 2, k.c[1] - k.h / 2, k.w, k.h, k.r); ctx.fill() } }, { depth, shoulder: 0.45, profile: 'u' })
}

// ------------------------------------------------------------------ the band

export function bandPanel(kit, { ppmm, seed }) {
  const p = new kit.ReliefPanel({ width: PANEL.w, height: PANEL.h, ppmm, seed })
  const W = PANEL.w
  const yb0 = REG.band[0] - PANEL.y0, yb1 = REG.band[1] - PANEL.y0
  // plain fillets just outside the field (the photograph's narrow plain rings above and below the band)
  p.raise((ctx) => { ctx.fillRect(-2, yb0 - 1.9, W + 4, 1.3); ctx.fillRect(-2, yb1 + 0.6, W + 4, 1.3) }, { height: 0.55, shoulder: 0.35 })
  // the field: one low plate over the whole band
  p.raise((ctx) => ctx.fillRect(-2, yb0, W + 4, yb1 - yb0), { height: PLATE.field, shoulder: PLATE.shoulder, profile: 'plateau' })

  const figs = [], channels = [], pockets = []
  // masks: the traced half and its mirror about each nose
  for (const cx of [NOSE.tail, NOSE.spout]) for (const side of [1, -1]) {
    const X = ([u, v]) => [cx - side * (NOSE.tail - FX(u)), FY(v)]
    for (const f of BAND.figures) figs.push(mapFigure(f, X, true))
    for (const c of BAND.channels) channels.push({ pts: c.c.map(X), w: c.w })
    for (const k of BAND.pockets) pockets.push({ c: X(k.c), w: k.w * KX(k.c[0]), h: k.h / 0.978, r: k.r })
  }
  // fillers: by the handle (both sides of the seam) and opposite it (both sides of θ 270)
  for (const [cx, sides] of [[0, [1]], [W, [-1]], [xOfAz(270), [1, -1]]]) for (const side of sides) {
    const X = ([x, v]) => [cx + side * x, FY(v)]
    for (const f of FILLER.figures) figs.push(mapFigure(f, X, false))
    for (const k of FILLER.pockets) pockets.push({ c: X(k.c), w: k.w, h: k.h / 0.978, r: k.r })
  }
  drawFigures(kit, p, figs, { channels })
  sinkPockets(p, pockets, PLATE.pocket)
  // the eyeball in each socket
  for (const cx of [NOSE.tail, NOSE.spout]) for (const side of [1, -1]) for (const e of BAND.eyes) {
    kit.pillowBoss(p, {
      c: [cx - side * (NOSE.tail - FX(e.c[0])), FY(e.c[1])], w: e.w * KX(e.c[0]), h: e.h, round: e.round, height: PLATE.field + e.height, crown: e.crown,
      slit: { len: e.slit.len, width: e.slit.width, depth: e.slit.depth },
    })
  }

  // upper wall: four triangles at θ 51, 129, 231, 309 (the photograph shows the one at 129; the others follow the
  // cup's mirror planes — INFERRED). A double-lined border (two ridges on a raised band, mitred corners), a central
  // stem, squared brows over two eye pockets, foot hooks round two lower pockets; the interior is the plain wall.
  const T = TRIANGLE, ty0 = yb1 + 1.9
  const tfigs = [], tpockets = []
  const hw = T.base / 2, bw = T.border.w
  // the border's centre line: the triangle shrunk about its incentre by bw/2 (every side moves in by the same amount)
  const rin = (hw * T.h) / (hw + Math.hypot(hw, T.h)), sk = (rin - bw / 2) / rin
  const inner = [[-hw, 0], [0, T.h], [hw, 0]].map(([x, y]) => [x * sk, rin + (y - rin) * sk])
  for (const az of [51, 129, 231, 309]) {
    const cx = xOfAz(az)
    const P = ([x, y]) => [cx + x, ty0 + y]
    tfigs.push({ pts: inner.map(P), w: bw, deco: 'ln', n: T.border.n, closed: true })
    for (const f of T.figures) tfigs.push({ ...f, pts: f.c.map(P) })
    for (const q of T.pockets) tpockets.push({ ...q, c: P(q.c) })
  }
  drawFigures(kit, p, tfigs, { plateau: 1.4, channelDepth: 0.5 })
  sinkPockets(p, tpockets, 1.2)
  // the dark hole in the upper wall over the handle (photo-02, θ ≈ 98–110, y ≈ 146–154: a loss or casting flaw):
  // a deep sunk pocket; the preset's soilGroove keeps the pale earth out of it, so it reads dark as in the photograph
  p.sink((ctx) => { ctx.beginPath(); ctx.ellipse(xOfAz(101), 150 - PANEL.y0, 7.6, 4.0, 0, 0, Math.PI * 2); ctx.fill() }, { depth: 2.2, shoulder: 0.9, profile: 'u' })
  return p.bake()
}

/** the whorl on the cap tops (photo-02: a whorl of thick raised comma ridges round the knob, legible on the far
 *  cap): square panel over the cap seen from above (polar-mapped in sculpture.js). Four fat commas, each a round
 *  head at r ≈ 6 sweeping out into a tapering tail, raised ≈ 1 mm with round shoulders. */
export const WHORL = { S: 25.6 }
export function whorlPanel(kit, { ppmm, seed }) {
  const S = WHORL.S, c = S / 2
  const p = new kit.ReliefPanel({ width: S, height: S, ppmm, seed })
  const els = []
  for (let k = 0; k < 4; k++) {
    const a0 = (k * 90 + 20) * Math.PI / 180
    const ctrl = []
    for (let i = 0; i <= 6; i++) {
      const t = i / 6, a = a0 - t * 1.9, r = 5.6 + t * 5.0
      ctrl.push([c + r * Math.cos(a), c + r * Math.sin(a)])
    }
    els.push(kit.roundStroke(ctrl, { width: [2.9, 2.6, 2.3, 2.0, 1.6, 1.2, 0.7], round: 0.5, inner: 0.3, start: 'round', end: 'point' }))
  }
  kit.carve(p, els, { height: 1.7, shoulder: 0.9, contour: false, fill: { kind: 'none' }, seed })
  return p.bake()
}
