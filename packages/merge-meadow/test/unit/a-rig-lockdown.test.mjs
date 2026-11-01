// The rig doc layer under SES lockdown({ overrideTaming: 'severe' }) (rule §2.11,
// design §17.6): the expression parser and compiler, the model library and its
// resolution, and the model ops all run with frozen intrinsics, and an expression
// still reaches nothing but its declared variables.
import 'ses'
import test from 'node:test'
import assert from 'node:assert/strict'

lockdown({ overrideTaming: 'severe', errorTaming: 'unsafe', consoleTaming: 'unsafe' })

const { compileExpr, parseExpr } = await import('../../src/doc/expr.js')
const { MODEL_LIBRARY, LIBRARY_ORDER, resolveModel, resolveRepresentation, validateModel, ensureLibraryOps } = await import('../../src/doc/models.js')
const { seeded } = await import('./a-helpers.mjs')
const { applyOps } = await import('../../src/doc/ops.js')
const { modelData, docSummary } = await import('../../src/doc/read.js')

test('under lockdown: expressions parse, compile and evaluate; errors carry a column', () => {
  assert.ok(Object.isFrozen(Array.prototype) && Object.isFrozen(Math))
  const f = compileExpr('clamp(sin(phase*tau)*(20 + 10*gait), -25, 25) + (st < 0.3 ? st : 0.3) % 1')
  const vars = harden({ phase: 0.25, gait: 1, st: 0.1 })
  assert.equal(f(vars), 25 + 0.1)
  assert.equal(compileExpr('1/0')(vars), 0)
  let e = null
  try { parseExpr('sin(t) + constructor') } catch (x) { e = x }
  assert.ok(e instanceof SyntaxError)
  assert.equal(e.column, 10)
  for (const src of ['globalThis', 'Function', 'eval', 'this', 'constructor', '__proto__', 'Math.PI', 't.constructor', 'Object']) assert.throws(() => compileExpr(src), SyntaxError, src)
})

test('under lockdown: an expression sees nothing but its variables', () => {
  const asked = []
  const vars = new Proxy(harden({ t: 2 }), { get (o, k) { asked.push(k); return o[k] } })
  assert.equal(compileExpr('t * 3 + rand')(vars), 6)
  assert.deepEqual(asked.sort(), ['rand', 't'])
})

test('under lockdown: the library validates and resolves; model ops write and read back', () => {
  const lib = Object.fromEntries(LIBRARY_ORDER.map((n) => [n, { ...MODEL_LIBRARY[n], rev: 1 }]))
  for (const n of LIBRARY_ORDER) assert.deepEqual(validateModel(MODEL_LIBRARY[n], lib, { name: n }), [], n)
  const r = resolveModel(lib, 'trex')
  assert.ok(!Object.isFrozen(r.nodes), 'resolved data is a fresh, mutable copy (not the frozen library)')
  assert.doesNotThrow(() => harden(resolveModel(lib, 'horse')), 'and plain enough to harden for CapTP')
  const h = seeded()
  assert.deepEqual(ensureLibraryOps(h.doc()), [])
  applyOps(h, [{ op: 'defineModel', name: 'pony', model: { extends: 'horse', stride: 1.2, animations: { walk: { tracks: { 'tail.rz': 'sin(phase*tau)*9' } } } } }])
  assert.equal(modelData(h.doc(), 'pony').stride, 1.2)
  assert.ok(docSummary(h.doc()).models.some((m) => m.name === 'pony'))
  assert.match(resolveRepresentation(h.doc(), { kind: 'rig', model: 'pony' }).key, /^model:pony:1\.1\.1:[0-9a-f]{14}$/)
  assert.throws(() => applyOps(h, [{ op: 'defineModel', name: 'bad', model: { extends: 'horse', animations: { walk: { tracks: { 'tail.rz': 'eval(1)' } } } } }]), /unknown function 'eval'/)
})
