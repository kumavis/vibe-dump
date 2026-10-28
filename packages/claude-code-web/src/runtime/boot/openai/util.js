// Small pure helpers shared by the OpenAI Responses adapter (Worker side,
// ARCHITECTURE.md Appendix A). Plain ESM, no imports: the Worker loads these
// files as they are from runtime/boot/openai/.

const enc = new TextEncoder()
const dec = new TextDecoder()

/** UTF-8 string -> base64url (no padding). */
export function base64urlEncode (text) {
  const bytes = enc.encode(String(text))
  let bin = ''
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000))
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

/** base64url (padding optional) -> UTF-8 string; throws on malformed input. */
export function base64urlDecode (b64) {
  const s = String(b64).replace(/-/g, '+').replace(/_/g, '/')
  const bin = atob(s + '='.repeat((4 - (s.length % 4)) % 4))
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return dec.decode(bytes)
}

/**
 * A short deterministic hash (two FNV-1a 32-bit lanes, base36), used to
 * shorten tool names and call ids. Deterministic because every request is
 * translated on its own: the same long id must map the same way each time.
 */
export function shortHash (text) {
  let a = 0x811c9dc5
  let b = 0x01000193 ^ 0x5bd1e995
  const s = String(text)
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    a = Math.imul(a ^ c, 0x01000193) >>> 0
    b = Math.imul(b ^ c, 0x5bd1e995) >>> 0
    b ^= b >>> 13
  }
  return (a.toString(36) + b.toString(36)).padStart(12, '0').slice(-12)
}

/** The local token estimate (count_tokens, usage placeholders): ceil(UTF-8 bytes / 4). */
export function estimateTokens (textOrBytes) {
  const n = typeof textOrBytes === 'string' ? enc.encode(textOrBytes).length : (textOrBytes?.byteLength ?? 0)
  return Math.ceil(n / 4)
}

export function randomId (prefix) {
  const bytes = new Uint8Array(12)
  crypto.getRandomValues(bytes)
  let s = ''
  for (const b of bytes) s += b.toString(16).padStart(2, '0')
  return `${prefix}${s}`
}

/** Anthropic SSE: `event: <type>` + one JSON `data:` line + a blank line. */
export function sseEvent (obj) {
  return `event: ${obj.type}\ndata: ${JSON.stringify(obj)}\n\n`
}

/**
 * Incremental SSE parser (WHATWG event-stream rules, enough of them):
 * push(text) returns the complete events so far as {event, data}; end()
 * returns a last event that had no trailing blank line.
 */
export function createSseParser () {
  let buf = ''
  let event = null
  let data = []
  const dispatch = (out) => {
    if (data.length) out.push({ event, data: data.join('\n') })
    event = null
    data = []
  }
  const line = (l, out) => {
    if (l === '') return dispatch(out)
    if (l[0] === ':') return
    const i = l.indexOf(':')
    const field = i < 0 ? l : l.slice(0, i)
    let value = i < 0 ? '' : l.slice(i + 1)
    if (value[0] === ' ') value = value.slice(1)
    if (field === 'event') event = value
    else if (field === 'data') data.push(value)
  }
  return {
    push (text) {
      buf += text
      const out = []
      let start = 0
      for (let i = 0; i < buf.length; i++) {
        const ch = buf[i]
        if (ch !== '\n' && ch !== '\r') continue
        if (ch === '\r' && i === buf.length - 1) break // maybe the first half of \r\n
        line(buf.slice(start, i), out)
        if (ch === '\r' && buf[i + 1] === '\n') i++
        start = i + 1
      }
      buf = buf.slice(start)
      return out
    },
    end () {
      const out = []
      if (buf) line(buf.replace(/\r$/, ''), out)
      buf = ''
      dispatch(out)
      return out
    }
  }
}

/** Parse one SSE `data:` payload; null for `[DONE]` and anything unparsable. */
export function parseSseJson (ev) {
  if (!ev || !ev.data || ev.data === '[DONE]') return null
  try {
    const obj = JSON.parse(ev.data)
    if (obj && typeof obj === 'object' && !obj.type && ev.event) obj.type = ev.event
    return obj && typeof obj === 'object' ? obj : null
  } catch {
    return null
  }
}
