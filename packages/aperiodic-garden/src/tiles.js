// The deck, and the mountain you start from.
//
// A tile is eight biomes, one per hat slot. Slots are numbered by HAT_KITES, and
// they travel with the orientation — slot 3 is slot 3 whichever of the twelve
// ways round the hat is lying — so a tile's pattern never has to be rotated.
//
// The slot graph (computed, not chosen: it falls out of the hat's kite structure)
//
//         2 ── 3 ─┐
//                 ├─ 0 ── 1 ── 6 ─┐
//         4 ── 5 ─┴───────┴─ 7 ───┘
//
// exactly:  0:{1,3,5,7}  1:{0,6}  2:{3}  3:{0,2}  4:{5}  5:{0,4,7}  6:{1,7}  7:{0,5,6}
//
// and the number of tile-boundary edges each slot owns:
//
//   slot     0  1  2  3  4  5  6  7
//   edges    0  2  3  2  3  1  2  1        (14 in total — the hat's 14 unit sides)
//
// Rivers fall straight out of that. A river is a connected set of water slots;
// the number of open river mouths it presents to the world is just the sum of
// those edge counts. So {0,5,7} is a river running clean through (two mouths),
// {5} is a spring (one), {0,3,5} forks into three, and {2} — the leaf kite with
// three sides on the boundary — is a delta all by itself. The deck below is
// nothing more than a weighted list of those sets.

import { HAT_KITES, KEY, neighbourKeys } from './hat.js'
import { WATER, PLAINS, FOREST, HILLS, VILLAGE, PEAK } from './board.js'

/** Which slots each slot touches inside the tile. Derived at load from the kite
 *  lattice rather than written down, so it cannot drift from the geometry. */
export const SLOT_ADJ = []
{
  const index = new Map(HAT_KITES.map(([a, b, k], i) => [KEY(a, b, k), i]))
  for (let i = 0; i < 8; i++) {
    const [a, b, k] = HAT_KITES[i]
    const nb = neighbourKeys(a, b, k)
    const adj = []
    for (let s = 0; s < 4; s++) {
      const j = index.get(nb[s])
      if (j !== undefined) adj.push(j)
    }
    SLOT_ADJ.push(adj)
  }
}

// --- the river vocabulary ---------------------------------------------------
//
// A river leaves a tile through a *port*: one of the six slots that owns a long
// side on the tile's boundary. Slots 0 and 3 own none, so they can carry water
// but never let it out — which is exactly what a hub and a backwater are.
//
//   port slot    1      2        4        5      6        7
//   water laid  1,0   2,3,0    4,5,0    5,0    6,1,0    7,0
//
// The water for a tile is the union of those paths, so every port is joined to
// the hub and therefore to every other port: one connected river, whatever the
// combination. Ports are the only thing the deck picks; the water follows.

// Ports 1, 5 and 7 sit one step from the hub; 2, 4 and 6 sit two, and so lay
// down an extra kite of water each. Favouring the short ones keeps a three-mouth
// fork at four kites of water instead of seven — a river, not a flood.
export const PORTS = [
  [1, 3],
  [5, 3],
  [7, 3],
  [2, 1],
  [4, 1],
  [6, 1],
]

/** Shortest path through the slot graph from each port to the hub. */
export const PORT_PATH = {
  1: [1, 0],
  2: [2, 3, 0],
  4: [4, 5, 0],
  5: [5, 0],
  6: [6, 1, 0],
  7: [7, 0],
}

/** Water with no way out at all: a tarn inside one tile. */
const PONDS = [[3], [0, 3], [2, 3]]

/** How many mouths a river tile has. Two is a river; one ends it; three forks. */
const PORT_COUNT_W = [
  [2, 52],
  [1, 15],
  [3, 20],
  [4, 4],
  [0, 6], // a pond, sealed inside its own tile
]
const PORT_COUNT_TOTAL = PORT_COUNT_W.reduce((s, [, w]) => s + w, 0)

const KIND = ['pond', 'spring', 'run', 'fork', 'delta']

function riverPattern(rnd) {
  const n = pickWeighted(PORT_COUNT_W, ([, w]) => w, PORT_COUNT_TOTAL, rnd)[0]
  if (n === 0) {
    const p = PONDS[Math.floor(rnd() * PONDS.length)]
    return { water: p, kind: 'pond', mouths: 0 }
  }
  const pool = PORTS.map(([p, w]) => ({ p, w }))
  const chosen = []
  for (let i = 0; i < n && pool.length; i++) {
    let total = 0
    for (const q of pool) total += q.w
    let r = rnd() * total
    let idx = pool.length - 1
    for (let j = 0; j < pool.length; j++) {
      r -= pool[j].w
      if (r <= 0) {
        idx = j
        break
      }
    }
    chosen.push(pool.splice(idx, 1)[0].p)
  }
  const water = new Set()
  for (const p of chosen) for (const slot of PORT_PATH[p]) water.add(slot)
  return { water: [...water], kind: KIND[n], mouths: n }
}

/** Land biomes and how often they turn up as a tile's dominant cover. */
const LAND_W = [
  [PLAINS, 36],
  [FOREST, 32],
  [HILLS, 15],
  [VILLAGE, 10],
  [PEAK, 5],
]

/** Deterministic RNG so a seeded garden replays exactly. */
export function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pickWeighted(list, weightOf, total, rnd) {
  let r = rnd() * total
  for (const item of list) {
    r -= weightOf(item)
    if (r <= 0) return item
  }
  return list[list.length - 1]
}

function pickLand(rnd, allowRare = true) {
  const pool = allowRare ? LAND_W : LAND_W.filter(([b]) => b !== VILLAGE && b !== PEAK)
  const total = pool.reduce((s, [, w]) => s + w, 0)
  return pickWeighted(pool, ([, w]) => w, total, rnd)[0]
}

/**
 * Paint the land slots. A tile is either all one cover — the ones worth saving,
 * because they extend a region by eight at a stroke — or two covers split along
 * a grown blob, which is how you get the ragged edges that make regions
 * interesting to close.
 */
function paintLand(slots, rnd) {
  const out = new Map()
  if (slots.length === 0) return out
  const single = rnd() < 0.3
  const a = pickLand(rnd, !single)
  if (single || slots.length <= 2) {
    for (const s of slots) out.set(s, a)
    return out
  }
  let b = pickLand(rnd)
  let guard = 0
  while (b === a && guard++ < 8) b = pickLand(rnd)

  // Grow a blob of `a` from a random slot, staying inside the land slots.
  const pool = new Set(slots)
  const start = slots[Math.floor(rnd() * slots.length)]
  const blob = new Set([start])
  // Always at least two of each, so a two-cover tile really shows two covers.
  const target = 2 + Math.floor(rnd() * Math.max(1, slots.length - 3))
  let guard2 = 0
  while (blob.size < target && guard2++ < 40) {
    const frontier = []
    for (const s of blob) for (const n of SLOT_ADJ[s]) if (pool.has(n) && !blob.has(n)) frontier.push(n)
    if (frontier.length === 0) break
    blob.add(frontier[Math.floor(rnd() * frontier.length)])
  }
  // Hamlets and crags stay small — a whole tile of either reads as a mistake.
  const cap = (x) => (x === VILLAGE || x === PEAK ? 3 : 8)
  for (const s of slots) out.set(s, blob.has(s) ? a : b)
  for (const rare of [VILLAGE, PEAK]) {
    const cells = slots.filter((s) => out.get(s) === rare)
    if (cells.length > cap(rare)) {
      const keep = new Set(cells.slice(0, cap(rare)))
      for (const s of cells) if (!keep.has(s)) out.set(s, PLAINS)
    }
  }
  return out
}

/** One tile: eight biomes in slot order, plus a label for the HUD. */
export function makeTile(rnd, riverChance = 0.42) {
  let water = []
  let kind = 'land'
  let mouths = 0
  if (rnd() < riverChance) {
    const r = riverPattern(rnd)
    water = r.water
    kind = r.kind
    mouths = r.mouths
  }
  const waterSet = new Set(water)
  const land = []
  for (let i = 0; i < 8; i++) if (!waterSet.has(i)) land.push(i)
  const paint = paintLand(land, rnd)
  const biomes = new Array(8)
  for (let i = 0; i < 8; i++) biomes[i] = waterSet.has(i) ? WATER : (paint.get(i) ?? PLAINS)
  return { biomes, kind, mouths }
}

/**
 * A tile built to fit one specific gap — the escape hatch that makes a dead end
 * impossible. `want` comes from Board.demand(): true where the garden insists on
 * water, false where it insists on land, null where it does not care.
 */
export function fitTile(want, rnd) {
  const wet = new Set()
  for (let i = 0; i < 8; i++) if (want[i] === true) wet.add(i)
  // Run each demanded mouth back to the hub where the garden allows it, so a
  // fitted tile still looks like a river rather than a puddle bolted to an edge.
  for (const p of [...wet]) {
    const path = PORT_PATH[p]
    if (!path) continue
    if (path.every((slot) => want[slot] !== false)) for (const slot of path) wet.add(slot)
  }
  const biomes = new Array(8)
  const land = []
  for (let i = 0; i < 8; i++) {
    if (wet.has(i)) biomes[i] = WATER
    else land.push(i)
  }
  const paint = paintLand(land, rnd)
  for (const i of land) biomes[i] = paint.get(i) ?? PLAINS
  return { biomes, kind: 'fitted', mouths: 0 }
}

// --- the opening mountain ---------------------------------------------------

// Three hats pinwheeled 120° about the hexagon centre at lattice (2,2). They
// cover that hexagon's six kites exactly — three tiles, two summit wedges each —
// so the massif has a real peak rather than a flat top, and the seam pattern
// radiates from it. Verified compact: no other conjoined triple packs tighter.
export const SEED_TILES = [
  { orient: 0, ta: 0, tb: 0 },
  { orient: 2, ta: 6, tb: 0 },
  { orient: 4, ta: 0, tb: 6 },
]
export const SUMMIT = [2, 2] // lattice coordinates of the peak

// Distances of the four concentric shells from the summit, for reference:
// 1.250 (6 summit kites) · 2.462 (12 shoulder) · 3.683 (3 flank) · 4.589 (3 foot).
const SHELL_SUMMIT = 1.9
const SHELL_SHOULDER = 3.0
const SHELL_FLANK = 4.2

/**
 * Biomes for the opening massif, given a kite's distance from the summit and
 * which tile/slot it belongs to. Tile 0 carries the river: slot 7 is a tarn just
 * under the cap, slot 0 the gorge below it, slot 3 the mouth where it leaves the
 * mountain — two adjoining sides of one kite, so it reads as a single outflow
 * that the next river tile has to pick up.
 */
export const SEED_RIVER = new Set([7, 0, 3]) // slots, tile 0 only

export function seedBiome(tileIndex, slot, dist) {
  if (tileIndex === 0 && SEED_RIVER.has(slot)) return WATER
  // Cap, alpine slope, treeline, pasture. How much of the cap is actually white
  // is decided by height rather than here, so the snowline crosses the faces as
  // a curve instead of stopping at a kite boundary.
  if (dist < SHELL_SUMMIT) return PEAK
  if (dist < SHELL_SHOULDER) return PEAK
  if (dist < SHELL_FLANK) return FOREST
  // The foot: one hamlet, the rest meadow.
  return tileIndex === 1 ? VILLAGE : PLAINS
}

/** Elevation for a kite: a cone around the summit plus the biome's own lift. */
export const BIOME_LIFT = [-0.1, 0.0, 0.14, 0.34, 0.06, 0.5]

export function seedElevation(dist) {
  const u = Math.min(1, dist / 6.5)
  return 3.6 * Math.pow(1 - u, 1.25)
}
