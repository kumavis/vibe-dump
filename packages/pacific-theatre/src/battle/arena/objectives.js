// The objectives (ROUND-3.md §3 "Objectives", §6's goals): each side's main
// goal and its phases, their timers and counts, the end conditions and the
// result. Goal kinds: sink | hit | survive | shoot-down | reach; a type is a
// ship type, 'ship' (any ship) or 'aircraft'. A count is the side's (any of
// its units), so a phase met by a destroyer the player was not in is met.
//
//   sink, hit, shoot-down, reach   met when the count reaches the need within
//                                  the clock (a phase: within its timer);
//                                  failed when the time runs out, or (sink) when
//                                  too few of the type are left to reach it
//   survive                        failed the moment fewer of the type are afloat
//                                  than the need; met at the clock's end
//
// The game ends at the clock (durationS), when both main goals are resolved,
// or when a side has nothing left afloat or in the air.

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
export const countWord = (n) => WORDS[n] ?? String(n)
/** A count in an "n of the m" phrase: none for nought. */
const upper = (w) => w.charAt(0).toUpperCase() + w.slice(1)
const ofWord = (n) => (n === 0 ? 'none' : countWord(n))
const NOUN = { cve: ['carrier', 'carriers'], cv: ['carrier', 'carriers'], cvl: ['carrier', 'carriers'], bb: ['battleship', 'battleships'], ca: ['heavy cruiser', 'heavy cruisers'], cl: ['light cruiser', 'light cruisers'], dd: ['destroyer', 'destroyers'], de: ['destroyer escort', 'destroyer escorts'], ship: ['ship', 'ships'], aircraft: ['aircraft', 'aircraft'] }
export const typeWord = (type, n) => (NOUN[type] || NOUN.ship)[n === 1 ? 0 : 1]
export const clockText = (t) => `${Math.floor(Math.max(0, t) / 60)}:${String(Math.floor(Math.max(0, t) % 60)).padStart(2, '0')}`

/** Whether a ship type matches a goal's type ('ship': any ship). */
export const typeMatches = (type, want) => want === 'ship' || type === want

export function createCounters() {
  return { sunk: {}, hits: {}, downed: 0, reached: new Map() }
}

/** A ship of the enemy sunk by side (the sinker), a hit on one, an aircraft shot down. */
export const countSunk = (ar, side, type) => {
  const c = ar.sides[side].count
  c.sunk[type] = (c.sunk[type] || 0) + 1
  c.sunk.ship = (c.sunk.ship || 0) + 1
}
export const countHit = (ar, side, type) => {
  const c = ar.sides[side].count
  c.hits[type] = (c.hits[type] || 0) + 1
  c.hits.ship = (c.hits.ship || 0) + 1
}
export const countDown = (ar, side) => {
  ar.sides[side].count.downed++
}

function sumOf(map, want) {
  if (want === 'ship') return map.ship || 0
  let n = 0
  for (const [t, v] of Object.entries(map)) if (t !== 'ship' && typeMatches(t, want)) n += v
  return n
}

/** A side's ships of a type: afloat now and in all. */
function shipsOf(ar, side, type) {
  let afloat = 0
  let total = 0
  for (const i of ar.sides[side].ships) {
    if (!typeMatches(ar._X[i].model.type, type)) continue
    total++
    if (ar.state.alive[i] === 1) afloat++
  }
  return { afloat, total }
}

/** The raw count a goal measures for a side (for reach: the units that have come within its range so far). */
function rawCount(ar, side, goal, key) {
  const c = ar.sides[side].count
  switch (goal.kind) {
    case 'sink':
      return sumOf(c.sunk, goal.type)
    case 'hit':
      return sumOf(c.hits, goal.type)
    case 'shoot-down':
      return c.downed
    case 'reach': {
      let set = c.reached.get(key)
      if (!set) c.reached.set(key, (set = new Set()))
      const s = ar.state
      const range = goal.rangeM ?? 3000
      const enemy = ar.sides[ar.sides[side].enemy]
      const units = goal.type === 'aircraft' ? ar.sides[side].aircraft : ar.sides[side].ships
      for (const i of units) {
        if (s.alive[i] !== 1 || set.has(i)) continue
        if (goal.type !== 'aircraft' && !typeMatches(ar._X[i].model.type, goal.type)) continue
        for (const j of enemy.ships) {
          if (s.alive[j] !== 1 || (goal.of && !typeMatches(ar._X[j].model.type, goal.of))) continue
          if (Math.hypot(s.pos[3 * i] - s.pos[3 * j], s.pos[3 * i + 2] - s.pos[3 * j + 2]) <= range) {
            set.add(i)
            break
          }
        }
      }
      return set.size
    }
    default:
      return 0
  }
}

/** A goal's state at t: { kind, type, need, count, total?, status: 'open' | 'met' | 'failed', line }. */
function goalState(ar, side, goal, { base = 0, endsAt, key, prev = null }) {
  const need = goal.count ?? 1
  const out = { kind: goal.kind, type: goal.type, need, count: 0, status: 'open', text: goal.text ?? null, endsAt, line: '' }
  if (prev && prev.status !== 'open') return prev
  if (goal.kind === 'survive') {
    const { afloat, total } = shipsOf(ar, side, goal.type)
    out.count = afloat
    out.total = total
    out.line = `${afloat} of ${total}`
    if (afloat < need) out.status = 'failed'
    else if (ar.t >= endsAt) out.status = 'met'
    return out
  }
  out.count = Math.max(0, rawCount(ar, side, goal, key) - base)
  out.line = `${Math.min(out.count, need)} of ${need}`
  if (out.count >= need) out.status = 'met'
  else if (ar.t >= endsAt) out.status = 'failed'
  else if (goal.kind === 'sink') {
    const enemy = ar.sides[side].enemy
    const { afloat } = shipsOf(ar, enemy, goal.type)
    if (out.count + afloat < need) out.status = 'failed'
  }
  return out
}

export function createObjectives(ar) {
  for (const key of ['jp', 'us']) {
    const side = ar.sides[key]
    side.count = createCounters()
    side.phases = (side.def.phases || []).slice().sort((a, b) => (a.t ?? 0) - (b.t ?? 0))
    side.phaseIndex = -1
    side.phaseState = null
    side.goalState = null
  }
}

/** The objectives at t, for both sides; the end; returns the result once (and keeps it). */
export function evaluate(ar) {
  const D = ar.durationS
  for (const key of ['jp', 'us']) {
    const side = ar.sides[key]
    side.goalState = goalState(ar, key, side.def.goal || { kind: 'survive', type: 'ship', count: 1 }, { endsAt: D, key: 'main', prev: side.goalState })
    // the phase: the last whose t has come; its timer from its own start
    let k = -1
    for (let n = 0; n < side.phases.length; n++) if ((side.phases[n].t ?? 0) <= ar.t) k = n
    if (k !== side.phaseIndex) {
      side.phaseIndex = k
      const ph = side.phases[k]
      if (ph) {
        const next = side.phases[k + 1]
        const endsAt = Math.min(D, (ph.t ?? 0) + (ph.goal?.withinS ?? ((next?.t ?? D) - (ph.t ?? 0))))
        side.phaseState = { index: k, title: ph.title ?? '', text: ph.text ?? '', goal: ph.goal ?? null, t0: ph.t ?? 0, endsAt, base: ph.goal ? rawCount(ar, key, ph.goal, `phase-${k}`) : 0, state: null }
        ar._onPhase(side, side.phaseState)
      } else side.phaseState = null
    }
    const ps = side.phaseState
    if (ps?.goal) ps.state = goalState(ar, key, ps.goal, { base: ps.base, endsAt: ps.endsAt, key: `phase-${ps.index}`, prev: ps.state })
  }
  if (ar.result) return ar.result
  const jp = ar.sides.jp
  const us = ar.sides.us
  let reason = null
  if (ar.t >= D) reason = 'clock'
  else if (jp.goalState.status !== 'open' && us.goalState.status !== 'open') reason = 'goals'
  else if (!anythingLeft(ar, 'jp') || !anythingLeft(ar, 'us')) reason = 'annihilated'
  if (!reason) return null
  return finish(ar, reason)
}

function anythingLeft(ar, key) {
  const side = ar.sides[key]
  const s = ar.state
  for (const i of side.ships) if (s.alive[i] === 1) return true
  for (const i of side.aircraft) if (s.alive[i] === 1) return true
  return false
}

/** The end: open goals resolved as the clock would (survive met if still held, the rest failed), and the result's words. */
export function finish(ar, reason) {
  if (ar.result) return ar.result
  const goals = {}
  for (const key of ['jp', 'us']) {
    const side = ar.sides[key]
    const g = side.goalState
    if (g.status === 'open') g.status = g.kind === 'survive' ? (g.count >= g.need ? 'met' : 'failed') : 'failed'
    goals[key] = { ...g, name: side.name, line: g.line, sentence: sentence(ar, side, g) }
  }
  const mine = goals[ar.side]
  const theirs = goals[ar.enemySide]
  ar.result = {
    t: ar.t,
    reason,
    side: ar.side,
    goals,
    met: mine.status === 'met',
    otherMet: theirs.status === 'met',
    line: mine.sentence,
    footnote: ar.scenario.footnote ?? null,
    tally: ar.tallySnapshot(),
  }
  ar._onEnd(ar.result)
  return ar.result
}

/** One sentence for a side's main goal at the end (machines, not people; no game words). */
function sentence(ar, side, g) {
  const n = side.name
  const w = (k) => typeWord(g.type, k)
  const when = clockText(ar.t)
  // (one of one: the carrier, not "one of the one carrier")
  if (g.need === 1 && (g.total ?? 1) === 1 && (g.kind === 'sink' || g.kind === 'survive')) {
    if (g.kind === 'sink') return g.status === 'met' ? `${n} sank the ${w(1)} by ${when}.` : `${n} did not sink the ${w(1)}.`
    return g.status === 'met' ? `${n} kept the ${w(1)} afloat to the end.` : `${n} lost the ${w(1)} at ${when}.`
  }
  switch (g.kind) {
    case 'sink':
      return g.status === 'met' ? `${n} sank ${countWord(g.count)} ${w(g.count)} by ${when}.` : `${n} sank ${ofWord(g.count)} of the ${countWord(g.need)} ${w(g.need)} it set out to sink.`
    case 'survive':
      return g.status === 'met' ? `${n} kept ${countWord(g.count)} of the ${countWord(g.total)} ${w(g.total)} afloat to the end.` : `${n} had ${ofWord(g.count)} of the ${countWord(g.total)} ${w(g.total)} afloat at ${when}; ${countWord(g.need)} had to be.`
    case 'hit':
      return g.status === 'met' ? `${n} put ${countWord(g.count)} hits into the ${w(2)} by ${when}.` : `${n} put ${ofWord(g.count)} of the ${countWord(g.need)} hits it needed into the ${w(2)}.`
    case 'shoot-down':
      return g.status === 'met' ? `${n} shot down ${countWord(g.count)} aircraft by ${when}.` : `${n} shot down ${ofWord(g.count)} of the ${countWord(g.need)} aircraft it needed.`
    case 'reach':
      return g.status === 'met' ? `${upper(countWord(g.count))} of ${n}’s ${w(g.count)} came within range by ${when}.` : `${upper(ofWord(g.count))} of the ${countWord(g.need)} ${w(g.need)} ${n} needed came within range.`
    default:
      return ''
  }
}

/** Each side's strength (the bars): the hit points of its ships afloat against all, ships afloat, aircraft left. */
export function strengthOf(ar, key) {
  const side = ar.sides[key]
  const s = ar.state
  let hp = 0
  let hpMax = 0
  let ships = 0
  for (const i of side.ships) {
    const x = ar._X[i]
    hpMax += x.hpMax
    if (s.alive[i] === 1) {
      hp += x.hp
      ships++
    }
  }
  let aircraft = 0
  for (const j of side.aircraft) if (s.alive[j] === 1 || (ar._X[j].onDeck && ar._X[j].hp > 0 && s.alive[ar._X[j].home] === 1)) aircraft++
  return { fraction: hpMax ? hp / hpMax : 0, hp, hpMax, ships, shipsTotal: side.ships.length, aircraft, aircraftTotal: side.aircraft.length }
}
