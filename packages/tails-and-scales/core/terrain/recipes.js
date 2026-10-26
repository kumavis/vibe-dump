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
import { hypot, sin, cos, atan, atan2 } from '../dmath.js'
import { corners } from './geom.js'

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
  const c = cos(frame.yaw), s = sin(frame.yaw)
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
    const yaw = atan2(-cos(a), -sin(a))
    column(T, F, rng, cos(a) * R, sin(a) * R, yaw, heights[k], style, {
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
    const x = cos(a) * d, z = sin(a) * d
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
    hedge(T, F, rng, x, z, -atan(2 * bend * x))
  }
}

function rocks(T, F, rng) {
  const n = 2 + Math.floor(rng() * 3)
  boulder(T, F, rng, 0, 0, rr(rng, 0.8, 1.15))
  for (let i = 1; i < n; i++) {
    const a = rng() * 6
    boulder(T, F, rng, cos(a) * rr(rng, 0.9, 1.4), sin(a) * rr(rng, 0.9, 1.4), rr(rng, 0.35, 0.7))
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
    const x = cos(a) * d, z = sin(a) * d
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

// ── Fortifications (F7a, DESIGN §4.2.4) ─────────────────────────────────────
// Raised ground a squad can stand on: decks (a walkable top over a solid
// body), the stairs that rise to them and the ladders that scale them, built
// into five recipes (ramparts, bastions, watchtowers, timber platforms on
// posts, and the keep round the centre objective). They are sized for whole
// squads, every unit being one disc on the nav grid: a deck's narrow side is
// at least 4.5" and a stair 4.5" wide, so a disc of CLIMB_R (1.22") stands on
// every deck top and at both ends of every stair and ladder at any yaw, and a
// ladder is a nav link from a foot cell 2.25" out from its face to a top cell
// on the deck's centreline, not a ramp (a ramp that steep is all ledge).
//
// The pieces only carry the data: `surface` (the walkable top, in the
// chunk's own frame: a deck's y, a stair's ramp from y0 at its own −x end to
// y1 at its +x end), `link` (a ladder's foot and top, on the table, and the
// height it climbs) and, for F7c, a timber deck's `supports` (its posts' ids)
// and a ladder's `on` (its deck's id). core/nav.js builds the height layer
// from them; in classic and `open` nothing has them and no floor is built.
// None of them breaks in F7a (hp Infinity); F7c makes posts breakable.
//
// Every fortification is a recipe with its own stream, like any feature: the
// draws it makes (its colours, which end a rampart's stair is at, where its
// ladder stands along the face) are made in a fixed order and recorded in
// `look`, and a recipe draws nothing else, so `gatesOf` can dry-build one
// without touching the board's stream. Each is centred on its bounding box
// (its ladders' feet included), with its front at local −z.
//
// The point mirror is exact: a fortification's copy is built from the first
// copy's frame with every place negated (the same sums, their sign flipped,
// which IEEE rounding keeps exact) and every yaw the first copy's plus π, so
// the floor, the links and the gates of the two halves of the table are
// each other's negation bit for bit (sim/terrain-check.mjs). A feature's
// copy turns its frame by π instead (build, above), whose cos and sin are an
// ulp or so off the first copy's; that is classic's, and stays.

// the slope every stair rises at (DESIGN §4.2.4's STAIR_SLOPE: 4" long for
// a 2" deck); a ladder's foot stands LADDER_OUT out from its face, and a
// stair's gate (where a unit about to climb it stands) GATE_OUT past its foot
export const STAIR_SLOPE = 0.5
export const LADDER_OUT = 2.25
export const GATE_OUT = 0.5
// a ladder is drawn as a strip this wide against its face, this thick
const LADDER_W = 1, LADDER_T = 0.3
// a timber deck's posts: 0.4" square, set in by their half-width from the
// deck's corners
const POST = 0.4
// what decks are made of, and their palettes (drawn from the layout stream)
const EARTH = Object.freeze(['#8b7350', '#7f6846', '#957c57', '#86704c'])
const DECK_STONE = Object.freeze(['#8f8b82', '#9c978d', '#878378', '#a19c91'])
const TIMBER = Object.freeze(['#8a6038', '#7a5232', '#9a7048'])

// ── Pieces ──────────────────────────────────────────────────────────────────
// Each takes the terrain, the fortification's frame F (fortFrame, below) and
// what the recipe decided, and adds one chunk. `look` carries what the view
// builds the mesh from: the piece, the recipe it belongs to, its material
// and colour, and its size in its own frame (w along its own x, d along its
// own z, h tall).

// A deck: a walkable top h high over a solid body (line of sight runs into
// it: the "dead ground" at the foot of a wall), w × d, its own frame the
// fortification's turned by ly.
function deck(T, F, { lx, lz, ly = 0, w, d, h, material, color, recipe, supports }) {
  const p = F.p(lx, lz)
  const def = {
    kind: 'deck', hp: Infinity,
    shape: { x: p.x, y: h / 2, z: p.z, hx: w / 2, hy: h / 2, hz: d / 2, yaw: F.yaw(ly) },
    navKind: null, los: 'block', cover: false,
    surface: { y: h },
    look: { piece: 'deck', recipe, material, w, d, h, color, chip: color },
  }
  if (supports) def.supports = supports
  return T.add(def)
}

// A stair: a ramp len long and w wide, rising from the ground at its own −x
// end to h at its own +x end (`look.rise` says so: '+x'); ly turns its own
// frame so its own +x points up the stair.
function stair(T, F, { lx, lz, ly, len, w, h, material, color, recipe }) {
  const p = F.p(lx, lz)
  return T.add({
    kind: 'stair', hp: Infinity,
    shape: { x: p.x, y: h / 2, z: p.z, hx: len / 2, hy: h / 2, hz: w / 2, yaw: F.yaw(ly) },
    navKind: null, los: null, cover: false,
    surface: { y: h, ramp: { axis: 'x', y0: 0, y1: h } },
    look: { piece: 'stair', recipe, material, w: len, d: w, h, rise: '+x', color, chip: color },
  })
}

// A ladder against the face at (lx, lz), on the face's outer side: ly (0 on
// a front face, π on a back one) turns its own frame so its own −z points
// out from the face (`look.face`: '-z', the side it leans out to and its
// foot stands on). Its link joins `foot` (LADDER_OUT out from the face) to
// `top` (on the deck, at its centreline), both on the table, climbing h;
// `on` is its deck's id.
function ladder(T, F, { lx, lz, ly, h, color, recipe, foot, top, on }) {
  // (the strip's centre, half its thickness out from the face)
  const out = ly === 0 ? -1 : 1
  const p = F.p(lx, lz + out * (LADDER_T / 2))
  return T.add({
    kind: 'ladder', hp: Infinity,
    shape: { x: p.x, y: h / 2, z: p.z, hx: LADDER_W / 2, hy: h / 2, hz: LADDER_T / 2, yaw: F.yaw(ly) },
    navKind: null, los: null, cover: false,
    link: { foot: F.p(foot[0], foot[1]), top: F.p(top[0], top[1]), h },
    on,
    look: { piece: 'ladder', recipe, material: 'timber', w: LADDER_W, d: LADDER_T, h, face: '-z', color, chip: color },
  })
}

// A timber deck's post, 0.4" square, the deck's height (under its deck, so
// it has no nav effect; it blocks a line of sight under the deck).
function post(T, F, lx, lz, h, color, recipe) {
  const p = F.p(lx, lz)
  return T.add({
    kind: 'post', hp: Infinity,
    shape: { x: p.x, y: h / 2, z: p.z, hx: POST / 2, hy: h / 2, hz: POST / 2, yaw: F.yaw() },
    navKind: null, los: 'block', cover: false,
    look: { piece: 'post', recipe, material: 'timber', w: POST, d: POST, h, color, chip: color },
  })
}

// (F7b, DESIGN §4.2.4's piece table) A parapet: a thin wall 0.7" tall on a
// deck's edge, navKind null (it stands in the ledge band that already stops
// movement), los 'obscure', its cover band 1.5" deep behind it rastered at its
// base level, `base` the deck's y, hp 3, no rubble when it breaks. Not built
// yet: each recipe below notes where its parapets go.

// ── Recipes ─────────────────────────────────────────────────────────────────
// Each returns its gates in chunk order (each stair's low end, GATE_OUT past
// its foot, then each ladder's foot), on the table: { x, z, by }.

// A long earth walk, 8 × 4.5", 2" high, with a 4"-long stair continuing it at
// one end (drawn) and a scaling ladder on the front face (drawn along it).
// 12 × 6.75" all told: the stair's end x = ±6, the deck from z = −1.125
// (its front face) to 3.375, the ladder's foot at z = −3.375.
// (F7b: four parapets along the front.)
function rampart(T, F, rng) {
  const color = pick(EARTH, rng)
  const end = rng() < 0.5 ? 1 : -1
  const off = rr(rng, -1.5, 1.5)
  const wood = pick(WOOD, rng)
  const h = 2, dz = 1.125, dx = -end * 2
  const d = deck(T, F, { lx: dx, lz: dz, w: 8, d: 4.5, h, material: 'earth', color, recipe: 'rampart' })
  // (rising toward the deck: up its own +x, the recipe's −x when it stands
  // at the +x end)
  stair(T, F, { lx: end * 4, lz: dz, ly: end > 0 ? Math.PI : 0, len: 4, w: 4.5, h, material: 'earth', color, recipe: 'rampart' })
  const lx = dx + off
  ladder(T, F, { lx, lz: dz - 2.25, ly: 0, h, color: wood, recipe: 'rampart', foot: [lx, dz - 2.25 - LADDER_OUT], top: [lx, dz], on: d.id })
  return [{ ...F.p(end * (6 + GATE_OUT), dz), by: 'stair' }, { ...F.p(lx, dz - 2.25 - LADDER_OUT), by: 'ladder' }]
}

// A square stone platform, 5 × 5", 2" high, a 4.5"-wide stair 4" long at the
// back and a ladder on the front. 5 × 11.25": the deck from z = −3.375 to
// 1.625, the stair on to 5.625, the ladder's foot at −5.625.
// (F7b: six parapets, front and sides.)
function bastion(T, F, rng) {
  const color = pick(DECK_STONE, rng)
  const wood = pick(WOOD, rng)
  const h = 2, dz = -0.875
  const d = deck(T, F, { lx: 0, lz: dz, w: 5, d: 5, h, material: 'stone', color, recipe: 'bastion' })
  // (rising toward the deck: up its own +x, the recipe's −z)
  stair(T, F, { lx: 0, lz: 3.625, ly: Math.PI / 2, len: 4, w: 4.5, h, material: 'stone', color, recipe: 'bastion' })
  ladder(T, F, { lx: 0, lz: -3.375, ly: 0, h, color: wood, recipe: 'bastion', foot: [0, -3.375 - LADDER_OUT], top: [0, dz], on: d.id })
  return [{ ...F.p(0, 5.625 + GATE_OUT), by: 'stair' }, { ...F.p(0, -3.375 - LADDER_OUT), by: 'ladder' }]
}

// A tall stone tower, 4.5 × 4.5", 3" high, reached by ladders front and
// back. 4.5 × 9": the ladders' feet at z = ∓4.5. Both ladders' tops are the
// deck's centre (its centreline, at either ladder): a 4.5" deck admits a
// CLIMB_R disc only near its middle.
// (F7b: eight parapets, all round.)
function watchtower(T, F, rng) {
  const color = pick(DECK_STONE, rng)
  const wood = pick(WOOD, rng)
  const h = 3
  const d = deck(T, F, { lx: 0, lz: 0, w: 4.5, d: 4.5, h, material: 'stone', color, recipe: 'watchtower' })
  ladder(T, F, { lx: 0, lz: -2.25, ly: 0, h, color: wood, recipe: 'watchtower', foot: [0, -2.25 - LADDER_OUT], top: [0, 0], on: d.id })
  ladder(T, F, { lx: 0, lz: 2.25, ly: Math.PI, h, color: wood, recipe: 'watchtower', foot: [0, 2.25 + LADDER_OUT], top: [0, 0], on: d.id })
  return [{ ...F.p(0, -2.25 - LADDER_OUT), by: 'ladder' }, { ...F.p(0, 2.25 + LADDER_OUT), by: 'ladder' }]
}

// A timber deck, 4.5 × 4.5", 2" high, on four posts, reached by one ladder.
// 4.5 × 6.75": the deck from z = −1.125 to 3.375, the ladder's foot at
// −3.375. The posts are added first, so the deck can list them (F7c: it
// falls once enough of them are down).
function platform(T, F, rng) {
  const color = pick(TIMBER, rng)
  const wood = pick(WOOD, rng)
  const h = 2, dz = 1.125, k = 2.25 - POST / 2
  const supports = [[-k, dz - k], [k, dz - k], [k, dz + k], [-k, dz + k]].map(([x, z]) => post(T, F, x, z, h, color, 'platform').id)
  const d = deck(T, F, { lx: 0, lz: dz, w: 4.5, d: 4.5, h, material: 'timber', color, recipe: 'platform', supports })
  ladder(T, F, { lx: 0, lz: dz - 2.25, ly: 0, h, color: wood, recipe: 'platform', foot: [0, dz - 2.25 - LADDER_OUT], top: [0, dz], on: d.id })
  return [{ ...F.p(0, dz - 2.25 - LADDER_OUT), by: 'ladder' }]
}

// The keep, round the centre objective (its top holds it): a stone deck
// 6 × 6", 2.5" high, and two 4.5"-wide stairs 5" long on opposite sides,
// along its own x, so (the keep turned at most 0.2 off the table's long
// axis: CENTRES.keep) they face the two zones. 16 × 6". The keep is its own
// point mirror, exactly: the second stair is the first's negation.
// (F7b: ten parapets on the other sides.)
function keep(T, F, rng) {
  const color = pick(DECK_STONE, rng)
  const h = 2.5, len = h / STAIR_SLOPE
  deck(T, F, { lx: 0, lz: 0, w: 6, d: 6, h, material: 'stone', color, recipe: 'keep' })
  const at = 3 + len / 2
  stair(T, F, { lx: -at, lz: 0, ly: 0, len, w: 4.5, h, material: 'stone', color, recipe: 'keep' })
  stair(T, F, { lx: at, lz: 0, ly: Math.PI, len, w: 4.5, h, material: 'stone', color, recipe: 'keep' })
  return [{ ...F.p(-(3 + len + GATE_OUT), 0), by: 'stair' }, { ...F.p(3 + len + GATE_OUT, 0), by: 'stair' }]
}

export const FORTS = deepFreeze(Object.assign(Object.create(null), { rampart, bastion, watchtower, platform, keep }))
// the fortifications a set may scatter in mirrored pairs (fortKinds); the
// keep stands only at the centre
export const FORT_KINDS = Object.freeze(['rampart', 'bastion', 'watchtower', 'platform'])

// The frame a fortification is built in: `mirror` builds the point mirror of
// the copy built in `frame`, exactly (see above).
function fortFrame(frame, mirror) {
  const c = cos(frame.yaw), s = sin(frame.yaw)
  if (!mirror) {
    return {
      p: (lx, lz) => ({ x: frame.x + c * lx + s * lz, z: frame.z - s * lx + c * lz }),
      yaw: (ly = 0) => frame.yaw + ly,
    }
  }
  return {
    p: (lx, lz) => ({ x: -(frame.x + c * lx + s * lz), z: -(frame.z - s * lx + c * lz) }),
    yaw: (ly = 0) => frame.yaw + ly + Math.PI,
  }
}

// Build fortification `name` in `frame` from its own seed (or, with
// `mirror`, the point mirror of that copy); returns its gates.
export function buildFort(T, name, frame, seed, mirror = false) {
  return FORTS[name](T, fortFrame(frame, mirror), mulberry32(seed))
}

// The gates fortification `name` would have, built in `frame` from `seed`:
// a dry build into a scratch terrain. A recipe draws only from its own
// stream, so this costs the board's stream nothing. (The mirror copy's are
// these, negated: the build is exact.)
export function gatesOf(name, frame, seed) {
  let n = 0
  return buildFort({ add: (def) => ({ ...def, id: ++n }) }, name, frame, seed)
}

// Each fortification's footprint radius (DESIGN §4.2.4's recipe table): the
// farthest any of its chunks' corners or its ladders' feet reach from its
// frame's origin, plus 0.25", to the nearest tenth (the rampart reaches
// 6.884", and 6.884 + 0.25 is 7.134: the table's 7.1). A set's fortKinds may
// not give one a smaller radius (checkSet), and the works and the keep use
// these. sim/data-check.mjs holds each to its recipe's reach (reachOf) on
// seeds 1-500: measuring that here, as the module loads, cost 120-200 ms
// on every page and process, so the check is data-check's row instead.
export const FOOTPRINT = deepFreeze(Object.assign(Object.create(null), { rampart: 7.1, bastion: 6.3, watchtower: 4.8, platform: 4.3, keep: 8.6 }))

// How far fortification `name` reaches, built at the origin from each of
// `seeds` (a list): `r` over its chunks' corners and its links' feet (what
// FOOTPRINT is made from), `gate` over its gates (which lie inside it too).
export function reachOf(name, seeds) {
  let r = 0, gate = 0
  for (const seed of seeds) {
    const defs = []
    const T = { add: (def) => (defs.push(def), { ...def, id: defs.length }) }
    for (const g of buildFort(T, name, { x: 0, z: 0, yaw: 0 }, seed)) gate = Math.max(gate, hypot(g.x, g.z))
    for (const d of defs) {
      for (const [x, z] of corners(d.shape)) r = Math.max(r, hypot(x, z))
      if (d.link) r = Math.max(r, hypot(d.link.foot.x, d.link.foot.z))
    }
  }
  return { r, gate }
}

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
      const x = cos(ang) * 4.2, z = sin(ang) * 4.2
      const s = (rng() * 1e9) | 0
      build(T, 'rocks', { x, z, yaw: ang }, s)
      build(T, 'rocks', { x: -x, z: -z, yaw: ang + Math.PI }, s)
      placed.push({ x, z, r: 1.8 }, { x: -x, z: -z, r: 1.8 })
    }
  },
  // (F7a) the keep, the objective on its top, turned at most 0.2 off the
  // table's long axis so its stairs face the two zones: its yaw, then its
  // seed. (Its gates stand inside its footprint, which the rest keeps clear
  // of; it has no aprons.)
  keep(T, rng, placed) {
    buildFort(T, 'keep', { x: 0, z: 0, yaw: (rng() - 0.5) * 0.4 }, (rng() * 1e9) | 0)
    placed.push({ x: 0, z: 0, r: FOOTPRINT.keep, fort: 'keep' })
  },
}))

// ── Scattering a set ────────────────────────────────────────────────────────
// Lay terrain set S (sets.js) out over T's table from the board seed: one
// draw for the centre rule (its piece draws its own placement), one for how
// many pairs, then attempt after attempt: a weighted draw of the feature,
// its place, and if every spacing rule passes, its turn and its own seed,
// built twice, the copy turned half round the centre. Returns the
// footprints placed. Every draw comes from the one stream, in this order.
//
// (F7a) A set with `works` gives each seat its own rampart after the centre
// (works, below), and one with `forts` scatters fortifications in mirrored
// pairs before the features (forts, below), so the big pieces get the space;
// the features then keep clear of their footprints and their gates' aprons
// alike. (F8b's `open`, and `fortified`) A set with `scale: 'area'` scales
// its pair counts and attempts with the table's area. Each branch is reached
// only for a set that has its field, so classic's draws are untouched.
export function scatter(T, S, seed, objectives, deployDepth) {
  const rng = mulberry32(seed)
  const { W, H } = T
  const placed = []

  // The middle of the table: something wrapped around the centre objective.
  const centre = rng()
  const middle = S.centre.find(([, below]) => centre < below)
  if (middle) CENTRES[middle[0]](T, rng, placed)

  if (S.works) works(T, S, rng, placed, deployDepth)
  if (S.forts) forts(T, S, rng, placed, objectives, deployDepth)

  const KINDS = S.kinds
  const total = KINDS.reduce((s, k) => s + k[2], 0)
  let want, attempts
  if (S.scale === 'area') {
    const s = areaScale(T)
    want = Math.round(S.pairs[0] * s) + Math.floor(rng() * Math.round(S.pairs[1] * s))
    attempts = Math.round(S.attempts * s)
  } else {
    want = S.pairs[0] + Math.floor(rng() * S.pairs[1])
    attempts = S.attempts
  }
  let pairs = 0
  for (let attempt = 0; attempt < attempts && pairs < want; attempt++) {
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

// (F8b's `open`, built with F7a) A table's area over classic's 40 × 28.
export const areaScale = (T) => (T.W * T.H) / (40 * 28)

// (F7a) An apron is a circle APRON round each gate: the room a unit needs to
// reach the stair or ladder. It must lie on the table and clear of every
// footprint placed so far (and every apron: they are placed too), and once
// its fortification stands it is placed like a footprint, so nothing later
// stands in it.
export const APRON = 2.2
const apronFits = (T, g, placed) => Math.abs(g.x) + APRON <= T.W / 2 && Math.abs(g.z) + APRON <= T.H / 2 &&
  placed.every((p) => hypot(p.x - g.x, p.z - g.z) >= p.r + APRON)
// a fortification's gates and its mirror copy's (exact negations: buildFort)
const bothGates = (gates) => [...gates, ...gates.map((g) => ({ x: -g.x, z: -g.z, by: g.by }))]
const aprons = (gates) => gates.map((g) => ({ x: g.x, z: g.z, r: APRON, apron: g.by }))

// The works: each seat's own rampart along the front of its deployment zone,
// its deck's front face on the zone's edge and the deck inside the zone, its
// ladder's foot 2.25" out into no-man's land (the rampart's front face is
// 1.125" in front of its frame's origin: recipes' rampart). Seat 0's frame is
// (−W/2 + deploy − 1.125, z, −π/2), its front facing +x; seat 1's rampart is
// its point mirror. Up to 8 tries, each drawing z and then the seed; a try
// stands when both copies' aprons fit, and pushes both footprints and every
// apron. (The works ignore the objectives: the zone's edge is a seat's own.)
const WORKS_TRIES = 8
const RAMPART_FACE = 1.125
function works(T, S, rng, placed, deployDepth) {
  const { W, H } = T
  const r = FOOTPRINT.rampart
  const zr = H / 2 - r - S.margin
  for (let tries = 0; tries < WORKS_TRIES; tries++) {
    const z = rr(rng, -zr, zr)
    const seed = (rng() * 1e9) | 0
    const frame = { x: -W / 2 + deployDepth - RAMPART_FACE, z, yaw: -Math.PI / 2 }
    const gates = bothGates(gatesOf('rampart', frame, seed))
    if (!gates.every((g) => apronFits(T, g, placed))) continue
    buildFort(T, 'rampart', frame, seed)
    buildFort(T, 'rampart', frame, seed, true)
    placed.push({ x: frame.x, z, r, fort: 'rampart', works: 0 }, { x: -frame.x, z: -z, r, fort: 'rampart', works: 1 }, ...aprons(gates))
    return
  }
}

// The fort phase: `want` mirrored pairs of fortKinds in at most `attempts`
// tries, each try a weighted draw of the kind, then x and z, then the tests
// (inside the table by r + margin, which the draw's range makes so; |x| + r
// clear of both zones by deployMargin; clear of its own mirror by selfGap; of
// every objective by r + fortObjectiveGap; of every footprint and apron
// placed, and their mirrors, by both radii plus fortGap), then the yaw (a
// `facing` kind's front toward the other side's zone, ±0.3; any other's
// anywhere), then the seed, and both copies' aprons must fit. The copy is the
// point mirror, so each seat's facing pieces face the other seat.
function forts(T, S, rng, placed, objectives, deployDepth) {
  const { W, H } = T
  const s = S.scale === 'area' ? areaScale(T) : 1
  const want = Math.round(S.forts[0] * s) + Math.floor(rng() * Math.round(S.forts[1] * s))
  const attempts = Math.round(S.fortAttempts * s)
  const KINDS = S.fortKinds
  const total = KINDS.reduce((n, k) => n + k[2], 0)
  const gap = S.fortGap
  let pairs = 0
  for (let attempt = 0; attempt < attempts && pairs < want; attempt++) {
    let w = rng() * total, kind = KINDS[0]
    for (const k of KINDS) if ((w -= k[2]) <= 0) { kind = k; break }
    const [name, r] = kind
    const x = rr(rng, -W / 2 + r + S.margin, W / 2 - r - S.margin)
    const z = rr(rng, -H / 2 + r + S.margin, H / 2 - r - S.margin)
    if (Math.abs(x) + r > W / 2 - deployDepth - S.deployMargin) continue
    if (hypot(x, z) < r + S.selfGap) continue
    if (objectives.some((o) => hypot(o.x - x, o.z - z) < r + S.fortObjectiveGap)) continue
    if (placed.some((p) => hypot(p.x - x, p.z - z) < p.r + r + gap || hypot(p.x + x, p.z + z) < p.r + r + gap)) continue
    const yaw = S.facing?.includes(name) ? (x < 0 ? -Math.PI / 2 : Math.PI / 2) + (rng() - 0.5) * 0.6 : rng() * Math.PI * 2
    const seed = (rng() * 1e9) | 0
    const frame = { x, z, yaw }
    const gates = bothGates(gatesOf(name, frame, seed))
    if (!gates.every((g) => apronFits(T, g, placed))) continue
    buildFort(T, name, frame, seed)
    buildFort(T, name, frame, seed, true)
    placed.push({ x, z, r, fort: name }, { x: -x, z: -z, r, fort: name }, ...aprons(gates))
    pairs++
  }
}

// What a set must hold for scatter to read it (sets.js runs this on every set
// at load, so a bad name fails on every board, not only on the boards whose
// draws land on it). Throws, naming the set and the field.
const SET_FIELDS = Object.freeze(['centre', 'kinds', 'pairs', 'attempts', 'mirror', 'margin', 'selfGap', 'deployMargin', 'bigNotInDeploy', 'notInDeploy', 'objectiveGap', 'gap'])
// (F7a, F8b) the fields a set may have besides: the works, the fort phase's
// (all of them or none, `facing` with them) and the area scale
const FORT_FIELDS = Object.freeze(['forts', 'fortAttempts', 'fortGap', 'fortObjectiveGap', 'fortKinds'])
const OPTIONAL_FIELDS = Object.freeze(['works', ...FORT_FIELDS, 'facing', 'scale'])
const MIRRORS = Object.freeze(['point']) // the only symmetry scatter knows
const SCALES = Object.freeze(['area']) // and the only scaling
export function checkSet(name, S) {
  const bad = (why) => {
    throw new Error(`terrain set "${name}": ${why}`)
  }
  const num = (v) => typeof v === 'number' && Number.isFinite(v)
  const int = (v) => Number.isInteger(v) && v >= 0
  if (!S || typeof S !== 'object') bad('is not a table')
  for (const k of Object.keys(S)) if (!SET_FIELDS.includes(k) && !OPTIONAL_FIELDS.includes(k)) bad(`unknown field "${k}"`)
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
  // (F7a) the works: a rampart per seat, or none
  if ('works' in S && S.works !== 0 && S.works !== 1) bad(`works ${S.works} must be 0 or 1 (a rampart per seat, or none)`)
  // (F7a) the fort phase
  const fortFields = FORT_FIELDS.filter((k) => k in S)
  if (fortFields.length && fortFields.length < FORT_FIELDS.length) bad(`the fort phase needs ${FORT_FIELDS.join(', ')}: no "${FORT_FIELDS.find((k) => !(k in S))}"`)
  if (fortFields.length) {
    if (!Array.isArray(S.forts) || S.forts.length !== 2 || !S.forts.every(int)) bad('forts must be two whole numbers, 0 or more (pairs, and a draw below the second more)')
    if (!int(S.fortAttempts)) bad(`fortAttempts ${S.fortAttempts} must be a whole number, 0 or more`)
    for (const k of ['fortGap', 'fortObjectiveGap']) if (!num(S[k]) || S[k] < 0) bad(`${k} ${S[k]} must be a finite number, 0 or more`)
    if (!Array.isArray(S.fortKinds) || !S.fortKinds.length) bad('fortKinds must list at least one fortification')
    S.fortKinds.forEach((k, i) => {
      if (!Array.isArray(k) || k.length !== 3) bad(`fortKinds[${i}] must be [fortification, radius, weight]`)
      if (!FORT_KINDS.includes(k[0])) bad(`fortKinds[${i}]: no fortification "${k[0]}" to scatter (there are ${FORT_KINDS.join(', ')})`)
      // (its footprint, or more: a smaller one would let it stand in another's)
      if (!num(k[1]) || !(k[1] >= FOOTPRINT[k[0]])) bad(`fortKinds[${i}] (${k[0]}): radius ${k[1]} must be a number, at least its footprint ${FOOTPRINT[k[0]]}`)
      if (!num(k[2]) || k[2] <= 0) bad(`fortKinds[${i}] (${k[0]}): weight ${k[2]} must be a number above 0`)
    })
  }
  if ('facing' in S) {
    if (!fortFields.length) bad('facing names fortKinds, and the set has none')
    if (!Array.isArray(S.facing)) bad('facing must be a list of fortifications')
    for (const f of S.facing) if (!S.fortKinds.some((k) => k[0] === f)) bad(`facing: no fortification "${f}" in fortKinds`)
  }
  if ('scale' in S && !SCALES.includes(S.scale)) bad(`scale "${S.scale}" is not one scatter knows (${SCALES.join(', ')})`)
  return S
}
