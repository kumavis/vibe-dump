// The rig renderer under SES lockdown (rule §2.11): three, the rig kind, the
// evaluator (expression closures) and the controller build and animate every
// library model with the intrinsics frozen. Its own process (node --test runs
// each file separately), so locking down here touches no other test.
import 'ses'
import test from 'node:test'
import assert from 'node:assert/strict'

lockdown({ overrideTaming: 'severe', errorTaming: 'unsafe', consoleTaming: 'unsafe' })

const { KINDS } = await import('../../src/render/kinds/index.js')
const { makeResources } = await import('../../src/render/resources.js')
const { MODEL_LIBRARY } = await import('../../src/doc/models.js')

test('under lockdown: every library model builds and animates through all states', () => {
  assert.ok(Object.isFrozen(Object.prototype))
  const res = makeResources({ document: null })
  const doc = { models: MODEL_LIBRARY }
  const ctx = { res, doc: () => doc }
  for (const name of Object.keys(MODEL_LIBRARY)) {
    const o = KINDS.rig.create({ kind: 'rig', model: name }, ctx)
    const v = { t: 0, st: 0, phase: 0, speed: 2, gait: 0.5, turn: 0.3, hp: 1, rand: 0.4, idx: 3 }
    for (const state of ['idle', 'walk', 'run', 'attack', 'sit', 'die', 'idle']) {
      v.st = 0
      for (let i = 0; i < 12; i++) { v.t += 0.05; v.st += 0.05; v.phase += 0.1; KINDS.rig.animate(o, state, null, 0.05, v) }
    }
    let bad = 0
    o.traverse((g) => { for (const x of [...g.position.toArray(), ...g.rotation.toArray().slice(0, 3), ...g.scale.toArray()]) if (!Number.isFinite(x)) bad++ })
    assert.equal(bad, 0, name + ': finite pose')
    res.releaseAll(o)
  }
  assert.equal(res.stats().keys, 0)
})
