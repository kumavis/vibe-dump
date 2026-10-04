// Print the tables NOTES.md quotes. usage: node tables.mjs
import { readFileSync, existsSync } from 'node:fs'
import { verdict } from './judge.mjs'
const load = (f) => (existsSync(f) ? readFileSync(f, 'utf8').trim().split('\n').filter(Boolean).map(JSON.parse) : [])
const S = load('res-final.jsonl'), D = load('res-dir.jsonl')
const f = (x, d = 3) => (x == null || Number.isNaN(x) ? '-' : (+x).toFixed(d))
const get = (rows, tag, lex, g) => rows.find((r) => r.tag === tag && r.lexFile === lex && r.cfg.gridName === g)
const real = (n) => `curve-realistic-${n}`
const SIZES = [128, 175, 225, 300, 400, 500, 650, 905]

console.log('\n## A. Baseline (dealMin 2, retry 6): frozen pairs, harness mode')
console.log('grid | size | dealt | stuck | stuckLong | spells/pair | spell mean (beats) | p90 | share of frozen time in spells >=150 beats | permanently frozen pairs | cause: dead-end / prev-only / board-only')
for (const g of ['9x8', '7x6s', '6x5s']) for (const n of SIZES) {
  const r = get(S, 'base', real(n), g); if (!r) continue
  if (!r.dealt.startsWith('10')) { console.log(`${g} | ${n} | ${r.dealt} | - `); continue }
  console.log([g, n, r.dealt, f(r.stuck), f(r.stuckLong), f(r.spellsPerPair, 2), f(r.spellMean, 0), f(r.spellP90, 0), f(r.longShare, 2), f(r.permaFrac, 2), `${f(r.cover.deadEnd, 2)} / ${f(r.cover.prevOnly, 2)} / ${f(r.cover.boardOnly, 2)}`].join(' | '))
}

console.log('\n## B. Director mode, same baseline (bgRetry 6 + notes skip frozen): what the viewer sees')
console.log('grid | size | beats lost | stuck (board) | stuck in view | spell mean s | p90 s | share of frozen time in spells > 2 min | tumbles/min')
for (const g of ['9x8', '6x5s']) for (const n of SIZES) for (const tag of ['stock', 'base']) {
  const r = get(D, tag, real(n), g); if (!r || !r.dealt.startsWith('10')) continue
  console.log([tag, g, n, f(r.beatsLost), f(r.stuck), f(r.stuckVis), f(r.spellMeanS, 0), f(r.spellP90S, 0), f(r.long2mShare, 2), f(r.tumblesPerMin, 1)].join(' | '))
}

const TAGS = ['stock', 'base', 'base+back', 'base+unblock', 'base+dtprev', 'base+dt', 'base+dup', 'base+dupfar12', 'base+redeal', 'base+rw', 'BEST', 'BEST-dt', 'BEST+dup', 'BEST-redeal', 'redeal+rw']
for (const n of [225, 300, 400]) for (const g of ['9x8', '6x5s']) {
  console.log(`\n## C. Each recovery, realistic ${n}, ${g} (harness)`)
  console.log('config | verdict | beats lost | stuck | stuckLong | stuckEff | repeat | linked | tumbles/beat | fires per 1000 beats | transient dups /1000')
  for (const tag of TAGS) {
    const r = get(S, tag, real(n), g); if (!r) continue
    if (!r.dealt.startsWith('10')) { console.log(`${tag} | x | ${r.dealt}`); continue }
    console.log([tag, verdict(r), f(r.stallRate), f(r.stuck), f(r.stuckLong), f(r.stuckEff), f(r.repeatRate), f(r.linked), f(r.tumblesPerBeat), JSON.stringify(r.firesPer1k), f(r.transientDupsPer1k, 1)].join(' | '))
  }
}
for (const n of [225, 300, 500]) for (const g of ['9x8', '6x5s']) {
  console.log(`\n## D. Director mode, realistic ${n}, ${g}: per minute`)
  console.log('config | beats lost | stuck in view | repeat | linked (board / view) | tumbles/min | fires/min by kind | total | transient dups/min | off-screen redeals/min | spell mean s')
  for (const tag of [...TAGS, 'BEST+off', 'base+off']) {
    const r = get(D, tag, real(n), g); if (!r || !r.dealt.startsWith('10')) continue
    console.log([tag, f(r.beatsLost), f(r.stuckVis), f(r.repeatRate), `${f(r.linked, 2)} / ${f(r.linkedVis, 2)}`, f(r.tumblesPerMin, 1), JSON.stringify(r.firesPerMin), f(r.firesPerMinTotal, 2), f(r.transientDupsPerMin, 2), f(r.offRedealsPerMin, 2), f(r.spellMeanS, 0)].join(' | '))
  }
}
