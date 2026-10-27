// Bun.ant.CellSegmenter: the Anthropic-private Bun API that Claude Code's Ink
// renderer (2.1.271+) builds its terminal cell grid with. Only the TUI uses
// it, which v1 does not run, so this aims for correct and cheap: nothing is
// allocated until the first segment() call.
//
// Independent implementation. The contract below was read off how the 2.1.311
// bundle itself constructs and drives the object (its renderer wrapper class
// and the code that decodes paint()'s return value); clawgod's GPL-3.0
// bun-ant-shim.cjs implements the same contract but none of its code is used
// here. Where the bundle does not pin a behaviour down, the choice made is
// marked "inferred".
//
// new CellSegmenter({ ambiguousIsNarrow, substitute, screen })
//   substitute: [[firstCodePoint, lastCodePoint], ...]  code points shown as
//     U+FFFD (the bundle passes the bidi controls U+061C, U+202A-202E,
//     U+2066-2069 and substitutes the same set with U+FFFD in its own JS
//     paths; inferred to mean the same here).
//   screen: { narrow, wide, spacerTail, spacerHead, emptyCharIndex,
//     spacerCharIndex, emptyWord, widthMask, tabWidth }  the screen's cell
//     kinds (low bits of a cell's style word) and the grapheme table indices
//     of the blank (' ') and wide-spacer ('') characters.
//
// Tables, mutated in place (the renderer caches the array objects):
//   graphemes[id]     text of each grapheme seen; [empty] = ' ', [spacer] = ''
//   sgrKeys[id]       a style's open codes joined by '\0'; [0] = '' (plain).
//                     Each code is one attribute (\e[1m, \e[38;5;n m, ...),
//                     the only shape the renderer accepts.
//   sgrCloseKeys[id]  the matching close codes, same order
//   uris[id]          OSC 8 hyperlink targets; [0] = '' (none)
//
// segment(text, cells: Int32Array, runs: Int32Array, reordered) -> count
//   Splits text into graphemes, interpreting SGR and OSC 8 and dropping any
//   other escape sequence. Per grapheme: cells[2i] = grapheme id,
//   cells[2i+1] = run << 10 | (tab ? 256 : 0) | width. Per run of equal
//   style and link: runs[2r] = style id, runs[2r+1] = uri id. If the arrays
//   are too small nothing is written and -count is returned (the caller
//   grows both to 2 * count and retries). Styles start plain on every call
//   (inferred: a call is a pure function of its text, so the measuring calls
//   the renderer makes cannot leak state into the painting ones).
//   `reordered` (bidi display order) is accepted and ignored: cells stay in
//   logical order.
//
// paint(target, targetWidth, x, y, cells, count, _, charMap, words) -> packed
//   Writes the segmented cells into row y of the screen (2 int32 per cell:
//   char id, style word | kind) starting at column x. charMap maps grapheme
//   id -> the screen's char id, words maps run -> style word. Tabs fill to
//   the next tab stop with blanks; a wide grapheme takes a `wide` cell and a
//   `spacerTail` cell; one that would straddle the right edge leaves a
//   `spacerHead` blank instead (inferred); zero-width graphemes take no cell.
//   Returns end * 2^36 + first * 2^20 + next: [first, end) is the damaged
//   column span (first >= end means none) and `next` the column after the
//   text, which the renderer continues from.
// setCell(target, targetWidth, x, y, charId, word) -> packed, same encoding.

const DEFAULT_SCREEN = { narrow: 0, wide: 1, spacerTail: 2, spacerHead: 3, emptyCharIndex: 0, spacerCharIndex: 1, tabWidth: 8 }

const RUN_SHIFT = 10
const TAB_FLAG = 0x100
const WIDTH_MASK = 0xff
const FIRST_FIELD = 2 ** 20
const END_FIELD = 2 ** 36
const NEXT_MAX = FIRST_FIELD - 1

// SGR attribute slots, in the canonical order a style key lists them.
const SLOTS = ['bold', 'dim', 'italic', 'underline', 'blink', 'inverse', 'hidden', 'strike', 'overline', 'fg', 'bg', 'ulcolor']
const SLOT = Object.fromEntries(SLOTS.map((s, i) => [s, i]))
const CLOSE_CODE = ['22', '22', '23', '24', '25', '27', '28', '29', '55', '39', '49', '59'].map((p) => `\x1b[${p}m`)
const ATTRIBUTE = { 1: 'bold', 2: 'dim', 3: 'italic', 4: 'underline', 21: 'underline', 5: 'blink', 6: 'blink', 7: 'inverse', 8: 'hidden', 9: 'strike', 53: 'overline' }
const RESET = { 22: ['bold', 'dim'], 23: ['italic'], 24: ['underline'], 25: ['blink'], 27: ['inverse'], 28: ['hidden'], 29: ['strike'], 39: ['fg'], 49: ['bg'], 55: ['overline'], 59: ['ulcolor'] }
const EXTENDED_COLOR = { 38: 'fg', 48: 'bg', 58: 'ulcolor' }

const SIMPLE_TEXT = /^[\t\x20-\x7e]*$/

let segmenter // Intl.Segmenter, created on first use
function graphemesOf(text) {
  if (segmenter === undefined) {
    try { segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' }) } catch { segmenter = null }
  }
  if (!segmenter) return Array.from(text) // code points: close enough without Intl
  const out = []
  for (const { segment } of segmenter.segment(text)) out.push(segment)
  return out
}

// Fallback width when Bun.stringWidth is not installed (only in isolation).
function fallbackWidth(g) {
  const cp = g.codePointAt(0)
  if (cp < 0x20 || (cp >= 0x7f && cp < 0xa0) || /^\p{M}/u.test(g)) return 0
  if (/\p{Extended_Pictographic}/u.test(g) || /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]|[\u{20000}-\u{3fffd}]/u.test(g)) return 2
  return 1
}

export class CellSegmenter {
  constructor(options = {}) {
    const screen = { ...DEFAULT_SCREEN }
    for (const [k, v] of Object.entries(options.screen ?? {})) if (v !== undefined) screen[k] = v
    this.ambiguousIsNarrow = options.ambiguousIsNarrow !== false
    this.tabWidth = Number.isInteger(screen.tabWidth) && screen.tabWidth > 0 ? screen.tabWidth : 8
    this.kinds = { narrow: screen.narrow, wide: screen.wide, spacerTail: screen.spacerTail, spacerHead: screen.spacerHead }
    this.emptyCharIndex = screen.emptyCharIndex
    this.spacerCharIndex = screen.spacerCharIndex

    this.graphemes = []
    this.graphemes[this.emptyCharIndex] = ' '
    this.graphemes[this.spacerCharIndex] = ''
    for (let i = 0; i < this.graphemes.length; i++) this.graphemes[i] ??= ''
    this.sgrKeys = ['']
    this.sgrCloseKeys = ['']
    this.uris = ['']

    this._graphemeIds = new Map(this.graphemes.map((g, i) => [g, i]).reverse())
    this._widths = []
    this._styleIds = new Map([['', 0]])
    this._uriIds = new Map([['', 0]])

    const ranges = Array.isArray(options.substitute) ? options.substitute : []
    const cls = ranges.map(([a, b]) => `\\u{${a.toString(16)}}-\\u{${(b ?? a).toString(16)}}`).join('')
    this._substitute = cls ? new RegExp(`[${cls}]`, 'gu') : null
  }

  // --- interning ---------------------------------------------------------------

  _graphemeId(g) {
    let id = this._graphemeIds.get(g)
    if (id === undefined) {
      id = this.graphemes.length
      this.graphemes.push(g)
      this._graphemeIds.set(g, id)
    }
    return id
  }

  _width(id, g) {
    let w = this._widths[id]
    if (w === undefined) {
      w = Math.max(0, Math.min(WIDTH_MASK, this._measure(g) | 0))
      this._widths[id] = w
    }
    return w
  }

  // Column width of one grapheme. installBun subclasses this to use its own
  // Bun.stringWidth (string-width); standalone it uses the global Bun's, or
  // a rough fallback.
  _measure(g) {
    const sw = globalThis.Bun?.stringWidth
    return typeof sw === 'function' ? sw(g, { ambiguousIsNarrow: this.ambiguousIsNarrow }) : fallbackWidth(g)
  }

  _styleId(state) {
    let key = ''
    let close = ''
    for (let s = 0; s < SLOTS.length; s++) {
      if (state[s] === undefined) continue
      if (key) { key += '\0'; close += '\0' }
      key += `\x1b[${state[s]}m`
      close += CLOSE_CODE[s]
    }
    let id = this._styleIds.get(key)
    if (id === undefined) {
      id = this.sgrKeys.length
      this.sgrKeys.push(key)
      this.sgrCloseKeys.push(close)
      this._styleIds.set(key, id)
    }
    return id
  }

  _uriId(uri) {
    let id = this._uriIds.get(uri)
    if (id === undefined) {
      id = this.uris.length
      this.uris.push(uri)
      this._uriIds.set(uri, id)
    }
    return id
  }

  // --- SGR -------------------------------------------------------------------

  // Apply "1;38;5;12" etc. to state (an array indexed by slot). Unknown or
  // malformed parameters are dropped.
  static _applySgr(state, params) {
    const p = params === '' ? ['0'] : params.split(';')
    for (let i = 0; i < p.length; i++) {
      if (!/^\d+$/.test(p[i] || '0')) continue
      const n = Number(p[i] || '0')
      if (n === 0) { state.fill(undefined); continue }
      if (ATTRIBUTE[n]) { state[SLOT[ATTRIBUTE[n]]] = String(n); continue }
      if (RESET[n]) { for (const s of RESET[n]) state[SLOT[s]] = undefined; continue }
      if ((n >= 30 && n <= 37) || (n >= 90 && n <= 97)) { state[SLOT.fg] = String(n); continue }
      if ((n >= 40 && n <= 47) || (n >= 100 && n <= 107)) { state[SLOT.bg] = String(n); continue }
      if (EXTENDED_COLOR[n]) {
        const slot = SLOT[EXTENDED_COLOR[n]]
        if (p[i + 1] === '5' && /^\d{1,3}$/.test(p[i + 2] ?? '')) {
          state[slot] = `${n};5;${p[i + 2]}`
          i += 2
        } else if (p[i + 1] === '2' && [p[i + 2], p[i + 3], p[i + 4]].every((c) => /^\d{1,3}$/.test(c ?? ''))) {
          state[slot] = `${n};2;${p[i + 2]};${p[i + 3]};${p[i + 4]}`
          i += 4
        } else {
          break // malformed colour: the rest of the sequence is unreliable
        }
      }
    }
  }

  // --- segment ---------------------------------------------------------------

  segment(text, cells, runs /* , reordered */) {
    const src = typeof text === 'string' ? text : text == null ? '' : String(text)
    const ids = []
    const packed = [] // tab flag | width, per grapheme
    const styles = []
    const links = []
    const state = new Array(SLOTS.length)
    let style = 0
    let link = 0

    const pushText = (chunk) => {
      if (this._substitute) chunk = chunk.replace(this._substitute, '�')
      const gs = SIMPLE_TEXT.test(chunk) ? chunk : graphemesOf(chunk)
      for (const g of gs) {
        const id = this._graphemeId(g)
        ids.push(id)
        packed.push(g === '\t' ? TAB_FLAG : this._width(id, g))
        styles.push(style)
        links.push(link)
      }
    }

    let i = 0
    while (i < src.length) {
      const esc = src.indexOf('\x1b', i)
      if (esc === -1) { pushText(src.slice(i)); break }
      if (esc > i) pushText(src.slice(i, esc))
      const kind = src[esc + 1]
      if (kind === '[') {
        // CSI: parameter bytes, intermediates, one final byte in @..~
        let j = esc + 2
        while (j < src.length && (src.charCodeAt(j) < 0x40 || src.charCodeAt(j) > 0x7e)) j++
        if (src[j] === 'm' && /^[\d;]*$/.test(src.slice(esc + 2, j))) {
          CellSegmenter._applySgr(state, src.slice(esc + 2, j))
          style = this._styleId(state)
        }
        i = j + 1
      } else if (kind === ']') {
        // OSC, terminated by BEL or ESC \
        let j = esc + 2
        while (j < src.length && src[j] !== '\x07' && !(src[j] === '\x1b' && src[j + 1] === '\\')) j++
        const body = src.slice(esc + 2, j)
        if (body.startsWith('8;')) {
          const sep = body.indexOf(';', 2) // OSC 8 ; params ; uri
          const uri = sep === -1 ? '' : body.slice(sep + 1)
          link = uri ? this._uriId(uri) : 0
        }
        i = j + (src[j] === '\x07' ? 1 : 2)
      } else {
        i = esc + (kind === undefined ? 1 : 2) // ESC + one byte (charset, keypad, ...)
      }
    }

    const count = ids.length
    let runCount = 0
    for (let k = 0; k < count; k++) {
      if (k === 0 || styles[k] !== styles[k - 1] || links[k] !== links[k - 1]) runCount++
    }
    if (cells.length < 2 * count || runs.length < 2 * runCount) return -count

    let run = -1
    for (let k = 0; k < count; k++) {
      if (k === 0 || styles[k] !== styles[k - 1] || links[k] !== links[k - 1]) {
        run++
        runs[2 * run] = styles[k]
        runs[2 * run + 1] = links[k]
      }
      cells[2 * k] = ids[k]
      cells[2 * k + 1] = (run << RUN_SHIFT) | packed[k]
    }
    return count
  }

  // --- painting --------------------------------------------------------------

  paint(target, targetWidth, x, y, cells, count, _unused, charMap, words) {
    const columns = targetWidth | 0
    const rowBase = (y | 0) * columns
    const charId = (gid) => (charMap ? charMap[gid] | 0 : gid | 0)
    const blank = charId(this.emptyCharIndex)
    const spacer = charId(this.spacerCharIndex)
    const { narrow, wide, spacerTail, spacerHead } = this.kinds
    let col = x | 0
    let first = Infinity
    let last = -1

    const put = (c, ch, word) => {
      if (c < 0 || c >= columns || y < 0) return
      const at = (rowBase + c) * 2
      if (at + 1 >= target.length) return
      target[at] = ch
      target[at + 1] = word
      if (c < first) first = c
      if (c > last) last = c
    }

    for (let k = 0; k < (count | 0); k++) {
      const p = cells[2 * k + 1]
      const word = words ? words[p >>> RUN_SHIFT] | 0 : 0
      if (p & TAB_FLAG) {
        const stop = this.tabWidth - (((col % this.tabWidth) + this.tabWidth) % this.tabWidth)
        for (let t = 0; t < stop; t++) put(col + t, blank, word | narrow)
        col += stop
        continue
      }
      const width = p & WIDTH_MASK
      if (width === 0) continue
      if (width === 1) {
        put(col, charId(cells[2 * k]), word | narrow)
        col += 1
      } else if (col === columns - 1) {
        put(col, blank, word | spacerHead) // a wide grapheme cannot straddle the edge
        col += 2
      } else {
        put(col, charId(cells[2 * k]), word | wide)
        put(col + 1, spacer, word | spacerTail)
        col += 2
      }
    }
    return pack(first, last + 1, col)
  }

  setCell(target, targetWidth, x, y, charId, word) {
    const columns = targetWidth | 0
    const c = x | 0
    const at = ((y | 0) * columns + c) * 2
    if (c < 0 || c >= columns || y < 0 || at + 1 >= target.length) return 0
    target[at] = charId
    target[at + 1] = word
    return pack(c, c + 1, c + 1)
  }
}

function pack(first, end, next) {
  const n = Math.max(0, Math.min(NEXT_MAX, next))
  if (!(end > first)) return n
  return end * END_FIELD + first * FIRST_FIELD + n
}
