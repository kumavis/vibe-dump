// Copy Jukugo Tumble's real Board and floor layout into sim/.build/ and patch
// them for the simulation: the lexicon comes from lexicon.sim.js, the grid,
// word direction and block width come from globalThis.SIM, and the deal loop
// throws DEAL_HANG instead of spinning forever when its pool runs dry.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = 'packages/jukugo-tumble/src'
const out = join(here, '.build')
mkdirSync(out, { recursive: true })

function patch(text, from, to) {
  if (!text.includes(from)) throw new Error(`prepare: expected text not found — Jukugo changed?\n${from}`)
  return text.replace(from, to)
}

let board = readFileSync(join(src, 'board.js'), 'utf8')
board = patch(board, "from './lexicon.js'", "from './lexicon.sim.js'")
// SIM.dealMin / SIM.matchMin: the deal's degree bounds (Jukugo: 5 for the pool, 3 for a neighbour match)
board = patch(board, 'const pool = LEXICON.filter((e) => degree(e) >= 5)', 'const pool = LEXICON.filter((e) => degree(e) >= (globalThis.SIM?.dealMin ?? 5))')
board = patch(board, "!this.used.has(e.word) && degree(e) >= 3)", "!this.used.has(e.word) && degree(e) >= (globalThis.SIM?.matchMin ?? 3))")
board = patch(
  board,
  '      while (!entry || this.used.has(entry.word)) entry = pool[Math.floor(rng() * pool.length)]',
  "      let guard = 0\n      while (!entry || this.used.has(entry.word)) {\n        if (++guard > 20000) throw new Error('DEAL_HANG')\n        entry = pool[Math.floor(rng() * pool.length)]\n      }",
)
board = patch(
  board,
  '        if (this.used.has(entry.word) || entry.word === prev) continue',
  '        if (entry.word === prev) continue\n' +
    '        if (this.used.has(entry.word)) {\n' +
    '          // SIM.dupFar: allow a word already on the board if every copy is at least that far away\n' +
    '          const far = globalThis.SIM?.dupFar\n' +
    '          if (!far || this.pairs.some((q) => q !== pair && q.entry.word === entry.word && Math.hypot(q.x - pair.x, q.z - pair.z) < far)) continue\n' +
    '        }',
)
writeFileSync(join(out, 'board.js'), board)

let field = readFileSync(join(src, 'field.js'), 'utf8')
field = patch(field, '  const cols = 9\n  const rows = 8\n', '  const cols = globalThis.SIM?.cols ?? 9\n  const rows = globalThis.SIM?.rows ?? 8\n')
field = patch(field, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = globalThis.SIM?.horizontalOnly ? (rng(), 'h') : rng() < 0.3 ? 'v' : 'h'")
field = patch(field, '  const d = (1 + GAP[dir]) / 2', '  const d = ((globalThis.SIM?.slab ?? 1) + GAP[dir]) / 2')
// repro: SIM.scaleFloor scales the floor with the grid so a cell stays 4.67 x 3.625 (the "s" grids, e.g. 5x4s)
field = patch(field, 'export const BOUNDS = { x0: -21, x1: 21, z0: -14.5, z1: 14.5 }',
  'const _sx = globalThis.SIM?.scaleFloor ? (globalThis.SIM?.cols ?? 9) / 9 : 1\nconst _sz = globalThis.SIM?.scaleFloor ? (globalThis.SIM?.rows ?? 8) / 8 : 1\n' +
  'export const BOUNDS = { x0: -21 * _sx, x1: 21 * _sx, z0: -14.5 * _sz, z1: 14.5 * _sz }')
writeFileSync(join(out, 'field.js'), field)
copyFileSync(join(here, 'lexicon.sim.js'), join(out, 'lexicon.sim.js'))
writeFileSync(join(out, 'package.json'), '{ "type": "module", "private": true }\n')

// ════════════════════════════════════════════════════════════════════════
// repro: POHAKU engine, written from the engine spec only, into .build/pohaku/
// (same Jukugo sources, patched; lexicon from lexicon.pohaku.js)
// ════════════════════════════════════════════════════════════════════════
const pout = join(here, '.build', 'pohaku')
mkdirSync(pout, { recursive: true })
let pb = readFileSync(join(src, 'board.js'), 'utf8')
pb = patch(pb, "import { LEXICON, BY_CHAR, FIELDS, turns, degree } from './lexicon.js'",
  "import { LEXICON, BY_CHAR, FIELDS, turns, degree, compSize, LINK_MAX_RULE } from './lexicon.pohaku.js'")
pb = patch(pb, 'export const LINK_MAX = 11.5', 'export const LINK_MAX = LINK_MAX_RULE')
// PARAMETERS (overridable from globalThis.SIM for sensitivity checks; defaults are the spec's)
pb = patch(pb, 'export class Board {', `const P_ = () => globalThis.SIM ?? {}
const HISTORY = () => P_().history ?? 6
const REST = () => P_().rest ?? 6
const REACH_DEPTH = () => P_().reachDepth ?? 3
const REACH_CAP = () => P_().reachCap ?? 40
const DEAD_W = () => P_().deadW ?? 0.1
const NO_RETURN = () => !!P_().noReturn // POHAKU -ret

export class Board {`)
pb = patch(pb, '      entry: null,\n      history: [],', '      entry: null,\n      history: [],\n      turnedAt: -Infinity,')
// DEAL
const dealFrom = pb.indexOf('  deal() {')
const dealTo = pb.indexOf('  setWord(pair, entry) {')
if (dealFrom < 0 || dealTo < 0) throw new Error('prepare: deal() not found')
pb = pb.slice(0, dealFrom) + `  deal() {
    const rng = this.rng
    const order = [...this.pairs].sort(() => rng() - 0.5)
    const matchMin = globalThis.SIM?.matchMin ?? 3
    const compMin = globalThis.SIM?.compMin ?? 12
    const ok = (e) => !this.used.has(e.word) && compSize(e) >= compMin
    // pools by degree bound, 5 down to 2 (filtered for used at pick time)
    const pools = [5, 4, 3, 2].map((k) => LEXICON.filter((e) => compSize(e) >= compMin && degree(e) >= k))
    const placed = []
    const holes = new Set()
    for (const pair of order) {
      let entry = null
      const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < 9)
      if (near.length && rng() < 0.6) {
        const q = near[Math.floor(rng() * near.length)]
        const c = rng() < 0.5 ? q.entry.a : q.entry.b
        const options = (BY_CHAR.get(c) ?? []).filter((e) => ok(e) && degree(e) >= matchMin)
        if (options.length) entry = options[Math.floor(rng() * options.length)]
      }
      if (!entry) {
        for (const pool of pools) {
          const live = pool.filter((e) => !this.used.has(e.word))
          if (live.length) {
            entry = live[Math.floor(rng() * live.length)]
            break
          }
        }
      }
      if (!entry) {
        holes.add(pair)
        continue
      }
      this.setWord(pair, entry)
      placed.push(pair)
    }
    this.holes = holes.size
    if (holes.size) {
      // drop the holes and renumber before any scene object exists
      this.pairs = this.pairs.filter((p) => !holes.has(p))
      this.pairs.forEach((p, id) => {
        p.id = id
        p.tiles.forEach((t, index) => {
          t.id = id * 2 + index
          t.pair = id
        })
      })
      this.tiles = this.pairs.flatMap((p) => p.tiles)
    }
  }

` + pb.slice(dealTo)
pb = patch(pb, '      if (pair.history.length > 6) pair.history.shift()', '      if (pair.history.length > HISTORY()) pair.history.shift()')
// TURN
const ctFrom = pb.indexOf('  chooseTurn(pair) {')
const ctTo = pb.indexOf('  turn(pair, choice) {')
if (ctFrom < 0 || ctTo < 0) throw new Error('prepare: chooseTurn() not found')
pb = pb.slice(0, ctFrom) + `  // Candidates: every turn onto a word not on the board, tiered
  //   0 fresh, 1 in the pair's last-6 history, 2 the immediately previous word (only once rested >= 6 s).
  candidates(pair, now) {
    const prev = pair.history.at(-1)?.word
    const rested = !NO_RETURN() && now - pair.turnedAt >= REST()
    const hist = new Set(pair.history.map((e) => e.word))
    const out = []
    for (const index of [0, 1]) {
      for (const entry of turns(pair.entry, index)) {
        if (this.used.has(entry.word)) continue
        let tier
        if (entry.word === prev) {
          if (!rested) continue
          tier = 2
        } else if (hist.has(entry.word)) tier = 1
        else tier = 0
        out.push({ index, entry, tier })
      }
    }
    return out
  }

  canTurn(pair, now) {
    return this.candidates(pair, now).length > 0
  }

  // N = distinct words reachable from entry within REACH_DEPTH turns, walking only through words that are
  // not on any pair and not in {history, current word, entry}; capped at REACH_CAP.
  reach(pair, entry) {
    const cap = REACH_CAP()
    const block = new Set(this.used)
    for (const e of pair.history) block.add(e.word)
    block.add(pair.entry.word)
    block.add(entry.word)
    const seen = new Set()
    let frontier = [entry]
    for (let d = 0; d < REACH_DEPTH() && frontier.length; d++) {
      const next = []
      for (const e of frontier) {
        for (const i of [0, 1]) {
          for (const f of turns(e, i)) {
            if (block.has(f.word) || seen.has(f.word)) continue
            seen.add(f.word)
            if (seen.size >= cap) return cap
            next.push(f)
          }
        }
      }
      frontier = next
    }
    return seen.size
  }

  chooseTurn(pair, now, linked = this.linkedFraction()) {
    const cands = this.candidates(pair, now)
    if (!cands.length) return null
    const minTier = Math.min(...cands.map((c) => c.tier))
    const keep = cands.filter((c) => c.tier === minTier)
    const nearOf = [0, 1].map((index) => {
      const tile = pair.tiles[index]
      const near = this.tiles.filter((t) => t.pair !== pair.id && Math.hypot(t.x - tile.x, t.z - tile.z) <= LINK_MAX)
      return { near, breaks: near.some((t) => t.char === tile.char) }
    })
    const options = []
    for (const { index, entry, tier } of keep) {
      const { near, breaks } = nearOf[index]
      const c = index === 0 ? entry.a : entry.b
      const joins = near.some((t) => t.char === c)
      let w = 1
      if (joins) w += linked < 0.5 ? 6 : linked > 0.55 ? 0 : 1.5
      if (breaks && linked > 0.55) w += 3
      if (entry.field !== pair.entry.field) w += 0.6
      const N = this.reach(pair, entry)
      w *= N === 0 ? DEAD_W() : N
      options.push({ index, entry, w, tier })
    }
    let r = Math.random() * options.reduce((s, o) => s + o.w, 0)
    for (const o of options) if ((r -= o.w) <= 0) return o
    return options.at(-1)
  }

` + pb.slice(ctTo)
pb = patch(pb, '  turn(pair, choice) {\n    this.setWord(pair, choice.entry)', '  turn(pair, choice, now) {\n    this.setWord(pair, choice.entry)\n    pair.turnedAt = now')
writeFileSync(join(pout, 'board.js'), pb)

let pf = readFileSync(join(src, 'field.js'), 'utf8')
// BOUNDS scale with the grid: a cell stays 4.67 x 3.625
pf = patch(pf, 'export const BOUNDS = { x0: -21, x1: 21, z0: -14.5, z1: 14.5 }',
  'const _c = globalThis.SIM?.cols ?? 9\nconst _r = globalThis.SIM?.rows ?? 8\n' +
  'export const BOUNDS = { x0: (-21 * _c) / 9, x1: (21 * _c) / 9, z0: (-14.5 * _r) / 8, z1: (14.5 * _r) / 8 }')
pf = patch(pf, '  const cols = 9\n  const rows = 8\n', '  const cols = _c\n  const rows = _r\n')
pf = patch(pf, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = (rng(), 'h')")
pf = patch(pf, '  const d = (1 + GAP[dir]) / 2', '  const d = (1.5 + GAP[dir]) / 2')
// layoutFeatures: xs scale by x1/21, zs by z1/14.5 (not used by the sim's metrics, done for fidelity)
pf = patch(pf, '  const xs = [-15, -5, 5, 15]\n  const zs = [-6.5, 6.5]', '  const xs = [-15, -5, 5, 15].map((v) => (v * BOUNDS.x1) / 21)\n  const zs = [-6.5, 6.5].map((v) => (v * BOUNDS.z1) / 14.5)')
writeFileSync(join(pout, 'field.js'), pf)
copyFileSync(join(here, 'lexicon.pohaku.js'), join(pout, 'lexicon.pohaku.js'))
writeFileSync(join(pout, 'package.json'), '{ "type": "module", "private": true }\n')
