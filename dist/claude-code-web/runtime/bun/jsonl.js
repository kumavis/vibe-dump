// Bun.JSONL: newline-delimited JSON.
//
//   parseChunk(input, start = 0, end = input.length) -> { values, read, done, error }
//   parse(input) -> values (throws on any bad or truncated line)
//
// `input` is a string (offsets in UTF-16 units) or bytes (offsets in bytes,
// decoded as UTF-8). parseChunk stops at the first line that is not valid
// JSON and reports it as `error` with `read` at the start of that line; the
// 2.1.311 transcript reader then skips to the next newline and calls again
// from there. A last line with no newline after it that does not parse is
// treated as still being written: no error, done = false, read at its start.
// A leading UTF-8 BOM is skipped. One JSON value per line (Bun also accepts
// values spanning lines; Claude Code never writes those).

const decoder = new TextDecoder()

function isBytes(input) {
  return typeof input !== 'string'
}

export function parseChunk(input, start = 0, end) {
  if (input === null || input === undefined) throw new TypeError('Bun.JSONL.parseChunk: input is required')
  const bytes = isBytes(input)
  const src = bytes ? (input instanceof Uint8Array ? input : ArrayBuffer.isView(input) ? new Uint8Array(input.buffer, input.byteOffset, input.byteLength) : new Uint8Array(input)) : input
  const stop = end === undefined ? src.length : Math.min(Math.max(0, end), src.length)
  let pos = Math.max(0, start | 0)
  if (pos === 0) {
    if (bytes && src[0] === 0xef && src[1] === 0xbb && src[2] === 0xbf) pos = 3
    else if (!bytes && src.charCodeAt(0) === 0xfeff) pos = 1
  }
  const values = []
  while (pos < stop) {
    let nl = bytes ? src.indexOf(10, pos) : src.indexOf('\n', pos)
    const last = nl === -1 || nl >= stop
    if (last) nl = stop
    const line = (bytes ? decoder.decode(src.subarray(pos, nl)) : src.slice(pos, nl)).trim()
    if (line) {
      try {
        values.push(JSON.parse(line))
      } catch (e) {
        if (last) return { values, read: pos, done: false, error: null } // incomplete tail
        return { values, read: pos, done: false, error: e instanceof SyntaxError ? e : new SyntaxError(String(e)) }
      }
    }
    pos = last ? stop : nl + 1
  }
  return { values, read: pos, done: true, error: null }
}

export function parse(input) {
  const r = parseChunk(input)
  if (r.error) throw r.error
  if (!r.done) throw new SyntaxError(`JSONL: truncated value at offset ${r.read}`)
  return r.values
}
