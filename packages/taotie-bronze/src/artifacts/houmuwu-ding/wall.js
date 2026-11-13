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
// Frieze kui (dossier §c.3 table; detail-frieze-top-centre.jpg, rubbing): the head at
// the mid flange is a HEAVY rounded crest block (≈ 100 × 50) whose C is read from two
// spirals incised into it, over a round boss eye ≈ 42 from the axis; below it a ∩ jaw
// whose inner leg stands on the flange (top frieze) or clawed legs and a snout curling at
// the flange foot (bottom frieze), and a cheek curl hanging off the body. A broad body
// (≈ 20) runs outward with a slight jog, fringed by IRREGULAR quills — a seeded mix of
// round curls, squared hooks and T-stubs of varying height — and ends in a 2-turn
// rounded-square tail spiral (≈ 66 long face, 54 short) that does not dominate the band.

const BAND = 12 // crest / jaw / spiral band width (mm)
const BODY = 20 // kui body band (mm)

/** A round curl continuing a stem that arrives at p heading `heading`°; dir +1 curls left (CCW), −1 right. */
function curl(kit, p, R, { heading = 90, dir = 1, sweep = 300, shrink = 0.3 } = {}) {
  const h = (heading * Math.PI) / 180
  const c = [p[0] - dir * Math.sin(h) * R, p[1] + dir * Math.cos(h) * R]
  return kit.shapes.cScroll(c, R, { start: heading - dir * 90, sweep, dir, shrink, step: 0.6 }).slice(1)
}

/**
 * Irregular quills standing on a body edge at y, pointing `dir` (+1 up, −1 down), from x0 (tail
 * side) toward x1 (head side), each turning back toward the tail. Seeded mix of curls, hooks, T-stubs.
 */
function quills(kit, S, rng, x0, x1, y, dir, maxL) {
  let x = x0 + rng.range(3, 9)
  while (x < x1 - 10) {
    const L = maxL * rng.range(0.65, 1)
    const w = rng.range(8.5, 12)
    const t = rng.next()
    if (t < 0.45) {
      const R = Math.min(rng.range(5, 8.5), L * 0.4)
      if (x + w / 2 > x1) break
      const p = [x, y + dir * (L - R)]
      S.taper([[x, y], p, ...curl(kit, p, R, { heading: dir > 0 ? 90 : -90, dir, sweep: rng.range(240, 330) })], w, w * 0.55, 0.45)
      x += 2 * R + w + rng.range(14, 26)
    } else if (t < 0.8) {
      const b = rng.range(10, 18)
      S.taper(sq(kit, [[x + b, y], [x + b, y + dir * L], [x, y + dir * L], [x, y + dir * (L - rng.range(6, 11))]], rng.range(2.5, 5)), w, w * 0.6, 0.5)
      x += b + w + rng.range(14, 26)
    } else {
      const b = rng.range(6, 10), yy = y + dir * L * 0.75
      S.band([[x + b, y], [x + b, yy]], w * 0.9)
      S.band(sq(kit, [[x, yy - dir * 5], [x, yy], [x + b * 1.8, yy]], 3), w * 0.8)
      x += b * 1.8 + w + rng.range(14, 26)
    }
  }
}

/**
 * Heavy crest: a thick squared C band (≈ 11) — up the axis side, across the top, down the far
 * side, back along the bottom curling up inward — holding a second curl that hangs from the top
 * bar and turns away from the axis (detail-frieze-top-centre.jpg). X(d) maps distance from the
 * axis side to local x; sgn = +1 when the axis side is at small x.
 */
function crestBlock(kit, S, X, sgn, d0, d1, y0, y1, w = 11) {
  const hw = w / 2
  const toAxis = sgn < 0 ? 0 : 180
  const endD = d0 + (d1 - d0) * 0.5
  const R = Math.min(9, (y1 - y0 - 2 * w) * 0.42)
  S.band(sq(kit, [[X(d0 + hw), y0 + w + 2], [X(d0 + hw), y1 - hw], [X(d1 - hw), y1 - hw], [X(d1 - hw), y0 + hw], [X(endD), y0 + hw]], 9), w)
  S.taper([[X(endD), y0 + hw], [X(endD - 2), y0 + hw], ...curl(kit, [X(endD - 2), y0 + hw], R, { heading: toAxis, dir: -sgn, sweep: 300 })], w, w * 0.55, 0.3)
  const xi = X(d0 + (d1 - d0) * 0.24)
  const yc = (y0 + y1) / 2 + 2
  S.taper([[xi, y1 - hw], [xi, yc], ...curl(kit, [xi, yc], Math.min(7, R), { heading: -90, dir: sgn, sweep: 290 })], w - 2, 5, 0.4)
}

/** Half a frieze: `top` (∩ jaw) or bottom (clawed legs + snout). y from the band's bottom. */
function friezeKui(kit, panel, r, { short, seed, top }) {
  const L = r.w // the axis is at local x = L
  const h = r.h
  const S = sheet(kit, r, { seed, wobble: 0.55 })
  const rng = new kit.Rng(seed * 7 + 3)
  const A = (dx) => L - dx // distance from the axis → local x
  const tail = short ? 54 : 66 // tail spiral (mm square)
  const xT = 7 + tail // inner side of the tail spiral (local x)
  const yB = top ? 55 : 59 // body centre line
  const jog = top ? 3 : -3
  // CREST: heavy block over the eye, beside the flange
  const c0 = top ? 68 : 71, c1 = top ? h - 6 : h - 11
  crestBlock(kit, S, A, -1, 9, 108, c0, c1)
  // eye: domed boss ≈ 42 from the axis
  S.boss([A(35), top ? 55 : 57], 9.5, { kind: 'round', base: 'ground', pupil: 'none' })
  // cheek: a curl hanging off the body behind the jaw, turning toward the flange
  S.taper([[A(94), yB - 4], [A(94), 30], ...curl(kit, [A(94), 30], 8, { heading: -90, dir: 1, sweep: 290 })], 11, 6, 0.4)
  if (top) {
    // ∩ jaw beside the flange: inner leg on the flange, the outer foot curling outward
    S.band(sq(kit, [[A(64), 16], [A(64), 36], [A(20), 36], [A(20), 12], [A(13), 9]], 8), BAND - 1)
    S.taper([[A(64), 17], ...curl(kit, [A(64), 15], 6, { heading: -90, dir: -1, sweep: 270 })], 10, 5.5, 0.3)
  } else {
    // snout: down beside the flange under the eye, curling outward at the flange foot
    S.band(sq(kit, [[A(30), 40], [A(14), 40], [A(14), 18]], 6), BAND)
    S.taper([[A(14), 19], ...curl(kit, [A(14), 17], 7, { heading: -90, dir: -1, sweep: 290 })], 11, 6, 0.3)
    // short legs off the body, claws hooked toward the flange
    const legs = short ? [A(140)] : [A(142), A(222)]
    for (const lx of legs) {
      S.taper(sq(kit, [[lx, yB - 6], [lx, 22], [lx + 17, 22]], 6), 13, 9.5, 0.5)
      S.taper([[lx + 17, 22], ...curl(kit, [lx + 19, 22], 5, { heading: 0, dir: -1, sweep: 240 })], 8, 4.5, 0.2)
      S.taper(sq(kit, [[lx + 1, 22], [lx + 1, 10], [lx + 11, 10]], 3), 8.5, 4.5, 0.4)
    }
  }
  // body: broad, with a slight jog half-way
  const xm = (A(100) + xT) / 2 + rng.jitter(15)
  S.band(sq(kit, [[A(100), yB], [xm + 5, yB], [xm - 5, yB + jog], [xT, yB + jog]], 5), BODY, 'flat')
  // tail: a 2-turn rounded-square spiral at the outer end (the leiwen is packed inside it)
  const yt = yB + jog
  const box = top ? [6, 11, xT, 11 + tail] : [6, h - 13 - tail, xT, h - 13]
  const sp = sqSpiralBox(box, short ? 15 : 17, 2, { flipY: !top })
  S.band(sq(kit, [[xT + 8, yt], [xT, yt], ...sp], 7), BAND)
  // a hook filling the corner the spiral leaves
  if (top) S.band(sq(kit, [[7, h - 10], [xT - 8, h - 10], [xT - 8, h - 26], [xT - 26, h - 26]], 5), 10)
  else S.band(sq(kit, [[7, 9], [xT - 8, 9], [xT - 8, 25], [xT - 26, 25]], 5), 10)
  // quills: irregular, above and below the body
  const yu = yt + BODY / 2 - 1, yd = yB - BODY / 2 + 1
  if (top) {
    quills(kit, S, rng, xT + 6, A(114), yu, 1, Math.min(42, c1 - yu - 2))
    quills(kit, S, rng, xT + 6, A(112), yd, -1, yd - 10)
  } else {
    quills(kit, S, rng, xT + 6, A(114), yB + BODY / 2 - 1, 1, Math.min(40, c1 - yB - BODY / 2 - 1))
    quills(kit, S, rng, xT + 6, (short ? A(140) : A(222)) - 14, yt - BODY / 2 + 1, -1, yt - BODY / 2 - 9)
  }
  render(kit, panel, S, P, r)
}

// Upper corner: ox-head 牛首 half-mask, axis on the arris (local x = 0; the same drawing
// on both faces, so the two halves are mirror images about the corner flange): a broad
// ribbed crescent horn ≈ 45 tall across the whole square, its tip upturned at the outer
// side; boss eye ≈ 42 from the arris; ∩ jaw with a hooked fang; a C ear outside the eye.
function oxHead(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed, wobble: 0.45 })
  const h = r.h, w = r.w
  const top = [], bot = []
  const n = 24
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = 3 + t * (w - 9)
    top.push([x, h - 5 - 3 * Math.sin(Math.PI * t)])
    bot.push([x, h - 52 + 16 * Math.sin(Math.PI * t * 0.5) + 26 * t * t * t])
  }
  S.poly([...top, ...bot.slice().reverse()])
  // transverse ribbing (7 comb-like incisions across the crescent)
  for (let k = 1; k <= 7; k++) {
    const i = Math.round((k / 8) * n)
    S.line([[top[i][0] - 1.5, top[i][1] - 3.5], [bot[i][0] + 1.5, bot[i][1] + 3.5]], 1.9)
  }
  S.boss([42, h * 0.42], 9.5, { kind: 'round', base: 'ground', pupil: 'none' })
  // brow over the eye, from the arris
  S.band(sq(kit, [[4, h * 0.42 + 15], [60, h * 0.42 + 15], [60, h * 0.42 - 4]], 6), 11)
  // ear: hollow C outside the eye
  S.band(sq(kit, [[w - 10, h * 0.42 + 12], [w - 32, h * 0.42 + 12], [w - 32, h * 0.42 - 14], [w - 10, h * 0.42 - 14], [w - 10, h * 0.42 - 2]], 6), 11)
  // ∩ jaw with a hooked fang
  S.band(sq(kit, [[4, 30], [66, 30], [66, 12]], 6), 12)
  S.taper([[66, 13], ...curl(kit, [66, 11], 6, { heading: -90, dir: 1, sweep: 280 })], 11, 6, 0.3)
  S.taper(sq(kit, [[28, 30], [28, 13], [17, 13]], 4), 11, 6, 0.5)
  render(kit, panel, S, P, r)
}

// Lower corner: taotie half-mask on the arris — heavy squared C horn, boss eye, hooked jaw.
function cornerTaotie(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed, wobble: 0.45 })
  const h = r.h, w = r.w
  S.band(sq(kit, [[6, h - 46], [6, h - 11], [w - 13, h - 11], [w - 13, h - 52], [w - 46, h - 52], [w - 46, h - 32], [w - 30, h - 32]], 6), BAND + 1)
  S.boss([40, h * 0.5], 9, { kind: 'round', base: 'ground', pupil: 'none' })
  S.band(sq(kit, [[4, h * 0.5 + 15], [58, h * 0.5 + 15], [58, h * 0.5 - 4]], 5), 10)
  S.band(sq(kit, [[4, 36], [72, 36], [72, 12]], 6), BAND)
  S.taper([[72, 13], ...curl(kit, [72, 11], 7, { heading: -90, dir: 1, sweep: 280 })], 11, 6, 0.3)
  S.band(sq(kit, [[w - 13, h * 0.56], [w - 13, 10]], 3), 10)
  render(kit, panel, S, P, r)
}

// Side column: ONE vertical K5 kui, head UP facing the corner (arris at local x = 0):
// a heavy crest block in the top third, boss eye at 0.33 of the height from the top
// ≈ 35 from the corner side, ⊐ jaw opening toward the corner, a claw curl off the
// body, then the body descends along the field side into a 2-turn tail spiral.
function columnKui(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed, wobble: 0.5 })
  const h = r.h, w = r.w
  const ey = h * 0.67
  const c0 = ey + 16
  crestBlock(kit, S, (d) => d, 1, 8, w - 12, c0, h - 6)
  S.boss([34, ey], 9.5, { kind: 'round', base: 'ground', pupil: 'none' })
  // jaw: ⊐ opening toward the corner, the lower lip curling up
  S.band(sq(kit, [[7, ey - 17], [62, ey - 17], [62, ey - 44]], 7), BAND)
  S.taper([[62, ey - 44], [20, ey - 44], ...curl(kit, [18, ey - 44], 6, { heading: 180, dir: -1, sweep: 260 })], BAND, 6, 0.6)
  // body down the field side into the tail spiral
  const tb = w - 30
  const box = [8, 8, w - 20, 8 + tb]
  const sp = sqSpiralBox(box, 17, 2)
  S.band([[w - 20, c0 + 4], [w - 20, 8 + tb]], BODY - 2)
  S.band(sq(kit, [[w - 20, 8 + tb + 6], ...sp], 7), BAND)
  // claw / quill curls off the body toward the corner
  S.taper([[w - 26, ey - 62], [42, ey - 62], ...curl(kit, [40, ey - 62], 6.5, { heading: 180, dir: 1, sweep: 280 })], 11, 6, 0.55)
  render(kit, panel, S, P, r)
}

// Short-face fields: old cracks / repair seams running across the plain panel
// (dossier §b.7, §d) — thin irregular sunk lines.
function repairCracks(kit, panel, field, seed) {
  const rng = new kit.Rng(seed + 77)
  const lines = []
  for (let c = 0; c < 3; c++) {
    let x = field.x + field.w * (0.15 + 0.3 * c + rng.jitter(0.06)), y = field.y + field.h * rng.range(0.55, 0.95)
    const pts = [[x, y]]
    let hd = rng.range(-1.2, -0.6)
    for (let i = 0; i < 40; i++) {
      hd += rng.jitter(0.35)
      x += Math.cos(hd) * 6
      y += Math.sin(hd) * 6
      if (y < field.y + 6 || x < field.x + 4 || x > field.x + field.w - 4) break
      pts.push([x, y])
    }
    lines.push(pts)
  }
  panel.add((ctx) => {
    ctx.lineWidth = 0.9
    ctx.lineJoin = 'round'
    for (const pts of lines) {
      ctx.beginPath()
      pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
      ctx.stroke()
    }
  }, { height: -0.5, shoulder: 0.45, profile: 'u' })
}
