// Picking (DESIGN §1.3): what is under the pointer, a unit (by its hit
// cylinder, else (F10a) the one drawn nearest the pointer on screen) and
// the board (where on it), from the camera's view.
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
    let unit = hits.length ? this.unitOf(hits[0].object.userData.id) : null
    // (F10a) a miss falls back on the unit whose centre on screen is
    // nearest the pointer, within 14 px (a finger: 24): a far figure is a
    // few pixels tall
    if (!unit) {
      const within = ev.pointerType === 'touch' ? 24 : 14
      let best = within
      for (const [id, p] of this.units.screen ?? []) {
        if (!p.on || !this.units.views?.has(id) || !(this.units.shown?.(id)?.alive > 0)) continue
        const d = Math.hypot(p.x - ev.clientX, p.y - ev.clientY)
        if (d < best) {
          const u = this.unitOf(id)
          if (u) {
            best = d
            unit = u
          }
        }
      }
    }
    const g = ray.intersectObject(this.board, false)[0]
    return { unit, ground: g ? g.point : null }
  }
}
