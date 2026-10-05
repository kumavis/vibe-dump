// One line per sim2 result with verdict. usage: node list.mjs file.jsonl [filter]
import { readFileSync } from 'node:fs'
import { verdict } from './judge.mjs'
const [file, filt] = process.argv.slice(2)
const rows = readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse).filter((r) => r.driver === 'sim2' && (!filt || JSON.stringify(r).includes(filt)))
const f = (x) => (x == null ? '  -  ' : (+x).toFixed(3))
const ord = (r) => (r.lexFile.startsWith('curve-') ? r.lexFile.split('-')[1].slice(0, 4) : r.lexFile.slice(0, 8))
rows.sort((a, b) => ord(a).localeCompare(ord(b)) || a.lexicon - b.lexicon || (a.cfg.gridName ?? '').localeCompare(b.cfg.gridName ?? '') || a.tag.localeCompare(b.tag))
for (const r of rows) console.log([ord(r), r.lexicon, (r.cfg.gridName ?? r.grid).padEnd(5), r.tag.padEnd(40), verdict(r).padEnd(2), 'dealt', r.dealt, 'lost', f(r.stallRate), 'stuck', f(r.stuck), 'long', f(r.stuckLong), 'eff', f(r.stuckEff), 'rep', f(r.repeatRate), 'lnk', f(r.linked), 'seen', f(r.seenFrac), 'tpb', f(r.tumblesPerBeat)].join(' '))
