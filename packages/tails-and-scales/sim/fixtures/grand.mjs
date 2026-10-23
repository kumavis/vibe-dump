// The Grand fixture (DESIGN §4.2.9; S0 to F8b): the core playing a Grand
// battle before it has one. The scale work (S0-S3, V1, scale-bench) lands
// before the core has a Grand board (F8a gives it `G.board`, F8b the
// `grand` mission), so its Grand checks run on a copy of the working tree's
// consensus code (core/, data/, match/) with text patches, the way the
// prototypes built theirs:
//
//   the board    80×56, deployment 14" deep, 7 rounds, and the grand
//                mission's nine objectives (BOARD and ROUNDS in
//                core/rules.js, classic's objectives in data/mission.js)
//   the terrain  the classic set at area-scaled density: pairs [24, 12],
//                attempts ×4 (core/terrain/sets.js)
//   the armies   each race's `army` becomes its ×3 list (the classic list
//                three times over, in the race's roster order: 21 units),
//                or with `caps` its cap list (below)
//
// A cap list (§4.2.1) fields 24 units, or as many as 90 models allow, with
// every slot but Troops full (the grand list rules: Hero 3, Elite 4, Fast 4,
// Monster 3, Artillery 3, at most 7 of one unit), then Troops, the fewest
// models first, each up to 7: the Bushtails 23 units and 89 models, the
// Coil 24 and 84.
//
// Each patch is an exact substitution that must match exactly once, or the
// fixture refuses to build and names its anchor: a refactor of a patched
// line fails the check that wanted Grand, rather than quietly measuring
// classic. The copy is made fresh on every build, in sim/.fixtures/
// (gitignored; boundaries, flag-lint, hooks-inert and data-check never look
// in sim/).
//
//   import { buildGrand } from './fixtures/grand.mjs'
//   const { dir, lists } = await buildGrand({ caps })   the copy's
//                                        directory (import its core/index.js)
//                                        and each race's list: { list,
//                                        units, models }
//   node sim/fixtures/grand.mjs [--caps]   builds it and prints a Grand
//                                        battle's size and its cost
import { cpSync, rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'

const PKG = fileURLToPath(new URL('../..', import.meta.url))
export const FIXTURES = join(PKG, 'sim', '.fixtures')

export const GRAND = Object.freeze({
  board: { W: 80, H: 56, deploy: 14 },
  rounds: 7,
  objectives: [[0, 0], [-14, 14], [14, -14], [-14, -14], [14, 14], [-24, 0], [24, 0], [0, -20], [0, 20]],
  pairs: [24, 12],
  attempts: 4800,
  roles: { Hero: 3, Elite: 4, Fast: 4, Monster: 3, Artillery: 3 },
  units: 24,
  models: 90,
  perKind: 7,
})

// One exact substitution in file `f` of the copy, which must match once.
function patch(dir, f, from, to) {
  const p = join(dir, f)
  const text = readFileSync(p, 'utf8')
  const n = text.split(from).length - 1
  if (n !== 1) throw new Error(`the Grand fixture can't patch ${f}: its anchor ${JSON.stringify(from.slice(0, 80))} is there ${n} times, not once (a refactor moved it? sim/fixtures/grand.mjs)`)
  writeFileSync(p, text.replace(from, () => to))
}

// A race's roster as the fixture reads it: each unit of its classic army
// once, in the army's order (F11a's roster will name it; the classic
// counts follow from the army).
export function rosterOf(race) {
  const keys = [...new Set(race.army)]
  return keys.map((k) => ({ key: k, n: race.army.filter((x) => x === k).length, t: race.units[k] }))
}

// The ×3 army: the classic list three times over, in roster order.
export const tripleOf = (race) => rosterOf(race).flatMap(({ key, n }) => Array(n * 3).fill(key))

// The cap army: every slot but Troops full, then Troops, fewest models first.
export function capsOf(race) {
  const G_ = GRAND, roster = rosterOf(race)
  const count = new Map(roster.map((e) => [e.key, 0]))
  let units = 0, models = 0
  const take = (e, n) => {
    for (let i = 0; i < n && units < G_.units && models + e.t.models <= G_.models && count.get(e.key) < G_.perKind; i++) {
      count.set(e.key, count.get(e.key) + 1)
      units++
      models += e.t.models
    }
  }
  for (const [role, n] of Object.entries(G_.roles)) {
    let left = n
    for (const e of roster.filter((e) => e.t.role === role)) {
      const before = count.get(e.key)
      take(e, left)
      left -= count.get(e.key) - before
    }
  }
  const troops = roster.filter((e) => e.t.role === 'Troops').sort((a, b) => a.t.models - b.t.models)
  for (const e of troops) take(e, G_.perKind)
  const list = roster.flatMap((e) => Array(count.get(e.key)).fill(e.key))
  return { list, units, models }
}

// Builds the fixture (fresh): its directory and each race's list.
// `from`: another copy of the code to build it from (scale-bench's --dir).
export async function buildGrand({ caps = false, from = PKG } = {}) {
  const dir = join(FIXTURES, `${from === PKG ? '' : 'other-'}${caps ? 'grand-caps' : 'grand'}`)
  rmSync(dir, { recursive: true, force: true })
  mkdirSync(dir, { recursive: true })
  for (const d of ['core', 'data', 'match']) cpSync(join(from, d), join(dir, d), { recursive: true })
  // a package.json saying ESM, as the package's own does
  writeFileSync(join(dir, 'package.json'), JSON.stringify({ type: 'module', private: true }))
  const { board, rounds, objectives, pairs, attempts } = GRAND
  patch(dir, 'core/rules.js', 'export const BOARD = Object.freeze({ W: 40, H: 28, deploy: 8 })', `export const BOARD = Object.freeze({ W: ${board.W}, H: ${board.H}, deploy: ${board.deploy} })`)
  patch(dir, 'core/rules.js', 'export const ROUNDS = 5\n', `export const ROUNDS = ${rounds}\n`)
  patch(dir, 'data/mission.js', `    objectives: [
      { x: 0, z: 0 },
      { x: -9, z: 8 },
      { x: 9, z: -8 },
      { x: -9, z: -8 },
      { x: 9, z: 8 },
    ],`, `    objectives: [
${objectives.map(([x, z]) => `      { x: ${x}, z: ${z} },`).join('\n')}
    ],`)
  patch(dir, 'core/terrain/sets.js', '    pairs: [6, 3],\n    attempts: 1200,\n', `    pairs: [${pairs.join(', ')}],\n    attempts: ${attempts},\n`)
  return { dir, lists: await armies(dir, caps, from) }
}

// The armies, from the race data of the code the copy was made from (never
// the copy's own file: imported before its patch, the module cache would
// keep the classic army for the copy's core).
async function armies(dir, caps, from) {
  const out = {}
  for (const race of ['squirrel', 'serpent']) {
    const f = `data/races/${race}.js`
    const text = readFileSync(join(dir, f), 'utf8')
    const m = /\n {2}army: (\[[^\]]*\]),\n/.exec(text)
    if (!m) throw new Error(`the Grand fixture can't patch ${f}: no \`army: [...]\` line (a refactor moved it? sim/fixtures/grand.mjs)`)
    const def = (await import(pathToFileURL(join(from, f)).href)).default
    const r = { army: JSON.parse(m[1].replace(/'/g, '"')), units: def.units }
    const list = caps ? capsOf(r) : { list: tripleOf(r) }
    list.models ??= list.list.reduce((s, k) => s + r.units[k].models, 0)
    list.units ??= list.list.length
    patch(dir, f, m[0], `\n  army: ${JSON.stringify(list.list).replace(/"/g, "'").replace(/,/g, ', ')},\n`)
    out[race] = list
  }
  return out
}

// A Grand setup for the fixture's core: an AI battle on `board` with `dice`.
export const grandSetup = (board, dice) => ({ board, dice, seats: [{ race: 'squirrel', ctrl: 'ai' }, { race: 'serpent', ctrl: 'ai' }] })

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { values: a } = parseArgs({ options: { caps: { type: 'boolean' } } })
  const { dir, lists } = await buildGrand({ caps: !!a.caps })
  const core = await import(pathToFileURL(join(dir, 'core', 'index.js')).href)
  console.log(`Grand fixture (${a.caps ? 'cap lists' : '×3 presets'}) in ${dir}`)
  for (const [race, l] of Object.entries(lists)) console.log(`  ${race.padEnd(9)} ${l.units} units, ${l.models} models`)
  const t0 = performance.now()
  const G = core.createMatch(grandSetup(7, 11))
  const ms = performance.now() - t0
  console.log(`  a battle on board 7, dice 11: ${G.units.length} units, ${G.terrain.chunks.length} chunks, ${G.turn.stage === 'over' ? `over in round ${G.turn.round}` : G.turn.stage}, in ${ms.toFixed(0)} ms`)
}
