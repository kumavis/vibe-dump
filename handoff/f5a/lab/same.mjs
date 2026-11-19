// does a non-null `out` (the probe's) change any battle? compare final trace lines with and without it
const D = '/home/user/vibe-dump-wt/f5a/packages/tails-and-scales/'
const core = await import(D + 'core/index.js')
const { RACES } = await import(D + 'data/schema.js')
const { MISSIONS } = await import(D + 'data/mission.js')
const A = core.army
let same = 0, n = 0
for (const [mission, set] of [['classic','classic'],['classic','fortified'],['field','fortified']]) for (let i = 0; i < 6; i++) {
  const rules = MISSIONS[mission].list
  const seats = [['insect','bird'],['squirrel','bird'],['serpent','insect']][i%3].map((r, k) => ({ race: r, ctrl: 'ai', army: A.listText(A.autoList(RACES[r], rules, 31 + i * 2 + k)) }))
  const s = { board: 900 + i, dice: 77 + i, mission, terrain: set, seats }
  const g1 = core.createMatch(s), g2 = core.createMatch(s, { out: { push() {} }, onTrace: () => {} })
  n++; if (g1.journal.trace.at(-1) === g2.journal.trace.at(-1)) same++
}
console.log(`identical ${same} of ${n}`)
