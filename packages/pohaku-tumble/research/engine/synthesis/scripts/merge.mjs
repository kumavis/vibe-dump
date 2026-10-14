// Every row of every run in one file per simulator, with a `run` column:
//   results.tsv      the brief's harness (sim.mjs): explore1, explore2, linkrule, ablation, curve, curve2, ref, ref-long, w128, boundary
//   results-dir.tsv  the Director model (dsim.mjs): dir1, dablation, dcurve, dcurve2, dsteerview, dref, dref-long, dw128, dboundary
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
function merge(runs, out) {
  let head = null
  const lines = []
  for (const run of runs) {
    const f = `results/${run}.tsv`
    if (!existsSync(f)) continue
    const [h, ...rows] = readFileSync(f, 'utf8').trim().split('\n')
    if (!head) { head = h; lines.push('run\t' + h) }
    if (h !== head) throw new Error(`${f}: columns differ`)
    for (const r of rows) lines.push(run + '\t' + r)
  }
  writeFileSync(out, lines.join('\n') + '\n')
  console.log(out, lines.length - 1, 'rows')
}
merge(['explore1', 'explore2', 'linkrule', 'ablation', 'ablation-extra', 'curve', 'curve2', 'ref', 'ref-long', 'w128', 'boundary', 'boundary2', 'stocklong'], 'results.tsv')
merge(['dir1', 'dablation', 'dablation-extra', 'dcurve', 'dcurve2', 'dsteerview', 'dref', 'dref-long', 'dw128', 'dboundary', 'dboundary2'], 'results-dir.tsv')
