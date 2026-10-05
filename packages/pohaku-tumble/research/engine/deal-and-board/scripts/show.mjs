// Print a lexicon x grid matrix from JSON lines.
// Usage: node show.mjs file.jsonl [nameFilterRegex] [fields]
//   cell: stall/stuck/repeat/linked [pairs] then G (GOOD) J (JUKUGO-LIKE) or x (didn't deal every seed)
import fs from 'node:fs'
import { verdict } from './totsv.mjs'

const [file, filt = '.', fieldsArg = 'stallRate,stuck,repeatRate,linked'] = process.argv.slice(2)
const fields = fieldsArg.split(',')
const rows = fs.readFileSync(file, 'utf8').trim().split('\n').map(JSON.parse).filter((r) => new RegExp(filt).test(r.name))
const names = [...new Set(rows.map((r) => r.name))]
for (const name of names) {
  const rs = rows.filter((r) => r.name === name)
  const lexes = [...new Set(rs.map((r) => r.lex))]
  const grids = [...new Set(rs.map((r) => r.grid))]
  console.log(`\n## ${name}   cell = ${fields.join('/')} pairs verdict`)
  console.log(['lex'.padEnd(20), ...grids.map((g) => g.padEnd(30))].join(''))
  for (const lex of lexes) {
    const cells = grids.map((g) => {
      const r = rs.find((x) => x.lex === lex && x.grid === g)
      if (!r) return ''.padEnd(30)
      const [d, n] = r.dealt.split('/').map(Number)
      if (d !== n) return `deal ${r.dealt}`.padEnd(30)
      const v = verdict(r)
      const f = fields.map((k) => (typeof r[k] === 'number' ? r[k].toFixed(2).replace(/^0/, '') : r[k])).join('/')
      return `${f} ${r.pairs}${v.jl ? 'J' : v.good ? 'G' : ' '}`.padEnd(30)
    })
    console.log([lex.replace('curve-', '').padEnd(20), ...cells].join(''))
  }
}
