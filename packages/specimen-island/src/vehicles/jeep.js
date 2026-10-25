import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { clamp, damp, dampAngle, lerp, segDist, yawDirX, yawDirZ, yawTo } from '../core/mathx.js'
import { paintedMetal } from '../world/textures.js'
import { JEEP } from '../data/vehicles.js'
import { SHAKE } from '../data/shake.js'
import { Vehicle } from './vehicle.js'

// The station's ranger jeep: an open-top 4x4 at real scale. Arcade but
// grounded — W/S throttle, brake and reverse, A/D steer (less at speed),
// Space handbrake (the tail slides), F headlights. Quick on the dirt roads and
// bridge decks, slower and bumpier across country; it climbs what its engine
// can, fords up to 0.8 m of water and won't drive any deeper, though it can
// always back out. If it does get stuck, the board prompt winches it free.
// Every wheel samples its own patch of ground, and the body rides springs
// over the four of them.
//
// It shares the island with the animals: small ones go under the bull bar
// (which the Foundation counts as killing them), big ones stop it cold and
// may take offence. Its engine is heard 25 m away idling, 80 m flat out.

const WX = [-1, 1, -1, 1] // FL, FR, RL, RR
const WZ = [-1, -1, 1, 1]
const _c = { x: 0, z: 0 }
const _a = { x: 0, z: 0 }
const _b = { x: 0, z: 0 }

// Position-based washboard, -1..1: the same rut is always in the same place.
const bumpAt = (x, z) => Math.sin(x * 1.9 + z * 0.7) * Math.sin(z * 1.6 - x * 0.45) * 0.7 + Math.sin(x * 4.1 - z * 3.3) * 0.3

export class Jeep extends Vehicle {
  // Parked at Ranger Station Alpha, beside the building, nose toward a road
  // it can drive straight onto.
  static atStation(G) {
    const { pos, yaw } = findStationSpot(G)
    return new Jeep(G, pos, yaw)
  }

  constructor(G, pos, yaw, tune = JEEP) {
    super(G, tune, pos, yaw)
    this.steer = 0
    this.yawRate = 0
    this.rpm = 0
    this.load = 0
    this.vy = 0
    this.lastGnd = pos.y
    this.lastVf = 0
    this.pitchV = 0
    this.rollV = 0
    this.lift = 0
    this.liftV = 0
    this.spinAngle = 0
    this.lights = false
    this.warmedFor = null
    this.lookIdle = 0
    this.wetToastT = -99
    this.stuckT = 0 // seconds the driver has been asking to move and getting nowhere
    this.stuckToast = false
    this.engineQuiet = true
    this.wheelH = [pos.y, pos.y, pos.y, pos.y]
    this.surface = { road: 1, cover: 0, wading: 0, top: tune.top.road }
    this.winchAction = { label: `Recover the ${tune.name} onto firm ground`, hold: tune.winch.hold, use: () => this.winchOut() }
    this.buildModel()
    this.settle()
    this.park()
    this.registerBoard(tune.kind)
  }

  boardLabel() {
    return 'Drive jeep'
  }

  // A wreck gets the field repair; a jeep its last driver couldn't move (bogged
  // in a river, wedged on a bank) gets winched out.
  recovery() {
    if (this.destroyed) return this.fieldRepairAction
    return this.stuckT > this.tune.winch.stuckAfter ? this.winchAction : null
  }

  // Haul it onto the nearest clear, dry, level patch, facing away from
  // wherever it was stuck.
  winchOut() {
    const G = this.G
    const spot = findWinchSpot(G, this.pos, this.tune.winch.range, this.tune)
    if (!spot) {
      // let the driver have another go rather than lock them out of it
      this.stuckT = 0
      G.toast('Nothing firm within reach to winch against', 'warn')
      return
    }
    this.unpark()
    this.pos.copy(spot.pos)
    this.yaw = spot.yaw
    this.camYaw = spot.yaw
    this.vel.set(0, 0, 0)
    this.vy = 0
    this.pitchV = this.rollV = 0
    this.stuckT = 0
    this.stuckToast = false
    this.settle()
    this.park()
    G.audio?.play('pump', { pos: this.pos })
    G.toast('Winched clear — back on firm ground.', 'info')
  }

  // ------------------------------------------------------------ model
  buildModel() {
    const T = this.tune
    const W = T.wheel
    const L = (o) => new THREE.MeshLambertMaterial(o)
    const M = {
      paint: L({ map: paintedMetal(T.paint) }),
      dark: L({ color: 0x2b2a26 }),
      black: L({ color: 0x161616 }),
      seat: L({ color: 0x3a3126 }),
      rim: L({ color: 0xa9a596 }),
      can: L({ map: paintedMetal([92, 104, 70]) }),
      skin: L({ color: 0xc69872 }),
      shirt: L({ color: 0x8a7c56 }),
      hat: L({ color: 0x9a875a }),
    }
    this.lensMat = L({ color: 0xf4eedc, emissive: 0x000000 })
    this.tailMat = L({ color: 0x6a1008, emissive: 0x000000 })
    const glass = new THREE.MeshPhongMaterial({ color: 0x8aa6ae, transparent: true, opacity: 0.22, shininess: 100, depthWrite: false, side: THREE.DoubleSide })
    const P = new Parts()
    const g = new THREE.Group()
    g.rotation.order = 'YXZ'

    // chassis: rails, axles, engine block, running boards
    for (const x of [-0.5, 0.5]) P.box(M.black, 0.12, 0.16, 3.9, x, 0.52, -0.1)
    for (const z of [-W.z, W.z]) P.cyl(M.black, 0.06, 0.06, 1.5, 8, 0, W.r, z, 0, 0, Math.PI / 2)
    P.box(M.dark, 0.9, 0.34, 1.25, 0, 0.64, -1.3)
    for (const x of [-0.93, 0.93]) P.box(M.black, 0.14, 0.05, 1.5, x, 0.55, 0)
    // tub: floor pan between the wheels, side panels above them with the
    // classic open door cut-out, tailgate, and the cowl behind the hood
    P.box(M.paint, 1.28, 0.3, 2.4, 0, 0.7, 0.6)
    for (const s of [-1, 1]) {
      P.box(M.paint, 0.06, 0.4, 1.45, s * 0.87, 1.0, 1.075)
      P.box(M.paint, 0.06, 0.22, 0.95, s * 0.87, 0.91, -0.125)
      P.box(M.dark, 0.26, 0.04, 2.4, s * 0.77, 0.81, 0.6)
      P.box(M.paint, 0.12, 0.04, 1.45, s * 0.86, 1.21, 1.075)
    }
    P.box(M.paint, 1.8, 0.62, 0.06, 0, 0.9, 1.8)
    P.box(M.paint, 1.76, 0.4, 0.08, 0, 1.0, -0.6)
    // hood, grille with seven slots, round headlamps, bumper
    P.box(M.paint, 1.42, 0.34, 1.42, 0, 1.0, -1.31)
    P.box(M.paint, 1.3, 0.04, 1.3, 0, 1.18, -1.33)
    P.box(M.black, 1.24, 0.5, 0.06, 0, 0.95, -2.03)
    for (let i = 0; i < 7; i++) P.box(M.paint, 0.05, 0.4, 0.04, -0.3 + i * 0.1, 0.95, -2.07)
    for (const x of [-0.47, 0.47]) P.cyl(M.paint, 0.135, 0.135, 0.06, 14, x, 1.0, -2.07, Math.PI / 2)
    P.box(M.black, 1.72, 0.14, 0.16, 0, 0.56, -2.08)
    P.box(M.black, 1.72, 0.12, 0.12, 0, 0.6, 1.86)
    // fenders over the front wheels, black flares arching over all four
    for (const s of [-1, 1]) {
      P.box(M.paint, 0.34, 0.05, 1.15, s * 0.84, 0.88, -1.3)
      P.box(M.paint, 0.34, 0.05, 0.36, s * 0.84, 0.77, -1.98, 0.55)
      for (const z of [-W.z, W.z]) P.add(M.black, new THREE.CylinderGeometry(0.45, 0.45, 0.34, 12, 1, true, 0, Math.PI), s * 0.82, W.r, z, 0, 0, Math.PI / 2)
    }
    // bull bar
    const tube = (a, b, r = 0.035) => P.tube(M.black, r, a, b)
    for (const x of [-0.42, 0.42]) {
      tube([x, 0.5, -2.2], [x, 1.16, -2.2])
      tube([x, 0.62, -2.2], [x * 1.9, 0.56, -2.1])
    }
    tube([-0.62, 1.12, -2.2], [0.62, 1.12, -2.2])
    tube([-0.62, 0.8, -2.22], [0.62, 0.8, -2.22])
    // windshield frame leaning back over the cowl, mirrors
    const tilt = 0.2
    const wc = [0, 1.52, -0.56]
    const up = [0, Math.cos(tilt), Math.sin(tilt)]
    const at = (k) => [wc[0], wc[1] + up[1] * k, wc[2] + up[2] * k]
    P.box(M.paint, 1.66, 0.06, 0.06, ...at(0.29), tilt)
    P.box(M.paint, 1.66, 0.07, 0.07, ...at(-0.29), tilt)
    for (const x of [-0.8, 0.8]) P.box(M.paint, 0.06, 0.6, 0.06, x, at(0)[1], at(0)[2], tilt)
    const shield = new THREE.Mesh(new THREE.PlaneGeometry(1.54, 0.52), glass)
    shield.position.set(...at(0))
    shield.rotation.x = tilt
    g.add(shield)
    for (const s of [-1, 1]) {
      P.box(M.black, 0.04, 0.04, 0.2, s * 0.86, 1.32, -0.6)
      P.box(M.black, 0.04, 0.16, 0.22, s * 0.96, 1.36, -0.66)
    }
    // dashboard, steering wheel, seats, rear bench
    P.box(M.dark, 1.5, 0.18, 0.3, 0, 1.12, -0.45)
    P.tube(M.black, 0.03, [-0.4, 1.06, -0.52], [-0.4, 1.27, -0.33])
    P.add(M.black, new THREE.TorusGeometry(0.18, 0.02, 6, 18), -0.4, 1.29, -0.31, -1.0)
    for (const x of [-0.4, 0.4]) {
      P.box(M.seat, 0.5, 0.12, 0.5, x, 0.92, 0.2)
      P.box(M.seat, 0.5, 0.55, 0.1, x, 1.2, 0.47, -0.12)
    }
    P.box(M.seat, 1.3, 0.12, 0.45, 0, 0.92, 1.3)
    P.box(M.seat, 1.3, 0.4, 0.1, 0, 1.12, 1.6, -0.1)
    // roll bar over the back seats, braced to the tailgate and the screen
    const rb = 1.05
    for (const x of [-0.8, 0.8]) {
      tube([x, 1.2, rb], [x, 1.9, rb], 0.045)
      tube([x, 1.86, rb], [x, 1.2, 1.76], 0.04)
      tube([x, 1.88, rb], [x * 0.98, 1.8, -0.5], 0.035)
    }
    tube([-0.8, 1.9, rb], [0.8, 1.9, rb], 0.045)
    // tail lamps, a jerrycan, a whip antenna
    for (const x of [-0.75, 0.75]) P.add(this.tailMat, new THREE.BoxGeometry(0.1, 0.14, 0.03), x, 1.05, 1.84)
    P.box(M.can, 0.17, 0.46, 0.3, -0.62, 0.98, 1.97)
    P.tube(M.black, 0.008, [0.82, 1.2, 1.7], [0.86, 2.7, 1.78])
    P.build(g)

    // headlamp lenses and their lights
    const lens = new THREE.Mesh(mergeGeometries([-0.47, 0.47].map((x) => new THREE.CylinderGeometry(0.105, 0.105, 0.02, 14).rotateX(Math.PI / 2).translate(x, 1.0, -2.105))), this.lensMat)
    g.add(lens)
    // One beam from between the lamps, in the scene only while it's on: a
    // light that exists at intensity 0 still costs every lit pixel on the
    // island (three.js loops over every visible light).
    const Lt = T.lights
    const beam = new THREE.SpotLight(0xfff0d0, Lt.intensity, Lt.range, Lt.angle, Lt.penumbra, Lt.decay)
    beam.position.set(0, 1.0, -2.15)
    beam.target.position.set(0, 0, -22)
    beam.visible = false
    g.add(beam, beam.target)
    this.headlight = beam
    // stencilled doors
    const decal = new THREE.MeshLambertMaterial({ map: doorDecal(), transparent: true, depthWrite: false })
    for (const s of [-1, 1]) {
      const d = new THREE.Mesh(new THREE.PlaneGeometry(1.1, 0.3), decal)
      d.position.set(s * 0.903, 1.02, 1.1)
      d.rotation.y = s * Math.PI / 2
      g.add(d)
    }

    // wheels: steer pivot -> spin -> tyre, rim and bolts
    const wheelGeos = wheelGeometry(W)
    const tyreMat = L({ map: tyreTexture() })
    const makeWheel = () => {
      const spin = new THREE.Group()
      spin.add(new THREE.Mesh(wheelGeos.tyre, tyreMat), new THREE.Mesh(wheelGeos.rim, M.rim))
      return spin
    }
    this.wheels = []
    for (let i = 0; i < 4; i++) {
      const pivot = new THREE.Group()
      pivot.position.set(WX[i] * W.x, W.r, WZ[i] * W.z)
      const spin = makeWheel()
      pivot.add(spin)
      pivot.spin = spin
      g.add(pivot)
      this.wheels.push(pivot)
    }
    const spare = makeWheel()
    spare.rotation.y = Math.PI / 2
    spare.position.set(0.12, 1.0, 1.96)
    g.add(spare)

    // a ranger at the wheel, seen from the chase camera
    const D = new Parts()
    D.box(M.shirt, 0.42, 0.52, 0.24, 0, 1.3, 0.3, -0.12)
    D.add(M.skin, new THREE.SphereGeometry(0.11, 10, 8), 0, 1.66, 0.25)
    D.cyl(M.hat, 0.2, 0.2, 0.02, 14, 0, 1.74, 0.25)
    D.cyl(M.hat, 0.1, 0.115, 0.1, 12, 0, 1.79, 0.25)
    for (const x of [-0.2, 0.2]) {
      D.tube(M.shirt, 0.05, [x, 1.48, 0.28], [x * 0.8, 1.3, -0.02])
      D.tube(M.skin, 0.04, [x * 0.8, 1.3, -0.02], [x * 0.5, 1.33, -0.29])
    }
    D.box(M.dark, 0.4, 0.14, 0.5, 0, 1.0, 0.0)
    this.driver = new THREE.Group()
    this.driver.position.x = -0.4
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

  // Sit it on the ground where it was placed.
  settle() {
    const ph = this.G.physics
    const W = this.tune.wheel
    const h = []
    for (let i = 0; i < 4; i++) {
      const w = this.toWorld(WX[i] * W.x, WZ[i] * W.z)
      h.push(ph.groundAt(w.x, w.z, this.pos.y + this.tune.stepUp))
    }
    this.pos.y = (h[0] + h[1] + h[2] + h[3]) / 4
    this.lastGnd = this.pos.y
    this.pitch = Math.atan2((h[0] + h[1] - h[2] - h[3]) / 2, 2 * W.z)
    this.roll = Math.atan2((h[1] + h[3] - h[0] - h[2]) / 2, 2 * W.x)
    this.wheelH = h
    this.sync()
    this.placeWheels()
  }

  // ------------------------------------------------------------ in and out
  onEnter() {
    const G = this.G
    this.warmLights()
    if (G.sky && G.sky.light < 0.35 && !this.lights) this.setLights(true)
    G.audio?.play('ignition', { pos: this.pos })
    G.toast(G.input.lastDevice === 'gamepad' ? 'Left stick: drive / steer · A: handbrake · RS: headlights · LB: camera · Right stick: look · Y: exit (stopped)' : 'W/S: drive · A/D: steer · Space: handbrake · F: headlights · V: camera · Mouse: look · E: exit (stopped)', 'info', 7)
  }

  // Climbing out of a stopped jeep leaves it parked (Vehicle.exit). Thrown
  // out of a moving one, it rolls on under the handbrake until it stops.
  onExit(force) {
    if (!force) this.vy = 0
    this.steer = 0
    if (this.lights) this.setLights(false)
  }

  setLights(on) {
    this.lights = on
    this.headlight.visible = on
    this.lensMat.emissive.setHex(on ? 0xfff0c8 : 0x000000)
    this.tailMat.emissive.setHex(on ? 0x701008 : 0x000000)
    this.G.audio?.play('click')
  }

  // Switching the beam on adds a light to every lit shader, and the first
  // time that would stall while they all recompile. So compile those
  // variants ahead, in the background, once the player comes near — and
  // again after a quality change, which rebuilds the shaders anyway.
  warmLights() {
    const G = this.G
    const tier = G.gfx?.tier ?? 'default'
    if (this.warmedFor === tier || this.lights || !G.renderer?.compileAsync) return
    this.warmedFor = tier
    this.headlight.visible = true
    G.renderer.compileAsync(G.scene, G.camera).catch(() => {})
    this.headlight.visible = false
  }

  // ------------------------------------------------------------ per frame
  update(dt, input) {
    const G = this.G
    let throttle = 0
    let steerIn = 0
    let handbrake = !this.occupied
    if (this.occupied) {
      throttle = input.axis('back', 'forward')
      steerIn = input.axis('right', 'left')
      handbrake = input.down('jump')
      const look = input.look()
      G.player.lastLook = look
      this.lookYaw = clamp(this.lookYaw - look.dx, -2.4, 2.4)
      this.lookPitch = clamp(this.lookPitch - look.dy, -0.8, 0.5)
      // the view drifts back to straight ahead once you stop looking around
      if (Math.abs(look.dx) + Math.abs(look.dy) > 1e-5) this.lookIdle = 0
      else if ((this.lookIdle += dt) > 1.5 && this.speed > 3) {
        this.lookYaw = damp(this.lookYaw, 0, 2, dt)
        this.lookPitch = damp(this.lookPitch, 0, 2, dt)
      }
      if (input.pressed('camera')) this.toggleView()
      if (input.pressed('flashlight')) this.setLights(!this.lights)
      if (input.pressed('interact')) this.exit()
    }
    if (this.parked && !this.occupied) {
      // parked: nothing moves but the engine winding down
      const p = G.player.pos
      if (Math.hypot(p.x - this.pos.x, p.z - this.pos.z) < this.tune.lights.warmRange) this.warmLights()
      this.rpm = damp(this.rpm, 0, 3, dt)
      this.engineAudio(0)
      this.updateCommon(dt, 0)
      this.sync()
      return
    }
    this.drive(dt, throttle, steerIn, handbrake)
  }

  drive(dt, throttle, steerIn, handbrake) {
    // a zero-length frame (two rAF callbacks with one timestamp) would divide
    // by zero below and leave the body NaN for good
    if (!(dt > 0)) return
    const G = this.G
    const T = this.tune
    const W = T.wheel
    const isl = G.island
    const ph = G.physics
    const alive = !this.destroyed
    const grounded = this.onGround

    // ---- what we are driving on: a deck (bridge planks, the helipad) rides like road
    let road = clamp(isl.sample(isl.road, this.pos.x, this.pos.z), 0, 1)
    const deck = ph.groundInfo(this.pos.x, this.pos.z, this.pos.y + 0.3)
    if (deck.collider && Math.abs(this.pos.y - deck.y) < 0.3) road = 1
    const offroad = 1 - road
    const cover = clamp(isl.coverAt(this.pos.x, this.pos.z), 0, 1)
    const wading = clamp((isl.waterAt(this.pos.x, this.pos.z) - this.pos.y) / T.wade, 0, 1)
    const top = lerp(T.top.offroad, T.top.road, road) * (1 - cover * offroad * T.coverDrag) * (1 - wading * 0.55)
    this.surface = { road, cover, wading, top }

    // ---- longitudinal: engine, brakes, slope, rolling resistance
    const s = Math.sin(this.yaw)
    const c = Math.cos(this.yaw)
    let vf = this.vel.x * -s + this.vel.z * -c
    let vr = this.vel.x * c + this.vel.z * -s
    if (grounded) {
      if (alive && throttle > 0) {
        if (vf < -0.3) vf = Math.min(0, vf + T.brake * dt)
        else if (vf < top) vf += T.accel * throttle * (1 - 0.65 * (vf / top) ** 2) * dt
      } else if (alive && throttle < 0) {
        if (vf > 0.3) vf = Math.max(0, vf - T.brake * dt)
        else if (vf > -T.top.reverse) vf -= T.reverseAccel * dt
      }
      vf -= 9.8 * Math.sin(this.slope || 0) * dt
      let drag = lerp(T.rolling.offroad, T.rolling.road, road) + cover * offroad * 1.5 + wading * 3
      if (throttle === 0 || !alive) drag += T.coast
      if (handbrake) drag += T.handbrake
      vf -= Math.sign(vf) * Math.min(Math.abs(vf), drag * dt)
      if (vf > top) vf = damp(vf, top, 1.2, dt)
    }

    // ---- steering: a bicycle model, the wheels turn less the faster you go
    const steerMax = T.steer.max / (1 + (vf * vf) / (T.steer.falloff * T.steer.falloff))
    this.steer = damp(this.steer, steerIn * steerMax, T.steer.rate, dt)
    let yawRate = grounded ? (vf * Math.tan(this.steer)) / (2 * W.z) : 0
    if (handbrake && grounded && Math.abs(vf) > 3) yawRate += steerIn * T.handbrakeYaw * clamp(Math.abs(vf) / 10, 0, 1)
    this.yawRate = yawRate
    // ---- tyres: they kill sideways slip and turn most of it back into
    // forward speed (a rolling tyre steers the jeep rather than scrubbing it),
    // the less the more sideways it is going. The locked rear wheels of a
    // handbrake turn hold almost nothing, so the tail steps out.
    if (grounded) {
      const vr0 = vr
      vr *= Math.exp(-(handbrake ? T.grip.handbrake : lerp(T.grip.offroad, T.grip.road, road)) * dt)
      const keep = handbrake ? 0 : (T.grip.redirect * vf * vf) / (vf * vf + vr0 * vr0 + 1e-9)
      vf = Math.sign(vf) * Math.sqrt(vf * vf + (vr0 * vr0 - vr * vr) * keep)
    }
    // The velocity stays in the world; only the body turns. Next frame the
    // turn shows up as sideways slip for the tyres to deal with.
    this.vel.x = -s * vf + c * vr
    this.vel.z = -c * vf - s * vr
    this.yaw += yawRate * dt

    // ---- move, refusing to drive deeper into water than it can ford — but
    // always letting it climb back out, whichever way it is pointing
    const endZ = vf >= 0 ? -T.halfLength : T.halfLength
    const depthBefore = this.endDepth(endZ)
    const px = this.pos.x
    const pz = this.pos.z
    this.pos.x += this.vel.x * dt
    this.pos.z += this.vel.z * dt
    const depthAfter = this.endDepth(endZ)
    if (depthAfter > T.wade && depthAfter > depthBefore) {
      this.pos.x = px
      this.pos.z = pz
      this.vel.x += s * vf
      this.vel.z += c * vf
      vf = 0
      this.stalledInWater = true
      if (this.occupied && G.time > this.wetToastT) {
        this.wetToastT = G.time + 5
        G.toast('Too deep to ford — the engine would drown', 'warn')
      }
    } else this.stalledInWater = false

    this.collideStatics()
    this.collideCreatures()

    // ---- stuck: the driver keeps asking to go and it isn't going anywhere
    if (this.occupied && alive && throttle !== 0 && this.speed < 0.3) {
      this.stuckT += dt
      if (this.stuckT > T.winch.stuckAfter && !this.stuckToast) {
        this.stuckToast = true
        G.toast(T.toasts.stuck, 'warn', 7)
      }
    } else if (this.speed > 1.5) {
      this.stuckT = 0
      this.stuckToast = false
    }

    // ---- ground: four contacts, springs between them and the body
    const maxY = this.pos.y + T.stepUp
    const amp = lerp(T.bump.offroad, T.bump.road, road)
    let sum = 0
    let hF = 0
    let hR = 0
    for (let i = 0; i < 4; i++) {
      const w = this.toWorld(WX[i] * W.x, WZ[i] * W.z)
      const h = ph.groundAt(w.x, w.z, maxY)
      sum += h
      if (WZ[i] < 0) hF += h / 2
      else hR += h / 2
      this.wheelH[i] = h + bumpAt(w.x, w.z) * amp
    }
    const gnd = sum / 4
    this.slope = Math.atan2(hF - hR, 2 * W.z)
    this.vy -= 9.8 * dt
    this.pos.y += this.vy * dt
    const gndRate = (gnd - this.lastGnd) / dt
    if (this.pos.y <= gnd) {
      if (!this.onGround) {
        // measured against the ground's own fall: rolling down a slope is no landing
        const L = T.landing
        const hit = gndRate - this.vy
        if (hit > L.min) this.damage((hit - L.min) * L.k, new THREE.Vector3(this.pos.x, gnd + 0.3, this.pos.z))
        this.liftV += this.vy * 0.35
      }
      this.pos.y = gnd
      // ride the ground's own fall or climb; a crest taken fast throws you
      this.vy = clamp(gndRate, -T.follow.down, T.follow.up)
      this.onGround = true
    } else this.onGround = this.pos.y - gnd < 0.08
    this.lastGnd = gnd

    const h = this.wheelH
    let pitchT = Math.atan2((h[0] + h[1] - h[2] - h[3]) / 2, 2 * W.z)
    let rollT = Math.atan2((h[1] + h[3] - h[0] - h[2]) / 2, 2 * W.x)
    // weight transfer: squat under power, dive under brakes, lean out of turns
    const accel = (vf - this.lastVf) / dt
    this.lastVf = vf
    pitchT += clamp(accel * 0.006, -0.05, 0.05)
    rollT -= clamp(vf * yawRate * 0.006, -0.07, 0.07)
    const S = T.suspension
    const kk = this.onGround ? 1 : 0.15
    this.pitchV += (S.k * kk * (pitchT - this.pitch) - S.c * this.pitchV) * dt
    this.rollV += (S.k * kk * (rollT - this.roll) - S.c * this.rollV) * dt
    this.pitch = clamp(this.pitch + this.pitchV * dt, -0.7, 0.7)
    this.roll = clamp(this.roll + this.rollV * dt, -0.6, 0.6)
    this.liftV += (-S.liftK * this.lift - S.liftC * this.liftV) * dt
    this.lift = clamp(this.lift + this.liftV * dt, -0.15, 0.15)

    this.stabilize(dt)

    // ---- wheels, dust, splashes, the grass parting
    this.spinAngle += (vf / W.r) * dt
    const speed = Math.abs(vf)
    if (this.onGround && speed > 4 && Math.random() < 0.35 * Math.min(1, speed / 12)) {
      const w = this.toWorld(WX[2 + (Math.random() < 0.5 ? 0 : 1)] * W.x, W.z + 0.3)
      if (wading > 0.15) G.fx?.splash({ x: w.x, y: isl.waterAt(w.x, w.z), z: w.z })
      else G.fx?.dust({ x: w.x, y: this.pos.y + 0.2, z: w.z }, 2)
    }
    if (this.occupied) G.veg?.setPush(this.pos.x, this.pos.z, 3.2, Math.min(1.5, 0.4 + speed / 8))

    // ---- engine: a 4-speed box you can hear changing up
    const speedN = clamp(speed / T.top.road, 0, 1)
    const gears = T.gears
    let gi = 0
    while (gi < gears.length - 2 && speedN >= gears[gi + 1]) gi++
    const inGear = (speedN - gears[gi]) / (gears[gi + 1] - gears[gi])
    const running = this.occupied && alive
    let rpmT = running ? 0.16 + 0.84 * (gi === 0 ? inGear * 0.85 : 0.4 + 0.55 * inGear) : 0
    if (running && throttle !== 0 && speed < 1) rpmT = Math.max(rpmT, 0.45)
    this.rpm = damp(this.rpm, rpmT, running ? 7 : 3, dt)
    this.load = damp(this.load, running ? Math.abs(throttle) : 0, 6, dt)
    this.engineAudio(this.load)
    const noise = running ? lerp(T.noise.idle, T.noise.max, clamp(speedN * 0.7 + this.load * 0.3, 0, 1)) : 0
    this.updateCommon(dt, noise)
    this.sync()
    this.placeWheels()
  }

  // Optional active balance for narrower ground vehicles.
  stabilize() {}

  engineAudio(load) {
    if (this.rpm < 0.002 && this.engineQuiet) return
    this.engineQuiet = this.rpm < 0.002
    this.G.audio?.setEngine(this.rpm, load, this.pos, this.inside, this.kind)
  }

  // Trunks, rocks, walls, fences: bounce off, and get hurt by the closing speed.
  collideStatics() {
    const G = this.G
    const T = this.tune
    let nx = 0
    let nz = 0
    let hit = null
    for (const b of T.hitbox) {
      const w = this.toWorld(0, b.z)
      const ox = w.x
      const oz = w.z
      _c.x = ox
      _c.z = oz
      if (!G.physics.collideCircle(_c, b.r, this.pos.y + T.hitY[0], this.pos.y + T.hitY[1], this.ownCollider)) continue
      const dx = _c.x - ox
      const dz = _c.z - oz
      this.pos.x += dx
      this.pos.z += dz
      nx += dx
      nz += dz
      const l = Math.hypot(dx, dz) || 1
      hit = { x: ox - (dx / l) * b.r, z: oz - (dz / l) * b.r }
    }
    const nl = Math.hypot(nx, nz)
    if (nl < 1e-6) return
    nx /= nl
    nz /= nl
    const vn = this.vel.x * nx + this.vel.z * nz
    if (vn >= 0) return
    const I = T.impact
    this.vel.x -= nx * vn * (1 + I.bounce)
    this.vel.z -= nz * vn * (1 + I.bounce)
    if (-vn > I.min) {
      this.vel.x *= I.scrub
      this.vel.z *= I.scrub
      this.damage(Math.min(I.maxHit, (-vn - I.min) * I.k), new THREE.Vector3(hit.x, this.pos.y + 0.9, hit.z))
    }
  }

  // Animals: the jeep is a capsule along its spine.
  collideCreatures() {
    const G = this.G
    const T = this.tune
    const CR = T.creatures
    const spine = T.halfLength - T.halfWidth
    const a = this.toWorld(0, -spine, _a)
    const b = this.toWorld(0, spine, _b)
    for (const cr of G.ecology.active) {
      if (cr.disposed || !cr.vitals.alive) continue
      if (cr.pos.y > this.pos.y + 1.8 || cr.pos.y + cr.sp.body.hipH * cr.scale * 1.5 < this.pos.y + 0.2) continue
      const { d, t } = segDist(cr.pos.x, cr.pos.z, a.x, a.z, b.x, b.z)
      const m = cr.radius + T.halfWidth
      if (d >= m) continue
      const sx = a.x + (b.x - a.x) * t
      const sz = a.z + (b.z - a.z) * t
      let nx = Math.cos(this.yaw)
      let nz = -Math.sin(this.yaw)
      if (d > 1e-4) {
        nx = (cr.pos.x - sx) / d
        nz = (cr.pos.z - sz) / d
      }
      const pen = m - d
      const closing = (this.vel.x - yawDirX(cr.yaw) * cr.speed) * nx + (this.vel.z - yawDirZ(cr.yaw) * cr.speed) * nz
      const contact = new THREE.Vector3(cr.pos.x - nx * cr.radius, cr.pos.y + cr.sp.body.hipH * cr.scale, cr.pos.z - nz * cr.radius)
      const share = cr.sp.mass / (cr.sp.mass + T.mass) // how much of the overlap the jeep gives up
      if (cr.sp.mass < CR.smallMass) {
        cr.pos.x += nx * pen
        cr.pos.z += nz * pen
        if (closing > CR.hitMin && G.time > (cr._jeepHitT || 0)) {
          cr._jeepHitT = G.time + 0.7
          const fling = Math.min(2, closing * 0.1)
          cr.pos.x += nx * fling
          cr.pos.z += nz * fling
          this.vel.x -= nx * closing * share
          this.vel.z -= nz * closing * share
          if (this.occupied) G.shake?.add(SHAKE.bump)
          G.fx?.blood(contact)
          G.audio?.play('fleshHit', { pos: contact })
          // deliberately on the player's account: it scores as a kill
          cr.takeHit(G, { damage: closing * CR.hitK, zone: 'torso', from: this.pos, cause: 'weapon', weapon: this.kind })
        }
      } else {
        this.pos.x -= nx * pen * share
        this.pos.z -= nz * pen * share
        cr.pos.x += nx * pen * (1 - share)
        cr.pos.z += nz * pen * (1 - share)
        if (closing > 0) {
          const dv = closing * (1 + CR.bounce) * share
          this.vel.x -= nx * dv
          this.vel.z -= nz * dv
          if (closing > CR.heavyMin && G.time > (cr._jeepHitT || 0)) {
            cr._jeepHitT = G.time + 0.8
            this.damage(Math.min(T.impact.maxHit, (closing - CR.heavyMin) * CR.heavyK * Math.min(2, cr.sp.mass / 2500)), contact)
            // ramming something that size makes it angry
            if (cr.vitals.conscious) cr.brain.onHurt(G, this.pos, false)
          }
        }
      }
    }
  }

  // ------------------------------------------------------------ drawing
  sync() {
    this.model.position.set(this.pos.x, this.pos.y + this.lift, this.pos.z)
    this.model.rotation.set(this.pitch, this.yaw, this.roll)
    this.driver.visible = this.occupied && this.view === 'chase'
  }

  // Each wheel reaches down (or is pushed up) to its own ground.
  placeWheels() {
    const W = this.tune.wheel
    const sp = Math.sin(this.pitch)
    const sr = Math.sin(this.roll) * Math.cos(this.pitch)
    for (let i = 0; i < 4; i++) {
      const lx = WX[i] * W.x
      const lz = WZ[i] * W.z
      const plane = this.pos.y + this.lift + lx * sr - lz * sp
      const w = this.wheels[i]
      w.position.y = W.r + clamp(this.wheelH[i] - plane, -W.travel, W.travel)
      w.spin.rotation.x = -this.spinAngle
      if (i < 2) w.rotation.y = this.steer
    }
  }

  seatCamera(cam) {
    cam.position.copy(this.modelPoint(this.tune.seat))
    cam.rotation.set(this.pitch * 0.85 + this.lookPitch, this.yaw + this.lookYaw, this.roll * 0.85)
    this.camYaw = this.yaw + this.lookYaw
  }

  chaseCamera(cam, dt) {
    const G = this.G
    const ph = G.physics
    const C = this.tune.chase
    this.camYaw = dampAngle(this.camYaw, this.yaw + this.lookYaw, C.follow, dt)
    const fx = this.pos.x
    const fy = this.pos.y + 1.5
    const fz = this.pos.z
    const dx = -yawDirX(this.camYaw) * C.back
    const dz = -yawDirZ(this.camYaw) * C.back
    const dy = C.up - 1.5 - this.lookPitch * 4
    // Pull in rather than look through a wall, a boulder or a hillside. One
    // ray slips through a window, so cast a fan round the camera spot (the
    // extra ones skip terrain, which the height clamp below handles).
    const L = Math.hypot(dx, dy, dz)
    const rx = Math.cos(this.camYaw)
    const rz = -Math.sin(this.camYaw)
    let t = L
    for (const [side, up] of CAM_FAN) {
      const ex = dx + rx * side
      const ey = dy + up
      const ez = dz + rz * side
      const l = Math.hypot(ex, ey, ez)
      const hit = ph.raycast(fx, fy, fz, ex / l, ey / l, ez / l, l, side || up ? RAY_FAN : RAY_MAIN)
      if (hit) t = Math.min(t, (hit.t / l) * L)
    }
    let k = t < L ? Math.max(1.2, t - 0.35) / L : 1
    // A doorway lets every ray through, so also back the camera out from
    // under any roof the jeep itself isn't under.
    const roofed = (x, y, z) => ph.ceilingAt(x, z, y) < y + 4
    if (!roofed(fx, fy, fz)) while (k * L > 1.2 && roofed(fx + dx * k, fy + dy * k, fz + dz * k)) k = Math.max(1.2 / L, k - 0.5 / L)
    const cx = fx + dx * k
    const cz = fz + dz * k
    const cy = Math.max(fy + dy * k, G.island.heightAt(cx, cz) + 0.7, G.island.waterAt(cx, cz) + 0.4)
    // easing in from a pulled-in spot would pass through the wall for a few
    // frames, so pulling in snaps; following and easing back out stay smooth
    const cur = Math.hypot(cam.position.x - fx, cam.position.y - fy, cam.position.z - fz)
    const f = k < 1 && cur > k * L + 0.05 ? 1 : Math.min(1, dt * 10)
    cam.position.set(lerp(cam.position.x, cx, f), lerp(cam.position.y, cy, f), lerp(cam.position.z, cz, f))
    cam.lookAt(fx + yawDirX(this.camYaw) * C.lookAhead, fy + 0.2, fz + yawDirZ(this.camYaw) * C.lookAhead)
  }

  // Water depth under one end of the jeep (local z), from the ground it would stand on.
  endDepth(lz) {
    const e = this.toWorld(0, lz, _c)
    return this.G.island.waterAt(e.x, e.z) - this.G.physics.groundAt(e.x, e.z, this.pos.y + this.tune.stepUp)
  }
}

// The chase camera's ray fan: offsets (right, up) in metres at the camera spot.
const RAY_MAIN = { ignoreTag: 'tree' }
const RAY_FAN = { ignoreTag: 'tree', terrain: false }
const CAM_FAN = [
  [0, 0],
  [0, 0.6],
  [0, -0.6],
  [0.5, 0],
  [-0.5, 0],
]

// ---------------------------------------------------------------- building

const M4 = new THREE.Matrix4()
const Q4 = new THREE.Quaternion()
const E4 = new THREE.Euler()
const V4 = new THREE.Vector3()
const S4 = new THREE.Vector3(1, 1, 1)
const UP = new THREE.Vector3(0, 1, 0)

// Collects posed geometry per material and merges it: one draw call per
// material for the whole body.
export class Parts {
  constructor() {
    this.buckets = new Map()
  }
  add(mat, geo, x, y, z, rx = 0, ry = 0, rz = 0) {
    M4.compose(V4.set(x, y, z), Q4.setFromEuler(E4.set(rx, ry, rz)), S4)
    return this.addMatrix(mat, geo, M4)
  }
  addMatrix(mat, geo, m) {
    geo.applyMatrix4(m)
    let list = this.buckets.get(mat)
    if (!list) this.buckets.set(mat, (list = []))
    list.push(geo)
  }
  box(mat, w, h, d, x, y, z, rx, ry, rz) {
    this.add(mat, new THREE.BoxGeometry(w, h, d), x, y, z, rx, ry, rz)
  }
  cyl(mat, rTop, rBottom, h, seg, x, y, z, rx, ry, rz) {
    this.add(mat, new THREE.CylinderGeometry(rTop, rBottom, h, seg), x, y, z, rx, ry, rz)
  }
  // a round bar from a to b
  tube(mat, r, a, b) {
    const A = new THREE.Vector3(...a)
    const B = new THREE.Vector3(...b)
    const dir = B.clone().sub(A)
    const len = dir.length()
    Q4.setFromUnitVectors(UP, dir.normalize())
    M4.compose(A.add(B).multiplyScalar(0.5), Q4, S4)
    this.addMatrix(mat, new THREE.CylinderGeometry(r, r, len, 6), M4)
  }
  build(group) {
    for (const [mat, geos] of this.buckets) {
      const mesh = new THREE.Mesh(mergeGeometries(geos, false), mat)
      group.add(mesh)
      for (const g of geos) g.dispose()
    }
    this.buckets.clear()
  }
}

function wheelGeometry(W) {
  const tyre = new THREE.CylinderGeometry(W.r, W.r, W.width, 20, 1).rotateZ(Math.PI / 2)
  const parts = [new THREE.CylinderGeometry(W.r * 0.58, W.r * 0.58, W.width + 0.012, 6).rotateZ(Math.PI / 2), new THREE.CylinderGeometry(0.07, 0.07, W.width + 0.04, 8).rotateZ(Math.PI / 2)]
  // five wheel nuts each side, so you can see it turn
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2
    for (const sx of [-1, 1]) parts.push(new THREE.BoxGeometry(0.03, 0.04, 0.04).translate(sx * (W.width / 2 + 0.01), Math.cos(a) * 0.13, Math.sin(a) * 0.13))
  }
  return { tyre, rim: mergeGeometries(parts, false) }
}

function tyreTexture() {
  const c = document.createElement('canvas')
  c.width = 128
  c.height = 16
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#1b1b1a'
  ctx.fillRect(0, 0, 128, 16)
  ctx.fillStyle = '#353431'
  for (let i = 0; i < 24; i++) {
    const x = (i / 24) * 128
    ctx.fillRect(x, i % 2 ? 1 : 8, 3, 7)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// Stencilled door lettering on transparent canvas.
function doorDecal() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 64
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(224, 218, 196, 0.82)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 26px "Courier New", monospace'
  ctx.fillText('FOUNDATION', 128, 20)
  ctx.font = 'bold 20px "Courier New", monospace'
  ctx.fillText('RANGER 07', 128, 46)
  // wear
  ctx.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 90; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.8})`
    ctx.fillRect(Math.random() * 256, Math.random() * 64, Math.random() * 10, Math.random() * 3)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// ---------------------------------------------------------------- placement

// Anything solid within `margin` of (x, z) at standing height, or water.
function blockedAt(G, x, z, margin, floorY) {
  for (const c of G.physics.nearby(x, z, margin + 3)) {
    if (c.y1 < floorY + 0.6 || c.y0 > floorY + 2.2) continue
    if (c.type === 'cyl') {
      if (Math.hypot(x - c.x, z - c.z) < c.r + margin) return true
    } else {
      const [lx, lz] = G.physics.toLocal(c, x, z)
      if (Math.hypot(Math.max(0, Math.abs(lx) - c.hx), Math.max(0, Math.abs(lz) - c.hz)) < margin) return true
    }
  }
  return G.island.depthAt(x, z) > 0.2
}

// The heading to the nearest road point the jeep could drive straight to.
function roadFacing(G, x, z, floorY) {
  const [r0, r1] = JEEP.spawn.roadRange
  const pts = []
  for (const r of G.island.roads) {
    for (const [px, pz] of r.pts) {
      const d = Math.hypot(px - x, pz - z)
      if (d >= r0 && d <= r1) pts.push([d, px, pz])
    }
  }
  pts.sort((p, q) => p[0] - q[0])
  for (const [d, px, pz] of pts) {
    let clear = true
    for (let k = 3; k < d && clear; k += 1) clear = !blockedAt(G, x + ((px - x) / d) * k, z + ((pz - z) / d) * k, JEEP.halfWidth + 0.6, floorY)
    if (clear) return yawTo(x, z, px, pz)
  }
  return null
}

// Is a jeep-sized rectangle (plus a margin to walk round it) free here?
export function footprintClear(G, x, z, yaw, floorY, tune = JEEP) {
  const hx = tune.halfWidth + 0.3
  const hz = tune.halfLength + 0.3
  const c = Math.cos(yaw)
  const s = Math.sin(yaw)
  for (let lx = -hx; lx <= hx + 1e-6; lx += hx / 2) {
    for (let lz = -hz; lz <= hz + 1e-6; lz += hz / 4) {
      const wx = x + lx * c + lz * s
      const wz = z - lx * s + lz * c
      if (blockedAt(G, wx, wz, 0.1, floorY)) return false
      if (Math.abs(G.island.heightAt(wx, wz) - floorY) > 0.6) return false
    }
  }
  return true
}

// The nearest clear, dry, level patch a jeep fits on within `range` of
// `from`, out from under any roof, facing away from `from`.
export function findWinchSpot(G, from, range, tune = JEEP) {
  for (let r = 4; r <= range; r += 2) {
    const n = Math.max(12, Math.round(r * 1.5))
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2
      const x = from.x + Math.sin(a) * r
      const z = from.z + Math.cos(a) * r
      const y = G.island.heightAt(x, z)
      if (G.island.depthAt(x, z) > 0.05 || G.physics.ceilingAt(x, z, y + 0.5) < y + 3) continue
      const yaw = yawTo(from.x, from.z, x, z)
      if (footprintClear(G, x, z, yaw, y, tune)) return { pos: new THREE.Vector3(x, y, z), yaw }
    }
  }
  return null
}

function findStationSpot(G) {
  const st = G.island.poi.station
  const c = Math.cos(st.yaw)
  const s = Math.sin(st.yaw)
  const tries = JEEP.spawn.candidates.slice()
  // if the designed spots are all taken, spiral out round the building
  for (let r = 12; r <= 26; r += 3.5) for (let i = 0; i < 12; i++) tries.push([Math.cos((i / 12) * Math.PI * 2) * r, Math.sin((i / 12) * Math.PI * 2) * r])
  for (const [lx, lz] of tries) {
    const x = st.x + lx * c + lz * s
    const z = st.z - lx * s + lz * c
    const y = G.island.heightAt(x, z)
    const yaw = roadFacing(G, x, z, y)
    if (yaw === null || !footprintClear(G, x, z, yaw, y)) continue
    return { pos: new THREE.Vector3(x, y, z), yaw }
  }
  const x = st.x - 10 * c
  const z = st.z + 10 * s
  return { pos: new THREE.Vector3(x, G.island.heightAt(x, z), z), yaw: st.yaw }
}
