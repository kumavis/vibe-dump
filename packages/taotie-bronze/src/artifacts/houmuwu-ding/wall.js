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

import { LEVELS, GROUND, style, sheet, sq, render, hookRow, rect, inset } from './draw.js'

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
  topKui(kit, panel, cells.friezeTop, { short: k, seed: seed + 1 })
  bottomKui(kit, panel, cells.friezeBot, { short: k, seed: seed + 2 })
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
// Top-frieze kui (dossier §c.3 table): head at the flange, eye boss ≈ 50 from
// the axis at 0.45 of the band, squared C crest above, a ∩ jaw beside the
// flange, a straight body with C-hook quills above and below, and a large
// squared tail spiral at the outer end.

function topKui(kit, panel, r, { short, seed }) {
  const L = r.w // axis at local x = L
  const S = sheet(kit, r, { seed })
  const A = (dx) => L - dx // distance from the axis → local x
  // eye: just below the crest, ≈ 48 from the axis
  S.boss([A(48), 54], 9.5, { kind: 'round', base: 'ground', pupil: 'none' })
  // crest: a big squared C over the eye, opening downward, the outer foot curling inward,
  // and a second squared scroll (the "G") nested in it from the axis side
  S.band(sq(kit, [[A(12), 66], [A(12), 112], [A(108), 112], [A(108), 68], [A(74), 68], [A(74), 92], [A(90), 92]], 8), 13.2)
  S.band(sq(kit, [[A(30), 68], [A(30), 94], [A(54), 94], [A(54), 82]], 4), 9.6)
  // jaw ∩ beside the flange, feet flaring
  S.band(sq(kit, [[A(98), 6], [A(86), 6], [A(86), 36], [A(22), 36], [A(22), 8], [A(12), 8]], 7), 12.0)
  // body: a heavy straight band from behind the head to the tail spiral
  const tail = short ? 68 : 86 // tail spiral size (mm)
  const bx = A(108)
  const x0 = 4 + tail
  S.band([[bx + 8, 74], [x0, 74]], 19, 'flat')
  // the head's second scroll beside the crest (outer side), over the body
  S.band(sq(kit, [[A(118), 86], [A(118), 112], [A(150), 112], [A(150), 94], [A(134), 94]], 5), 10.8)
  // tail: big squared spiral below-left, attached by the body bar
  const d = 24
  S.band(sq(kit, [[x0 + 2, 74], [10, 74], [10, 8], [4 + tail, 8], [4 + tail, 52], [10 + d, 52], [10 + d, 27], [4 + tail - d, 27], [4 + tail - d, 38]], 6), 15.6)
  // quills: a few squared C-hooks hanging under the body
  hookRow(kit, S, x0 + 20, bx - 12, 64, short ? 2 : 4, { up: -1, h: 22, back: 12, w: 7, dir: 1 })
  render(kit, panel, S, P, r)
}

// Bottom-frieze kui: same head, eye a little lower; legs with claws toward the
// flange and a trunk that curls down at the flange foot instead of the ∩ jaw.
function bottomKui(kit, panel, r, { short, seed }) {
  const L = r.w
  const S = sheet(kit, r, { seed })
  const A = (dx) => L - dx
  S.boss([A(48), 58], 9.5, { kind: 'round', base: 'ground', pupil: 'none' })
  // crest
  S.band(sq(kit, [[A(13), 74], [A(13), 114], [A(100), 114], [A(100), 76], [A(66), 76], [A(66), 96], [A(80), 96]], 7), 12.0)
  S.band(sq(kit, [[A(30), 76], [A(30), 98], [A(50), 98]], 4), 8.4)
  // trunk: down beside the flange, curling at the foot
  S.taper(sq(kit, [[A(30), 46], [A(30), 18], [A(14), 18], [A(14), 28], [A(22), 28]], 5), 10.8, 7.2, 0.5)
  // body
  const tail = short ? 64 : 82
  const bx = A(64)
  const x0 = 4 + tail
  S.band([[bx, 66], [x0, 66]], 15, 'flat')
  S.band(sq(kit, [[A(64), 66], [A(64), 52], [A(40), 52]], 5), 9) // jowl to the eye
  const d = 22
  S.band(sq(kit, [[x0 + 2, 66], [10, 66], [10, 112], [4 + tail, 112], [4 + tail, 80], [10 + d, 80], [10 + d, 98], [4 + tail - d, 98], [4 + tail - d, 90]], 5), 14.4)
  // legs: down from the body, claws hooked toward the flange
  const legs = short ? [A(118)] : [A(122), A(220)]
  for (const lx of legs) {
    S.taper(sq(kit, [[lx, 60], [lx, 16], [lx + 18, 16], [lx + 18, 24]], 4), 13.2, 7.2, 0.55)
    S.taper(sq(kit, [[lx - 2, 22], [lx - 2, 6], [lx + 10, 6]], 3), 7.2, 4.2, 0.5)
  }
  hookRow(kit, S, x0 + 8, bx - 8, 74, short ? 3 : 6, { up: 1, h: 15, back: 9, w: 5.5, dir: -1 })
  render(kit, panel, S, P, r)
}

// Upper corner: ox-head 牛首 half-mask, axis on the arris (local x = 0):
// broad crescent horn with transverse ribbing across the top, curving away from
// the corner; round boss eye ≈ 42 from the arris; short ∩ jaw with a hooked fang.
function oxHead(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed })
  const h = r.h
  // crescent: lower edge sags, upper edge rises to an upturned tip at the outer side
  const top = [], bot = []
  for (let i = 0; i <= 24; i++) {
    const t = i / 24
    const x = 3 + t * (r.w - 10)
    top.push([x, h - 6 - 12 * Math.sin(Math.PI * t * 0.5) * (1 - t) + 2 * t])
    bot.push([x, h - 30 - 10 * Math.sin(Math.PI * t) + 22 * t * t])
  }
  const tip = top[top.length - 1]
  S.poly([...top, [tip[0] + 2, tip[1] + 2], ...bot.reverse()])
  // transverse ribbing (comb-like incisions)
  for (let i = 2; i < 23; i += 2) {
    const a = top[i], c = bot[24 - i]
    S.line([[a[0] + 0.5, a[1] - 3.5], [c[0] - 0.5, c[1] + 3.5]], 1.1)
  }
  // eye and its socket band
  S.boss([42, h * 0.5], 7.8, { kind: 'round', base: 'ground', pupil: 'none' })
  S.band(sq(kit, [[16, h * 0.5 + 16], [64, h * 0.5 + 16], [64, h * 0.5 - 2], [56, h * 0.5 - 2]], 4), 8.4)
  // ear: C out at the side
  S.band(sq(kit, [[r.w - 10, h * 0.5 + 18], [r.w - 30, h * 0.5 + 18], [r.w - 30, h * 0.5 - 10], [r.w - 10, h * 0.5 - 10], [r.w - 10, h * 0.5 + 2]], 4), 8.4)
  // jaw ∩ with a hooked fang
  S.band(sq(kit, [[6, h * 0.36], [62, h * 0.36], [62, 10], [50, 10], [50, 18]], 4), 9.6)
  S.taper(sq(kit, [[30, h * 0.36], [30, 16], [22, 16]], 3), 8.4, 4.2, 0.5)
  render(kit, panel, S, P, r)
}

// Lower corner: taotie half-mask — squared C horn, round boss eye, hooked jaw.
function cornerTaotie(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed })
  const h = r.h
  S.band(sq(kit, [[8, h - 44], [8, h - 10], [r.w - 14, h - 10], [r.w - 14, h - 44], [r.w - 48, h - 44], [r.w - 48, h - 26], [r.w - 34, h - 26]], 6), 12.0)
  S.boss([42, h * 0.47], 8.5, { kind: 'round', base: 'ground', pupil: 'none' })
  S.band(sq(kit, [[16, h * 0.47 + 14], [62, h * 0.47 + 14], [62, h * 0.47 - 6]], 4), 8.4)
  S.band(sq(kit, [[6, h * 0.3], [70, h * 0.3], [70, 10], [40, 10], [40, 22], [54, 22]], 5), 10.8)
  S.band(sq(kit, [[r.w - 12, h * 0.6], [r.w - 12, 10]], 3), 8.4)
  render(kit, panel, S, P, r)
}

// Side column: one vertical K5 kui, head UP at the top facing the corner (axis
// at local x = 0): eye ≈ 35 from the corner side at 0.33 of the height from the
// top, crest above, jaw toward the corner, body descending in squared hooks to
// a big squared tail spiral at ≈ 0.8 down.
function columnKui(kit, panel, r, { seed }) {
  const S = sheet(kit, r, { seed })
  const h = r.h, w = r.w
  const ey = h * 0.67
  S.boss([36, ey], 8.8, { kind: 'round', base: 'ground', pupil: 'none' })
  // crest: squared C above the eye, opening down, curling in
  S.band(sq(kit, [[16, ey + 20], [16, h - 8], [w - 12, h - 8], [w - 12, ey + 18], [w - 44, ey + 18], [w - 44, ey + 38], [w - 30, ey + 38]], 6), 12.0)
  // jaw: ⊐ opening toward the corner, lower end hooked
  S.band(sq(kit, [[6, ey - 18], [62, ey - 18], [62, ey - 52], [8, ey - 52], [8, ey - 40], [22, ey - 40]], 5), 10.8)
  // body: down the inner side, then the big squared tail spiral at the bottom
  const d = 22
  S.band(sq(kit, [[w - 26, ey + 4], [w - 26, h * 0.38], [12, h * 0.38], [12, 8], [w - 10, 8], [w - 10, h * 0.3 - 4], [12 + d, h * 0.3 - 4], [12 + d, 8 + d], [w - 10 - d, 8 + d], [w - 10 - d, 36]], 5), 14.4)
  // quills / claws on the body's back, pointing up
  hookRow(kit, S, 30, w - 40, h * 0.38 + 7, 2, { up: 1, h: 13, back: 8, w: 5.5, dir: 1 })
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
