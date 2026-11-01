// Track C, rigs (design §17.1 layer 3): state -> clip layers, crossfades whose
// weights sum to 1, once clips clamped on st, halt on a missing die clip, and the
// fallback chain of animation.js.
import test from 'node:test'
import assert from 'node:assert/strict'
import { makeRigController } from '../../src/render/rig/controller.js'

const near = (a, b, eps = 1e-9, msg) => assert.ok(Math.abs(a - b) <= eps, `${msg ?? ''} ${a} != ${b}`)
const loop = (tracks = {}) => ({ loop: true, once: false, tracks })
const MODEL = {
  animations: { idle: loop(), walk: loop(), run: loop(), breathe: loop(), bite: { loop: false, once: true, duration: 0.8, tracks: {} }, fall: { loop: false, once: true, duration: 1.2, tracks: {} } },
  controller: { states: { idle: ['idle', 'breathe'], walk: ['walk', 'breathe'], run: ['run'], attack: ['bite'], die: ['fall'] }, blend: 0.2 },
}
const W = (layers) => Object.fromEntries(layers.map((l) => [l.clip, +l.weight.toFixed(6)]))

test('the first state plays at once; a change crossfades and the sets\' weights sum to 1', () => {
  const c = makeRigController(MODEL)
  assert.equal(c.blend, 0.2)
  assert.equal(c.set('idle', 0), true)
  assert.equal(c.set('idle', 0.5), false, 'the same state again is a no-op')
  assert.deepEqual(W(c.layers(1)), { idle: 1, breathe: 1 })
  c.set('walk', 1)
  for (const t of [1, 1.05, 1.1, 1.15, 1.2]) {
    const L = c.layers(t)
    const k = Math.min(1, (t - 1) / 0.2)
    const w = W(L)
    near((w.idle ?? 0) + (w.walk ?? 0), 1, 1e-6, `t=${t}`)
    near(w.walk ?? 0, k, 1e-6); near(w.breathe, 1, 1e-6, 'a clip in both sets keeps weight 1')
    assert.equal(L.filter((l) => l.clip === 'breathe').length, 1, 'and is reported once')
  }
  assert.deepEqual(W(c.layers(1.3)), { walk: 1, breathe: 1 }, 'the outgoing set is dropped when the fade ends')
  // breathe kept its clock across the change; walk started at the change
  const L = c.layers(2)
  near(L.find((l) => l.clip === 'breathe').time, 2); near(L.find((l) => l.clip === 'walk').time, 1)
})

test('a change in the middle of a crossfade still sums to 1', () => {
  const c = makeRigController(MODEL)
  c.set('idle', 0); c.set('walk', 1); c.set('run', 1.1) // walk was at 0.5
  near(W(c.layers(1.15)).run, 0.25, 1e-6)
  near(W(c.layers(1.15)).walk, 0.375, 1e-6, 'each outgoing set falls from the weight it had')
  // (layers() moves forward in time: a finished fade is dropped for good)
  for (const t of [1.1, 1.15, 1.2, 1.25, 1.3, 1.4]) {
    const w = W(c.layers(t))
    near((w.idle ?? 0) + (w.walk ?? 0) + (w.run ?? 0), 1, 1e-6, `t=${t}`)
  }
  assert.deepEqual(W(c.layers(1.4)), { run: 1 })
})

test('once clips play from the state entry and clamp time and st at their duration', () => {
  const c = makeRigController({ ...MODEL, controller: { ...MODEL.controller, blend: 0 } })
  c.set('idle', 0); c.set('attack', 2)
  const at = (t) => c.layers(t).find((l) => l.clip === 'bite')
  near(at(2.3).time, 0.3); near(at(2.3).st, 0.3)
  near(at(5).time, 0.8, 1e-9, 'clamped'); near(at(5).st, 0.8)
  c.set('idle', 6); c.set('attack', 7)
  near(at(7.1).time, 0.1, 1e-9, 'a new entry replays it')
})

test('die with no clip halts (frozen layers); dying with a clip plays it; leaving a halt resumes', () => {
  const noDie = makeRigController({ animations: { idle: loop(), walk: loop() }, controller: { blend: 0.2 } })
  noDie.set('walk', 0)
  noDie.set('die', 1)
  assert.equal(noDie.halted, true)
  const a = JSON.stringify(noDie.layers(1)); const b = JSON.stringify(noDie.layers(9))
  assert.equal(a, b, 'frozen at the halt time')
  noDie.set('idle', 10)
  assert.equal(noDie.halted, false)
  assert.deepEqual(W(noDie.layers(10)), { idle: 1 }, 'no fade out of a halt')
  const c = makeRigController(MODEL)
  c.set('die', 0)
  assert.equal(c.halted, false); assert.deepEqual(W(c.layers(0)), { fall: 1 })
})

test('fallback chain and mapping: run > walk > idle, attack/sit/unknown > idle; first looping clip last', () => {
  const pick = (model, state, mapping) => { const c = makeRigController(model); c.set(state, 0, { mapping }); return [c.as, c.layers(0).map((l) => l.clip).sort()] }
  const m = { animations: { idle: loop(), walk: loop() } }
  assert.deepEqual(pick(m, 'run'), ['walk', ['walk']])
  assert.deepEqual(pick(m, 'attack'), ['idle', ['idle']])
  assert.deepEqual(pick(m, 'sit'), ['idle', ['idle']])
  assert.deepEqual(pick(m, 'fly'), ['idle', ['idle']])
  assert.deepEqual(pick(MODEL, 'run'), ['run', ['run']], 'controller states before names')
  assert.deepEqual(pick(MODEL, 'walk', { walk: 'run' }), ['walk', ['run']], 'the entity\'s animation.clips mapping wins')
  assert.deepEqual(pick(MODEL, 'walk', { walk: 'missing' }), ['walk', ['breathe', 'walk']], 'a stale mapping falls through')
  // a tree with one clip and no controller: it just plays
  const sway = { animations: { sway: loop() } }
  assert.deepEqual(pick(sway, 'idle'), ['idle', ['sway']])
  assert.deepEqual(pick(sway, 'walk'), ['idle', ['sway']])
  assert.deepEqual(pick({ animations: {} }, 'walk'), ['idle', []], 'no clips: the rest pose')
  const once = { animations: { pop: { once: true, duration: 1, tracks: {} }, zz: loop() } }
  assert.deepEqual(pick(once, 'idle'), ['idle', ['zz']], 'the fallback prefers a looping clip')
})

test('a look rebuilt mid-state resumes it: the first set honours `since`', () => {
  const c = makeRigController(MODEL)
  c.set('die', 10, { since: 5 })
  near(c.layers(10)[0].st, 1.2, 1e-9, 'the fall is already over: clamped at its end, not replayed')
  const d = makeRigController(MODEL)
  d.set('idle', 10, { since: 4 }); d.set('walk', 11, { since: 0 })
  near(d.layers(11.1).find((l) => l.clip === 'breathe').time, 5.1, 1e-9, 'since applies only to the first set')
})
