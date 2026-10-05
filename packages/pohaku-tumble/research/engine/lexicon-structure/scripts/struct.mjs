// struct.mjs — structural summary of every ladder list -> struct.tsv
//   core2      size of the 2-core (k2 list); giant2 = its largest component (k2g list)
//   deg5       words with degree >= 5 in the unpruned list (Jukugo's deal pool)
//   meanDeg2   mean engine degree inside the 2-core
//   walkRep    walk.mjs board-free repeat estimate on the 2-core (predicts the sim's repeatRate)
//   collide    sum over roots of p_r^2, p_r = share of 2-core block faces showing root r: the chance
//              two random blocks show the same root (drives linked; Jukugo's own list: see last row)
//   topRoot    the most used root in the 2-core and the share of 2-core words that contain it
import fs from 'node:fs'
import { walkRepeat } from './walk.mjs'
import { stats } from './lexgraph.mjs'
const here = new URL('.', import.meta.url).pathname
const load = (f) => JSON.parse(fs.readFileSync(here + 'lex/ladder/' + f, 'utf8'))
function rootStats(list) {
  const c = new Map()
  for (const r of list) for (const p of r.parts) c.set(p, (c.get(p) ?? 0) + 1)
  const tot = list.length * 2
  let collide = 0
  for (const v of c.values()) collide += (v / tot) ** 2
  const words = new Map()
  for (const r of list) for (const p of new Set(r.parts)) words.set(p, (words.get(p) ?? 0) + 1)
  const [top, tn] = [...words.entries()].sort((a, b) => b[1] - a[1])[0] ?? ['', 0]
  return { collide, top, topShare: tn / Math.max(1, list.length) }
}
const cols = ['order', 'size', 'core2', 'giant2', 'deg5', 'meanDeg2', 'walkRep', 'collide', 'topRoot', 'topShare']
const out = [cols.join('\t')]
const files = fs.readdirSync(here + 'lex/ladder').filter((f) => f.endsWith('.k0.json'))
for (const f of files.sort((a, b) => a.localeCompare(b, 'en', { numeric: true }))) {
  const [, order, size] = f.match(/^(\w+)-(\d+)\./)
  const k0 = load(f), k2 = load(f.replace('.k0.', '.k2.')), k2g = load(f.replace('.k0.', '.k2g.'))
  const s2 = stats(k2.length ? k2 : k0)
  const rs = rootStats(k2)
  out.push([order, size, k2.length, k2g.length, stats(k0).deg5plus, k2.length ? s2.meanDeg : 0, walkRepeat(k2).walkRepeat.toFixed(3), rs.collide.toFixed(4), rs.top, rs.topShare.toFixed(3)].join('\t'))
}
const J = await import('packages/jukugo-tumble/src/lexicon.js')
const jl = J.LEXICON.map((e) => ({ word: e.word, parts: [e.a, e.b] }))
const jr = rootStats(jl)
out.push(['jukugo', jl.length, '', '', stats(jl).deg5plus, stats(jl).meanDeg, walkRepeat(jl).walkRepeat.toFixed(3), jr.collide.toFixed(4), jr.top, jr.topShare.toFixed(3)].join('\t'))
fs.writeFileSync(here + 'struct.tsv', out.join('\n') + '\n')
console.log(out.join('\n'))
