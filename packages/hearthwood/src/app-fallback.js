// Minimal fallback renderer + minimap used by main.js ONLY when the render module's
// Renderer / Minimap throw (e.g. still stubs during parallel development). Plain coloured
// tiles, rects and dots; not the real look. OWNER: app implementer. No DOM at import time.

import { TERRAIN_COUNT, RES_COUNT, U_COURIER, F_BLIGHT, P_OK, MINIMAP_SIZE, BUILDING_COUNT } from './constants.js'
import { BUILDINGS, UNITS, ITEM_COLOR, B_W, B_H } from './content.js'

const TERRAIN_RGB = [[52, 92, 50], [44, 80, 46], [92, 78, 54], [30, 64, 88], [86, 92, 84]]
const RES_RGB = [[0, 0, 0], [24, 58, 30], [128, 138, 130], [138, 74, 50], [47, 208, 187], [170, 184, 255]]
const B_COLOR = BUILDINGS.map((d) => (d ? d.color : '#000'))
const U_COLOR = UNITS.map((d) => (d ? d.color : '#000'))

export class FallbackRenderer {
  constructor(canvas) {
    this.canvas = canvas
    this.g = canvas.getContext('2d')
    this.cssW = 0; this.cssH = 0; this.dpr = 1
    this.stats = { frameMs: 0, chunksDrawn: 0, chunksBaked: 0, buildingsDrawn: 0, unitsDrawn: 0, fxDrawn: 0 }
    this.map = null
    this.mapCtx = null
    this.mapVer = -1
    this.scratch = new Int32Array(65536)
    this._p = { x: 0, y: 0 }
    this._r = { x0: 0, y0: 0, x1: 0, y1: 0 }
    this.frame = 0
  }

  resize(cssW, cssH, dpr) {
    this.cssW = cssW; this.cssH = cssH; this.dpr = dpr
    this.canvas.width = Math.round(cssW * dpr)
    this.canvas.height = Math.round(cssH * dpr)
  }

  invalidateAll() { this.mapVer = -1; this.mapCtx = null }

  /** 1 px per tile image of terrain + resources, rebuilt when any chunkVersion changes. */
  terrainImage(ctx) {
    const world = ctx.world
    if (this.mapCtx !== ctx) { this.mapCtx = ctx; this.mapVer = -1 }
    if (this.mapVer >= 0 && this.frame % 30 !== 0) return this.map
    let ver = 0
    for (let c = 0; c < world.chunkCount; c++) ver = (ver + world.chunkVersion[c] * (c + 1)) >>> 0
    if (ver === this.mapVer && this.map) return this.map
    this.mapVer = ver
    if (!this.map || this.map.width !== world.w || this.map.height !== world.h) {
      this.map = document.createElement('canvas')
      this.map.width = world.w; this.map.height = world.h
    }
    const g = this.map.getContext('2d')
    const img = g.createImageData(world.w, world.h)
    const d = img.data
    for (let i = 0; i < world.size; i++) {
      const r = world.res[i]
      const c = r > 0 && r < RES_COUNT && world.resAmt[i] > 0 ? RES_RGB[r] : TERRAIN_RGB[world.terrain[i] % TERRAIN_COUNT]
      const k = i << 2
      d[k] = c[0]; d[k + 1] = c[1]; d[k + 2] = c[2]; d[k + 3] = 255
    }
    g.putImageData(img, 0, 0)
    return this.map
  }

  draw(camera, ctx, alpha, overlay) {
    const t0 = performance.now()
    this.frame++
    const g = this.g
    const dpr = this.dpr
    g.setTransform(dpr, 0, 0, dpr, 0, 0)
    g.fillStyle = '#0b1410'
    g.fillRect(0, 0, this.cssW, this.cssH)
    const s = camera.scale
    const ox = camera.viewW * 0.5 - camera.x * s, oy = camera.viewH * 0.5 - camera.y * s
    g.imageSmoothingEnabled = false
    g.drawImage(this.terrainImage(ctx), ox, oy, ctx.world.w * s, ctx.world.h * s)
    const r = camera.visibleRect(this._r)
    // buildings
    const B = ctx.buildings
    let nb = 0
    for (let b = 0; b < B.hi; b++) {
      if (!B.alive[b]) continue
      const x = B.tx[b], y = B.ty[b], w = B.w[b], h = B.h[b]
      if (x + w < r.x0 || y + h < r.y0 || x > r.x1 || y > r.y1) continue
      const sx = ox + x * s, sy = oy + y * s
      g.fillStyle = B_COLOR[B.type[b]]
      g.fillRect(sx + 1, sy + 1, w * s - 2, h * s - 2)
      if (s > 10) {
        g.strokeStyle = b === overlay.selBuilding ? '#ffb54a' : 'rgba(0,0,0,0.6)'
        g.lineWidth = b === overlay.selBuilding ? 2 : 1
        g.strokeRect(sx + 1, sy + 1, w * s - 2, h * s - 2)
        const d = B.door[b], wm = ctx.world.mask, sh = ctx.world.shift
        g.fillStyle = 'rgba(0,0,0,0.35)'
        g.fillRect(ox + (d & wm) * s + s * 0.3, oy + (d >> sh) * s, s * 0.4, s * 0.3)
      }
      nb++
    }
    // units
    const U = ctx.units
    const n = ctx.unitGrid.queryRect(r.x0 - 1, r.y0 - 1, r.x1 + 1, r.y1 + 1, this.scratch)
    const rad = Math.max(1.5, s * 0.22)
    let nu = 0
    for (let k = 0; k < n; k++) {
      const id = this.scratch[k]
      if (!U.alive[id]) continue
      const x = U.px[id] + (U.x[id] - U.px[id]) * alpha, y = U.py[id] + (U.y[id] - U.py[id]) * alpha
      const sx = ox + x * s, sy = oy + y * s
      const t = U.type[id]
      const rr = t === U_COURIER ? rad * 0.8 : rad * 1.3
      g.fillStyle = U.faction[id] === F_BLIGHT ? '#a24bd1' : U_COLOR[t]
      g.fillRect(sx - rr, sy - rr, rr * 2, rr * 2)
      if (U.cargoQty[id] > 0 && s > 8) {
        g.fillStyle = ITEM_COLOR[U.cargoItem[id]]
        g.fillRect(sx - rr * 0.5, sy - rr * 1.9, rr, rr)
      }
      nu++
    }
    // selection
    g.strokeStyle = '#8fdc7a'
    g.lineWidth = 1.5
    for (let k = 0; k < overlay.selCount; k++) {
      const id = overlay.sel[k]
      if (!U.alive[id] || U.gen[id] !== overlay.selGen[k]) continue
      const sx = ox + U.x[id] * s, sy = oy + U.y[id] * s
      g.strokeRect(sx - rad * 1.8, sy - rad * 1.8, rad * 3.6, rad * 3.6)
    }
    // ghost
    if (overlay.ghostType > 0 && overlay.ghostType < BUILDING_COUNT) {
      const t = overlay.ghostType
      g.fillStyle = overlay.ghostReason === P_OK ? 'rgba(120,230,120,0.45)' : 'rgba(230,80,70,0.45)'
      g.fillRect(ox + overlay.ghostTx * s, oy + overlay.ghostTy * s, B_W[t] * s, B_H[t] * s)
      const d = BUILDINGS[t]
      if (d.extractor) {
        const re = d.extractor.reach
        g.strokeStyle = 'rgba(255,255,255,0.35)'
        g.strokeRect(ox + (overlay.ghostTx - re) * s, oy + (overlay.ghostTy - re) * s, (B_W[t] + 2 * re) * s, (B_H[t] + 2 * re) * s)
      }
    }
    if (overlay.dragActive) {
      const x0 = ox + Math.min(overlay.dragX0, overlay.dragX1) * s, y0 = oy + Math.min(overlay.dragY0, overlay.dragY1) * s
      const w = Math.abs(overlay.dragX1 - overlay.dragX0) * s, h = Math.abs(overlay.dragY1 - overlay.dragY0) * s
      g.fillStyle = 'rgba(143,220,122,0.12)'
      g.fillRect(x0, y0, w, h)
      g.strokeStyle = '#8fdc7a'
      g.strokeRect(x0, y0, w, h)
    }
    this.stats.buildingsDrawn = nb
    this.stats.unitsDrawn = nu
    this.stats.frameMs = performance.now() - t0
  }

  /** Fallback minimap: terrain image + building/unit pixels + view rect. */
  drawMinimap(canvas, camera, ctx) {
    const g = canvas.getContext('2d')
    const W = canvas.width || MINIMAP_SIZE, H = canvas.height || MINIMAP_SIZE
    const world = ctx.world
    const kx = W / world.w, ky = H / world.h
    g.imageSmoothingEnabled = false
    g.drawImage(this.terrainImage(ctx), 0, 0, W, H)
    const B = ctx.buildings
    g.fillStyle = '#ffb54a'
    for (let b = 0; b < B.hi; b++) if (B.alive[b]) g.fillRect(B.tx[b] * kx, B.ty[b] * ky, Math.max(1, B.w[b] * kx), Math.max(1, B.h[b] * ky))
    const U = ctx.units
    g.fillStyle = '#d070ff'
    for (let i = 0; i < U.hi; i++) if (U.alive[i] && U.faction[i] === F_BLIGHT) g.fillRect(U.x[i] * kx - 1, U.y[i] * ky - 1, 2, 2)
    const r = camera.visibleRect(this._r)
    g.strokeStyle = '#e3ead9'
    g.lineWidth = 1
    g.strokeRect(r.x0 * kx, r.y0 * ky, (r.x1 - r.x0) * kx, (r.y1 - r.y0) * ky)
  }
}
