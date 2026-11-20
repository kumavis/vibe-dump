// (Breakthrough, DESIGN §4.2.12's AI) What an AI battle on a wall's board
// did: read off the match as it is folded (createMatch's `onTrace`, G at
// every trace line), never from the trace's text alone and never written
// into it. sim/play-report.mjs's Breakthrough row and sim/property.mjs's
// P-wall rows read its counts.
//
//   wallProbe(core, mods, attacker) → { trace(line, G), result() }
//   core: the code under test's core/index.js; mods: its
//   core/terrain/breakthrough.js (`BT`), core/ai/route.js (`R`) and
//   core/ai/policy.js (`P`, for CHARGE_OUT); attacker: the attacking seat
//
// result():
//   behindBy    the first round at whose end an attacking unit stood behind
//               the wall's outer face (its middle: faceDist > 0), or null
//   walkBy      the same, counting a unit that walks (no flier)
//   vpBy4       the attacker's VP at the end of round 4 (or its last)
//   crossings   [{ route, round, unit }]: each attacking unit's first
//               crossing of the face (its middle behind it at a command's
//               end), by where it stood then: 'flight' (a flier),
//               'ladders' (on a deck, or within 6 of a stair's ends),
//               'gate' (the passage's box), 'breach' (its line), 'wood'
//               (within 3 of the picket's column on the wood's side),
//               'other'
//   idle        [{ round, unit, x, z }]: an attacking unit, not engaged, its
//               middle in front of the face and within its radius and 2 of
//               it, standing where it stood at the end of its previous
//               movement phase (within 0.3), while its route field reaches
//               an objective from there: a route open to it, and two moves
//               running against the face
//   defMoves    defender units at the end of a movement phase of theirs
//   defFront    [{ round, unit, x, z, face, engaged }]: of those, each in
//               front of the face (faceDist < 0)
//   defCharge   [{ round, unit, face, target }]: a defender in front of the
//               face at the end of its charge phase, having charged (its
//               target's faceDist when it charged)
//   defRounds, defRoundsFront  defender unit-rounds (at each round's end)
//               and those in front of the face
//   deny        [{ round, obj, before, able, after }]: at the start of each
//               defender movement phase, each objective the attacker holds,
//               the defender's OC within its range then and after its
//               charges (its models within OBJECTIVE_RANGE and their base,
//               at the objective's level within 1.2 with height), and how
//               many of the defender's units could contest it this turn
//               (OC above 0, not locked in a fight, within their move and
//               the objective's range of it)
//   gateFell    the round the gate fell in, or null
//   rams        attacker movement phases in which the gate lost hit points
//   ramRun      the longest run of those, one phase after another
//   shooters    { deck, all }: defender unit-rounds of shooters that may
//               stand on a deck (a ranged weapon, not big, no vehicle, no
//               long hull) at a round's end, and those on a deck
//   counter     defender charges at a target behind the face
//   second      { lost, there }: defender unit-rounds once the attacker
//               holds the yard's objective (the one nearest the gate), and
//               of those, units within 4 of a second-line post
//   manned      { threatened, manned }: at each round's end, the objectives
//               an attacker stands within 12 of, and those a defender with
//               OC stands within 6 of (on it or beside it)
//   charges     the attacker's charges declared (its battle-log lines)
//   hullWood    of the idle, a hull (a long hull, or a base of 1.5 or
//               more) standing so within 6 of the wood's west mouth
const STEP = 0.4, HIGH = 1.2, RANGE = 3
const segD = (a, b, x, z) => {
  const dx = b.x - a.x, dz = b.z - a.z, L2 = dx * dx + dz * dz
  const t = L2 ? Math.max(0, Math.min(1, ((x - a.x) * dx + (z - a.z) * dz) / L2)) : 0
  return Math.hypot(a.x + dx * t - x, a.z + dz * t - z)
}
export function wallProbe(core, mods, attacker) {
  const { BT, R } = mods, def = 1 - attacker
  const res = {
    behindBy: null, walkBy: null, vpBy4: 0, crossings: [], idle: [], defMoves: 0, defFront: [], defCharge: [], defRounds: 0, defRoundsFront: 0,
    deny: [], gateFell: null, rams: 0, ramRun: 0, shooters: { deck: 0, all: 0 }, counter: 0, second: { lost: 0, there: 0 }, rounds: 0,
    manned: { threatened: 0, manned: 0 }, charges: 0, hullWood: 0,
  }
  let plan = null, round = 1, gateHp = null, run = 0, denyOpen = null, chargedBy = new Map()
  const crossed = new Set(), last = new Map()
  const fd = (u) => BT.faceDist(plan, u.pos.x, u.pos.z)
  const standing = (G, s) => G.units.filter((u) => u.side === s && u.alive > 0 && !u.aboard)
  const ocAt = (G, o, s) => {
    let c = 0
    const y = G.nav.hasHeight ? G.nav.floor[G.nav.index(o.x, o.z)] : 0
    for (const u of standing(G, s)) for (const m of u.models) {
      if (!m.alive) continue
      const x = u.pos.x + m.ox, z = u.pos.z + m.oz
      if (Math.hypot(x - o.x, z - o.z) > RANGE + u.t.base) continue
      if (G.nav.hasHeight && Math.abs(G.nav.floor[G.nav.index(x, z)] - y) > HIGH) continue
      c += u.t.OC
    }
    return c
  }
  const route = (G, u) => {
    if (u.t.move === 'fly') return 'flight'
    const i = G.nav.index(u.pos.x, u.pos.z)
    if (G.nav.hasHeight && G.nav.floor[i] > STEP) return 'ladders'
    const g = plan.gate.passage
    const dg = Math.hypot(Math.max(0, g.x0 - u.pos.x, u.pos.x - g.x1), Math.max(0, g.z0 - u.pos.z, u.pos.z - g.z1))
    const db = plan.breach ? segD(plan.breach.a, plan.breach.b, u.pos.x, u.pos.z) : Infinity
    const pk = plan.wood.picket, zs = Math.sign(pk.z.at(-1) - pk.z[0])
    const dw = zs * (u.pos.z - pk.z[0]) > -1 ? Math.min(3, Math.abs(u.pos.x - pk.x)) : Infinity
    const ds = Math.min(Infinity, ...plan.stairs.map((s) => Math.min(Math.hypot(s.lo.x - u.pos.x, s.lo.z - u.pos.z), Math.hypot(s.hi.x - u.pos.x, s.hi.z - u.pos.z))))
    const c = [['gate', dg], ['breach', db], ['wood', dw], ['ladders', ds]].sort((a, b) => a[1] - b[1])
    return c[0][1] < 6 ? c[0][0] : 'other'
  }
  const yardOf = (G) => G.objectives.reduce((a, o) => (!a || Math.hypot(o.x - plan.gate.x, o.z - plan.gate.z) < Math.hypot(a.x - plan.gate.x, a.z - plan.gate.z) ? o : a), null)
  function trace(line, G) {
    if (!plan) {
      plan = G.terrain.plan
      gateHp = G.terrain.byId(plan.gate.id).hp
    }
    const sp = line.indexOf(' '), kind = line.slice(0, sp)
    // (the attacker's charges declared, by its battle-log line)
    if (kind === 'log' && line.startsWith(`log ${attacker} `) && / charge .* — roll /.test(line)) res.charges++
    if (kind === 'act') {
      for (const u of standing(G, attacker)) {
        if (crossed.has(u.id) || !(fd(u) > 0)) continue
        crossed.add(u.id)
        res.crossings.push({ route: route(G, u), round, unit: u.t.short })
      }
      return
    }
    if (kind === 'phase') {
      const m = /^phase (\d):(\w+)/.exec(line)
      const s = +m[1], ph = m[2]
      if (s === def && ph === 'move') {
        // the deny's start: each objective the attacker holds
        denyOpen = G.objectives.filter((o) => core.q.controlOf(G, o) === attacker).map((o) => ({
          round, obj: o.i, before: ocAt(G, o, def),
          // (the defender's units that could contest it this turn: OC, not
          // locked in a fight, and within their move and the objective's
          // range of it, its middle's straight line)
          able: standing(G, def).filter((u) => u.t.OC > 0 && !core.q.isEngaged(G, u) && Math.hypot(u.pos.x - o.x, u.pos.z - o.z) - u.r <= u.t.M + RANGE).length,
        }))
      }
      if (s === def && ph === 'shoot') {
        for (const u of standing(G, def)) {
          res.defMoves++
          const f = fd(u)
          if (f < 0) res.defFront.push({ round, unit: u.t.short, x: +u.pos.x.toFixed(2), z: +u.pos.z.toFixed(2), face: +f.toFixed(2), engaged: core.q.isEngaged(G, u) })
        }
      }
      if (s === def && ph === 'charge') chargedBy = new Map(standing(G, def).map((u) => [u.id, { x: u.pos.x, z: u.pos.z }]))
      if (s === def && ph === 'fight') {
        for (const u of standing(G, def)) {
          const was = chargedBy.get(u.id)
          if (!was || Math.hypot(was.x - u.pos.x, was.z - u.pos.z) < 0.3) continue
          const foes = core.q.engagedWith(G, u)
          if (foes.some((e) => fd(e) > 0)) res.counter++
          const f = fd(u)
          if (f < 0) res.defCharge.push({ round, unit: u.t.short, face: +f.toFixed(2), target: foes.length ? +Math.max(...foes.map((e) => fd(e))).toFixed(2) : null })
        }
        if (denyOpen) for (const d of denyOpen) res.deny.push({ ...d, after: ocAt(G, G.objectives[d.obj], def) })
        denyOpen = null
      }
      if (s === attacker && ph === 'shoot') {
        // the end of the attacker's movement phase: the ram, and the idle
        const gate = G.terrain.byId(plan.gate.id)
        const hp = gate.alive ? gate.hp : 0
        if (hp < gateHp) {
          res.rams++
          run++
          res.ramRun = Math.max(res.ramRun, run)
        } else run = 0
        gateHp = hp
        for (const u of standing(G, attacker)) {
          const f = fd(u)
          const at = f < 0 && f > -(u.r + 2) && !core.q.isEngaged(G, u)
          const p = last.get(u.id)
          if (at && p && Math.hypot(p.x - u.pos.x, p.z - u.pos.z) < 0.3) {
            const fs = R.routeFields(G, u, plan)
            const open = !fs || G.objectives.some((o) => isFinite(R.routeDist(G, fs, o, u.pos.x, u.pos.z)))
            if (open) res.idle.push({ round, unit: u.t.short, x: +u.pos.x.toFixed(2), z: +u.pos.z.toFixed(2) })
            // (a hull, round or long, standing so at the wood's west mouth)
            if (open && (u.t.fp || u.t.base >= 1.5) && Math.hypot(plan.wood.mouths[0].x - u.pos.x, plan.wood.mouths[0].z - u.pos.z) < 6) res.hullWood++
          }
          last.set(u.id, at ? { x: u.pos.x, z: u.pos.z } : null)
        }
      }
      return
    }
    if (kind === 'round') {
      const lost = core.q.controlOf(G, yardOf(G)) === attacker
      const seconds = plan.posts.filter((p) => p.on === 'second')
      for (const u of G.units) {
        if (u.alive <= 0 || u.aboard) continue
        const f = fd(u)
        if (u.side === attacker && f > 0) {
          if (res.behindBy === null) res.behindBy = round
          if (u.t.move !== 'fly' && res.walkBy === null) res.walkBy = round
        }
        if (u.side !== def) continue
        res.defRounds++
        if (f < 0) res.defRoundsFront++
        const decked = !!u.t.ranged && !u.t.big && !u.t.fp && u.t.move !== 'fly' && u.t.ai !== 'transport' && u.t.role !== 'Vehicle'
        if (decked) {
          res.shooters.all++
          if (G.nav.hasHeight && G.nav.floor[G.nav.index(u.pos.x, u.pos.z)] > STEP) res.shooters.deck++
        }
        if (lost) {
          res.second.lost++
          if (seconds.some((p) => Math.hypot(p.x - u.pos.x, p.z - u.pos.z) <= p.r + 4)) res.second.there++
        }
      }
      // (each objective an attacker stands within 12 of, and whether a
      // defender with OC stands within 6 of it: on it or beside it)
      for (const o of G.objectives) {
        if (!standing(G, attacker).some((u) => Math.hypot(u.pos.x - o.x, u.pos.z - o.z) <= 12)) continue
        res.manned.threatened++
        if (standing(G, def).some((u) => u.t.OC > 0 && Math.hypot(u.pos.x - o.x, u.pos.z - o.z) - u.r <= 6)) res.manned.manned++
      }
      const gate = G.terrain.byId(plan.gate.id)
      if (!gate.alive && res.gateFell === null) res.gateFell = round
      if (round <= 4) res.vpBy4 = G.turn.vp[attacker]
      res.rounds = round
      round++
    }
  }
  return { trace, result: () => res }
}

// Sum a list of results into the acceptance rows' numbers (play-report's
// and P-wall's): battles, shares and lists
export function wallTally(rs) {
  const n = rs.length
  const routes = {}
  for (const r of rs) for (const c of r.crossings) routes[c.route] = (routes[c.route] ?? 0) + 1
  const deny = rs.flatMap((r) => r.deny)
  return {
    n,
    behind4: rs.filter((r) => r.behindBy !== null && r.behindBy <= 4).length,
    walk4: rs.filter((r) => r.walkBy !== null && r.walkBy <= 4).length,
    scored4: rs.filter((r) => r.vpBy4 >= 1).length,
    routes, crossings: rs.reduce((s, r) => s + r.crossings.length, 0),
    idle: rs.flatMap((r) => r.idle),
    defMoves: rs.reduce((s, r) => s + r.defMoves, 0),
    defFront: rs.flatMap((r) => r.defFront),
    defCharge: rs.flatMap((r) => r.defCharge),
    defRounds: rs.reduce((s, r) => s + r.defRounds, 0),
    defRoundsFront: rs.reduce((s, r) => s + r.defRoundsFront, 0),
    deny: deny.length, contested: deny.filter((d) => d.after > d.before).length, able: deny.filter((d) => d.able > 0).length, ableContested: deny.filter((d) => d.able > 0 && d.after > d.before).length,
    gateFell: rs.map((r) => r.gateFell).filter((x) => x !== null).sort((a, b) => a - b),
    rams: rs.reduce((s, r) => s + r.rams, 0), ramRun: Math.max(0, ...rs.map((r) => r.ramRun)),
    shooters: rs.reduce((s, r) => ({ deck: s.deck + r.shooters.deck, all: s.all + r.shooters.all }), { deck: 0, all: 0 }),
    counter: rs.reduce((s, r) => s + r.counter, 0),
    second: rs.reduce((s, r) => ({ lost: s.lost + r.second.lost, there: s.there + r.second.there }), { lost: 0, there: 0 }),
    manned: rs.reduce((s, r) => ({ threatened: s.threatened + r.manned.threatened, manned: s.manned + r.manned.manned }), { threatened: 0, manned: 0 }),
    charges: rs.reduce((s, r) => s + r.charges, 0), hullWood: rs.reduce((s, r) => s + r.hullWood, 0),
  }
}
