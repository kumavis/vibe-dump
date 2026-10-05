import { mulberry32 } from './util.js'

// The game's own dice. Everything that can change the outcome of a battle
// (dice, scatter, aim, the AI's tie-breaks) draws from here; purely visual
// randomness (debris, flock, particles) keeps using Math.random. With a seed,
// a battle replays exactly, which is what the trace and the headless tests
// lean on. The count and running hash fingerprint the stream for those traces.
let gen = Math.random
let count = 0
let hash = 0

export function rng() {
  const v = gen()
  count++
  hash = (Math.imul(hash, 31) + Math.floor(v * 4294967296)) >>> 0
  return v
}

export function seedLogic(seed) {
  gen = mulberry32(seed)
  count = 0
  hash = 0
}

export const rngState = () => `${count}#${hash.toString(36)}`
