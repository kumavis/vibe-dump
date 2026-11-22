#!/usr/bin/env node
// Cross-checks this engine's WAT assembler against wabt: every top-level
// (module ...) in the spec .wast files is assembled with wat.js and compared
// with the .wasm wast2json produced for it (custom sections stripped).
// Identical bytes count as a match; otherwise both are decoded and compared
// structurally (signatures instead of type indices, so harmless differences
// in implicit type order are tolerated).
//
//   node tools/wat-crosscheck.mjs <wast-dir> <json-root> [-v]

import fs from 'node:fs'
import path from 'node:path'
import { assemble } from '../src/engine/wat.js'
import { decode, instrText } from '../src/engine/decode.js'
import { disassemble, linesToText } from '../src/engine/disasm.js'

const [wastDir, jsonRoot] = process.argv.slice(2).filter((a) => !a.startsWith('-'))
const verbose = process.argv.includes('-v')

function stripCustom(bytes) {
  const out = [...bytes.subarray(0, 8)]
  let p = 8
  while (p < bytes.length) {
    const start = p
    const id = bytes[p++]
    let size = 0, shift = 0, b
    do {
      b = bytes[p++]
      size += (b & 0x7f) * 2 ** shift
      shift += 7
    } while (b & 0x80)
    const end = p + size
    if (id !== 0) out.push(...bytes.subarray(start, end))
    p = end
  }
  return Uint8Array.from(out)
}

function canon(bytes) {
  const m = decode(bytes)
  const sig = (t) => (t ? `(${t.params})->(${t.results})` : '?')
  const ins = (i) => {
    let s = instrText(i)
    if (i.bt && typeof i.bt.raw === 'number') s = s.replace(/\(type \d+\)/, sig(m.types[i.bt.raw]))
    if (i.code === 0x11) s = s.replace(/\(type \d+\)/, sig(m.types[i.type]))
    return s
  }
  return JSON.stringify({
    imports: m.imports.map((i) => [i.module, i.name, i.kind, i.kind === 'func' ? sig(m.types[i.typeIndex]) : i.desc]),
    funcs: m.funcs.filter((f) => f.body).map((f) => [sig(f.type), f.body.localTypes.join(','), f.body.code.map(ins)]),
    tables: m.tables.map((t) => [t.elemType, t.min, t.max]),
    mems: m.memories.map((x) => [x.min, x.max]),
    globals: m.globals.map((g) => [g.type, g.mut, g.init && g.init.map(ins)]),
    exports: m.exports.map((e) => [e.name, e.kind, e.index]).sort((a, b) => (a[0] < b[0] ? -1 : 1)),
    start: m.start,
    elems: m.elems.map((e) => [e.mode, e.table, e.elemType, e.offset && e.offset.map(ins), e.init.map((x) => x.map(ins))]),
    datas: m.datas.map((d) => [d.mode, d.offset && d.offset.map(ins), [...d.bytes].join(',')]),
  }, (k, v) => (typeof v === 'bigint' ? v.toString() : v))
}

// split a .wast into top-level forms using the assembler's own tokenizer rules
function topForms(src) {
  const forms = []
  let i = 0, depth = 0, start = -1
  while (i < src.length) {
    const c = src[i]
    if (c === ';' && src[i + 1] === ';') {
      while (i < src.length && src[i] !== '\n') i++
      continue
    }
    if (c === '(' && src[i + 1] === ';') {
      let d = 0
      while (i < src.length) {
        if (src[i] === '(' && src[i + 1] === ';') { d++; i += 2 } else if (src[i] === ';' && src[i + 1] === ')') { d--; i += 2; if (!d) break } else i++
      }
      continue
    }
    if (c === '"') {
      i++
      while (i < src.length && src[i] !== '"') i += src[i] === '\\' ? 2 : 1
      i++
      continue
    }
    if (c === '(') {
      if (depth === 0) start = i
      depth++
    } else if (c === ')') {
      depth--
      if (depth === 0) forms.push(src.slice(start, i + 1))
    }
    i++
  }
  return forms
}

let total = 0, exact = 0, structural = 0, failed = 0
for (const f of fs.readdirSync(wastDir).filter((x) => x.endsWith('.wast')).sort()) {
  const name = f.slice(0, -5)
  if (name.startsWith('simd')) continue
  const jsonPath = path.join(jsonRoot, name, name + '.json')
  if (!fs.existsSync(jsonPath)) continue
  const cmds = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).commands.filter((c) => c.type === 'module')
  const forms = topForms(fs.readFileSync(path.join(wastDir, f), 'utf8')).filter((s) => /^\(module\b/.test(s))
  if (forms.length !== cmds.length) {
    console.log(`${name}: ${forms.length} forms vs ${cmds.length} modules, skipped`)
    continue
  }
  let fileFail = 0
  forms.forEach((src, k) => {
    if (/^\(module\s+(\$\S+\s+)?quote/.test(src)) return
    total++
    const want = fs.readFileSync(path.join(jsonRoot, name, cmds[k].filename))
    let got
    try {
      got = assemble(src).bytes
    } catch (e) {
      failed++
      fileFail++
      if (verbose || fileFail <= 2) console.log(`  ${name} #${k} (line ${cmds[k].line}): assembler error: ${e.message}`)
      return
    }
    const a = stripCustom(got), b = stripCustom(want)
    if (a.length === b.length && a.every((x, i) => x === b[i])) {
      exact++
      return
    }
    try {
      if (canon(a) === canon(b)) {
        structural++
        return
      }
    } catch (e) {
      void e
    }
    failed++
    fileFail++
    if (verbose || fileFail <= 2) console.log(`  ${name} #${k} (line ${cmds[k].line}): output differs from wabt`)
  })
  if (fileFail) console.log(`${name}: ${fileFail} mismatches`)
}
console.log(`\n${total} modules: ${exact} byte-identical, ${structural} structurally identical, ${failed} different/failed`)

// Phase 2: disassembler round trip. Every binary wast2json wrote for a module
// command (plus assert_invalid/unlinkable binaries) is decoded, listed with
// disassemble(), re-assembled with wat.js and compared structurally.
let rt = 0, rtOk = 0, rtFail = 0
for (const name of fs.readdirSync(jsonRoot).sort()) {
  if (name.startsWith('simd')) continue
  const jp = path.join(jsonRoot, name, name + '.json')
  if (!fs.existsSync(jp)) continue
  for (const c of JSON.parse(fs.readFileSync(jp, 'utf8')).commands) {
    if (!c.filename || !c.filename.endsWith('.wasm') || !['module', 'assert_unlinkable', 'assert_uninstantiable', 'assert_trap'].includes(c.type)) continue
    const bytes = fs.readFileSync(path.join(jsonRoot, name, c.filename))
    let mod
    try {
      mod = decode(bytes)
    } catch {
      continue
    }
    rt++
    let text = ''
    try {
      text = linesToText(disassemble(mod, { maxData: Infinity }))
      const back = assemble(text).bytes
      if (canon(stripCustom(back)) === canon(stripCustom(bytes))) rtOk++
      else throw new Error('structure differs')
    } catch (e) {
      rtFail++
      if (verbose || rtFail <= 5) console.log(`  round trip ${name}:${c.line}: ${e.message}`)
    }
  }
}
console.log(`disassemble -> assemble round trip: ${rtOk}/${rt} equivalent, ${rtFail} failed`)
