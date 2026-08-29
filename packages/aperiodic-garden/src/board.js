// Board state: which kite cells are filled, what grows on them, and which
// biome regions have been sealed off.
//
// Everything here is incremental. A placement touches eight cells, so scoring
// must cost O(8 · 4) rather than O(board) — otherwise the two-hundredth tile
// costs two hundred times the first. The trick is a union-find over kite cells
// that carries, at each root, the number of *open edges* the region still has:
// (kite, direction) pairs facing an empty cell. A region is closed exactly when
// that count reaches zero, and because cells are never removed a closed region
// can never re-open or merge with anything — so it scores once and freezes.

import { KEY_A, KEY_B, KEY_K, ORIENT_KITES, neighbourKeys, candidatePlacements, placementKeys } from './hat.js'

export const WATER = 0
export const PLAINS = 1
export const FOREST = 2
export const HILLS = 3
export const VILLAGE = 4
export const PEAK = 5

export const BIOME_NAME = ['river', 'meadow', 'forest', 'hills', 'hamlet', 'peak']

// How much a sealed region of each biome is worth per kite². Rivers are the
// fiddliest to close, hamlets the scarcest, so they pay best.
export const BIOME_MULT = [1.6, 1.0, 1.1, 1.25, 1.8, 1.4]

export const isWater = (b) => b === WATER

/**
 * Only the first two of a kite's four sides are *long* (the √3 ones, running
 * from the hexagon's centre to an edge midpoint); the other two are the short
 * unit sides. neighbourKeys() puts the long pair first, so `side < 2` is the
 * whole test.
 *
 * That distinction is what makes rivers workable. Each of the hat's slots owns
 * *at most one* long side on the tile's boundary — slots 1, 2, 4, 5, 6 and 7 own
 * exactly one, slots 0 and 3 own none — so a river can only ever leave a tile in
 * as many places as it has water on those six slots. Water that meets land
 * across a short side is simply a bank. Enforce the match on every side instead
 * and a river tile demands up to five simultaneous matches, which almost never
 * line up: the river then breaks into puddles instead of flowing.
 */
export const LONG_SIDE = 2

/** Points for sealing off `n` kites of biome `b`. Superlinear, so one big
 *  meadow beats four small ones — the whole reason to plan ahead. */
export function regionScore(n, b) {
  return Math.round(n * (n + 2) * BIOME_MULT[b])
}

/**
 * What an *unsealed* region is worth when the garden is put down. Sealing pays
 * more than three times as much, so closing is always the better move — but a
 * sprawling open meadow you never quite ringed still counts for something,
 * which is what stops the last ten tiles being played at random.
 */
export const OPEN_RATE = 0.3
export function openScore(n, b) {
  return Math.round(n * (n + 2) * BIOME_MULT[b] * OPEN_RATE)
}

/** Bonus tiles granted for sealing a region — the tile economy's only faucet. */
export function regionTiles(n) {
  if (n >= 21) return 4
  if (n >= 13) return 3
  if (n >= 7) return 2
  if (n >= 3) return 1
  return 0
}

export class Board {
  constructor() {
    /** key → biome */
    this.biome = new Map()
    /** key → the index of the tile that placed it */
    this.owner = new Map()
    /** every filled cell, for the placement enumerator */
    this.filled = new Set()
    /** union-find over filled cells */
    this.parent = new Map()
    this.rsize = new Map()
    this.ropen = new Map()
    /** roots whose score has already been banked */
    this.sealed = new Set()
    /** empty cells that can never be filled — see _sealPockets */
    this.dead = new Set()
    /** root → the cell that carries its pennant, once sealed */
    this.landmarks = new Map()
    this.tiles = [] // {orient, ta, tb, cells:[key×8], biomes:[…], flipped}
    this._nb = []
  }

  find(x) {
    let r = x
    while (this.parent.get(r) !== r) r = this.parent.get(r)
    // path compression
    let c = x
    while (this.parent.get(c) !== r) {
      const n = this.parent.get(c)
      this.parent.set(c, r)
      c = n
    }
    return r
  }

  union(a, b) {
    let ra = this.find(a)
    let rb = this.find(b)
    if (ra === rb) return ra
    if (this.rsize.get(ra) < this.rsize.get(rb)) [ra, rb] = [rb, ra]
    this.parent.set(rb, ra)
    this.rsize.set(ra, this.rsize.get(ra) + this.rsize.get(rb))
    this.ropen.set(ra, this.ropen.get(ra) + this.ropen.get(rb))
    this.rsize.delete(rb)
    this.ropen.delete(rb)
    return ra
  }

  // --- legality -------------------------------------------------------------

  /**
   * Can `biomes` (eight entries, in slot order) sit at this placement?
   * The only hard constraint is the river: along every edge where the new tile
   * meets the existing garden, water must meet water and land must meet land.
   * Forest butting onto meadow is allowed — it just costs you the region.
   */
  legal(orient, ta, tb, biomes) {
    const cells = placementKeys(orient, ta, tb)
    const own = new Set(cells)
    for (let i = 0; i < 8; i++) {
      if (this.filled.has(cells[i])) return false
      const w = isWater(biomes[i])
      neighbourKeys(KEY_A(cells[i]), KEY_B(cells[i]), KEY_K(cells[i]), this._nb)
      for (let j = 0; j < LONG_SIDE; j++) {
        const m = this._nb[j]
        if (own.has(m)) continue
        if (!this.filled.has(m)) continue
        if (isWater(this.biome.get(m)) !== w) return false
      }
    }
    return true
  }

  /** Every legal (placement, orientation) for one tile's biome pattern.
   *  `pattern` is indexed by hat slot, so rotating the tile rotates nothing —
   *  the slots travel with the orientation. */
  legalPlacements(pattern) {
    const out = []
    const joins = []
    const wet = pattern.some(isWater)
    for (const c of candidatePlacements(this.filled)) {
      if (!this.legal(c.o, c.ta, c.tb, pattern)) continue
      out.push(c)
      if (wet && this.joinsRiver(c.o, c.ta, c.tb, pattern)) joins.push(c)
    }
    // Join if you can. A tile carrying water may only be laid where its water
    // actually meets water already on the board — but only while such a spot
    // exists, so the rule can never empty the legal set. That is what keeps the
    // river a river instead of a scatter of disconnected puddles.
    return joins.length > 0 ? joins : out
  }

  /** Does this placement's water touch water already on the board? */
  joinsRiver(orient, ta, tb, biomes) {
    const cells = placementKeys(orient, ta, tb)
    const own = new Set(cells)
    for (let i = 0; i < 8; i++) {
      if (!isWater(biomes[i])) continue
      neighbourKeys(KEY_A(cells[i]), KEY_B(cells[i]), KEY_K(cells[i]), this._nb)
      for (let j = 0; j < LONG_SIDE; j++) {
        const m = this._nb[j]
        if (own.has(m)) continue
        if (this.filled.has(m) && isWater(this.biome.get(m))) return true
      }
    }
    return false
  }

  /** The river-edge signature a placement demands: for each slot, `true` if the
   *  garden already insists that slot be water, `false` if it insists on land,
   *  `null` if the slot is free. Used to *synthesise* a fitting tile so the
   *  game can never dead-end. */
  demand(orient, ta, tb) {
    const cells = placementKeys(orient, ta, tb)
    const own = new Set(cells)
    const want = new Array(8).fill(null)
    for (let i = 0; i < 8; i++) {
      if (this.filled.has(cells[i])) return null
      neighbourKeys(KEY_A(cells[i]), KEY_B(cells[i]), KEY_K(cells[i]), this._nb)
      for (let j = 0; j < LONG_SIDE; j++) {
        const m = this._nb[j]
        if (own.has(m) || !this.filled.has(m)) continue
        const w = isWater(this.biome.get(m))
        if (want[i] === null) want[i] = w
        else if (want[i] !== w) return null // this slot is asked to be two things
      }
    }
    return want
  }

  // --- placement ------------------------------------------------------------

  /**
   * Drop a tile. Returns { closed: [{root, size, biome, score, tiles}],
   * hollows: [key…] } — the latter being pockets retired this turn, which the
   * renderer draws as tarns.
   */
  place(orient, ta, tb, biomes, tileIndex) {
    const cells = placementKeys(orient, ta, tb)
    this.tiles.push({ orient, ta, tb, cells, biomes: biomes.slice(), flipped: orient >= 6 })

    const touched = this._addCells(cells, biomes, tileIndex)
    const hollows = this._sealPockets(cells, touched)
    const closed = this._collectSealed(touched)
    return { closed, hollows, cells }
  }

  _addCells(cells, biomes, tileIndex) {
    const touched = new Set()
    for (let i = 0; i < cells.length; i++) {
      const key = cells[i]
      this.filled.add(key)
      this.biome.set(key, biomes[i])
      this.owner.set(key, tileIndex)
      this.parent.set(key, key)
      this.rsize.set(key, 1)
      this.ropen.set(key, 0)
    }
    const isNew = new Set(cells)
    for (let i = 0; i < cells.length; i++) {
      const key = cells[i]
      const b = biomes[i]
      neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), this._nb)
      for (let j = 0; j < 4; j++) {
        const m = this._nb[j]
        if (!this.filled.has(m)) {
          if (!this.dead.has(m)) {
            const r = this.find(key)
            this.ropen.set(r, this.ropen.get(r) + 1)
          }
          continue
        }
        if (!isNew.has(m)) {
          // the neighbour's region just lost an open edge
          const rm = this.find(m)
          this.ropen.set(rm, this.ropen.get(rm) - 1)
          touched.add(rm)
        }
        if (this.biome.get(m) === b) touched.add(this.union(key, m))
      }
      touched.add(this.find(key))
    }
    return touched
  }

  /**
   * A hat needs eight kites, so an awkward placement can leave behind a pocket
   * no tile will ever fit into. Left alone, such a pocket keeps an open edge on
   * every region around it, and those regions can never seal — which the player
   * would experience as the game quietly breaking after forty tiles.
   *
   * The pocket is *retired* rather than filled: its cells are marked dead, and
   * every region facing them gives up the open edges that face them. Nothing is
   * invented — the garden never grows land the player did not lay. What is left
   * is a hollow between the pieces, which the renderer fills with water and the
   * game calls a tarn.
   */
  _sealPockets(cells, touched) {
    const CAP = 42
    const seen = new Set()
    const retired = []
    for (const key of cells) {
      neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), this._nb)
      for (let j = 0; j < 4; j++) {
        const start = this._nb[j]
        if (this.filled.has(start) || seen.has(start) || this.dead.has(start)) continue
        const pocket = this._pocket(start, CAP)
        for (const p of pocket ?? []) seen.add(p)
        if (!pocket) continue
        if (pocket.length >= 8 && this._fitsInside(pocket)) continue
        for (const p of pocket) {
          this.dead.add(p)
          retired.push(p)
        }
      }
    }
    // A retired pocket is enclosed by definition, so each of its edges faces a
    // filled cell exactly once — one decrement per edge, no dedupe.
    for (const p of retired) {
      neighbourKeys(KEY_A(p), KEY_B(p), KEY_K(p), this._nb)
      for (let j = 0; j < 4; j++) {
        const m = this._nb[j]
        if (!this.filled.has(m)) continue
        const r = this.find(m)
        this.ropen.set(r, this.ropen.get(r) - 1)
        touched.add(r)
      }
    }
    return retired
  }

  /** The empty component containing `start`, or null if it is bigger than `cap`
   *  (which, for anything but a sealed pocket, means "open to the outside"). */
  _pocket(start, cap) {
    const seen = new Set([start])
    const stack = [start]
    const out = []
    while (stack.length) {
      const key = stack.pop()
      out.push(key)
      if (out.length > cap) return null
      neighbourKeys(KEY_A(key), KEY_B(key), KEY_K(key), this._nb)
      for (let j = 0; j < 4; j++) {
        const m = this._nb[j]
        if (this.filled.has(m) || seen.has(m)) continue
        seen.add(m)
        stack.push(m)
      }
    }
    return out
  }

  /** Could a hat ever be placed wholly inside this pocket? */
  _fitsInside(pocket) {
    const set = new Set(pocket)
    // Anchor on every cell of the pocket, every orientation, every matching slot.
    for (const key of pocket) {
      const fa = KEY_A(key)
      const fb = KEY_B(key)
      const fk = KEY_K(key)
      for (let o = 0; o < 12; o++) {
        for (let i = 0; i < 8; i++) {
          const base = ORIENT_KITES[o][i]
          if (base[2] !== fk) continue
          const ta = fa - base[0]
          const tb = fb - base[1]
          let ok = true
          const ks = placementKeys(o, ta, tb)
          for (let j = 0; j < 8; j++) {
            if (!set.has(ks[j])) {
              ok = false
              break
            }
          }
          if (ok) return true
        }
      }
    }
    return false
  }


  _collectSealed(touched) {
    const out = []
    const done = new Set()
    for (const r0 of touched) {
      const r = this.find(r0)
      if (done.has(r) || this.sealed.has(r)) continue
      done.add(r)
      if (this.ropen.get(r) !== 0) continue
      this.sealed.add(r)
      const size = this.rsize.get(r)
      const biome = this.biome.get(r)
      if (size >= 3) this.landmarks.set(r, this._heart(r))
      out.push({ root: r, size, biome, score: regionScore(size, biome), tiles: regionTiles(size) })
    }
    return out
  }

  /** The cell of a region nearest its own centre — where its pennant goes. */
  _heart(root) {
    const cells = this.regionCells(root)
    let ax = 0
    let ab = 0
    for (const k of cells) {
      ax += KEY_A(k)
      ab += KEY_B(k)
    }
    ax /= cells.length
    ab /= cells.length
    let best = cells[0]
    let bestD = Infinity
    for (const k of cells) {
      const da = KEY_A(k) - ax
      const db = KEY_B(k) - ab
      const d = da * da + da * db + db * db
      if (d < bestD) {
        bestD = d
        best = k
      }
    }
    return best
  }

  /** Every region on the board, sealed or not, as {root, size, biome, sealed}. */
  allRegions() {
    const out = []
    const seen = new Set()
    for (const key of this.filled) {
      const r = this.find(key)
      if (seen.has(r)) continue
      seen.add(r)
      out.push({ root: r, size: this.rsize.get(r), biome: this.biome.get(key), sealed: this.sealed.has(r) })
    }
    return out
  }

  /** Every cell of the region containing `key` — only needed for the "region
   *  sealed" flourish, so a plain flood fill is fine. */
  regionCells(key) {
    const root = this.find(key)
    const out = []
    for (const k of this.filled) if (this.find(k) === root) out.push(k)
    return out
  }

  /** How close each unsealed region is to closing — drives the gentle outline
   *  the renderer draws around the region under the cursor. */
  regionOf(key) {
    if (!this.filled.has(key)) return null
    const r = this.find(key)
    return { root: r, size: this.rsize.get(r), open: this.ropen.get(r), biome: this.biome.get(key), sealed: this.sealed.has(r) }
  }
}
