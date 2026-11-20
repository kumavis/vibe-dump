// (Breakthrough, DESIGN §4.2.12's "The page") What the page says of a
// battle's roles, worked out without touching the page: the HUD's tally,
// the opening banners, the round's banner, the end screen's words and the
// role a seat plays. Every number in them (the attacker's target, the
// rounds, the zone's depth) is read from the battle's mission as it is
// said (core/match.js rolesOf, through core/index.js), never written in
// the copy, so the balance slice's retuning reaches every string by
// itself. On a mission without roles each gives null, and the page says
// what it always said.
import { rolesOf, roleOf } from '../core/index.js'
import { tails, OBJECTIVE_RANGE } from '../core/rules.js'

// the attacking seat of `setup` (0 or 1), or -1 on a mission without roles
export const attackerSeat = (setup) => (rolesOf(setup) ? (roleOf({ setup }, 0) === 'attack' ? 0 : 1) : -1)

// seat s's role in a battle of `setup` ('attack' or 'defend'), or null
export const seatRole = (setup, s) => (rolesOf(setup) ? roleOf({ setup }, s) : null)
// a role as the Muster screen's title names it ("Attacker · Bushtail
// Clans"), and as a seat's line in the lobby says it
export const ROLE_TITLE = Object.freeze({ attack: 'Attacker', defend: 'Defender' })
export const ROLE_VERB = Object.freeze({ attack: 'Attacks', defend: 'Defends' })

// The tally: the attacker's VP against its target, "Breakthrough 3 of 5"
// (the HUD's score line and the round's banner), or null.
export function tallyOf(setup, vp) {
  const R = rolesOf(setup)
  return R ? `Breakthrough ${vp[attackerSeat(setup)]} of ${R.attack.target}` : null
}

// The opening banner's line for seat s's role ("Break through the line:
// hold the objectives beyond it. 5 to win."; "Hold the line: keep them
// under 5 by the end of round 6."), or null.
export function openingOf(setup, s) {
  const R = rolesOf(setup)
  if (!R) return null
  const need = R.attack.target
  return roleOf({ setup }, s) === 'attack' ? `Break through the line: hold the objectives beyond it. ${need} to win.` : `Hold the line: keep them under ${need} by the end of round ${setup.rounds}.`
}

// The end screen's words for a role battle's own ends (the game.over
// event's `why`: 'breakthrough', the target reached; 'held', the rounds
// run out under it): { title, line }, or null for any other end (a wipe, a
// concession: worded as on every battle). `sides`: each seat's look
// (ui/theme.js: its name).
export function roleResult(setup, { win, why, vp, rounds }, sides) {
  const R = rolesOf(setup)
  if (!R || (why !== 'breakthrough' && why !== 'held')) return null
  const need = R.attack.target, atk = attackerSeat(setup)
  if (why === 'breakthrough') return { title: `${sides[win].name} break through!`, line: `Breakthrough ${vp[atk]} of ${need} in round ${rounds}.` }
  return { title: `The line holds: ${sides[win].name} win!`, line: `The attackers scored ${vp[atk]} of the ${need} they needed in ${rounds} round${rounds === 1 ? '' : 's'}.` }
}

// The rules' help paragraph for a mission with roles (`m`, the mission's
// record: data/mission.js, handed over by the page, as present/ reads no
// data module), as HTML: its numbers the record's (the attacker's zone
// depth from its own edge, (Breakthrough) the defender's zone's distance
// from it behind a wall, its target, the rounds, (S5a) each role's points
// where they differ; the objective's reach
// the rules'), so the help never states a number the mission doesn't.
// (The March Wall) And the battlefield as its set has it, nothing a seed
// moves: `field` { name, set, races }, handed over by the page too: the
// set's name as the panel's Terrain line says it, its record (core/
// match.js setOf: the gate's hit points and the ram's blow, so the moves
// a ram takes are the set's, hp / ram rounded up) and the race data (the
// units whose `wrecker` flag rams the gate and ploughs the breach, named
// from it, never a list of the copy's own). Left out, the paragraph
// names no battlefield.
export function rolesHelp(m, field = null) {
  const { attack, defend } = m.roles, depth = attack.zone.x[1] + m.board.W / 2
  // ((Breakthrough) a zone behind the line keeps its x bounds' distance
  // from the attacker's zone, the record's number)
  const apart = defend.zone.behind && defend.zone.x ? defend.zone.x[0] - attack.zone.x[1] : null
  // ((S5a) each role's points, its own list's where it has one, else the
  // mission's: the attacker has the numbers, the defender the works)
  const points = (r) => (r.list ?? m.list)?.points
  const pa = points(attack), pd = points(defend)
  const armies = pa && pd && pa !== pd ? ` The attacker musters ${pa.toLocaleString('en')} points and the defender ${pd.toLocaleString('en')}: the attacker has the numbers, the defender the works and the choice not to move.` : ''
  const head = `<b>Breakthrough</b> (a ${m.list?.size ?? 'Field'} battle of its own${field?.name ? `, fought on the <b>${field.name}</b>` : ''}). One army holds a walled line across the table; the other must break through it.${armies} Who attacks is chosen before the battle (the battle-setup panel's <b>Who attacks</b>, or the host's in an online lobby), and the end screen's <b>Swap sides</b> fights the same battlefield again with the roles the other way round. The defender deploys anywhere behind the wall's outer face, on its walk and its towers too, never in front of it${apart !== null ? ` and never within ${tails(apart)} of the attacker's zone` : ''}; the attacker within ${tails(depth)} of its own edge, and moves first, with no roll-off. At the end of every round the attacker scores 1 for each objective behind the wall it holds (the most OC within ${tails(OBJECTIVE_RANGE)}); the defender scores nothing, and holds them off by standing on them. Reaching ${attack.target} wins at once; otherwise the defender wins when round ${m.rounds} ends. There are no draws and no extra rounds.`
  const gate = field?.set?.gate
  if (!gate || !field.races) return `${head} Infantry climb the ladders onto the wall; big units and vehicles need the gate, which blasts chip.`
  const rams = wreckersOf(field.races), blows = Math.ceil(gate.hp / gate.ram)
  return `${head} There are four ways through. <b>The gate</b>, once it is rammed down: ${rams} breaks it by walking into it, one blow a move, so it takes ${blows} moves; blasts chip it too. <b>The siege ladders</b>: infantry climb onto the walk and come down its stair; big units, fliers and vehicles cannot. <b>The breach</b>: ${rams} ploughs through it as it stands; everyone else crosses once blasts have brought its blocks down. <b>The wood</b> on the flank: every walker gets through its trees, slowly; a vehicle only by ploughing.`
}
// the units of every race whose `wrecker` flag rams a gate, by their short
// names in the races' order ("the War-Cart, the Brute or the Howdah")
function wreckersOf(races) {
  const names = Object.values(races).flatMap((r) => Object.values(r.units).filter((t) => t.wrecker).map((t) => `the ${t.short}`))
  return names.length > 1 ? `${names.slice(0, -1).join(', ')} or ${names.at(-1)}` : names[0] ?? 'a wrecker'
}
