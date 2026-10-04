// Concatenate every results/*.tsv run into results/results.tsv with a leading "run" column.
import { readFileSync, writeFileSync } from 'node:fs'
const RUNS = ['final', 'supp', 'lamin', 'ablation', 'long', 'linkscale', 'steer', 'bestlink', 'explore1', 'explore2', 'explore3', 'explore4', 'explore5']
let head = null
const out = []
for (const run of RUNS) {
  const [h, ...lines] = readFileSync(`results/${run}.tsv`, 'utf8').trim().split('\n')
  if (!head) { head = h; out.push('run\t' + h) }
  const map = h.split('\t'), want = head.split('\t')
  for (const l of lines) { const v = Object.fromEntries(l.split('\t').map((x, i) => [map[i], x])); out.push(run + '\t' + want.map((k) => v[k] ?? '').join('\t')) }
}
writeFileSync('results/results.tsv', out.join('\n') + '\n')
console.log(out.length - 1, 'rows')
