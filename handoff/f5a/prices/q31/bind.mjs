// usage: node bind.mjs <race> <mission> unit=cost...: what binds the race's
// Random lists at those costs (army-sim's bindOf), and why when not points
const D = '/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/f5a/prices/q31/base/packages/tails-and-scales/'
const A = await import(D + 'core/army.js')
const { RACES } = await import(D + 'data/schema.js')
const { MISSIONS } = await import(D + 'data/mission.js')
const [rk, mk, ...kv] = process.argv.slice(2)
const r0 = RACES[rk]
const units = { ...r0.units }
for (const s of kv) { const [k, v] = s.split('='); units[k] = { ...units[k], cost: Number(v) } }
const race = { ...r0, units }
const rules = MISSIONS[mk].list, free = { ...rules, points: Infinity }
let points = 0; const why = {}, spent = [], classic = A.listCost(race, [...r0.armies?.classic ?? '112111'].map(Number), rules)
for (let seed = 1; seed <= 1000; seed++) {
  const c = A.autoList(race, rules, seed)
  spent.push(A.listCost(race, c, rules))
  if (race.roster.some((_, k) => A.checkList(race, free, c.map((x, j) => x + (j === k ? 1 : 0))) === null)) points++
  else { const w = A.checkList(race, free, c.map((x, j) => x + (j === 0 ? 0 : 0)).map((x, j) => x + (j === 3 ? 1 : 0))) ; const k = (race.roster.map((_, k) => A.checkList(race, free, c.map((x, j) => x + (j === k ? 1 : 0))).replace(/\d+ /, '').slice(0, 30))).join(' | '); why[k] = (why[k] ?? 0) + 1 }
}
spent.sort((a, b) => a - b)
console.log(`${rk} ${mk}: ${points} by points; spent median ${spent[500]}, p10 ${spent[100]}; classic 112111 ${A.listCost(race, [1,1,2,1,1,1], rules)}`)
for (const [k, n] of Object.entries(why).sort((a, b) => b[1] - a[1]).slice(0, 4)) console.log(`   ${n}: ${k}`)
