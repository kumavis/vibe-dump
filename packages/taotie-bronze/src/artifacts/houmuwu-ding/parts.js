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
  const hw = Math.min(cx - 4, 158) // half-mask width (mm of arc from the flange axis)
  const k = hw / 154
  const X = (dx) => dx * k
  const P = style(LEVELS.leg, { lineWeight: 1.1, echoInset: 2.6 })
  const s = kit.shapes
  // horn: broad band along the top from the flange, down the outer side, back in to a spiral above the eye;
  // its plateau carries packed spirals (V-a), as on the object
  const Sh = sheet(kit, half, { flip: true, seed })
  Sh.taper(sq(kit, [[X(13), H - 16], [X(140), H - 16], [X(140), H - 84], [X(72), H - 84], [X(72), H - 50], [X(104), H - 50], [X(104), H - 64]], 16), 38, 20, 0.35)
  render(kit, panel, Sh, P, half)
  kit.leiwenFillMask(panel, kit.companions.plateauPaint(Sh, kit.companions.rectClip(half)), { ...GROUND, seed: seed + 3 }, { margin: 6, level: LEVELS.leg.motif })
  const S = sheet(kit, half, { flip: true, seed: seed + 1 })
  // eye: rounded-square boss with a sunk slit, joined to the flange by a canthus band
  S.boss([X(62), H * 0.42], 15, { kind: 'square', base: 'plateau', pupil: 'slit' })
  S.band(sq(kit, [[X(50), H * 0.42 + 2], [X(10), H * 0.42 + 2], [X(10), H * 0.42 + 18]], 4), 17)
  // ear: C plateau outside the eye, open outward, with a hollow centre
  S.band(sq(kit, [[X(150), H * 0.6], [X(96), H * 0.6], [X(96), H * 0.3], [X(150), H * 0.3]], 8), 21)
  S.band([[X(118), H * 0.5], [X(118), H * 0.4]], 8)
  // lip below the eye
  S.band(sq(kit, [[X(10), H * 0.27], [X(74), H * 0.27], [X(74), H * 0.2]], 5), 15)
  // jaw: a big S-band leaving the axis bottom and curling outward into a spiral
  const jaw = s.spline([[X(8), 18], [X(60), 13], [X(104), 18], [X(126), 34], [X(116), 52], [X(96), 50], [X(94), 36], [X(104), 32]], 0.8)
  S.taper(jaw, 24, 12, 0.45)
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
  const P = style(LEVELS.handle, { lineWeight: 0.9, echoInset: 2.0 })
  const half = rect(0, 0, cx, H)
  const S = sheet(kit, half, { seed })
  const yTop = H - barTop // aperture top
  const hy = yTop + 26 // human head centre
  // tiger head: big round C-scroll ear in the outer corner, domed boss eye, open jaws toward the human head
  S.taper(s.cScroll([32, H - 54], 26, { start: 250, sweep: -560, dir: -1, shrink: 0.2, step: 0.8 }), 9, 6, 0.5)
  S.boss([cx - 57, H - 60], 11, { kind: 'round', base: 'ground', pupil: 'none' })
  S.taper(s.spline([[cx - 78, H - 16], [cx - 44, H - 12], [cx - 26, H - 20], [cx - 24, H - 40], [cx - 32, hy + 4], [cx - 26, hy - 14], [cx - 18, hy - 12]], 0.8), 11, 5, 0.5)
  S.taper(s.spline([[cx - 70, H - 80], [cx - 44, H - 86], [cx - 36, yTop + 8], [cx - 44, yTop + 4]], 0.8), 9, 4, 0.5)
  // body: down the upright, back on the outer edge, striped with chevron C-hooks
  const body = s.spline([[46, H - 82], [36, yTop - 30], [32, 120], [30, 64], [26, 34]], 1)
  S.taper(body, 44, 30, 0.2)
  for (let y = yTop - 22; y > 52; y -= 9) S.line(sq(kit, [[14, y + 3], [14, y - 2], [44, y - 2], [44, y + 2]], 1.5), 1.1)
  // shoulder and foreleg, haunch and hind leg, toward the aperture; claws curled
  S.circle([60, yTop - 46], 15)
  S.taper(sq(kit, [[64, yTop - 52], [bar - 10, yTop - 76], [bar - 10, yTop - 96], [bar - 22, yTop - 96]], 5), 13, 6, 0.5)
  S.circle([58, 86], 16)
  S.line(s.cScroll([58, 86], 9, { start: 90, sweep: 300, dir: -1, shrink: 0.3, step: 0.6 }), 1.2)
  S.taper(sq(kit, [[62, 78], [bar - 10, 54], [bar - 10, 26], [bar - 22, 26]], 5), 14, 6, 0.5)
  // tail: curls up just above the collar
  S.taper(s.cScroll([22, 26], 12, { start: 30, sweep: -420, dir: -1, shrink: 0.3, step: 0.6 }), 8, 4, 0.4)
  render(kit, panel, S, P, half)
  // small crest above the human head
  const Sc = sheet(kit, rect(cx - 26, H - 30, 26, 26), { seed: seed + 2 })
  Sc.band(sq(kit, [[2, 4], [2, 18], [26, 18]], 3), 6)
  render(kit, panel, Sc, P, null)
  panel.fillGround({ ...GROUND, seed: seed + 1 }, { rect: inset(half, 3, 3, 0, 3), margin: 0.7 })
  panel.mirrorX()
  // human head: frontal, in the round right above the aperture (≈ 13 proud)
  const hc = [cx, hy]
  panel.raise((ctx) => {
    ctx.beginPath()
    ctx.ellipse(hc[0], hc[1], 17, 21, 0, 0, Math.PI * 2)
    ctx.fill()
  }, { height: 13, profile: 'dome' })
  panel.sink((ctx) => {
    for (const sx of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(hc[0] + sx * 6.5, hc[1] + 5, 3.4, 2.1, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(hc[0] + sx * 16, hc[1] + 2, 2.4, 5, 0, 0, Math.PI * 2) // ears
      ctx.fill()
    }
    ctx.lineWidth = 1.4
    ctx.beginPath()
    ctx.moveTo(hc[0] - 7, hc[1] - 10)
    ctx.quadraticCurveTo(hc[0], hc[1] - 13, hc[0] + 7, hc[1] - 10)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(hc[0] - 12, hc[1] + 11)
    ctx.quadraticCurveTo(hc[0], hc[1] + 15, hc[0] + 12, hc[1] + 11)
    ctx.stroke()
  }, { depth: 1.5, shoulder: 0.7, profile: 'u' })
  panel.add((ctx) => {
    ctx.beginPath()
    ctx.ellipse(hc[0], hc[1] - 1, 3, 6, 0, 0, Math.PI * 2)
    ctx.fill()
  }, { height: 2.5, profile: 'dome' })
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
  const P = style(LEVELS.handle, { lineWeight: 0.8, echoInset: 1.6, relief: { motif: 2.6, boss: 5, groove: 0.7 } })
  const cx = W / 2
  // collar band
  panel.raise((ctx) => ctx.fillRect(1.5, rimH + 1, W - 3, H - rimH - 2.5), { height: 3, shoulder: 0.8 })
  const half = rect(0, 0, cx, rimH)
  const S = sheet(kit, half, { seed })
  // crescent horn, ribbed, sweeping out and up from the centre
  const top = [], bot = []
  for (let i = 0; i <= 16; i++) {
    const t = i / 16
    const x = cx - 4 - t * (cx - 6)
    top.push([x, rimH - 6 - 4 * (1 - t) + 2 * t * t])
    bot.push([x, rimH - 20 + 10 * t * t])
  }
  S.poly([...top, ...bot.reverse()])
  for (let i = 2; i < 16; i += 2) S.line([[top[i][0], top[i][1] - 2], [bot[16 - i][0], bot[16 - i][1] + 2]], 0.9)
  // ring eye
  S.boss([cx - 15, rimH * 0.45], 6, { kind: 'round', base: 'ground', pupil: 'ring' })
  // scrolls beneath
  S.band(sq(kit, [[cx - 4, 8], [cx - 22, 8], [cx - 22, 16], [cx - 14, 16]], 3), 4.5)
  S.band(sq(kit, [[6, rimH * 0.6], [6, 6], [14, 6]], 3), 4.5)
  render(kit, panel, S, P, half)
  panel.fillGround({ ...GROUND, seed }, { rect: inset(half, 2, 2, 0, 2), margin: 0.6 })
  panel.mirrorX(rect(0, 0, W, rimH))
  return panel.bake()
}
