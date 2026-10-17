// What the 2-core costs in words: deg0 words can never appear under stock rules either
// (no turn reaches them and the deal skips them at dealMin >= 1); "lost" is what the
// 2-core removes beyond those. Usage: node corecost.mjs file.json ...
import { load, graph, kcore } from './lexstats.mjs'
console.log('file\twords\tdeg0\tdeg1\tcore2\tlost_beyond_deg0\tcore2_deg5+\tauto_pairs_occ0.10')
for (const f of process.argv.slice(2)) {
  const lex = load(f), adj = graph(lex), alive = kcore(adj, 2)
  const core = lex.filter((_, i) => alive[i])
  const cadj = graph(core)
  const deg0 = adj.filter((n) => n.length === 0).length
  const deg1 = adj.filter((n) => n.length === 1).length
  console.log([f.split('/').pop().replace('.json', ''), lex.length, deg0, deg1, core.length, lex.length - deg0 - core.length, cadj.filter((n) => n.length >= 5).length, Math.max(10, Math.min(65, Math.round(0.1 * core.length)))].join('\t'))
}
