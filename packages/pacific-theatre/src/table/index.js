// The table scene (ENGINEERING.md §10), Stage 0's minimum: the relief pack on
// its ground (TableGround), the coast's ink, the tray the relief sits in, the
// Hawaiian camera rig over it in kilometres, and a box's outline through its
// placement. Labels, the front, the routes and the pins are the table
// workflow's to add here (render/routes.js and render/lines.js are ready for
// them, unit-agnostic).
//
// The scene owns its THREE.Scene, camera, rig and ground; App draws whichever
// scene is active (one per frame) and asks it for its sky (the table's is the
// fixed war-room light) and its haze.

import * as THREE from 'three'
import { TABLE } from '../config.js'
import { CameraRig } from '../render/camera.js'
import { LineSet } from '../render/lines.js'
import { WAR_ROOM } from '../render/sky.js'
import { constants } from '../render/shaders/common.glsl.js'
import { world, ground as groundChunk } from '../render/shaders/ground.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from '../render/shaders/logdepth.glsl.js'
import { TableGround } from './ground.js'
import { Coast } from './coast.js'

// The tray: a frame round the relief at sea level, and walls from it down to
// the sea floor at the pack's edge (wherever the exaggeration has it now), so
// the relief reads as a model in a tray rather than a sheet cut off in the air.
const trayVertex = /* glsl */ `
${constants}
${world}
${groundChunk}
${logDepthParsVertex}
in vec3 aSample;   // xz: where to read the ground (just inside the pack); z of the attribute: 1 on the wall's foot
out float vWall;
void main() {
  vec3 p = position;
  if (aSample.z > 0.5) p.y = min(groundMetres(aSample.xy), 0.0) * uVert;
  vWall = aSample.z > -0.5 ? 1.0 : 0.0;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.0);
  ${logDepthVertex}
}
`
const trayFragment = /* glsl */ `
${logDepthParsFragment}
uniform vec3 uFrame;
uniform vec3 uWall;
uniform vec3 uSkyColor;
uniform vec3 uSunColor;
in float vWall;
void main() {
  ${logDepthFragment}
  vec3 light = uSkyColor * 1.2 + uSunColor * 0.25;
  gl_FragColor = vec4(mix(uFrame, uWall, vWall) * light, 1.0);
}
`

function trayGeometry(b, pad, n = 64) {
  const pos = []
  const smp = []
  const idx = []
  const quad = (a, c, d, e) => idx.push(a, c, d, a, d, e)
  // the frame: four quads round the rect at y = 0 (aSample.z = -1: neither wall nor foot)
  const X0 = b.x0 - pad
  const X1 = b.x1 + pad
  const Z0 = b.z0 - pad
  const Z1 = b.z1 + pad
  const ring = [
    [X0, Z0, b.x0, b.z0],
    [X1, Z0, b.x1, b.z0],
    [X1, Z1, b.x1, b.z1],
    [X0, Z1, b.x0, b.z1],
  ]
  for (let k = 0; k < 4; k++) {
    const [ox0, oz0, ix0, iz0] = ring[k]
    const [ox1, oz1, ix1, iz1] = ring[(k + 1) % 4]
    const i = pos.length / 3
    pos.push(ox0, 0, oz0, ox1, 0, oz1, ix1, 0, iz1, ix0, 0, iz0)
    for (let q = 0; q < 4; q++) smp.push(0, 0, -1)
    quad(i, i + 1, i + 2, i + 3)
  }
  // the walls: n segments along each edge, top at 0, foot on the ground just inside
  const inset = Math.min(b.x1 - b.x0, b.z1 - b.z0) * 1e-3
  const edges = [
    [b.x0, b.z0, b.x1, b.z0, 0, inset],
    [b.x1, b.z0, b.x1, b.z1, -inset, 0],
    [b.x1, b.z1, b.x0, b.z1, 0, -inset],
    [b.x0, b.z1, b.x0, b.z0, inset, 0],
  ]
  for (const [ax, az, bx, bz, dx, dz] of edges) {
    const i0 = pos.length / 3
    for (let s = 0; s <= n; s++) {
      const t = s / n
      const x = ax + (bx - ax) * t
      const z = az + (bz - az) * t
      pos.push(x, 0, z, x, 0, z)
      smp.push(x + dx, z + dz, 0, x + dx, z + dz, 1)
    }
    for (let s = 0; s < n; s++) quad(i0 + 2 * s, i0 + 2 * s + 2, i0 + 2 * s + 3, i0 + 2 * s + 1)
  }
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  g.setAttribute('aSample', new THREE.Float32BufferAttribute(smp, 3))
  g.setIndex(idx)
  return g
}

export class TableScene {
  constructor(app, data) {
    this.app = app
    this.data = data
    this.name = 'table'
    this.scene = new THREE.Scene()
    this.group = new THREE.Group()
    this.scene.add(this.group)
    this.camera = new THREE.PerspectiveCamera(42, 1, TABLE.near, TABLE.far)
    this.ground = new TableGround(app, data.table, data.proj)
    this.group.add(this.ground.group)
    this.uniforms = { ...app.light.uniforms, ...this.ground.uniforms }

    const b = this.ground.bounds
    this.trayMaterial = new THREE.ShaderMaterial({
      vertexShader: trayVertex,
      fragmentShader: trayFragment,
      uniforms: { ...this.uniforms, uFrame: { value: new THREE.Color(0.016, 0.026, 0.038) }, uWall: { value: new THREE.Color(0.05, 0.075, 0.1) } },
      side: THREE.DoubleSide,
    })
    this.tray = new THREE.Mesh(trayGeometry(b, Math.max(b.x1 - b.x0, b.z1 - b.z0) * 1.5), this.trayMaterial)
    this.tray.frustumCulled = false
    this.group.add(this.tray)

    this.coast = data.coast ? new Coast(data.coast, data.proj, this.uniforms) : null
    if (this.coast) this.group.add(this.coast.group)

    this.rig = new CameraRig(this.camera, app.canvas, this.ground, TABLE)
    this.outlines = new Map()
    // the overlays' strength: 1 on the table, easing to 0 over the last third of a fly-down
    this.fade = 1
    this._res = new THREE.Vector2()
  }

  /** The sky this scene is lit by: the war room's fixed afternoon. */
  get skyPlace() {
    return { lat: WAR_ROOM.lat, lon: WAR_ROOM.lon }
  }

  skyInstant() {
    return WAR_ROOM.utc
  }

  /** The haze for the camera's distance: the Hawaiian aerial perspective, scaled to the view (unit-free). */
  fog() {
    const d = this.rig.state.distance
    return { density: 0.09 / Math.max(3, d), falloff: 2.0 / Math.max(3, d) }
  }

  update(dt) {
    this.rig.update(dt)
    const d = this.rig.state.distance
    this.ground.update(this.camera, d)
    const r = this.app.renderer
    r.getDrawingBufferSize(this._res)
    const dpr = r.getPixelRatio()
    this.coast?.update(this.camera, this._res, dpr, this.fade)
    for (const o of this.outlines.values()) {
      o.lines.uniforms.uWidth.value = 2.2 * dpr
      o.lines.update(this.camera, this._res, o.on ? 0.95 : 0)
    }
  }

  /** Everything that eases, straight to where it is going (tools, screenshots). */
  settle() {
    const rig = this.rig
    rig.finishFlight()
    const g = rig.goal
    for (const s of [rig.goal, rig.state]) {
      s.target.copy(g.target)
      s.distance = g.distance
      s.yaw = g.yaw
      s.pitch = g.pitch
    }
    this.ground.update(this.camera, g.distance)
    rig.jump({ x: g.target.x, z: g.target.z })
    this.ground.update(this.camera, g.distance)
  }

  /** The rig's flight to a view ({ target, distance, yaw, pitch }); resolves on landing. */
  flyTo(view, { duration = 2.5, ready } = {}) {
    return new Promise((resolve) => this.rig.flyTo(view, duration, { ready, onDone: resolve }))
  }

  /** The hand-over pose over a box (ENGINEERING §9): its centre at 0.8 × its diagonal, looking north up the box. */
  outlineView(boxId) {
    const box = this.data.boxById.get(boxId)
    if (!box) throw new Error(`no box “${boxId}”`)
    const pl = box.placement
    const r = box.pack.rect
    const diagKm = Math.hypot(r.x1 - r.x0, r.z1 - r.z0) * pl.scale
    const distance = TABLE.handoverK * diagKm
    const [x, z] = pl.centre
    return { target: { x, y: 0, z }, distance, yaw: -pl.alpha, pitch: this.rig.pitchFor(distance) }
  }

  /** A box's rectangle on the table, through its placement (ENGINEERING §10). */
  outline(boxId, on = true) {
    let o = this.outlines.get(boxId)
    if (!o && on) {
      const box = this.data.boxById.get(boxId)
      if (!box) throw new Error(`no box “${boxId}”`)
      const r = box.pack.rect
      const pl = box.placement
      const ring = [
        [r.x0, r.z0],
        [r.x1, r.z0],
        [r.x1, r.z1],
        [r.x0, r.z1],
        [r.x0, r.z0],
      ].map((p) => pl.toTable(p))
      const lines = new LineSet([ring], null, this.uniforms, { world: true, color: [1.6, 1.25, 0.7], width: 2.2, order: 5, maxSeg: 10, lift: [0.05, 0.003], height: 300 })
      o = { lines, on }
      this.outlines.set(boxId, o)
      this.group.add(lines.group)
    }
    if (o) o.on = on
    return o
  }

  setRange(k) {
    this.ground.setRange(k)
  }

  stats() {
    return { scene: 'table', ...this.ground.stats(), distance: +this.rig.state.distance.toFixed(1), fade: this.fade }
  }

  dispose() {
    this.rig.dispose()
    this.ground.dispose()
    this.coast?.dispose()
    for (const o of this.outlines.values()) o.lines.dispose()
    this.tray.geometry.dispose()
    this.trayMaterial.dispose()
  }
}
