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
export function preview(G, q, plan, sel, ground, path) {
  const i = q.nearestValid(G, plan, ground.x, ground.z)
  if (i < 0) return ''
  path(G.nav.path(plan.res, i, sel.r, plan.mode === 'fly' ? null : plan.forbid), i, sel.r)
  return `${plan.res.dist[i].toFixed(1)}" of ${plan.max}"`
}

// the commands
export const moveTo = (u, c) => ({ t: 'move', u: u.id, c })
export const advance = (u) => ({ t: 'advance', u: u.id })
