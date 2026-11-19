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
// depth from its own edge, its target, the rounds; the objective's reach
// the rules'), so the help never states a number the mission doesn't.
// The battlefield as every line set has it: a walled line across the
// table, its gate and its ladders; nothing a seed moves.
export function rolesHelp(m) {
  const { attack } = m.roles, depth = attack.zone.x[1] + m.board.W / 2
  return `<b>Breakthrough</b> (a ${m.list?.size ?? 'Field'} battle of its own). One army holds a walled line across the table; the other must break through it. Who attacks is chosen before the battle (the battle-setup panel's <b>Who attacks</b>, or the host's in an online lobby), and the end screen's <b>Swap sides</b> fights the same battlefield again with the roles the other way round. The defender deploys on and behind the line, up to its front face; the attacker within ${tails(depth)} of its own edge, and moves first, with no roll-off. At the end of every round the attacker scores 1 for each objective beyond the line it holds (the most OC within ${tails(OBJECTIVE_RANGE)}); the defender scores nothing, and holds them off by standing on them. Reaching ${attack.target} wins at once; otherwise the defender wins when round ${m.rounds} ends. There are no draws and no extra rounds. Infantry climb the ladders onto the wall; big units and vehicles need the gate. A Brute, a War-Cart or a Howdah smashes the gate by walking into it, and blasts chip it.`
}
