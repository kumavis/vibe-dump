// The game's own dice, one stream per match. Everything that can change the
// outcome of a battle (dice, scatter, aim, the AI's tie-breaks) draws from
// here; purely visual randomness (debris, flock, particles) keeps using
// Math.random. With a seed, a battle replays exactly, which is what the trace
// and the parity tests lean on. The count and running hash fingerprint the
// stream for those traces.
//
// The generator is plain data ({a, n, h, locked}), so it lives in the match
// state and two matches in one process never share a stream. `a` is
// mulberry32's state word, the same arithmetic as util.js's mulberry32.

export function createRng(seed) {
  return { a: seed >>> 0, n: 0, h: 0, locked: false }
}

export function draw(r) {
  if (r.locked) throw new Error('a dice draw while the rng is locked (a preview or legality check must never roll)')
  let a = r.a | 0
  a = (a + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  const v = ((t ^ (t >>> 14)) >>> 0) / 4294967296
  r.a = a
  r.n++
  r.h = (Math.imul(r.h, 31) + Math.floor(v * 4294967296)) >>> 0
  return v
}

// the stream's fingerprint exactly as the trace prints it: `count#hash36`
export const rngState = (r) => `${r.n}#${r.h.toString(36)}`

export function lock(r) {
  r.locked = true
}

export function unlock(r) {
  r.locked = false
}
