// STATUS: first pass — Eastern Zhou 蟠螭 interlace: a tileable "panchi" unit stamped in rows (pattern-block décor).
//
// Spring and Autumn bronzes (7th–5th c. BC) are covered by small, dense interlaced serpent bodies cast from
// pattern blocks: one unit (≈ 20–50 mm) pressed again and again into the mould, row after row. On the relief the
// bodies are narrow ROUND RIBS (≈ 1.5 mm wide, ≈ 1 mm proud, domed section), running in straight runs with rounded
// corners, ending in small round knobs (heads, tail tips), crossing each other at beads; the ground between them is
// flat and plain. Nothing like the Anyang plateau-and-leiwen grammar: no flat tops, no ground spirals.
//
// A unit is authored in its own mm frame (w × h, origin bottom-left, y up): ribs are centre-line polylines with
// per-corner fillets and end caps; beads are knobs on a rib or free. panchiBand tiles a unit over rows: each row
// its own cell width (an integer count round the vessel), optional mirroring and half-cell stagger per row, and a
// little hand variation per impression (a pattern block was pressed by hand). All mm, panel frame, y up.
//
//   panchiBand(panel, rect, { unit, rows: [{ h | weight, count | cell, mirror, shift, flip }], rib, height, knob,
//     knobHeight, gap, centre, jitter, seed })  → { rows: [{ y0, y1, cell, count }], ms }
//   ropeCord(panel, { x0, x1, y, width, height, pitch, slant, depth })   twisted cord (绹纹): a domed band cut by slanted grooves
//   plainCord(panel, { x0, x1, y, width, height })                        a plain round cord (弦纹)
//   PANCHI_UNITS  the traced units (mm), e.g. 'nezu-hu'

import { fillet } from './shapes.js'
import { Rng } from '../util/rng.js'

/**
 * Traced units. `ribs`: { pts: [[x, y]…] (centre line, unit mm), r: fillet radius mm (number | per vertex),
 * caps: [start, end] 'knob' | 'round' | 'flat' }; `beads`: [[x, y, r?]] extra knobs (junctions, eyes).
 */
export const PANCHI_UNITS = {
  // Nezu Museum hu 90099 (reference/nezu-hu, photo-11 developed onto the shoulder band, faces/dev-shoulder.jpg):
  // one impression ≈ 24 × 17.6 mm on the shoulder (rows of ≈ 17.6 mm; ≈ 48 mm repeat = the unit and its mirror).
  // Read off the front of rows 2–3: a U-shaped body whose left limb runs out into a bar along the top of the row
  // (into the neighbour) with a tongue hanging in its bay; a D-shaped body to its right, open to the left, an eye
  // spur in its bay; a bar along the foot of the row turning up at the right; a short hook at the left; a bar over
  // the D; knobs on every free end and beads on the bars.
  'nezu-hu': {
    w: 24,
    h: 17.6,
    ribs: [
      { pts: [[-2.6, 15.0], [5.2, 15.0], [5.2, 4.9], [11.2, 4.9], [11.2, 15.6]], r: [0, 1.9, 2.4, 2.4, 0], caps: ['knob', 'knob'] },
      { pts: [[8.2, 15.4], [8.2, 9.2]], r: 0, caps: ['round', 'knob'] },
      { pts: [[14.4, 6.6], [19.8, 6.6], [19.8, 13.4], [14.8, 13.4]], r: [0, 2.2, 2.2, 0], caps: ['knob', 'knob'] },
      { pts: [[14.2, 10.0], [16.8, 10.0]], r: 0, caps: ['round', 'knob'] },
      { pts: [[0.6, 1.7], [22.4, 1.7], [22.4, 9.4]], r: [0, 1.8, 0], caps: ['knob', 'knob'] },
      { pts: [[1.6, 12.4], [1.6, 6.6]], r: 0, caps: ['round', 'knob'] },
      { pts: [[13.4, 16.4], [23.6, 16.4]], r: 0, caps: ['knob', 'round'] },
    ],
    beads: [[13.0, 1.7, 1.15], [18.4, 16.4, 1.1], [5.2, 15.0, 1.05]],
  },
}

const lerp = (a, b, t) => a + (b - a) * t

/** a unit's ribs and beads mapped into one cell: x0 (left), y0 (bottom), sx, sy (scale), mirror, jitter offset */
function placeUnit(U, x0, y0, sx, sy, mirror, flip, dx, dy) {
  const X = (x) => x0 + dx + (mirror ? U.w - x : x) * sx
  const Y = (y) => y0 + dy + (flip ? U.h - y : y) * sy
  const ribs = U.ribs.map((rb) => {
    const pts = rb.pts.map(([x, y]) => [X(x), Y(y)])
    const r = Array.isArray(rb.r) ? rb.r.map((v) => v * Math.min(sx, sy)) : (rb.r || 0) * Math.min(sx, sy)
    return { pts: rb.r ? fillet(pts, r, { step: 0.25 }) : pts, caps: rb.caps || ['round', 'round'], w: rb.w || 1 }
  })
  const beads = (U.beads || []).map(([x, y, r]) => [X(x), Y(y), r])
  return { ribs, beads }
}

/**
 * Tile a panchi unit over a band of rows.
 * @param {ReliefPanel} panel
 * @param {{x,y,w,h}} rect  the band (panel mm); rows run from its TOP down
 * @param {object} o
 *   unit: name in PANCHI_UNITS | unit object      rows: [{ h | weight, count | cell (mm), mirror, shift (× cell), flip }]
 *   centre: panel x of a cell boundary (default rect centre: the pattern is symmetric about the sector centre line)
 *   rowWidth: (yRowCentre) => mm — width of the row's surface (a tapering shoulder: the row's own arc); the cell
 *     is rowWidth / count, and drawing is clipped to [centre ± rowWidth/2]
 *   rib 1.5 (mm)  height 1.0 (mm)  knob 1.25 (radius mm)  knobHeight 1.3  gap: rows' top/bottom margin scale (1)
 *   jitter 0.12 (mm per impression)  seed
 */
export function panchiBand(panel, rect, o = {}) {
  const t0 = performance.now()
  const U = typeof o.unit === 'string' || !o.unit ? PANCHI_UNITS[o.unit || 'nezu-hu'] : o.unit
  const rib = o.rib ?? 1.5, height = o.height ?? 1.0
  const knob = o.knob ?? 1.25, knobHeight = o.knobHeight ?? height * 1.3
  const jitter = o.jitter ?? 0.12
  const rng = new Rng(o.seed ?? 7)
  const centre = o.centre ?? rect.x + rect.w / 2
  const rowsIn = o.rows || [{ weight: 1 }]
  const fixed = rowsIn.reduce((a, r) => a + (r.h || 0), 0)
  const wsum = rowsIn.reduce((a, r) => a + (r.h ? 0 : r.weight ?? 1), 0)
  const free = Math.max(0, rect.h - fixed)
  let top = rect.y + rect.h
  const rows = []
  const ribs = [], beads = []
  for (const r of rowsIn) {
    const h = r.h || (free * (r.weight ?? 1)) / (wsum || 1)
    const y0 = top - h, y1 = top
    top = y0
    const W = o.rowWidth ? o.rowWidth((y0 + y1) / 2) : rect.w
    const count = r.count || Math.max(1, Math.round(W / (r.cell || U.w)))
    const cell = W / count
    const sx = cell / U.w, sy = h / U.h
    const shift = (r.shift || 0) * cell
    const lo = centre - W / 2 - cell, hi = centre + W / 2 + cell
    // cells k: left edge at centre + shift + k·cell
    const k0 = Math.floor((lo - centre - shift) / cell), k1 = Math.ceil((hi - centre - shift) / cell)
    for (let k = k0; k <= k1; k++) {
      // the same impression must come back at the same cell index round the vessel: seed by k mod count
      const kk = ((k % count) + count) % count
      const jr = new Rng((o.seed ?? 7) * 7919 + rows.length * 104729 + kk * 31)
      const dx = (jr.next() - 0.5) * 2 * jitter, dy = (jr.next() - 0.5) * 2 * jitter
      const P = placeUnit(U, centre + shift + k * cell, y0, sx, sy, !!r.mirror, !!r.flip, dx, dy)
      ribs.push(...P.ribs)
      beads.push(...P.beads)
    }
    rows.push({ y0, y1, cell, count, width: W })
  }
  void rng
  const clipRows = (ctx) => {
    ctx.beginPath()
    for (const r of rows) ctx.rect(centre - r.width / 2, r.y0 - 0.5, r.width, r.y1 - r.y0 + 1)
    ctx.clip()
  }
  // ribs: one domed raise (the section is round: shoulder = half the rib)
  panel.raise((ctx) => {
    ctx.save()
    if (o.clip !== false) clipRows(ctx)
    ctx.lineJoin = 'round'
    for (const s of ribs) {
      ctx.lineWidth = rib * s.w
      ctx.lineCap = s.caps[0] === 'flat' && s.caps[1] === 'flat' ? 'butt' : 'round'
      ctx.beginPath()
      ctx.moveTo(s.pts[0][0], s.pts[0][1])
      for (let i = 1; i < s.pts.length; i++) ctx.lineTo(s.pts[i][0], s.pts[i][1])
      ctx.stroke()
    }
    ctx.restore()
  }, { height, profile: 'dome', shoulder: rib * 0.5 })
  // knobs on the free ends and beads: a second, taller dome
  panel.raise((ctx) => {
    ctx.save()
    if (o.clip !== false) clipRows(ctx)
    ctx.beginPath()
    const dot = (x, y, r) => { ctx.moveTo(x + r, y); ctx.arc(x, y, r, 0, Math.PI * 2) }
    for (const s of ribs) {
      const n = s.pts.length
      if (s.caps[0] === 'knob') dot(s.pts[0][0], s.pts[0][1], knob)
      if (s.caps[1] === 'knob') dot(s.pts[n - 1][0], s.pts[n - 1][1], knob)
    }
    for (const [x, y, r] of beads) dot(x, y, r || knob * 0.9)
    ctx.fill()
    ctx.restore()
  }, { height: knobHeight, profile: 'dome', shoulder: knob })
  return { rows, ms: performance.now() - t0 }
}

/** a plain round cord (弦纹) along y from x0 to x1 */
export function plainCord(panel, { x0, x1, y, width = 2, height = 1.1 }) {
  panel.raise((ctx) => { ctx.fillRect(x0, y - width / 2, x1 - x0, width) }, { height, profile: 'dome', shoulder: width / 2 })
}

/**
 * A twisted cord (绹纹): a domed band cut across by slanted grooves every `pitch` mm (the strands), the cut
 * rounded so each strand reads as a fat lozenge. slant: degrees from the vertical (+ leans right going up).
 */
export function ropeCord(panel, { x0, x1, y, width = 3, height = 1.4, pitch = 2.4, slant = 50, depth, line } = {}) {
  plainCord(panel, { x0, x1, y, width, height })
  const t = Math.tan((slant * Math.PI) / 180) * (width / 2 + 0.4)
  const lw = line ?? pitch * 0.28
  panel.sink((ctx) => {
    ctx.save()
    ctx.beginPath()
    ctx.rect(x0, y - width / 2 - 0.2, x1 - x0, width + 0.4)
    ctx.clip()
    ctx.lineWidth = lw
    ctx.lineCap = 'butt'
    ctx.beginPath()
    for (let x = x0 - 2 * Math.abs(t) - pitch; x < x1 + 2 * Math.abs(t) + pitch; x += pitch) {
      ctx.moveTo(x - t, y - width / 2 - 0.4)
      ctx.lineTo(x + t, y + width / 2 + 0.4)
    }
    ctx.stroke()
    ctx.restore()
  }, { depth: depth ?? height * 0.55, profile: 'u', shoulder: lw * 0.45 })
}

export { lerp as _lerp }
