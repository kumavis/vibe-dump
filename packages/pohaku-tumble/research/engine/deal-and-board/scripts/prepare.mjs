// Copy Jukugo Tumble's real Board and floor layout into .build/ and patch them
// for the simulation. Same patches as research/roots/sim/prepare.mjs (lexicon
// from lexicon.sim.js; grid, word direction and block width from
// globalThis.SIM; dupFar), plus the deal-and-board knobs:
//
//   SIM.dealMode  'stock'    Jukugo's deal (throws DEAL_HANG when the pool runs dry)
//                 'fill'     draw from the unused part of the pool; when it is empty,
//                            step the degree bound down one at a time to SIM.floorMin
//                            (default 1); if even that is empty, leave a hole
//                 'holes'    draw from the unused pool; when it is empty, leave a hole
//                 'weighted' no hard bound: draw unused words with degree >= floorMin,
//                            weighted by degree^SIM.gamma (default 1)
//   SIM.dealMin / SIM.matchMin   the deal's degree bounds (Jukugo 5 / 3)
//   SIM.nearR     radius of the deal's "match a neighbour" (Jukugo 9)
//   SIM.matchP    chance the deal tries to match a neighbour (Jukugo 0.6)
//   SIM.linkMax   LINK_MAX (Jukugo 11.5)
//   SIM.bounds    BOUNDS (Jukugo {x0:-21,x1:21,z0:-14.5,z1:14.5})
//
// A hole is a pair the deal could not fill; it is dropped from the board and
// the remaining pairs are renumbered, exactly as a layout hole would be.
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
board = patch(board, 'export const LINK_MAX = 11.5', 'export const LINK_MAX = globalThis.SIM?.linkMax ?? 11.5')

// The whole deal() method, verbatim from Jukugo — replaced as one block so a
// change upstream fails loudly here.
const STOCK_DEAL = `  deal() {
    const rng = this.rng
    const order = [...this.pairs].sort(() => rng() - 0.5)
    const pool = LEXICON.filter((e) => degree(e) >= 5)
    const placed = []
    for (const pair of order) {
      let entry = null
      const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < 9)
      if (near.length && rng() < 0.6) {
        const q = near[Math.floor(rng() * near.length)]
        const c = rng() < 0.5 ? q.entry.a : q.entry.b
        const options = (BY_CHAR.get(c) ?? []).filter((e) => !this.used.has(e.word) && degree(e) >= 3)
        if (options.length) entry = options[Math.floor(rng() * options.length)]
      }
      while (!entry || this.used.has(entry.word)) entry = pool[Math.floor(rng() * pool.length)]
      this.setWord(pair, entry)
      placed.push(pair)
    }
  }
`
const NEW_DEAL = `  deal() {
    const S = globalThis.SIM ?? {}
    const mode = S.dealMode ?? 'stock'
    const dealMin = S.dealMin ?? 5
    const matchMin = S.matchMin ?? 3
    const floorMin = S.floorMin ?? 1
    const rng = this.rng
    const order = [...this.pairs].sort(() => rng() - 0.5)
    const pool = LEXICON.filter((e) => degree(e) >= dealMin)
    const placed = []
    const empty = []
    for (const pair of order) {
      let entry = null
      const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < (S.nearR ?? 9))
      if (near.length && rng() < (S.matchP ?? 0.6)) {
        const q = near[Math.floor(rng() * near.length)]
        const c = rng() < 0.5 ? q.entry.a : q.entry.b
        const options = (BY_CHAR.get(c) ?? []).filter((e) => !this.used.has(e.word) && degree(e) >= matchMin)
        if (options.length) entry = options[Math.floor(rng() * options.length)]
      }
      if (mode === 'stock') {
        let guard = 0
        while (!entry || this.used.has(entry.word)) {
          if (++guard > 20000) throw new Error('DEAL_HANG')
          entry = pool[Math.floor(rng() * pool.length)]
        }
      } else if (!entry && mode === 'weighted') {
        const free = LEXICON.filter((e) => degree(e) >= floorMin && !this.used.has(e.word))
        const w = free.map((e) => degree(e) ** (S.gamma ?? 1))
        let r = rng() * w.reduce((s, x) => s + x, 0)
        for (let i = 0; i < free.length && !entry; i++) if ((r -= w[i]) <= 0) entry = free[i]
        if (!entry && free.length) entry = free.at(-1)
      } else if (!entry) {
        let free = pool.filter((e) => !this.used.has(e.word))
        for (let d = dealMin - 1; !free.length && mode === 'fill' && d >= floorMin; d--)
          free = LEXICON.filter((e) => degree(e) >= d && !this.used.has(e.word))
        if (free.length) entry = free[Math.floor(rng() * free.length)]
      }
      if (!entry) {
        empty.push(pair)
        continue
      }
      this.setWord(pair, entry)
      placed.push(pair)
    }
    this.holes = empty.length
    if (empty.length) {
      const drop = new Set(empty)
      this.pairs = this.pairs.filter((p) => !drop.has(p))
      this.pairs.forEach((p, id) => {
        p.id = id
        p.tiles.forEach((t, index) => {
          t.pair = id
          t.id = id * 2 + index
        })
      })
      this.tiles = this.pairs.flatMap((p) => p.tiles)
    }
  }
`
board = patch(board, STOCK_DEAL, NEW_DEAL)
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
field = patch(field, 'export const BOUNDS = { x0: -21, x1: 21, z0: -14.5, z1: 14.5 }', 'export const BOUNDS = globalThis.SIM?.bounds ?? { x0: -21, x1: 21, z0: -14.5, z1: 14.5 }')
field = patch(field, '  const cols = 9\n  const rows = 8\n', '  const cols = globalThis.SIM?.cols ?? 9\n  const rows = globalThis.SIM?.rows ?? 8\n')
field = patch(field, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = globalThis.SIM?.horizontalOnly ? (rng(), 'h') : rng() < 0.3 ? 'v' : 'h'")
field = patch(field, '  const d = (1 + GAP[dir]) / 2', '  const d = ((globalThis.SIM?.slab ?? 1) + GAP[dir]) / 2')
writeFileSync(join(out, 'field.js'), field)
copyFileSync(join(here, 'lexicon.sim.js'), join(out, 'lexicon.sim.js'))
writeFileSync(join(out, 'package.json'), '{ "type": "module", "private": true }\n')
