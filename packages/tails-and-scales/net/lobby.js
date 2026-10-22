// The lobby (DESIGN §2.7, N2): the part of a match document before its
// start, a last-writer-wins map every peer edits, which the fold never
// reads (the start copies what it needs):
//
//   lobby: { host, board, terrain, rounds, overtime,
//            seats: { s0: { ctrl, dev, name, race, ready, nonce }, s1: … },
//            next }
//
// host: the device that made the match (it wrote the log's `open`, and only
// its start counts: match/fold.js); board, terrain, rounds, overtime: the
// battle, the host's to change until the start (a change un-readies both
// seats); seats: a claimed seat's record, its own device's to change (a
// change of race or name un-readies it), keyed s0 and s1 so two devices
// claiming one seat at once leave one claim standing everywhere (the
// loser sees another device in it: "seat taken"); next: the rematch's
// document id, once someone asks for one. Plain fields of a map, so F8a's
// `mission` and F11b's `army` join without a schema change.
//
// The edits are automerge-repo changes on the document handle; the reads
// take the document as it stands (handle.doc()). Nothing here is trusted
// by the fold: a peer may write anything into the lobby, and the start is
// what every peer folds, each client holding its own seat in it to what it
// readied (net/seed.js's verifyStart).
import { matchDoc } from './automerge-store.js'
import { fitName, nameOk, isNonce, isDevice, newNonce } from './ids.js'

export const SEAT_KEYS = Object.freeze(['s0', 's1'])

// A new match document: the lobby as its host makes it, the host in seat 0
// (`me`: its seat record, nonce '' as the host's always is), and an empty
// log (the host's Session writes its `open` next).
export function lobbyDoc({ host, board, terrain = 'classic', rounds, overtime = 'vote', me }) {
  return { ...matchDoc(), lobby: { host, board, terrain, rounds, overtime, seats: { s0: { ...me, ready: false, nonce: '' } }, next: null } }
}

// the lobby of a document as it stands, read safely (a peer may have
// written anything)
export function lobbyOf(doc) {
  const L = doc?.lobby
  const rec = (r) => (r && typeof r === 'object' && typeof r.dev === 'string' ? { ctrl: r.ctrl, dev: r.dev, name: String(r.name ?? ''), race: r.race, ready: r.ready === true, nonce: typeof r.nonce === 'string' ? r.nonce : '' } : null)
  return {
    host: typeof L?.host === 'string' ? L.host : null,
    board: Number.isInteger(L?.board) ? L.board : null,
    terrain: L?.terrain ?? 'classic',
    rounds: Number.isInteger(L?.rounds) ? L.rounds : null,
    overtime: L?.overtime ?? 'vote',
    seats: SEAT_KEYS.map((k) => rec(L?.seats?.[k])),
    next: typeof L?.next === 'string' ? L.next : null,
  }
}

// the seat this device sits in, or -1
export const seatOf = (lobby, dev) => lobby.seats.findIndex((r) => r?.dev === dev)

// Both seats claimed by two devices, each with a name and a nonce of the
// form a start carries ('' for the host's), and both ready. (What the rules
// make of the rest, a race or a battle no game knows, is the start's check:
// app/online.js's.)
export const ready = (lobby) => lobby.seats.every((r) => r?.ready && r.ctrl === 'human' && nameOk(r.name) && isDevice(r.dev) && (r.nonce === '' || isNonce(r.nonce))) && lobby.seats[0].dev !== lobby.seats[1].dev

// a seat's record as the start writes it (and verifyStart compares): all
// but `ready`
export const startSeat = (r) => ({ race: r.race, ctrl: r.ctrl, dev: r.dev, name: r.name, nonce: r.nonce })

// The start's setup from a ready lobby and its dice (net/seed.js).
export const setupOf = (lobby, dice) => ({
  board: lobby.board, dice, terrain: lobby.terrain, rounds: lobby.rounds, overtime: lobby.overtime, diceMode: 'shared',
  seats: lobby.seats.map(startSeat),
})

// ── Edits (each one change of its own) ────────────────────────────────────
// Sit in a free seat: a fresh record (a guest's nonce its own, the host's
// ''), leaving any other seat this device held. False when the seat is
// someone else's already, as this device sees it.
export function claim(handle, i, { dev, name, race, host }) {
  const k = SEAT_KEYS[i]
  const now = lobbyOf(handle.doc()).seats[i]
  if (now && now.dev !== dev) return false
  handle.change((d) => {
    for (const other of SEAT_KEYS) if (other !== k && d.lobby.seats[other]?.dev === dev) delete d.lobby.seats[other]
    d.lobby.seats[k] = { ctrl: 'human', dev, name: fitName(name), race, ready: false, nonce: dev === host ? '' : newNonceOf(now, dev) }
  })
  return true
}
// (a seat this device already holds keeps its nonce)
const newNonceOf = (now, dev) => (now?.dev === dev && isNonce(now.nonce) ? now.nonce : newNonce())

// Leave a seat this device holds.
export function leave(handle, i, dev) {
  const k = SEAT_KEYS[i]
  if (lobbyOf(handle.doc()).seats[i]?.dev !== dev) return
  handle.change((d) => {
    delete d.lobby.seats[k]
  })
}

// Change this device's own seat: its race or name (un-readying it), or its
// Ready (with the nonce it readies with, `nonce`: drawn by this device once
// the log's open is in). False when the seat isn't this device's.
export function editSeat(handle, i, dev, fields) {
  const k = SEAT_KEYS[i]
  if (lobbyOf(handle.doc()).seats[i]?.dev !== dev) return false
  handle.change((d) => {
    const r = d.lobby.seats[k]
    if (fields.race !== undefined) r.race = fields.race
    if (fields.name !== undefined) r.name = fitName(fields.name)
    if (fields.nonce !== undefined) r.nonce = fields.nonce
    r.ready = fields.ready === true
  })
  return true
}

// The host changes the battle (the board): both seats un-readied.
export function editBattle(handle, fields) {
  handle.change((d) => {
    if (fields.board !== undefined) d.lobby.board = fields.board
    for (const k of SEAT_KEYS) if (d.lobby.seats[k]) d.lobby.seats[k].ready = false
  })
}

// The rematch's document, once: false when another is named already.
export function setNext(handle, id) {
  if (lobbyOf(handle.doc()).next) return false
  handle.change((d) => {
    d.lobby.next = id
  })
  return true
}
