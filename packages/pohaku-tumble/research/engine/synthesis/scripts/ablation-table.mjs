// Markdown ablation table: each variant of REC+ret at a few cells, both simulators.
//   node ablation-table.mjs
import { readFileSync, existsSync } from 'node:fs'
const read = (f) => {
  if (!existsSync(f)) return []
  const [head, ...lines] = readFileSync(f, 'utf8').trim().split('\n')
  const cols = head.split('\t')
  return lines.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v])))
}
const S = [...read('results/ablation.tsv'), ...read('results/ablation-extra.tsv')]
const D = [...read('results/dablation.tsv'), ...read('results/dablation-extra.tsv')]
const gridOf = (r) => (r.cfg.includes('autoGrid') ? 'auto' : r.grid)
const cells = [['sim', 'auto', 'curve-realistic-175'], ['sim', 'auto', 'curve-realistic-225'], ['sim', '9x8', 'curve-realistic-300'],
  ['dir', 'auto', 'curve-realistic-175'], ['dir', 'auto', 'curve-realistic-225'], ['dir', '9x8', 'curve-realistic-300'], ['dir', 'auto', 'curve-random-225']]
const engines = [...new Set(S.map((r) => r.engine))]
const f2 = (x) => (x === '' || x == null ? '–' : Number(x).toFixed(2).replace(/^0/, ''))
console.log('| variant | ' + cells.map(([m, g, l]) => `${m === 'sim' ? 'harness' : 'Director'} ${g} ${l.replace('curve-', '')}`).join(' | ') + ' |')
console.log('|---|' + cells.map(() => '---').join('|') + '|')
for (const e of engines) {
  const out = cells.map(([m, g, l]) => {
    const r = (m === 'sim' ? S : D).find((x) => x.engine === e && gridOf(x) === g && x.lex === l)
    if (!r) return ''
    const v = r.JUKUGO_LIKE === 'yes' ? '**J**' : r.GOOD === 'yes' ? '**G**' : '–'
    return `${f2(m === 'sim' ? r.stallRate : r.beatsLost)}/${f2(r.stuck)}/${f2(r.repeatRate)}/${f2(m === 'sim' ? r.linked : r.linkedVis)} ${v}`
  })
  console.log(`| ${e} | ${out.join(' | ')} |`)
}
