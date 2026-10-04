// Run a list of sim jobs in parallel and write a TSV.
//   node run-matrix.mjs jobs.json out.tsv
// jobs.json: [{ engine, lex, cfg }] — lex is a tier name (file in TIERS) or "jukugo";
// cfg is the sim CFG (name/seeds/ticks are filled in if missing).
// Verdicts use the study's thresholds:
//   GOOD        dealt every seed; stall <= 0.05; stuck <= 0.10; repeat <= 0.20; 0.35 <= linked <= 0.70
//   JUKUGO-LIKE dealt every seed; stall <= 0.02; stuck <= 0.03; repeat <= 0.13; 0.40 <= linked <= 0.65
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { cpus } from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const TIERS = 'roots/.cache/tiers'
const [jobsFile, outFile] = process.argv.slice(2)
const jobs = JSON.parse(readFileSync(jobsFile, 'utf8'))
const PAR = Number(process.env.PAR ?? cpus().length)

export function verdict(r) {
  if (!r.dealt || r.dealt.split('/')[0] !== r.dealt.split('/')[1]) return ['no', 'no']
  const good = r.stallRate <= 0.05 && r.stuck <= 0.10 && r.repeatRate <= 0.20 && r.linked >= 0.35 && r.linked <= 0.70
  const juk = r.stallRate <= 0.02 && r.stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.40 && r.linked <= 0.65
  return [good ? 'yes' : 'no', juk ? 'yes' : 'no']
}

function runOne(job) {
  const cfg = { seeds: 10, ticks: 1500, horizontalOnly: true, slab: 1.5, cols: 9, rows: 8, ...job.cfg }
  cfg.name ??= job.engine
  const lex = job.lex === 'jukugo' ? 'jukugo' : `${TIERS}/${job.lex}.json`
  return new Promise((resolve) => {
    const p = spawn('node', ['sim.mjs'], { cwd: here, env: { ...process.env, LEX: lex, CFG: JSON.stringify(cfg) } })
    let out = ''
    let err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', () => {
      try {
        resolve({ job, cfg, r: JSON.parse(out.trim().split('\n').at(-1)) })
      } catch {
        resolve({ job, cfg, r: { error: err.slice(0, 300) } })
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
    done++
    if (process.stderr.isTTY || process.env.PROGRESS) process.stderr.write(`\r${done}/${jobs.length}`)
  }
}
await Promise.all(Array.from({ length: PAR }, worker))

const cols = ['engine', 'lex', 'grid', 'retry', 'pairs', 'words', 'deg1', 'deg5', 'dealt', 'stallRate', 'stuck', 'stuckStrict', 'frozen',
  'linked', 'linkedLo', 'linkedHi', 'repeatRate', 'bounce', 'seenFrac', 'noFresh', 'sd_stall', 'sd_stuck', 'sd_repeat', 'sd_linked', 'GOOD', 'JUKUGO_LIKE', 'cfg']
const lines = [cols.join('\t')]
for (const { job, cfg, r } of results) {
  const [good, juk] = verdict(r)
  const { name, seeds, ticks, horizontalOnly, slab, ...rest } = cfg
  lines.push([job.engine, job.lex, r.grid, cfg.retry ?? 0, r.pairs, r.lexicon, r.deg1, r.deg5, r.dealt, r.stallRate, r.stuck, r.stuckStrict, r.frozen,
    r.linked, r.linkedLo, r.linkedHi, r.repeatRate, r.bounce, r.seenFrac, r.noFresh, r.sd_stall, r.sd_stuck, r.sd_repeat, r.sd_linked, good, juk, JSON.stringify(rest)].join('\t'))
}
writeFileSync(outFile, lines.join('\n') + '\n')
console.log(lines.join('\n'))
