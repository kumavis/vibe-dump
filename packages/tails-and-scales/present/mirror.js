// The match as shown (DESIGN §2.4): what the table, the labels, the flags
// and the score show, which runs behind the match itself while the view
// plays its events. The rules compute a whole action (a whole AI turn, from
// R6) before the first die is shown, so the view never reads G for any of
// it: it reads this, folded from the same events it plays, one at a time.
//
//   M = { units: { id → { pos: { x, z }, y, r, models: [{ w, alive, ox, oz }],
//                         alive, mesmerized, engaged } },
//         chunks: { id → { alive, y } },
//         owners: [seat or -1, per objective], vp: [a, b],
//         round, active, phase, stage, board: { W, H } }  (F8a: board the
//         match's, fixed for its whole battle)
//   (F7a) a unit's `y`: the floor it stands on (core/queries.js groundY), 0
//   on a board without height, whose events carry none
//   (F9a) a unit's `aboard`: the id of the vehicle it rides, 0 on the table
//   (DESIGN §4.2.5). A rider stands where its hull does: the mirror carries
//   it with its hull on the hull's `unit.move`, `unit.place` and
//   `unit.formation` (in id order, which is G.units order), so no event grows
//   for it; `unit.embark` and `unit.disembark` set it aboard and off, a
//   `unit.place` of a rider takes it off (the deployment's re-arranging),
//   and its hull's `unit.destroyed` leaves it riding nothing (a rider with
//   nowhere to bail out to is lost where it rode)
//
// project(G) is the mirror of a match that is not running ahead of its view
// (a new table, or a snap); applyEvent(M, e) folds one event into it. Once
// every event is played the two agree: sim/present-check.mjs folds every
// corpus battle's events and holds the result to project(G) at every
// action's end (`act`) and at every `check` (?debug only: the ?debug block,
// app/boot.js's, takes project(G) in its onTrace as each `act`, `phase` and
// `over` line is written, and as the match stops at the end of each entry
// the Session folds, and puts a check there in the entry's events), so an
// event the rules forget to emit is a failing check, not a figure left
// standing. Pure in
// what it reads: no rendering, no DOM, the match only through core's
// read-only queries. But applyEvent folds in place: whoever keeps a mirror
// across events copies it, and whoever is handed the player's (a handler,
// an observer) only reads it.
import { alive, isEngaged, controlOf, phaseKey, groundY } from '../core/queries.js'

// who holds each objective, as the table shows it: nobody before the battle.
// (F9a's integration) A game over before its battle began (a seat conceding
// in the deployment: the roll-off, whose step emits the first `objectives`,
// never ran) shows nobody either, as hud-model's resultOf counts it no
// round: the units stood in their zones, and a preset deploying onto an
// objective (the Coil's Grand one, on a flank's) held it in no event.
const begun = (T) => T.stage === 'battle' || (T.stage === 'over' && T.step !== 'rolloff')
const owners = (G) => G.objectives.map((o) => (begun(G.turn) ? controlOf(G, o) : -1))

export function project(G) {
  const T = G.turn
  const units = {}
  for (const u of G.units) {
    units[u.id] = {
      pos: { x: u.pos.x, z: u.pos.z }, y: groundY(G, u), r: u.r, aboard: u.aboard,
      models: u.models.map((m) => ({ w: m.w, alive: m.alive, ox: m.ox, oz: m.oz })),
      alive: u.alive, mesmerized: u.mesmerized, engaged: alive(u) && isEngaged(G, u),
    }
  }
  const chunks = {}
  for (const c of G.terrain.chunks) chunks[c.id] = { alive: c.alive, y: c.shape.y }
  // (F8a) the board the match's mission chose, which no event changes: the
  // view makes the table for it as it snaps (view/index.js's setBoard)
  return { units, chunks, owners: owners(G), vp: [...T.vp], round: T.round, active: T.active, phase: phaseKey(G), stage: T.stage, board: { W: G.board.W, H: G.board.H } }
}

// An empty mirror: no units, no chunks (sim/terrain-check.mjs folds the
// terrain's events into one, with no match around them).
export const blankMirror = () => ({ units: {}, chunks: {}, owners: [], vp: [0, 0], round: 1, active: 0, phase: 'move', stage: 'title' })

// (F9a) the riders of hull `id` stand where it now does (`v`, its mirror
// unit), in id order
function carry(M, id, v) {
  for (const p of Object.values(M.units)) {
    if (p.aboard !== id) continue
    p.pos = { x: v.pos.x, z: v.pos.z }
    p.y = v.y
  }
}

// Fold event `e` into M (in place) and return M. Events that change nothing
// shown (a dice row, a pause, a log line, a hurt chunk) leave it as it is.
export function applyEvent(M, e) {
  const u = e.u === undefined ? null : M.units[e.u]
  switch (e.t) {
    // (F7a: a place, a walk's end and a formation's place carry the floor, y,
    // only with height; without it the unit stands at 0) (F9a: a placed
    // rider steps off; a placed, walking or piling-in hull carries its
    // riders)
    case 'unit.place':
      u.pos = { x: e.x, z: e.z }
      u.y = e.y ?? 0
      u.aboard = 0
      carry(M, e.u, u)
      break
    // a walk: where it ends, and what it smashed on the way (the view breaks
    // each as the walker passes it; the mirror holds them all at once)
    case 'unit.move':
      u.pos = { x: e.to.x, z: e.to.z }
      u.y = e.to.y ?? 0
      carry(M, e.u, u)
      for (const { ev } of e.smashes) for (const x of ev) applyEvent(M, x)
      break
    // (F9a) a unit boards a hull, and stands where it does; it steps off (or
    // bails out of its wreck) onto `to`
    case 'unit.embark': {
      const v = M.units[e.v]
      u.aboard = e.v
      u.pos = { x: v.pos.x, z: v.pos.z }
      u.y = v.y
      break
    }
    case 'unit.disembark':
      u.aboard = 0
      u.pos = { x: e.to.x, z: e.to.z }
      u.y = e.to.y ?? 0
      break
    // (F9a) a hull destroyed rides nobody: its riders bail out (each that
    // finds a spot steps off with its own unit.disembark, after this) or are
    // lost where they rode
    case 'unit.destroyed':
      for (const p of Object.values(M.units)) if (p.aboard === e.u) p.aboard = 0
      break
    case 'unit.formation':
      u.pos = { x: e.pos.x, z: e.pos.z }
      u.y = e.pos.y ?? 0
      carry(M, e.u, u)
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
