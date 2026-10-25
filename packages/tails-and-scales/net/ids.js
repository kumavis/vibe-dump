// Names and ids for online play (DESIGN §2.7, N2): this browser's device id,
// the lobby's display names and nonces, and the random parts of entry ids.
// Pure but for the randomness (crypto) and the device id's storage, which
// the caller hands in.
//
//   device id   8 base36 characters, kept in localStorage['ts.dev'] (a tab
//               given `#…&dev=<id>` plays as that device instead: the
//               "continue on another device" link, and a second tab of one
//               browser playing the other seat)
//   name        a seat's display name: NFC, control characters and lone
//               surrogates removed, runs of white space one space, trimmed,
//               then cut to 24 characters and 48 bytes of canonical JSON
//               (a `"` or `\` written escaped counts two), the start's
//               byte budget (§4.2.1: 613 B in the worst case)
//   nonce       16 hex characters (8 random bytes): a guest seat's share of
//               the dice seed (net/seed.js); the host's seat and an AI's
//               contribute ''
import { canonicalJSON } from '../core/index.js'

export const MAX_NAME_CHARS = 24
export const MAX_NAME_BYTES = 48

const B36 = '0123456789abcdefghijklmnopqrstuvwxyz'
const bytes = (n) => crypto.getRandomValues(new Uint8Array(n))

// n random base36 characters (an entry id's random part, a device id)
export const randomId = (n) => Array.from(bytes(n), (b) => B36[b % 36]).join('')
// n random bytes as hex
export const randomHex = (n) => Array.from(bytes(n), (b) => b.toString(16).padStart(2, '0')).join('')
export const newNonce = () => randomHex(8)
export const isNonce = (s) => typeof s === 'string' && /^[0-9a-f]{16}$/.test(s)
export const isDevice = (s) => typeof s === 'string' && /^[0-9a-z]{8}$/.test(s)

// This browser's device id (`store`: localStorage, or anything with its
// getItem and setItem; a store that throws or forgets, a private window's,
// gives a fresh id per page)
export function deviceId(store) {
  try {
    const kept = store.getItem('ts.dev')
    if (isDevice(kept)) return kept
    const dev = randomId(8)
    store.setItem('ts.dev', dev)
    return dev
  } catch {
    return randomId(8)
  }
}

// bytes of a name as the start writes it (canonical JSON, without quotes)
const encoder = new TextEncoder()
export const nameBytes = (s) => encoder.encode(canonicalJSON(s)).length - 2

// A display name as the lobby keeps it (above): the longest prefix, by
// whole characters, within both caps. `typing`: as a name box shows it
// while it is typed in, a trailing space kept (the next word's).
export function fitName(raw, { typing = false } = {}) {
  const t = String(raw ?? '')
    .normalize('NFC')
    .replace(/\p{Cc}/gu, '')
    .replace(/[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/g, '')
    .replace(/\s+/gu, ' ')
    .trimStart()
  let out = ''
  for (const ch of t) {
    if ([...out].length + 1 > MAX_NAME_CHARS || nameBytes(out + ch) > MAX_NAME_BYTES) break
    out += ch
  }
  return typing ? out : out.trimEnd()
}

// a name the lobby takes as it is: not empty, and already fitted
export const nameOk = (s) => typeof s === 'string' && s.length > 0 && fitName(s) === s
