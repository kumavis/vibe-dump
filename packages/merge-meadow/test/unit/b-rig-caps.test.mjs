// Rig verbs on the agent surface (ARCHITECTURE §6.3): World defineModel / models /
// model / removeModel over a real CapTP loopback, the plain-data rule for them,
// the verb table entries the MCP server and CLI share, and (once track A's
// defineModel op is in) a bad model leaving the heads unchanged.
import 'ses/assert-shim.js'
import '@endo/eventual-send/shim.js'
import test from 'node:test'
import assert from 'node:assert/strict'
import { makeCapTP } from '@endo/captp'
import { Far, E } from '@endo/far'
import { Repo } from '@automerge/automerge-repo'
import { useModelsFake } from './b-rig-fakes.mjs'

const faked = useModelsFake() // only while src/doc/models.js is not there yet
const { makeWorldCaps, eventsFromPatches } = await import('../../src/agent/world-caps.js')
const realRead = await import('../../src/doc/read.js')
const { applyOps: realApplyOps, OP_NAMES } = await import('../../src/doc/ops.js')
const { seedDoc } = await import('../../src/doc/seed.js')
const { tools } = await import('../../agent/lib/tools.mjs')

function loopback (bootstrap) {
  let a, b
  const quiet = { onReject: () => {} }
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

const BASE = {
  extends: '', stride: 1, runSpeed: 4,
  nodes: [{ name: 'hips', shape: 'box', p: [0, 0.6, 0], children: [{ name: 'head', shape: 'box', p: [0, 0.2, 0.5] }, { name: 'tail', shape: 'cone', p: [0, 0, -0.5] }] }],
  animations: { gait: { loop: true, tracks: { 'hips.py': 'sin(phase*tau*2)*0.02' } } },
  controller: { states: { walk: ['gait'] }, blend: 0.15 },
  rev: 2,
}

test('plain-data rule: models/model/defineModel/removeModel return fresh copies and freeze nothing', async () => {
  const doc = {
    schema: 1, meta: { title: 'T' }, world: {}, entities: {}, presets: {}, components: {}, systems: {},
    models: { base4: BASE, pony: { extends: 'base4', nodes: [{ name: 'mane', shape: 'box' }], animations: { wag: { loop: true, tracks: { 'tail.ry': 'sin(t*8)*20' } } }, rev: 1 } },
  }
  const calls = []
  const fakeApply = (handle, ops) => { calls.push(ops); return { results: ops.map(() => true), inverse: [] } }
  const handle = { url: 'automerge:fake', doc: () => doc, heads: () => ['h1'] }
  const caps = makeWorldCaps(handle, { applyOps: fakeApply, read: realRead, watch: () => () => {} })
  const w = loopback(caps.world)
  const list = await E(w).models()
  assert.deepEqual(list.map((m) => m.name), ['base4', 'pony'])
  const pony = list.find((m) => m.name === 'pony')
  assert.equal(pony.extends, 'base4'); assert.equal(pony.rev, 1)
  assert.ok(pony.nodes.includes('hips') && pony.nodes.includes('mane'), 'nodes after extends resolution')
  assert.deepEqual(pony.clips, ['gait', 'wag'])
  const m = await E(w).model('pony')
  assert.ok(Array.isArray(m.nodes) && m.animations.gait && m.animations.wag)
  await assert.rejects(E(w).model('nope'), /no model nope/)
  const model = { nodes: [{ name: 'a', shape: 'box' }], animations: {} }
  assert.equal(await E(w).defineModel('mine', model), true)
  assert.equal(await E(w).removeModel('mine'), true)
  assert.deepEqual(calls.map((ops) => ops.map((o) => o.op)), [['defineModel'], ['removeModel']])
  assert.deepEqual(calls[0][0], { op: 'defineModel', name: 'mine', model })
  assert.deepEqual(calls[1][0], { op: 'removeModel', name: 'mine' })
  const v = await E(w).viewer()
  assert.deepEqual((await E(v).models()).map((x) => x.name), ['base4', 'pony'])
  assert.ok((await E(v).model('base4')).nodes)
  await assert.rejects(E(v).defineModel('x', {}), /defineModel/, 'WorldView has no write verbs')
  assert.deepEqual(frozenAnywhere(doc), [], 'doc.models was frozen')
  assert.deepEqual(frozenAnywhere(calls), [], 'ops handed to applyOps were frozen')
  caps.close()
})

test('eventsFromPatches reports a model change once per model', () => {
  const evts = eventsFromPatches([{ action: 'put', path: ['models', 'horse', 'nodes', 0, 'color'] }, { action: 'put', path: ['models', 'horse', 'rev'] }, { action: 'put', path: ['models', 'sheep'] }])
  assert.deepEqual(evts, [{ type: 'model-changed', name: 'horse' }, { type: 'model-changed', name: 'sheep' }])
})

test('verb table: define_model / models / model / remove_model call the World verbs', async () => {
  for (const n of ['define_model', 'models', 'model', 'remove_model']) assert.ok(tools[n], `missing tool ${n}`)
  assert.equal(tools.define_model.write, true); assert.equal(tools.remove_model.write, true)
  assert.ok(!tools.models.write && !tools.model.write)
  assert.deepEqual(Object.keys(tools.define_model.input).sort(), ['model', 'name'])
  assert.deepEqual(Object.keys(tools.model.input), ['name'])
  assert.match(tools.define_model.description, /extends/)
  assert.match(tools.replace.description, /rig/)
  assert.doesNotMatch(tools.replace.description, /critter/)
  const seen = []
  const w = Far('W', {
    defineModel: (name, model) => { seen.push(['defineModel', name, model]); return true },
    models: () => { seen.push(['models']); return [] },
    model: (name) => { seen.push(['model', name]); return { nodes: [] } },
    removeModel: (name) => { seen.push(['removeModel', name]); return true },
  })
  await tools.define_model.run(w, { name: 'm', model: { nodes: [] } })
  await tools.models.run(w, {})
  await tools.model.run(w, { name: 'm' })
  await tools.remove_model.run(w, { name: 'm' })
  assert.deepEqual(seen, [['defineModel', 'm', { nodes: [] }], ['models'], ['model', 'm'], ['removeModel', 'm']])
})

test('local mode, real ops: a model with a syntax error leaves heads unchanged; a good one lands, resolves and is removable', { skip: (faked || !OP_NAMES.includes('defineModel')) && 'track A\'s models.js / defineModel op are not in yet' }, async () => {
  const repo = new Repo({ network: [] })
  const handle = repo.create()
  handle.change((d) => seedDoc(d, { title: 'Rig Meadow' }))
  const caps = makeWorldCaps(handle, { applyOps: realApplyOps, read: realRead, mode: 'local' })
  const w = loopback(caps.world)
  const lib = (await E(w).models()).map((m) => m.name)
  for (const n of ['quadruped', 'biped']) assert.ok(lib.includes(n), `library has ${n}: ${lib}`)
  const heads = await E(w).heads()
  const { rev: _r, ...good } = BASE
  await assert.rejects(E(w).defineModel('wobbly', { ...good, animations: { gait: { loop: true, tracks: { 'hips.py': 'sin(phase*tau' } } } }), /SyntaxError|expression|invalid|\)/i)
  await assert.rejects(E(w).defineModel('wobbly', { ...good, animations: { gait: { loop: true, tracks: { 'nope.rx': '1' } } } }), /nope/)
  assert.deepEqual(await E(w).heads(), heads, 'a rejected model never reaches the doc')
  await E(w).defineModel('wobbly', good)
  assert.notDeepEqual(await E(w).heads(), heads)
  const row = (await E(w).models()).find((m) => m.name === 'wobbly')
  assert.deepEqual(row.clips, ['gait']); assert.ok(row.nodes.includes('tail'))
  const m = await E(w).model('wobbly')
  assert.equal(m.animations.gait.tracks['hips.py'], 'sin(phase*tau*2)*0.02', 'expressions come back as plain strings')
  const sheep = (await E(w).list({ tags: ['prey'] }))[0].id
  await E(E(w).get(sheep)).replace('representation', { kind: 'rig', model: 'wobbly' })
  assert.equal((await E(E(w).get(sheep)).get('representation')).model, 'wobbly')
  await E(w).removeModel('wobbly')
  assert.ok(!(await E(w).models()).some((x) => x.name === 'wobbly'))
  caps.close()
  await repo.shutdown()
})
