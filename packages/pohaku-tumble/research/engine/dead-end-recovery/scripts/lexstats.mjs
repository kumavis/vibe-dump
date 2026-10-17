// Graph facts about each tier that explain freezing: share of dead-end words (degree <= 1),
// mean degree, and the size of the 2-core (words left after repeatedly dropping degree <= 1).
// usage: node lexstats.mjs > lexstats.tsv
import { readFileSync } from 'node:fs'
const T = 'roots/.cache/tiers'
console.log(['tier', 'words', 'deg0', 'deg1', 'deg>=2', 'deg>=5', 'meanDeg', 'core2'].join('\t'))
for (const name of ['attested-WA', ...['realistic', 'random', 'best'].flatMap((o) => [128, 175, 225, 300, 400, 500, 650, 905].map((n) => `curve-${o}-${n}`))]) {
  const seen = new Set(), W = []
  for (const r of JSON.parse(readFileSync(`${T}/${name}.json`, 'utf8'))) if (!seen.has(r.word)) { seen.add(r.word); W.push({ word: r.word, a: r.parts[0], b: r.parts[1] }) }
  const nb = (alive) => {
    const kf = new Map(), ks = new Map()
    for (const e of W) if (alive.has(e.word)) { (kf.get(e.a) ?? kf.set(e.a, []).get(e.a)).push(e); (ks.get(e.b) ?? ks.set(e.b, []).get(e.b)).push(e) }
    return (e) => (kf.get(e.a)?.length ?? 1) - 1 + (ks.get(e.b)?.length ?? 1) - 1
  }
  const all = new Set(W.map((e) => e.word))
  const deg = nb(all)
  const d = W.map(deg)
  let alive = new Set(all)
  for (;;) { const dg = nb(alive); const drop = W.filter((e) => alive.has(e.word) && dg(e) <= 1); if (!drop.length) break; for (const e of drop) alive.delete(e.word) }
  console.log([name, W.length, d.filter((x) => x === 0).length, d.filter((x) => x === 1).length, d.filter((x) => x >= 2).length, d.filter((x) => x >= 5).length, (d.reduce((a, b) => a + b, 0) / W.length).toFixed(2), alive.size].join('\t'))
}
