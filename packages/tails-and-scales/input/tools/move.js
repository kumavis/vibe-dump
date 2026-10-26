// The move tool (DESIGN §2.5): a unit picked up in its seat's movement phase
// shows where it can go (its move's plan, made again as the move command
// makes it: an advanced unit as far as its roll allows), the pointer the
// path and inches to the plan's valid end nearest it, and a click there is
// { t: 'move', u, c }. Advance is { t: 'advance', u }.

// unit u's move plan, asked with the dice locked
export const planOf = (ask, u) => ask((G, q) => q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0))

// the cell a click at `ground` moves to (the plan's valid end nearest it),
// or -1
export const cellAt = (ask, plan, ground) => ask((G, q) => q.nearestValid(G, plan, ground.x, ground.z))

// Inside the caller's preview: the path from unit `sel` to the cell nearest
// `ground`, drawn by `path(pts, cell, r)`, and its inches ('' for none).
// (F7b, DESIGN §4.2.4) With a climb on the way, what of them the ladders
// cost: "7.0" of 7" (4.0" climbing)" (climbOf); and with the pointer on a
// cliff rim the overlay shaded (`rimAt(cell)`, view/overlay.js's), why the
// unit can't stand there.
export function preview(G, q, plan, sel, ground, path, rimAt = null) {
  const i = q.nearestValid(G, plan, ground.x, ground.z)
  if (i < 0) return ''
  path(G.nav.path(plan.res, i, sel.r, plan.mode === 'fly' ? null : plan.forbid), i, sel.r)
  const up = climbOf(G, plan, i)
  let text = `${plan.res.dist[i].toFixed(1)}" of ${plan.max}"${up > 0 ? ` (${up.toFixed(1)}" climbing)` : ''}`
  if (rimAt?.(G.nav.index(ground.x, ground.z))) text += `<br><span class="ledge">✖ a ledge: no way down here</span>`
  return text
}

// (F7b) What of the way to cell i the plan spends on ladders: its prev chain
// walked back from i to the start, each step that is a link (the nav's
// linkCostOf: a ladder's foot to its top or back, LADDER_MUL × its height)
// adding what it costs. 0 on a board with no height, and for a flier (its
// move a circle, no links in it).
export function climbOf(G, plan, i) {
  const prev = plan.res?.prev
  if (!G.nav.hasHeight || !prev || plan.mode === 'fly') return 0
  let sum = 0
  for (let c = i, n = 0; c >= 0 && prev[c] >= 0 && n < G.nav.N; c = prev[c], n++) {
    const k = G.nav.linkCostOf(prev[c], c)
    if (k >= 0) sum += k
  }
  return sum
}

// the commands
export const moveTo = (u, c) => ({ t: 'move', u: u.id, c })
export const advance = (u) => ({ t: 'advance', u: u.id })
