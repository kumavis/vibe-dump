// Min viable sizes from curve TSVs (sim or Director model).
//   node analyze.mjs out.tsv file.tsv [file.tsv ...]
// For each engine × order × grid: GOOD_first / JL_first = smallest size meeting the verdict;
// GOOD / JL (stable) = smallest size from which every larger measured size also meets it.
// The 128 point of every order is curve-<order>-128 (the same 128 words, sense-keyed roots).
import { readFileSync, writeFileSync } from 'node:fs'
const [out, ...files] = process.argv.slice(2)
const rows = files.flatMap((f) => {
  const [head, ...lines] = readFileSync(f, 'utf8').trim().split('\n')
  const cols = head.split('\t')
  return lines.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v])))
})
const gridOf = (r) => (r.cfg.includes('autoGrid') ? 'auto' : r.grid)
const parse = (lex) => { const m = /curve-(\w+)-(\d+)/.exec(lex); return m ? { order: m[1], n: +m[2] } : null }
const groups = new Map()
for (const r of rows) {
  const p = parse(r.lex)
  if (!p) continue
  const k = `${r.engine}\t${p.order}\t${gridOf(r)}`
  if (!groups.has(k)) groups.set(k, [])
  groups.get(k).push({ n: p.n, r })
}
const lines = [['engine', 'order', 'grid', 'sizes', 'GOOD', 'JUKUGO_LIKE', 'GOOD_first', 'JUKUGO_LIKE_first'].join('\t')]
for (const [k, pts] of groups) {
  pts.sort((a, b) => a.n - b.n)
  const first = (key) => pts.find((p) => p.r[key] === 'yes')?.n ?? ''
  const stable = (key) => { let s = ''; for (let i = pts.length - 1; i >= 0 && pts[i].r[key] === 'yes'; i--) s = pts[i].n; return s }
  lines.push([k, pts.map((p) => p.n).join(','), stable('GOOD'), stable('JUKUGO_LIKE'), first('GOOD'), first('JUKUGO_LIKE')].join('\t'))
}
writeFileSync(out, lines.join('\n') + '\n')
console.log(lines.join('\n'))
