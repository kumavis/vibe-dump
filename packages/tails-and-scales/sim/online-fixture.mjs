// Online matches made in Node (N2), for sim/net-check.mjs and
// sim/lobby-rig.mjs: a match document as a host's page makes one (the
// lobby, the secret's commitment as the log's `open`, the start with the
// dice the seats' nonces make), and a battle played on it by the AI on each
// human seat's behalf (`auto` for every phase, `deployed` for the
// deployment), from each seat's own device, through Sessions over the
// match's own store: what two pages playing it write.
import { Session } from '../match/session.js'
import { lobbyDoc, lobbyOf, setupOf } from '../net/lobby.js'
import { commitOf, diceOf } from '../net/seed.js'
import { randomHex, randomId, newNonce } from '../net/ids.js'

// A match document on `repo`, its host `host` (a device id), each seat a
// guest's ({ dev, name, race }: its nonce drawn here), ready; the log
// opened and, unless `start` is false, started. → { handle, a, setup }
export async function makeMatch(repo, { host, seats, board = 4242, rounds = 5, overtime = 'vote', start = true, AutomergeStore }) {
  const doc = lobbyDoc({ host, board, rounds, overtime, me: { ctrl: 'human', dev: seats[0].dev, name: seats[0].name, race: seats[0].race } })
  seats.forEach((s, i) => {
    doc.lobby.seats[`s${i}`] = { ctrl: 'human', dev: s.dev, name: s.name, race: s.race, ready: true, nonce: s.dev === host ? '' : s.nonce ?? newNonce() }
  })
  const handle = repo.create(doc)
  const a = randomHex(16)
  const store = new AutomergeStore(handle)
  const ses = new Session({ store, dev: host, rand: () => randomId(4) })
  ses.open(await commitOf(a))
  const L = lobbyOf(handle.doc())
  const setup = L.seats.every(Boolean) ? setupOf(L, await diceOf({ a, documentId: handle.documentId, nonces: L.seats.map((r) => r.nonce) })) : null
  if (start) ses.start(setup, { a })
  ses.close()
  store.close()
  return { handle, a, setup }
}

// The battle on `store` played on: each human seat's Session (made here,
// from its device) answers what the match waits on from it (the deployment
// with `deployed`, a phase with `auto`), until `stop(G)` or the match is no
// longer live. → the Sessions (close them when done)
export function autoplay(store, setup, { stop = () => false, closing = false } = {}) {
  const sessions = setup.seats.map((s, i) => (s.ctrl === 'human' ? new Session({ store, localSeats: [i], dev: s.dev, rand: () => randomId(4), closing }) : null))
  const any = sessions.find(Boolean)
  for (let guard = 0; guard < 5000; guard++) {
    const G = any.G
    if (any.status !== 'live' || stop(G)) break
    const P = G.pending
    const seat = P.seats[0]
    const body = P.k === 'deploy' ? { t: 'deployed' } : P.k === 'phase' ? { t: 'auto' } : null
    if (!body) break
    sessions[seat].submit(seat, body)
  }
  return sessions
}
