// The match's journal: the trace, a replayable fingerprint of the battle,
// and the events the view plays.
//
// The trace: every log line and the dice stream's position, plus a state
// snapshot after each action, phase and round. Two runs with the same seeds
// must write the identical trace (that is how refactors are checked:
// sim/parity.mjs), so the format is frozen: positions to 3 decimals, each
// model's wounds, the standing chunk count, the score and rngState. Each
// line goes into G.journal.trace and, as it is written, to G.onTrace (sim/
// and ?debug only), which may read G but never change it.
//
// The events (DESIGN §2.3): what happened, as plain data, pushed onto G.out
// in the order it happened, for the view to play at its own pace (main.js's
// EventPlayer). The rules never wait for them: what the old code waited on (a
// dice row, a beat after a wound) is an event in the same place (§4.1 rule
// 3), and building one never draws a die or changes the match. G.out is null
// for a quiet run (nothing is kept) and [] when someone will present.
//
// The battle log: a line is traced (its text), then shown (a `log` event
// carrying `at`, the trace's length at that moment), and the lines held back
// until an attack is over (a destroyed unit's, waiting in
// G.journal.pendingLog) follow it, shown but never traced (§4.1 rule 8).
import { rngState } from './rng.js'

// One event onto `out`, the array the caller presents from (nothing when it
// passes none). The Terrain reports through this with the out its caller
// passes; the rules through emit, with the match's.
export function emitTo(out, t, payload) {
  if (out) out.push({ t, ...payload })
}
export function emit(G, t, payload = {}) {
  emitTo(G.out, t, payload)
}
// Every event emitted since the last drain, in order, taken out of G.out
// ([] for a quiet run).
export function drain(G) {
  return G.out ? G.out.splice(0) : []
}

export function trace(G, line) {
  G.journal.trace.push(line)
  G.onTrace?.(line, G)
}

export function traceState(G, tag) {
  const us = G.units.map((u) => `${u.id}:${u.pos.x.toFixed(3)},${u.pos.z.toFixed(3)},${u.models.map((m) => m.w).join('/')}`).join(' ')
  trace(G, `${tag} ${us} chunks:${G.terrain.chunks.filter((c) => c.alive).length} vp:${G.turn.vp.join('-')} rng:${rngState(G.rng)}`)
}

// a battle-log line as the trace keeps it: its text without the markup
export function traceLog(G, side, html) {
  trace(G, `log ${side} ${html.replace(/<[^>]+>/g, '')} rng:${rngState(G.rng)}`)
}

// A battle-log line: traced, shown, then the held-back lines after it.
export function log(G, side, html, cls = '') {
  traceLog(G, side, html)
  emit(G, 'log', { side, html, cls, traced: true, at: G.journal.trace.length })
  flush(G)
}

// Show the held-back lines now (each line's `at` is where the trace stands).
export function flush(G) {
  for (const [side, html, cls] of G.journal.pendingLog.splice(0)) emit(G, 'log', { side, html, cls, traced: false, at: G.journal.trace.length })
}
