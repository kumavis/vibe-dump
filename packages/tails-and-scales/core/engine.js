// The engine (DESIGN §2.2): the battle as a step machine. advance(G) runs the
// match on from where it stands until a human seat has a decision to make
// (G.pending) or the battle is over: the roll-off, each turn's five phases
// (an AI seat's played by its generator, core/ai/policy.js, here inside the
// fold, so every peer plays it alike and an AI seat appends nothing), the
// score at each round's end, and the game's end.
//
// It is the old battle loop (main.js's battle() and playerTurn(), which
// plays the shipped game until R6b) unrolled into resumable steps, with
// every statement in its old order, so the trace lines up line for line:
//
//   rolloff    the stage, the flags, the roll-off (do…while: §4.1 rule 4)
//   turnStart  the active seat, its units' flags reset, the first phase
//   phase      the phase begins: the fight or the morale plays itself, a
//              phase with nothing to do is a beat, a human seat is asked
//              (G.pending), an AI seat plays it now (runAI)
//   phaseEnd   its state line, the wipe check (a wipe ends the game before
//              the mesmerism wears off), the next phase or the turn's end
//   turnEnd    the mesmerism of the seat whose turn it was wears off
//   score      the round is scored; the next round, or the game is over
//
// Between two commands G holds no control state but these fields (§0.2
// #12): no promise, no generator, no closure. Synchronous like the actions:
// what the view shows is events in G.out (§2.3), never awaited.
import { PHASES, roll } from './rules.js'
import { emit, log, flush, traceState } from './journal.js'
import { ctrl, raceOf } from './match.js'
import { alive, isEngaged, anyCanAct, ownersOf, statusOf, phaseKey } from './queries.js'
import { fightPhase } from './actions/fight.js'
import { moralePhase } from './actions/morale.js'
import { aiPhase } from './ai/policy.js'
import { HANDLERS, legalFor } from './commands.js'

// the seats a human plays, in seat order
export const humanSeats = (G) => G.seats.filter((s) => s.ctrl === 'human').map((s) => s.seat)

// Run the battle on until a decision is pending or it is over. Ends with a
// `pending` event naming the decision waited on, when there is one.
export function advance(G) {
  const T = G.turn
  while (!G.pending && T.stage !== 'over') {
    switch (T.step) {
      case 'rolloff':
        // the flags show who holds what from now on (the mirror's stage, and
        // its owners, come from these events alone)
        T.stage = 'battle'
        emit(G, 'stage', { stage: 'battle' })
        if (G.out) emit(G, 'objectives', { owners: ownersOf(G) })
        rollOff(G)
        T.round = 1
        T.t = 0
        T.step = 'turnStart'
        break
      case 'turnStart':
        T.active = (T.first + T.t) % 2
        resetTurn(G, T.active)
        T.ph = 0
        T.step = 'phase'
        break
      case 'phase': {
        const ph = phaseKey(G)
        emit(G, 'phase.start', { side: T.active, phase: ph, round: T.round })
        T.step = 'phaseEnd'
        if (ph === 'fight') {
          if (G.units.some((u) => alive(u) && isEngaged(G, u))) fightPhase(G, T.active)
        } else if (ph === 'morale') moralePhase(G)
        else if (!anyCanAct(G, T.active)) emit(G, 'pause', { s: 0.2 })
        else if (ctrl(G, T.active) === 'human') G.pending = { k: 'phase', seats: [T.active], phase: ph }
        else runAI(G, T.active, ph)
        break
      }
      case 'phaseEnd':
        traceState(G, `phase ${T.active}:${phaseKey(G)}`)
        checkWipe(G)
        // (a wipe skips the mesmerism's end, as the old loop's return did)
        if (T.wiped >= 0) {
          gameOver(G)
          break
        }
        T.step = ++T.ph < PHASES.length ? 'phase' : 'turnEnd'
        break
      case 'turnEnd':
        endMesmerism(G, T.active)
        T.step = ++T.t < 2 ? 'turnStart' : 'score'
        break
      case 'score':
        scoreRound(G)
        if (T.round < G.setup.rounds) {
          T.round++
          T.t = 0
          T.step = 'turnStart'
        } else if (G.setup.overtime === 'vote' && humanSeats(G).length) {
          // (F4: the human seats vote on playing another round; until then
          // createMatch refuses a setup that asks for the vote)
          G.pending = { k: 'roundLimit', seats: humanSeats(G), votes: {} }
        } else gameOver(G)
        break
      default:
        throw new Error(`the engine has no step "${T.step}"`)
    }
  }
  if (G.pending && G.out) emit(G, 'pending', { k: G.pending.k, seats: [...G.pending.seats] })
}

// Roll off for the first turn: a D6 each, seat 0's first, again on a tie
// (§4.1 rule 4's do…while); the higher goes first.
export function rollOff(G) {
  const T = G.turn
  emit(G, 'tray.open', { title: 'Roll-off for the first turn' })
  let a, b
  do {
    a = roll(G, 1)
    b = roll(G, 1)
    emit(G, 'dice', { label: raceOf(G, 0).short, dice: a, need: 0, sum: true })
    emit(G, 'dice', { label: raceOf(G, 1).short, dice: b, need: 0, sum: true })
  } while (a[0] === b[0])
  T.first = a[0] > b[0] ? 0 : 1
  log(G, T.first, `<b>${raceOf(G, T.first).name}</b> win the roll-off and take the first turn.`, 'big')
}

// A seat's turn begins: every unit's losses this turn are forgotten, and the
// seat's own units may act again.
export function resetTurn(G, side) {
  for (const u of G.units) {
    u.lost = 0
    if (u.side === side) u.flags = {}
  }
}

// Mesmerism wears off at the end of the victim's own turn.
export function endMesmerism(G, side) {
  for (const u of G.units) if (u.side === side && u.mesmerized) u.mesmerized = false
  // every label
  if (G.out) emit(G, 'status', statusOf(G))
}

// An action's end: its state line in the trace, then what the table shows of
// it (who holds each objective; every label), the `act` itself, and whether
// a side is gone. (Under ?debug main.js's `act` carries the match as it
// should be shown, project(G), which core can't compute: present/ is above
// it. R6b's Session sink adds it.)
export function finishAction(G) {
  traceState(G, 'act')
  if (G.out) {
    emit(G, 'objectives', { owners: ownersOf(G) })
    emit(G, 'status', statusOf(G))
  }
  emit(G, 'act', { tag: 'act' })
  checkWipe(G)
}

// A seat with no unit left standing is wiped off the table.
export function checkWipe(G) {
  for (const s of [0, 1]) if (!G.units.some((u) => u.side === s && alive(u))) G.turn.wiped = s
}

// The round's end: one victory point per objective held, then its state line
// and the score in the battle log.
export function scoreRound(G) {
  const T = G.turn
  const owners = ownersOf(G)
  const held = [0, 0]
  for (const c of owners) if (c >= 0) held[c]++
  T.vp[0] += held[0]
  T.vp[1] += held[1]
  traceState(G, `round ${T.round}`)
  const a = raceOf(G, 0).short, b = raceOf(G, 1).short
  log(G, -1, `End of round ${T.round}: ${a} hold ${held[0]} objective${held[0] === 1 ? '' : 's'}, ${b} hold ${held[1]}. Score ${T.vp[0]}–${T.vp[1]}.`, 'big')
  emit(G, 'round.scored', { round: T.round, held: [...held], vp: [...T.vp], owners })
}

// The battle is over: the held-back lines, its state line (traced while the
// stage still says battle, as ever), then the result: the seat that didn't
// concede, the seat left standing, or the higher score (-1, a draw).
// `rounds` on game.over is the rounds played, the one under way counted:
// the last on the score, the round it ended in for a wipe-out or a
// concession mid-round, and 0 for a concession in the deployment (where
// the turn's round already says 1).
export function gameOver(G, conceded = -1) {
  const T = G.turn
  const rounds = T.stage === 'deploy' ? 0 : T.round
  // the destroyed-unit lines still held back
  flush(G)
  traceState(G, 'over')
  T.stage = 'over'
  G.pending = null
  emit(G, 'stage', { stage: 'over' })
  const win = conceded >= 0 ? 1 - conceded : T.wiped >= 0 ? 1 - T.wiped : T.vp[0] > T.vp[1] ? 0 : T.vp[1] > T.vp[0] ? 1 : -1
  const why = conceded >= 0 ? 'concede' : T.wiped >= 0 ? 'wipe' : 'score'
  T.result = { win, why }
  emit(G, 'game.over', { win, why, vp: [...T.vp], rounds })
}

// The AI plays seat `seat`'s `phase`: each command its generator yields is
// applied before it is asked for the next, `via` 'ai' (a charge goes
// straight on to its shortest move). Also a human's Auto. G.pending stays
// as it was (nothing for an AI seat, the seat's own phase for an Auto): an
// AI seat never holds a decision there (§2.1). With G.strict (sim/'s
// P-prop) every command is first judged by legal() against the phase
// decision the seat would hold were it a human's (legalFor), so the AI
// never issues one a seat couldn't.
export function runAI(G, seat, phase) {
  const was = G.pending
  const P = { k: 'phase', seats: [seat], phase }
  for (const cmd of aiPhase(G, seat, phase)) {
    if (G.strict) {
      const why = legalFor(G, seat, cmd, P)
      if (why) throw new Error(`the AI (seat ${seat}, ${phase} phase) asked for ${JSON.stringify(cmd)}, which is illegal: ${why}`)
    }
    HANDLERS[cmd.t](G, seat, cmd, 'ai')
    if (G.pending !== was) throw new Error(`the AI's ${JSON.stringify(cmd)} left a decision open: ${JSON.stringify(G.pending)}`)
  }
}
