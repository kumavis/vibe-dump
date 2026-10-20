// Picking (DESIGN §1.3): what is under the pointer, a unit (by its hit
// cylinder) and the board (where on it), from the camera's view.
import * as THREE from 'three'

export class Picker {
  // `units`: the figures (view/units.js); `board`: the board's mesh
  // (view/table.js); `unitOf(id)`: the unit of the match the table shows
  constructor({ camera, units, board, unitOf }) {
    this.camera = camera
    this.units = units
    this.board = board
    this.unitOf = unitOf
    this.ray = new THREE.Raycaster()
    this.ptr = new THREE.Vector2()
  }

  // { unit, ground } under a pointer event (either null)
  pick(ev) {
    const { ray, ptr } = this
    ptr.set((ev.clientX / innerWidth) * 2 - 1, -(ev.clientY / innerHeight) * 2 + 1)
    ray.setFromCamera(ptr, this.camera)
    // the units the table shows standing (while the player is behind, the
    // match may have slain some of them already)
    const hits = ray.intersectObjects(this.units.pickables(), false)
    const unit = hits.length ? this.unitOf(hits[0].object.userData.id) : null
    const g = ray.intersectObject(this.board, false)[0]
    return { unit, ground: g ? g.point : null }
  }
}
