// The match state, G, and who sits where.
//
// G holds everything a battle's rules read and write, and nothing else: the
// setup it was made from, the dice stream, the seats, the units, the
// objectives, the terrain and its nav grid, the turn, and the journal (the
// trace and the log lines held back until an attack is over). A fresh one
// is built for every table (newState), so nothing carries over from one
// match to the next: unit ids and chunk ids both count from 1 again. The
// view keeps its own state beside it (main.js: each unit's figures by unit
// id, the terrain's meshes by chunk id), and the rules never read that.
//
// A match has two seats; each plays a race and is played by a human or the
// AI. The table edge a seat deploys on is fixed by the seat, never by the
// race: seat 0 holds the west edge (edge −1, which is where the Bushtails
// have always stood), seat 1 the east (+1). Every rule that used to say
// "side 0 goes left" reads the edge instead, so any race can sit in either
// seat and a mirror match is still a fair, mirrored table.
import { RACES } from '../data/schema.js'
import { BOARD } from './rules.js'
import { createRng } from './rng.js'
import { deepFreeze } from './util.js'
import { NavGrid } from './nav.js'
import { Terrain } from './terrain/terrain.js'
import { makeUnit } from './units.js'
import { deployArmies } from './deploy.js'

export const EDGES = Object.freeze([-1, 1])

// The objectives: the centre and four more, one pair in each half. (The
// mission's own data, until a mission module holds it and RULES_ID hashes it.)
export const OBJ_POS = deepFreeze([
  { x: 0, z: 0 },
  { x: -9, z: 8 },
  { x: 9, z: -8 },
  { x: -9, z: -8 },
  { x: 9, z: 8 },
])

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
//   out    where the terrain reports what it builds and breaks (main.js plays
//          them; null for a quiet run)
//   onTrace(line, G)  hears every trace line as it is written (sim/ and
//          ?debug only: it never draws and nothing reads it back)
// The board is scattered, the nav grid built from it, and both armies made
// and deployed, seat 0's first. The turn starts at the title: the stage is
// 'title' until start() in main.js begins the battle on this table.
export function newState(setup, { out = null, onTrace = null } = {}) {
  const { W, H } = BOARD
  const G = {
    setup: deepFreeze(copySetup(setup)),
    rng: createRng(setup.dice),
    seats: makeSeats(setup.seats.map((s) => s.race), setup.seats.map((s) => s.ctrl)),
    units: [],
    nextUnitId: 1,
    objectives: OBJ_POS.map((p, i) => ({ i, x: p.x, z: p.z })),
    terrain: new Terrain(W, H),
    // derived from the terrain; rebuilt only at refreshNav's call sites
    nav: new NavGrid(W, H, NAV_CELL),
    // stage 'title' | 'deploy' | 'battle' | 'over'; wiped: the seat wiped
    // off the table, -1 for none
    turn: { stage: 'title', round: 1, active: 0, first: 0, phase: 'move', vp: [0, 0], wiped: -1 },
    // the trace (the battle's fingerprint, sim/'s parity stream) and the
    // destroyed-unit lines held back until the attack that caused them ends
    journal: { trace: [], pendingLog: [] },
    out,
    onTrace,
  }
  G.terrain.generate(setup.board, G.objectives, BOARD.deploy, setup.terrain, out)
  refreshNav(G)
  for (const side of [0, 1]) for (const key of raceOf(G, side).army) G.units.push(makeUnit(G, key, side))
  deployArmies(G)
  return G
}

// Begin the battle on the table built for it: the title screen builds the
// table before the mode is chosen, so the dice and who plays each seat come
// now. Refused once the table's battle is under way (main.js's start() moves
// the stage on from 'title' straight after this, before anything else runs).
export function startMatch(G, { dice, ctrl: who }) {
  if (G.turn.stage !== 'title') throw new Error(`this table's battle has begun already (stage ${G.turn.stage})`)
  G.setup = deepFreeze({ ...copySetup(G.setup), dice, seats: G.setup.seats.map((s, i) => ({ ...s, ctrl: who[i] })) })
  G.rng = createRng(dice)
  G.seats = makeSeats(G.setup.seats.map((s) => s.race), who)
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
