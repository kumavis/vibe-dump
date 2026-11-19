// army-sim's bindOf, for the scratch copy (TS_X as set): what binds 1,000 Random lists of each new race
const D = process.argv[2]
const core = await import(D + '/core/index.js'), { RACES } = await import(D + '/data/schema.js'), { MISSIONS } = await import(D + '/data/mission.js')
const A = core.army
for (const m of ['classic', 'field']) for (const r of ['insect', 'bird']) {
  const race = RACES[r], rules = MISSIONS[m].list, free = { ...rules, points: Infinity }
  let points = 0; const spent = []
  for (let seed = 1; seed <= 1000; seed++) {
    const c = A.autoList(race, rules, seed)
    spent.push(A.listCost(race, c, rules))
    if (race.roster.some((_, k) => A.checkList(race, free, c.map((x, j) => x + (j === k ? 1 : 0))) === null)) points++
  }
  spent.sort((x, y) => x - y)
  console.log(`${m} ${race.short}: the points bind ${points} of 1,000; spent median ${spent[500]}, ${spent[0]}-${spent[999]}; classic list ${A.listCost(race, race.roster.map((k) => race.army.filter((x) => x === k).length))}`)
}
