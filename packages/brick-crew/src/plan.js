// ---------------------------------------------------------------------------
// The build plan: every brick, lintel, rafter and tile the crew has to set,
// in the order a real gang would set them, each one carrying the information
// the sim needs to send a robot to it.
//
// Everything here is in PLOT-LOCAL coordinates — the house sits on the origin.
// The renderer parents the whole plot to its position on the street, so the
// same plan works wherever the crew happens to be building.
//
//   pos/size/euler  place a box (euler order 'YXZ', z always 0)
//   family          which InstancedMesh draws it: masonry | timber | tile
//   mat             which stock a mason has to fetch it from
//   deps            indices of items that must be set first (what holds it up)
//   stand           where a mason plants its feet, and on what
// ---------------------------------------------------------------------------

import {
  BRICK, MORTAR, PITCH, COURSE, REACH, DROP, LAY_STANDOFF, COLORS,
  MATERIAL_OF, roofTopY, slopeZ,
} from './config.js'

export const PHASES = [
  { key: 'walls', label: 'WALLS' },
  { key: 'gables', label: 'GABLES' },
  { key: 'chimney', label: 'CHIMNEY' },
  { key: 'roof', label: 'ROOF FRAME' },
  { key: 'tiles', label: 'ROOF TILES' },
  { key: 'secondfix', label: 'SECOND FIX' },
]

/**
 * Chop a run of wall into bricks. Whole bricks where they fit; the pitch is
 * stretched a percent or two so the run ends flush at the corner.
 */
function runBricks(a, b) {
  const L = b - a
  const n = Math.max(1, Math.round(L / PITCH))
  const p = L / n
  const out = []
  for (let k = 0; k < n; k++) out.push({ c: a + (k + 0.5) * p, len: p - MORTAR })
  return out
}

/** A run laid on a fixed pitch starting part-way through a brick, so alternate
 *  courses stagger and the end bricks come out as closers. */
function bondedRun(a, b, offset) {
  const out = []
  for (let u = a - offset; u < b - 1e-6; u += PITCH) {
    const s = Math.max(u, a)
    const e = Math.min(u + PITCH - MORTAR, b)
    if (e - s > 0.08) out.push({ c: (s + e) / 2, len: e - s })
  }
  return out
}

/** Trim a brick against the openings crossing its course, which is what gives
 *  a door or window its clean vertical jamb. */
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

/** Split a course into contiguous runs — the mortar core has to stop at a
 *  door or window, or you can see it filling the hole. */
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

/**
 * Build the whole plan for one house on one plot.
 * `geom` comes from houseGeom(); `paint` is the colour the decorators bring.
 */
export function buildPlan(rng, { geom, day = 1, plotIndex = 0, paint }) {
  const items = []
  const mortar = []
  const mortarBy = new Map()
  const familyCount = { masonry: 0, timber: 0, tile: 0, glass: 0, frame: 0 }

  const H = geom
  const WALLS = [
    { id: 'S', axis: 'x', line: H.wallZ, nx: 0, nz: 1 },
    { id: 'E', axis: 'z', line: H.wallX, nx: 1, nz: 0 },
    { id: 'N', axis: 'x', line: -H.wallZ, nx: 0, nz: -1 },
    { id: 'W', axis: 'z', line: -H.wallX, nx: -1, nz: 0 },
  ]

  const push = (it) => {
    it.i = items.length
    it.slot = familyCount[it.family]++
    it.mat = MATERIAL_OF[it.kind] || 'brick'
    items.push(it)
    return it.i
  }
  const brickColor = () => COLORS.brick[(rng() * COLORS.brick.length) | 0]
  const tileColor = () => COLORS.tile[(rng() * COLORS.tile.length) | 0]

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

  /** Which scaffold lift a mason works this brick from: the lowest it can
   *  reach up to, skipping any it would be towering over. */
  function pickDeck(baseY, topY) {
    for (let d = 0; d < H.decks.length; d++) {
      const dy = H.decks[d].y
      if (dy < baseY - DROP) continue
      if (topY <= dy + REACH) return d
    }
    return H.decks.length - 1
  }

  function standAt(cx, cz, nx, nz, baseY, topY) {
    const deck = pickDeck(baseY, topY)
    if (deck === 0) {
      return { level: 0, x: cx + nx * LAY_STANDOFF, y: 0, z: cz + nz * LAY_STANDOFF }
    }
    return {
      level: deck,
      x: nx !== 0 ? nx * H.scaffold.rx : cx,
      y: H.decks[deck].y,
      z: nz !== 0 ? nz * H.scaffold.rz : cz,
    }
  }

  function standOnRoof(x, side, sd) {
    const zAbs = slopeZ(H, sd)
    return { level: 'roof', side, sd, x, y: roofTopY(H, zAbs), z: side * zAbs, tilt: H.roofPitch * 0.6 }
  }

  // --- openings ------------------------------------------------------------
  const halfW = H.w / 2
  const doorW = 1.06
  const doorLeft = rng() < 0.5
  const doorU = (doorLeft ? -1 : 1) * Math.min(1.15, halfW - doorW / 2 - 0.5)
  const winU = -doorU
  const doorTop = Math.min(H.wallCourses - 3, 10)
  const winC0 = 4
  const winC1 = Math.min(H.wallCourses - 4, 9)
  const openings = [
    { wall: 'S', kind: 'door', u0: doorU - doorW / 2, u1: doorU + doorW / 2, c0: 0, c1: doorTop },
    { wall: 'S', kind: 'window', u0: winU - 0.55, u1: winU + 0.55, c0: winC0, c1: winC1 },
    { wall: 'N', kind: 'window', u0: -halfW + 0.72, u1: -halfW + 1.82, c0: winC0, c1: winC1 },
    { wall: 'N', kind: 'window', u0: halfW - 1.82, u1: halfW - 0.72, c0: winC0, c1: winC1 },
    { wall: 'W', kind: 'window', u0: -0.55, u1: 0.55, c0: winC0, c1: winC1 },
    // the east wall carries the chimney, so its window shifts clear of the stack
    { wall: 'E', kind: 'window', u0: 0.35, u1: 1.45, c0: winC0, c1: winC1 },
  ].filter((o) => o.c1 > o.c0)
  const openingsFor = (id) => openings.filter((o) => o.wall === id)

  /** Where the front door is, in world terms — the way in for the furniture. */
  const door = openings[0]
  const doorway = { x: (door.u0 + door.u1) / 2, z: H.d / 2 }

  // --- walls ---------------------------------------------------------------
  for (let c = 0; c < H.wallCourses; c++) {
    const flip = c & 1
    const y = c * COURSE + BRICK.H / 2
    const baseY = c * COURSE
    const topY = baseY + BRICK.H

    const perWall = WALLS.map((w) => {
      const isLong = w.axis === 'x'
      const useFull = flip === 0 ? isLong : !isLong
      const half = (isLong ? H.w / 2 : H.d / 2) - (useFull ? 0 : H.t)
      const ops = openingsFor(w.id)
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
          size: [b.len, BRICK.H, H.t],
          color: brickColor(),
          family: 'masonry',
          paintable: true,
          deps: [],
          span: [b.c - b.len / 2, b.c + b.len / 2],
          stand: standAt(cx, cz, w.nx, w.nz, baseY, topY),
          mortar: joinMortar(`${w.id}:${c}:${run}`, () => ({
            pos: [alongX ? segMid : w.line, baseY + COURSE / 2, alongX ? w.line : segMid],
            size: alongX ? [segLen - 0.02, COURSE, H.t - 0.035] : [H.t - 0.035, COURSE, segLen - 0.02],
          })),
        })
      }
    }

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
          size: [span, 0.07, H.t + 0.12],
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
          size: [span, BRICK.H, H.t + 0.02],
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
  for (let g = 0; g < H.gableCourses; g++) {
    const baseY = H.eaveY + g * COURSE
    const y = baseY + BRICK.H / 2
    const topY = baseY + BRICK.H
    const half = H.roofRun - ((g + 0.5) * COURSE) / H.tanPitch
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
          size: [b.len, BRICK.H, H.t],
          color: brickColor(),
          family: 'masonry',
          paintable: true,
          deps: [],
          span: [b.c - b.len / 2, b.c + b.len / 2],
          stand: standAt(w.line, b.c, w.nx, w.nz, baseY, topY),
          mortar: joinMortar(`gable${w.id}:${g}`, () => ({
            pos: [w.line, baseY + COURSE / 2, 0],
            size: [H.t - 0.035, COURSE, half * 2 - 0.02],
          })),
        })
      }
    }
  }

  // --- chimney -------------------------------------------------------------
  const CH = H.chimney
  const chimA = CH.z - CH.runLen / 2
  const chimB = CH.z + CH.runLen / 2
  for (let c = 0; c < CH.courses; c++) {
    const baseY = c * COURSE
    const y = baseY + BRICK.H / 2
    const topY = baseY + BRICK.H
    for (const b of bondedRun(chimA, chimB, (c & 1) === 0 ? 0 : PITCH / 2)) {
      push({
        kind: 'brick',
        phase: 'chimney',
        group: 'chim',
        course: c,
        pos: [CH.x, y, b.c],
        euler: [0, Math.PI / 2, 0],
        size: [b.len, BRICK.H, CH.depth],
        color: brickColor(),
        family: 'masonry',
        paintable: true,
        deps: [],
        span: [b.c - b.len / 2, b.c + b.len / 2],
        stand: standAt(CH.x, b.c, CH.side, 0, baseY, topY),
        mortar: joinMortar(`chim:${c}`, () => ({
          pos: [CH.x, baseY + COURSE / 2, CH.z],
          size: [CH.depth - 0.035, COURSE, CH.runLen - 0.02],
        })),
      })
    }
  }
  for (let k = 0; k < 2; k++) {
    const baseY = (CH.courses + k) * COURSE
    push({
      kind: 'lintel',
      phase: 'chimney',
      group: 'chim',
      course: CH.courses + k,
      pos: [CH.x, baseY + COURSE / 2, CH.z],
      euler: [0, 0, 0],
      size: [CH.depth + 0.16 - k * 0.06, COURSE, CH.runLen + 0.16 - k * 0.06],
      color: COLORS.lintel,
      family: 'masonry',
      deps: [],
      stand: standAt(CH.x, CH.z, CH.side, 0, baseY, baseY + COURSE),
      mortar: -1,
    })
  }

  // --- roof frame ----------------------------------------------------------
  const plateIdx = {}
  for (const s of [1, -1]) {
    plateIdx[s] = push({
      kind: 'plate',
      phase: 'roof',
      group: 'roof',
      course: 0,
      pos: [0, H.eaveY + 0.06, s * H.wallZ],
      euler: [0, 0, 0],
      size: [H.w, 0.12, H.t],
      color: COLORS.timber,
      family: 'timber',
      deps: [],
      stand: { level: 1, x: 0, y: H.decks[1].y, z: s * H.scaffold.rz },
      mortar: -1,
    })
  }

  const N_RAFTERS = Math.max(7, Math.round(H.w / 0.62))
  const rafterIdx = []
  for (let i = 0; i < N_RAFTERS; i++) {
    const x = -H.w / 2 + 0.2 + (i * (H.w - 0.4)) / (N_RAFTERS - 1)
    for (const s of [1, -1]) {
      const zc = (s * (H.roofRun + H.eaveOverhang)) / 2
      rafterIdx.push(
        push({
          kind: 'rafter',
          phase: 'roof',
          group: 'roof',
          course: 1,
          pos: [x, roofTopY(H, Math.abs(zc)) - 0.07, zc],
          euler: [H.roofPitch, s > 0 ? 0 : Math.PI, 0],
          size: [0.09, 0.14, H.slopeLen],
          color: COLORS.timber,
          family: 'timber',
          deps: [plateIdx[s]],
          stand: { level: 2, x, y: H.decks[2].y, z: s * H.scaffold.rz },
          mortar: -1,
        }),
      )
    }
  }

  for (let k = 0; k < 3; k++) {
    const segW = H.w / 3
    const x = -H.w / 2 + segW * (k + 0.5)
    push({
      kind: 'ridge',
      phase: 'roof',
      group: 'roof',
      course: 2,
      pos: [x, roofTopY(H, 0) - 0.1, 0],
      euler: [0, 0, 0],
      size: [segW, 0.2, 0.14],
      color: COLORS.timber,
      family: 'timber',
      deps: rafterIdx.slice(),
      stand: standOnRoof(x, 1, H.slopeLen - 0.72),
      mortar: -1,
    })
  }

  // --- tiles ---------------------------------------------------------------
  const N_COURSE = Math.max(4, Math.round(H.slopeLen / 0.56))
  const N_COL = Math.max(7, Math.round(H.w / 0.63))
  const sp = H.slopeLen / N_COURSE
  const spanX = H.w + 0.2
  const cw = spanX / N_COL
  const tileIdx = {}
  for (const s of [1, -1]) {
    for (let k = 0; k < N_COURSE; k++) {
      const sd = (k + 0.5) * sp
      const zAbs = slopeZ(H, sd)
      const y = roofTopY(H, zAbs) + 0.03 + k * 0.004
      for (let col = 0; col < N_COL; col++) {
        const x = -spanX / 2 + cw * (col + 0.5)
        const standSd = sd - 0.62
        tileIdx[`${s}:${k}:${col}`] = push({
          kind: 'tile',
          phase: 'tiles',
          group: `tile${s}`,
          course: k,
          pos: [x, y, s * zAbs],
          euler: [H.roofPitch, s > 0 ? 0 : Math.PI, 0],
          size: [cw - 0.012, 0.05, sp + 0.1],
          color: tileColor(),
          family: 'tile',
          deps: k > 0 ? [tileIdx[`${s}:${k - 1}:${col}`]] : [],
          stand: standSd < 0.5
            ? { level: 2, x, y: H.decks[2].y, z: s * H.scaffold.rz }
            : standOnRoof(x, s, standSd),
          mortar: -1,
        })
      }
    }
  }
  for (let col = 0; col < N_COL; col++) {
    const x = -spanX / 2 + cw * (col + 0.5)
    push({
      kind: 'cap',
      phase: 'tiles',
      group: 'caps',
      course: 0,
      pos: [x, roofTopY(H, 0) + 0.09, 0],
      euler: [0, 0, 0],
      size: [cw - 0.012, 0.12, 0.36],
      color: tileColor(),
      family: 'tile',
      deps: [tileIdx[`1:${N_COURSE - 1}:${col}`], tileIdx[`-1:${N_COURSE - 1}:${col}`]],
      stand: standOnRoof(x, 1, H.slopeLen - 0.6),
      mortar: -1,
    })
  }

  // --- second fix ----------------------------------------------------------
  // The shell is watertight, so now it gets a floor, its windows and a door.
  // These are ordinary plan items, which means the masons fetch them from the
  // right stock and walk them into place like everything else.
  const iw = H.w - 2 * H.t
  const id = H.d - 2 * H.t
  const FLOOR_COLS = 4
  const FLOOR_ROWS = 2
  for (let r = 0; r < FLOOR_ROWS; r++) {
    for (let c = 0; c < FLOOR_COLS; c++) {
      const sw = iw / FLOOR_COLS
      const sd = id / FLOOR_ROWS
      const x = -iw / 2 + sw * (c + 0.5)
      const z = -id / 2 + sd * (r + 0.5)
      push({
        kind: 'floor',
        phase: 'secondfix',
        group: 'floor',
        course: 0,
        pos: [x, 0.035, z],
        euler: [0, 0, 0],
        size: [sw - 0.02, 0.07, sd - 0.02],
        color: 0xb9b3a6,
        family: 'masonry',
        deps: [],
        // laid from inside, standing on the bay it has just come from
        stand: { level: 'inside', x, y: 0, z: z + sd * 0.34 },
        mortar: -1,
      })
    }
  }

  for (const o of openings) {
    const w = WALLS.find((x) => x.id === o.wall)
    const alongX = w.axis === 'x'
    const mid = (o.u0 + o.u1) / 2
    const openW = o.u1 - o.u0
    const openH = (o.c1 - o.c0 + 1) * COURSE
    const cy = o.c0 * COURSE + openH / 2
    const yaw = alongX ? 0 : Math.PI / 2
    const cx = alongX ? mid : w.line
    const cz = alongX ? w.line : mid
    const stand = standAt(cx, cz, w.nx, w.nz, o.c0 * COURSE, (o.c1 + 1) * COURSE)

    if (o.kind === 'door') {
      push({
        kind: 'door',
        phase: 'secondfix',
        group: 'joinery',
        course: 0,
        pos: [cx + w.nx * 0.02, cy, cz + w.nz * 0.02],
        euler: [0, yaw, 0],
        size: [openW - 0.04, openH - 0.03, 0.08],
        color: 0x2f5d4a,
        family: 'timber',
        deps: [],
        stand,
        mortar: -1,
      })
      continue
    }
    const frameIdx = push({
      kind: 'frame',
      phase: 'secondfix',
      group: 'joinery',
      course: 0,
      pos: [cx, cy, cz],
      euler: [0, yaw, 0],
      size: [openW + 0.06, openH + 0.06, H.t + 0.04],
      color: 0xeae2d2,
      family: 'frame',
      deps: [],
      stand,
      mortar: -1,
    })
    push({
      kind: 'pane',
      phase: 'secondfix',
      group: 'joinery',
      course: 0,
      pos: [cx, cy, cz],
      euler: [0, yaw, 0],
      size: [openW - 0.06, openH - 0.06, 0.03],
      color: 0xa8d4ea,
      family: 'glass',
      deps: [frameIdx],
      stand,
      mortar: -1,
    })
  }

  // --- support between courses --------------------------------------------
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

  // --- paint patches -------------------------------------------------------
  // The decorators work the outside in bands: a stretch of wall, four courses
  // high. Each patch holds the instance slots that change colour when it's done.
  const patchMap = new Map()
  for (const it of items) {
    if (!it.paintable) continue
    const band = Math.floor(it.course / 2)
    const key = `${it.group}:${band}`
    let p = patchMap.get(key)
    if (!p) {
      p = { key, group: it.group, band, slots: [], stand: it.stand, sum: [0, 0, 0], n: 0 }
      patchMap.set(key, p)
    }
    p.slots.push(it.slot)
    p.sum[0] += it.pos[0]
    p.sum[1] += it.pos[1]
    p.sum[2] += it.pos[2]
    p.n++
    // stand at the middle of the patch so the painter isn't stuck at one end
    if (p.slots.length % 2 === 1) p.stand = it.stand
  }
  const paintPatches = [...patchMap.values()].map((p, i) => ({
    id: i,
    key: p.key,
    slots: p.slots,
    stand: p.stand,
    pos: [p.sum[0] / p.n, p.sum[1] / p.n, p.sum[2] / p.n],
  }))

  // --- fit-out -------------------------------------------------------------
  // Where each piece of furniture ends up, inside the walls.
  const ix = H.w / 2 - H.t - 0.45
  const iz = H.d / 2 - H.t - 0.45
  // Placed as fractions of the room, so the same van-load fits any of the houses.
  const FURNITURE = [
    { name: 'sofa', size: [1.4, 0.62, 0.62], color: 0x6d7f9c, u: -0.42, v: -0.72, rot: 0 },
    { name: 'wardrobe', size: [0.95, 1.7, 0.52], color: 0x7c5535, u: 0.1, v: -0.86, rot: 0 },
    { name: 'bookcase', size: [0.85, 1.4, 0.34], color: 0x96683c, u: -0.92, v: 0.05, rot: 1.57 },
    { name: 'table', size: [0.95, 0.58, 0.68], color: 0xa9763f, u: 0.62, v: 0.1, rot: 0.2 },
    { name: 'chair', size: [0.4, 0.8, 0.4], color: 0x8f5f33, u: 0.92, v: 0.42, rot: -0.5 },
    { name: 'chair', size: [0.4, 0.8, 0.4], color: 0x8f5f33, u: 0.34, v: 0.34, rot: 2.4 },
    { name: 'bed', size: [1.2, 0.5, 1.8], color: 0xc4b9a6, u: -0.5, v: 0.62, rot: 0 },
    { name: 'lamp', size: [0.3, 1.3, 0.3], color: 0xe0c98a, u: 0.92, v: -0.66, rot: 0 },
    { name: 'bookcase', size: [0.8, 1.3, 0.32], color: 0x8a5f38, u: 0.9, v: -0.2, rot: -1.57 },
    { name: 'chair', size: [0.4, 0.8, 0.4], color: 0x7d5330, u: -0.05, v: 0.86, rot: 0.9 },
  ].map((f) => ({ ...f, at: [f.u * ix, 0, f.v * iz] }))

  const phases = PHASES.map((p) => ({
    ...p,
    total: items.filter((it) => it.phase === p.key).length,
  })).filter((p) => p.total > 0)

  return {
    geom: H,
    items,
    phases,
    mortar,
    openings,
    doorway,
    familyCount,
    paintPatches,
    furniture: FURNITURE,
    paint,
    title: `PLOT ${plotIndex + 1} — ${H.name}`,
    day,
  }
}
