import type { Span } from './span'

export type BinOpKind = '+' | '-' | '*' | '<' | '<=' | '=='

export type Expr =
  | { kind: 'lit'; value: number | boolean; span: Span }
  | { kind: 'var'; name: string; span: Span }
  | { kind: 'binop'; op: BinOpKind; lhs: Expr; rhs: Expr; span: Span }
  | { kind: 'if'; cond: Expr; then: Expr; else: Expr; span: Span }
  | { kind: 'call'; fn: string; args: Expr[]; span: Span }

export interface Def {
  name: string
  params: string[]
  body: Expr
  span: Span
  /** Span of just the body expression — used to source-map unfolded classes. */
  bodySpan: Span
}

export interface Program {
  defs: Def[]
  main: Expr
  mainSpan: Span
}
