#!/usr/bin/env node
// Parameter sweeps. A single run is an anecdote — these dynamics are heavy
// tailed and path dependent, so every number here is a median over seeds.
//
//   node sim/sweep.mjs alpha 0.1 0.3 0.5 0.7 0.9
//   node sim/sweep.mjs kappa 0 0.4 0.8 1.6 3.2 --seeds 5
//   node sim/sweep.mjs burnBps 0 25 50 100 --years 10
//   node sim/sweep.mjs patronPropensity 0.05 0.15 0.35 0.8

import { parseArgs } from './src/config.mjs'
import { run } from './src/model.mjs'

const argv = process.argv.slice(2)
const param = argv[0]
if (!param || param.startsWith('--')) {
  process.stdout.write('usage: node sim/sweep.mjs <param> <value...> [--seeds N] [--years N]\n')
  process.exit(1)
}

const values = []
let i = 1
while (i < argv.length && !argv[i].startsWith('--')) values.push(Number(argv[i++]))
const base = parseArgs(argv.slice(i))
const seeds = base.seeds ?? 5

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

const FIELDS = [
  ['craft~amp', 10, (r) => r.ampCraftCorr.toFixed(2)],
  ['hustl~amp', 10, (r) => r.ampHustleCorr.toFixed(2)],
  ['craft f/t', 10, (r) => r.fullCraft.toFixed(1)],
  ['rentier', 8, (r) => r.rentier.toFixed(1)],
  ['back', 6, (r) => r.returned.toFixed(1)],
  ['output', 8, (r) => r.totalOutput.toFixed(1)],
  ['price', 8, (r) => r.price.toFixed(3)],
  ['recip', 7, (r) => `${(r.reciprocityRate * 100).toFixed(0)}%`],
  ['endorse$', 9, (r) => `${(r.endorsementCost * 100).toFixed(0)}%`],
  ['giniRAIN', 9, (r) => r.giniRain.toFixed(3)],
  ['burn/mint', 10, (r) => r.burnCoverage.toFixed(2)]
]

process.stdout.write(`\n  sweep: ${param} · ${seeds} seeds · ${base.years}y · medians\n\n`)
const head = param.padStart(9) + FIELDS.map(([n, w]) => n.padStart(w)).join('')
process.stdout.write(`${head}\n${'-'.repeat(head.length)}\n`)

for (const value of values) {
  const runs = []
  for (let s = 0; s < seeds; s++) {
    const cfg = { ...base, [param]: value, seed: (base.seed ?? 1) + s, quiet: true }
    const model = run(cfg)
    runs.push(model.state.reports[model.state.reports.length - 1])
  }
  const agg = {}
  for (const [, , get] of FIELDS) void get // keep the shape obvious
  for (const key of ['ampCraftCorr', 'ampHustleCorr', 'fullCraft', 'rentier', 'returned', 'totalOutput', 'price', 'reciprocityRate', 'endorsementCost', 'giniRain', 'burnCoverage']) {
    agg[key] = median(runs.map((r) => r[key] ?? 0))
  }
  process.stdout.write(String(value).padStart(9) + FIELDS.map(([, w, get]) => get(agg).padStart(w)).join('') + '\n')
}
process.stdout.write('\n')
