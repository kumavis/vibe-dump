// Charging (DESIGN §1.1, §2.2): who may charge whom, the spots a charge can
// end on, and the charge itself, split where a human picks the spot:
// declareCharge rolls the 2D6, and finishCharge moves the charger to the
// spot picked (the shortest move's, for the AI).
//
// Synchronous, like damage.js: the tray's title and the roll are events
// (`tray.open`, `dice`), and so is what the view shows as its own event (the
// charger turning, the roll's verdict, its move), in the old order (DESIGN
// §2.3, §4.1 rule 3). Nothing is drawn between the two halves: the pick is
// input, and finishCharge recomputes the plan from the unchanged match (nav
// is never dirty between them: the plan has just refreshed it).
//
//   unit.face     { u, tg }       u turns to face tg
//   charge.result { u, tg, ok }   the roll made the charge (ok) or fell short
//   (and the move: actions/move.js's resolveWalk, `unit.move`)
//
// Neither half ends the action (its state line in the trace, the flags and
// the labels): through R5 main.js's finishAction does, once these events
// have played, so no state line is written while the view is behind (the
// ?debug trace's hold: DESIGN's R5a and R5b notes); from R6 the engine's.
import { CHARGE_RANGE, ENGAGE, roll } from '../rules.js'
import { hypot } from '../dmath.js'
import { emit, log } from '../journal.js'
import { refreshNav } from '../match.js'
import { alive, enemiesOf, gap, isEngaged } from '../queries.js'
import { moveMode, forbidMask, resolveWalk } from './move.js'

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

// The spots a roll of `rolled` reaches, by nav cell (1: the charge may end
// there). The same 0.01" grace `need` was rounded with, and the shortest
// move's spot always counts, so a roll that made the charge never leaves
// nowhere to stand.
export function chargeSpots(plan, rolled) {
  const ok = new Uint8Array(plan.res.dist.length)
  for (const s of plan.spots) if (s.d <= rolled + 0.011) ok[s.i] = 1
  ok[plan.cell] = 1
  return ok
}

// `u` declares a charge on `target` and rolls 2D6 against the distance to
// the nearest spot (DESIGN §2.2). Short: the charge has failed. Contact:
// `via` 'ai' (an AI seat, or a human's Auto) goes straight on to the
// shortest move (finishCharge); a seat's human picks the spot first, from
// what this returns: { plan, rolled }. Null once the charge is over.
export function declareCharge(G, u, target, via) {
  const plan = chargePlan(G, u, target)
  u.flags.chargeTried = true
  emit(G, 'tray.open', { title: `${u.t.short} charge ${target.t.short}` })
  if (!plan) {
    // (defensive: every caller checks chargePlan first, DESIGN §0.1)
    log(G, u.side, `<b>${u.t.short}</b> can't find a way to ${target.t.short}.`)
    return null
  }
  const r = roll(G, 2)
  const total = r[0] + r[1]
  const ok = total >= plan.need
  emit(G, 'dice', { label: `Charge ${plan.need}" (2D6)`, dice: r, need: 0, sum: true, pass: ok })
  emit(G, 'unit.face', { u: u.id, tg: target.id })
  if (!ok) {
    emit(G, 'charge.result', { u: u.id, tg: target.id, ok })
    log(G, u.side, `<b>${u.t.short}</b> charge ${target.t.short} — roll ${total}, needed ${plan.need}. Failed.`)
    return null
  }
  u.flags.charged = true
  u.flags.chargeTarget = target.id
  emit(G, 'charge.result', { u: u.id, tg: target.id, ok })
  log(G, u.side, `<b>${u.t.short}</b> charge ${target.t.short} — roll ${total} vs ${plan.need}. <b>Contact!</b>`)
  if (via !== 'ai') return { plan, rolled: total }
  finishCharge(G, u, target, plan.cell, plan)
  return null
}

// The charge made: `u` moves to `cell` (one of chargeSpots), by the
// shortest route there, smashing what a wrecker passes, and the nav grid
// follows. `plan` is declareCharge's, or the same plan made again (a pick
// comes back with only the cell). No pile-in: the old charge ended at its
// walk (the only pile-in is damage.js closeRanks's, after losses).
export function finishCharge(G, u, target, cell, plan = chargePlan(G, u, target)) {
  const pts = G.nav.path(plan.res, cell, u.r, plan.mode === 'fly' ? null : plan.forbid)
  resolveWalk(G, u, pts, { speed: 11, fly: plan.mode === 'fly' })
  // (the nav follows the walk, at today's site: DESIGN §4.1 rule 9)
  refreshNav(G)
}
