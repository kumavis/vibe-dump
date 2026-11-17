// boombox — the décor, one ReliefPanel per mould face. The composition (which feature became which motif):
//
//   faceplate    ONE GREAT MASK. The speakers are the EYES: each opening is ringed by a fat four-ridge surround standing
//                on its own plateau in a sunk channel (ridge work). Over each eye a fat horn rises beside the brow band,
//                runs out along the top and rolls in at the outer corner; under it the jaw runs from the mouth's corner
//                along the bottom and hooks up at the outer corner — so each eye sits in a frame of the mask's own
//                bands. The tuner window is the BROW BAND: a sunk field framed by a double ridge, a scroll chain along
//                it and a ladder of ticks (the dial scale); the needle is a small upright blade of turquoise inlay
//                (form.js). The NOSE is a short notched flange on the axis (form.js) with two nostril curls. Knob
//                collars and the slider slots below the mouth; leiwen packed in everything else.
//   cones        the eye's socket: a fire-whorl (囧纹) of six curved hooked spokes — the grille — round a coiled-
//                serpent boss (kit.coilBoss) as the pupil, a cord at the edge roll, leiwen between the spokes.
//   door         the MOUTH: its window a sunk cartouche (kit.sunkCartouche); the tape path a pair of confronted kui
//                embossed on the floor, the reel hubs two whorl bosses, a row of fangs hanging under the window, a
//                double-ridge border.
//   knobs        each top a small whorl (the side is a notched turned edge, form.js).
//   ends         a ridge collar round the handle's pivot head, a confronted pair of upright kui, two whorls low down,
//                bowstrings, leiwen.
//   top          a frieze of kui confronted round a central whorl, bowstrings, a collar round the antenna's foot.
//   back         plainer: bowstrings, a frieze of kui along the top, two ladders of sunk vent slots, a big sunk
//                cartouche for the battery door with a pair of embossed kui and its latch boss.
//   handle       a twisted rope along its outer face, plain cords along its edges.
//
// All panel mm, origin bottom-left, y up.

import { BODY, FACE, SPK, MID, DOOR, HANDLE, ANTENNA, rrect, circle } from './layout.js'

const TAU = Math.PI * 2
const LINE = 0.55
const sfill = (o = {}) => ({ kind: 'spirals', line: 0.45, pitch: 0.85, gap: 0.42, square: 0.25, tail: false, min: 3.4, ...o })
const contour = (inset = 1.0) => ({ inset, line: LINE })
const GROUND = { pitch: 1.5, line: 0.5, depth: 0.45, roundness: 0.12, jitter: 0.06, pairs: 0.6, echo: 1 }

const newPanel = (kit, w, h, ppmm, seed) => new kit.ReliefPanel({ width: w, height: h, ppmm, seed })

let tl = 0
/** debug timing of the steps inside a panel (globalThis.__boomboxDebug) */
function lap(label) {
  if (!globalThis.__boomboxDebug) return
  const t = performance.now()
  if (label) console.info(`[boombox]   · ${label} ${Math.round(t - tl)} ms`)
  tl = t
}

function pathPts(ctx, pts) {
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.closePath()
}

function hline(panel, x0, x1, y, { width = 2.4, height = 1.4 } = {}) {
  panel.raise((ctx) => { ctx.beginPath(); ctx.rect(x0, y - width / 2, x1 - x0, width); ctx.fill() }, { height, profile: 'dome', shoulder: width / 2 })
}

function ringRaise(panel, c, r0, r1, height = 1.8) {
  panel.raise((ctx) => { ctx.beginPath(); ctx.arc(c[0], c[1], r1, 0, TAU); ctx.arc(c[0], c[1], r0, 0, TAU, true); ctx.fill() }, { height, profile: 'dome' })
}

/**
 * A kui as ribbon elements, authored in a design frame (x along the body from the head at x = 0, the mouth gaping
 * toward −x; y across the band 0..1), in units of the band height s, mapped to panel mm by T. lam = length / s.
 * → { els, eye: { c, r } }
 */
function kuiEls(kit, T, s, lam, { fill = false } = {}) {
  const P = (pts) => pts.map(([x, y]) => T([x * s, y * s]))
  const det = (() => { const a = T([0, 0]), b = T([1, 0]), c = T([0, 1]); return Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) || 1 })()
  const deco = fill ? { contour: contour(0.8) } : { contour: false }
  const els = [
    kit.roundPoly(P([[0.06, 0.14], [0.62, 0.14], [0.62, 0.9], [0.06, 0.9]]), { round: 0.22 * s, ...deco }),
    kit.roundStroke(P([[0.34, 0.95], [-0.16, 0.95], [-0.16, 0.6]]), { width: [0.17 * s, 0.17 * s, 0.12 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }),
    kit.roundStroke(P([[0.3, 0.08], [-0.08, 0.08], [-0.08, 0.32]]), { width: [0.15 * s, 0.15 * s, 0.11 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }),
    kit.roundStroke(P([[0.56, 0.5], [lam - 0.42, 0.5], [lam - 0.14, 0.5], [lam - 0.14, 0.8]]), {
      width: [0.34 * s, 0.3 * s, 0.26 * s, 0.22 * s], round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 0.85, dir: -det, gap: 0.07 * s },
      ...(fill ? { contour: contour(0.8), fill: sfill({ joints: true, min: 0.12 * s }) } : { contour: false }),
    }),
  ]
  if (lam > 2.2) {
    els.push(kit.roundStroke(P([[0.9, 0.36], [0.9, 0.06], [1.35, 0.06]]), { width: [0.15 * s, 0.14 * s, 0.11 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }))
    els.push(kit.roundStroke(P([[0.86, 0.66], [0.86, 0.97], [Math.min(lam * 0.5, 1.9), 0.97]]), { width: [0.14 * s, 0.14 * s, 0.1 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }))
  }
  return { els, eye: { c: T([0.34 * s, 0.52 * s]), r: 0.17 * s } }
}

/** outlines of rounded elements, for sunkCartouche ribbons */
const outlines = (kit, els) => els.map((e) => kit.elementContour(e, 0))

// ------------------------------------------------------------------ faceplate: the mask

export function facePanel(kit, { ppmm, seed }) {
  const W = FACE.w, H = FACE.h, cx = W / 2
  const panel = newPanel(kit, W, H, ppmm, seed)
  const P = ([X, y]) => [cx - X, y] // author the LEFT half, X outward from the axis
  const Ps = (pts) => pts.map(P)
  const eye = [cx - SPK.dx, SPK.y]
  const T = MID.tuner, tc = [cx, (T.y0 + T.y1) / 2], th = T.y1 - T.y0

  lap()
  // the brow band: the tuner window, sunk
  panel.sink((ctx) => { ctx.beginPath(); pathPts(ctx, rrect(tc, T.w, th, 3.5, 4)); ctx.fill() }, { depth: 2.6, profile: 'u', shoulder: 0.7 })
  // the slider slots
  panel.sink((ctx) => {
    ctx.beginPath()
    for (const sx of MID.sliders.x) if (sx < 0) pathPts(ctx, rrect([cx + sx, (MID.sliders.y0 + MID.sliders.y1) / 2], MID.sliders.w, MID.sliders.y1 - MID.sliders.y0, MID.sliders.w / 2, 4))
    ctx.fill()
  }, { depth: 3.2, profile: 'u', shoulder: 0.8 })
  lap('face sinks')

  // the eye surround (fat ridges on a plateau in a sunk channel) and the brow band's double-ridge frame
  const ridges = kit.ridgeWork(panel, { width: 2.3, pitch: 3.5, height: 1.3, groove: 0.3, crown: 1 })
  ridges.ridgeBand(circle(eye, 73.6, 36), { ridges: 4, closed: true, plateau: { height: 1.3, channel: 1.6, channelDepth: 0.8 } })
  lap('face ring vectors')
  ridges.ridgeBand(rrect(tc, T.w + 7.6, th + 7.6, 6, 6), { ridges: 2, closed: true, width: 2.1, pitch: 3.2, plateau: { height: 1.0, channel: 1.2, channelDepth: 0.6 } })
  ridges.flush()
  lap('face ridges')
  // in the window: a scroll chain along the lower half, the dial's ticks along the upper
  const inner = kit.ridgeWork(panel, { width: 1.5, pitch: 2.3, height: 1.1, groove: 0, crown: 1, mode: 'add' })
  inner.scrollChain([P([T.w / 2 - 2.5, T.y0 + 7.4]), P([1.2, T.y0 + 7.4])], { strip: 10, turns: 1.4, alternate: true, tail: true })
  for (let X = 3; X < T.w / 2 - 3; X += 4.4) inner.line([P([X, T.y1 - 8.6]), P([X, T.y1 - (Math.round(X / 4.4) % 3 === 0 ? 2.6 : 4.4)])], { width: 1.4 })
  inner.flush()
  lap('face window')

  // the horn over the eye, the jaw under it, the nostril curls
  const horn = kit.roundStroke(Ps([[80, 160], [91, 190], [130, 198], [176, 197], [211, 181]]), {
    width: [10.5, 12.5, 13.5, 12.5, 11], round: 0.9, inner: 0.35, start: 'blunt', end: 'spiral', spiral: { turns: 1.05, dir: 1, gap: 1.3 },
    contour: { inset: [1.0, 1.6], line: LINE }, ticks: { side: 'outer', pitch: 3.6, line: 0.5 }, fill: { kind: 'lines', line: 0.5, pitch: 2.3 },
  })
  const jaw = kit.roundStroke(Ps([[67, 64], [72, 30], [100, 11.5], [180, 10.5], [214, 30]]), {
    width: [9, 10.5, 10.5, 10, 9.5], round: 0.9, inner: 0.35, start: 'point', end: 'spiral', spiral: { turns: 0.95, dir: -1, gap: 1.2 },
    contour: { inset: [1.5, 1.0], line: LINE }, fill: sfill({ joints: true, min: 3.8 }),
  })
  const nostril = kit.roundStroke(Ps([[6.5, 166], [25, 166], [25, 154]]), {
    width: [6.4, 6.4, 5.6], round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 1.1, dir: 1, gap: 0.9 }, contour: contour(0.75),
  })
  kit.carve(panel, [horn, jaw, nostril], { height: 2.6, shoulder: 0.7, depth: 0.45, irregularity: 0.8, seed })
  lap('face carve')

  // the knob collars
  for (const x of MID.knobs.x) if (x <= 0) ringRaise(panel, [cx + x, MID.knobs.y], MID.knobs.r + 1.6, MID.knobs.r + 4.6, 1.8)

  // ground: leiwen everywhere on the face that is not an opening, the door, the window or a collar
  kit.leiwenFill(panel, {
    include: (ctx) => {
      ctx.beginPath()
      pathPts(ctx, rrect([cx, H / 2], W - 10, H - 10, FACE.r - 5, 6))
      ctx.fill()
      ctx.globalCompositeOperation = 'destination-out'
      ctx.beginPath(); ctx.arc(eye[0], eye[1], 84, 0, TAU); ctx.fill()
      ctx.beginPath(); ctx.rect(cx - 62, MID.door.y - 39, 124, 78); ctx.fill()
      ctx.beginPath(); pathPts(ctx, rrect(tc, T.w + 16, th + 16, 8, 4)); ctx.fill()
      ctx.beginPath(); for (const x of MID.knobs.x) { ctx.moveTo(cx + x + 16, MID.knobs.y); ctx.arc(cx + x, MID.knobs.y, 16, 0, TAU) } ctx.fill()
      ctx.beginPath(); for (const sx of MID.sliders.x) ctx.rect(cx + sx - 5, MID.sliders.y0 - 3, 10, MID.sliders.y1 - MID.sliders.y0 + 6); ctx.fill()
      ctx.beginPath(); ctx.rect(cx - 5, MID.nose.y0 - 2, 10, MID.nose.y1 - MID.nose.y0 + 4); ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
    },
    rect: { x: 0, y: 0, w: cx, h: H },
    margin: 0.6,
  }, { ...GROUND, pitch: 1.45, seed })
  lap('face leiwen')
  panel.mirrorX()
  const map = panel.bake()
  lap('face bake')
  return map
}

// ------------------------------------------------------------------ the cone: the eye's socket and its pupil

export function conePanel(kit, { ppmm, seed }) {
  const S = 2 * Math.ceil(SPK.coneR) + 4, c = [S / 2, S / 2]
  const panel = newPanel(kit, S, S, ppmm, seed)
  // the edge roll: a round cord just inside the opening
  ringRaise(panel, c, 54.6, 58.6, 1.8)
  // the fire-whorl: six curved spokes widening outward, each hooked over at its outer end
  const els = []
  const n = 6, r0 = SPK.cap + 4.5, r1 = 50, sweep = 1.25
  for (let k = 0; k < n; k++) {
    const a0 = (k / n) * TAU + 0.3
    const pts = []
    for (let i = 0; i <= 7; i++) {
      const t = i / 7
      const a = a0 + sweep * t, r = r0 + (r1 - r0) * t
      pts.push([c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)])
    }
    els.push(kit.roundStroke(pts, {
      width: (t) => 4.6 + 4.6 * Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.5), round: 0.8, inner: 0.3, start: 'round', end: 'spiral',
      spiral: { turns: 0.85, dir: 1, gap: 1.1 }, contour: contour(0.8), fill: sfill({ min: 3.2 }),
    }))
  }
  // the grille's openings: everything between the spokes sinks (dark in the socket), the spokes stand on the cone
  const paint = kit.paintElements(els, 0)
  panel.sink((ctx) => {
    ctx.beginPath(); ctx.arc(c[0], c[1], 53.2, 0, TAU); ctx.arc(c[0], c[1], SPK.cap + 2.2, 0, TAU, true); ctx.fill()
    ctx.globalCompositeOperation = 'destination-out'; paint(ctx); ctx.globalCompositeOperation = 'source-over'
  }, { depth: 2.4, profile: 'u', shoulder: 0.7 })
  kit.carve(panel, els, { height: 2.4, shoulder: 0.7, depth: 0.45, irregularity: 0.6, seed })
  // the pupil: a coiled-serpent boss on the cone's floor
  kit.coilBoss(panel, {
    c, r: SPK.cap, height: SPK.capH, turns: 2.0, start: 250, gap: 0.16, ridge: 0.17, foot: 'plain',
    striate: { pitch: 0.9, depth: 0.3, slant: 1.1, from: 0.55 },
    head: { style: 'tiger', at: [-0.04, 0.1], w: 0.56, h: 0.5, height: 0.36 },
  })
  const map = panel.bake({ cavity: { kSmall: 0.7, kLarge: 4 } })
  map.userData = { c }
  return map
}

// ------------------------------------------------------------------ the cassette door: the mouth

export function doorPanel(kit, { ppmm, seed }) {
  const { w: W, h: H, window: win } = DOOR
  const panel = newPanel(kit, W, H, ppmm, seed)
  const cx = W / 2
  // border
  const work = kit.ridgeWork(panel, { width: 1.5, pitch: 2.3, height: 1.0, groove: 0.25, crown: 1 })
  work.ridgeBand(rrect([cx, H / 2], W - 7.2, H - 7.2, DOOR.r - 2, 6), { ridges: 2, closed: true })
  work.flush()
  // fangs hanging under the window: two great corner fangs and a row of small teeth
  const fangs = []
  for (const [x, w, tip] of [[19, 13, 5.5], [W - 19, 13, 5.5]]) fangs.push(kit.roundPoly([[x - w / 2, win.y0 - 1.5], [x + w / 2, win.y0 - 1.5], [x + (x < cx ? 1.5 : -1.5), tip]], { round: [1.6, 1.6, 0.9], contour: contour(0.75) }))
  for (let i = 0; i < 6; i++) {
    const x = 33 + i * ((W - 66) / 5)
    fangs.push(kit.roundPoly([[x - 3.8, win.y0 - 1.5], [x + 3.8, win.y0 - 1.5], [x, 11]], { round: [1.2, 1.2, 0.7], contour: false }))
  }
  kit.carve(panel, fangs, { height: 1.9, shoulder: 0.5, depth: 0.35, seed })
  // the window: a sunk cartouche; the tape path = two kui confronted on its floor, mouths meeting on the axis
  const s = 12, lam = 3.3, y0 = win.y0 + 1.8, xh = cx - 3.2
  const L = kuiEls(kit, ([x, y]) => [xh - x, y0 + y], s, lam)
  const R = kuiEls(kit, ([x, y]) => [W - (xh - x), y0 + y], s, lam)
  kit.sunkCartouche(panel, [{
    field: { rrect: [win.x0, win.y0, win.x1, win.y1], r: win.r },
    plates: outlines(kit, [...L.els, ...R.els]),
    eyes: [L.eye, R.eye],
  }], { depth: 2.6, level: 0, shoulder: 0.5, rim: { ribs: 2, pitch: 1.2 }, eye: { ring: 0.9, gap: 0.4, dome: 0.4 }, ground: { pitch: 0.95, roundness: 0.85 }, seed })
  // the reel hubs: two whorl bosses standing in the window
  for (const [hx, hy] of DOOR.hubs) {
    const r = DOOR.hubR + 1.2
    kit.drawMotif(panel, 'whorl', { x: hx - r, y: hy - r, w: 2 * r, h: 2 * r }, { relief: { motif: 1.6, boss: 2.8, groove: 0.35 } }, { preset: 'six-spokes', ground: false })
  }
  kit.leiwenFill(panel, {
    include: (ctx) => { ctx.beginPath(); pathPts(ctx, rrect([cx, H / 2], W - 13, H - 13, 3, 4)); pathPts(ctx, rrect([(win.x0 + win.x1) / 2, (win.y0 + win.y1) / 2], win.x1 - win.x0 + 4, win.y1 - win.y0 + 4, win.r + 2, 6).reverse()); ctx.fill() },
    margin: 0.5,
  }, { ...GROUND, pitch: 1.1, seed })
  return panel.bake()
}

// ------------------------------------------------------------------ the knob tops

export function knobPanel(kit, { ppmm, seed }) {
  const R = MID.knobs.r - 2.2
  const S = 2 * R + 2, c = [S / 2, S / 2]
  const panel = newPanel(kit, S, S, ppmm, seed)
  kit.drawMotif(panel, 'whorl', { x: c[0] - R + 0.4, y: c[1] - R + 0.4, w: 2 * R - 0.8, h: 2 * R - 0.8 }, { relief: { motif: 0.9, boss: 1.6, groove: 0.3 } }, { preset: 'four-spokes', ground: false })
  const map = panel.bake()
  map.userData = { c }
  return map
}

// ------------------------------------------------------------------ the ends

export function sidePanel(kit, cell, { ppmm, seed }) {
  const W = cell.w, H = cell.h, cx = W / 2
  const panel = newPanel(kit, W, H, ppmm, seed)
  hline(panel, -1, W + 1, 4.6)
  hline(panel, -1, W + 1, H - 4.4)
  kit.bowstrings(panel, { x: -1, y: 140, w: W + 2, h: 8 }, { count: 2, width: 2.2, height: 1.3, spacing: 4.2 })
  kit.bowstrings(panel, { x: -1, y: 25, w: W + 2, h: 8 }, { count: 2, width: 2.2, height: 1.3, spacing: 4.2 })
  // the pivot collar round the handle's beast head
  const py = HANDLE.pivotY - 4 - BODY.y0 // the beast head's centre (form.js buildHandleHeads)
  const work = kit.ridgeWork(panel, { width: 2.2, pitch: 3.3, height: 1.3, groove: 0.3, crown: 1 })
  work.ridgeBand(circle([cx, py], 26.6, 96), { ridges: 2, closed: true, plateau: { height: 1.1, channel: 1.3, channelDepth: 0.6 } })
  work.flush()
  // an upright kui on the left half (the mirror makes the confronted pair)
  kit.drawMotif(panel, 'kui', { x: 3.5, y: 36, w: cx - 4.5, h: 100 }, { relief: { motif: 2.2, boss: 3.4, groove: 0.42 } }, { preset: 'vertical-head-up', ground: false })
  kit.drawMotif(panel, 'whorl', { x: cx - 26, y: 8, w: 15, h: 15 }, { relief: { motif: 1.6, boss: 2.6, groove: 0.35 } }, { preset: 'four-spokes', ground: false })
  kit.leiwenFill(panel, { rect: { x: 0, y: 7, w: cx, h: H - 13 }, margin: 0.6 }, { ...GROUND, pitch: 1.35, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ the top

export function lidPanel(kit, { w: W, d: H }, { ppmm, seed }) {
  const panel = newPanel(kit, W, H, ppmm, seed)
  // bowstrings round the back and the ends (the front edge meets the faceplate)
  hline(panel, 10, W - 10, H - 8, { width: 2.2, height: 1.2 })
  hline(panel, 10, W - 10, H - 12.4, { width: 2.2, height: 1.2 })
  kit.bowstrings(panel, { x: 6, y: 6, w: 8, h: H - 12 }, { count: 2, width: 2.2, height: 1.2, spacing: 4.4, vertical: true })
  kit.bowstrings(panel, { x: W - 14, y: 6, w: 8, h: H - 12 }, { count: 2, width: 2.2, height: 1.2, spacing: 4.4, vertical: true })
  kit.frieze(panel, { x: 22, y: 10, w: W - 44, h: 50 }, { unit: 'kui', count: 5, facing: 'centre', centre: { motif: 'whorl', w: 52 }, params: { relief: { motif: 2.0, boss: 3.2, groove: 0.42 } }, ground: { pitch: 1.4 } })
  // the antenna's foot: a collar
  // panel x = world x + W / 2; panel y = (BODY.zSeam − z) (the lid plate's front edge is panel y 0)
  ringRaise(panel, [ANTENNA.base[0] + W / 2, BODY.zSeam - ANTENNA.base[2]], 10.5, 14, 1.8)
  return panel.bake()
}

// ------------------------------------------------------------------ the back

export function backPanel(kit, cell, { ppmm, seed }) {
  const W = cell.w, H = cell.h, cx = W / 2
  const panel = newPanel(kit, W, H, ppmm, seed)
  hline(panel, -1, W + 1, 4.6)
  hline(panel, -1, W + 1, H - 4.4)
  kit.bowstrings(panel, { x: -1, y: 141, w: W + 2, h: 8 }, { count: 2, width: 2.2, height: 1.3, spacing: 4.2 })
  kit.frieze(panel, { x: 8, y: 152, w: W - 16, h: 38 }, { unit: 'kui', count: 6, facing: 'centre', params: { relief: { motif: 2.0, boss: 3.2, groove: 0.42 } }, ground: { pitch: 1.35 } })
  // vents: two ladders of sunk slots, behind the speakers
  panel.sink((ctx) => {
    ctx.lineWidth = 4.2; ctx.lineCap = 'round'
    for (const x0 of [34, W - 34 - 92]) for (let i = 0; i < 9; i++) { const y = 24 + i * 12.4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 + 92, y); ctx.stroke() }
  }, { depth: 2.8, profile: 'u', shoulder: 1.0 })
  // the battery door: a big sunk cartouche, a pair of kui embossed on its floor, its latch boss
  const x0 = cx - 82, x1 = cx + 82, y0 = 18, y1 = 128
  const s = 30, lam = 2.55, ky = 46, xh = cx - 6
  const L = kuiEls(kit, ([x, y]) => [xh - x, ky + y], s, lam)
  const R = kuiEls(kit, ([x, y]) => [W - (xh - x), ky + y], s, lam)
  kit.sunkCartouche(panel, [{
    field: { rrect: [x0, y0, x1, y1], r: 12 }, plates: outlines(kit, [...L.els, ...R.els]), eyes: [L.eye, R.eye],
  }], { depth: 2.2, level: 0, shoulder: 0.7, rim: { ribs: 3, pitch: 1.3 }, eye: { ring: 1.4, gap: 0.5, dome: 0.6 }, ground: { pitch: 1.1, roundness: 0.8 }, seed })
  kit.pillowBoss(panel, { c: [cx, y1 - 14], w: 28, h: 9, round: 0.35, height: 2.4, crown: 0.6, slit: { len: 16, width: 1.2, depth: 0.7 }, base: 'field' })
  return panel.bake()
}

// ------------------------------------------------------------------ the handle

export function handlePanel(kit, { w: L, h: P }, { ppmm, seed }) {
  const panel = newPanel(kit, L, P, ppmm, seed)
  const yo = P / 2 // the outer face's middle
  kit.ropeCord(panel, { x0: 26, x1: L - 26, y: yo, width: 15, height: 1.8, pitch: 4.2, slant: 52 })
  for (const dy of [-P / 4, P / 4]) kit.plainCord(panel, { x0: 26, x1: L - 26, y: yo + dy, width: 3, height: 1.1 })
  void seed
  return panel.bake()
}
