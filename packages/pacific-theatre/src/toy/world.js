// The toy's world (TOY.md §5): a kinematic arcade arena, its own loop and
// rules, nothing of the record's or the arena's sims. Plain objects for the
// things in it (the player, the carrier, the enemies, the shots) and, written
// once a step, the typed arrays the box's renderers read (UnitRenderer and
// EffectsRenderer take any object with this surface: kits, capacityByKit,
// capacity, slots, state, _X, projectiles, wind, player). No DOM: the smoke
// test and a node script can step it without a browser.
//
// Frame: metres about the arena's centre, x east, z south, y up; a heading
// (yaw) of 0 points north (−z) and grows clockwise. The state's positions add
// the centre, so the box's ground and sea sit under it where they belong.

import * as THREE from 'three'
import { ROLES } from './sides.js'

export const ARENA = {
  radius: 620, // the edge turns you round (TOY.md §2: the action within a kilometre)
  floor: 14, // the sea bounces you back up from here
  ceiling: 240,
  speed: 60, // m/s, always (no throttle, no stall)
  yawRate: 1.55, // rad/s at full stick
  pitchMax: 0.55, // rad, the nose at full stick up or down
}

const TAU = Math.PI * 2
export const wrapPi = (a) => a - TAU * Math.floor((a + Math.PI) / TAU)
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const _q = new THREE.Quaternion()
const _e = new THREE.Euler()

/** A small seeded random (the smoke test's games repeat). */
export function rng(seed = 1) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return (s >>> 0) / 4294967296
  }
}

export class World {
  /**
   * side: SIDES[code]; kits: id → kit (the record's JSON); opts: { centre:
   * { x, z } (box metres), seed, models: id → { L, B, deck, turrets } }.
   */
  constructor(side, kits, { centre = { x: 0, z: 0 }, seed = 1, models = {} } = {}) {
    this.side = side
    this.centre = centre
    this.random = rng(seed)
    this.t = 0
    this.events = [] // drained by the scene each frame: { type, ... }
    this.things = []
    this.modules = [] // (world, dt) once a step, in order
    // the renderers' surface
    this.kits = ROLES.map((r) => ({ id: side[r.role].kit, kind: r.kind, role: r.role, kit: kits[side[r.role].kit] || null }))
    this.capacityByKit = {}
    this.slotsByRole = {}
    this.slots = []
    let n = 0
    ROLES.forEach((r, k) => {
      this.capacityByKit[side[r.role].kit] = (this.capacityByKit[side[r.role].kit] || 0) + r.cap
      this.slotsByRole[r.role] = []
      for (let i = 0; i < r.cap; i++) {
        this.slotsByRole[r.role].push(n)
        this.slots.push({ kind: r.kind, role: r.role, kitIndex: k, thing: null })
        n++
      }
    })
    this.capacity = n
    this.state = {
      alive: new Uint8Array(n),
      kitIndex: new Int16Array(n),
      pos: new Float64Array(3 * n),
      quat: new Float32Array(4 * n),
      fire: new Float32Array(n),
      heading: new Float32Array(n),
      speed: new Float32Array(n),
    }
    for (let i = 0; i < n; i++) this.state.kitIndex[i] = this.slots[i].kitIndex
    this._X = this.slots.map((s) => ({ model: models[side[s.role].kit] || { L: 100, B: 12, deck: 8 }, guns: null }))
    this.models = models
    const P = 512
    this.projectiles = { capacity: P, alive: new Uint8Array(P), kind: new Uint8Array(P), pos: new Float64Array(3 * P), vel: new Float32Array(3 * P) }
    this.shots = []
    this.wind = { x: -1.5, z: 1 }
    this.player = { kind: 'aircraft', unitIndex: 0, lost: false }
    this.input = { sx: 0, sy: 0, fire: false, drop: 0 }
    this.over = null
    this.stats = { firstSight: null, firstHit: null, firstExplosion: null, longestGap: 0, gapFrom: 0, inSight: false }
  }

  /** Put a thing in a free slot of its role (or null when the role is full). */
  spawn(role, props) {
    const slot = this.slotsByRole[role].find((i) => !this.slots[i].thing)
    if (slot === undefined) return null
    const th = { role, kind: this.slots[slot].kind, slot, model: this._X[slot].model, x: 0, y: 0, z: 0, yaw: 0, pitch: 0, roll: 0, v: 0, hp: 1, hpMax: 1, alive: 1, born: this.t, ...props }
    this.slots[slot].thing = th
    this.things.push(th)
    return th
  }

  /** Take a thing out of the arena (its slot is free again). */
  remove(th) {
    th.alive = 0
    if (this.slots[th.slot].thing === th) this.slots[th.slot].thing = null
    const i = this.things.indexOf(th)
    if (i >= 0) this.things.splice(i, 1)
  }

  emit(type, data) {
    this.events.push({ type, t: this.t, ...data })
  }

  /** The things of a role that still count (alive 1). */
  live(role) {
    return this.things.filter((th) => th.role === role && th.alive === 1)
  }

  step(dt) {
    if (this.over) return
    this.t += dt
    for (const m of this.modules) m(this, dt)
    this.writeState()
  }

  /** The typed arrays from the things, once a step. */
  writeState() {
    const s = this.state
    s.alive.fill(0)
    const cx = this.centre.x
    const cz = this.centre.z
    for (const th of this.things) {
      const i = th.slot
      s.alive[i] = th.alive
      s.pos[3 * i] = th.x + cx
      s.pos[3 * i + 1] = th.y
      s.pos[3 * i + 2] = th.z + cz
      _q.setFromEuler(_e.set(th.pitch, -th.yaw, -th.roll, 'YXZ'))
      s.quat[4 * i] = _q.x
      s.quat[4 * i + 1] = _q.y
      s.quat[4 * i + 2] = _q.z
      s.quat[4 * i + 3] = _q.w
      s.heading[i] = (th.yaw * 180) / Math.PI
      s.speed[i] = th.v
      s.fire[i] = th.fire || 0
      this._X[i].guns = th.guns || null
    }
    const P = this.projectiles
    P.alive.fill(0)
    let k = 0
    for (const p of this.shots) {
      if (k >= P.capacity) break
      P.alive[k] = 1
      P.kind[k] = p.look
      P.pos[3 * k] = p.x + cx
      P.pos[3 * k + 1] = p.y
      P.pos[3 * k + 2] = p.z + cz
      P.vel[3 * k] = p.vx
      P.vel[3 * k + 1] = p.vy
      P.vel[3 * k + 2] = p.vz
      k++
    }
  }
}

/** The unit vector a thing flies along. */
export function forward(th, out = { x: 0, y: 0, z: 0 }) {
  const c = Math.cos(th.pitch)
  out.x = Math.sin(th.yaw) * c
  out.y = Math.sin(th.pitch)
  out.z = -Math.cos(th.yaw) * c
  return out
}

/** The heading from a to b (0 north, clockwise). */
export const bearingTo = (a, b) => Math.atan2(b.x - a.x, -(b.z - a.z))

/**
 * One-stick flight (TOY.md §2): always forward at one speed; the stick's x
 * turns (the wings bank with it and level when it is let go), its y sets the
 * nose up or down; the sea bounces the aircraft back up, the ceiling presses
 * it down, and past the arena's edge it turns itself back toward the middle.
 */
export function fly(world, th, sx, sy, dt, { speed = ARENA.speed, yawRate = ARENA.yawRate, auto = true } = {}) {
  let turn = clamp(sx, -1, 1)
  let pitchWant = clamp(sy, -1, 1) * ARENA.pitchMax
  const r = Math.hypot(th.x, th.z)
  th.edge = false
  if (auto && r > ARENA.radius) {
    // the edge: a firm turn toward the middle until the nose points back in
    const home = Math.atan2(-th.x, th.z)
    const d = wrapPi(home - th.yaw)
    if (Math.abs(d) > 0.6) {
      turn = Math.sign(d)
      th.edge = true
    }
  }
  if (th.y < ARENA.floor + 4 && pitchWant < 0.1) pitchWant = Math.max(pitchWant, (ARENA.floor + 4 - th.y) * 0.05)
  if (th.y > ARENA.ceiling - 20) pitchWant = Math.min(pitchWant, -(th.y - ARENA.ceiling + 20) * 0.02)
  th.yaw = wrapPi(th.yaw + turn * yawRate * dt)
  th.pitch += (pitchWant - th.pitch) * (1 - Math.exp(-dt * 3.5))
  th.roll += (turn * 0.95 - th.roll) * (1 - Math.exp(-dt * 5))
  th.v = speed
  const c = Math.cos(th.pitch)
  th.x += Math.sin(th.yaw) * c * speed * dt
  th.z -= Math.cos(th.yaw) * c * speed * dt
  th.y += Math.sin(th.pitch) * speed * dt
  if (th.y < ARENA.floor) {
    // the sea bounces you back up (and says so with a splash)
    th.y = ARENA.floor
    if (th.pitch < 0.25) th.pitch = 0.32
    if (auto) world.emit('bounce', { x: th.x, z: th.z, who: th.role })
  }
  if (th.y > ARENA.ceiling) th.y = ARENA.ceiling
}

/** The carrier steams slowly round the arena's middle (a circle of 70 m at 3 m/s). */
export function steamCarrier(world, dt) {
  const c = world.carrier
  if (!c || c.alive !== 1) return
  c.phase += (3 / 70) * dt
  c.x = Math.cos(c.phase) * 70
  c.z = Math.sin(c.phase) * 70
  c.yaw = wrapPi(c.phase + Math.PI) // the tangent, clockwise
  c.v = 3
}
