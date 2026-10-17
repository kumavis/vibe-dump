// Run a job list in parallel → TSV (+ JSONL of raw rows).
//   node run-matrix.mjs jobs.json out.tsv
// jobs.json: [{ engine, lex, cfg }]; lex = a tier name in TIERS, a path, or "jukugo".
// Verdicts (the brief's thresholds, judged on `stuck` = frozen under the rules in force;
// GOODs = the same judged on stuckStrict, the original harness's definition):
//   GOOD        dealt every seed; stall <= 0.05; stuck <= 0.10; repeat <= 0.20; 0.35 <= linked <= 0.70
//   JUKUGO-LIKE dealt every seed; stall <= 0.02; stuck <= 0.03; repeat <= 0.13; 0.40 <= linked <= 0.65
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { cpus } from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
export const TIERS = 'roots/.cache/tiers'
const PAR = Number(process.env.PAR ?? cpus().length)

export function verdict(r, stuckKey = 'stuck') {
  if (!r.dealt || r.dealt.split('/')[0] !== r.dealt.split('/')[1]) return ['no', 'no']
  const s = r[stuckKey]
  const good = r.stallRate <= 0.05 && s <= 0.10 && r.repeatRate <= 0.20 && r.linked >= 0.35 && r.linked <= 0.70
  const juk = r.stallRate <= 0.02 && s <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.40 && r.linked <= 0.65
  return [good ? 'yes' : 'no', juk ? 'yes' : 'no']
}

function runOne(job) {
  const cfg = { seeds: 10, ticks: 1500, horizontalOnly: true, slab: 1.5, ...job.cfg }
  cfg.name ??= job.engine
  const lex = job.lex === 'jukugo' ? 'jukugo' : job.lex.includes('/') ? job.lex : `${TIERS}/${job.lex}.json`
  return new Promise((resolve) => {
    const p = spawn('node', ['sim.mjs'], { cwd: here, env: { ...process.env, LEX: lex, CFG: JSON.stringify(cfg) } })
    let out = '', err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', () => {
      try { resolve({ job, cfg, r: JSON.parse(out.trim().split('\n').at(-1)) }) } catch { resolve({ job, cfg, r: { error: err.slice(0, 300) } }) }
    })
  })
}

export const COLS = ['engine', 'lex', 'grid', 'ticks', 'pairs', 'holes', 'words', 'playable', 'giant', 'linkMax', 'dealt', 'stallRate', 'stuck', 'stuckNow', 'stuckStrict', 'frozenRun',
  'linked', 'linkedLo', 'linkedHi', 'repeatRate', 'bounce', 'seenFrac', 'seenAll', 'noFresh', 'sd_stallRate', 'sd_stuck', 'sd_repeatRate', 'sd_linked', 'GOOD', 'JUKUGO_LIKE', 'GOODs', 'JUKUGO_LIKEs', 'cfg']

if (import.meta.url === `file://${process.argv[1]}`) {
  const [jobsFile, outFile] = process.argv.slice(2)
  const jobs = JSON.parse(readFileSync(jobsFile, 'utf8'))
  const results = new Array(jobs.length)
  let next = 0, done = 0
  async function worker() {
    while (next < jobs.length) {
      const i = next++
      results[i] = await runOne(jobs[i])
      done++
      if (process.env.PROGRESS) process.stderr.write(`\r${done}/${jobs.length}`)
    }
  }
  await Promise.all(Array.from({ length: PAR }, worker))
  const lines = [COLS.join('\t')]
  for (const { job, cfg, r } of results) {
    const [good, juk] = verdict(r)
    const [goods, juks] = verdict(r, 'stuckStrict')
    const { name, seeds, horizontalOnly, slab, ...rest } = cfg
    const row = { ...r, engine: job.engine, lex: job.lex, ticks: cfg.ticks, GOOD: good, JUKUGO_LIKE: juk, GOODs: goods, JUKUGO_LIKEs: juks, cfg: JSON.stringify(rest) }
    lines.push(COLS.map((c) => row[c] ?? '').join('\t'))
  }
  writeFileSync(outFile, lines.join('\n') + '\n')
  writeFileSync(outFile.replace(/\.tsv$/, '.jsonl'), results.map((x) => JSON.stringify({ engine: x.job.engine, lex: x.job.lex, cfg: x.cfg, ...x.r })).join('\n') + '\n')
  process.stderr.write(`\n${outFile}: ${results.length} rows\n`)
}
