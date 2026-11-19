// pkg with no switch == orig, battle for battle (final trace lines); and each switch runs a few battles
const [A, B] = process.argv.slice(2)
const ca = await import(A + '/core/index.js'), cb = await import(B + '/core/index.js')
const { RACES } = await import(A + '/data/schema.js'), { MISSIONS } = await import(A + '/data/mission.js')
let same = 0, n = 0
for (const [mission, set] of [['classic', 'classic'], ['classic', 'fortified'], ['field', 'fortified']]) for (let i = 0; i < 5; i++) {
  const seats = [['insect', 'bird'], ['squirrel', 'insect'], ['serpent', 'bird'], ['squirrel', 'serpent'], ['bird', 'insect']][i].map((r, k) => ({ race: r, ctrl: 'ai', army: ca.army.listText(ca.army.autoList(RACES[r], MISSIONS[mission].list, 31 + i * 2 + k)) }))
  const s = { board: 900 + i, dice: 77 + i, mission, terrain: set, seats }
  const g1 = ca.createMatch(s), g2 = cb.createMatch(s)
  n++; if (g1.journal.trace.at(-1) === g2.journal.trace.at(-1)) same++
}
console.log(`TS_X=${process.env.TS_X ?? ''}: identical ${same} of ${n}`)
