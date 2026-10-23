// The score and the outcome (ENGINEERING.md §5 "sim.score", "sim.outcome";
// R7 §4.13): the sortie in its own terms (hits and where, release height,
// torpedoes in the envelope, aircraft downed, salvos and straddles, came back
// or lost; no points, no ranks), and the comparison of the sim's battle with
// the record's at the clock's end or when the player leaves, divergences
// named. People are never counted here.

import { oneAircraftName } from './ai.js'

/** The sortie's score. */
export function computeScore(sim) {
  const sc = sim._score
  if (!sc) return { hits: [], downed: 0, torpedoesHit: 0, survived: null, timeS: 0 }
  const pl = sim.player
  const ms = sim.momentState
  const i = pl ? pl.unitIndex : -1
  const alive = i >= 0 ? sim.state.alive[i] === 1 : null
  return {
    hits: sc.hits.map((h) => ({ unit: h.unit, name: h.name, kind: h.kind, count: h.count, where: h.where })),
    downed: sc.downed,
    torpedoesHit: sc.torpedoesHit,
    survived: sc.how === 'landed' ? true : sc.how === 'lost' || sc.how === 'ditched' ? false : alive,
    how: sc.how,
    timeS: Math.max(0, (ms?.endT ?? sim.t) - sc.start),
    salvos: sc.salvos,
    straddles: sc.straddles,
    shells: sc.shells,
    bombs: sc.bombs,
    torpedoes: sc.torpedoes,
    releaseM: sc.releaseM,
    envelope: sc.envelope,
    objective: sc.objective,
    rounds: Math.round(sc.rounds ?? 0),
    aaBursts: sc.aaBursts ?? 0,
  }
}

// --- the sortie (ROUND-2.md §3): a take's span [tTake, tRelease] and what happened in it ----------------------

/** What the HUD and the after-card compare: the unit's damage at a moment. */
function damageSnap(sim, i) {
  const x = sim._X[i]
  const s = sim.state
  if (sim.slots[i].kind === 'ship') {
    const d = x.dmg
    const simR = d?.regime === 'sim'
    return { alive: s.alive[i], damage: +s.damage[i].toFixed(3), fight: simR ? d.fight : 0, float: simR ? d.float : 0, list: +s.list[i].toFixed(1), fires: simR ? d.fires.filter((v) => v > 0).length : x.rd?.fires ?? 0, hits: simR ? d.hits ?? 0 : x.rd?.hits ?? 0, systemsOut: simR ? [...(d.systemsOut || [])] : [] }
  }
  return { alive: s.alive[i], damage: +(x.body?.damage ?? s.damage[i]).toFixed(3), fuelS: x.body ? Math.round(x.body.fuelS) : null, altM: Math.round(s.pos[3 * i + 1]) }
}

/** A sortie opened at a take. */
export function openSortie(sim, pl, group) {
  const i = pl.unitIndex
  const u = sim.slots[i]
  return {
    t0: sim.t,
    t1: null,
    engagedAt: null,
    index: i,
    unit: { index: i, id: u.id, name: u.name, ja: u.ja ?? null, label: pl.role?.name ?? u.name, kind: u.kind, side: u.side, kit: u.kit, group: group?.id ?? null, groupName: group?.name ?? null },
    role: { ...pl.role },
    station: pl.station,
    stations: [pl.station],
    momentId: sim._momentPending?.id ?? null,
    start: damageSnap(sim, i),
    end: null,
    score: null,
    logFrom: sim._log.length,
    logTo: null,
    engaged: false,
  }
}

/** The sortie closed at the release (or the unit's fate). */
export function closeSortie(sim, so) {
  so.t1 = sim.t
  so.end = damageSnap(sim, so.index)
  so.score = computeScore(sim)
  so.station = sim.player?.station ?? so.station
  so.engaged = !!sim.player?.engaged
  so.logTo = sim._log.length
}

const short = (sim, i) => {
  const u = sim.slots[i]
  if (u.kind !== 'aircraft' || u.parked) return u.name
  return sim._X[i].ac || sim._X[i].wasSpare ? oneAircraftName(sim, i) : u.name
}

/**
 * sim.sortie: { held, t0, t1, from, to, durationS, unit, role, station,
 * stations, momentId, touched, engagedAt, hits, downed, torpedoesHit,
 * releases, damageTaken, survived, how, divergedDuring: [{ unit, index,
 * name, kind, side, why, t, at }] }. While held, t1 is now.
 */
export function sortieOf(sim, so) {
  const live = so.t1 == null
  const end = live ? damageSnap(sim, so.index) : so.end
  const sc = live ? computeScore(sim) : so.score
  const t1 = live ? sim.t : so.t1
  const st = so.start
  const ship = so.unit.kind === 'ship'
  const damageTaken = ship
    ? { fight: +Math.max(0, end.fight - st.fight).toFixed(3), float: +Math.max(0, end.float - st.float).toFixed(3), list: +(end.list - st.list).toFixed(1), fires: end.fires, hits: Math.max(0, end.hits - st.hits), systemsOut: end.systemsOut }
    : { damage: +Math.max(0, end.damage - st.damage).toFixed(3) }
  const seen = new Map()
  const log = sim._log.slice(so.logFrom, live ? sim._log.length : so.logTo)
  for (const e of log) if (e.i !== so.index && !seen.has(e.i)) seen.set(e.i, e)
  const divergedDuring = [...seen.values()].map((e) => ({ unit: sim.slots[e.i].id, index: e.i, name: short(sim, e.i), kind: sim.slots[e.i].kind, side: sim.slots[e.i].side, why: e.why, t: e.t, at: sim.clock.label(e.t) }))
  return {
    held: live,
    t0: so.t0,
    t1,
    from: sim.clock.label(so.t0),
    to: sim.clock.label(t1),
    durationS: +(t1 - so.t0).toFixed(1),
    unit: so.unit,
    role: so.role,
    station: live ? sim.player?.station ?? so.station : so.station,
    stations: [...so.stations],
    momentId: so.momentId,
    touched: live ? !!sim.player?.engaged : so.engaged,
    engagedAt: so.engagedAt,
    hits: sc?.hits ?? [],
    downed: sc?.downed ?? 0,
    torpedoesHit: sc?.torpedoesHit ?? 0,
    releases: { bombs: sc?.bombs ?? 0, torpedoes: sc?.torpedoes ?? 0, salvos: sc?.salvos ?? 0, shells: sc?.shells ?? 0, rounds: sc?.rounds ?? 0, aaBursts: sc?.aaBursts ?? 0, releaseM: sc?.releaseM ?? null, envelope: sc?.envelope ?? [] },
    damageTaken,
    survived: sc?.survived ?? end.alive === 1,
    how: sc?.how ?? null,
    divergedDuring,
  }
}

/** A ship's status in the record at time T: sunk, doomed, damaged or untouched. */
function recordStatus(r, T) {
  if (r.sinkT != null && r.sinkT <= T) return { kind: 'sunk', t: r.sinkT }
  const hit = r.events.some((e) => (e.kind === 'hit' || e.kind === 'torpedo-hit') && e.t <= T)
  if (hit && r.sinkT != null) return { kind: 'doomed', t: r.sinkT }
  if (hit || r.events.some((e) => e.kind === 'fire' && e.t <= T)) return { kind: 'damaged' }
  return { kind: 'afloat' }
}

/** The same in the sim. */
function simStatus(sim, i, T) {
  const x = sim._X[i]
  const r = x.rec
  const d = x.dmg
  if (!d || d.regime !== 'sim' || r.fixed) return recordStatus(r, T)
  if (d.sinking || sim.state.alive[i] === 0) return { kind: 'sunk', t: d.sinkAt ?? x.sunkAt ?? T }
  if (d.doomed) return { kind: 'doomed', t: d.sinkDue ?? null }
  if (d.hits > 0 || d.fires.some(Boolean) || d.fight > 0.02) return { kind: 'damaged' }
  return { kind: 'afloat' }
}

/** A status in the past tense with its clock ("sank at 10:31", "afloat at 18:00"); the record's doomed ship sank at its record time. */
function label(sim, s, T, { record = false } = {}) {
  const at = (t) => sim.clock.label(t)
  if (s.kind === 'sunk') return `sank at ${at(s.t ?? T)}`
  if (s.kind === 'doomed') return record && s.t != null ? `sank at ${at(s.t)}` : `sinking at ${at(T)}`
  if (s.kind === 'damaged') return `damaged, afloat at ${at(T)}`
  return `afloat at ${at(T)}`
}

/** The record's and the sim's battle side by side, at the clock's end or now. */
export function computeOutcome(sim, { at = null } = {}) {
  const T = at ?? sim.t
  const bySide = {}
  const record = {}
  const side = (o, k) => (o[k] ||= { sunk: [], doomed: [], damaged: [], aircraftLost: 0 })
  const diverged = []
  for (const r of sim.record.ships) {
    const i = r.slot
    if (sim.slots[i].kind !== 'ship') continue
    const a = simStatus(sim, i, T)
    const b = recordStatus(r, T)
    const so = side(bySide, r.side)
    const ro = side(record, r.side)
    if (a.kind !== 'afloat') so[a.kind].push(r.id)
    if (b.kind !== 'afloat') ro[b.kind].push(r.id)
    const sameKind = a.kind === b.kind
    const sameTime = !(a.kind === 'sunk' && b.kind === 'sunk') || Math.abs((a.t ?? 0) - (b.t ?? 0)) <= 600
    if (!sameKind || !sameTime) diverged.push({ unit: r.id, name: r.name, sim: label(sim, a, T), record: b.kind === 'afloat' ? 'survived' : label(sim, b, T, { record: true }) })
  }
  // aircraft: the record's losses by T against the sim's
  for (const g of sim.record.groups) {
    let recLost = 0
    let simLost = 0
    for (const ac of g.aircraft) {
      if (ac.lossT != null && ac.lossT <= T) recLost++
      const i = ac.slot
      if (i == null) continue
      const x = sim._X[i]
      if (x.lostAt != null && x.lostAt <= T) simLost++
      else if (sim.slots[i].authority === 'record' && !x.spared && ac.lossT != null && ac.lossT <= T && !sim._cancelled.has(g.index)) simLost++
    }
    side(record, g.side).aircraftLost += recLost
    side(bySide, g.side).aircraftLost += simLost
    if (recLost !== simLost) diverged.push({ group: g.id, name: g.name, sim: `${simLost} lost`, record: `${recLost} lost` })
    if (sim._cancelled.has(g.index)) diverged.push({ group: g.id, name: g.name, sim: 'not launched', record: 'launched' })
  }
  // the player's own aircraft, if it came from a spare
  const pl = sim.player
  if (pl && pl.kind === 'aircraft' && sim._X[pl.unitIndex].wasSpare && sim._X[pl.unitIndex].lostAt != null) side(bySide, sim.slots[pl.unitIndex].side).aircraftLost++
  return { at: T, label: sim.clock.label(T), bySide, record, diverged, guess: sim._guess || [] }
}
