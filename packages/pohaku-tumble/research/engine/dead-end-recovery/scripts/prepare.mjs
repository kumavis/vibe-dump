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
// dead-end-recovery additions (this copy only):
// SIM.linkMax: LINK_MAX (Jukugo 11.5) — scaled up on smaller grids so links keep the same reach in cells
board = patch(board, 'export const LINK_MAX = 11.5', 'export const LINK_MAX = globalThis.SIM?.linkMax ?? 11.5')
// SIM.dealNear: the deal's "nearby" radius for neighbour matching (Jukugo 9), scaled with linkMax
board = patch(board, 'Math.hypot(q.x - pair.x, q.z - pair.z) < 9)', 'Math.hypot(q.x - pair.x, q.z - pair.z) < (globalThis.SIM?.dealNear ?? 9))')
// SIM_USED: a counting set, so a word shown twice (duplicate recovery) is not freed when one copy leaves
board = patch(board, 'this.used = new Set()', 'this.used = new (globalThis.SIM_USED ?? Set)()')
// SIM.recentW: multiply the weight of a turn back into a word the pair showed in its last 6 (not a recovery; a chooseTurn tweak)
board = patch(board, '        w *= Math.min(1.5, 0.6 + degree(entry) / 20)\n', '        w *= Math.min(1.5, 0.6 + degree(entry) / 20)\n        if (globalThis.SIM?.recentW != null && pair.history.some((h) => h.word === entry.word)) w *= globalThis.SIM.recentW\n')
writeFileSync(join(out, 'board.js'), board)

let field = readFileSync(join(src, 'field.js'), 'utf8')
field = patch(field, '  const cols = 9\n  const rows = 8\n', '  const cols = globalThis.SIM?.cols ?? 9\n  const rows = globalThis.SIM?.rows ?? 8\n')
field = patch(field, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = globalThis.SIM?.horizontalOnly ? (rng(), 'h') : rng() < 0.3 ? 'v' : 'h'")
field = patch(field, '  const d = (1 + GAP[dir]) / 2', '  const d = ((globalThis.SIM?.slab ?? 1) + GAP[dir]) / 2')
writeFileSync(join(out, 'field.js'), field)
copyFileSync(join(here, 'lexicon.sim.js'), join(out, 'lexicon.sim.js'))
writeFileSync(join(out, 'package.json'), '{ "type": "module", "private": true }\n')
