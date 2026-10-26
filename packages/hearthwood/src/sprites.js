// Procedural sprite baking. OWNER: render implementer. Contract: ARCHITECTURE.md §16.3.
// No DOM access at import time: canvases are created inside functions only.

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
 */

export const UNIT_FRAMES = 4
export const ICON_PX = 16
export const RES_VARIANTS = 4
export const TERRAIN_VARIANTS = 4

/**
 * Create a canvas of the given pixel size (OffscreenCanvas when available, else a DOM canvas).
 * Call-time only. @returns {AnyCanvas}
 */
export function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h)
  if (typeof document !== 'undefined') {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    return c
  }
  throw new Error('hearthwood: no canvas implementation available')
}

/**
 * Bake every sprite once (deterministic, procedural, woodland-fantasy palette).
 * Budget: < 150 ms total. Called once by the Renderer constructor.
 * @param {{ppt?:number}} [opts]
 * @returns {SpriteSet}
 */
export function bakeSprites(opts = {}) {
  throw new Error('hearthwood: bakeSprites not implemented')
}

/**
 * HUD helper: data URL of an item icon (for build-menu/selection panel <img>).
 * May lazily bake. Returns '' when no canvas implementation exists (Node).
 * @param {number} item I_*
 * @returns {string}
 */
export function itemIconURL(item) {
  throw new Error('hearthwood: itemIconURL not implemented')
}

/**
 * HUD helper: data URL of a building sprite thumbnail (build-menu buttons), px square.
 * @returns {string}
 */
export function buildingIconURL(type, px = 40) {
  throw new Error('hearthwood: buildingIconURL not implemented')
}
