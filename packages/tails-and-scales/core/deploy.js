// Deployment: where the armies start, and where a unit may be put during
// its seat's deployment.
import { hypot } from './dmath.js'
import { edgeOf } from './match.js'
import { setUnitPos } from './units.js'

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
// legality, core/commands.js.)
export function fits(G, u, i, { minX, maxX }, others) {
  const nav = G.nav
  const cx = nav.x(i), cz = nav.z(i)
  if (cx - u.r < minX - 0.01 || cx + u.r > maxX + 0.01) return false
  if (!nav.standable(i, u.r, 'walk')) return false
  if (others.some((o) => hypot(o.pos.x - cx, o.pos.z - cz) < o.r + u.r + 0.4)) return false
  return true
}

// May `u` be put on nav cell `c` in its own seat's zone, the other units
// standing where they are? (The 2.5" a click may land from the cell is the
// UI's own tolerance, not a rule.)
export function placeOk(G, u, c) {
  return Number.isInteger(c) && c >= 0 && c < G.nav.N && fits(G, u, c, zone(G, u.side), G.units.filter((o) => o !== u))
}

// Pick a spot near (x, z) inside the side's deployment zone. Cell centres
// only; null when nowhere fits. (S0, DESIGN §4.2.2) Only the zone's columns
// are visited, a column either side to spare (fits refuses every other
// first), row by row in the board's order, so the nearest found first is
// the one the whole board's scan found.
export function freeSpot(G, u, x, z, side, others) {
  const nav = G.nav
  let best = null, bd = Infinity
  const box = zone(G, side)
  const x0 = Math.max(0, Math.floor((box.minX + nav.W / 2) / nav.cell) - 1), x1 = Math.min(nav.nx - 1, Math.floor((box.maxX + nav.W / 2) / nav.cell) + 1)
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

// Both armies in their zones, seat 0's first: a front row, the heroes
// behind it, the artillery at the back.
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
        const p = freeSpot(G, u, sx * depth, z, side, placed) || { x: sx * depth, z }
        setUnitPos(u, p.x, p.z)
        placed.push(u)
      })
    }
  }
}
