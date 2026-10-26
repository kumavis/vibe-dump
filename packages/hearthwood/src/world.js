// World: tile grid, chunks, occupancy, door tiles, resource harvesting, and the
// unit cell grid (spatial hash). OWNER: world implementer.
//
// The architect pre-implemented the straightforward parts so every module can run
// against them; the owner may optimise/rewrite internals but MUST keep every
// exported name, field name, field type and semantic documented here and in
// ARCHITECTURE.md §5–§6.

import { CHUNK_SHIFT, CHUNK, MAP_W, MAP_H, T_GRASS, TERRAIN_WALKABLE, R_NONE } from './constants.js'
import { B_DOOR_DX, B_DOOR_DY } from './content.js'

export class World {
  /**
   * @param {number} w  map width in tiles; power of two, multiple of CHUNK (>= 32)
   * @param {number} h  map height in tiles; multiple of CHUNK
   */
  constructor(w = MAP_W, h = MAP_H) {
    if (w & (w - 1) || w < CHUNK || h % CHUNK) throw new Error('hearthwood: world w must be a power of two >= 32, h a multiple of 32')
    /** @readonly */ this.w = w
    /** @readonly */ this.h = h
    /** @readonly log2(w): packed tile i = (ty << shift) | tx */ this.shift = Math.log2(w) | 0
    /** @readonly w - 1 */ this.mask = w - 1
    /** @readonly */ this.size = w * h
    /** @readonly */ this.chunksW = w >> CHUNK_SHIFT
    /** @readonly */ this.chunksH = h >> CHUNK_SHIFT
    /** @readonly */ this.chunkCount = this.chunksW * this.chunksH

    /** T_* per tile */ this.terrain = new Uint8Array(this.size).fill(T_GRASS)
    /** R_* per tile (R_NONE when depleted) */ this.res = new Uint8Array(this.size)
    /** remaining resource units per tile */ this.resAmt = new Uint16Array(this.size)
    /** building id occupying the tile, -1 if none */ this.occ = new Int32Array(this.size).fill(-1)
    /** number of building doors on this tile (doors must stay clear) */ this.doorCount = new Uint8Array(this.size)
    /** 1 = walkable (terrain walkable && no building), 0 = blocked. Derived; only World methods write it. */
    this.pass = new Uint8Array(this.size).fill(1)
    /** per-chunk counter, bumped whenever terrain or resource TYPE of a tile in the chunk changes (render cache key) */
    this.chunkVersion = new Uint32Array(this.chunkCount)
    /** per-chunk counter, bumped whenever any tile's `pass` changes in the chunk (seam for hierarchical pathing) */
    this.chunkNavVersion = new Uint32Array(this.chunkCount)
    /** bumped whenever any tile's `pass` changes (path cache / regions key) */
    this.navVersion = 0
    /** packed start tile (Hearth centre) set by generateMap, -1 before */
    this.start = -1
    /** generation seed (informational) */
    this.seed = 0
  }

  // ------------------------------------------------------------ indexing (hot, inline-able)
  /** packed tile index */ idx(tx, ty) { return (ty << this.shift) | tx }
  /** tile x of packed index */ tileX(i) { return i & this.mask }
  /** tile y of packed index */ tileY(i) { return i >> this.shift }
  inBounds(tx, ty) { return tx >= 0 && ty >= 0 && tx < this.w && ty < this.h }
  /** @param {number} i packed tile */ walkable(i) { return this.pass[i] === 1 }
  walkableXY(tx, ty) { return tx >= 0 && ty >= 0 && tx < this.w && ty < this.h && this.pass[(ty << this.shift) | tx] === 1 }
  /** chunk index of a packed tile */ chunkOf(i) { return ((i >> this.shift) >> CHUNK_SHIFT) * this.chunksW + ((i & this.mask) >> CHUNK_SHIFT) }
  /** chunk index of tile coords */ chunkOfXY(tx, ty) { return (ty >> CHUNK_SHIFT) * this.chunksW + (tx >> CHUNK_SHIFT) }

  // ------------------------------------------------------------ mutation (the ONLY writers of terrain/res/occ/pass)
  _recomputePass(i) {
    const p = TERRAIN_WALKABLE[this.terrain[i]] === 1 && this.occ[i] < 0 ? 1 : 0
    if (p !== this.pass[i]) { this.pass[i] = p; this.chunkNavVersion[this.chunkOf(i)]++; return true }
    return false
  }

  /** Set terrain; bumps chunkVersion, and navVersion if walkability changed. */
  setTerrain(i, t) {
    if (this.terrain[i] === t) return
    this.terrain[i] = t
    this.chunkVersion[this.chunkOf(i)]++
    if (this._recomputePass(i)) this.navVersion++
  }

  /** Set resource type and amount (mapgen / tests). Bumps chunkVersion. */
  setResource(i, r, amt) {
    this.res[i] = r
    this.resAmt[i] = r === R_NONE ? 0 : amt
    this.chunkVersion[this.chunkOf(i)]++
  }

  /**
   * Harvest up to `amount` units from tile i. When the tile reaches 0 its res
   * becomes R_NONE and the chunk's chunkVersion is bumped.
   * @returns {number} units actually taken (0 if no resource)
   */
  takeResource(i, amount) {
    if (this.res[i] === R_NONE) return 0
    const have = this.resAmt[i]
    const t = have < amount ? have : amount
    this.resAmt[i] = have - t
    if (have - t === 0) { this.res[i] = R_NONE; this.chunkVersion[this.chunkOf(i)]++ }
    return t
  }

  /**
   * Mark a building footprint occupied and register its door. Bumps navVersion.
   * Caller (buildings.placeBuilding) has already validated with areaFree + door checks.
   */
  occupy(tx, ty, w, h, id, doorTile) {
    for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) {
      const i = (y << this.shift) | x
      this.occ[i] = id
      this._recomputePass(i)
    }
    if (doorTile >= 0) this.doorCount[doorTile]++
    this.navVersion++
  }

  /** Clear a footprint and unregister its door. Bumps navVersion. */
  vacate(tx, ty, w, h, doorTile) {
    for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) {
      const i = (y << this.shift) | x
      this.occ[i] = -1
      this._recomputePass(i)
    }
    if (doorTile >= 0 && this.doorCount[doorTile] > 0) this.doorCount[doorTile]--
    this.navVersion++
  }

  /** True if every footprint tile is in bounds, walkable terrain, unoccupied and not a door tile. */
  areaFree(tx, ty, w, h) {
    if (tx < 0 || ty < 0 || tx + w > this.w || ty + h > this.h) return false
    for (let y = ty; y < ty + h; y++) for (let x = tx; x < tx + w; x++) {
      const i = (y << this.shift) | x
      if (this.pass[i] !== 1 || this.doorCount[i] !== 0) return false
    }
    return true
  }

  /** Packed door tile for a building type whose footprint top-left is (tx,ty); -1 if out of bounds. */
  doorTile(type, tx, ty) {
    const x = tx + B_DOOR_DX[type], y = ty + B_DOOR_DY[type]
    return this.inBounds(x, y) ? (y << this.shift) | x : -1
  }

  // ------------------------------------------------------------ derived-state rebuild (mapgen)
  /**
   * Recompute `pass` for every tile from terrain + occ, bump every chunkVersion and
   * chunkNavVersion and navVersion once. Mapgen writes terrain/res/resAmt directly
   * (it is part of the world module) and calls this once at the end. O(size).
   */
  rebuildDerived() {
    const terrain = this.terrain, occ = this.occ, pass = this.pass
    for (let i = 0; i < this.size; i++) pass[i] = TERRAIN_WALKABLE[terrain[i]] === 1 && occ[i] < 0 ? 1 : 0
    for (let c = 0; c < this.chunkCount; c++) { this.chunkVersion[c]++; this.chunkNavVersion[c]++ }
    this.navVersion++
  }

  // ------------------------------------------------------------ door helpers
  /** True if at least one building's door uses packed tile i (such tiles must stay clear). */
  isDoor(i) { return this.doorCount[i] !== 0 }

  /**
   * True if a building of `type` with top-left (tx,ty) would have a usable door:
   * in bounds, walkable, not occupied. (buildings.canPlace may use it for P_DOOR.)
   */
  doorUsable(type, tx, ty) {
    const d = this.doorTile(type, tx, ty)
    return d >= 0 && this.pass[d] === 1
  }

  // ------------------------------------------------------------ queries
  /**
   * Count tiles of resource `res` with amount > 0 in the footprint expanded by `reach` (clipped to map).
   * O((w+2r)*(h+2r)).
   */
  countResource(tx, ty, w, h, reach, res) {
    let x0 = tx - reach, y0 = ty - reach, x1 = tx + w - 1 + reach, y1 = ty + h - 1 + reach
    if (x0 < 0) x0 = 0
    if (y0 < 0) y0 = 0
    if (x1 >= this.w) x1 = this.w - 1
    if (y1 >= this.h) y1 = this.h - 1
    const R = this.res, A = this.resAmt, shift = this.shift
    let n = 0
    for (let y = y0; y <= y1; y++) {
      const row = y << shift
      for (let x = x0; x <= x1; x++) {
        const i = row | x
        if (R[i] === res && A[i] > 0) n++
      }
    }
    return n
  }

  /**
   * Find a tile of `res` with amount > 0 in the footprint expanded by `reach`.
   * If `hint` (packed) is inside that rect and still valid, returns it (extractors keep
   * felling the same tree). Otherwise scans row-major and returns the first match.
   * @returns {number} packed tile or -1
   */
  findResource(tx, ty, w, h, reach, res, hint) {
    let x0 = tx - reach, y0 = ty - reach, x1 = tx + w - 1 + reach, y1 = ty + h - 1 + reach
    if (x0 < 0) x0 = 0
    if (y0 < 0) y0 = 0
    if (x1 >= this.w) x1 = this.w - 1
    if (y1 >= this.h) y1 = this.h - 1
    const R = this.res, A = this.resAmt, shift = this.shift
    if (hint >= 0 && hint < this.size && R[hint] === res && A[hint] > 0) {
      const hx = hint & this.mask, hy = hint >> shift
      if (hx >= x0 && hx <= x1 && hy >= y0 && hy <= y1) return hint
    }
    for (let y = y0; y <= y1; y++) {
      const row = y << shift
      for (let x = x0; x <= x1; x++) {
        const i = row | x
        if (R[i] === res && A[i] > 0) return i
      }
    }
    return -1
  }

  /**
   * Nearest walkable tile to (tx,ty) by square spiral up to radius maxR (Chebyshev rings).
   * Within the scanned rings the smallest Euclidean distance wins; ties go to the first
   * tile in scan order (rows top->bottom, columns left->right), so it is deterministic.
   * (tx,ty) may lie outside the map; out-of-bounds tiles are skipped.
   * @returns {number} packed or -1
   */
  nearestWalkable(tx, ty, maxR) {
    tx |= 0; ty |= 0
    if (this.walkableXY(tx, ty)) return (ty << this.shift) | tx
    const pass = this.pass, shift = this.shift, W = this.w, H = this.h
    let best = -1, bestD2 = 0x7fffffff
    for (let r = 1; r <= maxR; r++) {
      // a ring-r tile is at least r away; stop once that cannot beat the best
      if (best >= 0 && r * r > bestD2) break
      const ya = ty - r, yb = ty + r
      for (let y = ya; y <= yb; y++) {
        if (y < 0 || y >= H) continue
        const edgeRow = y === ya || y === yb
        const step = edgeRow ? 1 : 2 * r
        const dy = y - ty
        for (let x = tx - r; x <= tx + r; x += step) {
          if (x < 0 || x >= W) continue
          const i = (y << shift) | x
          if (pass[i] !== 1) continue
          const dx = x - tx, d2 = dx * dx + dy * dy
          if (d2 < bestD2) { bestD2 = d2; best = i }
        }
      }
    }
    return best
  }

  /**
   * A walkable tile on (or within 8 tiles of) a map edge for Blight spawns.
   * Searches depth 0..8 from the edge (outer loop) and lateral offsets 0, +1, -1, +2, ...
   * up to 16 tiles (inner loop), so the result hugs the edge near the requested spot.
   * @param {number} side 0 north, 1 east, 2 south, 3 west
   * @param {number} t    position along the edge in [0,1)
   * @returns {number} packed tile or -1 if that whole stretch is blocked
   */
  edgeTile(side, t) {
    side &= 3
    const len = side === 0 || side === 2 ? this.w : this.h
    let p = Math.floor(t * len)
    if (!(p >= 0)) p = 0
    if (p >= len) p = len - 1
    for (let depth = 0; depth <= 8; depth++) {
      for (let k = 0; k <= 32; k++) {
        const off = (k & 1) ? (k + 1) >> 1 : -(k >> 1)
        const q = p + off
        if (q < 0 || q >= len) continue
        let x, y
        if (side === 0) { x = q; y = depth } else if (side === 2) { x = q; y = this.h - 1 - depth } else if (side === 1) { x = this.w - 1 - depth; y = q } else { x = depth; y = q }
        const i = (y << this.shift) | x
        if (this.pass[i] === 1) return i
      }
    }
    return -1
  }
}

/**
 * Uniform-cell spatial hash rebuilt from scratch (counting sort) each time it is
 * used. Holds integer ids with float tile-unit positions. Allocation-free after
 * construction. Stale ids (dead units) may remain until the next rebuild: callers
 * must re-check pool.alive / state for every id they get back.
 *
 * Build protocol (once per tick by the owner of the grid):
 *   grid.clear(); for each entity: grid.add(id, x, y); grid.build()
 * Query protocol: queryRect / queryRing write ids into a caller-owned Int32Array
 * and return how many were written (truncated at out.length).
 */
export class CellGrid {
  /**
   * @param {number} tilesW map width in tiles
   * @param {number} tilesH map height in tiles
   * @param {number} cellShift log2(cell size in tiles), e.g. UNIT_CELL_SHIFT = 2 -> 4x4 tiles
   * @param {number} capacity max ids per build
   */
  constructor(tilesW, tilesH, cellShift, capacity) {
    /** @readonly */ this.shift = cellShift
    /** @readonly */ this.cellSize = 1 << cellShift
    /** @readonly */ this.cw = Math.ceil(tilesW / (1 << cellShift))
    /** @readonly */ this.ch = Math.ceil(tilesH / (1 << cellShift))
    /** @readonly */ this.cells = this.cw * this.ch
    /** @readonly */ this.capacity = capacity
    /** items of cell c are items[cellStart[c] .. cellStart[c+1]-1], sorted by insertion order */
    this.cellStart = new Int32Array(this.cells + 1)
    this.items = new Int32Array(capacity)
    /** number of ids added since clear() */
    this.count = 0
    this._pendId = new Int32Array(capacity)
    this._pendCell = new Int32Array(capacity)
    this._cursor = new Int32Array(this.cells)
  }
  clear() { this.count = 0 }
  /** Cell index containing world point (x,y) in tile units; clamped to the grid. */
  cellAt(x, y) {
    let cx = (x | 0) >> this.shift, cy = (y | 0) >> this.shift
    if (cx < 0) cx = 0; else if (cx >= this.cw) cx = this.cw - 1
    if (cy < 0) cy = 0; else if (cy >= this.ch) cy = this.ch - 1
    return cy * this.cw + cx
  }
  /** Cell column of a tile-unit x (clamped). */
  cellX(x) { const c = (x | 0) >> this.shift; return c < 0 ? 0 : c >= this.cw ? this.cw - 1 : c }
  /** Cell row of a tile-unit y (clamped). */
  cellY(y) { const c = (y | 0) >> this.shift; return c < 0 ? 0 : c >= this.ch ? this.ch - 1 : c }

  /** Stage an id at (x,y). Ignored silently when capacity is exceeded. */
  add(id, x, y) {
    const n = this.count
    if (n >= this.capacity) return
    let cx = (x | 0) >> this.shift, cy = (y | 0) >> this.shift
    if (cx < 0) cx = 0; else if (cx >= this.cw) cx = this.cw - 1
    if (cy < 0) cy = 0; else if (cy >= this.ch) cy = this.ch - 1
    this._pendId[n] = id
    this._pendCell[n] = cy * this.cw + cx
    this.count = n + 1
  }

  /** Counting-sort staged ids into cellStart/items. O(count + cells). */
  build() {
    const start = this.cellStart, cursor = this._cursor, cells = this.cells
    const n = this.count, pid = this._pendId, pcell = this._pendCell, items = this.items
    start.fill(0)
    for (let k = 0; k < n; k++) start[pcell[k] + 1]++
    for (let c = 0; c < cells; c++) { start[c + 1] += start[c]; cursor[c] = start[c] }
    for (let k = 0; k < n; k++) items[cursor[pcell[k]]++] = pid[k]
  }

  /** Ids of one cell (cx,cy) appended to out at offset k; returns new k. Out-of-grid cells add nothing. */
  _appendCell(cx, cy, out, k) {
    if (cx < 0 || cy < 0 || cx >= this.cw || cy >= this.ch) return k
    const c = cy * this.cw + cx
    const items = this.items, lim = out.length
    for (let j = this.cellStart[c], e = this.cellStart[c + 1]; j < e && k < lim; j++) out[k++] = items[j]
    return k
  }

  /**
   * Ids in every cell overlapping the tile-unit rect [x0,x1]x[y0,y1] (inclusive; any corner order).
   * Superset: callers filter by exact position.
   * @param {Int32Array} out @returns {number} count written
   */
  queryRect(x0, y0, x1, y1, out) {
    if (x1 < x0) { const t = x0; x0 = x1; x1 = t }
    if (y1 < y0) { const t = y0; y0 = y1; y1 = t }
    const cx0 = this.cellX(Math.floor(x0)), cx1 = this.cellX(Math.floor(x1))
    const cy0 = this.cellY(Math.floor(y0)), cy1 = this.cellY(Math.floor(y1))
    const start = this.cellStart, items = this.items, lim = out.length, cw = this.cw
    let k = 0
    for (let cy = cy0; cy <= cy1; cy++) {
      // cells of one row are contiguous in items: copy the whole row span at once
      const a = start[cy * cw + cx0], b = start[cy * cw + cx1 + 1]
      for (let j = a; j < b; j++) {
        if (k >= lim) return k
        out[k++] = items[j]
      }
    }
    return k
  }

  /**
   * Ids in the cells at Chebyshev distance exactly r from cell (cx,cy) (r = 0 -> that cell).
   * Use for expanding nearest-neighbour searches: scan r = 0,1,2,... and stop once
   * r * cellSize exceeds the best distance found (minus one cell of slack).
   * Cell coords come from cellX/cellY (or cellAt(x,y) % cw, / cw).
   * @param {Int32Array} out @returns {number} count written
   */
  queryRing(cx, cy, r, out) {
    if (r === 0) return this._appendCell(cx, cy, out, 0)
    const cw = this.cw, ch = this.ch, start = this.cellStart, items = this.items, lim = out.length
    let k = 0
    // top and bottom rows: contiguous spans
    let xa = cx - r, xb = cx + r
    if (xa < 0) xa = 0
    if (xb >= cw) xb = cw - 1
    if (xa <= xb) {
      for (let s = 0; s < 2; s++) {
        const y = s === 0 ? cy - r : cy + r
        if (y < 0 || y >= ch) continue
        const a = start[y * cw + xa], b = start[y * cw + xb + 1]
        for (let j = a; j < b; j++) {
          if (k >= lim) return k
          out[k++] = items[j]
        }
      }
    }
    // left and right columns, excluding corners
    let ya = cy - r + 1, yb = cy + r - 1
    if (ya < 0) ya = 0
    if (yb >= ch) yb = ch - 1
    for (let y = ya; y <= yb; y++) {
      k = this._appendCell(cx - r, y, out, k)
      k = this._appendCell(cx + r, y, out, k)
      if (k >= lim) return k
    }
    return k
  }

  /** Largest ring index worth scanning from (cx,cy) before the whole grid is covered. */
  maxRing(cx, cy) {
    const a = cx, b = this.cw - 1 - cx, c = cy, d = this.ch - 1 - cy
    let m = a > b ? a : b
    if (c > m) m = c
    if (d > m) m = d
    return m
  }
}
