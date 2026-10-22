// The ship model (ENGINEERING.md §5 "Ships", R7 §4.4, ported from R7's
// ship_dyn.py): m·dV/dt = Tmax·(u − (V/Vmax)²) with the telegraph ordering a
// speed (u = (Vordered/Vmax)², back full at 60 % of the thrust), the physical
// constants from displacement and shaft horsepower; a persistent helm, the
// rudder moving at rudderS from hard over to hard over, and the yaw rate
// following Nomoto's first-order model, T·dr/dt + r = K·δ, with K set so
// full rudder gives the steady radius 0.45 × the tactical diameter and
// T ≈ 3L/V; speed lost in a hard turn as drag ∝ r².

import { P } from './params.js'
import { DEG } from './units.js'

const S = P.ship
const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
// the extra drag in a turn that loses `turnSpeedLoss` of the steady speed at full rudder
const TURN_DRAG = 1 / ((1 - S.turnSpeedLoss) * (1 - S.turnSpeedLoss)) - 1

export function createShipBody(model, { x = 0, z = 0, heading = 0, V = 0 } = {}) {
  return { x, z, heading, V, r: 0, rudder: 0, helm: 0, telegraph: V / model.vmax, ordered: V / model.vmax, aground: false }
}

/** The telegraph level (−1 full astern … 0 stop … 1 flank) as an ordered fraction of top speed. */
export const orderedOf = (tel) => (tel >= 0 ? tel * S.telegraphSteps[S.telegraphSteps.length - 1] : tel * -S.telegraphSteps[0])

/** And back: the telegraph level that orders a speed (m/s). */
export const telegraphFor = (model, v) => {
  const f = v / model.vmax
  return f >= 0 ? clamp(f / S.telegraphSteps[S.telegraphSteps.length - 1], 0, 1) : clamp(f / -S.telegraphSteps[0], -1, 0)
}

/**
 * One step. helm −1..1 (port..starboard), telegraph −1..1; cap: the damage
 * model's speed cap (fraction of top speed); jam: a jammed rudder angle (deg)
 * or null.
 */
export function stepShip(b, model, helm, telegraph, dt, cap = 1, jam = null) {
  b.helm = clamp(helm, -1, 1)
  b.telegraph = clamp(telegraph, -1, 1)
  // the rudder toward the order at its rate (70° from hard over to hard over in rudderS)
  const want = jam != null ? jam : b.helm * S.rudderMaxDeg
  const rate = (2 * S.rudderMaxDeg) / model.rudderS
  b.rudder += clamp(want - b.rudder, -rate * dt, rate * dt)
  // thrust from the ordered speed, within the damage model's cap
  let ord = orderedOf(b.telegraph)
  b.ordered = ord
  ord = clamp(ord, -cap * 0.6, cap * S.telegraphSteps[S.telegraphSteps.length - 1])
  const u = ord >= 0 ? ord * ord : -S.reverseThrust * (ord / 0.6) * (ord / 0.6)
  const v = b.V / model.vmax
  const rMax = (model.vmax / model.radius) / DEG
  const turn = 1 + TURN_DRAG * clamp(Math.abs(b.r) / rMax, 0, 1.2) ** 2
  const drag = v * Math.abs(v) * turn
  b.V += ((model.tmax * (u - drag)) / model.mass) * dt
  if (b.aground) b.V *= Math.max(0, 1 - dt * 0.5)
  // Nomoto: the steady rate at full rudder is V / R
  const V = Math.abs(b.V)
  const T = (S.nomotoTK * model.L) / Math.max(V, 1)
  const rSteady = ((b.V / model.radius) * (b.rudder / S.rudderMaxDeg)) / DEG
  b.r += ((rSteady - b.r) / T) * dt
  b.heading = (((b.heading + b.r * dt) % 360) + 360) % 360
  const h = b.heading * DEG
  b.x += b.V * Math.sin(h) * dt
  b.z -= b.V * Math.cos(h) * dt
}

/** A simple helmsman for the AI: the helm and telegraph that steer to a heading and a speed. */
export function helmsman(b, model, wantHeading, wantV) {
  const err = ((((wantHeading - b.heading) % 360) + 540) % 360) - 180
  // lead the turn by the yaw rate's lag
  const lead = b.r * ((S.nomotoTK * model.L) / Math.max(Math.abs(b.V), 1)) * 1.2
  const helm = clamp((err - lead) / 20, -1, 1)
  return { helm, telegraph: telegraphFor(model, wantV) }
}
