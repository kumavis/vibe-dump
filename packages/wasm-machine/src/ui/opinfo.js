// What each instruction does: a one-line plain-language description and its
// stack signature, for the code pane's instruction bar. Descriptions name the
// deeper operand `a` and the top operand `b` (b is popped first).
import { OPS, functionTypeStacks } from '../engine/index.js'
import { fmt } from './format.js'

const INT_BIN = {
  add: 'a + b, wrapping on overflow',
  sub: 'a − b, wrapping on overflow',
  mul: 'a × b, keeping the low bits of the product',
  div_s: 'a ÷ b as signed integers, rounded toward zero. Traps if b = 0, or if the quotient overflows (MIN ÷ −1)',
  div_u: 'a ÷ b as unsigned integers, rounded down. Traps if b = 0',
  rem_s: 'the remainder of signed a ÷ b (it takes the sign of a). Traps if b = 0',
  rem_u: 'the remainder of unsigned a ÷ b. Traps if b = 0',
  and: 'the bitwise AND of a and b',
  or: 'the bitwise OR of a and b',
  xor: 'the bitwise XOR of a and b',
  shl: 'a shifted left by b bits (b taken modulo the bit width)',
  shr_s: 'a shifted right by b bits, copying the sign bit in (arithmetic shift)',
  shr_u: 'a shifted right by b bits, shifting zeros in (logical shift)',
  rotl: 'a rotated left by b bits',
  rotr: 'a rotated right by b bits',
}
const INT_CMP = {
  eq: 'a = b', ne: 'a ≠ b',
  lt_s: 'a < b (signed)', lt_u: 'a < b (unsigned)', gt_s: 'a > b (signed)', gt_u: 'a > b (unsigned)',
  le_s: 'a ≤ b (signed)', le_u: 'a ≤ b (unsigned)', ge_s: 'a ≥ b (signed)', ge_u: 'a ≥ b (unsigned)',
}
const FLT_CMP = { eq: 'a = b', ne: 'a ≠ b', lt: 'a < b', gt: 'a > b', le: 'a ≤ b', ge: 'a ≥ b' }
const FLT_BIN = {
  add: 'a + b (IEEE 754, rounded to nearest)', sub: 'a − b (IEEE 754)', mul: 'a × b (IEEE 754)',
  div: 'a ÷ b (IEEE 754; dividing by zero gives ±inf or NaN, never a trap)',
  min: 'the smaller of a and b (NaN if either is NaN; −0 < +0)', max: 'the larger of a and b (NaN if either is NaN)',
  copysign: 'a with the sign bit of b',
}
const FLT_UN = {
  abs: 'clears the sign bit', neg: 'flips the sign bit', ceil: 'rounds up to an integer', floor: 'rounds down to an integer',
  trunc: 'rounds toward zero to an integer', nearest: 'rounds to the nearest integer, ties to even', sqrt: 'takes the square root',
}

function conversion(op) {
  const [to, rest] = op.split('.')
  if (rest === 'wrap_i64') return 'Pops an i64 and pushes its low 32 bits as an i32.'
  if (rest === 'extend_i32_s') return 'Pops an i32 and sign-extends it to an i64.'
  if (rest === 'extend_i32_u') return 'Pops an i32 and zero-extends it to an i64.'
  let m = rest.match(/^extend(8|16|32)_s$/)
  if (m) return `Sign-extends the low ${m[1]} bits of the ${to} on top of the stack to the full width.`
  m = rest.match(/^trunc_sat_(f32|f64)_([su])$/)
  if (m) return `Pops an ${m[1]} and truncates it toward zero to a${m[2] === 's' ? ' signed' : 'n unsigned'} ${to}, saturating: NaN becomes 0 and out-of-range values clamp. Never traps.`
  m = rest.match(/^trunc_(f32|f64)_([su])$/)
  if (m) return `Pops an ${m[1]} and truncates it toward zero to a${m[2] === 's' ? ' signed' : 'n unsigned'} ${to}. Traps if it is NaN or does not fit.`
  m = rest.match(/^convert_(i32|i64)_([su])$/)
  if (m) return `Pops an ${m[1]}, reads it as ${m[2] === 's' ? 'signed' : 'unsigned'}, and pushes the nearest ${to}.`
  if (rest === 'demote_f64') return 'Pops an f64 and rounds it to the nearest f32.'
  if (rest === 'promote_f32') return 'Pops an f32 and widens it to an f64 exactly.'
  m = rest.match(/^reinterpret_(i32|i64|f32|f64)$/)
  if (m) return `Pops a ${m[1]} and pushes the same bits read as ${to}. No conversion happens.`
  return null
}

function memDesc(instr) {
  const op = instr.op
  const off = instr.memOffset ? ` + ${instr.memOffset}` : ''
  let m = op.match(/^(i32|i64|f32|f64)\.load(8|16|32)?(?:_([su]))?$/)
  if (m) {
    const n = m[2] ? m[2] / 8 : m[1].endsWith('64') ? 8 : 4
    const ext = m[3] ? (m[3] === 's' ? `, sign-extended to ${m[1]}` : `, zero-extended to ${m[1]}`) : ''
    return `Pops an address and reads ${n} byte${n > 1 ? 's' : ''} at address${off} from linear memory (little-endian)${ext}; pushes the ${m[1]}. Traps if any byte is out of bounds.`
  }
  m = op.match(/^(i32|i64|f32|f64)\.store(8|16|32)?$/)
  if (m) {
    const n = m[2] ? m[2] / 8 : m[1].endsWith('64') ? 8 : 4
    return `Pops a value and an address; writes the ${m[2] ? 'low ' : ''}${n} byte${n > 1 ? 's' : ''} of the value at address${off} (little-endian, low byte first). Traps if out of bounds.`
  }
  return null
}

/** One-line description of an instruction; `ctx` adds names ({module, funcIndex, labelName(depth)}). */
export function describe(instr, ctx = {}) {
  const op = instr.op
  const [ty, sub] = op.includes('.') ? op.split('.') : [null, op]
  const mod = ctx.module
  const fname = (i) => (mod && ctx.funcLabel ? ctx.funcLabel(i) : `function ${i}`)
  switch (op) {
    case 'unreachable': return 'Traps immediately. Marks code that should never run.'
    case 'nop': return 'Does nothing.'
    case 'block': return 'Enters a block: pushes a label. A branch to this label jumps forward, to just after its end.'
    case 'loop': return 'Enters a loop: pushes a label. A branch to this label jumps backward, to the start of the loop.'
    case 'if': return 'Pops an i32 condition. Non-zero enters the then-arm; zero jumps to the else-arm (or past the end if there is none).'
    case 'else': return 'End of the then-arm: jumps to the matching end, skipping the else-arm.'
    case 'end': return ctx.isFuncEnd ? 'End of the function: its results are left on the operand stack and the frame returns.' : 'End of a block: pops its label. The block\'s results stay on the operand stack.'
    case 'br': return `Unconditional branch to label ${instr.depth}${ctx.labelText ? ' (' + ctx.labelText(instr.depth) + ')' : ''}: keeps the label's arity of values from the top of the stack and discards the rest down to the label's height.`
    case 'br_if': return `Pops an i32. If non-zero, branches to label ${instr.depth}${ctx.labelText ? ' (' + ctx.labelText(instr.depth) + ')' : ''}; otherwise continues with the next instruction.`
    case 'br_table': return `Pops an i32 index i and branches to label number i in the list [${instr.targets.join(' ')}], or to the default ${instr.deflt} if i is out of range.`
    case 'return': return 'Returns from the function: keeps its results from the top of the stack, discards the rest of the frame.'
    case 'call': return `Calls ${fname(instr.func)}: pops its arguments into a new frame's locals and runs it. Its results are pushed when it returns.`
    case 'call_indirect': return `Pops a table index, looks up that table entry, checks the function's type against type ${instr.type}, then calls it. Traps on a null entry, an index past the end, or a type mismatch.`
    case 'drop': return 'Pops one value and discards it.'
    case 'select': return 'Pops a condition c and two values a, b. Pushes a if c ≠ 0, else b.'
    case 'local.get': return `Pushes a copy of local ${ctx.localName ? ctx.localName(instr.local) : instr.local}.`
    case 'local.set': return `Pops a value and stores it in local ${ctx.localName ? ctx.localName(instr.local) : instr.local}.`
    case 'local.tee': return `Stores the top value in local ${ctx.localName ? ctx.localName(instr.local) : instr.local} and leaves it on the stack (set + get).`
    case 'global.get': return `Pushes the value of global ${instr.global}.`
    case 'global.set': return `Pops a value and stores it in mutable global ${instr.global}.`
    case 'memory.size': return 'Pushes the current memory size in 64 KiB pages.'
    case 'memory.grow': return 'Pops a page count n and grows memory by n pages. Pushes the old size, or −1 if it cannot grow.'
    case 'memory.fill': return 'Pops destination d, byte value v, length n; sets n bytes at d to v. Traps if out of bounds.'
    case 'memory.copy': return 'Pops destination d, source s, length n; copies n bytes from s to d (overlap-safe). Traps if out of bounds.'
    case 'memory.init': return `Pops destination d, source offset s, length n; copies n bytes of data segment ${instr.data} into memory at d.`
    case 'data.drop': return `Drops data segment ${instr.data}: its bytes can no longer be used by memory.init.`
    case 'ref.null': return `Pushes a null ${instr.refType}.`
    case 'ref.is_null': return 'Pops a reference; pushes 1 if it is null, else 0.'
    case 'ref.func': return `Pushes a reference to ${fname(instr.func)}.`
    case 'table.get': return `Pops an index; pushes the reference at that index of table ${instr.table}. Traps if out of bounds.`
    case 'table.set': return `Pops a reference and an index; stores the reference in table ${instr.table}. Traps if out of bounds.`
    case 'table.size': return `Pushes the number of entries in table ${instr.table}.`
    case 'table.grow': return `Pops an initial reference and a count n; grows table ${instr.table} by n entries. Pushes the old size, or −1.`
    case 'table.fill': return `Pops index i, reference r, count n; sets n entries of table ${instr.table} from i to r.`
    case 'table.copy': return 'Pops destination, source, count; copies table entries (overlap-safe).'
    case 'table.init': return `Pops destination, source offset, count; copies entries of element segment ${instr.elem} into the table.`
    case 'elem.drop': return `Drops element segment ${instr.elem}.`
  }
  if (sub === 'const') return `Pushes the ${ty} constant ${fmt(ty, instr.value, false)}. The value is an immediate, encoded in the instruction's bytes.`
  if (ty === 'i32' || ty === 'i64') {
    if (INT_BIN[sub]) return `Pops two ${ty} values a and b; pushes ${INT_BIN[sub]}.`
    if (INT_CMP[sub]) return `Pops two ${ty} values a and b; pushes the i32 1 if ${INT_CMP[sub]}, else 0.`
    if (sub === 'eqz') return `Pops a ${ty}; pushes the i32 1 if it is zero, else 0.`
    if (sub === 'clz') return `Pops a ${ty}; pushes the number of leading zero bits.`
    if (sub === 'ctz') return `Pops a ${ty}; pushes the number of trailing zero bits.`
    if (sub === 'popcnt') return `Pops a ${ty}; pushes the number of 1 bits.`
  }
  if (ty === 'f32' || ty === 'f64') {
    if (FLT_BIN[sub]) return `Pops two ${ty} values a and b; pushes ${FLT_BIN[sub]}.`
    if (FLT_CMP[sub]) return `Pops two ${ty} values a and b; pushes the i32 1 if ${FLT_CMP[sub]}, else 0 (any comparison with NaN is false, except ne).`
    if (FLT_UN[sub]) return `Pops a ${ty}, ${FLT_UN[sub]}, and pushes the result.`
  }
  return memDesc(instr) || conversion(op) || `Executes ${op}.`
}

/**
 * Stack signature {params, results} for the instruction at (funcIndex, pc).
 * Polymorphic instructions are resolved against the validator's static type
 * stack; branches show what they consume and '…' for the unwound remainder.
 */
export function signature(module, funcIndex, pc, cache) {
  const f = module.funcs[funcIndex]
  const instr = f.body.code[pc]
  const info = OPS[instr.code]
  if (info && info.sig) return info.sig
  const types = cache ? cache(funcIndex) : functionTypeStacks(module, funcIndex)
  const before = types[pc] ? types[pc].stack.map((t) => t || 'any') : []
  const top = (n) => before.slice(Math.max(0, before.length - n))
  const lt = f.body.localTypes
  const labelTypes = (depth) => {
    // walk outward from pc to find the enclosing blocks
    let d = 0
    for (let i = pc; i >= 0; i--) {
      const ins = f.body.code[i]
      if (!ins.blk || ins.op === 'end' || ins.op === 'else') continue
      if (ins.blk.end >= pc && i !== pc) {
        if (d === depth) return ins.op === 'loop' ? ins.bt.params : ins.bt.results
        d++
      }
    }
    return f.type.results
  }
  switch (instr.op) {
    case 'block': case 'loop': return { params: instr.bt.params, results: instr.bt.results }
    case 'if': return { params: [...instr.bt.params, 'i32'], results: instr.bt.results }
    case 'else': case 'end': {
      // the block's results (end of the function: the function results)
      const blk = instr.blk
      if (!blk || blk.kind === 'func') return { params: f.type.results, results: f.type.results }
      const opener = f.body.code[blk.start]
      return { params: opener.bt.results, results: opener.bt.results }
    }
    case 'br': return { params: ['…', ...labelTypes(instr.depth)], results: ['…'] }
    case 'br_if': { const lt2 = labelTypes(instr.depth); return { params: [...lt2, 'i32'], results: lt2 } }
    case 'br_table': return { params: ['…', ...labelTypes(instr.deflt), 'i32'], results: ['…'] }
    case 'return': return { params: ['…', ...f.type.results], results: ['…'] }
    case 'call': { const t = module.funcs[instr.func].type; return { params: t.params, results: t.results } }
    case 'call_indirect': { const t = module.types[instr.type]; return { params: [...t.params, 'i32'], results: t.results } }
    case 'drop': return { params: top(1), results: [] }
    case 'select': { const t = instr.types ? instr.types[0] : top(3)[0] || 'any'; return { params: [t, t, 'i32'], results: [t] } }
    case 'local.get': return { params: [], results: [lt[instr.local]] }
    case 'local.set': return { params: [lt[instr.local]], results: [] }
    case 'local.tee': return { params: [lt[instr.local]], results: [lt[instr.local]] }
    case 'global.get': return { params: [], results: [module.globals[instr.global].type] }
    case 'global.set': return { params: [module.globals[instr.global].type], results: [] }
    case 'unreachable': return { params: ['…'], results: ['…'] }
    case 'ref.null': return { params: [], results: [instr.refType] }
    case 'ref.is_null': return { params: top(1), results: ['i32'] }
    case 'ref.func': return { params: [], results: ['funcref'] }
    case 'table.get': return { params: ['i32'], results: [module.tables[instr.table].elemType] }
    case 'table.set': return { params: ['i32', module.tables[instr.table].elemType], results: [] }
    case 'table.grow': return { params: [module.tables[instr.table].elemType, 'i32'], results: ['i32'] }
    case 'table.fill': return { params: ['i32', module.tables[instr.table].elemType, 'i32'], results: [] }
  }
  return { params: [], results: [] }
}
