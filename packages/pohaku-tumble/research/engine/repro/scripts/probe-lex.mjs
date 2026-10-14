// Print |playable|, LINK_MAX, COLLIDE, auto grid, and component sizes for one lexicon (LEX env).
const L = await import('./lexicon.pohaku.js')
const comps = new Map()
for (const e of L.PLAYABLE) comps.set(L.compSize(e), (comps.get(L.compSize(e)) ?? 0) + 1)
const g = L.autoGrid()
console.log(JSON.stringify({ lex: process.env.LEX.split('/').pop(), full: L.LEXICON.length, P: L.PLAYABLE.length, collide: +L.COLLIDE.toFixed(5), LINK_MAX: +L.LINK_MAX_RULE.toFixed(2), grid: `${g.cols}x${g.rows}`, target: g.target,
  comp: [...comps].sort((a, b) => b[0] - a[0]).map(([s, n]) => `${s}:${n / s}`).join(' '), okWords: L.PLAYABLE.filter((e) => L.compSize(e) >= 12).length, deg5ok: L.PLAYABLE.filter((e) => L.compSize(e) >= 12 && L.degree(e) >= 5).length }))
