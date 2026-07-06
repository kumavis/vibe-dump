import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { Evaluator, evaluate } from '../src/engine/scheduler'
import { referenceEval, ReferenceLimitError } from '../src/engine/reference'
import { exampleById, EXAMPLES } from '../src/examples'

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

  it('sum-to(100) = 5050 with a raised round budget', () => {
    const r = runExample('sumto', { maxRounds: 400 })
    expect(r.status).toBe('quiescent')
    expect(r.extraction.value).toBe(5050)
  })

  it('sum-to(100) under the default budget: BUDGET-EXHAUSTED, answer not yet a literal', () => {
    const r = runExample('sumto')
    expect(r.status).toBe('budget-exhausted')
    expect(r.extraction.isLiteral).toBe(false)
  })

  it('loop exhausts its budget with a non-literal best', () => {
    const r = runExample('loop', { maxRounds: 20 })
    expect(r.status).toBe('budget-exhausted')
    expect(r.extraction.isLiteral).toBe(false)
    expect(r.extraction.pretty.length).toBeGreaterThan(0)
  })

  it('deadcode example quiesces at 1 (demand skips the dead loop)', () => {
    const r = runExample('deadcode')
    expect(r.status).toBe('quiescent')
    expect(r.extraction.value).toBe(1)
  })

  it('fib(12) = 144 (the definition-of-done edit)', () => {
    const src = exampleById('fib').source.replace('fib(10)', 'fib(12)')
    const r = evaluate(parse(src), src)
    expect(r.extraction.value).toBe(144)
  })
})

describe('CO-7 differential: extraction === reference interpreter', () => {
  const BUDGETS: Record<string, { maxRounds?: number }> = { sumto: { maxRounds: 400 } }

  it('every bundled example the interpreter can finish agrees with extraction', () => {
    for (const ex of EXAMPLES) {
      const program = parse(ex.source)
      let expected: number | boolean
      try {
        expected = referenceEval(program, 200_000)
      } catch (e) {
        if (e instanceof RangeError || e instanceof ReferenceLimitError) continue // loop: diverges
        throw e
      }
      const r = evaluate(program, ex.source, BUDGETS[ex.id] ?? {})
      expect(r.status, ex.id).toBe('quiescent')
      expect(r.extraction.value, ex.id).toBe(expected)
    }
  })

  it('fib(12) differential', () => {
    const src = exampleById('fib').source.replace('fib(10)', 'fib(12)')
    const program = parse(src)
    expect(evaluate(program, src).extraction.value).toBe(referenceEval(program))
  })
})

describe('source mapping', () => {
  it('every e-class at quiescence of fib(6) has ≥ 1 span via spansOf; offsets valid', () => {
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

  it('spansOf canonicalizes: retired ids resolve to the surviving class (CO-6)', () => {
    const src = exampleById('fib').source.replace('fib(10)', 'fib(6)')
    const program = parse(src)
    const ev = new Evaluator(program, src)
    ev.run()
    // every id that ever appeared in a merge must still resolve to ≥1 span
    for (const rl of ev.rounds) {
      for (const m of rl.merges) {
        expect(ev.egraph.spansOf(m.a).length).toBeGreaterThanOrEqual(1)
        expect(ev.egraph.spansOf(m.b).length).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('shared subterms accumulate multiple spans (hash-consing is visible in source)', () => {
    const src = 'main = (1 + 2) * (1 + 2)'
    const r = evaluate(parse(src), src)
    const last = r.snapshots[r.snapshots.length - 1]
    const sumClass = last.classes.find((c) => c.alts.some((a) => a.op === '+'))
    expect(sumClass).toBeDefined()
    const sumSpans = sumClass!.spans.filter((s) => src.slice(s.start, s.end).includes('1 + 2'))
    expect(sumSpans.length).toBe(2)
  })
})
