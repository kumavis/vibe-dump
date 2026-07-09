import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { Evaluator, evaluate } from '../src/engine/scheduler'
import { compareRuns, runFingerprint } from '../src/engine/fingerprint'
import { classBijection, finalSnapshot } from './helpers'

const FIB8 = `def fib(n) =
  if n < 2 then n
  else fib(n - 1) + fib(n - 2)

main = fib(8)
`
const FIB6 = FIB8.replace('fib(8)', 'fib(6)')

describe('confluence (A3: CALM — monotone ⇒ order-free)', () => {
  it('25 seeded shuffles of fib(8) yield identical canonical state and extraction', () => {
    const baseline = evaluate(parse(FIB8), FIB8)
    expect(baseline.status).toBe('quiescent')
    expect(baseline.extraction.value).toBe(21)
    const fp = runFingerprint(baseline) // alts + partition structure + best + provenance + spans
    for (let seed = 1; seed <= 25; seed++) {
      const r = evaluate(parse(FIB8), FIB8, { mode: 'shuffle', seed })
      expect(r.status).toBe('quiescent')
      expect(r.extraction.value).toBe(21)
      expect(r.classCount).toBe(baseline.classCount)
      expect(r.altCount).toBe(baseline.altCount)
      expect(runFingerprint(r)).toBe(fp)
    }
  })

  it('shuffling does not change the number of rounds to quiescence (round contents are snapshot-determined)', () => {
    const baseline = evaluate(parse(FIB8), FIB8)
    for (const seed of [3, 17, 1234]) {
      const r = evaluate(parse(FIB8), FIB8, { mode: 'shuffle', seed })
      expect(r.rounds.length).toBe(baseline.rounds.length)
    }
  })

  it('CO-2: provenance sets agree per canonical class, premises modulo the renaming bijection', () => {
    // Keep the Evaluators so premises (recorded canonical AT FIRING TIME,
    // some later retired by unions) can be collapsed through each run's
    // FINAL find() — after which every premise is a live final class and the
    // bijection maps it exactly. No placeholder collapse: every premise id
    // is compared for real.
    const mk = (seed: number) => {
      const ev = new Evaluator(parse(FIB6), FIB6, { mode: 'shuffle', seed })
      ev.run()
      return ev
    }
    const evA = mk(2)
    const evB = mk(9)
    const a = evA.result()
    const b = evB.result()
    expect(a.status).toBe('quiescent')
    expect(b.status).toBe('quiescent')
    const bij = classBijection(a, b)
    const bClasses = new Map(finalSnapshot(b).classes.map((c) => [c.id, c]))
    let comparedPremises = 0
    for (const ca of finalSnapshot(a).classes) {
      const cb = bClasses.get(bij.get(ca.id)!)!
      const canonProv = (
        entries: typeof ca.provenance,
        map: (id: number) => number,
      ): string[] =>
        entries
          .map((p) => {
            const mapped = p.premises.map(map)
            comparedPremises += mapped.length
            expect(mapped.every((x) => x >= 0), `unmappable premise in ${p.rule}@${p.round}`).toBe(true)
            return `${p.rule}@${p.round}|${mapped.sort((x, y) => x - y).join(',')}`
          })
          .sort()
      const provA = canonProv(ca.provenance, (id) => bij.get(evA.egraph.find(id)) ?? -1)
      const provB = canonProv(cb.provenance, (id) => evB.egraph.find(id))
      expect(provA, `class ${ca.label}`).toEqual(provB)
    }
    // the oracle must actually be comparing real premises, not empty lists
    expect(comparedPremises).toBeGreaterThan(50)
  })

  it('CO-1.4 / A3.1: budget-exhausted runs compare answers only ("confluent-so-far")', () => {
    const loop = 'def loop(n) = loop(n + 1)\nmain = loop(0)'
    const runs = [1, 2, 3].map((seed) =>
      evaluate(parse(loop), loop, { mode: 'shuffle', seed, maxRounds: 10 }),
    )
    const cmp = compareRuns(runs)
    expect(runs.every((r) => r.status === 'budget-exhausted')).toBe(true)
    expect(cmp.partial).toBe(true)
    expect(cmp.detail).toContain('confluent-so-far')
  })

  it('A3.1 with real literals: exhausted runs that FOUND an answer must agree on it', () => {
    // deadcode with demand off: R-if extracts 1 in round 1, then the dead
    // loop burns the budget — a budget-exhausted run WITH a literal answer.
    const src = 'def loop(n) = loop(n + 1)\nmain = if true then 1 else loop(0)'
    const runs = [4, 5, 6].map((seed) =>
      evaluate(parse(src), src, { mode: 'shuffle', seed, demand: false, maxRounds: 12 }),
    )
    expect(runs.every((r) => r.status === 'budget-exhausted')).toBe(true)
    expect(runs.every((r) => r.extraction.isLiteral && r.extraction.value === 1)).toBe(true)
    const cmp = compareRuns(runs)
    expect(cmp.partial).toBe(true)
    expect(cmp.ok).toBe(true)
    expect(cmp.detail).toContain('3/3 runs found 1')
  })

  it('quiescent runs compare full canonical state via compareRuns', () => {
    const runs = [4, 5, 6].map((seed) => evaluate(parse(FIB6), FIB6, { mode: 'shuffle', seed }))
    const cmp = compareRuns(runs)
    expect(cmp.ok).toBe(true)
    expect(cmp.partial).toBe(false)
  })

  it('A3.3 (chaos, CO-9 stretch): a round-free schedule reaches the same fixpoint as BSP', () => {
    const bsp = evaluate(parse(FIB8), FIB8)
    const chaosRuns = [7, 21].map((seed) =>
      evaluate(parse(FIB8), FIB8, { mode: 'chaos', seed, maxRounds: 200 }),
    )
    for (const chaos of chaosRuns) {
      expect(chaos.status).toBe('quiescent')
      expect(chaos.extraction.value).toBe(21)
      // BSP stamps real round numbers into provenance keys; chaos records
      // provenance round-free (it has no rounds — see scheduler.ts). The
      // cross-FAMILY comparison therefore excludes provenance; the semantic
      // state must be identical.
      expect(runFingerprint(chaos, { includeProvenance: false })).toBe(
        runFingerprint(bsp, { includeProvenance: false }),
      )
    }
    // WITHIN the chaos family provenance is round-free and thus schedule-
    // invariant: two chaos seeds must agree on the FULL state, provenance
    // included.
    expect(runFingerprint(chaosRuns[0])).toBe(runFingerprint(chaosRuns[1]))
  })

  it('chaos budget scales with firings, not rounds: wide programs quiesce under defaults', () => {
    // A balanced 128-leaf sum fires ~127 R-arith instances — BSP does it in
    // ~7 rounds; chaos needs ~127 firings, far more than the old rounds×8
    // budget but comfortably inside rounds×32.
    const balanced = (lo: number, hi: number): string =>
      lo === hi ? String(lo) : `(${balanced(lo, (lo + hi) >> 1)} + ${balanced(((lo + hi) >> 1) + 1, hi)})`
    const src = `main = ${balanced(1, 128)}`
    const expected = (128 * 129) / 2
    const bsp = evaluate(parse(src), src)
    expect(bsp.status).toBe('quiescent')
    expect(bsp.extraction.value).toBe(expected)
    const chaos = evaluate(parse(src), src, { mode: 'chaos', seed: 3 })
    expect(chaos.status).toBe('quiescent')
    expect(chaos.extraction.value).toBe(expected)
  })
})
