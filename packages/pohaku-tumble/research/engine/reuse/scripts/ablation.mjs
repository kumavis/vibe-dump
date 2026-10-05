// What each reuse piece buys, from the stage-2 factorial (9x8 board):
// stock + one piece, then the full set minus one piece. node ablation.mjs results/s2.jsonl
import { readFileSync } from 'node:fs'
import { verdict } from './verdict.mjs'
const rows = readFileSync(process.argv[2], 'utf8').trim().split('\n').map(JSON.parse)
const get = (name, lex) => rows.find((r) => r.name === name && r.lex === lex)
const sets = [
  ['stock (dealMin 1)', 'd1'],
  ['+ retry 6', 'R6-d1'],
  ['+ tiers', 'T-d1'],
  ['+ prev after 12', 'P12-d1'],
  ['+ dup D26', 'D26-d1'],
  ['+ dealMin 3', 'd3'],
  ['full: T-P12-D26-R6-d3', 'T-P12-D26-R6-d3'],
  ['full - tiers', 'P12-D26-R6-d3'],
  ['full - prev', 'T-D26-R6-d3'],
  ['full - retry', 'T-P12-D26-d3'],
  ['full - dealMin3 (d1)', 'T-P12-D26-R6-d1'],
  ['full - dups', 'T-P12-R6-d3'],
  ['full, dups D20', 'T-P12-D20-R6-d3'],
]
const lexes = [...new Set(rows.map((r) => r.lex))]
console.log(['lex', 'set', 'dealt', 'stall', 'stuck', 'frozen', 'linked', 'repeat', 'flip', 'dupView', 'verdict'].join('\t'))
for (const lex of lexes)
  for (const [label, name] of sets) {
    const r = get(name, lex)
    if (!r) continue
    console.log([lex.replace('curve-realistic-', 'R'), label, r.dealt, r.stallRate, r.stuck, r.frozen, r.linked, r.repeatRate, r.flipRate, r.dupView, verdict(r)].join('\t'))
  }
