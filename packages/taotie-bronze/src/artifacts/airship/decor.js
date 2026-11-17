// airship — the décor, one ReliefPanel per hull register (both halves of the hull share each),
// one for the nose cap, one for the four fins, one for the stand's foot and one for the dragon,
// all in the kit's rounded vocabulary (KIT.md § Rounded bands): fat flat-topped bands with
// hooked or rolled ends, a sunk contour line and spiral chains on their tops, pillow eyes, a
// fine leiwen (thunder) ground.
//
// Hull panels: x runs round the hull keel → keel (x = W/2 is the side flange: every unit is
// symmetric about it and the panel is drawn on its left half and mirrored), y runs aft → fore,
// so a mask's "up" points at the nose — the gu laid on its side. Registers, nose → tail:
//   nose    a taotie looking forward, its nose the mooring cone (polar panel seen from +X)
//   bow     rising blades, a cicada in each, tips toward the nose
//   fore    kui confronting the side flange
//   mask    the main taotie, the side flange its nose ridge (fullest part of the hull)
//   aft     cloud scrolls — the S- and C-curls of the cloud pattern 云纹
//   blades  hanging blades with cicadas on the long taper, tips toward the tail
//   tail    thunder ground between the fins
// Bowstrings (弦纹) at the ring frames between registers.

const LINE = 0.42
const H1 = 1.7 // L1 plateau (mm)
const H2 = 2.5 // L2 eyes
const GROUND = { pitch: 0.85, line: 0.5, depth: 0.32, roundness: 0.15, jitter: 0.06, pairs: 0.6, echo: 1 }

const contour = (inset = 0.7) => ({ inset, line: LINE })
const spiralsFill = (o = {}) => ({ kind: 'spirals', line: 0.36, pitch: 0.66, gap: 0.32, square: 0.25, tail: false, min: 2.4, ...o })
const panelOf = (kit, w, h, ppmm, seed) => new kit.ReliefPanel({ width: w, height: h, ppmm, seed })

/** two raised ring lines across the panel at y (bowstrings on a ring frame) */
function rings(kit, panel, W, y, { count = 2, width = 1.3, spacing = 2.6, height = 0.8 } = {}) {
  kit.bowstrings(panel, { x: -1, y: y - (spacing * (count - 1)) / 2 - width, w: W + 2, h: spacing * (count - 1) + 2 * width }, { count, width, height, spacing })
}

/** half-mask frame: X mm out from the side flange (x = W/2) toward the top keel, Y mm up the panel */
const frameOf = (W) => {
  const cx = W / 2
  const P = ([X, Y]) => [cx - X, Y]
  return { cx, P, Ps: (pts) => pts.map(P) }
}

/** the per-panel jobs, in build order: [name, () => ReliefMap] */
export function jobs(kit, L, { q = 1, seed = 1929 } = {}) {
  const sq = Math.sqrt(q)
  return [
    ['mask', () => maskPanel(kit, L.mask, { ppmm: 7 * sq, seed: seed + 1 })],
    ['nose', () => nosePanel(kit, L.nose, { ppmm: 8 * sq, seed: seed + 2 })],
    ['fore', () => forePanel(kit, L.fore, { ppmm: 7.5 * sq, seed: seed + 3 })],
    ['aft', () => aftPanel(kit, L.aft, { ppmm: 6.5 * sq, seed: seed + 4 })],
    ['bow', () => bowPanel(kit, L.bow, { ppmm: 6 * sq, seed: seed + 5 })],
    ['blades', () => bladesPanel(kit, L.blades, { ppmm: 6 * sq, seed: seed + 6 })],
    ['tail', () => tailPanel(kit, L.tail, { ppmm: 5 * sq, seed: seed + 7 })],
    ['fin', () => finPanel(kit, L.fin, { ppmm: 6 * sq, seed: seed + 8 })],
    ['foot', () => footPanel(kit, L.foot, { ppmm: 4.5 * sq, seed: seed + 9 })],
    ['dragon', () => dragonPanel(kit, L.dragon, { ppmm: 7 * sq, seed: seed + 10 })],
  ]
}

// ------------------------------------------------------------------ mask: the main taotie (sideways: up = forward)

/** the taotie's elements in its own frame (X out from the nose axis, Y up), scaled by k, lifted by oy */
function taotieElements(kit, Q, k) {
  const w = (a) => a.map((v) => v * k)
  return [
    // nose ridge: the side flange stands on it
    kit.roundPoly(Q([[-1, 10.0], [5.4, 10.0], [5.4, 38.0], [-1, 38.0]]), { round: [0, 2.2 * k, 2.2 * k, 0], contour: contour(0.8), ticks: { side: 'outer', pitch: 2.4, line: 0.36, length: 0.8 } }),
    // horn: a fat G — up beside the nose, across the brow, down the outer column, back in, rolled into its bay
    kit.roundStroke(Q([[9.6, 31.6], [9.6, 40.4], [37.6, 40.4], [37.6, 27.4], [31.4, 27.4]]), {
      width: w([6.4, 7.2, 7.4, 6.8, 6.0]), round: 0.85, inner: 0.3, start: 'blunt', end: 'round',
      contour: { inset: [0.75, 1.5], line: LINE }, ticks: { side: 'outer', pitch: 2.5, line: 0.34 }, fill: spiralsFill({ min: 3.0 }),
    }),
    // brow over the eye, its outer end bending down
    kit.roundStroke(Q([[8.2, 26.4], [21.4, 26.8], [25.0, 23.2]]), { width: w([3.8, 4.4, 3.2]), round: 0.9, inner: 0.3, end: 'round', contour: contour(0.6) }),
    // cheek / ear: a rounded block cut with a coil
    kit.roundPlate({ c: Q([[33.6, 16.4]])[0], w: 10.4 * k, h: 11.0 * k, r: 4.6 * k, contour: contour(0.6), fill: { kind: 'coil', pitch: 0.95, line: LINE, offset: [0.6, 0.4] } }),
    // upper jaw: out under the eye, down and back in to a fang
    kit.roundStroke(Q([[7.4, 13.2], [26.6, 13.2], [26.6, 5.2], [15.6, 5.2]]), {
      width: w([5.0, 5.2, 4.8, 4.0]), round: 0.85, inner: 0.3, end: 'round', contour: contour(0.6), fill: spiralsFill({ min: 2.6 }),
    }),
    // the lower curl in the outer corner, rolled in toward the face
    kit.roundStroke(Q([[33.0, 9.0], [40.6, 9.0], [40.6, 4.0]]), { width: w([4.0, 4.2, 3.4]), round: 0.9, inner: 0.3, end: 'spiral', spiral: { turns: 0.8, dir: -1, gap: 0.6 }, contour: contour(0.5) }),
  ]
}

export function maskPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  const { cx, P, Ps } = frameOf(W)
  const k = 1.15
  const oy = H / 2 - 23 * k // the design spans Y ≈ 2 … 44
  const Q = (pts) => Ps(pts.map(([x, y]) => [x * k, y * k + oy]))
  rings(kit, panel, W, 3.4)
  rings(kit, panel, W, H - 3.4)
  kit.carve(panel, taotieElements(kit, Q, k), { height: H1, shoulder: 0.55, depth: 0.32, irregularity: 0.8, seed })
  kit.pillowBoss(panel, { c: P([16.6 * k, 20.0 * k + oy]), w: 12.4 * k, h: 9.6 * k, round: 0.62, height: H2, crown: 0.9, slit: { len: 4.4, width: 0.85, depth: 0.6, offset: [-0.4, -0.2] } })
  kit.leiwenFill(panel, { rect: { x: 0, y: 6.4, w: cx, h: H - 12.8 }, margin: 0.55 }, { ...GROUND, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ nose: a taotie looking forward round the mooring cone

export function nosePanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  const cx = W / 2, cy = H / 2
  const R = size.rho - 1.6 // the cap's rim (polar radius)
  // author frame: X out from the vertical axis (to the viewer's left half), Y up from the centre
  const k = 0.9
  const Q = (pts) => pts.map(([X, Y]) => [cx - X * k, cy + Y * k])
  const els = [
    // horns: rising beside the cone, out over the brow and curling down at the rim
    kit.roundStroke(Q([[5.2, 6.8], [5.2, 14.6], [17.6, 14.6], [17.6, 8.0]]), {
      width: [3.8, 4.4, 4.4, 3.4], round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 0.9, dir: -1, gap: 0.5 },
      contour: contour(0.55), fill: spiralsFill({ min: 2.0, pitch: 0.6 }),
    }),
    // brow
    kit.roundStroke(Q([[6.6, 5.0], [14.0, 5.0]]), { width: [2.6, 2.2], round: 0.9, inner: 0.3, end: 'point', contour: false }),
    // jaw under the eye: out and down, its end hooking back as a fang
    kit.roundStroke(Q([[5.4, -5.8], [16.6, -5.8], [16.6, -12.6], [10.6, -12.6]]), {
      width: [3.4, 3.6, 3.4, 2.6], round: 0.85, inner: 0.3, end: 'round', contour: contour(0.5), fill: spiralsFill({ min: 1.9, pitch: 0.6 }),
    }),
    // chin bar under the cone
    kit.roundPlate({ c: Q([[0, -8.6]])[0], w: 7.2, h: 4.0, r: 1.6, contour: contour(0.45) }),
    // ear at the side
    kit.roundStroke(Q([[21.4, 3.4], [21.4, -3.6]]), { width: [3.4, 2.4], round: 0.9, end: 'spiral', spiral: { turns: 0.7, dir: 1, gap: 0.45 }, contour: false }),
  ]
  kit.carve(panel, els, { height: 1.5, shoulder: 0.5, depth: 0.3, irregularity: 0.6, seed })
  kit.pillowBoss(panel, { c: Q([[10.4, 0.6]])[0], w: 7.6 * k, h: 6.0 * k, round: 0.6, height: 2.3, crown: 0.9, slit: { len: 2.8, width: 0.65, depth: 0.5 } })
  // a raised ring at the rim of the cap, and the ground inside it
  panel.raise((ctx) => {
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.arc(cx, cy, R - 1.3, 0, Math.PI * 2, true); ctx.fill()
  }, { height: 0.8, profile: 'plateau', shoulder: 0.35 })
  kit.leiwenFill(panel, {
    include: (ctx) => { ctx.beginPath(); ctx.arc(cx, cy, R - 1.6, 0, Math.PI * 2); ctx.arc(cx, cy, 5.6, 0, Math.PI * 2, true); ctx.fill() },
    rect: { x: 0, y: 0, w: cx, h: H }, margin: 0.45,
  }, { ...GROUND, pitch: 0.72, echo: 0, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ fore: kui confronting the side flange

/** a kui facing the axis (head at X0, body running outward, tail up and rolled), drawn for a 14 mm band × k */
function kuiElements(kit, Q, X0, len, k) {
  const X1 = X0 + len
  const w = (a) => a.map((v) => v * k)
  return [
    kit.roundPlate({ c: Q([[X0 + 5.2, 10.0]])[0], w: 8.4 * k, h: 8.8 * k, r: 3.0 * k, contour: contour(0.55) }),
    kit.roundStroke(Q([[X0 + 2.4, 15.6], [X0 - 1.2, 15.6], [X0 - 1.2, 9.6]]), { width: w([2.8, 2.8, 2.2]), round: 0.7, inner: 0.2, end: 'point', contour: false }),
    kit.roundStroke(Q([[X0 + 11.2, 8.2], [X1 - 5.5, 8.2], [X1, 8.2], [X1, 14.8], [X1 - 5.0, 14.8]]), {
      width: w([4.6, 4.2, 3.8, 3.4, 3.0]), round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 0.85, dir: -1, gap: 0.55 },
      contour: contour(0.55), fill: spiralsFill({ joints: true, min: 2.0, pitch: 0.72 }),
    }),
    kit.roundStroke(Q([[X0 + 13, 12.2], [X0 + 13, 15.8], [X0 + 21, 15.8]]), { width: w([2.8, 2.8, 2.0]), round: 0.7, inner: 0.2, end: 'point', contour: false }),
    kit.roundStroke(Q([[X0 + 16, 5.0], [X0 + 23, 4.0]]), { width: w([2.6, 1.6]), round: 0.7, end: 'point', contour: false }),
  ]
}

export function forePanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  const { cx, P, Ps } = frameOf(W)
  const k = 1.55
  const oy = (H - 20 * k) / 2 - 0.6
  const Q = (pts) => Ps(pts.map(([x, y]) => [x * k, y * k + oy]))
  const X0 = 4.4, len = (cx - 4) / k - X0 - 3
  rings(kit, panel, W, 2.6)
  rings(kit, panel, W, H - 2.6)
  kit.carve(panel, kuiElements(kit, Q, X0, len, k), { height: 1.5, shoulder: 0.5, depth: 0.3, irregularity: 0.8, seed })
  kit.pillowBoss(panel, { c: P([(X0 + 5.2) * k, 10.6 * k + oy]), w: 4.8 * k, h: 4.4 * k, round: 0.55, height: 2.2, crown: 0.9, slit: { len: 2.4, width: 0.6, depth: 0.45 } })
  kit.leiwenFill(panel, { rect: { x: 0, y: 5.2, w: cx, h: H - 10.4 }, margin: 0.5 }, { ...GROUND, pitch: 0.78, echo: 0, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ aft: cloud scrolls

export function aftPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  const { cx, Ps } = frameOf(W)
  rings(kit, panel, W, 2.6)
  rings(kit, panel, W, H - 2.6)
  const yb = 6.2, yt = H - 6.2, ym = (yb + yt) / 2, bh = yt - yb
  const half = cx - 2.5
  // two S-scrolls per half: a fat bar whose ends roll up into opposite spirals; between them a C-curl
  const n = 2, unit = half / n
  const els = []
  for (let i = 0; i < n; i++) {
    const X0 = 2.5 + i * unit + unit * 0.22, X1 = 2.5 + (i + 1) * unit - unit * 0.22
    const R = bh * 0.27
    els.push(kit.roundStroke(Ps([[X0, ym - bh * 0.06], [X1, ym + bh * 0.06]]), {
      width: [5.6, 5.6], round: 0.9, inner: 0.3, start: 'spiral', end: 'spiral',
      startSpiral: { turns: 1.15, dir: 1, gap: 0.7, R }, spiral: { turns: 1.15, dir: 1, gap: 0.7, R },
      contour: contour(0.6), fill: spiralsFill({ min: 2.4 }),
    }))
  }
  // small C-curls in the gaps, opening toward the keel
  for (let i = 0; i <= n; i++) {
    const X = 2.5 + i * unit
    if (X > half - 1 || X < 3) continue
    const c = Ps([[X, ym]])[0]
    els.push(kit.roundPlate({ c, w: 5.4, h: 9.4, r: 2.4, contour: contour(0.5), fill: { kind: 'coil', pitch: 0.85, line: LINE } }))
  }
  kit.carve(panel, els, { height: 1.6, shoulder: 0.5, depth: 0.3, irregularity: 0.8, seed })
  kit.leiwenFill(panel, { rect: { x: 0, y: 5.2, w: cx, h: H - 10.4 }, margin: 0.5 }, { ...GROUND, pitch: 0.78, roundness: 0.85, echo: 1, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ blades (bow: rising, tail taper: hanging)

/**
 * count blades per half-hull panel, centred on W/(2 count)·(2i+1): each a rounded triangle with a contour line
 * and a cicada inside (head plate with two pillow eyes at the broad end, a chevroned body tapering to the tip).
 * dir +1 = tips toward +y (the nose), −1 = toward −y (the tail). y0/y1 = base and tip lines.
 */
function blades(kit, panel, W, { count = 4, dir, yBase, yTip, seed }) {
  const bw = W / count
  const plates = [], cicadas = [], eyes = []
  for (let i = 0; i < count / 2; i++) { // left half only (mirrored)
    const c = bw * (i + 0.5)
    const half = bw / 2 - 1.4
    const Y = (t) => yBase + (yTip - yBase) * t // t 0 base → 1 tip
    plates.push(kit.roundPoly([[c - half, Y(0)], [c + half, Y(0)], [c, Y(1)]], { round: [2.2, 2.2, 1.2], contour: { inset: 1.3, line: LINE } }))
    const len = Math.abs(yTip - yBase)
    const hh = Math.min(7.4, Math.max(4.2, len * 0.16))
    const headY = Y(0) + dir * (hh / 2 + 2.2)
    cicadas.push(kit.roundPlate({ c: [c, headY], w: half * 1.35, h: hh, r: Math.min(2.6, hh * 0.4), contour: contour(0.5) }))
    cicadas.push(kit.roundStroke([[c, headY + dir * (hh / 2 + 1.0)], [c, Y(len > 60 ? 0.6 : 0.8)]], { width: [half * 0.78, 1.6], round: 0.5, end: 'point', contour: contour(0.5), fill: { kind: 'lines', line: 0.38, pitch: 1.25 } }))
    eyes.push([c - half * 0.36, headY], [c + half * 0.36, headY])
  }
  kit.carve(panel, plates, { height: 0.9, shoulder: 0.4, depth: 0.28, seed })
  kit.carve(panel, cicadas, { height: 1.7, shoulder: 0.45, depth: 0.28, seed: seed + 1 })
  for (const c of eyes) kit.pillowBoss(panel, { c, w: 3.6, h: 3.4, round: 0.8, height: 2.4, crown: 1, base: 'field', slit: false })
}

export function bowPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  rings(kit, panel, W, 2.6)
  blades(kit, panel, W, { count: 4, dir: 1, yBase: 5.6, yTip: H - 0.6, seed })
  kit.leiwenFill(panel, { rect: { x: 0, y: 4.6, w: W / 2, h: H - 5.4 }, margin: 0.45 }, { ...GROUND, pitch: 0.7, echo: 0, seed })
  panel.mirrorX()
  return panel.bake()
}

export function bladesPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  rings(kit, panel, W, H - 2.6)
  rings(kit, panel, W, 2.6)
  blades(kit, panel, W, { count: 4, dir: -1, yBase: H - 6.0, yTip: 7.0, seed })
  kit.leiwenFill(panel, { rect: { x: 0, y: 5.4, w: W / 2, h: H - 10.8 }, margin: 0.5 }, { ...GROUND, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ tail: thunder ground between the fins

export function tailPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  rings(kit, panel, W, H - 2.6)
  rings(kit, panel, W, 16, { count: 2, width: 1.1, spacing: 2.2 })
  // a narrow raised band down each bay's middle: the girder between the fins, carrying hooked notches
  const bays = 4, bw = W / bays
  panel.raise((ctx) => {
    for (let i = 0; i < 2; i++) {
      const c = bw * (i + 0.5)
      ctx.beginPath(); ctx.moveTo(c - 2.2, H - 6); ctx.lineTo(c + 2.2, H - 6); ctx.lineTo(c + 0.8, 20); ctx.lineTo(c - 0.8, 20); ctx.closePath(); ctx.fill()
    }
  }, { height: 1.0, profile: 'plateau', shoulder: 0.4 })
  kit.leiwenFill(panel, { rect: { x: 0, y: 19, w: W / 2, h: H - 25 }, margin: 0.5 }, { ...GROUND, pitch: 0.8, roundness: 0.9, echo: 1, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ fins: one panel for all four (both faces)

export function finPanel(kit, size, { ppmm, seed }) {
  const R = size.rect
  const panel = panelOf(kit, R.w, R.h, ppmm, seed)
  const T = ([x, y]) => [x - R.x, y - R.y] // plate mm → panel mm
  const outline = size.outline.map(T)
  // a raised rim round the whole leaf (the outside half is cut away by the plate's own edge)
  panel.raise((ctx) => {
    ctx.lineWidth = 4.4; ctx.lineJoin = 'round'
    ctx.beginPath(); outline.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke()
    // and the hinge line, a raised bar either side of the slots
    const hx = size.hinge - R.x
    ctx.beginPath(); ctx.rect(hx - 2.6, 4, 5.2, R.h - 10); ctx.fill()
  }, { height: 1.2, profile: 'plateau', shoulder: 0.45 })
  // a kui flying forward on the fin's field: head toward the nose (+x), body and rolled tail aft
  const k = 0.62, xHead = -160.5, y0 = 11.2
  const Q = (pts) => pts.map(([X, Y]) => T([xHead - X * k, y0 + Y * k]))
  const els = kuiElements(kit, Q, 0, 28, k)
  // the rudder: a scaled ladder band down the leaf
  const rx = (size.hinge + size.back) / 2
  els.push(kit.roundStroke([T([rx, 6]), T([rx, 16])], { width: [7.6, 6.8], round: 0.5, end: 'round', start: 'blunt', contour: contour(0.8), fill: { kind: 'scales', line: 0.4, pitch: 2.8 } }))
  kit.carve(panel, els, { height: 1.4, shoulder: 0.5, depth: 0.3, irregularity: 0.7, seed })
  kit.pillowBoss(panel, { c: T([xHead - 5.2 * k, y0 + 10.6 * k]), w: 4.8 * k, h: 4.4 * k, round: 0.55, height: 2.1, crown: 0.9, slit: { len: 2.6, width: 0.6, depth: 0.45 } })
  kit.leiwenFill(panel, {
    include: (ctx) => { ctx.beginPath(); outline.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill() },
    margin: 0.5,
  }, { ...GROUND, pitch: 0.8, echo: 0, seed })
  return panel.bake()
}

// ------------------------------------------------------------------ the stand: foot band and the dragon's scales

export function footPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  rings(kit, panel, W, 2.4, { count: 1, width: 1.4 })
  rings(kit, panel, W, H - 2.4, { count: 1, width: 1.4 })
  // eight whorl bosses round the foot, cloud S-scrolls between them
  const n = 8, cell = W / n
  const yb = 4.6, yt = H - 4.6, ym = (yb + yt) / 2, bh = yt - yb
  const els = []
  for (let i = 0; i < n; i++) {
    const X0 = (i + 0.5) * cell + bh * 0.62, X1 = (i + 1.5) * cell - bh * 0.62
    els.push(kit.roundStroke([[X0, ym - bh * 0.1], [X1, ym + bh * 0.1]], {
      width: [4.4, 4.4], round: 0.9, inner: 0.3, start: 'spiral', end: 'spiral',
      startSpiral: { turns: 1.0, dir: 1, gap: 0.6, R: bh * 0.26 }, spiral: { turns: 1.0, dir: 1, gap: 0.6, R: bh * 0.26 },
      contour: contour(0.5), fill: spiralsFill({ min: 2.0 }),
    }))
  }
  kit.carve(panel, els, { height: 1.4, shoulder: 0.45, depth: 0.28, irregularity: 0.7, seed })
  for (let i = 0; i < n; i++) {
    const d = Math.min(bh * 0.92, 15)
    kit.drawMotif(panel, 'whorl', { x: (i + 0.5) * cell - d / 2, y: ym - d / 2, w: d, h: d }, {}, { preset: 'four-spokes', ground: false })
  }
  kit.leiwenFill(panel, { rect: { x: 0, y: 4.2, w: W, h: H - 8.4 }, margin: 0.45 }, { ...GROUND, pitch: 0.8, echo: 0, roundness: 0.8, seed })
  return panel.bake()
}

export function dragonPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  // the belly (x near 0 and W: toward the column) plain plates across, the back scaled with a dorsal ridge
  kit.drawMotif(panel, 'scales', { x: W * 0.18, y: 0, w: W * 0.64, h: H }, { scale: 2.8, open: 'down', relief: { motif: 0.6, boss: 1.2, groove: 0.35 } }, { ground: false })
  panel.raise((ctx) => { ctx.beginPath(); ctx.rect(W / 2 - 0.8, 2, 1.6, H - 4); ctx.fill() }, { height: 1.3, profile: 'ridge' })
  panel.sink((ctx) => {
    ctx.lineWidth = 0.5
    for (let y = 2; y < H - 2; y += 2.4) for (const x0 of [0, W * 0.82]) { ctx.beginPath(); ctx.moveTo(x0 + 0.5, y); ctx.lineTo(x0 + W * 0.17, y); ctx.stroke() }
  }, { depth: 0.3, shoulder: 0.25, profile: 'u' })
  return panel.bake()
}
