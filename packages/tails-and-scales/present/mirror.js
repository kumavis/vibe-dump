// The match as shown (DESIGN §2.4): what the table, the labels, the flags
// and the score show, which runs behind the match itself while the view
// plays its events. The rules compute a whole action (a whole AI turn, from
// R6) before the first die is shown, so the view never reads G for any of
// it: it reads this, folded from the same events it plays, one at a time.
//
//   M = { units: { id → { pos: { x, z }, r, models: [{ w, alive, ox, oz }],
//                         alive, mesmerized, engaged } },
//         chunks: { id → { alive, y } },
//         owners: [seat or -1, per objective], vp: [a, b],
//         round, active, phase, stage }
//
// project(G) is the mirror of a match that is not running ahead of its view
// (a new table, or a snap); applyEvent(M, e) folds one event into it. Once
// every event is played the two agree: sim/present-check.mjs folds every
// corpus battle's events and holds the result to project(G) at every
// action's end (`act`), and after every converted action's events and
// main.js's own stage changes (`check`, ?debug only), so an event the rules
// forget to emit is a failing check, not a figure left standing. Pure in
// what it reads: no rendering, no DOM, the match only through core's
// read-only queries. But applyEvent folds in place: whoever keeps a mirror
// across events copies it, and whoever is handed the player's (a handler,
// an observer) only reads it.
import { alive, isEngaged, controlOf } from '../core/queries.js'

// who holds each objective, as the table shows it: nobody before the battle
const owners = (G) => G.objectives.map((o) => (G.turn.stage === 'battle' || G.turn.stage === 'over' ? controlOf(G, o) : -1))

export function project(G) {
  const T = G.turn
  const units = {}
  for (const u of G.units) {
    units[u.id] = {
      pos: { x: u.pos.x, z: u.pos.z }, r: u.r,
      models: u.models.map((m) => ({ w: m.w, alive: m.alive, ox: m.ox, oz: m.oz })),
      alive: u.alive, mesmerized: u.mesmerized, engaged: alive(u) && isEngaged(G, u),
    }
  }
  const chunks = {}
  for (const c of G.terrain.chunks) chunks[c.id] = { alive: c.alive, y: c.shape.y }
  return { units, chunks, owners: owners(G), vp: [...T.vp], round: T.round, active: T.active, phase: T.phase, stage: T.stage }
}

// An empty mirror: no units, no chunks (sim/terrain-check.mjs folds the
// terrain's events into one, with no match around them).
export const blankMirror = () => ({ units: {}, chunks: {}, owners: [], vp: [0, 0], round: 1, active: 0, phase: 'move', stage: 'title' })

// Fold event `e` into M (in place) and return M. Events that change nothing
// shown (a dice row, a pause, a log line, a hurt chunk) leave it as it is.
export function applyEvent(M, e) {
  const u = e.u === undefined ? null : M.units[e.u]
  switch (e.t) {
    case 'unit.place':
      u.pos = { x: e.x, z: e.z }
      break
    // a walk: where it ends, and what it smashed on the way (the view breaks
    // each as the walker passes it; the mirror holds them all at once)
    case 'unit.move':
      u.pos = { x: e.to.x, z: e.to.z }
      for (const { ev } of e.smashes) for (const x of ev) applyEvent(M, x)
      break
    case 'unit.formation':
      u.pos = { x: e.pos.x, z: e.pos.z }
      u.r = e.r
      e.offs.forEach(([ox, oz], k) => {
        u.models[k].ox = ox
        u.models[k].oz = oz
      })
      break
    case 'unit.wound':
      u.models[e.m].w -= e.dmg
      break
    case 'unit.slain':
    case 'unit.flee':
      u.models[e.m].w = 0
      u.models[e.m].alive = false
      u.alive--
      break
    case 'status': {
      const engaged = new Set(e.engaged), mesmerized = new Set(e.mesmerized)
      for (const [id, v] of Object.entries(M.units)) {
        v.engaged = engaged.has(Number(id))
        v.mesmerized = mesmerized.has(Number(id))
      }
      break
    }
    case 'objectives':
      M.owners = [...e.owners]
      break
    case 'round.scored':
      M.vp = [...e.vp]
      M.owners = [...e.owners]
      break
    // (the stage is the `stage` event's alone)
    case 'phase.start':
      M.round = e.round
      M.active = e.side
      M.phase = e.phase
      break
    case 'stage':
      M.stage = e.stage
      break
    case 'terrain.clear':
      M.chunks = {}
      break
    case 'terrain.add':
      M.chunks[e.def.id] = { alive: true, y: e.def.shape.y }
      break
    case 'terrain.destroy':
      M.chunks[e.id].alive = false
      break
    case 'terrain.collapse':
      for (const { id, dy } of e.drops) M.chunks[id].y -= dy
      break
  }
  return M
}
