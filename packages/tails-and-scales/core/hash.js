// The match's fingerprint (DESIGN §2.6): what every peer folding the same
// log must hold between two commands, as one string and its hash.
//
// An entry that answers a single seat's decision (a phase's command, a
// charge's end) carries `h`, stateHash of the match its author saw; the
// Folder (match/fold.js) checks it against its own before anything else
// about the command, so a peer whose fold has drifted (another engine's
// maths, a patched build) is told so at the first such entry instead of
// playing on in another battle. That needs a string every engine prints
// alike from the same match:
//   - the turn: stage, step, round, t, first, active, ph, vp, wiped,
//     overtime;
//   - the decision pending (canonical JSON: whole numbers and names only);
//   - every unit, in G.units order: id, pos.x and pos.z, r, alive, lost,
//     mesmerized, its flags in sorted keys, and each model's w, alive, ox
//     and oz;
//   - every chunk, in the terrain's order: id, alive, hp, shape.y;
//   - the dice: rngState and the generator's word.
// Numbers print with String(n) (ES Number::toString, exact on every engine,
// Infinity included: an indestructible chunk's hp), never toFixed, so a
// difference in the last bit is a difference here; and -0 as '-0', which
// String(n) would print as 0 (the rules can tell them apart: atan2(0, -0)
// is pi). It is a superset of what the trace's state lines print
// (traceState).
//
// What is not match state is left out: G.out, G.onTrace and G.strict (the
// I/O fields, §0.2 #12), the nav grid (derived from the terrain, refreshed
// at fixed sites, never dirty between commands), the setup (fixed at the
// start), the journal (the trace is a function of the commands; its
// pendingLog is empty between commands) and the units' type records (the
// rules data, RULES_ID's).
//
// shadowState(G) is the string itself, for a desync report and debugging.
// It is not parity's shadow: sim/baselines hashes the legacy shadow format
// (sim/oracle/shadow.mjs), frozen at R0. Neither draws a die or changes G.
import { rngState } from './rng.js'
import { cyrb53, canonicalJSON } from './util.js'

const num = (n) => (Object.is(n, -0) ? '-0' : String(n))

// a unit's flags, in sorted keys (a flag set to undefined is no flag)
const flagsOf = (f) => Object.keys(f).filter((k) => f[k] !== undefined).sort().map((k) => `${k}=${String(f[k])}`).join(',')

export function shadowState(G) {
  const T = G.turn
  const turn = [T.stage, T.step, T.round, T.t, T.first, T.active, T.ph, T.vp.join('-'), T.wiped, T.overtime].map(String).join(',')
  const units = G.units.map((u) => [
    u.id, num(u.pos.x), num(u.pos.z), num(u.r), u.alive, u.lost, u.mesmerized, `{${flagsOf(u.flags)}}`,
    u.models.map((m) => `${num(m.w)}/${m.alive}/${num(m.ox)}/${num(m.oz)}`).join(' '),
  ].join(',')).join(';')
  const chunks = G.terrain.chunks.map((c) => `${c.id},${c.alive},${num(c.hp)},${num(c.shape.y)}`).join(';')
  return `turn ${turn}\npending ${canonicalJSON(G.pending)}\nunits ${units}\nchunks ${chunks}\nrng ${rngState(G.rng)} ${G.rng.a}`
}

// cyrb53 of shadowState, base 36: the `h` an entry carries
export const stateHash = (G) => cyrb53(shadowState(G)).toString(36)
