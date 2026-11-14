// Houmuwu ding — leg masks and handle faces (dossier §c.5, §c.6).

import { LEVELS, GROUND, style, sheet, sq, render, rect, inset } from './draw.js'

// --------------------------------------------------------------------------
// Leg mask (§c.5; detail-leg-b / -c): V-b sculptural, 6.5 mm plateaus and 10 mm eye, single
// contour line, centred on the leg's outward diagonal flange. NO plaque: the mask's parts stand
// free on the cylinder and the leiwen ground fills only a soft envelope hugging them, so the zone
// has no straight vertical border. Per half (x from the flange axis, y from the zone bottom):
// a broad crescent ram horn from beside the flange out along the top to an upturned tip, its root
// curling down into a tight spiral above-inside the eye (≈ 0.3, 0.66); an oval eye ≈ 30 × 24 with
// a ring pupil at (0.35, 0.45); a hollow C ear outside it (0.7, 0.5); an upper lip hooking up
// under the eye; and a big S jaw leaving the axis bottom and curling outward into a spiral.

export function legPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = new kit.ReliefPanel({ width: W, height: H, ppmm, seed })
  const cx = W / 2
  const half = rect(0, 0, cx, H)
  // author in mm from the flange axis (x) and from the zone bottom (y); the half-mask is ≈ 150 wide
  // compact: the mask keeps ≈ 0.9 of the half-zone, so the cylinder shows plain beyond it (leg-c)
  const k = (Math.min(cx - 4, 150) / 150) * 0.9
  const X = (dx) => dx * k
  const Yf = (f) => f * H
  const P = style(LEVELS.leg, { lineWeight: 1.1, echoInset: 2.6 })
  const s = kit.shapes
  // HORN: a broad crescent (≈ 42 at the root → a point), leiwen packed on its plateau (leg-b)
  const Sh = sheet(kit, half, { flip: true, seed, wobble: 0.4 })
  const hornTop = s.spline([[X(5), H - 9], [X(50), H - 7], [X(95), H - 6], [X(124), H - 5]], 1)
  const hornBot = s.spline([[X(128), H - 12], [X(112), H - 30], [X(80), H - 44], [X(40), H - 51], [X(5), H - 50]], 1)
  Sh.poly([...hornTop, ...hornBot])
  render(kit, panel, Sh, P, half)
  kit.leiwenFillMask(panel, kit.companions.plateauPaint(Sh, kit.companions.rectClip(half)), { ...GROUND, cell: [8, 14], turns: 3, seed: seed + 3 }, { margin: 4.5, level: LEVELS.leg.motif })
  const S = sheet(kit, half, { flip: true, seed: seed + 1, wobble: 0.4 })
  // the horn's outer end turns down and back (leg-b, leg-c)
  S.taper(sq(kit, [[X(118), H - 12], [X(128), H - 30], [X(124), H - 44], [X(104), H - 50]], 6), 15, 9, 0.4)
  // horn root curling down into a tight spiral above-inside the eye
  const yc = Yf(0.66)
  S.taper([[X(24), H - 46], [X(24), yc + 2], ...s.cScroll([X(24) + 15, yc], 15, { start: 180, sweep: 450, dir: 1, shrink: 0.2, step: 0.6 })], 19, 9, 0.35)
  // eye: oval boss ≈ 30 × 24 with a sunk ring pupil — free-standing
  const eyeY = Yf(0.45)
  S.boss([X(54), eyeY], 15, { kind: 'oval', aspect: 1.25, base: 'ground', pupil: 'ring' })
  // ear: a hollow-centred C outside the eye, open toward the axis
  S.taper(s.arcPts([X(106), eyeY + 6], 18, 140, -150, 0.6), 17, 13)
  // upper lip: from the axis under the eye, ending in a hook up toward the ear
  const yLip = eyeY - 29
  S.band(sq(kit, [[X(8), yLip], [X(80), yLip], [X(80), yLip + 14], [X(90), yLip + 14]], 5), 15)
  // jaw: a big S-band leaving the axis bottom and curling outward into a spiral
  S.taper([...s.spline([[X(6), Yf(0.09)], [X(50), Yf(0.075)], [X(92), Yf(0.11)]], 0.8), ...s.cScroll([X(100), Yf(0.2)], 20, { start: -110, sweep: 400, dir: 1, shrink: 0.2, step: 0.6 })], 24, 11, 0.4)
  render(kit, panel, S, P, half)
  // leiwen only inside a rounded envelope hugging the mask (panel x = cx − dx)
  const env = s.spline([[X(0), H - 2], [X(70), H - 2], [X(128), H - 2], [X(140), H - 24], [X(140), Yf(0.62)], [X(136), Yf(0.3)], [X(124), Yf(0.06)], [X(90), 3], [X(0), 3]], 1)
  kit.leiwenFill(panel, {
    rect: inset(half, 2, 2, 6, 2),
    include: (ctx) => { ctx.beginPath(); env.forEach(([x, y], i) => (i ? ctx.lineTo(cx - x, y) : ctx.moveTo(cx - x, y))); ctx.closePath(); ctx.fill() },
    avoid: 'raised', margin: 0.8,
  }, { ...GROUND, seed })
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
  // The tiger fills ≈ 80 % of the upright (detail-handle-front.jpg): body x 5 → bar − 6
  const bx0 = 5, bx1 = bar - 6, by0 = 34, by1 = yTop + 14
  // HEAD (upper outer corner): a big C-scroll ear filling the corner, a domed eye Ø 22 on the
  // top bar ≈ 70 from the axis, open jaws reaching for the human head
  S.taper(s.cScroll([34, H - 36], 25, { start: 250, sweep: -600, dir: -1, shrink: 0.24, step: 0.8 }), 13, 6, 0.45)
  S.boss([cx - 70, H - 32], 11, { kind: 'round', base: 'ground', pupil: 'none' })
  S.taper(s.spline([[cx - 58, H - 14], [cx - 36, H - 11], [cx - 26, H - 22], [cx - 28, hy + 20]], 0.8), 11, 6, 0.4) // upper jaw
  S.taper(s.spline([[cx - 60, H - 52], [cx - 42, H - 60], [cx - 30, hy + 2], [cx - 36, hy - 6]], 0.8), 10, 5, 0.4) // lower jaw
  // BODY: one broad plateau down the upright, back on the outer edge, haunch and shoulder
  // bulging toward the aperture
  S.poly(sq(kit, [[bx0, by1 + 12], [bx1 - 8, by1 + 6], [bx1, by1 - 18], [bx1 - 3, 140], [bx1 + 1, 110], [bx1 - 4, 80], [bx1, 50], [bx1 - 6, by0], [bx0 + 6, by0 - 6], [bx0, by0 + 10]], 7))
  // FORELEG and HIND LEG: round lobes on the aperture side with three claw hooks
  const lobe = (y) => {
    S.circle([bx1 - 12, y], 14)
    for (const [dx, dy] of [[-7, -12], [-2, -9], [2, -4]]) S.taper(sq(kit, [[bx1 - 6, y - 6], [bx1 + dx, y + dy - 6], [bx1 + dx - 4, y + dy - 9]], 1.5), 6, 3.5, 0.3)
  }
  lobe(160)
  lobe(72)
  // TAIL: curls up at the foot, just above the collar
  S.taper(s.cScroll([24, 24], 13, { start: 0, sweep: 430, dir: 1, shrink: 0.3, step: 0.6 }), 10, 5, 0.4)
  // STRIPES: dense rows of C-hooks incised across the whole body, alternating hand and offset
  const rows = 14
  for (let i = 0; i < rows; i++) {
    const y = by0 + 8 + i * ((by1 - by0 - 10) / (rows - 1))
    const o = i % 2 ? 9 : 0
    const hd = i % 2 ? -1 : 1
    for (let x = bx0 + 7 + o * 0.8; x + 6 < bx1 - 2; x += 15) {
      S.line(s.cScroll([x, y], 5.2, { start: hd > 0 ? 70 : 110, sweep: 300, dir: hd, shrink: 0.22, step: 0.5 }), 1.8)
    }
  }
  // shoulder and haunch: bold curls carved on the body at the leg roots
  for (const y of [160, 72]) S.line(s.cScroll([bx1 - 18, y], 13, { start: 90, sweep: 560, dir: -1, shrink: 0.12, step: 0.5 }), 2)
  render(kit, panel, S, P, half)
  // S-scrolls flanking the head's crest along the top bar
  const Sc = sheet(kit, half, { seed: seed + 2 })
  Sc.taper(s.cScroll([cx - 30, H - 34], 8, { start: 200, sweep: -300, dir: -1, shrink: 0.3, step: 0.6 }), 6, 4, 0.4)
  render(kit, panel, Sc, P, null)
  panel.fillGround({ ...GROUND, cell: [8, 16], seed: seed + 1 }, { rect: inset(half, 3, 3, 0, 3), margin: 0.7 })
  panel.mirrorX()
  // HUMAN HEAD: frontal, 40 × 50, modelled in the round and projecting ≈ 17, a small crest above
  const hc = [cx, hy]
  const round = (sh) => (d) => (d <= 0 ? 0 : Math.sin(Math.min(1, d / sh) * Math.PI / 2))
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.ellipse(hc[0], hc[1], 21, 26, 0, 0, Math.PI * 2)
    ctx.fill()
  }, { height: 18, profile: round(12) })
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.ellipse(hc[0], hc[1] + 30, 11, 8, 0, 0, Math.PI * 2) // small rounded crest above the head
    ctx.fill()
  }, { height: 6, profile: round(5) })
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
