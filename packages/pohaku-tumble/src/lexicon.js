import { WORDS } from './data/words.js'
import { ROOTS } from './data/roots.js'

// The eight semantic fields a word can belong to. Each one is a place on the
// island (island.js draws it), and a pair with nothing else to connect to runs
// a dashed line out to its field's place. `label` is set large in the italic on
// the floor, `en` in small caps beneath it.
export const FIELDS = {
  lani: { key: 'lani', label: 'lani', en: 'sky', place: 'compass' },
  kai: { key: 'kai', label: 'kai', en: 'sea', place: 'fishpond' },
  ʻāina: { key: 'ʻāina', label: 'ʻāina', en: 'land', place: 'lava' },
  ulu: { key: 'ulu', label: 'ulu', en: 'growth', place: 'loi' },
  kanaka: { key: 'kanaka', label: 'kanaka', en: 'people', place: 'kauhale' },
  hana: { key: 'hana', label: 'hana', en: 'work', place: 'halau' },
  naʻau: { key: 'naʻau', label: 'naʻau', en: 'mind', place: 'cloud' },
  hele: { key: 'hele', label: 'hele', en: 'motion', place: 'stream' },
}

// Every stone, by id. An id is a root in one sense ('wai#0', 'lua#1'), so two
// stones are the same root only when their ids are equal — never compare
// spellings: *lua* "two" and *lua* "pit" share a face but nothing else.
export const STONES = ROOTS

// What is pecked into a stone: its spelling in capitals. The ʻokina has no
// case and stays as it is; kahakō vowels upper-case to their precomposed
// capitals (ā → Ā).
export function stoneText(id) {
  return STONES[id].s.toUpperCase()
}

// A stone whose sense the review could not settle ('haka?alahaka'). It is its
// own stone, so it can turn and be turned into, but it never draws a line: a
// shared-root line has to mean the same root.
export function unresolved(id) {
  return id.includes('?')
}

// The whole list, for the cards and the gloss lookups. A word is its spelling;
// a second row with the same spelling is dropped.
export const ALL = []
export const BY_WORD = new Map()
for (const r of WORDS) {
  if (BY_WORD.has(r.w)) continue
  const entry = { word: r.w, a: r.a, b: r.b, gloss: r.g, field: r.f, ev: r.ev, nodeal: !!r.nodeal }
  ALL.push(entry)
  BY_WORD.set(entry.word, entry)
}

function push(map, key, value) {
  let list = map.get(key)
  if (!list) map.set(key, (list = []))
  list.push(value)
}

// Words indexed by the stone they keep when the *other* one turns over:
// keepFirst.get('wai#0') is every wai·X, keepSecond.get('maka#0') every X·maka.
function index(list) {
  const keepFirst = new Map()
  const keepSecond = new Map()
  for (const e of list) {
    push(keepFirst, e.a, e)
    push(keepSecond, e.b, e)
  }
  return { keepFirst, keepSecond }
}

// The playable set is the 2-core of the turn graph: keep peeling off every
// word with fewer than two turns among the words still in. A word with one
// turn can be entered but only left by going straight back, so on a small
// list it is where pairs get stuck. The pruned words stay in ALL for the cards.
function core2(all) {
  let list = all
  for (;;) {
    const { keepFirst, keepSecond } = index(list)
    const next = list.filter((e) => keepSecond.get(e.b).length - 1 + keepFirst.get(e.a).length - 1 >= 2)
    if (next.length === list.length) return list
    list = next
  }
}

export const LEXICON = core2(ALL)
const { keepFirst, keepSecond } = index(LEXICON)

// Every playable word a stone appears in, either position.
export const BY_STONE = new Map()
for (const e of LEXICON) {
  push(BY_STONE, e.a, e)
  if (e.b !== e.a) push(BY_STONE, e.b, e)
}

// Every word reachable from `entry` by turning over the stone at `index`
// (0 = first, 1 = second) while the other one stays put.
export function turns(entry, index) {
  const list = index === 0 ? keepSecond.get(entry.b) : keepFirst.get(entry.a)
  return list ? list.filter((e) => e !== entry) : []
}

// How many ways a word can turn, both positions together.
export function degree(entry) {
  return turns(entry, 0).length + turns(entry, 1).length
}

// Connected components of the turn graph. A turn never leaves its component,
// so a pair dealt into a component of five words can only ever cycle those.
const COMPONENT = new Map()
for (const e of LEXICON) {
  if (COMPONENT.has(e.word)) continue
  const c = { size: 0 }
  const stack = [e]
  COMPONENT.set(e.word, c)
  while (stack.length) {
    const x = stack.pop()
    c.size++
    for (const i of [0, 1]) {
      for (const y of turns(x, i)) {
        if (COMPONENT.has(y.word)) continue
        COMPONENT.set(y.word, c)
        stack.push(y)
      }
    }
  }
}

export function compSize(entry) {
  return COMPONENT.get(entry.word)?.size ?? 0
}

// Longest line two stones showing the same root will run to each other. Jukugo
// used 11.5 for 1,650 words over 740 characters. A small Hawaiian list leans
// harder on a few roots (*wai*, *paʻa*, *hale*), and at that length they could
// wire most of the floor into one web — so the reach shrinks with COLLIDE, the
// chance that two random stone faces show the same root: 11.5 up to 0.010
// (Jukugo is 0.004), then as 1/√COLLIDE, never below 5. The calibration is
// research/ENGINE.md §2.1.
const faces = new Map()
for (const e of LEXICON) {
  faces.set(e.a, (faces.get(e.a) ?? 0) + 1)
  faces.set(e.b, (faces.get(e.b) ?? 0) + 1)
}
const n = 2 * LEXICON.length
export const COLLIDE = [...faces.values()].reduce((s, k) => s + (k / n) ** 2, 0)
export const LINK_MAX = 11.5 * Math.max(5 / 11.5, Math.min(1, Math.sqrt(0.01 / Math.max(COLLIDE, 1e-9))))
