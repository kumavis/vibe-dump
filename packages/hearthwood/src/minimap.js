// Minimap. OWNER: render implementer. Contract: ARCHITECTURE.md §16.4.
// Draws into the #minimap canvas it is given. No DOM access at import time.
//
// Layout: the map is fitted (aspect preserved, centred) into a size x size backing image,
// size = canvas.width (MINIMAP_SIZE by default). Terrain pixels are cached in a Uint32Array
// and recomputed only for chunks whose chunkVersion changed; buildings and units are
// re-plotted on top every MINIMAP_REFRESH_TICKS into a reusable ImageData, which is pushed
// to an offscreen cache canvas. draw() blits that cache and strokes the camera rectangle.

import {
  MINIMAP_REFRESH_TICKS, MINIMAP_SIZE, CHUNK, CHUNK_SHIFT, BUILDING_COUNT, B_HEARTH,
  U_COURIER, F_BLIGHT, R_NONE, TERRAIN_COUNT, RES_COUNT,
} from './constants.js'
import { BUILDINGS } from './content.js'
import { hash2 } from './rng.js'
import { makeCanvas, TERRAIN_COLOR, RES_COLOR } from './sprites.js'
import { abgr, shade } from './render-paint.js'

/** @typedef {import('./context.js').Ctx} Ctx */
/** @typedef {import('./camera.js').Camera} Camera */

const BG = abgr('#08100c')
const TERR = new Uint32Array(TERRAIN_COUNT * 2)
const RES = new Uint32Array(RES_COUNT * 2)
for (let t = 0; t < TERRAIN_COUNT; t++) { TERR[t * 2] = abgr(TERRAIN_COLOR[t]); TERR[t * 2 + 1] = abgr(shade(TERRAIN_COLOR[t], 0.06)) }
for (let r = 1; r < RES_COUNT; r++) { RES[r * 2] = abgr(shade(RES_COLOR[r], 0.05)); RES[r * 2 + 1] = abgr(shade(RES_COLOR[r], -0.1)) }
const BCOL = new Uint32Array(BUILDING_COUNT)
for (let t = 1; t < BUILDING_COUNT; t++) BCOL[t] = abgr(shade(BUILDINGS[t].color, 0.15))
BCOL[B_HEARTH] = abgr('#ffd27a')
const C_COURIER = abgr('#9fe8ff')
const C_SOLDIER = abgr('#d8ffb0')
const C_BLIGHT = abgr('#ff4fe0')

export class Minimap {
  /**
   * @param {HTMLCanvasElement} canvas  backing store MINIMAP_SIZE x MINIMAP_SIZE (CSS size set by style.css)
   * @param {number} mapW world width in tiles
   * @param {number} mapH world height in tiles
   */
  constructor(canvas, mapW, mapH) {
    this.canvas = canvas
    this.mapW = mapW
    this.mapH = mapH
    /** ctx.tick of the last content refresh, -Infinity before the first */
    this.lastTick = -Infinity
    /** backing image side in px */
    this.size = (canvas && canvas.width) || MINIMAP_SIZE
    /** px per tile and map offset inside the image */
    this.k = 1
    this.ox = 0
    this.oy = 0
    this._layout(mapW, mapH)
    this._ctx = null
    this._g = null
    this._cache = null
    this._cg = null
    this._img = null
    /** @type {Uint32Array|null} composed pixels (ABGR), exposed for tests */
    this.pixels = null
    /** @type {Uint32Array|null} cached terrain pixels */
    this._terrain = null
    this._ver = new Uint32Array(0)
    this._verValid = false
    this._vis = { x0: 0, y0: 0, x1: 0, y1: 0 }
    this.refreshes = 0
  }

  _layout(w, h) {
    const S = this.size
    this.mapW = w; this.mapH = h
    this.k = S / Math.max(w, h)
    this.ox = (S - w * this.k) * 0.5
    this.oy = (S - h * this.k) * 0.5
  }

  _bind(ctx) {
    this._ctx = ctx
    const world = ctx.world
    this.size = (this.canvas && this.canvas.width) || MINIMAP_SIZE
    this._layout(world.w, world.h)
    const S = this.size
    if (!this._cache || this._cache.width !== S) {
      this._cache = makeCanvas(S, S)
      this._cg = this._cache.getContext('2d')
      this._img = this._cg.createImageData(S, S)
      this.pixels = new Uint32Array(this._img.data.buffer)
      this._terrain = new Uint32Array(S * S)
    }
    this._ver = new Uint32Array(world.chunkCount)
    this._verValid = false
    this.lastTick = -Infinity
  }

  /**
   * Refresh the cached map image (terrain from world arrays — rebuilt only when any
   * world.chunkVersion changed — plus buildings and units as pixels) when
   * ctx.tick - lastTick >= MINIMAP_REFRESH_TICKS or `force`.
   * @returns {boolean} whether it refreshed
   */
  update(ctx, force = false) {
    if (ctx !== this._ctx) { this._bind(ctx); force = true }
    if (!force && ctx.tick - this.lastTick < MINIMAP_REFRESH_TICKS && ctx.tick >= this.lastTick) return false
    this.lastTick = ctx.tick
    this._updateTerrain(ctx.world)
    const px = this.pixels
    px.set(this._terrain)
    this._plotBuildings(ctx)
    this._plotUnits(ctx)
    this._cg.putImageData(this._img, 0, 0)
    this.refreshes++
    return true
  }

  _updateTerrain(world) {
    const ver = this._ver, cv = world.chunkVersion
    if (!this._verValid) {
      this._terrain.fill(BG)
      for (let c = 0; c < world.chunkCount; c++) this._paintChunk(world, c)
      ver.set(cv)
      this._verValid = true
      return
    }
    for (let c = 0; c < world.chunkCount; c++) {
      if (ver[c] !== cv[c]) { this._paintChunk(world, c); ver[c] = cv[c] }
    }
  }

  _paintChunk(world, c) {
    const S = this.size, k = this.k, ox = this.ox, oy = this.oy, out = this._terrain
    const cx = c % world.chunksW, cy = (c - cx) / world.chunksW
    const tx0 = cx << CHUNK_SHIFT, ty0 = cy << CHUNK_SHIFT
    let px0 = Math.floor(ox + tx0 * k), px1 = Math.ceil(ox + (tx0 + CHUNK) * k)
    let py0 = Math.floor(oy + ty0 * k), py1 = Math.ceil(oy + (ty0 + CHUNK) * k)
    if (px0 < 0) px0 = 0
    if (py0 < 0) py0 = 0
    if (px1 > S) px1 = S
    if (py1 > S) py1 = S
    const terr = world.terrain, res = world.res, shift = world.shift, W = world.w, H = world.h
    for (let py = py0; py < py1; py++) {
      let ty = Math.floor((py + 0.5 - oy) / k)
      if (ty < ty0 || ty >= ty0 + CHUNK || ty >= H) continue
      for (let px = px0; px < px1; px++) {
        const tx = Math.floor((px + 0.5 - ox) / k)
        if (tx < tx0 || tx >= tx0 + CHUNK || tx >= W) continue
        const i = (ty << shift) | tx
        const v = hash2(tx, ty, 3) & 1
        const r = res[i]
        out[py * S + px] = r !== R_NONE ? RES[r * 2 + v] : TERR[terr[i] * 2 + v]
      }
    }
  }

  _rect(x0, y0, x1, y1, col) {
    const S = this.size, px = this.pixels
    if (x0 < 0) x0 = 0
    if (y0 < 0) y0 = 0
    if (x1 > S) x1 = S
    if (y1 > S) y1 = S
    for (let y = y0; y < y1; y++) {
      const row = y * S
      for (let x = x0; x < x1; x++) px[row + x] = col
    }
  }

  _plotBuildings(ctx) {
    const B = ctx.buildings, k = this.k, ox = this.ox, oy = this.oy
    for (let b = 0; b < B.hi; b++) {
      if (!B.alive[b]) continue
      const x0 = Math.floor(ox + B.tx[b] * k), y0 = Math.floor(oy + B.ty[b] * k)
      let x1 = Math.ceil(ox + (B.tx[b] + B.w[b]) * k), y1 = Math.ceil(oy + (B.ty[b] + B.h[b]) * k)
      if (x1 - x0 < 2) x1 = x0 + 2
      if (y1 - y0 < 2) y1 = y0 + 2
      this._rect(x0, y0, x1, y1, BCOL[B.type[b]])
    }
  }

  _plotUnits(ctx) {
    const U = ctx.units, k = this.k, ox = this.ox, oy = this.oy, S = this.size, px = this.pixels
    const alive = U.alive, X = U.x, Y = U.y, type = U.type, fac = U.faction
    // couriers + soldiers first (1 px), Blight last and bigger so raids stand out
    for (let u = 0; u < U.hi; u++) {
      if (!alive[u] || fac[u] === F_BLIGHT) continue
      const x = (ox + X[u] * k) | 0, y = (oy + Y[u] * k) | 0
      if (x < 0 || y < 0 || x >= S || y >= S) continue
      const j = y * S + x
      // couriers blend 50% so thousands of them tint the roads instead of drowning the map
      px[j] = type[u] === U_COURIER ? ((((px[j] & 0xfefefe) >>> 1) + ((C_COURIER & 0xfefefe) >>> 1)) | 0xff000000) >>> 0 : C_SOLDIER
    }
    for (let u = 0; u < U.hi; u++) {
      if (!alive[u] || fac[u] !== F_BLIGHT) continue
      const x = (ox + X[u] * k) | 0, y = (oy + Y[u] * k) | 0
      this._rect(x - 1, y - 1, x + 1, y + 1, C_BLIGHT)
    }
  }

  /** Blit the cached image and draw the camera's view rectangle. Cheap: call every frame. */
  draw(camera) {
    let g = this._g
    if (!g) { g = this._g = this.canvas.getContext('2d'); if (!g) return }
    const S = this.size
    g.setTransform(1, 0, 0, 1, 0, 0)
    g.globalAlpha = 1
    if (this._cache) g.drawImage(this._cache, 0, 0)
    else { g.fillStyle = '#08100c'; g.fillRect(0, 0, S, S) }
    if (!camera) return
    const v = camera.visibleRect(this._vis), k = this.k
    let x0 = this.ox + v.x0 * k, y0 = this.oy + v.y0 * k, x1 = this.ox + v.x1 * k, y1 = this.oy + v.y1 * k
    const mx0 = this.ox, my0 = this.oy, mx1 = this.ox + this.mapW * k, my1 = this.oy + this.mapH * k
    if (x0 < mx0) x0 = mx0
    if (y0 < my0) y0 = my0
    if (x1 > mx1) x1 = mx1
    if (y1 > my1) y1 = my1
    if (x1 <= x0 || y1 <= y0) return
    g.lineWidth = 3
    g.strokeStyle = 'rgba(0,0,0,0.55)'
    g.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1)
    g.lineWidth = 1.25
    g.strokeStyle = '#ffe0a0'
    g.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1)
  }

  /**
   * Convert a point in minimap CSS pixels (relative to the canvas's top-left, e.g.
   * event.offsetX/offsetY) to world tile units, given the canvas's CSS size
   * (clientWidth/clientHeight — it differs from MINIMAP_SIZE on small screens). Writes out.x / out.y.
   * @param {{x:number,y:number}} out
   * @returns {{x:number,y:number}} out
   */
  toWorld(mx, my, cssW, cssH, out) {
    const S = this.size
    const px = (mx * S) / (cssW > 0 ? cssW : S), py = (my * S) / (cssH > 0 ? cssH : S)
    let x = (px - this.ox) / this.k, y = (py - this.oy) / this.k
    if (x < 0) x = 0; else if (x > this.mapW) x = this.mapW
    if (y < 0) y = 0; else if (y > this.mapH) y = this.mapH
    out.x = x; out.y = y
    return out
  }
}

/** @returns {Minimap} */
export function createMinimap(canvas, mapW, mapH) {
  return new Minimap(canvas, mapW, mapH)
}
