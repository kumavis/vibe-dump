// The joint dice seed and the start's check (DESIGN §2.7, N2). The host
// draws a secret `a` (16 random bytes, as hex, kept in its localStorage per
// match) and opens the log with its commitment, `open {commit}`,
// commit = hex(sha256(a)); each guest seat brings a nonce of its own in its
// lobby record; the start reveals `a`, and its dice are
//
//   dice = u32be(sha256(a ‖ ':' ‖ documentId ‖ ':' ‖ nonce0 ‖ ':' ‖ nonce1))
//
// (each seat's nonce as the start writes it: '' for the host's seat and an
// AI's). So no one picks the dice: the host commits before any guest draws
// its nonce (a guest's page draws it as it presses Ready, once the open is
// in the log, and keeps the commitment it saw with the record it readied),
// and doesn't know the nonce when it commits; a guest knows the commitment,
// not the secret. ("Friendly" dice, §2.7: the seed is public once the start
// is written.)
//
// verifyStart runs once, asynchronously, outside the fold, when a client
// first sees the start. It checks the reveal against the commitment, that
// the dice re-derive, and this client's whole seat: every field of the
// lobby record it readied (all but `ready`: race, ctrl, dev, name, nonce,
// and from F11b army) must be the start's seat as written, a field absent
// on one side absent on the other, and no seat of the start may name this
// device unless it readied that seat so. Only records readied under this
// match's commitment count. A failure makes the match read-only here, with
// why ("The start changed your seat (ctrl)"). A page that kept no record
// (another browser opened with the seat's `&dev=` link, storage cleared) has
// nothing to hold the seat to: it checks the seed alone, and its caller
// says so.
//
// sha256 is the browser's (crypto.subtle; Node's global crypto too).

const encoder = new TextEncoder()
const hex = (buf) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
const sha256 = (text) => crypto.subtle.digest('SHA-256', encoder.encode(text))

// the host's commitment to `a`
export const commitOf = async (a) => hex(await sha256(a))

// the dice a start's seats and the reveal make
export async function diceOf({ a, documentId, nonces }) {
  return new DataView(await sha256([a, documentId, ...nonces].join(':'))).getUint32(0, false)
}

// the fields of a seat record the start must carry as readied (all but
// `ready`), and the first that differ, or none
export function seatDiff(record, seat) {
  const keys = [...new Set([...Object.keys(record ?? {}), ...Object.keys(seat ?? {})])].filter((k) => k !== 'ready').sort()
  return keys.filter((k) => Object.hasOwn(record ?? {}, k) !== Object.hasOwn(seat ?? {}, k) || record[k] !== seat[k])
}

// Why the start can't be trusted here, or null.
//   open, start: the log's accepted `open` and `start` entries (decoded)
//   documentId: the match document's id
//   mine: { dev, readied: [{ seat, record, commit }, …] }, this device and
//     every lobby record it pressed Ready on in this match, with the
//     commitment the log had opened with then (any of them will do: a start
//     built from the lobby as it stood at an earlier Ready, the record
//     unchanged since, is one this device agreed to); null for a page that
//     keeps none (a spectator's)
export async function verifyStart({ open, start, documentId, mine = null }) {
  if (open?.t !== 'open' || typeof start?.a !== 'string') return 'seed check failed: the match has no seed commitment'
  if ((await commitOf(start.a)) !== open.commit) return 'seed check failed: the start reveals another secret than the one the match opened with'
  const seats = Array.isArray(start.setup?.seats) ? start.setup.seats : []
  const dice = await diceOf({ a: start.a, documentId, nonces: seats.map((s) => (typeof s?.nonce === 'string' ? s.nonce : '')) })
  if (start.setup.dice !== dice) return "seed check failed: the dice aren't the ones the seats' nonces make"
  if (!mine) return null
  const readied = (mine.readied ?? []).filter((r) => r.commit === open.commit)
  if (!readied.length) return null
  const match = (i) => readied.some((r) => r.seat === i && !seatDiff(r.record, seats[i]).length)
  // the seat this device readied last, as the start writes it
  const last = readied.at(-1)
  if (last && !match(last.seat) && !readied.some((r) => match(r.seat))) return `The start changed your seat (${seatDiff(last.record, seats[last.seat]).join(', ')})`
  const unasked = seats.findIndex((s, i) => s?.dev === mine.dev && !match(i))
  if (unasked >= 0) return `The start gave you a seat you never readied (seat ${unasked + 1})`
  return null
}
