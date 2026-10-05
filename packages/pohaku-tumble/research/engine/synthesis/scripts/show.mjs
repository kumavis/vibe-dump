// Pretty-print a results TSV: node show.mjs file.tsv [engine-regex] [lex-regex]
import { readFileSync } from 'node:fs'
const [f, er = '.', lr = '.'] = process.argv.slice(2)
const [head, ...lines] = readFileSync(f, 'utf8').trim().split('\n')
const cols = head.split('\t')
const rows = lines.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v]))).filter((r) => new RegExp(er).test(r.engine) && new RegExp(lr).test(r.lex))
const show = ['engine', 'lex', 'grid', 'pairs', 'playable', 'linkMax', 'dealt', 'stallRate', 'stuck', 'stuckStrict', 'repeatRate', 'bounce', 'linked', 'seenAll', 'noFresh', 'GOOD', 'JUKUGO_LIKE']
const w = show.map((c) => Math.max(c.length, ...rows.map((r) => String(r[c] ?? '').length)))
console.log(show.map((c, i) => c.padEnd(w[i])).join(' '))
for (const r of rows) console.log(show.map((c, i) => String(r[c] ?? '').padEnd(w[i])).join(' '))
