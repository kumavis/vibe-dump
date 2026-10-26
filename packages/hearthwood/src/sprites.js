// Procedural sprite baking. OWNER: render implementer. Contract: ARCHITECTURE.md §16.3.
// No DOM access at import time: canvases are created inside functions only.
// Everything is drawn with Canvas 2D paths/gradients from a seeded RNG -> deterministic.

import {
  TILE, BUILDING_COUNT, UNIT_COUNT, ITEM_COUNT, RES_COUNT, TERRAIN_COUNT,
  T_GRASS, T_MOSS, T_DIRT, T_WATER, T_CLIFF,
  R_TREE, R_STONE, R_ORE, R_GLOWCAP, R_MOONSTONE,
  I_WOOD, I_STONE, I_ORE, I_GLOWCAP, I_MOONSTONE, I_PLANK, I_INGOT, I_TOOL, I_CHARM, I_RELIC,
  BS_STARVED, BS_OUTPUT_FULL, BS_DEPLETED, BS_PAUSED, BS_NO_STOCK, BS_IDLE,
} from './constants.js'
import { B_W, B_H, ITEM_COLOR } from './content.js'
import { RNG } from './rng.js'
import {
  TAU, PAL, shade, rgba, rr, circle, ell, poly, line, lin, rad, glowBlob, canopy, mushroom, crystal,
} from './render-paint.js'
import { BUILDING_OVER, UNIT_TILES, drawBuilding, drawUnit } from './render-art.js'

/**
 * @typedef {HTMLCanvasElement|OffscreenCanvas} AnyCanvas
 *
 * @typedef {Object} SpriteSet
 * @property {number} ppt                 baked pixels per tile (e.g. TILE * 2 = 64 for crispness up to zoom 2)
 * @property {AnyCanvas[]} buildings      [B_*] full-detail sprite, size (w*ppt) x ((h+over)*ppt)
 * @property {Float32Array} buildingOver  [B_*] tiles of vertical overhang above the footprint (roofs, canopies)
 * @property {AnyCanvas[]} buildingsMid   [B_*] simplified sprite for ZOOM_TIER_MID (same geometry, fewer details)
 * @property {AnyCanvas[][]} units        [U_*][frame] sprites for faction-default colouring, UNIT_FRAMES frames
 * @property {AnyCanvas[]} items          [I_*] small cargo/HUD icons (ICON_PX square)
 * @property {AnyCanvas[][]} resources    [R_*][variant] per-tile resource decals for chunk baking
 * @property {AnyCanvas[][]} terrain      [T_*][variant] per-tile ground textures for chunk baking
 * @property {AnyCanvas} glow             radial amber glow (additive) for hearth/forge
 * @property {AnyCanvas} shadow           soft ellipse shadow
 * @property {AnyCanvas} selectRing       unit selection ring
 *
 * Render-private extras (same object): unitsFlip [U_*][frame] mirrored (facing left), unitTiles,
 * midPpt, itemPx, resOver / resSide (tiles of decal overhang above / beside the tile), glows[kind] (0 unused, 1 amber,
 * 2 teal, 3 moon, 4 ember, 5 blight), status[BS_*] (null = no icon), smoke, spark, puff, bolt,
 * firefly, selectRingEnemy, terrainColor[T_*] / resColor[R_*] (CSS strings for far-tier baking).
 */

export const UNIT_FRAMES = 4
export const ICON_PX = 16
export const RES_VARIANTS = 4
export const TERRAIN_VARIANTS = 4
/** Item icons are baked at 2x ICON_PX so cargo stays crisp at near zoom on hi-dpi screens. */
export const ITEM_BAKE_PX = ICON_PX * 2
/**
 * Resource decals are (ppt * (1 + 2*RES_SIDE)) x (ppt * (1 + RES_OVER)); the tile is the bottom
 * ppt rows, inset RES_SIDE*ppt from the left. Crowns spill over neighbouring tiles.
 */
export const RES_OVER = 0.6
export const RES_SIDE = 0.25

/** Base CSS colours (far-tier chunk pixels + minimap). */
export const TERRAIN_COLOR = Object.freeze(['#2e5233', '#3c6b42', '#5a4630', '#173a48', '#4d5852'])
export const RES_COLOR = Object.freeze(['#000000', '#1f4a2a', '#8a968c', '#8a4a32', '#2fd0bb', '#aab8ff'])

let _factory = null
let _shared = null

/** Test / embedding hook: override the canvas constructor used by makeCanvas (null restores default). */
export function setCanvasFactory(fn) { _factory = fn || null }

/**
 * Create a canvas of the given pixel size (OffscreenCanvas when available, else a DOM canvas).
 * Call-time only. @returns {AnyCanvas}
 */
export function makeCanvas(w, h) {
  w = Math.max(1, Math.ceil(w)); h = Math.max(1, Math.ceil(h))
  if (_factory) return _factory(w, h)
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    return c
  }
  throw new Error('hearthwood: no canvas implementation available')
}

function g2d(c) { return c.getContext('2d') }

// ---------------------------------------------------------------- terrain tiles
function bakeTerrain(mk, t, v, s) {
  const c = mk(s, s), g = g2d(c)
  const rng = new RNG(0x7e44a1 + t * 97 + v * 13)
  // grass and moss share a texture base: their colour difference comes from the renderer's
  // smooth per-chunk wash, so patches blend instead of reading as tile squares
  const base = t === T_GRASS || t === T_MOSS ? '#355d3b' : t === T_DIRT ? '#4c4a33' : TERRAIN_COLOR[t]
  g.fillStyle = base; g.fillRect(0, 0, s, s)
  const n = Math.round((s * s) / 90)
  switch (t) {
    case T_GRASS:
    case T_MOSS: {
      const a = t === T_GRASS ? ['#36603a', '#41703f', '#28472c', '#4d7f46'] : ['#40744a', '#4f8a50', '#2f5a38', '#5f9a5c']
      for (let i = 0; i < n * 0.35; i++) ell(g, rng.float() * s, rng.float() * s, s * (0.08 + rng.float() * 0.12), s * (0.05 + rng.float() * 0.08), rgba(a[i & 3], 0.35))
      g.lineWidth = Math.max(1, s / 40)
      for (let i = 0; i < n; i++) {
        const x = rng.float() * s, y = rng.float() * s, h = s * (0.04 + rng.float() * 0.07)
        g.strokeStyle = a[(rng.float() * 4) | 0]
        g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rng.float() - 0.5) * h * 0.6, y - h); g.stroke()
      }
      if (t === T_MOSS && v < 2) for (let i = 0; i < 2; i++) circle(g, rng.float() * s, rng.float() * s, s * 0.025, rgba('#e8f0b0', 0.7))
      if (t === T_GRASS && v === 3) for (let i = 0; i < 3; i++) circle(g, rng.float() * s, rng.float() * s, s * 0.022, i & 1 ? '#d8c0ff' : '#fff3b0')
      return c
    }
    case T_DIRT: {
      for (let i = 0; i < n * 0.4; i++) ell(g, rng.float() * s, rng.float() * s, s * (0.06 + rng.float() * 0.12), s * (0.04 + rng.float() * 0.08), rgba(i & 1 ? '#6a5438' : '#4a3a28', 0.45))
      for (let i = 0; i < n * 0.25; i++) ell(g, rng.float() * s, rng.float() * s, s * 0.03, s * 0.022, i & 1 ? '#7a6a58' : '#3a2c1e')
      return c
    }
    case T_WATER: {
      g.lineWidth = Math.max(1, s / 32)
      for (let i = 0; i < 4; i++) {
        const x = rng.float() * s, y = rng.float() * s, w = s * (0.15 + rng.float() * 0.2)
        g.strokeStyle = rgba('#7fc4cf', 0.25 + rng.float() * 0.2)
        g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x, y - s * 0.04, x + w, y); g.stroke()
      }
      return c
    }
    case T_CLIFF: {
      for (let i = 0; i < 6; i++) ell(g, rng.float() * s, rng.float() * s, s * (0.15 + rng.float() * 0.15), s * (0.1 + rng.float() * 0.1), rgba(i & 1 ? '#5d6a62' : '#3f4944', 0.6))
      g.strokeStyle = rgba('#22292a', 0.6); g.lineWidth = Math.max(1, s / 40)
      for (let i = 0; i < 5; i++) { const x = rng.float() * s, y = rng.float() * s; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (rng.float() - 0.5) * s * 0.4, y + rng.float() * s * 0.3); g.stroke() }
      for (let i = 0; i < 4; i++) ell(g, rng.float() * s, rng.float() * s * 0.6, s * (0.1 + rng.float() * 0.1), s * 0.06, rgba(PAL.moss, 0.55))
      return c
    }
  }
  return c
}

// ---------------------------------------------------------------- resource decals
function bakeResource(mk, r, v, s) {
  const W = Math.round(s * (1 + 2 * RES_SIDE)), H = Math.round(s * (1 + RES_OVER))
  const c = mk(W, H), g = g2d(c)
  const rng = new RNG(0x5e5 + r * 131 + v * 7)
  g.translate(Math.round(s * RES_SIDE), H - s) // local tile space: (0,0)-(s,s) is the tile
  switch (r) {
    case R_TREE: {
      // forest floor shade, then one big crown (sometimes two) that spills over neighbours
      ell(g, s * 0.5, s * 0.62, s * 0.55, s * 0.38, rgba('#06140a', 0.45))
      const k = v === 3 ? 2 : 1
      for (let i = 0; i < k; i++) {
        const x = s * (0.5 + (rng.float() - 0.5) * 0.3) + (k > 1 ? (i ? s * 0.2 : -s * 0.2) : 0)
        const y = s * (0.38 + rng.float() * 0.12) + (k > 1 ? (i ? s * 0.12 : -s * 0.05) : 0)
        const rr0 = s * (k > 1 ? 0.36 : 0.46 + rng.float() * 0.06)
        g.fillStyle = PAL.barkD; g.fillRect(x - s * 0.05, y + rr0 * 0.4, s * 0.1, s * 0.3)
        const base = ['#245a30', '#2f6b3a', '#1f4f33', '#36703c'][(v + i * 2) & 3]
        canopy(g, x, y, rr0, rr0 * 0.92, base, rng, 7)
      }
      if (v === 1) circle(g, s * 0.35, s * 0.2, s * 0.035, '#f0e0ff')
      if (v === 2) glowBlob(g, s * 0.62, s * 0.05, s * 0.1, '#e9ff9a', 0.9)
      return c
    }
    case R_STONE: {
      const k = 2 + (v % 3 === 0 ? 1 : 0)
      for (let i = 0; i < k; i++) {
        const x = s * (0.22 + rng.float() * 0.56), y = s * (0.35 + rng.float() * 0.4), w = s * (0.22 + rng.float() * 0.14)
        ell(g, x + w * 0.2, y + w * 0.4, w * 1.05, w * 0.42, rgba('#000000', 0.32))
        g.fillStyle = lin(g, x - w, y - w, x + w, y + w, [0, PAL.stoneL, 1, PAL.stoneD])
        g.beginPath(); g.ellipse(x, y, w, w * 0.75, 0, 0, TAU); g.fill()
        ell(g, x - w * 0.2, y - w * 0.45, w * 0.6, w * 0.25, rgba(PAL.moss, 0.85))
      }
      return c
    }
    case R_ORE: {
      ell(g, s * 0.5, s * 0.6, s * 0.5, s * 0.34, rgba('#2a2418', 0.6))
      ell(g, s * (0.35 + v * 0.08), s * 0.72, s * 0.16, s * 0.07, rgba('#5a7a6a', 0.7))
      for (let i = 0; i < 3; i++) {
        const x = s * (0.25 + rng.float() * 0.5), y = s * (0.35 + rng.float() * 0.35), w = s * (0.14 + rng.float() * 0.08)
        poly(g, [x - w, y + w * 0.5, x - w * 0.6, y - w * 0.6, x + w * 0.4, y - w * 0.8, x + w, y + w * 0.3, x + w * 0.2, y + w * 0.7], '#5b3a2a')
        poly(g, [x - w * 0.6, y - w * 0.6, x + w * 0.4, y - w * 0.8, x + w * 0.1, y], '#8a4a32')
        circle(g, x + w * 0.2, y - w * 0.1, w * 0.18, '#d0743e')
      }
      return c
    }
    case R_GLOWCAP: {
      const k = 3 + (v & 1)
      for (let i = 0; i < k; i++) {
        mushroom(g, s * (0.15 + rng.float() * 0.7), s * (0.4 + rng.float() * 0.5), s * (0.24 + rng.float() * 0.16), i & 1 ? PAL.teal : '#2fd0bb', true)
      }
      return c
    }
    case R_MOONSTONE: {
      ell(g, s * 0.5, s * 0.72, s * 0.4, s * 0.17, rgba('#000000', 0.3))
      glowBlob(g, s * 0.5, s * 0.45, s * 0.55, PAL.moon, 0.35)
      for (let i = 0; i < 3; i++) crystal(g, s * (0.28 + rng.float() * 0.44), s * (0.65 + rng.float() * 0.2), s * (0.35 + rng.float() * 0.3), i === 1 ? '#e2e8ff' : PAL.moon)
      return c
    }
  }
  return c
}

// ---------------------------------------------------------------- items
/** Draw item icon into g at (0,0) size s. Exported for the HUD and tests. */
export function drawItem(g, item, s) {
  const c = s / 2
  switch (item) {
    case I_WOOD:
      g.fillStyle = lin(g, 0, c - s * 0.2, 0, c + s * 0.2, [0, '#b07a46', 1, '#6b4a2f']); rr(g, s * 0.1, c - s * 0.2, s * 0.7, s * 0.4, s * 0.12); g.fill()
      ell(g, s * 0.78, c, s * 0.12, s * 0.2, '#dcae66'); ell(g, s * 0.78, c, s * 0.05, s * 0.09, '#9b6a3c')
      return
    case I_STONE:
      poly(g, [s * 0.15, s * 0.7, s * 0.25, s * 0.3, s * 0.6, s * 0.18, s * 0.86, s * 0.45, s * 0.75, s * 0.8], '#93a096')
      poly(g, [s * 0.25, s * 0.3, s * 0.6, s * 0.18, s * 0.55, s * 0.45], '#b5c0b3')
      ell(g, s * 0.4, s * 0.3, s * 0.14, s * 0.06, '#6fae6a')
      return
    case I_ORE:
      poly(g, [s * 0.15, s * 0.65, s * 0.3, s * 0.25, s * 0.7, s * 0.2, s * 0.88, s * 0.6, s * 0.6, s * 0.85], '#5b3a2a')
      for (let i = 0; i < 4; i++) circle(g, s * (0.35 + (i & 1) * 0.25), s * (0.4 + (i >> 1) * 0.22), s * 0.08, '#d0743e')
      return
    case I_GLOWCAP: mushroom(g, c, s * 0.88, s * 0.75, '#3fe0c8', true); return
    case I_MOONSTONE: glowBlob(g, c, c, s * 0.45, PAL.moon, 0.5); crystal(g, c, s * 0.88, s * 0.75, '#c8d4ff'); return
    case I_PLANK:
      for (let i = 0; i < 3; i++) {
        g.fillStyle = i & 1 ? '#c8984f' : '#dcae66'; g.fillRect(s * 0.12, s * (0.25 + i * 0.18), s * 0.76, s * 0.15)
        g.fillStyle = '#8f6a3e'; g.fillRect(s * 0.12, s * (0.37 + i * 0.18), s * 0.76, s * 0.03)
      }
      return
    case I_INGOT:
      poly(g, [s * 0.1, s * 0.7, s * 0.25, s * 0.38, s * 0.75, s * 0.38, s * 0.9, s * 0.7], '#8a949e')
      poly(g, [s * 0.25, s * 0.38, s * 0.75, s * 0.38, s * 0.68, s * 0.5, s * 0.32, s * 0.5], '#d6dde4')
      return
    case I_TOOL:
      line(g, s * 0.25, s * 0.8, s * 0.62, s * 0.35, '#9b6a3c', s * 0.12)
      g.save(); g.translate(s * 0.62, s * 0.32); g.rotate(-0.85)
      g.fillStyle = '#b9c2cc'; g.fillRect(-s * 0.26, -s * 0.11, s * 0.52, s * 0.22)
      g.fillStyle = '#e8b04b'; g.fillRect(-s * 0.26, -s * 0.11, s * 0.08, s * 0.22)
      g.restore()
      return
    case I_CHARM:
      line(g, c, s * 0.08, c, s * 0.3, '#dcae66', Math.max(1, s * 0.05))
      glowBlob(g, c, s * 0.58, s * 0.38, '#7ef0a8', 0.5)
      g.fillStyle = '#7ef0a8'
      g.beginPath(); g.moveTo(c, s * 0.28); g.quadraticCurveTo(s * 0.8, s * 0.55, c, s * 0.9); g.quadraticCurveTo(s * 0.2, s * 0.55, c, s * 0.28); g.fill()
      line(g, c, s * 0.35, c, s * 0.82, '#3e8a5a', Math.max(1, s * 0.04))
      return
    case I_RELIC:
      glowBlob(g, c, c, s * 0.5, '#f6dc84', 0.7)
      for (let i = 0; i < 5; i++) { const a = (i / 5) * TAU - Math.PI / 2; ell(g, c + Math.cos(a) * s * 0.2, c + Math.sin(a) * s * 0.2, s * 0.14, s * 0.14, '#f6dc84') }
      circle(g, c, c, s * 0.12, '#fff6d0')
      return
    default:
      circle(g, c, c, s * 0.3, ITEM_COLOR[item] || '#888')
  }
}

// ---------------------------------------------------------------- status icons
function bakeStatus(mk, bs, s) {
  const c = mk(s, s), g = g2d(c), m = s / 2
  const ring = (col) => { circle(g, m, m, s * 0.46, '#14201a'); circle(g, m, m, s * 0.4, col) }
  switch (bs) {
    case BS_STARVED: ring('#c9822a'); for (let i = 0; i < 3; i++) circle(g, s * (0.3 + i * 0.2), m, s * 0.07, '#fff3d0'); break
    case BS_OUTPUT_FULL: ring('#3e8a5a'); g.fillStyle = '#e3ead9'; g.fillRect(s * 0.3, s * 0.32, s * 0.4, s * 0.36); g.fillStyle = '#3e8a5a'; g.fillRect(s * 0.3, s * 0.44, s * 0.4, s * 0.05); break
    case BS_DEPLETED: ring('#6a6a6a'); line(g, s * 0.32, s * 0.32, s * 0.68, s * 0.68, '#eee', s * 0.1); line(g, s * 0.68, s * 0.32, s * 0.32, s * 0.68, '#eee', s * 0.1); break
    case BS_PAUSED: ring('#4a6aa0'); g.fillStyle = '#eef'; g.fillRect(s * 0.33, s * 0.3, s * 0.12, s * 0.4); g.fillRect(s * 0.55, s * 0.3, s * 0.12, s * 0.4); break
    case BS_NO_STOCK: ring('#b8433a'); circle(g, m, m, s * 0.2, '#f2c35a'); line(g, s * 0.3, s * 0.7, s * 0.7, s * 0.3, '#fff', s * 0.08); break
    case BS_IDLE: ring('#55605a'); circle(g, s * 0.38, m, s * 0.06, '#ddd'); circle(g, s * 0.62, m, s * 0.06, '#ddd'); break
    default: return null
  }
  return c
}

// ---------------------------------------------------------------- misc
function bakeGlow(mk, s, col, a) {
  const c = mk(s, s), g = g2d(c), m = s / 2
  g.fillStyle = rad(g, m, m, 0, m, [0, rgba(col, a), 0.35, rgba(col, a * 0.45), 1, rgba(col, 0)])
  g.fillRect(0, 0, s, s)
  return c
}

/**
 * Bake every sprite once (deterministic, procedural, woodland-fantasy palette).
 * Budget: < 150 ms total. Called once by the Renderer constructor.
 * @param {{ppt?:number, makeCanvas?:(w:number,h:number)=>AnyCanvas}} [opts]
 * @returns {SpriteSet}
 */
export function bakeSprites(opts = {}) {
  const ppt = Math.max(8, Math.round(opts.ppt || TILE * 2))
  const mk = opts.makeCanvas || makeCanvas
  const midPpt = Math.max(8, ppt >> 1)
  const set = /** @type {any} */ ({ ppt, midPpt, buildingOver: BUILDING_OVER, unitTiles: UNIT_TILES, resOver: RES_OVER, resSide: RES_SIDE, itemPx: ITEM_BAKE_PX })

  set.buildings = new Array(BUILDING_COUNT).fill(null)
  set.buildingsMid = new Array(BUILDING_COUNT).fill(null)
  for (let t = 1; t < BUILDING_COUNT; t++) {
    const w = B_W[t], h = B_H[t], over = BUILDING_OVER[t]
    let c = mk(w * ppt, Math.round((h + over) * ppt))
    drawBuilding(g2d(c), t, w, h, ppt, true, new RNG(0xb0 + t * 31))
    set.buildings[t] = c
    c = mk(w * midPpt, Math.round((h + over) * midPpt))
    drawBuilding(g2d(c), t, w, h, midPpt, false, new RNG(0xb0 + t * 31))
    set.buildingsMid[t] = c
  }

  set.units = new Array(UNIT_COUNT).fill(null)
  set.unitsFlip = new Array(UNIT_COUNT).fill(null)
  for (let t = 1; t < UNIT_COUNT; t++) {
    const s = Math.round(UNIT_TILES[t] * ppt)
    const fr = [], fl = []
    for (let f = 0; f < UNIT_FRAMES; f++) {
      const a = mk(s, s)
      drawUnit(g2d(a), t, s, f / UNIT_FRAMES)
      fr.push(a)
      const b = mk(s, s), gb = g2d(b)
      gb.translate(s, 0); gb.scale(-1, 1)
      drawUnit(gb, t, s, f / UNIT_FRAMES)
      fl.push(b)
    }
    set.units[t] = fr
    set.unitsFlip[t] = fl
  }

  set.items = new Array(ITEM_COUNT).fill(null)
  for (let i = 1; i < ITEM_COUNT; i++) {
    const c = mk(ITEM_BAKE_PX, ITEM_BAKE_PX)
    drawItem(g2d(c), i, ITEM_BAKE_PX)
    set.items[i] = c
  }

  set.terrain = []
  for (let t = 0; t < TERRAIN_COUNT; t++) {
    const vs = []
    for (let v = 0; v < TERRAIN_VARIANTS; v++) vs.push(bakeTerrain(mk, t, v, ppt))
    set.terrain.push(vs)
  }
  set.resources = [[]]
  for (let r = 1; r < RES_COUNT; r++) {
    const vs = []
    for (let v = 0; v < RES_VARIANTS; v++) vs.push(bakeResource(mk, r, v, ppt))
    set.resources.push(vs)
  }

  const gs = ppt * 2
  set.glow = bakeGlow(mk, gs, PAL.amber, 0.55)
  set.glows = [null, set.glow, bakeGlow(mk, gs, PAL.teal, 0.5), bakeGlow(mk, gs, PAL.moon, 0.5), bakeGlow(mk, gs, PAL.ember, 0.6), bakeGlow(mk, gs, PAL.blight, 0.5)]

  {
    const c = mk(ppt, ppt >> 1), g = g2d(c)
    g.save(); g.scale(1, 0.5)
    g.fillStyle = rad(g, ppt / 2, ppt / 2, 0, ppt / 2, [0, 'rgba(0,0,0,0.45)', 0.6, 'rgba(0,0,0,0.25)', 1, 'rgba(0,0,0,0)'])
    g.fillRect(0, 0, ppt, ppt)
    g.restore()
    set.shadow = c
  }
  const ring = (col) => {
    const c = mk(ppt, Math.round(ppt * 0.6)), g = g2d(c)
    g.strokeStyle = rgba(col, 0.35); g.lineWidth = ppt * 0.1
    g.beginPath(); g.ellipse(ppt / 2, ppt * 0.3, ppt * 0.42, ppt * 0.22, 0, 0, TAU); g.stroke()
    g.strokeStyle = col; g.lineWidth = Math.max(1.5, ppt * 0.04)
    g.beginPath(); g.ellipse(ppt / 2, ppt * 0.3, ppt * 0.42, ppt * 0.22, 0, 0, TAU); g.stroke()
    return c
  }
  set.selectRing = ring('#b8f59a')
  set.selectRingEnemy = ring('#ff6b5a')

  const ss = Math.max(8, ppt >> 1)
  set.status = []
  for (let b = 0; b <= BS_IDLE; b++) set.status.push(bakeStatus(mk, b, ss))

  {
    const c = mk(ss, ss), g = g2d(c), m = ss / 2
    g.fillStyle = rad(g, m, m, 0, m, [0, 'rgba(210,214,200,0.75)', 0.6, 'rgba(160,170,160,0.35)', 1, 'rgba(140,150,140,0)'])
    g.fillRect(0, 0, ss, ss)
    set.smoke = c
  }
  {
    const c = mk(ss, ss), g = g2d(c), m = ss / 2
    glowBlob(g, m, m, m, PAL.amberL, 0.9)
    g.fillStyle = '#fff8e0'
    for (let i = 0; i < 4; i++) { const a = (i / 4) * TAU; poly(g, [m, m, m + Math.cos(a - 0.2) * m * 0.3, m + Math.sin(a - 0.2) * m * 0.3, m + Math.cos(a) * m * 0.95, m + Math.sin(a) * m * 0.95, m + Math.cos(a + 0.2) * m * 0.3, m + Math.sin(a + 0.2) * m * 0.3], '#fff8e0') }
    set.spark = c
  }
  {
    const c = mk(ppt, ppt), g = g2d(c), m = ppt / 2, rng = new RNG(77)
    for (let i = 0; i < 7; i++) {
      const a = rng.float() * TAU, r = rng.float() * m * 0.45
      g.fillStyle = rad(g, m + Math.cos(a) * r, m + Math.sin(a) * r, 0, m * 0.5, [0, 'rgba(120,110,100,0.55)', 1, 'rgba(90,80,70,0)'])
      g.fillRect(0, 0, ppt, ppt)
    }
    set.puff = c
  }
  {
    const c = mk(ss, ss), g = g2d(c), m = ss / 2
    glowBlob(g, m, m, m, PAL.blightL, 0.9)
    circle(g, m, m, m * 0.25, '#f6d8ff')
    set.bolt = c
  }
  {
    const fs = Math.max(4, ppt >> 2), c = mk(fs, fs), g = g2d(c), m = fs / 2
    glowBlob(g, m, m, m, '#e9ff9a', 1)
    set.firefly = c
  }
  set.terrainColor = TERRAIN_COLOR
  set.resColor = RES_COLOR

  _shared = set
  return /** @type {SpriteSet} */ (set)
}

// ---------------------------------------------------------------- HUD data URLs
const _urlCache = new Map()

function domCanvas(w, h) {
  if (typeof document === 'undefined' || !document.createElement) return null
  const c = document.createElement('canvas')
  if (!c || typeof c.getContext !== 'function') return null
  c.width = w; c.height = h
  return c
}

function shared() {
  if (_shared) return _shared
  try { return bakeSprites() } catch { return null }
}

/**
 * HUD helper: data URL of an item icon (for build-menu/selection panel <img>).
 * May lazily bake. Returns '' when no canvas implementation exists (Node).
 * @param {number} item I_*
 * @returns {string}
 */
export function itemIconURL(item) {
  const key = 'i' + item
  const hit = _urlCache.get(key)
  if (hit !== undefined) return hit
  const c = domCanvas(ITEM_BAKE_PX, ITEM_BAKE_PX)
  if (!c || !(item > 0 && item < ITEM_COUNT)) return ''
  const g = c.getContext('2d')
  if (!g) return ''
  drawItem(g, item, ITEM_BAKE_PX)
  const url = typeof c.toDataURL === 'function' ? c.toDataURL() : ''
  _urlCache.set(key, url)
  return url
}

/**
 * HUD helper: data URL of a building sprite thumbnail (build-menu buttons), px square.
 * @returns {string}
 */
export function buildingIconURL(type, px = 40) {
  const key = 'b' + type + ':' + px
  const hit = _urlCache.get(key)
  if (hit !== undefined) return hit
  if (!(type > 0 && type < BUILDING_COUNT)) return ''
  const c = domCanvas(px, px)
  if (!c) return ''
  const set = shared()
  const g = c.getContext('2d')
  if (!set || !g) return ''
  const spr = set.buildings[type]
  const sw = spr.width, sh = spr.height
  const k = Math.min(px / sw, px / sh)
  const dw = sw * k, dh = sh * k
  g.drawImage(spr, (px - dw) / 2, (px - dh) / 2, dw, dh)
  const url = typeof c.toDataURL === 'function' ? c.toDataURL() : ''
  _urlCache.set(key, url)
  return url
}
