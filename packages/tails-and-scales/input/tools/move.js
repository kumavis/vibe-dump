// The move tool (DESIGN §2.5): a unit picked up in its seat's movement phase
// shows where it can go (its move's plan, made again as the move command
// makes it: an advanced unit as far as its roll allows), the pointer the
// path and inches to the plan's valid end nearest it, and a click there is
// { t: 'move', u, c }. Advance is { t: 'advance', u }. (F13) A finger
// aiming (input/aim.js), or the mouse with Alt held, beyond the unit's
// reach takes the move as far as it goes that way instead (aimCell).
import { hypot } from '../../core/dmath.js'

// unit u's move plan, asked with the dice locked
export const planOf = (ask, u) => ask((G, q) => q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0))

// the cell a click at `ground` moves to (the plan's valid end nearest it;
// (F13) `far`: aimCell's), or -1
export const cellAt = (ask, plan, ground, far = false) => ask((G, q) => aimCell(G, q, plan, ground, far).cell)

// Inside the caller's preview: the path from unit `sel` to the cell a click
// at `ground` moves to, drawn by `path(pts, cell, r)`, and its inches (''
// for none); ((F13) `far`: aimCell's, saying so when it went as far as it
// goes).
export function preview(G, q, plan, sel, ground, path, far = false) {
  const { cell: i, ray } = aimCell(G, q, plan, ground, far)
  if (i < 0) return ''
  path(G.nav.path(plan.res, i, sel.r, plan.mode === 'fly' ? null : plan.forbid), i, sel.r)
  return `${plan.res.dist[i].toFixed(1)}" of ${plan.max}"${ray ? ' · as far as it goes' : ''}`
}

// (F13) The cell a move aimed at `ground` goes to: { cell, ray }. The plan's
// valid end nearest it (nearestValid's, within 2.4": a click's, as ever);
// or, `far`, where `ground` lies beyond the unit's reach (the plan has no
// distance at its cell, or no valid end lies near it), the one as far as
// the move goes that way (farthest), `ray` then true. -1 for none.
export function aimCell(G, q, plan, ground, far = false) {
  const near = q.nearestValid(G, plan, ground.x, ground.z)
  if (!far) return { cell: near, ray: false }
  const c = G.nav.index(ground.x, ground.z)
  if (near >= 0 && c >= 0 && Number.isFinite(plan.res.dist[c])) return { cell: near, ray: false }
  const i = farthest(G, q, plan, ground.x, ground.z)
  return i >= 0 ? { cell: i, ray: true } : { cell: near, ray: false }
}

// (F13) "As far as it goes that way": the plan's valid end farthest along
// the ray from its unit through (x, z), and no farther than (x, z) itself.
// A cell is on the ray when its centre lies within a cell's width of it (a
// strip an inch wide, so every column of the grid it crosses holds one);
// of those the plan reaches, the one farthest along it that validEnd takes
// (ties: nearer the ray, then the lowest index). -1 for none. Read only
// over the plan, inside the caller's preview; (exact maths, as the
// charge-end tool's: the cell it picks goes into the match's log as the
// click's `move {u, c}`, and no other command comes of it).
export function farthest(G, q, plan, x, z) {
  const nav = G.nav, { u, res } = plan
  const ox = u.pos.x, oz = u.pos.z, L = hypot(x - ox, z - oz)
  if (!(L > 0)) return -1
  const ux = (x - ox) / L, uz = (z - oz) / L, band = nav.cell
  // (no end the plan reaches lies farther from the unit than its inches
  // and its start's offset from its cell's centre)
  const T = Math.min(L, plan.max + nav.cell)
  const ex = ox + ux * T, ez = oz + uz * T
  const col = (v) => Math.floor((v + nav.W / 2) / nav.cell), row = (v) => Math.floor((v + nav.H / 2) / nav.cell)
  const ix0 = Math.max(0, col(Math.min(ox, ex) - band)), ix1 = Math.min(nav.nx - 1, col(Math.max(ox, ex) + band))
  const iz0 = Math.max(0, row(Math.min(oz, ez) - band)), iz1 = Math.min(nav.nz - 1, row(Math.max(oz, ez) + band))
  const on = []
  for (let iz = iz0; iz <= iz1; iz++) for (let ix = ix0; ix <= ix1; ix++) {
    const i = iz * nav.nx + ix
    if (!Number.isFinite(res.dist[i])) continue
    const px = nav.x(i) - ox, pz = nav.z(i) - oz, t = px * ux + pz * uz
    if (t < 0 || t > T) continue
    const d = Math.abs(px * uz - pz * ux)
    if (d <= band) on.push({ i, t, d })
  }
  on.sort((a, b) => b.t - a.t || a.d - b.d || a.i - b.i)
  for (const c of on) if (q.validEnd(G, plan, c.i)) return c.i
  return -1
}

// the commands
export const moveTo = (u, c) => ({ t: 'move', u: u.id, c })
export const advance = (u) => ({ t: 'advance', u: u.id })
