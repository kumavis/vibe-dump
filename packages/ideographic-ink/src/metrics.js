// The metric model behind every diagram in this app.
//
// Two sources feed it, and keeping them apart matters:
//
//   * `data/font-metrics.js` — read out of the font binaries at build time.
//     The ideographic-ink edges (`icft` / `icfb` in the OpenType BASE table)
//     live only here: no browser API exposes them.
//
//   * the Canvas `TextMetrics` API — what the *browser* decided the font's
//     content area is, which is what `text-box-trim` actually trims against.
//     `ideographicBaseline` is the one BASE-table value browsers do hand back,
//     so it is used to cross-check the build-time `ideo`.
//
// Every position in this module is expressed in em, measured upwards from the
// alphabetic baseline — the same frame of reference `text-box-edge` uses.
import { FONT_METRICS, FONT_LIST } from './data/font-metrics.js'

export { FONT_METRICS, FONT_LIST }

export const OVER_EDGES = ['text', 'cap', 'ex', 'ideographic', 'ideographic-ink']
export const UNDER_EDGES = ['text', 'alphabetic', 'ideographic', 'ideographic-ink']

export const EDGE_INFO = {
  'text': {
    ja: 'テキスト',
    tag: 'hhea / OS-2',
    blurb: 'The font’s own ascent and descent — the content area the browser reserves for every line. Nothing to do with the shapes.',
  },
  'cap': {
    ja: 'キャップハイト',
    tag: 'OS/2 sCapHeight',
    blurb: 'Top of a Latin capital. Meaningless for kanji, which overshoot it by design.',
  },
  'ex': {
    ja: 'エックスハイト',
    tag: 'OS/2 sxHeight',
    blurb: 'Top of a Latin lowercase x. Even less related to CJK shapes.',
  },
  'alphabetic': {
    ja: 'ベースライン',
    tag: 'BASE romn',
    blurb: 'The Latin baseline. Kanji hang below it, so trimming here clips them.',
  },
  'ideographic': {
    ja: '仮想ボディ',
    tag: 'BASE ideo / idtp',
    blurb: 'The em box — the square every full-width character is designed inside. Exactly 1em tall, and the grid Japanese typesetting has always been laid out on.',
  },
  'ideographic-ink': {
    ja: '字面',
    tag: 'BASE icft / icfb',
    blurb: 'The character face — how far the ink is designed to reach inside the em box. A gothic face fills ~89% of it; a brush face may fill only 71%.',
  },
}

// ---------------------------------------------------------------------------
// What the browser thinks the font's content area is.

const PROBE_PX = 1000
let ctx2d = null

const usedCache = new Map()

/**
 * Ascent/descent as the browser resolves them, in em. This is what a
 * `text-box-edge: text` trim leaves behind, so the polyfill has to match it
 * rather than trust the font tables (browsers disagree about whether to read
 * hhea or OS/2 typo metrics).
 */
export function usedMetrics (font) {
  if (usedCache.has(font.key)) return usedCache.get(font.key)
  const fallback = {
    ascent: font.hhea.ascent,
    descent: -font.hhea.descent,
    ideographicBaseline: font.ideographic ? font.ideographic.under : -font.hhea.descent,
    measured: false,
  }
  let result = fallback
  try {
    ctx2d ||= document.createElement('canvas').getContext('2d')
    ctx2d.font = `${PROBE_PX}px "${font.family}"`
    const m = ctx2d.measureText('日')
    if (m.fontBoundingBoxAscent > 0) {
      result = {
        ascent: m.fontBoundingBoxAscent / PROBE_PX,
        descent: m.fontBoundingBoxDescent / PROBE_PX,
        ideographicBaseline: -m.ideographicBaseline / PROBE_PX,
        measured: true,
      }
    }
  } catch { /* keep the table-derived fallback */ }
  usedCache.set(font.key, result)
  return result
}

/** Ink extents of one specific string, in em — the glyphs, not the design grid. */
export function inkExtents (font, text) {
  try {
    ctx2d ||= document.createElement('canvas').getContext('2d')
    ctx2d.font = `${PROBE_PX}px "${font.family}"`
    const m = ctx2d.measureText(text)
    return {
      over: m.actualBoundingBoxAscent / PROBE_PX,
      under: -m.actualBoundingBoxDescent / PROBE_PX,
      left: -m.actualBoundingBoxLeft / PROBE_PX,
      right: m.actualBoundingBoxRight / PROBE_PX,
      advance: m.width / PROBE_PX,
    }
  } catch {
    return null
  }
}

export function clearMeasurementCache () {
  usedCache.clear()
}

// ---------------------------------------------------------------------------
// Edge positions

/**
 * Where a `text-box-edge` keyword lands, in em above the alphabetic baseline.
 * `side` is 'over' or 'under'; positions below the baseline come back negative.
 */
export function edgePosition (font, keyword, side) {
  const used = usedMetrics(font)
  switch (keyword) {
    case 'text': return side === 'over' ? used.ascent : -used.descent
    case 'cap': return font.capHeight ?? used.ascent
    case 'ex': return font.xHeight ?? used.ascent
    case 'alphabetic': return 0
    case 'ideographic':
      if (!font.ideographic) return side === 'over' ? used.ascent : -used.descent
      return side === 'over' ? font.ideographic.over : font.ideographic.under
    case 'ideographic-ink':
      if (!font.ideographicInk) return side === 'over' ? used.ascent : -used.descent
      return side === 'over' ? font.ideographicInk.over : font.ideographicInk.under
    default: return side === 'over' ? used.ascent : -used.descent
  }
}

/** The em box drawn as a square: [under, over] vertically, and the same span
 *  horizontally (the BASE vertical axis puts the face dead-centre in it). */
export function emBox (font) {
  const i = font.ideographic
  return i ? { over: i.over, under: i.under } : { over: 0.88, under: -0.12 }
}

export function faceBox (font) {
  const k = font.ideographicInk
  if (!k) return null
  const v = font.vertical
  const box = emBox(font)
  // Horizontal face edges come from the BASE *vertical* axis, which is how a
  // font declares the left/right of the character face for vertical setting.
  const left = v ? v.inkStart : k.under
  const right = v ? v.inkEnd : k.over
  return {
    over: k.over,
    under: k.under,
    left: left - box.under,   // inset from the em box's left edge, in em
    right: right - box.under,
    height: k.over - k.under,
    width: (v ? v.inkEnd - v.inkStart : k.over - k.under),
  }
}

/** 字面率 — how much of the em box the designed face fills, as a percentage. */
export function faceRatio (font) {
  const f = faceBox(font)
  return f ? f.height * 100 : null
}

// ---------------------------------------------------------------------------
// The trim itself

/**
 * How much to shave off each side of a text block, in em, to land on the
 * requested edges. This is the whole of `text-box-trim`: a line box is
 * half-leading + ascent + descent + half-leading, and trimming removes
 * everything above the over edge and below the under edge.
 */
export function trimOffsets (font, { over, under, lineHeight }) {
  const used = usedMetrics(font)
  const half = (lineHeight - (used.ascent + used.descent)) / 2
  return {
    top: half + used.ascent - edgePosition(font, over, 'over'),
    bottom: half + used.descent + edgePosition(font, under, 'under'),
  }
}

/** Apply (or clear) the polyfilled trim on an element. */
export function applyPolyfill (el, font, { trim, over, under, lineHeight }) {
  if (trim === 'none') {
    el.style.marginBlockStart = ''
    el.style.marginBlockEnd = ''
    return { top: 0, bottom: 0 }
  }
  const { top, bottom } = trimOffsets(font, { over, under, lineHeight })
  const start = trim === 'trim-end' ? 0 : top
  const end = trim === 'trim-start' ? 0 : bottom
  el.style.marginBlockStart = `${-start}em`
  el.style.marginBlockEnd = `${-end}em`
  return { top: start, bottom: end }
}

// ---------------------------------------------------------------------------
// What actually ships today

const supportsEdge = (value) => {
  try { return CSS.supports('text-box-edge', value) } catch { return false }
}

export const NATIVE = {
  trim: (() => { try { return CSS.supports('text-box-trim', 'trim-both') } catch { return false } })(),
  shorthand: (() => { try { return CSS.supports('text-box', 'trim-both cap alphabetic') } catch { return false } })(),
  edge: Object.fromEntries(
    [...new Set([...OVER_EDGES, ...UNDER_EDGES])].map((k) => [k, supportsEdge(k === 'alphabetic' ? `text ${k}` : `${k} text`)]),
  ),
}

/** Can the browser do this exact combination natively? */
export function nativelySupported ({ trim, over, under }) {
  if (trim === 'none') return true
  return NATIVE.trim && NATIVE.edge[over] && NATIVE.edge[under]
}

export function cssFor ({ trim, over, under }) {
  if (trim === 'none') return 'text-box: normal;'
  const edge = over === under ? over : `${over} ${under}`
  return `text-box: ${trim} ${edge};`
}
