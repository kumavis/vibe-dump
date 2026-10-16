// Movement (DESIGN §1.1): where a unit may go this phase and how it gets
// there; the movement phase's actions (a move, which is also an advance's
// move and a fall back, and the advance roll itself); and the walk
// (resolveWalk), which both a move and a charge take.
//
// Synchronous, like damage.js: what the old code waited on is an event in
// the match's out at the same place (DESIGN §2.3, §4.1 rule 3): the advance
// roll's tray and dice (`tray.open`, `dice`), and the walk (`unit.move`,
// which the view plays back along its path). No logic moves across an
// emit, and building an event draws nothing and changes nothing.
//
// Neither action ends itself (its state line in the trace, the flags, the
// labels): through R5 main.js's finishAction does, once these events have
// played, so no state line is written while the view is behind (the ?debug
// trace's hold: DESIGN's R5a and R5b notes); from R6 the engine's. The
// advance roll writes no `act` line at all (§4.1 rule 8).
import { BOARD, ENGAGE, roll } from '../rules.js'
import { hypot } from '../dmath.js'
import { lerp } from '../util.js'
import { emit, log } from '../journal.js'
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

// ── The movement phase's actions ────────────────────────────────────────────
// `u` moves to `cell`, one validEnd accepts of `plan` (movePlan's, made with
// the advance roll when the unit advanced): by the shortest route there,
// smashing what a wrecker passes, and the nav grid follows. An engaged unit's
// plan is a fall back. The log line gives the route's length before the
// walk, as it always has; a wrecker setting off on a move of more than 0.1"
// stomps (`stomp`: the old boom, the view's), which its charge never did.
// With no `plan`, it is made afresh from the unit's flags, as R6's `move`
// command, which carries only the unit and the cell, will make it (and as
// every move through main.js is made already, so parity holds each corpus
// move made on the remade plan to the old move, made on the plan the seat
// or the AI picked from; a one-off probe at R5c found the plans
// deep-equal too).
export function doMove(G, u, cell, plan = movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0)) {
  const pts = G.nav.path(plan.res, cell, u.r, plan.mode === 'fly' ? null : plan.forbid)
  u.flags.moved = true
  if (plan.fallback) u.flags.fellBack = true
  const L = pathLength(pts)
  log(G, u.side, `<b>${u.t.short}</b> ${plan.fallback ? 'fall back' : u.flags.advanced ? 'advance' : 'move'} ${L.toFixed(1)}".`)
  resolveWalk(G, u, pts, { fly: plan.mode === 'fly', stomp: u.t.wrecker && L > 0.1 })
  // (the nav follows the walk, at today's site: DESIGN §4.1 rule 9)
  refreshNav(G)
}

// `u` advances: a D6 more inches for its move this phase (its move is a
// doMove on movePlan(G, u, roll)), at the price the rules set (no shooting
// unless assault, no charge unless it may charge after advancing). Returns
// the roll. No `act` line: the move that follows writes it (§4.1 rule 8).
export function doAdvance(G, u) {
  emit(G, 'tray.open', { title: `${u.t.short} — Advance` })
  const r = roll(G, 1)
  emit(G, 'dice', { label: 'Advance D6', dice: r, need: 0, sum: true, note: `+${r[0]}"` })
  u.flags.advanced = true
  u.flags.advRoll = r[0]
  log(G, u.side, `<b>${u.t.short}</b> advance: +${r[0]}".`)
  return r[0]
}

// An advanced unit the AI leaves where it is: its move is spent (the AI's
// own, never a seat's command: DESIGN §2.2). No event and no line, as ever.
export function hold(G, u) {
  u.flags.moved = true
}

// ── The walk ────────────────────────────────────────────────────────────────
// A unit goes along `pts` (DESIGN §2.3's resolveWalk, §4.1 rule 7), all at
// once: a wrecker smashes what it passes at fixed 0.25" samples along the
// path plus its end point, in order, so what breaks (and which way trees
// fall) never depends on the frame rate; then the unit stands where the
// walk's last frame always put it (the k=1 lerp along the path, not
// pts.at(-1)). A path under 0.05" moves nothing and smashes nothing.
//
//   unit.move { u, path: [{ x, z }], L, speed, fly, stomp, smashes: [{ s, ev }], to: { x, z } }
//
// The view walks the unit along `path` (L long, at `speed` inches a second,
// flying or not, stomping off as it sets out when `stomp`: all three are
// how it looks, which the caller says) and breaks what each sample smashed
// (`ev`, its terrain events) as the walker comes `s` along; `to` is where
// the unit stands. Then `objectives` and `status`: the flags and labels as
// the walk left them (the old walk turned a flag the frame it crossed; this
// turns it as the walk ends).
export function resolveWalk(G, u, pts, { speed = 7, fly = false, stomp = false } = {}) {
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
    emit(G, 'unit.move', { u: u.id, path: pts.map((p) => ({ x: p.x, z: p.z })), L, speed, fly, stomp, smashes, to: { x: u.pos.x, z: u.pos.z } })
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
