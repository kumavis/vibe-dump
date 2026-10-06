// ---------------------------------------------------------------------------
// The modular battlefield, as main.js has always used it.
//
// Scenery joins the two halves of the terrain: the rules data (the chunks,
// line of sight and destruction: core/terrain/terrain.js, built by the
// recipes and sets beside it) and its meshes (view/terrain.js). The terrain
// reports every change synchronously to the view, which plays it. main.js
// uses `generate`, `chunks` (the terrain's live list), `dirty`, `los`,
// `blast`, `hurt` and `onBreak` as before, and those are all this offers
// (with `clear`, `features`, `group`, and `scene`, `view` and `terrain` for
// sim/): the old destroy, collapse, rubble and topple are the Terrain's own
// steps now, and a caller from outside would get the logic without the
// view's part of them. From R4 the match state holds the Terrain itself and
// this facade goes. The two sim/ tools that drive the working tree through
// it move with it: terrain-check.mjs (P-terrain, a standing gate) is ported
// to Terrain and TerrainView, and terrain-shots.mjs is ported or retired
// (DESIGN's R4 row).
// ---------------------------------------------------------------------------
import { Terrain } from './core/terrain/terrain.js'
import { TerrainView } from './view/terrain.js'

export class Scenery {
  constructor(scene, fx, W, H) {
    this.scene = scene
    this.fx = fx
    this.W = W
    this.H = H
    this.view = new TerrainView(scene, fx)
    this.terrain = new Terrain(W, H)
    this.terrain.sink = (e) => this.view.apply(e)
  }

  // the live chunk list: an action that walks it sees chunks it adds itself
  get chunks() {
    return this.terrain.chunks
  }
  get features() {
    return this.terrain.features
  }
  // set when the chunks change shape; main.js rebuilds the nav grid and clears it
  get dirty() {
    return this.terrain.dirty
  }
  set dirty(v) {
    this.terrain.dirty = v
  }
  get group() {
    return this.view.group
  }
  // (chunk) => {}: main hooks the sound of breaking here
  get onBreak() {
    return this.view.onBreak
  }
  set onBreak(f) {
    this.view.onBreak = f
  }

  clear() {
    this.terrain.clear()
  }
  generate(seed, objectives, deployDepth) {
    this.terrain.generate(seed, objectives, deployDepth)
  }
  los(a, b, ignoreR) {
    return this.terrain.los(a, b, ignoreR)
  }
  blast(x, z, r, dmg, opts) {
    return this.terrain.blast(x, z, r, dmg, opts)
  }
  hurt(c, amount, from, broken) {
    return this.terrain.hurt(c, amount, from, broken)
  }
}
