import * as THREE from 'three'
import { clamp, damp, lerp } from '../core/mathx.js'

// First-person body: walking, sprinting, crouching (the stealth stance),
// swimming, footsteps that make noise, taking damage. The camera rides the eye.

const STAND = 1.75
const CROUCH = 1.05
const RADIUS = 0.35
const STEP = 0.55

export class Player {
  constructor(G) {
    this.G = G
    this.pos = new THREE.Vector3()
    this.vel = new THREE.Vector3()
    this.yaw = 0
    this.pitch = 0
    this.height = STAND
    this.crouching = false
    this.onGround = true
    this.swimming = false
    this.wading = 0
    this.stamina = 1
    this.health = 100
    this.alive = true
    this.flashlight = false
    this.blindT = 0
    this.lastHurt = -99
    this.hurtDir = 0
    this.bob = 0
    this.stepAcc = 0
    this.shake = 0
    this.fade = 0
    this.recoil = 0
    this.frozen = false
    this.eye = new THREE.Vector3()
    this.look = new THREE.Vector3(0, 0, -1)
    this._fall = 0

    this.light = new THREE.SpotLight(0xfff2d8, 0, 60, 0.5, 0.45, 1.2)
    this.light.position.set(0.25, -0.2, 0)
    this.light.target.position.set(0.1, -0.1, -5)
    G.camera.add(this.light)
    G.camera.add(this.light.target)
  }

  teleport(pos, yaw = null, fade = 0) {
    this.pos.copy(pos)
    this.vel.set(0, 0, 0)
    if (yaw != null) this.yaw = yaw
    this.fade = fade
    this.onGround = true
  }

  damage(amount, from, knock = 0) {
    if (!this.alive || this.G.godMode) return
    this.health -= amount
    this.lastHurt = this.G.time
    this.shake = Math.min(1, this.shake + amount / 30)
    if (from) {
      const dx = this.pos.x - from.x
      const dz = this.pos.z - from.z
      const d = Math.hypot(dx, dz) || 1
      this.vel.x += (dx / d) * knock
      this.vel.z += (dz / d) * knock
      this.vel.y += knock * 0.25
      this.hurtDir = Math.atan2(-(from.x - this.pos.x), -(from.z - this.pos.z)) - this.yaw
    }
    this.G.events.emit('player:damaged', { amount, from })
    this.G.audio?.play('hurt')
    if (this.health <= 0) {
      this.health = 0
      this.alive = false
      this.G.events.emit('player:died', {})
    }
  }

  heal(n) {
    this.health = Math.min(100, this.health + n)
  }

  blind(seconds) {
    this.blindT = Math.max(this.blindT, seconds)
    this.damage(4, null)
  }

  revive(pos, yaw) {
    this.alive = true
    this.health = 70
    this.blindT = 0
    this.teleport(pos, yaw, 1.2)
  }

  // What the feet are on, for the footstep sound: a deck's material, else the
  // island's own grids — shallow water, road gravel, undergrowth, grass, sand.
  // On a deck it also sets `footTune`, a 0–1 hashed from where that deck
  // stands, so one pier or bench keeps one pitch step after step.
  surface() {
    const isl = this.G.island
    const { x, z } = this.pos
    this.footTune = undefined
    if (this.swimming) return 'swim'
    if (this.wading > 0.1) return 'water'
    const under = this.G.physics.groundInfo(x, z, this.pos.y + 0.1)
    // decks without a material are the old wooden kind (bridges, crates)
    if (under.collider && this.pos.y - under.y < 0.2) {
      const c = under.collider
      const h = Math.sin(c.x * 12.9898 + c.z * 78.233) * 43758.5453
      this.footTune = h - Math.floor(h)
      return c.material || 'wood'
    }
    if (isl.sample(isl.road, x, z) > 0.5) return 'gravel'
    const cover = isl.coverAt(x, z)
    if (cover > 0.45) return 'brush'
    if (isl.sample(isl.w.rock, x, z) > 0.5) return 'rock'
    if (isl.sample(isl.w.beach, x, z) > 0.5) return 'sand'
    if (cover > 0.12) return 'grass'
    return 'dirt'
  }

  update(dt, input) {
    const G = this.G
    const isl = G.island
    this.blindT = Math.max(0, this.blindT - dt)
    this.fade = Math.max(0, this.fade - dt)
    this.shake = Math.max(0, this.shake - dt * 2)
    this.recoil = damp(this.recoil, 0, 9, dt)
    if (this.alive && G.time - this.lastHurt > 9) this.heal(dt * 2.5)

    const look = input.look()
    this.lastLook = look
    if (this.alive && !this.frozen) {
      const z = G.weapons ? G.weapons.zoomFactor() : 1
      this.yaw -= look.dx / z
      this.pitch = clamp(this.pitch - look.dy / z, -1.45, 1.45)
    }

    if (this.alive && !this.frozen) {
      if (input.pressed('crouch')) this.crouching = !this.crouching
      if (input.pressed('flashlight')) {
        this.flashlight = !this.flashlight
        G.audio?.play('click')
      }
    }
    // stand up only if there is headroom
    if (!this.crouching) {
      const ceil = G.physics.ceilingAt(this.pos.x, this.pos.z, this.pos.y + CROUCH)
      if (ceil < this.pos.y + STAND + 0.05) this.crouching = true
    }
    this.height = damp(this.height, this.crouching ? CROUCH : STAND, 10, dt)

    // ---- desired horizontal velocity
    let fx = 0
    let fz = 0
    if (this.alive && !this.frozen) {
      fz = input.axis('back', 'forward')
      fx = input.axis('left', 'right')
    }
    const len = Math.hypot(fx, fz)
    if (len > 1) {
      fx /= len
      fz /= len
    }
    const sprinting = this.alive && input.down('sprint') && fz > 0.1 && !this.crouching && this.stamina > 0.05 && !this.swimming
    const aiming = G.weapons && G.weapons.aim > 0.5
    let speed = this.crouching ? 1.9 : sprinting ? 7.2 : 4.2
    if (aiming) speed *= 0.6
    if (this.swimming) speed = 2.3
    else if (this.wading > 0.35) speed *= 0.65
    this.stamina = clamp(this.stamina + (sprinting && len > 0 ? -dt / 7 : dt / 5), 0, 1)
    const sin = Math.sin(this.yaw)
    const cos = Math.cos(this.yaw)
    // forward is -Z rotated by yaw
    const wx = (-sin * fz + cos * fx) * speed
    const wz = (-cos * fz - sin * fx) * speed
    const accel = this.onGround || this.swimming ? 40 : 5
    this.vel.x += clamp(wx - this.vel.x, -accel * dt, accel * dt)
    this.vel.z += clamp(wz - this.vel.z, -accel * dt, accel * dt)

    // ---- vertical
    const water = isl.waterAt(this.pos.x, this.pos.z)
    const ground = G.physics.groundAt(this.pos.x, this.pos.z, this.pos.y + STEP)
    const depth = water - ground
    this.wading = clamp(depth / 1.3, 0, 1)
    const deep = depth > 1.35
    if (deep && this.pos.y < water - 1.2) {
      if (!this.swimming) G.audio?.play('splash', { pos: this.pos })
      this.swimming = true
    } else if (!deep || this.pos.y > water - 0.8) this.swimming = false
    if (this.swimming) {
      const targetY = water - 1.45
      this.vel.y = damp(this.vel.y, (targetY - this.pos.y) * 3, 4, dt)
      if (this.alive && input.down('jump')) this.vel.y = 1.5
    } else {
      this.vel.y -= 22 * dt
      if (this.onGround && this.alive && !this.frozen && input.pressed('jump') && !this.crouching) {
        this.vel.y = 6.2
        this.onGround = false
        G.audio?.play('jump')
      }
    }

    // ---- integrate + collide
    const prevY = this.pos.y
    this.pos.x += this.vel.x * dt
    this.pos.z += this.vel.z * dt
    G.physics.collideCircle(this.pos, RADIUS, this.pos.y + STEP * 0.8, this.pos.y + this.height)
    this.pos.x = clamp(this.pos.x, -isl.half + 20, isl.half - 20)
    this.pos.z = clamp(this.pos.z, -isl.half + 20, isl.half - 20)
    this.pos.y += this.vel.y * dt
    const ceil = G.physics.ceilingAt(this.pos.x, this.pos.z, prevY + this.height - 0.05)
    if (this.pos.y + this.height > ceil) {
      this.pos.y = ceil - this.height
      if (this.vel.y > 0) this.vel.y = 0
    }
    const g = G.physics.groundAt(this.pos.x, this.pos.z, Math.max(this.pos.y, prevY) + STEP)
    const wasGround = this.onGround
    if (this.pos.y <= g + 0.02 || (wasGround && this.vel.y <= 0 && this.pos.y - g < 0.6 && !this.swimming)) {
      if (!wasGround && this._fall < -13) this.damage(Math.round((-this._fall - 13) * 6), null)
      if (!wasGround && this._fall < -4) {
        G.audio?.play('land', { pos: this.pos })
        G.events.emit('noise', { x: this.pos.x, y: this.pos.y, z: this.pos.z, radius: this.crouching ? 4 : 12, source: 'player', kind: 'step' })
      }
      this.pos.y = g
      if (this.vel.y < 0) this.vel.y = 0
      this.onGround = true
    } else {
      this.onGround = this.swimming
    }
    this._fall = this.vel.y

    // ---- footsteps: noise for the animals, sound for you
    const hs = Math.hypot(this.vel.x, this.vel.z)
    if ((this.onGround || this.swimming) && hs > 0.5) {
      // the noise bus keeps its own short stride: stealth is balanced on how
      // often animals hear you, not on what a step sounds like
      this.stepAcc += hs * dt
      const stride = sprinting ? 1.05 : this.crouching ? 0.6 : 0.8
      if (this.stepAcc > stride) {
        this.stepAcc = 0
        const cover = isl.coverAt(this.pos.x, this.pos.z)
        let r = this.crouching ? 2.5 : sprinting ? 22 : 9
        if (!this.crouching && cover > 0.45) r *= 1.35 // crashing through undergrowth
        if (this.wading > 0.2 || this.swimming) r = Math.max(r, 14)
        G.events.emit('noise', { x: this.pos.x, y: this.pos.y, z: this.pos.z, radius: r, source: 'player', kind: 'step' })
      }
      // the step you hear lands with the head bob: a foot plants as the head
      // bottoms out (|cos bob| = 0 at bob = (k + 1/2) pi), on the side the head
      // sways to — about 2.5 steps a second walking, 3.7 sprinting
      const was = Math.floor(this.bob / Math.PI + 0.5)
      this.bob += hs * dt * (sprinting ? 1.6 : 1.9)
      if (Math.floor(this.bob / Math.PI + 0.5) !== was) {
        G.audio?.step(this.surface(), sprinting ? 1 : this.crouching ? 0.35 : 0.65, Math.sin(this.bob) > 0 ? 1 : -1, this.footTune)
      }
    } else this.bob = damp(this.bob, Math.round(this.bob / Math.PI) * Math.PI, 6, dt)
    G.veg?.setPush(this.pos.x, this.pos.z, 1.6, hs > 0.3 ? 1 : 0.4)

    // ---- camera
    const cam = G.camera
    const bobAmp = this.onGround ? clamp(hs / 7, 0, 1) * (this.crouching ? 0.5 : 1) : 0
    this.eye.set(this.pos.x, this.pos.y + this.height - 0.12, this.pos.z)
    const sx = (Math.random() - 0.5) * this.shake * 0.12
    const sy = (Math.random() - 0.5) * this.shake * 0.12
    cam.position.set(this.eye.x + Math.cos(this.yaw) * Math.sin(this.bob) * 0.035 * bobAmp + sx, this.eye.y + Math.abs(Math.cos(this.bob)) * 0.045 * bobAmp + sy, this.eye.z - Math.sin(this.yaw) * Math.sin(this.bob) * 0.035 * bobAmp)
    if (!this.alive) cam.position.y = lerp(cam.position.y, this.pos.y + 0.3, 0.5)
    cam.rotation.order = 'YXZ'
    cam.rotation.set(this.pitch + this.recoil, this.yaw, Math.sin(this.bob) * 0.006 * bobAmp + (this.alive ? 0 : 0.6))
    cam.updateMatrixWorld()
    this.look.set(0, 0, -1).applyQuaternion(cam.quaternion)
    this.light.intensity = this.flashlight ? 60 : 0
  }
}
