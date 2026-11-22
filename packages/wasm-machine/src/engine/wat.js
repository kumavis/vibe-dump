// WAT text assembler (a useful subset of the WebAssembly text format) ->
// binary bytes, plus a source map from each emitted instruction back to its
// text range so a UI can highlight WAT source while stepping.
//
//   assemble(text) -> { bytes: Uint8Array, sourceMap }
//
// Supported: module, type, func (named params/locals/results, inline
// export/import), import, export, memory (incl. inline data), data, table
// (incl. inline elem), elem (active/passive/declarative, func-index lists and
// expressions), global, start; flat and folded instructions; block/loop/if/
// else/end with labels and block types (incl. multi-value via type use);
// $names everywhere; all numeric literal forms; memarg offset=/align=;
// `;;` and nested `(; ;)` comments; `(module binary "...")`.
// Emits a name section (module, functions, locals, types, tables, memories,
// globals, elems, datas).

import { OPS_BY_NAME, OPS, VALTYPE_BYTE, naturalAlign } from './opcodes.js'
import { f32FromBits, f64FromBitsBig, f32Bits, f64Words } from './values.js'

export class WatError extends Error {
  constructor(message, loc) {
    super(loc ? `${message} (line ${loc.line}, col ${loc.col})` : message)
    this.name = 'WatError'
    this.rawMessage = message
    if (loc) {
      this.line = loc.line
      this.col = loc.col
      this.start = loc.start
      this.end = loc.end
    }
  }
}

// ---------------------------------------------------------------------------
// Lexer

const IDCHAR = /[0-9A-Za-z!#$%&'*+\-./:<=>?@\\^_`|~]/

function lex(src) {
  const toks = []
  let i = 0, line = 1, col = 1
  const n = src.length
  const adv = (k = 1) => {
    for (let j = 0; j < k; j++) {
      if (src[i] === '\n') {
        line++
        col = 1
      } else col++
      i++
    }
  }
  // tokens must be separated by whitespace, parentheses or comments
  const sep = () => {
    if (i < n && !/[\s();]/.test(src[i])) throw new WatError(`missing whitespace between tokens before ${JSON.stringify(src[i])}`, { line, col, start: i, end: i + 1 })
  }
  while (i < n) {
    const ch = src[i]
    if (ch === ' ' || ch === '\t' || ch === '\n' || ch === '\r') {
      adv()
      continue
    }
    if (ch === ';' && src[i + 1] === ';') {
      while (i < n && src[i] !== '\n') adv()
      continue
    }
    if (ch === '(' && src[i + 1] === ';') {
      const sl = line, sc = col, ss = i
      let depth = 0
      while (i < n) {
        if (src[i] === '(' && src[i + 1] === ';') {
          depth++
          adv(2)
        } else if (src[i] === ';' && src[i + 1] === ')') {
          depth--
          adv(2)
          if (depth === 0) break
        } else adv()
      }
      if (depth !== 0) throw new WatError('unterminated block comment', { line: sl, col: sc, start: ss, end: n })
      continue
    }
    const start = i, sl = line, sc = col
    if (ch === '(' || ch === ')') {
      adv()
      toks.push({ t: ch, start, end: i, line: sl, col: sc, endLine: line, endCol: col })
      continue
    }
    if (ch === '"') {
      adv()
      const bytes = []
      for (;;) {
        if (i >= n) throw new WatError('unterminated string', { line: sl, col: sc, start, end: i })
        const c = src[i]
        if (c === '"') {
          adv()
          break
        }
        if (c === '\n') throw new WatError('newline in string', { line, col, start: i, end: i + 1 })
        if (c === '\\') {
          const e = src[i + 1]
          const at = { line, col, start: i, end: i + 2 }
          if (e === 'n') { bytes.push(10); adv(2) }
          else if (e === 't') { bytes.push(9); adv(2) }
          else if (e === 'r') { bytes.push(13); adv(2) }
          else if (e === '"') { bytes.push(34); adv(2) }
          else if (e === "'") { bytes.push(39); adv(2) }
          else if (e === '\\') { bytes.push(92); adv(2) }
          else if (e === 'u') {
            if (src[i + 2] !== '{') throw new WatError('malformed \\u escape', at)
            const close = src.indexOf('}', i + 3)
            if (close < 0) throw new WatError('malformed \\u escape', at)
            const hex = src.slice(i + 3, close).replace(/_/g, '')
            if (!/^[0-9a-fA-F]+$/.test(hex)) throw new WatError('malformed \\u escape', at)
            const cp = parseInt(hex, 16)
            if (cp > 0x10ffff || (cp >= 0xd800 && cp < 0xe000)) throw new WatError('invalid code point in \\u escape', at)
            for (const b of new TextEncoder().encode(String.fromCodePoint(cp))) bytes.push(b)
            adv(close + 1 - i)
          } else if (/[0-9a-fA-F]/.test(e) && /[0-9a-fA-F]/.test(src[i + 2] || '')) {
            bytes.push(parseInt(src.slice(i + 1, i + 3), 16))
            adv(3)
          } else throw new WatError(`unknown escape \\${e}`, at)
          continue
        }
        const cp = src.codePointAt(i)
        if (cp < 0x20 || cp === 0x7f) throw new WatError('control character in string', { line, col, start: i, end: i + 1 })
        const s = String.fromCodePoint(cp)
        for (const b of new TextEncoder().encode(s)) bytes.push(b)
        adv(s.length)
      }
      toks.push({ t: 'string', bytes: new Uint8Array(bytes), start, end: i, line: sl, col: sc, endLine: line, endCol: col })
      sep()
      continue
    }
    if (IDCHAR.test(ch)) {
      while (i < n && IDCHAR.test(src[i])) adv()
      toks.push({ t: 'atom', v: src.slice(start, i), start, end: i, line: sl, col: sc, endLine: line, endCol: col })
      sep()
      continue
    }
    throw new WatError(`unexpected character ${JSON.stringify(ch)}`, { line, col, start: i, end: i + 1 })
  }
  return toks
}

// S-expressions: {kind:'list', items, open, close} | {kind:'atom', v, tok} | {kind:'string', bytes, tok}
function parseSexprs(toks) {
  let i = 0
  const parseOne = () => {
    const t = toks[i]
    if (t.t === '(') {
      i++
      const items = []
      while (i < toks.length && toks[i].t !== ')') items.push(parseOne())
      if (i >= toks.length) throw new WatError('unclosed "("', t)
      const close = toks[i++]
      return { kind: 'list', items, open: t, close }
    }
    if (t.t === ')') throw new WatError('unexpected ")"', t)
    i++
    if (t.t === 'string') return { kind: 'string', bytes: t.bytes, tok: t }
    return { kind: 'atom', v: t.v, tok: t }
  }
  const out = []
  while (i < toks.length) out.push(parseOne())
  return out
}

const locOf = (node) => (node.kind === 'list' ? node.open : node.tok)
const isList = (n, head) => n && n.kind === 'list' && (head === undefined || (n.items[0] && n.items[0].kind === 'atom' && n.items[0].v === head))
const headOf = (n) => (n && n.kind === 'list' && n.items[0] && n.items[0].kind === 'atom' ? n.items[0].v : null)
const isId = (n) => n && n.kind === 'atom' && n.v[0] === '$'
const isAtom = (n, v) => n && n.kind === 'atom' && (v === undefined || n.v === v)

function rangeOf(a, b) {
  const s = a.kind === 'list' ? a.open : a.tok || a
  const e = b.kind === 'list' ? b.close : b.tok || b
  return { start: s.start, end: e.end, line: s.line, col: s.col, endLine: e.endLine, endCol: e.endCol }
}
function tokRange(t) {
  return { start: t.start, end: t.end, line: t.line, col: t.col, endLine: t.endLine, endCol: t.endCol }
}

// ---------------------------------------------------------------------------
// Numbers

function cleanDigits(s, re, loc) {
  if (!s.length || s[0] === '_' || s[s.length - 1] === '_' || s.includes('__')) throw new WatError(`malformed number "${s}"`, loc)
  const d = s.replace(/_/g, '')
  if (!re.test(d)) throw new WatError(`malformed number "${s}"`, loc)
  return d
}

/** Parse an integer literal to BigInt (sign included). */
function parseIntLit(s, loc) {
  let neg = false, body = s
  if (body[0] === '+' || body[0] === '-') {
    neg = body[0] === '-'
    body = body.slice(1)
  }
  let v
  if (/^0x/i.test(body)) v = BigInt('0x' + cleanDigits(body.slice(2), /^[0-9a-fA-F]+$/, loc))
  else v = BigInt(cleanDigits(body, /^[0-9]+$/, loc))
  return neg ? -v : v
}

function parseU32(n, what = 'index') {
  if (!n || n.kind !== 'atom') throw new WatError(`expected ${what}`, n ? locOf(n) : undefined)
  if (!/^(0x[0-9a-fA-F_]+|[0-9_]+)$/.test(n.v)) throw new WatError(`expected ${what}, found "${n.v}"`, n.tok)
  const v = parseIntLit(n.v, n.tok)
  if (v > 0xffffffffn) throw new WatError(`${what} out of range`, n.tok)
  return Number(v)
}

function parseI32(n) {
  if (!n || n.kind !== 'atom') throw new WatError('expected i32 literal', n ? locOf(n) : undefined)
  let v
  try { v = parseIntLit(n.v, n.tok) } catch { throw new WatError(`malformed i32 literal "${n.v}"`, n.tok) }
  if (v < -(2n ** 31n) || v > 2n ** 32n - 1n) throw new WatError(`i32 constant out of range: ${n.v}`, n.tok)
  if ((n.v[0] === '-' || n.v[0] === '+') && v > 2n ** 31n - 1n) throw new WatError(`i32 constant out of range: ${n.v}`, n.tok)
  return Number(BigInt.asIntN(32, v))
}

function parseI64(n) {
  if (!n || n.kind !== 'atom') throw new WatError('expected i64 literal', n ? locOf(n) : undefined)
  let v
  try { v = parseIntLit(n.v, n.tok) } catch { throw new WatError(`malformed i64 literal "${n.v}"`, n.tok) }
  if (v < -(2n ** 63n) || v > 2n ** 64n - 1n) throw new WatError(`i64 constant out of range: ${n.v}`, n.tok)
  if ((n.v[0] === '-' || n.v[0] === '+') && v > 2n ** 63n - 1n) throw new WatError(`i64 constant out of range: ${n.v}`, n.tok)
  return BigInt.asIntN(64, v)
}

const FMT = {
  f32: { p: 24, emin: -126, emax: 127, ebits: 8, mbits: 23 },
  f64: { p: 53, emin: -1022, emax: 1023, ebits: 11, mbits: 52 },
}

function bitLen(x) {
  return x === 0n ? 0 : x.toString(2).length
}

/** Correctly rounded (ties-to-even) bits of the positive rational num/den. Returns BigInt bits or null on overflow. */
function roundRational(num, den, fmt) {
  if (num === 0n) return 0n
  const { p, emin, emax, mbits } = fmt
  // e = floor(log2(num/den))
  let e = bitLen(num) - bitLen(den)
  const ge = (k) => (k >= 0 ? num >= den << BigInt(k) : num << BigInt(-k) >= den)
  if (!ge(e)) e--
  if (e < emin) e = emin
  // q = floor(num/den * 2^(p-1-e))
  const sh = p - 1 - e
  let n2 = num, d2 = den
  if (sh >= 0) n2 = num << BigInt(sh)
  else d2 = den << BigInt(-sh)
  let q = n2 / d2
  const r = n2 - q * d2
  const twice = 2n * r
  if (twice > d2 || (twice === d2 && (q & 1n) === 1n)) q += 1n
  if (q === 1n << BigInt(p)) {
    q >>= 1n
    e++
  }
  if (e > emax) return null
  if (q < 1n << BigInt(p - 1)) return q // subnormal (exponent field 0)
  const expField = BigInt(e + (2 ** (fmt.ebits - 1) - 1))
  return (expField << BigInt(mbits)) | (q - (1n << BigInt(p - 1)))
}

/** Parse a float literal into a value of the given type (bit exact). */
function parseFloatLit(n, type) {
  if (!n || n.kind !== 'atom') throw new WatError(`expected ${type} literal`, n ? locOf(n) : undefined)
  const fmt = FMT[type]
  let s = n.v
  let neg = false
  if (s[0] === '+' || s[0] === '-') {
    neg = s[0] === '-'
    s = s.slice(1)
  }
  const signBit = neg ? 1n << BigInt(fmt.ebits + fmt.mbits) : 0n
  const expAll = ((1n << BigInt(fmt.ebits)) - 1n) << BigInt(fmt.mbits)
  let bits
  if (s === 'inf') bits = expAll
  else if (s === 'nan') bits = expAll | (1n << BigInt(fmt.mbits - 1))
  else if (s.startsWith('nan:0x')) {
    const payload = BigInt('0x' + cleanDigits(s.slice(6), /^[0-9a-fA-F]+$/, n.tok))
    if (payload === 0n || payload >= 1n << BigInt(fmt.mbits)) throw new WatError(`NaN payload out of range: ${n.v}`, n.tok)
    bits = expAll | payload
  } else {
    let num, den
    const hexm = /^0x([0-9a-fA-F_]*)(?:\.([0-9a-fA-F_]*))?(?:[pP]([+-]?[0-9_]+))?$/.exec(s)
    const decm = /^([0-9_]+)(?:\.([0-9_]*))?(?:[eE]([+-]?[0-9_]+))?$/.exec(s)
    if (hexm && (hexm[1] || hexm[2])) {
      const ip = hexm[1] ? cleanDigits(hexm[1], /^[0-9a-fA-F]+$/, n.tok) : ''
      const fp = hexm[2] ? cleanDigits(hexm[2], /^[0-9a-fA-F]+$/, n.tok) : ''
      if (!ip && !fp) throw new WatError(`malformed float literal "${n.v}"`, n.tok)
      let ex = hexm[3] ? Number(parseIntLit(hexm[3].replace(/^\+/, ''), n.tok)) : 0
      const mant = BigInt('0x' + (ip + fp || '0'))
      ex -= 4 * fp.length
      if (mant === 0n) bits = 0n
      else {
        if (ex > 5000) throw new WatError(`constant out of range: ${n.v}`, n.tok)
        if (ex < -5000 - 4 * (ip + fp).length) bits = 0n
        else if (ex >= 0) { num = mant << BigInt(ex); den = 1n }
        else { num = mant; den = 1n << BigInt(-ex) }
      }
    } else if (decm) {
      const ip = cleanDigits(decm[1], /^[0-9]+$/, n.tok)
      const fp = decm[2] ? cleanDigits(decm[2], /^[0-9]+$/, n.tok) : ''
      let ex = decm[3] ? Number(parseIntLit(decm[3].replace(/^\+/, ''), n.tok)) : 0
      const digits = (ip + fp).replace(/^0+/, '')
      ex -= fp.length
      if (!digits) bits = 0n
      else {
        const mant = BigInt(digits)
        const mag = digits.length + ex
        if (mag > 400) throw new WatError(`constant out of range: ${n.v}`, n.tok)
        if (mag < -400) bits = 0n
        else if (ex >= 0) { num = mant * 10n ** BigInt(ex); den = 1n }
        else { num = mant; den = 10n ** BigInt(-ex) }
      }
    } else throw new WatError(`malformed ${type} literal "${n.v}"`, n.tok)
    if (bits === undefined) {
      bits = roundRational(num, den, fmt)
      if (bits === null) throw new WatError(`constant out of range: ${n.v}`, n.tok)
    }
  }
  bits |= signBit
  return type === 'f32' ? f32FromBits(Number(bits)) : f64FromBitsBig(BigInt.asIntN(64, bits))
}

// ---------------------------------------------------------------------------
// Byte writer

class W {
  constructor() {
    this.buf = new Uint8Array(256)
    this.len = 0
  }
  ensure(k) {
    if (this.len + k <= this.buf.length) return
    let cap = this.buf.length * 2
    while (cap < this.len + k) cap *= 2
    const nb = new Uint8Array(cap)
    nb.set(this.buf.subarray(0, this.len))
    this.buf = nb
  }
  u8(b) {
    this.ensure(1)
    this.buf[this.len++] = b & 0xff
  }
  bytes(arr) {
    this.ensure(arr.length)
    this.buf.set(arr, this.len)
    this.len += arr.length
  }
  u32(v) {
    v = v >>> 0
    do {
      let b = v & 0x7f
      v >>>= 7
      if (v) b |= 0x80
      this.u8(b)
    } while (v)
  }
  sleb(v) {
    // v: BigInt
    for (;;) {
      const b = Number(v & 0x7fn)
      v >>= 7n
      if ((v === 0n && !(b & 0x40)) || (v === -1n && b & 0x40)) {
        this.u8(b)
        return
      }
      this.u8(b | 0x80)
    }
  }
  s32(v) {
    this.sleb(BigInt(v | 0))
  }
  f32bits(bits) {
    this.u8(bits)
    this.u8(bits >>> 8)
    this.u8(bits >>> 16)
    this.u8(bits >>> 24)
  }
  name(s) {
    const b = new TextEncoder().encode(s)
    this.u32(b.length)
    this.bytes(b)
  }
  out() {
    return this.buf.slice(0, this.len)
  }
}


// ---------------------------------------------------------------------------
// Assembler

const VALTYPES = new Set(['i32', 'i64', 'f32', 'f64', 'funcref', 'externref'])

function parseValType(n) {
  if (n && n.kind === 'atom') {
    if (VALTYPES.has(n.v)) return n.v
    if (n.v === 'v128') throw new WatError('this module uses SIMD (v128), which this engine does not support', n.tok)
  }
  if (isList(n, 'ref')) {
    const a = n.items.slice(1).map((x) => x.v)
    if (a.length === 2 && a[0] === 'null' && a[1] === 'func') return 'funcref'
    if (a.length === 2 && a[0] === 'null' && a[1] === 'extern') return 'externref'
    throw new WatError('this module uses typed function references / GC reference types, which this engine does not support', n.open)
  }
  throw new WatError(`expected value type, found ${n ? (n.kind === 'atom' ? '"' + n.v + '"' : n.kind) : 'end of list'}`, n ? locOf(n) : undefined)
}

function parseRefType(n) {
  const t = parseValType(n)
  if (t !== 'funcref' && t !== 'externref') throw new WatError('expected reference type (funcref or externref)', locOf(n))
  return t
}

function sigKey(params, results) {
  return params.join(',') + '>' + results.join(',')
}

class Space {
  constructor(what) {
    this.what = what
    this.items = []
    this.names = new Map()
  }
  add(item, idNode) {
    const idx = this.items.length
    this.items.push(item)
    if (idNode) {
      if (this.names.has(idNode.v)) throw new WatError(`duplicate ${this.what} ${idNode.v}`, idNode.tok)
      this.names.set(idNode.v, idx)
      item.name = idNode.v.slice(1)
    }
    return idx
  }
  resolve(n) {
    if (!n || n.kind !== 'atom') throw new WatError(`expected ${this.what} index or $name`, n ? locOf(n) : undefined)
    if (n.v[0] === '$') {
      const i = this.names.get(n.v)
      if (i === undefined) throw new WatError(`unknown ${this.what} ${n.v}`, n.tok)
      return i
    }
    return parseU32(n, `${this.what} index`)
  }
}

class Assembler {
  constructor(src) {
    this.src = src
    this.types = [] // {params, results, name?}
    this.typeNames = new Map()
    this.funcs = new Space('function')
    this.tables = new Space('table')
    this.mems = new Space('memory')
    this.globals = new Space('global')
    this.elems = new Space('elem segment')
    this.datas = new Space('data segment')
    this.imports = []
    this.exports = []
    this.start = null
    this.moduleName = null
    this.usesDataCount = false
    this.sawAnyDefinition = null
  }

  err(msg, node) {
    throw new WatError(msg, node ? locOf(node) : undefined)
  }

  // ---- types ---------------------------------------------------------------

  findOrAddType(params, results) {
    const k = sigKey(params, results)
    for (let i = 0; i < this.types.length; i++) if (sigKey(this.types[i].params, this.types[i].results) === k) return i
    this.types.push({ params, results, implicit: true })
    return this.types.length - 1
  }

  resolveType(n) {
    if (n.kind === 'atom' && n.v[0] === '$') {
      const i = this.typeNames.get(n.v)
      if (i === undefined) this.err(`unknown type ${n.v}`, n)
      return i
    }
    const i = parseU32(n, 'type index')
    return i
  }

  /**
   * Parse `(type x)? (param ...)* (result ...)*` starting at items[i].
   * Returns { typeIdx|null, params:[{name,type}], results, next }.
   */
  parseTypeUse(items, i, { allowNames = true } = {}) {
    let typeIdx = null
    if (isList(items[i], 'type')) {
      const tn = items[i].items[1]
      if (!tn || items[i].items.length !== 2) this.err('malformed (type ...) use', items[i])
      typeIdx = this.resolveType(tn)
      i++
    }
    const params = []
    const results = []
    let sawParams = false, sawResults = false
    while (isList(items[i], 'param')) {
      sawParams = true
      const li = items[i].items
      if (isId(li[1])) {
        if (!allowNames) this.err('parameter names are not allowed here', li[1])
        if (li.length !== 3) this.err('named param must have exactly one type', items[i])
        params.push({ name: li[1].v, nameNode: li[1], type: parseValType(li[2]) })
      } else for (let k = 1; k < li.length; k++) params.push({ name: null, type: parseValType(li[k]) })
      i++
    }
    while (isList(items[i], 'result')) {
      sawResults = true
      const li = items[i].items
      for (let k = 1; k < li.length; k++) results.push(parseValType(li[k]))
      i++
    }
    return { typeIdx, params, results, sawParams, sawResults, next: i }
  }

  /** Resolve a type use to a type index (find-or-append for inline signatures). */
  typeUseIndex(tu, node) {
    const pts = tu.params.map((p) => p.type)
    if (tu.typeIdx !== null) {
      const t = this.types[tu.typeIdx]
      if (!t) this.err(`unknown type ${tu.typeIdx}`, node)
      if ((tu.sawParams || tu.sawResults) && sigKey(pts, tu.results) !== sigKey(t.params, t.results))
        this.err('inline function type does not match the referenced (type ...)', node)
      return tu.typeIdx
    }
    return this.findOrAddType(pts, tu.results)
  }

  // ---- pass 1: declarations ------------------------------------------------

  collectTypes(fields) {
    for (const f of fields) {
      if (headOf(f) !== 'type') continue
      const it = f.items
      let i = 1
      let id = null
      if (isId(it[i])) id = it[i++]
      const fn = it[i]
      if (!isList(fn, 'func')) {
        if (fn && fn.kind === 'list' && ['struct', 'array', 'sub', 'rec'].includes(headOf(fn)))
          this.err('this module uses GC types (struct/array), which this engine does not support', fn)
        this.err('expected (func ...) in type definition', fn || f)
      }
      const tu = this.parseTypeUse(fn.items, 1)
      if (tu.typeIdx !== null || tu.next !== fn.items.length) this.err('malformed function type', fn)
      const idx = this.types.length
      this.types.push({ params: tu.params.map((p) => p.type), results: tu.results, name: id ? id.v.slice(1) : null })
      if (id) {
        if (this.typeNames.has(id.v)) this.err(`duplicate type ${id.v}`, id)
        this.typeNames.set(id.v, idx)
      }
    }
    for (const f of fields) if (headOf(f) === 'rec') this.err('this module uses GC recursive types, which this engine does not support', f)
  }

  parseLimits(items, i, node) {
    const min = parseU32(items[i], 'limit')
    i++
    let max = null
    if (items[i] && items[i].kind === 'atom' && /^[0-9]|^0x/.test(items[i].v)) {
      max = parseU32(items[i], 'limit')
      i++
    }
    void node
    return { min, max, next: i }
  }

  parseExportsImport(items, i, kind, indexThunk) {
    const exports = []
    let imp = null
    for (;;) {
      if (isList(items[i], 'export')) {
        const s = items[i].items[1]
        if (!s || s.kind !== 'string') this.err('expected export name string', items[i])
        exports.push({ name: decodeName(s), node: items[i] })
        i++
      } else if (isList(items[i], 'import')) {
        const li = items[i].items
        if (li.length !== 3 || li[1].kind !== 'string' || li[2].kind !== 'string') this.err('malformed inline import', items[i])
        imp = { module: decodeName(li[1]), name: decodeName(li[2]) }
        i++
      } else break
    }
    return { exports, imp, next: i }
  }

  declare(fields) {
    for (const f of fields) {
      const head = headOf(f)
      const it = f.items
      switch (head) {
        case 'type':
          break
        case 'func': {
          let i = 1
          const id = isId(it[i]) ? it[i++] : null
          const ei = this.parseExportsImport(it, i)
          i = ei.next
          const tu = this.parseTypeUse(it, i)
          const typeIdx = this.typeUseIndex(tu, f)
          const fn = { node: f, typeIdx, tu, bodyStart: tu.next, import: ei.imp, id }
          if (ei.imp) {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            if (tu.next !== it.length) this.err('imported function cannot have a body', f)
            this.imports.push({ kind: 'func', ...ei.imp, fn })
          } else this.sawAnyDefinition ||= 'function'
          const idx = this.funcs.add(fn, id)
          for (const e of ei.exports) this.exports.push({ name: e.name, kind: 'func', index: idx, node: e.node })
          break
        }
        case 'table': {
          let i = 1
          const id = isId(it[i]) ? it[i++] : null
          const ei = this.parseExportsImport(it, i)
          i = ei.next
          const t = { node: f, import: ei.imp }
          if (it[i] && it[i].kind === 'atom' && (VALTYPES.has(it[i].v)) && isList(it[i + 1], 'elem')) {
            // (table reftype (elem ...)) abbreviation
            t.elemType = parseRefType(it[i])
            t.inlineElem = it[i + 1]
            const n = this.countInlineElems(it[i + 1])
            t.min = n
            t.max = n
            i += 2
          } else {
            const lim = this.parseLimits(it, i, f)
            i = lim.next
            t.min = lim.min
            t.max = lim.max
            t.elemType = parseRefType(it[i++])
          }
          if (i !== it.length) this.err('unexpected tokens in table definition', it[i])
          if (ei.imp) {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            this.imports.push({ kind: 'table', ...ei.imp, t })
          } else this.sawAnyDefinition ||= 'table'
          const idx = this.tables.add(t, id)
          // the inline (elem ...) abbreviation desugars in place, keeping segment order
          if (t.inlineElem) this.elems.add({ node: t.inlineElem, inlineFor: idx, elemType: t.elemType })
          for (const e of ei.exports) this.exports.push({ name: e.name, kind: 'table', index: idx, node: e.node })
          break
        }
        case 'memory': {
          let i = 1
          const id = isId(it[i]) ? it[i++] : null
          const ei = this.parseExportsImport(it, i)
          i = ei.next
          const m = { node: f, import: ei.imp }
          if (isList(it[i], 'data')) {
            const dl = it[i].items
            let len = 0
            for (let k = 1; k < dl.length; k++) {
              if (dl[k].kind !== 'string') this.err('expected string in inline data', dl[k])
              len += dl[k].bytes.length
            }
            m.min = m.max = Math.ceil(len / 65536)
            m.inlineData = it[i]
            i++
          } else {
            if (it[i] && it[i].kind === 'atom' && (it[i].v === 'i64' || it[i].v === 'i32')) {
              if (it[i].v === 'i64') this.err('this module uses memory64, which this engine does not support', it[i])
              i++
            }
            const lim = this.parseLimits(it, i, f)
            i = lim.next
            m.min = lim.min
            m.max = lim.max
            if (isAtom(it[i], 'shared')) this.err('this module uses threads (shared memory), which this engine does not support', it[i])
          }
          if (i !== it.length) this.err('unexpected tokens in memory definition', it[i])
          if (ei.imp) {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            this.imports.push({ kind: 'memory', ...ei.imp, m })
          } else this.sawAnyDefinition ||= 'memory'
          const idx = this.mems.add(m, id)
          if (m.inlineData) this.datas.add({ node: m.inlineData, inlineFor: idx })
          for (const e of ei.exports) this.exports.push({ name: e.name, kind: 'memory', index: idx, node: e.node })
          break
        }
        case 'global': {
          let i = 1
          const id = isId(it[i]) ? it[i++] : null
          const ei = this.parseExportsImport(it, i)
          i = ei.next
          const g = { node: f, import: ei.imp }
          if (isList(it[i], 'mut')) {
            g.mut = true
            g.type = parseValType(it[i].items[1])
          } else {
            g.mut = false
            g.type = parseValType(it[i])
          }
          i++
          g.initItems = it.slice(i)
          if (ei.imp) {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            if (g.initItems.length) this.err('imported global cannot have an initializer', f)
            this.imports.push({ kind: 'global', ...ei.imp, g })
          } else this.sawAnyDefinition ||= 'global'
          const idx = this.globals.add(g, id)
          for (const e of ei.exports) this.exports.push({ name: e.name, kind: 'global', index: idx, node: e.node })
          break
        }
        case 'import': {
          if (it.length !== 4 || it[1].kind !== 'string' || it[2].kind !== 'string' || it[3].kind !== 'list') this.err('malformed import: expected (import "module" "name" (desc))', f)
          const mod = decodeName(it[1]), name = decodeName(it[2])
          const d = it[3]
          const dk = headOf(d)
          const di = d.items
          let i = 1
          const id = isId(di[i]) ? di[i++] : null
          if (dk === 'func') {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            const tu = this.parseTypeUse(di, i)
            if (tu.next !== di.length) this.err('unexpected tokens in import description', di[tu.next])
            const fn = { node: d, typeIdx: this.typeUseIndex(tu, d), tu, import: { module: mod, name }, id }
            this.funcs.add(fn, id)
            this.imports.push({ kind: 'func', module: mod, name, fn })
          } else if (dk === 'table') {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            const lim = this.parseLimits(di, i, d)
            const t = { node: d, min: lim.min, max: lim.max, elemType: parseRefType(di[lim.next]), import: { module: mod, name } }
            this.tables.add(t, id)
            this.imports.push({ kind: 'table', module: mod, name, t })
          } else if (dk === 'memory') {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            if (isAtom(di[i], 'i64')) this.err('this module uses memory64, which this engine does not support', di[i])
            if (isAtom(di[i], 'i32')) i++
            const lim = this.parseLimits(di, i, d)
            if (isAtom(di[lim.next], 'shared')) this.err('this module uses threads (shared memory), which this engine does not support', di[lim.next])
            const m = { node: d, min: lim.min, max: lim.max, import: { module: mod, name } }
            this.mems.add(m, id)
            this.imports.push({ kind: 'memory', module: mod, name, m })
          } else if (dk === 'global') {
            if (this.sawAnyDefinition) this.err(`import after ${this.sawAnyDefinition} definition`, f)
            const g = { node: d, import: { module: mod, name } }
            if (isList(di[i], 'mut')) {
              g.mut = true
              g.type = parseValType(di[i].items[1])
            } else {
              g.mut = false
              g.type = parseValType(di[i])
            }
            this.globals.add(g, id)
            this.imports.push({ kind: 'global', module: mod, name, g })
          } else if (dk === 'tag') this.err('this module uses exception handling (tags), which this engine does not support', d)
          else this.err(`unknown import kind "${dk}"`, d)
          break
        }
        case 'export': {
          if (it.length !== 3 || it[1].kind !== 'string' || it[2].kind !== 'list') this.err('malformed export: expected (export "name" (kind idx))', f)
          const k = headOf(it[2])
          if (!['func', 'table', 'memory', 'global'].includes(k)) this.err(`unknown export kind "${k}"`, it[2])
          this.exports.push({ name: decodeName(it[1]), kind: k, ref: it[2].items[1], node: f })
          break
        }
        case 'start':
          if (this.start) this.err('multiple start sections', f)
          this.start = f
          break
        case 'elem': {
          let i = 1
          const id = isId(it[i]) ? it[i++] : null
          this.elems.add({ node: f, startAt: i }, id)
          break
        }
        case 'data': {
          let i = 1
          const id = isId(it[i]) ? it[i++] : null
          this.datas.add({ node: f, startAt: i }, id)
          break
        }
        case 'tag':
          this.err('this module uses exception handling (tags), which this engine does not support', f)
          break
        default:
          this.err(`unknown module field "${head}"`, f)
      }
    }
  }

  countInlineElems(node) {
    const li = node.items
    let n = 0
    for (let k = 1; k < li.length; k++) n++
    return n
  }

  // ---- instructions ----------------------------------------------------------

  /**
   * Compile an instruction sequence. ctx: { w: W, locals: Map name->idx,
   * labels: [name|null], map: [] (source ranges), }.
   */
  instrs(items, i, end, ctx) {
    while (i < end) i = this.instr(items, i, end, ctx)
    return i
  }

  emitOp(ctx, info, range, keyword) {
    ctx.map.push({ ...range, keyword: keyword ? tokRange(keyword) : undefined, op: info.name })
    ctx.w.u8(info.bytes[0])
    if (info.bytes.length === 2) ctx.w.u32(info.bytes[1])
  }

  labelDepth(ctx, n) {
    if (n && n.kind === 'atom' && n.v[0] === '$') {
      for (let d = ctx.labels.length - 1; d >= 0; d--) if (ctx.labels[d] === n.v) return ctx.labels.length - 1 - d
      this.err(`unknown label ${n.v}`, n)
    }
    return parseU32(n, 'label')
  }

  /** Parse an optional label + block type at items[i]. */
  blockHeader(items, i, ctx) {
    let label = null
    if (isId(items[i])) label = items[i++].v
    const tu = this.parseTypeUse(items, i, { allowNames: false })
    let bt
    if (tu.typeIdx !== null) {
      // like wabt, use the short encodings when the referenced type allows it
      const idx = this.typeUseIndex(tu, items[i])
      const t = this.types[idx]
      if (t.params.length === 0 && t.results.length === 0) bt = { empty: true }
      else if (t.params.length === 0 && t.results.length === 1) bt = { valtype: t.results[0] }
      else bt = { idx }
    } else if (tu.params.length === 0 && tu.results.length === 0) bt = { empty: true }
    else if (tu.params.length === 0 && tu.results.length === 1) bt = { valtype: tu.results[0] }
    else bt = { idx: this.findOrAddType(tu.params.map((p) => p.type), tu.results) }
    return { label, bt, next: tu.next }
  }

  emitBlockType(ctx, bt) {
    if (bt.empty) ctx.w.u8(0x40)
    else if (bt.valtype) ctx.w.u8(VALTYPE_BYTE[bt.valtype])
    else ctx.w.sleb(BigInt(bt.idx))
  }

  checkEndLabel(items, i, label) {
    if (isId(items[i])) {
      if (items[i].v !== label) this.err(`mismatching label ${items[i].v}${label ? ' (expected ' + label + ')' : ''}`, items[i])
      return i + 1
    }
    return i
  }

  /** One flat or folded instruction at items[i]; returns next index. */
  instr(items, i, end, ctx) {
    const n = items[i]
    if (n.kind === 'list') {
      this.folded(n, ctx)
      return i + 1
    }
    if (n.kind !== 'atom') this.err('expected instruction', n)
    const kw = n.v
    if (kw === 'block' || kw === 'loop' || kw === 'if') {
      const info = OPS_BY_NAME.get(kw)
      const h = this.blockHeader(items, i + 1, ctx)
      const hdrEnd = items[h.next - 1] || n
      this.emitOp(ctx, info, rangeOf(n, h.next - 1 > i ? hdrEnd : n), n.tok)
      this.emitBlockType(ctx, h.bt)
      ctx.labels.push(h.label)
      let j = h.next
      for (;;) {
        if (j >= end) this.err(`missing "end" for ${kw}`, n)
        const t = items[j]
        if (isAtom(t, 'end')) break
        if (isAtom(t, 'else')) {
          if (kw !== 'if') this.err('else outside if', t)
          this.emitOp(ctx, OPS_BY_NAME.get('else'), tokRange(t.tok), t.tok)
          j = this.checkEndLabel(items, j + 1, h.label)
          continue
        }
        j = this.instr(items, j, end, ctx)
      }
      const endTok = items[j]
      this.emitOp(ctx, OPS_BY_NAME.get('end'), tokRange(endTok.tok), endTok.tok)
      ctx.labels.pop()
      return this.checkEndLabel(items, j + 1, h.label)
    }
    if (kw === 'end' || kw === 'else') this.err(`unexpected "${kw}"`, n)
    let j = i + 1
    const info = this.opInfo(n)
    const startNode = n
    const { next } = this.immediates(info, items, j, end, ctx, true, () => {
      const last = items[ctx._immEnd - 1]
      this.emitOp(ctx, ctx._info, rangeOf(startNode, ctx._immEnd - 1 >= i + 1 ? last : startNode), n.tok)
    })
    return next
  }

  opInfo(n) {
    let info = OPS_BY_NAME.get(n.v)
    if (!info) {
      if (/^(v128|i8x16|i16x8|i32x4|i64x2|f32x4|f64x2)\./.test(n.v)) this.err(`this module uses SIMD (${n.v}), which this engine does not support`, n)
      if (/\.atomic\.|^memory\.atomic|^atomic\.fence/.test(n.v)) this.err(`this module uses threads (${n.v}), which this engine does not support`, n)
      if (/^(try|catch|catch_all|throw|rethrow|delegate|try_table|throw_ref)$/.test(n.v)) this.err(`this module uses exception handling (${n.v}), which this engine does not support`, n)
      if (/^return_call/.test(n.v)) this.err(`this module uses tail calls (${n.v}), which this engine does not support`, n)
      if (/^(call_ref|ref\.as_non_null|br_on_null|br_on_non_null|struct\.|array\.|ref\.i31|i31\.|ref\.test|ref\.cast|br_on_cast|any\.|extern\.)/.test(n.v)) this.err(`this module uses GC / typed references (${n.v}), which this engine does not support`, n)
      this.err(`unknown instruction "${n.v}"`, n)
    }
    return info
  }

  /**
   * Parse immediates of `info` from items[j...] and emit opcode+immediates.
   * `emitHead` is called (after immediates are parsed, before they are
   * written) to push the opcode with its source range.
   */
  immediates(info, items, j, end, ctx, flat, emitHead) {
    const w = ctx.w
    const out = []
    const put = (fn) => out.push(fn)
    let finfo = info
    const numAtom = (k) => items[k] && items[k].kind === 'atom' && k < end
    const idxAtom = (k) => numAtom(k) && (items[k].v[0] === '$' || /^[0-9]/.test(items[k].v))
    switch (info.imm) {
      case 'none':
        if (info.name === 'select' && isList(items[j], 'result')) {
          const types = []
          while (isList(items[j], 'result')) {
            for (let k = 1; k < items[j].items.length; k++) types.push(parseValType(items[j].items[k]))
            j++
          }
          finfo = OPS[0x1c]
          put(() => {
            w.u32(types.length)
            for (const t of types) w.u8(VALTYPE_BYTE[t])
          })
        }
        break
      case 'label': {
        const d = this.labelDepth(ctx, items[j++])
        put(() => w.u32(d))
        break
      }
      case 'br_table': {
        const ds = []
        while (idxAtom(j)) ds.push(this.labelDepth(ctx, items[j++]))
        if (!ds.length) this.err('br_table needs at least one label', items[j - 1])
        const deflt = ds.pop()
        put(() => {
          w.u32(ds.length)
          for (const d of ds) w.u32(d)
          w.u32(deflt)
        })
        break
      }
      case 'func': {
        const f = this.funcs.resolve(items[j++])
        put(() => w.u32(f))
        break
      }
      case 'call_indirect': {
        let table = 0
        if (idxAtom(j)) table = this.tables.resolve(items[j++])
        const tu = this.parseTypeUse(items, j, { allowNames: false })
        const ti = this.typeUseIndex(tu, items[j] || items[j - 1])
        j = tu.next
        put(() => {
          w.u32(ti)
          w.u32(table)
        })
        break
      }
      case 'local': {
        const n = items[j++]
        let idx
        if (isId(n)) {
          idx = ctx.locals.get(n.v)
          if (idx === undefined) this.err(`unknown local ${n.v}`, n)
        } else idx = parseU32(n, 'local index')
        put(() => w.u32(idx))
        break
      }
      case 'global': {
        const g = this.globals.resolve(items[j++])
        put(() => w.u32(g))
        break
      }
      case 'table': {
        let t = 0
        if (idxAtom(j)) t = this.tables.resolve(items[j++])
        put(() => w.u32(t))
        break
      }
      case 'memarg': {
        let offset = 0, align = naturalAlign(info.name)
        if (idxAtom(j) && !/=/.test(items[j].v)) {
          const mi = this.mems.resolve(items[j++])
          if (mi !== 0) this.err('this module uses multi-memory, which this engine does not support', items[j - 1])
        }
        while (numAtom(j) && /^(offset|align)=/.test(items[j].v)) {
          const [k, v] = items[j].v.split('=')
          const node = { kind: 'atom', v, tok: items[j].tok }
          const val = parseU32(node, k)
          if (k === 'offset') offset = val
          else {
            if (val === 0 || (val & (val - 1)) !== 0) this.err('alignment must be a power of two', items[j])
            align = Math.log2(val)
          }
          j++
        }
        put(() => {
          w.u32(align)
          w.u32(offset)
        })
        break
      }
      case 'memidx': {
        if (idxAtom(j)) {
          const mi = this.mems.resolve(items[j++])
          if (mi !== 0) this.err('this module uses multi-memory, which this engine does not support', items[j - 1])
        }
        put(() => w.u8(0))
        break
      }
      case 'i32': {
        const v = parseI32(items[j++])
        put(() => w.s32(v))
        break
      }
      case 'i64': {
        const v = parseI64(items[j++])
        put(() => w.sleb(v))
        break
      }
      case 'f32': {
        const v = parseFloatLit(items[j++], 'f32')
        put(() => w.f32bits(f32Bits(v)))
        break
      }
      case 'f64': {
        const v = parseFloatLit(items[j++], 'f64')
        put(() => {
          const [hi, lo] = f64Words(v)
          w.f32bits(lo)
          w.f32bits(hi)
        })
        break
      }
      case 'reftype': {
        const n = items[j++]
        let t
        if (isAtom(n, 'func') || isAtom(n, 'funcref')) t = 0x70
        else if (isAtom(n, 'extern') || isAtom(n, 'externref')) t = 0x6f
        else this.err('expected heap type func or extern', n || items[j - 2])
        put(() => w.u8(t))
        break
      }
      case 'memory_init': {
        this.usesDataCount = true
        let a = this.datas.resolve(items[j++])
        if (idxAtom(j)) {
          // memory.init $mem $data
          if (a !== 0) this.err('this module uses multi-memory, which this engine does not support', items[j - 1])
          a = this.datas.resolve(items[j++])
        }
        put(() => {
          w.u32(a)
          w.u8(0)
        })
        break
      }
      case 'data': {
        this.usesDataCount = true
        const d = this.datas.resolve(items[j++])
        put(() => w.u32(d))
        break
      }
      case 'memory_copy': {
        if (idxAtom(j)) { this.mems.resolve(items[j++]); if (idxAtom(j)) this.mems.resolve(items[j++]) }
        put(() => {
          w.u8(0)
          w.u8(0)
        })
        break
      }
      case 'table_init': {
        let t = 0
        let e
        if (idxAtom(j) && idxAtom(j + 1)) {
          t = this.tables.resolve(items[j++])
          e = this.elems.resolve(items[j++])
        } else e = this.elems.resolve(items[j++])
        put(() => {
          w.u32(e)
          w.u32(t)
        })
        break
      }
      case 'elem': {
        const e = this.elems.resolve(items[j++])
        put(() => w.u32(e))
        break
      }
      case 'table_copy': {
        let d = 0, s = 0
        if (idxAtom(j)) {
          d = this.tables.resolve(items[j++])
          s = this.tables.resolve(items[j++])
        }
        put(() => {
          w.u32(d)
          w.u32(s)
        })
        break
      }
      default:
        this.err(`internal: immediate kind ${info.imm}`, items[j])
    }
    if (j > end) this.err(`missing immediate for ${info.name}`, items[end - 1])
    ctx._immEnd = j
    ctx._info = finfo
    void flat
    emitHead()
    for (const f of out) f()
    return { next: j }
  }

  folded(node, ctx) {
    const it = node.items
    const head = it[0]
    if (!head || head.kind !== 'atom') this.err('expected instruction', node)
    const kw = head.v
    if (kw === 'block' || kw === 'loop') {
      const info = OPS_BY_NAME.get(kw)
      const h = this.blockHeader(it, 1, ctx)
      this.emitOp(ctx, info, rangeOf(node.open, it[h.next - 1] || head), head.tok)
      this.emitBlockType(ctx, h.bt)
      ctx.labels.push(h.label)
      this.instrs(it, h.next, it.length, ctx)
      ctx.labels.pop()
      this.emitOp(ctx, OPS_BY_NAME.get('end'), tokRange(node.close), node.close)
      return
    }
    if (kw === 'if') {
      const h = this.blockHeader(it, 1, ctx)
      let j = h.next
      // condition operands
      while (j < it.length && !isList(it[j], 'then') && !isList(it[j], 'else')) {
        if (it[j].kind !== 'list') this.err('expected folded condition or (then ...)', it[j])
        this.folded(it[j], ctx)
        j++
      }
      this.emitOp(ctx, OPS_BY_NAME.get('if'), rangeOf(node.open, it[h.next - 1] || head), head.tok)
      this.emitBlockType(ctx, h.bt)
      ctx.labels.push(h.label)
      if (!isList(it[j], 'then')) this.err('expected (then ...) in folded if', it[j] || node)
      this.instrs(it[j].items, 1, it[j].items.length, ctx)
      j++
      if (isList(it[j], 'else') && it[j].items.length === 1) j++ // empty (else) emits nothing, like wabt
      else if (isList(it[j], 'else')) {
        const el = it[j]
        this.emitOp(ctx, OPS_BY_NAME.get('else'), rangeOf(el.open, el.items[0]), el.items[0].tok)
        this.instrs(el.items, 1, el.items.length, ctx)
        j++
      }
      if (j !== it.length) this.err('unexpected tokens after (then)/(else) in folded if', it[j])
      ctx.labels.pop()
      this.emitOp(ctx, OPS_BY_NAME.get('end'), tokRange(node.close), node.close)
      return
    }
    if (kw === 'then' || kw === 'else') this.err(`unexpected (${kw} ...) outside folded if`, node)
    const info = this.opInfo(head)
    // parse immediates first (without emitting), then emit operand subtrees, then op
    const tmp = { ...ctx, w: new W(), map: [] }
    const { next } = this.immediates(info, it, 1, it.length, tmp, false, () => {})
    for (let k = next; k < it.length; k++) {
      if (it[k].kind !== 'list') this.err('expected folded operand expression', it[k])
      this.folded(it[k], ctx)
    }
    // re-run immediates writing into the real buffer
    this.immediates(info, it, 1, it.length, ctx, false, () => {
      this.emitOp(ctx, ctx._info, rangeOf(node.open, node.close), head.tok)
    })
  }

  // ---- constant expressions ----------------------------------------------

  constExpr(items, ctxBase, node) {
    const ctx = { w: new W(), locals: new Map(), labels: [], map: [] }
    if (!items.length) this.err('empty constant expression', node)
    this.instrs(items, 0, items.length, ctx)
    ctx.w.u8(0x0b)
    void ctxBase
    return ctx.w.out()
  }

  // ---- pass 2: emit ------------------------------------------------------------

  build() {
    const bodies = []
    const sourceMap = { funcs: [] }
    const localNames = new Map()
    let defIndex = 0
    this.funcs.items.forEach((fn, fi) => {
      if (fn.import) return
      const it = fn.node.items
      const locals = new Map()
      const lnames = new Map()
      const params = fn.tu.params
      const t = this.types[fn.typeIdx]
      const nparams = t.params.length
      params.forEach((p, k) => {
        if (p.name) {
          if (locals.has(p.name)) this.err(`duplicate local ${p.name}`, p.nameNode)
          locals.set(p.name, k)
          lnames.set(k, p.name.slice(1))
        }
      })
      let i = fn.bodyStart
      const localTypes = []
      while (isList(it[i], 'local')) {
        const li = it[i].items
        if (isId(li[1])) {
          if (li.length !== 3) this.err('named local must have exactly one type', it[i])
          const idx = nparams + localTypes.length
          if (locals.has(li[1].v)) this.err(`duplicate local ${li[1].v}`, li[1])
          locals.set(li[1].v, idx)
          lnames.set(idx, li[1].v.slice(1))
          localTypes.push(parseValType(li[2]))
        } else for (let k = 1; k < li.length; k++) localTypes.push(parseValType(li[k]))
        i++
      }
      const ctx = { w: new W(), locals, labels: [], map: [] }
      this.instrs(it, i, it.length, ctx)
      this.emitOp(ctx, OPS_BY_NAME.get('end'), tokRange(fn.node.close), fn.node.close)
      // locals: run-length encode
      const groups = []
      for (const lt of localTypes) {
        if (groups.length && groups[groups.length - 1].type === lt) groups[groups.length - 1].count++
        else groups.push({ type: lt, count: 1 })
      }
      const bw = new W()
      bw.u32(groups.length)
      for (const g of groups) {
        bw.u32(g.count)
        bw.u8(VALTYPE_BYTE[g.type])
      }
      bw.bytes(ctx.w.out())
      bodies.push(bw.out())
      sourceMap.funcs[fi] = ctx.map
      if (lnames.size) localNames.set(fi, lnames)
      defIndex++
    })

    // resolve explicit exports referencing by name
    for (const e of this.exports) {
      if (e.ref !== undefined) {
        const space = { func: this.funcs, table: this.tables, memory: this.mems, global: this.globals }[e.kind]
        e.index = space.resolve(e.ref)
      }
    }
    const seenExport = new Set()
    for (const e of this.exports) {
      if (seenExport.has(e.name)) this.err(`duplicate export "${e.name}"`, e.node)
      seenExport.add(e.name)
    }

    const out = new W()
    out.bytes([0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00])
    const section = (id, fill) => {
      const s = new W()
      fill(s)
      out.u8(id)
      out.u32(s.len)
      out.bytes(s.out())
    }
    // globals / elems / datas need their bodies before the type section is final
    const globalInits = this.globals.items.map((g) => (g.import ? null : this.constExpr(g.initItems, null, g.node)))
    const elemBins = this.elems.items.map((e) => this.elemSegment(e))
    const dataBins = this.datas.items.map((d) => this.dataSegment(d))
    const startIdx = this.start ? this.funcs.resolve(this.start.items[1]) : null

    if (this.types.length)
      section(1, (s) => {
        s.u32(this.types.length)
        for (const t of this.types) {
          s.u8(0x60)
          s.u32(t.params.length)
          for (const p of t.params) s.u8(VALTYPE_BYTE[p])
          s.u32(t.results.length)
          for (const r of t.results) s.u8(VALTYPE_BYTE[r])
        }
      })
    if (this.imports.length)
      section(2, (s) => {
        s.u32(this.imports.length)
        for (const imp of this.imports) {
          s.name(imp.module)
          s.name(imp.name)
          if (imp.kind === 'func') {
            s.u8(0)
            s.u32(imp.fn.typeIdx)
          } else if (imp.kind === 'table') {
            s.u8(1)
            s.u8(VALTYPE_BYTE[imp.t.elemType])
            writeLimits(s, imp.t)
          } else if (imp.kind === 'memory') {
            s.u8(2)
            writeLimits(s, imp.m)
          } else {
            s.u8(3)
            s.u8(VALTYPE_BYTE[imp.g.type])
            s.u8(imp.g.mut ? 1 : 0)
          }
        }
      })
    const defFuncs = this.funcs.items.filter((f) => !f.import)
    if (defFuncs.length)
      section(3, (s) => {
        s.u32(defFuncs.length)
        for (const f of defFuncs) s.u32(f.typeIdx)
      })
    const defTables = this.tables.items.filter((t) => !t.import)
    if (defTables.length)
      section(4, (s) => {
        s.u32(defTables.length)
        for (const t of defTables) {
          s.u8(VALTYPE_BYTE[t.elemType])
          writeLimits(s, t)
        }
      })
    const defMems = this.mems.items.filter((m) => !m.import)
    if (defMems.length)
      section(5, (s) => {
        s.u32(defMems.length)
        for (const m of defMems) writeLimits(s, m)
      })
    const defGlobals = this.globals.items.map((g, i) => [g, i]).filter(([g]) => !g.import)
    if (defGlobals.length)
      section(6, (s) => {
        s.u32(defGlobals.length)
        for (const [g, i] of defGlobals) {
          s.u8(VALTYPE_BYTE[g.type])
          s.u8(g.mut ? 1 : 0)
          s.bytes(globalInits[i])
        }
      })
    if (this.exports.length)
      section(7, (s) => {
        s.u32(this.exports.length)
        for (const e of this.exports) {
          s.name(e.name)
          s.u8({ func: 0, table: 1, memory: 2, global: 3 }[e.kind])
          s.u32(e.index)
        }
      })
    if (startIdx !== null) section(8, (s) => s.u32(startIdx))
    if (elemBins.length)
      section(9, (s) => {
        s.u32(elemBins.length)
        for (const b of elemBins) s.bytes(b)
      })
    if (this.usesDataCount) section(12, (s) => s.u32(dataBins.length))
    if (bodies.length)
      section(10, (s) => {
        s.u32(bodies.length)
        for (const b of bodies) {
          s.u32(b.length)
          s.bytes(b)
        }
      })
    if (dataBins.length)
      section(11, (s) => {
        s.u32(dataBins.length)
        for (const b of dataBins) s.bytes(b)
      })

    // name section
    const nameSec = new W()
    nameSec.name('name')
    const sub = (id, fill) => {
      const s = new W()
      fill(s)
      nameSec.u8(id)
      nameSec.u32(s.len)
      nameSec.bytes(s.out())
    }
    const nameMap = (s, entries) => {
      s.u32(entries.length)
      for (const [i, n] of entries) {
        s.u32(i)
        s.name(n)
      }
    }
    if (this.moduleName) sub(0, (s) => s.name(this.moduleName))
    const fnames = []
    this.funcs.items.forEach((f, i) => f.name && fnames.push([i, f.name]))
    if (fnames.length) sub(1, (s) => nameMap(s, fnames))
    if (localNames.size)
      sub(2, (s) => {
        const entries = [...localNames.entries()].sort((a, b) => a[0] - b[0])
        s.u32(entries.length)
        for (const [fi, m] of entries) {
          s.u32(fi)
          nameMap(s, [...m.entries()].sort((a, b) => a[0] - b[0]))
        }
      })
    const spaceNames = (sp) => {
      const e = []
      sp.items.forEach((x, i) => x.name && e.push([i, x.name]))
      return e
    }
    const tnames = []
    this.types.forEach((t, i) => t.name && tnames.push([i, t.name]))
    if (tnames.length) sub(4, (s) => nameMap(s, tnames))
    for (const [id, sp] of [[5, this.tables], [6, this.mems], [7, this.globals], [8, this.elems], [9, this.datas]]) {
      const e = spaceNames(sp)
      if (e.length) sub(id, (s) => nameMap(s, e))
    }
    if (nameSec.len > 5) {
      out.u8(0)
      out.u32(nameSec.len)
      out.bytes(nameSec.out())
    }
    return { bytes: out.out(), sourceMap }
  }

  parseOffset(items, i, node) {
    const n = items[i]
    if (isList(n, 'offset')) return { bin: this.constExpr(n.items.slice(1), null, n), next: i + 1 }
    if (n && n.kind === 'list') return { bin: this.constExpr([n], null, n), next: i + 1 }
    this.err('expected (offset ...) or a folded constant expression', n || node)
  }

  elemSegment(e) {
    const w = new W()
    const node = e.node
    const it = node.items
    if (e.inlineFor !== undefined) {
      // (table reftype (elem ...)): active at table e.inlineFor, offset 0
      const exprs = it.slice(1)
      const funcList = exprs.every((x) => x.kind === 'atom')
      const off = new W()
      off.u8(0x41)
      off.u8(0)
      off.u8(0x0b)
      this.writeElem(w, { mode: 'active', table: e.inlineFor, offset: off.out(), elemType: e.elemType, funcList, items: exprs, node })
      return w.out()
    }
    let i = e.startAt
    let mode = 'passive', table = 0, offset = null
    if (isAtom(it[i], 'declare')) {
      mode = 'declarative'
      i++
    } else {
      if (isList(it[i], 'table')) {
        table = this.tables.resolve(it[i].items[1])
        i++
        mode = 'active'
      } else if (it[i] && it[i].kind === 'atom' && /^[0-9$]/.test(it[i].v) && it[i + 1] && it[i + 1].kind === 'list') {
        // legacy: (elem <tableidx> (offset ...) ...)
        table = this.tables.resolve(it[i])
        i++
        mode = 'active'
      }
      if (isList(it[i], 'offset') || (it[i] && it[i].kind === 'list' && !isList(it[i], 'item') && mode === 'active') || (mode === 'passive' && it[i] && it[i].kind === 'list' && !isList(it[i], 'item') && !isList(it[i], 'ref'))) {
        const o = this.parseOffset(it, i, node)
        offset = o.bin
        i = o.next
        mode = 'active'
      }
    }
    let elemType = 'funcref'
    let funcList = true
    let explicitFunc = false
    if (isAtom(it[i], 'func')) {
      explicitFunc = true
      i++
    } else if (it[i] && ((it[i].kind === 'atom' && VALTYPES.has(it[i].v)) || isList(it[i], 'ref'))) {
      elemType = parseRefType(it[i])
      funcList = false
      i++
    } else if (mode !== 'active' && i < it.length) {
      // passive/declarative need an explicit elem type unless empty
      funcList = it.slice(i).every((x) => x.kind === 'atom')
    }
    const items = it.slice(i)
    if (funcList && !items.every((x) => x.kind === 'atom')) {
      if (explicitFunc) this.err('expected function indices after "func"', items.find((x) => x.kind !== 'atom'))
      funcList = false
    }
    this.writeElem(w, { mode, table, offset, elemType, funcList, items, node, explicitFunc })
    return w.out()
  }

  writeElem(w, s) {
    const { mode, table, offset, elemType, funcList, items } = s
    const exprBins = () =>
      items.map((x) => {
        if (isList(x, 'item')) return this.constExpr(x.items.slice(1), null, x)
        if (x.kind === 'list') return this.constExpr([x], null, x)
        // bare func index inside an expression list
        const ew = new W()
        ew.u8(0xd2)
        ew.u32(this.funcs.resolve(x))
        ew.u8(0x0b)
        return ew.out()
      })
    if (funcList) {
      const idxs = items.map((x) => this.funcs.resolve(x))
      if (mode === 'active') {
        if (table === 0) {
          w.u32(0)
          w.bytes(offset)
        } else {
          w.u32(2)
          w.u32(table)
          w.bytes(offset)
          w.u8(0)
        }
      } else {
        w.u32(mode === 'passive' ? 1 : 3)
        w.u8(0)
      }
      w.u32(idxs.length)
      for (const i of idxs) w.u32(i)
    } else {
      const bins = exprBins()
      if (mode === 'active') {
        if (table === 0 && elemType === 'funcref') {
          w.u32(4)
          w.bytes(offset)
        } else {
          w.u32(6)
          w.u32(table)
          w.bytes(offset)
          w.u8(VALTYPE_BYTE[elemType])
        }
      } else {
        w.u32(mode === 'passive' ? 5 : 7)
        w.u8(VALTYPE_BYTE[elemType])
      }
      w.u32(bins.length)
      for (const b of bins) w.bytes(b)
    }
  }

  dataSegment(d) {
    const w = new W()
    const it = d.node.items
    const strings = []
    if (d.inlineFor !== undefined) {
      for (let k = 1; k < it.length; k++) strings.push(it[k].bytes)
      w.u32(0)
      w.bytes([0x41, 0x00, 0x0b])
    } else {
      let i = d.startAt
      let active = false
      if (isList(it[i], 'memory')) {
        const mi = this.mems.resolve(it[i].items[1])
        if (mi !== 0) this.err('this module uses multi-memory, which this engine does not support', it[i])
        i++
        active = true
      } else if (it[i] && it[i].kind === 'atom' && /^[0-9$]/.test(it[i].v)) {
        this.mems.resolve(it[i])
        i++
        active = true
      }
      if (it[i] && it[i].kind === 'list') {
        const o = this.parseOffset(it, i, d.node)
        w.u32(0)
        w.bytes(o.bin)
        i = o.next
        active = true
      } else if (active) this.err('expected offset expression in data segment', it[i] || d.node)
      else w.u32(1)
      for (; i < it.length; i++) {
        if (it[i].kind !== 'string') this.err('expected string in data segment', it[i])
        strings.push(it[i].bytes)
      }
    }
    let len = 0
    for (const s of strings) len += s.length
    w.u32(len)
    for (const s of strings) w.bytes(s)
    return w.out()
  }
}

function writeLimits(s, lim) {
  if (lim.max == null) {
    s.u8(0)
    s.u32(lim.min)
  } else {
    s.u8(1)
    s.u32(lim.min)
    s.u32(lim.max)
  }
}

function decodeName(strNode) {
  try {
    return new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(strNode.bytes)
  } catch {
    throw new WatError('malformed UTF-8 in name', strNode.tok)
  }
}

/**
 * Assemble WAT source text.
 * @returns {{ bytes: Uint8Array, sourceMap: { funcs: Array<Array<{start,end,line,col,endLine,endCol,keyword?,op}>> } }}
 *   sourceMap.funcs[funcIndex][instrIndex] gives the source range of each
 *   instruction of a defined function (indices match decode()'s body.code).
 */
export function assemble(src) {
  const toks = lex(src)
  const top = parseSexprs(toks)
  let fields
  let moduleName = null
  if (top.length === 1 && isList(top[0], 'module')) {
    const it = top[0].items
    let i = 1
    if (isId(it[i])) moduleName = it[i++].v.slice(1)
    if (isAtom(it[i], 'binary')) {
      const parts = []
      for (let k = i + 1; k < it.length; k++) {
        if (it[k].kind !== 'string') throw new WatError('expected string in (module binary ...)', locOf(it[k]))
        parts.push(it[k].bytes)
      }
      const len = parts.reduce((a, b) => a + b.length, 0)
      const bytes = new Uint8Array(len)
      let o = 0
      for (const p of parts) {
        bytes.set(p, o)
        o += p.length
      }
      return { bytes, sourceMap: { funcs: [] } }
    }
    if (isAtom(it[i], 'quote')) throw new WatError('(module quote ...) is not supported', locOf(it[i]))
    fields = it.slice(i)
  } else {
    for (const t of top) if (t.kind !== 'list' || isList(t, 'module')) throw new WatError('expected a single (module ...) or a list of module fields', locOf(t))
    fields = top
  }
  const a = new Assembler(src)
  a.moduleName = moduleName
  a.collectTypes(fields)
  a.declare(fields)
  return a.build()
}

/** Convenience: assemble and return just the bytes. */
export function wat2wasm(src) {
  return assemble(src).bytes
}
