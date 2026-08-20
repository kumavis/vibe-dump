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
// only once the pass is over, so nothing depends on the order the strokes
// happen to be visited in, and the result is identical every render.
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
    hint: 'Which pairs of strokes see each other. Restrict it to component boundaries and the glyph opens at its joints while each component stays internally tight — or ask for the exact opposite.',
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
const STEP_CAP = 0.6 // per-pass ceiling, in radii (or enforced clearances, whichever is wider) — what keeps the relaxation from ringing
const TOTAL_CAP = 1.75 // cumulative ceiling, same unit, measured from where the stage found the point
const BIAS_MAX = 0.9 // at |politeness| = 1 the yielding stroke gets 1.9× the push, the senior one 0.1×
const END_SPAN = 0.3 // share of each end over which "hold the ends" fades out
const SELF_DETOUR = 1.5 // a stroke is a stranger to itself where the walk between two points is this much longer than the gap: a right-angle turn measures 1.41 and must not count, a U-turn measures 1.57 and must
const RELAX_PASSES = 2 // Chaikin passes at syRelax = 1
const MIN_KEEP = 0.3 // never trim a stroke below this share of its length
const CTRL_SPAN = 4 // control samples across one influence radius (see gather)
const CTRL_MIN = 4 // …but never fewer than this many per stroke
const CTRL_STEP_MAX = 8
const MAX_DIM = 96 // grid resolution ceiling: a glyph flung across the plane gets coarser cells, not a huge table
const WORK_BUDGET = 3.5e6 // neighbour tests per apply before the scan starts striding
// null-prototype: an unrecognised scope must fall back to "every stroke", and a
// plain object would answer `toString`/`constructor`/`__proto__` with an
// inherited member that survives the `?? 0` and silently picks another mode.
const SCOPES = { __proto__: null, all: 0, 'cross-component': 1, 'cross-radical': 2, 'same-component': 3 }

// The point cloud as one struct of arrays, grown in a single go and reused: a
// thumbnail grid renders a thousand glyphs a second and must not allocate for
// any of them. Every hot pass destructures this into locals first — reading a
// module-level binding inside the inner loop costs several times the arithmetic.
const CLOUD_F = ['px', 'py', 'ax', 'ay', 'ddx', 'ddy', 'tgx', 'tgy', 'arc', 'damp', 'sx', 'sy', 'sarc']
const CLOUD_I = ['sid', 'key', 'six', 'cellOf', 'entries', 'ssid', 'skey']
const cloud = {}
let cloudCap = 0
function reserve(n) {
  if (n <= cloudCap) return
  cloudCap = Math.max(n, cloudCap * 2, 512)
  for (const k of CLOUD_F) cloud[k] = new Float64Array(cloudCap)
  for (const k of CLOUD_I) cloud[k] = new Int32Array(cloudCap)
}
reserve(512)

// Per-stroke bookkeeping: where each stroke's control samples start in the
// cloud, and how many source samples one control sample stands for.
const rows = { off: new Int32Array(64), step: new Int32Array(64) }
function reserveRows(n) {
  if (rows.off.length >= n) return
  rows.off = new Int32Array(n)
  rows.step = new Int32Array(n)
}

const grid = { W: 1, H: 1, x0: 0, y0: 0, inv: 1, start: new Int32Array(1), cursor: new Int32Array(1) }

const rd = (v, d, lo, hi) => clamp(Number.isFinite(v) ? v : d, lo, hi)
const fin = (v, d) => (Number.isFinite(v) ? v : Number.isFinite(d) ? d : 0)

/**
 * The component a stroke belongs to, for shyness purposes: the outermost group
 * below the whole-character root. KanjiVG decomposes far finer than the eye
 * reads, and it is the top-level split (氵 against 青) that looks like two trees.
 */
function componentKey(s) {
  const a = s.ancestry
  if (!a || !a.length) return -1
  return a.length > 1 ? a[1] : a[0]
}

/** Outermost ancestor marked as the radical, −1 for everything outside it. */
function radicalKey(skel, s) {
  const a = s.ancestry
  if (!a) return -1
  for (let k = 0; k < a.length; k++) {
    const g = skel.groups[a[k]]
    if (g && g.isRadical) return a[k]
  }
  return -1
}

/** Control samples for a stroke of `n` points taken every `st` points. */
const ctrlCount = (n, st) => Math.ceil((n - 1) / st) + 1

/**
 * Copy every live stroke into the flat cloud, with its per-point constants.
 *
 * Not every sample point goes in. The repulsion field varies over the scale of
 * the influence radius, while a stroke is sampled many times finer than that,
 * so the cloud takes one CONTROL SAMPLE every `target` of arc length and the
 * displacement is interpolated back onto the rest afterwards. Pair work is
 * quadratic in the cloud size, so this is most of what makes the operator
 * affordable — and it costs nothing visually, since a field sampled four times
 * per radius has no detail left to lose. `target` of 0 asks for every point,
 * which is what the tip measurement wants.
 *
 * The scope collapses to a single integer key per point plus "must match /
 * must differ", which keeps the pair test in the inner loop to one compare.
 */
function gather(skel, live, preserve, mode, target) {
  const { off, step } = rows
  let N = 0
  for (let k = 0; k < live.length; k++) {
    const s = live[k]
    const n = s.n
    const p = s.pts
    let L = 0
    for (let i = 1; i < n; i++) {
      const dx = p[i * 2] - p[i * 2 - 2]
      const dy = p[i * 2 + 1] - p[i * 2 - 1]
      L += Math.sqrt(dx * dx + dy * dy)
    }
    const spacing = L / (n - 1)
    let st = target > 0 && spacing > 1e-9 ? Math.floor(target / spacing) : 1
    if (st > CTRL_STEP_MAX) st = CTRL_STEP_MAX
    const cap = Math.floor((n - 1) / (CTRL_MIN - 1))
    if (st > cap) st = cap
    if (st < 1) st = 1
    step[k] = st
    off[k] = N
    N += ctrlCount(n, st)
  }
  off[live.length] = N
  if (!N) return 0
  reserve(N)
  const { px, py, ax, ay, arc, damp, sid, key, six } = cloud
  for (let k = 0; k < live.length; k++) {
    const s = live[k]
    const n = s.n
    const p = s.pts
    const kk = mode === 2 ? radicalKey(skel, s) : componentKey(s)
    const m = ctrlCount(n, step[k])
    const span = (n - 1) / (m - 1)
    let g = off[k]
    let acc = 0
    let prev = 0
    for (let c = 0; c < m; c++) {
      const i = c === m - 1 ? n - 1 : Math.round(c * span) // both tips are always control samples
      // Arc length is walked along the SOURCE polyline, never control sample to
      // control sample. The self-avoidance test weighs this walk against the
      // straight-line gap with only 5% of margin between a right-angle turn and
      // a U-turn, and a chord laid across a decimated hook cuts the corner —
      // measuring a U-turn short enough to disqualify it. Whole-stroke cost is
      // one distance per source point, the same pass the spacing already needs.
      for (let j = prev + 1; j <= i; j++) {
        const dx = p[j * 2] - p[j * 2 - 2]
        const dy = p[j * 2 + 1] - p[j * 2 - 1]
        const d = Math.sqrt(dx * dx + dy * dy)
        if (d > 0) acc += d // a non-finite point fails the test rather than poisoning the arc
      }
      prev = i
      const x = fin(p[i * 2], s.ref[i * 2])
      const y = fin(p[i * 2 + 1], s.ref[i * 2 + 1])
      px[g] = x
      py[g] = y
      ax[g] = x
      ay[g] = y
      arc[g] = acc
      sid[g] = s.i
      key[g] = kk
      six[g] = i
      const u = i / (n - 1)
      const e = (u < 1 - u ? u : 1 - u) / END_SPAN
      damp[g] = 1 - preserve * (1 - smoothstep(e < 1 ? e : 1))
      g++
    }
  }
  return N
}

/**
 * Give every source point the displacement its control samples earned, linearly
 * along the arc between them. The relaxation only ever moved control samples,
 * so this is what actually edits the skeleton.
 */
function spread(live) {
  const { px, py, ax, ay, six } = cloud
  const { off } = rows
  for (let k = 0; k < live.length; k++) {
    const p = live[k].pts
    const o = off[k]
    const m = off[k + 1] - o
    let ia = six[o]
    let dxa = px[o] - ax[o]
    let dya = py[o] - ay[o]
    p[ia * 2] += dxa
    p[ia * 2 + 1] += dya
    for (let c = 1; c < m; c++) {
      const ib = six[o + c]
      const dxb = px[o + c] - ax[o + c]
      const dyb = py[o + c] - ay[o + c]
      const inv = 1 / Math.max(1, ib - ia)
      for (let i = ia + 1; i <= ib; i++) {
        const t = (i - ia) * inv
        p[i * 2] += dxa + (dxb - dxa) * t
        p[i * 2 + 1] += dya + (dyb - dya) * t
      }
      ia = ib
      dxa = dxb
      dya = dyb
    }
  }
}

/** Did the relaxation actually move this stroke? */
function stirred(k) {
  const { px, py, ax, ay } = cloud
  const { off } = rows
  for (let g = off[k]; g < off[k + 1]; g++) if (px[g] !== ax[g] || py[g] !== ay[g]) return true
  return false
}

/**
 * Uniform bucket grid over the cloud, rebuilt from scratch every pass — points
 * move, and a stale cell assignment silently loses neighbours. The rebuild is a
 * counting sort: two linear passes, no allocation, and far cheaper than the
 * neighbour scans it saves. Cells are at least `cell` across, so the 3×3
 * neighbourhood of a point always holds everything within `cell` of it.
 *
 * The placement pass also writes each point's position and tags into grid
 * order (the `s*` arrays). That copy pays for itself many times over: the
 * neighbour scan then walks memory forwards instead of chasing an index
 * through the unsorted cloud, which was most of this operator's cost.
 */
function buildGrid(N, cell) {
  const { px, py, sid, key, arc, cellOf, entries, sx, sy, ssid, skey, sarc } = cloud
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
  if (grid.start.length < cells + 1) {
    grid.start = new Int32Array(cells + 1)
    grid.cursor = new Int32Array(cells + 1)
  }
  const start = grid.start
  const cursor = grid.cursor
  start.fill(0, 0, cells + 1)
  for (let k = 0; k < N; k++) {
    const ix = clamp(Math.floor((px[k] - x0) * inv), 0, W - 1)
    const iy = clamp(Math.floor((py[k] - y0) * inv), 0, H - 1)
    const g = iy * W + ix
    cellOf[k] = g
    start[g + 1]++
  }
  for (let g = 0; g < cells; g++) {
    start[g + 1] += start[g]
    cursor[g] = start[g]
  }
  for (let k = 0; k < N; k++) {
    const e = cursor[cellOf[k]]++
    entries[e] = k
    sx[e] = px[k]
    sy[e] = py[k]
    ssid[e] = sid[k]
    skey[e] = key[k]
    sarc[e] = arc[k]
  }
  grid.W = W
  grid.H = H
  grid.x0 = x0
  grid.y0 = y0
  grid.inv = inv
}

/** Unit tangent at every point, from its neighbours inside the same stroke. */
function tangentPass(live) {
  const { px, py, tgx, tgy } = cloud
  const { off } = rows
  for (let k = 0; k < live.length; k++) {
    const o = off[k]
    const n = off[k + 1] - o
    for (let i = 0; i < n; i++) {
      const a = o + (i > 0 ? i - 1 : 0)
      const b = o + (i < n - 1 ? i + 1 : n - 1)
      let dx = px[b] - px[a]
      let dy = py[b] - py[a]
      const L = Math.sqrt(dx * dx + dy * dy)
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
 * written to the Jacobi buffer and neither applied yet. Points are visited cell
 * by cell, so the three row-runs that cover a 3×3 neighbourhood are found once
 * per cell rather than once per point.
 *
 * The soft force takes its DIRECTION from the weighted sum of neighbours and
 * its MAGNITUDE from the single closest one. Summing both would let a thicket
 * of distant neighbours out-shout the one stroke actually pressing on this
 * point, and would make crowded glyphs move quadratically further than sparse
 * ones — the opposite of a canopy, which opens by the same width everywhere.
 */
function scatter(R, gap, want, bias, self, stride, iter) {
  const { sx, sy, ssid, skey, sarc, entries, ddx, ddy, tgx, tgy } = cloud
  const start = grid.start
  const W = grid.W
  const H = grid.H
  const R2 = R * R
  const invR = 1 / R
  const far = R > gap ? R : gap
  const q2 = far * far
  const selfDetour = SELF_DETOUR * SELF_DETOUR
  const biasLate = 1 + bias * BIAS_MAX // this point was written after the one pushing it
  const biasEarly = 1 - bias * BIAS_MAX
  const wantSame = want === 2
  for (let iy = 0; iy < H; iy++) {
    const row0 = (iy > 0 ? iy - 1 : 0) * W
    const row1 = (iy < H - 1 ? iy + 1 : H - 1) * W
    for (let ix = 0; ix < W; ix++) {
      const q0 = start[iy * W + ix]
      const q1 = start[iy * W + ix + 1]
      if (q0 === q1) continue
      const cx0 = ix > 0 ? ix - 1 : 0
      const cx1 = (ix < W - 1 ? ix + 1 : W - 1) + 1
      for (let q = q0; q < q1; q++) {
        const xi = sx[q]
        const yi = sy[q]
        const si = ssid[q]
        const ki = skey[q]
        const ai = sarc[q]
        const phase = stride > 1 ? (iter + q) % stride : 0
        let fx = 0
        let fy = 0
        let wMax = 0
        let gx = 0
        let gy = 0
        for (let row = row0; row <= row1; row += W) {
          const e1 = start[row + cx1]
          for (let e = start[row + cx0] + phase; e < e1; e += stride) {
            let vx = xi - sx[e]
            let vy = yi - sy[e]
            const d2 = vx * vx + vy * vy
            if (d2 >= q2) continue
            const sj = ssid[e]
            let scale
            if (sj === si) {
              // The point's own stroke, including the point itself. Adjacent
              // samples are close in space *because* they are close along the
              // stroke; only where the arc between them detours far further
              // than the gap has the stroke curled back on itself.
              if (self <= 0) continue
              const da = ai - sarc[e]
              if (da * da <= selfDetour * d2) continue
              scale = self
            } else {
              if (want !== 0 && (ki === skey[e]) !== wantSame) continue
              scale = sj < si ? biasLate : biasEarly
            }
            let d = Math.sqrt(d2)
            if (d > 1e-6) {
              const invd = 1 / d
              vx *= invd
              vy *= invd
            } else {
              // exactly coincident: no direction to be had, so leave along the
              // normal, signed by index so the two points agree to disagree
              const o = entries[q]
              const sgn = q > e ? 1 : -1
              vx = -tgy[o] * sgn
              vy = tgx[o] * sgn
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
          const L = Math.sqrt(fx * fx + fy * fy)
          if (L > 1e-12) {
            const mag = (SOFT_STEP * R * wMax) / L
            mx = fx * mag
            my = fy * mag
          }
        }
        if (gap > 0) {
          const L = Math.sqrt(gx * gx + gy * gy)
          if (L > gap) {
            const k = gap / L
            gx *= k
            gy *= k
          }
          mx += gx * HARD_STEP
          my += gy * HARD_STEP
        }
        const o = entries[q]
        ddx[o] = mx
        ddy[o] = my
      }
    }
  }
}

/** Apply the accumulated pass: perpendicular constraint, end damping, clamps. */
function integrate(N, perp, strength, stepCap, totalCap) {
  const { px, py, ax, ay, ddx, ddy, tgx, tgy, damp } = cloud
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
    const L = Math.sqrt(mx * mx + my * my)
    if (L > stepCap) {
      const s = stepCap / L
      mx *= s
      my *= s
    }
    let x = px[i] + mx
    let y = py[i] + my
    const ex = x - ax[i]
    const ey = y - ay[i]
    const eL = Math.sqrt(ex * ex + ey * ey)
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
function crowded(i, reach2, want) {
  const { px, py, sid, key, cellOf, sx, sy, ssid, skey } = cloud
  const start = grid.start
  const W = grid.W
  const g = cellOf[i]
  const iy = (g / W) | 0
  const ix = g - iy * W
  const xi = px[i]
  const yi = py[i]
  const si = sid[i]
  const ki = key[i]
  const wantSame = want === 2
  const row0 = (iy > 0 ? iy - 1 : 0) * W
  const row1 = (iy < grid.H - 1 ? iy + 1 : grid.H - 1) * W
  const cx0 = ix > 0 ? ix - 1 : 0
  const cx1 = (ix < W - 1 ? ix + 1 : W - 1) + 1
  for (let row = row0; row <= row1; row += W) {
    const e1 = start[row + cx1]
    for (let e = start[row + cx0]; e < e1; e++) {
      if (ssid[e] === si) continue
      if (want !== 0 && (ki === skey[e]) !== wantSame) continue
      const vx = xi - sx[e]
      const vy = yi - sy[e]
      if (vx * vx + vy * vy < reach2) return true
    }
  }
  return false
}

/**
 * The canopy gap. Walk in from each tip until the sample has its clearance and
 * trim the stroke there — up to the allowance and never further. No point
 * moves, which makes this idempotent by construction: the same tip measures the
 * same distance next time, and t0/t1 only ever tighten.
 */
function trimEnds(live, allow, reach, want) {
  const { off } = rows
  const reach2 = reach * reach
  for (let k = 0; k < live.length; k++) {
    const s = live[k]
    const n = s.n
    const o = off[k]
    const maxSteps = Math.floor(allow * (n - 1))
    if (maxSteps < 1) continue
    let a0 = 0
    while (a0 < maxSteps && crowded(o + a0, reach2, want)) a0++
    let a1 = 0
    while (a1 < maxSteps && crowded(o + n - 1 - a1, reach2, want)) a1++
    const t0 = a0 / (n - 1)
    const t1 = 1 - a1 / (n - 1)
    if (t0 > s.t0) s.t0 = t0
    if (t1 < s.t1) s.t1 = t1
    if (s.t1 - s.t0 < MIN_KEEP) {
      // a stroke crowded at both ends would otherwise retract to nothing
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
  // the pair test only ever asks whether two keys match; the scope decides which answer passes
  const want = mode === 0 ? 0 : mode === 3 ? 2 : 1
  let iters = Math.round(rd(P.syIterations, 6, 1, 24))
  if (quality < 1) iters = Math.max(1, Math.ceil(iters * quality))

  const live = []
  for (const s of skel.strokes) if (s.alive && s.n >= 2) live.push(s)
  // a lone stroke has nobody to be shy of, unless it is shy of itself
  if (!live.length || (live.length === 1 && self <= 0)) return

  reserveRows(live.length + 1)
  const far = Math.max(R, gap)
  const N = gather(skel, live, preserve, mode, far / CTRL_SPAN)
  if (!N) return

  const stepCap = STEP_CAP * far
  const totalCap = TOTAL_CAP * far
  let stride = 1
  for (let it = 0; it < iters; it++) {
    buildGrid(N, far)
    if (it === 0) {
      // Neighbour work grows with the square of the radius. Past the budget the
      // scan samples every stride-th point instead: at a radius that wide the
      // glyph is a cloud, and a sampled push direction is indistinguishable.
      const est = ((N * N) / Math.max(1, grid.W * grid.H)) * 9 * iters
      stride = est > WORK_BUDGET ? Math.ceil(est / WORK_BUDGET) : 1
    }
    tangentPass(live)
    scatter(R, gap, want, bias, self, stride, it)
    integrate(N, perp, strength, stepCap, totalCap)
  }

  spread(live)
  for (let k = 0; k < live.length; k++) {
    const s = live[k]
    // a stroke nobody crowded keeps the shape it arrived with, kinks and all
    if (relax > 0 && stirred(k)) resmooth(s, relax)
    // one non-finite coordinate would poison every later stage
    for (let i = 0; i < s.pts.length; i++) if (!Number.isFinite(s.pts[i])) s.pts[i] = s.ref[i]
  }

  if (allow > 0) {
    // Tips are measured against every point, not just the control samples: a
    // stroke passing between two of them is exactly what a tip must retract from.
    const full = gather(skel, live, preserve, mode, 0)
    buildGrid(full, reach)
    trimEnds(live, allow, reach, want)
  }

  recomputeBounds(skel)
  recomputeLengths(skel)
}
