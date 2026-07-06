import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { compileProgram, CompileError } from '../src/engine/compile'
import { computeDemand, ruleArith, ruleUnfold, computeBinOp } from '../src/engine/rules'
import { Evaluator } from '../src/engine/scheduler'

function compiled(src: string) {
  return compileProgram(parse(src), src)
}

describe('compile', () => {
  it('interns main bottom-up with hash-consing', () => {
    const { egraph } = compiled('main = (1 + 2) * (1 + 2)')
    // classes: 1, 2, (1+2), (*) — the two (1+2) share one class
    expect(egraph.classCount()).toBe(4)
  })

  it('does not intern def bodies at compile time', () => {
    const { egraph } = compiled('def f(x) = x + x + x + x\nmain = 1')
    expect(egraph.classCount()).toBe(1)
  })

  it('rejects unknown functions, arity mismatches and unbound vars', () => {
    expect(() => compiled('main = f(1)')).toThrow(CompileError)
    expect(() => compiled('def f(x) = x\nmain = f(1, 2)')).toThrow(CompileError)
    expect(() => compiled('def f(x) = y\nmain = f(1)')).toThrow(CompileError)
    expect(() => compiled('main = x')).toThrow(CompileError)
  })
})

describe('R-arith', () => {
  it('computes over lit alternatives and skips already-known results', () => {
    const { egraph } = compiled('main = 1 + 2')
    const deltas = ruleArith(egraph)
    expect(deltas).toHaveLength(1)
    expect(deltas[0]).toMatchObject({ type: 'addAlt', node: { op: 'lit', value: 3 } })
    // apply, then the rule must be disabled (idempotence at the rule level)
    const d = deltas[0]
    if (d.type !== 'addAlt') throw new Error('bad delta')
    egraph.addAlt(d.classId, d.node, d.rule, 1, d.detail)
    egraph.rebuild(1)
    expect(ruleArith(egraph)).toHaveLength(0)
  })

  it('computeBinOp handles comparisons and type guards', () => {
    expect(computeBinOp('<', 1, 2)).toBe(true)
    expect(computeBinOp('<=', 2, 2)).toBe(true)
    expect(computeBinOp('==', true, true)).toBe(true)
    expect(computeBinOp('==', true, 1)).toBeUndefined()
    expect(computeBinOp('+', true, 1)).toBeUndefined()
  })
})

describe('R-if', () => {
  it('unions the if class with the taken branch; if-node remains an alternative', () => {
    const src = 'main = if 1 < 2 then 10 else 20'
    const { egraph, rootId } = compiled(src)
    // saturate the condition first
    const ev = new Evaluator(parse(src), src)
    ev.run()
    const eg = ev.egraph
    const root = eg.find(ev.rootId)
    const alts = [...eg.getCell(root).alts.values()]
    // class contains BOTH the if node and the literal 10 (branch absorbed)
    expect(alts.some((n) => n.op === 'if')).toBe(true)
    expect(alts.some((n) => n.op === 'lit' && n.value === 10)).toBe(true)
    expect(eg.litOf(root)).toBe(10)
    void egraph
    void rootId
  })

  it('is a union, not a replacement: untaken branch stays a separate class', () => {
    const src = 'main = if 1 < 2 then 10 else 20'
    const ev = new Evaluator(parse(src), src)
    ev.run()
    const eg = ev.egraph
    const root = eg.find(ev.rootId)
    // 20's class must not have merged with the root
    const twenty = eg.add({ op: 'lit', value: 20 })
    expect(eg.find(twenty)).not.toBe(root)
  })
})

describe('R-unfold', () => {
  it('is gated call-by-value: only fires when every arg class has a lit', () => {
    const src = 'def f(x) = x + 1\nmain = f(2 * 3)'
    const { egraph, defs, rootId } = compiled(src)
    // 2*3 has no lit alternative yet — unfold must NOT fire
    const demand = () => computeDemand(egraph, rootId)
    expect(ruleUnfold(egraph, defs, new Set(), demand())).toHaveLength(0)
    // after arith computes 6, it fires
    const [d] = ruleArith(egraph)
    if (d.type !== 'addAlt') throw new Error('bad delta')
    egraph.addAlt(d.classId, d.node, d.rule, 1, d.detail)
    egraph.rebuild(1)
    const unfolds = ruleUnfold(egraph, defs, new Set(), demand())
    expect(unfolds).toHaveLength(1)
    expect(unfolds[0]).toMatchObject({ type: 'unfold', fn: 'f' })
  })

  it('respects the unfolded mark (fires once per canonical call node)', () => {
    const src = 'def f(x) = x + 1\nmain = f(2)'
    const { egraph, defs, rootId } = compiled(src)
    const demanded = computeDemand(egraph, rootId)
    const [d] = ruleUnfold(egraph, defs, new Set(), demanded)
    if (d.type !== 'unfold') throw new Error('bad delta')
    expect(ruleUnfold(egraph, defs, new Set([d.nodeKey]), demanded)).toHaveLength(0)
  })
})

describe('snapshot semantics (BSP honesty)', () => {
  it('rules collected in a round all read the start-of-round state', () => {
    // In `main = (1 + 2) + (3 + 4)`, only the two inner sums are enabled in
    // round 1 — the outer sum sees no lits yet and fires in round 2.
    const src = 'main = (1 + 2) + (3 + 4)'
    const ev = new Evaluator(parse(src), src)
    ev.step()
    expect(ev.rounds[0].firings.filter((f) => f.rule === 'R-arith')).toHaveLength(2)
    ev.step()
    expect(ev.rounds[1].firings.filter((f) => f.rule === 'R-arith')).toHaveLength(1)
    ev.run()
    expect(ev.result().extraction.value).toBe(10)
  })
})
