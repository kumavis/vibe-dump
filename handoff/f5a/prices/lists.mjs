// usage: node lists.mjs <packageDir>: classic list and preset costs at each
// mission's prices, and what binds each race's Random lists (army-sim's bindOf)
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
const DIR = process.argv[2]
const load = (f) => import(pathToFileURL(join(DIR, f)).href)
const A = await load('core/army.js')
const { RACES } = await load('data/schema.js')
const { MISSIONS } = await load('data/mission.js')
const counts = (t) => [...t].map(Number)
function bindOf(race, rules) {
  const free = { ...rules, points: Infinity }
  let points = 0
  const spent = []
  for (let seed = 1; seed <= 1000; seed++) {
    const c = A.autoList(race, rules, seed)
    spent.push(A.listCost(race, c, rules))
    if (race.roster.some((_, k) => A.checkList(race, free, c.map((x, j) => x + (j === k ? 1 : 0))) === null)) points++
  }
  spent.sort((x, y) => x - y)
  return `${points} by points; spent p10 ${spent[100]}, median ${spent[500]}, ${spent[0]}-${spent[999]}`
}
for (const r of Object.values(RACES)) {
  const out = [`${r.key}: classic ${A.listCost(r, counts(r.armies.classic), MISSIONS.classic.list)}`]
  for (const m of ['field', 'grand', 'powder']) {
    const ms = MISSIONS[m], t = r.armies[ms.army]
    out.push(`${m} preset ${t} ${A.listCost(r, counts(t), ms.list)} ${A.checkList(r, ms.list, counts(t)) ?? 'legal'}`)
  }
  console.log(out.join('; '))
  for (const m of ['classic', 'field', 'grand', 'keg', 'powder']) if (MISSIONS[m]) console.log(`   ${m}: ${bindOf(r, MISSIONS[m].list)}`)
}
