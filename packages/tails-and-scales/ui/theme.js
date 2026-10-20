// Each seat's look (DESIGN §2.11): its race's name, short name, icon and
// colours, for the HUD, the labels, the battle log, the zones and the end
// screen; and the page's theming by seat (paintSeats: the --s0/--s1 colours
// the stylesheet reads, the HUD's icons and names). Presentation only, read
// off the race data (data/schema.js); the rules never see any of it.
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

// [{ seat, race }, …] for the races at the table, in seat order
export const seatsOf = (races) => races.map((race, seat) => ({ seat, race }))

// The HUD, unit labels, battle log and card take each seat's colour from
// --s0/--s1, and the active seat's HUD glow from --s0-glow/--s1-glow
// (style.css holds the classic pair, which the title screen's copy keeps);
// the HUD shows each seat's race. (The zones, view/table.js, take the
// seat's colour from the caller: app/flow.js.) The style element is made at
// the first paint, as the page boots.
let seatStyle = null
const glow = (hex) => `rgba(${[1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).join(', ')}, 0.45)`
export function paintSeats(sides) {
  const $ = (s) => document.querySelector(s)
  if (!seatStyle) {
    seatStyle = document.createElement('style')
    document.body.appendChild(seatStyle)
  }
  seatStyle.textContent = `#hud, #labels, #log, #card { --s0: ${sides[0].color}; --s1: ${sides[1].color}; ` +
    `--s0-glow: ${glow(sides[0].color)}; --s1-glow: ${glow(sides[1].color)}; }`
  for (const s of [0, 1]) {
    const hud = s ? '#sideB' : '#sideA'
    $(`${hud} .ic`).textContent = sides[s].icon
    $(`${hud} .nm`).textContent = sides[s].name
  }
}

// In a mirror match both seats' names read the same, so text that names a
// seat outside the HUD (the turn banner, the end screen) takes the seat's
// colour; otherwise it keeps its own ('' leaves the stylesheet's). `seats`
// the match's at the table.
export const seatInk = (seats, sides, s) => (s >= 0 && isMirror(seats) ? sides[s].color : '')
