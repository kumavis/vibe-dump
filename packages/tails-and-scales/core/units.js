// Units as the rules see them: a squad of models that moves as one disc.
//
//   { id, key, t, side, race, pos: { x, z }, r, alive, lost, mesmerized,
//     flags: { moved, advanced, advRoll, fellBack, shot, charged, chargeTried,
//              chargeTarget, fought },
//     models: [{ w, alive, ox, oz }] }
//
// `t` is the unit's type (data/schema.js), `alive` the count of models still
// standing, `r` the disc's radius, and each model's (ox, oz) its slot in the
// formation around `pos`. Where a figure is drawn this frame, which way it
// faces and how it lunges or falls is the view's (main.js), never read here.
import { hypot } from './dmath.js'
import { raceOf } from './match.js'

// Formation: one model in the middle and the rest in a ring, or a plain ring
// for small squads. Recomputed as models fall so squads close ranks.
export function formation(n, base) {
  const sp = base * 2 + 0.16
  if (n === 1) return [[0, 0]]
  if (n <= 4) {
    const R = n === 2 ? sp / 2 : sp / (2 * Math.sin(Math.PI / n))
    return Array.from({ length: n }, (_, i) => [Math.cos((i / n) * Math.PI * 2 + 0.4) * R, Math.sin((i / n) * Math.PI * 2 + 0.4) * R])
  }
  const k = n - 1
  const R = Math.max(sp, sp / (2 * Math.sin(Math.PI / k)))
  return [[0, 0], ...Array.from({ length: k }, (_, i) => [Math.cos((i / k) * Math.PI * 2 + 0.3) * R, Math.sin((i / k) * Math.PI * 2 + 0.3) * R])]
}

// A unit of `key` for seat `side`, with the match's next id (ids count from
// 1 in every match).
export function makeUnit(G, key, side) {
  const race = raceOf(G, side), t = race.units[key]
  const u = {
    id: G.nextUnitId++, key, t, side, race: race.key,
    pos: { x: 0, z: 0 }, models: [], alive: t.models, r: 0, flags: {}, lost: 0, mesmerized: false,
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
  live.sort((a, b) => Math.atan2(a.oz, a.ox) - Math.atan2(b.oz, b.ox))
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
