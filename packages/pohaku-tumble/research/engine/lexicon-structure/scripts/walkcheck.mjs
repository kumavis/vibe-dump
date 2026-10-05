// walkcheck.mjs — how well walk.mjs's board-free walkRepeat predicts the sim's repeatRate.
// Prints per-list walkRepeat next to the sim repeat for fix on 9x8 and 6x4s; writes walkcheck.tsv.
import fs from 'node:fs'
import { walkRepeat } from './walk.mjs'
const here = new URL('.', import.meta.url).pathname
const rows = fs.readFileSync(here + 'results-main.jsonl', 'utf8').trim().split('\n').map(JSON.parse)
const out = [['list', 'k', 'n', 'walkRepeat', 'sim_9x8', 'sim_7x6s', 'sim_6x4s'].join('\t')]
const xs = [], ys = []
for (const name of fs.readdirSync(here + 'lex').filter((f) => f.endsWith('.json')).sort()) {
  const list = JSON.parse(fs.readFileSync(here + 'lex/' + name, 'utf8'))
  if (list.length < 30) continue
  const lexName = name.replace(/\.json$/, '')
  const w = walkRepeat(list).walkRepeat
  const sim = (g) => rows.find((r) => r.lexName === lexName && r.grid === g && r.engine === 'fix' && r.dealt.startsWith('10/'))?.repeatRate ?? ''
  const s9 = sim('9x8')
  out.push([lexName, lexName.split('.k')[1], list.length, w.toFixed(3), s9, sim('7x6s'), sim('6x4s')].join('\t'))
  if (s9 !== '') { xs.push(w); ys.push(s9) }
}
const mean = (a) => a.reduce((s, x) => s + x, 0) / a.length
const mx = mean(xs), my = mean(ys)
const r = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0) * ys.reduce((s, y) => s + (y - my) ** 2, 0))
const mae = mean(xs.map((x, i) => Math.abs(x - ys[i])))
out.push(`# pearson r (walkRepeat vs sim 9x8 fix) = ${r.toFixed(3)}, mean abs diff = ${mae.toFixed(3)}, n = ${xs.length}`)
fs.writeFileSync(here + 'walkcheck.tsv', out.join('\n') + '\n')
console.log(out.join('\n'))
