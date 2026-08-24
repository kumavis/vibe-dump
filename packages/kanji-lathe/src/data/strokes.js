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

// A handful of entries in KanjiVG's long tail reach for the CJK *ideograph* that
// looks like a stroke rather than the stroke character itself. They mean the
// same thing, so treat them as the same thing.
const ALIASES = { 丨: '㇑', 一: '㇐', 丿: '㇒', 乀: '㇏', 乁: '㇐', 亅: '㇚', 丶: '㇔', 乚: '㇄' }

const FALLBACK = { name: 'unknown', cls: null, hook: false }

/**
 * Split a raw `kvg:type` into its parts and look up the family.
 *
 * `cls` comes back null when the type is missing or unrecognised — a few tail
 * entries carry no type at all, or literal junk like "Missing stroke". The
 * skeleton builder fills those in from the stroke's own geometry rather than
 * guessing a family here.
 */
export function decodeStrokeType(raw) {
  const type = raw || ''
  const primary = type.split('/')[0]
  const base = ALIASES[primary[0]] || primary[0] || ''
  const variant = primary.slice(1) // '', 'a', 'b', 'c', 'v'
  const alt = type.includes('/') ? type.split('/')[1][0] : ''
  const info = STROKE_TYPES[base] || FALLBACK
  return { type, base, variant, alt, name: info.name, cls: info.cls, hook: info.hook }
}

/** Classify a stroke by its own shape, for entries KanjiVG never typed. */
export function classifyByGeometry(pts, n) {
  const dx = pts[n * 2 - 2] - pts[0]
  const dy = pts[n * 2 - 1] - pts[1]
  const len = Math.hypot(dx, dy)
  if (len < 60) return 'dot' // under ~6% of the em: a tick, not a stroke
  const a = Math.abs(dx)
  const b = Math.abs(dy)
  if (a > b * 2.5) return 'h'
  if (b > a * 2.5) return 'v'
  return dx > 0 === dy > 0 ? 'd' : 'r' // falling right vs rising
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
