// runall.mjs — run a batch of dsim.mjs configs in parallel and append them to a JSONL file.
//   node runall.mjs <batch.mjs> <out.jsonl> [parallel=4]
// <batch.mjs> default-exports an array of { lex, cfg } (lex: tier name, a path, or "jukugo").
import { spawn } from 'node:child_process'
import { appendFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const TIERS = 'roots/.cache/tiers'
const [batchFile, outFile, par = '4'] = process.argv.slice(2)
const jobs = (await import(pathToFileURL(resolve(batchFile)).href)).default
const lexPath = (l) => (l === 'jukugo' || l.includes('/') ? l : `${TIERS}/${l}.json`)

let next = 0, done = 0
function runOne(job) {
  return new Promise((ok) => {
    const env = { ...process.env, LEX: lexPath(job.lex), CFG: JSON.stringify(job.cfg) }
    const child = spawn('node', [resolve(here, 'dsim.mjs')], { env })
    let out = '', err = ''
    child.stdout.on('data', (d) => (out += d))
    child.stderr.on('data', (d) => (err += d))
    child.on('close', (code) => {
      if (code !== 0) { console.error('FAIL', job.lex, JSON.stringify(job.cfg), err.slice(0, 400)); return ok() }
      const row = JSON.parse(out.trim().split('\n').at(-1))
      row.lexName = job.lex
      row.variant = job.variant ?? job.cfg.name
      appendFileSync(outFile, JSON.stringify(row) + '\n')
      done++
      if (done % 10 === 0) console.error(`${done}/${jobs.length}`)
      ok()
    })
  })
}
async function worker() {
  while (next < jobs.length) await runOne(jobs[next++])
}
await Promise.all(Array.from({ length: Number(par) }, worker))
console.error(`done ${done}/${jobs.length}`)
