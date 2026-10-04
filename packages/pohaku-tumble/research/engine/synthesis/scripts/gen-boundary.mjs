// Boundary checks at the min-viable cells (from results/minviable-{sim,dir}.tsv): the min GOOD and
// JUKUGO-LIKE sizes and the size just below each, rerun with 30 seeds, and with 10 seeds at 4x the
// length (sim 6000 ticks; Director model 2 h). → jobs/boundary.json, jobs/dboundary.json
import { readFileSync, writeFileSync } from 'node:fs'
import { ENGINES, DENGINES } from './engines.mjs'
const LADDER = [128, 150, 175, 200, 225, 250, 275, 300, 350, 400, 450, 500, 650, 905]
const CURVE = [128, 175, 225, 300, 400, 500, 650, 905]
const lexOf = (o, n) => (CURVE.includes(n) ? `curve-${o}-${n}` : `lex/curve-${o}-${n}.json`)
for (const mode of ['sim', 'dir']) {
  const E = mode === 'dir' ? DENGINES : ENGINES
  const [head, ...lines] = readFileSync(`results/minviable-${mode}.tsv`, 'utf8').trim().split('\n')
  const cols = head.split('\t')
  const jobs = []
  for (const l of lines) {
    const r = Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v]))
    if (!['POHAKU', 'POHAKU -ret'].includes(r.engine) || !['9x8', '5x4s', 'auto'].includes(r.grid)) continue
    const sizes = new Set()
    for (const k of ['GOOD', 'JUKUGO_LIKE']) {
      const n = +r[k]
      if (!n) continue
      sizes.add(n)
      const i = LADDER.indexOf(n)
      if (i > 0) sizes.add(LADDER[i - 1])
    }
    const [c, rr] = r.grid === 'auto' ? [null, null] : r.grid.replace('s', '').split('x').map(Number)
    for (const n of sizes) {
      jobs.push({ engine: `${r.engine} [30 seeds]`, lex: lexOf(r.order, n), cfg: { ...E[r.engine](c, rr), seeds: 30 } })
      jobs.push({ engine: `${r.engine} [long]`, lex: lexOf(r.order, n), cfg: { ...E[r.engine](c, rr), seeds: 10, ...(mode === 'dir' ? { duration: 7200 } : { ticks: 6000 }) } })
    }
  }
  writeFileSync(`jobs/${mode === 'dir' ? 'dboundary' : 'boundary'}.json`, JSON.stringify(jobs))
  console.log(mode, jobs.length, 'jobs')
}
