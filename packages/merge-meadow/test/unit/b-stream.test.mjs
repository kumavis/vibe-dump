// Packed pose frames: round trip through automerge-repo's own CBOR codec, sizes,
// interpolation accuracy, and no extrapolation blow-up through a 1.9 s stall.
import test from 'node:test'
import assert from 'node:assert/strict'
import { cbor } from '@automerge/automerge-repo'
import { makePoseStream, encodeFrame, decodeFrame, tableKey, STRIDE, ANIMS } from '../../src/net/stream.js'
import { makeFakeWorld } from './b-fakes.mjs'

const wire = (m) => cbor.decode(cbor.encode(m)) // what an ephemeral message becomes in transit

test('encode/decode round trip, custom anim names, unknown table', () => {
  const rows = [['a', 1, 2, 3, 0.5, 'run'], ['b', -1, 0, 4, -3, 'dance']]
  const m = wire(encodeFrame(rows, { ts: 5 }))
  assert.equal(m.f.length, 2 * STRIDE)
  const tables = new Map()
  const back = decodeFrame(m, tables)
  assert.deepEqual(back.map((r) => r.map((x) => (typeof x === 'number' ? Math.round(x * 100) / 100 : x))), [['a', 1, 2, 3, 0.5, 'run'], ['b', -1, 0, 4, -3, 'dance']])
  const noTable = wire(encodeFrame(rows, { ts: 6, withTable: false }))
  assert.equal(noTable.ids, undefined)
  assert.ok(decodeFrame(noTable, tables), 'a cached table decodes a table-less frame')
  assert.equal(decodeFrame(noTable, new Map()), null)
  assert.deepEqual(ANIMS.slice(0, 3), ['idle', 'walk', 'run'])
})

test('frame sizes: 24 bytes per entity plus a small envelope', () => {
  const size = (n, withTable) => {
    const rows = Array.from({ length: n }, (_, i) => ['sheep-' + (100000 + i).toString(36), i, 0, -i, 0.5, 'walk'])
    return cbor.encode(encodeFrame(rows, { ts: Date.now(), withTable })).length
  }
  const s7 = size(7, false); const s300 = size(300, false)
  assert.ok(s7 < 7 * 24 + 60, `7 entities: ${s7} B`)
  assert.ok(Math.abs(s300 - s7 - 293 * 24) <= 4, `24 B per extra entity (+ CBOR length bytes): ${s300 - s7}`)
  assert.ok(size(7, true) - s7 < 7 * 16, 'the id table is a few bytes per id')
})

function pair ({ latency = 40, stall } = {}) {
  let now = 1000
  const clock = () => now
  const aw = makeFakeWorld(); const bw = makeFakeWorld()
  const ids = ['horse-b1', 'sheep-a1', 'trex-k3f9a']
  for (const id of ids) { aw.add({ id, live: { p: [0, 0, 0], yaw: 0, anim: 'idle' } }); bw.add({ id, c: { transform: { p: [9, 0, 9], r: [0, 90, 0] } }, live: { p: [9, 0, 9], yaw: 0 } }) }
  const inflight = []
  const tx = makePoseStream(null, { world: aw, peerId: 'p_a', owns: () => true, owner: () => 'p_a', now: clock, send: (m) => { const at = stall && now >= stall[0] && now < stall[1] ? stall[1] : now + latency; inflight.push([at, wire(m)]) } })
  const rx = makePoseStream(null, { world: bw, peerId: 'p_b', owns: () => false, owner: () => 'p_a', now: clock, send: () => {} })
  const step = (t) => {
    now = t
    tx.tick(t)
    inflight.sort((x, y) => x[0] - y[0])
    while (inflight.length && inflight[0][0] <= t) rx.receive('p_a', inflight.shift()[1])
    rx.apply(t)
  }
  return { aw, bw, tx, rx, step, ids, get now () { return now } }
}

test('interpolation tracks a 6 m/s runner within 0.1 m of its pose 160 ms earlier; a 1.9 s stall never blows up', () => {
  const P = pair({ stall: [3000, 4900] })
  const truth = (t) => 6 * (t - 1000) / 1000
  const trex = P.aw.get('trex-k3f9a')
  let worstSteady = 0; let ahead = 0; let maxV = 0
  for (let t = 1000; t <= 8000; t += 10) {
    trex.live.p = [truth(t), 0, 0]; trex.live.anim = 'run'
    P.step(t)
    const shown = P.bw.get('trex-k3f9a').live
    if (t < 1300) continue
    maxV = Math.max(maxV, Math.hypot(...shown.v))
    if (t > 1500 && (t < 2900 || t > 5500)) worstSteady = Math.max(worstSteady, Math.abs(shown.p[0] - truth(t - 160)))
    ahead = Math.max(ahead, shown.p[0] - truth(t))
  }
  assert.ok(worstSteady < 0.1, `steady error ${worstSteady.toFixed(3)} m`)
  assert.ok(maxV <= 30.0001, `displayed speed ${maxV}`)
  assert.ok(ahead <= 0.05, `display ran ${ahead.toFixed(2)} m ahead of the truth`)
  assert.equal(P.bw.get('trex-k3f9a').live.anim, 'run')
})

test('a 1.9 s stall holds (no 245 m extrapolation) and blends back without a pop', () => {
  const P = pair({ stall: [3000, 4900] })
  const trex = P.aw.get('trex-k3f9a')
  let lastX = null; let maxJump = 0
  for (let t = 1000; t <= 6000; t += 10) {
    trex.live.p = [6 * (t - 1000) / 1000, 0, 0]
    P.step(t)
    const x = P.bw.get('trex-k3f9a').live.p[0]
    if (lastX != null && t > 1300) maxJump = Math.max(maxJump, Math.abs(x - lastX))
    lastX = x
    if (t === 4800) assert.ok(x < 6 * 2.2, `held near the last sample, not extrapolated: ${x}`)
  }
  // 10 ms frames: anything over ~0.5 m in one frame is a visible pop
  assert.ok(maxJump < 0.5, `largest per-frame jump ${maxJump.toFixed(2)} m`)
})

test('table on change, on hello and every 10th frame; resting entities ride only on table frames', () => {
  const sent = []
  let now = 0
  const w = makeFakeWorld([{ id: 'a', live: { p: [0, 0, 0], yaw: 0 } }, { id: 'b', live: { p: [5, 0, 0], yaw: 0 } }])
  const fns = new Set()
  const handle = { broadcast: (m) => sent.push(m), on: (e, f) => fns.add(f), off: (e, f) => fns.delete(f) }
  const s = makePoseStream(handle, { world: w, peerId: 'p_a', owns: () => true, now: () => now })
  for (let i = 0; i < 25; i++) { now = i * 100; w.get('a').live.p = [i, 0, 0]; s.tick(now) }
  const withIds = sent.map((m, i) => (m.ids ? i : -1)).filter((i) => i >= 0)
  assert.deepEqual(withIds, [0, 10, 20])
  assert.equal(sent[1].f.length, STRIDE, 'b is resting: only a moves on a plain frame')
  assert.equal(sent[10].f.length, 2 * STRIDE)
  for (const f of fns) f({ message: { t: 'pr', hello: 1 }, senderId: 'p_new' })
  now = 2500; s.tick(now)
  assert.ok(sent.at(-1).ids, 'the frame after a hello carries the table')
  w.add({ id: 'c', live: { p: [1, 1, 1], yaw: 0 } })
  now = 2600; s.tick(now)
  assert.deepEqual(sent.at(-1).ids, ['a', 'b', 'c'], 'a changed owned set resends the table')
  s.stop()
})

test('own player streams at 20 Hz, NPCs at 10 Hz', () => {
  const sent = []
  let now = 0
  const w = makeFakeWorld([{ id: 'player:p_a', local: true, live: { p: [0, 0, 0], yaw: 0 } }, { id: 'n', live: { p: [0, 0, 0], yaw: 0 } }])
  const s = makePoseStream(null, { world: w, peerId: 'p_a', owns: () => true, now: () => now, send: (m) => sent.push(m) })
  for (now = 0; now < 1000; now += 1000 / 60) { w.get('n').live.p = [now / 100, 0, 0]; s.tick(now) }
  const playerFrames = sent.filter((m) => m.k === tableKey(['player:p_a']))
  assert.ok(playerFrames.length >= 19 && playerFrames.length <= 21, `player frames ${playerFrames.length}`)
  assert.ok(sent.length - playerFrames.length >= 9 && sent.length - playerFrames.length <= 11, `npc frames ${sent.length - playerFrames.length}`)
})

test('hold on loss, blend into the new owner, forget on gain, snap to the doc after 5 s of silence', () => {
  let now = 0
  let owner = 'p_b'; let mine = true
  const w = makeFakeWorld([{ id: 'e', c: { transform: { p: [100, 0, 100], r: [0, 90, 0] } }, live: { p: [10, 0, 0], yaw: 1 } }])
  const s = makePoseStream(null, { world: w, peerId: 'p_b', owns: () => mine, owner: () => owner, now: () => now, send: () => {} })
  // lose it to p_c
  mine = false; owner = 'p_c'
  s.hold('e')
  for (now = 0; now <= 1000; now += 50) s.apply(now)
  assert.deepEqual(w.get('e').live.p, [10, 0, 0], 'held, not snapped to the stale doc pose')
  // the new owner's first frames, 2 m away
  const frame = (x, ts) => wire(encodeFrame([['e', x, 0, 0, 1, 'walk']], { ts }))
  let lastX = 10; let maxJump = 0
  for (now = 1000; now <= 2000; now += 10) {
    if (now % 100 === 0) s.receive('p_c', frame(12 + (now - 1000) / 1000, now))
    s.apply(now)
    maxJump = Math.max(maxJump, Math.abs(w.get('e').live.p[0] - lastX)); lastX = w.get('e').live.p[0]
  }
  assert.ok(maxJump < 0.3, `blended, largest step ${maxJump.toFixed(2)}`)
  assert.ok(Math.abs(w.get('e').live.p[0] - 12.88) < 0.1, `converged on the stream: ${w.get('e').live.p[0]}`)
  // a stranger streaming the same entity is ignored while the owner is talking
  s.receive('p_x', frame(-50, now)); s.apply(now)
  assert.ok(w.get('e').live.p[0] > 0)
  // silence: hold, then snap to the doc after 5 s
  for (const t of [3000, 6500]) { now = t; s.apply(now) }
  assert.ok(w.get('e').live.p[0] > 12, 'still holding at 4.5 s of silence')
  now = 7100; s.apply(now)
  assert.deepEqual(w.get('e').live.p, [100, 0, 100])
  assert.ok(Math.abs(w.get('e').live.yaw - Math.PI / 2) < 1e-9)
  // gain: forget the buffer so stale frames never replay
  s.receive('p_c', frame(5, now)); mine = true; s.forget('e'); mine = false
  now += 10; s.apply(now)
  assert.deepEqual(w.get('e').live.p, [100, 0, 100])
})
