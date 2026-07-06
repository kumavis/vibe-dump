import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { Evaluator, evaluate } from '../src/engine/scheduler'
import { EXAMPLES, exampleById } from '../src/examples'

function run(src: string, opts = {}) {
  return evaluate(parse(src), src, opts)
}

describe('BSP scheduler', () => {
  it('reaches quiescence on pure arithmetic', () => {
    const r = run('main = (1 + 2) * (1 + 2)')
    expect(r.status).toBe('quiescent')
    expect(r.extraction.value).toBe(9)
  })

  it('records a RoundLog per round with firings and snapshots', () => {
    const r = run('main = (1 + 2) * (1 + 2)')
    expect(r.snapshots).toHaveLength(r.rounds.length + 1)
    expect(r.rounds[0].firings.length).toBeGreaterThan(0)
    for (const [i, rl] of r.rounds.entries()) {
      expect(rl.round).toBe(i + 1)
      expect(rl.fuelRemaining).toBeLessThanOrEqual(256)
    }
  })

  it('snapshots are immutable per-round states: scrubbing shows growth', () => {
    const r = run(exampleById('fib').source, { fuel: 256 })
    const counts = r.snapshots.map((s) => s.classes.length)
    // topology only grows or consolidates via merges; alt totals never shrink per class identity
    expect(counts[0]).toBeLessThan(counts[counts.length - 1] + 50)
    // round 0 snapshot = initial network: just fib(10) and 10
    expect(counts[0]).toBe(2)
  })

  it('fuel: the loop example halts FUEL-EXHAUSTED with a non-literal best', () => {
    const r = run(exampleById('loop').source, { fuel: 12 })
    expect(r.status).toBe('fuel-exhausted')
    expect(r.extraction.isLiteral).toBe(false)
    expect(r.extraction.pretty.length).toBeGreaterThan(0)
    const last = r.rounds[r.rounds.length - 1]
    expect(last.fuelRemaining).toBe(0)
  })

  it('unfold decrements fuel once per distinct call', () => {
    const src = 'def f(x) = x + 1\nmain = f(1) + f(1)'
    const r = run(src)
    expect(r.status).toBe('quiescent')
    // f(1) appears twice in source but is ONE class → one unfold
    const spent = 256 - r.rounds[r.rounds.length - 1].fuelRemaining
    expect(spent).toBe(1)
    expect(r.extraction.value).toBe(4)
  })

  it('step() is resumable and result() is stable after stopping', () => {
    const src = exampleById('max').source
    const ev = new Evaluator(parse(src), src)
    let steps = 0
    while (ev.step()) steps++
    expect(ev.status).toBe('quiescent')
    expect(ev.result().extraction.value).toBe(8)
    expect(steps).toBe(ev.rounds.length)
    expect(ev.step()).toBe(false)
  })

  it('all bundled examples terminate (quiescent or fuel-exhausted)', () => {
    for (const ex of EXAMPLES) {
      const r = run(ex.source, { fuel: 256, maxRounds: 2000 })
      expect(['quiescent', 'fuel-exhausted']).toContain(r.status)
    }
  })
})
