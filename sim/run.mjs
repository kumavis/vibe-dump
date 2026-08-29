#!/usr/bin/env node
// Entry point. Run the model, print a trace you can actually read.
//
//   node sim/run.mjs
//   node sim/run.mjs --no-raindrop
//   node sim/run.mjs --alpha 0.2 --kappa 0.4 --seed 7
//   node sim/run.mjs --burn-bps 50 --jsonl out.jsonl

import { writeFileSync } from 'node:fs'
import { parseArgs, USAGE } from './src/config.mjs'
import { run } from './src/model.mjs'
import { header, tableHeader, tableRow, legend, stories, summary } from './src/trace.mjs'

const config = parseArgs(process.argv.slice(2))

if (config.help) {
  process.stdout.write(USAGE)
  process.exit(0)
}

const started = Date.now()
const model = run(config)
const elapsed = ((Date.now() - started) / 1000).toFixed(1)

if (!config.quiet) {
  const out = []
  out.push(header(config))
  out.push(tableHeader())
  for (const r of model.state.reports) out.push(tableRow(r))
  out.push(legend())
  out.push(stories(model.agents, config.followCount))
  out.push(summary(model))
  out.push(`  ${config.years}y of daily ticks in ${elapsed}s`)
  out.push('')
  process.stdout.write(out.join('\n'))
}

if (config.jsonl) {
  const lines = model.state.reports.map((r) => {
    // per-agent vectors stay out of the row stream
    const { netIncidence, amplification, ...rest } = r
    return JSON.stringify({ ...rest, config: { seed: config.seed, alpha: config.alpha, kappa: config.kappa, raindrop: config.raindrop, burnBps: config.burnBps } })
  })
  const body = lines.join('\n') + '\n'
  if (typeof config.jsonl === 'string') {
    writeFileSync(config.jsonl, body)
    if (!config.quiet) process.stdout.write(`  wrote ${model.state.reports.length} rows to ${config.jsonl}\n`)
  } else {
    process.stdout.write(body)
  }
}
