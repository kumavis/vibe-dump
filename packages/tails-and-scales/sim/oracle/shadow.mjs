// The full-precision shadow: the trace prints positions to 3 decimals, so a
// drift below that would pass it. Every state line of the trace (each `act`,
// and the phase, round and game-over snapshots) also records this: turn
// state, every unit (position with String(n), radius, models, flags, losses,
// mesmerism), every chunk (hp and shape position, yaw, height) and the logic
// RNG position.
//
// THE FORMAT IS FROZEN. The committed hashes in sim/baselines were taken from
// this exact string at R0, and every step up to a deliberate re-record must
// reproduce it byte for byte. It is not core's shadowState/stateHash (a
// separate string, DESIGN §2.6). shadowString is the format, from plain
// parts; shadowParts reads those parts off the legacy window.__ts. Once state
// lives in G (R4, R6), sim/ adds the G adapter beside shadowParts, and it has
// to reproduce these legacy quirks:
// - phase: on `round` lines and a non-wipe `over` line it is the last phase
//   run (PHASES[min(T.ph, last)].key); a wipe's `over` line keeps the phase
//   the wipe happened in;
// - round: one past the last round on a non-wipe `over` line (the legacy
//   for-loop overshoots);
// - stage: still 'battle' on the `over` line (traced before stage 'over');
// - wiped: undefined (printed '-') until a side is wiped, never -1;
// - flags: false and undefined values dropped, keys sorted;
// - units in array order; chunks in array order with no id, printed with
//   String(n) (R3's ChunkDef order must match, which P-terrain checks).
// A snapshot is taken at every non-`log` trace line, not only at `act`.
// To read the reference text: node sim/parity.mjs --pin --dump <dir>.
//
// Node and Chromium disagree in the last bit of Math.sin/cos for a few
// inputs, so some terrain differs by an ULP between the engines; where it
// does, the corpus keeps Chromium's hashes too (`webShadow`). N0's dmath trig
// changes chunk x/z/yaw, so the shadow is frozen only through R8.
//
// Beside the shadow, instrument() records the battle log as written: every
// entry put into #logList, as `@<trace length> <class>: <html>`. Most echo a
// `log` trace line, but the destroyed-unit lines are written and never
// traced (DESIGN §4.1 rule 8), and the trace length pins where each lands.
// That format is frozen too. From R6 the pure core has no DOM, so the G
// adapter rebuilds the same stream from G.journal. Chromium reads the html
// back serialized, which equals what was assigned for every line the game
// writes today (no `&`, `<` or `>` in text); admission would catch one that
// didn't.
//
// All four functions are injected into the browser page by
// sim/chromium.mjs, so they may only use their arguments, each other and
// `document`.

export function shadowString({ stage, round, active, phase, first, vp, wiped, rng, units, chunks }) {
  const n = String
  const flags = (f) => Object.keys(f).sort().filter((k) => f[k] !== undefined && f[k] !== false).map((k) => (f[k] === true ? k : `${k}=${f[k]}`)).join(',')
  const us = units.map((u) => `${u.id}@${n(u.pos.x)},${n(u.pos.z)} r${n(u.r)} a${u.alive} l${u.lost}${u.mesmerized ? ' mes' : ''} {${flags(u.flags)}} ` +
    u.models.map((m) => `${m.alive ? '' : 'x'}${m.w}:${n(m.ox)},${n(m.oz)}`).join(' '))
  const cs = chunks.map((c) => `${c.alive ? '' : 'x'}${c.hp}:${n(c.x)},${n(c.y)},${n(c.z)},${n(c.yaw)}`)
  const turn = `${stage} r${round} t${active} ${phase} f${first} vp${vp.join('-')} w${wiped ?? '-'} rng:${rng}`
  return [turn, ...us, `chunks ${cs.join(' ')}`].join(' | ')
}

// The parts, from the legacy app's window.__ts (units as they are: the
// string reads only the fields listed above).
export function shadowParts(ts) {
  const S = ts.S
  return {
    stage: S.stage, round: S.round, active: S.active, phase: S.phase, first: S.first, vp: S.vp, wiped: S.wiped, rng: ts.q.rngState(),
    units: ts.units,
    chunks: ts.scenery.chunks.map((c) => ({ alive: c.alive, hp: c.hp, x: c.shape.x, y: c.shape.y, z: c.shape.z, yaw: c.shape.yaw })),
  }
}

export function shadowOf(ts) {
  return shadowString(shadowParts(ts))
}

// Wrap trace.push so a shadow is taken the moment each state line is
// written, and the battle log's prepend so each write is recorded as it
// lands. `on(k, v)` hears each as it is taken: k is 'l' (a trace line), 's'
// (a shadow) or 'w' (a write). Returns the { shadow, written } it fills.
export function instrument(ts, on = null) {
  const rec = { shadow: [], written: [] }
  const push = ts.trace.push
  ts.trace.push = function (...lines) {
    const k = push.apply(this, lines)
    for (const l of lines) {
      if (on) on('l', l)
      if (l.startsWith('log ')) continue
      const s = shadowOf(ts)
      rec.shadow.push(s)
      if (on) on('s', s)
    }
    return k
  }
  const list = document.querySelector('#logList')
  const prepend = list.prepend
  list.prepend = function (...els) {
    for (const e of els) {
      const w = `@${ts.trace.length} ${e.className}: ${e.innerHTML}`
      rec.written.push(w)
      if (on) on('w', w)
    }
    return prepend.apply(this, els)
  }
  return rec
}
