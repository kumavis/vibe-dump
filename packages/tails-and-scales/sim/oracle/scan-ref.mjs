// The scans as they were before S0-S3 (DESIGN §4.2.2), kept as the
// reference sim/scale-check.mjs holds the core's to: every scan over the
// whole board, the AI's per-enemy facts asked afresh at every cell, and line
// of sight over every chunk. Each takes `M`, the code under test's modules
// (scale-check's coreOf), and uses only its helpers, so it judges the scans
// themselves, never the rules they call.

// bestSpot over the whole board's lattice (core/ai/score.js before S0),
// scoring as it did before S1 (refScore, below)
export function fullBestSpot(M, R, G, u, plan, claimed) {
  const { nav } = G
  const enemies = M.enemiesOf(G, u)
  const friends = M.friendsOf(G, u)
  const owners = G.objectives.map((o) => M.controlOf(G, o))
  const role = u.t.ai
  const ctx = { enemies, friends, owners, claimed, role }
  let best = { cell: -1, score: refScore(M, R, G, u, u.pos.x, u.pos.z, ctx, false), dist: 0, ...ctx.last }
  const step = u.t.M > 8 ? 3 : 2
  const res = plan.res
  for (let iz = 0; iz < nav.nz; iz += step) {
    for (let ix = (iz / step) % 2 ? 1 : 0; ix < nav.nx; ix += step) {
      const i = iz * nav.nx + ix
      if (!isFinite(res.dist[i])) continue
      if (!M.validEnd(G, plan, i)) continue
      const x = nav.x(i), z = nav.z(i)
      const sc = refScore(M, R, G, u, x, z, ctx, true) + M.draw(G.rng) * 0.05
      if (sc > best.score) best = { cell: i, score: sc, dist: M.hypot(x - u.pos.x, z - u.pos.z), ...ctx.last }
    }
  }
  return best
}

// the fall back's scan over every even cell of the board (core/ai/policy.js
// before S0)
export function fullFallback(M, G, u, plan) {
  let best = -1, bs = -Infinity
  for (let i = 0; i < G.nav.N; i += 2) {
    if (!M.validEnd(G, plan, i)) continue
    const x = G.nav.x(i), z = G.nav.z(i)
    const s = Math.min(...M.enemiesOf(G, u).map((e) => M.hypot(e.pos.x - x, e.pos.z - z) - e.r))
    if (s > bs) {
      bs = s
      best = i
    }
  }
  return best
}

// freeSpot over every cell of the board (core/deploy.js before S0)
export function fullFreeSpot(M, G, u, x, z, side, others) {
  const nav = G.nav
  let best = null, bd = Infinity
  const box = M.zone(G, side)
  for (let i = 0; i < nav.N; i++) {
    if (!M.fits(G, u, i, box, others)) continue
    const cx = nav.x(i), cz = nav.z(i)
    const d = M.hypot(cx - x, cz - z)
    if (d < bd) {
      bd = d
      best = { x: cx, z: cz }
    }
  }
  return best
}

// line of sight over every chunk, in order (core/terrain/terrain.js before
// S0b)
export function fullLos(M, terrain, a, b, ignoreR = 1.3) {
  let obscure = 0
  const dx = b.x - a.x, dy = b.y - a.y, dz = b.z - a.z
  const L2 = dx * dx + dz * dz
  for (const c of terrain.chunks) {
    if (!c.alive || !c.los) continue
    const s = c.shape
    let t = L2 > 0 ? ((s.x - a.x) * dx + (s.z - a.z) * dz) / L2 : 0
    t = t < 0 ? 0 : t > 1 ? 1 : t
    const px = a.x + dx * t - s.x, pz = a.z + dz * t - s.z
    if (px * px + pz * pz > s.reach * s.reach) continue
    if (!M.segmentHitsBox(a, dx, dy, dz, s)) continue
    if (c.los === 'block') return { blocked: true, obscure }
    if (M.hypot(s.x - a.x, s.z - a.z) < ignoreR + s.reach * 0.5) continue
    obscure++
  }
  return { blocked: obscure >= 2, obscure }
}

// shotValue and score as they were before S1 (core/ai/score.js): every
// per-enemy fact asked afresh, p2D6 counted, so P-scan judges S1's hoisting
// too, not only S0's bounds. (F7a's review) With height, F7a's terms as
// score has them (DESIGN §4.2.4's AI and the play-report's tuning): a
// walker's way by levelDist in the objective, charge and approach terms, an
// enemy walker's in the danger term (a flier's the straight line), and the
// guns' +0.25 an inch of floor, so P-scan can judge a fortified board;
// (F17) and the range a weapon reaches from the cell scored, the code's own
// rangeOf (a rule, which P-scan takes as the scans do: on code older than
// F17, the printed range); (F18) and a target locked in combat valued net
// of the shot's friendly fire, the code's own fightOf, strayCost and
// ownUnder asked afresh at every cell (bestSpot asks them once per enemy:
// P-scan judges that hoisting), where code older than F18 bars the shot;
// (F19a) and the powder keg's terms, the code's own kegGain, kegsOf,
// kegDanger, kegFear and kegWalk asked afresh at every cell (bestSpot asks
// the kegs, the danger and each enemy's gain once), where code older than
// F19a has none
const count2D6 = (need) => {
  let ok = 0
  for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= need) ok++
  return ok / 36
}

function refShotValue(M, R, G, u, e, from, moved) {
  const w = u.t.ranged
  if (!w) return 0
  const g = M.hypot(e.pos.x - from.x, e.pos.z - from.z) - u.r - e.r
  if (g > (M.rangeOf ? M.rangeOf(G, u, e, from) : w.range)) return 0
  if (!M.fightOf && M.isEngaged(G, e) && !w.spell) return 0
  const s = M.sight(G, u, e, from)
  if (!s.visible && !w.indirect && !w.mesmerize) return 0
  if (w.mesmerize) {
    if (!s.visible) return 0
    return count2D6(w.spell) * (M.worth(e) * 0.25 + Math.min(2, e.alive) * e.t.pts * 0.08 + (e.t.ranged?.blast ? 8 : 0))
  }
  let mod = 0
  if (w.heavy && moved) mod++
  if (w.indirect && !s.visible) mod++
  if (w.blast) {
    const pHit = w.spell ? count2D6(w.spell) : R.pD6(R.hitNeed(u.t.BS, mod))
    const under = e.t.big ? 3 : Math.max(1, Math.min(e.alive, Math.round(e.alive * Math.min(1, (w.blast * w.blast) / (e.r * e.r)) * 0.8)))
    const value = R.attackCount(u, w, false) * pHit * (R.expected(under, 1, w, e, s.cover).value - (M.ownUnder ? M.ownUnder(G, u, e) : 0))
    const keg = M.kegGain ? M.kegGain(G, u, e) : 0
    return keg ? value + pHit * keg : value
  }
  const n = R.attackCount(u, w, false), need = R.hitNeed(u.t.BS, mod)
  const fight = M.fightOf ? M.fightOf(G, u, e) : null
  return R.expected(n, need, w, e, s.cover).value - (fight ? M.strayCost(n, need, w, fight) : 0)
}

export function refScore(M, R, G, u, x, z, ctx, moving) {
  const { enemies, friends, owners, claimed, role } = ctx
  const t = u.t
  const from = { x, z }
  const high = G.nav.hasHeight, climb = high && M.climbs(u), walks = high && M.moveMode(u) !== 'fly'
  const moved = moving && M.hypot(x - u.pos.x, z - u.pos.z) > 0.3
  let s = 0
  let onObjective = false, obj = -1
  // objectives — troops lean on them hardest
  if (t.OC > 0) {
    const pull = role === 'line' || role === 'shooter' ? 5 : role === 'melee' ? 2 : 2.5
    let bestObj = 0
    for (const o of G.objectives) {
      const d = walks ? M.levelDist(G, from, o, climb) : M.hypot(o.x - x, o.z - z)
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
      const v = refShotValue(M, R, G, u, e, from, moved)
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
      const g = (walks ? M.levelDist(G, from, e.pos, climb) : M.hypot(e.pos.x - x, e.pos.z - z)) - u.r - e.r
      if (g > R.CHARGE_RANGE) continue
      const p = g <= 1 ? 1 : count2D6(Math.ceil(g))
      const back = M.meleeValue(e, u) * 0.4
      const v = p * (M.meleeValue(u, e) - back + (e.t.role === 'Artillery' ? 10 : 0))
      if (v > best) best = v
    }
    const w = role === 'melee' ? 0.3 : role === 'raider' ? 0.18 : role === 'hero' ? 0.06 : 0.15
    s += best * w
    // far from everything: just close the distance
    if (best === 0 && role !== 'hero') {
      const near = Math.min(...enemies.map((e) => (walks ? M.levelDist(G, from, e.pos, climb) : M.hypot(e.pos.x - x, e.pos.z - z))))
      s -= near * (role === 'melee' ? 0.12 : 0.05)
    }
  }
  // danger: enemy brawlers who could reach here next turn, guns that can see us
  const fragile = role === 'shooter' || role === 'artillery' || role === 'hero'
  for (const e of enemies) {
    const g = (high && M.moveMode(e) !== 'fly' ? M.levelDist(G, e.pos, from, M.climbs(e)) : M.hypot(e.pos.x - x, e.pos.z - z)) - u.r - e.r
    if (e.t.brawler && g < e.t.M + 7) s -= M.meleeValue(e, u) * (fragile ? 0.16 : 0.05) * (1 - g / (e.t.M + 7))
  }
  // cover and staying put
  const ci = G.nav.index(x, z)
  if (ci >= 0 && G.nav.cover[ci]) s += fragile ? 1.5 : 0.5
  if (role === 'artillery' && moved) s -= 2.5
  if (high && (role === 'shooter' || role === 'artillery')) s += 0.25 * Math.min(4, M.floorAt(G, x, z))
  // heroes like company
  if (role === 'hero') {
    let n = 0
    for (const f of friends) if (M.hypot(f.pos.x - x, f.pos.z - z) <= R.AURA + f.r) n++
    s += Math.min(3, n) * 0.9
    const front = Math.min(...enemies.map((e) => M.hypot(e.pos.x - x, e.pos.z - z)))
    if (front < 8) s -= (8 - front) * 0.6
  }
  // don't bunch up for the blast templates
  for (const f of friends) {
    const g = M.hypot(f.pos.x - x, f.pos.z - z) - f.r - u.r
    if (g < 1.5) s -= (1.5 - g) * 0.6
  }
  // (F19a) a powder keg's blast, and a wrecker's walk through a keg
  const kegs = M.kegsOf ? M.kegsOf(G) : []
  if (kegs.length) {
    if (M.kegDanger(G, u.side)) for (const k of kegs) s -= M.kegFear(u, k, from) * M.KEG_FEAR
    if (moved) s += M.kegWalk(G, u, from, kegs) * M.KEG_SMASH
  }
  ctx.last = { onObjective, obj, canShoot }
  return s
}
