// Stand-in for jukugo-tumble/src/lexicon.js with the same exports, fed from a
// JSON tier file (LEX=path) — or the real Jukugo lexicon (LEX=jukugo).
// Both sources go through the same keepFirst/keepSecond construction Jukugo
// uses, so turns() is identical to Jukugo's for LEX=jukugo.
//
// SIM.prune = k keeps only the k-core of the turn graph: words that still
// have >= k turns when every word with fewer is removed, repeatedly. With
// k = 2 no word in play is a dead end under the no-immediate-return rule.
// FULL_SIZE is the lexicon size before pruning.
import fs from 'node:fs'

const FIELD_KEYS = ['n', 'p', 't', 'l', 'm', 'h', 'w', 'o']
function hash(s) {
  let h = 2166136261
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0), 16777619)
  return h >>> 0
}
function push(map, key, value) {
  let list = map.get(key)
  if (!list) map.set(key, (list = []))
  list.push(value)
}

let source
let fields
if (process.env.LEX === 'jukugo') {
  const mod = await import('packages/jukugo-tumble/src/lexicon.js')
  source = mod.LEXICON
  fields = mod.FIELDS
} else {
  source = []
  const seen = new Set()
  for (const r of JSON.parse(fs.readFileSync(process.env.LEX, 'utf8'))) {
    if (seen.has(r.word)) continue
    seen.add(r.word)
    const [a, b] = r.parts
    source.push({ word: r.word, a, b, field: FIELD_KEYS[hash(r.word) % 8], gloss: '' })
  }
  fields = Object.fromEntries(FIELD_KEYS.map((k) => [k, { key: k }]))
}
export const FULL_SIZE = source.length

function index(list) {
  const kf = new Map()
  const ks = new Map()
  for (const e of list) {
    push(kf, e.a, e)
    push(ks, e.b, e)
  }
  return { kf, ks }
}

let list = source
const k = globalThis.SIM?.prune ?? 0
if (k > 0) {
  for (;;) {
    const { kf, ks } = index(list)
    const next = list.filter((e) => ks.get(e.b).length - 1 + kf.get(e.a).length - 1 >= k)
    if (next.length === list.length) break
    list = next
  }
}

const { kf: keepFirst, ks: keepSecond } = index(list)
const BY_CHAR_ = new Map()
for (const e of list) {
  push(BY_CHAR_, e.a, e)
  if (e.b !== e.a) push(BY_CHAR_, e.b, e)
}
export const LEXICON = list
export const BY_CHAR = BY_CHAR_
export const FIELDS = fields
export function turns(entry, index) {
  const l = index === 0 ? keepSecond.get(entry.b) : keepFirst.get(entry.a)
  return l ? l.filter((e) => e !== entry) : []
}
export function degree(entry) {
  return turns(entry, 0).length + turns(entry, 1).length
}
