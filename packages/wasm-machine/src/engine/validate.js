// Static validation (full type checking per the WebAssembly 2.0 algorithm),
// plus the per-instruction annotations the interpreter relies on:
//
//   ins.pops   number of operand values the instruction consumes, or -1 for
//              control instructions whose stack effect is dynamic
//              (br, br_if, br_table, return, end, else)
//   ins.blk    for block/loop/if/else/end: the shared block descriptor
//              { kind:'block'|'loop'|'if'|'func', start, else, end,
//                params, results }   (instruction indices / arities)
//
// functionTypeStacks() re-runs the checker on one function and records the
// static operand-type stack before every instruction, for display.

import { OPS, naturalAlign, accessWidth } from './opcodes.js'
import { funcName } from './decode.js'

export class WasmValidationError extends Error {
  constructor(message, where = {}) {
    let loc = ''
    if (where.funcIndex != null) {
      loc = `function ${where.funcName ? '$' + where.funcName : where.funcIndex}`
      if (where.pc != null) loc += `, instruction ${where.pc}${where.op ? ' (' + where.op + ')' : ''}`
      if (where.offset != null) loc += `, byte 0x${where.offset.toString(16)}`
      loc += ': '
    } else if (where.context) loc = where.context + ': '
    super(loc + message)
    this.name = 'WasmValidationError'
    this.rawMessage = message
    Object.assign(this, where)
  }
}

const UNKNOWN = null
const isNum = (t) => t === UNKNOWN || t === 'i32' || t === 'i64' || t === 'f32' || t === 'f64'
const isRef = (t) => t === UNKNOWN || t === 'funcref' || t === 'externref'
const fmt = (t) => (t === UNKNOWN ? 'any' : t)
const fmtList = (ts) => '[' + ts.map(fmt).join(' ') + ']'

function sameTypes(a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}

/** Resolve a decoded blocktype to {params, results}, or throw. */
function blockSig(module, bt, fail) {
  if (bt.raw === 'empty') return { params: [], results: [] }
  if (typeof bt.raw === 'string') return { params: [], results: [bt.raw] }
  const t = module.types[bt.raw]
  if (!t) fail(`unknown type ${bt.raw} in block type`)
  bt.params = t.params
  bt.results = t.results
  return t
}

function checkLimits(lim, maxAllowed, what, fail) {
  if (lim.min > maxAllowed) fail(`${what} size must be at most ${maxAllowed}`)
  if (lim.max != null) {
    if (lim.max > maxAllowed) fail(`${what} size must be at most ${maxAllowed}`)
    if (lim.min > lim.max) fail(`size minimum must not be greater than maximum`)
  }
}

/**
 * Validate a constant expression.
 * @param maxGlobal  global.get may only reference globals with index < maxGlobal
 *   (WebAssembly 2.0: only imported globals are visible in constant expressions)
 */
function checkConstExpr(module, expr, expected, maxGlobal, refs, fail) {
  const stack = []
  for (const ins of expr) {
    switch (ins.op) {
      case 'i32.const': stack.push('i32'); break
      case 'i64.const': stack.push('i64'); break
      case 'f32.const': stack.push('f32'); break
      case 'f64.const': stack.push('f64'); break
      case 'ref.null': stack.push(ins.refType); break
      case 'ref.func':
        if (ins.func >= module.funcs.length) fail(`unknown function ${ins.func}`)
        refs.add(ins.func)
        stack.push('funcref')
        break
      case 'global.get': {
        const g = module.globals[ins.global]
        if (!g || ins.global >= maxGlobal) fail(`unknown global ${ins.global}`)
        if (g.mut) fail('constant expression required (global.get of a mutable global)')
        stack.push(g.type)
        break
      }
      case 'i32.add': case 'i32.sub': case 'i32.mul':
      case 'i64.add': case 'i64.sub': case 'i64.mul': {
        const t = ins.op.slice(0, 3)
        const b = stack.pop(), a = stack.pop()
        if (a !== t || b !== t) fail('type mismatch in constant expression')
        stack.push(t)
        break
      }
      default:
        fail(`constant expression required (found ${ins.op})`)
    }
  }
  if (stack.length !== 1 || stack[0] !== expected)
    fail(`type mismatch: constant expression must produce [${expected}] but produces ${fmtList(stack)}`)
}

/**
 * Validate a whole module. Throws WasmValidationError on the first problem.
 * Annotates instructions in place (ins.pops, ins.blk) and sets
 * module.validated = true.
 */
export function validate(module) {
  const ctxFail = (context) => (msg) => {
    throw new WasmValidationError(msg, { context })
  }
  for (const f of module.funcs) {
    if (!module.types[f.typeIndex]) ctxFail(`function ${f.index}`)(`unknown type ${f.typeIndex}`)
    f.type = module.types[f.typeIndex]
  }
  for (const t of module.tables) checkLimits(t, 0xffffffff, 'table', ctxFail(`table ${t.index}`))
  for (const m of module.memories) checkLimits(m, 65536, 'memory', ctxFail(`memory ${m.index}`))
  if (module.memories.length > 1) ctxFail('module')('multiple memories (multi-memory) are not supported')

  const refs = new Set()
  for (const g of module.globals) {
    if (g.import) continue
    checkConstExpr(module, g.init, g.type, module.numImportedGlobals, refs, ctxFail(`global ${g.index}`))
  }
  const names = new Set()
  for (const e of module.exports) {
    const fail = ctxFail(`export "${e.name}"`)
    if (names.has(e.name)) fail('duplicate export name')
    names.add(e.name)
    const space = { func: module.funcs, table: module.tables, memory: module.memories, global: module.globals }[e.kind]
    if (e.index >= space.length) fail(`unknown ${e.kind} ${e.index}`)
    if (e.kind === 'func') refs.add(e.index)
  }
  if (module.start != null) {
    const fail = ctxFail('start function')
    const f = module.funcs[module.start]
    if (!f) fail(`unknown function ${module.start}`)
    if (f.type.params.length || f.type.results.length) fail('start function must have type [] -> []')
  }
  for (const seg of module.elems) {
    const fail = ctxFail(`elem segment ${seg.index}`)
    if (seg.mode === 'active') {
      const t = module.tables[seg.table]
      if (!t) fail(`unknown table ${seg.table}`)
      checkConstExpr(module, seg.offset, 'i32', module.numImportedGlobals, refs, fail)
      if (t.elemType !== seg.elemType) fail(`type mismatch: segment of ${seg.elemType} for table of ${t.elemType}`)
    }
    for (const e of seg.init) checkConstExpr(module, e, seg.elemType, module.numImportedGlobals, refs, fail)
  }
  for (const seg of module.datas) {
    const fail = ctxFail(`data segment ${seg.index}`)
    if (seg.mode === 'active') {
      if (!module.memories[seg.memory]) fail(`unknown memory ${seg.memory}`)
      checkConstExpr(module, seg.offset, 'i32', module.numImportedGlobals, refs, fail)
    }
  }
  module.refs = refs
  for (const f of module.funcs) if (f.body) checkFunction(module, f, null)
  module.validated = true
  return module
}

/**
 * Static operand-type stack before each instruction of a function.
 * Returns an array (one entry per instruction index) of
 *   { stack: [type|null], unreachable: boolean, depth: number }
 * where `null` marks a polymorphic ("any") slot in unreachable code and
 * `depth` is the number of enclosing control frames (incl. the function).
 */
export function functionTypeStacks(module, funcIndex) {
  const f = module.funcs[funcIndex]
  if (!f || !f.body) return null
  if (!module.refs) validate(module)
  const out = []
  checkFunction(module, f, out)
  return out
}

function checkFunction(module, func, record) {
  const code = func.body.code
  const locals = func.body.localTypes
  const type = func.type
  let pc = 0
  const fail = (msg) => {
    const ins = code[pc]
    throw new WasmValidationError(msg, {
      funcIndex: func.index,
      funcName: funcName(module, func.index),
      pc,
      op: ins && ins.op,
      offset: ins && ins.offset,
    })
  }
  const vals = []
  const ctrls = []

  const push = (t) => vals.push(t)
  const pop = () => {
    const c = ctrls[ctrls.length - 1]
    if (vals.length === c.height) {
      if (c.unreachable) return UNKNOWN
      fail('type mismatch: operand stack underflow (instruction needs a value the stack does not have)')
    }
    return vals.pop()
  }
  const popT = (expect) => {
    const actual = pop()
    if (actual !== expect && actual !== UNKNOWN && expect !== UNKNOWN)
      fail(`type mismatch: expected ${expect} but found ${actual}`)
    return actual
  }
  const popVals = (ts) => {
    const out = new Array(ts.length)
    for (let i = ts.length - 1; i >= 0; i--) out[i] = popT(ts[i])
    return out
  }
  const pushVals = (ts) => {
    for (const t of ts) vals.push(t)
  }
  const pushCtrl = (kind, params, results, blk) => {
    ctrls.push({ kind, params, results, height: vals.length, unreachable: false, blk })
    pushVals(params)
  }
  const popCtrl = () => {
    const c = ctrls[ctrls.length - 1]
    popVals(c.results)
    if (vals.length !== c.height)
      fail(`type mismatch: ${vals.length - c.height} extra value(s) left on the stack at end of ${c.kind === 'func' ? 'function' : c.kind}; expected ${fmtList(c.results)}`)
    ctrls.pop()
    return c
  }
  const labelTypes = (c) => (c.kind === 'loop' ? c.params : c.results)
  const label = (depth) => {
    if (depth >= ctrls.length) fail(`unknown label: branch depth ${depth} but only ${ctrls.length} enclosing block(s)`)
    return ctrls[ctrls.length - 1 - depth]
  }
  const setUnreachable = () => {
    const c = ctrls[ctrls.length - 1]
    vals.length = c.height
    c.unreachable = true
  }
  const mem = (ins) => {
    if (!module.memories[0]) fail('unknown memory 0')
    if (ins.align !== undefined && 2 ** ins.align > accessWidth(ins.op))
      fail(`alignment must not be larger than natural (2^${ins.align} > ${accessWidth(ins.op)})`)
  }
  const table = (i) => {
    const t = module.tables[i]
    if (!t) fail(`unknown table ${i}`)
    return t
  }
  const needDataCount = () => {
    if (module.dataCount == null) fail('data count section required (memory.init / data.drop need it)')
  }

  const funcBlk = { kind: 'func', start: -1, else: -1, end: -1, params: 0, results: type.results.length }
  pushCtrl('func', [], type.results, funcBlk)

  for (pc = 0; pc < code.length; pc++) {
    const ins = code[pc]
    if (ctrls.length === 0) fail('instructions after the end of the function')
    if (record) {
      const c = ctrls[ctrls.length - 1]
      record.push({ stack: vals.slice(), unreachable: c.unreachable, depth: ctrls.length })
    }
    const sig = OPS_SIG(ins)
    if (sig) {
      if (ins.memOffset !== undefined || ins.code === 0x3f || ins.code === 0x40 || ins.code === 0xe8 || ins.code === 0xea || ins.code === 0xeb) mem(ins)
      popVals(sig.params)
      pushVals(sig.results)
      ins.pops = sig.params.length
      // extra checks for bulk ops with signatures
      switch (ins.code) {
        case 0xe8: // memory.init
          needDataCount()
          if (ins.data >= module.datas.length && ins.data >= (module.dataCount ?? 0)) fail(`unknown data segment ${ins.data}`)
          break
        case 0xe9: // data.drop
          needDataCount()
          if (ins.data >= (module.dataCount ?? 0)) fail(`unknown data segment ${ins.data}`)
          break
        case 0xec: { // table.init
          const t = table(ins.table)
          const e = module.elems[ins.elem]
          if (!e) fail(`unknown elem segment ${ins.elem}`)
          if (e.elemType !== t.elemType) fail(`type mismatch: elem segment of ${e.elemType} into table of ${t.elemType}`)
          break
        }
        case 0xed: // elem.drop
          if (!module.elems[ins.elem]) fail(`unknown elem segment ${ins.elem}`)
          break
        case 0xee: { // table.copy
          const d = table(ins.table), s = table(ins.table2)
          if (d.elemType !== s.elemType) fail(`type mismatch: table.copy from ${s.elemType} table into ${d.elemType} table`)
          break
        }
        case 0xf0: // table.size
          table(ins.table)
          break
      }
      continue
    }
    switch (ins.code) {
      case 0x00: // unreachable
        ins.pops = 0
        setUnreachable()
        break
      case 0x02: // block
      case 0x03: // loop
      case 0x04: { // if
        const s = blockSig(module, ins.bt, fail)
        if (ins.code === 0x04) popT('i32')
        popVals(s.params)
        const kind = ins.code === 0x02 ? 'block' : ins.code === 0x03 ? 'loop' : 'if'
        const blk = { kind, start: pc, else: -1, end: -1, params: s.params.length, results: s.results.length }
        ins.blk = blk
        ins.pops = ins.code === 0x04 ? 1 : 0
        pushCtrl(kind, s.params, s.results, blk)
        break
      }
      case 0x05: { // else
        const c = ctrls[ctrls.length - 1]
        if (c.kind !== 'if') fail('else without matching if')
        popCtrl()
        c.blk.else = pc
        ins.blk = c.blk
        ins.pops = -1
        pushCtrl('else', c.params, c.results, c.blk)
        break
      }
      case 0x0b: { // end
        const c = popCtrl()
        if (c.kind === 'if' && !sameTypes(c.params, c.results))
          fail(`type mismatch: if without else must leave its parameters unchanged (${fmtList(c.params)} -> ${fmtList(c.results)})`)
        c.blk.end = pc
        ins.blk = c.blk
        ins.pops = -1
        pushVals(c.results)
        if (ctrls.length === 0 && pc !== code.length - 1) fail('instructions after the end of the function')
        break
      }
      case 0x0c: { // br
        popVals(labelTypes(label(ins.depth)))
        ins.pops = -1
        setUnreachable()
        break
      }
      case 0x0d: { // br_if
        popT('i32')
        const ts = labelTypes(label(ins.depth))
        popVals(ts)
        pushVals(ts)
        ins.pops = -1
        break
      }
      case 0x0e: { // br_table
        popT('i32')
        const m = labelTypes(label(ins.deflt)).length
        for (const d of ins.targets) {
          const ts = labelTypes(label(d))
          if (ts.length !== m) fail(`type mismatch: br_table targets have different arities (${ts.length} vs default ${m})`)
          pushVals(popVals(ts))
        }
        popVals(labelTypes(label(ins.deflt)))
        ins.pops = -1
        setUnreachable()
        break
      }
      case 0x0f: // return
        popVals(type.results)
        ins.pops = -1
        setUnreachable()
        break
      case 0x10: { // call
        const f = module.funcs[ins.func]
        if (!f) fail(`unknown function ${ins.func}`)
        const t = module.types[f.typeIndex]
        popVals(t.params)
        pushVals(t.results)
        ins.pops = t.params.length
        break
      }
      case 0x11: { // call_indirect
        const tb = table(ins.table)
        if (tb.elemType !== 'funcref') fail(`call_indirect requires a funcref table (table ${ins.table} holds ${tb.elemType})`)
        const t = module.types[ins.type]
        if (!t) fail(`unknown type ${ins.type}`)
        popT('i32')
        popVals(t.params)
        pushVals(t.results)
        ins.pops = t.params.length + 1
        break
      }
      case 0x1a: // drop
        pop()
        ins.pops = 1
        break
      case 0x1b: { // select (untyped)
        popT('i32')
        const t1 = pop()
        const t2 = pop()
        if (!isNum(t1) || !isNum(t2)) fail('type mismatch: untyped select needs numeric operands (use select (result t) for references)')
        if (t1 !== t2 && t1 !== UNKNOWN && t2 !== UNKNOWN) fail(`type mismatch: select operands ${t2} and ${t1} differ`)
        push(t1 === UNKNOWN ? t2 : t1)
        ins.pops = 3
        break
      }
      case 0x1c: { // select t
        if (ins.types.length !== 1) fail('invalid result arity for typed select')
        const t = ins.types[0]
        popT('i32')
        popT(t)
        popT(t)
        push(t)
        ins.pops = 3
        break
      }
      case 0x20: { // local.get
        const t = locals[ins.local]
        if (t === undefined) fail(`unknown local ${ins.local}`)
        push(t)
        ins.pops = 0
        break
      }
      case 0x21:
      case 0x22: {
        const t = locals[ins.local]
        if (t === undefined) fail(`unknown local ${ins.local}`)
        popT(t)
        if (ins.code === 0x22) push(t)
        ins.pops = 1
        break
      }
      case 0x23: {
        const g = module.globals[ins.global]
        if (!g) fail(`unknown global ${ins.global}`)
        push(g.type)
        ins.pops = 0
        break
      }
      case 0x24: {
        const g = module.globals[ins.global]
        if (!g) fail(`unknown global ${ins.global}`)
        if (!g.mut) fail(`global is immutable (global.set of global ${ins.global})`)
        popT(g.type)
        ins.pops = 1
        break
      }
      case 0x25: { // table.get
        const t = table(ins.table)
        popT('i32')
        push(t.elemType)
        ins.pops = 1
        break
      }
      case 0x26: { // table.set
        const t = table(ins.table)
        popT(t.elemType)
        popT('i32')
        ins.pops = 2
        break
      }
      case 0xef: { // table.grow
        const t = table(ins.table)
        popT('i32')
        popT(t.elemType)
        push('i32')
        ins.pops = 2
        break
      }
      case 0xf1: { // table.fill
        const t = table(ins.table)
        popT('i32')
        popT(t.elemType)
        popT('i32')
        ins.pops = 3
        break
      }
      case 0xd0: // ref.null
        push(ins.refType)
        ins.pops = 0
        break
      case 0xd1: { // ref.is_null
        const t = pop()
        if (!isRef(t)) fail(`type mismatch: ref.is_null expects a reference but found ${t}`)
        push('i32')
        ins.pops = 1
        break
      }
      case 0xd2: // ref.func
        if (!module.funcs[ins.func]) fail(`unknown function ${ins.func}`)
        if (!module.refs.has(ins.func)) fail(`undeclared function reference ${ins.func} (ref.func needs the function declared in an elem segment or export)`)
        push('funcref')
        ins.pops = 0
        break
      default:
        fail(`internal: no validation rule for ${ins.op}`)
    }
  }
  if (ctrls.length !== 0) {
    pc = code.length - 1
    fail('function body ended with unclosed blocks')
  }
  funcBlk.end = code.length - 1
  func.body.blk = funcBlk
}

function OPS_SIG(ins) {
  return OPS[ins.code].sig
}

export { naturalAlign }
