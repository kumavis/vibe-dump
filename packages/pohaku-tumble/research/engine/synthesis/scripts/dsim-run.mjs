// Run Director-model jobs (dsim.mjs) in parallel → TSV + JSONL.
//   node dsim-run.mjs jobs.json out.tsv
// Verdicts in Director mode (precise definitions):
//   beats_lost = beatsLost (background beats on which nothing turned, incl. beats with no idle in-view pair)
//   stuck      = max(frozen, frozenVis): share of all / of in-view pairs that cannot turn under the
//                rules in force even after resting, sampled every 10 s
//   repeat     = repeatRate (all turns, background + notes; returns count)
//   linked     = linkedVis (share of in-view pairs on a root line, every 2 s) — what the viewer sees;
//                the board-wide Board.linkedFraction is reported as linkedAll
//   GOOD / JUKUGO_LIKE thresholds as the brief's.
import { spawn } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { cpus } from 'node:os'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { TIERS } from './run-matrix.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const PAR = Number(process.env.PAR ?? cpus().length)
export function dverdict(r) {
  if (!r.dealt || r.dealt.split('/')[0] !== r.dealt.split('/')[1]) return ['no', 'no']
  const stuck = Math.max(r.frozen, r.frozenVis), L = r.linkedVis
  const good = r.beatsLost <= 0.05 && stuck <= 0.10 && r.repeatRate <= 0.20 && L >= 0.35 && L <= 0.70
  const juk = r.beatsLost <= 0.02 && stuck <= 0.03 && r.repeatRate <= 0.13 && L >= 0.40 && L <= 0.65
  return [good ? 'yes' : 'no', juk ? 'yes' : 'no']
}
function runOne(job) {
  const cfg = { seeds: 10, duration: 3600, horizontalOnly: true, slab: 1.5, ...job.cfg }
  cfg.name ??= job.engine
  const lex = job.lex === 'jukugo' ? 'jukugo' : job.lex.includes('/') ? job.lex : `${TIERS}/${job.lex}.json`
  return new Promise((resolve) => {
    const p = spawn('node', ['dsim.mjs'], { cwd: here, env: { ...process.env, LEX: lex, CFG: JSON.stringify(cfg) } })
    let out = '', err = ''
    p.stdout.on('data', (d) => (out += d))
    p.stderr.on('data', (d) => (err += d))
    p.on('close', () => { try { resolve({ job, cfg, r: JSON.parse(out.trim().split('\n').at(-1)) }) } catch { resolve({ job, cfg, r: { error: err.slice(0, 300) } }) } })
  })
}
export const DCOLS = ['engine', 'lex', 'grid', 'view', 'pairs', 'words', 'playable', 'dealt', 'beatsLost', 'stuck', 'frozen', 'frozenVis', 'repeatRate', 'bounceRate',
  'linkedVis', 'linkedAll', 'noteEarly', 'still60', 'top20', 'turnsPerMin', 'offTurnsPerMin', 'seenAll', 'frozen@10m', 'frozen@60m', 'GOOD', 'JUKUGO_LIKE', 'cfg']
if (import.meta.url === `file://${process.argv[1]}`) {
  const [jobsFile, outFile] = process.argv.slice(2)
  const jobs = JSON.parse(readFileSync(jobsFile, 'utf8'))
  const results = new Array(jobs.length)
  let next = 0
  async function worker() { while (next < jobs.length) { const i = next++; results[i] = await runOne(jobs[i]) } }
  await Promise.all(Array.from({ length: PAR }, worker))
  const lines = [DCOLS.join('\t')]
  for (const { job, cfg, r } of results) {
    const [g, j] = dverdict(r)
    const { name, seeds, horizontalOnly, slab, ...rest } = cfg
    const row = { ...r, engine: job.engine, lex: job.lex, stuck: r.frozen != null ? +Math.max(r.frozen, r.frozenVis).toFixed(3) : '', linkedAll: r.linked, GOOD: g, JUKUGO_LIKE: j, cfg: JSON.stringify(rest) }
    lines.push(DCOLS.map((c) => row[c] ?? '').join('\t'))
  }
  writeFileSync(outFile, lines.join('\n') + '\n')
  writeFileSync(outFile.replace(/\.tsv$/, '.jsonl'), results.map((x) => JSON.stringify({ engine: x.job.engine, lex: x.job.lex, ...x.r })).join('\n') + '\n')
  process.stderr.write(`${outFile}: ${results.length} rows\n`)
}
