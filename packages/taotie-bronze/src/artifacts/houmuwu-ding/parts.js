// Houmuwu ding — leg masks and handle faces (dossier §c.5, §c.6).

import { LEVELS, GROUND, style, sheet, sq, render, rect, inset } from './draw.js'

// --------------------------------------------------------------------------
// Leg mask (§c.5): V-b sculptural, 6–10 mm high relief, single contour line,
// centred on the leg's outward diagonal flange. Ram horn (inward curl) across
// the top, oval boss eye with a sunk ring, C-ear outside it, an S-band jaw
// curling out below. Leiwen only in the leftovers (and packed on the horn).

export function legPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const cx = W / 2
  const half = rect(0, 0, cx, H)
  // author in mm from the flange axis (x) and from the zone bottom (y); the half-mask is ≈ 150 wide
  const k = Math.min(cx - 4, 150) / 150
  const X = (dx) => dx * k
  const Yf = (f) => f * H
  const P = style(LEVELS.leg, { lineWeight: 1.1, echoInset: 2.6 })
  const s = kit.shapes
  // horn (H2 ram, inward curl), a BROAD band (26 → 18): out along the top edge from beside the
  // flange, down the outer side, back toward the axis and curling down into a tight spiral
  // above and inside the eye. Its plateau carries packed spirals (leg-c, rubbing).
  const yTop = H - 23, yRet = Yf(0.69)
  const Sh = sheet(kit, half, { flip: true, seed, wobble: 0.4 })
  Sh.taper(sq(kit, [[X(14), yTop], [X(136), yTop], [X(136), yRet], [X(30), yRet], [X(30), yRet - 30], [X(68), yRet - 30], [X(68), yRet - 16]], 7), 32, 19, 0.3)
  render(kit, panel, Sh, P, half)
  kit.leiwenFillMask(panel, kit.companions.plateauPaint(Sh, kit.companions.rectClip(half)), { ...GROUND, cell: [8, 14], turns: 3, seed: seed + 3 }, { margin: 4.5, level: LEVELS.leg.motif })
  const S = sheet(kit, half, { flip: true, seed: seed + 1, wobble: 0.4 })
  // eye: oval boss ≈ 30 × 24 with a sunk ring pupil — free-standing, no bar to the flange
  const eyeY = yRet - 30 - 7 - 4 - 12
  S.boss([X(54), eyeY], 12.5, { kind: 'oval', aspect: 1.25, base: 'ground', pupil: 'ring' })
  // ear: a hollow-centred C outside the eye, open toward the axis
  S.taper(s.arcPts([X(112), eyeY + 4], 17, 150, -150, 0.6), 17, 14)
  // upper lip: from the axis under the eye, stepping down, ending in a hook
  const yLip = eyeY - 30
  S.band(sq(kit, [[X(10), yLip], [X(76), yLip], [X(76), yLip + 13], [X(84), yLip + 13]], 5), 17)
  // jaw: a big S-band leaving the axis bottom and curling outward into a spiral
  S.taper(s.spline([[X(8), Yf(0.08)], [X(56), Yf(0.07)], [X(104), Yf(0.1)], [X(132), Yf(0.2)], [X(130), Yf(0.31)], [X(112), Yf(0.31)], [X(106), Yf(0.22)], [X(116), Yf(0.19)]], 0.8), 24, 12, 0.45)
  render(kit, panel, S, P, half)
  panel.fillGround({ ...GROUND, seed }, { rect: inset(half, 3, 3, 9, 3), margin: 0.8 })
  panel.mirrorX()
  return panel.bake()
}

// --------------------------------------------------------------------------
// Handle outer face (§c.6): two tigers in profile, a mirror pair, heads in the
// upper outer corners (C-scroll ear in the corner, domed boss eye ≈ 55 from the
// axis), open jaws toward the centre where a frontal human head sits in the
// round right above the aperture; each body runs down one upright, back on the
// outer edge, striped with C-hooks; a foreleg and a hind leg toward the
// aperture; the tail curls up just above the root collar. Leiwen ground.

export function handleOuterPanel(kit, L, { ppmm, seed, bar, barTop }) {
  const W = L.outer.w, H = L.outer.h
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const cx = W / 2
  const s = kit.shapes
  const P = style(LEVELS.handle, { lineWeight: 1.1, echoInset: 2.0 })
  const half = rect(0, 0, cx, H)
  const S = sheet(kit, half, { seed, wobble: 0.3 })
  const yTop = H - barTop // aperture top
  const hy = yTop + 30 // human head centre
  const xi = bar - 6 // aperture-side limit of the tiger's legs
  // HEAD (upper outer corner): a big C-scroll ear filling the corner, a domed eye Ø 22
  // 60 from the axis and 30 below the top edge, open jaws reaching for the human head
  S.taper(s.cScroll([38, H - 40], 27, { start: 280, sweep: -610, dir: -1, shrink: 0.28, step: 0.8 }), 12, 6, 0.45)
  S.boss([cx - 60, H - 30], 11, { kind: 'round', base: 'ground', pupil: 'none' })
  S.taper(s.spline([[cx - 50, H - 14], [cx - 30, H - 12], [cx - 22, H - 24], [cx - 26, hy + 18]], 0.8), 10, 5, 0.4) // upper jaw
  S.taper(s.spline([[cx - 52, H - 48], [cx - 36, H - 54], [cx - 28, hy + 2], [cx - 34, hy - 4]], 0.8), 9, 5, 0.4) // lower jaw
  // BODY: a broad plateau down the outer half of the upright, back on the outer edge
  const bx0 = 5, bx1 = 50, by0 = 46, by1 = H - 70
  S.poly(sq(kit, [[bx0, by1], [bx1 - 4, by1 + 6], [bx1, by1 - 30], [bx1 + 4, (by0 + by1) / 2], [bx1, by0 + 20], [bx1 - 6, by0], [bx0, by0]], 6))
  // FORELEG at ≈ 50 % of the upright, HIND LEG at ≈ 25 %, both toward the aperture, 3 claws each
  const leg = (y0, y1, y2) => {
    S.taper(sq(kit, [[bx1 - 10, y0], [xi - 10, y1], [xi - 10, y2]], 6), 20, 14, 0.4)
    // paw: a small curl with three claw hooks
    S.taper(s.cScroll([xi - 10, y2 - 4], 6, { start: 90, sweep: 300, dir: 1, shrink: 0.3, step: 0.5 }), 5, 3, 0.4)
    for (const [dx, dy] of [[-12, -8], [-2, -12], [7, -6]]) S.taper(sq(kit, [[xi - 10 + dx * 0.4, y2 - 2], [xi - 10 + dx, y2 + dy], [xi - 10 + dx + 4, y2 + dy - 3]], 2), 6, 3.5, 0.3)
  }
  leg(150, 136, 110)
  S.circle([bx1 - 6, 82], 17) // haunch
  leg(80, 66, 42)
  // TAIL: curls up just above the collar
  S.taper(s.cScroll([22, 30], 15, { start: 0, sweep: 420, dir: 1, shrink: 0.35, step: 0.6 }), 9, 5, 0.4)
  // stripes: 7 rows of C-hooks incised across the back, opening toward the aperture
  for (let i = 0; i < 7; i++) {
    const y = by0 + 22 + i * ((by1 - by0 - 34) / 6)
    S.line(sq(kit, [[bx1 - 6, y + 6], [bx0 + 7, y + 6], [bx0 + 7, y - 5], [bx0 + 28, y - 5], [bx0 + 28, y + 1]], 1.6), 2.0)
    S.line(sq(kit, [[bx1 - 4, y - 1], [bx0 + 34, y - 1], [bx0 + 34, y - 6]], 1.2), 1.6)
  }
  S.line(s.cScroll([bx1 - 6, 82], 10, { start: 90, sweep: 330, dir: -1, shrink: 0.35, step: 0.6 }), 1.4)
  render(kit, panel, S, P, half)
  // S-scrolls flanking the head's crest along the top bar
  const Sc = sheet(kit, half, { seed: seed + 2 })
  Sc.taper(s.cScroll([cx - 28, H - 32], 9, { start: 200, sweep: -300, dir: -1, shrink: 0.3, step: 0.6 }), 6, 4, 0.4)
  render(kit, panel, Sc, P, null)
  panel.fillGround({ ...GROUND, seed: seed + 1 }, { rect: inset(half, 3, 3, 0, 3), margin: 0.7 })
  panel.mirrorX()
  // HUMAN HEAD: frontal, 40 × 50, modelled in the round and projecting ≈ 17, a small crest above
  const hc = [cx, hy]
  const round = (sh) => (d) => (d <= 0 ? 0 : Math.sin(Math.min(1, d / sh) * Math.PI / 2))
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.ellipse(hc[0], hc[1], 20, 25, 0, 0, Math.PI * 2)
    ctx.fill()
  }, { height: 17, profile: round(11) })
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.moveTo(hc[0] - 14, hc[1] + 24); ctx.lineTo(hc[0] + 14, hc[1] + 24); ctx.lineTo(hc[0] + 9, hc[1] + 44); ctx.lineTo(hc[0] - 9, hc[1] + 44)
    ctx.closePath(); ctx.fill()
  }, { height: 7, profile: round(3) })
  panel.add((ctx) => {
    ctx.beginPath()
    ctx.ellipse(hc[0], hc[1] + 1, 3.2, 7, 0, 0, Math.PI * 2) // nose
    ctx.fill()
    for (const sx of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(hc[0] + sx * 19, hc[1] + 3, 3, 7, 0, 0, Math.PI * 2) // ears
      ctx.fill()
    }
  }, { height: 3, profile: 'dome' })
  panel.sink((ctx) => {
    for (const sx of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(hc[0] + sx * 7.5, hc[1] + 7, 3.8, 2.4, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.lineWidth = 1.6
    ctx.beginPath()
    ctx.moveTo(hc[0] - 12, hc[1] + 12); ctx.quadraticCurveTo(hc[0] - 7, hc[1] + 15, hc[0] - 2, hc[1] + 12)
    ctx.moveTo(hc[0] + 2, hc[1] + 12); ctx.quadraticCurveTo(hc[0] + 7, hc[1] + 15, hc[0] + 12, hc[1] + 12)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(hc[0] - 8, hc[1] - 10); ctx.quadraticCurveTo(hc[0], hc[1] - 14, hc[0] + 8, hc[1] - 10)
    ctx.stroke()
  }, { depth: 2, shoulder: 0.8, profile: 'u' })
  return panel.bake()
}

// Handle edges (§c.6): fish 鱼纹 stacked along each upright, heads up, on leiwen.
export function handleEdgePanel(kit, L, { ppmm, seed }) {
  const W = L.edge.w, H = L.edge.h
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const P = style(LEVELS.handle, { lineWeight: 0.8, echoInset: 1.8, relief: { motif: 3.2, boss: 6, groove: 0.7 } })
  const legL = L.edge.legLength
  const fishLen = Math.min(118, (legL - 20) / 2)
  const units = [
    [14, 1], [14 + fishLen + 8, 1], // left upright, heads up (+x)
    [W - 14 - fishLen, -1], [W - 22 - 2 * fishLen, -1], // right upright, heads up (−x)
  ]
  for (const [x, dir] of units) {
    const r = rect(x, 10, fishLen, H - 20)
    const S = sheet(kit, r, { seed: seed + x, flip: dir < 0 })
    fish(kit, S, fishLen, H - 20)
    render(kit, panel, S, P, r)
  }
  // over the top: a pair of fish confronted at the middle
  const mid = W / 2, tl = Math.min(110, (W - 2 * legL) / 2 - 10)
  for (const dir of [1, -1]) {
    const r = rect(dir > 0 ? mid - 4 - tl : mid + 4, 14, tl, H - 28)
    const S = sheet(kit, r, { seed: seed + 9 + dir, flip: dir < 0 })
    fish(kit, S, tl, H - 28)
    render(kit, panel, S, P, r)
  }
  panel.fillGround({ ...GROUND, seed }, { rect: inset(rect(0, 0, W, H), 4), margin: 0.7 })
  return panel.bake()
}

/** A fish facing +x in a (len × h) box: spindle body, eye boss, dorsal and ventral fins, forked tail. */
function fish(kit, S, len, h) {
  const cy = h / 2
  const body = []
  const n = 20
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = len * (0.2 + 0.78 * t)
    body.push([x, cy + h * 0.3 * Math.sin(Math.PI * Math.pow(t, 0.75))])
  }
  for (let i = n; i >= 0; i--) {
    const t = i / n
    const x = len * (0.2 + 0.78 * t)
    body.push([x, cy - h * 0.28 * Math.sin(Math.PI * Math.pow(t, 0.75))])
  }
  S.poly(body)
  // tail
  S.poly([[len * 0.24, cy], [len * 0.02, cy + h * 0.36], [len * 0.12, cy + h * 0.06], [len * 0.12, cy - h * 0.06], [len * 0.02, cy - h * 0.36]])
  // fins
  S.taper(sq(kit, [[len * 0.55, cy + h * 0.24], [len * 0.42, cy + h * 0.44], [len * 0.36, cy + h * 0.4]], 3), 8, 4, 0.4)
  S.taper(sq(kit, [[len * 0.6, cy - h * 0.22], [len * 0.48, cy - h * 0.42], [len * 0.42, cy - h * 0.38]], 3), 8, 4, 0.4)
  // gill and scale marks
  S.line(sq(kit, [[len * 0.78, cy + h * 0.22], [len * 0.72, cy], [len * 0.78, cy - h * 0.22]], 3), 1)
  for (let x = len * 0.36; x < len * 0.68; x += len * 0.09) S.line([[x + 4, cy + h * 0.12], [x, cy], [x + 4, cy - h * 0.12]], 0.9)
  S.boss([len * 0.86, cy + h * 0.04], h * 0.07, { kind: 'round', base: 'plateau', pupil: 'none' })
}

// Root blocks (§c.6): a plain raised collar band at rim-top level, then a small
// mask on the rim face: ribbed crescent ox horns, two ring-eyes, scrolls below.
export function handleRootPanel(kit, L, { ppmm, seed, rimH }) {
  const W = L.root.w, H = L.root.h
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const P = style(LEVELS.handle, { lineWeight: 1.0, echoInset: 1.6, relief: { motif: 4.5, boss: 6.5, groove: 0.8 } })
  const cx = W / 2
  const s = kit.shapes
  // collar band
  panel.raise((ctx) => ctx.fillRect(1.5, rimH + 1, W - 3, H - rimH - 2.5), { height: 3, shoulder: 0.8 })
  const half = rect(0, 0, cx, rimH)
  const S = sheet(kit, half, { seed })
  // crescent horn ≈ 15 thick, ribbed, sweeping out and up from the centre to the outer edge
  const top = [], bot = []
  const n = 18
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = cx - 2 - t * (cx - 4)
    top.push([x, rimH - 5 - 5 * (1 - t) * (1 - t)])
    bot.push([x, rimH - 23 + 14 * t * t])
  }
  S.poly([...top, ...bot.slice().reverse()])
  for (let k = 1; k <= 6; k++) {
    const i = Math.round((k / 7) * n)
    S.line([[top[i][0], top[i][1] - 2.5], [bot[i][0], bot[i][1] + 2.5]], 1.3)
  }
  // ring eye Ø 12 (sunk ring and dot) and a smaller ring below-outside
  S.boss([cx - 14, rimH * 0.47], 7.5, { kind: 'round', base: 'ground', pupil: 'ring' })
  S.boss([cx - 34, rimH * 0.3], 5, { kind: 'round', base: 'ground', pupil: 'ring' })
  // scrolls beneath
  S.taper(s.cScroll([cx - 9, 9], 5.5, { start: 180, sweep: -300, dir: -1, shrink: 0.3, step: 0.5 }), 4.5, 3, 0.4)
  S.taper(s.cScroll([cx - 28, 8], 5, { start: 0, sweep: 300, dir: 1, shrink: 0.3, step: 0.5 }), 4.5, 3, 0.4)
  render(kit, panel, S, P, half)
  panel.fillGround({ ...GROUND, cell: [6, 12], turns: 3, seed }, { rect: inset(half, 2, 2, 0, 2), margin: 0.6 })
  panel.mirrorX(rect(0, 0, W, rimH))
  return panel.bake()
}
