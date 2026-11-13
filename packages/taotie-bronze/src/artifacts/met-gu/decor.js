// Décor of the Met gu 1985.214.4, register by register, after reference/met-gu/dossier.md §c
// and the close-up photographs. Each painter draws into a ReliefPanel in panel mm.
//
// Half masks are authored in CREATURE space: X = developed mm outward from the
// nose-flange axis, v = mm of meridian arc up from the register bottom. The
// panel is laid on the wall 1:1 (lathe register `map: 'true'`), so X is true
// surface distance at every height and the foot's fan shape is the panel's own
// edge: hw(v) = quadrant width at v = nose flange → seam flange.

import { rectSpiral, cellRow, incise, flushBands, domeBoss } from './lib.js'

const FLANGE_HALF = 2.6 // half of a 4.5–5 mm flange plus a hair: kept plain under every flange root

// ===================================================================== foot

/**
 * Foot register (y 25.5 → 78.2): one whole taotie per panel (nose on the panel centre line),
 * true-mapped, panel W = the widest (bottom) arc of the 180° sector.
 */
export function paintFoot(kit, panel, size, { pitch = 0.75, seed = 1 } = {}) {
  const { Turtle, band, rrect, drawShape } = kit.shapes
  const W = panel.width, Hp = panel.height
  const cx = W / 2
  const hw = (v) => size.widthAt(Math.max(0, Math.min(Hp, v))) / 2 // nose axis → seam axis (mm)
  const P = ([X, v]) => [cx - X, v]
  const k = Hp / 55.1 // dossier v → this panel's arc
  const V = (v) => v * k
  const bw = 2.7 // flat band width (dossier 2.8–3.5; the jaw needs it a hair narrower)
  const R = 1.1 // centre-line fillet → squared-round corners
  const bands = []
  const B = (t, w = bw, a = 'square', b = 'square') => bands.push(band(t.spine(0.3).map(P), w, a, b))

  // --- jaw: a squared C/G scroll curling back toward the axis, with a short down-hook at its outer end
  B(new Turtle([29.4, V(4.9)], 180).fwd(2.8).turn(-90, R).to([26.6, V(11.4)]).turn(90, R).to([10.9, V(11.4)])
    .turn(90, R).to([10.9, V(5.7)]).turn(90, R).to([21.4, V(5.7)]).turn(90, R).to([21.4, V(8.55)]).turn(90, 0.9).to([15.6, V(8.55)]))
  // --- leg / claw fragments below the outer side of the eye: two small T-hooks pointing at the axis
  B(new Turtle([32.4, V(4.6)], 90).fwd(V(5.6)).turn(90, 0.9).fwd(3.0).turn(90, 0.6).fwd(1.6), 2.2)
  B(new Turtle([37.6, V(4.6)], 90).fwd(V(9.4)).turn(90, 0.9).fwd(3.4).turn(90, 0.6).fwd(1.9), 2.2)
  // --- eye socket: flat rounded-square band field framing the boss
  const eye = [16.7, V(17.6)]
  bands.push(rrect(P(eye), 10.4, V(9.4), 2.6))
  // --- C-ear outside and above the eye, opening downward
  B(new Turtle([28.6, V(15.6)], 90).fwd(V(5.6)).turn(90, R).fwd(4.4).turn(90, 0.9).fwd(V(2.6)).turn(90, 0.6).fwd(1.9), 2.2)
  // --- squared crook horn: inner leg rises beside the nose column, top bar runs out, outer leg drops and curls in above the eye
  B(new Turtle([10.7, V(24.2)], 90).to([10.7, V(36.0)]).turn(-90, R).to([25.6, V(36.0)]).turn(-90, R).to([25.6, V(26.9)])
    .turn(-90, R).to([18.6, V(26.9)]).turn(-90, 0.9).to([18.6, V(31.1)]).turn(-90, 0.7).to([21.6, V(31.1)]), 3.3)
  // --- separate ㄱ quill just outside the horn's outer leg
  B(new Turtle([28.3, V(35.4)], 0).fwd(4.0).turn(-90, 0.9).fwd(V(5.4)).turn(-90, 0.6).fwd(1.5), 2.3)
  // --- outer edge column (Ǝ): a spine parallel to the seam with bars hooking out toward it
  {
    const spine = (v) => hw(v) - 6.6
    const v0 = V(5.2), v1 = V(36.0)
    const pts = []
    for (let v = v0; v <= v1 + 1e-6; v += 0.8) pts.push(P([spine(v), v]))
    bands.push(band(pts, 2.2, 'square', 'square'))
    for (const vb of [V(6.2), V(15.4), V(24.6), V(34.9)]) {
      const x0 = spine(vb), x1 = hw(vb) - FLANGE_HALF - 1.3
      B(new Turtle([x0, vb], 0).to([x1, vb]).turn(-90, 0.7).fwd(Math.min(2.4, V(2.2))), 2.0)
    }
  }
  // --- upper sub-band (v 40.5–53): a squared body/tail band looping out from beside the nose column
  B(new Turtle([9.4, V(42.4)], 90).to([9.4, V(50.9)]).turn(-90, R).to([28.6, V(50.9)]).turn(-90, R).to([28.6, V(45.6)])
    .turn(-90, R).to([17.0, V(45.6)]).turn(-90, 0.8).fwd(V(2.3)), 2.6)
  // small C-hook at its outer top corner
  B(new Turtle([31.6, V(46.0)], 90).fwd(V(4.6)).turn(-90, 0.8).fwd(2.0).turn(-90, 0.6).fwd(V(1.8)), 1.9)

  const paint = (ctx) => { for (const s of bands) drawShape(ctx, s) }
  flushBands(panel, paint, { lift: 0.22, lw: 0.42, groove: 0.3 })

  // --- eye: rounded-square dome with a sunk horizontal slot pupil
  const eyeDraw = (ctx) => drawShape(ctx, rrect(P(eye), 6.0, 6.0, 1.8))
  domeBoss(panel, eyeDraw, { height: 1.9, radius: 3.0, wall: 0.45 })
  panel.sink((ctx) => drawShape(ctx, rrect(P(eye), 2.6, 1.35, 0.6)), { depth: 0.55, shoulder: 0.3, profile: 'u' })

  // --- framed leiwen: bottom border row, nose column, separator row
  const cells = []
  const cellRects = []
  const addCells = (x0, y0, w, h, o) => {
    cells.push(...cellRow(x0, y0, w, h, { pitch, ...o }))
    cellRects.push([x0, y0, w, h])
  }
  // bottom row (v 0.6–3.6), from the nose column to the seam: work in panel space directly (left half)
  {
    const y0 = V(0.6), h = V(3.0)
    const xl = cx - (hw(y0 + h) - FLANGE_HALF), xr = cx - FLANGE_HALF
    addCells(xl, y0, xr - xl, h, { count: Math.round((xr - xl) / 4.2) })
  }
  // nose column (X 2.6–7.6, v 4.1 → 38)
  addCells(cx - 7.7, V(4.1), 5.0, V(33.9), { count: 8, vertical: true })
  // separator row (v 38.4–41.1)
  {
    const y0 = V(38.4), h = V(2.7)
    const xl = cx - (hw(y0 + h) - FLANGE_HALF), xr = cx - FLANGE_HALF
    addCells(xl, y0, xr - xl, h, { count: Math.round((xr - xl) / 3.9) })
  }
  incise(panel, cells, { width: pitch * 0.5, depth: 0.3 })

  // --- free leiwen everywhere else on the left half, inside the fan
  const fan = (ctx) => {
    ctx.beginPath()
    const top = V(53.4)
    ctx.moveTo(cx - FLANGE_HALF, V(0.5))
    ctx.lineTo(cx - FLANGE_HALF, top)
    for (let v = top; v >= V(0.5); v -= 1) ctx.lineTo(cx - (hw(v) - FLANGE_HALF), v)
    ctx.closePath()
    ctx.fill()
  }
  const avoid = (ctx) => {
    paint(ctx)
    eyeDraw(ctx)
    for (const [x, y, w, h] of cellRects) ctx.fillRect(x, y, w, h)
  }
  kit.leiwenFill(panel, { rect: { x: 0, y: 0, w: cx, h: Hp }, include: fan, avoid, margin: 0.42 }, {
    pitch, line: 0.5, depth: 0.3, roundness: 0.08, jitter: 0.05, cell: [2.6, 5.4], pairs: 0.5, fillers: true, seed,
  })
  panel.mirrorX()
  return { bands: bands.length }
}

// ===================================================================== waist

/**
 * Waist drum (y 95.0 → 146.4): one whole taotie per panel (2 sectors), cylinder 1:1.
 * `variant` 'B' adds the fan of short vertical grooves inside the jaw scroll (taotie B only).
 */
export function paintWaist(kit, panel, size, { pitch = 0.85, seed = 2, variant = 'A' } = {}) {
  const { Turtle, band, rrect, drawShape } = kit.shapes
  const W = panel.width, Hp = panel.height
  const cx = W / 2
  const hw = W / 2
  const P = ([X, v]) => [cx - X, v]
  const o = 1.5 // décor starts 1.5 mm inside the drum ends
  const bw = 2.8
  const R = 1.1
  const bands = []
  const B = (t, w = bw) => bands.push(band(t.spine(0.3).map(P), w, 'square', 'square'))
  const xs = hw - FLANGE_HALF // seam-side limit

  // jaw: big squared C/G scroll under the eye, spiral at the seam side, short hooked tail toward the nose
  B(new Turtle([10.6, o + 10.4], 180).fwd(2.6).turn(90, R).to([8.0, o + 3.4]).turn(90, R).to([29.4, o + 3.4]).turn(90, R)
    .to([29.4, o + 11.8]).turn(90, R).to([20.6, o + 11.8]).turn(90, R).to([20.6, o + 7.6]).turn(90, 0.9).to([25.2, o + 7.6])
    .turn(90, 0.7).to([25.2, o + 9.4]))
  // eye socket band around the boss
  const eye = [18.2, o + 17.4]
  bands.push(rrect(P(eye), 9.0, 8.2, 2.4))
  // crook horn: rises above the eye, runs to the top border, turns to the nose and curls down beside the flange
  B(new Turtle([19.6, o + 22.6], 90).to([19.6, o + 46.2]).turn(90, R).to([6.4, o + 46.2]).turn(90, R).to([6.4, o + 37.8])
    .turn(90, R).to([12.2, o + 37.8]).turn(90, 0.9).to([12.2, o + 42.2]).turn(90, 0.7).to([9.6, o + 42.2]))
  // the drop along the nose flange below the horn spiral (brow / nose side), hooking toward the eye
  B(new Turtle([5.6, o + 34.6], 270).to([5.6, o + 19.6]).turn(90, R).to([9.8, o + 19.6]).turn(90, 0.7).fwd(2.0), 2.4)

  const paint = (ctx) => { for (const s of bands) drawShape(ctx, s) }
  flushBands(panel, paint, { lift: 0.4, lw: 0.4, groove: 0.3, echo: 1.05 })

  const eyeDraw = (ctx) => drawShape(ctx, rrect(P(eye), 6.0, 5.5, 2.3))
  domeBoss(panel, eyeDraw, { height: 2.0, radius: 2.9, wall: 0.45 })

  // seam column of 3 framed leiwen squares
  const cells = []
  const cellRects = []
  const col = { x: cx - xs, w: xs - 23.8 }
  cells.push(...cellRow(col.x, o + 17.2, col.w, 30.6, { pitch, count: 3, vertical: true, gap: 0.8 }))
  cellRects.push([col.x, o + 17.2, col.w, 30.6])
  // B: fang / claw marks inside the jaw scroll
  if (variant === 'B') {
    const lines = []
    for (let i = 0; i < 5; i++) {
      const X = 10.6 + i * 1.75
      lines.push([P([X, o + 5.6]), P([X, o + 9.6])])
    }
    incise(panel, lines, { width: 0.45, depth: 0.32 })
    cellRects.push([cx - 18.4, o + 5.0, 8.8, 5.2])
  }
  incise(panel, cells, { width: pitch * 0.5, depth: 0.3 })

  const avoid = (ctx) => {
    paint(ctx)
    eyeDraw(ctx)
    for (const [x, y, w, h] of cellRects) ctx.fillRect(x, y, w, h)
  }
  kit.leiwenFill(panel, { rect: { x: cx - xs, y: o, w: xs - FLANGE_HALF, h: Hp - 2 * o }, avoid, margin: 0.4 }, {
    pitch, line: 0.5, depth: 0.3, roundness: 0.08, jitter: 0.05, cell: [2.8, 5.4], pairs: 0.5, seed,
  })
  panel.mirrorX()
}

// ===================================================================== neck band

/**
 * Neck frieze (y 153.4 → 171.5): one unit per quadrant, all facing the same way (+x, toward
 * increasing azimuth): head with two ring eyes at the right end, framed-spiral body, big squared
 * spiral tail at the left end, just right of the divider. Flush, fine lines above and below.
 */
export function paintNeck(kit, panel, { pitch = 0.9, seed = 3 } = {}) {
  const { Turtle, band, drawShape } = kit.shapes
  const W = panel.width, H = panel.height
  const lines = []
  // bounding lines and the divider at the left edge (the right edge is the next unit's left)
  lines.push([[0, 0.75], [W, 0.75]], [[0, H - 0.75], [W, H - 0.75]])
  lines.push([[0.45, 0.75], [0.45, H - 0.75]])
  incise(panel, lines, { width: 0.45, depth: 0.32 })
  // body band: from the tail spiral along the back to the head
  const bands = []
  bands.push(band(new Turtle([10.6, 12.6], 0).to([W - 12.6, 12.6]).turn(-90, 1.0).to([W - 12.6, 9.6]).spine(0.3), 2.0, 'square', 'square'))
  // head: a squared hood over the two ring eyes, open toward the snout
  bands.push(band(new Turtle([W - 13.4, 3.2], 0).to([W - 1.6, 3.2]).turn(90, 1.0).to([W - 1.6, 10.2]).turn(90, 1.0).to([W - 7.6, 10.2]).spine(0.3), 1.6, 'square', 'square'))
  const paint = (ctx) => { for (const s of bands) drawShape(ctx, s) }
  flushBands(panel, paint, { lift: 0.18, lw: 0.38, groove: 0.28 })
  // two ring eyes (Ø 3.4), one with a dot pupil
  const ringPaint = (ctx) => {
    for (const x of [W - 4.3, W - 9.6]) {
      ctx.beginPath()
      ctx.arc(x, 6.6, 1.75, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  panel.raise(ringPaint, { height: 0.35, shoulder: 0.2, profile: 'plateau' })
  panel.sink((ctx) => {
    ctx.lineWidth = 0.38
    for (const x of [W - 4.3, W - 9.6]) {
      ctx.beginPath()
      ctx.arc(x, 6.6, 1.0, 0, Math.PI * 2)
      ctx.stroke()
    }
    ctx.beginPath()
    ctx.arc(W - 4.3, 6.6, 0.35, 0, Math.PI * 2)
    ctx.fill()
  }, { depth: 0.3, shoulder: 0.19, profile: 'u' })
  // tail: big squared spiral just right of the divider
  const tail = rectSpiral(1.3, 2.4, 8.6, 8.8, pitch * 1.05)
  // upper row of framed cells along the top line, lower framed cells between tail and head
  const cells = [tail]
  cells.push(...cellRow(10.4, 14.0, W - 11.2, 2.9, { pitch: pitch * 0.85, count: 5 }))
  cells.push(...cellRow(10.4, 2.0, W - 24.6, 8.6, { pitch, count: 2 }))
  incise(panel, cells, { width: pitch * 0.48, depth: 0.28 })
}

// ===================================================================== blades

/**
 * One rising blade per quadrant, centred on the flange azimuth; true-mapped panel `W` mm wide
 * centred on the blade axis. Pure line work: 4 nested border lines closing over a pointed-ogive
 * apex just under the lip; in the lower 0.6, a strip of tiny C-hooks and two columns of framed
 * squared spirals either side of a plain axis strip, ending in hooked terminals.
 * `vAt(y)` gives the panel v (mm of arc) at a height y.
 */
export function paintBlade(kit, panel, { vAt, pitch = 0.88, half = 11.3, yTop = 276, yApex = 305.5, yCols = 252 } = {}) {
  const W = panel.width
  const cx = W / 2
  const vTop = vAt(yTop), vApex = vAt(yApex), vCols = vAt(yCols)
  const lines = []
  // ogive: two circular arcs centred on the far side, meeting at the apex
  const h = vApex - vTop
  const Rg = (h * h + half * half) / (2 * half)
  const side = (d, sgn) => {
    // one side of the outline offset inward by d: straight up from v 0.4, then the arc to the axis
    const pts = [[cx + sgn * (half - d), 0.4], [cx + sgn * (half - d), vTop]]
    const c = [cx + sgn * (half - Rg), vTop]
    const r = Rg - d
    const phiEnd = Math.acos(Math.min(1, (Rg - half) / r))
    for (let i = 1; i <= 40; i++) {
      const ph = (phiEnd * i) / 40
      pts.push([c[0] + sgn * r * Math.cos(ph), c[1] + r * Math.sin(ph)])
    }
    return pts
  }
  const borders = [0.5, 1.48, 2.46, 3.44]
  for (const d of borders) {
    const L = side(d, -1), Rr = side(d, 1)
    lines.push(L.concat(Rr.slice().reverse()))
  }
  // columns of framed spirals
  const inner = half - borders[3] - 0.6 // inside the innermost border line
  const hookW = 1.55 // strip of tiny C-hooks
  const axis = 1.35 // half of the plain axis strip
  const colX0 = axis, colX1 = inner - hookW - 0.35
  const colW = colX1 - colX0
  const nCells = 12
  const v0 = 0.9
  for (const sgn of [-1, 1]) {
    const top = vCols + (sgn < 0 ? 1.4 : 0)
    const cellH = (top - v0 - 2.6) / nCells
    for (let i = 0; i < nCells; i++) {
      const x = sgn < 0 ? cx - colX1 : cx + colX0
      lines.push(rectSpiral(x, v0 + i * cellH + 0.17, colW, cellH - 0.34, pitch, { flip: (sgn < 0) !== (i % 2 === 0) }))
    }
    // hooked terminal: the column frame rises and curls toward the axis
    const xo = cx + sgn * colX1, xi = cx + sgn * (colX0 + 0.4)
    const yt = v0 + nCells * cellH
    lines.push([[xo, yt], [xo, yt + 2.6], [xi, yt + 2.6], [xi, yt + 1.2], [cx + sgn * (colX0 + colW * 0.5), yt + 1.2]])
    // C-hook strip just inside the border
    const xa = cx + sgn * (inner - 0.15), xb = cx + sgn * (inner - hookW)
    for (let v = v0; v < yt - 1.6; v += 2.05) {
      lines.push([[xa, v], [xb, v], [xb, v + 1.5], [xa - sgn * 0.55, v + 1.5]])
    }
    // the column frames continue as two lines up the blade and close in an inner ogive
  }
  for (const d of [borders[3] + 1.3, borders[3] + 2.3]) {
    const yt = vCols + 2.6
    const L = side(d, -1).filter((p) => p[1] >= yt), Rr = side(d, 1).filter((p) => p[1] >= yt)
    lines.push([[cx - (half - d), yt], ...L, ...Rr.slice().reverse(), [cx + (half - d), yt]])
  }
  incise(panel, lines, { width: 0.42, depth: 0.3 })
}

export { FLANGE_HALF }
