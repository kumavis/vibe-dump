/**
 * The propagator rules (stratum S0). Each rule reads ONLY the snapshot at the
 * start of a round (the scheduler enumerates nodes before applying anything)
 * and emits Deltas. All rules are monotone: classes only gain alternatives,
 * classes only merge.
 */
import type { Def } from '../lang/ast'
import { type BinOp, type EClassId, EGraph, type ENode, type Value, nodeKeyOf } from './egraph'

export type Delta =
  | { type: 'addAlt'; classId: EClassId; node: ENode; rule: string; detail: string; reads: EClassId[] }
  | { type: 'union'; a: EClassId; b: EClassId; rule: string; detail: string; reads: EClassId[] }
  | {
      /** Topology request: instantiate a def body (AllocClass) + union with the call class. */
      type: 'unfold'
      callClass: EClassId
      nodeKey: string
      fn: string
      argClasses: EClassId[]
      rule: string
      detail: string
      reads: EClassId[]
    }

export function computeBinOp(op: BinOp, a: Value, b: Value): Value | undefined {
  if (op === '==') {
    return typeof a === typeof b ? a === b : undefined
  }
  if (typeof a !== 'number' || typeof b !== 'number') return undefined
  switch (op) {
    case '+':
      return a + b
    case '-':
      return a - b
    case '*':
      return a * b
    case '<':
      return a < b
    case '<=':
      return a <= b
  }
}

const BIN_OPS: ReadonlySet<string> = new Set(['+', '-', '*', '<', '<=', '=='])

export function litLabel(v: Value): string {
  return String(v)
}

/**
 * R-arith: for any e-node (op a b) where both argument classes contain a lit,
 * add the computed lit as a new alternative of the parent class.
 */
export function ruleArith(egraph: EGraph): Delta[] {
  const deltas: Delta[] = []
  for (const { classId, node } of egraph.allNodes()) {
    if (node.op === 'lit' || node.op === 'if' || node.op === 'call') continue
    if (!BIN_OPS.has(node.op)) continue
    const [a, b] = node.args
    const va = egraph.litOf(a)
    const vb = egraph.litOf(b)
    if (va === undefined || vb === undefined) continue
    const result = computeBinOp(node.op, va, vb)
    if (result === undefined) continue
    const litNode: ENode = { op: 'lit', value: result }
    if (egraph.hasAlt(classId, nodeKeyOf(litNode))) continue // already known
    deltas.push({
      type: 'addAlt',
      classId,
      node: litNode,
      rule: 'R-arith',
      detail: `${litLabel(va)} ${node.op} ${litLabel(vb)} → ${litLabel(result)}`,
      reads: [egraph.find(a), egraph.find(b)],
    })
  }
  return deltas
}

/**
 * R-if (ι): if the condition class contains lit true (resp. false), UNION the
 * if-class with the then (resp. else) class. Not a replacement — the if-node
 * stays as an alternative; the class simply absorbs the chosen branch.
 */
export function ruleIf(egraph: EGraph): Delta[] {
  const deltas: Delta[] = []
  for (const { classId, node } of egraph.allNodes()) {
    if (node.op !== 'if') continue
    const [c, t, e] = node.args
    const v = egraph.litOf(c)
    if (typeof v !== 'boolean') continue
    const target = v ? t : e
    if (egraph.find(classId) === egraph.find(target)) continue // already merged
    deltas.push({
      type: 'union',
      a: classId,
      b: target,
      rule: 'R-if',
      detail: `condition is ${v} → absorb ${v ? 'then' : 'else'} branch`,
      reads: [egraph.find(c)],
    })
  }
  return deltas
}

/**
 * Demand: the set of classes the program still needs, computed against the
 * round snapshot. Walk from the root through every alternative's children —
 * EXCEPT that an if-node whose condition class already holds a boolean lit
 * only exposes its condition and its taken branch. Without this, unfolding a
 * recursive body would eagerly instantiate the untaken base/recursive branch
 * too (fib(1) would demand fib(0) and fib(-1), forever).
 */
export function computeDemand(egraph: EGraph, rootId: EClassId): Set<EClassId> {
  const demanded = new Set<EClassId>()
  const stack = [egraph.find(rootId)]
  while (stack.length > 0) {
    const id = egraph.find(stack.pop()!)
    if (demanded.has(id)) continue
    demanded.add(id)
    for (const node of egraph.getCell(id).alts.values()) {
      if (node.op === 'lit') continue
      if (node.op === 'if') {
        const [c, t, e] = node.args
        const v = egraph.litOf(c)
        stack.push(c)
        if (v === true) stack.push(t)
        else if (v === false) stack.push(e)
        else {
          stack.push(t)
          stack.push(e)
        }
        continue
      }
      for (const child of node.args) stack.push(child)
    }
  }
  return demanded
}

/**
 * R-unfold (δ + β, guarded): a call whose argument classes ALL contain a lit
 * (the call-by-value guard) and which the program still demands (see
 * computeDemand — together these make fib terminate) gets its def body
 * instantiated and unioned in, unless already unfolded. The actual interning
 * happens in the scheduler's topology phase; the rule only emits the
 * request, keeping the read phase pure.
 */
export function ruleUnfold(
  egraph: EGraph,
  defs: Map<string, Def>,
  unfolded: ReadonlySet<string>,
  demanded: ReadonlySet<EClassId>,
): Delta[] {
  const deltas: Delta[] = []
  const requested = new Set<string>()
  for (const { classId, node, key } of egraph.allNodes()) {
    if (node.op !== 'call') continue
    if (!demanded.has(egraph.find(classId))) continue
    if (unfolded.has(key) || requested.has(key)) continue
    const def = defs.get(node.fn)
    if (!def) continue
    const argLits = node.args.map((a) => egraph.litOf(a))
    if (argLits.some((v) => v === undefined)) continue // CBV guard
    requested.add(key)
    deltas.push({
      type: 'unfold',
      callClass: classId,
      nodeKey: key,
      fn: node.fn,
      argClasses: node.args.map((a) => egraph.find(a)),
      rule: 'R-unfold',
      detail: `${node.fn}(${argLits.map((v) => litLabel(v as Value)).join(', ')})`,
      reads: node.args.map((a) => egraph.find(a)),
    })
  }
  return deltas
}
