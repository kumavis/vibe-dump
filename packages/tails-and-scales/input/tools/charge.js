// The charge tool (DESIGN §2.5): a unit picked up in its seat's charge phase
// shows its 12" declaration ring, the pointer over an enemy the roll it
// needs (or why it can't charge it), and a click on it is
// { t: 'charge', u, tg } (the match judges it: in range, a way there). Where
// a charge that makes contact ends is the charge-end tool's
// (charge-end.js).
import { p2D6 } from '../../core/rules.js'

// Inside the caller's preview: what unit `sel` charging `target` needs.
export function preview(G, q, sel, target) {
  if (!q.chargeTargets(G, sel).includes(target)) return `✖ out of charge range (${q.gap(sel, target).toFixed(1)}")`
  const p = q.chargePlan(G, sel, target)
  return p ? `Charge: need ${p.need}" on 2D6 — ${Math.round(p2D6(p.need) * 100)}%` : '✖ no route'
}

// the command
export const chargeAt = (u, tg) => ({ t: 'charge', u: u.id, tg: tg.id })
