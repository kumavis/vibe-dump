import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { MewSyntaxError } from '../src/lang/lexer'
import type { Expr } from '../src/lang/ast'

describe('parser', () => {
  it('parses the canonical fib program', () => {
    const src = `;; comment
def fib(n) =
  if n < 2 then n
  else fib(n - 1) + fib(n - 2)

main = fib(10)
`
    const p = parse(src)
    expect(p.defs).toHaveLength(1)
    expect(p.defs[0].name).toBe('fib')
    expect(p.defs[0].params).toEqual(['n'])
    expect(p.defs[0].body.kind).toBe('if')
    expect(p.main.kind).toBe('call')
  })

  it('respects precedence: 1 + 2 * 3 parses as 1 + (2 * 3)', () => {
    const p = parse('main = 1 + 2 * 3')
    const m = p.main
    expect(m.kind).toBe('binop')
    if (m.kind !== 'binop') return
    expect(m.op).toBe('+')
    expect(m.rhs.kind).toBe('binop')
    if (m.rhs.kind === 'binop') expect(m.rhs.op).toBe('*')
  })

  it('left-associates subtraction: 10 - 3 - 2 = (10 - 3) - 2', () => {
    const p = parse('main = 10 - 3 - 2')
    const m = p.main
    if (m.kind !== 'binop') throw new Error('expected binop')
    expect(m.op).toBe('-')
    expect(m.lhs.kind).toBe('binop')
  })

  it('parses comparisons, booleans and if', () => {
    const p = parse('main = if 1 <= 2 then true else false')
    expect(p.main.kind).toBe('if')
  })

  it('folds unary minus on literals and desugars -x to 0 - x', () => {
    const p1 = parse('main = -5')
    expect(p1.main).toMatchObject({ kind: 'lit', value: -5 })
    const p2 = parse('def id(x) = x\nmain = id(-id(3))')
    const arg = (p2.main as Extract<Expr, { kind: 'call' }>).args[0]
    expect(arg.kind).toBe('binop')
  })

  it('attaches spans to every node', () => {
    const src = 'main = (1 + 2) * 3'
    const p = parse(src)
    const walk = (e: Expr): void => {
      expect(e.span.start).toBeGreaterThanOrEqual(0)
      expect(e.span.end).toBeGreaterThan(e.span.start)
      expect(e.span.end).toBeLessThanOrEqual(src.length)
      if (e.kind === 'binop') {
        walk(e.lhs)
        walk(e.rhs)
      }
    }
    walk(p.main)
    expect(src.slice(p.main.span.start, p.main.span.end)).toBe('(1 + 2) * 3')
  })

  it('reports parse errors with line/col and a caret snippet', () => {
    try {
      parse('main = 1 +\n  * 2')
      throw new Error('should have thrown')
    } catch (e) {
      expect(e).toBeInstanceOf(MewSyntaxError)
      const msg = (e as Error).message
      expect(msg).toMatch(/line 2, col 3/)
      expect(msg).toContain('^')
    }
  })

  it('rejects duplicate defs and trailing garbage', () => {
    expect(() => parse('def f(x) = x\ndef f(y) = y\nmain = 1')).toThrow(MewSyntaxError)
    expect(() => parse('main = 1 2')).toThrow(MewSyntaxError)
  })

  it('lexes ;; comments to end of line', () => {
    const p = parse('main = 1 ;; + 999')
    expect(p.main).toMatchObject({ kind: 'lit', value: 1 })
  })

  it("rejects 'if' inside an arithmetic operand (spec 2.1: atom has no if)", () => {
    expect(() => parse('main = 1 + if true then 2 else 3')).toThrow(/parenthesize/)
    // parenthesized, it is fine — and if at expression positions is fine
    expect(parse('main = 1 + (if true then 2 else 3)').main.kind).toBe('binop')
    expect(parse('main = if true then 2 else 3').main.kind).toBe('if')
  })

  it('rejects chained comparisons with a dedicated diagnostic', () => {
    expect(() => parse('main = 1 < 2 < 3')).toThrow(/chained/)
    expect(() => parse('def f(x) = 1 < 2 == true\nmain = f(0)')).toThrow(/chained/)
    expect(parse('main = (1 < 2) == true').main.kind).toBe('binop')
  })

  it('rejects integer literals beyond ±2^53', () => {
    expect(() => parse('main = 9007199254740993')).toThrow(/too large/)
    expect(parse('main = 9007199254740991').main).toMatchObject({ kind: 'lit' })
  })
})
