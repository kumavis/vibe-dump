// Module hooks for sim/present-check.mjs's --self-test (registered by its
// child, beside the oracle's three.js resolution). With PRESENT_MUTATE set,
// one named edit is applied to the code under test as it loads: each drops
// or bends one event (one the mirror is folded from, or one of the fight's
// or the charge's own, below), and the check must fail on it. Code under sim/oracle's PIN checkout is never edited. The flags' and
// labels' events inside an action (no-dmg-*, no-morale-*, no-move-owners,
// no-move-status), the walking unit's flags (no-walk-owners) and the stage
// events (no-stage-*) are caught only at a `check`, the checkpoint
// main.js's checkpoint() emits under ?debug: the action's end re-emits the
// flags and labels before its `act`, and a stage lost would be put right by
// the next stage event before any act.
//
// The fight's and the charge's own events (core/actions/fight.js: a lunge,
// a turn to face, a pause; charge.js: a turn to face, charge.result) change
// nothing in the mirror, so their drops and moves (no-melee and on) are
// caught by the check's event order instead (present-check.mjs's
// eventOrder), each where the next event or line breaks it.
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
  // re-reports them before its act: only the played() checks see this)
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
  // a walk (a charge's move: resolveWalk) never reported: the charger
  // stays where it was in the mirror
  'no-move': ['/core/actions/move.js', "  emit(G, 'unit.move',", "  if (false) emit(G, 'unit.move',"],
  // what a charging wrecker smashed on its way never reported: the chunks
  // stand on in the mirror
  'no-move-smash': ['/core/actions/move.js', 'fly, smashes, to:', 'fly, smashes: [], to:'],
  // the flags as a walk left them never reported (its action's end
  // re-reports them before its act: only the charge's check sees this)
  'no-move-owners': ['/core/actions/move.js', "    emit(G, 'objectives',", "    if (false) emit(G, 'objectives',"],
  // the labels as a walk left them (the charger now in combat) never
  // reported (likewise re-reported at the action's end)
  'no-move-status': ['/core/actions/move.js', "    emit(G, 'status',", "    if (false) emit(G, 'status',"],
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
  // a unit's place, as the old walk moves it, never reported
  'no-place': ['/main.js', "  emit(G, 'unit.place', { u: u.id, x, z })", '  // (dropped)'],
  // the flags a walking unit turns never reported (its action's end
  // re-reports them before its act: only the walk's check sees this)
  'no-walk-owners': ['/main.js', "    if (owners.some((c, i) => c !== player.mirror.owners[i])) emit(G, 'objectives', { owners })", '    // (dropped)'],
  // a deployment's stage never reported: the HUD reads "Round 1 / 5" and
  // the labels stay hidden while a human deploys
  'no-stage-deploy': ['/main.js', "    emit(G, 'stage', { stage: 'deploy' })", '    // (dropped)'],
  // the battle's start never reported: the stage shown stays the title's or
  // the deployment's (the labels hidden through the roll-off in a watched
  // battle)
  'no-stage-battle': ['/main.js', "  emit(G, 'stage', { stage: 'battle' })", '  // (dropped)'],
  // a phase's start never reported: the round, the seat and the phase shown
  // stay where they were
  'no-phase-start': ['/main.js', "    emit(G, 'phase.start',", "    if (false) emit(G, 'phase.start',"],
  // a round's score never reported: the VP shown stay where they were
  'no-score': ['/main.js', "  emit(G, 'round.scored',", "  if (false) emit(G, 'round.scored',"],
  // a chunk destroyed never reported: it stands on in the mirror
  'no-destroy': ['/core/terrain/terrain.js', "    emitTo(out, 'terrain.destroy',", "    if (false) emitTo(out, 'terrain.destroy',"],
  // blocks that fall into a gap never reported: they hang where they were
  'no-collapse': ['/core/terrain/terrain.js', "if (drops.length) emitTo(out, 'terrain.collapse',", "if (false) emitTo(out, 'terrain.collapse',"],
}

export async function load(url, ctx, next) {
  const r = await next(url, ctx)
  const m = process.env.PRESENT_MUTATE && MUTATIONS[process.env.PRESENT_MUTATE]
  if (!m || r.format !== 'module' || r.source == null || !url.endsWith(m[0]) || url.includes('tails-and-scales-oracle')) return r
  const src = String(r.source)
  if (!src.includes(m[1])) throw new Error(`present-hooks: mutation ${process.env.PRESENT_MUTATE} found nothing to edit in ${url}`)
  return { ...r, source: src.replace(m[1], m[2]), shortCircuit: true }
}
