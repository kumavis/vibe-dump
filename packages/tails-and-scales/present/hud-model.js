// The HUD model (DESIGN §2.11): what the HUD shows, and what each unit's
// ring and card say, worked out without touching the page. It reads the
// match as shown (the mirror) for the score, the round, the seat and the
// phase, and asks the match itself (G: who can act, what a unit picked up
// may do) only once the table has caught up with it (the player idle) and
// the decision the match waits on is a seat's played here (§2.4), through
// the Session's preview, with the dice locked. What only says which
// decision the table is on (the decision pending, the turn's round, whether
// a seat is the AI's, the rounds in the setup) it reads from G while the
// table plays too, as R6b's rule did. ui/hud.js and ui/actions.js put it on
// the page, and view/units.js paints the rings.
//
//   hudModel({ G, mirror, session, input, hud }) → {
//     vp, round, phase, active    the score, the round, the phase and the
//                                 seat as shown (null and -1 outside the
//                                 battle)
//     end, auto, advance, shortest   the action buttons: { show, label,
//                                 busy } (show or label null: as it was);
//                                 end.ready, nothing left to do in the
//                                 seat's phase, and end.lit, End lit for
//                                 it (F3: ready, or Begin battle in the
//                                 deployment)
//     zones                       each seat's deployment zone's opacity
//     hint                        the hint line ('' for none)
//     rings                       each unit's ring: (view) → [colour, opacity]
//     buttonsUp                   the HUD's state for the next model
//   }
//   G        the match the table shows: the battle's, or on the title its
//            backdrop
//   session  the battle's Session (null on the title)
//   input    the local human's (input/human.js): { idle, decision (the
//            pending decision when a seat played here holds it), mode, deploy
//            (the seat deploying here, or -1), sel, pick (a charge's end
//            being picked), hover }
//   hud      the HUD's own state, kept from the last model: { phaseShown,
//            buttonsUp, hint, sides (each seat's look: ui/theme.js) }
//
// The rule is R6b's refreshUI and refreshRings, unchanged: End, Auto and
// Advance show while a local seat's decision is the one the table shows (its
// phase begun on the table: the mirror's stage, seat, phase and round, once
// a phase.start has played since the last stage event, `phaseShown`), go
// disabled (busy) while the table plays, and keep what they showed while it
// plays, so they never read the match before the table has caught up with
// it; they hide once the decision moves on (an End or an Auto hands the
// phase over). A charge that makes contact keeps them up, disabled, through
// its roll and its walk (`buttonsUp`), but for the pick itself, where
// Shortest move stands in their place. The hint keeps what it said while
// nothing new applies.
//
// After a snap (view/player.js: a new table, a battle's start, and from N2 a
// rejoin, a scrub or the catch-up) the table is the match as it stands, so
// the HUD's own state is derived again (afterSnap): a phase has been shown
// once the mirror's stage is 'battle' (a snap's mirror, project(G), carries
// the turn's fields), and the buttons come up as the player is idle on a
// local seat's decision.
//
// The unit card's facts (cardStatus): what a unit did this turn and whether
// it stands in cover read the match, which runs ahead of the table; so the
// card reads them from G only while the player is idle, and while it is
// behind from a record of the match as it stood at the last action's end or
// the last stop for a decision the table has played (factsOf, taken as each
// `act` line is written and as the match stops after each entry, where the
// table shows it as it stands once it has played that far: a deployment's
// placements are in the record as the battle begins; app/flow.js), each
// turn's start clearing its seat's (as the match's own turn start does).
// What a fight or a morale phase changes without an action's end (a pile-in,
// a model slain or fled) reaches it at the next action's end or stop.
import { PHASES } from '../core/rules.js'
import { inCover } from '../core/queries.js'

// a phase's name by its key ('move' → 'Movement')
export const PHASE_NAME = Object.fromEntries(PHASES.map((p) => [p.key, p.name]))
// the phase a turn begins with
const [FIRST] = PHASES.map((p) => p.key)

// the HUD's state as a snap leaves it (M: the snap's mirror)
export const afterSnap = (M) => ({ phaseShown: M.stage === 'battle', buttonsUp: false })

export function hudModel({ G, mirror: M, session, input, hud }) {
  const { idle, decision: P, deploy, sel, pick: pk } = input
  const { phaseShown, sides } = hud
  const rounds = G.setup.rounds
  const ask = (fn) => session.preview(fn)
  const g = session?.G ?? null
  const deploying = P?.k === 'deploy'
  // the seat's own phase, which the table has reached (its banner played:
  // the mirror's turn fields are the last phase.start's)
  const mine = phaseShown && P?.k === 'phase' && M.stage === 'battle' && M.active === P.seats[0] && M.phase === P.phase && M.round === g.turn.round
  // (the same seat's charge, waiting on its end: still its own phase)
  const charging = phaseShown && P?.k === 'chargeEnd' && M.stage === 'battle' && M.active === P.seats[0] && M.phase === 'charge' && M.round === g.turn.round
  const buttonsUp = !mine && !charging ? false : idle ? true : hud.buttonsUp
  // (the pick hides them: Shortest move stands in their place)
  const up = buttonsUp && !pk
  const end = {
    show: deploying || up,
    label: deploying ? 'Begin battle ▸' : mine ? `End ${PHASE_NAME[P.phase]} ▸` : null,
    busy: !idle,
    // nothing left to do in the seat's phase (asked only once the table has
    // caught up)
    ready: mine && idle ? !ask((G, q) => q.anyCanAct(G, P.seats[0])) : false,
  }
  // (F3) End lit when there is nothing else to do: the phase's units all
  // spent, or the deployment, where Begin battle is the only way on
  end.lit = deploying || end.ready
  const advance = {
    show: !mine ? false : idle ? P.phase === 'move' && !!sel && !sel.flags.moved && !sel.flags.advanced && !ask((G, q) => q.isEngaged(G, sel)) : null,
    label: !sel ? null : sel.t.chargeAfterAdvance ? 'Advance (+D6") — can still charge' : `Advance (+D6") — no ${sel.t.ranged?.assault ? 'charge' : 'shooting or charge'} after`,
    busy: !idle,
  }
  // hint line (a picked-up unit's kept as it was while the table plays its
  // action: the match has moved on already)
  let hint = hud.hint
  if (pk) hint = `Charge! Rolled ${pk.rolled}" — click the orange area to place ${pk.u.t.short}, or take the shortest move.`
  else if (deploying) hint = `Deployment — click one of your units, then click inside your shaded zone to move it there.`
  else if (g && phaseShown && M.stage === 'battle' && g.seats[M.active].ctrl !== 'human') hint = `${sides[M.active].name} (AI) are taking their turn…`
  else if (mine && (idle || !sel)) {
    hint = {
      move: sel ? (ask((G, q) => q.isEngaged(G, sel)) ? 'Engaged — click inside the red area to fall back (no shooting or charging after).' : 'Click inside the shaded area to move. Difficult ground costs double.') : 'Movement — pick a unit with a white ring to move it.',
      shoot: sel ? 'Click an enemy unit to shoot it. Hover for odds.' : 'Shooting — pick a unit with a white ring to fire.',
      charge: sel ? 'Click an enemy within 12" to declare a charge, then roll 2D6.' : 'Charge — pick a unit to charge with.',
    }[P.phase] || ''
  } else if (!mine) hint = ''
  return {
    vp: [M.vp[0], M.vp[1]],
    round: M.stage === 'deploy' ? 'Deployment' : `Round ${Math.min(M.round, rounds)} / ${rounds}`,
    phase: M.stage === 'battle' ? M.phase : null,
    active: M.stage === 'battle' ? M.active : -1,
    end,
    auto: { show: up, busy: !idle },
    advance,
    shortest: { show: !!pk },
    // the deploying seat's zone is lit; in battle both dim
    zones: [0, 1].map((s) => (M.stage === 'battle' || M.stage === 'over' ? 0.05 : s === deploy ? 0.2 : 0.07)),
    hint,
    rings: ringLooks({ session, input }),
    buttonsUp,
  }
}

// Each unit's ring: the one picked up, the deploying seat's, a charge's
// target, and on a seat's own turn who can act and what the picked-up unit
// can shoot or charge (asked of the match, so only once the table has
// caught up); the one under the pointer. (view) → [colour, opacity], by the
// unit's view (the ?debug snap check paints a fresh table's rings with it
// too).
export function ringLooks({ session, input }) {
  const { mode, deploy: dep, pick: pk, sel, hover } = input
  // (unit id → [colour, opacity]) for what the match says, on a seat's turn
  const lit = mode !== 'phase' ? new Map() : session.preview((G, q) => {
    const ph = q.phaseKey(G), out = new Map()
    for (const u of G.units) {
      if (!q.alive(u) || u === sel) continue
      if (q.canAct(G, u)) out.set(u.id, ['#ffffff', 0.75])
      else if (sel && ph === 'shoot' && u.side !== sel.side && q.shotInfo(G, sel, u).ok) out.set(u.id, ['#ff5a4a', 0.95])
      else if (sel && ph === 'charge' && u.side !== sel.side && q.chargeTargets(G, sel).includes(u)) out.set(u.id, ['#ffa040', 0.95])
    }
    return out
  })
  return (v) => {
    if (v.id === sel?.id) return ['#ffe680', 1]
    if (dep >= 0 && v.u.side === dep) return ['#ffffff', 0.5]
    if (pk && v.id === pk.tg.id) return ['#ffa040', 0.95]
    if (lit.has(v.id)) return lit.get(v.id)
    if (v.id === hover?.id) return ['#ffffff', 0.35]
    return ['#ffffff', 0]
  }
}

// ── The unit card's facts ───────────────────────────────────────────────────
// What unit `u` of match G has done this turn and whether it stands in
// cover, as G has it now.
export const factOf = (G, u) => ({
  side: u.side, moved: !!u.flags.moved, fellBack: !!u.flags.fellBack, advanced: !!u.flags.advanced, advRoll: u.flags.advRoll,
  shot: !!u.flags.shot, charged: !!u.flags.charged, cover: inCover(G, u),
})
// Every unit's, by id: the record the card reads while the table is behind
// (taken as each action's `act` line is written, the match as it stood then;
// at each stop for a decision and at a snap, the match as it stands).
export function factsOf(G) {
  const out = {}
  for (const u of G.units) out[u.id] = factOf(G, u)
  return out
}
// A seat's turn begins (its first phase.start played): its units have done
// nothing yet this turn, as the match's own turn start says (a copy).
export function turnBegun(facts, e) {
  if (e.phase !== FIRST) return facts
  const out = {}
  for (const [id, f] of Object.entries(facts)) out[id] = f.side === e.side ? { ...f, moved: false, fellBack: false, advanced: false, advRoll: undefined, shot: false, charged: false } : f
  return out
}

// The card's status line for a unit: `mu` the unit as shown (the mirror's:
// what stands, what wounds are left, mesmerized, in combat) and `f` its
// facts (factOf: the match's own while the table has caught up with it,
// else the record of the last action the table has played).
export function cardStatus(t, mu, f) {
  const status = []
  if (f.moved) status.push(f.fellBack ? 'fell back' : f.advanced ? `advanced +${f.advRoll}"` : 'moved')
  if (f.shot) status.push('shot')
  if (f.charged) status.push('charged')
  if (mu.mesmerized) status.push('🌀 mesmerized')
  if (mu.alive > 0 && mu.engaged) status.push('⚔ in combat')
  if (mu.alive > 0 && f.cover) status.push('🛡 in cover')
  const models = t.models > 1 ? `${mu.alive}/${t.models} models` : `${mu.models[0].w}/${t.W} wounds`
  return `${mu.alive > 0 ? models : 'destroyed'}${status.length ? ' · ' + status.join(' · ') : ''}`
}

// How the battle ended, from the match itself (a snap past its game.over,
// whose event the table never played): the game.over event's fields. The
// rounds played: the last on the score, the round it ended in for a wipe-out
// or a concession, 0 for a concession in the deployment (the match then never
// left its roll-off step).
export function resultOf(G) {
  const T = G.turn
  return { win: T.result.win, why: T.result.why, vp: [...T.vp], rounds: T.step === 'rolloff' ? 0 : T.round }
}
