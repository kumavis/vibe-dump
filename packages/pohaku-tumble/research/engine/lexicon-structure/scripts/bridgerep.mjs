// bridgerep.mjs — a third checking order aimed at the metric that actually binds (repeats), with a
// cap on hub dominance. Greedy from the 128 attested (sense-keyed). At each step:
//   1. shortlist: the 20 candidates with the largest S6 gain and the 20 with the largest gain in
//      total 2-core degree (see bridges.mjs for S6);
//   2. score each shortlisted list by  walkRep(2-core)  (walk.mjs, 30k steps, one seed per step for
//      every candidate = common random numbers)  + 2 * max(0, topShare - CAP)  +  0.5 * max(0, collide - 0.012)/0.012
//      topShare = share of 2-core words containing the most used root; collide = sum_r p_r^2;
//   3. add the candidate with the lowest score.
// CAP = 0.12 (bridgeS6 stays near 0.10; the `best` order reaches 0.38 with kū).
// usage: node bridgerep.mjs [steps=400]  -> lex/bridge-rep-order.json, bridges-rep.tsv
import fs from 'node:fs'
import { TIERS, loadList, index, kcoreMask } from './lexgraph.mjs'
import { walkRepeat } from './walk.mjs'
const here = new URL('.', import.meta.url).pathname
const STEPS = Number(process.argv[2] ?? 400)
const CAP = 0.12
const base = loadList(`${TIERS}/curve-realistic-128.json`)
const baseWords = new Set(base.map((r) => r.word))
const cands = loadList(`${TIERS}/core-morph.json`).filter((r) => !baseWords.has(r.word))

function core2(list) {
  const ix = index(list)
  const alive = kcoreMask(ix, 2)
  const core = []
  let S6 = 0, degSum = 0
  for (let i = 0; i < list.length; i++) {
    if (!alive[i]) continue
    core.push(list[i])
    const r = list[i]
    let d = 0
    for (const j of ix.first.get(r.parts[0])) if (j !== i && alive[j]) d++
    for (const j of ix.second.get(r.parts[1])) if (j !== i && alive[j]) d++
    S6 += Math.min(d, 6) / 6; degSum += d
  }
  return { core, S6, degSum }
}
function rootStats(list) {
  const c = new Map(), w = new Map()
  for (const r of list) { for (const p of r.parts) c.set(p, (c.get(p) ?? 0) + 1); for (const p of new Set(r.parts)) w.set(p, (w.get(p) ?? 0) + 1) }
  let collide = 0
  for (const v of c.values()) collide += (v / (2 * list.length)) ** 2
  return { collide, topShare: Math.max(...w.values()) / list.length }
}
let cur = [...base]
let remaining = [...cands]
const lines = [['rank', 'word', 'parts', 'score', 'walkRep', 'core2', 'topShare', 'collide'].join('\t')]
const t0 = Date.now()
for (let step = 0; step < STEPS && remaining.length; step++) {
  const roots = new Set(cur.flatMap((r) => r.parts))
  const curC = core2(cur)
  const evals = []
  for (const c of remaining) {
    if (!roots.has(c.parts[0]) && !roots.has(c.parts[1])) continue
    const s = core2([...cur, c])
    evals.push({ c, dS6: s.S6 - curC.S6, dDeg: s.degSum - curC.degSum, core: s.core })
  }
  if (!evals.length) break
  const short = new Set([...evals].sort((a, b) => b.dS6 - a.dS6).slice(0, 20).concat([...evals].sort((a, b) => b.dDeg - a.dDeg).slice(0, 20)))
  let best = null
  for (const e of short) {
    const wr = walkRepeat(e.core, { steps: 30000, seed: 100 + step }).walkRepeat
    const rs = rootStats(e.core)
    const score = wr + 2 * Math.max(0, rs.topShare - CAP) + 0.5 * Math.max(0, rs.collide - 0.012) / 0.012
    if (!best || score < best.score) best = { ...e, score, wr, rs }
  }
  cur.push(best.c)
  remaining = remaining.filter((r) => r !== best.c)
  lines.push([step + 1, best.c.word, best.c.parts.join(' + '), best.score.toFixed(3), best.wr.toFixed(3), best.core.length, best.rs.topShare.toFixed(3), best.rs.collide.toFixed(4)].join('\t'))
}
// append the rest in bridgeS6 order so the file covers every size
const s6 = JSON.parse(fs.readFileSync(here + 'lex/bridge-S6-order.json', 'utf8'))
const have = new Set(cur.map((r) => r.word))
for (const r of s6) if (!have.has(r.word)) cur.push(r)
fs.writeFileSync(here + 'lex/bridge-rep-order.json', JSON.stringify(cur))
fs.writeFileSync(here + 'bridges-rep.tsv', lines.join('\n') + '\n')
process.stderr.write(`bridgeRep: ${lines.length - 1} steps in ${((Date.now() - t0) / 1000).toFixed(0)} s\n`)
