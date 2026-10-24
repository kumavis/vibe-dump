import * as THREE from 'three'
import { clamp, damp, dampAngle, lerp, smoothstep, yawDirX, yawDirZ, yawTo } from '../core/mathx.js'
import { SUB } from '../data/vehicles.js'
import { Vehicle } from './vehicle.js'
import { Parts } from './jeep.js'
import { ballastStep, heave, submergedShare } from './ballast.js'
import { waveAt } from '../world/underwater.js'

// The sea lab's research submersible. W/S thrusters, A/D yaw, Space blows the
// ballast and rises, Shift floods it and dives; let go and she trims back to
// neutral and holds her depth (vehicles/ballast.js). She cannot leave the
// water — breaking the surface she loses lift and settles, bobbing — and she
// feels the seabed through her keel and the lab's piles through her hull:
// knocks are loud, hard ones cost hull. F floods the water ahead with light,
// R pings the sonar (bottom, the nearest contact, the way home).
//
// You board her from the moon pool's catwalk or swimming beside her at the
// surface, and get out the same two ways: up onto the catwalk in the moon
// pool, or into the sea. Left to herself (or with the hull gone) her tanks
// blow and she comes up, so she is never lost on the bottom; stranded on a
// beach, the board prompt has the station tow her home.

const _c = { x: 0, z: 0 }
const _n = new THREE.Vector3()
const _state = { y: 0, vy: 0 }

export class Submarine extends Vehicle {
  // In her cradle in the sea lab's moon pool (world/structures.js buildSeaLab).
  static atSeaLab(G) {
    const mp = G.island.poi.sealab.moonpool
    return new Submarine(G, new THREE.Vector3(mp.x, G.island.sea - SUB.float.y1, mp.z), mp.yaw)
  }

  constructor(G, pos, yaw) {
    super(G, SUB, pos, yaw)
    this.ballast = 0
    this.share = 1
    this.throttle = 0
    this.yawRate = 0
    this.rpm = 0
    this.propAngle = 0
    this.lights = false
    this.warmedFor = null
    this.bottomed = false
    this.stuckT = 0
    this.sonarT = 0
    this.sonar = null // the last ping: { t, bottom, contact, home }
    this.lookIdle = 0
    this.quiet = true
    this.recoverAction = { label: 'Radio the sea lab to tow the submersible home', hold: SUB.recover.hold, use: () => this.towHome() }
    this.buildModel()
    this.sync()
    this.park()
    this.registerBoard('sub')
  }

  // ------------------------------------------------------------ state
  // The sea's surface over her (the same waves the water shader draws).
  surfaceAt() {
    const t = this.G.underwater?.waterClock.value ?? this.G.time
    return this.G.island.sea + waveAt(this.pos.x, this.pos.z, t)
  }
  // Her float body breaking the surface: the hatch is clear of the water.
  get surfaced() {
    return this.pos.y + this.tune.float.y1 >= this.surfaceAt() - 0.2
  }
  // Inside the moon pool's well, where the cradle is.
  inPool() {
    const mp = this.G.island.poi.sealab?.moonpool
    if (!mp) return false
    const dx = this.pos.x - mp.x
    const dz = this.pos.z - mp.z
    const lx = dx * Math.cos(mp.yaw) - dz * Math.sin(mp.yaw)
    const lz = dx * Math.sin(mp.yaw) + dz * Math.cos(mp.yaw)
    return Math.abs(lx) < mp.hw && Math.abs(lz) < mp.hl
  }

  boardLabel() {
    return this.inPool() ? 'Climb down into the submersible' : 'Board the submersible'
  }
  canBoard() {
    return this.surfaced ? true : 'She is under water'
  }
  // A wreck gets the field repair; stranded out of the water (or wedged and
  // going nowhere), the station tows her back to the cradle.
  recovery() {
    if (this.destroyed) return this.fieldRepairAction
    return this.share < 0.3 || this.stuckT > this.tune.recover.stuckAfter ? this.recoverAction : null
  }
  towHome() {
    const G = this.G
    const mp = G.island.poi.sealab.moonpool
    this.unpark()
    this.pos.set(mp.x, G.island.sea - this.tune.float.y1, mp.z)
    this.yaw = this.camYaw = mp.yaw
    this.vel.set(0, 0, 0)
    this.ballast = 0
    this.stuckT = 0
    this.share = 1
    this.sync()
    this.park()
    G.audio?.play('pump', { pos: this.pos })
    G.toast('The sea lab winch hauled her home — she is back in the moon pool.', 'info', 6)
  }

  // Surfaced and still; where you get out depends on where she is.
  canExit() {
    return this.surfaced && Math.abs(this.vel.y) < 0.6 && this.speed <= this.tune.exitSpeed
  }

  // Up onto the catwalk in the moon pool; anywhere else, into the sea beside
  // her (swimming), or onto the bottom if it is shallow enough to stand.
  findExitSpot() {
    const G = this.G
    const mp = G.island.poi.sealab?.moonpool
    if (this.inPool() && mp) return mp.exit.clone()
    const sea = G.island.sea
    for (const [lx, lz] of this.tune.exits) {
      const w = this.toWorld(lx, lz)
      const ground = G.physics.groundAt(w.x, w.z, sea + 1)
      const y = sea - ground > 1.6 ? sea - 1.45 : ground
      _c.x = w.x
      _c.z = w.z
      if (G.physics.collideCircle(_c, 0.5, y + 0.4, y + 1.7)) continue
      return new THREE.Vector3(w.x, y, w.z)
    }
    const w = this.toWorld(this.tune.exits[0][0], this.tune.exits[0][1])
    return new THREE.Vector3(w.x, sea - 1.45, w.z)
  }

  onEnter() {
    const G = this.G
    this.warmLights()
    if (G.sky.light < 0.35) this.setLights(true)
    G.audio?.play('scan') // systems on
    G.toast(
      G.input.lastDevice === 'gamepad'
        ? 'Left stick: thrust / turn · A: blow ballast (rise) · B: flood (dive) · let go to hold depth · RS: floodlights · X: sonar · LB: camera · Y: exit (surfaced)'
        : 'W/S: thrust · A/D: turn · Space: blow ballast (rise) · Shift: flood (dive) · let go to hold depth · F: floodlights · R: sonar · V: camera · E: exit (surfaced)',
      'info',
      10,
    )
  }
  onExit() {
    this.throttle = 0
    if (this.lights) this.setLights(false)
  }
  onDestroyed() {
    this.throttle = 0
  }

  setLights(on) {
    this.lights = on
    this.floodlight.visible = on
    this.beam.visible = on
    this.lensMat.emissive.setHex(on ? 0xfff2d0 : 0x000000)
    this.G.audio?.play('click')
  }
  // The beam adds a light to every lit shader; compile those ahead, in the
  // background, as the jeep does (see Jeep.warmLights).
  warmLights() {
    const G = this.G
    const tier = G.gfx?.tier ?? 'default'
    if (this.warmedFor === tier || this.lights || !G.renderer?.compileAsync) return
    this.warmedFor = tier
    this.floodlight.visible = true
    G.renderer.compileAsync(G.scene, G.camera).catch(() => {})
    this.floodlight.visible = false
  }

  // A ping: the depth under her keel, the nearest contact in the water, and
  // the bearing home. The HUD shows it a few seconds; fish scatter from it.
  ping() {
    const G = this.G
    const S = this.tune.sonar
    if (this.sonarT > 0) return
    this.sonarT = S.cooldown
    const lab = G.island.poi.sealab
    const bearing = (x, z) => (((-yawTo(this.pos.x, this.pos.z, x, z) * 180) / Math.PI) % 360 + 360) % 360
    const c = G.sealife?.contact(this.pos)
    this.sonar = {
      t: G.time,
      bottom: this.pos.y - G.island.heightAt(this.pos.x, this.pos.z),
      contact: c && c.d < S.range ? { kind: c.kind, d: c.d, bearing: bearing(c.x, c.z) } : null,
      home: { d: Math.hypot(lab.x - this.pos.x, lab.z - this.pos.z), bearing: bearing(lab.x, lab.z) },
    }
    G.audio?.play('sonar', { pos: this.pos })
    G.events.emit('sonar', { x: this.pos.x, y: this.pos.y, z: this.pos.z, range: S.range })
  }

  // ------------------------------------------------------------ per frame
  update(dt, input) {
    const G = this.G
    let thr = 0
    let steer = 0
    let cmd = 0
    this.sonarT = Math.max(0, this.sonarT - dt)
    if (this.occupied) {
      thr = input.axis('back', 'forward')
      steer = input.axis('right', 'left')
      cmd = (input.down('ascend') ? 1 : 0) - (input.down('descend') ? 1 : 0)
      const look = input.look()
      G.player.lastLook = look
      this.lookYaw = clamp(this.lookYaw - look.dx, -1.9, 1.9)
      this.lookPitch = clamp(this.lookPitch - look.dy, -0.9, 1.25) // the bubble looks up at the surface
      if (Math.abs(look.dx) + Math.abs(look.dy) > 1e-5) this.lookIdle = 0
      else if ((this.lookIdle += dt) > 1.5 && this.speed > 1.5) {
        this.lookYaw = damp(this.lookYaw, 0, 2, dt)
        this.lookPitch = damp(this.lookPitch, 0, 2, dt)
      }
      if (input.pressed('camera')) this.toggleView()
      if (input.pressed('flashlight')) this.setLights(!this.lights)
      if (input.pressed('reload')) this.ping()
      if (input.pressed('interact')) this.exit()
    }
    if (this.parked && !this.occupied) {
      // moored: she rides the swell where she is; nothing to simulate
      const p = G.player.pos
      if (Math.hypot(p.x - this.pos.x, p.z - this.pos.z) < this.tune.lights.warmRange) this.warmLights()
      this.rpm = damp(this.rpm, 0, 3, dt)
      this.thrusterAudio(0)
      this.updateCommon(dt, 0)
      this.sync()
      return
    }
    this.drive(dt, thr, steer, cmd)
  }

  drive(dt, thr, steer, cmd) {
    if (!(dt > 0)) return
    const G = this.G
    const T = this.tune
    const isl = G.island
    const alive = !this.destroyed
    // nobody at the controls, or the hull gone: the tanks blow and she comes up
    if (!this.occupied || !alive) cmd = 1
    const wasShare = this.share

    // ---- ballast and heave: let go under water and she trims neutral and
    // holds her depth; let go breaking the surface and the tanks stay blown
    this.ballast = ballastStep(this.ballast, cmd, dt, T.ballast, this.share < 0.995 ? T.ballast.float : 0)
    const surf = this.surfaceAt()
    _state.y = this.pos.y
    _state.vy = this.vel.y
    heave(_state, this.ballast, surf, dt, T)
    this.pos.y = _state.y
    this.vel.y = _state.vy
    this.share = submergedShare(this.pos.y, surf, T.float)

    // ---- thrusters: they need water round them
    const power = alive ? smoothstep(0.2, 0.6, this.share) : 0
    this.throttle = damp(this.throttle, thr * power, 3, dt)
    this.yawRate = damp(this.yawRate, steer * T.thrust.yaw * power, T.thrust.response, dt)
    this.yaw += this.yawRate * dt
    const s = Math.sin(this.yaw)
    const c = Math.cos(this.yaw)
    let vf = this.vel.x * -s + this.vel.z * -c
    let vr = this.vel.x * c + this.vel.z * -s
    // the props reversed against her way are a brake at full power; pushing
    // her astern from rest they are weak
    const push = this.throttle * vf < 0 && Math.abs(vf) > 0.3 ? T.thrust.forward : this.throttle >= 0 ? T.thrust.forward : T.thrust.reverse
    vf += (this.throttle * push - T.thrust.drag * vf - T.thrust.drag2 * vf * Math.abs(vf)) * dt
    vr *= Math.exp(-T.thrust.side * dt)
    this.vel.x = -s * vf + c * vr
    this.vel.z = -c * vf - s * vr
    this.pos.x += this.vel.x * dt
    this.pos.z += this.vel.z * dt
    const lim = isl.half - 40
    this.pos.x = clamp(this.pos.x, -lim, lim)
    this.pos.z = clamp(this.pos.z, -lim, lim)

    // ---- contacts: overhead decks, piles and walls, then the seabed
    this.collideCeiling()
    this.collideStatics()
    this.collideBed()
    this.dockAssist(dt)

    // stranded: asking to go and going nowhere
    if (this.occupied && alive && thr !== 0 && this.speed < 0.25) this.stuckT += dt
    else if (this.speed > 1) this.stuckT = 0

    // ---- attitude: nose up as she climbs, a lean into turns, the swell's
    // roll and pitch while she rides the surface
    const t = G.time
    const swell = 1 - smoothstep(0.85, 1, this.share)
    const pitchT = clamp(this.vel.y * 0.07 + this.throttle * 0.02, -0.2, 0.2) + swell * Math.sin(t * 0.8 + this.pos.x * 0.1) * 0.03
    const rollT = clamp(-this.yawRate * vf * 0.05, -0.12, 0.12) + swell * Math.sin(t * 0.65 + this.pos.z * 0.1) * 0.045
    this.pitch = damp(this.pitch, pitchT, 2.5, dt)
    this.roll = damp(this.roll, rollT, 2.5, dt)

    // ---- the water: splashes breaking the surface, bubbles from the props
    if ((wasShare < 0.97) !== (this.share < 0.97) && Math.abs(this.vel.y) > 0.25) {
      G.fx?.splash({ x: this.pos.x, y: isl.sea, z: this.pos.z })
      G.audio?.play('splash', { pos: this.pos })
    }
    const speed = Math.abs(vf)
    this.rpm = damp(this.rpm, this.occupied && alive ? 0.15 + 0.85 * Math.abs(this.throttle) : 0, 3, dt)
    this.propAngle += this.rpm * dt * 30
    for (const p of this.props) p.rotation.z = this.propAngle
    if (this.share > 0.98 && this.rpm > 0.3 && Math.random() < this.rpm * 0.6) this.bubbles(this.modelPoint([Math.random() < 0.5 ? -1.25 : 1.25, 1.0, 2.0]), 1)
    // kelp parts round her
    if (this.occupied) G.veg?.setPush(this.pos.x, this.pos.z, 5, 0.15 + Math.min(0.2, speed * 0.04))

    // "at rest" for the base class (it parks her once abandoned and still):
    // only riding the surface, never sitting on the bottom
    this.onGround = this.surfaced && Math.abs(this.vel.y) < 0.1
    this.thrusterAudio(Math.abs(this.throttle))
    const noise = this.occupied && alive ? lerp(T.noise.idle, T.noise.max, Math.abs(this.throttle)) : 0
    this.updateCommon(dt, noise)
    this.sync()
  }

  // The cradle takes her: surfaced, slow and inside the moon pool, she is
  // eased onto its centreline and squared up.
  dockAssist(dt) {
    const mp = this.G.island.poi.sealab?.moonpool
    const D = this.tune.dock
    if (!mp || !this.surfaced || this.speed > D.speed || !this.inPool()) return
    const k = 1 - Math.exp(-D.pull * dt)
    this.pos.x += (mp.x - this.pos.x) * k
    this.pos.z += (mp.z - this.pos.z) * k
    // either way round: she can back in
    const flip = Math.abs(((this.yaw - mp.yaw + Math.PI * 3) % (Math.PI * 2)) - Math.PI) > Math.PI / 2 ? Math.PI : 0
    this.yaw = dampAngle(this.yaw, mp.yaw + flip, D.pull, dt)
    this.vel.x *= 1 - k
    this.vel.z *= 1 - k
  }

  // Rising under a deck (the hangar floor round the moon pool): the tower
  // bumps it and she stops there instead of being shoved out sideways. Only
  // a rise does that — run into a deck's edge and it is a wall
  // (collideStatics).
  collideCeiling() {
    const G = this.G
    const T = this.tune
    let ceil = Infinity
    for (const b of T.hitbox) {
      const w = this.toWorld(0, b.z)
      ceil = Math.min(ceil, G.physics.ceilingAt(w.x, w.z, this.pos.y + 0.5))
    }
    const top = this.pos.y + T.hitY[1]
    if (top <= ceil || top - ceil > 0.15) return
    this.pos.y = ceil - T.hitY[1]
    if (this.vel.y > 0) {
      if (this.vel.y > 0.6) this.G.audio?.play('crash', { pos: this.pos, intensity: 0.15 })
      this.vel.y = 0
    }
  }

  // Piles, walls, the platform: bounce off, and get hurt by the closing speed.
  collideStatics() {
    const G = this.G
    const T = this.tune
    let nx = 0
    let nz = 0
    let hit = null
    for (const b of T.hitbox) {
      const w = this.toWorld(0, b.z)
      _c.x = w.x
      _c.z = w.z
      if (!G.physics.collideCircle(_c, b.r, this.pos.y + T.hitY[0], this.pos.y + T.hitY[1], this.ownCollider)) continue
      const dx = _c.x - w.x
      const dz = _c.z - w.z
      this.pos.x += dx
      this.pos.z += dz
      nx += dx
      nz += dz
      const l = Math.hypot(dx, dz) || 1
      hit = { x: w.x - (dx / l) * b.r, z: w.z - (dz / l) * b.r }
    }
    const nl = Math.hypot(nx, nz)
    if (nl < 1e-6) return
    this.knock(nx / nl, 0, nz / nl, new THREE.Vector3(hit.x, this.pos.y + 1.0, hit.z))
  }

  // The seabed under the keel points: a gentle rise lifts her over it, a
  // steep one is a wall she is pushed back off.
  collideBed() {
    const G = this.G
    const T = this.tune
    const isl = G.island
    let lift = 0
    let wall = null
    let at = null
    for (const [lx, lz] of T.keel) {
      const w = this.toWorld(lx, lz)
      const pen = isl.heightAt(w.x, w.z) - this.pos.y
      if (pen <= 0) continue
      if (pen < T.climb) lift = Math.max(lift, pen)
      else {
        isl.normalAt(w.x, w.z, _n)
        const l = Math.hypot(_n.x, _n.z) || 1
        const k = Math.min(pen, 0.4)
        this.pos.x += (_n.x / l) * k
        this.pos.z += (_n.z / l) * k
        wall = { x: _n.x / l, z: _n.z / l }
        at = new THREE.Vector3(w.x, this.pos.y + 0.4, w.z)
      }
    }
    this.bottomed = lift > 0
    if (lift > 0) {
      this.pos.y += lift
      if (this.vel.y < 0) {
        const B = T.bottom
        if (-this.vel.y > B.min) this.damage((-this.vel.y - B.min) * B.k, new THREE.Vector3(this.pos.x, this.pos.y + 0.1, this.pos.z))
        this.vel.y = 0
      }
      // the skids drag on the bottom
      this.vel.x *= 0.97
      this.vel.z *= 0.97
    }
    if (wall) this.knock(wall.x, 0, wall.z, at)
  }

  // A contact with outward normal n: bounce, scrub, and charge the hit.
  knock(nx, ny, nz, at) {
    const I = this.tune.impact
    const vn = this.vel.x * nx + this.vel.z * nz
    if (vn >= 0) return
    this.vel.x -= nx * vn * (1 + I.bounce)
    this.vel.z -= nz * vn * (1 + I.bounce)
    if (-vn > I.min) this.damage(Math.min(I.maxHit, (-vn - I.min) * I.k), at)
    else if (-vn > 0.6) this.G.audio?.play('crash', { pos: at, intensity: 0.12 })
  }

  bubbles(p, n) {
    const fx = this.G.fx
    if (!fx?.normal) return
    for (let i = 0; i < n; i++) {
      const k = 0.75 + Math.random() * 0.2
      fx.normal.emit(p.x, p.y, p.z, (Math.random() - 0.5) * 0.4, 0.4 + Math.random() * 0.5, (Math.random() - 0.5) * 0.4, 1.4, 0.025 + Math.random() * 0.035, k, k + 0.05, k + 0.08, -1.8, 0.01)
    }
  }
  // a hurt hull leaks air under water, not smoke
  emitSmoke(sev) {
    if (this.share > 0.95) this.bubbles(this.modelPoint(this.tune.enginePoint), sev > 0.5 ? 3 : 1)
    else super.emitSmoke(sev)
  }

  thrusterAudio(load) {
    if (this.rpm < 0.002 && this.quiet) return
    this.quiet = this.rpm < 0.002
    this.G.audio?.setThrusters?.(this.rpm, load, this.pos, this.inside)
  }

  // ------------------------------------------------------------ drawing
  sync() {
    let y = this.pos.y
    if (this.parked) {
      // moored: she rides the swell
      const t = this.G.time
      y += waveAt(this.pos.x, this.pos.z, this.G.underwater?.waterClock.value ?? t)
      this.model.rotation.set(Math.sin(t * 0.8 + this.pos.x * 0.1) * 0.025, this.yaw, Math.sin(t * 0.65 + this.pos.z * 0.1) * 0.04)
    } else this.model.rotation.set(this.pitch, this.yaw, this.roll)
    this.model.position.set(this.pos.x, y, this.pos.z)
    this.pilot.visible = this.occupied && this.view === 'chase'
    this.beam.material.uniforms.uOn.value = this.lights && this.G.underwater?.active ? 1 : 0
  }

  // From the pilot's seat inside the bubble: the canopy frame round you, the
  // console under you, the hull behind.
  seatCamera(cam) {
    cam.position.copy(this.modelPoint(this.tune.seat))
    cam.rotation.set(this.pitch * 0.8 + this.lookPitch, this.yaw + this.lookYaw, this.roll * 0.8)
    this.camYaw = this.yaw + this.lookYaw
  }

  // Behind and above her; kept on her side of the surface (under it while
  // she is submerged, over it while she rides it) and pulled in rather than
  // looking through a pile or the platform.
  chaseCamera(cam, dt) {
    const G = this.G
    const C = this.tune.chase
    this.camYaw = dampAngle(this.camYaw, this.yaw + this.lookYaw, C.follow, dt)
    const fx = this.pos.x
    const fy = this.pos.y + 1.2
    const fz = this.pos.z
    const dx = -yawDirX(this.camYaw) * C.back
    const dz = -yawDirZ(this.camYaw) * C.back
    const dy = C.up - 1.2 - this.lookPitch * 4
    const L = Math.hypot(dx, dy, dz)
    const hit = G.physics.raycast(fx, fy, fz, dx / L, dy / L, dz / L, L, { ignoreTag: 'tree' })
    const k = hit ? Math.max(1.5, hit.t - 0.4) / L : 1
    const cx = fx + dx * k
    const cz = fz + dz * k
    let cy = Math.max(fy + dy * k, G.island.heightAt(cx, cz) + 0.8)
    const surf = this.surfaceAt()
    if (this.surfaced) cy = Math.max(cy, surf + 0.6)
    else cy = Math.min(cy, surf - 0.5)
    const f = hit ? 1 : Math.min(1, dt * 6)
    cam.position.set(lerp(cam.position.x, cx, f), lerp(cam.position.y, cy, f), lerp(cam.position.z, cz, f))
    if (this.surfaced) cam.position.y = Math.max(cam.position.y, surf + 0.5)
    else cam.position.y = Math.min(cam.position.y, surf - 0.4)
    cam.lookAt(fx + yawDirX(this.camYaw) * C.lookAhead, fy, fz + yawDirZ(this.camYaw) * C.lookAhead)
  }

  // ------------------------------------------------------------ model
  buildModel() {
    const L = (o) => new THREE.MeshLambertMaterial(o)
    const M = {
      yellow: L({ color: 0xd9a92a }),
      white: L({ color: 0xd8d6cc }),
      orange: L({ color: 0xc8642a }),
      dark: L({ color: 0x2a2c2c }),
      metal: L({ color: 0x8a8e8a }),
      rust: L({ color: 0x7a5236 }),
      seat: L({ color: 0x333a40 }),
      skin: L({ color: 0xc69872 }),
      suit: L({ color: 0x3a5a6a }),
    }
    this.lensMat = L({ color: 0xf4eedc, emissive: 0x000000 })
    const sonarScreen = new THREE.MeshBasicMaterial({ map: screenTexture('sonar') })
    const navScreen = new THREE.MeshBasicMaterial({ map: screenTexture('nav') })
    const glass = new THREE.MeshPhongMaterial({ color: 0x9fc4c8, transparent: true, opacity: 0.16, shininess: 140, specular: 0xaaccdd, depthWrite: false, side: THREE.DoubleSide })
    const g = new THREE.Group()
    g.rotation.order = 'YXZ'
    const P = new Parts()

    // pressure hull: a capsule along Z behind the bubble
    P.add(M.yellow, new THREE.CapsuleGeometry(0.8, 2.3, 6, 16), 0, 1.0, 0.75, Math.PI / 2)
    // white upper fairing and the hatch tower
    P.box(M.white, 0.95, 0.36, 2.6, 0, 1.78, 0.75)
    P.cyl(M.white, 0.36, 0.42, 0.42, 14, 0, 2.05, -0.1)
    P.cyl(M.dark, 0.4, 0.4, 0.06, 14, 0, 2.29, -0.1)
    P.box(M.metal, 0.08, 0.06, 0.32, 0.18, 2.34, -0.1)
    // nav mast with its lamp
    P.tube(M.dark, 0.025, [0, 1.95, 1.6], [0, 2.6, 1.7])
    // orange ballast pods along her flanks
    for (const x of [-0.98, 0.98]) {
      P.add(M.orange, new THREE.CapsuleGeometry(0.3, 2.0, 4, 10), x, 0.7, 0.75, Math.PI / 2)
      P.box(M.dark, 0.05, 0.18, 1.6, x * 1.29, 0.7, 0.75)
    }
    // skids and their struts
    for (const x of [-0.62, 0.62]) {
      P.tube(M.dark, 0.06, [x, 0.07, -1.9], [x, 0.07, 2.2])
      P.tube(M.dark, 0.06, [x, 0.07, -1.9], [x, 0.3, -2.2])
      for (const z of [-1.2, 0.4, 1.9]) P.tube(M.dark, 0.04, [x, 0.07, z], [x * 0.7, 0.45, z])
    }
    // stern: a tapering cone, the main thruster duct, the rudder fins
    P.add(M.yellow, new THREE.ConeGeometry(0.62, 0.9, 14, 1, true), 0, 1.0, 2.55, Math.PI / 2)
    for (const s of [-1, 1]) P.box(M.white, 0.06, 0.7, 0.5, 0, 1.0 + s * 0.55, 2.7)
    // the lamp bar under the bow and the console inside the bubble
    P.box(M.dark, 1.7, 0.12, 0.16, 0, 0.3, -2.05)
    for (const x of [-0.72, 0.72]) {
      P.cyl(M.dark, 0.13, 0.15, 0.22, 12, x, 0.33, -2.15, Math.PI / 2)
      P.add(this.lensMat, new THREE.CircleGeometry(0.11, 12), x, 0.33, -2.265, Math.PI)
    }
    // the console, low in the bubble where the pilot looks over it, its face
    // tilted up at the seat: a sonar screen and the nav screen
    const tilt = 0.7
    const nY = Math.cos(tilt) * 0.041
    const nZ = Math.sin(tilt) * 0.041
    P.box(M.dark, 0.62, 0.08, 0.26, 0, 0.94, -1.9, tilt)
    P.add(sonarScreen, new THREE.PlaneGeometry(0.24, 0.18), -0.15, 0.94 + nY, -1.9 + nZ, tilt - Math.PI / 2)
    P.add(navScreen, new THREE.PlaneGeometry(0.24, 0.18), 0.15, 0.94 + nY, -1.9 + nZ, tilt - Math.PI / 2)
    P.tube(M.dark, 0.03, [0, 0.9, -1.85], [0, 0.45, -1.6])
    // the pilot's chair
    P.box(M.seat, 0.55, 0.12, 0.5, 0, 0.4, -1.0)
    P.box(M.seat, 0.55, 0.6, 0.1, 0, 0.72, -0.72, -0.2)
    // the bubble's frame, all of it in the pilot's view: the ring where it
    // meets the hull, an arch overhead, the sill round its equator and two
    // ribs rising from the sill either side of straight ahead to the crown
    P.add(M.white, new THREE.TorusGeometry(0.86, 0.06, 6, 28), 0, 1.0, -0.42)
    P.add(M.dark, new THREE.TorusGeometry(0.94, 0.035, 5, 28, Math.PI), 0, 1.0, -1.05)
    P.add(M.dark, new THREE.TorusGeometry(0.95, 0.03, 6, 36), 0, 1.0, -1.2, Math.PI / 2)
    for (const side of [-1, 1]) P.add(M.dark, new THREE.TorusGeometry(0.95, 0.016, 5, 16, Math.PI / 2), 0, 1.0, -1.2, 0, Math.PI / 2 - side * 0.72, 0)
    P.add(M.dark, new THREE.TorusGeometry(0.62, 0.03, 5, 24), 0, 0.28, -1.2, Math.PI / 2)
    // the manipulator arm, folded under the bow on the right
    P.tube(M.metal, 0.06, [0.6, 0.35, -1.7], [0.95, 0.3, -2.3])
    P.tube(M.metal, 0.05, [0.95, 0.3, -2.3], [0.7, 0.2, -2.55])
    P.box(M.dark, 0.1, 0.1, 0.16, 0.66, 0.18, -2.62)
    P.box(M.dark, 0.04, 0.03, 0.18, 0.6, 0.14, -2.72)
    P.box(M.dark, 0.04, 0.03, 0.18, 0.72, 0.14, -2.72)
    // a sample basket on the skids and a rusted tow eye
    P.box(M.metal, 0.6, 0.2, 0.45, -0.1, 0.3, -1.95)
    P.add(M.rust, new THREE.TorusGeometry(0.1, 0.025, 5, 10), 0, 1.3, 2.95)

    // props: the stern one and two side thrusters in their ducts; only the
    // props turn, so the ducts and their arms go in with the hull
    const PROPS = [
      [0, 1.0, 3.05, 0.42],
      [-1.32, 1.0, 1.75, 0.26],
      [1.32, 1.0, 1.75, 0.26],
    ]
    for (const [x, y, z, r] of PROPS) {
      P.add(M.dark, new THREE.TorusGeometry(r + 0.05, 0.06, 6, 18), x, y, z)
      if (x) P.cyl(M.dark, 0.05, 0.05, Math.abs(x) - 0.75, 6, x / 2 + Math.sign(x) * 0.37, y, z, 0, 0, Math.PI / 2)
    }
    // the hull's stencil, both flanks
    const decal = new THREE.MeshLambertMaterial({ map: hullDecal(), transparent: true, depthWrite: false })
    for (const s of [-1, 1]) P.add(decal, new THREE.PlaneGeometry(1.7, 0.36), s * 0.81, 1.25, 0.95, 0, (s * Math.PI) / 2, 0)
    P.build(g)

    // the bubble itself
    const bubble = new THREE.Mesh(new THREE.SphereGeometry(0.95, 24, 16), glass)
    bubble.position.set(0, 1.0, -1.2)
    bubble.renderOrder = 3
    g.add(bubble)
    this.props = []
    for (const [x, y, z, r] of PROPS) {
      const prop = new THREE.Group()
      prop.position.set(x, y, z)
      const pp = new Parts()
      for (let i = 0; i < 3; i++) {
        const a = (i / 3) * Math.PI * 2
        pp.box(M.metal, 0.07, r * 0.9, 0.02, -Math.sin(a) * r * 0.47, Math.cos(a) * r * 0.47, 0, 0, 0.35, a)
      }
      pp.cyl(M.dark, 0.06, 0.06, 0.12, 8, 0, 0, 0, Math.PI / 2)
      pp.build(prop)
      g.add(prop)
      this.props.push(prop)
    }
    // nav lamp on the mast
    const nav = new THREE.Mesh(new THREE.SphereGeometry(0.05, 6, 4), L({ color: 0x401010, emissive: 0xc02010 }))
    nav.position.set(0, 2.63, 1.71)
    g.add(nav)
    // a pilot in the bubble, seen from the chase camera
    const D = new Parts()
    D.box(M.suit, 0.42, 0.5, 0.26, 0, 0.75, -1.0, -0.15)
    D.add(M.skin, new THREE.SphereGeometry(0.11, 10, 8), 0, 1.16, -1.08)
    D.add(M.dark, new THREE.SphereGeometry(0.125, 10, 6, 0, Math.PI * 2, 0, Math.PI * 0.55), 0, 1.18, -1.06)
    for (const x of [-0.18, 0.18]) D.tube(M.suit, 0.05, [x, 0.9, -1.0], [x * 0.8, 0.78, -1.35])
    this.pilot = new THREE.Group()
    D.build(this.pilot)
    this.pilot.visible = false
    g.add(this.pilot)

    // One floodlight between the lamps, and a soft cone of lit water in front
    // of it while under the surface.
    const Lt = this.tune.lights
    const beam = new THREE.SpotLight(0xf2f6ff, Lt.intensity, Lt.range, Lt.angle, Lt.penumbra, Lt.decay)
    beam.position.set(0, 0.33, -2.3)
    beam.target.position.set(0, -2.8, -18)
    beam.visible = false
    g.add(beam, beam.target)
    this.floodlight = beam
    this.beam = lightCone()
    this.beam.position.set(0, 0.33, -2.3)
    this.beam.rotation.x = Math.PI / 2 - 0.19 // the cone's axis (-Y) forward and a little down
    this.beam.visible = false
    g.add(this.beam)

    g.traverse((o) => {
      if (o.isMesh && !o.material.transparent && o.material.type !== 'ShaderMaterial') {
        o.castShadow = true
        o.receiveShadow = true
      }
    })
    this.model = g
    this.G.scene.add(g)
  }
}

// The floodlight's cone of lit water: additive, brightest at the lamp and
// fading along its length and towards its edge.
function lightCone() {
  const len = 16
  const geo = new THREE.ConeGeometry(4.2, len, 20, 1, true).translate(0, -len / 2, 0)
  const mat = new THREE.ShaderMaterial({
    uniforms: { uOn: { value: 0 } },
    vertexShader: `
      varying float vAlong; varying vec3 vN; varying vec3 vV;
      void main() {
        vAlong = -position.y / ${len.toFixed(1)};
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vN = normalize(normalMatrix * normal);
        vV = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: `
      uniform float uOn;
      varying float vAlong; varying vec3 vN; varying vec3 vV;
      void main() {
        float edge = pow(abs(dot(normalize(vN), normalize(vV))), 1.5);
        float a = uOn * edge * (1.0 - smoothstep(0.0, 1.0, vAlong)) * smoothstep(0.0, 0.06, vAlong) * 0.16;
        gl_FragColor = vec4(vec3(0.75, 0.88, 0.9) * a, 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.Mesh(geo, mat)
  mesh.renderOrder = 6
  mesh.frustumCulled = false
  return mesh
}

// The console's two screens, drawn once: a sonar sweep with a few returns,
// and the nav page (a depth ladder, the trim bar, a heading tape).
function screenTexture(kind) {
  const c = document.createElement('canvas')
  c.width = 256
  c.height = 192
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#021712'
  ctx.fillRect(0, 0, 256, 192)
  ctx.strokeStyle = 'rgba(70, 220, 160, 0.35)'
  ctx.lineWidth = 2
  if (kind === 'sonar') {
    for (const r of [28, 56, 84]) {
      ctx.beginPath()
      ctx.arc(128, 96, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    const g = ctx.createRadialGradient(128, 96, 0, 128, 96, 88)
    g.addColorStop(0, 'rgba(90, 255, 180, 0.7)')
    g.addColorStop(1, 'rgba(90, 255, 180, 0.05)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.moveTo(128, 96)
    ctx.arc(128, 96, 88, -1.2, -0.6)
    ctx.fill()
    ctx.fillStyle = '#7dffc4'
    for (const [x, y] of [[170, 60], [96, 130], [150, 140]]) ctx.fillRect(x, y, 5, 4)
  } else {
    ctx.font = 'bold 20px "Courier New", monospace'
    ctx.fillStyle = '#6ff0b8'
    ctx.fillText('DEPTH', 14, 30)
    ctx.fillText('TRIM', 14, 104)
    ctx.fillText('HDG', 150, 30)
    for (let i = 0; i < 6; i++) ctx.fillRect(16, 44 + i * 9, 40 + ((i * 37) % 60), 4)
    ctx.strokeRect(14, 116, 100, 18)
    ctx.fillRect(60, 118, 30, 14)
    ctx.strokeRect(150, 44, 90, 60)
    for (let x = 156; x < 236; x += 12) ctx.fillRect(x, 92, 2, 10)
    ctx.fillStyle = '#f0b040'
    ctx.fillRect(150, 150, 90, 16)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

// "NEREID · FOUNDATION MARINE" stencilled on the hull, worn.
function hullDecal() {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 108
  const ctx = c.getContext('2d')
  ctx.fillStyle = 'rgba(30, 32, 30, 0.85)'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = 'bold 50px "Courier New", monospace'
  ctx.fillText('NEREID', 256, 36)
  ctx.font = 'bold 26px "Courier New", monospace'
  ctx.fillText('FOUNDATION MARINE · SL-2', 256, 82)
  ctx.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.8})`
    ctx.fillRect(Math.random() * 512, Math.random() * 108, Math.random() * 14, Math.random() * 4)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}
