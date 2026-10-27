// Track C: Bun.ant.CellSegmenter, exercised the way 2.1.311's Ink renderer
// drives it (a small re-statement of that usage, written for this test):
// construct with the screen's cell kinds, segment() into Int32Arrays and grow
// on a negative return, map grapheme ids through a char pool, pack each run's
// style word as style << 17 | link << 2, paint() into a screen buffer of
// [charId, word | kind] pairs, and decode the packed return value.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { vendor } from './C-support.mjs'
import { createBun } from '../../src/runtime/bun/install.js'
import { CellSegmenter } from '../../src/runtime/bun/cell-segmenter.js'

const Bun = createBun({ vendor })
const KIND = { narrow: 0, wide: 1, spacerTail: 2, spacerHead: 3 }
const SCREEN = { widthMask: 3, ...KIND, emptyCharIndex: 0, spacerCharIndex: 1, emptyWord: 0, tabWidth: 8 }
const BIDI = [[0x061c, 0x061c], [0x202a, 0x202e], [0x2066, 0x2069]]
const ONE_ATTRIBUTE = /^\x1b\[(?:\d{1,3})(?:;5;\d{1,3}|;2;\d{1,3};\d{1,3};\d{1,3})?m$/

const word = (style, link, kind) => (style << 17) | (link << 2) | kind
const decode = (packed) => ({ first: Math.floor(packed / 2 ** 20) % 65536, end: Math.floor(packed / 2 ** 36), next: packed % 2 ** 20 })

function harness(width = 20, height = 2) {
  const seg = new Bun.ant.CellSegmenter({ ambiguousIsNarrow: true, substitute: BIDI, screen: SCREEN })
  const chars = [' ', ''] // the screen's char pool: ' ' = 0, '' = 1
  const charIds = new Map(chars.map((c, i) => [c, i]))
  const intern = (c) => { if (!charIds.has(c)) { charIds.set(c, chars.length); chars.push(c) } return charIds.get(c) }
  const screen = new Int32Array(width * height * 2)
  let cells = new Int32Array(4)
  let runs = new Int32Array(4)
  let count = 0
  const h = {
    seg,
    chars,
    screen,
    segment(text) {
      let n = seg.segment(text, cells, runs, false)
      if (n < 0) {
        const m = Math.max(-n, cells.length)
        cells = new Int32Array(2 * m)
        runs = new Int32Array(2 * m)
        n = seg.segment(text, cells, runs, false)
      }
      count = n
      return n
    },
    get cells() { return cells.subarray(0, 2 * count) },
    get runs() { return runs },
    width(text, start = 0) {
      const n = h.segment(text)
      let col = start
      for (let i = 0; i < n; i++) {
        const p = cells[2 * i + 1]
        col += p & 256 ? 8 - (col % 8) : p & 255
      }
      return col - start
    },
    paint(text, x, y) {
      const n = h.segment(text)
      const charMap = Int32Array.from(seg.graphemes, intern)
      const lastRun = n ? cells[2 * n - 1] >>> 10 : 0
      const words = new Int32Array(lastRun + 1)
      for (let r = 0; r <= lastRun; r++) words[r] = word(runs[2 * r], runs[2 * r + 1], 0)
      return decode(seg.paint(screen, width, x, y, cells, n, undefined, charMap, words))
    },
    cell(x, y) {
      const i = (y * width + x) * 2
      return { ch: chars[screen[i]], style: screen[i + 1] >>> 17, link: (screen[i + 1] >>> 2) & 32767, kind: screen[i + 1] & 3 }
    },
    row(y) {
      let s = ''
      for (let x = 0; x < width; x++) s += h.cell(x, y).ch
      return s
    },
  }
  return h
}

test('constructor: tables start as the renderer expects', () => {
  const s = new Bun.ant.CellSegmenter({ ambiguousIsNarrow: true, substitute: BIDI, screen: SCREEN })
  assert.equal(s.graphemes[SCREEN.emptyCharIndex], ' ')
  assert.equal(s.graphemes[SCREEN.spacerCharIndex], '')
  assert.deepEqual(s.sgrKeys, [''])
  assert.deepEqual(s.sgrCloseKeys, [''])
  assert.deepEqual(s.uris, [''])
  // the same array objects are kept (the renderer caches them)
  const { graphemes, sgrKeys } = s
  s.segment('\x1b[1mx', new Int32Array(8), new Int32Array(8), false)
  assert.equal(s.graphemes, graphemes)
  assert.equal(s.sgrKeys, sgrKeys)
  assert.ok(graphemes.includes('x'))
  // works with no options at all (and without a global Bun)
  const bare = new CellSegmenter()
  assert.equal(bare.segment('a日', new Int32Array(8), new Int32Array(8)), 2)
})

test('segment: grapheme cells, widths, capacity protocol', () => {
  const s = new Bun.ant.CellSegmenter({ screen: SCREEN })
  const text = 'ab日👩‍💻é'
  const small = new Int32Array(4)
  assert.equal(s.segment(text, small, new Int32Array(4), false), -5, 'too small: -count, nothing written')
  assert.deepEqual([...small], [0, 0, 0, 0])
  const cells = new Int32Array(10)
  const runs = new Int32Array(10)
  assert.equal(s.segment(text, cells, runs, false), 5)
  const gs = [0, 1, 2, 3, 4].map((i) => s.graphemes[cells[2 * i]])
  assert.deepEqual(gs, ['a', 'b', '日', '👩‍💻', 'é'])
  const widths = [0, 1, 2, 3, 4].map((i) => cells[2 * i + 1] & 255)
  assert.deepEqual(widths, [1, 1, 2, 2, 1])
  assert.ok([0, 1, 2, 3, 4].every((i) => cells[2 * i + 1] >>> 10 === 0), 'one run')
  assert.equal(s.segment('', cells, runs, false), 0)
  // grapheme ids are stable across calls
  const id = cells[4]
  s.segment('日日', cells, runs, false)
  assert.equal(cells[0], id)
  assert.equal(cells[2], id)
})

test('segment: SGR runs; every key is one single-attribute code with its closer', () => {
  const s = new Bun.ant.CellSegmenter({ screen: SCREEN })
  const cells = new Int32Array(64)
  const runs = new Int32Array(64)
  const n = s.segment('a\x1b[1;31mbc\x1b[22md\x1b[38;5;196;48;2;1;2;3me\x1b[0mf\x1b[4:3mg\x1b[2Kh', cells, runs, false)
  assert.equal(n, 8, 'non-SGR escapes are dropped')
  const runOf = (i) => cells[2 * i + 1] >>> 10
  assert.deepEqual([...Array(n).keys()].map(runOf), [0, 1, 1, 2, 3, 4, 4, 4])
  const styleOfRun = (r) => runs[2 * r]
  assert.equal(styleOfRun(0), 0)
  assert.equal(styleOfRun(4), 0, 'reset returns to the plain style')
  const keys = (r) => s.sgrKeys[styleOfRun(r)].split('\0')
  const closes = (r) => s.sgrCloseKeys[styleOfRun(r)].split('\0')
  assert.deepEqual(keys(1), ['\x1b[1m', '\x1b[31m'])
  assert.deepEqual(closes(1), ['\x1b[22m', '\x1b[39m'])
  assert.deepEqual(keys(2), ['\x1b[31m'])
  assert.deepEqual(keys(3), ['\x1b[38;5;196m', '\x1b[48;2;1;2;3m'])
  assert.deepEqual(closes(3), ['\x1b[39m', '\x1b[49m'])
  for (let i = 1; i < s.sgrKeys.length; i++) {
    for (const code of s.sgrKeys[i].split('\0')) assert.match(code, ONE_ATTRIBUTE)
    assert.equal(s.sgrKeys[i].split('\0').length, s.sgrCloseKeys[i].split('\0').length)
  }
  // the same attribute set reached in another order shares an id
  const before = s.sgrKeys.length
  s.segment('\x1b[31;1mx', cells, runs, false)
  assert.equal(runs[0], styleOfRun(1))
  assert.equal(s.sgrKeys.length, before)
})

test('segment: styles do not leak between calls (a call is a function of its text)', () => {
  const s = new Bun.ant.CellSegmenter({ screen: SCREEN })
  const cells = new Int32Array(16)
  const runs = new Int32Array(16)
  s.segment('\x1b[1munclosed', cells, runs, false)
  assert.notEqual(runs[0], 0)
  s.segment('plain', cells, runs, false)
  assert.equal(runs[0], 0)
})

test('segment: OSC 8 hyperlinks become uri ids; tabs are flagged; bidi controls substituted', () => {
  const s = new Bun.ant.CellSegmenter({ screen: SCREEN, substitute: BIDI })
  const cells = new Int32Array(32)
  const runs = new Int32Array(32)
  const n = s.segment('x\x1b]8;id=1;https://a.example/\x07ln\x1b]8;;\x1b\\\ty‮z', cells, runs, false)
  assert.equal(n, 7)
  assert.equal(s.uris[1], 'https://a.example/')
  assert.deepEqual([runs[1], runs[3], runs[5]], [0, 1, 0], 'link runs')
  assert.equal(cells[2 * 3 + 1] & 256, 256, 'tab flag')
  assert.equal(cells[2 * 3 + 1] & 255, 0, 'tab has no width of its own')
  assert.equal(s.graphemes[cells[2 * 5]], '�', 'RLO shown as U+FFFD')
  assert.equal(cells[2 * 5 + 1] & 255, 1)
})

test('paint: cells, wide spacers, tabs, styles and links land in the screen; damage decodes', () => {
  const h = harness(20, 2)
  const d = h.paint('\x1b[1mab\x1b[22m日\tz', 1, 0)
  // columns: 1 a, 2 b, 3-4 日 + spacer, 5-7 tab blanks (stop at 8), 8 z
  assert.equal(h.row(0), ' ab日   z' + ' '.repeat(11))
  assert.deepEqual(h.cell(3, 0), { ch: '日', style: 0, link: 0, kind: KIND.wide })
  assert.deepEqual(h.cell(4, 0), { ch: '', style: 0, link: 0, kind: KIND.spacerTail })
  assert.notEqual(h.cell(1, 0).style, 0, 'bold run carries its style id')
  assert.equal(h.cell(1, 0).kind, KIND.narrow)
  assert.equal(h.cell(5, 0).ch, ' ', 'tab filled with blanks to the stop at 8')
  assert.deepEqual(d, { first: 1, end: 9, next: 9 })
  assert.equal(h.width('\x1b[1mab\x1b[22m日\tz', 1), 8)

  const link = h.paint('\x1b]8;;https://x.example/\x07go\x1b]8;;\x07', 0, 1)
  assert.equal(h.cell(0, 1).link, h.seg.uris.indexOf('https://x.example/'))
  assert.deepEqual(link, { first: 0, end: 2, next: 2 })
})

test('paint: clipping at the right edge, the straddling wide char, empty text', () => {
  const h = harness(6, 1)
  const d = h.paint('abcd日', 2, 0)
  assert.equal(h.row(0), '  abcd')
  assert.deepEqual(d, { first: 2, end: 6, next: 8 }, 'damage covers written cells; next keeps counting')
  const h2 = harness(6, 1)
  h2.paint('abcde日', 0, 0)
  assert.deepEqual(h2.cell(5, 0), { ch: ' ', style: 0, link: 0, kind: KIND.spacerHead })
  const h3 = harness(6, 1)
  assert.deepEqual(h3.paint('​', 3, 0), { first: 0, end: 0, next: 3 }, 'nothing drawn: no damage, next = x')
})

test('setCell writes one cell and reports one column of damage', () => {
  const h = harness(4, 2)
  const packed = h.seg.setCell(h.screen, 4, 2, 1, 7, word(3, 0, KIND.narrow))
  assert.deepEqual(decode(packed), { first: 2, end: 3, next: 3 })
  assert.equal(h.screen[(1 * 4 + 2) * 2], 7)
  assert.equal(h.screen[(1 * 4 + 2) * 2 + 1] >>> 17, 3)
  assert.equal(h.seg.setCell(h.screen, 4, 4, 0, 7, 0), 0, 'outside the row: nothing')
  assert.equal(h.seg.setCell(h.screen, 4, 0, 5, 7, 0), 0, 'outside the screen: nothing')
})

test('ambiguous-width characters follow ambiguousIsNarrow', () => {
  const narrow = new Bun.ant.CellSegmenter({ ambiguousIsNarrow: true, screen: SCREEN })
  const wide = new Bun.ant.CellSegmenter({ ambiguousIsNarrow: false, screen: SCREEN })
  const cells = new Int32Array(4)
  const runs = new Int32Array(4)
  narrow.segment('±', cells, runs, false)
  assert.equal(cells[1] & 255, 1)
  wide.segment('±', cells, runs, false)
  assert.equal(cells[1] & 255, 2)
})
