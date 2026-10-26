// Units as the rules see them: a squad of models that moves as one disc.
//
//   { id, key, t, side, race, pos: { x, z }, r, alive, lost, mesmerized,
//     aboard,
//     flags: { moved, advanced, advRoll, fellBack, shot, charged, chargeTried,
//              chargeTarget, fought, rode },
//     models: [{ w, alive, ox, oz }] }
//
// (F9a, DESIGN §4.2.5) `aboard` is the id of the vehicle carrying the unit,
// 0 when it stands on the table (ids count from 1). It is no flag: a turn's
// start wipes the flags (core/engine.js resetTurn), and a rider stays aboard
// until it disembarks or its hull is destroyed. A rider stands exactly where
// its hull does (moveUnitTo carries it) and is off the table for every
// spatial rule (DESIGN §4.1 rule 19). stateHash prints it only where it
// isn't 0 (core/hash.js UNIT_EXTRAS), so a match without riders hashes as
// before. `flags.rode`: it disembarked from a hull that had moved this turn,
// so it may not charge (core/actions/charge.js canCharge).
//
// `t` is the unit's type (data/schema.js), `alive` the count of models still
// standing, `r` the disc's radius, and each model's (ox, oz) its slot in the
// formation around `pos`. Where a figure is drawn this frame, which way it
// faces and how it lunges or falls is the view's (view/units.js), never read
// here.
import { hypot, sin, cos, atan2 } from './dmath.js'
import { raceOf } from './match.js'

// Formation: one model in the middle and the rest in a ring, or a plain ring
// for small squads. Recomputed as models fall so squads close ranks.
export function formation(n, base) {
  const sp = base * 2 + 0.16
  if (n === 1) return [[0, 0]]
  if (n <= 4) {
    const R = n === 2 ? sp / 2 : sp / (2 * sin(Math.PI / n))
    return Array.from({ length: n }, (_, i) => [cos((i / n) * Math.PI * 2 + 0.4) * R, sin((i / n) * Math.PI * 2 + 0.4) * R])
  }
  const k = n - 1
  const R = Math.max(sp, sp / (2 * sin(Math.PI / k)))
  return [[0, 0], ...Array.from({ length: k }, (_, i) => [cos((i / k) * Math.PI * 2 + 0.3) * R, sin((i / k) * Math.PI * 2 + 0.3) * R])]
}

// A unit of `key` for seat `side`, with the match's next id (ids count from
// 1 in every match).
export function makeUnit(G, key, side) {
  const race = raceOf(G, side), t = race.units[key]
  const u = {
    id: G.nextUnitId++, key, t, side, race: race.key,
    pos: { x: 0, z: 0 }, models: [], alive: t.models, r: 0, flags: {}, lost: 0, mesmerized: false, aboard: 0,
  }
  for (let i = 0; i < t.models; i++) u.models.push({ w: t.W, alive: true, ox: 0, oz: 0 })
  relayout(u)
  return u
}

// The survivors' slots, and the disc they make.
export function relayout(u) {
  const live = u.models.filter((m) => m.alive)
  const offs = formation(live.length, u.t.base)
  // keep each survivor roughly where it was: assign slots greedily by angle
  live.sort((a, b) => atan2(a.oz, a.ox) - atan2(b.oz, b.ox))
  offs.forEach(([ox, oz], i) => {
    live[i].ox = ox
    live[i].oz = oz
  })
  u.r = offs.reduce((m, [ox, oz]) => Math.max(m, hypot(ox, oz)), 0) + u.t.base
}

export function setUnitPos(u, x, z) {
  u.pos.x = x
  u.pos.z = z
}

// (F9a, DESIGN §4.2.5) `u` stands at (x, z), and so does every unit riding
// it (aboard === u.id), in G.units order: a rider's place is always its
// hull's, exactly. The walk's end, a pile-in and a placement go through it
// (core/actions/move.js resolveWalk, core/actions/damage.js closeRanks,
// core/commands.js's place); with no riders it is setUnitPos, and it draws
// nothing (§4.1 rule 19).
export function moveUnitTo(G, u, x, z) {
  setUnitPos(u, x, z)
  for (const o of G.units) if (o.aboard === u.id) setUnitPos(o, x, z)
}
