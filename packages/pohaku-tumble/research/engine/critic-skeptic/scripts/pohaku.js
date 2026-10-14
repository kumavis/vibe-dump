// The synthesis engine: Pōhaku Tumble's proposed chooseTurn and deal, written
// against Jukugo's real Board. prepare.mjs copies this into .build/ and hooks it
// into the patched board.js:
//   chooseTurn(pair) { if (SIM.engine) return chooseTurnP(this, pair, SIM.engine); ...stock... }
//   deal()           { if (SIM.deal === 'fill') return dealFill(this); ...stock... }
//
// SIM.engine = E, all keys optional (missing = Jukugo's behaviour):
//   tiers:  true    fresh-first: if any legal target is not in the pair's last 6
//                   words, only those are considered; otherwise the older words
//                   of the last 6 (not the previous one); otherwise (see ret)
//                   the previous word. false = Jukugo: every legal target, the
//                   last-6 words weighted by histPen (default 1).
//   histPen: x      with tiers false: weight of a target in the last 6 (Jukugo 1)
//   ret:    s|null  the previous word becomes legal once the pair has rested s
//                   seconds since its last turn, and (with tiers) only when no
//                   other target is legal. null = Jukugo: never.
//   reach:  {depth, cap, dead}
//                   replace Jukugo's static factor min(1.5, 0.6 + degree/20) with
//                   N === 0 ? dead : min(N, cap), N = distinct words reachable
//                   from the target within `depth` turns, walking only through
//                   words that are free (not on another pair) and not in the
//                   pair's history after the turn. null = Jukugo's static factor.
//   steer:  {hi, hiJoin, hiBreak}
//                   the high side of Jukugo's linked steering: above `hi` a join
//                   adds hiJoin (Jukugo 1.5) and a break hiBreak (Jukugo 1.5).
//
// SIM.deal = 'fill' with SIM.dealMin (top bound, default 5), SIM.floorMin
// (lowest bound, default 1), SIM.matchMin (default 3), SIM.dealComp (deal only
// words whose turn-graph component has at least this many words, default 0),
// SIM.dealCore (deal only words in the full list's 2-core, default false).

import { LEXICON, BY_CHAR, turns, degree, compSize, inCore2 } from './lexicon.sim.js'
import { LINK_MAX } from './board.js'

const HIST = 6

// Legal targets for `pair` under E, each with its tier (0 fresh, 1 older
// history word, 2 the previous word). assumeRested: treat the pair as rested
// (used by the "frozen" metric: can this pair ever move without help?).
export function targets(board, pair, E, assumeRested = false) {
  const hist = pair.history
  const prev = hist.at(-1)?.word
  const rested = E.ret != null && (assumeRested || (board.now ?? 0) - (pair.turnedAt ?? -1e9) >= E.ret)
  const out = []
  for (const index of [0, 1]) {
    for (const entry of turns(pair.entry, index)) {
      if (board.used.has(entry.word)) continue
      let tier
      if (entry.word === prev) {
        if (!rested) continue
        tier = 2
      } else tier = hist.some((h) => h.word === entry.word) ? 1 : 0
      out.push({ index, entry, tier })
    }
  }
  if (!out.length) return out
  // critic knob: board-level recency as a strict sub-tier (word left the board < sec ago anywhere)
  const BR = E.boardRecent
  if (BR && BR.mode === 'tier' && board.leftAt) for (const o of out) if (o.tier === 0 && (board.now ?? 0) - (board.leftAt.get(o.entry.word) ?? -1e9) < BR.sec) o.tier = 0.5
  const min = Math.min(...out.map((o) => o.tier))
  if (E.tiers) return out.filter((o) => o.tier === min)
  // without tiers the previous word is still a last resort
  return min < 2 ? out.filter((o) => o.tier < 2) : out
}

export function canTurnP(board, pair, E, assumeRested = false) {
  return targets(board, pair, E, assumeRested).length > 0
}

function reachCount(board, pair, entry, spec) {
  const { depth = 3, cap = 40 } = spec
  const cur = pair.entry
  const block = new Set(pair.history.map((e) => e.word))
  block.add(cur.word)
  block.add(entry.word)
  let frontier = [entry]
  let n = 0
  for (let d = 0; d < depth && frontier.length; d++) {
    const next = []
    for (const x of frontier) {
      for (const i of [0, 1]) {
        for (const y of turns(x, i)) {
          if (block.has(y.word) || board.used.has(y.word)) continue
          block.add(y.word)
          next.push(y)
          if (++n >= cap) return n
        }
      }
    }
    frontier = next
  }
  return n
}

export function weighted(board, pair, E) {
  const cands = targets(board, pair, E)
  if (!cands.length) return []
  // the Director may pass the linked share of the pairs in view (board.linkedView); else the whole floor
  const linked = board.linkedView ?? board.linkedFraction()
  const near = [0, 1].map((index) => {
    const tile = pair.tiles[index]
    return board.tiles.filter((t) => t.pair !== pair.id && Math.hypot(t.x - tile.x, t.z - tile.z) <= LINK_MAX)
  })
  const st = E.steer
  const BR = E.boardRecent
  const options = []
  for (const { index, entry, tier } of cands) {
    // Jukugo's steering toward ~half the floor linked
    const tile = pair.tiles[index]
    const breaks = near[index].some((t) => t.char === tile.char)
    const c = index === 0 ? entry.a : entry.b
    const joins = near[index].some((t) => t.char === c)
    let w = 1
    if (!E.noSteer) {
    if (joins) w += linked < 0.5 ? 6 : st && linked > st.hi ? st.hiJoin : 1.5
    if (breaks && linked > (st ? st.hi : 0.55)) w += st ? st.hiBreak : 1.5
    }
    if (entry.field !== pair.entry.field) w += 0.6
    if (E.reach) {
      const n = reachCount(board, pair, entry, E.reach)
      w *= n === 0 ? E.reach.dead ?? 0.1 : Math.min(n, E.reach.cap ?? 40)
    } else w *= Math.min(1.5, 0.6 + degree(entry) / 20)
    if (!E.tiers && tier === 1) w *= E.histPen ?? 1
    if (BR && BR.mode === 'w' && board.leftAt && (board.now ?? 0) - (board.leftAt.get(entry.word) ?? -1e9) < BR.sec) w *= BR.w
    options.push({ index, entry, w, tier })
  }
  return options
}

export function chooseTurnP(board, pair, E) {
  const options = weighted(board, pair, E)
  if (!options.length) return null
  let r = Math.random() * options.reduce((s, o) => s + o.w, 0)
  for (const o of options) if ((r -= o.w) <= 0) return o
  return options.at(-1)
}

// ── the deal ────────────────────────────────────────────────────────────────
// Jukugo's deal (random order; 60% of the time, when a dealt pair lies within 9
// units, a word sharing a root with it) with the rejection loop replaced:
// draw from the unused words at the top degree bound; when none is left, step
// the bound down one at a time to floorMin; if still nothing, leave a hole
// (the pair is dropped and ids renumbered — in the app this happens before any
// scene object exists, and a board sized from the list never needs it).
export function dealFill(board) {
  const SIM = globalThis.SIM ?? {}
  const rng = board.rng
  const top = SIM.dealMin ?? 5
  const floor = SIM.floorMin ?? 1
  const matchMin = SIM.matchMin ?? 3
  const comp = SIM.dealComp ?? 0
  const near9 = 9 * (SIM.nearScale ?? 1)
  const order = [...board.pairs].sort(() => rng() - 0.5)
  const core = SIM.dealCore ?? false
  const ok = (e) => !board.used.has(e.word) && compSize(e) >= comp && (!core || inCore2(e))
  const placed = []
  const holes = new Set()
  for (const pair of order) {
    let entry = null
    const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < near9)
    if (near.length && rng() < 0.6) {
      const q = near[Math.floor(rng() * near.length)]
      const c = rng() < 0.5 ? q.entry.a : q.entry.b
      const options = (BY_CHAR.get(c) ?? []).filter((e) => ok(e) && degree(e) >= matchMin)
      if (options.length) entry = options[Math.floor(rng() * options.length)]
    }
    for (let k = top; !entry && k >= floor; k--) {
      const pool = LEXICON.filter((e) => ok(e) && degree(e) >= k)
      if (pool.length) entry = pool[Math.floor(rng() * pool.length)]
    }
    if (!entry) {
      holes.add(pair)
      continue
    }
    board.setWord(pair, entry)
    placed.push(pair)
  }
  if (holes.size) {
    board.pairs = board.pairs.filter((p) => !holes.has(p))
    board.pairs.forEach((p, id) => {
      p.id = id
      p.tiles.forEach((t, index) => {
        t.id = id * 2 + index
        t.pair = id
      })
    })
    board.tiles = board.pairs.flatMap((p) => p.tiles)
  }
  board.holes = holes.size
}
