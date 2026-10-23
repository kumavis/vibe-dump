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
            : /^(volley|blast\.|spell\.)/.test(e.t) ? 0.5 : 0,
  // (V1) a batch's walks start this far apart
  stagger: 0.15,
})

// ── (V1) The batch rule (DESIGN §4.2.7) ────────────────────────────────────
// A batch is a run of `unit.move` events from one seat, separated only by
// instant events: a focus, a pause of 0.2 s or less, objectives, status,
// act, log, a tray opened, an advance's dice, the match waiting on a seat
// (`pending`: a batch runs across a human's entries, a group order's
// members) and, under ?debug, a checkpoint (app/boot.js puts one after each
// action and stop, for P-present and snap-check). Its walks start
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
const INSTANT = new Set(['focus', 'objectives', 'status', 'act', 'log', 'tray.open', 'check', 'pending'])
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

export function batchesOf(events, sideOf) {
  const out = []
  for (let k = 0; k < events.length; ) {
    const b = batchAt(events, k, sideOf) ?? { from: k, to: k + 1 }
    out.push(b)
    k = b.to
  }
  return out
}

export function playTime(events, sideOf, batched = true) {
  if (!batched) return events.reduce((s, e) => s + PACE.cost(e), 0)
  let s = 0
  for (const b of batchesOf(events, sideOf)) s += b.walks ? b.length : PACE.cost(events[b.from])
  return s
}
