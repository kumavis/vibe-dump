// Bosses / nipples (乳钉) and the boss-in-lozenge lattice (乳钉雷纹 / 斜方格乳钉纹)
// — research/01 §4.5.
//
//   layout 'lattice'  a diagonal lattice of raised single or double ridges
//                     (lozenge side 12–25 mm, lines 60–70° from horizontal),
//                     a nipple in every lozenge, leiwen around it (gui / ding bellies)
//          'grid'     free nipples on a staggered grid, no lattice (the U-frame of a
//                     fangding's plain wall: 2–3 rows)
//          'row'      one row along the rect's long axis
//          'single'   one nipple in the middle of the rect
// Nipples: base Ø 3–8 mm, height 2–8 mm; 'pointed' (Yinxu III–IV) or 'dome'.
// Not mirrored: the lattice is laid out symmetric about the rect's centre.

import { E, R, reliefSchema, withRelief } from './_strokes.js'

export const schema = {
  layout: E(['lattice', 'grid', 'row', 'single'], 'lattice', 'Layout'),
  side: R(8, 30, 0.5, 20, 'Lozenge side / spacing', 'mm'),
  angle: R(45, 75, 1, 64, 'Lattice angle', '°'),
  lines: E(['double', 'single'], 'double', 'Lattice lines'),
  ridge: R(0.6, 2.5, 0.05, 1.1, 'Ridge width', 'mm'),
  ridgeHeight: R(0.3, 2, 0.05, 0.9, 'Ridge height', 'mm'),
  nipple: R(1.5, 6, 0.1, 2.6, 'Nipple base radius', 'mm'),
  nippleHeight: R(1, 8, 0.1, 3.4, 'Nipple height', 'mm'),
  shape: E(['pointed', 'dome'], 'pointed', 'Nipple shape'),
  rows: R(1, 4, 1, 3, 'Rows (grid)'),
  ...reliefSchema({ motif: 1, boss: 3.4, groove: 0.4, lineWeight: 0.5 }),
}

export const presets = {
  lattice: {},
  'single-lines': { lines: 'single', angle: 60, side: 14 },
  // a large, heavy Yinxu III gui belly
  'gui-belly': { side: 20, nipple: 3.4, nippleHeight: 5.5, ridge: 1.3 },
  // the fangding plain-wall frame (§4.5): free nipples, no lattice
  'fangding-frame': { layout: 'grid', side: 14, rows: 3, nipple: 3.2, nippleHeight: 3.6, shape: 'dome' },
  row: { layout: 'row', side: 12, nipple: 3, nippleHeight: 3.2, shape: 'dome' },
  single: { layout: 'single', nipple: 4, nippleHeight: 5 },
}

export const presetPlaques = { row: { w: 140, h: 18 }, single: { w: 30, h: 30 }, 'fangding-frame': { w: 160, h: 46 } }

/** Nipple profile: a cone with a softened tip ('pointed') or a spherical cap. */
function nippleProfile(shape) {
  return shape === 'dome'
    ? (s, w) => (s <= 0 ? 0 : Math.sqrt(1 - (1 - Math.min(1, s / w)) ** 2))
    : (s, w) => {
      if (s <= 0) return 0
      const t = Math.min(1, s / w)
      const foot = Math.min(1, s / (w * 0.12)) // a short steep foot
      return Math.min(foot, 0.25 + 0.75 * Math.pow(t, 0.85)) * (1 - 0.08 * Math.pow(t, 6))
    }
}

export function nipples(panel, centres, p) {
  const r = p.nipple
  panel.raise((ctx) => {
    for (const [x, y] of centres) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill() }
  }, { height: p.nippleHeight, shoulder: r, profile: nippleProfile(p.shape) })
}

export function draw(panel, rect, params) {
  const p = withRelief(params)
  const cx = rect.x + rect.w / 2, cy = rect.y + rect.h / 2
  if (p.layout === 'single') return nipples(panel, [[cx, cy]], p)
  if (p.layout === 'row') {
    const horiz = rect.w >= rect.h
    const L = horiz ? rect.w : rect.h
    const n = Math.max(1, Math.round(L / p.side))
    const c = []
    for (let i = 0; i < n; i++) {
      const t = (i + 0.5) / n
      c.push(horiz ? [rect.x + t * rect.w, cy] : [cx, rect.y + t * rect.h])
    }
    return nipples(panel, c, p)
  }
  if (p.layout === 'grid') {
    const sp = p.side
    const nx = Math.max(1, Math.round(rect.w / sp)), ny = Math.max(1, Math.min(p.rows | 0, Math.round(rect.h / sp)))
    const dx = rect.w / nx, dy = rect.h / ny
    const c = []
    for (let j = 0; j < ny; j++) {
      const off = j % 2 ? 0.5 : 0
      for (let i = 0; i < nx - (off ? 1 : 0); i++) c.push([rect.x + (i + 0.5 + off) * dx, rect.y + (j + 0.5) * dy])
    }
    return nipples(panel, c, p)
  }
  // ---- lattice
  const th = (p.angle * Math.PI) / 180
  const sn = Math.sin(th), cs = Math.cos(th)
  const d = p.side * Math.sin(Math.PI - 2 * th) || p.side // spacing between parallel lines
  // u = x sinθ − y cosθ, v = x sinθ + y cosθ (about the centre); lines at (k + ½)·d
  const ext = Math.hypot(rect.w, rect.h)
  const kmax = Math.ceil(ext / d) + 1
  const gapD = p.ridge * 1.15 // double-line separation (centre to centre)
  panel.raise((ctx) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(rect.x, rect.y, rect.w, rect.h)
    ctx.clip()
    ctx.lineWidth = p.ridge
    ctx.lineCap = 'butt'
    const offs = p.lines === 'double' ? [-gapD / 2, gapD / 2] : [0]
    for (let k = -kmax; k <= kmax; k++) {
      for (const o of offs) {
        const c = (k + 0.5) * d + o
        // family A: x sinθ − y cosθ = c → direction (cosθ, sinθ); point on it: (c sinθ, −c cosθ)
        const ax = cx + c * sn, ay = cy - c * cs
        ctx.beginPath(); ctx.moveTo(ax - cs * ext, ay - sn * ext); ctx.lineTo(ax + cs * ext, ay + sn * ext); ctx.stroke()
        // family B: x sinθ + y cosθ = c → direction (cosθ, −sinθ)
        const bx = cx + c * sn, by = cy + c * cs
        ctx.beginPath(); ctx.moveTo(bx - cs * ext, by + sn * ext); ctx.lineTo(bx + cs * ext, by - sn * ext); ctx.stroke()
      }
    }
    ctx.restore()
  }, { height: p.ridgeHeight, profile: 'ridge' })
  // nipples at lozenge centres u = i·d, v = j·d
  const c = []
  const lim = p.nipple + p.ridge
  for (let i = -kmax; i <= kmax; i++) {
    for (let j = -kmax; j <= kmax; j++) {
      const u = i * d, v = j * d
      const x = cx + (u + v) / (2 * sn), y = cy + (v - u) / (2 * cs)
      if (x - lim < rect.x || x + lim > rect.x + rect.w || y - lim < rect.y || y + lim > rect.y + rect.h) continue
      c.push([x, y])
    }
  }
  nipples(panel, c, p)
}

export default {
  name: 'boss', label: 'Bosses / boss lattice', schema, presets, presetPlaques, draw,
  symmetric: false, plaque: { w: 120, h: 80 },
  groundOptions: (p) => ({ pitch: Math.max(0.8, Math.min(1.8, p.side * 0.075)) }),
}
