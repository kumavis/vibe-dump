// Canvas 2D renderer. OWNER: render implementer. Contract: ARCHITECTURE.md §16.
// Reads sim state (ctx) and the UI overlay; never writes either. No DOM beyond the
// canvas it is given. Allocation-free per frame. No DOM access at import time.
//
// Coordinates: everything is drawn with the identity transform in DEVICE pixels:
//   dx = x * S + ox,  S = camera.scale * dpr,  ox = viewW * dpr / 2 - camera.x * S
// Layers (back to front): terrain chunks (with baked resource decals) -> building shadows ->
// buildings (bottom-row order) + smoke/status/HP/gauges -> selection rings -> units ->
// fx -> night tint -> additive glows + fireflies -> ghost -> drag box -> ping/reticle -> debug.
// (The tint sits under the UI layers so ghost/drag/ping stay legible at night.)

import {
  TILE, CHUNK, BUILDING_COUNT, ITEM_SHIFT, OUTPUT_CAP,
  ZOOM_TIER_NEAR, ZOOM_TIER_MID, ZOOM_TIER_FAR,
  U_COURIER, F_BLIGHT, M_MOVING,
  BS_OK, BS_STARVED, BS_OUTPUT_FULL, BS_DEPLETED, BS_PAUSED, BS_NO_STOCK,
  B_HEARTH, B_FORGE, P_OK,
  FX_ARROW, FX_BOLT, FX_HIT, FX_DEATH, FX_BUILD, FX_DESTROY, FX_SPAWN, FX_LIFE,
  TICK_RATE, ITEM_STRIDE, SITE_HP_FRAC, SITE_RAISE_TICKS,
} from './constants.js'
import {
  BUILDINGS, B_W, B_H, B_HP, B_FLAGS, B_OUT_ITEM, B_STORAGE, B_DOOR_DX, B_DOOR_DY,
  U_HP, U_RADIUS, ITEM_COLOR,
} from './content.js'
import { BF_PRODUCER, BF_STORAGE, BF_EXTRACTOR, BF_SHRINE, PLACE_REASONS } from './constants.js'
import { hash2 } from './rng.js'
import { bakeSprites, makeCanvas } from './sprites.js'
import { TerrainCache } from './render-chunks.js'
import { SMOKE_X, SMOKE_Y, GLOW_KIND, GLOW_X, GLOW_Y, GLOW_R } from './render-art.js'

/** @typedef {import('./context.js').Ctx} Ctx */
/** @typedef {import('./camera.js').Camera} Camera */
/** @typedef {import('./overlay.js').Overlay} Overlay */

const now = typeof performance !== 'undefined' ? () => performance.now() : () => Date.now()

/** Ticks per full day/night cycle (6 minutes of sim time). Starts at noon. */
export const DAY_TICKS = 6 * 60 * TICK_RATE
const NIGHT_ALPHA = 0.34
/** Max ms of chunk baking per frame (at least one bake always happens when needed). */
const BAKE_MS = 6
/** Courier lanterns drawn per frame at most (roughly; see _drawAtmosphere). */
const LANTERN_MAX = 300
/**
 * Construction progress of site b in [0, 1] (render-side mirror of buildings.siteProgress:
 * delivered share of the cost up to 0.9, then the raise timer). Reads ctx fields only.
 */
export function siteFraction(B, b) {
  const t = B.type[b]
  const total = SITE_TOTAL[t]
  let have = 0
  const o = b * ITEM_STRIDE
  for (let k = 0; k < SITE_N[t]; k++) {
    const item = SITE_COST[t * 8 + 2 * k], q = SITE_COST[t * 8 + 2 * k + 1]
    const n = B.inv[o + item]
    have += n < q ? n : q
  }
  const d = total > 0 ? have / total : 1
  if (d < 1) return d * 0.9
  const r = B.progress[b] / SITE_RAISE_TICKS
  return 0.9 + 0.1 * (r > 1 ? 1 : r)
}

/** Placeholder for a far-zoom chunk not baked yet (bake budget spent this frame). */
const FLAT_GROUND = '#2f5134'
const MAX_FX_LIFE = 32

/** Recipe ticks per building type (progress bar). */
const RECIPE_TICKS = new Int32Array(BUILDING_COUNT)
/** Far-tier glyph colour per building type. */
const GLYPH_COLOR = new Array(BUILDING_COUNT).fill('#888')
/** Extractor reach / resource per type (ghost). */
const EXT_REACH = new Int8Array(BUILDING_COUNT).fill(-1)
const EXT_RES = new Uint8Array(BUILDING_COUNT)
/** Construction cost per type (sites): flat (item, qty) pairs SITE_COST[t*8 + 2k], k < SITE_N[t]. */
const SITE_COST = new Int32Array(BUILDING_COUNT * 8)
const SITE_N = new Uint8Array(BUILDING_COUNT)
const SITE_TOTAL = new Int32Array(BUILDING_COUNT)
/** Alpha of a construction site's sprite (and far-zoom glyph). */
const SITE_ALPHA = 0.45
const SITE_GLYPH_ALPHA = 0.35
for (let t = 1; t < BUILDING_COUNT; t++) {
  const d = BUILDINGS[t]
  for (let k = 0; k < d.cost.length && k < 4; k++) {
    SITE_COST[t * 8 + 2 * k] = d.cost[k].item
    SITE_COST[t * 8 + 2 * k + 1] = d.cost[k].qty
    SITE_TOTAL[t] += d.cost[k].qty
    SITE_N[t]++
  }
  RECIPE_TICKS[t] = d.recipe ? d.recipe.ticks : 0
  GLYPH_COLOR[t] = d.color
  if (d.extractor) { EXT_REACH[t] = d.extractor.reach; EXT_RES[t] = d.extractor.res }
}
GLYPH_COLOR[B_HEARTH] = '#ffcf7a'

/**
 * Visible chunk range for a visible rect (tile units), clamped to the world. Pure; used by
 * draw() and tests. Writes out.cx0, cy0, cx1, cy1 (inclusive); returns false if empty.
 */
export function visibleChunks(vis, chunksW, chunksH, out) {
  let cx0 = Math.floor(vis.x0 / CHUNK), cy0 = Math.floor(vis.y0 / CHUNK)
  let cx1 = Math.floor(vis.x1 / CHUNK), cy1 = Math.floor(vis.y1 / CHUNK)
  if (cx0 < 0) cx0 = 0
  if (cy0 < 0) cy0 = 0
  if (cx1 > chunksW - 1) cx1 = chunksW - 1
  if (cy1 > chunksH - 1) cy1 = chunksH - 1
  out.cx0 = cx0; out.cy0 = cy0; out.cx1 = cx1; out.cy1 = cy1
  return cx0 <= cx1 && cy0 <= cy1
}

/** Night factor in [0,1] for a tick (0 = full day). */
export function nightFactor(tick) {
  const ph = (tick % DAY_TICKS) / DAY_TICKS
  const v = -Math.cos(ph * Math.PI * 2) // -1 noon .. 1 midnight
  return v <= 0 ? 0 : v
}

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas  the full-viewport #view canvas
   * @param {{dayNight?:boolean, ppt?:number, makeCanvas?:(w:number,h:number)=>any, cacheBudget?:number, bakeMs?:number}} [opts]
   */
  constructor(canvas, opts = {}) {
    this.canvas = canvas
    this.opts = opts
    /** CSS size + device pixel ratio, set by resize() */
    this.cssW = 0
    this.cssH = 0
    this.dpr = 1
    /** per-frame counters for __hw.stats() / debug HUD */
    this.stats = { frameMs: 0, chunksDrawn: 0, chunksBaked: 0, buildingsDrawn: 0, unitsDrawn: 0, fxDrawn: 0 }
    this.dayNight = opts.dayNight !== false
    /** ms of chunk baking allowed per frame (one bake always proceeds) */
    this.bakeMs = opts.bakeMs > 0 ? opts.bakeMs : BAKE_MS
    const mk = opts.makeCanvas || makeCanvas
    this.sprites = /** @type {any} */ (bakeSprites({ ppt: opts.ppt || TILE * 2, makeCanvas: opts.makeCanvas }))
    this.terrain = new TerrainCache(this.sprites, mk, opts.cacheBudget)
    /** @type {CanvasRenderingContext2D|null} */
    this.g = null
    /** @type {Ctx|null} */
    this._ctx = null
    this._frame = 0
    this._time = 0
    this._night = 0
    // frame transform
    this._S = 1; this._ox = 0; this._oy = 0; this._tier = 0; this._alpha = 0
    // scratch (allocated once per ctx binding)
    this._vis = { x0: 0, y0: 0, x1: 0, y1: 0 }
    this._cr = { cx0: 0, cy0: 0, cx1: 0, cy1: 0 }
    this._bList = new Int32Array(0)
    this._bSorted = new Int32Array(0)
    /** far-zoom glyph pass: building types present this frame */
    this._typeSeen = new Uint8Array(BUILDING_COUNT)
    this._dash = [4, 3] // construction-site outline (rescaled per frame; setLineDash copies it)
    this._noDash = []
    this._glowList = new Int32Array(0)
    this._glowCount = 0
    this._bCount = 0
    this._rowCount = new Int32Array(0)
    this._uList = new Int32Array(0)
    this._uCount = 0
    this._facing = new Uint8Array(0)
    this._offX = new Float32Array(0)
    this._offY = new Float32Array(0)
    this._fxCursor = 0
    this._fxRing = null
    this._dash = [6, 5]
    this._noDash = []
  }

  /**
   * Resize the backing store to cssW*dpr x cssH*dpr. Called by main.js on window resize
   * (and once at startup) with the same values passed to camera.resize.
   */
  resize(cssW, cssH, dpr) {
    this.cssW = Math.max(1, cssW)
    this.cssH = Math.max(1, cssH)
    this.dpr = dpr > 0 ? dpr : 1
    this.canvas.width = Math.max(1, Math.round(this.cssW * this.dpr))
    this.canvas.height = Math.max(1, Math.round(this.cssH * this.dpr))
  }

  /** Drop every cached terrain chunk (new map / context replaced). */
  invalidateAll() {
    this.terrain.invalidateAll()
    this._fxCursor = 0
  }

  _bind(ctx) {
    this._ctx = ctx
    const world = ctx.world
    this.terrain.bind(world)
    const bc = ctx.buildings.capacity, uc = ctx.units.capacity
    if (this._bList.length < bc) {
      this._bList = new Int32Array(bc)
      this._bSorted = new Int32Array(bc)
      this._glowList = new Int32Array(bc)
    }
    if (this._uList.length < uc) {
      this._uList = new Int32Array(uc)
      this._facing = new Uint8Array(uc)
      this._offX = new Float32Array(uc)
      this._offY = new Float32Array(uc)
      for (let i = 0; i < uc; i++) {
        const h = hash2(i, 0x5eed, 7)
        this._offX[i] = ((h & 1023) / 1023 - 0.5) * 0.4
        this._offY[i] = (((h >>> 10) & 1023) / 1023 - 0.5) * 0.4
      }
    }
    this._rowCount = new Int32Array(world.h + 2)
    this._fxCursor = 0
    this._fxRing = ctx.fx
  }

  /**
   * Draw one frame.
   * @param {Camera} camera   x,y = view centre (tile units), zoom, viewW/viewH (CSS px), dpr
   * @param {Ctx} ctx         simulation state (read-only)
   * @param {number} alpha    interpolation factor in [0,1): unit draw pos = p + (x - p) * alpha
   * @param {Overlay} overlay selection, ghost, drag box, pings (read-only)
   */
  draw(camera, ctx, alpha, overlay) {
    const t0 = now()
    if (ctx !== this._ctx) this._bind(ctx)
    if (ctx.fx !== this._fxRing) { this._fxRing = ctx.fx; this._fxCursor = 0 }
    let g = this.g
    if (!g) { g = this.g = this.canvas.getContext('2d', { alpha: false }) || this.canvas.getContext('2d'); if (!g) return }
    this._frame++
    this._time = t0
    const st = this.stats
    st.chunksDrawn = 0; st.chunksBaked = 0; st.buildingsDrawn = 0; st.unitsDrawn = 0; st.fxDrawn = 0
    const dpr = this.dpr
    const S = camera.scale * dpr
    this._S = S
    this._ox = camera.viewW * 0.5 * dpr - camera.x * S
    this._oy = camera.viewH * 0.5 * dpr - camera.y * S
    this._tier = camera.tier
    this._alpha = alpha < 0 ? 0 : alpha > 1 ? 1 : alpha
    this._night = this.dayNight ? nightFactor(ctx.tick) : 0
    camera.visibleRect(this._vis)

    g.setTransform(1, 0, 0, 1, 0, 0)
    g.globalAlpha = 1
    g.globalCompositeOperation = 'source-over'
    g.imageSmoothingEnabled = true
    g.fillStyle = '#0b1410'
    g.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this._drawTerrain(g, ctx)
    this._collectBuildings(ctx)
    this._drawBuildings(g, ctx)
    this._drawSelection(g, ctx, overlay)
    this._collectUnits(ctx)
    this._drawUnits(g, ctx)
    this._drawFx(g, ctx)
    this._drawAtmosphere(g, ctx)
    if (overlay) this._drawOverlay(g, ctx, overlay)
    g.globalAlpha = 1
    g.globalCompositeOperation = 'source-over'
    st.frameMs = now() - t0
  }

  // ------------------------------------------------------------ terrain
  _drawTerrain(g, ctx) {
    const world = ctx.world, cache = this.terrain, cr = this._cr
    cache.sync() // repaint felled trees / mined-out rocks in place (no whole-chunk re-bakes)
    if (!visibleChunks(this._vis, world.chunksW, world.chunksH, cr)) return
    const S = this._S, ox = this._ox, oy = this._oy, tier = this._tier, frame = this._frame
    const cw = world.chunksW
    const tStart = now()
    let baked = 0
    for (let cy = cr.cy0; cy <= cr.cy1; cy++) {
      const y0 = Math.round(cy * CHUNK * S + oy), y1 = Math.round((cy + 1) * CHUNK * S + oy)
      for (let cx = cr.cx0; cx <= cr.cx1; cx++) {
        const c = cy * cw + cx
        const key = cache.keyOf(c)
        let cv = cache.fresh(c, tier, key, frame)
        if (!cv) {
          if (baked === 0 || now() - tStart < this.bakeMs) {
            cv = cache.bake(c, tier, key, frame); baked++
          } else {
            // over this frame's bake budget: any older canvas of the chunk, else (cold far
            // zoom-out) a flat ground fill until a later frame gets to it
            cv = cache.any(c, tier, frame)
            if (!cv && tier !== ZOOM_TIER_FAR) { cv = cache.bake(c, ZOOM_TIER_FAR, cache.keyOf(c), frame); baked++ }
          }
        }
        const x0 = Math.round(cx * CHUNK * S + ox), x1 = Math.round((cx + 1) * CHUNK * S + ox)
        if (!cv) { g.fillStyle = FLAT_GROUND; g.fillRect(x0, y0, x1 - x0, y1 - y0); this.stats.chunksDrawn++; continue }
        g.drawImage(cv, x0, y0, x1 - x0, y1 - y0)
        this.stats.chunksDrawn++
      }
    }
    this.stats.chunksBaked = baked
    if (baked > 0) cache.evict(frame)
  }

  // ------------------------------------------------------------ buildings
  _collectBuildings(ctx) {
    const B = ctx.buildings, world = ctx.world, vis = this._vis
    const x0 = vis.x0 - 0.5, x1 = vis.x1 + 0.5, y0 = vis.y0 - 0.5, y1 = vis.y1 + 2.5
    let cx0 = Math.floor(vis.x0 / CHUNK) - 1, cy0 = Math.floor(vis.y0 / CHUNK) - 1
    let cx1 = Math.floor(x1 / CHUNK), cy1 = Math.floor(y1 / CHUNK)
    if (cx0 < 0) cx0 = 0
    if (cy0 < 0) cy0 = 0
    if (cx1 > world.chunksW - 1) cx1 = world.chunksW - 1
    if (cy1 > world.chunksH - 1) cy1 = world.chunksH - 1
    const list = this._bList, rows = this._rowCount, H = world.h
    const alive = B.alive, tx = B.tx, ty = B.ty, bw = B.w, bh = B.h, head = B.chunkHead, next = B.chunkNext
    rows.fill(0)
    let n = 0
    for (let cy = cy0; cy <= cy1; cy++) {
      for (let cx = cx0; cx <= cx1; cx++) {
        for (let b = head[cy * world.chunksW + cx]; b >= 0; b = next[b]) {
          if (!alive[b]) continue
          const bx = tx[b], by = ty[b], w = bw[b], h = bh[b]
          if (bx + w < x0 || bx > x1 || by + h < y0 || by - 2 > y1) continue
          list[n++] = b
          let r = by + h
          if (r > H) r = H
          rows[r + 1]++
        }
      }
    }
    this._bCount = n
    // counting sort by footprint bottom row, then id within a row (insertion sort, tiny runs)
    const out = this._bSorted
    for (let r = 1; r <= H + 1; r++) rows[r] += rows[r - 1]
    for (let k = 0; k < n; k++) {
      const b = list[k]
      let r = ty[b] + bh[b]
      if (r > H) r = H
      out[rows[r]++] = b
    }
    for (let k = 1; k < n; k++) {
      const b = out[k], r = ty[b] + bh[b]
      let j = k - 1
      while (j >= 0 && ty[out[j]] + bh[out[j]] === r && out[j] > b) { out[j + 1] = out[j]; j-- }
      out[j + 1] = b
    }
  }

  _drawBuildings(g, ctx) {
    const B = ctx.buildings, n = this._bCount, list = this._bSorted
    const S = this._S, ox = this._ox, oy = this._oy, tier = this._tier, spr = this.sprites
    const type = B.type, tx = B.tx, ty = B.ty, bw = B.w, bh = B.h
    this._glowCount = 0
    if (tier === ZOOM_TIER_FAR) {
      // one path + fill per building type (glyphs never overlap, so order does not matter);
      // the list is row-sorted, so per-building fillStyle switches would re-parse constantly
      const m = S < 2 ? 2 : 0
      const seen = this._typeSeen
      const site = B.site
      seen.fill(0)
      for (let k = 0; k < n; k++) seen[type[list[k]]] |= site[list[k]] ? 2 : 1
      // built glyphs at full strength, construction sites dimmed (second pass)
      for (let pass = 1; pass <= 2; pass++) {
        g.globalAlpha = pass === 1 ? 1 : SITE_GLYPH_ALPHA
        for (let t = 1; t < BUILDING_COUNT; t++) {
          if (!(seen[t] & pass)) continue
          g.fillStyle = GLYPH_COLOR[t]
          g.beginPath()
          for (let k = 0; k < n; k++) {
            const b = list[k]
            if (type[b] === t && (site[b] ? 2 : 1) === pass) g.rect(tx[b] * S + ox, ty[b] * S + oy, bw[b] * S + m, bh[b] * S + m)
          }
          g.fill()
        }
      }
      g.globalAlpha = 1
      this.stats.buildingsDrawn = n
      return
    }
    const near = tier === ZOOM_TIER_NEAR
    const sprites = near ? spr.buildings : spr.buildingsMid
    const over = spr.buildingOver
    // shadows
    const site = B.site
    g.globalAlpha = 0.6
    for (let k = 0; k < n; k++) {
      const b = list[k]
      if (site[b]) continue
      const x = tx[b], y = ty[b], w = bw[b], h = bh[b]
      g.drawImage(spr.shadow, (x + 0.05) * S + ox, (y + h - 0.55) * S + oy, (w + 0.45) * S, 0.85 * S)
    }
    g.globalAlpha = 1
    const time = this._time
    const status = B.status, paused = B.paused, hp = B.hp, progress = B.progress
    const resInT = B.resInTotal || null
    for (let k = 0; k < n; k++) {
      const b = list[k], t = type[b]
      const x = tx[b], y = ty[b], w = bw[b], h = bh[b], o = over[t]
      const sx = x * S + ox, sy = (y - o) * S + oy
      if (site[b]) { this._drawSite(g, B, b, t, x, y, w, h, o, sprites[t], near); continue }
      g.drawImage(sprites[t], sx, sy, w * S, (h + o) * S)
      const working = status[b] === BS_OK && progress[b] > 0 && !paused[b]
      // chimney smoke
      if (near && SMOKE_X[t] === SMOKE_X[t] && (working || t === B_HEARTH)) {
        const ax = x + SMOKE_X[t], ay = y + SMOKE_Y[t]
        for (let p = 0; p < 3; p++) {
          let ph = time * 0.00035 + p / 3 + (b & 7) * 0.13
          ph -= Math.floor(ph)
          const sz = (0.25 + ph * 0.55) * S
          g.globalAlpha = (1 - ph) * 0.55
          g.drawImage(spr.smoke, (ax + Math.sin(ph * 5 + b) * 0.12 + ph * 0.25) * S + ox - sz * 0.5, (ay - ph * 1.3) * S + oy - sz * 0.5, sz, sz)
        }
        g.globalAlpha = 1
      }
      if (GLOW_KIND[t] && (t !== B_FORGE || working)) this._glowList[this._glowCount++] = b
      // status icon
      let si = 0
      if (paused[b]) si = BS_PAUSED
      else {
        const s = status[b]
        if (s === BS_OUTPUT_FULL || s === BS_DEPLETED || s === BS_NO_STOCK) si = s
        // starved but a delivery is already on its way (or a shrine collecting): not a fault
        else if (s === BS_STARVED && !(resInT !== null && resInT[b] > 0) && !(B_FLAGS[t] & BF_SHRINE)) si = s
      }
      if (si) {
        const ic = spr.status[si]
        let isz = 0.5 * S
        if (isz < 12) isz = 12
        const bob = Math.sin(time * 0.004 + b) * 0.06 * S
        g.drawImage(ic, (x + w * 0.5) * S + ox - isz * 0.5, (y - o * 0.5 - 0.2) * S + oy - isz * 0.5 + bob, isz, isz)
      }
      // gauges (near only): output fill + recipe progress, storage fill
      if (near) {
        const f = B_FLAGS[t]
        const gw = w * 0.7 * S, gx = (x + w * 0.15) * S + ox, gh = 0.07 * S
        let gy = (y + h - 0.16) * S + oy
        if (f & BF_STORAGE) {
          const cap = B_STORAGE[t]
          if (cap > 0) this._bar(g, gx, gy, gw, gh, B.invTotal[b] / cap, '#ffb54a')
        } else if (f & BF_PRODUCER) {
          const out = B_OUT_ITEM[t]
          this._bar(g, gx, gy, gw, gh, B.inv[(b << ITEM_SHIFT) | out] / OUTPUT_CAP, ITEM_COLOR[out])
          const rt = RECIPE_TICKS[t]
          if (rt > 0 && progress[b] > 0) { gy -= gh * 1.6; this._bar(g, gx, gy, gw, gh, progress[b] / rt, '#46e3cf') }
        }
      }
      // HP bar
      const mh = B_HP[t]
      if (hp[b] < mh) {
        const f = hp[b] / mh
        this._bar(g, (x + w * 0.1) * S + ox, (y - Math.min(o, 1) - 0.12) * S + oy, w * 0.8 * S, Math.max(3, 0.1 * S), f, f > 0.6 ? '#8fdc7a' : f > 0.3 ? '#ffb54a' : '#e2574c')
      }
    }
    this.stats.buildingsDrawn = n
  }

  /**
   * A construction site: the building's sprite ghosted at SITE_ALPHA over a dark footing, a
   * dashed amber outline of the footprint, a teal progress bar (delivered share, then the
   * raise) and an HP bar against the site's reduced max when damaged.
   */
  _drawSite(g, B, b, t, x, y, w, h, o, sprite, near) {
    const S = this._S, ox = this._ox, oy = this._oy, dpr = this.dpr
    const fx = x * S + ox, fy = y * S + oy, fw = w * S, fh = h * S
    g.fillStyle = 'rgba(20,14,8,0.35)'
    g.fillRect(fx, fy, fw, fh)
    g.globalAlpha = SITE_ALPHA
    g.drawImage(sprite, fx, (y - o) * S + oy, fw, (h + o) * S)
    g.globalAlpha = 1
    const dash = this._dash
    dash[0] = Math.max(3 * dpr, 0.16 * S); dash[1] = Math.max(2 * dpr, 0.1 * S)
    g.setLineDash(dash)
    g.lineDashOffset = -(this._time * 0.01 * dpr) % (dash[0] + dash[1]) // slow march: "in progress"
    g.strokeStyle = 'rgba(255,181,74,0.85)'
    g.lineWidth = Math.max(1.5 * dpr, 0.05 * S)
    const inset = g.lineWidth * 0.5
    g.strokeRect(fx + inset, fy + inset, fw - inset * 2, fh - inset * 2)
    g.setLineDash(this._noDash)
    g.lineDashOffset = 0
    // progress bar across the lower footprint
    const gw = fw * 0.76, gx = fx + fw * 0.12, gh = Math.max(3 * dpr, (near ? 0.12 : 0.16) * S)
    this._bar(g, gx, fy + fh - gh - Math.max(2 * dpr, 0.14 * S), gw, gh, siteFraction(B, b), '#46e3cf')
    const mh = B_HP[t] * SITE_HP_FRAC
    if (B.hp[b] < mh) {
      const f = B.hp[b] / mh
      this._bar(g, (x + w * 0.1) * S + ox, (y - Math.min(o, 1) - 0.12) * S + oy, w * 0.8 * S, Math.max(3, 0.1 * S), f, f > 0.6 ? '#8fdc7a' : f > 0.3 ? '#ffb54a' : '#e2574c')
    }
  }

  _bar(g, x, y, w, h, f, col) {
    if (f < 0) f = 0; else if (f > 1) f = 1
    g.fillStyle = 'rgba(8,14,10,0.75)'
    g.fillRect(x - 1, y - 1, w + 2, h + 2)
    g.fillStyle = col
    g.fillRect(x, y, w * f, h)
  }

  // ------------------------------------------------------------ selection
  _drawSelection(g, ctx, ov) {
    if (!ov) return
    const S = this._S, ox = this._ox, oy = this._oy, a = this._alpha, dpr = this.dpr
    const B = ctx.buildings
    const lw = (this._tier === ZOOM_TIER_FAR ? 1.5 : 2) * dpr
    const hb = ov.hoverBuilding
    if (hb >= 0 && hb < B.hi && B.alive[hb] && hb !== ov.selBuilding) {
      g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = lw * 0.75
      g.strokeRect(B.tx[hb] * S + ox, B.ty[hb] * S + oy, B.w[hb] * S, B.h[hb] * S)
    }
    const sb = ov.selBuilding
    if (sb >= 0 && B.isAlive(sb, ov.selBuildingGen)) {
      const x = B.tx[sb] * S + ox, y = B.ty[sb] * S + oy, w = B.w[sb] * S, h = B.h[sb] * S
      g.strokeStyle = 'rgba(184,245,154,0.35)'; g.lineWidth = lw * 3
      g.strokeRect(x - lw, y - lw, w + lw * 2, h + lw * 2)
      g.strokeStyle = '#b8f59a'; g.lineWidth = lw
      g.strokeRect(x - lw, y - lw, w + lw * 2, h + lw * 2)
      // rally / door marker
      const d = B.rally[sb] >= 0 ? B.rally[sb] : B.door[sb]
      if (d >= 0) {
        const world = ctx.world
        const dx = (world.tileX(d) + 0.5) * S + ox, dy = (world.tileY(d) + 0.5) * S + oy
        g.fillStyle = B.rally[sb] >= 0 ? '#b8f59a' : 'rgba(255,181,74,0.8)'
        g.beginPath(); g.arc(dx, dy, Math.max(3 * dpr, 0.12 * S), 0, 6.2832); g.fill()
      }
    }
    const U = ctx.units, ring = this.sprites.selectRing
    const far = this._tier === ZOOM_TIER_FAR
    for (let k = 0; k < ov.selCount; k++) {
      const u = ov.sel[k]
      if (!U.isAlive(u, ov.selGen[k])) continue
      let x = U.px[u] + (U.x[u] - U.px[u]) * a, y = U.py[u] + (U.y[u] - U.py[u]) * a
      if (U.type[u] === U_COURIER) { x += this._offX[u]; y += this._offY[u] }
      if (far) {
        g.strokeStyle = '#b8f59a'; g.lineWidth = dpr
        g.strokeRect(x * S + ox - 2 * dpr, y * S + oy - 2 * dpr, 4 * dpr, 4 * dpr)
        continue
      }
      const r = U_RADIUS[U.type[u]] * 1.35
      g.drawImage(ring, (x - r) * S + ox, (y - r * 0.6 + 0.12) * S + oy, r * 2 * S, r * 1.2 * S)
    }
    const hu = ov.hoverUnit
    if (!far && hu >= 0 && hu < U.hi && U.alive[hu] && U.faction[hu] === F_BLIGHT) {
      const x = U.px[hu] + (U.x[hu] - U.px[hu]) * a, y = U.py[hu] + (U.y[hu] - U.py[hu]) * a
      const r = U_RADIUS[U.type[hu]] * 1.35
      g.drawImage(this.sprites.selectRingEnemy, (x - r) * S + ox, (y - r * 0.6 + 0.12) * S + oy, r * 2 * S, r * 1.2 * S)
    }
  }

  // ------------------------------------------------------------ units
  _collectUnits(ctx) {
    const U = ctx.units, grid = ctx.unitGrid, vis = this._vis, out = this._uList
    let n = 0
    if (grid && grid.count > 0) {
      const m = grid.cellSize
      n = grid.queryRect(vis.x0 - m, vis.y0 - m, vis.x1 + m, vis.y1 + m, out)
    } else if (U.count > 0) {
      // grid not built yet (no tick since spawn): bounded linear scan
      const lim = out.length
      for (let i = 0; i < U.hi && n < lim; i++) if (U.alive[i]) out[n++] = i
    }
    this._uCount = n
  }

  _drawUnits(g, ctx) {
    const U = ctx.units, n = this._uCount, list = this._uList
    const S = this._S, ox = this._ox, oy = this._oy, a = this._alpha, tier = this._tier, vis = this._vis
    const alive = U.alive, type = U.type, X = U.x, Y = U.y, PX = U.px, PY = U.py, VX = U.vx, fac = U.faction
    const offX = this._offX, offY = this._offY, facing = this._facing
    const vx0 = vis.x0 - 1.5, vx1 = vis.x1 + 1.5, vy0 = vis.y0 - 1.5, vy1 = vis.y1 + 1.5
    let drawn = 0
    if (tier === ZOOM_TIER_FAR) {
      const d = Math.max(2, Math.min(0.7 * S, 4 * this.dpr)), h = d * 0.5
      // one path + one fill() per colour instead of a fillRect draw call per unit
      for (let pass = 0; pass < 3; pass++) {
        g.fillStyle = pass === 0 ? '#9fe8ff' : pass === 1 ? '#b8f59a' : '#ff5ae0'
        g.beginPath()
        let any = false
        for (let k = 0; k < n; k++) {
          const u = list[k]
          if (!alive[u]) continue
          const t = type[u]
          const p = fac[u] === F_BLIGHT ? 2 : t === U_COURIER ? 0 : 1
          if (p !== pass) continue
          const x = PX[u] + (X[u] - PX[u]) * a, y = PY[u] + (Y[u] - PY[u]) * a
          if (x < vx0 || x > vx1 || y < vy0 || y > vy1) continue
          g.rect(x * S + ox - h, y * S + oy - h, pass === 2 ? d * 1.5 : d, pass === 2 ? d * 1.5 : d)
          drawn++
          any = true
        }
        if (any) g.fill()
      }
      this.stats.unitsDrawn = drawn
      return
    }
    const near = tier === ZOOM_TIER_NEAR
    const spr = this.sprites, frames = spr.units, framesL = spr.unitsFlip, tiles = spr.unitTiles, shadow = spr.shadow, items = spr.items
    const time = this._time
    const mstate = U.mstate, hp = U.hp, cargoItem = U.cargoItem, cargoQty = U.cargoQty
    for (let k = 0; k < n; k++) {
      const u = list[k]
      if (!alive[u]) continue
      const t = type[u]
      let x = PX[u] + (X[u] - PX[u]) * a, y = PY[u] + (Y[u] - PY[u]) * a
      const courier = t === U_COURIER
      if (courier) { x += offX[u]; y += offY[u] }
      if (x < vx0 || x > vx1 || y < vy0 || y > vy1) continue
      const vx = VX[u]
      if (vx < -1e-4) facing[u] = 1; else if (vx > 1e-4) facing[u] = 0
      const moving = mstate[u] === M_MOVING
      const fi = (moving || courier) ? (((time * (moving ? 0.009 : 0.004)) + u * 0.37) | 0) & 3 : 0
      const sz = tiles[t] * S
      const r = U_RADIUS[t]
      if (near) {
        if (courier) g.drawImage(shadow, (x - r * 0.7) * S + ox, (y + 0.22) * S + oy, r * 1.4 * S, r * 0.6 * S)
        else g.drawImage(shadow, (x - r * 1.1) * S + ox, (y + r * 0.35) * S + oy, r * 2.2 * S, r * 0.9 * S)
      }
      const fr = facing[u] ? framesL[t][fi] : frames[t][fi]
      const cx = x * S + ox, cy = (y - 0.1) * S + oy
      g.drawImage(fr, cx - sz * 0.5, cy - sz * 0.5, sz, sz)
      if (courier && cargoQty[u] > 0) {
        const it = cargoItem[u]
        if (it > 0 && items[it]) {
          const is = (near ? 0.36 : 0.45) * S
          g.drawImage(items[it], cx - is * 0.15, cy - is * 0.1, is, is)
        }
      }
      const mh = U_HP[t]
      if (hp[u] < mh) {
        const f = hp[u] / mh
        const bw = Math.max(r * 2, 0.5) * S
        this._bar(g, cx - bw * 0.5, cy - sz * 0.55, bw, Math.max(2, 0.07 * S), f, fac[u] === F_BLIGHT ? '#d070ff' : f > 0.5 ? '#8fdc7a' : '#e2574c')
      }
      drawn++
    }
    this.stats.unitsDrawn = drawn
  }

  // ------------------------------------------------------------ fx
  _drawFx(g, ctx) {
    const fx = ctx.fx
    if (!fx) return
    const tick = ctx.tick
    if (this._fxCursor > fx.written) this._fxCursor = 0
    let cur = this._fxCursor
    const first = fx.first()
    if (cur < first) cur = first
    while (cur < fx.written && tick - fx.tick[cur & fx.mask] >= MAX_FX_LIFE) cur++
    this._fxCursor = cur
    const end = fx.written
    if (cur >= end) return
    const S = this._S, ox = this._ox, oy = this._oy, a = this._alpha, vis = this._vis, spr = this.sprites
    const mask = fx.mask, K = fx.kind, T = fx.tick, X0 = fx.x0, Y0 = fx.y0, X1 = fx.x1, Y1 = fx.y1
    const vx0 = vis.x0 - 3, vx1 = vis.x1 + 3, vy0 = vis.y0 - 3, vy1 = vis.y1 + 3
    const far = this._tier === ZOOM_TIER_FAR
    let drawn = 0
    // pass 1: arrows as one batched path
    g.beginPath()
    let arrows = 0
    for (let n = cur; n < end; n++) {
      const s = n & mask
      if (K[s] !== FX_ARROW) continue
      const age = tick - T[s], life = FX_LIFE[FX_ARROW]
      if (age >= life || age < 0) continue
      let p = (age - 1 + a) / (life - 1)
      if (p < 0) p = 0; else if (p > 1) p = 1
      const x0 = X0[s], y0 = Y0[s], x1 = X1[s], y1 = Y1[s]
      const hx = x0 + (x1 - x0) * p, hy = y0 + (y1 - y0) * p
      if (hx < vx0 || hx > vx1 || hy < vy0 || hy > vy1) continue
      const dx = x1 - x0, dy = y1 - y0
      const len = Math.sqrt(dx * dx + dy * dy) || 1
      const lift = Math.sin(p * Math.PI) * len * 0.12
      const tl = 0.45 / len
      g.moveTo((hx - dx * tl) * S + ox, (hy - dy * tl - lift * 0.9) * S + oy)
      g.lineTo(hx * S + ox, (hy - lift) * S + oy)
      arrows++
    }
    if (arrows) { g.strokeStyle = '#efe2bd'; g.lineWidth = Math.max(1, 0.05 * S); g.stroke() }
    drawn += arrows
    // pass 2: sprites
    for (let n = cur; n < end; n++) {
      const s = n & mask, k = K[s]
      if (k === FX_ARROW) continue
      const age = tick - T[s], life = FX_LIFE[k]
      if (age >= life || age < 0) continue
      let p = (age - 1 + a) / (life - 1)
      if (p < 0) p = 0; else if (p > 1) p = 1
      const q = 1 - p
      switch (k) {
        case FX_BOLT: {
          const hx = X0[s] + (X1[s] - X0[s]) * p, hy = Y0[s] + (Y1[s] - Y0[s]) * p
          if (hx < vx0 || hx > vx1 || hy < vy0 || hy > vy1) continue
          const sz = (far ? 0.9 : 0.55) * S
          g.drawImage(spr.bolt, hx * S + ox - sz * 0.5, hy * S + oy - sz * 0.5, sz, sz)
          break
        }
        case FX_HIT: {
          const hx = X1[s], hy = Y1[s]
          if (hx < vx0 || hx > vx1 || hy < vy0 || hy > vy1 || far) continue
          const sz = (0.25 + 0.5 * q) * S
          g.globalAlpha = q
          g.drawImage(spr.spark, hx * S + ox - sz * 0.5, (hy - 0.15) * S + oy - sz * 0.5, sz, sz)
          break
        }
        case FX_DEATH:
        case FX_DESTROY:
        case FX_BUILD: {
          const hx = X0[s], hy = Y0[s]
          if (hx < vx0 || hx > vx1 || hy < vy0 || hy > vy1) continue
          const big = k === FX_DESTROY ? 3 : k === FX_BUILD ? 2 : 1
          const sz = (0.5 + p * 0.9) * big * S
          g.globalAlpha = q * (k === FX_BUILD ? 0.7 : 0.9)
          g.drawImage(spr.puff, hx * S + ox - sz * 0.5, hy * S + oy - sz * 0.5, sz, sz)
          if (k === FX_DESTROY && !far) {
            g.globalAlpha = q
            const es = 0.35 * S
            for (let e = 0; e < 4; e++) {
              const ang = e * 1.7 + s
              const rr = p * 1.4
              g.drawImage(spr.spark, (hx + Math.cos(ang) * rr) * S + ox - es * 0.5, (hy + Math.sin(ang) * rr - p * 0.6) * S + oy - es * 0.5, es, es)
            }
          } else if (k === FX_BUILD && !far) {
            g.globalAlpha = q * 0.9
            g.strokeStyle = '#e8dcb8'; g.lineWidth = Math.max(1, 0.06 * S)
            g.beginPath(); g.ellipse(hx * S + ox, hy * S + oy, (0.8 + p * 1.4) * S, (0.5 + p * 0.9) * S, 0, 0, 6.2832); g.stroke()
          }
          break
        }
        case FX_SPAWN: {
          const hx = X0[s], hy = Y0[s]
          if (hx < vx0 || hx > vx1 || hy < vy0 || hy > vy1 || far) continue
          const sz = (0.6 + p * 1.2) * S
          g.globalAlpha = q
          g.drawImage(spr.glows[2], hx * S + ox - sz * 0.5, hy * S + oy - sz * 0.5, sz, sz)
          break
        }
        default: continue
      }
      drawn++
    }
    g.globalAlpha = 1
    this.stats.fxDrawn = drawn
  }

  // ------------------------------------------------------------ atmosphere
  _drawAtmosphere(g, ctx) {
    const night = this._night, W = this.canvas.width, H = this.canvas.height
    if (night > 0.01) {
      g.globalAlpha = night * NIGHT_ALPHA
      g.fillStyle = '#0a1636'
      g.fillRect(0, 0, W, H)
      g.globalAlpha = 1
    }
    if (this._tier === ZOOM_TIER_FAR) return
    const S = this._S, ox = this._ox, oy = this._oy, time = this._time, spr = this.sprites
    g.globalCompositeOperation = 'lighter'
    // building glows
    const B = ctx.buildings, list = this._glowList
    for (let k = 0; k < this._glowCount; k++) {
      const b = list[k], t = B.type[b]
      const fl = 0.85 + 0.15 * Math.sin(time * 0.006 + b * 1.7) * Math.sin(time * 0.0023 + b)
      g.globalAlpha = (0.3 + night * 0.55) * fl
      const r = GLOW_R[t] * S
      g.drawImage(spr.glows[GLOW_KIND[t]], (B.tx[b] + GLOW_X[t]) * S + ox - r, (B.ty[b] + GLOW_Y[t]) * S + oy - r, r * 2, r * 2)
    }
    // courier lanterns at night
    if (night > 0.15 && this._tier !== ZOOM_TIER_FAR) {
      const U = ctx.units, n = this._uCount, ul = this._uList, a = this._alpha, vis = this._vis
      const gl = spr.glows[2], r = 0.7 * S
      g.globalAlpha = (night - 0.15) * 0.6
      // additive sprites are fill-rate heavy: past LANTERN_MAX candidates light only every
      // stride-th courier (by id, so the chosen ones stay lit frame to frame)
      const stride = n > LANTERN_MAX ? Math.ceil(n / LANTERN_MAX) : 1
      for (let k = 0; k < n; k++) {
        const u = ul[k]
        if (!U.alive[u] || U.type[u] !== U_COURIER) continue
        if (stride > 1 && u % stride !== 0) continue
        const x = U.px[u] + (U.x[u] - U.px[u]) * a + this._offX[u], y = U.py[u] + (U.y[u] - U.py[u]) * a + this._offY[u]
        if (x < vis.x0 - 1 || x > vis.x1 + 1 || y < vis.y0 - 1 || y > vis.y1 + 1) continue
        g.drawImage(gl, x * S + ox - r, (y - 0.1) * S + oy - r, r * 2, r * 2)
      }
    }
    // fireflies: stateless, one per lucky 4x4-tile cell, drifting
    const vis = this._vis, ff = spr.firefly
    const c0 = Math.floor(vis.x0 / 4), c1 = Math.floor(vis.x1 / 4), r0 = Math.floor(vis.y0 / 4), r1 = Math.floor(vis.y1 / 4)
    if ((c1 - c0 + 1) * (r1 - r0 + 1) <= 4096) {
      const fs = Math.max(4, 0.22 * S) * (1 + night * 0.6)
      const seed = ctx.world.seed | 0
      for (let cy = r0; cy <= r1; cy++) {
        for (let cx = c0; cx <= c1; cx++) {
          const h = hash2(cx, cy, seed + 4242)
          if ((h & 7) !== 0) continue
          const ph = (h >>> 3) & 1023
          const fx = cx * 4 + ((h >>> 13) & 255) / 64 + Math.sin(time * 0.0006 + ph) * 0.9
          const fy = cy * 4 + ((h >>> 21) & 255) / 64 + Math.cos(time * 0.00047 + ph * 1.3) * 0.7
          const blink = 0.5 + 0.5 * Math.sin(time * 0.0031 + ph * 0.7)
          g.globalAlpha = blink * blink * (0.25 + night * 0.75)
          g.drawImage(ff, fx * S + ox - fs * 0.5, fy * S + oy - fs * 0.5, fs, fs)
        }
      }
    }
    g.globalAlpha = 1
    g.globalCompositeOperation = 'source-over'
  }

  // ------------------------------------------------------------ overlay (ghost, drag, ping, debug)
  _drawOverlay(g, ctx, ov) {
    const S = this._S, ox = this._ox, oy = this._oy, dpr = this.dpr, world = ctx.world
    const t = ov.ghostType
    if (t > 0 && t < BUILDING_COUNT) {
      const bx = ov.ghostTx, by = ov.ghostTy, w = B_W[t], h = B_H[t]
      const ok = ov.ghostReason === P_OK
      const reach = EXT_REACH[t]
      if (reach >= 0 && (B_FLAGS[t] & BF_EXTRACTOR)) {
        const rx0 = bx - reach, ry0 = by - reach, rx1 = bx + w + reach, ry1 = by + h + reach
        const res = EXT_RES[t]
        g.fillStyle = 'rgba(70,227,207,0.28)'
        for (let yy = ry0 < 0 ? 0 : ry0; yy < ry1 && yy < world.h; yy++) {
          for (let xx = rx0 < 0 ? 0 : rx0; xx < rx1 && xx < world.w; xx++) {
            const i = (yy << world.shift) | xx
            if (world.res[i] === res && world.resAmt[i] > 0) g.fillRect(xx * S + ox + 1, yy * S + oy + 1, S - 2, S - 2)
          }
        }
        g.setLineDash(this._dash)
        g.strokeStyle = 'rgba(70,227,207,0.85)'; g.lineWidth = 1.5 * dpr
        g.strokeRect(rx0 * S + ox, ry0 * S + oy, (rx1 - rx0) * S, (ry1 - ry0) * S)
        g.setLineDash(this._noDash)
      }
      g.fillStyle = ok ? 'rgba(111,174,106,0.35)' : 'rgba(226,87,76,0.42)'
      g.fillRect(bx * S + ox, by * S + oy, w * S, h * S)
      if (this._tier !== ZOOM_TIER_FAR) {
        const spr = this._tier === ZOOM_TIER_NEAR ? this.sprites.buildings[t] : this.sprites.buildingsMid[t]
        const o = this.sprites.buildingOver[t]
        g.globalAlpha = ok ? 0.7 : 0.45
        g.drawImage(spr, bx * S + ox, (by - o) * S + oy, w * S, (h + o) * S)
        g.globalAlpha = 1
      }
      g.strokeStyle = ok ? '#b8f59a' : '#ff6b5a'; g.lineWidth = 2 * dpr
      g.strokeRect(bx * S + ox, by * S + oy, w * S, h * S)
      // door marker
      const dx = (bx + B_DOOR_DX[t] + 0.5) * S + ox, dy = (by + B_DOOR_DY[t] + 0.5) * S + oy, dr = Math.max(4 * dpr, 0.22 * S)
      g.fillStyle = ok ? 'rgba(255,181,74,0.9)' : 'rgba(255,107,90,0.9)'
      g.beginPath(); g.moveTo(dx, dy - dr); g.lineTo(dx + dr, dy); g.lineTo(dx, dy + dr); g.lineTo(dx - dr, dy); g.closePath(); g.fill()
      // why it is red, right under the ghost (otherwise only a toast after a failed click says)
      if (!ok && ov.ghostReason > 0 && ov.ghostReason < PLACE_REASONS.length) {
        const label = PLACE_REASONS[ov.ghostReason]
        const fs = Math.round(12 * dpr)
        g.font = `600 ${fs}px system-ui, sans-serif`
        g.textAlign = 'center'
        g.textBaseline = 'top'
        const lx = (bx + w * 0.5) * S + ox, ly = (by + h) * S + oy + Math.max(dr + 2 * dpr, 6 * dpr)
        const tw = g.measureText(label).width + 10 * dpr
        g.fillStyle = 'rgba(20,12,10,0.78)'
        g.fillRect(lx - tw * 0.5, ly - 2 * dpr, tw, fs + 5 * dpr)
        g.fillStyle = '#ffb4a8'
        g.fillText(label, lx, ly)
        g.textAlign = 'left'
        g.textBaseline = 'alphabetic'
      }
    }
    if (ov.dragActive) {
      const x0 = Math.min(ov.dragX0, ov.dragX1) * S + ox, y0 = Math.min(ov.dragY0, ov.dragY1) * S + oy
      const w = Math.abs(ov.dragX1 - ov.dragX0) * S, h = Math.abs(ov.dragY1 - ov.dragY0) * S
      g.fillStyle = 'rgba(184,245,154,0.12)'; g.fillRect(x0, y0, w, h)
      g.strokeStyle = '#b8f59a'; g.lineWidth = 1.5 * dpr; g.strokeRect(x0, y0, w, h)
    }
    if (ov.pingTick >= 0) {
      const age = ctx.tick - ov.pingTick + this._alpha
      if (age >= 0 && age < 16) {
        const p = age / 16, r = (0.9 - p * 0.6) * S
        g.globalAlpha = 1 - p
        g.strokeStyle = ov.pingKind === 1 ? '#ff6b5a' : '#b8f59a'; g.lineWidth = 2 * dpr
        g.beginPath(); g.ellipse(ov.pingX * S + ox, ov.pingY * S + oy, r, r * 0.6, 0, 0, 6.2832); g.stroke()
        g.globalAlpha = 1
      }
    }
    if (ov.attackMoveArmed) {
      const cx = ov.cursorX * S + ox, cy = ov.cursorY * S + oy, r = 10 * dpr
      g.strokeStyle = '#ff6b5a'; g.lineWidth = 2 * dpr
      g.beginPath(); g.arc(cx, cy, r, 0, 6.2832)
      g.moveTo(cx - r * 1.5, cy); g.lineTo(cx - r * 0.5, cy); g.moveTo(cx + r * 0.5, cy); g.lineTo(cx + r * 1.5, cy)
      g.moveTo(cx, cy - r * 1.5); g.lineTo(cx, cy - r * 0.5); g.moveTo(cx, cy + r * 0.5); g.lineTo(cx, cy + r * 1.5)
      g.stroke()
    }
    if (ov.showGrid) {
      const cr = this._cr
      if (visibleChunks(this._vis, world.chunksW, world.chunksH, cr)) {
        g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = dpr
        g.beginPath()
        for (let cx = cr.cx0; cx <= cr.cx1 + 1; cx++) { const x = cx * CHUNK * S + ox; g.moveTo(x, cr.cy0 * CHUNK * S + oy); g.lineTo(x, (cr.cy1 + 1) * CHUNK * S + oy) }
        for (let cy = cr.cy0; cy <= cr.cy1 + 1; cy++) { const y = cy * CHUNK * S + oy; g.moveTo(cr.cx0 * CHUNK * S + ox, y); g.lineTo((cr.cx1 + 1) * CHUNK * S + ox, y) }
        g.stroke()
      }
    }
    if (ov.showPaths) {
      const U = ctx.units, a = this._alpha
      g.strokeStyle = 'rgba(255,224,160,0.7)'; g.lineWidth = 1.5 * dpr
      g.beginPath()
      for (let k = 0; k < ov.selCount; k++) {
        const u = ov.sel[k]
        if (!U.isAlive(u, ov.selGen[k])) continue
        const path = U.path[u]
        if (!path) continue
        g.moveTo((U.px[u] + (U.x[u] - U.px[u]) * a) * S + ox, (U.py[u] + (U.y[u] - U.py[u]) * a) * S + oy)
        for (let j = U.pathIdx[u]; j < path.length; j++) {
          const p = path[j]
          g.lineTo(((p & world.mask) + 0.5) * S + ox, ((p >> world.shift) + 0.5) * S + oy)
        }
      }
      g.stroke()
    }
  }
}

/** @returns {Renderer} */
export function createRenderer(canvas, opts) {
  return new Renderer(canvas, opts)
}
