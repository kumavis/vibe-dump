// Every tutorial lesson and built-in example must assemble, validate and run
// on the engine, and every narration beat must line up with the real trace.
import test from 'node:test'
import assert from 'node:assert/strict'
import { assemble, decode, validate, createImports, instantiate, annotate, WasmValidationError } from '../src/engine/index.js'
import { LESSONS } from '../src/ui/lessons.js'
import { EXAMPLES } from '../src/ui/examples.js'

function run(wat, entry, args) {
  const { bytes } = assemble(wat)
  const module = validate(decode(bytes))
  const host = createImports(module, {})
  const m = instantiate(module, host.imports, { start: 'pending' })
  m.invoke(entry, args)
  const trace = [null]
  let ev
  while ((ev = m.step())) trace.push(ev)
  return { m, trace, bytes, module, host }
}

function find(tree, q) {
  let hit = null
  const walk = (n) => {
    if (hit) return
    if (n.kind === q.kind && (!q.label || q.label.test(n.label))) hit = n
    else if (n.children) n.children.forEach(walk)
  }
  walk(tree)
  return hit
}

test('lessons: programs run and beats match the step trace', () => {
  for (const L of LESSONS) {
    const { m, trace, bytes, module } = run(L.wat, L.invoke.name, L.invoke.args)
    const at = L.beats.filter((b) => b.at != null)
    assert.ok(at.length, `lesson ${L.id} has run beats`)
    let prev = -1
    for (const b of at) {
      assert.ok(b.at > prev, `lesson ${L.id}: beats in order (${b.at})`)
      prev = b.at
      assert.ok(b.at < trace.length, `lesson ${L.id}: beat at ${b.at} within ${trace.length - 1} steps`)
      if (b.at > 0) assert.equal(trace[b.at].instr.op, b.op, `lesson ${L.id}: step ${b.at} executes ${b.op}`)
    }
    assert.equal(at[at.length - 1].at, trace.length - 1, `lesson ${L.id}: last beat is the last step`)
    if (L.id === 8) assert.equal(m.status, 'trapped')
    else assert.equal(m.status, 'done', `lesson ${L.id} finishes`)
    const walk = L.beats.filter((b) => b.w != null)
    walk.forEach((b, i) => assert.equal(b.w, i, `lesson ${L.id}: walk beats are 0..n`))
    if (L.walk && L.walk.kind === 'validate') {
      assert.equal(walk.length - 1, module.funcs[L.walk.func].body.code.length, 'validation walk covers every instruction')
    }
    if (L.walk && L.walk.kind === 'binary') {
      const tree = annotate(bytes)
      for (const b of walk) assert.ok(find(tree, b.find), `lesson ${L.id}: binary stop ${b.w} found`)
    }
  }
})

test('lessons: specific outcomes', () => {
  const r = (id) => {
    const L = LESSONS.find((x) => x.id === id)
    return run(L.wat, L.invoke.name, L.invoke.args).m
  }
  assert.equal(r(1).results[0].value, 35)
  assert.equal(r(2).results[0].value, 49)
  assert.equal(r(3).results[0].value, 3.5)
  assert.equal(r(4).results[0].value, -1)
  assert.equal(r(5).results[0].value, 6)
  assert.deepEqual(r(6).results.map((v) => v.value), [3, 2])
  assert.equal(r(7).results[0].value, 24n)
  assert.equal(r(8).trap.kind, 'out-of-bounds-memory')
  assert.equal(r(9).results[0].value, 42)
  // lesson 4's other path, lesson 9's traps
  const L4 = LESSONS[3]
  assert.equal(run(L4.wat, 'sign', [5]).m.results[0].value, 1)
  const L9 = LESSONS[8]
  assert.equal(run(L9.wat, 'apply', [3, 6, 7]).m.trap.kind, 'indirect-call-type-mismatch')
  assert.equal(run(L9.wat, 'apply', [4, 6, 7]).m.trap.kind, 'undefined-element')
  // lesson 4: the br_if carries one value and cuts one
  const t4 = run(L4.wat, 'sign', [-5]).trace[7]
  assert.equal(t4.control.kept, 1)
  assert.equal(t4.control.unwound, 1)
})

test('lessons: the ill-typed variant is rejected by validation', () => {
  const L = LESSONS.find((x) => x.variant)
  const { bytes } = assemble(L.variant.wat)
  assert.throws(() => validate(decode(bytes)), (e) => e instanceof WasmValidationError && /type mismatch/.test(e.message) && e.op === 'f64.div')
})

test('examples: every built-in WAT example runs', () => {
  for (const ex of EXAMPLES) {
    if (!ex.wat) continue
    const { bytes } = assemble(ex.wat)
    const module = validate(decode(bytes))
    let out = ''
    const host = createImports(module, { stdout: (t) => (out += t) })
    const m = instantiate(module, host.imports, { start: 'pending' })
    m.invoke(ex.invoke.name, ex.invoke.args)
    const r = m.run({ maxSteps: 50_000_000 })
    assert.ok(r.reason === 'done' || r.reason === 'exit', `${ex.id}: ${r.reason} ${m.trap && m.trap.message}`)
    if (ex.expect) ex.expect(m, out)
  }
})
