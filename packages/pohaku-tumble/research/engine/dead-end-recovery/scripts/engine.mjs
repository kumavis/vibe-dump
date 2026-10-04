// Recovery-aware Board for the dead-end-recovery study.
//
// RBoard extends Jukugo's real Board (as patched by prepare.mjs) and adds:
//   freeExits(pair)   the number of single-block turns that the stock rules
//                     allow (target word not on the board, not the pair's
//                     previous word). A pair with 0 is FROZEN.
//   recover(pair, …)  one recovery move for a frozen pair, by kind:
//     back     return to the previous word (stock forbids it; the grammar does not)
//     unblock  turn a pair Q that is sitting on one of P's exit words, so the
//              word is free for P on the next beat (two ordinary turns)
//     dup      turn into a real word that is already shown elsewhere on the board
//     dt       "double tumble": two single-block turns in a row, through a real
//              intermediate word W1 (which, since P is frozen, is either on the
//              board elsewhere or P's previous word), landing on a fresh word W2
//     dtprev   double tumble whose intermediate must not be on the board (never a
//              transient duplicate) — on a frozen pair that means the previous word:
//              a back-step and an onward turn in one beat
//     redeal   lift both stones and drop a fresh word (not a tumble; reference)
//
// Every call that needs randomness uses Math.random, which the drivers seed.

export class CountSet {
  constructor() { this.m = new Map() }
  has(k) { return this.m.has(k) }
  add(k) { this.m.set(k, (this.m.get(k) ?? 0) + 1); return this }
  delete(k) {
    const c = this.m.get(k)
    if (!c) return false
    if (c === 1) this.m.delete(k)
    else this.m.set(k, c - 1)
    return true
  }
  count(k) { return this.m.get(k) ?? 0 }
  get size() { return this.m.size }
}

export function seedRandom(seed) {
  let a = seed >>> 0
  Math.random = () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export async function load(cfg) {
  globalThis.SIM = cfg
  globalThis.SIM_USED = CountSet
  const { Board, LINK_MAX } = await import('./.build/board.js')
  const lex = await import('./.build/lexicon.sim.js')
  const { LEXICON, turns, degree } = lex
  // dealMin "auto": the largest bound <= 5 that leaves at least one deal word per grid cell
  // (pool >= cols*rows guarantees the deal loop terminates; holes only make it easier)
  if (cfg.dealMin === 'auto') {
    const cells = (cfg.cols ?? 9) * (cfg.rows ?? 8)
    let k = 5
    while (k > 1 && LEXICON.filter((e) => degree(e) >= k).length < cells) k--
    cfg.dealMin = k
    cfg.dealMinAuto = k
  }

  class RBoard extends Board {
    prevOf(pair) { return pair.history.at(-1)?.word }

    freeExits(pair) {
      const prev = this.prevOf(pair)
      let n = 0
      for (const i of [0, 1]) for (const e of turns(pair.entry, i)) if (!this.used.has(e.word) && e.word !== prev) n++
      return n
    }

    nearTiles(pair, index) {
      const tile = pair.tiles[index]
      return this.tiles.filter((t) => t.pair !== pair.id && Math.hypot(t.x - tile.x, t.z - tile.z) <= LINK_MAX)
    }

    // chooseTurn's weight, generalised to a target that may change either or both blocks.
    weight(pair, entry, changed, linked, near) {
      let joins = false, breaks = false
      for (const index of changed) {
        const c = index === 0 ? entry.a : entry.b
        const old = pair.tiles[index].char
        if (near[index].some((t) => t.char === c)) joins = true
        if (near[index].some((t) => t.char === old)) breaks = true
      }
      let w = 1
      if (joins) w += linked < 0.5 ? 6 : 1.5
      if (breaks && linked > 0.55) w += 1.5
      if (entry.field !== pair.entry.field) w += 0.6
      w *= Math.min(1.5, 0.6 + degree(entry) / 20)
      if (globalThis.SIM?.recentW != null && pair.history.some((h) => h.word === entry.word)) w *= globalThis.SIM.recentW
      return w
    }

    sample(options) {
      if (!options.length) return null
      let r = Math.random() * options.reduce((s, o) => s + o.w, 0)
      for (const o of options) if ((r -= o.w) <= 0) return o
      return options.at(-1)
    }

    // Copies of `word` on other pairs, nearest first distance.
    nearestCopy(pair, word) {
      let d = Infinity
      for (const q of this.pairs) if (q !== pair && q.entry.word === word) d = Math.min(d, Math.hypot(q.x - pair.x, q.z - pair.z))
      return d
    }

    // Which recoveries exist for `pair` right now (ignores scheduler eligibility for unblock).
    coverage(pair, opts = {}) {
      const prev = this.prevOf(pair)
      const pe = pair.history.at(-1)
      const out = { back: false, unblock: false, dup: false, dupfar: false, dt: false, dtprev: false, deadEnd: false, prevOnly: false, boardOnly: false }
      // causes: deadEnd = the word's only neighbour is the previous word (or it has none);
      // prevOnly = previous word is a neighbour and every other neighbour is on the board;
      // boardOnly = every neighbour is on the board (the previous word is not a neighbour or is taken)
      {
        const all = [...turns(pair.entry, 0), ...turns(pair.entry, 1)]
        const others = all.filter((e) => e.word !== prev)
        const prevFree = !!pe && !this.used.has(prev) && all.some((e) => e.word === prev)
        if (!others.length) out.deadEnd = true
        else if (prevFree) out.prevOnly = true
        else out.boardOnly = true
      }
      out.back = !!pe && !this.used.has(prev) && turnsTo(pair.entry, pe)
      for (const i of [0, 1]) {
        for (const e of turns(pair.entry, i)) {
          if (e.word === prev) continue
          if (this.used.has(e.word)) {
            out.unblock = true
            out.dup = true
            if (this.nearestCopy(pair, e.word) >= (opts.dupFar ?? 12)) out.dupfar = true
          }
        }
        for (const w1 of turns(pair.entry, i)) {
          for (const w2 of turns(w1, 1 - i)) {
            if (this.used.has(w2.word) || w2.word === pair.entry.word) continue
            out.dt = true
            if (!this.used.has(w1.word)) out.dtprev = true
          }
        }
      }
      return out
    }

    // One recovery move of `kind` for frozen `pair`, or null.
    // ctx.eligible(q): may the scheduler turn pair q this beat (for unblock).
    recover(pair, kind, ctx = {}) {
      const linked = this.linkedFraction()
      const prev = this.prevOf(pair)
      const near = [this.nearTiles(pair, 0), this.nearTiles(pair, 1)]
      if (kind === 'back') {
        const pe = pair.history.at(-1)
        if (!pe || this.used.has(pe.word)) return null
        const index = pe.a !== pair.entry.a ? 0 : 1
        if (!turnsTo(pair.entry, pe)) return null
        return { kind, steps: [{ pair, choice: { index, entry: pe } }] }
      }
      if (kind === 'unblock') {
        const cands = []
        for (const i of [0, 1]) {
          for (const e of turns(pair.entry, i)) {
            if (e.word === prev || !this.used.has(e.word)) continue
            for (const q of this.pairs) {
              if (q === pair || q.entry.word !== e.word) continue
              if (ctx.eligible && !ctx.eligible(q)) continue
              cands.push(q)
            }
          }
        }
        // shuffle, take the first blocker that can itself turn
        for (let k = cands.length - 1; k > 0; k--) {
          const j = Math.floor(Math.random() * (k + 1))
          ;[cands[k], cands[j]] = [cands[j], cands[k]]
        }
        for (const q of cands) {
          const choice = this.chooseTurn(q)
          if (choice) return { kind, steps: [{ pair: q, choice }], handoff: pair }
        }
        return null
      }
      if (kind === 'dup') {
        const far = ctx.dupFar ?? 0
        const options = []
        for (const index of [0, 1]) {
          for (const entry of turns(pair.entry, index)) {
            if (entry.word === prev) continue
            if (this.used.has(entry.word) && this.nearestCopy(pair, entry.word) < far) continue
            options.push({ index, entry, w: this.weight(pair, entry, [index], linked, near) })
          }
        }
        const o = this.sample(options)
        return o ? { kind, steps: [{ pair, choice: { index: o.index, entry: o.entry } }] } : null
      }
      if (kind === 'dt' || kind === 'dtprev') {
        const options = []
        for (const i of [0, 1]) {
          for (const w1 of turns(pair.entry, i)) {
            // dtprev: the intermediate may never be a word shown elsewhere — so, on a frozen pair, it is the previous word, free
            if (kind === 'dtprev' && this.used.has(w1.word)) continue
            for (const w2 of turns(w1, 1 - i)) {
              if (this.used.has(w2.word) || w2.word === pair.entry.word) continue
              options.push({ i, w1, w2, w: this.weight(pair, w2, [0, 1], linked, near) })
            }
          }
        }
        const o = this.sample(options)
        if (!o) return null
        return {
          kind,
          transientDup: this.used.has(o.w1.word),
          steps: [
            { pair, choice: { index: o.i, entry: o.w1 } },
            { pair, choice: { index: 1 - o.i, entry: o.w2 } },
          ],
        }
      }
      if (kind === 'redeal') {
        const min = ctx.redealMin ?? 2
        const options = []
        for (const entry of LEXICON) {
          if (this.used.has(entry.word) || entry.word === pair.entry.word || entry.word === prev) continue
          if (degree(entry) < min) continue
          options.push({ entry, w: this.weight(pair, entry, [0, 1], linked, near) })
        }
        const o = this.sample(options)
        return o ? { kind, steps: [{ pair, choice: { index: -1, entry: o.entry } }] } : null
      }
      throw new Error('unknown recovery ' + kind)
    }
  }

  // Is `to` one single-block turn away from `from`?
  function turnsTo(from, to) {
    return (from.a === to.a) !== (from.b === to.b)
  }

  return { RBoard, LINK_MAX, ...lex }
}

export function quantile(xs, q) {
  if (!xs.length) return 0
  const s = [...xs].sort((a, b) => a - b)
  return s[Math.min(s.length - 1, Math.floor(q * s.length))]
}
