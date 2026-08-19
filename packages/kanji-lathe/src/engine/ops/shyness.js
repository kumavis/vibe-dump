// Crown shyness — the canopy rule, read as a rule for type.
//
// Adjacent trees stop growing where their crowns would touch, so a forest roof
// is laced with rivers of sky. The same rule on a glyph: strokes that crowd
// each other lean apart, and a tip that runs into a neighbour stops short of
// it. A dense kanji opens into a lattice of light with its skeleton intact.
//
// Two forces, one traversal. The soft one is a smooth falloff repulsion — how a
// crown leans out of shade. The hard one is a projection that separates any
// pair closer than the target clearance, whatever the soft force thinks. Both
// are Jacobi-relaxed: a pass accumulates into a second buffer and is applied
// only when the pass is over, so nothing depends on the order strokes happen to
// be visited in, and the result is identical every render.
import { clamp, chaikin, smoothstep } from '../../geom/path.js'
import { recomputeBounds, recomputeLengths, EM } from '../skeleton.js'

export const params = [
  {
    id: 'syStrength',
    label: 'Shyness',
    group: 'Crown shyness',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    hint: 'Master amount. Strokes recoil from their neighbours and tips retract before contact, opening a river of white through a crowded glyph.',
  },
  {
    id: 'syRadius',
    label: 'Influence radius',
    group: 'Crown shyness',
    type: 'range',
    min: 0.02,
    max: 0.25,
    step: 0.005,
    default: 0.08,
    unit: 'em',
    when: (P) => P.syStrength > 0,
    hint: 'How far a stroke feels its neighbours. Small values only unstick strokes that nearly touch; large ones shoulder whole components apart.',
  },
  {
    id: 'syIterations',
    label: 'Iterations',
    group: 'Crown shyness',
    type: 'range',
    min: 1,
    max: 24,
    step: 1,
    default: 6,
    when: (P) => P.syStrength > 0,
    hint: 'Relaxation passes. More passes settle closer to a state where nothing crowds anything — the amount of movement barely changes, the fairness of it does. Thumbnails quietly use fewer.',
  },
  {
    id: 'syPerp',
    label: 'Bow, don’t slide',
    group: 'Crown shyness',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.6,
    when: (P) => P.syStrength > 0,
    hint: 'Keep the recoil perpendicular to the stroke, so a crowded stroke bows away from its neighbour instead of sliding along its own length and going nowhere.',
  },
  {
    id: 'syScope',
    label: 'Who avoids whom',
    group: 'Crown shyness',
    type: 'select',
    default: 'all',
    options: [
      { value: 'all', label: 'Every stroke' },
      { value: 'cross-component', label: 'Different components only' },
      { value: 'cross-radical', label: 'Across the radical only' },
      { value: 'same-component', label: 'Inside one component only' },
    ],
    when: (P) => P.syStrength > 0,
    hint: 'Which pairs of strokes see each other. Restricting it to component boundaries opens the glyph at its joints while each component stays internally tight — or the exact opposite.',
  },
  {
    id: 'syOrderBias',
    label: 'Stroke-order politeness',
    group: 'Crown shyness',
    type: 'range',
    min: -1,
    max: 1,
    step: 0.01,
    default: 0,
    bipolar: true,
    when: (P) => P.syStrength > 0,
    hint: 'Who yields. At +1 a later stroke gives way to everything written before it while the earlier stroke barely moves; at −1 seniority runs the other way.',
  },
  {
    id: 'syTrim',
    label: 'Canopy gap',
    group: 'Canopy gap',
    type: 'range',
    min: 0,
    max: 0.35,
    step: 0.005,
    default: 0.12,
    when: (P) => P.syStrength > 0,
    hint: 'How much of a stroke may be given up at each end to clear a neighbour, as a share of its own length. Around 0.15 a dense glyph visibly opens up without falling apart.',
  },
  {
    id: 'syTrimReach',
    label: 'Gap clearance',
    group: 'Canopy gap',
    type: 'range',
    min: 0.02,
    max: 0.2,
    step: 0.005,
    default: 0.07,
    unit: 'em',
    when: (P) => P.syStrength > 0 && P.syTrim > 0,
    hint: 'The daylight a tip retreats to find. It keeps retracting — never past the canopy gap — until nothing foreign is this close.',
  },
  {
    id: 'syGapTarget',
    label: 'Enforced clearance',
    group: 'Canopy gap',
    type: 'range',
    min: 0,
    max: 0.12,
    step: 0.002,
    default: 0,
    unit: 'em',
    when: (P) => P.syStrength > 0,
    hint: 'A clearance that is imposed rather than merely encouraged: any two points closer than this are projected apart outright, however much else they have to fight.',
  },
  {
    id: 'syPreserveEnds',
    label: 'Hold the ends',
    group: 'Crown shyness',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.3,
    when: (P) => P.syStrength > 0,
    hint: 'Damp the recoil at the endpoints so strokes bow in the middle but keep the anchors a reader navigates the glyph by.',
  },
  {
    id: 'syRelax',
    label: 'Re-smooth',
    group: 'Crown shyness',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0.25,
    when: (P) => P.syStrength > 0,
    hint: 'Smooth each stroke once the pushing is done, so the repulsion leaves bows rather than kinks.',
  },
  {
    id: 'syRepelSelf',
    label: 'Self-avoidance',
    group: 'Crown shyness',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.01,
    default: 0,
    when: (P) => P.syStrength > 0,
    hint: 'Let a stroke avoid itself where it doubles back on its own path — a tight hook uncurls instead of pinching shut.',
  },
]

const SOFT_STEP = 0.5 // share of the radius the softest force may push in one pass
const HARD_STEP = 0.8 // under-relaxed projection: overshooting one constraint breaks the next
const STEP_CAP = 0.6 // per-pass ceiling, in radii — what keeps the relaxation from ringing
const TOTAL_CAP = 1.75 // cumulative ceiling, in radii, measured from where the stage found the point
const BIAS_MAX = 0.9 // at |politeness| = 1 the yielding stroke gets 1.9x the push, the senior one 0.1x
const END_SPAN = 0.3 // share of each end over which "hold the ends" fades out
const SELF_SPAN = 1.5 // arc separation, in radii, before a stroke is a stranger to itself
const RELAX_PASSES = 2 // Chaikin passes at syRelax = 1
const MIN_KEEP = 0.3 // never trim a stroke below this share of its length
const MAX_DIM = 96 // grid resolution ceiling: a glyph flung across the plane gets coarser cells, not a huge table
const WORK_BUDGET = 3.5e6 // neighbour tests per apply before the scan starts striding
const SCOPES = { all: 0, 'cross-component': 1, 'cross-radical': 2, 'same-component': 3 }

// Scratch, grown on demand and reused: a thumbnail grid renders a thousand
// glyphs a second and must not allocate for any of them.
const bufF = {
  px: new Float64Array(1024),
  py: new Float64Array(1024),
  ax: new Float64Array(1024),
  ay: new Float64Array(1024),
  ddx: new Float64Array(1024),
  ddy: new Float64Array(1024),
  tgx: new Float64Array(1024),
  tgy: new Float64Array(1024),
  arc: new Float64Array(1024),
  damp: new Float64Array(1024),
}
const bufI = {
  sid: new Int32Array(1024),
  comp: new Int32Array(1024),
  rad: new Int32Array(1024),
  cellOf: new Int32Array(1024),
  entries: new Int32Array(1024),
  start: new Int32Array(1024),
  cursor: new Int32Array(1024),
  off: new Int32Array(64),
}
const needF = (k, n) => (bufF[k].length < n ? (bufF[k] = new Float64Array(n)) : bufF[k])
const needI = (k, n) => (bufI[k].length < n ? (bufI[k] = new Int32Array(n)) : bufI[k])
const rd = (v, d, lo, hi) => clamp(Number.isFinite(v) ? v : d, lo, hi)
const fin = (v, d) => (Number.isFinite(v) ? v : Number.isFinite(d) ? d : 0)

// The point cloud, flat and stroke-contiguous. Module-level so the passes can
// share it without threading a dozen arguments through the hot loops.
let px
let py
let ax // where this stage found each point — the cumulative clamp measures from here
let ay
let ddx // Jacobi accumulator: written during a pass, read after it
let ddy
let tgx
let tgy
let arc
let damp
let sid
let comp
let rad
let cellOf
let entries
let gstart
const grid = { W: 1, H: 1, x0: 0, y0: 0, inv: 1 }

/**
 * The component a stroke belongs to for shyness purposes: the outermost group
 * below the whole-character root. KanjiVG nests far finer than the eye reads,
 * and it is the top-level split (氵 against 青) that a reader sees as two trees.
 */
function componentKey(s) {
  const a = s.ancestry
  if (!a || !a.length) return -1
  return a.length > 1 ? a[1] : a[0]
}

/** Outermost ancestor marked as the radical, or −1 for everything outside it. */
function radicalKey(skel, s) {
  const a = s.ancestry
  if (!a) return -1
  for (let k = 0; k < a.length; k++) {
    const g = skel.groups[a[k]]
    if (g && g.isRadical) return a[k]
  }
  return -1
}

/** Does the scope let these two points push each other? Callers exclude self-pairs. */
function scoped(mode, i, j) {
  if (mode === 1) return comp[i] !== comp[j]
  if (mode === 2) return rad[i] !== rad[j]
  if (mode === 3) return comp[i] === comp[j]
  return true
}

/** Copy every live stroke into the flat cloud, with its per-point constants. */
function gather(skel, live, off, preserve) {
  let N = 0
  for (const s of skel.strokes) if (s.alive && s.n >= 2) N += s.n
  if (!N) return 0
  px = needF('px', N)
  py = needF('py', N)
  ax = needF('ax', N)
  ay = needF('ay', N)
  ddx = needF('ddx', N)
  ddy = needF('ddy', N)
  tgx = needF('tgx', N)
  tgy = needF('tgy', N)
  arc = needF('arc', N)
  damp = needF('damp', N)
  sid = needI('sid', N)
  comp = needI('comp', N)
  rad = needI('rad', N)
  cellOf = needI('cellOf', N)
  entries = needI('entries', N)
  let o = 0
  for (let k = 0; k < live.length; k++) {
    const s = live[k]
    const n = s.n
    const p = s.pts
    const c = componentKey(s)
    const r = radicalKey(skel, s)
    off[k] = o
    let acc = 0
    for (let i = 0; i < n; i++) {
      const g = o + i
      const x = fin(p[i * 2], s.ref[i * 2])
      const y = fin(p[i * 2 + 1], s.ref[i * 2 + 1])
      if (i > 0) acc += Math.hypot(x - px[g - 1], y - py[g - 1])
      px[g] = x
      py[g] = y
      ax[g] = x
      ay[g] = y
      arc[g] = acc
      sid[g] = s.i
      comp[g] = c
      rad[g] = r
      const u = i / (n - 1)
      const e = (u < 1 - u ? u : 1 - u) / END_SPAN
      damp[g] = 1 - preserve * (1 - smoothstep(e < 1 ? e : 1))
    }
    o += n
  }
  off[live.length] = o
  return N
}

/**
 * Uniform bucket grid over the cloud, rebuilt from scratch every pass — points
 * move, and a stale cell assignment silently loses neighbours. The rebuild is a
 * counting sort: two linear passes and no allocation, far cheaper than the
 * neighbour scans it saves. Cells are at least `cell` across, so the 3×3
 * neighbourhood of a point always contains everything within `cell` of it.
 */
function buildGrid(N, cell) {
  let x0 = Infinity
  let y0 = Infinity
  let x1 = -Infinity
  let y1 = -Infinity
  for (let k = 0; k < N; k++) {
    const x = px[k]
    const y = py[k]
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (y < y0) y0 = y
    if (y > y1) y1 = y
  }
  const spanX = Math.max(x1 - x0, 1e-6)
  const spanY = Math.max(y1 - y0, 1e-6)
  const c = Math.max(cell, spanX / MAX_DIM, spanY / MAX_DIM, 1e-6)
  const inv = 1 / c
  const W = Math.max(1, Math.min(MAX_DIM, Math.floor(spanX * inv) + 1))
  const H = Math.max(1, Math.min(MAX_DIM, Math.floor(spanY * inv) + 1))
  const cells = W * H
  const start = needI('start', cells + 1)
  const cursor = needI('cursor', cells)
  start.fill(0, 0, cells + 1)
  for (let k = 0; k < N; k++) {
    const ix = clamp(Math.floor((px[k] - x0) * inv), 0, W - 1)
    const iy = clamp(Math.floor((py[k] - y0) * inv), 0, H - 1)
    const g = iy * W + ix
    cellOf[k] = g
    start[g + 1]++
  }
  for (let g = 0; g < cells; g++) start[g + 1] += start[g]
  for (let g = 0; g < cells; g++) cursor[g] = start[g]
  for (let k = 0; k < N; k++) entries[cursor[cellOf[k]]++] = k
  gstart = start
  grid.W = W
  grid.H = H
  grid.x0 = x0
  grid.y0 = y0
  grid.inv = inv
}

/** Unit tangent at every point, from its neighbours inside the same stroke. */
function tangentPass(live, off) {
  for (let k = 0; k < live.length; k++) {
    const n = live[k].n
    const o = off[k]
    for (let i = 0; i < n; i++) {
      const a = o + (i > 0 ? i - 1 : 0)
      const b = o + (i < n - 1 ? i + 1 : n - 1)
      let dx = px[b] - px[a]
      let dy = py[b] - py[a]
      const L = Math.hypot(dx, dy)
      if (L > 1e-9) {
        dx /= L
        dy /= L
      } else {
        dx = 1
        dy = 0
      }
      tgx[o + i] = dx
      tgy[o + i] = dy
    }
  }
}

/**
 * One accumulation pass: for every point, the repulsion from foreign points
 * within the radius and the projection out of the enforced clearance, both
 * written to the Jacobi buffer and neither applied yet.
 *
 * The soft force takes its DIRECTION from the weighted sum of neighbours and
 * its MAGNITUDE from the single closest one. Summing both would let a thicket
 * of far neighbours out-shout one stroke pressing against this point, and would
 * make crowded glyphs move quadratically further than sparse ones.
 */
function scatter(N, R, gap, mode, bias, self, stride, iter) {
  const W = grid.W
  const H = grid.H
  const R2 = R * R
  const invR = 1 / R
  const q2 = Math.max(R, gap) ** 2
  const selfMin = SELF_SPAN * R
  for (let i = 0; i < N; i++) {
    const g = cellOf[i]
    const iy = (g / W) | 0
    const ix = g - iy * W
    const xi = px[i]
    const yi = py[i]
    const si = sid[i]
    const cy0 = iy > 0 ? iy - 1 : 0
    const cy1 = iy < H - 1 ? iy + 1 : H - 1
    const cx0 = ix > 0 ? ix - 1 : 0
    const cx1 = ix < W - 1 ? ix + 1 : W - 1
    let fx = 0
    let fy = 0
    let wMax = 0
    let gx = 0
    let gy = 0
    for (let cy = cy0; cy <= cy1; cy++) {
      const row = cy * W
      // one row of cells is one contiguous run of entries, so three runs cover
      // the whole 3×3 neighbourhood
      const e1 = gstart[row + cx1 + 1]
      for (let e = gstart[row + cx0] + ((iter + i) % stride); e < e1; e += stride) {
        const j = entries[e]
        const sj = sid[j]
        let scale = 1
        if (sj === si) {
          if (self <= 0) continue
          const da = arc[i] - arc[j]
          if ((da < 0 ? -da : da) < selfMin) continue
          scale = self
        } else {
          if (mode !== 0 && !scoped(mode, i, j)) continue
          if (bias !== 0) scale = 1 + bias * (si > sj ? BIAS_MAX : -BIAS_MAX)
        }
        let vx = xi - px[j]
        let vy = yi - py[j]
        const d2 = vx * vx + vy * vy
        if (d2 >= q2) continue
        let d = Math.sqrt(d2)
        if (d > 1e-6) {
          const invd = 1 / d
          vx *= invd
          vy *= invd
        } else {
          // exactly coincident: no direction to be had, so leave along the
          // normal, signed by index so both points agree to disagree
          const s = i > j ? 1 : -1
          vx = -tgy[i] * s
          vy = tgx[i] * s
          d = 0
        }
        if (d2 < R2) {
          const u = 1 - d * invR
          const w = u * u * scale
          fx += w * vx
          fy += w * vy
          if (w > wMax) wMax = w
        }
        if (d < gap) {
          const push = (gap - d) * 0.5 * scale
          gx += push * vx
          gy += push * vy
        }
      }
    }
    let mx = 0
    let my = 0
    if (wMax > 0) {
      const L = Math.hypot(fx, fy)
      if (L > 1e-12) {
        const mag = (SOFT_STEP * R * wMax) / L
        mx = fx * mag
        my = fy * mag
      }
    }
    if (gap > 0) {
      const L = Math.hypot(gx, gy)
      if (L > gap) {
        const k = gap / L
        gx *= k
        gy *= k
      }
      mx += gx * HARD_STEP
      my += gy * HARD_STEP
    }
    ddx[i] = mx
    ddy[i] = my
  }
}

/** Apply the accumulated pass: perpendicular constraint, end damping, clamps. */
function integrate(N, perp, strength, stepCap, totalCap) {
  for (let i = 0; i < N; i++) {
    let mx = ddx[i] * strength
    let my = ddy[i] * strength
    if (perp > 0) {
      const dot = (mx * tgx[i] + my * tgy[i]) * perp
      mx -= dot * tgx[i]
      my -= dot * tgy[i]
    }
    const k = damp[i]
    mx *= k
    my *= k
    const L = Math.hypot(mx, my)
    if (L > stepCap) {
      const s = stepCap / L
      mx *= s
      my *= s
    }
    let x = px[i] + mx
    let y = py[i] + my
    const ex = x - ax[i]
    const ey = y - ay[i]
    const eL = Math.hypot(ex, ey)
    if (eL > totalCap) {
      const s = totalCap / eL
      x = ax[i] + ex * s
      y = ay[i] + ey * s
    }
    if (Number.isFinite(x) && Number.isFinite(y)) {
      px[i] = x
      py[i] = y
    }
  }
}

/** Is anything foreign within `reach` of this point? */
function crowded(i, reach2, mode) {
  const W = grid.W
  const g = cellOf[i]
  const iy = (g / W) | 0
  const ix = g - iy * W
  const xi = px[i]
  const yi = py[i]
  const si = sid[i]
  const cy0 = iy > 0 ? iy - 1 : 0
  const cy1 = iy < grid.H - 1 ? iy + 1 : grid.H - 1
  const cx0 = ix > 0 ? ix - 1 : 0
  const cx1 = ix < W - 1 ? ix + 1 : W - 1
  for (let cy = cy0; cy <= cy1; cy++) {
    const row = cy * W
    const e1 = gstart[row + cx1 + 1]
    for (let e = gstart[row + cx0]; e < e1; e++) {
      const j = entries[e]
      if (sid[j] === si) continue
      if (mode !== 0 && !scoped(mode, i, j)) continue
      const vx = xi - px[j]
      const vy = yi - py[j]
      if (vx * vx + vy * vy < reach2) return true
    }
  }
  return false
}

/**
 * The canopy gap. Walk in from each tip until the sample has its clearance, and
 * trim the stroke there — up to the allowance and no further. Points are not
 * moved, so this is idempotent by construction: the same tip measures the same
 * distance next time, and t0/t1 only ever tighten.
 */
function trimEnds(live, off, allow, reach, mode) {
  const reach2 = reach * reach
  for (let k = 0; k < live.length; k++) {
    const s = live[k]
    const n = s.n
    const o = off[k]
    const maxSteps = Math.floor(allow * (n - 1))
    if (maxSteps < 1) continue
    let a0 = 0
    while (a0 < maxSteps && crowded(o + a0, reach2, mode)) a0++
    let a1 = 0
    while (a1 < maxSteps && crowded(o + n - 1 - a1, reach2, mode)) a1++
    const t0 = a0 / (n - 1)
    const t1 = 1 - a1 / (n - 1)
    if (t0 > s.t0) s.t0 = t0
    if (t1 < s.t1) s.t1 = t1
    if (s.t1 - s.t0 < MIN_KEEP) {
      // a stroke crowded at both ends would otherwise vanish entirely
      const c = clamp((s.t0 + s.t1) * 0.5, MIN_KEEP / 2, 1 - MIN_KEEP / 2)
      s.t0 = c - MIN_KEEP / 2
      s.t1 = c + MIN_KEEP / 2
    }
  }
}

/** Fractional Chaikin, endpoints pinned — the same smoother the shape stage uses. */
function resmooth(s, amount) {
  const total = amount * RELAX_PASSES
  const passes = Math.floor(total)
  const f = total - passes
  let cur = s.pts
  for (let i = 0; i < passes; i++) cur = chaikin(cur)
  if (f > 1e-4) {
    const nxt = chaikin(cur)
    if (cur === s.pts) cur = cur.slice()
    for (let i = 0; i < cur.length; i++) cur[i] += (nxt[i] - cur[i]) * f
  }
  if (cur !== s.pts) s.pts.set(cur)
}

export function apply(skel, P, ctx) {
  const strength = rd(P.syStrength, 0, 0, 1)
  if (strength <= 0) return

  const em = skel.em || EM
  const quality = ctx && Number.isFinite(ctx.quality) ? ctx.quality : 1
  const R = Math.max(rd(P.syRadius, 0.08, 0.02, 0.25) * em, 1e-3)
  const perp = rd(P.syPerp, 0.6, 0, 1)
  const bias = rd(P.syOrderBias, 0, -1, 1)
  const gap = rd(P.syGapTarget, 0, 0, 0.12) * em
  const self = rd(P.syRepelSelf, 0, 0, 1)
  const relax = rd(P.syRelax, 0.25, 0, 1)
  const preserve = rd(P.syPreserveEnds, 0.3, 0, 1)
  const allow = rd(P.syTrim, 0.12, 0, 0.35) * strength
  const reach = rd(P.syTrimReach, 0.07, 0.02, 0.2) * em
  const mode = SCOPES[P.syScope] ?? 0
  let iters = Math.round(rd(P.syIterations, 6, 1, 24))
  if (quality < 1) iters = Math.max(1, Math.ceil(iters * quality))

  const live = []
  for (const s of skel.strokes) if (s.alive && s.n >= 2) live.push(s)
  // one stroke has nobody to be shy of, and self-avoidance still needs a stroke
  if (live.length < 2 && !(live.length === 1 && self > 0)) return

  const off = needI('off', live.length + 1)
  const N = gather(skel, live, off, preserve)
  if (!N) return

  const cell = Math.max(R, gap, 1e-3)
  const stepCap = STEP_CAP * Math.max(R, gap)
  const totalCap = TOTAL_CAP * Math.max(R, gap)
  let stride = 1
  for (let it = 0; it < iters; it++) {
    buildGrid(N, cell)
    if (it === 0) {
      // Neighbour work grows with the square of the radius. Past the budget the
      // scan samples every stride-th point instead: at settings that wide the
      // glyph is a cloud and a sampled direction is indistinguishable.
      const est = ((N * N) / Math.max(1, grid.W * grid.H)) * 9 * iters
      stride = est > WORK_BUDGET ? Math.ceil(est / WORK_BUDGET) : 1
    }
    tangentPass(live, off)
    scatter(N, R, gap, mode, bias, self, stride, it)
    integrate(N, perp, strength, stepCap, totalCap)
  }

  for (let k = 0; k < live.length; k++) {
    const s = live[k]
    const o = off[k]
    for (let i = 0; i < s.n; i++) {
      s.pts[i * 2] = px[o + i]
      s.pts[i * 2 + 1] = py[o + i]
    }
    if (relax > 0) resmooth(s, relax)
    // one non-finite coordinate would poison every later stage
    for (let i = 0; i < s.pts.length; i++) if (!Number.isFinite(s.pts[i])) s.pts[i] = s.ref[i]
  }

  if (allow > 0) {
    // re-read the smoothed points, then measure every tip against the cloud
    for (let k = 0; k < live.length; k++) {
      const s = live[k]
      const o = off[k]
      for (let i = 0; i < s.n; i++) {
        px[o + i] = s.pts[i * 2]
        py[o + i] = s.pts[i * 2 + 1]
      }
    }
    buildGrid(N, reach)
    trimEnds(live, off, allow, reach, mode)
  }

  recomputeBounds(skel)
  recomputeLengths(skel)
}
