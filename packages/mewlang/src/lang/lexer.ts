import type { Span } from './span'
import { caretSnippet, lineCol } from './span'

export type TokenKind =
  | 'ident'
  | 'int'
  | 'keyword' // def main if then else true false
  | 'op' // + - * < <= ==
  | 'punct' // ( ) , =
  | 'eof'

export interface Token {
  kind: TokenKind
  text: string
  span: Span
}

export const KEYWORDS = new Set(['def', 'main', 'if', 'then', 'else', 'true', 'false'])

export class MewSyntaxError extends Error {
  constructor(
    message: string,
    public span: Span,
    source: string,
  ) {
    const { line, col } = lineCol(source, span.start)
    super(`${message} (line ${line}, col ${col})\n${caretSnippet(source, span)}`)
    this.name = 'MewSyntaxError'
  }
}

export function lex(source: string): Token[] {
  const tokens: Token[] = []
  let i = 0
  const n = source.length
  while (i < n) {
    const c = source[i]
    // whitespace
    if (c === ' ' || c === '\t' || c === '\r' || c === '\n') {
      i++
      continue
    }
    // comments: ;; to end of line
    if (c === ';' && source[i + 1] === ';') {
      while (i < n && source[i] !== '\n') i++
      continue
    }
    const start = i
    // integers
    if (c >= '0' && c <= '9') {
      while (i < n && source[i] >= '0' && source[i] <= '9') i++
      const text = source.slice(start, i)
      if (!Number.isSafeInteger(parseInt(text, 10))) {
        throw new MewSyntaxError(
          `integer literal too large — mewlang integers must stay within ±2^53`,
          { start, end: i },
          source,
        )
      }
      tokens.push({ kind: 'int', text, span: { start, end: i } })
      continue
    }
    // identifiers / keywords
    if (/[a-zA-Z_]/.test(c)) {
      while (i < n && /[a-zA-Z0-9_]/.test(source[i])) i++
      const text = source.slice(start, i)
      tokens.push({
        kind: KEYWORDS.has(text) ? 'keyword' : 'ident',
        text,
        span: { start, end: i },
      })
      continue
    }
    // multi-char operators first
    const two = source.slice(i, i + 2)
    if (two === '==' || two === '<=') {
      tokens.push({ kind: 'op', text: two, span: { start, end: i + 2 } })
      i += 2
      continue
    }
    if (c === '+' || c === '-' || c === '*' || c === '<') {
      tokens.push({ kind: 'op', text: c, span: { start, end: i + 1 } })
      i++
      continue
    }
    if (c === '(' || c === ')' || c === ',' || c === '=') {
      tokens.push({ kind: 'punct', text: c, span: { start, end: i + 1 } })
      i++
      continue
    }
    throw new MewSyntaxError(`unexpected character '${c}'`, { start, end: i + 1 }, source)
  }
  tokens.push({ kind: 'eof', text: '', span: { start: n, end: n } })
  return tokens
}
