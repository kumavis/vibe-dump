// The objectives (DESIGN §1.1): each one's marker stone and gem, flag and
// ring, where the mission puts them (data/mission.js; the objectives
// themselves are the match's, G.objectives). Each flag and ring shows its
// holder's colours as the table shows them: the mirror's owners
// (present/mirror.js), never controlOf, so a flag turns when the table
// plays the event that turned it (nobody's before the battle).
//
// R7 moved it out of main.js unchanged.
import * as THREE from 'three'
import { M } from './models/kit.js'

export class ObjectivesView {
  // `places`: [{ x, z }] per objective; `range`: the holding range (the
  // ring); `colorOf(seat)`: a seat's colour
  constructor(scene, places, range, colorOf) {
    this.scene = scene
    this.range = range
    this.colorOf = colorOf
    this.items = this.make(places)
  }

  // (F8a) The objectives where another mission puts them: the old ones off
  // the table and freed (the stone's and pole's materials are the kit's,
  // shared, and stay), the new ones nobody's. view/index.js's setBoard calls
  // it only when a match's objectives differ from those shown.
  place(places) {
    for (const o of this.items) {
      this.scene.remove(o.g)
      o.g.traverse((m) => m.geometry?.dispose())
      for (const m of [o.gem.material, o.flagMat, o.ring.material]) m.dispose()
    }
    this.items = this.make(places)
  }

  // each objective's marker, made in the order the table always made them
  make(places) {
    const { scene, range } = this
    return places.map((p, i) => {
      const g = new THREE.Group()
      g.position.set(p.x, 0, p.z)
      const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.16, 8), M('#8a8478'))
      stone.position.y = 0.08
      stone.castShadow = stone.receiveShadow = true
      const gem = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), new THREE.MeshStandardMaterial({ color: '#fff3c0', emissive: '#ffd060', emissiveIntensity: 0.8, flatShading: true }))
      gem.position.y = 0.42
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.1, 6), M('#5a3d24'))
      pole.position.set(0.35, 1.1, 0)
      pole.castShadow = true
      const flagMat = new THREE.MeshStandardMaterial({ color: '#e8e0d0', side: THREE.DoubleSide, roughness: 0.8 })
      const flag = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.5, 6, 1).translate(0.4, 0, 0), flagMat)
      flag.position.set(0.35, 1.85, 0)
      flag.castShadow = true
      const ring = new THREE.Mesh(new THREE.RingGeometry(range - 0.06, range, 64).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#fff3c0', transparent: true, opacity: 0.35, depthWrite: false }))
      ring.position.y = 0.03
      g.add(stone, gem, pole, flag, ring)
      scene.add(g)
      return { i, g, gem, flag, flagMat, ring, owner: -1 }
    })
  }

  // Flag and ring in the colours of whoever holds the objective (-1: nobody).
  paint(o, c) {
    o.owner = c
    o.flagMat.color.set(c < 0 ? '#e8e0d0' : this.colorOf(c))
    o.ring.material.color.set(c < 0 ? '#fff3c0' : this.colorOf(c))
  }

  // nobody's (a new table: nothing from the last game carries over)
  reset() {
    for (const o of this.items) this.paint(o, -1)
  }

  // Each flag shows its holder as shown (`owners`, the mirror's), and the
  // gems, flags and rings idle.
  animate(dt, time, owners) {
    for (const o of this.items) {
      const c = owners[o.i]
      if (c !== o.owner) this.paint(o, c)
      o.gem.rotation.y = time * 1.2
      o.gem.position.y = 0.45 + Math.sin(time * 2 + o.i) * 0.05
      o.flag.rotation.y = Math.sin(time * 2.2 + o.i) * 0.25
      o.ring.material.opacity = 0.3 + Math.sin(time * 2 + o.i) * 0.08
    }
  }
}
