// The battlefield's dressing (DESIGN's "Battlefield dressing"): the world
// round the board and the ground under its pieces, everything in it only
// looks. Made by the view (view/index.js) unless the page says ?dress=0, in
// which case none of this exists and the table is drawn as it always was
// (the wooden table, the dark room, the tufts strewn by Math.random: what
// sim/title-shot.mjs and sim/terrain-shots.mjs hold to their references).
//
// build(G) dresses the table a match shows, from its setup (the board seed,
// mission and set: dressSeed) and the table as the match made it (its
// chunks, nav grid, objectives and zones). The same setup is dressed once:
// a battle on the title's table, or a snap of it later (its chunks broken
// or not), keeps the dressing it has, so what a player sees never depends
// on when they joined. Every battle's table is first shown fresh
// (app/flow.js showTable), so a setup's first dressing is of the table as
// made, on every peer.
//
//   S1: the sky (sky.js), the time of day (the stage's daylight), the
//       ground, fields, hills, trees, long grass, the mat's edge and its
//       stakes (surround.js); the wooden table put away
//   S2: the pieces' footprints painted into the mat, their debris, the
//       tufts and flowers in clumps (ground.js); (A) the works' feet worn,
//       the forest floors covered ragged, the clutter hidden under bases
//       (bases.js)
//   S3: the lanes the armies walk, painted on the mat and carried off it
//       (place.js lanesOf)
//   S4: the board's theme: its palette, its own clutter, the works of the
//       people round it (place.js themeOf and worksOf, works.js), its name
//
// Draw calls: the sky 1, the surround 5 (the ground, the edge with its
// stakes and long grass, the trees 2, the works), the debris 4, the floors'
// cover 1: 11, under the budget's cap of 12, against the 6 the wooden table,
// its frame and the box under the mat drew. sim/dressing-check.mjs
// --browser counts the calls and triangles the renderer draws for it.
import { plan, dressSeed } from './place.js'
import { Sky, SKIES, sunAt } from './sky.js'
import { Surround } from './surround.js'
import * as THREE from 'three'
import { Ground, decalPainter, strewer } from './ground.js'

// the share of the trees, grass and debris drawn at each quality: from the
// end of each seeded list, never reordered
const SHARE = { high: 1, medium: 0.5, low: 0 }

export class Dressing {
  // `table` (view/table.js), `stage` (view/stage.js), `camera`, `range` the
  // objectives' reach; `lowfi` (?lowfi): the sky, ground and paint alone
  constructor({ scene, renderer, stage, table, camera, range, lowfi = false }) {
    Object.assign(this, { scene, renderer, stage, table, camera, range, lowfi })
    this.dressed = null
    this.plan = null
    this.sky = new Sky(scene)
    // the clutter's uniforms (ground.js): the pointer, the bases' mask
    this.hide = { cursor: { value: new THREE.Vector3() }, baseMask: { value: null }, matSize: { value: new THREE.Vector2(1, 1) } }
    table.woodShown(false)
    table.onPaint = (colors) => this.surround?.paint(colors)
    stage.onQuality = (name) => this.quality(name)
  }

  // the table match `G` shows, dressed (once per setup); ((Breakthrough,
  // S4b) `zones`, each seat's zone as the table draws it, view/zones.js:
  // null on a mission without roles)
  build(G, zones = null) {
    const { board, mission, terrain } = G.setup
    const setup = `${board >>> 0}|${mission}|${terrain}|${G.setup.attacker ?? ''}`
    if (setup === this.dressed) return false
    this.dressed = setup
    const seed = dressSeed(G.setup)
    const { W, H, deploy } = G.board
    const p = (this.plan = plan({
      seed, set: terrain, W, H, deploy, edges: G.seats.map((s) => s.edge),
      objectives: G.objectives, range: this.range, chunks: G.terrain.chunks, nav: G.nav,
      // ((Breakthrough, S4b) the wall's plan, a plain record, and the zones)
      plan: G.terrain.plan ?? null, zones,
    }))
    // S1: the day, the sky, the world round the board
    const sky = SKIES[p.day]
    this.sky.set(sky, seed)
    this.stage.daylight({ sunPos: sunAt(sky), sun: sky.sun, sunI: sky.sunI, sky: sky.sky, skyI: sky.skyI, ground: sky.ground, fill: sky.fill, fillI: sky.fillI, haze: sky.horizon })
    this.surround?.dispose()
    this.surround = new Surround(this.scene, this.renderer, p, seed)
    if (this.table.colors) this.surround.paint(this.table.colors)
    // S2: the ground under the pieces, the debris, the tufts
    this.ground?.dispose()
    this.ground = new Ground(this.scene, p, { camera: this.camera, canvas: this.renderer.domElement, table: this.table, hide: this.hide })
    this.table.dress(decalPainter(p))
    this.table.strew = strewer(p)
    this.table.scatterTufts()
    this.quality(this.stage.quality)
    return true
  }

  // each frame (view/index.js run): the bases' mask kept to where the
  // figures stand
  animate(now) {
    this.ground?.bases(this.scene, now)
  }

  // the trees, grass and debris at quality `name` (?lowfi: none)
  quality(name) {
    const f = this.lowfi ? 0 : SHARE[name] ?? 1
    this.surround?.quality(f)
    this.ground?.quality(f)
  }
}
