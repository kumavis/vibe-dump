// Second boundary round: the cells the first round moved (a min-viable size that failed its
// 30-seed or long check) and the grammar-clean fallback's steady state on the auto board.
import { writeFileSync } from 'node:fs'
import { ENGINES, DENGINES } from './engines.mjs'
const CURVE = [128, 175, 225, 300, 400, 500, 650, 905]
const lexOf = (o, n) => (CURVE.includes(n) ? `curve-${o}-${n}` : `lex/curve-${o}-${n}.json`)
const cells = [
  ['POHAKU', 'random', 9, 8, [300]],
  ['POHAKU -ret', 'realistic', 9, 8, [400, 450]],
  ['POHAKU -ret', 'random', 9, 8, [400, 450, 500]],
  ['POHAKU -ret', 'realistic', null, null, [200, 225, 250, 275, 300, 350, 400]],
  ['POHAKU -ret', 'random', null, null, [250, 275, 300, 350, 400, 450]],
]
for (const mode of ['sim', 'dir']) {
  const E = mode === 'dir' ? DENGINES : ENGINES
  const jobs = []
  for (const [e, o, c, r, sizes] of cells) for (const n of sizes) {
    jobs.push({ engine: `${e} [30 seeds]`, lex: lexOf(o, n), cfg: { ...E[e](c, r), seeds: 30 } })
    jobs.push({ engine: `${e} [long]`, lex: lexOf(o, n), cfg: { ...E[e](c, r), seeds: 10, ...(mode === 'dir' ? { duration: 7200 } : { ticks: 6000 }) } })
  }
  writeFileSync(`jobs/${mode === 'dir' ? 'dboundary2' : 'boundary2'}.json`, JSON.stringify(jobs))
  console.log(mode, jobs.length, 'jobs')
}
