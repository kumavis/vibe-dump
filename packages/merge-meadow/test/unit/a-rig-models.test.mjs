// Rig models (design §17.1, §17.3, ARCHITECTURE §6.1): the seed library, extends
// resolution, validation, representation keys.
import test from 'node:test'
import assert from 'node:assert/strict'
import {
  MODEL_LIBRARY, LIBRARY_ORDER, CHANNELS, LIMITS, resolveModel, resolveRepresentation, validateModel, ensureLibraryOps,
  nodeNames, dependentsOf, modelBody,
} from '../../src/doc/models.js'
import { compileExpr } from '../../src/doc/expr.js'

const clone = (v) => JSON.parse(JSON.stringify(v))
const library = () => Object.fromEntries(LIBRARY_ORDER.map((n) => [n, { ...clone(MODEL_LIBRARY[n]), rev: 1 }]))
const find = (nodes, name) => {
  for (const n of nodes ?? []) { if (n.name === name) return n; const c = find(n.children, name); if (c) return c }
  return null
}
const parentOf = (nodes, name, parent = null) => {
  for (const n of nodes ?? []) { if (n.name === name) return parent; const c = parentOf(n.children, name, n); if (c !== undefined) return c }
  return undefined
}

test('library: four bases and three species, plain frozen data', () => {
  assert.deepEqual(Object.keys(MODEL_LIBRARY).sort(), ['biped', 'bird', 'horse', 'quadruped', 'serpent', 'sheep', 'trex'])
  for (const b of ['quadruped', 'biped', 'serpent', 'bird']) assert.equal(MODEL_LIBRARY[b].extends, '', b)
  assert.equal(MODEL_LIBRARY.horse.extends, 'quadruped')
  assert.equal(MODEL_LIBRARY.sheep.extends, 'quadruped')
  assert.equal(MODEL_LIBRARY.trex.extends, 'biped')
  assert.ok(Object.isFrozen(MODEL_LIBRARY.horse.nodes[0]))
  assert.deepEqual(clone(MODEL_LIBRARY), MODEL_LIBRARY, 'JSON round-trips: no functions, no undefined')
  assert.ok(LIBRARY_ORDER.indexOf('quadruped') < LIBRARY_ORDER.indexOf('horse') && LIBRARY_ORDER.indexOf('biped') < LIBRARY_ORDER.indexOf('trex'))
})

test('library: every model validates, every track targets an existing node.channel, every expression compiles', () => {
  const lib = library()
  let keyframeTracks = 0; let exprTracks = 0
  for (const name of LIBRARY_ORDER) {
    assert.deepEqual(validateModel(MODEL_LIBRARY[name], lib, { name }), [], name)
    const r = resolveModel(lib, name)
    const names = new Set(nodeNames(r.nodes))
    assert.equal(names.size, nodeNames(r.nodes).length, `${name}: node names are unique`)
    assert.ok(names.size <= LIMITS.nodes)
    for (const clip of ['idle', 'walk', 'run', 'die']) assert.ok(r.animations[clip], `${name} has ${clip}`)
    assert.ok(r.controller.states.attack?.every((c) => r.animations[c]), `${name}: attack plays a clip it has`)
    for (const [clip, c] of Object.entries(r.animations)) {
      for (const [k, v] of Object.entries(c.tracks)) {
        const [node, ch] = k.split('.')
        assert.ok(names.has(node), `${name}.${clip}: ${k} targets node ${node}`)
        assert.ok(CHANNELS.includes(ch), `${name}.${clip}: ${k} channel`)
        if (typeof v === 'string') { exprTracks++; assert.ok(Number.isFinite(compileExpr(v)({ t: 1.3, st: 0.4, phase: 2.7, gait: 0.6, speed: 3 }))) } else { keyframeTracks++; assert.ok(v.every((kf, i) => i === 0 || kf[0] > v[i - 1][0]), `${name}.${clip}.${k} sorted`) }
      }
    }
    for (const [s, list] of Object.entries(r.controller.states)) for (const c of list) assert.ok(r.animations[c], `${name}: state ${s} -> ${c}`)
    const anchors = []
    const walk = (list) => { for (const n of list) { if (n.anchor) anchors.push(n.anchor); walk(n.children ?? []) } }
    walk(r.nodes)
    assert.ok(anchors.includes('head') && anchors.includes('seat'), `${name} anchors ${anchors}`)
    assert.ok(r.stride > 0 && r.runSpeed > 0)
  }
  assert.ok(exprTracks > 50 && keyframeTracks >= 10, `${exprTracks} expression tracks, ${keyframeTracks} keyframe tracks`)
})

test('resolveModel: nodes patch by name, new nodes nest under their stub, remove deletes a subtree', () => {
  const lib = library()
  const q = resolveModel(lib, 'quadruped')
  const h = resolveModel(lib, 'horse')
  assert.deepEqual(h.chain, ['quadruped', 'horse'])
  assert.equal(h.extends, 'quadruped')
  assert.deepEqual(h.revs, [1, 1])
  // patched in place: same position in the tree, fields overlaid, untouched fields kept
  assert.deepEqual(find(h.nodes, 'body').s, [0.55, 0.6, 1.5])
  assert.equal(find(h.nodes, 'body').shape, 'box', 'a field the patch did not name is kept')
  assert.equal(parentOf(h.nodes, 'body')?.name, 'root')
  assert.deepEqual(find(h.nodes, 'head').anchor, 'head')
  // species parts added under the base's bones
  assert.equal(parentOf(h.nodes, 'mane')?.name, 'neck')
  assert.equal(parentOf(h.nodes, 'ear_l')?.name, 'head')
  assert.equal(parentOf(h.nodes, 'hoof_fl')?.name, 'knee_fl')
  assert.equal(find(q.nodes, 'mane'), null, 'the base is not modified')
  assert.ok(nodeNames(h.nodes).length > nodeNames(q.nodes).length)
  // a direct patch, remove and null-a-field
  const models = { ...lib, stub: { extends: 'quadruped', nodes: [{ name: 'tail', remove: true }, { name: 'head_m', color: null, shape: 'sphere' }, { name: 'horn', shape: 'cone' }] } }
  const s = resolveModel(models, 'stub')
  assert.equal(find(s.nodes, 'tail'), null)
  assert.equal(find(s.nodes, 'tail_m'), null, 'remove takes the subtree')
  assert.equal(find(s.nodes, 'head_m').shape, 'sphere')
  assert.ok(!('color' in find(s.nodes, 'head_m')), 'null deletes a field')
  assert.ok(s.nodes.some((n) => n.name === 'horn'), 'an unknown name at the top level is a new root')
})

test('resolveModel: clips merge by name, tracks merge by key, null removes; controller shallow-merges', () => {
  const lib = library()
  const b = resolveModel(lib, 'biped')
  const t = resolveModel(lib, 'trex')
  assert.ok(t.animations.walk.tracks['leg_l.rx'], 'base tracks stay')
  assert.ok(t.animations.walk.tracks['tail.ry'], 'derived tracks join the base clip')
  assert.equal(t.animations.walk.tracks['arm_l.rx'], undefined, 'null removes a base track')
  assert.ok(b.animations.walk.tracks['arm_l.rx'])
  assert.ok(t.animations.bite && !b.animations.bite, 'a new clip')
  assert.equal(t.animations.die.duration, 1.3, 'clip fields overlay')
  assert.equal(t.animations.die.once, true, 'and the base clip fields stay')
  assert.deepEqual(t.controller.states.attack, ['bite'], 'controller states merge by state')
  assert.deepEqual(t.controller.states.walk, ['walk', 'breathe'])
  assert.equal(t.controller.blend, 0.15)
  assert.equal(resolveModel(lib, 'horse').controller.blend, 0.2, 'a controller field overrides')
  assert.equal(t.stride, 2.2); assert.equal(b.stride, 1.2)
  const models = { ...lib, x: { extends: 'biped', animations: { attack: null, breathe: { tracks: { 'chest.sy': null } } }, controller: { states: { attack: null } } } }
  const x = resolveModel(models, 'x')
  assert.equal(x.animations.attack, undefined, 'a null clip removes it')
  assert.deepEqual(x.animations.breathe.tracks, {})
  assert.equal(x.controller.states.attack, undefined)
  // normalised: loop/once filled, durations from keyframes, states as lists
  assert.equal(x.animations.walk.loop, true); assert.equal(x.animations.walk.once, false)
  assert.equal(resolveModel(lib, 'quadruped').animations.die.loop, false)
  const kf = resolveModel({ k: { nodes: [{ name: 'a' }], animations: { c: { tracks: { 'a.rx': [[0, 0], [2.5, 10]] } } } } }, 'k')
  assert.equal(kf.animations.c.duration, 2.5)
  assert.equal(resolveModel({ k: { nodes: [{ name: 'a' }], animations: { c: { tracks: { 'a.rx': 't' } } } } }, 'k').animations.c.duration, undefined)
})

test('resolveModel: missing model is null; cycles, missing bases and deep chains throw', () => {
  assert.equal(resolveModel({}, 'nope'), null)
  assert.throws(() => resolveModel({ a: { extends: 'b', nodes: [] }, b: { extends: 'a', nodes: [] } }, 'a'), /cycle a -> b -> a/)
  assert.throws(() => resolveModel({ a: { extends: 'a' } }, 'a'), /cycle/)
  assert.throws(() => resolveModel({ a: { extends: 'gone' } }, 'a'), /extends unknown model "gone"/)
  const chain = (n) => Object.fromEntries(Array.from({ length: n }, (_, i) => [`m${i}`, { extends: i ? `m${i - 1}` : '', nodes: [{ name: `n${i}` }] }]))
  const ok = chain(LIMITS.extendsDepth + 1) // m8 extends 8 deep
  assert.equal(nodeNames(resolveModel(ok, `m${LIMITS.extendsDepth}`).nodes).length, LIMITS.extendsDepth + 1)
  assert.throws(() => resolveModel(chain(LIMITS.extendsDepth + 2), `m${LIMITS.extendsDepth + 1}`), /deeper than 8/)
  assert.deepEqual(dependentsOf(library(), 'quadruped'), ['horse', 'sheep'])
  assert.deepEqual(dependentsOf(library(), 'horse'), [])
})

test('validateModel: track shapes (expression and keyframes), targets, names, limits', () => {
  const lib = library()
  const base = { nodes: [{ name: 'a', shape: 'box', children: [{ name: 'b', shape: 'sphere', p: [0, 1, 0] }] }] }
  const v = (m, name) => validateModel(m, lib, { name })
  assert.deepEqual(v({ ...base, animations: { c: { loop: true, tracks: { 'a.rx': 'sin(t)*10', 'b.sy': [[0, 1], [0.5, 1.2], [1, 1]] } } }, controller: { states: { idle: 'c', walk: ['c'] }, blend: 0.2 } }), [])
  const has = (m, re) => { const ps = v(m); assert.ok(ps.some((p) => re.test(p)), `${re} in ${JSON.stringify(ps)}`) }
  has({ ...base, animations: { c: { tracks: { 'a.rx': 'sin(q)' } } } }, /animations\.c\.tracks\["a\.rx"\]: unknown identifier 'q' at column 5/)
  has({ ...base, animations: { c: { tracks: { 'zz.rx': '1' } } } }, /no node named "zz"/)
  has({ ...base, animations: { c: { tracks: { 'a.qq': '1' } } } }, /channel one of rx, ry/)
  has({ ...base, animations: { c: { tracks: { 'a.rx': [[1, 0], [0.5, 1]] } } } }, /must increase/)
  has({ ...base, animations: { c: { tracks: { 'a.rx': [[0, 0], [0, 1]] } } } }, /must increase/)
  has({ ...base, animations: { c: { tracks: { 'a.rx': [] } } } }, /at least one/)
  has({ ...base, animations: { c: { tracks: { 'a.rx': [[0, 'x']] } } } }, /\[t \(s\), value\]/)
  has({ ...base, animations: { c: { tracks: { 'a.rx': [[-1, 0]] } } } }, />= 0/)
  has({ ...base, animations: { c: { tracks: { 'a.rx': 3 } } } }, /expression string or keyframes/)
  has({ ...base, animations: { c: { loop: 'yes', tracks: {} } } }, /loop: must be true or false/)
  has({ ...base, animations: { c: { speed: 2, tracks: {} } } }, /unknown clip field "speed"/)
  has({ ...base, animations: { 'bad name': { tracks: {} } } }, /bad clip name/)
  has({ ...base, controller: { states: { idle: 'nope' } } }, /controller\.states\.idle: no clip named "nope"/)
  has({ ...base, controller: { states: { idle: 3 } } }, /bad clip name/)
  has({ ...base, controller: { mode: 1 } }, /unknown field "mode"/)
  has({ nodes: [{ name: 'a' }, { name: 'a' }] }, /duplicate node name "a"/)
  has({ nodes: [{ name: 'a.b' }] }, /bad node name/)
  has({ nodes: [{ shape: 'teapot' }] }, /shape: must be one of box, sphere/)
  has({ nodes: [{ p: [0, 1] }] }, /p: must be \[x, y, z\]/)
  has({ nodes: [{ color: 'red' }] }, /colour/)
  has({ nodes: [{ roughness: 2 }] }, /roughness/)
  has({ nodes: [{ wobble: 1 }] }, /unknown node field "wobble"/)
  has({ nodes: [{ name: 'x', remove: true }] }, /only a model that extends another/)
  has({ nodes: 'x' }, /must be a list of nodes/)
  has({}, /needs nodes/)
  has({ ...base, stride: 0 }, /stride/)
  has({ ...base, extends: 'nope' }, /extends unknown model "nope"/)
  has({ ...base, extends: 'bad name' }, /extends: bad model name/)
  has({ ...base, colour: 1 }, /unknown model field "colour"/)
  assert.ok(validateModel({ extends: 'x', nodes: [] }, { x: { extends: 'y' }, y: { extends: 'x' } }, { name: 'z' }).some((p) => /cycle/.test(p)))
  assert.ok(validateModel({ extends: 'quadruped' }, lib, { name: 'quadruped' }).some((p) => /cycle/.test(p)), 'a model cannot extend itself')
  // derived: tracks may target base nodes, and must still target existing ones
  assert.deepEqual(v({ extends: 'quadruped', animations: { walk: { tracks: { 'tail.rz': 'sin(t)' } } } }, 'q2'), [])
  assert.ok(v({ extends: 'quadruped', nodes: [{ name: 'tail', remove: true }] }, 'q2').some((p) => /walk\.tracks\["tail\.ry"\]: no node named "tail"/.test(p)), 'removing a node a base clip animates is caught')
  assert.ok(v({ extends: 'quadruped', nodes: [{ name: 'brand_new', children: [{ name: 'head' }] }] }, 'q3').some((p) => /duplicate node name "head" after extends/.test(p)))
  // limits
  const many = { nodes: Array.from({ length: LIMITS.nodes + 1 }, (_, i) => ({ name: `n${i}` })) }
  assert.ok(v(many).some((p) => /201 nodes/.test(p)))
  let deep = { name: 'd9' }
  for (let i = 8; i >= 1; i--) deep = { name: `d${i}`, children: [deep] }
  assert.ok(v({ nodes: [deep] }).some((p) => /nested deeper than 8/.test(p)))
  const tracks = Object.fromEntries(Array.from({ length: LIMITS.tracks + 1 }, (_, i) => [`a.${CHANNELS[i % 9]}`, '1']).slice(0, 9))
  const clips = Object.fromEntries(Array.from({ length: 45 }, (_, i) => [`c${i}`, { tracks }]))
  assert.ok(v({ ...base, animations: clips }).some((p) => /405 tracks/.test(p)))
  // a resolved model (what modelData returns) is definable as is
  const r = resolveModel(lib, 'horse')
  assert.deepEqual(validateModel({ ...r, extends: '' }, lib, { name: 'pony' }), [])
  assert.deepEqual(Object.keys(modelBody(r)).sort(), ['animations', 'controller', 'description', 'extends', 'nodes', 'runSpeed', 'stride'])
  assert.deepEqual(validateModel('x'), ['model must be {extends?, stride?, runSpeed?, nodes, animations?, controller?}'])
})

test('resolveRepresentation: model reps key on the chain revisions, inline reps on a content hash', () => {
  const doc = { models: library() }
  const h = resolveRepresentation(doc, { kind: 'rig', model: 'horse', color: '#ff0000' })
  assert.equal(h.key, 'model:horse:1.1')
  assert.equal(h.model, 'horse')
  assert.deepEqual(h.chain, ['quadruped', 'horse'])
  assert.ok(find(h.nodes, 'mane') && h.animations.walk && h.controller.states.idle && h.stride === 1.8 && h.runSpeed === 7)
  assert.equal(resolveRepresentation(doc, { kind: 'rig', model: 'biped' }).key, 'model:biped:1')
  doc.models.quadruped.rev = 4
  assert.equal(resolveRepresentation(doc, { kind: 'rig', model: 'horse' }).key, 'model:horse:1.4', 'editing a base re-keys what extends it')
  assert.equal(resolveRepresentation(doc, { kind: 'rig', model: 'nope' }), null)
  assert.equal(resolveRepresentation({ models: { a: { extends: 'a' } } }, { kind: 'rig', model: 'a' }), null, 'a broken chain is null, never a throw')
  assert.equal(resolveRepresentation(doc, null), null)
  // inline: the tree kind's nodes
  const nodes = [{ shape: 'cylinder', p: [0, 1, 0], s: [0.35, 2, 0.35], color: '#7a5230' }]
  const a = resolveRepresentation(doc, { kind: 'tree', nodes })
  assert.match(a.key, /^inline:[0-9a-f]{8}$/)
  assert.equal(a.model, '')
  assert.deepEqual(a.animations, {})
  assert.deepEqual(a.controller, { states: {}, blend: 0.15 })
  assert.equal(a.stride, 1); assert.equal(a.runSpeed, 4)
  assert.equal(resolveRepresentation(doc, { kind: 'tree', nodes: [{ color: '#7a5230', s: [0.35, 2, 0.35], p: [0, 1, 0], shape: 'cylinder' }] }).key, a.key, 'key order does not matter')
  assert.equal(resolveRepresentation(doc, { kind: 'tree', nodes, tint: '#000000' }).key, a.key, 'look-wide fields are not part of the template')
  const anim = resolveRepresentation(doc, { kind: 'tree', nodes: [{ ...nodes[0], name: 'trunk' }], animations: { sway: { tracks: { 'trunk.rz': 'sin(t)*3' } } }, controller: { states: { idle: 'sway' } } })
  assert.notEqual(anim.key, a.key)
  assert.deepEqual(anim.controller.states.idle, ['sway'])
  assert.equal(anim.animations.sway.loop, true)
  // fresh copies every call
  const x = resolveRepresentation(doc, { kind: 'rig', model: 'horse' }); x.nodes.length = 0
  assert.ok(resolveRepresentation(doc, { kind: 'rig', model: 'horse' }).nodes.length > 0)
})

test('ensureLibraryOps: adds what is missing (bases first), never overwrites an edited model', () => {
  assert.deepEqual(ensureLibraryOps({}).map((o) => o.name), LIBRARY_ORDER)
  assert.deepEqual(ensureLibraryOps({ models: library() }), [])
  const edited = library(); edited.horse = { extends: 'quadruped', stride: 9, rev: 5 }; delete edited.sheep; delete edited.trex
  const ops = ensureLibraryOps({ models: edited })
  assert.deepEqual(ops.map((o) => [o.op, o.name]), [['defineModel', 'sheep'], ['defineModel', 'trex']])
  assert.equal(edited.horse.stride, 9)
  // a library model that would not validate against the doc's edited base is skipped, not forced
  // (this quadruped has a root `mane`, and the horse adds its own under a new neck: a duplicate name)
  const broken = { quadruped: { nodes: [{ name: 'mane', shape: 'box' }], rev: 2 } }
  assert.ok(validateModel(MODEL_LIBRARY.horse, broken, { name: 'horse' }).some((p) => /duplicate node name "mane"/.test(p)))
  const ops2 = ensureLibraryOps({ models: broken })
  assert.ok(!ops2.some((o) => o.name === 'horse'), 'the horse would not validate here')
  assert.ok(ops2.some((o) => o.name === 'sheep'), 'the sheep still does')
  assert.ok(ops2.some((o) => o.name === 'trex') && ops2.some((o) => o.name === 'biped'))
  ops[0].model.nodes.length = 0
  assert.ok(MODEL_LIBRARY.sheep.nodes.length > 0, 'ops carry copies')
})
