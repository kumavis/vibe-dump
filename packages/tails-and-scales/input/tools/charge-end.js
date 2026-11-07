// The charge-end tool (DESIGN §2.5): where a seat's successful charge ends.
// While the match waits on a seat's chargeEnd decision, the spots its roll
// reaches around the target are chargeSpots of the charge's plan, made again
// from the unchanged match as the chargeEnd command makes it (nav is
// never dirty between commands), under the Session's preview, so asking
// never rolls a die. A click takes the nearest of those spots; Shortest move
// is -1, the plan's own cell (where the AI's charge ends). Either way the
// body is { t: 'chargeEnd', c }.
//
// (F9b, DESIGN §4.2.5) A long hull's charge ends on a state: its spots
// (plan.spots, [{ i, f, d }]) are cells at headings, chargeSpots their
// cells. A click takes the nearest spot cell, at the heading the roll
// reaches shortest there (spotFacing: core/actions/charge.js chargeFacing's
// rule, ties to the lowest), sent as the body's `f`, so it ends where its
// ghost showed; Shortest move is the pending decision's own state (its
// cell and `f`), sent as -1 alone (it takes no f). The pick carries the
// plan's fp and that shortest heading (`f`).
import { hypot } from '../../core/dmath.js'

// the pick, worked out once per decision (a plan reaches over the whole
// grid): keyed by the pending decision itself, which the match replaces
// with a new object for every charge
const picks = new WeakMap()

// The charge-end decision the match waits on, with what picking needs:
// { seat, u, tg (the units), rolled, cell (the shortest move's), plan,
// ok (a 1 per nav cell the roll reaches) }; null when none is pending.
export function chargePick(session) {
  const P = session.G?.pending
  if (P?.k !== 'chargeEnd') return null
  let pk = picks.get(P)
  if (!pk) {
    pk = session.preview((G, q) => {
      const u = G.units.find((x) => x.id === P.u), tg = G.units.find((x) => x.id === P.tg)
      const plan = q.chargePlan(G, u, tg)
      return { seat: P.seats[0], u, tg, rolled: P.rolled, cell: P.cell, plan, ok: q.chargeSpots(plan, P.rolled), ...(plan.fp ? { f: P.f } : {}) }
    })
    picks.set(P, pk)
  }
  return pk
}

// The spot the roll reaches nearest (x, z), within `within` inches of it;
// -1 for none. (Exact maths: the cell it picks goes into the match's log.)
export function nearestSpot(nav, ok, x, z, within = 2.4) {
  let best = -1, bd = within
  for (let i = 0; i < nav.N; i++) {
    if (!ok[i]) continue
    const d = hypot(nav.x(i) - x, nav.z(i) - z)
    if (d < bd) {
      bd = d
      best = i
    }
  }
  return best
}

// (F9b) A long hull's charge ending on cell c: the spot heading there the
// roll reaches shortest (ties to the lowest); −1 for none
export function spotFacing(plan, c, rolled) {
  let f = -1, bd = Infinity
  for (const s of plan.spots) {
    if (s.i !== c || !plan.spotOk(c, s.f, rolled)) continue
    if (s.d < bd || (s.d === bd && s.f < f)) {
      bd = s.d
      f = s.f
    }
  }
  return f
}

// "Shortest move": the cell of the charge's own plan, as the AI's ends
export const SHORTEST = -1

// the command that ends the charge on cell c (or SHORTEST) ((F9b) a long
// hull's at heading `f`, when given: never with SHORTEST)
export const endAt = (c, f) => (f === undefined || f === null || c === SHORTEST ? { t: 'chargeEnd', c } : { t: 'chargeEnd', c, f })
