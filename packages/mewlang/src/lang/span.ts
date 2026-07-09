/** A half-open range of character offsets into the source text. */
export interface Span {
  start: number
  end: number
}

export function spanKey(s: Span): string {
  return `${s.start}:${s.end}`
}

export function parseSpanKey(key: string): Span {
  const [start, end] = key.split(':').map(Number)
  return { start, end }
}

/** Line/column (1-based) for a character offset. */
export function lineCol(source: string, offset: number): { line: number; col: number } {
  let line = 1
  let col = 1
  const n = Math.min(offset, source.length)
  for (let i = 0; i < n; i++) {
    if (source[i] === '\n') {
      line++
      col = 1
    } else {
      col++
    }
  }
  return { line, col }
}

/** A caret-underlined snippet of the line containing `span.start`. */
export function caretSnippet(source: string, span: Span): string {
  const { line, col } = lineCol(source, span.start)
  const lines = source.split('\n')
  const text = lines[line - 1] ?? ''
  const width = Math.max(1, Math.min(span.end - span.start, text.length - (col - 1)))
  // Pad the caret line with the SAME whitespace shape as the source prefix
  // (tabs stay tabs) so the caret aligns under any tab rendering width.
  const pad = [...text.slice(0, col - 1)].map((ch) => (ch === '\t' ? '\t' : ' ')).join('')
  return `${line} | ${text}\n${' '.repeat(String(line).length)} | ${pad}${'^'.repeat(width)}`
}
