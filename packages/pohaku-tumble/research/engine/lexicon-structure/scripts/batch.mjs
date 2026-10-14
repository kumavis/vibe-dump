// batch.mjs — run simx.mjs over a job list with 4 workers, append JSON lines to an output file.
// usage: node batch.mjs <jobs.mjs> <out.jsonl>
// A jobs module default-exports an array of { lex: path, lexName, cfg: {...} }.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const here = new URL('.', import.meta.url).pathname
const [jobsFile, outFile] = process.argv.slice(2)
const jobs = (await import(pathToFileURL(resolve(jobsFile)).href)).default
const out = fs.createWriteStream(outFile, { flags: 'a' })
let next = 0, done = 0
const N = Number(process.env.WORKERS ?? 4)
function runOne(job) {
  return new Promise((res) => {
    const p = spawn('node', [here + 'simx.mjs'], { env: { ...process.env, LEX: job.lex, LEXNAME: job.lexName, CFG: JSON.stringify(job.cfg) } })
    let buf = ''
    p.stdout.on('data', (d) => (buf += d))
    p.stderr.on('data', (d) => process.stderr.write(d))
    p.on('close', () => {
      const line = buf.trim().split('\n').at(-1)
      try { const o = JSON.parse(line); Object.assign(o, job.tag ?? {}); out.write(JSON.stringify(o) + '\n') } catch { process.stderr.write(`bad output for ${job.lexName}: ${buf}\n`) }
      if (++done % 25 === 0) process.stderr.write(`${done}/${jobs.length}\n`)
      res()
    })
  })
}
async function worker() { while (next < jobs.length) await runOne(jobs[next++]) }
await Promise.all(Array.from({ length: N }, worker))
out.end()
process.stderr.write(`done ${done}\n`)
