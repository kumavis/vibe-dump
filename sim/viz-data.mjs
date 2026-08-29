#!/usr/bin/env node
// Produce the dataset the visualisation reads. Runs the sweeps that carry the
// findings, medians them over seeds, and writes one JSON file.
//
//   node sim/viz-data.mjs > sim/viz-data.json

import { DEFAULTS } from './src/config.mjs'
import { run } from './src/model.mjs'

const SEEDS = 2
const YEARS = 5

const median = (xs) => {
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

const KEYS = [
  'endCraftCorr', 'endHustleCorr', 'endLegibilityCorr', 'endSocialCorr',
  'followerGini', 'followerCraftCorr', 'followerHustleCorr', 'followerLegibilityCorr',
  'ampArt', 'ampResearch', 'ampInfra', 'ampGeneral',
  'flwArt', 'flwResearch', 'flwInfra',
  'fullCraft', 'reduced', 'returned', 'totalOutput', 'price',
  'reciprocityRate', 'endorsementCost', 'giniRain', 'meanFollowers'
]

function sweep (param, values, overrides = {}) {
  const rows = []
  for (const value of values) {
    const runs = []
    for (let s = 0; s < SEEDS; s++) {
      const cfg = { ...DEFAULTS, ...overrides, years: YEARS, [param]: value, seed: 1 + s, quiet: true }
      const model = run(cfg)
      runs.push(model.state.reports[model.state.reports.length - 1])
    }
    const row = { value }
    for (const k of KEYS) row[k] = median(runs.map((r) => r[k] ?? 0))
    rows.push(row)
    process.stderr.write(`  ${param}=${value} done\n`)
  }
  return rows
}

process.stderr.write('algoShare sweep...\n')
const algoShare = sweep('algoShare', [0, 0.25, 0.5, 0.75, 1])

process.stderr.write('digRate sweep...\n')
const digRate = sweep('digRate', [0, 30, 120, 400, 1200])

process.stderr.write('alpha sweep...\n')
const alpha = sweep('alpha', [0.15, 0.35, 0.55, 0.75, 0.95])

process.stderr.write('timeline run...\n')
const timelineModel = run({ ...DEFAULTS, years: 10, reportEveryMonths: 4, seed: 1, quiet: true })
const timeline = timelineModel.state.reports.map((r) => ({
  month: r.month,
  endCraftCorr: r.endCraftCorr,
  endHustleCorr: r.endHustleCorr,
  endLegibilityCorr: r.endLegibilityCorr,
  price: r.price,
  giniRain: r.giniRain,
  followerGini: r.followerGini,
  fullCraft: r.fullCraft,
  reciprocityRate: r.reciprocityRate
}))
const last = timelineModel.state.reports[timelineModel.state.reports.length - 1]

// Per-agent scatter from the timeline run: what the mechanism paid each person.
const agents = timelineModel.agents.map((a) => ({
  persona: a.personaLabel,
  field: a.field,
  craft: +a.traits.craft.toFixed(3),
  hustle: +a.traits.hustle.toFixed(3),
  legibility: +a.traits.legibility.toFixed(3),
  followers: a.followers.size,
  endorsed: +a.cum.endorsed.toFixed(2),
  received: +a.cum.rainReceived.toFixed(1),
  amp: +(a.cum.rainReceived / Math.max(a.cum.proRata, 1e-9)).toFixed(3)
}))

process.stdout.write(JSON.stringify({
  meta: { seeds: SEEDS, years: YEARS, agents: DEFAULTS.agents, generated: new Date().toISOString() },
  algoShare,
  digRate,
  alpha,
  timeline,
  byField: last.byField,
  agents
}, null, 0))
process.stderr.write('done\n')
