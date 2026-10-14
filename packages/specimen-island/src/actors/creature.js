import * as THREE from 'three'
import { SPECIES } from '../data/species.js'
import { Rng } from '../core/rng.js'
import { clamp, stepAngle, wrapAngle, yawTo, yawDirX, yawDirZ } from '../core/mathx.js'
import { createRig } from './rig.js'
import { Animator } from './animator.js'
import { Vitals } from './vitals.js'
import { Perception } from './perception.js'
import { Brain } from './brain.js'

// One live animal: composes rig + animator (looks), vitals (body), perception
// (senses) and brain (decisions), and owns locomotion — steering around trunks
// and walls, avoiding deep water and cliffs, standing on the ground.

const _v = new THREE.Vector3()

export class Creature {
  constructor(G, rec, herd) {
    this.G = G
    this.rec = rec
    this.herd = herd
    this.sp = SPECIES[rec.species]
    this.species = this.sp
    this.rng = new Rng(rec.seed)
    this.scale = rec.scale
    this.rig = createRig(this.sp, this.scale)
    this.mesh = this.rig.mesh
    this.mesh.rotation.order = 'YXZ'
    this.mesh.userData.creature = this
    this.radius = this.sp.radius * this.scale
    this.pos = new THREE.Vector3(rec.x, 0, rec.z)
    this.pos.y = G.physics.groundAt(rec.x, rec.z, G.island.heightAt(rec.x, rec.z) + 1)
    this.yaw = rec.yaw
    this.pitch = 0
    this.speed = 0
    this.targetSpeed = 0
    this.target = null
    this.faceYaw = null
    this.turnRate = 0
    this.intent = { graze: 0, alert: 0, roar: 0, attack: 0, crouch: 0, eat: 0, look: null }
    this.roaring = 0
    this.voiceCool = this.rng.range(0, 3)
    this.avoid = { yaw: 0, until: 0 }
    this.stuck = { t: 0, x: rec.x, z: rec.z, detour: 0, until: 0 }
    this.trampleCool = 0
    this.disposed = false

    this.vitals = new Vitals(this.sp, rec)
    this.anim = new Animator(this.rig, this.sp, this.rng)
    this.perception = new Perception(this, this.rng)
    this.perception.everDetected = !!rec.spotted
    this.brain = new Brain(this, this.rng)
    if (this.vitals.state === 'unconscious' || !this.vitals.alive) {
      this.anim.down = this.anim.s.down = 1
      this.anim.dead = !this.vitals.alive
      this.brain.set(this.vitals.alive ? 'down' : 'dead')
    }
    G.scene.add(this.mesh)
    this.syncMesh(0)
    this.hitsFresh = -1
  }

  // ------------------------------------------------------------ movement API
  goTo(x, z, speed) {
    this.target = { x, z }
    this.targetSpeed = speed
    this.faceYaw = null
  }
  halt() {
    this.target = null
    this.targetSpeed = 0
  }
  face(x, z) {
    this.faceYaw = yawTo(this.pos.x, this.pos.z, x, z)
  }
  // shove forward a little (lunges)
  nudge(tgt, amount) {
    const d = Math.hypot(tgt.x - this.pos.x, tgt.z - this.pos.z)
    if (d < this.radius + 0.8) return
    this.pos.x += yawDirX(this.yaw) * amount
    this.pos.z += yawDirZ(this.yaw) * amount
  }

  eyePos() {
    this.rig.bones.eyes.getWorldPosition(_v)
    return _v.clone()
  }
  center() {
    return new THREE.Vector3(this.pos.x, this.pos.y + this.sp.body.hipH * this.scale, this.pos.z)
  }

  vocalize(kind) {
    if (this.voiceCool > 0 && kind !== 'alarm' && kind !== 'attack') return
    this.voiceCool = this.rng.range(1.5, 3)
    if (kind === 'roar' || kind === 'threat' || kind === 'alarm') this.roaring = 1
    this.G.audio?.voice(this.sp, kind, this.eyePos())
  }

  // ------------------------------------------------------------ damage
  // A hit from the player's weapons (or another animal's teeth).
  takeHit(G, hit) {
    if (!this.vitals.alive) return
    const wasAlive = this.vitals.alive
    if (hit.dose) this.vitals.dose(hit.dose)
    if (hit.damage) {
      this.vitals.rec.health -= hit.damage
      if (this.vitals.rec.health <= 0) this.vitals.die(hit.cause || 'weapon')
    }
    if (hit.cause !== 'predation') {
      this.rec.hitByPlayer = true
      G.events.emit('creature:hit', { creature: this, zone: hit.zone, dose: hit.dose || 0, damage: hit.damage || 0, weapon: hit.weapon })
    }
    if (wasAlive && this.vitals.alive && this.vitals.conscious) this.brain.onHurt(G, hit.from || G.player.pos, !!hit.damage)
    this.flushVitals(G)
  }

  // A blow aimed at the player lands on whatever vehicle they are in — unless
  // it is a helicopter hovering out of reach.
  strikePlayer(G, damage, knock) {
    const v = G.vehicle
    if (v) {
      if (v.pos.y > this.pos.y + this.sp.body.hipH * this.scale * 2 + 1) return
      v.shove(this.pos, knock * 0.4)
      return v.damage(damage * v.tune.strikeMul, this.center())
    }
    G.player.damage(damage, this.pos, knock)
  }

  flushVitals(G) {
    for (const e of this.vitals.events.splice(0)) {
      if (e.type === 'ko') {
        G.events.emit('creature:ko', { creature: this })
        this.anim.down = 1
      } else if (e.type === 'woke') {
        G.events.emit('creature:woke', { creature: this })
        this.anim.down = 0
      } else if (e.type === 'died') {
        this.anim.down = 1
        this.anim.dead = true
        G.events.emit('creature:died', { creature: this, cause: e.cause })
      }
    }
  }

  // ------------------------------------------------------------ frame
  update(dt) {
    const G = this.G
    this.voiceCool -= dt
    this.roaring = Math.max(0, this.roaring - dt * 0.8)
    this.trampleCool -= dt
    this.vitals.update(dt)
    this.flushVitals(G)
    if (this.vitals.conscious) this.perception.update(dt, G)
    this.brain.update(dt, G)
    this.locomote(dt)
    this.applyIntent(dt)
    this.anim.update(dt)
    this.syncMesh(dt)
    // brachiosaurus feet and other accidents
    if (this.sp.attack?.kind === 'trample' && this.speed > 0.4 && this.trampleCool <= 0) {
      const p = G.player.pos
      const d = Math.hypot(p.x - this.pos.x, p.z - this.pos.z)
      if (d < this.radius * 1.3 && p.y < this.pos.y + 2) {
        this.trampleCool = this.sp.attack.cooldown
        this.strikePlayer(G, this.sp.attack.damage, 8)
      }
    }
    this.rec.x = this.pos.x
    this.rec.z = this.pos.z
    this.rec.yaw = this.yaw
  }

  locomote(dt) {
    const G = this.G
    const sp = this.sp
    const mul = this.vitals.speedMul
    let want = this.targetSpeed * mul
    let desiredYaw = this.yaw
    if (this.target) {
      const dx = this.target.x - this.pos.x
      const dz = this.target.z - this.pos.z
      const d = Math.hypot(dx, dz)
      if (d < 0.6) want = 0
      else {
        desiredYaw = yawTo(this.pos.x, this.pos.z, this.target.x, this.target.z)
        if (d < 3) want *= d / 3
      }
      // stuck? pick a detour for a moment
      this.stuck.t += dt
      if (this.stuck.t > 1.5) {
        const moved = Math.hypot(this.pos.x - this.stuck.x, this.pos.z - this.stuck.z)
        if (want > 0.5 && moved < 0.5) {
          this.stuck.detour = this.rng.sign() * this.rng.range(0.9, 1.6)
          this.stuck.until = G.time + this.rng.range(1, 2)
        }
        this.stuck.t = 0
        this.stuck.x = this.pos.x
        this.stuck.z = this.pos.z
      }
      if (G.time < this.stuck.until) desiredYaw += this.stuck.detour
      // feelers: steer around water, cliffs and obstacles ahead
      if (want > 0.3) desiredYaw = this.steer(desiredYaw, want)
    } else if (this.faceYaw != null) desiredYaw = this.faceYaw

    // turn, slower when fast and heavy
    const turnMax = sp.speed.turn * (want > 0.2 ? 1 : 1.3) * (0.6 + 0.4 * mul) * dt
    const prevYaw = this.yaw
    if (this.vitals.conscious) this.yaw = stepAngle(this.yaw, desiredYaw, turnMax)
    this.turnRate = wrapAngle(this.yaw - prevYaw) / Math.max(dt, 1e-4)
    // big turns cost speed
    const misalign = Math.abs(wrapAngle(desiredYaw - this.yaw))
    if (misalign > 1.2) want *= 0.35
    const accel = sp.mass > 2000 ? 3 : 7
    this.speed += clamp(want - this.speed, -accel * 1.6 * dt, accel * dt)
    if (!this.vitals.conscious) this.speed = 0
    const step = this.speed * dt
    if (step > 0) {
      this.pos.x += yawDirX(this.yaw) * step
      this.pos.z += yawDirZ(this.yaw) * step
    }
    // collisions with statics (big animals shoulder through slender trunks)
    const big = sp.mass > 2000
    G.physics.collideCircle(this.pos, this.radius, this.pos.y + 0.4, this.pos.y + sp.body.hipH * this.scale, big ? (c) => !(c.tag === 'tree' && c.r < 0.6) : null)
    // keep out of deep water
    const depth = G.island.depthAt(this.pos.x, this.pos.z)
    const wade = sp.body.hipH * this.scale * 0.8
    if (depth > wade) {
      this.pos.x -= yawDirX(this.yaw) * step * 1.2
      this.pos.z -= yawDirZ(this.yaw) * step * 1.2
    }
    // separation from other animals
    for (const o of G.ecology.active) {
      if (o === this) continue
      const dx = this.pos.x - o.pos.x
      const dz = this.pos.z - o.pos.z
      const m = this.radius + o.radius
      if (Math.abs(dx) > m || Math.abs(dz) > m) continue
      const d = Math.hypot(dx, dz)
      if (d < m && d > 1e-4) {
        const push = ((m - d) / d) * (o.sp.mass / (o.sp.mass + sp.mass))
        this.pos.x += dx * push
        this.pos.z += dz * push
      }
    }
    // ground and body pitch
    this.pos.y = G.physics.groundAt(this.pos.x, this.pos.z, this.pos.y + 1.2)
    const L = (sp.body.torsoLen + sp.body.pelvisLen) * this.scale * 0.5
    const fx = yawDirX(this.yaw) * L
    const fz = yawDirZ(this.yaw) * L
    const hf = G.island.heightAt(this.pos.x + fx, this.pos.z + fz)
    const hb = G.island.heightAt(this.pos.x - fx, this.pos.z - fz)
    const pitchT = this.vitals.conscious ? clamp(Math.atan2(hf - hb, 2 * L), -0.45, 0.45) : 0
    this.pitch += (pitchT - this.pitch) * Math.min(1, dt * 5)
  }

  steer(desired, speed) {
    const G = this.G
    if (G.time < this.avoid.until) return desired + this.avoid.yaw
    const look = this.radius * 1.5 + speed * 0.7
    const options = [0, 0.45, -0.45, 0.9, -0.9, 1.5, -1.5, 2.3, -2.3]
    for (const off of options) {
      const yaw = desired + off
      if (this.clearAt(yaw, look)) {
        if (off !== 0) this.avoid = { yaw: off, until: G.time + 0.6 }
        return yaw
      }
    }
    return desired
  }

  clearAt(yaw, dist) {
    const G = this.G
    const x = this.pos.x + yawDirX(yaw) * dist
    const z = this.pos.z + yawDirZ(yaw) * dist
    if (G.island.depthAt(x, z) > this.sp.body.hipH * this.scale * 0.7) return false
    const rise = G.island.heightAt(x, z) - this.pos.y
    if (Math.abs(rise) / dist > 1.1) return false
    const big = this.sp.mass > 2000
    const r = this.radius * 0.8
    for (const c of G.physics.nearby(x, z, r + 1)) {
      if (c.y1 < this.pos.y + 0.5 || c.y0 > this.pos.y + 2) continue
      if (big && c.tag === 'tree' && c.r < 0.6) continue
      if (c.type === 'cyl') {
        if (Math.hypot(x - c.x, z - c.z) < r + c.r) return false
      } else {
        const [lx, lz] = G.physics.toLocal(c, x, z)
        if (Math.abs(lx) < c.hx + r && Math.abs(lz) < c.hz + r) return false
      }
    }
    return true
  }

  applyIntent(dt) {
    const I = this.intent
    const a = this.anim
    a.speed = this.speed / this.scale
    a.turn = this.turnRate
    a.graze = I.graze
    a.alert = I.alert
    a.roar = Math.max(I.roar, this.roaring > 0.4 ? 1 : 0)
    a.attack = I.attack
    a.crouch = I.crouch
    a.eat = I.eat
    a.drowsy = this.vitals.state === 'drowsy' ? Math.min(1, (this.vitals.sedation - 0.35) * 2 + 0.3) : 0
    if (I.look && this.vitals.conscious) {
      const e = this.pos
      const ty = yawTo(e.x, e.z, I.look.x, I.look.z)
      const dy = (I.look.y ?? e.y) - (e.y + this.sp.body.hipH * this.scale)
      const dd = Math.hypot(I.look.x - e.x, I.look.z - e.z) || 1
      a.setLook(this.yaw, ty, -Math.atan2(dy, dd) * 0.6)
    } else {
      a.lookYaw = 0
      a.lookPitch = 0
    }
  }

  syncMesh() {
    const m = this.mesh
    m.position.copy(this.pos)
    m.rotation.set(-this.pitch, this.yaw + Math.PI, 0)
  }

  // World-space hit spheres, refreshed at most once per frame.
  updateHits() {
    const f = this.G.frame
    if (this.hitsFresh === f) return this.rig.hits
    this.hitsFresh = f
    this.mesh.updateMatrixWorld(true)
    for (const h of this.rig.hits) {
      h.world.copy(h.offset).applyMatrix4(h.boneObj.matrixWorld)
    }
    return this.rig.hits
  }

  // Ray vs this animal's hit spheres. Returns { t, zone, hit } or null.
  raycast(o, d, maxDist) {
    // broad phase against a sphere around the whole body
    const c = this.center()
    const R = (this.sp.body.torsoLen + this.sp.body.tail.len + this.sp.body.neck.len + this.sp.body.head.len) * this.scale
    const ocx = c.x - o.x
    const ocy = c.y - o.y
    const ocz = c.z - o.z
    const tca = ocx * d.x + ocy * d.y + ocz * d.z
    if (tca < -R) return null
    const d2 = ocx * ocx + ocy * ocy + ocz * ocz - tca * tca
    if (d2 > R * R) return null
    let best = null
    for (const h of this.updateHits()) {
      const lx = h.world.x - o.x
      const ly = h.world.y - o.y
      const lz = h.world.z - o.z
      const tc = lx * d.x + ly * d.y + lz * d.z
      if (tc < 0) continue
      const dd = lx * lx + ly * ly + lz * lz - tc * tc
      const r2 = h.rWorld * h.rWorld
      if (dd > r2) continue
      const t = tc - Math.sqrt(r2 - dd)
      if (t >= 0 && t <= maxDist && (!best || t < best.t)) best = { t, zone: h.zone, hit: h }
    }
    return best
  }

  dispose() {
    this.disposed = true
    this.G.scene.remove(this.mesh)
    this.mesh.skeleton.dispose()
  }
}
