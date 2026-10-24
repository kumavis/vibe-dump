import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { rustedPaint } from '../world/textures.js'
import { HUMVEE } from '../data/vehicles.js'
import { Jeep, Parts } from './jeep.js'

// The security detachment's humvee from Camp Halvorsen's motor pool. It is
// the jeep underneath — the same ground handling, suspension, winch and
// repairs — with its own tune table (heavier, wider, on bigger tyres, an
// armoured closed cab: data/vehicles.js HUMVEE) and its own body: a low slab
// of olive steel with a wide grille, a split windscreen, a roof hatch and a
// gun ring whose machine gun rusted solid long ago.

const WX = [-1, 1, -1, 1] // FL, FR, RL, RR
const WZ = [-1, -1, 1, 1]

export class Humvee extends Jeep {
  // In its bay in the motor pool, nose out to the yard (world/structures.js).
  static atBase(G) {
    const bay = G.island.poi.milbase?.bays?.humvee
    if (!bay) return null
    return new Humvee(G, bay.pos, bay.yaw)
  }

  constructor(G, pos, yaw) {
    super(G, pos, yaw, HUMVEE)
  }

  boardLabel() {
    return 'Drive humvee'
  }

  onEnter() {
    const G = this.G
    this.warmLights()
    if (G.sky && G.sky.light < 0.35 && !this.lights) this.setLights(true)
    G.audio?.play('ignition', { pos: this.pos })
    G.toast(
      G.input.lastDevice === 'gamepad'
        ? 'Humvee · Left stick: drive / steer · A: handbrake · RS: headlights · LB: camera · Right stick: look · Y: exit (stopped)'
        : 'Humvee · W/S: drive · A/D: steer · Space: handbrake · F: headlights · V: camera · Mouse: look · E: exit (stopped)',
      'info',
      7,
    )
  }

  buildModel() {
    const T = this.tune
    const W = T.wheel
    const L = (o) => new THREE.MeshLambertMaterial(o)
    const M = {
      paint: L({ map: rustedPaint(T.paint) }),
      dark: L({ color: 0x2a2b25 }),
      black: L({ color: 0x151614 }),
      rim: L({ color: 0x4f5340 }),
      seat: L({ color: 0x3b3a2c }),
      gun: L({ color: 0x5a3c26 }), // rust right through
      canvas: L({ color: 0x5f5d40 }),
      skin: L({ color: 0xc69872 }),
      shirt: L({ color: 0x6a6c4c }),
      moss: L({ color: 0x4a6a2c, side: THREE.DoubleSide }),
    }
    this.lensMat = L({ color: 0xf0ead6, emissive: 0x000000 })
    this.tailMat = L({ color: 0x6a1008, emissive: 0x000000 })
    const glass = new THREE.MeshPhongMaterial({ color: 0x6a8088, transparent: true, opacity: 0.35, shininess: 90, depthWrite: false, side: THREE.DoubleSide })
    const P = new Parts()
    const g = new THREE.Group()
    g.rotation.order = 'YXZ'
    const hw = T.halfWidth
    const hl = T.halfLength

    // chassis, axles and the belly plate
    for (const x of [-0.55, 0.55]) P.box(M.black, 0.14, 0.2, 4.4, x, 0.6, 0)
    for (const z of [-W.z, W.z]) P.cyl(M.black, 0.07, 0.07, 1.7, 8, 0, W.r, z, 0, 0, Math.PI / 2)
    P.box(M.dark, 1.5, 0.12, 4.2, 0, 0.5, 0)
    // the body: a wide low tub, the long flat hood sloping to the grille,
    // a squared cab and the cargo deck behind it
    P.box(M.paint, 2 * hw, 0.62, 2 * hl - 0.3, 0, 1.0, 0.05)
    P.box(M.paint, 2 * hw - 0.1, 0.18, 1.7, 0, 1.38, -1.55, 0.06)
    P.box(M.paint, 2 * hw - 0.2, 0.5, 0.1, 0, 1.0, -hl + 0.05)
    for (let i = 0; i < 6; i++) P.box(M.black, 0.12, 0.34, 0.04, -0.5 + i * 0.2, 1.0, -hl - 0.01)
    for (const x of [-0.75, 0.75]) P.box(M.black, 0.26, 0.18, 0.06, x, 1.18, -hl - 0.01)
    P.box(M.black, 2 * hw + 0.1, 0.2, 0.18, 0, 0.58, -hl - 0.05)
    // wheel arches: flared fenders over all four
    for (const s of [-1, 1]) for (const z of [-W.z, W.z]) P.add(M.paint, new THREE.CylinderGeometry(0.6, 0.6, 0.42, 12, 1, true, 0, Math.PI), s * (hw - 0.12), W.r, z, 0, 0, Math.PI / 2)
    // the cab: pillars, doors with small armoured windows, roof
    const cz0 = -0.65
    const cz1 = 0.95
    for (const s of [-1, 1]) {
      P.box(M.paint, 0.08, 0.62, cz1 - cz0, s * (hw - 0.06), 1.62, (cz0 + cz1) / 2)
      for (const z of [cz0 + 0.02, (cz0 + cz1) / 2, cz1 - 0.02]) P.box(M.paint, 0.1, 0.62, 0.08, s * (hw - 0.07), 1.62, z)
      P.box(M.dark, 0.04, 0.02, cz1 - cz0 - 0.1, s * (hw - 0.02), 1.3, (cz0 + cz1) / 2) // door seam
    }
    P.box(M.paint, 2 * hw, 0.1, cz1 - cz0 + 0.1, 0, 1.97, (cz0 + cz1) / 2)
    P.box(M.paint, 2 * hw - 0.1, 0.62, 0.08, 0, 1.62, cz1)
    // the split windscreen, leaning back a little
    for (const x of [-0.52, 0.52]) {
      const ws = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.55), glass)
      ws.position.set(x, 1.63, cz0 - 0.02)
      ws.rotation.x = -0.12
      g.add(ws)
    }
    P.box(M.paint, 0.1, 0.62, 0.1, 0, 1.62, cz0)
    for (const s of [-1, 1]) {
      const sw = new THREE.Mesh(new THREE.PlaneGeometry(0.75, 0.42), glass)
      sw.position.set(s * (hw - 0.02), 1.66, -0.2)
      sw.rotation.y = s * Math.PI / 2
      g.add(sw)
    }
    // the cargo deck: canvas over the bows, a jerrycan rack, tail lamps
    P.box(M.paint, 2 * hw, 0.4, 0.08, 0, 1.5, hl - 0.05)
    for (const s of [-1, 1]) P.box(M.paint, 0.08, 0.4, hl - cz1 - 0.1, s * (hw - 0.04), 1.5, (hl + cz1) / 2)
    P.add(M.canvas, new THREE.CylinderGeometry(hw - 0.05, hw - 0.05, hl - cz1 - 0.2, 10, 1, false, -Math.PI / 2, Math.PI), 0, 1.62, (hl + cz1) / 2, -Math.PI / 2, 0, 0)
    for (const x of [-0.7, 0.7]) P.add(this.tailMat, new THREE.BoxGeometry(0.12, 0.14, 0.03), x, 1.12, hl + 0.01)
    for (const x of [-0.25, 0.25]) P.box(M.paint, 0.18, 0.46, 0.32, x, 1.25, hl + 0.2)
    // roof: the gun ring, its shield and the seized gun, a hatch thrown open
    P.cyl(M.dark, 0.55, 0.55, 0.12, 16, 0, 2.08, 0.1)
    P.box(M.paint, 1.0, 0.5, 0.06, 0, 2.38, -0.35, -0.1)
    for (const s of [-1, 1]) P.box(M.paint, 0.06, 0.45, 0.5, s * 0.5, 2.36, -0.15, 0, s * 0.35)
    P.tube(M.gun, 0.035, [0.05, 2.45, 0.1], [0.32, 2.62, -1.3])
    P.box(M.gun, 0.16, 0.18, 0.5, 0.05, 2.42, 0.2, -0.12, 0.2)
    P.box(M.gun, 0.06, 0.4, 0.06, 0.05, 2.25, 0.25)
    P.box(M.paint, 0.6, 0.05, 0.6, -0.55, 2.3, 0.6, 1.2) // the hatch lid
    // mirrors, whip aerials, a tow hook, moss in the corners of the hood
    for (const s of [-1, 1]) P.box(M.black, 0.06, 0.2, 0.18, s * (hw + 0.12), 1.68, cz0 + 0.05)
    for (const s of [-1, 1]) P.tube(M.black, 0.01, [s * 0.9, 1.6, hl - 0.2], [s * 0.95, 3.5, hl - 0.1])
    P.box(M.black, 0.3, 0.1, 0.18, 0, 0.62, -hl - 0.15)
    P.add(M.moss, new THREE.CircleGeometry(0.3, 6), -0.7, 1.485, -2.1, -Math.PI / 2 + 0.06, 0, 0)
    P.add(M.moss, new THREE.CircleGeometry(0.22, 6), 0.8, 1.48, -1.9, -Math.PI / 2 + 0.06, 0, 0)
    // seats inside
    for (const x of [-0.5, 0.5]) {
      P.box(M.seat, 0.5, 0.12, 0.5, x, 1.15, 0.35)
      P.box(M.seat, 0.5, 0.55, 0.1, x, 1.45, 0.62, -0.1)
    }
    P.build(g)

    // headlamp lenses and the beam between them
    const lens = new THREE.Mesh(mergeGeometries([-0.75, 0.75].map((x) => new THREE.CylinderGeometry(0.08, 0.08, 0.02, 12).rotateX(Math.PI / 2).translate(x, 1.18, -hl - 0.05))), this.lensMat)
    g.add(lens)
    const Lt = T.lights
    const beam = new THREE.SpotLight(0xfff0d0, Lt.intensity, Lt.range, Lt.angle, Lt.penumbra, Lt.decay)
    beam.position.set(0, 1.15, -hl - 0.1)
    beam.target.position.set(0, 0, -hl - 20)
    beam.visible = false
    g.add(beam, beam.target)
    this.headlight = beam

    // the wheels: big, chunky, a bead-lock rim
    const tyre = new THREE.CylinderGeometry(W.r, W.r, W.width, 20).rotateZ(Math.PI / 2)
    const rim = mergeGeometries([
      new THREE.CylinderGeometry(W.r * 0.55, W.r * 0.55, W.width + 0.012, 8).rotateZ(Math.PI / 2),
      ...[0, 1, 2, 3, 4, 5, 6, 7].map((i) => new THREE.BoxGeometry(W.width + 0.03, 0.05, 0.05).translate(0, Math.cos((i / 8) * Math.PI * 2) * W.r * 0.4, Math.sin((i / 8) * Math.PI * 2) * W.r * 0.4)),
    ])
    const tread = L({ color: 0x1b1b19 })
    this.wheels = []
    for (let i = 0; i < 4; i++) {
      const pivot = new THREE.Group()
      pivot.position.set(WX[i] * W.x, W.r, WZ[i] * W.z)
      const spin = new THREE.Group()
      spin.add(new THREE.Mesh(tyre, tread), new THREE.Mesh(rim, M.rim))
      pivot.add(spin)
      pivot.spin = spin
      g.add(pivot)
      this.wheels.push(pivot)
    }

    // the driver behind the screen, seen from the chase camera
    const D = new Parts()
    D.box(M.shirt, 0.42, 0.5, 0.26, 0, 1.55, 0.45, -0.1)
    D.add(M.skin, new THREE.SphereGeometry(0.11, 10, 8), 0, 1.9, 0.4)
    D.cyl(M.shirt, 0.13, 0.13, 0.08, 10, 0, 1.99, 0.4)
    for (const x of [-0.2, 0.2]) D.tube(M.shirt, 0.05, [x, 1.72, 0.42], [x * 0.8, 1.5, 0.05])
    this.driver = new THREE.Group()
    this.driver.position.x = -0.5
    D.build(this.driver)
    this.driver.visible = false
    g.add(this.driver)

    g.traverse((o) => {
      if (o.isMesh && !o.material.transparent) {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    this.model = g
    this.G.scene.add(g)
  }
}
