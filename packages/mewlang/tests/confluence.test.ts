import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { evaluate } from '../src/engine/scheduler'
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
    const a = evaluate(parse(FIB6), FIB6, { mode: 'shuffle', seed: 2 })
    const b = evaluate(parse(FIB6), FIB6, { mode: 'shuffle', seed: 9 })
    expect(a.status).toBe('quiescent')
    expect(b.status).toBe('quiescent')
    const bij = classBijection(a, b)
    const bClasses = new Map(finalSnapshot(b).classes.map((c) => [c.id, c]))
    for (const ca of finalSnapshot(a).classes) {
      const cb = bClasses.get(bij.get(ca.id)!)!
      // Map run-A premises through (final find is already applied in ids
      // recorded per firing round; collapse both through the bijection).
      const canonProv = (
        entries: typeof ca.provenance,
        map: (id: number) => number,
      ): string[] =>
        entries
          .map(
            (p) =>
              `${p.rule}@${p.round}|${p.premises
                .map(map)
                .sort((x, y) => x - y)
                .join(',')}`,
          )
          .sort()
      // premises were recorded at firing time; both runs' ids map into run-B
      // space: A's ids through the bijection where defined, B's identically.
      const mapA = (id: number): number => bij.get(id) ?? -1
      const provA = canonProv(ca.provenance, mapA)
      const provB = canonProv(cb.provenance, (id) => id)
      // Premises that were retired mid-run don't appear as final classes and
      // map to -1 on the A side; apply the same collapse on the B side by
      // replacing unknown ids with -1.
      const known = new Set(bClasses.keys())
      const provBAligned = canonProv(cb.provenance, (id) => (known.has(id) ? id : -1))
      const provAAligned = canonProv(ca.provenance, (id) => {
        const m = bij.get(id)
        return m !== undefined && known.has(m) ? m : -1
      })
      expect(provAAligned, `class ${ca.label}`).toEqual(provBAligned)
      void provA
      void provB
    }
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

  it('quiescent runs compare full canonical state via compareRuns', () => {
    const runs = [4, 5, 6].map((seed) => evaluate(parse(FIB6), FIB6, { mode: 'shuffle', seed }))
    const cmp = compareRuns(runs)
    expect(cmp.ok).toBe(true)
    expect(cmp.partial).toBe(false)
  })

  it('A3.3 (chaos, CO-9 stretch): a round-free schedule reaches the same fixpoint as BSP', () => {
    const bsp = evaluate(parse(FIB8), FIB8)
    for (const seed of [7, 21]) {
      const chaos = evaluate(parse(FIB8), FIB8, { mode: 'chaos', seed, maxRounds: 200 })
      expect(chaos.status).toBe('quiescent')
      expect(chaos.extraction.value).toBe(21)
      // Round numbering differs by construction (one firing per entry), so
      // provenance — whose keys carry round numbers — is excluded from
      // cross-scheduler comparison; the semantic state must be identical.
      expect(runFingerprint(chaos, { includeProvenance: false })).toBe(
        runFingerprint(bsp, { includeProvenance: false }),
      )
    }
  })
})
