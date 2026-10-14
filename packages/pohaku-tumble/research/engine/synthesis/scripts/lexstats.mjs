// Turn-graph facts per lexicon, before and after 2-core pruning.
//   LEX=<file|jukugo> node lexstats.mjs  → one TSV line
// words, deg>=1, deg>=5, playable (2-core), giant component of the 2-core, collide (2-core), linkAuto
const name = process.env.NAME ?? process.env.LEX
globalThis.SIM = { prune: 0 }
const a = await import('./lexicon.sim.js?a')
globalThis.SIM = { prune: 2 }
const b = await import('./lexicon.sim.js?b')
const d = (m, k) => m.LEXICON.filter((e) => m.degree(e) >= k).length
console.log([name, a.LEXICON.length, d(a, 1), d(a, 5), b.LEXICON.length, b.GIANT, d(b, 5), a.COLLIDE.toFixed(4), b.COLLIDE.toFixed(4), b.linkAuto().toFixed(2)].join('\t'))
