// Copy Jukugo Tumble's real Board and floor layout into .build/ and patch them
// for the simulation. Synthesis copy of research/roots/sim/prepare.mjs:
//  - absolute src path; the lexicon comes from lexicon.sim.js;
//  - grid, word direction and slab from globalThis.SIM (as the original);
//  - the stock deal keeps its knobs dealMin / matchMin and throws DEAL_HANG
//    instead of spinning forever (as the original); dupFar is dropped;
//  - SIM.autoGrid: grid sized from the words in play (see the field.js patch);
//  - SIM.scaleFloor: BOUNDS shrink with the grid (cols/9, rows/8), so a cell
//    stays Jukugo's 4.67 × 3.625 and LINK_MAX / the deal radius need no change;
//  - SIM.linkMax: a number, or 'auto' (lexicon.sim.js linkAuto, SIM.linkC0);
//  - SIM.engine: chooseTurn goes through pohaku.js (stock code untouched when unset);
//  - SIM.deal = 'fill': pohaku.js dealFill (never hangs);
//  - Board.turn records pair.turnedAt = board.now (seconds; the sim sets board.now);
//  - Board.prototype.canTurn(pair, assumeRested) for the stuck metrics.
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
board = patch(board, "import { LEXICON, BY_CHAR, FIELDS, turns, degree } from './lexicon.sim.js'",
  "import { LEXICON, BY_CHAR, FIELDS, turns, degree, linkAuto } from './lexicon.sim.js'\nimport { chooseTurnP, canTurnP, dealFill } from './pohaku.js'")
board = patch(board, 'export const LINK_MAX = 11.5',
  "export const LINK_MAX = globalThis.SIM?.linkMax === 'auto' ? linkAuto(globalThis.SIM?.linkC0, globalThis.SIM?.linkFloor) : (globalThis.SIM?.linkMax ?? 11.5)")
// stock deal: knobs + a guard instead of an endless loop
board = patch(board, '  deal() {\n', "  deal() {\n    if (globalThis.SIM?.deal === 'fill') return dealFill(this)\n")
board = patch(board, 'const pool = LEXICON.filter((e) => degree(e) >= 5)', 'const pool = LEXICON.filter((e) => degree(e) >= (globalThis.SIM?.dealMin ?? 5))')
board = patch(board, "!this.used.has(e.word) && degree(e) >= 3)", "!this.used.has(e.word) && degree(e) >= (globalThis.SIM?.matchMin ?? 3))")
board = patch(
  board,
  '      while (!entry || this.used.has(entry.word)) entry = pool[Math.floor(rng() * pool.length)]',
  "      let guard = 0\n      while (!entry || this.used.has(entry.word)) {\n        if (++guard > 20000) throw new Error('DEAL_HANG')\n        entry = pool[Math.floor(rng() * pool.length)]\n      }",
)
board = patch(board, '  chooseTurn(pair) {\n', '  chooseTurn(pair) {\n    if (globalThis.SIM?.engine) return chooseTurnP(this, pair, globalThis.SIM.engine)\n')
board = patch(board, '  turn(pair, choice) {\n', '  turn(pair, choice) {\n    ;(this.leftAt ??= new Map()).set(pair.entry.word, this.now ?? 0)\n')
board = patch(board, '    this.setWord(pair, choice.entry)\n    this.turnCount++\n',
  '    this.setWord(pair, choice.entry)\n    this.turnCount++\n    pair.turnedAt = this.now ?? this.turnCount\n')
board += `
// Can this pair turn right now (or, assumeRested, once it has rested) under the
// rules in force? Stock: a free word that is not the previous one.
Board.prototype.canTurn = function (pair, assumeRested = false) {
  const E = globalThis.SIM?.engine
  if (E) return canTurnP(this, pair, E, assumeRested)
  const prev = pair.history.at(-1)?.word
  return [0, 1].some((i) => turns(pair.entry, i).some((e) => !this.used.has(e.word) && e.word !== prev))
}
`
writeFileSync(join(out, 'board.js'), board)

let field = readFileSync(join(src, 'field.js'), 'utf8')
// SIM.autoGrid = { div, min, max }: size the board from the words in play —
// target pairs = clamp(round(|2-core| / div), min, max), cells = target / 0.92
// (layout holes), rows = round(sqrt(cells / 1.125)), cols = round(cells / rows)
// (Jukugo's 9:8 grid), floor scaled. Writes SIM.cols / SIM.rows / SIM.scaleFloor.
field = patch(field, '// The floor plan:', `import { CORE2_SIZE } from './lexicon.sim.js'
{
  const A = globalThis.SIM?.autoGrid
  if (A) {
    const target = Math.max(A.min ?? 18, Math.min(A.max ?? 65, Math.round(CORE2_SIZE / (A.div ?? 8))))
    const cells = target / 0.92
    const rows = Math.max(2, Math.round(Math.sqrt(cells / 1.125)))
    globalThis.SIM.rows = rows
    globalThis.SIM.cols = Math.max(2, Math.round(cells / rows))
    globalThis.SIM.scaleFloor = globalThis.SIM.cols * rows < 72
  }
}
// The floor plan:`)
field = patch(field, 'export const BOUNDS = { x0: -21, x1: 21, z0: -14.5, z1: 14.5 }',
  'const SX = globalThis.SIM?.scaleFloor ? (globalThis.SIM?.cols ?? 9) / 9 : 1\n' +
  'const SZ = globalThis.SIM?.scaleFloor ? (globalThis.SIM?.rows ?? 8) / 8 : 1\n' +
  'export const BOUNDS = { x0: -21 * SX, x1: 21 * SX, z0: -14.5 * SZ, z1: 14.5 * SZ }')
field = patch(field, '  const cols = 9\n  const rows = 8\n', '  const cols = globalThis.SIM?.cols ?? 9\n  const rows = globalThis.SIM?.rows ?? 8\n')
field = patch(field, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = globalThis.SIM?.horizontalOnly ? (rng(), 'h') : rng() < 0.3 ? 'v' : 'h'")
field = patch(field, '  const d = (1 + GAP[dir]) / 2', '  const d = ((globalThis.SIM?.slab ?? 1) + GAP[dir]) / 2')
writeFileSync(join(out, 'field.js'), field)
copyFileSync(join(here, 'lexicon.sim.js'), join(out, 'lexicon.sim.js'))
copyFileSync(join(here, 'pohaku.js'), join(out, 'pohaku.js'))
writeFileSync(join(out, 'package.json'), '{ "type": "module", "private": true }\n')
