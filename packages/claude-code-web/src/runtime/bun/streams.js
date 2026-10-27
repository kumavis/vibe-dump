// Web-stream plumbing for the Bun polyfill.
//
// Bun hands out WHATWG ReadableStreams (subprocess stdout/stderr,
// Bun.stdin.stream(), BunFile#stream()) and adds .text() / .json() /
// .bytes() / .arrayBuffer() to them; the bundle uses both
// `new Response(proc.stdout).text()` and `proc.stdout.text()`. Our sources
// are Node-style streams from the track-B shims, so they are adapted here.
import { concatBytes, fromUtf8, toBytes } from './bytes.js'

const isWebStream = (s) => s && typeof s.getReader === 'function'

/** Read a ReadableStream, async iterable or Node-style Readable to one Uint8Array. */
export async function readAllBytes(source) {
  const parts = []
  if (isWebStream(source)) {
    const reader = source.getReader()
    for (;;) {
      const { done, value } = await reader.read()
      if (done) break
      parts.push(toBytes(value))
    }
  } else if (source && typeof source[Symbol.asyncIterator] === 'function') {
    for await (const chunk of source) parts.push(toBytes(chunk))
  } else if (source && typeof source.on === 'function') {
    await new Promise((resolve, reject) => {
      source.on('data', (c) => parts.push(toBytes(c)))
      source.once('end', resolve)
      source.once('close', resolve)
      source.once('error', reject)
    })
  } else {
    throw new TypeError('expected a ReadableStream')
  }
  return parts.length ? concatBytes(parts) : new Uint8Array(0)
}

/** Add Bun's ReadableStream conveniences to a web stream (own, non-enumerable). */
export function withReadHelpers(stream) {
  const add = (name, fn) => {
    if (typeof stream[name] !== 'function') Object.defineProperty(stream, name, { value: fn, configurable: true, writable: true })
  }
  add('bytes', () => readAllBytes(stream))
  add('arrayBuffer', () => readAllBytes(stream).then((u8) => u8.slice().buffer))
  add('text', () => readAllBytes(stream).then(fromUtf8))
  add('json', () => readAllBytes(stream).then((u8) => JSON.parse(fromUtf8(u8))))
  return stream
}

/**
 * Adapt a Node-style Readable (EventEmitter with data/end/error) to a web
 * ReadableStream. Chunks become plain Uint8Array views (Response rejects
 * anything else in some engines). No backpressure: subprocess output here is
 * small and produced in-process.
 */
export function toWebStream(source) {
  if (!source) return undefined
  if (isWebStream(source)) return withReadHelpers(source)
  let finished = false
  const stream = new ReadableStream({
    start(controller) {
      const close = () => {
        if (finished) return
        finished = true
        try { controller.close() } catch {}
      }
      source.on('data', (chunk) => {
        if (finished) return
        const u8 = toBytes(chunk)
        controller.enqueue(new Uint8Array(u8.buffer, u8.byteOffset, u8.byteLength))
      })
      source.once('end', close)
      source.once('close', close)
      source.once('error', (err) => {
        if (finished) return
        finished = true
        controller.error(err)
      })
    },
    cancel() {
      finished = true
      source.destroy?.()
    },
  })
  return withReadHelpers(stream)
}

/** A one-shot stream over bytes produced on first pull (BunFile#stream()). */
export function bytesStream(produce) {
  return withReadHelpers(new ReadableStream({
    async pull(controller) {
      try {
        const u8 = await produce()
        if (u8.length) controller.enqueue(u8)
        controller.close()
      } catch (err) {
        controller.error(err)
      }
    },
  }))
}

// Bun.readableStreamTo*: accept a web stream (or anything readAllBytes takes).
export const readableStreamHelpers = {
  readableStreamToBytes: (s) => readAllBytes(s),
  readableStreamToArrayBuffer: (s) => readAllBytes(s).then((u8) => u8.slice().buffer),
  readableStreamToText: (s) => readAllBytes(s).then(fromUtf8),
  readableStreamToJSON: (s) => readAllBytes(s).then((u8) => JSON.parse(fromUtf8(u8))),
  async readableStreamToArray(s) {
    const out = []
    if (isWebStream(s)) {
      const reader = s.getReader()
      for (;;) {
        const { done, value } = await reader.read()
        if (done) return out
        out.push(value)
      }
    }
    for await (const chunk of s) out.push(chunk)
    return out
  },
}
