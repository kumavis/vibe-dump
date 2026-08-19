// The CJK stroke vocabulary KanjiVG tags each path with (`kvg:type`).
//
// A type looks like `㇕b` or `㇔/㇏`: a base stroke character from the CJK
// Strokes block, an optional single-letter stylistic variant, and an optional
// `/alternative` when the shape is ambiguous. We only ever key off the base.
//
//   cls  — coarse family used all over the engine for per-class controls
//            h    horizontal          v    vertical
//            d    diagonal (falling)  r    rising
//            dot  dot / short tick    turn multi-part stroke with corners
//   hook — the stroke ends in a gou / はね flick, so terminal synthesis applies
//   name — romanised CJK stroke name, shown in the inspector
export const STROKE_TYPES = {
  '㇀': { name: 'ti', cls: 'r', hook: false },
  '㇁': { name: 'wan-gou', cls: 'v', hook: true },
  '㇂': { name: 'xie-gou', cls: 'd', hook: true },
  '㇃': { name: 'bei-xie-gou', cls: 'd', hook: true },
  '㇄': { name: 'shu-wan', cls: 'v', hook: false },
  '㇅': { name: 'heng-zhe-zhe', cls: 'turn', hook: false },
  '㇆': { name: 'heng-zhe-gou', cls: 'turn', hook: true },
  '㇇': { name: 'heng-pie', cls: 'turn', hook: false },
  '㇈': { name: 'heng-zhe-wan-gou', cls: 'turn', hook: true },
  '㇉': { name: 'shu-zhe-wan-gou', cls: 'turn', hook: true },
  '㇊': { name: 'heng-zhe-ti', cls: 'turn', hook: false },
  '㇋': { name: 'heng-zhe-zhe-pie', cls: 'turn', hook: false },
  '㇌': { name: 'heng-pie-wan-gou', cls: 'turn', hook: true },
  '㇍': { name: 'heng-zhe-wan', cls: 'turn', hook: false },
  '㇎': { name: 'heng-zhe-zhe-zhe', cls: 'turn', hook: false },
  '㇏': { name: 'na', cls: 'd', hook: false },
  '㇐': { name: 'heng', cls: 'h', hook: false },
  '㇑': { name: 'shu', cls: 'v', hook: false },
  '㇒': { name: 'pie', cls: 'd', hook: false },
  '㇓': { name: 'shu-pie', cls: 'v', hook: false },
  '㇔': { name: 'dian', cls: 'dot', hook: false },
  '㇕': { name: 'heng-zhe', cls: 'turn', hook: false },
  '㇖': { name: 'heng-gou', cls: 'h', hook: true },
  '㇗': { name: 'shu-zhe', cls: 'turn', hook: false },
  '㇘': { name: 'shu-wan-zhe', cls: 'turn', hook: false },
  '㇙': { name: 'shu-ti', cls: 'turn', hook: false },
  '㇚': { name: 'shu-gou', cls: 'v', hook: true },
  '㇛': { name: 'pie-dian', cls: 'turn', hook: false },
  '㇜': { name: 'pie-zhe', cls: 'turn', hook: false },
  '㇝': { name: 'pie-gou', cls: 'd', hook: true },
  '㇞': { name: 'shu-zhe-zhe', cls: 'turn', hook: false },
  '㇟': { name: 'shu-zhe-zhe-gou', cls: 'turn', hook: true },
  '㇠': { name: 'heng-xie-gou', cls: 'turn', hook: true },
  '㇡': { name: 'heng-zhe-zhe-zhe-gou', cls: 'turn', hook: true },
  '㇢': { name: 'wan', cls: 'd', hook: false },
  '㇣': { name: 'dian-short', cls: 'dot', hook: false },
}

const FALLBACK = { name: 'unknown', cls: 'd', hook: false }

/** Split a raw `kvg:type` into its parts and look up the family. */
export function decodeStrokeType(raw) {
  const type = raw || ''
  const primary = type.split('/')[0]
  const base = primary[0] || ''
  const variant = primary.slice(1) // '', 'a', 'b', 'c', 'v'
  const alt = type.includes('/') ? type.split('/')[1][0] : ''
  const info = STROKE_TYPES[base] || FALLBACK
  return { type, base, variant, alt, name: info.name, cls: info.cls, hook: info.hook }
}

/** Human labels for the KanjiVG component-position vocabulary. */
export const POSITIONS = {
  l: 'left',
  r: 'right',
  t: 'top',
  b: 'bottom',
  a: 'tare', // wraps top+left, e.g. 广
  A: 'tare (containing)',
  k: 'kamae', // encloses, e.g. 囗 門
  K: 'kamae (containing)',
  n: 'nyo', // wraps left+bottom, e.g. 辶
  N: 'nyo (containing)',
  m: 'middle',
}

export const RADICAL_KINDS = { g: 'general', t: 'traditional', n: 'nelson', j: 'jis' }
