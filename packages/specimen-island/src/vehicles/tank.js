import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { clamp, damp, lerp, wrapAngle, yawTo } from '../core/mathx.js'
import { rustedPaint, trackTread } from '../world/textures.js'
import { TANK } from '../data/vehicles.js'
import { Jeep, Parts } from './jeep.js'
import { approach, onGrade, skidSteer, trackSpeeds } from './tracks.js'
import { launchAngle, layGun } from './gunnery.js'

// Camp Halvorsen's light tank (data/vehicles.js TANK has every number). It
// shares the jeep's systems — boarding, colliders, the springs, crashes,
// running animals down, the winch and repairs — but drives on two tracks:
// W/S run both, A/D run them against each other, so it pivots on the spot.
// It wades deep, climbs what the jeep can't, puts saplings and palms over
// as it goes (world/vegetation.js fell) and is stopped only by the jungle
// giants and buildings.
//
// The gun is laid by fire control. Where the player looks is the sight line
// (the gunner's sight in the seat view, over the turret in the chase view);
// whatever it rests on, the turret slews toward at its traverse rate and the
// gun elevates to the ballistic solution for that range, within its limits.
// LMB / RT fires a shell (game/shells.js) that flies its arc and goes off as
// a 'shell' blast; the HUD rings where the gun's current lay would land it.
// Every shot is heard across the island and brings the tyrant to look.

const _m = new THREE.Vector3()
const _d = new THREE.Vector3()
const _t = new THREE.Vector3()
const _v = new THREE.Vector3()
const _p = new THREE.Vector3()

// Position-based ripples under the tracks: gentler than the jeep's washboard.
const bumpAt = (x, z) => Math.sin(x * 1.3 + z * 0.5) * Math.sin(z * 1.1 - x * 0.35)

export class Tank extends Jeep {
  // In its bay in the motor pool, nose out to the yard (world/structures.js).
  static atBase(G) {
    const bay = G.island.poi.milbase?.bays?.tank
    if (!bay) return null
    return new Tank(G, bay.pos, bay.yaw)
  }

  constructor(G, pos, yaw) {
    super(G, pos, yaw, TANK)
    const T = this.tune
    this.turretYaw = 0 // relative to the hull, + to the left
    this.elevation = 0 // the gun, off the hull's deck
    this.aimYaw = yaw // the sight line, in the world
    this.aimPitch = 0
    this.sightZoom = 1 // read by the weapon system's field of view
    this.rounds = T.gun.start
    this.reloadT = 0
    this.recoil = 0
    this.beltL = 0
    this.beltR = 0
    this.vf = 0
    this.contactH = new Float32Array(6)
    this.predictT = 0
    this.aimPoint = new THREE.Vector3()
    this.impact = new THREE.Vector3() // where the gun's lay lands a shell
    this.impactOk = false
    this.sync()
  }

  boardLabel() {
    return `Crew the tank · ${this.rounds}/${this.tune.gun.rounds} shells`
  }

  onEnter() {
    const G = this.G
    this.warmLights()
    if (G.sky && G.sky.light < 0.35 && !this.lights) this.setLights(true)
    // the sight comes up wherever the gun was left pointing
    this.aimYaw = wrapAngle(this.yaw + this.turretYaw)
    this.aimPitch = 0
    G.audio?.play('ignition', { pos: this.pos })
    G.toast(
      G.input.lastDevice === 'gamepad'
        ? 'Tank · Left stick: drive / turn on the spot · Right stick: aim the turret · RT: fire · LT: gunner’s sight · A: brake · RS: headlights · LB: camera · Y: exit (stopped)'
        : 'Tank · W/S: drive · A/D: turn on the spot · Mouse: aim the turret · LMB: fire · RMB: gunner’s sight · Space: brake · F: headlights · V: camera · E: exit (stopped)',
      'info',
      9,
    )
  }

  onExit(force) {
    super.onExit(force)
    this.sightZoom = 1
  }

  // The ammo bunker's door fills the ready rack; how many went in.
  rearm() {
    const got = this.tune.gun.rounds - this.rounds
    this.rounds = this.tune.gun.rounds
    return got
  }

  // ------------------------------------------------------------ per frame
  update(dt, input) {
    const G = this.G
    const T = this.tune
    let throttle = 0
    let steer = 0
    let brake = !this.occupied
    if (this.occupied) {
      throttle = input.axis('back', 'forward')
      steer = input.axis('right', 'left')
      brake = input.down('jump')
      // the sight turns with the mouse or stick (finer through the zoom)
      const look = input.look()
      G.player.lastLook = look
      this.aimYaw = wrapAngle(this.aimYaw - look.dx / this.sightZoom)
      this.aimPitch = clamp(this.aimPitch - look.dy / this.sightZoom, -0.5, 0.45)
      const zoom = input.down('aim') ? T.sight[this.view === 'chase' ? 'chase' : 'seat'] : 1
      this.sightZoom = damp(this.sightZoom, zoom, 10, dt)
      if (input.pressed('camera')) this.toggleView()
      if (input.pressed('flashlight')) this.setLights(!this.lights)
      if (input.pressed('fire')) this.fire()
      if (input.pressed('interact')) this.exit()
    }
    if (this.reloadT > 0) {
      this.reloadT -= dt
      if (this.reloadT <= 0 && this.rounds > 0 && this.occupied) G.audio?.play('shellLoad', { pos: this.pos })
    }
    this.recoil = damp(this.recoil, 0, 6, dt)
    // the jeep's chase camera follows these
    this.lookYaw = wrapAngle(this.aimYaw - this.yaw)
    this.lookPitch = this.aimPitch
    if (this.parked && !this.occupied) {
      const p = G.player.pos
      if (Math.hypot(p.x - this.pos.x, p.z - this.pos.z) < T.lights.warmRange) this.warmLights()
      this.rpm = damp(this.rpm, 0, 3, dt)
      this.engineAudio(0)
      this.updateCommon(dt, 0)
      this.sync()
      return
    }
    this.drive(dt, throttle, steer, brake)
    if (this.occupied && !this.destroyed) this.layGun(dt)
  }

  drive(dt, throttle, steer, brake) {
    // a zero-length frame would divide by zero below
    if (!(dt > 0)) return
    const G = this.G
    const T = this.tune
    const isl = G.island
    const ph = G.physics
    const alive = !this.destroyed
    const grounded = this.onGround

    // ---- what it is running on
    let road = clamp(isl.sample(isl.road, this.pos.x, this.pos.z), 0, 1)
    const deck = ph.groundInfo(this.pos.x, this.pos.z, this.pos.y + 0.3)
    if (deck.collider && Math.abs(this.pos.y - deck.y) < 0.3) road = 1
    const offroad = 1 - road
    const cover = clamp(isl.coverAt(this.pos.x, this.pos.z), 0, 1)
    const wading = clamp((isl.waterAt(this.pos.x, this.pos.z) - this.pos.y) / T.wade, 0, 1)
    const top = lerp(T.top.offroad, T.top.road, road) * (1 - cover * offroad * T.coverDrag) * (1 - wading * 0.5)
    this.surface = { road, cover, wading, top }

    // ---- the tracks: the hull heads for the speed and turn asked of it
    const s = Math.sin(this.yaw)
    const c = Math.cos(this.yaw)
    let vf = this.vel.x * -s + this.vel.z * -c
    let vr = this.vel.x * c + this.vel.z * -s
    let yawRate = this.yawRate
    if (grounded) {
      const want = alive && !brake ? skidSteer(throttle, steer, top, T) : { forward: 0, yawRate: 0 }
      // up a grade the engine sets the pace (tracks.js onGrade), and the
      // grade itself is what slows it to that
      const grade = onGrade(this.slope || 0, T)
      let target = want.forward
      const climbing = target * grade.pull > 0
      if (climbing) target = Math.sign(target) * Math.min(Math.abs(target), grade.cap)
      let rate
      if (brake || !alive) rate = T.brake
      else if (Math.abs(vf) > 0.2 && Math.sign(target - vf) !== Math.sign(vf)) rate = climbing ? Math.abs(grade.pull) : throttle === 0 ? T.coast : T.brake // slowing
      else rate = (target >= 0 ? T.accel : T.reverseAccel) * (1 - 0.6 * Math.min(1, (vf / top) ** 2)) // speeding up
      vf = approach(vf, target, rate * dt)
      // the tracks hold it on the hill; too steep, and it slides back down
      vf -= grade.slip * dt
      const drag = lerp(T.rolling.offroad, T.rolling.road, road) + wading * 2
      vf -= Math.sign(vf) * Math.min(Math.abs(vf), drag * dt)
      yawRate = approach(yawRate, want.yawRate, T.turn.rate * dt)
      // tracks hardly slide sideways
      vr *= Math.exp(-lerp(T.grip.offroad, T.grip.road, road) * dt)
    } else yawRate *= Math.exp(-2 * dt)
    this.yawRate = yawRate
    this.vel.x = -s * vf + c * vr
    this.vel.z = -c * vf - s * vr
    this.yaw += yawRate * dt

    // ---- deep water: as the jeep, never deeper than it wades, always back out
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
        G.toast('Too deep to ford — the engine deck would flood', 'warn')
      }
    } else this.stalledInWater = false
    this.vf = vf

    this.fellTrees()
    this.collideStatics()
    this.collideCreatures()

    // ---- stuck: asking to go, going nowhere (the board prompt winches it)
    if (this.occupied && alive && (throttle !== 0 || steer !== 0) && this.speed < 0.3 && Math.abs(this.yawRate) < 0.05) {
      this.stuckT += dt
      if (this.stuckT > T.winch.stuckAfter && !this.stuckToast) {
        this.stuckToast = true
        G.toast(T.toasts.stuck, 'warn', 7)
      }
    } else if (this.speed > 1.5 || Math.abs(this.yawRate) > 0.2) {
      this.stuckT = 0
      this.stuckToast = false
    }

    // ---- ground: three contacts down each track, the hull sprung over them
    const maxY = this.pos.y + T.stepUp
    const amp = lerp(T.bump.offroad, T.bump.road, road)
    const K = T.track.z
    const h = this.contactH
    for (let side = 0; side < 2; side++) {
      for (let k = 0; k < 3; k++) {
        const w = this.toWorld((side ? 1 : -1) * T.track.x, K[k])
        h[side * 3 + k] = ph.groundAt(w.x, w.z, maxY) + bumpAt(w.x, w.z) * amp
      }
    }
    const hl = (h[0] + h[1] + h[2]) / 3
    const hr = (h[3] + h[4] + h[5]) / 3
    const hF = (h[0] + h[3]) / 2
    const hB = (h[2] + h[5]) / 2
    const gnd = (hl + hr) / 2
    const span = K[2] - K[0]
    this.slope = Math.atan2(hF - hB, span)
    this.vy -= 9.8 * dt
    this.pos.y += this.vy * dt
    const gndRate = (gnd - this.lastGnd) / dt
    if (this.pos.y <= gnd) {
      if (!this.onGround) {
        const Ld = T.landing
        const hit = gndRate - this.vy
        if (hit > Ld.min) this.damage((hit - Ld.min) * Ld.k, new THREE.Vector3(this.pos.x, gnd + 0.3, this.pos.z))
        this.liftV += this.vy * 0.25
      }
      this.pos.y = gnd
      this.vy = clamp(gndRate, -T.follow.down, T.follow.up)
      this.onGround = true
    } else this.onGround = this.pos.y - gnd < 0.1
    this.lastGnd = gnd
    let pitchT = Math.atan2(hF - hB, span)
    let rollT = Math.atan2(hr - hl, 2 * T.track.x)
    // it squats under power and noses down under the brakes, a little
    const accel = (vf - this.lastVf) / dt
    this.lastVf = vf
    pitchT += clamp(accel * 0.004, -0.03, 0.03)
    const S = T.suspension
    const kk = this.onGround ? 1 : 0.15
    this.pitchV += (S.k * kk * (pitchT - this.pitch) - S.c * this.pitchV) * dt
    this.rollV += (S.k * kk * (rollT - this.roll) - S.c * this.rollV) * dt
    this.pitch = clamp(this.pitch + this.pitchV * dt, -0.8, 0.8)
    this.roll = clamp(this.roll + this.rollV * dt, -0.6, 0.6)
    this.liftV += (-S.liftK * this.lift - S.liftC * this.liftV) * dt
    this.lift = clamp(this.lift + this.liftV * dt, -0.12, 0.12)

    // ---- tracks and wheels, dust, spray, the undergrowth parting
    const belts = trackSpeeds(vf, yawRate, T.track.x)
    this.beltL += belts.left * dt
    this.beltR += belts.right * dt
    const work = Math.max(Math.abs(belts.left), Math.abs(belts.right))
    if (this.onGround && work > 1.5 && Math.random() < 0.5 * Math.min(1, work / 6)) {
      const side = Math.random() < 0.5 ? -1 : 1
      const w = this.toWorld(side * T.track.x, (vf >= 0 ? 1 : -1) * (T.halfLength - 0.3))
      if (wading > 0.15) G.fx?.splash({ x: w.x, y: isl.waterAt(w.x, w.z), z: w.z })
      else G.fx?.dust({ x: w.x, y: this.pos.y + 0.3, z: w.z }, 3)
    }
    if (this.occupied) G.veg?.setPush(this.pos.x, this.pos.z, 4.5, Math.min(1.8, 0.6 + work / 5))

    // ---- the engine: a big diesel, working hardest when it pivots
    const speedN = clamp(Math.abs(vf) / T.top.road, 0, 1)
    const turning = clamp(Math.abs(yawRate) / T.turn.pivot, 0, 1)
    const running = this.occupied && alive
    const rpmT = running ? 0.18 + 0.62 * Math.max(speedN, turning * 0.7) + (throttle || steer ? 0.12 : 0) : 0
    this.rpm = damp(this.rpm, rpmT, running ? 4 : 2, dt)
    this.load = damp(this.load, running ? Math.max(Math.abs(throttle), Math.abs(steer)) : 0, 5, dt)
    this.engineAudio(this.load)
    const noise = running ? lerp(T.noise.idle, T.noise.max, clamp(speedN * 0.6 + this.load * 0.4, 0, 1)) : 0
    this.updateCommon(dt, noise)
    this.sync()
    this.placeWheels()
  }

  // Saplings, palms and pines in its way go over (world/vegetation.js fell),
  // each one costing it a little way; a jungle giant's trunk is too thick
  // and stops it like a wall (collideStatics).
  fellTrees() {
    const G = this.G
    const T = this.tune
    const sp = this.speed
    if (!G.veg?.fell || sp < 0.4) return
    const dx = this.vel.x / sp
    const dz = this.vel.z / sp
    for (const b of T.hitbox) {
      const w = this.toWorld(0, b.z)
      const wx = w.x
      const wz = w.z
      for (const c of [...G.physics.nearby(wx, wz, b.r + 1.5)]) {
        if (c.type !== 'cyl' || c.tag !== 'tree' || !c.ref || c.r > T.fell.trunk) continue
        if (Math.hypot(c.x - wx, c.z - wz) > b.r + c.r + 0.3) continue
        G.physics.remove(c)
        G.veg.fell(c.ref, dx, dz)
        this.vel.x *= 1 - T.fell.drag
        this.vel.z *= 1 - T.fell.drag
        _p.set(c.x, this.pos.y + 0.6, c.z)
        G.fx?.dust(_p, 8)
        G.audio?.play('timber', { pos: _p })
        G.events.emit('noise', { x: c.x, y: _p.y, z: c.z, radius: 45, source: 'player', kind: 'impact' })
      }
    }
  }

  // ------------------------------------------------------------ the gun
  muzzle(out) {
    return this.tip.getWorldPosition(out)
  }
  barrelDir(out) {
    return out.set(0, 0, -1).transformDirection(this.gun.matrixWorld)
  }

  // Lay the gun on whatever the sight line rests on: the turret toward it,
  // the gun up to the arc that reaches it. Each frame corrects by how far the
  // barrel is off in the world, so a hull pitched or rolled on a slope is
  // allowed for.
  layGun(dt) {
    const G = this.G
    const T = this.tune.gun
    const cam = G.camera
    cam.getWorldDirection(_d)
    const o = cam.position
    let t = T.range
    const hw = G.physics.raycast(o.x, o.y, o.z, _d.x, _d.y, _d.z, T.range)
    if (hw) t = hw.t
    const hc = G.ecology.raycast(o, _d, t)
    if (hc) t = hc.t
    this.aimPoint.copy(o).addScaledVector(_d, t)
    this.model.updateMatrixWorld(true)
    const pivot = this.gun.getWorldPosition(_t)
    const dir = this.barrelDir(_v)
    const dist = Math.hypot(this.aimPoint.x - pivot.x, this.aimPoint.z - pivot.z)
    let wantYaw = this.turretYaw
    let wantElev = this.elevation
    if (dist > 4) {
      const angle = launchAngle(dist, this.aimPoint.y - pivot.y, T.muzzle, T.gravity) ?? Math.PI / 4
      const nowYaw = Math.atan2(-dir.x, -dir.z)
      const nowPitch = Math.asin(clamp(dir.y, -1, 1))
      wantYaw = this.turretYaw + wrapAngle(yawTo(pivot.x, pivot.z, this.aimPoint.x, this.aimPoint.z) - nowYaw)
      wantElev = this.elevation + (angle - nowPitch)
    }
    const lay = layGun(this.turretYaw, this.elevation, wantYaw, wantElev, dt, T)
    this.turretYaw = lay.yaw
    this.elevation = lay.elev
    this.placeTurret()
    this.predictT -= dt
    if (this.predictT <= 0) {
      this.predictT = 0.1
      this.predictImpact()
    }
  }

  // Where a shell fired now would come down: its arc stepped out against
  // animals, anything solid, the ground and the water. The HUD rings it.
  predictImpact() {
    const G = this.G
    const T = this.tune.gun
    this.model.updateMatrixWorld(true)
    const p = this.muzzle(_m)
    const v = this.barrelDir(_v).multiplyScalar(T.muzzle).add(this.vel)
    const step = 0.06
    for (let t = 0; t < T.life; t += step) {
      _d.copy(v).multiplyScalar(step)
      const len = _d.length()
      _d.divideScalar(len)
      const hit = G.physics.raycast(p.x, p.y, p.z, _d.x, _d.y, _d.z, len)
      const hc = G.ecology.raycast(p, _d, hit ? hit.t : len)
      if (hit || hc) {
        this.impact.copy(p).addScaledVector(_d, hc ? hc.t : hit.t)
        this.impactOk = true
        return
      }
      if (p.y < G.island.waterAt(p.x, p.z)) {
        this.impact.copy(p)
        this.impactOk = true
        return
      }
      p.addScaledVector(_d, len)
      v.y -= T.gravity * step
    }
    this.impactOk = false
  }

  fire() {
    const G = this.G
    const T = this.tune.gun
    if (this.destroyed || this.reloadT > 0) return
    if (this.rounds <= 0) {
      G.audio?.play('empty')
      G.toast(this.tune.toasts.empty, 'warn')
      return
    }
    this.rounds--
    this.reloadT = T.reload
    this.recoil = 1
    this.model.updateMatrixWorld(true)
    const m = this.muzzle(new THREE.Vector3())
    const dir = this.barrelDir(new THREE.Vector3())
    G.shells?.fire({ from: m, vel: dir.clone().multiplyScalar(T.muzzle).add(this.vel), gravity: T.gravity, life: T.life, blast: T.blast, weapon: T.weapon, exclude: this })
    // the muzzle: a flash, a ball of smoke, the ground round the hull
    // blown up into dust by the blast wave
    const fx = G.fx
    if (fx) {
      fx.muzzle(m, true)
      fx.flashLight.intensity = 260
      fx.burst(fx.add, m, 14, 3, 1.5, 0.16, 1.2, [1, 0.72, 0.32], 0, 3)
      fx.burst(fx.normal, m.addScaledVector(dir, 1.5), 22, 5, 2.2, 2.6, 1.1, [0.62, 0.6, 0.56], -0.25, 1.8)
      for (let i = 0; i < 10; i++) {
        const a = (i / 10) * Math.PI * 2
        fx.dust({ x: this.pos.x + Math.cos(a) * 4.5, y: this.pos.y + 0.3, z: this.pos.z + Math.sin(a) * 4.5 }, 2)
      }
    }
    G.audio?.play('tankGun', { pos: m })
    G.shake?.add(T.shake)
    G.events.emit('noise', { x: m.x, y: m.y, z: m.z, radius: T.noise, source: 'player', kind: 'gunshot' })
    G.events.emit('weapon:fired', { weapon: T.weapon })
    // the recoil rocks the hull back on its suspension, away from the gun
    this.pitchV += T.kick * Math.cos(this.turretYaw)
    this.rollV -= T.kick * 0.6 * Math.sin(this.turretYaw)
  }

  // ------------------------------------------------------------ drawing
  sync() {
    super.sync()
    this.placeTurret()
  }

  placeTurret() {
    if (!this.turret) return
    this.turret.rotation.y = this.turretYaw || 0
    this.gun.rotation.x = this.elevation || 0
    this.tube.position.z = (this.recoil || 0) * this.tune.gun.recoil
  }

  // Road wheels turn with their track; the treads scroll round the loop.
  placeWheels() {
    if (!this.roadWheels) return
    const L = this.beltL || 0
    const R = this.beltR || 0
    for (const w of this.roadWheels) w.rotation.x = -(w.userData.side < 0 ? L : R) / w.userData.r
    this.treadL.offset.x = -L / this.linkLen
    this.treadR.offset.x = -R / this.linkLen
  }

  // The gunner's sight: on the turret roof, looking down the sight line
  // (stabilised — it does not roll with the hull).
  seatCamera(cam) {
    this.model.updateMatrixWorld(true)
    this.sight.getWorldPosition(cam.position)
    cam.rotation.set(this.aimPitch, this.aimYaw, 0)
    this.camYaw = this.aimYaw
  }

  // The jeep's chase camera, swung round to the sight line and looking down
  // it, so the middle of the screen is what the gun lays on.
  chaseCamera(cam, dt) {
    super.chaseCamera(cam, dt)
    cam.rotation.set(this.aimPitch, this.camYaw, 0)
  }

  // ------------------------------------------------------------ model
  buildModel() {
    const T = this.tune
    const L = (o) => new THREE.MeshLambertMaterial(o)
    const M = {
      paint: L({ map: rustedPaint(T.paint) }),
      dark: L({ color: 0x2c2d26 }),
      black: L({ color: 0x181816 }),
      steel: L({ color: 0x4b4c45 }),
      wheel: L({ color: 0x45483a }),
      rubber: L({ color: 0x1c1c1a }),
      tarp: L({ color: 0x5f5d40 }),
      wood: L({ color: 0x6a5238 }),
      moss: L({ color: 0x4a6a2c, side: THREE.DoubleSide }),
      vine: L({ color: 0x3a6526, side: THREE.DoubleSide }),
      skin: L({ color: 0xc69872 }),
      shirt: L({ color: 0x5f6446 }),
    }
    this.lensMat = L({ color: 0xf0ead6, emissive: 0x000000 })
    this.tailMat = L({ color: 0x6a1008, emissive: 0x000000 })
    const g = new THREE.Group()
    g.rotation.order = 'YXZ'
    const P = new Parts()
    const tx = T.track.x

    // ---- hull: the belly between the tracks, the superstructure over them,
    // a sloped glacis and nose plate, the engine deck behind the turret
    P.box(M.paint, 2.2, 0.75, 6.5, 0, 0.72, 0.1)
    P.box(M.paint, 3.36, 0.7, 5.6, 0, 1.45, 0.55)
    P.box(M.paint, 3.3, 0.12, 1.51, 0, 1.375, -2.875, -0.6)
    P.box(M.paint, 2.3, 0.65, 0.1, 0, 0.66, -3.35, -0.48)
    P.box(M.paint, 3.3, 0.9, 0.1, 0, 1.25, 3.37)
    for (let i = 0; i < 7; i++) P.box(M.black, 0.1, 0.04, 1.5, -0.9 + i * 0.3, 1.815, 2.45)
    for (const s of [-1, 1]) P.box(M.black, 0.5, 0.3, 0.32, s * 1.1, 1.62, 3.45)
    // headlamps in their guards, tow hooks, the driver's hatch and periscopes
    for (const s of [-1, 1]) {
      P.add(this.lensMat, new THREE.CylinderGeometry(0.1, 0.1, 0.08, 12), s * 1.3, 1.62, -2.42, Math.PI / 2, 0, 0)
      P.box(M.steel, 0.3, 0.04, 0.04, s * 1.3, 1.78, -2.5)
      P.box(M.steel, 0.04, 0.2, 0.04, s * 1.3 + 0.15, 1.68, -2.5)
      P.box(M.steel, 0.04, 0.2, 0.04, s * 1.3 - 0.15, 1.68, -2.5)
      P.add(this.tailMat, new THREE.BoxGeometry(0.14, 0.1, 0.03), s * 1.4, 1.62, 3.43)
      P.box(M.black, 0.16, 0.16, 0.3, s * 0.8, 0.55, -3.45)
      P.box(M.black, 0.16, 0.16, 0.3, s * 0.8, 0.85, 3.45)
    }
    P.cyl(M.paint, 0.36, 0.36, 0.1, 14, -0.75, 1.84, -2.0)
    P.box(M.paint, 0.66, 0.06, 0.66, -0.75, 2.05, -1.62, 1.1)
    for (const x of [-1.0, -0.75, -0.5]) P.box(M.black, 0.16, 0.1, 0.12, x, 1.86, -2.38)
    // spare track links on the glacis, tools and tow cable on the fenders,
    // jerrycans and a rolled tarp at the back
    for (let i = 0; i < 4; i++) P.box(M.dark, 0.56, 0.06, 0.16, 0.8, 1.42 - i * 0.1, -2.62 - i * 0.14, -0.6)
    P.box(M.wood, 0.06, 0.06, 1.4, -1.5, 1.14, -0.6)
    P.box(M.steel, 0.24, 0.03, 0.3, -1.5, 1.14, -1.4)
    for (const z of [-1.2, 0.2, 1.6]) P.add(M.steel, new THREE.TorusGeometry(0.22, 0.03, 4, 12), 1.5, 1.14, z, Math.PI / 2, 0, 0)
    for (const x of [-0.6, -0.3]) P.box(M.paint, 0.22, 0.46, 0.14, x, 1.88, 3.3)
    P.cyl(M.tarp, 0.22, 0.22, 2.0, 10, 0.6, 2.0, 3.0, 0, 0, Math.PI / 2)
    // moss in the corners of the deck
    for (const [x, z, r] of [[1.2, 2.9, 0.35], [-1.3, 0.9, 0.25], [0.9, -2.0, 0.22]]) P.add(M.moss, new THREE.CircleGeometry(r, 7), x, 1.805, z, -Math.PI / 2, 0, 0)

    // ---- fenders and armoured skirts over the tracks, one plate lost and
    // one hanging off its bolts; vines have taken the left side
    for (const s of [-1, 1]) {
      P.box(M.paint, 0.68, 0.05, 7.0, s * tx, 1.08, 0)
      for (let i = 0; i < 6; i++) {
        const z = -2.95 + i * 1.18
        if (s < 0 && i === 3) continue
        const askew = s > 0 && i === 1
        P.box(M.paint, 0.05, 0.52, 1.14, s * (tx + 0.33), askew ? 0.74 : 0.82, z, 0, 0, askew ? s * 0.25 : 0)
      }
    }
    for (let i = 0; i < 7; i++) {
      const len = 0.4 + ((i * 37) % 5) * 0.12
      P.add(M.vine, new THREE.PlaneGeometry(0.28, len).translate(0, -len / 2, 0), -(tx + 0.37), 1.08, -2.6 + i * 0.75, 0, Math.PI / 2, 0)
    }
    P.build(g)

    // ---- tracks: a tread ribbon round each, the road wheels, idler and
    // sprocket turning with it, return rollers along the top
    const ribbon = trackRibbon(T)
    this.linkLen = ribbon.linkLen
    this.treadL = trackTread().clone()
    this.treadR = trackTread().clone()
    this.treadL.needsUpdate = this.treadR.needsUpdate = true
    for (const [s, map] of [[-1, this.treadL], [1, this.treadR]]) {
      const mesh = new THREE.Mesh(ribbon.geo, L({ map, side: THREE.DoubleSide }))
      mesh.position.x = s * tx
      g.add(mesh)
    }
    const wheelGeo = (r, w, spokes) => {
      const parts = [new THREE.CylinderGeometry(r * 0.62, r * 0.62, w + 0.02, 10).rotateZ(Math.PI / 2)]
      for (let i = 0; i < spokes; i++) {
        const a = (i / spokes) * Math.PI * 2
        parts.push(new THREE.BoxGeometry(w + 0.04, 0.06, 0.06).translate(0, Math.cos(a) * r * 0.36, Math.sin(a) * r * 0.36))
      }
      return { tyre: new THREE.CylinderGeometry(r, r, w, 16).rotateZ(Math.PI / 2), hub: mergeGeometries(parts) }
    }
    const road = wheelGeo(0.36, 0.46, 5)
    const idler = wheelGeo(0.3, 0.4, 6)
    const sprocket = { tyre: new THREE.CylinderGeometry(0.33, 0.33, 0.36, 12).rotateZ(Math.PI / 2), hub: mergeGeometries([new THREE.CylinderGeometry(0.2, 0.2, 0.42, 8).rotateZ(Math.PI / 2), ...[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => new THREE.BoxGeometry(0.34, 0.1, 0.08).translate(0, Math.cos((i / 10) * Math.PI * 2) * 0.36, Math.sin((i / 10) * Math.PI * 2) * 0.36))]) }
    this.roadWheels = []
    const addWheel = (geo, mat, s, y, z, r) => {
      const w = new THREE.Group()
      w.add(new THREE.Mesh(geo.tyre, mat), new THREE.Mesh(geo.hub, M.wheel))
      w.position.set(s * tx, y, z)
      w.userData = { side: s, r }
      g.add(w)
      this.roadWheels.push(w)
    }
    for (const s of [-1, 1]) {
      for (const z of [-2.2, -1.32, -0.44, 0.44, 1.32, 2.2]) addWheel(road, M.rubber, s, 0.39, z, 0.36)
      addWheel(idler, M.steel, s, 0.56, -3.28, 0.3)
      addWheel(sprocket, M.dark, s, 0.55, 3.2, 0.33)
    }
    const R = new Parts()
    for (const s of [-1, 1]) for (const z of [-1.4, 0, 1.4]) R.cyl(M.steel, 0.1, 0.1, 0.3, 8, s * tx, 0.86, z, 0, 0, Math.PI / 2)
    R.build(g)

    // ---- turret: a low cast shape with sloped cheeks, the bustle behind,
    // the commander's cupola (hatch open), the gunner's sight, smoke
    // dischargers and a whip aerial
    this.turret = new THREE.Group()
    this.turret.position.set(0, 1.8, 0.4)
    const tp = new Parts()
    tp.box(M.paint, 2.5, 0.6, 2.4, 0, 0.3, 0.45)
    for (const s of [-1, 1]) tp.box(M.paint, 1.3, 0.56, 1.25, s * 0.62, 0.3, -1.05, 0, s * -0.38, 0)
    tp.box(M.paint, 2.3, 0.08, 2.2, 0, 0.63, 0.25)
    tp.box(M.paint, 2.2, 0.5, 0.9, 0, 0.32, 2.05)
    tp.box(M.dark, 2.3, 0.04, 1.0, 0, 0.58, 2.05)
    tp.box(M.tarp, 1.6, 0.3, 0.7, 0.1, 0.78, 2.05)
    tp.cyl(M.paint, 0.38, 0.4, 0.3, 14, 0.55, 0.8, 0.45)
    tp.box(M.paint, 0.62, 0.06, 0.62, 0.55, 1.18, 0.95, -1.2)
    tp.box(M.dark, 0.32, 0.26, 0.4, -0.6, 0.78, -0.45)
    tp.box(M.black, 0.26, 0.12, 0.03, -0.6, 0.82, -0.66)
    for (const s of [-1, 1]) for (let i = 0; i < 3; i++) tp.cyl(M.dark, 0.05, 0.05, 0.28, 6, s * (1.05 + i * 0.09), 0.5, -0.6 - i * 0.04, -0.5, 0, 0)
    tp.tube(M.black, 0.012, [-0.9, 0.62, 1.6], [-0.95, 3.4, 1.75])
    tp.add(M.moss, new THREE.CircleGeometry(0.3, 7), -0.4, 0.675, 1.0, -Math.PI / 2, 0, 0)
    tp.build(this.turret)
    g.add(this.turret)
    // stencilled numbers on the turret sides
    const decal = new THREE.MeshLambertMaterial({ map: turretDecal(), transparent: true, depthWrite: false })
    for (const s of [-1, 1]) {
      const d = new THREE.Mesh(new THREE.PlaneGeometry(1.0, 0.32), decal)
      d.position.set(s * 1.256, 0.32, 0.6)
      d.rotation.y = s * Math.PI / 2
      this.turret.add(d)
    }
    // the gun: mantlet on the trunnions, the barrel in its own group so it
    // can recoil, a fume extractor and muzzle brake, a coax beside it
    this.gun = new THREE.Group()
    this.gun.position.set(0, 0.35, -1.5)
    const gp = new Parts()
    gp.box(M.paint, 0.95, 0.55, 0.5, 0, 0, -0.05)
    gp.cyl(M.dark, 0.03, 0.03, 0.5, 6, 0.32, -0.05, -0.4, Math.PI / 2, 0, 0)
    gp.build(this.gun)
    this.tube = new THREE.Group()
    const bp = new Parts()
    bp.cyl(M.paint, 0.085, 0.11, 4.8, 12, 0, 0, -2.7, Math.PI / 2, 0, 0)
    bp.cyl(M.paint, 0.135, 0.135, 0.6, 12, 0, 0, -2.6, Math.PI / 2, 0, 0)
    bp.box(M.dark, 0.32, 0.2, 0.42, 0, 0, -5.15)
    bp.build(this.tube)
    this.tip = new THREE.Object3D()
    this.tip.position.z = -5.4
    this.tube.add(this.tip)
    this.gun.add(this.tube)
    this.turret.add(this.gun)
    this.sight = new THREE.Object3D()
    this.sight.position.set(-0.6, 1.1, -0.5)
    this.turret.add(this.sight)

    // the commander up in the cupola, seen from the chase camera
    const D = new Parts()
    D.box(M.shirt, 0.42, 0.42, 0.28, 0, 1.12, 0)
    D.add(M.skin, new THREE.SphereGeometry(0.11, 10, 8), 0, 1.45, -0.02)
    D.cyl(M.dark, 0.14, 0.14, 0.1, 10, 0, 1.55, -0.02)
    for (const x of [-0.2, 0.2]) D.tube(M.shirt, 0.05, [x, 1.25, 0], [x * 1.3, 1.0, -0.3])
    this.driver = new THREE.Group()
    this.driver.position.set(0.55, 0, 0.45)
    D.build(this.driver)
    this.driver.visible = false
    this.turret.add(this.driver)

    // one beam from between the hull lamps, in the scene only while it is on
    const Lt = T.lights
    const beam = new THREE.SpotLight(0xfff0d0, Lt.intensity, Lt.range, Lt.angle, Lt.penumbra, Lt.decay)
    beam.position.set(0, 1.62, -2.6)
    beam.target.position.set(0, 0, -24)
    beam.visible = false
    g.add(beam, beam.target)
    this.headlight = beam
    this.wheels = []

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

// One track's tread: a ribbon round the loop in the hull's (z, y) plane,
// front at -z — under the road wheels, up round the sprocket at the back,
// forward along the return rollers, down round the idler. Its u runs round
// the loop a whole number of links, so the tread texture scrolls seamlessly.
function trackRibbon(T) {
  const loop = [[-2.75, 0.04], [-1.4, 0.03], [0, 0.03], [1.4, 0.03], [2.75, 0.04], [3.3, 0.22], [3.55, 0.55], [3.3, 0.86], [2.0, 0.97], [0, 0.99], [-2.0, 0.97], [-3.32, 0.84], [-3.6, 0.56], [-3.32, 0.24]]
  const curve = new THREE.CatmullRomCurve3(loop.map(([z, y]) => new THREE.Vector3(0, y, z)), true, 'centripetal')
  const N = 200
  const pts = curve.getSpacedPoints(N)
  const links = Math.round(curve.getLength() / T.track.pitch)
  const w = T.track.width / 2
  const pos = []
  const nrm = []
  const uv = []
  const idx = []
  for (let i = 0; i <= N; i++) {
    const p = pts[i]
    const tg = curve.getTangentAt((i % N) / N)
    // outward: square to the tangent, away from the middle of the loop
    let ny = -tg.z
    let nz = tg.y
    if (ny * (p.y - 0.5) + nz * p.z < 0) {
      ny = -ny
      nz = -nz
    }
    for (const x of [-w, w]) {
      pos.push(x, p.y, p.z)
      nrm.push(0, ny, nz)
      uv.push((i / N) * links, x < 0 ? 0 : 1)
    }
  }
  for (let i = 0; i < N; i++) {
    const a = i * 2
    idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3)
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3))
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
  geo.setIndex(idx)
  return { geo, linkLen: curve.getLength() / links }
}

// "FSD 07" in worn white stencil, for the turret sides.
function turretDecal() {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 80
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(222, 218, 196, 0.8)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 54px "Courier New", monospace'
  ctx.fillText('FSD 07', 128, 42)
  ctx.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 120; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.9})`
    ctx.fillRect(Math.random() * 256, Math.random() * 80, Math.random() * 12, Math.random() * 4)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
