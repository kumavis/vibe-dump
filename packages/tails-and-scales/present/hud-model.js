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
//                                 deployment); (F10c) end.badge, how many
//                                 units the orders will act for at End (its
//                                 label "End Movement ▸ · ⟳ 9"), and
//                                 end.ready counts the manual units only
//                                 (an order covering the phase handles its
//                                 unit); end.counting, Auto-End's countdown
//                                 drawn on it
//     go                          (F10c) ▶ Go: { show, n, busy }, the orders
//                                 now, the phase left open
//     ordersN                     (F10c) how many of the seat's units hold an
//                                 order (the actions' Orders N; 0 hides it)
//     undo                        (F12) ↶ Undo: { show, busy }, up beside End
//                                 in a game played on this device alone,
//                                 enabled once the table has caught up and
//                                 the seat has an entry to take back
//                                 (undoable, below)
//     aim                         (F13) touch aim: { on (👆 Aim), select (▭
//                                 Select), aiming (a finger's aim under way:
//                                 'on', 'off' once called off, or null) }
//     spells                      (V3c) the spell bar: a caster picked up
//                                 alone in its seat's shooting phase, the
//                                 table caught up: { u, list: [{ sp, key,
//                                 name, cast (2D6 ≥ it), pct, range, ally,
//                                 what (its one line), on (picked), can
//                                 (anything to cast it on now) }] }; null
//                                 hides it
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
//            being picked), hover, group (how many units are picked up
//            together: F10a), orders ((F10c) the standing orders' plan on a
//            phase of a seat played here: { actors, covered }, the ids of the
//            units whose orders act in it now and of those an order covers
//            in it; null for none), ordered (how many of the seat's units
//            hold an order), aim ((F13) input/aim.js's state(): the toggles
//            and the drag; null for none), spell ((V3c) the spell picked for
//            the caster picked up, by index; undefined for none) }
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
import { PHASES, p2D6 } from '../core/rules.js'
import { inCover } from '../core/queries.js'

const NOBODY = new Set()
// a phase's name by its key ('move' → 'Movement')
export const PHASE_NAME = Object.fromEntries(PHASES.map((p) => [p.key, p.name]))
// the phase a turn begins with
const [FIRST] = PHASES.map((p) => p.key)

// the HUD's state as a snap leaves it (M: the snap's mirror)
export const afterSnap = (M) => ({ phaseShown: M.stage === 'battle', buttonsUp: false })

export function hudModel({ G, mirror: M, session, input, hud }) {
  const { idle, decision: P, deploy, sel, pick: pk, group = 0, orders: plan = null, ordered = 0, counting = false, aim = null, spell } = input
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
  // (F10c) the units the standing orders act for now, and those an order
  // covers in this phase (whose turn is the orders', not the player's)
  const badge = mine && idle ? plan?.actors.length ?? 0 : 0
  const covered = plan?.covered ?? NOBODY
  const end = {
    show: deploying || up,
    label: deploying ? 'Begin battle ▸' : mine ? `End ${PHASE_NAME[P.phase]} ▸${badge ? ` · ⟳ ${badge}` : ''}` : null,
    busy: !idle,
    // nothing left to do in the seat's phase but what its orders will do
    // (asked only once the table has caught up)
    ready: mine && idle ? !ask((G, q) => G.units.some((u) => u.side === P.seats[0] && !covered.has(u.id) && q.canAct(G, u))) : false,
    badge,
    // (F10c) Auto-End counting down on it
    counting: mine && counting,
  }
  // (F3) End lit when there is nothing else to do: the phase's units all
  // spent, or the deployment, where Begin battle is the only way on
  end.lit = deploying || end.ready
  // (F12) Undo up with End in a game played here alone (never online, nor
  // for a replay's Session, which holds no seat's decision), enabled while
  // the table rests and there is an entry of the seat to take back
  const undoUp = end.show && playedHere(session)
  const undo = { show: undoUp, busy: !idle || !undoUp || undoable(session) < 0 }
  const advance = {
    // ((F10a) none for a group: its +D6 is the bar's)
    show: !mine ? false : idle ? P.phase === 'move' && !!sel && group < 2 && !sel.flags.moved && !sel.flags.advanced && !ask((G, q) => q.isEngaged(G, sel)) : null,
    label: !sel ? null : sel.t.chargeAfterAdvance ? 'Advance (+D6") — can still charge' : `Advance (+D6") — no ${sel.t.ranged?.assault ? 'charge' : 'shooting or charge'} after`,
    busy: !idle,
  }
  // hint line (a picked-up unit's kept as it was while the table plays its
  // action: the match has moved on already)
  let hint = hud.hint
  // ((F13) a finger aiming: what its lift will do, and how to call it off)
  if (aim?.aiming === 'off') hint = 'Off the board: the aim is called off. Lift your finger.'
  else if (aim?.aiming) hint = `Aiming — lift your finger ${aimVerb(pk, deploying, group, P)}; a second finger calls it off.`
  else if (pk) hint = `Charge! Rolled ${pk.rolled}" — click the orange area to place ${pk.u.t.short}, or take the shortest move.`
  else if (deploying && group >= 2) hint = `Deployment — click inside your shaded zone to pin the ${group} units' formation there; Enter or its flag places them.`
  else if (deploying) hint = `Deployment — click one of your units, then click inside your shaded zone to move it there.`
  else if (g && phaseShown && M.stage === 'battle' && g.seats[M.active].ctrl !== 'human') hint = `${sides[M.active].name}${sides[M.active].mirror ? ', the AI,' : ' (AI)'} are taking their turn…`
  // (N2) a human seat played on another device: its player's turn, or the
  // deployment it has still to finish (never in a game played alone, where
  // every human seat is played here)
  else if (g && phaseShown && M.stage === 'battle' && !session.localSeats.includes(M.active)) hint = `${sides[M.active].name} are taking their turn…`
  else if (g && M.stage === 'deploy' && g.pending?.k === 'deploy' && session.localSeats.length && !deploying) hint = 'Waiting for the other side to finish deploying…'
  else if (mine && idle && group >= 2) {
    // (F10a) a group's click
    hint = {
      move: `${group} units: click the ground to pin their formation (Enter or its flag sends it), or an enemy to approach it.`,
      shoot: `${group} units: click an enemy — every one of them that can fires at it.`,
      charge: `${group} units: click an enemy — every one of them that can charges it.`,
    }[P.phase] || ''
  } else if (mine && (idle || !sel)) {
    // ((V3c) a caster: the spell picked, and how to pick another)
    const w = sel?.t.spells && spell !== undefined ? sel.t.spells[spell] : null
    const casting = !w ? null : w.ward || w.resolve
      ? `${w.name} — click a friend within ${w.range}" (or ${sel.t.short} itself) to cast it on. 1–${sel.t.spells.length} picks another spell.`
      : `${w.name} — click an enemy to cast it. Hover for the odds; 1–${sel.t.spells.length} picks another spell.`
    hint = {
      move: sel ? (ask((G, q) => q.isEngaged(G, sel)) ? 'Engaged — click inside the red area to fall back (no shooting or charging after).' : 'Click inside the shaded area to move. Difficult ground costs double.') : 'Movement — pick a unit with a white ring to move it.',
      shoot: casting ?? (sel ? 'Click an enemy unit to shoot it. Hover for odds.' : 'Shooting — pick a unit with a white ring to fire.'),
      charge: sel ? 'Click an enemy within 12" to declare a charge, then roll 2D6.' : 'Charge — pick a unit to charge with.',
    }[P.phase] || ''
  } else if (!mine) hint = ''
  return {
    vp: [M.vp[0], M.vp[1]],
    // (F4) a round past the setup's: overtime, a round at a time
    round: M.stage === 'deploy' ? 'Deployment' : M.round > rounds ? `Round ${M.round} · overtime` : `Round ${M.round} / ${rounds}`,
    phase: M.stage === 'battle' ? M.phase : null,
    active: M.stage === 'battle' ? M.active : -1,
    end,
    auto: { show: up, busy: !idle },
    go: { show: up && idle && badge > 0, n: badge, busy: !idle },
    ordersN: mine || deploying ? ordered : 0,
    undo,
    advance,
    shortest: { show: !!pk },
    aim: { on: !!aim?.on, select: !!aim?.select, aiming: aim?.aiming ?? null },
    // ((V3c) the spell bar, once the table has caught up with the caster's
    // phase)
    spells: mine && idle && P.phase === 'shoot' && sel?.t.spells && group < 2 ? spellBar(sel, spell, ask) : null,
    // the deploying seat's zone is lit; in battle both dim
    zones: [0, 1].map((s) => (M.stage === 'battle' || M.stage === 'over' ? 0.05 : s === deploy ? 0.2 : 0.07)),
    hint,
    rings: ringLooks({ session, input, covered: mine && idle ? covered : NOBODY }),
    buttonsUp,
  }
}

// ── (V3c) The spell bar ─────────────────────────────────────────────────────
// What a caster picked up may cast: each of its spells with its key (1-9),
// its name, its cast value and chance on 2D6, its range, whether it is cast
// on a friend, its one line, whether it is the one picked, and whether it
// has anything to cast on now (asked of the match, with the dice locked).
const SPELL_LINE = (w) => w.mesmerize ? 'D3 mortal wounds; it can\'t shoot or charge next turn'
  : w.snare ? 'it can\'t move or charge next turn'
    : w.ward ? 'a friend saves at +1 until your next turn'
      : w.resolve ? 'a friend takes no morale test and rolls a failed charge again until your next turn'
        : `a ${w.blast}" template under the enemy, S${w.S} AP${w.AP ? `-${w.AP}` : '0'}${w.poison ? `, poison ${w.poison}+` : ''}${w.scenery === 0 ? ', spares the scenery' : ''}`
export function spellBar(u, picked, ask) {
  const can = ask((G, q) => u.t.spells.map((w, sp) => q.shootTargets(G, u, sp).length > 0))
  return {
    u: u.id,
    list: u.t.spells.map((w, sp) => ({
      sp, key: String(sp + 1), name: w.name, cast: w.spell, pct: Math.round(p2D6(w.spell) * 100), range: w.range,
      ally: !!(w.ward || w.resolve), what: SPELL_LINE(w), on: sp === picked, can: can[sp],
    })),
  }
}

// ── Undo (F12) ──────────────────────────────────────────────────────────────
// The kinds undo takes back: a placement, a move, a charge's end. None rolls
// a die; every other kind ends a phase or the deployment, rolls, runs the AI
// or answers a vote, and so commits.
export const UNDOABLE = Object.freeze(['place', 'move', 'chargeEnd'])

// A game played on this device alone (vs. the AI, hotseat): a log no other
// device writes to (a LocalStore: online play's is Automerge's), every human
// seat played here.
export function playedHere(session) {
  const G = session?.G
  return !!G && session.store.kind === 'local' && G.setup.seats.every((x, s) => x.ctrl !== 'human' || (session.localSeats.includes(s) && x.dev === session.dev))
}

// The entry undo would take back: its place k among the accepted, or -1. It
// is the last accepted, of a live match played here alone: a placement, a
// move or a charge's end of the seat played here whose decision is now
// pending (so in hotseat each seat takes back its own), with no die rolled
// across it (the dice counter the Folder keeps after each entry,
// match/fold.js). An End or Begin battle, and any entry that rolled (an
// advance, a shot, a charge, Auto, a pilot, the last Begin battle with its
// roll-off, an End that ran a fight, morale or the AI), is a commit point:
// one press takes back one entry, down to the last of them, never past it.
export function undoable(session) {
  if (!playedHere(session) || session.status !== 'live') return -1
  const f = session.folder, k = f.accepted.length - 1, seat = session.decisionFor()
  if (seat < 0 || k < 1) return -1
  const e = f.pushed[f.placed[k]]
  return UNDOABLE.includes(e.t) && e.s === seat && e.d === session.dev && f.dice[k] === f.dice[k - 1] ? k : -1
}

// (F13) What a finger's aim does where it lifts: the click's verb there.
function aimVerb(pk, deploying, group, P) {
  if (pk) return 'on the orange area to end the charge there'
  if (deploying) return group >= 2 ? 'to pin the formation there' : 'to place the unit there'
  const many = group >= 2
  return {
    move: many ? 'to pin the formation there, or on an enemy to approach it' : 'to move there (beyond its reach, as far as it goes that way)',
    shoot: many ? 'on an enemy: every one of them that can fires at it' : 'on an enemy to shoot it',
    charge: many ? 'on an enemy: every one of them that can charges it' : 'on an enemy to charge it',
  }[P?.phase] ?? 'to act there'
}

// Each unit's ring: the one picked up, the deploying seat's, a charge's
// target, and on a seat's own turn who can act and what the picked-up unit
// can shoot or charge (asked of the match, so only once the table has
// caught up); the one under the pointer. (view) → [colour, opacity], by the
// unit's view (the ?debug snap check paints a fresh table's rings with it
// too).
// ((F10c) a unit whose standing order covers the phase: cyan, not white,
// while it can still act)
// ((V3c) a caster's spell picked (input.spell): what it may be cast on, an
// enemy red, a friend green, before whether it can act)
export function ringLooks({ session, input, covered = NOBODY }) {
  const { mode, deploy: dep, pick: pk, sel, hover, spell: sp } = input
  // (unit id → [colour, opacity]) for what the match says, on a seat's turn
  const lit = mode !== 'phase' ? new Map() : session.preview((G, q) => {
    const ph = q.phaseKey(G), out = new Map()
    const ally = !!sel && ph === 'shoot' && sp !== undefined && q.allySpell(q.weaponOf(sel, sp))
    for (const u of G.units) {
      if (!q.alive(u) || u === sel) continue
      if (ally && u.side === sel.side && q.canShoot(G, sel) && q.shotInfo(G, sel, u, sp).ok) out.set(u.id, ['#7dff9a', 0.95])
      else if (q.canAct(G, u)) out.set(u.id, covered.has(u.id) ? ['#5fd3ff', 0.85] : ['#ffffff', 0.75])
      else if (sel && ph === 'shoot' && u.side !== sel.side && q.shotInfo(G, sel, u, sp).ok) out.set(u.id, ['#ff5a4a', 0.95])
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

// (V3c) What each spell's mark on a unit does, as the label's glyph says it
// on hover (view/units.js) and the help tells it.
export const MARKS = Object.freeze({
  snared: "Snared (Root Snare): it can't move, advance, fall back or charge until the end of its next turn",
  warded: "Barkskin: +1 to its saves until its side's next turn",
  resolute: "Cold Blood: no morale tests, and a failed charge rolled again, until its side's next turn",
})

// The card's status line for a unit: `mu` the unit as shown (the mirror's:
// what stands, what wounds are left, mesmerized, in combat) and `f` its
// facts (factOf: the match's own while the table has caught up with it,
// else the record of the last action the table has played).
// ((V3c) and the spells' marks, each by its glyph and name)
export function cardStatus(t, mu, f) {
  const status = []
  if (f.moved) status.push(f.fellBack ? 'fell back' : f.advanced ? `advanced +${f.advRoll}"` : 'moved')
  if (f.shot) status.push('shot')
  if (f.charged) status.push('charged')
  if (mu.mesmerized) status.push('🌀 mesmerized')
  if (mu.snared) status.push('🌿 snared')
  if (mu.warded) status.push('🪵 barkskin')
  if (mu.resolute) status.push('❄️ cold blood')
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
