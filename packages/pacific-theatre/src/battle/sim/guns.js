// Projectiles (ENGINEERING.md §5 "Shells", "Torpedoes"; R7 §4.3–4.4): the
// typed buffer of shells, bullets, bombs and torpedoes, and how each flies.
// Shells fly the drag model of ballistics.js at 60 Hz; bullets and bombs a
// light drag; torpedoes run straight at their setting's speed and arm after
// armRunM. Hits are oriented-box tests against the sim's colliders (the sim
// owns them; collide.js). AA rounds are effects only and never come here.

import { stepShell, atRange } from './ballistics.js'
import { DEG } from './units.js'

export const KIND = { shell: 0, bullet: 1, bomb: 2, torpedo: 3, burst: 4 }
export const FLAG = { visual: 1, player: 2, armed: 4, dud: 8, hit: 16, star: 32 }

export class Projectiles {
  constructor(cap) {
    this.capacity = cap
    this.pos = new Float64Array(3 * cap)
    this.vel = new Float32Array(3 * cap)
    this.kind = new Uint8Array(cap)
    this.calibreMm = new Float32Array(cap)
    this.alive = new Uint8Array(cap)
    this.owner = new Int16Array(cap).fill(-1)
    // the engine's own (not in the contract's list, which it extends)
    this.weapon = new Int16Array(cap).fill(-1) // index into sim.weaponList
    this.born = new Float64Array(cap)
    this.salvo = new Int32Array(cap)
    this.target = new Int16Array(cap).fill(-1)
    this.flags = new Uint8Array(cap)
    this.life = new Float32Array(cap) // torpedo: metres left to run; bullet: seconds; star shell: burn seconds
    this.aux = new Float32Array(cap) // bullet: damage share it carries; torpedo: distance run
    this.free = []
    for (let i = cap - 1; i >= 0; i--) this.free.push(i)
    this.count = 0
    this.dropped = 0
  }

  spawn(kind, x, y, z, vx, vy, vz, { calibreMm = 0, owner = -1, weapon = -1, t = 0, salvo = 0, target = -1, flags = 0, life = 0, aux = 0 } = {}) {
    const i = this.free.pop()
    if (i === undefined) {
      this.dropped++
      return -1
    }
    this.pos[3 * i] = x
    this.pos[3 * i + 1] = y
    this.pos[3 * i + 2] = z
    this.vel[3 * i] = vx
    this.vel[3 * i + 1] = vy
    this.vel[3 * i + 2] = vz
    this.kind[i] = kind
    this.calibreMm[i] = calibreMm
    this.alive[i] = 1
    this.owner[i] = owner
    this.weapon[i] = weapon
    this.born[i] = t
    this.salvo[i] = salvo
    this.target[i] = target
    this.flags[i] = flags
    this.life[i] = life
    this.aux[i] = aux
    this.count++
    return i
  }

  kill(i) {
    if (!this.alive[i]) return
    this.alive[i] = 0
    this.owner[i] = -1
    this.free.push(i)
    this.count--
  }

  clear() {
    for (let i = 0; i < this.capacity; i++) if (this.alive[i]) this.kill(i)
  }
}

const S = { x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0 }
/** Advance one shell by dt with the drag model; returns the previous position in prev[0..2]. */
export function flyShell(pr, i, shell, dt, prev) {
  const o = 3 * i
  S.x = pr.pos[o]
  S.y = pr.pos[o + 1]
  S.z = pr.pos[o + 2]
  S.vx = pr.vel[o]
  S.vy = pr.vel[o + 1]
  S.vz = pr.vel[o + 2]
  prev[0] = S.x
  prev[1] = S.y
  prev[2] = S.z
  stepShell(S, shell, dt)
  pr.pos[o] = S.x
  pr.pos[o + 1] = S.y
  pr.pos[o + 2] = S.z
  pr.vel[o] = S.vx
  pr.vel[o + 1] = S.vy
  pr.vel[o + 2] = S.vz
}

/** Bullets and bombs: gravity and a quadratic drag k (per metre). */
export function flyLight(pr, i, k, dt, prev) {
  const o = 3 * i
  prev[0] = pr.pos[o]
  prev[1] = pr.pos[o + 1]
  prev[2] = pr.pos[o + 2]
  const vx = pr.vel[o]
  const vy = pr.vel[o + 1]
  const vz = pr.vel[o + 2]
  const v = Math.hypot(vx, vy, vz)
  const d = k * v * dt
  pr.vel[o] = vx - vx * d
  pr.vel[o + 1] = vy - vy * d - 9.80665 * dt
  pr.vel[o + 2] = vz - vz * d
  pr.pos[o] += (vx + pr.vel[o]) * 0.5 * dt
  pr.pos[o + 1] += (vy + pr.vel[o + 1]) * 0.5 * dt
  pr.pos[o + 2] += (vz + pr.vel[o + 2]) * 0.5 * dt
}

/** A torpedo's straight run. */
export function runTorpedo(pr, i, dt, prev) {
  const o = 3 * i
  prev[0] = pr.pos[o]
  prev[1] = pr.pos[o + 1]
  prev[2] = pr.pos[o + 2]
  const vx = pr.vel[o]
  const vz = pr.vel[o + 2]
  pr.pos[o] += vx * dt
  pr.pos[o + 2] += vz * dt
  const d = Math.hypot(vx, vz) * dt
  pr.aux[i] += d
  pr.life[i] -= d
}

/** The light drag k for a bullet or a bomb. */
export const bulletK = (cal) => (cal >= 20 ? 6e-4 : cal >= 12 ? 4e-4 : 6e-4)
export const bombK = (massKg) => (massKg >= 400 ? 3e-5 : massKg >= 200 ? 4e-5 : 6e-5)

/**
 * The muzzle velocity vector of a gun laid at a compass bearing and an
 * elevation, plus the firing ship's own velocity.
 */
export function muzzle(mv, azDeg, elDeg, svx = 0, svz = 0) {
  const a = azDeg * DEG
  const e = elDeg * DEG
  const h = Math.cos(e) * mv
  return [Math.sin(a) * h + svx, Math.sin(e) * mv, -Math.cos(a) * h + svz]
}

/**
 * Lay a battery on a point: the bearing and the elevation from the firing
 * table, and the time of flight. Returns null beyond the table.
 */
export function layOn(table, fromX, fromZ, toX, toZ) {
  const dx = toX - fromX
  const dz = toZ - fromZ
  const R = Math.hypot(dx, dz)
  const row = atRange(table, R)
  if (!row) return null
  return { az: (Math.atan2(dx, -dz) / DEG + 360) % 360, el: row.elev, tof: row.tof, range: R, dRdE: row.dRdE, fall: row.fall }
}

/**
 * The AI's fire-control solution (ENGINEERING §5, R7 §4.7): an error that
 * starts at startRangePct of the range and startMils, improves by `improve`
 * with each salvo whose fall was seen to a floor, and loses half its
 * improvement when the target turns more than 20° or changes speed by more
 * than 5 knots; and an estimate of the target's course and speed that lags.
 */
export function createSolution(p) {
  return { rangePct: p.startRangePct, mils: p.startMils, vx: 0, vz: 0, init: false, lastHeading: null, lastSpeed: null, salvos: 0, corrected: 0 }
}

export function trackTarget(sol, vx, vz, dt, lagS) {
  if (!sol.init) {
    sol.vx = vx
    sol.vz = vz
    sol.init = true
    return
  }
  const k = Math.min(1, dt / lagS)
  sol.vx += (vx - sol.vx) * k
  sol.vz += (vz - sol.vz) * k
}

export function noteTargetManoeuvre(sol, p, heading, speedKn, t) {
  // measured from the course and speed the solution was last formed on
  if (sol.refHeading == null) {
    sol.refHeading = heading
    sol.refSpeed = speedKn
    return
  }
  const turn = Math.abs(((heading - sol.refHeading + 540) % 360) - 180)
  const dv = Math.abs(speedKn - sol.refSpeed)
  if (turn > p.resetTurnDeg || dv > p.resetSpeedKn) {
    sol.rangePct += (p.startRangePct - sol.rangePct) * p.resetShare
    sol.mils += (p.startMils - sol.mils) * p.resetShare
    sol.turnT = t
    sol.refHeading = heading
    sol.refSpeed = speedKn
  }
}

/** The error factor now: blind fire before any fall has been seen, and the track re-established after a manoeuvre. */
export function errorFactor(sol, p, t, canSpot) {
  let k = !canSpot && sol.corrected === 0 ? p.blindFactor : 1
  if (sol.turnT != null) k *= 1 + p.turnPenalty * Math.exp(-(t - sol.turnT) / p.leadLagS)
  return k
}

export function correct(sol, p) {
  sol.rangePct = Math.max(p.floorRangePct, sol.rangePct * (1 - p.improve))
  sol.mils = Math.max(p.floorMils, sol.mils * (1 - p.improve))
  sol.corrected++
}
