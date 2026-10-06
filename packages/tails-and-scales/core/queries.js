// Read-only questions about the match: who is alive, engaged, in cover, in
// sight; who holds an objective; who can still act. Each one that needs the
// match takes G first; the ones that read only their arguments (alive, dist,
// gap, mx/mz, eyeY/chestY) don't. None of them changes anything but the nav
// cache (movePlan and chargePlan refresh it, as they always have), and none
// draws a die.
//
// This module is also the query set the ?debug surface and the AI reach for:
// it re-exports the move, shoot, charge and deploy queries and the dice
// stream's fingerprint (rngState).
import { ENGAGE, AURA, OBJECTIVE_RANGE } from './rules.js'
import { hypot } from './dmath.js'
import { canShoot, shootTargets } from './actions/shoot.js'
import { canCharge, chargeTargets } from './actions/charge.js'

export { moveMode, forbidMask, movePlan, validEnd, nearestValid } from './actions/move.js'
export { canShoot, shotInfo, shootTargets } from './actions/shoot.js'
export { canCharge, chargeTargets, chargePlan } from './actions/charge.js'
export { freeSpot } from './deploy.js'
export { rngState } from './rng.js'

export const alive = (u) => u.alive > 0
export const enemiesOf = (G, u) => G.units.filter((e) => e.side !== u.side && alive(e))
export const friendsOf = (G, u) => G.units.filter((e) => e.side === u.side && alive(e) && e !== u)
export const dist = (a, b) => hypot(a.pos.x - b.pos.x, a.pos.z - b.pos.z)
export const gap = (a, b) => dist(a, b) - a.r - b.r
export const engagedWith = (G, u) => enemiesOf(G, u).filter((e) => gap(u, e) <= ENGAGE + 0.05)
// Where a model stands as far as the rules are concerned: its slot in the
// formation, not wherever its figure has animated to this frame.
export const mx = (u, m) => u.pos.x + m.ox
export const mz = (u, m) => u.pos.z + m.oz
export const isEngaged = (G, u) => engagedWith(G, u).length > 0

// ── Line of sight, cover, control ───────────────────────────────────────────
export const eyeY = (u) => u.t.eye
export const chestY = (u) => u.t.chest

export function inCover(G, u) {
  const live = u.models.filter((m) => m.alive)
  if (u.t.fly) return false
  let n = 0
  for (const m of live) if (G.nav.cover[G.nav.index(mx(u, m), mz(u, m))]) n++
  return n * 2 >= live.length && n > 0
}

// Can `a` see `b`? Rays from a's centre to each of b's models.
export function sight(G, a, b, from = a.pos) {
  const eye = { x: from.x, y: eyeY(a), z: from.z }
  let seen = 0, obsc = 0, total = 0
  for (const m of b.models) {
    if (!m.alive) continue
    total++
    const r = G.terrain.los(eye, { x: mx(b, m), y: chestY(b), z: mz(b, m) })
    if (!r.blocked) {
      seen++
      if (r.obscure) obsc++
    }
  }
  return { visible: seen > 0, cover: seen > 0 && (obsc > 0 || seen < total || inCover(G, b)), seen, total }
}

export function leadership(G, u) {
  let ld = u.t.Ld
  for (const f of friendsOf(G, u)) if (f.t.hero && dist(u, f) <= AURA + u.r) ld = Math.max(ld, f.t.Ld)
  return ld
}

// Who holds objective `o`: the seat with more OC within range, -1 for nobody.
export function controlOf(G, o) {
  const oc = [0, 0]
  for (const u of G.units) {
    if (!alive(u)) continue
    for (const m of u.models) if (m.alive && hypot(mx(u, m) - o.x, mz(u, m) - o.z) <= OBJECTIVE_RANGE + u.t.base) oc[u.side] += u.t.OC
  }
  return oc[0] > oc[1] ? 0 : oc[1] > oc[0] ? 1 : -1
}

// ── Who can act ─────────────────────────────────────────────────────────────
// Something left to do for `u` in the current phase of its own turn.
export function canAct(G, u) {
  if (!alive(u) || u.side !== G.turn.active) return false
  switch (G.turn.phase) {
    case 'move': return !u.flags.moved
    case 'shoot': return canShoot(G, u) && shootTargets(G, u).length > 0
    case 'charge': return canCharge(G, u) && chargeTargets(G, u).length > 0
  }
  return false
}
export const anyCanAct = (G, side) => G.units.some((u) => u.side === side && canAct(G, u))
