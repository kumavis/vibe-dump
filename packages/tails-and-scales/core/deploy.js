// Deployment: where the armies start, and where a unit may be put during
// its seat's deployment.
import { hypot } from './dmath.js'
import { edgeOf, rolesOf, roleOf, flipped } from './match.js'
import { setUnitPos, defaultFacing } from './units.js'
import { STEP } from './nav.js'
import { groundOnly } from './actions/move.js'
import { autoload } from './actions/transport.js'
import { clearOf } from './footprint.js'
import { faceDist, postsOf } from './terrain/breakthrough.js'

// The deployment zone of seat `side`: the strip the mission's depth deep
// along its seat's edge, as x bounds (G.board: the mission's board).
// (Breakthrough, DESIGN §4.2.12) On a mission with roles, the zone of the
// seat's role, a rectangle in the mission's attacker-west frame (z bounds
// too where the role's zone names them), point-mirrored when seat 1
// attacks (core/match.js flipped).
//
// (Breakthrough, the March Wall) A role whose zone is `{ behind: true }`
// deploys behind the line: on a board with a plan (T.plan, the line set's
// generator's record, already in the table's places, the flip and the z
// mirror its own), everything on the defender's side of the wall's outer
// face, the wall's own decks and towers included: `plan` rides in the zone
// and fits holds every base (every disc of a long hull) wholly behind the
// face (core/terrain/breakthrough.js faceDist ≥ its radius); its x bounds
// are the defender's side's on the table (freeSpot's columns), within the
// role zone's own `x` (its bounds in the attacker-west frame, mirrored when
// seat 1 attacks: (Breakthrough) they keep the defender 8 tails from the
// attacker's zone where the wall's tip runs near it), so fits holds every
// base inside them too and a post whose cell falls outside is passed over
// as a full one is. On a board with no plan, the line itself is the face:
// x from the line (mirrored when seat 1 attacks) to the seat's edge,
// within the same bounds.
export function zone(G, side) {
  if (rolesOf(G.setup)) return roleZone(G, side)
  const { W, deploy } = G.board
  const edge = edgeOf(G, side), outer = edge * (W / 2), inner = edge * (W / 2 - deploy)
  return { minX: Math.min(outer, inner), maxX: Math.max(outer, inner) }
}
function roleZone(G, side) {
  const role = rolesOf(G.setup)[roleOf(G, side)], z = role.zone
  if (z.behind) return behindZone(G, role.line, z.x)
  const [x0, x1] = z.x
  if (!z.z) return flipped(G.setup) ? { minX: -x1, maxX: -x0 } : { minX: x0, maxX: x1 }
  const [z0, z1] = z.z
  return flipped(G.setup) ? { minX: -x1, maxX: -x0, minZ: -z1, maxZ: -z0 } : { minX: x0, maxX: x1, minZ: z0, maxZ: z1 }
}

function behindZone(G, line, [x0, x1]) {
  const { W } = G.board, plan = G.terrain.plan, flip = flipped(G.setup)
  // (the role's bounds on the table)
  const b0 = flip ? 0 - x1 : x0, b1 = flip ? 0 - x0 : x1
  if (!plan) return flip ? { minX: Math.max(-W / 2, b0), maxX: Math.min(0 - line, b1) } : { minX: Math.max(line, b0), maxX: Math.min(W / 2, b1) }
  let lo = Infinity, hi = -Infinity
  for (const p of plan.region) {
    lo = Math.min(lo, p.x)
    hi = Math.max(hi, p.x)
  }
  return { minX: Math.max(-W / 2, lo, b0), maxX: Math.min(W / 2, hi, b1), plan }
}

// May `u` be put on nav cell i during seat `side`'s deployment, with
// `others` where they stand? Inside the zone, standable, and clear of every
// other unit by 0.4". (freeSpot's test, cell by cell; the `place` command's
// legality, core/commands.js.) (F7a) With height, standable keeps a base
// off every ledge's band, so a unit may be put on a deck's top (each
// seat's works stand in its zone) and never astride its edge or on its
// solid body; the spacing is horizontal, as ever.
//
// deployArmies's rows are unchanged on a fortified board: a row's spot
// that falls on a deck resolves through freeSpot to the nearest cell it may
// be put on, most often the deck's own top, a rim's width in from the edge
// (in 50 fortified AI battles, 312 of 700 units started on the works'
// decks: the front rows, 1.8" in from the zone's edge, run along them).
//
// (F9a) A rider in `others` stands in nobody's way (it is off the table, at
// its hull's place), and a ground vehicle is never put on a floor above
// STEP (with height: the works' decks are its riders', not its own).
//
// (F9b, DESIGN §4.2.5) A long hull (t.fp) is put on a state, cell i facing
// `f` (hullFits): every disc inside the zone's x bounds, the state
// standing (its discs' cells, clearance and, with height, the ground:
// nav.hullStands), and every disc clear of every other unit's discs by
// 0.4". A round unit beside one keeps its 0.4" to the nearest disc.
export function fits(G, u, i, box, others, f) {
  if (u.t.fp) return hullFits(G, u, i, box, others, f)
  const { minX, maxX } = box
  const nav = G.nav
  const cx = nav.x(i), cz = nav.z(i)
  if (cx - u.r < minX - 0.01 || cx + u.r > maxX + 0.01) return false
  // ((Breakthrough) a role's zone with z bounds holds the base inside them)
  if (box.minZ !== undefined && (cz - u.r < box.minZ - 0.01 || cz + u.r > box.maxZ + 0.01)) return false
  // ((the March Wall) behind the line: the base wholly behind the face)
  if (box.plan && !(faceDist(box.plan, cx, cz) >= u.r - 0.01)) return false
  if (!nav.standable(i, u.r, 'walk')) return false
  if (nav.hasHeight && groundOnly(u) && nav.floor[i] > STEP) return false
  if (others.some((o) => !o.aboard && (o.t.fp ? clearOf(o, cx, cz, u.r) < 0.4 : hypot(o.pos.x - cx, o.pos.z - cz) < o.r + u.r + 0.4))) return false
  return true
}
function hullFits(G, u, i, { minX, maxX, minZ, maxZ, plan }, others, f) {
  const nav = G.nav, fp = u.t.fp
  if (!(Number.isInteger(f) && f >= 0 && f < 8)) return false
  const cx = nav.x(i), cz = nav.z(i), row = fp.H[f]
  for (const d of row) {
    const x = cx + d.ix * fp.cell
    if (x - d.r < minX - 0.01 || x + d.r > maxX + 0.01) return false
  }
  // ((Breakthrough) and a role's zone's z bounds, every disc inside them)
  if (minZ !== undefined) {
    for (const d of row) {
      const z = cz + d.iz * fp.cell
      if (z - d.r < minZ - 0.01 || z + d.r > maxZ + 0.01) return false
    }
  }
  // ((the March Wall) and behind the line, every disc wholly behind the face)
  if (plan) for (const d of row) if (!(faceDist(plan, cx + d.ix * fp.cell, cz + d.iz * fp.cell) >= d.r - 0.01)) return false
  if (!nav.hullStands(i, f, fp, 'walk')) return false
  for (const d of row) {
    const x = cx + d.ix * fp.cell, z = cz + d.iz * fp.cell
    if (others.some((o) => !o.aboard && clearOf(o, x, z, d.r) < 0.4)) return false
  }
  return true
}

// May `u` be put on nav cell `c` in its own seat's zone, the other units
// standing where they are? (The 2.5" a click may land from the cell is the
// UI's own tolerance, not a rule.) (F9b) A long hull facing `f`, or, `f`
// left out, at any heading (the default then takes one: placeFacing).
export function placeOk(G, u, c, f) {
  if (u.t.fp) return Number.isInteger(c) && c >= 0 && c < G.nav.N && placeFacing(G, u, c, f) >= 0
  return Number.isInteger(c) && c >= 0 && c < G.nav.N && fits(G, u, c, zone(G, u.side), G.units.filter((o) => o !== u))
}

// (F9b, DESIGN §4.2.5's default heading) The heading long hull `u` is put
// on cell c with: `f` when it fits there; with none named, its own facing
// if that fits, else the lowest heading that does; −1 when none does.
export function placeFacing(G, u, c, f) {
  const box = zone(G, u.side), others = G.units.filter((o) => o !== u)
  if (f !== undefined && f !== null) return fits(G, u, c, box, others, f) ? f : -1
  if (fits(G, u, c, box, others, u.facing)) return u.facing
  for (let h = 0; h < 8; h++) if (fits(G, u, c, box, others, h)) return h
  return -1
}

// The zone's columns of the grid, a column either side to spare (fits
// refuses every other first): freeSpot's scan (S0), (F9b) a long hull's
// too
const zoneColumns = (nav, box) => [Math.max(0, Math.floor((box.minX + nav.W / 2) / nav.cell) - 1), Math.min(nav.nx - 1, Math.floor((box.maxX + nav.W / 2) / nav.cell) + 1)]

// Pick a spot near (x, z) inside the side's deployment zone. Cell centres
// only; null when nowhere fits. (S0, DESIGN §4.2.2) Only the zone's columns
// are visited, a column either side to spare (fits refuses every other
// first), row by row in the board's order, so the nearest found first is
// the one the whole board's scan found.
//
// (F9b) A long hull's spot is a state, { x, z, f }: at heading `f`, by
// default the edge rule's (core/units.js defaultFacing), preferring the
// states it could pivot from at least one way (nav.hullRoom, its terrain),
// so no default deployment wedges a hull in a pocket (DESIGN §4.2.5's
// "found along the way"): the nearest such, else the nearest that fits,
// the first in the board's order of equals.
export function freeSpot(G, u, x, z, side, others, f) {
  if (u.t.fp) return hullSpot(G, u, x, z, side, others, f ?? defaultFacing(G, side))
  const nav = G.nav
  let best = null, bd = Infinity
  const box = zone(G, side)
  const [x0, x1] = zoneColumns(nav, box)
  for (let iz = 0; iz < nav.nz; iz++) for (let i = iz * nav.nx + x0; i <= iz * nav.nx + x1; i++) {
    if (!fits(G, u, i, box, others)) continue
    const cx = nav.x(i), cz = nav.z(i)
    const d = hypot(cx - x, cz - z)
    if (d < bd) {
      bd = d
      best = { x: cx, z: cz }
    }
  }
  return best
}
function hullSpot(G, u, x, z, side, others, f) {
  const nav = G.nav, fp = u.t.fp
  let best = null, bd = Infinity, roomy = null, rd = Infinity
  const box = zone(G, side)
  const [x0, x1] = zoneColumns(nav, box)
  for (let iz = 0; iz < nav.nz; iz++) for (let i = iz * nav.nx + x0; i <= iz * nav.nx + x1; i++) {
    const cx = nav.x(i), cz = nav.z(i)
    const d = hypot(cx - x, cz - z)
    if (!(d < rd) || !fits(G, u, i, box, others, f)) continue
    if (nav.hullRoom(i, f, fp, 'walk')) {
      rd = d
      roomy = { x: cx, z: cz, f }
    }
    if (d < bd) {
      bd = d
      best = { x: cx, z: cz, f }
    }
  }
  return roomy ?? best
}

// Both armies in their zones, seat 0's first: a front row, the heroes
// behind it, the artillery at the back. (F9a) Then the autoload: each
// vehicle boards its seat's Troops (core/actions/transport.js autoload,
// DESIGN §4.2.8.7), drawing nothing; an army without a vehicle (every
// preset) deploys exactly as before. (A hull is placed as any unit is; its
// riders are placed in their rows first, then board, so a rider's row spot
// is left empty.) (F9b) A long hull takes its row's spot at the edge rule's
// heading (freeSpot); failing that, at each other heading in order, then
// the first state that fits in the board's order (hullFallback); its
// facing is the state's.
//
// (Breakthrough, DESIGN §4.2.12) On a mission with roles the rows are
// measured from the front of the seat's role zone (its edge toward the
// enemy): the front row 1.8 tails behind it, the middle 3.6, the back row
// 2.4 from the seat's own edge as ever, each spread along the zone's z
// span (the board's, less 3 tails a side, for a zone with no z bounds).
//
// (Breakthrough, the March Wall) A seat whose zone is behind a wall (its
// zone carries the board's plan) stands on the wall's posts instead
// (postsOf: the plan's `tower`, `walk`, `yard` and `second` places, each a
// disc at a floor), each unit in G.units order at the first post in the
// posts' own order with room for it (a post takes units while one more
// fits), drawing nothing:
//   1. each unit with a ranged weapon (or a spell) that may stand on a
//      deck (not big, no vehicle, no long hull) at a deck post, the towers'
//      tops, then the walk's (each ladder's head, then along it), on a cell
//      of the post's floor;
//   2. every other unit, and a ranged one the decks had no room left for,
//      at a ground post, the yard's (each tower ladder's
//      foot, behind the gate, each stair's foot), then the second line's
//      (behind the hedgebank; the watch platform's top only for a unit
//      that may stand on a deck), on a cell of the post's floor;
//   3. the rest, and every long hull, the free ground behind it: the back
//      row as ever (2.4 tails from the seat's edge, spread along the
//      board), on the ground, nearest that row's spot.
// A post's cell is the one nearest its middle, within its radius, where
// fits takes the unit (so never in front of the face) at that floor; a
// big unit or a vehicle never stands on a deck (floor above STEP). The
// AI's lane may refine who stands where; the attacker's rows are as above.
export function deployArmies(G) {
  const { W, H, deploy } = G.board
  const roles = !!rolesOf(G.setup)
  for (const side of [0, 1]) {
    const sx = edgeOf(G, side)
    const list = G.units.filter((u) => u.side === side)
    const placed = []
    const wall = roles ? zone(G, side).plan : null
    if (wall) {
      postArmy(G, side, list, wall, placed)
      continue
    }
    const back = list.filter((u) => u.t.deployRow === 'back')
    const mid = list.filter((u) => u.t.deployRow === 'mid')
    const front = list.filter((u) => u.t.deployRow === 'front')
    const box = roles ? zone(G, side) : null
    // (a role zone's front, as a depth from the centre line toward the
    // seat's edge, and its z span's middle and length)
    const lead = roles ? sx * (sx > 0 ? box.minX : box.maxX) : 0
    const mz = roles && box.minZ !== undefined ? (box.minZ + box.maxZ) / 2 : 0, span = roles && box.minZ !== undefined ? box.maxZ - box.minZ : H
    const rows = roles
      ? [[front, lead + 1.8], [mid, lead + 3.6], [back, W / 2 - 2.4]]
      : [
        [front, W / 2 - deploy + 1.8],
        [mid, W / 2 - deploy + 3.6],
        [back, W / 2 - 2.4],
      ]
    for (const [row, depth] of rows) {
      row.forEach((u, i) => {
        // each army lists its units from its own left
        const z = roles ? mz + ((i + 0.5) / row.length - 0.5) * (span - 6) * -sx : ((i + 0.5) / row.length - 0.5) * (H - 6) * -sx
        if (u.t.fp) {
          const p = hullFallback(G, u, sx * depth, z, side, placed) || { x: sx * depth, z, f: u.facing }
          u.facing = p.f
          setUnitPos(u, p.x, p.z)
          placed.push(u)
          return
        }
        const p = freeSpot(G, u, sx * depth, z, side, placed) || { x: sx * depth, z }
        setUnitPos(u, p.x, p.z)
        placed.push(u)
      })
    }
  }
  autoload(G)
}
// (Breakthrough, the March Wall) deployArmies' posts, as its comment says
function postArmy(G, side, mine, plan, placed) {
  const { W, H } = G.board, sx = edgeOf(G, side), box = zone(G, side)
  const decked = (u) => !!u.t.ranged && !u.t.big && !groundOnly(u) && !u.t.fp
  const deck = [...postsOf(plan, 'tower'), ...postsOf(plan, 'walk')]
  const ground = [...postsOf(plan, 'yard'), ...postsOf(plan, 'second')]
  const put = (u, p) => {
    setUnitPos(u, p.x, p.z)
    placed.push(u)
  }
  // the first post of `posts` with room for u: its cell, or null
  const take = (u, posts) => {
    for (const p of posts) {
      if (p.y > STEP && !decked(u)) continue
      const c = postCell(G, u, p, box, placed)
      if (c) return c
    }
    return null
  }
  const rest = []
  for (const u of mine) {
    if (u.t.fp) continue
    const c = decked(u) ? take(u, deck) : null
    if (c) put(u, c)
    else rest.push(u)
  }
  const behind = []
  for (const u of rest) {
    const c = take(u, ground)
    if (c) put(u, c)
    else behind.push(u)
  }
  const back = [...behind, ...mine.filter((u) => u.t.fp)]
  back.forEach((u, i) => {
    const x = sx * (W / 2 - 2.4), z = ((i + 0.5) / back.length - 0.5) * (H - 6) * -sx
    if (u.t.fp) {
      const p = hullFallback(G, u, x, z, side, placed) || { x, z, f: u.facing }
      u.facing = p.f
      put(u, p)
      return
    }
    put(u, groundSpot(G, u, x, z, box, placed) || freeSpot(G, u, x, z, side, placed) || { x, z })
  })
}
// the cell nearest post p's middle, within its radius, where fits takes u
// at the post's floor (within STEP of it), the first of equals in the
// board's order, or (seat 1 attacking) in its reverse, so the layout is the
// exact point mirror of the one seat 0's attack meets; null for none
function postCell(G, u, p, box, others) {
  const nav = G.nav, back = flipped(G.setup)
  let best = null, bd = Infinity
  const ix0 = Math.max(0, Math.floor((p.x - p.r + nav.W / 2) / nav.cell)), ix1 = Math.min(nav.nx - 1, Math.floor((p.x + p.r + nav.W / 2) / nav.cell))
  const iz0 = Math.max(0, Math.floor((p.z - p.r + nav.H / 2) / nav.cell)), iz1 = Math.min(nav.nz - 1, Math.floor((p.z + p.r + nav.H / 2) / nav.cell))
  const nz = iz1 - iz0 + 1, nx = ix1 - ix0 + 1
  for (let kz = 0; kz < nz; kz++) for (let kx = 0; kx < nx; kx++) {
    const iz = back ? iz1 - kz : iz0 + kz, ix = back ? ix1 - kx : ix0 + kx
    const i = iz * nav.nx + ix, cx = nav.x(i), cz = nav.z(i)
    const d = hypot(cx - p.x, cz - p.z)
    if (!(d <= p.r) || !(d < bd)) continue
    if (nav.hasHeight && Math.abs(nav.floor[i] - p.y) > STEP) continue
    if (!fits(G, u, i, box, others)) continue
    bd = d
    best = { x: cx, z: cz }
  }
  return best
}
// freeSpot's nearest cell, on the ground (a floor of STEP or under)
function groundSpot(G, u, x, z, box, others) {
  const nav = G.nav
  let best = null, bd = Infinity
  const [x0, x1] = zoneColumns(nav, box)
  for (let iz = 0; iz < nav.nz; iz++) for (let i = iz * nav.nx + x0; i <= iz * nav.nx + x1; i++) {
    if (nav.hasHeight && nav.floor[i] > STEP) continue
    const cx = nav.x(i), cz = nav.z(i)
    const d = hypot(cx - x, cz - z)
    if (!(d < bd) || !fits(G, u, i, box, others)) continue
    bd = d
    best = { x: cx, z: cz }
  }
  return best
}

// (F9b) deployArmies' spot for a long hull: freeSpot at the default
// heading, then at each other heading in order, then the first state in
// the board's order (rows, cells, headings) that fits; null for none
function hullFallback(G, u, x, z, side, others) {
  const h0 = defaultFacing(G, side)
  const p = freeSpot(G, u, x, z, side, others, h0)
  if (p) return p
  for (let h = 0; h < 8; h++) {
    if (h === h0) continue
    const q = freeSpot(G, u, x, z, side, others, h)
    if (q) return q
  }
  const nav = G.nav, box = zone(G, side)
  for (let i = 0; i < nav.N; i++) for (let h = 0; h < 8; h++) if (fits(G, u, i, box, others, h)) return { x: nav.x(i), z: nav.z(i), f: h }
  return null
}
