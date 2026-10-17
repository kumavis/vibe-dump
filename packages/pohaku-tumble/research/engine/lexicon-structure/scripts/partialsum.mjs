// partialsum.mjs — average the 3 draws of each (order, pass rate, lookups, grid) from results-partial.jsonl
// -> partial.tsv: confirmed words (mean |2-core|), stuck, repeat, linked, and how many draws are GOOD.
import fs from 'node:fs'
import { good } from './verdict.mjs'
const here = new URL('.', import.meta.url).pathname
const rows = fs.readFileSync(here + 'results-partial.jsonl', 'utf8').trim().split('\n').map(JSON.parse)
const g = new Map()
for (const r of rows) { const k = [r.order, r.size, r.grid].join('|'); if (!g.has(k)) g.set(k, []); g.get(k).push(r) }
const out = [['order_pass', 'lookups', 'grid', 'core2', 'stall', 'stuck', 'repeat', 'linked', 'goodDraws'].join('\t')]
const avg = (l, k) => (l.reduce((s, r) => s + r[k], 0) / l.length)
for (const [k, l] of [...g.entries()].sort((a, b) => a[0].localeCompare(b[0], 'en', { numeric: true }))) {
  const [o, n, grid] = k.split('|')
  out.push([o, n, grid, avg(l, 'lexicon').toFixed(0), avg(l, 'stallRate').toFixed(3), avg(l, 'stuck').toFixed(3), avg(l, 'repeatRate').toFixed(3), avg(l, 'linked').toFixed(3), `${l.filter(good).length}/${l.length}`].join('\t'))
}
fs.writeFileSync(here + 'partial.tsv', out.join('\n') + '\n')
console.log(out.join('\n'))
