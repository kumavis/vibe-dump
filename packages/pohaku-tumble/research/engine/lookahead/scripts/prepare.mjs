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
// ── lookahead study additions ──
// SIM.linkScale: multiply LINK_MAX (and the deal's 9-unit "nearby" radius) — the
// stand-in for scaling the floor with the pair count on smaller grids.
board = patch(board, 'export const LINK_MAX = 11.5', 'export const LINK_MAX = 11.5 * (globalThis.SIM?.linkScale ?? 1)')
board = patch(board, 'Math.hypot(q.x - pair.x, q.z - pair.z) < 9)', 'Math.hypot(q.x - pair.x, q.z - pair.z) < 9 * (globalThis.SIM?.linkScale ?? 1))')
// SIM.la: route chooseTurn through lookahead.js (stock code untouched when unset)
board = patch(board, "import { layoutPairs", "import { chooseTurnLA, canTurnLA } from './lookahead.js'\nimport { layoutPairs")
board = patch(board, '  chooseTurn(pair) {\n', '  chooseTurn(pair) {\n    if (globalThis.SIM?.la) return chooseTurnLA(this, pair, globalThis.SIM.la)\n')
// SIM.dealComp / SIM.dealDensity: deal-time lookahead (lookahead.js dealOK / dealRoom)
board = patch(board, "import { chooseTurnLA, canTurnLA } from './lookahead.js'", "import { chooseTurnLA, canTurnLA, dealOK, dealRoom } from './lookahead.js'")
board = patch(board, 'degree(e) >= (globalThis.SIM?.dealMin ?? 5))', 'degree(e) >= (globalThis.SIM?.dealMin ?? 5) && dealOK(e))')
board = patch(board, 'degree(e) >= (globalThis.SIM?.matchMin ?? 3))', 'degree(e) >= (globalThis.SIM?.matchMin ?? 3) && dealOK(e) && dealRoom(this, e))')
board = patch(board, 'while (!entry || this.used.has(entry.word)) {', 'while (!entry || this.used.has(entry.word) || !dealRoom(this, entry)) {')
// a clock for the cooldown rule: the global turn count at each pair's last turn
board = patch(board, '    this.setWord(pair, choice.entry)\n    this.turnCount++\n', '    this.setWord(pair, choice.entry)\n    this.turnCount++\n    pair.lastTurnAt = this.turnCount\n')
board += `
// Can this pair turn right now under the engine's rules? (sim metric: stuck)
Board.prototype.canTurn = function (pair) {
  if (globalThis.SIM?.la) return canTurnLA(this, pair, globalThis.SIM.la)
  const prev = pair.history.at(-1)?.word
  return [0, 1].some((i) => turns(pair.entry, i).some((e) => !this.used.has(e.word) && e.word !== prev))
}
`
writeFileSync(join(out, 'board.js'), board)

let field = readFileSync(join(src, 'field.js'), 'utf8')
field = patch(field, '  const cols = 9\n  const rows = 8\n', '  const cols = globalThis.SIM?.cols ?? 9\n  const rows = globalThis.SIM?.rows ?? 8\n')
field = patch(field, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = globalThis.SIM?.horizontalOnly ? (rng(), 'h') : rng() < 0.3 ? 'v' : 'h'")
field = patch(field, '  const d = (1 + GAP[dir]) / 2', '  const d = ((globalThis.SIM?.slab ?? 1) + GAP[dir]) / 2')
writeFileSync(join(out, 'field.js'), field)
copyFileSync(join(here, 'lexicon.sim.js'), join(out, 'lexicon.sim.js'))
copyFileSync(join(here, 'lookahead.js'), join(out, 'lookahead.js'))
writeFileSync(join(out, 'package.json'), '{ "type": "module", "private": true }\n')
