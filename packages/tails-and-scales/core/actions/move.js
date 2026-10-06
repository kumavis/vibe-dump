// Movement's rules: where a unit may go this phase and how it gets there.
// (Its read-only half; the move itself is still main.js's doMove, awaited
// by its animation, until R5 makes it synchronous here.)
import { BOARD, ENGAGE } from '../rules.js'
import { hypot } from '../dmath.js'
import { refreshNav } from '../match.js'
import { alive, enemiesOf, isEngaged } from '../queries.js'

export function moveMode(u) {
  return u.t.move
}

// Cells a unit may not enter: within 1" of an enemy (or just their bases when
// falling back / charging). `onlyBodies` lists whose bases only count.
export function forbidMask(G, u, pad, onlyBodies = []) {
  const { W, H } = BOARD, nav = G.nav
  const f = new Uint8Array(nav.N)
  f.discs = [] // the exact shapes, for nav.walkable's straight-line shortcuts
  for (const e of enemiesOf(G, u)) {
    const R = e.r + u.r + (onlyBodies.includes(e) ? 0.02 : pad)
    f.discs.push({ x: e.pos.x, z: e.pos.z, R: R - 0.02 })
    const i0x = Math.max(0, Math.floor((e.pos.x - R + W / 2) / nav.cell)), i1x = Math.min(nav.nx - 1, Math.floor((e.pos.x + R + W / 2) / nav.cell))
    const i0z = Math.max(0, Math.floor((e.pos.z - R + H / 2) / nav.cell)), i1z = Math.min(nav.nz - 1, Math.floor((e.pos.z + R + H / 2) / nav.cell))
    for (let iz = i0z; iz <= i1z; iz++) for (let ix = i0x; ix <= i1x; ix++) {
      const i = iz * nav.nx + ix
      if (hypot(nav.x(i) - e.pos.x, nav.z(i) - e.pos.z) < R) f[i] = 1
    }
  }
  return f
}

// Everything the movement phase needs for one unit: where it can go and how.
export function movePlan(G, u, extra = 0) {
  refreshNav(G)
  const fallback = isEngaged(G, u)
  const max = u.t.M + extra
  const mode = moveMode(u)
  const enemies = enemiesOf(G, u)
  // falling back may walk through the 1" bubble but not through bases
  const forbid = forbidMask(G, u, ENGAGE + 0.05, fallback ? enemies : [])
  const endForbid = forbidMask(G, u, ENGAGE + 0.05)
  const res = G.nav.reach(u.pos.x, u.pos.z, { r: u.r, max, mode: mode === 'fly' ? 'fly' : mode, forbid: mode === 'fly' ? null : forbid })
  return { u, res, max, mode, forbid, endForbid, fallback }
}

// May the plan's unit end its move on cell i?
export function validEnd(G, plan, i) {
  const { u, res, mode, endForbid } = plan
  const nav = G.nav
  if (i < 0 || !isFinite(res.dist[i])) return false
  if (!nav.standable(i, u.r, mode === 'wreck' ? 'wreck' : 'walk', endForbid)) return false
  const x = nav.x(i), z = nav.z(i)
  for (const o of G.units) if (o !== u && alive(o) && hypot(o.pos.x - x, o.pos.z - z) < o.r + u.r + 0.08) return false
  return true
}

// The valid end cell nearest (x, z), within `within` inches; -1 for none.
export function nearestValid(G, plan, x, z, within = 2.4) {
  const nav = G.nav
  let best = -1, bd = within
  const c = nav.index(x, z)
  if (c < 0) return -1
  const R = Math.ceil(within / nav.cell)
  const cx = c % nav.nx, cz = (c / nav.nx) | 0
  for (let dz = -R; dz <= R; dz++) for (let dx = -R; dx <= R; dx++) {
    const ix = cx + dx, iz = cz + dz
    if (ix < 0 || iz < 0 || ix >= nav.nx || iz >= nav.nz) continue
    const i = iz * nav.nx + ix
    const d = hypot(nav.x(i) - x, nav.z(i) - z)
    if (d < bd && validEnd(G, plan, i)) {
      bd = d
      best = i
    }
  }
  return best
}
