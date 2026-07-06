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
      expect(rl.classCount).toBeGreaterThan(0)
    }
  })

  it('snapshots are immutable per-round states: round 0 = initial network', () => {
    const r = run(exampleById('fib').source)
    expect(r.snapshots[0].classes.length).toBe(2) // fib(10) and 10
  })

  it('CO-1: loop halts BUDGET-EXHAUSTED at exactly maxRounds, deterministically', () => {
    for (const maxRounds of [12, 64]) {
      const a = run(exampleById('loop').source, { maxRounds })
      const b = run(exampleById('loop').source, { maxRounds })
      expect(a.status).toBe('budget-exhausted')
      expect(a.rounds.length).toBe(maxRounds)
      expect(b.rounds.length).toBe(maxRounds)
      expect(a.extraction.isLiteral).toBe(false)
      expect(a.extraction.pretty).toBe(b.extraction.pretty)
    }
  })

  it('CO-1: maxClasses stops the run between rounds', () => {
    const r = run(exampleById('loop').source, { maxClasses: 20 })
    expect(r.status).toBe('budget-exhausted')
    expect(r.classCount).toBeGreaterThan(20) // exceeded, then stopped before next round
  })

  it('CO-1: budget truncates the round sequence but never alters round contents', () => {
    const src = 'def f(x) = x * 2 + 1\nmain = f(1) + f(2) + f(3) + f(4)'
    const full = run(src, { maxClasses: 2000 })
    const tight = run(src, { maxClasses: 12 })
    expect(full.status).toBe('quiescent')
    expect(tight.status).toBe('budget-exhausted')
    // every executed round of the tight run is identical to the full run's
    // prefix — all enabled firings fired, never a subset
    for (let i = 0; i < tight.rounds.length; i++) {
      const a = tight.rounds[i].firings.map((f) => `${f.rule}|${f.detail}`).sort()
      const b = full.rounds[i].firings.map((f) => `${f.rule}|${f.detail}`).sort()
      expect(a).toEqual(b)
    }
  })

  it('unfold fires once per distinct call (hash-consed duplicates share one unfold)', () => {
    const src = 'def f(x) = x + 1\nmain = f(1) + f(1)'
    const r = run(src)
    expect(r.status).toBe('quiescent')
    const unfolds = r.rounds.flatMap((rl) => rl.firings.filter((f) => f.rule === 'R-unfold'))
    expect(unfolds).toHaveLength(1)
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

  it('all bundled examples terminate (quiescent or budget-exhausted)', () => {
    for (const ex of EXAMPLES) {
      const r = run(ex.source, { maxRounds: 64 })
      expect(['quiescent', 'budget-exhausted']).toContain(r.status)
    }
  })

  it('records the demand wavefront and cost tightenings per round', () => {
    const r = run(exampleById('fib').source)
    const allNewlyDemanded = r.rounds.flatMap((rl) => rl.newlyDemanded)
    expect(allNewlyDemanded.length).toBeGreaterThan(0)
    const allTightened = r.rounds.flatMap((rl) => rl.tightened)
    expect(allTightened.length).toBeGreaterThan(0)
  })
})

describe('chaos mode (CO-9 stretch): no rounds at all', () => {
  it('one firing per RoundLog entry; reaches the same answer as BSP', () => {
    const src = exampleById('max').source
    const bsp = run(src)
    const chaos = run(src, { mode: 'chaos', seed: 5 })
    expect(chaos.status).toBe('quiescent')
    expect(chaos.extraction.value).toBe(bsp.extraction.value)
    for (const rl of chaos.rounds) {
      expect(rl.firings.filter((f) => f.rule !== 'R-congruence').length).toBeLessThanOrEqual(1)
    }
  })
})
