// Opcode table shared by the decoder, validator, assembler, disassembler and
// interpreter.
//
// Every instruction gets an internal numeric `code`:
//   * single-byte opcodes keep their byte value (0x00..0xD2)
//   * 0xFC-prefixed opcodes map to 0xE0 + subopcode (0xE0..0xF1)
// so the interpreter's switch stays dense.
//
// `imm` names the immediate encoding; `sig` is the stack signature of simple
// (non-polymorphic) instructions in a compact form: operand letters, '>' ,
// result letters, with i = i32, I = i64, f = f32, F = f64. `null` means the
// validator handles the instruction specially.

export const FC_BASE = 0xe0

// [code, name, imm, sig]
const TABLE = [
  [0x00, 'unreachable', 'none', null],
  [0x01, 'nop', 'none', '>'],
  [0x02, 'block', 'blocktype', null],
  [0x03, 'loop', 'blocktype', null],
  [0x04, 'if', 'blocktype', null],
  [0x05, 'else', 'none', null],
  [0x0b, 'end', 'none', null],
  [0x0c, 'br', 'label', null],
  [0x0d, 'br_if', 'label', null],
  [0x0e, 'br_table', 'br_table', null],
  [0x0f, 'return', 'none', null],
  [0x10, 'call', 'func', null],
  [0x11, 'call_indirect', 'call_indirect', null],
  [0x1a, 'drop', 'none', null],
  [0x1b, 'select', 'none', null],
  [0x1c, 'select', 'select_t', null],
  [0x20, 'local.get', 'local', null],
  [0x21, 'local.set', 'local', null],
  [0x22, 'local.tee', 'local', null],
  [0x23, 'global.get', 'global', null],
  [0x24, 'global.set', 'global', null],
  [0x25, 'table.get', 'table', null],
  [0x26, 'table.set', 'table', null],
  [0x28, 'i32.load', 'memarg', 'i>i'],
  [0x29, 'i64.load', 'memarg', 'i>I'],
  [0x2a, 'f32.load', 'memarg', 'i>f'],
  [0x2b, 'f64.load', 'memarg', 'i>F'],
  [0x2c, 'i32.load8_s', 'memarg', 'i>i'],
  [0x2d, 'i32.load8_u', 'memarg', 'i>i'],
  [0x2e, 'i32.load16_s', 'memarg', 'i>i'],
  [0x2f, 'i32.load16_u', 'memarg', 'i>i'],
  [0x30, 'i64.load8_s', 'memarg', 'i>I'],
  [0x31, 'i64.load8_u', 'memarg', 'i>I'],
  [0x32, 'i64.load16_s', 'memarg', 'i>I'],
  [0x33, 'i64.load16_u', 'memarg', 'i>I'],
  [0x34, 'i64.load32_s', 'memarg', 'i>I'],
  [0x35, 'i64.load32_u', 'memarg', 'i>I'],
  [0x36, 'i32.store', 'memarg', 'ii>'],
  [0x37, 'i64.store', 'memarg', 'iI>'],
  [0x38, 'f32.store', 'memarg', 'if>'],
  [0x39, 'f64.store', 'memarg', 'iF>'],
  [0x3a, 'i32.store8', 'memarg', 'ii>'],
  [0x3b, 'i32.store16', 'memarg', 'ii>'],
  [0x3c, 'i64.store8', 'memarg', 'iI>'],
  [0x3d, 'i64.store16', 'memarg', 'iI>'],
  [0x3e, 'i64.store32', 'memarg', 'iI>'],
  [0x3f, 'memory.size', 'memidx', '>i'],
  [0x40, 'memory.grow', 'memidx', 'i>i'],
  [0x41, 'i32.const', 'i32', '>i'],
  [0x42, 'i64.const', 'i64', '>I'],
  [0x43, 'f32.const', 'f32', '>f'],
  [0x44, 'f64.const', 'f64', '>F'],
  [0xd0, 'ref.null', 'reftype', null],
  [0xd1, 'ref.is_null', 'none', null],
  [0xd2, 'ref.func', 'func', null],
  [FC_BASE + 8, 'memory.init', 'memory_init', 'iii>'],
  [FC_BASE + 9, 'data.drop', 'data', '>'],
  [FC_BASE + 10, 'memory.copy', 'memory_copy', 'iii>'],
  [FC_BASE + 11, 'memory.fill', 'memidx', 'iii>'],
  [FC_BASE + 12, 'table.init', 'table_init', 'iii>'],
  [FC_BASE + 13, 'elem.drop', 'elem', '>'],
  [FC_BASE + 14, 'table.copy', 'table_copy', 'iii>'],
  [FC_BASE + 15, 'table.grow', 'table', null],
  [FC_BASE + 16, 'table.size', 'table', '>i'],
  [FC_BASE + 17, 'table.fill', 'table', null],
]

// Numeric instructions, generated from compact lists.
function numeric(start, prefix, names, sig) {
  names.forEach((n, i) => TABLE.push([start + i, prefix + '.' + n, 'none', sig]))
}
numeric(0x45, 'i32', ['eqz'], 'i>i')
numeric(0x46, 'i32', ['eq', 'ne', 'lt_s', 'lt_u', 'gt_s', 'gt_u', 'le_s', 'le_u', 'ge_s', 'ge_u'], 'ii>i')
numeric(0x50, 'i64', ['eqz'], 'I>i')
numeric(0x51, 'i64', ['eq', 'ne', 'lt_s', 'lt_u', 'gt_s', 'gt_u', 'le_s', 'le_u', 'ge_s', 'ge_u'], 'II>i')
numeric(0x5b, 'f32', ['eq', 'ne', 'lt', 'gt', 'le', 'ge'], 'ff>i')
numeric(0x61, 'f64', ['eq', 'ne', 'lt', 'gt', 'le', 'ge'], 'FF>i')
numeric(0x67, 'i32', ['clz', 'ctz', 'popcnt'], 'i>i')
numeric(0x6a, 'i32', ['add', 'sub', 'mul', 'div_s', 'div_u', 'rem_s', 'rem_u', 'and', 'or', 'xor', 'shl', 'shr_s', 'shr_u', 'rotl', 'rotr'], 'ii>i')
numeric(0x79, 'i64', ['clz', 'ctz', 'popcnt'], 'I>I')
numeric(0x7c, 'i64', ['add', 'sub', 'mul', 'div_s', 'div_u', 'rem_s', 'rem_u', 'and', 'or', 'xor', 'shl', 'shr_s', 'shr_u', 'rotl', 'rotr'], 'II>I')
numeric(0x8b, 'f32', ['abs', 'neg', 'ceil', 'floor', 'trunc', 'nearest', 'sqrt'], 'f>f')
numeric(0x92, 'f32', ['add', 'sub', 'mul', 'div', 'min', 'max', 'copysign'], 'ff>f')
numeric(0x99, 'f64', ['abs', 'neg', 'ceil', 'floor', 'trunc', 'nearest', 'sqrt'], 'F>F')
numeric(0xa0, 'f64', ['add', 'sub', 'mul', 'div', 'min', 'max', 'copysign'], 'FF>F')
const CONV = [
  [0xa7, 'i32.wrap_i64', 'I>i'],
  [0xa8, 'i32.trunc_f32_s', 'f>i'], [0xa9, 'i32.trunc_f32_u', 'f>i'],
  [0xaa, 'i32.trunc_f64_s', 'F>i'], [0xab, 'i32.trunc_f64_u', 'F>i'],
  [0xac, 'i64.extend_i32_s', 'i>I'], [0xad, 'i64.extend_i32_u', 'i>I'],
  [0xae, 'i64.trunc_f32_s', 'f>I'], [0xaf, 'i64.trunc_f32_u', 'f>I'],
  [0xb0, 'i64.trunc_f64_s', 'F>I'], [0xb1, 'i64.trunc_f64_u', 'F>I'],
  [0xb2, 'f32.convert_i32_s', 'i>f'], [0xb3, 'f32.convert_i32_u', 'i>f'],
  [0xb4, 'f32.convert_i64_s', 'I>f'], [0xb5, 'f32.convert_i64_u', 'I>f'],
  [0xb6, 'f32.demote_f64', 'F>f'],
  [0xb7, 'f64.convert_i32_s', 'i>F'], [0xb8, 'f64.convert_i32_u', 'i>F'],
  [0xb9, 'f64.convert_i64_s', 'I>F'], [0xba, 'f64.convert_i64_u', 'I>F'],
  [0xbb, 'f64.promote_f32', 'f>F'],
  [0xbc, 'i32.reinterpret_f32', 'f>i'], [0xbd, 'i64.reinterpret_f64', 'F>I'],
  [0xbe, 'f32.reinterpret_i32', 'i>f'], [0xbf, 'f64.reinterpret_i64', 'I>F'],
  [0xc0, 'i32.extend8_s', 'i>i'], [0xc1, 'i32.extend16_s', 'i>i'],
  [0xc2, 'i64.extend8_s', 'I>I'], [0xc3, 'i64.extend16_s', 'I>I'], [0xc4, 'i64.extend32_s', 'I>I'],
  [FC_BASE + 0, 'i32.trunc_sat_f32_s', 'f>i'], [FC_BASE + 1, 'i32.trunc_sat_f32_u', 'f>i'],
  [FC_BASE + 2, 'i32.trunc_sat_f64_s', 'F>i'], [FC_BASE + 3, 'i32.trunc_sat_f64_u', 'F>i'],
  [FC_BASE + 4, 'i64.trunc_sat_f32_s', 'f>I'], [FC_BASE + 5, 'i64.trunc_sat_f32_u', 'f>I'],
  [FC_BASE + 6, 'i64.trunc_sat_f64_s', 'F>I'], [FC_BASE + 7, 'i64.trunc_sat_f64_u', 'F>I'],
]
for (const [c, n, s] of CONV) TABLE.push([c, n, 'none', s])

const LETTER = { i: 'i32', I: 'i64', f: 'f32', F: 'f64' }
function parseSig(sig) {
  if (sig == null) return null
  const [a, b] = sig.split('>')
  return { params: [...a].map((c) => LETTER[c]), results: [...b].map((c) => LETTER[c]) }
}

/** code -> { code, name, imm, sig:{params,results}|null, bytes:[...] } */
export const OPS = new Array(256).fill(null)
/** mnemonic -> op info (for 'select' this is the untyped 0x1B form) */
export const OPS_BY_NAME = new Map()

for (const [code, name, imm, sig] of TABLE) {
  const info = {
    code,
    name,
    imm,
    sig: parseSig(sig),
    bytes: code >= FC_BASE && code < FC_BASE + 0x20 ? [0xfc, code - FC_BASE] : [code],
  }
  OPS[code] = info
  if (!OPS_BY_NAME.has(name)) OPS_BY_NAME.set(name, info)
}

/** Natural alignment (log2 bytes) for each memory access mnemonic. */
export function naturalAlign(name) {
  if (/8(_[su])?$/.test(name)) return 0
  if (/16(_[su])?$/.test(name)) return 1
  if (/32(_[su])?$/.test(name)) return 2
  if (name.startsWith('i64') || name.startsWith('f64')) return 3
  return 2
}

/** Access width in bytes for a load/store mnemonic. */
export function accessWidth(name) {
  return 1 << naturalAlign(name)
}

// Value type byte encodings.
export const VALTYPE_BYTE = { i32: 0x7f, i64: 0x7e, f32: 0x7d, f64: 0x7c, funcref: 0x70, externref: 0x6f }
export const BYTE_VALTYPE = { 0x7f: 'i32', 0x7e: 'i64', 0x7d: 'f32', 0x7c: 'f64', 0x70: 'funcref', 0x6f: 'externref' }

export const SECTION_NAMES = [
  'custom', 'type', 'import', 'function', 'table', 'memory', 'global',
  'export', 'start', 'element', 'code', 'data', 'datacount',
]

/**
 * Bytes / opcodes belonging to proposals this engine does not implement,
 * mapped to a friendly feature name. Used to fail loudly instead of decoding
 * garbage.
 */
export const UNSUPPORTED_OPCODES = {
  0x06: 'exception handling (try)',
  0x07: 'exception handling (catch)',
  0x08: 'exception handling (throw)',
  0x09: 'exception handling (rethrow)',
  0x0a: 'exception handling (throw_ref)',
  0x12: 'tail calls (return_call)',
  0x13: 'tail calls (return_call_indirect)',
  0x14: 'typed function references (call_ref)',
  0x15: 'typed function references (return_call_ref)',
  0x18: 'exception handling (delegate)',
  0x19: 'exception handling (catch_all)',
  0x1f: 'exception handling (try_table)',
  0xd3: 'GC (ref.eq)',
  0xd4: 'typed function references (ref.as_non_null)',
  0xd5: 'typed function references (br_on_null)',
  0xd6: 'typed function references (br_on_non_null)',
  0xfb: 'GC (garbage-collected structs/arrays)',
  0xfd: 'SIMD (128-bit vectors)',
  0xfe: 'threads (atomic memory operations)',
}
