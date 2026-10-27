// Streaming .tgz reader: DecompressionStream('gzip') + a ustar/pax parser.
//
// Built for the npm platform tarball (~132 MB compressed, one ~294 MB entry):
// the compressed stream is never held in memory, and each wanted entry is
// copied once, straight from the decompressor's chunks into a Uint8Array of
// exactly its size. Entries the `filter` rejects are skipped without being
// buffered at all.
//
// Supported: ustar (prefix + name), GNU ("ustar  ") long names (typeflag L),
// pax extended headers (x: path/size; g: ignored), base-256 sizes. Header
// checksums are verified, so a corrupt or truncated download is an error,
// never a silently short file.

import { toReadableStream } from './input.js'

const BLOCK = 512

/** Pull-based byte reader over a ReadableStream<Uint8Array>. */
export class ByteReader {
  constructor (stream) {
    this.reader = stream.getReader()
    this.chunk = null
    this.pos = 0
    this.eof = false
    this.consumed = 0
  }

  async #fill () {
    while (!this.chunk || this.pos >= this.chunk.length) {
      if (this.eof) return false
      let r
      try {
        r = await this.reader.read()
      } catch (e) {
        // DecompressionStream reports a truncated or corrupt gzip stream as a
        // bare TypeError with no message; say what actually happened.
        throw new Error(`tarball stream failed after ${this.consumed} bytes: corrupt or truncated download (${e?.message || e?.name || e})`, { cause: e })
      }
      const { value, done } = r
      if (done) { this.eof = true; this.chunk = null; return false }
      this.chunk = value instanceof Uint8Array ? value : new Uint8Array(value)
      this.pos = 0
    }
    return true
  }

  /** Fill dst[off, off+len) from the stream; returns bytes copied (< len only at EOF). */
  async readInto (dst, off = 0, len = dst.length - off) {
    let n = 0
    while (n < len) {
      if (!(await this.#fill())) break
      const take = Math.min(len - n, this.chunk.length - this.pos)
      dst.set(this.chunk.subarray(this.pos, this.pos + take), off + n)
      this.pos += take
      n += take
    }
    this.consumed += n
    return n
  }

  /** Discard len bytes; returns bytes skipped. */
  async skip (len) {
    let n = 0
    while (n < len) {
      if (!(await this.#fill())) break
      const take = Math.min(len - n, this.chunk.length - this.pos)
      this.pos += take
      n += take
    }
    this.consumed += n
    return n
  }

  async cancel (reason) {
    try { await this.reader.cancel(reason) } catch {}
  }
}

const dec = new TextDecoder('utf-8')

function cstr (b, off, len) {
  let end = off
  while (end < off + len && b[end] !== 0) end++
  return dec.decode(b.subarray(off, end))
}

function octal (b, off, len) {
  // base-256 (GNU/star) for values that do not fit the octal field
  if (b[off] & 0x80) {
    let v = b[off] & 0x7f
    for (let i = 1; i < len; i++) v = v * 256 + b[off + i]
    return v
  }
  const s = cstr(b, off, len).trim()
  return s ? parseInt(s, 8) : 0
}

function isZeroBlock (b) {
  for (let i = 0; i < BLOCK; i++) if (b[i] !== 0) return false
  return true
}

function verifyChecksum (h) {
  const stored = octal(h, 148, 8)
  let sum = 0
  for (let i = 0; i < BLOCK; i++) sum += (i >= 148 && i < 156) ? 0x20 : h[i]
  return sum === stored
}

/** Parse pax "len key=value\n" records. */
function parsePax (bytes) {
  const out = {}
  let i = 0
  while (i < bytes.length) {
    let sp = i
    while (sp < bytes.length && bytes[sp] !== 0x20) sp++
    const len = parseInt(dec.decode(bytes.subarray(i, sp)), 10)
    if (!len || len < 0) break
    const rec = dec.decode(bytes.subarray(sp + 1, i + len - 1)) // drop trailing \n
    const eq = rec.indexOf('=')
    if (eq > 0) out[rec.slice(0, eq)] = rec.slice(eq + 1)
    i += len
  }
  return out
}

const TYPES = { '0': 'file', '\0': 'file', '': 'file', '7': 'file', '1': 'link', '2': 'symlink', '5': 'directory' }

/**
 * Yield the entries of a gzipped tarball.
 * @param {ReadableStream|Blob|Uint8Array|ArrayBuffer|Response} input
 * @param {{filter?: (header) => boolean, gzip?: boolean}} [opts]
 *   filter(header) sees {path, size, type, mode, mtime}; false skips the
 *   entry's bytes without buffering them. gzip:false reads a plain .tar.
 * @yields {{path, size, type, mode, mtime, linkname, bytes: Uint8Array}}
 */
export async function * readTarballEntries (input, { filter, gzip = true } = {}) {
  let stream = toReadableStream(input)
  if (gzip) stream = stream.pipeThrough(new DecompressionStream('gzip'))
  const r = new ByteReader(stream)
  const h = new Uint8Array(BLOCK)
  let pax = null // pending per-entry pax overrides
  let longName = null // pending GNU long name
  let finished = false
  try {
    for (;;) {
      const got = await r.readInto(h)
      if (got === 0) { finished = true; break } // EOF without end-of-archive blocks: tolerated
      if (got < BLOCK) throw new Error(`tar: truncated header (${got} of ${BLOCK} bytes)`)
      if (isZeroBlock(h)) {
        // Drain the record padding so the gzip trailer (CRC32 + length) is
        // read and checked by DecompressionStream: a corrupt download throws.
        await r.skip(Number.MAX_SAFE_INTEGER)
        finished = true
        break
      }
      if (!verifyChecksum(h)) throw new Error(`tar: header checksum mismatch at byte ${r.consumed - BLOCK}`)

      const flag = String.fromCharCode(h[156])
      let size = octal(h, 124, 12)
      const ustar = cstr(h, 257, 6) === 'ustar'
      let path = cstr(h, 0, 100)
      if (ustar) {
        const prefix = cstr(h, 345, 155)
        if (prefix) path = prefix + '/' + path
      }
      const padded = Math.ceil(size / BLOCK) * BLOCK

      // Meta entries describe the next header.
      if (flag === 'x' || flag === 'g' || flag === 'L' || flag === 'K') {
        if (size > 1 << 20) throw new Error(`tar: implausible ${size}-byte meta header`)
        const data = new Uint8Array(padded)
        if (await r.readInto(data) < padded) throw new Error('tar: truncated meta entry')
        const body = data.subarray(0, size)
        if (flag === 'x') pax = parsePax(body)
        else if (flag === 'L') longName = cstr(body, 0, body.length)
        continue // 'g' (global pax) and 'K' (long link name) carry nothing we use
      }

      if (longName != null) { path = longName; longName = null }
      if (pax) {
        if (pax.path) path = pax.path
        if (pax.size) size = parseInt(pax.size, 10)
        pax = null
      }
      const realPadded = Math.ceil(size / BLOCK) * BLOCK
      const header = {
        path,
        size,
        type: TYPES[flag] || 'other',
        mode: octal(h, 100, 8),
        mtime: octal(h, 136, 12),
        linkname: cstr(h, 157, 100)
      }
      const wanted = header.type === 'file' && (!filter || filter(header))
      if (!wanted) {
        if (await r.skip(realPadded) < realPadded) throw new Error(`tar: truncated entry ${path}`)
        continue
      }
      if (!(size <= 2 ** 31 - 1)) throw new Error(`tar: entry ${path} is ${size} bytes, larger than this reader buffers`)
      const bytes = new Uint8Array(size)
      if (await r.readInto(bytes) < size) throw new Error(`tar: truncated entry ${path} (${size} bytes expected)`)
      if (await r.skip(realPadded - size) < realPadded - size) throw new Error(`tar: truncated padding after ${path}`)
      yield { ...header, bytes }
    }
  } finally {
    // Stop the decompressor if the consumer broke out early or we threw.
    if (!finished) await r.cancel()
  }
}
