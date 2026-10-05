// view.mjs <results.jsonl> [filter-js] — print rows as an aligned table with verdicts.
import fs from 'node:fs'
import { verdict, why } from './verdict.mjs'
const [file, filt] = process.argv.slice(2)
let rows = fs.readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse)
if (filt) rows = rows.filter(new Function('r', `return (${filt})`))
const cols = ['order', 'size', 'k', 'lexicon', 'engine', 'grid', 'pairs', 'occ', 'dealt', 'stallRate', 'stuck', 'stuckPerm', 'linked', 'repeatRate', 'seenFrac', 'V', 'why']
const t = [cols, ...rows.map((r) => cols.map((c) => String(c === 'V' ? verdict(r) : c === 'why' ? why(r) : r[c] ?? '')))]
const w = cols.map((_, i) => Math.max(...t.map((r) => r[i].length)))
for (const r of t) console.log(r.map((c, i) => c.padStart(w[i])).join(' '))
