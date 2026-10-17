// LINK_MAX rule calibration: c0 x floor on the orders/sizes where it matters.
import { writeFileSync } from 'node:fs'
import { ENGINES } from './engines.mjs'
const jobs = []
for (const o of ['realistic', 'random', 'best']) for (const n of [175, 225, 300, 400]) for (const [c, r] of [[9, 8], [6, 5]])
  for (const [c0, fl] of [[0.015, 6.5], [0.015, 5], [0.012, 6.5], [0.012, 5], [0.010, 5]]) {
    const cfg = { ...ENGINES['REC+ret'](c, r), linkC0: c0, linkFloor: fl }
    jobs.push({ engine: `REC+ret c0=${c0} floor=${fl}`, lex: `curve-${o}-${n}`, cfg })
  }
writeFileSync(process.argv[2], JSON.stringify(jobs))
console.log(jobs.length, 'jobs')
