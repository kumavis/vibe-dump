// Canvas 2D renderer. OWNER: render implementer. Contract: ARCHITECTURE.md §16.
// Reads sim state (ctx) and the UI overlay; never writes either. No DOM beyond the
// canvas it is given. Allocation-free per frame. No DOM access at import time.

/** @typedef {import('./context.js').Ctx} Ctx */
/** @typedef {import('./camera.js').Camera} Camera */
/** @typedef {import('./overlay.js').Overlay} Overlay */

export class Renderer {
  /**
   * @param {HTMLCanvasElement} canvas  the full-viewport #view canvas
   * @param {{dayNight?:boolean}} [opts]
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
  }

  /**
   * Resize the backing store to cssW*dpr x cssH*dpr. Called by main.js on window resize
   * (and once at startup) with the same values passed to camera.resize.
   */
  resize(cssW, cssH, dpr) {
    throw new Error('hearthwood: Renderer.resize not implemented')
  }

  /**
   * Draw one frame.
   * @param {Camera} camera   x,y = view centre (tile units), zoom, viewW/viewH (CSS px), dpr
   * @param {Ctx} ctx         simulation state (read-only)
   * @param {number} alpha    interpolation factor in [0,1): unit draw pos = p + (x - p) * alpha
   * @param {Overlay} overlay selection, ghost, drag box, pings (read-only)
   */
  draw(camera, ctx, alpha, overlay) {
    throw new Error('hearthwood: Renderer.draw not implemented')
  }

  /** Drop every cached terrain chunk (new map / context replaced). */
  invalidateAll() {
    throw new Error('hearthwood: Renderer.invalidateAll not implemented')
  }
}

/** @returns {Renderer} */
export function createRenderer(canvas, opts) {
  return new Renderer(canvas, opts)
}
