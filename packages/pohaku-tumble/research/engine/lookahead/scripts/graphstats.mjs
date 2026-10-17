// Turn-graph statistics for a tier file: degree histogram, connected components
// of the turn graph (words linked when one turn apart), and how many words sit
// in components small enough that a walking pair must revisit (<= 7 words).
import fs from 'node:fs'
const T = 'roots/.cache/tiers'
const files = process.argv.slice(2)
console.log(['tier','words','deg0','deg1','deg2','deg3-4','deg>=5','comps(>=2)','largest','inSmall<=7','inLargest'].join('\t'))
for (const f of files) {
  const rows = JSON.parse(fs.readFileSync(`${T}/${f}.json`, 'utf8'))
  const seen = new Set(), L = []
  for (const r of rows) { if (seen.has(r.word)) continue; seen.add(r.word); L.push({ word: r.word, a: r.parts[0], b: r.parts[1] }) }
  const byA = new Map(), byB = new Map()
  const push = (m, k, v) => { if (!m.has(k)) m.set(k, []); m.get(k).push(v) }
  for (const e of L) { push(byA, e.a, e); push(byB, e.b, e) }
  const nb = (e) => [...byB.get(e.b), ...byA.get(e.a)].filter((x) => x !== e)
  const deg = L.map((e) => nb(e).length)
  const comp = new Map(); let nc = 0; const sizes = []
  for (const e of L) {
    if (comp.has(e)) continue
    const st = [e]; comp.set(e, nc); let sz = 0
    while (st.length) { const x = st.pop(); sz++; for (const y of nb(x)) if (!comp.has(y)) { comp.set(y, nc); st.push(y) } }
    sizes.push(sz); nc++
  }
  const big = sizes.filter((s) => s >= 2)
  console.log([f, L.length, deg.filter((d) => d === 0).length, deg.filter((d) => d === 1).length, deg.filter((d) => d === 2).length,
    deg.filter((d) => d >= 3 && d <= 4).length, deg.filter((d) => d >= 5).length, big.length, Math.max(...sizes),
    sizes.filter((s) => s >= 2 && s <= 7).reduce((a, b) => a + b, 0), Math.max(...sizes)].join('\t'))
}
