import * as THREE from 'three'
import { clamp, lerp } from '../core/mathx.js'
import { VEHICLE_FX } from '../data/vehicles.js'

// What every ride on the island shares: getting in and out, the parked
// colliders, the board prompt (which turns into a recovery when the vehicle
// is wrecked or stranded), noise for the AI, and damage that you can
// actually feel — crunch, sparks, smoke, warning beeps. The camera shake and
// the HUD's flashing hull readout hear about hits through 'vehicle:damaged'.
//
// While someone is aboard, `G.vehicle` is this vehicle and the player's body
// rides along (player.pos follows the seat), so anything that targets "the
// player" — a charging trike, a stalking raptor — targets the vehicle, and its
// blows go through strike(). On exit the player is set down on clear,
// walkable ground beside it.
//
// Subclasses provide buildModel(), update(dt, input), seatCamera(cam, dt) and
// chaseCamera(cam, dt), and may override boardLabel(), canBoard(), canExit(),
// recovery(), service(), onEnter(), onExit(force), onDestroyed().
//
// `pitch` and `roll` belong to each subclass's own flight or suspension
// model, and so does their sign (the heli keeps +pitch nose down, the jeep
// nose up); read `model.rotation` for the attitude actually drawn.

const _door = new THREE.Vector3()
const _w = { x: 0, z: 0 }
const _probe = { x: 0, z: 0 }
const _v = new THREE.Vector3()
const _spark = new THREE.Vector3()

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
    this.noiseT = 0
    this.smokeT = 0
    this.warnT = 0
    this.colliders = []
    this.ownCollider = (c) => c.ref !== this
    this.fieldRepairAction = {
      label: `Field repair — patch the ${tune.name} up enough to limp home`,
      hold: VEHICLE_FX.fieldRepair.hold,
      use: () => this.fieldRepair(),
    }
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
  // vehicle can't be used where it is (wrecked, stuck, out of fuel) the same
  // prompt becomes the way to recover it.
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
      label: () => this.recovery()?.label ?? this.boardLabel(),
      enabled: () => (this.occupied ? 'In use' : this.recovery() ? true : this.canBoard()),
      onUse: () => {
        const r = this.recovery()
        if (r) r.use()
        else this.enter()
      },
    })
    // a recovery wants a long hold, boarding a tap
    Object.defineProperty(it, 'hold', { get: () => this.recovery()?.hold ?? 0, enumerable: true, configurable: true })
    this.board = it
  }
  boardLabel() {
    return `Board ${this.tune.name}`
  }
  canBoard() {
    return true
  }
  // What the board prompt offers instead of boarding: { label, hold, use },
  // or null when the vehicle is fine to board. A wreck gets a field repair;
  // subclasses add their own ways of being stranded.
  recovery() {
    return this.destroyed ? this.fieldRepairAction : null
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
    // lower whatever was raised: weapons.update() only eases the aim down, and
    // a raised Field Camera's zoom would carry into the vehicle camera
    if (G.weapons) G.weapons.aim = 0
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
    this.onExit(force)
    return true
  }
  // `force`: thrown clear (death) rather than climbing out of a stopped vehicle
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
  }

  // ------------------------------------------------------------ damage
  // Every hit is loud and sparky, and announced on the bus: the camera shake
  // and the HUD (vignette, flashing hull readout) listen for 'vehicle:damaged'.
  // `at` is the contact point. `injure`: a hard enough smash hurts whoever is
  // inside (strike() does its own accounting for animal blows). An armoured
  // hull (tune.armour) counts every hit at that share.
  damage(amount, at = null, injure = true) {
    const G = this.G
    const F = VEHICLE_FX
    if (!(amount > 0)) return
    amount *= this.tune.armour ?? 1
    const before = this.health
    this.health = Math.max(0, this.health - amount)
    const p = at || this.modelPoint([0, 1.2, 0], new THREE.Vector3())
    this.impactSparks(p, clamp(Math.round(amount * F.sparksPerHp), 1, 6))
    G.audio?.play('crash', { pos: p, intensity: clamp(amount / 35, 0.15, 1) })
    G.events.emit('vehicle:damaged', { vehicle: this, amount, hull: this.health, at: p })
    // the hull toasts are for whoever is aboard, not for a wreck rolling on alone
    const T = this.tune.toasts
    if (this.occupied) for (const m of F.milestones) if (before > m && this.health <= m && this.health > 0) G.toast(T[m], 'warn', 6)
    if (before > 0 && this.health <= 0) {
      if (this.occupied) G.toast(this.onGround && T.grounded ? T.grounded : T[0], 'warn', 7)
      G.events.emit('vehicle:destroyed', { vehicle: this })
      this.onDestroyed()
    }
    if (injure && this.occupied && amount > F.injury.above) G.player.damage(Math.round((amount - F.injury.above) * F.injury.k), null)
  }
  onDestroyed() {}

  // An animal's blow aimed at whoever is inside. The hull soaks it at
  // strikeMul (and its armour, as damage() counts it); an open cab still lets
  // strikeThrough of it reach the rider, and whatever the hull can no longer
  // soak (a wreck soaks nothing) lands on them at full, on-foot weight.
  strike(damage, knock, from, at) {
    const T = this.tune
    const soaked = Math.min(damage, this.health / (T.strikeMul * (T.armour ?? 1)))
    this.shove(from, knock * 0.4)
    this.damage(damage * T.strikeMul, at, false)
    const hurt = damage - soaked + soaked * (T.strikeThrough || 0)
    if (this.occupied && hurt > 0) this.G.player.damage(hurt, from, 0)
  }

  // Sparks you can see from the chase camera: born just outside the hull
  // (the contact sits on a collision circle, often inside the bodywork),
  // flung up over the cabin, with a brief flash on whatever is nearby.
  impactSparks(at, bursts) {
    const fx = this.G.fx
    if (!fx) return
    const S = VEHICLE_FX.sparks
    const dx = at.x - this.pos.x
    const dz = at.z - this.pos.z
    const d = Math.hypot(dx, dz)
    const p = d > 1e-3 ? _spark.set(at.x + (dx / d) * S.push, at.y, at.z + (dz / d) * S.push) : _spark.copy(at)
    for (let i = 0; i < bursts; i++) fx.burst(fx.add, p, S.n, S.spread, S.up, S.life, S.size, [1, 0.62, 0.22], S.gravity)
    // the same flash a muzzle uses, so trunks and foliage light up even when
    // the sparks themselves are behind the cabin
    if (fx.flashLight) {
      fx.flashLight.position.copy(p)
      fx.flashLight.intensity = Math.max(fx.flashLight.intensity, S.flash * Math.min(1, bursts / 3))
      fx.flashT = Math.max(fx.flashT, S.flashTime)
    }
  }

  // The heights its hull spans, into `out` [lo, hi], for an animal's reach
  // (Creature.span, actors/reach.js): the tune's hitY, else the span of its
  // parked colliders.
  reachSpan(out) {
    const T = this.tune
    const hy = (this._hullY ??= T.hitY || (T.parked?.length ? [Math.min(...T.parked.map((b) => b.y0)), Math.max(...T.parked.map((b) => b.y1))] : [0.3, 2]))
    out[0] = this.pos.y + hy[0]
    out[1] = this.pos.y + hy[1]
    return out
  }

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
  }

  // What the pad pump does for it: the hull back to new (the heli also fills up).
  needsService() {
    return this.health < this.tune.hull
  }
  service() {
    this.repair()
    this.G.events.emit('vehicle:repaired', { vehicle: this, field: false })
  }

  fieldRepair() {
    const G = this.G
    this.repair(VEHICLE_FX.fieldRepair.to)
    G.audio?.play('repair', { pos: this.pos })
    G.toast(`Field repair done — hull ${Math.round(this.health)}%. ${this.tune.toasts.fieldRepaired}`, 'info', 6)
    G.events.emit('vehicle:repaired', { vehicle: this, field: true })
  }

  // ------------------------------------------------------------ per frame
  // Smoke, warning beeps, AI noise, the rider. Call once per update.
  updateCommon(dt, noiseRadius) {
    const G = this.G
    const F = VEHICLE_FX
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
    else if (!this.parked && this.onGround && Math.hypot(this.vel.x, this.vel.y, this.vel.z) < 0.3) {
      this.vel.set(0, 0, 0)
      this.park()
    }
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
    this.G.shake?.apply(cam, this.view === 'chase' ? 'chase' : 'seat', dt)
    cam.updateMatrixWorld()
  }
}
