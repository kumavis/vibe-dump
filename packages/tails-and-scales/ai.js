import { CHARGE_RANGE, AURA, expected, p2D6, pD6, hitNeed, attackCount } from './rules.js'
import { wait } from './util.js'
import { draw } from './core/rng.js'
import { hypot } from './core/dmath.js'

// ---------------------------------------------------------------------------
// The opponent. No search, just a general's instincts written as scores:
// shooters want targets they can see from cover, brawlers want to end their
// move within a likely charge, troops want objectives, artillery wants to sit
// still, heroes want friends around them. It plays through exactly the same
// actions a human does, so every roll is animated and logged the same way.
// ---------------------------------------------------------------------------

// Each unit type names its AI role in the race data (`t.ai`); the roles act
// in this order, brawlers first and the guns last.
const ORDER = ['melee', 'raider', 'line', 'shooter', 'hero', 'artillery']

export async function aiPhase(api, side, phase) {
  if (phase === 'move') await aiMove(api, side)
  else if (phase === 'shoot') await aiShoot(api, side)
  else if (phase === 'charge') await aiCharge(api, side)
}

const worth = (u) => (u.t.pts * u.alive) / u.t.models

function meleeValue(a, d) {
  if (!a.t.melee) return 0
  return expected(a.alive * a.t.A, hitNeed(a.t.WS, a.mesmerized ? 1 : 0), a.t.melee, d, false).value
}

// Expected points of `e` removed by `u` shooting from `from`.
function shotValue(api, u, e, from, moved) {
  const w = u.t.ranged
  if (!w) return 0
  const g = hypot(e.pos.x - from.x, e.pos.z - from.z) - u.r - e.r
  if (g > w.range) return 0
  if (api.isEngaged(e) && !w.spell) return 0
  const s = api.sight(u, e, from)
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

// ── Movement ────────────────────────────────────────────────────────────────
async function aiMove(api, side) {
  const mine = api.units.filter((u) => u.side === side && api.alive(u))
  mine.sort((a, b) => ORDER.indexOf(a.t.ai) - ORDER.indexOf(b.t.ai))
  const claimed = new Set()
  for (const u of mine) {
    if (!api.alive(u) || u.flags.moved) continue
    const role = u.t.ai
    if (api.isEngaged(u)) {
      // brawlers stay stuck in; anyone else gets out if the fight is going badly
      const foes = api.engagedWith(u)
      const theirs = foes.reduce((s, e) => s + meleeValue(e, u), 0)
      const ours = foes.reduce((s, e) => Math.max(s, meleeValue(u, e)), 0)
      if (role === 'melee' || role === 'line' || ours >= theirs * 0.8) continue
      const plan = api.movePlan(u)
      let best = -1, bs = -Infinity
      for (let i = 0; i < api.nav.N; i += 2) {
        if (!api.validEnd(plan, i)) continue
        const x = api.nav.x(i), z = api.nav.z(i)
        const s = Math.min(...api.enemiesOf(u).map((e) => hypot(e.pos.x - x, e.pos.z - z) - e.r))
        if (s > bs) {
          bs = s
          best = i
        }
      }
      if (best >= 0) {
        api.focus(u.pos.x, u.pos.z)
        await api.doMove(u, best, plan)
      }
      continue
    }
    // a unit its player already advanced (before pressing Auto) moves on that
    // roll; it never advances twice
    let plan = api.movePlan(u, u.flags.advanced ? u.flags.advRoll : 0)
    let pick = bestSpot(api, u, plan, claimed)
    // Advance when the extra inches are worth more than what it forfeits:
    // brawlers still far from a charge, shooters with nothing to shoot yet.
    const nearest = Math.min(...api.enemiesOf(u).map((e) => api.gap(u, e)))
    let advance = false
    if (role === 'melee' || role === 'line' || role === 'raider') {
      advance = nearest > u.t.M + 8 && !(role === 'line' && pick.onObjective) && !(role === 'raider' && pick.canShoot)
    } else if (role === 'shooter') {
      advance = !pick.canShoot && !pick.onObjective && (u.t.ranged.assault || nearest > u.t.ranged.range + u.t.M + 3)
    }
    if (advance && !u.flags.advanced) {
      api.focus(u.pos.x, u.pos.z)
      const r = await api.doAdvance(u)
      plan = api.movePlan(u, r)
      const adv = bestSpot(api, u, plan, claimed)
      if (adv.cell >= 0) pick = adv
    }
    if (pick.obj >= 0) claimed.add(pick.obj)
    if (pick.cell >= 0 && pick.dist > 0.4) {
      api.focus(u.pos.x, u.pos.z)
      await api.doMove(u, pick.cell, plan)
    } else if (u.flags.advanced) {
      u.flags.moved = true
    }
    await wait(0.05)
  }
}

function bestSpot(api, u, plan, claimed) {
  const { nav } = api
  const enemies = api.enemiesOf(u)
  const friends = api.friendsOf(u)
  const owners = api.objectives.map((o) => api.controlOf(o))
  const role = u.t.ai
  const ctx = { enemies, friends, owners, claimed, role }
  // stay put is always an option
  let best = { cell: -1, score: score(api, u, u.pos.x, u.pos.z, ctx, false), dist: 0, ...ctx.last }
  const step = u.t.M > 8 ? 3 : 2 // sample on a 1" or 1.5" lattice
  const res = plan.res
  for (let iz = 0; iz < nav.nz; iz += step) {
    for (let ix = (iz / step) % 2 ? 1 : 0; ix < nav.nx; ix += step) {
      const i = iz * nav.nx + ix
      if (!isFinite(res.dist[i])) continue
      if (!api.validEnd(plan, i)) continue
      const x = nav.x(i), z = nav.z(i)
      const sc = score(api, u, x, z, ctx, true) + draw(api.G.rng) * 0.05
      if (sc > best.score) best = { cell: i, score: sc, dist: hypot(x - u.pos.x, z - u.pos.z), ...ctx.last }
    }
  }
  return best
}

function score(api, u, x, z, ctx, moving) {
  const { enemies, friends, owners, claimed, role } = ctx
  const t = u.t
  const from = { x, z }
  const moved = moving && hypot(x - u.pos.x, z - u.pos.z) > 0.3
  let s = 0
  let onObjective = false, obj = -1
  // objectives — troops lean on them hardest
  if (t.OC > 0) {
    const pull = role === 'line' || role === 'shooter' ? 5 : role === 'melee' ? 2 : 2.5
    let bestObj = 0
    for (const o of api.objectives) {
      const d = hypot(o.x - x, o.z - z)
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
      const v = shotValue(api, u, e, from, moved)
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
      const back = meleeValue(e, u) * 0.4
      const v = p * (meleeValue(u, e) - back + (e.t.role === 'Artillery' ? 10 : 0))
      if (v > best) best = v
    }
    const w = role === 'melee' ? 0.3 : role === 'raider' ? 0.18 : role === 'hero' ? 0.06 : 0.15
    s += best * w
    // far from everything: just close the distance
    if (best === 0 && role !== 'hero') {
      const near = Math.min(...enemies.map((e) => hypot(e.pos.x - x, e.pos.z - z)))
      s -= near * (role === 'melee' ? 0.12 : 0.05)
    }
  }
  // danger: enemy brawlers who could reach here next turn, guns that can see us
  const fragile = role === 'shooter' || role === 'artillery' || role === 'hero'
  for (const e of enemies) {
    const g = hypot(e.pos.x - x, e.pos.z - z) - u.r - e.r
    if (e.t.brawler && g < e.t.M + 7) s -= meleeValue(e, u) * (fragile ? 0.16 : 0.05) * (1 - g / (e.t.M + 7))
  }
  // cover and staying put
  const ci = api.nav.index(x, z)
  if (ci >= 0 && api.nav.cover[ci]) s += fragile ? 1.5 : 0.5
  if (role === 'artillery' && moved) s -= 2.5
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

// ── Shooting ────────────────────────────────────────────────────────────────
async function aiShoot(api, side) {
  const mine = api.units.filter((u) => u.side === side && api.canShoot(u))
  mine.sort((a, b) => ORDER.indexOf(b.t.ai) - ORDER.indexOf(a.t.ai))
  for (const u of mine) {
    if (!api.canShoot(u)) continue
    const targets = api.shootTargets(u)
    let best = null, bv = 0.4
    for (const e of targets) {
      let v = shotValue(api, u, e, u.pos, u.flags.moved)
      const w = u.t.ranged
      if (w.blast) {
        // count the cost of a scatter landing on our own lads
        for (const f of api.units) {
          if (f.side !== u.side || !api.alive(f)) continue
          const g = hypot(f.pos.x - e.pos.x, f.pos.z - e.pos.z) - f.r
          if (g < w.blast + 2.5) v -= worth(f) * 0.25 * (1 - Math.max(0, g) / (w.blast + 2.5))
        }
      }
      if (w.mesmerize && e.mesmerized) v *= 0.2
      if (v > bv) {
        bv = v
        best = e
      }
    }
    if (best) {
      api.focus((u.pos.x + best.pos.x) / 2, (u.pos.z + best.pos.z) / 2)
      await api.doShoot(u, best)
      await wait(0.1)
    }
  }
}

// ── Charges ─────────────────────────────────────────────────────────────────
async function aiCharge(api, side) {
  const mine = api.units.filter((u) => u.side === side && api.canCharge(u))
  mine.sort((a, b) => ORDER.indexOf(a.t.ai) - ORDER.indexOf(b.t.ai))
  for (const u of mine) {
    if (!api.canCharge(u)) continue
    const role = u.t.ai
    let best = null, bs = 0
    for (const e of api.chargeTargets(u)) {
      const plan = api.chargePlan(u, e)
      if (!plan) continue
      const p = p2D6(plan.need)
      const gain = meleeValue(u, e) + (e.t.role === 'Artillery' ? 12 : 0) + (e.alive <= 2 ? 6 : 0)
      const loss = meleeValue(e, u)
      const min = role === 'melee' ? 0.25 : role === 'line' ? 0.33 : role === 'raider' ? 0.4 : role === 'hero' ? 0.5 : 0.6
      if (p < min) continue
      if ((role === 'shooter' || role === 'hero') && gain < loss * 1.4) continue
      const sc = p * (gain - loss * 0.4)
      if (sc > bs) {
        bs = sc
        best = e
      }
    }
    if (best) {
      api.focus((u.pos.x + best.pos.x) / 2, (u.pos.z + best.pos.z) / 2)
      await api.doCharge(u, best, { auto: true })
      await wait(0.1)
    }
  }
}

