// Who sits where. A match has two seats; each plays a race and is played by
// a human or the AI. The table edge a seat deploys on is fixed by the seat,
// never by the race: seat 0 holds the west edge (edge −1, which is where
// the Bushtails have always stood), seat 1 the east (+1). Every rule that
// used to say "side 0 goes left" reads the edge instead, so any race can sit
// in either seat and a mirror match is still a fair, mirrored table.
import { RACES } from '../data/schema.js'

export const EDGES = Object.freeze([-1, 1])

// G.seats for these races and controllers: [{ seat, race, edge, ctrl }, …]
export function makeSeats(races, ctrl) {
  if (races.length !== 2 || ctrl.length !== 2) throw new Error('a match has two seats')
  return races.map((race, seat) => {
    if (typeof race !== 'string' || !RACES[race]) throw new Error(`seat ${seat}: no race "${race}" (there are ${Object.keys(RACES).join(', ')})`)
    if (ctrl[seat] !== 'human' && ctrl[seat] !== 'ai') throw new Error(`seat ${seat}: controller "${ctrl[seat]}" is neither human nor ai`)
    return { seat, race, edge: EDGES[seat], ctrl: ctrl[seat] }
  })
}

export const raceOf = (G, s) => RACES[G.seats[s].race]
export const edgeOf = (G, s) => G.seats[s].edge
export const ctrl = (G, s) => G.seats[s].ctrl
