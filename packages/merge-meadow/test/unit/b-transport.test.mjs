// Sealed CapTP between two real automerge-repo Repos joined by the MessageChannel
// network adapter: the frames ride the doc's ephemeral channel exactly as they do
// through the sync server. No public server involved.
import 'ses/assert-shim.js'
import '@endo/eventual-send/shim.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { Repo } from '@automerge/automerge-repo'
import { MessageChannelNetworkAdapter } from '@automerge/automerge-repo-network-messagechannel'
import { Far, E } from '@endo/far'
import { hostCapTP, connectCapTP, aesKey, deriveSecret, randomId } from '../../src/agent/transport.js'
import { startAgentHost } from '../../src/agent/host.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
async function until (f, ms = 3000) { const t0 = Date.now(); while (!f()) { if (Date.now() - t0 > ms) throw new Error('timed out waiting'); await sleep(10) } }

async function twoRepos () {
  const { port1, port2 } = new MessageChannel()
  const a = new Repo({ peerId: 'p_host', network: [new MessageChannelNetworkAdapter(port1)] })
  const b = new Repo({ peerId: 'agent_x', network: [new MessageChannelNetworkAdapter(port2)] })
  const ha = a.create({ hello: 'world' })
  const hb = await b.find(ha.url)
  await sleep(50)
  return { a, b, ha, hb, async close () { await a.shutdown(); await b.shutdown(); port1.close(); port2.close() } }
}

const makeWorld = () => {
  let n = 0
  const things = new Map()
  return Far('World', {
    ping: (x) => ({ pong: x }),
    make: (name) => { const t = Far('Thing', { label: () => name, bump: () => ++n }); things.set(name, t); return t },
    count: () => n,
  })
}
const secret = randomId(16)

test('SYN/ACK, calls, pipelining, duplicate frames dropped, fin releases the host session', async () => {
  const R = await twoRepos()
  const key = await aesKey(secret, R.ha.documentId)
  const ended = []
  const host = hostCapTP(R.ha, { editor: { key, bootstrap: () => makeWorld(), onEnd: (id, why) => ended.push(why) } })
  // every guest frame is delivered twice (BroadcastChannel + websocket in a real browser)
  const doubled = { documentId: R.hb.documentId, broadcast: (m) => { R.hb.broadcast(m); R.hb.broadcast(m) }, on: (e, f) => R.hb.on(e, f), off: (e, f) => R.hb.off(e, f) }
  const conn = await connectCapTP(doubled, key, { timeoutMs: 3000 })
  const w = conn.bootstrap
  assert.deepEqual(await E(w).ping(7), { pong: 7 })
  // pipelined: three dependent sends leave before the first answer arrives
  const t = E(w).make('sheep')
  const [label, b1, b2] = await Promise.all([E(t).label(), E(t).bump(), E(t).bump()])
  assert.deepEqual([label, b1, b2], ['sheep', 1, 2])
  assert.equal(host.count(), 1)
  const s = [...host.sessions.values()][0]
  assert.ok(s.pipe.dups > 0, 'duplicates were seen and dropped, not treated as gaps')
  await conn.close()
  await until(() => host.count() === 0)
  assert.deepEqual(ended, ['fin'])
  await host.close(); await R.close()
})

test('a wrong key gets no answer; a string secret is accepted', async () => {
  const R = await twoRepos()
  const host = hostCapTP(R.ha, { editor: { key: await aesKey(secret, R.ha.documentId), bootstrap: () => makeWorld() } })
  await assert.rejects(connectCapTP(R.hb, await aesKey(randomId(16), R.hb.documentId), { timeoutMs: 400 }), /no host page answered/)
  await assert.rejects(connectCapTP(R.hb, await aesKey(secret, 'other-doc'), { timeoutMs: 400 }), /no host page answered/, 'the doc id salts the key')
  const conn = await connectCapTP(R.hb, secret, { timeoutMs: 3000 })
  assert.equal(await E(conn.bootstrap).count(), 0)
  await conn.close(); await host.close(); await R.close()
})

test('startAgentHost: the editor key gets World, the view key only WorldView; sessions end cleanly', async () => {
  const R = await twoRepos()
  const subsCancelled = []
  const facets = (sid) => ({
    world: Far('World', { kind: () => 'World', spawn: () => 'spawned', who: () => sid }),
    viewer: Far('WorldView', { kind: () => 'WorldView', describe: () => ({ ok: true }) }),
  })
  const caps = { ...facets('shared'), session: facets, endSession: (sid) => subsCancelled.push(sid) }
  const agent = startAgentHost({ handle: R.ha, key: secret, caps, broadcastChannel: false })
  await agent.ready
  assert.equal(agent.viewKey, await deriveSecret(secret, 'view'))
  const ed = await connectCapTP(R.hb, secret, { timeoutMs: 3000 })
  assert.equal(await E(ed.bootstrap).kind(), 'World')
  assert.equal(await E(ed.bootstrap).who(), ed.me, 'each session gets its own facet set')
  const view = await connectCapTP(R.hb, agent.viewKey, { timeoutMs: 3000 })
  assert.equal(await E(view.bootstrap).kind(), 'WorldView')
  await assert.rejects(E(view.bootstrap).spawn({}), /spawn/)
  assert.deepEqual(agent.sessions().map((s) => s.role).sort(), ['editor', 'viewer'])
  agent.revoke('viewer')
  await until(() => view.isClosed)
  assert.equal(await view.closed, 'host page closed')
  await ed.close()
  await until(() => agent.sessions().length === 0)
  assert.deepEqual(subsCancelled.sort(), [ed.me, view.me].sort(), 'ending a session cancels its subscriptions')
  await agent.stop(); await R.close()
})

test('host close rejects a guest\'s pending call at once; idle sessions are dropped', async () => {
  const R = await twoRepos()
  const key = await aesKey(secret, R.ha.documentId)
  const ended = []
  const host = hostCapTP(R.ha, {
    editor: { key, bootstrap: () => Far('W', { never: () => new Promise(() => {}), ok: () => 1 }), onEnd: (id, why) => ended.push(why) },
  }, { idleMs: 1000 })
  const conn = await connectCapTP(R.hb, key, { timeoutMs: 3000, keepAliveMs: 0 })
  const pending = E(conn.bootstrap).never()
  await sleep(50)
  await host.close()
  await assert.rejects(pending, /host page closed/)
  assert.deepEqual(ended, ['host closed'])
  // idle: a fresh host, a guest that never speaks again
  const host2 = hostCapTP(R.ha, { editor: { key, bootstrap: () => Far('W', { ok: () => 1 }), onEnd: (id, why) => ended.push(why) } }, { idleMs: 1000 })
  const conn2 = await connectCapTP(R.hb, key, { timeoutMs: 3000, keepAliveMs: 0 })
  assert.equal(await E(conn2.bootstrap).ok(), 1)
  await until(() => host2.count() === 0, 4000)
  assert.equal(ended.at(-1), 'idle')
  await host2.close(); await R.close()
})

test('two hosts answer one SYN: first ACK wins, the loser gets a fin', async () => {
  const R = await twoRepos()
  const key = await aesKey(secret, R.ha.documentId)
  const h1 = hostCapTP(R.ha, { editor: { key, bootstrap: () => Far('W', { who: () => 'h1' }) } })
  const h2 = hostCapTP(R.ha, { editor: { key, bootstrap: () => Far('W', { who: () => 'h2' }) } })
  const conn = await connectCapTP(R.hb, key, { timeoutMs: 3000 })
  assert.ok(['h1', 'h2'].includes(await E(conn.bootstrap).who()))
  await until(() => h1.count() + h2.count() === 1)
  await conn.close(); await h1.close(); await h2.close(); await R.close()
})

test('a recorded session cannot be replayed, and a frame re-addressed to a live session is dropped, not a gap', async () => {
  const R = await twoRepos()
  const key = await aesKey(secret, R.ha.documentId)
  let calls = 0
  const world = () => Far('W', { run: (src) => { calls++; return `ran ${src}` }, ok: () => 1 })
  const ended = []
  const host = hostCapTP(R.ha, { editor: { key, bootstrap: world, onEnd: (id, why) => ended.push(why) } })
  // a guest whose every outgoing frame an eavesdropper records
  const tape = []
  const taped = { documentId: R.hb.documentId, broadcast: (m) => { tape.push(structuredClone(m)); R.hb.broadcast(m) }, on: (e, f) => R.hb.on(e, f), off: (e, f) => R.hb.off(e, f) }
  const g = await connectCapTP(taped, key, { timeoutMs: 3000, keepAliveMs: 0 })
  assert.equal(await E(g.bootstrap).run('doSomething()'), 'ran doSomething()')
  await g.close()
  await until(() => host.count() === 0)
  assert.equal(calls, 1)
  const replay = async (h) => { for (const m of tape) R.hb.broadcast(m); await sleep(300); return h.count() }
  // the same host: the SYN's session id was served already
  assert.equal(await replay(host), 0, 'a replayed SYN is not answered again')
  // a fresh host (a new tab) answers the SYN with a new nonce: the recorded frames do not open
  const host2 = hostCapTP(R.ha, { editor: { key, bootstrap: world } })
  await replay(host2)
  assert.equal(calls, 1, 'nothing recorded ran a second time')
  await host2.close()
  // re-addressing: a recorded frame with its clear from/to pointed at a live victim session
  const victim = await connectCapTP(R.hb, key, { timeoutMs: 3000, keepAliveMs: 0 })
  assert.equal(await E(victim.bootstrap).ok(), 1)
  const frames = tape.filter((m) => m.to !== '*')
  for (const m of frames) R.hb.broadcast({ ...m, from: victim.me, to: victim.host })
  await sleep(300)
  assert.equal(await E(victim.bootstrap).ok(), 1, 'the victim session is unharmed')
  assert.ok(!ended.includes('broken'), `no session broke (${ended.join(', ')})`)
  assert.equal(calls, 1)
  await victim.close(); await host.close(); await R.close()
})
