// Movement's rules: where a unit may go this phase and how it gets there,
// and the walk itself (resolveWalk), which a charge's move takes. (The
// movement phase's move is still main.js's doMove, awaited by its old
// walk, until R5c puts it on resolveWalk too.)
import { BOARD, ENGAGE } from '../rules.js'
import { hypot } from '../dmath.js'
import { lerp } from '../util.js'
import { emit } from '../journal.js'
import { refreshNav } from '../match.js'
import { setUnitPos } from '../units.js'
import { pathLength } from '../nav.js'
import { alive, enemiesOf, isEngaged, ownersOf, statusOf } from '../queries.js'

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

// ── The walk ────────────────────────────────────────────────────────────────
// A unit goes along `pts` (DESIGN §2.3's resolveWalk, §4.1 rule 7), all at
// once: a wrecker smashes what it passes at fixed 0.25" samples along the
// path plus its end point, in order, so what breaks (and which way trees
// fall) never depends on the frame rate; then the unit stands where the
// walk's last frame always put it (the k=1 lerp along the path, not
// pts.at(-1)). A path under 0.05" moves nothing and smashes nothing.
//
//   unit.move { u, path: [{ x, z }], L, speed, fly, smashes: [{ s, ev }], to: { x, z } }
//
// The view walks the unit along `path` (L long, at `speed` inches a second,
// flying or not) and breaks what each sample smashed (`ev`, its terrain
// events) as the walker comes `s` along; `to` is where the unit stands.
// Then `objectives` and `status`: the flags and labels as the walk left
// them (the old walk turned a flag the frame it crossed; this turns it as
// the walk ends).
// (Through R5b only a charge moves this way: main.js's doMove still walks
// the old way until R5c.)
export function resolveWalk(G, u, pts, { speed = 7, fly = false } = {}) {
  const L = pathLength(pts)
  if (L < 0.05) return
  const seg = []
  let acc = 0
  for (let i = 1; i < pts.length; i++) {
    const l = hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z)
    seg.push({ a: pts[i - 1], b: pts[i], s: acc, l })
    acc += l
  }
  const smashes = []
  if (u.t.wrecker) {
    const samples = []
    for (const q of seg) for (let t = 0; t < q.l; t += 0.25) samples.push({ s: q.s + t, x: q.a.x + ((q.b.x - q.a.x) * t) / q.l, z: q.a.z + ((q.b.z - q.a.z) * t) / q.l, dir: Math.atan2(q.b.x - q.a.x, q.b.z - q.a.z) })
    // (a path of 0.05" or more has a last segment)
    const last = seg[seg.length - 1]
    samples.push({ s: L, x: pts[pts.length - 1].x, z: pts[pts.length - 1].z, dir: Math.atan2(last.b.x - last.a.x, last.b.z - last.a.z) })
    // (a quiet run, G.out null, keeps no events: the smashing is the same)
    for (const p of samples) {
      const ev = G.out ? [] : null
      if (smashAround(G, u, p, ev) && ev) smashes.push({ s: p.s, ev })
    }
  }
  // the walk's last frame: k = 1, so the distance along is L itself
  const end = seg.find((q) => L <= q.s + q.l) || seg[seg.length - 1]
  const f = end.l > 0 ? (L - end.s) / end.l : 1
  setUnitPos(u, lerp(end.a.x, end.b.x, f), lerp(end.a.z, end.b.z, f))
  // the walk, then the flags (who holds what) and the labels (who is in
  // combat) as it left them
  if (G.out) {
    emit(G, 'unit.move', { u: u.id, path: pts.map((p) => ({ x: p.x, z: p.z })), L, speed, fly, smashes, to: { x: u.pos.x, z: u.pos.z } })
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
}

// The Brute ploughs through anything breakable in its way, at one sample of
// its walk ({ x, z, dir }: where, and which way it is heading). It walks the
// live chunk list (§4.1 rule 6), so a log a tree it felled leaves in its
// path is smashed in the same sweep. The terrain's events go into `out`
// (nowhere when it is null). Returns how many chunks it hit.
export function smashAround(G, u, { x, z, dir }, out) {
  let n = 0
  for (const c of G.terrain.chunks) {
    if (!c.alive || !c.destructible) continue
    const s = c.nav || c.shape
    if (hypot(s.x - x, s.z - z) < u.r + Math.max(s.hx, s.hz) * 0.8) {
      G.terrain.hurt(c, 99, { x: x - Math.sin(dir), z: z - Math.cos(dir) }, out)
      n++
    }
  }
  return n
}
