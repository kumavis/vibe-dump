// utah-teapot — the décor, one ReliefPanel per register, all in the kit's rounded vocabulary
// (KIT.md § Rounded bands): fat flat-topped bands with open hooked or rolled ends, a sunk contour
// line and spiral chains on their tops, pillow-convex eyes, a fine leiwen ground.
//
// Layout (designed by the project lead): the two broad faces (±Z) each carry one taotie in the
// belly register, its nose ridge (under the ±Z flange) on the axis; the spout (+X) and the handle
// (−X) sit where the mould sections join. Registers bottom → top: two bowstrings under the bowl ·
// the taotie (tall) · confronting kui and whorl circles on the shoulder · two bowstrings under the
// rim bead. Lid: eight cicada blades radiating round the knob; knob: a turned neck, a whorl cap.
// Spout: a beast mask at the root with the spout issuing from its jaws, a bowstring collar and a
// blade pointing to the mouth (plain lip). Handle: a scaled back band ending in a hooked tail.
//
// Authoring frame for the half-masks: X mm OUTWARD from the axis (author the LEFT half seen from
// outside: panel x = W/2 − X), Y mm up from the panel bottom. Every panel draws its left half,
// lays the leiwen on it and mirrors (ReliefPanel.mirrorX), as kit.drawMotif does.

import { HEAD_SLEEVE_END } from './sculpture.js'

const LINE = 0.42 // every hand groove on a plateau top, mm
const H1 = 1.7 // L1 plateau height on the belly (mm proud of the ground)
const H2 = 2.5 // L2 eye bosses
const GROUND = { pitch: 0.82, line: 0.5, depth: 0.32, roundness: 0.12, jitter: 0.06, pairs: 0.6, echo: 1 }

/** the per-panel jobs, in build order: [name, () => ReliefMap] */
export function jobs(kit, L, { q = 1, seed = 1975 } = {}) {
  const sq = Math.sqrt(q)
  return [
    ['belly', () => bellyPanel(kit, L.belly, { ppmm: 8 * sq, seed: seed + 1 })],
    ['shoulder', () => shoulderPanel(kit, L.shoulder, { ppmm: 8 * sq, seed: seed + 2 })],
    ['low', () => lowPanel(kit, L.low, { ppmm: 5 * sq, seed: seed + 3 })],
    ['lid', () => lidPanel(kit, L.lid, { ppmm: 7 * sq, seed: seed + 4 })],
    ['neck', () => neckPanel(kit, L.neck, { ppmm: 6 * sq, seed: seed + 5 })],
    ['cap', () => capPanel(kit, L.cap, { ppmm: 12 * sq, seed: seed + 6 })],
    ['spout', () => spoutPanel(kit, L.spout, { ppmm: 7.5 * sq, seed: seed + 7 })],
    ['handle', () => handlePanel(kit, L.handle, { ppmm: 7 * sq, seed: seed + 8 })],
  ]
}

const panelOf = (kit, w, h, ppmm, seed) => new kit.ReliefPanel({ width: w, height: h, ppmm, seed })
/** authoring frame → left-half panel mm */
const frame = (W) => {
  const cx = W / 2
  const P = ([X, Y]) => [cx - X, Y]
  return { cx, P, Ps: (pts) => pts.map(P) }
}

/** thin raised border lines (register edges) across the whole panel */
function borders(panel, W, ys, { width = 1.1, height = 0.75 } = {}) {
  panel.raise((ctx) => {
    for (const y of ys) { ctx.beginPath(); ctx.rect(-1, y - width / 2, W + 2, width); ctx.fill() }
  }, { height, profile: 'plateau', shoulder: 0.35 })
}

const spiralsFill = (o = {}) => ({ kind: 'spirals', line: 0.34, pitch: 0.62, gap: 0.32, square: 0.25, tail: false, min: 2.4, ...o })
const contour = (inset = 0.7) => ({ inset, line: LINE })

// ------------------------------------------------------------------ belly: the main taotie

export function bellyPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  const { cx, P, Ps } = frame(W)
  const yb = 2.0, yt = H - 2.0 // border lines
  const oy = (H - 47) / 2 // the design is drawn for a 47 mm register
  const Q = (pts) => Ps(pts.map(([x, y]) => [x, y + oy]))
  const els = [
    // nose ridge: the flange stands on it
    kit.roundPoly(Q([[-1, 10.0], [5.4, 10.0], [5.4, 38.0], [-1, 38.0]]), { round: [0, 2.2, 2.2, 0], contour: contour(0.8), ticks: { side: 'outer', pitch: 2.2, line: 0.36, length: 0.8 } }),
    // horn: a fat G — up beside the nose, across the brow, down the outer column, back in, rolled up into its own bay
    kit.roundStroke(Q([[9.6, 31.6], [9.6, 40.4], [37.6, 40.4], [37.6, 27.4], [31.4, 27.4]]), {
      width: [6.4, 7.2, 7.4, 6.8, 6.0], round: 0.85, inner: 0.3, start: 'blunt', end: 'round',
      contour: { inset: [0.75, 1.5], line: LINE },
      ticks: { side: 'outer', pitch: 2.4, line: 0.34 }, fill: spiralsFill({ min: 3.0 }),
    }),
    // brow: a fat bar over the eye, its outer end bending down to a point
    kit.roundStroke(Q([[8.2, 26.4], [21.4, 26.8], [25.0, 23.2]]), { width: [3.8, 4.4, 3.2], round: 0.9, inner: 0.3, start: 'blunt', end: 'round', contour: contour(0.6) }),
    // cheek / ear: a rounded block cut with a coil, behind the eye
    kit.roundPlate({ c: P([33.4, 16.6 + oy]), w: 10.0, h: 10.6, r: 4.4, contour: contour(0.6), fill: { kind: 'coil', pitch: 0.95, line: LINE, offset: [0.6, 0.4] } }),
    // upper jaw: out under the eye, down and back in to a fang
    kit.roundStroke(Q([[7.4, 13.2], [26.6, 13.2], [26.6, 5.2], [15.6, 5.2]]), {
      width: [5.0, 5.2, 4.8, 4.0], round: 0.85, inner: 0.3, start: 'blunt', end: 'round', contour: contour(0.6), fill: spiralsFill({ min: 2.6 }),
    }),
    // the body: a fat jointed band out from behind the cheek, the tail rising and rolling back toward the face
    kit.roundStroke(Q([[42.6, 25.2], [76.0, 25.2], [86.6, 25.2], [86.6, 33.4]]), {
      width: [8.2, 7.6, 6.8, 5.8], round: 0.85, inner: 0.3, start: 'blunt', end: 'spiral',
      spiral: { turns: 1.2, dir: -1, gap: 0.8 }, contour: contour(0.75), fill: spiralsFill({ joints: true, min: 3.2 }),
    }),
    // crest: a broad hook standing on the back
    kit.roundStroke(Q([[45.6, 33.2], [45.6, 41.0], [67.0, 41.0], [67.0, 35.2]]), {
      width: [5.0, 5.4, 5.2, 3.6], round: 0.9, inner: 0.3, end: 'point', contour: contour(0.6), fill: spiralsFill({ min: 2.6 }),
    }),
    // the leg: down from the body, the claw curling up
    kit.roundStroke(Q([[51.6, 20.8], [51.6, 9.4], [62.8, 9.4]]), {
      width: [5.8, 5.6, 4.8], round: 0.9, inner: 0.3, end: 'spiral', spiral: { turns: 0.9, dir: -1, gap: 0.6 }, contour: contour(0.6),
    }),
    // the lower curl filling the outer corner, rolled in toward the face
    kit.roundStroke(Q([[71.4, 20.8], [71.4, 6.4], [89.4, 6.4], [89.4, 14.4]]), {
      width: [5.2, 5.6, 5.4, 4.6], round: 0.9, inner: 0.3, end: 'spiral', spiral: { turns: 1.0, dir: -1, gap: 0.65 },
      contour: contour(0.6), fill: spiralsFill({ min: 2.6 }),
    }),
  ]
  borders(panel, W, [yb, yt])
  kit.carve(panel, els, { height: H1, shoulder: 0.55, depth: 0.32, irregularity: 0.8, seed })
  // the eye: a pillow boss with a slit pupil, highest relief on the face
  kit.pillowBoss(panel, { c: P([16.6, 20.0 + oy]), w: 12.4, h: 9.6, round: 0.62, height: H2, crown: 0.9, slit: { len: 4.0, width: 0.8, depth: 0.6, offset: [-0.4, -0.2] } })
  kit.leiwenFill(panel, { rect: { x: 0, y: yb + 0.8, w: cx, h: yt - yb - 1.6 }, margin: 0.55 }, { ...GROUND, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ shoulder: confronting kui + whorl circles, bowstrings under the rim

/** a kui facing the axis (head at X0, body running outward, tail up and rolled back), 14 mm band */
function kuiElements(kit, Q, X0, len) {
  const X1 = X0 + len
  return [
    // head: a rounded block with the eye; an upper jaw hooking down in front of it
    kit.roundPlate({ c: Q([[X0 + 5.2, 10.0]])[0], w: 8.4, h: 8.8, r: 3.0, contour: contour(0.55) }),
    kit.roundStroke(Q([[X0 + 2.4, 15.6], [X0 - 1.2, 15.6], [X0 - 1.2, 9.6]]), { width: [2.8, 2.8, 2.2], round: 0.7, inner: 0.2, end: 'point', contour: false }),
    // body: jointed band, tail rises and rolls in
    kit.roundStroke(Q([[X0 + 11.2, 8.2], [X1 - 5.5, 8.2], [X1, 8.2], [X1, 14.8], [X1 - 5.0, 14.8]]), {
      width: [4.6, 4.2, 3.8, 3.4, 3.0], round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 0.85, dir: -1, gap: 0.55 },
      contour: contour(0.55), fill: spiralsFill({ joints: true, min: 2.0, pitch: 0.75 }),
    }),
    // crest on the back
    kit.roundStroke(Q([[X0 + 13, 12.2], [X0 + 13, 15.6], [X0 + 21, 15.6]]), { width: [2.8, 2.8, 2.0], round: 0.7, inner: 0.2, end: 'point', contour: false }),
    // leg / claw under the body
    kit.roundStroke(Q([[X0 + 16, 5.0], [X0 + 23, 4.2]]), { width: [2.6, 1.6], round: 0.7, end: 'point', contour: false }),
  ]
}

export function shoulderPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  const { cx, P, Ps } = frame(W)
  const yb = 1.6
  const Q = (pts) => Ps(pts.map(([x, y]) => [x, y + 0.6]))
  const els = [...kuiElements(kit, Q, 3.2, 37), ...kuiElements(kit, Q, 53.5, 33)]
  borders(panel, W, [yb, 17.6])
  kit.carve(panel, els, { height: 1.5, shoulder: 0.5, depth: 0.3, irregularity: 0.8, seed })
  for (const X0 of [3.2, 53.5]) kit.pillowBoss(panel, { c: P([X0 + 5.2, 10.6]), w: 4.6, h: 4.2, round: 0.55, height: 2.1, crown: 0.9, slit: { len: 1.8, width: 0.55, depth: 0.45 } })
  // whorl circle between the two kui
  kit.drawMotif(panel, 'whorl', { x: cx - 47.6 - 5.6, y: 4.0, w: 11.2, h: 11.2 }, {}, { preset: 'four-spokes', ground: false })
  kit.leiwenFill(panel, { rect: { x: 0, y: yb + 0.7, w: cx, h: 17.6 - yb - 1.4 }, margin: 0.5 }, { ...GROUND, pitch: 0.75, echo: 0, seed })
  // two bowstrings under the rim bead
  kit.bowstrings(panel, { x: -1, y: 18.6, w: W + 2, h: 5.4 }, { count: 2, width: 1.5, height: 0.85, spacing: 2.9 })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ low band: two bowstrings under the bowl

export function lowPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  kit.bowstrings(panel, { x: -1, y: H * 0.42, w: W + 2, h: 6 }, { count: 2, width: 1.6, height: 0.9, spacing: 3.2 })
  return panel.bake()
}

// ------------------------------------------------------------------ lid: eight cicada blades round the knob

export function lidPanel(kit, size, { ppmm, seed }) {
  const W = size.w, Hh = size.h
  const panel = panelOf(kit, W, Hh, ppmm, seed)
  const cx = W / 2, cy = Hh / 2
  const rIn = size.rNeck + 4.2, rOut = size.rEdge - 4.6
  // (ρ along the blade axis, t across) → panel, for the blade at azimuth az (deg; 0 = front)
  const at = (az) => {
    const a = (az * Math.PI) / 180, s = Math.sin(a), c = Math.cos(a)
    return ([r, t]) => [cx + r * s + t * c, cy - r * c + t * s]
  }
  const blades = [], cicadas = []
  for (let k = 0; k < 8; k++) {
    const T = at(22.5 + 45 * k)
    const half = Math.tan((20.5 * Math.PI) / 180) * rOut
    blades.push(kit.roundPoly([T([rOut, -half]), T([rOut, half]), T([rIn + 1.5, 0])], { round: [2.4, 2.4, 1.6], contour: { inset: 1.25, line: LINE } }))
    // the cicada: head plate at the broad end, a tapering chevroned body toward the knob
    cicadas.push(kit.roundPlate({ c: T([rOut - 6.2, 0]), w: 14.6, h: 6.6, r: 2.6, rot: 22.5 + 45 * k, contour: contour(0.5) }))
    cicadas.push(kit.roundStroke([T([rOut - 11.6, 0]), T([rIn + 7, 0])], { width: [5.6, 1.6], round: 0.5, end: 'point', contour: contour(0.5), fill: { kind: 'lines', line: 0.36, pitch: 1.1 } }))
  }
  kit.carve(panel, blades, { height: 0.9, shoulder: 0.4, depth: 0.28, seed })
  kit.carve(panel, cicadas, { height: 1.7, shoulder: 0.45, depth: 0.28, seed: seed + 1 })
  for (let k = 0; k < 8; k++) {
    const T = at(22.5 + 45 * k)
    for (const t of [-4.0, 4.0]) {
      const c = T([rOut - 6.2, t])
      kit.pillowBoss(panel, { c, w: 3.4, h: 3.4, round: 0.8, height: 2.3, crown: 1, base: 'field', slit: false })
    }
  }
  // the ring round the knob and the border line inside the lid edge
  panel.raise((ctx) => {
    ctx.beginPath(); ctx.arc(cx, cy, rIn - 0.4, 0, Math.PI * 2); ctx.arc(cx, cy, rIn - 2.0, 0, Math.PI * 2, true); ctx.fill()
    ctx.beginPath(); ctx.arc(cx, cy, rOut + 2.4, 0, Math.PI * 2); ctx.arc(cx, cy, rOut + 1.3, 0, Math.PI * 2, true); ctx.fill()
  }, { height: 0.75, profile: 'plateau', shoulder: 0.3 })
  kit.leiwenFill(panel, {
    include: (ctx) => { ctx.beginPath(); ctx.arc(cx, cy, rOut + 0.9, 0, Math.PI * 2); ctx.arc(cx, cy, rIn - 0.0, 0, Math.PI * 2, true); ctx.fill() },
    margin: 0.5,
  }, { ...GROUND, pitch: 0.78, echo: 0, follow: 0.4, seed })
  return panel.bake()
}

// ------------------------------------------------------------------ knob: turned neck, whorl cap

export function neckPanel(kit, size, { ppmm, seed }) {
  const panel = panelOf(kit, size.w, size.h, ppmm, seed)
  kit.bowstrings(panel, { x: -1, y: size.h * 0.32, w: size.w + 2, h: size.h * 0.36 }, { count: 2, width: 1.3, height: 0.7, spacing: 2.6 })
  return panel.bake()
}

export function capPanel(kit, size, { ppmm, seed }) {
  const panel = panelOf(kit, size.w, size.h, ppmm, seed)
  const d = 20.5
  kit.drawMotif(panel, 'whorl', { x: (size.w - d) / 2, y: (size.h - d) / 2, w: d, h: d }, { spokes: 5 }, { preset: 'five-spokes', ground: false })
  return panel.bake()
}

// ------------------------------------------------------------------ spout: a beast whose jaws issue the spout

export function spoutPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  // the whole programme sits DY mm out along the spout from its root: the first ~9 mm of the tube are
  // still inside / against the body wall, which hid the mask's root half from the front
  const DY = 4.5
  const cx = W / 2
  const P = ([X, Y]) => [cx - X, Y + DY]
  const Ps = (pts) => pts.map(P)
  // the mask, upside down in panel terms (horns toward the root, jaws toward the mouth); its nose on the top
  // meridian and its eyes on the two flanks (±Z), where the front and back views see them
  const els = [
    kit.roundPoly(Ps([[-1, 8.0], [4.6, 8.0], [4.6, 28.0], [-1, 28.0]]), { round: [0, 1.6, 1.6, 0], contour: contour(0.6) }),
    // horn: from beside the nose over the eye on the root side, its outer end rolled toward the eye
    kit.roundStroke(Ps([[8.4, 13.4], [8.4, 9.0], [33.0, 9.0], [33.0, 15.0]]), {
      width: [4.6, 5.4, 5.4, 4.8], round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 0.6, dir: -1, gap: 0.6, R: 3.6 },
      contour: contour(0.55), fill: spiralsFill({ min: 2.2 }),
    }),
    // jaw: on the mouth side, out past the eye and hooked back
    kit.roundStroke(Ps([[8.2, 26.0], [31.0, 26.0], [31.0, 21.6]]), { width: [4.2, 4.4, 3.4], round: 0.85, inner: 0.3, end: 'round', contour: contour(0.5), fill: spiralsFill({ min: 2.0 }) }),
  ]
  kit.carve(panel, els, { height: 1.6, shoulder: 0.5, depth: 0.28, irregularity: 0.8, seed })
  kit.pillowBoss(panel, { c: P([19.4, 18.4]), w: 11.8, h: 8.2, round: 0.55, height: 2.4, crown: 0.9, slit: { len: 3.6, width: 0.7, depth: 0.55 } })
  // collar: two bowstrings all round, then the blade pointing to the mouth
  kit.bowstrings(panel, { x: -1, y: 29.6 + DY, w: W + 2, h: 4.6 }, { count: 2, width: 1.3, height: 0.8, spacing: 2.3 })
  const bl = kit.roundPoly(Ps([[-1, 34.0], [19.5, 34.0], [0.8, 48.4], [-1, 48.4]]), { round: [0, 2.0, 1.4, 0], contour: { inset: 1.2, line: LINE } })
  kit.carve(panel, [bl], { height: 1.0, shoulder: 0.4, depth: 0.28, seed: seed + 1 })
  // inside the blade: a cicada, its head with two eyes at the broad end, its body tapering to the tip
  const inner = [
    kit.roundPlate({ c: P([0, 37.4]), w: 15.6, h: 4.6, r: 1.8, contour: contour(0.45) }),
    kit.roundStroke(Ps([[0, 40.4], [0, 45.6]]), { width: [5.2, 1.2], end: 'point', contour: contour(0.45), fill: { kind: 'lines', line: 0.32, pitch: 0.95 } }),
  ]
  kit.carve(panel, inner, { height: 1.7, shoulder: 0.4, depth: 0.26, seed: seed + 2 })
  for (const X of [4.2]) kit.pillowBoss(panel, { c: P([X, 37.4]), w: 3.2, h: 3.0, round: 0.8, height: 2.3, crown: 1, base: 'field', slit: false })
  // ground round the mask (the root up to the collar), only on the tube (inside the circumference)
  kit.leiwenFill(panel, {
    include: (ctx) => {
      ctx.beginPath()
      ctx.moveTo(cx, 6.0 + DY)
      for (let y = 6 + DY; y <= 29 + DY; y += 1) ctx.lineTo(cx - Math.max(0, size.halfWidthAt(y) - 2.4), y)
      ctx.lineTo(cx, 29 + DY); ctx.closePath(); ctx.fill()
      // and round the blade, up to where the lip begins
      ctx.beginPath()
      ctx.moveTo(cx, 33.6 + DY)
      for (let y = 33.6 + DY; y <= 48.6 + DY; y += 1) ctx.lineTo(cx - Math.max(0, size.halfWidthAt(y) - 2.4), y)
      ctx.lineTo(cx, 48.6 + DY); ctx.closePath(); ctx.fill()
    },
    margin: 0.45,
  }, { ...GROUND, pitch: 0.72, echo: 0, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ handle: a scaled back ending in a hooked tail

export function handlePanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = panelOf(kit, W, H, ppmm, seed)
  const cx = W / 2
  // the band starts blunt 2 mm inside the sleeve under the ram's jaw (sculpture.js), so it issues from it
  const y0 = HEAD_SLEEVE_END - 2.0
  const back = kit.roundStroke([[cx, y0], [cx, 104.0], [cx, 113.0]], {
    width: [19.6, 18.4, 11.0], round: 0.5, inner: 0.15, start: 'blunt', end: 'spiral', spiral: { turns: 1.0, dir: 1, gap: 0.8, taper: 0.6 },
    contour: { inset: 1.2, line: LINE }, fill: { kind: 'scales', line: 0.4, pitch: 3.0 },
  })
  kit.carve(panel, [back], { height: 1.5, shoulder: 0.5, depth: 0.3, irregularity: 0.8, seed })
  // ladder of thin ridges on the handle's flanks, either side of the back band
  panel.raise((ctx) => {
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.rect(cx + s * 12.6 - 0.55, y0 + 0.5, 1.1, 106 - (y0 + 0.5)); ctx.fill() }
  }, { height: 0.7, profile: 'plateau', shoulder: 0.3 })
  return panel.bake()
}
