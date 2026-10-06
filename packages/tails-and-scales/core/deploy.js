// Deployment: where the armies start, and where a unit may be put during
// its seat's deployment.
import { BOARD } from './rules.js'
import { hypot } from './dmath.js'
import { edgeOf } from './match.js'
import { setUnitPos } from './units.js'

// Pick a spot near (x, z) inside the side's deployment zone: the strip
// BOARD.deploy deep along its seat's edge. Cell centres only; null when
// nowhere fits.
export function freeSpot(G, u, x, z, side, others) {
  const { W } = BOARD, nav = G.nav
  let best = null, bd = Infinity
  const edge = edgeOf(G, side), outer = edge * (W / 2), inner = edge * (W / 2 - BOARD.deploy)
  const minX = Math.min(outer, inner), maxX = Math.max(outer, inner)
  for (let i = 0; i < nav.N; i++) {
    const cx = nav.x(i), cz = nav.z(i)
    if (cx - u.r < minX - 0.01 || cx + u.r > maxX + 0.01) continue
    if (!nav.standable(i, u.r, 'walk')) continue
    if (others.some((o) => hypot(o.pos.x - cx, o.pos.z - cz) < o.r + u.r + 0.4)) continue
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
  const { W, H } = BOARD
  for (const side of [0, 1]) {
    const sx = edgeOf(G, side)
    const list = G.units.filter((u) => u.side === side)
    const placed = []
    const back = list.filter((u) => u.t.deployRow === 'back')
    const mid = list.filter((u) => u.t.deployRow === 'mid')
    const front = list.filter((u) => u.t.deployRow === 'front')
    const rows = [
      [front, W / 2 - BOARD.deploy + 1.8],
      [mid, W / 2 - BOARD.deploy + 3.6],
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
