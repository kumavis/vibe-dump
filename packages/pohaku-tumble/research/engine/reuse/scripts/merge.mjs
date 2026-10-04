// Merge every uniform-sim stage into results.tsv and every Director-sim stage
// into dirsim.tsv (one row per run, with the stage it came from).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { verdict } from './verdict.mjs'
const load = (s) => (existsSync(`results/${s}.jsonl`) ? readFileSync(`results/${s}.jsonl`, 'utf8').trim().split('\n').map((l) => ({ stage: s, ...JSON.parse(l) })) : [])
const U = ['stage', 'name', 'lex', 'grid', 'pairs', 'lexicon', 'deg3', 'deg5', 'dealt', 'stallRate', 'stuck', 'frozen', 'linked', 'repeatRate', 'flipRate', 'seenFrac',
  'dupTurn', 'dupBoard', 'dupView', 'dupViewHD', 'dupViewPan', 'dupFits', 'stallMax', 'stuckMax', 'verdict', 'cfg']
const urows = ['s1', 's2', 's3', 's4', 's5', 's5b', 's6', 's7'].flatMap(load)
writeFileSync('results.tsv', [U.join('\t'), ...urows.map((r) => U.map((c) => (c === 'cfg' ? JSON.stringify(r.cfg) : c === 'verdict' ? verdict(r) : r[c] ?? '')).join('\t'))].join('\n') + '\n')
const D = ['stage', 'name', 'lex', 'grid', 'pairs', 'lexicon', 'dealt', 'bgLost', 'bgEmpty', 'noteFail', 'noteShort', 'cardFlip', 'repeat', 'flip', 'linked', 'stuckView', 'dupView', 'dupNear', 'tpm', 'seenFrac', 'cfg']
const drows = ['d1', 'd2', 'd3'].flatMap(load)
writeFileSync('dirsim.tsv', [D.join('\t'), ...drows.map((r) => D.map((c) => (c === 'cfg' ? JSON.stringify(r.cfg) : r[c] ?? '')).join('\t'))].join('\n') + '\n')
console.log(`results.tsv ${urows.length} rows, dirsim.tsv ${drows.length} rows`)
