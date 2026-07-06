import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { evaluate } from '../src/engine/scheduler'
import { exampleById } from '../src/examples'

function runExample(id: string, opts = {}) {
  const src = exampleById(id).source
  return evaluate(parse(src), src, opts)
}

describe('golden: bundled examples', () => {
  it('fib(10) = 55, structurally memoized', () => {
    const r = runExample('fib')
    expect(r.status).toBe('quiescent')
    expect(r.extraction.value).toBe(55)
    expect(r.rounds.length).toBeGreaterThanOrEqual(10)
    expect(r.rounds.length).toBeLessThanOrEqual(60)
    // The exponential call tree collapsed into a linear DAG: count the
    // distinct fib(k) classes at quiescence — one per distinct argument.
    const last = r.snapshots[r.snapshots.length - 1]
    const fibClasses = last.classes.filter((c) => c.alts.some((a) => a.op === 'call' && a.fn === 'fib'))
    expect(fibClasses.length).toBeGreaterThanOrEqual(5)
    expect(fibClasses.length).toBeLessThanOrEqual(15)
  })

  it('arith example = 9 in few rounds', () => {
    const r = runExample('arith')
    expect(r.extraction.value).toBe(9)
    expect(r.rounds.length).toBeLessThanOrEqual(4)
  })

  it('max example = 8', () => {
    const r = runExample('max')
    expect(r.extraction.value).toBe(8)
    expect(r.rounds.length).toBeLessThanOrEqual(12)
  })

  it('gcd(48, 18) = 6', () => {
    const r = runExample('gcd')
    expect(r.status).toBe('quiescent')
    expect(r.extraction.value).toBe(6)
    expect(r.rounds.length).toBeLessThanOrEqual(60)
  })

  it('sum-to(100) = 5050', () => {
    const r = runExample('sumto', { maxRounds: 2000 })
    expect(r.status).toBe('quiescent')
    expect(r.extraction.value).toBe(5050)
  })

  it('loop exhausts fuel', () => {
    const r = runExample('loop', { fuel: 20 })
    expect(r.status).toBe('fuel-exhausted')
    expect(r.extraction.isLiteral).toBe(false)
  })

  it('fib(12) = 144 (the definition-of-done edit)', () => {
    const src = exampleById('fib').source.replace('fib(10)', 'fib(12)')
    const r = evaluate(parse(src), src)
    expect(r.extraction.value).toBe(144)
  })
})

describe('source mapping', () => {
  it('every e-class at quiescence of fib(6) has ≥ 1 span; spans are valid offsets', () => {
    const src = exampleById('fib').source.replace('fib(10)', 'fib(6)')
    const r = evaluate(parse(src), src)
    expect(r.status).toBe('quiescent')
    const last = r.snapshots[r.snapshots.length - 1]
    for (const c of last.classes) {
      expect(c.spans.length, `class ${c.id} (${c.label}) has no spans`).toBeGreaterThanOrEqual(1)
      for (const s of c.spans) {
        expect(s.start).toBeGreaterThanOrEqual(0)
        expect(s.end).toBeGreaterThan(s.start)
        expect(s.end).toBeLessThanOrEqual(src.length)
      }
    }
  })

  it('shared subterms accumulate multiple spans (hash-consing is visible in source)', () => {
    const src = 'main = (1 + 2) * (1 + 2)'
    const r = evaluate(parse(src), src)
    const last = r.snapshots[r.snapshots.length - 1]
    const sumClass = last.classes.find((c) => c.alts.some((a) => a.op === '+'))
    expect(sumClass).toBeDefined()
    // the (1+2) class carries both source occurrences
    const sumSpans = sumClass!.spans.filter((s) => src.slice(s.start, s.end).includes('1 + 2'))
    expect(sumSpans.length).toBe(2)
  })
})
