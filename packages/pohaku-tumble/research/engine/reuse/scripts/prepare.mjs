// Copy Jukugo Tumble's real Board and floor layout into .build/ and patch them
// for the simulation. Derived from packages/pohaku-tumble/research/roots/sim/
// prepare.mjs; this copy (family "reuse") adds the reuse knobs below.
//
// Inherited patches: lexicon from lexicon.sim.js; grid / direction / slab from
// globalThis.SIM; the deal loop throws DEAL_HANG instead of spinning forever;
// SIM.dealMin / SIM.matchMin (deal degree bounds, Jukugo 5 / 3).
//
// Reuse knobs (all default to Jukugo's behaviour when absent):
//   SIM.dupFar      a word already on the board may be used again (by a turn)
//                   when every other copy is at least this many units away
//                   (pair centre to pair centre). Absent/0 = never (Jukugo).
//   SIM.dealDupFar  same rule for the opening deal. Defaults to SIM.dupFar.
//   SIM.dupBox      [w, h]: with dupFar/dealDupFar set (any truthy value), a
//                   copy blocks only if |dx| <= w and |dz| <= h — i.e. only if
//                   both copies could be inside one w x h camera view.
//   SIM.dupW        weight multiplier on a turn option that would duplicate a
//                   word on the board (soft preference for unique words). 1.
//   SIM.prevAfter   a pair may return to the word it showed just before its
//                   current one once at least this many ticks (director beats,
//                   about 2 s each) have passed since it last turned.
//                   Absent = never (Jukugo). 0 = always.
//   SIM.recentW     weight multiplier on a turn option that is one of the
//                   pair's last 6 words (soft anti-repeat). 1.
//   SIM.banK        how many of the pair's most recent words are hard-banned
//                   (Jukugo: 1, the previous word). They come back once the
//                   pair has rested SIM.prevAfter ticks.
//   SIM.tiers       lexicographic fallback: draw only from the best non-empty
//                   tier — 0 fresh word, 1 distant duplicate, 2 a word from the
//                   pair's last 6 other than the previous one, 3 the previous
//                   word. Jukugo's weights apply unchanged within the tier.
//   SIM.linkMax     override LINK_MAX (11.5). SIM.nearMax: override the deal's
//                   "nearby" radius (9).
//   SIM.scaleBounds shrink the floor with the grid so pair spacing stays
//                   Jukugo's (cell 4.67 x 3.625) instead of spreading out.
//
// Board gains options(pair) — the legal, weighted turn list chooseTurn draws
// from — so the sim can count stuck pairs under exactly the rules in force.
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

// ── deal ──
board = patch(board, 'const pool = LEXICON.filter((e) => degree(e) >= 5)', 'const pool = LEXICON.filter((e) => degree(e) >= (globalThis.SIM?.dealMin ?? 5))')
board = patch(
  board,
  'const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < 9)',
  'const near = placed.filter((q) => Math.hypot(q.x - pair.x, q.z - pair.z) < (globalThis.SIM?.nearMax ?? 9))',
)
board = patch(
  board,
  "!this.used.has(e.word) && degree(e) >= 3)",
  "this.canPlace(e, pair, globalThis.SIM?.dealDupFar ?? globalThis.SIM?.dupFar) && degree(e) >= (globalThis.SIM?.matchMin ?? 3))",
)
board = patch(
  board,
  '      while (!entry || this.used.has(entry.word)) entry = pool[Math.floor(rng() * pool.length)]',
  "      let guard = 0\n" +
    "      while (!entry || !this.canPlace(entry, pair, globalThis.SIM?.dealDupFar ?? globalThis.SIM?.dupFar)) {\n" +
    "        if (++guard > 20000) throw new Error('DEAL_HANG')\n" +
    "        entry = pool[Math.floor(rng() * pool.length)]\n" +
    "      }",
)
// used: word -> count (a word may sit on the board more than once under dupFar)
board = patch(
  board,
  '  setWord(pair, entry) {\n    if (pair.entry) {\n      this.used.delete(pair.entry.word)',
  '  // Whether `entry` may go on `pair`: not on the board at all, or (reuse) every\n' +
    '  // other copy at least `far` away.\n' +
    '  canPlace(entry, pair, far) {\n' +
    '    if (!this.used.has(entry.word)) return true\n' +
    '    if (!far) return false\n' +
    '    // SIM.dupBox [w, h]: instead of a radius, block a copy only if both could sit in one w x h view\n' +
    '    const box = globalThis.SIM?.dupBox\n' +
    '    const blocks = box ? (q) => Math.abs(q.x - pair.x) <= box[0] && Math.abs(q.z - pair.z) <= box[1] : (q) => Math.hypot(q.x - pair.x, q.z - pair.z) < far\n' +
    '    return !this.pairs.some((q) => q !== pair && q.entry && q.entry.word === entry.word && blocks(q))\n' +
    '  }\n\n' +
    '  setWord(pair, entry) {\n    if (pair.entry) {\n      const n = this.used.get(pair.entry.word) - 1\n      if (n > 0) this.used.set(pair.entry.word, n)\n      else this.used.delete(pair.entry.word)',
)
board = patch(board, '    this.used = new Set()', '    this.used = new Map()\n    this.clock = 0')
board = patch(board, '    this.used.add(entry.word)', '    this.used.set(entry.word, (this.used.get(entry.word) ?? 0) + 1)\n    pair.turnedAt = this.clock')

// ── chooseTurn → options + draw ──
board = patch(
  board,
  '  chooseTurn(pair) {\n    const linked = this.linkedFraction()\n    const prev = pair.history.at(-1)?.word\n    const options = []',
  '  chooseTurn(pair) {\n    const options = this.options(pair)\n    if (!options.length) return null\n' +
    '    let r = Math.random() * options.reduce((s, o) => s + o.w, 0)\n' +
    '    for (const o of options) if ((r -= o.w) <= 0) return o\n' +
    '    return options.at(-1)\n  }\n\n' +
    '  options(pair, linked = this.linkedFraction(), rested = false) {\n' +
    '    const S = globalThis.SIM ?? {}\n' +
    '    const prev = pair.history.at(-1)?.word\n' +
    '    // reuse: banned recent words (Jukugo: just the previous one) come back once\n' +
    '    // the pair has rested SIM.prevAfter ticks (rested = true: assume it has)\n' +
    '    const prevOk = rested || (S.prevAfter != null && this.clock - (pair.turnedAt ?? -1e9) >= S.prevAfter)\n' +
    '    const banned = new Set(pair.history.slice(-(S.banK ?? 1)).map((e) => e.word))\n' +
    '    const recent = new Set(pair.history.map((e) => e.word))\n' +
    '    const options = []',
)
board = patch(
  board,
  '        if (this.used.has(entry.word) || entry.word === prev) continue',
  '        if (banned.has(entry.word) && !prevOk) continue\n' +
    '        const dup = this.used.has(entry.word)\n' +
    '        if (dup && !this.canPlace(entry, pair, S.dupFar)) continue',
)
board = patch(
  board,
  '        w *= Math.min(1.5, 0.6 + degree(entry) / 20)\n        options.push({ index, entry, w })\n      }\n    }\n' +
    '    if (!options.length) return null\n' +
    '    let r = Math.random() * options.reduce((s, o) => s + o.w, 0)\n' +
    '    for (const o of options) if ((r -= o.w) <= 0) return o\n' +
    '    return options.at(-1)\n  }',
  '        w *= Math.min(1.5, 0.6 + degree(entry) / 20)\n' +
    '        if (dup) w *= S.dupW ?? 1\n' +
    '        if (recent.has(entry.word)) w *= S.recentW ?? 1\n' +
    '        const tier = entry.word === prev ? 3 : recent.has(entry.word) ? 2 : dup ? 1 : 0\n' +
    '        options.push({ index, entry, w, dup, tier })\n      }\n    }\n' +
    '    if (S.tiers && options.length) {\n' +
    '      const best = Math.min(...options.map((o) => o.tier))\n' +
    '      return options.filter((o) => o.tier === best)\n' +
    '    }\n' +
    '    return options\n  }',
)
writeFileSync(join(out, 'board.js'), board)

let field = readFileSync(join(src, 'field.js'), 'utf8')
field = patch(field, '  const cols = 9\n  const rows = 8\n', '  const cols = globalThis.SIM?.cols ?? 9\n  const rows = globalThis.SIM?.rows ?? 8\n  const B = floorBounds()\n')
field = patch(field, '  const cw = (BOUNDS.x1 - BOUNDS.x0) / cols\n  const ch = (BOUNDS.z1 - BOUNDS.z0) / rows', '  const cw = (B.x1 - B.x0) / cols\n  const ch = (B.z1 - B.z0) / rows')
field = patch(field, '      const x = BOUNDS.x0 + (i + 0.5) * cw', '      const x = B.x0 + (i + 0.5) * cw')
field = patch(field, '      const z = BOUNDS.z0 + (j + 0.5) * ch', '      const z = B.z0 + (j + 0.5) * ch')
field = patch(field, "      const dir = rng() < 0.3 ? 'v' : 'h'", "      const dir = globalThis.SIM?.horizontalOnly ? (rng(), 'h') : rng() < 0.3 ? 'v' : 'h'")
field = patch(field, '  const d = (1 + GAP[dir]) / 2', '  const d = ((globalThis.SIM?.slab ?? 1) + GAP[dir]) / 2')
field +=
  '\n// SIM.scaleBounds: a smaller grid on a proportionally smaller floor, so pairs keep\n' +
  "// Jukugo's spacing (and links their reach) instead of spreading out.\n" +
  'export function floorBounds() {\n' +
  '  const S = globalThis.SIM ?? {}\n' +
  '  if (!S.scaleBounds) return BOUNDS\n' +
  '  const sx = (S.cols ?? 9) / 9\n' +
  '  const sz = (S.rows ?? 8) / 8\n' +
  '  return { x0: BOUNDS.x0 * sx, x1: BOUNDS.x1 * sx, z0: BOUNDS.z0 * sz, z1: BOUNDS.z1 * sz }\n' +
  '}\n'
writeFileSync(join(out, 'field.js'), field)
copyFileSync(join(here, 'lexicon.sim.js'), join(out, 'lexicon.sim.js'))
writeFileSync(join(out, 'package.json'), '{ "type": "module", "private": true }\n')
