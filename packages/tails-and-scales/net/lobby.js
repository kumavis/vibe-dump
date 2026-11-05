// The lobby (DESIGN §2.7, N2): the part of a match document before its
// start, a last-writer-wins map every peer edits, which the fold never
// reads (the start copies what it needs):
//
//   lobby: { host, board, mission, terrain, rounds, overtime, fog,
//            seats: { s0: { ctrl, dev, name, race, army, ready, nonce }, s1: … },
//            next }
//
// host: the device that made the match (it wrote the log's `open`, and only
// its start counts: match/fold.js); board, mission, terrain, rounds,
// overtime: the battle (F8a: the mission, `classic` in a lobby written
// before missions), the host's to change until the start (a change un-readies both
// seats); seats: a claimed seat's record, its own device's to change (a
// change of race or name un-readies it), keyed s0 and s1 so two devices
// claiming one seat at once leave one claim standing everywhere (the
// loser sees another device in it: "seat taken"); (F16) fog: the courtesy
// fog of war, the host's to turn on or off beside the battle (a change
// un-readies both seats, so both Readys are the agreement), which no start
// carries (the fold never hears of it: each page reads it from the lobby
// as its battle begins, app/online.js, and hides in its own view what its
// seat can't see); next: the rematch's
// document id, once someone asks for one. Plain fields of a map, so F8a's
// `mission` and F11b's `army` joined without a schema change.
//
// (F11b, DESIGN §4.2.8.9) A seat's `army`: a preset's name or a list's
// digits (core/army.js's, judged by the start's check as the fold judges
// it), or absent for the mission's own preset, the start's seat then
// naming none. The seat's own device writes it (the Muster screen's Ready,
// the army line's preset: app/online.js), and a change of it un-readies
// the seat, as a race's does; a race change lets it go unless the same
// change names another (a list's digits are other units in another race's
// roster: the caller passes the race's last list, or nothing). The start
// carries it (startSeat), so verifyStart holds each peer's own army in the
// start to the one it readied with. Courtesy sealing is the page's
// (app/online.js hands the lobby screen a total and a count for a seat not
// its own): the document itself is readable by anyone with the link (the
// trust of v1's friendly dice, §4.2.8.9).
//
// (F11b) An AI seat online: the host may seat the AI in a free seat
// (seatAI), a record of its own say, `ctrl: 'ai'`, its `dev` the host's
// (the device that answers for it: no other may change or unseat it), its
// nonce '' (an AI brings none to the dice, as the host's seat does), ready
// as the host writes it. The AI plays inside the fold on every peer (match/
// session.js: it appends nothing), so the seat needs no device to play it;
// its `dev` says whose it is, and the host's page holds the start to it as
// to a seat it readied.
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
export function lobbyDoc({ host, board, mission = 'classic', terrain = 'classic', rounds, overtime = 'vote', fog = false, me }) {
  return { ...matchDoc(), lobby: { host, board, mission, terrain, rounds, overtime, fog: fog === true, seats: { s0: { ...me, ready: false, nonce: '' } }, next: null } }
}

// the lobby of a document as it stands, read safely (a peer may have
// written anything)
export function lobbyOf(doc) {
  const L = doc?.lobby
  // ((F11b) a seat's army a string, or absent: anything else a peer wrote
  // reads as absent, the mission's preset)
  const rec = (r) => (r && typeof r === 'object' && typeof r.dev === 'string' ? { ctrl: r.ctrl, dev: r.dev, name: String(r.name ?? ''), race: r.race, ...(typeof r.army === 'string' ? { army: r.army } : {}), ready: r.ready === true, nonce: typeof r.nonce === 'string' ? r.nonce : '' } : null)
  return {
    host: typeof L?.host === 'string' ? L.host : null,
    board: Number.isInteger(L?.board) ? L.board : null,
    mission: L?.mission ?? 'classic',
    // (null: the mission's own first set, filled in by the start's setup;
    // a lobby whose mission changed has none until one is chosen)
    terrain: L?.terrain ?? null,
    rounds: Number.isInteger(L?.rounds) ? L.rounds : null,
    overtime: L?.overtime ?? 'vote',
    // ((F16) off unless the host turned it on: a lobby written before F16
    // has none)
    fog: L?.fog === true,
    seats: SEAT_KEYS.map((k) => rec(L?.seats?.[k])),
    next: typeof L?.next === 'string' ? L.next : null,
  }
}

// the seat this device sits in, or -1 ((F11b) never the host's AI seat,
// which names the host's device but is sat in by no one)
export const seatOf = (lobby, dev) => lobby.seats.findIndex((r) => r?.dev === dev && r.ctrl !== 'ai')

// Both seats claimed by two devices, each with a name and a nonce of the
// form a start carries ('' for the host's), and both ready. (What the rules
// make of the rest, a race, an army or a battle no game knows, is the
// start's check: app/online.js's.) (F11b) Or one seat a human's and the
// other the AI's, seated by the host (its dev the host's, its nonce ''):
// the human seat the host's own or a guest's, two human seats still two
// devices.
const humanOk = (r) => r.ctrl === 'human' && (r.nonce === '' || isNonce(r.nonce))
const aiOk = (r, host) => r.ctrl === 'ai' && r.dev === host && r.nonce === ''
export const ready = (lobby) => lobby.seats.every((r) => r?.ready && nameOk(r.name) && isDevice(r.dev) && (humanOk(r) || aiOk(r, lobby.host))) && lobby.seats.some((r) => r.ctrl === 'human') && (lobby.seats.some((r) => r.ctrl === 'ai') || lobby.seats[0].dev !== lobby.seats[1].dev)

// a seat's record as the start writes it (and verifyStart compares): all
// but `ready` ((F11b) its army only where it names one, so a seat on its
// mission's preset names none in the start either)
export const startSeat = (r) => ({ race: r.race, ctrl: r.ctrl, dev: r.dev, name: r.name, nonce: r.nonce, ...(typeof r.army === 'string' ? { army: r.army } : {}) })

// The start's setup from a ready lobby and its dice (net/seed.js).
export const setupOf = (lobby, dice) => ({
  board: lobby.board, dice, mission: lobby.mission, terrain: lobby.terrain, rounds: lobby.rounds, overtime: lobby.overtime, diceMode: 'shared',
  seats: lobby.seats.map(startSeat),
})

// ── Edits (each one change of its own) ────────────────────────────────────
// Sit in a free seat: a fresh record (a guest's nonce its own, the host's
// ''), leaving any other seat this device held. False when the seat is
// someone else's already, as this device sees it ((F11b) or the AI's: the
// host unseats it first; and the host's AI seat is never the seat it
// leaves).
export function claim(handle, i, { dev, name, race, host }) {
  const k = SEAT_KEYS[i]
  const now = lobbyOf(handle.doc()).seats[i]
  if (now && (now.dev !== dev || now.ctrl === 'ai')) return false
  handle.change((d) => {
    for (const other of SEAT_KEYS) if (other !== k && d.lobby.seats[other]?.dev === dev && d.lobby.seats[other].ctrl !== 'ai') delete d.lobby.seats[other]
    d.lobby.seats[k] = { ctrl: 'human', dev, name: fitName(name), race, ready: false, nonce: dev === host ? '' : newNonceOf(now, dev) }
  })
  return true
}
// (a seat this device already holds keeps its nonce)
const newNonceOf = (now, dev) => (now?.dev === dev && isNonce(now.nonce) ? now.nonce : newNonce())

// Leave a seat this device holds.
export function leave(handle, i, dev) {
  const k = SEAT_KEYS[i], now = lobbyOf(handle.doc()).seats[i]
  if (now?.dev !== dev || now.ctrl === 'ai') return
  handle.change((d) => {
    delete d.lobby.seats[k]
  })
}

// Change this device's own seat: its race or name (un-readying it), or its
// Ready (with the nonce it readies with, `nonce`: drawn by this device once
// the log's open is in). False when the seat isn't this device's. (F11b)
// Its army (`army`: a string, or null for the mission's preset), which
// un-readies it as any change does; a race change lets the army go unless
// the same change names one (the race's last list for this mission, as the
// battle-setup panel's line takes it). (Never the host's AI seat: seatAI
// is its edit.)
export function editSeat(handle, i, dev, fields) {
  const k = SEAT_KEYS[i], now = lobbyOf(handle.doc()).seats[i]
  if (now?.dev !== dev || now.ctrl === 'ai') return false
  handle.change((d) => {
    const r = d.lobby.seats[k]
    if (fields.race !== undefined && fields.race !== r.race && fields.army === undefined && 'army' in r) delete r.army
    if (fields.race !== undefined) r.race = fields.race
    if (fields.name !== undefined) r.name = fitName(fields.name)
    if (fields.nonce !== undefined) r.nonce = fields.nonce
    if (typeof fields.army === 'string') r.army = fields.army
    else if (fields.army === null && 'army' in r) delete r.army
    r.ready = fields.ready === true
  })
  return true
}

// (F11b) The host seats the AI in seat i: a seat free, or the AI's already
// (its race or army changed: the record written afresh), as the host's
// own say: `ctrl: 'ai'`, the host's dev, a name, its race, its army (a
// string, or none for the mission's preset), its nonce '', and its Ready
// (`ready`, true unless the caller says not). False when the seat is a
// human's, or the device isn't the lobby's host.
export const AI_NAME = 'The AI'
export function seatAI(handle, i, { host, race, army = null, ready = true }) {
  const k = SEAT_KEYS[i], L = lobbyOf(handle.doc()), now = L.seats[i]
  if (L.host !== host || (now && !(now.ctrl === 'ai' && now.dev === host))) return false
  handle.change((d) => {
    d.lobby.seats[k] = { ctrl: 'ai', dev: host, name: AI_NAME, race, ...(typeof army === 'string' ? { army } : {}), ready: ready === true, nonce: '' }
  })
  return true
}

// (F11b) The host takes the AI out of seat i (the seat free again). False
// when it isn't the host's AI there.
export function unseatAI(handle, i, host) {
  const k = SEAT_KEYS[i], L = lobbyOf(handle.doc()), now = L.seats[i]
  if (L.host !== host || !(now?.ctrl === 'ai' && now.dev === host)) return false
  handle.change((d) => {
    delete d.lobby.seats[k]
  })
  return true
}

// The host changes the battle (the board, the mission, (F7a) the terrain,
// (F16) the fog): both seats un-readied. A new mission lets the old one's terrain and rounds
// go: the start's setup takes the new mission's first set and its rounds,
// unless the same change names a terrain (one of the new mission's sets:
// the lobby screen offers no other, and the start's check refuses any).
// (F8b) It is the battle's size (Skirmish, Field, Grand), so it lets each
// seat's army go too (F11b's lists, judged against the old size's limits):
// each seat its new mission's preset. (F11b) An AI seat is un-readied with
// the rest: the host's page readies it again as its own say, under the
// battle as it now stands (app/online.js), so the AI's Ready, like each
// human's, is to the battle as changed.
export function editBattle(handle, fields) {
  handle.change((d) => {
    if (fields.board !== undefined) d.lobby.board = fields.board
    if (fields.mission !== undefined && fields.mission !== (d.lobby.mission ?? 'classic')) {
      d.lobby.mission = fields.mission
      delete d.lobby.terrain
      delete d.lobby.rounds
      for (const k of SEAT_KEYS) if (d.lobby.seats[k] && 'army' in d.lobby.seats[k]) delete d.lobby.seats[k].army
    }
    if (fields.terrain !== undefined) d.lobby.terrain = fields.terrain
    if (fields.fog !== undefined) d.lobby.fog = fields.fog === true
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
