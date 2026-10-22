// The score and the outcome (ENGINEERING.md §5 "sim.score", "sim.outcome";
// R7 §4.13): the sortie in its own terms (hits and where, release height,
// torpedoes in the envelope, aircraft downed, salvos and straddles, came back
// or lost; no points, no ranks), and the comparison of the sim's battle with
// the record's at the clock's end or when the player leaves, divergences
// named. People are never counted here.

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

const label = (sim, s) => (s.kind === 'sunk' || s.kind === 'doomed' ? `${s.kind}${s.t != null ? ` ${sim.clock.label(s.t)}` : ''}` : s.kind)

/** The record's and the sim's battle side by side, at the clock's end or now. */
export function computeOutcome(sim, { at = null } = {}) {
  const T = at ?? sim.t
  const bySide = {}
  const record = {}
  const side = (o, k) => (o[k] ||= { sunk: [], doomed: [], damaged: [], aircraftLost: 0 })
  const diverged = []
  for (const r of sim.record.ships) {
    const i = r.slot
    if (sim.units[i].kind !== 'ship') continue
    const a = simStatus(sim, i, T)
    const b = recordStatus(r, T)
    const so = side(bySide, r.side)
    const ro = side(record, r.side)
    if (a.kind !== 'afloat') so[a.kind].push(r.id)
    if (b.kind !== 'afloat') ro[b.kind].push(r.id)
    const sameKind = a.kind === b.kind
    const sameTime = !(a.kind === 'sunk' && b.kind === 'sunk') || Math.abs((a.t ?? 0) - (b.t ?? 0)) <= 600
    if (!sameKind || !sameTime) diverged.push({ unit: r.id, name: r.name, sim: label(sim, a), record: b.kind === 'afloat' ? 'survived' : label(sim, b) })
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
      else if (sim.units[i].authority === 'record' && !x.spared && ac.lossT != null && ac.lossT <= T && !sim._cancelled.has(g.index)) simLost++
    }
    side(record, g.side).aircraftLost += recLost
    side(bySide, g.side).aircraftLost += simLost
    if (recLost !== simLost) diverged.push({ group: g.id, name: g.name, sim: `${simLost} lost`, record: `${recLost} lost` })
    if (sim._cancelled.has(g.index)) diverged.push({ group: g.id, name: g.name, sim: 'not launched', record: 'launched' })
  }
  // the player's own aircraft, if it came from a spare
  const pl = sim.player
  if (pl && pl.kind === 'aircraft' && sim._X[pl.unitIndex].wasSpare && sim._X[pl.unitIndex].lostAt != null) side(bySide, sim.units[pl.unitIndex].side).aircraftLost++
  return { at: T, label: sim.clock.label(T), bySide, record, diverged, guess: sim._guess || [] }
}
