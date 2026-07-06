import { describe, expect, it } from 'vitest'
import { parse } from '../src/lang/parser'
import { compileProgram, CompileError } from '../src/engine/compile'
import { computeBinOp, ruleArith, ruleDemand, ruleUnfold } from '../src/engine/rules'
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

  it('compile-time interning records no provenance (round 0 is topology, not a firing)', () => {
    const { egraph, rootId } = compiled('main = (1 + 2) * 3')
    for (const id of egraph.classIds()) {
      expect(egraph.getCell(id).provenance.size).toBe(0)
    }
    void rootId
  })

  it('rejects unknown functions, arity mismatches and unbound vars', () => {
    expect(() => compiled('main = f(1)')).toThrow(CompileError)
    expect(() => compiled('def f(x) = x\nmain = f(1, 2)')).toThrow(CompileError)
    expect(() => compiled('def f(x) = y\nmain = f(1)')).toThrow(CompileError)
    expect(() => compiled('main = x')).toThrow(CompileError)
  })
})

describe('R-arith', () => {
  it('computes over lit alternatives and skips already-known results (idempotence skip)', () => {
    const { egraph } = compiled('main = 1 + 2')
    const deltas = ruleArith(egraph)
    expect(deltas).toHaveLength(1)
    expect(deltas[0]).toMatchObject({ type: 'addAlt', node: { op: 'lit', value: 3 } })
    const d = deltas[0]
    if (d.type !== 'addAlt') throw new Error('bad delta')
    egraph.addAlt(d.classId, d.node, { rule: d.rule, round: 1, premises: d.reads, detail: d.detail })
    egraph.rebuild()
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
    const ev = new Evaluator(parse(src), src)
    ev.run()
    const eg = ev.egraph
    const root = eg.find(ev.rootId)
    const alts = [...eg.getCell(root).alts.values()]
    // class contains BOTH the if node and the literal 10 (branch absorbed)
    expect(alts.some((n) => n.op === 'if')).toBe(true)
    expect(alts.some((n) => n.op === 'lit' && n.value === 10)).toBe(true)
    expect(eg.litOf(root)).toBe(10)
  })

  it('is a union, not a replacement: untaken branch stays a separate class', () => {
    const src = 'main = if 1 < 2 then 10 else 20'
    const ev = new Evaluator(parse(src), src)
    ev.run()
    const eg = ev.egraph
    const root = eg.find(ev.rootId)
    const twenty = eg.add({ op: 'lit', value: 20 })
    expect(eg.find(twenty)).not.toBe(root)
  })
})

describe('R-demand (CO-8)', () => {
  it('an undecided if demands only its condition — neither branch', () => {
    const src = 'def f(x) = x\nmain = if f(1) == 1 then 10 * 10 else 20 * 20'
    const { egraph, rootId } = compiled(src)
    const demanded = ruleDemand(egraph, rootId)
    // find the branch classes: 10*10 and 20*20
    let thenClass = -1
    let elseClass = -1
    let condClass = -1
    for (const { node } of egraph.allNodes()) {
      if (node.op === 'if') {
        condClass = egraph.find(node.args[0])
        thenClass = egraph.find(node.args[1])
        elseClass = egraph.find(node.args[2])
      }
    }
    expect(demanded.has(condClass)).toBe(true)
    expect(demanded.has(thenClass)).toBe(false)
    expect(demanded.has(elseClass)).toBe(false)
  })

  it('a decided if demands its taken branch only', () => {
    const src = 'main = if true then 10 * 10 else 20 * 20'
    const { egraph, rootId } = compiled(src)
    const demanded = ruleDemand(egraph, rootId)
    let thenClass = -1
    let elseClass = -1
    for (const { node } of egraph.allNodes()) {
      if (node.op === 'if') {
        thenClass = egraph.find(node.args[1])
        elseClass = egraph.find(node.args[2])
      }
    }
    expect(demanded.has(thenClass)).toBe(true)
    expect(demanded.has(elseClass)).toBe(false)
  })
})

describe('R-unfold', () => {
  it('is gated call-by-value: only fires when every arg class has a lit', () => {
    const src = 'def f(x) = x + 1\nmain = f(2 * 3)'
    const { egraph, defs, rootId } = compiled(src)
    const demand = () => ruleDemand(egraph, rootId)
    // 2*3 has no lit alternative yet — unfold must NOT fire
    expect(ruleUnfold(egraph, defs, new Set(), demand())).toHaveLength(0)
    // after arith computes 6, it fires
    const [d] = ruleArith(egraph)
    if (d.type !== 'addAlt') throw new Error('bad delta')
    egraph.addAlt(d.classId, d.node, { rule: d.rule, round: 1, premises: d.reads, detail: d.detail })
    egraph.rebuild()
    const unfolds = ruleUnfold(egraph, defs, new Set(), demand())
    expect(unfolds).toHaveLength(1)
    expect(unfolds[0]).toMatchObject({ type: 'unfold', fn: 'f' })
  })

  it('is gated by demand: an undemanded call never unfolds', () => {
    const src = 'def f(x) = x + 1\nmain = if true then 1 else f(2)'
    const { egraph, defs, rootId } = compiled(src)
    const demanded = ruleDemand(egraph, rootId)
    expect(ruleUnfold(egraph, defs, new Set(), demanded)).toHaveLength(0)
    // with demand disabled (null), the CBV guard alone lets it fire
    expect(ruleUnfold(egraph, defs, new Set(), null)).toHaveLength(1)
  })

  it('respects the dedup latch (fires once per canonical call node)', () => {
    const src = 'def f(x) = x + 1\nmain = f(2)'
    const { egraph, defs, rootId } = compiled(src)
    const demanded = ruleDemand(egraph, rootId)
    const [d] = ruleUnfold(egraph, defs, new Set(), demanded)
    if (d.type !== 'unfold') throw new Error('bad delta')
    expect(ruleUnfold(egraph, defs, new Set([d.nodeKey]), demanded)).toHaveLength(0)
    // latch disabled (null): re-fires freely — CO-4's idempotence escape hatch
    expect(ruleUnfold(egraph, defs, null, demanded)).toHaveLength(1)
  })
})

describe('snapshot semantics (BSP honesty, A2)', () => {
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
