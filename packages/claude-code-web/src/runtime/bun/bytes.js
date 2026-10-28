// Byte helpers shared by the Bun polyfill modules. No dependencies.

const encoder = new TextEncoder()
const decoder = new TextDecoder()

export const utf8 = (s) => encoder.encode(s)
export const fromUtf8 = (u8) => decoder.decode(u8)

/** View any Bun "BlobPart"-like synchronous input as a Uint8Array (no copy for views). */
export function toBytes(data) {
  if (typeof data === 'string') return encoder.encode(data)
  if (data instanceof Uint8Array) return data
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength)
  if (data instanceof ArrayBuffer || (typeof SharedArrayBuffer === 'function' && data instanceof SharedArrayBuffer)) return new Uint8Array(data)
  if (data === undefined || data === null) return new Uint8Array(0)
  if (typeof Blob === 'function' && data instanceof Blob) throw new TypeError('a Blob cannot be read synchronously')
  return encoder.encode(String(data))
}

/** Like toBytes, but also awaits Blob / Response / BunFile-likes (anything with arrayBuffer()). */
export async function toBytesAsync(data) {
  if (data && typeof data === 'object' && !ArrayBuffer.isView(data) && !(data instanceof ArrayBuffer)) {
    if (typeof data.bytes === 'function') return toBytes(await data.bytes())
    if (typeof data.arrayBuffer === 'function') return new Uint8Array(await data.arrayBuffer())
    if (Array.isArray(data)) return concatBytes(await Promise.all(data.map(toBytesAsync)))
  }
  return toBytes(data)
}

/** Decode a string given with a Node-style input encoding (CryptoHasher#update(str, enc)). */
export function decodeString(s, encoding = 'utf8') {
  switch (String(encoding).toLowerCase()) {
    case 'utf8':
    case 'utf-8':
      return encoder.encode(s)
    case 'hex': {
      const out = new Uint8Array(s.length >> 1)
      for (let i = 0; i < out.length; i++) out[i] = parseInt(s.substr(i * 2, 2), 16)
      return out
    }
    case 'base64':
    case 'base64url': {
      const clean = s.replace(/-/g, '+').replace(/_/g, '/').replace(/[\s=]+/g, '')
      const bin = atob(clean + '==='.slice((clean.length + 3) % 4))
      return Uint8Array.from(bin, (c) => c.charCodeAt(0))
    }
    case 'latin1':
    case 'binary':
      return Uint8Array.from(s, (c) => c.charCodeAt(0) & 0xff)
    default:
      throw new TypeError(`Unknown encoding: ${encoding}`)
  }
}

export function concatBytes(parts) {
  if (parts.length === 1) return parts[0]
  let n = 0
  for (const p of parts) n += p.length
  const out = new Uint8Array(n)
  let o = 0
  for (const p of parts) { out.set(p, o); o += p.length }
  return out
}

/** Wrap bytes as a Buffer when the runtime has one (Bun returns Buffers), else plain Uint8Array. */
export function asBuffer(u8, BufferImpl = globalThis.Buffer) {
  return BufferImpl ? BufferImpl.from(u8.buffer, u8.byteOffset, u8.byteLength) : u8
}

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

/** Encode digest bytes the way Bun's DigestEncoding names them. */
export function encodeBytes(u8, encoding) {
  const enc = String(encoding).toLowerCase()
  switch (enc) {
    case 'hex': {
      let s = ''
      for (let i = 0; i < u8.length; i++) s += (u8[i] < 16 ? '0' : '') + u8[i].toString(16)
      return s
    }
    case 'base64':
    case 'base64url': {
      let s = ''
      let i = 0
      for (; i + 2 < u8.length; i += 3) {
        const n = (u8[i] << 16) | (u8[i + 1] << 8) | u8[i + 2]
        s += B64[n >> 18] + B64[(n >> 12) & 63] + B64[(n >> 6) & 63] + B64[n & 63]
      }
      if (i < u8.length) {
        const n = (u8[i] << 16) | ((u8[i + 1] ?? 0) << 8)
        s += B64[n >> 18] + B64[(n >> 12) & 63] + (i + 1 < u8.length ? B64[(n >> 6) & 63] : '=') + '='
      }
      return enc === 'base64' ? s : s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    }
    case 'latin1':
    case 'binary': {
      let s = ''
      for (let i = 0; i < u8.length; i++) s += String.fromCharCode(u8[i])
      return s
    }
    case 'utf8':
    case 'utf-8':
      return fromUtf8(u8)
    default:
      throw new TypeError(`Unknown digest encoding: ${encoding}`)
  }
}
