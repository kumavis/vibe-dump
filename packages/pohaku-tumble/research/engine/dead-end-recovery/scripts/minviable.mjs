// Smallest curve size meeting GOOD / JUKUGO-LIKE per (config, order, grid), from sim2 results.
// "smallest" = the smallest measured size from which every larger measured size also passes
// (first-pass size in brackets when it differs). usage: node minviable.mjs res-final.jsonl
import { readFileSync, writeFileSync } from 'node:fs'
import { verdict } from './judge.mjs'
const rows = process.argv.slice(2).flatMap((f) => readFileSync(f, 'utf8').trim().split('\n').map(JSON.parse)).filter((r) => r.driver === 'sim2' && r.lexFile.startsWith('curve-'))
const groups = new Map()
for (const r of rows) {
  const order = r.lexFile.split('-')[1]
  const k = `${r.tag}\t${order}\t${r.cfg.gridName}`
  if (!groups.has(k)) groups.set(k, [])
  groups.get(k).push(r)
}
const out = [['config', 'order', 'grid', 'good', 'good_first', 'jukugo_like', 'jukugo_first'].join('\t')]
const res = []
for (const [k, rs] of groups) {
  rs.sort((a, b) => a.lexicon - b.lexicon)
  const pass = (lvl) => rs.map((r) => { const v = verdict(r); return lvl === 'G' ? v === 'G' || v === 'J' : v === 'J' })
  const mono = (p) => { let i = p.length; while (i > 0 && p[i - 1]) i--; return i < p.length ? rs[i].lexicon : null }
  const first = (p) => { const i = p.indexOf(true); return i >= 0 ? rs[i].lexicon : null }
  const g = pass('G'), j = pass('J')
  const [tag, order, grid] = k.split('\t')
  res.push({ tag, order, grid, good: mono(g), goodFirst: first(g), jl: mono(j), jlFirst: first(j) })
  out.push([tag, order, grid, mono(g) ?? '-', first(g) ?? '-', mono(j) ?? '-', first(j) ?? '-'].join('\t'))
}
writeFileSync('minviable.tsv', out.join('\n') + '\n')
console.log(out.join('\n'))
