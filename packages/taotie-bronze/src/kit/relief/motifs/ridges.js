// Ridge work — atlas sheet for relief/ridges.js (§ Ridge work), and the type specimen: the hanging blade of the
// Nezu Dasikong lei (90079), composed from the primitives element for element.
//
// The blade is authored in BLADE SPACE: x = mm from the blade's axis, y = vessel height (mm) — the same frame the
// photograph is read in. Readings were taken off reference/nezu-fanglei-dasikong/faces/face-blades.jpg (5 px/mm, face
// y = fy) and cross-checked on photo-34 / photo-03 at full resolution; F(x, fy) converts a face reading, E(inset, fy)
// is a point `inset` mm in from the blade's LEFT edge (square to it) under the reference warp, so the edge strips and
// every cell that touches them follow the photographed outline. Draw through work.view(transform) to put the blade
// anywhere (the vessel: blade space → its body panel; the atlas: a re-warp for the lean slider + a shift).
//
// Measured on photo-34 (≈ 3.6 px/mm at the blade, H = 500 mm INFERRED): the spiral ridges run at 1.35 ± 0.1 mm pitch
// (5 photo px; autocorrelation / FFT of the cheek spirals 1.2–1.5 mm), bright ridge ≈ dark groove; the edge bundles
// are a little coarser (≈ 1.6–1.7 mm), the brow pair fatter still (≈ 2 mm).

import { RidgeWork, bladeWarp, ridgeProfile, ridgeGround } from '../ridges.js'

const E_ = (options, def, label) => ({ type: 'enum', options, default: def, label })
const R_ = (min, max, step, def, label, unit) => ({ type: 'range', min, max, step, default: def, label, ...(unit ? { unit } : {}) })

// ------------------------------------------------------------------ the Dasikong blade

/** reference outlines (blade space), fitted to face-blades: centre half width 69 at the top (y 207), tip y 27,
 *  hw = 69·((y − 27)/180)^0.65; the corner blades: 57 at the top, tip y 45, power 0.35 (they stay broad to low down) */
export const DASIKONG_WARPS = {
  centre: { top: [-69, 69], tip: [0, 27], y0: 207, power: 0.65 },
  corner: { top: [-57, 57], tip: [0, 45], y0: 207, power: 0.35 },
}
const FY = (fy) => 119 + (fy - 99.8) * 0.9711 // face-blades y (mm) → vessel y (the face's up is tilted 13.8°)

// ridge classes (× the work's base profile: pitch 1.4 / width 0.91 / height 0.75). The FIGURES (border bundles,
// brow, horn, nose) are fatter ridges standing on a low plateau ringed by a sunk channel; the spirals lie lower,
// between them. That two-level build and the 65 : 35 ridge : groove ratio are what make it read fat, not fine.
const FIGURE_PLATEAU = { height: 1.0, margin: 0.45, channel: 0.9, channelDepth: 0.7 }
const CLASSES = {
  spiral: { pitch: 1, width: 1 },
  bundle: { pitch: 1.36, width: 1.36, height: 1.2, plateau: FIGURE_PLATEAU },
  figure: { pitch: 1.5, width: 1.5, height: 1.33, plateau: FIGURE_PLATEAU },
  brow: { pitch: 1.71, width: 1.71, height: 1.33, plateau: FIGURE_PLATEAU },
}

/**
 * Draw one Dasikong blade into `work` (a RidgeWork whose transform takes BLADE space to panel mm).
 * opts: variant 'centre' | 'corner', lug (true: the centre blade's lower middle is left to the lug and its hole),
 * warp: optional bladeWarp params to re-warp the composition (lean / taper in the atlas), base: { pitch, width,
 * height, groove } (the spiral ridge; the other classes scale from it).
 * → { elements: [{ kind, name }], warp }
 */
export function dasikongBlade(work, { variant = 'centre', lug = true, warp = null, base = {} } = {}) {
  const ref = bladeWarp(DASIKONG_WARPS[variant])
  const W = warp ? bladeWarp({ ...DASIKONG_WARPS[variant], ...warp }) : null
  const view = W ? work.view((p) => W(ref.inverse(p))) : work
  const b = ridgeProfile({ ...work.profile, ...base })
  const cls = (name, extra = {}) => {
    const c = CLASSES[name]
    const k = base.plateauScale ?? 1
    const plateau = c.plateau && k > 0 ? { ...c.plateau, height: c.plateau.height * k } : null
    return { pitch: b.pitch * c.pitch, width: b.width * c.width, height: b.height * (c.height ?? 1), groove: b.groove, ...(plateau ? { plateau } : {}), ...extra }
  }
  const F = (x, fy) => [x, FY(fy)]
  const E = (d, fy) => [ref.edgeX(-1, d, FY(fy)), FY(fy)]
  const edge = (d, fyA, fyB) => ref.edge(-1, d, FY(fyA), FY(fyB), 2)
  const L = [] // left half: drawn, then mirrored
  const C = [] // on the axis: drawn once
  const add = (list, kind, name, geom, o) => list.push({ kind, name, geom, o })

  // a fat, round-ended kui-like hooked band (G) for the top frieze
  const G = (x0, x1, top, bot, inner) => [F(x0, top), F(x1, top), F(x1, bot), F(inner, bot), F(inner, (top + bot) / 2 + 0.6)]
  if (variant === 'centre') {
    const top = 207
    // ---- edge figures (edge-relative): a 4-ridge border bundle on its plateau, a column of interlocking S-hooks from
    // under the eye to near the tip, and below the cheek a 3-ridge inner bundle
    add(L, 'ridgeBand', 'border bundle', ref.edge(-1, 4.5, top - 3.7, 37, 2), { ...cls('bundle'), ridges: 4, start: 'square', end: 'round' })
    add(L, 'scrollChain', 'scroll column', edge(13.8, 150, 44), { ...cls('spiral'), strip: 8.4, spacing: 9, alternate: true, turns: 1.6, form: 'S', vary: 0.14, seed: 3 })
    add(L, 'ridgeBand', 'inner bundle', edge(22.2, 102, 55), { ...cls('bundle'), ridges: 3, start: 'round', end: 'round' })
    // ---- top frieze (fy 174.3–185.8): per half a squared spiral and a hooked G band under a 2-ridge top border
    add(C, 'ridgeBand', 'top border', [[ref.edgeX(-1, 1.6, 205.2), 205.2], [ref.edgeX(1, 1.6, 205.2), 205.2]], { ...cls('bundle'), ridges: 2, start: 'square', end: 'square' })
    add(L, 'quadSpiral', 'frieze spiral', [E(9.6, 185.8), F(-33, 185.8), F(-33, 174.3), E(9.6, 174.3)], { ...cls('spiral'), start: 0 })
    add(L, 'ridgeBand', 'frieze hook band', G(-10.5, -30.5, 184.4, 176.2, -15), { ...cls('spiral'), ridges: 2, start: 'round', end: 'round', bend: 0.9 })
    add(C, 'ridgeBand', 'frieze nose', [F(0, 186.3), F(0, 173.8)], { ...cls('spiral'), ridges: 2, start: 'round', end: 'round' })
    add(L, 'hookEye', 'frieze coil', F(-5.8, 180), { ...cls('spiral'), w: 6.2, h: 9, shape: 'O', slit: false })
    // ---- the brow: a fat ridge pair right across under the frieze, on its plateau
    add(C, 'ridgeBand', 'brow', [E(9.6, 170.6), [ref.edgeX(1, 9.6, FY(170.6)), FY(170.6)]], { ...cls('brow'), ridges: 2, start: 'round', end: 'round' })
    // ---- the horn: a broad 4-ridge figure out from the nose, down the outer side and back in under the upper spiral
    add(L, 'ridgeBand', 'horn band', [F(-9.3, 162.7), F(-31, 162.7), F(-31, 134), F(-12, 134)], { ...cls('figure'), ridges: 4, start: 'round', end: 'round', bend: 1.2 })
    add(L, 'hookEye', 'eye', F(-42.6, 160.2), { ...cls('spiral'), w: 8.6, h: 8, shape: 'D', angle: -8 })
    add(L, 'quadSpiral', 'upper spiral', [F(-25.5, 157.4), F(-4.6, 157.4), F(-4.6, 139.3), F(-25.5, 139.3)], { ...cls('spiral'), start: 1, dir: -1 })
    // ---- the cheek: the big squared spiral leaning with the edge, then the jaw spiral
    add(L, 'quadSpiral', 'cheek spiral', [E(18.4, 128.6), F(-4.6, 128.6), F(-4.6, 104.2), E(18.4, 104.2)], { ...cls('spiral'), start: 0, corner: b.pitch * 1.4 })
    add(L, 'quadSpiral', 'jaw spiral', [E(26.3, 103.2), F(-4.6, 103.2), F(-4.6, 96), E(26.3, 96)], { ...cls('spiral'), start: 1, dir: -1 })
    // ---- the nose figure
    add(C, 'ridgeBand', 'nose', [F(0, 162.5), F(0, lug ? 99 : 30)], { ...cls('figure'), ridges: 3, start: 'round', end: 'round' })
    // ---- above the lug's hole: one spiral cell per half
    add(L, 'quadSpiral', 'lug-top spiral', [E(26.3, 94.6), F(-1.0, 94.6), F(-1.0, 83), E(26.3, 83)], { ...cls('spiral'), start: 0 })
  } else {
    const top = 207
    add(L, 'ridgeBand', 'border bundle', ref.edge(-1, 4.5, top - 3.7, 47, 2), { ...cls('bundle'), ridges: 4, start: 'square', end: 'round' })
    // a column of tall squared spirals (nested rectangles) just inside the border
    for (const [t, bt] of [[165, 147.5], [145.5, 129], [127, 112], [110, 95], [93, 78], [76, 61]]) {
      add(L, 'quadSpiral', 'column spiral', [E(9.7, t), E(17.6, t), E(17.6, bt), E(9.7, bt)], { ...cls('spiral'), start: 0 })
    }
    add(L, 'ridgeBand', 'hook bundle', edge(21.6, 127, 101), { ...cls('bundle'), ridges: 3, start: 'round', end: 'round' })
    add(L, 'scrollChain', 'scroll column', edge(22, 99, 62), { ...cls('spiral'), strip: 8.2, spacing: 8.8, alternate: true, form: 'S', vary: 0.14, seed: 5 })
    add(C, 'ridgeBand', 'top border', [[ref.edgeX(-1, 1.6, 205.2), 205.2], [ref.edgeX(1, 1.6, 205.2), 205.2]], { ...cls('bundle'), ridges: 2, start: 'square', end: 'square' })
    add(L, 'quadSpiral', 'frieze spiral', [E(9.6, 185.8), F(-22, 185.8), F(-22, 174.3), E(9.6, 174.3)], { ...cls('spiral'), start: 0 })
    add(L, 'ridgeBand', 'frieze hook band', G(-4.8, -20, 184.4, 176.2, -9), { ...cls('spiral'), ridges: 2, start: 'round', end: 'round', bend: 0.9 })
    add(C, 'ridgeBand', 'brow', [E(9.6, 170.6), [ref.edgeX(1, 9.6, FY(170.6)), FY(170.6)]], { ...cls('brow'), ridges: 2, start: 'round', end: 'round' })
    add(L, 'ridgeBand', 'horn band', [F(-9.3, 162.7), E(30, 162.7), E(30, 134), F(-12, 134)], { ...cls('figure'), ridges: 4, start: 'round', end: 'round', bend: 1.2 })
    add(L, 'hookEye', 'eye', E(21, 160), { ...cls('spiral'), w: 6.5, h: 7, shape: 'D', angle: -8 })
    add(L, 'quadSpiral', 'upper spiral', [E(35.5, 157.4), F(-4.6, 157.4), F(-4.6, 139.3), E(35.5, 139.3)], { ...cls('spiral'), start: 1, dir: -1 })
    add(L, 'quadSpiral', 'cheek spiral', [E(26.2, 128.6), F(-4.6, 128.6), F(-4.6, 111), E(26.2, 111)], { ...cls('spiral'), start: 0, corner: b.pitch * 1.4 })
    add(L, 'quadSpiral', 'jaw spiral', [E(26.4, 110), F(-4.6, 110), F(-4.6, 99.5), E(26.4, 99.5)], { ...cls('spiral'), start: 1, dir: -1 })
    add(L, 'quadSpiral', 'low spiral', [E(26.5, 98.5), F(-4.6, 98.5), F(-4.6, 88), E(26.5, 88)], { ...cls('spiral'), start: 0 })
    add(L, 'quadSpiral', 'lowest spiral', [E(26.5, 87), F(-4.6, 87), F(-4.6, 76), E(26.5, 76)], { ...cls('spiral'), start: 1, dir: -1 })
    add(C, 'ridgeBand', 'nose', [F(0, 162), F(0, 62)], { ...cls('figure'), ridges: 3, start: 'round', end: 'round' })
  }
  const run = (w, el) => w[el.kind](el.geom, el.o)
  const mir = view.mirror(0)
  for (const el of L) { run(view, el); run(mir, el) }
  for (const el of C) run(view, el)
  const Wb = W || ref
  // the blade outline in panel mm (through the caller's transform): the include region for kit.ridgeGround
  return { elements: [...L, ...C].map(({ kind, name }) => ({ kind, name })), warp: Wb, outline: Wb.outline(2).map((p) => work.T(p)) }
}

// ------------------------------------------------------------------ atlas

export const schema = {
  unit: E_(['vocabulary', 'quad-spiral', 'ridge-band', 'hook-eye', 'slit-eye', 'scroll-chain', 'ridge-border', 'dasikong-blade', 'dasikong-corner'], 'vocabulary', 'Unit'),
  width: R_(0.3, 2, 0.02, 0.91, 'Ridge width', 'mm'),
  pitch: R_(0.6, 3.5, 0.05, 1.4, 'Pitch (ridge + groove)', 'mm'),
  height: R_(0.15, 1.6, 0.05, 0.75, 'Ridge height', 'mm'),
  groove: R_(0, 0.8, 0.02, 0.35, 'Groove below ground', 'mm'),
  crown: R_(0, 1, 0.05, 1, 'Crown (parabolic → round)'),
  turns: R_(1, 9, 0.5, 5, 'Spiral turns'),
  lean: R_(-35, 35, 1, 14, 'Lean', '°'),
  ridges: R_(1, 7, 1, 3, 'Ridges per band'),
  plateau: R_(0, 2, 0.05, 1, 'Figure plateau', 'mm'),
  taper: R_(0.3, 1, 0.05, 1, 'Band taper (end spacing ×)'),
}

export const presets = {
  vocabulary: { unit: 'vocabulary' },
  'quad-spiral': { unit: 'quad-spiral', turns: 6, lean: 16 },
  'ridge-band': { unit: 'ridge-band', ridges: 4 },
  'hook-eye': { unit: 'hook-eye' },
  'slit-eye': { unit: 'slit-eye' },
  'scroll-chain': { unit: 'scroll-chain', lean: 18 },
  'ridge-border': { unit: 'ridge-border', ridges: 3 },
  'dasikong-blade': { unit: 'dasikong-blade', lean: 0 },
  'dasikong-corner': { unit: 'dasikong-corner', lean: 0 },
}

export const presetPlaques = {
  vocabulary: { w: 190, h: 60 },
  'quad-spiral': { w: 70, h: 50 },
  'ridge-band': { w: 70, h: 50 },
  'hook-eye': { w: 40, h: 30 },
  'slit-eye': { w: 50, h: 30 },
  'scroll-chain': { w: 50, h: 80 },
  'ridge-border': { w: 70, h: 50 },
  'dasikong-blade': { w: 146, h: 188 },
  'dasikong-corner': { w: 122, h: 170 },
}

const tanD = (d) => Math.tan((d * Math.PI) / 180)

export function draw(panel, rect, p) {
  const work = new RidgeWork(panel, { width: p.width, pitch: p.pitch, height: p.height, groove: p.groove, crown: p.crown })
  const { x, y, w, h } = rect
  const sh = tanD(p.lean)
  // one primitive alone, in a cell of the plaque; lean shears its geometry
  const cellQuad = (cx, cy, cw, ch) => [[cx - cw / 2 + (sh * ch) / 2, cy + ch / 2], [cx + cw / 2 + (sh * ch) / 2, cy + ch / 2], [cx + cw / 2 - (sh * ch) / 2 - cw * 0.12, cy - ch / 2], [cx - cw / 2 - (sh * ch) / 2 + cw * 0.06, cy - ch / 2]]
  const spiral = (cx, cy, cw, ch) => work.quadSpiral(cellQuad(cx, cy, cw, ch), { turns: p.turns, pitch: undefined })
  const band = (cx, cy, s) => work.ridgeBand([[cx - 14 * s, cy + 10 * s], [cx + 10 * s + sh * 20 * s, cy + 10 * s], [cx + 10 * s, cy - 12 * s], [cx - 4 * s, cy - 12 * s]], { ridges: p.ridges, start: 'round', end: 'spiral', dir: 1, turns: 0.7, taper: [1, p.taper], pitch: p.pitch * 1.5, width: p.width * 1.5, height: p.height * 1.33, plateau: p.plateau > 0 ? { height: p.plateau, channel: 0.9, channelDepth: 0.7 } : null })
  const eye = (cx, cy) => work.hookEye([cx, cy], { w: 11, h: 8.5, angle: p.lean * 0.5 })
  const slit = (cx, cy) => work.slitEye([cx, cy], { w: 16, h: 8.5, squareness: 0.55, angle: -p.lean * 0.3, ring: { ridges: 1 } })
  const scrolls = (cx, y0, y1) => work.scrollChain([[cx + (sh * (y1 - y0)) / 2, y1], [cx - (sh * (y1 - y0)) / 2, y0]], { strip: 9, alternate: true, form: 'S', vary: 0.14 })
  const border = (cx, cy, bw, bh) => work.ridgeBorder(cellQuad(cx, cy, bw, bh), { ridges: p.ridges, closed: true, bend: 1.5, pitch: p.pitch * 1.36, width: p.width * 1.36, plateau: p.plateau > 0 ? { height: p.plateau, channel: 0.9, channelDepth: 0.7 } : null })
  switch (p.unit) {
    case 'vocabulary': {
      const cy = y + h / 2
      spiral(x + 20, cy, 30, 40)
      band(x + 60, cy + 4, 1.0)
      eye(x + 92, cy + 12); slit(x + 92, cy - 12)
      scrolls(x + 118, y + 6, y + h - 6)
      border(x + 160, cy, 46, 44)
      work.quadSpiral(cellQuad(x + 160, cy, 46 - 2 * p.ridges * p.pitch - 3, 44 - 2 * p.ridges * p.pitch - 3), { turns: Math.max(1, p.turns - 2) })
      break
    }
    case 'quad-spiral': spiral(x + w / 2, y + h / 2, w - 16, h - 6); break
    case 'ridge-band': band(x + w / 2 - 2, y + h / 2 + 7, 0.92); break
    case 'hook-eye': eye(x + w / 2, y + h / 2); break
    case 'slit-eye': slit(x + w / 2, y + h / 2); break
    case 'scroll-chain': scrolls(x + w / 2, y + 4, y + h - 4); break
    case 'ridge-border': border(x + w / 2, y + h / 2, w - 18, h - 6); break
    case 'dasikong-blade':
    case 'dasikong-corner': {
      const variant = p.unit === 'dasikong-blade' ? 'centre' : 'corner'
      const ref = DASIKONG_WARPS[variant]
      const v = work.view(([bx, by]) => [x + w / 2 + bx, y + by - (variant === 'centre' ? 23 : 41)])
      const lean = tanD(p.lean) * (ref.y0 - ref.tip[1])
      const r = dasikongBlade(v, { variant, lug: false, warp: p.lean ? { tip: [lean, ref.tip[1]] } : null, base: { plateauScale: p.plateau } })
      work.flush()
      ridgeGround(panel, { rect, include: (ctx) => { ctx.beginPath(); r.outline.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath(); ctx.fill() } }, { width: p.width, pitch: p.pitch, height: p.height })
      return
    }
  }
  work.flush()
}

export default {
  name: 'ridges', label: 'Ridge work (round ridges)', schema, presets, presetPlaques, draw,
  symmetric: false, ground: false, plaque: { w: 190, h: 60 },
}
