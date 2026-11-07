// Deployment: where the armies start, and where a unit may be put during
// its seat's deployment.
import { hypot } from './dmath.js'
import { edgeOf } from './match.js'
import { setUnitPos, defaultFacing } from './units.js'
import { STEP } from './nav.js'
import { groundOnly } from './actions/move.js'
import { autoload } from './actions/transport.js'
import { clearOf } from './footprint.js'

// The deployment zone of seat `side`: the strip the mission's depth deep
// along its seat's edge, as x bounds (G.board: the mission's board).
export function zone(G, side) {
  const { W, deploy } = G.board
  const edge = edgeOf(G, side), outer = edge * (W / 2), inner = edge * (W / 2 - deploy)
  return { minX: Math.min(outer, inner), maxX: Math.max(outer, inner) }
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
  if (!nav.standable(i, u.r, 'walk')) return false
  if (nav.hasHeight && groundOnly(u) && nav.floor[i] > STEP) return false
  if (others.some((o) => !o.aboard && (o.t.fp ? clearOf(o, cx, cz, u.r) < 0.4 : hypot(o.pos.x - cx, o.pos.z - cz) < o.r + u.r + 0.4))) return false
  return true
}
function hullFits(G, u, i, { minX, maxX }, others, f) {
  const nav = G.nav, fp = u.t.fp
  if (!(Number.isInteger(f) && f >= 0 && f < 8)) return false
  const cx = nav.x(i), cz = nav.z(i), row = fp.H[f]
  for (const d of row) {
    const x = cx + d.ix * fp.cell
    if (x - d.r < minX - 0.01 || x + d.r > maxX + 0.01) return false
  }
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
export function deployArmies(G) {
  const { W, H, deploy } = G.board
  for (const side of [0, 1]) {
    const sx = edgeOf(G, side)
    const list = G.units.filter((u) => u.side === side)
    const placed = []
    const back = list.filter((u) => u.t.deployRow === 'back')
    const mid = list.filter((u) => u.t.deployRow === 'mid')
    const front = list.filter((u) => u.t.deployRow === 'front')
    const rows = [
      [front, W / 2 - deploy + 1.8],
      [mid, W / 2 - deploy + 3.6],
      [back, W / 2 - 2.4],
    ]
    for (const [row, depth] of rows) {
      row.forEach((u, i) => {
        // each army lists its units from its own left
        const z = ((i + 0.5) / row.length - 0.5) * (H - 6) * -sx
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
