// The core's public API (DESIGN §2.2): a battle is a pure function of its
// setup and the commands its seats played. sim/ (and, from R6b, the
// Session that every mode plays through) reaches the core through here only.
//
//   createMatch(setup, { out, onTrace, strict })  a new match, run on to the
//       first decision a human seat makes: the deployment, or (with no human
//       seat) the whole battle, to its end
//   pendingSeats(G)       the seats the match is waiting on
//   fullSetup(setup)      the setup with its defaults filled in, refused
//                         unless the rules can play it (createMatch's own)
//   legal(G, seat, body)  null when the seat may play the command now, else
//                         why not (dice locked: it never rolls)
//   apply(G, seat, body)  plays a legal command and runs the match on to the
//                         next decision
//   preview(G, fn)        fn(G, q) with the dice locked: a tool's preview, the
//                         HUD's model, any question that must not roll
//   q                     the read-only queries (core/queries.js), for
//                         previews and the ?debug surface
//   RULES_ID              which rules a match is played under
// (stateHash, shadowState and CORE_VERSION join at R8.)
//
// G.out is where the match's events go (DESIGN §2.3; null keeps none, for a
// quiet fold), and G.onTrace(line, G) hears each trace line as it is
// written (sim/ and ?debug only); `strict` checks every AI command with
// legal() before it is applied, and throws on one that isn't (sim/'s P-prop).
// Each is I/O, never match state: the rules don't read them.
import { newState, missionOf, raceOf } from './match.js'
import { lock, unlock } from './rng.js'
import { emit, log } from './journal.js'
import { advance, humanSeats } from './engine.js'
import { HANDLERS } from './commands.js'
import * as q from './queries.js'

export { q }
export { legal } from './commands.js'
export { RULES_ID } from './version.js'

// (a copy: whoever sorts or edits the answer leaves the match's decision be)
export const pendingSeats = (G) => [...(G.pending?.seats ?? [])]

// The most rounds a setup may ask for: createMatch plays an all-AI battle
// to its end before it returns, and one neither army wipes out lasts its
// rounds, so a typo must not ask for a million. (F4's vote adds overtime a
// round at a time.)
const MAX_ROUNDS = 99

// A setup with its defaults filled in, refused unless the rules can play it.
//   { board, dice, terrain: 'classic', rounds, overtime: 'never', diceMode:
//     'shared', seats: [{ race, ctrl: 'human' | 'ai' }, …] }
// board and dice are the two seeds (whole numbers, 0 to 2^32 - 1); rounds
// defaults to the mission's, and runs from 1 to MAX_ROUNDS. A field left
// out, null or undefined (a form's or a lobby's empty field) takes its
// default. The setup's own fields come first, in its order, then the
// defaults it left out. (The races and controllers are checked as the seats
// are made, core/match.js.)
export function fullSetup(setup) {
  const s = {}
  for (const [k, v] of Object.entries(setup ?? {})) if (v != null) s[k] = v
  const defaults = { terrain: 'classic', rounds: missionOf(setup).rounds, overtime: 'never', diceMode: 'shared' }
  for (const [k, v] of Object.entries(defaults)) s[k] ??= v
  const seed = (n) => Number.isInteger(n) && n >= 0 && n <= 0xffffffff
  if (!seed(s.board) || !seed(s.dice)) throw new Error(`a setup's board and dice are whole numbers from 0 to 2^32 - 1, not ${s.board} and ${s.dice}`)
  if (!Number.isInteger(s.rounds) || s.rounds < 1 || s.rounds > MAX_ROUNDS) throw new Error(`a battle lasts a whole number of rounds, from 1 to ${MAX_ROUNDS}, not ${s.rounds}`)
  // (the round-limit vote, 'vote', is F4's)
  if (s.overtime !== 'never') throw new Error(`overtime "${s.overtime}": a battle ends after its rounds ('never') until F4's vote`)
  if (s.diceMode !== 'shared') throw new Error(`dice mode "${s.diceMode}": only 'shared' dice so far`)
  if (!Array.isArray(s.seats)) throw new Error('a setup names its seats')
  return s
}

// A new match: the board, both armies deployed, then each human seat asked
// to adjust its deployment (all at once, a "deploy your army" line each, in
// seat order: §4.1 rule 8) or, with none, straight on into the battle.
export function createMatch(setup, { out = null, onTrace = null, strict = false } = {}) {
  const G = newState(fullSetup(setup), { out, onTrace })
  G.strict = strict
  const T = G.turn
  T.stage = 'deploy'
  T.step = 'rolloff'
  const humans = humanSeats(G)
  if (humans.length) {
    emit(G, 'stage', { stage: 'deploy' })
    for (const s of humans) log(G, s, `<b>${raceOf(G, s).name}</b>: deploy your army.`)
    G.pending = { k: 'deploy', seats: humans }
  }
  advance(G)
  return G
}

// fn(G, q) with the match's dice locked, so a draw throws (§4.1 rule 2):
// what a seat's tools show before it commits (a move's reach and path, a
// shot's odds, a charge's spots), the HUD, any question that must never
// roll a die. Nothing above core/ touches the dice stream itself (§1.2), so
// the Session's preview (R6b) is this. Leaves the lock as it found it.
export function preview(G, fn) {
  const was = G.rng.locked
  lock(G.rng)
  try {
    return fn(G, q)
  } finally {
    if (!was) unlock(G.rng)
  }
}

// Play `body` for `seat` (precondition: legal(G, seat, body) is null), then
// run the match on.
export function apply(G, seat, body) {
  if (!Object.hasOwn(HANDLERS, body.t)) throw new Error(`no command "${body.t}"`)
  HANDLERS[body.t](G, seat, body, 'seat')
  advance(G)
}
