// The rig expression language (design §17.2): a tiny, safe, numeric language for
// animation tracks, e.g. 'sin(phase*tau)*25' or 'st < 0.3 ? st/0.3 : 1'.
// Our own recursive-descent parser builds an AST; compileExpr turns it into
// nested closures, once per source string. No eval, no Function, no property
// access, no strings, no assignment: an expression can name only the variables
// in EXPR_VARS and call only EXPR_FUNCS, so it runs under lockdown() and gives the
// same number on every peer for the same inputs.
//
// Grammar (lowest precedence first; all binary operators left-associative):
//   expr    := or ('?' expr ':' expr)?            right-associative ternary
//   or      := and ('||' and)*
//   and     := eq ('&&' eq)*
//   eq      := rel (('==' | '!=') rel)*
//   rel     := add (('<' | '<=' | '>' | '>=') add)*
//   add     := mul (('+' | '-') mul)*
//   mul     := unary (('*' | '/' | '%') unary)*
//   unary   := ('-' | '+' | '!') unary | primary
//   primary := number | name | name '(' expr (',' expr)* ')' | '(' expr ')'
// Comparisons and `!` give 1 or 0; `&&`/`||` give one of their operands (as in
// JS). `%` is the FLOORED modulo (as GLSL's mod): (-0.25) % 1 = 0.75, so
// 'phase % 1' is always in [0, 1). The result is guarded: NaN/±Infinity -> 0.
import { ImmutableString } from './convert.js'

const D = (f) => Object.freeze(f)
const clampN = (x, lo, hi) => (x < lo ? lo : x > hi ? hi : x)

// name -> [function, min args, max args]
const FUNC_TABLE = {
  sin: [Math.sin, 1, 1],
  cos: [Math.cos, 1, 1],
  tan: [Math.tan, 1, 1],
  abs: [Math.abs, 1, 1],
  floor: [Math.floor, 1, 1],
  ceil: [Math.ceil, 1, 1],
  round: [Math.round, 1, 1],
  sign: [Math.sign, 1, 1],
  sqrt: [Math.sqrt, 1, 1],
  pow: [Math.pow, 2, 2],
  min: [Math.min, 2, 16],
  max: [Math.max, 2, 16],
  clamp: [clampN, 3, 3],
  lerp: [(a, b, t) => a + (b - a) * t, 3, 3],
  // smoothstep(edge0, edge1, x), as GLSL
  smoothstep: [(e0, e1, x) => {
    if (e0 === e1) return x < e0 ? 0 : 1
    const t = clampN((x - e0) / (e1 - e0), 0, 1)
    return t * t * (3 - 2 * t)
  }, 3, 3],
  saturate: [(x) => clampN(x, 0, 1), 1, 1],
  // step(edge, x): 0 below the edge, 1 at or above it, as GLSL
  step: [(edge, x) => (x < edge ? 0 : 1), 2, 2],
}

export const EXPR_FUNCS = D(Object.fromEntries(Object.entries(FUNC_TABLE).map(([k, [f]]) => [k, f])))
export const EXPR_VARS = D(['t', 'st', 'phase', 'speed', 'gait', 'turn', 'hp', 'rand', 'idx', 'pi', 'tau'])
const CONSTS = { pi: Math.PI, tau: Math.PI * 2 }
const VARS = new Set(EXPR_VARS.filter((v) => !(v in CONSTS)))
const has = (o, k) => Object.prototype.hasOwnProperty.call(o, k)

export const MAX_EXPR = 2000 // characters
const MAX_DEPTH = 64

export const isExpr = (v) => typeof v === 'string' || v instanceof ImmutableString

const srcOf = (v) => {
  if (typeof v === 'string') return v
  if (v instanceof ImmutableString) return String(v.val)
  throw new TypeError(`an expression must be a string, got ${v === null ? 'null' : typeof v}`)
}

function fail (msg, col, hint) {
  const e = new SyntaxError(`${msg} at column ${col}${hint ? ` (${hint})` : ''}`)
  e.column = col
  throw e
}

// ---------------------------------------------------------------- tokenizer

const PUNCT2 = new Set(['<=', '>=', '==', '!=', '&&', '||'])
const PUNCT1 = new Set(['+', '-', '*', '/', '%', '(', ')', ',', '?', ':', '<', '>', '!'])
const isDigit = (c) => c >= '0' && c <= '9'
const isIdStart = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'
const isIdChar = (c) => isIdStart(c) || isDigit(c)

function tokenize (src) {
  const out = []
  let i = 0
  while (i < src.length) {
    const c = src[i]
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { i++; continue }
    const col = i + 1
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1] ?? ''))) {
      let j = i
      while (isDigit(src[j] ?? '')) j++
      if (src[j] === '.') { j++; while (isDigit(src[j] ?? '')) j++ }
      if (src[j] === 'e' || src[j] === 'E') {
        let k = j + 1
        if (src[k] === '+' || src[k] === '-') k++
        if (!isDigit(src[k] ?? '')) fail('bad number exponent', k + 1)
        while (isDigit(src[k] ?? '')) k++
        j = k
      }
      if (isIdStart(src[j] ?? '')) fail(`bad number '${src.slice(i, j + 1)}'`, col)
      out.push({ t: 'num', v: Number(src.slice(i, j)), col })
      i = j
      continue
    }
    if (isIdStart(c)) {
      let j = i + 1
      while (isIdChar(src[j] ?? '')) j++
      out.push({ t: 'id', v: src.slice(i, j), col })
      i = j
      continue
    }
    const two = src.slice(i, i + 2)
    if (PUNCT2.has(two)) { out.push({ t: 'op', v: two, col }); i += 2; continue }
    if (PUNCT1.has(c)) { out.push({ t: 'op', v: c, col }); i++; continue }
    if (c === '=' || c === '&' || c === '|') fail(`unexpected '${c}' (did you mean '${c === '=' ? '==' : c + c}'?)`, col)
    fail(`unexpected character '${c}'`, col)
  }
  out.push({ t: 'end', v: '', col: src.length + 1 })
  return out
}

// ---------------------------------------------------------------- parser

const BINARY = [ // lowest first
  ['||'], ['&&'], ['==', '!='], ['<', '<=', '>', '>='], ['+', '-'], ['*', '/', '%'],
]

// -> AST: { type: 'num', v } | { type: 'var', name } | { type: 'unary', op, a } |
//         { type: 'binary', op, a, b } | { type: 'cond', test, a, b } | { type: 'call', name, args }
// every node carries `col` (1-based). Throws SyntaxError with `column`.
export function parseExpr (input) {
  const src = srcOf(input)
  if (src.length > MAX_EXPR) fail(`expression longer than ${MAX_EXPR} characters`, MAX_EXPR + 1)
  const toks = tokenize(src)
  let pos = 0
  let depth = 0
  const peek = () => toks[pos]
  const next = () => toks[pos++]
  const isOp = (v) => peek().t === 'op' && peek().v === v
  const expect = (v) => {
    const tk = peek()
    if (tk.t === 'op' && tk.v === v) return next()
    fail(tk.t === 'end' ? `expected '${v}' but the expression ended` : `expected '${v}' but found '${tk.v}'`, tk.col)
  }
  const deeper = (col) => { if (++depth > MAX_DEPTH) fail('expression nested too deep', col) }

  function expr () {
    const col = peek().col
    deeper(col)
    let n = binary(0)
    if (isOp('?')) {
      next()
      const a = expr()
      expect(':')
      const b = expr()
      n = { type: 'cond', test: n, a, b, col }
    }
    depth--
    return n
  }
  function binary (level) {
    if (level >= BINARY.length) return unary()
    let n = binary(level + 1)
    while (peek().t === 'op' && BINARY[level].includes(peek().v)) {
      const tk = next()
      n = { type: 'binary', op: tk.v, a: n, b: binary(level + 1), col: tk.col }
    }
    return n
  }
  function unary () {
    const tk = peek()
    if (tk.t === 'op' && (tk.v === '-' || tk.v === '+' || tk.v === '!')) {
      next(); deeper(tk.col)
      const a = unary()
      depth--
      return { type: 'unary', op: tk.v, a, col: tk.col }
    }
    return primary()
  }
  function primary () {
    const tk = next()
    if (tk.t === 'num') return { type: 'num', v: tk.v, col: tk.col }
    if (tk.t === 'id') {
      const name = tk.v
      if (isOp('(')) {
        if (!has(FUNC_TABLE, name)) {
          if (VARS.has(name) || has(CONSTS, name)) fail(`'${name}' is a variable, not a function`, tk.col)
          fail(`unknown function '${name}'`, tk.col, `functions: ${Object.keys(FUNC_TABLE).join(', ')}`)
        }
        next()
        const args = []
        if (!isOp(')')) { args.push(expr()); while (isOp(',')) { next(); args.push(expr()) } }
        expect(')')
        const [, lo, hi] = FUNC_TABLE[name]
        if (args.length < lo || args.length > hi) fail(`${name}() takes ${lo === hi ? lo : `${lo} to ${hi}`} argument${hi === 1 ? '' : 's'}, got ${args.length}`, tk.col)
        return { type: 'call', name, args, col: tk.col }
      }
      if (has(CONSTS, name)) return { type: 'num', v: CONSTS[name], name, col: tk.col }
      if (VARS.has(name)) return { type: 'var', name, col: tk.col }
      if (has(FUNC_TABLE, name)) fail(`'${name}' is a function: call it as ${name}(…)`, tk.col)
      fail(`unknown identifier '${name}'`, tk.col, `variables: ${EXPR_VARS.join(', ')}`)
    }
    if (tk.t === 'op' && tk.v === '(') {
      const n = expr()
      expect(')')
      return n
    }
    if (tk.t === 'end') fail(src.trim() ? 'unexpected end of expression' : 'empty expression', tk.col)
    fail(`unexpected '${tk.v}'`, tk.col)
  }

  const ast = expr()
  const tk = peek()
  if (tk.t !== 'end') fail(`unexpected '${tk.v}'`, tk.col)
  return ast
}

// ---------------------------------------------------------------- compiler

const num = (x) => (typeof x === 'number' ? x : 0)
const fmod = (a, b) => a - b * Math.floor(a / b)

function build (n) {
  switch (n.type) {
    case 'num': { const v = n.v; return () => v }
    case 'var': { const k = n.name; return (vs) => num(vs[k]) }
    case 'unary': {
      const a = build(n.a)
      if (n.op === '-') return (vs) => -a(vs)
      if (n.op === '!') return (vs) => (a(vs) ? 0 : 1)
      return a
    }
    case 'cond': { const c = build(n.test); const a = build(n.a); const b = build(n.b); return (vs) => (c(vs) ? a(vs) : b(vs)) }
    case 'binary': {
      const a = build(n.a); const b = build(n.b)
      switch (n.op) {
        case '+': return (vs) => a(vs) + b(vs)
        case '-': return (vs) => a(vs) - b(vs)
        case '*': return (vs) => a(vs) * b(vs)
        case '/': return (vs) => a(vs) / b(vs)
        case '%': return (vs) => fmod(a(vs), b(vs))
        case '<': return (vs) => (a(vs) < b(vs) ? 1 : 0)
        case '<=': return (vs) => (a(vs) <= b(vs) ? 1 : 0)
        case '>': return (vs) => (a(vs) > b(vs) ? 1 : 0)
        case '>=': return (vs) => (a(vs) >= b(vs) ? 1 : 0)
        case '==': return (vs) => (a(vs) === b(vs) ? 1 : 0)
        case '!=': return (vs) => (a(vs) !== b(vs) ? 1 : 0)
        case '&&': return (vs) => { const x = a(vs); return x ? b(vs) : x }
        case '||': return (vs) => { const x = a(vs); return x ? x : b(vs) }
      }
      throw new TypeError(`bad operator ${n.op}`)
    }
    case 'call': {
      const f = FUNC_TABLE[n.name][0]
      const args = n.args.map(build)
      if (args.length === 1) { const [a] = args; return (vs) => f(a(vs)) }
      if (args.length === 2) { const [a, b] = args; return (vs) => f(a(vs), b(vs)) }
      if (args.length === 3) { const [a, b, c] = args; return (vs) => f(a(vs), b(vs), c(vs)) }
      return (vs) => { let r = args[0](vs); for (let i = 1; i < args.length; i++) r = f(r, args[i](vs)); return r }
    }
  }
  throw new TypeError(`bad expression node ${n?.type}`)
}

const EMPTY = Object.freeze({})
const cache = new Map()
const CACHE_MAX = 4096

// -> (vars) => number. vars: { t, st, phase, speed, gait, turn, hp, rand, idx };
// a missing or non-numeric variable reads as 0. Compiled once per source string
// (the closures hold no state, so one compiled function serves every instance).
export function compileExpr (input) {
  const src = srcOf(input)
  const hit = cache.get(src)
  if (hit) return hit
  const f = build(parseExpr(src))
  const run = (vars) => {
    const v = f(vars && typeof vars === 'object' ? vars : EMPTY)
    return typeof v === 'number' && Number.isFinite(v) ? v : 0
  }
  if (cache.size >= CACHE_MAX) cache.clear()
  cache.set(src, run)
  return run
}

// problems[] instead of a throw, for validators that list every problem
export function checkExpr (input) {
  try { parseExpr(input); return null } catch (e) { return e instanceof SyntaxError || e instanceof TypeError ? e.message : String(e) }
}
