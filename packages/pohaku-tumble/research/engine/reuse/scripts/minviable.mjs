// For each (rule set, grid, curve order): the smallest curve size meeting GOOD
// and JUKUGO-LIKE, scanning upward. "monotone" = also met at every larger size
// measured. node minviable.mjs results/s3.jsonl
import { readFileSync } from 'node:fs'
import { verdict } from './verdict.mjs'
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse)
const key = new Map()
for (const r of rows) {
  const m = r.lex.match(/^curve-(\w+)-(\d+)$/)
  if (!m) continue
  const k = `${r.name}|${r.grid}|${m[1]}`
  if (!key.has(k)) key.set(k, [])
  key.get(k).push({ n: +m[2], v: verdict(r), r })
}
const out = []
for (const [k, list] of key) {
  list.sort((a, b) => a.n - b.n)
  const first = (ok) => list.find((x, i) => ok(x.v) && list.slice(i).every((y) => ok(y.v)))?.n ?? null
  const good = first((v) => v === 'GOOD' || v === 'JUKUGO')
  const jl = first((v) => v === 'JUKUGO')
  const [name, grid, order] = k.split('|')
  out.push({ name, grid, order, good, jl, sizes: list.map((x) => `${x.n}:${x.v === 'JUKUGO' ? 'J' : x.v === 'GOOD' ? 'G' : x.v === 'nodeal' ? 'x' : '.'}`).join(' ') })
}
out.sort((a, b) => a.order.localeCompare(b.order) || a.grid.localeCompare(b.grid) || (a.good ?? 9999) - (b.good ?? 9999) || (a.jl ?? 9999) - (b.jl ?? 9999))
console.log(['order', 'grid', 'rules', 'GOOD>=', 'JUKUGO>=', 'per size (G good, J jukugo-like, x no deal, . neither)'].join('\t'))
for (const o of out) console.log([o.order, o.grid, o.name.padEnd(18), o.good ?? '-', o.jl ?? '-', o.sizes].join('\t'))
