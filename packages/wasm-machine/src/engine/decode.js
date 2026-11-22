// WebAssembly binary decoder: bytes -> module object, keeping byte offsets for
// every section, function body and instruction, plus an optional annotated
// walk of the whole file (see annotate()).

import { OPS, FC_BASE, BYTE_VALTYPE, SECTION_NAMES, UNSUPPORTED_OPCODES } from './opcodes.js'
import { f32FromBits, f64FromWords, formatValue } from './values.js'

export class WasmDecodeError extends Error {
  constructor(message, offset) {
    super(offset == null ? message : `${message} (at byte 0x${offset.toString(16)})`)
    this.name = 'WasmDecodeError'
    this.offset = offset
    this.rawMessage = message
  }
}

/** Thrown when the module uses a proposal this engine doesn't implement. */
export class WasmFeatureError extends WasmDecodeError {
  constructor(feature, offset) {
    super(`this module uses ${feature}, which this engine does not support`, offset)
    this.name = 'WasmFeatureError'
    this.feature = feature
  }
}

const utf8 = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true })

// ---------------------------------------------------------------------------
// Annotation tree

class Annotator {
  constructor(size) {
    this.root = { start: 0, end: size, label: 'WebAssembly module', kind: 'module', children: [] }
    this.stack = [this.root]
  }
  top() {
    return this.stack[this.stack.length - 1]
  }
  open(start, label, kind) {
    const node = { start, end: start, label, kind, children: [] }
    this.top().children.push(node)
    this.stack.push(node)
    return node
  }
  close(end, label) {
    const node = this.stack.pop()
    node.end = end
    if (label != null) node.label = label
    return node
  }
  leaf(start, end, label, kind, value) {
    const node = { start, end, label, kind }
    if (value !== undefined) node.value = value
    this.top().children.push(node)
    return node
  }
}

// ---------------------------------------------------------------------------
// Reader

class Reader {
  constructor(bytes, ann) {
    this.b = bytes
    this.pos = 0
    this.end = bytes.length
    this.ann = ann
  }
  fail(msg, at = this.pos) {
    throw new WasmDecodeError(msg, at)
  }
  eof() {
    return this.pos >= this.end
  }
  u8() {
    if (this.pos >= this.end) this.fail('unexpected end of section or function')
    return this.b[this.pos++]
  }
  peek() {
    if (this.pos >= this.end) this.fail('unexpected end of section or function')
    return this.b[this.pos]
  }
  u32() {
    const start = this.pos
    let result = 0
    let shift = 0
    for (let i = 0; ; i++) {
      if (this.pos >= this.end) this.fail('unexpected end (truncated LEB128)', start)
      const byte = this.b[this.pos++]
      if (i === 4) {
        if (byte & 0x80) this.fail('integer representation too long', start)
        if (byte & 0x70) this.fail('integer too large', start)
      }
      result += (byte & 0x7f) * 2 ** shift
      shift += 7
      if (!(byte & 0x80)) break
    }
    return result
  }
  s32() {
    const start = this.pos
    let result = 0
    let shift = 0
    let byte
    for (let i = 0; ; i++) {
      if (this.pos >= this.end) this.fail('unexpected end (truncated LEB128)', start)
      byte = this.b[this.pos++]
      if (i === 4) {
        if (byte & 0x80) this.fail('integer representation too long', start)
        // remaining 4 bits must be a sign extension of bit 3
        const top = byte & 0x78
        if (top !== 0 && top !== 0x78) this.fail('integer too large', start)
        if ((byte & 0x08) ? top !== 0x78 : top !== 0) this.fail('integer too large', start)
      }
      result |= (byte & 0x7f) << shift
      shift += 7
      if (!(byte & 0x80)) break
    }
    if (shift < 32 && byte & 0x40) result |= -1 << shift
    return result | 0
  }
  s33() {
    const start = this.pos
    let result = 0n
    let shift = 0n
    let byte
    for (let i = 0; ; i++) {
      if (this.pos >= this.end) this.fail('unexpected end (truncated LEB128)', start)
      byte = this.b[this.pos++]
      if (i === 4) {
        if (byte & 0x80) this.fail('integer representation too long', start)
        const top = byte & 0x60
        if ((byte & 0x10) ? top !== 0x60 : top !== 0) this.fail('integer too large', start)
      }
      result |= BigInt(byte & 0x7f) << shift
      shift += 7n
      if (!(byte & 0x80)) break
    }
    if (byte & 0x40) result -= 1n << shift
    return Number(result)
  }
  s64() {
    const start = this.pos
    let result = 0n
    let shift = 0n
    let byte
    for (let i = 0; ; i++) {
      if (this.pos >= this.end) this.fail('unexpected end (truncated LEB128)', start)
      byte = this.b[this.pos++]
      if (i === 9) {
        if (byte & 0x80) this.fail('integer representation too long', start)
        // only bit 0 is significant; bits 1..6 must sign-extend it
        const top = byte & 0x7e
        if ((byte & 0x01) ? top !== 0x7e : top !== 0) this.fail('integer too large', start)
      }
      result |= BigInt(byte & 0x7f) << shift
      shift += 7n
      if (!(byte & 0x80)) break
    }
    if (byte & 0x40) result -= 1n << shift
    return BigInt.asIntN(64, result)
  }
  f32() {
    if (this.pos + 4 > this.end) this.fail('unexpected end (truncated f32)')
    const b = this.b, p = this.pos
    const bits = (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0
    this.pos += 4
    return f32FromBits(bits)
  }
  f64() {
    if (this.pos + 8 > this.end) this.fail('unexpected end (truncated f64)')
    const b = this.b, p = this.pos
    const lo = (b[p] | (b[p + 1] << 8) | (b[p + 2] << 16) | (b[p + 3] << 24)) >>> 0
    const hi = (b[p + 4] | (b[p + 5] << 8) | (b[p + 6] << 16) | (b[p + 7] << 24)) >>> 0
    this.pos += 8
    return f64FromWords(hi, lo)
  }
  bytes(n) {
    if (this.pos + n > this.end) this.fail('unexpected end (length out of bounds)')
    const out = this.b.subarray(this.pos, this.pos + n)
    this.pos += n
    return out
  }
  name() {
    const start = this.pos
    const n = this.u32()
    const lenEnd = this.pos
    const raw = this.bytes(n)
    let s
    try {
      s = utf8.decode(raw)
    } catch {
      this.fail('malformed UTF-8 encoding', start)
    }
    if (this.ann) {
      this.ann.leaf(start, lenEnd, `name length = ${n} (LEB128)`, 'leb')
      this.ann.leaf(lenEnd, this.pos, `"${s}" (UTF-8)`, 'string', s)
    }
    return s
  }
  // annotation helpers
  leaf(start, label, kind = 'field', value) {
    if (this.ann) this.ann.leaf(start, this.pos, label, kind, value)
  }
  open(label, kind = 'group', at = this.pos) {
    if (this.ann) this.ann.open(at, label, kind)
  }
  close(label) {
    if (this.ann) this.ann.close(this.pos, label)
  }
  vecLen(what) {
    const start = this.pos
    const n = this.u32()
    this.leaf(start, `vec length = ${n}${what ? ' ' + what : ''} (LEB128)`, 'leb', n)
    return n
  }
  idx(what) {
    const start = this.pos
    const n = this.u32()
    this.leaf(start, `${what} = ${n} (LEB128)`, 'leb', n)
    return n
  }
}

// ---------------------------------------------------------------------------
// Types

const GC_TYPE_BYTES = new Set([0x69, 0x6a, 0x6b, 0x6c, 0x6d, 0x6e, 0x71, 0x72, 0x73, 0x74])

function featureForTypeByte(byte) {
  if (byte === 0x7b) return 'SIMD (v128 values)'
  if (byte === 0x63 || byte === 0x64) return 'typed function references (ref types)'
  if (byte === 0x69 || byte === 0x74) return 'exception handling (exnref)'
  if (GC_TYPE_BYTES.has(byte)) return 'GC (reference types)'
  return null
}

function readValType(r, label = '') {
  const start = r.pos
  const byte = r.u8()
  const t = BYTE_VALTYPE[byte]
  if (!t) {
    const f = featureForTypeByte(byte)
    if (f) throw new WasmFeatureError(f, start)
    r.fail(`malformed value type 0x${byte.toString(16)}`, start)
  }
  r.leaf(start, `${label}${t}`, 'valtype', t)
  return t
}

function readRefType(r, label = '') {
  const start = r.pos
  const t = readValType(r, label)
  if (t !== 'funcref' && t !== 'externref') r.fail('malformed reference type', start)
  return t
}

function readLimits(r, kind) {
  const start = r.pos
  r.open(`limits`, 'limits')
  const flagAt = r.pos
  const flag = r.u8()
  if (flag & 0x02 && kind === 'memory' && flag <= 3) throw new WasmFeatureError('threads (shared memory)', flagAt)
  if (flag >= 0x04 && flag <= 0x07) throw new WasmFeatureError(kind === 'memory' ? 'memory64' : 'table64 (memory64)', flagAt)
  if (flag >= 0x08 && flag <= 0x0f && kind === 'memory') throw new WasmFeatureError('custom page sizes', flagAt)
  if (flag > 1) r.fail(kind === 'memory' ? 'malformed memory limits flag' : 'malformed table limits flag', flagAt)
  r.leaf(flagAt, `flag 0x0${flag} (${flag ? 'min and max' : 'min only'})`, 'byte')
  const minAt = r.pos
  const min = r.u32()
  r.leaf(minAt, `min = ${min}${kind === 'memory' ? ' pages' : ''} (LEB128)`, 'leb', min)
  let max = null
  if (flag === 1) {
    const maxAt = r.pos
    max = r.u32()
    r.leaf(maxAt, `max = ${max}${kind === 'memory' ? ' pages' : ''} (LEB128)`, 'leb', max)
  }
  r.close(`limits {min ${min}${max != null ? ', max ' + max : ''}}`)
  void start
  return { min, max }
}

function readFuncType(r) {
  const start = r.pos
  r.open('functype', 'functype')
  const formAt = r.pos
  const form = r.u8()
  if (form !== 0x60) {
    if (form === 0x4e || form === 0x50 || form === 0x4f || form === 0x5f || form === 0x5e)
      throw new WasmFeatureError('GC (struct/array/recursive types)', formAt)
    r.fail('malformed functype (expected 0x60)', formAt)
  }
  r.leaf(formAt, 'form 0x60 (func)', 'byte')
  const np = r.vecLen('params')
  const params = []
  for (let i = 0; i < np; i++) params.push(readValType(r, 'param '))
  const nr = r.vecLen('results')
  const results = []
  for (let i = 0; i < nr; i++) results.push(readValType(r, 'result '))
  r.close(`functype (${params.join(',')})->${results.length === 1 ? results[0] : '(' + results.join(',') + ')'}`)
  return { params, results, offset: start }
}

function readGlobalType(r) {
  const type = readValType(r, 'type ')
  const at = r.pos
  const m = r.u8()
  if (m > 1) r.fail('malformed mutability', at)
  r.leaf(at, m ? 'mutable (0x01)' : 'immutable (0x00)', 'byte')
  return { type, mut: m === 1 }
}

// ---------------------------------------------------------------------------
// Instructions

function readBlockType(r, module) {
  const start = r.pos
  const byte = r.peek()
  if (byte === 0x40) {
    r.pos++
    r.leaf(start, 'blocktype: empty (0x40)', 'blocktype')
    return { raw: 'empty', params: [], results: [] }
  }
  if (BYTE_VALTYPE[byte]) {
    r.pos++
    const t = BYTE_VALTYPE[byte]
    r.leaf(start, `blocktype: result ${t}`, 'blocktype')
    return { raw: t, params: [], results: [t] }
  }
  const f = featureForTypeByte(byte)
  if (f) throw new WasmFeatureError(f, start)
  const idx = r.s33()
  if (idx < 0) r.fail('malformed block type', start)
  r.leaf(start, `blocktype: type index ${idx} (signed LEB128)`, 'blocktype')
  const ty = module.types[idx]
  // unknown index is reported by the validator; keep the raw index here
  return { raw: idx, params: ty ? ty.params : null, results: ty ? ty.results : null }
}

function readMemarg(r, instr) {
  const at = r.pos
  const align = r.u32()
  if (align & 0x40) throw new WasmFeatureError('multi-memory', at)
  r.leaf(at, `align = ${align} (2^${align} = ${2 ** align} bytes, LEB128)`, 'leb', align)
  const offAt = r.pos
  const off = r.u32()
  r.leaf(offAt, `offset = ${off} (LEB128)`, 'leb', off)
  instr.align = align
  instr.memOffset = off
}

function readMemIdxByte(r, instr, field = 'mem') {
  const at = r.pos
  const b = r.u8()
  if (b !== 0) {
    // In multi-memory this is a LEB128 memory index; we only support one memory.
    throw new WasmFeatureError('multi-memory', at)
  }
  r.leaf(at, 'memory index 0 (reserved byte)', 'byte')
  instr[field] = 0
}

/**
 * Decode one instruction at r.pos. Returns the instruction object:
 *   { op: mnemonic, code, offset, len, ...immediates }
 */
export function readInstr(r, module) {
  const offset = r.pos
  const A = r.ann
  if (A) A.open(offset, '', 'instr')
  let byte = r.u8()
  let code = byte
  if (byte === 0xfc) {
    const sub = r.u32()
    if (sub > 17) r.fail(`illegal opcode 0xfc ${sub}`, offset)
    code = FC_BASE + sub
  } else if (byte >= 0xe0 && byte !== 0xfc) {
    const f = UNSUPPORTED_OPCODES[byte]
    if (f) throw new WasmFeatureError(f, offset)
    r.fail(`illegal opcode 0x${byte.toString(16)}`, offset)
  }
  const info = OPS[code]
  if (!info) {
    const f = UNSUPPORTED_OPCODES[byte]
    if (f) throw new WasmFeatureError(f, offset)
    r.fail(`illegal opcode 0x${byte.toString(16)}`, offset)
  }
  if (A) A.leaf(offset, r.pos, `opcode ${info.bytes.map((x) => '0x' + x.toString(16).padStart(2, '0')).join(' ')} = ${info.name}`, 'opcode')
  const instr = { op: info.name, code, offset, len: 0 }
  switch (info.imm) {
    case 'none':
      break
    case 'blocktype':
      instr.bt = readBlockType(r, module)
      break
    case 'label':
      instr.depth = r.idx('label depth')
      break
    case 'br_table': {
      const n = r.vecLen('targets')
      const t = new Array(n)
      for (let i = 0; i < n; i++) t[i] = r.idx(`target ${i}: depth`)
      instr.targets = t
      instr.deflt = r.idx('default depth')
      break
    }
    case 'func':
      instr.func = r.idx('function index')
      break
    case 'call_indirect':
      instr.type = r.idx('type index')
      instr.table = r.idx('table index')
      break
    case 'select_t': {
      const n = r.vecLen('types')
      const ts = []
      for (let i = 0; i < n; i++) ts.push(readValType(r, 'type '))
      instr.types = ts
      break
    }
    case 'local':
      instr.local = r.idx('local index')
      break
    case 'global':
      instr.global = r.idx('global index')
      break
    case 'table':
      instr.table = r.idx('table index')
      break
    case 'memarg':
      readMemarg(r, instr)
      break
    case 'memidx':
      readMemIdxByte(r, instr)
      break
    case 'i32': {
      const at = r.pos
      instr.value = r.s32()
      r.leaf(at, `i32 literal ${instr.value} (signed LEB128)`, 'leb', instr.value)
      break
    }
    case 'i64': {
      const at = r.pos
      instr.value = r.s64()
      r.leaf(at, `i64 literal ${instr.value} (signed LEB128)`, 'leb', instr.value)
      break
    }
    case 'f32': {
      const at = r.pos
      instr.value = r.f32()
      r.leaf(at, `f32 literal ${formatValue('f32', instr.value)} (IEEE 754, little-endian)`, 'float', instr.value)
      break
    }
    case 'f64': {
      const at = r.pos
      instr.value = r.f64()
      r.leaf(at, `f64 literal ${formatValue('f64', instr.value)} (IEEE 754, little-endian)`, 'float', instr.value)
      break
    }
    case 'reftype': {
      const at = r.pos
      const b = r.u8()
      const t = b === 0x70 ? 'funcref' : b === 0x6f ? 'externref' : null
      if (!t) {
        const f = featureForTypeByte(b)
        if (f) throw new WasmFeatureError(f, at)
        r.fail('malformed reference type', at)
      }
      r.leaf(at, `heap type ${t === 'funcref' ? 'func' : 'extern'}`, 'byte')
      instr.refType = t
      break
    }
    case 'memory_init':
      instr.data = r.idx('data index')
      readMemIdxByte(r, instr)
      break
    case 'data':
      instr.data = r.idx('data index')
      break
    case 'memory_copy':
      readMemIdxByte(r, instr, 'mem')
      readMemIdxByte(r, instr, 'mem2')
      break
    case 'table_init':
      instr.elem = r.idx('element segment index')
      instr.table = r.idx('table index')
      break
    case 'elem':
      instr.elem = r.idx('element segment index')
      break
    case 'table_copy':
      instr.table = r.idx('destination table index')
      instr.table2 = r.idx('source table index')
      break
    default:
      throw new Error('internal: unknown immediate kind ' + info.imm)
  }
  instr.len = r.pos - offset
  if (A) A.close(r.pos, instrText(instr))
  return instr
}

/** Short text of an instruction with its immediates (no names). */
export function instrText(ins) {
  let s = ins.op
  if (ins.bt && ins.bt.raw !== 'empty') s += typeof ins.bt.raw === 'number' ? ` (type ${ins.bt.raw})` : ` (result ${ins.bt.raw})`
  if (ins.depth !== undefined) s += ' ' + ins.depth
  if (ins.targets) s += ' ' + ins.targets.join(' ') + ' ' + ins.deflt
  if (ins.func !== undefined) s += ' ' + ins.func
  if (ins.code === 0x11) s += ` (type ${ins.type})` + (ins.table ? ` (table ${ins.table})` : '')
  else if (ins.table !== undefined) {
    if (ins.elem !== undefined) s += ` ${ins.table} ${ins.elem}`
    else if (ins.table2 !== undefined) s += ` ${ins.table} ${ins.table2}`
    else s += ' ' + ins.table
  } else if (ins.elem !== undefined) s += ' ' + ins.elem
  if (ins.types) s += ` (result ${ins.types.join(' ')})`
  if (ins.local !== undefined) s += ' ' + ins.local
  if (ins.global !== undefined) s += ' ' + ins.global
  if (ins.memOffset !== undefined) {
    if (ins.memOffset) s += ' offset=' + ins.memOffset
    s += ' align=' + 2 ** ins.align
  }
  if (ins.data !== undefined) s += ' ' + ins.data
  if (ins.refType) s += ins.refType === 'funcref' ? ' func' : ' extern'
  if (ins.value !== undefined) {
    const t = ins.op.slice(0, 3)
    s += ' ' + formatValue(t, ins.value)
  }
  return s
}

/** Read a constant expression terminated by `end`. Returns instrs (without end). */
function readConstExpr(r, module, label) {
  r.open(label, 'expr')
  const out = []
  for (;;) {
    const ins = readInstr(r, module)
    if (ins.code === 0x0b) break
    out.push(ins)
  }
  r.close()
  return out
}

/** Decode the instructions of a function body between r.pos and `end`. */
function readBodyCode(r, module, end) {
  const code = []
  let depth = 0
  for (;;) {
    if (r.pos >= end) r.fail('END opcode expected', r.pos)
    const ins = readInstr(r, module)
    code.push(ins)
    const c = ins.code
    if (c === 0x02 || c === 0x03 || c === 0x04) depth++
    else if (c === 0x0b) {
      if (depth === 0) break
      depth--
    }
  }
  if (r.pos !== end) r.fail('section size mismatch (junk after function end)', r.pos)
  return code
}

// ---------------------------------------------------------------------------
// Sections

// canonical order rank of known sections (datacount sits between element and code)
const ORDER = { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 13: 6, 6: 7, 7: 8, 8: 9, 9: 10, 12: 11, 10: 12, 11: 13 }

function emptyModule(bytes) {
  return {
    bytes,
    version: 1,
    sections: [],
    types: [],
    imports: [],
    funcs: [],
    tables: [],
    memories: [],
    globals: [],
    exports: [],
    start: null,
    elems: [],
    datas: [],
    dataCount: null,
    customs: [],
    names: {
      module: null,
      funcs: new Map(),
      locals: new Map(),
      labels: new Map(),
      types: new Map(),
      tables: new Map(),
      memories: new Map(),
      globals: new Map(),
      elems: new Map(),
      datas: new Map(),
    },
    numImportedFuncs: 0,
    numImportedTables: 0,
    numImportedMemories: 0,
    numImportedGlobals: 0,
    warnings: [],
  }
}

function readTypeSection(r, m) {
  const n = r.vecLen('types')
  for (let i = 0; i < n; i++) {
    const t = readFuncType(r)
    t.index = i
    m.types.push(t)
  }
}

function readImportSection(r, m) {
  const n = r.vecLen('imports')
  for (let i = 0; i < n; i++) {
    const offset = r.pos
    r.open('import', 'import')
    const module = r.name()
    const name = r.name()
    const kindAt = r.pos
    const kind = r.u8()
    const imp = { module, name, kind: null, offset }
    if (kind === 0) {
      r.leaf(kindAt, 'kind 0x00 (func)', 'byte')
      imp.kind = 'func'
      imp.typeIndex = r.idx('type index')
      imp.index = m.funcs.length
      m.funcs.push({ index: m.funcs.length, typeIndex: imp.typeIndex, type: m.types[imp.typeIndex] ?? null, import: imp, body: null })
      m.numImportedFuncs++
    } else if (kind === 1) {
      r.leaf(kindAt, 'kind 0x01 (table)', 'byte')
      imp.kind = 'table'
      const elemType = readRefType(r, 'element type ')
      const limits = readLimits(r, 'table')
      imp.index = m.tables.length
      imp.desc = { elemType, ...limits }
      m.tables.push({ index: m.tables.length, elemType, ...limits, import: imp })
      m.numImportedTables++
    } else if (kind === 2) {
      r.leaf(kindAt, 'kind 0x02 (memory)', 'byte')
      imp.kind = 'memory'
      const limits = readLimits(r, 'memory')
      imp.index = m.memories.length
      imp.desc = { ...limits }
      m.memories.push({ index: m.memories.length, ...limits, import: imp })
      m.numImportedMemories++
    } else if (kind === 3) {
      r.leaf(kindAt, 'kind 0x03 (global)', 'byte')
      imp.kind = 'global'
      const g = readGlobalType(r)
      imp.index = m.globals.length
      imp.desc = g
      m.globals.push({ index: m.globals.length, ...g, init: null, import: imp })
      m.numImportedGlobals++
    } else if (kind === 4) {
      throw new WasmFeatureError('exception handling (tag import)', kindAt)
    } else {
      r.fail('malformed import kind', kindAt)
    }
    m.imports.push(imp)
    r.close(`import "${module}" "${name}" (${imp.kind})`)
  }
}

function readFunctionSection(r, m) {
  const n = r.vecLen('functions')
  m._declaredFuncs = n
  for (let i = 0; i < n; i++) {
    const ti = r.idx(`function ${m.funcs.length}: type index`)
    m.funcs.push({ index: m.funcs.length, typeIndex: ti, type: m.types[ti] ?? null, import: null, body: null })
  }
}

function readTableSection(r, m) {
  const n = r.vecLen('tables')
  for (let i = 0; i < n; i++) {
    const offset = r.pos
    r.open('table', 'table')
    if (r.peek() === 0x40) throw new WasmFeatureError('typed function references (table initializers)', r.pos)
    const elemType = readRefType(r, 'element type ')
    const limits = readLimits(r, 'table')
    m.tables.push({ index: m.tables.length, elemType, ...limits, import: null, offset })
    r.close(`table ${m.tables.length - 1}: ${elemType} {min ${limits.min}${limits.max != null ? ', max ' + limits.max : ''}}`)
  }
}

function readMemorySection(r, m) {
  const n = r.vecLen('memories')
  for (let i = 0; i < n; i++) {
    const offset = r.pos
    r.open('memory', 'memory')
    const limits = readLimits(r, 'memory')
    m.memories.push({ index: m.memories.length, ...limits, import: null, offset })
    r.close(`memory ${m.memories.length - 1}: {min ${limits.min}${limits.max != null ? ', max ' + limits.max : ''}} pages`)
  }
}

function readGlobalSection(r, m) {
  const n = r.vecLen('globals')
  for (let i = 0; i < n; i++) {
    const offset = r.pos
    r.open('global', 'global')
    const g = readGlobalType(r)
    const init = readConstExpr(r, m, 'init expression')
    m.globals.push({ index: m.globals.length, ...g, init, import: null, offset })
    r.close(`global ${m.globals.length - 1}: ${g.mut ? 'mut ' : ''}${g.type}`)
  }
}

const EXPORT_KINDS = ['func', 'table', 'memory', 'global']

function readExportSection(r, m) {
  const n = r.vecLen('exports')
  for (let i = 0; i < n; i++) {
    const offset = r.pos
    r.open('export', 'export')
    const name = r.name()
    const kindAt = r.pos
    const k = r.u8()
    if (k === 4) throw new WasmFeatureError('exception handling (tag export)', kindAt)
    if (k > 3) r.fail('malformed export kind', kindAt)
    r.leaf(kindAt, `kind 0x0${k} (${EXPORT_KINDS[k]})`, 'byte')
    const index = r.idx(`${EXPORT_KINDS[k]} index`)
    m.exports.push({ name, kind: EXPORT_KINDS[k], index, offset })
    r.close(`export "${name}" -> ${EXPORT_KINDS[k]} ${index}`)
  }
}

function readElemSection(r, m) {
  const n = r.vecLen('element segments')
  for (let i = 0; i < n; i++) {
    const offset = r.pos
    r.open('element segment', 'elem')
    const flagAt = r.pos
    const flag = r.u32()
    if (flag > 7) r.fail('malformed elements segment kind', flagAt)
    const modes = ['active (table 0, func indices)', 'passive (func indices)', 'active (explicit table, func indices)', 'declarative (func indices)', 'active (table 0, expressions)', 'passive (expressions)', 'active (explicit table, expressions)', 'declarative (expressions)']
    r.leaf(flagAt, `flags = ${flag}: ${modes[flag]}`, 'leb', flag)
    const seg = { index: m.elems.length, mode: null, table: 0, offset: null, elemType: 'funcref', init: [], fileOffset: offset }
    const usesExprs = (flag & 4) !== 0
    if ((flag & 1) === 0) {
      seg.mode = 'active'
      if (flag & 2) seg.table = r.idx('table index')
      seg.offset = readConstExpr(r, m, 'offset expression')
    } else {
      seg.mode = flag & 2 ? 'declarative' : 'passive'
    }
    if (flag & 3) {
      // has elemkind / reftype
      if (usesExprs) seg.elemType = readRefType(r, 'element type ')
      else {
        const at = r.pos
        const k = r.u8()
        if (k !== 0) r.fail('malformed element kind', at)
        r.leaf(at, 'elemkind 0x00 (funcref)', 'byte')
      }
    }
    const count = r.vecLen('elements')
    for (let j = 0; j < count; j++) {
      if (usesExprs) seg.init.push(readConstExpr(r, m, `element ${j}`))
      else {
        const at = r.pos
        const f = r.u32()
        r.leaf(at, `element ${j}: function index ${f}`, 'leb', f)
        seg.init.push([{ op: 'ref.func', code: 0xd2, func: f, offset: at, len: r.pos - at }])
      }
    }
    m.elems.push(seg)
    r.close(`elem ${seg.index}: ${seg.mode}, ${count} × ${seg.elemType}`)
  }
}

function readCodeSection(r, m, sectionEnd) {
  const n = r.vecLen('function bodies')
  const first = m.numImportedFuncs
  if (n !== (m._declaredFuncs ?? 0)) r.fail('function and code section have inconsistent lengths')
  for (let i = 0; i < n; i++) {
    const fi = first + i
    const offset = r.pos
    r.open(`function body ${fi}`, 'body')
    const size = r.u32()
    r.leaf(offset, `body size = ${size} bytes (LEB128)`, 'leb', size)
    const start = r.pos
    const end = start + size
    if (end > sectionEnd) r.fail('section size mismatch (function body extends past section)', offset)
    const saveEnd = r.end
    r.end = end
    const localsOffset = r.pos
    r.open('locals', 'locals')
    const ng = r.vecLen('local groups')
    const locals = []
    let total = 0
    for (let j = 0; j < ng; j++) {
      const at = r.pos
      const count = r.u32()
      r.leaf(at, `count = ${count} (LEB128)`, 'leb', count)
      const type = readValType(r, '')
      total += count
      if (total > 50000) r.fail('too many locals', at)
      locals.push({ count, type, offset: at })
    }
    r.close(`locals: ${locals.map((l) => l.count + ' × ' + l.type).join(', ') || 'none'}`)
    const codeOffset = r.pos
    if (r.ann) r.ann.open(codeOffset, 'code', 'code')
    let code
    if (r.ann && r.annBodies === false) {
      const save = r.ann
      r.ann = null
      code = readBodyCode(r, m, end)
      r.ann = save
    } else code = readBodyCode(r, m, end)
    if (r.ann) r.ann.close(r.pos, `code: ${code.length} instructions`)
    r.end = saveEnd
    const func = m.funcs[fi]
    if (!func) r.fail('function body without declaration', offset)
    const params = func.type ? func.type.params : []
    const localTypes = params.slice()
    for (const l of locals) for (let k = 0; k < l.count; k++) localTypes.push(l.type)
    func.body = { offset, size, start, end, localsOffset, locals, localTypes, codeOffset, code }
    r.close(`function body ${fi} (${code.length} instructions)`)
  }
}

function readDataSection(r, m) {
  const n = r.vecLen('data segments')
  for (let i = 0; i < n; i++) {
    const fileOffset = r.pos
    r.open('data segment', 'data')
    const flagAt = r.pos
    const flag = r.u32()
    if (flag > 2) r.fail('malformed data segment kind', flagAt)
    r.leaf(flagAt, `flags = ${flag}: ${['active (memory 0)', 'passive', 'active (explicit memory)'][flag]}`, 'leb', flag)
    const seg = { index: m.datas.length, mode: flag === 1 ? 'passive' : 'active', memory: 0, offset: null, bytes: null, fileOffset, bytesOffset: 0 }
    if (flag === 2) {
      seg.memory = r.idx('memory index')
      if (seg.memory !== 0) throw new WasmFeatureError('multi-memory', flagAt)
    }
    if (flag !== 1) seg.offset = readConstExpr(r, m, 'offset expression')
    const lenAt = r.pos
    const len = r.u32()
    r.leaf(lenAt, `byte length = ${len} (LEB128)`, 'leb', len)
    seg.bytesOffset = r.pos
    seg.bytes = r.bytes(len)
    r.leaf(seg.bytesOffset, `${len} bytes of data`, 'bytes')
    m.datas.push(seg)
    r.close(`data ${seg.index}: ${seg.mode}, ${len} bytes`)
  }
}

function readNameMap(r, map, what) {
  const n = r.vecLen(what)
  for (let i = 0; i < n; i++) {
    const at = r.pos
    const idx = r.u32()
    r.leaf(at, `${what} index ${idx}`, 'leb', idx)
    map.set(idx, r.name())
  }
}

function readNameSection(r, m, end) {
  const names = m.names
  let lastId = -1
  while (r.pos < end) {
    const subStart = r.pos
    const id = r.u8()
    const size = r.u32()
    const subEnd = r.pos + size
    if (subEnd > end) r.fail('name subsection extends past section', subStart)
    const LABELS = ['module name', 'function names', 'local names', 'label names', 'type names', 'table names', 'memory names', 'global names', 'elem names', 'data names']
    r.open(`name subsection ${id} (${LABELS[id] ?? 'unknown'})`, 'subsection', subStart)
    r.leaf(subStart, `subsection id ${id}, size ${size}`, 'header')
    if (id <= lastId && id <= 9) m.warnings.push(`name section: subsection ${id} out of order`)
    lastId = id
    const saveEnd = r.end
    r.end = subEnd
    switch (id) {
      case 0: names.module = r.name(); break
      case 1: readNameMap(r, names.funcs, 'function'); break
      case 2:
      case 3: {
        const target = id === 2 ? names.locals : names.labels
        const n = r.vecLen('functions')
        for (let i = 0; i < n; i++) {
          const at = r.pos
          const fi = r.u32()
          r.leaf(at, `function index ${fi}`, 'leb', fi)
          const map = new Map()
          readNameMap(r, map, id === 2 ? 'local' : 'label')
          target.set(fi, map)
        }
        break
      }
      case 4: readNameMap(r, names.types, 'type'); break
      case 5: readNameMap(r, names.tables, 'table'); break
      case 6: readNameMap(r, names.memories, 'memory'); break
      case 7: readNameMap(r, names.globals, 'global'); break
      case 8: readNameMap(r, names.elems, 'elem'); break
      case 9: readNameMap(r, names.datas, 'data'); break
      default: r.pos = subEnd
    }
    if (r.pos !== subEnd) r.fail('name subsection size mismatch', r.pos)
    r.end = saveEnd
    r.close()
  }
}

/**
 * Decode a binary module.
 * @param {Uint8Array|ArrayBuffer} input
 * @param {{annotate?: boolean, annotateBodies?: boolean}} [opts]
 * @returns module object (see README). With annotate:true, module.annotations
 *          holds the annotated byte tree.
 */
export function decode(input, opts = {}) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input)
  const A = opts.annotate ? new Annotator(bytes.length) : null
  const r = new Reader(bytes, A)
  r.annBodies = opts.annotateBodies !== false
  const m = emptyModule(bytes)

  if (bytes.length < 4) r.fail('unexpected end (magic header)', 0)
  if (bytes[0] !== 0x00 || bytes[1] !== 0x61 || bytes[2] !== 0x73 || bytes[3] !== 0x6d) r.fail('magic header not detected (expected \\0asm)', 0)
  r.pos = 4
  r.leaf(0, 'magic "\\0asm" (00 61 73 6d)', 'magic')
  if (bytes.length < 8) r.fail('unexpected end (version)', 4)
  const version = bytes[4] | (bytes[5] << 8) | (bytes[6] << 16) | (bytes[7] << 24)
  if (version !== 1) {
    if (bytes[4] === 0x0d && bytes[6] === 0x01) throw new WasmFeatureError('the component model (component binary)', 4)
    r.fail(`unknown binary version ${version}`, 4)
  }
  r.pos = 8
  r.leaf(4, 'version 1 (01 00 00 00)', 'version')

  let lastRank = 0
  while (r.pos < bytes.length) {
    const offset = r.pos
    const id = r.u8()
    const sizeAt = r.pos
    const size = r.u32()
    const contentOffset = r.pos
    const end = contentOffset + size
    if (end > bytes.length) r.fail('section size mismatch (length out of bounds)', sizeAt)
    if (id === 13) throw new WasmFeatureError('exception handling (tag section)', offset)
    if (id > 12) r.fail(`malformed section id ${id}`, offset)
    if (id !== 0) {
      const rank = ORDER[id]
      if (rank <= lastRank) r.fail(`unexpected section ${SECTION_NAMES[id]} (out of order or duplicate)`, offset)
      lastRank = rank
    }
    const sec = { id, name: SECTION_NAMES[id], offset, size, contentOffset, end }
    m.sections.push(sec)
    if (A) {
      A.open(offset, `${SECTION_NAMES[id]} section`, 'section')
      A.leaf(offset, offset + 1, `section id ${id} (${SECTION_NAMES[id]})`, 'byte')
      A.leaf(sizeAt, contentOffset, `section size = ${size} bytes (LEB128)`, 'leb', size)
    }
    r.end = end
    switch (id) {
      case 0: {
        const nameAt = r.pos
        const name = r.name()
        sec.customName = name
        const custom = { name, offset, contentOffset: r.pos, size: end - r.pos, bytes: bytes.subarray(r.pos, end) }
        m.customs.push(custom)
        if (name === 'name') {
          try {
            readNameSection(r, m, end)
          } catch (e) {
            if (!(e instanceof WasmDecodeError)) throw e
            m.warnings.push('name section ignored: ' + e.message)
            if (A) while (A.stack.length > 2) A.close(r.pos)
          }
        } else if (A) A.leaf(r.pos, end, `custom section payload "${name}" (${end - r.pos} bytes)`, 'bytes')
        void nameAt
        r.pos = end
        break
      }
      case 1: readTypeSection(r, m); break
      case 2: readImportSection(r, m); break
      case 3: readFunctionSection(r, m); break
      case 4: readTableSection(r, m); break
      case 5: readMemorySection(r, m); break
      case 6: readGlobalSection(r, m); break
      case 7: readExportSection(r, m); break
      case 8: m.start = r.idx('start function index'); break
      case 9: readElemSection(r, m); break
      case 10: readCodeSection(r, m, end); break
      case 11:
        readDataSection(r, m)
        if (m.dataCount != null && m.dataCount !== m.datas.length) r.fail('data count and data section have inconsistent lengths', offset)
        break
      case 12: m.dataCount = r.idx('data count'); break
    }
    if (r.pos !== end) r.fail('section size mismatch', r.pos)
    r.end = bytes.length
    if (A) A.close(end, id === 0 ? `custom section "${sec.customName}"` : `${SECTION_NAMES[id]} section`)
  }
  if ((m._declaredFuncs ?? 0) > 0 && !m.sections.some((s) => s.id === 10))
    r.fail('function and code section have inconsistent lengths', bytes.length)
  if (m.dataCount != null && !m.sections.some((s) => s.id === 11) && m.dataCount !== 0)
    r.fail('data count and data section have inconsistent lengths', bytes.length)
  delete m._declaredFuncs
  if (m.memories.length > 1) throw new WasmFeatureError('multi-memory (more than one memory)', m.memories[1].offset ?? m.memories[1].import?.offset ?? 0)
  if (A) m.annotations = A.root
  return m
}

/**
 * Annotated byte walk of a whole file: a tree of
 *   { start, end, label, kind, children?, value? }
 * covering every byte (magic, version, each section, every vec length, every
 * instruction and immediate). `annotateBodies:false` skips per-instruction
 * nodes inside function bodies (useful for multi-megabyte binaries).
 */
export function annotate(input, opts = {}) {
  return decode(input, { ...opts, annotate: true }).annotations
}

/** Map a byte offset to the instruction containing it: {funcIndex, pc} or null. */
export function findInstrAt(module, offset) {
  for (const f of module.funcs) {
    const b = f.body
    if (!b || offset < b.codeOffset || offset >= b.end) continue
    const code = b.code
    let lo = 0, hi = code.length - 1
    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      const ins = code[mid]
      if (offset < ins.offset) hi = mid - 1
      else if (offset >= ins.offset + ins.len) lo = mid + 1
      else return { funcIndex: f.index, pc: mid }
    }
  }
  return null
}

/** Display name for a function: name section, else first export, else null. */
export function funcName(module, index) {
  const n = module.names.funcs.get(index)
  if (n != null) return n
  const e = module.exports.find((x) => x.kind === 'func' && x.index === index)
  if (e) return e.name
  const f = module.funcs[index]
  if (f && f.import) return `${f.import.module}.${f.import.name}`
  return null
}
