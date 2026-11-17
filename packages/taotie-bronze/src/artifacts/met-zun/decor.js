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
function author(kit, W, H, sx = 1, sy = 1, bw = BW) {
  const { Turtle, band } = kit.shapes
  const cx = W / 2
  const P = ([x, y]) => [cx - x * sx, y * sy]
  const T = (x, y, h) => new Turtle([x, y], h)
  const B = (t, w = bw, capA = 'flat', capB = 'flat') => band(t.spine(0.3).map(P), w, capA, capB)
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
  const { circle } = kit.shapes
  const bands = []
  // Read from detail-belly-mask.jpg / detail-belly-half.jpg on a developed-mm grid (x from
  // the nose line, y up from the register's lower edge). Orthogonal bands only.
  // nose column beside the flange, from the top down, the snout hooking out at its foot
  bands.push(B(T(5.5, 62, -90).fwd(40).turn(90, 2).fwd(4.5).turn(90, 1.6).fwd(3), 4.6))
  // THE horn: ONE open band — out of the nose column at y ≈ 36, up beside it, out along
  // the top to x ≈ 70, then down and back toward the axis into a squared spiral of
  // 1½ turns whose free end lies near (0.46, 0.70)
  bands.push(B(T(7.5, 36, 0).fwd(9).turn(90, 2.4).fwd(21).turn(-90, 3.2).fwd(50).turn(-90, 3.2).fwd(23.5)
    .turn(-90, 3).fwd(33).turn(-90, 2.6).fwd(15).turn(-90, 2.2).fwd(20).turn(-90, 1.8).fwd(6.5).turn(-90, 1.5).fwd(9), 5.2))
  // outer element: a narrower open C-scroll at the seam (ear / upturned tail), opening to the nose
  bands.push(B(T(84, 51, 90).fwd(6).turn(-90, 2.4).fwd(18).turn(-90, 2.6).fwd(25).turn(-90, 2.4).fwd(15).turn(-90, 1.8).fwd(5), 4.4))
  // the eye: a pale round socket outlined by the groove, the boss inside; a short
  // horizontal inner-canthus stub to the nose column
  bands.push(circle(P([38, 23.5]), 6.6 * sx))
  bands.push(B(T(32, 23.5, 180).fwd(23), 4.3))
  // body: out from behind the eye to the seam, a small hook rising at its end
  bands.push(B(T(44, 24, 0).fwd(50).turn(90, 1.8).fwd(4).turn(90, 1.4).fwd(3), 4.4))
  // lower row: open hooks of mixed form and size (lip, fangs, claws), none closed
  bands.push(B(T(17, 14.5, 0).fwd(17).turn(-90, 1.8).fwd(7).turn(-90, 1.6).fwd(8).turn(90, 1.4).fwd(3.5), 4.1)) // S-hook under the eye
  bands.push(B(T(64, 16, 180).fwd(13).turn(90, 1.6).fwd(9).turn(90, 1.4).fwd(5.5), 4.1)) // C-claw toward the nose
  bands.push(B(T(80, 4.5, 180).fwd(9).turn(-90, 1.4).fwd(7).turn(-90, 1.2).fwd(3.5), 3.8)) // small hook
  bands.push(B(T(107, 17, 180).fwd(19).turn(90, 2).fwd(10.5).turn(90, 2).fwd(13).turn(90, 1.6).fwd(4).turn(90, 1.3).fwd(5), 4.2)) // larger hook at the seam end
  const bosses = [{ c: P([38, 23.5]), r: 4.5 * sx, h: 2.3, ring: false, pupil: 1.1 }]
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
  const { circle } = kit.shapes
  const bw = 3.5
  const bands = []
  const bosses = []
  // detail-belly-half.jpg: TWO kui per half-panel, both facing the nose line, ≈ 50 mm
  // each: a big ringed eye at the head, the snout/jaw curling down-and-in under it, a
  // hooked crest over it, and the body running back toward the seam, the tail turning up.
  for (const x0 of [9, 61]) {
    bands.push(circle(P([x0 + 6, 13.5]), 4.4 * sx))
    bosses.push({ c: P([x0 + 6, 13.5]), r: 2.4 * sx, h: 0, ring: true, pupil: 0.6 }) // flush ring eye
    // jaw under the eye, curling up at the snout
    bands.push(B(T(x0 + 17, 5, 180).fwd(13).turn(-90, 1.6).fwd(3.5).turn(-90, 1.2).fwd(2.5), bw))
    // crest over the eye: forward, then hooking down in front of it
    bands.push(B(T(x0 + 16, 19.5, 180).fwd(13).turn(90, 1.6).fwd(4), bw))
    // body back toward the seam, tail up and curling back
    bands.push(B(T(x0 + 12.5, 12.5, 0).fwd(33).turn(90, 1.8).fwd(5.5).turn(90, 1.6).fwd(7).turn(90, 1.4).fwd(2.5), bw))
    // a leg / claw below the body
    bands.push(B(T(x0 + 27, 12.5, -90).fwd(6).turn(-90, 1.2).fwd(4.5), 3))
  }
  renderFlush(kit, panel, { bands, bosses, half, seed })
  panel.mirrorX()
  return panel.bake()
}

// ----------------------------------------------------------------- foot mask (y 36–120)

export function footPanel(kit, size, { ppmm, seed }) {
  const W = size.width, H = size.height
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const sx = W / 2 / 95, sy = H / 84
  // the foot's bands are visibly heavier than the belly's (≈ 4.8 mm in detail-foot-front.jpg)
  const { P, T, B, half } = author(kit, W, H, sx, sy, 4.8)
  const bands = []
  // nose band beside the flange, ending in an inward (toward-axis) hook at y ≈ 45
  bands.push(B(T(10, 79, -90).fwd(32).turn(-90, 1.6).fwd(3.5)))
  // under it, a column of small C/K-hooks beside the flange
  bands.push(B(T(15.5, 39, 180).fwd(6).turn(90, 1.4).fwd(5).turn(90, 1.2).fwd(3.5), 3.4))
  bands.push(B(T(8, 32.5, 0).fwd(7.5).turn(-90, 1.4).fwd(2.5), 3.4))
  // the tall D horn, open at the bottom, both feet hooking inward; a coarse labyrinth inside
  bands.push(B(T(29, 41, 180).fwd(7).turn(-90, 1.6).fwd(35).turn(-90, 5).fwd(24).turn(-90, 5).fwd(35).turn(-90, 1.6).fwd(7)))
  // only a short inner-canthus stub from the eye toward the nose
  bands.push(B(T(30, 25, 180).fwd(9)))
  // outer vertical C-band at the seam: hooks at both ends
  bands.push(B(T(69, 41, -90).fwd(8).turn(-90, 2).fwd(11).turn(-90, 3).fwd(44).turn(-90, 3).fwd(22).turn(-90, 3).fwd(12).turn(-90, 2).fwd(9).turn(-90, 2).fwd(4)))
  // edge kui's eye: a tiny boss in a square frame by the seam
  bands.push(kit.shapes.rrect(P([84, 26]), 12 * sx, 12 * sy, 2.2))
  // jaw / claw row: open hooks of mixed form, packed tight (detail-foot-front.jpg) — an
  // L-claw by the nose, one S under the eye, a squared spiral hook, a C-hook at the seam;
  // a row of identical S's read as the letters 'SSS'
  bands.push(B(T(6, 4, 0).fwd(11).turn(90, 1.4).fwd(9).turn(90, 1.4).fwd(6), 3.1))
  bands.push(B(T(40, 17.5, 180).fwd(13).turn(90, 1.4).fwd(5.5).turn(90, 1.4).fwd(9).turn(-90, 1.4).fwd(5.5).turn(-90, 1.4).fwd(12), 3.1))
  bands.push(B(T(46, 4, 0).fwd(22).turn(90, 1.6).fwd(13).turn(90, 1.4).fwd(15).turn(90, 1.2).fwd(6).turn(90, 1.2).fwd(7), 3.1))
  bands.push(B(T(76, 17.5, 0).fwd(12).turn(-90, 1.4).fwd(11).turn(-90, 1.4).fwd(6), 3.1))
  const bosses = [
    { c: P([35, 25]), r: 4.4 * sx, ring: true, pupil: 1.0 },
    { c: P([84, 26]), r: 2.1 * sx, h: 1.6, pupil: 0.5 },
  ]
  // the D's inset: two stacked squared spirals (11 × 21 mm), line pitch 1.8 — coarser than the 1.3 ground
  const lines = []
  for (const [cy, h] of [[53.3, 1], [63.7, -1]]) {
    lines.push({ pts: sqSpiral([34, cy], 5.5, 5.0, 1.8, h).map(P), w: 0.85 })
  }
  // the square frame is a ring: cut its middle back to the ground
  const frameHole = kit.shapes.rrect(P([84, 26]), 6.4 * sx, 6.4 * sy, 1)
  renderFlush(kit, panel, { bands, bosses: [], half, seed, leiwen: false })
  panel.sink((ctx) => kit.shapes.drawShape(ctx, frameHole, 0.4), { depth: 0.45, shoulder: 0.2, profile: 'u' })
  renderFlush(kit, panel, { bosses, lines, half, seed })
  panel.mirrorX()
  return panel.bake()
}

/** squared spiral centre line, outside → in, half sizes a × b, pitch p, hand h (±1) */
function sqSpiral(c, a, b, p, h = 1) {
  const pts = []
  let x0 = -a, x1 = a, y0 = -b, y1 = b
  pts.push([x0, y0 + p])
  while (x1 - x0 > 2 * p && y1 - y0 > 2 * p) {
    pts.push([x0, y1], [x1, y1], [x1, y0])
    x0 += p
    pts.push([x0, y0])
    y1 -= p; x1 -= p; y0 += p
    pts.push([x0, y0 + 0.001])
  }
  pts.push([x0, (y0 + y1) / 2])
  return pts.map(([x, y]) => [c[0] + h * x, c[1] + y])
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
  const { circle } = kit.shapes
  const bands = []
  // ONE bold kui per half-sector (detail-shoulder-seam.jpg), head toward the animal head,
  // bands ≈ 4 mm spanning ≈ 80 % of the slope, few fillers
  const bw4 = 4.2
  bands.push(B(T(34, 23, 90).fwd(10).turn(-90, 2.2).fwd(55).turn(-90, 2.6).fwd(15).turn(-90, 2).fwd(8).turn(-90, 1.6).fwd(3), bw4)) // upper jaw → back → tail down and in
  bands.push(B(T(49, 6.5, 180).fwd(13).turn(-90, 1.8).fwd(6), bw4)) // lower jaw curling up
  bands.push(circle(P([44, 19.5]), 4.3 * sx)) // eye socket
  bands.push(B(T(50, 19.5, 0).fwd(24).turn(-90, 2).fwd(8).turn(-90, 1.6).fwd(5), bw4)) // body → leg/claw
  const bosses = [{ c: P([44, 19.5]), r: 2.4 * sx, h: 0, ring: true, pupil: 0.7 }] // flush ring eye
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
  const { circle } = kit.shapes
  const bands = []
  // detail-neck-blades.jpg: two kui heads face each other and meet under the nose blade —
  // no frame round them. Each head is a bold rounded-square loop the full height of the
  // band, open toward the nose and curling in round a flush ring eye (x ≈ 15); the body
  // behind it is a tall squared 'P' spiral to the seam, a [-shaped tail hook at the
  // seam ridge. Everything fills the band height: at vessel distance the band reads as a
  // row of pale squared loops, not as a thin line.
  bands.push(B(T(2.5, 27, 0).fwd(20.5).turn(-90, 4).fwd(19).turn(-90, 3.5).fwd(16).turn(-90, 3).fwd(12).turn(-90, 2.4).fwd(6.5), 4.2)) // head loop
  bands.push(circle(P([15.3, 13.8]), 2.7 * sx)) // eye socket
  bands.push(B(T(29, 8, 0).fwd(42).turn(90, 3).fwd(19).turn(90, 3).fwd(39).turn(90, 2.4).fwd(12).turn(90, 2.2).fwd(29).turn(90, 1.8).fwd(5), 4.2)) // body 'P' spiral
  bands.push(B(T(85, 27, 180).fwd(6.5).turn(90, 2.4).fwd(19).turn(90, 2.4).fwd(6.5), 4.0)) // tail hook at the seam
  const bosses = [{ c: P([15.3, 13.8]), r: 1.9 * sx, h: 0, ring: true, pupil: 0.6 }] // flush ring eye
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
  const hb = r0 * 18 * DEG // base half width — 36° of arc, 4° (≈ 6.5 mm) V-gaps (detail-neck-seam.jpg: bases nearly touch)
  // half width (true mm) at fraction t up the blade: a tall pointed arch, gently convex flanks
  // a tall arch with full convex flanks closing to a blunt point (detail-neck-blades.jpg)
  // pointed (gothic) arch: each flank one circular arc from the base corner to the apex,
  // turning 2δ, so the base leans in by γ − δ and the apex meets at 2(γ + δ) ≈ 62°
  // (detail-neck-blades.jpg: convex flanks, a definite point, no rounded bullet top)
  const arc = (() => {
    const c = Math.hypot(hb, Hb), gam = Math.atan2(hb, Hb), alpha = 31 * DEG
    const del = Math.max(0.02, alpha - gam)
    const R = c / (2 * Math.sin(del)), h = R * Math.cos(del)
    return { R, cx: hb / 2 - (Hb / c) * h, cy: Hb / 2 - (hb / c) * h }
  })()
  const hw = (t) => (t >= 1 ? 0 : Math.max(0, arc.cx + Math.sqrt(Math.max(0, arc.R * arc.R - (t * Hb - arc.cy) ** 2))))
  const lines = []
  const bands = []
  // widths grow with the flare (∝ r) over the lower 55 %, then stay true so the apex keeps its point: the photographs' blades stay almost touching up
  // to mid height, V-slots between them, rather than narrowing in true mm as the trumpet opens
  const toP = (thc) => ([dx, y]) => size.toPanel([thc * DEG * rAt(y) + dx * (rAt(Math.min(y, baseY + 0.55 * Hb)) / r0), y])
  const side = (thc, d, tMin = 0, n = 90) => {
    // left flank offset inward by d (true mm, along the normal), base → axis, mirrored:
    // nested lines meet the axis in a point, the "A" apex of the photographs
    const C = (t) => [-hw(Math.min(t, 0.9999)), baseY + t * Hb]
    const L = []
    for (let i = 0; i <= n; i++) {
      const t = tMin + (1 - tMin) * (i / n)
      const a = C(Math.max(0, t - 0.004)), b = C(Math.min(1, t + 0.004))
      const tx = b[0] - a[0], ty = b[1] - a[1], l = Math.hypot(tx, ty) || 1
      const c = C(t)
      const p = [c[0] + (d * ty) / l, c[1] - (d * tx) / l]
      if (p[0] >= -0.05) {
        const q = L[L.length - 1]
        if (q) L.push([0, q[1] + ((p[1] - q[1]) * -q[0]) / (p[0] - q[0] || 1)])
        break
      }
      L.push(p)
    }
    const R = L.slice(0, -1).reverse().map(([x, y]) => [-x, y])
    return L.concat(R).map(toP(thc))
  }
  const t0 = 0.46 // contour lines only above
  // detail-neck-blades.jpg (≈ 6 px/mm): the arch is a pale border strip between black
  // grooves, and the upper blade 4–6 nested pale strips ≈ 3 mm apart converging on the
  // point — pale-on-black line work that reads at vessel distance (1 mm hairlines on the
  // plain wall vanished)
  for (const thc of [-40, 0]) {
    // pale strips between the black grooves (flush bands, so the patina's relief tops
    // read pale as in the photograph): a 2.4 mm border strip, then nested 1.6 mm strips
    bands.push(band(side(thc, 2.1), 2.4, 'flat', 'flat'))
    for (let k = 0; k < 7; k++) {
      const d = 5.7 + k * 3.0
      if (hw(t0) - d < 1.6) break
      bands.push(band(side(thc, d, t0), 1.6, 'flat', 'flat'))
    }
    const yT = baseY + t0 * Hb - 1.9
    const wT = hw(t0) - 4.4
    bands.push(band([[-wT, yT], [wT, yT]].map(toP(thc)), 1.6, 'flat', 'flat'))
    // lower blade: the stretched mask
    const m = (pts) => pts.map(toP(thc))
    const yb = baseY + 6.5
    const ins = 4.4 + 1.6
    for (const sgn of [-1, 1]) {
      const X = (x) => sgn * x
      // squared C-spiral 'eye' (lower 20–45 % of the blade), curling up and back in toward the axis
      const ye = baseY + 0.2 * Hb
      const a = Math.max(6, hw(0.3) - ins - 3.5)
      const sp1 = new Turtle([X(3.6), ye], sgn < 0 ? 180 : 0).fwd(a).turn(90 * sgn, 2.6).fwd(15.5).turn(90 * sgn, 2.4).fwd(a * 0.68).turn(90 * sgn, 2).fwd(8).turn(90 * sgn, 1.6).fwd(a * 0.34)
      bands.push(band(m(sp1.spine(0.3)), 4.2, 'flat', 'flat'))
      // lip band along the base, a hook rising at its outer end
      const wl = hw(0.07) - ins - 2.5
      const lip = new Turtle([X(2.5), yb], sgn < 0 ? 180 : 0).fwd(Math.max(4, wl)).turn(90 * sgn, 1.6).fwd(5)
      bands.push(band(m(lip.spine(0.3)), 4, 'flat', 'flat'))
    }
    // nose band on the blade axis
    bands.push(band(m([[0, yb + 4.5], [0, baseY + 0.44 * Hb]]), 4.2, 'flat', 'flat'))
  }
  // leiwen only inside the lower blades
  const include = (ctx) => {
    for (const thc of [-40, 0]) {
      const pts = []
      const d = 4.4 + 0.6
      const tTop = t0 - 2.8 / Hb
      for (let i = 0; i <= 40; i++) {
        const t = (tTop * i) / 40
        pts.push([-(hw(t) - d), baseY + t * Hb])
      }
      const all = pts.concat(pts.slice().reverse().map(([x, y]) => [-x, y])).map(toP(thc))
      kit.shapes.polyPath(ctx, all, true)
      ctx.fill()
    }
  }
  renderFlush(kit, panel, { bands, lines, half: { x: 0, y: 0, w: W / 2, h: H }, include, seed, groove: 0.95, solid: false })
  panel.mirrorX()
  return panel.bake()
}
