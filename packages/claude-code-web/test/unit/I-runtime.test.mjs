// Integration: the pieces between the tracks that the browser run depends on.
// - boot/specifiers.js: the service worker's built-in specifier rewriting
// - boot/module-graph.js: which __bunRequire sites run at module evaluation,
//   and the pre-import order derived from that
// - boot/require.js: globalThis.__bunRequire over the pre-import registry
// - node/fs.js regressions found by running the real CLI
import test from 'node:test'
import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { load, getRuntime } from './B-support.mjs'
import { eagerSites, preImportOrder, bootGraph, GRAPH_VERSION } from '../../src/runtime/boot/module-graph.js'
import { makeRequire } from '../../src/runtime/boot/require.js'

const NEEDLE = '__bunRequire("'
const at = (src, nth = 0) => { let i = -1; for (let k = 0; k <= nth; k++) i = src.indexOf(NEEDLE, i + 1); return i }

test('fs: a descriptor-copying clone (graceful-fs) keeps the stream classes', async () => {
  const fs = (await load('node/fs.js')).default
  // graceful-fs clone.js: same prototype, every own property descriptor copied
  const clone = { __proto__: Object.getPrototypeOf(fs) }
  for (const k of Object.getOwnPropertyNames(fs)) Object.defineProperty(clone, k, Object.getOwnPropertyDescriptor(fs, k))
  for (const k of ['ReadStream', 'WriteStream', 'FileReadStream', 'FileWriteStream']) {
    assert.equal(typeof clone[k], 'function', `${k} on the clone`)
    assert.equal(clone[k], fs[k])
  }
  fs.mkdirSync('/home/user/gfs', { recursive: true })
  fs.writeFileSync('/home/user/gfs/a.txt', 'abc')
  const chunks = []
  for await (const c of fs.createReadStream('/home/user/gfs/a.txt')) chunks.push(c)
  assert.equal(Buffer.concat(chunks).toString(), 'abc')
})

test('specifiers: built-ins in import positions become shim URLs, nothing else changes', async () => {
  const { rewriteSpecifiers } = await load('boot/specifiers.js')
  const shim = '/b/runtime/node/'
  const src = [
    'import{readFileSync as a}from"fs";',
    'import*as p from "node:path";',
    'import"node:events";',
    'const c=await import("crypto"),d=await import( "fs/promises" );',
    'export{WebSocket}from"ws";',
    'import u from"undici";',
    'import k from"/b/vfs/app/chunk-abc.js";',
    'const s=\'imported from "claude-code"\';',
    'const t="from";const v=import.meta.url;'
  ].join('')
  const out = rewriteSpecifiers(src, shim)
  assert.equal(out, [
    'import{readFileSync as a}from"/b/runtime/node/fs.js";',
    'import*as p from "/b/runtime/node/path.js";',
    'import"/b/runtime/node/events.js";',
    'const c=await import("/b/runtime/node/crypto.js"),d=await import( "/b/runtime/node/fs/promises.js" );',
    'export{WebSocket}from"/b/runtime/node/ws.js";',
    'import u from"/b/runtime/node/undici.js";',
    'import k from"/b/vfs/app/chunk-abc.js";',
    'const s=\'imported from "claude-code"\';',
    'const t="from";const v=import.meta.url;'
  ].join(''))
  // "node:ws" is not a thing: npm names are bare only
  assert.equal(rewriteSpecifiers('import"node:ws"', shim), 'import"node:ws"')
})

test('specifiers: every mapped shim file exists in the built runtime', async () => {
  const { SPECIFIER_MAP } = await load('node/BUILTINS.js')
  const dir = await getRuntime()
  const missing = Object.entries(SPECIFIER_MAP).filter(([, f]) => !existsSync(join(dir, 'node', f)))
  assert.deepEqual(missing, [])
})

test('module-graph: eagerSites tells top-level requires from deferred ones', () => {
  const r = (p) => `globalThis.__bunRequire("/a/${p}.js")`
  const cases = [
    [`var A=${r('x')}.default;`, [true]],
    [`function f(){return ${r('x')}}`, [false]],
    [`var f=()=>${r('x')};`, [false]],
    [`var g=(a)=>{${r('x')}};var B=${r('y')};`, [false, true]],
    // braces inside strings, template literals, regexes and comments do not nest
    [`var s="{{(";var t=\`\${1}{\`;var re=/[{(]/g;/* { */// {\nvar C=${r('x')};`, [true]],
    [`var u=\`a\${${r('x')}}b\`;`, [false]],
    [`var D=1/2;var E=${r('x')};`, [true]],
    [`if(x){${r('x')}}`, [false]] // top-level blocks count as nesting: errs on the lazy side
  ]
  for (const [src, want] of cases) {
    const eager = eagerSites(src, NEEDLE)
    const got = want.map((_, n) => eager.has(at(src, n)))
    assert.deepEqual(got, want, src)
  }
})

test('module-graph: preImportOrder puts what a module needs at evaluation first', () => {
  const app = '/b/vfs/app/'
  const f = (name) => `${app}${name}`
  const files = new Map([
    [f('cli'), `import"${f('a.js')}";`],
    // a requires b at its top level: b (and its static import c) must come first
    [f('a.js'), `import"${f('d.js')}";var B=globalThis.__bunRequire("${f('b.js')}");`],
    [f('b.js'), `import{c}from"${f('c.js')}";export var b=c;`],
    [f('c.js'), 'export var c=1;'],
    [f('d.js'), 'export var d=1;'],
    // e requires f lazily, f requires e lazily: an in-function cycle, dropped
    [f('e.js'), `export function e(){return globalThis.__bunRequire("${f('f.js')}")}`],
    [f('f.js'), `export function g(){return globalThis.__bunRequire("${f('e.js')}")}`],
    // h requires i at top level while i imports h: no order satisfies it
    [f('h.js'), `var I=globalThis.__bunRequire("${f('i.js')}");export var h=1;`],
    [f('i.js'), `import{h}from"${f('h.js')}";export var i=h;`],
    [f('notes.md'), 'not js']
  ])
  const { order, targets, cyclic, dropped } = preImportOrder(files, app)
  const pos = (n) => order.indexOf(f(n))
  assert.ok(!order.includes(f('cli')), 'the entry itself is imported last, by boot.js')
  for (const n of ['a.js', 'b.js', 'e.js', 'f.js', 'h.js', 'i.js']) assert.ok(pos(n) >= 0, `${n} in the order`)
  assert.ok(pos('c.js') < pos('b.js') && pos('b.js') < pos('a.js'), order.join(' '))
  assert.deepEqual([...targets].sort(), ['b.js', 'e.js', 'f.js', 'i.js'].map(f))
  assert.deepEqual(cyclic, [[f('h.js'), f('i.js')]])
  assert.equal(dropped.length, 2)
  const g = bootGraph(files, app)
  assert.equal(g.version, GRAPH_VERSION)
  assert.deepEqual(g.order, order)
  assert.deepEqual(JSON.parse(JSON.stringify(g)), g, 'plain JSON for the manifest')
})

test('require: shims, registry, text assets, cycle proxies, MODULE_NOT_FOUND', () => {
  const registry = new Map()
  const misses = []
  const text = new Map([['/b/vfs/app/prompt.md', '# hi']])
  const req = makeRequire({
    registry,
    known: new Set(['/b/vfs/app/late.js']),
    isShimmed: (id) => id === 'fs' || id === 'ws',
    requireShim: (id) => ({ shim: id }),
    fs: { existsSync: (p) => text.has(p), readFileSync: (p) => text.get(p) },
    onMiss: (p) => misses.push(p)
  })
  assert.deepEqual(req('fs'), { shim: 'fs' })
  const ns = { default: 7, x: 1 }
  registry.set('/b/vfs/app/a.js', ns)
  assert.equal(req('/b/vfs/app/a.js'), ns, 'a namespace is returned as is, never unwrapped')
  assert.equal(req('http://h/b/vfs/app/a.js'), ns, 'URLs are keyed by pathname')
  assert.equal(req('/b/vfs/app/prompt.md'), '# hi')
  assert.throws(() => req('/b/vfs/app/nope.js'), { code: 'MODULE_NOT_FOUND' })

  // a top-level require inside an import cycle: answered before the target exists
  const lazy = req('/b/vfs/app/late.js')
  assert.deepEqual(misses, ['/b/vfs/app/late.js'])
  const { Tool, make } = lazy // destructured at once, as minified code does
  class RealTool { constructor (n) { this.n = n } static kind () { return 'tool' } }
  registry.set('/b/vfs/app/late.js', { Tool: RealTool, make: (n) => n * 2, value: 3 })
  assert.equal(lazy.value, 3, 'the namespace forwards once registered')
  assert.equal(make(21), 42, 'an early-read function export forwards calls')
  assert.equal(new Tool(5).n, 5, 'and construction')
  assert.equal(Tool.kind(), 'tool', 'and property reads')
  assert.equal(lazy.then, undefined, 'never a thenable')
})
