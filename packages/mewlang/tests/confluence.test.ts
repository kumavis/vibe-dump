import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { evaluate } from '../src/engine/scheduler'

const FIB8 = `def fib(n) =
  if n < 2 then n
  else fib(n - 1) + fib(n - 2)

main = fib(8)
`

describe('confluence (CALM: monotone ⇒ order-free)', () => {
  it('25 seeded shuffles of fib(8) yield identical extraction and canonical counts', () => {
    const baseline = evaluate(parse(FIB8), FIB8, { shuffleSeed: null })
    expect(baseline.extraction.value).toBe(21)
    for (let seed = 1; seed <= 25; seed++) {
      const r = evaluate(parse(FIB8), FIB8, { shuffleSeed: seed })
      expect(r.status).toBe('quiescent')
      expect(r.extraction.value).toBe(21)
      expect(r.classCount).toBe(baseline.classCount)
      expect(r.altCount).toBe(baseline.altCount)
    }
  })

  it('shuffling does not change the number of rounds to quiescence', () => {
    const baseline = evaluate(parse(FIB8), FIB8)
    for (const seed of [3, 17, 1234]) {
      const r = evaluate(parse(FIB8), FIB8, { shuffleSeed: seed })
      expect(r.rounds.length).toBe(baseline.rounds.length)
    }
  })
})
