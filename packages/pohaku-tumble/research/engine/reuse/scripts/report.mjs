// Emit key_results and min_viable JSON for the structured report.
import { readFileSync } from 'node:fs'
const load = (s) => readFileSync(`results/${s}.jsonl`, 'utf8').trim().split('\n').map(JSON.parse)
const U = [...load('s6'), ...load('s7'), ...load('s1')] // s6/s7 (30 seeds) win over s1 (10 seeds)
const D = [...load('d3')]
const short = (l) => l.replace('curve-realistic-', 'realistic-').replace('curve-random-', 'random-').replace('curve-best-', 'best-')
const pick = (rows, name, lex, grid) => rows.find((r) => r.name === name && r.lex === lex && r.grid === grid)
const out = []
const add = (r, label) => r && out.push({ config: label ?? r.name, lexicon: short(r.lex), grid: `${r.grid} (${r.pairs} pairs)`, dealt: r.dealt, beats_lost: r.stallRate, stuck: r.stuck, repeat: r.repeatRate, linked: r.linked, seen: r.seenFrac })
add(pick(U, 'jukugo-ref', 'jukugo', '9x8'), 'Jukugo reference (its own lexicon, 30% vertical, slab 1; 10 seeds)')
const R = (n) => `curve-realistic-${n}`
for (const [name, label] of [['stock', 'stock (Jukugo rules, dealMin 1)'], ['T-P3-dd31-R6-d3', 'RECOMMENDED T-P3-dd31-R6-d3 (tiers, rest 3, retry 6, dealMin 3, duplicates only as deal fallback)'], ['T-P3-box-R6-d3', 'T-P3-box-R6-d3 (as recommended + turn-time duplicates where never in one 26x17 view)']])
  for (const grid of ['9x8', '6x5s', '7x6s'])
    for (const lex of ['attested-WA', R(128), R(175), R(200), R(225), R(250), R(300), R(400), R(500)]) {
      if (grid !== '9x8' && name === 'stock' && ![R(175), R(225), R(300)].includes(lex)) continue
      if (grid === '7x6s' && name !== 'stock' && ![R(200), R(225), R(250), R(300)].includes(lex)) continue
      if (name === 'T-P3-box-R6-d3' && (grid !== '9x8' || ![R(200), R(250), R(300)].includes(lex))) continue
      if (name === 'T-P3-dd31-R6-d3' && grid === '9x8' && [R(128), R(200)].includes(lex)) continue
      if (name === 'stock' && grid === '9x8' && [R(200), R(250)].includes(lex)) continue
      add(pick(U, name, lex, grid), `${label}; 30 seeds x 1500 ticks`)
    }
add(pick(U, 'stock@12000', R(300), '9x8'), 'stock, steady state (10 seeds x 12000 ticks)')
add(pick(U, 'T-P3-box-R6-d3@12000', R(300), '9x8'), 'T-P3-box-R6-d3, steady state (10 seeds x 12000 ticks)')
add(pick(U, 'T-P3-box-R6-d3@12000', R(250), '6x5s'), 'T-P3-box-R6-d3 (= dd31 on 6x5s), steady state (10 seeds x 12000 ticks)')
const addD = (r, label) => r && out.push({ config: `[DIRECTOR SIM, 10 seeds x 1 h] ${label}; beats_lost=bgLost+bgEmpty, stuck=stuckView, noteShort=${r.noteShort}`, lexicon: short(r.lex), grid: `${r.grid} (${Math.round(r.pairs)} pairs)`, dealt: r.dealt, beats_lost: +(r.bgLost + r.bgEmpty).toFixed(3), stuck: r.stuckView, repeat: r.repeat, linked: r.linked, seen: r.seenFrac })
addD(pick(D, 'jukugo-ref', 'jukugo', '9x8'), 'Jukugo reference')
for (const [n, g] of [[300, '9x8'], [400, '9x8'], [250, '6x5s'], [300, '6x5s'], [300, '7x6s'], [350, '7x6s']]) addD(pick(D, 'T-P3-dd31-R6-d3', R(n), g), 'T-P3-dd31-R6-d3')
addD(pick(D, 'stock', R(300), '9x8'), 'stock')
addD(pick(D, 'stock', R(300), '6x5s'), 'stock')
console.log(JSON.stringify(out))
// min_viable from the s6 (stock, box) and s7 (dd31) scans
const mv = []
for (const [file, names] of [['minviable-s6.tsv', ['stock', 'T-P3-box-R6-d3']], ['minviable-s7.tsv', ['T-P3-dd31-R6-d3']]]) {
  for (const line of readFileSync(`results/${file}`, 'utf8').trim().split('\n').slice(1)) {
    const [order, grid, rules, good, jl] = line.split('\t')
    if (!names.includes(rules.trim())) continue
    mv.push({ engine: rules.trim(), order, grid, good: good === '-' ? null : +good, jukugo_like: jl === '-' ? null : +jl })
  }
}
console.log(JSON.stringify(mv))
