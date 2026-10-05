// Compact pivot of a results TSV (sim or Director): one line per engine × grid, one cell per lexicon:
// "lost/stuck/repeat/linked V" with V = J (JUKUGO-LIKE), G (GOOD) or . (neither).
//   node pivot.mjs file.tsv [grid-regex] [engine-regex]
import { readFileSync } from 'node:fs'
const [f, gr = '.', er = '.'] = process.argv.slice(2)
const [head, ...lines] = readFileSync(f, 'utf8').trim().split('\n')
const cols = head.split('\t')
const rows = lines.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v])))
const dir = cols.includes('beatsLost')
const lost = (r) => (dir ? r.beatsLost : r.stallRate), link = (r) => (dir ? r.linkedVis : r.linked)
const lexes = [...new Set(rows.map((r) => r.lex))]
const gridOf = (r) => (r.cfg.includes('autoGrid') ? 'auto' : r.grid.replace(/s$/, 's'))
const keys = [...new Set(rows.filter((r) => new RegExp(er).test(r.engine) && new RegExp(gr).test(gridOf(r))).map((r) => `${gridOf(r)}|${r.engine}`))]
const f2 = (x) => (x === '' || x == null ? '  - ' : Number(x).toFixed(2).replace(/^0/, ''))
console.log('grid  engine'.padEnd(34) + lexes.map((l) => l.replace('curve-', '').padEnd(21)).join(''))
for (const k of keys.sort()) {
  const [g, e] = k.split('|')
  let s = `${g.padEnd(5)} ${e}`.padEnd(34)
  for (const lex of lexes) {
    const r = rows.find((x) => x.engine === e && gridOf(x) === g && x.lex === lex)
    if (!r) { s += ''.padEnd(21); continue }
    const v = r.JUKUGO_LIKE === 'yes' ? 'J' : r.GOOD === 'yes' ? 'G' : '.'
    s += `${f2(lost(r))}/${f2(r.stuck)}/${f2(r.repeatRate)}/${f2(link(r))} ${v}`.padEnd(21)
  }
  console.log(s)
}
