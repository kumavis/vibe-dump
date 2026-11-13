// Décor of the Met gu 1985.214.4, register by register, after reference/met-gu/dossier.md §c
// and the close-up photographs. Each painter draws into a ReliefPanel in panel mm.
//
// Half masks are authored in CREATURE space: X = developed mm outward from the
// nose-flange axis, v = mm of meridian arc up from the register bottom. The
// panel is laid on the wall 1:1 (lathe register `map: 'true'`), so X is true
// surface distance at every height and the foot's fan shape is the panel's own
// edge: hw(v) = quadrant width at v = nose flange → seam flange.

import { incise, flushBands, domeBoss, framedSpiral, framedRow, coilLine } from './lib.js'

const FLANGE_HALF = 2.6 // half of a 4.5–5 mm flange plus a hair: kept plain under every flange root

// ===================================================================== foot

/**
 * Foot register (y ≈ 21 → 78.2): one whole taotie per panel (nose on the panel centre line),
 * true-mapped, panel W = the widest (bottom) arc of the 180° sector. Authored in the dossier's
 * coordinates (v from y 25.5); the register now starts lower (detail-foot-front.jpg: the décor runs
 * down to just above the apron), so dossier v sits `DV` mm up the panel and the bottom border row
 * moves down with the panel edge.
 */
export function paintFoot(kit, panel, size, { pitch = 0.75, seed = 1 } = {}) {
  const { Turtle, band, rrect, circle, drawShape } = kit.shapes
  const W = panel.width, Hp = panel.height
  const cx = W / 2
  const hw = (v) => size.widthAt(Math.max(0, Math.min(Hp, v))) / 2 // nose axis → seam axis (mm), panel v
  const P = ([X, v]) => [cx - X, v]
  const DV = Math.max(0, Hp - 55.1) // dossier v → panel v
  const V = (v) => v + DV
  const bw = 3.3 // flat band width (dossier 2.8–3.5)
  const R = 1.0 // centre-line fillet → squared-round corners (fillet ≈ 0.6 mm at the band edge)
  const bands = []
  const coils = [] // round terminal coils: [centre (panel), R, a0, dir]
  const B = (t, w = bw, a = 'square', b = 'square') => bands.push(band(t.spine(0.3).map(P), w, a, b))
  const coil = (X, v, r, a0, dir) => { bands.push(circle(P([X, V(v)]), r)); coils.push([P([X, V(v)]), r, a0, dir]) }

  // --- jaw (detail-foot-halfmask.jpg): a compact C under the inner half of the eye, open toward the axis —
  //     the bottom bar starts at a short down-hook near the nose column, runs out, rises, and the top bar
  //     comes back in and winds down into a round coil (≈ 4.5 mm) in the mouth of the C
  B(new Turtle([9.6, V(1.2)], 90).to([9.6, V(3.6)]).turn(-90, R).to([22.6, V(3.6)]).turn(90, R).to([22.6, V(11.0)]).turn(90, R).to([16.0, V(11.0)]))
  coil(14.8, 8.1, 2.25, Math.PI / 2, -1)
  // --- leg / claw fragments below the outer side of the eye: two small T-hooks pointing at the axis
  B(new Turtle([30.6, V(1.0)], 90).to([30.6, V(9.8)]).turn(90, 0.9).fwd(3.0).turn(90, 0.6).fwd(1.6), 2.4)
  B(new Turtle([35.8, V(1.0)], 90).to([35.8, V(14.0)]).turn(90, 0.9).fwd(3.4).turn(90, 0.6).fwd(1.9), 2.4)
  // --- eye socket: flat rounded-square band field framing the boss
  const eye = [16.7, V(17.6)]
  bands.push(rrect(P(eye), 10.4, 8.8, 2.6))
  // --- ear: a round C just outside the eye, level with its top, opening downward (tail down the outer side)
  B(new Turtle([28.0, V(19.6)], 270).to([28.0, V(15.2)]), 2.2)
  coil(26.3, 19.8, 2.05, 0, 1)
  // --- crook horn: an open inverted J — the root rises on the outer side above the ear, the top bar runs
  //     under the separator toward the axis, the inner leg drops and ends in a tight round coil above the
  //     inner corner of the eye
  B(new Turtle([21.4, V(23.6)], 90).to([21.4, V(35.4)]).turn(90, R).to([11.0, V(35.4)]).turn(90, R).to([11.0, V(27.4)]), 3.4)
  coil(13.2, 25.6, 2.4, Math.PI, 1)
  // --- separate ㄱ quill just outside the horn's outer leg
  B(new Turtle([25.2, V(35.4)], 0).fwd(4.4).turn(-90, 0.9).fwd(6.4).turn(-90, 0.6).fwd(1.6), 2.4)
  // --- outer edge column (Ǝ): a spine parallel to the seam with bars hooking out toward it
  {
    const spine = (v) => hw(v) - 6.6
    const v0 = V(-1.0), v1 = V(36.0)
    const pts = []
    for (let v = v0; v <= v1 + 1e-6; v += 0.8) pts.push(P([spine(v), v]))
    bands.push(band(pts, 2.4, 'square', 'square'))
    for (const vb of [V(0.2), V(10.4), V(21.6), V(34.9)]) {
      const x0 = spine(vb), x1 = hw(vb) - FLANGE_HALF - 1.3
      B(new Turtle([x0, vb], 0).to([x1, vb]).turn(-90, 0.7).fwd(2.2), 2.1)
    }
  }
  // --- upper sub-band (v 40.5–53): a squared body/tail band looping out from beside the nose column
  B(new Turtle([9.4, V(42.6)], 90).to([9.4, V(50.9)]).turn(-90, R).to([29.0, V(50.9)]).turn(-90, R).to([29.0, V(46.4)]), 2.8)
  coil(26.6, 45.0, 1.9, 0, -1)
  // small C-hook at its outer top corner
  B(new Turtle([32.4, V(43.4)], 90).fwd(6.4).turn(-90, 0.8).fwd(2.0), 2.0)

  const paint = (ctx) => { for (const s of bands) drawShape(ctx, s) }
  flushBands(panel, paint, { lift: 0.28, lw: 0.48, groove: 0.4, shoulder: 0.05 })
  // the coil grooves: each terminal reads as the band winding into a tight round spiral
  incise(panel, coils.map(([c, r, a0, dir]) => coilLine(c, r - 0.55, { a0, dir, turns: 1.55, r1: 0.3 })), { width: 0.44, depth: 0.32 })

  // --- eye: rounded-square dome with a sunk horizontal slot pupil
  const eyeDraw = (ctx) => drawShape(ctx, rrect(P(eye), 6.0, 6.0, 1.8))
  domeBoss(panel, eyeDraw, { height: 1.9, radius: 3.0, wall: 0.45 })
  panel.sink((ctx) => drawShape(ctx, rrect(P(eye), 2.6, 1.35, 0.6)), { depth: 0.55, shoulder: 0.3, profile: 'u' })

  // --- framed leiwen: bottom border row, nose column, separator row, the two cells in the upper band's loop
  const cells = []
  const cellRects = []
  const addCells = (x0, y0, w, h, o) => {
    cells.push(...framedRow(x0, y0, w, h, { minPitch: pitch, turns: 2, ...o }))
    cellRects.push([x0, y0, w, h])
  }
  {
    const y0 = 0.7, h = 3.6
    const xl = cx - (hw(y0 + h) - FLANGE_HALF), xr = cx - FLANGE_HALF
    addCells(xl, y0, xr - xl, h, { count: Math.round((xr - xl) / 4.2) })
  }
  addCells(cx - 7.9, V(-1.6), 5.2, V(38.0) - V(-1.6), { count: 9, vertical: true, gap: 0.45 })
  {
    const y0 = V(38.2), h = 3.0
    const xl = cx - (hw(y0 + h) - FLANGE_HALF), xr = cx - 8.3
    addCells(xl, y0, xr - xl, h, { count: Math.round((xr - xl) / 3.9) })
  }
  addCells(cx - 24.4, V(42.6), 12.6, 6.4, { count: 2, gap: 0.6, turns: 2.5 })
  incise(panel, cells, { width: pitch * 0.55, depth: 0.3 })

  // --- free leiwen in whatever is left on the left half, inside the fan
  const fan = (ctx) => {
    ctx.beginPath()
    const top = V(53.4)
    ctx.moveTo(cx - FLANGE_HALF, 0.5)
    ctx.lineTo(cx - FLANGE_HALF, top)
    for (let v = top; v >= 0.5; v -= 1) ctx.lineTo(cx - (hw(v) - FLANGE_HALF), v)
    ctx.closePath()
    ctx.fill()
  }
  const avoid = (ctx) => {
    paint(ctx)
    eyeDraw(ctx)
    for (const [x, y, w, h] of cellRects) ctx.fillRect(x, y, w, h)
  }
  kit.leiwenFill(panel, { rect: { x: 0, y: 0, w: cx, h: Hp }, include: fan, avoid, margin: 0.5 }, {
    pitch, line: 0.5, depth: 0.3, roundness: 0.08, jitter: 0.05, cell: [2.4, 4.6], turns: 2, pairs: 0.3, fillers: true, follow: 0.25, seed,
  })
  panel.mirrorX()
  return { bands: bands.length }
}

// ===================================================================== waist

/**
 * Waist drum (y 95.0 → 146.4): one whole taotie per panel (2 sectors), cylinder 1:1.
 * Dossier §c.2 coordinates (X from the nose flange, v from y 96.5 = panel v − 1.5).
 * Broad flat bands with ONE echo groove (carving 'sparse'); spiral cells, not nested frames.
 * `variant` 'B' adds the fan of short vertical grooves inside the jaw scroll (taotie B only).
 */
export function paintWaist(kit, panel, size, { pitch = 0.85, seed = 2, variant = 'A' } = {}) {
  const { Turtle, band, rrect, circle, drawShape } = kit.shapes
  const W = panel.width, Hp = panel.height
  const cx = W / 2
  const hw = W / 2
  const o = 1.5 // décor starts 1.5 mm inside the drum ends
  const P = ([X, v]) => [cx - X, v + o]
  const bw = 3.0
  const R = 1.0
  const bands = []
  const coils = []
  const B = (t, w = bw) => bands.push(band(t.spine(0.3).map(P), w, 'square', 'square'))
  const coil = (X, v, r, a0, dir) => { bands.push(circle(P([X, v]), r)); coils.push([P([X, v]), r, a0, dir]) }
  const xs = hw - FLANGE_HALF // seam-side limit (X)

  // jaw: big squared C/G scroll under the eye; hooked tail toward the nose, the scroll runs out toward the
  // seam, rises, and turns back into a round coil (≈ 5 mm) at x ≈ 24, v ≈ 8
  B(new Turtle([9.8, 9.2], 270).to([6.6, 9.2]).turn(-90, 0.8).to([6.6, 3.0]).turn(90, R).to([28.8, 3.0]).turn(90, R)
    .to([28.8, 11.6]).turn(90, R).to([22.6, 11.6]))
  coil(23.6, 8.1, 2.5, Math.PI / 2, 1)
  // eye socket band around the boss
  const eye = [16.0, 16.5]
  bands.push(rrect(P(eye), 9.6, 8.6, 2.4))
  // crook horn: a broad band rising from above the eye, along the top border toward the nose,
  // ending in a round coil against the nose flange at the top
  B(new Turtle([18.8, 21.6], 90).to([18.8, 44.6]).turn(90, R).to([9.6, 44.6]))
  coil(7.0, 42.4, 2.75, Math.PI / 2, 1)
  // the drop along the nose flange below the horn spiral (brow / nose side), hooking toward the eye
  B(new Turtle([5.4, 38.2], 270).to([5.4, 21.6]).turn(90, R).to([10.4, 21.6]).turn(90, 0.7).fwd(1.8), 2.6)

  const paint = (ctx) => { for (const s of bands) drawShape(ctx, s) }
  flushBands(panel, paint, { lift: 0.35, lw: 0.46, groove: 0.38, echo: 1.25, shoulder: 0.05 })
  incise(panel, coils.map(([c, r, a0, dir]) => coilLine(c, r - 0.6, { a0, dir, turns: 1.7, r1: 0.3 })), { width: 0.44, depth: 0.32 })

  const eyeDraw = (ctx) => drawShape(ctx, rrect(P(eye), 6.0, 5.5, 2.3))
  domeBoss(panel, eyeDraw, { height: 2.0, radius: 2.9, wall: 0.45 })

  // framed spirals: 2 inside the horn loop, 3 against the seam flange
  const cells = []
  const cellRects = []
  const cellsIn = (X0, v0, w, h, opts) => {
    const [x, y] = P([X0 + w, v0])
    cells.push(...framedRow(x, y, w, h, { minPitch: pitch, turns: 3, ...opts }))
    cellRects.push([x, y, w, h])
  }
  cellsIn(8.4, 23.6, 7.6, 15.8, { count: 2, vertical: true, gap: 0.7, turns: 2.5 })
  cellsIn(22.6, 17.2, xs - 22.6, 30.2, { count: 3, vertical: true, gap: 0.8 })
  // B: fang / claw marks inside the jaw scroll
  if (variant === 'B') {
    const lines = []
    for (let i = 0; i < 5; i++) {
      const X = 9.4 + i * 1.75
      lines.push([P([X, 5.0]), P([X, 9.0])])
    }
    incise(panel, lines, { width: 0.45, depth: 0.32 })
    const [x, y] = P([18.6, 4.6])
    cellRects.push([x, y, 10.4, 5.0])
  }
  incise(panel, cells, { width: pitch * 0.52, depth: 0.3 })

  const avoid = (ctx) => {
    paint(ctx)
    eyeDraw(ctx)
    for (const [x, y, w, h] of cellRects) ctx.fillRect(x, y, w, h)
  }
  kit.leiwenFill(panel, { rect: { x: cx - xs, y: o, w: xs - FLANGE_HALF, h: Hp - 2 * o }, avoid, margin: 0.5 }, {
    pitch, line: 0.5, depth: 0.3, roundness: 0.08, jitter: 0.05, cell: [2.8, 5.0], turns: 2, pairs: 0.3, fillers: false, follow: 0.25, seed,
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
  const cells = framedSpiral(1.3, 2.4, 8.6, 8.8, { turns: 3.2, minPitch: pitch * 0.95 })
  // upper row of framed cells along the top line, lower framed cells between tail and head
  cells.push(...framedRow(10.4, 14.0, W - 11.2, 2.9, { minPitch: pitch * 0.8, turns: 1.2, count: 5 }))
  cells.push(...framedRow(10.4, 1.8, W - 24.6, 5.0, { minPitch: pitch * 0.85, turns: 2, count: 2 }))
  incise(panel, cells, { width: pitch * 0.48, depth: 0.28 })
  // the photographs show no bare ground in this frieze: fine leiwen packs every leftover
  const avoid = (ctx) => {
    paint(ctx)
    ringPaint(ctx)
    ctx.fillRect(1.0, 2.1, 9.2, 9.4)
    ctx.fillRect(10.2, 13.8, W - 10.8, 3.3)
    ctx.fillRect(10.2, 1.6, W - 24.2, 5.4)
  }
  kit.leiwenFill(panel, { rect: { x: 0.9, y: 1.15, w: W - 1.8, h: H - 2.3 }, avoid, margin: 0.3 }, {
    pitch: pitch * 0.85, line: 0.5, depth: 0.26, roundness: 0.08, jitter: 0.05, cell: [2.2, 4.4], pairs: 0.4, seed,
  })
}

// ===================================================================== blades

/**
 * One rising blade per quadrant, centred on the flange azimuth; true-mapped panel `W` mm wide
 * centred on the blade axis. Pure line work: 4 nested border lines closing over a pointed-ogive
 * apex just under the lip; in the lower 0.6, a strip of tiny C-hooks and two columns of framed
 * squared spirals either side of a plain axis strip, ending in hooked terminals.
 * `vAt(y)` gives the panel v (mm of arc) at a height y.
 */
export function paintBlade(kit, panel, { vAt, pitch = 0.88, half = 11.3, halfBase = 13.9, yTop = 276, yApex = 305.5, yCols = 252 } = {}) {
  const W = panel.width
  const cx = W / 2
  const vTop = vAt(yTop), vApex = vAt(yApex), vCols = vAt(yCols)
  // detail-blade.jpg: at the neck the blade nearly fills the 28.6 mm quadrant (two columns of ≈ 6.5 mm
  // spiral cells + hook strips + 4 border lines), narrowing to the dossier's ≈ 22.6 mm under the ogive
  const hAt = (v) => halfBase + (half - halfBase) * Math.min(1, Math.max(0, v / vTop))
  const lines = []
  // ogive: two circular arcs centred on the far side, meeting at the apex
  const h = vApex - vTop
  const Rg = (h * h + half * half) / (2 * half)
  const side = (d, sgn) => {
    // one side of the outline offset inward by d: tapering up from v 0.4, then the arc to the axis
    const pts = [[cx + sgn * (hAt(0.4) - d), 0.4], [cx + sgn * (half - d), vTop]]
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
  // columns of framed squared spirals (each cell its own 雷纹, 3–4 turns)
  const inner = (v) => hAt(v) - borders[3] - 0.6 // inside the innermost border line
  const hookW = 2.0 // strip of tiny C-hooks
  const axis = 0.55 // half of the narrow axis strip (one line between the columns in the photograph)
  const colX0 = axis
  const colX1 = (v) => inner(v) - hookW - 0.35
  const nCells = 13
  const v0 = 0.9
  lines.push([[cx, v0], [cx, vCols - 1.0]])
  for (const sgn of [-1, 1]) {
    // the two column tops are staggered by ≈ 3.5 mm (detail-blade.jpg)
    const top = vCols + (sgn < 0 ? 1.8 : -1.8)
    const cellH = (top - v0 - 2.6) / nCells
    for (let i = 0; i < nCells; i++) {
      const vm = v0 + (i + 0.5) * cellH
      const colW = colX1(vm) - colX0
      const x = sgn < 0 ? cx - colX1(vm) : cx + colX0
      // each cell an open framed squared spiral, 2.5 turns with a lead-in, alternating hand down the column
      lines.push(...framedSpiral(x, v0 + i * cellH + 0.2, colW, cellH - 0.4, { turns: 2.5, minPitch: pitch * 0.95, flip: (sgn < 0) !== (i % 2 === 0), rot: i % 2 ? 2 : 0 }))
    }
    // hooked T terminal: the column frame rises into a bar that hooks down toward the axis and curls in
    const yt = v0 + nCells * cellH
    const c1 = colX1(yt)
    const xo = cx + sgn * c1, xi = cx + sgn * (colX0 + 0.4), xm = cx + sgn * (colX0 + (c1 - colX0) * 0.5)
    lines.push([[xo, yt], [xo, yt + 3.0], [xi, yt + 3.0], [xi, yt + 0.9], [xm, yt + 0.9], [xm, yt + 2.0]])
    // strip of tiny C-hooks (≈ 2 mm cells) just inside the border lines, up to the column top
    for (let v = v0; v < yt + 1.0; v += 2.1) {
      const xa = cx + sgn * (inner(v) - 0.1), xb = cx + sgn * (inner(v) - hookW)
      const xc = cx + sgn * (inner(v) - hookW * 0.45)
      lines.push([[xa, v], [xb, v], [xb, v + 1.55], [xa, v + 1.55], [xa, v + 0.75], [xc, v + 0.75]])
    }
  }
  for (const d of [borders[3] + 1.3, borders[3] + 2.3]) {
    const yt = vCols + 2.6
    const L = side(d, -1).filter((p) => p[1] >= yt), Rr = side(d, 1).filter((p) => p[1] >= yt)
    lines.push([[cx - (half - d), yt], ...L, ...Rr.slice().reverse(), [cx + (half - d), yt]])
  }
  incise(panel, lines, { width: 0.42, depth: 0.3 })
}

export { FLANGE_HALF }
