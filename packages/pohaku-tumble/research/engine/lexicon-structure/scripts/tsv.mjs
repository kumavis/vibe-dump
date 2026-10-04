// tsv.mjs — every simulation row from results-*.jsonl -> results.tsv, with GOOD / JUKUGO-LIKE verdicts.
// Columns: set = which batch; order/size = curve order and size (confirmed-list size; bridge* orders
// are attested + greedy picks); k = pruning (k0 none, k2 2-core, k2g 2-core's giant component,
// k3/k4 k-cores); lexicon = words the engine actually got; engine = stock (Jukugo rules, dealMin 1) /
// fix (dealMin 2, matchMin 2, retry 6) / jukugo5 (Jukugo exactly) / +L<x> = LINK_MAX x instead of
// 11.5; grid = cols x rows, "s" = keepSpacing (9x8 cell size, floor shrinks with the grid);
// V = JL / GOOD / - / nodeal; why = which GOOD thresholds fail.
import fs from 'node:fs'
import { verdict, why } from './verdict.mjs'
const here = new URL('.', import.meta.url).pathname
const cols = ['set', 'order', 'size', 'k', 'lexicon', 'engine', 'grid', 'pairs', 'occ', 'dealt', 'stallRate', 'stuck', 'stuckPerm', 'stuckBoard', 'linked', 'repeatRate', 'seenFrac', 'turnsPerPair', 'deg5', 'V', 'why', 'lexName']
const out = [cols.join('\t')]
for (const f of fs.readdirSync(here).filter((f) => /^results-.*\.jsonl$/.test(f)).sort()) {
  const set = f.replace(/^results-|\.jsonl$/g, '')
  for (const l of fs.readFileSync(here + f, 'utf8').trim().split('\n')) {
    const r = JSON.parse(l)
    r.set = set
    r.k = String(r.k).startsWith('k') ? r.k : `k${r.k}`
    r.V = verdict(r); r.why = why(r)
    out.push(cols.map((c) => r[c] ?? '').join('\t'))
  }
}
fs.writeFileSync(here + 'results.tsv', out.join('\n') + '\n')
console.log(out.length - 1, 'rows')
