// Run a stage of sim jobs in parallel and write results/<stage>.jsonl + .tsv.
//   node prepare.mjs && node run.mjs <stage> [parallelism]
// A stage is stages/<stage>.mjs exporting `jobs`: [{ name, lex, cfg }], where
// lex is a tier name (file in TIERS without .json) or "jukugo".
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const here = dirname(fileURLToPath(import.meta.url))
export const TIERS = 'roots/.cache/tiers'
const stage = process.argv[2]
const par = +(process.argv[3] ?? os.cpus().length)
const { jobs } = await import(join(here, 'stages', `${stage}.mjs`))
mkdirSync(join(here, 'results'), { recursive: true })

function runOne(job) {
  return new Promise((resolve) => {
    const env = { ...process.env, LEX: job.lex === 'jukugo' ? 'jukugo' : existsSync(join(here, 'lex', `${job.lex}.json`)) ? join(here, 'lex', `${job.lex}.json`) : join(TIERS, `${job.lex}.json`), CFG: JSON.stringify({ name: job.name, ...job.cfg }) }
    const p = spawn(process.execPath, [join(here, 'sim.mjs')], { env, cwd: here })
    let out = ''
    let err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', () => {
      try {
        resolve({ lex: job.lex, ...JSON.parse(out.trim().split('\n').at(-1)) })
      } catch {
        resolve({ lex: job.lex, name: job.name, error: err.slice(0, 300) })
      }
    })
  })
}

const results = new Array(jobs.length)
let next = 0
let done = 0
async function worker() {
  while (next < jobs.length) {
    const i = next++
    results[i] = await runOne(jobs[i])
    if (++done % 25 === 0) process.stderr.write(`${stage}: ${done}/${jobs.length}\n`)
  }
}
await Promise.all(Array.from({ length: par }, worker))
writeFileSync(join(here, 'results', `${stage}.jsonl`), results.map((r) => JSON.stringify(r)).join('\n') + '\n')
export const COLS = ['name', 'lex', 'grid', 'pairs', 'lexicon', 'deg5', 'dealt', 'stallRate', 'stuck', 'frozen', 'linked', 'repeatRate', 'flipRate', 'seenFrac',
  'dupTurn', 'dupBoard', 'dupView', 'dupViewHD', 'dupViewPan', 'dupFits', 'stallMax', 'stuckMax', 'verdict', 'cfg']
writeFileSync(join(here, 'results', `${stage}.tsv`), [COLS.join('\t'), ...results.map((r) => COLS.map((c) => (c === 'cfg' ? JSON.stringify(r.cfg) : c === 'verdict' ? verdict(r) : r[c] ?? '')).join('\t'))].join('\n') + '\n')
process.stderr.write(`${stage}: wrote ${results.length} rows\n`)

// GOOD / JUKUGO-LIKE thresholds from the brief (averages over seeds that dealt).
export function verdict(r) {
  if (!r.dealt) return 'error'
  const [d, n] = r.dealt.split('/').map(Number)
  if (d !== n) return 'nodeal'
  const jl = r.stallRate <= 0.02 && r.stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.4 && r.linked <= 0.65
  const good = r.stallRate <= 0.05 && r.stuck <= 0.1 && r.repeatRate <= 0.2 && r.linked >= 0.35 && r.linked <= 0.7
  return jl ? 'JUKUGO' : good ? 'GOOD' : '-'
}
