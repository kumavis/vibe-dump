import { WORDS } from './data/words.js'
import { KANJI } from './data/kanji.js'

// The eight semantic fields a word can belong to. Each one is drawn on the
// floor as a large hairline diagram, and a pair with nothing else to connect to
// runs a dashed line out to its field's diagram.
export const FIELDS = {
  n: { key: 'n', label: '自然', kana: 'しぜん', en: 'nature' },
  p: { key: 'p', label: '人', kana: 'ひと', en: 'people' },
  t: { key: 't', label: '時', kana: 'とき', en: 'time' },
  l: { key: 'l', label: '場所', kana: 'ばしょ', en: 'place' },
  m: { key: 'm', label: '動', kana: 'どう', en: 'motion' },
  h: { key: 'h', label: '心', kana: 'こころ', en: 'mind' },
  w: { key: 'w', label: '言葉', kana: 'ことば', en: 'words' },
  o: { key: 'o', label: '物', kana: 'もの', en: 'things' },
}

// ── romaji ────────────────────────────────────────────────────────────────
// Modern Hepburn, enough for the readings in the word list: digraphs, the
// doubled consonant of っ, and long vowels written with a macron.

const KANA = {
  あ: 'a', い: 'i', う: 'u', え: 'e', お: 'o',
  か: 'ka', き: 'ki', く: 'ku', け: 'ke', こ: 'ko',
  が: 'ga', ぎ: 'gi', ぐ: 'gu', げ: 'ge', ご: 'go',
  さ: 'sa', し: 'shi', す: 'su', せ: 'se', そ: 'so',
  ざ: 'za', じ: 'ji', ず: 'zu', ぜ: 'ze', ぞ: 'zo',
  た: 'ta', ち: 'chi', つ: 'tsu', て: 'te', と: 'to',
  だ: 'da', ぢ: 'ji', づ: 'zu', で: 'de', ど: 'do',
  な: 'na', に: 'ni', ぬ: 'nu', ね: 'ne', の: 'no',
  は: 'ha', ひ: 'hi', ふ: 'fu', へ: 'he', ほ: 'ho',
  ば: 'ba', び: 'bi', ぶ: 'bu', べ: 'be', ぼ: 'bo',
  ぱ: 'pa', ぴ: 'pi', ぷ: 'pu', ぺ: 'pe', ぽ: 'po',
  ま: 'ma', み: 'mi', む: 'mu', め: 'me', も: 'mo',
  や: 'ya', ゆ: 'yu', よ: 'yo',
  ら: 'ra', り: 'ri', る: 'ru', れ: 're', ろ: 'ro',
  わ: 'wa', を: 'o', ん: 'n',
}
const SMALL = { ゃ: 'a', ゅ: 'u', ょ: 'o' }

export function romaji(kana) {
  const chars = [...kana]
  let out = ''
  let double = false
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]
    if (c === 'っ') {
      double = true
      continue
    }
    let syl = KANA[c] ?? c
    const next = chars[i + 1]
    if (next in SMALL) {
      // きゃ → kya, しゃ → sha, ちゃ → cha, じゃ → ja
      const base = syl.slice(0, -1)
      syl = (base.endsWith('sh') || base.endsWith('ch') || base === 'j' ? base : base + 'y') + SMALL[next]
      i++
    }
    if (double) {
      syl = (syl.startsWith('ch') ? 't' : syl[0]) + syl
      double = false
    }
    out += syl
  }
  return out.replace(/ou|oo/g, 'ō').replace(/uu/g, 'ū')
}

export const MEANING = new Map()
for (const entry of KANJI.split('|')) {
  const s = entry.trim()
  if (s) MEANING.set(s[0], s.slice(1).trim())
}

export const LEXICON = []
export const BY_WORD = new Map()
// Words indexed by the character they keep when the *other* one turns over:
// keepFirst.get('火') is every 火X, keepSecond.get('山') every X山.
const keepFirst = new Map()
const keepSecond = new Map()
// Every word a character appears in, either position.
export const BY_CHAR = new Map()

for (const line of WORDS.split('\n')) {
  const parts = line.trim().split(/\s+/)
  if (parts.length < 4) continue
  const [word, kana] = parts
  const field = parts.at(-1)
  const gloss = parts.slice(2, -1).join(' ')
  if (BY_WORD.has(word)) continue
  const [a, b] = [...word]
  const entry = { word, a, b, kana, romaji: romaji(kana), gloss, field }
  LEXICON.push(entry)
  BY_WORD.set(word, entry)
  push(keepFirst, a, entry)
  push(keepSecond, b, entry)
  push(BY_CHAR, a, entry)
  if (b !== a) push(BY_CHAR, b, entry)
}

function push(map, key, value) {
  let list = map.get(key)
  if (!list) map.set(key, (list = []))
  list.push(value)
}

// Every word reachable from `entry` by turning over the character at `index`
// (0 = first, 1 = second) while the other one stays put.
export function turns(entry, index) {
  const list = index === 0 ? keepSecond.get(entry.b) : keepFirst.get(entry.a)
  return list ? list.filter((e) => e !== entry) : []
}

// How many ways a word can turn, both positions together. Words with none are
// dead ends, so the board never deals them.
export function degree(entry) {
  return turns(entry, 0).length + turns(entry, 1).length
}
