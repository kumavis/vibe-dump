// The core's public API (DESIGN §2.2): a battle is a pure function of its
// setup and the commands its seats played. sim/ and the Session that every
// mode plays through (match/session.js) reach the core through here; the
// view reads the queries (q) and asks through preview().
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
//   RULES_ID, CORE_VERSION  which rules a match is played under: the hash of
//                         the rule-bearing data, and the rules code's own
//                         number (core/version.js; a match's `start` carries
//                         both, match/fold.js)
//   stateHash(G), shadowState(G)  the match's fingerprint between commands,
//                         and the string it hashes (core/hash.js): the `h`
//                         an entry carries, and a desync report's
//   KINDS                 the command kinds legal() knows (an envelope's
//                         decoder refuses any other: match/envelope.js)
//   canonicalJSON         JSON with sorted keys (core/util.js): how a log
//                         entry is written, so equal entries are equal text
//   cyrb53                the string hash RULES_ID and stateHash use
//                         (core/util.js): the Folder's head after a
//                         simultaneous decision closes
//
// G.out is where the match's events go (DESIGN §2.3; null keeps none, for a
// quiet fold), and G.onTrace(line, G) hears each trace line as it is
// written (sim/'s, and the page's in every battle: app/flow.js takes the
// unit card's facts at each act line, and ?debug's trace listener reads
// it); `strict` checks every AI command with legal() before it is applied,
// and throws on one that isn't (sim/'s P-prop). Each is I/O, never match
// state: the rules don't read them, and stateHash leaves them out.
import { newState, missionOf, seatName, SETUP_KEYS, SEAT_KEYS } from './match.js'
import { MISSIONS } from '../data/mission.js'
import { lock, unlock } from './rng.js'
import { emit, log } from './journal.js'
import { advance, humanSeats } from './engine.js'
import { HANDLERS } from './commands.js'
import * as q from './queries.js'

export { q }
export { legal, KINDS } from './commands.js'
export { RULES_ID, CORE_VERSION } from './version.js'
export { stateHash, shadowState } from './hash.js'
export { canonicalJSON, cyrb53 } from './util.js'
export { SETUP_KEYS, SEAT_KEYS, missionOf } from './match.js'

// (a copy: whoever sorts or edits the answer leaves the match's decision be)
export const pendingSeats = (G) => [...(G.pending?.seats ?? [])]

// The most rounds a setup may ask for: createMatch plays an all-AI battle
// to its end before it returns, and one neither army wipes out lasts its
// rounds, so a typo must not ask for a million. (F4's vote adds overtime a
// round at a time, and only with a human seat to vote.)
const MAX_ROUNDS = 99

// A setup with its defaults filled in, refused unless the rules can play it.
//   { board, dice, mission: 'classic', terrain, rounds, overtime: 'never' |
//     'vote', diceMode: 'shared', seats: [{ race, ctrl: 'human' | 'ai',
//     dev?, name?, nonce? }, …] }
// overtime 'vote' (F4): once the rounds are played, the human seats vote on
// another round, and again after each one (a battle with no human seat ends
// on its rounds all the same).
// board and dice are the two seeds (whole numbers, 0 to 2^32 - 1). (F8a)
// The mission (data/mission.js) chooses the board; terrain defaults to its
// first set and must be one of its sets; rounds defaults to its rounds, and
// runs from 1 to MAX_ROUNDS. A field left out, null or undefined (a form's
// or a lobby's empty field) takes its default. The setup's own fields come
// first, in its order, then the defaults it left out. (F8a) A field outside
// SETUP_KEYS, or a seat's outside SEAT_KEYS, is refused (one left null is
// left out, as ever), in the order the checks below make. (The races and
// controllers are checked as the seats are made, core/match.js.)
export function fullSetup(setup) {
  // (the whitelist reads the setup's own fields before any is copied: a
  // `__proto__` field, an own key of a parsed log entry, would otherwise set
  // the copy's prototype rather than be a field of it, and slip past)
  const fields = Object.entries(setup ?? {}).filter(([, v]) => v != null)
  for (const [k] of fields) if (!SETUP_KEYS.includes(k)) throw new Error(`a setup takes no field "${k}"`)
  const s = {}
  for (const [k, v] of fields) s[k] = v
  if (Array.isArray(s.seats)) {
    s.seats.forEach((seat, i) => {
      if (seat === null || typeof seat !== 'object' || Array.isArray(seat)) throw new Error(`seat ${i} is ${JSON.stringify(seat)}, not a record of its race and controller`)
      for (const [k, v] of Object.entries(seat)) if (v != null && !SEAT_KEYS.includes(k)) throw new Error(`seat ${i} takes no field "${k}"`)
    })
  }
  s.mission ??= 'classic'
  // (MISSIONS has no prototype, so only a mission's own name is in it)
  if (typeof s.mission !== 'string' || !(s.mission in MISSIONS)) throw new Error(`no mission ${JSON.stringify(s.mission)} (there ${Object.keys(MISSIONS).length === 1 ? 'is' : 'are'} ${Object.keys(MISSIONS).join(', ')})`)
  const mission = missionOf(s)
  s.terrain ??= mission.sets[0]
  if (!mission.sets.includes(s.terrain)) throw new Error(`the ${s.mission} mission is fought on ${mission.sets.join(' or ')}, not ${JSON.stringify(s.terrain)}`)
  const defaults = { rounds: mission.rounds, overtime: 'never', diceMode: 'shared' }
  for (const [k, v] of Object.entries(defaults)) s[k] ??= v
  const seed = (n) => Number.isInteger(n) && n >= 0 && n <= 0xffffffff
  if (!seed(s.board) || !seed(s.dice)) throw new Error(`a setup's board and dice are whole numbers from 0 to 2^32 - 1, not ${s.board} and ${s.dice}`)
  if (!Number.isInteger(s.rounds) || s.rounds < 1 || s.rounds > MAX_ROUNDS) throw new Error(`a battle lasts a whole number of rounds, from 1 to ${MAX_ROUNDS}, not ${s.rounds}`)
  if (s.overtime !== 'never' && s.overtime !== 'vote') throw new Error(`overtime "${s.overtime}": a battle ends after its rounds ('never') or its human seats vote on more ('vote')`)
  if (s.diceMode !== 'shared') throw new Error(`dice mode "${s.diceMode}": only 'shared' dice so far`)
  if (!Array.isArray(s.seats)) throw new Error('a setup names its seats')
  return s
}

// A new match: the board, both armies deployed, then each human seat asked
// to adjust its deployment (all at once, a "deploy your army" line each, in
// seat order: §4.1 rule 8) or, with none, straight on into the battle.
export function createMatch(setup, { out = null, onTrace = null, strict = false } = {}) {
  // (newState stands the turn at the deployment, the roll-off next)
  const G = newState(fullSetup(setup), { out, onTrace })
  G.strict = strict
  const humans = humanSeats(G)
  if (humans.length) {
    emit(G, 'stage', { stage: 'deploy' })
    for (const s of humans) log(G, s, `<b>${seatName(G, s)}</b>: deploy your army.`)
    G.pending = { k: 'deploy', seats: humans }
  }
  inApply(G, () => advance(G))
  return G
}

// (S3, DESIGN §4.2.2) fn() with the match's plan memo open (G.nav.memo,
// core/actions/move.js movePlan: the last plan and its key, `sig`), and shut again
// however fn leaves: one apply's plans are shared within it, never past it,
// and none is left behind by a throw (runAI's strict check).
function inApply(G, fn) {
  G.nav.memo = { sig: null, plan: null }
  try {
    return fn()
  } finally {
    G.nav.memo = null
  }
}

// fn(G, q) with the match's dice locked, so a draw throws (§4.1 rule 2):
// what a seat's tools show before it commits (a move's reach and path, a
// shot's odds, a charge's spots), the HUD, any question that must never
// roll a die. Nothing above core/ touches the dice stream itself (§1.2), so
// the Session's preview is this. Leaves the lock as it found it.
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
  inApply(G, () => {
    HANDLERS[body.t](G, seat, body, 'seat')
    advance(G)
  })
}
