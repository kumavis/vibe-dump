// (F7c, DESIGN §4.2.4's "Destruction and settle", §4.1 rule 17) What
// becomes of the units on a timber platform shot out from under them.
//
// A platform's post breaks (a template's blast, a wrecker's smash), and once
// its deck has `fallsAt` of its posts down the deck falls with its ladders
// (core/terrain/terrain.js's cascade), leaving a pile of planks on the
// ground and joining the terrain's `dropped`. The rules then settle it,
// right after the refreshNav that ends what broke it: a template's landing
// (core/actions/shoot.js, each template's, before the next is thrown and
// before any keg its blast broke goes off), a move (core/actions/move.js
// doMove), a charge (core/actions/charge.js finishCharge) and a boarding's
// walk (core/actions/transport.js doEmbark, which ends as doMove does:
// §4.2.5). The nav has followed by then, so the deck's footprint is ground
// again and its ladders are gone.
//
// For each dropped deck in chunk order, each on-table unit (alive, not
// aboard) whose centre lay inside its footprint when the settle began, in
// G.units order (§4.1 rule 6), in turn:
//   1. its place (no draw): where it stands, if its cell is standable for it
//      and it is clear of every other unit on the table by o.r + u.r + 0.08
//      (a valid end's spacing); else the nearest cell to it within u.r + 6"
//      that is standable for it, on the ground, outside the enemies' 1"
//      bubbles at its level (a move's end mask: core/actions/move.js
//      forbidMask) and as clear of every other unit, ties to the lowest
//      cell index, where it stands from then on (moveUnitTo: a hull's riders
//      go with it and stay aboard, as F5b's landed Sky-Basket will); with
//      no such cell, every model is slain under the wreckage, by nobody
//      (killModel, after its fall), and that is the end of it;
//   2. `unit.fall { u, to: { x, y, z }, dy, crushed? }`: where it now
//      stands, the floor there, and how far it fell (the deck's top less
//      that floor); a unit crushed falls where it stood, `crushed: true`
//      (the view's word for it: it takes no D3), its models slain after it;
//   3. one D6 for its D3 mortal wounds (ceil(d6 / 2)), its dice row, and
//      damage(G, u, n, 1, u): no save, the wounds going to the models
//      nearest its own centre;
//   4. the flags and labels as it leaves them (`objectives`, `status`),
//      landed or crushed ((the review) a crushed unit's too: killModel
//      tells neither, and the move or charge the settle ends tells no
//      status after it, so the table kept a crushed unit, or its last foe,
//      engaged).
// (The review) A unit already destroyed (or fled) where it stood on the
// deck falls too, as it lies: `unit.fall { u, to, dy, dead: true }`, where
// it lay and the floor there now, no draw and nothing else. project(G)
// reads every unit's `y` off the floor under it, the dead's included, and
// F7c is the first change that can take a floor from under a dead unit (a
// wreck has no top), so without it the mirror kept a dead defender 2" up
// for the rest of the battle and a snap put it on the ground (P-present's
// `falls-board-4-slain`). The view drops its dying figures with it.
// Then `dropped` is empty again, as it is between commands (§4.1 rule 20;
// P-prop holds it at every boundary).
//
// Two things the spec's list leaves open, settled here. The units are those
// inside each footprint as the settle begins (the same units the spec's
// per-deck walk finds, as nothing moves between the fall and the settle,
// but a unit already fallen from one deck is never taken again for another
// dropped beside it). And the order of the events: the fall, then its dice
// row, then the wounds (a bail-out's order, §4.1 rule 16, and the gaze's),
// so the table shows the unit land before its models fall; the draws keep
// the spec's order exactly (the place, which draws nothing, then the D6,
// then damage). No line of its own: a destroyed unit's line waits for the
// attack's report (§4.1 rule 8), and a line here would let it out early.
//
// This branch is reached only where a deck has fallen (`if (dropped.length)`,
// §4.1 rule 11): no classic, open, keg or powder board has a post that
// breaks, so their battles draw exactly as they did.
import { ENGAGE, d6 } from '../rules.js'
import { hypot, sin, cos } from '../dmath.js'
import { emit } from '../journal.js'
import { moveUnitTo } from '../units.js'
import { STEP } from '../nav.js'
import { alive, groundY, ownersOf, statusOf } from '../queries.js'
import { moveMode, forbidMask } from './move.js'
import { damage, killModel } from './damage.js'

// how far from where it stood a falling unit may land beyond its own
// radius (DESIGN: within u.r + 6")
export const FALL_REACH = 6

export function settle(G) {
  const T = G.terrain
  if (!T.dropped.length) return
  const decks = T.dropped.slice().sort((a, b) => a.id - b.id)
  // (the living on each deck, and (the review) the dead lying there: in
  // G.units order together, the dead drawing nothing, so the living's
  // draws are as they were)
  const on = decks.map((d) => G.units.filter((u) => !u.aboard && inFootprint(d.shape, u.pos)))
  for (let k = 0; k < decks.length; k++) for (const u of on[k]) (alive(u) ? fall : lies)(G, u, decks[k])
  T.dropped.length = 0
}

// (The review) Unit `u`, destroyed where it stood on deck `d` before the
// deck fell, falls with it as it lies: where it lay, the floor there now
// (the planks' ground), no draw (above).
function lies(G, u, d) {
  const y = groundY(G, u)
  emit(G, 'unit.fall', { u: u.id, to: { x: u.pos.x, y, z: u.pos.z }, dy: d.surface.y - y, dead: true })
}

// Whether (x, z) lies inside box s's footprint (its own frame: the nav's
// rasters' turn, core/nav.js)
export function inFootprint(s, p) {
  const c = cos(s.yaw), sn = sin(s.yaw)
  const dx = p.x - s.x, dz = p.z - s.z
  return Math.abs(dx * c - dz * sn) <= s.hx && Math.abs(dx * sn + dz * c) <= s.hz
}

// Unit `u` falls with deck `d`: its place, its event, its D3 (above).
function fall(G, u, d) {
  const nav = G.nav, mode = moveMode(u) === 'wreck' ? 'wreck' : 'walk'
  const here = nav.index(u.pos.x, u.pos.z)
  const stays = nav.standable(here, u.r, mode, null) && clear(G, u, u.pos.x, u.pos.z)
  const i = stays ? here : fallSpot(G, u, mode)
  if (!stays && i >= 0) moveUnitTo(G, u, nav.x(i), nav.z(i))
  // (where it now stands: crushed, where it stood, so the table puts its
  // fallen figures on the ground there, as project(G) does)
  const y = groundY(G, u)
  emit(G, 'unit.fall', { u: u.id, to: { x: u.pos.x, y, z: u.pos.z }, dy: d.surface.y - y, ...(i < 0 ? { crushed: true } : {}) })
  if (i < 0) {
    for (const m of u.models) if (m.alive) killModel(G, u, m, null, m.w)
  } else {
    const n = Math.ceil(d6(G) / 2)
    emit(G, 'dice', { label: `${u.t.short}: the fall, D3 mortal wounds`, dice: [n], need: 0, sum: true, note: `${n}` })
    damage(G, u, n, 1, u)
  }
  if (G.out) {
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
}

// Whether `u` standing at (x, z) is clear of every other unit on the table
// by o.r + u.r + 0.08 (validEnd's spacing; a rider stands in nobody's way)
function clear(G, u, x, z) {
  for (const o of G.units) {
    if (o === u || !alive(o) || o.aboard) continue
    if (hypot(o.pos.x - x, o.pos.z - z) < o.r + u.r + 0.08) return false
  }
  return true
}

// Where `u` lands when it can't stay where it stood: the cell nearest its
// centre within u.r + FALL_REACH, standable for it (cliff included, with
// height), on the ground (its floor within STEP of 0, with height), outside
// its enemies' 1" (forbidMask, at its level: a move's end's) and clear of
// every other unit, ties to the lowest index (the cells walked in index
// order, a nearer one only by <); −1 for none. Draws nothing.
export function fallSpot(G, u, mode = moveMode(u) === 'wreck' ? 'wreck' : 'walk') {
  const nav = G.nav, R = u.r + FALL_REACH
  const forbid = forbidMask(G, u, ENGAGE + 0.05)
  const x0 = Math.max(0, Math.floor((u.pos.x - R + nav.W / 2) / nav.cell)), x1 = Math.min(nav.nx - 1, Math.floor((u.pos.x + R + nav.W / 2) / nav.cell))
  const z0 = Math.max(0, Math.floor((u.pos.z - R + nav.H / 2) / nav.cell)), z1 = Math.min(nav.nz - 1, Math.floor((u.pos.z + R + nav.H / 2) / nav.cell))
  let best = -1, bd = Infinity
  for (let iz = z0; iz <= z1; iz++) for (let ix = x0; ix <= x1; ix++) {
    const i = iz * nav.nx + ix, x = nav.x(i), z = nav.z(i)
    const dd = hypot(x - u.pos.x, z - u.pos.z)
    if (dd > R || !(dd < bd)) continue
    if (nav.hasHeight && nav.floor[i] > STEP) continue
    if (!nav.standable(i, u.r, mode, forbid) || !clear(G, u, x, z)) continue
    bd = dd
    best = i
  }
  return best
}
