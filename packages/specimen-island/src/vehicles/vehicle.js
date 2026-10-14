import * as THREE from 'three'
import { clamp, lerp } from '../core/mathx.js'
import { VEHICLE_FX } from '../data/vehicles.js'

// What every ride on the island shares: getting in and out, the parked
// colliders, the board prompt, seat / chase cameras, noise for the AI, and
// damage that you can actually feel — crunch, shake, sparks, a flashing hull
// readout, smoke, warning beeps.
//
// While someone is aboard, `G.vehicle` is this vehicle and the player's body
// rides along (player.pos follows the seat), so anything that targets "the
// player" — a charging trike, a stalking raptor — targets the vehicle. On
// exit the player is set down on clear, walkable ground beside it.
//
// Subclasses provide buildModel(), update(dt, input), boardLabel(), and may
// override canBoard(), canExit(), seatCamera(), chaseCamera(), onEnter(),
// onExit(), onDestroyed().

const _door = new THREE.Vector3()
const _w = { x: 0, z: 0 }
const _probe = { x: 0, z: 0 }
const _v = new THREE.Vector3()

export class Vehicle {
  constructor(G, tune, pos, yaw) {
    this.G = G
    this.tune = tune
    this.kind = tune.kind
    this.hudName = tune.hudName
    this.pos = pos.clone()
    this.vel = new THREE.Vector3()
    this.yaw = yaw
    this.pitch = 0
    this.roll = 0
    this.health = tune.hull
    this.occupied = false
    this.onGround = true
    this.seatView = tune.seatView
    this.view = 'chase'
    this.camYaw = yaw // yaw of the camera actually in use (compass, audio)
    this.lookYaw = 0
    this.lookPitch = 0
    this.visibility = tune.visibility
    this.shake = 0
    this.flash = 0
    this.noiseT = 0
    this.smokeT = 0
    this.warnT = 0
    this.colliders = []
    this.ownCollider = (c) => c.ref !== this
    // dying inside a vehicle throws you clear of it
    G.events.on('player:died', () => {
      if (this.occupied) this.exit(true)
    })
  }

  // old name, still read by code that predates the jeep
  get piloted() {
    return this.occupied
  }
  get destroyed() {
    return this.health <= 0
  }
  get speed() {
    return Math.hypot(this.vel.x, this.vel.z)
  }

  // Local (x, z) -> world, by yaw only — the same frame as Kit and physics boxes.
  toWorld(lx, lz, out = _w) {
    const c = Math.cos(this.yaw)
    const s = Math.sin(this.yaw)
    out.x = this.pos.x + lx * c + lz * s
    out.z = this.pos.z - lx * s + lz * c
    return out
  }

  // A point on the model (local x, y, z, with pitch and roll) in world space.
  modelPoint(p, out = _v) {
    this.model.updateMatrixWorld()
    return out.set(p[0], p[1], p[2]).applyMatrix4(this.model.matrixWorld)
  }

  // ------------------------------------------------------------ colliders
  park() {
    this.unpark()
    const ph = this.G.physics
    for (const b of this.tune.parked) {
      const w = this.toWorld(b.x, b.z)
      this.colliders.push(ph.addBox(w.x, w.z, b.hx, b.hz, this.yaw, this.pos.y + b.y0, this.pos.y + b.y1, { walkable: false, tag: 'vehicle', ref: this }))
    }
  }
  unpark() {
    for (const c of this.colliders) this.G.physics.remove(c)
    this.colliders.length = 0
  }
  get parked() {
    return this.colliders.length > 0
  }

  // ------------------------------------------------------------ boarding
  // One prompt that sits at whichever door you are standing nearest. When the
  // vehicle is wrecked the same prompt becomes a field repair.
  registerBoard(id) {
    const G = this.G
    const d = this.tune.door
    const it = G.interact.add({
      id,
      radius: d.radius,
      dynamic: () => {
        const p = G.player.pos
        const side = (p.x - this.pos.x) * Math.cos(this.yaw) - (p.z - this.pos.z) * Math.sin(this.yaw) >= 0 ? 1 : -1
        const w = this.toWorld(side * d.x, d.z)
        return _door.set(w.x, this.pos.y + d.y, w.z)
      },
      label: () => (this.destroyed ? `Field repair — patch the ${this.tune.name} up enough to limp home` : this.boardLabel()),
      enabled: () => (this.occupied ? 'In use' : this.destroyed ? true : this.canBoard()),
      onUse: () => (this.destroyed ? this.fieldRepair() : this.enter()),
    })
    // a wrecked vehicle wants a long hold, a working one a tap
    Object.defineProperty(it, 'hold', { get: () => (this.destroyed ? VEHICLE_FX.fieldRepair.hold : 0), enumerable: true, configurable: true })
    this.board = it
  }
  boardLabel() {
    return `Board ${this.tune.name}`
  }
  canBoard() {
    return true
  }

  enter() {
    const G = this.G
    if (G.vehicle || this.occupied || !G.player.alive) return
    this.occupied = true
    G.vehicle = this
    this.unpark()
    this.camYaw = this.yaw
    this.lookYaw = 0
    this.lookPitch = 0
    const p = G.player
    p.vel.set(0, 0, 0)
    p.crouching = false
    p.flashlight = false // player.update() is what dims it, and it won't run
    if (p.light) p.light.intensity = 0
    this.ridePlayer(0)
    G.events.emit('vehicle:enter', { vehicle: this })
    G.events.emit(this.kind + ':enter', {})
    this.onEnter()
  }
  onEnter() {}

  canExit() {
    return this.onGround && Math.hypot(this.vel.x, this.vel.y, this.vel.z) < this.tune.exitSpeed
  }

  // `force` (death, scripted) skips the speed check.
  exit(force = false) {
    const G = this.G
    if (!this.occupied) return false
    if (!force && !this.canExit()) {
      G.toast(this.tune.exitBlocked, 'warn')
      return false
    }
    this.occupied = false
    if (G.vehicle === this) G.vehicle = null
    // settle it first, so its own colliders keep the exit spot honest
    if (this.onGround && this.speed < this.tune.exitSpeed + 0.5) {
      this.vel.set(0, 0, 0)
      this.park()
    }
    const spot = this.findExitSpot()
    G.player.teleport(spot, this.camYaw)
    G.player.pitch = 0
    G.events.emit('vehicle:exit', { vehicle: this })
    G.events.emit(this.kind + ':exit', {})
    this.onExit()
    return true
  }
  onExit() {}

  // Clear, walkable ground beside the vehicle: the door sides first, then a
  // widening ring. The vehicle's own parked colliders are already in place,
  // so a spot "inside" it is never clear.
  findExitSpot() {
    const G = this.G
    const refY = this.pos.y
    const tries = this.tune.exits.slice()
    const R = Math.max(this.tune.halfLength || 2, 2) + 1
    for (const k of [1, 1.5, 2.2]) for (let i = 0; i < 12; i++) tries.push([Math.sin((i / 12) * Math.PI * 2) * R * k * 0.8, Math.cos((i / 12) * Math.PI * 2) * R * k])
    for (const [lx, lz] of tries) {
      const w = this.toWorld(lx, lz)
      const g = this.standable(w.x, w.z, refY)
      if (g !== null) return new THREE.Vector3(w.x, g, w.z)
    }
    // nowhere clear (wedged in a ravine?): the first door, on the terrain
    const w = this.toWorld(this.tune.exits[0][0], this.tune.exits[0][1])
    return new THREE.Vector3(w.x, G.physics.groundAt(w.x, w.z, G.island.heightAt(w.x, w.z) + 1), w.z)
  }

  standable(x, z, refY) {
    const G = this.G
    const ph = G.physics
    const g = ph.groundAt(x, z, Math.max(refY, G.island.heightAt(x, z)) + 1.2)
    if (Math.abs(g - refY) > 1.6) return null
    if (G.island.waterAt(x, z) - g > 0.9) return null
    if (ph.ceilingAt(x, z, g + 0.1) < g + 1.9) return null
    _probe.x = x
    _probe.z = z
    if (ph.collideCircle(_probe, VEHICLE_FX.exitClearance, g + 0.4, g + 1.8)) return null
    return g
  }

  // The player's body rides in the seat.
  ridePlayer(dt) {
    const p = this.G.player
    const s = this.tune.seat
    const w = this.toWorld(s[0], s[2])
    p.pos.set(w.x, this.pos.y + s[1] - 1.6, w.z)
    p.eye.set(w.x, this.pos.y + s[1], w.z)
    p.vel.set(0, 0, 0)
    p.yaw = this.camYaw
    // timers player.update() would otherwise run down
    p.blindT = Math.max(0, p.blindT - dt)
    p.fade = Math.max(0, p.fade - dt)
    p.shake = Math.max(0, p.shake - dt * 2)
  }

  // ------------------------------------------------------------ damage
  // Every hit is loud, shaky, sparky and on the HUD. `at` is the contact point.
  damage(amount, at = null) {
    const G = this.G
    const F = VEHICLE_FX
    if (!(amount > 0)) return
    const before = this.health
    this.health = Math.max(0, this.health - amount)
    this.shake = Math.min(F.shakeMax, this.shake + amount * F.shakePerHp)
    this.flash = F.flashTime
    if (this.occupied && G.hud) G.hud.vignette = Math.min(1, (G.hud.vignette || 0) + amount * F.vignettePerHp)
    const p = at || this.modelPoint([0, 1.2, 0], new THREE.Vector3())
    const bursts = clamp(Math.round(amount * F.sparksPerHp), 1, 6)
    for (let i = 0; i < bursts; i++) G.fx?.sparks(p)
    G.audio?.play('crash', { pos: p, intensity: clamp(amount / 35, 0.15, 1) })
    G.events.emit('vehicle:damaged', { vehicle: this, amount, hull: this.health, at: p })
    for (const m of F.milestones) if (before > m && this.health <= m && this.health > 0) G.toast(this.tune.toasts[m], 'warn', 6)
    if (before > 0 && this.health <= 0) {
      G.toast(this.tune.toasts[0], 'warn', 7)
      G.events.emit('vehicle:destroyed', { vehicle: this })
      this.onDestroyed()
    }
    // a hard enough smash hurts whoever is inside
    if (this.occupied && amount > F.injury.above) G.player.damage(Math.round((amount - F.injury.above) * F.injury.k), null)
  }
  onDestroyed() {}

  // A charge or kick from something big.
  shove(from, amount) {
    const dx = this.pos.x - from.x
    const dz = this.pos.z - from.z
    const d = Math.hypot(dx, dz) || 1
    this.vel.x += (dx / d) * amount
    this.vel.z += (dz / d) * amount
  }

  repair(to = this.tune.hull) {
    this.health = Math.max(this.health, to)
    this.flash = 0
  }

  fieldRepair() {
    const G = this.G
    this.repair(VEHICLE_FX.fieldRepair.to)
    G.audio?.play('repair', { pos: this.pos })
    G.toast(`Field repair done — hull ${Math.round(this.health)}%. Get it to the pad pump for a proper service.`, 'info', 6)
    G.events.emit('vehicle:repaired', { vehicle: this, field: true })
  }

  // ------------------------------------------------------------ per frame
  // Shake, smoke, warning beeps, AI noise, the rider. Call once per update.
  updateCommon(dt, noiseRadius) {
    const G = this.G
    const F = VEHICLE_FX
    this.shake = Math.max(0, this.shake - dt * F.shakeDecay)
    this.flash = Math.max(0, this.flash - dt)
    const hull = this.health
    // black smoke pours out of a hurt engine, thicker the worse it gets
    if (hull < F.smokeBelow) {
      this.smokeT -= dt
      if (this.smokeT <= 0) {
        const sev = 1 - hull / F.smokeBelow
        this.smokeT = lerp(0.16, 0.05, sev)
        this.emitSmoke(sev)
      }
    }
    if (this.occupied && hull > 0 && hull < F.warnBelow) {
      this.warnT -= dt
      if (this.warnT <= 0) {
        this.warnT = hull < F.criticalBelow ? 0.5 : 0.85
        G.audio?.play('warning', { level: hull < F.criticalBelow ? 1 : 0 })
      }
    } else this.warnT = 0
    if (noiseRadius > 0) {
      this.noiseT -= dt
      if (this.noiseT <= 0) {
        this.noiseT = this.tune.noise.every
        G.events.emit('noise', { x: this.pos.x, y: this.pos.y, z: this.pos.z, radius: noiseRadius, source: 'player', kind: 'vehicle' })
      }
    }
    if (this.occupied) this.ridePlayer(dt)
    // abandoned while moving (the driver died): park once it comes to rest
    else if (!this.parked && this.onGround && Math.hypot(this.vel.x, this.vel.y, this.vel.z) < 0.3) this.park()
  }

  emitSmoke(sev) {
    const fx = this.G.fx
    if (!fx) return
    const p = this.modelPoint(this.tune.enginePoint)
    const n = sev > 0.5 ? 2 : 1
    for (let i = 0; i < n; i++) {
      // dark, rising, spreading — fx.smoke is pale, so emit straight into its pool
      if (fx.normal) {
        const k = 0.05 + Math.random() * 0.07
        fx.normal.emit(p.x, p.y, p.z, (Math.random() - 0.5) * 0.8, 1.3 + Math.random() * 1.2, (Math.random() - 0.5) * 0.8, 1.8 + sev * 1.4, 0.35 + sev * 0.3, k, k, k, -0.6, 0.9 + sev)
      } else fx.smoke(p, 2)
    }
    if (sev > 0.6 && Math.random() < 0.15) fx.sparks(p)
  }

  // ------------------------------------------------------------ cameras
  toggleView() {
    this.view = this.view === 'chase' ? this.seatView : 'chase'
    this.lookYaw = 0
  }
  get inside() {
    return this.occupied && this.view !== 'chase'
  }

  updateCamera(cam, dt) {
    cam.rotation.order = 'YXZ'
    if (this.view === 'chase') this.chaseCamera(cam, dt)
    else this.seatCamera(cam, dt)
    this.applyShake(cam)
    cam.updateMatrixWorld()
  }

  // Shake proportional to recent damage, in both cameras.
  applyShake(cam) {
    const s = this.shake
    if (s <= 0.001) return
    const amp = (this.view === 'chase' ? 0.45 : 0.1) * s
    cam.position.x += (Math.random() - 0.5) * amp
    cam.position.y += (Math.random() - 0.5) * amp
    cam.position.z += (Math.random() - 0.5) * amp
    cam.rotateX((Math.random() - 0.5) * 0.05 * s)
    cam.rotateY((Math.random() - 0.5) * 0.05 * s)
    cam.rotateZ((Math.random() - 0.5) * 0.07 * s)
  }
}
