// The match state, G, and who sits where.
//
// G holds everything a battle's rules read and write, and nothing else: the
// setup it was made from, the dice stream, the seats, the units, the
// objectives, the terrain and its nav grid, the turn, and the journal (the
// trace and the log lines held back until an attack is over). A fresh one
// is built for every match (newState, which core/index.js's createMatch
// calls with the whole setup), so nothing carries over from one match to
// the next: unit ids and chunk ids both count from 1 again. The view keeps
// its own state beside it (main.js: each unit's figures by unit id, the
// terrain's meshes by chunk id), and the rules never read that.
//
// A match has two seats; each plays a race and is played by a human or the
// AI. The table edge a seat deploys on is fixed by the seat, never by the
// race: seat 0 holds the west edge (edge −1, which is where the Bushtails
// have always stood), seat 1 the east (+1). Every rule that used to say
// "side 0 goes left" reads the edge instead, so any race can sit in either
// seat and a mirror match is still a fair, mirrored table.
import { RACES } from '../data/schema.js'
import { MISSIONS } from '../data/mission.js'
import { BOARD } from './rules.js'
import { createRng } from './rng.js'
import { deepFreeze } from './util.js'
import { NavGrid } from './nav.js'
import { Terrain } from './terrain/terrain.js'
import { makeUnit } from './units.js'
import { deployArmies } from './deploy.js'

export const EDGES = Object.freeze([-1, 1])

// The mission `setup` is fought for (data/mission.js): its objectives, its
// default rounds and its deployment depth. Every setup plays `classic`
// until a setup field picks another.
export const missionOf = (setup) => MISSIONS.classic

// the nav grid's cell, in inches
export const NAV_CELL = 0.5

// G.seats for these races and controllers: [{ seat, race, edge, ctrl }, …]
export function makeSeats(races, ctrl) {
  if (races.length !== 2 || ctrl.length !== 2) throw new Error('a match has two seats')
  return races.map((race, seat) => {
    if (typeof race !== 'string' || !RACES[race]) throw new Error(`seat ${seat}: no race "${race}" (there are ${Object.keys(RACES).join(', ')})`)
    if (ctrl[seat] !== 'human' && ctrl[seat] !== 'ai') throw new Error(`seat ${seat}: controller "${ctrl[seat]}" is neither human nor ai`)
    return { seat, race, edge: EDGES[seat], ctrl: ctrl[seat] }
  })
}

// a setup is plain data: its own fields, and a record per seat
const copySetup = (setup) => ({ ...setup, seats: setup.seats.map((s) => ({ ...s })) })

export const raceOf = (G, s) => RACES[G.seats[s].race]
export const edgeOf = (G, s) => G.seats[s].edge
export const ctrl = (G, s) => G.seats[s].ctrl

// A new match on a new table:
//   setup  { board, dice, terrain: 'classic', rounds, diceMode, seats: [{ race, ctrl }, …] }
//          (core/index.js's createMatch fills in the defaults and checks it)
//   out    where the match's events go, the terrain's reports of what it
//          builds and breaks among them (the view plays them; null for a
//          quiet run)
//   onTrace(line, G)  hears every trace line as it is written (sim/ and
//          ?debug only: it never draws and nothing reads it back)
// The board is scattered around the mission's objectives, the nav grid built
// from it, and both armies made and deployed, seat 0's first. The turn
// starts at the deployment, the engine's next step the roll-off
// (createMatch asks the human seats to adjust their deployment first).
export function newState(setup, { out = null, onTrace = null } = {}) {
  const { W, H } = BOARD
  const G = {
    setup: deepFreeze(copySetup(setup)),
    rng: createRng(setup.dice),
    seats: makeSeats(setup.seats.map((s) => s.race), setup.seats.map((s) => s.ctrl)),
    units: [],
    nextUnitId: 1,
    objectives: missionOf(setup).objectives.map((p, i) => ({ i, x: p.x, z: p.z })),
    terrain: new Terrain(W, H),
    // derived from the terrain; rebuilt only at refreshNav's call sites
    nav: new NavGrid(W, H, NAV_CELL),
    // stage 'deploy' | 'battle' | 'over'; step: where the engine's step
    // machine stands (core/engine.js); round and t: the round and which of
    // its two turns; active: the seat whose turn it is; first: who won the
    // roll-off; ph: the phase, by its index in PHASES (phaseKey); wiped: the
    // seat wiped off the table, -1 for none; result: { win, why } once over;
    // overtime: rounds played past setup.rounds (F4)
    turn: { stage: 'deploy', step: 'rolloff', round: 1, t: 0, active: 0, first: 0, ph: 0, vp: [0, 0], wiped: -1, result: null, overtime: 0 },
    // the decision the match waits on, a human seat's (core/engine.js;
    // DESIGN §2.1), null while the engine runs on or once the battle is over
    pending: null,
    // the trace (the battle's fingerprint, sim/'s parity stream) and the
    // destroyed-unit lines held back until the attack that caused them ends
    journal: { trace: [], pendingLog: [] },
    out,
    onTrace,
    // sim/'s P-prop: judge each AI command with legal() before it is applied
    // (core/index.js's createMatch sets it; I/O, never read by the rules)
    strict: false,
  }
  G.terrain.generate(setup.board, G.objectives, missionOf(setup).deploy, setup.terrain, out)
  refreshNav(G)
  for (const side of [0, 1]) for (const key of raceOf(G, side).army) G.units.push(makeUnit(G, key, side))
  deployArmies(G)
  return G
}

// The nav grid follows the terrain: rebuilt when a chunk changed shape since
// the last rebuild, at exactly the sites it always was (DESIGN §4.1 rule 9):
// a new table, every move plan and charge plan, and the end of a move, a
// charge and a blast.
export function refreshNav(G) {
  if (!G.terrain.dirty) return
  G.terrain.dirty = false
  G.nav.rebuild(G.terrain.chunks)
}
