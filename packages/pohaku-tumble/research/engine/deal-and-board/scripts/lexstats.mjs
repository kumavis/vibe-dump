// Structure of each lexicon's turn graph: two words are neighbours when one
// turn (one block, other block kept in place) takes one to the other.
//   deg0..deg5+  how many words have that many turns
//   core2/core3  size of the k-core (every word keeps >= k turns inside it)
//   giant        largest connected component
//   trapsReach   words of degree 1: a pair that arrives on one can never turn
//                again under Jukugo's no-immediate-return rule
// Usage: node lexstats.mjs file.json [...]   (or "jukugo")
import fs from 'node:fs'

export function load(path) {
  if (path === 'jukugo') return null
  const seen = new Set()
  const out = []
  for (const r of JSON.parse(fs.readFileSync(path, 'utf8'))) {
    if (seen.has(r.word)) continue
    seen.add(r.word)
    out.push({ word: r.word, a: r.parts[0], b: r.parts[1] })
  }
  return out
}

export function graph(lex) {
  const byA = new Map(), byB = new Map()
  const push = (m, k, v) => (m.get(k) ?? m.set(k, []).get(k)).push(v)
  lex.forEach((e, i) => { push(byA, e.a, i); push(byB, e.b, i) })
  return lex.map((e, i) => [...byB.get(e.b), ...byA.get(e.a)].filter((j) => j !== i))
}

export function kcore(adj, k) {
  const alive = adj.map(() => true)
  const deg = adj.map((n) => n.length)
  const q = []
  deg.forEach((d, i) => { if (d < k) { alive[i] = false; q.push(i) } })
  while (q.length) {
    const i = q.pop()
    for (const j of adj[i]) if (alive[j] && --deg[j] < k) { alive[j] = false; q.push(j) }
  }
  return alive
}

function giant(adj) {
  const comp = adj.map(() => -1)
  let best = 0
  for (let s = 0; s < adj.length; s++) {
    if (comp[s] >= 0) continue
    let n = 0
    const st = [s]
    comp[s] = s
    while (st.length) {
      const i = st.pop(); n++
      for (const j of adj[i]) if (comp[j] < 0) { comp[j] = s; st.push(j) }
    }
    best = Math.max(best, n)
  }
  return best
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const cols = ['file', 'words', 'roots', 'deg0', 'deg1', 'deg2', 'deg3_4', 'deg5+', 'meanDeg', 'core2', 'core3', 'giant']
  console.log(cols.join('\t'))
  for (const f of process.argv.slice(2)) {
    const lex = load(f)
    const adj = graph(lex)
    const d = adj.map((n) => n.length)
    const roots = new Set(lex.flatMap((e) => [e.a, e.b])).size
    const c = (lo, hi) => d.filter((x) => x >= lo && x <= hi).length
    const row = [f.split('/').pop().replace('.json', ''), lex.length, roots, c(0, 0), c(1, 1), c(2, 2), c(3, 4), c(5, 1e9),
      (d.reduce((s, x) => s + x, 0) / d.length).toFixed(2), kcore(adj, 2).filter(Boolean).length, kcore(adj, 3).filter(Boolean).length, giant(adj)]
    console.log(row.join('\t'))
  }
}
