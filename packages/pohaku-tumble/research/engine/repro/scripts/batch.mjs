// Run many simx.mjs configs in parallel (4 workers) and append one JSON line per run to OUT.
// usage: node batch.mjs <plan> <out.jsonl>      plans are defined below
import { spawn } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const [plan, out] = process.argv.slice(2)
const lex = (o, n) => join(here, 'lex', `${o}-${n}.json`)
const sizes = [128, 150, 175, 200, 225, 250, 275, 300, 325, 350, 375, 400, 450, 500, 550, 600, 650, 700, 800, 905]
const grids = { '9x8': { cols: 9, rows: 8 }, '5x4s': { cols: 5, rows: 4 }, auto: { grid: 'auto' } }
const jobs = []
const add = (label, o, n, grid, extra = {}) =>
  jobs.push({ label, order: o, size: n, gridName: grid, LEX: lex(o, n), CFG: { name: label, engine: 'pohaku', seeds: 10, ticks: 1500, ...grids[grid], ...extra } })

if (plan === 'curve') {
  // POHAKU, realistic curve, three grids, 10 seeds x 1500 ticks
  for (const g of ['9x8', '5x4s', 'auto']) for (const n of sizes) add(`POHAKU realistic ${n} ${g}`, 'realistic', n, g)
} else if (plan === 'robust') {
  // 30 seeds x 1500 ticks and 10 seeds x 6000 ticks around the claimed boundaries
  for (const g of ['9x8', '5x4s', 'auto']) {
    const ns = g === '9x8' ? [225, 250, 275, 300, 325, 350] : [150, 175, 200, 225, 250]
    for (const n of ns) {
      add(`POHAKU realistic ${n} ${g} 30s`, 'realistic', n, g, { seeds: 30 })
      add(`POHAKU realistic ${n} ${g} 6000t`, 'realistic', n, g, { ticks: 6000 })
    }
  }
} else if (plan === 'tick') {
  // sensitivity: 1 s per tick (rest 6 s = 6 ticks, so a pair 4-5 ticks after its last turn may not return)
  for (const g of ['9x8', '5x4s']) for (const n of [128, 175, 200, 225, 250, 275, 300, 905]) add(`POHAKU realistic ${n} ${g} tick1s`, 'realistic', n, g, { tickSec: 1 })
} else if (plan === 'small128') {
  for (const [c, r] of [[3, 3], [4, 3], [4, 4], [5, 4]]) {
    jobs.push({ label: `POHAKU realistic 128 ${c}x${r}s 30s`, order: 'realistic', size: 128, gridName: `${c}x${r}s`, LEX: lex('realistic', 128), CFG: { name: `128 ${c}x${r}s`, engine: 'pohaku', seeds: 30, ticks: 1500, cols: c, rows: r } })
  }
} else if (plan === 'ret') {
  for (const g of ['9x8', 'auto']) for (const n of [225, 250, 275, 300, 350, 400]) add(`POHAKU-ret realistic ${n} ${g}`, 'realistic', n, g, { noReturn: true })
} else if (plan === 'ret6000') {
  for (const g of ['9x8', 'auto']) for (const n of [225, 250, 275, 300, 350, 400, 450]) {
    add(`POHAKU-ret realistic ${n} ${g} 6000t`, 'realistic', n, g, { noReturn: true, ticks: 6000 })
    add(`POHAKU-ret realistic ${n} ${g} 30s`, 'realistic', n, g, { noReturn: true, seeds: 30 })
  }
} else if (plan === 'dcurve') {
  // Director model (dmodel.mjs), realistic curve, three grids, 10 seeds x 3000 s
  for (const g of ['9x8', '5x4s', 'auto']) for (const n of sizes) {
    add(`D-POHAKU realistic ${n} ${g}`, 'realistic', n, g, { seconds: 3000 })
    jobs.at(-1).script = 'dmodel.mjs'
  }
  for (const g of ['9x8', '5x4s']) for (const n of [128, 175, 225, 300, 400, 500, 650, 905]) {
    add(`D-stock realistic ${n} ${g}`, 'realistic', n, g, { engine: 'stock', dealMin: 1, seconds: 3000 })
    jobs.at(-1).script = 'dmodel.mjs'
  }
} else if (plan === 'drobust') {
  for (const g of ['9x8', '5x4s', 'auto']) {
    const ns = g === '9x8' ? [250, 275, 300, 325, 350] : [128, 150, 175, 200, 225, 250]
    for (const n of ns) {
      add(`D-POHAKU realistic ${n} ${g} 30s`, 'realistic', n, g, { seconds: 3000, seeds: 30 })
      jobs.at(-1).script = 'dmodel.mjs'
      add(`D-POHAKU realistic ${n} ${g} 12000sec`, 'realistic', n, g, { seconds: 12000 })
      jobs.at(-1).script = 'dmodel.mjs'
    }
  }
} else if (plan === 'extra') {
  // the JUKUGO-LIKE edge on 9x8 at a long horizon with 30 seeds, and seed-set noise at 225 9x8
  add('POHAKU realistic 275 9x8 30s6000t', 'realistic', 275, '9x8', { seeds: 30, ticks: 6000 })
  for (const s0 of [10, 20, 30, 40]) add(`POHAKU realistic 225 9x8 seed0=${s0}`, 'realistic', 225, '9x8', { seed0: s0 })
} else if (plan === 'grid65') {
  for (const n of [175, 200, 225, 250]) {
    jobs.push({ label: `POHAKU realistic ${n} 6x5s`, order: 'realistic', size: n, gridName: '6x5s', LEX: lex('realistic', n), CFG: { name: `${n} 6x5s`, engine: 'pohaku', seeds: 10, ticks: 1500, cols: 6, rows: 5 } })
  }
} else throw new Error('unknown plan ' + plan)

const done = new Set(existsSync(out) ? readFileSync(out, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l).label) : [])
const todo = jobs.filter((j) => !done.has(j.label))
let next = 0
async function worker() {
  while (next < todo.length) {
    const j = todo[next++]
    const line = await new Promise((resolve, reject) => {
      const p = spawn('node', [join(here, j.script ?? 'simx.mjs')], { env: { ...process.env, LEX: j.LEX, CFG: JSON.stringify(j.CFG) } })
      let s = ''
      let e = ''
      p.stdout.on('data', (d) => (s += d))
      p.stderr.on('data', (d) => (e += d))
      p.on('close', (code) => (code ? reject(new Error(j.label + ': ' + e)) : resolve(s.trim())))
    })
    const r = { label: j.label, order: j.order, size: j.size, gridName: j.gridName, ...JSON.parse(line) }
    appendFileSync(out, JSON.stringify(r) + '\n')
    console.error(j.label, r.model ? [r.beatsLost, r.stuck, r.stuckAll, r.repeat, r.linked, r.seen, r.noteFail].join(' ') : [r.stallRate, r.stuckLegal, r.stuckAll, r.repeatRate, r.linkedAll].join(' '))
  }
}
await Promise.all([worker(), worker(), worker(), worker()])
