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
// the mid flange — a HEAVY squared C crest (≈ 75 × 45, curling inward) over a round boss
// eye 45–55 from the axis; below it a short ∩ jaw whose inner leg touches the flange
// (top frieze) or clawed legs and a snout curling down at the flange foot (bottom
// frieze). A broad straight body (15–18) runs outward fringed with small C-hook quills,
// and ends in a LARGE 3-turn squared tail spiral filling the band height at the outer
// end. Plateau widths are the dossier's: crest / jaw bands 10–12, body 16–17.

const BAND = 11 // crest / jaw / spiral band width (mm)
const BODY = 16.5 // kui body band (mm)

/** Half a frieze: `top` (∩ jaw) or bottom (clawed legs + snout). y from the band's bottom. */
function friezeKui(kit, panel, r, { short, seed, top }) {
  const L = r.w // the axis is at local x = L
  const h = r.h
  const S = sheet(kit, r, { seed, wobble: 0.35 })
  const A = (dx) => L - dx // distance from the axis → local x
  const tail = short ? 66 : 84 // tail spiral (mm square)
  const xT = 5 + tail // inner side of the tail spiral (local x)
  const yB = 60 // body centre line
  const yC = h - 9 // crest top centre line
  // crest: heavy squared C over the eye, opening toward the axis-bottom, curling inward
  S.band(sq(kit, [[A(28), yC - 40], [A(28), yC], [A(106), yC], [A(106), yC - 42], [A(66), yC - 42], [A(66), yC - 16], [A(88), yC - 16], [A(88), yC - 28]], 4), BAND)
  // eye: domed boss, ≈ 48 from the axis
  S.boss([A(48), top ? 54 : 50], 9, { kind: 'round', base: 'ground', pupil: 'none' })
  if (top) {
    // ∩ jaw beside the flange: inner leg on the flange, feet hooked inward
    S.band(sq(kit, [[A(56), 9], [A(68), 9], [A(68), 37], [A(14), 37], [A(14), 7]], 4), BAND)
    // jowl from the jaw back into the body
    S.band(sq(kit, [[A(68), 24], [A(96), 24], [A(96), yB]], 4), BAND - 1)
  } else {
    // snout: down beside the flange from under the eye, curling outward at the foot
    S.band(sq(kit, [[A(34), 36], [A(14), 36], [A(14), 9], [A(40), 9], [A(40), 21]], 4), BAND)
    // two short legs off the body, claws hooked toward the flange
    const legs = short ? [A(132)] : [A(132), A(214)]
    for (const lx of legs) {
      S.taper(sq(kit, [[lx, yB - 4], [lx, 20], [lx + 20, 20]], 4), 12, 8, 0.6)
      for (const cx of [lx + 4, lx + 16]) S.taper(sq(kit, [[cx, 16], [cx + 3, 8], [cx + 9, 9]], 2), 6, 3.5, 0.3)
    }
  }
  // body: a broad straight band from behind the head to the tail spiral
  S.band([[A(100), yB], [xT, yB]], BODY, 'flat')
  // tail: a large 3-turn squared spiral filling the band height at the outer end
  const bh = Math.min(h - 16, tail * 1.12) // a near-square spiral, against the band edge away from the body
  const box = top ? [5, h - 8 - bh, xT, h - 8] : [5, 8, xT, 8 + bh]
  const sp = sqSpiralBox(box, short ? 11.5 : 14.5, 3, { flipY: !top })
  S.band(sq(kit, [[xT + 6, yB], [xT, yB], ...sp], 4), short ? 9.5 : BAND)
  // quills: small squared C-hooks fringing the body above (and below, top frieze)
  const q0 = xT + 14
  quillRow(kit, S, q0, A(114), yB + BODY / 2 - 1, short ? 2 : 5, 1, 22)
  if (top) quillRow(kit, S, q0, A(106), yB - BODY / 2 + 1, short ? 2 : 4, -1, 20)
  render(kit, panel, S, P, r)
}

/** n small squared C-hooks standing on the body edge at y, rising `dir`·len, curled back toward the tail. */
function quillRow(kit, S, x0, x1, y, n, dir, len) {
  const step = (x1 - x0) / Math.max(1, n)
  const L = Math.max(14, Math.min(34, len))
  for (let i = 0; i < n; i++) {
    const x = x0 + step * (i + 0.62)
    const w = Math.min(12, step * 0.4)
    S.taper(sq(kit, [[x, y], [x, y + dir * L], [x - w, y + dir * L], [x - w, y + dir * (L - 8)]], 2.5), 8, 5, 0.5)
  }
}

// Upper corner: ox-head 牛首 half-mask, axis on the arris (local x = 0; the same drawing
// on both faces, so the two halves are mirror images about the corner flange): a broad
// ribbed crescent horn ≈ 45 tall across the whole square, its tip upturned at the outer
// side; boss eye ≈ 42 from the arris; ∩ jaw with a hooked fang; a C ear outside the eye.
function oxHead(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed, wobble: 0.3 })
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
    S.line([[top[i][0] - 1.5, top[i][1] - 3.5], [bot[i][0] + 1.5, bot[i][1] + 3.5]], 1.5)
  }
  S.boss([42, h * 0.42], 8.5, { kind: 'round', base: 'ground', pupil: 'none' })
  // brow over the eye, from the arris
  S.band(sq(kit, [[4, h * 0.42 + 15], [60, h * 0.42 + 15], [60, h * 0.42 - 4]], 4), 9)
  // ear: hollow C outside the eye
  S.band(sq(kit, [[w - 10, h * 0.42 + 12], [w - 32, h * 0.42 + 12], [w - 32, h * 0.42 - 14], [w - 10, h * 0.42 - 14], [w - 10, h * 0.42 - 2]], 4), 9)
  // ∩ jaw with a hooked fang
  S.band(sq(kit, [[4, 30], [66, 30], [66, 8], [52, 8], [52, 16]], 4), 10)
  S.taper(sq(kit, [[28, 30], [28, 12], [18, 12]], 3), 9, 5, 0.5)
  render(kit, panel, S, P, r)
}

// Lower corner: taotie half-mask on the arris — heavy squared C horn, boss eye, hooked jaw.
function cornerTaotie(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed, wobble: 0.3 })
  const h = r.h, w = r.w
  S.band(sq(kit, [[6, h - 44], [6, h - 10], [w - 12, h - 10], [w - 12, h - 50], [w - 46, h - 50], [w - 46, h - 30], [w - 30, h - 30]], 4), BAND)
  S.boss([40, h * 0.5], 8.5, { kind: 'round', base: 'ground', pupil: 'none' })
  S.band(sq(kit, [[4, h * 0.5 + 15], [58, h * 0.5 + 15], [58, h * 0.5 - 4]], 4), 9)
  S.band(sq(kit, [[4, 36], [72, 36], [72, 9], [40, 9], [40, 22], [54, 22]], 4), BAND)
  S.band(sq(kit, [[w - 12, h * 0.56], [w - 12, 10]], 3), 9)
  render(kit, panel, S, P, r)
}

// Side column: ONE vertical K5 kui, head UP facing the corner (arris at local x = 0):
// heavy squared crest in the top third, boss eye at 0.33 of the height from the top
// ≈ 35 from the corner side, ⊐ jaw opening toward the corner, then the body descends
// along the field side into a large 3-turn squared tail spiral at 0.65–0.95 down.
function columnKui(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed, wobble: 0.35 })
  const h = r.h, w = r.w
  const ey = h * 0.67
  // crest: squared C above the eye, curling inward
  S.band(sq(kit, [[w - 16, ey + 20], [w - 16, h - 8], [12, h - 8], [12, ey + 30], [w - 50, ey + 30], [w - 50, ey + 50], [w - 34, ey + 50]], 4), BAND)
  S.boss([35, ey], 8.8, { kind: 'round', base: 'ground', pupil: 'none' })
  // jaw: ⊐ opening toward the corner, lower lip hooked
  S.band(sq(kit, [[6, ey - 17], [64, ey - 17], [64, ey - 50], [10, ey - 50], [10, ey - 38]], 4), BAND - 1)
  // body down the field side into the tail spiral
  const box = [8, 8, w - 16, Math.min(h * 0.36, w - 10)]
  const sp = sqSpiralBox(box, 13, 3)
  S.band(sq(kit, [[w - 16, ey + 22], ...sp], 4), BAND)
  // a claw off the body toward the corner, under the jaw
  S.taper(sq(kit, [[w - 16, ey - 66], [44, ey - 66], [44, ey - 78]], 3), 9, 5.5, 0.6)
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
