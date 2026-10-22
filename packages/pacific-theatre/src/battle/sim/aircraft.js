// The aircraft model (ENGINEERING.md §5 "Aircraft", R7 §4.2, ported from
// R7's aero.py): an energy-and-rates point mass in wind axes. Roll rate from
// the kit's table against true airspeed; pitch commands a load factor capped
// by lift, the G limit and the kit's turn limit; speed from thrust (power
// over speed, constant to the rated altitude, then falling with density)
// against the drag polar; a stall that drops the nose; a dive limit that
// shakes, stiffens and then breaks. The instructor turns a pointer direction
// into roll and load (mouse-aim, the default), never past 0.9 of the stall CL.

import { P } from './params.js'
import { rho, RHO0, G, DEG } from './units.js'

const A = P.air
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

/** Interpolate a [[speed, value], ...] table. */
export function tableAt(tab, v) {
  if (!tab?.length) return 0
  if (v <= tab[0][0]) return tab[0][1]
  for (let i = 0; i + 1 < tab.length; i++) {
    const [v0, r0] = tab[i]
    const [v1, r1] = tab[i + 1]
    if (v <= v1) return r0 + ((r1 - r0) * (v - v0)) / (v1 - v0)
  }
  return tab[tab.length - 1][1]
}

/** A flying body: position, wind-axis angles and the state the HUD reads. */
export function createAirBody(model, { x = 0, y = 1000, z = 0, V = null, heading = 0, gamma = 0, phi = 0, throttle = 0.8 } = {}) {
  return {
    x,
    y,
    z,
    V: V ?? model.vCruise,
    psi: heading * DEG,
    gamma,
    phi,
    p: 0,
    n: 1,
    alpha: 0,
    throttle,
    mass: model.mass,
    stalled: false,
    shake: 0,
    overS: 0,
    broken: false,
    brakes: false,
    gHold: 0,
    blackout: 0,
    fuelS: model.enduranceS,
    damage: 0,
    burning: 0,
    engineOut: false,
    crashed: false,
    ias: 0,
  }
}

/** Stall speed at 1 g at height h. */
export const stallSpeed = (b, model, h = b.y) => Math.sqrt((2 * b.mass * G) / (rho(h) * model.S * model.clMax))

/** The load factor the wing and the airframe allow at the body's speed (positive). */
export function nMaxAt(b, model) {
  const q = 0.5 * rho(b.y) * b.V * b.V
  const nLift = (q * model.S * model.clMax) / (b.mass * G)
  let n = Math.min(model.gLimit, nLift)
  if (model.turnLimit) n = Math.min(n, Math.sqrt(1 + ((model.turnLimit * b.V) / G) ** 2))
  return Math.max(1, n)
}

/**
 * One step. cmd: { n, p } (a load factor and a roll rate in rad/s, from the
 * instructor or the AI) or null to read input { pitch, roll, yaw, throttle }
 * as levels (pitch +1 pulls).
 */
export function stepAir(b, model, input, dt, cmd = null) {
  if (b.crashed) return
  const h = Math.max(0, b.y)
  const r = rho(h)
  const V = Math.max(1, b.V)
  const q = 0.5 * r * V * V
  b.ias = V * Math.sqrt(r / RHO0)
  const W = b.mass * G
  if (input?.throttle != null) b.throttle = clamp(input.throttle, 0, 1)
  // --- the stall ---------------------------------------------------------------
  const vs = stallSpeed(b, model, h)
  if (V < vs) b.stalled = true
  else if (b.stalled && V > A.stallRecover * vs) b.stalled = false
  // --- commands ------------------------------------------------------------------
  const nMax = nMaxAt(b, model)
  // above vBreak the controls stiffen to 30 % (R7 §4.2); above vShake the airframe only buffets
  const pMax = tableAt(model.rollTable, V) * DEG * (b.broken || b.ias > model.vBreak ? 0.3 : 1)
  let nCmd
  let pCmd
  if (cmd) {
    nCmd = clamp(cmd.n, -1, nMax)
    pCmd = clamp(cmd.p, -pMax, pMax)
  } else {
    const pitch = clamp(input?.pitch ?? 0, -1, 1)
    nCmd = pitch >= 0 ? 1 + pitch * (nMax - 1) : 1 + pitch * 2
    pCmd = clamp(input?.roll ?? 0, -1, 1) * pMax
  }
  if (b.stalled) pCmd *= A.stallRollAuthority
  // the roll rate follows the command with a short lag
  b.p += (pCmd - b.p) * Math.min(1, dt / A.rollLagS)
  b.phi += b.p * dt
  if (b.phi > Math.PI) b.phi -= 2 * Math.PI
  else if (b.phi < -Math.PI) b.phi += 2 * Math.PI
  // the lift the wing can give: CL ≤ CLmax
  const nLift = (q * model.S * model.clMax) / W
  let n = clamp(nCmd, -nLift * 0.6, nLift)
  b.n = n
  const CL = (n * W) / (q * model.S)
  b.alpha = CL / 4.6
  // --- forces ---------------------------------------------------------------------
  const ratedRho = rho(model.ratedAlt)
  const Pw = model.P0 * (h <= model.ratedAlt ? 1 : r / ratedRho) * (h > model.ceiling ? 0.3 : 1) * (b.engineOut ? 0 : 1)
  const T = (Pw * b.throttle) / Math.max(V, 30)
  b.brakes = model.diveDrag > 0 && (input?.brakes ?? b.gamma < -40 * DEG)
  const Dg = q * model.S * (model.cd0 + model.k * CL * CL + (b.brakes ? model.diveDrag : 0)) * (1 + b.damage * 0.5)
  const sg = Math.sin(b.gamma)
  const cg = Math.cos(b.gamma)
  b.V = Math.max(5, V + ((T - Dg) / b.mass - G * sg) * dt)
  if (b.stalled) {
    // the nose drops toward −20° at 30°/s
    const tgt = A.stallNoseDeg * DEG
    b.gamma += clamp(tgt - b.gamma, -A.stallNoseRateDegS * DEG * dt, A.stallNoseRateDegS * DEG * dt)
  } else {
    b.gamma += ((G / V) * (n * Math.cos(b.phi) - cg)) * dt
  }
  b.gamma = clamp(b.gamma, -Math.PI / 2 + 0.01, Math.PI / 2 - 0.01)
  b.psi += ((G / V) * n * Math.sin(b.phi)) / Math.max(0.1, Math.cos(b.gamma)) * dt
  if (input?.yaw) b.psi += input.yaw * 3 * DEG * dt
  b.psi = ((b.psi % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)
  // --- move -------------------------------------------------------------------------
  const ch = Math.cos(b.gamma) * b.V
  b.x += ch * Math.sin(b.psi) * dt
  b.z -= ch * Math.cos(b.psi) * dt
  b.y += b.V * Math.sin(b.gamma) * dt
  // --- the dive limit and the blackout --------------------------------------------
  b.shake = b.ias > model.vShake ? Math.min(1, (b.ias - model.vShake) / Math.max(1, model.vBreak - model.vShake)) : 0
  if (b.ias > model.vBreak) {
    b.overS += dt
    if (b.overS > A.breakAfterS) b.broken = true
  } else b.overS = Math.max(0, b.overS - dt)
  const bo = A.blackout
  if (n > bo.narrowG) b.gHold += dt
  else if (n < bo.backG) b.gHold = Math.max(0, b.gHold - dt / bo.backS * bo.darkS)
  b.blackout = n > bo.darkG && b.gHold > bo.darkS ? 1 : b.gHold > bo.narrowS ? 0.5 : Math.max(0, b.blackout - dt / bo.backS)
  b.fuelS -= dt * A.fuelFlowK * (0.6 + b.throttle * 0.7)
  if (b.fuelS <= 0) {
    b.fuelS = 0
    b.engineOut = true
  }
}

/** The body's forward, right and up unit vectors (world, y up). */
export function airFrame(b, out = { f: [0, 0, 0], r: [0, 0, 0], u: [0, 0, 0] }) {
  const sp = Math.sin(b.psi)
  const cp = Math.cos(b.psi)
  const sg = Math.sin(b.gamma)
  const cg = Math.cos(b.gamma)
  const f = out.f
  f[0] = sp * cg
  f[1] = sg
  f[2] = -cp * cg
  // level right and up for the heading and the path angle
  const r0 = [cp, 0, sp]
  const u0 = [r0[1] * f[2] - r0[2] * f[1], r0[2] * f[0] - r0[0] * f[2], r0[0] * f[1] - r0[1] * f[0]]
  const c = Math.cos(b.phi)
  const s = Math.sin(b.phi)
  for (let i = 0; i < 3; i++) {
    out.r[i] = r0[i] * c - u0[i] * s
    out.u[i] = u0[i] * c + r0[i] * s
  }
  return out
}

/** The body's orientation as a quaternion (x, y, z, w), the model's nose −z: Ry(−ψ)·Rx(γ + α)·Rz(−φ). */
export function airQuat(b, out, offset = 0) {
  return eulerQuat(-b.psi, b.gamma + b.alpha * 0.6, -b.phi, out, offset)
}

/** q = Ry(y)·Rx(x)·Rz(z) into out[offset..offset+3]. */
export function eulerQuat(y, x, z, out, o = 0) {
  const cy = Math.cos(y / 2)
  const sy = Math.sin(y / 2)
  const cx = Math.cos(x / 2)
  const sx = Math.sin(x / 2)
  const cz = Math.cos(z / 2)
  const sz = Math.sin(z / 2)
  // qy·qx
  const ax = cy * sx
  const ay = sy * cx
  const az = -sy * sx
  const aw = cy * cx
  // ·qz
  out[o] = ax * cz + ay * sz
  out[o + 1] = ay * cz - ax * sz
  out[o + 2] = aw * sz + az * cz
  out[o + 3] = aw * cz - az * sz
  return out
}

const FR = { f: [0, 0, 0], r: [0, 0, 0], u: [0, 0, 0] }
/**
 * The instructor (mouse-aim): roll to put the aim direction in the plane of
 * symmetry and pull to bring the nose onto it, within the roll and load
 * limits, never past 0.9 of the stall CL. aim: a world direction [x, y, z].
 * Returns { n, p } for stepAir.
 */
export function instructor(b, model, aim, { maxG = Infinity, gain = A.instructorGain } = {}) {
  const fr = airFrame(b, FR)
  const len = Math.hypot(aim[0], aim[1], aim[2]) || 1
  const d = [aim[0] / len, aim[1] / len, aim[2] / len]
  const df = d[0] * fr.f[0] + d[1] * fr.f[1] + d[2] * fr.f[2]
  const e = Math.acos(clamp(df, -1, 1))
  // the aim projected on the plane normal to the nose
  let px = d[0] - df * fr.f[0]
  let py = d[1] - df * fr.f[1]
  let pz = d[2] - df * fr.f[2]
  let pl = Math.hypot(px, py, pz)
  // close to the aim, level the wings toward the world's up instead
  const w = clamp(e / (6 * DEG), 0, 1)
  const ux = -fr.f[1] * fr.f[0]
  const uy = 1 - fr.f[1] * fr.f[1]
  const uz = -fr.f[1] * fr.f[2]
  const ul = Math.hypot(ux, uy, uz) || 1
  if (pl < 1e-6) {
    px = ux
    py = uy
    pz = uz
    pl = ul
  }
  const tx = (px / pl) * w + (ux / ul) * (1 - w)
  const ty = (py / pl) * w + (uy / ul) * (1 - w)
  const tz = (pz / pl) * w + (uz / ul) * (1 - w)
  const delta = Math.atan2(tx * fr.r[0] + ty * fr.r[1] + tz * fr.r[2], tx * fr.u[0] + ty * fr.u[1] + tz * fr.u[2])
  const pMax = tableAt(model.rollTable, b.V) * DEG
  const p = clamp(delta * 3, -1, 1) * pMax
  // the pull: hold the path (1 g's worth along the lift) plus the gain on the error where the lift points at the aim
  const q = 0.5 * rho(b.y) * b.V * b.V
  const nInst = Math.min(maxG, (A.maxCLFrac * q * model.S * model.clMax) / (b.mass * G), model.gLimit)
  const hold = Math.cos(b.gamma) * Math.cos(b.phi)
  const n = clamp(hold + gain * e * Math.max(0, Math.cos(delta)) * w + (1 - w) * gain * e * 0.5, -1, Math.max(1, nInst))
  return { n, p }
}
