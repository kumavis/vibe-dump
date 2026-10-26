// The arena's arcade models (ROUND-3.md §1 "Arcade handling", §3 "Physics").
// The player's units and the AI's fly and steam the same models.
//
// Aircraft: point-to-fly (an aim direction the nose follows, the mouse-aim of
// the record's controls) or a bank-and-pitch stick that levels itself when
// centred; no stall; the speed within half to all of the kit's top speed,
// following the throttle, a climb bleeding it and a dive adding it; turn,
// pitch and roll rates by class (the kit's sustained turn, quickened, within
// its class's band, so a Zero still out-turns a Wildcat); a floor over the
// sea and the land that looks ahead along the path.
//
// Ships: the record's ship model (sim/ship.js, by import) on an arcade copy
// of the kit's model: three times the turn rate (the steady radius a third),
// twice the acceleration (half the mass), the rudder and the yaw lag
// quicker. Pure JS, no three.js.

import { A } from './params.js'
import { eulerQuat } from '../sim/aircraft.js'
import { createShipBody, stepShip, helmsman } from '../sim/ship.js'

export const DEG = Math.PI / 180
export const G = 9.80665
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const wrapPi = (a) => {
  a = (a + Math.PI) % (2 * Math.PI)
  if (a < 0) a += 2 * Math.PI
  return a - Math.PI
}

/** An aircraft model's arcade numbers: the speed band and its rates by class (radians). */
export function airSpec(model) {
  const type = A.air.turnBand[model.type] ? model.type : 'fighter'
  const band = A.air.turnBand[type]
  const turnS = model.kit?.handling?.turnS ?? (type === 'fighter' ? 18 : 26)
  const vMax = model.vMax || 120
  return {
    type,
    vMax,
    vMin: vMax * A.air.band[0],
    vTop: vMax * A.air.band[1],
    turn: clamp((360 / turnS) * A.air.turnBoost, band[0], band[1]) * DEG,
    pitch: A.air.pitchDegS[type] * DEG,
    roll: A.air.rollDegS[type] * DEG,
    climb: A.air.climbDeg[type] * DEG,
    dive: A.air.diveDeg[type] * DEG,
    hp: type === 'fighter' ? A.air.hp.fighter : A.air.hp.other,
  }
}

/** A flying body: position, heading ψ (rad, compass), path angle γ, bank φ, speed. */
export function createAir(spec, { x = 0, y = 500, z = 0, heading = 0, V = null, gamma = 0, throttle = 0.8 } = {}) {
  const b = { x, y, z, V: V ?? spec.vMin + (spec.vTop - spec.vMin) * throttle, psi: heading * DEG, gamma, phi: 0, throttle, vx: 0, vy: 0, vz: 0, omega: 0, g: 1, floor: false }
  velocity(b)
  return b
}

function velocity(b) {
  const cg = Math.cos(b.gamma)
  b.vx = b.V * cg * Math.sin(b.psi)
  b.vy = b.V * Math.sin(b.gamma)
  b.vz = -b.V * cg * Math.cos(b.psi)
}

/**
 * One step of the arcade flight. cmd: { aim: [x, y, z] (a world direction) |
 * null, roll, pitch (−1..1, the stick), throttle (0..1), maxDive (rad,
 * optional: a dive bomber's dive may pass its class's limit) }. groundAt(x, z):
 * metres of the ground (negative at sea). Returns the body.
 */
export function stepAir(b, s, cmd, dt, groundAt) {
  const dive = cmd.maxDive ?? s.dive
  if (cmd.aim) {
    const [ax, ay, az] = cmd.aim
    const h = Math.hypot(ax, az)
    const want = Math.atan2(ax, -az)
    const e = h > 1e-6 ? wrapPi(want - b.psi) : 0
    const omegaWant = clamp(e * 2.4, -s.turn, s.turn)
    const phiWant = clamp(Math.atan((omegaWant * Math.max(b.V, 20)) / G), -A.air.bankMaxDeg * DEG, A.air.bankMaxDeg * DEG)
    b.phi += clamp(phiWant - b.phi, -s.roll * dt, s.roll * dt)
    const gWant = clamp(Math.atan2(ay, Math.max(1e-6, h)), -dive, s.climb)
    b.gamma += clamp((gWant - b.gamma) * 3, -s.pitch, s.pitch) * dt
  } else {
    // the stick: the bank it asks (released, the wings level), the path angle it turns (released, toward level)
    const roll = clamp(cmd.roll || 0, -1, 1)
    const pitch = clamp(cmd.pitch || 0, -1, 1)
    const phiWant = Math.abs(roll) > 0.04 ? roll * 70 * DEG : 0
    const k = Math.abs(roll) > 0.04 ? s.roll * dt : (Math.abs(b.phi) * dt) / A.air.levelS + 0.2 * dt
    b.phi += clamp(phiWant - b.phi, -k, k)
    if (Math.abs(pitch) > 0.04) b.gamma += pitch * s.pitch * dt
    else b.gamma -= b.gamma * Math.min(1, dt / A.air.holdS)
    b.gamma = clamp(b.gamma, -dive, s.climb)
  }
  // the turn the bank makes, within the class's rate
  b.omega = clamp((G * Math.tan(b.phi)) / Math.max(b.V, 20), -s.turn, s.turn)
  b.psi = wrapPi(b.psi + b.omega * dt)
  // the floor: look ahead along the path; never below it
  const T = A.air.floorLookS
  const cg = Math.cos(b.gamma)
  const ax = b.x + b.V * cg * Math.sin(b.psi) * T
  const az = b.z - b.V * cg * Math.cos(b.psi) * T
  const g0 = groundAt(b.x, b.z)
  const g1 = groundAt(ax, az)
  const fl = (m) => Math.max(0, m) + (m > 0 ? A.air.floorLandM : A.air.floorSeaM)
  const floor = Math.max(fl(g0), fl(g1))
  b.floor = false
  if (b.y + Math.sin(b.gamma) * b.V * T < floor) {
    const need = Math.atan2(floor - b.y, b.V * T)
    if (b.gamma < need) {
      b.gamma += clamp(need - b.gamma, 0, s.pitch * 1.5 * dt)
      b.floor = true
    }
  }
  // the speed: the throttle's within the band, a climb bleeding it, a dive adding it
  const vt = s.vMin + (s.vTop - s.vMin) * clamp(cmd.throttle ?? b.throttle, 0, 1)
  b.throttle = clamp(cmd.throttle ?? b.throttle, 0, 1)
  b.V += ((vt - b.V) / A.air.speedTauS - A.air.gravityK * G * Math.sin(b.gamma)) * dt
  b.V = clamp(b.V, s.vMin, s.vTop)
  velocity(b)
  b.x += b.vx * dt
  b.y += b.vy * dt
  b.z += b.vz * dt
  const hard = fl(groundAt(b.x, b.z)) - (g0 > 0 ? A.air.floorLandM - 8 : A.air.floorSeaM - 6)
  if (b.y < hard) {
    b.y = hard
    if (b.gamma < 0) b.gamma = 0
    b.floor = true
  }
  b.g = Math.sqrt(1 + ((b.V * b.omega) / G) ** 2)
  return b
}

/** The body's attitude as a quaternion (the record's convention: the nose −z). */
export const airQuatOf = (b, out, o) => eulerQuat(-b.psi, b.gamma, -b.phi, out, o)

/** An aircraft's falling body: the nose down, a slow roll, no floor until the sea. */
export function stepFall(b, dt) {
  b.gamma = Math.max(-1.2, b.gamma - 0.6 * dt)
  b.phi += 1.4 * dt
  b.V = Math.min(b.V + 4 * dt, 160)
  velocity(b)
  b.x += b.vx * dt
  b.y += b.vy * dt
  b.z += b.vz * dt
}

// --- ships -----------------------------------------------------------------------------------------------

/** The arcade copy of a ship model the record's ship.js steps: three times the turn rate, twice the acceleration. */
export function shipSpec(model) {
  const s = Object.create(model)
  s.radius = model.radius / A.ship.turnK
  s.mass = model.mass / A.ship.accelK
  s.rudderS = model.rudderS / A.ship.rudderK
  s.L = model.L / A.ship.nomotoK // (ship.js reads L for the yaw lag only: T = 3L/V)
  return s
}

export const createShip = (model, opts) => createShipBody(model, opts)

/** One step of a ship: helm −1..1, telegraph −1..1, cap the damage's speed cap (fraction of top speed). */
export function stepShipArcade(b, spec, helm, telegraph, dt, cap = 1) {
  stepShip(b, spec, helm, telegraph, dt, cap)
  return b
}

/**
 * The helm and telegraph that steer a ship to a heading (deg) and a speed
 * (m/s): the record's helmsman's rule (the turn led by the yaw lag) with a
 * quicker hand, for the quicker arcade ship.
 */
export function steer(b, spec, heading, V) {
  const err = ((((heading - b.heading) % 360) + 540) % 360) - 180
  const T = (3 * spec.L) / Math.max(Math.abs(b.V), 1)
  const helm = clamp((err - b.r * T * 0.9) / 10, -1, 1)
  return { helm, telegraph: helmsman(b, spec, heading, V).telegraph }
}
