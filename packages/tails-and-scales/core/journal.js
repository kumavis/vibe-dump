// The match's journal: the trace, a replayable fingerprint of the battle.
// Every log line and the dice stream's position, plus a state snapshot after
// each action, phase and round. Two runs with the same seeds must write the
// identical trace (that is how refactors are checked: sim/parity.mjs), so
// the format is frozen: positions to 3 decimals, each model's wounds, the
// standing chunk count, the score and rngState.
//
// Each line goes into G.journal.trace and, as it is written, to G.onTrace
// (sim/ and ?debug only), which may read G but never change it. The log
// lines main.js holds back until an attack is over (a destroyed unit's) wait
// in G.journal.pendingLog; they are written to the battle log, never traced.
import { rngState } from './rng.js'

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
