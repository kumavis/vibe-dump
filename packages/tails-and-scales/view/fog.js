// (F16) The courtesy fog's ghosts (present/fog.js): where an enemy unit the
// seat played here can no longer see was last seen, a greyed figure for
// each of its models then standing, in its slot as it then stood, and a
// label over it, "last seen", with its models (or a single model's wounds)
// as last seen. They stand until the fog says otherwise (the unit seen
// again, or seen to be gone); nothing of the match is read, only the
// records the fog hands over (a mirror unit's shape, as it then stood).
//
// A ghost's figures are the unit's own miniatures (view/models/cache.js),
// every mesh under one shared translucent grey material, casting no
// shadow; made as a ghost first stands, freed as it goes (its own
// geometry, as a figure off the table is). The material and the label's
// element are made the first time a ghost stands: a battle without the
// fog makes neither, nor their ids' Math.random draws.
import * as THREE from 'three'
import { RACES } from '../data/schema.js'
import { buildModel, disposeFigure } from './models/cache.js'

let grey = null
const ghostMat = () => (grey ??= new THREE.MeshLambertMaterial({ color: '#8c8c88', transparent: true, opacity: 0.45, depthWrite: false }))
const tmp = new THREE.Vector3()

export class Ghosts {
  // `units` (view/units.js's UnitViews: each unit's type, seat, edge and
  // colour, by id), `labels` the element the floating labels go in
  constructor({ scene, labels, units }) {
    this.scene = scene
    this.labels = labels
    this.units = units
    // unit id → { rec, figs: [mesh], label }
    this.standing = new Map()
  }

  // The ghosts the fog says stand now (a Map id → record, or null): a ghost
  // kept while its record is the same, made afresh when it changed, gone
  // when the map no longer holds it.
  show(ghosts) {
    for (const [id, g] of [...this.standing]) if (!ghosts?.has(id) || ghosts.get(id) !== g.rec) this.drop(id)
    for (const [id, rec] of ghosts ?? []) if (!this.standing.has(id) && this.units.get(id)) this.make(id, rec)
  }

  make(id, rec) {
    const v = this.units.get(id), u = v.u, kit = RACES[u.race].look.models, facing = -v.edge * Math.PI / 2
    const figs = []
    rec.models.forEach((m) => {
      if (!m.alive) return
      const mesh = buildModel(kit, u.key, u.t, '#8c8c88', 1)
      mesh.traverse((o) => {
        if (!o.isMesh) return
        o.material = ghostMat()
        o.castShadow = false
        o.receiveShadow = false
      })
      mesh.position.set(rec.pos.x + m.ox, rec.y ?? 0, rec.pos.z + m.oz)
      mesh.rotation.y = facing
      mesh.userData.ghost = id
      this.scene.add(mesh)
      figs.push(mesh)
    })
    const label = document.createElement('div')
    label.className = `ulabel ghost s${u.side}`
    const w = rec.models.find((m) => m.alive)
    label.innerHTML = `<span class="nm">${u.t.short}</span><span class="ct">${u.t.models > 1 ? `${rec.alive}/${u.t.models}` : `${w ? w.w : 0}/${u.t.W}♥`}</span><span class="st ls" title="Where it was last seen">last seen</span>`
    label.style.visibility = 'hidden'
    this.labels.appendChild(label)
    this.standing.set(id, { rec, figs, label, big: !!u.t.big, lx: NaN, ly: NaN })
  }

  drop(id) {
    const g = this.standing.get(id)
    if (!g) return
    for (const f of g.figs) {
      this.scene.remove(f)
      disposeFigure(f)
    }
    g.label.remove()
    this.standing.delete(id)
  }

  // every ghost gone (a new table, the fog lifted)
  clear() {
    for (const id of [...this.standing.keys()]) this.drop(id)
  }

  // Each frame (never under ?fast): each ghost's label over it.
  animate(camera, fast, title) {
    if (fast) return
    for (const g of this.standing.values()) {
      const p = g.rec.pos
      tmp.set(p.x, (g.rec.y ?? 0) + (g.big ? 2.7 : 1.7), p.z).project(camera)
      const lx = (tmp.x * 0.5 + 0.5) * innerWidth, ly = (-tmp.y * 0.5 + 0.5) * innerHeight
      if (!(Math.abs(lx - g.lx) < 0.5 && Math.abs(ly - g.ly) < 0.5)) {
        g.label.style.transform = `translate(${lx}px, ${ly}px) translate(-50%, -100%)`
        g.lx = lx
        g.ly = ly
      }
      const vis = tmp.z < 1 && !title ? 'visible' : 'hidden'
      if (g.label.style.visibility !== vis) g.label.style.visibility = vis
    }
  }

  // (?debug) what stands: each ghost's unit id, its place and its figures
  state() {
    return [...this.standing].map(([id, g]) => ({ id, x: g.rec.pos.x, z: g.rec.pos.z, figures: g.figs.length, alive: g.rec.alive }))
  }
}
