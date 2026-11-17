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

import { RidgeWork, bladeWarp, ridgeProfile } from '../ridges.js'

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

// ridge classes (× the work's base profile: pitch 1.4 / width 0.78 unless overridden)
const CLASSES = {
  spiral: { pitch: 1, width: 1 },
  bundle: { pitch: 1.15, width: 1.1 },
  brow: { pitch: 1.43, width: 1.38, height: 1.15 },
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
    return { pitch: b.pitch * c.pitch, width: b.width * c.width, height: b.height * (c.height ?? 1), groove: b.groove, ...extra }
  }
  const F = (x, fy) => [x, FY(fy)]
  const E = (d, fy) => [ref.edgeX(-1, d, FY(fy)), FY(fy)]
  const edge = (d, fyA, fyB) => ref.edge(-1, d, FY(fyA), FY(fyB), 2)
  const L = [] // left half: drawn, then mirrored
  const C = [] // on the axis: drawn once
  const add = (list, kind, name, geom, o) => list.push({ kind, name, geom, o })

  if (variant === 'centre') {
    const top = 207
    // ---- edge strips (edge-relative): a 5-ridge border bundle, a column of S-scrolls from under the eye to the tip,
    // and below the cheek a 4-ridge inner bundle
    add(L, 'ridgeBand', 'border bundle', ref.edge(-1, 4.2, top - 3.7, 37, 2), { ...cls('bundle'), ridges: 5, start: 'square', end: 'round' })
    add(L, 'scrollChain', 'scroll column', edge(13.2, 150, 44), { ...cls('spiral'), strip: 8.6, spacing: 9.2, alternate: true, turns: 1.5 })
    add(L, 'ridgeBand', 'inner bundle', edge(21.5, 111.5, 55), { ...cls('bundle'), ridges: 4, start: 'round', end: 'round' })
    // ---- top frieze (fy 173.5–186.5): two squared spirals per half under a two-ridge top border
    add(C, 'ridgeBand', 'top border', [[ref.edgeX(-1, 1.6, 205.6), 205.6], [ref.edgeX(1, 1.6, 205.6), 205.6]], { ...cls('bundle'), ridges: 2, start: 'square', end: 'square' })
    add(L, 'quadSpiral', 'frieze spiral (outer)', [E(9, 186.5), F(-32, 186.5), F(-32, 173.5), E(9, 173.5)], { ...cls('spiral'), start: 0 })
    add(L, 'quadSpiral', 'frieze spiral (inner)', [F(-32, 186.5), F(-10.6, 186.5), F(-10.6, 173.5), F(-32, 173.5)], { ...cls('spiral'), start: 1, dir: -1 })
    add(C, 'ridgeBand', 'frieze nose', [F(0, 186.8), F(0, 172.5)], { ...cls('spiral'), ridges: 2, start: 'round', end: 'round' })
    add(L, 'hookEye', 'frieze coil', F(-5.8, 179.6), { ...cls('spiral'), w: 6.4, h: 9, shape: 'O', slit: false })
    // ---- the brow: a fat ridge pair right across under the frieze
    add(L, 'ridgeBand', 'brow', [E(9, 171), F(-3.2, 171)], { ...cls('brow'), ridges: 2, start: 'square', end: 'round' })
    // ---- the horn: a broad 5-ridge band out from the nose, down the outer side and back in under the upper spiral
    // (an inverted C open to the axis); the hooked eye at its outer end
    add(L, 'ridgeBand', 'horn band', [F(-4.6, 164.2), F(-36, 164.2), F(-36, 143.6), F(-10, 143.6)], { ...cls('spiral'), pitch: b.pitch * 1.07, ridges: 5, start: 'square', end: 'round', bend: 1.2 })
    add(L, 'hookEye', 'eye', F(-47, 160.5), { ...cls('spiral'), w: 9.2, h: 8, shape: 'D', angle: -8 })
    add(L, 'quadSpiral', 'upper spiral', [F(-32, 160.4), F(-4.6, 160.4), F(-4.6, 147.4), F(-32, 147.4)], { ...cls('spiral'), start: 1, dir: -1 })
    // ---- the cheek: the big leaning spiral, then the jaw spiral under it
    add(L, 'quadSpiral', 'cheek spiral', [E(18.6, 139.3), F(-4.4, 139.3), F(-4.4, 113.6), E(18.6, 113.6)], { ...cls('spiral'), start: 0 })
    add(L, 'quadSpiral', 'jaw spiral', [E(24.8, 112.2), F(-4.4, 112.2), F(-4.4, 100.4), E(24.8, 100.4)], { ...cls('spiral'), start: 1, dir: -1 })
    // ---- the nose ridge bundle
    add(C, 'ridgeBand', 'nose', [F(0, 168.2), F(0, lug ? 100.5 : 30)], { ...cls('spiral'), pitch: b.pitch * 1.07, ridges: 3, start: 'round', end: 'round' })
    // ---- above the lug's hole: one spiral cell per half
    add(L, 'quadSpiral', 'lug-top spiral', [E(24.8, 97.8), F(-1.0, 97.8), F(-1.0, 83), E(24.8, 83)], { ...cls('spiral'), start: 0 })
  } else {
    const top = 207
    add(L, 'ridgeBand', 'border bundle', ref.edge(-1, 4.2, top - 3.7, 47, 2), { ...cls('bundle'), ridges: 5, start: 'square', end: 'round' })
    // a column of tall squared spirals (nested rectangles) just inside the border
    for (const [t, bt] of [[165, 147.5], [145.5, 129], [127, 112], [110, 95], [93, 78], [76, 61]]) {
      add(L, 'quadSpiral', 'column spiral', [E(8.8, t), E(16.6, t), E(16.6, bt), E(8.8, bt)], { ...cls('spiral'), start: 0 })
    }
    add(L, 'ridgeBand', 'hook bundle', edge(21.2, 148, 101), { ...cls('bundle'), ridges: 3, start: 'round', end: 'round' })
    add(L, 'scrollChain', 'scroll column', edge(21.7, 99, 62), { ...cls('spiral'), strip: 8.2, spacing: 8.8, alternate: true })
    add(C, 'ridgeBand', 'top border', [[ref.edgeX(-1, 1.6, 205.6), 205.6], [ref.edgeX(1, 1.6, 205.6), 205.6]], { ...cls('bundle'), ridges: 2, start: 'square', end: 'square' })
    add(L, 'quadSpiral', 'frieze spiral (outer)', [E(9, 186.5), F(-22, 186.5), F(-22, 173.5), E(9, 173.5)], { ...cls('spiral'), start: 0 })
    add(L, 'quadSpiral', 'frieze spiral (inner)', [F(-22, 186.5), F(-3, 186.5), F(-3, 173.5), F(-22, 173.5)], { ...cls('spiral'), start: 1, dir: -1 })
    add(C, 'ridgeBand', 'frieze nose', [F(0, 186.8), F(0, 172.5)], { ...cls('spiral'), ridges: 1, start: 'square', end: 'square' })
    add(L, 'ridgeBand', 'brow', [E(8.8, 171), F(-3.6, 171)], { ...cls('brow'), ridges: 2, start: 'square', end: 'round' })
    add(L, 'ridgeBand', 'horn band', [F(-3.4, 164.5), E(30, 164.5), E(30, 143), F(-8, 143)], { ...cls('spiral'), pitch: b.pitch * 1.07, ridges: 4, start: 'square', end: 'round', bend: 1.2 })
    add(L, 'hookEye', 'eye', E(22, 160), { ...cls('spiral'), w: 7.5, h: 7.5, shape: 'D', angle: -8 })
    add(L, 'quadSpiral', 'upper spiral', [E(33, 160.8), F(-3.4, 160.8), F(-3.4, 146.6), E(33, 146.6)], { ...cls('spiral'), start: 1, dir: -1 })
    add(L, 'quadSpiral', 'cheek spiral', [E(26.5, 139.6), F(-3.5, 139.6), F(-3.5, 118), E(26.5, 118)], { ...cls('spiral'), start: 0 })
    add(L, 'quadSpiral', 'jaw spiral', [E(27.5, 115.6), F(-3.5, 115.6), F(-3.5, 102), E(27.5, 102)], { ...cls('spiral'), start: 1, dir: -1 })
    add(L, 'quadSpiral', 'low spiral', [E(27, 99.5), F(-3.5, 99.5), F(-3.5, 89), E(27, 89)], { ...cls('spiral'), start: 0 })
    add(L, 'quadSpiral', 'lowest spiral', [E(27, 86.5), F(-3.5, 86.5), F(-3.5, 76), E(27, 76)], { ...cls('spiral'), start: 1, dir: -1 })
    add(C, 'ridgeBand', 'nose', [F(0, 166), F(0, 62)], { ...cls('spiral'), ridges: 3, start: 'round', end: 'round' })
  }
  const run = (w, el) => w[el.kind](el.geom, el.o)
  const mir = view.mirror(0)
  for (const el of L) { run(view, el); run(mir, el) }
  for (const el of C) run(view, el)
  return { elements: [...L, ...C].map(({ kind, name }) => ({ kind, name })), warp: W || ref }
}

// ------------------------------------------------------------------ atlas

export const schema = {
  unit: E_(['vocabulary', 'quad-spiral', 'ridge-band', 'hook-eye', 'slit-eye', 'scroll-chain', 'ridge-border', 'dasikong-blade', 'dasikong-corner'], 'vocabulary', 'Unit'),
  width: R_(0.3, 2, 0.02, 0.78, 'Ridge width', 'mm'),
  pitch: R_(0.6, 3.5, 0.05, 1.4, 'Pitch (ridge + groove)', 'mm'),
  height: R_(0.15, 1.6, 0.05, 0.6, 'Ridge height', 'mm'),
  groove: R_(0, 0.8, 0.02, 0.3, 'Groove below ground', 'mm'),
  crown: R_(0, 1, 0.05, 1, 'Crown (parabolic → round)'),
  turns: R_(1, 9, 0.5, 5, 'Spiral turns'),
  lean: R_(-35, 35, 1, 14, 'Lean', '°'),
  ridges: R_(1, 7, 1, 3, 'Ridges per band'),
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
  const band = (cx, cy, s) => work.ridgeBand([[cx - 14 * s, cy + 10 * s], [cx + 10 * s + sh * 20 * s, cy + 10 * s], [cx + 10 * s, cy - 12 * s], [cx - 4 * s, cy - 12 * s]], { ridges: p.ridges, start: 'round', end: 'spiral', dir: 1, turns: 0.7, taper: [1, p.taper] })
  const eye = (cx, cy) => work.hookEye([cx, cy], { w: 11, h: 8.5, angle: p.lean * 0.5 })
  const slit = (cx, cy) => work.slitEye([cx, cy], { w: 16, h: 8.5, squareness: 0.55, angle: -p.lean * 0.3, ring: { ridges: 1 } })
  const scrolls = (cx, y0, y1) => work.scrollChain([[cx + (sh * (y1 - y0)) / 2, y1], [cx - (sh * (y1 - y0)) / 2, y0]], { strip: 9, alternate: true })
  const border = (cx, cy, bw, bh) => work.ridgeBorder(cellQuad(cx, cy, bw, bh), { ridges: p.ridges, closed: true, bend: 1.5 })
  switch (p.unit) {
    case 'vocabulary': {
      const cy = y + h / 2
      spiral(x + 20, cy, 30, 40)
      band(x + 60, cy, 1.25)
      eye(x + 92, cy + 12); slit(x + 92, cy - 12)
      scrolls(x + 118, y + 6, y + h - 6)
      border(x + 160, cy, 46, 44)
      work.quadSpiral(cellQuad(x + 160, cy, 46 - 2 * p.ridges * p.pitch - 3, 44 - 2 * p.ridges * p.pitch - 3), { turns: Math.max(1, p.turns - 2) })
      break
    }
    case 'quad-spiral': spiral(x + w / 2, y + h / 2, w - 16, h - 6); break
    case 'ridge-band': band(x + w / 2 - 2, y + h / 2 + 5, 1.15); break
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
      dasikongBlade(v, { variant, lug: false, warp: p.lean ? { tip: [lean, ref.tip[1]] } : null })
      break
    }
  }
  work.flush()
}

export default {
  name: 'ridges', label: 'Ridge work (round ridges)', schema, presets, presetPlaques, draw,
  symmetric: false, ground: false, plaque: { w: 190, h: 60 },
}
