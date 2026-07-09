/**
 * Part C matrix rows that don't live in the other suites:
 *   row 6  — CO-4 unfold-idempotence (dedupUnfolds on/off → identical fixpoint)
 *   row 10 — CO-7 mutation test (tripwire liveness)
 *   row 11 — CO-8 demand on/off behavioral pair
 */
import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { evaluate } from '../src/engine/scheduler'
import { SoundnessError } from '../src/engine/egraph'
import { runFingerprint } from '../src/engine/fingerprint'
import { referenceEval } from '../src/engine/reference'
import { exampleById } from '../src/examples'

const FIB = (n: number) => `def fib(n) =
  if n < 2 then n
  else fib(n - 1) + fib(n - 2)

main = fib(${n})
`

describe('CO-4: unfold-idempotence — the dedup latch is an optimization, provably', () => {
  it('fib(6) with dedupUnfolds on/off: identical canonical e-graph, extraction, per-round class counts', () => {
    const src = FIB(6)
    const on = evaluate(parse(src), src, { dedupUnfolds: true })
    expect(on.status).toBe('quiescent')
    // With the latch off, unfold "fires" every round forever (each a no-op
    // under idempotent join), so quiescence-by-empty-firing-set never
    // triggers; run for exactly as many rounds as the latched run took and
    // compare fixpoints.
    const off = evaluate(parse(src), src, { dedupUnfolds: false, maxRounds: on.rounds.length })
    expect(off.extraction.value).toBe(on.extraction.value)
    expect(off.classCount).toBe(on.classCount)
    for (let i = 0; i < on.rounds.length; i++) {
      expect(off.rounds[i].classCount, `round ${i + 1}`).toBe(on.rounds[i].classCount)
    }
    // The idempotence argument covers alts/partition/best exactly; those must
    // be identical:
    expect(runFingerprint(off, { includeProvenance: false })).toBe(
      runFingerprint(on, { includeProvenance: false }),
    )
    // Provenance is the honest exception (see the CO-4 comment in rules.ts):
    // a re-fire records a genuinely NEW, TRUE fact (same rule+premises,
    // later round). The compensating assertions: per class (ids coincide —
    // both runs perform identical allocations and only no-op extra unions),
    // (a) non-R-unfold provenance is IDENTICAL, and (b) the latched run's
    // R-unfold facts are a SUBSET of the unlatched run's. Nothing may be
    // lost, reworded, or invented — only repeated firings added.
    const classesOf = (r: typeof on) =>
      new Map(r.snapshots[r.snapshots.length - 1].classes.map((c) => [c.id, c]))
    const provKey = (p: { rule: string; round: number; premises: number[] }) =>
      `${p.rule}@${p.round}|${[...p.premises].sort((x, y) => x - y).join(',')}`
    const onClasses = classesOf(on)
    const offClasses = classesOf(off)
    expect(offClasses.size).toBe(onClasses.size)
    for (const [id, cOn] of onClasses) {
      const cOff = offClasses.get(id)!
      const split = (c: typeof cOn) => ({
        other: c.provenance.filter((p) => p.rule !== 'R-unfold').map(provKey).sort(),
        unfold: new Set(c.provenance.filter((p) => p.rule === 'R-unfold').map(provKey)),
      })
      const a = split(cOn)
      const b = split(cOff)
      expect(a.other, `class ${id} non-unfold provenance`).toEqual(b.other)
      for (const k of a.unfold) {
        expect(b.unfold.has(k), `class ${id} lost unfold fact ${k}`).toBe(true)
      }
    }
  })
})

describe('A2: the R-arith/R-if idempotence skips are optimizations, provably', () => {
  it('fib(6) with the skips disabled: identical semantic fixpoint', () => {
    const src = FIB(6)
    const on = evaluate(parse(src), src)
    expect(on.status).toBe('quiescent')
    // With the skips off, already-satisfied instances keep "firing" (each a
    // semantic no-op), so the run cannot detect quiescence — cap it at the
    // reference run's length and compare fixpoints.
    const off = evaluate(parse(src), src, { _noIdempotenceSkips: true, maxRounds: on.rounds.length })
    expect(off.extraction.value).toBe(on.extraction.value)
    expect(runFingerprint(off, { includeProvenance: false })).toBe(
      runFingerprint(on, { includeProvenance: false }),
    )
  })
})

describe('CO-7: mutation tests — tripwire liveness + differential complementarity', () => {
  it('a mis-targeting R-arith (writes to a premise class) trips the collision assertion on fib(4)', () => {
    // The realistic bug class the tripwire exists for: the rule computes the
    // right value but writes it to the WRONG cell, funneling a second
    // distinct literal into a class that already settled.
    const src = FIB(4)
    expect(() => evaluate(parse(src), src, { _mutation: { mistarget: true } })).toThrow(
      SoundnessError,
    )
  })

  it('a value-corrupting R-arith (+ computed as −) is caught by the differential suite', () => {
    // DELIBERATE DEVIATION from Part C row 10 as written. The contract
    // expects "+ computed as −" to trip the collision assertion on fib(4);
    // it provably cannot: a FUNCTIONAL corruption (same inputs → same wrong
    // output) leaves the system internally consistent — sound w.r.t. the
    // corrupted semantics — so it extracts a wrong answer confluently and no
    // class ever holds two distinct literals. The row's INTENT (tripwire
    // liveness through the rule pipeline) is carried by the mis-targeting
    // mutation above; wrongness-without-inconsistency is exactly what the
    // reference interpreter exists to catch, as this test demonstrates. The
    // two detectors are complementary by design.
    const src = FIB(6)
    const program = parse(src)
    const corrupted = evaluate(program, src, {
      _mutation: {
        compute: (op, a, b) => {
          if (op === '+' && typeof a === 'number' && typeof b === 'number') return a - b
          if (op === '-' && typeof a === 'number' && typeof b === 'number') return a - b
          if (op === '*' && typeof a === 'number' && typeof b === 'number') return a * b
          if (op === '<') return typeof a === 'number' && typeof b === 'number' ? a < b : undefined
          if (op === '<=') return typeof a === 'number' && typeof b === 'number' ? a <= b : undefined
          if (op === '==') return typeof a === typeof b ? a === b : undefined
          return undefined
        },
      },
    })
    const truth = referenceEval(program)
    expect(corrupted.status).toBe('quiescent') // wrong, but confluently wrong
    expect(corrupted.extraction.value).not.toBe(truth) // differential catches it
  })

  it('non-strict mode surfaces the violation instead of throwing (the UI banner path)', () => {
    const src = FIB(4)
    const r = evaluate(parse(src), src, {
      _mutation: { mistarget: true },
      strictSoundness: false,
    })
    expect(r.soundnessViolations.length).toBeGreaterThan(0)
  })
})

describe('CO-8: demand-driven unfolding — behavioral pair', () => {
  it('demand on: dead-branch program quiesces at 1 with ZERO loop unfolds', () => {
    const src = exampleById('deadcode').source
    const r = evaluate(parse(src), src, { demand: true })
    expect(r.status).toBe('quiescent')
    expect(r.extraction.value).toBe(1)
    const loopUnfolds = r.rounds.flatMap((rl) =>
      rl.firings.filter((f) => f.rule === 'R-unfold' && f.detail.startsWith('loop')),
    )
    expect(loopUnfolds).toHaveLength(0)
  })

  it('demand off: same answer, but the run chases the dead loop to BUDGET-EXHAUSTED', () => {
    const src = exampleById('deadcode').source
    const r = evaluate(parse(src), src, { demand: false, maxRounds: 30 })
    expect(r.status).toBe('budget-exhausted')
    expect(r.extraction.value).toBe(1) // the correct answer appeared BEFORE quiescence
    const loopUnfolds = r.rounds.flatMap((rl) =>
      rl.firings.filter((f) => f.rule === 'R-unfold' && f.detail.startsWith('loop')),
    )
    expect(loopUnfolds.length).toBeGreaterThan(0)
  })

  it('fib(10): demand is a no-op on outcomes (no dead code to skip at the value level)', () => {
    const src = FIB(10)
    const on = evaluate(parse(src), src, { demand: true })
    const off = evaluate(parse(src), src, { demand: false, maxRounds: 64 })
    expect(on.status).toBe('quiescent')
    expect(on.extraction.value).toBe(55)
    // Without demand, base-case unfolding speculates into fib(-1), fib(-2), …
    // so the run cannot quiesce — but monotonicity guarantees everything it
    // derived is true, so the extracted answer is identical (A3.1).
    expect(off.extraction.value).toBe(55)
  })

  it('undemanded classes carry empty provenance (the lesson-9 checkpoint fact)', () => {
    const src = exampleById('deadcode').source
    const r = evaluate(parse(src), src)
    const last = r.snapshots[r.snapshots.length - 1]
    const loopClass = last.classes.find((c) => c.alts.some((a) => a.op === 'call' && a.fn === 'loop'))
    expect(loopClass).toBeDefined()
    expect(loopClass!.demanded).toBe(false)
    expect(loopClass!.provenance).toHaveLength(0)
  })
})
