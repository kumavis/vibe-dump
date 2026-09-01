// The deck, and the mountain you start from.
//
// A tile is eight biomes — one per hat slot — plus a set of river ports. Slots
// are numbered by HAT_KITES and travel with the orientation, so slot 3 is slot 3
// whichever of the twelve ways round the hat is lying and a tile's pattern never
// has to be rotated.
//
// The slot graph (computed, not chosen: it falls out of the hat's kite structure)
//
//         2 ── 3 ─┐
//                 ├─ 0 ── 1 ── 6 ─┐
//         4 ── 5 ─┴───────┴─ 7 ───┘
//
// exactly:  0:{1,3,5,7}  1:{0,6}  2:{3}  3:{0,2}  4:{5}  5:{0,4,7}  6:{1,7}  7:{0,5,6}
//
// A river is a line, not a cover: it enters through one or more of the six port
// slots (1, 2, 4, 5, 6, 7 — the ones owning a long side on the tile's outline)
// and every branch runs to the hub at slot 0, where they meet. So a two-port
// tile is a run or a bend, three is a fork, one is a spring that rises here and
// leaves once. Nothing else about a tile is constrained: biomes may meet however
// they like, and only cost you the region when they disagree.

import {
  HAT_KITES,
  KEY,
  KEY_A,
  KEY_B,
  KEY_K,
  ORIENT_KITES,
  PORT_SIDE,
  PORT_SLOTS,
  cart,
  cellAt,
  kiteCentre,
  longEdgeId,
  longEdgeMid,
  neighbourKeys,
  placementKeys,
  worldSide,
} from './hat.js'
import { PLAINS, FOREST, HILLS, VILLAGE, SCREE } from './board.js'

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

/**
 * How many mouths a stream tile has. Never one *by accident*: a single-mouth
 * tile laid onto an open mouth caps that river, and a capped river can never be
 * carried any further — which is how a garden ends up with the water stranded
 * three tiles short of the mill and no legal way to finish. Every ordinary
 * stream tile carries the water through.
 *
 * A river does have to be allowed to end somewhere, though, or the garden fills
 * up with mouths nobody can ever satisfy. It ends in a **lake**: a one-mouth
 * tile with a pool on it, dealt on purpose and drawn so you can see what it is.
 * That is the only cap in the deck.
 */
const PORT_COUNT_W = [
  [2, 58],
  [3, 28],
  [4, 14],
]
const PORT_COUNT_TOTAL = PORT_COUNT_W.reduce((s, [, w]) => s + w, 0)
const KIND = [null, 'lake', 'run', 'fork', 'delta']

/** How often a river tile is a lake rather than a run. */
const LAKE_CHANCE = 0.11

/** Land covers and how often they turn up as a tile's dominant one. */
const LAND_W = [
  [PLAINS, 36],
  [FOREST, 32],
  [HILLS, 16],
  [VILLAGE, 10],
  [SCREE, 6],
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
  const pool = allowRare ? LAND_W : LAND_W.filter(([b]) => b !== VILLAGE && b !== SCREE)
  const total = pool.reduce((s, [, w]) => s + w, 0)
  return pickWeighted(pool, ([, w]) => w, total, rnd)[0]
}

/**
 * Paint the eight slots. A tile is either all one cover — the ones worth saving,
 * because they extend a region by eight at a stroke — or two covers split along
 * a grown blob, which is how you get the ragged edges that make regions
 * interesting to close.
 */
function paintLand(rnd) {
  const out = new Array(8)
  const single = rnd() < 0.28
  const a = pickLand(rnd, !single)
  if (single) {
    out.fill(a)
    return out
  }
  let b = pickLand(rnd)
  let guard = 0
  while (b === a && guard++ < 8) b = pickLand(rnd)

  const start = Math.floor(rnd() * 8)
  const blob = new Set([start])
  const target = 2 + Math.floor(rnd() * 5)
  let guard2 = 0
  while (blob.size < target && guard2++ < 40) {
    const frontier = []
    for (const s of blob) for (const n of SLOT_ADJ[s]) if (!blob.has(n)) frontier.push(n)
    if (frontier.length === 0) break
    blob.add(frontier[Math.floor(rnd() * frontier.length)])
  }
  for (let i = 0; i < 8; i++) out[i] = blob.has(i) ? a : b
  // Hamlets and scree stay small — a whole tile of either reads as a mistake.
  for (const rare of [VILLAGE, SCREE]) {
    const cells = []
    for (let i = 0; i < 8; i++) if (out[i] === rare) cells.push(i)
    if (cells.length > 3) for (const i of cells.slice(3)) out[i] = PLAINS
  }
  return out
}

/** One tile: eight covers, a set of river ports, and a label for the HUD. */
export function makeTile(rnd, riverChance = 0.42) {
  const ports = new Set()
  let kind = 'land'
  if (rnd() < riverChance) {
    const n = rnd() < LAKE_CHANCE ? 1 : pickWeighted(PORT_COUNT_W, ([, w]) => w, PORT_COUNT_TOTAL, rnd)[0]
    const pool = PORT_SLOTS.slice()
    for (let i = 0; i < n; i++) ports.add(...pool.splice(Math.floor(rnd() * pool.length), 1))
    kind = KIND[n]
  }
  return { biomes: paintLand(rnd), ports, kind, mouths: ports.size, lake: ports.size === 1 }
}

/** A pool for the water to end in, cut for one particular crossing. */
export function lakeTile(slot, rnd) {
  return { biomes: paintLand(rnd), ports: new Set([slot]), kind: 'lake', mouths: 1, lake: true }
}

/**
 * The water works: the one tile with no river of its own.
 *
 * Every other tile is a fixed shape and the puzzle is finding where that shape
 * fits. This one is `adaptive` — it takes whatever crossings the board demands
 * wherever you put it, and opens none of its own. Rule 1 is then satisfied by
 * construction at every spot, so the only thing that can refuse it is the
 * ground: it goes anywhere a hat goes at all, joins every stream it lands
 * against, and ends each of them tidily inside itself.
 *
 * That is deliberately the strongest thing in the game, which is why it costs
 * more than anything else in the workshop. It is the answer to the corner you
 * have painted yourself into — a pinch of ground surrounded by three different
 * mouths, where no dealt tile carries that particular set of crossings and none
 * ever will.
 */
export function waterworksTile(rnd) {
  const biomes = paintLand(rnd)
  // a stone yard through the middle of it, so it reads as built rather than grown
  for (const i of [0, ...SLOT_ADJ[0]]) biomes[i] = VILLAGE
  return { biomes, ports: new Set(), kind: 'waterworks', mouths: 0, adaptive: true }
}

// --- tiles that have to earn their place -------------------------------------

/**
 * A working camp: a tile that may only be laid where the cover it lives off
 * already surrounds it. A woodcutter needs woods; a shepherd needs grazing; a
 * quarry needs the stone it is cutting.
 *
 * `wants` is how many of the tile's own outward edges must meet that cover
 * across the seam. Meeting the condition pays — it is the one placement in the
 * game where *what is already there* decides where a tile may go, and it turns
 * a stretch of forest you have been growing into somewhere worth building.
 */
export const CAMPS = [
  { key: 'woodcutter', title: "woodcutter's camp", biome: FOREST, wants: 4, score: 180, tiles: 2 },
  { key: 'shepherd', title: "shepherd's fold", biome: PLAINS, wants: 5, score: 140, tiles: 2 },
  { key: 'quarry', title: 'quarry', biome: SCREE, wants: 2, score: 240, tiles: 3 },
  { key: 'vineyard', title: 'vineyard', biome: HILLS, wants: 3, score: 210, tiles: 2 },
]

/** One camp tile: the camp's own cover under it, and the demand it carries. */
export function campTile(camp) {
  const biomes = new Array(8).fill(camp.biome)
  // a clearing in the middle of it, so the camp reads as built rather than grown
  for (const i of [0, ...SLOT_ADJ[0]]) biomes[i] = VILLAGE
  return {
    biomes,
    ports: new Set(),
    kind: camp.key,
    mouths: 0,
    camp,
    demand: { biome: camp.biome, wants: camp.wants },
  }
}

/**
 * A tile cut to fit one specific gap: exactly the crossings the board demands
 * there, and no others. Every forced crossing is met and no new mouth is opened,
 * so it is always placeable — the escape hatch that makes a dead end impossible.
 */
export function fitTile(ports, rnd) {
  return { biomes: paintLand(rnd), ports: new Set(ports), kind: 'fitted', mouths: ports.size }
}

// --- the opening massif ------------------------------------------------------

// Three hats pinwheeled 120° about the hexagon centre at lattice (2,2). They
// cover that hexagon's six kites exactly — three tiles, two summit wedges each —
// so the peak has somewhere to stand and the seam pattern radiates from under
// it. Verified compact: no other conjoined triple packs tighter.
export const SEED_TILES = [
  { orient: 0, ta: 0, tb: 0 },
  { orient: 2, ta: 6, tb: 0 },
  { orient: 4, ta: 0, tb: 6 },
]
export const SUMMIT = [2, 2] // lattice coordinates of the peak

// Concentric shells of the massif, by distance from the summit. The kites come
// out at 1.250 (six, under the peak) · 2.462 (twelve) · 3.683 (three) · 4.589
// (three), so these thresholds cut cleanly between them.
const SHELL_SCREE = 3.0
const SHELL_HILLS = 3.0
const SHELL_TREES = 4.2

/**
 * The opening three tiles: flat ground like every other tile in the deck, laid
 * out as bare stone under the peak, then upland, then treeline, then pasture at
 * the foot. The mountain itself is not terrain — it is a feature standing on
 * this ground, which is why nothing here has a height.
 *
 * One stream leaves the massif: the port on tile 0 whose crossing lies furthest
 * from the summit, so the river runs off the mountain and away rather than back
 * into it.
 */
export function seedGarden() {
  const [sx, sz] = cart(SUMMIT[0], SUMMIT[1])
  const all = new Set()
  for (const t of SEED_TILES) for (const key of placementKeys(t.orient, t.ta, t.tb)) all.add(key)
  let headwater = null

  const tiles = SEED_TILES.map((t, ti) => {
    const cells = placementKeys(t.orient, t.ta, t.tb)
    const biomes = cells.map((key) => {
      const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
      const d = Math.hypot(x - sx, z - sz)
      if (d < SHELL_SCREE) return SCREE
      if (d < SHELL_HILLS) return HILLS
      if (d < SHELL_TREES) return FOREST
      return ti === 1 ? VILLAGE : PLAINS
    })

    const ports = new Set()
    if (ti === 0) {
      const flipped = t.orient >= 6
      let best = null
      let bestD = -1
      for (const slot of PORT_SLOTS) {
        const side = worldSide(PORT_SIDE[slot], flipped)
        const key = cells[slot]
        const a = KEY_A(key)
        const b = KEY_B(key)
        const k = KEY_K(key)
        if (all.has(neighbourKeys(a, b, k)[side])) continue // faces another seed tile
        const [mx, mz] = longEdgeMid(a, b, k, side)
        const d = Math.hypot(mx - sx, mz - sz)
        if (d > bestD) {
          bestD = d
          best = slot
        }
      }
      if (best !== null) {
        ports.add(best)
        const key = cells[best]
        const a = KEY_A(key)
        const b = KEY_B(key)
        const k = KEY_K(key)
        const side = worldSide(PORT_SIDE[best], flipped)
        const [mx, mz] = longEdgeMid(a, b, k, side)
        const len = Math.hypot(mx - sx, mz - sz) || 1
        headwater = { edge: longEdgeId(a, b, k, side), mid: [mx, mz], dir: [(mx - sx) / len, (mz - sz) / len] }
      }
    }

    return { orient: t.orient, ta: t.ta, tb: t.tb, tile: { biomes, ports, kind: 'massif', mouths: ports.size } }
  })

  return { tiles, headwater, summit: [sx, sz] }
}

// --- the places the river is meant to reach ---------------------------------

/**
 * A hat placement standing on its own near (tx, tz): no overlap with what is
 * already down, and not even touching it, so there is a real gap of open ground
 * to bridge. Anchors are tried across a couple of rings around the target so a
 * spot is found even when the exact cell there is awkward.
 */
export function siteNear(tx, tz, occupied, want = 1) {
  const [ca, cb, ck] = cellAt(tx, tz)
  const anchors = new Set([KEY(ca, cb, ck)])
  for (let ring = 0; ring < 2; ring++) {
    for (const key of [...anchors]) {
      for (const n of neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key))) anchors.add(n)
    }
  }
  const found = []
  for (const anchor of anchors) {
    const fa = KEY_A(anchor)
    const fb = KEY_B(anchor)
    const fk = KEY_K(anchor)
    for (let o = 0; o < 12; o++) {
      const base = ORIENT_KITES[o]
      for (let i = 0; i < 8; i++) {
        if (base[i][2] !== fk) continue
        const ta = fa - base[i][0]
        const tb = fb - base[i][1]
        const cells = placementKeys(o, ta, tb)
        let ok = true
        for (const key of cells) {
          if (occupied.has(key)) {
            ok = false
            break
          }
          for (const n of neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key))) {
            if (occupied.has(n)) {
              ok = false
              break
            }
          }
          if (!ok) break
        }
        if (!ok) continue
        let hx = 0
        let hz = 0
        for (const key of cells) {
          const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
          hx += x
          hz += z
        }
        hx /= 8
        hz /= 8
        found.push({ orient: o, ta, tb, cells, hub: [hx, hz], d: Math.hypot(hx - tx, hz - tz) })
      }
    }
  }
  found.sort((a, b) => a.d - b.d)
  return want === 1 ? (found[0] ?? null) : found.slice(0, want)
}

/**
 * Dress a site as a small town with two crossings: the leat, facing back the way
 * the water has to come, and a tailrace on the far side of the wheel.
 *
 * The tailrace is the point. A mill is somewhere a river passes *through* — the
 * water turns the wheel and carries on — and giving the town a single crossing
 * made it a plug: the errand ended with the stream stopped dead at a building,
 * which looks wrong and leaves nothing to build on. The tailrace is what the
 * next errand starts from.
 */
export function townTile(site, towardX, towardZ) {
  const flipped = site.orient >= 6
  const ports = PORT_SLOTS.map((slot) => {
    const key = site.cells[slot]
    const a = KEY_A(key)
    const b = KEY_B(key)
    const k = KEY_K(key)
    const side = worldSide(PORT_SIDE[slot], flipped)
    const [mx, mz] = longEdgeMid(a, b, k, side)
    return { slot, side, edge: longEdgeId(a, b, k, side), mid: [mx, mz], d: Math.hypot(mx - towardX, mz - towardZ) }
  })
  ports.sort((p, q) => p.d - q.d)
  const leat = ports[0]
  // …and out the other side: of the remaining crossings, the one furthest from
  // the leat, so the water is seen to cross the town rather than double back.
  let tail = null
  let far = -1
  for (const p of ports.slice(1)) {
    const d = Math.hypot(p.mid[0] - leat.mid[0], p.mid[1] - leat.mid[1])
    if (d > far) {
      far = d
      tail = p
    }
  }

  // houses crowd the water; the rest is the common land around them
  const biomes = new Array(8).fill(PLAINS)
  for (const i of [leat.slot, ...SLOT_ADJ[leat.slot], 0]) biomes[i] = VILLAGE
  // Only the leat to begin with. A dry mill has no outflow, and opening the
  // tailrace before the wheel turns puts a second mouth on the board that every
  // placement then has to keep satisfiable, for water that is not coming yet.
  // It starts running when the wheel does.
  return {
    tile: { biomes, ports: new Set([leat.slot]), kind: 'town', mouths: 1 },
    edge: leat.edge,
    mid: leat.mid,
    slot: leat.slot,
    tail: { edge: tail.edge, mid: tail.mid, slot: tail.slot, side: tail.side },
  }
}
