// Nezu bu 饕餮文瓿 (90082) — the belly mask and the shoulder dragons in RIDGE WORK (KIT.md § Ridge work).
//
// Ridge pass (.work/ridge-nezu-bu/NOTES.md). Coordinates as decor.js: the RIGHT half, x = developed mm from the mask's
// centre ridge (seen from outside), y = arc mm above the register's lower edge, read off faces/dev-mask.jpg and
// faces/dev-shoulder.jpg on 5 mm grids (the LEFT half of dev-shoulder is the sharper and was read mirrored). Every
// figure is a bundle of fat round-topped ridges standing on its own plateau inside a sunk channel (two levels); the
// ground between is packed (belly: small squared spirals of the same ridge; shoulder: the contour lines the bronze
// has). Drawn once through `half` and again through its mirror. One photograph: the far side and the flanks beyond
// ≈ 60° of the centre line repeat the seen half (marked INFERRED).

import { squareSpiral } from './decor.js'

const TAU = Math.PI * 2
// ridgeBand 'hook' ends: kit ridges.js curl() stops a hook whose radius is under half + 0.7 pitch (a check meant for
// spirals), so with the default bend a hook silently draws NOTHING. Pass hookBend > 0.7 × pitch (reported to the lead).
const HB = { belly: 1.7 * 0.72, limb: 2.15 * 0.72, body: 2.7 * 0.72 }

/** superellipse outline (the slit eye's own shape), for the sunk socket line round it */
function squircle(c, w, h, sq, grow = 0, n = 96) {
  const e = 2 / (1 + sq * 5), out = []
  for (let i = 0; i < n; i++) {
    const th = (TAU * i) / n, cs = Math.cos(th), sn = Math.sin(th)
    out.push([c[0] + Math.sign(cs) * Math.pow(Math.abs(cs), e) * (w / 2 + grow), c[1] + Math.sign(sn) * Math.pow(Math.abs(sn), e) * (h / 2 + grow)])
  }
  return out
}
const arc = (c, r, a0, a1, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const a = ((a0 + ((a1 - a0) * i) / n) * Math.PI) / 180; return [c[0] + r * Math.cos(a), c[1] + r * Math.sin(a)] })

// ------------------------------------------------------------------ belly mask (register 77 → 123.6, arc ≈ 46.8 mm)

/** profiles (mm). FIGURE: the broad bands of the mask — 3 ridges at 1.7 mm on a plateau → ≈ 5.6 mm wide figures
 *  (photo: 5–7 mm bands each cut by two or three lines); figure top = plateau 1.6 + ridge 0.9 = 2.5 mm proud.
 *  GROUND: the fine squared-spiral ground (photo ≈ 1.25 mm pitch). */
export const BELLY = {
  figure: { width: 1.15, pitch: 1.7, height: 0.9, groove: 0.3 },
  plateau: { height: 1.6, margin: 0.5, channel: 0.9, channelDepth: 0.7 },
  cell: { width: 0.95, pitch: 1.45, height: 1.1, groove: 0.3 },
  ground: { width: 0.8, pitch: 1.25, height: 0.6, groove: 0 },
}

/** the slit eyes low beside the centre ridge (dev-mask 5 mm grid, both halves): an elongated squircle boss
 *  13.4–14 × 8–10.5 mm (mean 13.7 × 9), corners ≈ 3 mm, a dark slit 7.7 × 2.2 mm along its long axis, ringed by a
 *  dark channel (no raised ring). Centre (33.3, 15.9) right, (−30.5, 15.2) left → (32, 15.6). */
export const SLIT_EYE = { c: [32, 15.6], w: 13.7, h: 9, squareness: 0.5, height: 2.8, crown: 0.55, slit: { length: 7.7, width: 2.2, depth: 1.7 } }
/** the big eye in the frame (detail-eye): a worn round dome ≈ 11 × 10 mm, no slit legible, a dark socket under it */
export const BIG_EYE = { c: [54.6, 33.2], w: 11.4, h: 10, squareness: 0.12, height: 3.2, crown: 0.85 }

function bellyHalf(h) {
  const F = { ...BELLY.figure, plateau: BELLY.plateau }
  const F2 = { ...F, ridges: 2 }
  // nose column beside the ridge (4 ridges ≈ 7.6 mm) and the band outside it (3 ridges)
  h.ridgeBand([[11, 11.4], [11, 45]], { ...F, ridges: 4, start: 'round', end: 'square' })
  h.ridgeBand([[20.6, 11.4], [20.6, 45]], { ...F, ridges: 2, start: 'round', end: 'square' })
  // the eye frame: a rounded-square G, open at its lower outer corner (3 ridges, nested corners)
  h.ridgeBand([[36.5, 23.6], [27.6, 23.6], [27.6, 42.6], [62, 42.6], [62, 30.5]], { ...F, ridges: 3, bend: 1.2, start: 'round', end: 'round' })
  // the squared spiral inside the frame on the nose side (a cell spiral of the figure's coarser ridge)
  h.quadSpiral([[31.4, 27.4], [43.6, 27.2], [43.6, 38.6], [31.4, 38.6]], { ...BELLY.cell, dir: 1, corner: 2.2 })
  // the cheek band under the eye, pointed toward the nose
  h.ridgeBand([[43.5, 22], [53, 23], [63.2, 24.4]], { ...F2, start: 'round', end: 'round' })
  // the upright band between the frame and the horn
  h.ridgeBand([[68, 12.4], [68, 44.6]], { ...F2, start: 'round', end: 'round' })
  // the HORN: a rounded-square spiral of broad laps, 3 ridges per lap (dev-mask: nested lines at y 44 / 42 / 40.5)
  h.ridgeBand(squareSpiral(74.6, 13.4, 126.2, 43, 7.4, 2.3), { ...F, ridges: 3, bend: 1.2, start: 'round', end: 'round' })
  // the bar under the horn's lowest lap, hooked up at its outer end
  h.ridgeBand([[80.5, 14.4], [118, 14.4]], { ...F2, start: 'round', end: 'hook', dir: 1, hookAngle: 120, hookBend: HB.belly })
  // the jaw row: squared spirals in leaning cells along the foot of the field, alternating hands (dev-mask y 0.5–9.8)
  for (let k = 0; k < 8; k++) {
    const a = 3.2 + k * 15.6, l = k % 2 ? -2.2 : 2.2
    h.quadSpiral([[a, 0.6], [a + 14.4, 0.6], [a + 14.4 + l, 9.8], [a + l, 9.8]], { ...BELLY.cell, dir: k % 2 ? -1 : 1, start: k % 2 ? 1 : 0, corner: 1.1, cornerMin: 0.6 })
  }
  // INFERRED beyond the photograph's edge (x > 128): an upright band and a C-hook up to the divider flange
  h.ridgeBand([[134.4, 2.6], [134.4, 44.4]], { ...F, ridges: 3, start: 'round', end: 'round' })
  h.ridgeBand([[150, 4], [141.8, 4], [141.8, 42.8], [158.4, 42.8], [158.4, 14.6], [150.4, 14.6]], { ...F, ridges: 3, bend: 1.2, start: 'round', end: 'hook', dir: 1, hookAngle: 120, hookBend: HB.belly })
  h.quadSpiral([[136.6 + 9, 18], [155.5, 18], [155.5, 39.4], [145.6, 39.4]], { ...BELLY.cell })
  // eyes
  h.slitEye(SLIT_EYE.c, { ...BELLY.figure, ...SLIT_EYE })
  }

export const maskPanel = (kit, size, o) => {
  const panel = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm: o.ppmm, seed: o.seed })
  const W = panel.width
  const work = kit.ridgeWork(panel, { ...BELLY.figure, transform: ([x, y]) => [W / 2 + x, y] })
  bellyHalf(work)
  bellyHalf(work.mirror(0))
  work.flush()
  // the dark channel round each slit eye (photo: a black outline, no raised ring)
  panel.sink((ctx) => {
    ctx.lineJoin = 'round'; ctx.lineWidth = 0.9
    for (const s of [1, -1]) {
      const pts = squircle([W / 2 + s * SLIT_EYE.c[0], SLIT_EYE.c[1]], SLIT_EYE.w, SLIT_EYE.h, SLIT_EYE.squareness, 0.55)
      ctx.beginPath(); pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath(); ctx.stroke()
    }
  }, { depth: 0.8, shoulder: 0.35, profile: 'u' })
  // the big eye: a round pillow dome in a sunk socket ring (pillowBoss: a smooth dome, not a distance-field cone)
  for (const s of [1, -1]) kit.pillowBoss(panel, { c: [W / 2 + s * BIG_EYE.c[0], BIG_EYE.c[1]], w: BIG_EYE.w, h: BIG_EYE.h, round: 1, height: BIG_EYE.height, crown: 0.85, slit: false, ring: { gap: 0.7, line: 0.8, depth: 0.6 } })
  // no plain ground: small squared spirals of the ground ridge in every gap, each half its own hand
  const cg = 2.4
  for (const [x, w, hand] of [[W / 2 + cg, W / 2 - cg, 'right'], [0, W / 2 - cg, 'left']]) {
    kit.ridgeGround(panel, { rect: { x, y: 0, w, h: panel.height } }, { ...BELLY.ground, seed: o.seed + 11 + (hand === 'left' ? 1 : 0), leiwen: { hand, cell: [3.6, 7], pairs: 0.2 } })
  }
  return panel.bake()
}

// ------------------------------------------------------------------ shoulder (register 127.4 → 158.6, arc ≈ 33.5 mm)

/** the open-mouthed dragon, one per half, facing the centre ridge — ONE animal (element list in NOTES.md):
 *  body: 2 fat ridges (photo: two rounded bands with a groove between, ≈ 5.5 mm) on a plateau; jaws, crest, leg:
 *  2 ridges ≈ 4.4 mm; slit eye; two dotted discs, the near one ringed by a coil off the body, the far one by the tail. */
export const SHOULDER_R = {
  body: { width: 1.8, pitch: 2.7, height: 0.9, groove: 0.3 },
  limb: { width: 1.45, pitch: 2.15, height: 0.85, groove: 0.3 },
  plateau: { height: 1.3, margin: 0.45, channel: 0.85, channelDepth: 0.6 },
  eye: { c: [28.6, 16.6], w: 7.4, h: 3.9, squareness: 0.3, angle: 105, height: 2.4, crown: 0.7, slit: { length: 4.6, width: 1.1, depth: 1.2 } },
  discs: [
    { c: [66, 14.4], r: 5.4, dots: [[-2.2, 1.6], [1.4, 2.4], [2.8, -0.4], [0.2, -0.6], [-2.6, -1.8], [0.8, -3]] },
    { c: [104, 19], r: 5.6, dots: [[-1.8, 1.2], [1.4, 1.8], [2, -1], [-0.4, -0.6], [-1.6, -2.2]] },
  ],
}

function dragonHalf(h) {
  const S = SHOULDER_R
  const B = { ...S.body, ridges: 2, plateau: S.plateau }
  const L = { ...S.limb, ridges: 2, plateau: S.plateau }
  // 1 upper jaw: from the snout tip (raised, the gaping mouth under it: dev-shoulder x 7 → 20, y 29 → 23) back over the eye to the nape
  h.ridgeBand([[6.8, 29.4], [9.4, 25.8], [14.4, 23.8], [24, 23.4], [30, 24.2], [34.4, 23.8]], { ...L, start: 'round', end: 'round' })
  // 2 lower jaw: tip hooked up at the front, along the bottom, rolled into the hinge coil under the eye
  h.ridgeBand([[11.2, 12.4], [11.6, 7], [16, 5], [27, 5], [32.6, 5.4]], { ...L, start: 'round', end: 'hook', dir: 1, hookAngle: 220, hookBend: HB.limb })
  // 4 crest: a leaf sweeping back off the crown, its tip curled down
  h.ridgeBand([[37, 28], [39.6, 29.8], [44, 30.2], [49.4, 29.6]], { ...L, start: 'round', end: 'hook', dir: -1, hookAngle: 120, hookBend: HB.limb })
  // 3 foreleg: down from under the neck, a claw curled forward
  h.ridgeBand([[40.2, 18.6], [42.8, 12], [44.8, 6.6]], { ...L, start: 'round', end: 'hook', dir: -1, hookAngle: 150, hookBend: HB.limb })
  // 5 BODY: nape → up in an arch over the near disc → down the diagonal → under the far disc → the tail curling up
  //   round it and hooking in over its top
  h.ridgeBand([[36.4, 22.4], [44, 21.6], [52, 24], [60, 27.4], [68, 28.2], [75, 26.4], [82, 22.4], [90, 17], [97, 12.4], [105, 10], [112.6, 10.4], [118, 14.6], [118, 22], [112, 27], [103.4, 28.4], [95.6, 26.6]],
    { ...B, start: 'round', end: 'hook', dir: 1, hookAngle: 100, hookBend: HB.body, bend: 1.6, taper: [1, 0.82] })
  // 6 the coil round the near disc, springing from the body's underside behind the arch
  h.ridgeBand(arc(S.discs[0].c, 8.3, 60, -165, 30), { ...L, start: 'round', end: 'round' })
  // 7 eye: an elongated slit eye leaning back, an almond socket ridge round it
  h.slitEye(S.eye.c, { ...S.limb, ...S.eye, ring: { ridges: 1, gap: 0.6 } })
  // INFERRED beyond the photograph (x > 124): a tail-hook before the divider flange
  h.ridgeBand([[128, 25.4], [138, 26.2], [145, 22.4], [146, 15], [140.6, 11.4]], { ...L, start: 'round', end: 'hook', dir: -1, hookAngle: 140, hookBend: HB.limb })
}

export const shoulderPanel = (kit, size, o) => {
  const panel = new kit.ReliefPanel({ width: size.width, height: size.height, ppmm: o.ppmm, seed: o.seed })
  const W = panel.width
  const work = kit.ridgeWork(panel, { ...SHOULDER_R.body, transform: ([x, y]) => [W / 2 + x, y] })
  dragonHalf(work)
  dragonHalf(work.mirror(0))
  work.flush()
  // the dotted discs: low domes studded with sunk dots
  const dots = []
  for (const s of [1, -1]) for (const d of SHOULDER_R.discs) {
    const c = [W / 2 + s * d.c[0], d.c[1]]
    kit.pillowBoss(panel, { c, w: d.r * 2, h: d.r * 2, round: 1, height: 1.5, crown: 0.45, slit: false, ring: false })
    for (const [dx, dy] of d.dots) dots.push([c[0] + s * dx, c[1] + dy])
  }
  panel.sink((ctx) => { for (const [x, y] of dots) { ctx.beginPath(); ctx.arc(x, y, 0.9, 0, TAU); ctx.fill() } }, { depth: 0.6, shoulder: 0.4, profile: 'u' })
  // the ground: the bronze's fine lines FOLLOWING the creature (contour echoes), spirals only in the leftovers
  const cg = 2.2
  for (const [x, w, hand] of [[W / 2 + cg, W / 2 - cg, 'right'], [0, W / 2 - cg, 'left']]) {
    kit.leiwenFill(panel, { rect: { x, y: 0, w, h: panel.height }, avoid: 'raised', margin: 0.5 }, {
      pitch: 1.3, line: 0.55, depth: 0.3, cell: [4.2, 7.4], pairs: 0.4, maxAspect: 1.6, roundness: 0.15, jitter: 0.06, echo: 4, follow: 1,
      hand, seed: o.seed + 11, fillers: true,
    })
  }
  return panel.bake()
}
