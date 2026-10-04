// eval.mjs — apply the viability thresholds to result rows, write results.tsv, print min_viable.
//   node eval.mjs results/matrix.jsonl [more.jsonl ...]   → results.tsv (all rows) + min-viable table on stdout
//
// Thresholds (task spec), measured on 10 seeds × 3600 s (≈1,750 background beats):
//   GOOD        dealt every seed; beatsLost ≤ 0.05; stuck ≤ 0.10; repeat ≤ 0.20; linked 0.35–0.70
//   JUKUGO-LIKE dealt every seed; beatsLost ≤ 0.02; stuck ≤ 0.03; repeat ≤ 0.13; linked 0.40–0.65
// with, in the Director model:
//   beatsLost = background beats on which nothing turned (chosen pair had no legal turn after any
//               retries, or no idle in-view pair existed) / all background beats
//   stuck     = max(frozen, frozenVis): the larger of the mean share of all pairs, and of in-view pairs,
//               that could not turn under the config's own rules (sampled every 10 s)
//   repeat    = share of turns landing on a word the pair showed in its previous 6 (bounces included)
//   linked    = Board.linkedFraction() (share of all pairs on a root line), sampled every 2 s
import { readFileSync, writeFileSync } from 'node:fs'
const files = process.argv.slice(2)
const rows = files.flatMap((f) => readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse))

export function judge(r) {
  const [a, b] = r.dealt.split('/').map(Number)
  if (a !== b || !b) return { stuck: null, good: false, jukugo: false }
  const stuck = Math.max(r.frozen, r.frozenVis ?? 0)
  const good = r.beatsLost <= 0.05 && stuck <= 0.1 && r.repeatRate <= 0.2 && r.linked >= 0.35 && r.linked <= 0.7
  const jukugo = r.beatsLost <= 0.02 && stuck <= 0.03 && r.repeatRate <= 0.13 && r.linked >= 0.4 && r.linked <= 0.65
  return { stuck, good, jukugo }
}
const parse = (lex) => {
  if (lex === 'attested-WA') return { order: 'attested', size: 128 }
  const m = /^curve-(\w+)-(\d+)$/.exec(lex)
  return m ? { order: m[1], size: +m[2] } : { order: lex, size: null }
}
const cols = ['variant', 'lexName', 'order', 'size', 'grid', 'view', 'dealt', 'pairs', 'visible', 'everVis', 'bgBeats',
  'beatsLost', 'lostNoTurn', 'lostEmpty', 'stuck', 'frozen', 'frozenVis', 'dead', 'frozen@10m', 'frozen@60m',
  'noteEarly', 'noteZero', 'noteDrift', 'noteDone', 'notesPerMin', 'linked', 'linkedVis', 'repeatRate', 'bounceRate', 'seenFrac',
  'top20', 'top20rate', 'idle', 'still60', 'turnsPerMin', 'noteTurnShare', 'GOOD', 'JUKUGO']
const out = [cols.join('\t')]
for (const r of rows) {
  const j = judge(r)
  const p = parse(r.lexName)
  const full = { ...r, ...p, stuck: j.stuck == null ? '' : +j.stuck.toFixed(3), GOOD: j.good ? 'Y' : '', JUKUGO: j.jukugo ? 'Y' : '' }
  out.push(cols.map((c) => full[c] ?? '').join('\t'))
}
writeFileSync(new URL('./results.tsv', import.meta.url), out.join('\n') + '\n')

// min viable: smallest curve size from which every larger size on that curve also passes
const SIZES = [128, 175, 225, 300, 400, 500, 650, 905]
const key = (r) => `${r.variant}|${r.grid}|${r.view}`
const groups = new Map()
for (const r of rows) {
  const p = parse(r.lexName)
  if (!p.size) continue
  const orders = p.order === 'attested' ? ['realistic', 'random', 'best'] : [p.order]
  for (const o of orders) {
    const k = `${key(r)}|${o}`
    if (!groups.has(k)) groups.set(k, new Map())
    groups.get(k).set(p.size, judge(r))
  }
}
const minv = []
for (const [k, m] of groups) {
  const [variant, grid, view, order] = k.split('|')
  const sizes = SIZES.filter((s) => m.has(s))
  if (sizes.length < SIZES.length) continue
  const first = (f) => {
    let best = null
    for (let i = sizes.length - 1; i >= 0; i--) { if (f(m.get(sizes[i]))) best = sizes[i]; else break }
    return best
  }
  const any = (f) => sizes.find((s) => f(m.get(s))) ?? null
  minv.push({ variant, grid, view, order, good: first((j) => j.good), jukugo: first((j) => j.jukugo), goodAny: any((j) => j.good), jukugoAny: any((j) => j.jukugo) })
}
minv.sort((a, b) => (a.view + a.variant + a.grid + a.order).localeCompare(b.view + b.variant + b.grid + b.order))
console.log('variant\tgrid\tview\torder\tGOOD\tJUKUGO\t(first any GOOD / JUKUGO)')
for (const x of minv) console.log([x.variant, x.grid, x.view, x.order, x.good ?? '—', x.jukugo ?? '—', `${x.goodAny ?? '—'} / ${x.jukugoAny ?? '—'}`].join('\t'))
writeFileSync(new URL('./min_viable.json', import.meta.url), JSON.stringify(minv, null, 1))
