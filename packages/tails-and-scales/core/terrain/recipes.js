// ---------------------------------------------------------------------------
// The modules and features a battlefield is built from, as recipes.
//
// Everything on the table is built from a handful of *modules*: a wall
// column (a stack of blocks), a tree, a hedge segment, a boulder, a crate, a
// giant mushroom, a forest floor. Every module is one or more *chunks*, the
// unit of line of sight, cover, movement blocking and destruction. Modules
// are composed into *features* (an L-shaped ruin, a copse, a hedgerow, a
// ruined tower ring...), and the terrain set (sets.js) scatters features with
// point symmetry, so neither army gets the better half of the table.
//
// A recipe draws from the layout stream (a mulberry32 per feature, seeded off
// the board's own stream) and hands Terrain.add a ChunkDef: kind, hit points,
// the oriented box `shape` used for line of sight and blasts, an optional
// movement footprint `nav` and cover footprint `coverShape`, and `look`.
//
// THE TRAP: the layout stream also feeds what things look like (colour
// picks, scale jitter, canopy blobs, berries, moss). Those draws sit between
// the ones that place things, so every rng() call here is made in exactly
// the order the battlefield has always made them, and its result is recorded
// in `look`. view/terrain.js builds the meshes from `look` and draws nothing
// from this stream. Purely cosmetic randomness that never touched it (rubble
// pieces, shudder, leaves) stays in the view, on the engine's own unseeded
// random.
//
// sim/terrain-check.mjs holds this to the battlefield as it was built before
// the split (the R0 code): every chunk, every look against the old meshes,
// and the stream's draw count, for 500 boards.
//
// Here too is `scatter`, which lays a terrain set (sets.js, the data) out
// over the table, and `checkSet`, which sets.js runs on every set at load.
// ---------------------------------------------------------------------------
import { mulberry32, pick, rr, deepFreeze } from '../util.js'
import { hypot } from '../dmath.js'

// Wall styles: palette, block width / height / thickness, hit points, and
// whether a block is a box or a log. The palettes are drawn from the layout
// stream, so they are consensus data like the rest.
export const STYLES = deepFreeze({
  stone: { colors: ['#8f8b82', '#9c978d', '#7f7b73', '#a7a296', '#878378'], bw: 1, by: 0.72, bt: 0.62, hp: 3, look: 'box' },
  sand: { colors: ['#c9a66b', '#d6b67e', '#b9935b', '#ddc28e', '#c29a60'], bw: 1, by: 0.72, bt: 0.66, hp: 2, look: 'box' },
  log: { colors: ['#7a5232', '#6b4528', '#86603c', '#5f3e24'], bw: 1, by: 0.56, bt: 0.56, hp: 2, look: 'log' },
})
export const LEAVES = deepFreeze({
  oak: ['#4f8a34', '#5f9a3c', '#447a2c', '#6aa646'],
  autumn: ['#d08a2c', '#c4622a', '#e0a93a', '#b8481f'],
  pine: ['#2f6a3c', '#3a7a46', '#285c34'],
})
// splinters, for the view's debris when a crate or a log breaks
export const WOOD = deepFreeze(['#7a5232', '#5f3e24', '#9a7048', '#b08a5a'])
const BARK = Object.freeze(['#6b4a2e', '#5a3d24', '#7a5638'])
const HEDGE = Object.freeze(['#3f7a34', '#4a8a3a', '#386c2e'])
const HEDGE_TUFT = Object.freeze(['#4f8f3e', '#5c9a46', '#3f7a34'])
const HEDGE_LEAVES = Object.freeze(['#3f7a34', '#5c9a46', '#2f5f28'])
const STONE = Object.freeze(['#7d7a74', '#8c8880', '#6e6b66', '#96918a'])
const CRATE = Object.freeze(['#9a7048', '#8a6038', '#a77d50'])
const BARREL = Object.freeze(['#8a5a34', '#7a4c2a'])
const CAPS = Object.freeze(['#c0392b', '#d35a1f', '#8e44ad', '#b03050'])
// a forest floor is a CircleGeometry(r, 22): a centre vertex and 23 rim
// vertices (the seam is doubled), each rim vertex pulled in or out by a draw
const FLOOR_SEGMENTS = 22

// Build feature `name` in frame F from its own seed, so the mirrored copy
// comes out identical, just turned around.
export function build(T, name, frame, seed) {
  const rng = mulberry32(seed)
  const c = Math.cos(frame.yaw), s = Math.sin(frame.yaw)
  const F = {
    p: (lx, lz) => ({ x: frame.x + c * lx + s * lz, z: frame.z - s * lx + c * lz }),
    yaw: (ly = 0) => frame.yaw + ly,
  }
  FEATURES[name](T, F, rng)
}

// ── Modules ─────────────────────────────────────────────────────────────────
// Each takes the terrain it adds to, the feature's frame F and its stream.

// A wall column: a stack of `h` blocks (with optional holes, at the levels
// in `holes`) and maybe a cap. Its blocks share one record, so when one breaks the ones
// above can drop into the gap (Terrain.collapse) and rubble piles at its foot.
export function column(T, F, rng, lx, lz, ly, h, styleKey, { holes = [], cap = false, bw, bt } = {}) {
  const st = STYLES[styleKey]
  const w = bw ?? st.bw, t = bt ?? st.bt
  const p = F.p(lx, lz)
  const yaw = F.yaw(ly)
  const col = { blocks: [], x: p.x, z: p.z, yaw, style: styleKey, by: st.by, rubble: null, w, t }
  for (let k = 0; k < h; k++) {
    if (holes.includes(k)) continue
    const color = pick(st.colors, rng)
    const jy = yaw + (rng() - 0.5) * 0.06
    const scale = st.look === 'log' ? [w * 1.02, st.by, t] : [w * (0.95 + rng() * 0.04), st.by * 0.96, t * (0.9 + rng() * 0.1)]
    const b = T.add({
      kind: 'block', hp: st.hp,
      shape: { x: p.x, y: st.by * (k + 0.5), z: p.z, hx: w / 2, hy: st.by / 2, hz: t / 2, yaw },
      navKind: 'soft', los: 'block', cover: true, col, level: k,
      look: { piece: st.look, color, chip: color, scale, yaw: jy },
    })
    col.blocks.push(b)
  }
  if (cap && h > 0) {
    const color = pick(st.colors, rng)
    const y = st.by * h + w * 0.55
    const b = T.add({
      kind: 'block', hp: st.hp,
      shape: { x: p.x, y, z: p.z, hx: w / 2, hy: w * 0.55, hz: w / 2, yaw },
      navKind: 'soft', los: 'block', cover: true, col, level: h,
      look: { piece: 'cap', color, chip: color, r: w * 0.72, h: w * 1.1, yaw },
    })
    col.blocks.push(b)
  }
  return col
}

export function tree(T, F, rng, lx, lz, species) {
  const p = F.p(lx, lz)
  const trunkH = rr(rng, 1.5, 2.4), trunkR = rr(rng, 0.17, 0.26)
  const bark = pick(BARK, rng)
  const leaves = LEAVES[species]
  const canopy = []
  let top
  if (species === 'pine') {
    for (let i = 0; i < 3; i++) {
      const r = 1.05 - i * 0.26, h = 1.3 - i * 0.15
      canopy.push({ cone: true, r, h, color: pick(leaves, rng), y: trunkH * 0.45 + i * 0.75 + h / 2, yaw: rng() * 3 })
    }
    top = trunkH * 0.45 + 2.5
  } else {
    const n = 3 + Math.floor(rng() * 3)
    for (let i = 0; i < n; i++) {
      const r = rr(rng, 0.55, 0.9)
      canopy.push({ r, color: pick(leaves, rng), pos: [rr(rng, -0.5, 0.5), trunkH + rr(rng, -0.1, 0.6), rr(rng, -0.5, 0.5)] })
    }
    top = trunkH + 1.2
  }
  const yaw = rng() * 6
  return T.add({
    kind: 'tree', hp: 3,
    shape: { x: p.x, y: top / 2, z: p.z, hx: 0.7, hy: top / 2, hz: 0.7, yaw: 0 },
    nav: { x: p.x, z: p.z, hx: trunkR + 0.12, hz: trunkR + 0.12, yaw: 0 },
    coverShape: { x: p.x, z: p.z, hx: 0.8, hz: 0.8, yaw: 0 },
    navKind: 'soft', los: 'obscure', cover: true, trunkH, trunkR,
    // the trunk's size is rules (a felled tree's log is the trunk) and look
    look: { piece: 'tree', trunk: { h: trunkH, r: trunkR }, bark, canopy, yaw, leaves },
  })
}

export function hedge(T, F, rng, lx, lz, ly) {
  const p = F.p(lx, lz)
  const yaw = F.yaw(ly)
  const color = pick(HEDGE, rng)
  const tufts = []
  for (let i = 0; i < 3; i++) tufts.push({ color: pick(HEDGE_TUFT, rng), pos: [-0.4 + i * 0.4, 0.62 + rng() * 0.08, rr(rng, -0.08, 0.08)] })
  const berries = []
  if (rng() < 0.4) {
    // a few berries, because why not
    for (let i = 0; i < 4; i++) berries.push([rr(rng, -0.5, 0.5), rr(rng, 0.35, 0.75), 0.29])
  }
  return T.add({
    kind: 'hedge', hp: 1,
    shape: { x: p.x, y: 0.42, z: p.z, hx: 0.6, hy: 0.42, hz: 0.3, yaw },
    navKind: 'diff', los: 'obscure', cover: true,
    look: { piece: 'hedge', color, tufts, berries, yaw, leaves: HEDGE_LEAVES },
  })
}

export function boulder(T, F, rng, lx, lz, size) {
  const p = F.p(lx, lz)
  const sy = rr(rng, 0.65, 1.25)
  const color = pick(STONE, rng)
  const scale = [1, sy, rr(rng, 0.75, 1.1)]
  const rot = [rng() * 0.6, rng() * 6, rng() * 0.6]
  const h = size * sy
  // a lick of moss
  const moss = rng() < 0.6
  const top = h * 1.5
  return T.add({
    kind: 'rock', hp: Infinity,
    shape: { x: p.x, y: top / 2, z: p.z, hx: size * 0.85, hy: top / 2, hz: size * 0.85, yaw: 0 },
    navKind: 'hard', los: top > 1.2 ? 'block' : 'obscure', cover: true,
    look: { piece: 'boulder', size, color, scale, rot, y: h * 0.55, moss },
  })
}

export function crate(T, F, rng, lx, lz) {
  const p = F.p(lx, lz)
  const yaw = F.yaw(rng() * 6)
  const kind = rng()
  let look, top
  if (kind < 0.45) {
    const s = rr(rng, 0.55, 0.75)
    const color = pick(CRATE, rng)
    const stacked = rng() < 0.4
    look = { piece: 'crate', s, color, stacked }
    top = stacked ? s * 1.7 : s
  } else if (kind < 0.8) {
    look = { piece: 'barrel', color: pick(BARREL, rng) }
    top = 0.75
  } else {
    // a sack of acorns, split at the top
    const acorns = []
    for (let i = 0; i < 4; i++) acorns.push([rr(rng, -0.12, 0.12), rr(rng, -0.12, 0.12)])
    look = { piece: 'sack', acorns }
    top = 0.78
  }
  return T.add({
    kind: 'crate', hp: 1,
    shape: { x: p.x, y: top / 2, z: p.z, hx: 0.36, hy: top / 2, hz: 0.36, yaw },
    navKind: 'diff', los: 'obscure', cover: true,
    look: { ...look, yaw, chip: '#9a7048' },
  })
}

export function mushroom(T, F, rng, lx, lz) {
  const p = F.p(lx, lz)
  const h = rr(rng, 0.9, 1.9), r = rr(rng, 0.5, 0.95), sr = rr(rng, 0.12, 0.2)
  const cap = pick(CAPS, rng)
  // six spots on the cap, at (azimuth, elevation)
  const dots = []
  for (let i = 0; i < 6; i++) {
    const a = rng() * 6, e = rr(rng, 0.25, 1.1)
    dots.push([a, e])
  }
  const tilt = rr(rng, -0.12, 0.12)
  const top = h + r * 0.7
  return T.add({
    kind: 'mushroom', hp: 2,
    shape: { x: p.x, y: top / 2, z: p.z, hx: r * 0.6, hy: top / 2, hz: r * 0.6, yaw: 0 },
    nav: { x: p.x, z: p.z, hx: sr + 0.12, hz: sr + 0.12, yaw: 0 },
    navKind: 'soft', los: 'obscure', cover: true,
    look: { piece: 'mushroom', h, r, sr, cap, dots, tilt, leaves: [cap, '#fff6e0', '#efe6d0'] },
  })
}

export function floor(T, F, rng, r, color) {
  const p = F.p(0, 0)
  const rim = []
  for (let i = 1; i < FLOOR_SEGMENTS + 2; i++) rim.push(0.78 + rng() * 0.3)
  return T.add({
    kind: 'floor', hp: Infinity,
    shape: { x: p.x, y: 0.01, z: p.z, hx: r * 0.75, hy: 0.01, hz: r * 0.75, yaw: 0 },
    navKind: 'diff', cover: true,
    look: { piece: 'floor', r, segments: FLOOR_SEGMENTS, color, rim },
  })
}

// ── Features ────────────────────────────────────────────────────────────────

function ruin(T, F, rng) {
  const style = pick(['stone', 'sand', 'log', 'stone'], rng)
  const A = 4 + Math.floor(rng() * 3), B = 3 + Math.floor(rng() * 3)
  const ox = -A / 2 + 0.5, oz = -B / 2 + 0.5
  const door = 1 + Math.floor(rng() * (A - 2))
  for (let i = 0; i < A; i++) {
    if (i === door) continue
    let h = Math.max(1, Math.min(3, 3 - Math.floor(i / 2) + Math.floor(rng() * 2) - (rng() < 0.3 ? 1 : 0)))
    const holes = h === 3 && rng() < 0.35 ? [1] : []
    column(T, F, rng, ox + i, oz, 0, h, style, { holes })
  }
  for (let j = 1; j <= B; j++) {
    let h = Math.max(1, Math.min(3, 3 - Math.floor(j / 2) + Math.floor(rng() * 2)))
    if (rng() < 0.15) continue
    const holes = h === 3 && rng() < 0.35 ? [1] : []
    column(T, F, rng, ox, oz + 0.3 + 0.5 + (j - 1), Math.PI / 2, h, style, { holes })
  }
  const n = Math.floor(rng() * 3)
  for (let i = 0; i < n; i++) crate(T, F, rng, ox + rr(rng, 1.5, A - 1), oz + rr(rng, 1.6, B - 0.5))
}

function wall(T, F, rng) {
  const style = pick(['stone', 'sand', 'log'], rng)
  const n = 5 + Math.floor(rng() * 3)
  const gap = Math.floor(rng() * n)
  for (let i = 0; i < n; i++) {
    if (i === gap && n > 5) continue
    const h = 1 + Math.floor(rng() * 3)
    column(T, F, rng, i - (n - 1) / 2, 0, 0, h, style, { holes: h === 3 && rng() < 0.4 ? [1] : [] })
  }
  if (rng() < 0.6) crate(T, F, rng, rr(rng, -2, 2), rr(rng, 0.9, 1.4))
}

function tower(T, F, rng) {
  // a broken ring of columns round the centre objective, its own mirror image
  const style = pick(['stone', 'sand'], rng)
  const n = 18, R = 3.4
  const heights = []
  for (let i = 0; i < n / 2; i++) heights.push(1 + Math.floor(rng() * 3))
  const doors = new Set([0, Math.floor(n / 4) + (rng() < 0.5 ? 0 : 1)])
  const glazed = heights.map((h) => h === 3 && rng() < 0.4)
  for (let i = 0; i < n; i++) {
    const k = i % (n / 2)
    if (doors.has(k)) continue
    const a = (i / n) * Math.PI * 2
    const yaw = Math.atan2(-Math.cos(a), -Math.sin(a))
    column(T, F, rng, Math.cos(a) * R, Math.sin(a) * R, yaw, heights[k], style, {
      holes: glazed[k] ? [1] : [], bw: 1.12,
    })
  }
}

function forest(T, F, rng) {
  const species = rng() < 0.3 ? 'pine' : rng() < 0.4 ? 'autumn' : 'oak'
  floor(T, F, rng, 3.0, species === 'autumn' ? '#5a5a2a' : '#355a2a')
  const pts = []
  const n = 3 + Math.floor(rng() * 3)
  for (let tries = 0; tries < 60 && pts.length < n; tries++) {
    const a = rng() * Math.PI * 2, d = Math.sqrt(rng()) * 2.2
    const x = Math.cos(a) * d, z = Math.sin(a) * d
    if (pts.some((p) => hypot(p.x - x, p.z - z) < 1.55)) continue
    pts.push({ x, z })
  }
  for (const p of pts) tree(T, F, rng, p.x, p.z, species)
}

function hedgerow(T, F, rng) {
  const n = 5 + Math.floor(rng() * 3)
  const bend = rr(rng, -0.12, 0.12)
  const gap = 1 + Math.floor(rng() * (n - 2))
  for (let i = 0; i < n; i++) {
    if (i === gap && rng() < 0.7) continue
    const x = (i - (n - 1) / 2) * 1.12
    const z = bend * x * x
    hedge(T, F, rng, x, z, -Math.atan(2 * bend * x))
  }
}

function rocks(T, F, rng) {
  const n = 2 + Math.floor(rng() * 3)
  boulder(T, F, rng, 0, 0, rr(rng, 0.8, 1.15))
  for (let i = 1; i < n; i++) {
    const a = rng() * 6
    boulder(T, F, rng, Math.cos(a) * rr(rng, 0.9, 1.4), Math.sin(a) * rr(rng, 0.9, 1.4), rr(rng, 0.35, 0.7))
  }
}

function barricade(T, F, rng) {
  const n = 3 + Math.floor(rng() * 3)
  for (let i = 0; i < n; i++) crate(T, F, rng, (i - (n - 1) / 2) * 0.8 + rr(rng, -0.1, 0.1), rr(rng, -0.3, 0.3))
}

function mushrooms(T, F, rng) {
  const n = 3 + Math.floor(rng() * 3)
  const pts = []
  for (let tries = 0; tries < 40 && pts.length < n; tries++) {
    const a = rng() * 6, d = Math.sqrt(rng()) * 1.5
    const x = Math.cos(a) * d, z = Math.sin(a) * d
    if (pts.some((p) => hypot(p.x - x, p.z - z) < 0.9)) continue
    pts.push({ x, z })
    mushroom(T, F, rng, x, z)
  }
}

function obelisk(T, F, rng) {
  column(T, F, rng, 0, 0, 0, 3 + Math.floor(rng() * 2), 'sand', { cap: true, bw: 0.8, bt: 0.8 })
  if (rng() < 0.7) boulder(T, F, rng, 1.0, 0.4, 0.4)
}

export const FEATURES = deepFreeze(Object.assign(Object.create(null), { ruin, wall, tower, forest, hedgerow, rocks, barricade, mushrooms, obelisk }))

// ── Centre pieces ───────────────────────────────────────────────────────────
// What a set's centre rule can stand round the centre objective. Each draws
// its own placement from the board's stream and records the footprint it
// takes, so the scattered features keep clear of it.
export const CENTRES = deepFreeze(Object.assign(Object.create(null), {
  // the ruined tower ring, the objective inside it
  tower(T, rng, placed) {
    build(T, 'tower', { x: 0, z: 0, yaw: rng() * Math.PI }, (rng() * 1e9) | 0)
    placed.push({ x: 0, z: 0, r: 4.6, hollow: true })
  },
  // four little rock piles boxing the objective in, mirrored in pairs
  rockbox(T, rng, placed) {
    const a = rng() * Math.PI
    for (const k of [0, 1]) {
      const ang = a + k * (Math.PI / 2)
      const x = Math.cos(ang) * 4.2, z = Math.sin(ang) * 4.2
      const s = (rng() * 1e9) | 0
      build(T, 'rocks', { x, z, yaw: ang }, s)
      build(T, 'rocks', { x: -x, z: -z, yaw: ang + Math.PI }, s)
      placed.push({ x, z, r: 1.8 }, { x: -x, z: -z, r: 1.8 })
    }
  },
}))

// ── Scattering a set ────────────────────────────────────────────────────────
// Lay terrain set S (sets.js) out over T's table from the board seed: one
// draw for the centre rule (its piece draws its own placement), one for how
// many pairs, then attempt after attempt: a weighted draw of the feature,
// its place, and if every spacing rule passes, its turn and its own seed,
// built twice, the copy turned half round the centre. Returns the
// footprints placed. Every draw comes from the one stream, in this order.
export function scatter(T, S, seed, objectives, deployDepth) {
  const rng = mulberry32(seed)
  const { W, H } = T
  const placed = []

  // The middle of the table: something wrapped around the centre objective.
  const centre = rng()
  const middle = S.centre.find(([, below]) => centre < below)
  if (middle) CENTRES[middle[0]](T, rng, placed)

  const KINDS = S.kinds
  const total = KINDS.reduce((s, k) => s + k[2], 0)
  const want = S.pairs[0] + Math.floor(rng() * S.pairs[1])
  let pairs = 0
  for (let attempt = 0; attempt < S.attempts && pairs < want; attempt++) {
    let w = rng() * total, kind = KINDS[0]
    for (const k of KINDS) if ((w -= k[2]) <= 0) { kind = k; break }
    const [name, r] = kind
    const x = rr(rng, -W / 2 + r + S.margin, W / 2 - r - S.margin)
    const z = rr(rng, -H / 2 + r + S.margin, H / 2 - r - S.margin)
    // a feature and its mirror image mustn't overlap
    if (hypot(x, z) < r + S.selfGap) continue
    const inDeploy = Math.abs(x) > W / 2 - deployDepth - S.deployMargin
    if (inDeploy && (r > S.bigNotInDeploy || S.notInDeploy.includes(name))) continue
    if (objectives.some((o) => hypot(o.x - x, o.z - z) < r + S.objectiveGap)) continue
    const gap = S.gap
    if (placed.some((p) => hypot(p.x - x, p.z - z) < p.r + r + gap || hypot(p.x + x, p.z + z) < p.r + r + gap)) continue
    const yaw = rng() * Math.PI * 2
    const s = (rng() * 1e9) | 0
    build(T, name, { x, z, yaw }, s)
    build(T, name, { x: -x, z: -z, yaw: yaw + Math.PI }, s)
    placed.push({ x, z, r }, { x: -x, z: -z, r })
    pairs++
  }
  return placed
}

// What a set must hold for scatter to read it (sets.js runs this on every set
// at load, so a bad name fails on every board, not only on the boards whose
// draws land on it). Throws, naming the set and the field.
const SET_FIELDS = Object.freeze(['centre', 'kinds', 'pairs', 'attempts', 'mirror', 'margin', 'selfGap', 'deployMargin', 'bigNotInDeploy', 'notInDeploy', 'objectiveGap', 'gap'])
const MIRRORS = Object.freeze(['point']) // the only symmetry scatter knows
export function checkSet(name, S) {
  const bad = (why) => {
    throw new Error(`terrain set "${name}": ${why}`)
  }
  const num = (v) => typeof v === 'number' && Number.isFinite(v)
  const int = (v) => Number.isInteger(v) && v >= 0
  if (!S || typeof S !== 'object') bad('is not a table')
  for (const k of Object.keys(S)) if (!SET_FIELDS.includes(k)) bad(`unknown field "${k}"`)
  for (const k of SET_FIELDS) if (!(k in S)) bad(`no "${k}"`)
  if (!Array.isArray(S.kinds) || !S.kinds.length) bad('kinds must list at least one feature')
  S.kinds.forEach((k, i) => {
    if (!Array.isArray(k) || k.length !== 3) bad(`kinds[${i}] must be [feature, radius, weight]`)
    if (!(k[0] in FEATURES)) bad(`kinds[${i}]: no feature "${k[0]}" (there are ${Object.keys(FEATURES).join(', ')})`)
    if (!num(k[1]) || k[1] <= 0) bad(`kinds[${i}] (${k[0]}): radius ${k[1]} must be a number above 0`)
    if (!num(k[2]) || k[2] <= 0) bad(`kinds[${i}] (${k[0]}): weight ${k[2]} must be a number above 0`)
  })
  if (!Array.isArray(S.centre)) bad('centre must be a list of [piece, threshold]')
  S.centre.forEach((c, i) => {
    if (!Array.isArray(c) || c.length !== 2) bad(`centre[${i}] must be [piece, threshold]`)
    if (!(c[0] in CENTRES)) bad(`centre[${i}]: no centre piece "${c[0]}" (there are ${Object.keys(CENTRES).join(', ')})`)
    if (!num(c[1]) || c[1] <= 0 || c[1] > 1) bad(`centre[${i}] (${c[0]}): threshold ${c[1]} must be in (0, 1]`)
    if (i && c[1] <= S.centre[i - 1][1]) bad(`centre[${i}] (${c[0]}): thresholds must rise (the first one above the draw wins)`)
  })
  if (!Array.isArray(S.pairs) || S.pairs.length !== 2 || !S.pairs.every(int)) bad('pairs must be two whole numbers, 0 or more')
  if (!int(S.attempts)) bad(`attempts ${S.attempts} must be a whole number, 0 or more`)
  if (!MIRRORS.includes(S.mirror)) bad(`mirror "${S.mirror}" is not one scatter knows (${MIRRORS.join(', ')})`)
  for (const k of ['margin', 'selfGap', 'deployMargin', 'bigNotInDeploy', 'objectiveGap', 'gap']) if (!num(S[k])) bad(`${k} ${S[k]} must be a finite number`)
  if (!Array.isArray(S.notInDeploy)) bad('notInDeploy must be a list of features')
  for (const f of S.notInDeploy) if (!(f in FEATURES)) bad(`notInDeploy: no feature "${f}"`)
  return S
}
