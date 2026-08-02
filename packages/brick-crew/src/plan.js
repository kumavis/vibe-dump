// ---------------------------------------------------------------------------
// The build plan: every brick, lintel, rafter and tile the crew has to set,
// in the order a real gang would set them, each one carrying the information
// the sim needs to send a robot to it.
//
// Nothing here knows about three.js. A plan item is plain data:
//
//   { kind, phase, group, course, pos, euler, size, color, family, slot,
//     deps, stand, mortar }
//
//   pos/size/euler  place a box in the world (euler order 'YXZ', z always 0)
//   family          which InstancedMesh draws it: masonry | timber | tile
//   deps            indices of items that must be set first (what holds it up)
//   stand           where a mason plants its feet to set it, and on what
//   mortar          index into plan.mortar of the joint slab this brick completes
// ---------------------------------------------------------------------------

import {
  BRICK, MORTAR, PITCH, COURSE, HOUSE, EAVE_Y, RIDGE_RISE, RIDGE_Y, ROOF_RUN,
  ROOF_PITCH, WALL_X, WALL_Z, CHIMNEY, DECKS, REACH, DROP, SCAFFOLD,
  LAY_STANDOFF, COLORS,
} from './config.js'

const TAN = RIDGE_RISE / ROOF_RUN
const COS_P = Math.cos(ROOF_PITCH)
/** Slope length from the ridge down to the drip edge. */
const SLOPE_LEN = (ROOF_RUN + HOUSE.eaveOverhang) / COS_P

/** Height of the roof plane (top of the rafters) at a given |z|. */
export function roofTopY(zAbs) {
  return EAVE_Y + 0.12 + (ROOF_RUN - zAbs) * TAN
}
/** |z| of a point `sd` metres up the slope from the drip edge. */
export function slopeZ(sd) {
  return ROOF_RUN + HOUSE.eaveOverhang - sd * COS_P
}
export { SLOPE_LEN }

export const PHASES = [
  { key: 'walls', label: 'WALLS' },
  { key: 'gables', label: 'GABLES' },
  { key: 'chimney', label: 'CHIMNEY' },
  { key: 'roof', label: 'ROOF FRAME' },
  { key: 'tiles', label: 'ROOF TILES' },
]

// The four walls, as a run direction plus the outward normal masons work from.
const WALLS = [
  { id: 'S', axis: 'x', line: WALL_Z, nx: 0, nz: 1 },
  { id: 'E', axis: 'z', line: WALL_X, nx: 1, nz: 0 },
  { id: 'N', axis: 'x', line: -WALL_Z, nx: 0, nz: -1 },
  { id: 'W', axis: 'z', line: -WALL_X, nx: -1, nz: 0 },
]

const HOUSE_TITLES = [
  'PLOT 4 — GABLE COTTAGE',
  'PLOT 5 — THE LITTLE STACK',
  'PLOT 6 — BRICKWORKS LODGE',
  'PLOT 7 — MORTAR END',
  'PLOT 8 — HEARTHSTONE',
]

/**
 * Chop a run of wall into bricks. Whole bricks where they fit; the pitch is
 * stretched a percent or two so the run ends flush at the corner instead of
 * leaving a sliver.
 */
function runBricks(a, b) {
  const L = b - a
  const n = Math.max(1, Math.round(L / PITCH))
  const p = L / n
  const out = []
  for (let k = 0; k < n; k++) out.push({ c: a + (k + 0.5) * p, len: p - MORTAR })
  return out
}

/**
 * A run laid on a fixed pitch starting part-way through a brick, so that
 * alternate courses stagger and the end bricks come out as closers. Used for
 * the chimney, where the run is too short for runBricks to stagger anything.
 */
function bondedRun(a, b, offset) {
  const out = []
  for (let u = a - offset; u < b - 1e-6; u += PITCH) {
    const s = Math.max(u, a)
    const e = Math.min(u + PITCH - MORTAR, b)
    if (e - s > 0.08) out.push({ c: (s + e) / 2, len: e - s })
  }
  return out
}

/**
 * Trim a brick against the openings crossing its course. Returns null when
 * there is nothing worth laying left, otherwise the surviving piece — which is
 * what gives the reveals of a door or window their clean vertical jamb.
 */
function clipToSpans(brick, spans) {
  let a = brick.c - brick.len / 2
  let b = brick.c + brick.len / 2
  for (const s of spans) {
    if (b <= s.u0 || a >= s.u1) continue
    const left = s.u0 - a
    const right = b - s.u1
    if (left <= 0.09 && right <= 0.09) return null
    if (left >= right) b = s.u0
    else a = s.u1
  }
  if (b - a < 0.09) return null
  return { c: (a + b) / 2, len: b - a }
}

/**
 * Which scaffold deck a mason works this brick from: the lowest one it can
 * reach up to, skipping any deck it would be towering over.
 */
function pickDeck(baseY, topY) {
  for (let d = 0; d < DECKS.length; d++) {
    const dy = DECKS[d].y
    if (dy < baseY - DROP) continue
    if (topY <= dy + REACH) return d
  }
  return DECKS.length - 1
}

/** Feet on the ground or on a deck, standing off the face by the right amount. */
function standAt(cx, cz, nx, nz, baseY, topY) {
  const deck = pickDeck(baseY, topY)
  if (deck === 0) {
    return { level: 0, x: cx + nx * LAY_STANDOFF, y: 0, z: cz + nz * LAY_STANDOFF }
  }
  // On a deck the mason walks the scaffold ring, so the ring line *is* the
  // standing line — project the brick out onto whichever leg faces it.
  const x = nx !== 0 ? nx * SCAFFOLD.rx : cx
  const z = nz !== 0 ? nz * SCAFFOLD.rz : cz
  return { level: deck, x, y: DECKS[deck].y, z }
}

/** Feet on the roof slope, `sd` metres up from the drip edge, facing up-slope. */
function standOnRoof(x, side, sd) {
  const zAbs = slopeZ(sd)
  return {
    level: 'roof',
    side,
    sd,
    x,
    y: roofTopY(zAbs),
    z: side * zAbs,
    tilt: ROOF_PITCH * 0.6,
  }
}

/**
 * Build the whole plan for one house. `variant` only ever changes dressing —
 * brick colour, tile colour, which openings go where — so the scaffold and the
 * navigation graph stay valid across rebuilds.
 */
export function buildPlan(rng, day = 1) {
  const items = []
  const mortar = []
  /** Bricks still outstanding on each mortar slab, keyed by group:course. */
  const mortarBy = new Map()

  const brickHue = COLORS.brick.map((c) => c)
  const tileSet = COLORS.tile
  const familyCount = { masonry: 0, timber: 0, tile: 0 }

  const push = (it) => {
    it.i = items.length
    it.slot = familyCount[it.family]++
    items.push(it)
    return it.i
  }

  const brickColor = () => brickHue[(rng() * brickHue.length) | 0]
  const tileColor = () => tileSet[(rng() * tileSet.length) | 0]

  /** Register a brick against the mortar slab for its group + course. */
  function joinMortar(key, make) {
    let idx = mortarBy.get(key)
    if (idx === undefined) {
      idx = mortar.length
      mortar.push({ ...make(), needs: 0, key })
      mortarBy.set(key, idx)
    }
    mortar[idx].needs++
    return idx
  }

  /**
   * Split a course into contiguous runs of brick. The mortar core behind a
   * course has to stop at a door or window, or you can see it filling the hole.
   */
  function runsOf(bricks) {
    const runs = []
    for (const b of bricks) {
      const a0 = b.c - b.len / 2
      const a1 = b.c + b.len / 2
      const last = runs[runs.length - 1]
      if (last && a0 - last.u1 < 0.07) last.u1 = a1
      else runs.push({ u0: a0, u1: a1 })
    }
    return runs
  }
  const runIndexFor = (runs, b) => runs.findIndex((r) => b.c >= r.u0 - 1e-6 && b.c <= r.u1 + 1e-6)

  // --- openings ------------------------------------------------------------
  // A door and a scatter of windows. Positions jitter a little per build so
  // successive houses aren't identical, but they stay clear of the corners.
  const doorLeft = rng() < 0.5
  const doorU = doorLeft ? -1.08 : 1.08
  const openings = [
    { wall: 'S', kind: 'door', u0: doorU - 0.53, u1: doorU + 0.53, c0: 0, c1: 10 },
    { wall: 'S', kind: 'window', u0: -doorU - 0.55, u1: -doorU + 0.55, c0: 4, c1: 9 },
    { wall: 'N', kind: 'window', u0: -1.72, u1: -0.62, c0: 4, c1: 9 },
    { wall: 'N', kind: 'window', u0: 0.62, u1: 1.72, c0: 4, c1: 9 },
    { wall: 'W', kind: 'window', u0: -0.55, u1: 0.55, c0: 4, c1: 9 },
  ]
  // The east wall carries the chimney, so its window shifts clear of the stack.
  openings.push({ wall: 'E', kind: 'window', u0: 0.35, u1: 1.45, c0: 4, c1: 9 })

  const openingsFor = (id) => openings.filter((o) => o.wall === id)

  // --- walls ---------------------------------------------------------------
  // Course by course, all four walls together — which is both how it is really
  // done and what keeps five masons spread around the building.
  for (let c = 0; c < HOUSE.wallCourses; c++) {
    const flip = c & 1
    const y = c * COURSE + BRICK.H / 2
    const baseY = c * COURSE
    const topY = baseY + BRICK.H

    // Interleave the walls so consecutive plan indices land on different faces.
    const perWall = WALLS.map((w) => {
      const isLong = w.axis === 'x'
      const useFull = flip === 0 ? isLong : !isLong
      const half = (isLong ? HOUSE.w / 2 : HOUSE.d / 2) - (useFull ? 0 : HOUSE.t)
      const ops = openingsFor(w.id)
      // Spans to cut out of this course: the openings themselves, plus the
      // lintel bearing on the course directly above each one.
      const spans = []
      for (const o of ops) {
        if (c >= o.c0 && c <= o.c1) spans.push({ u0: o.u0, u1: o.u1 })
        else if (c === o.c1 + 1) spans.push({ u0: o.u0 - 0.12, u1: o.u1 + 0.12 })
      }
      const bricks = runBricks(-half, half)
        .map((b) => clipToSpans(b, spans))
        .filter(Boolean)
      const runs = runsOf(bricks)
      return bricks.map((b) => ({ w, b, runs, run: runIndexFor(runs, b) }))
    })

    const maxLen = Math.max(...perWall.map((a) => a.length))
    for (let k = 0; k < maxLen; k++) {
      for (const list of perWall) {
        const entry = list[k]
        if (!entry) continue
        const { w, b, runs, run } = entry
        const alongX = w.axis === 'x'
        const cx = alongX ? b.c : w.line
        const cz = alongX ? w.line : b.c
        const seg = runs[run] ?? { u0: b.c - b.len / 2, u1: b.c + b.len / 2 }
        const segMid = (seg.u0 + seg.u1) / 2
        const segLen = seg.u1 - seg.u0
        push({
          kind: 'brick',
          phase: 'walls',
          group: w.id,
          course: c,
          pos: [cx, y, cz],
          euler: [0, alongX ? 0 : Math.PI / 2, 0],
          size: [b.len, BRICK.H, HOUSE.t],
          color: brickColor(),
          family: 'masonry',
          deps: [],
          span: [b.c - b.len / 2, b.c + b.len / 2],
          stand: standAt(cx, cz, w.nx, w.nz, baseY, topY),
          mortar: joinMortar(`${w.id}:${c}:${run}`, () => ({
            pos: [
              alongX ? segMid : w.line,
              baseY + COURSE / 2,
              alongX ? w.line : segMid,
            ],
            size: alongX
              ? [segLen - 0.02, COURSE, HOUSE.t - 0.035]
              : [HOUSE.t - 0.035, COURSE, segLen - 0.02],
          })),
        })
      }
    }

    // Sills go on the course under a window, lintels on the course above the
    // opening — both are pre-cast, so they arrive as one piece.
    for (const o of openings) {
      const w = WALLS.find((x) => x.id === o.wall)
      const alongX = w.axis === 'x'
      const mid = (o.u0 + o.u1) / 2
      if (o.kind === 'window' && c === o.c0 - 1) {
        const span = o.u1 - o.u0 + 0.22
        push({
          kind: 'sill',
          phase: 'walls',
          group: w.id,
          course: c,
          pos: [alongX ? mid : w.line + w.nx * 0.03, baseY + COURSE + 0.03, alongX ? w.line + w.nz * 0.03 : mid],
          euler: [0, alongX ? 0 : Math.PI / 2, 0],
          size: [span, 0.07, HOUSE.t + 0.12],
          color: COLORS.lintel,
          family: 'masonry',
          deps: [],
          stand: standAt(alongX ? mid : w.line, alongX ? w.line : mid, w.nx, w.nz, baseY, baseY + 0.1),
          mortar: -1,
        })
      }
      if (c === o.c1 + 1) {
        const span = o.u1 - o.u0 + 0.3
        push({
          kind: 'lintel',
          phase: 'walls',
          group: w.id,
          course: c,
          pos: [alongX ? mid : w.line, y, alongX ? w.line : mid],
          euler: [0, alongX ? 0 : Math.PI / 2, 0],
          size: [span, BRICK.H, HOUSE.t + 0.02],
          color: COLORS.lintel,
          family: 'masonry',
          deps: [],
          stand: standAt(alongX ? mid : w.line, alongX ? w.line : mid, w.nx, w.nz, baseY, topY),
          mortar: -1,
        })
      }
    }
  }

  // --- gables --------------------------------------------------------------
  // The two short walls carry on up into triangles under the roof line.
  for (let g = 0; g < HOUSE.gableCourses; g++) {
    const baseY = EAVE_Y + g * COURSE
    const y = baseY + BRICK.H / 2
    const topY = baseY + BRICK.H
    const half = ROOF_RUN - ((g + 0.5) * COURSE) / TAN
    if (half < 0.14) continue
    for (const w of WALLS.filter((x) => x.axis === 'z')) {
      for (const b of runBricks(-half, half)) {
        push({
          kind: 'brick',
          phase: 'gables',
          group: `gable${w.id}`,
          course: g,
          pos: [w.line, y, b.c],
          euler: [0, Math.PI / 2, 0],
          size: [b.len, BRICK.H, HOUSE.t],
          color: brickColor(),
          family: 'masonry',
          deps: [],
          span: [b.c - b.len / 2, b.c + b.len / 2],
          stand: standAt(w.line, b.c, w.nx, w.nz, baseY, topY),
          mortar: joinMortar(`gable${w.id}:${g}`, () => ({
            pos: [w.line, baseY + COURSE / 2, 0],
            size: [HOUSE.t - 0.035, COURSE, half * 2 - 0.02],
          })),
        })
      }
    }
  }

  // --- chimney -------------------------------------------------------------
  // Two leaves thick, laid in a proper stretcher bond against the west gable.
  const chimRows = [CHIMNEY.x]
  const chimA = CHIMNEY.z - CHIMNEY.runLen / 2
  const chimB = CHIMNEY.z + CHIMNEY.runLen / 2
  for (let c = 0; c < CHIMNEY.courses; c++) {
    const baseY = c * COURSE
    const y = baseY + BRICK.H / 2
    const topY = baseY + BRICK.H
    for (let r = 0; r < chimRows.length; r++) {
      const offset = ((c + r) & 1) === 0 ? 0 : PITCH / 2
      for (const b of bondedRun(chimA, chimB, offset)) {
        push({
          kind: 'brick',
          phase: 'chimney',
          group: 'chim',
          course: c,
          pos: [chimRows[r], y, b.c],
          euler: [0, Math.PI / 2, 0],
          size: [b.len, BRICK.H, BRICK.D],
          color: brickColor(),
          family: 'masonry',
          deps: [],
          span: [b.c - b.len / 2, b.c + b.len / 2],
          stand: standAt(CHIMNEY.x, b.c, CHIMNEY.side, 0, baseY, topY),
          mortar: joinMortar(`chim:${c}`, () => ({
            pos: [CHIMNEY.x, baseY + COURSE / 2, CHIMNEY.z],
            size: [CHIMNEY.depth - 0.035, COURSE, CHIMNEY.runLen - 0.02],
          })),
        })
      }
    }
  }
  // Corbelled cap: two oversailing slabs and a pot.
  for (let k = 0; k < 2; k++) {
    const baseY = (CHIMNEY.courses + k) * COURSE
    push({
      kind: 'lintel',
      phase: 'chimney',
      group: 'chim',
      course: CHIMNEY.courses + k,
      pos: [CHIMNEY.x, baseY + COURSE / 2, CHIMNEY.z],
      euler: [0, 0, 0],
      size: [CHIMNEY.depth + 0.16 - k * 0.06, COURSE, CHIMNEY.runLen + 0.16 - k * 0.06],
      color: COLORS.lintel,
      family: 'masonry',
      deps: [],
      stand: standAt(CHIMNEY.x, CHIMNEY.z, CHIMNEY.side, 0, baseY, baseY + COURSE),
      mortar: -1,
    })
  }

  // --- roof frame ----------------------------------------------------------
  // Wall plates first, then rafter couples leaning against each other, and the
  // ridge board threaded in last — which is why the ridge depends on them all.
  const plateIdx = {}
  for (const s of [1, -1]) {
    plateIdx[s] = push({
      kind: 'plate',
      phase: 'roof',
      group: 'roof',
      course: 0,
      pos: [0, EAVE_Y + 0.06, s * WALL_Z],
      euler: [0, 0, 0],
      size: [HOUSE.w, 0.12, HOUSE.t],
      color: COLORS.timber,
      family: 'timber',
      deps: [],
      stand: { level: 1, x: 0, y: DECKS[1].y, z: s * SCAFFOLD.rz },
      mortar: -1,
    })
  }

  const N_RAFTERS = 9
  const rafterIdx = []
  const rafterLen = SLOPE_LEN
  for (let i = 0; i < N_RAFTERS; i++) {
    const x = -HOUSE.w / 2 + 0.2 + (i * (HOUSE.w - 0.4)) / (N_RAFTERS - 1)
    for (const s of [1, -1]) {
      const zc = (s * (ROOF_RUN + HOUSE.eaveOverhang)) / 2
      const yc = roofTopY(Math.abs(zc)) - 0.07
      rafterIdx.push(
        push({
          kind: 'rafter',
          phase: 'roof',
          group: 'roof',
          course: 1,
          pos: [x, yc, zc],
          euler: [ROOF_PITCH, s > 0 ? 0 : Math.PI, 0],
          size: [0.09, 0.14, rafterLen],
          color: COLORS.timber,
          family: 'timber',
          deps: [plateIdx[s]],
          stand: { level: 2, x, y: DECKS[2].y, z: s * SCAFFOLD.rz },
          mortar: -1,
        }),
      )
    }
  }

  for (let k = 0; k < 3; k++) {
    const segW = HOUSE.w / 3
    const x = -HOUSE.w / 2 + segW * (k + 0.5)
    push({
      kind: 'ridge',
      phase: 'roof',
      group: 'roof',
      course: 2,
      pos: [x, roofTopY(0) - 0.1, 0],
      euler: [0, 0, 0],
      size: [segW, 0.2, 0.14],
      color: COLORS.timber,
      family: 'timber',
      deps: rafterIdx.slice(),
      stand: standOnRoof(x, 1, SLOPE_LEN - 0.72),
      mortar: -1,
    })
  }

  // --- tiles ---------------------------------------------------------------
  // Laid from the eave up so each course laps the one below. The bottom two
  // courses are set from the top scaffold deck; above that the crew is on the
  // roof itself.
  const N_COURSE = 5
  const N_COL = 8
  const sp = SLOPE_LEN / N_COURSE
  const spanX = HOUSE.w + 0.2
  const cw = spanX / N_COL
  const tileIdx = {}
  for (const s of [1, -1]) {
    for (let k = 0; k < N_COURSE; k++) {
      const sd = (k + 0.5) * sp
      const zAbs = slopeZ(sd)
      const y = roofTopY(zAbs) + 0.03 + k * 0.004
      for (let col = 0; col < N_COL; col++) {
        const x = -spanX / 2 + cw * (col + 0.5)
        const standSd = sd - 0.62
        const stand =
          standSd < 0.5
            ? { level: 2, x, y: DECKS[2].y, z: s * SCAFFOLD.rz }
            : standOnRoof(x, s, standSd)
        tileIdx[`${s}:${k}:${col}`] = push({
          kind: 'tile',
          phase: 'tiles',
          group: `tile${s}`,
          course: k,
          pos: [x, y, s * zAbs],
          euler: [ROOF_PITCH, s > 0 ? 0 : Math.PI, 0],
          size: [cw - 0.012, 0.05, sp + 0.1],
          color: tileColor(),
          family: 'tile',
          deps: k > 0 ? [tileIdx[`${s}:${k - 1}:${col}`]] : [],
          stand,
          mortar: -1,
        })
      }
    }
  }
  // Ridge caps close the two slopes off at the top.
  for (let col = 0; col < N_COL; col++) {
    const x = -spanX / 2 + cw * (col + 0.5)
    push({
      kind: 'cap',
      phase: 'tiles',
      group: 'caps',
      course: 0,
      pos: [x, roofTopY(0) + 0.09, 0],
      euler: [0, 0, 0],
      size: [cw - 0.012, 0.12, 0.36],
      color: tileColor(),
      family: 'tile',
      deps: [tileIdx[`1:${N_COURSE - 1}:${col}`], tileIdx[`-1:${N_COURSE - 1}:${col}`]],
      stand: standOnRoof(x, 1, SLOPE_LEN - 0.6),
      mortar: -1,
    })
  }

  // --- support between courses --------------------------------------------
  // A brick can only go on once whatever it sits on is there. Matching by
  // overlapping span within the same wall keeps five masons from waiting on
  // each other any more than they have to.
  const byGroupCourse = new Map()
  for (const it of items) {
    if (!it.span) continue
    const key = `${it.group}:${it.course}`
    if (!byGroupCourse.has(key)) byGroupCourse.set(key, [])
    byGroupCourse.get(key).push(it)
  }
  for (const it of items) {
    if (!it.span || it.course === 0) continue
    const below = byGroupCourse.get(`${it.group}:${it.course - 1}`)
    if (!below) continue
    for (const b of below) {
      const o = Math.min(it.span[1], b.span[1]) - Math.max(it.span[0], b.span[0])
      if (o > 0.05) it.deps.push(b.i)
    }
  }

  const phases = PHASES.map((p) => ({
    ...p,
    total: items.filter((it) => it.phase === p.key).length,
  })).filter((p) => p.total > 0)

  return {
    items,
    phases,
    mortar,
    openings,
    familyCount,
    title: HOUSE_TITLES[(day - 1) % HOUSE_TITLES.length],
    day,
  }
}
