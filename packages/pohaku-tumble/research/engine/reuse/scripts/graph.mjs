// Structure of the turn graph for a lexicon: connected components (words
// reachable from each other by single-block turns), degree spread, and the
// share of deg>=3 words sitting in small components (where a pair must cycle).
// node graph.mjs <tier> ...
import { readFileSync } from 'node:fs'
const TIERS = 'roots/.cache/tiers'
for (const t of process.argv.slice(2)) {
  const L = JSON.parse(readFileSync(`${TIERS}/${t}.json`, 'utf8'))
  const kf = new Map(), ks = new Map()
  const push = (m, k, v) => (m.get(k) ?? m.set(k, []).get(k)).push(v)
  L.forEach((r, i) => { push(kf, r.parts[0], i); push(ks, r.parts[1], i) })
  const nb = L.map((r, i) => [...kf.get(r.parts[0]), ...ks.get(r.parts[1])].filter((j) => j !== i))
  const comp = new Array(L.length).fill(-1)
  const sizes = []
  for (let i = 0; i < L.length; i++) {
    if (comp[i] >= 0) continue
    const st = [i]; comp[i] = sizes.length; let n = 0
    while (st.length) { const x = st.pop(); n++; for (const y of nb[x]) if (comp[y] < 0) { comp[y] = sizes.length; st.push(y) } }
    sizes.push(n)
  }
  const big = Math.max(...sizes)
  const inBig = L.filter((_, i) => sizes[comp[i]] === big).length
  const d3 = L.map((_, i) => i).filter((i) => nb[i].length >= 3)
  const d3small = d3.filter((i) => sizes[comp[i]] < 12).length
  const hist = {}
  for (const s of sizes) if (s > 1) hist[s] = (hist[s] ?? 0) + 1
  console.log(`${t}: words ${L.length}, components>1 ${sizes.filter((s) => s > 1).length}, isolated ${sizes.filter((s) => s === 1).length}, giant ${big} (${(inBig / L.length * 100).toFixed(0)}%), deg>=3 ${d3.length} of which in comps<12: ${d3small}; comp sizes ${JSON.stringify(hist)}`)
}
