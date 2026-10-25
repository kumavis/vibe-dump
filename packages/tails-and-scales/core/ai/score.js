// What the AI thinks things are worth (DESIGN §1.1): a unit's points, a
// fight's or a shot's expected haul, and how good a spot on the table is
// for a unit of each role. No search, just a general's instincts written as
// scores: shooters want targets they can see from cover, brawlers want to
// end their move within a likely charge, troops want objectives, artillery
// wants to sit still, heroes want friends around them.
//
// AI code is rules code (DESIGN §4.1 rule 10): it runs inside the fold on
// every peer, and bestSpot's tie-breaks draw from the match's own dice, one
// draw per lattice cell that passes `isFinite(res.dist[i]) && validEnd`, in
// the lattice's order (rule 6). Everything else here only reads the match.
import { CHARGE_RANGE, AURA, expected, p2D6, pD6, hitNeed, attackCount } from '../rules.js'
import { draw } from '../rng.js'
import { hypot } from '../dmath.js'
import { enemiesOf, friendsOf, isEngaged, inCover, sight, controlOf, validEnd, levelDist, floorAt } from '../queries.js'
import { climbs } from '../actions/move.js'

// a unit's points still standing
export const worth = (u) => (u.t.pts * u.alive) / u.t.models

export function meleeValue(a, d) {
  if (!a.t.melee) return 0
  return expected(a.alive * a.t.A, hitNeed(a.t.WS, a.mesmerized ? 1 : 0), a.t.melee, d, false).value
}

// Expected points of `e` removed by `u` shooting from `from`. (S1) `pre`,
// when given, is what bestSpot worked out about `e` once for its whole
// scan (its `engaged` and `cover`: the same values, asked once).
export function shotValue(G, u, e, from, moved, pre = null) {
  const w = u.t.ranged
  if (!w) return 0
  const g = hypot(e.pos.x - from.x, e.pos.z - from.z) - u.r - e.r
  if (g > w.range) return 0
  if ((pre ? pre.engaged : isEngaged(G, e)) && !w.spell) return 0
  const s = sight(G, u, e, from, pre?.cover)
  if (!s.visible && !w.indirect && !w.mesmerize) return 0
  if (w.mesmerize) {
    if (!s.visible) return 0
    return p2D6(w.spell) * (worth(e) * 0.25 + Math.min(2, e.alive) * e.t.pts * 0.08 + (e.t.ranged?.blast ? 8 : 0))
  }
  let mod = 0
  if (w.heavy && moved) mod++
  if (w.indirect && !s.visible) mod++
  if (w.blast) {
    const pHit = w.spell ? p2D6(w.spell) : pD6(hitNeed(u.t.BS, mod))
    const under = e.t.big ? 3 : Math.max(1, Math.min(e.alive, Math.round(e.alive * Math.min(1, (w.blast * w.blast) / (e.r * e.r)) * 0.8)))
    return attackCount(u, w, false) * pHit * expected(under, 1, w, e, s.cover).value
  }
  return expected(attackCount(u, w, false), hitNeed(u.t.BS, mod), w, e, s.cover).value
}

// The cells of the board within `reach` inches of (x, z), as rows and
// columns, a cell either side to spare: (S0, DESIGN §4.2.2) a plan of at
// most `reach` reaches no cell outside it (every finite cell of a reach lies
// within its `max` of the start, the path being no shorter than the
// straight line), so a scan over a plan's cells may skip the rest of the
// board, in the same order, and draw where it drew.
export function scanBox(nav, x, z, reach) {
  const span = reach + nav.cell
  return {
    x0: Math.max(0, Math.floor((x - span + nav.W / 2) / nav.cell)), x1: Math.min(nav.nx - 1, Math.floor((x + span + nav.W / 2) / nav.cell)),
    z0: Math.max(0, Math.floor((z - span + nav.H / 2) / nav.cell)), z1: Math.min(nav.nz - 1, Math.floor((z + span + nav.H / 2) / nav.cell)),
  }
}

// The best spot for `u` to end its move on `plan` (movePlan's): staying put
// is always an option, then every cell of a 1" or 1.5" lattice it may end
// on, each scored with a small random tie-break off the match's dice (the
// lattice scan and its draws are behaviour: DESIGN §4.1 rule 6). (S0) The
// lattice is walked only inside the plan's box (scanBox), on the board's
// own rows and columns: row iz a multiple of the step, its columns from
// its offset (1 on odd lattice rows) in steps, as the whole board's scan
// visited them.
export function bestSpot(G, u, plan, claimed) {
  const { nav } = G
  const enemies = enemiesOf(G, u)
  const friends = friendsOf(G, u)
  const owners = G.objectives.map((o) => controlOf(G, o))
  const role = u.t.ai
  // (S1, DESIGN §4.2.2) what the scan asks of each enemy at every cell, none
  // of which a cell changes, worked out once: whether it is engaged and in
  // cover, and the fight's value either way
  const pre = new Map(enemies.map((e) => [e, { engaged: isEngaged(G, e), cover: inCover(G, e), hit: meleeValue(u, e), back: meleeValue(e, u) }]))
  const ctx = { enemies, friends, owners, claimed, role, pre }
  // stay put is always an option
  let best = { cell: -1, score: score(G, u, u.pos.x, u.pos.z, ctx, false), dist: 0, ...ctx.last }
  const step = u.t.M > 8 ? 3 : 2 // sample on a 1" or 1.5" lattice
  const res = plan.res
  const box = scanBox(nav, res.sx, res.sz, plan.max)
  for (let iz = Math.ceil(box.z0 / step) * step; iz <= box.z1; iz += step) {
    const off = (iz / step) % 2 ? 1 : 0
    for (let ix = off + Math.max(0, Math.ceil((box.x0 - off) / step)) * step; ix <= box.x1; ix += step) {
      const i = iz * nav.nx + ix
      if (!isFinite(res.dist[i])) continue
      if (!validEnd(G, plan, i)) continue
      const x = nav.x(i), z = nav.z(i)
      const sc = score(G, u, x, z, ctx, true) + draw(G.rng) * 0.05
      if (sc > best.score) best = { cell: i, score: sc, dist: hypot(x - u.pos.x, z - u.pos.z), ...ctx.last }
    }
  }
  return best
}

// Where an engaged unit getting out of a fight falls back to, on `plan`
// (movePlan's, a fall back): the valid end farthest from the nearest enemy's
// base, over every other cell of the board (the even indices), the first
// found of the farthest; -1 for none. (S0) Only the cells inside the plan's
// box are visited (scanBox), in the board's order: none outside is a valid
// end.
export function fallbackSpot(G, u, plan) {
  let best = -1, bs = -Infinity
  const nav = G.nav, box = scanBox(nav, plan.res.sx, plan.res.sz, plan.max)
  for (let iz = box.z0; iz <= box.z1; iz++) {
    const row = iz * nav.nx
    for (let i = row + box.x0 + ((row + box.x0) % 2); i <= row + box.x1; i += 2) {
      if (!validEnd(G, plan, i)) continue
      const x = nav.x(i), z = nav.z(i)
      const s = Math.min(...enemiesOf(G, u).map((e) => hypot(e.pos.x - x, e.pos.z - z) - e.r))
      if (s > bs) {
        bs = s
        best = i
      }
    }
  }
  return best
}

// How good (x, z) is for `u`, by its role. Leaves what it found in ctx.last:
// whether the spot is on an objective (and which), and whether u could
// shoot from it.
//
// (F7a, DESIGN §4.2.4's AI; rule 10: it bumps with F7a) With height the
// objective and approach terms measure the way there (levelDist: up the
// stairs, or the ladders for a climber, rather than through the wall), and
// shooters and artillery like raised ground: +0.25 an inch of floor, up to
// 4". What climbing costs reaches the score through the plan's distances
// (validEnd's), already paid for; nothing else changes.
export function score(G, u, x, z, ctx, moving) {
  const { enemies, friends, owners, claimed, role, pre } = ctx
  const t = u.t
  const from = { x, z }
  const high = G.nav.hasHeight, climb = high && climbs(u)
  const moved = moving && hypot(x - u.pos.x, z - u.pos.z) > 0.3
  let s = 0
  let onObjective = false, obj = -1
  // objectives — troops lean on them hardest
  if (t.OC > 0) {
    const pull = role === 'line' || role === 'shooter' ? 5 : role === 'melee' ? 2 : 2.5
    let bestObj = 0
    for (const o of G.objectives) {
      const d = high ? levelDist(G, from, o, climb) : hypot(o.x - x, o.z - z)
      const want = owners[o.i] === u.side ? 0.45 : 1
      const taken = claimed.has(o.i) ? 0.25 : 1
      let v
      if (d <= 2.6) v = pull * want * taken * 1.4
      else v = pull * want * taken * Math.max(0, 1 - (d - 2.6) / 16) * 0.7
      if (v > bestObj) {
        bestObj = v
        if (d <= 2.6) {
          onObjective = true
          obj = o.i
        } else if (!onObjective) obj = -1
      }
    }
    s += bestObj
  }
  // shooting from here
  let canShoot = false
  if (t.ranged && role !== 'melee') {
    let best = 0
    for (const e of enemies) {
      const v = shotValue(G, u, e, from, moved, pre.get(e))
      if (v > best) best = v
    }
    if (best > 0) canShoot = true
    const w = role === 'artillery' ? 0.25 : role === 'hero' ? 0.12 : 0.18
    // an Advance would forfeit the shot unless the weapon is Assault
    s += best * w * (u.flags.advanced && !t.ranged.assault ? 0 : 1)
  }
  // charging from here
  if (role === 'melee' || role === 'line' || role === 'raider' || role === 'hero') {
    let best = 0
    for (const e of enemies) {
      const g = hypot(e.pos.x - x, e.pos.z - z) - u.r - e.r
      if (g > CHARGE_RANGE) continue
      const p = g <= 1 ? 1 : p2D6(Math.ceil(g))
      const back = pre.get(e).back * 0.4
      const v = p * (pre.get(e).hit - back + (e.t.role === 'Artillery' ? 10 : 0))
      if (v > best) best = v
    }
    const w = role === 'melee' ? 0.3 : role === 'raider' ? 0.18 : role === 'hero' ? 0.06 : 0.15
    s += best * w
    // far from everything: just close the distance
    if (best === 0 && role !== 'hero') {
      const near = high ? Math.min(...enemies.map((e) => levelDist(G, from, e.pos, climb))) : Math.min(...enemies.map((e) => hypot(e.pos.x - x, e.pos.z - z)))
      s -= near * (role === 'melee' ? 0.12 : 0.05)
    }
  }
  // danger: enemy brawlers who could reach here next turn, guns that can see us
  const fragile = role === 'shooter' || role === 'artillery' || role === 'hero'
  for (const e of enemies) {
    const g = hypot(e.pos.x - x, e.pos.z - z) - u.r - e.r
    if (e.t.brawler && g < e.t.M + 7) s -= pre.get(e).back * (fragile ? 0.16 : 0.05) * (1 - g / (e.t.M + 7))
  }
  // cover and staying put
  const ci = G.nav.index(x, z)
  if (ci >= 0 && G.nav.cover[ci]) s += fragile ? 1.5 : 0.5
  if (role === 'artillery' && moved) s -= 2.5
  // (F7a) the high ground, for the guns
  if (high && (role === 'shooter' || role === 'artillery')) s += 0.25 * Math.min(4, floorAt(G, x, z))
  // heroes like company
  if (role === 'hero') {
    let n = 0
    for (const f of friends) if (hypot(f.pos.x - x, f.pos.z - z) <= AURA + f.r) n++
    s += Math.min(3, n) * 0.9
    const front = Math.min(...enemies.map((e) => hypot(e.pos.x - x, e.pos.z - z)))
    if (front < 8) s -= (8 - front) * 0.6
  }
  // don't bunch up for the blast templates
  for (const f of friends) {
    const g = hypot(f.pos.x - x, f.pos.z - z) - f.r - u.r
    if (g < 1.5) s -= (1.5 - g) * 0.6
  }
  ctx.last = { onObjective, obj, canShoot }
  return s
}
