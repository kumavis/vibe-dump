// walk.mjs — a board-free estimate of the repeat rate a word list forces.
// One token walks the turn graph the way chooseTurn would on an EMPTY board with no link steering:
// it never returns to the word it just left, never stays, and picks a neighbour with weight
// min(1.5, 0.6 + degree/20) (chooseTurn's degree factor; the field bonus is ignored). It keeps the
// same 6-word history as Board.setWord. walkRepeat = share of steps that land on a word in that
// history. A walk that reaches a word with no exit restarts at a random word of the 2-core (so
// walkRepeat measures the structure of the part of the list a board actually lives in).
// Deterministic for a given (list, steps, seed).
import { index, kcoreMask } from './lexgraph.mjs'

function rng32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function walkRepeat(list, { steps = 60000, seed = 7, tokens = 40 } = {}) {
  const ix = index(list)
  const n = list.length
  const alive = kcoreMask(ix, 2)
  const start = [...Array(n).keys()].filter((i) => alive[i])
  if (!start.length) return { walkRepeat: 1, n2: 0 }
  const nb = list.map((_, i) => ix.nbrs(i))
  const w = ix.deg.map((d) => Math.min(1.5, 0.6 + d / 20))
  const rnd = rng32(seed)
  let rep = 0, cnt = 0
  const per = Math.ceil(steps / tokens)
  for (let t = 0; t < tokens; t++) {
    let cur = start[Math.floor(rnd() * start.length)]
    let hist = []
    for (let s = 0; s < per; s++) {
      const prev = hist.at(-1)
      const opts = nb[cur].filter((j) => j !== prev)
      if (!opts.length) { cur = start[Math.floor(rnd() * start.length)]; hist = []; continue }
      let r = rnd() * opts.reduce((a, j) => a + w[j], 0)
      let nxt = opts.at(-1)
      for (const j of opts) if ((r -= w[j]) <= 0) { nxt = j; break }
      if (hist.includes(nxt)) rep++
      cnt++
      hist.push(cur)
      if (hist.length > 6) hist.shift()
      cur = nxt
    }
  }
  return { walkRepeat: rep / Math.max(1, cnt), n2: start.length }
}
