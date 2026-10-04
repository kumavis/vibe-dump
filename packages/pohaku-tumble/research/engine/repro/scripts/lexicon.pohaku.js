// repro: POHAKU lexicon, written from the engine spec only.
// Same exports as lexicon.sim.js plus PLAYABLE, compSize, LINK_MAX_RULE, COLLIDE, autoGrid.
//  (1) playable set = 2-core of the turn graph; turns()/degree()/BY_CHAR see only playable words.
//      LEXICON stays the full list (glossary/cards; seenFrac denominator).
//  (2) component size of every playable word (BFS over both turn directions).
//  (3) LINK_MAX = 11.5 * clamp(sqrt(0.010 / COLLIDE), 5/11.5, 1),
//      COLLIDE = sum over roots (faces(root) / (2 |playable|))^2.
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

let FULL = []
let FIELDS_
if (process.env.LEX === 'jukugo') {
  const mod = await import('packages/jukugo-tumble/src/lexicon.js')
  FULL = mod.LEXICON
  FIELDS_ = mod.FIELDS
} else {
  const seen = new Set()
  for (const r of JSON.parse(fs.readFileSync(process.env.LEX, 'utf8'))) {
    if (seen.has(r.word)) continue
    seen.add(r.word)
    const [a, b] = r.parts
    FULL.push({ word: r.word, a, b, field: FIELD_KEYS[hash(r.word) % 8], gloss: '' })
  }
  FIELDS_ = Object.fromEntries(FIELD_KEYS.map((k) => [k, { key: k }]))
}

// ── (1) 2-core ──────────────────────────────────────────────────────────
function buildMaps(list) {
  const kf = new Map()
  const ks = new Map()
  const bc = new Map()
  for (const e of list) {
    push(kf, e.a, e)
    push(ks, e.b, e)
    push(bc, e.a, e)
    if (e.b !== e.a) push(bc, e.b, e)
  }
  return { kf, ks, bc }
}
let alive = FULL.slice()
for (;;) {
  const { kf, ks } = buildMaps(alive)
  const deg = (e) => (ks.get(e.b).length - 1) + (kf.get(e.a).length - 1)
  const next = alive.filter((e) => deg(e) >= 2)
  if (next.length === alive.length) break
  alive = next
}
const { kf: keepFirst, ks: keepSecond, bc: BY_CHAR_ } = buildMaps(alive)
export const PLAYABLE = alive
const PLAYABLE_SET = new Set(alive)

export const LEXICON = FULL
export const BY_CHAR = BY_CHAR_
export const FIELDS = FIELDS_
export function turns(entry, index) {
  const list = index === 0 ? keepSecond.get(entry.b) : keepFirst.get(entry.a)
  return list ? list.filter((e) => e !== entry) : []
}
export function degree(entry) {
  return turns(entry, 0).length + turns(entry, 1).length
}

// ── (2) component sizes ─────────────────────────────────────────────────
const COMP = new Map()
for (const start of alive) {
  if (COMP.has(start)) continue
  const members = [start]
  const seen = new Set([start])
  for (let i = 0; i < members.length; i++) {
    for (const idx of [0, 1]) {
      for (const f of turns(members[i], idx)) {
        if (!seen.has(f)) {
          seen.add(f)
          members.push(f)
        }
      }
    }
  }
  for (const m of members) COMP.set(m, members.length)
}
export function compSize(entry) {
  return PLAYABLE_SET.has(entry) ? COMP.get(entry) : 0
}

// ── (3) LINK_MAX rule ───────────────────────────────────────────────────
const faces = new Map()
for (const e of alive) {
  faces.set(e.a, (faces.get(e.a) ?? 0) + 1)
  faces.set(e.b, (faces.get(e.b) ?? 0) + 1)
}
let collide = 0
for (const n of faces.values()) collide += (n / (2 * alive.length)) ** 2
export const COLLIDE = collide
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v))
export const LINK_MAX_RULE = alive.length ? 11.5 * clamp(Math.sqrt(0.01 / collide), 5 / 11.5, 1) : 11.5

// ── layout size from |playable| (field.js) ─────────────────────────────
export function autoGrid(P = alive.length) {
  const target = clamp(Math.round(P / 8), 18, 65)
  const cells = target / 0.92
  const rows = Math.max(2, Math.round(Math.sqrt(cells / 1.125)))
  const cols = Math.max(2, Math.round(cells / rows))
  return { cols, rows, target }
}
