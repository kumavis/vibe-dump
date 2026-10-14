// Merge every results-*.jsonl in this directory into results.tsv (one row per run, `file` column first).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
const COLS = ['file', 'name', 'view', 'grid', 'pairs', 'playable', 'visible', 'everVis', 'dealt',
  // brief metrics (harness: stallRate/stuck/linked; Director: beatsLost/frozen,frozenVis/linkedVis)
  'stallRate', 'beatsLost', 'stuck', 'stuckStrict', 'frozen', 'frozenVis', 'returnOnly', 'returnOnlyVis', 'repeatRate', 'linked', 'linkedVis', 'linkedLo', 'linkedHi',
  // critic metrics
  'rep12', 'rep24', 'bounce', 'bounceRate', 'bouncesPerHour', 'bounceGapMed', 'bounceUnder12', 'bounceAfterCard', 'pingOfBounce', 'pingLong', 'top2bounce', 'maxBounceStreak', 'pairsStreak3',
  'rec60', 'recOther60', 'gapMed', 'recVis60', 'recVisOther60', 'recVis180', 'noteRec300', 'noteRec600', 'homoNear',
  'noteEarly', 'still60', 'top20', 'idle', 'turnsPerMin', 'seenAll', 'cfg']
const rows = [COLS.join('\t')]
for (const f of readdirSync('.').filter((f) => /^results-.*\.jsonl$/.test(f)).sort()) {
  for (const l of readFileSync(f, 'utf8').split('\n')) {
    if (!l.trim().startsWith('{')) continue
    const r = JSON.parse(l)
    r.file = f
    if (r.cfg && typeof r.cfg === 'object') { const { name, seeds, duration, ticks, view, capacity } = r.cfg; r.cfg = JSON.stringify({ seeds, duration, ticks, view, capacity }) }
    rows.push(COLS.map((c) => r[c] ?? '').join('\t'))
  }
}
writeFileSync('results.tsv', rows.join('\n') + '\n')
console.log(`results.tsv: ${rows.length - 1} rows`)
