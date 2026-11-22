// Decoder (offsets, annotated byte tree, errors, unsupported features),
// validator (errors, static type stacks) and disassembler.
import test from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { assemble } from '../src/engine/wat.js'
import { decode, annotate, findInstrAt, WasmDecodeError, WasmFeatureError } from '../src/engine/decode.js'
import { validate, functionTypeStacks, WasmValidationError } from '../src/engine/validate.js'
import { disassemble, disassembleFunction, linesToText } from '../src/engine/disasm.js'

const SRC = `(module $demo
  (type $t (func (param i32 i32) (result i32)))
  (import "env" "print" (func $print (param i32)))
  (memory 1)
  (global $g (mut i32) (i32.const 0))
  (func $add (export "add") (type $t) (local $tmp i32)
    (local.set $tmp (i32.add (local.get 0) (local.get 1)))
    (call $print (local.get $tmp))
    (block $b (result i32) (br_if $b (local.get $tmp) (i32.const 1)) (drop) (i32.const 0)))
  (data (i32.const 0) "hello"))`

const fixture = new URL('./fixtures/hello.wasm', import.meta.url)

function checkTree(node, len) {
  // children are ordered, non-overlapping and inside their parent
  const leaves = []
  const walk = (n) => {
    assert.ok(n.start <= n.end, `${n.label}: start <= end`)
    if (!n.children || n.children.length === 0) {
      leaves.push(n)
      return
    }
    let prev = n.start
    for (const c of n.children) {
      assert.ok(c.start >= prev, `${c.label} starts after previous sibling (${c.start} < ${prev}) in ${n.label}`)
      assert.ok(c.end <= n.end, `${c.label} inside ${n.label}`)
      prev = c.end
      walk(c)
    }
  }
  walk(node)
  // leaves tile the whole file with no gaps
  let at = 0
  for (const l of leaves) {
    if (l.start === l.end) continue
    assert.equal(l.start, at, `gap before leaf "${l.label}" at ${l.start}`)
    at = l.end
  }
  assert.equal(at, len, 'leaves cover the whole file')
  return leaves
}

test('decoder keeps section, body and instruction offsets', () => {
  const { bytes } = assemble(SRC)
  const m = decode(bytes)
  assert.deepEqual(m.sections.map((s) => s.name), ['type', 'import', 'function', 'memory', 'global', 'export', 'code', 'data', 'custom'])
  for (const s of m.sections) assert.equal(s.end, s.contentOffset + s.size)
  const f = m.funcs[1]
  assert.equal(f.import, null)
  assert.deepEqual(f.body.localTypes, ['i32', 'i32', 'i32'])
  for (const ins of f.body.code) {
    assert.ok(ins.offset >= f.body.codeOffset && ins.offset + ins.len <= f.body.end)
    // re-decoding the instruction's own bytes yields the same opcode
    assert.equal(bytes[ins.offset], ins.code >= 0xe0 ? 0xfc : ins.code)
    assert.deepEqual(findInstrAt(m, ins.offset + ins.len - 1), { funcIndex: 1, pc: f.body.code.indexOf(ins) })
  }
  assert.equal(m.names.module, 'demo')
  assert.equal(m.names.funcs.get(1), 'add')
  assert.equal(m.names.locals.get(1).get(2), 'tmp')
  assert.equal(m.datas[0].bytesOffset + 5, m.datas[0].bytesOffset + m.datas[0].bytes.length)
  assert.equal(String.fromCharCode(...bytes.subarray(m.datas[0].bytesOffset, m.datas[0].bytesOffset + 5)), 'hello')
})

test('annotated byte tree tiles the file and labels LEB128/vec/functype nodes', () => {
  const { bytes } = assemble(SRC)
  const tree = annotate(bytes)
  const leaves = checkTree(tree, bytes.length)
  const labels = leaves.map((l) => l.label)
  assert.ok(labels.includes('magic "\\0asm" (00 61 73 6d)'))
  assert.ok(labels.includes('version 1 (01 00 00 00)'))
  assert.ok(labels.some((l) => /^vec length = 2 types \(LEB128\)$/.test(l)))
  const all = []
  const walk = (n) => {
    all.push(n)
    for (const c of n.children || []) walk(c)
  }
  walk(tree)
  assert.ok(all.some((n) => n.label === 'functype (i32,i32)->i32'))
  assert.ok(all.some((n) => n.kind === 'instr' && n.label === 'i32.const 1'))
  assert.ok(all.some((n) => n.kind === 'section' && n.label === 'code section'))
  const real = fs.readFileSync(fixture)
  checkTree(annotate(real), real.length)
  checkTree(annotate(real, { annotateBodies: false }), real.length)
})

test('malformed input gives clear errors with byte offsets', () => {
  const bad = (arr) => {
    try {
      decode(Uint8Array.from(arr))
    } catch (e) {
      assert.ok(e instanceof WasmDecodeError, String(e))
      return e
    }
    assert.fail('should not decode: ' + arr)
  }
  assert.match(bad([0, 0x61, 0x73]).message, /unexpected end/)
  assert.match(bad([1, 2, 3, 4, 1, 0, 0, 0]).message, /magic header/)
  assert.equal(bad([0, 0x61, 0x73, 0x6d, 2, 0, 0, 0]).offset, 4)
  const e = bad([0, 0x61, 0x73, 0x6d, 1, 0, 0, 0, 1, 5, 1, 0x60, 0, 0])
  assert.match(e.message, /0x/)
  assert.equal(bad([0, 0x61, 0x73, 0x6d, 1, 0, 0, 0, 1, 1, 1, 1, 1]).offset, 11) // functype runs past the 1-byte section
  assert.match(bad([0, 0x61, 0x73, 0x6d, 1, 0, 0, 0, 3, 1, 0, 1, 1, 0]).message, /out of order|duplicate/)
  assert.match(bad([0, 0x61, 0x73, 0x6d, 1, 0, 0, 0, 1, 6, 1, 0x60, 0x80, 0x80, 0x80, 0x80, 0x80]).message, /too long|unexpected end/)
})

test('unsupported proposals are rejected by name', () => {
  const feature = (bytes) => {
    try {
      decode(bytes)
    } catch (e) {
      assert.ok(e instanceof WasmFeatureError, String(e))
      return e.feature
    }
    assert.fail('expected feature error')
  }
  const hdr = [0, 0x61, 0x73, 0x6d, 1, 0, 0, 0]
  const body = (code, types = [1, 4, 1, 0x60, 0, 0]) => Uint8Array.from([...hdr, ...types, 3, 2, 1, 0, 10, code.length + 3, 1, code.length + 1, 0, ...code])
  assert.match(feature(body([0xfd, 0x0c, ...new Array(16).fill(0), 0x1a, 0x0b])), /SIMD/)
  assert.match(feature(body([0xfe, 0x03, 0x00, 0x0b])), /threads/)
  assert.match(feature(body([0x12, 0x00, 0x0b])), /tail calls/)
  assert.match(feature(body([0x08, 0x00, 0x0b])), /exception/)
  assert.match(feature(body([0xfb, 0x00, 0x0b])), /GC/)
  assert.match(feature(Uint8Array.from([...hdr, 5, 3, 1, 0x04, 1])), /memory64/)
  assert.match(feature(Uint8Array.from([...hdr, 5, 4, 1, 0x03, 1, 1])), /shared memory/)
  assert.match(feature(Uint8Array.from([...hdr, 5, 5, 2, 0, 1, 0, 1])), /multi-memory/)
  assert.match(feature(Uint8Array.from([...hdr, 1, 5, 1, 0x60, 1, 0x7b, 0])), /SIMD/)
  assert.match(feature(Uint8Array.from([...hdr, 13, 3, 1, 0, 0])), /exception/)
})

test('validator rejects broken modules with located messages', () => {
  const invalid = (src, re) => {
    const m = decode(assemble(src).bytes)
    assert.throws(() => validate(m), (e) => e instanceof WasmValidationError && re.test(e.message), src)
  }
  invalid('(module (func (result i32) (i64.const 1)))', /type mismatch: expected i32 but found i64/)
  invalid('(module (func (i32.add (i32.const 1))))', /underflow/)
  invalid('(module (func (local.get 3)))', /unknown local 3/)
  invalid('(module (global i32 (i32.const 1)) (func (global.set 0 (i32.const 2))))', /immutable/)
  invalid('(module (func (drop (i32.load (i32.const 0)))))', /unknown memory/)
  invalid('(module (memory 1) (func (drop (i32.load align=8 (i32.const 0)))))', /alignment/)
  invalid('(module (func (br 1)))', /unknown label/)
  invalid('(module (func (result i32) (i32.const 1) (i32.const 2)))', /extra value/)
  invalid('(module (func (drop (ref.func 0))))', /undeclared function reference/)
  invalid('(module (func (memory.init 1 (i32.const 0) (i32.const 0) (i32.const 0))) (memory 1) (data ""))', /unknown data segment 1/)
  const e = (() => {
    try {
      validate(decode(assemble('(module (func $broken (result i32) (f32.const 1)))').bytes))
    } catch (err) {
      return err
    }
  })()
  assert.equal(e.funcIndex, 0)
  assert.equal(e.pc, 1)
  assert.match(e.message, /\$broken/)
})

test('validator annotates blocks and static type stacks', () => {
  const m = validate(decode(assemble(SRC).bytes))
  const code = m.funcs[1].body.code
  const block = code.find((i) => i.op === 'block')
  assert.equal(code[block.blk.end].op, 'end')
  assert.equal(block.blk.results, 1)
  const stacks = functionTypeStacks(m, 1)
  assert.equal(stacks.length, code.length)
  const addIdx = code.findIndex((i) => i.op === 'i32.add')
  assert.deepEqual(stacks[addIdx].stack, ['i32', 'i32'])
  assert.deepEqual(stacks[code.length - 1].stack, ['i32'])
  const br = code.findIndex((i) => i.op === 'br_if')
  assert.deepEqual(stacks[br].stack, ['i32', 'i32'])
})

test('disassembler produces named, indented lines with byte offsets', () => {
  const m = validate(decode(assemble(SRC).bytes))
  const lines = disassembleFunction(m, 1)
  assert.equal(lines[0].text, '(func $add (export "add") (type $t) (param i32) (param i32) (result i32)')
  assert.equal(lines[1].text, '(local $tmp i32)')
  const instrs = lines.filter((l) => l.kind === 'instr' || l.kind === 'end')
  assert.equal(instrs.length, m.funcs[1].body.code.length)
  instrs.forEach((l, i) => {
    assert.equal(l.pc, i)
    assert.equal(l.offset, m.funcs[1].body.code[i].offset)
  })
  const text = linesToText(lines)
  assert.match(text, /local\.set \$tmp/)
  assert.match(text, /call \$print/)
  assert.match(text, /block \(result i32\) {2};; label = @0/)
  assert.match(text, /br_if 0 \(;@0;\)/)
  const whole = linesToText(disassemble(m))
  assert.match(whole, /\(import "env" "print" \(func \$print/)
  assert.match(whole, /\(data \(offset i32\.const 0\) "hello"\)/)
  assert.match(whole, /\(global \$g \(mut i32\)/)
  // works on a toolchain-produced binary too
  const real = validate(decode(fs.readFileSync(fixture)))
  const d = disassemble(real)
  assert.ok(d.length > 100)
  assert.ok(d.some((l) => /call \$fib/.test(l.text) || /call \d+/.test(l.text)))
})

test('disassembly re-assembles to an equivalent module (clang binary)', async () => {
  const bytes = fs.readFileSync(fixture)
  const text = linesToText(disassemble(decode(bytes), { maxData: Infinity }))
  const back = assemble(text).bytes
  const a = decode(bytes), b = decode(back)
  assert.equal(b.funcs.length, a.funcs.length)
  for (const f of a.funcs) {
    if (!f.body) continue
    const g = b.funcs[f.index]
    assert.deepEqual(g.body.code.map((i) => i.op), f.body.code.map((i) => i.op), `function ${f.index}`)
  }
  // and behaves the same
  const { runWasi } = await import('../src/engine/index.js')
  assert.equal(runWasi(back).stdout, runWasi(bytes).stdout)
})
