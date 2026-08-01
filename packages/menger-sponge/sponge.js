import * as THREE from 'three'

// ---------------------------------------------------------------------------
// The sponge: structure, and the mechanical choreography that carries it
// between recursion levels.
//
// The whole thing is driven by a single scalar `depth` in [0, MAX_DEPTH]. Every
// curve below is a pure function of `depth` (plus static per-cube data), which
// is what lets the animation be scrubbed, paused and — crucially — played
// backwards into a convincing re-assembly with no extra code.
// ---------------------------------------------------------------------------

const { clamp } = THREE.MathUtils
const TAU = Math.PI * 2
const HALF_PI = Math.PI / 2
const frac = (x) => x - Math.floor(x)

// ---- structure ------------------------------------------------------------
export const MAX_DEPTH = 3 // deepest recursion we ever render (20^3 = 8000)
const MAX_INSTANCES = 8000
const GAP = 0.98 // every cube renders at 98% of its cell → a dark gutter at every level
const NEST_EPS = 0.0022 // collapsed siblings nest instead of z-fighting

// ---- transition timing (t = the fractional part of depth) -----------------
export const CHARGE_IN = 0.22 // compress / charge-up ramp
const CHARGE_OUT = 0.14 // snap release; charge is back to 0 by t = 0.36
const T0 = CHARGE_IN // the first piston fires exactly at peak charge
const DELAY_SPREAD = 0.3 // max per-cube stagger
const DEPLOY_DUR = 0.46 // per-cube piston duration
// worst case finish: 0.22 + 0.30 + 0.46 = 0.98 → 0.02 of dead air before t = 1

const COMPRESS_AMT = 0.09 // block shrinks 9% at peak charge
const PULL_AMT = 0.045 // parent blocks pull 4.5% toward the origin
const SHUDDER_AMT = 0.0045 // rattle, in units of parentSize
const SHUDDER_FREQ = 17 // cycles per transition (~7 Hz at 2.4 s/level)

const PIST_BREAK = 0.62 // piston peaks (overshoot) at 62% of its window
const PIST_OVER = 0.1 // 10% overshoot past the slot
const AXIS_STAGGER = 0.16 // axis-by-axis offset
const AXIS_WIN = 1 - 2 * AXIS_STAGGER // 0.68

export const GLOW_IDLE = 0.16

// ---------------------------------------------------------------------------
// The 20 surviving cells of a 3x3x3 block
//
// Keep a cell iff at most one of (a,b,c) is zero: 8 corners + 12 edges. Face
// centres (two zeros) and the body centre (three zeros) are drilled out.
// The build order is load-bearing — index k = 0 must be the first entry,
// because it becomes the outermost (and therefore only visible) sibling when
// the 20 children are collapsed back inside their parent.
// ---------------------------------------------------------------------------
const OFFSETS = []
for (let a = -1; a <= 1; a++) {
  for (let b = -1; b <= 1; b++) {
    for (let c = -1; c <= 1; c++) {
      const zeros = (a === 0) + (b === 0) + (c === 0)
      if (zeros >= 2) continue
      OFFSETS.push({ a, b, c, corner: zeros === 0 })
    }
  }
}

const AXES = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]

// PERMS[permId][axis] = which of the three deploy slots that axis travels in.
const PERMS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
]
// The axis whose slot is 0 is also the twist axis: the cube screws out along
// the direction it moves first, like a bolt backing out of a hole.
const TWIST_AXIS_OF_PERM = [0, 0, 1, 2, 1, 2]

const DIAG = 1 / Math.sqrt(3)
const DIAG_HALF = Math.sqrt(3) / 2

// ---------------------------------------------------------------------------
// Static ambient occlusion
//
// Without this the sponge is unreadable at level 3: every one of the 8000 cubes
// glows its seams equally, the tunnels fill with light, and the whole thing
// collapses into a solid greebled block. So for each cell we march the six axis
// directions across the level's 3^L grid and measure how far the light gets out
// before it hits another cell. Fully exposed corners score 0.5 (three clear
// runs), a cell buried in the middle of the lattice scores ~0. That is exactly
// the signal that makes the holes read as holes.
// ---------------------------------------------------------------------------
const RAYS = [
  [1, 0, 0],
  [-1, 0, 0],
  [0, 1, 0],
  [0, -1, 0],
  [0, 0, 1],
  [0, 0, -1],
]

function computeOcclusion(lvl, gridN) {
  const N = gridN
  const occ = new Uint8Array(N * N * N)
  const gx = new Int32Array(lvl.n)
  const gy = new Int32Array(lvl.n)
  const gz = new Int32Array(lvl.n)
  const half = (N - 1) / 2
  for (let i = 0; i < lvl.n; i++) {
    gx[i] = Math.round(lvl.cx[i] / lvl.size + half)
    gy[i] = Math.round(lvl.cy[i] / lvl.size + half)
    gz[i] = Math.round(lvl.cz[i] / lvl.size + half)
    occ[(gx[i] * N + gy[i]) * N + gz[i]] = 1
  }

  const out = new Float32Array(lvl.n)
  for (let i = 0; i < lvl.n; i++) {
    let open = 0
    for (let d = 0; d < 6; d++) {
      const r = RAYS[d]
      let x = gx[i]
      let y = gy[i]
      let z = gz[i]
      let steps = 0
      for (;;) {
        x += r[0]
        y += r[1]
        z += r[2]
        if (x < 0 || y < 0 || z < 0 || x >= N || y >= N || z >= N) {
          steps = N // escaped the sponge entirely
          break
        }
        if (occ[(x * N + y) * N + z]) break
        steps++
      }
      open += steps / N
    }
    // 0.5 is the best any cell can score, so normalise to that and gamma the
    // result — a flat outer face has only one clear run and would otherwise sit
    // far too close to the buried cells.
    out[i] = Math.pow(clamp(open / 6 / 0.5, 0, 1), 0.45)
  }
  return out
}

// ---------------------------------------------------------------------------
// Level records — parallel typed arrays, built once at startup (~8400 cells).
//
// Children are indexed SIBLING-MAJOR: i = k * parentCount + p, so all 20
// siblings of a given nest rank are contiguous and the k = 0 block occupies
// [0, parentCount). That layout is what lets a fully collapsed sponge draw
// mesh.count = parentCount instead of 8000 — at a dwell the other 19 siblings
// are strictly inside the first one and contribute nothing but 20x overdraw of
// a very expensive fragment shader.
// ---------------------------------------------------------------------------
function buildLevels(maxLevel) {
  const levels = [
    {
      n: 1,
      size: 1,
      cx: Float32Array.of(0),
      cy: Float32Array.of(0),
      cz: Float32Array.of(0),
      restQ: Float32Array.of(0, 0, 0, 1),
      seed: Float32Array.of(0.137),
      occl: Float32Array.of(1), // the root block is fully exposed
    },
  ]

  const _pq = new THREE.Quaternion()
  const _tq = new THREE.Quaternion()

  for (let L = 0; L < maxLevel; L++) {
    const P = levels[L]
    const n = P.n * 20
    const size = P.size / 3
    const lvl = {
      n,
      size,
      cx: new Float32Array(n),
      cy: new Float32Array(n),
      cz: new Float32Array(n),
      restQ: new Float32Array(n * 4),
      seed: new Float32Array(n),
      kind: new Float32Array(n), // 0 = edge strut, 1 = corner block
      nest: new Float32Array(n), // 1.0 .. 1 - NEST_EPS
      delay: new Float32Array(n), // 0 .. DELAY_SPREAD
      perm: new Uint8Array(n),
      tsign: new Int8Array(n),
      taxis: new Uint8Array(n),
      occl: null, // needs the cell centres, so it is filled in below
    }

    for (let p = 0; p < P.n; p++) {
      _pq.set(P.restQ[p * 4], P.restQ[p * 4 + 1], P.restQ[p * 4 + 2], P.restQ[p * 4 + 3])
      for (let k = 0; k < 20; k++) {
        const i = k * P.n + p
        const o = OFFSETS[k]

        // Deployed centre: cell centres sit exactly one child-width out.
        const x = P.cx[p] + o.a * size
        const y = P.cy[p] + o.b * size
        const z = P.cz[p] + o.c * size
        lvl.cx[i] = x
        lvl.cy[i] = y
        lvl.cz[i] = z
        lvl.nest[i] = 1 - NEST_EPS * (k / 19)

        // Continuity: k = 0 is the sibling left visible when collapsed, so it
        // INHERITS the parent's seed AND the parent's kind. Surface detail
        // therefore never pops at an integer depth — the block you were looking
        // at keeps its panels and its shading class. (The root level has no
        // kind array; it counts as a corner block.)
        const s = k === 0 ? P.seed[p] : frac(P.seed[p] * 7.919 + k * 0.13579 + 0.37)
        lvl.seed[i] = s
        const isCorner = o.corner ? 1 : 0
        lvl.kind[i] = k === 0 ? (P.kind ? P.kind[p] : 1) : isCorner

        const pid = Math.min(5, (frac(s * 137.31) * 6) | 0)
        lvl.perm[i] = pid
        lvl.taxis[i] = TWIST_AXIS_OF_PERM[pid]
        lvl.tsign[i] = frac(s * 311.7) < 0.5 ? -1 : 1

        // Rest orientation = parentRest * (quarter turn about the twist axis).
        // Composing quarter turns keeps every cube axis-aligned at rest.
        _tq.setFromAxisAngle(AXES[lvl.taxis[i]], lvl.tsign[i] * HALF_PI)
        _tq.premultiply(_pq)
        lvl.restQ[i * 4] = _tq.x
        lvl.restQ[i * 4 + 1] = _tq.y
        lvl.restQ[i * 4 + 2] = _tq.z
        lvl.restQ[i * 4 + 3] = _tq.w

        // Stagger: edge struts throw out first, corner blocks slam in behind
        // them, all under a global sweep along the (1,1,1) diagonal. This keys
        // off the cell's own geometry, not lvl.kind, so the inherited kind of
        // sibling k = 0 changes how it is SHADED without changing when it fires.
        const sweep = ((x + y + z) * DIAG + DIAG_HALF) / (2 * DIAG_HALF)
        const d01 = 0.55 * isCorner + 0.33 * sweep + 0.12 * frac(s * 53.7)
        lvl.delay[i] = DELAY_SPREAD * d01
      }
    }
    lvl.occl = computeOcclusion(lvl, Math.pow(3, L + 1))
    levels.push(lvl)
  }
  return levels
}

const LEVELS = buildLevels(MAX_DEPTH)

// ---------------------------------------------------------------------------
// Motion curves — all pure functions of the transition phase
// ---------------------------------------------------------------------------

// Charge-up: 0 → 1 over CHARGE_IN, then a hard-cornered release back to 0.
// The kink at the peak is the point: that instant is the "clank", and it is
// exactly when the first piston fires (T0 === CHARGE_IN).
function charge(t) {
  if (t <= 0) return 0
  if (t < CHARGE_IN) {
    const a = t / CHARGE_IN
    return a * a * (3 - 2 * a)
  }
  const b = (t - CHARGE_IN) / CHARGE_OUT
  if (b >= 1) return 0
  const r = 1 - b
  return r * r
}

// Piston travel: fast out, 10% overshoot, then a damped ring that lands on
// exactly 1.0. Visually dead by u ≈ 0.85.
function piston(u) {
  if (u <= 0) return 0
  if (u >= 1) return 1
  if (u < PIST_BREAK) {
    const a = u / PIST_BREAK
    return (1 + PIST_OVER) * (1 - Math.pow(1 - a, 4))
  }
  const b = (u - PIST_BREAK) / (1 - PIST_BREAK)
  return 1 + PIST_OVER * Math.cos(b * Math.PI * 1.5) * Math.exp(-6.2 * b)
}

// Quarter-turn screw: 0 at u = 0, exactly 1 by u ≈ 0.82, so the part is locked
// square before it finishes seating.
function twistCurve(u) {
  const v = clamp((u - 0.08) / 0.74, 0, 1)
  return v < 0.5 ? 8 * v * v * v * v : 1 - Math.pow(-2 * v + 2, 4) / 2
}

// Fracture ramp — has to LEAD the translation, or 20 parent-sized cubes offset
// by one child-width would interpenetrate into mush.
function sizeRamp(u) {
  const v = clamp(u / 0.52, 0, 1)
  return 1 - Math.pow(1 - v, 3)
}

// ...and the settle recoil LAGS it, so the part visibly seats itself with a
// clunk after it has already arrived.
function sizeSettle(u) {
  if (u <= 0.6 || u >= 1) return 1
  const b = (u - 0.6) / 0.4
  const w = 1 - b
  return 1 + 0.075 * Math.sin(b * Math.PI * 2) * w * w
}

// Muzzle flash as a piston fires: 0 at both ends, peak ≈ 0.59 at u ≈ 0.07.
function fireFlash(u) {
  if (u <= 0 || u >= 1) return 0
  return (1 - Math.exp(-26 * u)) * Math.exp(-5 * u)
}

// ---------------------------------------------------------------------------
// depth → (rendered child level, phase)
//
// We always render level L+1. Each child interpolates from "collapsed inside
// its parent" to "deployed in its slot"; at t = 1 that is bit-for-bit the
// level-(L+1) sponge, and at t = 0 of the next leg the 20 grandchildren are
// concentric inside it. The two poses agree exactly, so the cycle is seamless.
// ---------------------------------------------------------------------------
// L is clamped to a leg that actually exists, so an out-of-band depth (a scrub
// handle, a stray key) degrades to the nearest legal pose instead of indexing
// LEVELS out of bounds. t is deliberately NOT clamped below 0: a negative t
// simply reads as "fully collapsed", which every curve here already handles.
export function resolve(depth) {
  const L = clamp(Math.floor(depth), 0, MAX_DEPTH - 1)
  const t = Math.min(depth - L, 1)
  return { L, t, lvl: LEVELS[L + 1], parent: LEVELS[L] }
}

// ---------------------------------------------------------------------------
// The instanced mesh + the per-frame writer
// ---------------------------------------------------------------------------
export function createSponge(material) {
  const geo = new THREE.BoxGeometry(1, 1, 1)
  const mesh = new THREE.InstancedMesh(geo, material, MAX_INSTANCES)
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
  mesh.frustumCulled = false // the instance count changes every level
  mesh.count = 1 // update() owns this from the first frame on

  const aGlow = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES), 1)
  const aSeed = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES), 1)
  const aKind = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES), 1)
  const aOccl = new THREE.InstancedBufferAttribute(new Float32Array(MAX_INSTANCES), 1)
  aGlow.setUsage(THREE.DynamicDrawUsage)
  aOccl.setUsage(THREE.DynamicDrawUsage)
  geo.setAttribute('aGlow', aGlow)
  geo.setAttribute('aSeed', aSeed)
  geo.setAttribute('aKind', aKind)
  geo.setAttribute('aOccl', aOccl)

  // Hoisted scratch — the update loop must not allocate.
  const _m = new THREE.Matrix4()
  const _pq = new THREE.Quaternion()
  const _tq = new THREE.Quaternion()
  const _p = new THREE.Vector3()
  const _s = new THREE.Vector3()
  const MAT = mesh.instanceMatrix.array
  const GLOW = aGlow.array
  const OCCL = aOccl.array

  let curLevel = -1
  let lastDepth = NaN

  function update(depth, elapsed) {
    const { t, L, lvl, parent } = resolve(depth)
    const levelKey = L + 1
    const levelChanged = levelKey !== curLevel
    if (levelChanged) {
      // aSeed / aKind are static per level — only re-upload when it changes.
      curLevel = levelKey
      aSeed.array.set(lvl.seed, 0)
      aSeed.needsUpdate = true
      aKind.array.set(lvl.kind, 0)
      aKind.needsUpdate = true
    }

    // While depth is parked at an integer nothing moves, so we re-upload 8000
    // floats of glow instead of 128 000 floats of matrix.
    const geomDirty = levelChanged || depth !== lastDepth
    lastDepth = depth

    const ch = charge(t)
    const pn = parent.n
    // Collapsed: every child's piston window starts at T0, so for the whole
    // charge-up the 20 siblings are still concentric inside their parent and
    // only the outermost one can be seen. Thanks to the sibling-major layout
    // those are exactly instances [0, pn) — drawing the other 19/20ths would be
    // pure overdraw of a very expensive fragment shader (8000 draws for 400
    // visible cubes on the 2→3 leg) and would put 19 near-coplanar shells into
    // the depth test for no reason.
    mesh.count = t <= T0 ? pn : lvl.n
    const parentSz = parent.size
    const collBase = parentSz * GAP * (1 - COMPRESS_AMT * ch)
    const deploySz = lvl.size * GAP
    const pull = 1 - PULL_AMT * ch
    const shudAmp = SHUDDER_AMT * parentSz * ch
    const shudPhase = t * TAU * SHUDDER_FREQ
    // Only walk the instances that will actually be drawn. The moment the dwell
    // breaks, depth changes, geomDirty goes true and the full set is rewritten
    // before any of it is visible.
    const n = mesh.count

    for (let i = 0; i < n; i++) {
      const p = i % pn
      const sd = lvl.seed[i]
      const u = clamp((t - T0 - lvl.delay[i]) / DEPLOY_DUR, 0, 1)

      // Whole blocks charge green while they compress; each cube then flares
      // white-hot at the instant its own piston fires.
      GLOW[i] =
        GLOW_IDLE +
        (1 - GLOW_IDLE) *
          Math.max(0.62 * Math.pow(ch, 1.1), Math.min(1, 1.7 * fireFlash(u))) +
        0.05 * Math.sin(elapsed * 4 + sd * 40)

      // Occlusion follows the fracture: a collapsed child is still wearing its
      // parent's exposure, and only earns its own as it separates out.
      const po = parent.occl[p]
      const ramp = sizeRamp(u)
      OCCL[i] = po + (lvl.occl[i] - po) * ramp

      if (!geomDirty) continue

      // Collapsed anchor: the parent's centre, pulled inward and rattling. The
      // rattle phase comes from the PARENT's seed, so all 20 nested siblings
      // shake as one rigid block rather than drifting apart by more than the
      // NEST_EPS shells that separate them.
      const sp = parent.seed[p] * TAU
      const ax = parent.cx[p] * pull + shudAmp * Math.sin(shudPhase + sp)
      const ay = parent.cy[p] * pull + shudAmp * Math.sin(shudPhase + sp + 2.0944)
      const az = parent.cz[p] * pull + shudAmp * Math.sin(shudPhase + sp + 4.1888)

      // Axis-by-axis travel: each cube moves in X, Y and Z on its own
      // sub-window, tracing an L-shaped pick-and-place path rather than a lerp.
      const slot = PERMS[lvl.perm[i]]
      const US0 = piston(clamp(u / AXIS_WIN, 0, 1))
      const US1 = piston(clamp((u - AXIS_STAGGER) / AXIS_WIN, 0, 1))
      const US2 = piston(clamp((u - 2 * AXIS_STAGGER) / AXIS_WIN, 0, 1))
      const USx = slot[0] === 0 ? US0 : slot[0] === 1 ? US1 : US2
      const USy = slot[1] === 0 ? US0 : slot[1] === 1 ? US1 : US2
      const USz = slot[2] === 0 ? US0 : slot[2] === 1 ? US1 : US2

      _p.set(
        ax + (lvl.cx[i] - ax) * USx,
        ay + (lvl.cy[i] - ay) * USy,
        az + (lvl.cz[i] - az) * USz,
      )

      const collSz = collBase * lvl.nest[i]
      const sz = (collSz + (deploySz - collSz) * ramp) * sizeSettle(u)
      _s.set(sz, sz, sz)

      const q4 = p * 4
      _pq.set(parent.restQ[q4], parent.restQ[q4 + 1], parent.restQ[q4 + 2], parent.restQ[q4 + 3])
      _tq.setFromAxisAngle(AXES[lvl.taxis[i]], lvl.tsign[i] * HALF_PI * twistCurve(u))
      _pq.multiply(_tq)

      // compose + toArray writes straight into the instance buffer, skipping
      // the Object3D round-trip setMatrixAt would cost at 8000 instances.
      _m.compose(_p, _pq, _s)
      _m.toArray(MAT, i * 16)
    }

    aGlow.needsUpdate = true
    aOccl.needsUpdate = true
    if (geomDirty) mesh.instanceMatrix.needsUpdate = true
  }

  return { mesh, update }
}
