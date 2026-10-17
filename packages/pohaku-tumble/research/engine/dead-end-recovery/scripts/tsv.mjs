// Turn result JSONL files into TSV. usage: node tsv.mjs out.tsv in1.jsonl [in2.jsonl ...]
import { readFileSync, writeFileSync } from 'node:fs'
import { verdict } from './judge.mjs'
const [out, ...ins] = process.argv.slice(2)
const rows = ins.flatMap((f) => readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse))
const KINDS = ['unblock', 'back', 'dup', 'dt', 'dtprev', 'redeal']
const f = (x) => (x == null ? '' : typeof x === 'number' ? String(+x.toFixed(4)) : String(x))
const order = (r) => (r.lexFile.startsWith('curve-') ? r.lexFile.split('-')[1] : r.lexFile)
const sim = rows.filter((r) => r.driver === 'sim2')
const dir = rows.filter((r) => r.driver === 'dir')
const lines = []
if (sim.length) {
  const cols = ['config', 'order', 'size', 'grid', 'pairs', 'dealMin', 'dealt', 'beats_lost', 'stuck', 'stuckLong', 'stuckEff', 'repeat', 'linked', 'seenFrac', 'spellMean', 'spellP90', 'longShare', 'permaFrac', 'tumblesPerBeat', ...KINDS.map((k) => `fires1k_${k}`), 'transientDups1k', 'deadEnd', 'prevOnly', 'boardOnly', 'verdict']
  lines.push(cols.join('\t'))
  for (const r of sim) {
    if (r.error) { lines.push([r.tag, order(r), r.lexicon, r.cfg?.gridName, '', '', 'ERROR ' + r.error.slice(0, 60)].join('\t')); continue }
    lines.push([r.tag, order(r), r.lexicon, r.cfg.gridName ?? r.grid, r.pairs, r.dealMin ?? r.cfg.dealMin ?? 5, r.dealt, f(r.stallRate), f(r.stuck), f(r.stuckLong), f(r.stuckEff), f(r.repeatRate), f(r.linked), f(r.seenFrac), f(r.spellMean), f(r.spellP90), f(r.longShare), f(r.permaFrac), f(r.tumblesPerBeat), ...KINDS.map((k) => f(r.firesPer1k?.[k] ?? 0)), f(r.transientDupsPer1k), f(r.cover?.deadEnd), f(r.cover?.prevOnly), f(r.cover?.boardOnly), verdict(r)].join('\t'))
  }
}
if (dir.length) {
  if (lines.length) lines.push('')
  const cols = ['config', 'order', 'size', 'grid', 'pairs', 'dealt', 'visiblePairs', 'beatsLost', 'bgLost', 'noteLost', 'notesNoTurnPerMin', 'tumblesPerMin', 'stuck', 'stuckVis', 'linked', 'linkedVis', 'repeat', 'spellMeanS', 'spellP90S', 'long2mShare', ...KINDS.map((k) => `firesPerMin_${k}`), 'firesPerMinTotal', 'transientDupsPerMin', 'offRedealsPerMin']
  lines.push(cols.join('\t'))
  for (const r of dir) {
    if (r.error) { lines.push([r.tag, order(r), r.lexicon, r.cfg?.gridName, '', 'ERROR ' + r.error.slice(0, 60)].join('\t')); continue }
    lines.push([r.tag, order(r), r.lexicon, r.cfg.gridName ?? r.grid, r.pairs, r.dealt, f(r.visiblePairs), f(r.beatsLost), f(r.bgLost), f(r.noteLost), f(r.notesNoTurnPerMin), f(r.tumblesPerMin), f(r.stuck), f(r.stuckVis), f(r.linked), f(r.linkedVis), f(r.repeatRate), f(r.spellMeanS), f(r.spellP90S), f(r.long2mShare), ...KINDS.map((k) => f(r.firesPerMin?.[k] ?? 0)), f(r.firesPerMinTotal), f(r.transientDupsPerMin), f(r.offRedealsPerMin)].join('\t'))
  }
}
writeFileSync(out, lines.join('\n') + '\n')
console.log(`wrote ${out}: ${sim.length} sim2 rows, ${dir.length} director rows`)
