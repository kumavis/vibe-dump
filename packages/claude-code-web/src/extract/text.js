// Byte <-> string helpers for the extractor. No dependencies; runs in a page,
// a Worker and Node alike.
//
// Two traps this file exists to avoid:
//  - TextDecoder('latin1') is really windows-1252 per the WHATWG Encoding
//    spec: bytes 0x80-0x9f decode to other code points (0x80 -> U+20AC), so
//    it is not a byte-exact round trip. Bun's "latin1" is true ISO-8859-1.
//  - String.fromCharCode(...bigArray) overflows the call stack, so binary
//    strings are built in bounded chunks.

const utf8Decoder = new TextDecoder('utf-8')
const utf8Fatal = new TextDecoder('utf-8', { fatal: true })
const utf16leDecoder = new TextDecoder('utf-16le')
const encoder = new TextEncoder()

/** True when every byte is < 0x80 (then latin1 == utf-8 == ASCII). */
export function isAscii (bytes) {
  // A plain loop is the fastest portable option and handles 50 MB in ~50 ms.
  for (let i = 0; i < bytes.length; i++) if (bytes[i] > 0x7f) return false
  return true
}

/** ISO-8859-1 decode: one char per byte, byte-exact (unlike TextDecoder). */
export function decodeLatin1 (bytes) {
  if (isAscii(bytes)) return utf8Decoder.decode(bytes)
  const CHUNK = 0x8000
  let out = ''
  for (let i = 0; i < bytes.length; i += CHUNK) {
    out += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK))
  }
  return out
}

/** Inverse of decodeLatin1 for strings whose chars are all < 0x100. */
export function encodeLatin1 (str) {
  const out = new Uint8Array(str.length)
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i)
    if (c > 0xff) throw new RangeError(`char U+${c.toString(16)} at ${i} does not fit latin1`)
    out[i] = c
  }
  return out
}

/** UTF-16LE (Bun encoding 2) -> UTF-8 bytes, exactly as unhare writes them. */
export function utf16leToUtf8 (bytes) {
  return encoder.encode(utf16leDecoder.decode(bytes))
}

/** Strict UTF-8 decode; returns null when the bytes are not valid UTF-8. */
export function tryDecodeUtf8 (bytes) {
  try { return utf8Fatal.decode(bytes) } catch { return null }
}

export function decodeUtf8 (bytes) { return utf8Decoder.decode(bytes) }
export function encodeUtf8 (str) { return encoder.encode(str) }

/** Compare two byte arrays for equality. */
export function bytesEqual (a, b) {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false
  return true
}
