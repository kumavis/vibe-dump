// Track C: Bun.YAML, Bun.JSONL, Bun.TOML, Bun.semver, Bun.deepEquals.
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isDeepStrictEqual } from 'node:util'
import { vendor } from './C-support.mjs'
import { createBun } from '../../src/runtime/bun/install.js'

const Bun = createBun({ vendor })
const te = new TextEncoder()

// --- YAML ----------------------------------------------------------------------

test('YAML round-trips structured frontmatter-like values', () => {
  const values = [
    { name: 'my-skill', description: 'Does things: well', 'allowed-tools': ['Read', 'Write', 'Bash(git:*)'], nested: { a: 1, b: [true, false, null], c: { d: 'x' } } },
    { long: 'a'.repeat(300), multi: 'line one\nline two\n', unicode: '日本語 🎉', quoteish: "it's \"quoted\"", num: 1.5, neg: -3, empty: '' },
    [1, 'two', { three: 3 }],
    'just a string',
    42,
    null,
  ]
  for (const v of values) {
    for (const space of [2, 4, undefined]) {
      const text = Bun.YAML.stringify(v, null, space)
      assert.ok(!text.endsWith('\n'), 'no trailing newline (the bundle appends its own)')
      assert.deepEqual(Bun.YAML.parse(text), v, `space=${space}: ${text}`)
    }
  }
})

test('YAML.stringify: block style with an indent, one-line flow style without, no folding', () => {
  assert.equal(Bun.YAML.stringify({ a: 1, b: [1, 2] }, null, 2), 'a: 1\nb:\n  - 1\n  - 2')
  assert.equal(Bun.YAML.stringify({ a: { b: 1 } }, null, 4), 'a:\n    b: 1')
  const flow = Bun.YAML.stringify({ a: 1, b: [1, 2] })
  assert.ok(!flow.includes('\n'))
  assert.deepEqual(Bun.YAML.parse(flow), { a: 1, b: [1, 2] })
  assert.ok(!Bun.YAML.stringify({ d: 'word '.repeat(40).trim() }, null, 2).includes('\n'))
  // replacer works like JSON.stringify's
  assert.deepEqual(Bun.YAML.parse(Bun.YAML.stringify({ a: 1, secret: 2 }, (k, v) => (k === 'secret' ? undefined : v), 2)), { a: 1 })
})

test('YAML.parse: documents, empty input, errors', () => {
  assert.deepEqual(Bun.YAML.parse('a: 1\nlist:\n  - x\n  - y\n'), { a: 1, list: ['x', 'y'] })
  assert.deepEqual(Bun.YAML.parse('---\na: 1\n---\nb: 2\n'), [{ a: 1 }, { b: 2 }])
  assert.equal(Bun.YAML.parse(''), null)
  assert.equal(Bun.YAML.parse('# only a comment\n'), null)
  assert.throws(() => Bun.YAML.parse('a: [1, 2\nb: 3'))
  assert.throws(() => Bun.YAML.parse('a: 1\n  b: 2\n c: 3'))
})

// --- JSONL ---------------------------------------------------------------------

const records = [{ type: 'user', message: { content: 'hi 日本' } }, { n: 1 }, [1, 2], 'str', 3.5, null, true]
const jsonl = records.map((r) => JSON.stringify(r)).join('\n') + '\n'

test('JSONL round-trips (string and bytes input, CRLF, blank lines, BOM)', () => {
  assert.deepEqual(Bun.JSONL.parse(jsonl), records)
  assert.deepEqual(Bun.JSONL.parse(te.encode(jsonl)), records)
  assert.deepEqual(Bun.JSONL.parse(Buffer.from(jsonl)), records)
  assert.deepEqual(Bun.JSONL.parse(jsonl.replace(/\n/g, '\r\n')), records)
  assert.deepEqual(Bun.JSONL.parse('\n\n' + jsonl.replace(/\n/g, '\n\n')), records)
  assert.deepEqual(Bun.JSONL.parse('\uFEFF' + jsonl), records)
  assert.deepEqual(Bun.JSONL.parse(new Uint8Array([0xef, 0xbb, 0xbf, ...te.encode(jsonl)])), records)
  assert.deepEqual(Bun.JSONL.parse(jsonl.trimEnd()), records, 'last line without a newline')
  assert.deepEqual(Bun.JSONL.parse(''), [])
})

test('JSONL.parseChunk: complete input', () => {
  const r = Bun.JSONL.parseChunk(jsonl)
  assert.deepEqual(r, { values: records, read: jsonl.length, done: true, error: null })
  const b = te.encode(jsonl)
  assert.deepEqual(Bun.JSONL.parseChunk(b).read, b.length, 'byte offsets for byte input')
})

test('JSONL.parseChunk: a bad line stops with error and read at its start', () => {
  const text = '{"a":1}\n{"b":\n{"c":3}\n'
  const r = Bun.JSONL.parseChunk(text)
  assert.deepEqual(r.values, [{ a: 1 }])
  assert.equal(r.read, 8)
  assert.equal(r.done, false)
  assert.ok(r.error instanceof SyntaxError)
  // byte input: offsets in bytes (the first line holds multi-byte UTF-8)
  const bytes = te.encode('{"k":"日本"}\nnot json\n{"z":0}\n')
  const rb = Bun.JSONL.parseChunk(bytes)
  assert.equal(rb.read, te.encode('{"k":"日本"}\n').length)
  assert.ok(rb.error)
})

test('JSONL.parseChunk: a truncated last line is "not yet complete", not an error', () => {
  const text = '{"a":1}\n{"b":2}\n{"c":'
  const r = Bun.JSONL.parseChunk(text)
  assert.deepEqual(r.values, [{ a: 1 }, { b: 2 }])
  assert.equal(r.read, 16)
  assert.equal(r.done, false)
  assert.equal(r.error, null)
  assert.throws(() => Bun.JSONL.parse(text), /truncated/)
})

test('JSONL.parseChunk: start/end window, and the skip-bad-lines reader pattern recovers every good line', () => {
  const text = '{"a":1}\n{"b":2}\n{"c":3}\n'
  assert.deepEqual(Bun.JSONL.parseChunk(text, 8).values, [{ b: 2 }, { c: 3 }])
  assert.deepEqual(Bun.JSONL.parseChunk(text, 8, 16), { values: [{ b: 2 }], read: 16, done: true, error: null })

  // The way 2.1.311's transcript loader drives it: on an error, skip past the
  // next newline after `read` and continue from there.
  function readAll(input) {
    const nl = typeof input === 'string' ? '\n' : 10
    let r = Bun.JSONL.parseChunk(input)
    let values = r.values
    while (r.error && !r.done && r.read < input.length) {
      const next = input.indexOf(nl, r.read)
      if (next === -1) break
      r = Bun.JSONL.parseChunk(input, next + 1)
      values = values.concat(r.values)
    }
    return values
  }
  const messy = '{"a":1}\ngarbage\n{"b":2}\n{"broken":\n\n{"c":3}\n{"tail":'
  assert.deepEqual(readAll(messy), [{ a: 1 }, { b: 2 }, { c: 3 }])
  assert.deepEqual(readAll(te.encode(messy)), [{ a: 1 }, { b: 2 }, { c: 3 }])
})

// --- TOML ----------------------------------------------------------------------

test('TOML.parse: a realistic config file', () => {
  const doc = `
# MCP servers, as another tool's config.toml lists them
model = "o4"
approval = 'never'   # literal string
max_tokens = 1_000
ratio = 0.5
enabled = true
created = 1979-05-27T07:32:00Z
hex = 0xDEAD_BEEF
inf_val = -inf

[mcp_servers.github]
command = "npx"
args = ["-y", "@modelcontextprotocol/server-github",]
env = { GITHUB_TOKEN = "x", "quoted key" = 1 }

[mcp_servers."with.dot"]
command = "uvx"
args = [
  "a",  # comment inside an array
  "b",
]

[[profiles]]
name = "one"
[[profiles]]
name = "two"
nested.value = "dotted"
`
  assert.deepEqual(Bun.TOML.parse(doc), {
    model: 'o4',
    approval: 'never',
    max_tokens: 1000,
    ratio: 0.5,
    enabled: true,
    created: '1979-05-27T07:32:00Z',
    hex: 0xdeadbeef,
    inf_val: -Infinity,
    mcp_servers: {
      github: { command: 'npx', args: ['-y', '@modelcontextprotocol/server-github'], env: { GITHUB_TOKEN: 'x', 'quoted key': 1 } },
      'with.dot': { command: 'uvx', args: ['a', 'b'] },
    },
    profiles: [{ name: 'one' }, { name: 'two', nested: { value: 'dotted' } }],
  })
})

test('TOML.parse: strings and escapes', () => {
  const t = Bun.TOML.parse([
    'a = "tab\\tnew\\nquote\\" u\\u00e9 U\\U0001F600"',
    'b = """',
    'line1',
    'line2 \\',
    '   continued"""',
    "c = '''",
    'raw \\n kept',
    "'''",
    'd = """two quotes at the end"""""',
    "e = 'C:\\path'",
  ].join('\n'))
  assert.equal(t.a, 'tab\tnew\nquote" u\u00e9 U\u{1F600}')
  assert.equal(t.b, 'line1\nline2 continued')
  assert.equal(t.c, 'raw \\n kept\n')
  assert.equal(t.d, 'two quotes at the end""')
  assert.equal(t.e, 'C:\\path')
})

test('TOML.parse: errors carry line and column; "__proto__" is a plain key', () => {
  assert.throws(() => Bun.TOML.parse('a = 1\na = 2'), /line 2.*duplicate key/)
  assert.throws(() => Bun.TOML.parse('[t]\n[t]'), /defined twice/)
  assert.throws(() => Bun.TOML.parse('a = "unterminated'), SyntaxError)
  assert.throws(() => Bun.TOML.parse('a = nope'), /invalid value/)
  assert.throws(() => Bun.TOML.parse('a = 1 b = 2'), /end of line/)
  const t = Bun.TOML.parse('__proto__ = 1\n[x.__proto__]\ny = 2')
  assert.equal(Object.getPrototypeOf(t), Object.prototype)
  assert.equal(t.__proto__, 1)
  assert.deepEqual(Object.keys(t.x), ['__proto__'])
})

// --- semver --------------------------------------------------------------------

test('semver.order and satisfies (npm semantics)', () => {
  assert.equal(Bun.semver.order('1.2.3', '1.2.3'), 0)
  assert.equal(Bun.semver.order('1.2.10', '1.2.9'), 1)
  assert.equal(Bun.semver.order('1.0.0-alpha', '1.0.0'), -1)
  assert.equal(Bun.semver.order('2.1.311', '2.1.112'), 1)
  assert.throws(() => Bun.semver.order('not a version', '1.0.0'))
  assert.equal(Bun.semver.satisfies('1.4.4', '>=1.2.23'), true)
  assert.equal(Bun.semver.satisfies('24.2.0', '>=22.17.0 <23.0.0 || >=24.2.0'), true)
  assert.equal(Bun.semver.satisfies('23.1.0', '>=22.17.0 <23.0.0 || >=24.2.0'), false)
  assert.equal(Bun.semver.satisfies('1.0.0-beta', '^1.0.0'), false)
  assert.equal(Bun.semver.satisfies('1.0.0-beta.2', '>=1.0.0-beta.1'), true)
})

// --- deepEquals ----------------------------------------------------------------

test('deepEquals: loose (toEqual) semantics', () => {
  const eq = Bun.deepEquals
  assert.ok(eq({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }))
  assert.ok(!eq({ a: 1 }, { a: 2 }))
  assert.ok(eq(NaN, NaN))
  assert.ok(!eq(0, -0))
  assert.ok(eq({ a: 1, b: undefined }, { a: 1 }), 'undefined properties ignored')
  assert.ok(eq([1, , 3], [1, undefined, 3]), 'holes equal undefined')
  assert.ok(eq(new Date(5), new Date(5)))
  assert.ok(!eq(new Date(5), new Date(6)))
  assert.ok(eq(/a/gi, /a/gi))
  assert.ok(!eq(/a/g, /a/i))
  assert.ok(eq(new Map([[{ k: 1 }, 'v']]), new Map([[{ k: 1 }, 'v']])))
  assert.ok(!eq(new Map([[1, 'a']]), new Map([[1, 'b']])))
  assert.ok(eq(new Set([{ a: 1 }, 2]), new Set([2, { a: 1 }])))
  assert.ok(!eq(new Set([{ a: 1 }, { a: 1 }]), new Set([{ a: 1 }, { a: 2 }])))
  assert.ok(eq(new Uint8Array([1, 2]), new Uint8Array([1, 2])))
  assert.ok(!eq(new Uint8Array([1, 2]), new Int8Array([1, 2])))
  assert.ok(eq(new Uint8Array([1, 2]).buffer, new Uint8Array([1, 2]).buffer))
  assert.ok(eq(new Error('x'), new Error('x')))
  assert.ok(!eq(new Error('x'), new TypeError('x')))
  assert.ok(!eq([1, 2], { 0: 1, 1: 2, length: 2 }))
  assert.ok(eq(Object.create(null), {}), 'prototypes ignored when loose')
  const c1 = { n: 1 }; c1.self = c1
  const c2 = { n: 1 }; c2.self = c2
  assert.ok(eq(c1, c2), 'cycles')
  // settings objects as the bundle compares them
  const settings = { permissions: { allow: ['Read'], deny: [] }, env: { A: '1' } }
  assert.ok(eq(structuredClone(settings), settings))
})

test('deepEquals: strict (toStrictEqual) semantics', () => {
  const eq = (a, b) => Bun.deepEquals(a, b, true)
  assert.ok(eq({ a: [1] }, { a: [1] }))
  assert.ok(!eq({ a: 1, b: undefined }, { a: 1 }))
  assert.ok(!eq([1, , 3], [1, undefined, 3]))
  assert.ok(!eq(Object.create(null), {}))
  class A { constructor() { this.x = 1 } }
  assert.ok(!eq(new A(), { x: 1 }))
  assert.ok(eq(new A(), new A()))
})

test('deepEquals agrees with util.isDeepStrictEqual on JSON-like values', () => {
  const rnd = (d) => {
    const r = Math.random()
    if (d > 3 || r < 0.3) return [1, 'a', true, null, 2.5, ''][Math.floor(Math.random() * 6)]
    if (r < 0.65) return Array.from({ length: Math.floor(Math.random() * 4) }, () => rnd(d + 1))
    return Object.fromEntries(Array.from({ length: Math.floor(Math.random() * 4) }, (_, i) => [`k${i}`, rnd(d + 1)]))
  }
  for (let i = 0; i < 300; i++) {
    const a = rnd(0)
    const b = Math.random() < 0.5 ? structuredClone(a) : rnd(0)
    assert.equal(Bun.deepEquals(a, b, true), isDeepStrictEqual(a, b))
  }
})
