// usage: node mk3.mjs <name> <spec>...: a copy of q31/base's package with
// the new races' units edited. A spec is unit.field=value:
//   delver.cost=70  delver.pts=8  delver.st.S=4 (a stats letter)
//   delver.melee.S=4  spinethrower.ranged.range=18  hivemother.spell0.S=5
//   finch.fly=walk  (drops `fly: true` from the unit line and FLY from abilities)
import { cpSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
const Q = new URL('.', import.meta.url).pathname
const [name, ...specs] = process.argv.slice(2)
const out = join(Q, name)
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true })
cpSync(join(Q, 'base/packages'), join(out, 'packages'), { recursive: true })
const P = join(out, 'packages/tails-and-scales/data/races')
const files = ['insect.js', 'bird.js'].map((f) => join(P, f))
const text = Object.fromEntries(files.map((f) => [f, readFileSync(f, 'utf8').split('\n')]))
function block(unit) {
  for (const f of files) {
    const L = text[f]
    const s = L.findIndex((l) => l.startsWith(`    ${unit}: {`))
    if (s < 0) continue
    let e = s + 1
    while (!/^    [a-z]+: \{|^  \},/.test(L[e])) e++
    return { L, s, e }
  }
  throw new Error(`no unit ${unit}`)
}
for (const spec of specs) {
  const m = /^([a-z]+)\.([a-zA-Z0-9.]+)=(.*)$/.exec(spec)
  if (!m) throw new Error(`bad spec ${spec}`)
  const [, unit, path, v] = m
  const { L, s, e } = block(unit)
  const lineOf = (re) => { for (let i = s; i < e; i++) if (re.test(L[i])) return i; throw new Error(`${spec}: no line ${re}`) }
  const sub = (i, re, to) => { const was = L[i]; L[i] = L[i].replace(re, to); if (L[i] === was && !was.includes(to)) throw new Error(`${spec}: no change on ${was}`) }
  const p = path.split('.')
  if (p[0] === 'cost' || p[0] === 'pts') sub(lineOf(/\bname: '/), new RegExp(`\\b${p[0]}: \\d+`), `${p[0]}: ${v}`)
  else if (p[0] === 'st') sub(lineOf(/stats: '/), new RegExp(`\\b${p[1]}\\d+`), `${p[1]}${v}`)
  else if (p[0] === 'ranged' || p[0] === 'melee') sub(lineOf(new RegExp(`^\\s+${p[0]}: \\{`)), new RegExp(`\\b${p[1]}: [^,}]+`), `${p[1]}: ${v}`)
  else if (/^spell\d$/.test(p[0])) {
    const sp = lineOf(/spells: \[/) + 1 + Number(p[0].slice(5))
    sub(sp, new RegExp(`\\b${p[1]}: [^,}]+`), `${p[1]}: ${v}`)
  } else if (p[0] === 'fly' && v === 'walk') {
    sub(lineOf(/\bname: '/), /, fly: true/, '')
    sub(lineOf(/abilities: \[/), /\[FLY, /, '[')
  } else throw new Error(`bad path ${spec}`)
}
for (const f of files) writeFileSync(f, text[f].join('\n'))
console.log(out + '/packages/tails-and-scales')
