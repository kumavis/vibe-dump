// The net layer's checks in Node (N2: DESIGN §2.7, §4.2.10's "N2 must"):
//
//   names     a display name normalised (NFC; control characters and lone
//             surrogates removed; white space one space; trimmed) and cut to
//             24 characters and 48 bytes of canonical JSON; a nonce 16 hex
//             characters; a device id 8 base36 characters
//   seed      the commitment and the dice: sha256 known answers; the dice
//             re-derived from the reveal, the document and the seats' nonces
//   verify    verifyStart passes a start built from the lobby as readied,
//             and fails, saying which field, a start whose seed doesn't hold
//             (another secret, other dice) or that changed this device's
//             seat: its ctrl flipped to ai, its dev swapped for the host's,
//             its race, name or nonce changed, a field only one side has,
//             or a seat it never readied; a spectator's page checks the seed
//   lobby     through a real sync server (sim/sync-server.mjs) and three
//             Node repos on websockets: the host makes the match (its
//             open), two guests claim the same seat at once and one claim
//             stands on every page; concurrent edits of both seats settle
//             to one lobby everywhere; the start the host writes from the
//             ready lobby verifies on both seated devices, and a start the
//             host altered fails the guest's check
//   battle    a whole online battle through the server: both seats played
//             from their own devices (the AI's `auto` on their behalf), a
//             watching device beside them, every page folding the same log
//             to the same match, over at the end; each seated device then
//             says its closing hash (a `final`), every page finding both
//             agree, none frozen
//
//   node sim/net-check.mjs
//
// Exit 0 when every check holds, 1 otherwise.
import { isDeepStrictEqual } from 'node:util'
import { Repo } from '@automerge/automerge-repo'
import { WebSocketClientAdapter } from '@automerge/automerge-repo-network-websocket'
import { AutomergeStore } from '../net/automerge-store.js'
import { fitName, nameOk, nameBytes, isNonce, isDevice, newNonce, deviceId, MAX_NAME_CHARS, MAX_NAME_BYTES } from '../net/ids.js'
import { commitOf, diceOf, verifyStart, seatDiff } from '../net/seed.js'
import { lobbyOf, claim, editSeat, ready, setupOf, startSeat, seatOf } from '../net/lobby.js'
import { Session } from '../match/session.js'
import { stateHash } from '../core/index.js'
import { startSyncServer } from './sync-server.mjs'
import { makeMatch, autoplay } from './online-fixture.mjs'

let failed = 0
const check = (ok, what, detail = '') => {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}${!ok && detail ? `: ${detail}` : ''}`)
  if (!ok) failed++
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
// wait until `fn()` holds (a sync's round trips), or give up
async function until(fn, ms = 8000) {
  const t0 = Date.now()
  while (Date.now() - t0 < ms) {
    if (fn()) return true
    await sleep(25)
  }
  return fn()
}

console.log('names')
{
  const cases = [
    ['  Ann  ', 'Ann'], ['a\u0007b\u001b', 'ab'], ['Bo\t\nb', 'Bob'], ['Bo  \u00a0b', 'Bo b'], ['éclair', 'éclair'], ['a\ud800b', 'ab'], ['x\udc00', 'x'],
    ['x'.repeat(30), 'x'.repeat(24)], ['😀'.repeat(20), '😀'.repeat(12)], ['"\\'.repeat(20), '"\\'.repeat(12)], ['é'.repeat(30), 'é'.repeat(24)],
  ]
  const bad = cases.filter(([raw, want]) => fitName(raw) !== want).map(([raw, want]) => `${JSON.stringify(raw)} → ${JSON.stringify(fitName(raw))}, not ${JSON.stringify(want)}`)
  check(!bad.length, 'names are normalised (NFC, no control characters or lone surrogates, white space one space, trimmed) and cut to the caps', bad.join('; '))
  const capped = cases.map(([raw]) => fitName(raw)).every((n) => [...n].length <= MAX_NAME_CHARS && nameBytes(n) <= MAX_NAME_BYTES && nameOk(n))
  check(capped && nameBytes('😀'.repeat(12)) === 48 && nameBytes('"\\'.repeat(12)) === 48, `every fitted name is at most ${MAX_NAME_CHARS} characters and ${MAX_NAME_BYTES} bytes of canonical JSON (an emoji 4, a quote or backslash 2)`)
  check(!nameOk('') && !nameOk(' Ann') && !nameOk('a\u0007') && !nameOk('x'.repeat(25)) && nameOk('Ann Lee'), 'nameOk takes only a fitted, non-empty name')
  check(fitName('Ann ', { typing: true }) === 'Ann ' && fitName(' Ann', { typing: true }) === 'Ann', 'a name box keeps a trailing space while typing (the next word), never a leading one')
  const n = newNonce(), store = new Map()
  const dev = deviceId({ getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) })
  check(isNonce(n) && n.length === 16 && !isNonce('ABCDEF0123456789') && !isNonce('0'.repeat(15)), 'a nonce is 16 lowercase hex characters')
  check(isDevice(dev) && deviceId({ getItem: (k) => store.get(k), setItem: () => {} }) === dev && isDevice(deviceId({ getItem: () => { throw new Error('blocked') } })), "a device id is 8 base36 characters, kept in storage as 'ts.dev', fresh when storage throws")
}

console.log('seed')
{
  check((await commitOf('abc')) === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad', 'the commitment is hex(sha256(a)) (the known answer for "abc")')
  const d = await diceOf({ a: 'abc', documentId: 'doc', nonces: ['', '0123456789abcdef'] })
  const raw = Buffer.from(await crypto.subtle.digest('SHA-256', new TextEncoder().encode('abc:doc::0123456789abcdef')))
  check(d === raw.readUInt32BE(0) && Number.isInteger(d) && d >= 0 && d <= 0xffffffff, 'the dice are u32be(sha256(a:documentId:nonce0:nonce1)), a seed a setup takes')
  check(d !== (await diceOf({ a: 'abc', documentId: 'doc', nonces: ['', '0123456789abcdee'] })) && d !== (await diceOf({ a: 'abc', documentId: 'doc2', nonces: ['', '0123456789abcdef'] })), 'another nonce or another document makes other dice')
}

console.log('verify')
{
  const host = 'hosthost', guest = 'guestgst', a = 'f'.repeat(32), documentId = 'docdocdoc'
  const seats = [{ race: 'squirrel', ctrl: 'human', dev: host, name: 'Ann', nonce: '' }, { race: 'serpent', ctrl: 'human', dev: guest, name: 'Ben', nonce: '0123456789abcdef' }]
  const open = { t: 'open', commit: await commitOf(a) }
  const startOf = async (ss, { aa = a, dice } = {}) => ({ t: 'start', a: aa, setup: { board: 1, dice: dice ?? (await diceOf({ a: aa, documentId, nonces: ss.map((s) => s.nonce) })), seats: ss } })
  const mine = { dev: guest, readied: [{ seat: 1, record: { ...seats[1] } }] }
  const v = async (start, m = mine) => verifyStart({ open, start, documentId, mine: m })
  check((await v(await startOf(seats))) === null, 'a start built from the lobby as readied passes, on the guest and the host')
  check((await v(await startOf(seats), { dev: host, readied: [{ seat: 0, record: seats[0] }] })) === null && (await v(await startOf(seats), null)) === null, '… and on the host, and on a spectator (no seat: the seed checked)')
  check(/^seed check failed/.test((await v(await startOf(seats, { aa: 'e'.repeat(32) }))) ?? ''), 'another secret than the one the log opened with fails (seed check failed)')
  check(/^seed check failed/.test((await v(await startOf(seats, { dice: 7 }))) ?? ''), "dice the seats' nonces don't make fail (seed check failed)")
  const altered = [
    ['ctrl', { ctrl: 'ai' }], ['dev', { dev: host }], ['race', { race: 'squirrel' }], ['name', { name: 'Bob' }], ['nonce', { nonce: 'fedcba9876543210' }], ['army', { army: '224222' }],
  ]
  for (const [field, change] of altered) {
    const ss = [seats[0], { ...seats[1], ...change }]
    const why = await v(await startOf(ss))
    check(why === `The start changed your seat (${field})`, `a start with the guest's ${field} changed fails: "The start changed your seat (${field})"`, why)
  }
  const twice = await v(await startOf([{ ...seats[0], dev: guest }, seats[1]]))
  check(twice === 'The start gave you a seat you never readied (seat 1)', "a start that also seats the guest's device in a seat it never readied fails", twice)
  const earlier = { dev: guest, readied: [{ seat: 1, record: { ...seats[1], race: 'squirrel' } }, { seat: 1, record: seats[1] }, { seat: 1, record: { ...seats[1], name: 'Benny' } }] }
  check((await v(await startOf(seats), earlier)) === null, 'a start from any record the guest readied passes (a start built as it changed its seat again)')
  check(isDeepStrictEqual(seatDiff({ a: 1, ready: true }, { a: 1 }), []) && isDeepStrictEqual(seatDiff({ a: 1 }, { a: 1, b: undefined }), ['b']), 'a seat is compared whole but for ready, a field absent on one side and present on the other a difference')
}

console.log('lobby (through a sync server)')
const server = await startSyncServer()
const repos = []
const repoOn = () => {
  const r = new Repo({ network: [new WebSocketClientAdapter(server.url, 200)] })
  repos.push(r)
  return r
}
try {
  const [hostRepo, g1Repo, g2Repo] = [repoOn(), repoOn(), repoOn()]
  const host = 'hosthost', g1 = 'guestaaa', g2 = 'guestbbb'
  const { handle: H, a } = await makeMatch(hostRepo, { host, seats: [{ dev: host, name: 'Ann', race: 'squirrel' }], start: false, AutomergeStore })
  // (makeMatch readies seat 0 and leaves seat 1 free)
  H.change((d) => {
    delete d.lobby.seats.s1
  })
  const id = H.documentId
  const [h1, h2] = await Promise.all([g1Repo.find(id), g2Repo.find(id)])
  check(lobbyOf(h1.doc()).host === host && h1.doc().log.length === 1, "a guest finds the match by its id through the server: the lobby and the log's open")
  // two guests claim seat 1 at once, each seeing it free
  claim(h1, 1, { dev: g1, name: 'Ben', race: 'serpent', host })
  claim(h2, 1, { dev: g2, name: 'Cat', race: 'serpent', host })
  const devOf = (h) => lobbyOf(h.doc()).seats[1]?.dev
  await until(() => [H, h1, h2].every((h) => devOf(h) === devOf(H) && devOf(H)))
  const winner = devOf(H)
  check([g1, g2].includes(winner) && [H, h1, h2].every((h) => devOf(h) === winner), `two guests claiming seat 2 at once: one claim stands on every page (${winner})`, [H, h1, h2].map(devOf).join(', '))
  const [wh, lh] = winner === g1 ? [h1, h2] : [h2, h1]
  const loser = winner === g1 ? g2 : g1
  check(seatOf(lobbyOf(lh.doc()), loser) < 0 && !claim(lh, 1, { dev: loser, name: 'Cat', race: 'serpent', host }), "the other sees another device in the seat (seat taken), and can't claim it now")
  // concurrent edits of both seats settle to one lobby
  editSeat(H, 0, host, { name: 'Annie', race: 'serpent' })
  editSeat(wh, 1, winner, { name: 'Benny', race: 'squirrel' })
  await until(() => isDeepStrictEqual(lobbyOf(H.doc()), lobbyOf(wh.doc())) && lobbyOf(H.doc()).seats[1].name === 'Benny' && lobbyOf(wh.doc()).seats[0].name === 'Annie')
  check(isDeepStrictEqual(lobbyOf(H.doc()), lobbyOf(wh.doc())) && isDeepStrictEqual(lobbyOf(H.doc()), lobbyOf(lh.doc())) && lobbyOf(H.doc()).seats[0].race === 'serpent', 'concurrent edits of both seats settle to the same lobby on every page')
  // ready, and the start from the lobby
  editSeat(H, 0, host, { ready: true })
  editSeat(wh, 1, winner, { ready: true })
  await until(() => ready(lobbyOf(H.doc())) && ready(lobbyOf(wh.doc())))
  const L = lobbyOf(H.doc())
  check(ready(L), 'both seats ready on the host page')
  const readied = (dev, i) => ({ dev, readied: [{ seat: i, record: startSeat(lobbyOf(H.doc()).seats[i]) }] })
  const hs = new Session({ store: new AutomergeStore(H), dev: host })
  hs.start(setupOf(L, await diceOf({ a, documentId: id, nonces: L.seats.map((r) => r.nonce) })), { a })
  const gs = new Session({ store: new AutomergeStore(wh), dev: winner })
  await until(() => gs.status === 'live' && gs.accepted.length === hs.accepted.length)
  const verified = async (ses, mine) => {
    const list = ses.store.entries(), [open, start] = ses.accepted.slice(0, 2).map((k) => list.find((e) => e.id === k))
    return verifyStart({ open, start, documentId: id, mine })
  }
  check(gs.status === 'live' && stateHash(gs.G) === stateHash(hs.G), 'the host writes the start; the guest folds it to the same match')
  check((await verified(gs, readied(winner, 1))) === null && (await verified(hs, readied(host, 0))) === null, "verifyStart passes on both seated devices (the host's own seat too)")
  for (const s of [hs, gs]) s.close()
  // a host that alters the guest's seat in the start: a fresh match
  {
    const { handle: H2, a: a2 } = await makeMatch(hostRepo, { host, seats: [{ dev: host, name: 'Ann', race: 'squirrel' }, { dev: winner, name: 'Ben', race: 'serpent' }], start: false, AutomergeStore })
    const L2 = lobbyOf(H2.doc())
    const theirs = { dev: winner, readied: [{ seat: 1, record: startSeat(L2.seats[1]) }] }
    const setup = setupOf(L2, await diceOf({ a: a2, documentId: H2.documentId, nonces: L2.seats.map((r) => r.nonce) }))
    setup.seats[1] = { ...setup.seats[1], ctrl: 'ai' }
    const s2 = new Session({ store: new AutomergeStore(H2), dev: host })
    s2.start(setup, { a: a2 })
    const g2h = await (winner === g1 ? g1Repo : g2Repo).find(H2.documentId)
    const gs2 = new Session({ store: new AutomergeStore(g2h), dev: winner })
    await until(() => gs2.status === 'live')
    const list = gs2.store.entries(), [open, start] = gs2.accepted.slice(0, 2).map((k) => list.find((e) => e.id === k))
    const why = await verifyStart({ open, start, documentId: H2.documentId, mine: theirs })
    check(why === 'The start changed your seat (ctrl)', "a start in which the host flipped the guest's seat to the AI fails the guest's check: \"The start changed your seat (ctrl)\"", why)
    for (const s of [s2, gs2]) s.close()
  }

  console.log('battle (through a sync server)')
  {
    const [p0, p1, ps] = [repoOn(), repoOn(), repoOn()]
    const d0 = 'seatzero', d1 = 'seatoneo'
    const { handle: H3, setup } = await makeMatch(p0, { host: d0, seats: [{ dev: d0, name: 'Ann', race: 'squirrel' }, { dev: d1, name: 'Ben', race: 'serpent' }], overtime: 'never', AutomergeStore })
    const id3 = H3.documentId
    const [h1b, hsb] = await Promise.all([p1.find(id3), ps.find(id3)])
    const stores = [new AutomergeStore(H3), new AutomergeStore(h1b), new AutomergeStore(hsb)]
    // each seat's page: a Session for its seat, closing on; the watcher's
    const pages = [0, 1].map((i) => new Session({ store: stores[i], localSeats: [i], dev: [d0, d1][i], rand: () => Math.random().toString(36).slice(2, 6), closing: true }))
    const watcher = new Session({ store: stores[2], dev: 'watchers' })
    // each page answers its own seat's decisions as they come (the AI's
    // auto, a deployment as it stands), on the head it sees
    const answer = (p, i) => {
      if (p.status !== 'live' || p.decisionFor() !== i) return
      const P = p.G.pending
      const body = P.k === 'deploy' ? { t: 'deployed' } : P.k === 'phase' ? { t: 'auto' } : null
      if (body && !p.legal(i, body)) p.submit(i, body)
    }
    const t0 = Date.now()
    let steps = 0
    while (Date.now() - t0 < 120000 && !pages.every((p) => p.status === 'over' && p.folder.finals.size === 2)) {
      pages.forEach(answer)
      steps++
      await sleep(20)
    }
    await until(() => watcher.count === pages[0].count && pages[1].count === pages[0].count, 15000)
    const all = [...pages, watcher]
    check(pages.every((p) => p.status === 'over'), `both seats played the battle from their own devices to its end (${pages[0].accepted.length} entries accepted, ${((Date.now() - t0) / 1000).toFixed(1)} s)`, pages.map((p) => `${p.status} ${p.accepted.length}`).join(', '))
    check(all.every((p) => isDeepStrictEqual(p.accepted, pages[0].accepted) && stateHash(p.G) === stateHash(pages[0].G)), 'every page, the watcher too, accepted the same entries and holds the same match')
    const finals = stores[0].entries().filter((e) => e.t === 'final')
    check(finals.length === 2 && finals.every((e) => e.d === [d0, d1][e.s] && e.p === pages[0].folder.last && e.h === stateHash(pages[0].G)), "each seated device said its closing hash once, from its own seat, on the head the match ended at", JSON.stringify(finals))
    check(all.every((p) => p.status === 'over' && p.folder.finals.size === 2 && finals.every((e) => /^inert: .*agreeing/.test(p.rejected.find((r) => r.id === e.id)?.why ?? ''))), "every page found both finals agree (none frozen), and the watcher said none", all.map((p) => p.status).join(', '))
    for (const p of all) p.close()
    for (const s of stores) s.close()
  }
} catch (err) {
  check(false, 'the lobby and battle checks ran to their end', err.stack)
} finally {
  // (a socket still connecting as its repo shuts down reports an error:
  // nothing to do with the checks)
  process.on('uncaughtException', () => {})
  for (const r of repos) await r.shutdown?.().catch(() => {})
  await server.close()
}

console.log(failed ? `\nnet-check: ${failed} check(s) failed` : '\nnet-check passed: names, the seed, the start check, the lobby and a whole battle through a sync server, closing hashes agreeing')
process.exit(failed ? 1 : 0)
