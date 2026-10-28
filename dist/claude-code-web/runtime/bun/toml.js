// Bun.TOML.parse: a small TOML 1.0 reader (Bun has no TOML.stringify).
//
// Covers what config files use: comments, bare / quoted / dotted keys,
// [tables], [[arrays of tables]], basic and literal strings (single and
// multi-line, with escapes), integers (_, 0x, 0o, 0b), floats (inf, nan),
// booleans, arrays and inline tables. Dates and times are returned as their
// source text. Duplicate keys and redefined tables are errors, reported as
// SyntaxError with line and column. 2.1.311 uses it for one importer's
// config file, so this errs on the side of simple.

const BARE_KEY = /[A-Za-z0-9_-]+/y
const DATETIME = /\d{4}-\d{2}-\d{2}(?:[Tt ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:[Zz]|[+-]\d{2}:\d{2})?)?|\d{2}:\d{2}:\d{2}(?:\.\d+)?/y
const NUMBER = /[+-]?(?:inf|nan)|0x[0-9A-Fa-f](?:_?[0-9A-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|[+-]?(?:0|[1-9](?:_?\d)*)(?:\.\d(?:_?\d)*)?(?:[eE][+-]?\d(?:_?\d)*)?/y
const WORD_CHAR = /[A-Za-z0-9_+.:-]/

const isTable = (v) => v !== null && typeof v === 'object' && !Array.isArray(v)

// Plain data properties, so a key like "__proto__" is just a key.
function define(obj, key, value) {
  Object.defineProperty(obj, key, { value, writable: true, enumerable: true, configurable: true })
  return value
}
const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

export function parseTOML(input) {
  const src = String(input)
  let pos = 0
  const root = {}
  let table = root
  const explicit = new Set() // tables opened by a [header]
  const inlineTables = new WeakSet() // inline tables are closed once written

  function fail(message) {
    const before = src.slice(0, pos)
    const line = before.split('\n').length
    const column = pos - before.lastIndexOf('\n')
    throw new SyntaxError(`TOML parse error at line ${line}, column ${column}: ${message}`)
  }

  const ws = () => { while (src[pos] === ' ' || src[pos] === '\t') pos++ }
  const comment = () => { if (src[pos] === '#') while (pos < src.length && src[pos] !== '\n') pos++ }
  const newline = () => {
    if (src[pos] === '\n') { pos++; return true }
    if (src[pos] === '\r' && src[pos + 1] === '\n') { pos += 2; return true }
    return false
  }
  const blank = () => { for (;;) { ws(); comment(); if (!newline()) return } }
  const endOfLine = () => { ws(); comment(); if (pos < src.length && !newline()) fail('expected end of line') }

  function key() {
    const parts = []
    for (;;) {
      ws()
      if (src[pos] === '"') parts.push(basicString())
      else if (src[pos] === "'") parts.push(literalString())
      else {
        BARE_KEY.lastIndex = pos
        const m = BARE_KEY.exec(src)
        if (!m) fail('expected a key')
        parts.push(m[0])
        pos = BARE_KEY.lastIndex
      }
      ws()
      if (src[pos] !== '.') return parts
      pos++
    }
  }

  function escape() {
    const c = src[pos++]
    switch (c) {
      case 'b': return '\b'
      case 't': return '\t'
      case 'n': return '\n'
      case 'f': return '\f'
      case 'r': return '\r'
      case 'e': return '\x1b'
      case '"': return '"'
      case '\\': return '\\'
      case 'u':
      case 'U': {
        const n = c === 'u' ? 4 : 8
        const hex = src.slice(pos, pos + n)
        if (!/^[0-9A-Fa-f]+$/.test(hex) || hex.length !== n) fail('invalid unicode escape')
        pos += n
        const cp = parseInt(hex, 16)
        if (cp > 0x10ffff || (cp >= 0xd800 && cp <= 0xdfff)) fail('invalid unicode scalar')
        return String.fromCodePoint(cp)
      }
      default:
        pos--
        return fail(`invalid escape \\${c ?? ''}`)
    }
  }

  function basicString() {
    if (src.startsWith('"""', pos)) return multiline('"')
    pos++
    let out = ''
    for (;;) {
      if (pos >= src.length) fail('unterminated string')
      const c = src[pos++]
      if (c === '"') return out
      if (c === '\n') fail('newline in a single-line string')
      out += c === '\\' ? escape() : c
    }
  }

  function literalString() {
    if (src.startsWith("'''", pos)) return multiline("'")
    const close = src.indexOf("'", pos + 1)
    const nl = src.indexOf('\n', pos + 1)
    if (close === -1 || (nl !== -1 && nl < close)) fail('unterminated literal string')
    const out = src.slice(pos + 1, close)
    pos = close + 1
    return out
  }

  // """...""" or '''...''': a newline right after the opener is dropped, and
  // up to two quotes may sit right before the closer.
  function multiline(q) {
    const fence = q.repeat(3)
    pos += 3
    newline()
    let out = ''
    for (;;) {
      if (pos >= src.length) fail('unterminated multi-line string')
      if (src.startsWith(fence, pos)) {
        pos += 3
        for (let extra = 0; extra < 2 && src[pos] === q; extra++) { out += q; pos++ }
        return out
      }
      const c = src[pos++]
      if (q === '"' && c === '\\') {
        // a backslash at the end of a line swallows the newline and following whitespace
        let p = pos
        while (src[p] === ' ' || src[p] === '\t') p++
        if (src[p] === '\n' || (src[p] === '\r' && src[p + 1] === '\n')) {
          pos = p
          while (/[ \t\r\n]/.test(src[pos] ?? '')) pos++
          continue
        }
        out += escape()
      } else {
        out += c
      }
    }
  }

  function number() {
    NUMBER.lastIndex = pos
    const m = NUMBER.exec(src)
    if (!m || WORD_CHAR.test(src[NUMBER.lastIndex] ?? '')) return undefined
    pos = NUMBER.lastIndex
    const t = m[0].replace(/_/g, '')
    if (/inf$/.test(t)) return t[0] === '-' ? -Infinity : Infinity
    if (/nan$/.test(t)) return NaN
    if (/^0[xob]/.test(t)) return parseInt(t.slice(2), { x: 16, o: 8, b: 2 }[t[1]])
    return Number(t)
  }

  function value() {
    ws()
    const c = src[pos]
    if (c === '"') return basicString()
    if (c === "'") return literalString()
    if (c === '[') return array()
    if (c === '{') return inlineTable()
    for (const [word, v] of [['true', true], ['false', false]]) {
      if (src.startsWith(word, pos) && !WORD_CHAR.test(src[pos + word.length] ?? '')) { pos += word.length; return v }
    }
    DATETIME.lastIndex = pos
    const dt = DATETIME.exec(src)
    if (dt && !WORD_CHAR.test(src[DATETIME.lastIndex] ?? '')) { pos = DATETIME.lastIndex; return dt[0] }
    const n = number()
    if (n !== undefined) return n
    return fail('invalid value')
  }

  function array() {
    pos++
    const out = []
    for (;;) {
      blank()
      if (src[pos] === ']') { pos++; return out }
      out.push(value())
      blank()
      if (src[pos] === ',') { pos++; continue }
      if (src[pos] === ']') { pos++; return out }
      fail('expected "," or "]" in array')
    }
  }

  function inlineTable() {
    pos++
    const obj = {}
    blank()
    if (src[pos] === '}') { pos++; inlineTables.add(obj); return obj }
    for (;;) {
      const k = key()
      if (src[pos] !== '=') fail('expected "="')
      pos++
      assign(obj, k, value())
      blank()
      if (src[pos] === ',') { pos++; blank(); continue }
      if (src[pos] === '}') { pos++; inlineTables.add(obj); return obj }
      fail('expected "," or "}" in inline table')
    }
  }

  // a.b.c = v inside `obj`: intermediate tables are created as needed.
  function assign(obj, keys, v) {
    let t = obj
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!own(t, k)) define(t, k, {})
      t = t[k]
      if (!isTable(t) || inlineTables.has(t)) fail(`key "${keys.slice(0, i + 1).join('.')}" is not a table`)
    }
    const last = keys[keys.length - 1]
    if (own(t, last)) fail(`duplicate key "${keys.join('.')}"`)
    define(t, last, v)
  }

  function header() {
    pos++
    const isArray = src[pos] === '['
    if (isArray) pos++
    const keys = key()
    if (src[pos] !== ']' || (isArray && src[pos + 1] !== ']')) fail('expected "]"')
    pos += isArray ? 2 : 1
    endOfLine()

    let t = root
    for (let i = 0; i < keys.length - 1; i++) {
      const k = keys[i]
      if (!own(t, k)) define(t, k, {})
      t = t[k]
      if (Array.isArray(t)) t = t[t.length - 1]
      if (!isTable(t) || inlineTables.has(t)) fail(`"${keys.slice(0, i + 1).join('.')}" is not a table`)
    }
    const last = keys[keys.length - 1]
    if (isArray) {
      const arr = own(t, last) ? t[last] : define(t, last, [])
      if (!Array.isArray(arr) || inlineTables.has(arr)) fail(`"${keys.join('.')}" is not an array of tables`)
      table = {}
      arr.push(table)
      return
    }
    const id = JSON.stringify(keys)
    if (explicit.has(id)) fail(`table [${keys.join('.')}] defined twice`)
    explicit.add(id)
    const existing = own(t, last) ? t[last] : define(t, last, {})
    if (!isTable(existing) || inlineTables.has(existing)) fail(`"${keys.join('.')}" is not a table`)
    table = existing
  }

  for (;;) {
    blank()
    if (pos >= src.length) return root
    if (src[pos] === '[') {
      header()
    } else {
      const k = key()
      if (src[pos] !== '=') fail('expected "="')
      pos++
      assign(table, k, value())
      endOfLine()
    }
  }
}
