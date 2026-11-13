// STATUS: first pass — packs squared spirals into free ground by recursive
// subdivision. Replace the internals (contour-following packing, paired
// S-spirals, real fillers); keep `leiwenFill(panel, region, opts)`.
//
// Leiwen ("thunder pattern") was cut into the mould as a continuous field of
// small squared spirals filling every bit of ground the motif left over. The
// carver worked cell by cell, adapting cell size to the space, which is why the
// cells vary in size and never read as a grid.

import { edt } from './edt.js'

export const LEIWEN_DEFAULTS = {
  pitch: 1.6, // mm centre-to-centre of adjacent grooves (line ≈ gap)
  cell: [6, 14], // spiral cell size range in mm
  turns: 'auto',
  roundness: 0.25, // 0 = hard square corners, 1 = round
  jitter: 0.08, // hand-cut irregularity, fraction of pitch
  mode: 'sunk', // 'sunk' grooves | 'thread' raised lines
  depth: 0.45,
  fillers: true,
}

const GRID = 2 // occupancy samples per mm

/**
 * @param panel  ReliefPanel
 * @param region { rect:{x,y,w,h} mm, avoid: 'raised' | {data} coverage | null, margin: mm }
 * @param opts   LEIWEN_DEFAULTS overrides
 * @returns {{ cells: number, fillers: number }}
 */
export function leiwenFill(panel, region, opts = {}) {
  const o = { ...LEIWEN_DEFAULTS, ...opts }
  const rng = panel.rng.fork('leiwen:' + (o.seed ?? 0))
  const rect = region.rect
  const occ = occupancy(panel, rect, region.avoid ?? 'raised', region.margin ?? 0.6)

  const spirals = []
  const fillers = []
  const [cmin, cmax] = o.cell
  const inset = o.pitch * 0.5

  const stack = [{ x: rect.x, y: rect.y, w: rect.w, h: rect.h, d: 0 }]
  while (stack.length) {
    const c = stack.pop()
    if (c.w < o.pitch * 2 || c.h < o.pitch * 2) continue
    const blocked = occ.count(c)
    if (blocked === occ.area(c)) continue
    const longSide = Math.max(c.w, c.h)
    const shortSide = Math.min(c.w, c.h)
    const fits = blocked === 0
    const spiralMin = Math.max(cmin * 0.45, o.pitch * 3)
    if (fits && longSide <= cmax && longSide / shortSide <= 1.7 && shortSide >= spiralMin) {
      spirals.push(c)
      continue
    }
    // keep splitting toward the motif contour until a piece is too small to halve
    const canSplit = longSide >= o.pitch * 4.5
    if (!canSplit || (fits && longSide < spiralMin * 1.4 && longSide / shortSide <= 1.7)) {
      if (fits && o.fillers) fillers.push(c)
      continue
    }
    // split across the long side at a hand-chosen, never-central ratio
    const t = rng.range(0.36, 0.64)
    if (c.w >= c.h) {
      const a = c.w * t
      stack.push({ x: c.x, y: c.y, w: a, h: c.h, d: c.d + 1 }, { x: c.x + a, y: c.y, w: c.w - a, h: c.h, d: c.d + 1 })
    } else {
      const a = c.h * t
      stack.push({ x: c.x, y: c.y, w: c.w, h: a, d: c.d + 1 }, { x: c.x, y: c.y + a, w: c.w, h: c.h - a, d: c.d + 1 })
    }
  }

  const lineW = o.pitch * 0.5
  const draw = (ctx) => {
    ctx.lineWidth = lineW
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    for (const c of spirals) strokeSpiral(ctx, c, o, inset, rng)
    for (const c of fillers) strokeFiller(ctx, c, o, inset, rng)
  }
  if (spirals.length || fillers.length) {
    if (o.mode === 'thread') panel.add(draw, { height: o.depth, profile: 'ridge' })
    else panel.sink(draw, { depth: o.depth, shoulder: lineW * 0.4, profile: 'u' })
  }
  return { cells: spirals.length, fillers: fillers.length }
}

/** A squared spiral wound inward from a random corner, alternating hand. */
function strokeSpiral(ctx, c, o, inset, rng) {
  const p = o.pitch
  let x0 = c.x + inset, y0 = c.y + inset, x1 = c.x + c.w - inset, y1 = c.y + c.h - inset
  const pts = []
  const j = () => rng.jitter(o.jitter * p)
  const maxTurns = o.turns === 'auto' ? 99 : o.turns
  const cw = rng.chance(0.5)
  // walk the rectangle edges, shrinking by one pitch after each lap
  let turn = 0
  pts.push([x0, y0])
  while (x1 - x0 > p * 0.9 && y1 - y0 > p * 0.9 && turn < maxTurns) {
    if (cw) {
      pts.push([x0 + j(), y1 + j()], [x1 + j(), y1 + j()], [x1 + j(), y0 + j()], [x0 + p + j(), y0 + j()])
    } else {
      pts.push([x1 + j(), y0 + j()], [x1 + j(), y1 + j()], [x0 + j(), y1 + j()], [x0 + j(), y0 + p + j()])
    }
    x0 += p; y0 += p; x1 -= p; y1 -= p
    turn++
  }
  // the hooked tail in the centre
  pts.push([(x0 + x1) / 2, (y0 + y1) / 2])
  // flip some spirals so the field has no single handedness
  const flipX = rng.chance(0.5)
  const flipY = rng.chance(0.5)
  const cx = c.x + c.w / 2
  const cy = c.y + c.h / 2
  for (const q of pts) {
    if (flipX) q[0] = 2 * cx - q[0]
    if (flipY) q[1] = 2 * cy - q[1]
  }
  polyline(ctx, pts, o.roundness * p * 0.5)
}

/** T-hook for slivers too small for a spiral. */
function strokeFiller(ctx, c, o, inset) {
  const x0 = c.x + inset, y0 = c.y + inset, x1 = c.x + c.w - inset, y1 = c.y + c.h - inset
  if (x1 - x0 < 0.2 || y1 - y0 < 0.2) return
  const pts = c.w >= c.h
    ? [[x0, y0], [x0, y1], [x1, y1], [x1, (y0 + y1) / 2]]
    : [[x0, y1], [x1, y1], [x1, y0], [(x0 + x1) / 2, y0]]
  polyline(ctx, pts, o.roundness * o.pitch * 0.5)
}

function polyline(ctx, pts, r) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length - 1; i++) {
    if (r > 0.01) ctx.arcTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], r)
    else ctx.lineTo(pts[i][0], pts[i][1])
  }
  const last = pts[pts.length - 1]
  ctx.lineTo(last[0], last[1])
  ctx.stroke()
}

/**
 * Coarse occupancy grid (GRID samples/mm) of where leiwen may NOT go: raised
 * motif (plus `margin` mm, so a spiral never kisses a motif wall) and anything
 * outside the region. Summed-area table for O(1) rectangle queries.
 */
function occupancy(panel, rect, avoid, margin) {
  const gw = Math.max(1, Math.ceil(panel.width * GRID))
  const gh = Math.max(1, Math.ceil(panel.height * GRID))
  const blocked = new Uint8Array(gw * gh)
  const { cols, rows, field } = panel
  const src = avoid && avoid.data ? avoid.data : null
  const pxPerCell = panel.ppmm / GRID
  for (let y = 0; y < rows; y++) {
    const gy = Math.min(gh - 1, Math.floor(y / pxPerCell))
    for (let x = 0; x < cols; x++) {
      const i = y * cols + x
      const hit = src ? src[i] > 0.5 : avoid === 'raised' ? field[i] > 0.05 : false
      if (hit) blocked[gy * gw + Math.min(gw - 1, Math.floor(x / pxPerCell))] = 1
    }
  }
  // dilate by margin with an exact EDT
  if (margin > 0) {
    const d2 = edt(blocked, gw, gh)
    const m2 = (margin * GRID) ** 2
    for (let i = 0; i < blocked.length; i++) if (d2[i] <= m2) blocked[i] = 1
  }
  // outside the region counts as blocked
  const rx0 = rect.x * GRID, ry0 = rect.y * GRID, rx1 = (rect.x + rect.w) * GRID, ry1 = (rect.y + rect.h) * GRID
  for (let y = 0; y < gh; y++)
    for (let x = 0; x < gw; x++) if (x + 0.5 < rx0 || x + 0.5 > rx1 || y + 0.5 < ry0 || y + 0.5 > ry1) blocked[y * gw + x] = 1

  const sat = new Uint32Array((gw + 1) * (gh + 1))
  for (let y = 0; y < gh; y++) {
    let run = 0
    for (let x = 0; x < gw; x++) {
      run += blocked[y * gw + x]
      sat[(y + 1) * (gw + 1) + x + 1] = sat[y * (gw + 1) + x + 1] + run
    }
  }
  const box = (c) => {
    const x0 = Math.max(0, Math.floor(c.x * GRID)), y0 = Math.max(0, Math.floor(c.y * GRID))
    const x1 = Math.min(gw, Math.ceil((c.x + c.w) * GRID)), y1 = Math.min(gh, Math.ceil((c.y + c.h) * GRID))
    return [x0, y0, x1, y1]
  }
  return {
    count(c) {
      const [x0, y0, x1, y1] = box(c)
      if (x1 <= x0 || y1 <= y0) return 0
      const W = gw + 1
      return sat[y1 * W + x1] - sat[y0 * W + x1] - sat[y1 * W + x0] + sat[y0 * W + x0]
    },
    area(c) {
      const [x0, y0, x1, y1] = box(c)
      return Math.max(0, x1 - x0) * Math.max(0, y1 - y0)
    },
  }
}
