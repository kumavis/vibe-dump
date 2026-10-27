// Track C: Bun.stringWidth / stripANSI / wrapAnsi / sliceAnsi.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { vendor } from './C-support.mjs'
import { createBun } from '../../src/runtime/bun/install.js'

const Bun = createBun({ vendor })

test('stringWidth: ASCII, CJK, emoji, combining marks, ANSI, controls', () => {
  assert.equal(Bun.stringWidth('hello'), 5)
  assert.equal(Bun.stringWidth('日本語'), 6)
  assert.equal(Bun.stringWidth('한국어'), 6)
  assert.equal(Bun.stringWidth('ｆｕｌｌ'), 8) // fullwidth forms
  assert.equal(Bun.stringWidth('🎉'), 2)
  assert.equal(Bun.stringWidth('👩‍💻'), 2) // ZWJ sequence is one grapheme
  assert.equal(Bun.stringWidth('👍🏽'), 2) // skin-tone modifier
  assert.equal(Bun.stringWidth('🇯🇵'), 2) // flag
  assert.equal(Bun.stringWidth('é'), 1) // decomposed é
  assert.equal(Bun.stringWidth('\x1b[1;31mred\x1b[0m'), 3)
  assert.equal(Bun.stringWidth('\x1b]8;;https://example.com\x07link\x1b]8;;\x07'), 4)
  assert.equal(Bun.stringWidth('a\tb'), 2) // tab counts nothing, as in Bun / string-width
  assert.equal(Bun.stringWidth(''), 0)
  assert.equal(Bun.stringWidth(undefined), 0)
  assert.equal(Bun.stringWidth(12345), 5)
})

test('stringWidth: ambiguousIsNarrow and countAnsiEscapeCodes options', () => {
  assert.equal(Bun.stringWidth('±→'), 2)
  assert.equal(Bun.stringWidth('±→', { ambiguousIsNarrow: true }), 2)
  assert.equal(Bun.stringWidth('±→', { ambiguousIsNarrow: false }), 4)
  // the escapes' printable bytes count, ESC itself is a zero-width control
  assert.equal(Bun.stringWidth('\x1b[31mx\x1b[39m', { countAnsiEscapeCodes: true }), 9)
})

test('stripANSI removes SGR, OSC 8 and cursor sequences only', () => {
  assert.equal(Bun.stripANSI('\x1b[1m\x1b[38;5;196mbold red\x1b[0m'), 'bold red')
  assert.equal(Bun.stripANSI('\x1b]8;;https://a.b\x07x\x1b]8;;\x07'), 'x')
  assert.equal(Bun.stripANSI('a\x1b[2Kb\x1b[1Gc'), 'abc')
  assert.equal(Bun.stripANSI('日本 🎉'), '日本 🎉')
  assert.equal(Bun.stripANSI(null), '')
})

test('wrapAnsi: word wrap by columns, hard wrap, SGR re-opened on each line', () => {
  assert.equal(Bun.wrapAnsi('the quick brown fox', 10), 'the quick\nbrown fox')
  assert.equal(Bun.wrapAnsi('abcdefghij', 4, { hard: true }), 'abcd\nefgh\nij')
  assert.equal(Bun.wrapAnsi('日本語のテキスト', 6, { hard: true }), '日本語\nのテキ\nスト')
  const wrapped = Bun.wrapAnsi('\x1b[1mbold words here\x1b[22m', 6)
  const lines = wrapped.split('\n')
  assert.equal(lines.length, 3)
  for (const line of lines) {
    assert.ok(Bun.stringWidth(line) <= 6)
    assert.match(line, /^\x1b\[1m/, 'style re-opened at the start of each line')
  }
  assert.equal(Bun.stripANSI(wrapped), 'bold\nwords\nhere')
  assert.equal(Bun.wrapAnsi('', 5), '')
})

test('wrapAnsi keeps tabs as tabs (offsets the caller re-styles at do not move)', () => {
  const out = Bun.wrapAnsi('\tindented line of text', 12)
  assert.ok(out.startsWith('\t'))
  assert.ok(!out.includes('\x01'))
  assert.equal(out.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim(), 'indented line of text')
})

test('sliceAnsi slices by columns and keeps the styling of the kept part', () => {
  assert.equal(Bun.sliceAnsi('hello world', 0, 5), 'hello')
  assert.equal(Bun.sliceAnsi('hello world', 6), 'world')
  assert.equal(Bun.sliceAnsi('日本語', 2, 4), '本')
  const styled = Bun.sliceAnsi('\x1b[31mred\x1b[39m plain', 1, 5)
  assert.equal(Bun.stripANSI(styled), 'ed p')
  assert.match(styled, /\x1b\[31m/)
  assert.match(styled, /\x1b\[39m/)
  // An end inside a wide character keeps the whole character (slice-ansi's
  // rule); the renderer then narrows the end until the slice fits, which must
  // always converge.
  const s = 'ab日本cd'
  assert.equal(Bun.sliceAnsi(s, 0, 3), 'ab日')
  for (let want = 0; want <= Bun.stringWidth(s); want++) {
    let end = want
    let piece = Bun.sliceAnsi(s, 0, end)
    while (end > 0 && Bun.stringWidth(piece) > want) piece = Bun.sliceAnsi(s, 0, --end)
    assert.ok(Bun.stringWidth(piece) <= want)
    assert.ok(Bun.stringWidth(piece) >= want - 1)
  }
})
