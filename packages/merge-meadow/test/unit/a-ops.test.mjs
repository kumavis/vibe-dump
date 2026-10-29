import test from 'node:test'
import assert from 'node:assert/strict'
import { seeded, empty, fork, heads, A } from './a-helpers.mjs'
import { applyOps, applyValidOps, validateOps, changeDoc, OP_NAMES } from '../../src/doc/ops.js'
import { entityData, hp, plain, systemData } from '../../src/doc/read.js'

const comp = (h, id, c) => entityData(h.doc(), id).components[c]

test('set merges fields: concurrent edits of different fields both survive', () => {
  const h = seeded()
  const { results: [id] } = applyOps(h, [{ op: 'spawn', name: 'Sheep', at: [1, 0, 2], components: { body: { speed: 5, radius: 0.5 } } }])
  const b = fork(h)
  applyOps(h, [{ op: 'set', id, component: 'body', patch: { speed: 7 } }])
  applyOps(b, [{ op: 'set', id, component: 'body', patch: { radius: 0.9 } }])
  h.merge(b)
  assert.deepEqual(comp(h, id, 'body'), { speed: 7, radius: 0.9 })
  // per-axis array writes merge too (two people nudging x and z)
  const c = fork(h)
  applyOps(h, [{ op: 'set', id, component: 'transform', patch: { p: [5, 0, 2] } }])
  applyOps(c, [{ op: 'set', id, component: 'transform', patch: { p: [1, 0, 9] } }])
  h.merge(c)
  assert.deepEqual(comp(h, id, 'transform').p, [5, 0, 9])
})

test('replace swaps identity: it wins over a concurrent field edit', () => {
  const h = seeded()
  const { results: [id] } = applyOps(h, [{ op: 'spawn', components: { representation: { kind: 'billboard', image: 'emoji:🐑', size: 1 } } }])
  const b = fork(h)
  applyOps(h, [{ op: 'replace', id, component: 'representation', data: { kind: 'primitive', shape: 'box', size: [1, 1, 1] } }])
  applyOps(b, [{ op: 'set', id, component: 'representation', patch: { size: 3 } }])
  h.merge(b)
  assert.deepEqual(comp(h, id, 'representation'), { kind: 'primitive', shape: 'box', size: [1, 1, 1] })
  assert.ok(h.doc().entities[id].components.representation.kind instanceof A.ImmutableString, 'enums are ImmutableString')
})

test('define deep-diffs: unchanged subtrees keep identity so concurrent edits inside them survive', () => {
  const h = seeded()
  const { results: [id] } = applyOps(h, [{ op: 'spawn', name: 'S', at: [1, 0, 2], components: { body: { speed: 7, radius: 0.9 }, representation: { kind: 'primitive', shape: 'box' } } }])
  const b = fork(h)
  const r = applyOps(h, [{ op: 'define', id, entity: { name: 'S', components: { body: { speed: 7, radius: 0.9 }, representation: { kind: 'primitive', shape: 'sphere' } } } }])
  assert.deepEqual(r.results[0].changed, ['components.representation.shape'])
  applyOps(b, [{ op: 'set', id, component: 'body', patch: { turn: 4 } }])
  h.merge(b)
  assert.equal(comp(h, id, 'body').turn, 4, 'define must not clobber a concurrent edit of a subtree it did not change')
  assert.equal(comp(h, id, 'representation').shape, 'sphere')
  assert.deepEqual(comp(h, id, 'transform').p, [1, 0, 2], 'define keeps the rest pose unless it names transform')
})

test('define keeps the hits ledger and stores null overrides', () => {
  const h = seeded()
  applyOps(h, [{ op: 'spawn', id: 's1', preset: 'sheep' }, { op: 'hit', id: 's1', hitId: 'p:1', amount: 10 }])
  applyOps(h, [{ op: 'define', id: 's1', entity: { components: { health: { max: 40 }, brain: null } } }])
  const d = entityData(h.doc(), 's1')
  assert.deepEqual(d.components.health, { max: 40, hits: { 'p:1': 10 } })
  assert.equal(d.components.brain, null)
  assert.equal(d.effective.brain, undefined, 'a null override removes the inherited component')
  assert.equal(hp(d.effective.health), 30)
})

test('validateOps rejects bad batches, lists every problem, and the doc is untouched', () => {
  const h = seeded()
  const before = heads(h)
  const bad = [
    { op: 'spawn', name: 'ok' },
    { op: 'set', id: 'nope', component: 'body', patch: { speed: 1 } },
    { op: 'set', id: '$0', component: 'body', patch: { speed: -3 } },
    { op: 'spawn', preset: 'wolf' },
    { op: 'spawn', components: { brain: { drives: { hunt: { act: 'eat', match: { tag: 'prey' } } } } } },
    { op: 'replace', id: '$0', component: 'representation', data: { kind: 'hologram' } },
    { op: 'addGroup', id: '$0', group: 'not a name' },
    { op: 'defineSystem', name: 's', source: 'function update() {}' },
    { op: 'teleport', id: '$0' },
    { op: 'hit', id: '$0', hitId: 'x:1', amount: Infinity },
    { op: 'setParent', id: '$0', parent: '$7' },
  ]
  let err
  assert.throws(() => applyOps(h, bad), (e) => { err = e; return e instanceof TypeError })
  const msg = err.message
  for (const frag of ['no entity nope', 'body.speed: -3 < minimum 0', 'no preset wolf', 'act: must be one of', 'unknown filter key "tag"', 'representation.kind: must be one of', 'bad group name', 'export default', 'unknown op', 'amount must be', 'must refer to an earlier spawn']) {
    assert.ok(msg.includes(frag), `expected "${frag}" in:\n${msg}`)
  }
  assert.ok(err.problems.length >= 11)
  assert.deepEqual(heads(h), before, 'heads unchanged after a rejected batch')
  assert.doesNotThrow(() => validateOps(h.doc(), [{ op: 'spawn', preset: 'sheep' }]))
  // validateOps must not mutate
  const snap = JSON.stringify(plain(h.doc()))
  try { validateOps(h.doc(), bad) } catch {}
  assert.equal(JSON.stringify(plain(h.doc())), snap)
})

test('$n refers to an earlier spawn; ops see the batch so far', () => {
  const h = seeded()
  const r = applyOps(h, [
    { op: 'definePreset', name: 'wolf', preset: { extends: 'creature', components: { tags: { predator: true } } } },
    { op: 'spawn', preset: 'wolf', name: 'Wolf' },
    { op: 'spawn', id: 'cub', preset: 'wolf', parent: '$1' },
    { op: 'set', id: '$1', component: 'tags', patch: { alpha: true } },
    { op: 'addGroup', id: 'cub', group: 'sleepy' },
  ])
  const wolf = r.results[1]
  assert.match(wolf, /^wolf-[a-z0-9]{5}$/)
  assert.equal(entityData(h.doc(), 'cub').parent, wolf)
  assert.deepEqual(entityData(h.doc(), wolf).effective.tags, { creature: true, predator: true, alpha: true })
  assert.deepEqual(entityData(h.doc(), 'cub').groups, ['sleepy'])
  assert.throws(() => applyOps(h, [{ op: 'setParent', id: wolf, parent: 'cub' }]), /cycle/)
})

test('inverse ops undo a batch exactly', () => {
  const h = seeded()
  const before = JSON.stringify(plain(h.doc()))
  const r = applyOps(h, [
    { op: 'spawn', id: 'x', preset: 'sheep', at: [1, 2, 3] },
    { op: 'set', id: 'sheep-1', component: 'body', patch: { speed: 9, turn: 2 } },
    { op: 'replace', id: 'trex-1', component: 'representation', data: { kind: 'critter', rig: 'biped', length: 4 } },
    { op: 'remove', id: 'tree-1', component: 'transform' },
    { op: 'transform', id: 'rock-1', p: [0, 0, 0], s: [2, 2, 2] },
    { op: 'setName', id: 'lamp-1', name: 'Lantern' },
    { op: 'addGroup', id: 'sheep-2', group: 'dead' },
    { op: 'definePreset', name: 'sheep', preset: { extends: 'creature', components: { tags: { prey: true, fluffy: true } } } },
    { op: 'defineComponent', name: 'hunger', def: { description: 'h', order: 0, defaults: { rate: 1 }, schema: { type: 'object', properties: { rate: { type: 'number', minimum: 0 } } } } },
    { op: 'defineSystem', name: 'spin', source: 'export default { update () {} }' },
    { op: 'setWorld', patch: { bounds: 60, disabledSystems: { steer: true } } },
    { op: 'setMeta', patch: { title: 'Renamed' } },
    { op: 'despawn', id: 'horse-1' },
  ])
  assert.notEqual(JSON.stringify(plain(h.doc())), before)
  applyOps(h, r.inverse)
  assert.equal(JSON.stringify(sortKeys(plain(h.doc()))), JSON.stringify(sortKeys(JSON.parse(before))))
})

function sortKeys (v) {
  if (Array.isArray(v)) return v.map(sortKeys)
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, sortKeys(v[k])]))
  return v
}

test('hits ledger: a hit id counts once, repeated or concurrent; distinct hits sum', () => {
  const h = seeded()
  applyOps(h, [{ op: 'hit', id: 'sheep-1', hitId: 'peerA:1', amount: 12 }])
  const after1 = heads(h)
  applyOps(h, [{ op: 'hit', id: 'sheep-1', hitId: 'peerA:1', amount: 12 }])
  assert.deepEqual(heads(h), after1, 'a repeated hit writes nothing')
  // a partition: both sides write the same hit, and each a different one
  const p = fork(h); const q = fork(h)
  applyOps(p, [{ op: 'hit', id: 'sheep-1', hitId: 'peerA:2', amount: 5 }, { op: 'hit', id: 'sheep-1', hitId: 'peerB:1', amount: 3 }])
  applyOps(q, [{ op: 'hit', id: 'sheep-1', hitId: 'peerA:2', amount: 5 }, { op: 'hit', id: 'sheep-1', hitId: 'peerC:1', amount: 4 }])
  p.merge(q)
  const e = entityData(p.doc(), 'sheep-1').effective
  assert.deepEqual(Object.keys(e.health.hits).sort(), ['peerA:1', 'peerA:2', 'peerB:1', 'peerC:1'])
  assert.equal(hp(e.health), 30 - 12 - 5 - 3 - 4)
  // armor applies per hit and hp clamps at 0
  assert.equal(hp({ max: 10, armor: 2, hits: { a: 1, b: 5 } }), 7)
  assert.equal(hp({ max: 10, hits: { a: 50 } }), 0)
})

test('pin / unpin are conditional on the current owner', () => {
  const h = seeded()
  assert.deepEqual(applyOps(h, [{ op: 'pin', id: 'sheep-1', owner: 'p_a', ifOwner: '' }]).results, [true])
  assert.deepEqual(applyOps(h, [{ op: 'pin', id: 'sheep-1', owner: 'p_b', ifOwner: '' }]).results, [false], 'grab refused while held')
  assert.equal(entityData(h.doc(), 'sheep-1').owner, 'p_a')
  assert.deepEqual(applyOps(h, [{ op: 'unpin', id: 'sheep-1', ifOwner: 'p_b' }]).results, [false])
  assert.deepEqual(applyOps(h, [{ op: 'transform', id: 'sheep-1', p: [3, 0, 3] }, { op: 'unpin', id: 'sheep-1', ifOwner: 'p_a' }]).results, [true, true])
  assert.equal(entityData(h.doc(), 'sheep-1').owner, '')
})

test('inbox: push keys events by id, drain deletes them; concurrent pushes both land', () => {
  const h = seeded()
  applyOps(h, [{ op: 'push', id: 'sheep-1', event: { id: 'ev-1', type: 'move', from: 'p_a', p: [1, 0, 1] } }])
  const b = fork(h)
  applyOps(h, [{ op: 'push', id: 'sheep-1', event: { type: 'push', v: [1, 0] } }])
  applyOps(b, [{ op: 'push', id: 'sheep-1', event: { id: 'ev-2', type: 'tame', from: 'p_b' } }])
  h.merge(b)
  const box = entityData(h.doc(), 'sheep-1').inbox
  assert.equal(Object.keys(box).length, 3)
  assert.deepEqual(box['ev-1'], { type: 'move', from: 'p_a', p: [1, 0, 1] })
  applyOps(h, [{ op: 'drain', id: 'sheep-1', eventIds: ['ev-1', 'ev-2', 'missing'] }])
  assert.equal(Object.keys(entityData(h.doc(), 'sheep-1').inbox).length, 1)
})

test('defineSystem stores Text; a redefine is a text diff that merges with a concurrent edit', () => {
  const h = empty()
  applyOps(h, [{ op: 'defineSystem', name: 'bob', source: 'export default {\n  update (w) { const a = 1 }\n}\n' }])
  const b = fork(h)
  applyOps(h, [{ op: 'defineSystem', name: 'bob', source: 'export default {\n  update (w) { const a = 2 }\n}\n' }])
  applyOps(b, [{ op: 'setSystem', name: 'bob', patch: { source: 'export default {\n  update (w) { const a = 1 }\n}\n// note\n', enabled: false } }])
  h.merge(b)
  const s = systemData(h.doc(), 'bob')
  assert.equal(s.source, 'export default {\n  update (w) { const a = 2 }\n}\n// note\n', 'character-level merge of two edits')
  assert.equal(s.enabled, false)
  assert.equal(typeof h.doc().systems.bob.source, 'string')
  assert.ok(s.rev >= 2)
})

test('checkSource runs before the change: a syntax error leaves heads unchanged', () => {
  const h = empty()
  const before = heads(h)
  const checkSource = (src) => { if (src.includes('(((')) throw new SyntaxError('Unexpected token') }
  assert.throws(() => applyOps(h, [{ op: 'defineSystem', name: 'bad', source: 'export default { update ((( }' }], { checkSource }), /SyntaxError: Unexpected token/)
  assert.deepEqual(heads(h), before)
  applyOps(h, [{ op: 'defineSystem', name: 'good', source: 'export default { update () {} }', order: 450 }], { checkSource })
  assert.equal(systemData(h.doc(), 'good').order, 450)
})

test('setWorld merges, null deletes; an empty batch is not a change', () => {
  const h = seeded()
  applyOps(h, [{ op: 'setWorld', patch: { disabledSystems: { steer: true, attack: true } } }])
  applyOps(h, [{ op: 'setWorld', patch: { disabledSystems: { steer: null } } }])
  assert.deepEqual(plain(h.doc().world.disabledSystems), { attack: true })
  const before = heads(h)
  assert.deepEqual(applyOps(h, []), { results: [], inverse: [] })
  assert.deepEqual(heads(h), before)
  assert.throws(() => applyOps(h, [{ op: 'setWorld', patch: { bounds: 1 } }]), /bounds/)
})

test('changeDoc works on a bare Automerge doc (Node fallback path) and every op name is handled', () => {
  let d = A.from({})
  d = A.change(d, (x) => { changeDoc(x, [{ op: 'spawn', id: 'a', components: { tags: { t: true } } }, { op: 'checkpoint', id: 'a', p: [1, 2, 3], yaw: 90 }]) })
  assert.deepEqual(plain(d.entities.a.components.transform), { p: [1, 2, 3], r: [0, 90, 0], s: [1, 1, 1] })
  assert.equal(OP_NAMES.length, 26)
})

test('validateOps with a kinds registry accepts any registered representation kind (open registry)', async () => {
  const { validateOps } = await import('../../src/doc/ops.js')
  const { seedDoc } = await import('../../src/doc/seed.js')
  const { Repo } = await import('@automerge/automerge-repo')
  const repo = new Repo({ network: [] })
  const h = repo.create(); h.change((d) => seedDoc(d, { title: 't' }))
  const op = [{ op: 'spawn', components: { representation: { kind: 'blob', wobble: 2 } } }]
  assert.throws(() => validateOps(h.doc(), op), /representation/, 'without the registry the five built-ins are the enum')
  const kinds = { billboard: {}, primitive: {}, tree: {}, model: {}, critter: {}, blob: { schema: { type: 'object', properties: { wobble: { type: 'number', minimum: 0, maximum: 5 } } } } }
  assert.doesNotThrow(() => validateOps(h.doc(), op, { kinds }), 'a registered kind validates')
  assert.throws(() => validateOps(h.doc(), [{ op: 'spawn', components: { representation: { kind: 'blob', wobble: 9 } } }], { kinds }), /wobble/, 'and its own schema still applies')
  assert.throws(() => validateOps(h.doc(), [{ op: 'spawn', components: { representation: { kind: 'nope' } } }], { kinds }), /representation/, 'an unregistered kind is still refused')
  await repo.shutdown()
})

test('first concurrent writes to an inherited component merge (own maps at spawn and seed)', () => {
  const h = seeded()
  applyOps(h, [{ op: 'spawn', id: 'new-sheep', preset: 'sheep', at: [0, 0, 0] }])
  for (const id of ['sheep-1', 'new-sheep']) {
    const b = fork(h)
    applyOps(h, [{ op: 'hit', id, hitId: 'pA:1', amount: 5 }])
    applyOps(b, [{ op: 'hit', id, hitId: 'pB:1', amount: 7 }])
    h.merge(b)
    assert.deepEqual(comp(h, id, 'health').hits, { 'pA:1': 5, 'pB:1': 7 }, `${id}: both concurrent hits survive`)
    const c = fork(h)
    applyOps(h, [{ op: 'set', id, component: 'body', patch: { speed: 8 } }])
    applyOps(c, [{ op: 'set', id, component: 'body', patch: { radius: 2 } }])
    h.merge(c)
    assert.deepEqual(comp(h, id, 'body'), { speed: 8, radius: 2 }, `${id}: both first field edits survive`)
    // an inspector edit of max races the host's first hit: both land
    const e = fork(h)
    applyOps(h, [{ op: 'set', id, component: 'health', patch: { max: 99 } }])
    applyOps(e, [{ op: 'hit', id, hitId: 'pF:1', amount: 1 }])
    h.merge(e)
    assert.equal(comp(h, id, 'health').max, 99); assert.equal(comp(h, id, 'health').hits['pF:1'], 1)
  }
  // the empty own maps override nothing and keep the preset's object identity
  const d = h.doc()
  assert.equal(entityData(d, 'sheep-2').effective.brain.drives.flee.act, 'flee')
  // a merge target whose inherited component goes away does not become an empty component
  applyOps(h, [{ op: 'definePreset', name: 'sheep', preset: { extends: 'creature', components: { tags: { prey: true } }, groups: {} } }])
  applyOps(h, [{ op: 'definePreset', name: 'creature', preset: { extends: '', components: { tags: { creature: true } } } }])
  const eff = entityData(h.doc(), 'sheep-3').effective
  assert.equal(eff.brain, undefined, 'a hollow brain is not a brain'); assert.equal(eff.body, undefined)
  // ... but an empty component added on purpose is kept
  applyOps(h, [{ op: 'set', id: 'sheep-3', component: 'flying', patch: {} }])
  assert.deepEqual(entityData(h.doc(), 'sheep-3').effective.flying, {})
})

test('applyValidOps: one bad op drops only itself, not the tick batch', () => {
  const h = seeded()
  applyOps(h, [{ op: 'push', id: 'sheep-1', event: { id: 'ev1', type: 'move', p: [1, 0, 1] } }])
  const out = applyValidOps(h, [
    { op: 'hit', id: 'sheep-1', hitId: 'pA:1', amount: 5 },
    { op: 'drain', id: 'sheep-1', eventIds: ['ev1'] },
    { op: 'spawn', preset: 'wolf' }, // no such preset
    { op: 'setParent', id: '$2', parent: 'tree-1' }, // refers to the dropped spawn
    { op: 'spawn', id: 'lamb', preset: 'sheep', at: [0, 0, 0] },
    { op: 'addGroup', id: '$4', group: 'scared!' }, // bad group name
    { op: 'addGroup', id: '$4', group: 'calm' }, // $4 renumbered to the kept spawn
    { op: 'addGroup', id: 'sheep-2', group: 'dead' },
  ], { message: 'tick' })
  assert.deepEqual(out.dropped.map((d) => d.index), [2, 3, 5])
  assert.match(out.dropped[0].error, /no preset wolf/)
  assert.match(out.dropped[1].error, /dropped/)
  assert.match(out.dropped[2].error, /bad group name/)
  const d = h.doc()
  assert.equal(comp(h, 'sheep-1', 'health').hits['pA:1'], 5)
  assert.deepEqual(Object.keys(entityData(d, 'sheep-1').inbox), [], 'the drain landed')
  assert.deepEqual(entityData(d, 'lamb').groups, ['calm'])
  assert.ok(entityData(d, 'sheep-2').groups.includes('dead'))
  // a valid batch goes through untouched
  assert.deepEqual(applyValidOps(h, [{ op: 'hit', id: 'sheep-1', hitId: 'pA:2', amount: 1 }]).dropped, [])
})

test('on reactions must name groups', () => {
  const h = seeded()
  assert.throws(() => applyOps(h, [{ op: 'set', id: 'sheep-1', component: 'on', patch: { hurt: { add: ['scared!'] } } }]), /bad group name/)
  assert.throws(() => applyOps(h, [{ op: 'spawn', components: { on: { died: { remove: [3] } } } }]), /bad group name/)
  assert.doesNotThrow(() => applyOps(h, [{ op: 'set', id: 'sheep-1', component: 'on', patch: { hurt: { add: ['scared'] } } }]))
})

test('validation: replace enforces required fields; a spawn with a parent counts in the cycle check', () => {
  const h = seeded()
  assert.throws(() => applyOps(h, [{ op: 'replace', id: 'sheep-1', component: 'representation', data: { image: 'emoji:🐑' } }]), /kind: required/)
  assert.throws(() => applyOps(h, [{ op: 'spawn', id: 'kid', parent: 'tree-1' }, { op: 'setParent', id: 'tree-1', parent: 'kid' }]), /cycle/)
})
