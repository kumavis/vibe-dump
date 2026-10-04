// graph.mjs — structure of every curve list (and the attested files) -> graph.tsv
// Columns: see lexgraph.stats(). core_k = size of the k-core (engine degree >= k among survivors).
// deadEnds = deg0 + deg1. occ65 = 65 / n (share of the list on a full 9x8 board at once).
import fs from 'node:fs'
import { TIERS, loadList, stats } from './lexgraph.mjs'

const here = new URL('.', import.meta.url).pathname
const names = ['attested-WA']
for (const o of ['realistic', 'random', 'best']) for (const n of [128, 175, 225, 300, 400, 500, 650, 905]) names.push(`curve-${o}-${n}`)
const cols = ['list', 'n', 'roots', 'linkableRoots', 'deg0', 'deg1', 'deadEnds', 'deg2', 'deg3_4', 'deg5plus', 'degGE2', 'meanDeg', 'medianDeg',
  'comps', 'compsGE2', 'giant', 'second', ...[1, 2, 3, 4, 5, 6, 8].map((k) => `core_${k}`), 'degeneracy', 'core2comps', 'core2giant', 'occ65']
const lines = [cols.join('\t')]
for (const name of names) {
  const s = stats(loadList(`${TIERS}/${name}.json`))
  const row = { list: name, ...s, deadEnds: s.deg0 + s.deg1, occ65: (65 / s.n).toFixed(3) }
  for (const k of [1, 2, 3, 4, 5, 6, 8]) row[`core_${k}`] = s.core[k]
  lines.push(cols.map((c) => row[c]).join('\t'))
}
fs.writeFileSync(here + 'graph.tsv', lines.join('\n') + '\n')
console.log(lines.join('\n'))
