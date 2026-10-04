// Pretty-print a results TSV: node show.mjs results/s1.tsv [col,col,...] [regex on row]
import { readFileSync } from 'node:fs'
const [file, colsArg, filt] = process.argv.slice(2)
const lines = readFileSync(file, 'utf8').trim().split('\n').map((l) => l.split('\t'))
const head = lines[0]
const want = colsArg && colsArg !== '-' ? colsArg.split(',') : ['name', 'lex', 'grid', 'pairs', 'dealt', 'stallRate', 'stuck', 'frozen', 'linked', 'repeatRate', 'flipRate', 'dupTurn', 'dupBoard', 'dupView', 'dupViewPan', 'verdict']
const idx = want.map((c) => head.indexOf(c))
const re = filt ? new RegExp(filt) : null
const rows = [want, ...lines.slice(1).filter((l) => !re || re.test(l.join('\t'))).map((l) => idx.map((i) => (l[i] ?? '').replace('curve-realistic-', 'R').replace('curve-random-', 'X').replace('curve-best-', 'B')))]
const w = want.map((_, j) => Math.max(...rows.map((r) => r[j].length)))
for (const r of rows) console.log(r.map((c, j) => c.padEnd(w[j])).join(' '))
