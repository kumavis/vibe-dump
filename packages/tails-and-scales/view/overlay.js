// What a seat's tools draw on the table (DESIGN §1.1): the reach overlay (a
// texture with one texel per nav cell, shading where a unit could stand or
// where a charge's roll reaches), the range ring of a shot or a charge, a
// move's path line and the ghost ring where it would end. The input decides
// what to show (main.js until R7b's input/ tools); this only draws it, from
// the nav grid it is handed.
//
// R7 moved it out of main.js unchanged.
import * as THREE from 'three'

export class Overlay {
  // `grid`: the nav grid's size ({ nx, nz }: every match's grid has it)
  constructor(scene, { W, H, grid }) {
    this.data = new Uint8Array(grid.nx * grid.nz * 4)
    const tex = (this.tex = new THREE.DataTexture(this.data, grid.nx, grid.nz, THREE.RGBAFormat))
    tex.magFilter = THREE.LinearFilter
    tex.minFilter = THREE.LinearFilter
    const mesh = (this.mesh = new THREE.Mesh(new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })))
    mesh.position.y = 0.035
    mesh.renderOrder = 2
    mesh.visible = false
    scene.add(mesh)

    const rangeRing = (this.rangeRing = new THREE.Mesh(new THREE.RingGeometry(0.985, 1, 96).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false })))
    rangeRing.position.y = 0.04
    rangeRing.visible = false
    scene.add(rangeRing)

    const pathLine = (this.pathLine = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.9, toneMapped: false })))
    pathLine.visible = false
    pathLine.renderOrder = 4
    scene.add(pathLine)
    const ghost = (this.ghost = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 40).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.8, depthWrite: false, toneMapped: false })))
    ghost.position.y = 0.05
    ghost.visible = false
    scene.add(ghost)
  }

  // The shaded area is everywhere the unit could stand; spots overlapping a
  // friend are still shaded (a click there snaps to the nearest legal spot),
  // so the region reads as one shape instead of a sieve.
  reach(plan, nav) {
    const adv = plan.u.flags.advanced
    const { u, res, mode, endForbid } = plan
    const ok = new Uint8Array(nav.N)
    for (let i = 0; i < nav.N; i++) if (isFinite(res.dist[i]) && nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', endForbid)) ok[i] = 1
    this.mask(ok, plan.fallback ? [255, 120, 90] : adv ? [255, 190, 70] : [90, 180, 255], nav)
  }

  // Shade the cells `ok` marks in colour `col`, their rim strong.
  mask(ok, col, nav, fill = 80) {
    const ovData = this.data
    ovData.fill(0)
    for (let i = 0; i < nav.N; i++) {
      if (!ok[i]) continue
      const ix = i % nav.nx, iz = (i / nav.nx) | 0
      const edge = ix === 0 || iz === 0 || ix === nav.nx - 1 || iz === nav.nz - 1 || !ok[i - 1] || !ok[i + 1] || !ok[i - nav.nx] || !ok[i + nav.nx]
      const o = ((nav.nz - 1 - iz) * nav.nx + ix) * 4
      ovData[o] = col[0]
      ovData[o + 1] = col[1]
      ovData[o + 2] = col[2]
      ovData[o + 3] = edge ? 210 : nav.diff[i] ? Math.round(fill * 0.7) : fill
    }
    this.tex.needsUpdate = true
    this.mesh.visible = true
  }

  // nothing shaded, no ring, no path
  clear() {
    this.mesh.visible = false
    this.pathLine.visible = false
    this.rangeRing.visible = false
  }

  // a ring `range` beyond the unit's disc at (x, z), radius r
  range({ x, z }, r, range, color) {
    const rangeRing = this.rangeRing
    rangeRing.position.x = x
    rangeRing.position.z = z
    rangeRing.scale.setScalar(r + range)
    rangeRing.material.color.set(color)
    rangeRing.visible = true
  }

  // the path a move would take, drawn just over the table
  path(pts) {
    this.pathLine.geometry.setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0.08, p.z)))
    this.pathLine.visible = true
  }

  // the ghost of a disc of radius r on nav cell i
  ghostAt(nav, i, r) {
    const ghost = this.ghost
    ghost.position.x = nav.x(i)
    ghost.position.z = nav.z(i)
    ghost.scale.setScalar(r)
    ghost.visible = true
  }
}
