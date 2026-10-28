// How long the view takes over each event it plays (DESIGN §2.4): every
// fixed duration in one table, in game seconds (the speed button and ?fast
// scale them all through the clock). Animations keep their own tween
// lengths (a fall, a flight from the table); these are the beats the game
// waits on before it plays the next event.
//
// unit.wound and unit.slain take no time of their own: the 0.06 s after
// each wound allocated is a `pause` the rules emit where the old code waited
// (§4.1 rule 3), so a unit's last model falls and its "destroyed" text
// shows in the same moment, as before.
export const PACE = Object.freeze({
  // the turn banner: longer when the seat is played here, or outside battle
  phaseStart: (local, stage) => (local || stage !== 'battle' ? 0.9 : 0.6),
  // a row of dice in the tray
  dice: (n) => 0.38 + Math.min(n, 14) * 0.035,
  // a pure wait, as long as the rules asked
  pause: (s) => s,
  // an event the view has no handler for: its text, then this long
  beat: 0.3,
  // (N2) about how long an event takes to play, for the table's backlog
  // (the elastic catch-up, app/flow.js): an estimate, never waited on. A
  // walk its path at its pace, a pause its length, a dice row its row, a
  // banner its beat, a shot or a spell about half a second.
  cost: (e) =>
    e.t === 'unit.move' ? (e.L ?? 0) / (e.speed || 6) + 0.3
      : e.t === 'pause' ? e.s ?? 0
        : e.t === 'dice' ? PACE.dice(e.dice?.length ?? 1)
          : e.t === 'phase.start' || e.t === 'round.scored' ? 0.9
            : /^(volley|blast\.|spell\.|keg\.)/.test(e.t) ? 0.5 : 0,
  // (V1) a batch's walks start this far apart
  stagger: 0.15,
  // (F8b) an attack batch's attacks start at least this far apart, and a
  // volley in one is waited on this long before its wounds play (its
  // projectiles fly on); a phase with nothing in it, its banner this long
  brisk: 0.3,
  lead: 0.35,
  brief: 0.25,
})

// ── (V1) The batch rule (DESIGN §4.2.7) ────────────────────────────────────
// A batch is a run of `unit.move` events from one seat, separated only by
// instant events: a focus, a pause of 0.2 s or less, objectives, status,
// act, log, a tray opened, an advance's dice, the match waiting on a seat
// (`pending`: a batch runs across a human's entries, a group order's
// members), under ?debug, a checkpoint (app/boot.js puts one after each
// action and stop, for P-present and snap-check) and (F16) under the
// courtesy fog the `fog` events round each entry (app/flow.js's: what the
// table shows of the other army as the entry opens and closes, which no
// batch may wait on or break at, as a group order's members run across
// entries). Its walks start
// PACE.stagger apart, after one tray row of all its advance dice, and it is
// over when its last walk to finish is; the mirror still folds every event
// in order, so P-present's checkpoints are unchanged (the player plays one
// dice row and one focus for a batch, skips its short pauses, and holds the
// flags until each walk arrives).
// What breaks a batch: any other event (a charge's dice, a shot, a wound, a
// phase begun) or another seat's walk. A wrecker's walk that smashes
// scenery (`smashes`) holds back the walks after it until its last smash
// has played (smashDone: its walk's own timing, view/units.js's), so
// nothing walks through a wall before it falls; one that smashes nothing
// walks like any other. A run with fewer than two walks is no batch.
//
//   batchAt(events, k, sideOf) → null, or { from: k, to, walks: [indices],
//       dice: [the advance dice, in order], starts: [each walk's start, in
//       seconds after the batch's dice row], length (seconds) }
//   batchesOf(events, sideOf) → the stream cut into steps, each a batch or
//       { from, to: from + 1 } (one event, played as ever)
//   playTime(events, sideOf, batched) → about how long the stream plays
//       (PACE.cost's estimate; a batch counted once, until its last walk
//       ends)
// `sideOf(unitId)`: the seat a unit belongs to.
const INSTANT = new Set(['focus', 'objectives', 'status', 'act', 'log', 'tray.open', 'check', 'pending', 'fog'])
const isAdvanceDice = (e) => e.t === 'dice' && /^Advance/.test(e.label ?? '')
const quiet = (e) => INSTANT.has(e.t) || (e.t === 'pause' && (e.s ?? 0) <= 0.2) || isAdvanceDice(e)

// (a walk's own timing, view/units.js's walk: its disc goes `L` inches in
// L / speed + 0.15 s eased in and out, covering L + 0.15·speed, and a smash
// at `s` inches along plays when it gets there)
const unease = (y) => (y < 0.5 ? Math.cbrt(y / 4) : 1 - Math.cbrt(2 * (1 - y)) / 2)
export function smashDone(e) {
  if (!e.smashes?.length) return 0
  const speed = e.speed || 6, L = e.L ?? 0, T = L / speed + 0.15
  const s = Math.max(...e.smashes.map((x) => x.s ?? L))
  return T * unease(Math.min(1, s / (L + 0.15 * speed)))
}

export function batchAt(events, k, sideOf) {
  let side = null, end = k
  const walks = []
  for (let j = k; j < events.length; j++) {
    const e = events[j]
    if (e.t === 'unit.move') {
      if (side !== null && sideOf(e.u) !== side) break
      side = sideOf(e.u)
      walks.push(j)
      end = j + 1
      continue
    }
    if (!quiet(e)) break
    // (the quiet events after the last walk are its own, up to where the
    // next unit's action starts: its focus, its tray, its dice)
    if (walks.length && end === j && !(e.t === 'focus' || e.t === 'tray.open' || isAdvanceDice(e))) end = j + 1
  }
  if (walks.length < 2) return null
  const dice = []
  for (let j = k; j < end; j++) if (isAdvanceDice(events[j])) dice.push(...events[j].dice)
  // each walk PACE.stagger after the last, and none before the last smash of
  // a wreck before it
  const starts = []
  let gate = 0
  walks.forEach((j, n) => {
    const t = n ? Math.max(starts[n - 1] + PACE.stagger, gate) : 0
    starts.push(t)
    gate = Math.max(gate, t + smashDone(events[j]))
  })
  const length = (dice.length ? PACE.dice(dice.length) : 0) + Math.max(...walks.map((j, n) => starts[n] + PACE.cost(events[j])))
  return { from: k, to: end, walks, dice, starts, length }
}

// ── (F8b) Attack batches (DESIGN §4.2.7; V1's open budget) ────────────────
// V1 left a Grand battle playing about 350 s against its 200 s, the
// shooting about half of it: each shot played its tray, its hit, wound and
// save rows and its pauses one after another, 2-3 s a shot, 60-70 shots a
// battle. An attack is one unit's shot or blow: its opening (the focus on
// it, its turn to face the target), its tray, its volley (a blast's throw,
// a spell, a melee strike: the attack's anchors) and what follows from it,
// its dice, wounds, falls, the scenery it wrecks, its log line, up to the
// next unit's opening. An attack batch is a run of two or more attacks by
// one seat (a seat's shooting phase, its units' turn at a fight) with
// nothing else between. It plays in one tray ("Shooting · 6 units"), each
// attack one row (its first dice: the hits, a template's, a cast), the
// attacks PACE.brisk apart, or once the last one's scatter, throw or spell
// has played (blasts share the table's one template marker), each volley
// waited on PACE.lead before its wounds play; the rows, the pauses and the
// rest of the volleys' flights not waited on, but the last row and the
// last flights at the batch's end. The mirror still folds every event in
// order (P-present's checkpoints unchanged).
// What breaks one: anything else (a walk, a charge's dice or its shout, a
// flight from morale, a phase begun), another seat's attack, a tray with no
// attack in it (a morale test's, a charge's). A run of fewer than two
// attacks is no batch.
//
//   attacksAt(events, k, sideOf) → null, or { from: k, to, attacks: [{
//       from, to, tray, title (the tray's, to its " · "), row (its first
//       dice event, or null), hold (what the batch waits on in it, in
//       seconds), melee (strikes only) }], starts: [each attack's start, in
//       seconds], length (seconds), melee }
//   briefAt(events, k) → whether the phase begun at k has nothing in it
//
// (A batch of walks and one of attacks can't start on the same event: one
// starts on a walk, the other has a tray before any; batchesOf tries walks
// first.)
const ANCHOR = new Set(['volley', 'blast.fire', 'spell.cast', 'spell.fizzle', 'melee'])
const OPENING = new Set(['focus', 'unit.face'])
// ((F19a) a powder keg the attack set off goes off inside it: its fuse, its
// blast's landing and victims, its scenery)
// ((V3c) a caster's snare and its spell on a friend sit in one too)
const IN_ATTACK = new Set([...ANCHOR, 'blast.aim', 'blast.scatter', 'blast.land', 'keg.fuse', 'spell.thorns', 'spell.fade', 'spell.gaze', 'spell.mesmerized', 'spell.snare', 'spell.ward', 'unit.wound', 'unit.slain', 'unit.formation', 'unit.destroyed', 'terrain.add', 'terrain.hurt', 'terrain.destroy', 'terrain.collapse', 'terrain.rubble', 'objectives', 'status', 'act', 'log', 'check', 'pending', 'fog'])
const inRun = (e) => OPENING.has(e.t) || e.t === 'tray.open' || IN_ATTACK.has(e.t) || (e.t === 'pause' && (e.s ?? 0) <= 0.3) || (e.t === 'dice' && !/^(Advance|Charge)/.test(e.label ?? ''))
// what an attack in a batch waits on before the next may start: a volley
// PACE.lead, a scatter, a throw and the slower spells their half second
// (PACE.cost's), the rest nothing (their handlers draw at once); (V3c) a
// snare's roots and a spell settling on a friend among the rest: each
// plays in about the attacks' own spacing (PACE.brisk), so it holds
// nothing back (a Grand battle as watched stays within its budget)
const HOLD = new Set(['blast.scatter', 'blast.fire', 'keg.fuse', 'spell.thorns', 'spell.gaze'])
export const holdOf = (e) => (e.t === 'volley' ? PACE.lead : HOLD.has(e.t) ? PACE.cost(e) : 0)

export function attacksAt(events, k, sideOf) {
  // the run of events an attack batch could hold
  let stop = k
  while (stop < events.length && inRun(events[stop])) stop++
  const trays = []
  for (let j = k; j < stop; j++) if (events[j].t === 'tray.open') trays.push(j)
  if (trays.length < 2) return null
  // (before the first tray, nothing but an opening and instant events: a
  // batch starts on an attack, never in the middle of one)
  for (let j = k; j < trays[0]; j++) if (!(OPENING.has(events[j].t) || events[j].t === 'pause' || INSTANT.has(events[j].t))) return null
  // an attack starts at the opening just before its tray (the first at k);
  // the last ends where the run does, less the next unit's opening
  const open = (n) => {
    if (!n) return k
    let j = trays[n]
    while (j > trays[n - 1] + 1 && OPENING.has(events[j - 1].t)) j--
    return j
  }
  let end = stop
  while (end > trays.at(-1) + 1 && OPENING.has(events[end - 1].t)) end--
  const attacks = []
  let side = null
  for (let n = 0; n < trays.length; n++) {
    const from = open(n), to = n + 1 < trays.length ? open(n + 1) : end
    // its anchors: one or more, every one a unit of the batch's seat
    let anchors = 0, ok = true, melee = true, hold = 0, row = null
    for (let j = trays[n] + 1; j < to; j++) {
      const e = events[j]
      if (ANCHOR.has(e.t)) {
        const s = sideOf(e.u)
        if (side !== null && s !== side) ok = false
        side ??= s
        anchors++
        if (e.t !== 'melee') melee = false
      }
      if (e.t === 'dice' && !row) row = e
      hold += holdOf(e)
    }
    if (!ok || !anchors) break
    attacks.push({ from, to, tray: trays[n], title: String(events[trays[n]].title ?? '').split(' · ')[0], row, hold, melee })
  }
  if (attacks.length < 2) return null
  const starts = []
  attacks.forEach((a, n) => starts.push(n ? starts[n - 1] + Math.max(PACE.brisk, attacks[n - 1].hold) : 0))
  // (the last attack: what it waits on and its volleys' flights to their
  // end, or its row's dice, whichever is longer)
  const last = attacks.at(-1)
  let tail = last.hold
  for (let j = last.from; j < last.to; j++) if (events[j].t === 'volley') tail += PACE.cost(events[j]) - PACE.lead
  const length = starts.at(-1) + Math.max(tail, last.row ? PACE.dice(last.row.dice?.length ?? 1) : 0)
  return { from: k, to: last.to, attacks, starts, length, melee: attacks.every((a) => a.melee) }
}

// A seat's phase in which nothing happens (a charge phase with no charge in
// reach, a fight phase with no fight, a morale phase with no losses: half a
// Grand battle's phases) shows its banner only PACE.brief, once the queue
// holds it to its end: nothing but instant events and pauses before the
// next phase, round's score, stage or the end. (A phase still waiting on a
// seat played here, its end not yet queued, shows its banner as ever.)
const ENDS = new Set(['phase.start', 'round.scored', 'stage', 'game.over'])
export function briefAt(events, k) {
  if (events[k]?.t !== 'phase.start') return false
  for (let j = k + 1; j < events.length; j++) {
    const e = events[j]
    if (ENDS.has(e.t)) return true
    if (e.t === 'pending' || !(INSTANT.has(e.t) || e.t === 'pause')) return false
  }
  return false
}

export function batchesOf(events, sideOf) {
  const out = []
  for (let k = 0; k < events.length; ) {
    const b = batchAt(events, k, sideOf) ?? attacksAt(events, k, sideOf) ?? { from: k, to: k + 1 }
    out.push(b)
    k = b.to
  }
  return out
}

// (F8b) `watched`: the banners as a battle watched here plays them
// (PACE.phaseStart's for a seat not played here, batched PACE.brief for a
// phase with nothing in it), not PACE.cost's 0.9 s for every one, which
// the online backlog's estimate keeps
export function playTime(events, sideOf, batched = true, { watched = false } = {}) {
  const cost = (e, k) => (!watched || (e.t !== 'phase.start' && e.t !== 'round.scored') ? PACE.cost(e) : batched && briefAt(events, k) ? PACE.brief : PACE.phaseStart(false, 'battle'))
  if (!batched) return events.reduce((s, e, k) => s + cost(e, k), 0)
  let s = 0
  for (const b of batchesOf(events, sideOf)) s += b.walks || b.attacks ? b.length : cost(events[b.from], b.from)
  return s
}
