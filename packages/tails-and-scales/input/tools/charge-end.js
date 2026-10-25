// The charge-end tool (DESIGN §2.5): where a seat's successful charge ends.
// While the match waits on a seat's chargeEnd decision, the spots its roll
// reaches around the target are chargeSpots of the charge's plan, made again
// from the unchanged match as the chargeEnd command makes it (nav is
// never dirty between commands), under the Session's preview, so asking
// never rolls a die. A click takes the nearest of those spots; Shortest move
// is -1, the plan's own cell (where the AI's charge ends). Either way the
// body is { t: 'chargeEnd', c }.
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
      return { seat: P.seats[0], u, tg, rolled: P.rolled, cell: P.cell, plan, ok: q.chargeSpots(plan, P.rolled) }
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

// "Shortest move": the cell of the charge's own plan, as the AI's ends
export const SHORTEST = -1

// the command that ends the charge on cell c (or SHORTEST)
export const endAt = (c) => ({ t: 'chargeEnd', c })
