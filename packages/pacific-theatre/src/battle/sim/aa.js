// The AA model (ENGINEERING.md §5 "AA", R7 §4.6, ported from R7's
// aa_calib.py): a Poisson hazard on each aircraft the AI is shooting at,
// λ = Σ λbarrel × barrels × f(range) × era × alert × aspect ÷ share, drawn as
// hit events at λ / pKill so the player sees smoke and a holed wing before
// the end. AA rounds are effects only, never projectiles.

import { P, eraKey } from './params.js'

/** R7's range fall-off: 1 inside 30 % of the effective range, linear to 0 at it. */
export function fRange(r, eff) {
  if (r >= eff) return 0
  const full = P.aa.fullWithin * eff
  return r <= full ? 1 : (eff - r) / (eff - full)
}

/** A ship's kill rate (per s) on one aircraft at range r, before era, alert, aspect and share. */
export function shipLambda(model, r, { bearing = P.aa.bearingShare, scale = 1 } = {}) {
  let l = 0
  for (const a of model.aa) if (r < a.rangeM) l += a.lambda * a.barrels * bearing * fRange(r, a.rangeM)
  return l * scale
}

/** The greatest effective range of a ship's AA. */
export const aaReach = (model) => model.aa.reduce((m, a) => Math.max(m, a.rangeM), 0)

/** The fitted era factor (R7 §4.6): 0.85 USN 1942, 0.6 IJN 1942, 0.5 at Pearl Harbor. */
export function eraFactor(side, year, { peacetime = false } = {}) {
  if (peacetime) return P.aa.era['us-1941']
  return P.aa.era[eraKey(side, year)] ?? 0.8
}

export const aspectOf = (mode) => P.aa.aspect[mode] ?? P.aa.aspect.crossing

/** The alertness ramp from the first sighting. */
export const alertAt = (t, tSighted) => (tSighted == null ? 0 : Math.max(0, Math.min(1, (t - tSighted) / P.aa.alertRampS)))

/**
 * One step of the hazard: 'kill' (the aircraft is lost), 'hit' (smoke, a dead
 * engine, a holed wing: damage short of fatal) or null.
 */
export function aaStep(lambda, dt, rng) {
  if (lambda <= 0) return null
  const pk = 1 / P.aa.hitsPerKill
  if (rng.next() < (lambda / pk) * dt) return rng.next() < pk ? 'kill' : 'hit'
  return null
}

/** The visible damage of a hit that did not bring the aircraft down, by the heaviest weapon in reach. */
export function hitDamage(model, r, rng) {
  let cls = 'light'
  for (const a of model.aa) if (r < a.rangeM && (a.cls === 'heavy' || (a.cls === 'medium' && cls === 'light'))) cls = a.cls
  return Math.min(0.75, P.aa.burstDamage[cls] * (0.4 + 0.4 * rng.next()))
}
