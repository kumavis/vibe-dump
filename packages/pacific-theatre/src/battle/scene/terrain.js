// A battle box's ground (ENGINEERING.md §7): the ground interface over one
// PackTerrain of the box's pack, in metres, at the box's one exaggeration
// (boxes/manifest.json, 1.0 in v1), never varied with the camera, so the
// terrain an aircraft hits is the terrain on screen. Its cast shadows are the
// Hawaiian heightfield shadows over the pack (render/shadow.js).
//
// Stage 0's minimal BoxGround, written so the box flavours (terrain.glsl.js,
// render/ocean.js, render/shadow.js) compile and draw in the fixture box; the
// engine workflow owns src/battle/** from the fork and may keep, extend or
// replace it.

import * as THREE from 'three'
import { BOX } from '../../config.js'
import { PackTerrain } from '../../render/pack.js'
import { PackShadow } from '../../render/shadow.js'
import { terrainVertex, terrainFragment } from './terrain.glsl.js'

export class BoxGround {
  /**
   * app: for the renderer and the light bag; pack: a loadBox() pack with its
   * data; opts: { exaggeration (the box's), unit (metres per world unit, 1),
   * rain (the box's rain, ln(mm / 300) / ln 40; about 1,600 mm by default) }.
   */
  constructor(app, pack, { exaggeration = BOX.exaggeration, unit = BOX.unit, rain = 0.45 } = {}) {
    this.app = app
    this.pack = pack
    this.unit = unit
    this.exag = exaggeration
    this.uniforms = {
      uVert: { value: exaggeration / unit },
      uExag: { value: exaggeration },
      uNormalE: { value: pack.data.normalExag ?? pack.normalExag ?? BOX.normalExag },
      uArchH: { value: null },
      uArchRect: { value: new THREE.Vector4() },
      uOutside: { value: BOX.outside },
    }
    this.lo = pack.data.lo
    this.hi = pack.data.hi
    this.terrain = new PackTerrain(pack, app.renderer, { ...app.light.uniforms, ...this.uniforms }, {
      vertexShader: terrainVertex,
      fragmentShader: terrainFragment,
      unit,
      uniforms: { uRain: { value: rain }, uUnitM: { value: unit }, uKau: { value: 0.5 } },
    })
    this.uniforms.uArchH.value = this.terrain.heightTex
    this.uniforms.uArchRect.value.copy(this.terrain.rect)
    this.shadow = new PackShadow(this.terrain, 1024)
    this.terrain.setShadow(this.shadow.texture)
    const r = pack.rect
    this.bounds = { x0: r.x0, z0: r.z0, x1: r.x1, z1: r.z1 }
    this.group = this.terrain.group
  }

  get vert() {
    return this.uniforms.uVert.value
  }

  get maxY() {
    return Math.max(0, this.hi) * this.vert
  }

  /** Metres at world (x, z), negative at sea; beyond the pack, the flat deep sea. */
  metresAt(x, z) {
    const b = this.bounds
    if (x < b.x0 || z < b.z0 || x > b.x1 || z > b.z1) return BOX.outside
    return this.terrain.metresAt(x, z)
  }

  heightAt(x, z) {
    return Math.max(0, this.metresAt(x, z)) * this.vert
  }

  /** Once a frame: the quadtree, and the shadow map a strip at a time when the sun moves. */
  update(camera) {
    this.terrain.update(camera, true)
    this.shadow.update(this.app.renderer, this.app.light.sunDir, this.vert, 1, this.maxY + 50 / this.unit)
  }

  setRange(k) {
    this.terrain.applyRange(k)
  }

  stats() {
    return { exag: this.exag, ...this.terrain.stats() }
  }

  dispose() {
    this.shadow.dispose()
    this.terrain.dispose()
  }
}
