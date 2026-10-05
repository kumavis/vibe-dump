// Run a batch of sim.mjs jobs in parallel and append their JSON lines to a file.
// Usage: node sweep.mjs <jobs.mjs> <out.jsonl>
//   jobs.mjs default-exports an array of { lex, cfg } (lex: tier name, path, or "jukugo")
import { spawn } from 'node:child_process'
import { appendFileSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const here = dirname(fileURLToPath(import.meta.url))
export const TIERS = 'roots/.cache/tiers'
const [jobsFile, outFile] = process.argv.slice(2)
const jobs = (await import(resolve(jobsFile))).default
writeFileSync(outFile, '')
const BASE = { horizontalOnly: true, slab: 1.5, seeds: 10, ticks: 1500 }
// tier files first; finer curve steps (make-curves.mjs) from ./lexicons
const lexPath = (l) => (l === 'jukugo' || l.includes('/') ? l : existsSync(join(TIERS, `${l}.json`)) ? join(TIERS, `${l}.json`) : join(here, 'lexicons', `${l}.json`))

let next = 0, done = 0
const N = Math.max(1, os.cpus().length)
await new Promise((resolveAll) => {
  const launch = () => {
    if (next >= jobs.length) { if (done === jobs.length) resolveAll(); return }
    const job = jobs[next++]
    const cfg = { ...BASE, ...job.cfg }
    const p = spawn('node', [join(here, 'sim.mjs')], { env: { ...process.env, LEX: lexPath(job.lex), CFG: JSON.stringify(cfg) } })
    let out = ''
    let err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => {
      if (code !== 0) process.stderr.write(`FAIL ${job.lex} ${JSON.stringify(cfg)}\n${err}\n`)
      else appendFileSync(outFile, out)
      done++
      if (done % 20 === 0) process.stderr.write(`${done}/${jobs.length}\n`)
      launch()
    })
  }
  for (let i = 0; i < N; i++) launch()
})
