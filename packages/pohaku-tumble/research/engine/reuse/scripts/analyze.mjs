// Summaries over a results jsonl: node analyze.mjs results/s2.jsonl
import { readFileSync } from 'node:fs'
import { verdict } from './verdict.mjs'
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse)
const byLex = new Map()
for (const r of rows) {
  r.v = verdict(r)
  if (!byLex.has(r.lex)) byLex.set(r.lex, [])
  byLex.get(r.lex).push(r)
}
const f = (r) => `${r.name.padEnd(22)} st=${r.stallRate} stk=${r.stuck} frz=${r.frozen} lk=${r.linked} rep=${r.repeatRate} flip=${r.flipRate} dupT=${r.dupTurn} dupV=${r.dupView} dupP=${r.dupViewPan} ${r.v}`
// score: distance past the GOOD thresholds (0 = meets GOOD)
const over = (r) => Math.max(0, r.stallRate - 0.05) / 0.05 + Math.max(0, r.stuck - 0.1) / 0.1 + Math.max(0, r.repeatRate - 0.2) / 0.2 + Math.max(0, 0.35 - r.linked) / 0.35 + Math.max(0, r.linked - 0.7) / 0.7
const overJ = (r) => Math.max(0, r.stallRate - 0.02) / 0.02 + Math.max(0, r.stuck - 0.03) / 0.03 + Math.max(0, r.repeatRate - 0.13) / 0.13 + Math.max(0, 0.4 - r.linked) / 0.4 + Math.max(0, r.linked - 0.65) / 0.65
for (const [lex, rs] of byLex) {
  const dealt = rs.filter((r) => r.v !== 'nodeal' && r.v !== 'error')
  console.log(`\n== ${lex}: ${rs.length} configs, ${dealt.length} deal every seed, GOOD ${dealt.filter((r) => r.v !== '-').length}, JUKUGO ${dealt.filter((r) => r.v === 'JUKUGO').length}`)
  console.log(' closest to GOOD:')
  for (const r of [...dealt].sort((a, b) => over(a) - over(b) || a.repeatRate - b.repeatRate).slice(0, 6)) console.log('  ' + f(r))
  console.log(' closest to JUKUGO-LIKE:')
  for (const r of [...dealt].sort((a, b) => overJ(a) - overJ(b) || a.repeatRate - b.repeatRate).slice(0, 4)) console.log('  ' + f(r))
}
