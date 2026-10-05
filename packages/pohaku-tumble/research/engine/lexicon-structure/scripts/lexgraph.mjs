// lexgraph.mjs — the turn graph of a word list, with the same definitions as Jukugo's lexicon.js:
//   turns(w, 0) = other words with the same SECOND root (w's first block turns)
//   turns(w, 1) = other words with the same FIRST root  (w's second block turns)
//   degree(w)   = |turns(w,0)| + |turns(w,1)|
// Roots are compared as exact strings (sense ids, e.g. "lua#1"). The graph's nodes are words; two
// words are adjacent when one turn takes one to the other. Each root-in-a-position is a clique.
import fs from 'node:fs'

export const TIERS = 'roots/.cache/tiers'

export function loadList(path) {
  const seen = new Set()
  const out = []
  for (const r of JSON.parse(fs.readFileSync(path, 'utf8'))) {
    if (seen.has(r.word)) continue
    seen.add(r.word)
    out.push({ word: r.word, parts: [r.parts[0], r.parts[1]] })
  }
  return out
}

// Index a list (array of {word, parts}); returns helpers over word indices.
export function index(list) {
  const first = new Map() // root -> [i] words with that first root
  const second = new Map()
  const push = (m, k, v) => { let l = m.get(k); if (!l) m.set(k, (l = [])); l.push(v) }
  list.forEach((r, i) => { push(first, r.parts[0], i); push(second, r.parts[1], i) })
  const deg = list.map((r) => first.get(r.parts[0]).length - 1 + second.get(r.parts[1]).length - 1)
  const nbrs = (i) => {
    const r = list[i]
    const s = new Set([...first.get(r.parts[0]), ...second.get(r.parts[1])])
    s.delete(i)
    return [...s]
  }
  return { list, first, second, deg, nbrs }
}

// Engine degree restricted to an alive mask.
function degAlive(ix, alive, i) {
  const r = ix.list[i]
  let d = 0
  for (const j of ix.first.get(r.parts[0])) if (j !== i && alive[j]) d++
  for (const j of ix.second.get(r.parts[1])) if (j !== i && alive[j]) d++
  return d
}

// k-core by engine degree: iteratively drop words with fewer than k turns among the survivors.
export function kcoreMask(ix, k) {
  const n = ix.list.length
  const alive = new Array(n).fill(true)
  const d = ix.list.map((_, i) => degAlive(ix, alive, i))
  const queue = []
  for (let i = 0; i < n; i++) if (d[i] < k) { alive[i] = false; queue.push(i) }
  while (queue.length) {
    const i = queue.pop()
    const r = ix.list[i]
    for (const j of [...ix.first.get(r.parts[0]), ...ix.second.get(r.parts[1])]) {
      if (j === i || !alive[j]) continue
      if (--d[j] < k) { alive[j] = false; queue.push(j) }
    }
  }
  return alive
}

export function kcore(list, k) {
  const ix = index(list)
  const alive = kcoreMask(ix, k)
  return list.filter((_, i) => alive[i])
}

export function components(ix, alive = null) {
  const n = ix.list.length
  const parent = [...Array(n).keys()]
  const find = (i) => (parent[i] === i ? i : (parent[i] = find(parent[i])))
  const unite = (l) => { const ls = alive ? l.filter((j) => alive[j]) : l; for (let k = 1; k < ls.length; k++) { const a = find(ls[0]), b = find(ls[k]); if (a !== b) parent[a] = b } }
  for (const l of ix.first.values()) unite(l)
  for (const l of ix.second.values()) unite(l)
  const size = new Map()
  for (let i = 0; i < n; i++) if (!alive || alive[i]) size.set(find(i), (size.get(find(i)) ?? 0) + 1)
  return [...size.values()].sort((a, b) => b - a)
}

export function stats(list) {
  const ix = index(list)
  const n = list.length
  const deg = ix.deg
  const roots = new Set(list.flatMap((r) => r.parts))
  const comps = components(ix)
  const cores = {}
  let degeneracy = 0
  for (let k = 1; k <= 12; k++) {
    const m = kcoreMask(ix, k)
    cores[k] = m.filter(Boolean).length
    if (cores[k]) degeneracy = k
  }
  const m2 = kcoreMask(ix, 2)
  const comps2 = components(ix, m2)
  const sorted = [...deg].sort((a, b) => a - b)
  // root classes per position, and how many roots could ever link (appear on >= 2 words)
  const rootUse = new Map()
  for (const r of list) for (const p of new Set(r.parts)) rootUse.set(p, (rootUse.get(p) ?? 0) + 1)
  return {
    n,
    roots: roots.size,
    linkableRoots: [...rootUse.values()].filter((c) => c >= 2).length,
    deg0: deg.filter((d) => d === 0).length,
    deg1: deg.filter((d) => d === 1).length,
    deg2: deg.filter((d) => d === 2).length,
    deg3_4: deg.filter((d) => d >= 3 && d <= 4).length,
    deg5plus: deg.filter((d) => d >= 5).length,
    degGE2: deg.filter((d) => d >= 2).length,
    meanDeg: +(deg.reduce((a, b) => a + b, 0) / n).toFixed(2),
    medianDeg: sorted[Math.floor(n / 2)],
    comps: comps.length,
    compsGE2: comps.filter((c) => c >= 2).length,
    giant: comps[0],
    second: comps[1] ?? 0,
    core: cores,
    degeneracy,
    core2comps: comps2.length,
    core2giant: comps2[0] ?? 0,
  }
}
