// world-caps over a real CapTP loopback. Part 1, the plain-data rule: a fake
// handle whose doc is ordinary mutable JS, a fake applyOps and host powers that
// return their INTERNAL objects — after calling every method, nothing handed to
// makeWorldCaps may have been frozen by marshal. Part 2: the real track-A ops,
// read and watch on a real Automerge handle.
import 'ses/assert-shim.js'
import '@endo/eventual-send/shim.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { makeCapTP } from '@endo/captp'
import { Far, E } from '@endo/far'
import { Repo } from '@automerge/automerge-repo'
import { makeWorldCaps, eventsFromPatches } from '../../src/agent/world-caps.js'
import * as realRead from '../../src/doc/read.js'
import { applyOps as realApplyOps } from '../../src/doc/ops.js'
import { seedDoc } from '../../src/doc/seed.js'
import { lowerForCheck } from '../../src/scripts/lower.js'
import { makeNodeCheckSource } from '../../agent/lib/connect.mjs'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// in-process CapTP pair: the guest gets the caps exactly as a remote agent would
function loopback (bootstrap) {
  let a, b
  const quiet = { onReject: () => {} } // expected rejections are asserted, not logged
  a = makeCapTP('host', (m) => b.dispatch(m), bootstrap, quiet)
  b = makeCapTP('guest', (m) => a.dispatch(m), undefined, quiet)
  return b.getBootstrap()
}

function frozenAnywhere (root, path = 'root', seen = new Set(), out = []) {
  if (root === null || typeof root !== 'object' || seen.has(root)) return out
  seen.add(root)
  if (Object.isFrozen(root)) out.push(path)
  for (const k of Object.keys(root)) frozenAnywhere(root[k], `${path}.${k}`, seen, out)
  return out
}

test('plain-data rule: every method, nothing passed in gets frozen', async () => {
  const doc = {
    schema: 1, meta: { title: 'T' }, world: { bounds: 40 },
    entities: { s1: { name: 'Sheep', parent: '', preset: '', owner: '', components: { transform: { p: [1, 2, 3] }, tags: { prey: true } }, groups: { calm: true }, inbox: {} },
      h1: { name: 'Horse', parent: '', preset: '', owner: '', components: { transform: { p: [0, 0, 0] } }, groups: {}, inbox: {} } },
    presets: {}, components: {}, systems: { wobble: { source: 'export default {}', order: 950, enabled: true, rev: 1 } },
  }
  const internalResult = { changed: ['entities.s1.components.tags'] }
  const calls = []
  const fakeApply = (handle, ops) => {
    calls.push(ops)
    for (const o of ops) if (o.op === 'spawn') doc.entities.n1 = { name: 'N', parent: '', preset: '', owner: '', components: {}, groups: {}, inbox: {} }
    return { results: ops.map((o) => (o.op === 'spawn' ? 'n1' : o.op === 'define' ? internalResult : true)), inverse: [] }
  }
  const watchers = new Set()
  const handle = { url: 'automerge:fake', doc: () => doc, heads: () => ['h1'] }
  const fakeWatch = (h, fn) => { watchers.add(fn); return () => watchers.delete(fn) }
  const hostState = { systems: [{ name: 'wobble', ok: true, lastError: null }], logs: ['a', 'b'], explain: { intent: { act: 'flee' } } }
  const host = {
    systems: () => hostState.systems,
    logs: () => hostState.logs,
    explain: () => hostState.explain,
    capture: () => 'data:image/jpeg;base64,AAAA',
    eval: async (src) => hostState, // hands back its whole internal state
  }
  const { world } = makeWorldCaps(handle, { applyOps: fakeApply, read: realRead, host, watch: fakeWatch })
  const w = loopback(world)

  const got = []
  const listener = Far('L', { onEvents: (evts) => { got.push(...evts) } })
  const results = {
    describe: await E(w).describe(),
    list: await E(w).list({ tags: ['prey'] }),
    getRow: await E(E(w).get('s1')).get(),
    getComp: await E(E(w).get('s1')).get('transform'),
    set: await E(E(w).get('s1')).set('transform', { p: [4, 5, 6] }),
    replace: await E(E(w).get('s1')).replace('tags', { prey: true }),
    remove: await E(E(w).get('s1')).remove('tags'),
    groups: await E(E(w).get('s1')).groups(),
    addGroup: await E(E(w).get('s1')).addGroup('dead'),
    removeGroup: await E(E(w).get('s1')).removeGroup('dead'),
    link: await E(E(w).get('s1')).link('rider', await E(w).get('h1'), { seat: 0 }),
    parent: await E(E(w).get('s1')).parent(await E(w).get('h1')),
    unparent: await E(E(w).get('s1')).parent(null),
    spawnId: await E(E(w).spawn({ preset: 'sheep', at: [1, 0, 1] })).id(),
    batch: await E(w).batch([{ op: 'set', id: await E(w).get('h1'), component: 'body', patch: { speed: 2 } }]),
    define: await E(w).define('s1', { components: { tags: { prey: true } } }),
    definePreset: await E(w).definePreset('wolf', { components: {} }),
    defineComponent: await E(w).defineComponent('glow', { schema: { type: 'object' } }),
    defineSystem: await E(w).defineSystem('wobble', { source: 'export default {}' }),
    setSystem: await E(w).setSystem('wobble', { enabled: false }),
    removeSystem: await E(w).removeSystem('wobble'),
    setWorld: await E(w).setWorld({ bounds: 30 }),
    systems: await E(w).systems(),
    explain: await E(w).explain('s1'),
    logs: await E(w).logs(10),
    capture: await E(w).capture({}),
    eval: await E(w).eval('return 1'),
    snapshot: await E(w).snapshot(),
    url: await E(w).url(),
    heads: await E(w).heads(),
    sub: await E(w).subscribe(listener, { types: ['entity-added'] }),
  }
  const v = await E(w).viewer()
  results.viewDescribe = await E(v).describe()
  results.viewList = await E(v).list({})
  results.viewGet = await E(E(v).get('s1')).get('transform')
  await assert.rejects(E(v).spawn({}), /spawn/, 'WorldView has no write verbs')
  // a patch-driven event reaches the subscriber, filtered
  for (const fn of watchers) fn({ patches: [{ action: 'put', path: ['entities', 'x9'] }, { action: 'put', path: ['entities', 's1', 'components', 'tags', 'prey'] }] })
  await sleep(20)
  assert.deepEqual(got, [{ type: 'entity-added', id: 'x9' }])
  await E(results.sub).cancel()
  assert.equal(watchers.size, 0, 'the last cancel closes the doc watch')
  await E(E(w).get('n1')).destroy()

  assert.deepEqual(frozenAnywhere(doc), [], 'doc objects were frozen')
  assert.deepEqual(frozenAnywhere(hostState), [], 'host power internals were frozen')
  assert.deepEqual(frozenAnywhere(internalResult), [], 'op results were frozen')
  assert.deepEqual(frozenAnywhere(calls), [], 'ops handed to applyOps were frozen (they must be fresh copies)')
  assert.equal(calls.find((ops) => ops[0].op === 'link' || (ops[0].op === 'replace' && ops[0].component === 'rider'))[0].data.mount, 'h1', 'handles resolve to ids')
  assert.equal(calls.find((ops) => ops[0].op === 'batch' || (ops[0].op === 'set' && ops[0].component === 'body'))[0].id, 'h1')
  assert.equal(results.describe.mode, 'live')
  assert.deepEqual([...results.describe.powers].sort(), ['capture', 'eval', 'explain', 'logs', 'systems'])
  assert.equal(results.list.length, 1)
  assert.deepEqual(results.getComp, { p: [1, 2, 3] })
})

test('negative control: the harness does detect a leak', async () => {
  const internal = { a: [1, 2], b: { c: 3 } }
  const leaky = loopback(Far('Leaky', { leak: () => internal }))
  await E(leaky).leak()
  assert.ok(frozenAnywhere(internal).length > 0, 'returning an internal object over CapTP freezes it')
})

test('local mode with the real ops/read/watch: spawn, list, set, events; host-only verbs reject; bad source leaves heads unchanged', async () => {
  const repo = new Repo({ network: [] })
  const handle = repo.create()
  handle.change((d) => seedDoc(d, { title: 'Test Meadow' }))
  const caps = makeWorldCaps(handle, { applyOps: realApplyOps, read: realRead, checkSource: makeNodeCheckSource(lowerForCheck), mode: 'local' })
  const w = loopback(caps.world)
  const events = []
  await E(w).subscribe(Far('L', { onEvents: (evts) => { events.push(...evts) } }), {})
  const before = (await E(w).list({ tags: ['prey'] })).length
  assert.ok(before >= 3, 'preset tags resolve through the effective components')
  const sheep = E(w).spawn({ preset: 'sheep', at: [3, 0, -5], name: 'Dolly' })
  const id = await E(sheep).id()
  assert.equal((await E(w).list({ tags: ['prey'] })).length, before + 1)
  await E(sheep).set('body', { speed: 7 })
  assert.equal((await E(sheep).get('body')).speed, 7)
  assert.deepEqual((await E(sheep).get('transform')).p, [3, 0, -5])
  await sleep(20)
  assert.ok(events.some((e) => e.type === 'entity-added' && e.id === id), JSON.stringify(events))
  assert.ok(events.some((e) => e.type === 'component-changed' && e.id === id && e.component === 'body'))
  const systems = await E(w).systems()
  assert.ok(systems.every((s) => s.status === 'unknown'))
  for (const verb of ['explain', 'capture', 'logs', 'eval']) await assert.rejects(E(w)[verb]('x'), /needs a live host page/)
  const heads = await E(w).heads()
  await assert.rejects(E(w).defineSystem('broken', { source: 'export default { update(world, dt) { oops( }' }), /SyntaxError|invalid/)
  assert.deepEqual(await E(w).heads(), heads, 'a rejected system never reaches the doc')
  await E(w).defineSystem('spin', { source: 'export default { update(world, dt) {} }' })
  assert.notDeepEqual(await E(w).heads(), heads)
  assert.ok((await E(w).describe()).systems.some((s) => s.name === 'spin'))
  caps.close()
  await repo.shutdown()
})

test('eventsFromPatches coalesces per entity/component and ignores the rest', () => {
  const evts = eventsFromPatches([
    { action: 'put', path: ['entities', 'a'] }, { action: 'put', path: ['entities', 'a', 'components', 'x'] },
    { action: 'splice', path: ['entities', 'b', 'components', 'tags', 'k'] }, { action: 'put', path: ['entities', 'b', 'components', 'tags', 'j'] },
    { action: 'put', path: ['entities', 'b', 'owner'] },
    { action: 'del', path: ['entities', 'c'] },
    { action: 'splice', path: ['systems', 's', 'source', 3] }, { action: 'put', path: ['presets', 'wolf'] }, { action: 'put', path: ['world', 'bounds'] },
  ])
  assert.deepEqual(evts, [
    { type: 'entity-added', id: 'a' },
    { type: 'component-changed', id: 'b', component: 'tags' },
    { type: 'entity-changed', id: 'b', field: 'owner' },
    { type: 'entity-removed', id: 'c' },
    { type: 'system-changed', name: 's' },
    { type: 'preset-changed', name: 'wolf' },
    { type: 'world-changed' },
  ])
})

test('agent moves of a simulated entity also push an inbox move; batches keep $n and result indices', async () => {
  const repo = new Repo({ network: [] })
  const handle = repo.create()
  handle.change((d) => seedDoc(d, { title: 'Moves' }))
  const caps = makeWorldCaps(handle, { applyOps: realApplyOps, read: realRead, mode: 'local' })
  const w = caps.world // local calls: Far objects are callable directly
  const sheep = w.spawn({ preset: 'sheep', at: [0, 0, 0] }).id()
  const rock = w.spawn({ preset: 'rock', at: [5, 0, 0] }).id()
  const moves = (id) => Object.values(handle.doc().entities[id].inbox ?? {}).filter((e) => String(e.type) === 'move')
  w.get(sheep).set('transform', { p: [4, 0, 4] })
  assert.equal(moves(sheep).length, 1, 'the sheep has a body: its owner gets an inbox move')
  assert.deepEqual([...moves(sheep)[0].p], [4, 0, 4])
  w.get(rock).set('transform', { p: [6, 0, 0] })
  assert.equal(moves(rock).length, 0, 'a static rock follows the doc transform: no inbox move')
  const r = w.batch([{ op: 'set', id: sheep, component: 'transform', patch: { p: [1, 0, 1] } }, { op: 'spawn', preset: 'sheep', at: [2, 0, 2] }, { op: 'set', id: '$1', component: 'body', patch: { speed: 3 } }])
  assert.equal(r.length, 3, 'results only for the ops the caller sent')
  assert.equal(Number(handle.doc().entities[r[1]].components.body.speed), 3, '$1 still names the spawn')
  assert.equal(moves(sheep).length, 2)
  w.batch([{ op: 'set', id: sheep, component: 'transform', patch: { p: [9, 0, 9] } }, { op: 'despawn', id: sheep }])
  assert.equal(handle.doc().entities[sheep], undefined, 'set + despawn in one batch: no push to a despawned id')
  caps.close()
  await repo.shutdown()
})
