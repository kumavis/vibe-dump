// Envelopes (DESIGN §2.6): a match's log entry as it is stored and shared.
// Every entry is one envelope, written as canonical JSON (sorted keys, so
// equal entries are equal text), at most 1 kB:
//
//   { id: 'k3f9.h.x2', s: 0, d: 'k3f9', p: 'p2x1.g.q0', h: '1u8kq0d', t: 'move', u: 3, c: 1234 }
//
//   id  `${device}.${counter}.${rand}`, unique in the log (newEntryId)
//   s   the seat it is played for; -1 for the log's own `open` and `start`
//   d   the device that wrote it (a seat is played from the device the
//       setup names for it)
//   p   prev: the head the author saw for its seat (the Folder's head(s)),
//       so an entry written on a stale view of the log is refused alike by
//       every peer, whatever order the entries reached it in
//   h   stateHash of the match the author saw, only on an entry answering a
//       single seat's decision (a phase's command, a charge's end)
//   …   then the body: `t` and its fields, which is all legal() and apply()
//       ever take (bodyOf)
//
// The kinds: every command core/commands.js knows (KINDS: whole numbers, or
// a boolean for F4's vote, in every field beside the envelope's), and the
// Folder's own (match/fold.js), which never reach legal():
//   open {commit}                 an online log's first entry (N2)
//   start {core, rules, setup, a?}  the match: the whole setup, and the
//                                 rules it was made under (CORE_VERSION,
//                                 RULES_ID); `a` is N2's seed reveal
//   desync {at, mine}             out of band: a seat's device found its
//                                 match apart from the author's at entry
//                                 `at` (its own hash, `mine`)
//
// decode(text) refuses anything else: not canonical JSON, over 1 kB, no id,
// seat or device, an unknown kind, a field of the wrong type, a Folder kind
// with a field it doesn't take. A refused entry comes back marked `bad`
// (with its id, when it has one), which the Folder rejects before it reads
// anything else of it; an accepted one comes back frozen, with no key
// added. A command with a stray field of the right type passes: bodyOf
// leaves it in the body and legal() refuses it, alike on every peer
// (legal() stays the one judge of a body's fields).
//
// Pure: no DOM, nothing awaited, no randomness (the caller hands
// newEntryId its random part).
import { KINDS, canonicalJSON } from '../core/index.js'

// the envelope's own fields (encode and decode know them by this list, and
// bodyOf strips exactly these)
export const ENVELOPE_KEYS = Object.freeze(['id', 's', 'd', 'p', 'h'])

// the most an entry may weigh, in bytes of its text
export const MAX_BYTES = 1024
// the longest id, device, prev or hash an envelope may carry
export const MAX_NAME = 64

// the Folder's own kinds: each field beside the envelope's, and its type
// ('?' optional)
const OWN = Object.freeze({
  open: Object.freeze({ commit: 'string' }),
  start: Object.freeze({ core: 'int', rules: 'string', setup: 'object', a: 'string?' }),
  desync: Object.freeze({ at: 'string', mine: 'string' }),
})

const int = (v) => Number.isSafeInteger(v)
// a name an envelope may carry (its id, device, prev or hash): the Folder
// holds a start's human seats to it too, each seat's device being the `d`
// of every entry it sends
export const isName = (v) => typeof v === 'string' && v.length > 0 && v.length <= MAX_NAME
const record = (v) => !!v && typeof v === 'object' && !Array.isArray(v)
const TYPE = Object.freeze({ int, string: (v) => typeof v === 'string', object: record })

// An entry's id: unique per device and counter, the random part telling
// apart two devices that share an id (the same seat continued on another
// device, N3).
export const newEntryId = (dev, n, rand) => `${dev}.${n.toString(36)}.${rand}`

// An envelope around `body`: the envelope's fields (`fields`: id, s, d, and p
// and h where they apply) beside the command. A field left undefined is
// left out of the text.
export const envelope = (body, fields) => ({ ...body, ...fields })

// The text an entry is stored as: canonical JSON (core/util.js).
export const encode = (e) => canonicalJSON(e)

// The command an entry carries: every key but the envelope's. Stripped by
// that fixed list, never by the kind's fields, so a stray field stays in
// for legal() to refuse.
// (Built as own properties, so a field named __proto__ stays a field.)
export const bodyOf = (e) => Object.fromEntries(Object.entries(e).filter(([k]) => !ENVELOPE_KEYS.includes(k)))

// why `e` (parsed JSON) is no envelope, or null
function whyNot(e) {
  if (!record(e)) return 'not an object'
  if (!isName(e.id)) return 'no id'
  if (!int(e.s) || e.s < -1) return 'no seat'
  if (!isName(e.d)) return 'no device'
  for (const k of ['p', 'h']) if (Object.hasOwn(e, k) && !isName(e[k])) return `${k} is not a name`
  const own = typeof e.t === 'string' && Object.hasOwn(OWN, e.t) ? OWN[e.t] : null
  if (own) {
    // (the log's own entries are seat -1's; a desync is a seat's)
    if ((e.s === -1) !== (e.t !== 'desync')) return `${e.t} for seat ${e.s}`
    for (const k of Object.keys(e)) if (k !== 't' && !ENVELOPE_KEYS.includes(k) && !Object.hasOwn(own, k)) return `${e.t} takes no field "${k}"`
    for (const [k, type] of Object.entries(own)) {
      const optional = type[type.length - 1] === '?', base = type.replace('?', '')
      if (!Object.hasOwn(e, k) ? !optional : !TYPE[base](e[k])) return `${e.t} takes a ${base} ${k}`
    }
    return null
  }
  if (!KINDS.includes(e.t)) return `no kind ${JSON.stringify(e.t)}`
  if (e.s < 0) return `${e.t} for seat ${e.s}`
  // a command's fields: whole numbers and booleans only (§4.1 rule 12)
  for (const k of Object.keys(e)) {
    if (k === 't' || ENVELOPE_KEYS.includes(k)) continue
    if (!int(e[k]) && typeof e[k] !== 'boolean') return `${e.t}'s ${k} is not a whole number`
  }
  return null
}

// Bytes of `s` as UTF-8 (a lone surrogate counts as three, as an encoder
// writes it).
function utf8Length(s) {
  let n = 0
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i)
    if (c < 0x80) n += 1
    else if (c < 0x800) n += 2
    else if (c >= 0xd800 && c < 0xdc00 && (s.charCodeAt(i + 1) & 0xfc00) === 0xdc00) (n += 4), i++
    else n += 3
  }
  return n
}

function freeze(v) {
  if (v && typeof v === 'object' && !Object.isFrozen(v)) {
    Object.freeze(v)
    for (const x of Object.values(v)) freeze(x)
  }
  return v
}

// The entry `text` holds, frozen, or `{ bad: why, id }` (id null unless the
// text names one). It never throws, whatever it is handed: a peer's junk is
// refused, never a crash in every peer's fold.
export function decode(text) {
  if (typeof text !== 'string') return { bad: 'not text', id: null }
  if (utf8Length(text) > MAX_BYTES) return { bad: `over ${MAX_BYTES} bytes`, id: null }
  let e
  try {
    e = JSON.parse(text)
  } catch {
    return { bad: 'not JSON', id: null }
  }
  const id = record(e) && isName(e.id) ? e.id : null
  const why = whyNot(e)
  if (why) return { bad: why, id }
  // (a number past the double range, 1e999, parses to ±Infinity, which has
  // no canonical text: refused, never thrown)
  let canon
  try {
    canon = canonicalJSON(e)
  } catch {
    return { bad: 'not canonical JSON', id }
  }
  if (canon !== text) return { bad: 'not canonical JSON', id }
  return freeze(e)
}
