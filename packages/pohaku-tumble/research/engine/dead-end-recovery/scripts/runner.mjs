// Run a list of jobs (each {driver: 'sim2'|'dir'|'sim', lex, cfg}) in parallel,
// append one JSON line per job (with lex + cfg echoed) to the output file.
// usage: node runner.mjs jobs.json out.jsonl [parallel]
import { readFileSync, appendFileSync, writeFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const [jobsPath, outPath, par = '4'] = process.argv.slice(2)
const jobs = JSON.parse(readFileSync(jobsPath, 'utf8'))
writeFileSync(outPath, '')
let next = 0, done = 0
function runOne(job) {
  return new Promise((resolve) => {
    const p = spawn('node', [`${here}/${job.driver ?? 'sim2'}.mjs`], {
      env: { ...process.env, LEX: job.lex, CFG: JSON.stringify(job.cfg) },
      cwd: here,
    })
    let out = '', err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', (code) => {
      let r
      try { r = JSON.parse(out.trim().split('\n').at(-1)) } catch { r = { error: err.slice(0, 400) || 'no output', code } }
      r.lexFile = job.lex.split('/').at(-1).replace('.json', '')
      r.driver = job.driver ?? 'sim2'
      r.tag = job.tag ?? ''
      r.cfg = job.cfg
      appendFileSync(outPath, JSON.stringify(r) + '\n')
      done++
      if (done % 20 === 0) process.stderr.write(`${done}/${jobs.length}\n`)
      resolve()
    })
  })
}
async function worker() {
  while (next < jobs.length) await runOne(jobs[next++])
}
await Promise.all(Array.from({ length: +par }, worker))
