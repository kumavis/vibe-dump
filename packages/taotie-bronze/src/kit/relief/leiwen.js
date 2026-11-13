// Leiwen 雷纹 — the thunder-pattern ground (research/01 §3).
//
// A Shang mould carver did not tile a meander. He looked at the bit of ground
// a motif left over, cut it into cells that suited it (big squares in the
// open, long rectangles in strips, little hooks in slivers), lined those cells
// up against whatever they sat beside, and cut one squared spiral into each.
// This module does the same, in three steps:
//
//   1. free region: rect ∧ include ∧ ¬avoid (∧ field ≈ level), eroded by
//      `margin`, on a working grid of ~pitch/3 (leiwen/ uses none of the
//      panel's own resolution beyond this mask).
//   2. packing: an advancing front of oriented rectangles. Seeds sit on the
//      free region's boundary; each cell takes the local contour direction
//      (4-fold, so a concave corner snaps to one of its walls), grows until it
//      touches its neighbours or reaches a target size, and hands its own
//      orientation on to the next row. A last sweep packs whatever is left with
//      smaller cells and fillers. No global grid exists anywhere.
//   3. units: each cell becomes one stroke group — a squared spiral wound to
//      the cell's own pitch (pitch adapts ±20 % so the turns fit exactly),
//      an S- or mirror-pair (双联雷纹) for 1.6–3.2 aspect, a chain for strips,
//      C-hooks and contour lines for slivers. All strokes go through ONE
//      panel.sink() (or panel.add() for thread relief): one path, one EDT.
//
// Every stroke lies inside its cell and every cell inside the eroded region,
// so nothing is ever clipped mid-way at a motif wall.

import { nearestFeature } from './edt.js'

export const LEIWEN_DEFAULTS = {
  pitch: 1.6, // mm, centre-to-centre of adjacent grooves
  line: 0.5, // groove width as a fraction of pitch (line ≈ gap)
  cell: 'auto', // [min, max] spiral cell side in mm; 'auto' = [4.2, 7.8] × pitch (typical: the middle, ±15 %)
  turns: 'auto', // or a number: caps cell size at (2·turns + 1)·pitch
  roundness: 0.15, // 0 = squared 雷纹 (still a 0.12 p casting fillet) → 1 = round 云纹
  jitter: 0.08, // hand-cut irregularity (fraction of pitch; also ±1.5° per 0.08 of cell skew)
  mode: 'sunk', // 'sunk' grooves | 'thread' raised lines
  depth: 0.45, // mm, groove depth (or thread height)
  fillers: true, // C-hooks / contour lines in slivers too narrow for a spiral
  pairs: 0.75, // probability a 1.6–3.2 aspect cell becomes an S/mirror pair (else one long spiral)
  hand: 'alternate', // 'alternate' | 'random' | 'left' | 'right' — spiral handedness
  eyes: 0, // probability a large spiral (≥ 6 pitches) gets an eye ring at its centre
  echo: 0, // contour-echo grooves hugging each motif outline before the spirals start
  follow: 1, // 0 = cells aligned to the rect frame only, 1 = follow neighbouring contours
  seed: 0,
}

/** Merge options; resolve 'auto' cell range. */
export function leiwenOptions(opts = {}) {
  const o = { ...LEIWEN_DEFAULTS, ...opts }
  const p = o.pitch
  let [cmin, cmax] = o.cell === 'auto' || !o.cell ? [4.2 * p, 7.8 * p] : o.cell
  if (typeof o.turns === 'number') cmax = Math.min(cmax, (2 * o.turns + 1.2) * p)
  cmin = Math.max(cmin, 3 * p)
  cmax = Math.max(cmax, cmin)
  o.cell = [cmin, cmax]
  return o
}

/**
 * Pack leiwen into a region of the panel.
 * @param panel  ReliefPanel
 * @param region {
 *   rect?:    {x,y,w,h} mm (default: whole panel),
 *   avoid?:   'raised' (field > 0.05 mm) | mask {data} | draw(ctx) | null,
 *   include?: mask {data} | draw(ctx) — only fill where this covers (≥ 0.5),
 *   level?:   mm — only fill where the field is within ±tol of this height
 *             (a plateau top; its shoulders and any bosses are left alone),
 *   margin?:  mm kept clear of every boundary (default 0.6),
 * }
 * @param opts   LEIWEN_DEFAULTS overrides
 * @returns {{ cells, spirals, pairs, fillers, ms }}
 */
export function leiwenFill(panel, region = {}, opts = {}) {
  const t0 = now()
  const o = leiwenOptions(opts)
  const rect = region.rect ?? { x: 0, y: 0, w: panel.width, h: panel.height }
  const rng = panel.rng.fork(`leiwen:${o.seed}:${r3(rect.x)},${r3(rect.y)},${r3(rect.w)},${r3(rect.h)}`)
  const grid = buildGrid(panel, rect, region, o)
  if (o.debugOut) o.debugOut.gridMs = now() - t0
  const strokes = []
  if (grid && o.echo > 0) echoLines(grid, o, strokes)
  const units = grid ? pack(grid, o, rng) : []
  if (o.debugOut) for (const u of units) o.debugOut.push(u)
  const stats = { cells: units.length, spirals: 0, pairs: 0, fillers: 0, ms: 0, planMs: 0 }
  for (const u of units) {
    if (o.debugCells) {
      const P = (a, b) => [u.ax + a * u.ux + b * u.vx, u.ay + a * u.uy + b * u.vy]
      strokes.push({ pts: [P(u.u0, u.v0), P(u.u1, u.v0), P(u.u1, u.v1), P(u.u0, u.v1), P(u.u0, u.v0)], radius: 0 })
    }
    if (o.debugCells !== true) emitUnit(u, o, rng, strokes, stats)
  }
  const t1 = now()
  if (strokes.length) drawStrokes(panel, strokes, o)
  stats.planMs = Math.round(t1 - t0)
  stats.ms = Math.round(now() - t0)
  return stats
}

/**
 * Secondary fill on top of a raised plateau (or any mask): spirals and hooks
 * following its outline. `include` is a mask {data} or draw(ctx); `level` (mm)
 * restricts it to where the field sits at that height (default: the most
 * common height under the mask, i.e. the plateau top).
 */
export function leiwenFillMask(panel, include, opts = {}, { rect, margin = 0.5, level, avoid = null } = {}) {
  const inc = typeof include === 'function' ? panel.mask(include) : include
  let lv = level
  if (lv === undefined && inc?.data) lv = modeHeight(panel, inc.data)
  return leiwenFill(panel, { rect, include: inc, level: lv, avoid, margin }, opts)
}

// ------------------------------------------------------------------ grid

function buildGrid(panel, rect, region, o) {
  const p = o.pitch
  let h = Math.max(p / 3, 1 / panel.ppmm)
  const MAXC = 3.2e6
  if ((rect.w / h) * (rect.h / h) > MAXC) h = Math.sqrt((rect.w * rect.h) / MAXC)
  const gw = Math.ceil(rect.w / h) + 2
  const gh = Math.ceil(rect.h / h) + 2
  const ox = rect.x - h // grid cell (i, j) spans [ox + i h, ox + (i+1) h)
  const oy = rect.y - h
  const N = gw * gh
  const blocked = new Uint8Array(N)
  // the one-cell ring outside the rect is blocked
  for (let j = 0; j < gh; j++)
    for (let i = 0; i < gw; i++) if (i === 0 || j === 0 || i === gw - 1 || j === gh - 1) blocked[j * gw + i] = 1

  const { cols, rows, ppmm, field } = panel
  const toMask = (m) => (typeof m === 'function' ? panel.mask(m).data : m && m.data ? m.data : null)
  const avoid = region.avoid === undefined ? 'raised' : region.avoid
  const avoidData = avoid === 'raised' ? null : toMask(avoid)
  const raised = avoid === 'raised'
  const inc = toMask(region.include)
  const level = region.level
  const tol = level == null ? 0 : 0.04 + 0.03 * Math.abs(level)
  const px0 = Math.max(0, Math.floor(rect.x * ppmm)), px1 = Math.min(cols, Math.ceil((rect.x + rect.w) * ppmm))
  const py0 = Math.max(0, Math.floor(rect.y * ppmm)), py1 = Math.min(rows, Math.ceil((rect.y + rect.h) * ppmm))
  const colCell = new Int32Array(px1 - px0)
  for (let x = px0; x < px1; x++) colCell[x - px0] = Math.min(gw - 2, Math.max(1, Math.floor(((x + 0.5) / ppmm - ox) / h)))
  let free = 0
  for (let y = py0; y < py1; y++) {
    const gj = Math.min(gh - 2, Math.max(1, Math.floor(((y + 0.5) / ppmm - oy) / h)))
    const grow = gj * gw
    const row = y * cols
    for (let x = px0; x < px1; x++) {
      const i = row + x
      let hit = false
      if (raised) hit = field[i] > 0.05
      else if (avoidData) hit = avoidData[i] > 0.5
      if (!hit && inc) hit = inc[i] < 0.5
      if (!hit && level != null) hit = Math.abs(field[i] - level) > tol
      if (hit) blocked[grow + colCell[x - px0]] = 1
    }
  }
  // erode the free region by the margin (+ half a cell: blocked pixels may sit anywhere in their cell)
  const hit = new Uint8Array(blocked) // raw obstacles (ring included), before erosion
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) if (i === 0 || j === 0 || i === gw - 1 || j === gh - 1) hit[j * gw + i] = 0
  const nf = nearestFeature(blocked, gw, gh)
  // `margin` is the clear land between the boundary and the nearest groove
  // EDGE; a cell already keeps its outer groove centre p/2 inside, i.e. its
  // groove edge p/2 − line/2 inside, so only the rest is eroded here.
  const land = p * (0.5 - o.line / 2)
  const m = Math.max(0, (region.margin ?? 0.6) - land) / h + 0.3
  const m2 = m * m
  for (let k = 0; k < N; k++) if (nf.dist2[k] <= m2) blocked[k] = 1
  for (let k = 0; k < N; k++) if (!blocked[k]) free++
  if (free < 9) return null
  return { gw, gh, h, ox, oy, blocked, hit, m }
}

// --------------------------------------------------------------- packing

function pack(grid, o, rng) {
  const { gw, gh, h, ox, oy, blocked } = grid
  const N = gw * gh
  const p = o.pitch
  const [cmin, cmax] = o.cell

  // contour orientation field: direction to the nearest obstacle, taken mod 90°
  // (as an angle ×4) and smoothed, so a corner snaps to one of its walls and a
  // curved edge turns its cells smoothly.
  const nf0 = nearestFeature(blocked, gw, gh)
  const c4 = new Float32Array(N), s4 = new Float32Array(N)
  const nxA = new Float32Array(N), nyA = new Float32Array(N)
  const D0 = new Float32Array(N)
  for (let k = 0; k < N; k++) D0[k] = Math.sqrt(nf0.dist2[k])
  for (let k = 0; k < N; k++) {
    if (blocked[k]) continue
    const f = nf0.nearest[k]
    if (f < 0) continue
    const i = k % gw, j = (k / gw) | 0
    let dx = i - (f % gw), dy = j - ((f / gw) | 0)
    const d = Math.hypot(dx, dy) || 1
    // the distance gradient (±2 cells) is far less quantised than the
    // integer offset to the nearest feature pixel
    if (i > 1 && j > 1 && i < gw - 2 && j < gh - 2) {
      const gx = D0[k + 2] - D0[k - 2], gy = D0[k + 2 * gw] - D0[k - 2 * gw]
      if (Math.hypot(gx, gy) > 1.2) { dx = gx; dy = gy }
    }
    const dl = Math.hypot(dx, dy) || 1
    nxA[k] = dx / dl
    nyA[k] = dy / dl
    const a = 4 * Math.atan2(dy, dx)
    const w = Math.exp((-d * h) / (3 * p))
    c4[k] = Math.cos(a) * w
    s4[k] = Math.sin(a) * w
  }
  // straightness: how well the 4θ directions agree over about half a cell.
  // Straight walls (and concave corners, whose two walls agree mod 90°) score
  // ≈ 1; a tight curve (an eye, a boss) scores low, and the cells beside it
  // stay squared to the frame — a fan of rotated squares around a circle
  // leaves radial wedges no carver would have cut.
  const wsum = new Float32Array(N)
  for (let k = 0; k < N; k++) if (!blocked[k]) wsum[k] = Math.hypot(c4[k], s4[k])
  const cc = new Float32Array(c4), sc = new Float32Array(s4)
  const R2 = Math.max(2, Math.round((cmin * 0.5) / h))
  boxBlur(cc, gw, gh, R2, blocked)
  boxBlur(sc, gw, gh, R2, blocked)
  boxBlur(wsum, gw, gh, R2, blocked)
  const R = Math.max(1, Math.round((1.2 * p) / h))
  boxBlur(c4, gw, gh, R, blocked)
  boxBlur(s4, gw, gh, R, blocked)
  const follow = Math.max(0, Math.min(1, o.follow))
  const theta0 = (k) => {
    const coh = wsum[k] > 1e-6 ? Math.hypot(cc[k], sc[k]) / wsum[k] : 1
    const t = Math.max(0, Math.min(1, (coh - 0.8) / 0.13))
    return (follow * t * Math.atan2(s4[k], c4[k])) / 4
  }

  const occ = new Uint8Array(blocked) // 1 blocked, 2 claimed
  const own = new Int32Array(N).fill(-1)
  const tried = new Uint8Array(N)
  const units = []

  const cellOf = (x, y) => {
    const i = Math.floor((x - ox) / h), j = Math.floor((y - oy) / h)
    if (i < 0 || j < 0 || i >= gw || j >= gh) return -1
    return j * gw + i
  }
  const isFree = (x, y) => {
    const k = cellOf(x, y)
    return k >= 0 && occ[k] === 0
  }
  const sstep = h * 0.7
  // all points on the segment a→b free?
  const segFree = (ax, ay, bx, by) => {
    const L = Math.hypot(bx - ax, by - ay)
    const n = Math.max(1, Math.ceil(L / sstep))
    for (let i = 0; i <= n; i++) {
      const t = i / n
      if (!isFree(ax + (bx - ax) * t, ay + (by - ay) * t)) return false
    }
    return true
  }

  /** Grow an oriented rectangle from anchor (ax, ay). */
  const fit = (ax, ay, theta, nx, ny, T, maxLen, absorb = 0) => {
    let ux = Math.cos(theta), uy = Math.sin(theta)
    // choose the frame rotation whose +v points along n (away from the obstacle)
    let best = -2, bu = [ux, uy]
    for (let r = 0; r < 4; r++) {
      const vx = -uy, vy = ux
      const d = vx * nx + vy * ny
      if (d > best) { best = d; bu = [ux, uy] }
      const t = ux; ux = -uy; uy = t
    }
    ;[ux, uy] = bu
    const vx = -uy, vy = ux
    const P = (u, v) => [ax + u * ux + v * vx, ay + u * uy + v * vy]
    let u0 = -h * 0.5, u1 = h * 0.5, v0 = -h * 0.5, v1 = h * 0.5
    {
      const a = P(u0, v0), b = P(u1, v1), c = P(u0, v1), d = P(u1, v0)
      if (!isFree(a[0], a[1]) || !isFree(b[0], b[1]) || !isFree(c[0], c[1]) || !isFree(d[0], d[1])) return null
    }
    const step = h
    const tryU = (side) => {
      const u = side > 0 ? u1 + step : u0 - step
      const a = P(u, v0), b = P(u, v1)
      if (!segFree(a[0], a[1], b[0], b[1])) return false
      // the strip between old and new edge, at mid
      if (side > 0) u1 = u; else u0 = u
      return true
    }
    const tryV = (side) => {
      const v = side > 0 ? v1 + step : v0 - step
      const a = P(u0, v), b = P(u1, v)
      if (!segFree(a[0], a[1], b[0], b[1])) return false
      if (side > 0) v1 = v; else v0 = v
      return true
    }
    // phase 1: grow toward a T × T square, each side until it touches something
    const stuck = [false, false, false, false] // v1, u1, u0, v0
    for (let guard = 0; guard < 4000; guard++) {
      let moved = false
      if (!stuck[0] && v1 - v0 < T) { if (tryV(1)) moved = true; else stuck[0] = true }
      if (!stuck[1] && u1 - u0 < T) { if (tryU(1)) moved = true; else stuck[1] = true }
      if (!stuck[2] && u1 - u0 < T) { if (tryU(-1)) moved = true; else stuck[2] = true }
      if (!stuck[3] && v1 - v0 < T) { if (tryV(-1)) moved = true; else stuck[3] = true }
      if (!moved) break
    }
    // phase 2: a strip — the short side is pinned, so run along the long one
    let eu = u1 - u0, ev = v1 - v0
    if (Math.min(eu, ev) < T * 0.85) {
      const alongU = eu >= ev
      for (let guard = 0; guard < 4000; guard++) {
        let moved = false
        if (alongU) {
          if (u1 - u0 >= maxLen) break
          if (!stuck[1]) { if (tryU(1)) moved = true; else stuck[1] = true }
          if (!stuck[2] && u1 - u0 < maxLen) { if (tryU(-1)) moved = true; else stuck[2] = true }
        } else {
          if (v1 - v0 >= maxLen) break
          if (!stuck[0]) { if (tryV(1)) moved = true; else stuck[0] = true }
          if (!stuck[3] && v1 - v0 < maxLen) { if (tryV(-1)) moved = true; else stuck[3] = true }
        }
        if (!moved) break
      }
      eu = u1 - u0
      ev = v1 - v0
    }
    // absorb slivers: a side with free space beyond it that is too thin for
    // another cell takes that space itself, so cells close up on their
    // neighbours instead of leaving a gap that would hold only a dash
    const reach = absorb
    if (reach > 0) {
      const ext = (side) => {
        let d = 0
        while (d < reach) {
          const ok = side === 0 ? tryV(1) : side === 1 ? tryU(1) : side === 2 ? tryU(-1) : tryV(-1)
          if (!ok) return d
          d += step
        }
        return -d // open: undo below
      }
      for (const side of [0, 1, 2, 3]) {
        const save = [u0, u1, v0, v1]
        const d = ext(side)
        if (d < 0) [u0, u1, v0, v1] = save
      }
    }
    // geometric edges: the grown box spans cell samples; the true free extent
    // reaches half a sample step beyond, so give that back
    u0 -= h * 0.5; u1 += h * 0.5; v0 -= h * 0.5; v1 += h * 0.5
    return { ax, ay, ux, uy, vx, vy, u0, u1, v0, v1, w: u1 - u0, h: v1 - v0, theta: Math.atan2(uy, ux) }
  }

  const claim = (r, id) => {
    const pad = 0
    const cs = [[r.u0, r.v0], [r.u1, r.v0], [r.u0, r.v1], [r.u1, r.v1]].map(([u, v]) => [r.ax + u * r.ux + v * r.vx, r.ay + u * r.uy + v * r.vy])
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity
    for (const [x, y] of cs) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y) }
    const i0 = Math.max(0, Math.floor((x0 - ox) / h) - 1), i1 = Math.min(gw - 1, Math.ceil((x1 - ox) / h) + 1)
    const j0 = Math.max(0, Math.floor((y0 - oy) / h) - 1), j1 = Math.min(gh - 1, Math.ceil((y1 - oy) / h) + 1)
    for (let j = j0; j <= j1; j++) {
      for (let i = i0; i <= i1; i++) {
        const k = j * gw + i
        if (occ[k]) continue
        const x = ox + (i + 0.5) * h - r.ax, y = oy + (j + 0.5) * h - r.ay
        const u = x * r.ux + y * r.uy, v = x * r.vx + y * r.vy
        if (u >= r.u0 - pad && u <= r.u1 + pad && v >= r.v0 - pad && v <= r.v1 + pad) {
          occ[k] = 2
          own[k] = id
        }
      }
    }
  }

  const minSpiral = 3 * p * 0.97
  const minFiller = 1.25 * p
  const absorbLen = minSpiral * 0.9
  // one typical cell size with ±15 % hand variation (§3.1), inside [cmin, cmax]
  const typical = o.cellTypical ?? (cmin + cmax) / 2
  const target = () => Math.min(cmax, Math.max(cmin, typical * (1 + rng.jitter(0.15))))
  const handFor = (parent) => {
    if (o.hand === 'left') return 1
    if (o.hand === 'right') return -1
    if (o.hand === 'random' || parent == null) return rng.chance(0.5) ? 1 : -1
    return -parent
  }
  const skew = () => rng.jitter(((o.jitter / 0.08) * 1.5 * Math.PI) / 180)

  // ---- pass 1: the advancing front
  const queue = []
  for (let k = 0; k < N; k++) {
    if (blocked[k] || nf0.dist2[k] > 2.3) continue
    queue.push({ k, x: ox + ((k % gw) + 0.5) * h, y: oy + (((k / gw) | 0) + 0.5) * h, contour: true, hand: null })
  }
  // walk the boundary in a scrambled-but-local order: sort by coarse tile, then shuffle tiles
  const tile = Math.max(4, Math.round(cmax / h))
  const tkey = new Map()
  const keyOf = (a) => {
    const t = Math.floor((a.k % gw) / tile) + Math.floor(a.k / gw / tile) * 100003
    if (!tkey.has(t)) tkey.set(t, rng.next())
    return tkey.get(t)
  }
  queue.sort((a, b) => keyOf(a) - keyOf(b) || a.k - b.k)

  const place = (r, hand, minShort) => {
    if (!r || Math.min(r.w, r.h) < minShort) return null
    const id = units.length
    r.hand = hand
    units.push(r)
    claim(r, id)
    return r
  }
  const spawn = (r) => {
    // next cells along the row (both ends, sharing this cell's base line) and
    // the next row (beyond the far side), all inheriting this orientation
    const out = []
    const P = (u, v) => [r.ax + u * r.ux + v * r.vx, r.ay + u * r.uy + v * r.vy]
    const e = h * 1.2
    for (const [u, v, nx, ny] of [
      [r.u1 + e, r.v0 + h, r.vx, r.vy],
      [r.u0 - e, r.v0 + h, r.vx, r.vy],
      [r.u0 + h, r.v1 + e, r.vx, r.vy],
      [r.u1 - h, r.v1 + e, r.vx, r.vy],
    ]) {
      const [x, y] = P(u, v)
      const k = cellOf(x, y)
      if (k >= 0 && occ[k] === 0) out.push({ k, x, y, theta: r.theta, nx, ny, hand: -r.hand, contour: false })
    }
    return out
  }

  for (let qi = 0; qi < queue.length; qi++) {
    const a = queue[qi]
    if (occ[a.k] || tried[a.k]) continue
    tried[a.k] = 1
    let theta, nx, ny
    const nearContour = Math.sqrt(nf0.dist2[a.k]) * h < cmin * 0.6
    if (a.contour || (nearContour && follow > 0)) {
      theta = theta0(a.k)
      nx = nxA[a.k]
      ny = nyA[a.k]
    } else {
      // away from any edge the carver squared up to the panel frame
      theta = 0
      nx = a.nx
      ny = a.ny
    }
    const r = fit(a.x, a.y, theta + skew(), nx, ny, target(), cmax * 4, absorbLen)
    const placed = place(r, handFor(a.hand), minSpiral)
    if (placed) for (const s of spawn(placed)) queue.push(s)
  }

  // ---- pass 2: leftovers, biggest holes first, smaller cells and fillers
  for (let sweep = 0; sweep < 2; sweep++) {
    const occBin = new Uint8Array(N)
    for (let k = 0; k < N; k++) occBin[k] = occ[k] ? 1 : 0
    const nf = nearestFeature(occBin, gw, gh)
    const cand = []
    const minD = sweep === 0 ? (minSpiral / 2 / h) ** 2 : (minFiller / 2 / h) ** 2 * 0.8
    for (let k = 0; k < N; k++) if (!occ[k] && nf.dist2[k] >= minD) cand.push(k)
    cand.sort((a, b) => nf.dist2[b] - nf.dist2[a])
    tried.fill(0)
    for (const k of cand) {
      if (occ[k] || tried[k]) continue
      tried[k] = 1
      const f = nf.nearest[k]
      const x = ox + ((k % gw) + 0.5) * h, y = oy + (((k / gw) | 0) + 0.5) * h
      let nx = (k % gw) - (f % gw), ny = ((k / gw) | 0) - ((f / gw) | 0)
      const d = Math.hypot(nx, ny) || 1
      nx /= d
      ny /= d
      const ownId = f >= 0 ? own[f] : -1
      const theta = Math.sqrt(nf0.dist2[k]) * h < cmin * 0.6 ? theta0(k) : ownId >= 0 ? units[ownId].theta : 0
      const parent = ownId >= 0 ? units[ownId].hand : null
      const r = fit(x, y, theta + skew(), nx, ny, sweep === 0 ? target() : cmin, cmax * 4, absorbLen)
      place(r, handFor(parent), sweep === 0 ? minSpiral : o.fillers ? minFiller : minSpiral)
    }
  }
  return units
}

/**
 * Contour-echo grooves (research/01 §3.2–3.3): `o.echo` lines running parallel
 * to every obstacle outline (not the rect frame), one pitch apart, traced as
 * iso-lines of the distance field; the packing region then starts beyond them.
 * Lines stop cleanly where they reach the frame margin.
 */
function echoLines(grid, o, strokes) {
  const { gw, gh, h, ox, oy, blocked, hit, m } = grid
  const N = gw * gh
  const p = o.pitch
  const dist = nearestFeature(hit, gw, gh).dist2
  const D = new Float32Array(N)
  for (let k = 0; k < N; k++) D[k] = Math.sqrt(dist[k])
  const frameOK = (i, j) => Math.min(i, j, gw - 1 - i, gh - 1 - j) >= m + 0.5
  for (let e = 0; e < o.echo; e++) {
    const level = m + (p / 2 + e * p) / h
    for (const chain of isoChains(D, gw, gh, level)) {
      // smooth the EDT's half-cell quantisation, then split where the frame margin cuts it
      let pts = chain
      for (let it = 0; it < 3; it++) pts = smooth(pts, chain.closed)
      let run = []
      const flush = () => {
        if (run.length > 1 && polyLen(run) >= 2.5 * p) strokes.push({ pts: run.map(([x, y]) => [ox + (x + 0.5) * h, oy + (y + 0.5) * h]), radius: 0 })
        run = []
      }
      for (const pt of pts) {
        if (frameOK(pt[0], pt[1])) run.push(pt)
        else flush()
      }
      flush()
    }
  }
  // the spirals start one pitch beyond the last echo line
  const lim = m + (o.echo * p) / h
  for (let k = 0; k < N; k++) if (D[k] < lim) blocked[k] = 1
}

function polyLen(pts) {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
  return L
}

function smooth(pts, closed) {
  const n = pts.length
  if (n < 3) return pts
  const out = new Array(n)
  for (let i = 0; i < n; i++) {
    if (!closed && (i === 0 || i === n - 1)) { out[i] = pts[i]; continue }
    const a = pts[(i - 1 + n) % n], b = pts[i], c = pts[(i + 1) % n]
    out[i] = [(a[0] + 2 * b[0] + c[0]) / 4, (a[1] + 2 * b[1] + c[1]) / 4]
  }
  return out
}

/** Marching squares on node values F (grid units), stitched into polylines. */
function isoChains(F, w, h, level) {
  const segs = [] // pairs of edge ids
  const pos = new Map() // edge id → [x, y]
  const edgePt = (i, j, horiz) => {
    const id = 2 * (j * w + i) + (horiz ? 0 : 1)
    if (!pos.has(id)) {
      const a = F[j * w + i], b = horiz ? F[j * w + i + 1] : F[(j + 1) * w + i]
      const t = Math.min(1, Math.max(0, (level - a) / (b - a)))
      pos.set(id, horiz ? [i + t, j] : [i, j + t])
    }
    return id
  }
  for (let j = 0; j < h - 1; j++) {
    for (let i = 0; i < w - 1; i++) {
      const a = F[j * w + i] >= level, b = F[j * w + i + 1] >= level
      const c = F[(j + 1) * w + i + 1] >= level, d = F[(j + 1) * w + i] >= level
      const code = (a ? 1 : 0) | (b ? 2 : 0) | (c ? 4 : 0) | (d ? 8 : 0)
      if (code === 0 || code === 15) continue
      const eB = () => edgePt(i, j, true), eT = () => edgePt(i, j + 1, true)
      const eL = () => edgePt(i, j, false), eR = () => edgePt(i + 1, j, false)
      switch (code) {
        case 1: case 14: segs.push([eL(), eB()]); break
        case 2: case 13: segs.push([eB(), eR()]); break
        case 3: case 12: segs.push([eL(), eR()]); break
        case 4: case 11: segs.push([eR(), eT()]); break
        case 6: case 9: segs.push([eB(), eT()]); break
        case 7: case 8: segs.push([eL(), eT()]); break
        case 5: segs.push([eL(), eT()], [eB(), eR()]); break
        case 10: segs.push([eL(), eB()], [eR(), eT()]); break
      }
    }
  }
  const adj = new Map()
  segs.forEach(([a, b], k) => {
    if (!adj.has(a)) adj.set(a, [])
    if (!adj.has(b)) adj.set(b, [])
    adj.get(a).push(k)
    adj.get(b).push(k)
  })
  const used = new Uint8Array(segs.length)
  const chains = []
  const walk = (start, seg) => {
    const ids = [start]
    let cur = start, k = seg
    while (k >= 0 && !used[k]) {
      used[k] = 1
      const [a, b] = segs[k]
      cur = a === cur ? b : a
      ids.push(cur)
      k = -1
      for (const n of adj.get(cur)) if (!used[n]) { k = n; break }
    }
    return ids
  }
  // open chains first (start at an end), then loops
  for (const [id, list] of adj) {
    if (list.length !== 1 || used[list[0]]) continue
    chains.push(walk(id, list[0]))
  }
  for (let k = 0; k < segs.length; k++) {
    if (used[k]) continue
    const ids = walk(segs[k][0], k)
    ids.closed = true
    chains.push(ids)
  }
  return chains.map((ids) => {
    const pts = ids.map((id) => pos.get(id))
    if (ids.closed || ids[0] === ids[ids.length - 1]) pts.closed = true
    return pts
  })
}

/** Separable box blur (two passes ≈ tent), ignoring masked cells. */
function boxBlur(a, w, h, r, mask) {
  const tmp = new Float32Array(Math.max(w, h))
  for (let pass = 0; pass < 2; pass++) {
    for (let y = 0; y < h; y++) {
      const row = y * w
      let s = 0
      for (let x = -r; x <= r; x++) if (x >= 0 && x < w) s += a[row + x]
      for (let x = 0; x < w; x++) {
        tmp[x] = s
        const xo = x - r, xi = x + r + 1
        if (xo >= 0) s -= a[row + xo]
        if (xi < w) s += a[row + xi]
      }
      for (let x = 0; x < w; x++) a[row + x] = mask[row + x] ? 0 : tmp[x]
    }
    for (let x = 0; x < w; x++) {
      let s = 0
      for (let y = -r; y <= r; y++) if (y >= 0 && y < h) s += a[y * w + x]
      for (let y = 0; y < h; y++) {
        tmp[y] = s
        const yo = y - r, yi = y + r + 1
        if (yo >= 0) s -= a[yo * w + x]
        if (yi < h) s += a[yi * w + x]
      }
      for (let y = 0; y < h; y++) a[y * w + x] = mask[y * w + x] ? 0 : tmp[y]
    }
  }
}

// ----------------------------------------------------------------- units

/**
 * Turn one packed cell into strokes. Works in the cell's own frame: u along
 * its long side, v across, origin at its lower-left corner.
 */
function emitUnit(r, o, rng, strokes, stats) {
  let U = [r.ux, r.uy], V = [r.vx, r.vy]
  let W = r.w, H = r.h
  let O = [r.ax + r.u0 * r.ux + r.v0 * r.vx, r.ay + r.u0 * r.uy + r.v0 * r.vy]
  if (H > W) {
    // rotate the frame so u runs along the long side: u' = v, v' = −u (origin moves to the old u1 corner)
    O = [O[0] + W * U[0], O[1] + W * U[1]]
    const nU = V, nV = [-U[0], -U[1]]
    U = nU
    V = nV
    ;[W, H] = [H, W]
  }
  const p = o.pitch
  // random flips (they keep the cell in place) vary where each spiral starts
  // a random half-turn varies where each unit starts without changing its hand
  const rot = rng.chance(0.5)
  const hand = r.hand ?? 1
  const frame = { fu: rot, fv: rot }
  const toPanel = (u, v) => {
    if (frame.fu) u = W - u
    if (frame.fv) v = H - v
    return [O[0] + u * U[0] + v * V[0], O[1] + u * U[1] + v * V[1]]
  }
  const sub = { p, o, rng, strokes, toPanel, stats }
  layout(sub, 0, 0, W, H, hand, 0)
}

/** Recursive cell layout: spiral / pair / chain / filler, in cell-frame coords. */
function layout(s, x, y, W, H, hand, depth) {
  const { p, o, rng } = s
  const short = Math.min(W, H), long = Math.max(W, H)
  if (short < 3 * p * 0.97) {
    if (o.fillers) filler(s, x, y, W, H)
    return
  }
  const asp = long / short
  if (asp < 1.6 || depth > 2) {
    spiral(s, x, y, W, H, hand)
    return
  }
  if (asp < 3.2) {
    if (rng.chance(o.pairs)) pair(s, x, y, W, H, hand)
    else spiral(s, x, y, W, H, hand)
    return
  }
  // chain of near-square or pair units along the strip, alternating hand
  const target = short * rng.range(1.15, 2.1)
  const n = Math.max(2, Math.round(long / target))
  const cuts = [0]
  for (let i = 1; i < n; i++) cuts.push((long * (i + rng.jitter(0.18))) / n)
  cuts.push(long)
  for (let i = 0; i < n; i++) {
    const a = cuts[i], b = cuts[i + 1]
    if (W >= H) layout(s, x + a, y, b - a, H, i % 2 ? -hand : hand, depth + 1)
    else layout(s, x, y + a, W, b - a, i % 2 ? -hand : hand, depth + 1)
  }
}

/** Pitch adapted so a whole number of grooves spans `span` (≥ 2 when possible). */
function fitPitch(span, p) {
  const n = Math.max(1, Math.round(span / p))
  return Math.min(p * 1.15, Math.max(p * 0.87, span / n))
}

/** A squared spiral in the box [x, x+W] × [y, y+H] (cell frame). */
function spiral(s, x, y, W, H, hand) {
  const { p, o, rng } = s
  const short = Math.min(W, H)
  const q = fitPitch(short - p, p)
  const L = x + p / 2, B = y + p / 2, R = x + W - p / 2, T = y + H - p / 2
  // start at a random corner; first leg along the long side so the centre stub runs lengthwise
  const eyed = o.eyes > 0 && short >= 6 * p && rng.chance(o.eyes)
  const stop = eyed ? 2.6 * q : 0
  const corners = [
    [L, B, [1, 0], [0, 1]],
    [R, B, [0, 1], [-1, 0]],
    [R, T, [-1, 0], [0, -1]],
    [L, T, [0, -1], [1, 0]],
  ]
  const [cx, cy, e1, e2] = corners[rng.int(0, 3)]
  const len1 = Math.abs(e1[0]) * (R - L) + Math.abs(e1[1]) * (T - B)
  const len2 = Math.abs(e2[0]) * (R - L) + Math.abs(e2[1]) * (T - B)
  const pts = sqSpiral(len1, len2, q, stop).map(([a, b]) => [cx + a * e1[0] + b * e2[0], cy + a * e1[1] + b * e2[1]])
  // the other hand: mirror across the box (one reflection reverses the winding)
  if (hand < 0) for (const pt of pts) pt[0] = L + R - pt[0]
  stroke(s, pts, q)
  s.stats.spirals++
  if (eyed) {
    ring(s, (L + R) / 2, (B + T) / 2, q * 0.7)
  }
}

/**
 * Canonical inward squared spiral: start (0,0) heading +x, turning left,
 * box w × h, step q. Stops when the next leg would be shorter than q/2, or
 * when the remaining box is smaller than `stop` (room for an eye).
 */
function sqSpiral(w, h, q, stop = 0) {
  let l = 0, r = w, b = 0, t = h
  let x = 0, y = 0
  const pts = [[0, 0]]
  const min = q * 0.5
  for (let guard = 0; guard < 200; guard++) {
    if (r - x < min) break
    x = r; pts.push([x, y]); b += q
    if (t - y < min) break
    y = t; pts.push([x, y]); r -= q
    if (x - l < min) break
    x = l; pts.push([x, y]); t -= q
    if (y - b < min) break
    y = b; pts.push([x, y]); l += q
    if (stop && (r - l < stop || t - b < stop)) break
  }
  return pts
}

/**
 * 双联雷纹: two spirals sharing one line. 'S' — both wind the same way and
 * the bottom line runs on under the second; 'mirror' — opposite hands joined
 * by a short bridge (⟲_⟳).
 */
function pair(s, x, y, W, H, hand) {
  const { p, rng } = s
  if (H > W) {
    // the layout below assumes a horizontal pair; transpose
    const tp = s.toPanel
    const sub = { ...s, toPanel: (u, v) => tp(x + (v - y), y + (u - x)) }
    // transposing mirrors, so flip hand to keep it
    pair(sub, x, y, H, W, -hand)
    return
  }
  const q = fitPitch(H - p, p)
  const L = x + p / 2, B = y + p / 2, R = x + W - p / 2, T = y + H - p / 2
  const a = L + ((R - L - q) / 2) * rng.range(0.9, 1.1)
  const Apts = sqSpiral(T - B, a - L, q).map(([c, d]) => [a - d, B + c]) // O=(a,B) e1=+y e2=−x
  let Bpts
  const S = rng.chance(0.5)
  if (S) Bpts = sqSpiral(R - (a + q), T - B, q).map(([c, d]) => [a + q + c, B + d]) // e1=+x e2=+y
  else Bpts = sqSpiral(T - B, R - (a + q), q).map(([c, d]) => [a + q + d, B + c]) // e1=+y e2=+x (CW)
  const pts = Apts.reverse().concat(Bpts)
  if (hand < 0) for (const pt of pts) pt[1] = y + H - (pt[1] - y) // mirror in v
  stroke(s, pts, q)
  s.stats.pairs++
}

/** Slivers: a C-hook if there is room for two lines, else one contour line. */
function filler(s, x, y, W, H) {
  const { p, rng } = s
  const short = Math.min(W, H), long = Math.max(W, H)
  const horiz = W >= H
  const P = (u, v) => (horiz ? [x + u, y + v] : [x + v, y + u])
  if (long < 2 * p) return
  const span = short - p
  if (span >= 0.8 * p && long >= 3 * p) {
    // C / U hook: two lines q apart, closed at one end, curling in at the other
    const q = span
    const L = p / 2, R = long - p / 2, B = p / 2, T = short - p / 2
    const k = Math.min(q, (R - L) * 0.3)
    const pts = rng.chance(0.5)
      ? [P(R - k, T), P(L, T), P(L, B), P(R, B)]
      : [P(L + k, T), P(R, T), P(R, B), P(L, B)]
    stroke(s, pts, q)
  } else if (long >= 3.5 * p) {
    const v = short / 2
    stroke(s, [P(p / 2, v), P(long - p / 2, v)], p)
  } else return
  s.stats.fillers++
}

function ring(s, x, y, r) {
  const n = 12
  const pts = []
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push([x + r * Math.cos(a), y + r * Math.sin(a)])
  }
  s.strokes.push({ pts: pts.map(([u, v]) => s.toPanel(u, v)), radius: 0, closed: true })
}

/** Queue a polyline (cell-frame points) with its corner radius and jitter. */
function stroke(s, pts, q) {
  const { o, rng } = s
  const j = o.jitter * q
  const out = pts.map(([u, v]) => s.toPanel(u + rng.jitter(j), v + rng.jitter(j)))
  const radius = q * (0.12 + 0.88 * Math.max(0, Math.min(1, o.roundness)))
  s.strokes.push({ pts: out, radius })
}

// ----------------------------------------------------------------- draw

function drawStrokes(panel, strokes, o) {
  const lw = o.debugCells === true ? 0.2 : o.pitch * o.line
  const draw = (ctx) => {
    ctx.lineWidth = lw
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    for (const st of strokes) {
      const pts = st.pts
      if (pts.length < 2) continue
      ctx.moveTo(pts[0][0], pts[0][1])
      if (st.closed) {
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
        ctx.closePath()
        ctx.moveTo(pts[0][0], pts[0][1])
        continue
      }
      for (let i = 1; i < pts.length - 1; i++) {
        const a = pts[i - 1], b = pts[i], c = pts[i + 1]
        const l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1])
        // the first leg's start is free: allow the full leg; interior legs are shared by two corners
        const r = Math.min(st.radius, (i === 1 ? l1 : l1 / 2), (i === pts.length - 2 ? l2 : l2 / 2))
        if (r > 1e-3) ctx.arcTo(b[0], b[1], c[0], c[1], r)
        else ctx.lineTo(b[0], b[1])
      }
      const last = pts[pts.length - 1]
      ctx.lineTo(last[0], last[1])
    }
    ctx.stroke()
  }
  if (o.mode === 'thread') panel.add(draw, { height: o.depth, profile: 'ridge' })
  else panel.sink(draw, { depth: o.depth, shoulder: lw * 0.4, profile: 'u' })
}

// ----------------------------------------------------------------- misc

/** Most common field height (0.02 mm bins) under a mask: a plateau's top. */
function modeHeight(panel, mask) {
  const bins = new Map()
  const f = panel.field
  for (let i = 0; i < f.length; i += 3) {
    if (mask[i] < 0.5) continue
    const b = Math.round(f[i] / 0.02)
    bins.set(b, (bins.get(b) || 0) + 1)
  }
  let best = 0, n = -1
  for (const [b, c] of bins) if (c > n) { n = c; best = b }
  return best * 0.02
}

const r3 = (v) => Math.round(v * 1000) / 1000
const now = () => (typeof performance !== 'undefined' ? performance.now() : Date.now())
