// Input normalisation: everything the extractor accepts (a dropped File, a
// fetch Response, a ReadableStream, raw bytes) becomes either a stream or a
// single Uint8Array, with a byte counter for progress.

/** Anything byte-ish -> ReadableStream<Uint8Array>. */
export function toReadableStream (input) {
  if (input instanceof ReadableStream) return input
  if (typeof Response !== 'undefined' && input instanceof Response) {
    if (!input.body) throw new TypeError('Response has no body')
    return input.body
  }
  if (typeof Blob !== 'undefined' && input instanceof Blob) return input.stream()
  const u8 = toUint8Array(input)
  if (u8) {
    return new ReadableStream({
      start (c) { c.enqueue(u8); c.close() }
    })
  }
  throw new TypeError('expected a ReadableStream, Response, Blob, ArrayBuffer or Uint8Array')
}

/** ArrayBuffer / typed array -> Uint8Array view (no copy); null otherwise. */
export function toUint8Array (input) {
  if (input instanceof Uint8Array) return input
  if (input instanceof ArrayBuffer) return new Uint8Array(input)
  if (ArrayBuffer.isView(input)) return new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
  return null
}

/** Size if knowable up front (Blob.size, content-length, byteLength), else undefined. */
export function knownSize (input) {
  if (typeof Blob !== 'undefined' && input instanceof Blob) return input.size
  if (typeof Response !== 'undefined' && input instanceof Response) {
    // content-length is the *encoded* size; only trust it without content-encoding.
    const len = Number(input.headers.get('content-length'))
    return !input.headers.get('content-encoding') && len > 0 ? len : undefined
  }
  const u8 = toUint8Array(input)
  return u8 ? u8.length : undefined
}

/** Wrap a stream so every chunk passing through reports the running total. */
export function countBytes (stream, onBytes) {
  let n = 0
  return stream.pipeThrough(new TransformStream({
    transform (chunk, c) { n += chunk.byteLength; onBytes(n); c.enqueue(chunk) }
  }))
}

/**
 * Read a stream into ONE Uint8Array. With a correct size hint the buffer is
 * allocated once at its final size and filled in place (no doubling copies
 * of a 294 MB binary). Without one, chunks are kept and joined once at the
 * end (2x transient peak, never the 3x of a growing buffer).
 */
export async function readAll (stream, sizeHint) {
  const reader = stream.getReader()
  const buf = sizeHint > 0 ? new Uint8Array(sizeHint) : null
  let n = 0
  const extra = []
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    const chunk = value instanceof Uint8Array ? value : new Uint8Array(value)
    if (buf && !extra.length && n + chunk.length <= buf.length) {
      buf.set(chunk, n)
      n += chunk.length
    } else {
      extra.push(chunk)
    }
  }
  if (buf && !extra.length) return n === buf.length ? buf : buf.subarray(0, n)
  return concatBytes(buf ? [buf.subarray(0, n), ...extra] : extra)
}

export function concatBytes (parts) {
  let total = 0
  for (const p of parts) total += p.length
  const out = new Uint8Array(total)
  let o = 0
  for (const p of parts) { out.set(p, o); o += p.length }
  return out
}

/**
 * Look at the first `n` bytes of a stream without losing them.
 * Returns { head, stream } where stream replays head before the rest.
 */
export async function peek (stream, n) {
  const reader = stream.getReader()
  const parts = []
  let have = 0
  let done = false
  while (have < n) {
    const r = await reader.read()
    if (r.done) { done = true; break }
    const chunk = r.value instanceof Uint8Array ? r.value : new Uint8Array(r.value)
    parts.push(chunk)
    have += chunk.length
  }
  const head = new Uint8Array(Math.min(n, have))
  let o = 0
  for (const p of parts) {
    if (o >= head.length) break
    const take = Math.min(p.length, head.length - o)
    head.set(p.subarray(0, take), o)
    o += take
  }
  const replay = new ReadableStream({
    start (c) {
      for (const p of parts) c.enqueue(p)
      if (done) c.close()
    },
    async pull (c) {
      const r = await reader.read()
      if (r.done) c.close()
      else c.enqueue(r.value)
    },
    cancel (reason) { return reader.cancel(reason) }
  })
  return { head, stream: replay }
}

export function isGzip (head) {
  return head.length >= 2 && head[0] === 0x1f && head[1] === 0x8b
}

/** POSIX/GNU tar header: "ustar" at offset 257. */
export function isTar (head) {
  return head.length >= 262 && head[257] === 0x75 && head[258] === 0x73 && head[259] === 0x74 && head[260] === 0x61 && head[261] === 0x72
}
