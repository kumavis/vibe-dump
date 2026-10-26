// Minimap. OWNER: render implementer. Contract: ARCHITECTURE.md §16.4.
// Draws into the #minimap canvas it is given. No DOM access at import time.

import { MINIMAP_REFRESH_TICKS, MINIMAP_SIZE } from './constants.js' // eslint-disable-line no-unused-vars

/** @typedef {import('./context.js').Ctx} Ctx */
/** @typedef {import('./camera.js').Camera} Camera */

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
  }

  /**
   * Refresh the cached map image (terrain from world arrays — rebuilt only when any
   * world.chunkVersion changed — plus buildings and units as pixels) when
   * ctx.tick - lastTick >= MINIMAP_REFRESH_TICKS or `force`.
   * @returns {boolean} whether it refreshed
   */
  update(ctx, force = false) {
    throw new Error('hearthwood: Minimap.update not implemented')
  }

  /** Blit the cached image and draw the camera's view rectangle. Cheap: call every frame. */
  draw(camera) {
    throw new Error('hearthwood: Minimap.draw not implemented')
  }

  /**
   * Convert a point in minimap CSS pixels (relative to the canvas's top-left, e.g.
   * event.offsetX/offsetY) to world tile units, given the canvas's CSS size
   * (clientWidth/clientHeight — it differs from MINIMAP_SIZE on small screens). Writes out.x / out.y.
   * @param {{x:number,y:number}} out
   * @returns {{x:number,y:number}} out
   */
  toWorld(mx, my, cssW, cssH, out) {
    throw new Error('hearthwood: Minimap.toWorld not implemented')
  }
}

/** @returns {Minimap} */
export function createMinimap(canvas, mapW, mapH) {
  return new Minimap(canvas, mapW, mapH)
}
