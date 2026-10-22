// The table's ground (ENGINEERING.md §7): the ground interface over one
// PackTerrain of the table pack, in kilometres, at the exaggeration the
// camera's distance asks for (config.js TABLE.exaggeration).
//
// It replaces holo-i-ke-au's render/world.js (b480c27), which carried an
// archipelago, five island slots and a district; what the camera rig, the
// lines, the routes and the pins read of it is all here: bounds, maxY, vert,
// metresAt (the CPU copy of groundMetres), heightAt, and its own uniforms
// (never merged into the light bag). vert = exaggeration / proj.unit is the
// only conversion from metres to world y.

import * as THREE from 'three'
import { TABLE } from '../config.js'
import { PackTerrain } from '../render/pack.js'
import { reliefVertex, reliefFragment } from './relief.js'

export class TableGround {
  /** app: for the renderer and the light bag; pack: data.table, decoded; proj: the TableProjection. */
  constructor(app, pack, proj) {
    this.pack = pack
    this.unit = proj.unit
    this.exag = TABLE.exaggeration(TABLE.maxDistance)
    this.uniforms = {
      uVert: { value: this.exag / this.unit },
      uExag: { value: this.exag },
      uNormalE: { value: pack.data.normalExag ?? pack.normalExag ?? TABLE.normalExag },
      uArchH: { value: null },
      uArchRect: { value: new THREE.Vector4() },
      uOutside: { value: TABLE.outside },
    }
    this.lo = pack.data.lo
    this.hi = pack.data.hi
    this.terrain = new PackTerrain(pack, app.renderer, { ...app.light.uniforms, ...this.uniforms }, {
      vertexShader: reliefVertex,
      fragmentShader: reliefFragment,
      seaCull: -Infinity,
      unit: this.unit,
    })
    this.uniforms.uArchH.value = this.terrain.heightTex
    this.uniforms.uArchRect.value.copy(this.terrain.rect)
    const r = pack.rect
    this.bounds = { x0: r.x0, z0: r.z0, x1: r.x1, z1: r.z1 }
    this.group = this.terrain.group
  }

  /** World y per metre now. */
  get vert() {
    return this.uniforms.uVert.value
  }

  /** World y of the highest ground now. */
  get maxY() {
    return Math.max(0, this.hi) * this.vert
  }

  /** Metres at world (x, z), negative at sea: groundMetres() on the CPU. */
  metresAt(x, z) {
    const b = this.bounds
    if (x < b.x0 || z < b.z0 || x > b.x1 || z > b.z1) return TABLE.outside
    return this.terrain.metresAt(x, z)
  }

  /** World y of the ground or the sea surface at (x, z), never below 0. */
  heightAt(x, z) {
    return Math.max(0, this.metresAt(x, z)) * this.vert
  }

  setExaggeration(e) {
    this.exag = e
    this.uniforms.uExag.value = e
    this.uniforms.uVert.value = e / this.unit
  }

  /** Once a frame: the exaggeration for the camera's distance (km), then the quadtree. */
  update(camera, distance, { exag } = {}) {
    this.setExaggeration(exag ?? TABLE.exaggeration(distance))
    this.terrain.update(camera, true)
  }

  setRange(k) {
    this.terrain.applyRange(k)
  }

  stats() {
    return { exag: +this.exag.toFixed(2), ...this.terrain.stats() }
  }

  dispose() {
    this.terrain.dispose()
  }
}
