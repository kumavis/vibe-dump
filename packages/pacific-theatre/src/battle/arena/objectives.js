// The objectives (ROUND-3.md §3 "Objectives", §6's goals): each side's main
// goal and its phases, their timers and counts, the end conditions and the
// result. Goal kinds: sink | hit | survive | shoot-down | reach; a type is a
// ship type, 'ship' (any ship) or 'aircraft'. A count is the side's (any of
// its units), so a phase met by a destroyer the player was not in is met.
//
// The goal fields content-3's scenarios carry beyond §6 (research/content-3.md
// §2) are read too: `types` (widens `type`: a cruiser is ca or cl), `weapon`
// (shell | torpedo | bomb: only hits of that weapon count), `by` (whose hits,
// or whose arrival: 'aircraft' or one of the side's own ship types), `rangeM`
// (a reach: `count` of the side's units `by` within rangeM of an enemy ship of
// `type`), `outOfAction` (a sink of carriers that a carrier burning, launching
// stopped, satisfies as well as one sunk) and `also` (more terms of a main
// goal, every one of which must hold).
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

import { A } from './params.js'

const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']
export const countWord = (n) => WORDS[n] ?? String(n)
/** A count in an "n of the m" phrase: none for nought. */
const upper = (w) => w.charAt(0).toUpperCase() + w.slice(1)
const ofWord = (n) => (n === 0 ? 'none' : countWord(n))
const NOUN = { cve: ['carrier', 'carriers'], cv: ['carrier', 'carriers'], cvl: ['carrier', 'carriers'], bb: ['battleship', 'battleships'], ca: ['heavy cruiser', 'heavy cruisers'], cl: ['light cruiser', 'light cruisers'], cruiser: ['cruiser', 'cruisers'], dd: ['destroyer', 'destroyers'], de: ['destroyer escort', 'destroyer escorts'], ship: ['ship', 'ships'], aircraft: ['aircraft', 'aircraft'] }
export const typeWord = (type, n) => (NOUN[type] || NOUN.ship)[n === 1 ? 0 : 1]
const CARRIERS = ['cv', 'cvl', 'cve']
/** The noun for a goal's types: one type's own; cruisers for ca and cl; carriers for carriers; ships otherwise. */
export const goalNoun = (g) => {
  const ts = goalTypes(g)
  if (ts.length === 1) return ts[0]
  if (ts.every((t) => t === 'ca' || t === 'cl')) return 'cruiser'
  if (ts.every((t) => CARRIERS.includes(t))) return 'cv'
  return 'ship'
}
export const clockText = (t) => `${Math.floor(Math.max(0, t) / 60)}:${String(Math.floor(Math.max(0, t) % 60)).padStart(2, '0')}`

/** Whether a ship type matches a goal's type ('ship': any ship). */
export const typeMatches = (type, want) => want === 'ship' || type === want
/** A goal's types: its `types` when given (content-3), else its `type`. */
export const goalTypes = (g) => (Array.isArray(g?.types) && g.types.length ? g.types : [g?.type ?? 'ship'])
/** Whether a ship type is one a goal counts. */
export const typeIn = (type, g) => goalTypes(g).some((w) => typeMatches(type, w))
/** Whether the hand that made a hit (an aircraft, or a ship of a type) is the one a goal's `by` names. */
const byMatches = (byType, by) => !by || (by === 'aircraft' ? byType === 'aircraft' : by === 'ship' ? !!byType && byType !== 'aircraft' : byType === by)
const passes = (e, g) => typeIn(e.type, g) && (!g.weapon || e.weapon === g.weapon) && byMatches(e.byType, g.by)

/**
 * Each side's ledger of what it did: the enemy ships it sank and hit, the
 * aircraft it shot down, each with its type, the weapon and the type of the
 * hand that did it ('aircraft' or a ship type); the units that came within a
 * reach goal's range.
 */
export function createCounters() {
  return { sunk: [], hits: [], downed: [], reached: new Map() }
}

/** A ship of the enemy sunk by side (the sinker), a hit on one, an aircraft shot down; e: { weapon, byType }. */
export const countSunk = (ar, side, type, e = {}) => {
  ar.sides[side].count.sunk.push({ t: ar.t, type, weapon: e.weapon ?? null, byType: e.byType ?? null })
}
export const countHit = (ar, side, type, e = {}) => {
  ar.sides[side].count.hits.push({ t: ar.t, type, weapon: e.weapon ?? null, byType: e.byType ?? null })
}
export const countDown = (ar, side, e = {}) => {
  ar.sides[side].count.downed.push({ t: ar.t, type: 'aircraft', weapon: e.weapon ?? null, byType: e.byType ?? null })
}

/** A side's ships a goal counts: afloat now, in all, burning (afloat under half), and out of action (gone, going down or burning). */
function shipsOf(ar, side, g) {
  let afloat = 0
  let total = 0
  let burning = 0
  for (const i of ar.sides[side].ships) {
    if (!typeIn(ar._X[i].model.type, g)) continue
    total++
    if (ar.state.alive[i] === 1) {
      afloat++
      if (ar._X[i].hp / ar._X[i].hpMax < A.fireAt) burning++
    }
  }
  return { afloat, total, burning, out: total - afloat + burning }
}

/** The raw count a goal measures for a side (for reach: the units that have come within its range so far). */
function rawCount(ar, side, goal, key) {
  const c = ar.sides[side].count
  switch (goal.kind) {
    case 'sink':
      // out of action (content-3's Midway): every ship of the type the other side has that is sunk, going down or burning
      if (goal.outOfAction) return shipsOf(ar, ar.sides[side].enemy, goal).out
      return countOf(c.sunk, goal)
    case 'hit':
      return countOf(c.hits, goal)
    case 'shoot-down':
      return goal.by ? c.downed.filter((e) => byMatches(e.byType, goal.by)).length : c.downed.length
    case 'reach': {
      // `count` of the side's units `by` (any ship when none is named) within rangeM of an enemy ship of the goal's type
      let set = c.reached.get(key)
      if (!set) c.reached.set(key, (set = new Set()))
      const s = ar.state
      const range = goal.rangeM ?? 3000
      const enemy = ar.sides[ar.sides[side].enemy]
      const by = goal.by ?? 'ship'
      const units = by === 'aircraft' ? ar.sides[side].aircraft : ar.sides[side].ships
      for (const i of units) {
        if (s.alive[i] !== 1 || set.has(i)) continue
        if (by !== 'aircraft' && !typeMatches(ar._X[i].model.type, by)) continue
        for (const j of enemy.ships) {
          if (s.alive[j] !== 1 || !typeIn(ar._X[j].model.type, goal)) continue
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

function countOf(log, g) {
  let n = 0
  for (const e of log) if (passes(e, g)) n++
  return n
}

/** A goal's state at t: { kind, type, types, noun, weapon, by, need, count, total?, status: 'open' | 'met' | 'failed', line }. */
function goalState(ar, side, goal, { base = 0, endsAt, key, prev = null }) {
  const need = goal.count ?? 1
  const out = { kind: goal.kind, type: goal.type, types: goalTypes(goal), noun: goalNoun(goal), weapon: goal.weapon ?? null, by: goal.by ?? null, outOfAction: !!goal.outOfAction, need, count: 0, status: 'open', text: goal.text ?? null, endsAt, line: '' }
  if (prev && prev.status !== 'open') return prev
  if (goal.kind === 'survive') {
    const { afloat, total } = shipsOf(ar, side, goal)
    out.count = afloat
    out.total = total
    out.line = `${afloat} of ${total}`
    if (afloat < need) out.status = 'failed'
    else if (ar.t >= endsAt) out.status = 'met'
    return out
  }
  out.count = Math.max(0, rawCount(ar, side, goal, key) - base)
  out.line = `${Math.min(out.count, need)} of ${need}`
  const other = goal.kind === 'sink' ? shipsOf(ar, ar.sides[side].enemy, goal) : null
  if (other) out.total = other.total
  if (out.count >= need) out.status = 'met'
  else if (ar.t >= endsAt) out.status = 'failed'
  else if (other) {
    // too few of the type left to reach the count (out of action, the burning ones are counted already)
    if (out.count + (goal.outOfAction ? other.afloat - other.burning : other.afloat) < need) out.status = 'failed'
  }
  return out
}

/** A main goal with its `also` terms (content-3): met when every term is, failed when any is. */
function mainState(ar, key, goal, prev) {
  const D = ar.durationS
  const terms = [goal, ...(Array.isArray(goal.also) ? goal.also : [])]
  const prevTerms = prev?.terms || []
  const states = terms.map((g, k) => goalState(ar, key, g, { endsAt: Math.min(D, g.withinS ?? D), key: k ? `main-${k}` : 'main', prev: prevTerms[k] ?? null }))
  const first = states[0]
  if (states.length === 1) return { ...first, terms: states }
  const status = states.some((t) => t.status === 'failed') ? 'failed' : states.every((t) => t.status === 'met') ? 'met' : 'open'
  return { ...first, status, line: states.map((t) => t.line).join(' · '), terms: states }
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
    side.goalState = mainState(ar, key, side.def.goal || { kind: 'survive', type: 'ship', count: 1 }, side.goalState)
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
  const settle = (g) => {
    if (g.status === 'open') g.status = g.kind === 'survive' ? (g.count >= g.need ? 'met' : 'failed') : 'failed'
  }
  for (const key of ['jp', 'us']) {
    const side = ar.sides[key]
    const g = side.goalState
    for (const t of g.terms || []) settle(t)
    if (g.terms?.length > 1) g.status = g.terms.every((t) => t.status === 'met') ? 'met' : 'failed'
    else settle(g)
    const extra = (g.terms || []).slice(1).map((t) => sentence(ar, side, t, true))
    goals[key] = { ...g, name: side.name, line: g.line, sentence: [sentence(ar, side, g.terms?.[0] ?? g), ...extra].join(' ') }
  }
  const mine = goals[ar.side]
  ar.result = {
    t: ar.t,
    reason,
    side: ar.side,
    goals,
    // (each side's main goal met or not; `mine`, the played side's)
    met: { jp: goals.jp.status === 'met', us: goals.us.status === 'met' },
    mine: mine.status === 'met',
    line: mine.sentence,
    text: mine.sentence,
    footnote: ar.scenario.footnote ?? null,
    tally: ar.tallySnapshot(),
  }
  ar._onEnd(ar.result)
  return ar.result
}

/** One sentence for a side's main goal at the end (machines, not people; no game words); `also`: a further term, "It ...". */
function sentence(ar, side, g, also = false) {
  const n = also ? 'It' : side.name
  const its = also ? 'its' : `${side.name}’s`
  const w = (k) => typeWord(g.noun ?? g.type, k)
  const when = clockText(ar.t)
  if (g.kind === 'sink' && g.outOfAction) {
    return g.status === 'met' ? `${n} put ${countWord(g.count)} ${w(g.count)} out of action by ${when}.` : `${n} put ${countWord(g.count)} ${w(g.count)} out of action; ${countWord(g.need)} had to be.`
  }
  // (one of one: the carrier, not "one of the one carrier")
  if (g.need === 1 && (g.total ?? 1) === 1 && (g.kind === 'sink' || g.kind === 'survive')) {
    if (g.kind === 'sink') return g.status === 'met' ? `${n} sank the ${w(1)} by ${when}.` : `${n} did not sink the ${w(1)}.`
    return g.status === 'met' ? `${n} kept the ${w(1)} afloat to the end.` : `${n} lost the ${w(1)} at ${when}.`
  }
  // (one of several to sink: "a battleship", not "none of the one battleship")
  if (g.need === 1 && g.kind === 'sink') return g.status === 'met' ? `${n} sank a ${w(1)} by ${when}.` : `${n} did not sink a ${w(1)}.`
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
      return g.status === 'met' ? `${upper(countWord(g.count))} of ${its} ${typeWord(g.by ?? 'ship', g.count)} came within range by ${when}.` : `${upper(ofWord(g.count))} of the ${countWord(g.need)} ${typeWord(g.by ?? 'ship', g.need)} ${n} needed came within range.`
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
