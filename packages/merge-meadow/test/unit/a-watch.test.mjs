import test from 'node:test'
import assert from 'node:assert/strict'
import { repo, seeded, fork, A } from './a-helpers.mjs'
import { watch } from '../../src/doc/watch.js'
import { applyOps } from '../../src/doc/ops.js'

const paths = (patches) => patches.map((p) => `${p.action} ${p.path.join('.')}`)

test('watch: immediate call with the whole doc as patches, then own-heads diffs', () => {
  const h = seeded()
  const seen = []
  const off = watch(h, (x) => seen.push(x))
  assert.equal(seen.length, 1)
  assert.equal(seen[0].initial, true)
  assert.ok(seen[0].patches.some((p) => p.path[0] === 'entities'))
  applyOps(h, [{ op: 'set', id: 'sheep-1', component: 'body', patch: { speed: 3 } }])
  assert.equal(seen.length, 2, 'one call per change (heads-changed and change are deduped)')
  assert.ok(paths(seen[1].patches).every((x) => x.startsWith('put entities.sheep-1.components.body')))
  assert.deepEqual(seen[1].heads, A.getHeads(h.doc()))
  off()
  applyOps(h, [{ op: 'despawn', id: 'sheep-1' }])
  assert.equal(seen.length, 2, 'unsubscribed')
})

test('watch: a throwing consumer is isolated and later diffs stay correct', () => {
  const h = seeded()
  const errors = []
  let n = 0
  const good = []
  // a throwing listener registered FIRST: automerge-repo's own emit would stop here
  watch(h, () => { if (++n === 2) throw new Error('boom') }, { onError: (e) => errors.push(e.message) })
  watch(h, ({ patches }) => good.push(paths(patches)))
  applyOps(h, [{ op: 'spawn', id: 'ghost', preset: 'sheep' }])
  applyOps(h, [{ op: 'despawn', id: 'ghost' }])
  assert.deepEqual(errors, ['boom'])
  assert.ok(good[1].includes('put entities.ghost'))
  assert.ok(good[2].includes('del entities.ghost'), 'the despawn is seen, not netted away')
})

test('watch: remote changes arrive as one diff; immediate:false skips the initial call', () => {
  const h = seeded()
  const b = fork(h)
  const seen = []
  watch(h, (x) => seen.push(x), { immediate: false })
  assert.equal(seen.length, 0)
  applyOps(b, [{ op: 'set', id: 'sheep-1', component: 'tags', patch: { fluffy: true } }, { op: 'addGroup', id: 'sheep-2', group: 'dead' }])
  h.merge(b)
  assert.equal(seen.length, 1)
  const got = paths(seen[0].patches)
  // seed entities own an empty tags map (presets.js withOwnMaps), so the field lands inside it
  assert.ok(got.some((p) => p.startsWith('put entities.sheep-1.components.tags')) && got.includes('put entities.sheep-2.groups.dead'), got.join(', '))
})

test('watch: delete is reported', () => {
  const h = repo.create({ a: 1 })
  const seen = []
  watch(h, (x) => seen.push(x))
  h.delete()
  assert.equal(seen.at(-1).deleted, true)
  assert.equal(seen.at(-1).doc, undefined)
})
