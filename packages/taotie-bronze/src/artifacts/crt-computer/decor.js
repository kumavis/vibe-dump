// crt-computer — the décor, one ReliefPanel per mould face, in the kit's rounded vocabulary (KIT.md § Rounded bands):
// fat flat-topped bands with hooked / rolled ends, a sunk contour line and spiral chains on their tops, pillow eyes,
// a fine leiwen ground. The composition (which feature became which motif):
//
//   monitor bezel   the monitor's face is a FACE: the screen is the great open mouth; the eyes are pillow bosses
//                   flanking it at the upper corners; fat G-horns run across the forehead from above each eye to a
//                   crest on the axis; the upper jaws run down the sides and end in fangs at the mouth's lower
//                   corners; the three knobs on the chin are a row of bosses between two confronted kui.
//   screen          a plain polished bronze mirror (form.js; no relief at all).
//   monitor top     confronted kui on the front box; three rising blades on the pyramid pointing back to the tube;
//                   vent slots as real sunk slits in ladders along the corner flanges, at the flanges' notch pitch.
//   monitor sides   a vertical kui, head down, on the front box; blades and vent ladders on the pyramid.
//   back cover      a boss lattice (乳钉雷纹).
//   system unit     a low fang box: a frieze of confronted kui whose mouths meet at the floppy slot; whorl circles
//                   for the lamps, a ringed pillow boss for the power button, horizontal vent grooves; bowstrings.
//   keyboard        the key-caps are a field of pillow bosses with nipples (乳钉) on a lozenge-and-spiral ground,
//                   a twisted-rope border; the space bar a long plain bar; the lock lamps three tiny whorls.
//   cable           a snake body: scales all round (form.js puts its head biting the keyboard's back edge).
//
// All panel mm, origin bottom-left, y up.

import { UNIT, MON, BEZEL, KEYB, KNOB_X, KNOB_Y, UNIT_FRONT, rrect } from './layout.js'

const LINE = 0.55 // incised line on plateau tops
const sfill = (o = {}) => ({ kind: 'spirals', line: 0.45, pitch: 0.85, gap: 0.42, square: 0.25, tail: false, min: 3.4, ...o })
const contour = (inset = 1.0) => ({ inset, line: LINE })
const GROUND = { pitch: 1.5, line: 0.5, depth: 0.45, roundness: 0.12, jitter: 0.06, pairs: 0.6, echo: 1 }

const newPanel = (kit, w, h, ppmm, seed) => new kit.ReliefPanel({ width: w, height: h, ppmm, seed })

/** orientation sign of a point map (−1 mirrors) */
function det(T) {
  const a = T([0, 0]), b = T([1, 0]), c = T([0, 1])
  return Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) || 1
}

/** a hole-free rounded rect path (+ optional reversed inner loop = a hole by the nonzero rule) */
function pathPts(ctx, pts) {
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.closePath()
}

function hline(panel, x0, x1, y, { width = 2, height = 1.3 } = {}) {
  panel.raise((ctx) => { ctx.beginPath(); ctx.rect(x0, y - width / 2, x1 - x0, width); ctx.fill() }, { height, profile: 'dome', shoulder: width / 2 })
}

/** a twisted cord along an axis-aligned segment (horizontal or vertical) */
function rope(panel, a, b, { width = 4.2, height = 1.9, pitch = 3.4, slant = 50 } = {}) {
  const vert = Math.abs(b[0] - a[0]) < 1e-6
  const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]), y1 = Math.max(a[1], b[1])
  panel.raise((ctx) => {
    ctx.beginPath()
    if (vert) ctx.rect(a[0] - width / 2, y0, width, y1 - y0)
    else ctx.rect(x0, a[1] - width / 2, x1 - x0, width)
    ctx.fill()
  }, { height, profile: 'dome', shoulder: width / 2 })
  const t = Math.tan((slant * Math.PI) / 180) * (width / 2 + 0.4)
  panel.sink((ctx) => {
    ctx.save()
    ctx.beginPath()
    if (vert) ctx.rect(a[0] - width / 2 - 0.2, y0, width + 0.4, y1 - y0)
    else ctx.rect(x0, a[1] - width / 2 - 0.2, x1 - x0, width + 0.4)
    ctx.clip()
    ctx.lineWidth = pitch * 0.3
    ctx.beginPath()
    if (vert) {
      for (let y = y0 - pitch * 3; y < y1 + pitch * 3; y += pitch) { ctx.moveTo(a[0] - width / 2 - 0.4, y - t); ctx.lineTo(a[0] + width / 2 + 0.4, y + t) }
    } else {
      for (let x = x0 - pitch * 3; x < x1 + pitch * 3; x += pitch) { ctx.moveTo(x - t, a[1] - width / 2 - 0.4); ctx.lineTo(x + t, a[1] + width / 2 + 0.4) }
    }
    ctx.stroke()
    ctx.restore()
  }, { depth: height * 0.55, profile: 'u', shoulder: pitch * 0.14 })
}

// ------------------------------------------------------------------ the kui

/**
 * A kui in a band Hb mm tall and Lb mm long, authored in a design frame (x along the body from the head at x = 0, the
 * mouth gaping toward −x; y across the band, 0 = belly side), mapped to panel mm by T. → { els, eye }
 */
export function kui(kit, T, Hb, Lb, { crest = true, legs = true } = {}) {
  const s = Hb
  const lam = Lb / Hb
  const P = (pts) => pts.map(([x, y]) => T([x * s, y * s]))
  const sg = det(T)
  const els = [
    // head: a rounded block carrying the eye
    kit.roundPoly(P([[0.1, 0.24], [0.72, 0.24], [0.72, 0.8], [0.1, 0.8]]), { round: 0.2 * s, contour: contour(0.9) }),
    // upper jaw: out in front of the head and hooked down — the gaping mouth
    kit.roundStroke(P([[0.4, 0.93], [-0.06, 0.93], [-0.06, 0.6]]), { width: [0.15 * s, 0.15 * s, 0.11 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }),
    // lower jaw, curling up
    kit.roundStroke(P([[0.32, 0.1], [-0.02, 0.1], [-0.02, 0.32]]), { width: [0.13 * s, 0.13 * s, 0.1 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }),
    // body: a fat jointed band, the tail rising and rolling back in
    kit.roundStroke(P([[0.66, 0.46], [lam - 0.36, 0.46], [lam - 0.1, 0.46], [lam - 0.1, 0.78], [lam - 0.34, 0.78]]), {
      width: [0.3 * s, 0.28 * s, 0.26 * s, 0.22 * s, 0.2 * s], round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 0.9, dir: -sg, gap: 0.06 * s },
      contour: contour(0.9), fill: sfill({ joints: true, min: 0.12 * s }),
    }),
  ]
  if (crest) {
    els.push(kit.roundStroke(P([[0.86, 0.66], [0.86, 0.94], [Math.min(lam * 0.55, 2.0), 0.94]]), {
      width: [0.15 * s, 0.15 * s, 0.1 * s], round: 0.8, inner: 0.25, end: 'point', contour: contour(0.7),
    }))
  }
  if (legs) {
    els.push(kit.roundStroke(P([[1.02, 0.32], [1.02, 0.07], [1.5, 0.07]]), {
      width: [0.15 * s, 0.14 * s, 0.11 * s], round: 0.8, inner: 0.25, end: 'spiral', spiral: { turns: 0.75, dir: sg, gap: 0.04 * s }, contour: false,
    }))
    if (lam > 2.6) {
      els.push(kit.roundStroke(P([[lam - 0.9, 0.3], [lam - 0.9, 0.07], [lam - 0.45, 0.07]]), {
        width: [0.14 * s, 0.13 * s, 0.1 * s], round: 0.8, inner: 0.25, end: 'point', contour: false,
      }))
    }
  }
  const c = T([0.41 * s, 0.52 * s])
  const e = T([0.42 * s, 0.53 * s])
  return { els, eye: { c, w: 0.3 * s, h: 0.25 * s, rot: (Math.atan2(e[1] - c[1], e[0] - c[0]) * 180) / Math.PI - 45 } }
}

function kuiEye(kit, panel, eye, height) {
  kit.pillowBoss(panel, { c: eye.c, w: eye.w, h: eye.h, round: 0.55, height, crown: 0.85, slit: { len: eye.w * 0.36, width: Math.max(0.6, eye.w * 0.07), depth: 0.6 } })
}

// ------------------------------------------------------------------ monitor bezel: the face

export function bezelPanel(kit, { ppmm, seed }) {
  const W = BEZEL.w, H = BEZEL.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const cx = W / 2
  const P = ([X, Y]) => [cx - X, Y] // author the half-face with X outward from the axis (left half in the panel)
  const Ps = (pts) => pts.map(P)
  const hole = { c: [cx, H / 2 + BEZEL.screenDy], w: BEZEL.screenW, h: BEZEL.screenH, r: BEZEL.screenR }
  const holeTop = hole.c[1] + hole.h / 2, holeBot = hole.c[1] - hole.h / 2, holeX = hole.w / 2 // X of the opening's side
  const H1 = 2.6 // plateau
  // the mouth's lip (a round cord round the opening where the bezel's slope meets the face) and the outer frame
  panel.raise((ctx) => {
    ctx.beginPath(); pathPts(ctx, rrect(hole.c, hole.w + 2 * 7.2, hole.h + 2 * 7.2, hole.r + 7.2, 10)); pathPts(ctx, rrect(hole.c, hole.w + 2 * 10.4, hole.h + 2 * 10.4, hole.r + 10.4, 10).reverse()); ctx.fill()
    ctx.beginPath(); pathPts(ctx, rrect([cx, H / 2], W - 2 * 4.6, H - 2 * 4.6, BEZEL.r - 4.6, 10)); pathPts(ctx, rrect([cx, H / 2], W - 2 * 7.8, H - 2 * 7.8, BEZEL.r - 7.8, 10).reverse()); ctx.fill()
  }, { height: 1.6, profile: 'dome' })

  const xSide = holeX + 20.5 // centre line of the side strips
  const yEye = H - 22 // the eyes sit on the forehead, either side of the crest, over the mouth
  const els = [
    // crest on the axis between the eyes: a shield with a ladder of ticks
    kit.roundPoly(Ps([[-1, holeTop + 12], [8, holeTop + 12], [10.5, yEye + 2], [6, H - 9.6], [-1, H - 9.6]]), { round: [0, 3, 3, 2, 0], contour: contour(1.1), ticks: { side: 'outer', pitch: 3.2, line: 0.5, length: 1.4 } }),
    // the horn: up beside the eye, out along the forehead, down the outer column, rolled in toward the mouth
    kit.roundStroke(Ps([[69, yEye - 8], [69, yEye + 5.5], [xSide, yEye + 5.5], [xSide, holeTop - 22]]), {
      width: [10, 11, 11.5, 10.5], round: 0.85, inner: 0.3, start: 'blunt', end: 'spiral', spiral: { turns: 1.0, dir: 1, gap: 1.3 },
      contour: { inset: [1.0, 1.8], line: LINE }, ticks: { side: 'outer', pitch: 3.6, line: 0.5 }, fill: sfill({ min: 4.0 }),
    }),
    // the brow under the horn's run, its outer end hooking down: a fat bar over the eye's outer corner
    kit.roundStroke(Ps([[76, yEye - 5.5], [124, yEye - 5.5], [131, holeTop + 12.5]]), {
      width: [7.4, 7.4, 5.2], round: 0.85, inner: 0.3, end: 'point', contour: contour(0.8), fill: sfill({ min: 3.4 }),
    }),
    // the cheek / ear: a rounded block cut with a coil, on the side strip under the horn's curl
    kit.roundPlate({ c: P([xSide + 1, holeTop - 62]), w: 23, h: 19, r: 7.5, contour: contour(0.9), fill: { kind: 'coil', pitch: 1.4, line: LINE } }),
    // the upper jaw: down the side strip, a fang hooking in at the mouth's lower corner
    kit.roundStroke(Ps([[xSide + 2, holeTop - 82], [xSide + 2, holeBot - 2], [holeX - 4, holeBot - 14]]), {
      width: [13, 12.5, 7], round: 0.85, inner: 0.3, start: 'blunt', end: 'point',
      contour: { inset: [1.0, 1.6], line: LINE }, fill: sfill({ joints: true, min: 4 }),
    }),
  ]
  // the chin: a kui on each side facing the knob row (head toward the axis)
  const kH = 40, kL = 96, kx0 = 61, ky0 = 12
  const K = kui(kit, ([x, y]) => P([kx0 + x, ky0 + y]), kH, kL)
  els.push(...K.els)
  kit.carve(panel, els, { height: H1, shoulder: 0.7, depth: 0.45, irregularity: 0.8, seed })
  // the eyes: big pillow bosses with slit pupils, the highest relief on the face
  kit.pillowBoss(panel, { c: P([40, yEye - 0.5]), w: 35, h: 24.5, round: 0.82, height: 7.2, crown: 0.95, rot: -6, slit: { len: 14, width: 2.6, depth: 2.0, offset: [-1.2, -0.3] }, ring: { gap: 1.0, line: 0.9, depth: 0.7 } })
  kuiEye(kit, panel, K.eye, 3.6)
  // the knobs' collars: a sunk ring round each and a raised ring outside it (the knobs themselves are cast bosses)
  panel.raise((ctx) => {
    for (const x of KNOB_X) { if (x > 0) continue; ctx.beginPath(); ctx.arc(cx + x, KNOB_Y, 15.5, 0, Math.PI * 2); ctx.arc(cx + x, KNOB_Y, 12.6, 0, Math.PI * 2, true); ctx.fill() }
  }, { height: 1.8, profile: 'dome' })
  // ground: leiwen everywhere on the face that is not the mouth
  kit.leiwenFill(panel, {
    include: (ctx) => { ctx.beginPath(); pathPts(ctx, rrect([cx, H / 2], W - 16, H - 16, BEZEL.r - 8, 8)); pathPts(ctx, rrect(hole.c, hole.w + 22, hole.h + 22, hole.r + 11, 8).reverse()); ctx.fill() },
    rect: { x: 0, y: 0, w: cx, h: H },
    margin: 0.6,
  }, { ...GROUND, pitch: 1.55, seed })
  panel.mirrorX()
  return panel.bake()
}

// ------------------------------------------------------------------ system unit

/** front: kui frieze meeting at the floppy slot over a lower register (bay, power boss, lamps, vent grooves) */
export function unitFrontPanel(kit, { ppmm, seed }) {
  const W = UNIT.w, H = UNIT.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const cx = W / 2
  const F = UNIT_FRONT
  // register borders
  hline(panel, -1, W + 1, 4.8, { width: 2.4, height: 1.4 })
  hline(panel, -1, W + 1, H - 4.4, { width: 2.4, height: 1.4 })
  kit.bowstrings(panel, { x: -1, y: 58.5, w: W + 2, h: 8 }, { count: 2, width: 2.2, height: 1.3, spacing: 4.2 })
  // upper register: two kui, their gaping mouths meeting at the floppy drive (the plate stands over the gap)
  const yb = 67.5, kH = 36, kL = 128
  const xL = cx - F.floppy.w / 2 - 2.5 // left kui's mouth
  const left = kui(kit, ([x, y]) => [xL - x, yb + y], kH, kL)
  const right = kui(kit, ([x, y]) => [W - (xL - x), yb + y], kH, kL)
  kit.carve(panel, [...left.els, ...right.els], { height: 2.2, shoulder: 0.6, depth: 0.42, irregularity: 0.8, seed })
  kuiEye(kit, panel, left.eye, 3.4)
  kuiEye(kit, panel, right.eye, 3.4)
  // lower register: the power button's collar (a whorl ring), the lamps (whorl circles), vent grooves
  const [px, py] = F.power
  panel.raise((ctx) => { ctx.beginPath(); ctx.arc(px, py, 21, 0, Math.PI * 2); ctx.arc(px, py, 17.4, 0, Math.PI * 2, true); ctx.fill() }, { height: 2.0, profile: 'dome' })
  for (const [lx, ly] of F.lamps) kit.drawMotif(panel, 'whorl', { x: lx - 11, y: ly - 11, w: 22, h: 22 }, { relief: { motif: 1.8, boss: 3.4, groove: 0.4 } }, { preset: 'four-spokes', ground: false })
  const vents = (x0, x1) => panel.sink((ctx) => {
    for (let i = 0; i < 5; i++) { const y = 17 + i * 8.4; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.lineWidth = 3.6; ctx.lineCap = 'round'; ctx.stroke() }
  }, { depth: 2.4, profile: 'u', shoulder: 0.9 })
  vents(78, 122)
  vents(298, 336)
  // under the drive plates: deep and plain (the floppy slit looks into this)
  panel.sink((ctx) => { ctx.beginPath(); ctx.rect(cx - 50, F.floppy.y - 1, 100, 9); ctx.fill() }, { depth: 1.6, profile: 'u', shoulder: 0.6 })
  kit.leiwenFill(panel, {
    rect: { x: 0, y: 7, w: W, h: H - 13.5 },
    avoid: (ctx) => {
      ctx.beginPath(); ctx.rect(cx - F.floppy.w / 2 - 1, F.floppy.y - F.floppy.h / 2 - 1, F.floppy.w + 2, F.floppy.h + 2)
      ctx.rect(cx - F.bay.w / 2 - 1, F.bay.y - F.bay.h / 2 - 1, F.bay.w + 2, F.bay.h + 2)
      ctx.rect(70, 12, 60, 42); ctx.rect(290, 12, 54, 42)
      ctx.fill()
      ctx.beginPath(); ctx.arc(px, py, 22, 0, Math.PI * 2); ctx.fill()
      // and everything raised
    },
    margin: 0.6,
  }, { ...GROUND, pitch: 1.4, seed })
  return panel.bake()
}

/** sides: a kui pair confronted round a whorl over a band of long vent grooves */
export function unitSidePanel(kit, { ppmm, seed }) {
  const W = UNIT.d, H = UNIT.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const cx = W / 2
  hline(panel, -1, W + 1, 4.8, { width: 2.4, height: 1.4 })
  hline(panel, -1, W + 1, H - 4.4, { width: 2.4, height: 1.4 })
  kit.bowstrings(panel, { x: -1, y: 58.5, w: W + 2, h: 8 }, { count: 2, width: 2.2, height: 1.3, spacing: 4.2 })
  const yb = 67.5, kH = 36, kL = 140
  const xm = cx - 19
  const left = kui(kit, ([x, y]) => [xm - x, yb + y], kH, kL)
  kit.carve(panel, left.els, { height: 2.2, shoulder: 0.6, depth: 0.42, irregularity: 0.8, seed })
  kuiEye(kit, panel, left.eye, 3.4)
  kit.drawMotif(panel, 'whorl', { x: cx - 15, y: yb + 3, w: 30, h: 30 }, { relief: { motif: 2.0, boss: 3.6, groove: 0.45 } }, { preset: 'five-spokes', ground: false })
  // vents: five long grooves, broken into three lengths like a cast grille
  panel.sink((ctx) => {
    ctx.lineWidth = 3.8; ctx.lineCap = 'round'
    for (let i = 0; i < 5; i++) {
      const y = 15.5 + i * 8.6
      for (const [a, b] of [[24, 112], [130, 230], [248, 336]]) { ctx.beginPath(); ctx.moveTo(a, y); ctx.lineTo(b, y); ctx.stroke() }
    }
  }, { depth: 2.6, profile: 'u', shoulder: 0.9 })
  kit.leiwenFill(panel, { rect: { x: 0, y: yb - 1, w: cx, h: H - yb - 5.5 }, margin: 0.6 }, { ...GROUND, pitch: 1.4, seed })
  // lower register ends: plain ground between the grilles
  panel.mirrorX()
  return panel.bake()
}

export function unitLidPanel(kit, { ppmm, seed }) {
  const W = UNIT.w + 2 * UNIT.lidOver, H = UNIT.d + 2 * UNIT.lidOver
  const panel = newPanel(kit, W, H, ppmm, seed)
  kit.bowstrings(panel, { x: 10, y: 6, w: W - 20, h: 8 }, { count: 2, width: 2.4, height: 1.2, spacing: 4.4 })
  kit.bowstrings(panel, { x: 10, y: H - 14, w: W - 20, h: 8 }, { count: 2, width: 2.4, height: 1.2, spacing: 4.4 })
  kit.bowstrings(panel, { x: 6, y: 10, w: 8, h: H - 20 }, { count: 2, width: 2.4, height: 1.2, spacing: 4.4, vertical: true })
  kit.bowstrings(panel, { x: W - 14, y: 10, w: 8, h: H - 20 }, { count: 2, width: 2.4, height: 1.2, spacing: 4.4, vertical: true })
  for (const [x, y] of [[34, 34], [W - 34, 34], [W - 34, H - 34], [34, H - 34]]) {
    kit.drawMotif(panel, 'whorl', { x: x - 15, y: y - 15, w: 30, h: 30 }, { relief: { motif: 1.6, boss: 3, groove: 0.4 } }, { preset: 'four-spokes', ground: false })
  }
  return panel.bake()
}

export function bayPanel(kit, { ppmm, seed }) {
  const W = UNIT_FRONT.bay.w, H = UNIT_FRONT.bay.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  // the tray: a long sunk slit, a small button boss, a raised frame
  panel.raise((ctx) => { ctx.beginPath(); pathPts(ctx, rrect([W / 2, H / 2], W - 6, H - 6, 2.4)); pathPts(ctx, rrect([W / 2, H / 2], W - 10.4, H - 10.4, 1.2).reverse()); ctx.fill() }, { height: 1.2, profile: 'dome' })
  panel.sink((ctx) => { ctx.beginPath(); ctx.rect(14, 24.4, W - 28, 2.6); ctx.fill() }, { depth: 1.6, profile: 'u', shoulder: 0.5 })
  kit.pillowBoss(panel, { c: [W - 22, 13], w: 14, h: 6.5, round: 0.35, height: 2.4, crown: 0.6, slit: false })
  kit.drawMotif(panel, 'whorl', { x: 14, y: 6.5, w: 13, h: 13 }, { relief: { motif: 1.2, boss: 2.2, groove: 0.35 } }, { preset: 'four-spokes', ground: false })
  return panel.bake()
}

// ------------------------------------------------------------------ monitor housing

/** vent slots: a ladder of sunk slits along a slanted edge, at the flange's notch pitch */
function ventLadder(panel, edgeX, y0, y1, { side = 1, pitch = 15, len = 24, width = 4.6, inset = 6, depth = 2.8 } = {}) {
  panel.sink((ctx) => {
    ctx.lineWidth = width; ctx.lineCap = 'round'
    for (let y = y0; y <= y1 + 1e-6; y += pitch) {
      const x = edgeX(y) + side * inset
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + side * len, y); ctx.stroke()
    }
  }, { depth, profile: 'u', shoulder: 1.0 })
}

/** the pyramid cell: rising blades toward the tube, vent ladders along both slanted edges */
function taperCell(kit, cell, { ppmm, seed, blades = 3, flange = 15 }) {
  const W = cell.wMax, H = cell.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const wAt = (y) => cell.wBottom + ((cell.wTop - cell.wBottom) * y) / H
  const xl = (y) => (W - wAt(y)) / 2, xr = (y) => (W + wAt(y)) / 2
  // two bowstrings across the front of the cell
  panel.raise((ctx) => { ctx.beginPath(); ctx.rect(0, 5, W, 2.2); ctx.rect(0, 10, W, 2.2); ctx.fill() }, { height: 1.2, profile: 'dome' })
  // vents
  const pitchY = flange * (H / Math.hypot(H, (cell.wBottom - cell.wTop) / 2))
  ventLadder(panel, xl, 20, H - 10, { side: 1, pitch: pitchY })
  ventLadder(panel, xr, 20, H - 10, { side: -1, pitch: pitchY })
  // blades: base on the front bowstrings, tip toward the tube
  const m = 38
  const yb = 16, yt = H - 8
  const bl = []
  const x0 = xl(yb) + m, x1 = xr(yb) - m
  const xt0 = xl(yt) + m, xt1 = xr(yt) - m
  for (let i = 0; i < blades; i++) {
    const a = x0 + ((x1 - x0) * i) / blades, b = x0 + ((x1 - x0) * (i + 1)) / blades
    const tip = xt0 + ((xt1 - xt0) * (i + 0.5)) / blades
    bl.push(kit.roundPoly([[a + 2, yb], [b - 2, yb], [tip, yt]], { round: [4, 4, 2.4], contour: { inset: 1.6, line: LINE } }))
  }
  kit.carve(panel, bl, { height: 1.6, shoulder: 0.6, depth: 0.42, seed })
  // inside each blade: a cicada-like stack — a head plate with two eyes and a tapering chevroned body
  const inner = []
  const eyes = []
  for (let i = 0; i < blades; i++) {
    const a = x0 + ((x1 - x0) * i) / blades, b = x0 + ((x1 - x0) * (i + 1)) / blades
    const tip = xt0 + ((xt1 - xt0) * (i + 0.5)) / blades
    const cxb = (a + b) / 2, wb = b - a
    inner.push(kit.roundPlate({ c: [cxb, yb + 14], w: wb * 0.58, h: 13, r: 4.5, contour: contour(0.8) }))
    inner.push(kit.roundStroke([[cxb + (tip - cxb) * 0.12, yb + 24], [cxb + (tip - cxb) * 0.78, yt - 26]], { width: [wb * 0.26, 3], end: 'point', contour: contour(0.8), fill: { kind: 'lines', line: 0.5, pitch: 1.6 } }))
    eyes.push([cxb - wb * 0.17, yb + 14], [cxb + wb * 0.17, yb + 14])
  }
  kit.carve(panel, inner, { height: 2.6, shoulder: 0.5, depth: 0.4, seed: seed + 1 })
  for (const c of eyes) kit.pillowBoss(panel, { c, w: 7, h: 6, round: 0.7, height: 3.6, crown: 1, base: 'field', slit: false })
  kit.leiwenFill(panel, {
    include: (ctx) => { ctx.beginPath(); ctx.moveTo(xl(14) + 33, 14); ctx.lineTo(xr(14) - 33, 14); ctx.lineTo(xr(H - 4) - 33, H - 4); ctx.lineTo(xl(H - 4) + 33, H - 4); ctx.closePath(); ctx.fill() },
    margin: 0.6,
  }, { ...GROUND, pitch: 1.5, seed })
  return panel.bake()
}

/** the tube block: two bowstrings round it */
function blockCell(kit, cell, { ppmm, seed }) {
  const panel = newPanel(kit, cell.w, cell.h, ppmm, seed)
  kit.bowstrings(panel, { x: -1, y: cell.h * 0.3, w: cell.w + 2, h: cell.h * 0.4 }, { count: 2, width: 2.6, height: 1.4, spacing: 6 })
  return panel.bake()
}

/** monitor top, front box: confronted kui about the axis, vent ladders along both corner flanges */
function topFrontCell(kit, cell, { ppmm, seed }) {
  const W = cell.w, H = cell.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const cx = W / 2
  ventLadder(panel, () => 0, 9, H - 6, { side: 1, pitch: 15, len: 22, inset: 5 })
  const yb = (H - 50) / 2, kH = 50, kL = 112
  // head at the axis: the left kui looks right toward the centre
  const left = kui(kit, ([x, y]) => [cx - 9 - x, yb + y], kH, kL)
  kit.carve(panel, left.els, { height: 2.2, shoulder: 0.6, depth: 0.42, irregularity: 0.8, seed })
  kuiEye(kit, panel, left.eye, 3.4)
  kit.leiwenFill(panel, { rect: { x: 30, y: 4, w: cx - 30, h: H - 8 }, margin: 0.6 }, { ...GROUND, pitch: 1.5, seed })
  panel.mirrorX()
  return panel.bake()
}

/**
 * monitor side, front box: a vertical kui, head down at the bottom, climbing up the side; vents along both flanges.
 * Design frame (d, h): d mm back from the front edge, h mm up from the bottom; `map` takes it to the side's panel.
 */
function sideFrontCell(kit, cell, map, { ppmm, seed }) {
  const W = cell.w, H = cell.h // W runs along the monitor's height (panel x), H backward (panel y)
  const panel = newPanel(kit, W, H, ppmm, seed)
  const M = (p) => map(p, W)
  const kH = 64, kL = W - 44
  // vertical kui: body along h (x of the kui frame → h), its band across d (y of the frame → d, crest toward the back)
  const K = kui(kit, ([x, y]) => M([H / 2 - kH / 2 + y, 20 + x]), kH, kL)
  kit.carve(panel, K.els, { height: 2.2, shoulder: 0.6, depth: 0.42, irregularity: 0.8, seed })
  kuiEye(kit, panel, K.eye, 3.6)
  kit.leiwenFill(panel, { rect: { x: 4, y: 3, w: W - 8, h: H - 6 }, margin: 0.6 }, { ...GROUND, pitch: 1.5, seed })
  return panel.bake()
}

/**
 * All monitor housing panels from the fang layout (monitorLayout): rows back → front. The fang's "front" side is the
 * monitor's top, "right"/"left" its sides (their panel x runs down the right side and up the left side, panel y backward).
 */
export function monitorPanels(kit, layout, { ppmm, seed }) {
  const top = layout.sides.front.cells.map((r) => r[0])
  const right = layout.sides.right.cells.map((r) => r[0])
  const left = layout.sides.left.cells.map((r) => r[0])
  // (d, h) → panel: right side x = W − h, left side x = h; y = d
  const mapR = ([d, h], W) => [W - h, d]
  const mapL = ([d, h]) => [h, d]
  return {
    top: [blockCell(kit, top[0], { ppmm, seed: seed + 1 }), taperCell(kit, top[1], { ppmm: ppmm * 0.9, seed: seed + 2 }), topFrontCell(kit, top[2], { ppmm, seed: seed + 3 })],
    right: [blockCell(kit, right[0], { ppmm, seed: seed + 4 }), taperCell(kit, right[1], { ppmm: ppmm * 0.9, seed: seed + 5, blades: 2 }), sideFrontCell(kit, right[2], mapR, { ppmm, seed: seed + 6 })],
    left: [blockCell(kit, left[0], { ppmm, seed: seed + 7 }), taperCell(kit, left[1], { ppmm: ppmm * 0.9, seed: seed + 8, blades: 2 }), sideFrontCell(kit, left[2], mapL, { ppmm, seed: seed + 9 })],
  }
}

export function backCapPanel(kit, { ppmm, seed }) {
  const W = MON.backW + 8, H = MON.backH + 8
  const panel = newPanel(kit, W, H, ppmm, seed)
  panel.raise((ctx) => { ctx.beginPath(); pathPts(ctx, rrect([W / 2, H / 2], W - 8, H - 8, 10)); pathPts(ctx, rrect([W / 2, H / 2], W - 13, H - 13, 8).reverse()); ctx.fill() }, { height: 1.4, profile: 'dome' })
  kit.drawMotif(panel, 'boss', { x: 12, y: 12, w: W - 24, h: H - 24 }, { side: 24, nipple: 3.6, nippleHeight: 5, ridge: 1.4 }, { preset: 'gui-belly', ground: { pitch: 1.4 } })
  return panel.bake()
}

// ------------------------------------------------------------------ keyboard

/** the key layout (deck mm, origin bottom-left = front-left corner of the deck): [{ x, y, w, h, kind }] */
export function keyLayout() {
  const u = KEYB.u, gap = 3.6
  const mainW = 15 * u, padW = 4 * u, mid = 0.6 * u
  const x0 = (KEYB.w - (mainW + mid + padW)) / 2
  const rowsY = [] // front → back: space, Z, A, Q, number, F
  const yFront = 18
  for (let i = 0; i < 5; i++) rowsY.push(yFront + u / 2 + i * u)
  rowsY.push(rowsY[4] + u + 6)
  const rows = [
    [1.5, 1, 1.5, 7, 1.5, 1, 1.5].map((w, i) => ({ w, skip: i === 1 || i === 5 })), // ctrl, gap, alt, space, alt, gap, ctrl
    [2.25, ...Array(10).fill(1), 2.75].map((w) => ({ w })),
    [1.75, ...Array(11).fill(1), 2.25].map((w) => ({ w })),
    [1.5, ...Array(12).fill(1), 1.5].map((w) => ({ w })),
    [...Array(13).fill(1), 2].map((w) => ({ w })),
    [1, 1, 1, 1, 1, 1, 0.5, 1, 1, 1, 1, 0.5, 1, 1, 1, 1].map((w, i) => ({ w, skip: i === 1 || i === 6 || i === 11 })),
  ]
  const keys = []
  rows.forEach((row, r) => {
    let x = x0
    for (const k of row) {
      if (!k.skip) keys.push({ x: x + (k.w * u) / 2, y: rowsY[r], w: k.w * u - gap, h: u - gap, kind: k.w >= 6 ? 'space' : k.w > 1 ? 'wide' : 'key' })
      x += k.w * u
    }
  })
  // numeric pad: 4 × 5 with tall + and Enter, a double-width 0
  const px = x0 + mainW + mid
  const pad = (c, r, w = 1, h = 1) => keys.push({ x: px + (c + w / 2) * u, y: rowsY[r] + ((h - 1) * u) / 2, w: w * u - gap, h: h * u - gap, kind: w > 1 || h > 1 ? 'wide' : 'key' })
  for (let c = 0; c < 4; c++) pad(c, 4)
  for (let c = 0; c < 3; c++) { pad(c, 3); pad(c, 2); pad(c, 1) }
  pad(3, 2, 1, 2) // +
  pad(3, 0, 1, 2) // Enter
  pad(0, 0, 2); pad(2, 0)
  // the lock lamps over the pad
  const lamps = [0.5, 2, 3.5].map((c) => [px + c * u, rowsY[5]])
  return { keys, lamps }
}

export function keyboardPanel(kit, { ppmm, seed }) {
  const W = KEYB.w, H = KEYB.d
  const panel = newPanel(kit, W, H, ppmm, seed)
  const { keys, lamps } = keyLayout()
  // the key-caps are cast bosses (form.js keycaps); here each sits in a sunk seat, so the corrosion gathers round its foot
  panel.sink((ctx) => {
    ctx.beginPath()
    for (const k of keys) pathPts(ctx, rrect([k.x, k.y], k.w + 2.6, k.h + 2.6, 3.4, 3))
    ctx.fill()
  }, { depth: 0.9, profile: 'u', shoulder: 0.5 })
  for (const [x, y] of lamps) kit.drawMotif(panel, 'whorl', { x: x - 6.5, y: y - 6.5, w: 13, h: 13 }, { relief: { motif: 1.2, boss: 2.4, groove: 0.3 } }, { preset: 'four-spokes', ground: false })
  // twisted-rope border
  const m = 7.5
  rope(panel, [m, m], [W - m, m])
  rope(panel, [m, H - m], [W - m, H - m])
  rope(panel, [m, m], [m, H - m])
  rope(panel, [W - m, m], [W - m, H - m])
  // the ground between the keys: lozenges with spirals
  kit.lozengeFill(panel, { rect: { x: m + 3, y: m + 3, w: W - 2 * m - 6, h: H - 2 * m - 6 }, avoid: (ctx) => { ctx.beginPath(); for (const k of keys) pathPts(ctx, rrect([k.x, k.y], k.w + 2.6, k.h + 2.6, 3.4, 3)); ctx.fill() }, margin: 0.55 }, { size: [11, 8.5], fill: 'spiral', pitch: 0.95, levels: 1, depth: 0.45, seed })
  return panel.bake()
}

// ------------------------------------------------------------------ the snake's body

export function cablePanel(kit, length, circumference, { ppmm, seed }) {
  const panel = newPanel(kit, circumference, length, ppmm, seed)
  // scales opening toward the tail, sized so a whole number of scales go round
  const n = 7
  kit.drawMotif(panel, 'scales', { x: -0.5, y: 0, w: circumference + 1, h: length }, { scale: circumference / n, open: 'up', relief: { motif: 0.9, boss: 1.4, groove: 0.5 }, lineWeight: 0.6 })
  return panel.bake()
}
