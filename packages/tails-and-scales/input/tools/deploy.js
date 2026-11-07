// The deployment tool (DESIGN §2.5): a unit picked up goes on the free spot
// nearest the click inside its seat's zone, within 2.5" of it (the UI's
// tolerance). The spot is freeSpot's, a nav cell's centre, so the command
// carries the cell: { t: 'place', u, c }. (F9b) A long hull's placement
// may name its heading, `f`; a lone hull is placed through its pin
// (input/group.js), whose heading the player may turn first, and the
// executor (input/orders.js) sends it.

// The cell unit `u` of seat `side` would be placed on for a click at
// `ground`, or -1 (no free spot near enough). Asked with the dice locked.
export function spotAt(ask, u, ground, side) {
  return ask((G, q) => {
    const p = q.freeSpot(G, u, ground.x, ground.z, side, G.units.filter((o) => o !== u))
    return p && Math.hypot(p.x - ground.x, p.z - ground.z) < 2.5 ? G.nav.index(p.x, p.z) : -1
  })
}

// the command that places unit u on cell c ((F9b) a long hull facing `f`,
// when given)
export const placeAt = (u, c, f) => (f === undefined || f === null ? { t: 'place', u: u.id, c } : { t: 'place', u: u.id, c, f })
