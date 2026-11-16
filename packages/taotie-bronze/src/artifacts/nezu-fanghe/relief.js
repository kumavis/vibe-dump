// nezu-fanghe — the décor panels, TRACED off the flattened photographs of vessel A
// (reference/nezu-fanghe/faces/face-front.jpg from photo 25, face-side.jpg from photo 42; both 3–4 px/mm,
// read on a 5 mm grid). All eight half-lobes and all four frieze halves carry the same units, so one
// half is authored in a CANONICAL frame — x' mm from the face's centre line (the crease) out to the corner
// (x' = 105 at the corner arris), y = world height in mm — and mirrored.
//
// What the bronze shows (and what earlier drafts got wrong): the relief is MASSIVE — fat bands 7–12 mm wide,
// standing 4–5 mm proud with rounded shoulders, separated by deep dark pockets, not thin outline frames.
// Each lobe half: a double G-horn (two concentric bands that run from the crease along the top, down the
// corner side and back along the bottom into a big rolled coil with a deep pocket), a fat brow bar below
// it whose corner end turns down, a C-hook with a pocket under that, and a domed pillow eye at the bottom.
// The frieze: one fat-bodied kui per half, head at the centre line, tail rolled up at the corner.

const lerp = (a, b, t) => a + (b - a) * t

// ------------------------------------------------------------------ the lobe half-mask

/** canonical half-mask units: x' from the crease (0) to the corner (105), world y */
export const LOBE_TRACE = {
  // round 8: coil moved ≈ 5 mm toward the crease and enlarged (≈ 50 mm over the outer turn), eye raised ≈ 15 mm
  // and made a round dome ≈ 19 mm, secondary boss round ≈ 15 mm (face-side, face-front right lobe, 45)
  gOuter: { pts: [[8, 246], [87, 246], [90, 214], [87, 197], [54, 197]], width: [10.5, 11, 11, 11, 10.5], spiral: { turns: 0.8, R: 20, dir: -1 } },
  gInner: { pts: [[17, 233], [74, 233], [76, 218], [74, 210], [58, 210]], width: [10, 10.5, 10.5, 10.5, 10], spiral: { turns: 1.15, R: 8.5, dir: -1 } },
  brow: { pts: [[28, 183], [64, 183], [94, 182], [99, 168]], width: [8.5, 9.5, 9.5, 7.5] },
  hook: { pts: [[30, 170], [52, 170], [61, 163], [56, 155]], width: [8, 9, 9, 7.5] },
  eye: { c: [82, 167], w: 19, h: 18 },
  boss: { c: [46, 141], w: 15, h: 14.5 },
}

/**
 * The lobe panel: width = the developed front + side arcs (crease → corner → crease), height = y0 → y1.
 * size: { width, height, split } (panel x of the corner), y0 = world y of the panel bottom.
 */
export function lobePanel(kit, size, { ppmm, seed, y0 = 126 }) {
  const panel = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm, seed, maxSize: 2048 })
  const k = size.split / 105
  const P = (pts) => pts.map(([x, y]) => [x * k, y - y0])
  const T = LOBE_TRACE
  const band = (u, extra) => kit.roundStroke(P(u.pts), { width: u.width.map((w) => w * 1.38), round: 0.55, inner: 0.15, start: 'blunt', capRound: 0.35, ...extra })
  const els = [
    band(T.gOuter, { round: 1.2, end: 'spiral', spiral: { ...T.gOuter.spiral, gap: 2.4 }, contour: { inset: 1.1, line: 0.7 } }),
    band(T.gInner, { round: 1.0, end: 'spiral', spiral: { ...T.gInner.spiral, gap: 3.2 }, contour: { inset: 1.0, line: 0.7 } }),
    band(T.brow, { end: 'round', contour: { inset: 1.0, line: 0.6 } }),
    band(T.hook, { end: 'spiral', spiral: { turns: 0.6, R: 4.5, dir: -1, gap: 1.6 }, contour: { inset: 0.9, line: 0.6 } }),
  ]
  // massive bands: 4.2 mm proud, a rounded shoulder of ≈ 2.5 mm (a domed section, not a flat ribbon)
  kit.carve(panel, els, { height: 5, shoulder: 3.4, depth: 0.6, seed, irregularity: 1.2 })
  kit.pillowBoss(panel, { c: P([T.eye.c])[0], w: T.eye.w * k, h: T.eye.h, round: 1, height: 6.5, crown: 1,
    slit: false, ring: { gap: 1.2, line: 1.1, depth: 0.9 } })
  kit.pillowBoss(panel, { c: P([T.boss.c])[0], w: T.boss.w * k, h: T.boss.h, round: 1, height: 5, crown: 1, slit: false })
  // deep pockets: the coil's centre and under the brow (dark holes on the bronze)
  const pocket = (c, rx, ry, depth) => panel.sink((ctx) => { ctx.beginPath(); ctx.ellipse(c[0] * k, c[1] - y0, rx, ry, 0, 0, Math.PI * 2); ctx.fill() }, { depth, shoulder: 1.2, profile: 'u' })
  pocket([57, 218], 5, 6.5, 2.6)
  // ground: big squared spirals sunk in the field (≈ 6–9 mm cells: the left strip of photo 45)
  kit.leiwenFill(panel, { rect: { x: 0, y: 0, w: size.split, h: size.height }, margin: 0.7 }, { pitch: 1.25, line: 0.5, depth: 0.26, cell: [5.5, 9], pairs: 0.3, maxAspect: 1.6, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ frieze: a kui per half

// one crouching quadruped kui per half (photos 39, 42 frieze; face-side): head at the centre side looking
// inward with an open jaw and a domed eye, an arched scaly body, two legs with claws, the tail rolled UP at the corner
export const KUI_TRACE = {
  body: { pts: [[40, 277], [55, 282.5], [72, 281.5], [84, 276]], width: [14, 15.5, 14, 11] },
  head: { c: [33, 276], w: 15, h: 18 },
  upperJaw: { pts: [[28, 283], [19, 283], [14, 279]], width: [6, 5.5, 4.5] },
  lowerJaw: { pts: [[28, 268], [19, 266.5], [15, 270]], width: [5, 4.5, 3.5] },
  crest: { pts: [[35, 286], [41, 292.5], [50, 291]], width: [5.5, 5, 4.5] },
  legs: [[[45, 271], [45, 262], [38, 259.5]], [[73, 274], [74, 263], [81, 260]]],
  eye: { c: [33, 280], w: 7, h: 6.5 },
}

export function friezePanel(kit, cell, { ppmm, seed, handle }) {
  const W = cell.w, H = cell.h
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed, maxSize: 2048 })
  const cx = W / 2, k = (W / 2) / 105, y0 = 255
  // author the RIGHT half (x' outward from the centre line) drawn on the left half (panel x = cx − x'), mirrorX
  const P = (pts) => pts.map(([x, y]) => [cx - x * k, y - y0])
  const T = KUI_TRACE
  const els = [
    kit.roundStroke(P(T.body.pts), { width: T.body.width, round: 0.6, inner: 0.2, start: 'blunt', end: 'spiral', spiral: { turns: 1.1, R: 6, dir: -1, gap: 1.5 },
      contour: { inset: 1.1, line: 0.55 }, fill: { kind: 'scales', pitch: 4.2, line: 0.5 } }),
    kit.roundPlate({ c: P([T.head.c])[0], w: T.head.w * k, h: T.head.h, r: 6, contour: { inset: 1.0, line: 0.55 } }),
    kit.roundStroke(P(T.upperJaw.pts), { width: T.upperJaw.width, round: 0.6, end: 'spiral', spiral: { turns: 0.6, R: 2, dir: 1, gap: 0.7 } }),
    kit.roundStroke(P(T.lowerJaw.pts), { width: T.lowerJaw.width, round: 0.6, end: 'point' }),
    kit.roundStroke(P(T.crest.pts), { width: T.crest.width, round: 0.6, end: 'spiral', spiral: { turns: 0.8, R: 2.6, dir: -1, gap: 0.9 } }),
    ...T.legs.map((l) => kit.roundStroke(P(l), { width: [6, 5.5, 4], round: 0.6, end: 'point' })),
  ]
  kit.carve(panel, els, { height: 4.4, shoulder: 2.8, depth: 0.55, seed, irregularity: 1.2 })
  kit.pillowBoss(panel, { c: P([T.eye.c])[0], w: T.eye.w, h: T.eye.h, round: 1, height: 5, crown: 1, base: 'field', slit: false })
  kit.leiwenFill(panel, { rect: { x: 1.5, y: 1.2, w: cx - 1.5, h: H - 2.4 }, margin: 0.8 }, { pitch: 1.2, line: 0.5, depth: 0.28, cell: [4.5, 8], pairs: 0.5, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ collar, fascia, cap, spout

/** collar (stretch map, panel y 0 = frieze top → h = eave): low relief, read in photos 39 and 42 by raking
 *  light: an upright blade-shaped mask either side of the centre flange in the upper collar (eye boss near its top),
 *  and a fat hooked band either side of the frieze head along the collar foot; shallow leiwen ground */
export function collarPanel(kit, cell, { ppmm, seed }) {
  const w = cell.w, h = cell.h
  const panel = new kit.ReliefPanel({ width: w, height: h, ppmm, seed, maxSize: 2048 })
  const cx = w / 2
  const els = [
    kit.roundStroke([[cx - 14, h - 22], [cx - 14, h - 52], [cx - 30, h - 78], [cx - 46, h - 52], [cx - 46, h - 22], [cx - 14, h - 22]], {
      width: 5, round: 0.6, inner: 0.25, contour: { inset: 0.8, line: 0.45 } }),
    kit.roundStroke([[cx - 21, h - 36], [cx - 39, h - 36]], { width: 4.5, round: 0.6, end: 'spiral', spiral: { turns: 0.7, R: 2.6, dir: 1, gap: 0.9 } }),
    kit.roundStroke([[cx - 30, 13], [cx - 78, 13], [cx - 90, 24]], { width: [9, 9.5, 8], round: 0.6, inner: 0.2, end: 'spiral', spiral: { turns: 0.9, R: 5, dir: -1, gap: 1.4 },
      contour: { inset: 0.9, line: 0.5 } }),
  ]
  kit.carve(panel, els, { height: 2.6, shoulder: 1.8, depth: 0.45, seed, irregularity: 1 })
  kit.pillowBoss(panel, { c: [cx - 30, h - 47], w: 9, h: 7.5, round: 0.9, height: 3.2, crown: 1, slit: false })
  kit.leiwenFill(panel, { rect: { x: 2, y: 2, w: cx - 2, h: h - 4 }, margin: 0.8 }, { pitch: 1.3, line: 0.5, depth: 0.25, cell: [5, 8.5], pairs: 0.4, seed })
  panel.mirrorX()
  return panel.bake()
}

/** eave fascia: one row of squared spirals (photo 45, top edge; photo 44 edge) */
export function fasciaPanel(kit, { w, h }, { ppmm, seed }) {
  const panel = new kit.ReliefPanel({ width: w, height: h, ppmm, seed, maxSize: 2048 })
  kit.leiwenFill(panel, { rect: { x: 2, y: 1.4, w: w - 4, h: h - 2.8 }, margin: 0.4, avoid: null }, { pitch: 0.85, line: 0.5, depth: 0.35, cell: [5, 6.6], pairs: 0, maxAspect: 1.3, follow: 0, seed })
  return panel.bake()
}

/** cap slopes (k = 0 front … 3 left): a fat hooked band pair with pillow eyes either side of the centre line
 *  (photos 41, 43, 44: big rolled hooks and oval plates; approximate — the slopes are seen obliquely only) */
export function capSlopePanel(kit, { w, h }, { ppmm, seed }) {
  // the cap's short steep border: a leiwen band only (44 — the creature is all on the domed plateau)
  const panel = new kit.ReliefPanel({ width: w, height: h, ppmm, seed, maxSize: 2048 })
  kit.leiwenFill(panel, { rect: { x: 2, y: 3, w: w - 4, h: h - 6 }, margin: 0.6, avoid: null }, { pitch: 1.1, line: 0.5, depth: 0.32, cell: [5.5, 8], pairs: 0.4, seed })
  return panel.bake()
}

/** plateau (plate frame: x = world x, y = −world z): ONE asymmetric creature in high relief (photos 41–44): a big
 *  raised oval pillow plate by the spout root, a ringed eye boss with a central dot, a jaw plate with teeth, a
 *  crested beaked head toward +X, fat rolled C-hooks round the hole and a scaly crested body along −X (left of the
 *  ridge); leiwen ground. The ridge and the hole are geometry (parts.js). */
export function capTopPanel(kit, { w, h }, { ppmm, seed }) {
  const panel = new kit.ReliefPanel({ width: w, height: h, ppmm, seed, maxSize: 2048 })
  const X = (x) => x + w / 2, Y = (y) => y + h / 2
  const Q = (pts) => pts.map(([x, y]) => [X(x), Y(y)])
  // positions read off photo 44 (camera over the handle-right corner), world (x, z) → plate (x, −z). The masses
  // are FAT and high (bands 20–30 mm, 8 mm proud): the creature covers most of the plateau.
  const els = [
    // the head: brow band from the eye out to a beak hooking down toward the +X −Z corner, a rolled crest above it
    kit.roundStroke(Q([[2, 30], [38, 42], [68, 44], [88, 26]]), { width: [24, 26, 20, 10], round: 0.8, inner: 0.25, end: 'point', contour: { inset: 1.4, line: 0.7 } }),
    kit.roundStroke(Q([[14, 58], [34, 72], [58, 70]]), { width: [12, 12, 10], round: 0.8, end: 'spiral', spiral: { turns: 0.9, R: 5, dir: -1, gap: 1.6 } }),
    // jaw plate (teeth cut below)
    kit.roundPlate({ c: [X(34), Y(10)], w: 60, h: 26, r: 10, contour: { inset: 1.4, line: 0.7 } }),
    // the scaly body from the jaw round toward the handle side, its tail rolled
    kit.roundStroke(Q([[64, -4], [74, -36], [60, -70], [26, -86]]), { width: [24, 26, 22, 16], round: 0.8, inner: 0.25, end: 'spiral', spiral: { turns: 1, R: 9, dir: -1, gap: 2.4 },
      contour: { inset: 1.4, line: 0.7 }, fill: { kind: 'scales', pitch: 6, line: 0.6 } }),
    // fat rolled C-hooks (limbs) between the body and the hole
    kit.roundStroke(Q([[24, -22], [24, -50], [8, -64]]), { width: [18, 20, 15], round: 0.85, inner: 0.25, end: 'spiral', spiral: { turns: 1, R: 7, dir: -1, gap: 2.2 }, contour: { inset: 1.2, line: 0.6 } }),
    kit.roundStroke(Q([[-44, 40], [-50, 6], [-70, -8]]), { width: [16, 17, 13], round: 0.85, end: 'spiral', spiral: { turns: 0.9, R: 6, dir: 1, gap: 2 } }),
  ]
  kit.carve(panel, els, { height: 7.5, shoulder: 5, depth: 0.7, seed, irregularity: 1.5 })
  panel.sink((ctx) => { ctx.lineWidth = 2; for (let i = 0; i < 5; i++) { const x = X(14 + i * 10); ctx.beginPath(); ctx.moveTo(x, Y(-1)); ctx.lineTo(x, Y(18)); ctx.stroke() } }, { depth: 2, profile: 'v' })
  kit.pillowBoss(panel, { c: [X(0), Y(76)], w: 92, h: 42, rot: -4, round: 0.7, height: 12, crown: 0.5, slit: false })
  kit.pillowBoss(panel, { c: [X(-4), Y(14)], w: 28, h: 27, round: 1, height: 9, crown: 1, slit: false, ring: { gap: 1.6, line: 1.3, depth: 1 } })
  panel.sink((ctx) => { ctx.beginPath(); ctx.arc(X(-4), Y(14), 3.2, 0, Math.PI * 2); ctx.fill() }, { depth: 2, profile: 'u' })
  kit.leiwenFill(panel, { rect: { x: 2, y: 2, w: w - 4, h: h - 4 }, margin: 0.8 }, { pitch: 1.2, line: 0.5, depth: 0.3, cell: [5, 8], pairs: 0.4, seed })
  return panel.bake()
}

/** spout tube (panel x = round the tube from the upper side, u 0.25 = +X, 0.75 = −X; y = up the tube):
 *  a jointed dragon body along each side, its head low by the root with a rolled crest (photos 42, 44) */
export function spoutPanel(kit, { w, h }, { ppmm, seed }) {
  const panel = new kit.ReliefPanel({ width: w, height: h, ppmm, seed, maxSize: 2048 })
  for (const c of [w / 4, (3 * w) / 4]) {
    const els = [
      kit.roundStroke([[c, 52], [c + 3, 110], [c - 2, 170], [c, 228]], { width: [17, 16, 14, 10], round: 0.6, start: 'blunt', end: 'spiral', spiral: { turns: 0.8, R: 5, dir: 1, gap: 1.4 },
        contour: { inset: 1, line: 0.6 }, fill: { kind: 'spirals', line: 0.55, pitch: 1.1, gap: 0.6, joints: true, min: 4 } }),
      kit.roundPlate({ c: [c, 36], w: 26, h: 26, r: 10, contour: { inset: 1, line: 0.6 }, fill: { kind: 'coil', pitch: 2.2, line: 0.8 } }),
    ]
    kit.carve(panel, els, { height: 2.8, shoulder: 1.8, depth: 0.5, seed })
    kit.pillowBoss(panel, { c: [c, 64], w: 7, h: 6, round: 0.7, height: 3.6, crown: 0.9, base: 'field', slit: { len: 2.6, width: 0.7, depth: 0.5 } })
  }
  // the tube between the dragons is plain (pitted by the patina), not leiwen (42, 44)
  return panel.bake()
}

/** horn plate face (plate mm, origin at the plate centre): an inner field framed by a sunk line, a squared G-spiral
 *  band carrying a chain of small spirals (photo 45, detail-handle-head) */
export function hornPanel(kit, { w, h }, { ppmm, seed, mirror }) {
  const panel = new kit.ReliefPanel({ width: w, height: h, ppmm, seed, maxSize: 1024 })
  const X = (x) => (mirror ? -x : x) + w / 2, Y = (y) => y + h / 2
  const g = kit.roundStroke([[X(-17), Y(11)], [X(14), Y(11)], [X(16), Y(-7)], [X(-3), Y(-10)]], {
    width: [7, 7.5, 7.5, 7], round: 0.6, inner: 0.2, end: 'spiral', spiral: { turns: 1.1, R: 5, dir: mirror ? 1 : -1, gap: 1.4 },
    contour: { inset: 0.8, line: 0.5 }, fill: { kind: 'spirals', line: 0.45, pitch: 0.9, gap: 0.4, min: 3.2 },
  })
  kit.carve(panel, [g], { height: 2.2, shoulder: 1.2, depth: 0.45, seed })
  // the frame line inside the notched border
  const x0 = w / 2 - 24, y0 = h / 2 - 17
  const frame = kit.shapes.fillet([[x0, y0], [x0 + 48, y0], [x0 + 48, y0 + 34], [x0, y0 + 34]], 9, { closed: true })
  panel.sink((ctx) => kit.shapes.strokeLine(ctx, [...frame, frame[0]], 1.3), { depth: 0.9, profile: 'v' })
  return panel.bake()
}
