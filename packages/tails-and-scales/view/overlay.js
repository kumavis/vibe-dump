// What a seat's tools draw on the table (DESIGN §1.1): the reach overlay (a
// texture with one texel per nav cell, shading where a unit could stand or
// where a charge's roll reaches), the range ring of a shot or a charge, a
// move's path line and the ghost ring where it would end. The input decides
// what to show (main.js until R7b's input/ tools); this only draws it, from
// the nav grid it is handed. (N2) And another player's pick online: a dashed
// ring round the unit their player has picked up, in their colour, and a
// line to the one they aim at (app/online.js, from their presence). (F10a)
// A group's formation: a ring where each member would end, and a flag.
// (F10c) Standing orders' lines: a march's to its slot, an attack's to its
// target.
//
// R7 moved it out of main.js unchanged.
import * as THREE from 'three'

export class Overlay {
  // `grid`: the nav grid's size ({ nx, nz }: every match's grid has it)
  constructor(scene, { W, H, grid }) {
    this.scene = scene
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

  // (F8a) The overlay for another board: its texture one texel per nav cell
  // of the match's grid (`grid`: { nx, nz }), its plane W×H, the old ones
  // freed; nothing shaded. view/index.js's setBoard calls it only when a
  // match's board differs from the one shown.
  resize({ W, H, grid }) {
    this.data = new Uint8Array(grid.nx * grid.nz * 4)
    const tex = new THREE.DataTexture(this.data, grid.nx, grid.nz, THREE.RGBAFormat)
    tex.magFilter = THREE.LinearFilter
    tex.minFilter = THREE.LinearFilter
    this.tex.dispose()
    this.tex = tex
    this.mesh.material.map = tex
    this.mesh.material.needsUpdate = true
    this.mesh.geometry.dispose()
    this.mesh.geometry = new THREE.PlaneGeometry(W, H).rotateX(-Math.PI / 2)
    this.mesh.visible = false
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

  // (N2) Another player's pick: `at` { x, z, r } the disc of the unit they
  // hold, `to` { x, z } the unit they aim at (or null), in `color`; null
  // takes it away. Made the first time it is shown (only an online match
  // shows one, so a game played alone makes no more three.js objects, nor
  // their ids' Math.random draws, than it did).
  peer(at, to = null, color = '#ffffff') {
    if (!at) {
      if (this.peerRing) this.peerRing.visible = this.peerLine.visible = false
      return
    }
    if (!this.peerRing) {
      const pts = Array.from({ length: 49 }, (_, i) => new THREE.Vector3(Math.cos((i / 48) * Math.PI * 2), 0, Math.sin((i / 48) * Math.PI * 2)))
      const dashed = () => new THREE.LineDashedMaterial({ color: '#ffffff', dashSize: 0.35, gapSize: 0.25, transparent: true, opacity: 0.9, toneMapped: false })
      this.peerRing = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), dashed())
      this.peerRing.material.dashSize = 0.12
      this.peerRing.material.gapSize = 0.08
      this.peerRing.computeLineDistances()
      this.peerLine = new THREE.Line(new THREE.BufferGeometry(), dashed())
      for (const o of [this.peerRing, this.peerLine]) {
        o.renderOrder = 4
        this.scene.add(o)
      }
    }
    const ring = this.peerRing, line = this.peerLine
    ring.position.set(at.x, 0.07, at.z)
    ring.scale.setScalar(at.r * 1.25)
    ring.material.color.set(color)
    ring.visible = true
    line.visible = !!to
    if (to) {
      line.geometry.setFromPoints([new THREE.Vector3(at.x, 0.09, at.z), new THREE.Vector3(to.x, 0.09, to.z)])
      line.computeLineDistances()
      line.material.color.set(color)
    }
  }

  // (F10a) A group's formation: a ring where each member would end (white
  // when it arrives, amber when it falls short; its own cell, none), and a
  // flag at the point the group goes to, brighter once pinned. null takes it
  // away. Made the first time it is shown (a game that never selects a group
  // makes no more three.js objects, nor their ids' Math.random draws).
  // ((F10c) `paths`: each member's way there, faint, as point lists;
  // `handles`: the pin's { move, turn, line } knobs, drawn round their spots)
  formation(f) {
    if (!f) {
      if (this.rings) {
        for (const r of this.rings) r.visible = false
        this.flag.visible = false
      }
      for (const l of this.fPaths ?? []) l.visible = false
      for (const k of Object.values(this.knobs ?? {})) k.visible = false
      return
    }
    if (!this.rings) {
      this.rings = []
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 6), new THREE.MeshBasicMaterial({ color: '#f2e6c8', toneMapped: false }))
      pole.position.y = 0.8
      const cloth = new THREE.Mesh(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 1.6, 0), new THREE.Vector3(0.75, 1.38, 0), new THREE.Vector3(0, 1.16, 0)]), new THREE.MeshBasicMaterial({ color: '#ffd166', side: THREE.DoubleSide, transparent: true, toneMapped: false }))
      this.flag = new THREE.Group()
      this.flag.add(pole, cloth)
      this.flag.userData.cloth = cloth
      this.flag.renderOrder = 5
      this.scene.add(this.flag)
    }
    const geo = this.ghost.geometry
    f.members.forEach((m, k) => {
      let ring = this.rings[k]
      if (!ring) {
        ring = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.85, depthWrite: false, toneMapped: false }))
        ring.position.y = 0.05
        ring.renderOrder = 4
        this.scene.add(ring)
        this.rings.push(ring)
      }
      ring.position.x = m.x
      ring.position.z = m.z
      ring.scale.setScalar(m.r)
      ring.material.color.set(m.short ? '#ffb347' : '#ffffff')
      ring.visible = true
    })
    for (let k = f.members.length; k < this.rings.length; k++) this.rings[k].visible = false
    this.flag.visible = !!f.anchor
    if (f.anchor) {
      this.flag.position.set(f.anchor.x, 0, f.anchor.z)
      this.flag.userData.cloth.material.opacity = f.pinned ? 1 : 0.5
    }
    // (F10c) the faint paths (made as first needed)
    const paths = f.paths ?? []
    this.fPaths ??= []
    paths.forEach((pts, k) => {
      let line = this.fPaths[k]
      if (!line) {
        line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.3, toneMapped: false }))
        line.renderOrder = 3
        this.scene.add(line)
        this.fPaths.push(line)
      }
      line.geometry.setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0.07, p.z)))
      line.visible = true
    })
    for (let k = paths.length; k < this.fPaths.length; k++) this.fPaths[k].visible = false
    // (F10c) the pin's knobs: a cyan one turns it, a gold one stretches it
    // into a line (the flag moves it)
    const hs = f.handles
    if (hs && !this.knobs) {
      const knob = (color) => {
        const m = new THREE.Mesh(new THREE.RingGeometry(0.45, 0.75, 24).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, depthWrite: false, toneMapped: false }))
        m.position.y = 0.06
        m.renderOrder = 5
        this.scene.add(m)
        return m
      }
      this.knobs = { turn: knob('#5fd3ff'), line: knob('#ffd166') }
    }
    for (const [k, m] of Object.entries(this.knobs ?? {})) {
      m.visible = !!hs?.[k]
      if (hs?.[k]) m.position.set(hs[k].x, 0.06, hs[k].z)
    }
  }

  // (F10a) The rest of another player's group: a dashed ring round each
  // disc in `list` ({ x, z, r }), in `color`; [] takes them away. Made as
  // first needed, like the peer's own ring.
  peerGroup(list, color = '#ffffff') {
    this.peerRings ??= []
    // (each a copy of the peer's own ring, which ghost() draws first)
    if (!this.peerRing) return
    list.forEach((d, k) => {
      let ring = this.peerRings[k]
      if (!ring) {
        ring = this.peerRing.clone()
        ring.material = this.peerRing.material.clone()
        this.scene.add(ring)
        this.peerRings.push(ring)
      }
      ring.position.set(d.x, 0.07, d.z)
      ring.scale.setScalar(d.r * 1.25)
      ring.material.color.set(color)
      ring.visible = true
    })
    for (let k = list.length; k < this.peerRings.length; k++) this.peerRings[k].visible = false
  }

  // (F10c) Standing orders' lines: for each in `list` ({ k: 'march' |
  // 'attack', from: { x, z }, to: { x, z }, r }) a dashed line from the unit
  // to its slot (cyan, a ghost ring of radius r there) or to its target
  // (red-orange, a crosshair ring round it); [] takes them away. Made as
  // first needed (a game with no orders makes no more three.js objects).
  orderLines(list) {
    this.ordLines ??= []
    this.ordRings ??= []
    list.forEach((o, k) => {
      let line = this.ordLines[k], ring = this.ordRings[k]
      if (!line) {
        line = new THREE.Line(new THREE.BufferGeometry(), new THREE.LineDashedMaterial({ color: '#5fd3ff', dashSize: 0.4, gapSize: 0.3, transparent: true, opacity: 0.85, toneMapped: false }))
        line.renderOrder = 4
        ring = new THREE.Mesh(this.ghost.geometry, new THREE.MeshBasicMaterial({ color: '#5fd3ff', transparent: true, opacity: 0.6, depthWrite: false, toneMapped: false }))
        ring.position.y = 0.05
        ring.renderOrder = 4
        this.scene.add(line, ring)
        this.ordLines.push(line)
        this.ordRings.push(ring)
      }
      const col = o.k === 'attack' ? '#ff6a3d' : '#5fd3ff'
      line.geometry.setFromPoints([new THREE.Vector3(o.from.x, 0.09, o.from.z), new THREE.Vector3(o.to.x, 0.09, o.to.z)])
      line.computeLineDistances()
      line.material.color.set(col)
      line.visible = true
      ring.position.x = o.to.x
      ring.position.z = o.to.z
      ring.scale.setScalar(o.r)
      ring.material.color.set(col)
      ring.visible = true
    })
    for (let k = list.length; k < this.ordLines.length; k++) this.ordLines[k].visible = this.ordRings[k].visible = false
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
