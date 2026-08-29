// Game state: the deck, the turn, the score. Knows nothing about Three.js.

import {
  KEY_A,
  KEY_B,
  KEY_K,
  cart,
  kiteCentre,
  placementKeys,
  candidatePlacements,
  neighbourKeys,
} from './hat.js'
import { Board, PLAINS, BIOME_NAME, openScore } from './board.js'
import {
  SEED_TILES,
  SUMMIT,
  seedBiome,
  seedElevation,
  BIOME_LIFT,
  makeTile,
  fitTile,
  mulberry32,
} from './tiles.js'

export const START_TILES = 42

/** Cheap value noise, seeded, for the gentle roll of the ground. */
function noiseField(seed) {
  const hash = (i, j) => {
    let h = (i * 374761393 + j * 668265263 + seed * 1442695040888963407) | 0
    h = Math.imul(h ^ (h >>> 13), 1274126177)
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296
  }
  const smooth = (t) => t * t * (3 - 2 * t)
  return (x, y) => {
    const i = Math.floor(x)
    const j = Math.floor(y)
    const fx = smooth(x - i)
    const fy = smooth(y - j)
    const a = hash(i, j)
    const b = hash(i + 1, j)
    const c = hash(i, j + 1)
    const d = hash(i + 1, j + 1)
    return (a * (1 - fx) + b * fx) * (1 - fy) + (c * (1 - fx) + d * fx) * fy
  }
}

export class Game {
  constructor(seed = 1) {
    this.seed = seed
    this.rnd = mulberry32(seed)
    this.noise = noiseField(seed)
    this.board = new Board()
    this.elev = new Map()
    this.jitter = new Map() // per-cell 0..1, for scattering props deterministically
    this.score = 0
    this.tilesLeft = START_TILES
    this.placed = 0
    this.sealedCount = 0
    this.best = { size: 0, biome: PLAINS }
    this.queue = []
    this.log = []
    this.over = false

    const [sx, sz] = cart(SUMMIT[0], SUMMIT[1])
    this.summit = [sx, sz]

    this._seedGarden()
    this._refillQueue()
  }

  // --- terrain ---------------------------------------------------------------

  /**
   * The bare ground at a point, with no biome on it: the massif's cone plus a
   * slow roll. Sampled per *vertex* by the mesh builder, which is what makes the
   * mountain a cone rather than a staircase, and what lets two kites of the same
   * biome meet without a seam.
   */
  groundAt(x, z) {
    const d = Math.hypot(x - this.summit[0], z - this.summit[1])
    return seedElevation(d) + (this.noise(x * 0.11, z * 0.11) - 0.5) * 0.34
  }

  elevationAt(x, z, biome) {
    return this.groundAt(x, z) + BIOME_LIFT[biome]
  }

  _recordCells(cells, biomes) {
    for (let i = 0; i < cells.length; i++) {
      const key = cells[i]
      const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
      this.elev.set(key, this.elevationAt(x, z, biomes[i]))
      this.jitter.set(key, this.rnd())
    }
  }

  _seedGarden() {
    SEED_TILES.forEach((t, ti) => {
      const cells = placementKeys(t.orient, t.ta, t.tb)
      const biomes = cells.map((key, slot) => {
        const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
        const d = Math.hypot(x - this.summit[0], z - this.summit[1])
        return seedBiome(ti, slot, d)
      })
      this.board.place(t.orient, t.ta, t.tb, biomes, ti)
      this._recordCells(cells, biomes)
    })
    // The summit ring is already sealed by the seed. Freeze it without paying
    // for it — the score should be what the player built, not what they were
    // handed.
    for (const key of this.board.filled) {
      const r = this.board.find(key)
      if (this.board.ropen.get(r) === 0) this.board.sealed.add(r)
    }
    this.placed = SEED_TILES.length
  }

  // --- the deck --------------------------------------------------------------

  _refillQueue() {
    while (this.queue.length < 3) this.queue.push(makeTile(this.rnd))
    this._ensurePlayable()
  }

  /**
   * The current tile must always have somewhere to go. If the deck's offering
   * cannot be placed anywhere, replace it with one cut to fit an actual gap —
   * which is always possible, so the garden can never dead-end.
   */
  _ensurePlayable() {
    const tile = this.queue[0]
    if (!tile) return
    const fits = this.board.legalPlacements(tile.biomes)
    if (fits.length > 0) {
      this._fits = fits
      return
    }
    const spots = candidatePlacements(this.board.filled)
    for (let attempt = 0; attempt < spots.length; attempt++) {
      const spot = spots[Math.floor(this.rnd() * spots.length)]
      const want = this.board.demand(spot.o, spot.ta, spot.tb)
      if (!want) continue
      const fitted = fitTile(want, this.rnd)
      const check = this.board.legalPlacements(fitted.biomes)
      if (check.length > 0) {
        this.queue[0] = fitted
        this._fits = check
        return
      }
    }
    this._fits = []
  }

  get tile() {
    return this.queue[0]
  }

  /** Every legal placement for the tile in hand, cached per turn. */
  get fits() {
    if (!this._fits) this._ensurePlayable()
    return this._fits
  }

  /** Swap the tile in hand for a fresh one. Costs a tile from the stack. */
  reroll() {
    if (this.over || this.tilesLeft <= 1) return false
    this.tilesLeft -= 1
    this.queue.shift()
    this._fits = null
    this._refillQueue()
    return true
  }

  // --- choosing where to put it ---------------------------------------------

  /**
   * Rank the placements that cover `cell`, best first. "Best" is the one that
   * agrees with its neighbours most — the placement that grows a region rather
   * than fraying it — with snugness (how many edges it shares at all) as the
   * tie-break, so the garden stays compact.
   */
  fitsAtCell(cellKey) {
    const tile = this.tile
    if (!tile) return []
    const out = []
    for (const f of this.fits) {
      const cells = placementKeys(f.o, f.ta, f.tb)
      if (!cells.includes(cellKey)) continue
      out.push({ ...f, cells, ...this._harmony(cells, tile.biomes) })
    }
    out.sort((a, b) => b.match - a.match || b.touch - a.touch || a.o - b.o)
    return out
  }

  _harmony(cells, biomes) {
    let match = 0
    let touch = 0
    const own = new Set(cells)
    for (let i = 0; i < cells.length; i++) {
      const key = cells[i]
      const nb = nbBuf
      neighbourKeysInto(key, nb)
      for (let j = 0; j < 4; j++) {
        const m = nb[j]
        if (own.has(m) || !this.board.filled.has(m)) continue
        touch++
        if (this.board.biome.get(m) === biomes[i]) match++
      }
    }
    return { match, touch }
  }

  // --- taking the turn -------------------------------------------------------

  place(fit) {
    if (this.over) return null
    const tile = this.tile
    const cellsBefore = placementKeys(fit.o, fit.ta, fit.tb)
    const h = this._harmony(cellsBefore, tile.biomes)
    const perfect = h.touch > 0 && h.match === h.touch

    const res = this.board.place(fit.o, fit.ta, fit.tb, tile.biomes, this.placed)
    this._recordCells(res.cells, tile.biomes)
    for (const key of res.hollows) {
      // A retired pocket sits below the land around it — a tarn in the seam.
      const [x, z] = kiteCentre(KEY_A(key), KEY_B(key), KEY_K(key))
      this.elev.set(key, this.groundAt(x, z) - 0.26)
      this.jitter.set(key, this.rnd())
    }
    this.placed += 1
    this.tilesLeft -= 1

    // Every edge that meets its like pays a little, straight away. It is the
    // heartbeat of the turn — sealing a region is the occasion.
    const fitScore = h.match * 3 + (perfect ? 12 : 0)
    this.score += fitScore

    let gained = fitScore
    let bonus = 0
    const announce = []
    for (const r of res.closed) {
      this.score += r.score
      gained += r.score
      bonus += r.tiles
      this.sealedCount += 1
      if (r.size > this.best.size) this.best = { size: r.size, biome: r.biome }
      if (r.size >= 3) {
        announce.push(r)
        this.log.unshift(`${BIOME_NAME[r.biome]} sealed · ${r.size} kites · +${r.score}`)
      }
    }
    this.tilesLeft += bonus
    this.log.length = Math.min(this.log.length, 5)

    this.queue.shift()
    this._fits = null
    this._refillQueue()
    if (this.tilesLeft <= 0 || this.fits.length === 0) this.finish()
    return { ...res, gained, fitScore, perfect, bonus, announce, match: h.match, touch: h.touch }
  }

  /** The largest region still open, for the HUD's "growing" line. */
  biggestOpen() {
    let best = null
    for (const r of this.board.allRegions()) {
      if (r.sealed) continue
      if (!best || r.size > best.size) best = r
    }
    return best
  }

  /** Put the garden down: open regions pay out at a third, and that is the end. */
  finish() {
    if (this.over) return
    this.over = true
    this.openTally = []
    for (const r of this.board.allRegions()) {
      if (r.sealed || r.size < 3) continue
      const s = openScore(r.size, r.biome)
      this.score += s
      this.openTally.push({ ...r, score: s })
    }
    this.openTally.sort((a, b) => b.score - a.score)
  }
}

// Kept out of the class so the hot path stays monomorphic.
const nbBuf = [0, 0, 0, 0]
function neighbourKeysInto(key, out) {
  neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), out)
}
