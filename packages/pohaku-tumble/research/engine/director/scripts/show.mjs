// show.mjs — print selected columns of a results JSONL as an aligned table.
//   node show.mjs <file.jsonl> [filter-substring] [cols,comma,separated]
import { readFileSync } from 'node:fs'
const [file, filt = '', colArg] = process.argv.slice(2)
const cols = (colArg ?? 'variant,lexName,grid,view,dealt,pairs,visible,beatsLost,lostEmpty,frozen,frozenVis,dead,noteEarly,noteZero,linked,linkedVis,repeatRate,bounceRate,top20,top20rate,still60,turnsPerMin,frozen@60m').split(',')
const rows = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse).filter((r) => JSON.stringify(r).includes(filt))
const w = cols.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)))
console.log(cols.map((c, i) => c.padEnd(w[i])).join(' '))
for (const r of rows) console.log(cols.map((c, i) => String(r[c] ?? '').padEnd(w[i])).join(' '))
