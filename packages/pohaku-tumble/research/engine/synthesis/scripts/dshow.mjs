// Pretty-print a Director-model TSV: node dshow.mjs file.tsv [engine-regex] [lex-regex] [grid-regex]
import { readFileSync } from 'node:fs'
const [f, er = '.', lr = '.', gr = '.'] = process.argv.slice(2)
const [head, ...lines] = readFileSync(f, 'utf8').trim().split('\n')
const cols = head.split('\t')
const rows = lines.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v]))).filter((r) => new RegExp(er).test(r.engine) && new RegExp(lr).test(r.lex) && new RegExp(gr).test(r.grid))
const show = ['engine', 'lex', 'grid', 'pairs', 'dealt', 'beatsLost', 'stuck', 'frozenVis', 'repeatRate', 'bounceRate', 'linkedVis', 'linkedAll', 'noteEarly', 'still60', 'top20', 'turnsPerMin', 'GOOD', 'JUKUGO_LIKE']
const w = show.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)))
console.log(show.map((c, i) => c.padEnd(w[i])).join(' '))
for (const r of rows) console.log(show.map((c, i) => String(r[c] ?? '').padEnd(w[i])).join(' '))
