// Commands (DESIGN §2.2): what a seat can do, as plain data, and whether it
// may do it now. A command body carries its kind `t` and integers only: units
// by per-match id (`u`, `tg`), places by nav cell index on the half-inch grid
// (`c`), so a float from the view never enters a match's log (§4.1 rule 12).
//
//   place {u, c}      deploy: put one of the seat's units on a cell of its zone
//   deployed {}       deploy: the seat is done (the last one starts the battle)
//   advance {u}       move phase: a D6 more inches (no shooting unless assault,
//                     no charge unless it may charge after advancing)
//   move {u, c}       move phase: move, advance's move, or fall back, to cell c
//   shoot {u, tg}     shoot phase
//   charge {u, tg}    charge phase: declare and roll; on contact a seat's own
//                     charge waits for chargeEnd (the AI's moves the shortest way)
//   chargeEnd {c}     where the charge ends: a cell the roll reaches, -1 for
//                     the shortest move
//   end {}            ends the phase (the charge phase's end plays the fight,
//                     the morale, the score and the turns after it, AI included)
//   auto {}           the AI plays the rest of the phase for the seat, then ends it
//   concede {}        out of band: a human seat gives up, at any time until
//                     the battle is decided (a side wiped out has lost)
// (vote {more}, the F4 round-limit vote, comes with F4. The AI's `hold` is
// its own, never a command: core/ai/policy.js.)
//
// legal(G, seat, body) answers null, or why not: the body carries its kind's
// fields and nothing else, the seat holds the pending decision, the command
// answers that kind of decision (and, in a phase, belongs to it), then the
// per-command rule, which is the check the old click handlers made (§2.2's
// table). It runs under the dice's lock (rng.js
// lock: a draw throws), so asking can never roll a die; it changes nothing
// but the nav cache (a plan refreshes it, which is idempotent: nav is never
// dirty between commands, §4.1 rule 9). HANDLERS[t](G, seat, body, via) plays
// a legal one; `via` is 'seat' for a seat's own command, 'ai' for the AI's
// (an AI seat's, or a human's Auto).
import { lock, unlock } from './rng.js'
import { emit } from './journal.js'
import { ctrl } from './match.js'
import { setUnitPos } from './units.js'
import { placeOk } from './deploy.js'
import {
  alive, isEngaged, movePlan, validEnd, canShoot, shotInfo, chargeTargets, chargePlan, chargeSpots, phaseKey,
} from './queries.js'
import { doMove, doAdvance } from './actions/move.js'
import { doShoot } from './actions/shoot.js'
import { declareCharge, finishCharge } from './actions/charge.js'
import { finishAction, gameOver, runAI } from './engine.js'

const unitOf = (G, id) => G.units.find((u) => u.id === id)

// ── Playing a command ───────────────────────────────────────────────────────
// Actions inside a phase leave the phase's decision pending: the seat goes
// on until it ends the phase. A seat's charge on contact replaces it with
// the chargeEnd decision, which gives it back.
export const HANDLERS = Object.freeze({
  place(G, seat, { u, c }) {
    const unit = unitOf(G, u)
    setUnitPos(unit, G.nav.x(c), G.nav.z(c))
    emit(G, 'unit.place', { u, x: unit.pos.x, z: unit.pos.z })
  },
  deployed(G, seat) {
    // the deployments are simultaneous: one seat done leaves the others theirs
    const left = G.pending.seats.filter((s) => s !== seat)
    G.pending = left.length ? { ...G.pending, seats: left } : null
  },
  advance(G, seat, { u }) {
    doAdvance(G, unitOf(G, u))
  },
  move(G, seat, { u, c }) {
    // (doMove makes the plan afresh from the unit's flags, as legal's)
    doMove(G, unitOf(G, u), c)
    finishAction(G)
  },
  shoot(G, seat, { u, tg }) {
    doShoot(G, unitOf(G, u), unitOf(G, tg))
    finishAction(G)
  },
  // The charge splits where a seat picks its spot (§2.2): nothing is drawn
  // between the halves. A miss, or the AI's charge (which declareCharge
  // takes straight on to the shortest move), ends here; a seat's contact
  // asks it where, with what the pick needs (the roll, and the shortest
  // move's cell for -1).
  charge(G, seat, { u, tg }, via) {
    const pick = declareCharge(G, unitOf(G, u), unitOf(G, tg), via)
    if (!pick) return finishAction(G)
    G.pending = { k: 'chargeEnd', seats: [seat], u, tg, rolled: pick.rolled, cell: pick.plan.cell }
  },
  // the charge's second half: the plan is made again from the unchanged
  // match (finishCharge), and the seat gets its phase back
  chargeEnd(G, seat, { c }) {
    const P = G.pending
    finishCharge(G, unitOf(G, P.u), unitOf(G, P.tg), c === -1 ? P.cell : c)
    G.pending = { k: 'phase', seats: P.seats, phase: phaseKey(G) }
    finishAction(G)
  },
  // (the step machine stands at the phase's end already)
  end(G) {
    G.pending = null
  },
  auto(G, seat) {
    runAI(G, seat, G.pending.phase)
    G.pending = null
  },
  concede(G, seat) {
    gameOver(G, seat)
  },
})

// ── Whether a command is legal now ──────────────────────────────────────────
// Each kind: the decision it answers (`k`; `phase`: the phase it belongs to;
// none for concede, which comes out of band), its integer fields, and its
// own rule.
const RULES = Object.freeze({
  place: { k: 'deploy', fields: ['u', 'c'], ok: (G, seat, { u, c }) => mine(G, seat, u) ?? (placeOk(G, unitOf(G, u), c) ? null : `cell ${c} is no free spot in seat ${seat}'s zone for unit ${u}`) },
  deployed: { k: 'deploy', fields: [] },
  advance: { k: 'phase', phase: 'move', fields: ['u'], ok: (G, seat, { u }) => mine(G, seat, u) ?? mayAdvance(G, unitOf(G, u)) },
  move: { k: 'phase', phase: 'move', fields: ['u', 'c'], ok: (G, seat, { u, c }) => mine(G, seat, u) ?? mayMove(G, unitOf(G, u), c) },
  shoot: { k: 'phase', phase: 'shoot', fields: ['u', 'tg'], ok: (G, seat, { u, tg }) => mine(G, seat, u) ?? foe(G, seat, tg) ?? mayShoot(G, unitOf(G, u), unitOf(G, tg)) },
  charge: { k: 'phase', phase: 'charge', fields: ['u', 'tg'], ok: (G, seat, { u, tg }) => mine(G, seat, u) ?? foe(G, seat, tg) ?? mayCharge(G, unitOf(G, u), unitOf(G, tg)) },
  chargeEnd: { k: 'chargeEnd', fields: ['c'], ok: (G, seat, { c }, P) => mayEnd(G, P, c) },
  end: { k: 'phase', fields: [] },
  auto: { k: 'phase', fields: [] },
  concede: { k: null, fields: [], ok: (G, seat) => mayConcede(G, seat) },
})

// null when `seat` may play `body` now, else why not; never draws a die
// (the dice are locked while it asks) and never changes the match.
export function legal(G, seat, body) {
  return legalFor(G, seat, body, G.pending)
}

// legal() against decision P instead of G.pending: the engine's runAI asks
// it for an AI seat's commands, with the phase decision the seat would hold
// were it a human's, so G.pending is only ever a human seat's (§2.1). Not
// part of the API (core/index.js).
export function legalFor(G, seat, body, P) {
  const was = G.rng.locked
  lock(G.rng)
  try {
    return why(G, seat, body, P)
  } finally {
    if (!was) unlock(G.rng)
  }
}

function why(G, seat, body, P) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return 'not a command'
  const rule = typeof body.t === 'string' && Object.hasOwn(RULES, body.t) ? RULES[body.t] : null
  if (!rule) return `no command "${body.t}"`
  if (!Number.isInteger(seat) || seat < 0 || seat >= G.seats.length) return `no seat ${seat}`
  // its own fields, whole numbers, and nothing else (§4.1 rule 12: a float
  // or a string never enters a match's log; F4's vote brings a boolean)
  for (const k of Object.keys(body)) if (k !== 't' && !rule.fields.includes(k)) return `${body.t} takes no field "${k}"`
  for (const f of rule.fields) if (!Number.isInteger(body[f])) return `${body.t} takes a whole number ${f}`
  if (G.turn.stage === 'over') return 'the battle is over'
  if (rule.k) {
    if (!P || !P.seats.includes(seat)) return `seat ${seat} has no decision to make now`
    if (P.k !== rule.k) return `${body.t} doesn't answer the ${P.k} decision`
    if (rule.phase && P.phase !== rule.phase) return `${body.t} belongs to the ${rule.phase} phase, not the ${P.phase}`
    return rule.ok?.(G, seat, body, P) ?? null
  }
  return rule.ok(G, seat, body)
}

// one of the seat's own units, still standing
function mine(G, seat, id) {
  const u = unitOf(G, id)
  return u && alive(u) && u.side === seat ? null : `unit ${id} is no standing unit of seat ${seat}`
}
// a standing enemy of the seat
function foe(G, seat, id) {
  const u = unitOf(G, id)
  return u && alive(u) && u.side !== seat ? null : `unit ${id} is no standing enemy of seat ${seat}`
}
const inGrid = (G, c) => c >= 0 && c < G.nav.N

// a human seat, while the battle is undecided: a side wiped out mid-phase
// has lost already (the battle ends at the phase's end), so neither seat
// can turn that into a concession
function mayConcede(G, seat) {
  if (ctrl(G, seat) !== 'human') return `seat ${seat} is the AI's: only a human seat concedes`
  return G.turn.wiped >= 0 ? `the battle is decided: seat ${G.turn.wiped} is wiped out` : null
}

function mayAdvance(G, u) {
  if (u.flags.moved) return `${u.t.short} has moved`
  if (u.flags.advanced) return `${u.t.short} has advanced`
  return isEngaged(G, u) ? `${u.t.short} is in combat` : null
}
// Its move this phase (an advance's move on its roll, a fall back when in
// combat): ending on c, as the plan the move itself will make has it.
function mayMove(G, u, c) {
  if (u.flags.moved) return `${u.t.short} has moved`
  if (!inGrid(G, c) || !validEnd(G, movePlan(G, u, u.flags.advanced ? u.flags.advRoll : 0), c)) return `${u.t.short} can't end its move on cell ${c}`
  return null
}
function mayShoot(G, u, tg) {
  if (!canShoot(G, u)) return `${u.t.short} can't shoot now`
  const info = shotInfo(G, u, tg)
  return info.ok ? null : `${u.t.short} can't shoot ${tg.t.short}: ${info.why}`
}
function mayCharge(G, u, tg) {
  if (!chargeTargets(G, u).includes(tg)) return `${u.t.short} can't charge ${tg.t.short}`
  return chargePlan(G, u, tg) ? null : `${u.t.short} has no way to ${tg.t.short}`
}
// a spot the roll reaches around the target (chargeSpots), or -1
function mayEnd(G, P, c) {
  if (c === -1) return null
  const plan = inGrid(G, c) && chargePlan(G, unitOf(G, P.u), unitOf(G, P.tg))
  return plan && chargeSpots(plan, P.rolled)[c] ? null : `the charge can't end on cell ${c} (rolled ${P.rolled}")`
}
