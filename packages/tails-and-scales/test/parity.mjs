// Check that battles still replay exactly as they did when the baseline was
// recorded — the guard rail for refactors that must not change behaviour.
//
//   node test/parity.mjs                 # replay every baseline battle, compare
//   node test/parity.mjs --record        # (re)record test/baseline.json
//
// test/baseline.json stores, per battle, the line count and a short hash of
// every trace line, so a mismatch names the first line that diverged without
// committing megabytes of traces.
import { createHash } from 'node:crypto'
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { replay } from './replay.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const BASE = join(here, 'baseline.json')
const DIST = join(here, '..', 'dist')
const h = (s) => createHash('sha256').update(s).digest('hex').slice(0, 10)
const record = process.argv.includes('--record')
const PAR = Number(process.env.PARALLEL || 3)

const base = JSON.parse(readFileSync(BASE, 'utf8'))
const results = []
const queue = [...base.battles]
async function worker() {
  for (let b; (b = queue.shift()); ) {
    const t0 = Date.now()
    const { trace, errors } = await replay(b.seed, b.dice, DIST)
    const lines = trace.map(h)
    let first = -1
    if (!record) for (let i = 0; i < Math.max(lines.length, b.lines.length); i++) if (lines[i] !== b.lines[i]) { first = i; break }
    results.push({ b, lines, first, errors, secs: Math.round((Date.now() - t0) / 1000), trace })
    const tag = record ? 'recorded' : first < 0 ? 'same' : `DIVERGES at line ${first + 1}`
    console.log(`seed ${b.seed} dice ${b.dice}: ${trace.length} lines, ${tag}${errors.length ? `, ${errors.length} page error(s)` : ''} (${Math.round((Date.now() - t0) / 1000)}s)`)
    if (!record && first >= 0) console.log(`   now: ${trace[first] ?? '(trace ended)'}`.slice(0, 400))
  }
}
await Promise.all(Array.from({ length: PAR }, worker))
if (record) {
  for (const r of results) r.b.lines = r.lines
  base.recordedAt = process.env.GIT_HEAD || base.recordedAt
  writeFileSync(BASE, JSON.stringify(base, null, 1) + '\n')
  console.log(`wrote ${BASE}`)
} else {
  const bad = results.filter((r) => r.first >= 0 || r.errors.length)
  console.log(bad.length ? `${bad.length} of ${results.length} battles differ` : `all ${results.length} battles replay identically`)
  process.exit(bad.length ? 1 : 0)
}
