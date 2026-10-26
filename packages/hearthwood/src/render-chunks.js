// Terrain chunk cache for the renderer. OWNER: render implementer. Contract: ARCHITECTURE.md §16.2.
// One offscreen canvas per (chunk, zoom tier), baked lazily when visible and the chunk's
// version key changed. LRU-bounded by a byte budget; evicted canvases are pooled per tier.
// No DOM access at import time; per-frame lookups are allocation-free.

import {
  CHUNK, CHUNK_SHIFT, ZOOM_TIER_NEAR, ZOOM_TIER_MID, ZOOM_TIER_FAR,
  T_WATER, T_CLIFF, T_DIRT, R_NONE, TERRAIN_COUNT, RES_COUNT,
} from './constants.js'
import { hash2, fbm } from './rng.js'
import { abgr, hexToRgb } from './render-paint.js'

/** Pixels per tile in a baked chunk, by zoom tier (NEAR, MID, FAR). */
export const TIER_PPT = Object.freeze([32, 12, 4])
export const TIER_COUNT = 3
/** Default LRU byte budget for all chunk canvases (RGBA bytes). */
export const CACHE_BUDGET_BYTES = 96 * 1024 * 1024
const POOL_MAX = 6


export class TerrainCache {
  /**
   * @param {any} sprites SpriteSet from bakeSprites
   * @param {(w:number,h:number)=>any} mk canvas factory
   * @param {number} [budget] byte budget
   */
  constructor(sprites, mk, budget = CACHE_BUDGET_BYTES) {
    this.spr = sprites
    this.mk = mk
    this.budget = budget
    this.world = null
    /** @type {any[]} canvas per (chunk * TIER_COUNT + tier) */
    this.canvas = []
    this.key = new Float64Array(0)
    this.used = new Uint32Array(0)
    this.bytes = 0
    this.count = 0
    /** @type {any[][]} reusable canvases per tier */
    this.pool = [[], [], []]
    this.bakedTotal = 0
    this.evictedTotal = 0
    this._farImg = null
    this._farU32 = null
    // far-tier colour tables: [type * 4 + variant] packed ABGR
    this._terrU32 = new Uint32Array(TERRAIN_COUNT * 4)
    this._resU32 = new Uint32Array(RES_COUNT * 4)
    const tc = sprites.terrainColor, rc = sprites.resColor
    for (let t = 0; t < TERRAIN_COUNT; t++) for (let v = 0; v < 4; v++) this._terrU32[t * 4 + v] = varied(tc[t], v)
    for (let r = 1; r < RES_COUNT; r++) for (let v = 0; v < 4; v++) this._resU32[r * 4 + v] = varied(rc[r], v)
    // colour wash (see _bakeBlend): RGB per terrain + alpha (0..255)
    this._washRGB = new Uint8Array(TERRAIN_COUNT * 3)
    this._washA = new Uint8Array(TERRAIN_COUNT)
    for (let t = 0; t < TERRAIN_COUNT; t++) {
      const rgb = hexToRgb(tc[t])
      this._washRGB[t * 3] = rgb[0]; this._washRGB[t * 3 + 1] = rgb[1]; this._washRGB[t * 3 + 2] = rgb[2]
      this._washA[t] = t === T_CLIFF ? 90 : t === T_DIRT ? 205 : 185
    }
    this._blend = null
    this._blendG = null
    this._blendImg = null
    this._blendU32 = null
    // the wash image currently in _blend: chunk, terrain key and mode (0 detailed, 1 far)
    this._blendC = -1
    this._blendKey = -1
    this._blendMode = -1
    /** world.resLogN already applied by sync() */
    this._resSeen = 0
    /** tiles repainted in place by sync() (debug / tests) */
    this.patchedTotal = 0
  }

  /** Attach to a world (new ctx). Drops every cached chunk. */
  bind(world) {
    this.invalidateAll()
    this.world = world
    const n = world.chunkCount * TIER_COUNT
    this.canvas = new Array(n).fill(null)
    this.key = new Float64Array(n)
    this.used = new Uint32Array(n)
    this.bytes = 0
    this.count = 0
    this._resSeen = world.resLogN | 0
    this._blendC = -1
  }

  invalidateAll() {
    const cv = this.canvas
    for (let i = 0; i < cv.length; i++) {
      const c = cv[i]
      if (c) { this._release(i % TIER_COUNT, c); cv[i] = null }
    }
    this.key.fill(0)
    this.bytes = 0
    this.count = 0
    this._blendC = -1
  }

  /**
   * Version key of chunk c: own + 4-neighbour TERRAIN versions (decals overhang, shorelines),
   * +1 so 0 = never baked. Resource depletion (world.chunkResVersion) is excluded: sync()
   * repaints depleted tiles in place instead of re-baking up to five whole chunks per tree.
   */
  keyOf(c) {
    const w = this.world, cv = w.chunkVersion, rv = w.chunkResVersion, cw = w.chunksW
    const cx = c % cw, cy = (c - cx) / cw
    if (!rv) {
      let k = cv[c] + 1
      if (cx > 0) k += cv[c - 1]
      if (cx < cw - 1) k += cv[c + 1]
      if (cy > 0) k += cv[c - cw]
      if (cy < w.chunksH - 1) k += cv[c + cw]
      return k
    }
    let k = cv[c] - rv[c] + 1
    if (cx > 0) k += cv[c - 1] - rv[c - 1]
    if (cx < cw - 1) k += cv[c + 1] - rv[c + 1]
    if (cy > 0) k += cv[c - cw] - rv[c - cw]
    if (cy < w.chunksH - 1) k += cv[c + cw] - rv[c + cw]
    return k
  }

  /**
   * Apply resource depletions logged by the world since the last call: every cached, still
   * current canvas whose pixels the depleted tile's decal touched is repainted inside a small
   * clip rect (ground, wash, water, cliffs, then the decals overlapping it, in bake order), so
   * the result matches a full bake. A log overflow drops every key (lazy full re-bakes).
   * O(depletions * affected canvases); allocation-free.
   */
  sync() {
    const w = this.world
    if (!w || !w.resLog) return
    const n = w.resLogN | 0
    let i = this._resSeen
    if (i === n) return
    const ring = w.resLog, rmask = ring.length - 1
    if (n - i > ring.length) { this.key.fill(0); this._resSeen = n; return }
    const cw = w.chunksW, chh = w.chunksH, shift = w.shift, mask = w.mask
    for (; i < n; i++) {
      const t = ring[i & rmask]
      const tx = t & mask, ty = t >> shift
      const ccx = tx >> CHUNK_SHIFT, ccy = ty >> CHUNK_SHIFT
      for (let dy = -1; dy <= 1; dy++) {
        const cy = ccy + dy
        if (cy < 0 || cy >= chh) continue
        for (let dx = -1; dx <= 1; dx++) {
          const cx = ccx + dx
          if (cx < 0 || cx >= cw) continue
          const c = cy * cw + cx
          const base = c * TIER_COUNT
          let key = -1
          for (let tier = 0; tier < TIER_COUNT; tier++) {
            const s = base + tier
            const cv = this.canvas[s]
            if (!cv || this.key[s] === 0) continue
            if (key < 0) key = this.keyOf(c)
            if (this.key[s] !== key) continue // stale anyway: re-baked in full when next seen
            const lx = tx - (cx << CHUNK_SHIFT), ly = ty - (cy << CHUNK_SHIFT)
            if (tier === ZOOM_TIER_FAR) {
              if (dx === 0 && dy === 0) { this._patchFar(cv.getContext('2d'), c, lx, ly, key); this.patchedTotal++ }
            } else if (this._patchDetailed(cv.getContext('2d'), c, TIER_PPT[tier], lx, ly, key)) this.patchedTotal++
          }
        }
      }
    }
    this._resSeen = n
  }

  /** Repaint the pixels a (now gone) decal on local tile (lx,ly) covered. @returns {boolean} drawn */
  _patchDetailed(g, c, p, lx, ly, key) {
    const spr = this.spr, size = CHUNK * p
    let x0 = Math.floor((lx - spr.resSide) * p), x1 = Math.ceil((lx + 1 + spr.resSide) * p)
    let y0 = Math.floor((ly - spr.resOver) * p), y1 = Math.ceil((ly + 1) * p)
    if (x0 < 0) x0 = 0
    if (y0 < 0) y0 = 0
    if (x1 > size) x1 = size
    if (y1 > size) y1 = size
    if (x1 <= x0 || y1 <= y0) return false
    this._bakeDetailed(g, c, p, x0, y0, x1, y1, key)
    return true
  }

  _patchFar(g, c, lx, ly, key) {
    const w = this.world, cw = w.chunksW
    const ppt = TIER_PPT[ZOOM_TIER_FAR], size = CHUNK * ppt
    if (!this._farImg) {
      this._farImg = g.createImageData(size, size)
      this._farU32 = new Uint32Array(this._farImg.data.buffer)
    }
    const cx = c % cw, cy = (c - cx) / cw
    const tx = (cx << CHUNK_SHIFT) + lx, ty = (cy << CHUNK_SHIFT) + ly, i = (ty << w.shift) | tx
    const col = this._farColor(i, tx, ty)
    const px = this._farU32, base = ly * ppt * size + lx * ppt
    for (let yy = 0; yy < ppt; yy++) for (let xx = 0; xx < ppt; xx++) px[base + yy * size + xx] = col
    g.putImageData(this._farImg, 0, 0, lx * ppt, ly * ppt, ppt, ppt)
    this._ensureBlend(c, 1, key)
    g.save()
    g.beginPath(); g.rect(lx * ppt, ly * ppt, ppt, ppt); g.clip()
    g.globalAlpha = 0.6
    g.imageSmoothingEnabled = true
    g.drawImage(this._blend, 1, 1, CHUNK, CHUNK, 0, 0, size, size)
    g.restore()
    g.globalAlpha = 1
  }

  /** Far-tier pixel colour of tile i (resource tint, else terrain). */
  _farColor(i, tx, ty) {
    const w = this.world
    const v = hash2(tx, ty, w.seed | 0) & 3
    const r = w.res[i]
    return r !== R_NONE ? this._resU32[r * 4 + v] : this._terrU32[w.terrain[i] * 4 + v]
  }

  /** Make _blend hold chunk c's wash in `mode` (0 detailed, 1 far: water left unwashed). */
  _ensureBlend(c, mode, key) {
    if (this._blendC === c && this._blendMode === mode && this._blendKey === key && key > 0) return
    this._bakeBlend(c, mode)
    this._blendC = c; this._blendMode = mode; this._blendKey = key
  }

  /** Fresh canvas for (c, tier) or null. Marks it used this frame. */
  fresh(c, tier, key, frame) {
    const s = c * TIER_COUNT + tier
    const cv = this.canvas[s]
    if (cv && this.key[s] === key) { this.used[s] = frame; return cv }
    return null
  }

  /** Any canvas for chunk c (other tiers or stale), preferring the requested tier; null if none. */
  any(c, tier, frame) {
    const b = c * TIER_COUNT
    let cv = this.canvas[b + tier]
    if (cv) { this.used[b + tier] = frame; return cv }
    for (let t = 0; t < TIER_COUNT; t++) {
      cv = this.canvas[b + t]
      if (cv) { this.used[b + t] = frame; return cv }
    }
    return null
  }

  /** Bake (or re-bake) chunk c at tier; returns the canvas. */
  bake(c, tier, key, frame) {
    const s = c * TIER_COUNT + tier
    const ppt = TIER_PPT[tier]
    const size = CHUNK * ppt
    let cv = this.canvas[s]
    if (!cv) {
      cv = this.pool[tier].pop() || this.mk(size, size)
      this.canvas[s] = cv
      this.bytes += size * size * 4
      this.count++
    }
    const g = cv.getContext('2d')
    if (tier === ZOOM_TIER_FAR) this._bakeFar(g, c, key)
    else this._bakeDetailed(g, c, ppt, 0, 0, size, size, key)
    this.key[s] = key
    this.used[s] = frame
    this.bakedTotal++
    return cv
  }

  /** Evict least-recently-used canvases not used in `frame` until under budget. Bounded O(entries) per eviction. */
  evict(frame) {
    // one scan finds the oldest `used` frame, a second evicts every canvas last used then
    // (chunks drawn in the same frame share it), so a big overshoot costs a few scans, not
    // one full scan per evicted canvas
    let guard = 8
    const cv = this.canvas, used = this.used
    while (this.bytes > this.budget && guard-- > 0) {
      let oldest = frame
      for (let i = 0; i < cv.length; i++) if (cv[i] && used[i] < oldest) oldest = used[i]
      if (oldest >= frame) return
      for (let i = 0; i < cv.length && this.bytes > this.budget; i++) {
        if (!cv[i] || used[i] !== oldest) continue
        const tier = i % TIER_COUNT, ppt = TIER_PPT[tier]
        this._release(tier, cv[i])
        cv[i] = null
        this.key[i] = 0
        this.bytes -= CHUNK * ppt * CHUNK * ppt * 4
        this.count--
        this.evictedTotal++
      }
    }
  }

  _release(tier, c) {
    if (this.pool[tier].length < POOL_MAX) this.pool[tier].push(c)
  }

  // ------------------------------------------------------------ bakers
  _bakeFar(g, c, key) {
    const w = this.world, cw = w.chunksW
    const cx = c % cw, cy = (c - cx) / cw
    const ppt = TIER_PPT[ZOOM_TIER_FAR], size = CHUNK * ppt
    if (!this._farImg) {
      this._farImg = g.createImageData(size, size)
      this._farU32 = new Uint32Array(this._farImg.data.buffer)
    }
    const px = this._farU32
    const x0 = cx << CHUNK_SHIFT, y0 = cy << CHUNK_SHIFT, shift = w.shift, seed = w.seed | 0
    const terr = w.terrain, res = w.res, tU = this._terrU32, rU = this._resU32
    for (let ly = 0; ly < CHUNK; ly++) {
      const ty = y0 + ly
      for (let lx = 0; lx < CHUNK; lx++) {
        const tx = x0 + lx, i = (ty << shift) | tx
        const v = hash2(tx, ty, seed) & 3
        const r = res[i]
        const col = r !== R_NONE ? rU[r * 4 + v] : tU[terr[i] * 4 + v]
        const base = ly * ppt * size + lx * ppt
        for (let yy = 0; yy < ppt; yy++) {
          const row = base + yy * size
          for (let xx = 0; xx < ppt; xx++) px[row + xx] = col
        }
      }
    }
    g.putImageData(this._farImg, 0, 0)
    // far mode: water keeps its own blue (the land wash turned lakes cliff-grey at this zoom)
    this._ensureBlend(c, 1, key)
    g.globalAlpha = 0.6
    g.imageSmoothingEnabled = true
    g.drawImage(this._blend, 1, 1, CHUNK, CHUNK, 0, 0, size, size)
    g.globalAlpha = 1
  }

  /**
   * Bake chunk c at p px per tile, restricted to the pixel rect [px0,px1) x [py0,py1) (the
   * whole canvas for a full bake; a clip rect on integer pixels for an in-place repaint).
   * Every pass only visits the tiles that can touch the rect, in full-bake order.
   */
  _bakeDetailed(g, c, p, px0, py0, px1, py1, key) {
    const w = this.world, spr = this.spr, cw = w.chunksW
    const cx = c % cw, cy = (c - cx) / cw
    const x0 = cx << CHUNK_SHIFT, y0 = cy << CHUNK_SHIFT, shift = w.shift, seed = w.seed | 0
    const terr = w.terrain, res = w.res, W = w.w, H = w.h
    const size = CHUNK * p
    const partial = px0 > 0 || py0 > 0 || px1 < size || py1 < size
    // tile window covering the rect
    const ta = Math.floor(px0 / p), tb = Math.min(CHUNK, Math.ceil(px1 / p))
    const ua = Math.floor(py0 / p), ub = Math.min(CHUNK, Math.ceil(py1 / p))
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.globalAlpha = 1
    g.globalCompositeOperation = 'source-over'
    g.imageSmoothingEnabled = true
    if (partial) { g.save(); g.beginPath(); g.rect(px0, py0, px1 - px0, py1 - py0); g.clip() }
    // ground tiles (water tiles get a wet-dirt bank texture; the water shape is drawn on top)
    for (let ly = ua; ly < ub; ly++) {
      const ty = y0 + ly
      for (let lx = ta; lx < tb; lx++) {
        const tx = x0 + lx
        let t = terr[(ty << shift) | tx]
        if (t === T_WATER) t = T_DIRT
        g.drawImage(spr.terrain[t][hash2(tx, ty, seed) & 3], lx * p, ly * p, p, p)
      }
    }
    // smooth colour wash: a (CHUNK+2)^2 image (one px per tile, 1-tile border from the
    // neighbours) upscaled with bilinear filtering softens terrain borders and adds
    // low-frequency light/dark variation so the tiling never reads as a grid.
    this._ensureBlend(c, 0, key)
    g.drawImage(this._blend, 1, 1, CHUNK, CHUNK, 0, 0, CHUNK * p, CHUNK * p)
    // water as one vector shape: per-tile rounded squares (convex corners) + fillets in land
    // corners (concave), including a 1-tile border so strokes continue across chunk seams
    if (this._chunkHasWater(x0 + ta - 1, y0 + ua - 1, x0 + tb + 1, y0 + ub + 1)) {
      this._waterPath(g, x0, y0, p)
      g.lineJoin = 'round'
      g.strokeStyle = 'rgba(8,26,24,0.45)'; g.lineWidth = p * 0.42; g.stroke()
      g.strokeStyle = 'rgba(200,240,225,0.55)'; g.lineWidth = p * 0.2; g.stroke()
      g.fillStyle = '#173a48'; g.fill()
      g.save()
      g.clip()
      for (let ly = ua; ly < ub; ly++) {
        const ty = y0 + ly
        for (let lx = ta; lx < tb; lx++) {
          const tx = x0 + lx
          if (terr[(ty << shift) | tx] !== T_WATER) continue
          g.drawImage(spr.terrain[T_WATER][hash2(tx, ty, seed) & 3], lx * p, ly * p, p, p)
        }
      }
      g.restore()
    }
    // cliff faces
    for (let ly = ua; ly < ub; ly++) {
      const ty = y0 + ly
      for (let lx = ta; lx < tb; lx++) {
        const tx = x0 + lx
        const t = terr[(ty << shift) | tx]
        const n = ty > 0 ? terr[((ty - 1) << shift) | tx] : t
        const s = ty < H - 1 ? terr[((ty + 1) << shift) | tx] : t
        const X = lx * p, Y = ly * p
        if (t === T_CLIFF) {
          if (s !== T_CLIFF) {
            g.fillStyle = 'rgba(20,26,24,0.75)'; g.fillRect(X, Y + p * 0.62, p, p * 0.38)
            g.fillStyle = 'rgba(120,170,110,0.55)'; g.fillRect(X, Y + p * 0.56, p, Math.max(1, p * 0.07))
          }
          if (n !== T_CLIFF) { g.fillStyle = 'rgba(160,200,140,0.35)'; g.fillRect(X, Y, p, Math.max(1, p * 0.14)) }
        } else if (n === T_CLIFF && t !== T_WATER) {
          g.fillStyle = 'rgba(0,0,0,0.3)'; g.fillRect(X, Y, p, p * 0.3)
        }
      }
    }
    // resource decals, rows 0..CHUNK and columns -1..CHUNK (crowns overhang upward and sideways;
    // row CHUNK belongs to the chunk below, columns -1/CHUNK to the side chunks)
    const over = spr.resOver, side = spr.resSide, dw = p * (1 + 2 * side), dh = p * (1 + over)
    let yEnd = y0 + CHUNK < H ? CHUNK : CHUNK - 1
    let xa = x0 > 0 ? -1 : 0, xb = x0 + CHUNK < W ? CHUNK : CHUNK - 1
    let ya = 0
    if (partial) {
      // decals whose rect [(lx-side)p, (lx+1+side)p) x [(ly-over)p, (ly+1)p) meets the clip
      const da = Math.floor(px0 / p - 1 - side), db = Math.ceil(px1 / p + side)
      const ea = Math.floor(py0 / p) - 1, eb = Math.ceil(py1 / p + over)
      if (da > xa) xa = da
      if (db < xb) xb = db
      if (ea > ya) ya = ea
      if (eb < yEnd) yEnd = eb
    }
    for (let ly = ya; ly <= yEnd; ly++) {
      const ty = y0 + ly
      for (let lx = xa; lx <= xb; lx++) {
        const tx = x0 + lx
        const r = res[(ty << shift) | tx]
        if (r === R_NONE) continue
        g.drawImage(spr.resources[r][hash2(tx, ty, seed + 1) & 3], (lx - side) * p, (ly - over) * p, dw, dh)
      }
    }
    if (partial) g.restore()
  }

  _chunkHasWater(xa, ya, xb, yb) {
    const w = this.world, terr = w.terrain, shift = w.shift
    if (xa < 0) xa = 0
    if (ya < 0) ya = 0
    if (xb > w.w) xb = w.w
    if (yb > w.h) yb = w.h
    for (let y = ya; y < yb; y++) for (let x = xa; x < xb; x++) if (terr[(y << shift) | x] === T_WATER) return true
    return false
  }

  /** Build the chunk's water path (tile-local coords, p px per tile) as the current path of g. */
  _waterPath(g, x0, y0, p) {
    const w = this.world, terr = w.terrain, shift = w.shift, W = w.w, H = w.h, r = p * 0.5
    g.beginPath()
    for (let ly = -1; ly <= CHUNK; ly++) {
      const ty = y0 + ly
      if (ty < 0 || ty >= H) continue
      for (let lx = -1; lx <= CHUNK; lx++) {
        const tx = x0 + lx
        if (tx < 0 || tx >= W) continue
        const t = terr[(ty << shift) | tx]
        const nW = ty > 0 ? terr[((ty - 1) << shift) | tx] === T_WATER : t === T_WATER
        const sW = ty < H - 1 ? terr[((ty + 1) << shift) | tx] === T_WATER : t === T_WATER
        const wW = tx > 0 ? terr[(ty << shift) | (tx - 1)] === T_WATER : t === T_WATER
        const eW = tx < W - 1 ? terr[(ty << shift) | (tx + 1)] === T_WATER : t === T_WATER
        const X = lx * p, Y = ly * p, X2 = X + p, Y2 = Y + p
        if (t === T_WATER) {
          const rTL = !nW && !wW ? r : 0, rTR = !nW && !eW ? r : 0, rBR = !sW && !eW ? r : 0, rBL = !sW && !wW ? r : 0
          g.moveTo(X + rTL, Y)
          g.arcTo(X2, Y, X2, Y2, rTR)
          g.arcTo(X2, Y2, X, Y2, rBR)
          g.arcTo(X, Y2, X, Y, rBL)
          g.arcTo(X, Y, X2, Y, rTL)
          g.closePath()
        } else if (t !== T_CLIFF) {
          // concave water corner inside a land tile: fillet between two water neighbours
          if (nW && wW) { g.moveTo(X, Y); g.lineTo(X + r, Y); g.arcTo(X, Y, X, Y + r, r); g.closePath() }
          if (nW && eW) { g.moveTo(X2, Y); g.lineTo(X2, Y + r); g.arcTo(X2, Y, X2 - r, Y, r); g.closePath() }
          if (sW && eW) { g.moveTo(X2, Y2); g.lineTo(X2 - r, Y2); g.arcTo(X2, Y2, X2, Y2 - r, r); g.closePath() }
          if (sW && wW) { g.moveTo(X, Y2); g.lineTo(X, Y2 - r); g.arcTo(X, Y2, X + r, Y2, r); g.closePath() }
        }
      }
    }
  }

  _bakeBlend(c, mode = 0) {
    const w = this.world, cw = w.chunksW, N = CHUNK + 2
    if (!this._blend) {
      this._blend = this.mk(N, N)
      this._blendG = this._blend.getContext('2d')
      this._blendImg = this._blendG.createImageData(N, N)
      this._blendU32 = new Uint32Array(this._blendImg.data.buffer)
    }
    const cx = c % cw, cy = (c - cx) / cw
    const x0 = (cx << CHUNK_SHIFT) - 1, y0 = (cy << CHUNK_SHIFT) - 1
    const terr = w.terrain, shift = w.shift, W = w.w, H = w.h, seed = w.seed | 0
    const px = this._blendU32, base = this._washRGB, alphaOf = this._washA
    for (let ly = 0; ly < N; ly++) {
      let ty = y0 + ly
      if (ty < 0) ty = 0; else if (ty >= H) ty = H - 1
      for (let lx = 0; lx < N; lx++) {
        let tx = x0 + lx
        if (tx < 0) tx = 0; else if (tx >= W) tx = W - 1
        let t = terr[(ty << shift) | tx]
        if (t === T_WATER) {
          if (mode === 1) { px[ly * N + lx] = 0; continue } // far: leave the lake blue
          t = T_DIRT
        }
        const f = 0.72 + fbm(tx, ty, seed + 11, 3, 1 / 14) * 0.56
        let r = base[t * 3] * f, gg = base[t * 3 + 1] * f, b = base[t * 3 + 2] * f
        if (r > 255) r = 255
        if (gg > 255) gg = 255
        if (b > 255) b = 255
        px[ly * N + lx] = ((alphaOf[t] << 24) | ((b | 0) << 16) | ((gg | 0) << 8) | (r | 0)) >>> 0
      }
    }
    this._blendG.putImageData(this._blendImg, 0, 0)
  }
}

function varied(hex, v) {
  const c = hexToRgb(hex), f = 0.9 + v * 0.06
  const r = Math.min(255, (c[0] * f) | 0), gg = Math.min(255, (c[1] * f) | 0), b = Math.min(255, (c[2] * f) | 0)
  return abgr('#' + ((1 << 24) | (r << 16) | (gg << 8) | b).toString(16).slice(1))
}

export { ZOOM_TIER_NEAR, ZOOM_TIER_MID, ZOOM_TIER_FAR }
