// Charging's rules: who may charge whom, and the spots a charge can end on.
// (Its read-only half; the charge itself is still main.js's doCharge, awaited
// by its dice, its walk and a human's pick of a spot, until R5 and R6 split
// it here into declareCharge and finishCharge.)
import { CHARGE_RANGE, ENGAGE } from '../rules.js'
import { hypot } from '../dmath.js'
import { refreshNav } from '../match.js'
import { alive, enemiesOf, gap, isEngaged } from '../queries.js'
import { moveMode, forbidMask } from './move.js'

export function canCharge(G, u) {
  if (!alive(u) || u.flags.charged || u.flags.chargeTried) return false
  if (u.t.noCharge || u.mesmerized || u.flags.fellBack || isEngaged(G, u)) return false
  if (u.flags.advanced && !u.t.chargeAfterAdvance) return false
  return true
}

export function chargeTargets(G, u) {
  if (!canCharge(G, u)) return []
  return enemiesOf(G, u).filter((e) => gap(u, e) <= CHARGE_RANGE)
}

// Every spot a charge could end on: within 1" of the target, not within 1" of
// any other enemy, not on top of a friend — each with the length of the
// shortest route there. The closest one sets the distance the dice must beat;
// a roll that beats it may end on any spot it reaches. Null when no spot can
// be reached at all.
export function chargePlan(G, u, target) {
  refreshNav(G)
  const nav = G.nav
  const others = enemiesOf(G, u).filter((e) => e !== target)
  const mode = moveMode(u)
  // the target's 1" bubble is fine to enter, its base is not
  const forbid = forbidMask(G, u, ENGAGE + 0.05, [target])
  const res = nav.reach(u.pos.x, u.pos.z, { r: u.r, max: CHARGE_RANGE + 0.5, mode, forbid: mode === 'fly' ? null : forbid })
  const spots = []
  let best = -1, bd = Infinity
  const want = target.r + u.r + ENGAGE - 0.08
  const R = Math.ceil((want + 1) / nav.cell)
  const cx = nav.index(target.pos.x, target.pos.z)
  const tx = cx % nav.nx, tz = (cx / nav.nx) | 0
  for (let dz = -R; dz <= R; dz++) for (let dx = -R; dx <= R; dx++) {
    const ix = tx + dx, iz = tz + dz
    if (ix < 0 || iz < 0 || ix >= nav.nx || iz >= nav.nz) continue
    const i = iz * nav.nx + ix
    const d = res.dist[i]
    if (!isFinite(d)) continue
    const dd = hypot(nav.x(i) - target.pos.x, nav.z(i) - target.pos.z)
    if (dd > want || dd < target.r + u.r + 0.02) continue
    if (!nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', forbid)) continue
    if (others.some((e) => hypot(nav.x(i) - e.pos.x, nav.z(i) - e.pos.z) < e.r + u.r + ENGAGE)) continue
    if (G.units.some((o) => o !== u && o !== target && alive(o) && o.side === u.side && hypot(o.pos.x - nav.x(i), o.pos.z - nav.z(i)) < o.r + u.r + 0.05)) continue
    spots.push({ i, d })
    if (d < bd) {
      best = i
      bd = d
    }
  }
  if (best < 0) return null
  return { cell: best, need: Math.max(2, Math.ceil(bd - 0.01)), res, forbid, mode, dist: bd, spots }
}
