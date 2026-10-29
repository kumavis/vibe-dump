// Host election on a fake clock: peers on a bus with 50 ms one-way latency. Each
// peer that believes itself host streams 'po' frames at 10 Hz (as the pose stream
// would), so stream-silence failover is exercised for real.
import test from 'node:test'
import assert from 'node:assert/strict'
import { makePresence } from '../../src/net/presence.js'
import { makeClock, makeBus } from './b-fakes.mjs'

function sim ({ latency = 50, until, events }) {
  const clock = makeClock(0); const bus = makeBus(clock, { latency })
  const peers = new Map() // id -> { p, h }
  const mk = (id) => { const h = bus.handle(id); const p = makePresence(h, { peerId: id, now: clock.now, timers: clock.timers }); peers.set(id, { p, h }) }
  const kill = (id, { bye }) => { const { p, h } = peers.get(id); if (bye) p.bye(); p.stop(); h.dropOut = !bye; if (bye) bus.pump(); peers.delete(id); setTimeout0.push(() => bus.remove(id)) }
  const setTimeout0 = []
  const m = { doubleSelfMs: 0, disagreeMs: 0, noHostMs: 0, changes: [], hostAt: [] }
  let last = ''
  for (let t = 0; t <= until; t += 10) {
    events[t]?.({ mk, kill, peers, bus })
    clock.advance(t); bus.pump()
    while (setTimeout0.length) setTimeout0.shift()()
    // hosts stream poses; everyone else streams nothing
    for (const [id, { p, h }] of peers) {
      const isHost = p.host() === id
      p.setStreaming(isHost)
      if (isHost && t % 100 === 0) h.broadcast({ t: 'po', k: 1, ts: t, f: new Float32Array(6) })
    }
    const views = [...peers].map(([id, { p }]) => [id, p.host()])
    const hosts = new Set(views.map(([, h]) => h))
    if (views.filter(([id, h]) => id === h).length > 1) m.doubleSelfMs += 10
    if (hosts.size > 1) m.disagreeMs += 10
    if (peers.size && hosts.has(null)) m.noHostMs += 10
    const s = views.map(([id, h]) => `${id}:${h}`).join(' ')
    if (s !== last) { m.changes.push(`${(t / 1000).toFixed(2)}s ${s}`); last = s }
    m.hostAt.push([t, views.length && hosts.size === 1 ? [...hosts][0] : '?'])
  }
  for (const { p } of peers.values()) p.stop()
  m.firstAgreedAfter = (from, host) => m.hostAt.find(([t, h]) => t >= from && h === host)?.[0]
  return m
}

test('joins, a lower-id joiner, bye and crash: never two self-hosts', () => {
  const m = sim({
    until: 62000,
    events: {
      0: ({ mk }) => mk('peer-m'),
      10000: ({ mk }) => mk('peer-z'),
      20000: ({ mk }) => mk('peer-a'), // lowest id: takes over after the candidate wait
      30000: ({ kill }) => kill('peer-a', { bye: true }),
      40000: ({ mk }) => mk('peer-b'),
      50000: ({ kill }) => kill('peer-b', { bye: false }), // crash while streaming as host
    },
  })
  if (process.env.B_DEBUG) console.log(m.changes.join("\n"))
  assert.equal(m.doubleSelfMs, 0, 'two peers each thought they were host:\n' + m.changes.join('\n'))
  // the lower-id joiner takes over only after 3 s + 250 ms, and the incumbents let go first
  const aAt = m.firstAgreedAfter(20000, 'peer-a')
  assert.ok(aAt >= 23000 && aAt <= 23500, `peer-a agreed host at ${aAt}`)
  // graceful: bye is removal at once; the survivors have known each other for 20 s
  const byeAt = m.firstAgreedAfter(30000, 'peer-m')
  assert.ok(byeAt - 30000 <= 100, `bye handover took ${byeAt - 30000} ms`)
  // crash: the host was streaming, so 2.5 s of stream silence fails it over (not 6 s)
  const crashAt = m.firstAgreedAfter(50000, 'peer-m')
  assert.ok(crashAt - 50000 >= 2400 && crashAt - 50000 <= 3000, `crash failover took ${crashAt - 50000} ms`)
  assert.ok(m.disagreeMs <= 7000, `peers disagreed for ${m.disagreeMs} ms`)
})

test('two peers starting at the same moment: one host, never both', () => {
  const m = sim({ until: 8000, events: { 0: ({ mk }) => { mk('peer-x'); mk('peer-y') } } })
  assert.equal(m.doubleSelfMs, 0, m.changes.join('\n'))
  assert.equal(m.hostAt.at(-1)[1], 'peer-x')
})

test('alone: self-elects after 1.5 s; a crashed non-streaming peer expires after 6 s', () => {
  const clock = makeClock(0); const bus = makeBus(clock)
  const a = makePresence(bus.handle('p_a'), { peerId: 'p_a', now: clock.now, timers: clock.timers })
  clock.advance(1400); assert.equal(a.host(), null)
  clock.advance(1600); assert.equal(a.host(), 'p_a')
  const hb = bus.handle('p_0')
  const b = makePresence(hb, { peerId: 'p_0', now: clock.now, timers: clock.timers })
  for (let t = 1600; t <= 9000; t += 10) { clock.advance(t); bus.pump() }
  assert.ok(a.isLive('p_0'))
  assert.equal(a.host(), 'p_0', 'lower id becomes host once known for 3 s')
  assert.deepEqual(a.livePeers(), ['p_0', 'p_a'])
  b.stop(); hb.dropOut = true // crash, never streamed
  const left = []
  a.on((ev) => left.push([clock.now(), ev.type, ev.peerId]))
  for (let t = 9010; t <= 17000; t += 10) { clock.advance(t); bus.pump() }
  const [at] = left.find(([, type]) => type === 'leave')
  assert.ok(at - 9000 >= 4000 && at - 9000 <= 6300, `expired after ${at - 9000} ms`)
  assert.equal(a.host(), 'p_a')
  a.stop()
})

test('agents on the channel never become host; any traffic refreshes known peers', () => {
  const clock = makeClock(0); const bus = makeBus(clock)
  const a = makePresence(bus.handle('p_z'), { peerId: 'p_z', now: clock.now, timers: clock.timers })
  const agent = bus.handle('agent_0')
  for (let t = 0; t <= 5000; t += 10) { clock.advance(t); if (t % 200 === 0) agent.broadcast({ sc: 1, to: '*', from: 'g_x' }); bus.pump() }
  assert.equal(a.isLive('agent_0'), false)
  assert.equal(a.host(), 'p_z')
  assert.equal(a.peers().size, 0)
  a.stop()
})

test('a peer that stops streaming on purpose is not mistaken for a crash', () => {
  const clock = makeClock(0); const bus = makeBus(clock)
  const ha = bus.handle('p_a'); const hb = bus.handle('p_b')
  const a = makePresence(ha, { peerId: 'p_a', now: clock.now, timers: clock.timers })
  const b = makePresence(hb, { peerId: 'p_b', now: clock.now, timers: clock.timers })
  for (let t = 0; t <= 4000; t += 10) { clock.advance(t); if (t % 100 === 0) { b.setStreaming(true); hb.broadcast({ t: 'po' }) } bus.pump() }
  b.setStreaming(false) // e.g. lost everything it owned
  for (let t = 4010; t <= 12000; t += 10) { clock.advance(t); bus.pump() }
  assert.ok(a.isLive('p_b'), 'heartbeats keep a non-streaming peer alive')
  assert.equal(a.peers().get('p_b').streaming, false)
  a.stop(); b.stop()
})

test('a hello from a known peer (reload with the same id) makes it a newcomer again', () => {
  const clock = makeClock(0); const bus = makeBus(clock)
  const a = makePresence(bus.handle('p_b'), { peerId: 'p_b', now: clock.now, timers: clock.timers })
  let ha = bus.handle('p_a')
  let b = makePresence(ha, { peerId: 'p_a', now: clock.now, timers: clock.timers })
  for (let t = 0; t <= 8000; t += 10) { clock.advance(t); bus.pump() }
  assert.equal(a.host(), 'p_a')
  b.stop(); bus.remove('p_a') // reload: no bye (pagehide raced), same id
  ha = bus.handle('p_a'); b = makePresence(ha, { peerId: 'p_a', now: clock.now, timers: clock.timers })
  clock.advance(8100); bus.pump()
  assert.equal(b.host(), 'p_b', 'the reloaded peer accepts the incumbent')
  assert.equal(a.host(), 'p_b', 'and the incumbent does not elect the reloaded peer yet')
  a.stop(); b.stop()
})

test('selfCheck: a tab that stalled past the stream TTL rejoins as a newcomer', () => {
  const clock = makeClock(0); const bus = makeBus(clock)
  const a = makePresence(bus.handle('p_a'), { peerId: 'p_a', now: clock.now, timers: clock.timers })
  const b = makePresence(bus.handle('p_b'), { peerId: 'p_b', now: clock.now, timers: clock.timers })
  for (let t = 0; t <= 8000; t += 10) { clock.advance(t); bus.pump(); a.selfCheck(t) }
  assert.equal(a.host(), 'p_a')
  clock.advance(12000); bus.pump(); a.selfCheck(12000) // 4 s without a frame
  assert.notEqual(a.host(), 'p_a', 'not host straight after a stall')
  a.stop(); b.stop()
})

// A hidden host tab: rAF stops (no selfCheck, no 'po'), its timers keep firing.
// With the sender guard off (A's own TTL made huge, so it never thinks it stalled,
// as an older peer would behave) the receiver-side rule alone must keep B hosting.
for (const selfChecks of [true, false]) {
  test(`a hidden host is not re-elected while it simulates nothing (sender guard ${selfChecks ? 'on' : 'off'})`, () => {
    const clock = makeClock(0); const bus = makeBus(clock)
    const ha = bus.handle('p_a'); const hb = bus.handle('p_b')
    const a = makePresence(ha, { peerId: 'p_a', now: clock.now, timers: clock.timers, ...(selfChecks ? {} : { streamTtlMs: 1e9 }) })
    const b = makePresence(hb, { peerId: 'p_b', now: clock.now, timers: clock.timers })
    const view = []
    for (let t = 0; t <= 40000; t += 10) {
      clock.advance(t); bus.pump()
      const hidden = t >= 10000
      for (const [p, h, id] of [[a, ha, 'p_a'], [b, hb, 'p_b']]) {
        if (id === 'p_a' && hidden) continue
        p.selfCheck(t)
        p.setStreaming(true) // both have a player rig: always streaming
        if (t % 50 === 0) h.broadcast({ t: 'po', k: 1, ts: t, f: new Float32Array(6) })
      }
      if (t % 1000 === 0) view.push([t, b.host()])
    }
    const bad = view.filter(([t, h]) => t >= 13500 && h !== 'p_b')
    assert.deepEqual(bad, [], 'B must host from ~13 s on while A is hidden: ' + view.map(([t, h]) => `${t / 1000}:${h}`).join(' '))
    a.stop(); b.stop()
  })
}

test('pause (hidden tab) says bye at once; resume rejoins as a newcomer', () => {
  const clock = makeClock(0); const bus = makeBus(clock)
  const a = makePresence(bus.handle('p_a'), { peerId: 'p_a', now: clock.now, timers: clock.timers })
  const b = makePresence(bus.handle('p_b'), { peerId: 'p_b', now: clock.now, timers: clock.timers })
  for (let t = 0; t <= 8000; t += 10) { clock.advance(t); bus.pump(); a.selfCheck(t); b.selfCheck(t) }
  assert.equal(b.host(), 'p_a')
  a.pause()
  for (let t = 8010; t <= 8200; t += 10) { clock.advance(t); bus.pump(); b.selfCheck(t) }
  assert.equal(b.host(), 'p_b', 'bye hands over within ~100 ms')
  for (let t = 8210; t <= 20000; t += 10) { clock.advance(t); bus.pump(); b.selfCheck(t) }
  assert.equal(b.host(), 'p_b', 'a paused peer sends no heartbeats')
  assert.equal(b.isLive('p_a'), false)
  a.resume()
  for (let t = 20010; t <= 21000; t += 10) { clock.advance(t); bus.pump(); a.selfCheck(t); b.selfCheck(t) }
  assert.equal(b.isLive('p_a'), true)
  assert.equal(b.host(), 'p_b', 'the returning tab is a newcomer, not the host')
  assert.equal(a.host(), 'p_b')
  a.stop(); b.stop()
})
