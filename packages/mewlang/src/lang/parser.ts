import type { BinOpKind, Def, Expr, Program } from './ast'
import type { Token } from './lexer'
import { MewSyntaxError, lex } from './lexer'
import type { Span } from './span'

class Parser {
  private pos = 0
  constructor(
    private tokens: Token[],
    private source: string,
  ) {}

  private peek(): Token {
    return this.tokens[this.pos]
  }

  private next(): Token {
    return this.tokens[this.pos++]
  }

  private error(message: string, span?: Span): never {
    throw new MewSyntaxError(message, span ?? this.peek().span, this.source)
  }

  private expect(kind: Token['kind'], text?: string): Token {
    const t = this.peek()
    if (t.kind !== kind || (text !== undefined && t.text !== text)) {
      this.error(`expected ${text ?? kind}, found ${t.kind === 'eof' ? 'end of input' : `'${t.text}'`}`)
    }
    return this.next()
  }

  private at(kind: Token['kind'], text?: string): boolean {
    const t = this.peek()
    return t.kind === kind && (text === undefined || t.text === text)
  }

  parseProgram(): Program {
    const defs: Def[] = []
    while (this.at('keyword', 'def')) {
      defs.push(this.parseDef())
    }
    if (!this.at('keyword', 'main')) {
      this.error(`expected 'def' or 'main'`)
    }
    const mainKw = this.next()
    this.expect('punct', '=')
    const main = this.parseExpr()
    if (!this.at('eof')) {
      this.error(`expected end of input after main expression`)
    }
    const seen = new Set<string>()
    for (const d of defs) {
      if (seen.has(d.name)) this.error(`duplicate definition of '${d.name}'`, d.span)
      seen.add(d.name)
    }
    return { defs, main, mainSpan: { start: mainKw.span.start, end: main.span.end } }
  }

  private parseDef(): Def {
    const kw = this.expect('keyword', 'def')
    const name = this.expect('ident').text
    this.expect('punct', '(')
    const params: string[] = []
    if (!this.at('punct', ')')) {
      params.push(this.expect('ident').text)
      while (this.at('punct', ',')) {
        this.next()
        params.push(this.expect('ident').text)
      }
    }
    this.expect('punct', ')')
    this.expect('punct', '=')
    const body = this.parseExpr()
    return {
      name,
      params,
      body,
      span: { start: kw.span.start, end: body.span.end },
      bodySpan: body.span,
    }
  }

  parseExpr(): Expr {
    return this.parseIf()
  }

  private parseIf(): Expr {
    if (this.at('keyword', 'if')) {
      const kw = this.next()
      const cond = this.parseExpr()
      this.expect('keyword', 'then')
      const thenE = this.parseExpr()
      this.expect('keyword', 'else')
      const elseE = this.parseExpr()
      return {
        kind: 'if',
        cond,
        then: thenE,
        else: elseE,
        span: { start: kw.span.start, end: elseE.span.end },
      }
    }
    return this.parseCmp()
  }

  private parseCmp(): Expr {
    const atCmpOp = () => this.at('op', '<') || this.at('op', '<=') || this.at('op', '==')
    const lhs = this.parseAdd()
    if (atCmpOp()) {
      const op = this.next().text as BinOpKind
      const rhs = this.parseAdd()
      if (atCmpOp()) {
        // cmpExpr := addExpr (op addExpr)? — at most one comparison.
        this.error(`comparisons cannot be chained — parenthesize one side, e.g. (a ${op} b) == c`)
      }
      return { kind: 'binop', op, lhs, rhs, span: { start: lhs.span.start, end: rhs.span.end } }
    }
    return lhs
  }

  private parseAdd(): Expr {
    let lhs = this.parseMul()
    while (this.at('op', '+') || this.at('op', '-')) {
      const op = this.next().text as BinOpKind
      const rhs = this.parseMul()
      lhs = { kind: 'binop', op, lhs, rhs, span: { start: lhs.span.start, end: rhs.span.end } }
    }
    return lhs
  }

  private parseMul(): Expr {
    let lhs = this.parseUnary()
    while (this.at('op', '*')) {
      this.next()
      const rhs = this.parseUnary()
      lhs = { kind: 'binop', op: '*', lhs, rhs, span: { start: lhs.span.start, end: rhs.span.end } }
    }
    return lhs
  }

  private parseUnary(): Expr {
    if (this.at('op', '-')) {
      const minus = this.next()
      const operand = this.parseUnary()
      const span: Span = { start: minus.span.start, end: operand.span.end }
      // Negative literals fold directly; otherwise negation is (0 - x).
      if (operand.kind === 'lit' && typeof operand.value === 'number') {
        return { kind: 'lit', value: -operand.value, span }
      }
      return {
        kind: 'binop',
        op: '-',
        lhs: { kind: 'lit', value: 0, span: minus.span },
        rhs: operand,
        span,
      }
    }
    return this.parseAtom()
  }

  private parseAtom(): Expr {
    const t = this.peek()
    if (t.kind === 'int') {
      this.next()
      return { kind: 'lit', value: parseInt(t.text, 10), span: t.span }
    }
    if (t.kind === 'keyword' && (t.text === 'true' || t.text === 'false')) {
      this.next()
      return { kind: 'lit', value: t.text === 'true', span: t.span }
    }
    if (t.kind === 'keyword' && t.text === 'if') {
      // Spec 2.1: `atom` has no if-production. Allowing it here would give
      // `1 + if c then 2 else 3 + 4` a surprising right-greedy grouping, so
      // demand parens instead.
      this.error(`'if' cannot appear inside an arithmetic operand — parenthesize it: (if … then … else …)`)
    }
    if (t.kind === 'ident') {
      this.next()
      if (this.at('punct', '(')) {
        this.next()
        const args: Expr[] = []
        if (!this.at('punct', ')')) {
          args.push(this.parseExpr())
          while (this.at('punct', ',')) {
            this.next()
            args.push(this.parseExpr())
          }
        }
        const close = this.expect('punct', ')')
        return { kind: 'call', fn: t.text, args, span: { start: t.span.start, end: close.span.end } }
      }
      return { kind: 'var', name: t.text, span: t.span }
    }
    if (t.kind === 'punct' && t.text === '(') {
      const open = this.next()
      const inner = this.parseExpr()
      const close = this.expect('punct', ')')
      return { ...inner, span: { start: open.span.start, end: close.span.end } }
    }
    this.error(`expected an expression, found ${t.kind === 'eof' ? 'end of input' : `'${t.text}'`}`)
  }
}

/** Parse a full mewlang program. Throws MewSyntaxError with line/col + caret snippet. */
export function parse(source: string): Program {
  return new Parser(lex(source), source).parseProgram()
}
