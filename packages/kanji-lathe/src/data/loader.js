// Loads and decodes the packed corpus produced by tools/build-dataset.mjs.
//
// The wire format trades a little decode work for a much smaller download: each
// stroke is one base-64 string of per-axis deltas over absolute cubic Béziers,
// and each character's component tree is one ';'-separated record list.
import { decodeStrokeType, POSITIONS, RADICAL_KINDS } from './strokes.js'

export const EM = 1024

const A64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
const IDX64 = new Int16Array(128).fill(-1)
for (let i = 0; i < A64.length; i++) IDX64[A64.charCodeAt(i)] = i

/** Inverse of encodeCoords() in tools/build-dataset.mjs. */
export function decodeCoords(str) {
  // conservative upper bound: every char is one coordinate
  const tmp = new Float64Array(str.length)
  let w = 0
  let px = 0
  let py = 0
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i)
    let d
    if (code === 47 /* '/' */) {
      const zz = (IDX64[str.charCodeAt(++i)] << 6) | IDX64[str.charCodeAt(++i)]
      d = zz & 1 ? -((zz + 1) / 2) : zz / 2
    } else {
      d = IDX64[code] - 31
    }
    if (w & 1) {
      py += d
      tmp[w++] = py
    } else {
      px += d
      tmp[w++] = px
    }
  }
  return tmp.subarray(0, w)
}

function parseGroups(rec) {
  if (!rec) return []
  return rec.split(';').map((s, i) => {
    const [element, position, radical, depth, parent, from, to, flags] = s.split(',')
    const f = +flags
    return {
      i,
      element,
      position: POSITIONS[position] || '',
      positionCode: position,
      radical: RADICAL_KINDS[radical] || '',
      isRadical: !!radical,
      depth: +depth,
      parent: +parent,
      from: +from,
      to: +to,
      variant: !!(f & 1),
      phonetic: !!(f & 2),
      children: [],
    }
  })
}

const SCRIPTS = ['kanji', 'hiragana', 'katakana', 'punctuation']

function buildRecord(raw) {
  const groups = parseGroups(raw.gr)
  for (const g of groups) if (g.parent >= 0) groups[g.parent].children.push(g.i)

  const types = raw.t ? raw.t.split(' ') : []
  const strokes = raw.s.map((enc, i) => {
    const info = decodeStrokeType(types[i] || '')
    // innermost group whose stroke range covers i — the component this stroke belongs to
    let leaf = -1
    let ancestry = []
    for (const g of groups) {
      if (i >= g.from && i < g.to) {
        ancestry.push(g.i)
        if (leaf === -1 || g.depth > groups[leaf].depth) leaf = g.i
      }
    }
    return { index: i, cubics: decodeCoords(enc), ...info, group: leaf, ancestry }
  })

  return {
    char: raw.c,
    script: SCRIPTS[raw.k || 0],
    freq: raw.f,
    grade: raw.g,
    jlpt: raw.j,
    strokeCount: raw.n,
    meanings: raw.m || [],
    on: raw.on || [],
    kun: raw.kun || [],
    strokes,
    groups,
    // the component a reader keys off first, when KanjiVG marks one
    radicalGroup: groups.find((g) => g.isRadical) || null,
  }
}

/**
 * Fetch + decode the corpus.
 *
 * Only the core — the kana, the punctuation and the thousand most frequent
 * kanji — loads with the page. The remaining five and a half thousand
 * ideographs are a 1.7 MiB download nobody should pay for until they go looking
 * for a character outside the core, so they arrive on demand.
 *
 * A single-file build bakes both parts into the page as inert JSON script tags,
 * because hosts with a strict CSP (the artifact viewer among them) will not
 * serve a side-car fetch — and because inert tags cost nothing until parsed.
 */
/** A corpus baked into the page by the single-file build, if there is one. */
function baked(id) {
  const el = typeof document !== 'undefined' && document.getElementById(id)
  return el ? JSON.parse(el.textContent) : null
}

export async function loadCorpus(coreUrl = './corpus-core.json', extUrl = './corpus-ext.json') {
  const raw = baked('kl-corpus-core') || (await fetchJson(coreUrl))
  const corpus = makeCorpus(raw)

  let pending = null
  corpus.loadExtended = () => {
    if (corpus.extended) return Promise.resolve(corpus)
    if (!pending) {
      const inline = baked('kl-corpus-ext')
      pending = (inline ? Promise.resolve(inline) : fetchJson(extUrl))
        .then((extRaw) => {
          addChars(corpus, extRaw.chars.map(buildRecord))
          corpus.extended = true
          return corpus
        })
        .catch((err) => {
          pending = null // a failed fetch should not poison later attempts
          throw err
        })
    }
    return pending
  }
  return corpus
}

async function fetchJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`corpus fetch failed: ${res.status}`)
  return res.json()
}

function makeCorpus(raw) {
  const corpus = { meta: raw.meta, chars: [], byChar: new Map(), kanji: [], kana: [], extended: false }
  addChars(corpus, raw.chars.map(buildRecord))
  return corpus
}

/** Merge a batch of records in, keeping the per-script views in step. */
function addChars(corpus, records) {
  for (const rec of records) {
    if (corpus.byChar.has(rec.char)) continue
    corpus.byChar.set(rec.char, rec)
    corpus.chars.push(rec)
    ;(rec.script === 'kanji' ? corpus.kanji : corpus.kana).push(rec)
  }
  return corpus
}

/** Decode a corpus already in memory (used by the Node-side tests). */
export function decodeCorpus(raw) {
  const corpus = makeCorpus(raw)
  corpus.loadExtended = () => Promise.resolve(corpus)
  return corpus
}

/** Merge a second already-in-memory part (the extended set) into a corpus. */
export function mergeCorpus(corpus, raw) {
  addChars(corpus, raw.chars.map(buildRecord))
  corpus.extended = true
  return corpus
}
