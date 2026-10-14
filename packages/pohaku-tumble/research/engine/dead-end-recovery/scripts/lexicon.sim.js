// Stand-in for jukugo-tumble/src/lexicon.js with the same exports, fed from a
// JSON tier file (LEX=path) — or the real Jukugo lexicon (LEX=jukugo).
import fs from 'node:fs'

let mod
if (process.env.LEX === 'jukugo') {
  mod = await import('packages/jukugo-tumble/src/lexicon.js')
}
const FIELD_KEYS = ['n', 'p', 't', 'l', 'm', 'h', 'w', 'o']
function hash(s) {
  let h = 2166136261
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0), 16777619)
  return h >>> 0
}
const LEX_ = []
const BY_CHAR_ = new Map()
const keepFirst = new Map()
const keepSecond = new Map()
function push(map, key, value) {
  let list = map.get(key)
  if (!list) map.set(key, (list = []))
  list.push(value)
}
if (!mod) {
  const seen = new Set()
  for (const r of JSON.parse(fs.readFileSync(process.env.LEX, 'utf8'))) {
    if (seen.has(r.word)) continue
    seen.add(r.word)
    const [a, b] = r.parts
    const e = { word: r.word, a, b, field: FIELD_KEYS[hash(r.word) % 8], gloss: '' }
    LEX_.push(e)
    push(keepFirst, a, e)
    push(keepSecond, b, e)
    push(BY_CHAR_, a, e)
    if (b !== a) push(BY_CHAR_, b, e)
  }
}
export const LEXICON = mod ? mod.LEXICON : LEX_
export const BY_CHAR = mod ? mod.BY_CHAR : BY_CHAR_
export const FIELDS = mod ? mod.FIELDS : Object.fromEntries(FIELD_KEYS.map((k) => [k, { key: k }]))
export function turns(entry, index) {
  if (mod) return mod.turns(entry, index)
  const list = index === 0 ? keepSecond.get(entry.b) : keepFirst.get(entry.a)
  return list ? list.filter((e) => e !== entry) : []
}
export function degree(entry) {
  return turns(entry, 0).length + turns(entry, 1).length
}
