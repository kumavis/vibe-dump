// Lookahead variants of Board.chooseTurn, switched on by globalThis.SIM.la.
// prepare.mjs copies this into .build/ and hooks it into the patched board.js:
//   chooseTurn(pair) { if (SIM.la) return chooseTurnLA(this, pair, SIM.la); ...stock... }
//
// The linked-fraction steering (joins / breaks / field bonus) is copied verbatim
// from Jukugo's chooseTurn (la.steer optionally strengthens its high side). What
// changes is (a) which targets are legal — the history rule — and (b) the
// lookahead factors that replace Jukugo's static `min(1.5, 0.6 + degree/20)`.
// The deal-time lookahead (component-aware deal) is at the bottom of the file.
//
//   la = {
//     hardK:   1,      // never return to any of the last k words (Jukugo: 1 = the previous word)
//     cool:    null,   // ...unless the pair has rested >= cool global turns since its last turn
//     softK:   0,      // words in the last softK (and not hard-excluded) are legal but weighted by softPen
//     softPen: 0.25,
//     strict:  false,  // consider soft (history) targets only when there is no fresh one
//     fallback: false, // nothing legal → allow a hard-excluded word (a return) rather than stall
//     fallbackPen: 1,
//     keepDeg: false,  // keep Jukugo's static-degree factor as well
//     live:  { alpha, cap, dead },   // × min(live, cap)^alpha, or × dead when live = 0
//     look2: { beta, cap, dead },    // × min(R, cap)^beta, R = next moves that are not themselves dead ends
//     fresh: { gamma, cap, dead },   // × min(F, cap)^gamma, F = next moves to words not in the pair's history
//     court: 0.0,      // × Π_q (1 − court/|opts(q)|) over other pairs q that could also turn into this word
//     coolCredit: 0,   // live() counts a word that is excluded now but returns after the cooldown as this much
//     reach: { depth, gamma, cap, dead }, // × min(N, cap)^gamma, N = fresh free words within depth turns
//     steer: null,     // { hi, hiJoin, hiBreak, hiJoinMul, lo, loJoinMul } — see the steering block below
//   }
//
// live(c): how many turns the pair could make right after landing on c, given the
// words on the board and the history rule as it will stand then (c's
// predecessor — the word the pair shows now — becomes its "previous word").

import { LEXICON, turns, degree } from './lexicon.sim.js'
import { LINK_MAX } from './board.js'

const HIST = 6

// 1 = the previous word, 2 = the one before, …; 0 = not in the history
function recency(hist, word) {
  for (let i = hist.length - 1, r = 1; i >= 0; i--, r++) if (hist[i].word === word) return r
  return 0
}

// Tier of a target for a pair with history `hist` that has rested `rested` turns:
// 0 fresh, 1 legal but soft-penalised, 2 hard-excluded.
function tier(la, hist, word, rested) {
  const r = recency(hist, word)
  if (!r) return 0
  if (r <= (la.hardK ?? 1)) return la.cool != null && rested >= la.cool ? 1 : 2
  return r <= (la.softK ?? 0) ? 1 : 0
}

// Targets reachable from `entry` for a pair whose history would be `hist`, right
// after a turn (rested = 0), with `isUsed` saying which words other pairs hold.
// Returns [count of tier<=1 targets, count of fresh targets, count of hard-excluded-but-coolable targets].
function nextCounts(la, entry, hist, isUsed) {
  let legal = 0
  let fresh = 0
  let later = 0
  for (const i of [0, 1]) {
    for (const x of turns(entry, i)) {
      if (isUsed(x.word)) continue
      const t = tier(la, hist, x.word, 0)
      if (t < 2) legal++
      if (t === 0 && !recency(hist, x.word)) fresh++
      if (t === 2 && la.cool != null) later++
    }
  }
  return [legal, fresh, later]
}

function pushHist(hist, entry) {
  const h = [...hist, entry]
  if (h.length > HIST) h.shift()
  return h
}

const factor = (n, spec, expKey) => (n <= 0 ? spec.dead ?? 0.05 : Math.min(n, spec.cap ?? 99) ** (spec[expKey] ?? 1))

// Candidate targets for a pair under the engine's history rule, each tagged with its tier.
export function candidates(board, pair, la) {
  const hist = pair.history
  const rested = board.turnCount - (pair.lastTurnAt ?? -1e9)
  const out = []
  for (const index of [0, 1]) {
    for (const entry of turns(pair.entry, index)) {
      if (board.used.has(entry.word)) continue
      out.push({ index, entry, tier: tier(la, hist, entry.word, rested) })
    }
  }
  const ok = out.filter((o) => o.tier < 2)
  // la.strict: a word from the history is considered only when no fresh target exists
  if (la.strict && ok.some((o) => o.tier === 0)) return ok.filter((o) => o.tier === 0)
  if (ok.length || !la.fallback) return ok
  return out.map((o) => ({ ...o, fallback: true }))
}

// Courtesy: how badly each free word is needed by other pairs as an escape.
function courtesyMap(board, pair, la) {
  const m = new Map()
  for (const q of board.pairs) {
    if (q === pair) continue
    const opts = candidates(board, q, la)
    if (!opts.length) continue
    const f = 1 - la.court / opts.length
    for (const o of opts) m.set(o.entry.word, (m.get(o.entry.word) ?? 1) * Math.max(0.02, f))
  }
  return m
}

export function weighted(board, pair, la, linked = board.linkedFraction()) {
  const cands = candidates(board, pair, la)
  if (!cands.length) return []
  const cur = pair.entry
  const isUsed = (w) => w !== cur.word && board.used.has(w)
  const histAfter = pushHist(pair.history, cur)
  const court = la.court ? courtesyMap(board, pair, la) : null
  const near = [0, 1].map((index) => {
    const tile = pair.tiles[index]
    return board.tiles.filter((t) => t.pair !== pair.id && Math.hypot(t.x - tile.x, t.z - tile.z) <= LINK_MAX)
  })
  const options = []
  for (const { index, entry, tier: t, fallback } of cands) {
    // ── Jukugo's steering, verbatim ──
    const tile = pair.tiles[index]
    const breaks = near[index].some((u) => u.char === tile.char)
    const c = index === 0 ? entry.a : entry.b
    const joins = near[index].some((u) => u.char === c)
    let w = 1
    const st = la.steer
    if (!st) {
      if (joins) w += linked < 0.5 ? 6 : 1.5
      if (breaks && linked > 0.55) w += 1.5
    } else {
      // la.steer: same shape, with the high side made a real push down:
      // above `hi` a join earns hiJoin (Jukugo 1.5) and a break hiBreak (Jukugo 1.5)
      if (joins) w += linked < 0.5 ? 6 : linked > (st.hi ?? 0.55) ? st.hiJoin ?? 1.5 : 1.5
      if (breaks && linked > (st.hi ?? 0.55)) w += st.hiBreak ?? 1.5
      // multiplicative push, so the steering keeps its say against the lookahead factors
      if (joins && linked > (st.hi ?? 0.55)) w *= st.hiJoinMul ?? 1
      if (joins && linked < (st.lo ?? 0.45)) w *= st.loJoinMul ?? 1
    }
    if (entry.field !== cur.field) w += 0.6
    if (la.keepDeg) w *= Math.min(1.5, 0.6 + degree(entry) / 20)
    // ── lookahead ──
    if (la.live || la.fresh) {
      const [legal, fresh, later] = nextCounts(la, entry, histAfter, isUsed)
      if (la.live) w *= factor(legal + (la.coolCredit ?? 0) * later, la.live, 'alpha')
      if (la.fresh) w *= factor(fresh, la.fresh, 'gamma')
    }
    if (la.look2) {
      // R = next targets x (from entry) that are not themselves dead ends one step further
      const hist2 = pushHist(histAfter, entry)
      let R = 0
      for (const i of [0, 1]) {
        for (const x of turns(entry, i)) {
          if (isUsed(x.word) || tier(la, histAfter, x.word, 0) === 2) continue
          const isUsed2 = (wd) => wd === entry.word ? false : isUsed(wd)
          if (nextCounts(la, x, hist2, isUsed2)[0] > 0) R++
        }
      }
      w *= factor(R, la.look2, 'beta')
    }
    if (la.reach) {
      // fresh horizon: distinct words within `depth` turns of the target that are free and not in
      // the pair's history (walking only through such words) — steers away from cul-de-sacs
      const { depth = 3, gamma = 1, cap = 30, dead = 0.1 } = la.reach
      const block = new Set(histAfter.map((e) => e.word))
      block.add(entry.word)
      let frontier = [entry]
      let n = 0
      search: for (let d = 0; d < depth && frontier.length; d++) {
        const nextF = []
        for (const x of frontier) {
          for (const i of [0, 1]) {
            for (const y of turns(x, i)) {
              if (block.has(y.word) || isUsed(y.word)) continue
              block.add(y.word)
              nextF.push(y)
              if (++n >= cap) break search // the factor is capped, so stop counting
            }
          }
        }
        frontier = nextF
      }
      w *= n === 0 ? dead : Math.min(n, cap) ** gamma
    }
    if (t === 1) w *= la.softPen ?? 0.25
    if (fallback) w *= la.fallbackPen ?? 1
    if (court) w *= court.get(entry.word) ?? 1
    options.push({ index, entry, w })
  }
  return options
}

export function chooseTurnLA(board, pair, la) {
  const options = weighted(board, pair, la)
  const total = options.reduce((s, o) => s + o.w, 0)
  if (!options.length || total <= 0) return null
  let r = Math.random() * total
  for (const o of options) if ((r -= o.w) <= 0) return o
  return options.at(-1)
}

// Would chooseTurn return a turn for this pair right now? (deterministic part)
export function canTurnLA(board, pair, la) {
  return weighted(board, pair, la, 0.5).some((o) => o.w > 0)
}

// ── deal-time lookahead ──
// A turn never leaves its connected component of the turn graph, so the
// component a word is dealt into is the pair's whole world for the run.
//   SIM.dealComp:    deal only words whose component has at least this many words
//   SIM.dealDensity: and at most this many pairs per word of that component
let COMP = null
export function compOf(entry) {
  if (!COMP) {
    COMP = new Map()
    for (const e of LEXICON) {
      if (COMP.has(e.word)) continue
      const c = { size: 0, id: COMP.size }
      const stack = [e]
      COMP.set(e.word, c)
      while (stack.length) {
        const x = stack.pop()
        c.size++
        for (const i of [0, 1]) for (const y of turns(x, i)) if (!COMP.has(y.word)) { COMP.set(y.word, c); stack.push(y) }
      }
    }
  }
  return COMP.get(entry.word)
}

export function dealOK(entry) {
  return compOf(entry).size >= (globalThis.SIM?.dealComp ?? 0)
}

export function dealRoom(board, entry) {
  const dens = globalThis.SIM?.dealDensity
  if (!dens) return true
  const c = compOf(entry)
  let n = 0
  for (const p of board.pairs) if (p.entry && compOf(p.entry) === c) n++
  return n + 1 <= dens * c.size
}
