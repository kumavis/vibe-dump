import test from 'node:test'
import assert from 'node:assert/strict'
import { makeLog, makeCallLog } from '../../src/boot/log.js'
import { makePlayers, PLAYER } from '../../src/boot/players.js'
import { makeHostPowers } from '../../src/boot/host-powers.js'
import { statusOf } from '../../src/editor/systems-panel.js'
import { World } from '../../src/core/world.js'
import { makeOwnership } from '../../src/net/ownership.js'

test('log: a bounded ring with plain copies', () => {
  let t = 0
  const log = makeLog({ limit: 3, now: () => ++t })
  log.info('a', { x: 1 }); log.warn('b'); log.error(new Error('boom')); log.info('d')
  const l = log.list(10)
  assert.deepEqual(l.map((r) => r.msg), ['b', 'Error: boom', 'd'])
  l[0].msg = 'mutated'
  assert.equal(log.list(10)[0].msg, 'b')
  const calls = makeCallLog({ limit: 2 }); calls.push({ what: 'a' }); calls.push({ what: 'b' }); calls.push({ what: 'c' })
  assert.deepEqual(calls.list().map((c) => c.what), ['b', 'c'])
})

test('players: one local entity per live peer; riding is a rider component on mine', () => {
  const world = new World({ peerId: 'p_me' })
  const peers = new Map([['p_bob', { info: { name: 'Bob' } }]])
  const presence = { peers: () => peers, info: () => ({ name: 'Me' }) }
  let pose = { p: [1, 0, 2], yaw: 0.5 }
  const players = makePlayers({ world, presence, peerId: 'p_me', rig: { pose: () => pose } })
  assert.equal(players.selfId, `${PLAYER}p_me`)
  const me = world.get(players.selfId)
  assert.equal(me.local, true); assert.ok(me.c.controller); assert.ok(!me.c.representation, 'my own avatar would block my camera')
  players.sync()
  assert.equal(world.get('player:p_bob').name, 'Bob'); assert.equal(String(world.get('player:p_bob').c.representation.kind), 'billboard')
  players.updateSelf()
  assert.deepEqual(me.live.p, [1, 0, 2]); assert.equal(me.live.yaw, 0.5)
  players.setMove([0.5, -1])
  assert.deepEqual(players.inputs().get(players.selfId).move, [0.5, -1])
  players.mount('horse-1')
  assert.equal(world.get(players.selfId).c.rider.mount, 'horse-1'); assert.equal(players.riding, 'horse-1')
  pose = { p: [9, 9, 9], yaw: 0 }; players.updateSelf()
  assert.deepEqual(me.live.p, [1, 0, 2], 'while riding the mount system seats me, not the rig')
  players.dismount()
  assert.ok(!world.get(players.selfId).c.rider)
  peers.delete('p_bob'); players.sync()
  assert.equal(world.get('player:p_bob'), undefined)
})

test('riding is published in presence: rider and host agree a ridden horse belongs to the rider', () => {
  // A (p_a) hosts; B (p_b) mounts horse-1. Each tab has its own world, presence and ownership.
  const info = { p_a: { name: 'A' }, p_b: { name: 'B' } }
  const mk = (me, other) => {
    const world = new World({ peerId: me })
    world.addLocal('horse-1', { name: 'Horse', components: { transform: { p: [0, 0, 0] }, mount: { seats: [{ controls: true }] }, body: { speed: 9 } } })
    world.get('horse-1').local = false // stand in for a doc entity
    const presence = {
      peers: () => new Map([[other, { info: info[other] }]]),
      info: (id = me) => info[id],
      set (patch) { info[me] = { ...info[me], ...patch } },
      isLive: () => true,
      host: () => 'p_a',
    }
    const players = makePlayers({ world, presence, peerId: me, rig: { pose: () => ({ p: [0, 0, 0], yaw: 0 }) } })
    const ownership = makeOwnership({ presence, world, peerId: me })
    return { world, players, ownership }
  }
  const A = mk('p_a', 'p_b'); const B = mk('p_b', 'p_a')
  for (const t of [A, B]) { t.players.sync(); t.ownership.update() }
  assert.equal(A.ownership.owner('horse-1'), 'p_a'); assert.equal(B.ownership.owner('horse-1'), 'p_a')
  B.players.mount('horse-1')
  for (const t of [A, B]) { t.players.sync(); t.ownership.update() }
  assert.deepEqual(A.world.get('player:p_b').c.rider, { mount: 'horse-1', seat: 0 }, "B's player on A's tab carries the rider")
  assert.equal(A.ownership.owner('horse-1'), 'p_b', 'the host hands the ridden horse to its rider')
  assert.equal(A.ownership.owns('horse-1'), false, 'so A stops simulating it')
  assert.equal(B.ownership.owns('horse-1'), true)
  B.players.dismount()
  for (const t of [A, B]) { t.players.sync(); t.ownership.update() }
  assert.ok(!A.world.get('player:p_b').c.rider)
  assert.equal(A.ownership.owner('horse-1'), 'p_a'); assert.equal(B.ownership.owner('horse-1'), 'p_a')
})

test('host powers: plain copies out, failures reported, calls logged', async () => {
  const internal = [{ t: 1, level: 'info', msg: 'x' }]
  const calls = []
  const hp = makeHostPowers({
    scene: { render () {}, renderer: { domElement: { toDataURL: (type, q) => `data:${type};q=${q}` } } },
    log: { list: () => internal },
    evalPower: async (src) => ({ ran: src }),
    explain: (id) => (id === 'a' ? { id, intent: { act: 'flee' } } : null),
    systemHost: { status: () => [{ name: 's', ok: true }] },
    onCall: (c) => calls.push(c),
  })
  assert.equal(await hp.capture(), 'data:image/jpeg;q=0.75')
  const logs = await hp.logs(); logs[0].msg = 'changed'
  assert.equal(internal[0].msg, 'x', 'the ring is not handed out')
  assert.deepEqual(await hp.eval('1+1'), { ran: '1+1' })
  assert.equal((await hp.explain('a')).intent.act, 'flee')
  await assert.rejects(hp.explain('nope'), /no entity nope/)
  assert.deepEqual(hp.systems(), [{ name: 's', ok: true }])
  assert.deepEqual(calls.map((c) => [c.what, c.ok]), [['capture', true], ['logs', true], ['eval', true], ['explain', true], ['explain', false]])
})

test('systems panel: status text from the local host status', () => {
  assert.equal(statusOf(undefined).cls, 'unknown')
  assert.equal(statusOf({ ok: true, enabled: true, compileMs: 0.4 }).text, 'ok · compiled in 0.4 ms')
  assert.equal(statusOf({ ok: false, enabled: true, lastError: 'TypeError: x' }).cls, 'error')
  assert.equal(statusOf({ ok: false, suspended: true, errors: 30, enabled: true }).text, 'suspended after 30 errors')
  assert.equal(statusOf({ ok: true, enabled: false }).cls, 'off')
  assert.equal(statusOf({ ok: true, enabled: true }, { running: false }).cls, 'off')
})
