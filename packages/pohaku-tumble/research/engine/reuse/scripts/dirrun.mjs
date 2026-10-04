// Like run.mjs, but runs dirsim.mjs (the Director-faithful sim) for a stage
// stages/<stage>.mjs and writes results/<stage>.jsonl + .tsv.
import { spawn } from 'node:child_process'
import { writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const here = dirname(fileURLToPath(import.meta.url))
const TIERS = 'roots/.cache/tiers'
const stage = process.argv[2]
const par = +(process.argv[3] ?? os.cpus().length)
const { jobs } = await import(join(here, 'stages', `${stage}.mjs`))
mkdirSync(join(here, 'results'), { recursive: true })
const runOne = (job) =>
  new Promise((resolve) => {
    const env = { ...process.env, LEX: job.lex === 'jukugo' ? 'jukugo' : existsSync(join(here, 'lex', `${job.lex}.json`)) ? join(here, 'lex', `${job.lex}.json`) : join(TIERS, `${job.lex}.json`), CFG: JSON.stringify({ name: job.name, ...job.cfg }) }
    const p = spawn(process.execPath, [join(here, 'dirsim.mjs')], { env, cwd: here })
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
const results = new Array(jobs.length)
let next = 0
await Promise.all(Array.from({ length: par }, async () => { while (next < jobs.length) { const i = next++; results[i] = await runOne(jobs[i]) } }))
writeFileSync(join(here, 'results', `${stage}.jsonl`), results.map((r) => JSON.stringify(r)).join('\n') + '\n')
const COLS = ['name', 'lex', 'grid', 'pairs', 'lexicon', 'dealt', 'bgLost', 'bgEmpty', 'noteFail', 'noteShort', 'cardFlip', 'repeat', 'flip', 'linked', 'stuckView', 'dupView', 'dupNear', 'tpm', 'seenFrac', 'cfg']
writeFileSync(join(here, 'results', `${stage}.tsv`), [COLS.join('\t'), ...results.map((r) => COLS.map((c) => (c === 'cfg' ? JSON.stringify(r.cfg) : r[c])).join('\t'))].join('\n') + '\n')
process.stderr.write(`${stage}: wrote ${results.length} rows\n`)
