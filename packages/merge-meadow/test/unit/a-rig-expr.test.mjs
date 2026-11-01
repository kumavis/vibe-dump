// The rig expression language (design §17.2, ARCHITECTURE §6.1): our own parser,
// compiled to closures; no eval, no Function, no reach outside its variables.
import test from 'node:test'
import assert from 'node:assert/strict'
import { parseExpr, compileExpr, isExpr, checkExpr, EXPR_FUNCS, EXPR_VARS } from '../../src/doc/expr.js'
import { ImmutableString } from '../../src/doc/convert.js'

const ev = (src, vars = {}) => compileExpr(src)(vars)
const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`)

test('expr: precedence and associativity match the grammar', () => {
  assert.equal(ev('1 + 2 * 3'), 7)
  assert.equal(ev('(1 + 2) * 3'), 9)
  assert.equal(ev('10 - 4 - 3'), 3, 'left-associative minus')
  assert.equal(ev('2 * 3 / 4'), 1.5)
  assert.equal(ev('-2 * 3'), -6)
  assert.equal(ev('- -2'), 2)
  assert.equal(ev('+3'), 3)
  assert.equal(ev('1 + 2 < 4'), 1, 'arithmetic binds tighter than comparison')
  assert.equal(ev('1 < 2 == 1'), 1, 'comparison binds tighter than equality')
  assert.equal(ev('0 || 2 && 3'), 3, '&& binds tighter than ||')
  assert.equal(ev('!0 + 1'), 2, 'unary ! on the primary')
  assert.equal(ev('1 ? 2 : 3 ? 4 : 5'), 2)
  assert.equal(ev('0 ? 2 : 0 ? 4 : 5'), 5, 'the ternary is right-associative')
  assert.equal(ev('t > 1 ? t * 2 : -t', { t: 3 }), 6)
  assert.equal(ev('t > 1 ? t * 2 : -t', { t: 0.5 }), -0.5)
  assert.equal(ev('1e3 + .5 + 2.'), 1002.5, 'number forms')
  assert.equal(ev('2.5e-1'), 0.25)
  for (const [s, v] of [['3 <= 3', 1], ['3 >= 4', 0], ['3 != 4', 1], ['3 == 4', 0], ['2 > 1 && 0', 0], ['0 || 0', 0]]) assert.equal(ev(s), v, s)
})

test('expr: % is the floored modulo (phase % 1 stays in [0, 1))', () => {
  assert.equal(ev('7 % 3'), 1)
  near(ev('-0.25 % 1'), 0.75)
  near(ev('phase % 1', { phase: -3.25 }), 0.75)
})

test('expr: functions, constants and variables', () => {
  near(ev('sin(pi / 2)'), 1)
  near(ev('cos(tau)'), 1)
  near(ev('tan(0)'), 0)
  assert.equal(ev('abs(-3) + floor(1.7) + ceil(1.2) + round(1.5) + sign(-9)'), 3 + 1 + 2 + 2 - 1)
  assert.equal(ev('sqrt(16) + pow(2, 10)'), 4 + 1024)
  assert.equal(ev('min(3, 1, 2)'), 1)
  assert.equal(ev('max(3, 1, 2, 7)'), 7)
  assert.equal(ev('clamp(5, 0, 2)'), 2)
  assert.equal(ev('clamp(-5, 0, 2)'), 0)
  assert.equal(ev('lerp(10, 20, 0.25)'), 12.5)
  assert.equal(ev('smoothstep(0, 1, 0.5)'), 0.5)
  assert.equal(ev('smoothstep(0, 1, 2)'), 1)
  assert.equal(ev('smoothstep(1, 1, 0.5)'), 0, 'equal edges do not divide by zero')
  assert.equal(ev('saturate(1.5) + saturate(-1)'), 1)
  assert.equal(ev('step(0.5, 0.4)'), 0)
  assert.equal(ev('step(0.5, 0.5)'), 1)
  assert.deepEqual(Object.keys(EXPR_FUNCS).sort(), ['abs', 'ceil', 'clamp', 'cos', 'floor', 'lerp', 'max', 'min', 'pow', 'round', 'saturate', 'sign', 'sin', 'smoothstep', 'sqrt', 'step', 'tan'])
  assert.deepEqual([...EXPR_VARS], ['t', 'st', 'phase', 'speed', 'gait', 'turn', 'hp', 'rand', 'idx', 'pi', 'tau'])
  const vars = { t: 1, st: 2, phase: 3, speed: 4, gait: 0.5, turn: 6, hp: 0.7, rand: 0.8, idx: 9 }
  near(ev('t + st + phase + speed + gait + turn + hp + rand + idx', vars), 1 + 2 + 3 + 4 + 0.5 + 6 + 0.7 + 0.8 + 9)
  assert.equal(ev('sin(phase*tau)*25', { phase: 0.25 }), 25)
})

test('expr: guarded output, missing variables read 0, compiled once per source', () => {
  assert.equal(ev('1 / 0'), 0, 'Infinity -> 0')
  assert.equal(ev('0 / 0'), 0, 'NaN -> 0')
  assert.equal(ev('sqrt(-1)'), 0)
  assert.equal(ev('t + 1'), 1, 'a missing variable is 0')
  assert.equal(ev('t + 1', { t: 'x' }), 1, 'a non-number variable is 0')
  assert.equal(compileExpr('t + 1')(null), 1)
  assert.equal(compileExpr('t + 1')(undefined), 1)
  assert.equal(compileExpr('sin(t)'), compileExpr('sin(t)'), 'one compiled function per source string')
  assert.equal(compileExpr(new ImmutableString('t*2'))({ t: 4 }), 8, 'doc strings compile too')
  assert.ok(isExpr('t') && isExpr(new ImmutableString('t')) && !isExpr(3) && !isExpr(null) && !isExpr([[0, 1]]))
})

test('expr: errors are SyntaxErrors with a column', () => {
  const err = (src, re, col) => {
    let e = null
    try { parseExpr(src) } catch (x) { e = x }
    assert.ok(e instanceof SyntaxError, `${src}: ${e}`)
    assert.match(e.message, re, src)
    if (col != null) assert.equal(e.column, col, `${src}: column`)
    assert.match(e.message, /at column \d+/)
  }
  err('sin(t) + foo', /unknown identifier 'foo'/, 10)
  err('bar(1)', /unknown function 'bar'/, 1)
  err('t(1)', /'t' is a variable/, 1)
  err('sin', /'sin' is a function/, 1)
  err('sin(1, 2)', /sin\(\) takes 1 argument/, 1)
  err('clamp(1, 2)', /clamp\(\) takes 3 arguments/, 1)
  err('min(1)', /min\(\) takes 2 to 16/, 1)
  err('1 +', /unexpected end/, 4)
  err('', /empty expression/)
  err('   ', /empty expression/)
  err('(1 + 2', /expected '\)'/, 7)
  err('1 + 2)', /unexpected '\)'/, 6)
  err('a + 1', /unknown identifier 'a'/, 1)
  err('t = 1', /did you mean '=='/, 3)
  err('t & 1', /did you mean '&&'/, 3)
  err('t | 1', /did you mean '\|\|'/, 3)
  err('1 ? 2', /expected ':'/, 6)
  err('t.x', /unexpected character '\.'/, 2)
  err('"s"', /unexpected character '"'/, 1)
  err('t[0]', /unexpected character '\['/, 2)
  err('12abc', /bad number/, 1)
  err('1e+', /bad number exponent/)
  err('(' .repeat(100) + '1' + ')'.repeat(100), /nested too deep/)
  err('-'.repeat(100) + '1', /nested too deep/)
  err('1' + ' + 1'.repeat(600), /longer than 2000/)
  assert.throws(() => compileExpr(3), TypeError)
  assert.equal(checkExpr('sin(t)'), null)
  assert.match(checkExpr('sin(q)'), /unknown identifier 'q' at column 5/)
})

test('expr: no way out to globals, prototypes or the host', () => {
  for (const src of ['constructor', 'globalThis', 'this', 'process', 'Function', 'eval', 'window', 'Math', '__proto__', 'toString', 'valueOf', 'hasOwnProperty', 'require', 'import', 'new', 'x => 1', 'Math.sin(1)', 't.constructor', 'sin.call(1)', '`1`', "'a'", 't;1', '{}', '[]']) {
    assert.throws(() => compileExpr(src), SyntaxError, src)
  }
  // a variables object with traps on everything but the declared names is never asked for anything else
  const asked = new Set()
  const vars = new Proxy({ t: 1 }, { get (o, k) { asked.add(k); return o[k] }, has (o, k) { asked.add(k); return k in o } })
  assert.equal(compileExpr('t + phase*2 + sin(st) + pi')(vars), 1 + Math.PI)
  assert.deepEqual([...asked].sort(), ['phase', 'st', 't'])
  // inherited properties are not variables either: a plain lookup of a declared name only
  const sneaky = Object.create({ t: 5 })
  assert.equal(compileExpr('t')(sneaky), 5, 'own or inherited, it is only ever the declared name')
})

test('expr: the parser builds a plain AST with columns', () => {
  const ast = parseExpr('1 + t * 2')
  assert.equal(ast.type, 'binary'); assert.equal(ast.op, '+'); assert.equal(ast.col, 3)
  assert.equal(ast.b.type, 'binary'); assert.equal(ast.b.op, '*')
  assert.deepEqual(ast.b.a, { type: 'var', name: 't', col: 5 })
  assert.equal(parseExpr('pi').type, 'num', 'constants fold to numbers')
  assert.equal(JSON.parse(JSON.stringify(ast)).b.b.v, 2)
})
