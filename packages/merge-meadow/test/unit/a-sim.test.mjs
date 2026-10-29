import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { scenario, seeded, mirror, vocabulary } from './a-helpers.mjs'
import { applyOps } from '../../src/doc/ops.js'
import { entityData } from '../../src/doc/read.js'
import { explain, simHash, ORDER, teleport } from '../../src/sim/index.js'

const dist = (a, b) => Math.hypot(a[0] - b[0], a[2] - b[2])

// the rider sits still until the nearest sheep is dead, then rides at the T-rex,
// and from 14 m turns and backs off at half speed so it is caught from behind
function riderInput (s) {
  const { world, inputs } = s
  const ann = world.get('ann'); const rex = world.get('rex')
  if (!ann?.c.rider || !rex) return
  if (!world.get('dolly')?.groups.has('dead')) { inputs.set('ann', { move: [0, 0] }); return }
  const dx = rex.live.p[0] - ann.live.p[0]; const dz = rex.live.p[2] - ann.live.p[2]; const m = Math.hypot(dx, dz)
  const k = m > 14 ? 1 : -0.5
  inputs.set('ann', { move: [(k * dx) / m, (k * dz) / m] })
}

function play (s, ticks, each) { for (let t = 0; t < ticks; t++) { riderInput(s); each?.(t); s.step() } }

test('design §12: the T-rex kills a sheep and the rider; the riderless horse flees; no entity-specific code', () => {
  const s = scenario()
  const { world, handle } = s
  const timeline = []
  let horseRidden = null; let horseAfter = null
  play(s, 900, (t) => {
    for (const id of ['dolly', 'ann', 'bucephalus']) if (world.get(id)?.groups.has('dead') && !timeline.some((x) => x.id === id)) timeline.push({ id, t })
    const h = world.get('bucephalus').live
    if (t === 300) horseRidden = h.intent?.act
    if (timeline.some((x) => x.id === 'ann') && !horseAfter && h.intent?.act === 'flee') horseAfter = { t, d0: dist(h.p, world.get('rex').live.p) }
    if (horseAfter && t === horseAfter.t + 60) horseAfter.d1 = dist(h.p, world.get('rex').live.p)
  })
  const order = timeline.map((x) => x.id)
  assert.deepEqual(order.slice(0, 2), ['dolly', 'ann'], `deaths in order: ${JSON.stringify(timeline)}`)
  assert.equal(horseRidden, 'steer', 'while ridden the horse is steered by its rider')
  assert.ok(horseAfter, 'the riderless horse switched to its own flee drive')
  assert.ok(horseAfter.d1 > horseAfter.d0, `and outran the T-rex (${horseAfter.d0.toFixed(1)} m -> ${horseAfter.d1.toFixed(1)} m)`)
  assert.equal(entityData(handle.doc(), 'dolly').groups.includes('dead'), true)
  assert.equal(entityData(handle.doc(), 'ann').effective.rider, undefined, 'the dead group removed rider')
  assert.equal(entityData(handle.doc(), 'shaun').groups.length, 0, 'the far sheep is untouched')
  // every death went through the ledger and on.died -> addGroup, written once
  const deadOps = s.flushed.filter((o) => o.op === 'addGroup' && o.group === 'dead')
  assert.deepEqual(deadOps.map((o) => o.id).slice(0, 2), ['dolly', 'ann'])
  assert.equal(new Set(deadOps.map((o) => o.id)).size, deadOps.length, 'dead added once per entity')
  assert.ok(s.flushed.filter((o) => o.op === 'hit').every((o) => /^A:h\.\d+$/.test(o.hitId)))
  assert.deepEqual(world.errors(), [])
  // nothing in the simulation names a species
  const dir = new URL('../../src/sim/', import.meta.url)
  for (const f of readdirSync(dir)) {
    const src = readFileSync(new URL(f, dir), 'utf8').toLowerCase()
    for (const word of ['trex', 't-rex', 'sheep', 'horse', 'predator', 'prey']) assert.ok(!src.includes(word), `src/sim/${f} mentions ${word}`)
  }
})

test('simHash is unchanged by representation replaces mid-run', () => {
  const a = scenario(); const b = scenario()
  const hashes = { a: [], b: [] }
  play(a, 450, (t) => { if (t % 50 === 0) hashes.a.push(simHash(a.world)) })
  play(b, 450, (t) => {
    if (t === 100) applyOps(b.handle, [{ op: 'replace', id: 'rex', component: 'representation', data: { kind: 'critter', rig: 'biped', length: 4, height: 3 } }])
    if (t === 200) applyOps(b.handle, [{ op: 'replace', id: 'rex', component: 'representation', data: { kind: 'model', url: 'asset:trex' } }, { op: 'set', id: 'bucephalus', component: 'representation', patch: { size: 3 } }])
    if (t === 300) applyOps(b.handle, [{ op: 'set', id: 'rex', component: 'animation', patch: { clips: { run: 'Gallop' } } }])
    if (t % 50 === 0) hashes.b.push(simHash(b.world))
  })
  assert.equal(String(b.world.get('rex').c.representation.kind), 'model')
  assert.deepEqual(hashes.b, hashes.a)
  assert.equal(simHash(a.world), simHash(b.world))
  assert.ok(new Set(hashes.a).size > 3, 'the hash does move with the simulation')
})

test('ownership gating: a non-owner never queues ops for an entity', () => {
  // owning nothing: perceives and decides nothing, writes nothing, even with
  // inbox events waiting and an entity already at 0 hp
  const none = scenario({ owns: () => false, extra: [{ op: 'push', id: 'dolly', event: { type: 'move', p: [1, 0, 1] } }, { op: 'hit', id: 'shaun', hitId: 'x:1', amount: 999 }] })
  play(none, 200)
  assert.equal(none.flushed.length, 0)
  assert.equal(none.world.get('rex').live.intent, undefined)
  // owning only the T-rex: the only ops about others are hits from its attack
  const rexOnly = scenario({ owns: (id) => id === 'rex', extra: [{ op: 'push', id: 'dolly', event: { type: 'move', p: [1, 0, 1] } }] })
  // place the sheep within reach: it is not simulated here, so it stands still
  play(rexOnly, 200)
  assert.ok(rexOnly.flushed.some((o) => o.op === 'hit'), 'the attacker\'s owner writes hits')
  for (const o of rexOnly.flushed) assert.ok(o.op === 'hit' || o.id === 'rex', `unexpected ${JSON.stringify(o)}`)
  assert.equal(entityData(rexOnly.handle.doc(), 'dolly').groups.length, 0, 'only the victim\'s owner adds dead')
  assert.equal(Object.keys(entityData(rexOnly.handle.doc(), 'dolly').inbox).length, 1, 'only the owner drains the inbox')
  // the victim's owner (another world on the same doc) then observes hp <= 0 and adds dead once
  const victim = mirror(rexOnly.handle, { peerId: 'B', owns: (id) => id === 'dolly' })
  victim.step(3)
  assert.deepEqual(victim.flushed.map((o) => `${o.op}:${o.id}`).sort(), ['addGroup:dolly', 'checkpoint:dolly', 'drain:dolly'])
  victim.step(30)
  assert.equal(victim.flushed.filter((o) => o.op === 'addGroup').length, 1)
})

test('inbox: the owner drains `move` (teleport + checkpoint) and turns other events into world events', () => {
  const h = seeded()
  const s = mirror(h)
  applyOps(h, [{ op: 'push', id: 'sheep-1', event: { id: 'm1', type: 'move', p: [10, 0, -10], yaw: 90 } }, { op: 'push', id: 'sheep-1', event: { id: 't1', type: 'tame', from: 'p_b' } }])
  s.step(1)
  const l = s.world.get('sheep-1').live
  assert.ok(dist(l.p, [10, 0, -10]) < 0.5)
  assert.deepEqual(Object.keys(entityData(h.doc(), 'sheep-1').inbox), [], 'drained')
  assert.deepEqual(entityData(h.doc(), 'sheep-1').components.transform.p, [10, 0, -10])
  assert.equal(entityData(h.doc(), 'sheep-1').components.transform.r[1], 90)
  s.step(1)
  const ev = s.world.events.events('tame')
  assert.equal(ev.length, 1); assert.equal(ev[0].id, 'sheep-1'); assert.equal(ev[0].from, 'p_b')
  s.step(5)
  assert.equal(s.flushed.filter((o) => o.op === 'drain').length, 1, 'drained once, not every tick')
  // the owner ignores doc transforms of entities it simulates, follows static ones
  applyOps(h, [{ op: 'transform', id: 'sheep-2', p: [30, 0, 30] }, { op: 'transform', id: 'tree-1', p: [1, 0, 1] }])
  assert.ok(dist(s.world.get('sheep-2').live.p, [30, 0, 30]) > 5)
  assert.deepEqual(s.world.get('tree-1').live.p, [1, 0, 1])
  assert.ok(teleport(s.world, 'sheep-2', [0, 0, 5], 0))
  assert.deepEqual(s.world.get('sheep-2').live.p, [0, 0, 5])
})

test('mount: first rider id wins a contested seat; the loser is dismounted once', () => {
  const h = vocabulary()
  applyOps(h, [
    { op: 'definePreset', name: 'person', preset: { components: { tags: { humanoid: true }, controller: { kind: 'input' }, body: { speed: 4 } } } },
    { op: 'spawn', id: 'horse', preset: 'horse', at: [0, 0, 0], components: { brain: null } },
    { op: 'spawn', id: 'b-rider', preset: 'person', components: { rider: { mount: 'horse', seat: 0 } } },
    { op: 'spawn', id: 'a-rider', preset: 'person', components: { rider: { mount: 'horse', seat: 0 } } },
  ])
  const s = mirror(h)
  s.inputs.set('a-rider', { move: [1, 0] })
  s.inputs.set('b-rider', { move: [-1, 0] })
  s.step(30)
  const horse = s.world.get('horse').live
  assert.ok(horse.p[0] > 1, 'a-rider (first id) steers')
  assert.equal(horse.intent.by, 'a-rider')
  assert.equal(entityData(h.doc(), 'b-rider').components.rider.mount, '', 'the loser was dismounted in the doc')
  assert.equal(s.flushed.filter((o) => o.op === 'set' && o.id === 'b-rider').length, 1)
  const a = s.world.get('a-rider').live
  assert.ok(Math.abs(a.p[1] - 1.6) < 1e-9, 'the rider sits at the seat offset')
  assert.equal(a.anim, 'sit')
  assert.equal(explain(s.world, 'a-rider').intent.act, 'ride')
})

test('explain: plain data about why an entity acts', () => {
  const s = scenario()
  s.step(5)
  const x = explain(s.world, 'rex')
  assert.equal(x.owner, 'A')
  assert.equal(x.intent.act, 'pursue')
  assert.equal(x.intent.target, 'dolly')
  assert.equal(x.drives[0].name, 'hunt')
  assert.ok(x.sensed >= 1)
  assert.equal(x.hp, 200)
  assert.doesNotThrow(() => JSON.stringify(x))
  assert.equal(explain(s.world, 'nope'), null)
  x.intent.act = 'mutated'
  assert.equal(s.world.get('rex').live.intent.act, 'pursue', 'a copy, not the live object')
  assert.deepEqual(Object.keys(ORDER).slice(0, 3), ['lifecycle', 'perceive', 'decide'])
})

test('local entities (players) take hits in live, and their owner sees them die', () => {
  const h = vocabulary()
  applyOps(h, [{ op: 'spawn', id: 'rex', preset: 'trex', at: [0, 0, 0] }])
  const s = mirror(h)
  s.world.addLocal('player:p_a', { name: 'Ann', components: { transform: { p: [2, 1.6, 0] }, tags: { prey: true }, health: { max: 30, armor: 0 }, on: { died: { add: ['dead'] } } } })
  const seen = []
  for (let i = 0; i < 120; i++) { s.step(1); for (const e of s.world.events.events()) if (e.id === 'player:p_a') seen.push(e.type) }
  assert.ok(seen.includes('hit') && seen.includes('hurt') && seen.includes('died'), seen.join(','))
  assert.ok(!s.flushed.some((o) => o.id === 'player:p_a'), 'nothing about a local entity reaches the doc')
})

test('moveOps: a simulated entity is moved through its owner\'s inbox, a static one directly', async () => {
  const { moveOps } = await import('../../src/doc/ops.js')
  const h = seeded()
  const s = mirror(h)
  s.step(2)
  assert.deepEqual(moveOps(h.doc(), 'tree-1', [1, 0, 1]).map((o) => o.op), ['transform'])
  const ops = moveOps(h.doc(), 'sheep-1', [-20, 0, 20], 180)
  assert.deepEqual(ops.map((o) => o.op), ['transform', 'push'])
  applyOps(h, ops)
  s.step(1)
  assert.ok(dist(s.world.get('sheep-1').live.p, [-20, 0, 20]) < 0.5, 'the owner teleported it')
  assert.equal(entityData(h.doc(), 'sheep-1').components.transform.r[1], 180)
})

test('a held entity (live.held, set by interaction while dragging) is not steered', () => {
  const s = scenario()
  s.step(5)
  const rex = s.world.get('rex').live
  rex.held = true
  const p = [...rex.p]
  s.step(30)
  assert.deepEqual(rex.p, p)
  rex.held = false
  s.step(10)
  assert.ok(dist(rex.p, p) > 0.1)
})

test('the seed meadow is not a massacre: sheep that see the T-rex coming can get away', () => {
  const h = seeded()
  const s = mirror(h)
  const prey = ['sheep-1', 'sheep-2', 'sheep-3', 'horse-1']
  s.step(60 * 30)
  const alive = prey.filter((id) => !s.world.get(id).groups.has('dead'))
  assert.ok(alive.length >= 2, `after 60 s ${alive.length} of 4 prey are alive (${alive.join(', ')})`)
  assert.ok(alive.includes('horse-1'), 'the horse (9 m/s) is never run down')
  s.stop()
})

test('a fleeing animal at the wall slides along it instead of stalling', () => {
  const h = vocabulary()
  applyOps(h, [{ op: 'spawn', id: 'rex', preset: 'trex', at: [-30, 0, 2] }, { op: 'spawn', id: 'ewe', preset: 'sheep', at: [-38, 0, 0] }])
  const s = mirror(h)
  s.step(30)
  const l = s.world.get('ewe').live
  assert.equal(l.intent?.act, 'flee')
  const v = Math.hypot(l.v[0], l.v[2])
  assert.ok(v > 3, `still running along the wall at ${v.toFixed(2)} m/s`)
  s.stop()
})

test('a yaw-only inbox move turns the entity in place', () => {
  const h = seeded()
  const s = mirror(h)
  s.step(2)
  const before = [...s.world.get('trex-1').live.p]
  applyOps(h, [{ op: 'push', id: 'trex-1', event: { type: 'move', yaw: 90 } }])
  s.step(1)
  const l = s.world.get('trex-1').live
  assert.ok(dist(l.p, before) < 0.5, 'position kept (no stale doc p)')
  s.stop()
})
