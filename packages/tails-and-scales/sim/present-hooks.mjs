// Module hooks for sim/present-check.mjs's --self-test (registered by its
// child, beside the oracle's three.js resolution). With PRESENT_MUTATE set,
// one named edit is applied to the code under test as it loads: each drops
// or bends one event (one the mirror is folded from, or one of an action's
// own, below), and the check must fail on it. Code under sim/oracle's PIN
// checkout is never edited. The flags' and labels' events inside an action
// (no-dmg-*, no-morale-*, no-move-owners, no-move-status, and the mirror's
// side of no-gaze-status) and the stage events (no-stage-*) are caught only
// at a `check`, the checkpoints the ?debug block (app/boot.js's since R7b,
// main.js's before) puts in the events
// (where an `act` or `phase` line was written, and as the match stops after
// each entry): the action's end re-emits the flags and labels before its
// `act`, and a stage lost would be put right by the next stage event before
// any act.
//
// The actions' own events that change nothing in the mirror, and the look
// fields of those that do (the move's, move.js: a walk's stomp, flight and
// pace, the advance roll; the fight's, core/actions/fight.js: a lunge, a
// turn to face, a pause; the charge's, charge.js: a turn to face,
// charge.result; the shot's, shoot.js: a turn to face, a volley, a
// template's aim, scatter, throw and landing, the beat after one that
// caught nobody, a spell cast or fizzling, thorns erupting and fading, a
// gaze, the "Mesmerized!", and the shot's look and who throws), and the
// roll-off's rows, are caught by the check's event order instead
// (present-check.mjs's eventOrder), each where the next event or line
// breaks it: no-stomp through walk-speed, no-melee through land-fx, and
// no-rolloff-row. The rest (no-formation through no-move-status, no-place
// and on) are caught by the mirror. And three edits of the page, not of an
// event, caught by the check's card test at a checkpoint: card-reads-match,
// the unit card telling of what the match did ahead of the table; and
// (R7b) card-facts-stale, card-stop-stale and card-turn-kept, the card's
// record of what each unit did this turn and its cover never updated at an
// action's end, or at a stop (a deployment's placements kept out of it, the
// battle beginning on the record of the title's table), or not cleared as a
// seat's turn begins.
//
// Not here, because nothing the check can see depends on it: the `status`
// at the fight phase's end, which repeats the last damage's (each fight
// ends in one), so dropping it leaves every check passing (probed at R5b).

// [file suffix, text, replacement]
export const MUTATIONS = {
  // the survivors' new formation never reported: their slots and disc stay
  // as they were before the losses
  'no-formation': ['/core/actions/damage.js', "  emit(G, 'unit.formation',", "  if (false) emit(G, 'unit.formation',"],
  // a wound that leaves the model standing never reported
  'no-wound': ['/core/actions/damage.js', "} else emit(G, 'unit.wound',", "} else if (false) emit(G, 'unit.wound',"],
  // a model that falls never reported: it stands on in the mirror
  'no-slain': ['/core/actions/damage.js', "  emit(G, 'unit.slain',", "  if (false) emit(G, 'unit.slain',"],
  // the flags after a damage that slew never reported (each action's end
  // re-reports them before its act: only the checks the ?debug block puts
  // in see this)
  'no-dmg-owners': ['/core/actions/damage.js', "    if (G.out) emit(G, 'objectives',", "    if (false) emit(G, 'objectives',"],
  // the labels' state (in combat, mesmerized) at a damage's end never
  // reported (likewise re-reported at the action's end)
  'no-dmg-status': ['/core/actions/damage.js', "  if (G.out) emit(G, 'status',", "  if (false) emit(G, 'status',"],
  // a fleeing model never reported: it stands on in the mirror
  'no-flee': ['/core/actions/morale.js', "  emit(G, 'unit.flee',", "  if (false) emit(G, 'unit.flee',"],
  // the flags after a flight never reported
  'no-morale-owners': ['/core/actions/morale.js', "        emit(G, 'objectives',", "        if (false) emit(G, 'objectives',"],
  // the labels' state after a flight never reported
  'no-morale-status': ['/core/actions/morale.js', "        emit(G, 'status',", "        if (false) emit(G, 'status',"],
  // a walk (resolveWalk: a move, an advance's move, a fall back, a
  // charge's move) never reported: the walker stays where it was in the
  // mirror
  'no-move': ['/core/actions/move.js', "  emit(G, 'unit.move',", "  if (false) emit(G, 'unit.move',"],
  // what a wrecker smashed on its way never reported: the chunks stand on
  // in the mirror
  'no-move-smash': ['/core/actions/move.js', 'stomp, smashes, to:', 'stomp, smashes: [], to:'],
  // the flags as a walk left them never reported (its action's end
  // re-reports them before its act: only the move's or the charge's check
  // sees this)
  'no-move-owners': ['/core/actions/move.js', "    emit(G, 'objectives',", "    if (false) emit(G, 'objectives',"],
  // the labels as a walk left them (a charger now in combat, a unit fallen
  // back out of one) never reported (likewise re-reported at the action's
  // end)
  'no-move-status': ['/core/actions/move.js', "    emit(G, 'status',", "    if (false) emit(G, 'status',"],
  // a wrecker never stomps off on its move
  'no-stomp': ['/core/actions/move.js', "stomp: u.t.wrecker && L > 0.1 })", 'stomp: false })'],
  // an advance's roll never shown: the line comes with no dice before it
  'no-advance-roll': ['/core/actions/move.js', "  emit(G, 'dice', { label: 'Advance D6',", "  if (false) emit(G, 'dice', { label: 'Advance D6',"],
  // a flier's move walks along the ground: no lift
  'walk-no-fly': ['/core/actions/move.js', "resolveWalk(G, u, pts, { fly: plan.mode === 'fly', stomp:", 'resolveWalk(G, u, pts, { fly: false, stomp:'],
  // a move walks at a charge's pace
  'walk-speed': ['/core/actions/move.js', '{ speed = 7, fly = false, stomp = false } = {}', '{ speed = 11, fly = false, stomp = false } = {}'],
  // a fight's lunge never reported: no fighter lunges, no sparks fly
  'no-melee': ['/core/actions/fight.js', "  emit(G, 'melee',", "  if (false) emit(G, 'melee',"],
  // the lunge after its hit row: the sparks, timed PACE.dice(n) from the
  // lunge, would fly a row late
  'melee-after-dice': ['/core/actions/fight.js', "  emit(G, 'melee', { u: u.id, tg: target.id, n, hits: h })\n  emit(G, 'dice', { label: `Hit ${need}+${mod ? ' (mesmerized)' : ''}`, dice: hits, need })", "  emit(G, 'dice', { label: `Hit ${need}+${mod ? ' (mesmerized)' : ''}`, dice: hits, need })\n  emit(G, 'melee', { u: u.id, tg: target.id, n, hits: h })"],
  // a fighter never turns to its foe
  'no-fight-face': ['/core/actions/fight.js', "  emit(G, 'unit.face',", "  if (false) emit(G, 'unit.face',"],
  // no beat after a fight
  'no-fight-pause': ['/core/actions/fight.js', "  emit(G, 'pause', { s: 0.3 })", '  // (dropped)'],
  // a charger never turns to its target
  'no-charge-face': ['/core/actions/charge.js', "  emit(G, 'unit.face',", "  if (false) emit(G, 'unit.face',"],
  // a charge that made it: no "CHARGE!" (the first charge.result in the
  // file, at its deeper indent, is the failed one's: this is the second)
  'no-charge-result': ['/core/actions/charge.js', "\n  emit(G, 'charge.result',", "\n  if (false) emit(G, 'charge.result',"],
  // a charge that fell short: no "Charge failed"
  'no-charge-failed': ['/core/actions/charge.js', "    emit(G, 'charge.result',", "    if (false) emit(G, 'charge.result',"],
  // a shooter never turns to its target
  'no-shoot-face': ['/core/actions/shoot.js', "  emit(G, 'unit.face',", "  if (false) emit(G, 'unit.face',"],
  // a volley never flies: the dice roll with nothing thrown
  'no-volley': ['/core/actions/shoot.js', "  emit(G, 'volley',", "  if (false) emit(G, 'volley',"],
  // the volley after its hit row: the shots would fly once they had hit
  'volley-after-dice': ['/core/actions/shoot.js', "  emit(G, 'volley', { u: u.id, tg: target.id, fx: w.fx, n })\n  const hits = roll(G, n)\n  const h = passes(hits, info.need)\n  emit(G, 'dice', { label: `Hit ${info.need}+`, dice: hits, need: info.need })", "  const hits = roll(G, n)\n  const h = passes(hits, info.need)\n  emit(G, 'dice', { label: `Hit ${info.need}+`, dice: hits, need: info.need })\n  emit(G, 'volley', { u: u.id, tg: target.id, fx: w.fx, n })"],
  // a template never aimed: no marker before its hit roll
  'no-blast-aim': ['/core/actions/shoot.js', "    emit(G, 'blast.aim',", "    if (false) emit(G, 'blast.aim',"],
  // a missed template never scatters: it would fly from its aim to where
  // it lands with no marker sliding there
  'no-blast-scatter': ['/core/actions/shoot.js', "      emit(G, 'blast.scatter',", "      if (false) emit(G, 'blast.scatter',"],
  // a template never thrown: it lands with nothing flying
  'no-blast-fire': ['/core/actions/shoot.js', "    emit(G, 'blast.fire',", "    if (false) emit(G, 'blast.fire',"],
  // a template never lands: no explosion, no ring
  'no-blast-land': ['/core/actions/shoot.js', "  emit(G, 'blast.land',", "  if (false) emit(G, 'blast.land',"],
  // a cast roll that made it, with no spell cast (no sound)
  'no-spell-cast': ['/core/actions/shoot.js', "    emit(G, 'spell.cast',", "    if (false) emit(G, 'spell.cast',"],
  // a cast roll that missed, with no fizzle
  'no-spell-fizzle': ['/core/actions/shoot.js', "      emit(G, 'spell.fizzle',", "      if (false) emit(G, 'spell.fizzle',"],
  // an eruption with no thorns bursting up
  'no-thorns': ['/core/actions/shoot.js', "  emit(G, 'spell.thorns',", "  if (false) emit(G, 'spell.thorns',"],
  // the thorns never sink back: they stand on the table for good
  'no-fade': ['/core/actions/shoot.js', "  emit(G, 'spell.fade',", "  if (false) emit(G, 'spell.fade',"],
  // a mesmerize with no gaze before its D3
  'no-gaze': ['/core/actions/shoot.js', "  emit(G, 'spell.gaze',", "  if (false) emit(G, 'spell.gaze',"],
  // the target's label never says it is mesmerized (its action's end
  // re-reports the labels before its act, so of the mirror only the shot's
  // check sees this; and the "Mesmerized!" then comes straight after the
  // damage's own status, which has the target as it was, not mesmerized
  // unless it already was, which the event order sees too)
  'no-gaze-status': ['/core/actions/shoot.js', "  if (G.out) emit(G, 'status', statusOf(G))\n  emit(G, 'spell.mesmerized',", "  emit(G, 'spell.mesmerized',"],
  // no "Mesmerized!" over the target
  'no-mesmerized': ['/core/actions/shoot.js', "  emit(G, 'spell.mesmerized',", "  if (false) emit(G, 'spell.mesmerized',"],
  // no beat after a template that caught nobody
  'no-blast-pause': ['/core/actions/shoot.js', "  if (!victims.length) emit(G, 'pause', { s: 0.25 })", "  if (false) emit(G, 'pause', { s: 0.25 })"],
  // a template thrown by its target: the throw comes from the wrong figure
  'blast-fire-u': ['/core/actions/shoot.js', "emit(G, 'blast.fire', { u: u.id,", "emit(G, 'blast.fire', { u: target.id,"],
  // every volley flies acorns, whatever the weapon
  'volley-fx': ['/core/actions/shoot.js', "emit(G, 'volley', { u: u.id, tg: target.id, fx: w.fx, n })", "emit(G, 'volley', { u: u.id, tg: target.id, fx: 'acorn', n })"],
  // every template lands as a bomb: fire where acid or thorns should be
  'land-fx': ['/core/actions/shoot.js', "emit(G, 'blast.land', { x: land.x, z: land.z, r: w.blast, fx: w.fx })", "emit(G, 'blast.land', { x: land.x, z: land.z, r: w.blast, fx: 'bomb' })"],
  // a deployment's placement never reported: the unit stands where the
  // title screen put it in the mirror (caught as the match stops after it)
  'no-place': ['/core/commands.js', "    emit(G, 'unit.place', { u,", "    if (false) emit(G, 'unit.place', { u,"],
  // a deployment's stage never reported: the HUD reads "Round 1 / 5" and
  // the labels stay hidden while a human deploys
  'no-stage-deploy': ['/core/index.js', "    emit(G, 'stage', { stage: 'deploy' })", '    // (dropped)'],
  // the battle's start never reported: the stage shown stays the title's or
  // the deployment's (the labels hidden through the roll-off in a watched
  // battle)
  'no-stage-battle': ['/core/engine.js', "        emit(G, 'stage', { stage: 'battle' })", '        // (dropped)'],
  // the roll-off's second row never shown: seat 1's die (the line naming
  // the winner then follows seat 0's alone)
  'no-rolloff-row': ['/core/engine.js', "    emit(G, 'dice', { label: seatName(G, 1, 'short'),", "    if (false) emit(G, 'dice', { label: seatName(G, 1, 'short'),"],
  // a phase's start never reported: the round, the seat and the phase shown
  // stay where they were
  'no-phase-start': ['/core/engine.js', "        emit(G, 'phase.start',", "        if (false) emit(G, 'phase.start',"],
  // a round's score never reported: the VP shown stay where they were
  'no-score': ['/core/engine.js', "  emit(G, 'round.scored',", "  if (false) emit(G, 'round.scored',"],
  // a chunk destroyed never reported: it stands on in the mirror
  'no-destroy': ['/core/terrain/terrain.js', "    emitTo(out, 'terrain.destroy',", "    if (false) emitTo(out, 'terrain.destroy',"],
  // blocks that fall into a gap never reported: they hang where they were
  'no-collapse': ['/core/terrain/terrain.js', "if (drops.length) emitTo(out, 'terrain.collapse',", "if (false) emitTo(out, 'terrain.collapse',"],
  // (R6b's fixer, round 2) the unit card reads the match while the table is
  // behind: it tells of moves, shots, charges and cover not yet played
  // (ui/card.js since R7b, main.js before; caught by the card check at a
  // checkpoint, not by an event)
  'card-reads-match': ['/ui/card.js', 'f = this.live() ? this.ask((G) => factOf(G, u)) : this.facts()[u.id]', 'f = this.ask((G) => factOf(G, u))'],
  // (R7b) the card's record of what each unit did this turn kept from the
  // battle's start: an action's end never updates it (app/flow.js)
  'card-facts-stale': ['/app/flow.js', '      act: (e) => {\n        if (e.facts) this.facts = e.facts', '      act: (e) => {\n        if (false) this.facts = e.facts'],
  // (R7b's fixer) the record never updated where the match stops for a
  // decision: a human's placements never reach it, so through the roll-off
  // and the first turn's walks it tells the cover the title's table had
  // (app/flow.js)
  'card-stop-stale': ['/app/flow.js', '      pending: (e) => {\n        if (e.facts) this.facts = e.facts', '      pending: (e) => {\n        if (false) this.facts = e.facts'],
  // (R7b) a turn's start leaves its seat's deeds of the turn before on the
  // card's record (app/flow.js)
  'card-turn-kept': ['/app/flow.js', '    this.facts = turnBegun(this.facts, e)', '    // (dropped)'],
  // (V3a) a turn's start leaves the other seat's losses of the turn before
  // on the record: its squads still "💔 lost N", tested already
  // (present/hud-model.js)
  'card-losses-kept': ['/present/hud-model.js', ', lost: 0 } : { ...f, lost: 0 }', ', lost: 0 } : f'],
}

export async function load(url, ctx, next) {
  const r = await next(url, ctx)
  const m = process.env.PRESENT_MUTATE && MUTATIONS[process.env.PRESENT_MUTATE]
  if (!m || r.format !== 'module' || r.source == null || !url.endsWith(m[0]) || url.includes('tails-and-scales-oracle')) return r
  const src = String(r.source)
  if (!src.includes(m[1])) throw new Error(`present-hooks: mutation ${process.env.PRESENT_MUTATE} found nothing to edit in ${url}`)
  return { ...r, source: src.replace(m[1], m[2]), shortCircuit: true }
}
