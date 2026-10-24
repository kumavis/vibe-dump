import * as THREE from 'three'
import { clamp, damp, yawTo } from '../core/mathx.js'
import { MOTORBIKE } from '../data/vehicles.js'
import { Jeep, Parts, findWinchSpot, footprintClear } from './jeep.js'
import { stabilizedLean } from './stabilizer.js'

// Shares the ground vehicle's collision, suspension, repair and camera systems.
// Two visible wheels, narrow tyre-edge ground probes, and active gyro balance.
export class Motorbike extends Jeep {
  static atDock(G) {
    const dock = G.island.poi.dock
    const origin = new THREE.Vector3(dock.x, G.island.heightAt(dock.x, dock.z), dock.z)
    // Start along the dock's inland road, pointed toward the station. A
    // clear shore-side patch can still face a steep bank or the sea.
    for (const road of G.island.roads) {
      for (let i = 0; i < road.pts.length - 1; i++) {
        const [rx, rz] = road.pts[i]
        const d = Math.hypot(rx - dock.x, rz - dock.z)
        if (d < 8 || d > 32) continue
        const [nx, nz] = road.pts[Math.min(i + 3, road.pts.length - 1)]
        const yaw = yawTo(rx, rz, nx, nz)
        // Leave the road's centre open to walkers.
        for (const side of [-1.1, 1.1, 0]) {
          const x = rx + Math.cos(yaw) * side, z = rz - Math.sin(yaw) * side
          const y = G.island.heightAt(x, z)
          if (footprintClear(G, x, z, yaw, y, MOTORBIKE)) return new Motorbike(G, new THREE.Vector3(x, y, z), yaw)
        }
      }
    }
    const spot = findWinchSpot(G, origin, 40, MOTORBIKE)
    if (!spot) throw new Error('No clear ground for the dock motorbike')
    return new Motorbike(G, spot.pos, spot.yaw)
  }

  constructor(G, pos, yaw) {
    super(G, pos, yaw, MOTORBIKE)
    this.balanceLean = 0
    this.gyroAngle = 0
    this.roll = this.rollV = 0
    this.sync()
  }

  boardLabel() { return 'Ride motorbike · stabilizer ON' }

  onEnter() {
    this.warmLights()
    if (this.G.sky.light < 0.35) this.setLights(true)
    this.G.audio?.play('ignition', { pos: this.pos })
    const pad = this.G.input.lastDevice === 'gamepad'
    this.G.toast(pad
      ? 'Stabilizer ON · Left stick: ride / steer · A: brake · Y: dismount when stopped · LB: camera · RS: headlight'
      : 'Stabilizer ON · W/S: ride / reverse · A/D: steer · Space: brake · E: dismount when stopped · V: camera · F: headlight', 'info', 9)
  }

  stabilize(dt) {
    this.balanceLean = stabilizedLean(this.balanceLean || 0, this.lastVf, this.yawRate, dt, this.tune.stabilizer)
    this.roll = this.balanceLean
    this.rollV = 0
  }

  update(dt, input) {
    // Keep balancing even with the engine off. The gyro counter-rotates
    // against the frame's lean, while its inner flywheel spins continuously.
    if (this.parked && !this.occupied) {
      this.balanceLean = damp(this.balanceLean || 0, 0, this.tune.stabilizer.response, dt)
      this.roll = this.balanceLean
      this.rollV = 0
    }
    super.update(dt, input)
    this.gyroAngle = (this.gyroAngle + dt * (this.occupied ? 20 : 5)) % (Math.PI * 2)
    this.gyro.rotation.z = -this.roll
    this.flywheel.rotation.y = this.gyroAngle
  }

  placeWheels() {
    const W = this.tune.wheel
    for (let i = 0; i < 2; i++) {
      const lz = i ? W.z : -W.z
      const h = (this.wheelH[i * 2] + this.wheelH[i * 2 + 1]) / 2
      const plane = this.pos.y + this.lift - lz * Math.sin(this.pitch)
      const wheel = this.wheels[i]
      wheel.position.y = W.r + clamp(h - plane, -W.travel, W.travel)
      wheel.spin.rotation.x = -this.spinAngle
      if (!i) wheel.rotation.y = this.steer
    }
    if (this.handlebars) this.handlebars.rotation.y = this.steer
  }

  // The rider's horizon stays mostly level; the bike banks beneath them.
  seatCamera(cam) {
    super.seatCamera(cam)
    cam.rotation.z = this.roll * 0.15
  }

  buildModel() {
    const mat = color => new THREE.MeshLambertMaterial({ color })
    const paint = mat(0xc88a38), black = mat(0x202722), metal = mat(0xaab2aa)
    const seat = mat(0x3c3329), green = mat(0x73e4b7), shirt = mat(0x758264)
    const skin = mat(0xc99e7a), helmet = mat(0xd8cba9)
    this.lensMat = new THREE.MeshLambertMaterial({ color: 0xffefd2, emissive: 0 })
    this.tailMat = new THREE.MeshLambertMaterial({ color: 0x971d12, emissive: 0 })
    const g = new THREE.Group()
    g.rotation.order = 'YXZ'
    const p = new Parts()
    // Tubular frame, engine fins, tapered tank and long trail saddle.
    for (const x of [-0.16, 0.16]) {
      p.tube(black, 0.045, [x, 0.4, 0.7], [x, 1.05, -0.48])
      p.tube(black, 0.045, [x, 0.4, 0.7], [x, 0.42, -0.42])
      p.tube(black, 0.045, [x, 0.42, -0.42], [x, 1.05, -0.48])
      p.tube(metal, 0.035, [x, 0.4, 0.85], [x, 0.8, 0.3])
      p.tube(metal, 0.035, [x, 0.4, -0.85], [x, 1.18, -0.55])
    }
    p.box(black, 0.38, 0.3, 0.4, 0, 0.58, 0)
    for (let i = 0; i < 5; i++) p.box(metal, 0.4, 0.025, 0.34, 0, 0.49 + i * 0.05, -0.02)
    p.add(paint, new THREE.SphereGeometry(1, 14, 10).scale(0.26, 0.22, 0.4), 0, 0.95, -0.25)
    p.box(seat, 0.35, 0.12, 0.8, 0, 0.94, 0.4, -0.08)
    p.box(paint, 0.22, 0.06, 0.65, 0, 0.86, 0.88, -0.15)
    p.box(paint, 0.22, 0.05, 0.62, 0, 0.86, -0.9, 0.1)
    p.cyl(metal, 0.07, 0.07, 0.7, 10, 0.26, 0.57, 0.5, Math.PI / 2)
    p.tube(black, 0.035, [-0.38, 0.48, 0.2], [0.38, 0.48, 0.2])
    // Rear luggage rack and compact field bag.
    p.box(black, 0.42, 0.05, 0.35, 0, 1.01, 0.87)
    p.box(shirt, 0.35, 0.24, 0.26, 0, 1.14, 0.87)
    p.box(this.tailMat, 0.16, 0.07, 0.04, 0, 0.89, 1.19)
    p.cyl(this.lensMat, 0.13, 0.13, 0.08, 16, 0, 1.15, -0.75, Math.PI / 2)
    p.build(g)

    this.handlebars = new THREE.Group()
    this.handlebars.position.set(0, 1.23, -0.5)
    const bars = new Parts()
    bars.tube(metal, 0.025, [-0.42, 0, 0.12], [0.42, 0, 0.12])
    for (const x of [-0.36, 0.36]) bars.box(black, 0.16, 0.06, 0.06, x, 0, 0.12)
    bars.box(black, 0.18, 0.05, 0.13, 0, 0.015, 0.06)
    bars.box(green, 0.12, 0.012, 0.07, 0, 0.048, 0.06)
    bars.build(this.handlebars)
    g.add(this.handlebars)

    this.wheels = []
    for (const z of [-this.tune.wheel.z, this.tune.wheel.z]) {
      const pivot = new THREE.Group(), spin = new THREE.Group()
      pivot.position.set(0, this.tune.wheel.r, z)
      const tyre = new THREE.Mesh(new THREE.TorusGeometry(0.295, 0.085, 8, 24), black)
      tyre.rotation.y = Math.PI / 2
      spin.add(tyre)
      const rim = new Parts()
      rim.cyl(metal, 0.09, 0.09, 0.21, 12, 0, 0, 0, 0, 0, Math.PI / 2)
      for (let i = 0; i < 12; i++) {
        const a = i * Math.PI / 6
        rim.tube(metal, 0.012, [0, 0, 0], [0, Math.cos(a) * 0.27, Math.sin(a) * 0.27])
        rim.box(black, 0.19, 0.045, 0.09, 0, Math.cos(a) * 0.365, Math.sin(a) * 0.365, a)
      }
      rim.build(spin)
      pivot.add(spin)
      pivot.spin = spin
      this.wheels.push(pivot)
      g.add(pivot)
    }
    // Exposed gyroscope on the left flank: a protective cage, gimbal and
    // luminous spinning flywheel make the stabilizer readable from chase view.
    this.gyro = new THREE.Group()
    this.gyro.position.set(-0.32, 0.66, 0.18)
    const cage = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.025, 8, 24), metal)
    cage.rotation.y = Math.PI / 2
    this.gyro.add(cage)
    this.flywheel = new THREE.Group()
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.035, 8, 24), green)
    ring.rotation.x = Math.PI / 2
    this.flywheel.add(ring)
    const fly = new Parts()
    for (const a of [0, Math.PI / 2]) fly.box(metal, 0.34, 0.025, 0.025, 0, 0, 0, 0, a)
    fly.build(this.flywheel)
    this.gyro.add(this.flywheel)
    g.add(this.gyro)

    const rider = new Parts()
    rider.box(shirt, 0.39, 0.5, 0.23, 0, 1.35, 0.24, -0.2)
    rider.add(skin, new THREE.SphereGeometry(0.105, 10, 8), 0, 1.66, 0.15)
    rider.add(helmet, new THREE.SphereGeometry(0.145, 12, 10), 0, 1.77, 0.16)
    for (const side of [-1, 1]) {
      rider.tube(shirt, 0.075, [side * 0.17, 1.03, 0.4], [side * 0.28, 0.74, 0.02])
      rider.tube(black, 0.065, [side * 0.28, 0.74, 0.02], [side * 0.28, 0.49, 0.2])
      rider.tube(shirt, 0.06, [side * 0.2, 1.5, 0.17], [side * 0.3, 1.3, -0.13])
      rider.tube(skin, 0.045, [side * 0.3, 1.3, -0.13], [side * 0.35, 1.23, -0.38])
    }
    this.driver = new THREE.Group()
    rider.build(this.driver)
    this.driver.visible = false
    g.add(this.driver)
    const L = this.tune.lights
    this.headlight = new THREE.SpotLight(0xffedcb, L.intensity, L.range, L.angle, L.penumbra, L.decay)
    this.headlight.position.set(0, 1.15, -0.8)
    this.headlight.target.position.set(0, 0.5, -15)
    this.headlight.visible = false
    g.add(this.headlight, this.headlight.target)
    g.traverse(o => { if (o.isMesh) o.castShadow = o.receiveShadow = true })
    this.model = g
    this.G.scene.add(g)
  }
}
