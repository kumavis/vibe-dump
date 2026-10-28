// Picking (DESIGN §1.3): what is under the pointer, a unit (by its hit
// cylinder, else (F10a) the one drawn nearest the pointer on screen) and
// the board (where on it), from the camera's view. (F7a) Where on the
// board is the first walkable top the ray meets (a deck's, a ramp's: the
// battlefield's quads on them, view/terrain.js's tops, 30-60 of them on a
// fortified board, cast at one by one with no broadphase), else the board's
// plane: a click on a deck is a click on its top, not on the ground under it.
// The point carries its height (y), and the tools read its x and z.
//
// (F9a, DESIGN §4.2.5) A rider has no cylinder and no place on screen
// (view/units.js): it is picked by its figure on its hull's deck, cast at
// first, mesh by mesh (a dozen small figures a hull at most), so a click on
// a squad riding the cart picks that squad, and one on the cart's wheels,
// cup or crew the cart.
import * as THREE from 'three'

export class Picker {
  // `units`: the figures (view/units.js); `board`: the board's mesh
  // (view/table.js); `unitOf(id)`: the unit of the match the table shows;
  // (F7a) `tops()`: the walkable tops' quads the table shows
  constructor({ camera, units, board, unitOf, tops = () => [] }) {
    this.camera = camera
    this.units = units
    this.board = board
    this.unitOf = unitOf
    this.tops = tops
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
    // ((F9a) a rider's figure on a deck first)
    const deck = this.units.deckFigures?.() ?? []
    const rode = deck.length ? ray.intersectObjects(deck, true)[0] : null
    const riderId = rode ? riderOf(rode.object) : null
    const hits = riderId !== null ? [] : ray.intersectObjects(this.units.pickables(), false)
    let unit = riderId !== null ? this.unitOf(riderId) : hits.length ? this.unitOf(hits[0].object.userData.id) : null
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
    const tops = this.tops()
    const g = (tops.length ? ray.intersectObjects(tops, false)[0] : null) ?? ray.intersectObject(this.board, false)[0]
    return { unit, ground: g ? g.point : null }
  }
}

// (F9a) the rider whose deck figure a mesh is part of (its root carries the
// rider's id), or null
function riderOf(o) {
  for (let p = o; p; p = p.parent) if (p.userData.rider !== undefined) return p.userData.rider
  return null
}
