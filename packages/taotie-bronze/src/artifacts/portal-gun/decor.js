// portal-gun — the décor: one ReliefPanel per mould face. The composition (which feature became which motif):
//
//   emitter, outside  the gu's trumpet: eight RISING blades, a cicada in each, tips toward the rim; bowstrings at the
//                     root and under the lip; leiwen ground. Four notched flanges on the blade boundaries (parts.js).
//   emitter, inside   the portal: every tread of the stepped funnel carries a pair of bowstrings, so the throat reads as
//                     concentric rings; a circle band (圆圈纹) on the cone under the lip; the fire whorl (囧纹) on the
//                     domed throat. One polar panel, seen head-on from the muzzle.
//   barrel            a register of kui on leiwen between bowstrings — the barrel is a vessel laid on its side, so the
//                     kui walk round it, confronted on the side meridians, their "up" toward the muzzle.
//   body front        rising blades with pillow eyes round the shoulder where the body narrows into the barrel.
//   body flanks       half a taotie on each flank, drawn in RIDGE WORK (KIT.md § Ridge work): the eye is the core
//                     chamber (geometry, parts.js); the nose a 3-ridge figure down the front edge where the barrel
//                     leaves; the horn a 4-ridge figure sweeping back along the top and rolling into a spiral; a fat
//                     brow over the eye; the jaw running back and down toward the grip, ending in a hooked fang; the
//                     ear a coil (under the selector dial on +Z); squared spirals in every cell; ridgeGround packs the
//                     rest. Figures stand on plateaus ringed by a sunk channel; borders are 2-ridge bundles.
//   grip              the handle animal's body: scales on its flanks, a dorsal ridge down the back, crosswise belly
//                     plates down the front (the finger grooves).
//   power cell        a lozenge-and-spiral lattice between bowstrings, the turquoise windows sunk in ridge frames.
//   base              a 3-ridge border round a row of cloud scrolls (云纹) on a leiwen ground.
//
// All panel mm, origin bottom-left, y up.

import { BELL, bellR, TREADS, DOME, BARREL, BODY, BODY_W, BODY_H, EYE, DIAL, CELL, GRIP_LINE, GRIP, STAND } from './form.js'

const LINE = 0.42
const GROUND = { pitch: 0.82, line: 0.5, depth: 0.32, roundness: 0.15, jitter: 0.06, pairs: 0.6, echo: 1 }
const contour = (inset = 0.6) => ({ inset, line: LINE })
const sfill = (o = {}) => ({ kind: 'spirals', line: 0.38, pitch: 0.7, gap: 0.32, square: 0.25, tail: false, min: 2.4, ...o })
const newPanel = (kit, w, h, ppmm, seed) => new kit.ReliefPanel({ width: w, height: h, ppmm, seed })

/** orientation sign of a point map (−1 mirrors) */
function det(T) {
  const a = T([0, 0]), b = T([1, 0]), c = T([0, 1])
  return Math.sign((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])) || 1
}

/** raised ring lines across the whole panel at y */
function rings(kit, panel, W, y, { count = 2, width = 1.2, spacing = 2.4, height = 0.8 } = {}) {
  kit.bowstrings(panel, { x: -1, y: y - (spacing * (count - 1)) / 2 - width, w: W + 2, h: spacing * (count - 1) + 2 * width }, { count, width, height, spacing })
}

// ------------------------------------------------------------------ layout: every panel's size before drawing

/** outer flare arc table: s (mm from the root) ↔ x */
function flareTable() {
  const N = 400, xs = [], ss = [0]
  for (let i = 0; i <= N; i++) xs.push(BELL.x0 + ((BELL.x1 - BELL.x0) * i) / N)
  for (let i = 1; i <= N; i++) ss.push(ss[i - 1] + Math.hypot(xs[i] - xs[i - 1], bellR(xs[i]) - bellR(xs[i - 1])))
  const L = ss[N]
  return {
    L,
    rAtS(s) {
      let i = 1
      while (i < N && ss[i] < s) i++
      const g = Math.max(0, Math.min(1, (s - ss[i - 1]) / Math.max(1e-9, ss[i] - ss[i - 1])))
      return bellR(xs[i - 1] + (xs[i] - xs[i - 1]) * g)
    },
  }
}

export function layout() {
  const F = flareTable()
  const rRef = F.rAtS(F.L / 2)
  const gl = GRIP_LINE
  let gLen = 0
  for (let i = 1; i < gl.length; i++) gLen += Math.hypot(gl[i][0] - gl[i - 1][0], gl[i][1] - gl[i - 1][1])
  const a = GRIP.depth, b = GRIP.width
  const gPer = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)))
  return {
    bellOuter: { w: 2 * Math.PI * rRef, h: F.L, rRef, rAtS: F.rAtS },
    bellInner: { w: 2 * (BELL.r1 + 1), h: 2 * (BELL.r1 + 1) },
    barrel: { w: 2 * Math.PI * BARREL.r, h: BARREL.reg[1] - BARREL.reg[0] },
    flank: { w: BODY_W, h: BODY_H },
    grip: { w: gPer, h: gLen },
    cell: { w: 2 * Math.PI * CELL.r, h: CELL.band[1] - CELL.band[0] },
    base: { w: STAND.base.w, h: STAND.base.d },
  }
}

// ------------------------------------------------------------------ emitter outside: rising cicada blades

export function bellOuterPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const n = 8, sector = W / n
  // true developed mm (x from a sector's centre line, y = arc from the root) → panel mm
  const M = (cx) => ([x, y]) => [cx + x * (size.rRef / size.rAtS(y)), y]
  rings(kit, panel, W, 3.2, { count: 2, width: 1.25, spacing: 2.5, height: 0.9 })
  rings(kit, panel, W, H - 3.0, { count: 1, width: 1.6, height: 1.0 })
  const yb = 7.4, yt = H - 7.8
  const plates = [], bodies = [], eyes = []
  for (let i = 0; i < n; i++) {
    const cx = sector * (i + 0.5)
    const T = M(cx)
    // the blade: its sides follow the sector (true width) at the root, swelling a little, then running to a point
    const left = [], right = []
    for (let k = 0; k <= 14; k++) {
      const f = k / 14, y = yb + (yt - yb) * f
      const half = (Math.PI * size.rAtS(y)) / n - 2.2
      const w = half * Math.min(1, (1 - Math.pow(f, 1.6)) * 1.06) * (k === 14 ? 0 : 1)
      left.push(T([-w, y])); right.push(T([w, y]))
    }
    plates.push(kit.roundPoly([...left, ...right.slice(0, -1).reverse()], { round: 1.6, contour: { inset: 1.1, line: LINE } }))
    // the cicada: a head plate with two pillow eyes near the root, a chevroned body tapering up the blade
    const hw = (Math.PI * size.rAtS(yb + 9)) / n - 4.4
    const hy = yb + 6.2
    bodies.push(kit.roundPoly([T([-hw, hy - 3.6]), T([hw, hy - 3.6]), T([hw * 0.92, hy + 3.8]), T([-hw * 0.92, hy + 3.8])], { round: 2.2, contour: contour(0.5) }))
    bodies.push(kit.roundStroke([T([0, hy + 5.0]), T([0, yt - 18])], { width: [hw * 1.15, 1.8], round: 0.5, end: 'point', contour: contour(0.5), fill: { kind: 'lines', line: 0.36, pitch: 1.2 } }))
    eyes.push(T([-hw * 0.5, hy + 0.2]), T([hw * 0.5, hy + 0.2]))
  }
  kit.carve(panel, plates, { height: 0.9, shoulder: 0.4, depth: 0.28, seed })
  kit.carve(panel, bodies, { height: 1.7, shoulder: 0.45, depth: 0.28, seed: seed + 1 })
  for (const c of eyes) kit.pillowBoss(panel, { c, w: 4.2, h: 3.8, round: 0.8, height: 2.5, crown: 1, base: 'field', slit: false })
  kit.leiwenFill(panel, { rect: { x: 0, y: 6.0, w: W, h: H - 10.6 }, margin: 0.45 }, { ...GROUND, pitch: 0.78, echo: 0, seed })
  return panel.bake()
}

// ------------------------------------------------------------------ emitter inside: the portal rings and the fire whorl

export function bellInnerPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const c = [W / 2, H / 2]
  const ring = (ctx, r0, r1) => { ctx.moveTo(c[0] + r1, c[1]); ctx.arc(c[0], c[1], r1, 0, Math.PI * 2); ctx.moveTo(c[0] + r0, c[1]); ctx.arc(c[0], c[1], r0, 0, Math.PI * 2, true) }
  // every tread: two fat bowstrings (domed rings) clear of its riser edges
  panel.raise((ctx) => {
    ctx.beginPath()
    for (const [, ro, ri] of TREADS) {
      const w = ro - ri, rw = Math.min(1.9, w * 0.27)
      for (const f of [0.3, 0.72]) { const r = ri + w * f; ring(ctx, r - rw / 2, r + rw / 2) }
    }
    ctx.fill()
  }, { height: 1.15, profile: 'dome' })
  // a circle band on the cone under the lip: small raised rings, each with a dot
  const rc = (TREADS[0][1] + BELL.r1 - BELL.lip) / 2, nC = 40
  panel.raise((ctx) => {
    ctx.beginPath()
    for (let i = 0; i < nC; i++) {
      const a = (2 * Math.PI * i) / nC, p = [c[0] + rc * Math.cos(a), c[1] + rc * Math.sin(a)]
      ctx.moveTo(p[0] + 2.2, p[1]); ctx.arc(p[0], p[1], 2.2, 0, Math.PI * 2); ctx.moveTo(p[0] + 1.15, p[1]); ctx.arc(p[0], p[1], 1.15, 0, Math.PI * 2, true)
    }
    ctx.fill()
  }, { height: 0.9, profile: 'dome' })
  panel.raise((ctx) => {
    ctx.beginPath()
    for (let i = 0; i < nC; i++) { const a = (2 * Math.PI * i) / nC; ctx.moveTo(c[0] + rc * Math.cos(a) + 0.55, c[1] + rc * Math.sin(a)); ctx.arc(c[0] + rc * Math.cos(a), c[1] + rc * Math.sin(a), 0.55, 0, Math.PI * 2) }
    ctx.fill()
  }, { height: 0.7, profile: 'dome' })
  // bowstrings bounding the circle band
  panel.raise((ctx) => { ctx.beginPath(); ring(ctx, rc - 4.1, rc - 3.1); ring(ctx, rc + 3.1, rc + 4.1); ctx.fill() }, { height: 0.8, profile: 'dome' })
  // the fire whorl on the throat dome
  const d = 2 * (DOME.r - 0.8)
  kit.drawMotif(panel, 'whorl', { x: c[0] - d / 2, y: c[1] - d / 2, w: d, h: d }, { relief: { motif: 1.5, boss: 3.0, groove: 0.4 } }, { preset: 'six-spokes', ground: false })
  return panel.bake()
}

// ------------------------------------------------------------------ the barrel: a kui register

/** A kui in a band Hb tall and Lb long (design frame: x along the body from the head at 0, mouth toward −x; y across). */
function kui(kit, T, Hb, Lb) {
  const s = Hb, lam = Lb / Hb
  const P = (pts) => pts.map(([x, y]) => T([x * s, y * s]))
  const sg = det(T)
  const els = [
    kit.roundPoly(P([[0.1, 0.24], [0.72, 0.24], [0.72, 0.8], [0.1, 0.8]]), { round: 0.2 * s, contour: contour(0.6) }),
    kit.roundStroke(P([[0.4, 0.93], [-0.06, 0.93], [-0.06, 0.6]]), { width: [0.15 * s, 0.15 * s, 0.11 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }),
    kit.roundStroke(P([[0.32, 0.1], [-0.02, 0.1], [-0.02, 0.32]]), { width: [0.13 * s, 0.13 * s, 0.1 * s], round: 0.8, inner: 0.25, end: 'point', contour: false }),
    kit.roundStroke(P([[0.66, 0.46], [lam - 0.36, 0.46], [lam - 0.1, 0.46], [lam - 0.1, 0.78], [lam - 0.34, 0.78]]), {
      width: [0.3 * s, 0.28 * s, 0.26 * s, 0.22 * s, 0.2 * s], round: 0.85, inner: 0.3, end: 'spiral', spiral: { turns: 0.9, dir: -sg, gap: 0.06 * s },
      contour: contour(0.6), fill: sfill({ joints: true, min: 0.12 * s }),
    }),
    kit.roundStroke(P([[0.86, 0.66], [0.86, 0.94], [Math.min(lam * 0.55, 2.0), 0.94]]), { width: [0.15 * s, 0.15 * s, 0.1 * s], round: 0.8, inner: 0.25, end: 'point', contour: contour(0.5) }),
    kit.roundStroke(P([[1.02, 0.32], [1.02, 0.07], [1.5, 0.07]]), { width: [0.15 * s, 0.14 * s, 0.11 * s], round: 0.8, inner: 0.25, end: 'spiral', spiral: { turns: 0.75, dir: sg, gap: 0.04 * s }, contour: false }),
  ]
  return { els, eye: { c: T([0.41 * s, 0.52 * s]), w: 0.3 * s, h: 0.25 * s } }
}

export function barrelPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  rings(kit, panel, W, 3.0, { count: 2, width: 1.2, spacing: 2.4, height: 0.9 })
  rings(kit, panel, W, H - 3.0, { count: 2, width: 1.2, spacing: 2.4, height: 0.9 })
  // panel x: 0 = top meridian, W/4 = the +Z side meridian. Two kui per half turn, heads meeting on the side meridian.
  const Hb = H - 13.6, yb = 6.8, ax = W / 4, Lb = ax - 4.5
  const K = kui(kit, ([x, y]) => [ax - 2.2 - x, yb + y], Hb, Lb)
  kit.carve(panel, K.els, { height: 1.6, shoulder: 0.5, depth: 0.3, irregularity: 0.7, seed })
  kit.pillowBoss(panel, { c: K.eye.c, w: K.eye.w, h: K.eye.h, round: 0.55, height: 2.4, crown: 0.9, slit: { len: K.eye.w * 0.38, width: 0.6, depth: 0.45 } })
  kit.leiwenFill(panel, { rect: { x: 0, y: 5.6, w: ax, h: H - 11.2 }, margin: 0.45 }, { ...GROUND, pitch: 0.72, echo: 0, seed })
  panel.mirrorX({ x: 0, y: 0, w: W / 2, h: H }) // the confronted partner on the other side of the meridian
  panel.mirrorX() // the −Z half
  return panel.bake()
}

// ------------------------------------------------------------------ the flanks: half a taotie in ridge work

// ridge classes (after the Dasikong blade, KIT.md § Ridge work), scaled to a 380 mm device and made FAT: figures on
// plateaus ringed by a sunk channel, ridge : groove ≈ 65 : 35, round crowns
const BASE = { pitch: 1.45, width: 0.95, height: 0.7, groove: 0.32 }
const PLATEAU = { height: 1.8, margin: 0.45, channel: 1.0, channelDepth: 0.8 }
const CLS = {
  spiral: { ...BASE },
  bundle: { pitch: BASE.pitch * 1.36, width: BASE.width * 1.36, height: BASE.height * 1.2, groove: BASE.groove, plateau: PLATEAU },
  figure: { pitch: BASE.pitch * 1.5, width: BASE.width * 1.5, height: BASE.height * 1.33, groove: BASE.groove, plateau: PLATEAU },
  brow: { pitch: BASE.pitch * 1.75, width: BASE.width * 1.75, height: BASE.height * 1.4, groove: BASE.groove, plateau: { ...PLATEAU, height: 2.0 } },
}

/** the almond eye outline (vesica) offset by `o` mm, centred at [cx, 0] in the mask frame, as a closed polyline */
function almond(cx, o, n = 18) {
  const R = (EYE.w * EYE.w + EYE.h * EYE.h) / (2 * EYE.h), dv = R - EYE.h, Ro = R + o
  const half = Math.sqrt(Ro * Ro - dv * dv)
  const pts = []
  for (let i = 0; i <= n; i++) { const s = -half + (2 * half * i) / n; pts.push([cx + s, Math.sqrt(Math.max(0, Ro * Ro - s * s)) - dv]) }
  for (let i = n - 1; i > 0; i--) { const s = -half + (2 * half * i) / n; pts.push([cx + s, dv - Math.sqrt(Math.max(0, Ro * Ro - s * s))]) }
  return pts
}

/** the mask frame: X back from the nose axis (the front edge), Y = mm above the eye's centre line */
export const NOSE_PX = 128 // panel x of the nose axis (gun x = 28)
export function flankPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const Hc = H / 2 + (EYE.y - BODY.yc)
  const T = ([X, Y]) => [NOSE_PX - X, Hc + Y]
  const work = kit.ridgeWork(panel, { ...BASE, transform: T })
  const EX = NOSE_PX + BODY.x0 - EYE.x // the eye's X in the mask frame (gun x → panel x = x − x0)
  const ear = { X: NOSE_PX + BODY.x0 - DIAL.x, Y: DIAL.y - EYE.y }
  // ---- edge: 2-ridge border bundles along the shoulders, a 3-ridge nose down the front edge
  work.ridgeBand([[2, 38.5], [124, 38.5]], { ...CLS.bundle, ridges: 2, start: 'round', end: 'round' })
  work.ridgeBand([[2, -38.5], [124, -38.5]], { ...CLS.bundle, ridges: 2, start: 'round', end: 'round' })
  work.ridgeBand([[4.2, 32], [4.2, -32]], { ...CLS.figure, ridges: 3, start: 'round', end: 'round' })
  // ---- the eye's outline: a ridge pair hugging the almond socket (the 臣 eye's surround)
  work.ridgeBand(almond(EX, 3.2), { ...CLS.spiral, ridges: 2, closed: true, bend: 0.8 })
  // ---- the brow: a fat 3-ridge figure over the eye
  work.ridgeBand([[11, 27], [63, 27]], { ...CLS.brow, ridges: 3, start: 'round', end: 'round' })
  // ---- the horn: a broad 5-ridge C standing behind the eye — up, back along the top, down, rolled forward into a spiral
  work.ridgeBand([[73, -4], [73, 25.5], [115, 25.5], [115, 13]], { ...CLS.figure, ridges: 5, start: 'round', end: 'spiral', dir: -1, turns: 0.6, bend: 1.4 })
  // ---- the jaw: back under the eye toward the grip, then down, ending in a fang hooked forward
  work.ridgeBand([[11, -26.2], [55, -26.2], [64, -32.5]], { ...CLS.figure, ridges: 3, start: 'round', end: 'hook', dir: -1, hookAngle: 140, bend: 1.0 })
  // ---- the ear: a coil behind the horn's root (the selector dial sits on it on the +Z flank)
  work.hookEye([ear.X, ear.Y], { ...CLS.spiral, w: 25, h: 25, shape: 'O', turns: 4, slit: false })
  // ---- cells: squared spirals packing the fields the figures leave
  const q = (a, b, c, d, o = {}) => work.quadSpiral([a, b, c, d], { ...CLS.spiral, ...o })
  q([ear.X + 14.5, -4], [123, -4], [123, -34], [ear.X + 14.5, -34], { start: 1, dir: -1 }) //   behind the ear
  q([68, -8], [76.5, -8], [76.5, -34], [68, -34], { start: 0 }) //                               between the fang and the ear
  // ---- the shoulders over the top and under the bottom: a row of squared spiral cells each side of the mould join
  for (const sg of [1, -1]) {
    const y0 = sg * 43.2, y1 = sg * (H - Hc - 1.6 > 0 && sg > 0 ? H - Hc - 2.2 : Hc - 2.2)
    const n = 9, x0 = 4, x1 = 124, cw = (x1 - x0) / n
    for (let i = 0; i < n; i++) q([x0 + cw * i, y1], [x0 + cw * (i + 1), y1], [x0 + cw * (i + 1), y0], [x0 + cw * i, y0], { start: i % 2 ? 1 : 0, dir: i % 2 ? -1 : 1, corner: 1.8 })
  }
  work.flush()
  // the eye's seat: a sunk orbit the socket stands in (hidden under the casting, keeps the ground packer out)
  const ec = T([EX, 0])
  panel.sink((ctx) => { ctx.beginPath(); ctx.ellipse(ec[0], ec[1], EYE.w + 1.2, EYE.h + 1.2, 0, 0, Math.PI * 2); ctx.fill() }, { depth: 0.4, profile: 'u', shoulder: 0.4 })
  // no plain ground inside the mask: small spirals of the same ridge in every gap
  kit.ridgeGround(panel, {
    // the mask's field minus the eye's seat (a reversed sub-path: a hole); raised figures are avoided by default
    include: (ctx) => { ctx.beginPath(); ctx.rect(NOSE_PX - 126, Hc - 41.5, 124, 83); ctx.ellipse(ec[0], ec[1], EYE.w + 1.0, EYE.h + 1.0, 0, 0, Math.PI * 2, true); ctx.fill() },
  }, { pitch: 1.2, width: 0.78, height: 0.5, groove: 0.3, seed })
  // ---- the body's front shoulder (round into the barrel): rising blades pointing at the muzzle, four per half
  const x0 = NOSE_PX + 4.5, x1 = W - 1.2, nb = 4, bh = H / nb
  const blades = []
  for (let i = 0; i < nb; i++) {
    const c = bh * (i + 0.5), hw = bh / 2 - 1.6
    blades.push(kit.roundPoly([[x0, c - hw], [x0, c + hw], [x1, c]], { round: [2.0, 2.0, 1.0], contour: { inset: 1.0, line: LINE } }))
  }
  kit.carve(panel, blades, { height: 1.1, shoulder: 0.4, depth: 0.3, seed: seed + 3 })
  const eyesB = []
  for (let i = 0; i < nb; i++) { const c = bh * (i + 0.5); eyesB.push([x0 + 4.2, c]) }
  for (const c of eyesB) kit.pillowBoss(panel, { c, w: 4.0, h: 5.6, round: 0.7, height: 2.2, crown: 1, base: 'field', slit: false })
  kit.leiwenFill(panel, { rect: { x: NOSE_PX + 3.5, y: 0, w: W - NOSE_PX - 3.5, h: H }, margin: 0.45 }, { ...GROUND, pitch: 0.78, echo: 0, seed })
  return panel.bake()
}

// ------------------------------------------------------------------ the grip: the handle animal's body

export function gripPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  // panel x: 0 and W = the back (dorsal ridge), W/2 = the front (belly plates); y: haunch (0) → neck (H)
  kit.drawMotif(panel, 'scales', { x: W * 0.1, y: 1, w: W * 0.28, h: H - 2 }, { scale: 3.4, open: 'down', relief: { motif: 0.9, boss: 1.4, groove: 0.38 } }, { ground: false })
  kit.drawMotif(panel, 'scales', { x: W * 0.62, y: 1, w: W * 0.28, h: H - 2 }, { scale: 3.4, open: 'down', relief: { motif: 0.9, boss: 1.4, groove: 0.38 } }, { ground: false })
  // dorsal ridge: a fat round spine down the back, with notches
  panel.raise((ctx) => { ctx.beginPath(); ctx.rect(-2, 2, 4.6, H - 4); ctx.rect(W - 2.6, 2, 4.6, H - 4); ctx.fill() }, { height: 1.4, profile: 'dome' })
  // belly plates: broad crosswise bars down the front, the grooves between them the finger grip
  const bw = W * 0.22, x0 = W / 2 - bw / 2
  panel.raise((ctx) => {
    ctx.beginPath()
    for (let y = 4; y < H - 6; y += 5.2) ctx.roundRect(x0, y, bw, 3.9, 1.6)
    ctx.fill()
  }, { height: 1.3, profile: 'plateau', shoulder: 0.55 })
  return panel.bake()
}

// ------------------------------------------------------------------ the power cell: lozenge lattice, turquoise windows

export function cellPanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  rings(kit, panel, W, 2.6, { count: 2, width: 1.1, spacing: 2.2, height: 0.8 })
  rings(kit, panel, W, H - 2.6, { count: 2, width: 1.1, spacing: 2.2, height: 0.8 })
  const win = CELL.window
  const wy0 = win.x0 - CELL.band[0], wy1 = win.x1 - CELL.band[0]
  const hw = win.half * CELL.r // half width (mm round the cell)
  const work = kit.ridgeWork(panel, { pitch: 1.5, width: 1.0, height: 0.75, groove: 0.25 })
  const frames = []
  for (const cx of [W / 4, (3 * W) / 4]) {
    const r = hw + 2.6, x0 = cx - r, x1 = cx + r, y0 = wy0 - 2.6, y1 = wy1 + 2.6
    work.ridgeBand([[x0, (y0 + y1) / 2], [x0, y1], [x1, y1], [x1, y0], [x0, y0]], { ridges: 2, closed: true, bend: 1.6 })
    frames.push([cx, hw, wy0, wy1])
  }
  work.flush()
  // the window seats: sunk, round-ended
  panel.sink((ctx) => { ctx.beginPath(); for (const [cx, h, a, b] of frames) ctx.roundRect(cx - h - 0.6, a - 0.6, 2 * h + 1.2, b - a + 1.2, h); ctx.fill() }, { depth: 1.6, profile: 'u', shoulder: 0.5 })
  kit.lozengeFill(panel, { rect: { x: 0, y: 5.6, w: W, h: H - 11.2 }, margin: 0.5 }, { size: [9, 7], fill: 'spiral', pitch: 0.8, levels: 1, seed })
  return panel.bake()
}

// ------------------------------------------------------------------ the base: a ridge border round cloud scrolls

export function basePanel(kit, size, { ppmm, seed }) {
  const W = size.w, H = size.h
  const panel = newPanel(kit, W, H, ppmm, seed)
  const r = STAND.base.r
  const work = kit.ridgeWork(panel, { pitch: 2.0, width: 1.3, height: 0.9, groove: 0.3 })
  const i0 = 7
  work.ridgeBand([[i0, H / 2], [i0, H - i0], [W - i0, H - i0], [W - i0, i0], [i0, i0]], { ridges: 3, closed: true, bend: r - i0 - 2 })
  work.flush()
  // the field: S-shaped cloud scrolls in a row, a leiwen ground
  const els = []
  const n = 7, cell = (W - 40) / n, ym = H / 2
  for (let i = 0; i < n; i++) {
    const x0 = 20 + cell * i + cell * 0.2, x1 = 20 + cell * (i + 1) - cell * 0.2
    els.push(kit.roundStroke([[x0, ym - 4], [x1, ym + 4]], {
      width: [6.4, 6.4], round: 0.9, inner: 0.3, start: 'spiral', end: 'spiral',
      startSpiral: { turns: 1.1, dir: 1, gap: 0.8, R: 11 }, spiral: { turns: 1.1, dir: 1, gap: 0.8, R: 11 },
      contour: contour(0.7), fill: sfill({ min: 2.8, pitch: 0.85 }),
    }))
  }
  kit.carve(panel, els, { height: 1.6, shoulder: 0.5, depth: 0.32, irregularity: 0.8, seed })
  kit.leiwenFill(panel, { rect: { x: 16, y: 16, w: W - 32, h: H - 32 }, margin: 0.6 }, { ...GROUND, pitch: 1.1, roundness: 0.85, seed })
  return panel.bake()
}
