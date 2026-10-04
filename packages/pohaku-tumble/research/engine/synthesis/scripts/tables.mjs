// Markdown curve tables for REPORT.md: one table per order; rows = sizes; one column per engine × grid;
// cell = "lost / stuck / repeat / linked V" (V: J = JUKUGO-LIKE, G = GOOD, - = neither, x = did not deal).
//   node tables.mjs file.tsv "engine|grid,engine|grid,..." [sizes]
import { readFileSync } from 'node:fs'
const [f, spec, sizesArg] = process.argv.slice(2)
const [head, ...lines] = readFileSync(f, 'utf8').trim().split('\n')
const cols = head.split('\t')
const rows = lines.map((l) => Object.fromEntries(l.split('\t').map((v, i) => [cols[i], v])))
const dir = cols.includes('beatsLost')
const gridOf = (r) => (r.cfg.includes('autoGrid') ? 'auto' : r.grid)
const sizes = (sizesArg ?? '128,175,225,300,400,500,650,905').split(',').map(Number)
const pairs = spec.split(',').map((s) => s.split('|'))
const f2 = (x) => (x === '' || x == null ? '–' : Number(x).toFixed(2).replace(/^0/, '').replace(/^-0/, '-'))
for (const o of ['realistic', 'random', 'best']) {
  console.log(`\n**${o} order** (${dir ? 'Director model: beats lost / stuck / repeat / linked in view' : "brief's harness: beats lost / stuck / repeat / linked"})\n`)
  console.log('| words | ' + pairs.map(([e, g]) => `${e} · ${g}`).join(' | ') + ' |')
  console.log('|---:|' + pairs.map(() => '---').join('|') + '|')
  for (const n of sizes) {
    const cells = pairs.map(([e, g]) => {
      const r = rows.find((x) => x.engine === e && gridOf(x) === g && new RegExp(`curve-${o}-${n}(\\.json)?$`).test(x.lex))
      if (!r) return ''
      const [a, b] = r.dealt.split('/')
      if (a !== b) return `x (${r.dealt} dealt)`
      const v = r.JUKUGO_LIKE === 'yes' ? '**J**' : r.GOOD === 'yes' ? '**G**' : '–'
      const grid = g === 'auto' ? ` (${r.grid})` : ''
      return `${f2(dir ? r.beatsLost : r.stallRate)} / ${f2(r.stuck)} / ${f2(r.repeatRate)} / ${f2(dir ? r.linkedVis : r.linked)} ${v}${grid}`
    })
    console.log(`| ${n} | ${cells.join(' | ')} |`)
  }
}
