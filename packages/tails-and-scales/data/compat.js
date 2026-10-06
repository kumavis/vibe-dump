// The shapes the code was written against before the race data, rebuilt as
// views over it. main.js reads sidesFor (each seat's name, short, icon and
// colours, for whoever is playing), isMirror and CLASSIC (the title-screen
// matchup). TYPES (every unit type by key), ARMIES and SIDES are the
// legacy-shaped views of the classic matchup that sim/data-check.mjs compares
// with the R0 code's rules.js. Transitional: this file goes at R6 (its row in
// DESIGN §4 says where each export goes).
import { RACES } from './schema.js'

// The matchup every title-screen mode plays: Bushtails in seat 0, the Coil
// in seat 1.
export const CLASSIC = Object.freeze(['squirrel', 'serpent'])

// Every race's unit types by unit key. The keys are unique across races
// today; a race that reuses one must be looked up through its race instead.
const ALL = Object.values(RACES).flatMap((r) => Object.values(r.units))
if (new Set(ALL.map((t) => t.key)).size !== ALL.length) throw new Error('two races share a unit key: look their types up by race')
export const TYPES = Object.freeze(Object.assign(Object.create(null), Object.fromEntries(ALL.map((t) => [t.key, t]))))

export const ARMIES = Object.freeze(CLASSIC.map((r) => RACES[r].army))

// Both seats play the same race. Presentation only: the two seats' names
// then read the same, so colour has to tell them apart.
export const isMirror = (seats) => seats.length === 2 && seats[0].race === seats[1].race

// A seat's race as the old SIDES record. A mirror match paints seat 1 in its
// race's alternate colour, so the two armies, their zones, labels and log
// lines still tell apart.
export function sidesFor(seats) {
  const mirror = isMirror(seats)
  return Object.freeze(seats.map(({ seat, race }) => {
    const r = RACES[race]
    return Object.freeze({
      name: r.name, short: r.short, icon: r.icon,
      color: mirror && seat === 1 ? r.look.alt : r.look.team, dark: r.look.dark,
    })
  }))
}

export const SIDES = sidesFor(CLASSIC.map((race, seat) => ({ seat, race })))
