/**
 * The propagator rules (stratum S0).
 *
 * ## INV-SOUND (A4)
 *
 * > At every point in execution, every alternative (e-node) within a single
 * > e-class denotes the same value under mewlang's reference semantics
 * > (standard call-by-value denotation of the first-order language, with ⊥
 * > for nontermination). See engine/reference.ts for the executable form.
 *
 * Per-rule preservation argument:
 * - **R-arith** by computation: if class a contains `lit 3` and class b
 *   contains `lit 4`, the class holding `a + b` truly equals `lit 7`.
 * - **R-unfold** by definition: `f(args) = body[params := args]` is the
 *   meaning of `def`; substituting *classes* for parameters is sound because
 *   a class stands for its shared value, and the language is first-order so
 *   there is no variable capture.
 * - **R-if** by the conditional law: `c ≡ true ⊢ if c t e ≡ t`.
 * - **R-congruence** trivially: equal children ⟹ equal applications.
 * - **R-demand** adds no equalities at all — it only extends a grow-only set
 *   that other rules use as a *restriction* on firing.
 *
 * Guards (the CBV guard, the demand guard, the dedup latch) only ever
 * RESTRICT firing; per A4 a restriction affects which true equalities get
 * derived (completeness/termination), never whether a derived equality is
 * true. Weakening a guard is a termination question; strengthening one is
 * always soundness-safe.
 *
 * Discipline (A2): every rule reads ONLY the start-of-round snapshot (the
 * scheduler enumerates state before applying anything) and emits Deltas.
 * Rules read the e-graph and the demand lattice — nothing else: no budgets,
 * no rounds, no RNG, no clock (A6). All rules are monotone: classes only
 * gain alternatives, classes only merge, demand only grows.
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
 * Test-only injection point for the CO-7 mutation test. `compute` replaces
 * the arithmetic; `mistarget` makes the rule write its result to the first
 * PREMISE class instead of the parent — simulating the "wrote to the wrong
 * cell" bug class that the literal-collision tripwire exists to catch.
 */
export interface ArithMutation {
  compute?: typeof computeBinOp
  mistarget?: boolean
}

/**
 * R-arith: for any e-node (op a b) where both argument classes contain a lit,
 * add the computed lit as a new alternative of the parent class.
 *
 * The `hasAlt` skip below is a NEGATIVE condition used as an optimization,
 * justified per A2's idempotence escape hatch: re-firing would re-intern the
 * same literal and re-union it into the same class — all no-ops under the
 * idempotent join — so the fixpoint is identical with the skip removed; it
 * only saves work (and lets quiescence be detected by an empty firing set).
 * Per A2 the justification carries a disable switch and a test: pass
 * `skips: false` to remove the guard; the semantic fixpoint must not change
 * (tests/contract.test.ts, idempotence-skips suite).
 */
export function ruleArith(egraph: EGraph, mutation?: ArithMutation, skips = true): Delta[] {
  const compute = mutation?.compute ?? computeBinOp
  const deltas: Delta[] = []
  for (const { classId, node } of egraph.allNodes()) {
    if (node.op === 'lit' || node.op === 'if' || node.op === 'call') continue
    if (!BIN_OPS.has(node.op)) continue
    const [a, b] = node.args
    const va = egraph.litOf(a)
    const vb = egraph.litOf(b)
    if (va === undefined || vb === undefined) continue
    const result = compute(node.op, va, vb)
    if (result === undefined) continue
    const litNode: ENode = { op: 'lit', value: result }
    const target = mutation?.mistarget ? egraph.find(a) : classId
    if (skips && egraph.hasAlt(target, nodeKeyOf(litNode))) continue // idempotence skip (see above)
    deltas.push({
      type: 'addAlt',
      classId: target,
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
 * (The find-equality skip is the same idempotence-justified optimization as
 * R-arith's: a repeated union of already-merged classes is a no-op. Same
 * A2 discipline: disable with `skips: false`; tested in contract.test.ts.)
 */
export function ruleIf(egraph: EGraph, skips = true): Delta[] {
  const deltas: Delta[] = []
  for (const { classId, node } of egraph.allNodes()) {
    if (node.op !== 'if') continue
    const [c, t, e] = node.args
    const v = egraph.litOf(c)
    if (typeof v !== 'boolean') continue
    const target = v ? t : e
    if (skips && egraph.find(classId) === egraph.find(target)) continue // idempotence skip
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
 * R-demand (CO-8): `demanded` is a grow-only set of class ids seeded with the
 * root of `main` — a per-class monotone latch (join = OR). All triggers are
 * POSITIVE (A2): a demanded class containing an arithmetic node demands its
 * children; containing a call demands the argument classes; containing
 * `if c t e` demands `c`, and — only once `c`'s class CONTAINS `lit true` —
 * demands `t` (symmetrically `lit false` → `e`). We never "demand the branch
 * whose condition is absent": before the condition resolves, neither branch
 * is demanded, and that is the point. Demand facts derive positively from
 * presence of information, so the set only ever grows (the scheduler asserts
 * this). Like congruence repair, the closure runs to fixpoint over the
 * start-of-round snapshot — it is a function of the snapshot, so round
 * contents remain deterministic.
 */
export function ruleDemand(egraph: EGraph, rootId: EClassId): Set<EClassId> {
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
        continue
      }
      for (const child of node.args) stack.push(child)
    }
  }
  return demanded
}

/**
 * R-unfold (δ + β, guarded): fires for a call node when
 *   1. every argument class contains a literal (the CBV guard),
 *   2. the call's class is demanded (CO-8) — pass `null` to disable
 *      demand-driven mode (the lesson-9 engine flag), and
 *   3. (optimization) the call has not been unfolded before.
 * Guards 1–2 restrict firing only, so they are soundness-safe (A4).
 *
 * Guard 3 is CO-4's dedup latch — a NEGATIVE condition, admissible only via
 * A2's idempotence escape hatch: *R-unfold is idempotent — re-firing
 * re-interns the identical body through the hashcons (returning the existing
 * classes) and re-emits the same Union, all no-ops under idempotent join —
 * so the ALTS/PARTITION/BEST fixpoint is identical with the guard removed;
 * the mark only saves work.* Two honest qualifications to that argument:
 * (1) provenance: a re-fire at a later round records a genuinely NEW
 *     provenance fact (keys carry the round), so the guard-off run's
 *     provenance is a SUPERSET of the guard-on run's — every extra entry is
 *     a true statement about a firing that happened; the semantic content
 *     (alts, partition, best, extraction) is untouched. The CO-4 test
 *     asserts exactly this: identical semantic fingerprint + provenance
 *     superset with non-R-unfold provenance identical.
 * (2) quiescence DETECTION: with the latch off, the enabled set never
 *     empties (each re-fire is a semantic no-op but still "enabled"), so
 *     the guard-off run never reports quiescent — the latch is also what
 *     lets an empty firing set signal the fixpoint. Operational, not
 *     semantic.
 * Note the core argument requires CO-1: with per-firing fuel, a re-fire
 * would have double-spent budget and the guard WOULD have been semantic.
 * The `dedupUnfolds` engine flag disables the latch for the test.
 *
 * The instantiation itself happens in the scheduler's topology phase; the
 * rule only emits the request, keeping the read phase pure.
 */
export function ruleUnfold(
  egraph: EGraph,
  defs: Map<string, Def>,
  unfolded: ReadonlySet<string> | null,
  demanded: ReadonlySet<EClassId> | null,
): Delta[] {
  const deltas: Delta[] = []
  const requested = new Set<string>()
  for (const { classId, node, key } of egraph.allNodes()) {
    if (node.op !== 'call') continue
    if (demanded !== null && !demanded.has(egraph.find(classId))) continue
    if ((unfolded !== null && unfolded.has(key)) || requested.has(key)) continue
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
