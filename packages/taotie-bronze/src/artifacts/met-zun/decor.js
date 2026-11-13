// Met zun 43.25.1 — the décor of one 120° mould sector, register by register
// (dossier §c, read against detail-*.jpg). Every panel is centred on a NOSE line
// (panel x = W/2) with the mould seams at its two edges; the left half (seam →
// nose) is authored and mirrored, and the same ReliefMap serves all three sectors.
//
// Authoring space: x = panel mm from the nose line toward the seam (angle-linear,
// as the carver stretched the design on a flaring band), y = arc mm above the
// register's lower edge. A dossier coordinate (mm at mid-register) is used as is.

import { renderFlush } from './relief.js'

const BW = 4 // band width (dossier: 3.5–4.5)

/** shared helpers bound to one panel */
function author(kit, W, H, sx = 1, sy = 1) {
  const { Turtle, band } = kit.shapes
  const cx = W / 2
  const P = ([x, y]) => [cx - x * sx, y * sy]
  const T = (x, y, h) => new Turtle([x, y], h)
  const B = (t, w = BW, capA = 'flat', capB = 'flat') => band(t.spine(0.3).map(P), w, capA, capB)
  const half = { x: 0, y: 0, w: cx, h: H }
  return { P, T, B, half, cx }
}

/** a squared C-hook: run `a`, turn, run `b`, turn, run `c` (dir +1 left turns) */
function hook(T, x, y, h, a, b, c, dir = 1, r = 1.6) {
  const t = T(x, y, h).fwd(a).turn(90 * dir, r).fwd(b)
  if (c > 0) t.turn(90 * dir, r * 0.8).fwd(c)
  return t
}

// ----------------------------------------------------------------- belly mask (y 152–218)

export function bellyPanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const sx = W / 2 / 111, sy = H / 67
  const { P, T, B, half } = author(kit, W, H, sx, sy)
  const bands = []
  // nose band beside the flange, ending in a nostril scroll
  bands.push(B(T(9, 58, -90).fwd(36).turn(90, 2).fwd(7).turn(90, 2).fwd(5).turn(90, 1.5).fwd(3)))
  // THE horn: up beside the nose, out along the top, down, and back toward the axis
  // in a squared spiral of 1½ turns (centre x .46, y .70)
  bands.push(B(T(15.5, 33, 90).fwd(27).turn(-90, 3).fwd(52.5).turn(-90, 3).fwd(22)
    .curl({ dir: -1, size: [36, 13], pitch: 9, turns: 1.5, r: 3 }), 4.8))
  // inner canthus: eye → nose, hooking up
  bands.push(B(T(31.5, 23, 180).fwd(10)))
  // body band from behind the eye to the seam, hooks on its upper edge
  bands.push(B(T(42, 24.5, 0).fwd(62).turn(90, 2).fwd(5)))
  for (const x of [58, 80]) bands.push(B(T(x, 24.5, 90).fwd(5).turn(-90, 1.4).fwd(5), 3.4))
  // outer C-scroll at the seam (ear / upturned tail)
  bands.push(B(T(103, 33, 90).fwd(27).turn(90, 3).fwd(26).turn(90, 3).fwd(20)
    .curl({ dir: 1, size: [18, 11], pitch: 9, turns: 1, r: 3 }), 4.6))
  // jaw / claw row: squared hooks pointing at the axis
  bands.push(B(T(10, 16, 0).fwd(8).turn(-90, 1.5).fwd(8).turn(-90, 1.5).fwd(4), 3.6))
  for (const [x, d] of [[34, 1], [56, -1], [78, 1], [96, -1]]) {
    bands.push(B(d > 0 ? hook(T, x, 15, 180, 10, 8, 5, 1) : hook(T, x - 12, 5, 0, 10, 8, 5, 1), 3.6))
  }
  const bosses = [{ c: P([37, 23]), r: 5 * sx, ring: false, pupil: 1.1 }]
  renderFlush(kit, panel, { bands, bosses, half, seed })
  panel.mirrorX()
  return panel.bake()
}

// ----------------------------------------------------------------- belly kui frieze (y 218–241)

export function bellyKuiPanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const sx = W / 2 / 119, sy = H / 23
  const { P, T, B, half } = author(kit, W, H, sx, sy)
  const bw = 3.9
  const bands = []
  // head at the nose: upper jaw curling down at the flange, lower jaw hooking up
  bands.push(B(T(20, 18.5, 180).fwd(12).turn(90, 1.4).fwd(4), bw))
  bands.push(B(T(20, 5, 180).fwd(11).turn(-90, 1.4).fwd(4), bw))
  // crest running back over the body
  bands.push(B(T(23, 18.5, 0).fwd(26), bw))
  // body to the seam, tail up and curling back
  bands.push(B(T(24, 11.5, 0).fwd(84).turn(90, 2).fwd(7).turn(90, 2).fwd(9), bw))
  // second crest / wing over the body, legs below
  bands.push(B(T(56, 18.5, 0).fwd(32), bw))
  for (const x of [44, 72]) bands.push(B(T(x, 11.5, -90).fwd(5).turn(-90, 1.2).fwd(4), 3))
  const bosses = [{ c: P([16, 12]), r: 2.6 * sx, h: 1.5, ring: true, pupil: 0.6 }]
  renderFlush(kit, panel, { bands, bosses, half, seed })
  panel.mirrorX()
  return panel.bake()
}

// ----------------------------------------------------------------- foot mask (y 36–120)

export function footPanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const sx = W / 2 / 95, sy = H / 84
  const { P, T, B, half } = author(kit, W, H, sx, sy)
  const bands = []
  // nose band, hooking at y ≈ 45
  bands.push(B(T(9, 79, -90).fwd(33).turn(90, 2).fwd(5).turn(90, 1.5).fwd(5)))
  // the tall D horn, open at the bottom, both feet hooking inward; leiwen inside
  bands.push(B(T(29, 41, 180).fwd(7).turn(-90, 1.6).fwd(35).turn(-90, 5).fwd(24).turn(-90, 5).fwd(35).turn(-90, 1.6).fwd(7)))
  // eye bands: canthus to the nose, a short outer hook
  bands.push(B(T(30, 25, 180).fwd(13)))
  bands.push(B(T(40, 25, 0).fwd(8).turn(-90, 1.5).fwd(6)))
  // outer vertical C-band at the seam: hooks at both ends
  bands.push(B(T(69, 41, -90).fwd(8).turn(-90, 2).fwd(11).turn(-90, 3).fwd(44).turn(-90, 3).fwd(22).turn(-90, 3).fwd(12).turn(-90, 2).fwd(9).turn(-90, 2).fwd(4)))
  // edge kui's eye: a tiny boss in a square frame by the seam
  bands.push(kit.shapes.rrect(P([84, 26]), 12 * sx, 12 * sy, 2.2))
  // jaw / claw row
  for (const [x, d] of [[11, 1], [28, -1], [45, 1], [62, -1], [79, 1]]) {
    bands.push(B(d > 0 ? hook(T, x + 12, 16, 180, 11, 9, 5, 1) : hook(T, x, 6, 0, 11, 9, 5, 1), 3.6))
  }
  const bosses = [
    { c: P([35, 25]), r: 4.4 * sx, ring: true, pupil: 1.0 },
    { c: P([84, 26]), r: 2.1 * sx, h: 1.6, pupil: 0.5 },
  ]
  // the square frame is a ring: cut its middle back to the ground
  const frameHole = kit.shapes.rrect(P([84, 26]), 6.4 * sx, 6.4 * sy, 1)
  renderFlush(kit, panel, { bands, bosses: [], half, seed, leiwen: false })
  panel.sink((ctx) => kit.shapes.drawShape(ctx, frameHole, 0.4), { depth: 0.45, shoulder: 0.2, profile: 'u' })
  renderFlush(kit, panel, { bosses, half, seed })
  panel.mirrorX()
  return panel.bake()
}

// ----------------------------------------------------------------- dentil band (y 27–36)

export function dentilPanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const n = 32
  const pitch = W / n
  const tw = pitch * (5 / 6.8)
  panel.sink((ctx) => {
    kit.shapes.strokeLine(ctx, [[0, 1.0], [W, 1.0]], 0.6, 'butt')
    kit.shapes.strokeLine(ctx, [[0, H - 1.0], [W, H - 1.0]], 0.6, 'butt')
  }, { depth: 0.35, shoulder: 0.3, profile: 'u' })
  panel.raise((ctx) => {
    for (let i = 0; i < n; i++) kit.shapes.drawShape(ctx, kit.shapes.rrect([(i + 0.5) * pitch, H / 2], tw, H - 3.4, 1.6))
  }, { height: 0.7, shoulder: 0.55, profile: 'plateau' })
  return panel.bake()
}

// ----------------------------------------------------------------- shoulder kui (y 254–281)

export function shoulderPanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const sx = W / 2 / 105, sy = H / 41.5
  const { P, T, B, half } = author(kit, W, H, sx, sy)
  const bw = 3.8
  const bands = []
  // kui with its head toward the animal head, body running to the seam strip
  bands.push(B(T(46, 27, 180).fwd(12).turn(90, 1.6).fwd(6), bw)) // upper jaw curling down
  bands.push(B(T(45, 12, 180).fwd(10).turn(-90, 1.6).fwd(4), bw)) // lower jaw curling up
  bands.push(B(T(48, 34, 0).fwd(30).turn(-90, 2).fwd(5), bw)) // crest
  bands.push(B(T(52, 20, 0).fwd(34).turn(90, 2.4).fwd(10).turn(-90, 2).fwd(9), bw)) // body → tail up and out
  bands.push(B(T(62, 20, -90).fwd(9).turn(90, 1.6).fwd(7).turn(90, 1.4).fwd(3), 3.4)) // fore leg
  bands.push(B(T(82, 20, -90).fwd(9).turn(90, 1.6).fwd(6), 3.4)) // hind leg
  const bosses = [{ c: P([47, 20]), r: 3.2 * sx, h: 1.8, ring: true, pupil: 0.7 }]
  renderFlush(kit, panel, { bands, bosses, half: { x: 0, y: 2.5, w: half.w, h: H - 5 }, seed })
  panel.mirrorX()
  return panel.bake()
}

// ----------------------------------------------------------------- neck kui band + blade border (y 283–323)

export function neckPanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const yb = H * (32 / 40) // kui band top / leiwen border bottom
  const sx = W / 2 / 88, sy = yb / 32
  const { P, T, B, half } = author(kit, W, H, sx, sy)
  const bands = []
  // kui pair meeting under the nose blade: head = a squared C round the eye, open to the nose
  bands.push(B(T(6, 27, 0).fwd(22).turn(-90, 2.5).fwd(19).turn(-90, 2.5).fwd(17).turn(-90, 1.6).fwd(5)))
  // crest and body running out to the seam ridge, tail curling back
  bands.push(B(T(35, 27, 0).fwd(21)))
  bands.push(B(T(34.5, 17, 0).fwd(41.5).turn(90, 2).fwd(10).turn(90, 2).fwd(9)))
  // legs / claws below the body
  bands.push(B(T(48, 17, -90).fwd(9).turn(-90, 1.5).fwd(6), 3.6))
  bands.push(B(T(66, 17, -90).fwd(9).turn(90, 1.5).fwd(6), 3.6))
  const bosses = [{ c: P([18, 17]), r: 3.3 * sx, h: 1.8, ring: true, pupil: 0.7 }]
  // the border strip the blades stand on: two fine lines, leiwen between
  const lines = [
    { pts: [[0, yb + 0.6], [W / 2 + 1, yb + 0.6]], w: 0.6 },
    { pts: [[0, H - 1.2], [W / 2 + 1, H - 1.2]], w: 0.6 },
  ]
  renderFlush(kit, panel, { bands, bosses, lines, half: { x: 0, y: 1.5, w: half.w, h: H - 2.6 }, seed })
  panel.mirrorX()
  return panel.bake()
}

// ----------------------------------------------------------------- rising blades (y 323–391)

/**
 * Nine blades at 40° (one per nose line, two more per sector at ±40°), seams in the gaps.
 * Authored in TRUE developed mm (blade outlines straight-sided as cut), mapped onto the
 * angle-linear panel with size.toPanel.
 */
export function bladePanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const { band, Turtle } = kit.shapes
  const DEG = Math.PI / 180
  const r0 = size.rBottom
  const rAt = (y) => size.widthAt(y) / ((size.theta1 - size.theta0) * DEG)
  const tipY = H - 2.2
  const baseY = 1.6
  const Hb = tipY - baseY
  const hb = r0 * 16.5 * DEG // base half width (true mm) — 33° of arc
  // half width (true mm) at fraction t up the blade: a tall pointed arch, gently convex flanks
  const hw = (t) => (t >= 1 ? 0 : hb * Math.pow(1 - Math.pow(t, 2.6), 0.6))
  const lines = []
  const bands = []
  const lw = 0.8
  const sp = 1.9
  const toP = (thc) => ([dx, y]) => size.toPanel([thc * DEG * rAt(y) + dx, y])
  const side = (thc, d, tMin = 0, n = 70) => {
    // left flank inset by d (true mm), base → apex, then down the right flank
    const L = []
    for (let i = 0; i <= n; i++) {
      const t = tMin + (1 - tMin) * (i / n)
      const w = hw(t) - d
      const y = baseY + t * Hb
      if (w <= 0.05) { L.push([0, y - d * 0.6]); break }
      L.push([-w, y])
    }
    const R = L.slice(0, -1).reverse().map(([x, y]) => [-x, y])
    return L.concat(R).map(toP(thc))
  }
  const t0 = 0.56 // contour lines only above
  for (const thc of [-40, 0]) {
    // outline: three contour lines
    for (let k = 0; k < 4; k++) lines.push({ pts: side(thc, 0.8 + k * sp), w: lw })
    // upper blade: nested lines converging on the apex
    for (let k = 4; k < 16; k++) {
      const d = 0.8 + k * sp
      if (hw(t0) - d < 1.2) break
      lines.push({ pts: side(thc, d, t0), w: lw })
    }
    const yT = baseY + t0 * Hb - sp * 0.6
    const wT = hw(t0) - (0.8 + 3 * sp) - 0.8
    lines.push({ pts: [[-wT, yT], [wT, yT]].map(toP(thc)), w: lw })
    // lower blade: the stretched mask
    const m = (pts) => pts.map(toP(thc))
    const yb = baseY + 6.5
    const ins = 0.8 + 4 * sp + 1.2
    for (const sgn of [-1, 1]) {
      const X = (x) => sgn * x
      // squared C-spiral 'eye' at ≈ 30 % of the blade, curling in toward the axis
      const ye = baseY + 0.42 * Hb
      const a = Math.max(6, hw(0.42) - ins - 4)
      const sp1 = new Turtle([X(3.6), ye], sgn < 0 ? 180 : 0).fwd(a).turn(-90 * sgn, 2.6).fwd(17).turn(-90 * sgn, 2.4).fwd(a * 0.66).turn(-90 * sgn, 2).fwd(8.5).turn(-90 * sgn, 1.6).fwd(a * 0.32)
      bands.push(band(m(sp1.spine(0.3)), 4.2, 'flat', 'flat'))
      // lip band along the base, a hook rising at its outer end
      const wl = hw(0.07) - ins - 2.5
      const lip = new Turtle([X(2.5), yb], sgn < 0 ? 180 : 0).fwd(Math.max(4, wl)).turn(90 * sgn, 1.6).fwd(5)
      bands.push(band(m(lip.spine(0.3)), 4, 'flat', 'flat'))
    }
    // nose band on the blade axis
    bands.push(band(m([[0, yb + 4.5], [0, baseY + 0.5 * Hb]]), 4.2, 'flat', 'flat'))
  }
  // leiwen only inside the lower blades
  const include = (ctx) => {
    for (const thc of [-40, 0]) {
      const pts = []
      const d = 0.8 + 3 * sp + 1.0
      const tTop = t0 - (sp * 1.1) / Hb
      for (let i = 0; i <= 40; i++) {
        const t = (tTop * i) / 40
        pts.push([-(hw(t) - d), baseY + t * Hb])
      }
      const all = pts.concat(pts.slice().reverse().map(([x, y]) => [-x, y])).map(toP(thc))
      kit.shapes.polyPath(ctx, all, true)
      ctx.fill()
    }
  }
  renderFlush(kit, panel, { bands, lines, half: { x: 0, y: 0, w: W / 2, h: H }, include, seed, lineDepth: 0.4 })
  panel.mirrorX()
  return panel.bake()
}
