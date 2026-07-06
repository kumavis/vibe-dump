/**
 * Compilation: program → initial propagator network.
 *
 * The `main` expression is interned bottom-up through the hashcons, producing
 * one e-class per distinct subterm. Function definitions are NOT interned —
 * they are stored as templates and instantiated by R-unfold at saturation
 * time (that instantiation reuses the same `internExpr`, with parameters
 * bound to argument classes).
 */
import type { Def, Expr, Program } from '../lang/ast'
import type { Span } from '../lang/span'
import { caretSnippet, lineCol } from '../lang/span'
import { EGraph, type EClassId, type EGraphOptions, type ProvenanceEntry } from './egraph'

export class CompileError extends Error {
  constructor(
    message: string,
    public span: Span,
    source: string,
  ) {
    const { line, col } = lineCol(source, span.start)
    super(`${message} (line ${line}, col ${col})\n${caretSnippet(source, span)}`)
    this.name = 'CompileError'
  }
}

export interface Compiled {
  egraph: EGraph
  rootId: EClassId
  defs: Map<string, Def>
}

/** Static checks: every call targets a known def with the right arity; every var is bound. */
function checkExpr(expr: Expr, bound: Set<string>, defs: Map<string, Def>, source: string): void {
  switch (expr.kind) {
    case 'lit':
      return
    case 'var':
      if (!bound.has(expr.name)) {
        throw new CompileError(`unbound variable '${expr.name}'`, expr.span, source)
      }
      return
    case 'binop':
      checkExpr(expr.lhs, bound, defs, source)
      checkExpr(expr.rhs, bound, defs, source)
      return
    case 'if':
      checkExpr(expr.cond, bound, defs, source)
      checkExpr(expr.then, bound, defs, source)
      checkExpr(expr.else, bound, defs, source)
      return
    case 'call': {
      const def = defs.get(expr.fn)
      if (!def) throw new CompileError(`unknown function '${expr.fn}'`, expr.span, source)
      if (def.params.length !== expr.args.length) {
        throw new CompileError(
          `'${expr.fn}' takes ${def.params.length} argument(s), got ${expr.args.length}`,
          expr.span,
          source,
        )
      }
      for (const a of expr.args) checkExpr(a, bound, defs, source)
      return
    }
  }
}

/**
 * Intern an expression bottom-up through the hashcons. `env` maps variable
 * names to the e-classes standing in for them (empty for `main`; parameters →
 * argument classes when R-unfold instantiates a def body).
 */
export function internExpr(
  egraph: EGraph,
  expr: Expr,
  env: Map<string, EClassId>,
  prov?: ProvenanceEntry,
): EClassId {
  switch (expr.kind) {
    case 'lit':
      return egraph.add({ op: 'lit', value: expr.value }, [expr.span], prov)
    case 'var': {
      const id = env.get(expr.name)
      if (id === undefined) throw new Error(`internal: unbound var ${expr.name}`)
      // The parameter-use span maps onto the argument class.
      egraph.addSpans(id, [expr.span])
      return id
    }
    case 'binop': {
      const lhs = internExpr(egraph, expr.lhs, env, prov)
      const rhs = internExpr(egraph, expr.rhs, env, prov)
      return egraph.add({ op: expr.op, args: [lhs, rhs] }, [expr.span], prov)
    }
    case 'if': {
      const c = internExpr(egraph, expr.cond, env, prov)
      const t = internExpr(egraph, expr.then, env, prov)
      const e = internExpr(egraph, expr.else, env, prov)
      return egraph.add({ op: 'if', args: [c, t, e] }, [expr.span], prov)
    }
    case 'call': {
      const args = expr.args.map((a) => internExpr(egraph, a, env, prov))
      return egraph.add({ op: 'call', fn: expr.fn, args }, [expr.span], prov)
    }
  }
}

export function compileProgram(program: Program, source: string, opts: EGraphOptions = {}): Compiled {
  const defs = new Map<string, Def>()
  for (const d of program.defs) defs.set(d.name, d)
  for (const d of program.defs) checkExpr(d.body, new Set(d.params), defs, source)
  checkExpr(program.main, new Set(), defs, source)

  const egraph = new EGraph(opts)
  // No provenance at compile time: provenance records RULE firings (CO-2),
  // and interning main is round 0's topology, not a firing. A class with an
  // empty provenance set has never been touched by a rule.
  const rootId = internExpr(egraph, program.main, new Map())
  // The initial network already knows its best costs (literals are free).
  egraph.recomputeBest()
  // Compilation-time allocations are round 0's topology, not round 1's.
  egraph.drainRoundChanges()
  return { egraph, rootId, defs }
}
