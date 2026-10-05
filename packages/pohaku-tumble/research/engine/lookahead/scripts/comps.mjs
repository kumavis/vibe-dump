// Component size distribution of the turn graph for tier files (sizes >= 2, descending),
// plus how many pendant (degree-1) words sit inside the largest component.
import fs from 'node:fs'
const T = 'roots/.cache/tiers'
for (const f of process.argv.slice(2)) {
  const rows = JSON.parse(fs.readFileSync(`${T}/${f}.json`, 'utf8'))
  const seen = new Set(), L = []
  for (const r of rows) { if (seen.has(r.word)) continue; seen.add(r.word); L.push({ word: r.word, a: r.parts[0], b: r.parts[1] }) }
  const byA = new Map(), byB = new Map(); const push = (m, k, v) => { if (!m.has(k)) m.set(k, []); m.get(k).push(v) }
  for (const e of L) { push(byA, e.a, e); push(byB, e.b, e) }
  const nb = (e) => [...byB.get(e.b), ...byA.get(e.a)].filter((x) => x !== e)
  const comp = new Map(); const comps = []
  for (const e of L) { if (comp.has(e)) continue; const c = []; const st = [e]; comp.set(e, c); while (st.length) { const x = st.pop(); c.push(x); for (const y of nb(x)) if (!comp.has(y)) { comp.set(y, c); st.push(y) } } comps.push(c) }
  comps.sort((a, b) => b.length - a.length)
  const g = comps[0]
  const gdeg = g.map((e) => nb(e).length)
  console.log(f.padEnd(22), 'sizes>=2:', comps.filter((c) => c.length >= 2).map((c) => c.length).join(' '), '| giant deg1:', gdeg.filter((d) => d === 1).length, 'deg>=5:', gdeg.filter((d) => d >= 5).length, 'mean deg', (gdeg.reduce((a, b) => a + b, 0) / g.length).toFixed(1))
}
