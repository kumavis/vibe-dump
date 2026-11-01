// Track L: the recent-worlds list (design §18.1, ARCHITECTURE §7)
import test from 'node:test'
import assert from 'node:assert/strict'
import { recentWorlds, RECENT_KEY, RECENT_MAX, cleanEntry } from '../../src/net/recent.js'
import { DEFAULT_SYNC } from '../../src/net/link.js'

const D = (n) => `automerge:${'2' + String(n).replace(/0/g, 'z').padStart(8, 'A')}` // base58-safe ids
function fakeStorage (init = {}) {
  const m = new Map(Object.entries(init))
  return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => { m.set(k, String(v)) }, removeItem: (k) => { m.delete(k) } }
}
const clock = (t0 = 1000) => { let t = t0; return { now: () => t, tick: (d = 1) => { t += d } } }

test('recent: newest first, upsert dedupes by doc and keeps a stored key, touch never creates', () => {
  const s = fakeStorage(); const c = clock()
  const r = recentWorlds(s, { now: c.now })
  assert.deepEqual(r.list(), [])
  r.upsert({ docUrl: D(1), key: 'k1', sync: DEFAULT_SYNC, title: 'One' }); c.tick()
  r.upsert({ docUrl: D(2), key: 'k2', title: 'Two' }); c.tick()
  assert.deepEqual(r.list().map((e) => e.title), ['Two', 'One'])
  // re-open One through a view link: it moves to the top, one entry, the key stays
  const e = r.upsert({ docUrl: D(1), key: '', view: 'v1' }); c.tick()
  assert.equal(e.key, 'k1'); assert.equal(e.view, 'v1'); assert.equal(e.title, 'One', 'no title given keeps the stored one')
  assert.deepEqual(r.list().map((x) => x.docUrl), [D(1), D(2)])
  // a bare id normalises to the same doc
  r.upsert({ docUrl: D(2).slice(10), title: 'Two again' })
  assert.equal(r.list().length, 2); assert.equal(r.list()[0].title, 'Two again')
  // touch: title + time of an existing entry; an unknown doc is not created
  c.tick(); const t = r.touch(D(1), { title: 'Renamed' })
  assert.equal(t.title, 'Renamed'); assert.equal(r.list()[0].docUrl, D(1))
  assert.equal(r.touch(D(9), { title: 'nope' }), null)
  assert.equal(r.list().length, 2)
  // what is stored is plain JSON under mm:worlds
  const raw = JSON.parse(s.m.get(RECENT_KEY))
  assert.ok(Array.isArray(raw)); assert.deepEqual(Object.keys(raw[0]).sort(), ['at', 'docUrl', 'key', 'sync', 'title', 'view'])
  assert.equal(raw[0].sync, DEFAULT_SYNC)
})

test('recent: capped at 50, forget drops one entry, clear drops the list; junk is refused', () => {
  const s = fakeStorage(); const c = clock()
  const r = recentWorlds(s, { now: c.now })
  for (let i = 1; i <= 60; i++) { r.upsert({ docUrl: D(i), title: `w${i}` }); c.tick() }
  const l = r.list()
  assert.equal(l.length, RECENT_MAX); assert.equal(RECENT_MAX, 50)
  assert.equal(l[0].title, 'w60'); assert.equal(l.at(-1).title, 'w11')
  assert.equal(r.forget(D(60)), true)
  assert.equal(r.forget(D(60)), false, 'forgetting twice is a no-op')
  assert.equal(r.list()[0].title, 'w59'); assert.equal(r.list().length, 49)
  assert.equal(r.upsert({ docUrl: 'not a doc!', title: 'x' }), null)
  assert.equal(r.upsert({}), null)
  assert.equal(r.clear(), true); assert.deepEqual(r.list(), [])
  assert.equal(s.m.has(RECENT_KEY), false)
})

test('recent: corrupt or hostile storage contents read as clean entries or nothing', () => {
  const titles = 'x'.repeat(5000)
  const s = fakeStorage({ [RECENT_KEY]: JSON.stringify([{ docUrl: D(1), title: titles, at: 5, key: 7 }, { docUrl: 'javascript:alert(1)' }, null, 'str', { docUrl: D(1), at: 9 }, { docUrl: D(2), at: 'soon' }]) })
  const r = recentWorlds(s)
  const l = r.list()
  assert.deepEqual(l.map((e) => e.docUrl), [D(1), D(2)], 'dedupe keeps the first, invalid docs are dropped')
  assert.equal(l[0].title.length, 200); assert.equal(l[0].key, '7'); assert.equal(l[1].at, 0)
  assert.deepEqual(recentWorlds(fakeStorage({ [RECENT_KEY]: '{not json' })).list(), [])
  assert.deepEqual(recentWorlds(fakeStorage({ [RECENT_KEY]: '{"a":1}' })).list(), [])
  assert.equal(cleanEntry({ docUrl: '' }), null)
})

test('recent: a storage that throws (private window, blocked site data, quota) never throws', () => {
  const boom = { getItem () { throw new Error('SecurityError') }, setItem () { throw new Error('QuotaExceeded') }, removeItem () { throw new Error('nope') } }
  const r = recentWorlds(boom)
  assert.deepEqual(r.list(), [])
  assert.equal(r.upsert({ docUrl: D(1), title: 'x' }), null)
  assert.equal(r.touch(D(1), { title: 'y' }), null)
  assert.equal(r.forget(D(1)), false)
  assert.equal(r.clear(), false)
  // read works, write fails: the list stays what it was
  const ro = { getItem: () => JSON.stringify([{ docUrl: D(3), title: 'kept', at: 1 }]), setItem () { throw new Error('quota') }, removeItem () {} }
  const r2 = recentWorlds(ro)
  assert.equal(r2.upsert({ docUrl: D(4) }), null)
  assert.deepEqual(r2.list().map((e) => e.title), ['kept'])
  // no storage at all
  const r3 = recentWorlds(null)
  assert.deepEqual(r3.list(), []); assert.equal(r3.upsert({ docUrl: D(1) }), null)
})
