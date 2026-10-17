// Stand-in for jukugo-tumble/src/lexicon.js with the same exports, fed from a
// JSON tier file (LEX=path) or the real Jukugo lexicon (LEX=jukugo).
//
// Synthesis copy. Both sources go through the same keepFirst/keepSecond build
// Jukugo uses, so turns() is identical to Jukugo's for LEX=jukugo. Additions,
// all off unless globalThis.SIM asks for them:
//   SIM.prune = k   keep only the k-core of the turn graph (repeatedly drop every
//                   word with fewer than k turns among the words left). k = 2 is
//                   the "playable set": no word in play is a dead end.
// Extra exports (used by the engine and the sim, not by stock board.js):
//   FULL         the list before pruning (for seenAll)
//   compSize(e)  size of e's connected component in the (pruned) turn graph
//   COLLIDE      sum over roots of p^2, p = a root's share of block faces in play
//   LINK_AUTO    LINK_MAX picked from COLLIDE (see linkAuto below)
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
export const FULL = source

function index(list) {
  const kf = new Map()
  const ks = new Map()
  for (const e of list) {
    push(kf, e.a, e)
    push(ks, e.b, e)
  }
  return { kf, ks }
}

// k-core by peeling (the reference version of what lexicon.js would do at load)
function kcore(all, k) {
  let list = all
  for (;;) {
    const { kf, ks } = index(list)
    const next = list.filter((e) => ks.get(e.b).length - 1 + kf.get(e.a).length - 1 >= k)
    if (next.length === list.length) return list
    list = next
  }
}
const k = globalThis.SIM?.prune ?? 0
let list = k > 0 ? kcore(source, k) : source
// 2-core membership of the full list, whether or not the list is pruned: the
// deal can be limited to it (SIM.dealCore) while turns still reach every word.
const CORE2 = new Set(kcore(source, 2).map((e) => e.word))
export const CORE2_SIZE = CORE2.size
export function inCore2(entry) {
  return CORE2.has(entry.word)
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

// connected components of the turn graph (a turn never leaves its component)
const COMP = new Map()
for (const e of list) {
  if (COMP.has(e.word)) continue
  const c = { size: 0 }
  const stack = [e]
  COMP.set(e.word, c)
  while (stack.length) {
    const x = stack.pop()
    c.size++
    for (const i of [0, 1]) for (const y of turns(x, i)) if (!COMP.has(y.word)) { COMP.set(y.word, c); stack.push(y) }
  }
}
export function compSize(entry) {
  return COMP.get(entry.word)?.size ?? 0
}
export const GIANT = Math.max(0, ...[...new Set(COMP.values())].map((c) => c.size))

// Root concentration of the words in play: the chance that two random block
// faces show the same root. Jukugo 0.004; realistic Hawaiian lists 0.007-0.012;
// the most-connective-first ("best") lists 0.025-0.054.
const faces = new Map()
for (const e of list) {
  faces.set(e.a, (faces.get(e.a) ?? 0) + 1)
  faces.set(e.b, (faces.get(e.b) ?? 0) + 1)
}
export const COLLIDE = [...faces.values()].reduce((s, n) => s + (n / (2 * list.length)) ** 2, 0)

// LINK_MAX from the list: Jukugo's 11.5 unless the roots are concentrated
// enough to wire most of the floor, then shorter (never below 6.5).
//   LINK_MAX = 11.5 * clamp(sqrt(c0 / COLLIDE), floor/11.5, 1)   (defaults c0 0.015, floor 6.5)
export function linkAuto(c0 = 0.015, floor = 6.5) {
  return 11.5 * Math.max(floor / 11.5, Math.min(1, Math.sqrt(c0 / Math.max(COLLIDE, 1e-9))))
}
