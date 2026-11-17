// Nezu jue — the décor panels, drawn from the traced data in trace.js.
//
// Slab pass (.work/slab-nezu-jue/NOTES.md, reference/nezu-jue/slabs.json): the owner TRACED the band over photo-02
// (owner-trace-band.json): every figure is ONE fat raised slab with rounded-square corners — a crook curling in round
// a pocket, J hooks — standing clearly proud of a fine ground of squared spirals. The earlier ridge pass (a pavement
// of square-cornered plates with spirals on the figure tops) read the photograph inside out and was rejected. Now:
// each slab is an OUTLINE (the owner's three as drawn; the rest painted roughly and snapped to the photograph's edges
// with tools/snap.py), raised with kit.tracedPlates; a narrow dark channel round each; the eye's frame line, its pit,
// lid bar and slit, and the nose column's notches are cut INTO their slabs; deep pockets in the curls; everything
// else in the band is packed with fine squared spirals (kit.leiwenFill). drawFigures / spiralCells below now serve
// only the upper-wall triangle.
//
// ONE panel wraps the whole cup: x = developed mm at r 34.4 from θ 90 (the handle: the seam hides under it),
// y = height − PANEL.y0; it covers the band (y 101 … 140) and the side parts of the upper wall up to the rim.
// Layout round the cup (θ → panel x): handle 90 → 0 · tail mask nose 180 → 54.0 · opposite the handle 270 → 108.1 ·
// spout mask nose 0/360 → 162.1. The traced half (handle side of the tail mask) is mirrored about each nose; the
// spout mask repeats the tail mask (not in the photograph: INFERRED); the filler hooks by the handle (slabs 9, 10:
// dark, foreshortened, guessed) are mirrored about the handle seam and repeated opposite it (INFERRED).
import { REG } from './form.js'
import { TRIANGLE } from './trace.js'
import SLABS from '../../../reference/nezu-jue/slabs.json'

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
/** slab pass: the band's figures are fat slabs on a fine spiral ground (heights from the photograph's cast shadows:
 *  ≈ 8–12 px dark crescents under the slabs at ≈ 15° elevation → ≈ 1.5–2 mm proud; INFERRED ± 0.5 mm) */
export const SLAB = { height: 2.2, shoulder: 0.5, contourInset: 0.62, line: 0.38, lineDepth: 0.3, boss: 2.1, channel: 0.5, channelDepth: 0.55 }
/** the fine ground: squared spirals, ≈ 2–3 mm cells of ≈ 1.5 turns in the photograph (pink columns, bottom border) */
export const GROUND = { pitch: 0.6, line: 0.46, depth: 0.26, roundness: 0.08, cell: [1.9, 3.0], jitter: 0.04, fillers: true, pairs: 0.5, mode: 'sunk' }

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
  // SLAB PASS (.work/slab-nezu-jue/NOTES.md; reference/nezu-jue/slabs.json): every figure of the band is ONE fat
  // raised slab with rounded-square corners (the owner's own tracing: a crook and two J hooks), standing on a ground
  // packed with fine squared spirals; deep pockets in the curls; a few slabs carry an incised line / notches / the eye.
  const outline = (L, X) => L.map(X)
  const copies = [] // [X, group]
  for (const cx of [NOSE.tail, NOSE.spout]) for (const side of [1, -1]) copies.push([([u, v]) => [cx - side * (NOSE.tail - FX(u)), FY(v)], 'mask'])
  for (const [cx, side] of [[0, 1], [W, -1], [xOfAz(270), 1], [xOfAz(270), -1]]) copies.push([([u, v]) => [cx + side * FX(u), FY(v)], 'filler'])
  const wide = [], narrow = []
  for (const [X, g] of copies) for (const s of SLABS.slabs) if (s.group === g) (s.incised === 'contour' ? wide : narrow).push({ outer: outline(s.face_mm, X), holes: [] })
  const slabOpts = { height: SLAB.height, shoulder: SLAB.shoulder, union: true, seed }
  kit.tracedPlates(p, wide, { ...slabOpts, contour: { inset: SLAB.contourInset, line: SLAB.line }, depth: SLAB.lineDepth })
  kit.tracedPlates(p, narrow, { ...slabOpts, contour: false })
  // a narrow dark channel round every slab (the photograph's dark outline between slab and ground)
  const allSlabs = [...wide, ...narrow]
  p.sink((ctx) => {
    ctx.lineJoin = 'round'; ctx.lineWidth = 2 * SLAB.channel
    ctx.beginPath(); for (const s of allSlabs) { s.outer.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath() }
    ctx.stroke()
    ctx.globalCompositeOperation = 'destination-out'; ctx.fill('nonzero'); ctx.globalCompositeOperation = 'source-over'
  }, { depth: SLAB.channelDepth, shoulder: 0.2, profile: 'u' })
  // never let a pocket bite a slab (the owner's outlines stay as drawn)
  const slabCut = (ctx) => {
    ctx.globalCompositeOperation = 'destination-out'
    ctx.beginPath(); for (const s of allSlabs) { s.outer.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath() }
    ctx.fill('nonzero'); ctx.globalCompositeOperation = 'source-over'
  }
  // the eye (on its slab): a sunk oval pit over a raised lower-lid bar with a slit, two lines incised across the top
  const E = SLABS.eye
  for (const [X, g] of copies) {
    if (g !== 'mask') continue
    const kx = (u) => Math.abs(X([u + 0.5, 0])[0] - X([u - 0.5, 0])[0])
    const pc = X(E.pit.c)
    p.sink((ctx) => { ctx.beginPath(); ctx.ellipse(pc[0], pc[1], E.pit.r[0] * kx(E.pit.c[0]), E.pit.r[1] / 0.978, 0, 0, Math.PI * 2); ctx.fill() }, { depth: SLAB.height - 0.25, shoulder: 0.5, profile: 'u' })
    const [l0, l1] = [X(E.lid.box[0]), X(E.lid.box[1])]
    p.raise((ctx) => { ctx.beginPath(); rrect(ctx, Math.min(l0[0], l1[0]), Math.min(l0[1], l1[1]), Math.abs(l1[0] - l0[0]), Math.abs(l1[1] - l0[1]), 0.6); ctx.fill() }, { height: SLAB.height + 0.3, shoulder: 0.35, profile: 'plateau' })
    p.sink((ctx) => {
      ctx.lineCap = 'round'
      ctx.lineWidth = 0.42; strokePath(ctx, E.slit.map(X))
      ctx.lineWidth = SLAB.line; for (const L of E.lines) strokePath(ctx, L.map(X))
    }, { depth: 0.38, shoulder: 0.15, profile: 'u' })
    // notches cut into the nose column (photo: dark nicks down its inner edge)
    p.sink((ctx) => { for (const c of SLABS.notches.c) { const q = X(c); ctx.beginPath(); ctx.arc(q[0], q[1], SLABS.notches.r, 0, Math.PI * 2); ctx.fill() } }, { depth: SLABS.notches.depth, shoulder: 0.2, profile: 'u' })
  }
  // the small round boss under the arch, with its pit
  for (const [X, g] of copies) if (g === 'mask') for (const b of SLABS.bosses) {
    const c = X(b.c)
    kit.pillowBoss(p, { c, w: 2 * b.r, h: 2 * b.r / 0.978, round: 1, height: SLAB.boss, crown: 0.6, slit: false })
    p.sink((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], b.hole, 0, Math.PI * 2); ctx.fill() }, { depth: 1.1, shoulder: 0.25, profile: 'u' })
  }
  // the fine ground: squared spirals packed into everything the slabs leave inside the band (not into the pockets)
  const pocketList = []
  for (const [X, g] of copies) for (const k of SLABS.pockets) if ((k.c[0] < -9) === (g === 'filler')) {
    const c = X(k.c), w = Math.abs(X([k.c[0] + k.r[0], 0])[0] - X([k.c[0] - k.r[0], 0])[0]) / 2
    pocketList.push([c, w, k.r[1] / 0.978, k.depth])
  }
  const pocketPath = (ctx) => { ctx.beginPath(); for (const [c, rx, ry] of pocketList) { ctx.moveTo(c[0] + rx, c[1]); ctx.ellipse(c[0], c[1], rx, ry, 0, 0, Math.PI * 2) } }
  kit.leiwenFill(p, {
    rect: { x: 0, y: yb0 + 0.2, w: W, h: yb1 - yb0 - 0.4 },
    include: (ctx) => { ctx.fillRect(-1, yb0, W + 2, yb1 - yb0); ctx.globalCompositeOperation = 'destination-out'; pocketPath(ctx); ctx.fill(); ctx.globalCompositeOperation = 'source-over' },
    avoid: 'raised', margin: 0.62,
  }, { ...GROUND, seed })
  // deep pockets in the curls (dark in the photograph)
  for (const dep of [...new Set(pocketList.map((k) => k[3]))]) {
    p.sink((ctx) => { ctx.beginPath(); for (const [c, rx, ry, d] of pocketList) if (d === dep) { ctx.moveTo(c[0] + rx, c[1]); ctx.ellipse(c[0], c[1], rx, ry, 0, 0, Math.PI * 2) } ctx.fill(); slabCut(ctx) }, { depth: dep, shoulder: 0.45, profile: 'u' })
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
