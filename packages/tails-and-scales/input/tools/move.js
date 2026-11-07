// The move tool (DESIGN §2.5): a unit picked up in its seat's movement phase
// shows where it can go (its move's plan, made again as the move command
// makes it: an advanced unit as far as its roll allows), the pointer the
// path and inches to the plan's valid end nearest it, and a click there is
// { t: 'move', u, c }. Advance is { t: 'advance', u }. (F13) A finger
// aiming (input/aim.js), or the mouse with Alt held, beyond the unit's
// reach takes the move as far as it goes that way instead (aimCell).
//
// (F9b, DESIGN §4.2.5) A long hull's plan is its lattice's (plan.fp): every
// reader by cell reads plan.cells (the least distance at any heading), its
// path is nav.hullPath's ({ x, z, f }: runs and pivots), its end a state,
// the cell and the heading the move takes there (endOf: the default rule,
// of the valid end headings the one the plan reaches shortest, ties to the
// lowest, as core/actions/move.js's endFacing; or the one the player
// turned it to), and its inches the plan's cost there, turning and backing
// told apart (costOf, off the lattice's prev chain as climbOf reads
// ladders): "6.0" of 6" (0.5" turning, 1.0" backing)"; and where the hull
// could pivot neither way from there, "no room to turn here" (roomAt).
// headsOf gives the reach overlay its headings.
import { hypot } from '../../core/dmath.js'

// unit u's move plan, asked with the dice locked
export const planOf = (ask, u) => ask((G, q) => q.movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0))

// the cell a click at `ground` moves to (the plan's valid end nearest it;
// (F13) `far`: aimCell's), or -1
export const cellAt = (ask, plan, ground, far = false) => ask((G, q) => aimCell(G, q, plan, ground, far).cell)

// Inside the caller's preview: the path from unit `sel` to the cell a click
// at `ground` moves to, drawn by `path(pts, cell, r)`, and its inches (''
// for none); ((F13) `far`: aimCell's, saying so when it went as far as it
// goes). (F7b, DESIGN §4.2.4) With a climb on the way, what of them the
// ladders cost: "7.0" of 7" (4.0" climbing)" (climbOf); and with the
// pointer on a cliff rim the overlay shaded (`rimAt(cell)`,
// view/overlay.js's), why the unit can't stand there.
export function preview(G, q, plan, sel, ground, path, far = false, rimAt = null) {
  const { cell: i, ray } = aimCell(G, q, plan, ground, far)
  if (i < 0) return ''
  // ((F9b) a long hull's: its path to the state at the default heading,
  // the ghost its outline there (path's fourth argument), its inches told
  // apart)
  if (plan.fp) {
    const f = endOf(G, q, plan, i)
    path(G.nav.hullPath(plan.res, i, f), i, sel.r, f)
    return `${hullText(G, plan, i, f)}${ray ? ' · as far as it goes' : ''}`
  }
  path(G.nav.path(plan.res, i, sel.r, plan.mode === 'fly' ? null : plan.forbid), i, sel.r)
  const up = climbOf(G, plan, i)
  let text = `${plan.res.dist[i].toFixed(1)}" of ${plan.max}"${up > 0 ? ` (${up.toFixed(1)}" climbing)` : ''}${ray ? ' · as far as it goes' : ''}`
  if (rimAt?.(G.nav.index(ground.x, ground.z))) text += `<br><span class="ledge">✖ a ledge: no way down here</span>`
  return text
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
  if (near >= 0 && c >= 0 && Number.isFinite(byCell(plan).dist[c])) return { cell: near, ray: false }
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
  const nav = G.nav, { u } = plan, res = byCell(plan)
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

// (F7b) What of the way to cell i the plan spends on ladders: its prev chain
// walked back from i to the start, each step that is a link (the nav's
// linkCostOf: a ladder's foot to its top or back, LADDER_MUL × its height)
// adding what it costs. 0 on a board with no height, and for a flier (its
// move a circle, no links in it).
// ((F9b) A long hull never climbs: 0.)
export function climbOf(G, plan, i) {
  const prev = plan.res?.prev
  if (!G.nav.hasHeight || !prev || plan.mode === 'fly' || plan.fp) return 0
  let sum = 0
  for (let c = i, n = 0; c >= 0 && prev[c] >= 0 && n < G.nav.N; c = prev[c], n++) {
    const k = G.nav.linkCostOf(prev[c], c)
    if (k >= 0) sum += k
  }
  return sum
}

// (F9b) A plan as its readers by cell read it: a long hull's plan.cells,
// else its own res
export const byCell = (plan) => (plan.fp ? plan.cells : plan.res)

// (F9b) The heading a long hull's move to cell i takes when it names none:
// of the valid end headings there, the one the plan reaches shortest, ties
// to the lowest (core/actions/move.js endFacing's rule, asked heading by
// heading through validEnd); −1 for none.
export function endOf(G, q, plan, i, at = null) {
  let f = -1, bd = Infinity
  for (let h = 0; h < 8; h++) {
    const d = plan.res.dist[i * 8 + h]
    if (d < bd && q.validEnd(G, plan, i, at, h)) {
      bd = d
      f = h
    }
  }
  return f
}

// (F9b) A long hull's move to the state (i, f), its inches told apart: {
// L, turn, back }, the plan's cost there, what of it its pivots cost and
// what its backing runs (each step's share the plan's own, a difficult
// cell's doubling in it), read off the lattice's prev chain from the state
// back to the start as climbOf reads ladders. A step that stays on its
// cell is a pivot; one against the way the hull faces backs up.
export function costOf(G, plan, i, f) {
  const { dist, prev } = plan.res, nav = G.nav
  let turn = 0, back = 0
  for (let s = i * 8 + f, n = 0; s >= 0 && prev[s] >= 0 && n < nav.N * 8; s = prev[s], n++) {
    const p = prev[s], a = p >> 3, b = s >> 3, d = dist[s] - dist[p]
    if (a === b) turn += d
    else {
      const [hx, hz] = [Math.sin(((s & 7) * Math.PI) / 4), Math.cos(((s & 7) * Math.PI) / 4)]
      if ((nav.x(b) - nav.x(a)) * hx + (nav.z(b) - nav.z(a)) * hz < 0) back += d
    }
  }
  return { L: dist[i * 8 + f], turn, back }
}

// (F9b) Whether a long hull at state (i, f) can pivot at least one way (the
// nav's hullRoom, in its plan's mode, outside the end's masks: a pivot
// may not swing it into an enemy's bubble either)
export const roomAt = (G, plan, i, f) => G.nav.hullRoom(i, f, plan.fp, plan.mode === 'wreck' ? 'wreck' : 'walk', plan.endForbid ?? null)
// the warning, as the move tooltip's ledge is worded
export const NO_ROOM = '<br><span class="ledge">✖ no room to turn here</span>'

// (F9b) A long hull's move to (i, f) as its tooltip says it: "6.0" of 6"
// (0.5" turning, 1.0" backing)" (each part when it has one), and "no room
// to turn here" where it could pivot neither way from there; `max` the
// inches it has (a move's plan's, a charge's roll).
export function hullText(G, plan, i, f, max = plan.max) {
  const c = costOf(G, plan, i, f)
  const parts = [c.turn > 0 && `${c.turn.toFixed(1)}" turning`, c.back > 0 && `${c.back.toFixed(1)}" backing`].filter(Boolean)
  return `${c.L.toFixed(1)}" of ${max}"${parts.length ? ` (${parts.join(', ')})` : ''}${roomAt(G, plan, i, f) ? '' : NO_ROOM}`
}

// (F9b) The reach overlay's headings for a long hull's plan: a byte per
// nav cell, bit h set where its move may end on (cell, h) (validEnd's,
// each heading asked), 0 where none (view/overlay.js shades every cell
// with one, hatched where some are missing).
export function headsOf(G, q, plan) {
  const heads = new Uint8Array(G.nav.N), d = plan.cells.dist
  for (let i = 0; i < G.nav.N; i++) {
    if (!(d[i] <= plan.max)) continue
    let b = 0
    for (let h = 0; h < 8; h++) if (q.validEnd(G, plan, i, null, h)) b |= 1 << h
    heads[i] = b
  }
  return heads
}

// the commands ((F9b) a long hull's move may name its heading, `f`)
export const moveTo = (u, c, f) => (f === undefined || f === null ? { t: 'move', u: u.id, c } : { t: 'move', u: u.id, c, f })
export const advance = (u) => ({ t: 'advance', u: u.id })
