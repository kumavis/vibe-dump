// annotate-bridges.mjs — bridges.tsv: the top 60 of the S6 greedy order (bridges-S6-full.tsv), with
// where the same word ranks in the two other orders (core2 greedy, walk-targeted bridgeRep) and the
// glosses of its two roots from roots.tsv, so a dictionary check can start at the top.
//   gain        = S6 gain at that greedy step (see bridges.mjs), assuming every earlier pick confirmed
//   solo_*      = gain if this word ALONE is added to the 128 attested
//   rank_core2 / rank_rep = rank in bridges-core2-full.tsv / bridges-rep.tsv ('' = not in its top 400)
//   consensus   = how many of the three orders put the word in their top 60
//   root_a_words / root_b_words = how many core candidates (905) use that root in that position
//   (a big number on a modifier like hewa, wale, ʻole means the stone would link many words that only
//   share "wrong" / "without cause" / "not" — worth a look in the language check, cf. hoʻo- in ROOTS.md)
import fs from 'node:fs'
import { TIERS, loadList } from './lexgraph.mjs'
const here = new URL('.', import.meta.url).pathname
const read = (f) => { const [h, ...ls] = fs.readFileSync(here + f, 'utf8').trim().split('\n'); const hs = h.split('\t'); return ls.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [hs[i], v]))) }
const s6 = read('bridges-S6-full.tsv')
const c2 = read('bridges-core2-full.tsv')
const rep = read('bridges-rep.tsv')
const rankOf = (rows, key = 'word') => new Map(rows.map((r, i) => [r[key], i + 1]))
const rc2 = rankOf(c2), rrep = rankOf(rep)
const gloss = new Map()
for (const l of fs.readFileSync('roots/roots.tsv', 'utf8').trim().split('\n').slice(1)) {
  const c = l.split('\t')
  gloss.set(c[0], c[4])
}
const core = loadList(`${TIERS}/core-morph.json`)
const posCount = [new Map(), new Map()]
for (const r of core) for (const i of [0, 1]) posCount[i].set(r.parts[i], (posCount[i].get(r.parts[i]) ?? 0) + 1)
const senseGloss = (part) => {
  const [root, sense] = part.split('#')
  const g = (gloss.get(root) ?? '').split(' ‖ ')
  return (sense != null ? g[Number(sense)] : g[0])?.slice(0, 50) ?? ''
}
const cols = ['word', 'parts', 'gain', 'rank', 'solo_core2', 'solo_S6', 'core2_after', 'rank_core2', 'rank_rep', 'consensus', 'root_a_words', 'root_b_words', 'gloss_a', 'gloss_b', 'hawwiki_uses', 'flags', 'andrews_1922']
const out = [cols.join('\t')]
for (const r of s6.slice(0, 60)) {
  const parts = r.parts.split(' + ')
  const ranks = [Number(r.rank), rc2.get(r.word), rrep.get(r.word)]
  out.push([r.word, r.parts, r.gain, r.rank, r.solo_core2, r.solo_S6, r.core2_after, rc2.get(r.word) ?? '', rrep.get(r.word) ?? '', ranks.filter((x) => x && x <= 60).length,
    posCount[0].get(parts[0]) ?? 0, posCount[1].get(parts[1]) ?? 0, senseGloss(parts[0]), senseGloss(parts[1]), r.hawwiki_uses, r.flags, r.andrews_1922].join('\t'))
}
fs.writeFileSync(here + 'bridges.tsv', out.join('\n') + '\n')
console.log(out.slice(0, 8).map((l) => l.split('\t').slice(0, 14).join(' | ')).join('\n'))
