/**
 * CO-7: the reference interpreter — direct recursive call-by-value
 * evaluation, the ground truth for differential testing. Headless, tiny,
 * boring on purpose. Shares `computeBinOp` (the pure arithmetic) with the
 * rules; the mutation-test injection point in ruleArith does NOT reach here,
 * which is what makes differential testing meaningful.
 */
import type { Expr, Program } from '../lang/ast'
import type { Value } from './egraph'
import { computeBinOp } from './rules'

export class ReferenceLimitError extends Error {}

export function referenceEval(program: Program, stepLimit = 1_000_000): Value {
  const defs = new Map(program.defs.map((d) => [d.name, d]))
  let steps = 0
  const go = (e: Expr, env: Map<string, Value>): Value => {
    if (++steps > stepLimit) throw new ReferenceLimitError('reference interpreter: step limit')
    switch (e.kind) {
      case 'lit':
        return e.value
      case 'var':
        return env.get(e.name)!
      case 'binop': {
        const v = computeBinOp(e.op, go(e.lhs, env), go(e.rhs, env))
        if (v === undefined) throw new Error(`reference: type error at ${e.op}`)
        return v
      }
      case 'if': {
        const c = go(e.cond, env)
        if (typeof c !== 'boolean') throw new Error('reference: non-boolean condition')
        return c ? go(e.then, env) : go(e.else, env)
      }
      case 'call': {
        const def = defs.get(e.fn)!
        const inner = new Map<string, Value>()
        def.params.forEach((p, i) => inner.set(p, go(e.args[i], env)))
        return go(def.body, inner)
      }
    }
  }
  return go(program.main, new Map())
}
