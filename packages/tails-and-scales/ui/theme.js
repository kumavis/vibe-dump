// Each seat's look (DESIGN §2.11): its race's name, short name, icon and
// colours, for the HUD, the labels, the battle log, the zones and the end
// screen. Presentation only, read off the race data (data/schema.js); the
// rules never see any of it. (R7 moves the rest of the theming here: the
// --s0/--s1 colours the stylesheet reads.)
import { RACES } from '../data/schema.js'

// Both seats play the same race. Presentation only: the two seats' names
// then read the same, so colour has to tell them apart.
export const isMirror = (seats) => seats.length === 2 && seats[0].race === seats[1].race

// Each seat's look, from [{ seat, race }, …]. A mirror match paints seat 1
// in its race's alternate colour, so the two armies, their zones, labels and
// log lines still tell apart.
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
