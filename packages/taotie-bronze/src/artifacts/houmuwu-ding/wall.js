// Houmuwu ding — one wall face (dossier §c.1–c.4).
//
// A frame of four décor bands round a PLAIN, lightly RECESSED field:
//   top / bottom friezes  two long kui confronted at the short mid-wall flange
//                          (heads meet at the flange: a T8 split-body face, no frontal mask)
//   side columns           one vertical K5 kui, head UP, facing the corner flange
//   corner squares         half-masks split across the arris (the corner flange is their nose):
//                          ox-head 牛首 (ribbed crescent horns) at the top, taotie at the bottom
// Every motif is a flat L1 plateau with one incised contour line, round domed
// boss eyes, squared spiral terminals, on a squared leiwen ground at 1.9 mm pitch.
// The left half is drawn with the axis on the mid flange and mirrored.

import { LEVELS, GROUND, style, sheet, sq, render, rect, inset, sqSpiralBox } from './draw.js'

const P = style(LEVELS.wall)

/** Frame geometry, panel mm (dossier §b.2, §c.3). */
export const FRAME = {
  bottom: 126, // bottom frieze height
  top: 123, // top frieze height
  topPlain: 5, // plain wall above the top frieze, in the rim's shadow
  column: 120, // side column width, from the arris
  border: 7, // plain raised border on the field side of each band
  recess: 2.6, // field recess below the frieze ground
}

/**
 * @param {object} kit
 * @param {{ wMax, wTop, wBottom, h }} cell  fangLayout cell (map 'true')
 * @param {{ kind: 'long'|'short', ppmm, seed }} o
 */
export function wallPanel(kit, cell, { kind, ppmm, seed }) {
  const W = cell.wMax, H = cell.h
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const cx = W / 2
  const edge = (y) => (W - (cell.wBottom + (cell.wTop - cell.wBottom) * (y / H))) / 2 // arris x at height y (left)
  const yB0 = 1.5, yB1 = FRAME.bottom
  const yT1 = H - FRAME.topPlain, yT0 = yT1 - FRAME.top
  const xi = edge(H / 2) + FRAME.column // column inner edge
  const half = cx - xi // frieze half length: axis → column (≈ 390 long, ≈ 245 short)

  const cells = {
    cornerTop: rect(edge(yT1), yT0, xi - edge(yT1), yT1 - yT0),
    cornerBot: rect(edge(yB0), yB0, xi - edge(yB0), yB1 - yB0),
    column: rect(edge(H / 2), yB1, xi - edge(H / 2), yT0 - yB1),
    friezeTop: rect(xi, yT0, half, yT1 - yT0),
    friezeBot: rect(xi, yB0, half, yB1 - yB0),
  }

  // ---- motifs (left half; axis = cx)
  const k = kind === 'short'
  friezeKui(kit, panel, cells.friezeTop, { short: k, seed: seed + 1, top: true })
  friezeKui(kit, panel, cells.friezeBot, { short: k, seed: seed + 2, top: false })
  oxHead(kit, panel, cells.cornerTop, { seed: seed + 3 })
  cornerTaotie(kit, panel, cells.cornerBot, { seed: seed + 4 })
  columnKui(kit, panel, cells.column, { seed: seed + 5 })

  // ---- leiwen ground in each band, with plain margins: 3 mm between cells,
  // a 7 mm raised border on the field side, a plain strip each side of the mid flange
  const b = FRAME.border
  const g = { ...GROUND, seed }
  const fill = (r) => panel.fillGround(g, { rect: r, margin: 0.7 })
  fill(inset(cells.friezeTop, 3, b, 9, 2.5))
  fill(inset(cells.friezeBot, 3, 3, 9, b))
  fill(inset(cells.cornerTop, 3, 3, 3, 2.5))
  fill(inset(cells.cornerBot, 3, 3, 3, 3))
  fill(inset(cells.column, 3, 3, b, 3))

  panel.mirrorX()

  // ---- the plain field, recessed 2–4 mm below the frieze ground (dossier §b.7)
  const field = rect(xi, yB1, W - 2 * xi, yT0 - yB1)
  panel.add((ctx) => ctx.fillRect(field.x, field.y, field.w, field.h), { height: -FRAME.recess, shoulder: 1.6, profile: 'plateau' })
  if (k) repairCracks(kit, panel, field, seed)
  return panel.bake()
}

// --------------------------------------------------------------------------
// Frieze kui (dossier §c.3 table; detail-frieze-top-centre.jpg, rubbing). Relief grammar
// (round-4 review): every element is a FLAT plateau at one height (3 mm) with near-vertical
// sides. Broad masses — the crest block and the body (≈ 2× the band width) — carry ONE inset
// contour groove; narrow bands (jaw, quills, curls, tail spiral, ≈ 9–10 mm) are left plain,
// as on the bronze (a groove 2 mm inside a 10 mm band reads as a piped double line).
// The head at the mid flange: a SOLID crest block (≈ 100 × 50) with a notch in its lower
// edge and two spirals incised into it, a round boss eye ≈ 35 from the axis, below it a ∩ jaw
// (top frieze) or clawed legs and a snout curling at the flange foot (bottom frieze). The body
// runs outward fringed above and below by a row of small squared C-hook quills and ends in a
// 3-turn squared tail spiral (≈ 80 long face, 62 short).

const BAND = 9.5 // crest / jaw / spiral band width (mm), photo 8–10
const BODY = 19 // kui body band (mm), photo 15–18; ≈ 2× BAND
const EYE = 8.5 // eye boss radius (Ø 17, photo 16–20)

/** Narrow-band style: flat plateau, no contour groove. */
const PN = style(LEVELS.wall, { carving: 'none' })

/** Two sheets over one rect: broad (one contour groove) and narrow (plain flat top). */
function sheets(kit, r, o) {
  return { B: sheet(kit, r, o), N: sheet(kit, r, { ...o, seed: (o.seed || 1) + 1000 }) }
}
function renderBoth(kit, panel, { B, N }, r) {
  render(kit, panel, N, PN, r)
  render(kit, panel, B, P, r)
}

/** A round curl continuing a stem that arrives at p heading `heading`°; dir +1 curls left (CCW), −1 right. */
function curl(kit, p, R, { heading = 90, dir = 1, sweep = 300, shrink = 0.3 } = {}) {
  const h = (heading * Math.PI) / 180
  const c = [p[0] - dir * Math.sin(h) * R, p[1] + dir * Math.cos(h) * R]
  return kit.shapes.cScroll(c, R, { start: heading - dir * 90, sweep, dir, shrink, step: 0.6 }).slice(1)
}

/** Closed squared-round polygon. */
function sqc(kit, pts, r = 6) {
  return kit.shapes.resample(kit.shapes.fillet(pts, r, { closed: true }), 0.8)
}

/** A row of n small squared C-hooks standing on y, pointing up (+1) / down (−1), each turned back toward −x. */
function hookRow(kit, S, x0, x1, y, n, { up = 1, h = 17, back = 11, w = 6.5, drop = 7 } = {}) {
  if (n < 1 || x1 - x0 < back + w) return
  const step = (x1 - x0) / n
  for (let i = 0; i < n; i++) {
    const x = x0 + step * (i + 0.5) + back / 2
    S.band(sq(kit, [[x, y - up * 2], [x, y + up * h], [x - back, y + up * h], [x - back, y + up * (h - drop)]], 2.5), w, 'flat')
  }
}

/**
 * Solid crest block: a squared-round plate (d0 → d1 from the axis side, y0 → y1) with a notch in
 * its lower edge, two spirals incised into it (detail-frieze-top-centre.jpg). X(d) maps distance from
 * the axis side to local x.
 */
function crestBlock(kit, B, X, d0, d1, y0, y1) {
  const D = d1 - d0, n0 = d0 + D * 0.44, n1 = n0 + 12, nh = Math.min(15, (y1 - y0) * 0.32)
  B.poly(sqc(kit, [[X(d0), y0], [X(n0), y0], [X(n0), y0 + nh], [X(n1), y0 + nh], [X(n1), y0], [X(d1), y0], [X(d1), y1], [X(d0), y1]], 7))
  // one incised squared C following the block 6 mm inside its edge, open at the notch, both ends
  // curling up into the block (the crest reads as a C-scroll, not as two round eyes)
  const e = 6.5, yb = y0 + e, yt = y1 - e, R = Math.min(9, (y1 - y0) * 0.2)
  const s1 = Math.sign(X(1) - X(0)) || 1
  const cL = kit.shapes.cScroll([X(n0 - e - R), yb + R], R, { start: -90, sweep: 420, dir: s1, shrink: 0.18, step: 0.5 })
  const cR = kit.shapes.cScroll([X(n1 + e + R), yb + R], R, { start: -90, sweep: 420, dir: -s1, shrink: 0.18, step: 0.5 })
  const path = [...cL.slice().reverse(), [X(d0 + e), yb], [X(d0 + e), yt], [X(d1 - e), yt], [X(d1 - e), yb], ...cR]
  B.line(kit.shapes.resample(kit.shapes.fillet(path, 5), 0.6), 1.4)
}

/** Half a frieze: `top` (∩ jaw) or bottom (clawed legs + snout). y from the band's bottom. */
function friezeKui(kit, panel, r, { short, seed, top }) {
  const L = r.w // the axis is at local x = L
  const h = r.h
  const SS = sheets(kit, r, { seed, wobble: 0.5 })
  const { B, N } = SS
  const rng = new kit.Rng(seed * 7 + 3)
  const A = (dx) => L - dx // distance from the axis → local x
  const tail = short ? 62 : 80 // tail spiral (mm square)
  const xT = 7 + tail // inner side of the tail spiral (local x)
  const yB = top ? 55 : 59 // body centre line
  const jog = top ? 3 : -3
  // CREST: solid block over the eye, beside the flange
  const c0 = top ? 70 : 73, c1 = top ? h - 8 : h - 11
  crestBlock(kit, B, A, 10, 104, c0, c1)
  // eye: domed boss ≈ 35 from the axis
  B.boss([A(35), top ? 55 : 57], EYE, { kind: 'round', base: 'ground', pupil: 'none' })
  // cheek: a curl hanging off the body behind the jaw, turning toward the flange
  N.taper([[A(94), yB - 6], [A(94), 30], ...curl(kit, [A(94), 30], 7.5, { heading: -90, dir: 1, sweep: 290 })], BAND, 6, 0.4)
  if (top) {
    // ∩ jaw beside the flange: inner leg on the flange, the outer foot curling outward
    N.band(sq(kit, [[A(64), 16], [A(64), 36], [A(20), 36], [A(20), 12], [A(13), 9]], 8), BAND)
    N.taper([[A(64), 17], ...curl(kit, [A(64), 15], 6, { heading: -90, dir: -1, sweep: 270 })], BAND, 5.5, 0.3)
  } else {
    // snout: down beside the flange under the eye, curling outward at the flange foot
    N.band(sq(kit, [[A(30), 40], [A(14), 40], [A(14), 18]], 6), BAND)
    N.taper([[A(14), 19], ...curl(kit, [A(14), 17], 7, { heading: -90, dir: -1, sweep: 290 })], BAND, 6, 0.3)
    // short legs off the body, claws hooked toward the flange
    const legs = short ? [A(140)] : [A(142), A(222)]
    for (const lx of legs) {
      N.taper(sq(kit, [[lx, yB - 6], [lx, 22], [lx + 17, 22]], 6), 12, 9, 0.5)
      N.taper([[lx + 17, 22], ...curl(kit, [lx + 19, 22], 5, { heading: 0, dir: -1, sweep: 240 })], 7.5, 4.5, 0.2)
      N.taper(sq(kit, [[lx + 1, 22], [lx + 1, 10], [lx + 11, 10]], 3), 8, 4.5, 0.4)
    }
  }
  // body: broad, flat, with a slight jog part-way (one contour groove)
  const xm = (A(100) + xT) / 2 + rng.jitter(15)
  B.band(sq(kit, [[A(102), yB], [xm + 5, yB], [xm - 5, yB + jog], [xT - 4, yB + jog]], 5), BODY, 'flat')
  // tail: a 3-turn squared spiral at the outer end (the leiwen is packed in its gaps)
  const yt = yB + jog
  const box = top ? [6, 10, xT, 10 + tail] : [6, h - 12 - tail, xT, h - 12]
  const sp = sqSpiralBox(box, short ? 11.5 : 14, 3, { flipY: !top })
  N.band(sq(kit, [[xT + 6, yt], [xT, yt], ...sp], 5), short ? 7.5 : 8.5)
  // quills: a row of small squared C-hooks above and below the body
  const yu = yt + BODY / 2, yd = yt - BODY / 2
  const pitch = 28
  const upEnd = A(112)
  hookRow(kit, N, xT + 4, upEnd, yu, Math.max(1, Math.round((upEnd - xT - 4) / pitch)), { up: 1, h: Math.min(18, c1 - yu - 12) })
  const dnEnd = top ? A(104) : (short ? A(140) : A(222)) - 12
  hookRow(kit, N, xT + 4, dnEnd, yd, Math.max(1, Math.round((dnEnd - xT - 4) / pitch)), { up: -1, h: Math.min(16, yd - 14) })
  renderBoth(kit, panel, SS, r)
}

// Upper corner: ox-head 牛首 half-mask, axis on the arris (local x = 0; the same drawing
// on both faces, so the two halves are mirror images about the corner flange): a broad
// ribbed crescent horn ≈ 45 tall across the whole square, its tip upturned at the outer
// side; boss eye ≈ 42 from the arris; ∩ jaw with a hooked fang; a C ear outside the eye.
function oxHead(kit, panel, r, { seed }) {
  const SS = sheets(kit, r, { seed, wobble: 0.45 })
  const { B, N } = SS
  const h = r.h, w = r.w
  const top = [], bot = []
  const n = 24
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = 3 + t * (w - 9)
    top.push([x, h - 5 - 3 * Math.sin(Math.PI * t)])
    bot.push([x, h - 52 + 16 * Math.sin(Math.PI * t * 0.5) + 26 * t * t * t])
  }
  B.poly([...top, ...bot.slice().reverse()])
  // transverse ribbing (7 comb-like incisions across the crescent)
  for (let k = 1; k <= 7; k++) {
    const i = Math.round((k / 8) * n)
    B.line([[top[i][0] - 1.5, top[i][1] - 3.5], [bot[i][0] + 1.5, bot[i][1] + 3.5]], 1.9)
  }
  B.boss([42, h * 0.42], EYE, { kind: 'round', base: 'ground', pupil: 'none' })
  // brow over the eye, from the arris
  N.band(sq(kit, [[4, h * 0.42 + 15], [60, h * 0.42 + 15], [60, h * 0.42 - 4]], 6), BAND)
  // ear: hollow C outside the eye
  N.band(sq(kit, [[w - 10, h * 0.42 + 12], [w - 32, h * 0.42 + 12], [w - 32, h * 0.42 - 14], [w - 10, h * 0.42 - 14], [w - 10, h * 0.42 - 2]], 6), BAND)
  // ∩ jaw with a hooked fang
  N.band(sq(kit, [[4, 30], [66, 30], [66, 12]], 6), BAND + 1)
  N.taper([[66, 13], ...curl(kit, [66, 11], 6, { heading: -90, dir: 1, sweep: 280 })], BAND, 6, 0.3)
  N.taper(sq(kit, [[28, 30], [28, 13], [17, 13]], 4), BAND, 6, 0.5)
  renderBoth(kit, panel, SS, r)
}

// Lower corner: taotie half-mask on the arris — heavy squared C horn, boss eye, hooked jaw.
function cornerTaotie(kit, panel, r, { seed }) {
  const SS = sheets(kit, r, { seed, wobble: 0.45 })
  const { B, N } = SS
  const h = r.h, w = r.w
  // horn: a solid squared C block over the eye (grooved), its tail curling in
  B.poly(sqc(kit, [[6, h - 48], [6, h - 8], [w - 10, h - 8], [w - 10, h - 54], [w - 50, h - 54], [w - 50, h - 36], [w - 30, h - 36], [w - 30, h - 26], [24, h - 26], [24, h - 48]], 5))
  B.boss([40, h * 0.5], EYE, { kind: 'round', base: 'ground', pupil: 'none' })
  N.band(sq(kit, [[4, h * 0.5 + 14], [58, h * 0.5 + 14], [58, h * 0.5 - 4]], 5), BAND)
  N.band(sq(kit, [[4, 36], [72, 36], [72, 12]], 6), BAND + 1)
  N.taper([[72, 13], ...curl(kit, [72, 11], 7, { heading: -90, dir: 1, sweep: 280 })], BAND, 6, 0.3)
  N.band(sq(kit, [[w - 13, h * 0.5], [w - 13, 10]], 3), BAND)
  renderBoth(kit, panel, SS, r)
}

// Side column: ONE vertical K5 kui, head UP facing the corner (arris at local x = 0):
// a solid crest block in the top third, boss eye at 0.33 of the height from the top
// ≈ 35 from the corner side, ⊐ jaw opening toward the corner, a claw curl off the
// body, then the broad body descends along the field side into a 3-turn tail spiral.
function columnKui(kit, panel, r, { seed }) {
  const SS = sheets(kit, r, { seed, wobble: 0.5 })
  const { B, N } = SS
  const h = r.h, w = r.w
  const ey = h * 0.67
  const c0 = ey + 16
  crestBlock(kit, B, (d) => d, 8, w - 10, c0, h - 7)
  B.boss([34, ey], EYE, { kind: 'round', base: 'ground', pupil: 'none' })
  // jaw: ⊐ opening toward the corner, the lower lip curling up
  N.band(sq(kit, [[7, ey - 17], [62, ey - 17], [62, ey - 44]], 7), BAND)
  N.taper([[62, ey - 44], [20, ey - 44], ...curl(kit, [18, ey - 44], 6, { heading: 180, dir: -1, sweep: 260 })], BAND, 6, 0.6)
  // body down the field side into the tail spiral
  const tb = w - 26
  const box = [8, 8, w - 18, 8 + tb]
  const sp = sqSpiralBox(box, 14, 3)
  B.band([[w - 21, c0 + 2], [w - 21, 8 + tb + 4]], BODY, 'flat')
  N.band(sq(kit, [[w - 18, 8 + tb + 8], ...sp], 5), 8.5)
  // claw / quill hooks off the body toward the corner
  for (const yy of [ey - 64, ey - 86]) N.band(sq(kit, [[w - 28, yy], [40, yy], [40, yy + 9]], 3), 7, 'flat')
  renderBoth(kit, panel, SS, r)
}

// Short-face fields: old cracks / repair seams running across the plain panel
// (dossier §b.7, §d) — thin irregular sunk lines.
function repairCracks(kit, panel, field, seed) {
  const rng = new kit.Rng(seed + 77)
  const walk = (x, y, hd, n, turn) => {
    const pts = [[x, y]]
    for (let i = 0; i < n; i++) {
      const step = rng.range(3, 9)
      const a = hd + rng.jitter(turn) // jagged: every segment kinks independently around the mean heading
      x += Math.cos(a) * step
      y += Math.sin(a) * step
      if (y < field.y + 6 || y > field.y + field.h - 4 || x < field.x + 4 || x > field.x + field.w - 4) break
      pts.push([x, y])
      if (rng.next() < 0.08) hd += rng.jitter(0.5)
    }
    return pts
  }
  const lines = [
    // ≈ 350 mm, roughly horizontal, just under the top frieze
    walk(field.x + field.w * rng.range(0.2, 0.3), field.y + field.h - rng.range(18, 30), rng.jitter(0.08), 60, 0.9),
    // a diagonal near the right side column
    walk(field.x + field.w - rng.range(30, 60), field.y + field.h - rng.range(10, 25), -2.0 + rng.jitter(0.15), 30, 0.8),
  ]
  panel.add((ctx) => {
    ctx.lineWidth = 0.9
    ctx.lineJoin = 'miter'
    for (const pts of lines) {
      ctx.beginPath()
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
      ctx.stroke()
    }
  }, { height: -0.5, shoulder: 0.45, profile: 'u' })
}
