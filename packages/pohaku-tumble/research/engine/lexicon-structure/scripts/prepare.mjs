// Copy Jukugo Tumble's real Board and floor layout into sim/.build/ and patch
// them for the simulation: the lexicon comes from lexicon.sim.js, the grid,
// word direction and block width come from globalThis.SIM, and the deal loop
// throws DEAL_HANG instead of spinning forever when its pool runs dry.
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const src = 'packages/jukugo-tumble/src'
const out = join(here, process.env.BUILD ?? '.build') // BUILD: alternative output dir (lexicon-structure)
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
// SIM.linkMax (added by lexicon-structure): override LINK_MAX (11.5), the longest line two same-root
// blocks run to each other; used by chooseTurn's link steering and by desiredLinks/linkedFraction.
board = patch(board, 'export const LINK_MAX = 11.5', 'export const LINK_MAX = globalThis.SIM?.linkMax ?? 11.5')
writeFileSync(join(out, 'board.js'), board)

let field = readFileSync(join(src, 'field.js'), 'utf8')
field = patch(field, '  const cols = 9\n  const rows = 8\n', '  const cols = globalThis.SIM?.cols ?? 9\n  const rows = globalThis.SIM?.rows ?? 8\n')
field = patch(field, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = globalThis.SIM?.horizontalOnly ? (rng(), 'h') : rng() < 0.3 ? 'v' : 'h'")
field = patch(field, '  const d = (1 + GAP[dir]) / 2', '  const d = ((globalThis.SIM?.slab ?? 1) + GAP[dir]) / 2')
// SIM.keepSpacing (added by lexicon-structure): a smaller grid keeps the 9x8 cell size (4.67 x 3.625)
// instead of spreading over the fixed floor, i.e. the floor shrinks with the pair count and link
// density per pair stays as on the full board.
field = patch(field, '  const cw = (BOUNDS.x1 - BOUNDS.x0) / cols\n  const ch = (BOUNDS.z1 - BOUNDS.z0) / rows\n',
  '  const cw = globalThis.SIM?.keepSpacing ? (BOUNDS.x1 - BOUNDS.x0) / 9 : (BOUNDS.x1 - BOUNDS.x0) / cols\n' +
  '  const ch = globalThis.SIM?.keepSpacing ? (BOUNDS.z1 - BOUNDS.z0) / 8 : (BOUNDS.z1 - BOUNDS.z0) / rows\n' +
  '  const X0 = globalThis.SIM?.keepSpacing ? -cols * cw / 2 : BOUNDS.x0\n' +
  '  const Z0 = globalThis.SIM?.keepSpacing ? -rows * ch / 2 : BOUNDS.z0\n')
field = patch(field, '      const x = BOUNDS.x0 + (i + 0.5) * cw', '      const x = X0 + (i + 0.5) * cw')
field = patch(field, '      const z = BOUNDS.z0 + (j + 0.5) * ch', '      const z = Z0 + (j + 0.5) * ch')
writeFileSync(join(out, 'field.js'), field)
copyFileSync(join(here, 'lexicon.sim.js'), join(out, 'lexicon.sim.js'))
writeFileSync(join(out, 'package.json'), '{ "type": "module", "private": true }\n')
